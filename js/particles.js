/* ================================================================
   particles.js
   Ambient particle system — creates and removes theme-specific
   particle layers on the desktop when a theme is applied.

   Call updateParticles(theme) whenever the active theme changes.
   Supported themes: 'nature', 'divine', 'cyberpunk'
   Any other value removes particles and does nothing.
   ================================================================ */

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
    'position:absolute;inset:0;z-index:20;pointer-events:none;overflow:hidden;';

  if (theme === 'divine') {
    const colors = [
      'rgba(255, 248, 210, 0.45)',
      'rgba(255, 240, 180, 0.38)',
      'rgba(248, 232, 195, 0.32)',
      'rgba(218, 190, 110, 0.28)',
      'rgba(255, 252, 230, 0.50)',
      'rgba(240, 220, 160, 0.25)',
      'rgba(255, 245, 200, 0.42)',
    ];

    // Helper: create a mote using wrapper(sway) + inner(rise) so transforms don't conflict
    function createMote(size, startX, startY, risePx, swayPx, duration, delay, swayDur, swayDelay, innerStyle) {
      const wrapper = document.createElement('span');
      wrapper.style.cssText = `
        position:absolute;
        left:${startX}%;
        top:${startY}%;
        width:${size}px;
        height:${size}px;
        --sway:${swayPx}px;
        animation:divine-mote-sway ${swayDur}s ease-in-out ${swayDelay}s infinite;
      `;
      const inner = document.createElement('span');
      inner.style.cssText = `
        display:block;
        width:${size}px;
        height:${size}px;
        border-radius:50%;
        --rise:${risePx}px;
        animation:divine-mote-rise ${duration}s ease-in-out ${delay}s infinite;
        ${innerStyle}
      `;
      wrapper.appendChild(inner);
      return wrapper;
    }

    // 36 tiny luminous motes
    for (let i = 0; i < 36; i++) {
      const size      = 2 + Math.random() * 3;
      const startX    = Math.random() * 100;
      const startY    = 10 + Math.random() * 90;
      const duration  = 20 + Math.random() * 25;
      const delay     = -(Math.random() * duration);
      const risePx    = 300 + Math.random() * 400;
      const swayPx    = 15 + Math.random() * 25;
      const swayDur   = 6 + Math.random() * 8;
      const swayDelay = Math.random() * swayDur;
      const color     = colors[Math.floor(Math.random() * colors.length)];

      const mote = createMote(size, startX, startY, risePx, swayPx, duration, delay, swayDur, swayDelay,
        `background:${color};box-shadow:0 0 ${size * 4}px ${color},0 0 ${size * 9}px rgba(255,245,190,0.18);`
      );
      particleContainer.appendChild(mote);
    }

    // 10 soft glowing orbs
    for (let i = 0; i < 10; i++) {
      const size      = 6 + Math.random() * 10;
      const startX    = 10 + Math.random() * 80;
      const startY    = 20 + Math.random() * 80;
      const duration  = 30 + Math.random() * 30;
      const delay     = -(Math.random() * duration);
      const risePx    = 200 + Math.random() * 300;
      const swayPx    = 20 + Math.random() * 35;
      const swayDur   = 9 + Math.random() * 12;
      const swayDelay = Math.random() * swayDur;

      const orb = createMote(size, startX, startY, risePx, swayPx, duration, delay, swayDur, swayDelay,
        `background:radial-gradient(circle,rgba(255,250,215,0.65) 0%,rgba(255,240,170,0.22) 50%,transparent 80%);filter:blur(${size * 0.65}px);`
      );
      particleContainer.appendChild(orb);
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
    // ── Dust / pollen spores — tiny dots drifting upward ──
    const sporeColors = [
      'rgba(140,160,100,0.40)',
      'rgba(120,140,80,0.35)',
      'rgba(160,150,110,0.32)',
      'rgba(130,150,90,0.38)',
      'rgba(150,140,100,0.30)',
      'rgba(110,130,70,0.36)',
      'rgba(170,160,120,0.28)',
    ];

    for (let i = 0; i < 48; i++) {
      const span = document.createElement('span');
      const size = 1.5 + Math.random() * 3;
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const duration = 16 + Math.random() * 18;
      const delay = -(Math.random() * duration);
      const drift = -60 + Math.random() * 120;
      const color = sporeColors[Math.floor(Math.random() * sporeColors.length)];

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

    // ── Drifting leaves — spread across the full vertical range so
    //    multiple are always visible at once ──
    const leafColors = [
      'rgba(72,100,58,0.55)',
      'rgba(88,118,62,0.50)',
      'rgba(55,82,44,0.60)',
      'rgba(100,130,70,0.45)',
      'rgba(68,95,52,0.52)',
    ];

    for (let i = 0; i < 9; i++) {
      const leaf = document.createElement('span');
      const w = 6 + Math.random() * 7;
      const h = w * (0.5 + Math.random() * 0.4);
      const startX = 10 + Math.random() * 80;
      // Spread start positions across full screen height so leaves are
      // always visible at various stages of their fall, not all queued at top
      const startY = -10 + (i / 9) * 90 + Math.random() * 10;
      const duration = 35 + Math.random() * 30;
      const delay = -(Math.random() * duration);
      const drift = -90 + Math.random() * 180;
      const color = leafColors[Math.floor(Math.random() * leafColors.length)];
      const rotate = Math.random() * 360;

      leaf.style.cssText = `
        position:absolute;
        left:${startX}%;
        top:${startY}%;
        width:${w}px;
        height:${h}px;
        border-radius:50% 0 50% 0;
        background:${color};
        transform:rotate(${rotate}deg);
        animation:nature-leaf-drift ${duration}s ease-in-out ${delay}s infinite;
        --drift:${drift}px;
      `;
      particleContainer.appendChild(leaf);
    }
  }

  desktop.appendChild(particleContainer);
}

/* ── Keyframes — injected once at startup ────────────────────── */

const sporeStyle = document.createElement('style');
sporeStyle.textContent = `
  @keyframes nature-spore-float {
    0%   { transform: translate(0, 0); opacity: 0; }
    6%   { opacity: 1; }
    94%  { opacity: 1; }
    100% { transform: translate(var(--drift), -130px); opacity: 0; }
  }
  /* Drifting leaf — tumbles gently as it falls and blows sideways */
  @keyframes nature-leaf-drift {
    0%   { transform: translate(0, 0)                    rotate(0deg);   opacity: 0;    }
    5%   {                                                               opacity: 0.75; }
    25%  { transform: translate(calc(var(--drift)*0.25), 20vh)  rotate(90deg);          }
    50%  { transform: translate(calc(var(--drift)*0.5),  55vh)  rotate(180deg); opacity: 0.65; }
    75%  { transform: translate(calc(var(--drift)*0.75), 80vh)  rotate(270deg);          }
    95%  {                                                               opacity: 0.40; }
    100% { transform: translate(var(--drift),            110vh) rotate(360deg); opacity: 0; }
  }
`;
document.head.appendChild(sporeStyle);

const divineStyle = document.createElement('style');
divineStyle.textContent = `
  /* Upward rise on inner element — translateY in px, fully visible */
  @keyframes divine-mote-rise {
    0%   { transform: translateY(0px);                         opacity: 0;    }
    8%   { opacity: 1;                                                         }
    50%  { transform: translateY(calc(var(--rise) * -0.5));   opacity: 0.95; }
    92%  { opacity: 0.7;                                                       }
    100% { transform: translateY(calc(var(--rise) * -1));     opacity: 0;    }
  }
  /* Left-right sway on wrapper element — no transform conflict */
  @keyframes divine-mote-sway {
    0%   { transform: translateX(0px);                         }
    25%  { transform: translateX(var(--sway));                 }
    75%  { transform: translateX(calc(var(--sway) * -1));      }
    100% { transform: translateX(0px);                         }
  }
`;
document.head.appendChild(divineStyle);

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
