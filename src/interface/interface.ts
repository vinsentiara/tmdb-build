export interface MovieInterface {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
  vote_average: number | null;
}

export interface HeroInterface {
  movie: MovieInterface;
}

export interface CardInterface {
  movie: MovieInterface;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface TMDBResponsePopular<T> {
  page: number; // current page
  results: T[]; // items for this page
  total_pages: number; // total pages available
  total_results: number; // total items available
}
