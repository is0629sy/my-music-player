// server/routes/spotify.ts

import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
  const q = req.query.q as string;
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q,
        type: "track",
        limit: 10,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("検索エラー:", error);
    res.status(500).json({ error: "検索に失敗しました" });
  }
});

export default router;
