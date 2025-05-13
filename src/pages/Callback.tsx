// src/pages/Callback.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const code = params.get("code");

    if (code) {
      // 認証コードを使ってアクセストークンを取得
      axios.post<{ access_token: string; refresh_token: string }>("/api/auth/callback", { code })
        .then(response => {
          const { access_token } = response.data;
          localStorage.setItem("spotify_token", access_token);
          navigate("/playback"); // 再生画面に遷移
        })
        .catch(error => {
          console.error("トークン取得に失敗しました:", error);
          // エラーハンドリングを追加する場合はここに記述
        });
    } else {
      console.error("認証コードが取得できませんでした");
    }
  }, [navigate]);

  return <p>Spotify認証中...</p>;
};

export default Callback;


//ChatGptに聞きたい！！！！！！