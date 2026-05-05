"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Entry, EntryType } from "@/content/entries";
import { KRHANICE_CENTER, typeLabels } from "@/content/entries";

// OpenFreeMap "positron" -- free vector tiles, no API key, calm light style.
// Phase 3 (designed): swap for MapTiler with a brand-colored style.
const VECTOR_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

// Minimum half-span so a single point doesn't zoom in to street level.
// 0.005 deg lat ~ 555 m; 0.008 deg lng at lat 49.85 ~ 575 m.
const MIN_HALF_SPAN_LAT = 0.005;
const MIN_HALF_SPAN_LNG = 0.008;

const MARKER_BASE =
  "block cursor-pointer outline-none transition-[filter] focus-visible:filter-[drop-shadow(0_0_0_4px_rgba(0,0,0,0.3))]";
const MARKER_HOVER = "hover:[filter:drop-shadow(0_0_0_3px_rgba(0,0,0,0.18))]";

// Marker palette tied to the brand. Halo stays white in both states --
// it's the readability layer over busy map tiles, not a state signal.
const HALO = "#ffffff";
const ICON_DEFAULT = "#0077c0"; // kp-blue
const ICON_ACTIVE = "#00257b"; // kp-navy

// Lucide icon paths (24×24 viewBox, stroke-based). Inline so the map
// doesn't have to mount React for each pin. Keep these in sync with
// the icons used in EntryThumb + ScopePills.
function iconPaths(type: EntryType): string {
  switch (type) {
    case "akce":
      // Calendar
      return `
        <rect width="18" height="18" x="3" y="4" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
      `;
    case "mista":
      // MapPin
      return `
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
        <circle cx="12" cy="10" r="3"/>
      `;
    case "gastro":
      // ChefHat -- kuchařská čepice. Universálnější signál pro gastro
      // než utensils (které čte jako "jídlo k jídlu", ne místo, kam jít).
      // Source: lucide-react main.
      return `
        <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"/>
        <path d="M6 17h12"/>
      `;
    case "obchody":
      // Store
      return `
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
        <path d="M2 7h20"/>
      `;
    case "sluzby":
      // Briefcase
      return `
        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        <rect width="20" height="14" x="2" y="6" rx="2"/>
      `;
    case "spolky":
      // Users
      return `
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      `;
  }
}

// Marker SVG: just the icon, no enclosing shape. Two passes:
//   1. halo        -- thicker white stroke acting as outline so the icon
//                     stays readable over busy map tiles.
//   2. icon stroke -- the icon itself on top of the halo. Proud Blue
//                     in default state, deepens to Navy on selection.
function shapeSvg(type: EntryType, sizePx: number, isActive: boolean): string {
  const haloColor = HALO;
  const inkColor = isActive ? ICON_ACTIVE : ICON_DEFAULT;
  const paths = iconPaths(type);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${sizePx}" height="${sizePx}" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <g stroke="${haloColor}" stroke-width="5">${paths}</g>
    <g stroke="${inkColor}" stroke-width="2">${paths}</g>
  </svg>`;
}

function paintMarker(el: HTMLElement, type: EntryType, isActive: boolean) {
  const size = isActive ? 32 : 28;
  el.innerHTML = shapeSvg(type, size, isActive);
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.filter = "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35))";
}

export function MapView({
  entries,
  onEntryClick,
  selectedId,
  hoveredId,
  onEntryHover,
}: {
  entries: Entry[];
  onEntryClick?: (entry: Entry) => void;
  selectedId?: string;
  // Bidirectional hover sync: parent controls hoveredId, marker fires
  // onEntryHover on pointer enter/leave so list items can highlight.
  hoveredId?: string;
  onEntryHover?: (entry: Entry | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<
    Map<
      string,
      { marker: maplibregl.Marker; el: HTMLButtonElement; type: EntryType }
    >
  >(new Map());
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: VECTOR_STYLE_URL,
      center: [KRHANICE_CENTER.lng, KRHANICE_CENTER.lat],
      zoom: 13,
      attributionControl: { compact: true },
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right",
    );
    map.on("load", () => setMapReady(true));

    mapRef.current = map;

    return () => {
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current.clear();

    const mappable = entries.filter(
      (e): e is typeof e & { lat: number; lng: number } =>
        e.lat !== undefined && e.lng !== undefined,
    );

    for (const entry of mappable) {
      const el = document.createElement("button");
      el.type = "button";
      const type = entry.type;
      el.setAttribute("aria-label", `${typeLabels[type]}: ${entry.title}`);
      el.className = `${MARKER_BASE} ${MARKER_HOVER}`;
      paintMarker(el, type, false);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        if (onEntryClick) onEntryClick(entry);
      });
      el.addEventListener("mouseenter", () => onEntryHover?.(entry));
      el.addEventListener("mouseleave", () => onEntryHover?.(null));
      el.addEventListener("focus", () => onEntryHover?.(entry));
      el.addEventListener("blur", () => onEntryHover?.(null));

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([entry.lng, entry.lat])
        .addTo(map);

      markersRef.current.set(entry.id, { marker, el, type });
    }

    if (selectedId) return;

    map.resize();

    if (mappable.length === 0) {
      map.easeTo({
        center: [KRHANICE_CENTER.lng, KRHANICE_CENTER.lat],
        zoom: 13,
        duration: 500,
      });
      return;
    }

    let halfLat = 0;
    let halfLng = 0;
    for (const e of mappable) {
      halfLat = Math.max(halfLat, Math.abs(e.lat - KRHANICE_CENTER.lat));
      halfLng = Math.max(halfLng, Math.abs(e.lng - KRHANICE_CENTER.lng));
    }
    halfLat = Math.max(halfLat, MIN_HALF_SPAN_LAT);
    halfLng = Math.max(halfLng, MIN_HALF_SPAN_LNG);

    const bounds = new maplibregl.LngLatBounds(
      [KRHANICE_CENTER.lng - halfLng, KRHANICE_CENTER.lat - halfLat],
      [KRHANICE_CENTER.lng + halfLng, KRHANICE_CENTER.lat + halfLat],
    );
    map.fitBounds(bounds, { padding: 80, maxZoom: 14, duration: 700 });
  }, [entries, mapReady, onEntryClick, onEntryHover, selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    markersRef.current.forEach(({ el, type }, id) => {
      const isActive = id === selectedId || id === hoveredId;
      paintMarker(el, type, isActive);
    });
  }, [selectedId, hoveredId, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    if (!selectedId) return;
    const target = entries.find((e) => e.id === selectedId);
    if (!target) return;
    if (target.lat === undefined || target.lng === undefined) return;
    map.easeTo({
      center: [target.lng, target.lat],
      zoom: 14,
      duration: 600,
    });
  }, [selectedId, entries, mapReady]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden rounded-lg border border-[var(--color-border)]"
      role="application"
      aria-label="Mapa akcí, míst a služeb v okolí Krhanic"
    />
  );
}
