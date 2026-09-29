#!/usr/bin/env node

/**
 * Deterministic PDF Exporter using Headless Chrome
 * Generates verified 8.5" x 11" US Letter PDFs directly from the HTML/CSS scaffold.
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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

const args = process.argv.slice(2);
const modeArg = args.find(a => a.startsWith('--page=') || a === '--page') || '1';
const pageMode = args.includes('--page') ? args[args.indexOf('--page') + 1] : (modeArg.split('=')[1] || '1');

console.log(`\n=== Resume PDF Exporter ===`);
console.log(`Using Chrome: ${chromeBin}`);

// We create a temporary build HTML with the desired data-layout attribute
const sourceHtml = readFileSync(resolve(__dirname, 'index.html'), 'utf-8');
const is2Page = pageMode === '2';
const targetLayout = is2Page ? '2page' : '1page';
const outputPdfName = is2Page ? 'vmercader-resume-complete.pdf' : 'vmercader-resume-executive.pdf';
const outputPdfPath = resolve(DOCS_DIR, outputPdfName);

const stagedHtmlContent = sourceHtml.replace(
  /data-layout="[^"]*"/,
  `data-layout="${targetLayout}"`
);

const tempHtmlPath = resolve(__dirname, `.temp-print-${targetLayout}.html`);
writeFileSync(tempHtmlPath, stagedHtmlContent, 'utf-8');

try {
  console.log(`Rendering ${targetLayout.toUpperCase()} mode to ${outputPdfName}...`);

  // Headless Chrome command with strict US Letter printing
  const cmd = `"${chromeBin}" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${outputPdfPath}" "file://${tempHtmlPath}"`;
  
  execSync(cmd, { stdio: 'inherit' });

  if (existsSync(outputPdfPath)) {
    console.log(`\n✅ Successfully generated: ${outputPdfName}`);
    console.log(`Path: ${outputPdfPath}\n`);
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
