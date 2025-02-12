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
  const navigate = useNavigate();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchMovieDetails = async (movieId: number) => {
    try {
      const url = `${API_BASE_URL}/movies/${movieId}/`;
      console.log("Pobieram film z:", url);

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

  const deleteList = async (listId: number) => {
    if (!window.confirm("Na pewno chcesz usunąć tę listę?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Brak tokena, użytkownik niezalogowany");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/lists/${listId}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
      }
    } catch (error) {
      console.error("Błąd usuwania listy:", error);
    }
  };

  const handleListClick = (listId: number) => {
    navigate(`/list/${listId}`); // 🔥 Poprawione!
  }


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

      <div className="lists-container">
        {lists.length > 0 ? (
          lists.map((list) => (
            <div key={list.id} className="movie-list">
              <div onClick={() => handleListClick(list.id)}>
                <h2>{list.name}</h2>
                <div className="movie-cover-stack">
                  {list.movies?.slice(0, 5).map((movie) => (
                    <div key={movie.id} className="movie-cover">
                      <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                    </div>
                  ))}
                </div>
              </div>
              <button className="delete-list-btn" onClick={() => deleteList(list.id)}>
                Usuń listę
              </button>
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
