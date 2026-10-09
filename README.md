# Zimtile — materials for generations

Complete React/Vite catalogue redesign, with 149 prerendered pages and client-side navigation. The original Zimtile website is the factual source. No prices or stock levels are inferred.

## Run locally

Requires Node.js 22.12+ (tested with 24.18).

```sh
npm ci
npm run dev
npm run build
npm run preview
node scripts/audit.mjs http://127.0.0.1:4173
```

## Content

- `src/data.json`: all 113 products, 12 actual category memberships, source specifications/SKUs, five projects, one news article, company information and source asset mapping.
- `src/branches.js`: the eight source branches, recorded contact numbers and opening hours.
- `source/`: original public WordPress and WooCommerce JSON snapshots collected 9 October 2026. They provide an audit trail; runtime does not depend on the original website.
- `public/assets/`: original-site photography, compressed to WebP with responsive sizes. No generated project images or fabricated product variants.

The source category counts overlap: a product may belong to both Domestic Pavers and Precast and a Wet Mix category. Counts must not be added together to calculate the catalogue total. The original site supplies a generic “image coming soon” image for some products; these are shown with an explicit photograph-on-enquiry state.

The Supermarket Project title refers to Harare while its description refers to Gweru. Both are preserved and the detail page flags the discrepancy. The two Church Project entries also use housing-project descriptions in the source; those descriptions are retained.

## Enquiries

The quote list persists on the visitor’s device. Forms validate required details, prepare a message and provide an explicit WhatsApp/email handoff and downloadable JSON copy. They do not claim a server submission or automatic delivery. The visitor reviews and sends the message in the chosen app. WhatsApp `263785744281` is verified by the original site's WhatsApp link; email is `enquiries@zimtile.co.zw`.

No CRM, email API, stock service, payment gateway, admin CMS or live inventory integration is configured. Client-side quote storage contains product IDs and quantities only. Form details are not saved in local storage.

## Publishing and SEO

`npm run build` emits static HTML, metadata, canonical links, Organization/Product/Article/LocalBusiness/Breadcrumb JSON-LD, sitemap and robots in `dist`. Product schema intentionally omits Offers, prices and availability.

`vercel.json` declares `dist`, clean URLs and 56 permanent legacy-route redirect rules, including the original product slugs. The build writes clean-URL `.html` files to ensure each deep route receives its own HTML before hydration.

Canonical URLs currently target `https://www.zimtile.co.zw`, the source business domain. Configure the final domain before publication if that changes. A real production release still requires an approved host, domain ownership and rendered-public verification. Redirect behavior must be checked on the chosen host; local Vite preview does not implement Vercel redirects.

Legacy basket, cart, checkout and wishlist routes lead to the quote workflow. Existing WooCommerce account/order records are not migrated by this static redesign. The original company Privacy Policy and Terms are retained for review; publication should review their references to accounts/cookies against the selected hosting and enquiry architecture.

## Design

Brand red `#E50011`, warm off-white, charcoal and concrete neutrals. Manrope and DM Sans. Keyboard-operable material selectors, profile/colour studio, project expansion on scroll, directional reveal animations, scroll-aware navigation, responsive menu, catalogue filters and modal search/quick view. Reduced-motion support is built in.
