# Resume Document Build

## What This App Is

A general HTML-to-PDF resume builder that can generate print-ready PDFs and provide a clean, deterministic HTML template for agentic resume workflows. It acts as a visual and structural scaffold designed for both human customization and automated AI pipelines.

You can access the app at https://resume-build.vernard.net/app

---

## Why I Created It

I originally needed a robust, reliable HTML template for agentic processes. Language models excel at generating structured semantic HTML, but they often struggle with arbitrary coordinates, page-break math, and raw PDF generation.

Building on that foundation, I turned it into a full app capable of previewing, customizing, fine-tuning layout density, and exporting both standalone web assets and high-fidelity PDFs.

---

## Using with AI Agents (Claude, ChatGPT, etc.)

To use this template with Claude, ChatGPT, or other AI agents:

1. **Export the Assets**:
   - Download the standalone package via the **HTML Build Package (.zip)** option in the app, or run:

     ```bash
     npm run export:html
     ```

2. **Make Files Accessible to Your Agent**:
   - Unzip or copy the exported files (`resume.html`, `resume.css`, `assets/images/`, and `assets/fonts/`) into a directory, workspace, or project knowledge base where your agent has read/write access (e.g., a Claude Project, ChatGPT workspace, or local agent environment).
3. **Agent Prompting & Generation**:
   - Direct the agent to inspect `resume.html` and `resume.css`.
   - Have the agent update the semantic content slots (`#header`, `#summary`, `#skills`, `#experience`, `#education`) with your career history while preserving class structures and layout rules.
   - Because the fonts and vector SVG assets are local and self-contained, the agent's output can be rendered or converted to PDF without broken external dependencies or network calls.

---

## Features

### Export Options

- **HTML Build Package (.zip)**: Exports a self-contained bundle with `resume.html`, `resume.css`, offline vector SVG sprites, and local WOFF2 variable fonts.
- **1-Page Executive PDF (Letter & A4)**: Generates a calibrated single-page PDF optimized for US Letter (`8.5" × 11"`) or ISO A4 (`210 × 297mm`).
- **2-Page Complete PDF (Letter & A4)**: Generates a balanced 2-page chronological narrative PDF with continuation headers.
- **Browser Print / Save PDF**: Direct system print dialog integration (`Cmd+P` / `Ctrl+P`) with pre-configured print media styles.
- **ATS Plain-Text Export (.txt)**: Instant copy and download of clean, pre-parsed, applicant-tracking-system-friendly plain text.

### Themes & Color Palettes

- **House Bronze & Ink (Default)**: Deep `#231F20` ink paired with warm `#594B2F` bronze accents.
- **Federal Crimson & Navy**: Classic `#111827` ink with `#910045` crimson accents and `#1E3A8A` navy styling.
- **Obsidian & Emerald**: Contemporary `#0F172A` ink with rich `#0F766E` teal/emerald highlights.
- **Classic Monochrome**: High-contrast, clean `#000000` ink and neutral slate grays.

### Layout & Sizing Modes

- **Dual Paper Geometries**: Supports both **US Letter** (`8.5" × 11"`) and **ISO A4** (`210 × 297mm`) with exact page budgets and print margins.
- **Page Configurations**: Switch between **1-Page Compact** (strict executive limit) and **2-Page Complete** (expanded narrative).

### Typography Pairings

- **Playfair + Rubik (House Style)**: Editorial serif headlines paired with clean geometric sans-serif body text.
- **Playfair + System Sans**: Editorial serif headlines with system native sans-serif fonts.
- **Rubik + Rubik (Modern Sans)**: Modern, all-sans-serif presentation.

### Density & Fine-Tuning Controls

- **Density Presets**: Quick switching between `Normal`, `Compact`, and `Relaxed` layouts.
- **Density Fine-Tuner**: Popover controls to adjust CSS tokens (`--body-size`, `--section-gap`, `--role-gap`) in real-time to avoid awkward page overflows.

### Interactive Studio Utilities

- **Live Inline Editing**: Edit resume text directly in the browser with automatic local storage persistence.
- **Print Guides**: Toggle visual margin overlays to preview exact printable boundaries.
- **Target Persona Presets**: Quick-switch baseline content profiles (*Hybrid UX / Frontend*, *Accessibility & WCAG Lead*, *Federal & Cleared Defense*).

---

## Feedback & Contact

For feedback, questions, or collaboration:

- **Contact Form**: [vernard.net/contact](https://vernard.net/contact)
- **Email**: [team@logias.org](mailto:team@logias.org)

---

## License

MIT License. Copyright (c) 2026 Vernard Mercader. See the [LICENSE](file:///System/Volumes/Data/repos/resume-document-build/LICENSE) file for details.
