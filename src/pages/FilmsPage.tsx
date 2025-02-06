import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Films from '../components/Films/Films';

const FilmsPage: React.FC = () => {
  return (
    <div className="films-page">
      <Navbar />
      <Films />
    </div>
  );
};

export default FilmsPage;
