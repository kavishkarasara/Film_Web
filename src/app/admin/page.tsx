"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiLogOut, FiPlus, FiSave, FiImage, FiLink, FiFilm, FiCheckCircle, FiStar, FiList } from "react-icons/fi";
import { supabase } from "@/lib/supabase";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [moviesList, setMoviesList] = useState<any[]>([]);

  const fetchMovies = async () => {
    const { data, error } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
    if (data) {
      setMoviesList(data);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    img: "",
    backdrop: "",
    rating: "",
    year: "",
    tags: "",
    link720p: "",
    link1080p: "",
    link4k: "",
    linkDirect: "",
    isHero: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Connect to actual Supabase Authentication
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (signInError) {
      setError(signInError.message);
    } else if (data.session) {
      setIsAuthenticated(true);
    }
  };

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const tagsArray = formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
    
    const download_links = [];
    if (formData.link720p) download_links.push({ quality: '720p', provider: 'other', url: formData.link720p, label: '720p' });
    if (formData.link1080p) download_links.push({ quality: '1080p', provider: 'other', url: formData.link1080p, label: '1080p' });
    if (formData.link4k) download_links.push({ quality: '4K', provider: 'other', url: formData.link4k, label: '4K' });
    if (formData.linkDirect) download_links.push({ quality: 'Direct', provider: 'other', url: formData.linkDirect, label: 'Direct Download' });

    const moviePayload = {
      title: formData.title,
      description: formData.desc,
      poster_url: formData.img,
      backdrop_url: formData.backdrop,
      tmdb_rating: parseFloat(formData.rating) || 0,
      release_year: formData.year,
      categories: tagsArray,
      download_links: download_links,
      is_hero: formData.isHero,
    };

    if (editingMovieId) {
      const { error } = await supabase.from('movies').update(moviePayload).eq('id', editingMovieId);
      if (error) {
        console.error(error);
        alert("Failed to update movie: " + error.message);
        return;
      }
      setSuccessMsg("Movie successfully updated!");
    } else {
      const { error } = await supabase.from('movies').insert([moviePayload]);
      if (error) {
        console.error(error);
        alert("Failed to add movie: " + error.message);
        return;
      }
      setSuccessMsg("Movie successfully added to the platform!");
    }
    
    setTimeout(() => setSuccessMsg(""), 3000);

    setFormData({
      title: "",
      desc: "",
      img: "",
      backdrop: "",
      rating: "",
      year: "",
      tags: "",
      link720p: "",
      link1080p: "",
      link4k: "",
      linkDirect: "",
      isHero: false,
    });
    setEditingMovieId(null);
    fetchMovies();
  };

  const handleAutoFill = async () => {
    if (!formData.title) {
      alert("Please enter a movie title first!");
      return;
    }
    
    try {
      const response = await fetch(`https://yts.mx/api/v2/list_movies.json?query_term=${encodeURIComponent(formData.title)}`);
      const data = await response.json();
      
      if (data.data && data.data.movies && data.data.movies.length > 0) {
        const movie = data.data.movies[0]; // get the first result
        setFormData(prev => ({
          ...prev,
          title: movie.title,
          desc: movie.description_full || movie.synopsis || "",
          year: movie.year?.toString() || "",
          rating: movie.rating?.toString() || "",
          tags: movie.genres ? movie.genres.join(", ") : "",
          img: movie.large_cover_image || "",
          backdrop: movie.background_image || ""
        }));
        setSuccessMsg(`Auto-filled details for: ${movie.title} ✅`);
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        alert("Movie not found in the database. Please fill manually.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch movie details. Please try manually.");
    }
  };

  const handleEditClick = (movie: any) => {
    setEditingMovieId(movie.id);
    
    // Parse links back into form
    let link720p = "", link1080p = "", link4k = "", linkDirect = "";
    if (movie.download_links && Array.isArray(movie.download_links)) {
      movie.download_links.forEach((link: any) => {
        if (link.quality === '720p') link720p = link.url;
        if (link.quality === '1080p') link1080p = link.url;
        if (link.quality === '4K') link4k = link.url;
        if (link.quality === 'Direct') linkDirect = link.url;
      });
    }

    setFormData({
      title: movie.title || "",
      desc: movie.description || "",
      img: movie.poster_url || "",
      backdrop: movie.backdrop_url || "",
      rating: movie.tmdb_rating?.toString() || "",
      year: movie.release_year || "",
      tags: movie.categories ? movie.categories.join(", ") : "",
      link720p,
      link1080p,
      link4k,
      linkDirect,
      isHero: movie.is_hero || false, 
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-500"></div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tighter text-primary mb-2">CINE<span className="text-white">VAULT</span></h1>
            <p className="text-zinc-400 font-medium text-sm tracking-widest uppercase">Admin Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 transition-all mb-4"
                placeholder="Enter email"
                required
              />
              <label className="block text-sm font-medium text-zinc-400 mb-2">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Enter password"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-transform hover:-translate-y-1 active:translate-y-0 shadow-[0_0_15px_rgba(225,29,72,0.3)]">
              Secure Login
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-zinc-500 hover:text-white transition-colors">Return to Website</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white font-sans">
      {/* Admin Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-8 py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-black tracking-tighter text-primary">CINE<span className="text-white">VAULT</span></Link>
          <span className="px-2 py-1 bg-zinc-800 text-xs font-bold uppercase tracking-wider rounded text-zinc-400">Admin</span>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <FiLogOut /> Logout
        </button>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <FiPlus className="text-primary" /> {editingMovieId ? "Edit Movie" : "Add New Movie"}
          </h2>
          <p className="text-zinc-400">
            {editingMovieId ? "Update the details of the selected movie." : "Fill in the details below to publish a new movie to the platform."}
          </p>
        </div>

        {successMsg && (
          <div className="mb-8 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3 text-green-400 font-medium">
            <FiCheckCircle className="text-xl" /> {successMsg}
          </div>
        )}

        <form onSubmit={handleAddMovie} className="space-y-8 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">

          {/* General Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-primary border-b border-zinc-800 pb-2">
              <FiFilm /> Movie Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Movie Title</label>
                <div className="flex gap-2">
                  <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="flex-1 bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="e.g. Inception" />
                  <button type="button" onClick={handleAutoFill} className="bg-primary hover:bg-primary/90 text-black px-6 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(163,230,53,0.3)] flex items-center justify-center whitespace-nowrap">
                    ✨ Auto Fill
                  </button>
                </div>
                <p className="text-xs text-zinc-500 mt-2">Type the name and click Auto Fill to instantly generate the description, tags, year, and images!</p>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Description / Synopsis</label>
                <textarea required rows={4} value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="Brief summary of the movie..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Release Year</label>
                <input type="text" required value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="e.g. 2024" />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">IMDb Rating</label>
                <input type="text" required value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="e.g. 8.5" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Genres / Tags (comma separated)</label>
                <input type="text" required value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="Action, Sci-Fi, Thriller" />
              </div>

              <div className="col-span-1 md:col-span-2 flex items-center gap-3 bg-zinc-950 p-4 rounded-lg border border-zinc-800 mt-2">
                <input 
                  type="checkbox" 
                  id="isHero"
                  checked={formData.isHero} 
                  onChange={e => setFormData({ ...formData, isHero: e.target.checked })} 
                  className="w-5 h-5 accent-primary cursor-pointer" 
                />
                <label htmlFor="isHero" className="text-sm font-medium text-white cursor-pointer flex items-center gap-2">
                  <FiStar className={formData.isHero ? "text-primary" : "text-zinc-500"} /> 
                  Show on Homepage Moving Slider (Hero Section)
                </label>
              </div>
            </div>
          </div>

          {/* Media Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-primary border-b border-zinc-800 pb-2">
              <FiImage /> Media Assets
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Poster Image URL (Vertical)</label>
                <input type="url" required value={formData.img} onChange={e => setFormData({ ...formData, img: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Cover Photo URL (Horizontal - Optional)</label>
                <input type="url" value={formData.backdrop} onChange={e => setFormData({ ...formData, backdrop: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="https://..." />
              </div>
            </div>
          </div>

          {/* Download Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-primary border-b border-zinc-800 pb-2">
              <FiLink /> Download Links
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">720p Download URL (Optional)</label>
                <input type="url" value={formData.link720p} onChange={e => setFormData({ ...formData, link720p: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="Mega / Google Drive link..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">1080p Download URL (Optional)</label>
                <input type="url" value={formData.link1080p} onChange={e => setFormData({ ...formData, link1080p: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="Mega / Google Drive link..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">4K UHD Download URL (Optional)</label>
                <input type="url" value={formData.link4k} onChange={e => setFormData({ ...formData, link4k: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="Mega / Google Drive link..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Direct Download URL (Optional)</label>
                <input type="url" value={formData.linkDirect} onChange={e => setFormData({ ...formData, linkDirect: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="Direct link..." />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800 flex justify-end gap-4">
            {editingMovieId && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingMovieId(null);
                  setFormData({ title: "", desc: "", img: "", backdrop: "", rating: "", year: "", tags: "", link720p: "", link1080p: "", link4k: "", linkDirect: "", isHero: false });
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-lg font-bold transition-colors"
              >
                Cancel Edit
              </button>
            )}
            <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold transition-transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-2 shadow-[0_0_15px_rgba(225,29,72,0.3)]">
              <FiSave /> {editingMovieId ? "Update Movie" : "Publish Movie"}
            </button>
          </div>

        </form>

        {/* Added Movies Section */}
        <div className="mt-16 mb-6">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <FiList className="text-primary" /> Currently Added Movies
          </h2>
          <p className="text-zinc-400">Manage and view all the movies currently available on the platform.</p>
        </div>

        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Movie</th>
                  <th className="p-4 font-semibold">Year</th>
                  <th className="p-4 font-semibold">Rating</th>
                  <th className="p-4 font-semibold text-center">Slider / Hero</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {moviesList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      No movies found in database. Add one above!
                    </td>
                  </tr>
                ) : moviesList.map((movie: any, index: number) => (
                  <tr key={movie.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 flex items-center gap-4">
                      <div className="w-12 h-16 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                        {movie.poster_url && <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-bold text-white">{movie.title}</p>
                        <p className="text-xs text-zinc-500 line-clamp-1 max-w-xs">
                          {movie.categories ? movie.categories.join(", ") : ""}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-300">{movie.release_year}</td>
                    <td className="p-4 text-zinc-300">
                      <span className="flex items-center gap-1"><FiStar className="text-yellow-500 text-xs" /> {movie.tmdb_rating}</span>
                    </td>
                    <td className="p-4 text-center">
                      {movie.is_hero ? (
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-primary/20 text-primary text-xs font-bold border border-primary/30">
                          YES
                        </span>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleEditClick(movie)} 
                        className="text-sm text-zinc-400 hover:text-white transition-colors underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
