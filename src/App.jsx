import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  X,
  Menu,
  Plus,
  Minus,
  MapPin,
  Phone,
  ChevronDown,
  Check,
  SlidersHorizontal,
  Mail,
} from "lucide-react";
import data from "./data.json";
import { branches, hours, tel } from "./branches.js";
const { products, categories, content, information } = data;
const projects = content.filter((x) => x.type === "project"),
  news = content.filter((x) => x.type === "news");
const Ctx = createContext();
const pretty = (s) =>
  s.replace(/\b[A-Z][A-Z]+\b/g, (w) => w[0] + w.slice(1).toLowerCase());
const has = (p, id) => p.categories.some((c) => c.id === id);
const roof = products.filter((p) => has(p, 44));
const groups = [
  {
    name: "Roofing",
    label: "Above it all.",
    cat: 44,
    path: "/roof-tiles",
    image: "/assets/WhatsApp-Image-2026-03-11-at-4.07.04-PM.webp",
    copy: "Concrete roof tiles and ridges. Find the profile that defines your roofline.",
  },
  {
    name: "Paving",
    label: "A stronger foundation.",
    cat: 51,
    path: "/pavers",
    image: "/assets/DSC03367-scaled.webp",
    copy: "Domestic and industrial pavers for the spaces that connect us.",
  },
  {
    name: "Building",
    label: "Built into every detail.",
    cat: 47,
    path: "/bricks-blocks",
    image: "/assets/about-zimtile.webp",
    copy: "Bricks, blocks and concrete building solutions. Start with something solid.",
  },
];
export const routePaths = [
  "/",
  "/products",
  "/solutions",
  "/roof-tiles",
  "/pavers",
  "/bricks-blocks",
  "/precast",
  "/projects",
  "/about",
  "/values",
  "/branches",
  "/news",
  "/contact",
  "/quote",
  "/export-service",
  "/social-responsibility",
  "/privacy-policy",
  "/terms-and-conditions",
  ...products.map((x) => "/products/" + x.slug),
  ...content.map(
    (x) => `/${x.type === "project" ? "projects" : "news"}/${x.slug}`,
  ),
  ...categories.map((x) => "/products/category/" + x.slug),
];
export function metadata(path) {
  let p = products.find((p) => path === "/products/" + p.slug),
    category = categories.find((c) => path === "/products/category/" + c.slug),
    story = content.find(
      (p) =>
        path === `/${p.type === "project" ? "projects" : "news"}/${p.slug}`,
    );
  let title = p
    ? pretty(p.name)
    : story
      ? story.title
      : category
        ? `${category.name} — product catalogue`
        : {
            "/": "Building Zimbabwe since 1957",
            "/products": "Concrete building materials catalogue",
            "/roof-tiles": "Concrete roof tiles",
            "/pavers": "Domestic and industrial pavers",
            "/branches": "Find your nearest Zimtile",
            "/about": "Our story, since 1957",
            "/quote": "Request a quotation",
            "/solutions": "Find materials for your project",
            "/projects": "Built with Zimtile — projects",
            "/bricks-blocks": "Bricks and concrete blocks",
            "/precast": "Precast concrete materials",
            "/values": "Our values and culture",
            "/news": "Building knowledge — news and insights",
            "/contact": "Contact Zimtile",
            "/export-service": "Regional export service",
            "/social-responsibility": "Social responsibility",
            "/privacy-policy": "Privacy Policy",
            "/terms-and-conditions": "Terms and Conditions",
          }[path] || pretty(path.split("/").at(-1).replaceAll("-", " "));
  return {
    title: `${title} | Zimtile Zimbabwe`,
    description: p
      ? `Explore ${pretty(p.name)} from Zimtile. View recorded product details, add to your quote and enquire about pricing and branch availability.`
      : story
        ? story.text.slice(0, 155)
        : "Roofing, paving, bricks, blocks and concrete building solutions. Discover Zimtile products, projects and branches across Zimbabwe.",
    image: p?.images[0] || story?.image || groups[1].image,
  };
}
function Link({ to, children, ...rest }) {
  const c = useContext(Ctx);
  return (
    <a
      href={to}
      {...rest}
      onClick={(e) => {
        rest.onClick?.(e);
        if (
          !e.defaultPrevented &&
          to.startsWith("/") &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.shiftKey
        ) {
          e.preventDefault();
          c.go(to);
        }
      }}
    >
      {children}
    </a>
  );
}
function Button({ to, children, secondary = false, ...rest }) {
  return to ? (
    <Link
      className={`button ${secondary ? "secondary" : ""}`}
      to={to}
      {...rest}
    >
      {children}
      <ArrowUpRight size={18} />
    </Link>
  ) : (
    <button className={`button ${secondary ? "secondary" : ""}`} {...rest}>
      {children}
      <ArrowUpRight size={18} />
    </button>
  );
}
function Eyebrow({ children }) {
  return (
    <div className="eyebrow">
      <i />
      {children}
    </div>
  );
}
function Image({ src, alt, className = "", eager = false, ...rest }) {
  return (
    <img
      src={src}
      srcSet={data.media?.[src]}
      sizes="(max-width: 640px) 95vw, (max-width: 960px) 50vw, 60vw"
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      {...rest}
    />
  );
}
function ProductImage({ p, ...rest }) {
  return p.images[0] && !p.images[0].includes("coming-soon") ? (
    <Image src={p.images[0]} alt={pretty(p.name)} {...rest} />
  ) : (
    <div className="image-unavailable">
      <span>PRODUCT PHOTOGRAPH</span>
      <p>Available on enquiry</p>
    </div>
  );
}
function SectionHead({ n, label, title, copy, to }) {
  return (
    <div className="section-head reveal">
      <div>
        <Eyebrow>
          {n} / {label}
        </Eyebrow>
        <h2>{title}</h2>
      </div>
      <div>
        {copy && <p>{copy}</p>}
        {to && (
          <Link className="text-link" to={to}>
            Explore {label.toLowerCase()} <ArrowUpRight size={18} />
          </Link>
        )}
      </div>
    </div>
  );
}
function Header() {
  const c = useContext(Ctx),
    [menu, setMenu] = useState(false),
    [mega, setMega] = useState(false),
    [hidden, setHidden] = useState(false),
    [scrolled, setScrolled] = useState(false);
  let last = useRef(0);
  const drawer = useRef();
  useEffect(() => {
    if (!menu) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer.current?.querySelector("a")?.focus();
    const key = (e) => {
      if (e.key === "Escape") setMenu(false);
      if (e.key === "Tab") {
        const links = [...drawer.current.querySelectorAll("a,button")];
        if (e.shiftKey && document.activeElement === links[0]) {
          e.preventDefault();
          links.at(-1).focus();
        } else if (!e.shiftKey && document.activeElement === links.at(-1)) {
          e.preventDefault();
          links[0].focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [menu]);
  useEffect(() => {
    const fn = () => {
      let y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - last.current) > 8) {
        setHidden(y > last.current && y > 150);
        last.current = y;
      }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    setMenu(false);
    setMega(false);
  }, [c.path]);
  return (
    <>
      <header
        className={`header ${scrolled ? "scrolled" : ""} ${hidden && !menu && !mega ? "hidden" : ""}`}
      >
        <Link to="/" className="logo">
          <Image src="/assets/zimtile-logo-white.png" alt="Zimtile" eager />
        </Link>
        <nav aria-label="Main navigation">
          <button
            className={mega ? "active" : ""}
            onClick={() => setMega(!mega)}
            aria-expanded={mega}
          >
            Products <ChevronDown size={13} />
          </button>
          {[
            "Solutions",
            "Projects",
            "About",
            "Branches",
            "News",
            "Contact",
          ].map((n) => (
            <Link key={n} to={"/" + n.toLowerCase()}>
              {n}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Search the site"
            onClick={() => c.setSearch(true)}
          >
            <Search size={19} />
          </button>
          <Link
            className="quote-count"
            to="/quote"
            aria-label={`My quote, ${c.quote.length} products`}
          >
            Quote <span>{c.quote.length}</span>
          </Link>
          <Button to="/quote">Request a quote</Button>
          <button
            className="icon-button mobile-toggle"
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {mega && (
        <div className="mega">
          <div className="mega-groups">
            {[
              { title: "Roofing", ids: [44, 45, 52] },
              { title: "Paving", ids: [51, 46, 120, 121, 122, 123] },
              { title: "Building", ids: [47, 50, 124] },
            ].map((g) => (
              <div key={g.title}>
                <Eyebrow>{g.title}</Eyebrow>
                {g.ids.map((id) => {
                  let cat = categories.find((c) => c.id === id);
                  return (
                    <Link key={id} to={"/products/category/" + cat.slug}>
                      {cat.name}
                      <ArrowUpRight size={15} />
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
          <Link to="/products" className="text-link">
            View all products <ArrowRight size={18} />
          </Link>
        </div>
      )}
      {menu && (
        <div
          ref={drawer}
          className="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <button
            className="drawer-close icon-button"
            aria-label="Close navigation"
            onClick={() => setMenu(false)}
          >
            <X />
          </button>
          <Eyebrow>Explore Zimtile</Eyebrow>
          {[
            "Products",
            "Solutions",
            "Projects",
            "About",
            "Branches",
            "News",
            "Contact",
            "Values",
          ].map((n) => (
            <Link key={n} to={"/" + n.toLowerCase()}>
              {n}
              <ArrowUpRight />
            </Link>
          ))}
          <Button to="/quote">Request a quote</Button>
        </div>
      )}
    </>
  );
}
function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <Link className="footer-logo" to="/">
            <Image src="/assets/zimtile-logo-white.png" alt="Zimtile" />
          </Link>
          <h3>
            Solid materials.
            <br /> Lasting possibilities.
          </h3>
          <p>Building Zimbabwe since 1957.</p>
        </div>
        {[
          {
            title: "Materials",
            links: [
              ["Roof tiles", "/roof-tiles"],
              ["Pavers", "/pavers"],
              ["Bricks & blocks", "/bricks-blocks"],
              ["Precast", "/precast"],
              ["All products", "/products"],
            ],
          },
          {
            title: "Company",
            links: [
              ["Our story", "/about"],
              ["Projects", "/projects"],
              ["Values & culture", "/values"],
              ["News", "/news"],
              ["Export service", "/export-service"],
              ["Social responsibility", "/social-responsibility"],
            ],
          },
          {
            title: "Let’s build",
            links: [
              ["Request a quote", "/quote"],
              ["Find a branch", "/branches"],
              ["Contact", "/contact"],
            ],
          },
        ].map((g) => (
          <div key={g.title}>
            <h4>{g.title}</h4>
            {g.links.map(([n, l]) => (
              <Link key={n} to={l}>
                {n}
              </Link>
            ))}
          </div>
        ))}
        <div className="footer-contact">
          <h4>Visit or get in touch</h4>
          <p>
            Cnr Glen Eagles / J.Martin Rd,
            <br /> Lochinvar, Harare
          </p>
          <a href="tel:+263785744281">+263 785 744 281</a>
          <a href="mailto:enquiries@zimtile.co.zw">enquiries@zimtile.co.zw</a>
          <p>
            Mon–Fri 8 a.m.–5 p.m.
            <br /> Sat 8 a.m.–1 p.m.
            <br /> Closed Sun & public holidays
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© Zimtile {new Date().getFullYear()}</span>
        <div>
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/terms-and-conditions">Terms</Link>
          <a
            href="https://www.facebook.com/ZimtileZimbabwe/"
            target="_blank"
            rel="noreferrer"
          >
            Facebook ↗
          </a>
          <a
            href="https://www.instagram.com/zimtilecompany"
            target="_blank"
            rel="noreferrer"
          >
            Instagram ↗
          </a>
        </div>
        <span>Manufactured for Zimbabwe.</span>
      </div>
    </footer>
  );
}
function Hero() {
  const [selected, setSelected] = useState(1);
  let g = groups[selected];
  return (
    <section className="hero">
      <div className="hero-copy">
        <Eyebrow>Building Zimbabwe since 1957</Eyebrow>
        <h1>
          Built into
          <br /> Zimbabwe.
          <br />{" "}
          <span>
            Made for
            <br /> generations.
          </span>
        </h1>
        <p>
          From the roofline to the groundwork.
          <br /> Concrete materials for the places
          <br className="desktop-break" /> we call home, work and tomorrow.
        </p>
        <div className="hero-ctas">
          <Button to="/products">Explore products</Button>
          <Link className="text-link" to="/quote">
            Let’s build <ArrowUpRight size={19} />
          </Link>
        </div>
        <div className="hero-footnote">
          <span className="tiny-cross">+</span>
          <span>ROOFING · PAVING · BUILDING</span>
          <span>01 — 03</span>
        </div>
      </div>
      <div className={`hero-visual scene-${selected}`}>
        <div className="hero-pictures">
          {groups.map((x, i) => (
            <Image
              key={x.name}
              src={x.image}
              alt={`${x.name} imagery from Zimtile’s website`}
              className={selected === i ? "selected" : ""}
              eager={i === 1}
            />
          ))}
        </div>
        <div className="hero-image-caption">
          <span>MATERIALS IN THE MAKING</span>
          <span>ZW / 1957</span>
        </div>
        <div className="heritage-badge">
          <span>TRUSTED SINCE</span>
          <strong>1957</strong>
          <span>BUILT TO LAST</span>
        </div>
        <div className="hero-selector">
          <div>
            <span>EXPLORE THE MATERIALS</span>
            <span>0{selected + 1} / 03</span>
          </div>
          {groups.map((x, i) => (
            <button
              key={x.name}
              className={selected === i ? "active" : ""}
              onMouseEnter={() => setSelected(i)}
              onFocus={() => setSelected(i)}
              onClick={() => setSelected(i)}
              aria-pressed={selected === i}
            >
              <span>0{i + 1}</span>
              <strong>{x.name}</strong>
              <ArrowUpRight size={20} />
            </button>
          ))}
          <Link to={g.path} className="selector-link">
            {g.label} Discover {g.name.toLowerCase()} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
function Proof() {
  return (
    <div className="proof">
      <div>
        <strong>
          1957<span>—</span>
        </strong>
        <span>A legacy in concrete</span>
      </div>
      <div>
        <strong>
          65+ <small>years</small>
        </strong>
        <span>Of building trust</span>
      </div>
      <div>
        <strong>
          ISO <small>9001:2015</small>
        </strong>
        <span>Quality commitment</span>
      </div>
      <div>
        <strong>Nationwide</strong>
        <span>Local expertise. Regional reach.</span>
      </div>
    </div>
  );
}
function Discovery() {
  const [active, setActive] = useState(0);
  const list = [
    { title: "Concrete roof tiles", id: 44 },
    { title: "Concrete ridges", id: 45 },
    { title: "Domestic pavers & precast", id: 51 },
    { title: "Industrial pavers & precast", id: 46 },
    { title: "Bricks & blocks", id: 47 },
    { title: "Dry mix", id: 50 },
  ];
  let p = products.find(
    (x) => has(x, list[active].id) && !x.images[0]?.includes("coming-soon"),
  );
  return (
    <section className="section discovery">
      <SectionHead
        n="01"
        label="Materials"
        title={
          <>
            Every surface.
            <br /> Every structure.
          </>
        }
        copy="One place to start. A world of possibilities to build. Explore the materials behind your next project."
        to="/products"
      />
      <div className="discovery-body">
        <div className="material-list">
          {list.map((g, i) => (
            <button
              className={i === active ? "active" : ""}
              key={g.id}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
            >
              <span>0{i + 1}</span>
              <strong>{g.title}</strong>
              <ArrowUpRight size={24} />
            </button>
          ))}
          <Link className="text-link" to="/products">
            All materials & accessories <ArrowRight size={18} />
          </Link>
        </div>
        <Link
          className="material-preview reveal"
          to={
            "/products/category/" +
            categories.find((c) => c.id === list[active].id).slug
          }
        >
          <div className="material-preview-label">
            ZIMTILE / MATERIAL STUDY <span>0{active + 1}</span>
          </div>
          <ProductImage key={p.id} p={p} />
          <div>
            <span>{pretty(p.name)}</span>
            <span className="round-arrow">
              <ArrowUpRight />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
const applications = [
  {
    name: "Home",
    ids: [44, 45, 47, 51],
    copy: "Roofing, building and outdoor surfaces for your home.",
  },
  {
    name: "Commercial development",
    ids: [44, 47, 46],
    copy: "Materials for buildings, access routes and commercial spaces.",
  },
  {
    name: "Driveway",
    ids: [51, 121, 120],
    copy: "Explore domestic paving profiles and colours.",
  },
  {
    name: "Industrial yard",
    ids: [46],
    copy: "Discover the industrial paver range.",
  },
  {
    name: "Roof",
    ids: [44, 45, 52],
    copy: "Choose concrete roof profiles, ridges and accessories.",
  },
  {
    name: "Landscape",
    ids: [51, 123, 124],
    copy: "Paving, slabs and precast details for outdoor spaces.",
  },
  {
    name: "Public infrastructure",
    ids: [46, 47, 124],
    copy: "Start a conversation about materials for public works.",
  },
];
function Finder({ standalone = false }) {
  const [sel, setSel] = useState(0);
  let a = applications[sel];
  return (
    <section className={`finder ${standalone ? "standalone" : ""}`}>
      <div className="finder-intro">
        <Eyebrow>02 / Start with your project</Eyebrow>
        <h2>
          What are
          <br /> you building?
        </h2>
        <p>A better project starts with the right materials.</p>
      </div>
      <div className="finder-main">
        <div className="finder-options">
          {applications.map((x, i) => (
            <button
              key={x.name}
              aria-pressed={i === sel}
              className={i === sel ? "active" : ""}
              onClick={() => setSel(i)}
            >
              {x.name}
              <ArrowUpRight size={17} />
            </button>
          ))}
        </div>
        <div className="finder-result" key={sel}>
          <div>
            <span className="label">YOUR STARTING POINT</span>
            <h3>{a.name}</h3>
            <p>{a.copy}</p>
          </div>
          <div className="recommendations">
            {a.ids.map((id) => {
              let c = categories.find((c) => c.id === id);
              return (
                <Link key={id} to={"/products/category/" + c.slug}>
                  {c.name}
                  <ArrowUpRight size={17} />
                </Link>
              );
            })}
            <small>Confirm suitability and quantities with your branch.</small>
          </div>
        </div>
      </div>
    </section>
  );
}
function RoofStudio() {
  const [profile, setProfile] = useState("Bold Double Roman"),
    [pick, setPick] = useState(
      roof.find((p) => p.slug === "bold-double-roman-amber") || roof[0],
    );
  let variants = roof.filter((p) =>
    p.name.toLowerCase().startsWith(profile.toLowerCase()),
  );
  function changeProfile(v) {
    setProfile(v);
    setPick(roof.find((p) => p.name.toLowerCase().startsWith(v.toLowerCase())));
  }
  const colour = (p) => p.name.replace(new RegExp(profile, "i"), "").trim();
  return (
    <section className="section roof-studio">
      <SectionHead
        n="03"
        label="Roof studio"
        title={
          <>
            A roofline.
            <br /> Your signature.
          </>
        }
        copy="Two distinctive profiles. Real colours. Explore the concrete roof tile that feels right for your build."
      />
      <div className="roof-stage">
        <div className="roof-display">
          <span className="label">PROFILE / COLOUR STUDY</span>
          <ProductImage key={pick.id} p={pick} />
          <div className="roof-axis">
            ↔ <span>CONCRETE ROOF TILE</span> ↔
          </div>
        </div>
        <div className="roof-controls">
          <Eyebrow>Choose your roof</Eyebrow>
          <h3>{pretty(pick.name)}</h3>
          <label>01 / Profile</label>
          <div className="profile-buttons">
            {["Bold Double Roman", "Tuscan"].map((n) => (
              <button
                key={n}
                className={n === profile ? "active" : ""}
                onClick={() => changeProfile(n)}
                aria-pressed={n === profile}
              >
                {n}
              </button>
            ))}
          </div>
          <label>02 / Colour & variant</label>
          <div className="swatches">
            {variants.map((p) => (
              <button
                key={p.id}
                onClick={() => setPick(p)}
                className={p.id === pick.id ? "active" : ""}
                title={colour(p)}
                aria-label={colour(p)}
                aria-pressed={p.id === pick.id}
              >
                <span
                  style={{
                    background: /amber/i.test(p.name)
                      ? "#c58149"
                      : /brown/i.test(p.name)
                        ? "#765344"
                        : /red/i.test(p.name)
                          ? "#a94731"
                          : /plain/i.test(p.name)
                            ? "#a4a4a0"
                            : /630/.test(p.name)
                              ? "#383b3a"
                              : "#222625",
                  }}
                />
                {pretty(colour(p))}
              </button>
            ))}
          </div>
          <p className="note">
            Product photography shows the source variant. Confirm colour and
            availability with Zimtile before ordering.
          </p>
          <Button to={"/products/" + pick.slug}>View this tile</Button>
        </div>
      </div>
    </section>
  );
}
function ProjectMoment() {
  let p = projects[0];
  const ref = useRef();
  useEffect(() => {
    let el = ref.current;
    let fn = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      let r = el.getBoundingClientRect(),
        v = Math.max(
          0,
          Math.min(1, (window.innerHeight - r.top) / window.innerHeight),
        );
      el.style.setProperty("--expand", v);
    };
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <section ref={ref} className="project-moment">
      <Image src={p.image} alt={p.title} />
      <div className="project-moment-text">
        <Eyebrow>04 / Built with Zimtile</Eyebrow>
        <h2>
          Materials become
          <br /> places that matter.
        </h2>
        <Button to={"/projects/" + p.slug} secondary>
          Explore {p.title}
        </Button>
      </div>
      <div className="project-moment-caption">
        <span>SHOPPING MALL</span>
        <span>PAVERS SUPPLIED BY ZIMTILE</span>
        <ArrowUpRight />
      </div>
    </section>
  );
}
function Heritage() {
  return (
    <section className="heritage section">
      <div className="heritage-title reveal">
        <Eyebrow>05 / Our story</Eyebrow>
        <h2>
          More than
          <br /> six decades.
          <br /> <span>Still building.</span>
        </h2>
        <Link className="text-link" to="/about">
          Discover our story <ArrowUpRight size={19} />
        </Link>
      </div>
      <div className="heritage-content">
        <p className="lead">
          From roofline to groundwork, Zimtile materials have shaped Zimbabwe
          for generations.
        </p>
        <p>
          Founded in 1957, Zimtile manufactures and distributes concrete roof
          tiles, pavers, bricks, blocks and related building materials. A legacy
          built on quality, reliability and innovation.
        </p>
        <div className="heritage-timeline">
          <div>
            <span>1957</span>
            <strong>Our foundation</strong>
            <p>Established in Zimbabwe.</p>
          </div>
          <div>
            <span>Today</span>
            <strong>Beyond borders</strong>
            <p>
              Serving Zimbabwe and regional markets including Zambia, Mozambique
              and Botswana.
            </p>
          </div>
        </div>
        <div className="iso">
          <strong>
            ISO
            <br /> <span>9001:2015</span>
          </strong>
          <div>
            <span className="label">QUALITY, BY DESIGN</span>
            <p>
              Zimtile’s ISO 9001:2015 certification reflects Zimtile’s
              commitment to quality and customer requirements.
            </p>
            <Link to="/values" className="text-link">
              The values behind our work <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
function BranchMap({ selected = 0, onSelect }) {
  return (
    <div className="branch-map">
      <svg viewBox="0 0 440 420" aria-hidden="true">
        <defs>
          <pattern
            id="grid"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="#c8c8bf"
              strokeWidth=".5"
            />
          </pattern>
        </defs>
        <rect width="440" height="420" fill="url(#grid)" />
        <path
          d="M70 110 128 75 177 92 226 58 308 81 372 113 366 167 398 228 358 303 287 346 258 382 160 357 125 300 58 234 38 167Z"
          fill="#d8d8cf"
          stroke="#aaa99f"
        />
        <path
          d="M100 190 280 152 318 240 217 305 127 270Z"
          fill="none"
          stroke="#c1c0b7"
          strokeDasharray="4 5"
        />
      </svg>
      {branches.map((b, i) => (
        <button
          style={{ left: b.x + "%", top: b.y + "%" }}
          className={selected === i ? "selected" : ""}
          aria-label={"Select " + b.name}
          onClick={() => onSelect(i)}
          key={b.name}
        >
          <i />
          {selected === i && <span>{b.name}</span>}
        </button>
      ))}
      <span className="map-note">
        ZIMBABWE / BRANCH NETWORK
        <br /> Schematic locations · not to scale
      </span>
    </div>
  );
}
function BranchDetails({ b }) {
  return (
    <div className="branch-details">
      <div className="branch-address">
        <MapPin size={19} />
        <p>{b.address}</p>
      </div>
      <div>
        {b.phones.map((n) => (
          <a key={n} className="phone" href={"tel:" + tel(n)}>
            <Phone size={15} />
            {n}
          </a>
        ))}
      </div>
      <p className="note">{hours}</p>
      <div className="branch-ctas">
        <a
          className="button secondary"
          href={
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(
              "Zimtile " + b.address + " " + b.name + " Zimbabwe",
            )
          }
          target="_blank"
          rel="noreferrer"
        >
          Get directions <ArrowUpRight size={17} />
        </a>
        <Button to="/quote">Request a quote</Button>
      </div>
    </div>
  );
}
function BranchSection() {
  const [sel, setSel] = useState(0);
  return (
    <section className="section branch-section">
      <SectionHead
        n="06"
        label="Close to your project"
        title={
          <>
            Built nationwide.
            <br /> Here for you.
          </>
        }
        copy="Find a Zimtile branch, speak to a local team and plan your next step."
        to="/branches"
      />
      <div className="branch-split">
        <BranchMap selected={sel} onSelect={setSel} />
        <div className="branch-panel">
          <label htmlFor="home-branch" className="label">
            CHOOSE YOUR BRANCH
          </label>
          <select
            id="home-branch"
            value={sel}
            onChange={(e) => setSel(+e.target.value)}
          >
            {branches.map((b, i) => (
              <option key={b.name} value={i}>
                {b.name}
              </option>
            ))}
          </select>
          <h3>{branches[sel].name}</h3>
          <BranchDetails b={branches[sel]} />
        </div>
      </div>
    </section>
  );
}
function StoryCard({ p, i = 0 }) {
  return (
    <Link
      className={"story-card story-" + i + " reveal"}
      to={`/${p.type === "project" ? "projects" : "news"}/${p.slug}`}
    >
      <div className="story-image">
        <Image src={p.image || groups[0].image} alt={p.title} />
        <span className="round-arrow">
          <ArrowUpRight />
        </span>
      </div>
      <div className="story-meta">
        <span>
          {p.type === "project" ? "BUILT WITH ZIMTILE" : "BUILDING KNOWLEDGE"}
        </span>
        <time dateTime={p.date}>
          {new Date(p.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
      </div>
      <h3>{p.title}</h3>
    </Link>
  );
}
function CTA() {
  return (
    <section className="cta">
      <div>
        <Eyebrow>Your next project starts here</Eyebrow>
        <h2>
          Let’s build
          <br /> something solid.
        </h2>
        <p>
          Find your materials. Make your shortlist.
          <br /> Talk to the people who know concrete.
        </p>
      </div>
      <div>
        <Button to="/quote">Request a quote</Button>
        <Link to="/branches" className="text-link">
          Find your nearest Zimtile <ArrowUpRight size={19} />
        </Link>
      </div>
      <span className="cta-lines" aria-hidden="true" />
    </section>
  );
}
function Home() {
  return (
    <>
      <Hero />
      <Proof />
      <Discovery />
      <Finder />
      <RoofStudio />
      <ProjectMoment />
      <section className="paving-section section">
        <div className="paving-photo reveal">
          <Image
            src={projects.at(-1).image}
            alt="Service Station Pavement Upgrade"
          />
          <span>FROM THE GROUND UP / ZIMTILE PAVERS</span>
        </div>
        <div>
          <Eyebrow>Spaces that connect us</Eyebrow>
          <h2>
            Paving that
            <br /> shapes the space.
          </h2>
          <p>
            From the first step home to the demands of a working yard. Discover
            domestic and industrial paving, in profiles and finishes drawn from
            the Zimtile catalogue.
          </p>
          <Button to="/pavers">Explore paving</Button>
        </div>
      </section>
      <Heritage />
      <BranchSection />
      <section className="section">
        <SectionHead
          n="07"
          label="Projects"
          title={<>Built with Zimtile.</>}
          copy="Real materials. Real places. Explore Zimtile’s project stories."
          to="/projects"
        />
        <div className="home-projects">
          {projects.slice(1, 4).map((p, i) => (
            <StoryCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </section>
      <section className="news-teaser section">
        <div>
          <Eyebrow>08 / Building knowledge</Eyebrow>
          <h2>
            Know your
            <br /> materials.
          </h2>
          <p>Advice and updates from Zimtile.</p>
          <Link to="/news" className="text-link">
            Read the latest <ArrowUpRight size={19} />
          </Link>
        </div>
        {news.map((p) => (
          <Link className="news-feature" key={p.id} to={"/news/" + p.slug}>
            <span className="label">INSIGHTS / {p.date}</span>
            <h3>{p.title}</h3>
            <p>{p.text.slice(0, 190)}…</p>
            <span className="round-arrow">
              <ArrowUpRight />
            </span>
          </Link>
        ))}
      </section>
      <CTA />
    </>
  );
}
function PageIntro({ label, title, copy, children, level = "h1" }) {
  const Heading = level;
  return (
    <section className="page-intro">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>{label}</span>
      </div>
      <Eyebrow>{label}</Eyebrow>
      <Heading>{title}</Heading>
      {copy && <p>{copy}</p>}
      {children}
    </section>
  );
}
function ProductCard({ p }) {
  const c = useContext(Ctx);
  return (
    <article className="product-card">
      <Link className="product-image" to={"/products/" + p.slug}>
        <ProductImage p={p} />
      </Link>
      <button
        className="quick-view"
        onClick={() => c.setQuick(p)}
        aria-label={"Quick view " + pretty(p.name)}
      >
        Quick view <Plus size={14} />
      </button>
      <div className="product-card-body">
        <span className="label">
          {p.categories.find((x) => x.id !== 51)?.name ||
            p.categories[0]?.name ||
            "Concrete materials"}
        </span>
        <Link to={"/products/" + p.slug}>
          <h3>{pretty(p.name)}</h3>
        </Link>
        <div className="product-bottom">
          <Link to={"/products/" + p.slug}>
            Request price <ArrowUpRight size={15} />
          </Link>
          <button
            className="add-button"
            aria-label={"Add " + pretty(p.name) + " to quote"}
            onClick={() => c.add(p.id)}
          >
            {c.quote.some((x) => x.id === p.id) ? (
              <Check size={18} />
            ) : (
              <Plus size={18} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
function Catalogue({
  fixedIds = [],
  label = "Products",
  description,
  embedded = false,
}) {
  const key = useContext(Ctx).path,
    [search, setSearch] = useState(""),
    [cat, setCat] = useState("all"),
    [colour, setColour] = useState("all"),
    [sort, setSort] = useState("featured"),
    [limit, setLimit] = useState(16),
    [filters, setFilters] = useState(false);
  useEffect(() => {
    setCat("all");
    setSearch("");
    setColour("all");
    setLimit(16);
  }, [key]);
  let base = products.filter(
      (p) => !fixedIds.length || fixedIds.some((id) => has(p, id)),
    ),
    availableCats = categories.filter((c) => base.some((p) => has(p, c.id)));
  let filtered = base.filter(
    (p) =>
      (cat === "all" || has(p, +cat)) &&
      (colour === "all" || p.name.toLowerCase().includes(colour)) &&
      search
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .every((token) =>
          `${p.name} ${p.sku} ${p.categories.map((c) => c.name).join(" ")}`
            .toLowerCase()
            .includes(token),
        ),
  );
  if (sort !== "featured")
    filtered = [...filtered].sort((a, b) =>
      sort === "az"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    );
  return (
    <>
      <PageIntro
        label={label}
        level={embedded ? "h2" : "h1"}
        title={
          fixedIds.length ? (
            label
          ) : (
            <>
              Made to build.
              <br /> Find your material.
            </>
          )
        }
        copy={
          description ||
          "Browse the complete Zimtile catalogue. Explore profiles, colours and recorded specifications, then add your materials to a quote."
        }
      />
      <section className="catalogue section">
        <div className="catalogue-toolbar">
          <div className="search-input">
            <Search size={19} />
            <input
              aria-label="Search products"
              placeholder="Search products, profiles or codes"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setLimit(16);
              }}
            />
            {search && (
              <button
                className="icon-button"
                aria-label="Clear product search"
                onClick={() => setSearch("")}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            className="filter-toggle"
            onClick={() => setFilters(!filters)}
            aria-expanded={filters}
          >
            <SlidersHorizontal size={17} /> Filters
          </button>
          <label className="sort">
            Sort by{" "}
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Source order</option>
              <option value="az">Name A–Z</option>
              <option value="za">Name Z–A</option>
            </select>
          </label>
        </div>
        <div className="catalogue-body">
          <aside className={filters ? "filters open" : "filters"}>
            <h3>Material categories</h3>
            <button
              className={cat === "all" ? "active" : ""}
              onClick={() => {
                setCat("all");
                setLimit(16);
              }}
            >
              All materials <span>{base.length}</span>
            </button>
            {availableCats.map((c) => (
              <button
                key={c.id}
                className={+cat === c.id ? "active" : ""}
                onClick={() => {
                  setCat(c.id);
                  setLimit(16);
                }}
              >
                {c.name}
                <span>{base.filter((p) => has(p, c.id)).length}</span>
              </button>
            ))}
            <label htmlFor="colour-filter">Colour / finish</label>
            <select
              id="colour-filter"
              value={colour}
              onChange={(e) => {
                setColour(e.target.value);
                setLimit(16);
              }}
            >
              <option value="all">All colours & finishes</option>
              {["red", "black", "charcoal", "brown", "amber", "plain"]
                .filter((s) =>
                  base.some((p) => p.name.toLowerCase().includes(s)),
                )
                .map((s) => (
                  <option key={s} value={s}>
                    {pretty(s[0].toUpperCase() + s.slice(1))}
                  </option>
                ))}
            </select>
            <button
              className="reset"
              onClick={() => {
                setSearch("");
                setCat("all");
                setColour("all");
                setLimit(16);
              }}
            >
              Reset filters
            </button>
            <div className="filter-help">
              <Eyebrow>Need a hand?</Eyebrow>
              <p>Your local team can help with quantities and availability.</p>
              <Link to="/branches" className="text-link">
                Find a branch <ArrowUpRight size={17} />
              </Link>
            </div>
          </aside>
          <div className="catalogue-results">
            <div className="results-caption">
              <span>
                {filtered.length}{" "}
                {filtered.length === 1 ? "material" : "materials"} found
              </span>
              <span>PRICING ON ENQUIRY</span>
            </div>
            <div className="product-grid">
              {filtered.slice(0, limit).map((p) => (
                <ProductCard p={p} key={p.id} />
              ))}
            </div>
            {!filtered.length && (
              <div className="empty-state">
                <Search />
                <h3>No matching materials</h3>
                <p>Try another product name or reset your filters.</p>
                <button
                  className="button"
                  onClick={() => {
                    setSearch("");
                    setCat("all");
                    setColour("all");
                  }}
                >
                  Show all materials
                </button>
              </div>
            )}
            {filtered.length > limit && (
              <button
                className="button load-more secondary"
                onClick={() => setLimit(limit + 16)}
              >
                Load more materials <Plus size={18} />
              </button>
            )}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
function ProductDetail({ p, quick = false }) {
  const c = useContext(Ctx),
    [image, setImage] = useState(0);
  useEffect(() => setImage(0), [p.id]);
  let imgs = p.images.filter((x) => !x.includes("coming-soon"));
  return (
    <>
      {!quick && (
        <div className="breadcrumbs detail-crumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span>{pretty(p.name)}</span>
        </div>
      )}
      <section className={`product-detail ${quick ? "quick" : ""}`}>
        <div className="product-gallery">
          <div className="gallery-main">
            {imgs.length ? (
              <Image src={imgs[image]} alt={pretty(p.name)} eager />
            ) : (
              <ProductImage p={p} />
            )}
          </div>
          {imgs.length > 1 && (
            <div className="thumbnails">
              {imgs.map((src, i) => (
                <button
                  className={image === i ? "active" : ""}
                  onClick={() => setImage(i)}
                  aria-label={"View product image " + (i + 1)}
                  key={src}
                >
                  <Image src={src} alt={pretty(p.name) + " view " + (i + 1)} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="product-information">
          <Eyebrow>
            {p.categories.find((x) => x.id !== 51)?.name ||
              p.categories[0]?.name}
          </Eyebrow>
          <h1>{pretty(p.name)}</h1>
          {p.sku && <span className="label">PRODUCT CODE / {p.sku}</span>}
          <p className="price-enquiry">Request price</p>
          <p>
            Enquire with Zimtile for current pricing, colour confirmation and
            availability at your preferred branch.
          </p>
          {!!p.attributes.length && (
            <dl>
              {p.attributes.map((a) => (
                <div key={a.name}>
                  <dt>{a.name}</dt>
                  <dd>{a.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <Button
            onClick={() => {
              c.add(p.id);
              if (!quick) c.go("/quote");
              else c.setQuick(null);
            }}
          >
            {c.quote.some((x) => x.id === p.id)
              ? "Add another to quote"
              : "Add to quote list"}
          </Button>
          <Button secondary to="/branches" onClick={() => c.setQuick(null)}>
            Find your nearest branch
          </Button>
          {quick && (
            <Link
              className="text-link"
              to={"/products/" + p.slug}
              onClick={() => c.setQuick(null)}
            >
              Full product details <ArrowUpRight size={16} />
            </Link>
          )}
        </div>
      </section>
      {!quick && (
        <>
          <section className="section product-notes">
            <div>
              <Eyebrow>Material information</Eyebrow>
              <h2>Details that matter.</h2>
            </div>
            <div>
              {p.details && <p>{p.details}</p>}
              <p>
                Product specifications above are recorded in Zimtile’s original
                catalogue. Speak to a branch to confirm suitability, quantities,
                colour and lead times for your application.
              </p>
              {p.categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={"/products/category/" + cat.slug}
                  className="category-tag"
                >
                  {cat.name} <ArrowUpRight size={14} />
                </Link>
              ))}
            </div>
          </section>
          <section className="section related">
            <SectionHead
              label="Related materials"
              title="Build the complete picture."
            />
            <div className="product-grid">
              {products
                .filter(
                  (x) =>
                    x.id !== p.id &&
                    x.categories.some((k) =>
                      p.categories.some((j) => j.id === k.id),
                    ),
                )
                .slice(0, 4)
                .map((x) => (
                  <ProductCard key={x.id} p={x} />
                ))}
            </div>
          </section>
          <CTA />
        </>
      )}
    </>
  );
}
function Branches() {
  const [query, setQuery] = useState(""),
    [sel, setSel] = useState(0);
  let visible = branches
    .map((b, i) => ({ ...b, i }))
    .filter((b) =>
      (b.name + " " + b.address).toLowerCase().includes(query.toLowerCase()),
    );
  return (
    <>
      <PageIntro
        label="Branches"
        title={
          <>
            Find your
            <br /> nearest Zimtile.
          </>
        }
        copy="Local teams. Nationwide reach. Search your city or select a branch to plan your visit."
      />
      <section className="section branches-page">
        <div className="branches-list">
          <div className="search-input">
            <Search size={18} />
            <input
              placeholder="Enter city or location"
              aria-label="Search branches"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {visible.map((b) => (
            <article
              className={"branch-row " + (sel === b.i ? "active" : "")}
              key={b.name}
            >
              <button onClick={() => setSel(b.i)} aria-expanded={sel === b.i}>
                <span>0{b.i + 1}</span>
                <h3>{b.name}</h3>
                {sel === b.i ? <Minus size={20} /> : <Plus size={20} />}
              </button>
              {sel === b.i && <BranchDetails b={b} />}
            </article>
          ))}
          {!visible.length && (
            <p>No branch matches that location. Try a city name.</p>
          )}
        </div>
        <div className="branches-map-panel">
          <BranchMap
            selected={sel}
            onSelect={(i) => {
              setQuery("");
              setSel(i);
            }}
          />
          <p className="note">
            Choose a branch for its recorded address, contact numbers and
            opening hours. “Get directions” opens Google Maps.
          </p>
        </div>
      </section>
      <CTA />
    </>
  );
}
function About() {
  return (
    <>
      <PageIntro
        label="Our story"
        title={
          <>
            Zimbabwe built in.
            <br /> Since 1957.
          </>
        }
        copy="A legacy of concrete. A commitment to what comes next."
      />
      <div className="about-photo">
        <Image
          src="/assets/about-zimtile.webp"
          alt="Zimtile company imagery"
          eager
        />
        <span>ROOFING · PAVING · BUILDING</span>
      </div>
      <section className="section about-story">
        <div>
          <Eyebrow>Our foundation</Eyebrow>
          <h2>
            Materials for
            <br /> generations.
          </h2>
          <span className="large-year">1957</span>
        </div>
        <div>
          <p className="lead">
            Founded in 1957, Zimtile manufactures and distributes concrete roof
            tiles, pavers, bricks, blocks and related building materials.
          </p>
          <p>
            For over six decades, Zimtile has been part of Zimbabwe’s
            construction industry — contributing to homes, schools, businesses
            and infrastructure. Its legacy is built on quality, reliability and
            innovation.
          </p>
          <p>
            With strategically located manufacturing plants and distribution
            branches, the company serves individuals, property developers,
            construction companies and government institutions across Zimbabwe
            and the broader region.
          </p>
          <p>
            The company website records four factories: Southerton (Head
            Office), Adelaide Park Harare, Bulawayo and Masvingo. Regional
            markets include Zambia, Mozambique and Botswana.
          </p>
          <Button to="/branches">Explore our network</Button>
        </div>
      </section>
      <section className="mission section">
        <div>
          <Eyebrow>Our mission</Eyebrow>
          <h2>
            Build better.
            <br /> Together.
          </h2>
          <p>
            To lead the construction industry by manufacturing and distributing
            superior quality concrete roof tiles, bricks, pavers and other
            complementary products that meet the evolving needs of customers,
            serving private and public sector clients across Zimbabwe and the
            broader region.
          </p>
        </div>
        <div>
          <Eyebrow>Our vision</Eyebrow>
          <h2>
            Trust, built
            <br /> into every material.
          </h2>
          <p>
            To be the most trusted experts in the production and distribution of
            premium-quality, cost-effective concrete roof tiles and related
            building solutions.
          </p>
          <Link to="/values" className="text-link">
            Our values & culture <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>
      <Heritage />
      <CTA />
    </>
  );
}
const values = [
  [
    "People make a difference",
    "Our team is our strength. Motivation, professionalism and passion inform how we work, every day.",
  ],
  [
    "Help customers succeed",
    "Quality products and value-added services help customers build better and get more from their projects.",
  ],
  [
    "We are a trusted partner",
    "Trust, integrity and mutual respect are the foundations of lasting customer relationships.",
  ],
  [
    "We deliver on our commitments",
    "Meeting deadlines, honouring quality and keeping promises guide our work.",
  ],
];
function Values() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <PageIntro
        label="Values & culture"
        title={
          <>
            Strong materials.
            <br /> Stronger principles.
          </>
        }
        copy="Zimtile’s guiding principles shape our decisions, behaviours and ways of working."
      />
      <section className="section values-list">
        {values.map(([t, b], i) => (
          <article key={t}>
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
            >
              <span>0{i + 1}</span>
              <h2>{t}</h2>
              {open === i ? <Minus /> : <Plus />}
            </button>
            {open === i && <p>{b}</p>}
          </article>
        ))}
      </section>
      <section className="section culture">
        <Eyebrow>How we work</Eyebrow>
        <h2>
          Ownership. Discipline.
          <br /> Respect.
        </h2>
        <p>
          Ownership and pride in one’s work. High standards of discipline.
          Accurate reporting and respect for deadlines. Adherence to systems,
          controls, performance targets and working hours. High standards of
          housekeeping in factories, yards and offices. Teamwork and respect for
          each other.
        </p>
      </section>
      <CTA />
    </>
  );
}
function Stories({ type }) {
  let a = type === "project" ? projects : news;
  return (
    <>
      <PageIntro
        label={type === "project" ? "Projects" : "News & insights"}
        title={
          type === "project" ? (
            <>
              Built with
              <br /> Zimtile.
            </>
          ) : (
            <>
              Building
              <br /> knowledge.
            </>
          )
        }
        copy={
          type === "project"
            ? "A closer look at the places built with Zimtile materials. Original project photography and recorded details."
            : "Roofing advice, product knowledge and updates from Zimtile."
        }
      />
      <section
        className={
          "section stories-grid " + (type === "news" ? "news-grid" : "")
        }
      >
        {a.map((p, i) => (
          <StoryCard key={p.id} p={p} i={i} />
        ))}
      </section>
      <CTA />
    </>
  );
}
function StoryDetail({ p }) {
  return (
    <>
      <PageIntro
        label={p.type === "project" ? "Projects" : "News & insights"}
        title={p.title}
        copy={new Date(p.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      />
      {p.image && (
        <div className="story-hero">
          <Image src={p.image} alt={p.title} eager />
        </div>
      )}
      <section className="section article-layout">
        <aside>
          <Eyebrow>
            {p.type === "project" ? "Project overview" : "Building knowledge"}
          </Eyebrow>
          <Link
            className="text-link"
            to={p.type === "project" ? "/projects" : "/news"}
          >
            All {p.type === "project" ? "projects" : "articles"}{" "}
            <ArrowUpRight size={18} />
          </Link>
        </aside>
        <article className="article-copy">
          {p.type === "project" ? (
            <>
              <h2>Project overview</h2>
              <p className="lead">
                {p.text.replace(/^Project Overview\s*/, "")}
              </p>
              {p.slug === "supermarket-project-harare" && (
                <p className="note">
                  The original project title refers to Harare; its description
                  refers to Gweru. Confirm the location with Zimtile.
                </p>
              )}
            </>
          ) : (
            <>
              <p className="lead">{p.text.split("Why It’s Better")[0]}</p>
              <h2>Why choose concrete roof tiles?</h2>
              {p.text
                .split(/✔|Why It’s Better Than Other Common Roofs/)
                .slice(1)
                .filter(Boolean)
                .map((s, i) => (
                  <p key={i}>{s}</p>
                ))}
            </>
          )}
          {p.gallery.map((src, i) => (
            <Image key={src} src={src} alt={p.title + " gallery " + (i + 1)} />
          ))}
          <Button to="/quote">Discuss your project</Button>
        </article>
      </section>
      <section className="section">
        <SectionHead
          label={p.type === "project" ? "More projects" : "More to explore"}
          title="Keep exploring."
        />
        <div className="home-projects">
          {(p.type === "project"
            ? projects.filter((x) => x.id !== p.id).slice(0, 3)
            : projects.slice(0, 3)
          ).map((x, i) => (
            <StoryCard key={x.id} p={x} i={i} />
          ))}
        </div>
      </section>
    </>
  );
}
function Quote() {
  const c = useContext(Ctx);
  return (
    <>
      <PageIntro
        label="Your quote"
        title={
          <>
            A solid start
            <br /> to your next build.
          </>
        }
        copy="Collect your materials, tell us about your project and send your enquiry to Zimtile."
      />
      <section className="section quote-layout">
        <div className="quote-list">
          <div className="quote-heading">
            <h2>
              Your materials <span>{c.quote.length}</span>
            </h2>
            <Link className="text-link" to="/products">
              Add materials <Plus size={17} />
            </Link>
          </div>
          {!c.quote.length ? (
            <div className="empty-quote">
              <p>Your quote list is ready for a project.</p>
              <p>
                Add materials from the catalogue, or send a general project
                enquiry using the form.
              </p>
              <Button to="/products">Explore materials</Button>
            </div>
          ) : (
            c.quote.map((item) => {
              let p = products.find((x) => x.id === item.id);
              return (
                p && (
                  <article key={item.id} className="quote-item">
                    <Link to={"/products/" + p.slug}>
                      <ProductImage p={p} />
                    </Link>
                    <div>
                      <span className="label">
                        {p.sku || "ZIMTILE MATERIAL"}
                      </span>
                      <Link to={"/products/" + p.slug}>
                        <h3>{pretty(p.name)}</h3>
                      </Link>
                      <label htmlFor={"qty-" + item.id}>Quantity / units</label>
                      <div className="quantity">
                        <button
                          aria-label={"Decrease " + p.name + " quantity"}
                          onClick={() => c.qty(p.id, item.qty - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          id={"qty-" + item.id}
                          type="number"
                          min="1"
                          max="999999"
                          value={item.qty}
                          onChange={(e) => c.qty(p.id, +e.target.value)}
                        />
                        <button
                          aria-label={"Increase " + p.name + " quantity"}
                          onClick={() => c.qty(p.id, item.qty + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      className="icon-button"
                      aria-label={"Remove " + p.name}
                      onClick={() => c.remove(p.id)}
                    >
                      <X size={18} />
                    </button>
                  </article>
                )
              );
            })
          )}
          <p className="note">
            Prices, stock and delivery are confirmed by Zimtile. Your list is
            saved on this device. Quantities are for enquiry; confirm the
            required units with your branch.
          </p>
        </div>
        <EnquiryForm quoteMode />
      </section>
    </>
  );
}
function EnquiryForm({ quoteMode = false }) {
  const c = useContext(Ctx),
    [channel, setChannel] = useState("whatsapp"),
    [prepared, setPrepared] = useState(null);
  const form = useRef();
  useEffect(() => setPrepared(null), [c.quote]);
  function submit(e) {
    e.preventDefault();
    let vals = Object.fromEntries(new FormData(form.current));
    let items = quoteMode
      ? c.quote
          .map((x) => {
            let p = products.find((p) => p.id === x.id);
            return `${p.name} (${p.sku || p.slug}) — quantity: ${x.qty}`;
          })
          .join("\n")
      : "";
    let message = `${quoteMode ? "Quotation request" : "Website enquiry"}\n\n${Object.entries(
      vals,
    )
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n")}\n\n${items ? `Materials:\n${items}` : ""}`;
    setPrepared({
      message,
      url:
        channel === "whatsapp"
          ? `https://wa.me/263785744281?text=${encodeURIComponent(message)}`
          : `mailto:enquiries@zimtile.co.zw?subject=${encodeURIComponent(quoteMode ? "Zimtile quotation request" : "Zimtile website enquiry")}&body=${encodeURIComponent(message)}`,
    });
  }
  function download() {
    let blob = new Blob(
        [
          JSON.stringify(
            {
              createdAt: new Date().toISOString(),
              products: c.quote.map((x) => ({
                ...x,
                name: products.find((p) => p.id === x.id)?.name,
              })),
              message: prepared.message,
            },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
      url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "zimtile-enquiry.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="enquiry-form">
      <Eyebrow>{quoteMode ? "Your project details" : "Get in touch"}</Eyebrow>
      <h2>{quoteMode ? "Make it happen." : "Let’s talk materials."}</h2>
      <form ref={form} onSubmit={submit} onChange={() => setPrepared(null)}>
        <div className="form-grid">
          {[
            ["Name", "text", true],
            ["Phone", "tel", true],
            ["Email", "email", true],
            ["Company", "text", false],
            ["Location", "text", true],
          ].map(([n, t, req]) => (
            <label key={n}>
              {n}
              {req ? " *" : ""}
              <input
                name={n}
                type={t}
                required={req}
                autoComplete={
                  {
                    Name: "name",
                    Phone: "tel",
                    Email: "email",
                    Company: "organization",
                    Location: "address-level2",
                  }[n]
                }
              />
            </label>
          ))}
          <label>
            Preferred branch
            <select name="Preferred branch">
              <option value="Please advise">Please advise</option>
              {branches.map((b) => (
                <option key={b.name}>{b.name}</option>
              ))}
            </select>
          </label>
          <label>
            Project type
            <select name="Project type">
              {[
                "General enquiry",
                "Product availability",
                "Request quote",
                "Commercial project",
                ...applications.map((x) => x.name),
              ].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label>
            Send using
            <select
              aria-label="Enquiry channel"
              value={channel}
              onChange={(e) => {
                setChannel(e.target.value);
                setPrepared(null);
              }}
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </select>
          </label>
        </div>
        <label>
          Message *
          <textarea
            name="Message"
            required
            rows="4"
            placeholder="Tell us about your project, timelines and the materials you need."
          />
        </label>
        <label className="consent">
          <input type="checkbox" required />{" "}
          <span>
            I agree to share these details with Zimtile for this enquiry.{" "}
            <Link to="/privacy-policy">Privacy policy</Link>.
          </span>
        </label>
        <p className="note">
          Prepare your enquiry below, then open{" "}
          {channel === "whatsapp" ? "WhatsApp" : "your email app"} to review and
          send it. No message is sent automatically.
        </p>
        <button className="button" type="submit">
          Prepare {quoteMode ? "quote request" : "enquiry"}{" "}
          <ArrowRight size={18} />
        </button>
      </form>
      {prepared && (
        <div className="enquiry-prepared" role="status">
          <Check size={21} />
          <h3>Your enquiry is ready.</h3>
          <p>
            Review the message in{" "}
            {channel === "whatsapp" ? "WhatsApp" : "your email app"} and press
            send there. Zimtile has not received it yet.
          </p>
          <a
            className="button"
            href={prepared.url}
            target={channel === "whatsapp" ? "_blank" : undefined}
            rel="noreferrer"
          >
            Open {channel === "whatsapp" ? "WhatsApp" : "email"}{" "}
            <ArrowUpRight size={18} />
          </a>
          <button className="text-link" onClick={download}>
            Download enquiry copy <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
function Contact() {
  return (
    <>
      <PageIntro
        label="Contact"
        title={
          <>
            Let’s build
            <br /> something solid.
          </>
        }
        copy="Whether it’s a home, a commercial development or a question about a material, start a conversation with Zimtile."
      />
      <section className="section contact-layout">
        <div>
          <Eyebrow>Speak to Zimtile</Eyebrow>
          <h2>
            Local knowledge.
            <br /> A solid next step.
          </h2>
          <a className="contact-link" href="tel:+263785744281">
            <Phone />
            +263 785 744 281
          </a>
          <a className="contact-link" href="mailto:enquiries@zimtile.co.zw">
            <Mail />
            enquiries@zimtile.co.zw
          </a>
          <p>
            Cnr Glen Eagles / J.Martin Rd,
            <br /> Lochinvar, Harare
          </p>
          <p className="note">{hours}</p>
          <Button to="/branches" secondary>
            Find your branch
          </Button>
          <a
            className="text-link"
            href="https://wa.me/263785744281"
            target="_blank"
            rel="noreferrer"
          >
            Message Zimtile on WhatsApp <ArrowUpRight size={17} />
          </a>
        </div>
        <EnquiryForm />
      </section>
    </>
  );
}
function InformationPage({ slug }) {
  let info = information.find((p) => p.slug === slug);
  let body = info.text;
  if (slug === "social-responsibility")
    body = body.slice(body.indexOf("Community Empowerment"));
  return (
    <>
      <PageIntro
        label="Company"
        title={info.title}
        copy={
          slug === "export-service"
            ? "Concrete solutions, beyond borders."
            : undefined
        }
      />
      <section className="section article-layout">
        <aside>
          <Eyebrow>Zimtile</Eyebrow>
          <Link className="text-link" to="/contact">
            Speak to our team <ArrowUpRight size={17} />
          </Link>
        </aside>
        <article className="article-copy">
          <p>
            {body
              .replaceAll("&quot;", "“")
              .split(/(?<=\.)\s/)
              .reduce((acc, s, i) => acc + (i % 4 === 0 ? "\n\n" : " ") + s, "")
              .split("\n\n")
              .filter(Boolean)
              .map((s, i) => (
                <React.Fragment key={i}>
                  {s}
                  <br /> <br />{" "}
                </React.Fragment>
              ))}
          </p>
          {info.images
            .filter((x) => !x.endsWith(".mp4"))
            .map((src) => (
              <Image key={src} src={src} alt={info.title} />
            ))}
          {slug === "export-service" && (
            <Button to="/contact">Enquire about exports</Button>
          )}
        </article>
      </section>
    </>
  );
}
function SearchOverlay() {
  const c = useContext(Ctx),
    [query, setQuery] = useState("");
  const input = useRef();
  useEffect(() => input.current?.focus(), []);
  let q = query.toLowerCase().trim(),
    tokens = q.split(/\s+/),
    matches = [
      ...products.map((p) => ({
        title: pretty(p.name),
        type: "Material",
        image: p.images[0],
        to: "/products/" + p.slug,
        search: p.name + " " + p.categories.map((x) => x.name).join(" "),
      })),
      ...categories.map((p) => ({
        title: p.name,
        type: "Category",
        to: "/products/category/" + p.slug,
        search: p.name,
      })),
      ...content.map((p) => ({
        title: p.title,
        type: p.type === "project" ? "Project" : "Article",
        image: p.image,
        to: `/${p.type === "project" ? "projects" : "news"}/${p.slug}`,
        search: p.title + " " + p.text,
      })),
    ]
      .filter((p) => tokens.every((t) => p.search.toLowerCase().includes(t)))
      .slice(0, 30);
  return (
    <div className="search-dialog">
      <div className="dialog-heading">
        <Eyebrow>Search Zimtile</Eyebrow>
        <button
          className="icon-button"
          aria-label="Close search"
          onClick={() => c.setSearch(false)}
        >
          <X />
        </button>
      </div>
      <div className="search-input">
        <Search />
        <input
          ref={input}
          aria-label="Search products, projects and news"
          placeholder="Try “red roof tile”"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <span className="label">
        {q ? "SEARCH RESULTS" : "EXPLORE MATERIALS, PROJECTS & KNOWLEDGE"}
      </span>
      <div className="search-results">
        {(q
          ? matches
          : categories.map((p) => ({
              title: p.name,
              type: "Category",
              to: "/products/category/" + p.slug,
            }))
        ).map((p) => (
          <Link key={p.to} to={p.to} onClick={() => c.setSearch(false)}>
            {p.image && <Image src={p.image} alt="" />}
            <div>
              <span className="label">{p.type}</span>
              <h3>{p.title}</h3>
            </div>
            <ArrowUpRight size={20} />
          </Link>
        ))}
        {q && !matches.length && (
          <p>No matches. Try a profile, colour or category.</p>
        )}
      </div>
    </div>
  );
}
function Modal({ children, onClose, label }) {
  const ref = useRef(),
    previous = useRef();
  useEffect(() => {
    previous.current = document.activeElement;
    let overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current.focus();
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        let list = [
          ...ref.current.querySelectorAll(
            'a[href],button,input,select,textarea,[tabindex="0"]',
          ),
        ].filter((x) => !x.disabled);
        if (!list.length) return;
        let first = list[0],
          last = list.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      previous.current?.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}
function Page({ path }) {
  if (path === "/") return <Home />;
  if (path === "/products") return <Catalogue />;
  let p = products.find((p) => path === "/products/" + p.slug);
  if (p) return <ProductDetail p={p} />;
  let cat = categories.find((x) => path === "/products/category/" + x.slug);
  if (cat) return <Catalogue key={path} fixedIds={[cat.id]} label={cat.name} />;
  if (path === "/roof-tiles")
    return (
      <>
        <PageIntro
          label="Roofing"
          title={
            <>
              Choose your roof.
              <br /> Define your home.
            </>
          }
          copy="Explore Zimtile’s concrete roof tile profiles and colour variants."
        />
        <RoofStudio />
        <Catalogue fixedIds={[44, 45, 52]} label="Roofing materials" embedded />
      </>
    );
  if (path === "/pavers")
    return (
      <Catalogue
        fixedIds={[51, 46, 50, 120, 121, 122, 123]}
        label="Paving materials"
        description="Domestic and industrial pavers, wet mix surfaces and dry mix products from the original Zimtile catalogue."
      />
    );
  if (path === "/bricks-blocks")
    return <Catalogue fixedIds={[47]} label="Bricks & blocks" />;
  if (path === "/precast")
    return (
      <Catalogue
        fixedIds={[124, 123, 122]}
        label="Precast materials"
        description="Explore the recorded precast, paving slab, paving tile and wet mix range. Confirm your application with a Zimtile branch."
      />
    );
  if (path === "/solutions")
    return (
      <>
        <PageIntro
          label="Solutions"
          title={
            <>
              Start with
              <br /> what you’re building.
            </>
          }
          copy="Discover relevant material categories, then let your local Zimtile team help refine the specification."
        />
        <Finder standalone />
        <CTA />
      </>
    );
  if (path === "/about") return <About />;
  if (path === "/values") return <Values />;
  if (path === "/branches") return <Branches />;
  if (path === "/quote") return <Quote />;
  if (path === "/contact") return <Contact />;
  if (path === "/projects" || path === "/news")
    return <Stories type={path === "/projects" ? "project" : "news"} />;
  let story = content.find(
    (x) => path === `/${x.type === "project" ? "projects" : "news"}/${x.slug}`,
  );
  if (story) return <StoryDetail p={story} />;
  if (information.some((x) => path === "/" + x.slug))
    return <InformationPage slug={path.slice(1)} />;
  return (
    <>
      <PageIntro
        label="Page not found"
        title="Let’s get you building."
        copy="That page could not be found. Explore the catalogue or find your local branch."
      />
      <section className="section">
        <Button to="/products">Explore products</Button>
      </section>
    </>
  );
}
export default function App({ initialPath = "/" }) {
  const [path, setPath] = useState(initialPath.replace(/\/$/, "") || "/"),
    [quote, setQuote] = useState([]),
    [search, setSearch] = useState(false),
    [quick, setQuick] = useState(null),
    [toast, setToast] = useState("");
  const loaded = useRef(false);
  useEffect(() => {
    try {
      let saved = JSON.parse(localStorage.getItem("zimtile-quote") || "[]");
      setQuote(
        saved
          .filter(
            (x) =>
              products.some((p) => p.id === x.id) &&
              Number.isInteger(x.qty) &&
              x.qty > 0,
          )
          .map((x) => ({ ...x, qty: Math.min(x.qty, 999999) })),
      );
    } catch {}
    loaded.current = true;
    const pop = () => {
      setPath(location.pathname.replace(/\/$/, "") || "/");
      setQuick(null);
      setSearch(false);
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    if (loaded.current) {
      try {
        localStorage.setItem("zimtile-quote", JSON.stringify(quote));
      } catch {}
    }
  }, [quote]);
  function go(to) {
    if (path === to) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    history.pushState({}, "", to);
    setPath(to);
    setSearch(false);
    setQuick(null);
    window.scrollTo({ top: 0 });
  }
  function add(id) {
    setQuote((a) =>
      a.some((x) => x.id === id)
        ? a.map((x) =>
            x.id === id ? { ...x, qty: Math.min(x.qty + 1, 999999) } : x,
          )
        : [...a, { id, qty: 1 }],
    );
    setToast("Material added to your quote");
  }
  function qty(id, q) {
    setQuote((a) =>
      a.map((x) =>
        x.id === id
          ? { ...x, qty: Math.max(1, Math.min(999999, Math.floor(q) || 1)) }
          : x,
      ),
    );
  }
  function remove(id) {
    setQuote((a) => a.filter((x) => x.id !== id));
  }
  useEffect(() => {
    if (toast) {
      let t = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(t);
    }
  }, [toast, quote]);
  useEffect(() => {
    let m = metadata(path);
    document.title = m.title;
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement("meta");
      desc.name = "description";
      document.head.append(desc);
    }
    desc.content = m.description;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = "https://www.zimtile.co.zw" + path;
    document.documentElement.classList.add("motion-ready");
    let observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((x) => observer.observe(x));
    return () => observer.disconnect();
  }, [path]);
  return (
    <Ctx.Provider
      value={{ path, go, quote, add, qty, remove, setSearch, setQuick }}
    >
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" key={path}>
        <Page path={path} />
      </main>
      <Footer />
      {search && (
        <Modal label="Site search" onClose={() => setSearch(false)}>
          <SearchOverlay />
        </Modal>
      )}
      {quick && (
        <Modal
          label={"Quick view " + quick.name}
          onClose={() => setQuick(null)}
        >
          <button
            className="modal-close icon-button"
            aria-label="Close quick view"
            onClick={() => setQuick(null)}
          >
            <X />
          </button>
          <ProductDetail p={quick} quick />
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          {toast}
          <Link to="/quote">
            View quote <ArrowRight size={15} />
          </Link>
        </div>
      )}
      <a
        className="floating-contact"
        href="https://wa.me/263785744281"
        target="_blank"
        rel="noreferrer"
        aria-label="Contact Zimtile on WhatsApp"
      >
        <Phone size={17} />
        <span>Speak to Zimtile</span>
      </a>
    </Ctx.Provider>
  );
}
