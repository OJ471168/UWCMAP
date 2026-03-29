import React, { useState, useMemo } from 'react';
import { FilterState, EventData } from '../../types';
import { CATEGORY_GROUPS, MONTHS } from '../../constants';
import { Search, ChevronDown, ChevronRight, Check, MapPin } from 'lucide-react';

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  events: EventData[];
  onLocate: () => void;
  isLocating: boolean;
}

const AccordionItem: React.FC<{
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  borderBottom?: boolean;
}> = ({ title, children, isOpen = false, borderBottom = true }) => {
  const [open, setOpen] = useState(isOpen);
  return (
    <div className={`border-gray-100 ${borderBottom ? 'border-b' : ''}`}>
      <div
        className="flex justify-between items-center py-4 px-1 cursor-pointer hover:text-blue-600 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-bold text-gray-800 text-sm tracking-wide">{title}</span>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </div>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, events, onLocate, isLocating }) => {
  const currentYear = new Date().getFullYear();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const facilitators = useMemo(() => {
    const map = new Map<string, string>();
    events.forEach(e => {
      if (e.organizerIsRegistered) {
        map.set(e.organizer, e.organizerAvatar);
      }
      e.coFacilitators.forEach(cf => {
        if (cf.isRegistered) {
          map.set(cf.name, cf.avatar);
        }
      });
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [events]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFilters(prev => ({ ...prev, searchTerm: val }));
    if (val.length > 1) {
      const matches = events
        .filter(ev => ev.title.toLowerCase().includes(val.toLowerCase()) || ev.city.toLowerCase().includes(val.toLowerCase()))
        .map(ev => ev.title)
        .slice(0, 5);
      setSuggestions(Array.from(new Set(matches)));
    } else {
      setSuggestions([]);
    }
  };

  const toggleMonth = (key: string) => {
    const newSet = new Set(filters.selectedMonths);
    if (newSet.has(key)) newSet.delete(key); else newSet.add(key);
    setFilters(prev => ({ ...prev, selectedMonths: newSet }));
  };

  const toggleOrganizer = (name: string) => {
    const newSet = new Set(filters.selectedOrganizers);
    if (newSet.has(name)) newSet.delete(name); else newSet.add(name);
    setFilters(prev => ({ ...prev, selectedOrganizers: newSet }));
  };

  const toggleCategoryGroup = (groupId: string) => {
    const newSet = new Set(filters.selectedCategories);
    if (newSet.has(groupId)) newSet.delete(groupId); else newSet.add(groupId);
    setFilters(prev => ({ ...prev, selectedCategories: newSet }));
  };

  const toggleAllCategories = (checked: boolean) => {
    if (!checked) {
      setFilters(prev => ({ ...prev, selectedCategories: new Set() }));
    } else {
      const all = new Set<string>();
      CATEGORY_GROUPS.forEach(g => all.add(g.id));
      setFilters(prev => ({ ...prev, selectedCategories: all }));
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full z-20 shadow-lg shrink-0">
      <div className="p-5 border-b border-gray-100 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800 m-0">Global Events</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {/* Search */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={handleSearchChange}
            placeholder="Search event titles..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 mt-1 max-h-48 overflow-y-auto">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 truncate"
                  onClick={() => { setFilters(prev => ({ ...prev, searchTerm: s })); setSuggestions([]); }}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <button
            onClick={onLocate}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
              filters.userLocation ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <MapPin size={16} />
            {isLocating ? 'Locating...' : filters.userLocation ? 'Clear Location' : 'Find Events Near Me'}
          </button>
          {filters.userLocation && (
            <div className="mt-4">
              <div className="flex justify-between text-xs font-semibold text-blue-800 mb-2">
                <span>Search Radius</span>
                <span>{filters.radius / 1000} km</span>
              </div>
              <input
                type="range" min="10" max="500"
                value={filters.radius / 1000}
                onChange={(e) => setFilters(prev => ({ ...prev, radius: Number(e.target.value) * 1000 }))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          )}
        </div>

        {/* Date Filter */}
        <AccordionItem title="DATE FILTER" isOpen>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <button onClick={() => setFilters(prev => ({ ...prev, selectedMonths: new Set() }))} className="text-red-500 hover:underline">Clear Dates</button>
            </div>
            <div className="flex justify-between items-center bg-gray-50 rounded-lg p-2">
              <button onClick={() => setFilters(prev => ({ ...prev, year: prev.year - 1 }))} className="p-1 hover:bg-gray-200 rounded">&lsaquo;</button>
              <span className="font-bold text-gray-700">{filters.year}</span>
              <button onClick={() => setFilters(prev => ({ ...prev, year: prev.year + 1 }))} className="p-1 hover:bg-gray-200 rounded">&rsaquo;</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((m, idx) => {
                const key = `${filters.year}-${idx}`;
                const isPast = filters.year < currentYear || (filters.year === currentYear && idx < new Date().getMonth());
                const isSelected = filters.selectedMonths.has(key);
                return (
                  <button
                    key={key}
                    onClick={() => !isPast && toggleMonth(key)}
                    disabled={isPast}
                    className={`text-xs py-2 rounded border transition-all ${
                      isPast ? 'bg-gray-50 text-gray-300 cursor-default border-transparent' :
                      isSelected ? 'bg-indigo-900 text-white border-indigo-900 font-bold' :
                      'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </AccordionItem>

        {/* Facilitators */}
        <AccordionItem title="FACILITATORS">
          <div className="flex justify-end gap-3 text-xs mb-2">
            <button onClick={() => setFilters(prev => ({ ...prev, selectedOrganizers: new Set() }))} className="text-red-500 hover:underline">Clear</button>
          </div>
          <div className="space-y-1 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {facilitators.map(([name, avatar]) => {
              const isSelected = filters.selectedOrganizers.has(name);
              return (
                <label key={name} className={`flex items-center p-2 rounded-lg cursor-pointer border transition-all ${isSelected ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' : 'bg-white border-transparent hover:bg-gray-50'}`}>
                  <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleOrganizer(name)} />
                  <img src={avatar} alt={name} className="w-7 h-7 rounded-full border border-gray-200 object-cover mr-3 bg-gray-200" />
                  <span className={`text-sm flex-grow ${isSelected ? 'text-blue-700 font-semibold' : 'text-gray-600'}`}>{name}</span>
                  {isSelected && <Check size={14} className="text-blue-600" />}
                </label>
              );
            })}
          </div>
        </AccordionItem>

        {/* Categories */}
        <AccordionItem title="CATEGORIES" borderBottom={false}>
          <div className="flex gap-3 text-xs mb-3">
            <button onClick={() => toggleAllCategories(true)} className="text-blue-600 hover:underline">Select All</button>
            <button onClick={() => toggleAllCategories(false)} className="text-red-500 hover:underline">Clear All</button>
          </div>
          <div className="space-y-1">
            {CATEGORY_GROUPS.map(group => {
              const isSelected = filters.selectedCategories.has(group.id);
              return (
                <label key={group.id} className={`flex items-center p-2 rounded-lg cursor-pointer border transition-all ${isSelected ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' : 'bg-white border-transparent hover:bg-gray-50'}`}>
                  <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleCategoryGroup(group.id)} />
                  <div className="w-3 h-3 rounded-full mr-3 shrink-0" style={{ backgroundColor: group.color }}></div>
                  <span className={`text-sm flex-grow ${isSelected ? 'text-blue-700 font-semibold' : 'text-gray-600'}`}>{group.label}</span>
                  {isSelected && <Check size={16} className="text-blue-600" />}
                </label>
              );
            })}
          </div>
        </AccordionItem>
      </div>
    </div>
  );
};

export default Sidebar;
