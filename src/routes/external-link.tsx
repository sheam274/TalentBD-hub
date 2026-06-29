import { createFileRoute } from "@tanstack/react-router";
import { Copy, ExternalLink, ShieldCheck } from "lucide-react";
import { useState } from "react";

const externalSites = {
  facebook: { label: "Facebook", url: "https://www.facebook.com/talentbd" },
  linkedin: { label: "LinkedIn", url: "https://www.linkedin.com/company/talentbd" },
  twitter: { label: "Twitter", url: "https://twitter.com/talentbd" },
  youtube: { label: "YouTube", url: "https://www.youtube.com/@talentbd" },
  website: { label: "TalentBD website", url: "https://talentbd.com" },
} as const;

type ExternalSiteKey = keyof typeof externalSites;

function getExternalSite(site: unknown) {
  if (typeof site !== "string") return null;
  if (!Object.prototype.hasOwnProperty.call(externalSites, site)) return null;
  return externalSites[site as ExternalSiteKey];
}

export const Route = createFileRoute("/external-link")({
  validateSearch: (search) => ({
    site: typeof search.site === "string" ? search.site : "",
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
  const { site } = Route.useSearch();
  const externalSite = getExternalSite(site);
  const safeUrl = externalSite?.url ?? null;
  const host = safeUrl ? new URL(safeUrl).hostname.replace(/^www\./, "") : null;
  const [status, setStatus] = useState<string | null>(null);

  async function copyExternalSite() {
    if (!safeUrl) return;

    try {
      await navigator.clipboard.writeText(safeUrl);
      setStatus("Link copied. Open a new browser tab and paste it there.");
    } catch {
      setStatus(safeUrl);
    }
  }

  async function openExternalSite() {
    if (!safeUrl) return;

    const isInsidePreviewFrame = window.self !== window.top;

    if (isInsidePreviewFrame) {
      await copyExternalSite();
      return;
    }

    const newTab = window.open(safeUrl, "_blank", "noopener,noreferrer");
    if (!newTab) {
      try {
        await navigator.clipboard.writeText(safeUrl);
        setStatus("Popup was blocked, so the link was copied. Paste it into a new browser tab.");
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
              You are leaving TalentBD for {externalSite?.label ?? host}. In preview mode, external social sites are copied instead of loaded inside the frame.
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
              <button
                type="button"
                onClick={copyExternalSite}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-card-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Copy link
                <Copy className="size-4" aria-hidden="true" />
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