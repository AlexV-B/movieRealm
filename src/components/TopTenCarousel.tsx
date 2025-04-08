import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import styles from "./TopTenCarousel.module.css";

const apiKey = "6079e93c1e108a319ce62e3f8c0a8ac0";

interface TopTenCarouselProps {
  language: string;
  onTrailerChange: (trailer: string | null, overview: string, title: string) => void; // Обновляем тип
}

// Кастомные стрелки
const CustomPrevArrow = (props: any) => {
  const { className, onClick } = props;
  return <div className={`${className} ${styles.customArrow} ${styles.prev}`} onClick={onClick} />;
};

const CustomNextArrow = (props: any) => {
  const { className, onClick } = props;
  return <div className={`${className} ${styles.customArrow} ${styles.next}`} onClick={onClick} />;
};


const TopTenCarousel: React.FC<TopTenCarouselProps> = ({ language, onTrailerChange }) => {
  const [topMovies, setTopMovies] = useState<any[]>([]);
  const [_trailerKey, setTrailerKey] = useState<string | null>(null);
  const sliderRef = useRef<Slider | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=${language}&nocache=${Math.random()}`
        );
        const movies = response.data.results.slice(0, 10);
        setTopMovies(movies);

      } catch (error) {
        console.error("Ошибка загрузки ТОП-10 фильмов:", error);
      }
    };

    fetchTopMovies();
  }, [language]);

  useEffect(() => {
    if (topMovies.length > 0) {
      console.log("Трейлер загружается для:", topMovies[0]); // Проверка первого фильма
      fetchTrailer(topMovies[0].id);
    }
  }, [topMovies, language]);

  // В родительском компоненте добавьте типизацию для onTrailerChange
const fetchTrailer = async (movieId: number) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=${language}`
    );
    const trailers = response.data.results.filter((video: any) => video.type === "Trailer");
    if (trailers.length > 0) {
      const trailerKey = trailers[0].key;
      setTrailerKey(trailerKey);
      console.log("Передаваемый трейлер:", trailerKey);
      
      // Получаем дополнительные данные о фильме
      const movieResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=${language}`
      );
      const movie = movieResponse.data;

      // Передаем два аргумента: трейлер и описание
      onTrailerChange(trailerKey, movie.overview,  movie.title); 
    } else {
      setTrailerKey(null);
      onTrailerChange(null, "", "");
    }
  } catch (error) {
    console.error("Ошибка загрузки трейлера:", error);
    setTrailerKey(null);
    onTrailerChange(null, "", "");
  }
};

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    draggable: true, // Включаем встроенное перетаскивание
    swipe: true, // Включаем стандартный свайп
    touchThreshold: 52, // Настраиваем чувствительность свайпа
    centerMode: false, // Дает эффект центрирования
    centerPadding: "10px", // Оставляет место по краям
    cssEase: "ease-in-out", // Более плавная анимация
    touchMove: true,
    swipeToSlide: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
    beforeChange: () => {
      isDragging.current = true;
    },
    afterChange: () => {
      setTimeout(() => {
        isDragging.current = false;
      }, 50);
    },
  };

  useEffect(() => {
    if (sliderRef.current) {
      setTimeout(() => {
        sliderRef.current?.slickGoTo(0); // Переключаемся на первый слайд
        sliderRef.current?.slickPause(); // Сбрасываем autoplay
      }, 300);
    }
  }, [topMovies]); // Обновление при смене списка фильмов

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (!sliderRef.current) return;
  
       // Блокируем жесты "назад/вперёд" при горизонтальном скролле
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      event.preventDefault(); // Останавливаем стандартное поведение
      if (event.deltaX > 0) {
        sliderRef.current.slickNext(); // Прокрутка вправо
      } else if (event.deltaX < 0) {
        sliderRef.current.slickPrev(); // Прокрутка влево
      }
    }
    };
  
    const sliderElement = sliderRef.current?.innerSlider?.list;
    if (sliderElement) {
      sliderElement.addEventListener("wheel", handleWheel, { passive: false });
    }
  
    return () => {
      if (sliderElement) {
        sliderElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);
  

  return (
    <div key={language} className={styles.carouselContainer}>
      <h2>Top 10 this week</h2>
      <Slider ref={sliderRef} {...settings}>
        {topMovies.map((movie, index) => (
          <div key={movie.id} className={styles.movieCard}>
            <span className={styles.rank}>{index + 1}</span>
            <Link
              to={`/movie/${movie.id}`}
              onClick={(e) => {
                if (isDragging.current) {
                  e.preventDefault();
                }
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                alt={movie.title}
                className={styles.poster}
              />
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TopTenCarousel;
