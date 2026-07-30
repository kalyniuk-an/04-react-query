import axios from "axios";
import type { Movie } from '../types/movie';

interface movieHttpResponse {
  results: Movie[];
}
const URL = 'https://api.themoviedb.org/3/search/movie';
const token = import.meta.env.VITE_TMDB_TOKEN;
export const fetchMovie = async (query: string): Promise<Movie[]> => { 
  const response = await axios.get<movieHttpResponse>(URL, {
    params: {
      query,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data.results;
};