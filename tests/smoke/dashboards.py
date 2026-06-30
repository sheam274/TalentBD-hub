"""E2E smoke tests for authenticated dashboards.

Verifies that /dashboard, /employer, and /admin load behind the
_authenticated layout and that the unified `.dashboard-shell` plus
glow-card styles render. Requires LOVABLE_BROWSER_SUPABASE_* env vars
(injected by Lovable sandbox when a signed-in session is available).
"""
import asyncio, json, os, sys
from pathlib import Path
from playwright.async_api import async_playwright

BASE = "http://localhost:8080"
SHOTS = Path(__file__).parent / "screenshots"
SHOTS.mkdir(exist_ok=True)

ROUTES = [
    ("candidate", "/dashboard"),
    ("employer",  "/employer/dashboard"),
    ("admin",     "/admin/dashboard"),
]

async def run():
    storage_key = os.environ.get("LOVABLE_BROWSER_SUPABASE_STORAGE_KEY")
    session_json = os.environ.get("LOVABLE_BROWSER_SUPABASE_SESSION_JSON")
    if not (storage_key and session_json):
        print("SKIP: no injected Supabase session (LOVABLE_BROWSER_AUTH_STATUS != injected)")
        return 0

    failures = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await ctx.new_page()
        await page.goto(BASE, wait_until="domcontentloaded")
        await page.evaluate(
            f"window.localStorage.setItem({json.dumps(storage_key)}, {json.dumps(session_json)})"
        )

        for label, route in ROUTES:
            await page.goto(BASE + route, wait_until="networkidle")
            await page.screenshot(path=str(SHOTS / f"{label}.png"))

            # 1. Route did not bounce to /auth
            if "/auth" in page.url:
                failures.append(f"{label}: redirected to {page.url} (not authorized)")
                continue

            # 2. Dashboard shell present (unified layout wrapper)
            shell = page.locator(".dashboard-shell")
            shell_count = await shell.count()
            # 3. Shell received the unified glow styles (padding from CSS rule)
            padding = await shell.first.evaluate(
                "el => el ? getComputedStyle(el).paddingTop : '0px'"
            ) if shell_count else "0px"
            # 4. Main content rendered (not blank shell)
            headings = await page.locator(".dashboard-shell :is(h1,h2,h3)").count()
            print(f"{label:9s} {page.url}  shell={shell_count} pad={padding} headings={headings}")
            if shell_count < 1:
                failures.append(f"{label}: missing .dashboard-shell")
            if headings < 1:
                failures.append(f"{label}: no headings rendered inside shell")
            if padding == "0px":
                failures.append(f"{label}: shell missing unified spacing")

        await browser.close()

    if failures:
        print("\nFAIL:")
        for f in failures: print("  -", f)
        return 1
    print("\nOK: all dashboards rendered with unified glow cards")
    return 0

sys.exit(asyncio.run(run()))
