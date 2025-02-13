import React from 'react';

interface MoviePosterProps {
  posterUrl: string;
}

const MoviePoster: React.FC<MoviePosterProps> = ({ posterUrl }) => {
  return (
    <div className="movie-poster">
      <img src={posterUrl} alt="Movie Poster" />
    </div>
  );
};

export default MoviePoster;
