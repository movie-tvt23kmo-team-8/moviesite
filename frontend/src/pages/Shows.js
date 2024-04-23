import React, { useEffect, useState } from 'react'
import './shows.css'
import { jwtToken } from '../components/Signals';
import axios from 'axios';


export default function Shows() {

  const isLoggedIn = jwtToken.value.length !== 0;//tarkistetaan onko käyttäjä kirjautunut sisään
  const [userGroups, setUserGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  const fetchUserGroups = async () => {
    try {
      const jwtToken = sessionStorage.getItem('token');
      if (!jwtToken) {
        console.error('JWT token not found');
        return;
      }
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      };
      const response = await fetch(`http://localhost:3001/users/userGroups`, {
        method: 'GET',
        headers: headers
      });
      if (!response.ok) {
        console.error('Failed to fetch user groups');
        return null;
      }
      const data = await response.json();
      console.log(data)
      return data;
    } catch (err) {
      console.error('Error:', err.message); // Log error
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      const getUserGroups = async () => {
        const data = await fetchUserGroups();
        if (data && data.groups) {
          setUserGroups(data.groups);
        }
      };
      getUserGroups();
    }
  }, [isLoggedIn]);

  const add2GroupChoices = async (show) => {
    setSelectedGroup("Sk8OrDie");//kovakoodattuna, kunnes oikea set toimii
    const type = "show"
    const title = show.getElementsByTagName('Title')[0].textContent;
    const theatre = show.getElementsByTagName('TheatreAndAuditorium')[0].textContent;
    const showtime = parseroiShowtime(show.getElementsByTagName('dttmShowStart')[0].textContent);
    const image = show.getElementsByTagName('EventMediumImagePortrait')[0].textContent;//Small||Medium||Large
    const linkki = show.getElementsByTagName('ShowURL')[0].textContent;//kyseisen esityksen linkki

    //console.log("lisätään ryhmään: ", selectedGroup, title, theatre, showtime, image, linkki)
    console.log("lisätään ryhmään: Sk8OrDie", title, theatre, showtime, image, linkki)
    //console.log(selectedGroup, type);
    const postData = {
      idgroup: "Sk8OrDie",
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
            {isLoggedIn && (<i className="popupIcon-group showsicon-group fa-solid fa-users-rectangle" onClick={() => add2GroupChoices(shows[i])}></i>)}</div>
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