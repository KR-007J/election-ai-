import { pgTable, serial, text, json } from "drizzle-orm/pg-core";

export const timelineEvents = pgTable("timeline_events", {
  id: serial("id").primaryKey(),
  phase: text("phase").notNull(),
  phaseLabel: text("phase_label").notNull(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  description: text("description").notNull(),
  details: json("details").$type<string[]>().notNull(),
  tags: json("tags").$type<string[]>().notNull(),
});

export const voterGuideSteps = pgTable("voter_guide_steps", {
  id: serial("id").primaryKey(),
  icon: text("icon").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  body: text("body").notNull(),
  checklist: json("checklist").$type<string[]>().notNull(),
  tip: text("tip").notNull(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  options: json("options").$type<string[]>().notNull(),
  correct: serial("correct").notNull(),
  explanation: text("explanation").notNull(),
});
