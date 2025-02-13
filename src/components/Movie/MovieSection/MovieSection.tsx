import React, { useEffect, useState } from 'react';
import FilmList from '../FilmList/FilmList';
import FilmGrid from '../FilmGrid/FilmGrid';

interface MovieSelectionProps {
  title: string;
  category: 'popular' | 'upcoming' | 'top_rated' | 'now_playing';
  viewType: 'list' | 'grid';
  showLoadMore?: boolean;
}

const MovieSelection: React.FC<MovieSelectionProps> = ({ title, category, viewType, showLoadMore = false }) => {
  const [films, setFilms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = async (pageNum = 1) => {
    try {
      const response = await fetch(`http://localhost:8000/api/movies/${category}/?page=${pageNum}`);
      if (!response.ok) throw new Error('Błąd odpowiedzi z API');

      const data = await response.json();
      const filmsWithImages = data.results.map((film: any) => ({
        ...film,
        poster_url: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
      }));

      setFilms((prevFilms) => (pageNum === 1 ? filmsWithImages : [...prevFilms, ...filmsWithImages]));
      setHasMore(data.results.length > 0);
      setLoading(false);
    } catch (error) {
      console.error('Błąd podczas pobierania danych:', error);
    }
  };

  useEffect(() => {
    fetchMovies(1);
  }, [category]);

  const loadMoreMovies = () => {
    if (hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage);
    }
  };

  return (
    <div style={{ margin: "40px 0", padding: "20px", textAlign: "center" }}>
<h2
  style={{
    fontSize: "32px",
    color: "white",
    marginBottom: "25px",
    marginTop: "50px",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "2px",
    fontWeight: "bold",
    borderBottom: "3px solid rgba(255, 255, 255, 0.3)",
    display: "inline-block",
    paddingBottom: "5px",
  }}
>
  {title}
</h2>

      {loading ? <p>Ładowanie...</p> : viewType === 'list' ? <FilmList films={films} /> : <FilmGrid films={films} />}
      {showLoadMore && hasMore && (
        <button onClick={loadMoreMovies} className="load-more">
          Załaduj więcej
        </button>
      )}
    </div>
  );
};

export default MovieSelection;
