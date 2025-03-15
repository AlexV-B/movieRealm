import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from "./movieDetail.module.css"

const MovieDetail = () => {
  const { id } = useParams(); // Получаем id фильма из URL
  const [movie, setMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error] = useState<string | null>(null);

  
  useEffect(() => {
    axios
    .get(`https://api.themoviedb.org/3/movie/${id}?api_key=6079e93c1e108a319ce62e3f8c0a8ac0`)
    .then(response => {
      setMovie(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching movie details:', error);
      setLoading(false);
    });
  }, [id]);
  
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  
  
  if (!movie) {
    return <div>Movie not found</div>;
  }
  
  console.log("Movie ID:", id); // Проверь, что ID приходит корректно
  
  return (
    <div>
      {movie ? (
        <div className={styles.movieDetail}>
          <h1>{movie.title}</h1>
          <img src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} alt={movie.title} />
          <p>{movie.overview}</p>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.vote_average}</p>
          {/* Дополнительные данные о фильме */}
        </div>
      ) : (
        <div>Movie not found</div>
      )}
    </div>
  );
};

export default MovieDetail;
