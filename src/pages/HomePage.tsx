import React from 'react';
import FilmList from '../components/FilmList/FilmList';

const films = [
  { poster: '/images/gladiator.jpg' },
  { poster: '/images/inception.jpg' },
  { poster: '/images/batman.jpg' },
  { poster: '/images/interstellar.jpg' },
  { poster: '/images/prisoners.jpg' },
  { poster: '/images/deadpool.jpeg' },
];

interface HomePageProps {
  title: string;
}

const HomePage: React.FC<HomePageProps> = ({ title }) => {
  return (
    <div>
      <FilmList films={films} title={title} />
    </div>
  );
};

export default HomePage;
