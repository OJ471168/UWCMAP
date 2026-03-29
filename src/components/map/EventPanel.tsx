import React, { useEffect, useState, useRef } from 'react';
import { EventData } from '../../types';
import { getCategoryColor } from '../../constants';
import { fetchEventDescription } from '../../services/events';
import { X, Calendar, MapPin, Share2, Heart, ExternalLink, CalendarPlus } from 'lucide-react';

interface PanelProps {
  event: EventData | null;
  onClose: () => void;
  isFavorite: boolean;
  toggleFavorite: () => void;
}

const EventPanel: React.FC<PanelProps> = ({ event, onClose, isFavorite, toggleFavorite }) => {
  const [loadingDesc, setLoadingDesc] = useState(false);
  const [fullDesc, setFullDesc] = useState<string | null>(null);
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);
  const calendarMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (event && !event.description) {
      setLoadingDesc(true);
      fetchEventDescription(event.id).then(desc => {
        event.description = desc;
        setFullDesc(desc);
        setLoadingDesc(false);
      });
    } else if (event) {
      setFullDesc(event.description || "No description.");
    }
    setShowCalendarMenu(false);
  }, [event]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarMenuRef.current && !calendarMenuRef.current.contains(event.target as Node)) {
        setShowCalendarMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!event) return null;

  const color = getCategoryColor(event.category);
  const isSameDay = event.start.toDateString() === event.end.toDateString();

  let dateDisplay;
  if (isSameDay) {
    const datePart = event.start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const startStr = event.start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const endStr = event.end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    dateDisplay = (
      <div>
        <span className="font-semibold block text-gray-900">{datePart}</span>
        <span className="text-sm text-gray-500 font-medium">From {startStr} to {endStr}</span>
      </div>
    );
  } else {
    const startStr = event.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    const endStr = event.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    dateDisplay = (
      <div>
        <span className="font-semibold block text-gray-900">{startStr} - {endStr}</span>
      </div>
    );
  }

  const handleShare = () => {
    const url = `${window.location.origin}?event=${event.id}`;
    if (navigator.share) {
      navigator.share({ title: event.title, text: `Check out this event: ${event.title}`, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const generateCalendarUrl = (type: 'google' | 'outlook' | 'yahoo' | 'ics') => {
    const title = encodeURIComponent(event.title);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = fullDesc || "";
    const cleanDesc = encodeURIComponent((tempDiv.textContent || "") + `\n\nLink: ${event.link || ''}`);
    const location = encodeURIComponent(`${event.city}, ${event.country}`);
    const formatTime = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const start = formatTime(event.start);
    const end = formatTime(event.end);

    switch (type) {
      case 'google':
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${start}/${end}&details=${cleanDesc}&location=${location}&text=${title}`;
      case 'outlook':
        return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&startdt=${start}&enddt=${end}&subject=${title}&body=${cleanDesc}&location=${location}`;
      case 'yahoo':
        return `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${title}&st=${start}&et=${end}&desc=${cleanDesc}&in_loc=${location}`;
      case 'ics':
        const icsContent = [
          'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
          `URL:${event.link || ''}`, `DTSTART:${start}`, `DTEND:${end}`,
          `SUMMARY:${event.title}`,
          `DESCRIPTION:${(tempDiv.textContent || "").replace(/\n/g, '\\n')}`,
          `LOCATION:${event.city}, ${event.country}`,
          'END:VEVENT', 'END:VCALENDAR'
        ].join('\n');
        return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
      default: return '#';
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-white overflow-hidden relative">
      <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 backdrop-blur-sm transition-all">
        <X size={24} />
      </button>

      <div className="h-60 w-full bg-gray-900 shrink-0 relative">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-90" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-900 text-white text-6xl opacity-50">📅</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <span className="inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2" style={{ backgroundColor: color }}>{event.category}</span>
          <h2 className="text-2xl font-bold leading-snug">{event.title}</h2>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
        <div className="flex flex-wrap items-center justify-between mb-8 gap-3">
          <div className="flex gap-2">
            <button onClick={handleShare} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors" title="Share">
              <Share2 size={18} className="text-gray-700" />
            </button>
            <button onClick={toggleFavorite} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isFavorite ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} title="Favorite">
              <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="flex gap-2">
            <div className="relative" ref={calendarMenuRef}>
              <button onClick={() => setShowCalendarMenu(!showCalendarMenu)} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
                <CalendarPlus size={16} /> Add to Calendar
              </button>
              {showCalendarMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="p-1">
                    <a href={generateCalendarUrl('google')} target="_blank" rel="noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg">Google Calendar</a>
                    <a href={generateCalendarUrl('ics')} download={`${event.title}.ics`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg">Apple Calendar</a>
                    <a href={generateCalendarUrl('outlook')} target="_blank" rel="noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg">Outlook</a>
                    <a href={generateCalendarUrl('yahoo')} target="_blank" rel="noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg">Yahoo</a>
                  </div>
                </div>
              )}
            </div>
            {event.link && (
              <a href={event.link} target="_blank" rel="noreferrer" className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md">
                More Details <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
          <img src={event.organizerAvatar} className="w-12 h-12 rounded-full border border-gray-200" alt="Org" />
          <div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wide">Facilitated By</div>
            <div className="text-lg font-bold text-gray-800">{event.organizer}</div>
          </div>
        </div>

        {event.coFacilitators.length > 0 && (
          <div className="mb-8">
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-3">Co-Facilitators</div>
            <div className="flex flex-wrap gap-2">
              {event.coFacilitators.map((cf, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
                  <img src={cf.avatar} className="w-5 h-5 rounded-full" alt="" />
                  <span className="text-xs font-semibold text-gray-700">{cf.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4 mb-8 text-gray-700">
          <div className="flex items-start gap-3">
            <Calendar className="text-gray-400 shrink-0 mt-0.5" size={20} />
            {dateDisplay}
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="text-gray-400 shrink-0 mt-0.5" size={20} />
            <div>
              <span className="font-semibold block text-gray-900">{event.city}, {event.country}</span>
              <span className="text-sm text-gray-500">{event.locationType} &bull; {event.format}</span>
            </div>
          </div>
        </div>

        <div className="prose prose-sm prose-blue text-gray-600 leading-relaxed">
          {loadingDesc ? (
            <div className="flex flex-col items-center py-8 opacity-50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
              Loading details...
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: fullDesc?.replace(/\n/g, '<br/>') || '' }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPanel;
