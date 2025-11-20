import type {
  Movie,
  MovieInterface,
  TMDBResponsePopular,
} from "../interface/interface";
import axiosInstance from "./axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const IMAGE_BASE = "https://image.tmdb.org/t/p";

export const getNowPlayingMovies = async () => {
  const response = await fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};

// The part bellow is using axios to try how to use AXIOS. Now (251015-Wednesdat) I still not really understand AXIOS. Need to stuburnly understanding AXIOS
// TRENDING (for Trending Now): week window

export type TMDBResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export async function getTrendingMovies(): Promise<MovieInterface[]> {
  const { data } = await axiosInstance.get<TMDBResponse<MovieInterface>>(
    "/trending/movie/week",
    { params: { page: 1 } }
  );
  return data.results; // this will return MovieInterface[]
}

// api funcion for popular section

export async function getPopular(
  page: number
): Promise<TMDBResponsePopular<Movie>> {
  const { data } = await axiosInstance.get<TMDBResponsePopular<Movie>>(
    "/movie/popular",
    {
      params: { page }, // TMDB uses page-based pagination
    }
  );
  return data;
}
