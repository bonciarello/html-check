/**
 * Validatore HTML per principianti — spiegazioni in italiano
 * Funziona completamente offline nel browser.
 */
(function () {
  'use strict';

  /* ── Void elements (non chiudono mai) ── */
  const VOID = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
  ]);

  /* ── Attributi globali HTML5 ── */
  const GLOBAL_ATTRS = new Set([
    'accesskey', 'autocapitalize', 'autofocus', 'class', 'contenteditable',
    'dir', 'draggable', 'enterkeyhint', 'hidden', 'id', 'inert', 'inputmode',
    'is', 'itemid', 'itemprop', 'itemref', 'itemscope', 'itemtype', 'lang',
    'nonce', 'part', 'popover', 'role', 'slot', 'spellcheck', 'style',
    'tabindex', 'title', 'translate'
  ]);

  /* ── Attributi per elemento (i più comuni per principianti) ── */
  const ELEM_ATTRS = {
    a:        ['href', 'target', 'rel', 'download', 'hreflang', 'type', 'referrerpolicy', 'ping', 'media'],
    abbr:     ['title'],
    area:     ['alt', 'coords', 'download', 'href', 'hreflang', 'media', 'referrerpolicy', 'rel', 'shape', 'target', 'type'],
    audio:    ['src', 'controls', 'autoplay', 'loop', 'muted', 'preload', 'crossorigin'],
    blockquote: ['cite'],
    button:   ['type', 'name', 'value', 'disabled', 'form', 'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget', 'autofocus', 'popovertarget', 'popovertargetaction'],
    canvas:   ['width', 'height'],
    col:      ['span'],
    colgroup: ['span'],
    data:     ['value'],
    del:      ['cite', 'datetime'],
    details:  ['open', 'name'],
    dialog:   ['open'],
    embed:    ['src', 'type', 'width', 'height'],
    fieldset: ['disabled', 'form', 'name'],
    form:     ['action', 'method', 'enctype', 'target', 'novalidate', 'autocomplete', 'name', 'accept-charset', 'rel'],
    iframe:   ['src', 'srcdoc', 'name', 'width', 'height', 'sandbox', 'allow', 'loading', 'referrerpolicy', 'allowfullscreen'],
    img:      ['src', 'alt', 'width', 'height', 'srcset', 'sizes', 'loading', 'crossorigin', 'decoding', 'fetchpriority', 'ismap', 'usemap', 'referrerpolicy'],
    input:    ['type', 'name', 'value', 'placeholder', 'required', 'disabled', 'readonly',
               'maxlength', 'minlength', 'min', 'max', 'step', 'pattern', 'autocomplete',
               'autofocus', 'checked', 'multiple', 'size', 'list', 'form', 'accept', 'capture', 'dirname', 'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget', 'inputmode', 'popovertarget', 'popovertargetaction', 'src', 'alt', 'width', 'height'],
    ins:      ['cite', 'datetime'],
    label:    ['for', 'form'],
    li:       ['value'],
    link:     ['rel', 'href', 'type', 'media', 'sizes', 'crossorigin', 'integrity', 'referrerpolicy', 'as', 'imagesrcset', 'imagesizes', 'fetchpriority', 'blocking', 'disabled', 'color', 'title'],
    map:      ['name'],
    meta:     ['name', 'content', 'charset', 'http-equiv', 'media', 'property'],
    meter:    ['value', 'min', 'max', 'low', 'high', 'optimum', 'form'],
    object:   ['data', 'type', 'width', 'height', 'form', 'name', 'typemustmatch'],
    ol:       ['reversed', 'start', 'type'],
    optgroup: ['disabled', 'label'],
    option:   ['value', 'selected', 'disabled', 'label'],
    output:   ['for', 'form', 'name'],
    progress: ['value', 'max'],
    q:        ['cite'],
    script:   ['src', 'type', 'async', 'defer', 'crossorigin', 'integrity', 'nomodule', 'referrerpolicy', 'fetchpriority', 'blocking'],
    select:   ['name', 'required', 'disabled', 'multiple', 'size', 'autofocus', 'form', 'autocomplete'],
    slot:     ['name'],
    source:   ['src', 'type', 'srcset', 'sizes', 'media', 'width', 'height'],
    style:    ['type', 'media', 'blocking'],
    table:    [],
    tbody:    [],
    td:       ['colspan', 'rowspan', 'headers'],
    textarea: ['name', 'rows', 'cols', 'placeholder', 'required', 'disabled',
               'readonly', 'maxlength', 'minlength', 'autofocus', 'wrap', 'form', 'dirname'],
    th:       ['colspan', 'rowspan', 'headers', 'scope', 'abbr'],
    thead:    [],
    tfoot:    [],
    time:     ['datetime'],
    tr:       [],
    track:    ['default', 'kind', 'label', 'src', 'srclang'],
    ul:       [],
    video:    ['src', 'controls', 'autoplay', 'loop', 'muted', 'poster', 'preload', 'width', 'height', 'crossorigin', 'playsinline']
  };

  /* ── Unione di tutti gli attributi conosciuti ── */
  const ALL_KNOWN_ATTRS = new Set(GLOBAL_ATTRS);
  for (const attrs of Object.values(ELEM_ATTRS)) {
    for (const a of attrs) ALL_KNOWN_ATTRS.add(a);
  }

  /* ── Errori di battitura comuni (da → corretto) ── */
  const TYPOS = {
    scr: 'src',       hrer: 'href',      hrefe: 'href',
    clss: 'class',    clas: 'class',     calss: 'class',
    alte: 'alt',      atl: 'alt',        titl: 'title',
    titel: 'title',   widht: 'width',    hieght: 'height',
    heigth: 'height', with: 'width',     hight: 'height',
    placehoder: 'placeholder', placeholer: 'placeholder',
    requred: 'required', requierd: 'required',
    disabeld: 'disabled', disbaled: 'disabled',
    tyep: 'type',     tpye: 'type',      nmae: 'name',
    naem: 'name',     valu: 'value',     vaule: 'value',
    colums: 'cols',   row: 'rows',       maxlenght: 'maxlength',
    minlenght: 'minlength', readony: 'readonly',
    autocompleet: 'autocomplete', autofocuss: 'autofocus',
    checkd: 'checked', cheked: 'checked',
    seletced: 'selected', acton: 'action',
    metthod: 'method', encytype: 'enctype',
    spann: 'span',  backgroud: 'style', /* confusione CSS */
    collor: 'style',  font: 'style',
    aling: 'style',   valign: 'style',
    bordre: 'style',  cellpading: 'style',
    cellspacing: 'style',
    targert: 'target', blanck: 'target', /* confusione target="_blank" */
  };

  /* ── Levenshtein distance ── */
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = new Array(m + 1);
    for (let i = 0; i <= m; i++) {
      dp[i] = new Array(n + 1);
      dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  }

  function findClosestAttr(name, candidates) {
    let best = null, bestDist = Infinity;
    for (const c of candidates) {
      if (c === name) return c;
      const d = levenshtein(name, c);
      if (d <= 2 && d < bestDist) {
        bestDist = d;
        best = c;
      }
    }
    return best;
  }

  /* ── Mappa posizioni: costruisce line-starts per lookup rapido ── */
  function buildLineMap(html) {
    const starts = [0];
    for (let i = 0; i < html.length; i++) {
      if (html[i] === '\n') starts.push(i + 1);
    }
    return starts;
  }

  function getLineCol(starts, index) {
    let lo = 0, hi = starts.length - 1;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (starts[mid] <= index) lo = mid;
      else hi = mid - 1;
    }
    return { line: lo + 1, col: index - starts[lo] + 1 };
  }

  /* ── Tokenizer ── */
  function tokenize(html) {
    const tokens = [];
    const len = html.length;
    let i = 0;

    while (i < len) {
      if (html[i] !== '<') { i++; continue; }

      const start = i;

      // Commento <!-- ... -->
      if (html.substring(i, i + 4) === '<!--') {
        const endIdx = html.indexOf('-->', i + 4);
        if (endIdx !== -1) i = endIdx + 3;
        else i = len;
        continue;
      }

      // DOCTYPE
      if (html.substring(i, i + 9).toLowerCase() === '<!doctype') {
        const endIdx = html.indexOf('>', i);
        i = endIdx !== -1 ? endIdx + 1 : len;
        continue;
      }

      // CDATA
      if (html.substring(i, i + 9) === '<![CDATA[') {
        const endIdx = html.indexOf(']]>', i + 9);
        i = endIdx !== -1 ? endIdx + 3 : len;
        continue;
      }

      // Tag di chiusura </...>
      if (html[i + 1] === '/') {
        const gt = html.indexOf('>', i);
        if (gt === -1) { i++; continue; }
        const inner = html.substring(i + 2, gt).trim();
        const tagName = inner.split(/\s/)[0].toLowerCase();
        if (tagName) {
          tokens.push({
            type: 'closing',
            tagName,
            startIndex: start,
            raw: html.substring(i, gt + 1)
          });
        }
        i = gt + 1;
        continue;
      }

      // Tag di apertura o auto-chiudente
      const gt = html.indexOf('>', i);
      if (gt === -1) { i++; continue; }

      let inner = html.substring(i + 1, gt);
      const selfClose = inner.endsWith('/');
      if (selfClose) inner = inner.slice(0, -1).trim();

      const spaceIdx = inner.search(/\s/);
      const tagName = (spaceIdx === -1 ? inner : inner.substring(0, spaceIdx)).toLowerCase();
      if (!tagName || !/^[a-z][a-z0-9-]*$/i.test(tagName)) { i = gt + 1; continue; }

      const attrStr = spaceIdx === -1 ? '' : inner.substring(spaceIdx).trim();
      const attributes = parseAttrs(attrStr);
      const isVoid = VOID.has(tagName);
      const rawTag = html.substring(i, gt + 1);

      tokens.push({
        type: selfClose ? 'self-closing' : 'opening',
        tagName,
        attributes,
        startIndex: start,
        raw: rawTag,
        isVoid
      });

      i = gt + 1;

      // Salta contenuto di <script> e <style>
      if ((tagName === 'script' || tagName === 'style') && !selfClose) {
        const re = new RegExp('</' + tagName + '\\s*>', 'i');
        const rest = html.substring(i);
        const m = rest.match(re);
        if (m) {
          i = i + m.index + m[0].length;
        }
      }
    }

    return tokens;
  }

  /* ── Parser attributi ── */
  function parseAttrs(str) {
    const attrs = [];
    if (!str) return attrs;
    let j = 0;
    const len = str.length;

    while (j < len) {
      while (j < len && /\s/.test(str[j])) j++;
      if (j >= len) break;

      if (str[j] === '=') { j++; continue; }

      const nameStart = j;
      while (j < len && !/\s/.test(str[j]) && str[j] !== '=') j++;
      let name = str.substring(nameStart, j);
      const rawName = name;
      name = name.toLowerCase();

      while (j < len && /\s/.test(str[j])) j++;

      let value = null;
      if (j < len && str[j] === '=') {
        j++;
        while (j < len && /\s/.test(str[j])) j++;
        if (j < len) {
          const q = str[j];
          if (q === '"' || q === "'") {
            j++;
            let valStart = j;
            while (j < len && str[j] !== q) {
              if (str[j] === '\\') j++;
              j++;
            }
            value = str.substring(valStart, j);
            if (j < len) j++;
          } else {
            const valStart = j;
            while (j < len && !/\s/.test(str[j])) j++;
            value = str.substring(valStart, j);
          }
        }
      }

      if (name) {
        attrs.push({ name, rawName, value });
      }
    }

    return attrs;
  }

  /* ── Validazione principale ── */
  function validate(html) {
    const issues = [];
    const trimmed = (html || '').trim();

    if (!trimmed) {
      issues.push({
        type: 'info',
        line: 1,
        col: 1,
        message: 'La textarea è vuota. Incolla del codice HTML da validare.',
        suggestion: 'Scrivi o incolla il tuo codice HTML e clicca "Valida il codice".',
        code: '',
        rule: 'empty-input'
      });
      return issues;
    }

    const lineMap = buildLineMap(html);
    const toPos = (idx) => getLineCol(lineMap, idx);

    const tokens = tokenize(html);

    /* ── 1. Tag non chiusi ── */
    const stack = [];
    for (const tok of tokens) {
      if (tok.type === 'opening' && !tok.isVoid) {
        stack.push(tok);
      } else if (tok.type === 'closing') {
        let found = false;
        for (let k = stack.length - 1; k >= 0; k--) {
          if (stack[k].tagName === tok.tagName) {
            // Segnala i tag intermedi non chiusi
            for (let m = stack.length - 1; m > k; m--) {
              const t = stack[m];
              const pos = toPos(t.startIndex);
              issues.push({
                type: 'error',
                line: pos.line,
                col: pos.col,
                message: `Il tag <strong>&lt;${t.tagName}&gt;</strong> (riga ${pos.line}, colonna ${pos.col}) non è stato chiuso prima di incontrare <strong>&lt;/${tok.tagName}&gt;</strong>.`,
                suggestion: `Aggiungi <code>&lt;/${t.tagName}&gt;</code> per chiudere correttamente questo tag. In HTML ogni tag di apertura (eccetto quelli "void" come &lt;br&gt;, &lt;img&gt;, &lt;input&gt;) deve essere chiuso con il corrispondente tag di chiusura.`,
                code: t.raw,
                rule: 'unclosed-tag-nested'
              });
            }
            stack.splice(k);
            found = true;
            break;
          }
        }
        if (!found) {
          const pos = toPos(tok.startIndex);
          issues.push({
            type: 'warning',
            line: pos.line,
            col: pos.col,
            message: `Tag di chiusura <strong>&lt;/${tok.tagName}&gt;</strong> senza un corrispondente tag di apertura.`,
            suggestion: `Verifica di aver aperto il tag <code>&lt;${tok.tagName}&gt;</code> prima di questo punto, oppure questo tag di chiusura è di troppo e va rimosso.`,
            code: tok.raw,
            rule: 'orphan-closing-tag'
          });
        }
      }
    }

    // Tag rimasti sullo stack (mai chiusi)
    for (const t of stack) {
      const pos = toPos(t.startIndex);
      issues.push({
        type: 'error',
        line: pos.line,
        col: pos.col,
        message: `Il tag <strong>&lt;${t.tagName}&gt;</strong> non è mai stato chiuso.`,
        suggestion: `Aggiungi <code>&lt;/${t.tagName}&gt;</code> per chiudere il tag. In HTML tutti i tag (tranne quelli "void" come &lt;br&gt;, &lt;img&gt;, &lt;input&gt;, &lt;hr&gt;, &lt;meta&gt;, &lt;link&gt;) devono essere chiusi.`,
        code: t.raw,
        rule: 'unclosed-tag'
      });
    }

    /* ── 2. Controllo attributi ── */
    const processedTags = new Set(); // evita duplicati per lo stesso tag

    for (const tok of tokens) {
      if (tok.type !== 'opening' && tok.type !== 'self-closing') continue;
      const pos = toPos(tok.startIndex);
      const tagKey = `${tok.tagName}:${tok.startIndex}`;

      for (const attr of tok.attributes) {
        // Controllo typo hardcoded
        if (TYPOS[attr.name] !== undefined) {
          const correct = TYPOS[attr.name];
          if (correct !== attr.name) {
            issues.push({
              type: 'error',
              line: pos.line,
              col: pos.col,
              message: `Attributo <strong>"${attr.rawName}"</strong> non valido nel tag <strong>&lt;${tok.tagName}&gt;</strong>.`,
              suggestion: `Hai scritto <strong>"${attr.rawName}"</strong> ma probabilmente intendevi <strong>"${correct}"</strong>. Correggi l\'errore di battitura.`,
              code: tok.raw,
              rule: 'typo-attribute'
            });
            continue;
          }
        }

        // Salta data-* e aria-*
        if (attr.name.startsWith('data-') || attr.name.startsWith('aria-')) continue;

        // È un attributo globale? → ok
        if (GLOBAL_ATTRS.has(attr.name)) continue;

        // È un attributo valido per questo elemento?
        const elemAttrs = ELEM_ATTRS[tok.tagName] || [];
        if (elemAttrs.includes(attr.name)) continue;

        // È noto ma non per questo elemento?
        if (ALL_KNOWN_ATTRS.has(attr.name)) {
          issues.push({
            type: 'warning',
            line: pos.line,
            col: pos.col,
            message: `L\'attributo <strong>"${attr.rawName}"</strong> non è valido per il tag <strong>&lt;${tok.tagName}&gt;</strong>.`,
            suggestion: `L\'attributo "${attr.rawName}" esiste in HTML ma non si usa con &lt;${tok.tagName}&gt;. Controlla la documentazione o usa un attributo specifico per questo elemento.`,
            code: tok.raw,
            rule: 'wrong-element-attribute'
          });
          continue;
        }

        // Sconosciuto — cerca un suggerimento tra gli attributi dell'elemento
        const candidates = [...GLOBAL_ATTRS, ...elemAttrs];
        const suggestion = findClosestAttr(attr.name, candidates);
        if (suggestion) {
          issues.push({
            type: 'warning',
            line: pos.line,
            col: pos.col,
            message: `Attributo <strong>"${attr.rawName}"</strong> non riconosciuto nel tag <strong>&lt;${tok.tagName}&gt;</strong>.`,
            suggestion: `Forse intendevi scrivere <strong>"${suggestion}"</strong>? L\'attributo "${attr.rawName}" non esiste in HTML standard.`,
            code: tok.raw,
            rule: 'unknown-attribute-close'
          });
        } else {
          issues.push({
            type: 'info',
            line: pos.line,
            col: pos.col,
            message: `Attributo <strong>"${attr.rawName}"</strong> non standard nel tag <strong>&lt;${tok.tagName}&gt;</strong>.`,
            suggestion: `L\'attributo "${attr.rawName}" non è un attributo HTML standard. Se stai cercando di applicare uno stile, usa l\'attributo <code>style</code> oppure una classe CSS con <code>class</code>.`,
            code: tok.raw,
            rule: 'unknown-attribute'
          });
        }
      }

      /* ── 3. Controlli specifici per elemento ── */
      if (tok.tagName === 'img') {
        const hasSrc = tok.attributes.some(a => a.name === 'src');
        const hasAlt = tok.attributes.some(a => a.name === 'alt');
        if (!hasSrc && !processedTags.has(tagKey + ':nosrc')) {
          processedTags.add(tagKey + ':nosrc');
          issues.push({
            type: 'error',
            line: pos.line,
            col: pos.col,
            message: `Il tag <strong>&lt;img&gt;</strong> non ha l\'attributo <strong>src</strong>.`,
            suggestion: `Aggiungi <code>src="percorso/foto.jpg"</code> per specificare quale immagine mostrare. Senza src l\'immagine non verrà visualizzata.`,
            code: tok.raw,
            rule: 'missing-src'
          });
        }
        if (!hasAlt && !processedTags.has(tagKey + ':noalt')) {
          processedTags.add(tagKey + ':noalt');
          issues.push({
            type: 'warning',
            line: pos.line,
            col: pos.col,
            message: `Il tag <strong>&lt;img&gt;</strong> non ha l\'attributo <strong>alt</strong>.`,
            suggestion: `Aggiungi <code>alt="descrizione dell\'immagine"</code>. L\'attributo alt è importante per l\'accessibilità e per la SEO. Se l\'immagine è puramente decorativa, puoi usare <code>alt=""</code> (stringa vuota).`,
            code: tok.raw,
            rule: 'missing-alt'
          });
        }
      }

      if (tok.tagName === 'a' && !tok.attributes.some(a => a.name === 'href') && !processedTags.has(tagKey + ':nohref')) {
        processedTags.add(tagKey + ':nohref');
        issues.push({
          type: 'warning',
          line: pos.line,
          col: pos.col,
          message: `Il tag <strong>&lt;a&gt;</strong> non ha l\'attributo <strong>href</strong>.`,
          suggestion: `Senza href il link non porta da nessuna parte. Aggiungi <code>href="https://esempio.com"</code> per specificare la destinazione del link.`,
          code: tok.raw,
          rule: 'missing-href'
        });
      }
    }

    /* ── Ordina per posizione ── */
    issues.sort((a, b) => a.line !== b.line ? a.line - b.line : a.col - b.col);

    return issues;
  }

  /* ── Esponi globalmente ── */
  window.HTMLValidator = { validate: validate };
})();
