// 完全版: server/auth.ts
import express from "express";
import axios from "axios";
import querystring from "querystring";

const router = express.Router();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

// 認可URLへリダイレクト
router.get("/login", (req, res) => {
  const scope = "user-read-private user-read-email";
  const params = querystring.stringify({
    response_type: "code",
    client_id: CLIENT_ID,
    scope,
    redirect_uri: REDIRECT_URI,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

// トークン取得
router.get("/callback", async (req, res) => {
  const codeParam = req.query.code;

  if (typeof codeParam !== "string") {
    return res.status(400).send("認証コードが無効です");
  }

  const code = codeParam;

  try {
    const tokenRes = await axios.post<SpotifyTokenResponse>(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          Authorization:
            "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token } = tokenRes.data;
    res.json({ access_token, refresh_token });
  } catch (error) {
    console.error("トークン取得失敗:", error);
    res.status(500).send("トークン取得に失敗しました");
  }
});

// Spotify検索APIプロキシ
router.get("/api/search", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const query = req.query.q;

  if (!token || typeof query !== "string") {
    return res.status(400).json({ error: "トークンまたはクエリがありません" });
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      params: {
        q: query,
        type: "track",
        limit: 10,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json(response.data);
  } catch (err: any) {
    console.error("Spotify検索エラー:", err.response?.data || err.message);
    res.status(500).json({ error: "検索失敗" });
  }
});

export default router;
