import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const siteLinks = {
  app: "https://sphere.chatspheres.com",
  sparkSignup: "/auth?plan=spark",
  orbitSignup: "/auth?plan=orbit",
  constellationSignup: "/auth?plan=constellation",
  maintenance: "/maintenance",
};

