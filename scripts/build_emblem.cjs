const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Generate exact Black Stone Fitness Emblem SVG matching the user's uploaded image
function generateEmblemSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Background Radial Gradients -->
    <radialGradient id="rimMetalBg" cx="50%" cy="50%" r="50%" fx="35%" fy="30%">
      <stop offset="0%" stop-color="#2a2a2e"/>
      <stop offset="45%" stop-color="#18181b"/>
      <stop offset="85%" stop-color="#0e0e11"/>
      <stop offset="100%" stop-color="#050507"/>
    </radialGradient>

    <radialGradient id="innerPlateBg" cx="50%" cy="50%" r="50%" fx="45%" fy="40%">
      <stop offset="0%" stop-color="#27272a"/>
      <stop offset="35%" stop-color="#1c1c20"/>
      <stop offset="70%" stop-color="#121215"/>
      <stop offset="100%" stop-color="#09090b"/>
    </radialGradient>

    <!-- Metallic Brushed Silver/Steel Gradients -->
    <linearGradient id="chromeBevel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f4f4f5"/>
      <stop offset="25%" stop-color="#d4d4d8"/>
      <stop offset="50%" stop-color="#71717a"/>
      <stop offset="75%" stop-color="#a1a1aa"/>
      <stop offset="100%" stop-color="#3f3f46"/>
    </linearGradient>

    <linearGradient id="infinityGradTop" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="25%" stop-color="#E4E4E7"/>
      <stop offset="60%" stop-color="#A1A1AA"/>
      <stop offset="100%" stop-color="#3F3F46"/>
    </linearGradient>

    <linearGradient id="infinityGradBottom" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#18181B"/>
      <stop offset="40%" stop-color="#52525B"/>
      <stop offset="80%" stop-color="#D4D4D8"/>
      <stop offset="100%" stop-color="#FFFFFF"/>
    </linearGradient>

    <linearGradient id="plateBarbellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#71717A"/>
      <stop offset="15%" stop-color="#E4E4E7"/>
      <stop offset="30%" stop-color="#A1A1AA"/>
      <stop offset="70%" stop-color="#3F3F46"/>
      <stop offset="100%" stop-color="#18181B"/>
    </linearGradient>

    <linearGradient id="weightRibGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#52525B"/>
      <stop offset="30%" stop-color="#A1A1AA"/>
      <stop offset="50%" stop-color="#E4E4E7"/>
      <stop offset="70%" stop-color="#71717A"/>
      <stop offset="100%" stop-color="#27272A"/>
    </linearGradient>

    <linearGradient id="orangeStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB923C"/>
      <stop offset="40%" stop-color="#F97316"/>
      <stop offset="100%" stop-color="#EA580C"/>
    </linearGradient>

    <!-- Drop Shadows -->
    <filter id="badgeShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.9"/>
    </filter>

    <filter id="coreDropShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.85"/>
    </filter>

    <filter id="starGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#F97316" flood-opacity="0.5"/>
    </filter>

    <!-- Arched Text Paths -->
    <!-- Top Arc for BLACK STONE: radius 195, centered at (256, 256) -->
    <path id="pathBlackStone" d="M 72 256 A 184 184 0 0 1 440 256" fill="none"/>
    <!-- Bottom Arc for FITNESS: radius 195, centered at (256, 256) -->
    <path id="pathFitness" d="M 440 256 A 184 184 0 0 1 72 256" fill="none"/>
  </defs>

  <!-- 1. Outer Dark Circular Base & Metallic Rim -->
  <g id="outer-rim" filter="url(#badgeShadow)">
    <!-- Base Dark Shield -->
    <circle cx="256" cy="256" r="236" fill="url(#rimMetalBg)" stroke="#3f3f46" stroke-width="3"/>
    
    <!-- Outer Heavy Knurled Cast-Iron Rim -->
    <circle cx="256" cy="256" r="232" fill="none" stroke="#18181b" stroke-width="8"/>
    <circle cx="256" cy="256" r="226" fill="none" stroke="#52525b" stroke-width="2.5" stroke-opacity="0.7"/>
    <circle cx="256" cy="256" r="223" fill="none" stroke="#09090b" stroke-width="3"/>

    <!-- Subtle Texture/Knurl Dots on Outer Ring -->
    <circle cx="256" cy="256" r="218" fill="none" stroke="#3f3f46" stroke-width="1.5" stroke-dasharray="3 5" stroke-opacity="0.5"/>

    <!-- Left Outer Hinge Lug -->
    <rect x="18" y="242" width="22" height="28" rx="4" fill="url(#chromeBevel)" stroke="#18181b" stroke-width="2"/>
    <circle cx="29" cy="256" r="4.5" fill="#18181b" stroke="#71717a" stroke-width="1.5"/>

    <!-- Right Outer Hinge Lug -->
    <rect x="472" y="242" width="22" height="28" rx="4" fill="url(#chromeBevel)" stroke="#18181b" stroke-width="2"/>
    <circle cx="483" cy="256" r="4.5" fill="#18181b" stroke="#71717a" stroke-width="1.5"/>
  </g>

  <!-- 2. Typography Along Circular Rim -->
  <!-- Top: "BLACK STONE" -->
  <text font-family="'Cinzel', 'Trajan Pro', 'Georgia', 'Outfit', 'Times New Roman', serif"
        font-weight="900" font-size="36" letter-spacing="9" fill="#FFFFFF" text-anchor="middle"
        style="filter: drop-shadow(0px 3px 4px rgba(0,0,0,0.9));">
    <textPath href="#pathBlackStone" startOffset="50%" text-anchor="middle">
      BLACK STONE
    </textPath>
  </text>

  <!-- Bottom: "FITNESS" -->
  <text font-family="'Cinzel', 'Trajan Pro', 'Georgia', 'Outfit', 'Times New Roman', serif"
        font-weight="900" font-size="34" letter-spacing="10" fill="#FFFFFF" text-anchor="middle"
        style="filter: drop-shadow(0px 3px 4px rgba(0,0,0,0.9));">
    <textPath href="#pathFitness" startOffset="50%" text-anchor="middle">
      FITNESS
    </textPath>
  </text>

  <!-- Left Orange Star Accent (approx 208 degrees) -->
  <g transform="translate(118, 344) scale(1.4)" filter="url(#starGlow)">
    <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill="url(#orangeStarGrad)"/>
  </g>

  <!-- Right Orange Star Accent (approx 332 degrees) -->
  <g transform="translate(394, 344) scale(1.4)" filter="url(#starGlow)">
    <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill="url(#orangeStarGrad)"/>
  </g>

  <!-- 3. Inner Recessed Disc -->
  <g id="inner-disc">
    <!-- Outer Deep Shadow Groove -->
    <circle cx="256" cy="256" r="156" fill="#000000" />
    
    <!-- Raised Metallic Steel Circular Plate -->
    <circle cx="256" cy="256" r="152" fill="url(#innerPlateBg)" stroke="url(#chromeBevel)" stroke-width="3.5" filter="url(#coreDropShadow)"/>
    
    <!-- Concentric Machined Texture Grooves -->
    <circle cx="256" cy="256" r="144" fill="none" stroke="#ffffff" stroke-width="0.75" stroke-opacity="0.12"/>
    <circle cx="256" cy="256" r="132" fill="none" stroke="#ffffff" stroke-width="0.5" stroke-opacity="0.08"/>
    <circle cx="256" cy="256" r="120" fill="none" stroke="#ffffff" stroke-width="0.5" stroke-opacity="0.06"/>
    <circle cx="256" cy="256" r="95" fill="none" stroke="#ffffff" stroke-width="0.5" stroke-opacity="0.05"/>
  </g>

  <!-- 4. Top BSF Monogram Lettering -->
  <g id="bsf-top-stencil" transform="translate(256, 160)" style="filter: drop-shadow(0px 2px 3px rgba(0,0,0,0.8));">
    <!-- "B" - Athletic Stencil Cut -->
    <g transform="translate(-56, 0)">
      <!-- Left Stem -->
      <rect x="0" y="-15" width="6" height="30" rx="1.5" fill="#FFFFFF"/>
      <!-- Top Loop -->
      <path d="M 6 -15 L 18 -15 Q 26 -15 26 -7 Q 26 0 18 0 L 6 0" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="square"/>
      <!-- Bottom Loop -->
      <path d="M 6 0 L 20 0 Q 28 0 28 7.5 Q 28 15 20 15 L 6 15" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="square"/>
    </g>

    <!-- "S" - Athletic Stencil Cut -->
    <g transform="translate(-7, 0)">
      <path d="M 22 -11 Q 12 -15 4 -15 Q -10 -15 -10 -6 Q -10 1 2 3 L 8 4 Q 22 7 22 14 Q 22 21 8 21 Q -2 21 -12 17"
            fill="none" stroke="#FFFFFF" stroke-width="5.5" stroke-linecap="square"/>
    </g>

    <!-- "F" - Athletic Stencil Cut -->
    <g transform="translate(30, 0)">
      <rect x="0" y="-15" width="6" height="30" rx="1.5" fill="#FFFFFF"/>
      <rect x="6" y="-15" width="22" height="5" fill="#FFFFFF"/>
      <rect x="6" y="-3" width="16" height="5" fill="#FFFFFF"/>
    </g>
  </g>

  <!-- 5. Horizontal Barbell & Weights (Flanking the Centerpiece) -->
  <g id="barbell-plates" filter="url(#coreDropShadow)">
    <!-- Left Weight Plates (Ribbed Olympic Plate Stack) -->
    <g id="left-plates" transform="translate(94, 256)">
      <!-- Base Plate Silhouette -->
      <rect x="-30" y="-64" width="46" height="128" rx="6" fill="#18181b" stroke="#09090b" stroke-width="2"/>
      <!-- Plate 1 -->
      <rect x="-28" y="-62" width="12" height="124" rx="4" fill="url(#weightRibGrad)"/>
      <line x1="-22" y1="-56" x2="-22" y2="56" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.4"/>
      <!-- Plate 2 -->
      <rect x="-14" y="-60" width="13" height="120" rx="4" fill="url(#weightRibGrad)"/>
      <line x1="-8" y1="-54" x2="-8" y2="54" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.4"/>
      <!-- Plate 3 -->
      <rect x="1" y="-58" width="13" height="116" rx="4" fill="url(#weightRibGrad)"/>
      <line x1="7" y1="-52" x2="7" y2="52" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.4"/>
      <!-- Collar -->
      <rect x="15" y="-18" width="8" height="36" rx="2" fill="url(#chromeBevel)" stroke="#18181b" stroke-width="1"/>
      <!-- Horizontal Connecting Bar -->
      <rect x="23" y="-6" width="34" height="12" rx="2" fill="url(#plateBarbellGrad)" stroke="#18181b" stroke-width="1"/>
    </g>

    <!-- Right Weight Plates (Ribbed Olympic Plate Stack) -->
    <g id="right-plates" transform="translate(418, 256)">
      <!-- Base Plate Silhouette -->
      <rect x="-16" y="-64" width="46" height="128" rx="6" fill="#18181b" stroke="#09090b" stroke-width="2"/>
      <!-- Plate 1 -->
      <rect x="16" y="-62" width="12" height="124" rx="4" fill="url(#weightRibGrad)"/>
      <line x1="22" y1="-56" x2="22" y2="56" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.4"/>
      <!-- Plate 2 -->
      <rect x="1" y="-60" width="13" height="120" rx="4" fill="url(#weightRibGrad)"/>
      <line x1="7" y1="-54" x2="7" y2="54" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.4"/>
      <!-- Plate 3 -->
      <rect x="-14" y="-58" width="13" height="116" rx="4" fill="url(#weightRibGrad)"/>
      <line x1="-8" y1="-52" x2="-8" y2="52" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.4"/>
      <!-- Collar -->
      <rect x="-23" y="-18" width="8" height="36" rx="2" fill="url(#chromeBevel)" stroke="#18181b" stroke-width="1"/>
      <!-- Horizontal Connecting Bar -->
      <rect x="-57" y="-6" width="34" height="12" rx="2" fill="url(#plateBarbellGrad)" stroke="#18181b" stroke-width="1"/>
    </g>
  </g>

  <!-- 6. Iconic Metallic Infinity Loop Centerpiece (Barbell Center Motif) -->
  <g id="infinity-centerpiece" filter="url(#coreDropShadow)">
    <!-- Deep Drop Shadow under Infinity Strand -->
    <path d="M 256 256 
             C 214 204, 150 204, 150 256 
             C 150 308, 214 308, 256 256 
             C 298 204, 362 204, 362 256 
             C 362 308, 298 308, 256 256 Z"
          fill="none" stroke="#000000" stroke-width="24" stroke-opacity="0.75" stroke-linecap="round"/>

    <!-- Base Solid Metallic Strand -->
    <path d="M 256 256 
             C 214 204, 150 204, 150 256 
             C 150 308, 214 308, 256 256 
             C 298 204, 362 204, 362 256 
             C 362 308, 298 308, 256 256 Z"
          fill="none" stroke="#27272a" stroke-width="19" stroke-linecap="round"/>

    <!-- Brushed Chrome / Silver Main Body -->
    <path d="M 256 256 
             C 214 204, 150 204, 150 256 
             C 150 308, 214 308, 256 256 
             C 298 204, 362 204, 362 256 
             C 362 308, 298 308, 256 256 Z"
          fill="none" stroke="url(#chromeBevel)" stroke-width="15" stroke-linecap="round"/>

    <!-- Top Highlight Bevel Strand (3D curvature) -->
    <path d="M 256 256 
             C 214 202, 152 202, 152 254
             M 256 256
             C 298 202, 360 202, 360 254"
          fill="none" stroke="url(#infinityGradTop)" stroke-width="5" stroke-linecap="round" stroke-opacity="0.9"/>

    <!-- Bottom Shading Bevel Strand -->
    <path d="M 152 258
             C 152 308, 214 308, 256 256
             M 256 256
             C 298 308, 360 308, 360 258"
          fill="none" stroke="url(#infinityGradBottom)" stroke-width="3" stroke-linecap="round" stroke-opacity="0.7"/>

    <!-- Center Overlap 3D Cutout to show natural metal crossing -->
    <!-- The strand running from Top-Right through Center to Bottom-Left crosses over with highlight -->
    <path d="M 284 220 
             C 268 240, 244 272, 228 292"
          fill="none" stroke="url(#chromeBevel)" stroke-width="15" stroke-linecap="round"
          style="filter: drop-shadow(2px 3px 4px rgba(0,0,0,0.85));"/>
    <path d="M 284 220 
             C 268 240, 244 272, 228 292"
          fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-opacity="0.75"/>

    <!-- Horizontal Bar Joint Nubs -->
    <circle cx="152" cy="256" r="8" fill="url(#chromeBevel)" stroke="#18181b" stroke-width="1.5"/>
    <circle cx="360" cy="256" r="8" fill="url(#chromeBevel)" stroke="#18181b" stroke-width="1.5"/>
  </g>
</svg>`;
}

async function buildAll() {
  console.log('Generating Black Stone Fitness emblem assets matching uploaded image...');
  const svgContent = generateEmblemSvg();

  const publicDir = path.join(__dirname, '../public');
  const distDir = path.join(__dirname, '../dist');

  // Save SVGs
  const svgTargets = [
    path.join(publicDir, 'black_stone_fitness_emblem.svg'),
    path.join(publicDir, 'favicon.svg'),
    path.join(publicDir, 'logo.svg'),
    path.join(distDir, 'black_stone_fitness_emblem.svg'),
    path.join(distDir, 'favicon.svg'),
    path.join(distDir, 'logo.svg')
  ];

  for (const target of svgTargets) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, svgContent, 'utf8');
    console.log(`Saved: ${target}`);
  }

  // Render PNGs and favicon assets via sharp
  const svgBuffer = Buffer.from(svgContent);

  const pngSizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'logo.png', size: 512 }
  ];

  for (const item of pngSizes) {
    const pngBuf = await sharp(svgBuffer)
      .resize(item.size, item.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(publicDir, item.name), pngBuf);
    fs.writeFileSync(path.join(distDir, item.name), pngBuf);
    console.log(`Rendered: ${item.name} (${item.size}x${item.size})`);
  }

  // Generate favicon.ico from 32x32 png
  const icoBuf = await sharp(svgBuffer)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);
  fs.writeFileSync(path.join(distDir, 'favicon.ico'), icoBuf);
  console.log('Rendered: favicon.ico');

  console.log('All Black Stone Fitness emblem logo and favicon assets built successfully!');
}

buildAll().catch((err) => {
  console.error('Error building emblem assets:', err);
  process.exit(1);
});
