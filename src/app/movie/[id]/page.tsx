"use client";

import Link from "next/link";
import { FiChevronDown, FiPlay, FiStar, FiThumbsUp, FiThumbsDown, FiDownload, FiShare2 } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

export default function MovieDetail() {
  const params = useParams();
  const [activeSeason, setActiveSeason] = useState("Season 1");
  const [movie, setMovie] = useState<any>(null);
  const [relatedMovies, setRelatedMovies] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState(() => "Guest" + Math.floor(Math.random() * 1000));
  const [scrolled, setScrolled] = useState(false);
  const [shareText, setShareText] = useState("Share");

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareText("Copied!");
      setTimeout(() => setShareText("Share"), 2000);
    } catch (err) {
      console.error("Failed to copy link");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (params.id) {
      const fetchMovie = async () => {
        const { data } = await supabase.from('movies').select('*').eq('id', params.id).single();
        if (data) {
          setMovie(data);
          
          // Fetch Comments
          const { data: commentsData } = await supabase.from('comments').select('*').eq('movie_id', data.id).order('created_at', { ascending: false });
          if (commentsData) setComments(commentsData);

          // Fetch related movies based on the first category
          let fetchedRelated = false;
          if (data.categories && data.categories.length > 0) {
            const { data: relatedData } = await supabase
              .from('movies')
              .select('*')
              .neq('id', data.id)
              .contains('categories', [data.categories[0]])
              .limit(5);
            
            if (relatedData && relatedData.length > 0) {
              setRelatedMovies(relatedData);
              fetchedRelated = true;
            }
          }
          
          if (!fetchedRelated) {
             const { data: fallbackData } = await supabase.from('movies').select('*').neq('id', data.id).order('created_at', { ascending: false }).limit(5);
             if (fallbackData) setRelatedMovies(fallbackData);
          }
        }
      };
      fetchMovie();
    }
  }, [params.id]);

  if (!movie) {
    return <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center text-white">Loading...</div>;
  }

  const handleCommentSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newComment.trim() !== '') {
      const { error } = await supabase.from('comments').insert([{
        movie_id: movie.id,
        user_name: userName,
        content: newComment.trim()
      }]);
      if (!error) {
        setNewComment("");
        const { data: commentsData } = await supabase.from('comments').select('*').eq('movie_id', movie.id).order('created_at', { ascending: false });
        if (commentsData) setComments(commentsData);
      }
    }
  };

  const AdBanner = ({ className = "" }: { className?: string }) => (
    <div className={`w-full bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center justify-center relative overflow-hidden group ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
      <div className="flex flex-col items-center gap-1 text-zinc-600">
        <span className="text-xs font-semibold uppercase tracking-widest">Advertisement</span>
        <span className="text-sm">Ad Space Available</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white font-sans relative">
      <div className="absolute top-0 left-0 right-0 h-[70vh] overflow-hidden -z-10 pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={movie.backdrop_url || movie.poster_url} alt="Backdrop" className="w-full h-full object-cover opacity-30 object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f0f11]/60 to-[#0f0f11]"></div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="px-10 md:px-20 lg:px-32 pt-32 pb-20 max-w-7xl mx-auto">
        
        {/* Movie Info Section */}
        <div className="flex flex-col md:flex-row gap-12 mb-16">
          {/* Poster */}
          <div className="w-full md:w-1/3 flex-shrink-0">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={movie.poster_url} 
              alt={movie.title} 
              className="w-full aspect-[2/3] object-cover rounded-xl shadow-2xl ring-1 ring-white/10"
            />
          </div>
          
          {/* Details */}
          <div className="w-full md:w-2/3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col md:flex-row items-start justify-between mb-6 gap-4">
              <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tight">{movie.title}</h1>
              <button 
                onClick={handleShare}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md font-semibold text-sm transition-colors flex items-center justify-center gap-2 border border-white/10 flex-shrink-0 mt-2 md:mt-0"
              >
                {shareText === "Share" ? <FiShare2 /> : <FiStar className="text-primary fill-current" />} {shareText}
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
              {movie.download_links && movie.download_links.length > 0 ? (
                movie.download_links.map((link: any, index: number) => (
                  <a target="_blank" rel="noopener noreferrer" href={`/gate?url=${encodeURIComponent(link.url)}`} key={index} className="flex-1 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold text-sm transition-transform hover:-translate-y-1 active:translate-y-0 flex flex-col items-center justify-center gap-1 shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                    <div className="flex items-center gap-2 text-base"><FiDownload className="text-lg" /> {link.label}</div>
                    <span className="text-xs text-white/70 font-normal">Provider: {link.provider}</span>
                  </a>
                ))
              ) : (
                <div className="text-zinc-500 italic py-4">No download links available yet.</div>
              )}
            </div>


            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium mb-8">
              {movie.categories?.map((tag: string, index: number) => (
                <span key={tag} className={index === 0 ? "px-3 py-1 bg-white text-black rounded-sm font-bold" : "px-3 py-1 border border-white/20 rounded-sm"}>{tag}</span>
              ))}
              <span className="text-zinc-400">{movie.release_year}</span>
              <span className="flex items-center gap-1 text-yellow-500"><FiStar className="fill-current"/> {movie.tmdb_rating}</span>
            </div>
            
            <p className="text-zinc-300 mb-10 leading-relaxed max-w-3xl text-sm whitespace-pre-line">
              {movie.description}
            </p>
            
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <span className="text-zinc-500 text-right">Country :</span>
                <span className="font-medium">United States</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <span className="text-zinc-500 text-right">Genre :</span>
                <span className="font-medium">{movie.categories?.join(", ")}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <span className="text-zinc-500 text-right">Release Date :</span>
                <span className="font-medium">{movie.release_year}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <span className="text-zinc-500 text-right">Production :</span>
                <span className="font-medium">CineVault Studios</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <span className="text-zinc-500 text-right">Cast :</span>
                <span className="font-medium text-zinc-300">Tim Robbins, Rebecca Ferguson, Avi Nash, Rashida Jones</span>
              </div>
            </div>
          </div>
        </div>






        {/* You may also like Section */}
        {relatedMovies.length > 0 && (
          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span> You may also like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {relatedMovies.map((item) => (
                <Link href={`/movie/${item.id}`} key={item.id} className="cursor-pointer group block">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden relative mb-2 ring-1 ring-white/10 group-hover:ring-primary/50 transition-all">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.poster_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <h4 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">{item.release_year}</span>
                    <span className="flex items-center gap-1 text-xs text-yellow-500"><FiStar className="fill-current"/> {item.tmdb_rating}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div>
          <h2 className="text-xl font-bold mb-8">Comments</h2>
          
          {/* Add Comment */}
          <div className="flex gap-4 mb-10">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-zinc-800">
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold mb-2">{userName}</p>
              <input 
                type="text" 
                placeholder="Write your comments here... (Press Enter to post)" 
                className="w-full bg-white text-black px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-primary/50" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleCommentSubmit}
              />
            </div>
          </div>
          
          {/* Comment List */}
          <div className="space-y-8">
            {comments.length === 0 ? (
              <p className="text-zinc-500 italic">No comments yet. Be the first to comment!</p>
            ) : comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-zinc-800">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_name}`} alt={comment.user_name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">{comment.user_name}</p>
                  <p className="text-xs text-zinc-500 mb-2">{new Date(comment.created_at).toLocaleDateString()}</p>
                  <p className="text-sm text-zinc-300 mb-3">{comment.content}</p>
                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <button className="flex items-center gap-1 hover:text-white transition-colors"><FiThumbsUp /> 0</button>
                    <button className="flex items-center gap-1 hover:text-white transition-colors"><FiThumbsDown /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
      
      {/* Footer */}
      <footer className="mt-20 py-16 border-t border-zinc-800/50 bg-[#0a0a0c]">
        <div className="px-10 md:px-20 lg:px-32 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
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
