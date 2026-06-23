"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Village } from "../../data/villages";
import { Complaint } from "../../data/complaints";

interface ConstituencyMapProps {
  villagesList: Village[];
  complaintsList: Complaint[];
  selectedVillageId: number | null;
  onSelectVillage: (villageId: number | null) => void;
}

export const ConstituencyMap: React.FC<ConstituencyMapProps> = ({
  villagesList,
  complaintsList,
  selectedVillageId,
  onSelectVillage
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Set Pune constituency center coords (middle of Hinjawadi & Wagholi)
    const map = L.map(mapContainerRef.current, {
      center: [18.55, 73.85],
      zoom: 11,
      zoomControl: false
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when data or selected village changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    villagesList.forEach((village) => {
      // Calculate village complaints count and average priority score
      const villageComplaints = complaintsList.filter(c => c.villageId === village.id && !c.isDuplicate);
      const activeCount = villageComplaints.filter(c => c.status !== 'resolved').length;
      
      let avgPriority = 0;
      if (villageComplaints.length > 0) {
        avgPriority = Math.round(
          villageComplaints.reduce((acc, c) => acc + c.priorityScore, 0) / villageComplaints.length
        );
      }

      // Create Custom Animated DivIcon based on priority
      const isSelected = selectedVillageId === village.id;
      const color = avgPriority > 80 
        ? "bg-red-500 border-red-200 shadow-red-500/50" 
        : avgPriority > 50 
          ? "bg-orange-500 border-orange-200 shadow-orange-500/50" 
          : "bg-emerald-500 border-emerald-200 shadow-emerald-500/50";

      const scaleClass = isSelected ? "scale-[1.5] z-[1000]" : "scale-100";
      
      const customIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center w-8 h-8 ${scaleClass} transition-transform duration-350">
            <!-- Pulsing outer ring -->
            <div class="absolute w-8 h-8 rounded-full ${color} opacity-30 ${activeCount > 0 ? 'animate-ping-slow' : ''}"></div>
            <!-- Core pin -->
            <div class="relative w-4 h-4 rounded-full ${color} border-2 border-white shadow-lg flex items-center justify-center">
              <span class="text-[8px] font-extrabold text-white">${activeCount}</span>
            </div>
            ${isSelected ? `<div class="absolute -top-1 w-2 h-2 rounded-full bg-blue-600 border border-white animate-bounce"></div>` : ""}
          </div>
        `,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([village.latitude, village.longitude], { icon: customIcon });

      // Build Interactive Popup details
      const popupContent = `
        <div class="font-sans p-2 text-slate-800 dark:text-slate-100 max-w-[200px]">
          <h4 class="font-bold text-sm text-slate-900 border-b pb-1 mb-1.5">${village.name}</h4>
          <div class="text-[10px] text-slate-500 flex flex-col gap-0.5">
            <div><strong>Population:</strong> ${village.population.toLocaleString()}</div>
            <div><strong>Infra Score:</strong> <span class="${village.infrastructureScore < 50 ? 'text-rose-500 font-bold' : 'text-emerald-500'}">${village.infrastructureScore}/100</span></div>
            <div><strong>Active Issues:</strong> <span class="font-bold text-slate-900">${activeCount} cases</span></div>
            <div><strong>Avg Priority:</strong> <span class="font-bold text-slate-900">${avgPriority}%</span></div>
          </div>
          <div class="mt-2 text-[10px] text-blue-600 dark:text-blue-400 font-semibold italic text-center">Click to filter dashboard</div>
        </div>
      `;

      marker.bindPopup(popupContent, { closeButton: false });

      // Click Event to sync with Dashboard
      marker.on("click", () => {
        onSelectVillage(isSelected ? null : village.id);
      });

      // Hover popup opening
      marker.on("mouseover", function (e) {
        this.openPopup();
      });

      // Fly to if selected
      if (isSelected) {
        map.flyTo([village.latitude, village.longitude], 12.5, { duration: 1.2 });
      }

      markersLayer.addLayer(marker);
    });
  }, [villagesList, complaintsList, selectedVillageId]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/20 dark:border-white/5 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px] z-0" />
      
      {/* Legend Overlay */}
      <div className="absolute top-4 left-4 z-10 p-3 rounded-xl bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 text-[10px] flex flex-col gap-1.5 shadow-md">
        <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[8px]">Priority Legend</span>
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <span>Critical Needs (&gt;80 score)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
          <span>Moderate Needs (50-80 score)</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          <span>Stable Needs (&lt;50 score)</span>
        </div>
        <div className="border-t pt-1 mt-1 text-[8px] text-slate-400 italic">
          Numbers show active issues
        </div>
      </div>
    </div>
  );
};

export default ConstituencyMap;
