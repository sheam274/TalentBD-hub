# BeTheme Visual Regression

Captures every interactive primitive (button, input, textarea, select,
checkbox, radio, switch, slider, toggle, tabs) in each meaningful state
(rest, hover, focus, press, checked, disabled) from the hidden harness
route `/visual-harness`, and diffs against committed baselines.

## Run

```bash
# 1. dev server must be live on :8080
# 2. diff against baselines (CI mode)
python3 tests/visual/run.py

# 3. accept intentional design changes
python3 tests/visual/run.py --update
```

- Baselines: `tests/visual/baselines/`
- Latest captures: `tests/visual/current/`
- Failing diff masks: `tests/visual/diffs/`

Tune `PIXEL_TOLERANCE` / `DIFF_THRESHOLD` in `run.py` if anti-aliasing
jitter causes flakes on a new platform.