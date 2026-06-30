import { useState } from "react";
import { youtubeThumbs } from "@/lib/youtube";

export function YouTubeThumb({
  url,
  alt,
  className,
  loading = "lazy",
}: {
  url?: string | null;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const candidates = youtubeThumbs(url);
  const [idx, setIdx] = useState(0);
  if (candidates.length === 0) {
    return (
      <div
        className={className}
        style={{ background: "linear-gradient(135deg, oklch(0.7 0.12 30), oklch(0.6 0.18 280))" }}
        aria-label={alt}
        role="img"
      />
    );
  }
  return (
    <img
      src={candidates[idx]}
      alt={alt}
      loading={loading}
      className={className}
      onError={() => {
        if (idx < candidates.length - 1) setIdx(idx + 1);
      }}
    />
  );
}