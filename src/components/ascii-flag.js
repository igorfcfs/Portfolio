import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { usePrefersReducedMotion } from '@hooks';

// Recreates the 21st.dev "ascii" effect (community/ascii, Brazil_Characters
// preset) with plain Canvas2D — no source photo was given for this recipe,
// so the Brazilian flag itself is drawn procedurally and used as the
// "source photo". Only the parts of that effect's pipeline that are
// actually active for this preset are implemented (renderMode:
// "characters", charSet: "binary", vignette/scanLines/chromatic/bloom/
// filmGrain/glitch pfx, "flicker" animation) — the other render modes,
// lights, mask and blur-type branches are all disabled in this preset and
// are intentionally left out rather than built and never exercised.

const WIDTH = 300;
const HEIGHT = 210; // 10:7 — official Brazilian flag proportions

const CELL_SIZE = 7;
const HOLE_COVERAGE = 0.88; // fraction of cells filled at any instant — the rest is holes that keep reshuffling
const GLYPH_TICK_MS = 130; // how often the holes/digits are re-rolled
const CONTRAST = 1.15;
const BRIGHTNESS = 0;
const EDGE_EMPHASIS = 0.4;
const TINT = [0, 255, 102]; // #00ff66
const TINT_OPACITY = 0.45;

const VIGNETTE = 0.38;
const SCANLINES = 0.28;
const CHROMATIC = 0.4;
const BLOOM = 0.6;
const GRAIN = 0.4;
const GLITCH = 0.2;

const StyledFlagWrapper = styled.div`
  margin: 20px auto 0;
  max-width: ${WIDTH}px;

  canvas {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
`;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
const luminance = (r, g, b) => (0.299 * r + 0.587 * g + 0.114 * b) / 255;

// Deterministic pseudo-random — gives a stable coverage/dither pattern
// instead of new static every frame.
const hash2 = (x, y) => {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
};

// Same idea with a third input (a tick counter) so the coverage/dither
// pattern reshuffles over time instead of staying fixed per cell.
const hash3 = (x, y, z) => {
  const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return s - Math.floor(s);
};

const overlayChannel = (base, blend) => {
  const b = base / 255;
  const t = blend / 255;
  const result = b < 0.5 ? 2 * b * t : 1 - 2 * (1 - b) * (1 - t);
  return result * 255;
};

function drawBrazilFlag(ctx, w, h) {
  ctx.fillStyle = '#009c3b';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#ffdf00';
  ctx.beginPath();
  ctx.moveTo(w * 0.5, h * 0.06);
  ctx.lineTo(w * 0.94, h * 0.5);
  ctx.lineTo(w * 0.5, h * 0.94);
  ctx.lineTo(w * 0.06, h * 0.5);
  ctx.closePath();
  ctx.fill();

  const cx = w * 0.5;
  const cy = h * 0.5;
  const r = Math.min(w, h) * 0.29;

  ctx.fillStyle = '#002776';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = r * 0.32;
  ctx.beginPath();
  ctx.moveTo(cx - r * 1.3, cy + r * 0.55);
  ctx.quadraticCurveTo(cx, cy - r * 0.35, cx + r * 1.3, cy - r * 0.65);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 22; i++) {
    const a = hash2(i, 7) * Math.PI * 2;
    const d = hash2(i, 11) * r * 0.92;
    const sx = cx + Math.cos(a) * d;
    const sy = cy + Math.sin(a) * d;
    const bandY = cy - r * 0.1 - ((sx - cx) / r) * r * 0.28;
    if (Math.abs(sy - bandY) < r * 0.22) continue;
    ctx.beginPath();
    ctx.arc(sx, sy, lerp(0.9, 2, hash2(i, 17)), 0, Math.PI * 2);
    ctx.fill();
  }
}

// Multiply-composites a pure primary color onto the source: multiplying by
// (255,0,0) zeroes the other channels while leaving red untouched, which is
// enough to isolate a single channel without per-pixel image-data work or
// canvas-filter SVG references (the latter silently no-ops on Safari).
function isolateChannel(source, w, h, rgb) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const cctx = c.getContext('2d');
  cctx.drawImage(source, 0, 0);
  cctx.globalCompositeOperation = 'multiply';
  cctx.fillStyle = `rgb(${rgb.join(',')})`;
  cctx.fillRect(0, 0, w, h);
  return c;
}

function snapshot(source, w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  c.getContext('2d').drawImage(source, 0, 0);
  return c;
}

// One-time analysis of the (procedurally drawn) flag: per-cell color,
// luminance, edge weight and font size are all static, so they're computed
// once here. Only *which* cells show a digit, and *which* digit, changes
// from tick to tick (see renderGlyphLayer) — that's what animates.
function buildCellData(pixelRatio, monoFont) {
  const w = Math.round(WIDTH * pixelRatio);
  const h = Math.round(HEIGHT * pixelRatio);
  const cell = CELL_SIZE * pixelRatio;

  const flagCanvas = document.createElement('canvas');
  flagCanvas.width = w;
  flagCanvas.height = h;
  const flagCtx = flagCanvas.getContext('2d');
  drawBrazilFlag(flagCtx, w, h);
  const { data } = flagCtx.getImageData(0, 0, w, h);

  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);

  const avg = (cx, cy) => {
    const x0 = Math.floor(cx * cell);
    const y0 = Math.floor(cy * cell);
    const x1 = Math.min(w, x0 + cell);
    const y1 = Math.min(h, y0 + cell);
    let r = 0;
    let g = 0;
    let b = 0;
    let n = 0;
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * w + x) * 4;
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        n++;
      }
    }
    return n === 0 ? [0, 0, 0] : [r / n, g / n, b / n];
  };

  const rawLums = [];
  for (let row = 0; row < rows; row++) {
    rawLums[row] = [];
    for (let col = 0; col < cols; col++) {
      const [r, g, b] = avg(col, row);
      rawLums[row][col] = luminance(r, g, b);
    }
  }

  const cells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const [r, g, b] = avg(col, row);
      const adjust = v => clamp((v - 128) * CONTRAST + 128 + BRIGHTNESS * 2.55, 0, 255);
      const contrasted = [adjust(r), adjust(g), adjust(b)];
      const overlaid = contrasted.map((v, i) => overlayChannel(v, TINT[i]));
      const final = contrasted.map((v, i) => lerp(v, overlaid[i], TINT_OPACITY));
      const lum = luminance(final[0], final[1], final[2]);

      const up = row > 0 ? rawLums[row - 1][col] : rawLums[row][col];
      const down = row < rows - 1 ? rawLums[row + 1][col] : rawLums[row][col];
      const left = col > 0 ? rawLums[row][col - 1] : rawLums[row][col];
      const right = col < cols - 1 ? rawLums[row][col + 1] : rawLums[row][col];
      const edgeWeight = clamp(
        ((Math.abs(rawLums[row][col] - up) +
          Math.abs(rawLums[row][col] - down) +
          Math.abs(rawLums[row][col] - left) +
          Math.abs(rawLums[row][col] - right)) /
          4) *
          2,
        0,
        1
      );

      const fontSize = clamp(cell * (0.45 + lum * 0.55) * (1 + edgeWeight * EDGE_EMPHASIS), cell * 0.3, cell * 1.4);

      cells.push({
        col,
        row,
        x: col * cell + cell / 2,
        y: row * cell + cell / 2,
        lum,
        fontSize,
        colorStr: `rgb(${final[0]}, ${final[1]}, ${final[2]})`,
      });
    }
  }

  return { cells, w, h, monoFont };
}

// Redraws the character grid for one tick: each cell independently rolls
// whether it's a hole or shows a digit, and which digit, seeded by the
// tick counter — so the pattern of holes and 0/1s keeps reshuffling.
function renderGlyphLayer(cellData, tick) {
  const { cells, w, h, monoFont } = cellData;

  const glyphCanvas = document.createElement('canvas');
  glyphCanvas.width = w;
  glyphCanvas.height = h;
  const gctx = glyphCanvas.getContext('2d');
  gctx.fillStyle = `rgba(0, 0, 0, 0.9)`; // bgMode: solid, bgOpacity: 90%
  gctx.fillRect(0, 0, w, h);
  gctx.textAlign = 'center';
  gctx.textBaseline = 'middle';

  for (const c of cells) {
    if (hash3(c.col * 1.7 + 0.3, c.row * 2.3 + 0.9, tick) >= HOLE_COVERAGE) continue;

    const threshold = 0.5 + (hash3(c.col * 3.1, c.row * 7.7, tick) - 0.5) * 0.5;
    const char = c.lum > threshold ? '1' : '0';

    gctx.font = `${c.fontSize}px ${monoFont}`;
    gctx.fillStyle = c.colorStr;
    gctx.fillText(char, c.x, c.y);
  }

  return glyphCanvas;
}

// Sequentially accumulates the pfx layers onto `work`, each reading the
// composite left by the previous one — mirrors the effect's own "layer
// post-effects in order" pipeline description.
function applyPostFx(glyphCanvas, w, h, pixelRatio) {
  const work = snapshot(glyphCanvas, w, h);
  const wctx = work.getContext('2d');

  // vignette
  const grad = wctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, w * 0.7);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.65, 'rgba(0,0,0,0)');
  grad.addColorStop(1, `rgba(0,0,0,${VIGNETTE})`);
  wctx.fillStyle = grad;
  wctx.fillRect(0, 0, w, h);

  // scanLines
  wctx.fillStyle = `rgba(0,0,0,${SCANLINES * 0.6})`;
  for (let y = 0; y < h; y += Math.max(2, Math.round(pixelRatio * 2))) {
    wctx.fillRect(0, y, w, 1);
  }

  // chromatic aberration
  {
    const src = snapshot(work, w, h);
    const offset = 1.5 * pixelRatio * CHROMATIC * 2.5;
    const redLayer = isolateChannel(src, w, h, [255, 0, 0]);
    const blueLayer = isolateChannel(src, w, h, [0, 0, 255]);
    wctx.save();
    wctx.globalCompositeOperation = 'screen';
    wctx.drawImage(redLayer, -offset, 0);
    wctx.drawImage(blueLayer, offset, 0);
    wctx.restore();
  }

  // bloom
  {
    const src = snapshot(work, w, h);
    wctx.save();
    wctx.filter = `blur(${3 * pixelRatio}px)`;
    wctx.globalCompositeOperation = 'screen';
    wctx.globalAlpha = BLOOM * 0.7;
    wctx.drawImage(src, 0, 0);
    wctx.restore();
  }

  return work;
}

// Small tileable noise texture, reused every frame for filmGrain (see the
// render loop) instead of regenerating per-pixel noise on every tick.
function buildGrainTile() {
  const tileSize = 48;
  const grainTile = document.createElement('canvas');
  grainTile.width = tileSize;
  grainTile.height = tileSize;
  const tctx = grainTile.getContext('2d');
  const tdata = tctx.createImageData(tileSize, tileSize);
  for (let i = 0; i < tdata.data.length; i += 4) {
    const v = Math.random() * 255;
    tdata.data[i] = v;
    tdata.data[i + 1] = v;
    tdata.data[i + 2] = v;
    tdata.data[i + 3] = 255;
  }
  tctx.putImageData(tdata, 0, 0);
  return grainTile;
}

const AsciiFlag = () => {
  const canvasRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const pixelRatio = clamp(window.devicePixelRatio || 1, 1, 2);
    const w = Math.round(WIDTH * pixelRatio);
    const h = Math.round(HEIGHT * pixelRatio);
    canvas.width = w;
    canvas.height = h;

    const monoFont =
      getComputedStyle(document.documentElement).getPropertyValue('--font-mono') || 'monospace';

    const cellData = buildCellData(pixelRatio, monoFont.trim() || 'monospace');
    const ctx = canvas.getContext('2d');
    const grainPattern = ctx.createPattern(buildGrainTile(), 'repeat');

    let base = applyPostFx(renderGlyphLayer(cellData, 0), w, h, pixelRatio);

    if (prefersReducedMotion) {
      ctx.drawImage(base, 0, 0);
      return undefined;
    }

    let rafId;
    let visible = true;
    let flicker = 1;
    let flickerTarget = 1;
    let lastFlickerChange = 0;
    let lastGlyphTick = 0;
    let tick = 0;
    let nextGlitchAt = performance.now() + 400 + Math.random() * 1200;

    const observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? true;
    });
    observer.observe(canvas);

    const render = now => {
      rafId = requestAnimationFrame(render);
      if (!visible) return;

      if (now - lastGlyphTick > GLYPH_TICK_MS) {
        tick += 1;
        base = applyPostFx(renderGlyphLayer(cellData, tick), w, h, pixelRatio);
        lastGlyphTick = now;
      }

      if (now - lastFlickerChange > 60) {
        flickerTarget = 1 - Math.random() * 0.36 - (Math.random() < 0.15 ? 0.25 : 0);
        lastFlickerChange = now;
      }
      flicker = lerp(flicker, flickerTarget, 0.35);

      ctx.clearRect(0, 0, w, h);
      ctx.filter = `brightness(${flicker})`;
      ctx.drawImage(base, 0, 0);
      ctx.filter = 'none';

      // filmGrain: drifting tile instead of static per-pixel noise
      ctx.save();
      ctx.globalAlpha = GRAIN * 0.5;
      ctx.globalCompositeOperation = 'overlay';
      ctx.translate((now * 0.02) % 48, (now * 0.013) % 48);
      ctx.fillStyle = grainPattern;
      ctx.fillRect(-48, -48, w + 96, h + 96);
      ctx.restore();

      // glitch: occasional torn horizontal band
      if (now > nextGlitchAt) {
        const bandH = (4 + Math.random() * 10) * pixelRatio;
        const bandY = Math.random() * (h - bandH);
        const offsetX = (Math.random() - 0.5) * 16 * pixelRatio * GLITCH * 2.5;
        ctx.drawImage(base, 0, bandY, w, bandH, offsetX, bandY, w, bandH);
        nextGlitchAt = now + 600 + Math.random() * 2000;
      }
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  return (
    <StyledFlagWrapper>
      <canvas ref={canvasRef} role="img" aria-label="Brazilian flag" />
    </StyledFlagWrapper>
  );
};

export default AsciiFlag;
