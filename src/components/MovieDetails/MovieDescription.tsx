import React from 'react';

interface MovieDescriptionProps {
  description: string;
}

const MovieDescription: React.FC<MovieDescriptionProps> = ({ description }) => {
  return (
    <div className="movie-description">
      <p>{description}</p>
    </div>
  );
};

export default MovieDescription;
