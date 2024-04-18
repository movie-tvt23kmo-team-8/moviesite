import React, { useEffect, useState } from 'react'
import './shows.css'
import { jwtToken } from '../components/Signals';


export default function Shows() {

  const isLoggedIn = jwtToken.value.length !== 0;//tarkistetaan onko käyttäjä kirjautunut sisään
  /*//jos on, niin haetaan käyttäjän ryhmät
  let kayttajanRyhmat;
  if (isLoggedIn) {
    kayttajanRyhmat = haeKayttajanRyhmat();
  }*/

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
          <i className="popupIcon-heart showsicon-heart fa-solid fa-heart-circle-plus"></i>
              <i className="popupIcon-group showsicon-group fa-solid fa-users-rectangle"></i></div>
          let tekstiElementti = (
            <>
              <span className="title">{title}</span>
              <br />
              <span className="showtime">{"Näytösaika: " + parseroiShowtime(showtime)}</span>
            </>
          );
          let linkkiElementti = <a href={linkki} target="_blank">Osta liput</a>

          let elokuvaElementti = (
            <li key={id}>
              {kuvaElementti}
              <br />
              {tekstiElementti}
              <br />
              {linkkiElementti}
              <br />
              {/*Jos käyttäjä on kirjautuneen tulostellaan valikko mihin ryhmään jaetaan ja jakonappi*/}
              {isLoggedIn && (
                <>{/*
                  <select name=ryhmat id=ryhmat>
                    <option value="">Valitse ryhmä</option>
                    {kayttajanRyhmat.map((group) => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>*/}
                  <button onClick={() => lisaaRyhmanSivulle(shows[i])}>Jaa näytös ryhmään</button>
                </>
              )}
            </li>
          );

          elokuvat.push(elokuvaElementti);
        }
        setElokuvatLista(elokuvat);
      })
      .catch(error => console.error('Error:', error));

  }

  const lisaaRyhmanSivulle = (data) => {
    //tarkistetaan onhan ryhmä valittu
    /*const selectedGroup = document.getElementById('ryhmat').value;
    if (!selectedGroup) {
      console.error('Valitse ryhmä ennen lähettämistä');
      alert('Valitse ryhmä ennen lähettämistä');
      return;
    }*/

    console.log('Lisätään ryhmän sivulle:', data);

    const title = data.getElementsByTagName('Title')[0].textContent;
    const id = data.getElementsByTagName('ID')[0].textContent;
    const showtime = parseroiShowtime(data.getElementsByTagName('dttmShowStart')[0].textContent);
    const image = data.getElementsByTagName('EventSmallImagePortrait')[0].textContent;
    const linkki = data.getElementsByTagName('ShowURL')[0].textContent;
    const teatteri = data.getElementsByTagName('TheatreAndAuditorium')[0].textContent;
    alert(`Lisätään ryhmän sivulle: ${title}\n${teatteri}, ${showtime}\n${linkki}`);

    const formData = new FormData();
    formData.append('idgroup', '30');//kovakoodattuna kunnes oma tietokanta toimii tämän suhteen
    //formData.append('idgroup', selectedGroup);
    formData.append('data', JSON.stringify({ title, id, showtime, image, linkki, teatteri }));

    fetch('http://localhost:3001/group/addToWatchlist', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Lisätty ryhmän sivulle:', data);
        alert('lisätty ryhmän sivulle:', data)
      })
      .catch(error => {
        console.error('Virhe: ', error);
      })


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