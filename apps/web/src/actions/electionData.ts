"use server";

import { db } from "@/db";
import { timelineEvents, voterGuideSteps, quizQuestions } from "@/db/schema";
import { eq } from "drizzle-orm";

const MOCK_TIMELINE = [
  {
    id: 1,
    phase: 'pre',
    phaseLabel: 'Pre-Campaign',
    title: 'Candidate Filing & Exploratory Committees',
    date: '12–18 months before Election Day',
    description: 'Potential candidates announce exploratory committees to gauge public support and raise initial funds. This is the first official step toward a presidential run.',
    details: [
      'File Form 1 with the FEC (Federal Election Commission) when raising or spending over $5,000',
      'Establish exploratory committees to test political viability',
      'Begin assembling campaign staff and advisors',
      'Develop initial policy platforms and messaging',
      'Conduct early polling and focus groups',
    ],
    tags: ['FEC Filing', 'Exploratory Committee', 'Campaign Finance'],
  },
  // Full data would be populated in DB
];

const MOCK_GUIDE = [
  {
    id: 1,
    icon: '📝',
    title: 'Check Your Eligibility',
    subtitle: 'Step 1 of 8',
    body: 'Before you can vote, you must meet certain requirements. In the United States, federal law sets baseline eligibility criteria, but states may add additional requirements.',
    checklist: [
      'You must be a U.S. citizen (natural born or naturalized)',
      'You must be at least 18 years old by Election Day',
      'You must be a resident of the state where you\'re registering',
    ],
    tip: '💡 <strong>Tip:</strong> Some states allow 17-year-olds to vote in primaries if they will be 18 by the general election.',
  }
];

const MOCK_QUIZ = [
  {
    id: 1,
    question: 'How many electoral votes are needed to win the presidency?',
    options: [
      { id: 'a', text: '218', isCorrect: false },
      { id: 'b', text: '250', isCorrect: false },
      { id: 'c', text: '270', isCorrect: true },
      { id: 'd', text: '538', isCorrect: false },
    ],
    explanation: 'There are 538 total electoral votes. A candidate must win a simple majority, which is 270.',
  }
];

export async function getTimelineEvents() {
  try {
    if (!process.env.DATABASE_URL) return MOCK_TIMELINE;
    const events = await db.select().from(timelineEvents);
    return events.length > 0 ? events : MOCK_TIMELINE;
  } catch (error) {
    return MOCK_TIMELINE;
  }
}

export async function getVoterGuideSteps() {
  try {
    if (!process.env.DATABASE_URL) return MOCK_GUIDE;
    const steps = await db.select().from(voterGuideSteps);
    return steps.length > 0 ? steps : MOCK_GUIDE;
  } catch (error) {
    return MOCK_GUIDE;
  }
}

export async function getQuizQuestions() {
  try {
    if (!process.env.DATABASE_URL) return MOCK_QUIZ;
    const questions = await db.select().from(quizQuestions);
    return questions.length > 0 ? questions : MOCK_QUIZ;
  } catch (error) {
    return MOCK_QUIZ;
  }
}
