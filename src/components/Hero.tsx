import React from "react";
import type { HeroInterface } from "../interface/interface";
import { IMAGE_BASE } from "../service/api";

const pickBackdrop = (path: string | null) =>
  path ? `${IMAGE_BASE}/w1280${path}}` : "";

const Hero: React.FC<HeroInterface> = ({ movie }) => {
  const bg = pickBackdrop(movie.backdrop_path);

  return (
    <section
      className='relative w-full h-[80vh] overflow-hidden'
      style={{
        backgroundImage: bg ? `url(${bg})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      aria-label={movie.title}
    >
      {/* Dark gradient overlay to keep text readable */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/100 via-black/60 to-transparent' />
      {/* Hero content */}
      <div className='relative z-10 h-full flex items-end'>
        <div className='max-w-6xl mx-auto px-4 md:px-8 pb-10'>
          <h2 className='text-white text-3xl md:text-5xl font-bold mb-4 drop-shadow'>
            {movie.title}
          </h2>
          {movie.overview && (
            <p className='max-w-2xl text-white/90 md:text-lg line-clamp-4 md:line-clamp-5'>
              {movie.overview}
            </p>
          )}
          {/* CTA buttons (optional) */}
          <div className='mt-6 flex gap-3'>
            <button className='px-5 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition'>
              ▶ Watch Trailer
            </button>
            <button className='px-5 py-2 text-white bg-gray-800/70 hover:bg-gray-700 rounded-lg font-semibold transition'>
              ℹ️ More Details
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
