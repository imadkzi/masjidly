import axios from "axios";

export function getStrapiBaseUrl() {
  return import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
}

export function getStrapiToken() {
  return import.meta.env.VITE_STRAPI_API_TOKEN || "";
}

export function buildStrapiUrl(path) {
  const base = getStrapiBaseUrl().replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

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

