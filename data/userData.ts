export interface UserProfile {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  sunSign: string;
  moonSign: string;
  ascendant: string;
  currentDasha: string;
}

export const USER_PROFILE: UserProfile = {
  name: "Rahul Sharma",
  birthDate: "15 March 1990",
  birthTime: "14:30 PM",
  birthPlace: "Mumbai, India",
  sunSign: "Pisces ♓",
  moonSign: "Cancer ♋",
  ascendant: "Gemini ♊",
  currentDasha: "Shani Mahadasha"
};

export const updateUserProfile = (updates: Partial<UserProfile>) => {
  Object.assign(USER_PROFILE, updates);
};

export const ZODIAC_SIGNS = [
  "Aries ♈", "Taurus ♉", "Gemini ♊", "Cancer ♋",
  "Leo ♌", "Virgo ♍", "Libra ♎", "Scorpio ♏",
  "Sagittarius ♐", "Capricorn ♑", "Aquarius ♒", "Pisces ♓"
];

export const DASHAS = [
  "Surya (Sun) Mahadasha",
  "Chandra (Moon) Mahadasha",
  "Mangal (Mars) Mahadasha",
  "Rahu Mahadasha",
  "Guru (Jupiter) Mahadasha",
  "Shani (Saturn) Mahadasha",
  "Budh (Mercury) Mahadasha",
  "Ketu Mahadasha",
  "Shukra (Venus) Mahadasha"
];
