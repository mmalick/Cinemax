import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MovieCast from "../components/Movie/MovieDetails/MovieCast";
import MovieRatings from "../components/Movie/MovieDetails/MovieRatings";
import "./MovieDetailsPage.css";

const API_BASE_URL = "http://127.0.0.1:8000/api/movies/";

interface StreamingProvider {
  name: string;
  logo: string;
}

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  streaming: StreamingProvider[];
}

interface MovieList {
  id: number;
  name: string;
}

export default function MovieDetailsPage() {
  const { id } = useParams<{ id?: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lists, setLists] = useState<MovieList[]>([]);
  const [newListName, setNewListName] = useState("");
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!id) return;

    const fetchMovieData = async () => {
      try {
        const [movieResponse, ratingResponse] = await Promise.all([
          fetch(`${API_BASE_URL}${id}/`),
          token
            ? fetch(`${API_BASE_URL}${id}/rate/`, {
                method: "GET",
                headers: { Authorization: `Token ${token}` },
              })
            : null,
        ]);

        if (!movieResponse.ok) throw new Error("Nie znaleziono filmu.");
        const movieData = await movieResponse.json();
        setMovie(movieData);

        if (ratingResponse && ratingResponse.ok) {
          const ratingData = await ratingResponse.json();
          setUserRating(ratingData.rating);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Wystąpił błąd.");
      }
    };

    fetchMovieData();
    fetchLists();
  }, [id, token]);

  const fetchLists = async () => {
    if (!token) {
      console.error("Brak tokena, użytkownik niezalogowany");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/lists/", {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Błąd API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setLists(data);
    } catch (error) {
      console.error("Błąd pobierania list:", error);
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddMovieToList = async () => {
    if (!token || !selectedListId || !movie?.id) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/lists/${selectedListId}/add/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movie_id: movie.id }),
        }
      );

      if (!response.ok) {
        throw new Error(`Błąd API: ${response.status} ${response.statusText}`);
      }

      showNotification(`Film "${movie.title}" dodany do listy!`);
    } catch (error) {
      console.error("Błąd dodawania filmu:", error);
    }
  };

  const createNewList = async () => {
    if (!token || !newListName.trim() || !movie?.id) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/lists/create/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newListName }),
      });

      if (response.ok) {
        const createdList = await response.json();
        setNewListName("");
        fetchLists();

        showNotification(`Lista "${createdList.name}" została utworzona!`);

        await fetch(`http://127.0.0.1:8000/api/lists/${createdList.id}/add/`, {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movie_id: movie.id }),
        });

        showNotification(`Film "${movie.title}" dodany do nowej listy!`);
      }
    } catch (error) {
      console.error("Błąd tworzenia listy:", error);
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!movie) return <p>Ładowanie...</p>;

  return (
    <div className="movie-details">
      {notification && <div className="notification">{notification}</div>}

      <div className="movie-left">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="movie-poster"
        />

        {movie.streaming?.length ? (
          <div className="streaming-section">
            <h3 className="streaming-title">Gdzie obejrzeć:</h3>
            <div className="streaming-list">
              {movie.streaming.map((provider) => (
                <div key={provider.name} className="streaming-provider">
                  <img src={provider.logo} alt={provider.name} />
                  <p>{provider.name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="no-streaming">Brak informacji o dostępności</p>
        )}

        {token && (
          <div className="list-management">
            <h3>Zarządzanie listami:</h3>
            <select
              onChange={(e) =>
                setSelectedListId(e.target.value ? Number(e.target.value) : null)
              }
              value={selectedListId ?? ""}
            >
              <option value="" disabled hidden>
                Wybierz listę
              </option>
              {lists
                .filter((list) => list.name !== "Ocenione Filmy")
                .map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
            </select>

            <button onClick={handleAddMovieToList} disabled={!selectedListId}>
              Dodaj do listy
            </button>

            <input
              type="text"
              placeholder="Nazwa nowej listy"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <button onClick={createNewList} disabled={!newListName.trim()}>
              Stwórz listę
            </button>
          </div>
        )}
      </div>

      <div className="movie-info">
        <h1>{movie.title}</h1>
        <p>{movie.overview}</p>
        <div className="rating">
          <p>Oceny TMDB: ⭐ {movie.vote_average.toFixed(1)} ({movie.vote_count} głosów)</p>
          {token ? <MovieRatings movieId={id ?? ""} initialRating={userRating} /> : (
            <p className="blocked-rating">Zaloguj się, aby ocenić ten film. <Link to="/login" className="login-link">Zaloguj się</Link></p>
          )}
        </div>
        <h2 className="movie-cast-title">Obsada</h2>
        <MovieCast movieId={id ?? ""} />
      </div>
    </div>
  );
}
