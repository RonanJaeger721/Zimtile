import fs from "node:fs";
import data from "../src/data.json" with { type: "json" };
const old = {
  "/shop": "/products",
  "/about-us": "/about",
  "/contact-zimtile": "/contact",
  "/our-values-culture": "/values",
  "/about-us/export-service": "/export-service",
  "/branches-harare-bulawayo-gweru-mutare-masvingo-kwekwe-chinhoyi":
    "/branches",
  "/branches-harare-bulawayo-gweru-mutare-masvingo-kwekwe": "/branches",
  "/concrete-roof-tiles": "/roof-tiles",
  "/bricks-and-blocks": "/bricks-blocks",
  "/blocks-for-sale": "/bricks-blocks",
  "/category/projects": "/projects",
  "/blog": "/news",
  "/basket": "/quote",
  "/cart": "/quote",
  "/checkout": "/quote",
  "/wishlist": "/quote",
  "/sitemap": "/sitemap.xml",
};
const categoryOld = {
  "concrete-ridges": 45,
  "industrial-pavers-precast": 46,
  "domestic-pavers-precast": 51,
  "other-accessories": 52,
  "breeze-blocks": 124,
  "kerbstone-for-sale": 124,
  slabs: 123,
};
for (const [slug, id] of Object.entries(categoryOld))
  old["/" + slug] =
    "/products/category/" + data.categories.find((c) => c.id === id).slug;
for (let cat of data.categories) {
  old["/product-category/" + cat.slug] = "/products/category/" + cat.slug;
  if (/^(wet-mix|dry-mix)/.test(cat.slug)) {
    old["/domestic-pavers-precast/" + cat.slug] =
      "/products/category/" + cat.slug;
    old["/" + cat.slug] = "/products/category/" + cat.slug;
  }
}
for (let p of data.content)
  old["/" + p.slug] =
    `/${p.type === "project" ? "projects" : "news"}/${p.slug}`;
fs.writeFileSync(
  "vercel.json",
  JSON.stringify(
    {
      framework: "vite",
      buildCommand: "npm run build",
      outputDirectory: "dist",
      cleanUrls: true,
      trailingSlash: false,
      redirects: [
        ...Object.entries(old).map(([source, destination]) => ({
          source,
          destination,
          permanent: true,
        })),
        {
          source: "/product/:slug",
          destination: "/products/:slug",
          permanent: true,
        },
        {
          source: "/shop/page/:page",
          destination: "/products",
          permanent: true,
        },
      ],
      headers: [
        {
          source: "/assets/(.*)",
          headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
        },
        {
          source: "/(.*)",
          headers: [
            { key: "X-Content-Type-Options", value: "nosniff" },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin",
            },
          ],
        },
      ],
    },
    null,
    2,
  ),
);
console.log("Configured", Object.keys(old).length + 2, "permanent redirects");
