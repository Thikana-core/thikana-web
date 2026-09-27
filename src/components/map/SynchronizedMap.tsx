'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PropertyMaster } from '@/types/property';
import { LOCATION_SCOPE } from '@/lib/supabase';

const createPriceIcon = (price: number | null, isSelected: boolean) => {
  const label = price ? `₹${(price / 100000).toFixed(1)}L` : '₹--';
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: ${isSelected ? '#0f172a' : '#10b981'};
        color: #ffffff;
        font-weight: 700;
        font-size: 11px;
        padding: 3px 8px;
        border-radius: 6px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        border: 2px solid ${isSelected ? '#f59e0b' : '#ffffff'};
        white-space: nowrap;
        transform: translate(-50%, -50%);
      ">
        ${label}
      </div>
    `,
    iconSize: [40, 20],
    iconAnchor: [20, 10]
  });
};

function MapViewRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function SynchronizedMap({
  properties,
  selectedId,
  onSelectProperty,
}: {
  properties: PropertyMaster[];
  selectedId: string | null;
  onSelectProperty: (id: string) => void;
}) {
  const selectedProp = properties.find((p) => p.id === selectedId);
  const center: [number, number] =
    selectedProp && selectedProp.latitude && selectedProp.longitude
      ? [selectedProp.latitude, selectedProp.longitude]
      : [LOCATION_SCOPE.defaultCoords.lat, LOCATION_SCOPE.defaultCoords.lng];

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapViewRecenter center={center} />
        <TileLayer
  attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom'
  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
         />
        {properties.map((prop) => {
          if (!prop.latitude || !prop.longitude) return null;
          const isSelected = prop.id === selectedId;
          return (
            <Marker
              key={prop.id}
              position={[prop.latitude, prop.longitude]}
              icon={createPriceIcon(prop.lowest_advertised_price, isSelected)}
              eventHandlers={{
                click: () => onSelectProperty(prop.id),
              }}
            >
              <Popup>
                <div className="text-xs p-1">
                  <div className="font-bold text-slate-800">{prop.title}</div>
                  <div className="text-slate-600 font-medium">
                    Lowest: ₹{prop.lowest_advertised_price ? (prop.lowest_advertised_price / 100000).toFixed(2) + 'L' : 'N/A'}
                  </div>
                  <div className="text-slate-400 mt-1">Found on {prop.source_count} sources</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}