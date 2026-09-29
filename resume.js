/**
 * RESUME DOCUMENT BUILD: Interactive Print Studio Controller
 * Handles deterministic page budgeting, theme/font switching, 
 * persona presets, ATS text modal, and browser print triggers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM References
  const htmlEl = document.documentElement;
  const themeSelect = document.getElementById('theme-select');
  const fontSelect = document.getElementById('font-select');
  const personaSelect = document.getElementById('persona-select');
  const btn1Page = document.getElementById('btn-1page');
  const btn2Page = document.getElementById('btn-2page');
  const btnPrint = document.getElementById('btn-print');
  const btnEditToggle = document.getElementById('btn-edit-toggle');
  const btnGuidesToggle = document.getElementById('btn-guides-toggle');
  const btnAtsOpen = document.getElementById('btn-ats-open');
  const btnAtsClose = document.getElementById('btn-ats-close');
  const btnAtsCopy = document.getElementById('btn-ats-copy');
  const atsModal = document.getElementById('ats-modal');
  const atsTextarea = document.getElementById('ats-textarea');
  const hudPage1 = document.getElementById('hud-page-1');
  const hudPage2 = document.getElementById('hud-page-2');

  // Sheets
  const sheet1 = document.getElementById('sheet-1');
  const sheet2 = document.getElementById('sheet-2');

  // Persona Presets Data
  const personaData = {
    hybrid: {
      tagline: 'Hybrid UX Designer & Frontend UI Engineer · Active TS/SCI Clearance',
      summary: 'Hybrid UX Designer and Frontend UI Engineer with over 10 years of cross-functional experience delivering accessible, high-consequence digital products across defense, public-sector, and commercial platforms. Specialist in WCAG 2.1/2.2 AA & AAA compliance, Section 508 accessibility remediation, design system governance, and modern React/TypeScript architectures. Proven track record increasing operational task speed up to 54% in defense intelligence, lifting statewide platform engagement 346% for public health, and reducing production conversion friction for enterprise commercial brands.'
    },
    accessibility: {
      tagline: 'Lead Accessibility (WCAG / Section 508) Specialist & Design Systems Architect',
      summary: 'Specialist UX Accessibility Consultant and Design Systems Engineer with deep expertise in WCAG 2.1/2.2 AA & AAA compliance, Section 508 remediation, and assistive technology testing (screen readers, keyboard navigability, cognitive load). Proven track record leading accessibility transformations for DoD software factories, statewide public health systems, and commercial enterprises. Experienced in translating complex compliance audit registers into production-ready React, Angular, and USWDS component libraries.'
    },
    defense: {
      tagline: 'Cleared UI/UX Engineer (Active TS/SCI) · DevSecOps & Enterprise DoD Platforms',
      summary: 'Senior UI/UX Engineer holding active TS/SCI clearance with verified experience delivering secure, mission-critical user interfaces for the Department of Defense, U.S. Air Force (Platform One, Iron Bank, ShOC), and U.S. Coast Guard. Proven success modernizing defense web applications, migrating legacy architectures to Material UI and React TypeScript, establishing USWDS-derived design systems in SCIF environments, and reducing operator mission task completion times by up to 54%.'
    }
  };

  // --- Theme Controller ---
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      htmlEl.setAttribute('data-theme', e.target.value);
      localStorage.setItem('resume_theme', e.target.value);
    });
    const savedTheme = localStorage.getItem('resume_theme');
    if (savedTheme) {
      themeSelect.value = savedTheme;
      htmlEl.setAttribute('data-theme', savedTheme);
    }
  }

  // --- Font Controller ---
  if (fontSelect) {
    fontSelect.addEventListener('change', (e) => {
      htmlEl.setAttribute('data-font', e.target.value);
      localStorage.setItem('resume_font', e.target.value);
      setTimeout(checkPageOverflow, 150);
    });
    const savedFont = localStorage.getItem('resume_font');
    if (savedFont) {
      fontSelect.value = savedFont;
      htmlEl.setAttribute('data-font', savedFont);
    }
  }

  // --- Layout Mode Controller (1-Page vs 2-Page) ---
  function setLayoutMode(mode) {
    htmlEl.setAttribute('data-layout', mode);
    localStorage.setItem('resume_layout', mode);

    if (mode === '1page') {
      btn1Page.classList.add('active');
      btn2Page.classList.remove('active');
      document.body.classList.add('mode-1page');
      document.body.classList.remove('mode-2page');
    } else {
      btn2Page.classList.add('active');
      btn1Page.classList.remove('active');
      document.body.classList.add('mode-2page');
      document.body.classList.remove('mode-1page');
    }

    setTimeout(checkPageOverflow, 100);
  }

  if (btn1Page && btn2Page) {
    btn1Page.addEventListener('click', () => setLayoutMode('1page'));
    btn2Page.addEventListener('click', () => setLayoutMode('2page'));
    
    // Check if data-layout was pre-configured on html element
    const initialLayout = htmlEl.getAttribute('data-layout') || localStorage.getItem('resume_layout') || '1page';
    setLayoutMode(initialLayout);
  }

  // --- Persona Preset Controller ---
  if (personaSelect) {
    personaSelect.addEventListener('change', (e) => {
      const preset = personaData[e.target.value];
      if (preset) {
        const taglineEl = document.querySelector('.tagline');
        const summaryEls = document.querySelectorAll('.summary-text');
        
        if (taglineEl) taglineEl.textContent = preset.tagline;
        summaryEls.forEach(el => { el.textContent = preset.summary; });

        setTimeout(checkPageOverflow, 50);
      }
    });
  }

  // --- Margin Guides Toggle ---
  let guidesActive = false;
  if (btnGuidesToggle) {
    btnGuidesToggle.addEventListener('click', () => {
      guidesActive = !guidesActive;
      document.querySelectorAll('.sheet').forEach(sheet => {
        sheet.classList.toggle('show-guides', guidesActive);
      });
      btnGuidesToggle.classList.toggle('active', guidesActive);
    });
  }

  // --- Live Content Editing Toggle ---
  let isEditing = false;
  if (btnEditToggle) {
    btnEditToggle.addEventListener('click', () => {
      isEditing = !isEditing;
      document.body.classList.toggle('is-editing', isEditing);
      btnEditToggle.classList.toggle('active', isEditing);

      const editableTargets = document.querySelectorAll(
        '.name, .tagline, .contact, .summary, .sec-label, .pos, .org, .dates, .loc, ul.bullets li, .skill-cat, .skill-items, .deg, .meta'
      );

      editableTargets.forEach(el => {
        el.setAttribute('contenteditable', isEditing ? 'true' : 'false');
      });

      if (isEditing) {
        btnEditToggle.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
          Done Editing
        `;
      } else {
        btnEditToggle.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Live Edit
        `;
        // Save edits to localStorage
        const resumeContainer = document.querySelector('.document-viewport');
        if (resumeContainer) {
          localStorage.setItem('resume_user_edits', resumeContainer.innerHTML);
        }
      }
      checkPageOverflow();
    });

    // Restore saved edits if available
    const savedEdits = localStorage.getItem('resume_user_edits');
    if (savedEdits) {
      // Provide an unobtrusive option to restore or reset
      console.log('Found saved resume edits in localStorage.');
    }
  }

  // --- Deterministic Height & Overflow Sentinel ---
  function checkPageOverflow() {
    // 11 inches at 96 DPI = 1056px
    const TARGET_HEIGHT_PX = 1056;

    if (sheet1) {
      const scrollH1 = sheet1.scrollHeight;
      const pct1 = Math.round((scrollH1 / TARGET_HEIGHT_PX) * 100);
      if (hudPage1) {
        if (scrollH1 > TARGET_HEIGHT_PX) {
          hudPage1.innerHTML = `<span class="hud-dot warning"></span> Page 1: <strong style="color:#ef4444">${scrollH1}px / ${TARGET_HEIGHT_PX}px (${pct1}%) - OVERFLOW!</strong>`;
        } else {
          hudPage1.innerHTML = `<span class="hud-dot"></span> Page 1: <strong>${scrollH1}px / ${TARGET_HEIGHT_PX}px (${pct1}%) - Print Safe</strong>`;
        }
      }
    }

    if (sheet2 && htmlEl.getAttribute('data-layout') === '2page') {
      const scrollH2 = sheet2.scrollHeight;
      const pct2 = Math.round((scrollH2 / TARGET_HEIGHT_PX) * 100);
      if (hudPage2) {
        if (scrollH2 > TARGET_HEIGHT_PX) {
          hudPage2.innerHTML = `<span class="hud-dot warning"></span> Page 2: <strong style="color:#ef4444">${scrollH2}px / ${TARGET_HEIGHT_PX}px (${pct2}%) - OVERFLOW!</strong>`;
        } else {
          hudPage2.innerHTML = `<span class="hud-dot"></span> Page 2: <strong>${scrollH2}px / ${TARGET_HEIGHT_PX}px (${pct2}%) - Print Safe</strong>`;
        }
      }
    } else if (hudPage2) {
      hudPage2.innerHTML = `<span class="hud-dot" style="background:#6b7280;"></span> Page 2: <em>Single-Page Mode Active</em>`;
    }
  }

  // Run initial check and bind resize / mutation
  setTimeout(checkPageOverflow, 200);
  window.addEventListener('resize', checkPageOverflow);

  // Monitor DOM edits for live height recalculation
  const observer = new MutationObserver(checkPageOverflow);
  if (sheet1) observer.observe(sheet1, { childList: true, subtree: true, characterData: true });
  if (sheet2) observer.observe(sheet2, { childList: true, subtree: true, characterData: true });

  // --- Export As Dropdown & Actions ---
  const btnExportDropdown = document.getElementById('btn-export-dropdown');
  const exportMenu = document.getElementById('export-menu');
  const btnExportHtmlZip = document.getElementById('export-html-zip');
  const btnExportPdf1Page = document.getElementById('export-pdf-1page');
  const btnExportPdf2Page = document.getElementById('export-pdf-2page');
  const btnExportBrowserPrint = document.getElementById('export-browser-print');
  const btnExportAtsTxt = document.getElementById('export-ats-txt');

  function closeExportMenu() {
    if (exportMenu) {
      exportMenu.classList.remove('is-open');
      if (btnExportDropdown) btnExportDropdown.setAttribute('aria-expanded', 'false');
    }
  }

  if (btnExportDropdown && exportMenu) {
    btnExportDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = exportMenu.classList.toggle('is-open');
      btnExportDropdown.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!exportMenu.contains(e.target) && e.target !== btnExportDropdown) {
        closeExportMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeExportMenu();
    });
  }

  function triggerDownload(blobOrUrl, filename) {
    const a = document.createElement('a');
    if (typeof blobOrUrl === 'string') {
      a.href = blobOrUrl;
    } else {
      a.href = URL.createObjectURL(blobOrUrl);
    }
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      if (typeof blobOrUrl !== 'string') URL.revokeObjectURL(a.href);
    }, 600);
  }

  // Action: Export HTML Build Package (.zip)
  if (btnExportHtmlZip) {
    btnExportHtmlZip.addEventListener('click', async () => {
      closeExportMenu();
      const originalText = btnExportHtmlZip.querySelector('.item-title').innerHTML;
      btnExportHtmlZip.querySelector('.item-title').innerHTML = '⏳ Building Package...';

      try {
        if (typeof JSZip === 'undefined') {
          // Fallback: If JSZip script hasn't loaded, try loading it dynamically
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'assets/jszip.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        const zip = new JSZip();
        const buildFolder = zip.folder('resume-build');
        const assetsFolder = buildFolder.folder('assets');
        const docsFolder = assetsFolder.folder('documents');
        const imagesFolder = assetsFolder.folder('images');
        const fontsFolder = assetsFolder.folder('fonts');

        // Current live HTML content
        const currentHtml = document.documentElement.outerHTML;
        const cleanResumeHtml = currentHtml
          .replace(/<!-- =+[\s\S]*?STUDIO WORKSPACE CONTROLS[\s\S]*?<\/header>/i, '')
          .replace(/<!-- Deterministic HUD[\s\S]*?<\/div>\s*<\/div>/i, '')
          .replace(/<button id="btn-edit-toggle"[\s\S]*?<\/button>/i, '')
          .replace(/class="sheet-badge no-print">PAGE \d · [^<]*<\/span>/g, '');

        buildFolder.file('resume.html', cleanResumeHtml);
        buildFolder.file('index.html', currentHtml);

        // Fetch CSS, JS, and ATS files
        try {
          const cssRes = await fetch('resume.css');
          if (cssRes.ok) buildFolder.file('resume.css', await cssRes.text());
        } catch (e) {}

        try {
          const jsRes = await fetch('resume.js');
          if (jsRes.ok) buildFolder.file('resume.js', await jsRes.text());
        } catch (e) {}

        try {
          const atsRes = await fetch('ats_resume.txt');
          if (atsRes.ok) buildFolder.file('ats_resume.txt', await atsRes.text());
        } catch (e) {}

        // Add Fonts README
        fontsFolder.file('README.md', `# Offline Font Files Directory\n\nPlace your offline TTF/OTF font files in this folder (assets/fonts/).\nThe CSS @font-face rules in resume.css will automatically load them whenever present.\n`);

        // Add SVGs
        const svgList = [
          'logo.svg', 'icon-email.svg', 'icon-phone.svg', 'icon-location.svg',
          'icon-globe.svg', 'icon-linkedin.svg', 'icon-github.svg', 'icon-shield.svg'
        ];

        for (const svg of svgList) {
          try {
            const svgRes = await fetch(`assets/images/${svg}`);
            if (svgRes.ok) {
              imagesFolder.file(svg, await svgRes.text());
            }
          } catch (e) {}
        }

        // Include compiled PDFs if present in build output
        for (const pdfName of ['vmercader-resume-executive.pdf', 'vmercader-resume-complete.pdf']) {
          try {
            let pdfRes = await fetch(`resume-build/assets/documents/${pdfName}`);
            if (!pdfRes || !pdfRes.ok) pdfRes = await fetch(`assets/documents/${pdfName}`);
            if (pdfRes && pdfRes.ok) {
              const pdfBlob = await pdfRes.blob();
              docsFolder.file(pdfName, pdfBlob);
            }
          } catch (e) {}
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        triggerDownload(zipBlob, 'resume-build.zip');

        btnExportHtmlZip.querySelector('.item-title').innerHTML = '✅ Downloaded resume-build.zip!';
        setTimeout(() => {
          btnExportHtmlZip.querySelector('.item-title').innerHTML = originalText;
        }, 2500);
      } catch (err) {
        console.error('Error generating ZIP:', err);
        btnExportHtmlZip.querySelector('.item-title').innerHTML = originalText;
        alert('Could not generate ZIP automatically. You can also run "npm run export:html" in the terminal.');
      }
    });
  }

  // Helper to resolve PDF path whether running from root studio or exported build
  async function downloadPdf(filename) {
    const directPath = `assets/documents/${filename}`;
    const buildPath = `resume-build/assets/documents/${filename}`;
    try {
      const res = await fetch(directPath, { method: 'HEAD' });
      if (res.ok) {
        triggerDownload(directPath, filename);
        return;
      }
    } catch (e) {}
    triggerDownload(buildPath, filename);
  }

  // Action: Export 1-Page PDF
  if (btnExportPdf1Page) {
    btnExportPdf1Page.addEventListener('click', () => {
      closeExportMenu();
      downloadPdf('vmercader-resume-executive.pdf');
    });
  }

  // Action: Export 2-Page PDF
  if (btnExportPdf2Page) {
    btnExportPdf2Page.addEventListener('click', () => {
      closeExportMenu();
      downloadPdf('vmercader-resume-complete.pdf');
    });
  }

  // Action: Browser Print / Save PDF
  if (btnExportBrowserPrint) {
    btnExportBrowserPrint.addEventListener('click', () => {
      closeExportMenu();
      window.print();
    });
  }

  // Action: ATS Plain Text Download
  if (btnExportAtsTxt) {
    btnExportAtsTxt.addEventListener('click', () => {
      closeExportMenu();
      triggerDownload('ats_resume.txt', 'ats_resume.txt');
    });
  }

  // Legacy Print button fallback if present
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // --- ATS Text Modal ---
  if (btnAtsOpen && atsModal) {
    btnAtsOpen.addEventListener('click', async () => {
      try {
        const res = await fetch('ats_resume.txt');
        if (res.ok) {
          const text = await res.text();
          if (atsTextarea) atsTextarea.value = text;
        }
      } catch (err) {
        console.warn('Could not load ats_resume.txt, falling back to static text.');
      }
      atsModal.classList.add('is-open');
    });
  }

  if (btnAtsClose && atsModal) {
    btnAtsClose.addEventListener('click', () => {
      atsModal.classList.remove('is-open');
    });
  }

  if (atsModal) {
    atsModal.addEventListener('click', (e) => {
      if (e.target === atsModal) atsModal.classList.remove('is-open');
    });
  }

  if (btnAtsCopy && atsTextarea) {
    btnAtsCopy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(atsTextarea.value);
        const originalText = btnAtsCopy.innerHTML;
        btnAtsCopy.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
          Copied to Clipboard!
        `;
        btnAtsCopy.classList.add('btn-success');
        setTimeout(() => {
          btnAtsCopy.innerHTML = originalText;
          btnAtsCopy.classList.remove('btn-success');
        }, 2200);
      } catch (err) {
        atsTextarea.select();
        document.execCommand('copy');
      }
    });
  }

  // Keyboard Shortcuts: Cmd+P / Ctrl+P triggers print
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
      // Standard browser print will naturally occur
    }
  });
});
