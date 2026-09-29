#!/usr/bin/env node

/**
 * Deterministic PDF Exporter using Headless Chrome
 * Supports both US Letter (8.5" x 11") and ISO A4 (210 x 297mm) pagination,
 * single-page executive and 2-page complete layouts, and density token tuning.
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = resolve(__dirname, 'resume-build/assets/documents');
if (!existsSync(DOCS_DIR)) {
  mkdirSync(DOCS_DIR, { recursive: true });
}

const CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser'
];

let chromeBin = CHROME_PATHS.find(p => existsSync(p));

if (!chromeBin) {
  console.error('Error: Google Chrome or Chromium binary not found.');
  process.exit(1);
}

// Parse CLI Arguments
const args = process.argv.slice(2);

// Page Mode: 1 (executive) or 2 (complete)
let pageMode = '1';
if (args.includes('--page')) {
  pageMode = args[args.indexOf('--page') + 1] || '1';
} else {
  const match = args.find(a => a.startsWith('--page='));
  if (match) pageMode = match.split('=')[1];
}

// Paper Size: letter or a4
let paperFormat = 'letter';
if (args.includes('--paper')) {
  paperFormat = args[args.indexOf('--paper') + 1]?.toLowerCase() || 'letter';
} else {
  const match = args.find(a => a.startsWith('--paper='));
  if (match) paperFormat = match.split('=')[1].toLowerCase();
}
if (!['letter', 'a4'].includes(paperFormat)) {
  paperFormat = 'letter';
}

// Density Token Preset: normal, compact, relaxed
let density = 'normal';
if (args.includes('--density')) {
  density = args[args.indexOf('--density') + 1]?.toLowerCase() || 'normal';
} else {
  const match = args.find(a => a.startsWith('--density='));
  if (match) density = match.split('=')[1].toLowerCase();
}

const is2Page = pageMode === '2';
const targetLayout = is2Page ? '2page' : '1page';

console.log(`\n=== Resume PDF Exporter ===`);
console.log(`Using Chrome: ${chromeBin}`);
console.log(`Layout Mode : ${targetLayout.toUpperCase()} (${is2Page ? '2-Page Narrative' : '1-Page Executive'})`);
console.log(`Paper Format: ${paperFormat.toUpperCase()} (${paperFormat === 'a4' ? '210 × 297mm' : '8.5" × 11"'})`);
console.log(`Density     : ${density}`);

// Determine Output Filenames
let primaryPdfName = '';
let aliasPdfName = '';

if (paperFormat === 'a4') {
  primaryPdfName = is2Page ? 'vmercader-resume-complete-a4.pdf' : 'vmercader-resume-executive-a4.pdf';
} else {
  primaryPdfName = is2Page ? 'vmercader-resume-complete.pdf' : 'vmercader-resume-executive.pdf';
  aliasPdfName = is2Page ? 'vmercader-resume-complete-letter.pdf' : 'vmercader-resume-executive-letter.pdf';
}

const outputPdfPath = resolve(DOCS_DIR, primaryPdfName);

// Stage HTML file with exact attributes and @page overrides
const sourceHtml = readFileSync(resolve(__dirname, 'index.html'), 'utf-8');

let stagedHtml = sourceHtml
  .replace(/data-layout="[^"]*"/, `data-layout="${targetLayout}"`)
  .replace(/data-paper="[^"]*"/, `data-paper="${paperFormat}"`)
  .replace(/data-density="[^"]*"/, `data-density="${density}"`);

// Ensure attributes are present if not found
if (!stagedHtml.includes(`data-paper=`)) {
  stagedHtml = stagedHtml.replace('<html ', `<html data-paper="${paperFormat}" `);
}
if (!stagedHtml.includes(`data-density=`)) {
  stagedHtml = stagedHtml.replace('<html ', `<html data-density="${density}" `);
}

// Inject strict @page directive for headless print engine
const pageRuleInjection = `
  <style id="headless-print-override">
    @page {
      size: ${paperFormat === 'a4' ? 'a4' : 'letter'} portrait !important;
      margin: 0 !important;
    }
  </style>
</head>`;

stagedHtml = stagedHtml.replace('</head>', pageRuleInjection);

const tempHtmlPath = resolve(__dirname, `.temp-print-${targetLayout}-${paperFormat}.html`);
writeFileSync(tempHtmlPath, stagedHtml, 'utf-8');

try {
  console.log(`Rendering ${targetLayout.toUpperCase()} (${paperFormat.toUpperCase()}) to ${primaryPdfName}...`);

  // Headless Chrome command with zero margins and CSS @page honor
  const cmd = `"${chromeBin}" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${outputPdfPath}" "file://${tempHtmlPath}"`;
  
  execSync(cmd, { stdio: 'inherit' });

  if (existsSync(outputPdfPath)) {
    console.log(`\n✅ Successfully generated: ${primaryPdfName}`);
    console.log(`Path: ${outputPdfPath}`);

    // If Letter, copy to letter alias as well for clear pairing
    if (aliasPdfName) {
      const aliasPath = resolve(DOCS_DIR, aliasPdfName);
      copyFileSync(outputPdfPath, aliasPath);
      console.log(`✅ Also mirrored to: ${aliasPdfName}`);
    }
    console.log('');
  } else {
    console.error(`Failed to produce ${outputPdfPath}`);
  }
} catch (err) {
  console.error('Error executing headless Chrome:', err);
} finally {
  // Clean up temporary staged file
  try {
    if (existsSync(tempHtmlPath)) {
      execSync(`rm "${tempHtmlPath}"`);
    }
  } catch (e) {}
}
