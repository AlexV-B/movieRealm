import { Link } from 'react-router-dom';

const MovieCard = ({ movie }: { movie: any }) => {
  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`}> {/* Ссылка на страницу с детальной информацией */}
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
        <h2>{movie.title}</h2>
      </Link>
      <p>{movie.overview}</p>
    </div>
  );
};

export default MovieCard;
