"use client";

import { useEffect, useRef } from "react";
import type { LatLngExpression, Map as LeafletMap, LayerGroup } from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  kind: "negocio" | "domiciliario" | "cliente" | "motocarro" | "pasajero";
  label?: string;
};

type Props = {
  center: LatLngExpression;
  zoom?: number;
  markers: MapMarker[];
  route?: [number, number][];
  className?: string;
};

function iconHtml(kind: MapMarker["kind"], label?: string) {
  if (kind === "negocio") {
    return `<div class="domic-pin domic-pin--negocio" title="${label ?? "Negocio"}">🏪</div>`;
  }
  if (kind === "cliente" || kind === "pasajero") {
    return `<div class="domic-pin domic-pin--cliente" title="${label ?? (kind === "pasajero" ? "Pasajero" : "Cliente")}"></div>`;
  }
  if (kind === "motocarro") {
    return `<div class="domic-pin domic-pin--motocarro" title="${label ?? "Motocarro"}">🛺</div>`;
  }
  return `<div class="domic-pin domic-pin--moto" title="${label ?? "Domiciliario"}">🛵</div>`;
}

export default function MapView({
  center,
  zoom = 15,
  markers,
  route,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const paintRef = useRef<() => void>(() => {});
  const readyRef = useRef(false);
  const centerRef = useRef(center);
  const zoomRef = useRef(zoom);
  const markersRef = useRef(markers);
  const routeRef = useRef(route);

  centerRef.current = center;
  zoomRef.current = zoom;
  markersRef.current = markers;
  routeRef.current = route;

  useEffect(() => {
    let cancelled = false;
    let resizeTimer: number | undefined;

    async function init() {
      const leaflet = await import("leaflet");
      const L = leaflet.default;

      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView(centerRef.current, zoomRef.current);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 19 }
      ).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);
      mapRef.current = map;
      layerRef.current = L.layerGroup().addTo(map);

      paintRef.current = () => {
        const layer = layerRef.current;
        const m = mapRef.current;
        if (!layer || !m) return;
        layer.clearLayers();

        const r = routeRef.current;
        if (r && r.length > 1) {
          L.polyline(
            r.map(([lat, lng]) => [lat, lng] as LatLngExpression),
            {
              color: "#d4af37",
              weight: 3,
              opacity: 0.85,
              dashArray: "6 10",
            }
          ).addTo(layer);
        }

        markersRef.current.forEach((marker) => {
          const icon = L.divIcon({
            className: "domic-marker",
            html: iconHtml(marker.kind, marker.label),
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });
          L.marker([marker.lat, marker.lng], { icon }).addTo(layer);
        });
      };

      paintRef.current();
      readyRef.current = true;
      resizeTimer = window.setTimeout(() => {
        map.invalidateSize();
        paintRef.current();
      }, 80);
    }

    void init();

    return () => {
      cancelled = true;
      if (resizeTimer) window.clearTimeout(resizeTimer);
      readyRef.current = false;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!readyRef.current || !mapRef.current) return;
    paintRef.current();
    mapRef.current.setView(center, zoom, { animate: true });
  }, [center, zoom, markers, route]);

  return (
    <div className={`domic-map ${className}`.trim()}>
      <div ref={containerRef} className="domic-map__canvas" />
    </div>
  );
}
