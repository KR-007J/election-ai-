import test from "node:test";
import assert from "node:assert/strict";
import { getQuizQuestions, getTimelineEvents, getVoterGuideSteps } from "./electionData";

test("timeline data contains multiple dated events", async () => {
  const events = await getTimelineEvents();
  assert.ok(events.length >= 5);
  assert.ok(events.every((event) => typeof event.title === "string" && event.title.length > 0));
});

test("voter guide steps are complete and ordered", async () => {
  const steps = await getVoterGuideSteps();
  assert.ok(steps.length >= 5);
  assert.equal(steps[0]?.id, 1);
  assert.ok(steps.every((step) => step.checklist.length > 0));
});

test("quiz questions expose options and explanations", async () => {
  const questions = await getQuizQuestions();
  assert.ok(questions.length >= 5);
  assert.ok(questions.every((question) => question.options.length === 4));
  assert.ok(questions.every((question) => typeof question.explanation === "string" && question.explanation.length > 0));
});
