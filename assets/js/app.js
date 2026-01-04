/**
 * APP CONTROLLER 5.2 - FINAL UX
 * 
 * [ES] Controlador principal de la interfaz. Gestiona eventos del DOM,
 * persistencia del chat y animaciones UI.
 * 
 * [EN] Main interface controller. Manages DOM events,
 * chat persistence and UI animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initUI();
  initChat();
});

// [ES] Inicialización de elementos visuales (Navbar, Scroll)
function initUI() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger) hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));

  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (nav) window.scrollY > 50 ? nav.classList.add('scrolled') : nav.classList.remove('scrolled');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
  }, { threshold: 0.1 });

  document.querySelectorAll('.hero-content, .card, .section h2').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// [ES] Lógica del Chat
function initChat() {
  const toggleBtn = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const closeBtn = document.getElementById('chat-close');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-mensajes');
  const clearBtn = document.getElementById('chat-borrar');
  const chips = document.querySelectorAll('.chat-chip');

  // [ES] Persistencia: Cargar estado
  const savedState = JSON.parse(sessionStorage.getItem('zerox_chat_state') || '{}');
  if (savedState.isOpen) chatWindow.classList.add('open');
  if (savedState.history) {
    messages.innerHTML = savedState.history;
    setTimeout(() => messages.scrollTop = messages.scrollHeight, 100);
  }

  if (!toggleBtn || !chatWindow) return;

  // [ES] NO mostramos estado "Loading" amarillo (Solicitud Usuario)
  // El motor carga silenciosamente.

  // UI Events
  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    saveState();
    if (chatWindow.classList.contains('open')) setTimeout(() => input.focus(), 100);
  });
  closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('open');
    saveState();
  });

  form.addEventListener('submit', (e) => { e.preventDefault(); submitMessage(); });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitMessage(); } });
  chips.forEach(c => c.addEventListener('click', () => { input.value = c.dataset.prompt; input.focus(); submitMessage(); }));

  clearBtn.addEventListener('click', () => {
    messages.innerHTML = `<div class="chat-msg bot">Chat reset.</div>`;
    saveState();
  });

  function saveState() {
    sessionStorage.setItem('zerox_chat_state', JSON.stringify({
      isOpen: chatWindow.classList.contains('open'),
      history: messages.innerHTML
    }));
  }

  async function submitMessage() {
    const text = input.value.trim();
    if (!text) return;

    renderMessage(text, 'user');
    input.value = '';
    saveState();

    const botBubble = createBotBubble();
    showTyping(true);

    // [ES] Procesar mensaje
    const response = await window.botEngine.process(text, (streamText) => {
      showTyping(false);
      botBubble.innerHTML = parseMD(streamText);
      messages.scrollTop = messages.scrollHeight;
    });

    if (response && response.text && botBubble.innerText === "") {
      showTyping(false);
      botBubble.innerHTML = parseMD(response.text);
      messages.scrollTop = messages.scrollHeight;
      saveState();
    }
  }

  function createBotBubble() {
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    messages.appendChild(div);
    return div;
  }

  function renderMessage(text, type) {
    const div = document.createElement('div');
    div.className = `chat-msg ${type}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping(show) {
    const existing = document.getElementById('typing-indicator');
    if (existing) existing.remove();
    if (show) {
      const t = document.createElement('div');
      t.id = 'typing-indicator';
      t.className = 'chat-msg bot';
      // [ES] Animación mejorada (Dots blancos saltando)
      t.style.cssText = "display:flex; gap:4px; padding:16px; align-items:center; min-height:24px;";
      t.innerHTML = `
                <style>
                    @keyframes dotBounce { 0%, 100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-4px); opacity: 1; background: #fff; } }
                    .dot-anim { width: 6px; height: 6px; background: #aaa; border-radius: 50%; animation: dotBounce 1.4s infinite ease-in-out both; }
                </style>
                <div class="dot-anim" style="animation-delay: -0.32s;"></div>
                <div class="dot-anim" style="animation-delay: -0.16s;"></div>
                <div class="dot-anim"></div>
            `;
      messages.appendChild(t);
      messages.scrollTop = messages.scrollHeight;
    }
  }

  function parseMD(md) {
    if (!md) return "";
    return md
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1); padding:2px 4px; border-radius:3px;">$1</code>')
      .replace(/- \[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color:var(--accent-primary);">📄 $1</a><br>')
      .replace(/\n/g, '<br>');
  }
}
