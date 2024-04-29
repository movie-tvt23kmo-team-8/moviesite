import React, { useEffect, useState } from 'react'
import './shows.css'
import { jwtToken } from '../components/Signals';
import axios from 'axios';

export default function Shows() {
  const isLoggedIn = jwtToken.value.length !== 0;//tarkistetaan onko käyttäjä kirjautunut sisään
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [results, setResults] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [openPopupForMovie, setOpenPopupForMovie] = useState(null);
  let ryhma = "";

  const GroupPopup = ({ userGroups, onSelectGroup }) => (
    <div className="show-group-popup">
      {userGroups.map((group, index) => (
        <div key={index} className="group-option" onClick={() => onSelectGroup(group.groupname)}>
          {group.groupname}
        </div>
      ))}
    </div>
  );

  const handleTogglePopup = (movieId) => {
    setOpenPopupForMovie(openPopupForMovie === movieId ? null : movieId);
  };

  const handleSelectGroup = async (groupName, result) => {
    console.log("ryhmä valittu ryhmä on", groupName);
    setSelectedGroup(groupName);
    ryhma = groupName;
    setIsPopupOpen(false);
    await add2GroupChoices(result);
  };

  useEffect(() => {
    console.log("Selected group (effect):", selectedGroup);
  }, [selectedGroup]);

  const fetchUserGroups = async () => {
    console.log("haetaan käyttäjän ryhmiä");
    const jwtToken = sessionStorage.getItem('token');
    if (jwtToken) {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      };
      try {
        const response = await axios.get('http://localhost:3001/users/userGroups', { headers });
        const data = response.data;
        console.log("käyttäjän ryhmät", data.groups);
        setUserGroups(data.groups || []); // Jos ryhmiä ei ole, asetatetaan tyhjä lista
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    }
  };

  // Kun sivu ladataan, tarkistetaan onko käyttäjä kirjautunut
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserGroups(); // Jos käyttäjä on kirjautunut, haetaan ryhmät
    } else {
      haeNaytokset(); // Jos ei ole kirjautunut, haetaan näytökset heti
    }
  }, [isLoggedIn]);

  // Kun käyttäjän ryhmät on asetettu, haetaan näytökset
  useEffect(() => {
    if (isLoggedIn && userGroups.length > 0) {
      haeNaytokset();
    }
  }, [userGroups]);

  const add2GroupChoices = async (result) => {
    if (!ryhma) {
      console.error("No group selected");
      return;
    }
    console.log("lisätään ryhmään: ryhma: ", ryhma);
    
    const postData = {
      idgroup: ryhma,
      mediaType: "show",
      data: {
        title: result.title,
        theatre: result.theatre,
        showtime: result.showtime,
        image: result.image,
        linkki: result.linkki
      }
    };

    try {
      await axios.post('group/addToWatchlist', postData);
      console.log("Lisätty ryhmään:", postData);
    } catch (error) {
      console.error('Error when trying to add2group:', error);
    }
  };

  const setTodayDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0') // indeksi lähtee fiksusti nollasta...
    let yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    return today;
  }

  const date2Finkino = (date) => {
    let splittedDate = date.split('-');
    let finnkinoDate = splittedDate[2] + '.' + splittedDate[1] + '.' + splittedDate[0];
    return finnkinoDate;
  }

  const parseroiShowtime = (showTime) => {
    let parsittavaShowtime = showTime.split('T');//tulos on muodossa yyyy-mm-ddTHH:MM:SS
    let date = parsittavaShowtime[0].split('-');
    let time = parsittavaShowtime[1].split(':');
    let parsedShowtime = date[2] + '.' + date[1] + '.' + date[0] + ' klo ' + time[0] + ':' + time[1];//muotoillaan haluttuun muotoon (dd.mm.yyyy klo hh:mm)
    return parsedShowtime;
  }

  const haeNaytokset = async () => {
    //Haetaan XML-dokumentti ja käsitellään se
    //console.log("fetchin haku: https://www.finnkino.fi/xml/Schedule/?area=" + area + "&dt=" + date2Finkino(date))
    try {
      const response = await axios.get('https://www.finnkino.fi/xml/Schedule/?area=' + area + '&dt=' + date2Finkino(date))
      //console.log("Response: ", response.data);
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(response.data, 'text/xml');
      let shows = xmlDoc.getElementsByTagName('Show');
      let parsedShows = [];
      for (let i = 0; i < shows.length; i++) {
        const title = shows[i].getElementsByTagName('Title')[0].textContent;
        const showtime = parseroiShowtime(shows[i].getElementsByTagName('dttmShowStart')[0].textContent);
        const image = shows[i].getElementsByTagName('EventMediumImagePortrait')[0].textContent;
        const linkki = shows[i].getElementsByTagName('ShowURL')[0].textContent;
        const theatre = shows[i].getElementsByTagName('Theatre')[0].textContent;
        const id = i;
        parsedShows.push({ title, showtime, image, linkki, theatre, id });
      }
      setResults(parsedShows);
    } catch (error) {
      console.error('Error fetching shows:', error);
    }
  }


  const [area, setArea] = useState(1029);
  const [date, setDate] = useState(setTodayDate());
  useEffect(() => {
    haeNaytokset();
  }, [area, date]);

  return (
    <>
      <div id="show-container">
        <div id="otsikko"><h1>Finnkinon esitysajat</h1></div>
        <div className='hakualue'>
          <div id="alue">
            <h3>Mistä teatterista haetaan näytöstä?</h3>
            <select name="area" id="area" onChange={e => setArea(e.target.value)}>
              <option value="1029">Kaikki</option>
              <option value="1014">Pääkaupunkiseutu</option>
              <option value="1012">Espoo</option>
              <option value="1039">Espoo: OMENA</option>
              <option value="1038">Espoo: SELLO</option>
              <option value="1002">Helsinki</option>
              <option value="1045">Helsinki: ITIS</option>
              <option value="1031">Helsinki: KINOPALATSI</option>
              <option value="1032">Helsinki: MAXIM</option>
              <option value="1033">Helsinki: TENNISPALATSI</option>
              <option value="1013">Vantaa: FLAMINGO</option>
              <option value="1015">Jyväskylä: FANTASIA</option>
              <option value="1016">Kuopio: SCALA</option>
              <option value="1017">Lahti: KUVAPALATSI</option>
              <option value="1041">Lappeenranta: STRAND</option>
              <option value="1018">Oulu: PLAZA</option>
              <option value="1019">Pori: PROMENADI</option>
              <option value="1021">Tampere</option>
              <option value="1034">Tampere: CINE ATLAS</option>
              <option value="1035">Tampere: PLEVNA</option>
              <option value="1047">Turku ja Raisio</option>
              <option value="1022">Turku: KINOPALATSI</option>
              <option value="1046">Raisio: LUXE MYLLY</option>
            </select>
          </div>
          <div id="pvm">
            <h3>Minkä päivän esityksiä haetaan?</h3>
            <input type="date" id="dateInput" onChange={e => setDate(e.target.value)}></input>
          </div>
        </div>
        <div className="elokuvat-container">
          <div className='elokuvat-area'>
            <div className='elokuvat-areas'>
              {results.map((result, index) => (
                <div id="elokuvat" key={result.id}>
                  <div className='show-group-popup-area'>
                  <img className='show-image' src={result.image} alt={result.title} />
                    {isLoggedIn && (
                      <i
                        className="show-popupIcon-group fa-solid fa-users-rectangle"
                        onClick={() => handleTogglePopup(result.id)} // Pass movie ID to the handler
                      ></i>
                    )}
                    {openPopupForMovie === result.id && ( // Check if popup should be open for this movie
                      <GroupPopup userGroups={userGroups} onSelectGroup={(groupName) => handleSelectGroup(groupName, result)} />
                    )}
                  </div>
                  <p>{result.title}</p>
                  <p>Teatteri: {result.theatre}</p>
                  <p>Showtime: {result.showtime}</p>
                  <a className='buy-ticket' href={result.linkki} target="_blank">Osta liput!</a>                 
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}