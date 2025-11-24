import type { ReactNode } from "react";
import type { LandingSphere } from "@/lib/data";
import { cn } from "@/lib/utils";
import { CommunitySidebar } from "./community-sidebar";

type PageWithSidebarProps = {
  children: ReactNode;
  initialSphere?: LandingSphere | null;
  contentClassName?: string;
};

export function PageWithSidebar({ children, initialSphere, contentClassName }: PageWithSidebarProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className={cn("flex flex-col gap-10", contentClassName)}>{children}</div>
        <CommunitySidebar initialSphere={initialSphere} />
      </div>
    </div>
  );
}

