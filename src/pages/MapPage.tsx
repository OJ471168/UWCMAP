import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/map/Sidebar';
import Navigation from '../components/map/Navigation';
import MapView from '../components/map/MapContainer';
import EventList from '../components/map/EventList';
import EventPanel from '../components/map/EventPanel';
import HelpModal from '../components/map/HelpModal';
import { fetchEvents } from '../services/events';
import { EventData, FilterState, ViewMode } from '../types';
import { CATEGORY_GROUPS } from '../constants';
import L from 'leaflet';

const MapPage: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLocating, setIsLocating] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    year: new Date().getFullYear(),
    selectedMonths: new Set(),
    selectedCategories: new Set(),
    selectedOrganizers: new Set(),
    selectedContinent: null,
    selectedCountry: null,
    radius: 100000,
    userLocation: null,
    showFavoritesOnly: false
  });

  useEffect(() => {
    const saved = localStorage.getItem('saved_events');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    fetchEvents()
      .then(data => {
        setEvents(data);
        setLoading(false);
        const urlParams = new URLSearchParams(window.location.search);
        const sharedId = urlParams.get('event');
        if (sharedId) {
          const evt = data.find(e => e.id === Number(sharedId));
          if (evt) setSelectedEvent(evt);
        }
      })
      .catch(err => {
        console.error("Failed to load events", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const resetMap = () => {
      setViewMode('map');
      setSelectedEvent(null);
    };
    window.addEventListener('resetMap', resetMap);
    return () => window.removeEventListener('resetMap', resetMap);
  }, []);

  const toggleFavorite = (id: number) => {
    const newFavs = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('saved_events', JSON.stringify(newFavs));
  };

  const handleLocate = () => {
    if (filters.userLocation) {
      setFilters(prev => ({ ...prev, userLocation: null }));
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFilters(prev => ({ ...prev, userLocation: { lat: pos.coords.latitude, lng: pos.coords.longitude } }));
        setIsLocating(false);
      },
      () => {
        alert("Could not access location.");
        setIsLocating(false);
      }
    );
  };

  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      if (filters.showFavoritesOnly && !favorites.includes(ev.id)) return false;

      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        if (!ev.title.toLowerCase().includes(term) && !ev.city.toLowerCase().includes(term)) return false;
      }

      if (filters.selectedCategories.size > 0) {
        const match = Array.from(filters.selectedCategories).some(filterId => {
          const group = CATEGORY_GROUPS.find(g => g.id === filterId);
          if (!group) return false;
          const catLower = ev.category.toLowerCase();
          return catLower.includes(group.id) || group.label.toLowerCase().includes(catLower);
        });
        if (!match) return false;
      }

      if (filters.selectedOrganizers.size > 0) {
        const mainMatch = filters.selectedOrganizers.has(ev.organizer);
        const coMatch = ev.coFacilitators.some(cf => filters.selectedOrganizers.has(cf.name));
        if (!mainMatch && !coMatch) return false;
      }

      if (filters.selectedMonths.size > 0) {
        let overlap = false;
        for (const key of Array.from(filters.selectedMonths)) {
          const [yStr, mStr] = (key as string).split('-');
          const mStart = new Date(parseInt(yStr), parseInt(mStr), 1);
          const mEnd = new Date(parseInt(yStr), parseInt(mStr) + 1, 0, 23, 59, 59);
          if (ev.end >= mStart && ev.start <= mEnd) { overlap = true; break; }
        }
        if (!overlap) return false;
      }

      if (filters.selectedContinent && ev.continent.toLowerCase() !== filters.selectedContinent.toLowerCase()) return false;
      if (filters.selectedCountry && ev.country !== filters.selectedCountry) return false;

      if (filters.userLocation) {
        if (ev.lat === null || ev.lng === null) return false;
        const dist = L.latLng(ev.lat, ev.lng).distanceTo(L.latLng(filters.userLocation.lat, filters.userLocation.lng));
        if (dist > filters.radius) return false;
      }

      return true;
    });
  }, [events, filters, favorites]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-gray-800">
      <Sidebar filters={filters} setFilters={setFilters} events={events} onLocate={handleLocate} isLocating={isLocating} />

      <div className="flex-grow flex flex-col h-full relative min-w-0">
        <Navigation viewMode={viewMode} setViewMode={setViewMode} filters={filters} setFilters={setFilters} onToggleHelp={() => setShowHelp(true)} events={events} />

        <div className="flex-grow relative overflow-hidden">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-900"></div>
            </div>
          ) : viewMode === 'map' ? (
            <MapView events={filteredEvents} filters={filters} onSelectEvent={setSelectedEvent} selectedEvent={selectedEvent} />
          ) : (
            <EventList events={filteredEvents} onSelectEvent={setSelectedEvent} filters={filters} favorites={favorites} toggleFavorite={toggleFavorite} />
          )}
        </div>
      </div>

      <div className={`flex-none h-full bg-white border-l border-gray-200 transition-all duration-300 ease-in-out z-40 shadow-xl ${selectedEvent ? 'w-[450px]' : 'w-0'}`}>
        <div className="w-[450px] h-full overflow-hidden">
          <EventPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} isFavorite={selectedEvent ? favorites.includes(selectedEvent.id) : false} toggleFavorite={() => selectedEvent && toggleFavorite(selectedEvent.id)} />
        </div>
      </div>

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default MapPage;
