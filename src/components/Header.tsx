import { useEffect, useState } from "react";
import styles from "./header.module.css";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import GenreFilter from "./GenreFilter";

const Header = ({
  onSearchResults,
  language,
  setLanguage,
  onCategoryChange,
  onGenreChange,
}: {
  onSearchResults: (results: any[] | null, query: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  onCategoryChange: (category: string) => void;
  onGenreChange: (genre: string | null) => void;
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("Trending");


  const handleCategoryClick = (newCategory: string) => {
    setCategory(newCategory);
    setSelectedGenre(null); // ⬅️ сброс жанра при выборе категории
  };

  const handleGenreClick = (genreId: string) => {
    setSelectedGenre(genreId);
    setCategory(""); // ⬅️ опционально
  };

  useEffect(() => {
    onCategoryChange(category);
  }, [category, onCategoryChange]);

  useEffect(() => {
    onGenreChange(selectedGenre);
  }, [selectedGenre, onGenreChange]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);


  return (
    <header className={styles.header}>
      <Link to="/" className={styles.homeLink}>
        <h1>MovieRealm</h1>
      </Link>
      <div className={styles.leftBlock}>
      <div className={styles.tabs}>
        <GenreFilter onSelectGenre={handleGenreClick} selectedGenre={selectedGenre}/>
        {["Trending", "Now_playing", "Upcoming"].map((cat) => (
          <button
            key={cat}
            className={category === cat ? styles.active : ""}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat.replace("_", " ")}
          </button>
        ))}
      </div>
        <div className={styles.languageBox}>
          <select
            className={styles.language}
            onChange={(e) => setLanguage(e.target.value)}
            value={language}
          >
            <option value="en-US">English</option>
            <option value="de-DE">Deutsch</option>
            <option value="ru-RU">Русский</option>
          </select>
        </div>
        <SearchBar onSearchResults={onSearchResults} />
      </div>
    </header>
  );
};

export default Header;
