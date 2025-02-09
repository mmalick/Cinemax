import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FilmCard.css';

interface FilmCardProps {
  id: number;
  poster: string;
  className?: string;
}

const FilmCard: React.FC<FilmCardProps> = ({ id, poster, className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className={`film-card ${className}`} onClick={handleClick}>
      <img src={poster} alt="Film poster" className="film-poster" />
    </div>
  );
};

export default FilmCard;
