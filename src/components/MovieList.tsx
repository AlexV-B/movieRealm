import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import styles from "./movieList.module.css";
import { debounce } from "lodash";
import TopTenCarousel from "./TopTenCarousel";

const apiKey = "6079e93c1e108a319ce62e3f8c0a8ac0";

const categories = [
  { id: "Trending", label: "Trending", url: "trending/movie/week" },
  { id: "Now_playing", label: "Now Playing", url: "movie/now_playing" },
  { id: "Upcoming", label: "Upcoming", url: "movie/upcoming" },
];

const MovieList = ({
  language = "en",
  searchResults,
  category,
  selectedGenre,
}: {
  language?: string;
  searchResults: any[];
  category: string;
  selectedGenre: string | null;
}) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const { ref, inView } = useInView({ threshold: 0.2 });
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [_showBanner, setShowBanner] = useState(true);
  const location = useLocation();
  const hasFetched = useRef(false);
  const [currentMovieId, setCurrentMovieId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [mainMovie, setMainMovie] = useState<any | null>(null);

  const scrollToList = () => {
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start", });
  };

  const displayedMovies =
    searchResults.length > 0 && !category && !selectedGenre
      ? searchResults
      : movies;


      useEffect(() => {
  if (searchResults.length === 0) {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }
}, [location.pathname]);


useEffect(() => {
  if (searchResults.length > 0) {
    scrollToList();
  }
}, [searchResults]);

  useEffect(() => {
    setLoading(true);
    setMovies([]);
    setPage(1);
    setTrailerKey(null);
    setShowBanner(true);
    hasFetched.current = false;
    scrollToList();

    setTimeout(() => {
      fetchMovies(1);
    }, 50);
  }, [category, selectedGenre, language]);

  useEffect(() => {
    hasFetched.current = false;
    fetchMovies(1);
  }, [category, selectedGenre, language]);

  useEffect(() => {
    if (inView && !loading && movies.length > 0 && page < 500) {
      setPage((prev) => prev + 1);
    }
  }, [inView, loading]);

  useEffect(() => {
    if (page > 1) {
      fetchMovies(page);
    }
  }, [page]);

  const fetchMovies = async (page: number) => {
    setLoading(true);

    let url = "";

    if (selectedGenre) {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=${language}&page=${page}&with_genres=${selectedGenre}`;
    } else {
      const categoryData = categories.find(
        (c) => c.id.toLowerCase() === category.toLowerCase()
      );

      if (!categoryData) {
        console.error("Ошибка: не найдена категория", category);
        setLoading(false);
        return;
      }

      url = `https://api.themoviedb.org/3/${categoryData.url}?api_key=${apiKey}&language=${language}&page=${page}`;
    }

    try {
      const response = await axios.get(url);
      const newMovies = response.data.results;

      if (page === 1) {
        setMovies(newMovies.slice(0, 10));

        if (newMovies.length > 0) {
          const firstMovie = newMovies[0];
          setMainMovie(firstMovie);
          setTimeout(async () => {
            const trailer = await fetchTrailer(firstMovie.id);
            setTrailerKey(trailer);
          }, 100);
        }
      } else {
        setMovies((prevMovies) => [
          ...prevMovies,
          ...newMovies.filter(
            (newMovie: { id: any }) =>
              !prevMovies.some((prevMovie) => prevMovie.id === newMovie.id)
          ),
        ]);
      }
    } catch (error) {
      console.error("Ошибка загрузки фильмов:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrailer = async (movieId: string) => {
    try {
      setCurrentMovieId(movieId);
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=${language}`
      );
      const trailers = response.data.results.filter(
        (video: any) => video.type === "Trailer" && video.site === "YouTube"
      );

      if (trailers.length > 0) {
        if (movieId === currentMovieId) {
          setTrailerKey(trailers[0].key);
          setShowBanner(false);
        }
        return trailers[0].key;
      } else {
        if (movieId === currentMovieId) {
          setTrailerKey(null);
          setShowBanner(true);
        }
        return null;
      }
    } catch (error) {
      console.error("Ошибка загрузки трейлера:", error);
      setTrailerKey(null);
      setShowBanner(true);
    }
  };

  const handleScroll = debounce(() => {
    if (
      window.scrollY + window.innerHeight >=
      document.documentElement.offsetHeight - 50
    ) {
      setPage((prev) => prev + 1);
    }
  }, 200);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const renderSkeletons = () => {
    return Array.from({ length: 10 }).map((_, idx) => (
      <div key={idx} className={styles.movieCardSkeleton}></div>
    ));
  };

  return (
    <div className={styles.containerMovieList}>
{mainMovie && (
        <div className={styles.topFilmBlockTrailer}>
          <Link to={`/movie/${mainMovie.id}`}>
            {trailerKey ? (
              <iframe
              key={trailerKey}
                className={styles.topFilmTrailer}
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1`}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <img
                className={styles.topFilmBanner}
                src={`https://image.tmdb.org/t/p/w1920${mainMovie.backdrop_path || mainMovie.poster_path}`}
                alt={mainMovie.title}
              />
            )}
            <div className={styles.topFilmOverlay}></div>
            <div className={styles.topFilmDetails}>
              <h2>{mainMovie.title}</h2>
              <p>{mainMovie.overview}</p>
            </div>
          </Link>
        </div>
      )}

      <TopTenCarousel language={language} onTrailerChange={setTrailerKey} />

      <div ref={listRef} className={styles.movieList}>
        {displayedMovies.length === 0 && !loading && (
          <p className={styles.noResults}>Not found</p>
        )}
        {displayedMovies.map((movie, index) => {
          const isLastItem = index === displayedMovies.length - 1;
          return (
            <div
              key={movie.id}
              className={styles.movieCard}
              ref={isLastItem ? ref : null}
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

        {loading && renderSkeletons()}
      </div>
    </div>
  );
};

export default MovieList;
