"""E2E: unauthenticated users cannot reach protected routes.

Visits candidate (/dashboard), employer (/employer/dashboard), and admin
(/admin/dashboard) with no Supabase session in localStorage and asserts the
router redirects them to /auth.
"""
import asyncio, sys
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
    failures = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        # Fresh context — no storage, no cookies, no Supabase session
        ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await ctx.new_page()

        for label, route in ROUTES:
            await page.goto(BASE + route, wait_until="domcontentloaded")
            # Allow the _authenticated guard to run + redirect
            try:
                await page.wait_for_url("**/auth**", timeout=5000)
            except Exception:
                pass
            await page.screenshot(path=str(SHOTS / f"guard_{label}.png"))

            url = page.url
            on_auth = "/auth" in url
            # Sanity: protected content should not be on the page
            shell = await page.locator(".dashboard-shell").count()
            print(f"{label:9s} -> {url}  on_auth={on_auth} shell={shell}")

            if not on_auth:
                failures.append(f"{label}: not redirected to /auth (got {url})")
            if shell > 0:
                failures.append(f"{label}: protected shell rendered while signed out")

        await browser.close()

    if failures:
        print("\nFAIL:")
        for f in failures: print("  -", f)
        return 1
    print("\nOK: all protected routes redirect unauthenticated visitors to /auth")
    return 0

sys.exit(asyncio.run(run()))
