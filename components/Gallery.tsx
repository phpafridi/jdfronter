"use client";
import { useState } from "react";

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const list = images.length ? images : ["/placeholder-pump.svg"];
  const [i, setI] = useState(0);
  return (
    <div className="gallery">
      <div className="gallery-main"><img src={list[i]} alt={alt} /></div>
      {list.length > 1 && (
        <div className="gallery-thumbs">
          {list.map((src, k) => (
            <button key={src} className={k === i ? "is-active" : ""} onClick={() => setI(k)} aria-label={`Show image ${k + 1}`}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
