"use client";

import { useEffect } from "react";

/**
 * Adds a copy button to every code block in the article.
 *
 * Progressive enhancement on purpose: the code is already server-rendered,
 * selectable and highlighted, so with JavaScript off the only thing missing is
 * the button itself. Nothing about the article depends on this running.
 */
export function CodeCopy({ containerId }: { containerId: string }) {
  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root || !navigator.clipboard) return;

    const blocks = Array.from(root.querySelectorAll("pre"));
    const cleanups: (() => void)[] = [];

    for (const pre of blocks) {
      if (pre.querySelector(".bl-copy")) continue;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "bl-copy";
      button.textContent = "Copy";
      button.setAttribute("aria-label", "Copy code to clipboard");

      let timer: ReturnType<typeof setTimeout> | undefined;
      const onClick = async () => {
        const code = pre.querySelector("code")?.textContent ?? "";
        try {
          await navigator.clipboard.writeText(code);
          button.textContent = "Copied";
        } catch {
          button.textContent = "Press Ctrl+C";
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
          button.textContent = "Copy";
        }, 2000);
      };

      button.addEventListener("click", onClick);
      pre.appendChild(button);

      cleanups.push(() => {
        clearTimeout(timer);
        button.removeEventListener("click", onClick);
        button.remove();
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [containerId]);

  return null;
}
