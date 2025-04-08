import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "./genreFilter.module.css"

const apiKey = '6079e93c1e108a319ce62e3f8c0a8ac0';

interface Genre {
    id: number;
    name: string;
}

interface GenreFilterProps {
    onSelectGenre: (genreId: string) => void;
    selectedGenre: string | null;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ onSelectGenre, selectedGenre }) => {
    const [genres, setGenres] = useState<Genre[]>([]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en`
                );
                setGenres(response.data.genres);
            } catch (error) {
                console.error('Ошибка загрузки жанров:', error);
            }
        };

        fetchGenres();
    }, []);

    return (
        <select 
        value={selectedGenre ?? ""}
        onChange={(e) => onSelectGenre(e.target.value)} className={styles.genreButton}>
            <option className={styles.allGenres} value="">All genres</option>
            {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                    {genre.name}
                </option>
            ))}
        </select>
    );
};

export default GenreFilter;
