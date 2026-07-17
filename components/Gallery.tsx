"use client";

import { useState } from "react";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;

  const prev = () => setIndex((index - 1 + images.length) % images.length);
  const next = () => setIndex((index + 1) % images.length);

  return (
    <div className="gal" data-reveal>
      <div className="gal-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[index]} alt={`${alt} — photo ${index + 1}`} />
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="gal-arr gal-prev"
              onClick={prev}
              aria-label="Previous photo"
            >
              &larr;
            </button>
            <button
              type="button"
              className="gal-arr gal-next"
              onClick={next}
              aria-label="Next photo"
            >
              &rarr;
            </button>
            <div className="gal-count">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="gal-thumbs">
          {images.map((src, i) => (
            <button
              type="button"
              key={src}
              className={i === index ? "active" : ""}
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
