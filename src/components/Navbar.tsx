"use client";

import Link from "next/link";
import { FiSearch, FiBell, FiX, FiPlay } from "react-icons/fi";
import { useState, useEffect } from "react";
import { ALL_MOVIES } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchResults = searchQuery.trim() === "" 
    ? [] 
    : ALL_MOVIES.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-300 ${scrolled ? 'bg-[#0f0f11]/95 backdrop-blur-md shadow-lg shadow-black/50 border-b border-white/5' : 'bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm'}`}>
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-black tracking-tighter text-primary">CINE<span className="text-white">VAULT</span></Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
            <Link href="/" className="text-white hover:text-white transition-colors">Home</Link>
            <Link href="/#movies" className="hover:text-white transition-colors">Movies</Link>
            <Link href="/#top-rated" className="hover:text-white transition-colors">Top Rated</Link>
            <Link href="/#new-popular" className="hover:text-white transition-colors">New & Popular</Link>
          </div>
        </div>
        <div className="flex items-center gap-6 text-xl text-zinc-300">
          <button onClick={() => setSearchOpen(true)} className="hover:text-white transition-colors"><FiSearch /></button>
          <button className="hover:text-white transition-colors"><FiBell /></button>
        </div>
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex flex-col items-center pt-32 px-10">
          <button onClick={() => setSearchOpen(false)} className="absolute top-10 right-10 text-3xl text-zinc-400 hover:text-white transition-colors">
            <FiX />
          </button>
          
          <div className="w-full max-w-3xl relative">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-zinc-400" />
            <input 
              type="text" 
              autoFocus
              placeholder="Search for movies, genres, or keywords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white text-xl px-16 py-6 rounded-2xl outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-2xl"
            />
          </div>

          <div className="w-full max-w-5xl mt-12 overflow-y-auto max-h-[60vh] pb-20 custom-scrollbar">
            {searchQuery && searchResults.length === 0 ? (
              <p className="text-center text-zinc-500 mt-10 text-lg">No movies found for &quot;{searchQuery}&quot;</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {searchResults.map((movie) => (
                  <Link 
                    href={`/movie/${movie.id}`} 
                    key={movie.id} 
                    onClick={() => setSearchOpen(false)}
                    className="group relative rounded-xl overflow-hidden aspect-[2/3] bg-zinc-900 ring-1 ring-white/10 hover:ring-primary/50 transition-all shadow-xl"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={movie.img} alt={movie.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                      <h3 className="text-sm font-bold text-white mb-1 truncate">{movie.title}</h3>
                      <span className="text-xs text-yellow-500 font-medium">★ {movie.rating}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
