"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { Map as MapLibreMap, Marker } from "maplibre-gl";

type Footstep = {
  id: string;
  lng: number;
  lat: number;
  title: string;
  message: string;
  type: "Memory" | "Art" | "Story" | "Photo" | "Message";
  createdAt: string;
};

const STORAGE_KEY = "elysia-footsteps-v1";

export default function Home() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [footsteps, setFootsteps] = useState<Footstep[]>([]);
  const [draft, setDraft] = useState<{ lng: number; lat: number } | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<Footstep["type"]>("Memory");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setFootsteps(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [78.9629, 20.5937],
      zoom: 3.5,
    });
    map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    map.addControl(new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }), "bottom-right");
    map.on("click", (event) => setDraft({ lng: event.lngLat.lng, lat: event.lngLat.lat }));
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = footsteps.map((footstep) => {
      const el = document.createElement("button");
      el.className = "footstep-marker";
      el.textContent = "👣";
      el.title = footstep.title;
      const popup = new maplibregl.Popup({ offset: 28 }).setHTML(
        `<div class="popup"><b>${escapeHtml(footstep.title)}</b><small>${footstep.type}</small><p>${escapeHtml(footstep.message)}</p></div>`
      );
      return new maplibregl.Marker({ element: el }).setLngLat([footstep.lng, footstep.lat]).setPopup(popup).addTo(map);
    });
  }, [footsteps]);

  function saveFootstep() {
    if (!draft || !title.trim()) return;
    const next: Footstep = {
      id: crypto.randomUUID(),
      ...draft,
      title: title.trim(),
      message: message.trim(),
      type,
      createdAt: new Date().toISOString(),
    };
    const updated = [next, ...footsteps];
    setFootsteps(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setDraft(null); setTitle(""); setMessage(""); setType("Memory");
  }

  return (
    <main>
      <div ref={mapContainer} className="map" />
      <header className="topbar">
        <div><span className="brand-mark">E</span><strong>ELYSIA</strong></div>
        <span className="tagline">Leave Your Mark. Build Your World.</span>
      </header>

      <section className="hero-card">
        <span className="eyebrow">THE WORLD HAS STORIES</span>
        <h1>What has someone<br />created here?</h1>
        <p>Tap anywhere on Earth to leave a permanent digital Footstep.</p>
        <div className="stats"><span><b>{footsteps.length}</b> Footsteps</span><span>🌍 Explore Earth</span></div>
      </section>

      {draft && (
        <aside className="composer">
          <button className="close" onClick={() => setDraft(null)}>×</button>
          <span className="eyebrow">NEW FOOTSTEP 👣</span>
          <h2>Leave your mark</h2>
          <p className="coords">{draft.lat.toFixed(5)}, {draft.lng.toFixed(5)}</p>
          <div className="types">
            {(["Memory", "Art", "Story", "Photo", "Message"] as const).map((item) => (
              <button key={item} className={type === item ? "active" : ""} onClick={() => setType(item)}>{item}</button>
            ))}
          </div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give this Footstep a title" maxLength={60} />
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What do you want the world to remember here?" maxLength={300} />
          <button className="primary" disabled={!title.trim()} onClick={saveFootstep}>Leave Footstep 👣</button>
        </aside>
      )}

      <div className="hint">Tap the map to leave a Footstep 👣</div>
    </main>
  );
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char] ?? char));
}