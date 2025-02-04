import React from 'react';
import './FilmCard.css';

interface FilmCardProps {
  title: string;
  poster: string;
  rating: number;
}

const FilmCard: React.FC<FilmCardProps> = ({ title, poster, rating }) => {
  return (
    <div className="film-card">
      <img src={poster} alt={title} draggable="false" />
      <h3>{title}</h3>
      <p>{"⭐".repeat(rating)}</p>
    </div>
  );
};

export default FilmCard;
