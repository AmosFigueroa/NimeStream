import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnimeById, getAnimeEpisodes, getStreamUrl } from '../services/animeService';
import { Anime, Episode, StreamingServer } from '../types';
import { Loader2, Server, ExternalLink, Play, Film, AlertTriangle, RefreshCw } from 'lucide-react';

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentServer, setCurrentServer] = useState<StreamingServer>(StreamingServer.TRAILER);
  const [selectedEp, setSelectedEp] = useState<number>(1);
  
  // State untuk stream dari backend
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [loadingStream, setLoadingStream] = useState(false);
  const [streamError, setStreamError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const animeData = await getAnimeById(parseInt(id));
        setAnime(animeData.data);
        
        setTimeout(async () => {
            const episodesData = await getAnimeEpisodes(parseInt(id));
            setEpisodes(episodesData.data);
            setLoading(false);
        }, 500);

      } catch (error) {
        console.error("Error fetching watch data", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Effect untuk menghandle perubahan server/episode
  useEffect(() => {
    const fetchStream = async () => {
      if (currentServer === StreamingServer.TRAILER) {
        setStreamUrl(anime?.trailer?.embed_url ? `${anime.trailer.embed_url}?autoplay=1&mute=0` : '');
        setStreamError(false);
        return;
      }

      if (!anime) return;

      setLoadingStream(true);
      setStreamError(false);
      setStreamUrl('');

      try {
        const result = await getStreamUrl(currentServer, anime.title, selectedEp);
        if (result.success && result.url) {
          setStreamUrl(result.url);
        } else {
          setStreamError(true);
        }
      } catch (e) {
        setStreamError(true);
      } finally {
        setLoadingStream(false);
      }
    };

    if (!loading && anime) {
      fetchStream();
    }
  }, [currentServer, selectedEp, anime, loading]);

  const handleServerChange = (server: StreamingServer) => {
    setCurrentServer(server);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-dark text-primary">
        <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );

  if (!anime) return null;

  return (
    <div className="min-h-screen pt-16 bg-dark text-slate-200">
      
      {/* Player Section */}
      <div className="w-full bg-black relative shadow-2xl z-20">
        <div className="max-w-7xl mx-auto">
            <div className="aspect-video w-full bg-slate-900 relative flex items-center justify-center overflow-hidden">
                
                {/* Loading Stream State */}
                {loadingStream && (
                  <div className="absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center text-white">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                    <p className="animate-pulse">Connecting to {currentServer.split(' ')[0]}...</p>
                  </div>
                )}

                {/* Video Player / Iframe */}
                {!loadingStream && !streamError && streamUrl ? (
                    <iframe 
                        key={streamUrl}
                        src={streamUrl}
                        title="Anime Player"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : null}

                {/* Error / Fallback State */}
                {!loadingStream && (streamError || (!streamUrl && !loadingStream)) && (
                   <div className="text-center text-slate-400 max-w-lg p-6 flex flex-col items-center">
                        <AlertTriangle className="w-16 h-16 mb-4 text-yellow-500 opacity-80" />
                        <h3 className="text-xl font-bold text-white mb-2">Stream Unavailable</h3>
                        <p className="mb-6">
                            {currentServer === StreamingServer.TRAILER 
                                ? "No official trailer available for this anime." 
                                : `Could not extract video directly from ${currentServer.split(' ')[0]}. Make sure the backend server is running.`}
                        </p>
                        
                        {currentServer !== StreamingServer.TRAILER && (
                             <div className="flex flex-col gap-3 w-full">
                                <p className="text-xs text-slate-500">Run <code className="bg-slate-800 px-1 py-0.5 rounded">node server.js</code> in backend folder.</p>
                                <a 
                                    href={streamUrl || `https://google.com/search?q=watch ${anime.title} ${currentServer.split(' ')[0]}`}
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="bg-primary hover:bg-violet-600 text-white px-6 py-2 rounded-full font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    Open {currentServer.split(' ')[0]} Manually <ExternalLink className="w-4 h-4" />
                                </a>
                             </div>
                        )}
                   </div>
                )}
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content Info */}
            <div className="lg:col-span-2 space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {anime.title_english || anime.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-primary font-medium text-lg">Episode {selectedEp}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-400">{anime.type}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-400">{anime.status}</span>
                    </div>
                </div>

                {/* Server Selection */}
                <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
                    <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm uppercase font-bold tracking-wider">
                        <Server className="w-4 h-4" /> Select Streaming Server
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {Object.values(StreamingServer).map((server) => {
                            const isSelected = currentServer === server;
                            
                            return (
                                <button
                                    key={server}
                                    onClick={() => handleServerChange(server)}
                                    className={`relative px-5 py-3 rounded-xl text-sm font-semibold transition-all border ${
                                        isSelected 
                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105 z-10' 
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:border-slate-600 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {server.includes('Scrape') ? server.split(' ')[0] : 'Official Trailer'}
                                    </div>
                                    {isSelected && (
                                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <h3 className="font-bold text-white mb-3">Synopsis</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                        {anime.synopsis}
                    </p>
                </div>
            </div>

            {/* Episode List */}
            <div className="lg:col-span-1">
                <div className="bg-slate-800/30 rounded-2xl border border-slate-700 overflow-hidden sticky top-24">
                    <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                        <h3 className="font-bold text-white">Episodes</h3>
                        <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">
                            {episodes.length > 0 ? episodes.length : '?'} Total
                        </span>
                    </div>
                    <div className="max-h-[600px] overflow-y-auto custom-scrollbar p-2 space-y-2">
                        {episodes.map((ep) => (
                            <button
                                key={ep.mal_id}
                                onClick={() => setSelectedEp(ep.mal_id)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all group border ${
                                    selectedEp === ep.mal_id 
                                    ? 'bg-primary/10 border-primary text-primary' 
                                    : 'bg-slate-900/50 border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm font-mono ${selectedEp === ep.mal_id ? 'text-primary' : 'opacity-50'}`}>
                                        EP {ep.mal_id}
                                    </span>
                                    <span className="text-sm font-medium truncate max-w-[150px]">
                                        {ep.title || `Episode ${ep.mal_id}`}
                                    </span>
                                </div>
                                <Play className={`w-4 h-4 ${selectedEp === ep.mal_id ? 'fill-current' : 'opacity-0 group-hover:opacity-100'}`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Watch;