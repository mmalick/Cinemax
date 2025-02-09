import React from 'react';

interface MovieHeaderProps {
  title: string;
  year: string;
  director: string;
}

const MovieHeader: React.FC<MovieHeaderProps> = ({ title, year, director }) => {
  return (
    <div className="movie-header">
      <h1>{title} <span>({year})</span></h1>
      <p>Directed by <strong>{director}</strong></p>
    </div>
  );
};

export default MovieHeader;
