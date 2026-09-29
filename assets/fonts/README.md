# Offline Font Files Directory

Place your offline TTF/OTF font files in this folder (`assets/fonts/`).
The CSS `@font-face` rules in `resume.css` will automatically prioritize these local font files over web fonts whenever present.

## Expected File Names

### 1. Spectral (Display Serif)
- `Spectral-Regular.ttf` (Weight: 400, Normal)
- `Spectral-Medium.ttf` (Weight: 500, Normal)
- `Spectral-SemiBold.ttf` (Weight: 600, Normal)
- `Spectral-Bold.ttf` (Weight: 700, Normal)
- `Spectral-Italic.ttf` (Weight: 400, Italic)
- `Spectral-SemiBoldItalic.ttf` (Weight: 600, Italic)

### 2. Public Sans (Federal / USWDS Body)
- `PublicSans-Regular.ttf` (Weight: 400, Normal)
- `PublicSans-Medium.ttf` (Weight: 500, Normal)
- `PublicSans-SemiBold.ttf` (Weight: 600, Normal)
- `PublicSans-Bold.ttf` (Weight: 700, Normal)
- `PublicSans-Italic.ttf` (Weight: 400, Italic)

### 3. Source Sans 3 (Commercial Body)
- `SourceSans3-Regular.ttf` (Weight: 400, Normal)
- `SourceSans3-SemiBold.ttf` (Weight: 600, Normal)
- `SourceSans3-Bold.ttf` (Weight: 700, Normal)
- `SourceSans3-Italic.ttf` (Weight: 400, Italic)
*(Or variable font `SourceSans3-VF.ttf`)*

### 4. Poppins (Modern Body)
- `Poppins-Regular.ttf` (Weight: 400, Normal)
- `Poppins-Medium.ttf` (Weight: 500, Normal)
- `Poppins-SemiBold.ttf` (Weight: 600, Normal)
- `Poppins-Bold.ttf` (Weight: 700, Normal)
- `Poppins-Italic.ttf` (Weight: 400, Italic)

---
*Note: If any font file is not present locally, `resume.css` automatically falls back to online Google Fonts or local system typography seamlessly.*
