import { useEffect } from "react";
import styles from "./header.module.css";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";

const Header = ({ onSearchResults, language, setLanguage }: { 
  onSearchResults: (results: any[] | null, query: string) => void;
  language: string; 
  setLanguage: (lang: string) => void; }) => {

      // Когда язык меняется, сохраняем его в localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <header className={styles.header}>
           <Link to="/" className={styles.homeLink}>
        <h1>MovieRealm</h1>
      </Link>
      <div  className={styles.leftBlock}>
        <div >
          {" "}
          <select className={styles.language}
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
