export interface Candidate {
  name: string;
  office: string;
  party: string;
  alignment: number;
  platform: string;
  avatar: string;
  focus: string;
}

/**
 * Calculates the adjusted alignment for a candidate based on the user's primary value profile.
 * @param candidate The candidate to adjust.
 * @param profile The user's primary value profile (e.g., "progressive", "conservative").
 * @returns The adjusted alignment score (0-100).
 */
export function calculateAdjustedAlignment(candidate: Candidate, profile: string): number {
  let alignment = candidate.alignment;
  
  if (profile.toLowerCase() === candidate.focus.toLowerCase()) {
    // Boost alignment for matching focus
    alignment = Math.min(100, alignment + 15);
  } else if (Math.abs(alignment - 50) > 20) {
    // Slight penalty for significant mismatch (outside the moderate 30-70 range)
    alignment = Math.max(0, alignment - 10);
  }
  
  return alignment;
}

/**
 * Processes a list of candidates and adjusts their alignment based on user results.
 * @param baseCandidates The list of candidates with base alignments.
 * @param quizResultsRaw The raw JSON string from localStorage.
 * @returns The sorted list of adjusted candidates.
 */
export function getAdjustedCandidates(baseCandidates: Candidate[], quizResultsRaw: string | null): Candidate[] {
  if (!quizResultsRaw) {
    return [...baseCandidates].sort((a, b) => b.alignment - a.alignment);
  }

  try {
    const parsed = JSON.parse(quizResultsRaw);
    const profile = parsed.profile?.primaryValue?.toLowerCase() || "";

    const adjusted = baseCandidates.map(candidate => ({
      ...candidate,
      alignment: calculateAdjustedAlignment(candidate, profile)
    }));

    return adjusted.sort((a, b) => b.alignment - a.alignment);
  } catch {
    return [...baseCandidates].sort((a, b) => b.alignment - a.alignment);
  }
}
