import { UniverseData } from '../types';

export async function generateShareCard(universe: UniverseData): Promise<string> {
  const width = 1200;
  const height = 630;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context unavailable');
  }

  // 1. Deep Obsidian Space Gradient
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, 700);
  bgGrad.addColorStop(0, '#0d1326');
  bgGrad.addColorStop(0.5, '#070913');
  bgGrad.addColorStop(1, '#030408');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Cosmic Nebula Clouds
  const nebulaGrad = ctx.createRadialGradient(900, 250, 40, 900, 250, 420);
  nebulaGrad.addColorStop(0, 'rgba(6, 182, 212, 0.16)');
  nebulaGrad.addColorStop(0.5, 'rgba(124, 58, 237, 0.08)');
  nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = nebulaGrad;
  ctx.fillRect(0, 0, width, height);

  // 3. Procedural Background Stars
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 180; i++) {
    const x = (Math.sin(i * 997) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 433) * 0.5 + 0.5) * height;
    const radius = ((i % 5) === 0 ? 1.8 : 0.9) * (0.6 + (i % 3) * 0.2);
    const alpha = 0.2 + ((i * 17) % 70) / 100;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // 4. Subtle Outer Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, width - 48, height - 48);

  // 5. GitVerse Brand Wordmark & Emblem
  ctx.fillStyle = '#06b6d4';
  ctx.beginPath();
  ctx.arc(72, 72, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(72, 72, 16, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = '700 22px Outfit, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('GITVERSE', 98, 79);

  ctx.font = '500 13px "JetBrains Mono", monospace';
  ctx.fillStyle = '#64748b';
  ctx.fillText('THE UNIVERSE OF CODE', 222, 78);

  // 6. User Profile Card Section
  const user = universe.user;
  const avatarX = 72;
  const avatarY = 130;
  const avatarSize = 100;

  // Try to draw avatar image, fallback to stylized glyph if CORS blocked
  let avatarLoaded = false;
  if (user.avatar_url) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = user.avatar_url;
      await new Promise<void>((resolve) => {
        img.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, avatarX, avatarY, avatarSize, avatarSize);
          ctx.restore();
          avatarLoaded = true;
          resolve();
        };
        img.onerror = () => resolve();
        setTimeout(resolve, 800); // safety timeout
      });
    } catch {
      avatarLoaded = false;
    }
  }

  if (!avatarLoaded) {
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#06b6d4';
    ctx.font = '700 36px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((user.name || user.login).charAt(0).toUpperCase(), avatarX + avatarSize / 2, avatarY + 62);
    ctx.textAlign = 'left';
  }

  // Avatar border ring
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 4, 0, Math.PI * 2);
  ctx.stroke();

  // Name & Handle
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 34px Outfit, sans-serif';
  ctx.fillText(user.name || user.login, 196, 172);

  ctx.fillStyle = '#06b6d4';
  ctx.font = '500 18px "JetBrains Mono", monospace';
  ctx.fillText(`@${user.login}`, 196, 204);

  // Stellar Classification
  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 15px Outfit, sans-serif';
  ctx.fillText(universe.classification, 196, 230);

  // 7. Verified Statistics Grid
  const stats = [
    { label: 'PLANETARY REPOSITORIES', value: String(user.public_repos) },
    { label: 'TOTAL STELLAR STARS', value: universe.totalStars.toLocaleString() },
    { label: 'COSMIC FORKS', value: universe.totalForks.toLocaleString() },
    { label: 'DOMINANT ELEMENT', value: universe.dominantLanguage },
  ];

  const gridStartX = 72;
  const gridStartY = 280;
  const colWidth = 145;

  stats.forEach((st, i) => {
    const x = gridStartX + i * (colWidth + 18);
    // Card background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.fillRect(x, gridStartY, colWidth, 78);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, gridStartY, colWidth, 78);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 10px "JetBrains Mono", monospace';
    ctx.fillText(st.label, x + 12, gridStartY + 24);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.fillText(st.value, x + 12, gridStartY + 56);
  });

  // 8. Top Languages Progress Breakdown
  if (universe.languageBreakdown.length > 0) {
    const barX = 72;
    const barY = 388;
    const barWidth = 634;
    const barHeight = 8;

    ctx.fillStyle = '#64748b';
    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillText('LANGUAGE SPECTRUM', barX, barY - 10);

    let curX = barX;
    universe.languageBreakdown.slice(0, 5).forEach((lang) => {
      const segWidth = (lang.percentage / 100) * barWidth;
      ctx.fillStyle = lang.color;
      ctx.fillRect(curX, barY, segWidth, barHeight);
      curX += segWidth;
    });

    // Language legend list
    let legX = barX;
    universe.languageBreakdown.slice(0, 4).forEach((lang) => {
      ctx.fillStyle = lang.color;
      ctx.beginPath();
      ctx.arc(legX + 4, barY + 28, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '400 12px Outfit, sans-serif';
      const labelText = `${lang.name} ${lang.percentage}%`;
      ctx.fillText(labelText, legX + 14, barY + 32);
      legX += ctx.measureText(labelText).width + 26;
    });
  }

  // 9. Planetary System Illustration (Right Side)
  const sysCenterX = 940;
  const sysCenterY = 315;

  // Star glow
  const starGlow = ctx.createRadialGradient(sysCenterX, sysCenterY, 5, sysCenterX, sysCenterY, 90);
  starGlow.addColorStop(0, '#38bdf8');
  starGlow.addColorStop(0.3, 'rgba(6, 182, 212, 0.5)');
  starGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
  ctx.fillStyle = starGlow;
  ctx.fillRect(sysCenterX - 100, sysCenterY - 100, 200, 200);

  // Central star
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(sysCenterX, sysCenterY, 18, 0, Math.PI * 2);
  ctx.fill();

  // Orbital rings
  const orbitRadii = [48, 85, 125, 168];
  orbitRadii.forEach((r, idx) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(sysCenterX, sysCenterY, r, r * 0.42, 0.25, 0, Math.PI * 2);
    ctx.stroke();

    // Planet on orbit
    const angle = idx * 1.5 + 0.4;
    const px = sysCenterX + Math.cos(angle) * r;
    const py = sysCenterY + Math.sin(angle) * (r * 0.42);
    const planetColors = ['#3178c6', '#3572A5', '#dea584', '#00add8'];
    const pColor = planetColors[idx % planetColors.length];

    ctx.fillStyle = pColor;
    ctx.beginPath();
    ctx.arc(px, py, 6 + (idx % 3) * 2, 0, Math.PI * 2);
    ctx.fill();

    // Moon
    if (idx === 1 || idx === 3) {
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(px + 10, py - 6, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 10. Footer / Route URL
  ctx.fillStyle = '#475569';
  ctx.font = '500 13px "JetBrains Mono", monospace';
  ctx.fillText(`https://gitverse.dev/u/${user.login}`, 72, height - 48);

  ctx.fillStyle = '#06b6d4';
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('EXPLORE IN 3D →', width - 72, height - 48);
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
