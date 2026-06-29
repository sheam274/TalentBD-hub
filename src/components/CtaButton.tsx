import { Link, type LinkProps } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";

const BASE =
  "group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[10px] px-6 py-3 text-center text-sm font-bold tracking-wide outline-none transition-all duration-300 sm:w-auto sm:gap-2.5 sm:px-7 sm:py-3.5 sm:text-[15px] md:px-9 md:py-4 md:text-base focus-visible:ring-2 focus-visible:ring-[var(--eduma-ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:saturate-50 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100";

const VARIANTS = {
  primary:
    "text-white shadow-lg hover:-translate-y-0.5 hover:bg-[var(--eduma-red-hover)] hover:shadow-xl active:translate-y-0 active:scale-[0.98] active:brightness-95 active:shadow-md",
  secondary:
    "border border-[var(--eduma-ink)]/25 bg-white/50 text-[var(--eduma-ink)] backdrop-blur-md hover:-translate-y-0.5 hover:border-[var(--eduma-ink)] hover:bg-white/80 hover:shadow-lg active:translate-y-0 active:scale-[0.98] active:bg-white/70 active:shadow-sm",
} as const;

type Variant = keyof typeof VARIANTS;

type CtaButtonProps = {
  variant?: Variant;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
} & Pick<LinkProps, "to" | "params" | "search" | "hash">;

const PRIMARY_STYLE: CSSProperties = {
  background: "var(--eduma-red-strong)",
  boxShadow:
    "0 12px 28px -8px color-mix(in oklab, var(--eduma-red-strong) 55%, transparent)",
};

export function CtaButton({
  variant = "primary",
  disabled = false,
  children,
  className = "",
  style,
  to,
  params,
  search,
  hash,
  ...rest
}: CtaButtonProps) {
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`.trim();
  const mergedStyle = variant === "primary" ? { ...PRIMARY_STYLE, ...style } : style;

  if (disabled) {
    return (
      <button type="button" disabled className={cls} style={mergedStyle} {...rest}>
        {children}
      </button>
    );
  }

  return (
    <Link to={to} params={params} search={search} hash={hash} className={cls} style={mergedStyle} {...rest}>
      {children}
    </Link>
  );
}