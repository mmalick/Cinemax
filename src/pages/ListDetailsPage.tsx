import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const { id } = useParams<{ id?: string }>(); // 🔥 Obsługa ID jako string
  const navigate = useNavigate();
  const [list, setList] = useState<MovieList | null>(null);
  const [movies, setMovies] = useState<Film[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("🔍 Otrzymane ID z URL:", id);
    if (id) {
      fetchListDetails(Number(id));
    } else {
      setError("Nieprawidłowe ID listy.");
      setLoading(false);
    }
  }, [id]);

  const fetchMovieDetails = async (movieId: number) => {
    try {
      console.log(`ℹ️ Pobieranie filmu ${movieId}`);
      const response = await fetch(`${API_BASE_URL}/movies/${movieId}/`);
      if (!response.ok) throw new Error(`Błąd pobierania filmu ${movieId}`);

      const movieData = await response.json();
      console.log(`🎬 Odebrane dane filmu ${movieId}:`, movieData);

      return {
        ...movieData,
        poster_path: movieData.poster_path?.startsWith("http")
          ? movieData.poster_path
          : `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
      };
    } catch (error) {
      console.error(`🚨 Błąd pobierania filmu ${movieId}:`, error);
      return null;
    }
  };

  const fetchListDetails = async (listId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ Brak tokena, użytkownik niezalogowany");
      setError("Musisz być zalogowany, aby zobaczyć tę listę.");
      setLoading(false);
      return;
    }

    try {
      console.log(`🛰️ Pobieram listę z: ${API_BASE_URL}/lists/${listId}/`);
      const response = await fetch(`${API_BASE_URL}/lists/${listId}/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Błąd ${response.status}: ${errorText}`);
      }

      const data: MovieList = await response.json();
      console.log("📜 Odebrane dane listy:", data);

      if (!data.movie_ids || !Array.isArray(data.movie_ids)) {
        console.error("⚠️ Brak `movie_ids` w odpowiedzi API");
        setMovies([]);
        setLoading(false);
        return;
      }

      setList(data);

      const movieDetails = await Promise.all(
        data.movie_ids.map(fetchMovieDetails)
      );

      setMovies(movieDetails.filter((movie) => movie !== null));
    } catch (error) {
      console.error("❌ Błąd pobierania listy:", error);
      setError("Nie udało się załadować listy.");
    } finally {
      setLoading(false);
    }
  };

  const removeMovie = async (movieId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      console.log(`🗑️ Usuwam film ${movieId} z listy ${id}`);
      const response = await fetch(`${API_BASE_URL}/lists/${id}/remove/${movieId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Błąd ${response.status}`);

      setMovies(movies.filter((movie) => movie.id !== movieId));
    } catch (err) {
      console.error("🚨 Błąd usuwania filmu:", err);
    }
  };

  const deleteList = async () => {
    if (!window.confirm("Na pewno chcesz usunąć tę listę?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      console.log(`🗑️ Usuwam listę ${id}`);
      const response = await fetch(`${API_BASE_URL}/lists/${id}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Błąd ${response.status}`);

      navigate("/lists");
    } catch (err) {
      console.error("🚨 Błąd usuwania listy:", err);
    }
  };

  return (
    <div className="list-details-page">
      {loading ? (
        <p className="loading-message">Ładowanie listy...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : list ? (
        <>
          <h1>{list.name}</h1>
          <button className="delete-list-btn" onClick={deleteList}>Usuń listę</button>
          {movies.length > 0 ? (
  <FilmGrid films={movies} removeMovie={removeMovie} />  // 🔥 Tylko tutaj przekazujemy removeMovie
) : (
  <p>Brak filmów w tej liście.</p>
)}

        </>
      ) : (
        <p>Nie znaleziono listy.</p>
      )}
    </div>
  );
};

export default ListDetailsPage;
