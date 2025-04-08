import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./actorDetail.module.css";
import { Link } from "react-router-dom";

const apiKey = "6079e93c1e108a319ce62e3f8c0a8ac0";

interface ActorDetailProps {
  language: string;
}

const ActorDetail = ({ language }: ActorDetailProps) => {
  const { id } = useParams();
  const [actor, setActor] = useState<any | null>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [socials, setSocials] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActor = async () => {
      try {
        const [actorRes, creditsRes, socialsRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&language=${language}`),
          axios.get(`https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${apiKey}&language=${language}`),
          axios.get(`https://api.themoviedb.org/3/person/${id}/external_ids?api_key=${apiKey}`)
        ]);

        setActor(actorRes.data);
        setMovies(creditsRes.data.cast);
        setSocials(socialsRes.data);
        setLoading(false);
      } catch (error) {
        setError("Ошибка загрузки информации об актёре.");
        setLoading(false);
      }
    };

    if (id) fetchActor();
  }, [id, language]);

  if (loading) return <div>Loading...</div>;
  if (error || !actor) return <div>{error || "Информация не найдена."}</div>;


  return (
    <div className={styles.actorContainer}>
      <div className={styles.actorHeader}>
        <img
          src={`https://image.tmdb.org/t/p/w1280${actor.profile_path}`}
          alt={actor.name}
          className={styles.actorPhoto}
        />
        <div className={styles.actorInfo}>
          <h1>{actor.name}</h1>
          <p><strong>Date of birth:</strong> {actor.birthday}</p>
          {actor.place_of_birth && (
            <p><strong>Place of birth:</strong> {actor.place_of_birth}</p>
          )}
          {actor.biography && (
            <p className={styles.actorBio}>
              <strong>Biography:</strong> {actor.biography || "Нет описания."}
            </p>
          )}

          {/* Соцсети */}
          {socials && (
            <div className={styles.socialLinks}>
              {socials.instagram_id && (
                <a href={`https://instagram.com/${socials.instagram_id}`} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              )}
              {socials.twitter_id && (
                <a href={`https://twitter.com/${socials.twitter_id}`} target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              )}
              {socials.facebook_id && (
                <a href={`https://facebook.com/${socials.facebook_id}`} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              )}
              {socials.imdb_id && (
                <a href={`https://www.imdb.com/name/${socials.imdb_id}`} target="_blank" rel="noopener noreferrer">
                  IMDb
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Фильмы */}
      <div className={styles.actorMovies}>
        <h2>Movies with {actor.name}</h2>
        <div className={styles.moviesGrid}>
          {movies
            .filter((movie) => movie.poster_path) // только с постерами
            .sort((a, b) => new Date(b.release_date ?? '').getTime() - new Date(a.release_date ?? '').getTime()) // сортируем по дате выпуска
            .slice(0, 9)
            .map((movie) => (
              <Link to={`/movie/${movie.id}`} key={movie.id} className={styles.movieCard}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title || movie.name}
                  className={styles.moviePoster}
                />
                <p>{movie.title || movie.name}</p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ActorDetail;
