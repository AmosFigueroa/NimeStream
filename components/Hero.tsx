import React from 'react';
import { Anime } from '../types';
import { Play, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  anime: Anime;
}

const Hero: React.FC<HeroProps> = ({ anime }) => {
  const navigate = useNavigate();
  
  // High res image or fallback
  const bgImage = anime.images.webp.large_image_url || anime.images.jpg.large_image_url;

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/40 to-transparent" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 md:pb-24">
        <div className="max-w-2xl space-y-4 animate-fade-in-up">
            <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                #{anime.rank} Trending
            </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-lg line-clamp-2">
            {anime.title_english || anime.title}
          </h1>
          
          <div className="flex items-center space-x-4 text-sm text-slate-300">
            <span className="flex items-center space-x-1">
                <span className="text-yellow-400">★</span>
                <span>{anime.score}</span>
            </span>
            <span>•</span>
            <span>{anime.year || 'N/A'}</span>
            <span>•</span>
            <span>{anime.episodes ? `${anime.episodes} eps` : 'Ongoing'}</span>
             <span>•</span>
            <span className="px-2 py-0.5 border border-slate-500 rounded text-xs">{anime.rating?.split(' ')[0] || 'PG-13'}</span>
          </div>

          <p className="text-slate-300 md:text-lg line-clamp-3 md:line-clamp-4 leading-relaxed max-w-xl">
            {anime.synopsis}
          </p>

          <div className="flex items-center space-x-4 pt-4">
            <button 
                onClick={() => navigate(`/watch/${anime.mal_id}`)}
                className="flex items-center space-x-2 bg-primary hover:bg-violet-600 text-white px-8 py-3 rounded-full font-bold transition-transform hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Watch Now</span>
            </button>
            <button 
                onClick={() => navigate(`/anime/${anime.mal_id}`)}
                className="flex items-center space-x-2 bg-slate-700/50 hover:bg-slate-700 text-white px-6 py-3 rounded-full font-medium backdrop-blur-sm transition-colors"
            >
              <Info className="w-5 h-5" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
