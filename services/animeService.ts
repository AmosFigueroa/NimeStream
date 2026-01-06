import { JikanResponse, Anime, Episode } from '../types';

const BASE_URL = 'https://api.jikan.moe/v4';
const BACKEND_URL = 'http://localhost:5000/api'; // URL Backend Lokal

// Helper for delay to avoid rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getTopAnime = async (page = 1): Promise<JikanResponse<Anime[]>> => {
  await delay(300); // Gentle rate limit handling
  const response = await fetch(`${BASE_URL}/top/anime?page=${page}&filter=bypopularity`);
  if (!response.ok) throw new Error('Failed to fetch top anime');
  return response.json();
};

export const getSeasonNow = async (page = 1): Promise<JikanResponse<Anime[]>> => {
  await delay(300);
  const response = await fetch(`${BASE_URL}/seasons/now?page=${page}`);
  if (!response.ok) throw new Error('Failed to fetch seasonal anime');
  return response.json();
};

export const searchAnime = async (query: string, page = 1): Promise<JikanResponse<Anime[]>> => {
  await delay(300);
  const response = await fetch(`${BASE_URL}/anime?q=${query}&page=${page}&sfw`);
  if (!response.ok) throw new Error('Failed to search anime');
  return response.json();
};

export const getAnimeById = async (id: number): Promise<{ data: Anime }> => {
  await delay(300);
  const response = await fetch(`${BASE_URL}/anime/${id}`);
  if (!response.ok) throw new Error('Failed to fetch anime details');
  return response.json();
};

export const getAnimeEpisodes = async (id: number, page = 1): Promise<JikanResponse<Episode[]>> => {
  await delay(300);
  const response = await fetch(`${BASE_URL}/anime/${id}/episodes?page=${page}`);
  if (!response.ok) throw new Error('Failed to fetch episodes');
  return response.json();
};

export const getAnimeRecommendations = async (id: number): Promise<{ data: { entry: Anime }[] }> => {
  await delay(300);
  const response = await fetch(`${BASE_URL}/anime/${id}/recommendations`);
  if (!response.ok) throw new Error('Failed to fetch recommendations');
  return response.json();
};

// Fungsi baru untuk memanggil backend scraping
export const getStreamUrl = async (server: string, title: string, episode: number): Promise<{ success: boolean; url: string }> => {
  try {
    const response = await fetch(`${BACKEND_URL}/stream?server=${encodeURIComponent(server)}&title=${encodeURIComponent(title)}&episode=${episode}`);
    if (!response.ok) throw new Error('Backend offline');
    return response.json();
  } catch (error) {
    console.error("Stream fetch error:", error);
    return { success: false, url: '' };
  }
};