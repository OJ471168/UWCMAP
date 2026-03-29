import { CategoryGroup } from "./types";

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'principles',
    label: 'General 3 Principles Understanding',
    color: '#2A81CB',
    items: ['Foundations', 'Key Concepts', 'Getting Started'],
    pinUrl: 'https://vlrbeemaxxdqiczdxomd.supabase.co/storage/v1/object/public/pins/General%203%20Principles%20Understanding.svg'
  },
  {
    id: 'listening',
    label: 'Deep Listening',
    color: '#2AAD27',
    items: ['Presence', 'Understanding', 'Connection'],
    pinUrl: 'https://vlrbeemaxxdqiczdxomd.supabase.co/storage/v1/object/public/pins/Deep%20Listening.svg'
  },
  {
    id: 'communities',
    label: 'Working with Communities',
    color: '#CB8427',
    items: ['Community Support', 'Collective Wellbeing', 'Local Impact'],
    pinUrl: 'https://vlrbeemaxxdqiczdxomd.supabase.co/storage/v1/object/public/pins/Working%20with%20Communities.svg'
  },
  {
    id: 'business',
    label: 'Working with Businesses',
    color: '#CB2B3E',
    items: ['Leadership', 'Workplace Wellbeing', 'Performance'],
    pinUrl: 'https://vlrbeemaxxdqiczdxomd.supabase.co/storage/v1/object/public/pins/Working%20with%20Businesses.svg'
  },
  {
    id: 'schools',
    label: 'Schools & Education',
    color: '#9C2BCB',
    items: ['Students', 'Educators', 'Learning Environments'],
    pinUrl: 'https://vlrbeemaxxdqiczdxomd.supabase.co/storage/v1/object/public/pins/Schools%20&%20Education.svg'
  },
  {
    id: 'corrections',
    label: 'Corrections, Probation & Parole',
    color: '#CAC428',
    items: ['Rehabilitation', 'Staff Support', 'Reintegration'],
    pinUrl: 'https://vlrbeemaxxdqiczdxomd.supabase.co/storage/v1/object/public/pins/Corrections,%20Probation%20&%20Parole.svg'
  },
  {
    id: 'health',
    label: 'Physical Health',
    color: '#20B2AA',
    items: ['General'],
    pinUrl: 'https://vlrbeemaxxdqiczdxomd.supabase.co/storage/v1/object/public/pins/Physical%20Health.svg'
  },
  {
    id: 'books',
    label: 'Book Clubs',
    color: '#FF69B4',
    items: ['General'],
    pinUrl: 'https://vlrbeemaxxdqiczdxomd.supabase.co/storage/v1/object/public/pins/Book%20Clubs.svg'
  }
];

export const CONTINENT_ICONS: Record<string, string> = {
  "europe": "https://pic.onlinewebfonts.com/thumbnails/icons_303482.svg",
  "africa": "https://pic.onlinewebfonts.com/thumbnails/icons_465264.svg",
  "north america": "https://pic.onlinewebfonts.com/thumbnails/icons_465277.svg",
  "south america": "https://pic.onlinewebfonts.com/thumbnails/icons_465278.svg",
  "asia": "https://pic.onlinewebfonts.com/thumbnails/icons_303501.svg",
  "oceania": "https://pic.onlinewebfonts.com/thumbnails/icons_303484.svg"
};

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=random&name=";

export const COUNTRY_CODES: Record<string, string> = {
  "Afghanistan": "af", "Albania": "al", "Algeria": "dz", "Andorra": "ad", "Angola": "ao",
  "Antigua and Barbuda": "ag", "Argentina": "ar", "Armenia": "am", "Australia": "au", "Austria": "at",
  "Azerbaijan": "az", "Bahamas": "bs", "Bahrain": "bh", "Bangladesh": "bd", "Barbados": "bb",
  "Belarus": "by", "Belgium": "be", "Belize": "bz", "Benin": "bj", "Bhutan": "bt", "Bolivia": "bo",
  "Bosnia and Herzegovina": "ba", "Botswana": "bw", "Brazil": "br", "Brunei": "bn", "Bulgaria": "bg",
  "Burkina Faso": "bf", "Burundi": "bi", "Cabo Verde": "cv", "Cambodia": "kh", "Cameroon": "cm",
  "Canada": "ca", "Central African Republic": "cf", "Chad": "td", "Chile": "cl", "China": "cn",
  "Colombia": "co", "Comoros": "km", "Congo": "cg", "Democratic Republic of the Congo": "cd",
  "Costa Rica": "cr", "Croatia": "hr", "Cuba": "cu", "Cyprus": "cy", "Czech Republic": "cz",
  "Denmark": "dk", "Djibouti": "dj", "Dominica": "dm", "Dominican Republic": "do", "Ecuador": "ec",
  "Egypt": "eg", "El Salvador": "sv", "Equatorial Guinea": "gq", "Eritrea": "er", "Estonia": "ee",
  "Eswatini": "sz", "Ethiopia": "et", "Fiji": "fj", "Finland": "fi", "France": "fr", "Gabon": "ga",
  "Gambia": "gm", "Georgia": "ge", "Germany": "de", "Ghana": "gh", "Greece": "gr", "Grenada": "gd",
  "Guatemala": "gt", "Guinea": "gn", "Guinea-Bissau": "gw", "Guyana": "gy", "Haiti": "ht",
  "Honduras": "hn", "Hungary": "hu", "Iceland": "is", "India": "in", "Indonesia": "id", "Iran": "ir",
  "Iraq": "iq", "Ireland": "ie", "Israel": "il", "Italy": "it", "Jamaica": "jm", "Japan": "jp",
  "Jordan": "jo", "Kazakhstan": "kz", "Kenya": "ke", "Kiribati": "ki", "North Korea": "kp",
  "South Korea": "kr", "Kuwait": "kw", "Kyrgyzstan": "kg", "Laos": "la", "Latvia": "lv",
  "Lebanon": "lb", "Lesotho": "ls", "Liberia": "lr", "Libya": "ly", "Liechtenstein": "li",
  "Lithuania": "lt", "Luxembourg": "lu", "Madagascar": "mg", "Malawi": "mw", "Malaysia": "my",
  "Maldives": "mv", "Mali": "ml", "Malta": "mt", "Marshall Islands": "mh", "Mauritania": "mr",
  "Mauritius": "mu", "Mexico": "mx", "Micronesia": "fm", "Moldova": "md", "Monaco": "mc",
  "Mongolia": "mn", "Montenegro": "me", "Morocco": "ma", "Mozambique": "mz", "Myanmar": "mm",
  "Namibia": "na", "Nauru": "nr", "Nepal": "np", "Netherlands": "nl", "New Zealand": "nz",
  "Nicaragua": "ni", "Niger": "ne", "Nigeria": "ng", "North Macedonia": "mk", "Norway": "no",
  "Oman": "om", "Pakistan": "pk", "Palau": "pw", "Panama": "pa", "Papua New Guinea": "pg",
  "Paraguay": "py", "Peru": "pe", "Philippines": "ph", "Poland": "pl", "Portugal": "pt", "Qatar": "qa",
  "Romania": "ro", "Russia": "ru", "Rwanda": "rw", "Saint Kitts and Nevis": "kn", "Saint Lucia": "lc",
  "Saint Vincent and the Grenadines": "vc", "Samoa": "ws", "San Marino": "sm",
  "Sao Tome and Principe": "st", "Saudi Arabia": "sa", "Senegal": "sn", "Serbia": "rs",
  "Seychelles": "sc", "Sierra Leone": "sl", "Singapore": "sg", "Slovakia": "sk", "Slovenia": "si",
  "Solomon Islands": "sb", "Somalia": "so", "South Africa": "za", "South Sudan": "ss", "Spain": "es",
  "Sri Lanka": "lk", "Sudan": "sd", "Suriname": "sr", "Sweden": "se", "Switzerland": "ch",
  "Syria": "sy", "Taiwan": "tw", "Tajikistan": "tj", "Tanzania": "tz", "Thailand": "th",
  "Timor-Leste": "tl", "Togo": "tg", "Tonga": "to", "Trinidad and Tobago": "tt", "Tunisia": "tn",
  "Turkey": "tr", "Turkmenistan": "tm", "Tuvalu": "tv", "Uganda": "ug", "Ukraine": "ua",
  "United Arab Emirates": "ae", "United Kingdom": "gb", "United States": "us", "Uruguay": "uy",
  "Uzbekistan": "uz", "Vanuatu": "vu", "Vatican City": "va", "Venezuela": "ve", "Vietnam": "vn",
  "Yemen": "ye", "Zambia": "zm", "Zimbabwe": "zw",
  "USA": "us", "United States of America": "us", "US": "us",
  "UK": "gb", "Great Britain": "gb", "Britain": "gb",
  "UAE": "ae",
  "Korea": "kr", "Republic of Korea": "kr",
  "Ivory Coast": "ci", "Cote d'Ivoire": "ci",
  "Swaziland": "sz",
  "Czechia": "cz",
  "Scotland": "gb-sct", "Wales": "gb-wls", "England": "gb-eng",
  "Hong Kong": "hk", "Macau": "mo",
  "Palestine": "ps", "State of Palestine": "ps"
};

export const getCategoryColor = (cat: string) => {
  if (!cat) return '#555';
  const match = CATEGORY_GROUPS.find(g => cat.toLowerCase().includes(g.id) || g.label.toLowerCase().includes(cat.toLowerCase()));
  return match ? match.color : '#555';
};

export const getCategoryPin = (cat: string) => {
  if (!cat) return CATEGORY_GROUPS[0].pinUrl;
  const match = CATEGORY_GROUPS.find(g => cat.toLowerCase().includes(g.id) || g.label.toLowerCase().includes(cat.toLowerCase()));
  return match ? match.pinUrl : CATEGORY_GROUPS[0].pinUrl;
};
