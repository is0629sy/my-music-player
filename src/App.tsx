// src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AudioPlayer from "./components/AudioPlayer";
import SpotifySearch from "./components/SpotifySearch";
import Callback from "./pages/Callback";

function App() {
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("spotify_token");
    if (token) {
      setSpotifyToken(token);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
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
                    href="https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=token&redirect_uri=http://localhost:3000/callback&scope=user-read-private"
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
          }
        />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;
