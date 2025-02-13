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
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [list, setList] = useState<MovieList | null>(null);
  const [movies, setMovies] = useState<Film[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      fetchListDetails(Number(id));
    } else {
      setError("Nieprawidłowe ID listy.");
      setLoading(false);
    }
  }, [id]);

  const fetchMovieDetails = async (movieId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${movieId}/`);
      if (!response.ok) throw new Error(`Błąd pobierania filmu ${movieId}`);

      const movieData = await response.json();
      return {
        ...movieData,
        poster_path: movieData.poster_path?.startsWith("http")
          ? movieData.poster_path
          : `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
      };
    } catch (error) {
      console.error(`Błąd pobierania filmu ${movieId}:`, error);
      return null;
    }
  };

  const fetchListDetails = async (listId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Musisz być zalogowany, aby zobaczyć tę listę.");
      setLoading(false);
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

      if (!response.ok) throw new Error(`Błąd ${response.status}`);

      const data: MovieList = await response.json();
      setList(data);

      const movieDetails = await Promise.all(
        data.movie_ids.map(fetchMovieDetails)
      );

      setMovies(movieDetails.filter((movie) => movie !== null));
    } catch (error) {
      console.error("Błąd pobierania listy:", error);
      setError("Nie udało się załadować listy.");
    } finally {
      setLoading(false);
    }
  };

  const removeMovie = async (movieId: number) => {
    const token = localStorage.getItem("token");
    if (!token || list?.name === "Ocenione Filmy") return;

    try {
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
      console.error("Błąd usuwania filmu:", err);
    }
  };

  const deleteList = async () => {
    if (!window.confirm("Na pewno chcesz usunąć tę listę?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
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
      console.error("Błąd usuwania listy:", err);
    }
  };

  return (
    <div className="list-details-page">
      {loading ? (
        <p className="loading-message">Ładowanie listy...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : list ? (
        <div className="list-container">
          <div className="list-header">
            <h1 className="list-title">{list.name}</h1>
            {!["Ocenione Filmy", "Do obejrzenia"].includes(list.name) && (
              <button className="delete-list-btn" onClick={deleteList}>Usuń listę</button>
            )}
          </div>

          {movies.length > 0 ? (
            <FilmGrid
              films={movies}
              removeMovie={list.name !== "Ocenione Filmy" ? removeMovie : undefined}
            />
          ) : (
            <p className="empty-list-message">Lista jest pusta</p>
          )}
        </div>
      ) : (
        <p>Nie znaleziono listy.</p>
      )}
    </div>
  );
};

export default ListDetailsPage;
