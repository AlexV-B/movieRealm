import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './home.module.css';
import { useLocation } from 'react-router-dom';
import MovieList from '../components/MovieList';

interface HomeProps {
  language: string;
  searchResults: any[]; // <-- Указываем тип
  category: string;
  selectedGenre: string | null;
}

const Home: React.FC<HomeProps> = ({ language, searchResults, category, selectedGenre }: { language: string; searchResults: any[], category: string, selectedGenre: string | null }) => {
  const location = useLocation();
  const isMovieDetailPage = location.pathname.startsWith("/movie/");
  const [showWelcome, setShowWelcome] = useState(() => {
    return localStorage.getItem("hasSeenWelcome") ? false : true;
  });

  useEffect(() => {
    if (showWelcome) {
    const timer = setTimeout(() => {
      setShowWelcome(false);
      localStorage.setItem("hasSeenWelcome", "true");
    }, 2000); // 3 секунды заставка, потом скрываем
    return () => clearTimeout(timer);
  }
}, [showWelcome]);

  return (
    <div className={styles.homeWrapper}>
      {!isMovieDetailPage && <MovieList language={language} searchResults={searchResults} category={category} selectedGenre={selectedGenre} />}
      {showWelcome ? (
        <motion.div 
          className={styles.welcomeScreen}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, delay: 2 }} // 2 сек анимация текста + 1 сек затухание
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            Welcome to MovieRealm
          </motion.h1>
        </motion.div>
      ) : (
        <div className={styles.content}>
        </div>
      )}

    </div>
  );
};

export default Home;
