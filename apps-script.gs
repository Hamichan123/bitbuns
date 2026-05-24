/**
 * BitBuns WL Application — Google Apps Script Webhook
 *
 * Receives POST requests from the WL site and appends them to the active sheet.
 * Deploy as a Web App with "Anyone" access. See setup-guide.md for full steps.
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // ensure header row exists
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'X/Twitter Handle',
        'ETH Wallet',
        'Submitted At (ISO)',
        'User Agent',
        'IP / Source',
      ]);
      sheet.getRange(1, 1, 1, 6)
        .setFontWeight('bold')
        .setBackground('#1a1410')
        .setFontColor('#f3e9d2');
      sheet.setFrozenRows(1);
    }

    // parse the JSON body (sent as text/plain to dodge CORS preflight)
    const data = JSON.parse(e.postData.contents);

    // normalize handle — strip @, lowercase
    const handle = (data.handle || '').replace(/^@/, '').trim().toLowerCase();
    const wallet = (data.wallet || '').trim();

    // basic validation
    if (!handle || !wallet) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Missing fields' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // optional: check for duplicate handle or wallet
    const existing = sheet.getDataRange().getValues();
    const dupe = existing.slice(1).find(row =>
      String(row[1]).toLowerCase() === handle ||
      String(row[2]).toLowerCase() === wallet.toLowerCase()
    );

    if (dupe) {
      sheet.appendRow([
        new Date(),
        '@' + handle,
        wallet,
        data.timestamp || '',
        data.userAgent || '',
        'DUPLICATE',
      ]);
      // highlight duplicate row in red
      const lastRow = sheet.getLastRow();
      sheet.getRange(lastRow, 1, 1, 6).setBackground('#ffe0e0');
    } else {
      sheet.appendRow([
        new Date(),
        '@' + handle,
        wallet,
        data.timestamp || '',
        data.userAgent || '',
        '',
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// optional: GET handler so you can sanity-check the URL in a browser
function doGet() {
  return ContentService
    .createTextOutput('BitBuns WL webhook is live 🐰')
    .setMimeType(ContentService.MimeType.TEXT);
}
