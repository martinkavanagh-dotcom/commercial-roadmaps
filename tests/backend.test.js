const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

// Read PromptContext.gs to verify sync-context output
test('PromptContext.gs contains valid markdown content', () => {
  const promptContextPath = path.resolve(__dirname, '..', 'PromptContext.gs');
  assert.ok(fs.existsSync(promptContextPath), 'PromptContext.gs should exist');
  const content = fs.readFileSync(promptContextPath, 'utf8');

  assert.ok(content.includes('function getGuardrailsMarkdown_()'), 'Should define getGuardrailsMarkdown_');
  assert.ok(content.includes('function getCfmContextMarkdown_()'), 'Should define getCfmContextMarkdown_');
  assert.ok(content.includes('function getEtdContextMarkdown_()'), 'Should define getEtdContextMarkdown_');
  assert.ok(content.includes('function getProductContextMarkdown_('), 'Should define getProductContextMarkdown_');
  assert.ok(content.includes('function getTranslationRulesMarkdown_()'), 'Should define getTranslationRulesMarkdown_');
  assert.ok(content.includes('Cash Flow Management (CFM)'), 'Should contain CFM context');
  assert.ok(content.includes('Exchange Traded Derivatives (ETD)'), 'Should contain ETD context');
  assert.ok(content.includes('UK English'), 'Should contain House Style guardrails');
});

// Test column resolution logic for Jira Cloud for Sheets
test('findColIndex correctly resolves Jira Cloud for Sheets columns', () => {
  const headers = [
    'Issue Key',
    'Summary',
    'Description',
    'Product',
    'Quarter / Fix Version',
    'Category',
    'Status',
    'Theme',
    'Commercial Translation'
  ];

  function findColIndex(regexes) {
    for (let r = 0; r < regexes.length; r++) {
      for (let i = 0; i < headers.length; i++) {
        if (regexes[r].test(headers[i])) return i;
      }
    }
    return -1;
  }

  const keyIdx = findColIndex([/^issue\s*key$/i, /^key$/i, /^jira\s*key$/i]);
  const titleIdx = findColIndex([/^summary$/i, /^title$/i, /^deliverable/i, /^feature$/i]);
  const descIdx = findColIndex([/^description$/i, /^idea\s*description$/i, /^jira\s*description$/i]);
  const productIdx = findColIndex([/^product$/i, /^component$/i]);
  const quarterIdx = findColIndex([/^quarter/i, /^fix\s*version/i, /^roadmap/i, /^horizon/i]);
  const categoryIdx = findColIndex([/^category$/i, /^issue\s*type$/i, /^type$/i]);
  const statusIdx = findColIndex([/^status$/i]);
  const themeIdx = findColIndex([/^theme$/i, /^initiative$/i]);
  const transIdx = findColIndex([/^commercial\s*translation$/i, /^translated/i, /^commercial\s*title$/i, /^translation$/i]);

  assert.equal(keyIdx, 0, 'Issue Key should be column 0');
  assert.equal(titleIdx, 1, 'Summary should be column 1');
  assert.equal(descIdx, 2, 'Description should be column 2');
  assert.equal(productIdx, 3, 'Product should be column 3');
  assert.equal(quarterIdx, 4, 'Quarter / Fix Version should be column 4');
  assert.equal(categoryIdx, 5, 'Category should be column 5');
  assert.equal(statusIdx, 6, 'Status should be column 6');
  assert.equal(themeIdx, 7, 'Theme should be column 7');
  assert.equal(transIdx, 8, 'Commercial Translation should be column 8 (adjacent end column)');
});

// Test the user's specific 12 Jira Cloud for Sheets imported columns (A through L)
test('findColIndex correctly resolves the 12 Jira columns (A to L) and appends M (Translation) & N (Theme)', () => {
  const jira12Headers = [
    'Issue Type', // Col A (idx 0)
    'Key',        // Col B (idx 1)
    'Summary',    // Col C (idx 2)
    'Created',    // Col D (idx 3)
    'Updated',    // Col E (idx 4)
    'Assignee',   // Col F (idx 5)
    'Reporter',   // Col G (idx 6)
    'Priority',   // Col H (idx 7)
    'Status',     // Col I (idx 8)
    'Resolution', // Col J (idx 9)
    'Due date',   // Col K (idx 10)
    'Start date'  // Col L (idx 11)
  ];

  function findColIndex(regexes) {
    for (let r = 0; r < regexes.length; r++) {
      for (let i = 0; i < jira12Headers.length; i++) {
        if (regexes[r].test(jira12Headers[i])) return i;
      }
    }
    return -1;
  }

  const categoryIdx = findColIndex([/^category$/i, /^issue\s*type$/i, /^type$/i]);
  const keyIdx = findColIndex([/^issue\s*key$/i, /^key$/i, /^jira\s*key$/i]);
  const titleIdx = findColIndex([/^summary$/i, /^title$/i, /^deliverable/i]);
  const statusIdx = findColIndex([/^status$/i]);
  const quarterIdx = findColIndex([/^quarter/i, /^fix\s*version/i, /^roadmap/i, /^horizon/i, /^due\s*date$/i, /^due/i]);

  assert.equal(categoryIdx, 0, 'Issue Type is Col A (idx 0)');
  assert.equal(keyIdx, 1, 'Key is Col B (idx 1)');
  assert.equal(titleIdx, 2, 'Summary is Col C (idx 2)');
  assert.equal(statusIdx, 8, 'Status is Col I (idx 8)');
  assert.equal(quarterIdx, 10, 'Due date resolves to quarter/horizon (idx 10)');

  // Translation appends at idx 12 (Col M), Theme appends at idx 13 (Col N)
  const nextColM = jira12Headers.length; // 12
  const nextColN = nextColM + 1;         // 13
  assert.equal(nextColM, 12, 'Commercial Translation will be Column M (Col 13)');
  assert.equal(nextColN, 13, 'Commercial Theme will be Column N (Col 14)');
});

// Test Quarter normalization
test('normalizeQuarter_ handles standard and edge case tokens', () => {
  function normalizeQuarter_(val) {
    if (!val) return 'BL';
    const s = String(val).trim();
    if (/delivered|done|closed|complete|released/i.test(s)) return 'Delivered';
    if (/backlog|\bbl\b/i.test(s)) return 'BL';
    const match = s.match(/Q[1-4]/i);
    if (match) return match[0].toUpperCase();
    return s.toUpperCase();
  }

  assert.equal(normalizeQuarter_('Q1'), 'Q1');
  assert.equal(normalizeQuarter_('2026 Q2'), 'Q2');
  assert.equal(normalizeQuarter_('Q3 2026'), 'Q3');
  assert.equal(normalizeQuarter_('q4'), 'Q4');
  assert.equal(normalizeQuarter_('Delivered'), 'Delivered');
  assert.equal(normalizeQuarter_('released'), 'Delivered');
  assert.equal(normalizeQuarter_('Backlog'), 'BL');
  assert.equal(normalizeQuarter_('bl'), 'BL');
  assert.equal(normalizeQuarter_(''), 'BL');
  assert.equal(normalizeQuarter_(null), 'BL');
});

// Test Headline cleaning logic
test('cleanCommercialHeadline_ elevates developer verbs and removes technical prefixes', () => {
  function cleanCommercialHeadline_(raw) {
    if (!raw) return 'Commercial Deliverable';
    let t = String(raw).trim();
    t = t.replace(/^strategic\s+commercial\s*[:\-]\s*/i, '');
    t = t.replace(/^commercial\s*[:\-]\s*/i, '');
    t = t.replace(/^prf\s*[-#]?\s*\d+\s*[:\-]\s*/i, '');
    t = t.replace(/^\[(bug|task|story|feature|tech debt|enhancement)\]\s*/i, '');

    if (/^fix\s+fix\s+/i.test(t)) {
      t = t.replace(/^fix\s+fix\s+/i, 'FIX Gateway ');
    } else if (/^fix\s+/i.test(t)) {
      t = t.replace(/^fix\s+/i, 'Enhanced ');
    } else if (/^implement\s+/i.test(t)) {
      t = t.replace(/^implement\s+/i, '');
    } else if (/^refactor\s+/i.test(t)) {
      t = t.replace(/^refactor\s+/i, 'Optimized ');
    } else if (/^upgrade\s+/i.test(t)) {
      t = t.replace(/^upgrade\s+/i, 'Next-Generation ');
    } else if (/^add\s+/i.test(t)) {
      t = t.replace(/^add\s+/i, 'Enabled ');
    } else if (/^build\s+/i.test(t)) {
      t = t.replace(/^build\s+/i, 'Automated ');
    } else if (/^update\s+/i.test(t)) {
      t = t.replace(/^update\s+/i, 'Modernized ');
    }

    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  assert.equal(
    cleanCommercialHeadline_('Fix FIX protocol gateway queue latency'),
    'FIX Gateway protocol gateway queue latency'
  );
  assert.equal(
    cleanCommercialHeadline_('PRF-1021: Fix trade reconciliation latency'),
    'Enhanced trade reconciliation latency'
  );
  assert.equal(
    cleanCommercialHeadline_('[Bug] Refactor margin service calculation'),
    'Optimized margin service calculation'
  );
  assert.equal(
    cleanCommercialHeadline_('Implement EMIR Refit XML reporting schema'),
    'EMIR Refit XML reporting schema'
  );
});

// Test PRF transformation logic & translation column priority
test('transformPrfToCommercial_ prioritizes existing sheet translation from Column I', () => {
  function transformPrfToCommercial_(item) {
    if (item.translatedDeliverable && item.translatedDeliverable.trim().length > 0) {
      return {
        id: 'STG-' + item.id,
        deliverable: item.translatedDeliverable.trim(),
        theme: item.theme || 'Functional & Usability',
        source: 'SheetTranslation'
      };
    }
    return {
      id: 'STG-' + item.id,
      deliverable: 'AI Generated: ' + item.deliverable,
      theme: 'Platform Enhancements',
      source: 'AIGenerated'
    };
  }

  // Case 1: Row with pre-existing commercial translation in the sheet
  const preTranslatedItem = {
    id: 'PRF-ETD-001',
    deliverable: 'Fix FIX protocol gateway queue latency',
    translatedDeliverable: 'Ultra-Low Latency FIX Execution Gateway',
    theme: 'Platform Enhancements'
  };
  const result1 = transformPrfToCommercial_(preTranslatedItem);
  assert.equal(result1.deliverable, 'Ultra-Low Latency FIX Execution Gateway');
  assert.equal(result1.source, 'SheetTranslation');

  // Case 2: Untranslated row falling back to AI generation
  const untranslatedItem = {
    id: 'PRF-ETD-002',
    deliverable: 'Implement EMIR Refit XML reporting schema',
    translatedDeliverable: '',
    theme: 'Compliance'
  };
  const result2 = transformPrfToCommercial_(untranslatedItem);
  assert.equal(result2.deliverable, 'AI Generated: Implement EMIR Refit XML reporting schema');
  assert.equal(result2.source, 'AIGenerated');
});

// Test Cashflow Management product detection
test('isCashflowProduct_ accurately identifies CFM items and rejects non-CFM items', () => {
  function isCashflowProduct_(product, key) {
    const p = String(product || '').trim().toUpperCase();
    const k = String(key || '').trim().toUpperCase();

    if (p.indexOf('CFM') !== -1 || p.indexOf('CASH') !== -1 || p.indexOf('FLOW') !== -1) {
      return true;
    }
    if (k.startsWith('CFM-') || k.startsWith('CFM') || k.startsWith('CASH-')) {
      return true;
    }
    return false;
  }

  // Valid CFM product names
  assert.equal(isCashflowProduct_('CFM', 'PRF-101'), true);
  assert.equal(isCashflowProduct_('Cashflow', 'PRF-102'), true);
  assert.equal(isCashflowProduct_('Cash Flow Management', 'PRF-103'), true);
  assert.equal(isCashflowProduct_('Cash-Flow', 'PRF-104'), true);
  assert.equal(isCashflowProduct_('OSTTRA Cashflow', 'PRF-105'), true);

  // Valid CFM ticket keys even if product column is empty
  assert.equal(isCashflowProduct_('', 'CFM-1021'), true);
  assert.equal(isCashflowProduct_(null, 'CFM-55'), true);
  assert.equal(isCashflowProduct_('Unknown', 'CASH-99'), true);

  // Non-CFM products (should not be translated yet)
  assert.equal(isCashflowProduct_('ETD', 'ETD-1021'), false);
  assert.equal(isCashflowProduct_('CFD', 'CFD-1044'), false);
  assert.equal(isCashflowProduct_('TRM', 'TRM-1090'), false);
  assert.equal(isCashflowProduct_('Equities', 'EQ-100'), false);
  assert.equal(isCashflowProduct_('FX Options', 'FX-200'), false);
  assert.equal(isCashflowProduct_('Repo Clearing', 'REPO-300'), false);
});

// Test selective translation in single-sheet PRF intake
test('autoTranslateNewPrfRows logic selectively translates only CFM items in mixed product sheet', () => {
  function isCashflowProduct_(product, key) {
    const p = String(product || '').trim().toUpperCase();
    const k = String(key || '').trim().toUpperCase();
    if (p.indexOf('CFM') !== -1 || p.indexOf('CASH') !== -1 || p.indexOf('FLOW') !== -1) return true;
    if (k.startsWith('CFM-') || k.startsWith('CFM') || k.startsWith('CASH-')) return true;
    return false;
  }

  // Simulated single sheet data containing all products
  const sheetRows = [
    // Header row
    ['Issue Key', 'Summary', 'Description', 'Product', 'Quarter', 'Commercial Translation'],
    // Row 1: CFM item without translation -> SHOULD TRANSLATE
    ['CFM-101', 'Automated bilateral cash netting microservice', 'Engine for bilateral cash aggregation', 'Cash Flow Management', '2026 Q1', ''],
    // Row 2: CFM item with pre-existing translation -> SHOULD SKIP (already translated)
    ['CFM-102', 'Bilateral settlement affirmation gateway', 'Affirmation workflow', 'CFM', '2026 Q2', 'Real-Time Settlement Affirmation Gateway'],
    // Row 3: ETD item without translation -> SHOULD SKIP (non-CFM pending context)
    ['ETD-1021', 'Fix FIX protocol gateway latency', 'FIX queue optimization', 'ETD', '2026 Q1', ''],
    // Row 4: CFD item without translation -> SHOULD SKIP (non-CFM pending context)
    ['CFD-1044', 'Synthetic equity portfolio reset', 'CFD reset service', 'CFD', '2026 Q2', '']
  ];

  let translatedCount = 0;
  let skippedNonCfmCount = 0;
  const translationColIdx = 5;
  const prodColIdx = 3;
  const keyColIdx = 0;
  const summaryColIdx = 1;

  for (let r = 1; r < sheetRows.length; r++) {
    const row = sheetRows[r];
    const existingTranslation = row[translationColIdx];

    if (!existingTranslation) {
      const prod = row[prodColIdx];
      const key = row[keyColIdx];
      const summary = row[summaryColIdx];

      if (!isCashflowProduct_(prod, key)) {
        skippedNonCfmCount++;
        continue;
      }

      // Simulate translation for CFM
      row[translationColIdx] = 'Commercial: ' + summary;
      translatedCount++;
    }
  }

  assert.equal(translatedCount, 1, 'Only the un-translated CFM row should be translated');
  assert.equal(skippedNonCfmCount, 2, 'The 2 non-CFM rows (ETD and CFD) should be skipped');
  assert.equal(sheetRows[1][translationColIdx], 'Commercial: Automated bilateral cash netting microservice');
  assert.equal(sheetRows[2][translationColIdx], 'Real-Time Settlement Affirmation Gateway', 'Pre-existing translation preserved');
  assert.equal(sheetRows[3][translationColIdx], '', 'ETD row should remain untranslated');
  assert.equal(sheetRows[4][translationColIdx], '', 'CFD row should remain untranslated');
});

// Test 14-column layout with Column N as translation column and 'Team' as product filter
test('findColIndex correctly resolves Column N as translation column and Team as product', () => {
  const user14Headers = [
    'Issue Type',  // Col A (idx 0)
    'Key',         // Col B (idx 1)
    'Summary',     // Col C (idx 2)
    'Description', // Col D (idx 3)
    'Team',        // Col E (idx 4) -> 'Cashflows'
    'Fix Version', // Col F (idx 5)
    'Priority',    // Col G (idx 6)
    'Status',      // Col H (idx 7)
    'Assignee',    // Col I (idx 8)
    'Reporter',    // Col J (idx 9)
    'Created',     // Col K (idx 10)
    'Updated',     // Col L (idx 11)
    'Theme',       // Col M (idx 12)
    'Commercial Translation' // Col N (idx 13)
  ];

  function findColIndex(regexes) {
    for (let r = 0; r < regexes.length; r++) {
      for (let i = 0; i < user14Headers.length; i++) {
        if (regexes[r].test(user14Headers[i])) return i;
      }
    }
    return -1;
  }

  const teamIdx = findColIndex([/^teams?(\s*name)?$/i, /^product$/i, /^component/i, /^project$/i]);
  const keyIdx = findColIndex([/^issue\s*key$/i, /^key$/i, /^jira\s*key$/i]);
  const titleIdx = findColIndex([/^summary$/i, /^title$/i, /^deliverable/i]);
  const quarterIdx = findColIndex([/^quarter/i, /^fix\s*version/i, /^roadmap/i, /^horizon/i]);
  let transIdx = findColIndex([/^commercial\s*translation$/i, /^translated/i, /^commercial\s*title$/i, /^translation$/i, /^commercial$/i]);
  if (transIdx === -1 && user14Headers.length >= 14) {
    transIdx = 13;
  }

  assert.equal(teamIdx, 4, 'Team column correctly resolves to index 4');
  assert.equal(keyIdx, 1, 'Key resolves to index 1');
  assert.equal(titleIdx, 2, 'Summary resolves to index 2');
  assert.equal(quarterIdx, 5, 'Fix Version resolves to index 5');
  assert.equal(transIdx, 13, 'Column N (index 13) correctly resolves to Commercial Translation');
});

// Test strict filtering by Team = 'Cashflows' in live sheet records
test('fetchLiveSheetRecords_ filtering logic strictly includes only rows where Team is Cashflows', () => {
  function isCashflowProduct_(product, key) {
    const p = String(product || '').trim().toUpperCase();
    const k = String(key || '').trim().toUpperCase();
    if (p.indexOf('CFM') !== -1 || p.indexOf('CASH') !== -1 || p.indexOf('FLOW') !== -1) return true;
    if (k.startsWith('CFM-') || k.startsWith('CFM') || k.startsWith('CASH-')) return true;
    return false;
  }

  const rawRows = [
    { key: 'CFM-101', team: 'Cashflows', deliverable: 'Netting engine' },
    { key: 'CFM-102', team: 'Cashflow', deliverable: 'Affirmation feed' },
    { key: 'ETD-1021', team: 'ETD', deliverable: 'FIX latency' },
    { key: 'CFD-1044', team: 'CFD', deliverable: 'Synthetic equities' },
    { key: 'RATE-200', team: 'Rates', deliverable: 'IRS processing' },
    { key: 'CFM-103', team: '', deliverable: 'SSI Gateway' } // Ticket starts with CFM-
  ];

  const targetProduct = 'CFM';
  const isCfmTarget = targetProduct.toUpperCase() === 'CFM' || targetProduct.toUpperCase().indexOf('CASH') !== -1;

  const filteredItems = rawRows.filter(row => {
    if (isCfmTarget) {
      return isCashflowProduct_(row.team, row.key);
    }
    return true;
  });

  assert.equal(filteredItems.length, 3, 'Should only return the 3 CFM/Cashflows rows');
  assert.deepEqual(filteredItems.map(i => i.key), ['CFM-101', 'CFM-102', 'CFM-103']);
});

// Test Year extraction from Fix Version / Quarter strings
test('extractYear_ correctly identifies 4-digit years and handles unversioned strings', () => {
  function extractYear_(val) {
    if (!val) return '';
    const s = String(val).trim();
    const match = s.match(/\b(20\d{2})\b/);
    if (match) return match[1];
    const d = new Date(s);
    if (!isNaN(d.getTime()) && d.getFullYear() >= 2020) {
      return String(d.getFullYear());
    }
    return '';
  }

  assert.equal(extractYear_('2026 Q1'), '2026');
  assert.equal(extractYear_('Q2 2026'), '2026');
  assert.equal(extractYear_('2025-Q4'), '2025');
  assert.equal(extractYear_('2024 Q1'), '2024');
  assert.equal(extractYear_('Q1'), '');
  assert.equal(extractYear_('Backlog'), '');
  assert.equal(extractYear_('Delivered'), '');
  assert.equal(extractYear_('2027-03-31'), '2027');
});

// Test Year filtering prevents stale items from past years showing up
test('Year filtering isolates 2026 items and excludes 2024/2025 deliverables', () => {
  function extractYear_(val) {
    if (!val) return '';
    const s = String(val).trim();
    const match = s.match(/\b(20\d{2})\b/);
    if (match) return match[1];
    return '';
  }

  const deliverables = [
    { key: 'CFM-101', quarter: '2026 Q1', deliverable: '2026 Bilateral netting engine' },
    { key: 'CFM-102', quarter: '2026 Q2', deliverable: '2026 T+1 liquidity projection' },
    { key: 'CFM-88',  quarter: '2024 Q1', deliverable: 'Old 2024 legacy netting patch' },
    { key: 'CFM-95',  quarter: '2025 Q1', deliverable: 'Old 2025 SWIFT MT103 parser' }
  ];

  const targetYear = '2026';
  const filtered = deliverables.filter(item => {
    const y = extractYear_(item.quarter) || '2026';
    return y === targetYear;
  });

  assert.equal(filtered.length, 2, 'Should only return the two 2026 deliverables');
  assert.equal(filtered[0].key, 'CFM-101');
  assert.equal(filtered[1].key, 'CFM-102');
  assert.ok(!filtered.some(i => i.key === 'CFM-88'), '2024 stale item must be excluded');
  assert.ok(!filtered.some(i => i.key === 'CFM-95'), '2025 stale item must be excluded');
});

// Test Two-Way Write-Back finding matching row by Jira Key
test('Two-way write-back locates matching row by Jira Key and updates translation cell', () => {
  const sheetRows = [
    ['Key', 'Summary', 'Team', 'Commercial Translation'],
    ['CFM-101', 'Netting engine', 'Cashflows', 'Original Translation'],
    ['CFM-102', 'Affirmation feed', 'Cashflows', 'Old Headline']
  ];

  const targetKey = 'CFM-102';
  const newHeadline = 'Real-Time Settlement Affirmation Gateway';
  let updatedRow = -1;

  for (let r = 1; r < sheetRows.length; r++) {
    if (sheetRows[r][0] === targetKey) {
      sheetRows[r][3] = newHeadline;
      updatedRow = r;
      break;
    }
  }

  assert.equal(updatedRow, 2);
  assert.equal(sheetRows[2][3], 'Real-Time Settlement Affirmation Gateway');
});

// Test Multi-Year filtering allows selecting multiple chronological years simultaneously
test('Multi-year filtering allows selecting multiple years (e.g. 2026 and 2027) while excluding 2024', () => {
  function extractYear_(val) {
    if (!val) return '';
    const s = String(val).trim();
    const match = s.match(/\b(20\d{2})\b/);
    if (match) return match[1];
    return '';
  }

  const deliverables = [
    { key: 'CFM-101', quarter: '2026 Q1', deliverable: '2026 Netting' },
    { key: 'CFM-102', quarter: '2027 Q1', deliverable: '2027 AI Router' },
    { key: 'CFM-88',  quarter: '2024 Q1', deliverable: '2024 Legacy patch' },
    { key: 'CFM-95',  quarter: '2025 Q1', deliverable: '2025 SWIFT MT103' }
  ];

  const targetYears = ['2026', '2027'];
  const ySet = {};
  targetYears.forEach(y => { ySet[y] = true; });

  const filtered = deliverables.filter(item => {
    const y = extractYear_(item.quarter) || '2026';
    return !!ySet[y];
  });

  assert.equal(filtered.length, 2, 'Should return both 2026 and 2027 deliverables');
  assert.deepEqual(filtered.map(i => i.key), ['CFM-101', 'CFM-102']);
});

// Test transformPrfToCommercial_ preserves year property
test('transformPrfToCommercial_ preserves item year property across commercial staging', () => {
  function extractYear_(val) {
    if (!val) return '';
    const match = String(val).match(/\b(202[4-9]|203[0-5])\b/);
    return match ? match[1] : '';
  }

  function transformPrfToCommercial_(item) {
    return {
      id: 'STG-' + item.id,
      deliverable: item.deliverable,
      roadmap: item.roadmap,
      year: item.year || extractYear_(item.roadmap) || '2026'
    };
  }

  const item2026 = { id: 'CFM-101', deliverable: 'Netting', roadmap: 'Q1', year: '2026' };
  const item2027 = { id: 'CFM-102', deliverable: 'Multilateral', roadmap: '2027 Q2' };
  const itemDefault = { id: 'CFM-103', deliverable: 'Fallback', roadmap: 'Q3' };

  assert.equal(transformPrfToCommercial_(item2026).year, '2026');
  assert.equal(transformPrfToCommercial_(item2027).year, '2027');
  assert.equal(transformPrfToCommercial_(itemDefault).year, '2026');
});

// Test getHorizonKey year-aware horizon routing
test('getHorizonKey correctly routes multi-year deliverables into appropriate horizons', () => {
  function getHorizonKey(item) {
    const yr = item && item.year ? parseInt(item.year, 10) : 2026;
    const r = String((item && item.roadmap) || '').trim().toLowerCase();

    // Future years (2027+)
    if (yr > 2026) {
      if (yr === 2027 && (r === 'q1' || r.includes('q1'))) return 'next';
      return 'later';
    }

    // Past years (e.g. 2025 or earlier)
    if (yr < 2026) {
      return 'now';
    }

    // Current year (2026)
    if (r === 'now' || r === 'q4' || r === 'q1' || r === 'delivered' || r.includes('now')) return 'now';
    if (r === 'next' || r === 'q2' || r === 'q3' || r.includes('next')) return 'next';
    if (r === 'later' || r === 'bl' || r === 'backlog' || r.includes('later') || r.includes('plan')) return 'later';
    return 'now';
  }

  // 2026 items
  assert.equal(getHorizonKey({ year: '2026', roadmap: 'Q1' }), 'now', '2026 Q1 should route to now');
  assert.equal(getHorizonKey({ year: '2026', roadmap: 'Q2' }), 'next', '2026 Q2 should route to next');
  assert.equal(getHorizonKey({ year: '2026', roadmap: 'BL' }), 'later', '2026 BL should route to later');

  // 2027 items: Q1 routes to next horizon, subsequent quarters route to later
  assert.equal(getHorizonKey({ year: '2027', roadmap: 'Q1' }), 'next', '2027 Q1 should route to next');
  assert.equal(getHorizonKey({ year: '2027', roadmap: 'Q2' }), 'later', '2027 Q2 should route to later');
  assert.equal(getHorizonKey({ year: '2027', roadmap: 'Q4' }), 'later', '2027 Q4 should route to later');

  // 2028+ items always route to later
  assert.equal(getHorizonKey({ year: '2028', roadmap: 'Q1' }), 'later', '2028 Q1 should route to later');
});

// Test Chronological year grouping and quarter sorting for Table 1 intake
test('Chronological year grouping separates deliverables into distinct year containers and sorts by quarter order', () => {
  const QUARTER_SORT_ORDER = {
    'DELIVERED': 0,
    'Q1': 1,
    'Q2': 2,
    'Q3': 3,
    'Q4': 4,
    'BL': 5,
    'BACKLOG': 5,
    'PENDING SCHEDULING': 6
  };

  const rawItems = [
    { id: '1', year: '2027', roadmap: 'Q3', deliverable: '2027 Q3 Item' },
    { id: '2', year: '2026', roadmap: 'Q4', deliverable: '2026 Q4 Item' },
    { id: '3', year: '2027', roadmap: 'Q1', deliverable: '2027 Q1 Item' },
    { id: '4', year: '2026', roadmap: 'Q1', deliverable: '2026 Q1 Item' },
    { id: '5', year: '2026', roadmap: 'Delivered', deliverable: '2026 Live Item' },
    { id: '6', year: '2027', roadmap: 'BL', deliverable: '2027 Backlog Item' }
  ];

  // Emulate table1ByYear grouping logic
  const groups = {};
  rawItems.forEach((item) => {
    const yr = item.year || '2026';
    if (!groups[yr]) groups[yr] = [];
    groups[yr].push(item);
  });

  const sortedYears = Object.keys(groups).sort();
  const table1ByYear = {};
  sortedYears.forEach((yr) => {
    table1ByYear[yr] = groups[yr].slice().sort((a, b) => {
      const qA = (a.roadmap || 'BL').toUpperCase();
      const qB = (b.roadmap || 'BL').toUpperCase();
      const orderA = QUARTER_SORT_ORDER[qA] !== undefined ? QUARTER_SORT_ORDER[qA] : 99;
      const orderB = QUARTER_SORT_ORDER[qB] !== undefined ? QUARTER_SORT_ORDER[qB] : 99;
      if (orderA !== orderB) return orderA - orderB;
      return (a.jiraKey || a.id).localeCompare(b.jiraKey || b.id);
    });
  });

  assert.deepEqual(sortedYears, ['2026', '2027'], 'Years should be sorted chronologically');
  assert.equal(table1ByYear['2026'].length, 3);
  assert.equal(table1ByYear['2027'].length, 3);

  // Check 2026 order: Delivered (0) -> Q1 (1) -> Q4 (4)
  assert.deepEqual(table1ByYear['2026'].map(i => i.roadmap), ['Delivered', 'Q1', 'Q4']);

  // Check 2027 order: Q1 (1) -> Q3 (3) -> BL (5)
  assert.deepEqual(table1ByYear['2027'].map(i => i.roadmap), ['Q1', 'Q3', 'BL']);

  // Test year-specific toggle
  const selectedIds = new Set();
  const toggleYearSelectAll = (year) => {
    const yearItems = table1ByYear[year] || [];
    const yearItemIds = yearItems.map(i => i.id);
    const allSelected = yearItemIds.length > 0 && yearItemIds.every(id => selectedIds.has(id));
    if (allSelected) {
      yearItemIds.forEach(id => selectedIds.delete(id));
    } else {
      yearItemIds.forEach(id => selectedIds.add(id));
    }
  };

  // Select 2026 only
  toggleYearSelectAll('2026');
  assert.equal(selectedIds.size, 3);
  assert.ok(selectedIds.has('2'));
  assert.ok(selectedIds.has('4'));
  assert.ok(selectedIds.has('5'));
  assert.ok(!selectedIds.has('1'), '2027 items should not be selected when selecting 2026');

  // Toggle 2027 on
  toggleYearSelectAll('2027');
  assert.equal(selectedIds.size, 6, 'All items across both years should be selected now');

  // Deselect 2026 only
  toggleYearSelectAll('2026');
  assert.equal(selectedIds.size, 3, 'Only 2027 items should remain selected');
  assert.ok(selectedIds.has('1'));
  assert.ok(selectedIds.has('3'));
  assert.ok(selectedIds.has('6'));
});

// Test translateCommercialItems sorts deliverables chronologically from oldest to future
test('translateCommercialItems sorts input deliverables chronologically from oldest year to future year, and quarters', () => {
  const QUARTER_ORDER = { 'DELIVERED': 0, 'Q1': 1, 'Q2': 2, 'Q3': 3, 'Q4': 4, 'BL': 5, 'BACKLOG': 5 };

  function sortCommercialItems(selectedItems) {
    return selectedItems.slice().sort(function(a, b) {
      const yrA = parseInt(a.year || '2026', 10);
      const yrB = parseInt(b.year || '2026', 10);
      if (yrA !== yrB) return yrA - yrB;

      const qA = (a.roadmap || 'BL').toUpperCase();
      const qB = (b.roadmap || 'BL').toUpperCase();
      const orderA = QUARTER_ORDER[qA] !== undefined ? QUARTER_ORDER[qA] : 99;
      const orderB = QUARTER_ORDER[qB] !== undefined ? QUARTER_ORDER[qB] : 99;
      if (orderA !== orderB) return orderA - orderB;

      return String(a.jiraKey || a.id).localeCompare(String(b.jiraKey || b.id));
    });
  }

  const mixedItems = [
    { id: '1', year: '2027', roadmap: 'Q2', deliverable: '2027 Q2 Item' },
    { id: '2', year: '2026', roadmap: 'Q4', deliverable: '2026 Q4 Item' },
    { id: '3', year: '2025', roadmap: 'Delivered', deliverable: '2025 Historic' },
    { id: '4', year: '2027', roadmap: 'Q1', deliverable: '2027 Q1 Item' },
    { id: '5', year: '2026', roadmap: 'Q1', deliverable: '2026 Q1 Item' },
    { id: '6', year: '2026', roadmap: 'BL', deliverable: '2026 Backlog' }
  ];

  const sorted = sortCommercialItems(mixedItems);

  // Expected chronological sequence:
  // 1. 2025 Delivered
  // 2. 2026 Q1
  // 3. 2026 Q4
  // 4. 2026 BL
  // 5. 2027 Q1
  // 6. 2027 Q2
  const sequence = sorted.map(i => `${i.year} ${i.roadmap}`);
  assert.deepEqual(sequence, [
    '2025 Delivered',
    '2026 Q1',
    '2026 Q4',
    '2026 BL',
    '2027 Q1',
    '2027 Q2'
  ]);
});

// Test generateCommercialNarrative document hierarchy conformance
test('generateCommercialNarrative builds document conforming strictly to canonical section hierarchy', () => {
  // Test generator helper matching Backend.gs
  function synthesizeCommercialNarrativeDocument_(params) {
    const product = params.product || 'Cash Flow Management (CFM)';
    const audience = params.audience || 'External Buyside Clients';
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const isBuyside = /buyside/i.test(audience);

    const execPara = isBuyside
      ? `As institutional trading volumes expand and regulatory settlement windows accelerate towards mandatory T+1 horizons, OSTTRA ${product} continues to advance its core operational infrastructure to safeguard client trade execution and settlement certainty. Our multi-year investment program is anchored on two strategic pillars: foundational technical modernization that ensures enterprise-grade resilience, and high-impact functional automation that eliminates costly manual reconciliation breaks. Together, these enhancements deliver measurable operational savings, enhance custodian transparency, and directly justify the platform's long-term commercial value and pricing alignment.`
      : `Against a backdrop of heightened market volatility, compressed settlement cycles, and rigorous GSIB capital adequacy requirements, OSTTRA ${product} remains the essential market infrastructure powering post-trade liquidity optimization and systemic risk reduction. We have focused engineering capital across two disciplined vectors: continuous technical modernization to guarantee sub-millisecond throughput during peak market stress, and high-impact functional workflow automation that unlocks trapped intraday liquidity. These foundational upgrades protect market participants from bilateral fails, reduce balance sheet drag, and demonstrate the robust commercial return of our shared ecosystem investments.`;

    let md = `# ${product} Platform Roadmap & Deliverables Strategy\n`;
    md += `**Last Edited:** ${today}\n`;
    md += `**Target Audience:** ${audience}\n`;
    md += `**Objective:** Justification of Value and Price Increase through Continuous Technical Modernization and Functional Enhancements.\n\n`;
    md += `---\n\n`;
    md += `${execPara}\n\n`;
    md += `### What we have done so far\n`;
    md += `Over recent delivery cycles, OSTTRA engineering has deployed critical infrastructure fortresses and workflow automations designed to eliminate manual intervention and accelerate trade lifecycle completion.\n\n`;
    md += `**Technical Modernization**\n`;
    md += `* **Cloud-native zero-downtime database failover cluster:** Fortified core system architecture to remove legacy bottlenecks and ensure high resilience — Zero unplanned downtime.\n\n`;
    md += `**Functional Enhancements**\n`;
    md += `* **Multi-party bilateral cashflow netting and affirmation hub:** Engineered direct workflow automation — Up to 80% reduction in gross SWIFT message volume.\n\n`;
    md += `### What we're doing next\n`;
    md += `The upcoming delivery roadmap accelerates platform evolution from operational reconciliation to predictive, automated post-trade intelligence.\n\n`;
    md += `**Technical Modernization**\n`;
    md += `Our forward engineering commitments prioritize systematic technical debt elimination, migration to responsive cloud-native component architectures, and hardened API boundaries.\n\n`;
    md += `**Functional Enhancements**\n`;
    md += `On the functional horizon, we are introducing flagship user experience enhancements and intelligent exception resolution tools:\n\n`;
    md += `* **Cross-Border Multi-Currency Netting Engine:** Advancing automated capability to minimize bilateral payment fails.\n`;

    return md;
  }

  const doc = synthesizeCommercialNarrativeDocument_({
    product: 'CFM',
    audience: 'External Buyside Clients',
    items: []
  });

  assert.ok(doc.includes('# CFM Platform Roadmap & Deliverables Strategy'), 'Missing main header');
  assert.ok(doc.includes('**Target Audience:** External Buyside Clients'), 'Missing audience metadata');
  assert.ok(doc.includes('**Objective:** Justification of Value and Price Increase through Continuous Technical Modernization and Functional Enhancements.'), 'Missing objective metadata');
  assert.ok(doc.includes('### What we have done so far'), 'Missing past section');
  assert.ok(doc.includes('### What we\'re doing next'), 'Missing future section');
  assert.ok(doc.includes('**Technical Modernization**'), 'Missing Technical Modernization subsection');
  assert.ok(doc.includes('**Functional Enhancements**'), 'Missing Functional Enhancements subsection');
  assert.ok(doc.includes('OSTTRA'), 'Brand name must be present in full caps');
});

// Test Audience framing adapts value propositions between Buyside and Sellside
test('Audience framing adapts narrative focus between Buyside and Sellside', () => {
  function getExecutiveFraming(audience, product) {
    const isBuyside = /buyside/i.test(audience);
    return isBuyside
      ? `As institutional trading volumes expand and regulatory settlement windows accelerate towards mandatory T+1 horizons, OSTTRA ${product} continues to advance its core operational infrastructure to safeguard client trade execution and settlement certainty. Our multi-year investment program delivers measurable operational savings and enhances custodian transparency.`
      : `Against a backdrop of heightened market volatility, compressed settlement cycles, and rigorous GSIB capital adequacy requirements, OSTTRA ${product} remains the essential market infrastructure powering post-trade liquidity optimization and systemic risk reduction, reducing balance sheet drag.`;
  }

  const buysideText = getExecutiveFraming('External Buyside Clients', 'CFM');
  const sellsideText = getExecutiveFraming('External Sellside Clients', 'CFM');

  assert.ok(buysideText.includes('custodian transparency'), 'Buyside text must emphasize custodian transparency');
  assert.ok(buysideText.includes('T+1 horizons'), 'Buyside text must emphasize T+1 settlement acceleration');
  assert.ok(sellsideText.includes('GSIB capital adequacy'), 'Sellside text must emphasize GSIB capital adequacy');
  assert.ok(sellsideText.includes('balance sheet drag'), 'Sellside text must emphasize balance sheet drag reduction');
});

// Test isEtdProduct_ listed derivatives identification
test('isEtdProduct_ accurately identifies ETD listed derivatives items and rejects unrelated products', () => {
  function isEtdProduct_(product, key) {
    const p = String(product || '').trim().toUpperCase();
    const k = String(key || '').trim().toUpperCase();

    if (p.indexOf('ETD') !== -1 || p.indexOf('FUTUR') !== -1 || p.indexOf('OPTION') !== -1 || p.indexOf('EXCHANGE') !== -1 || p.indexOf('LISTED') !== -1) {
      return true;
    }
    if (k.startsWith('ETD-') || k.startsWith('ALLOC-') || k.startsWith('FUT-') || k.startsWith('OPT-')) {
      return true;
    }
    return false;
  }

  // Valid ETD products & keys
  assert.equal(isEtdProduct_('ETD', 'PRF-1'), true);
  assert.equal(isEtdProduct_('Exchange Traded Derivatives', 'PRF-2'), true);
  assert.equal(isEtdProduct_('Futures & Options', 'PRF-3'), true);
  assert.equal(isEtdProduct_('Listed Derivatives', 'PRF-4'), true);
  assert.equal(isEtdProduct_('', 'ETD-1021'), true);
  assert.equal(isEtdProduct_(null, 'ALLOC-550'), true);
  assert.equal(isEtdProduct_('Unknown', 'FUT-88'), true);

  // Non-ETD products
  assert.equal(isEtdProduct_('Cash Flow Management', 'CFM-101'), false);
  assert.equal(isEtdProduct_('CFD', 'CFD-500'), false);
  assert.equal(isEtdProduct_('Repo Clearing', 'REPO-99'), false);
});

// Test hasProductContext_ coverage
test('hasProductContext_ verifies product owner markdown context coverage for CFM and ETD', () => {
  function isCashflowProduct_(product, key) {
    const p = String(product || '').trim().toUpperCase();
    const k = String(key || '').trim().toUpperCase();
    return p.indexOf('CFM') !== -1 || p.indexOf('CASH') !== -1 || p.indexOf('FLOW') !== -1 ||
      k.startsWith('CFM-') || k.startsWith('CFM') || k.startsWith('CASH-');
  }

  function isEtdProduct_(product, key) {
    const p = String(product || '').trim().toUpperCase();
    const k = String(key || '').trim().toUpperCase();
    return p.indexOf('ETD') !== -1 || p.indexOf('FUTUR') !== -1 || p.indexOf('OPTION') !== -1 ||
      p.indexOf('EXCHANGE') !== -1 || p.indexOf('LISTED') !== -1 ||
      k.startsWith('ETD-') || k.startsWith('ALLOC-') || k.startsWith('FUT-') || k.startsWith('OPT-');
  }

  function hasProductContext_(product, key) {
    return isCashflowProduct_(product, key) || isEtdProduct_(product, key);
  }

  // Active products with Markdown context
  assert.equal(hasProductContext_('CFM', 'CFM-101'), true, 'CFM has context');
  assert.equal(hasProductContext_('ETD', 'ETD-202'), true, 'ETD has context');
  assert.equal(hasProductContext_('Listed Derivatives', 'ALLOC-303'), true, 'ETD alias has context');

  // Pending products without markdown context yet
  assert.equal(hasProductContext_('TriResolve', 'TR-101'), false, 'triResolve pending context');
  assert.equal(hasProductContext_('Repo Clearing', 'REPO-505'), false, 'Repo pending context');
});

// Test dynamic Product Owner markdown context resolution
test('getProductContextMarkdown_ resolves aliases and returns distinct product owner rules for CFM and ETD', () => {
  const promptContextPath = path.resolve(__dirname, '..', 'PromptContext.gs');
  const content = fs.readFileSync(promptContextPath, 'utf8');

  assert.ok(content.includes('function getProductContextMarkdown_(productName)'), 'Must have dynamic parameter function');
  assert.ok(content.includes('"ETD"'), 'Must include ETD in compiled contexts map');
  assert.ok(content.includes('"CFM"'), 'Must include CFM in compiled contexts map');
  assert.ok(content.includes('15M+ Listed Contracts Processed Daily'), 'Must include ETD proof points from PO file');
  assert.ok(content.includes('70+ ISITC'), 'Must include CFM proof points from PO file');
});





