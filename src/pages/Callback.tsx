// src/pages/Callback.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      axios
        .post("/api/auth/callback", { code })
        .then((res) => {
          const { access_token } = res.data as { access_token: string };
          localStorage.setItem("spotify_token", access_token);
          navigate("/"); // ✅ トップページに戻る
        })
        .catch((err) => console.error("トークン取得エラー:", err));
    } else {
      console.error("認証コードがありません");
    }
  }, [navigate]);

  return <p>Spotify認証中...</p>;
};

export default Callback;
