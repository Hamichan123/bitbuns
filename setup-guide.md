# BitBuns WL → Google Sheets Setup

3 files: `bitbuns-wl.html` (the site), `apps-script.gs` (the webhook), this guide.

## Step 1 — Create the Google Sheet

1. Go to [sheets.new](https://sheets.new) — this opens a fresh blank sheet.
2. Rename it something like **"BitBuns WL Applications"**.
3. Leave the sheet empty — the script will create headers automatically on the first submission.

## Step 2 — Add the Apps Script

1. In your sheet, click **Extensions → Apps Script**. A new tab opens with the script editor.
2. Delete any existing code in `Code.gs`.
3. Open `apps-script.gs` (provided alongside the site file), copy **all** of its contents, and paste into the editor.
4. Click the **💾 save icon** (or `Ctrl/Cmd + S`). Name the project "BitBuns WL Webhook".

## Step 3 — Deploy as Web App

1. Top right of the script editor → **Deploy → New deployment**.
2. Click the **⚙ gear icon** next to "Select type" → choose **Web app**.
3. Fill in:
   - **Description:** `BitBuns WL v1`
   - **Execute as:** `Me (your@email.com)`
   - **Who has access:** `Anyone` ⚠️ this is required — without it, the site can't POST
4. Click **Deploy**.
5. Google will ask you to authorize the script:
   - Click **Authorize access**
   - Pick your account
   - You'll see a "Google hasn't verified this app" warning — click **Advanced → Go to BitBuns WL Webhook (unsafe)**. Safe here because it's your own script.
   - Click **Allow**.
6. Copy the **Web app URL**. Looks like:
   `https://script.google.com/macros/s/AKfycby.........../exec`

## Step 4 — Plug the URL into the site

1. Open `bitbuns-wl.html` in any text editor.
2. Find this line (near the top of the `<script>` block, ~line 480):

   ```js
   const WEBHOOK_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';
   ```

3. Replace `PASTE_YOUR_APPS_SCRIPT_URL_HERE` with the URL from Step 3.6.
4. Save the file.

## Step 5 — Test it

1. Open `bitbuns-wl.html` in your browser.
2. Click through all 4 tasks (the link-click gating still applies), fill in a handle + wallet, hit submit.
3. Open your Google Sheet — you should see a new row appear within ~2 seconds.

## What the sheet captures

| Column | Description |
|---|---|
| Timestamp | When the row landed in the sheet (server time) |
| X/Twitter Handle | Normalized to `@handle` lowercase |
| ETH Wallet | The address pasted by the user |
| Submitted At (ISO) | Client-side timestamp |
| User Agent | Browser info (useful for spotting bots) |
| IP / Source | Marked `DUPLICATE` if handle or wallet already exists; row also highlighted red |

## Updating the script later

If you change `apps-script.gs` after deploying:
1. **Deploy → Manage deployments**
2. Click the **✏ pencil** on your active deployment
3. Change **Version** to **New version**
4. Click **Deploy**

The URL stays the same — you don't need to update the HTML again. (If you do **New deployment** instead, you get a different URL and have to repaste it.)

## Hosting the site

The HTML file works standalone — for a public link, drop it on:
- **Vercel / Netlify** — drag-and-drop the file, get a free URL
- **GitHub Pages** — push to a repo, enable Pages
- **Cloudflare Pages** — same drag-and-drop flow

That's it 🐰
