import React, { useState, useEffect } from "react";
import "./MovieRatings.css";

interface MovieRatingsProps {
  movieId: string;
  initialRating?: number | null;
}

const MovieRatings: React.FC<MovieRatingsProps> = ({ movieId,initialRating = null }) => {
  const [rating, setRating] = useState<number>(initialRating ?? 0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    setRating(initialRating ?? 0);
  }, [initialRating]);

  const handleRating = async (userRating: number) => {
    setRating(userRating);

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Brak tokena użytkownika.");
      return;
    }

    await fetch(`http://localhost:8000/api/movies/${movieId}/rate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      },
      body: JSON.stringify({ rating: userRating })
    });
  };

  return (
    <div className="movie-ratings">
      <div className="user-rating">
        <h3>Twoja ocena:</h3>
        <div className="rating-stars">
          {[...Array(10)].map((_, i) => {
            const starValue = i + 1;
            return (
              <span
                key={starValue}
                className="star"
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(null)}
                onClick={() => handleRating(starValue)}
                style={{
                  cursor: "pointer",
                  fontSize: "28px",
                  transition: "transform 0.2s",
                }}
              >
                {starValue <= (hover ?? rating) ? "⭐" : "★"}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
  
};

export default MovieRatings;
