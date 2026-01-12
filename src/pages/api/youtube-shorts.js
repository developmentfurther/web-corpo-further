// 1. Crear API Route: /pages/api/youtube-shorts.js
// Esta ruta obtiene videos de una playlist de YouTube automáticamente

export default async function handler(req, res) {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const PLAYLIST_ID = process.env.YOUTUBE_SHORTS_PLAYLIST_ID || 'PLNccVrIVJ8qP2ACXgZOUSzLvhBWL-REbs';
  
  if (!YOUTUBE_API_KEY) {
    return res.status(500).json({ error: 'YouTube API key not configured' });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transformar datos al formato que necesita el componente
    const videos = data.items.map(item => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      publishedAt: item.snippet.publishedAt
    }));

    // Cache por 1 hora
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json({ videos });
    
  } catch (error) {
    console.error('Error fetching YouTube playlist:', error);
    res.status(500).json({ error: 'Failed to fetch YouTube playlist' });
  }
}

