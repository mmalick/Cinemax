import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieCast from "../components/MovieDetails/MovieCast";

const API_BASE_URL = "http://127.0.0.1:8000/api/movies/";

interface StreamingProvider {
    name: string;
    logo: string;
}

interface Movie {
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    vote_count: number;
    streaming: StreamingProvider[];
}

export default function MovieDetailsPage() {
    const { id } = useParams<{ id?: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [rating, setRating] = useState<number | null>(null);
    const [userRating, setUserRating] = useState<number | null>(null);
    const token = localStorage.getItem("token"); // Pobierz token użytkownika

    useEffect(() => {
        if (!id) return;

        async function fetchMovieDetails() {
            try {
                const response = await fetch(`${API_BASE_URL}${id}/`);
                if (!response.ok) throw new Error("Nie znaleziono filmu");
                const data = await response.json();
                setMovie(data);
            } catch (error) {
                console.error(error);
            }
        }

        async function fetchUserRating() {
            if (!token) return;
            try {
                const response = await fetch(`${API_BASE_URL}${id}/rate/`, {
                    method: "GET",
                    headers: { Authorization: `Token ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserRating(data.rating);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchMovieDetails();
        fetchUserRating();
    }, [id, token]);

    async function handleRatingSubmit() {
        if (!rating || !id || !token) return;
    
        try {
            const response = await fetch(`${API_BASE_URL}${id}/rate/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`, // ← Upewnij się, że token jest wysyłany
                },
                body: JSON.stringify({ rating }),
            });
    
            const responseData = await response.json();
            console.log("Server response:", responseData);
    
            if (response.ok) {
                setUserRating(rating);
            } else {
                console.error("Nie udało się zapisać oceny:", responseData);
            }
        } catch (error) {
            console.error("Błąd sieci:", error);
        }
    }
    

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
                <p className="rating">⭐ {movie.vote_average.toFixed(1)} ({movie.vote_count} głosów)</p>

                {/* Streaming */}
                {movie.streaming.length > 0 ? (
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
                ) : <p>Brak informacji o dostępności</p>}

                <MovieCast movieId={id || ""} />

                {/* System oceniania */}
                {token ? (
                    <div className="rating-section">
                        <h3>Oceń film:</h3>
                        <select value={rating ?? ""} onChange={(e) => setRating(Number(e.target.value))}>
                            <option value="" disabled>Wybierz ocenę</option>
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        <button onClick={handleRatingSubmit}>Zapisz ocenę</button>
                        {userRating && <p>Twoja ocena: {userRating}/10</p>}
                    </div>
                ) : (
                    <p>Zaloguj się, aby ocenić film</p>
                )}
            </div>
        </div>
    );
}
