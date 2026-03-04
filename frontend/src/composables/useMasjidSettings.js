import { ref, onMounted } from "vue";
import { fetchData, resolveStrapiMediaUrl } from "../utils/apiUtils";

const defaults = {
  masjidName: "Masjidly",
  logo: null,
  showMasjidName: true,
  themePreset: "default",
  customPrimaryColor: null,
  showDayLabels: false,
};

const settings = ref({ ...defaults });
const loading = ref(true);
const error = ref(null);
let fetchPromise = null;

async function fetchSettings(force = false) {
  if (fetchPromise && !force) return fetchPromise;
  loading.value = true;
  error.value = null;
  fetchPromise = (async () => {
    try {
      const data = await fetchData("/api/masjid-setting?populate=logo");
      const doc = data?.data;
      if (doc?.id || doc?.documentId) {
        const logoObj = Array.isArray(doc.logo) ? doc.logo[0] : doc.logo;
        const logoUrl =
          logoObj?.url ||
          logoObj?.data?.attributes?.url ||
          logoObj?.formats?.large?.url;
        settings.value = {
          masjidName: doc.masjidName ?? defaults.masjidName,
          logo: logoUrl ? resolveStrapiMediaUrl(logoUrl) : defaults.logo,
          showMasjidName:
            doc.showMasjidName !== undefined
              ? !!doc.showMasjidName
              : defaults.showMasjidName,
          themePreset:
            doc.themePreset &&
            [
              "default",
              "green",
              "blue",
              "purple",
              "amber",
              "copper",
              "custom",
            ].includes(doc.themePreset)
              ? doc.themePreset
              : defaults.themePreset,
          customPrimaryColor:
            doc.themePreset === "custom" && doc.customPrimaryColor
              ? String(doc.customPrimaryColor).trim()
              : defaults.customPrimaryColor,
          showDayLabels:
            doc.showDayLabels !== undefined ? !!doc.showDayLabels : defaults.showDayLabels,
        };
      } else {
        settings.value = { ...defaults };
      }
    } catch (err) {
      error.value = err;
      settings.value = { ...defaults };
    } finally {
      loading.value = false;
    }
  })();
  return fetchPromise;
}

export function useMasjidSettings() {
  onMounted(() => fetchSettings());
  return { settings, loading, error, refetch: () => fetchSettings(true) };
}
