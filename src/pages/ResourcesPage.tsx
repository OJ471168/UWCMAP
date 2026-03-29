import React, { useState, useEffect, useCallback } from 'react';
import { fetchResources, fetchResourceCategories, fetchResourceAuthors, Resource } from '../services/resources';
import { Search, Heart, X, User as UserIcon } from 'lucide-react';

const SKELETON_COUNT = 8;

const SkeletonCard: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
    <div className="h-44 bg-gray-200 animate-pulse"></div>
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded animate-pulse w-2/5"></div>
      <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
      <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5"></div>
      <div className="h-10 bg-gray-200 rounded-lg animate-pulse mt-4"></div>
    </div>
  </div>
);

const ResourceModal: React.FC<{ resource: Resource | null; onClose: () => void }> = ({ resource, onClose }) => {
  if (!resource) return null;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleEsc); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl custom-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 bg-white/90 rounded-full w-9 h-9 flex items-center justify-center text-gray-800 font-bold shadow-md hover:bg-gray-100 z-10">
          <X size={20} />
        </button>
        {resource.image_url ? (
          <img src={resource.image_url} className="w-full h-60 object-cover" alt={resource.title} />
        ) : (
          <div className="w-full h-60 bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center text-accent text-xl font-bold">Resource Details</div>
        )}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{resource.title}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-200">
            {resource.category && <span className="bg-gray-100 px-3 py-1 rounded-md font-semibold text-brand-500 text-xs">{resource.category}</span>}
            <span>By <strong>{resource.author || 'Unknown'}</strong></span>
          </div>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-8">{resource.description || 'No detailed description provided.'}</p>
          {resource.link && (
            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="inline-block bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md">
              Access Full Resource Here
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [allAuthors, setAllAuthors] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [showingSaved, setShowingSaved] = useState(false);
  const [titleSearch, setTitleSearch] = useState('');
  const [authorSearch, setAuthorSearch] = useState('');
  const [authorSuggestions, setAuthorSuggestions] = useState<string[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('upwc_saved_resources') || '[]').map(String);
  });

  useEffect(() => {
    fetchResourceCategories().then(setCategories);
    fetchResourceAuthors().then(setAllAuthors);
  }, []);

  const loadResources = useCallback(async () => {
    setLoading(true);
    try {
      if (showingSaved) {
        if (savedIds.length === 0) { setResources([]); setLoading(false); return; }
        const data = await fetchResources({ ids: savedIds });
        setResources(data);
      } else {
        const data = await fetchResources({
          category: activeCategory || undefined,
          titleSearch: titleSearch || undefined,
          authorSearch: authorSearch || undefined,
        });
        setResources(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [activeCategory, titleSearch, authorSearch, showingSaved, savedIds]);

  useEffect(() => { loadResources(); }, [loadResources]);

  const toggleSave = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const idStr = String(id);
    let newSaved: string[];
    if (savedIds.includes(idStr)) {
      newSaved = savedIds.filter(s => s !== idStr);
    } else {
      newSaved = [...savedIds, idStr];
    }
    setSavedIds(newSaved);
    localStorage.setItem('upwc_saved_resources', JSON.stringify(newSaved));
  };

  const handleAuthorInput = (val: string) => {
    setAuthorSearch(val);
    if (val.length > 0) {
      setAuthorSuggestions(allAuthors.filter(a => a.toLowerCase().includes(val.toLowerCase())));
    } else {
      setAuthorSuggestions([]);
    }
  };

  const clearFilters = () => {
    setTitleSearch('');
    setAuthorSearch('');
    setAuthorSuggestions([]);
    setActiveCategory('');
    setShowingSaved(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-br from-blue-50 to-white border-b border-gray-200 py-16 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-brand-500 rounded-full text-xs font-bold uppercase tracking-wider mb-4">Knowledge Hub</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">Resources Library</h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-lg">Explore our curated collection of insights, tools, and practitioner materials designed to support your journey and understanding of the Three Principles.</p>
          </div>
          <div className="flex-shrink-0 w-full md:w-[400px] h-64 rounded-2xl overflow-hidden shadow-lg">
            <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Library" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={() => { setActiveCategory(''); setShowingSaved(false); }} className={`px-5 py-2.5 rounded-full font-semibold text-sm border transition-all ${!activeCategory && !showingSaved ? 'bg-accent text-white border-accent shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
            All Categories
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => { setActiveCategory(cat); setShowingSaved(false); }} className={`px-5 py-2.5 rounded-full font-semibold text-sm border transition-all ${activeCategory === cat && !showingSaved ? 'bg-accent text-white border-accent shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
              {cat}
            </button>
          ))}
          <button onClick={() => { setShowingSaved(true); setActiveCategory(''); }} className={`px-5 py-2.5 rounded-full font-semibold text-sm border transition-all flex items-center gap-2 ${showingSaved ? 'bg-red-500 text-white border-red-500 shadow-md' : 'bg-white text-red-400 border-red-200 hover:bg-red-50'}`}>
            <Heart size={14} fill={showingSaved ? "currentColor" : "none"} /> Saved
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center mb-10">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={titleSearch} onChange={(e) => setTitleSearch(e.target.value)} placeholder="Search by Title..." className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white transition-all" />
          </div>
          <div className="flex-1 min-w-[200px] relative">
            <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={authorSearch} onChange={(e) => handleAuthorInput(e.target.value)} placeholder="Search by Author..." autoComplete="off" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white transition-all" />
            {authorSuggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 mt-1 max-h-60 overflow-y-auto p-2">
                {authorSuggestions.map(a => (
                  <li key={a} onClick={() => { setAuthorSearch(a); setAuthorSuggestions([]); }} className="px-4 py-2.5 rounded-lg cursor-pointer text-sm text-gray-700 hover:bg-blue-50 hover:text-brand-500 flex items-center gap-2">
                    <UserIcon size={14} className="text-gray-400" /> {a}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button onClick={clearFilters} className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-brand-500 hover:bg-blue-50 transition-all">
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {loading ? (
            Array.from({ length: SKELETON_COUNT }).map((_, i) => <SkeletonCard key={i} />)
          ) : resources.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">😔</div>
              <h2 className="text-xl font-bold text-gray-700 mb-2">No resources found</h2>
              <p className="text-sm">{showingSaved ? "You haven't saved any resources yet. Click the heart icon to save one!" : "Try adjusting your search terms or clearing the filters."}</p>
            </div>
          ) : (
            resources.map(resource => {
              const isSaved = savedIds.includes(String(resource.id));
              return (
                <div key={resource.id} onClick={() => setSelectedResource(resource)} className="bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col">
                  <div className="relative h-44 bg-gradient-to-br from-blue-50 to-gray-100 border-b border-gray-200">
                    {resource.image_url ? (
                      <img src={resource.image_url} alt={resource.title} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent font-bold text-lg opacity-80">Resource</span>
                    )}
                    {resource.category && <span className="absolute top-3 left-3 bg-white/95 text-brand-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">{resource.category}</span>}
                    <button onClick={(e) => toggleSave(resource.id, e)} className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${isSaved ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-500'}`}>
                      <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">{resource.title}</h3>
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
                      <UserIcon size={12} /> <strong>{resource.author || 'Unknown'}</strong>
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed flex-grow mb-4">{resource.description ? resource.description.substring(0, 100) + '...' : 'No description provided.'}</p>
                    <div className="bg-accent hover:bg-accent-hover text-white text-center py-2.5 rounded-lg font-bold text-sm transition-all mt-auto">View Details</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <ResourceModal resource={selectedResource} onClose={() => setSelectedResource(null)} />
    </div>
  );
};

export default ResourcesPage;
