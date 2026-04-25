const trimSlash = (value: string) => value.replace(/\/+$/, "");

export const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (envUrl) {
    return trimSlash(envUrl);
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname, port, origin } = window.location;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return trimSlash(`${protocol}//${hostname}:${port === "3001" ? port : "3001"}`);
    }

    return trimSlash(origin);
  }

  return "http://localhost:3001";
};

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
};
