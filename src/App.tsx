import { Route, Routes } from "react-router-dom";
import MovieDetail from "./pages/MovieDetail";
import Home from "./pages/Home";
import Header from "./components/Header";
import { useState, useEffect } from "react";

const App = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Получаем и устанавливаем начальный язык
  const savedLanguage = localStorage.getItem('language') || "en-US";
  const [language, setLanguage] = useState(savedLanguage);

  // При изменении языка сохраняем его в localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Функция для обработки результатов поиска
  const handleSearchResults = (results: any[] | null, query: string) => {
    if (results) {
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
    console.log("Search query:", query);
  };

  return (
    <>
      <Header language={language} onSearchResults={handleSearchResults} setLanguage={setLanguage} />
      <Routes>
        <Route path="/" element={<Home language={language} searchResults={searchResults} />} />
        <Route path="/movie/:id" element={<MovieDetail language={language} />} /> {/* Результаты поиска в MovieDetail не передаем, так как они не требуются */}
      </Routes>
    </>
  );
};

export default App;
