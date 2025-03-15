import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MovieDetail from "./pages/MovieDetail";
import Home from "./pages/Home";
import Header from "./components/Header";
import { useState } from "react";

const App = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const savedLanguage = localStorage.getItem('language');
  const initialLanguage = savedLanguage ? savedLanguage : 'en-US';
  const [language, setLanguage] = useState(initialLanguage);


  const handleSearchResults = (results: any[] | null, query: string) => {
    setSearchResults(results || []); // Если results === null, устанавливаем пустой массив
    console.log("Search query:", query); // Можно сохранить query, если нужно
  };

  return (
    <Router>
      <Header language={language} onSearchResults={handleSearchResults}  setLanguage={setLanguage}/>
      <Routes>
      <Route path="/" element={<Home language={language} searchResults={searchResults} />} />
      <Route path="/movie/:id" element={<MovieDetail />} /> {/* Страница детальной информации о фильме */}
      </Routes>
    </Router>
  );
};

export default App;