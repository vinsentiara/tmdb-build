import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getNowPlayingMovies, getTrendingMovies } from "../service/api";
import Hero from "../components/Hero";
import type { MovieInterface } from "../interface/interface";
import MovieCard from "../components/MovieCard";
import PopularGrid from "../components/PopularGrid";

const Home = () => {
  //Hero section state
  const [movies, setMovies] = useState<MovieInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  //Load once
  useEffect(() => {
    const loadNowPlayingMovies = async () => {
      try {
        const nowPlayingMovies = await getNowPlayingMovies();
        // Ensure we have an array of Movie; take first 10 for the slider
        setMovies(
          Array.isArray(nowPlayingMovies) ? nowPlayingMovies.slice(0, 10) : []
        );
      } catch (err) {
        console.log(err);
        setError("Failed to load now playing movies...");
      } finally {
        setLoading(false);
      }
    };
    loadNowPlayingMovies();
  }, []);

  //Guard: if less than 1 item, reset index
  useEffect(() => {
    if (movies.length > 0 && index >= movies.length) setIndex(0);
  }, [movies, index]);

  const current = useMemo(
    () => (movies.length ? movies[index] : null),
    [movies, index]
  );

  const next = useCallback(() => {
    setIndex((i) => (movies.length ? (i + 1) % movies.length : 0));
  }, [movies.length]);
  const prev = useCallback(() => {
    setIndex((i) =>
      movies.length ? (i - 1 + movies.length) % movies.length : 0
    );
  }, [movies.length]);

  // Auto-advance every 10s.
  useEffect(() => {
    if (!movies.length) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [movies, next]);

  // Keyboard support (← / →)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [movies, next, prev]);

  // ---------------- TRENDING (trending/week, 20) ----------------
  const [trending, setTrending] = useState<MovieInterface[]>([]);
  const [trendingError, setTrendingError] = useState<string | null>(null);
  const [trendingLoading, setTrendingLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const list = await getTrendingMovies();
        setTrending(Array.isArray(list) ? list.slice(0, 20) : []);
      } catch (err) {
        console.log(err);
        setTrendingError("Failed to load trending movies...");
      } finally {
        setTrendingLoading(false);
      }
    };
    loadTrending();
  }, []);

  // Slider refs/state for trending
  const trendingRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trendingRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  const scrollTrending = useCallback((dir: 1 | -1) => {
    const el = trendingRef.current;
    if (!el) return;

    const firstCard = el.querySelector<HTMLElement>("[data-card]");
    const cardWidth = firstCard?.offsetWidth ?? 240;

    const vw = window.innerWidth;
    const cardsPerSwipe = vw < 640 ? 1 : vw < 1024 ? 2 : 5;

    el.scrollBy({ left: dir * cardWidth * cardsPerSwipe, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = trendingRef.current;
    if (!el) return;

    updateArrows();
    const onScroll = () => updateArrows();
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => updateArrows();
    window.addEventListener("resize", onResize);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [updateArrows]);

  useEffect(() => {
    updateArrows();
  }, [trending, updateArrows]);

  // RENDER--------------------------------------------
  return (
    <div className="relative bg-black">
      {error && (
        <div className="px-4 py-3 rounded-lg text-red-500 bg-red-500/15 border border-red-500/40">
          {error}
        </div>
      )}

      {loading ? (
        <div className="h-[80vh] flex items-center justify-center">
          <h1 className="text-lg text-gray-300">Loading...</h1>
        </div>
      ) : current ? (
        <div className="relative">
          {/* Top-left / Top-right buttons */}
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute z-20 top-1/2 left-4 rounded-full scale-y-200 w-10 h-10 text-white/50 grid place-items-center hover:text-white duration-300"
          >
            &lt;
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute z-20 top-1/2 right-4 rounded-full scale-y-200 w-10 h-10 text-white/50 grid place-items-center hover:text-white duration-300"
          >
            &gt;
          </button>

          {/* single visible slide */}
          <Hero movie={current} />

          {/* Doots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {movies.map((m, i) => (
              <button
                key={m.id}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`w-2.5 h-2.5 rounded-full ${
                  i === index ? "bg-white" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="h-[80vh] flex items-center justify-center text-gray-400">
          No movies foound
        </div>
      )}

      {/* Next section start from this line */}
      {/* for example  <section className="px-4 py-8">...</section> */}

      {/* Trending now section starts here */}
      <section className="px-4 py-8">
        <div className="flex items-center justify-between mb-4 h-">
          <h2 className="text-xl md:text-2xl font-semibold text-white/90">
            Trending Now
          </h2>
        </div>
        {trendingError && (
          <p className="mb-4 text-sm text-red-400">{trendingError}</p>
        )}
        {trendingLoading ? (
          <p className="text-gray-400">Loading trending...</p>
        ) : trending.length ? (
          <div className="relative">
            {/* Left button (middle-left) */}
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollTrending(-1)}
              disabled={!canLeft}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full grid place-items-center bg-gray-800 text-white/50 hover:text-white opacity-50 disabled:opacity-20 disabled:cursor-not-allowed`}
            >
              &lt;
            </button>
            {/* Track */}
            <div
              ref={trendingRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [--cols:5]"
              style={{ WebkitOverflowScrolling: "touch" }}
              onLoad={updateArrows}
            >
              {trending.slice(0, 20).map((m) => (
                <div
                  key={m.id}
                  data-card
                  className="snap-start flex-none basis-[calc(100%/var(--cols))]"
                >
                  <div className="h-full">
                    <MovieCard movie={m} />
                  </div>
                </div>
              ))}
            </div>

            {/* Right button (middle-right) */}
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollTrending(1)}
              disabled={!canRight}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full grid place-items-center bg-gray-800 text-white/50 hover:text-white opacity-50 disabled:opacity-20 disabled:cursor-not-allowed`}
            >
              &gt;
            </button>
          </div>
        ) : (
          <p className="text-gray-400">No trending movies found</p>
        )}
      </section>
      <section className="py-8">
        <PopularGrid />
      </section>
    </div>
  );
};

export default Home;
