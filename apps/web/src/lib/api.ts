/**
 * Removes one or more trailing slashes from a string.
 * @param value The string to trim.
 * @returns The trimmed string.
 */
export const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

/**
 * Normalizes an API base URL by ensuring it's a valid HTTP/HTTPS URL 
 * and removing trailing slashes.
 * @param value The URL candidate to normalize.
 * @returns The normalized URL string or null if invalid.
 */
export const normalizeApiBaseUrl = (value?: string | null) => {
  const candidate = value?.trim();

  if (!candidate) {
    return null;
  }

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    return trimTrailingSlash(parsed.toString());
  } catch {
    return null;
  }
};

/**
 * Resolves the API base URL based on environment variables or window location.
 * Fallbacks to localhost:3001 if no other source is available.
 * @returns The resolved API base URL.
 */
export const getApiBaseUrl = () => {
  const envUrl = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);

  if (envUrl) {
    return envUrl;
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname, port, origin } = window.location;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return `${protocol}//${hostname}:${port === "3001" ? port : "3001"}`;
    }

    return trimTrailingSlash(origin);
  }

  return "http://localhost:3001";
};

/**
 * Constructs a full API URL given a relative path.
 * @param path The relative path (e.g., "/chat" or "status").
 * @returns The full API URL.
 */
export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
};
