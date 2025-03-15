import axios from 'axios';

const apiKey = '6079e93c1e108a319ce62e3f8c0a8ac0';
const baseUrl = 'https://api.themoviedb.org/3/';

export const getPopularMovies = async (language: string) => {
  try {
    const response = await axios.get(`${baseUrl}movie/popular?api_key=${apiKey}&language=${language}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return null;
  }
};
