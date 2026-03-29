import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { Calendar, BookOpen, User, Shield, Plus, Edit2, Trash2, Eye, EyeOff, Clock, MapPin } from 'lucide-react';

const EventManager: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('events')
      .select('id, title, start_time, end_time, city, country, category, status, is_hidden')
      .eq('organizer', user.id)
      .order('start_time', { ascending: false })
      .then(({ data }) => {
        setEvents(data || []);
        setLoading(false);
      });
  }, [user]);

  const now = new Date();
  const upcoming = events.filter(e => new Date(e.end_time) >= now);
  const past = events.filter(e => new Date(e.end_time) < now);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-700"></div></div>;

  const EventRow: React.FC<{ event: any }> = ({ event }) => (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-all">
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 truncate">{event.title}</h4>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
          <span className="flex items-center gap-1"><Clock size={12} /> {new Date(event.start_time).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> {event.city}, {event.country}</span>
          <span className={`px-2 py-0.5 rounded-full font-semibold ${event.status === 'live' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{event.status || 'draft'}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit2 size={16} /></button>
        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
        <button className="flex items-center gap-2 bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-800 transition-all shadow-md">
          <Plus size={18} /> Create Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Calendar size={48} className="mx-auto mb-4 opacity-50" />
          <p className="font-medium text-lg text-gray-600">No events yet</p>
          <p className="text-sm">Create your first event to get started.</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Upcoming ({upcoming.length})</h3>
              <div className="space-y-3">{upcoming.map(e => <EventRow key={e.id} event={e} />)}</div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Past ({past.length})</h3>
              <div className="space-y-3 opacity-70">{past.map(e => <EventRow key={e.id} event={e} />)}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ResourceManager: React.FC = () => {
  const { profile } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    supabase
      .from('resources')
      .select('id, title, author, category, created_at')
      .eq('author', profile.full_name)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setResources(data || []);
        setLoading(false);
      });
  }, [profile]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-700"></div></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Resources</h2>
        <button className="flex items-center gap-2 bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-800 transition-all shadow-md">
          <Plus size={18} /> Add Resource
        </button>
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
          <p className="font-medium text-lg text-gray-600">No resources yet</p>
          <p className="text-sm">Share your first resource with the community.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map(r => (
            <div key={r.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-all">
              <div>
                <h4 className="font-bold text-gray-900">{r.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{r.category} &bull; {new Date(r.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileEditor: React.FC = () => {
  const { profile, user, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.full_name || '');
  const [title, setTitle] = useState(profile?.title || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '');
      setTitle(profile.title || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').upsert({ id: user.id, full_name: name, title });
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Display Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white transition-all" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Practitioner, Facilitator" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-white transition-all" />
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-brand-700 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-800 transition-all shadow-md disabled:opacity-50">
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

const SuperAdmin: React.FC = () => {
  const { profile } = useAuth();

  if (!profile?.is_super_admin) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Shield size={48} className="mx-auto mb-4 opacity-50" />
        <p className="font-medium text-lg text-gray-600">Access Denied</p>
        <p className="text-sm">You do not have super admin privileges.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Super Admin</h2>
      <p className="text-gray-500">User management and event moderation tools will be available here.</p>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-3xl font-extrabold text-gray-900">--</p>
          <p className="text-sm text-gray-500 mt-1">Total Users</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-3xl font-extrabold text-green-600">--</p>
          <p className="text-sm text-gray-500 mt-1">Active Events</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-3xl font-extrabold text-red-500">--</p>
          <p className="text-sm text-gray-500 mt-1">Blocked Users</p>
        </div>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const location = useLocation();
  const { profile } = useAuth();

  const tabs = [
    { path: '/dashboard', label: 'Events', icon: Calendar },
    { path: '/dashboard/resources', label: 'Resources', icon: BookOpen },
    { path: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  if (profile?.is_super_admin) {
    tabs.push({ path: '/dashboard/admin', label: 'Super Admin', icon: Shield });
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {getGreeting()}, {profile?.full_name || 'there'}
          </h1>
          <p className="text-gray-500 mt-1">Manage your events, resources, and profile.</p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-gray-200 pb-4">
          {tabs.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive(path)
                  ? 'bg-brand-700 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>

        <Routes>
          <Route index element={<EventManager />} />
          <Route path="resources" element={<ResourceManager />} />
          <Route path="profile" element={<ProfileEditor />} />
          <Route path="admin" element={<SuperAdmin />} />
        </Routes>
      </div>
    </div>
  );
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default DashboardPage;
