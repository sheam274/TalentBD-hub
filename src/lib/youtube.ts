export function youtubeId(url?: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      const parts = u.pathname.split("/").filter(Boolean);
      // /embed/ID or /shorts/ID or /v/ID
      if (["embed", "shorts", "v"].includes(parts[0])) return parts[1] ?? null;
    }
  } catch {
    // not a URL — treat as raw id
    if (/^[\w-]{11}$/.test(url)) return url;
  }
  return null;
}

export function youtubeEmbed(url?: string | null): string | null {
  const id = youtubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : null;
}

export function youtubeThumb(url?: string | null): string | null {
  const id = youtubeId(url);
  // mqdefault is generated for every public YouTube video; hqdefault/maxres can 404.
  return id ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg` : null;
}

/** Ordered list of thumbnail URLs from highest to most-reliable quality. */
export function youtubeThumbs(url?: string | null): string[] {
  const id = youtubeId(url);
  if (!id) return [];
  return [
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${id}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
    `https://i.ytimg.com/vi/${id}/0.jpg`,
  ];
}