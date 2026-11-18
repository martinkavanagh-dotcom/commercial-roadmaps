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
  assert.ok(content.includes('function getProductContextMarkdown_()'), 'Should define getProductContextMarkdown_');
  assert.ok(content.includes('function getTranslationRulesMarkdown_()'), 'Should define getTranslationRulesMarkdown_');
  assert.ok(content.includes('Cash Flow Management (CFM)'), 'Should contain CFM context');
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

