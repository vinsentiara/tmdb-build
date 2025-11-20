import type { CardInterface } from "../interface/interface";
import { IMAGE_BASE } from "../service/api";

const pickPoster = (path: string | null) =>
  path ? `${IMAGE_BASE}/w342${path}` : "";

const MovieCard: React.FC<CardInterface> = ({ movie }) => {
  const moviePoster = pickPoster(movie.poster_path);

  //Extract only the year
  const releaseYear = movie.release_date
    ? movie.release_date.split("-")[0]
    : "-";

  return (
    <section className='w-[216] flex flex-col text-white'>
      {/* Poster */}
      <div className='relative w-full aspect-[2/3] overflow-hidden rounded-lg shadow-md'>
        <img
          src={moviePoster}
          alt={movie.title}
          className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
          loading='lazy'
        />
      </div>

      {/* Info */}
      <div className='mt-2 flex flex-col gap-1'>
        {/* Title */}
        <h3 className='text-sm text-black font-medium line-clamp-2'>
          {movie.title}
        </h3>
        {/* Year and Rating */}
        <div className='flex justify-between text-xs text-gray-400'>
          <span>{releaseYear}</span>
          <span className='text-yellow-400'>
            ⭐ {movie.vote_average?.toFixed(1)}
          </span>
        </div>
      </div>
    </section>
  );
};

export default MovieCard;
