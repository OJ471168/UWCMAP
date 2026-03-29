import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { EventData, FilterState } from '../../types';
import { getCategoryPin } from '../../constants';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  events: EventData[];
  filters: FilterState;
  onSelectEvent: (e: EventData) => void;
  selectedEvent: EventData | null;
}

const ClusterLayer: React.FC<{ events: EventData[]; onSelectEvent: (e: EventData) => void }> = ({ events, onSelectEvent }) => {
  const map = useMap();
  const clusterGroupRef = useRef<any>(null);

  useEffect(() => {
    if (!clusterGroupRef.current) {
      clusterGroupRef.current = (L as any).markerClusterGroup({
        chunkedLoading: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false,
        spiderfyOnMaxZoom: true,
        disableClusteringAtZoom: 18,
        maxClusterRadius: 50
      });

      clusterGroupRef.current.on('clusterclick', (a: any) => {
        const currentZoom = map.getZoom();
        if (currentZoom < 15) {
          a.layer.zoomToBounds({ padding: [20, 20], maxZoom: 15 });
        } else {
          a.layer.zoomToBounds({ padding: [20, 20] });
        }
      });

      map.addLayer(clusterGroupRef.current);
    }

    const clusterGroup = clusterGroupRef.current;
    clusterGroup.clearLayers();

    const validEvents = events.filter(ev => ev.lat !== null && ev.lng !== null);

    const markers = validEvents.map(ev => {
      const pinUrl = getCategoryPin(ev.category);
      const icon = L.icon({
        iconUrl: pinUrl,
        iconSize: [38, 58],
        iconAnchor: [19, 58],
        popupAnchor: [0, -50],
        className: 'transition-transform hover:scale-110 duration-200'
      });

      const marker = L.marker([ev.lat!, ev.lng!], { icon });
      marker.on('click', () => onSelectEvent(ev));
      marker.bindTooltip(ev.title, { direction: 'top', offset: [0, -55] });
      return marker;
    });

    clusterGroup.addLayers(markers);
  }, [events, map, onSelectEvent]);

  useEffect(() => {
    return () => {
      if (clusterGroupRef.current && map) {
        map.removeLayer(clusterGroupRef.current);
      }
    };
  }, [map]);

  return null;
};

const MapController: React.FC<{
  selectedEvent: EventData | null;
  filters: FilterState;
}> = ({ selectedEvent, filters }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedEvent && selectedEvent.lat !== null && selectedEvent.lng !== null) {
      map.invalidateSize();
      map.flyTo([selectedEvent.lat, selectedEvent.lng], 15, { duration: 1.5 });
    }
  }, [selectedEvent, map]);

  useEffect(() => {
    if (filters.userLocation) {
      map.flyTo([filters.userLocation.lat, filters.userLocation.lng], 9, { duration: 1.5 });
    }
  }, [filters.userLocation, map]);

  return null;
};

const MapInterface: React.FC = () => {
  const map = useMap();
  const [showReset, setShowReset] = useState(false);

  useMapEvents({
    zoomend: () => setShowReset(map.getZoom() > 3),
    moveend: () => setShowReset(map.getZoom() > 3),
  });

  useEffect(() => {
    const handleExternalReset = () => {
      map.flyTo([20, 0], 2, { duration: 1.5 });
      setTimeout(() => map.invalidateSize(), 300);
    };
    window.addEventListener('resetMap', handleExternalReset);
    return () => window.removeEventListener('resetMap', handleExternalReset);
  }, [map]);

  if (!showReset) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('resetMap'));
        map.flyTo([20, 0], 2, { duration: 1.5 });
      }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-6 py-3 rounded-full shadow-xl font-bold border border-gray-100 flex items-center gap-2 hover:bg-indigo-900 hover:text-white transition-all z-[1000] group"
    >
      <span>🌍</span> View Full Map
    </button>
  );
};

const MapResizer: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(map.getContainer());
    return () => resizeObserver.disconnect();
  }, [map]);
  return null;
};

const MapView: React.FC<MapProps> = ({ events, filters, onSelectEvent, selectedEvent }) => {
  return (
    <div className="flex-grow h-full w-full relative z-0">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {filters.userLocation && (
          <>
            <Marker position={[filters.userLocation.lat, filters.userLocation.lng]}>
              <Popup>You are here</Popup>
            </Marker>
            <Circle
              center={[filters.userLocation.lat, filters.userLocation.lng]}
              radius={filters.radius}
              pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1 }}
            />
          </>
        )}

        <ClusterLayer events={events} onSelectEvent={onSelectEvent} />
        <MapController selectedEvent={selectedEvent} filters={filters} />
        <MapInterface />
        <MapResizer />
      </MapContainer>
    </div>
  );
};

export default MapView;
