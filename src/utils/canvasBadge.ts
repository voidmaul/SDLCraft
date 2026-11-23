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

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
  let rot = (Math.PI / 2) * 3;
  const x = cx;
  const y = cy;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    cx = x + Math.cos(rot) * outerRadius;
    cy = y + Math.sin(rot) * outerRadius;
    ctx.lineTo(cx, cy);
    rot += step;
    cx = x + Math.cos(rot) * innerRadius;
    cy = y + Math.sin(rot) * innerRadius;
    ctx.lineTo(cx, cy);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
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

// Perkecil ukuran font secara otomatis sampai teks muat dalam lebar maksimum.
// Mencegah teks overflow keluar dari hexagon / frame.
function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxSize: number,
  weight: string,
  family: string,
  minSize = 28
): number {
  let size = maxSize;
  ctx.font = `${weight} ${size}px ${family}`;
  while (ctx.measureText(text).width > maxWidth && size > minSize) {
    size -= 2;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

// ─── Instagram Story Badge Generator (HTML5 Canvas 2D, 1080×1920) ─────────
// Tema cerah (light mode) selaras dengan UI website SDLCcraft.
// Layout dihitung agar seluruh konten berada di dalam frame tanpa tumpang-tindih.
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
  const YELLOW_DIM = "rgba(255,201,8,0.20)";
  const DARK = "#0F172A";
  const WHITE = "#FFFFFF";
  const SLATE = "#64748B";
  const FRAME = 40;

  const FONT_STACK = "'Arial Black', 'Arial', sans-serif";

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // ── Background putih cerah dengan pola dot grid ──────────────────────
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(15,23,42,0.08)";
  const STEP = 30;
  for (let x = STEP; x < W; x += STEP) {
    for (let y = STEP; y < H; y += STEP) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Accent circles di sudut (dekorasi berkarakter)
  ctx.fillStyle = YELLOW_DIM;
  const accentDots = [
    { x: 130, y: 360, r: 38 }, { x: 950, y: 360, r: 30 },
    { x: 150, y: 1620, r: 34 }, { x: 930, y: 1620, r: 40 },
    { x: 360, y: 140, r: 24 }, { x: 720, y: 140, r: 20 },
  ];
  for (const d of accentDots) {
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Frame luar (brand yellow) + inner accent
  ctx.strokeStyle = YELLOW;
  ctx.lineWidth = 8;
  ctx.strokeRect(FRAME, FRAME, W - FRAME * 2, H - FRAME * 2);

  ctx.strokeStyle = "rgba(255,201,8,0.45)";
  ctx.lineWidth = 2;
  ctx.strokeRect(FRAME + 20, FRAME + 20, W - (FRAME + 20) * 2, H - (FRAME + 20) * 2);

  // ── Header ────────────────────────────────────────────────────────────
  const barY = 90;
  const barW = 560;
  const barH = 56;
  const barX = (W - barW) / 2;

  ctx.fillStyle = YELLOW;
  roundRect(ctx, barX, barY, barW, barH, 16);
  ctx.fill();

  ctx.fillStyle = DARK;
  ctx.font = "bold 24px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "3px";
  ctx.fillText("SDLCRAFT · INTERACTIVE LEARNING", W / 2, barY + 36);

  ctx.fillStyle = SLATE;
  ctx.font = "500 18px Arial, sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("OFFICIAL BADGE OF COMPETENCY", W / 2, barY + 92);

  ctx.fillStyle = "rgba(255,201,8,0.3)";
  ctx.fillRect(FRAME + 60, barY + 112, W - (FRAME + 60) * 2, 1);

  // ── Emblem hexagon ────────────────────────────────────────────────────
  const cx = W / 2;
  const cy = 500;
  const outerR = 210;
  const innerR = 168;

  // Glow ring
  ctx.shadowColor = YELLOW;
  ctx.shadowBlur = 50;
  drawHexagon(ctx, cx, cy, outerR + 18);
  ctx.fillStyle = "rgba(255,201,8,0.15)";
  ctx.fill();
  ctx.shadowBlur = 0;

  // Outer ring (drop shadow)
  ctx.shadowColor = "rgba(15,23,42,0.22)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;
  drawHexagon(ctx, cx, cy, outerR);
  ctx.fillStyle = DARK;
  ctx.fill();
  ctx.strokeStyle = YELLOW;
  ctx.lineWidth = 11;
  ctx.stroke();
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Inner fill
  drawHexagon(ctx, cx, cy, innerR);
  ctx.fillStyle = WHITE;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,201,8,0.5)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Score — auto-fit agar tidak keluar hexagon
  const scoreText = `${score}%`;
  const scoreMaxWidth = innerR * 1.6; // ruang aman di dalam hexagon
  const scoreSize = fitFontSize(ctx, scoreText, scoreMaxWidth, 128, "900", FONT_STACK, 60);
  ctx.fillStyle = YELLOW;
  ctx.textAlign = "center";
  ctx.letterSpacing = "0px";
  ctx.fillText(scoreText, cx, cy + scoreSize * 0.34);

  ctx.fillStyle = DARK;
  ctx.font = "bold 28px Arial, sans-serif";
  ctx.letterSpacing = "6px";
  ctx.fillText("SCORE", cx, cy + scoreSize * 0.34 + 48);

  // "X dari Y Jawaban Benar"
  ctx.letterSpacing = "0px";
  ctx.fillStyle = SLATE;
  ctx.font = "500 26px Arial, sans-serif";
  ctx.fillText(`${correctCount} dari ${totalCount} Jawaban Benar`, cx, cy + outerR + 58);

  // Star accent
  ctx.fillStyle = YELLOW;
  drawStar(ctx, cx, cy + outerR + 96, 5, 16, 8);
  ctx.fill();

  // ── Recipient section ─────────────────────────────────────────────────
  const recipientY = 866;
  ctx.letterSpacing = "2px";
  ctx.fillStyle = SLATE;
  ctx.font = "bold 32px Arial, sans-serif";
  ctx.fillText("DIBERIKAN KEPADA", cx, recipientY);

  // Nama — auto-fit agar tidak melewati frame
  const nameText = userName.toUpperCase();
  const nameMaxWidth = W - FRAME * 2 - 120;
  const nameSize = fitFontSize(ctx, nameText, nameMaxWidth, 60, "900", FONT_STACK, 30);
  const nameBaseline = recipientY + 88;
  ctx.fillStyle = DARK;
  ctx.font = `900 ${nameSize}px ${FONT_STACK}`;
  ctx.fillText(nameText, cx, nameBaseline);

  // "dengan lencana kompetensi" — lebih besar & lebih dekat ke title box
  ctx.letterSpacing = "1px";
  ctx.fillStyle = SLATE;
  ctx.font = "500 38px Arial, sans-serif";
  ctx.fillText("dengan lencana kompetensi", cx, recipientY + 152);

  // Garis dekoratif
  ctx.fillStyle = YELLOW_DIM;
  ctx.fillRect(cx - 180, recipientY + 186, 360, 3);

  // ── Badge title box ───────────────────────────────────────────────────
  const titleY = 1090;
  const titleBoxW = 800;
  const titleBoxH = 100;
  const titleBoxX = (W - titleBoxW) / 2;

  // Shadow bawah
  ctx.fillStyle = "rgba(15,23,42,0.16)";
  roundRect(ctx, titleBoxX + 2, titleY + 9, titleBoxW - 4, titleBoxH - 18, 24);
  ctx.fill();

  ctx.fillStyle = YELLOW;
  roundRect(ctx, titleBoxX, titleY, titleBoxW, titleBoxH, 26);
  ctx.fill();
  ctx.strokeStyle = DARK;
  ctx.lineWidth = 5;
  ctx.stroke();

  // Judul — auto-fit agar muat dalam kotak
  const titleText = badgeTitle.toUpperCase();
  const titleSize = fitFontSize(ctx, titleText, titleBoxW - 70, 44, "900", FONT_STACK, 24);
  ctx.fillStyle = DARK;
  ctx.font = `900 ${titleSize}px ${FONT_STACK}`;
  ctx.letterSpacing = "1px";
  ctx.fillText(titleText, cx, titleY + titleBoxH / 2 + titleSize * 0.36);

  // Tanggal (jarak nyaman dari kotak)
  const today = new Date();
  const dateStr = today.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  ctx.letterSpacing = "1px";
  ctx.fillStyle = SLATE;
  ctx.font = "500 24px Arial, sans-serif";
  ctx.fillText(dateStr, cx, titleY + titleBoxH + 40);

  // Divider
  ctx.fillStyle = "rgba(15,23,42,0.10)";
  ctx.fillRect(FRAME + 80, titleY + titleBoxH + 72, W - (FRAME + 80) * 2, 1);

  // ── Challenge box (sepenuhnya di dalam frame) ─────────────────────────
  const boxX = FRAME + 48;
  const boxY = 1340;
  const boxW = W - (FRAME + 48) * 2;
  const boxH = 400; // berakhir di 1740 < frame 1880

  // Shadow bawah
  ctx.fillStyle = "rgba(15,23,42,0.18)";
  roundRect(ctx, boxX + 2, boxY + 9, boxW - 4, boxH - 18, 28);
  ctx.fill();

  ctx.fillStyle = DARK;
  roundRect(ctx, boxX, boxY, boxW, boxH, 30);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,201,8,0.85)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Headline
  ctx.letterSpacing = "2px";
  ctx.fillStyle = YELLOW;
  ctx.font = "900 44px 'Arial Black', Arial, sans-serif";
  ctx.fillText("🔥 TANTANG TEMANMU!", cx, boxY + 70);

  // Challenge text
  ctx.letterSpacing = "0px";
  ctx.fillStyle = WHITE;
  ctx.font = "500 29px Arial, sans-serif";
  wrapText(ctx, "Aku berhasil menyelesaikan Studi Kasus SDLC.", cx, boxY + 132, boxW - 90, 40, "center");
  wrapText(ctx, "Bisakah kamu mengalahkan skorku?", cx, boxY + 176, boxW - 90, 40, "center");

  // URL pill
  const urlPillW = 640;
  const urlPillH = 58;
  const urlPillX = (W - urlPillW) / 2;
  const urlPillY = boxY + 230;
  ctx.fillStyle = "rgba(255,201,8,0.10)";
  roundRect(ctx, urlPillX, urlPillY, urlPillW, urlPillH, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,201,8,0.5)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = YELLOW;
  ctx.font = "bold 28px Arial, sans-serif";
  ctx.letterSpacing = "0px";
  ctx.fillText("sdlc-craft.vercel.app", cx, urlPillY + 38);

  // CTA
  ctx.fillStyle = SLATE;
  ctx.font = "500 26px Arial, sans-serif";
  ctx.fillText("Uji pemahamanmu sekarang →", cx, urlPillY + 88);

  // Hashtags (di dalam box, dengan jarak aman dari tepi bawah box)
  ctx.fillStyle = "rgba(255,201,8,0.85)";
  ctx.font = "bold 24px Arial, sans-serif";
  ctx.letterSpacing = "1px";
  ctx.fillText("#BelajarSDLC   #SoftwareEngineering   #SDLCraft", cx, boxY + boxH - 40);

  // ── Bottom branding strip (di bawah box, di dalam frame) ──────────────
  ctx.letterSpacing = "3px";
  ctx.fillStyle = SLATE;
  ctx.font = "500 18px Arial, sans-serif";
  ctx.fillText("SDLCRAFT · INTERACTIVE LEARNING PLATFORM", cx, H - FRAME - 30);

  // ── Trigger download ──────────────────────────────────────────────────
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `SDLC-Badge-${userName.replace(/\s+/g, "_")}.png`;
  link.click();
}
