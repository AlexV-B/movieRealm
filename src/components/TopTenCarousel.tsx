import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import styles from "./TopTenCarousel.module.css";

const apiKey = "6079e93c1e108a319ce62e3f8c0a8ac0";

// Кастомные стрелки
const CustomPrevArrow = (props: any) => {
  const { className, onClick } = props;
  return <div className={`${className} ${styles.customArrow} ${styles.prev}`} onClick={onClick} />;
};

const CustomNextArrow = (props: any) => {
  const { className, onClick } = props;
  return <div className={`${className} ${styles.customArrow} ${styles.next}`} onClick={onClick} />;
};

const TopTenCarousel = ({ language }: { language: string }) => {
  const [topMovies, setTopMovies] = useState<any[]>([]);
  const sliderRef = useRef<Slider | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=${language}&nocache=${Math.random()}`
        );
        const movies = response.data.results.slice(0, 10);

        setTopMovies(movies); // Обновляем список фильмов

        console.log("Загруженные фильмы:", response.data.results); // Проверяем, меняется ли язык
      } catch (error) {
        console.error("Ошибка загрузки ТОП-10 фильмов:", error);
      }
    };

    fetchTopMovies();
  }, [language]); // Срабатывает при изменении языка

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
  
      if (event.deltaX > 0) {
        sliderRef.current.slickNext(); // Прокрутка вправо
      } else if (event.deltaX < 0) {
        sliderRef.current.slickPrev(); // Прокрутка влево
      }
    };
  
    const sliderElement = sliderRef.current?.innerSlider?.list;
    if (sliderElement) {
      sliderElement.addEventListener("wheel", handleWheel);
    }
  
    return () => {
      if (sliderElement) {
        sliderElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);
  
  
  return (
    <div
      key={language} // Уникальный ключ для принудительного обновления карусели
      className={styles.carouselContainer}
    >
      <h2>Top 10 this week</h2>
      <Slider key={language} ref={sliderRef} {...settings}>
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
                src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}  // Убедись, что ты правильно подставляешь язык
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