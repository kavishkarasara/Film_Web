"use client";

import { useState } from "react";
import Link from "next/link";
import { FiLogOut, FiPlus, FiSave, FiImage, FiLink, FiFilm, FiCheckCircle } from "react-icons/fi";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    img: "",
    rating: "",
    year: "",
    tags: "",
    link720p: "",
    link1080p: "",
    link4k: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    // Here normally we would send a POST request to an API route to update data.ts or a DB
    console.log("Movie Data Submitted:", formData);
    
    setSuccessMsg("Movie successfully added to the platform!");
    setTimeout(() => setSuccessMsg(""), 3000);
    
    setFormData({
      title: "",
      desc: "",
      img: "",
      rating: "",
      year: "",
      tags: "",
      link720p: "",
      link1080p: "",
      link4k: "",
    });
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
              <label className="block text-sm font-medium text-zinc-400 mb-2">Admin Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Enter password (hint: admin123)"
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
            <FiPlus className="text-primary" /> Add New Movie
          </h2>
          <p className="text-zinc-400">Fill in the details below to publish a new movie to the platform.</p>
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
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="e.g. Inception" />
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Description / Synopsis</label>
                <textarea required rows={4} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="Brief summary of the movie..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Release Year</label>
                <input type="text" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="e.g. 2024" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">IMDb Rating</label>
                <input type="text" required value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="e.g. 8.5" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Genres / Tags (comma separated)</label>
                <input type="text" required value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="Action, Sci-Fi, Thriller" />
              </div>
            </div>
          </div>

          {/* Media Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-primary border-b border-zinc-800 pb-2">
              <FiImage /> Media Assets
            </h3>
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-2">Poster Image URL</label>
              <input type="url" required value={formData.img} onChange={e => setFormData({...formData, img: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="https://..." />
            </div>
          </div>

          {/* Download Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-primary border-b border-zinc-800 pb-2">
              <FiLink /> Download Links
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">720p Download URL</label>
              <input type="url" required value={formData.link720p} onChange={e => setFormData({...formData, link720p: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="Mega / Google Drive link..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">1080p Download URL</label>
              <input type="url" required value={formData.link1080p} onChange={e => setFormData({...formData, link1080p: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="Mega / Google Drive link..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">4K UHD Download URL</label>
              <input type="url" required value={formData.link4k} onChange={e => setFormData({...formData, link4k: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-primary transition-colors" placeholder="Mega / Google Drive link..." />
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800 flex justify-end">
            <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold transition-transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-2 shadow-[0_0_15px_rgba(225,29,72,0.3)]">
              <FiSave /> Publish Movie
            </button>
          </div>
          
        </form>
      </main>
    </div>
  );
}
