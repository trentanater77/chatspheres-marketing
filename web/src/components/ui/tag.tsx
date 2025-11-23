import { cn } from "@/lib/utils";

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[#FFD166] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#22223B] transition hover:bg-[#e63946] hover:text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}

