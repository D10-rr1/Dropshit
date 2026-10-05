# Värmly – Shopify store (heating belt, Sweden)

A one-product Shopify store, set up as a ready-made theme. It is built on Shopify's free **Dawn** theme, with
Swedish text, brand colors, a landing-style homepage, a product page with bundle offers
(1 / 2 / 3 pieces), FAQ, a guarantee block and a delivery-date estimate.

| What | Where |
|---|---|
| Theme (upload to Shopify) | this repo: `assets/ config/ layout/ locales/ sections/ snippets/ templates/` |
| Product import (prices + bundles + description) | `store-setup/produkt-import.csv` |
| Policies to paste (refund, shipping, contact) | `store-setup/policyer.md` |
| Facebook ad scripts + test plan | `store-setup/facebook-annonser.md` |

---

## Launch steps (≈ 2–3 hours)

These steps need your login, ID or payment details, so you have to do them yourself.

### 1. Create the store (10 min)
1. Go to **shopify.com** → Start free trial.
2. **Settings → Store details**: store name `Värmly` (or your own name), your company details and address.
   You need a registered business (enskild firma is fine) to sell legally in Sweden.
3. **Settings → Languages**: add **Swedish** and make it the default language.
4. **Settings → Markets**: primary market Sweden, currency **SEK**.
5. **Settings → Taxes**: turn on "Include tax in prices" (Swedish VAT 25%).

### 2. Install the theme (5 min)
**Option A, GitHub (recommended, updates automatically):**
Online Store → Themes → **Add theme → Connect from GitHub** → choose `d10-rr1/Bygga-shopify`, branch `master`
→ **Publish**.

**Option B, ZIP upload:**
On GitHub click **Code → Download ZIP**. Unzip it and zip again **only** the folders `assets config layout
locales sections snippets templates` (they must be at the root of the zip). Then go to Online Store → Themes →
Add theme → Upload zip file → Publish.

### 3. Import the product (5 min)
1. **Products → Import** → upload `store-setup/produkt-import.csv`.
2. Open the product **Värmly™ Trådlöst Värmebälte** (handle must stay `varmebalte`; the homepage links to it).
3. Upload **5–8 images and 1 demo video** from your supplier. Put the video or the best "in use" image first.
4. **Update the description bullets so they match the real product** (battery hours, heat levels, size).
   Never claim something the product doesn't do.
5. Set the **cost per item** for each variant so Shopify shows your profit.

### 4. Supplier (20 min)
1. Install **DSers** (AliExpress) or **CJdropshipping** from the Shopify App Store.
2. Search "wireless heating belt menstrual" / "cordless heating pad belt". Choose a supplier with:
   4.7★+, 1,000+ orders, **CE marking**, EU warehouse or "AliExpress Standard Shipping" to Sweden ≤ 12 days.
3. **Order 1–2 samples to yourself now.** Film your own ads with them; this is the biggest advantage you can get.
4. Map the supplier product to the 3 variants (2 st = quantity 2, 3 st = quantity 3).

### 5. Payments (15 min)
**Settings → Payments**: activate **Shopify Payments** (card, Apple Pay, Google Pay), then add **Klarna** and
**Swish** (through Shopify Payments if offered to you, otherwise install the official apps).

### 6. Shipping (5 min)
**Settings → Shipping**: Sweden → rate "Fri frakt", 0 kr, delivery 5–10 working days.

### 7. Pages and menus (20 min)
1. **Settings → Policies**: paste the texts from `store-setup/policyer.md` (replace the `[BRACKETS]`).
2. **Online Store → Pages**: create "Kontakt" with template `contact`, and "Om oss".
3. **Online Store → Navigation**:
   - `main-menu`: Hem · Värmebältet (`/products/varmebalte`) · Kontakt
   - `footer`: Kontakt · Frakt · Återbetalning · Integritet · Villkor
4. In the theme editor (**Customize**) replace `hej@DINDOMÄN.se` in the footer and upload your logo.
5. Upload a **hero image** to the homepage banner (lifestyle photo of the belt worn under a sweater).

### 8. Domain (5 min)
**Settings → Domains → Buy new domain**, e.g. `varmly.se` / `getvarmly.com`. Check that it is not someone
else's trademark.

### 9. Reviews (10 min)
Install **Judge.me** (free) and add its widget block to the product page in the theme editor.
Only use **real** reviews (e.g. imported reviews of the exact supplier listing, clearly marked, or reviews from your own
customers). Fake reviews and fake "X customers" counters break Swedish marketing law (marknadsföringslagen).

### 10. Newsletter discount
The footer promises **10% off** for newsletter signups. Create a discount code `VALKOMMEN10` under **Discounts**,
and a welcome email under **Marketing → Automations → Welcome new subscribers**. If you don't want that offer, change
the footer heading in Customize.

### 11. Facebook / Meta (30 min)
1. Install the **Facebook & Instagram** app in Shopify → connect your Business Manager, Ad Account and Pixel.
   Data sharing: **Maximum** (Conversions API).
2. Business Manager → Brand safety → **Domains** → verify your domain.
3. Events Manager → check that `Purchase`, `AddToCart` and `InitiateCheckout` fire (place a test order with a
   100% discount code).
4. Follow `store-setup/facebook-annonser.md`.

### 12. Pre-launch check
- [ ] Place a test order on your phone, from start to finish, with Klarna and with card
- [ ] Open the store on mobile: images load, buttons work, no English leftovers
- [ ] Policies and contact page are filled in with your real company details
- [ ] Remove the store password: **Online Store → Preferences** (needs a paid plan)

---

## Pricing logic
| Variant | Price | Compare-at | Saving |
|---|---|---|---|
| 1 st | 449 kr | – | – |
| 2 st | 699 kr | 898 kr | 22 % |
| 3 st | 899 kr | 1 347 kr | 33 % |

The compare-at price is only used on bundles, and it equals 1-piece price × quantity, so the saving is real.
Don't add a made-up "before" price on the single unit: EU price rules (Omnibus) require it to be the lowest price
from the last 30 days.

With a ~100–130 kr product cost incl. shipping, 1 st gives ≈ 230 kr gross profit after VAT and fees. Your
**break-even CPA** (max ad cost per sale) is therefore ≈ 200–230 kr. Kill ads that run above that.
