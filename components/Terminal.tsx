"use client";

import { useEffect, useRef } from "react";

interface Line {
  html: string;
  cls?: string;
  delay?: number;
  pre?: number;
}

const QUICK = [
  "help",
  "whoami",
  "projects",
  "stack",
  "now",
  "contact",
  "resume",
  "theme",
  "clear",
];

export function Terminal() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    const shell = shellRef.current;
    if (!body || !shell) return;

    const history: string[] = [];
    let histIndex = -1;
    let booted = false;

    const escapeHtml = (s: string) =>
      String(s).replace(/[&<>"']/g, (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[c]!),
      );

    const appendLine = (html: string, cls = "") => {
      const div = document.createElement("div");
      div.className = `term-line ${cls}`.trim();
      div.innerHTML = html;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
      return div;
    };

    const appendUser = (cmd: string) => appendLine(escapeHtml(cmd), "user");

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const typewrite = async (lines: Line[], baseDelay = 18) => {
      for (const line of lines) {
        await sleep(line.pre ?? 50);
        appendLine(line.html, line.cls || "");
        await sleep(line.delay ?? baseDelay);
      }
    };

    const autoType = async (cmd: string) => {
      const row = ensureInputRow();
      const input = row.querySelector<HTMLInputElement>(".term-input");
      if (!input) return;
      input.focus({ preventScroll: true });
      for (const ch of cmd) {
        input.value += ch;
        input.dispatchEvent(new Event("input"));
        await sleep(65 + Math.random() * 50);
      }
      await sleep(380);
      const val = input.value;
      input.disabled = true;
      await run(val);
    };

    type CommandFn = (...args: string[]) => Promise<void> | void;
    const COMMANDS: Record<string, CommandFn> = {
      help() {
        return typewrite([
          { html: "Available commands:", cls: "ok", delay: 70 },
          { html: '  <span class="kw">whoami</span>     &middot; about Sanchit, in one breath', delay: 30 },
          { html: '  <span class="kw">about</span>      &middot; alias of whoami', delay: 30 },
          { html: '  <span class="kw">projects</span>   &middot; selected work, recent first', delay: 30 },
          { html: '  <span class="kw">stack</span>      &middot; tools I reach for', delay: 30 },
          { html: '  <span class="kw">now</span>        &middot; what I\'m up to this week', delay: 30 },
          { html: '  <span class="kw">contact</span>    &middot; email, socials, mailto', delay: 30 },
          { html: '  <span class="kw">resume</span>     &middot; open the pdf', delay: 30 },
          { html: '  <span class="kw">open</span> &lt;n&gt;    &middot; jump to section (about · work · now · notes · terminal)', delay: 30 },
          { html: '  <span class="kw">theme</span> [light|dark]  &middot; switch terminal theme', delay: 30 },
          { html: '  <span class="kw">echo</span> &lt;text&gt;   <span class="kw">date</span>     <span class="kw">ls</span>     <span class="kw">cat</span> &lt;file&gt;', delay: 30 },
          { html: '  <span class="kw">sudo</span> <span class="sys">(joke)</span>     <span class="kw">namaste</span> <span class="sys">(easter egg)</span>     <span class="kw">clear</span>', delay: 50 },
          { html: '<span class="sys">tip: ↑/↓ for history, tab to complete, click any pill below to run.</span>', delay: 60 },
        ]);
      },

      whoami() {
        return typewrite([
          { html: "<b>Sanchit Pandey</b> — Full-Stack Developer, based in Butwal, Nepal.", cls: "ok" },
          { html: "I build web platforms, e-commerce storefronts, WordPress" },
          { html: "plugin toolkits, and community tools — TypeScript by day," },
          { html: "Node after midnight, prose whenever it lets me think more clearly." },
          { html: " " },
          { html: "Off-keyboard: President at the <b>CSIT Association of BMC</b>," },
          { html: "organizer at <b>WordCamp Nepal</b>, OSS maintainer at 2am Nepal time." },
        ]);
      },
      about(...args: string[]) {
        return COMMANDS.whoami(...args);
      },

      projects() {
        return typewrite([
          { html: "<b>Selected work, 2023 → 2026</b>", cls: "ok" },
          { html: "  001 &middot; <b>Find Your Fellow</b> — social discovery platform with host-approval workflows." },
          { html: "  002 &middot; <b>Surface Kit</b> — premium WordPress plugin toolkit with a React admin dashboard." },
          { html: "  003 &middot; <b>Hamro Admission</b> — B2C admissions platform for students seeking education." },
          { html: "  004 &middot; <b>BMC InnovateX</b> — national-level hackathon platform, organized + built." },
          { html: "  005 &middot; <b>Kinmel Bakas</b> — all-in-one e-commerce storefront with CMS + POS." },
          { html: " " },
          { html: '<span class="sys">use `open work` to scroll there. more on file at sanchit.pro.</span>' },
        ]);
      },

      stack() {
        return typewrite([
          { html: '<span class="sys">A. Languages &amp; Frameworks</span>' },
          { html: "   TypeScript · JavaScript · Next.js · React · Node.js · PHP · React Native" },
          { html: " " },
          { html: '<span class="sys">B. Data &amp; Backend</span>' },
          { html: "   PostgreSQL · Prisma · MongoDB · REST · WordPress · Auth.js" },
          { html: " " },
          { html: '<span class="sys">C. Design &amp; Tools</span>' },
          { html: "   Tailwind · Figma · Photoshop · Vercel · Cloudflare · Docker · Git" },
        ]);
      },

      now() {
        const ts = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kathmandu",
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date());
        return typewrite([
          { html: `<span class="sys">now &middot; ${ts} NPT</span>` },
          { html: "· shipping  <b>Hamro Admission v2</b> — reviewer dashboard, 62% to cut" },
          { html: "· reading   <b>Designing Data-Intensive Applications</b>, p.214 (ch. 9)" },
          { html: "· listening <b>Late-night Tabla &amp; Bass</b> — focus mix" },
          { html: "· organising <b>WordCamp Nepal</b> + CSIT Association events" },
          { html: "· brewing   ☕ cup 2 of 3" },
        ]);
      },

      async contact() {
        await typewrite([
          { html: '<span class="sys">opening contact channels…</span>', delay: 200 },
          { html: 'email  &middot; <a href="mailto:admin@sanchitpandey.com.np?subject=Hello%20from%20your%20portfolio&body=Hi%20Sanchit%2C%0A%0A">admin@sanchitpandey.com.np</a>' },
          { html: 'phone  &middot; <a href="tel:+9779841148149">+977 9841148149</a>' },
          { html: 'gh     &middot; <a href="https://github.com/sanchitpandeyyy" target="_blank" rel="noopener">github.com/sanchitpandeyyy</a>' },
          { html: 'linked &middot; <a href="https://www.linkedin.com/in/sanchitpandeyyy/" target="_blank" rel="noopener">linkedin.com/in/sanchitpandeyyy</a>' },
          { html: 'insta  &middot; <a href="https://www.instagram.com/sanchitpandeyyy/" target="_blank" rel="noopener">instagram.com/sanchitpandeyyy</a>' },
          { html: " " },
          { html: '<span class="ok">tip: I read every email. response &lt; 24h on weekdays (NPT).</span>' },
        ]);
      },

      async resume() {
        appendLine('<span class="sys">opening resume.pdf in a new tab…</span>');
        await sleep(320);
        try {
          const w = window.open("/resume.pdf", "_blank", "noopener");
          if (!w)
            appendLine(
              '<span class="err">pop-up blocked. <a href="/resume.pdf" download>download resume.pdf</a></span>',
            );
        } catch {
          appendLine(
            '<span class="err">no pdf available. wire `resume.pdf` at root.</span>',
          );
        }
      },

      async open(target?: string) {
        const map: Record<string, string> = {
          hero: "hero",
          home: "hero",
          about: "about",
          work: "work",
          projects: "work",
          now: "now",
          activity: "now",
          notes: "notes",
          writing: "notes",
          terminal: "terminal",
          contact: "terminal",
        };
        if (!target) {
          appendLine(
            '<span class="err">open: missing target. try `open work`, `open now`, `open notes`.</span>',
          );
          return;
        }
        const id = map[target.toLowerCase()];
        if (!id) {
          appendLine(
            `<span class="err">open: unknown section "${escapeHtml(target)}".</span>`,
          );
          return;
        }
        const sec = document.getElementById(id);
        if (!sec) return;
        appendLine(`<span class="sys">→ scrolling to <b>${id}</b>…</span>`);
        sec.scrollIntoView({ behavior: "smooth", block: "start" });
      },

      theme(mode?: string) {
        const t = shell;
        const next =
          mode === "light"
            ? "light"
            : mode === "dark"
              ? "dark"
              : t.classList.contains("light")
                ? "dark"
                : "light";
        t.classList.toggle("light", next === "light");
        appendLine(`<span class="sys">terminal theme → <b>${next}</b></span>`);
      },

      clear() {
        body.innerHTML = "";
        ensureInputRow();
      },

      echo(...args: string[]) {
        appendLine(escapeHtml(args.join(" ")) || "");
      },

      date() {
        const npt = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kathmandu",
          dateStyle: "full",
          timeStyle: "long",
        }).format(new Date());
        appendLine(`${npt} <span class="sys">(Asia/Kathmandu)</span>`);
      },

      ls() {
        return typewrite([
          { html: "drwx------  about/" },
          { html: "drwx------  work/" },
          { html: "drwx------  now/" },
          { html: "drwx------  notes/" },
          { html: "-rw-r--r--  resume.pdf" },
          { html: "-rw-r--r--  contact.md" },
          { html: "-rw-r--r--  readme.txt" },
        ]);
      },

      cat(arg?: string) {
        if (!arg) {
          appendLine(
            '<span class="err">cat: missing operand. try `cat readme.txt`</span>',
          );
          return;
        }
        if (arg === "readme.txt") {
          return typewrite([
            { html: '<span class="sys"># readme.txt</span>' },
            { html: "this terminal is real. type things into it." },
            { html: "try `theme light`, `open work`, or `namaste`." },
            { html: "be kind to yourself." },
          ]);
        }
        appendLine(`<span class="err">cat: ${escapeHtml(arg)}: no such file.</span>`);
      },

      neofetch() {
        return typewrite([
          { html: '<span class="sys">       ___</span>      guest@sanchit' },
          { html: '<span class="sys">      / _ \\</span>     ─────────────' },
          { html: '<span class="sys">     | |_| |</span>    OS:        zen-paper 26.05' },
          { html: '<span class="sys">     |  _  |</span>    Host:      sanchitpandey.com.np' },
          { html: '<span class="sys">     |_| |_|</span>    Kernel:    next 15 / react 19' },
          { html: '<span class="sys">     |     |</span>    Uptime:    5y in production' },
          { html: '<span class="sys">     |_____|</span>    Resolution: ' + window.innerWidth + "×" + window.innerHeight },
          { html: '<span class="sys"> </span>             Theme:     paper / lime / ink' },
          { html: '<span class="sys"> </span>             Font:      Bricolage / Geist / JBMono' },
        ]);
      },

      async sudo(...args: string[]) {
        const sub = args.join(" ").trim();
        if (sub === "make-coffee") {
          return typewrite([
            { html: '<span class="sys">[sudo] password for guest:</span>', delay: 500 },
            { html: '<span class="sys">brewing…</span>', delay: 1000 },
            { html: '<span class="ok">☕ done. it\'s on the desk.</span>' },
          ]);
        }
        appendLine(
          `<span class="err">sudo: ${escapeHtml(sub || "(nothing)")}: permission denied. nice try.</span>`,
        );
      },

      namaste() {
        return typewrite([
          { html: '<span style="color:var(--lime)">🙏 नमस्ते</span>' },
          { html: '<span class="sys">thanks for stopping by. light, food, and good roads to you.</span>' },
          { html: " " },
          { html: "now go build something <b>good</b>." },
        ]);
      },

      exit() {
        appendLine('<span class="sys">you can\'t leave. keep scrolling.</span>');
      },
    };

    const run = async (raw: string) => {
      const line = raw.trim();
      if (!line) {
        ensureInputRow();
        return;
      }
      history.push(line);
      histIndex = history.length;

      const [name, ...args] = line.split(/\s+/);
      appendUser(line);

      const fn = COMMANDS[name.toLowerCase()];
      if (typeof fn === "function") {
        try {
          await fn(...args);
        } catch (e) {
          appendLine(
            '<span class="err">' +
              escapeHtml((e as Error).message || String(e)) +
              "</span>",
          );
        }
      } else {
        appendLine(
          `<span class="err">command not found: ${escapeHtml(name)}. type 'help'.</span>`,
        );
      }
      ensureInputRow();
    };

    const isInViewport = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };

    function ensureInputRow() {
      let row = body!.querySelector<HTMLDivElement>(".term-input-row");
      const existing = row?.querySelector<HTMLInputElement>(".term-input");
      if (row && existing && !existing.disabled) return row;
      if (row) row.remove();

      row = document.createElement("div");
      row.className = "term-input-row";
      row.innerHTML = `
        <span class="prompt">guest@sanchit:~ $</span>
        <input class="term-input" type="text" autocomplete="off" spellcheck="false" autocapitalize="off" />
        <span class="term-caret" aria-hidden="true"></span>
      `;
      body!.appendChild(row);
      const input = row.querySelector<HTMLInputElement>(".term-input")!;
      const caret = row.querySelector<HTMLSpanElement>(".term-caret")!;

      const measurer = document.createElement("span");
      measurer.style.cssText =
        "visibility:hidden;white-space:pre;font-family:inherit;font-size:inherit;position:absolute;";
      row.appendChild(measurer);
      const positionCaret = () => {
        measurer.textContent = input.value;
        caret.style.transform = `translateX(${measurer.offsetWidth}px)`;
      };
      input.addEventListener("input", positionCaret);
      positionCaret();

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const val = input.value;
          input.disabled = true;
          run(val);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (histIndex > 0) {
            histIndex--;
            input.value = history[histIndex] || "";
            positionCaret();
          }
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          if (histIndex < history.length - 1) {
            histIndex++;
            input.value = history[histIndex] || "";
          } else {
            histIndex = history.length;
            input.value = "";
          }
          positionCaret();
        } else if (e.key === "Tab") {
          e.preventDefault();
          const v = input.value.toLowerCase();
          if (!v) return;
          const match = Object.keys(COMMANDS).find((k) => k.startsWith(v));
          if (match) {
            input.value = match;
            positionCaret();
          }
        } else if (
          (e.key === "l" || e.key === "L") &&
          (e.ctrlKey || e.metaKey)
        ) {
          e.preventDefault();
          COMMANDS.clear();
        }
      });

      body!.scrollTop = body!.scrollHeight;
      if (isInViewport(shell!)) input.focus({ preventScroll: true });
      return row;
    }

    const boot = async () => {
      if (booted) return;
      booted = true;
      await typewrite(
        [
          { html: `<span class="sys">zen-paper terminal · build 26.05 (${new Date().getFullYear()})</span>`, delay: 180 },
          { html: '<span class="sys">connected from earth · type \'help\' to see options.</span>', delay: 220 },
          { html: " " },
        ],
        30,
      );
      ensureInputRow();
      await sleep(400);
      await autoType("whoami");
      await sleep(600);
      await autoType("now");
    };

    const maybeBoot = () => {
      if (booted) return;
      if (isInViewport(shell)) {
        boot();
        window.removeEventListener("scroll", maybeBoot);
      }
    };

    window.addEventListener("scroll", maybeBoot, { passive: true });
    const fallback = setTimeout(maybeBoot, 2500);
    maybeBoot();

    const onClickBody = () => {
      const input = body.querySelector<HTMLInputElement>(".term-input");
      if (input && !input.disabled) input.focus({ preventScroll: true });
    };
    body.addEventListener("click", onClickBody);

    const quickHandler = (e: Event) => {
      const btn = (e.currentTarget as HTMLButtonElement);
      const cmd = btn.dataset.cmd;
      if (!cmd) return;
      const input = body.querySelector<HTMLInputElement>(".term-input");
      if (input && !input.disabled) {
        input.value = cmd;
        input.disabled = true;
      }
      run(cmd);
    };
    const quickButtons =
      shell.querySelectorAll<HTMLButtonElement>(".term-quick button[data-cmd]");
    quickButtons.forEach((b) => b.addEventListener("click", quickHandler));

    return () => {
      window.removeEventListener("scroll", maybeBoot);
      clearTimeout(fallback);
      body.removeEventListener("click", onClickBody);
      quickButtons.forEach((b) => b.removeEventListener("click", quickHandler));
    };
  }, []);

  return (
    <section
      className="term-sec"
      id="terminal"
      data-screen-label="06 Terminal"
    >
      <div className="sec-head" data-reveal>
        <div className="idx">
          <b>§05</b> &middot; Live Terminal
        </div>
        <div className="title">
          Talk to me <em>through</em> a CLI.
        </div>
        <div className="meta">type &apos;help&apos; or click below</div>
      </div>

      <div className="terminal" ref={shellRef} data-reveal>
        <div className="term-bar">
          <div className="lights" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="path">
            <b>guest@sanchit</b>:~/portfolio
          </div>
          <span className="live">
            <span className="dot" />
            live
          </span>
        </div>
        <div className="term-body" ref={bodyRef} />
        <div className="term-quick">
          {QUICK.map((cmd) => (
            <button key={cmd} data-cmd={cmd}>
              {cmd}
            </button>
          ))}
          <span className="hint">
            ↑ ↓ history · tab complete · enter to run
          </span>
        </div>
      </div>
    </section>
  );
}
