import fs from "node:fs";
import assert from "node:assert/strict";
import { routePaths } from "../build-server/entry-server.js";
import data from "../src/data.json" with { type: "json" };
const source = [
  ...JSON.parse(fs.readFileSync("source/products-api.json")),
  ...JSON.parse(fs.readFileSync("source/products-api-2.json")),
];
assert.equal(
  data.products.length,
  source.length,
  "The source catalogue must be complete",
);
assert.equal(
  new Set(data.products.map((x) => x.slug)).size,
  113,
  "Unique product URLs",
);
for (let p of source) {
  let migrated = data.products.find((x) => x.id === p.id);
  assert.ok(migrated, `Missing product ${p.id}`);
  assert.equal(migrated.slug, p.slug);
  assert.equal(migrated.sku, p.sku);
  assert.deepEqual(
    migrated.attributes,
    p.attributes.map((a) => ({
      name: a.name,
      value: a.terms.map((t) => t.name).join(", "),
    })),
  );
}
let links = new Set(),
  assets = new Set(),
  titles = new Set();
for (let route of routePaths) {
  let file = route === "/" ? "dist/index.html" : `dist${route}.html`,
    html = fs.readFileSync(file, "utf8");
  assert.ok(html.includes("<h1"), "Missing heading " + route);
  assert.equal(
    [...html.matchAll(/<h1[\s>]/g)].length,
    1,
    "One primary heading: " + route,
  );
  assert.ok(!html.includes("$0.00"), "Zero price " + route);
  let canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(canonical, "https://www.zimtile.co.zw" + route);
  let title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(!titles.has(title), "Duplicate title " + title);
  titles.add(title);
  for (let m of html.matchAll(/href="(\/[^"?#]*)"/g)) links.add(m[1]);
  for (let m of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g))
    assets.add(m[1]);
  for (let m of html.matchAll(/(?:srcSet|srcset|imageSrcSet)="([^"]+)"/g)) {
    for (let item of m[1].split(",")) assets.add(item.trim().split(" ")[0]);
  }
}
for (let link of links) {
  if (link.startsWith("/assets/")) continue;
  assert.ok(routePaths.includes(link), `Unresolved internal link: ${link}`);
}
for (let asset of assets)
  assert.ok(fs.existsSync("dist" + asset), `Missing asset: ${asset}`);
let url = process.argv[2];
if (url) {
  let next = 0;
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      while (next < routePaths.length) {
        let path = routePaths[next++];
        let r = await fetch(url + path),
          html = await r.text();
        assert.equal(r.status, 200, path);
        assert.ok(
          html.includes(
            `rel="canonical" href="https://www.zimtile.co.zw${path}"`,
          ),
          `Wrong server HTML at ${path}`,
        );
      }
    }),
  );
}
console.log(
  JSON.stringify(
    {
      sourceProducts: source.length,
      prerenderedPages: routePaths.length,
      uniqueTitles: titles.size,
      internalLinks: links.size,
      verifiedAssets: assets.size,
      httpRoutes: url ? routePaths.length : 0,
      status: "PASS",
    },
    null,
    2,
  ),
);
