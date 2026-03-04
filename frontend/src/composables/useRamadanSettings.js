import { ref, onMounted } from "vue";
import { fetchData, resolveStrapiMediaUrl } from "../utils/apiUtils";

const defaults = {
  taraweehDuaDurationMins: 90,
  taraweehDuaImage: null,
  showRamadanBanner: true,
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
      const data = await fetchData(
        "/api/ramadan-setting?populate=taraweehDuaImage"
      );
      const doc = data?.data;
      if (doc?.id || doc?.documentId) {
        const img = doc.taraweehDuaImage;
        const imageUrl =
          img?.url ||
          img?.data?.attributes?.url ||
          img?.formats?.large?.url;
        settings.value = {
          taraweehDuaDurationMins:
            typeof doc.taraweehDuaDurationMins === "number"
              ? Math.max(1, doc.taraweehDuaDurationMins)
              : defaults.taraweehDuaDurationMins,
          taraweehDuaImage: imageUrl
            ? resolveStrapiMediaUrl(imageUrl)
            : defaults.taraweehDuaImage,
          showRamadanBanner:
            doc.showRamadanBanner !== undefined
              ? !!doc.showRamadanBanner
              : defaults.showRamadanBanner,
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

export function useRamadanSettings() {
  onMounted(() => fetchSettings());
  return { settings, loading, error, refetch: () => fetchSettings(true) };
}
