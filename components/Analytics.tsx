"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function send(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track",
        new Blob([body], { type: "application/json" })
      );
    } else {
      fetch("/api/track", { method: "POST", body, keepalive: true }).catch(
        () => {}
      );
    }
  } catch {
    // never let tracking surface an error
  }
}

/** Records page views (once per path per session) and outbound link clicks. */
export function Analytics() {
  const path = usePathname();

  useEffect(() => {
    if (!path || path.startsWith("/admin")) return;

    let newVisitor = false;
    try {
      if (!sessionStorage.getItem("sp-visit")) {
        sessionStorage.setItem("sp-visit", "1");
        newVisitor = true;
      }
      const seenKey = `sp-seen:${path}`;
      if (sessionStorage.getItem(seenKey)) return;
      sessionStorage.setItem(seenKey, "1");
    } catch {
      // storage unavailable (private mode) — still count the view
    }
    send({ type: "view", path, newVisitor });
  }, [path]);

  useEffect(() => {
    if (!path || path.startsWith("/admin")) return;

    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest?.("a[href]");
      if (!(el instanceof HTMLAnchorElement)) return;

      const label = el.dataset.track;
      const external =
        el.host && el.host !== window.location.host && /^https?:/.test(el.href);
      if (!label && !external) return;

      send({ type: "click", target: label || el.host + el.pathname });
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [path]);

  return null;
}
