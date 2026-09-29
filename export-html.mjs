#!/usr/bin/env node

/**
 * HTML Build Package Exporter
 * Bundles the resume into a self-contained "resume-build" directory with:
 * - resume.html (clean, standalone print target)
 * - index.html (interactive studio suite)
 * - resume.css (deterministic print stylesheet with offline font-face hooks)
 * - resume.js (studio controller & live editor)
 * - ats_resume.txt (ATS plain text)
 * - assets/
 *   - images/ (SVG icons and logos)
 *   - fonts/ (offline font directory ready for manual TTF injection)
 */

import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BUILD_DIR = resolve(__dirname, 'resume-build');
const ASSETS_DIR = join(BUILD_DIR, 'assets');
const IMAGES_DIR = join(ASSETS_DIR, 'images');
const FONTS_DIR = join(ASSETS_DIR, 'fonts');
const DOCS_DIR = join(ASSETS_DIR, 'documents');

console.log('\n=== Exporting HTML Resume Build ===');
console.log(`Target Directory: ${BUILD_DIR}`);

// 1. Create Directories
[BUILD_DIR, ASSETS_DIR, IMAGES_DIR, FONTS_DIR, DOCS_DIR].forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

// 2. Copy Image Assets (SVGs)
const srcImagesDir = resolve(__dirname, 'assets/images');
if (existsSync(srcImagesDir)) {
  const images = readdirSync(srcImagesDir);
  images.forEach(img => {
    copyFileSync(join(srcImagesDir, img), join(IMAGES_DIR, img));
    console.log(`  + assets/images/${img}`);
  });
}

// 3. Copy / Prepare Font Assets
const srcFontsDir = resolve(__dirname, 'assets/fonts');
if (existsSync(srcFontsDir)) {
  const fontFiles = readdirSync(srcFontsDir);
  fontFiles.forEach(f => {
    copyFileSync(join(srcFontsDir, f), join(FONTS_DIR, f));
    console.log(`  + assets/fonts/${f}`);
  });
}

// 3b. Copy jszip vendor script if present
const jszipSrc = resolve(__dirname, 'assets/jszip.min.js');
if (existsSync(jszipSrc)) {
  copyFileSync(jszipSrc, join(ASSETS_DIR, 'jszip.min.js'));
  console.log(`  + assets/jszip.min.js`);
}

// 4. Generate Clean Standalone resume.html (Render Target for WeasyPrint / Chrome)
const indexHtmlContent = readFileSync(resolve(__dirname, 'index.html'), 'utf-8');

// To create resume.html, we remove the studio-topbar and studio-hud for a pure print-ready document,
// while preserving the sheets, typography, and structure.
const cleanHtmlContent = indexHtmlContent
  .replace(/<!-- =+[\s\S]*?STUDIO WORKSPACE CONTROLS[\s\S]*?<\/header>/i, '')
  .replace(/<!-- Deterministic HUD[\s\S]*?<\/div>\s*<\/div>/i, '')
  .replace(/<button id="btn-edit-toggle"[\s\S]*?<\/button>/i, '')
  .replace(/class="sheet-badge no-print">PAGE \d · [^<]*<\/span>/g, '');

const resumeHtmlPath = join(BUILD_DIR, 'resume.html');
writeFileSync(resumeHtmlPath, cleanHtmlContent, 'utf-8');
console.log(`  + resume.html (clean render target)`);

// 5. Copy index.html, resume.css, resume.js, ats_resume.txt
copyFileSync(resolve(__dirname, 'index.html'), join(BUILD_DIR, 'index.html'));
console.log(`  + index.html (interactive studio)`);

copyFileSync(resolve(__dirname, 'resume.css'), join(BUILD_DIR, 'resume.css'));
console.log(`  + resume.css`);

copyFileSync(resolve(__dirname, 'resume.js'), join(BUILD_DIR, 'resume.js'));
console.log(`  + resume.js`);

if (existsSync(resolve(__dirname, 'ats_resume.txt'))) {
  copyFileSync(resolve(__dirname, 'ats_resume.txt'), join(BUILD_DIR, 'ats_resume.txt'));
  console.log(`  + ats_resume.txt`);
}

// 6. Summary of Build
console.log('\n✅ "resume-build" directory successfully created!');
console.log(`\nFolder structure:
resume-build/
  ├── resume.html        # Clean, pure print-ready render target
  ├── index.html         # Interactive studio with live layout/theme controls
  ├── resume.css         # Deterministic print stylesheet with offline font hooks
  ├── resume.js          # Studio interaction & layout sentinel
  ├── ats_resume.txt     # Formatted plain-text ATS master
  └── assets/
      ├── documents/     # Compiled PDF distribution files
      ├── images/        # Vector SVGs (logo, icons)
      └── fonts/         # Offline TTF font storage directory
`);
