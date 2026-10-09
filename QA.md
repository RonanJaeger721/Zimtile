# Zimtile verification — 9 October 2026

## Confirmed

- Production build: 149 prerendered routes; 149 unique titles and canonicals; exactly one primary H1 per page.
- Source audit: all 113 product IDs/slugs/SKUs and recorded attributes preserved from the original public catalogue; all 12 category memberships retained.
- Static audit: 143 internal link targets resolve; 147 referenced local assets exist; no `$0.00` display.
- HTTP audit: all 149 clean URLs return HTTP 200 and their own matching canonical HTML.
- Browser audit: all 149 routes checked at 390px; no page overflow or broken loaded images. No current-build console errors were observed after repairing the clean-URL output.
- Additional breakpoint checks: homepage, catalogue, branches, quote, product, project, about, values and contact at 360, 768, 1366 and 1920px; no page overflow.
- Catalogue: complete 113-item load-more traversal; category and colour filters; quick view; multiword search including “red roof tile”.
- Site search: returned the four red roofing variants and the roof article.
- Quote: multiple materials, quantity increment, removal and reload persistence. WhatsApp and email handoff payloads contain the selected material, code, quantity and entered details. No message was sent during testing. Editing the form removes a previously prepared message.
- Branches: city search, Chinhoyi expansion, source address/phone/hours and address-based directions links.
- Navigation: mobile drawer opens and closes; desktop product mega-menu implemented; hide on downward scroll and return on upward scroll observed. Search/quick-view dialogs trap focus and close with Escape; mobile navigation traps focus and supports Escape. Visible focus styles and reduced-motion CSS are present.
- Roof studio: switching Bold Double Roman to Tuscan updates the product image, name, available variant options and product detail link.
- Photography: main image set compressed from 21.21 MB to 6.06 MB, with responsive source sets. Original downloads are preserved outside the repository in the task's intermediate work folder.

## Scope and limits

This is a complete static company/catalogue frontend with enquiry handoffs. No CRM, automatic email delivery, inventory backend, CMS, payment or WooCommerce account migration is configured. Delivery of a real enquiry depends on the visitor sending it in WhatsApp/email.

The source has inconsistent project titles/descriptions and some generic unavailable-image entries. These are preserved/identified, not replaced with invented data. The branch diagram is schematic; map directions are address searches.

Public hosting, domain/DNS changes and Vercel redirect execution were not performed. The 56 legacy redirect rules are configured and must be verified on the selected production host. No public Core Web Vitals or field-performance claim is made. Legal pages retain source text and should be reviewed for the eventual hosting and enquiry architecture.
