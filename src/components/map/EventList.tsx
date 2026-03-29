import React, { useState, useMemo } from 'react';
import { EventData, FilterState } from '../../types';
import { getCategoryColor } from '../../constants';
import { Calendar, MapPin, Heart, Clock, ChevronLeft, ChevronRight, SearchX } from 'lucide-react';

interface EventListProps {
  events: EventData[];
  onSelectEvent: (e: EventData) => void;
  filters: FilterState;
  favorites: number[];
  toggleFavorite: (id: number) => void;
}

const hexToRgba = (hex: string, alpha: number) => {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return hex;
  let c = hex.substring(1).split('');
  if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  const r = parseInt(c[0] + c[1], 16);
  const g = parseInt(c[2] + c[3], 16);
  const b = parseInt(c[4] + c[5], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const EventCard: React.FC<{
  event: EventData;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}> = ({ event, onClick, isFavorite, onToggleFavorite }) => {
  const color = getCategoryColor(event.category);
  const backgroundColor = hexToRgba(color, 0.06);

  const month = event.start.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = event.start.toLocaleDateString('en-US', { day: 'numeric' });
  const weekday = event.start.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

  const isSameDay = event.start.toDateString() === event.end.toDateString();
  const timeString = isSameDay
    ? `${event.start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - ${event.end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    : `${event.start.toLocaleDateString([], { month: 'short', day: 'numeric' })} - ${event.end.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;

  return (
    <div
      onClick={onClick}
      className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col h-[400px] relative transform hover:-translate-y-1"
      style={{ backgroundColor }}
    >
      <div className="relative h-44 w-full overflow-hidden bg-gray-900 shrink-0">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-950"><span className="text-4xl">📅</span></div>
        )}
        <div className="absolute top-0 left-0 bg-gray-900/95 backdrop-blur-sm text-white px-3 py-2 rounded-br-2xl flex flex-col items-center min-w-[50px] shadow-lg z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider">{month}</span>
          <span className="text-2xl font-bold leading-none my-1">{day}</span>
          <span className="text-[10px] text-gray-400 font-semibold">{weekday}</span>
        </div>
        <button
          onClick={onToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-20 ${isFavorite ? 'bg-red-500 text-white shadow-lg scale-110' : 'bg-black/30 text-white hover:bg-black/50'}`}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-col flex-grow p-4 text-center relative z-0">
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: color }}></div>
        <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color }}>{event.category}</div>
        <h3 className="text-base font-bold text-gray-900 leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">{event.title}</h3>
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src={event.organizerAvatar} loading="lazy" onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${event.organizer}`)} className="w-5 h-5 rounded-full border border-gray-200 bg-white" alt="Org" />
          <span className="text-xs text-gray-500 font-medium truncate max-w-[150px]">{event.organizer}</span>
        </div>
        <div className="mt-auto space-y-2 w-full">
          <div className="bg-white/60 rounded-full px-3 py-1.5 flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 border border-black/5">
            <Clock size={12} className="text-gray-400" /><span className="truncate">{timeString}</span>
          </div>
          <div className="bg-white/60 rounded-full px-3 py-1.5 flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 border border-black/5">
            <MapPin size={12} className="text-gray-400" /><span className="truncate">{event.city}, {event.country}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventList: React.FC<EventListProps> = ({ events, onSelectEvent, filters, favorites, toggleFavorite }) => {
  const [viewDate, setViewDate] = useState(new Date());

  const isFilterActive = useMemo(() => {
    return filters.searchTerm.trim() !== '' || filters.selectedCategories.size > 0 || filters.selectedOrganizers.size > 0 || filters.selectedContinent !== null || filters.selectedCountry !== null || filters.userLocation !== null || filters.showFavoritesOnly || filters.selectedMonths.size > 0;
  }, [filters]);

  const sortedEvents = useMemo(() => [...events].sort((a, b) => a.start.getTime() - b.start.getTime()), [events]);

  const displayedEvents = useMemo(() => {
    if (isFilterActive) return sortedEvents;
    return sortedEvents.filter(e => e.start.getMonth() === viewDate.getMonth() && e.start.getFullYear() === viewDate.getFullYear());
  }, [isFilterActive, sortedEvents, viewDate]);

  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto w-full pb-8">
          <div className="flex items-center justify-between mb-6 py-2">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {isFilterActive ? 'Filtered Results' : monthLabel}
              <span className="text-sm font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{displayedEvents.length}</span>
            </h2>
          </div>

          {displayedEvents.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
              {displayedEvents.map(ev => (
                <EventCard key={ev.id} event={ev} onClick={() => onSelectEvent(ev)} isFavorite={favorites.includes(ev.id)} onToggleFavorite={(e) => { e.stopPropagation(); toggleFavorite(ev.id); }} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              {isFilterActive ? (
                <><SearchX size={48} className="mb-4 opacity-50" /><p className="text-lg font-medium">No events match your filters.</p><p className="text-sm">Try adjusting your search or filters.</p></>
              ) : (
                <><Calendar size={48} className="mb-4 opacity-50" /><p className="text-lg font-medium">No events in {monthLabel}</p><p className="text-sm">Use the navigation below to find events.</p></>
              )}
            </div>
          )}
        </div>
      </div>

      {!isFilterActive && (
        <div className="flex-none bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20 flex justify-center gap-6">
          <button onClick={() => setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <ChevronLeft size={20} /><span className="hidden sm:inline">Previous Month</span><span className="sm:hidden">Prev</span>
          </button>
          <button onClick={() => setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <span className="hidden sm:inline">Next Month</span><span className="sm:hidden">Next</span><ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default EventList;
