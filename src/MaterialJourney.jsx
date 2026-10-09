import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import data from "./data.json";
const stages = [
  [
    "One material.",
    "A concrete roof tile. A profile, a colour, a place to begin.",
  ],
  [
    "A bigger picture.",
    "Individual materials come together to define the roofline.",
  ],
  [
    "Built for generations.",
    "From material selection to the places we make our own.",
  ],
];
export default function MaterialJourney({ navigate }) {
  const root = useRef(),
    [stage, setStage] = useState(0),
    [assembled, setAssembled] = useState(false);
  const tile = data.products.find((p) => p.slug === "bold-double-roman-amber");
  useEffect(() => {
    let frame = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    function draw() {
      frame = 0;
      let r = root.current.getBoundingClientRect();
      let progress = Math.max(
        0,
        Math.min(1, -r.top / (r.height - window.innerHeight)),
      );
      root.current.style.setProperty("--build", reduced.matches ? 1 : progress);
      setStage(reduced.matches ? 2 : Math.min(2, Math.floor(progress * 3)));
    }
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    window.addEventListener("scroll", scroll, { passive: true });
    draw();
    return () => {
      window.removeEventListener("scroll", scroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <section
      ref={root}
      id="material-journey"
      className={`material-journey ${assembled ? "force-assembled" : ""}`}
    >
      <div className="journey-sticky">
        <div className="journey-top">
          <span>THE MATERIAL / THE POSSIBILITIES</span>
          <span>ZIMTILE DESIGN STUDY / 01</span>
        </div>
        <div className="journey-copy">
          <span className="eyebrow">
            <i />
            FROM PROFILE TO ROOFLINE
          </span>
          <h2 key={stage}>{stages[stage][0]}</h2>
          <p>{stages[stage][1]}</p>
          <a
            href="/roof-tiles"
            onClick={(e) => {
              e.preventDefault();
              navigate("/roof-tiles");
            }}
          >
            Find your roof profile <ArrowUpRight size={18} />
          </a>
          <div className="journey-progress">
            {stages.map((s, i) => (
              <span key={i} className={i <= stage ? "active" : ""}>
                0{i + 1}
              </span>
            ))}
          </div>
        </div>
        <div className="assembly-scene">
          <div className="assembly-orbit" />
          <div className="tile-assembly">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                className="assembly-tile"
                key={i}
                style={{
                  "--row": Math.floor(i / 4),
                  "--col": i % 4,
                  "--spread": ((i % 3) + 1) * 34,
                  "--lift": ((i % 4) + 1) * 46,
                  "--delay": i * 0.04,
                }}
              >
                <img src={tile.images[0]} alt="" loading="lazy" />
              </div>
            ))}
          </div>
          <span className="assembly-measure">CONCRETE / PROFILE / COLOUR</span>
          <button
            className="assembly-toggle"
            onClick={() => setAssembled(!assembled)}
            aria-pressed={assembled}
          >
            {assembled ? <Minus size={16} /> : <Plus size={16} />}{" "}
            {assembled ? "Explore the components" : "Assemble the roofline"}
          </button>
        </div>
        <div className="journey-bottom">
          <span>ILLUSTRATIVE MATERIAL ARRANGEMENT</span>
          <span>
            SCROLL TO BUILD <span>↓</span>
          </span>
        </div>
      </div>
    </section>
  );
}
