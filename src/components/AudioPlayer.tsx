import React, { useRef, useState } from "react";

const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isLooping, setIsLooping] = useState(false); // リピート状態

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
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

  return (
    <div>
      <h2>🎵 リピート機能付きプレイヤー</h2>
      <audio
        ref={audioRef}
        src="/野良猫は宇宙を目指した.mp3"
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
