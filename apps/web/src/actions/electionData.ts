const MOCK_TIMELINE = [
  {
    id: 1,
    phase: "pre",
    phaseLabel: "Pre-Campaign",
    title: "Candidate Filing & Exploratory Committees",
    date: "12-18 months before Election Day",
    description:
      "Potential candidates announce exploratory committees to gauge public support and raise initial funds. This is the first official step toward a presidential run.",
    details: [
      "File Form 1 with the FEC (Federal Election Commission) when raising or spending over $5,000",
      "Establish exploratory committees to test political viability",
      "Begin assembling campaign staff and advisors",
      "Develop initial policy platforms and messaging",
      "Conduct early polling and focus groups",
    ],
    tags: ["FEC Filing", "Exploratory Committee", "Campaign Finance"],
  },
  {
    id: 2,
    phase: "pre",
    phaseLabel: "Pre-Campaign",
    title: "Primary Season Begins",
    date: "6-9 months before Election Day",
    description:
      "States hold primary elections and caucuses to select party nominees. This period determines who will represent each party in the general election.",
    details: [
      "Iowa Caucuses traditionally kick off the primary season",
      "New Hampshire Primary follows shortly after",
      "Super Tuesday features multiple large states voting",
      "Candidates campaign extensively across early states",
      "Media coverage intensifies with debates and polls",
    ],
    tags: ["Primaries", "Caucuses", "Party Nomination"],
  },
  {
    id: 3,
    phase: "pre",
    phaseLabel: "Pre-Campaign",
    title: "National Party Conventions",
    date: "2-3 months before Election Day",
    description:
      "Political parties hold their national conventions to officially nominate candidates and adopt party platforms. These events showcase party unity and policy positions.",
    details: [
      "Republicans and Democrats hold separate conventions",
      "Candidates give acceptance speeches",
      "Party platforms are adopted and publicized",
      "Vice presidential candidates are announced",
      "High-profile speakers and entertainment featured",
    ],
    tags: ["Conventions", "Party Platform", "Nomination"],
  },
  {
    id: 4,
    phase: "primary",
    phaseLabel: "General Election",
    title: "Early Voting Begins",
    date: "4-6 weeks before Election Day",
    description:
      "Many states open early voting periods allowing citizens to cast ballots before Election Day. This accommodates busy schedules and ensures higher turnout.",
    details: [
      "Check your state's early voting dates and locations",
      "Some states offer no-excuse absentee voting",
      "Military and overseas voters can vote by mail",
      "Polling places may have extended hours",
      "Same-day registration available in some states",
    ],
    tags: ["Early Voting", "Absentee Ballots", "Voter Access"],
  },
  {
    id: 5,
    phase: "primary",
    phaseLabel: "General Election",
    title: "Presidential Debates",
    date: "1-2 months before Election Day",
    description:
      "Candidates participate in televised debates moderated by journalists. These events allow voters to compare positions on key issues.",
    details: [
      "Commission on Presidential Debates organizes main debates",
      "Vice presidential debate usually precedes presidential",
      "Format includes opening statements and moderated questions",
      "Town halls and other formats may be included",
      "Debates can influence voter opinions significantly",
    ],
    tags: ["Debates", "Media", "Public Discourse"],
  },
  {
    id: 6,
    phase: "primary",
    phaseLabel: "General Election",
    title: "Election Day",
    date: "First Tuesday after first Monday in November",
    description:
      "The culmination of the election process. Voters across the country cast their ballots for President, Congress, and local offices.",
    details: [
      "Polling places open at 6-7 AM depending on state",
      "Photo ID required in most states",
      "Assistance available for elderly and disabled voters",
      "Results begin coming in after polls close at 8-9 PM",
      "Some states may have different closing times",
    ],
    tags: ["Election Day", "Voting", "Ballots"],
  },
  {
    id: 7,
    phase: "general",
    phaseLabel: "Post-Election",
    title: "Vote Counting & Certification",
    date: "Election Night through following weeks",
    description:
      "Election officials count and verify ballots. Some races may take days or weeks to finalize, especially in close contests.",
    details: [
      "Mail-in ballots counted after Election Day",
      "Provisional ballots reviewed for eligibility",
      "Recounts may occur in close races",
      "States certify results by deadline",
      "Congressional certification follows state results",
    ],
    tags: ["Vote Counting", "Certification", "Recounts"],
  },
  {
    id: 8,
    phase: "general",
    phaseLabel: "Post-Election",
    title: "Electoral College Vote",
    date: "Mid-December",
    description:
      "Electors from each state cast their votes for President and Vice President. This formalizes the popular vote results.",
    details: [
      "Electors meet in their state capitols",
      "Faithless electors are rare but possible",
      "Electoral votes are counted in Congress",
      "Vice President announces the winner",
      "Results are usually ceremonial confirmation",
    ],
    tags: ["Electoral College", "Electors", "Congress"],
  },
  {
    id: 9,
    phase: "post",
    phaseLabel: "Transition",
    title: "Presidential Transition",
    date: "November - January",
    description:
      "The incoming administration prepares to take office. This period includes appointing cabinet members and developing initial policies.",
    details: [
      "President-elect selects cabinet nominees",
      "Congress holds confirmation hearings",
      "Transition team reviews government operations",
      "Security clearances processed for appointees",
      "Policies and priorities are outlined",
    ],
    tags: ["Transition", "Cabinet", "Appointments"],
  },
  {
    id: 10,
    phase: "post",
    phaseLabel: "Inauguration",
    title: "Inauguration Day",
    date: "January 20th following Election",
    description:
      "The new President and Vice President are sworn into office. This marks the official transfer of power.",
    details: [
      "Ceremony held at U.S. Capitol",
      "Chief Justice administers oath of office",
      "Inaugural address outlines presidential vision",
      "Parade and balls follow the ceremony",
      "New term officially begins",
    ],
    tags: ["Inauguration", "Oath", "Transfer of Power"],
  },
];

const MOCK_GUIDE = [
  {
    id: 1,
    icon: "how_to_reg",
    title: "Check Your Eligibility",
    subtitle: "Step 1 of 8",
    body: "Before you can vote, you must meet certain requirements. In the United States, federal law sets baseline eligibility criteria, but states may add additional requirements. This step is crucial to ensure you're legally able to participate.",
    checklist: [
      "You must be a U.S. citizen (natural born or naturalized)",
      "You must be at least 18 years old by Election Day",
      "You must be a resident of the state where you're registering",
      "You must not be currently serving a felony sentence (varies by state)",
      "You must not have been declared mentally incompetent by a court",
    ],
    tip: "<strong>Tip:</strong> If you're unsure about your eligibility, contact your local election office. They can help verify your status without judgment. Some states allow 17-year-olds to vote in primaries if they will be 18 by the general election.",
  },
  {
    id: 2,
    icon: "assignment_turned_in",
    title: "Register to Vote",
    subtitle: "Step 2 of 8",
    body: "Voter registration is how you officially become eligible to vote in elections. Most states require you to register before Election Day, though some allow same-day registration. This process ensures your vote will count.",
    checklist: [
      "Check your state's voter registration deadline (usually 15-30 days before Election Day)",
      "Gather required documents (ID, proof of residency)",
      "Complete the registration form online, by mail, or in person",
      "Verify your registration status after submitting",
      "Update your registration if you've moved recently",
    ],
    tip: "<strong>Tip:</strong> Register as soon as possible to avoid last-minute issues. Many states offer online registration which is quick and secure. If you're over 65 or have a disability, ask about assistance programs.",
  },
  {
    id: 3,
    icon: "mail",
    title: "Choose Your Voting Method",
    subtitle: "Step 3 of 8",
    body: "Modern elections offer multiple ways to cast your vote. Understanding these options helps you choose what works best for your situation, especially important for elderly voters who may prefer convenience.",
    checklist: [
      "Consider mail-in voting for convenience and safety",
      "Check if your state offers early in-person voting",
      "Learn about absentee voting requirements",
      "Understand same-day registration if available in your state",
      "Know the location and hours of your polling place",
    ],
    tip: "<strong>Tip:</strong> Mail-in voting is particularly helpful for seniors. Request your ballot early and return it promptly using certified mail. Many states now offer no-excuse absentee voting.",
  },
  {
    id: 4,
    icon: "search",
    title: "Research Candidates and Issues",
    subtitle: "Step 4 of 8",
    body: "Informed voting starts with understanding the candidates and key issues. Take time to learn about different perspectives on topics that matter to you, especially healthcare, Social Security, and economic policies.",
    checklist: [
      "Review candidate positions on issues important to seniors",
      "Check non-partisan voter guides and fact-checking sites",
      "Watch debates or read transcripts if possible",
      "Consider how policies affect Medicare, Social Security, and taxes",
      "Look for endorsements from trusted organizations",
    ],
    tip: "<strong>Tip:</strong> Use our candidate database to compare positions side-by-side. Focus on 2-3 issues most important to you rather than trying to learn everything. Take breaks to avoid information overload.",
  },
  {
    id: 5,
    icon: "event",
    title: "Plan Your Voting Day",
    subtitle: "Step 5 of 8",
    body: "Election Day planning ensures you can vote without stress. Consider transportation, timing, and what to bring. Many polling places offer accommodations for elderly voters.",
    checklist: [
      "Confirm your polling place location and hours",
      "Arrange transportation if needed (family, rideshare, senior services)",
      "Plan to arrive during off-peak hours to avoid lines",
      "Bring required ID and any assistive devices",
      "Wear comfortable clothing and shoes",
    ],
    tip: "<strong>Tip:</strong> Many communities offer free transportation for seniors on Election Day. Call your local Area Agency on Aging for assistance. Bring a family member or friend if you're concerned about the process.",
  },
  {
    id: 6,
    icon: "ballot",
    title: "Understand Your Ballot",
    subtitle: "Step 6 of 8",
    body: "Ballots can be complex with multiple races and propositions. Understanding the layout and voting instructions beforehand prevents confusion and ensures your votes are recorded correctly.",
    checklist: [
      "Review a sample ballot online before Election Day",
      "Learn how to mark your choices clearly",
      "Understand straight-ticket vs. individual candidate voting",
      "Know how to handle write-in candidates if desired",
      "Practice with a mock ballot if available",
    ],
    tip: "<strong>Tip:</strong> Most election websites offer sample ballots. If you're visually impaired, ask for assistance at the polling place. Take your time - there's no rush once you're in the voting booth.",
  },
  {
    id: 7,
    icon: "verified",
    title: "Vote Securely and Verify",
    subtitle: "Step 7 of 8",
    body: "Your vote is important and must be cast securely. Follow polling place procedures and verify your vote was recorded. This step gives you confidence that your voice was heard.",
    checklist: [
      "Follow poll worker instructions carefully",
      "Verify your identity as required",
      "Review your ballot before submitting",
      "Accept help if needed (curbside voting, assistance)",
      "Request a receipt if available in your state",
    ],
    tip: "<strong>Tip:</strong> If you make a mistake, ask for a new ballot. Poll workers are there to help, not judge. Curbside voting allows you to vote from your car if mobility is an issue.",
  },
  {
    id: 8,
    icon: "check_circle",
    title: "Follow Up and Stay Informed",
    subtitle: "Step 8 of 8",
    body: "After voting, confirm your ballot was counted and stay engaged in democracy. Following election results and understanding outcomes helps you participate in future elections.",
    checklist: [
      "Verify your vote was counted (online tracking where available)",
      "Watch election night coverage with trusted sources",
      "Understand runoff elections if applicable",
      "Stay informed about post-election processes",
      "Contact representatives about issues that matter to you",
    ],
    tip: "<strong>Tip:</strong> Many states allow you to track your absentee ballot online. Use fact-checked news sources for results. Remember, voting is just the start - staying engaged year-round makes a difference.",
  },
];

const MOCK_QUIZ = [
  {
    id: "1",
    question: "What is your top priority for healthcare?",
    options: [
      { id: "a", text: "Preserving and strengthening Medicare for all seniors", isCorrect: true },
      { id: "b", text: "Expanding access to affordable health insurance", isCorrect: false },
      { id: "c", text: "Reducing prescription drug costs", isCorrect: false },
      { id: "d", text: "Investing in medical research and innovation", isCorrect: false },
    ],
    explanation: "Medicare remains a cornerstone of senior health security.",
  },
  {
    id: "2",
    question: "How should Social Security be handled?",
    options: [
      { id: "a", text: "Protect benefits without cuts, expand for future generations", isCorrect: true },
      { id: "b", text: "Raise the retirement age to ensure solvency", isCorrect: false },
      { id: "c", text: "Means-test benefits for higher earners", isCorrect: false },
      { id: "d", text: "Privatize portions of the system", isCorrect: false },
    ],
    explanation: "Social Security solvency is a critical long-term policy challenge.",
  },
  {
    id: "3",
    question: "What is your view on climate change action?",
    options: [
      { id: "a", text: "Aggressive government investment in green energy", isCorrect: true },
      { id: "b", text: "Market-based solutions and incentives", isCorrect: false },
      { id: "c", text: "Balanced approach protecting jobs and environment", isCorrect: false },
      { id: "d", text: "Climate change is not a major priority", isCorrect: false },
    ],
    explanation: "Environmental policy impacts future resource availability.",
  },
  {
    id: "4",
    question: "How should we address the national debt?",
    options: [
      { id: "a", text: "Raise taxes on the wealthy and corporations", isCorrect: true },
      { id: "b", text: "Cut government spending on social programs", isCorrect: false },
      { id: "c", text: "Balanced approach of spending cuts and revenue increases", isCorrect: false },
      { id: "d", text: "Focus on economic growth to naturally reduce debt", isCorrect: false },
    ],
    explanation: "Fiscal responsibility requires balancing revenue and expenditure.",
  },
  {
    id: "5",
    question: "What is your stance on immigration policy?",
    options: [
      { id: "a", text: "Path to citizenship for undocumented immigrants", isCorrect: true },
      { id: "b", text: "Secure borders first, then address status", isCorrect: false },
      { id: "c", text: "Guest worker programs without citizenship", isCorrect: false },
      { id: "d", text: "Strict enforcement and deportation", isCorrect: false },
    ],
    explanation: "Immigration reform involves both security and humanitarian concerns.",
  },
  {
    id: "6",
    question: "How should education be improved?",
    options: [
      { id: "a", text: "Increase funding for public schools, reduce college debt", isCorrect: true },
      { id: "b", text: "School choice and charter school expansion", isCorrect: false },
      { id: "c", text: "Teacher pay increases and professional development", isCorrect: false },
      { id: "d", text: "Focus on vocational and technical training", isCorrect: false },
    ],
    explanation: "Education investment correlates with long-term economic stability.",
  },
  {
    id: "7",
    question: "What approach to criminal justice reform?",
    options: [
      { id: "a", text: "Decriminalize certain offenses, focus on rehabilitation", isCorrect: true },
      { id: "b", text: "Increase funding for police and prisons", isCorrect: false },
      { id: "c", text: "Address root causes like poverty and education", isCorrect: false },
      { id: "d", text: "Three strikes laws and mandatory minimums", isCorrect: false },
    ],
    explanation: "Justice reform balances public safety with systemic fairness.",
  },
  {
    id: "8",
    question: "How should gun violence be addressed?",
    options: [
      { id: "a", text: "Stricter background checks and assault weapon bans", isCorrect: true },
      { id: "b", text: "Mental health focus and red flag laws", isCorrect: false },
      { id: "c", text: "Arm teachers and increase school security", isCorrect: false },
      { id: "d", text: "Current laws are sufficient", isCorrect: false },
    ],
    explanation: "Public safety policy involves constitutional and security debates.",
  },
  {
    id: "9",
    question: "What is your economic policy preference?",
    options: [
      { id: "a", text: "Progressive taxation and wealth redistribution", isCorrect: true },
      { id: "b", text: "Supply-side economics and tax cuts", isCorrect: false },
      { id: "c", text: "Balanced budget and fiscal responsibility", isCorrect: false },
      { id: "d", text: "Universal basic income and automation transition", isCorrect: false },
    ],
    explanation: "Economic theories diverge on the role of government in markets.",
  },
  {
    id: "10",
    question: "How should foreign policy be conducted?",
    options: [
      { id: "a", text: "Multilateral cooperation and diplomacy first", isCorrect: true },
      { id: "b", text: "America First, renegotiate trade deals", isCorrect: false },
      { id: "c", text: "Strong military presence worldwide", isCorrect: false },
      { id: "d", text: "Isolationism and focus on domestic issues", isCorrect: false },
    ],
    explanation: "Global engagement affects trade, security, and alliances.",
  },
];

export async function getTimelineEvents() {
  return MOCK_TIMELINE;
}

export async function getVoterGuideSteps() {
  return MOCK_GUIDE;
}

export async function getQuizQuestions() {
  return MOCK_QUIZ;
}
