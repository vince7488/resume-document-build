# resume-document-build

> **A deterministic, print-ready HTML and CSS scaffold engineered as the precision render target for agentic AI resume pipelines and executive human review.**

Language models struggle with arbitrary coordinates and raw PDF generation, but they handle semantic HTML with precision. This repository gives an agent a rock-solid visual foundation: a zero-dependency, CSS paged-media layout backed by local fonts and vector assets.

It treats the document not as a blank canvas, but as a strict typographic grid tuned for **Letter and A4 pagination**. The agent never calculates margins, page-break mathematics, or layout bugs. It synthesizes career history, populates semantic slots, and lets the browser's native print engine do the heavy lifting.

---

## ⚙️ How It Works

1. **Data structuring**: The agent parses unstructured work history, formats accomplishments around action verbs, and arranges the data into structured markup matching the template hierarchy.
2. **Markup injection**: The agent populates target DOM slots (`#experience`, `#education`, `#skills`). Content slots are bounded by strict CSS rules to maintain visual balance regardless of how verbose the model gets.
3. **Density tuning**: Layout density runs on CSS custom properties. If an agent detects content spilling onto an unwanted second page, it tweaks a single root token (`--body-size`, `--section-gap`) rather than rewriting styles.
4. **Headless print**: Headless Chromium prints the final document directly to PDF via standard print flags (`printBackground: true`, zero margins, paper size set via CSS `@page`).

---

## 🏛️ Why This Architecture

- **Zero Network Requests**: Local typography and local SVG sprites guarantee zero network requests during rendering, making headless execution fast, reliable, and deterministic in any air-gapped or CI/CD environment.
- **Automated Split Point & Anti-Orphan Controls**: Page break rules handle the split points: entries use `break-inside: avoid` to keep job titles tied to their dates and bullets, while heading orphan controls (`break-after: avoid`, `orphans: 3`, `widows: 3`) prevent lone section headers at the bottom of a page. You get clean typographic hierarchy out of the box, fully decoupled from agent logic.
- **Dual Paper Geometry**: Native CSS `@page` declarations and calibrated screen viewports tailored for standard North American **US Letter (8.5" × 11")** and international **ISO A4 (210 × 297mm)**.

---

## 🌟 Highlights

- **Dual Paper Sizing Engines**:
  - **US Letter (`8.5" × 11"`)**: `816px × 1056px` screen canvas, `1056px` target budget.
  - **ISO A4 (`210mm × 297mm`)**: `794px × 1123px` screen canvas, `1123px` target budget.
- **Target Semantic DOM Slots**:
  - `#header`: Candidate identity, clearance badge, contact meta.
  - `#summary`: High-density executive narrative bounded with overflow containment.
  - `#skills`: Fixed-category 4-quadrant competency grid.
  - `#experience`: Flagship employment roles with action verbs and metrics.
  - `#education`: Degree programs, certifications, and active security clearance credentials.
- **Density Tuning Tokens**:
  - Control layout height dynamically via root CSS tokens: `--body-size`, `--section-gap`, `--role-gap`, `--bullet-gap`.
  - Presets: `compact`, `normal` (default), and `relaxed`.
- **Zero Stray Page Guarantees**: Eliminates phantom trailing blank pages in browser print and headless render engines.
- **Dual Layout Engines**:
  - **1-Page Compact (Executive)**: Strict single-page layout fitted to exact sheet limits with zero overflow.
  - **2-Page Complete (Narrative)**: Comprehensive career history spanning two balanced sheets with continuation headers.
- **Multi-Palette Switcher**:
  - **House Bronze & Ink** (Default): `#231F20` ink, `#594B2F` bronze accent, `#E4DEE1` hairline
  - **Federal Navy & Crimson**: `#111827` ink, `#910045` crimson, `#1E3A8A` navy
  - **Obsidian & Emerald**: `#0F172A` ink, `#0F766E` teal accent
  - **Classic Monochrome**: `#000000` ink, neutral slate grays
- **Interactive Studio Workspace**:
  - 🖨️ **1-Click Print & Multi-Format PDF Export**: Direct headless compilation or `window.print()` triggers.
  - 📏 **Print-Safe Margin Guides**: Visual overlay toggling exact printable bounding boxes for both Letter and A4.
  - ✏️ **Live Inline Editing**: Modify any content directly on paper with automatic local storage persistence.
  - 📋 **ATS Plain-Text Drawer**: Instant 1-click copy of clean, pre-parsed ATS plain text complying with recruitment parsing standards.
  - 🎯 **Target Persona Presets**: Instantly adjusts positioning between *Hybrid UX/Frontend*, *Accessibility & WCAG Lead*, and *Federal Cleared Defense (TS/SCI)*.

---

## 🚀 Quick Start & Export Workflows

### 1. View & Customize in Interactive Studio

Launch the interactive print studio locally:

```bash
# Using Node.js serve (or npm start)
npm start
```

Then open `http://localhost:3000` in your browser.

### 2. Export Workflows via npm CLI

You can export the standalone build package and high-fidelity PDFs directly using npm:

```bash
# 📦 Export the standalone "resume-build" folder (HTML, CSS, SVG sprite, offline fonts)
npm run export:html

# 📄 Export 1-Page Executive PDFs (saved to resume-build/assets/documents/)
npm run export:pdf:1page:letter   # US Letter (8.5" × 11")
npm run export:pdf:1page:a4       # ISO A4 (210 × 297mm)

# 📑 Export 2-Page Complete Narrative PDFs (saved to resume-build/assets/documents/)
npm run export:pdf:2page:letter   # US Letter (8.5" × 11")
npm run export:pdf:2page:a4       # ISO A4 (210 × 297mm)

# ⚡ Run all exports in one command (HTML build + all 4 PDF variations)
npm run export:all
```

### 3. Export via Web Interface ("Export As" Dropdown)

From the studio topbar, click the **Export As** dropdown menu for instant 1-click downloads:

- **📦 HTML Build Package (.zip)**: Client-side dynamic ZIP generator (via JSZip) downloading `resume-build.zip` containing the full folder hierarchy (`resume.html`, `resume.css`, `assets/images/sprite.svg`, `assets/fonts/`).
- **📄 1-Page Executive PDF (Letter)**: Calibrated single-page US Letter PDF download.
- **📄 1-Page Executive PDF (A4)**: Calibrated single-page ISO A4 PDF download.
- **📑 2-Page Complete PDF (Letter)**: Full 2-page chronological US Letter PDF download.
- **📑 2-Page Complete PDF (A4)**: Full 2-page chronological ISO A4 PDF download.
- **🖨️ Browser Print / Save PDF...**: Opens system print dialog with `@page` print rules pre-applied (`Cmd+P`).
- **📋 ATS Plain Text (.txt)**: Instant download of the machine-parsed ATS plain-text file.

---

## 🖨️ In-Browser Printing Instructions (Chrome / Safari / Edge)

When printing directly from the browser window (`Cmd+P` / `Ctrl+P` or clicking **Print / Save PDF**):

1. **Destination**: Select `Save as PDF` (or your physical printer).
2. **Paper Size**: `Letter` or `A4` matching your active studio selection.
3. **Margins**: Set to `None` or `Default` (the scaffold applies exact print margins via CSS).
4. **Options**:
   - ✅ **Background graphics**: **CHECKED** (required for top rule, accent square bullet markers, and headers).
   - ❌ **Headers and footers**: **UNCHECKED** (prevents browser URL/date stamps).

---

## 📐 Layout Specifications & Metrics

All measurements are calibrated to standard 96 DPI screen rasterization and physical paper printing:

| Metric | US Letter (8.5" × 11") | ISO A4 (210 × 297mm) | Notes |
| :--- | :--- | :--- | :--- |
| **Physical Dimensions** | `8.5 in × 11.0 in` | `210 mm × 297 mm` | Standard international & domestic sizes |
| **Canvas Pixels (96 DPI)** | `816 px × 1056 px` | `794 px × 1123 px` | Exact sheet viewport container |
| **Top Margin** | `0.50 in` (`48 px`) | `12 mm` (`45.3 px`) | 1-page calibrated: `0.42in` / `10.5mm` |
| **Bottom Margin** | `0.46 in` (`44.2 px`) | `11 mm` (`41.6 px`) | 1-page calibrated: `0.40in` / `10mm` |
| **Side Margins** | `0.50 in` (`48 px`) each | `12 mm` (`45.3 px`) each | Lowest safe print standard |
| **Printable Width** | `7.50 in` (`720 px`) | `186 mm` (`703.4 px`) | Bounded content region |
| **Target Height Budget** | `1056 px` | `1123 px` | Monitored live by studio HUD |

### Typographic Hierarchy & CSS Custom Property Tokens

- **`--body-size`**: Default `8.8pt` (`11.7px`), Public Sans Regular (400)
- **`--body-line-height`**: Default `1.38` (compact `1.32`, relaxed `1.44`)
- **`--section-gap`**: Default `10px` (1-page compact `7px`, relaxed `14px`)
- **`--role-gap`**: Default `7px` (1-page compact `5px`, relaxed `10px`)
- **`--bullet-gap`**: Default `2.2px` (1-page compact `1.4px`, relaxed `3.2px`)
- **Candidate Name**: `23.5pt` (`31px`), Spectral SemiBold (600), letter-spacing `-0.015em`
- **Tagline**: `9.5pt` (`12.6px`), Spectral Medium (500) Italic, accent color
- **Contact Line**: `8.0pt` (`10.6px`), Public Sans Medium (500), tracking `0.025em`
- **Section Label**: `calc(var(--body-size) * 0.91)`, Public Sans Bold (700) UPPERCASE, tracking `0.14em`
- **Role Position**: `calc(var(--body-size) * 1.16)`, Spectral SemiBold (600), ink color
- **Employer / Org**: `calc(var(--body-size) * 0.98)`, Public Sans SemiBold (600), accent color
- **Dates & Location**: `calc(var(--body-size) * 0.86)` / `0.84`, Public Sans, right-aligned, uppercase tracking
- **Bullet Items**: `var(--body-size)`, line-height `var(--body-line-height)`; custom `3.5px` square marker

---

## 🤖 Agentic AI Integration Guide

This repository is designed to act as a **deterministic compile target** for AI agents:

1. **Input**:
   - Ingest target job descriptions and career history facts.
2. **Format Selection**:
   - Set `data-paper="letter"` or `data-paper="a4"`.
   - Set `data-layout="1page"` for single-page targets or `data-layout="2page"` for narrative targets.
3. **Markup Injection**:
   - Inject structured markup into target slots: `#header`, `#summary`, `#skills`, `#experience`, `#education`.
4. **Density Tuning**:
   - If the DOM height exceeds `1056px` (Letter) or `1123px` (A4), adjust `--body-size` (e.g. `8.4pt`) or `--section-gap` (e.g. `8px`) without modifying styles or layout logic.
5. **Headless Compilation**:
   - Run `node export-pdf.mjs --page <1|2> --paper <letter|a4>` to compile verified PDF artifacts.

---

## 📁 Repository & Export Structure

```text
resume-document-build/
├── index.html                 # Interactive Studio & Print Scaffold with target DOM slots
├── resume.css                 # Deterministic Print Stylesheet & Density Design Tokens
├── resume.js                  # Studio Controller, Density Fine-Tuning & HUD Sentinel
├── ats_resume.txt             # Plain-Text ATS Master Baseline
├── export-pdf.mjs             # Headless Chrome Automated PDF Exporter (Letter & A4)
├── export-html.mjs            # Standalone "resume-build" Folder Packager
├── package.json               # Scripts & Metadata
├── assets/
│   ├── images/
│   │   ├── sprite.svg         # Unified SVG Vector Sprite (zero network requests)
│   │   └── icon-*.svg         # Individual SVG icons & candidate brand logo
│   ├── fonts/                 # Offline TTF Font Directory (with naming README)
│   └── jszip.min.js           # Client-side dynamic ZIP packager
├── resume-build/              # 📦 Exported Distribution Folder (generated via npm or UI)
│   ├── resume.html            # Clean, standalone print/render target
│   ├── index.html             # Studio version with interactive controls
│   ├── resume.css             # Local stylesheet with offline @font-face hooks
│   ├── resume.js              # Interactivity & layout controller
│   ├── ats_resume.txt         # Pre-formatted ATS text version
│   └── assets/
│       ├── documents/         # Compiled PDF distribution files (Letter & A4)
│       ├── images/            # SVG vector assets & sprite.svg
│       └── fonts/             # Offline TTFs ready for air-gapped compilation
├── LICENSE                    # MIT License (Copyright 2026 Vernard Mercader)
└── README.md                  # Technical Architecture & Usage Manual
```

### 🔤 Offline Fonts Support

To use offline TrueType fonts without depending on Google Fonts CDN:

1. Place your `.ttf` files into `assets/fonts/`:
   - `Spectral-SemiBold.ttf`
   - `Spectral-MediumItalic.ttf`
   - `PublicSans-Regular.ttf`
   - `PublicSans-Medium.ttf`
   - `PublicSans-SemiBold.ttf`
   - `PublicSans-Bold.ttf`
2. `resume.css` automatically prioritizes `local(...)` and `url('assets/fonts/<filename>.ttf')` with graceful fallback to system fonts and Google Fonts.

---

## 📄 License

MIT License. Copyright (c) 2026 Vernard Mercader.
