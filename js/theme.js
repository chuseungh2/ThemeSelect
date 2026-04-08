/* ================================================================
   theme.js
   Theme switching logic — hover previews, click-to-apply,
   active tab state, dialog chrome updates.

   Depends on: sounds.js (sound objects), particles.js (updateParticles)
   ================================================================ */

const desktop   = document.getElementById('desktop');
const themeTabs = document.querySelectorAll('.theme-tab');

const THEME_CLASSES = ['theme-default', 'theme-nature', 'theme-divine', 'theme-cyberpunk'];
const PREVIEW_CLASSES = ['preview-active', 'preview-nature', 'preview-divine', 'preview-cyberpunk'];
const APPLY_STAGE_CLASSES = [
  'is-applying',
  'apply-start',
  'apply-stage-bg',
  'apply-stage-frame',
  'apply-stage-widgets',
  'apply-stage-particles',
  'apply-stage-ambient',
];

const APPLY_TIMELINE_MS = {
  bg: 0,
  frame: 180,
  widgets: 360,
  particles: 560,
  ambient: 760,
  done: 1080,
};

// Tracks the permanently applied theme. null = theme-default.
let appliedTheme = null;
let applyTimers = [];

/**
 * Applies exactly one theme class to the desktop.
 * Pass null to return to theme-default.
 */
function setTheme(name) {
  desktop.classList.remove(...THEME_CLASSES);
  desktop.classList.add(`theme-${name ?? 'default'}`);
}

function clearApplyTimers() {
  applyTimers.forEach(timer => clearTimeout(timer));
  applyTimers = [];
}

function clearPreviewState() {
  desktop.classList.remove(...PREVIEW_CLASSES);
}

function setPreviewState(name) {
  clearPreviewState();
  if (!name) return;
  desktop.classList.add('preview-active', `preview-${name}`);
}

function clearApplyStageState() {
  desktop.classList.remove(...APPLY_STAGE_CLASSES);
}

function runApplySequence(theme) {
  clearApplyTimers();
  clearPreviewState();
  clearApplyStageState();
  desktop.classList.add('is-applying', 'apply-start', 'apply-stage-bg');
  updateParticles(null);

  // Stage 1 — background/base layer
  setTheme(theme);
  updateDialogChrome(theme);

  // Brief commit pulse/sweep at sequence start.
  applyTimers.push(setTimeout(() => {
    desktop.classList.remove('apply-start');
  }, 320));

  // Stage 2 — layout/frame
  applyTimers.push(setTimeout(() => {
    desktop.classList.add('apply-stage-frame');
  }, APPLY_TIMELINE_MS.frame));

  // Stage 3 — widgets/components
  applyTimers.push(setTimeout(() => {
    desktop.classList.add('apply-stage-widgets');
  }, APPLY_TIMELINE_MS.widgets));

  // Stage 4 — particles/effects
  applyTimers.push(setTimeout(() => {
    desktop.classList.add('apply-stage-particles');
    updateParticles(theme);
  }, APPLY_TIMELINE_MS.particles));

  // Stage 5 — ambient motion
  applyTimers.push(setTimeout(() => {
    desktop.classList.add('apply-stage-ambient');
  }, APPLY_TIMELINE_MS.ambient));

  // Sequence complete
  applyTimers.push(setTimeout(() => {
    clearApplyStageState();
  }, APPLY_TIMELINE_MS.done));
}

/* ── Dialog title chrome ───────────────────────────────────────
   Currently resets to the original title on every call.
   To add per-theme titles, switch on the `theme` argument here.
   ─────────────────────────────────────────────────────────────── */
const dialogTitleEl = document.querySelector('.dialog-title-text');
const originalTitle = dialogTitleEl.textContent;

function updateDialogChrome() {
  dialogTitleEl.textContent = originalTitle;
}

/* ── Hover Preview ─────────────────────────────────────────────── */
themeTabs.forEach(tab => {
  const theme = tab.dataset.theme;

  tab.addEventListener('mouseenter', () => {
    if (desktop.classList.contains('is-applying')) return;
    // Hover is preview-only: no theme class apply, no particles.
    setPreviewState(theme);
    if (theme === 'cyberpunk') {
      cyberHoverSound.currentTime = 0;
      cyberHoverSound.play().catch(() => {});
      setTimeout(() => { cyberHoverSound.pause(); cyberHoverSound.currentTime = 0; }, 2000);
    } else if (theme === 'divine') {
      divineHoverSound.currentTime = 0;
      divineHoverSound.play().catch(() => {});
      setTimeout(() => { divineHoverSound.pause(); divineHoverSound.currentTime = 0; }, 2000);
    } else if (theme === 'nature') {
      natureHoverSound.currentTime = 0;
      natureHoverSound.play().catch(() => {});
      setTimeout(() => { natureHoverSound.pause(); natureHoverSound.currentTime = 0; }, 2000);
    }
  });

  tab.addEventListener('mouseleave', () => {
    if (desktop.classList.contains('is-applying')) return;
    clearPreviewState();
  });
});

/* ── Click Apply ───────────────────────────────────────────────── */
themeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    appliedTheme = tab.dataset.theme;
    runApplySequence(appliedTheme);

    if (appliedTheme === 'cyberpunk') {
      cyberClickSound.currentTime = 0;
      cyberClickSound.play();
    } else if (appliedTheme === 'divine') {
      divineClickSound.currentTime = 0;
      divineClickSound.play();
    } else if (appliedTheme === 'nature') {
      natureClickSound.currentTime = 0;
      natureClickSound.play();
    }

    // Toggle active class for selected tab styling
    themeTabs.forEach(t => t.classList.remove('theme-tab--active'));
    tab.classList.add('theme-tab--active');
  });
});
