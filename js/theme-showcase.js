/**
 * theme-showcase.js
 * Interactive switcher showcasing the 6 authentic in-game visual themes of Numpath Puzzle.
 */

const THEMES = {
  midnight: {
    name: 'Midnight',
    bg: '#0D1117',
    cellBg: '#161D2A',
    cellBorder: 'rgba(255,255,255,0.08)',
    pathColor: '#00E676',
    pathGlow: 'rgba(0, 230, 118, 0.6)',
    checkpointBg: '#F59E0B',
    checkpointText: '#090C12',
    label: 'Dark obsidian background with crisp neon mint pathing.'
  },
  paper: {
    name: 'Paper',
    bg: '#F5F2E9',
    cellBg: '#FFFFFF',
    cellBorder: 'rgba(0,0,0,0.1)',
    pathColor: '#1A1A1A',
    pathGlow: 'rgba(0, 0, 0, 0.25)',
    checkpointBg: '#DC2626',
    checkpointText: '#FFFFFF',
    label: 'Warm textured ivory sketchbook with bold ink lines.'
  },
  emerald: {
    name: 'Emerald',
    bg: '#081711',
    cellBg: '#0F261D',
    cellBorder: 'rgba(16,185,129,0.15)',
    pathColor: '#10B981',
    pathGlow: 'rgba(16, 185, 129, 0.6)',
    checkpointBg: '#34D399',
    checkpointText: '#042114',
    label: 'Calming botanical green with glowing jade circuits.'
  },
  neon: {
    name: 'Neon Pro',
    bg: '#120A24',
    cellBg: '#1D1238',
    cellBorder: 'rgba(255,0,128,0.2)',
    pathColor: '#00F0FF',
    pathGlow: 'rgba(0, 240, 255, 0.7)',
    checkpointBg: '#FF007F',
    checkpointText: '#FFFFFF',
    label: 'Vibrant cyberpunk violet with electric cyan currents.'
  },
  sunset: {
    name: 'Sunset Pro',
    bg: '#1D0E15',
    cellBg: '#2E1522',
    cellBorder: 'rgba(251,146,60,0.2)',
    pathColor: '#FB923C',
    pathGlow: 'rgba(251, 146, 60, 0.6)',
    checkpointBg: '#FBBF24',
    checkpointText: '#180B07',
    label: 'Warm twilight glow with dusk amber and peach tones.'
  },
  mono: {
    name: 'Mono',
    bg: '#050505',
    cellBg: '#121212',
    cellBorder: 'rgba(255,255,255,0.12)',
    pathColor: '#FFFFFF',
    pathGlow: 'rgba(255, 255, 255, 0.5)',
    checkpointBg: '#64748B',
    checkpointText: '#FFFFFF',
    label: 'Maximum contrast minimalist grayscale aesthetic.'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const displayCanvas = document.getElementById('theme-preview-canvas');
  const themeButtons = document.querySelectorAll('.theme-tab-btn');
  const themeDescription = document.getElementById('theme-preview-desc');
  const themeTitle = document.getElementById('theme-preview-title');

  if (!displayCanvas) return;

  function renderThemeBoard(themeKey) {
    const t = THEMES[themeKey] || THEMES.midnight;
    
    displayCanvas.style.backgroundColor = t.bg;
    displayCanvas.style.borderColor = t.pathColor;
    if (themeTitle) themeTitle.textContent = `${t.name} Theme`;
    if (themeDescription) themeDescription.textContent = t.label;

    // Build a 4x4 interactive mini-demo representation
    const gridSize = 4;
    const cellSize = 54;
    const gap = 10;
    const padding = 16;
    const totalSize = padding * 2 + gridSize * cellSize + (gridSize - 1) * gap;

    // Checkpoints on 4x4
    const checkpoints = {
      '0,0': 1,
      '3,0': 2,
      '3,3': 3,
      '0,3': 4
    };

    // Path connecting 1 -> 2 -> 3 -> 4
    const path = [
      [0,0], [1,0], [2,0], [3,0],
      [3,1], [2,1], [1,1], [0,1],
      [0,2], [1,2], [2,2], [3,2],
      [3,3], [2,3], [1,3], [0,3]
    ];

    const getCoord = (c, r) => ({
      x: padding + c * (cellSize + gap) + cellSize / 2,
      y: padding + r * (cellSize + gap) + cellSize / 2
    });

    let cellsHtml = '';
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const { x, y } = getCoord(c, r);
        const cp = checkpoints[`${c},${r}`];
        cellsHtml += `
          <rect x="${x - cellSize/2}" y="${y - cellSize/2}" width="${cellSize}" height="${cellSize}" rx="10" 
                fill="${t.cellBg}" stroke="${t.cellBorder}" stroke-width="1.5" />
        `;
        if (cp) {
          cellsHtml += `
            <circle cx="${x}" cy="${y}" r="16" fill="${t.checkpointBg}" />
            <text x="${x}" y="${y + 4}" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="10" fill="${t.checkpointText}">${cp}</text>
          `;
        }
      }
    }

    let pathD = '';
    path.forEach((pt, idx) => {
      const { x, y } = getCoord(pt[0], pt[1]);
      pathD += (idx === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
    });

    displayCanvas.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 14px;">
        <svg viewBox="0 0 ${totalSize} ${totalSize}" width="260" height="260">
          <g>${cellsHtml}</g>
          <path d="${pathD}" fill="none" stroke="${t.pathColor}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"
                style="filter: drop-shadow(0 0 10px ${t.pathGlow}); stroke-dasharray: 1200; stroke-dashoffset: 1200; animation: draw-path 5s ease-in-out infinite;" />
        </svg>
        <div style="display: flex; align-items: center; gap: 10px; margin-top: 6px;">
          <span style="font-family: 'Press Start 2P', monospace; font-size: 0.65rem; color: ${t.pathColor};">${t.name.toUpperCase()}</span>
          <span style="font-size: 0.8rem; color: #94A3B8;">• In-Game Theme</span>
        </div>
      </div>
    `;
  }

  // Bind clicks
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      themeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const themeKey = btn.getAttribute('data-theme');
      renderThemeBoard(themeKey);
    });
  });

  // Initial render
  renderThemeBoard('midnight');
});
