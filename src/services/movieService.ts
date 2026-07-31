import axios from "axios";
import type { Movie } from '../types/movie';

interface movieHttpResponse {
  results: Movie[];
  page: number;
  total_page: number;
  total_results: number;
}
const URL = 'https://api.themoviedb.org/3/search/movie';
const token = import.meta.env.VITE_TMDB_TOKEN;
export const fetchMovie = async (query: string, page: number): Promise<Movie[]> => { 
  const response = await axios.get<movieHttpResponse>(URL, {
    params: {
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};