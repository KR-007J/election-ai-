// ===========================
// CHAT.JS — AI Assistant
// Powered by Anthropic Claude API
// ===========================

const ELECTION_SYSTEM_PROMPT = `You are ElectIQ, an expert, non-partisan AI assistant specializing in election education and civic information. Your role is to help users understand:

1. How elections work (federal, state, and local)
2. Voter registration and eligibility requirements
3. The election process from candidate filing to inauguration
4. Voting methods (in-person, mail-in, early voting)
5. The Electoral College and how it works
6. Election laws and voting rights
7. How votes are counted and certified
8. The history of voting rights in America
9. Different types of elections (primaries, generals, runoffs, referendums)
10. Civic participation beyond voting

Guidelines:
- Be factual, clear, and educational
- Remain strictly NON-PARTISAN — do not favor any political party or candidate
- When topics vary by state, mention that and provide general guidance
- Use plain language accessible to all reading levels
- Keep answers concise but complete
- If asked about current candidates or political debates, focus on the process, not opinions
- Direct users to official sources like vote.gov, usa.gov, and state election websites when appropriate
- Format responses with clear structure when explaining multi-step processes

You are helpful, patient, and enthusiastic about civic education.`;

let chatHistory = [];
let isLoading = false;

function sendSuggestion(element) {
  const text = element.textContent || element.innerText;
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = text;
    sendMessage();
  }
}

async function sendMessage() {
  if (isLoading) return;

  const input = document.getElementById('chat-input');
  const text = input?.value?.trim();
  if (!text) return;

  // Clear input
  input.value = '';
  input.style.height = 'auto';

  // Add user message to UI
  appendMessage('user', text);

  // Hide suggestions after first message
  const suggestions = document.getElementById('chat-suggestions');
  if (suggestions) suggestions.style.display = 'none';

  // Add to history
  chatHistory.push({ role: 'user', content: text });

  // Show loading
  const loadingId = appendLoadingMessage();
  isLoading = true;
  toggleSendButton(false);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: ELECTION_SYSTEM_PROMPT,
        messages: chatHistory,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Sorry, I couldn\'t generate a response.';

    // Add to history
    chatHistory.push({ role: 'assistant', content: reply });

    // Remove loading and show response
    removeLoadingMessage(loadingId);
    appendMessage('assistant', reply);

  } catch (error) {
    removeLoadingMessage(loadingId);
    console.error('Chat error:', error);
    appendMessage('assistant',
      `I encountered an error connecting to the AI service. This usually means an API key is needed.\n\n` +
      `To use the AI chat feature:\n` +
      `1. Get an API key from console.anthropic.com\n` +
      `2. In chat.js, add your key to the Authorization header: \`'x-api-key': 'YOUR_KEY'\`\n\n` +
      `In the meantime, explore our interactive Timeline, Step-by-Step Guide, and Civics Quiz!`
    );
  } finally {
    isLoading = false;
    toggleSendButton(true);
  }
}

function appendMessage(role, content) {
  const messages = document.getElementById('chat-messages');
  if (!messages) return;

  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = role === 'user' ? 'ME' : '⬡';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = formatMessageContent(content);

  div.appendChild(avatar);
  div.appendChild(bubble);
  messages.appendChild(div);

  // Scroll to bottom
  messages.scrollTop = messages.scrollHeight;
}

function formatMessageContent(text) {
  // Convert markdown-ish formatting to HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(0,212,255,0.1);padding:1px 5px;border-radius:3px;font-family:var(--font-mono);font-size:0.85em">$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n- /g, '</p><ul><li>')
    .replace(/\n(\d+)\. /g, '</p><ol><li>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

function appendLoadingMessage() {
  const messages = document.getElementById('chat-messages');
  if (!messages) return null;

  const id = 'loading-' + Date.now();
  const div = document.createElement('div');
  div.className = 'chat-msg assistant';
  div.id = id;

  div.innerHTML = `
    <div class="msg-avatar">⬡</div>
    <div class="msg-bubble loading">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return id;
}

function removeLoadingMessage(id) {
  if (id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
}

function toggleSendButton(enabled) {
  const btn = document.getElementById('chat-send');
  if (btn) btn.disabled = !enabled;
}
