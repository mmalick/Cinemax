import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieCast from "../components/Movie/MovieDetails/MovieCast";
import MovieRatings from "../components/Movie/MovieDetails/MovieRatings";

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
    const token = localStorage.getItem("token");
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
      console.log("Pobrane listy:", data); // Debugowanie list
      setLists(data);
    } catch (error) {
      console.error("Błąd pobierania list:", error);
    }
  };

  const handleAddMovieToList = async () => {
    const token = localStorage.getItem("token");

    console.log("Token:", token);
    console.log("Movie ID:", movie?.id);
    console.log("Selected List ID:", selectedListId);

    if (!token) {
      console.error("Brak tokena.");
      return;
    }
    if (!selectedListId || isNaN(selectedListId)) {
      console.error("Nie wybrano listy.");
      return;
    }
    if (!movie?.id) {
      console.error("Nie znaleziono filmu.");
      return;
    }

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
        const errorText = await response.text();
        throw new Error(
          `Błąd API: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      console.log(`Film ${movie.title} dodany do listy ${selectedListId}`);
    } catch (error) {
      console.error("Błąd dodawania filmu:", error);
    }
  };

  const createNewList = async () => {
    const token = localStorage.getItem("token");

    if (!token || !newListName.trim()) return;

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
        setNewListName("");
        fetchLists();
      }
    } catch (error) {
      console.error("Błąd tworzenia listy:", error);
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!movie) return <p>Ładowanie...</p>;

  return (
    <div className="movie-details">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="movie-poster"
      />
      <div className="movie-info">
        <h1>{movie.title}</h1>
        <p>{movie.overview}</p>
        <p className="rating">
          ⭐ {movie.vote_average.toFixed(1)} ({movie.vote_count} głosów)
        </p>

        {/* Streaming */}
        {movie.streaming?.length ? (
          <div className="streaming-section">
            <h3>Gdzie obejrzeć:</h3>
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
          <p>Brak informacji o dostępności</p>
        )}

        {/* Wybór listy */}
        <div className="add-to-list-section">
          <h3>Dodaj do listy:</h3>
          <select
            onChange={(e) => setSelectedListId(Number(e.target.value))}
            value={selectedListId ?? ""}
          >
            <option value="">Wybierz listę</option>
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddMovieToList} disabled={!selectedListId}>
            Dodaj do listy
          </button>
        </div>

        {/* Tworzenie nowej listy */}
        <div className="create-new-list-section">
          <h3>Lub stwórz nową listę:</h3>
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

        <MovieCast movieId={id ?? ""} />
        <MovieRatings
          movieId={id ?? ""}
          tmdbRating={movie.vote_average}
          tmdbVotes={movie.vote_count}
          initialRating={userRating}
        />
      </div>
    </div>
  );
}
