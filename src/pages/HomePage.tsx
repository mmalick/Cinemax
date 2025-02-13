import React from 'react';
import MovieSection from '../components/Movie/MovieSection/MovieSection';
import MovieBanner from "../components/Movie/MovieDetails/MovieBanner";
import MovieOfTheDay from "../components/Movie/MovieSection/MovieOfTheDay";
import "./HomePage.css";

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <MovieBanner />
      <MovieOfTheDay />
      <MovieSection title="Popularne filmy" category="popular" viewType="list"/>
      <MovieSection title="Nadchodzące premiery" category="upcoming" viewType="list"/>
      <MovieSection title="Teraz w kinach" category="now_playing" viewType="list"/>  {/* 🔥 Nowa sekcja */}
    </div>
  );
};

export default HomePage;
