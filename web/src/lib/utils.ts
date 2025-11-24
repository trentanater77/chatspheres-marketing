import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const videoAppBase = process.env.NEXT_PUBLIC_VIDEO_APP_URL || "https://sphere.chatspheres.com";
const defaultSphereSlug = process.env.NEXT_PUBLIC_DEFAULT_SPHERE_SLUG || "spark-lounge";

export const siteLinks = {
  app: videoAppBase,
  sparkSignup: "/auth?plan=spark",
  orbitSignup: "/auth?plan=orbit",
  constellationSignup: "/auth?plan=constellation",
  maintenance: "/maintenance",
  dashboard: `${videoAppBase.replace(/\/$/, "")}/dashboard`,
  createSphere: "/spheres/create",
  defaultSphereSlug,
  launchHost: (sphereSlug = defaultSphereSlug) =>
    `${videoAppBase.replace(/\/$/, "")}?mode=host&sphere=${sphereSlug}`,
  launchSpectator: (sphereSlug = defaultSphereSlug) =>
    `${videoAppBase.replace(/\/$/, "")}?mode=spectator&sphere=${sphereSlug}`,
};

