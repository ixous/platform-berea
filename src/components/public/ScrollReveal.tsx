"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  animation?:
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "fade-in"
    | "scale"
    | "stagger";
  delay?: number;
  className?: string;
  staggerItems?: boolean;
}

export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
  staggerItems = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (staggerItems) {
            el.classList.add("reveal-stagger");
            const children = el.children;
            Array.from(children).forEach((child, i) => {
              (child as HTMLElement).style.animation =
                `revealStaggerItem 0.5s ease-out ${delay + i * 80}ms both`;
            });
          } else {
            setTimeout(() => {
              el.classList.add("reveal-visible");
            }, delay);
          }
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, staggerItems]);

  return (
    <div
      ref={ref}
      className={`${animation === "stagger" ? "" : `reveal-${animation}`} ${className}`}
    >
      {children}
    </div>
  );
}
