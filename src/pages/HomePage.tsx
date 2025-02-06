import React, { useEffect, useState } from 'react';
import FilmList from '../components/FilmList/FilmList';

const HomePage: React.FC<{ title: string }> = ({ title }) => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      // Zaktualizuj URL do pełnej ścieżki API (jeśli twoje API działa na http://localhost:8000)
      const response = await fetch('http://localhost:8000/api/movies/popular/');

      // Sprawdź, czy odpowiedź jest poprawna
      if (!response.ok) {
        throw new Error('Błąd odpowiedzi z API');
      }

      // Przekształć odpowiedź na JSON
      const data = await response.json();

      // Dodaj pełny URL do obrazków
      const filmsWithFullImageUrl = data.results.map((film: any) => ({
        ...film,
        poster_url: `https://image.tmdb.org/t/p/w500${film.poster_path}` // Łączenie z bazą URL
      }));

      setFilms(filmsWithFullImageUrl); // Zaktualizuj stan
      setLoading(false); // Przestań ładować

    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div>
      {loading ? <p>Ładowanie...</p> : <FilmList films={films} title={title} />}
    </div>
  );
};

export default HomePage;
