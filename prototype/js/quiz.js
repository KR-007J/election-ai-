// ===========================
// QUIZ.JS
// ===========================

let quizState = {
  questions: [],
  current: 0,
  score: 0,
  answered: false,
};

function buildQuiz() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  container.innerHTML = `
    <div class="quiz-start">
      <div class="quiz-start-icon">🧠</div>
      <h3>CIVICS CHALLENGE</h3>
      <p>Test your knowledge of the U.S. election process with ${QUIZ_QUESTIONS.length} questions. How much do you know about democracy?</p>
      <button class="btn-primary" onclick="startQuiz()">Start Quiz →</button>
    </div>
  `;
}

function startQuiz() {
  // Shuffle questions
  quizState.questions = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
  quizState.current = 0;
  quizState.score = 0;
  quizState.answered = false;
  renderQuestion();
}

function renderQuestion() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  const q = quizState.questions[quizState.current];
  const total = quizState.questions.length;
  const progress = ((quizState.current) / total) * 100;
  const letters = ['A', 'B', 'C', 'D'];

  container.innerHTML = `
    <div class="quiz-progress-bar">
      <div class="quiz-progress-fill" style="width: ${progress}%"></div>
    </div>
    <div class="quiz-meta">
      <span>Question ${quizState.current + 1} of ${total}</span>
      <span class="quiz-score-display">Score: ${quizState.score}/${quizState.current}</span>
    </div>
    <div class="quiz-card">
      <div class="quiz-question-num">QUESTION ${quizState.current + 1}</div>
      <div class="quiz-question-text">${q.question}</div>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `
          <button
            class="quiz-option"
            id="quiz-opt-${i}"
            onclick="selectAnswer(${i})"
          >
            <span class="option-letter">${letters[i]}</span>
            <span class="option-text">${opt}</span>
          </button>
        `).join('')}
      </div>
      <div class="quiz-feedback" id="quiz-feedback"></div>
    </div>
  `;

  quizState.answered = false;
}

function selectAnswer(index) {
  if (quizState.answered) return;
  quizState.answered = true;

  const q = quizState.questions[quizState.current];
  const isCorrect = index === q.correct;
  if (isCorrect) quizState.score++;

  // Style options
  document.querySelectorAll('.quiz-option').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    else if (i === index && !isCorrect) btn.classList.add('wrong');
  });

  // Show feedback
  const feedback = document.getElementById('quiz-feedback');
  if (feedback) {
    feedback.className = `quiz-feedback show ${isCorrect ? 'correct-fb' : 'wrong-fb'}`;
    feedback.innerHTML = `
      <strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect.'}</strong> ${q.explanation}
    `;
  }

  // Show next button
  const card = document.querySelector('.quiz-card');
  if (card) {
    const isLast = quizState.current === quizState.questions.length - 1;
    const nextBtn = document.createElement('button');
    nextBtn.className = 'quiz-next-btn';
    nextBtn.textContent = isLast ? 'See Results →' : 'Next Question →';
    nextBtn.onclick = isLast ? showResults : nextQuestion;
    card.appendChild(nextBtn);
  }
}

function nextQuestion() {
  quizState.current++;
  renderQuestion();
}

function showResults() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  const total = quizState.questions.length;
  const score = quizState.score;
  const pct = Math.round((score / total) * 100);

  let grade, msg;
  if (pct >= 90) { grade = 'CIVIC SCHOLAR'; msg = 'Outstanding! You have an exceptional understanding of the U.S. election process. Your democracy thanks you!'; }
  else if (pct >= 70) { grade = 'INFORMED VOTER'; msg = 'Great job! You have a solid grasp of how elections work. Keep learning and stay engaged!'; }
  else if (pct >= 50) { grade = 'LEARNING CITIZEN'; msg = 'Good effort! You know the basics but there\'s more to explore. Check out our guide and timeline sections!'; }
  else { grade = 'CIVIC NEWCOMER'; msg = 'Elections can be complex! Explore our interactive timeline and step-by-step guide to strengthen your civic knowledge.'; }

  container.innerHTML = `
    <div class="quiz-results">
      <div class="results-score-ring">
        <span class="results-score-num">${score}</span>
        <span class="results-score-denom">/ ${total}</span>
      </div>
      <div class="results-title">${grade}</div>
      <p class="results-msg">${msg}</p>
      <p style="color: var(--text-mid); margin-bottom: 24px; font-size: 0.85rem; font-family: var(--font-mono);">
        ${pct}% CORRECT · ${score} RIGHT · ${total - score} MISSED
      </p>
      <div class="results-actions">
        <button class="btn-ghost" onclick="startQuiz()">Try Again</button>
        <button class="btn-primary" onclick="switchSection('chat')">Ask AI Assistant →</button>
      </div>
    </div>
  `;
}
