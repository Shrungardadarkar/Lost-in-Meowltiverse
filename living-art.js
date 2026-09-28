import { movingSegment, POCKETS } from './chambers.js';

export function drawLivingObject(ctx, game, o, sy, reduced, color) {
  const x = o.x, y = sy(o.y), m = game.mechanism(), accent = '#cfadff';
  const circle = (x, y, r, stroke, fill) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); } };
  const line = (x, y, ex, ey, stroke, width = 2) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); };
  const label = (text, x, y, size = 10, ink = color) => { ctx.font = `600 ${size}px system-ui`; ctx.textAlign = 'center'; ctx.fillStyle = ink; ctx.fillText(text, x, y); };
  ctx.save(); ctx.lineWidth = 1.5;
  if (o.type === 'track') {
    const open = game.trackOpen(o), selected = game.transit?.track === o, lit = o.active || m?.done.includes(o.goal);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const path = () => { ctx.beginPath(); o.points.forEach((p, i) => i ? ctx.lineTo(p.x, sy(p.y)) : ctx.moveTo(p.x, sy(p.y))); };
    ctx.setLineDash(open ? [] : [5, 8]); path(); ctx.strokeStyle = selected ? color + 'a0' : open ? color + '35' : accent + '24'; ctx.lineWidth = selected ? 16 : 11; ctx.stroke();
    path(); ctx.strokeStyle = '#101c30'; ctx.lineWidth = 6; ctx.stroke();
    path(); ctx.strokeStyle = selected ? color : lit ? color + 'b0' : color + '45'; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
    circle(x, y, o.r, open ? color + 'c0' : accent + '60', '#132234e8');
    if (open && game.rescueBoost && !game.room) { ctx.setLineDash([2, 5]); circle(x, y, o.r + 8, '#e4b9ff90'); ctx.setLineDash([]); }
    label(open ? o.label : o.timed && o.requires.every(g => m?.done.includes(g)) ? '◷' : '◇', x, y + 5, 16, open ? color : '#917caa');
    if (open) { line(x - 5, y + o.r + 13, x, y + o.r + 7, color); line(x, y + o.r + 7, x + 5, y + o.r + 13, color); }
    if (selected) { const end = o.points.at(-1); circle(end.x, sy(end.y), 17, color + '90'); }
  } else if (o.type === 'surface' || o.type === 'moving' || o.type === 'rotor') {
    const s = o.type === 'surface' ? { a: o, b: { x: o.ex, y: o.ey } } : movingSegment(o, game.time);
    line(s.a.x, sy(s.a.y), s.b.x, sy(s.b.y), '#23354c', 13); line(s.a.x, sy(s.a.y), s.b.x, sy(s.b.y), color, 3);
    if (o.type !== 'surface') circle(x, y, 5, accent, '#1b203c');
  } else if (o.type === 'switch' || o.type === 'break') {
    const ready = o.active; ctx.strokeStyle = ready ? color : '#f3c98c'; ctx.fillStyle = ready ? '#245342' : '#332c45';
    ctx.beginPath(); if (o.type === 'break') ctx.rect(x - 20, y - 15, 40, 30); else { ctx.moveTo(x, y - 24); ctx.lineTo(x + 24, y); ctx.lineTo(x, y + 24); ctx.lineTo(x - 24, y); ctx.closePath(); } ctx.fill(); ctx.stroke();
    label(ready ? '✓' : o.type === 'switch' ? 'Ⅰ' : 'ϟ', x, y + 5, 17, '#ffe0a2');
    if (o.type === 'switch') { ctx.setLineDash([3, 6]); line(x, y - 27, 210, sy(game.camera + 428) + 26, ready ? color : '#f3c98c65', 1); }
  } else if (o.type === 'loom' || o.type === 'mechanism') {
    if (o.type === 'loom') {
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + (reduced ? 0 : game.time * .08); ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(35, 0, 22, 8, 0, 0, Math.PI * 2); ctx.strokeStyle = m?.done.length >= 2 ? color + 'aa' : accent + '38'; ctx.stroke(); ctx.restore(); }
    } else {
      const count = o.required.length; for (let i = 0; i < count; i++) circle(x + (i - (count - 1) / 2) * 14, y, 3, color, o.done.includes(o.required[i]) ? color : '#172335');
    }
  } else if (o.type === 'spirit') {
    ctx.globalAlpha = .65; circle(x, y, 19, color, '#274d4966'); label('⌣', x, y + 5, 21); line(x, y - 22, 210, sy(game.camera + 650), color + '65', 1); label('♧', x, y - 26, 13, '#f3d28a');
  } else if (o.type === 'clue') {
    label('●', x, y, 9, '#f3d28a'); for (const dx of [-7, 0, 7]) circle(x + dx, y - 10, 2, null, '#f3d28a');
  } else if (o.type === 'well') {
    for (let i = 0; i < 4; i++) circle(x, y, o.r * (i + 1) / 4, '#ffb27d35'); label('→', x, y, 26, '#ffb27d');
    ctx.setLineDash([4, 8]); line(32, sy(285), 388, sy(285), '#ffb27d80', 1); for (const px of [80, 210, 340]) label('→', px, sy(305), 16, '#ffb27d');
  } else if (o.type === 'size-zone') {
    ctx.setLineDash([4, 8]); line(32, sy(280), 388, sy(280), '#c8ef9560', 1); line(210, sy(700), 210, sy(280), '#c8ef9540', 1); label('◇', x - 70, y, 19, '#c8ef95'); label('◯', x + 70, y, 32, '#c8ef95');
  } else if (o.type === 'fold') {
    ctx.setLineDash([4, 8]); line(210, sy(700), 210, sy(285), '#b5dcff80', 2); label('⟦', 80, y, 40, '#b5dcff'); label('⟧', 340, y, 40, '#b5dcff');
  } else if (o.type === 'star' && o.echoOnly) {
    ctx.setLineDash([2, 5]); circle(x, y, 14, '#efa6ee'); label('✦', x, y + 5, 17, '#efa6ee');
  } else if (o.type === 'echo-mark') {
    ctx.setLineDash([3, 7]); circle(x, y, 40, '#efa6ee55'); label('···', x, y, 25, '#efa6ee');
  } else { ctx.restore(); return false; }
  ctx.restore(); return true;
}

export function drawMaterial(ctx, game, sy, reduced) {
  const b = game.ball, p = POCKETS[game.room?.kind]; if (!p) return;
  ctx.save(); ctx.strokeStyle = p.color; ctx.lineWidth = 1.5;
  if (p.material === 'glass') {
    // Predict free-flight only: a preview, not a promise through collisions.
    ctx.fillStyle = p.color + '75'; for (let i = 1; i < 5; i++) { const t = i * .04; ctx.beginPath(); ctx.arc(b.x + b.vx * t, sy(b.y + b.vy * t - 310 * t * t), 1.5, 0, 7); ctx.fill(); }
  }
  if (p.material === 'opal' || p.material === 'chrome') { ctx.beginPath(); ctx.moveTo(b.x, sy(b.y) - b.r - 5); ctx.lineTo(b.x + b.r + 5, sy(b.y)); ctx.lineTo(b.x, sy(b.y) + b.r + 5); ctx.lineTo(b.x - b.r - 5, sy(b.y)); ctx.closePath(); ctx.stroke(); }
  if (p.material === 'water' || p.material === 'ember') { ctx.beginPath(); ctx.ellipse(b.x, sy(b.y), b.r + 5, b.r + 2, reduced ? 0 : game.time, 0, 7); ctx.stroke(); }
  if (game.echo) { ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.arc(game.echo.x, sy(game.echo.y), b.r, 0, 7); ctx.stroke(); }
  ctx.restore();
}
