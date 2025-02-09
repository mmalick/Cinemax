import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import MovieSection from '../components/MovieSection/MovieSection';

const FilmsPage: React.FC = () => {
  return (
    <div className="films-page">
      <Navbar />
      <MovieSection title="Top Rated" category="top_rated" viewType="grid" showLoadMore={true} />
    </div>
  );
};

export default FilmsPage;
