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

type Props = {
  token: string;
};

const SpotifySearch: React.FC<Props> = ({ token }) => {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);

  const searchTracks = async () => {
    try {
      const res = await axios.get<SpotifySearchResponse>(
        "https://api.spotify.com/v1/search",
        {
          params: {
            q: query,
            type: "track",
            limit: 10,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTracks(res.data.tracks.items);
    } catch (error: any) {
      console.error("検索エラー:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert("トークンが無効です。再ログインしてください。");
      }
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
