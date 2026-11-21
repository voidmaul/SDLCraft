function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawHexagon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  align: CanvasTextAlign
) {
  ctx.textAlign = align;
  const words = text.split(" ");
  let line = "";
  let curY = y;
  for (const word of words) {
    const test = line + (line ? " " : "") + word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, curY);
      line = word;
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, curY);
}

// ─── Instagram Story Badge Generator (HTML5 Canvas 2D, 1080×1920) ─────────
export function generateStoryBadge(
  userName: string,
  score: number,
  badgeTitle: string,
  correctCount: number,
  totalCount: number
): void {
  const W = 1080;
  const H = 1920;
  const YELLOW = "#FFC908";
  const DARK = "#0B0F19";
  const DARK2 = "#1E293B";
  const WHITE = "#FFFFFF";
  const SLATE = "#94A3B8";
  const FRAME = 40;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // ── Background ────────────────────────────────────────────────────────
  ctx.fillStyle = DARK;
  ctx.fillRect(0, 0, W, H);

  // Dot grid
  ctx.fillStyle = "rgba(255,255,255,0.045)";
  const STEP = 48;
  for (let x = STEP; x < W; x += STEP) {
    for (let y = STEP; y < H; y += STEP) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Outer frame
  ctx.strokeStyle = YELLOW;
  ctx.lineWidth = 4;
  ctx.strokeRect(FRAME, FRAME, W - FRAME * 2, H - FRAME * 2);

  // Inner frame accent line (thinner, inset)
  ctx.strokeStyle = "rgba(255,201,8,0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(FRAME + 12, FRAME + 12, W - (FRAME + 12) * 2, H - (FRAME + 12) * 2);

  // ── Header ────────────────────────────────────────────────────────────
  // Brand bar pill
  ctx.fillStyle = YELLOW;
  const barW = 560;
  const barH = 52;
  const barX = (W - barW) / 2;
  const barY = 160;
  roundRect(ctx, barX, barY, barW, barH, 14);
  ctx.fill();

  ctx.fillStyle = DARK;
  ctx.font = "bold 22px 'Arial', sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "3px";
  ctx.fillText("SDLCRAFT · INTERACTIVE LEARNING", W / 2, barY + 34);

  ctx.fillStyle = SLATE;
  ctx.font = "500 20px 'Arial', sans-serif";
  ctx.letterSpacing = "5px";
  ctx.fillText("OFFICIAL BADGE OF COMPETENCY", W / 2, barY + 90);

  // Thin divider under header
  ctx.fillStyle = "rgba(255,201,8,0.3)";
  ctx.fillRect(FRAME + 60, barY + 108, W - (FRAME + 60) * 2, 1);

  // ── Emblem (hexagon-style medal) ──────────────────────────────────────
  const cx = W / 2;
  const cy = 620;
  const outerR = 200;
  const innerR = 160;

  // Outer glow ring
  ctx.shadowColor = YELLOW;
  ctx.shadowBlur = 48;
  drawHexagon(ctx, cx, cy, outerR + 16);
  ctx.fillStyle = "rgba(255,201,8,0.12)";
  ctx.fill();
  ctx.shadowBlur = 0;

  // Hexagon outer ring (yellow stroke)
  drawHexagon(ctx, cx, cy, outerR);
  ctx.fillStyle = DARK2;
  ctx.fill();
  ctx.strokeStyle = YELLOW;
  ctx.lineWidth = 8;
  ctx.stroke();

  // Hexagon inner fill
  drawHexagon(ctx, cx, cy, innerR);
  ctx.fillStyle = "#111827";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,201,8,0.4)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Score number
  ctx.fillStyle = YELLOW;
  ctx.font = "900 108px 'Arial Black', 'Arial', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${score}%`, cx, cy + 36);

  // "SCORE" label inside hex
  ctx.fillStyle = WHITE;
  ctx.font = "bold 28px 'Arial', sans-serif";
  ctx.letterSpacing = "6px";
  ctx.fillText("SCORE", cx, cy + 76);

  // correct / total below hex
  ctx.letterSpacing = "0px";
  ctx.fillStyle = SLATE;
  ctx.font = "500 26px 'Arial', sans-serif";
  ctx.fillText(`${correctCount} dari ${totalCount} Jawaban Benar`, cx, cy + outerR + 50);

  // ── Name section ──────────────────────────────────────────────────────
  const nameY = 1000;

  // Label
  ctx.letterSpacing = "5px";
  ctx.fillStyle = SLATE;
  ctx.font = "500 20px 'Arial', sans-serif";
  ctx.fillText("DIBERIKAN KEPADA", cx, nameY);

  // User name (auto-wrap at 900px wide, max 2 lines)
  ctx.letterSpacing = "1px";
  ctx.fillStyle = WHITE;
  ctx.font = "900 68px 'Arial Black', 'Arial', sans-serif";
  wrapText(ctx, userName.toUpperCase(), cx, nameY + 72, 900, 80, "center");

  // Name underline
  ctx.fillStyle = YELLOW;
  ctx.fillRect(cx - 220, nameY + 148, 440, 4);

  // ── Badge title ───────────────────────────────────────────────────────
  const titleY = 1210;

  // Badge box background
  const titleBoxW = 760;
  const titleBoxH = 76;
  const titleBoxX = (W - titleBoxW) / 2;
  ctx.fillStyle = YELLOW;
  roundRect(ctx, titleBoxX, titleY, titleBoxW, titleBoxH, 16);
  ctx.fill();
  ctx.strokeStyle = DARK;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = DARK;
  ctx.font = "900 30px 'Arial Black', 'Arial', sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillText(badgeTitle.toUpperCase(), cx, titleY + 50);

  // Date
  const today = new Date();
  const dateStr = today.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  ctx.letterSpacing = "2px";
  ctx.fillStyle = SLATE;
  ctx.font = "500 22px 'Arial', sans-serif";
  ctx.fillText(dateStr, cx, titleY + 110);

  // ── Divider ───────────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(255,201,8,0.2)";
  ctx.fillRect(FRAME + 60, titleY + 136, W - (FRAME + 60) * 2, 1);

  // ── Challenge box ─────────────────────────────────────────────────────
  const boxX = FRAME + 48;
  const boxY = 1380;
  const boxW = W - (FRAME + 48) * 2;
  const boxH = 460;

  ctx.fillStyle = DARK2;
  roundRect(ctx, boxX, boxY, boxW, boxH, 20);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,201,8,0.5)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Fire headline
  ctx.letterSpacing = "3px";
  ctx.fillStyle = YELLOW;
  ctx.font = "900 42px 'Arial Black', 'Arial', sans-serif";
  ctx.fillText("🔥 TANTANG TEMANMU!", cx, boxY + 70);

  // Challenge text (auto-wrap)
  ctx.letterSpacing = "0px";
  ctx.fillStyle = WHITE;
  ctx.font = "500 26px 'Arial', sans-serif";
  wrapText(ctx, "Aku berhasil menyelesaikan Studi Kasus SDLC.", cx, boxY + 128, boxW - 80, 36, "center");
  wrapText(ctx, "Bisakah kamu mengalahkan skorku?", cx, boxY + 170, boxW - 80, 36, "center");

  // URL pill
  const urlPillW = 620;
  const urlPillH = 52;
  const urlPillX = (W - urlPillW) / 2;
  const urlPillY = boxY + 212;
  ctx.fillStyle = "rgba(255,201,8,0.12)";
  roundRect(ctx, urlPillX, urlPillY, urlPillW, urlPillH, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,201,8,0.4)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = YELLOW;
  ctx.font = "bold 22px 'Arial', sans-serif";
  ctx.letterSpacing = "0px";
  ctx.fillText("sdlc-craft.vercel.app", cx, urlPillY + 34);

  // CTA line
  ctx.fillStyle = SLATE;
  ctx.font = "500 22px 'Arial', sans-serif";
  ctx.fillText("Uji pemahamanmu sekarang →", cx, urlPillY + 76);

  // Hashtags
  ctx.fillStyle = "rgba(255,201,8,0.7)";
  ctx.font = "bold 24px 'Arial', sans-serif";
  ctx.letterSpacing = "1px";
  ctx.fillText("#BelajarSDLC   #SoftwareEngineering   #SDLCraft", cx, boxY + boxH - 36);

  // ── Bottom branding strip ──────────────────────────────────────────────
  ctx.letterSpacing = "4px";
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = "500 18px 'Arial', sans-serif";
  ctx.fillText("SDLCRAFT · INTERACTIVE LEARNING PLATFORM", cx, H - FRAME - 24);

  // ── Trigger download ──────────────────────────────────────────────────
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `SDLC-Badge-${userName.replace(/\s+/g, "_")}.png`;
  link.click();
}
