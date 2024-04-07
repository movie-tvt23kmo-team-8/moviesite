import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './movietrailer.css'; // Tuodaan CSS-tiedosto ulkoasun määrittelyä varten

function MovieTrailer() {
  // Tilamuuttujat trailerin tiedoille ja autoplay-tilalle
  const [trailerInfo, setTrailerInfo] = useState(null);
  const [autoplay, setAutoplay] = useState(true);

  // useEffect-koukku hakee elokuvatrailerin datan komponentin ladatessa
  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        // Haetaan elokuvatraileri Finnkinon API:sta
        const response = await fetch('https://www.finnkino.fi/xml/Events/');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const eventNodes = xmlDoc.getElementsByTagName('Event');

        // Suodatetaan tapahtumat EventType 'Movie' perusteella ja järjestetään dtLocalRelease:n mukaan laskevasti
        const movieEvents = Array.from(eventNodes)
          .filter(node => node.querySelector('EventType').textContent === 'Movie')
          .sort((a, b) => {
            const dateA = new Date(a.querySelector('dtLocalRelease').textContent);
            const dateB = new Date(b.querySelector('dtLocalRelease').textContent);
            return dateB - dateA; // Järjestetään laskevassa järjestyksessä
          });

        const today = new Date();

        // Etsitään ensimmäinen elokuvatapahtuma dtLocalRelease ennen tämän päivän päivämäärää
        const pastMovie = movieEvents.find(event => {
          const releaseDate = new Date(event.querySelector('dtLocalRelease').textContent);
          return releaseDate < today;
        });

        if (pastMovie) {
          // Poimitaan otsikko ja videon URL menneelle elokuvalle
          const title = pastMovie.querySelector('Title').textContent;
          const videos = pastMovie.getElementsByTagName('Videos')[0];
          if (videos) {
            const videoLocations = Array.from(videos.getElementsByTagName('Location')).map(node => node.textContent);
            // Valitaan ensimmäinen video videoLocations-taulukosta
            const selectedVideo = videoLocations[0];
            setTrailerInfo({ title, url: selectedVideo });
          } else {
            console.log('Ei traileria löydetty menneelle elokuvalle.');
          }
        } else {
          console.log('Ei menneitä elokuvatrailereita löydetty.');
        }
      } catch (error) {
        console.error('Virhe elokuvatrailerin hakemisessa:', error);
      }
    };

    fetchTrailer(); // Kutsutaan fetchTrailer-funktiota
  }, []); // Tyhjä riippuvuustaulukko varmistaa, että tämä vaikutus suoritetaan vain kerran komponentin ladattaessa

  // useEffect-koukku käsittelee autoplayta skrollaustilan perusteella
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setAutoplay(false); // Käyttäjä skrollaa alaspäin, pysäytä autoplay
      } else {
        setAutoplay(true); // Käyttäjä skrollaa ylöspäin, käynnistä autoplay
      }
    };

    // Lisää skrollitapahtuman kuuntelija komponentin ladattaessa
    window.addEventListener('scroll', handleScroll);

    // Poista skrollitapahtuman kuuntelija komponentin purkauduttaessa
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Tyhjä riippuvuustaulukko varmistaa, että tämä vaikutus suoritetaan vain kerran komponentin ladattaessa

  // Jos trailerInfo ei ole vielä saatavilla, näytä 'Loading...'
  if (!trailerInfo) {
    return <div>Lataa...</div>;
  }

  // Renderöi trailerivideo ja otsikko
  return (
    <div className="center-video"> {/* Käytä CSS-luokkaa keskittämiseen */}
      <h2>{trailerInfo.title}</h2> {/* Näytä elokuvan otsikko */}
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${trailerInfo.url}`}
        playing={autoplay} // Aseta autoplay skrollaustilan perusteella
        controls // Näytä videon hallintaelementit
        muted // Mykistä video, jotta autoplay on mahdollinen moderneissa selaimissa
        width="110%"
        height="100%"
      />
    </div>
  );
}

export default MovieTrailer;
