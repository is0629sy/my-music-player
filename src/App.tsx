// src/App.tsx
import React, { useEffect, useState } from "react";
import AudioPlayer from "./components/AudioPlayer";
import SpotifySearch from "./components/SpotifySearch";

function App() {
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);

  // Spotifyトークンを localStorage から読み込む（仮の認証対応）
  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (token) {
      setSpotifyToken(token);
    }
  }, []);

  return (
    <div className="App" style={{ padding: "20px" }}>
      <h1>🎶 My Music Player</h1>

      {/* ローカルMP3プレイヤー */}
      <AudioPlayer />

      <hr style={{ margin: "40px 0" }} />

      {/* Spotify検索機能（トークンがある場合のみ表示） */}
      {spotifyToken ? (
        <SpotifySearch token={spotifyToken} />
      ) : (
        <div>
          <h2>Spotify検索</h2>
          <p>Spotifyと連携するには、ログインが必要です。</p>
          <a
            href="https://accounts.spotify.com/authorize?client_id=ee1a6c22d09b48e7b05bbd403391e751&response_type=token&redirect_uri=http://127.0.0.1:4000/callback&scope=user-read-private"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              background: "#1DB954",
              color: "#fff",
              borderRadius: "5px",
              textDecoration: "none",
            }}
          >
            Spotifyログイン
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
