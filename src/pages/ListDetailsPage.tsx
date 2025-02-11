import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FilmGrid from "../components/Movie/FilmGrid/FilmGrid";
import "./ListDetailsPage.css";

interface Film {
  id: number;
  poster_path: string;
  title: string;
  overview: string;
}

interface MovieList {
  id: number;
  name: string;
  movie_ids: number[];
}

const API_BASE_URL = "http://127.0.0.1:8000/api";

const ListDetailsPage = () => {
  const { id } = useParams<{ id: string }>(); // Pobieramy ID listy z URL
  const [list, setList] = useState<MovieList | null>(null);
  const [movies, setMovies] = useState<Film[]>([]); // Pełne dane filmów

  useEffect(() => {
    if (id) {
      fetchListDetails(Number(id));
    }
  }, [id]);

  const fetchMovieDetails = async (movieId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${movieId}/`);
      if (!response.ok) throw new Error(`Błąd pobierania filmu ${movieId}`);
  
      const movieData = await response.json();
      console.log(`ℹ️ Pobieranie filmu ${movieId}:`, movieData); // Debug
  
      return {
        ...movieData,
        poster_path: movieData.poster_path.startsWith("http")
          ? movieData.poster_path // ✅ Jeśli pełny URL, zostawiamy
          : `https://image.tmdb.org/t/p/w500${movieData.poster_path}`, // 🔧 Dodajemy prefix, jeśli brakuje
      };
    } catch (error) {
      console.error(`Błąd pobierania filmu ${movieId}:`, error);
      return null;
    }
  };
  

  const fetchListDetails = async (listId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ Brak tokena, użytkownik niezalogowany");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/lists/${listId}/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Błąd API: ${response.status} ${response.statusText}`);
      }

      const data: MovieList = await response.json();
      console.log("📜 Dane listy:", data); // Debug

      if (!data.movie_ids || !Array.isArray(data.movie_ids)) {
        console.error("⚠️ Brak `movie_ids` w odpowiedzi API");
        setMovies([]);
        return;
      }

      setList(data);

      // Pobranie szczegółów filmów i konwersja `poster_url` na `poster_path`
      const movieDetails = await Promise.all(
        data.movie_ids.map(fetchMovieDetails)
      );

      setMovies(movieDetails.filter((movie) => movie !== null));
    } catch (error) {
      console.error("❌ Błąd pobierania listy:", error);
    }
  };

  return (
    <div className="list-details-page">
      {list ? (
        <>
          <h1>{list.name}</h1>
          {movies.length > 0 ? (
            <FilmGrid films={movies} /> // ✅ Wyświetlamy poprawnie filmy
          ) : (
            <p>Brak filmów w tej liście.</p>
          )}
        </>
      ) : (
        <p>Ładowanie listy...</p>
      )}
    </div>
  );
};

export default ListDetailsPage;
