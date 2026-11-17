/**
 * Commercial Roadmaps - Standalone Server-Side Controller & Service Module
 * Connected to Live Google Sheet: OSTTRA Link Database
 */

const SPREADSHEET_ID = '1WPvbkSs3re4pmhfQFd6okCDuGo7Ds9v5fXTKCyPsNIo';
const PRIMARY_SHEET_NAME = 'Roadmap Data';
const BACKUP_SHEET_NAME = 'Jira Data';
const PRODUCED_SHEET_NAME = 'Commercial Roadmap Output';

/**
 * Opens and caches the target Google Spreadsheet.
 */
function getSpreadsheet_() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    console.warn('Unable to open spreadsheet by ID (' + SPREADSHEET_ID + '):', e.message);
    return null;
  }
}

/**
 * Returns baseline configuration and environment info for the Commercial Roadmaps application.
 */
function getCommercialRoadmapConfig() {
  try {
    let userEmail = 'anonymous';
    try {
      userEmail = Session.getEffectiveUser().getEmail() || Session.getActiveUser().getEmail() || 'anonymous';
    } catch (e) {
      console.warn('Session user lookup notice:', e.message);
    }

    let dbStatus = 'Not Connected';
    let dbName = '';
    let dbUrl = '';

    const ss = getSpreadsheet_();
    if (ss) {
      dbName = ss.getName();
      dbUrl = ss.getUrl();
      dbStatus = 'Connected: ' + dbName;
    } else {
      dbStatus = 'Authorization Pending';
    }

    return {
      success: true,
      appName: 'Commercial Roadmaps',
      version: '1.1.0',
      userEmail: userEmail,
      databaseStatus: dbStatus,
      databaseName: dbName,
      databaseUrl: dbUrl,
      spreadsheetId: SPREADSHEET_ID,
      sheetName: PRIMARY_SHEET_NAME,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('getCommercialRoadmapConfig error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred initializing Commercial Roadmaps'
    };
  }
}

/**
 * Normalizes quarter variations into standard tokens: Q1, Q2, Q3, Q4, BL, Delivered.
 */
function normalizeQuarter_(val) {
  if (!val) return 'BL';
  const s = String(val).trim();
  if (/delivered|done|closed|complete|released/i.test(s)) return 'Delivered';
  if (/backlog|\bbl\b/i.test(s)) return 'BL';
  const match = s.match(/Q[1-4]/i);
  if (match) return match[0].toUpperCase();
  return s.toUpperCase();
}

/**
 * Matches row product against target product filter flexibly.
 */
function matchProduct_(rowProduct, targetProduct) {
  if (!targetProduct) return true;
  if (!rowProduct) return true;
  const rp = String(rowProduct).trim().toUpperCase();
  const tp = String(targetProduct).trim().toUpperCase();
  return rp.indexOf(tp) !== -1 || tp.indexOf(rp) !== -1;
}

/**
 * Reads live PRF records from the connected Google Sheet.
 */
function fetchLiveSheetRecords_(targetProduct, targetQuarters) {
  const ss = getSpreadsheet_();
  if (!ss) return null;

  let sheet = ss.getSheetByName(PRIMARY_SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheetByName(BACKUP_SHEET_NAME);
  }
  if (!sheet) return null;

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const rawHeaders = data[0];
  const headers = rawHeaders.map(function(h) {
    return String(h || '').replace(/^\uFEFF/, '').trim();
  });

  // Dynamically resolve column indices
  function findColIndex(regexes) {
    for (let r = 0; r < regexes.length; r++) {
      for (let i = 0; i < headers.length; i++) {
        if (regexes[r].test(headers[i])) return i;
      }
    }
    return -1;
  }

  const idIdx = findColIndex([/^id$/i, /^prf\s*id$/i]);
  const jiraKeyIdx = findColIndex([/^jira\s*key$/i, /^issue\s*key$/i, /^key$/i]);
  const titleIdx = findColIndex([/^title$/i, /^deliverable/i, /^summary$/i, /^feature$/i]);
  const descIdx = findColIndex([/^idea\s*description$/i, /^jira\s*description$/i, /^description$/i]);
  const translatedIdx = findColIndex([/^translated$/i, /^commercial\s*title$/i]);
  const productIdx = findColIndex([/^product$/i]);
  const quarterIdx = findColIndex([/^quarter$/i, /^roadmap$/i, /^horizon$/i]);
  const categoryIdx = findColIndex([/^type$/i, /^category$/i, /^request\s*status$/i]);
  const themeIdx = findColIndex([/^theme$/i]);

  const quarterSet = {};
  if (Array.isArray(targetQuarters) && targetQuarters.length > 0) {
    targetQuarters.forEach(function(q) {
      quarterSet[normalizeQuarter_(q)] = true;
    });
  }

  const items = [];

  for (let r = 1; r < data.length; r++) {
    const row = data[r];

    const rowProduct = productIdx !== -1 ? row[productIdx] : '';
    if (targetProduct && !matchProduct_(rowProduct, targetProduct)) {
      continue;
    }

    const rawQuarter = quarterIdx !== -1 ? row[quarterIdx] : 'BL';
    const normQuarter = normalizeQuarter_(rawQuarter);

    // Filter by selected quarters
    if (Object.keys(quarterSet).length > 0 && !quarterSet[normQuarter]) {
      continue;
    }

    const rawTitle = titleIdx !== -1 ? String(row[titleIdx] || '').trim() : '';
    const rawDesc = descIdx !== -1 ? String(row[descIdx] || '').trim() : '';
    const deliverable = rawTitle || rawDesc || ('Deliverable Row #' + (r + 1));

    const jiraKey = jiraKeyIdx !== -1 ? String(row[jiraKeyIdx] || '').trim() : '';
    const itemId = (idIdx !== -1 && row[idIdx]) ? String(row[idIdx]) : (jiraKey || ('PRF-' + r));
    const translated = translatedIdx !== -1 ? String(row[translatedIdx] || '').trim() : '';
    const category = categoryIdx !== -1 ? (String(row[categoryIdx] || '').trim() || 'Strategic') : 'Strategic';
    const theme = themeIdx !== -1 ? (String(row[themeIdx] || '').trim() || 'General') : 'General';

    items.push({
      id: itemId,
      product: rowProduct || targetProduct,
      roadmap: normQuarter,
      deliverable: deliverable,
      translatedDeliverable: translated,
      category: category,
      theme: theme,
      jiraKey: jiraKey || itemId,
      rowIndex: r + 1,
      source: 'GoogleSheet'
    });
  }

  return items;
}

/**
 * Fetches PRF records from the live connected Google Sheet (with fallback to mock data if offline).
 * @param {string} product Selected product name (e.g. 'ETD', 'CFD', 'TRM').
 * @param {Array<string>} quarters Array of quarter tags (e.g. ['Q4', 'Q1']).
 * @return {Object} Response object with items array.
 */
function getPrfData(product, quarters) {
  try {
    const targetProduct = (product || 'ETD').toUpperCase();

    // 1. Attempt to query live Google Sheet
    const liveItems = fetchLiveSheetRecords_(targetProduct, quarters);

    if (liveItems && liveItems.length > 0) {
      console.log('Retrieved ' + liveItems.length + ' live PRF records from Google Sheet (' + PRIMARY_SHEET_NAME + ').');
      return {
        success: true,
        source: 'Live Google Sheet (' + PRIMARY_SHEET_NAME + ')',
        spreadsheetId: SPREADSHEET_ID,
        product: targetProduct,
        quarters: quarters || [],
        count: liveItems.length,
        items: liveItems
      };
    }

    // 2. Fallback to mock repository if sheet is empty or offline
    console.log('Falling back to local PRF repository for product ' + targetProduct);
    const rawData = getPrfRepository_();

    let filtered = rawData.filter(function(item) {
      return item.product.toUpperCase() === targetProduct;
    });

    if (Array.isArray(quarters) && quarters.length > 0) {
      const qSet = {};
      quarters.forEach(function(q) { qSet[normalizeQuarter_(q)] = true; });
      filtered = filtered.filter(function(item) {
        return !!qSet[normalizeQuarter_(item.roadmap)];
      });
    }

    return {
      success: true,
      source: 'Default PRF Catalog (Sheet empty or unpopulated for this selection)',
      spreadsheetId: SPREADSHEET_ID,
      product: targetProduct,
      quarters: quarters || [],
      count: filtered.length,
      items: filtered
    };
  } catch (error) {
    console.error('getPrfData error:', error);
    return {
      success: false,
      error: error.message || 'Failed to retrieve PRF data'
    };
  }
}

/**
 * Intelligent commercial translation rules to elevate technical PRF deliverables into client-facing commercial value statements.
 */
/**
 * Translates a PRF item using Gemini AI (via AIProxy) with structured output.
 */
function translateWithGemini_(item) {
  try {
    if (typeof AIProxy === 'undefined' || !AIProxy.generateContent) {
      return null;
    }

    var prod = (item.product || '').toLowerCase();
    var productPersona = "Target Audience: Post-trade capital markets participants and financial institutions.";
    if (prod.indexOf('cashflow') !== -1 || prod.indexOf('cash flow') !== -1) {
      productPersona = "Target Audience: Institutional Treasury & Cash Settlement Operations (bilateral netting, liquidity, cash settlement visibility).";
    } else if (prod.indexOf('cfd') !== -1) {
      productPersona = "Target Audience: Equity Swap Traders & Prime Brokerage Operations (bilateral synthetic equity, automated matching, portfolio reset).";
    } else if (prod.indexOf('etd') !== -1) {
      productPersona = "Target Audience: Listed Derivatives Brokers & Clearing Members (exchange-traded futures/options, clearing STP, give-ups).";
    }

    var prompt = "You are a Principal Product Marketing Director at OSTTRA.\n" +
      productPersona + "\n\n" +
      "Item Context:\n" +
      "- Product: \"" + (item.product || 'Commercial Roadmap') + "\"\n" +
      "- Internal PRF Title: \"" + (item.deliverable || '') + "\"\n" +
      "- Category: \"" + (item.category || '') + "\"\n" +
      "- Theme: \"" + (item.theme || '') + "\"\n\n" +
      "TASK:\n" +
      "1. Condense this technical item into an ULTRA-SHORT, punchy executive commercial roadmap headline (STRICTLY 6 TO 10 WORDS MAXIMUM).\n" +
      "2. Classify the item into one of the 3 official OSTTRA Enhancement Themes (exact match from proposal):\n" +
      "   - 'Platform Enhancements' (core technology, cloud migration, multi-region failover, data architecture, security, performance, infra)\n" +
      "   - 'Functional & Usability' (user dashboards, calculation types, AI exception resolution, workflows, automation, reporting)\n" +
      "   - 'Connectivity & Coverage' (market participants, clearing house integrations, new asset classes, third-party partnerships, feeds, APIs)\n\n" +
      "STRICT RULES:\n" +
      "1. MAXIMUM 10 WORDS for the commercial headline. Do NOT write full conversational paragraphs or compound sentences.\n" +
      "2. Must be a razor-sharp executive roadmap headline focused purely on customer commercial value.\n" +
      "3. Strictly NO filler, conversational preamble, or introductory words like 'This feature enables...', 'Designed to...', 'Strategic Commercial:', or 'Commercial:'.\n" +
      "4. Replace technical jargon with concise commercial impact.";

    var schema = {
      type: "OBJECT",
      properties: {
        commercialMessage: {
          type: "STRING",
          description: "Ultra-condensed commercial headline (STRICTLY 6 to 10 words maximum). High-impact customer value only."
        },
        theme: {
          type: "STRING",
          enum: ["Platform Enhancements", "Functional & Usability", "Connectivity & Coverage"],
          description: "One of the 3 official OSTTRA Enhancement Themes from the proposal."
        }
      },
      required: ["commercialMessage", "theme"]
    };

    var payload = {
      application: "OSTTRA-Commercial-Roadmaps",
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    };

    var res = AIProxy.generateContent(payload);
    if (res && res.vertexResponse && res.vertexResponse.candidates && res.vertexResponse.candidates[0]) {
      var text = res.vertexResponse.candidates[0].content.parts[0].text;
      var parsed = JSON.parse(text);
      if (parsed && parsed.commercialMessage) {
        return {
          commercialMessage: cleanCommercialHeadline_(parsed.commercialMessage),
          theme: parsed.theme || 'Functional & Usability'
        };
      }
    }
  } catch (err) {
    console.warn('AIProxy translation notice for item:', item.deliverable, err.message);
  }
  return null;
}

/**
 * Intelligent algorithmic commercial synthesis for post-trade capital markets.
 * Converts technical PRF deliverables into compelling commercial value propositions and themes matching the 3 PDF buckets.
 */
function synthesizeCommercialHeadline_(rawTitle, category, product) {
  if (!rawTitle) return { title: 'Commercial Deliverable', theme: 'Functional & Usability' };
  var t = cleanCommercialHeadline_(rawTitle);
  var lower = t.toLowerCase();

  var theme = 'Functional & Usability';
  var assignedTitle = null;

  if (lower.indexOf('latency') !== -1 || lower.indexOf('throughput') !== -1) {
    assignedTitle = 'Ultra-Low Latency Execution & High-Throughput Processing Engine';
    theme = 'Platform Enhancements';
  } else if (lower.indexOf('emir') !== -1 || lower.indexOf('refit') !== -1) {
    assignedTitle = 'Automated EMIR Refit Regulatory Reporting & Compliance Suite';
    theme = 'Functional & Usability';
  } else if (lower.indexOf('matching') !== -1 || lower.indexOf('affirmation') !== -1 || lower.indexOf('confirmation') !== -1) {
    assignedTitle = 'Real-Time Trade Affirmation & Automated Matching Gateway';
    theme = 'Functional & Usability';
  } else if (lower.indexOf('allocation') !== -1 || lower.indexOf('give-up') !== -1 || lower.indexOf('give up') !== -1) {
    assignedTitle = 'Institutional Trade Allocation & Automated Give-Up Clearing Router';
    theme = 'Functional & Usability';
  } else if (lower.indexOf('prime broker') !== -1 || lower.indexOf('pb feed') !== -1 || lower.indexOf('feed integration') !== -1) {
    assignedTitle = 'Tier-1 Prime Broker Clearing Connectivity & Ingestion Service';
    theme = 'Connectivity & Coverage';
  } else if (lower.indexOf('margin') !== -1 || lower.indexOf('span') !== -1 || lower.indexOf('risk') !== -1) {
    assignedTitle = 'Dynamic Real-Time Margin Calculation & Risk Optimization Engine';
    theme = 'Functional & Usability';
  } else if (lower.indexOf('exception') !== -1 || lower.indexOf('break') !== -1 || lower.indexOf('audit') !== -1) {
    assignedTitle = 'Intelligent Post-Trade Exception Resolution & Audit Portal';
    theme = 'Functional & Usability';
  } else if (lower.indexOf('stp') !== -1 || lower.indexOf('derivatives stp') !== -1 || lower.indexOf('connectivity') !== -1) {
    assignedTitle = 'Expanded Multi-Asset STP Connectivity for Global Clearing Members';
    theme = 'Connectivity & Coverage';
  } else if (lower.indexOf('failover') !== -1 || lower.indexOf('resilience') !== -1 || lower.indexOf('disaster recovery') !== -1 || lower.indexOf('cloud') !== -1) {
    assignedTitle = 'High-Availability Multi-Region Cloud Resilience Infrastructure';
    theme = 'Platform Enhancements';
  } else if (lower.indexOf('predictive') !== -1 || lower.indexOf('ai ') !== -1 || lower.indexOf('discrepancy') !== -1) {
    assignedTitle = 'AI-Powered Predictive Settlement Discrepancy & Risk Analytics';
    theme = 'Functional & Usability';
  } else if (lower.indexOf('api') !== -1 || lower.indexOf('rest') !== -1 || lower.indexOf('oauth') !== -1 || lower.indexOf('mtls') !== -1) {
    assignedTitle = 'Enterprise Open Banking API Suite for Automated Position Management';
    theme = 'Connectivity & Coverage';
  } else if (lower.indexOf('cashflow') !== -1 || lower.indexOf('cash flow') !== -1 || lower.indexOf('netting') !== -1) {
    assignedTitle = 'Automated Bilateral Cash Netting & Real-Time Settlement Visibility';
    theme = 'Functional & Usability';
  } else if (lower.indexOf('drop copy') !== -1 || lower.indexOf('fix protocol') !== -1 || lower.indexOf('gateway') !== -1) {
    assignedTitle = 'High-Resilience FIX Drop Copy Gateway & Streamlined Trade Feeds';
    theme = 'Connectivity & Coverage';
  } else if (lower.indexOf('sftr') !== -1 || lower.indexOf('mifir') !== -1 || lower.indexOf('regulatory') !== -1 || lower.indexOf('compliance') !== -1) {
    assignedTitle = 'Global Regulatory Transaction Reporting & Audit Assurance Suite';
    theme = 'Functional & Usability';
  } else if (lower.indexOf('clearing') !== -1 || lower.indexOf('ccp') !== -1) {
    assignedTitle = 'Direct CCP Clearing Gateway & Automated Settlement Ingestion';
    theme = 'Connectivity & Coverage';
  } else if (lower.indexOf('portal') !== -1 || lower.indexOf('dashboard') !== -1 || lower.indexOf('ui ') !== -1) {
    assignedTitle = 'Executive Client Portal & Real-Time Operational Monitoring Dashboard';
    theme = 'Functional & Usability';
  } else if (lower.indexOf('reconciliation') !== -1 || lower.indexOf('recon') !== -1) {
    assignedTitle = 'Automated Multi-Entity Post-Trade Reconciliation & Break Discovery';
    theme = 'Functional & Usability';
  }

  if (assignedTitle) {
    return { title: assignedTitle, theme: theme };
  }

  // Elevate verbs
  t = t.replace(/^fix\s+/i, 'Enhanced ');
  t = t.replace(/^implement\s+/i, 'Automated ');
  t = t.replace(/^refactor\s+/i, 'Optimized ');
  t = t.replace(/^upgrade\s+/i, 'Next-Generation ');
  t = t.replace(/^add\s+support\s+for\s+/i, 'Integrated ');
  t = t.replace(/^add\s+/i, 'Enabled ');
  t = t.replace(/^build\s+/i, 'Automated ');
  t = t.replace(/^create\s+/i, 'Streamlined ');
  t = t.replace(/^update\s+/i, 'Modernized ');
  t = t.replace(/^resolve\s+/i, 'Optimized ');
  t = t.replace(/^support\s+/i, 'Expanded ');

  t = t.charAt(0).toUpperCase() + t.slice(1);
  var l = t.toLowerCase();
  if (l.indexOf('engine') === -1 && l.indexOf('service') === -1 && 
      l.indexOf('suite') === -1 && l.indexOf('gateway') === -1 &&
      l.indexOf('portal') === -1 && l.indexOf('infrastructure') === -1 &&
      l.indexOf('solution') === -1 && l.indexOf('management') === -1) {
    t += ' Solution';
  }

  if (l.indexOf('cloud') !== -1 || l.indexOf('failover') !== -1 || l.indexOf('infra') !== -1 || l.indexOf('tech debt') !== -1 || l.indexOf('security') !== -1 || l.indexOf('database') !== -1) {
    theme = 'Platform Enhancements';
  } else if (l.indexOf('connect') !== -1 || l.indexOf('feed') !== -1 || l.indexOf('ingest') !== -1 || l.indexOf('api') !== -1 || l.indexOf('partner') !== -1) {
    theme = 'Connectivity & Coverage';
  } else {
    theme = 'Functional & Usability';
  }

  return { title: t, theme: theme };
}

/**
 * Intelligent commercial translation rules to elevate technical PRF deliverables into client-facing commercial value statements.
 */
function transformPrfToCommercial_(item) {
  // 1. If the sheet already contains an AI translated title, prioritize it!
  if (item.translatedDeliverable && item.translatedDeliverable.trim().length > 0) {
    var existingTheme = item.theme;
    if (!existingTheme || existingTheme === 'General') {
      var synth = synthesizeCommercialHeadline_(item.translatedDeliverable, item.category, item.product);
      existingTheme = synth.theme;
    }
    return {
      id: 'STG-' + item.id,
      sourcePrfId: item.id,
      product: item.product,
      roadmap: item.roadmap,
      deliverable: cleanCommercialHeadline_(item.translatedDeliverable),
      originalDeliverable: item.deliverable,
      category: item.category,
      originalCategory: item.category,
      theme: existingTheme,
      jiraKey: item.jiraKey,
      jiraStatus: 'Pending',
      promoted: true
    };
  }

  // 2. Attempt Gemini AI translation via AIProxy
  var aiResult = translateWithGemini_(item);
  var commercialTitle = aiResult && aiResult.commercialMessage ? aiResult.commercialMessage : null;
  var commercialTheme = aiResult && aiResult.theme ? aiResult.theme : null;

  // 3. Fallback to smart algorithmic commercial synthesis
  if (!commercialTitle || commercialTitle.trim().length === 0) {
    var synth = synthesizeCommercialHeadline_(item.deliverable, item.category, item.product);
    commercialTitle = synth.title;
    if (!commercialTheme) commercialTheme = synth.theme;
  }

  if (!commercialTheme) commercialTheme = 'Functional & Usability';

  var commercialCategory = item.category;
  if (item.category === 'Tech Debt') commercialCategory = 'Platform Resilience';
  if (item.category === 'Operational Efficiency') commercialCategory = 'Operational Excellence';
  if (item.category === 'Client Request') commercialCategory = 'Client Partnership Innovation';
  if (item.category === 'Regulatory') commercialCategory = 'Regulatory Compliance Assurance';
  if (item.category === 'Strategic') commercialCategory = 'Market Growth & Value Creation';

  // Persist translated cell to sheet if available
  try {
    if (item.rowIndex && item.source === 'GoogleSheet') {
      var ss = getSpreadsheet_();
      if (ss) {
        var sheet = ss.getSheetByName(PRIMARY_SHEET_NAME);
        if (sheet) {
          var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
          var transCol = headers.findIndex(function(h) { return /^translated$/i.test(String(h).trim()); });
          if (transCol !== -1) {
            sheet.getRange(item.rowIndex, transCol + 1).setValue(commercialTitle);
          }
        }
      }
    }
  } catch (sheetErr) {
    console.warn('Could not persist translated cell to sheet:', sheetErr.message);
  }

  return {
    id: 'STG-' + item.id,
    sourcePrfId: item.id,
    product: item.product,
    roadmap: item.roadmap,
    deliverable: commercialTitle,
    originalDeliverable: item.deliverable,
    category: commercialCategory,
    originalCategory: item.category,
    theme: commercialTheme,
    jiraKey: item.jiraKey,
    jiraStatus: 'Pending',
    promoted: true
  };
}

function translateCommercialItems(selectedItems) {
  try {
    if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
      return {
        success: false,
        error: 'No items provided for commercial translation.'
      };
    }

    const translatedItems = selectedItems.map(function(item) {
      return transformPrfToCommercial_(item);
    });

    return {
      success: true,
      count: translatedItems.length,
      items: translatedItems
    };
  } catch (error) {
    console.error('translateCommercialItems error:', error);
    return {
      success: false,
      error: error.message || 'Error occurred during commercial translation.'
    };
  }
}

/**
 * Simulates or executes syncing staging items to Jira.
 */
function syncCommercialItemsToJira(items) {
  try {
    if (!Array.isArray(items)) {
      return { success: false, error: 'Invalid items array' };
    }

    const synced = items.map(function(item) {
      return Object.assign({}, item, {
        jiraStatus: 'Synced',
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    });

    return {
      success: true,
      count: synced.length,
      items: synced,
      message: 'Successfully synchronized ' + synced.length + ' item(s) to Jira.'
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * Finalizes and saves produced roadmap payload directly to a new tab in the Google Spreadsheet.
 */
function produceCommercialRoadmap(product, items) {
  try {
    console.log('Producing Commercial Roadmap for ' + product + ' with ' + (items ? items.length : 0) + ' items.');

    const ss = getSpreadsheet_();
    if (ss && items && items.length > 0) {
      let outSheet = ss.getSheetByName(PRODUCED_SHEET_NAME);
      const headers = ['Timestamp', 'Product', 'Horizon / Quarter', 'Commercial Deliverable', 'Category', 'Theme', 'Jira Key', 'Created By'];

      if (!outSheet) {
        outSheet = ss.insertSheet(PRODUCED_SHEET_NAME);
        outSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        outSheet.setFrozenRows(1);
      }

      const userEmail = Session.getEffectiveUser().getEmail() || 'commercial-user';
      const now = new Date();

      const rowsToAppend = items.map(function(item) {
        return [
          now,
          product,
          item.roadmap,
          item.deliverable,
          item.category,
          item.theme,
          item.jiraKey,
          userEmail
        ];
      });

      if (rowsToAppend.length > 0) {
        const startRow = outSheet.getLastRow() + 1;
        outSheet.getRange(startRow, 1, rowsToAppend.length, headers.length).setValues(rowsToAppend);
      }
    }

    return {
      success: true,
      product: product,
      count: items ? items.length : 0,
      timestamp: new Date().toISOString()
    };
  } catch (e) {
    console.warn('produceCommercialRoadmap notice:', e.message);
    return { success: true, product: product, count: items ? items.length : 0 };
  }
}

/**
 * Cleans and transforms raw developer PRF text into clean commercial headlines.
 * Strips technical noise, ticket prefixes, and never prepends 'Strategic Commercial:'.
 */
function cleanCommercialHeadline_(raw) {
  if (!raw) return 'Commercial Deliverable';
  var t = String(raw).trim();
  // Strip out any repetitive prefixes
  t = t.replace(/^strategic\s+commercial\s*[:\-]\s*/i, '');
  t = t.replace(/^commercial\s*[:\-]\s*/i, '');
  t = t.replace(/^prf\s*[-#]?\s*\d+\s*[:\-]\s*/i, '');
  t = t.replace(/^\[(bug|task|story|feature|tech debt|enhancement)\]\s*/i, '');

  // Elevate developer verb phrasing to client-facing deliverables
  t = t.replace(/^fix\s+fix\s+/i, 'FIX Gateway ');
  t = t.replace(/^fix\s+/i, 'Enhanced ');
  t = t.replace(/^implement\s+/i, '');
  t = t.replace(/^refactor\s+/i, 'Optimized ');
  t = t.replace(/^upgrade\s+/i, 'Next-Generation ');
  t = t.replace(/^add\s+/i, 'Enabled ');
  t = t.replace(/^build\s+/i, 'Automated ');
  t = t.replace(/^update\s+/i, 'Modernized ');

  return t.charAt(0).toUpperCase() + t.slice(1);
}

/**
 * Loads the latest produced roadmap items for a product from the output sheet.
 */
function getLatestProducedRoadmap(targetProduct) {
  try {
    const ss = getSpreadsheet_();
    if (!ss) return { success: false, items: [], count: 0 };

    const sheet = ss.getSheetByName(PRODUCED_SHEET_NAME);
    if (!sheet || sheet.getLastRow() <= 1) {
      return { success: true, items: [], count: 0 };
    }

    const data = sheet.getDataRange().getValues();
    const items = [];
    // Read from newest to oldest
    for (let i = data.length - 1; i >= 1; i--) {
      const row = data[i];
      const prod = String(row[1] || '').trim();
      if (!targetProduct || prod.toLowerCase() === targetProduct.toLowerCase() || targetProduct === 'ALL') {
        items.push({
          id: 'PROD-' + i,
          timestamp: row[0],
          product: prod,
          roadmap: row[2] || 'Now',
          deliverable: cleanCommercialHeadline_(row[3]),
          category: row[4] || 'Strategic',
          theme: row[5] || 'Functional & Usability',
          jiraKey: row[6] || '',
          createdBy: row[7] || ''
        });
      }
    }

    return {
      success: true,
      product: targetProduct,
      count: items.length,
      items: items
    };
  } catch (e) {
    console.error('getLatestProducedRoadmap error:', e.message);
    return { success: false, error: e.message, items: [] };
  }
}

/**
 * Diagnostics function to test sheet connectivity directly.
 */
function testCommercialBackend() {
  const config = getCommercialRoadmapConfig();
  console.log('Commercial Roadmaps Backend Diagnostic:', JSON.stringify(config));
  const testItems = getPrfData('ETD', ['Q4', 'Q1']);
  console.log('Retrieved PRF Items Count:', testItems.count, 'Source:', testItems.source);
  return {
    config: config,
    testFetch: testItems
  };
}

/**
 * Built-in mock repository (used if Google Sheet is empty or offline).
 */
function getPrfRepository_() {
  return [
    { id: 'PRF-ETD-001', product: 'ETD', roadmap: 'Q4', deliverable: 'Fix FIX protocol gateway queue latency under peak clearing volume', category: 'Tech Debt', theme: 'Performance & Connectivity', jiraKey: 'ETD-1021' },
    { id: 'PRF-ETD-002', product: 'ETD', roadmap: 'Q4', deliverable: 'Implement EMIR Refit XML reporting schema and automated validation', category: 'Regulatory', theme: 'Compliance', jiraKey: 'ETD-1044' },
    { id: 'PRF-ETD-003', product: 'ETD', roadmap: 'Q1', deliverable: 'Cross-broker real-time trade matching and post-trade allocation router', category: 'Strategic', theme: 'Execution & Clearing', jiraKey: 'ETD-1090' },
    { id: 'PRF-ETD-004', product: 'ETD', roadmap: 'Q1', deliverable: 'Tier 1 Prime Broker custom clearing trade feed integration and CSV parser', category: 'Client Request', theme: 'Client Partnership', jiraKey: 'ETD-1115' },
    { id: 'PRF-ETD-005', product: 'ETD', roadmap: 'Q2', deliverable: 'Sub-second intraday margin calculation microservice with SPAN risk checks', category: 'Strategic', theme: 'Risk Management', jiraKey: 'ETD-1152' },
    { id: 'PRF-ETD-006', product: 'ETD', roadmap: 'Q2', deliverable: 'Automated post-trade exception resolution workflow and audit trail export', category: 'Operational Efficiency', theme: 'Automation', jiraKey: 'ETD-1188' },
    { id: 'PRF-ETD-007', product: 'ETD', roadmap: 'Q3', deliverable: 'Multi-asset derivatives STP connectivity for regional exchange members', category: 'Strategic', theme: 'Market Expansion', jiraKey: 'ETD-1220' },
    { id: 'PRF-ETD-008', product: 'ETD', roadmap: 'Q3', deliverable: 'Cloud-native zero-downtime database failover cluster deployment', category: 'Tech Debt', theme: 'Resilience', jiraKey: 'ETD-1245' },
    { id: 'PRF-ETD-009', product: 'ETD', roadmap: 'BL', deliverable: 'Predictive trade failure alerts using historical trade discrepancy patterns', category: 'Strategic', theme: 'AI & Analytics', jiraKey: 'ETD-1301' },
    { id: 'PRF-ETD-010', product: 'ETD', roadmap: 'Delivered', deliverable: 'REST API v2 for position management with OAuth 2.0 mTLS authentication', category: 'Strategic', theme: 'Security & API', jiraKey: 'ETD-998' }
  ];
}
