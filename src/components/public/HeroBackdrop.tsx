"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";

interface HeroBackdropProps {
  clips?: string[];
  poster: string;
}

const POSTER_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMGExNDI4MDgiLz48L3N2Zz4=";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HeroBackdrop({ clips, poster }: HeroBackdropProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const hasClips = Boolean(clips && clips.length > 0);
  const showVideo = hasClips && !reducedMotion;
  const currentSrc = showVideo && clips ? clips[index % clips.length] : undefined;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentSrc) return;
    video.src = currentSrc;
    video.load();
    if (!pausedRef.current) {
      const p = video.play();
      if (p) p.catch(() => setPaused(true));
    }
  }, [currentSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showVideo) return;
    if (paused) {
      video.pause();
    } else {
      const p = video.play();
      if (p) p.catch(() => setPaused(true));
    }
  }, [paused, showVideo]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {showVideo ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          poster={poster}
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          onEnded={() => {
            if (clips && clips.length > 1) {
              setIndex((i) => (i + 1) % clips.length);
            } else {
              const video = videoRef.current;
              if (video) {
                const p = video.play();
                if (p) p.catch(() => setPaused(true));
              }
            }
          }}
        />
      ) : (
        <Image
          src={poster}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={POSTER_PLACEHOLDER}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-site-ink/75 via-site-ink/25 to-site-ink/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.10),transparent_55%)]" />

      {showVideo && (
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          aria-pressed={paused}
          aria-label={paused ? "Reproducir video de fondo" : "Pausar video de fondo"}
          className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-gold"
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
