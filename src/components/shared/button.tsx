import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-brand-600 via-sky-500 to-cyan-500 text-white shadow-[0_15px_25px_-15px_rgba(3,105,161,0.75)] hover:brightness-105 disabled:from-slate-300 disabled:via-slate-300 disabled:to-slate-300",
  secondary:
    "bg-white text-slate-900 ring-1 ring-slate-200 shadow-[0_10px_20px_-18px_rgba(15,23,42,0.55)] hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400",
  danger:
    "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-[0_15px_25px_-16px_rgba(190,24,93,0.7)] hover:brightness-105 disabled:from-rose-300 disabled:to-rose-300"
};

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-extrabold tracking-wide transition duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:transform-none",
        variantClass[variant],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
