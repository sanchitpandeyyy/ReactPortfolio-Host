// ───────────────────────────────────────────────────────────────────
//  BLOG / NOTES DATA
//  Placeholder content for now. When the external API is ready, only
//  getAllPosts() and getPost() need to change — pages already await them.
// ───────────────────────────────────────────────────────────────────

export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  date: string;
  readingMinutes: number;
  category: string;
  excerpt: string;
  tags: string[];
  views: number;
  body: string[];
}

const posts: BlogPost[] = [
  {
    slug: "building-quiet-interfaces",
    title: "On building quiet interfaces",
    author: "Sanchit Pandey",
    date: "May 12, 2026",
    readingMinutes: 5,
    category: "Design",
    excerpt:
      "A short defense of interfaces that do not talk back unless asked. The best features I have shipped were the ones nobody noticed.",
    tags: ["Design", "Product", "Craft"],
    views: 1284,
    body: [
      "The best features I have shipped were the ones nobody noticed. They made the slow thing fast, or the imprecise thing precise, and then stayed out of the way.",
      "A quiet interface does not announce itself. It does not throw confetti when a form saves. It saves the form, shows a small steady mark, and lets you carry on with the work you actually came to do.",
      "This is harder than it sounds. Loud interfaces are easy: add an animation, add a banner, add a badge. Quiet ones require you to decide what genuinely matters and to trust the user with everything else.",
      "I have started measuring my own work by how little explanation it needs. If a screen needs a tooltip to be understood, that is usually a sign the screen is wrong, not that the tooltip is missing.",
      "Quiet is not the same as plain. A quiet interface can still have a strong point of view. It just expresses that view through rhythm, type, and restraint rather than through noise.",
    ],
  },
  {
    slug: "organizing-innovatex-end-to-end",
    title: "Organizing InnovateX, end to end",
    author: "Sanchit Pandey",
    date: "April 4, 2026",
    readingMinutes: 9,
    category: "Community",
    excerpt:
      "What I learned running BMC InnovateX as lead organizer, while also building the platform that ran it. Most of the hard parts were not software.",
    tags: ["Community", "Events", "Operations"],
    views: 642,
    body: [
      "BMC InnovateX was a national-level hackathon, and I ended up wearing two hats: lead organizer, and the person who built the platform that ran it.",
      "Most of the hard parts were not software. They were logistics: getting judges to confirm, getting rooms booked, getting a schedule that survived contact with reality.",
      "The software mattered, but only because it removed friction from those human problems. Registration, judging, and live results all ran through one dashboard, so nobody had to chase a spreadsheet at 2am.",
      "If I organized it again, I would spend even less time on features and even more time on the runbook: who does what, when, and what happens when a step fails.",
      "Communities are systems too. They just have people instead of functions, and people do not throw clean exceptions.",
    ],
  },
  {
    slug: "the-weekly-demo",
    title: "Why every team I join ships a weekly demo",
    author: "Sanchit Pandey",
    date: "February 18, 2026",
    readingMinutes: 4,
    category: "Process",
    excerpt:
      "Ten minutes, every Friday, even when there is nothing to show. Especially then. A small ritual that keeps a small team honest.",
    tags: ["Process", "Teams"],
    views: 903,
    body: [
      "Every small team I have worked with ships a ten-minute demo every Friday. Even when there is nothing to show. Especially then.",
      "A demo is a forcing function. It turns vague progress into something concrete enough to point at, and it surfaces the gap between what we said we would do and what actually happened.",
      "The weeks with nothing to show are the most useful ones. They are a quiet alarm that something is stuck, and they let the team fix it while it is still small.",
      "It also keeps the work honest. It is hard to hide a stalled feature from a room of people who watched you start it three Fridays ago.",
      "Ten minutes is the whole point. It is short enough that nobody dreads it, and long enough to tell the truth.",
    ],
  },
  {
    slug: "shipping-software-from-butwal",
    title: "Shipping software from Butwal",
    author: "Sanchit Pandey",
    date: "January 9, 2026",
    readingMinutes: 6,
    category: "Career",
    excerpt:
      "I build from a small desk in Rupandehi, Nepal, on the same internet as everyone else. Here is what that actually requires.",
    tags: ["Nepal", "Career", "Remote"],
    views: 1517,
    body: [
      "I build software from Butwal, a city in Rupandehi, Nepal. Not from San Francisco, not from a hub. From a small desk, in a small city, on the same internet as everyone else.",
      "For a long time that felt like a disadvantage to explain away. It is not. The internet does not care where the commit came from, and a well-documented, type-safe codebase reads the same in every timezone.",
      "What it does require is discipline about communication. When you are not in the room, your writing is the room. Clear briefs, clear commits, and clear demos do the work that hallway conversations do elsewhere.",
      "It also means choosing boring, durable tools. I cannot afford infrastructure that needs babysitting, so I lean on systems that stay quiet and predictable.",
      "Shipping from Nepal is not a constraint I work around. It is just where the work happens, and the work travels fine.",
    ],
  },
];

export async function getAllPosts(): Promise<BlogPost[]> {
  return posts;
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  return posts.find((p) => p.slug === slug);
}
