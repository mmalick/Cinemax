import React from 'react';
import MovieSection from '../components/Movie/MovieSection/MovieSection';

const HomePage: React.FC = () => {
  return (
    <div>
      <MovieSection title="Popularne filmy" category="popular" viewType="list"/>
      <MovieSection title="Nadchodzące premiery" category="upcoming" viewType="list"/>
    </div>
  );
};

export default HomePage;
