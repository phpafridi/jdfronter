"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/config";

const SLIDES = [
  {
    img: "/uploads/201816806/ImgScroll/ba201809111801429912225.jpg", pos: "80% 50%",
    kicker: "Welcome to JD Frontier",
    title: "Genuine Jiadi Submersible Pumps in Pakistan",
    text: "Authorised dealer importing water submersible pumps directly from China. Deep well, borehole, solar and sewage pumps in stock.",
  },
  {
    img: "/uploads/201816806/ImgScroll/ba201809071656320731421.jpg", pos: "20% 50%",
    kicker: "2\" to 6\" full range",
    title: "The Right Pump for Every Bore",
    text: "From household tube wells to farms and housing societies — we help you choose the right head, flow and motor.",
  },
  {
    img: "/uploads/201816806/ImgScroll/ba201810301223318331171.jpg", pos: "70% 50%",
    kicker: "Factory original · Since 1988",
    title: "Built by Jiadi. Supported in Rawalpindi.",
    text: "Certified quality (ISO 9001, CE, GS) with local warranty and after-sales service.",
  },
];

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const tx = useRef<number | null>(null);
  const n = SLIDES.length;
  const go = (k: number) => setI(((k % n) + n) % n);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(i + 1), 6000);
    return () => clearTimeout(t);
  }, [i, paused]);

  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Highlights"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { tx.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - (tx.current ?? 0); if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1); }}>
      {SLIDES.map((s, k) => (
        <div key={s.img} className={`hero-slide${k === i ? " is-active" : ""}`} aria-hidden={k !== i}>
          <img src={s.img} alt="" style={{ objectPosition: s.pos }} fetchPriority={k === 0 ? "high" : "auto"} />
          <div className="hero-overlay" />
          <div className="container hero-content">
            <span className="kicker kicker-light">{s.kicker}</span>
            {k === 0 ? <h1>{s.title}</h1> : <h2 className="h1">{s.title}</h2>}
            <p>{s.text}</p>
            <div className="hero-btns">
              <Link href="/products" className="btn btn-orange" tabIndex={k === i ? 0 : -1}>Our Products</Link>
              <a href={`tel:${SITE.phoneTel}`} className="btn btn-outline-light" tabIndex={k === i ? 0 : -1}>Call {SITE.phone}</a>
            </div>
          </div>
        </div>
      ))}
      <div className="container hero-dots">
        {SLIDES.map((_, k) => (
          <button key={k} aria-label={`Slide ${k + 1}`} className={k === i ? "is-active" : ""} onClick={() => go(k)} />
        ))}
      </div>
    </section>
  );
}
