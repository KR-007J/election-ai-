import test from "node:test";
import assert from "node:assert/strict";
import { calculateAdjustedAlignment, getAdjustedCandidates, type Candidate } from "./voterLogic";

const MOCK_CANDIDATES: Candidate[] = [
  { name: "Alpha", office: "Gov", party: "Ind", alignment: 50, platform: "", avatar: "A", focus: "progressive" },
  { name: "Beta", office: "Gov", party: "Ind", alignment: 80, platform: "", avatar: "B", focus: "conservative" },
];

test("calculateAdjustedAlignment boosts matching focus", () => {
  const candidate = MOCK_CANDIDATES[0];
  const result = calculateAdjustedAlignment(candidate, "progressive");
  assert.equal(result, 65); // 50 + 15
});

test("calculateAdjustedAlignment penalizes mismatch outside moderate range", () => {
  const candidate = MOCK_CANDIDATES[1]; // alignment 80
  const result = calculateAdjustedAlignment(candidate, "progressive");
  assert.equal(result, 70); // 80 - 10
});

test("getAdjustedCandidates returns sorted list", () => {
  const resultsRaw = JSON.stringify({ profile: { primaryValue: "progressive" } });
  const adjusted = getAdjustedCandidates(MOCK_CANDIDATES, resultsRaw);
  
  assert.equal(adjusted[0].name, "Beta"); // 80 -> 70
  assert.equal(adjusted[1].name, "Alpha"); // 50 -> 65
  // Wait, Beta (70) > Alpha (65), so Alpha is still 2nd. Correct.
});

test("getAdjustedCandidates handles invalid JSON", () => {
  const adjusted = getAdjustedCandidates(MOCK_CANDIDATES, "invalid-json");
  assert.equal(adjusted.length, 2);
  assert.equal(adjusted[0].name, "Beta"); // Sorted by base alignment
});
