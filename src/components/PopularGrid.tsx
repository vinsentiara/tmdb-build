import { useInfiniteQuery } from "@tanstack/react-query";
import { getPopular } from "../service/api";
import MovieCard from "./MovieCard";

export default function PopularGrid() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["popular"],
    queryFn: ({ pageParam }) => getPopular(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const next = lastPage.page + 1;
      return next <= lastPage.total_pages ? next : undefined;
    },
  });

  // Safely flatten all pages into one array of Movie
  const movies = data?.pages.flatMap((page) => page.results) ?? [];

  if (isLoading)
    return <div className='p-4 text-amber-900'>Loading popular movies...</div>;
  if (isError) return <div className='p-4 text-red-500'>{error.message}</div>;

  return (
    <div className='p-4'>
      <h2 className='mb-4 text-xl font-semibold text-white'>Popular Movies</h2>

      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5'>
        {/* This part will use a reusable card component */}
        {movies.map((m) => (
          <div key={m.id}>
            <MovieCard movie={m} />
          </div>
        ))}

        {/* {movies.map((m) => (
          <div key={m.id} className='rounded-lg overflow-hidden bg-neutral-900'>
            
          </div>
        ))} */}

        {/* The part below is making a card inside PopularGrid component */}
        {/* {movies.map((m) => (
          <div key={m.id} className='rounded-lg overflow-hidden bg-neutral-900'>
            {m.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w342${m.poster_path}`}
                alt={m.title}
                className='w-full h-auto'
                loading='lazy'
              />
            ) : (
              <div className='aspect-[2/3] bg-neutral-800' />
            )}
            <div className='p-2'>
              <h3 className='text-sm font-medium line-clamp-2'>{m.title}</h3>
              <p className='mt-1 text-xs opacity-70'>
                {m.release_date.slice(0, 4)} • ⭐ {m.vote_average.toFixed(1)}
              </p>
            </div>
          </div>
        ))} */}
      </div>

      {/* using button to load more. If using auto load scroll (infinite scrolling), can be done using intersection observer */}
      <div className='mt-6 flex justify-center'>
        {hasNextPage ? (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className='px-4 py-2 text-white border-white/50 rounded-md bg-white/10 hover:bg-white/20 transition'
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        ) : (
          <span className='opacity-60'>No more pages</span>
        )}
      </div>
    </div>
  );
}
