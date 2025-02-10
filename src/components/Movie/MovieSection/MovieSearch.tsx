import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MovieSearch.css";

const MovieSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Czyszczenie po zmianie strony
  useEffect(() => {
    setSearchQuery("");
    setSearchResults([]);
  }, [location]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/search-movies/?query=${query}`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Błąd pobierania wyników wyszukiwania:", error);
    }
  };

  const handleMovieClick = (movieId: number) => {
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="movie-search">
      <input
        type="text"
        placeholder="Szukaj filmów..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="search-input"
      />
      {searchResults.length > 0 && (
        <div className="search-results-container">
          <ul className="search-results">
            {searchResults.slice(0, 5).map((movie) => (
              <li key={movie.id} onClick={() => handleMovieClick(movie.id)}>
                <img src={`https://image.tmdb.org/t/p/w45${movie.poster_path}`} alt={movie.title} />
                {movie.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MovieSearch;
