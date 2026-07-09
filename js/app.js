/**
 * app.js — UI controller per il Validatore HTML
 */
(function () {
  'use strict';

  /* ── DOM refs ── */
  const textarea   = document.getElementById('html-input');
  const btnValida  = document.getElementById('btn-valida');
  const btnClear   = document.getElementById('btn-clear');
  const btnExample1 = document.getElementById('btn-example-1');
  const btnExample2 = document.getElementById('btn-example-2');
  const btnExample3 = document.getElementById('btn-example-3');
  const charCount  = document.getElementById('char-count');
  const resultsSection = document.getElementById('results-section');
  const resultsSummary = document.getElementById('results-summary');
  const summaryIcon = document.getElementById('summary-icon');
  const summaryText = document.getElementById('summary-text');
  const resultsCounts = document.getElementById('results-counts');
  const issuesList = document.getElementById('issues-list');
  const spinner = document.getElementById('spinner');
  const btnText = document.getElementById('btn-text');
  const emptyState = document.getElementById('empty-state');

  /* ── Esempi ── */
  const examples = {
    example1: '<!DOCTYPE html>\n<html lang="it">\n<head>\n  <meta charset="UTF-8">\n  <title>La mia pagina</title>\n</head>\n<body>\n  <h1>Ciao mondo!</h1>\n  <p>Benvenuto nel mio sito.</p>\n</body>\n</html>',
    example2: '<div>\n  <p>Ciao\n  <span>mondo</span>\n</div>',
    example3: '<img scr="foto.jpg" alt="Una bella foto">\n<br>\n<a hrer="https://esempio.com">Clicca qui</a>'
  };

  /* ── Icone SVG inline ── */
  const icons = {
    check: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    alert: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    chevron: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    bulb: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>',
    tag: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
    code: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
  };

  /* ── Helpers ── */
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function updateCharCount() {
    const len = textarea.value.length;
    charCount.textContent = len + ' caratteri';
  }

  /* ── Rendering risultati ── */
  function renderResults(issues) {
    issuesList.innerHTML = '';
    resultsSummary.classList.add('visible');

    if (issues.length === 0) {
      resultsSummary.className = 'results-summary visible success';
      summaryIcon.innerHTML = icons.check;
      summaryText.textContent = 'Nessun errore! Il tuo HTML è valido.';
      resultsCounts.innerHTML = '';
      emptyState.style.display = 'none';
      return;
    }

    // Filtra issue "empty-input": è un info che mostriamo nell'empty state
    if (issues.length === 1 && issues[0].rule === 'empty-input') {
      resultsSummary.classList.remove('visible');
      issuesList.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    const errors   = issues.filter(i => i.type === 'error');
    const warnings = issues.filter(i => i.type === 'warning');
    const infos    = issues.filter(i => i.type === 'info');

    resultsSummary.className = 'results-summary visible has-issues';
    summaryIcon.innerHTML = icons.alert;
    const total = issues.length;
    const parts = [];
    if (errors.length)   parts.push(errors.length + ' ' + (errors.length === 1 ? 'errore' : 'errori'));
    if (warnings.length) parts.push(warnings.length + ' ' + (warnings.length === 1 ? 'avviso' : 'avvisi'));
    if (infos.length)    parts.push(infos.length + ' ' + (infos.length === 1 ? 'info' : 'info'));
    summaryText.textContent = 'Trovati ' + total + ' ' + (total === 1 ? 'problema' : 'problemi') + ': ' + parts.join(', ');

    let countsHTML = '';
    if (errors.length)   countsHTML += '<span class="count-error">'   + errors.length   + ' errori</span>';
    if (warnings.length) countsHTML += '<span class="count-warning">' + warnings.length + ' avvisi</span>';
    if (infos.length)    countsHTML += '<span class="count-info">'    + infos.length    + ' info</span>';
    resultsCounts.innerHTML = countsHTML;

    for (const issue of issues) {
      const card = document.createElement('div');
      card.className = 'issue-card ' + issue.type;

      const typeLabels = { error: 'Errore', warning: 'Avviso', info: 'Info' };
      const typeLabel = typeLabels[issue.type] || 'Info';

      card.innerHTML = `
        <div class="issue-card-header" tabindex="0" role="button" aria-expanded="false">
          <div class="issue-badge" aria-hidden="true">
            <span class="issue-badge-line">R</span>
            <span>${issue.line}:${issue.col}</span>
          </div>
          <div class="issue-card-title">
            <span class="issue-type-tag">${typeLabel}</span>
            <p class="issue-message">${issue.message}</p>
          </div>
          <div class="issue-card-chevron">${icons.chevron}</div>
        </div>
        <div class="issue-card-body">
          ${issue.code ? `<div class="issue-code-block"><code>${escapeHTML(issue.code)}</code></div>` : ''}
          <div class="issue-suggestion">
            <span class="issue-suggestion-icon">${icons.bulb}</span>
            <span>${issue.suggestion}</span>
          </div>
        </div>
      `;

      const header = card.querySelector('.issue-card-header');
      header.addEventListener('click', () => {
        const expanded = card.classList.toggle('expanded');
        header.setAttribute('aria-expanded', String(expanded));
      });
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });

      issuesList.appendChild(card);
    }
  }

  /* ── Validazione ── */
  function runValidation() {
    const html = textarea.value;

    // Mostra spinner
    btnValida.disabled = true;
    spinner.classList.add('active');
    btnText.textContent = 'Validazione in corso…';

    // Usa requestAnimationFrame + piccolo delay per far vedere lo spinner
    // (la validazione è istantanea, ma diamo feedback visivo)
    requestAnimationFrame(() => {
      setTimeout(() => {
        let issues;
        try {
          issues = window.HTMLValidator.validate(html);
        } catch (err) {
          console.error('Errore di validazione:', err);
          issues = [{
            type: 'error',
            line: 1,
            col: 1,
            message: 'Si è verificato un errore interno durante la validazione.',
            suggestion: 'Riprova con un codice HTML più semplice. Se il problema persiste, segnala il bug.',
            code: '',
            rule: 'internal-error'
          }];
        }

        renderResults(issues);
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Reset bottone
        btnValida.disabled = false;
        spinner.classList.remove('active');
        btnText.textContent = 'Valida il codice';
      }, 150);
    });
  }

  /* ── Event listeners ── */
  btnValida.addEventListener('click', runValidation);

  // Ctrl+Enter / Cmd+Enter per validare
  textarea.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runValidation();
    }
  });

  textarea.addEventListener('input', updateCharCount);

  btnClear.addEventListener('click', () => {
    textarea.value = '';
    updateCharCount();
    resultsSummary.classList.remove('visible');
    issuesList.innerHTML = '';
    emptyState.style.display = 'block';
    textarea.focus();
  });

  btnExample1.addEventListener('click', () => {
    textarea.value = examples.example1;
    updateCharCount();
    resultsSummary.classList.remove('visible');
    issuesList.innerHTML = '';
    emptyState.style.display = 'block';
    textarea.focus();
  });

  btnExample2.addEventListener('click', () => {
    textarea.value = examples.example2;
    updateCharCount();
    resultsSummary.classList.remove('visible');
    issuesList.innerHTML = '';
    emptyState.style.display = 'block';
    textarea.focus();
  });

  btnExample3.addEventListener('click', () => {
    textarea.value = examples.example3;
    updateCharCount();
    resultsSummary.classList.remove('visible');
    issuesList.innerHTML = '';
    emptyState.style.display = 'block';
    textarea.focus();
  });

  /* ── Init ── */
  updateCharCount();

})();
