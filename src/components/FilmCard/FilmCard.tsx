import React from 'react';

interface FilmCardProps {
  poster: string; // Teraz to 'poster_url'
}

const FilmCard: React.FC<FilmCardProps> = ({ poster }) => {
  return (
    <div className="film-card">
      <img src={poster} alt="Film poster" style={{ width: '200px', height: '300px' }} />
    </div>
  );
};

export default FilmCard;
