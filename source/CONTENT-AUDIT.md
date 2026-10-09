# Source audit — 9 October 2026

Primary source: https://www.zimtile.co.zw/

Public endpoints used:

- `/wp-json/wc/store/v1/products?per_page=100&page=1` and page 2: 113 products.
- `/wp-json/wc/store/v1/products/categories?per_page=100`: 12 categories. Each category was queried independently to preserve membership because the unfiltered source response returned empty category arrays.
- `/wp-json/wp/v2/posts?per_page=100&_embed`: five projects and one news article.
- `/wp-json/wp/v2/pages?per_page=100&_embed`: company, values, exports, social responsibility, contacts, branches and legal content.
- Homepage HTML: brand logo, primary colour, featured assets, contact and official WhatsApp link.

Company source pages:

- https://www.zimtile.co.zw/about-us/
- https://www.zimtile.co.zw/our-values-culture/
- https://www.zimtile.co.zw/about-us/export-service/
- https://www.zimtile.co.zw/social-responsibility/
- https://www.zimtile.co.zw/contact-zimtile/
- https://www.zimtile.co.zw/branches-harare-bulawayo-gweru-mutare-masvingo-kwekwe-chinhoyi/

Contacts and hours were transcribed directly. The revised interactive map uses the eight Google Maps embed centre coordinates in the original branch page. The source embeds and coordinates are retained in `src/branch-locations.json`; no pin coordinates were guessed. These are the locations supplied by the source website, rather than an independent survey of each premises. Street tiles are provided by OpenStreetMap with visible attribution. Directions use the recorded branch addresses in Google Maps.

All migrated product names, slugs, SKUs and specification attributes are traceable to the snapshots. The source's zero prices and stock indicators are deliberately not displayed as commercial promises. Category recommendations describe a starting point and ask the visitor to confirm application suitability with a branch.

The two Church Project descriptions refer to housing. The Supermarket Project title and description disagree about location. These source inconsistencies are retained rather than resolved through invented details.

Product application photography comes from the original catalogue, which may contain supporting imagery. Such imagery is not labelled as a specific completed Zimtile project. Dedicated project pages use their source project images.

The revised hero film and poster are mechanical extracts of `https://www.zimtile.co.zw/wp-content/uploads/Zimtile-About.mp4`, referenced by the original About page. The source shows Zimtile-branded premises. A 14-second muted excerpt was compressed for desktop background playback; mobile/reduced-motion views use its still poster. No external architectural footage or generated scenes were introduced.
