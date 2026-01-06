const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// User-Agent palsu agar tidak diblokir situs target
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
};

// Helper function untuk format judul pencarian
const formatQuery = (title) => encodeURIComponent(title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim());

/**
 * Endpoint utama untuk mendapatkan link stream
 * Query Params: server (kurama/samehadaku), title, episode
 */
app.get('/api/stream', async (req, res) => {
  const { server, title, episode } = req.query;

  if (!server || !title) {
    return res.status(400).json({ error: 'Missing server or title' });
  }

  try {
    let streamUrl = '';

    if (server.includes('Kurama')) {
      streamUrl = await scrapeKurama(title, episode);
    } else if (server.includes('Samehadaku')) {
      streamUrl = await scrapeSamehadaku(title, episode);
    } else if (server.includes('MovieBox')) {
      streamUrl = await scrapeMoviebox(title, episode);
    } else {
        return res.status(400).json({ error: 'Unknown server' });
    }

    if (streamUrl) {
      res.json({ success: true, url: streamUrl });
    } else {
      res.status(404).json({ success: false, message: 'Video not found or extraction failed.' });
    }
  } catch (error) {
    console.error('Scraping Error:', error.message);
    res.status(500).json({ success: false, error: 'Server error during scraping' });
  }
});

// --- LOGIKA SCRAPING SEDERHANA ---
// Note: Logika ini bersifat "best-effort" karena situs target sering berubah struktur.

async function scrapeKurama(title, episode) {
  try {
    // 1. Cari Anime
    const searchUrl = `https://v9.kuramanime.tel/anime?search=${formatQuery(title)}`;
    const { data: searchHtml } = await axios.get(searchUrl, { headers: HEADERS });
    const $ = cheerio.load(searchHtml);
    
    // Ambil link hasil pencarian pertama
    const firstResultLink = $('.product__item__text a').first().attr('href');
    if (!firstResultLink) return null;

    // 2. Buka Halaman Detail Anime
    // Kuramanime biasanya punya list episode di bawah
    // Kita asumsikan format URL episode (butuh logika lebih kompleks untuk produksi)
    // Untuk demo: kita ambil iframe dari halaman detail jika ada (misal episode 1) atau kembalikan link
    
    // Mengembalikan link pencarian langsung sebagai fallback "embed" jika scraping detail gagal
    // Karena kurama butuh login/token untuk video sebenarnya
    return searchUrl; 
  } catch (e) {
    return null;
  }
}

async function scrapeSamehadaku(title, episode) {
  try {
    // 1. Cari
    const searchUrl = `https://samehadaku.care/?s=${formatQuery(title)}`;
    const { data: searchHtml } = await axios.get(searchUrl, { headers: HEADERS });
    const $ = cheerio.load(searchHtml);

    // Ambil link postingan pertama
    const firstPostLink = $('.post-title a').first().attr('href');
    if (!firstPostLink) return null;

    // 2. Buka Halaman Post
    const { data: postHtml } = await axios.get(firstPostLink, { headers: HEADERS });
    const $$ = cheerio.load(postHtml);

    // 3. Cari Iframe Video (biasanya di class .player-embed atau iframe src)
    let videoSrc = $$('iframe').first().attr('src');
    
    // Jika src diawali relative path, abaikan
    if (videoSrc && !videoSrc.startsWith('http')) return null;

    return videoSrc || firstPostLink; // Return link halaman jika iframe tidak ketemu
  } catch (e) {
    return null;
  }
}

async function scrapeMoviebox(title, episode) {
    // Implementasi placeholder
    return `https://moviebox.ph/search?q=${formatQuery(title)}`;
}

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});