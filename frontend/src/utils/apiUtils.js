import axios from "axios";

/** Base Strapi URL (from env, with a sensible local default) */
export function getStrapiBaseUrl() {
  return import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
}

/** Default Strapi API token (if provided via env) */
export function getStrapiToken() {
  return import.meta.env.VITE_STRAPI_API_TOKEN || "";
}

/** Safely build a Strapi URL from a relative path */
export function buildStrapiUrl(path) {
  const base = getStrapiBaseUrl().replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

/**
 * Fetch data from the API.
 *
 * - If "urlOrPath" is absolute (http/https), it's used as-is.
 * - Otherwise, it's treated as a Strapi-relative path and passed through buildStrapiUrl.
 * - If "token" is omitted, we fall back to the default Strapi token from env.
 */
export async function fetchData(urlOrPath, token) {
  const isAbsolute = /^https?:\/\//i.test(urlOrPath);
  const url = isAbsolute ? urlOrPath : buildStrapiUrl(urlOrPath);
  const authToken = token ?? getStrapiToken();

  try {
    const response = await axios.get(url, {
      headers: {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching data:", err);
    throw err;
  }
}

