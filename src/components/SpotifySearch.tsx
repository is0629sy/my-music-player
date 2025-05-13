// src/components/SpotifySearch.tsx

import React, { useState } from "react";
import axios from "axios";

type Artist = {
  name: string;
};

type Track = {
  id: string;
  name: string;
  artists: Artist[];
  preview_url: string | null;
};

type SpotifySearchResponse = {
  tracks: {
    items: Track[];
  };
};

const SpotifySearch: React.FC<{ token: string }> = ({ token }) => {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);

  const searchTracks = async () => {
    try {
      const res = await axios.get<SpotifySearchResponse>(
        "http://localhost:4000/api/search",
        {
          params: { q: query },
          headers: { Authorization: token },
        }
      );

      setTracks(res.data.tracks.items);
    } catch (error) {
      console.error("検索エラー:", error);
    }
  };

  return (
    <div>
      <h2>Spotify検索</h2>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="曲名・アーティスト名など"
      />
      <button onClick={searchTracks}>検索</button>

      <ul>
        {tracks.map(track => (
          <li key={track.id}>
            {track.name} - {track.artists.map(a => a.name).join(", ")}
            {track.preview_url && (
              <button onClick={() => setPlayingUrl(track.preview_url)}>
                ▶️ プレビュー再生
              </button>
            )}
          </li>
        ))}
      </ul>

      {playingUrl && <audio src={playingUrl} controls autoPlay />}
    </div>
  );
};

export default SpotifySearch;
