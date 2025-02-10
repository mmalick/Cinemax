import React, { useRef, useState } from 'react';
import './FilmList.css';
import FilmCard from '../FilmCard/FilmCard';

interface Film {
  id: number; // Dodajemy ID filmu
  poster_url: string;
  title: string;
  overview: string;
}

interface FilmListProps {
  films: Film[];
  title?: string;
}

const FilmList: React.FC<FilmListProps> = ({ films, title }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  if (!films || films.length === 0) {
    return <p>Brak filmów do wyświetlenia</p>;
  }

  return (
    <div className="film-list">
      {title && <h2 className="film-list-title">{title}</h2>}
      <div
        className="film-list-container"
        ref={listRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {films.map((film) => (
          <FilmCard key={film.id} id={film.id} poster={film.poster_url} />
        ))}
      </div>
    </div>
  );
};

export default FilmList;
