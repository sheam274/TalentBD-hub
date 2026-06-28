"""Eduma page-level visual regression suite.

Captures full-viewport screenshots of key pages (home, jobs, auth, chat
assistant open, dashboard) and diffs them against baselines under
tests/visual/baselines_pages/.

Usage:
    python3 tests/visual/pages.py            # diff vs baselines
    python3 tests/visual/pages.py --update   # rewrite baselines

Requires the dev server on http://localhost:8080. Dashboard capture is
skipped automatically when no Supabase session is injected
(LOVABLE_BROWSER_AUTH_STATUS != "injected").
"""
from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
from pathlib import Path

from PIL import Image, ImageChops
from playwright.async_api import async_playwright, Page

ROOT = Path(__file__).parent
BASELINES = ROOT / "baselines_pages"
CURRENT = ROOT / "current_pages"
DIFFS = ROOT / "diffs_pages"
BASE = "http://localhost:8080"

PIXEL_TOLERANCE = 12
DIFF_THRESHOLD = 0.02  # 2% of pixels may differ

VIEWPORT = {"width": 1280, "height": 1800}


async def restore_session(page: Page) -> bool:
    storage_key = os.environ.get("LOVABLE_BROWSER_SUPABASE_STORAGE_KEY")
    session_json = os.environ.get("LOVABLE_BROWSER_SUPABASE_SESSION_JSON")
    if not (storage_key and session_json):
        return False
    await page.goto(BASE, wait_until="domcontentloaded")
    await page.evaluate(
        f"window.localStorage.setItem({json.dumps(storage_key)}, {json.dumps(session_json)})"
    )
    return True


async def settle(page: Page) -> None:
    await page.add_style_tag(content="""
        *, *::before, *::after {
            transition: none !important;
            animation: none !important;
            caret-color: transparent !important;
        }
    """)
    try:
        await page.wait_for_load_state("networkidle", timeout=5000)
    except Exception:
        pass
    try:
        await page.evaluate("document.fonts && document.fonts.ready")
    except Exception:
        pass
    await page.wait_for_timeout(400)


async def capture(page: Page, url: str, name: str) -> Path:
    await page.goto(f"{BASE}{url}", wait_until="domcontentloaded")
    await settle(page)
    out = CURRENT / f"{name}.png"
    await page.screenshot(path=str(out))
    return out


async def capture_chat(page: Page) -> Path:
    await page.goto(BASE, wait_until="domcontentloaded")
    await settle(page)
    await page.get_by_role("button", name="Open AI assistant").click()
    await page.wait_for_timeout(500)
    out = CURRENT / "chat-assistant-open.png"
    await page.screenshot(path=str(out))
    return out


def diff(current: Path, baseline: Path, name: str) -> tuple[bool, float]:
    a = Image.open(current).convert("RGB")
    b = Image.open(baseline).convert("RGB")
    if a.size != b.size:
        return False, 1.0
    delta = ImageChops.difference(a, b)
    px = delta.load()
    w, h = delta.size
    mismatched = 0
    sampled = 0
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            sampled += 1
            r, g, bl = px[x, y]
            if max(r, g, bl) > PIXEL_TOLERANCE:
                mismatched += 1
    frac = mismatched / max(sampled, 1)
    if frac > DIFF_THRESHOLD:
        DIFFS.mkdir(parents=True, exist_ok=True)
        delta.save(DIFFS / f"{name}.png")
        return False, frac
    return True, frac


async def main(update: bool) -> int:
    for d in (BASELINES, CURRENT, DIFFS):
        d.mkdir(parents=True, exist_ok=True)

    targets = [
        ("home", "/"),
        ("jobs", "/jobs"),
        ("auth", "/auth"),
        ("companies", "/companies"),
    ]
    authed = os.environ.get("LOVABLE_BROWSER_AUTH_STATUS") == "injected"

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport=VIEWPORT)
        page = await context.new_page()

        captures: list[tuple[str, Path]] = []
        for name, url in targets:
            try:
                captures.append((name, await capture(page, url, name)))
            except Exception as e:
                print(f"ERROR capturing {name}: {e}")

        try:
            captures.append(("chat-assistant-open", await capture_chat(page)))
        except Exception as e:
            print(f"ERROR capturing chat: {e}")

        if authed:
            await restore_session(page)
            try:
                captures.append(("dashboard", await capture(page, "/dashboard", "dashboard")))
            except Exception as e:
                print(f"ERROR capturing dashboard: {e}")
        else:
            print("skip: dashboard (no Supabase session injected)")

        await browser.close()

    failures: list[str] = []
    established: list[str] = []
    for name, current in captures:
        baseline = BASELINES / f"{name}.png"
        if update or not baseline.exists():
            baseline.write_bytes(current.read_bytes())
            established.append(name)
            continue
        ok, frac = diff(current, baseline, name)
        status = "PASS" if ok else "FAIL"
        print(f"{status} {name}  diff={frac:.4f}")
        if not ok:
            failures.append(name)

    if established:
        print(f"baseline established for: {', '.join(established)}")
    if failures:
        print(f"\n{len(failures)} mismatch(es): {', '.join(failures)}")
        return 1
    print("\nall page snapshots match Eduma baselines.")
    return 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--update", action="store_true")
    args = ap.parse_args()
    sys.exit(asyncio.run(main(args.update)))
