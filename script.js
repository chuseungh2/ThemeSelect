/* ================================================================
   SYSTEM IDENTITY — script.js
   ================================================================ */

/* ──────────────────────────────────────────────────────────────
   CLOCK — Live, 12-hour format
   ────────────────────────────────────────────────────────────── */
const clockTime = document.getElementById('clockTime');
const clockDate = document.getElementById('clockDate');

function updateClock() {
  const now = new Date();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  clockTime.textContent = `${hours}:${minutes} ${ampm}`;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];

  clockDate.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

setInterval(updateClock, 1000);
updateClock();

/* ──────────────────────────────────────────────────────────────
   THEME SYSTEM
   ────────────────────────────────────────────────────────────── */
const desktop   = document.getElementById('desktop');
const themeTabs = document.querySelectorAll('.theme-tab');

const THEME_CLASSES = ['theme-default', 'theme-nature', 'theme-divine', 'theme-cyberpunk'];

// Tracks the permanently applied theme. null = theme-default.
let appliedTheme = null;

/**
 * Applies exactly one theme class to the desktop.
 * Pass null to return to theme-default.
 */
function setTheme(name) {
  desktop.classList.remove(...THEME_CLASSES);
  desktop.classList.add(`theme-${name ?? 'default'}`);
}

/* ── Hover Preview ─────────────────────────────────────────── */
themeTabs.forEach(tab => {
  const theme = tab.dataset.theme;

  tab.addEventListener('mouseenter', () => {
    setTheme(theme);
    if (theme === 'cyberpunk') {
      cyberHoverSound.currentTime = 0;
      cyberHoverSound.play();
      setTimeout(() => { cyberHoverSound.pause(); cyberHoverSound.currentTime = 0; }, 2000);
    } else if (theme === 'divine') {
      divineHoverSound.currentTime = 0;
      divineHoverSound.play();
      setTimeout(() => { divineHoverSound.pause(); divineHoverSound.currentTime = 0; }, 2000);
    } else if (theme === 'nature') {
      natureHoverSound.currentTime = 0;
      natureHoverSound.play();
      setTimeout(() => { natureHoverSound.pause(); natureHoverSound.currentTime = 0; }, 2000);
    }
  });

  tab.addEventListener('mouseleave', () => {
    setTheme(appliedTheme);
  });
});

/* ── Sound Effects ─────────────────────────────────────────── */
const cyberClickSound = new Audio('assets/cyber-click.mp3');
const cyberHoverSound = new Audio('assets/cyber-hover.mp3');
const cyberAmbientSound = new Audio('assets/cyber-new-sound.mp3');

const divineClickSound = new Audio('assets/divine-click.mp3');
const divineHoverSound = new Audio('assets/divine-hover.mp3');
const divineAmbientSound = new Audio('assets/divine-sound.mp3');

const natureClickSound = new Audio('assets/nature-click.mp3');
const natureHoverSound = new Audio('assets/nature-hover.mp3');
const natureAmbientSound = new Audio('assets/nature-sound.mp3');

/* ── Click Apply ───────────────────────────────────────────── */
themeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    appliedTheme = tab.dataset.theme;
    setTheme(appliedTheme);
    updateParticles(appliedTheme);

    // Stop all ambient sounds first
    cyberAmbientSound.pause();
    cyberAmbientSound.currentTime = 0;
    cyberAmbientSound.onended = null;
    divineAmbientSound.pause();
    divineAmbientSound.currentTime = 0;
    divineAmbientSound.onended = null;
    natureAmbientSound.pause();
    natureAmbientSound.currentTime = 0;
    natureAmbientSound.onended = null;

    if (appliedTheme === 'cyberpunk') {
      cyberClickSound.currentTime = 0;
      cyberClickSound.play();
      setTimeout(() => {
        cyberClickSound.pause();
        cyberClickSound.currentTime = 0;
        cyberAmbientSound.currentTime = 0;
        cyberAmbientSound.play();
      }, 1000);
    } else if (appliedTheme === 'divine') {
      divineClickSound.currentTime = 0;
      divineClickSound.play();
      setTimeout(() => {
        divineClickSound.pause();
        divineClickSound.currentTime = 0;
        divineAmbientSound.currentTime = 0;
        divineAmbientSound.play();
        setTimeout(() => {
          divineAmbientSound.pause();
          divineAmbientSound.currentTime = 0;
        }, 3000);
      }, 1000);
    } else if (appliedTheme === 'nature') {
      natureClickSound.currentTime = 0;
      natureClickSound.play();
      setTimeout(() => {
        natureClickSound.pause();
        natureClickSound.currentTime = 0;
        natureAmbientSound.currentTime = 0;
        natureAmbientSound.play();
      }, 1000);
    }

    // Toggle active class for selected tab styling
    themeTabs.forEach(t => t.classList.remove('theme-tab--active'));
    tab.classList.add('theme-tab--active');
  });
});

/* ──────────────────────────────────────────────────────────────
   SPORE PARTICLES — Nature theme ambient layer
   Creates floating spore dots that drift upward when the
   nature theme is active. Removed for all other themes.
   ────────────────────────────────────────────────────────────── */
let particleContainer = null;

function updateParticles(theme) {
  // Remove existing particles
  if (particleContainer) {
    particleContainer.remove();
    particleContainer = null;
  }

  // Only create for nature, divine, or cyberpunk theme
  if (theme !== 'nature' && theme !== 'divine' && theme !== 'cyberpunk') return;

  particleContainer = document.createElement('div');
  const classMap = { nature: 'nature-particles', divine: 'divine-particles', cyberpunk: 'cyberpunk-particles' };
  particleContainer.className = classMap[theme] || 'nature-particles';
  particleContainer.style.cssText =
    'position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden;';

  if (theme === 'divine') {
    const colors = [
      'rgba(255, 240, 180, 0.35)',
      'rgba(218, 190, 110, 0.30)',
      'rgba(255, 248, 220, 0.28)',
      'rgba(201, 168, 76, 0.25)',
      'rgba(255, 235, 160, 0.32)',
      'rgba(240, 220, 150, 0.22)',
    ];

    for (let i = 0; i < 18; i++) {
      const span = document.createElement('span');
      const size = 2 + Math.random() * 4;
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const duration = 18 + Math.random() * 14;
      const delay = Math.random() * duration;
      const drift = -30 + Math.random() * 60;
      const color = colors[Math.floor(Math.random() * colors.length)];

      span.style.cssText = `
        position:absolute;
        left:${startX}%;
        top:${startY}%;
        width:${size}px;
        height:${size}px;
        border-radius:50%;
        background:${color};
        box-shadow: 0 0 ${size * 2}px ${color};
        animation:divine-mote-float ${duration}s linear ${delay}s infinite;
        --drift:${drift}px;
      `;
      particleContainer.appendChild(span);
    }
  } else if (theme === 'cyberpunk') {
    const colors = [
      'rgba(0,255,255,0.80)',
      'rgba(0,200,255,0.70)',
      'rgba(255,0,102,0.70)',
      'rgba(130,0,255,0.65)',
      'rgba(0,255,180,0.60)',
      'rgba(255,80,180,0.55)',
    ];

    for (let i = 0; i < 24; i++) {
      const span = document.createElement('span');
      const isRect = Math.random() > 0.45;
      const h = 1 + Math.random() * 3;
      const w = isRect ? h * (1.5 + Math.random() * 2.5) : h;
      const startX = Math.random() * 100;
      const startY = 15 + Math.random() * 75;
      const duration = 6 + Math.random() * 10;
      const delay = Math.random() * duration;
      const driftX = -100 + Math.random() * 200;
      const color = colors[Math.floor(Math.random() * colors.length)];

      span.style.cssText = `
        position:absolute;
        left:${startX}%;
        top:${startY}%;
        width:${w}px;
        height:${h}px;
        background:${color};
        box-shadow:0 0 ${h * 4}px ${color},0 0 ${h * 2}px ${color};
        animation:cyberpunk-bit-float ${duration}s linear ${delay}s infinite;
        --drift:${driftX}px;
      `;
      particleContainer.appendChild(span);
    }
  } else {
    const colors = [
      'rgba(140,160,100,0.30)',
      'rgba(120,140,80,0.25)',
      'rgba(160,150,110,0.22)',
      'rgba(130,150,90,0.28)',
      'rgba(150,140,100,0.20)',
      'rgba(110,130,70,0.26)',
    ];

    for (let i = 0; i < 14; i++) {
      const span = document.createElement('span');
      const size = 2 + Math.random() * 3;
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const duration = 16 + Math.random() * 12;
      const delay = Math.random() * duration;
      const drift = -40 + Math.random() * 80;
      const color = colors[Math.floor(Math.random() * colors.length)];

      span.style.cssText = `
        position:absolute;
        left:${startX}%;
        top:${startY}%;
        width:${size}px;
        height:${size}px;
        border-radius:50%;
        background:${color};
        animation:nature-spore-float ${duration}s linear ${delay}s infinite;
        --drift:${drift}px;
      `;
      particleContainer.appendChild(span);
    }
  }

  desktop.appendChild(particleContainer);
}

/* Inject the particle keyframes once */
const sporeStyle = document.createElement('style');
sporeStyle.textContent = `
  @keyframes nature-spore-float {
    0%   { transform: translate(0, 0); opacity: 0; }
    6%   { opacity: 1; }
    94%  { opacity: 1; }
    100% { transform: translate(var(--drift), -130px); opacity: 0; }
  }
`;
document.head.appendChild(sporeStyle);

/* Inject divine particle keyframes once */
const divineStyle = document.createElement('style');
divineStyle.textContent = `
  @keyframes divine-mote-float {
    0%   { transform: translate(0, 0) scale(0.6); opacity: 0; }
    8%   { opacity: 0.8; }
    50%  { transform: translate(calc(var(--drift) * 0.5), -60px) scale(1); opacity: 1; }
    92%  { opacity: 0.6; }
    100% { transform: translate(var(--drift), -120px) scale(0.4); opacity: 0; }
  }
`;
document.head.appendChild(divineStyle);

/* Inject cyberpunk particle keyframes once */
const cyberpunkStyle = document.createElement('style');
cyberpunkStyle.textContent = `
  @keyframes cyberpunk-bit-float {
    0%   { transform: translate(0, 0);                        opacity: 0; }
    5%   { opacity: 1; }
    50%  { transform: translate(calc(var(--drift) * 0.5), -50px); opacity: 0.9; }
    95%  { opacity: 0.8; }
    100% { transform: translate(var(--drift), -110px);        opacity: 0; }
  }
`;
document.head.appendChild(cyberpunkStyle);
