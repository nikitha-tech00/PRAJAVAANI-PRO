import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  interactiveMarker?: boolean;
  markerPosition?: [number, number];
  onMarkerChange?: (pos: [number, number]) => void;
  complaintMarkers?: Array<{
    id: string;
    complaint_number: string;
    position: [number, number];
    title: string;
    category: string;
    priority: string;
    status: string;
  }>;
  clusters?: Array<{
    id: string;
    title: string;
    center: [number, number];
    radius: number;
    severity: string;
    count: number;
  }>;
  heatmapPoints?: Array<{
    latitude: number;
    longitude: number;
    weight: number;
    priority: string;
  }>;
  height?: string;
}

export const LeafletMap: React.FC<MapProps> = ({
  center = [17.4401, 78.3489],
  zoom = 14,
  interactiveMarker = false,
  markerPosition,
  onMarkerChange,
  complaintMarkers = [],
  clusters = [],
  heatmapPoints = [],
  height = '360px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
      });

      // CartoDB Voyager tiles (clean, high-contrast, government-grade)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;

      // Handle click to set location in interactive mode
      if (interactiveMarker) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          if (onMarkerChange) {
            onMarkerChange([lat, lng]);
          }
        });
      }
    }

    return () => {
      // Don't fully destroy on every render, manage layers
    };
  }, []);

  // Update center when prop changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center[0], center[1], zoom]);

  // Update markers and layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layers = layerGroupRef.current;
    if (!map || !layers) return;

    layers.clearLayers();

    // 1. Single interactive / user marker
    const pinPos = markerPosition || center;
    if (pinPos) {
      const pinIcon = L.divIcon({
        className: 'custom-pin',
        html: `
          <div style="
            background: #2563eb;
            color: white;
            width: 34px;
            height: 34px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(37,99,235,0.4);
            border: 2px solid white;
          ">
            <div style="
              width: 12px;
              height: 12px;
              background: white;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
      });

      const userMarker = L.marker(pinPos, {
        icon: pinIcon,
        draggable: interactiveMarker,
      }).addTo(layers);

      if (interactiveMarker) {
        userMarker.on('dragend', (e) => {
          const newPos = e.target.getLatLng();
          if (onMarkerChange) {
            onMarkerChange([newPos.lat, newPos.lng]);
          }
        });
      }

      userMarkerRef.current = userMarker;
    }

    // 2. Complaint Markers
    complaintMarkers.forEach((item) => {
      const color =
        item.priority === 'CRITICAL'
          ? '#dc2626'
          : item.priority === 'HIGH'
          ? '#ea580c'
          : item.priority === 'MEDIUM'
          ? '#ca8a04'
          : '#16a34a';

      const compIcon = L.divIcon({
        className: 'comp-pin',
        html: `
          <div style="
            background: ${color};
            color: white;
            font-size: 10px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 12px;
            border: 2px solid white;
            box-shadow: 0 3px 8px rgba(0,0,0,0.25);
            white-space: nowrap;
          ">
            ${item.complaint_number}
          </div>
        `,
        iconSize: [80, 24],
        iconAnchor: [40, 12],
      });

      const m = L.marker(item.position, { icon: compIcon }).addTo(layers);
      m.bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4;">
          <strong>${item.complaint_number}</strong><br/>
          <span style="color: #64748b;">${item.category}</span><br/>
          <div style="margin-top: 4px; font-weight: 600;">${item.title}</div>
          <div style="margin-top: 6px; display: inline-block; padding: 2px 6px; border-radius: 4px; background: ${color}20; color: ${color}; font-weight: bold; font-size: 11px;">
            ${item.priority} Priority • ${item.status}
          </div>
        </div>
      `);
    });

    // 3. Incident Clusters
    clusters.forEach((cluster) => {
      const clusterColor = cluster.severity === 'CRITICAL' ? '#dc2626' : '#ea580c';

      L.circle(cluster.center, {
        radius: cluster.radius,
        color: clusterColor,
        fillColor: clusterColor,
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '4, 4',
      })
        .addTo(layers)
        .bindPopup(`
          <div style="font-family: sans-serif;">
            <strong style="color: ${clusterColor};">🚨 CIVIC INCIDENT CLUSTER</strong><br/>
            <strong>${cluster.title}</strong><br/>
            <span>Complaints Grouped: ${cluster.count}</span><br/>
            <span>Radius: ${cluster.radius}m</span>
          </div>
        `);
    });

    // 4. Heatmap intensity circles
    heatmapPoints.forEach((pt) => {
      const color = pt.priority === 'CRITICAL' ? '#dc2626' : pt.priority === 'HIGH' ? '#ea580c' : '#f59e0b';
      L.circle([pt.latitude, pt.longitude], {
        radius: 120,
        color: 'transparent',
        fillColor: color,
        fillOpacity: 0.35,
      }).addTo(layers);
    });
  }, [markerPosition, complaintMarkers, clusters, heatmapPoints, interactiveMarker]);

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      {interactiveMarker && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(15, 23, 42, 0.85)',
            color: 'white',
            backdropFilter: 'blur(6px)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            fontWeight: 600,
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        >
          📍 Click or drag pin to adjust precise GPS coordinates
        </div>
      )}
    </div>
  );
};
