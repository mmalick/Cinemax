import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ListsPage.css";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface MovieList {
  id: number;
  name: string;
  movie_ids: number[];
  movies?: Movie[];
}

const API_BASE_URL = "http://127.0.0.1:8000/api";

const ListsPage = () => {
  const [lists, setLists] = useState<MovieList[]>([]);
  const [newListName, setNewListName] = useState("");
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchMovieDetails = async (movieId: number) => {
    try {
      const url = `http://localhost:8000/api/movies/${movieId}/`;
      console.log("Pobieram film z:", url); // 🔍 Debugowanie URL
  
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Błąd pobierania filmu ${movieId}`);
      
      return await response.json();
    } catch (error) {
      console.error(`Błąd pobierania filmu ${movieId}:`, error);
      return null;
    }
  };

  const fetchLists = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Brak tokena, użytkownik niezalogowany");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/lists/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Błąd API: ${response.status} ${response.statusText}`);

      const data: MovieList[] = await response.json();

      const updatedLists = await Promise.all(
        data.map(async (list) => {
          const movieDetails = await Promise.all(
            list.movie_ids.map(fetchMovieDetails)
          );
          return { ...list, movies: movieDetails.filter((movie) => movie !== null) };
        })
      );

      setLists(updatedLists);
    } catch (error) {
      console.error("Błąd pobierania list:", error);
    }
  };

  const createList = async () => {
    const token = localStorage.getItem("token");

    if (!token || !newListName.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/lists/create/`, {
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

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/search-movies/?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Błąd pobierania wyników wyszukiwania");
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Błąd wyszukiwania:", error);
    }
  };

  // const addMovieToList = async (listId: number, movie: Movie) => {
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     console.error("Brak tokena, użytkownik niezalogowany");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`${API_BASE_URL}/lists/${listId}/add/`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Token ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ movie_id: movie.id }),
  //     });

  //     if (!response.ok) throw new Error(`Błąd API: ${response.status} ${response.statusText}`);

  //     fetchLists();
  //   } catch (error) {
  //     console.error("Błąd dodawania filmu:", error);
  //   }
  // };

  // const removeMovieFromList = async (listId: number, movieId: number) => {
  //   const token = localStorage.getItem("token");

  //   if (!token) {
  //     console.error("Brak tokena, użytkownik niezalogowany");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`${API_BASE_URL}/lists/${listId}/remove/${movieId}/`, {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Token ${token}`,
  //       },
  //     });

  //     if (response.ok) {
  //       fetchLists();
  //     }
  //   } catch (error) {
  //     console.error("Błąd usuwania filmu:", error);
  //   }
  // };

  const handleListClick = (listId: number) => {
    navigate(`/list/${listId}`);
  };

  return (
    <div className="lists-page">
      <h1>Twoje listy filmów</h1>

      <div className="create-list">
        <input
          type="text"
          placeholder="Nazwa listy"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <button onClick={createList}>Dodaj listę</button>
      </div>

      {/* <div className="search-section">
        <input
          type="text"
          placeholder="Szukaj filmów..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.slice(0, 5).map((movie) => (
              <li key={movie.id}>
                <span>{movie.title}</span>
                <button onClick={() => selectedListId && addMovieToList(selectedListId, movie)}>
                  Dodaj do listy
                </button>
              </li>
            ))}
          </ul>
        )}
      </div> */}

      <div className="lists-container">
        {lists.length > 0 ? (
          lists.map((list) => (
            <div key={list.id} className="movie-list" onClick={() => handleListClick(list.id)}>
              <h2>{list.name}</h2>
              <div className="movie-cover-stack">
                {list.movies?.slice(0, 5).map((movie) => (
                  <div key={movie.id} className="movie-cover">
                    <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>Brak list do wyświetlenia</p>
        )}
      </div>
    </div>
  );
};

export default ListsPage;
