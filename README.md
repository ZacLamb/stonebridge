# Stone Bridge Funding Group — website

Node/Express + EJS. No build step. Deploys to Railway from GitHub with zero config.

## Deploy (GitHub → Railway)

1. Create a new GitHub repo and upload everything in this folder (drag-and-drop in the GitHub web UI works — skip `node_modules`).
2. In Railway: **New Project → Deploy from GitHub repo** → pick the repo. Nixpacks detects Node and runs `npm start`.
3. Add a custom domain in Railway → Settings → Networking, and point `stonebridgefundinggroup.com` at it (CNAME).
4. Optional env var: `GHL_WEBHOOK_URL` — a GoHighLevel inbound webhook URL. The application page embeds your GHL survey directly, so applications land in GHL on their own. When set, contact-page messages and broker deal submissions are POSTed there as JSON (fields: `form`, `full_name`, `business_name`, `phone`, `email`, `message`, `merchant`, `kind`). Without it, submissions are logged to the Railway console.

## Edit content

- `data/site.js` — phone, email, hours, nav, footer disclaimer. 
- `data/products.js` — the four funding products (ranges, fit lists, docs, FAQs). Each entry generates `/funding/<slug>`.
- `data/faqs.js` — FAQ page.
- `views/pages/*.ejs` — page templates. `views/partials/` — header, footer, CTA band.
- `public/css/style.css` — all styling (tokens at the top).

## Pages

`/` · `/funding` · `/funding/merchant-cash-advance` · `/funding/business-term-loans` · `/funding/business-lines-of-credit` · `/funding/business-credit-cards` · `/how-it-works` · `/brokers` · `/about` · `/faq` · `/apply` · `/contact` · `/privacy` · `/sitemap.xml` · `/robots.txt` · 404



`public/img/` — `logo.svg` / `logo.png` (dark on light), `logo-white.svg` / `.png` (for dark backgrounds), `logo-mark.svg` / `.png` (icon only), `favicon.svg`, `favicon-192.png`, `apple-touch-icon.png`. All SVGs have the wordmark converted to outlines, so they render identically anywhere.

## Run locally

```
npm install
npm start   # http://localhost:3000
```
## Logo files

`public/img/` — `logo.png` (transparent, for light backgrounds), `logo-white.png` (wordmark recolored for dark backgrounds), `logo-mark.png` (gold mark only), `favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png`.

## Run locally

```
npm install
npm start   # http://localhost:3000
```
