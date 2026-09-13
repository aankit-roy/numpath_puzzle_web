/**
 * daily-card.js
 * Handles live today's date, real-time countdown to midnight, and deep link resolver.
 */

document.addEventListener('DOMContentLoaded', () => {
  const dateElement = document.getElementById('daily-live-date');
  const hoursElement = document.getElementById('cd-hours');
  const minutesElement = document.getElementById('cd-minutes');
  const secondsElement = document.getElementById('cd-seconds');
  const deepLinkBtn = document.getElementById('daily-deep-link');

  // Format today's date
  const now = new Date();
  const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
  if (dateElement) {
    dateElement.textContent = now.toLocaleDateString('en-US', options).toUpperCase();
  }

  // Countdown timer to midnight
  function updateCountdown() {
    const current = new Date();
    const midnight = new Date(current);
    midnight.setHours(24, 0, 0, 0);

    const diffMs = midnight - current;
    if (diffMs <= 0) {
      if (hoursElement) hoursElement.textContent = '00';
      if (minutesElement) minutesElement.textContent = '00';
      if (secondsElement) secondsElement.textContent = '00';
      return;
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
    if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
    if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Deep Link button handling
  if (deepLinkBtn) {
    deepLinkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.aankit.NumpathPuzzle.numpath_puzzle';
      const deepLinkUrl = `numpath://daily?date=${dateStr}`;

      // Check if user is on mobile
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        // Attempt deep link, fallback to Play Store after 1.5s
        window.location.href = deepLinkUrl;
        setTimeout(() => {
          window.location.href = playStoreUrl;
        }, 1500);
      } else {
        // Desktop user - open Play Store directly in new tab
        window.open(playStoreUrl, '_blank', 'noopener,noreferrer');
      }
    });
  }
});
