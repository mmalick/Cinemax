import React, { useEffect, useRef, useState } from "react";
import "./MovieCast.css";

interface Actor {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
}

interface MovieCastProps {
  movieId: string;
}

const API_BASE_URL = "http://127.0.0.1:8000/api/movies/";

const MovieCast: React.FC<MovieCastProps> = ({ movieId }) => {
  const [actors, setActors] = useState<Actor[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    async function fetchCast() {
      try {
        const response = await fetch(`${API_BASE_URL}${movieId}/credits/`);
        if (!response.ok) throw new Error("Nie znaleziono obsady");
        const data = await response.json();
        setActors(data.actors); // Poprawione: `actors`, nie `cast`
      } catch (error) {
        console.error(error);
        setActors([]); // Jeśli błąd, ustaw pustą tablicę
      }
    }
    fetchCast();
  }, [movieId]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (listRef.current) {
      setStartX(e.pageX - listRef.current.offsetLeft);
      setScrollLeft(listRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !listRef.current) return;
    e.preventDefault();
    const x = e.pageX - listRef.current.offsetLeft;
    const walk = (x - startX) * 0.6;
    listRef.current.scrollLeft = scrollLeft - walk;
  };

  if (actors.length === 0) {
    return <p>Brak obsady do wyświetlenia</p>;
  }

  return (
    <div className="movie-cast">
      <h2 className="movie-cast-title">Obsada</h2>
      <div
        className={`movie-cast-container ${isDragging ? "grabbing" : ""}`}
        ref={listRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {actors.map((actor) => (
          <div key={actor.id} className="actor-card">
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                  : "https://via.placeholder.com/200x300?text=Brak+zdjęcia"
              }
              alt={actor.name}
            />
            <p className="actor-name">{actor.name}</p>
            <p className="actor-character">{actor.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieCast;
