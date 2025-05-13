import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

import authRoutes from "./auth"; // app定義後に使う

const app = express();
const PORT = 4000;

// CORS を許可（React開発サーバーと通信するため）
app.use(cors());

// 認証ルーティングを追加
app.use("/", authRoutes);

// songsディレクトリのパス
const songsDir = path.join(__dirname, "../songs");

// API: /api/songs → ファイル一覧を返す
app.get("/api/songs", (req, res) => {
  fs.readdir(songsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read songs folder" });
    }
    const mp3Files = files.filter(file => file.endsWith(".mp3"));
    res.json(mp3Files);
  });
});

// 静的ファイル配信: /songs/song1.mp3 のようにアクセス可能に
app.use("/songs", express.static(songsDir));

app.listen(PORT, () => {
  console.log(`🎵 Server running at http://localhost:${PORT}`);
});
