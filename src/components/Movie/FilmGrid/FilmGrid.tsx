import React from "react";
import FilmCard from "../FilmCard/FilmCard";
import "./FilmGrid.css";

interface Film {
  id: number;
  poster_path: string;
  title: string;
}

interface FilmGridProps {
  films: Film[];
  removeMovie?: (movieId: number) => void;
}

const FilmGrid: React.FC<FilmGridProps> = ({ films, removeMovie }) => {
  return (
    <div className="film-grid">
      {films.map((film) => (
        <div className="film-card-wrapper" key={film.id}>
          <FilmCard
            id={film.id}
            poster={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
            className="film-card-grid"
          />
          {removeMovie && (
            <button className="remove-movie-btn" onClick={() => removeMovie(film.id)}>  </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default FilmGrid;
