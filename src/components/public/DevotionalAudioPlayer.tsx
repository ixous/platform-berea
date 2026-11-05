"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";

interface Props {
  audioUrl: string;
  durationText?: string;
  title: string;
}

export function DevotionalAudioPlayer({ audioUrl, durationText, title }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const formatSecs = (sec: number) => {
    if (isNaN(sec) || sec <= 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-2xl border border-site-line/70 bg-site-paper/80 p-4 backdrop-blur-sm sm:p-5">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pausar audio" : "Reproducir audio"}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-site-gold text-site-paper shadow-md transition-all duration-200 hover:scale-105 hover:bg-site-gold/90 focus:outline-none focus:ring-2 focus:ring-site-gold/50"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              )}
            </button>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-site-gold">
                Audio Devocional
              </p>
              <p className="line-clamp-1 text-sm font-semibold text-site-ink">
                {title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-site-muted">
            <button
              type="button"
              onClick={restart}
              title="Reiniciar audio"
              className="rounded-lg p-1.5 transition-colors hover:bg-site-paper hover:text-site-ink"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={toggleMute}
              title={isMuted ? "Activar sonido" : "Silenciar"}
              className="rounded-lg p-1.5 transition-colors hover:bg-site-paper hover:text-site-ink"
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-red-500" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Progreso del audio"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-site-line accent-site-gold"
          />
          <div className="flex justify-between text-[11px] font-medium text-site-muted">
            <span>{formatSecs(currentTime)}</span>
            <span>{duration > 0 ? formatSecs(duration) : durationText || "2:00 min"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
