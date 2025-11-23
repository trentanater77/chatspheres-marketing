"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Props = {
  room: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    status: string | null;
    is_private: boolean | null;
    created_at: string | null;
  };
  sphereSlug: string;
};

export function VideoRoomCard({ room, sphereSlug }: Props) {
  const router = useRouter();
  const isLive = room.status === "live" || room.status === "waiting";

  const baseUrl = `https://sphere.chatspheres.com/?mode=participant&sphere=${sphereSlug}&room=${room.slug}`;

  const handleJoin = () => {
    router.push(baseUrl);
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-white/60 bg-white/80 p-5 shadow-[0_20px_60px_rgba(34,34,59,0.12)]">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[#22223B]">{room.title}</h3>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-bold uppercase",
              isLive ? "bg-[#e63946]/10 text-[#e63946]" : "bg-[#22223B]/10 text-[#22223B]",
            )}
          >
            {room.status || "inactive"}
          </span>
        </div>
        <p className="mt-2 text-sm text-[#22223B]/70 line-clamp-2">{room.description || "Conversation awaiting a topic."}</p>
      </div>
      <Button onClick={handleJoin} className="mt-4">
        {isLive ? "Join room" : "View details"}
      </Button>
    </div>
  );
}

