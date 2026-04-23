// ===========================
// APP.JS — Core Application
// ===========================

// Cursor glow effect
document.addEventListener('mousemove', (e) => {
  const cursor = document.getElementById('cursor-glow');
  if (cursor) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  }
});

// Restore default cursor on interactive elements
document.addEventListener('mouseover', (e) => {
  const cursor = document.getElementById('cursor-glow');
  if (!cursor) return;
  if (e.target.matches('button, a, input, textarea, select, [role="button"]')) {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    cursor.style.opacity = '0.5';
  } else {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.opacity = '1';
  }
});

// ---- Navigation ----
function switchSection(name) {
  // Update sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`section-${name}`);
  if (target) target.classList.add('active');

  // Update nav tabs
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.section === name);
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => switchSection(tab.dataset.section));
});

// ---- Keyboard shortcuts ----
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
  const sections = ['home', 'timeline', 'guide', 'quiz', 'chat'];
  const keys = { '1': 'home', '2': 'timeline', '3': 'guide', '4': 'quiz', '5': 'chat' };
  if (keys[e.key]) switchSection(keys[e.key]);
});

// ---- Auto-resize textarea ----
document.addEventListener('input', (e) => {
  if (e.target.classList.contains('chat-input')) {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  }
});

// ---- Enter key in chat ----
document.addEventListener('keydown', (e) => {
  if (e.target.id === 'chat-input' && e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// ---- Initialize all modules ----
document.addEventListener('DOMContentLoaded', () => {
  buildTimeline();
  buildGuide();
  buildQuiz();
});
