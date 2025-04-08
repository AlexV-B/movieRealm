import { Route, Routes } from "react-router-dom";
import MovieDetail from "./pages/MovieDetail";
import Home from "./pages/Home";
import Header from "./components/Header";
import { useState, useEffect, useCallback } from "react";
import ActorDetail from "./pages/ActorDetail";

const App = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const savedLanguage = localStorage.getItem('language') || "en-US";  // Получаем и устанавливаем начальный язык
  const [language, setLanguage] = useState(savedLanguage);
  const [category, setCategory] = useState("trending");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

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

  const handleCategoryChange = useCallback((newCategory: string) => {
    setCategory(newCategory);
  }, []);

  const handleGenreChange = useCallback((newGenre: string | null) => {
    setSelectedGenre(newGenre);
  }, []);

  return (
    <>
      <Header 
      language={language} 
      onSearchResults={handleSearchResults} 
      setLanguage={setLanguage} 
      onCategoryChange={handleCategoryChange}
      onGenreChange={handleGenreChange}
      />
      <Routes>
        <Route path="/" element={<Home language={language} searchResults={searchResults} category={category} selectedGenre={selectedGenre}/>} />
        <Route path="/movie/:id" element={<MovieDetail language={language} />} /> 
        <Route path="/actor/:id" element={<ActorDetail language={language} />} />
        </Routes>
    </>
  );
};

export default App;
