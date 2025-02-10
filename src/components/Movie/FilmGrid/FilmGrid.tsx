import React from 'react';
import FilmCard from '../FilmCard/FilmCard';
import './FilmGrid.css'; // Upewnij się, że importujesz plik CSS

interface Film {
  id: number;
  poster_path: string;
}

interface FilmGridProps {
  films: Film[];
}

const FilmGrid: React.FC<FilmGridProps> = ({ films }) => {
  return (
    <div className="film-grid">
      {films.map((film) => (
        <div className="film-card-wrapper" key={film.id}>
          <FilmCard
            id={film.id}
            poster={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
            className="film-card-grid"
          />
        </div>
      ))}
    </div>
  );
};

export default FilmGrid;
