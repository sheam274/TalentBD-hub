"""BeTheme visual regression suite.

Captures screenshots of each interactive primitive on /visual-harness in
every meaningful state (rest, hover, focus, pressed, open, disabled) and
diffs them against committed baselines under tests/visual/baselines/.

First run (no baselines): images are written and the run is marked
as "baseline established". Subsequent runs fail when any image differs
from its baseline by more than DIFF_THRESHOLD pixels (after a small
per-pixel tolerance for anti-aliasing).

Usage:
    python3 tests/visual/run.py                # diff against baselines
    python3 tests/visual/run.py --update       # rewrite baselines

Requires the dev server to be running on http://localhost:8080.
"""

from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

from PIL import Image, ImageChops
from playwright.async_api import async_playwright, Page, Locator

ROOT = Path(__file__).parent
BASELINES = ROOT / "baselines"
CURRENT = ROOT / "current"
DIFFS = ROOT / "diffs"
BASE_URL = "http://localhost:8080/visual-harness"

# Per-pixel channel tolerance + max fraction of mismatching pixels.
PIXEL_TOLERANCE = 8
DIFF_THRESHOLD = 0.005  # 0.5% of pixels may differ

# (name, selector, state). state ∈ {rest, hover, focus, press, open, checked}.
CASES: list[tuple[str, str, str]] = [
    # Buttons — every variant + disabled
    ("button-default-rest", '[data-vh="btn-default"]', "rest"),
    ("button-default-hover", '[data-vh="btn-default"]', "hover"),
    ("button-default-focus", '[data-vh="btn-default"]', "focus"),
    ("button-default-press", '[data-vh="btn-default"]', "press"),
    ("button-outline-rest", '[data-vh="btn-outline"]', "rest"),
    ("button-outline-hover", '[data-vh="btn-outline"]', "hover"),
    ("button-secondary-rest", '[data-vh="btn-secondary"]', "rest"),
    ("button-secondary-hover", '[data-vh="btn-secondary"]', "hover"),
    ("button-ghost-rest", '[data-vh="btn-ghost"]', "rest"),
    ("button-ghost-hover", '[data-vh="btn-ghost"]', "hover"),
    ("button-destructive-rest", '[data-vh="btn-destructive"]', "rest"),
    ("button-disabled", '[data-vh="btn-disabled"]', "rest"),
    # Input
    ("input-rest", '[data-vh="input"]', "rest"),
    ("input-hover", '[data-vh="input"]', "hover"),
    ("input-focus", '[data-vh="input"]', "focus"),
    ("input-disabled", '[data-vh="input-disabled"]', "rest"),
    # Textarea
    ("textarea-rest", '[data-vh="textarea"]', "rest"),
    ("textarea-focus", '[data-vh="textarea"]', "focus"),
    # Select
    ("select-rest", '[data-vh="select"]', "rest"),
    ("select-hover", '[data-vh="select"]', "hover"),
    ("select-focus", '[data-vh="select"]', "focus"),
    # Checkbox
    ("checkbox-rest", '[data-vh="checkbox"]', "rest"),
    ("checkbox-hover", '[data-vh="checkbox"]', "hover"),
    ("checkbox-focus", '[data-vh="checkbox"]', "focus"),
    ("checkbox-checked", '[data-vh="checkbox-checked"]', "rest"),
    ("checkbox-disabled", '[data-vh="checkbox-disabled"]', "rest"),
    # Radio
    ("radio-rest", '[data-vh="radio-a"]', "rest"),
    ("radio-checked", '[data-vh="radio-b"]', "rest"),
    ("radio-hover", '[data-vh="radio-a"]', "hover"),
    ("radio-disabled", '[data-vh="radio-disabled"]', "rest"),
    # Switch
    ("switch-off", '[data-vh="switch-off"]', "rest"),
    ("switch-on", '[data-vh="switch-on"]', "rest"),
    ("switch-hover-on", '[data-vh="switch-on"]', "hover"),
    ("switch-focus", '[data-vh="switch-off"]', "focus"),
    ("switch-disabled", '[data-vh="switch-disabled"]', "rest"),
    # Slider
    ("slider-rest", '[data-vh="slider"]', "rest"),
    # Toggle
    ("toggle-rest", '[data-vh="toggle"]', "rest"),
    ("toggle-hover", '[data-vh="toggle"]', "hover"),
    ("toggle-on", '[data-vh="toggle-on"]', "rest"),
    # Tabs
    ("tab-active", '[data-vh="tab-one"]', "rest"),
    ("tab-inactive", '[data-vh="tab-two"]', "rest"),
    ("tab-hover", '[data-vh="tab-two"]', "hover"),
]


async def apply_state(page: Page, target: Locator, state: str) -> None:
    # Reset interaction state between cases.
    await page.mouse.move(0, 0)
    await page.evaluate("() => (document.activeElement as HTMLElement)?.blur()")
    if state == "rest":
        return
    if state == "hover":
        await target.hover()
    elif state == "focus":
        await target.focus()
    elif state == "press":
        box = await target.bounding_box()
        if not box:
            return
        await page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
        await page.mouse.down()
    # Let any transition settle.
    await page.wait_for_timeout(150)


def diff_images(a_path: Path, b_path: Path, out_path: Path) -> float:
    a = Image.open(a_path).convert("RGB")
    b = Image.open(b_path).convert("RGB")
    if a.size != b.size:
        return 1.0
    diff = ImageChops.difference(a, b)
    bbox = diff.getbbox()
    if bbox is None:
        return 0.0
    # Apply per-channel tolerance.
    mask = diff.point(lambda v: 255 if v > PIXEL_TOLERANCE else 0)
    flat = mask.convert("L")
    bad = sum(1 for px in flat.getdata() if px > 0)
    total = flat.size[0] * flat.size[1]
    ratio = bad / total
    if ratio > 0:
        out_path.parent.mkdir(parents=True, exist_ok=True)
        mask.save(out_path)
    return ratio


async def main(update: bool) -> int:
    for d in (BASELINES, CURRENT, DIFFS):
        d.mkdir(parents=True, exist_ok=True)

    failures: list[tuple[str, float]] = []
    new_baselines: list[str] = []

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 1800},
            device_scale_factor=1,
            color_scheme="light",
            reduced_motion="reduce",
        )
        page = await context.new_page()
        await page.goto(BASE_URL, wait_until="networkidle")

        for name, selector, state in CASES:
            target = page.locator(selector).first
            try:
                await target.wait_for(state="visible", timeout=5000)
            except Exception as exc:  # noqa: BLE001
                failures.append((f"{name} (missing: {exc})", 1.0))
                continue

            await apply_state(page, target, state)

            # Screenshot the row containing the element to include focus ring
            # and surrounding spacing in the diff.
            row = target.locator("xpath=ancestor::*[@data-vh-row][1]")
            shot = row if await row.count() else target

            current_path = CURRENT / f"{name}.png"
            await shot.screenshot(path=str(current_path))

            if state == "press":
                await page.mouse.up()

            baseline_path = BASELINES / f"{name}.png"
            if update or not baseline_path.exists():
                baseline_path.write_bytes(current_path.read_bytes())
                new_baselines.append(name)
                continue

            ratio = diff_images(baseline_path, current_path, DIFFS / f"{name}.png")
            if ratio > DIFF_THRESHOLD:
                failures.append((name, ratio))

        await browser.close()

    if new_baselines:
        print(f"[baseline] wrote {len(new_baselines)} new image(s):")
        for n in new_baselines:
            print(f"  + {n}")

    if failures:
        print(f"\n[fail] {len(failures)} component(s) drifted from BeTheme baseline:")
        for n, r in failures:
            print(f"  - {n}: {r:.2%} pixels differ (diff: tests/visual/diffs/{n}.png)")
        return 1

    print(f"\n[ok] {len(CASES)} visual checks passed.")
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--update", action="store_true", help="Rewrite baselines")
    args = parser.parse_args()
    sys.exit(asyncio.run(main(args.update)))