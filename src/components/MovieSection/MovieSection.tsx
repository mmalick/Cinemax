import React, { useEffect, useState } from 'react';
import FilmList from '../FilmList/FilmList'; // Import FilmList
import FilmGrid from '../FilmGrid/FilmGrid'; // Import FilmGrid

interface MovieSelectionProps {
  title: string;
  category: 'popular' | 'upcoming' | 'top_rated';
  viewType: 'list' | 'grid'; // Dodajemy prop, który będzie kontrolować widok
}

const MovieSelection: React.FC<MovieSelectionProps> = ({ title, category, viewType }) => {
  const [films, setFilms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/movies/${category}/`);
      if (!response.ok) throw new Error('Błąd odpowiedzi z API');

      const data = await response.json();
      const filmsWithImages = data.results.map((film: any) => ({
        ...film,
        poster_url: `https://image.tmdb.org/t/p/w500${film.poster_path}`
      }));

      setFilms(filmsWithImages);
      setLoading(false);
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [category]);

  return loading ? <p>Ładowanie...</p> : (
    viewType === 'list' ? <FilmList films={films} /> : <FilmGrid films={films} />
  );
};

export default MovieSelection;
