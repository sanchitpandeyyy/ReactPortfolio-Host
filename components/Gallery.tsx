"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Project and community photo gallery.
 *
 * Uploads land on Cloudinary, so they go through next/image: resized, served
 * as AVIF/WebP, and sized by CSS aspect ratio rather than by whatever the
 * original file happened to be. Anything hosted somewhere the optimiser is not
 * configured for falls back to a plain <img> instead of failing to render.
 */

const OPTIMISED_HOSTS = new Set(["res.cloudinary.com", "blog.sanchit.pro"]);

function isOptimisable(src: string): boolean {
  try {
    return OPTIMISED_HOSTS.has(new URL(src).hostname);
  } catch {
    return false;
  }
}

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return null;

  const prev = () => setIndex((index - 1 + images.length) % images.length);
  const next = () => setIndex((index + 1) % images.length);
  const current = images[index];
  const currentAlt =
    images.length > 1 ? `${alt} — photo ${index + 1} of ${images.length}` : alt;

  return (
    <div className="gal" data-reveal>
      <div className="gal-stage">
        {isOptimisable(current) ? (
          <Image
            src={current}
            alt={currentAlt}
            fill
            sizes="(max-width: 860px) 100vw, 760px"
            className="gal-img"
            // The first photo is the largest thing on a project page.
            priority={index === 0}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current} alt={currentAlt} className="gal-img" />
        )}
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
              aria-current={i === index ? "true" : undefined}
            >
              {isOptimisable(src) ? (
                <Image src={src} alt="" width={72} height={52} sizes="72px" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt="" loading="lazy" decoding="async" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
