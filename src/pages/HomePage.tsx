import React from 'react';
import FilmList from '../components/FilmList/FilmList';

const films = [
  { title: 'Gladiator', poster: '/images/gladiator.jpg', rating: 5 },
  { title: 'Inception', poster: '/inception.jpg', rating: 4 },
  { title: 'The Batman', poster: '/batman.jpg', rating: 4 },
  { title: 'Interstellar', poster: '/interstellar.jpg', rating: 5 },
  { title: 'ads', poster: '/interstellar.jpg', rating: 5 },
  { title: 'dasdxzc', poster: '/interstellar.jpg', rating: 5 },
  { title: 'ddddd', poster: '/interstellar.jpg', rating: 5 },
  { title: 'wwww', poster: '/interstellar.jpg', rating: 5 },
  { title: 'Gladiator', poster: '/images/gladiator.jpg', rating: 5 },
  { title: 'Inception', poster: '/inception.jpg', rating: 4 },
  { title: 'The Batman', poster: '/batman.jpg', rating: 4 },
  { title: 'Interstellar', poster: '/interstellar.jpg', rating: 5 },
  { title: 'ads', poster: '/interstellar.jpg', rating: 5 },
  { title: 'dasdxzc', poster: '/interstellar.jpg', rating: 5 },
  { title: 'ddddd', poster: '/interstellar.jpg', rating: 5 },
  { title: 'wwww', poster: '/interstellar.jpg', rating: 5 },

];

const HomePage = () => {
  return (
    <div>
      <FilmList films={films} title="Popular on Watch"  />
    </div>
  );
};

export default HomePage;
