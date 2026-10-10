"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiBell, FiDownload, FiStar, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

function MovieRow({ id, title, desc, movies }: { id: string, title: string, desc: string, movies: any[] }) {
  return (
    <section id={id} className="px-10 md:px-20 lg:px-32 py-10 relative z-20 scroll-mt-24">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-1">{title}</h2>
          <p className="text-sm text-zinc-500">{desc}</p>
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 hover:text-white transition-colors text-zinc-400"><FiChevronLeft /></button>
          <button className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 hover:text-white transition-colors text-zinc-400"><FiChevronRight /></button>
        </div>
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-6 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {movies.map((movie) => (
          <Link href={`/movie/${movie.id}`} key={movie.id} className="min-w-[200px] md:min-w-[240px] snap-start group relative rounded-2xl overflow-hidden bg-zinc-900 aspect-[2/3] cursor-pointer ring-1 ring-white/10 hover:ring-primary/50 transition-all duration-300 hover:-translate-y-2 shadow-xl flex-shrink-0 block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={movie.poster_url} alt={movie.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
            
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-bold text-white mb-1 truncate">{movie.title}</h3>
                <div className="flex items-center gap-3 text-xs font-medium">
                  <span className="flex items-center gap-1 text-yellow-500"><FiStar className="fill-current"/> {movie.tmdb_rating}</span>
                  <span className="text-zinc-400">{movie.release_year}</span>
                </div>
              </div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300 shadow-lg backdrop-blur-md">
              <FiDownload className="text-2xl" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroMovies, setHeroMovies] = useState<any[]>([]);
  const [moviesList, setMoviesList] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [newPopular, setNewPopular] = useState<any[]>([]);

  const AdBanner = ({ className = "" }: { className?: string }) => (
    <div className={`w-full bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center justify-center relative overflow-hidden group ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
      <div className="flex flex-col items-center gap-1 text-zinc-600">
        <span className="text-xs font-semibold uppercase tracking-widest">Advertisement</span>
        <span className="text-sm">Ad Space Available</span>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchHomeData = async () => {
      const { data } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
      if (data) {
        setMoviesList(data);
        setHeroMovies(data.filter((m: any) => m.is_hero));
        
        const top = [...data].sort((a: any, b: any) => b.tmdb_rating - a.tmdb_rating).slice(0, 10);
        setTopRated(top);
        
        const newPop = [...data].sort((a: any, b: any) => parseInt(b.release_year || '0') - parseInt(a.release_year || '0')).slice(0, 10);
        setNewPopular(newPop);
      }
    };
    fetchHomeData();
  }, []);

  useEffect(() => {
    if (heroMovies.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroMovies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroMovies.length]);

  const hero = heroMovies[currentSlide];

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white font-sans selection:bg-primary/30">
      <Navbar />

      {/* Hero Section Carousel */}
      <section className="relative w-full min-h-[90vh] md:min-h-screen flex items-center px-10 md:px-20 lg:px-32 mt-0 overflow-hidden">
        {heroMovies.length === 0 ? (
           <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
             No Hero Movies configured yet. Add them in the Admin Panel!
           </div>
        ) : heroMovies.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 z-0">
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={slide.poster_url} 
                alt={slide.title} 
                className={`w-full h-full object-cover opacity-60 transition-transform duration-[10s] ease-out ${index === currentSlide ? 'scale-105' : 'scale-100'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-[#0f0f11]/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f11] via-[#0f0f11]/60 to-transparent"></div>
            </div>
            
            <div className="relative z-10 max-w-2xl h-full flex flex-col justify-center px-10 md:px-20 lg:px-32 absolute inset-0 pt-20 pb-16">
              <div className="flex items-center gap-3 mb-4 animate-fade-in-up">
                {slide.categories && slide.categories.slice(0,3).map((tag: string) => (
                  <span key={tag} className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary rounded-full border border-primary/30">{tag}</span>
                ))}
                <span className="flex items-center gap-1 text-xs font-bold text-yellow-500"><FiStar className="fill-current"/> {slide.tmdb_rating}</span>
                <span className="text-xs font-semibold text-zinc-400">{slide.release_year}</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                {slide.title.split(' ')[0]} {slide.title.split(' ')[1]}<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">{slide.title.split(' ').slice(2).join(' ')}</span>
              </h1>
              
              <p className="text-lg text-zinc-300 mb-8 max-w-xl leading-relaxed animate-fade-in-up line-clamp-3" style={{ animationDelay: '200ms' }}>
                {slide.description}
              </p>
              
              <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <Link href={`/movie/${slide.id}`} className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                  <FiDownload className="text-xl" />
                  Download Now
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-12 left-10 md:left-20 lg:left-32 z-20 flex gap-2">
          {heroMovies.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-zinc-600 hover:bg-zinc-400'}`}
            />
          ))}
        </div>
      </section>

      {/* Categories matching the navbar */}
      <div className="relative z-20 pb-10">
        <MovieRow id="movies" title="Movies" desc="Explore top downloaded and critically acclaimed films." movies={moviesList} />
        
        {/* Ad Banner Homepage */}
        <div className="px-10 md:px-20 lg:px-32 my-6">
          <AdBanner className="h-28 max-w-5xl mx-auto" />
        </div>

        <MovieRow id="top-rated" title="Top Rated Movies" desc="The highest rated films of all time." movies={topRated} />
        <MovieRow id="new-popular" title="New & Popular" desc="The latest and most trending releases right now." movies={newPopular} />
      </div>
      
      {/* Footer */}
      <footer className="mt-20 py-16 border-t border-zinc-800/50 bg-[#0a0a0c]">
        <div className="px-10 md:px-20 lg:px-32 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="text-3xl font-black tracking-tighter text-primary">CINE<span className="text-white">VAULT</span></Link>
            <p className="text-zinc-500 text-sm max-w-xs text-center md:text-left">Your ultimate destination for cinematic experiences. Watch, review, and discover your next favorite movie.</p>
          </div>
          <div className="flex gap-8 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">FAQ</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <div className="mt-12 text-center text-zinc-600 text-xs">
          <p>&copy; {new Date().getFullYear()} CineVault Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
