/* ================================================================
   clock.js
   Live clock — updates every second, 12-hour format.
   ================================================================ */

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
