import React, { useEffect, useState } from 'react'
import './shows.css'
import { jwtToken } from '../components/Signals';
import axios from 'axios';
import { MenuItem, Select } from '@mui/material';


export default function Shows() {

  const isLoggedIn = jwtToken.value.length !== 0;//tarkistetaan onko käyttäjä kirjautunut sisään
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  let ryhma = "";
  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
    ryhma=event.target.value;
    console.log("Selected group changed:", event.target.value);
    console.log("Ryhmä-muuttuja: ", ryhma);
  };

  useEffect(() => {
    console.log("Selected group (effect):", selectedGroup);
  }, [selectedGroup]);

  const fetchUserGroups = async () => {
    const jwtToken = sessionStorage.getItem('token');
    if (jwtToken) {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      };
      try {
        const response = await axios.get('http://localhost:3001/users/userGroups', { headers });
        const data = response.data;
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

  const handleAdd2Group = (show) => {
    console.log("Current group:", selectedGroup); // Tarkista arvo
    console.log("Current ryhma-muuttuja", ryhma);
    if (ryhma.trim() === "") {
      console.log("No group selected");
      return;
    }
    add2GroupChoices(show);
  };

  const add2GroupChoices = async (show) => {
    if (!ryhma) {
      console.error("No group selected");
      return;
    }
    const type = "show";
    const title = show.getElementsByTagName('Title')[0].textContent;
    const theatre = show.getElementsByTagName('TheatreAndAuditorium')[0].textContent;
    const showtime = parseroiShowtime(show.getElementsByTagName('dttmShowStart')[0].textContent);
    const image = show.getElementsByTagName('EventMediumImagePortrait')[0].textContent;//Small||Medium||Large
    const linkki = show.getElementsByTagName('ShowURL')[0].textContent;//kyseisen esityksen linkki

    console.log("lisätään ryhmään:", ryhma); // Varmista, että arvo on oikein
    setTimeout(() => {
        // tee toiminto pienen viiveen jälkeen
        console.log("lisätään ryhmään viiveellä:", selectedGroup);
    }, 100); // 100 ms viive
    //console.log("lisätään ryhmään: Sk8OrDie", title, theatre, showtime, image, linkki)
    //console.log(selectedGroup, type);
    const postData = {
      idgroup: ryhma,
      mediaType: type,
      data: {
        title,
        theatre,
        showtime,
        image,
        linkki
      },
    };
    try {
      await axios.post('group/addToWatchlist', postData);
      console.log("lisätty ryhmään:", postData);
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


  const haeNaytokset = () => {
    // Haetaan XML-dokumentti ja käsitellään se
    console.log("fetchin haku: https://www.finnkino.fi/xml/Schedule/?area=" + area + "&dt=" + date2Finkino(date))
    fetch('https://www.finnkino.fi/xml/Schedule/?area=' + area + '&dt=' + date2Finkino(date))
      .then(response => response.text())
      .then(data => {

        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, 'text/xml');

        //haetaan kaikki <Show> -elementit
        let shows = xmlDoc.getElementsByTagName('Show');

        //käydään läpi jokainen elementti ja lisätään halutut tiedot niistä listaan
        let elokuvat = [];
        for (let i = 0; i < shows.length; i++) {
          let title = shows[i].getElementsByTagName('Title')[0].textContent;
          let id = shows[i].getElementsByTagName('ID')[0].textContent;
          let showtime = shows[i].getElementsByTagName('dttmShowStart')[0].textContent;
          let image = shows[i].getElementsByTagName('EventMediumImagePortrait')[0].textContent;//Small||Medium||Large
          let linkki = shows[i].getElementsByTagName('ShowURL')[0].textContent;//kyseisen esityksen linkki
          //console.log("Title: "+title+" ID:"+id+" imageAdress: "+image +" ja linkki: "+linkki);

          let kuvaElementti = <div className='show-img'><img src={image} alt={title} />
            {isLoggedIn && (<>
              <Select value={selectedGroup} onChange={handleGroupChange}>
                <MenuItem value="testiryhmä">Valitse Ryhmä</MenuItem>
                {userGroups.map((group, index) => (
                  <MenuItem key={index} value={group.groupname}>{group.groupname}</MenuItem>
                ))}
              </Select>
              <i className="popupIcon-group showsicon-group fa-solid fa-users-rectangle" onClick={() => handleAdd2Group(shows[i])}></i></>)}</div>
          let tekstiElementti = (
            <>
              <span className="title">{title}</span>
              <br />
              <span className="showtime">{"Näytösaika: " + parseroiShowtime(showtime)}</span>
            </>
          );
          let linkkiElementti = <a href={linkki} target="_blank">Osta liput</a>

          let elokuvaElementti = (
            <li className='show-list' key={id}>
              {kuvaElementti}
              <br />
              {tekstiElementti}
              <br />
              {linkkiElementti}
            </li>
          );

          elokuvat.push(elokuvaElementti);
        }
        setElokuvatLista(elokuvat);
      })
      .catch(error => console.error('Error:', error));

  }


  const [area, setArea] = useState(1029);
  const [date, setDate] = useState(setTodayDate());
  const [elokuvatLista, setElokuvatLista] = useState([]);
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
            <div id="elokuvat">
              <ul id="elokuvatLista">{elokuvatLista}</ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}