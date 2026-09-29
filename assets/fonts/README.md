# Offline Variable Font Files Directory

This folder (`assets/fonts/`) contains self-hosted, airgapped **WOFF2** variable font files for the resume typography.
Zero network requests are made to any remote font CDN or Google Fonts API.

## Active Fonts

### 1. Playfair (Display Serif)
- **`Playfair-Variable.woff2`** (Variable Weight: 400–700, Normal)
- **`Playfair-Italic-Variable.woff2`** (Variable Weight: 400–700, Italic)
- **CSS Family**: `'Playfair'`, `'Playfair Display'`, Georgia, serif
- **Optimization**: Extra axes (`opsz` pinned to 12pt, `wdth` pinned to 100/Normal) trimmed via `fonttools varLib.instancer` with `wght=400:700`, subsetted to Latin + Latin-ext + typographic symbols, and compressed via `woff2_compress`.

### 2. Rubik (Body Sans)
- **`Rubik-Variable.woff2`** (Variable Weight: 400–700, Normal)
- **`Rubik-Italic-Variable.woff2`** (Variable Weight: 400–700, Italic)
- **CSS Family**: `'Rubik'`, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Optimization**: Weight axis trimmed to `wght=400:700` via `fonttools varLib.instancer`, subsetted to Latin + Latin-ext + typographic symbols, and compressed via `woff2_compress`.

## CSS `@font-face` Integration

`resume.css` binds these fonts directly via:
```css
@font-face {
  font-family: 'Playfair';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: local('Playfair'),
       local('Playfair Regular'),
       local('Playfair Display'),
       url('assets/fonts/Playfair-Variable.woff2') format('woff2');
}
```

The `local(...)` declarations ensure that if the font is installed in the host OS (e.g., macOS Font Book / `~/Library/Fonts`), it is utilized immediately; otherwise, the bundled offline WOFF2 file is loaded deterministically.
