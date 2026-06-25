import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
function domainFrom(url) {
  if (!url) return null;
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
function CompanyLogo({
  name,
  url,
  website,
  size = 48,
  className = ""
}) {
  const sources = reactExports.useMemo(() => {
    const list = [];
    if (url) list.push(url);
    const fromUrl = domainFrom(url);
    const fromSite = domainFrom(website);
    const domain = fromSite || fromUrl;
    if (domain) {
      list.push(`https://logo.clearbit.com/${domain}`);
      list.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
      list.push(`https://icons.duckduckgo.com/ip3/${domain}.ico`);
    }
    return Array.from(new Set(list));
  }, [url, website]);
  const [idx, setIdx] = reactExports.useState(0);
  const current = sources[idx];
  const initials = name.slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `rounded-xl bg-white shadow-sm ring-1 ring-border overflow-hidden grid place-items-center ${className}`,
      style: { width: size, height: size },
      children: current ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: current,
          alt: name,
          loading: "lazy",
          referrerPolicy: "no-referrer",
          onError: () => setIdx((i) => i + 1),
          className: "object-contain",
          style: { width: size, height: size, padding: Math.max(4, size * 0.1) }
        },
        current
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "font-bold",
          style: { color: "var(--color-primary)", fontSize: Math.max(11, size * 0.32) },
          children: initials
        }
      )
    }
  );
}
export {
  CompanyLogo as C
};
