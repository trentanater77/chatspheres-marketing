export const siteConfig = {
  name: "Chatspheres",
  tagline: "Talk with purpose. Connect with heart.",
  description:
    "Topic-driven spheres, thoughtful prompts, and LiveKit-powered conversations that feel intimate—even with an audience.",
  socials: {
    twitter: "https://x.com/chatspheres",
    discord: "https://discord.gg/chatspheres",
    email: "hello@chatspheres.com",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "Pricing", href: "/pricing" },
    { label: "For Communities", href: "/spheres" },
    { label: "Moderation", href: "/moderation" },
    { label: "Profile", href: "/settings/profile" },
  ],
};

export type PlanTier = {
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  limits: string[];
  tag?: string;
  productIdMonthly?: string | null;
  productIdYearly?: string | null;
  priceMonthlyId?: string | null;
  priceYearlyId?: string | null;
  adSupported?: boolean;
  freeRedirect?: string;
};

const stripePriceIds = {
  sparkPlusMonthly: process.env.NEXT_PUBLIC_STRIPE_SPARK_PLUS_MONTHLY_PRICE ?? null,
  sparkPlusYearly: process.env.NEXT_PUBLIC_STRIPE_SPARK_PLUS_YEARLY_PRICE ?? null,
  orbitMonthly: process.env.NEXT_PUBLIC_STRIPE_ORBIT_MONTHLY_PRICE ?? null,
  orbitYearly: process.env.NEXT_PUBLIC_STRIPE_ORBIT_YEARLY_PRICE ?? null,
  constellationMonthly: process.env.NEXT_PUBLIC_STRIPE_CONSTELLATION_MONTHLY_PRICE ?? null,
  constellationYearly: process.env.NEXT_PUBLIC_STRIPE_CONSTELLATION_YEARLY_PRICE ?? null,
};

export const planTiers: PlanTier[] = [
  {
    name: "Spark",
    priceMonthly: 0,
    priceYearly: 0,
    description: "Generous ad-supported tier to get your first spheres humming.",
    limits: [
      "5 spheres • 2 rooms live",
      "300 min recordings / mo (14-day retention)",
      "Unlimited spectators + live stats",
      "Sponsored Explore placements (tasteful)",
    ],
    tag: "Ad-supported",
    productIdMonthly: "prod_TTcmgZHzUcoNkq",
    productIdYearly: null,
    adSupported: true,
    freeRedirect: "https://sphere.chatspheres.com",
  },
  {
    name: "Spark+",
    priceMonthly: 10,
    priceYearly: 90,
    description: "Remove ads and keep Spark's generous limits intact.",
    limits: [
      "Ad-free hosting",
      "Powered by Chatspheres badge optional",
      "$10/mo add-on or $90/yr",
    ],
    productIdMonthly: "prod_TTd0VVKgssRQta",
    productIdYearly: "prod_TTd2Iv3hy6eQav",
    priceMonthlyId: stripePriceIds.sparkPlusMonthly,
    priceYearlyId: stripePriceIds.sparkPlusYearly,
  },
  {
    name: "Orbit",
    priceMonthly: 29,
    priceYearly: 290,
    description: "For community builders who host on a weekly cadence.",
    limits: [
      "25 spheres • 5 rooms live",
      "2,000 min recordings (60-day retention)",
      "$25 promo credit for featured placements",
      "Scheduling, co-host invites, white-label share pages",
    ],
    tag: "Most popular",
    productIdMonthly: "prod_TTcmLhL84sOEqr",
    productIdYearly: "prod_TTd3weD7DMTncn",
    priceMonthlyId: stripePriceIds.orbitMonthly,
    priceYearlyId: stripePriceIds.orbitYearly,
  },
  {
    name: "Constellation",
    priceMonthly: 79,
    priceYearly: 790,
    description: "Scale-ready control for studios, networks, and teams.",
    limits: [
      "Unlimited spheres • 15 rooms live",
      "10,000 min recordings (180-day retention + export)",
      "Team roles, custom subdomains, SLA support",
      "Matchmaking beta + sponsored-sphere marketplace",
    ],
    productIdMonthly: "prod_TTclmSYFM4yUCm",
    productIdYearly: "prod_TTd4eoFfW8xYmv",
    priceMonthlyId: stripePriceIds.constellationMonthly,
    priceYearlyId: stripePriceIds.constellationYearly,
  },
];

