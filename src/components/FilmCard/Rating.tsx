import React from 'react';

interface RatingProps {
  rating: number;
}

const Rating: React.FC<RatingProps> = ({ rating }) => {
  const stars = Array(5).fill('☆').map((star, index) => 
    index < rating ? '★' : '☆'
  );

  return <div className="film-rating">{stars.join(' ')}</div>;
};

export default Rating;
