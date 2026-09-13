/**
 * board-preview.js
 * Generates and animates a high-fidelity SVG path puzzle representation.
 * No gameplay required - pure visual showcase of Numpath Puzzle logic.
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('hero-board-svg');
  if (!container) return;

  // 5x5 Grid representation (Cell coordinates from 0 to 4)
  // Grid size: 300x300 viewBox, each cell is 52x52 with 8px gap
  // Cell centers: offset = 26 + col * 60, row * 60
  const gridSize = 5;
  const cellSize = 50;
  const gap = 8;
  const padding = 10;

  // A complete Hamiltonian/continuous path through 5x5 board hitting checkpoints in order
  // Checkpoint 1: (0,0)
  // Checkpoint 2: (4,0)
  // Checkpoint 3: (4,4)
  // Checkpoint 4: (0,4)
  // Checkpoint 5: (2,2) - Final center cell filling 100% board
  // Continuous 25-cell path visiting all cells:
  const pathCoords = [
    // Start at (0,0) [Checkpoint 1]
    [0,0], [1,0], [2,0], [3,0], [4,0], // [Checkpoint 2 at 4,0]
    [4,1], [3,1], [2,1], [1,1], [0,1],
    [0,2], [1,2],
    [0,3], [1,3], [2,3], [3,3], [4,3],
    [4,2], [3,2],
    [4,4], // [Checkpoint 3 at 4,4]
    [3,4], [2,4], [1,4], [0,4], // [Checkpoint 4 at 0,4]
    [2,2] // [Checkpoint 5 at 2,2 - 100% Filled!]
  ];

  // Checkpoints mapping: index in path -> checkpoint number
  const checkpoints = {
    "0,0": 1,
    "4,0": 2,
    "4,4": 3,
    "0,4": 4,
    "2,2": 5
  };

  const getCoord = (c, r) => {
    const x = padding + c * (cellSize + gap) + cellSize / 2;
    const y = padding + r * (cellSize + gap) + cellSize / 2;
    return { x, y };
  };

  // Build SVG string
  const totalWidth = padding * 2 + gridSize * cellSize + (gridSize - 1) * gap;
  const totalHeight = totalWidth;

  let cellsHtml = '';
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const { x, y } = getCoord(c, r);
      const isCheckpoint = checkpoints[`${c},${r}`];
      
      cellsHtml += `
        <rect x="${x - cellSize/2}" y="${y - cellSize/2}" 
              width="${cellSize}" height="${cellSize}" 
              rx="10" ry="10" 
              class="board-cell-bg" 
              fill="#121824" stroke="rgba(255,255,255,0.07)" stroke-width="1.5" />
      `;

      if (isCheckpoint) {
        cellsHtml += `
          <g class="checkpoint-node" style="transform-origin: ${x}px ${y}px;">
            <circle cx="${x}" cy="${y}" r="17" fill="#F59E0B" filter="drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))" />
            <text x="${x}" y="${y + 4}" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="11" font-weight="bold" fill="#090C12">${isCheckpoint}</text>
          </g>
        `;
      }
    }
  }

  // Build continuous polyline points
  let pathD = '';
  pathCoords.forEach((pt, idx) => {
    const { x, y } = getCoord(pt[0], pt[1]);
    if (idx === 0) {
      pathD += `M ${x} ${y}`;
    } else {
      pathD += ` L ${x} ${y}`;
    }
  });

  const svgContent = `
    <svg viewBox="0 0 ${totalWidth} ${totalHeight}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <!-- Board Cells -->
      <g class="board-cells">
        ${cellsHtml}
      </g>

      <!-- Glowing Animated Line -->
      <path d="${pathD}" class="neon-path-line" filter="url(#neon-glow)" />

      <!-- Pulse ripple at start node -->
      <circle cx="${getCoord(0,0).x}" cy="${getCoord(0,0).y}" r="22" fill="none" stroke="#00E676" stroke-width="2" opacity="0.6">
        <animate attributeName="r" values="16;28;16" dur="2.5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2.5s" repeatCount="indefinite"/>
      </circle>
    </svg>
  `;

  container.innerHTML = svgContent;
});
