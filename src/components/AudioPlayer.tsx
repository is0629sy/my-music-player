import React, { useRef, useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:4000";

const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isLooping, setIsLooping] = useState(false);
  const [songs, setSongs] = useState<string[]>([]);
  const [currentSong, setCurrentSong] = useState<string | null>(null);

  // 曲一覧を取得
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/songs`)
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("Failed to fetch songs:", err));
  }, []);

  // 曲変更時の処理
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.src = `${API_BASE_URL}/songs/${currentSong}`;
    audio.load();
    audio.volume = volume / 100;
    audio.loop = isLooping;

    audio.play();
    setIsPlaying(true);

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [currentSong]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current?.duration) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const toggleLoop = () => {
    if (!audioRef.current) return;
    const newLoopState = !isLooping;
    setIsLooping(newLoopState);
    audioRef.current.loop = newLoopState;
  };

  const handleSelectSong = (song: string) => {
    setCurrentSong(song);
    setCurrentTime(0);
  };

  return (
    <div>
      <h2>🎵 音楽プレイヤー</h2>

      {/* 再生中の曲表示 */}
      {currentSong && <p>再生中: {currentSong}</p>}

      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button onClick={togglePlayback}>
          {isPlaying ? "⏸ 一時停止" : "▶️ 再生"}
        </button>
        <button onClick={handleRestart}>⏮ 最初から再生</button>
        <button onClick={toggleLoop}>
          🔁 リピート: {isLooping ? "ON" : "OFF"}
        </button>
      </div>

      {/* シークバー */}
      <div>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          step="0.1"
          style={{ width: "100%" }}
        />
        <div>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* 音量スライダー */}
      <div style={{ marginTop: "10px" }}>
        <label>
          音量: {volume}%
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            style={{ width: "100%" }}
          />
        </label>
      </div>

      {/* 曲一覧 */}
      <div style={{ marginTop: "20px" }}>
        <h3>🎼 曲一覧</h3>
        <ul>
          {songs.map((song) => (
            <li key={song}>
              <button onClick={() => handleSelectSong(song)}>{song}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default AudioPlayer;
