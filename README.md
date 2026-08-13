# sanchitpandey.com.np

Personal portfolio for **Sanchit Pandey** · Full-Stack Developer based in Butwal, Nepal.

Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, GSAP and Lenis.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run start
```

## Writing

Articles are **not** stored in this repository. They live on the central blog,
[blog.sanchit.pro](https://blog.sanchit.pro), and are mirrored here when a post
is published with **Show on portfolios** enabled. Both portfolio sites consume
the same feed; there is no per-site switch.

```
blog.sanchit.pro  (CMS, original articles, showOnPortfolios)
        │  GET /api/v1/portfolio/posts
        ▼
  /blog  ·  /blog/[slug]        canonical → blog.sanchit.pro/blog/[slug]
```

- `lib/blog/client.ts` is the only module that talks to the blog. It caches
  responses under the `blog-posts` / `blog-post:<slug>` tags, times out after
  8s, validates every field, and keeps a last-known-good snapshot for outages.
- `lib/blog/sanitize.ts` rebuilds the article HTML from an allowlist before it
  is rendered; `lib/blog/highlight.ts` adds syntax highlighting on the server.
- Mirrored article pages canonicalise to the original on the blog and are
  deliberately **excluded** from this site's sitemap. `/blog` itself is a
  first-class page with its own canonical.
- `POST /api/revalidate-blog` receives signed webhooks from the blog and
  revalidates `/blog`, the affected article, the homepage and the sitemap.

Editing an article on the blog is the only step needed: nothing is copied,
synchronised or published from this repository.

## Environment

See `.env.example`. `BLOG_WEBHOOK_SECRET` must match `PORTFOLIO_WEBHOOK_SECRET`
on the blog, and is server-only.
