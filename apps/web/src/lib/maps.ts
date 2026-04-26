/**
 * Generates a Google Maps Embed URL for a given zip code.
 * @param apiKey The Google Maps API key.
 * @param zipCode The target zip code.
 * @returns The formatted search URL or null if key is missing.
 */
export function getMapsEmbedUrl(apiKey: string | undefined, zipCode: string): string | null {
  if (!apiKey || !zipCode.trim()) return null;
  return `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=polling+place+near+${encodeURIComponent(zipCode)}`;
}

/**
 * Generates an external Google Maps search URL.
 */
export function getExternalMapsUrl(zipCode: string): string {
  return `https://www.google.com/maps/search/polling+place+near+${encodeURIComponent(zipCode)}`;
}
