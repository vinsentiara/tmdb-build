import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";

// utility to combine Tailwind class names safely and cleanly (cn: className)
function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * TMDB Navbar
 * - Desktop (md+): left => logo + Home + Favorite; right => search bar
 * - Mobile: left => logo; right => search icon + hamburger (menu with Home/Favorite)
 * - Scroll behavior: fully transparent at top; blurred translucent when scrolled
 */

export default function Navbar({
  onSearch,
}: {
  onSearch?: (q: string) => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close popovers when route change or on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
        setMobileSearchOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch?.(trimmed);
    // optionally navigate to search result route here
  };

  const shellClasses = useMemo(
    () =>
      cn(
        "fixed inset-x-0 top-0 z-50 h-14 transition-colors duration-300",
        // when scrolled: subtle translucent dark with blur + soft border
        isScrolled && "border-b border-white/10 bg-black/30 backdrop-blur-md"
      ),
    [isScrolled]
  );

  // render starts here
  return (
    <header className={shellClasses}>
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        {/* LEFT: Logo + (Desktop links) */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2"
            aria-label="Go to home"
          >
            <TMDBMark className="h-6 w-6" />
            <span className="hidden text-base font-semibold tracking-wide text-white/90 sm:inline">
              TMDB
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-4 md:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-1 text-sm font-medium",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/80 hover:text-white"
                )
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-1 text-sm font-medium",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/80 hover:text-white"
                )
              }
            >
              Favorite
            </NavLink>
          </div>
        </div>

        {/* RIGHT: Search (desktop) + Mobile action icons */}
        <div className="flex items-center gap-2">
          {/* Desktop search bar */}
          <form
            onSubmit={submitSearch}
            className="relative hidden w-80 items-center md:flex"
            role="search"
            aria-label="Search movies"
          >
            <SearchIcon className="pointer-events-none absolute left-3 h-4 w-4 text-white/60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-10 text-sm text-white placehlder-white/50 outline-none ring-0 backdrop-blur-sm focus:border-white/20 focus:bg-white/10"
            />
            <button
              type="submit"
              className="absolute right-1 rounded-full px-3 py-1 text-sm text-white/80 hover:text-white"
              aria-label="Submit search"
            >
              Go
            </button>
          </form>

          {/* Mobile: search icon */}
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-white/85 md:hidden"
            aria-label="Open search"
            onClick={() => {
              setMobileSearchOpen((v) => !v);
              setMobileOpen(false);
            }}
          >
            <SearchIcon className="h-6 w-6" />
          </button>

          {/* Mobile: hamburger */}
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-white/85 md:hidden"
            aria-label="Open menu"
            onClick={() => {
              setMobileOpen((v) => !v);
              setMobileSearchOpen(false);
            }}
          >
            <MenuIcon className="h6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile search panel */}
      {mobileSearchOpen && (
        <div className="mx-auto max-w-7xl px-4 md:hidden">
          <form
            onSubmit={(e) => {
              submitSearch(e);
              setMobileSearchOpen(false);
            }}
            className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/60 p-2 text-white backdrop-blur-md"
            role="search"
            aria-label="Search movies"
          >
            <SearchIcon className="h-5 w-5 text-white/70" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies..."
              className="flex-1 bg-transparent text-sm outline-none placeholder-white/50"
            />
            <button
              type="submit"
              className="rounded-lg px py-1 text-sm hover:bg-white/10"
            >
              Go
            </button>
          </form>
        </div>
      )}

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="mx-auto max-w-7xl px-4 md:hidden">
          <div className="mt-2 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-black/60 text-white backdrop-blur-md">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm hover:bg-white/10"
            >
              Home
            </Link>
            <Link
              to="/favorites"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm hover:bg-white/10"
            >
              Favorite
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* --- Simple inline SVG icons to avoid extra dependencies --- */
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 21l-4.3-4.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TMDBMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        className="fill-cyan-500"
      />
      <path
        d="M7 8h2v8H7zM11 8h2l3 4V8h2v8h-2l-3-4v4h-2z"
        className="fill-white"
      />
    </svg>
  );
}

/*
USAGE
------
1) Place <Navbar onSearch={(q)=> console.log(q)} /> at the top-level of your app, e.g. in App.tsx.
2) Ensure your page content has top padding to not sit under the fixed navbar, e.g. <main className="pt-14">...</main>
3) The navbar is fully transparent at the very top. Once you scroll, it gets a blurred translucent background (bg-black/30 + backdrop-blur-md). Adjust the classes inside shellClasses for stronger/weaker effect.
4) Mobile: only logo + search + hamburger are shown on the bar. Tapping the search icon reveals a slide-down search field; tapping the hamburger reveals Home/Favorite links.
*/
