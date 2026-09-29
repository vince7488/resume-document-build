# resume-document-build

> **A deterministic, print-ready HTML and CSS scaffold engineered as the precision render target for agentic AI resume pipelines and executive human review.**

Built for **US Letter (8.5" × 11")** dimensions with mathematical pagination guarantees, zero-margin print containers, anti-orphan typographic rules, and interactive studio workspace controls.

---

## 🌟 Highlights

- **Deterministic 8.5" × 11" Paper Sizing**: Calibrated precisely for 96 DPI screen and print rasterization (`816px × 1056px` per sheet).
- **Zero Stray Page Guarantees**: Eliminates phantom trailing blank pages in browser print and headless render engines.
- **Dual Layout Engines**:
  - **1-Page Compact (Executive)**: Strict single-page layout fitted to exactly 1056px (100% height) with zero overflow.
  - **2-Page Complete (Narrative)**: Comprehensive career history spanning two balanced sheets with seamless continuation headers.
- **Battle-Tested House Typography**:
  - **Display / Headings**: `Spectral` (Serif 500/600, letter-spacing `-0.012em`)
  - **Body Text**: `Public Sans` (Federal / USWDS standard) or `Source Sans 3` (Commercial) or `Poppins` (Modern)
- **Multi-Palette Switcher**:
  - **House Bronze & Ink** (Default): `#231F20` ink, `#594B2F` bronze accent, `#E4DEE1` hairline
  - **Federal Navy & Crimson**: `#111827` ink, `#910045` crimson, `#1E3A8A` navy
  - **Obsidian & Emerald**: `#0F172A` ink, `#0F766E` teal accent
  - **Classic Monochrome**: `#000000` ink, neutral slate grays
- **Live Height & Overflow HUD**: Real-time DOM pixel monitoring measuring each page's budget against the 1056px limit.
- **Interactive Studio Workspace**:
  - 🖨️ **1-Click Print & PDF Export**: Directly triggers `window.print()` with optimized `@page` rules.
  - ✏️ **Live Inline Editing**: Click `Live Edit` to modify any title, date, or bullet point directly on paper with automatic local storage persistence.
  - 📏 **Print-Safe Margin Guides**: Visual overlay toggling the exact `0.5in` top / `0.62in` sides / `0.46in` bottom printable bounding box.
  - 📋 **ATS Plain-Text Drawer**: Instant 1-click copy of clean, pre-parsed ATS plain text complying with recruitment parsing standards.
  - 🎯 **Target Persona Presets**: Instantly adjusts positioning between *Hybrid UX/Frontend*, *Accessibility & WCAG Lead*, and *Federal Cleared Defense (TS/SCI)*.

---

## 🚀 Quick Start

### 1. View in Browser
To launch the interactive print studio locally:

```bash
# Using Node.js serve
npx serve . -l 3000
```
Then open `http://localhost:3000` in your browser.

### 2. Export Directly to PDF (Headless Chrome)
No external heavy PDF tools required. Export directly using your local Google Chrome installation:

```bash
# Export 1-Page Executive PDF (vmercader-resume-executive.pdf)
npm run export-pdf:1page

# Export 2-Page Complete PDF (vmercader-resume-complete.pdf)
npm run export-pdf:2page
```

---

## 🖨️ In-Browser Printing Instructions (Chrome / Safari / Edge)

When printing directly from the browser window (`Cmd+P` / `Ctrl+P` or clicking **Print / Save PDF**):

1. **Destination**: Select `Save as PDF` (or your physical printer).
2. **Paper Size**: `Letter` (8.5 × 11 inches).
3. **Margins**: Set to `None` or `Default` (the scaffold applies exact print margins via CSS).
4. **Options**:
   - ✅ **Background graphics**: **CHECKED** (required for top rule and custom square bullet markers).
   - ❌ **Headers and footers**: **UNCHECKED** (prevents browser URL/date stamps).

---

## 📐 Layout Specifications & Metrics

All measurements are calibrated to standard US Letter at standard 96 DPI:

| Dimension | Physical | CSS Pixels |
| :--- | :--- | :--- |
| **Sheet Width** | `8.5 in` | `816 px` |
| **Sheet Height** | `11.0 in` | `1056 px` |
| **Top Margin** | `0.50 in` | `48 px` (1-page calibrated: `0.42in` / `40px`) |
| **Bottom Margin** | `0.46 in` | `44.2 px` (1-page calibrated: `0.40in` / `38px`) |
| **Side Margins** | `0.62 in` | `59.5 px` each |
| **Printable Width** | `7.26 in` | `697 px` |
| **Printable Height**| `10.04 in` | `963.8 px` |

### Typographic Hierarchy

- **Candidate Name**: `23.5pt` (`31px`), Spectral SemiBold (600), letter-spacing `-0.015em`
- **Tagline**: `9.5pt` (`12.6px`), Spectral Medium (500) Italic, accent color
- **Contact Line**: `8.0pt` (`10.6px`), Public Sans Medium (500), tracking `0.025em`
- **Section Label**: `8.0pt` (`10.6px`), Public Sans Bold (700) UPPERCASE, tracking `0.14em`, `1px` hairline underline
- **Body & Summary**: `9.2pt` (`12.2px`), Public Sans Regular (400), line-height `1.38`–`1.45`
- **Role Position**: `10.2pt` (`13.6px`), Spectral SemiBold (600), ink color
- **Employer / Organization**: `8.6pt` (`11.4px`), Public Sans SemiBold (600), accent color
- **Dates & Location**: `7.6pt` / `7.4pt`, Public Sans, right-aligned, uppercase tracking
- **Bullet Items**: `8.8pt` (`11.7px`), line-height `1.34`–`1.39`; custom `3.5px` accent square marker
- **Degree Titles**: `8.6pt` (`11.4px`), Public Sans SemiBold (600)

---

## 🤖 Agentic AI Integration Guide

This repository is designed to act as a **deterministic compile target** for AI agents generating tailored resumes:

1. **Input**:
   - Provide the job posting and target role requirements.
2. **Mode Determination**:
   - Choose `data-layout="1page"` for single-page target applications or `data-layout="2page"` for federal/comprehensive applications.
3. **Data Injection**:
   - Populate the semantic elements (`.tagline`, `.summary`, `.skill-grid`, `.role`, `.ec`).
4. **Validation Check**:
   - Run `node export-pdf.mjs --page <1|2>` to compile.
   - Inspect the HUD / height output to ensure content is `<= 1056px` per page.
5. **Artifact Output**:
   - Produces clean, selectable, tagged PDFs ready for human submission and ATS parsing.

---

## 📁 Repository Structure

```text
resume-document-build/
├── index.html                 # Interactive Studio & Print Scaffold
├── resume.css                 # Deterministic Print Stylesheet & Design Tokens
├── resume.js                  # Studio Logic, Live Editing, HUD Sentinel & ATS Modal
├── ats_resume.txt             # Plain-Text ATS Master Baseline
├── export-pdf.mjs             # Headless Chrome Automated PDF Exporter
├── package.json               # Scripts & Metadata
├── LICENSE                    # MIT License (Copyright 2026 Vernard Mercader)
└── README.md                  # Technical Architecture & Usage Manual
```

---

## 📄 License

MIT License. Copyright (c) 2026 Vernard Mercader.
