// src/pages/Callback.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (accessToken) {
      localStorage.setItem("spotify_token", accessToken);
      navigate("/");
    }
  }, [navigate]);

  return <p>Spotify認証中...</p>;
};

export default Callback;
