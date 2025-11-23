import { cn } from "@/lib/utils";
import Link from "next/link";
import { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const styles = {
    primary:
      "bg-[#FFD166] text-[#22223B] hover:bg-[#e63946] hover:text-white shadow-[0_15px_40px_rgba(230,57,70,0.2)]",
    secondary:
      "bg-white/70 text-[#22223B] border border-[#22223B]/10 hover:bg-white/90 shadow-sm",
    ghost: "text-[#22223B] hover:text-[#e63946]",
  }[variant];

  return (
    <button
      {...props}
      className={cn(
        "rounded-full px-6 py-2.5 text-sm font-bold uppercase tracking-wide transition",
        styles,
        className,
      )}
    />
  );
}

type ButtonLinkProps = ComponentProps<"a"> & {
  variant?: "primary" | "secondary" | "ghost";
  href: string;
};

export function ButtonLink({
  className,
  variant = "primary",
  href,
  children,
  ...props
}: ButtonLinkProps) {
  const styles = {
    primary:
      "bg-[#FFD166] text-[#22223B] hover:bg-[#e63946] hover:text-white shadow-[0_15px_40px_rgba(230,57,70,0.2)]",
    secondary:
      "bg-white/70 text-[#22223B] border border-[#22223B]/10 hover:bg-white/90 shadow-sm",
    ghost: "text-[#22223B] hover:text-[#e63946]",
  }[variant];

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex rounded-full px-6 py-2.5 text-sm font-bold uppercase tracking-wide transition",
        styles,
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

