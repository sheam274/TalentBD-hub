import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { useState } from "react";

const allowedHosts = new Set([
  "www.facebook.com",
  "facebook.com",
  "www.linkedin.com",
  "linkedin.com",
  "twitter.com",
  "x.com",
  "www.youtube.com",
  "youtube.com",
  "talentbd.com",
  "www.talentbd.com",
]);

function getSafeUrl(rawUrl: unknown) {
  if (typeof rawUrl !== "string") return null;
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:") return null;
    if (!allowedHosts.has(url.hostname.toLowerCase())) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/external-link")({
  validateSearch: (search) => ({
    url: typeof search.url === "string" ? search.url : "",
  }),
  head: () => ({
    meta: [
      { title: "Open external link — TalentBD" },
      { name: "description", content: "Continue from TalentBD to an external social profile." },
    ],
  }),
  component: ExternalLinkPage,
});

function ExternalLinkPage() {
  const { url } = Route.useSearch();
  const safeUrl = getSafeUrl(url);
  const host = safeUrl ? new URL(safeUrl).hostname.replace(/^www\./, "") : null;
  const [status, setStatus] = useState<string | null>(null);

  async function openExternalSite() {
    if (!safeUrl) return;

    try {
      if (window.top && window.top !== window) {
        window.top.location.href = safeUrl;
        return;
      }

      window.location.href = safeUrl;
    } catch {
      try {
        await navigator.clipboard.writeText(safeUrl);
        setStatus("Link copied. Paste it into a new browser tab to open it.");
      } catch {
        setStatus(safeUrl);
      }
    }
  }

  return (
    <section className="min-h-[70vh] bg-background px-4 py-20 text-foreground">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
          <ShieldCheck className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Continue to external site</h1>
        {safeUrl ? (
          <>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              You are leaving TalentBD for {host}. Opening it from this page prevents blocked iframe loading in the preview.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={openExternalSite}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Open {host}
                <ExternalLink className="size-4" aria-hidden="true" />
              </button>
              <a
                href="/"
                className="inline-flex items-center rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-card-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Back to TalentBD
              </a>
            </div>
            {status && <p className="mt-4 rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">{status}</p>}
          </>
        ) : (
          <>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">This external link is invalid or not allowed.</p>
            <a
              href="/"
              className="mt-8 inline-flex items-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Back to TalentBD
            </a>
          </>
        )}
      </div>
    </section>
  );
}