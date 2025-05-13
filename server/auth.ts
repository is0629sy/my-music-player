import express from "express";
import axios from "axios";
import querystring from "querystring";

const router = express.Router();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

// Spotifyのトークン取得時のレスポンス型
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

// リダイレクトURIからトークンを取得
router.get("/callback", async (req, res) => {
    const codeParam = req.query.code;
  
    // 型ガード：stringであることを確認
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
              "Basic " +
              Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
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
  

export default router;
