import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import styles from "./movieList.module.css";
import GenreFilter from "./GenreFilter";
import { debounce } from "lodash";
import TopTenCarousel from "./TopTenCarousel";


const apiKey = "6079e93c1e108a319ce62e3f8c0a8ac0";

const categories = [
  { id: "trending", label: "Trending", url: "trending/movie/week" },
  { id: "now_playing", label: "Now Playing", url: "movie/now_playing" },
  { id: "upcoming", label: "Upcoming", url: "movie/upcoming" },
];

const MovieList = ({
  language = "en",
  searchResults,
}: {
  language?: string;
  searchResults: any[];
}) => {
  const [topMovies, setTopMovies] = useState<any[]>([]); // ТОП-10
  const [movies, setMovies] = useState<any[]>([]); // Остальные фильмы
  const [category, setCategory] = useState<string>("trending");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { ref, inView } = useInView({ threshold: 0.2 });
  const displayedMovies = searchResults.length > 0 ? searchResults : movies;
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
const [showBanner, setShowBanner] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100); // Задержка на 100 мс для корректного отображения
  }, [location.pathname]); // Выполняется при изменении пути
  useEffect(() => {
    setTopMovies([]);
    setMovies([]);
    setPage(1);
  }, [category, selectedGenre, language]);

  useEffect(() => {
    if (topMovies.length > 0) {
      fetchTrailer(topMovies[0].id);
    }
  }, [topMovies]);
  
  const fetchTrailer = async (movieId: number) => {
    try {
        setShowBanner(true)
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=${language}`
      );
      const trailers = response.data.results.filter((video: any) => video.type === "Trailer" && video.site === "YouTube");
      
      if (trailers.length > 0) {
        setTrailerKey(trailers[0].key);
        setShowBanner(false);
      } else {
        setTrailerKey(null);
        setShowBanner(true);
      }
    } catch (error) {
      console.error("Ошибка загрузки трейлера:", error);
      setShowBanner(true);
    }
  };
  

  useEffect(() => {
    // Дебаунс для уменьшения частоты запросов
    const handleScroll = debounce(() => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        setPage((prev) => prev + 1);
      }
    }, 200);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  useEffect(() => {
    if (page === 1) {
      fetchMovies(1, category, selectedGenre, language, true);
    }
  }, [category, selectedGenre, language]);

  useEffect(() => {
    if (page > 1) {
      fetchMovies(page, category, selectedGenre, language, false);
    }
  }, [page]);


  useEffect(() => {
    if (inView && !loading && movies.length > 0) {
      setPage((prev) => prev + 1);
    }
  }, [inView, loading]);



  const fetchMovies = async (
    page: number,
    category: string,
    genre: string | null,
    language: string,
    isFirstPage: boolean
  ) => {
    setLoading(true);
    const categoryData = categories.find((c) => c.id === category);
    let url = `https://api.themoviedb.org/3/${categoryData?.url}?api_key=${apiKey}&page=${page}&language=${language}`;
  
    if (genre) {
      url += `&with_genres=${genre}`;
    }
  
    try {
      const response = await axios.get(url);
      const newMovies = response.data.results;
  
      if (isFirstPage) {
        setTopMovies(newMovies.slice(0, 10)); // ТОП-10 фильмов
        setMovies(newMovies.slice(10)); // Остальные фильмы
      } else {
        setMovies((prevMovies) => [...prevMovies, ...newMovies]);
      }
    } catch (error) {
      console.error("Ошибка загрузки фильмов:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.containerMovieList}>
      <div className={styles.tabs}>
          <GenreFilter onSelectGenre={setSelectedGenre} />
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={category === cat.id ? styles.active : ""}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
  
      {topMovies.length > 0 && (
  <div className={styles.topFilmBlockTrailer}>
    <Link to={`/movie/${topMovies[0].id}`}>
    {showBanner ? (
        <img
          className={styles.topFilmBanner}
          src={`https://image.tmdb.org/t/p/w1280${topMovies[0].backdrop_path || topMovies[0].poster_path}`}
          alt={topMovies[0].title}
        />
      ) : (
        <iframe
          className={styles.topFilmTrailer}
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}`}
          title="Movie Trailer"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      )}
      <div className={styles.topFilmOverlay}></div>
      <div className={styles.topFilmDetails}>
        <h2>{topMovies[0].title}</h2>
        <p>{topMovies[0].overview}</p>
      </div>
    </Link>
  </div>
)}


<TopTenCarousel />
  
      {/* Остальные фильмы (без номеров) */}
      <div className={styles.movieList}>
        {displayedMovies.map((movie, index) => {
          const isLastItem = index === displayedMovies.length - 1;
          return (
            <div
              key={movie.id}
              className={styles.movieCard}
              ref={isLastItem ? ref : null} // ref только у последнего элемента
            >
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                  alt={movie.title}
                />
              </Link>
            </div>
          );
        })}
      </div>
  
      {loading && <p className={styles.loading}>Loading...</p>}
    </div>
  );
  
}
export default MovieList;
