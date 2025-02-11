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
    const [userRating, setUserRating] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem("token"); // Pobierz token użytkownika

    useEffect(() => {
        if (!id) return;

        const fetchMovieData = async () => {
            try {
                const [movieResponse, ratingResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}${id}/`),
                    token ? fetch(`${API_BASE_URL}${id}/rate/`, { method: "GET", headers: { Authorization: `Token ${token}` } }) : null
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
    }, [id, token]);

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
                <p className="rating">⭐ {movie.vote_average.toFixed(1)} ({movie.vote_count} głosów)</p>

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
                ) : <p>Brak informacji o dostępności</p>}

                <MovieCast movieId={id ?? ""} />

                {/* System oceniania */}
                {token ? (
                    <MovieRatings 
                        movieId={id ?? ""} 
                        tmdbRating={movie.vote_average} 
                        tmdbVotes={movie.vote_count} 
                        initialRating={userRating} 
                    />
                ) : (
                    <p>Zaloguj się, aby ocenić film</p>
                )}
            </div>
        </div>
    );
}
