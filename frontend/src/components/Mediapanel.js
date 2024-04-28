import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PopupWindow from './Popupwindow';
import Box from '@mui/material/Box'; // Tuodaan MUI-kirjaston Box-komponentti
import Rating from '@mui/material/Rating'; // Tuodaan MUI-kirjaston Rating-komponentti
import './mediapanel.css';

const MediaPanel = ({ mediaType }) => { // Luodaan MediaPanel-komponentti ja annetaan sille propsina mediatyyppi
    const [mediaItems, setMediaItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); // Tilamuuttuja nykyiselle indeksille media-alkiolistassa
    const [isHovered, setIsHovered] = useState(false); // Tilamuuttuja hiiren osoittimen tilalle
    const [selectedMediaItem, setSelectedMediaItem] = useState(null); // State to store the selected media item

    useEffect(() => { // Effekti, joka käynnistyy kun mediatyyppi muuttuu
        const fetchMediaItems = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/tmdb/popular-${mediaType}`);
                setMediaItems(response.data);
            } catch (error) {
                console.error(`Error fetching popular ${mediaType}:`, error);
            }
        };

        fetchMediaItems();  // Kutsutaan funktiota heti komponentin latauksen yhteydessä
    }, [mediaType]);  // Riippuvuuslistana on mediatyyppi

    useEffect(() => {  // Effekti, joka käynnistyy kun media-alkiot tai hiiren tila muuttuvat
        const interval = setInterval(() => { // Asetetaan ajastin automaattista indeksin päivitystä varten
            if (!isHovered) { // Tarkistetaan, ettei hiiri ole kohdalla
                setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length); // Päivitetään indeksiä
            }
        }, 3000); // Asetetaan aikaväli indeksin päivitykselle (millisekunteina)

        return () => clearInterval(interval); // Poistetaan ajastin kun komponentti puretaan tai mediatyyppi muuttuu
    }, [mediaItems, isHovered]); // Riippuvuuslistana on media-alkiot ja hiiren tila

    const handleMouseEnter = () => { // Käsittelijä hiiren osoittimen tuloon alueelle
        setIsHovered(true);
    };

    const handleMouseLeave = () => { // Käsittelijä hiiren osoittimen poistumiseen alueelta
        setIsHovered(false);
    };

    // Laske kuvien määrä sivulla dynaamisesti näytön leveyden perusteella
    const calculateItemsPerPage = () => {
        const screenWidth = window.innerWidth;
        let itemsPerPage;
        if (screenWidth >= 1200) {
            itemsPerPage = 10;
        } else if (screenWidth >= 1000) {
            itemsPerPage = 8;
        } else if (screenWidth >= 800) {
            itemsPerPage = 6;
        } else if (screenWidth >= 400) {
            itemsPerPage = 4;
        } else {
            itemsPerPage = 2;
        }
        return itemsPerPage;
    };

    const itemsPerPage = calculateItemsPerPage();

    const getMediaIndex = (index) => { // Funktio, joka varmistaa, että indeksi pysyy media-alojen määrän sisällä
        const length = mediaItems.length;
        if (length === 0) return null; // Palautetaan 'null' jos media-alkiolista on tyhjä
        return index % length;  // Palautetaan oikea indeksi media-alkiolistasta
    };

    // käsittelee kuvan käsittelyn
    const handleMediaItemClick = (mediaItem) => {
        setSelectedMediaItem(mediaItem);
    };

    // Sulkee popup ikkunan
    const handleClosePopup = () => {
        setSelectedMediaItem(null);
    };

    return (
        <div className='container-media' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>  {/* Container-divi, joka reagoi hiiren tilaan */}
            <div className="poster-gallery">
                {[...Array(itemsPerPage).keys()].map((offset) => {  // Karttafunktio, joka luo media-alkiot näytettäväksi
                    const mediaIndex = getMediaIndex(currentIndex + offset);  // Haetaan oikea indeksi media-alkiolle
                    if (mediaIndex !== null) { // Tarkistetaan, että indeksi on kelvollinen
                        const mediaItem = mediaItems[mediaIndex]; // Haetaan media-alkio indeksillä

                        return (
                            <div key={mediaItem.id} className="media-container" onClick={() => handleMediaItemClick(mediaItem)}>
                                <div className="media-poster-container">
                                    <img className="media-poster" src={`https://image.tmdb.org/t/p/w500/${mediaItem.poster_path}`} alt={mediaItem.title} />
                                    <Box>
                                        <BasicRating value={mediaItem.vote_average / 2} />
                                    </Box>
                                    <div className="media-description">
                                        <h3 className="media-name">{mediaType === 'movie' ? mediaItem.title : mediaItem.original_name}</h3>
                                        <p className='media-overview'>{mediaItem.overview}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    return null;  // Palautetaan 'null', jos media-alkio on tyhjä
                })}
            </div>
            {/* Popup window component */}
            {selectedMediaItem && (
                <PopupWindow mediaItem={selectedMediaItem} onClose={handleClosePopup} />
            )}
        </div>
    );
};

const BasicRating = ({ value }) => {
    return (
        <div className='rating'>
            <Box
                sx={{
                    '& > legend': { mt: 2 },
                    '& .MuiRating-icon': { // Selecting the icon of the Rating component
                        fontSize: '1vw',  // Adjust the font size using viewport width units
                    },
                }}
            >
                <Rating className="read-only" value={value} readOnly />
            </Box>
        </div>
    );
};

export default MediaPanel;
