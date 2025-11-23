export type Sphere = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  creator: string;
  liveCount: number;
  spectators: number;
  recordings: number;
  category: string;
  accent: string;
  lastRecordingAt: string;
  isLive: boolean;
};

export const featuredSpheres: Sphere[] = [
  {
    slug: "faith-and-focus",
    title: "Faith & Focus",
    description: "Weekly prompts exploring spirituality, mindfulness, and modern rituals.",
    tags: ["faith", "mindfulness", "rituals"],
    accent: "from-[#FFB6B9] to-[#FFD7C2]",
    creator: "Rev. Elise Chan",
    liveCount: 2,
    spectators: 48,
    recordings: 14,
    category: "faith",
    lastRecordingAt: "2h ago",
    isLive: true,
  },
  {
    slug: "wealth-conversations",
    title: "Wealth Conversations",
    description: "Money chats that feel human, covering budgeting, investing, and career jumps.",
    tags: ["finance", "careers"],
    accent: "from-[#FFD166] to-[#FFB347]",
    creator: "Marcos Ibarra",
    liveCount: 1,
    spectators: 31,
    recordings: 22,
    category: "finance",
    lastRecordingAt: "Today",
    isLive: true,
  },
  {
    slug: "calm-heart-lab",
    title: "Calm Heart Lab",
    description: "Mental wellness circles with therapists, peers, and playful coping prompts.",
    tags: ["care", "therapy", "community"],
    accent: "from-[#FCE2E5] to-[#FFB6B9]",
    creator: "Dr. Mina Patel",
    liveCount: 0,
    spectators: 12,
    recordings: 36,
    category: "mental-health",
    lastRecordingAt: "Yesterday",
    isLive: false,
  },
  {
    slug: "builders-salon",
    title: "Builders Salon",
    description: "Founder-to-founder jams with spectators who can toss in questions.",
    tags: ["startups", "product"],
    accent: "from-[#ff9a8b] to-[#ff6a88]",
    creator: "Nico Raines",
    liveCount: 3,
    spectators: 96,
    recordings: 9,
    category: "tech",
    lastRecordingAt: "30m ago",
    isLive: true,
  },
];

export const recordings = [
  {
    title: "How faith leaders are reinventing sabbath",
    sphere: "Faith & Focus",
    length: "18 min replay",
    url: "#",
  },
  {
    title: "Budget clubs as mutual aid",
    sphere: "Wealth Conversations",
    length: "24 min replay",
    url: "#",
  },
  {
    title: "Micro-matchmaking for anxious extroverts",
    sphere: "Calm Heart Lab",
    length: "32 min replay",
    url: "#",
  },
];

export const marketingPoints = [
  {
    title: "Forum to video, automatically",
    copy: "Each sphere mirrors a subreddit-style feed. Posts become live video rooms, comments become requests to join.",
  },
  {
    title: "Spectators without chaos",
    copy: "Up to hundreds can spectate with zero extra setup. Live counters and badges keep momentum visible.",
  },
  {
    title: "Recordings you control",
    copy: "Upload or auto-publish replays, mark them public/paid, and link them right back to the sphere archive.",
  },
];

export const statBlocks = [
  { label: "Spheres live", value: "142", subtext: "across faith, finance, wellness" },
  { label: "Recordings published", value: "3.4k", subtext: "curated + community uploads" },
  { label: "Spectators weekly", value: "82k", subtext: "average unique viewers" },
];

