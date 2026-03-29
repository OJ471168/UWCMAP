export interface Facilitator {
  name: string;
  avatar: string;
  id?: string;
  isRegistered?: boolean;
}

export interface SupabaseProfile {
  full_name: string;
  avatar_url: string;
  is_blocked: boolean;
}

export interface SupabaseEvent {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  lat: number | null;
  lng: number | null;
  category: string;
  subcategory: string;
  location_type: string;
  format: string;
  link: string;
  city: string;
  country: string;
  continent: string;
  image_url: string;
  organizer: string;
  description?: string;
  co_facilitators: any[];
  profiles?: SupabaseProfile;
  status?: string;
}

export interface EventData {
  id: number;
  title: string;
  start: Date;
  end: Date;
  lat: number | null;
  lng: number | null;
  category: string;
  subcategory: string;
  locationType: string;
  format: string;
  link: string;
  city: string;
  country: string;
  continent: string;
  imageUrl: string;
  organizer: string;
  organizerAvatar: string;
  organizerIsRegistered: boolean;
  coFacilitators: Facilitator[];
  description?: string;
}

export interface FilterState {
  searchTerm: string;
  year: number;
  selectedMonths: Set<string>;
  selectedCategories: Set<string>;
  selectedOrganizers: Set<string>;
  selectedContinent: string | null;
  selectedCountry: string | null;
  radius: number;
  userLocation: { lat: number; lng: number } | null;
  showFavoritesOnly: boolean;
}

export type ViewMode = 'map' | 'list';

export interface CategoryGroup {
  id: string;
  label: string;
  color: string;
  items: string[];
  pinUrl: string;
}
