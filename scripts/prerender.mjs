import fs from "node:fs";
import path from "node:path";
import { render, routePaths, metadata } from "../build-server/entry-server.js";
import data from "../src/data.json" with { type: "json" };
import { branches, hours, tel } from "../src/branches.js";
const template = fs.readFileSync("dist/index.html", "utf8"),
  base = "https://www.zimtile.co.zw";
const esc = (s) =>
  s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
for (const route of routePaths) {
  let m = metadata(route),
    p = data.products.find((p) => route === "/products/" + p.slug),
    story = data.content.find(
      (p) =>
        route === `/${p.type === "project" ? "projects" : "news"}/${p.slug}`,
    );
  let schema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Zimtile",
      url: base,
      logo: base + "/assets/zimtile-logo-white.png",
      foundingDate: "1957",
      telephone: "+263785744281",
      email: "enquiries@zimtile.co.zw",
      sameAs: [
        "https://www.facebook.com/ZimtileZimbabwe/",
        "https://www.instagram.com/zimtilecompany",
      ],
    },
  ];
  if (p)
    schema.push({
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      sku: p.sku || undefined,
      image: p.images
        .filter((x) => !x.includes("coming-soon"))
        .map((x) => base + x),
      brand: { "@type": "Brand", name: "Zimtile" },
      description: m.description,
      additionalProperty: p.attributes.map((a) => ({
        "@type": "PropertyValue",
        name: a.name,
        value: a.value,
      })),
    });
  if (story && story.type === "news")
    schema.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: story.title,
      datePublished: story.date,
      author: { "@type": "Organization", name: "Zimtile" },
      publisher: { "@type": "Organization", name: "Zimtile" },
      mainEntityOfPage: base + route,
    });
  if (route === "/branches")
    schema.push(
      ...branches.map((b) => ({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Zimtile " + b.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: b.address,
          addressLocality: b.name,
          addressCountry: "ZW",
        },
        telephone: tel(b.phones[0]),
        openingHours: ["Mo-Fr 08:00-17:00", "Sa 08:00-13:00"],
      })),
    );
  if (route !== "/")
    schema.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base },
        {
          "@type": "ListItem",
          position: 2,
          name: m.title.split(" |")[0],
          item: base + route,
        },
      ],
    });
  let head = `<meta name="description" content="${esc(m.description)}"><link rel="canonical" href="${base + route}"><meta property="og:title" content="${esc(m.title)}"><meta property="og:description" content="${esc(m.description)}"><meta property="og:url" content="${base + route}"><meta property="og:type" content="${story?.type === "news" ? "article" : "website"}"><meta property="og:image" content="${base + m.image}"><script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>`;
  let html = template
    .replace(/<title>.*?<\/title>/, `<title>${esc(m.title)}</title>`)
    .replace("</head>", head + "</head>")
    .replace("<!--app-->", () => render(route));
  let file = route === "/" ? "dist/index.html" : "dist" + route + ".html";
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}
fs.writeFileSync(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\nDisallow: /quote\nSitemap: ${base}/sitemap.xml\n`,
);
fs.writeFileSync(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routePaths
    .filter((x) => x !== "/quote")
    .map((r) => `<url><loc>${base + r}</loc></url>`)
    .join("")}</urlset>`,
);
fs.writeFileSync(
  "dist/404.html",
  template.replace("<!--app-->", render("/not-found")),
);
console.log(
  `Prerendered ${routePaths.length} pages with metadata and structured data.`,
);
