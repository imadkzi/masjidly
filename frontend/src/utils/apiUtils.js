import axios from "axios";

export function getStrapiBaseUrl() {
  return import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
}

function sanitizeToken(token) {
  return (token || "")
    .replace(/\uFEFF/g, "")
    .trim()
    .replace(/[\r\n]/g, "")
    .replace(/[^\x20-\x7E]/g, "");
}

export function getStrapiToken() {
  return sanitizeToken(import.meta.env.VITE_STRAPI_API_TOKEN);
}

export function buildStrapiUrl(path) {
  const base = getStrapiBaseUrl().replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

export function resolveStrapiMediaUrl(url) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return buildStrapiUrl(url);
}

export async function fetchData(urlOrPath, token) {
  const isAbsolute = /^https?:\/\//i.test(urlOrPath);
  const url = isAbsolute ? urlOrPath : buildStrapiUrl(urlOrPath);
  const authToken = sanitizeToken(token ?? getStrapiToken());

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
