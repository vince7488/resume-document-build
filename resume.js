/**
 * RESUME DOCUMENT BUILD: Interactive Print Studio Controller
 * Handles deterministic page budgeting, paper format switching (Letter & A4),
 * density root token tuning (--body-size, --section-gap), theme/font switching,
 * ATS text modal, and multi-format exports.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM References
  const htmlEl = document.documentElement;
  const themeSelect = document.getElementById('theme-select');
  const fontSelect = document.getElementById('font-select');
  const paperSelect = document.getElementById('paper-select');
  const densitySelect = document.getElementById('density-select');
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
  const badgeFormat = document.querySelector('.badge-format');

  // Density Popover Elements
  const btnDensityPopover = document.getElementById('btn-density-popover');
  const densityPopover = document.getElementById('density-popover');
  const inputBodySize = document.getElementById('input-body-size');
  const inputSectionGap = document.getElementById('input-section-gap');
  const inputRoleGap = document.getElementById('input-role-gap');
  const valBodySize = document.getElementById('val-body-size');
  const valSectionGap = document.getElementById('val-section-gap');
  const valRoleGap = document.getElementById('val-role-gap');
  const btnResetDensity = document.getElementById('btn-reset-density');
  const btnCloseDensity = document.getElementById('btn-close-density');

  // Sheets
  const sheet1 = document.getElementById('sheet-1');
  const sheet2 = document.getElementById('sheet-2');
  const sheetBadges = document.querySelectorAll('.sheet-badge');

  // --- Paper Format Controller (Letter vs A4) ---
  function setPaperFormat(format) {
    htmlEl.setAttribute('data-paper', format);
    localStorage.setItem('resume_paper', format);

    if (badgeFormat) {
      badgeFormat.textContent = format === 'a4' ? 'ISO A4 · 210 × 297mm' : 'US Letter · 8.5" × 11"';
    }

    if (sheetBadges.length >= 2) {
      sheetBadges[0].textContent = format === 'a4' ? 'PAGE 1 · A4 (210 × 297mm)' : 'PAGE 1 · 8.5" × 11"';
      sheetBadges[1].textContent = format === 'a4' ? 'PAGE 2 · A4 (210 × 297mm)' : 'PAGE 2 · 8.5" × 11"';
    }

    setTimeout(checkPageOverflow, 120);
  }

  if (paperSelect) {
    paperSelect.addEventListener('change', (e) => {
      setPaperFormat(e.target.value);
    });
    const savedPaper = localStorage.getItem('resume_paper') || htmlEl.getAttribute('data-paper') || 'letter';
    paperSelect.value = savedPaper;
    setPaperFormat(savedPaper);
  }

  // --- Density Tuning Controller (Root Tokens: --body-size, --section-gap) ---
  function setDensityPreset(density) {
    htmlEl.setAttribute('data-density', density);
    localStorage.setItem('resume_density', density);

    // Clear inline property overrides to restore preset defaults
    htmlEl.style.removeProperty('--body-size');
    htmlEl.style.removeProperty('--section-gap');
    htmlEl.style.removeProperty('--role-gap');

    // Update slider readouts based on active preset
    const computed = window.getComputedStyle(htmlEl);
    const bodySize = computed.getPropertyValue('--body-size').trim() || '8.8pt';
    const sectionGap = computed.getPropertyValue('--section-gap').trim() || '10px';
    const roleGap = computed.getPropertyValue('--role-gap').trim() || '7px';

    if (inputBodySize) inputBodySize.value = parseFloat(bodySize);
    if (inputSectionGap) inputSectionGap.value = parseFloat(sectionGap);
    if (inputRoleGap) inputRoleGap.value = parseFloat(roleGap);

    if (valBodySize) valBodySize.textContent = bodySize;
    if (valSectionGap) valSectionGap.textContent = sectionGap;
    if (valRoleGap) valRoleGap.textContent = roleGap;

    setTimeout(checkPageOverflow, 80);
  }

  if (densitySelect) {
    densitySelect.addEventListener('change', (e) => {
      setDensityPreset(e.target.value);
    });
    const savedDensity = localStorage.getItem('resume_density') || htmlEl.getAttribute('data-density') || 'normal';
    densitySelect.value = savedDensity;
    setDensityPreset(savedDensity);
  }

  // Fine-Tuning Sliders
  if (btnDensityPopover && densityPopover) {
    btnDensityPopover.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = densityPopover.hasAttribute('hidden');
      if (isHidden) {
        densityPopover.removeAttribute('hidden');
      } else {
        densityPopover.setAttribute('hidden', '');
      }
    });

    document.addEventListener('click', (e) => {
      if (!densityPopover.contains(e.target) && e.target !== btnDensityPopover) {
        densityPopover.setAttribute('hidden', '');
      }
    });

    if (btnCloseDensity) {
      btnCloseDensity.addEventListener('click', () => {
        densityPopover.setAttribute('hidden', '');
      });
    }

    if (btnResetDensity) {
      btnResetDensity.addEventListener('click', () => {
        if (densitySelect) densitySelect.value = 'normal';
        setDensityPreset('normal');
      });
    }
  }

  if (inputBodySize) {
    inputBodySize.addEventListener('input', (e) => {
      const val = `${e.target.value}pt`;
      htmlEl.style.setProperty('--body-size', val);
      if (valBodySize) valBodySize.textContent = val;
      checkPageOverflow();
    });
  }

  if (inputSectionGap) {
    inputSectionGap.addEventListener('input', (e) => {
      const val = `${e.target.value}px`;
      htmlEl.style.setProperty('--section-gap', val);
      if (valSectionGap) valSectionGap.textContent = val;
      checkPageOverflow();
    });
  }

  if (inputRoleGap) {
    inputRoleGap.addEventListener('input', (e) => {
      const val = `${e.target.value}px`;
      htmlEl.style.setProperty('--role-gap', val);
      if (valRoleGap) valRoleGap.textContent = val;
      checkPageOverflow();
    });
  }

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
    
    const initialLayout = htmlEl.getAttribute('data-layout') || localStorage.getItem('resume_layout') || '1page';
    setLayoutMode(initialLayout);
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
        const resumeContainer = document.querySelector('.document-viewport');
        if (resumeContainer) {
          localStorage.setItem('resume_user_edits', resumeContainer.innerHTML);
        }
      }
      checkPageOverflow();
    });
  }

  // --- Deterministic Height & Overflow Sentinel ---
  function checkPageOverflow() {
    // Determine Target Height Budget (US Letter: 1056px | ISO A4: 1123px)
    const isA4 = htmlEl.getAttribute('data-paper') === 'a4';
    const TARGET_HEIGHT_PX = isA4 ? 1123 : 1056;
    const paperLabel = isA4 ? 'A4' : 'Letter';

    if (sheet1) {
      const scrollH1 = sheet1.scrollHeight;
      const pct1 = Math.round((scrollH1 / TARGET_HEIGHT_PX) * 100);
      if (hudPage1) {
        if (scrollH1 > TARGET_HEIGHT_PX) {
          hudPage1.innerHTML = `<span class="hud-dot warning"></span> Page 1 (${paperLabel}): <strong style="color:#ef4444">${scrollH1}px / ${TARGET_HEIGHT_PX}px (${pct1}%) - OVERFLOW! (Tweak --body-size or --section-gap to fit)</strong>`;
        } else {
          hudPage1.innerHTML = `<span class="hud-dot"></span> Page 1 (${paperLabel}): <strong>${scrollH1}px / ${TARGET_HEIGHT_PX}px (${pct1}%) - Print Safe</strong>`;
        }
      }
    }

    if (sheet2 && htmlEl.getAttribute('data-layout') === '2page') {
      const scrollH2 = sheet2.scrollHeight;
      const pct2 = Math.round((scrollH2 / TARGET_HEIGHT_PX) * 100);
      if (hudPage2) {
        if (scrollH2 > TARGET_HEIGHT_PX) {
          hudPage2.innerHTML = `<span class="hud-dot warning"></span> Page 2 (${paperLabel}): <strong style="color:#ef4444">${scrollH2}px / ${TARGET_HEIGHT_PX}px (${pct2}%) - OVERFLOW! (Tweak --body-size or --section-gap to fit)</strong>`;
        } else {
          hudPage2.innerHTML = `<span class="hud-dot"></span> Page 2 (${paperLabel}): <strong>${scrollH2}px / ${TARGET_HEIGHT_PX}px (${pct2}%) - Print Safe</strong>`;
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

        fontsFolder.file('README.md', `# Offline Font Files Directory\n\nPlace offline TTF/OTF font files in this folder (assets/fonts/).\nCSS @font-face rules in resume.css automatically bind local files.\n`);

        // Add SVGs and Sprite
        const svgList = [
          'logo.svg', 'sprite.svg', 'icon-email.svg', 'icon-phone.svg', 'icon-location.svg',
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
        const pdfFiles = [
          'vmercader-resume-executive.pdf', 'vmercader-resume-executive-a4.pdf',
          'vmercader-resume-complete.pdf', 'vmercader-resume-complete-a4.pdf'
        ];
        for (const pdfName of pdfFiles) {
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
        alert('Could not generate ZIP automatically. Run "npm run export:html" in terminal.');
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

  // Bind Export PDF items (both Letter and A4)
  const pdfItemBindings = [
    { id: 'export-pdf-1page-letter', file: 'vmercader-resume-executive.pdf' },
    { id: 'export-pdf-1page-a4', file: 'vmercader-resume-executive-a4.pdf' },
    { id: 'export-pdf-2page-letter', file: 'vmercader-resume-complete.pdf' },
    { id: 'export-pdf-2page-a4', file: 'vmercader-resume-complete-a4.pdf' },
    // Legacy IDs fallback
    { id: 'export-pdf-1page', file: 'vmercader-resume-executive.pdf' },
    { id: 'export-pdf-2page', file: 'vmercader-resume-complete.pdf' }
  ];

  pdfItemBindings.forEach(({ id, file }) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        closeExportMenu();
        downloadPdf(file);
      });
    }
  });

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

  // --- ATS Upload & Parsing Controller ---
  function parseATSData(text) {
    if (!text) return {};
    
    const data = {
      name: '', tagline: '', email: '', phone: '', sites: [], location: '',
      certifications: [], summary: '', experience: [], education: [], skills: []
    };

    const lines = text.split('\n').map(l => l.trim());
    let currentSection = 'header';
    let currentObj = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;

      if (line === 'CERTIFICATIONS') { currentSection = 'certifications'; currentObj = null; continue; }
      if (line === 'SUMMARY') { currentSection = 'summary'; continue; }
      if (line === 'PROFESSIONAL BACKGROUND') { currentSection = 'experience'; currentObj = null; continue; }
      if (line === 'EDUCATION') { currentSection = 'education'; currentObj = null; continue; }
      if (line === 'SKILLS (FORMAL)') { currentSection = 'skills'; continue; }
      if (line === 'SKILLS (ATS)') { currentSection = 'skills_ats'; continue; }

      if (currentSection === 'header') {
        if (line.startsWith('Name:')) data.name = line.substring(5).trim();
        else if (line.startsWith('Email:')) data.email = line.substring(6).trim();
        else if (line.startsWith('Phone:')) data.phone = line.substring(6).trim();
        else if (line.startsWith('Site ')) {
           const parts = line.split(':');
           if (parts.length > 1) {
              data.sites.push(parts.slice(1).join(':').trim());
           }
        }
        else if (line.startsWith('Location:')) data.location = line.substring(9).trim();
        else if (!line.startsWith('==') && !line.toLowerCase().includes('ats resume template')) {
           if (!data.tagline && data.name && !line.startsWith('Name:')) {
              data.tagline = line;
           }
        }
      }
      else if (currentSection === 'certifications') {
        if (line.startsWith('Institution:')) {
           currentObj = { institution: line.substring(12).trim(), certificates: '' };
           data.certifications.push(currentObj);
        } else if (line.startsWith('Certificates:') && currentObj) {
           currentObj.certificates = line.substring(13).trim();
        }
      }
      else if (currentSection === 'summary') {
        data.summary += (data.summary ? ' ' : '') + line;
      }
      else if (currentSection === 'experience') {
        if (line === '---') { currentObj = null; continue; }
        
        if (line.startsWith('Position:')) {
           currentObj = { position: line.substring(9).trim(), company: '', subOrg: '', location: '', startDate: '', endDate: '', bullets: [] };
           data.experience.push(currentObj);
        } else if (currentObj) {
           if (line.startsWith('- Company:')) {
               let c = line.substring(10).trim();
               let match = c.match(/(.*?)\s*\((.*?)\)$/);
               if (match) {
                   currentObj.company = match[1].trim();
                   currentObj.subOrg = match[2].trim();
               } else {
                   currentObj.company = c;
                   currentObj.subOrg = '';
               }
           }
           else if (line.startsWith('- Location:')) currentObj.location = line.substring(11).trim();
           else if (line.startsWith('- Start Date:')) currentObj.startDate = line.substring(13).trim();
           else if (line.startsWith('- End Date:')) currentObj.endDate = line.substring(11).trim();
           else if (line.startsWith('- ')) currentObj.bullets.push(line.substring(2).trim());
        }
      }
      else if (currentSection === 'education') {
        if (line.startsWith('Institution:')) {
           currentObj = { institution: line.substring(12).trim(), major: '', course: '' };
           data.education.push(currentObj);
        } else if (currentObj) {
           if (line.startsWith('Major:')) currentObj.major = line.substring(6).trim();
           else if (line.startsWith('Course:')) currentObj.course = line.substring(7).trim();
        }
      }
      else if (currentSection === 'skills') {
        const parts = line.split(':');
        if (parts.length >= 2) {
           data.skills.push({ cat: parts[0].trim(), items: parts.slice(1).join(':').trim() });
        }
      }
    }

    return data;
  }

  function applyATSDataToDOM(data) {
    const badDataSpan = '<span style="background-color: rgba(255,15,10,0.9); color: white; font-weight: bold; padding: 2px 4px; border-radius: 2px;">Bad ATS data</span>';
    const getVal = (v) => (v && v.trim()) ? v : badDataSpan;

    // Header
    const nameEl = document.querySelector('.name');
    if (nameEl) nameEl.innerHTML = getVal(data.name);

    const taglineEl = document.querySelector('.tagline');
    if (taglineEl) taglineEl.innerHTML = getVal(data.tagline);

    const contactEl = document.querySelector('.contact');
    if (contactEl) {
      let contactHtml = [];
      if (data.location) contactHtml.push(`<span>${getVal(data.location)}</span>`);
      else contactHtml.push(`<span>${badDataSpan}</span>`);
      
      if (data.phone) contactHtml.push(`<span>${getVal(data.phone)}</span>`);
      else contactHtml.push(`<span>${badDataSpan}</span>`);

      if (data.email) contactHtml.push(`<a href="mailto:${data.email}">${getVal(data.email)}</a>`);
      else contactHtml.push(`<span>${badDataSpan}</span>`);

      if (data.sites && data.sites.length > 0) {
        data.sites.forEach(site => {
          let display = site.replace(/^https?:\/\/(www\.)?/, '');
          contactHtml.push(`<a href="${site}" target="_blank" rel="noopener">${getVal(display)}</a>`);
        });
      } else {
        contactHtml.push(`<span>${badDataSpan}</span>`);
      }

      contactEl.innerHTML = contactHtml.join('<span class="sep">·</span>');
    }

    // Summary
    const summaryEl = document.querySelector('.summary-text');
    if (summaryEl) {
      summaryEl.innerHTML = getVal(data.summary);
    }

    // Core Competencies
    const skillsContainer = document.querySelector('.skill-grid');
    if (skillsContainer) {
      if (data.skills && data.skills.length > 0) {
        skillsContainer.innerHTML = data.skills.map(skill => `
          <div class="skill-row">
            <span class="skill-cat">${getVal(skill.cat)}</span>
            <span class="skill-items">${getVal(skill.items)}</span>
          </div>
        `).join('');
      } else {
        skillsContainer.innerHTML = badDataSpan;
      }
    }

    // Experience
    const expContainer1 = document.querySelector('#experience');
    const expContainer2 = document.querySelector('#experience-continued');

    if (expContainer1) {
      const h2 = expContainer1.querySelector('h2');
      expContainer1.innerHTML = '';
      if (h2) expContainer1.appendChild(h2);

      if (expContainer2) {
        const h2_2 = expContainer2.querySelector('h2');
        expContainer2.innerHTML = '';
        if (h2_2) expContainer2.appendChild(h2_2);
      }

      if (data.experience && data.experience.length > 0) {
         data.experience.forEach((job, index) => {
           const isFirstPage = index < 3;
           const container = isFirstPage ? expContainer1 : expContainer2;
           if (!container) return;

           const subOrgHtml = job.subOrg ? ` <span class="sub-org">(${getVal(job.subOrg)})</span>` : '';
           
           const roleHtml = `
            <div class="role keep">
              <div class="role-head">
                <div class="role-left">
                  <div class="pos">${getVal(job.position)}</div>
                  <div class="org">${getVal(job.company)}${subOrgHtml}</div>
                </div>
                <div class="role-right">
                  <div class="dates">${getVal(job.startDate)} – ${getVal(job.endDate)}</div>
                  <div class="loc">${getVal(job.location)}</div>
                </div>
              </div>
              <ul class="bullets">
                ${job.bullets && job.bullets.length > 0 ? job.bullets.map(b => `<li>${getVal(b)}</li>`).join('') : `<li>${badDataSpan}</li>`}
              </ul>
            </div>
           `;
           container.insertAdjacentHTML('beforeend', roleHtml);
         });
      } else {
         expContainer1.insertAdjacentHTML('beforeend', `<div class="role keep">${badDataSpan}</div>`);
      }
    }

    // Education
    const populateEdu = (containerSelector) => {
       const eduContainer = document.querySelector(containerSelector);
       if (!eduContainer) return;

       const h2 = eduContainer.querySelector('h2');
       eduContainer.innerHTML = '';
       if (h2) eduContainer.appendChild(h2);

       const twoCol = document.createElement('div');
       twoCol.className = 'twocol';
       
       const leftCol = document.createElement('div');
       if (data.education && data.education.length > 0) {
         leftCol.innerHTML = data.education.map(edu => `
           <div class="ec tight">
             <div class="deg">${getVal(edu.course)} in ${getVal(edu.major)}</div>
             <div class="meta">${getVal(edu.institution)}</div>
           </div>
         `).join('');
       } else {
         leftCol.innerHTML = badDataSpan;
       }

       const rightCol = document.createElement('div');
       if (data.certifications && data.certifications.length > 0) {
         rightCol.innerHTML = data.certifications.map(cert => {
           let degVal = cert.certificates;
           if (degVal && degVal.toLowerCase().includes('clearance')) {
             degVal = `<span class="clearance-badge">${degVal}</span>`;
           }
           return `
             <div class="ec tight">
               <div class="deg">${degVal || badDataSpan}</div>
               <div class="meta">${getVal(cert.institution)}</div>
             </div>
           `;
         }).join('');
       } else {
         rightCol.innerHTML = badDataSpan;
       }

       twoCol.appendChild(leftCol);
       twoCol.appendChild(rightCol);
       eduContainer.appendChild(twoCol);
    };

    populateEdu('#education');
    populateEdu('#education-complete');
    
    if (typeof checkPageOverflow === 'function') {
      setTimeout(checkPageOverflow, 100);
    }
  }

  // Handle auto-load of ATS
  fetch('ats_resume.txt')
    .then(res => {
      if (!res.ok) throw new Error('Not found');
      return res.text();
    })
    .then(text => {
      const parsedData = parseATSData(text);
      applyATSDataToDOM(parsedData);
    })
    .catch(err => {
      console.warn('Failed to load pre-loaded ats_resume.txt', err);
      // Fill with bad data
      applyATSDataToDOM({});
    });

  // Handle ATS user upload
  const atsUploadInput = document.getElementById('ats-upload-input');
  if (atsUploadInput) {
    atsUploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const parsedData = parseATSData(text);
        applyATSDataToDOM(parsedData);
        
        // Also update ATS text area if it exists
        const atsTextarea = document.getElementById('ats-textarea');
        if (atsTextarea) atsTextarea.value = text;
      };
      reader.readAsText(file);
    });
  }
});
