import { watch, ref } from "vue";
import { themeVarsFromHex } from "../utils/themeUtils";

/**
 * Applies theme preset (data-theme-preset) and custom theme CSS.
 * Call with settings from useMasjidSettings.
 */
export function useThemePreset(settings) {
  const customThemeStyleEl = ref(null);

  function applyThemePreset() {
    const preset = settings.value.themePreset || "default";
    const root = document.documentElement;

    if (preset === "custom" && settings.value.customPrimaryColor) {
      root.setAttribute("data-theme-preset", "custom");
      if (!customThemeStyleEl.value) {
        customThemeStyleEl.value = document.createElement("style");
        customThemeStyleEl.value.id = "masjidly-custom-theme";
        document.head.appendChild(customThemeStyleEl.value);
      }
      const lightVars = themeVarsFromHex(settings.value.customPrimaryColor, false);
      const darkVars = themeVarsFromHex(settings.value.customPrimaryColor, true);
      const toRules = (vars) =>
        Object.entries(vars)
          .map(([k, v]) => `${k}: ${v}`)
          .join("; ");
      customThemeStyleEl.value.textContent = `
[data-theme-preset="custom"] { ${toRules(lightVars)} }
[data-theme="dark"][data-theme-preset="custom"] { ${toRules(darkVars)} }
`;
    } else {
      root.setAttribute("data-theme-preset", preset);
      if (customThemeStyleEl.value) {
        customThemeStyleEl.value.textContent = "";
      }
    }
  }

  watch(
    () => [settings.value.themePreset, settings.value.customPrimaryColor],
    applyThemePreset,
    { immediate: true },
  );
}
