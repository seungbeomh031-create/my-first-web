/* ===================================================================
   홍승범 개인 웹사이트 - Interactive Scripts
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initGuestbook();
  initTiltEffect();
});

/* --------------------------------------------------
   1. Dark / Light Theme Toggle
   -------------------------------------------------- */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const icon = themeToggle ? themeToggle.querySelector('i') : null;
  const currentTheme = localStorage.getItem('sb_theme') || 'dark';

  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (icon) icon.className = 'fa-solid fa-sun';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('sb_theme', 'dark');
        if (icon) icon.className = 'fa-solid fa-moon';
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('sb_theme', 'light');
        if (icon) icon.className = 'fa-solid fa-sun';
      }
    });
  }
}

/* --------------------------------------------------
   2. Interactive Guestbook / Cheer Messages
   -------------------------------------------------- */
const DEFAULT_CHEERS = [
  {
    id: 1,
    name: "축구 동아리 주장",
    emoji: "⚽",
    message: "승범아! 그라운드에서 보여주는 체력과 패기 그대로 영상 편집계도 접수하자! 항상 응원한다!",
    time: "2026.09.28"
  },
  {
    id: 2,
    name: "여행 메이트 민우",
    emoji: "✈️",
    message: "지난번 여행 때 승범이가 찍어준 앵글 진짜 영화 같았음. 멋진 영상 에디터 될 거라 확신해!",
    time: "2026.09.29"
  },
  {
    id: 3,
    name: "영상 동아리 선배",
    emoji: "🎬",
    message: "스포츠 특유의 속도감을 영상 템포로 살리는 감각이 남달라요. 멋진 포트폴리오 기대할게요!",
    time: "2026.09.30"
  }
];

function initGuestbook() {
  const cheerForm = document.getElementById('cheerForm');
  const cheerList = document.getElementById('cheerList');
  const cheerCount = document.getElementById('cheerCount');

  // Load cheers from localStorage or defaults
  let cheers = JSON.parse(localStorage.getItem('sb_cheers'));
  if (!cheers || !Array.isArray(cheers) || cheers.length === 0) {
    cheers = DEFAULT_CHEERS;
    localStorage.setItem('sb_cheers', JSON.stringify(cheers));
  }

  function renderCheers() {
    if (!cheerList) return;
    cheerList.innerHTML = '';
    cheerCount.textContent = cheers.length;

    cheers.slice().reverse().forEach(item => {
      const card = document.createElement('div');
      card.className = 'cheer-card';
      card.innerHTML = `
        <div class="cheer-emoji-box">${escapeHtml(item.emoji)}</div>
        <div class="cheer-content">
          <div class="cheer-meta">
            <span class="cheer-author">${escapeHtml(item.name)}</span>
            <span class="cheer-time">${escapeHtml(item.time)}</span>
          </div>
          <p class="cheer-text">${escapeHtml(item.message)}</p>
        </div>
      `;
      cheerList.appendChild(card);
    });
  }

  if (cheerForm) {
    cheerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('userName');
      const emojiInput = document.getElementById('userEmoji');
      const messageInput = document.getElementById('userMessage');

      const name = nameInput.value.trim();
      const emoji = emojiInput.value;
      const message = messageInput.value.trim();

      if (!name || !message) return;

      const now = new Date();
      const formattedDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;

      const newCheer = {
        id: Date.now(),
        name,
        emoji,
        message,
        time: formattedDate
      };

      cheers.push(newCheer);
      localStorage.setItem('sb_cheers', JSON.stringify(cheers));

      // Reset form
      nameInput.value = '';
      messageInput.value = '';

      // Re-render
      renderCheers();

      // Mini alert or feedback
      showToast("응원 메시지가 등록되었습니다! 감사합니다! 🔥");
    });
  }

  renderCheers();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message) {
  const existingToast = document.querySelector('.sb-toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = 'sb-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: #6366f1;
    color: #fff;
    padding: 0.9rem 1.8rem;
    border-radius: 9999px;
    font-size: 0.95rem;
    font-weight: 600;
    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
    z-index: 1000;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

/* --------------------------------------------------
   3. 3D Tilt Effect on Profile Card
   -------------------------------------------------- */
function initTiltEffect() {
  const card = document.querySelector('.profile-glass-card');
  if (!card || window.innerWidth < 768) return;

  const wrapper = document.querySelector('.profile-card-wrapper');

  wrapper.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
}
