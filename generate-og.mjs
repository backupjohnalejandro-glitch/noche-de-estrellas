import sharp from 'sharp';

// Helper: puntos de una estrella de N puntas
function starPoints(cx, cy, outerR, innerR, points) {
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(' ');
}

// Helper: corazón SVG path centrado en (cx, cy) con escala s
function heartPath(cx, cy, s) {
  return `M ${cx} ${cy + s * 0.3}
    C ${cx} ${cy - s * 0.1}, ${cx - s * 0.6} ${cy - s * 0.4}, ${cx - s * 0.6} ${cy - s * 0.1}
    C ${cx - s * 0.6} ${cy - s * 0.5}, ${cx} ${cy - s * 0.5}, ${cx} ${cy - s * 0.15}
    C ${cx} ${cy - s * 0.5}, ${cx + s * 0.6} ${cy - s * 0.5}, ${cx + s * 0.6} ${cy - s * 0.1}
    C ${cx + s * 0.6} ${cy - s * 0.4}, ${cx} ${cy - s * 0.1}, ${cx} ${cy + s * 0.3} Z`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="bg" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#1e0840"/>
      <stop offset="55%" stop-color="#0f0524"/>
      <stop offset="100%" stop-color="#060612"/>
    </radialGradient>
    <radialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fde68a" stop-opacity="0.25"/>
      <stop offset="60%" stop-color="#fde68a" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#fde68a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cloudGlow1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c084fc" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#c084fc" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cloudGlow2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f9a8d4" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#f9a8d4" stop-opacity="0"/>
    </radialGradient>
    <filter id="softBlur">
      <feGaussianBlur stdDeviation="8"/>
    </filter>
    <filter id="starGlow">
      <feGaussianBlur stdDeviation="2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="textGlow">
      <feGaussianBlur stdDeviation="6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f9a8d4"/>
      <stop offset="35%" stop-color="#ffffff"/>
      <stop offset="65%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#f9a8d4"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.03"/>
    </linearGradient>
    <clipPath id="moonClip">
      <circle cx="210" cy="315" r="90"/>
    </clipPath>
  </defs>

  <!-- Fondo -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Nubes difusas -->
  <ellipse cx="190" cy="110" rx="180" ry="50" fill="url(#cloudGlow1)" filter="url(#softBlur)"/>
  <ellipse cx="1060" cy="160" rx="140" ry="40" fill="url(#cloudGlow2)" filter="url(#softBlur)"/>
  <ellipse cx="600" cy="75" rx="220" ry="38" fill="url(#cloudGlow1)" filter="url(#softBlur)" opacity="0.5"/>
  <ellipse cx="900" cy="520" rx="160" ry="40" fill="url(#cloudGlow2)" filter="url(#softBlur)" opacity="0.4"/>

  <!-- Estrellas de fondo (puntos) -->
  ${[
    [80,60,1.8,0.9],[155,115,1.4,0.7],[248,42,2.2,0.8],[328,88,1,0.9],
    [425,32,1.8,0.6],[508,98,1.4,0.8],[628,47,1.8,0.7],[712,28,1,0.9],
    [788,76,2.2,0.6],[878,52,1.4,0.8],[958,96,1.8,0.7],[1058,38,1,0.9],
    [1128,82,1.8,0.8],[1168,148,1.4,0.6],[62,198,1,0.7],[185,248,1.8,0.5],
    [1108,278,1.4,0.7],[1178,318,1,0.8],[32,348,1.8,0.6],[105,398,1.4,0.5],
    [1148,418,1.8,0.6],[52,498,1,0.7],[1188,498,1.4,0.5],[355,158,2.5,0.9],
    [858,138,2,0.8],[135,318,1.8,0.7],[1078,358,1.8,0.6],[430,170,1.2,0.5],
    [550,55,1.5,0.7],[670,140,1,0.6],[760,60,1.8,0.8],[910,180,1.2,0.5],
    [1000,70,2,0.7],[300,400,1.2,0.4],[400,530,1.5,0.3],[700,580,1,0.4],
    [1050,560,1.5,0.3],[200,570,1,0.4],[900,90,1.2,0.6]
  ].map(([x,y,r,op]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="white" opacity="${op}"/>`).join('\n  ')}

  <!-- Estrellas de 4 puntas decorativas -->
  <polygon points="${starPoints(350,155,5,2,4)}" fill="white" opacity="0.9" filter="url(#starGlow)"/>
  <polygon points="${starPoints(855,140,4,1.5,4)}" fill="#f9a8d4" opacity="0.9" filter="url(#starGlow)"/>
  <polygon points="${starPoints(1068,356,4,1.5,4)}" fill="#f9a8d4" opacity="0.7" filter="url(#starGlow)"/>
  <polygon points="${starPoints(480,520,3,1.2,4)}" fill="#c084fc" opacity="0.6" filter="url(#starGlow)"/>
  <polygon points="${starPoints(1020,450,3.5,1.3,4)}" fill="white" opacity="0.7" filter="url(#starGlow)"/>

  <!-- Halo de la luna -->
  <circle cx="210" cy="315" r="145" fill="url(#moonHalo)" filter="url(#softBlur)"/>

  <!-- Luna dibujada con SVG puro (creciente) -->
  <!-- Círculo completo amarillo -->
  <circle cx="210" cy="315" r="88" fill="#fde68a" opacity="0.92"/>
  <!-- Círculo que "recorta" para hacer el creciente -->
  <circle cx="248" cy="300" r="75" fill="#12063a"/>
  <!-- Brillo sutil en el borde -->
  <circle cx="210" cy="315" r="88" fill="none" stroke="#fef3c7" stroke-width="2" opacity="0.4"/>

  <!-- Crateritos de la luna -->
  <circle cx="185" cy="300" r="7" fill="#f6d86b" opacity="0.6"/>
  <circle cx="200" cy="330" r="5" fill="#f6d86b" opacity="0.5"/>
  <circle cx="175" cy="335" r="4" fill="#f6d86b" opacity="0.4"/>

  <!-- Estrella pequeña orbitando la luna -->
  <polygon points="${starPoints(318, 210, 10, 4, 5)}" fill="#fde68a" opacity="0.95" filter="url(#starGlow)"/>
  <polygon points="${starPoints(295, 420, 7, 3, 5)}" fill="#f9a8d4" opacity="0.8" filter="url(#starGlow)"/>

  <!-- Líneas decorativas horizontales -->
  <line x1="415" y1="195" x2="1155" y2="195" stroke="#f9a8d4" stroke-width="0.8" opacity="0.18"/>
  <line x1="415" y1="440" x2="1155" y2="440" stroke="#c084fc" stroke-width="0.8" opacity="0.14"/>

  <!-- Tarjeta de fondo para el texto -->
  <rect x="405" y="170" width="765" height="295" rx="24" fill="url(#cardGrad)" stroke="#f9a8d4" stroke-width="0.8" opacity="0.7" stroke-opacity="0.12"/>

  <!-- Título "Buenas Noches" -->
  <text x="788" y="287"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="74"
    font-weight="bold"
    text-anchor="middle"
    fill="url(#titleGrad)"
    filter="url(#textGlow)">Buenas Noches</text>

  <!-- Nombre "Steffy" -->
  <text x="788" y="385"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="82"
    font-weight="bold"
    text-anchor="middle"
    fill="#f9a8d4"
    filter="url(#textGlow)">Steffy</text>

  <!-- Corazón al lado del nombre -->
  <path d="${heartPath(976, 348, 32)}" fill="#ec4899" opacity="0.9" filter="url(#starGlow)"/>

  <!-- Mensaje debajo -->
  <text x="788" y="498"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="24"
    text-anchor="middle"
    fill="white"
    opacity="0.55" letter-spacing="0.5">Que esta noche te envuelva en dulces suenos</text>

  <!-- Puntos decorativos de separación -->
  <circle cx="740" cy="548" r="4" fill="#f9a8d4" opacity="0.65"/>
  <circle cx="762" cy="552" r="3" fill="#c084fc" opacity="0.55"/>
  <circle cx="782" cy="554" r="4.5" fill="#f9a8d4" opacity="0.7"/>
  <circle cx="803" cy="552" r="3" fill="#c084fc" opacity="0.55"/>
  <circle cx="824" cy="548" r="4" fill="#f9a8d4" opacity="0.65"/>

  <!-- Estrellitas dispersas decorativas -->
  <polygon points="${starPoints(450, 550, 6, 2.5, 4)}" fill="#c084fc" opacity="0.5"/>
  <polygon points="${starPoints(1100, 520, 5, 2, 4)}" fill="#f9a8d4" opacity="0.45"/>
  <polygon points="${starPoints(120, 480, 5, 2, 4)}" fill="white" opacity="0.4"/>
  <polygon points="${starPoints(1000, 160, 6, 2.5, 4)}" fill="#c084fc" opacity="0.5"/>

  <!-- Borde sutil -->
  <rect x="3" y="3" width="1194" height="624" rx="0" fill="none" stroke="#f9a8d4" stroke-width="1.5" opacity="0.08"/>
</svg>`;

const svgBuffer = Buffer.from(svg);

await sharp(svgBuffer)
  .png({ quality: 95 })
  .toFile('./public/og-buenas-noches.png');

console.log('OG image generated: public/og-buenas-noches.png');
