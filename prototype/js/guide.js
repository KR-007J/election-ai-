// ===========================
// GUIDE.JS
// ===========================

let currentGuideStep = 1;

function buildGuide() {
  buildGuideSidebar();
  renderGuideDetail(1);
}

function buildGuideSidebar() {
  const sidebar = document.getElementById('guide-sidebar');
  if (!sidebar) return;

  sidebar.innerHTML = VOTER_GUIDE_STEPS.map(step => `
    <button
      class="guide-step-btn ${step.id === 1 ? 'active' : ''}"
      id="guide-btn-${step.id}"
      onclick="selectGuideStep(${step.id})"
    >
      <span class="step-num">${step.id}</span>
      <span class="step-label">${step.title}</span>
    </button>
  `).join('');
}

function selectGuideStep(id) {
  currentGuideStep = id;

  // Update sidebar buttons
  document.querySelectorAll('.guide-step-btn').forEach(btn => {
    btn.classList.toggle('active', btn.id === `guide-btn-${id}`);
  });

  // Render detail
  renderGuideDetail(id);
}

function renderGuideDetail(id) {
  const detail = document.getElementById('guide-detail');
  if (!detail) return;

  const step = VOTER_GUIDE_STEPS.find(s => s.id === id);
  if (!step) return;

  const isFirst = id === 1;
  const isLast = id === VOTER_GUIDE_STEPS.length;

  detail.innerHTML = `
    <div class="guide-detail-header">
      <span class="guide-step-icon">${step.icon}</span>
      <div>
        <div class="guide-detail-title">${step.title}</div>
        <div class="guide-detail-sub">${step.subtitle}</div>
      </div>
    </div>
    <p class="guide-detail-body">${step.body}</p>
    <ul class="guide-checklist">
      ${step.checklist.map(item => `
        <li>
          <span class="check-icon">✓</span>
          <span>${item}</span>
        </li>
      `).join('')}
    </ul>
    <div class="guide-tip">${step.tip}</div>
    <div class="guide-nav-btns">
      <button
        class="btn-ghost"
        onclick="selectGuideStep(${id - 1})"
        ${isFirst ? 'disabled style="opacity:0.3;pointer-events:none"' : ''}
      >← Previous</button>
      <button
        class="btn-primary"
        onclick="${isLast ? "switchSection('quiz')" : `selectGuideStep(${id + 1})`}"
      >
        ${isLast ? '🧠 Take the Quiz →' : 'Next Step →'}
      </button>
    </div>
  `;

  // Animate
  detail.style.animation = 'none';
  detail.offsetHeight; // reflow
  detail.style.animation = 'fadeUp 0.3s ease forwards';
}
