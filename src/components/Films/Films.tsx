import React from 'react';
import FilmCard from '../FilmCard/FilmCard';
import './Films.css';

interface Film {
  id: number;
  poster: string;
}

const Films: React.FC = () => {
  const films: Film[] = [
    { id: 1, poster: 'https://path.to/poster1.jpg' },
    { id: 2, poster: 'https://path.to/poster2.jpg' },
    { id: 3, poster: 'https://path.to/poster3.jpg' },
    { id: 4, poster: 'https://path.to/poster1.jpg' },
    { id: 5, poster: 'https://path.to/poster2.jpg' },
    { id: 6, poster: 'https://path.to/poster3.jpg' },
    { id: 7, poster: 'https://path.to/poster1.jpg' },
    { id: 8, poster: 'https://path.to/poster2.jpg' },
    { id: 9, poster: 'https://path.to/poster3.jpg' },
    { id: 10, poster: 'https://path.to/poster1.jpg' },
    { id: 12, poster: 'https://path.to/poster2.jpg' },
    { id: 13, poster: 'https://path.to/poster3.jpg' },
    { id: 14, poster: 'https://path.to/poster1.jpg' },
    { id: 15, poster: 'https://path.to/poster2.jpg' },
    { id: 16, poster: 'https://path.to/poster3.jpg' },
    { id: 17, poster: 'https://path.to/poster1.jpg' },
    { id: 18, poster: 'https://path.to/poster2.jpg' },
    { id: 19, poster: 'https://path.to/poster3.jpg' },  
  ];

  return (
    <div className="films-container">
      {films.map((film) => (
        <FilmCard key={film.id} poster={film.poster} />
      ))}
    </div>
  );
};

export default Films;
