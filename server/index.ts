// 完全版: server/index.ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

import authRoutes from "./auth";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRoutes);

const songsDir = path.join(__dirname, "../songs");

app.get("/api/songs", (req, res) => {
  fs.readdir(songsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read songs folder" });
    }
    const mp3Files = files.filter(file => file.endsWith(".mp3"));
    res.json(mp3Files);
  });
});

app.use("/songs", express.static(songsDir));

app.listen(PORT, () => {
  console.log(`🎵 Server running at http://localhost:${PORT}`);
});
