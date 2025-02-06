import React from 'react';
import './FilmCard.css';

interface FilmCardProps {  poster: string;
  
}

const FilmCard: React.FC<FilmCardProps> = ({ poster }) => {
  return (
    <div className="film-card">
      <img src={poster}  draggable="false" />
    </div>
  );
};

export default FilmCard;
