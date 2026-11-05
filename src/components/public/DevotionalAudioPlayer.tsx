"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw, Loader2 } from "lucide-react";

interface Props {
  audioUrl: string;
  durationText?: string;
  title: string;
}

export function DevotionalAudioPlayer({ audioUrl, durationText, title }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [useProxy, setUseProxy] = useState(true);

  // Endpoint local mismo-origen para evitar problemas de CORS, 302 y bloqueo CSP en Safari iOS / iPad
  const streamSrc = useProxy
    ? `/api/devotional/audio?url=${encodeURIComponent(audioUrl)}`
    : audioUrl;

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setIsLoading(true);
      // En Safari iOS, play() debe llamarse inmediatamente en el contexto del click
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
      }
    } catch (err) {
      console.warn("[DevotionalAudio] Play failed, trying fallback:", err);
      // Si el proxy fallara, reintentar con la URL directa
      if (useProxy) {
        setUseProxy(false);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.load();
            audioRef.current.play().catch((e) => console.error("[DevotionalAudio] Direct play error:", e));
          }
        }, 100);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isPlaying, useProxy]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
    };
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      // Fallback a URL directa si el proxy dio error
      if (useProxy) setUseProxy(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [useProxy]);

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
    if (!isPlaying) {
      togglePlay();
    }
  };

  const formatSecs = (sec: number) => {
    if (isNaN(sec) || sec <= 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-2xl border border-site-line/70 bg-site-paper/90 p-4 shadow-sm backdrop-blur-md sm:p-5">
      {/* Elemento de audio con soporte nativo de iOS Safari (playsInline, crossOrigin) */}
      <audio
        ref={audioRef}
        src={streamSrc}
        preload="metadata"
        playsInline
        crossOrigin="anonymous"
      />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              disabled={isLoading && !isPlaying}
              aria-label={isPlaying ? "Pausar devocional" : "Reproducir devocional"}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-site-gold text-site-paper shadow-md transition-all duration-200 hover:scale-105 hover:bg-site-gold/90 focus:outline-none focus:ring-2 focus:ring-site-gold/50 active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              )}
            </button>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-site-gold">
                {isPlaying ? "Reproduciendo" : "Escuchar Reflexión"}
              </p>
              <p className="line-clamp-1 text-sm font-semibold text-site-ink">
                {title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-site-muted">
            <button
              type="button"
              onClick={restart}
              title="Reiniciar audio"
              aria-label="Reiniciar audio"
              className="rounded-lg p-2 transition-colors hover:bg-white hover:text-site-ink"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={toggleMute}
              title={isMuted ? "Activar sonido" : "Silenciar"}
              aria-label={isMuted ? "Activar sonido" : "Silenciar"}
              className="rounded-lg p-2 transition-colors hover:bg-white hover:text-site-ink"
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-red-500" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Barra de progreso interactiva */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Progreso del audio"
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-site-line accent-site-gold touch-none"
          />
          <div className="flex justify-between text-[11px] font-medium text-site-muted">
            <span>{formatSecs(currentTime)}</span>
            <span>{duration > 0 ? formatSecs(duration) : durationText || "2:21 min"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
