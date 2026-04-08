/* ================================================================
   sounds.js
   Audio objects for theme click and hover sounds.
   Exports: cyberClickSound, cyberHoverSound,
            divineClickSound, divineHoverSound,
            natureClickSound, natureHoverSound

   Browsers block audio until the first user interaction.
   The unlock listener here plays+immediately pauses all sounds
   on the first click so hover sounds work right after.
   ================================================================ */

const cyberClickSound = new Audio('assets/cyber-click.mp3');
const cyberHoverSound = new Audio('assets/cyber-hover.mp3');

const divineClickSound = new Audio('assets/divine-click.mp3');
const divineHoverSound = new Audio('assets/divine-hover.mp3');

const natureClickSound = new Audio('assets/nature-click.mp3');
const natureHoverSound = new Audio('assets/nature-hover.mp3');

const allSounds = [
  cyberClickSound, cyberHoverSound,
  divineClickSound, divineHoverSound,
  natureClickSound, natureHoverSound,
];

// Unlock all sounds on first click so hover sounds work immediately after
document.addEventListener('click', () => {
  allSounds.forEach(s => {
    s.play().then(() => { s.pause(); s.currentTime = 0; }).catch(() => {});
  });
}, { once: true });
