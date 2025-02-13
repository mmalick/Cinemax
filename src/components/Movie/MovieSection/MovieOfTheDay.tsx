import React, { useEffect, useState } from "react";
import "./MovieOfTheDay.css"; // 🔥 Dodajemy style
import { Link } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

const MovieOfTheDay: React.FC = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieOfTheDay = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/movies/movie-of-the-day/");
        if (!response.ok) throw new Error("Błąd pobierania filmu dnia");

        const data = await response.json();
        setMovie(data);
        setLoading(false);
      } catch (error) {
        console.error("Błąd pobierania filmu dnia:", error);
        setLoading(false);
      }
    };

    fetchMovieOfTheDay();
  }, []);

  if (loading) return <p>Ładowanie filmu dnia...</p>;
  if (!movie) return <p>Nie udało się załadować filmu dnia.</p>;

  return (
    <div className="movie-of-the-day">
      <h2>Film dnia</h2>
      <h2>{movie.title}</h2>
      <Link to={`/movie/${movie.id}`}>
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      </Link>
      <p>{movie.overview}</p>
    </div>
  );
};

export default MovieOfTheDay;
