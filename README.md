# Emberwell – one-product Shopify store (rechargeable hand warmer)

A ready-made Shopify theme for selling worldwide in English, built on Shopify's free **Dawn** theme.
It has a landing-style homepage, a product page with 1 / 2 / 4-set bundles, a delivery-date estimate,
a Christmas gift section, FAQ, a money-back guarantee block and a country/currency selector.

| What | File |
|---|---|
| **Why this product won** (research + backups) | `store-setup/WINNING-PRODUCT.md` |
| Theme (install into Shopify) | `assets/ config/ layout/ locales/ sections/ snippets/ templates/` |
| Product import (title, description, prices, bundles) | `store-setup/product-import.csv` |
| Refund / shipping / contact / about texts | `store-setup/policies.md` |
| Facebook ad plan + 5 video scripts + ad copy | `store-setup/facebook-ads.md` |

## No domain needed
Shopify gives every store a free address like **`emberwell-shop.myshopify.com`**. You can sell and run Facebook ads
on it. (Meta can't verify a myshopify.com domain, but ads and purchase tracking still work.)

---

## Part 1 – Only you can do these (≈ 20 min)
These need your identity, password and bank details, so Claude can't do them.

1. **Create the Shopify account:** shopify.com → Start free trial → store name `Emberwell` (or your own).
2. **Connect Shopify to Claude:** in claude.ai go to **Settings → Connectors → Shopify → Connect**, and log in to your
   new store. Then tell Claude "connected". Claude can then create the product, pages and settings for you.
3. **Payments:** Settings → Payments → activate **Shopify Payments** (needs your ID + bank account) and **PayPal**.
4. **Facebook:** install the **Facebook & Instagram** app in Shopify and connect your ad account + pixel
   (Data sharing: **Maximum**).

## Part 2 – Install the theme (2 min)
Online Store → Themes → **Add theme → Connect from GitHub** → `d10-rr1/Bygga-shopify`, branch `master` → **Publish**.

## Part 3 – Product, pages, shipping (Claude does this once Shopify is connected)
For reference, or if you'd rather do it yourself:
1. **Products → Import** → `store-setup/product-import.csv`. Keep the handle `rechargeable-hand-warmer`, because the homepage links to it.
2. **Settings → Policies:** paste from `store-setup/policies.md`.
3. **Pages:** "Contact" (template `contact`) and "About us".
4. **Navigation:** `main-menu` = Home · Hand Warmer (`/products/rechargeable-hand-warmer`) · Contact.
   `footer` = Contact · Shipping · Refunds · Privacy · Terms.
5. **Settings → Shipping:** Free shipping zone with **United States + Canada** first (see WINNING-PRODUCT.md for why).
6. **Settings → Markets:** turn on US + Canada so prices show in local currency.

## Part 4 – Supplier + images (you, ≈ 30 min)
1. Install **DSers** (AliExpress) or **CJdropshipping**.
2. Search "rechargeable magnetic hand warmer 2 in 1". Pick a supplier with 4.7★+, 1,000+ orders, CE/FCC marks,
   and **a US warehouse or ≤ 12-day shipping to the US**. Lithium battery products need a supplier that can ship
   batteries to your markets.
3. Upload **5–8 images + 1 video** to the product. Put the video or best "in use" image first.
4. Update the description and **Specifications** tab to match the real product (battery hours, size). Never claim
   anything the product doesn't do.
5. Map the variants: 1 Set = qty 1, 2 Sets = qty 2, 4 Sets = qty 4.
6. **Order 2 samples to yourself today** and film the ads in `facebook-ads.md`.

## Part 5 – Before you turn on ads
- [ ] Place a real test order on your phone (then refund it)
- [ ] Check the store on mobile: images, buttons, menu
- [ ] Replace `support@YOURSTORE.com` in the footer (Customize → Footer) and upload a logo
- [ ] Upload a hero image to the homepage banner (hands holding the warmer outdoors)
- [ ] Install **Judge.me** for reviews and use **real reviews only** (fake reviews break FTC rules in the US)
- [ ] Remove the store password: Online Store → Preferences (needs a paid Shopify plan)
- [ ] After **Dec 5**, edit the "Order by Dec 5 for Christmas" text in the announcement bar and the product page

## Pricing
| Variant | Price | Compare-at | Real saving |
|---|---|---|---|
| 1 Set | $34.99 | – | – |
| 2 Sets | $59.99 | $69.98 | $10 |
| 4 Sets | $99.99 | $139.96 | $40 |

Compare-at prices are only used on bundles, where they equal 1-set price × quantity, so every "save" claim is true.
Break-even ad cost is about **$20 per 1-set sale**; see `facebook-ads.md` for kill and keep rules.
