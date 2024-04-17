import React, { useEffect, useState } from 'react';
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
        setReviews(data);
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
            <p>Arvostelija: {review.idaccount}</p>
            <p>MdbData: {review.mdbdata}</p>
            <p>Review: {review.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
