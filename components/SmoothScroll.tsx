"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Reveal animations via IntersectionObserver
    const revealEls = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    revealEls.forEach((el) => io.observe(el));

    // Safety: force reveal after 3.5s if anything fails
    const safety = setTimeout(() => {
      revealEls.forEach((el) => el.classList.add("in"));
    }, 3500);

    // Lenis smooth scroll
    let lenis: { destroy: () => void } | null = null;
    let rafId = 0;
    if (!reduced) {
      import("lenis").then(({ default: Lenis }) => {
        const instance = new Lenis({
          duration: 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });
        lenis = instance;

        const raf = (time: number) => {
          instance.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        // smooth anchor scroll
        const handler = (e: MouseEvent) => {
          const a = (e.target as HTMLElement | null)?.closest?.(
            'a[href^="#"]',
          ) as HTMLAnchorElement | null;
          if (!a) return;
          const id = a.getAttribute("href")?.slice(1);
          if (!id) return;
          const target = document.getElementById(id);
          if (!target) return;
          e.preventDefault();
          instance.scrollTo(target, { offset: -10, duration: 1.2 });
        };
        document.addEventListener("click", handler);
        // store cleanup on lenis
        (instance as unknown as { __cleanup: () => void }).__cleanup = () =>
          document.removeEventListener("click", handler);
      });
    }

    return () => {
      io.disconnect();
      clearTimeout(safety);
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) {
        const cleanup = (lenis as unknown as { __cleanup?: () => void })
          .__cleanup;
        cleanup?.();
        lenis.destroy();
      }
    };
  }, []);

  return null;
}
