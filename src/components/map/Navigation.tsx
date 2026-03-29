import React from 'react';
import { Link } from 'react-router-dom';
import { ViewMode, FilterState, EventData } from '../../types';
import { CONTINENT_ICONS, COUNTRY_CODES } from '../../constants';
import { Map, Calendar, Heart, HelpCircle, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationProps {
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onToggleHelp: () => void;
  events: EventData[];
}

const Navigation: React.FC<NavigationProps> = ({
  viewMode, setViewMode, filters, setFilters, onToggleHelp, events
}) => {
  const { user } = useAuth();

  const hierarchy = React.useMemo(() => {
    const h: Record<string, Set<string>> = {};
    events.forEach(e => {
      if (e.continent && e.country) {
        const c = e.continent.toLowerCase();
        if (!h[c]) h[c] = new Set();
        h[c].add(e.country);
      }
    });
    return h;
  }, [events]);

  const handleContinentClick = (cont: string) => {
    setFilters(prev => ({ ...prev, selectedContinent: cont, selectedCountry: null }));
  };

  const handleCountryClick = (country: string | null) => {
    setFilters(prev => ({ ...prev, selectedCountry: country }));
  };

  const clearLocation = () => {
    setFilters(prev => ({ ...prev, selectedContinent: null, selectedCountry: null }));
  };

  const getCountryCode = (countryName: string): string | undefined => {
    if (COUNTRY_CODES[countryName]) return COUNTRY_CODES[countryName];
    const lowerName = countryName.toLowerCase();
    const found = Object.keys(COUNTRY_CODES).find(key => key.toLowerCase() === lowerName);
    return found ? COUNTRY_CODES[found] : undefined;
  };

  return (
    <div className="bg-white border-b border-gray-200 z-30 flex-shrink-0 transition-all shadow-sm">
      <div className="flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg font-bold text-sm hover:bg-slate-900 transition-all shadow-sm hover:shadow-md"
            >
              <LayoutDashboard size={16} />
              Manage My Events
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg font-bold text-sm hover:bg-slate-900 transition-all shadow-sm hover:shadow-md"
            >
              <LayoutDashboard size={16} />
              Login to Manage Events
            </Link>
          )}
          <button
            onClick={onToggleHelp}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 font-bold text-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
          >
            <HelpCircle size={18} />
            Help
          </button>
        </div>

        <div className="bg-gray-100 p-1 rounded-lg flex gap-1 border border-gray-200">
          <button
            onClick={() => setFilters(prev => ({ ...prev, showFavoritesOnly: !prev.showFavoritesOnly }))}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              filters.showFavoritesOnly ? 'bg-red-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart size={16} fill={filters.showFavoritesOnly ? "currentColor" : "none"} />
            Saved
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              viewMode === 'map' ? 'bg-indigo-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Map size={16} />
            Map
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
              viewMode === 'list' ? 'bg-indigo-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Calendar size={16} />
            Calendar
          </button>
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out border-t border-transparent ${
        viewMode === 'list' ? 'max-h-80 opacity-100 border-gray-100 py-4' : 'max-h-0 opacity-0'
      }`}>
        <div className="container mx-auto px-6">
          {!filters.selectedContinent ? (
            <div className="flex flex-wrap justify-center gap-3">
              {Object.keys(hierarchy).map(cont => (
                <button
                  key={cont}
                  onClick={() => handleContinentClick(cont)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <img src={CONTINENT_ICONS[cont]} className="w-5 h-5 opacity-70" alt={cont} />
                  {cont.toUpperCase()}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <button onClick={clearLocation} className="text-xs font-semibold text-blue-600 flex items-center gap-1 hover:underline mb-1">
                <ArrowLeft size={12} /> Back to Continents
              </button>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => handleCountryClick(null)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                    filters.selectedCountry === null
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All {filters.selectedContinent.charAt(0).toUpperCase() + filters.selectedContinent.slice(1)}
                </button>
                {Array.from(hierarchy[filters.selectedContinent] || []).sort().map((country: string) => {
                  const code = getCountryCode(country);
                  return (
                    <button
                      key={country}
                      onClick={() => handleCountryClick(country)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                        filters.selectedCountry === country
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-500'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-blue-50'
                      }`}
                    >
                      {code && <img src={`https://flagcdn.com/w20/${code}.png`} className="w-4 h-3 rounded-sm shadow-sm" alt={country} />}
                      {country}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
