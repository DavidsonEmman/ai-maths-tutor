// ─── HELPERS ──────────────────────────────────────────────────────────────────
export function pct(correct, total) {
  return total === 0 ? 0 : Math.round((correct / total) * 100);
}

export function delay(fn, ms) {
  setTimeout(fn, ms);
}
