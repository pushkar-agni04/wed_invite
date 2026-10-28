RSVP PRIVACY: SET UP ACCESS FOR ONLY TWO EMAIL ACCOUNTS

There are two separate things to configure: the Google Sheet permissions control who can VIEW RSVP data; the Apps Script web app lets the public wedding website SUBMIT an RSVP. The script intentionally has no function that reads or returns the RSVP list.

1) Add the Google Sheet ID and two email addresses
   In apps-script.gs, replace PASTE_YOUR_GOOGLE_SHEET_ID_HERE with the ID from your new Sheet URL.
   For a URL like https://docs.google.com/spreadsheets/d/1AbC...xyz/edit, copy only 1AbC...xyz.
   Open apps-script.gs and replace:
     FIRST_AUTHORIZED_EMAIL@example.com
     SECOND_AUTHORIZED_EMAIL@example.com
   with the two real email addresses. Save the script. This script uses openById so it explicitly targets your new Sheet.

2) Restrict access to the response spreadsheet (this is the critical privacy step)
   - Open the Google Sheet used by the Apps Script.
   - Click Share.
   - Under General access, choose Restricted (not “Anyone with the link”).
   - Remove any people/groups who should not see RSVP data.
   - Share with only the two email addresses entered above, with Viewer access if they only need to see responses, or Editor if they must manage the sheet.
   - The Google account that owns the Sheet will still have access as owner. Check any inherited/shared-drive permissions too.
   - Do not publish the sheet to the web.

3) Deploy the submission endpoint
   - In the Sheet, open Extensions > Apps Script.
   - Paste/save the contents of apps-script.gs.
   - Deploy > Manage deployments > Edit (or New deployment) > Web app.
   - Execute as: Me.
   - Who has access: Anyone (needed so wedding guests can submit without signing in).
   - Deploy and authorize. Copy the web app URL ending in /exec.
   - In index.html, set CONFIG.endpoint to that URL.
   - If you changed an existing deployment, deploy a new version so the code changes take effect.

Important distinction: “Anyone” on the Apps Script web-app deployment allows visitors to POST RSVP submissions; it does NOT share the spreadsheet with them. Keep the Sheet itself Restricted. Do not add any doGet/read endpoint that returns sheet rows.

4) Test
   - Submit a test RSVP on the public site.
   - Confirm the row appears in the response Sheet.
   - Confirm only the Sheet owner and the two selected accounts can open the response Sheet.
   - The two selected accounts receive notification emails once their real addresses are filled in.

RSVP guest counter
The + button adds one guest and the − button subtracts one (minimum 1). There is no displayed guest-limit note or hard-coded maximum in the counter.
