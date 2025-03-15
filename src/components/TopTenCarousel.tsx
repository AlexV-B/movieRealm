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

const TopTenCarousel = ({ language = "en" }) => {
  const [topMovies, setTopMovies] = useState<any[]>([]);
  const sliderRef = useRef<Slider | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const velocity = useRef(0);

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=${language}`
        );
        setTopMovies(response.data.results.slice(0, 10));
      } catch (error) {
        console.error("Ошибка загрузки ТОП-10 фильмов:", error);
      }
    };

    fetchTopMovies();
  }, [language]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    draggable: false, // Отключаем встроенное перетаскивание
    swipe: false, // Отключаем стандартный свайп
    touchThreshold: 20, // Настраиваем чувствительность свайпа
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  // 🛠 Обрабатываем пользовательский свайп с эффектом "барабана"
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true;
    startX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
    velocity.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;

    const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const deltaX = startX.current - currentX;
    velocity.current = deltaX; // Запоминаем скорость движения
  };

  const handleTouchEnd = () => {
    isDragging.current = false;

    // Определяем направление и скорость инерции
    const inertiaFactor = Math.min(Math.abs(velocity.current) / 50, 5); // Ограничиваем скорость
    const direction = velocity.current > 0 ? "next" : "prev";

    if (sliderRef.current) {
      for (let i = 0; i < inertiaFactor; i++) {
        setTimeout(() => {
          direction === "next" ? sliderRef.current!.slickNext() : sliderRef.current!.slickPrev();
        }, i * 100);
      }
    }
  };

  return (
    <div
      className={styles.carouselContainer}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <h2>Top 10 this week</h2>
      <Slider ref={sliderRef} {...settings}>
        {topMovies.map((movie, index) => (
          <div key={movie.id} className={styles.movieCard}>
            <span className={styles.rank}>{index + 1}</span>
            <Link to={`/movie/${movie.id}`} onClick={(e) => isDragging.current && e.preventDefault()}>
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
