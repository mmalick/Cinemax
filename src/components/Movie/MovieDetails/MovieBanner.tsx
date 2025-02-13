import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000/api/movies/";

const MovieBanner: React.FC = () => {
  const [bannerMovie, setBannerMovie] = useState<any>(null);

  useEffect(() => {
    const fetchRandomMovie = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}popular/`);
        if (!response.ok) throw new Error("Błąd pobierania filmu");

        const data = await response.json();
        const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
        setBannerMovie(randomMovie);
      } catch (error) {
        console.error("Błąd pobierania losowego filmu:", error);
      }
    };

    fetchRandomMovie();
  }, []);

  if (!bannerMovie) return null;

  return (
    <div
      className="movie-banner"
      style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${bannerMovie.backdrop_path})` }}
    >
      <div className="banner-overlay">
        <h1 className="banner-title">Mighty Movie Tracker</h1>
      </div>
    </div>
  );
};

export default MovieBanner;
