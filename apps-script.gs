/**
 * RSVP endpoint for the public wedding website.
 * IMPORTANT: This endpoint accepts submissions only; it has no read/list operation.
 * Keep the linked response spreadsheet's sharing set to Restricted and share it
 * only with the two intended email accounts (instructions in README-ACCESS.txt).
 */
const SHEET_NAME = 'RSVPs';

// Paste the ID from your new Google Sheet's URL between the quotes.
// Example URL: https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit
const SPREADSHEET_ID = 'https://docs.google.com/spreadsheets/d/1A6QCqAUsTqe3zjiCcQVkMnVPTsEQnPFa2K0bwkX_6qI/edit';

// Replace these two placeholders with the ONLY two accounts that should be
// granted access to view RSVP responses. Also use them in the Sheet's Share dialog.
const RSVP_VIEWER_EMAIL_1 = 'pushkaragnihotri722@gmail.com';
const RSVP_VIEWER_EMAIL_2 = 'vaishnavi.ranade25@gmail.com';

// Optional email notifications for every RSVP; uses the same two authorized accounts.
const NOTIFY = [RSVP_VIEWER_EMAIL_1, RSVP_VIEWER_EMAIL_2];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (!SPREADSHEET_ID || SPREADSHEET_ID === 'https://docs.google.com/spreadsheets/d/1A6QCqAUsTqe3zjiCcQVkMnVPTsEQnPFa2K0bwkX_6qI/edit') {
      throw new Error('Set SPREADSHEET_ID in apps-script.gs before submitting RSVPs.');
    }
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(['Submitted', 'Name', 'Attending', 'Guests', 'Members & dietary needs']);
    }
    sh.appendRow([d.submitted || new Date().toISOString(), d.name || '', d.attending || '', d.guests || 0, d.members || '']);
    const recipients = NOTIFY.filter(email => email && !email.includes('example.com'));
    if (recipients.length) {
      MailApp.sendEmail(
        recipients.join(','),
        'New wedding RSVP: ' + (d.name || 'Guest'),
        (d.name || 'Guest') + ' — ' + (d.attending || 'No response') +
          '\nGuests: ' + (d.guests || 0) + '\n' + (d.members || '')
      );
    }
  } catch (err) {
    console.error("RSVP ERROR: " + (err.stack || err));
    throw err;
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}
