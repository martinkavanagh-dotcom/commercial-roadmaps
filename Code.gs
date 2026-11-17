/**
 * Commercial Roadmaps - Standalone Web Application
 * Google Apps Script Web App Entry Point
 */

function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Commercial Roadmaps - OSTTRA')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Modular helper to include HTML files in templates.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Developer authorization helper to verify Google Apps Script permissions.
 */
function testPermissions() {
  const email = Session.getEffectiveUser().getEmail();
  console.log("Permissions Success! Current Authorized User: " + email);
  return "Permissions successfully authorized for: " + email;
}
