import { pgTable, serial, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  fullName: text('full_name'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const quizResults = pgTable('quiz_results', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  score: integer('score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  category: text('category').default('general'),
  completedAt: timestamp('completed_at').defaultNow(),
});

export const voterChecklists = pgTable('voter_checklists', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  stepId: integer('step_id').notNull(),
  isCompleted: boolean('is_completed').default(false),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const chatSessions = pgTable('chat_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  history: jsonb('history').notNull().default([]),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const voters = pgTable('voters', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  status: text('status').default('registered'),
  sentiment: text('sentiment').default('neutral'),
  location: text('location'),
  lastActive: timestamp('last_active').defaultNow(),
});
