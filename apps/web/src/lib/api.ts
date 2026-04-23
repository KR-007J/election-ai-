const trimSlash = (value: string) => value.replace(/\/+$/, "");

export const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (envUrl) {
    return trimSlash(envUrl);
  }

  if (typeof window !== "undefined") {
    return trimSlash(window.location.origin);
  }

  return "http://localhost:3001";
};

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
};
