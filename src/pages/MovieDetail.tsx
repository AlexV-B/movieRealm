import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./movieDetail.module.css";
import CustomSwiper from "./CustomSwiper";


const apiKey = "6079e93c1e108a319ce62e3f8c0a8ac0";

const MovieDetail = ({ language }: { language: string }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [actors, setActors] = useState<any[]>([]); 
  const [medias, setMedia] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchMovieDetails(id);
      fetchMovieData(id);
    }
  }, [id, language]);

  // Функция загрузки данных о фильме
  const fetchMovieDetails = async (movieId: string) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=${language}`
      );
      setMovie(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Ошибка загрузки данных о фильме:", error);
      setError("Ошибка загрузки данных");
      setLoading(false);
    }
  };

  const fetchMovieData = async (movieId: string) => {
    try {
      // Запускаем все три запроса параллельно
      const [trailerRes, actorsRes, mediaRes] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=${language}`),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=${language}`),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${apiKey}`),
      ]);
  
      // Обрабатываем трейлер
      const trailers = trailerRes.data.results.filter(
        (video: any) => video.type === "Trailer" && video.site === "YouTube"
      );
      setTrailerKey(trailers.length > 0 ? trailers[0].key : null);
  
      // Обрабатываем актеров
      setActors(actorsRes.data.cast);
      console.log("Актеры:", actorsRes.data.cast);
  
      // Обрабатываем медиа (постеры + бекдропы)
      const posters = mediaRes.data.posters || [];
      const backdrops = mediaRes.data.backdrops || [];
      setMedia([...posters, ...backdrops]);
      console.log("Постеры:", posters);
      console.log("Backdrops:", backdrops);
    } catch (error) {
      console.error("Ошибка загрузки данных фильма:", error);
    }
  };
  
  // Открываем модалку
  const openModal = () => {
    if (trailerKey) {
      setIsModalOpen(true);
    } else {
      alert(" Trailer is not found");
    }
  };

  // Закрываем модалку (по клику вне или на крестик)
  const closeModal = () => setIsModalOpen(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!movie) {
    return <div>Movie not found</div>;
  }

  console.log("Movie ID:", id); // Проверь, что ID приходит корректно

  return (
    <div className={styles.movieDetailContainer}>
      <div className={styles.posterImageBackground}>
        <div className={styles.blackOverlay}></div>
        <img
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          alt={movie.title}
        />
      </div>
      <div className={styles.movieDetail}>
        <div className={styles.posterImage}>
          <img
            src={`https://image.tmdb.org/t/p/w1280${movie.poster_path}`}
            alt={movie.title}
          />
        </div>
        <div className={styles.movieInfo}>
          <h1 className={styles.movieTitle}>{movie.title}</h1>
          <div className={styles.genresAndRuntime}>
            <h2>
              <strong>•</strong>{" "}
              {movie.genres.map((genre: any) => genre.name).join(", ")}
            </h2>
            <h2>
              <strong>•</strong> {movie.runtime} minutes
            </h2>
          </div>
        </div>
        <div className={styles.movieOverview}>
          <p>{movie.overview}</p>
        </div>
        <div className={styles.movieReleaseDate}>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
        </div>
        <div className={styles.movieRating}>
          <p>
            <strong>Rating:</strong> {movie.vote_average}
          </p>
        </div>
        <div className={styles.buttons}>
          <div className={styles.favoritesMovie}>
            <a className={styles.heartIcon}></a>
          </div>
          <div className={styles.buttonWatchTrailerBox}>
            <div className={styles.buttonWatchTrailer} onClick={openModal}>
              <a className={styles.watchIcon}></a>
            </div>
            <p className={styles.p}>Watch Trailer</p>
          </div>

          {/* Модальное окно */}
          {isModalOpen && (
            <div className={styles.modalOverlay} onClick={closeModal}>
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <button className={styles.closeButton} onClick={closeModal}>
                  ×
                </button>
                <iframe
                  className={styles.topFilmTrailer}
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}`}
                  title="Movie Trailer"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Список актеров */}
      <div className={styles.movieActors}>
        <h3 className={styles.cast}>Cast</h3>
        <div className={styles.actorsList}>
          {actors.slice(0, 8).map(
            (actor) => (
              <Link
              key={actor.id} 
              to={`/actor/${actor.id}`}
              className={styles.actorCards}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                  alt={actor.name}
                  className={styles.actorImage}
                />
                <p>{actor.name}</p>
              </Link>
            )
          )}
        </div>
      </div>

      {/* Список media */}
      <div className={styles.movieMedia}>
        <h3 className={styles.media}>Media</h3>
        <div className={styles.mediasList}>
          {medias.slice(0, 6).map(
            (
              media // Ограничиваем количество актеров
            ) => (
              <div key={media.file_path} className={styles.mediaCards}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${media.file_path}`}
                  alt="Movie Poster"
                  className={styles.mediaImage}
                />
              </div>
            )
          )}
        </div>
      </div>

     {/* Карусель тизеров */}
     <div className={styles.movieTeaser}>
  <h3 className={styles.teaserTitle}>Teasers</h3>
  <CustomSwiper language={language} />
</div>

    </div>
  );
};

export default MovieDetail;
