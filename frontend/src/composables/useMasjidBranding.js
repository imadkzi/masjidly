import { watch } from "vue";

const DEFAULT_FAVICON = "/favicon.svg";
const DEFAULT_APPLE_TOUCH = "/apple-touch-icon.png";
const DEFAULT_NAME = "Masjidly";
let manifestBlobUrl = null;

async function updateManifest(displayName) {
  const link = document.querySelector('link[rel="manifest"]');
  if (!link) return;
  try {
    const res = await fetch("/site.webmanifest");
    const manifest = await res.json();
    manifest.name = displayName;
    manifest.short_name = displayName;
    if (manifestBlobUrl) URL.revokeObjectURL(manifestBlobUrl);
    manifestBlobUrl = URL.createObjectURL(
      new Blob([JSON.stringify(manifest)], { type: "application/manifest+json" })
    );
    link.href = manifestBlobUrl;
  } catch {
    // Keep static manifest on fetch error
  }
}

/**
 * Applies masjid branding: document title, PWA manifest name/short_name, apple-mobile-web-app-title, favicon, apple-touch-icon.
 * Call with settings from useMasjidSettings.
 */
export function useMasjidBranding(settings) {
  watch(
    () => settings.value.masjidName,
    (name) => {
      const displayName = name || DEFAULT_NAME;
      document.title = displayName;
      const pwaTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
      if (pwaTitle) pwaTitle.setAttribute("content", displayName);
      updateManifest(displayName);
    },
    { immediate: true },
  );

  watch(
    () => settings.value.logo,
    (logoUrl) => {
      const iconHref = logoUrl || DEFAULT_FAVICON;
      const appleHref = logoUrl || DEFAULT_APPLE_TOUCH;
      const iconType = iconHref.toLowerCase().endsWith(".svg") ? "image/svg+xml" : "image/png";

      document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach((el) => {
        el.href = iconHref;
        el.type = iconType;
      });

      document.querySelectorAll('link[rel="apple-touch-icon"]').forEach((el) => {
        el.href = appleHref;
      });
    },
    { immediate: true },
  );
}
