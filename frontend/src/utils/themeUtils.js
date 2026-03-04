/**
 * Parse hex color to r, g, b. Supports #RGB and #RRGGBB.
 */
function hexToRgb(hex) {
  if (!hex || typeof hex !== "string") return null;
  const h = hex.replace(/^#/, "").trim();
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    return { r, g, b };
  }
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

/**
 * Convert hex to rgba string.
 */
export function hexToRgba(hex, alpha) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

/**
 * Generate CSS custom properties for a custom theme from a primary hex.
 * Returns an object of var names to values for light mode.
 */
export function themeVarsFromHex(hex, isDark = false) {
  const rgb = hexToRgb(hex);
  if (!rgb) return {};

  const { r, g, b } = rgb;
  const rgba = (a) => `rgba(${r}, ${g}, ${b}, ${a})`;

  if (isDark) {
    return {
      "--color-timetable-panel-bg": "#1e293b",
      "--color-timetable-panel-border": rgba(0.35),
      "--color-timetable-row-bg": rgba(0.15),
      "--color-timetable-row-border": rgba(0.3),
      "--color-next-prayer-bg": rgba(0.2),
      "--color-next-prayer-border": rgba(0.4),
      "--color-next-prayer-text": `rgb(${Math.min(255, r + 80)}, ${Math.min(255, g + 80)}, ${Math.min(255, b + 80)})`,
      "--color-active-bg": rgba(0.35),
      "--color-active-border": rgba(0.6),
      "--color-active-glow": rgba(0.5),
      "--color-active-text": "#ffffff",
      "--color-ramadan-label-text": `rgba(${Math.min(255, r + 80)}, ${Math.min(255, g + 80)}, ${Math.min(255, b + 80)}, 0.95)`,
    };
  }

  const activeTextR = Math.round(Math.max(0, r * 0.45));
  const activeTextG = Math.round(Math.max(0, g * 0.45));
  const activeTextB = Math.round(Math.max(0, b * 0.45));

  return {
    "--color-timetable-panel-bg": "#ffffff",
    "--color-timetable-panel-border": rgba(0.35),
    "--color-timetable-row-bg": rgba(0.18),
    "--color-timetable-row-border": rgba(0.3),
    "--color-next-prayer-bg": rgba(0.45),
    "--color-next-prayer-border": rgba(0.5),
    "--color-next-prayer-text": "#000000",
    "--color-active-bg": rgba(0.6),
    "--color-active-border": rgba(0.85),
    "--color-active-glow": rgba(0.5),
    "--color-active-text": `rgb(${activeTextR}, ${activeTextG}, ${activeTextB})`,
    "--color-ramadan-label-text": `rgba(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)}, 0.95)`,
  };
}
