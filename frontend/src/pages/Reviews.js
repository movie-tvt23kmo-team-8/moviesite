import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './reviews.css';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:3001/review/allReviews');
        if (!response.ok) {
          throw new Error('Failed to fetch reviews from database');
        }
        const data = await response.json();

        // Haetaan TMDB:stä kullekin arvostelulle vastaava posterin osoite
        const reviewsWithPosters = await Promise.all(data.map(async (review) => {
          try {
            const tmdbResponse = await axios.get(`http://localhost:3001/tmdb/poster?id=${review.mdbdata}`);

            // Tarkistetaan, onko vastauksessa posterin URL
            if (tmdbResponse.data && tmdbResponse.data.poster_path) {
              return {
                ...review,
                posterUrl: tmdbResponse.data.poster_path,
                title: tmdbResponse.data.title || review.title // Käytä oletusotsikkoa, jos vastauksessa ei ole otsikkoa
              };
            } else {
              // Palautetaan alkuperäinen arvostelu ilman posterin osoitetta, jos haku epäonnistui
              return { ...review, title: review.title }; // Käytä alkuperäistä otsikkoa
            }
          } catch (error) {
            console.error('Failed to fetch poster from TMDB', error);
            return { ...review }; // Palauta alkuperäinen arvostelu virhetilanteessa
          }
        }));

        setReviews(reviewsWithPosters);
      } catch (error) {
        console.error('Failed to fetch reviews from database', error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className='review-container'>
      <h1>Reviews</h1>
      <div className='review-card'>
        {reviews.map((review, index) => (
          <div key={index}>
            <p>Arvostelija: {review.username}</p>
            <p>Elokuvan nimi: {review.title}</p>
            <p>Review: {review.review}</p>
            {review.posterUrl && <img src={`https://image.tmdb.org/t/p/original${review.posterUrl}`} alt="Movie Poster" />}
            <p>Tässä on linkki elokuvan posterinsivuille: https://image.tmdb.org/t/p/original${review.posterUrl}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
