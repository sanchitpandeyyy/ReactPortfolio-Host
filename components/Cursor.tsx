"use client";

import { useEffect } from "react";

export function Cursor() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    if (!dot || !ring) return;

    document.body.classList.add("has-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    };
    const onLeave = () => ring.classList.add("hidden");
    const onEnter = () => ring.classList.remove("hidden");

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };
    tick();

    const hoverSel =
      "a, button, .card, .note, .chip, input, textarea, .panel, [data-cursor]";
    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.(hoverSel)) ring.classList.add("hover");
    };
    const onOut = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.(hoverSel)) ring.classList.remove("hover");
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" id="cursor-ring" aria-hidden="true" />
      <div className="cursor-dot" id="cursor-dot" aria-hidden="true" />
    </>
  );
}
