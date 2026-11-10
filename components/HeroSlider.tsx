"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const SLIDES = [
  { src: "/uploads/201816806/ImgScroll/ba201809071656320731421.jpg", alt: "Jiadi submersible pumps range - JD Frontier Pakistan" },
  { src: "/uploads/201816806/ImgScroll/ba201810301223318331171.jpg", alt: "Jiadi factory - imported to Pakistan by JD Frontier" },
  { src: "/uploads/201816806/ImgScroll/ba201809111801429912225.jpg", alt: "2 inch submersible pump available in Pakistan" },
];
const DELAY = 5000;

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = SLIDES.length;
  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n]);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(i + 1), DELAY);
    return () => clearTimeout(t);
  }, [i, paused, go]);

  return (
    <section
      className="jdf-hero"
      aria-roledescription="carousel"
      aria-label="JD Frontier highlights"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => { if (e.key === "ArrowLeft") go(i - 1); if (e.key === "ArrowRight") go(i + 1); }}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; setPaused(true); }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - (touchX.current ?? 0);
        if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
        setPaused(false);
      }}
    >
      <div className="jdf-hero-track">
        {SLIDES.map((s, k) => (
          <a key={s.src} href="/products" className={`jdf-slide${k === i ? " is-active" : ""}`} aria-hidden={k !== i} tabIndex={k === i ? 0 : -1}>
            <img src={s.src} alt={s.alt} width={1920} height={674} loading={k === 0 ? "eager" : "lazy"} fetchPriority={k === 0 ? "high" : "auto"} />
          </a>
        ))}
      </div>
      <button className="jdf-arrow jdf-prev" aria-label="Previous slide" onClick={() => go(i - 1)}>‹</button>
      <button className="jdf-arrow jdf-next" aria-label="Next slide" onClick={() => go(i + 1)}>›</button>
      <div className="jdf-dots">
        {SLIDES.map((_, k) => (
          <button key={k} aria-label={`Go to slide ${k + 1}`} className={k === i ? "is-active" : ""} onClick={() => go(k)}>
            {k === i && !paused && <span key={i} className="jdf-progress" style={{ animationDuration: `${DELAY}ms` }} />}
          </button>
        ))}
      </div>
      <div className="jdf-strip">
        <strong>JD Frontier</strong> — Authorised Jiadi Dealer in Pakistan
        <span className="jdf-sep">|</span>
        <a href="tel:+92515553023">Call 051-5553023</a>
        <span className="jdf-sep">|</span>
        <a href="/products" className="jdf-btn">View Pumps</a>
      </div>
    </section>
  );
}
