// ===========================
// TIMELINE.JS
// ===========================

function buildTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  // Progress bar
  const progressHtml = `
    <div class="timeline-progress">
      <span class="timeline-progress-label">ELECTION CYCLE START</span>
      <div class="timeline-progress-bar">
        <div class="timeline-progress-fill" id="timeline-fill" style="width: 45%"></div>
      </div>
      <span class="timeline-progress-label">INAUGURATION DAY</span>
    </div>
  `;

  // Build track + items
  let itemsHtml = `<div style="position:relative">
    <div class="timeline-track"></div>`;

  ELECTION_TIMELINE.forEach((item, index) => {
    itemsHtml += `
      <div class="timeline-item" id="tl-item-${item.id}">
        <div class="timeline-marker">
          <div class="marker-dot" id="dot-${item.id}" onclick="toggleTimelineItem(${item.id})"></div>
          ${index < ELECTION_TIMELINE.length - 1 ? '<div class="marker-line"></div>' : ''}
        </div>
        <div class="timeline-card" id="tl-card-${item.id}" onclick="toggleTimelineItem(${item.id})">
          <div class="timeline-card-header">
            <span class="timeline-phase-badge phase-${item.phase}">${item.phaseLabel}</span>
            <span class="timeline-title">${item.title}</span>
            <span class="timeline-date">${item.date}</span>
            <span class="timeline-expand-icon">▼</span>
          </div>
          <div class="timeline-detail" id="tl-detail-${item.id}">
            <p>${item.description}</p>
            <ul class="timeline-checklist">
              ${item.details.map(d => `<li>${d}</li>`).join('')}
            </ul>
            <div class="timeline-tags">
              ${item.tags.map(t => `<span class="timeline-tag">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  });

  itemsHtml += '</div>';
  container.innerHTML = progressHtml + itemsHtml;
}

function toggleTimelineItem(id) {
  const card = document.getElementById(`tl-card-${id}`);
  const dot = document.getElementById(`dot-${id}`);
  const isActive = card.classList.contains('active');

  // Close all
  document.querySelectorAll('.timeline-card').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.marker-dot').forEach(d => d.classList.remove('active'));

  // Open this one if it wasn't active
  if (!isActive) {
    card.classList.add('active');
    dot.classList.add('active');
  }
}
