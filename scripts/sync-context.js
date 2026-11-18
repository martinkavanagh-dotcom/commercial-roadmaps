/**
 * Context & Guardrails Synchronizer
 * Ingests markdown files from context/guardrails/ and context/cfm/
 * and generates Apps Script compatible PromptContext.gs
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const guardrailsDir = path.join(rootDir, 'context', 'guardrails');
const cfmDir = path.join(rootDir, 'context', 'cfm');
const outputPath = path.join(rootDir, 'PromptContext.gs');

function readDirMarkdown(dirPath) {
  if (!fs.existsSync(dirPath)) return '';
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
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
  const cfmContent = readDirMarkdown(cfmDir);

  const fileContent = `/**
 * Auto-generated from context/guardrails/ and context/cfm/ by scripts/sync-context.js
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
 * Returns OSTTRA Cash Flow Management (CFM) capabilities, narratives, and glossary.
 */
function getCfmContextMarkdown_() {
  return ${escapeForJsTemplate(cfmContent)};
}

/**
 * Backwards-compatible alias for translation rules.
 */
function getTranslationRulesMarkdown_() {
  return getGuardrailsMarkdown_();
}

/**
 * Backwards-compatible alias for product context (defaults to CFM).
 */
function getProductContextMarkdown_() {
  return getCfmContextMarkdown_();
}
`;

  fs.writeFileSync(outputPath, fileContent, 'utf8');
  console.log('Successfully generated PromptContext.gs from context/guardrails/ and context/cfm/');
}

syncContext();
