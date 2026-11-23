/**
 * Context & Guardrails Synchronizer (Dynamic Multi-Product Architecture)
 * Ingests shared guardrails and all product-specific markdown folders under context/
 * and generates Apps Script compatible PromptContext.gs.
 *
 * To add a new product: Simply create context/<product-key>/ containing its markdown files,
 * and run: node scripts/sync-context.js
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const contextDir = path.join(rootDir, 'context');
const guardrailsDir = path.join(contextDir, 'guardrails');
const outputPath = path.join(rootDir, 'PromptContext.gs');

function readDirMarkdown(dirPath) {
  if (!fs.existsSync(dirPath)) return '';
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md')).sort();
  return files.map(file => {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    return `\n/* ==================== FILE: ${file} ==================== */\n${content}`;
  }).join('\n\n');
}

function escapeForJsTemplate(str) {
  return JSON.stringify(str);
}

function syncContext() {
  const guardrailsContent = readDirMarkdown(guardrailsDir);

  // Dynamically scan for all product directories in context/
  const entries = fs.readdirSync(contextDir, { withFileTypes: true });
  const productDirs = entries
    .filter(e => e.isDirectory() && e.name !== 'guardrails' && !e.name.startsWith('.'))
    .map(e => e.name);

  const productContexts = {};
  productDirs.forEach(dirName => {
    const dirPath = path.join(contextDir, dirName);
    const content = readDirMarkdown(dirPath);
    if (content.trim()) {
      productContexts[dirName.toUpperCase()] = content;
    }
  });

  const availableProductsList = Object.keys(productContexts);

  let fileContent = `/**
 * Auto-generated from context/ by scripts/sync-context.js
 * DO NOT EDIT DIRECTLY. Update markdown files in context/ and run:
 *   node scripts/sync-context.js
 */

/**
 * Returns canonical OSTTRA editorial, brand, house style, and claims guardrails.
 */
function getGuardrailsMarkdown_() {
  return ${escapeForJsTemplate(guardrailsContent)};
}

/**
 * List of registered product codes with domain context.
 */
function getAvailableProductContexts_() {
  return ${JSON.stringify(availableProductsList)};
}

/**
 * Returns product-specific context for a requested product code or name.
 * Resolves standard aliases (e.g. CFM, ETD, Cashflows, Futures & Options).
 */
function getProductContextMarkdown_(productName) {
  var key = String(productName || 'CFM').toUpperCase().trim();

  // Alias normalization
  if (key.indexOf('CASH') !== -1 || key.indexOf('CFM') !== -1) {
    key = 'CFM';
  } else if (key.indexOf('ETD') !== -1 || key.indexOf('FUTUR') !== -1 || key.indexOf('OPTION') !== -1 || key.indexOf('EXCHANGE') !== -1) {
    key = 'ETD';
  } else if (key.indexOf('RATE') !== -1 || key.indexOf('MARKITWIRE') !== -1 || key.indexOf('MW') !== -1 || key.indexOf('IRS') !== -1) {
    key = 'RATES';
  }

  var contexts = {
`;

  availableProductsList.forEach((prodKey, index) => {
    const isLast = index === availableProductsList.length - 1;
    fileContent += `    ${JSON.stringify(prodKey)}: ${escapeForJsTemplate(productContexts[prodKey])}${isLast ? '' : ','}\n`;
  });

  fileContent += `  };

  return contexts[key] || contexts['CFM'] || '';
}

/**
 * Backwards-compatible alias for Cash Flow Management (CFM) context.
 */
function getCfmContextMarkdown_() {
  return getProductContextMarkdown_('CFM');
}

/**
 * Backwards-compatible alias for Exchange Traded Derivatives (ETD) context.
 */
function getEtdContextMarkdown_() {
  return getProductContextMarkdown_('ETD');
}

/**
 * Backwards-compatible alias for Rates (MarkitWire) context.
 */
function getRatesContextMarkdown_() {
  return getProductContextMarkdown_('RATES');
}

/**
 * Backwards-compatible alias for translation rules.
 */
function getTranslationRulesMarkdown_() {
  return getGuardrailsMarkdown_();
}
`;

  fs.writeFileSync(outputPath, fileContent, 'utf8');
  console.log(`Successfully generated PromptContext.gs with ${availableProductsList.length} product(s): ${availableProductsList.join(', ')}`);
}

syncContext();
