import React, { useState } from "react";

interface MovieRatingsProps {
  movieId: string;
  tmdbRating: number;
  tmdbVotes: number;
}

const MovieRatings: React.FC<MovieRatingsProps> = ({ movieId, tmdbRating, tmdbVotes }) => {
  const [rating, setRating] = useState<number | null>(null);

  const handleRating = async (userRating: number) => {
    setRating(userRating);

    const token = localStorage.getItem("token"); // Pobierz token JWT

    await fetch(`http://localhost:8000/api/movies/${movieId}/rate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ rating: userRating })
    });
  };

  return (
    <div className="movie-ratings">
      <div className="tmdb-rating">
        <h3>TMDB Rating: {tmdbRating.toFixed(1)} / 10</h3>
        <p>({tmdbVotes} votes)</p>
      </div>
      <div className="user-rating">
        <h3>Your Rating:</h3>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
            <span 
              key={star} 
              className={`star ${rating && rating >= star ? 'selected' : ''}`} 
              onClick={() => handleRating(star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieRatings;
