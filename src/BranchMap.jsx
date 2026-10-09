import React, { useEffect, useRef, useState } from "react";
import { Maximize2, MapPin, ArrowUpRight } from "lucide-react";
import { branches } from "./branches.js";
import locations from "./branch-locations.json";
import "leaflet/dist/leaflet.css";

export default function BranchMap({ selected = 0, onSelect }) {
  const container = useRef(),
    host = useRef(),
    map = useRef(),
    markers = useRef([]),
    callback = useRef(onSelect),
    previous = useRef(selected);
  const [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false);
  callback.current = onSelect;
  useEffect(() => {
    let disposed = false,
      observer;
    async function initialise() {
      try {
        const { default: L } = await import("leaflet");
        if (disposed) return;
        const instance = L.map(host.current, {
          scrollWheelZoom: false,
          zoomControl: true,
          minZoom: 5,
          maxZoom: 18,
        });
        map.current = instance;
        const tiles = L.tileLayer(
          import.meta.env.VITE_MAP_TILE_URL ||
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        ).addTo(instance);
        tiles.on("tileerror", () => {
          if (!disposed) setFailed(true);
        });
        markers.current = locations.map((location, i) => {
          const pin = L.divIcon({
            className: "zimtile-map-marker",
            html: `<span><b>${String(i + 1).padStart(2, "0")}</b></span>`,
            iconSize: [36, 44],
            iconAnchor: [18, 44],
          });
          const marker = L.marker([location.lat, location.lng], {
            icon: pin,
            title: "Zimtile " + branches[i].name,
            alt: branches[i].name,
            keyboard: true,
          }).addTo(instance);
          const popup = document.createElement("div");
          const heading = document.createElement("strong");
          heading.textContent = branches[i].name;
          popup.append(heading);
          const address = document.createElement("p");
          address.textContent = branches[i].address;
          popup.append(address);
          const link = document.createElement("a");
          link.href =
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(
              "Zimtile " + branches[i].address + " " + branches[i].name,
            );
          link.target = "_blank";
          link.rel = "noreferrer";
          link.textContent = "Get directions ↗";
          popup.append(link);
          marker.bindPopup(popup, { maxWidth: 245 });
          marker.on("click", () => callback.current(i));
          marker
            .getElement()
            ?.setAttribute("aria-label", "Select " + branches[i].name);
          return marker;
        });
        instance.fitBounds(
          locations.map((l) => [l.lat, l.lng]),
          { padding: [45, 45] },
        );
        setReady(true);
      } catch {
        if (!disposed) setFailed(true);
      }
    }
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          initialise();
        }
      },
      { rootMargin: "160px" },
    );
    observer.observe(container.current);
    return () => {
      disposed = true;
      observer.disconnect();
      map.current?.remove();
      map.current = null;
      markers.current = [];
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    markers.current.forEach((marker, i) => {
      marker.getElement()?.classList.toggle("selected", i === selected);
      marker
        .getElement()
        ?.setAttribute("aria-label", "Select " + branches[i].name);
    });
    if (previous.current !== selected) {
      let location = locations[selected];
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      map.current.flyTo([location.lat, location.lng], 13, {
        animate: !reduce,
        duration: 0.8,
      });
      markers.current[selected].openPopup();
    }
    previous.current = selected;
  }, [selected, ready]);
  function all() {
    map.current?.closePopup();
    map.current?.fitBounds(
      locations.map((l) => [l.lat, l.lng]),
      { padding: [45, 45], animate: false },
    );
  }
  return (
    <div ref={container} className="branch-map real-map">
      <div
        ref={host}
        className="map-canvas"
        aria-label="Interactive map of all eight Zimtile branches"
      />
      {!ready && (
        <div className="map-loading">
          <MapPin />
          <span>Loading branch map</span>
        </div>
      )}
      <div className="map-topline">
        <span>08 BRANCHES / ZIMBABWE</span>
        <button onClick={all} disabled={!ready}>
          <Maximize2 size={14} /> All branches
        </button>
      </div>
      {failed && (
        <div className="map-fallback">
          <span>
            Street tiles are unavailable. Branch locations remain accessible.
          </span>
          <a href={locations[selected].embed} target="_blank" rel="noreferrer">
            Open Google Maps <ArrowUpRight size={14} />
          </a>
        </div>
      )}
    </div>
  );
}
