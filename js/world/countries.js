const COUNTRIES_VERSION = 1;

const COUNTRIES = {
  BRA: {
    id: "BRA",
    code: "BR",
    name: "Brasil",
    shortName: "Brasil",
    continent: "South America",
    region: "South America",
    currency: "BRL",
    currencySymbol: "R$",
    language: "pt-BR",
    nationality: "Brasileiro",
    timezone: "America/Sao_Paulo",
    mmaLevel: 78,
    marketLevel: 72,
    popularity: 82,
    fightCulture: 95,
    active: true
  },

  USA: {
    id: "USA",
    code: "US",
    name: "Estados Unidos",
    shortName: "EUA",
    continent: "North America",
    region: "North America",
    currency: "USD",
    currencySymbol: "$",
    language: "en-US",
    nationality: "Americano",
    timezone: "America/New_York",
    mmaLevel: 100,
    marketLevel: 100,
    popularity: 100,
    fightCulture: 95,
    active: true
  },

  CAN: {
    id: "CAN",
    code: "CA",
    name: "Canadá",
    shortName: "Canadá",
    continent: "North America",
    region: "North America",
    currency: "CAD",
    currencySymbol: "C$",
    language: "en-CA",
    nationality: "Canadense",
    timezone: "America/Toronto",
    mmaLevel: 82,
    marketLevel: 78,
    popularity: 75,
    fightCulture: 78,
    active: true
  },

  MEX: {
    id: "MEX",
    code: "MX",
    name: "México",
    shortName: "México",
    continent: "North America",
    region: "Latin America",
    currency: "MXN",
    currencySymbol: "$",
    language: "es-MX",
    nationality: "Mexicano",
    timezone: "America/Mexico_City",
    mmaLevel: 78,
    marketLevel: 72,
    popularity: 80,
    fightCulture: 92,
    active: true
  },

  ARG: {
    id: "ARG",
    code: "AR",
    name: "Argentina",
    shortName: "Argentina",
    continent: "South America",
    region: "South America",
    currency: "ARS",
    currencySymbol: "$",
    language: "es-AR",
    nationality: "Argentino",
    timezone: "America/Argentina/Buenos_Aires",
    mmaLevel: 58,
    marketLevel: 62,
    popularity: 64,
    fightCulture: 72,
    active: true
  },

  CHL: {
    id: "CHL",
    code: "CL",
    name: "Chile",
    shortName: "Chile",
    continent: "South America",
    region: "South America",
    currency: "CLP",
    currencySymbol: "$",
    language: "es-CL",
    nationality: "Chileno",
    timezone: "America/Santiago",
    mmaLevel: 55,
    marketLevel: 58,
    popularity: 60,
    fightCulture: 68,
    active: true
  },

  COL: {
    id: "COL",
    code: "CO",
    name: "Colômbia",
    shortName: "Colômbia",
    continent: "South America",
    region: "South America",
    currency: "COP",
    currencySymbol: "$",
    language: "es-CO",
    nationality: "Colombiano",
    timezone: "America/Bogota",
    mmaLevel: 60,
    marketLevel: 58,
    popularity: 62,
    fightCulture: 72,
    active: true
  },

  PER: {
    id: "PER",
    code: "PE",
    name: "Peru",
    shortName: "Peru",
    continent: "South America",
    region: "South America",
    currency: "PEN",
    currencySymbol: "S/",
    language: "es-PE",
    nationality: "Peruano",
    timezone: "America/Lima",
    mmaLevel: 55,
    marketLevel: 52,
    popularity: 58,
    fightCulture: 68,
    active: true
  },

  URY: {
    id: "URY",
    code: "UY",
    name: "Uruguai",
    shortName: "Uruguai",
    continent: "South America",
    region: "South America",
    currency: "UYU",
    currencySymbol: "$U",
    language: "es-UY",
    nationality: "Uruguaio",
    timezone: "America/Montevideo",
    mmaLevel: 48,
    marketLevel: 48,
    popularity: 48,
    fightCulture: 60,
    active: true
  },

  PRY: {
    id: "PRY",
    code: "PY",
    name: "Paraguai",
    shortName: "Paraguai",
    continent: "South America",
    region: "South America",
    currency: "PYG",
    currencySymbol: "₲",
    language: "es-PY",
    nationality: "Paraguaio",
    timezone: "America/Asuncion",
    mmaLevel: 48,
    marketLevel: 44,
    popularity: 45,
    fightCulture: 62,
    active: true
  },

  BOL: {
    id: "BOL",
    code: "BO",
    name: "Bolívia",
    shortName: "Bolívia",
    continent: "South America",
    region: "South America",
    currency: "BOB",
    currencySymbol: "Bs.",
    language: "es-BO",
    nationality: "Boliviano",
    timezone: "America/La_Paz",
    mmaLevel: 42,
    marketLevel: 38,
    popularity: 42,
    fightCulture: 58,
    active: true
  },

  ECU: {
    id: "ECU",
    code: "EC",
    name: "Equador",
    shortName: "Equador",
    continent: "South America",
    region: "South America",
    currency: "USD",
    currencySymbol: "$",
    language: "es-EC",
    nationality: "Equatoriano",
    timezone: "America/Guayaquil",
    mmaLevel: 48,
    marketLevel: 44,
    popularity: 48,
    fightCulture: 62,
    active: true
  },

  VEN: {
    id: "VEN",
    code: "VE",
    name: "Venezuela",
    shortName: "Venezuela",
    continent: "South America",
    region: "South America",
    currency: "VES",
    currencySymbol: "Bs.",
    language: "es-VE",
    nationality: "Venezuelano",
    timezone: "America/Caracas",
    mmaLevel: 50,
    marketLevel: 40,
    popularity: 48,
    fightCulture: 65,
    active: true
  },

  CUB: {
    id: "CUB",
    code: "CU",
    name: "Cuba",
    shortName: "Cuba",
    continent: "North America",
    region: "Caribbean",
    currency: "CUP",
    currencySymbol: "$",
    language: "es-CU",
    nationality: "Cubano",
    timezone: "America/Havana",
    mmaLevel: 45,
    marketLevel: 32,
    popularity: 40,
    fightCulture: 80,
    active: true
  },

  DOM: {
    id: "DOM",
    code: "DO",
    name: "República Dominicana",
    shortName: "Rep. Dominicana",
    continent: "North America",
    region: "Caribbean",
    currency: "DOP",
    currencySymbol: "RD$",
    language: "es-DO",
    nationality: "Dominicano",
    timezone: "America/Santo_Domingo",
    mmaLevel: 42,
    marketLevel: 40,
    popularity: 45,
    fightCulture: 65,
    active: true
  },

  PRI: {
    id: "PRI",
    code: "PR",
    name: "Porto Rico",
    shortName: "Porto Rico",
    continent: "North America",
    region: "Caribbean",
    currency: "USD",
    currencySymbol: "$",
    language: "es-PR",
    nationality: "Porto-riquenho",
    timezone: "America/Puerto_Rico",
    mmaLevel: 60,
    marketLevel: 62,
    popularity: 64,
    fightCulture: 80,
    active: true
  },

  GBR: {
    id: "GBR",
    code: "GB",
    name: "Reino Unido",
    shortName: "Reino Unido",
    continent: "Europe",
    region: "Western Europe",
    currency: "GBP",
    currencySymbol: "£",
    language: "en-GB",
    nationality: "Britânico",
    timezone: "Europe/London",
    mmaLevel: 88,
    marketLevel: 90,
    popularity: 85,
    fightCulture: 88,
    active: true
  },

  IRL: {
    id: "IRL",
    code: "IE",
    name: "Irlanda",
    shortName: "Irlanda",
    continent: "Europe",
    region: "Western Europe",
    currency: "EUR",
    currencySymbol: "€",
    language: "en-IE",
    nationality: "Irlandês",
    timezone: "Europe/Dublin",
    mmaLevel: 80,
    marketLevel: 72,
    popularity: 78,
    fightCulture: 90,
    active: true
  },

  FRA: {
    id: "FRA",
    code: "FR",
    name: "França",
    shortName: "França",
    continent: "Europe",
    region: "Western Europe",
    currency: "EUR",
    currencySymbol: "€",
    language: "fr-FR",
    nationality: "Francês",
    timezone: "Europe/Paris",
    mmaLevel: 84,
    marketLevel: 86,
    popularity: 82,
    fightCulture: 78,
    active: true
  },

  DEU: {
    id: "DEU",
    code: "DE",
    name: "Alemanha",
    shortName: "Alemanha",
    continent: "Europe",
    region: "Central Europe",
    currency: "EUR",
    currencySymbol: "€",
    language: "de-DE",
    nationality: "Alemão",
    timezone: "Europe/Berlin",
    mmaLevel: 70,
    marketLevel: 80,
    popularity: 72,
    fightCulture: 68,
    active: true
  },

  ESP: {
    id: "ESP",
    code: "ES",
    name: "Espanha",
    shortName: "Espanha",
    continent: "Europe",
    region: "Southern Europe",
    currency: "EUR",
    currencySymbol: "€",
    language: "es-ES",
    nationality: "Espanhol",
    timezone: "Europe/Madrid",
    mmaLevel: 74,
    marketLevel: 78,
    popularity: 75,
    fightCulture: 70,
    active: true
  },

  ITA: {
    id: "ITA",
    code: "IT",
    name: "Itália",
    shortName: "Itália",
    continent: "Europe",
    region: "Southern Europe",
    currency: "EUR",
    currencySymbol: "€",
    language: "it-IT",
    nationality: "Italiano",
    timezone: "Europe/Rome",
    mmaLevel: 68,
    marketLevel: 75,
    popularity: 68,
    fightCulture: 65,
    active: true
  },

  NLD: {
    id: "NLD",
    code: "NL",
    name: "Países Baixos",
    shortName: "Holanda",
    continent: "Europe",
    region: "Western Europe",
    currency: "EUR",
    currencySymbol: "€",
    language: "nl-NL",
    nationality: "Neerlandês",
    timezone: "Europe/Amsterdam",
    mmaLevel: 82,
    marketLevel: 75,
    popularity: 76,
    fightCulture: 90,
    active: true
  },

  POL: {
    id: "POL",
    code: "PL",
    name: "Polônia",
    shortName: "Polônia",
    continent: "Europe",
    region: "Eastern Europe",
    currency: "PLN",
    currencySymbol: "zł",
    language: "pl-PL",
    nationality: "Polonês",
    timezone: "Europe/Warsaw",
    mmaLevel: 80,
    marketLevel: 68,
    popularity: 76,
    fightCulture: 88,
    active: true
  },

  CZE: {
    id: "CZE",
    code: "CZ",
    name: "República Tcheca",
    shortName: "Tchéquia",
    continent: "Europe",
    region: "Central Europe",
    currency: "CZK",
    currencySymbol: "Kč",
    language: "cs-CZ",
    nationality: "Tcheco",
    timezone: "Europe/Prague",
    mmaLevel: 72,
    marketLevel: 58,
    popularity: 68,
    fightCulture: 78,
    active: true
  },

  SWE: {
    id: "SWE",
    code: "SE",
    name: "Suécia",
    shortName: "Suécia",
    continent: "Europe",
    region: "Northern Europe",
    currency: "SEK",
    currencySymbol: "kr",
    language: "sv-SE",
    nationality: "Sueco",
    timezone: "Europe/Stockholm",
    mmaLevel: 75,
    marketLevel: 70,
    popularity: 72,
    fightCulture: 74,
    active: true
  },

  NOR: {
    id: "NOR",
    code: "NO",
    name: "Noruega",
    shortName: "Noruega",
    continent: "Europe",
    region: "Northern Europe",
    currency: "NOK",
    currencySymbol: "kr",
    language: "nb-NO",
    nationality: "Norueguês",
    timezone: "Europe/Oslo",
    mmaLevel: 65,
    marketLevel: 68,
    popularity: 65,
    fightCulture: 70,
    active: true
  },

  DNK: {
    id: "DNK",
    code: "DK",
    name: "Dinamarca",
    shortName: "Dinamarca",
    continent: "Europe",
    region: "Northern Europe",
    currency: "DKK",
    currencySymbol: "kr",
    language: "da-DK",
    nationality: "Dinamarquês",
    timezone: "Europe/Copenhagen",
    mmaLevel: 65,
    marketLevel: 68,
    popularity: 64,
    fightCulture: 68,
    active: true
  },

  FIN: {
    id: "FIN",
    code: "FI",
    name: "Finlândia",
    shortName: "Finlândia",
    continent: "Europe",
    region: "Northern Europe",
    currency: "EUR",
    currencySymbol: "€",
    language: "fi-FI",
    nationality: "Finlandês",
    timezone: "Europe/Helsinki",
    mmaLevel: 60,
    marketLevel: 62,
    popularity: 58,
    fightCulture: 62,
    active: true
  },

  RUS: {
    id: "RUS",
    code: "RU",
    name: "Rússia",
    shortName: "Rússia",
    continent: "Europe",
    region: "Eastern Europe",
    currency: "RUB",
    currencySymbol: "₽",
    language: "ru-RU",
    nationality: "Russo",
    timezone: "Europe/Moscow",
    mmaLevel: 94,
    marketLevel: 80,
    popularity: 88,
    fightCulture: 98,
    active: true
  },

  UKR: {
    id: "UKR",
    code: "UA",
    name: "Ucrânia",
    shortName: "Ucrânia",
    continent: "Europe",
    region: "Eastern Europe",
    currency: "UAH",
    currencySymbol: "₴",
    language: "uk-UA",
    nationality: "Ucraniano",
    timezone: "Europe/Kyiv",
    mmaLevel: 70,
    marketLevel: 50,
    popularity: 66,
    fightCulture: 82,
    active: true
  },

  GEO: {
    id: "GEO",
    code: "GE",
    name: "Geórgia",
    shortName: "Geórgia",
    continent: "Asia",
    region: "Caucasus",
    currency: "GEL",
    currencySymbol: "₾",
    language: "ka-GE",
    nationality: "Georgiano",
    timezone: "Asia/Tbilisi",
    mmaLevel: 88,
    marketLevel: 55,
    popularity: 72,
    fightCulture: 98,
    active: true
  },

  ARM: {
    id: "ARM",
    code: "AM",
    name: "Armênia",
    shortName: "Armênia",
    continent: "Asia",
    region: "Caucasus",
    currency: "AMD",
    currencySymbol: "֏",
    language: "hy-AM",
    nationality: "Armênio",
    timezone: "Asia/Yerevan",
    mmaLevel: 72,
    marketLevel: 48,
    popularity: 60,
    fightCulture: 88,
    active: true
  },

  TUR: {
    id: "TUR",
    code: "TR",
    name: "Turquia",
    shortName: "Turquia",
    continent: "Europe",
    region: "Western Asia",
    currency: "TRY",
    currencySymbol: "₺",
    language: "tr-TR",
    nationality: "Turco",
    timezone: "Europe/Istanbul",
    mmaLevel: 62,
    marketLevel: 65,
    popularity: 68,
    fightCulture: 78,
    active: true
  },

  ISR: {
    id: "ISR",
    code: "IL",
    name: "Israel",
    shortName: "Israel",
    continent: "Asia",
    region: "Middle East",
    currency: "ILS",
    currencySymbol: "₪",
    language: "he-IL",
    nationality: "Israelense",
    timezone: "Asia/Jerusalem",
    mmaLevel: 65,
    marketLevel: 68,
    popularity: 65,
    fightCulture: 72,
    active: true
  },

  ARE: {
    id: "ARE",
    code: "AE",
    name: "Emirados Árabes Unidos",
    shortName: "EAU",
    continent: "Asia",
    region: "Middle East",
    currency: "AED",
    currencySymbol: "د.إ",
    language: "ar-AE",
    nationality: "Emiratense",
    timezone: "Asia/Dubai",
    mmaLevel: 62,
    marketLevel: 88,
    popularity: 76,
    fightCulture: 68,
    active: true
  },

  SAU: {
    id: "SAU",
    code: "SA",
    name: "Arábia Saudita",
    shortName: "Arábia Saudita",
    continent: "Asia",
    region: "Middle East",
    currency: "SAR",
    currencySymbol: "﷼",
    language: "ar-SA",
    nationality: "Saudita",
    timezone: "Asia/Riyadh",
    mmaLevel: 55,
    marketLevel: 90,
    popularity: 72,
    fightCulture: 70,
    active: true
  },

  QAT: {
    id: "QAT",
    code: "QA",
    name: "Catar",
    shortName: "Catar",
    continent: "Asia",
    region: "Middle East",
    currency: "QAR",
    currencySymbol: "﷼",
    language: "ar-QA",
    nationality: "Catariano",
    timezone: "Asia/Qatar",
    mmaLevel: 50,
    marketLevel: 80,
    popularity: 62,
    fightCulture: 62,
    active: true
  },

  JPN: {
    id: "JPN",
    code: "JP",
    name: "Japão",
    shortName: "Japão",
    continent: "Asia",
    region: "East Asia",
    currency: "JPY",
    currencySymbol: "¥",
    language: "ja-JP",
    nationality: "Japonês",
    timezone: "Asia/Tokyo",
    mmaLevel: 90,
    marketLevel: 90,
    popularity: 92,
    fightCulture: 98,
    active: true
  },

  KOR: {
    id: "KOR",
    code: "KR",
    name: "Coreia do Sul",
    shortName: "Coreia do Sul",
    continent: "Asia",
    region: "East Asia",
    currency: "KRW",
    currencySymbol: "₩",
    language: "ko-KR",
    nationality: "Sul-coreano",
    timezone: "Asia/Seoul",
    mmaLevel: 70,
    marketLevel: 82,
    popularity: 76,
    fightCulture: 78,
    active: true
  },

  CHN: {
    id: "CHN",
    code: "CN",
    name: "China",
    shortName: "China",
    continent: "Asia",
    region: "East Asia",
    currency: "CNY",
    currencySymbol: "¥",
    language: "zh-CN",
    nationality: "Chinês",
    timezone: "Asia/Shanghai",
    mmaLevel: 62,
    marketLevel: 96,
    popularity: 70,
    fightCulture: 65,
    active: true
  },

  THA: {
    id: "THA",
    code: "TH",
    name: "Tailândia",
    shortName: "Tailândia",
    continent: "Asia",
    region: "Southeast Asia",
    currency: "THB",
    currencySymbol: "฿",
    language: "th-TH",
    nationality: "Tailandês",
    timezone: "Asia/Bangkok",
    mmaLevel: 82,
    marketLevel: 70,
    popularity: 82,
    fightCulture: 100,
    active: true
  },

  PHL: {
    id: "PHL",
    code: "PH",
    name: "Filipinas",
    shortName: "Filipinas",
    continent: "Asia",
    region: "Southeast Asia",
    currency: "PHP",
    currencySymbol: "₱",
    language: "en-PH",
    nationality: "Filipino",
    timezone: "Asia/Manila",
    mmaLevel: 70,
    marketLevel: 68,
    popularity: 78,
    fightCulture: 85,
    active: true
  },

  IDN: {
    id: "IDN",
    code: "ID",
    name: "Indonésia",
    shortName: "Indonésia",
    continent: "Asia",
    region: "Southeast Asia",
    currency: "IDR",
    currencySymbol: "Rp",
    language: "id-ID",
    nationality: "Indonésio",
    timezone: "Asia/Jakarta",
    mmaLevel: 62,
    marketLevel: 75,
    popularity: 70,
    fightCulture: 76,
    active: true
  },

  IND: {
    id: "IND",
    code: "IN",
    name: "Índia",
    shortName: "Índia",
    continent: "Asia",
    region: "South Asia",
    currency: "INR",
    currencySymbol: "₹",
    language: "hi-IN",
    nationality: "Indiano",
    timezone: "Asia/Kolkata",
    mmaLevel: 52,
    marketLevel: 95,
    popularity: 62,
    fightCulture: 70,
    active: true
  },

  AUS: {
    id: "AUS",
    code: "AU",
    name: "Austrália",
    shortName: "Austrália",
    continent: "Oceania",
    region: "Oceania",
    currency: "AUD",
    currencySymbol: "A$",
    language: "en-AU",
    nationality: "Australiano",
    timezone: "Australia/Sydney",
    mmaLevel: 88,
    marketLevel: 85,
    popularity: 88,
    fightCulture: 92,
    active: true
  },

  NZL: {
    id: "NZL",
    code: "NZ",
    name: "Nova Zelândia",
    shortName: "Nova Zelândia",
    continent: "Oceania",
    region: "Oceania",
    currency: "NZD",
    currencySymbol: "NZ$",
    language: "en-NZ",
    nationality: "Neozelandês",
    timezone: "Pacific/Auckland",
    mmaLevel: 82,
    marketLevel: 72,
    popularity: 75,
    fightCulture: 90,
    active: true
  },

  ZAF: {
    id: "ZAF",
    code: "ZA",
    name: "África do Sul",
    shortName: "África do Sul",
    continent: "Africa",
    region: "Southern Africa",
    currency: "ZAR",
    currencySymbol: "R",
    language: "en-ZA",
    nationality: "Sul-africano",
    timezone: "Africa/Johannesburg",
    mmaLevel: 68,
    marketLevel: 62,
    popularity: 65,
    fightCulture: 78,
    active: true
  },

  NGA: {
    id: "NGA",
    code: "NG",
    name: "Nigéria",
    shortName: "Nigéria",
    continent: "Africa",
    region: "West Africa",
    currency: "NGN",
    currencySymbol: "₦",
    language: "en-NG",
    nationality: "Nigeriano",
    timezone: "Africa/Lagos",
    mmaLevel: 62,
    marketLevel: 70,
    popularity: 65,
    fightCulture: 75,
    active: true
  },

  EGY: {
    id: "EGY",
    code: "EG",
    name: "Egito",
    shortName: "Egito",
    continent: "Africa",
    region: "North Africa",
    currency: "EGP",
    currencySymbol: "£",
    language: "ar-EG",
    nationality: "Egípcio",
    timezone: "Africa/Cairo",
    mmaLevel: 55,
    marketLevel: 60,
    popularity: 60,
    fightCulture: 70,
    active: true
  },

  MAR: {
    id: "MAR",
    code: "MA",
    name: "Marrocos",
    shortName: "Marrocos",
    continent: "Africa",
    region: "North Africa",
    currency: "MAD",
    currencySymbol: "د.م.",
    language: "ar-MA",
    nationality: "Marroquino",
    timezone: "Africa/Casablanca",
    mmaLevel: 62,
    marketLevel: 62,
    popularity: 65,
    fightCulture: 72,
    active: true
  }
};

// ============================================================
// HELPERS
// ============================================================

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeId(value) {
  if (!value) {
    return null;
  }

  const string = String(value).trim();

  if (COUNTRIES[string]) {
    return string;
  }

  const upper = string.toUpperCase();

  if (COUNTRIES[upper]) {
    return upper;
  }

  const found = Object.values(COUNTRIES).find(
    country =>
      country.code.toUpperCase() === upper ||
      country.name.toLowerCase() ===
        string.toLowerCase() ||
      country.shortName.toLowerCase() ===
        string.toLowerCase()
  );

  return found?.id || null;
}

// ============================================================
// CRUD
// ============================================================

function getCountry(id) {
  const normalized = normalizeId(id);

  if (!normalized) {
    return null;
  }

  return clone(COUNTRIES[normalized]);
}

function getCountryByCode(code) {
  return getCountry(code);
}

function getAllCountries(options = {}) {
  const {
    activeOnly = true,
    continent = null,
    region = null
  } = options;

  return Object.values(COUNTRIES)
    .filter(country => {
      if (
        activeOnly &&
        country.active !== true
      ) {
        return false;
      }

      if (
        continent &&
        country.continent !== continent
      ) {
        return false;
      }

      if (
        region &&
        country.region !== region
      ) {
        return false;
      }

      return true;
    })
    .map(clone);
}

function getCountriesByContinent(
  continent
) {
  return getAllCountries({
    continent
  });
}

function getCountriesByRegion(region) {
  return getAllCountries({
    region
  });
}

function searchCountries(query) {
  const text = String(
    query || ""
  )
    .trim()
    .toLowerCase();

  if (!text) {
    return getAllCountries();
  }

  return getAllCountries({
    activeOnly: false
  }).filter(country => {
    return (
      country.id.toLowerCase().includes(text) ||
      country.code.toLowerCase().includes(text) ||
      country.name.toLowerCase().includes(text) ||
      country.shortName
        .toLowerCase()
        .includes(text) ||
      country.nationality
        .toLowerCase()
        .includes(text)
    );
  });
}

// ============================================================
// RANDOM COUNTRIES
// ============================================================

function randomCountry(options = {}) {
  const countries =
    getAllCountries(options);

  if (!countries.length) {
    return null;
  }

  const index = Math.floor(
    Math.random() * countries.length
  );

  return countries[index];
}

function randomCountryByContinent(
  continent
) {
  return randomCountry({
    continent
  });
}

function randomCountryByRegion(region) {
  return randomCountry({
    region
  });
}

// ============================================================
// COUNTRY RATINGS
// ============================================================

function getCountryMmaLevel(id) {
  return getCountry(id)?.mmaLevel || 0;
}

function getCountryMarketLevel(id) {
  return getCountry(id)?.marketLevel || 0;
}

function getCountryPopularity(id) {
  return getCountry(id)?.popularity || 0;
}

function getCountryFightCulture(id) {
  return getCountry(id)?.fightCulture || 0;
}

function getCountryCurrency(id) {
  const country = getCountry(id);

  if (!country) {
    return null;
  }

  return {
    code: country.currency,
    symbol: country.currencySymbol
  };
}

// ============================================================
// COUNTRY COMPARISON
// ============================================================

function compareCountries(
  firstId,
  secondId
) {
  const first = getCountry(firstId);
  const second = getCountry(secondId);

  if (!first || !second) {
    return null;
  }

  return {
    mmaLevel:
      first.mmaLevel - second.mmaLevel,

    marketLevel:
      first.marketLevel -
      second.marketLevel,

    popularity:
      first.popularity -
      second.popularity,

    fightCulture:
      first.fightCulture -
      second.fightCulture
  };
}

// ============================================================
// MMA DESTINATIONS
// ============================================================

function getTopMmaCountries(limit = 10) {
  return getAllCountries()
    .sort(
      (a, b) =>
        b.mmaLevel - a.mmaLevel
    )
    .slice(
      0,
      Math.max(1, Number(limit) || 10)
    );
}

function getTopMarketCountries(
  limit = 10
) {
  return getAllCountries()
    .sort(
      (a, b) =>
        b.marketLevel -
        a.marketLevel
    )
    .slice(
      0,
      Math.max(1, Number(limit) || 10)
    );
}

function getTopFightCultureCountries(
  limit = 10
) {
  return getAllCountries()
    .sort(
      (a, b) =>
        b.fightCulture -
        a.fightCulture
    )
    .slice(
      0,
      Math.max(1, Number(limit) || 10)
    );
}

// ============================================================
// TRAVEL / CAREER VALUE
// ============================================================

function calculateCareerValue(id) {
  const country = getCountry(id);

  if (!country) {
    return 0;
  }

  return Math.round(
    country.mmaLevel * 0.45 +
    country.marketLevel * 0.25 +
    country.popularity * 0.15 +
    country.fightCulture * 0.15
  );
}

function getCareerValueRanking(
  limit = 20
) {
  return getAllCountries()
    .map(country => ({
      ...country,
      careerValue:
        calculateCareerValue(
          country.id
        )
    }))
    .sort(
      (a, b) =>
        b.careerValue -
        a.careerValue
    )
    .slice(
      0,
      Math.max(1, Number(limit) || 20)
    );
}

// ============================================================
// REGIONAL HELPERS
// ============================================================

function getCountryNeighbors(id) {
  const country = getCountry(id);

  if (!country) {
    return [];
  }

  return getAllCountries({
    continent: country.continent
  }).filter(
    item => item.id !== country.id
  );
}

function getSameRegionCountries(id) {
  const country = getCountry(id);

  if (!country) {
    return [];
  }

  return getAllCountries({
    region: country.region
  }).filter(
    item => item.id !== country.id
  );
}

// ============================================================
// NATIONALITY
// ============================================================

function getNationality(id) {
  return getCountry(id)?.nationality || null;
}

function getLanguage(id) {
  return getCountry(id)?.language || null;
}

function getTimezone(id) {
  return getCountry(id)?.timezone || null;
}

// ============================================================
// WORLD STATE INTEGRATION
// ============================================================

function ensureCountriesState(database) {
  if (!database || typeof database !== "object") {
    return null;
  }

  if (!database.world) {
    database.world = {};
  }

  if (!database.world.countries) {
    database.world.countries = {};
  }

  for (const country of Object.values(
    COUNTRIES
  )) {
    if (
      !database.world.countries[
        country.id
      ]
    ) {
      database.world.countries[
        country.id
      ] = clone(country);
    }
  }

  return database.world.countries;
}

function initializeCountries(database) {
  const state =
    ensureCountriesState(database);

  if (!state) {
    return null;
  }

  return state;
}

// ============================================================
// VALIDATION
// ============================================================

function validateCountry(country) {
  const errors = [];

  if (!country?.id) {
    errors.push("ID ausente.");
  }

  if (!country?.code) {
    errors.push("Código ausente.");
  }

  if (!country?.name) {
    errors.push("Nome ausente.");
  }

  if (!country?.continent) {
    errors.push("Continente ausente.");
  }

  if (!country?.currency) {
    errors.push("Moeda ausente.");
  }

  for (const key of [
    "mmaLevel",
    "marketLevel",
    "popularity",
    "fightCulture"
  ]) {
    const value = Number(
      country?.[key]
    );

    if (
      !Number.isFinite(value) ||
      value < 0 ||
      value > 100
    ) {
      errors.push(
        `${key} deve estar entre 0 e 100.`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateCountries() {
  const results = [];

  for (const country of Object.values(
    COUNTRIES
  )) {
    results.push({
      id: country.id,
      ...validateCountry(country)
    });
  }

  return {
    valid: results.every(
      result => result.valid
    ),
    results
  };
}

// ============================================================
// SNAPSHOT
// ============================================================

function getCountriesSnapshot() {
  return clone(COUNTRIES);
}

// ============================================================
// EXPORT
// ============================================================

const countriesAPI = {
  COUNTRIES_VERSION,
  COUNTRIES,

  getCountry,
  getCountryByCode,
  getAllCountries,
  getCountriesByContinent,
  getCountriesByRegion,
  searchCountries,

  randomCountry,
  randomCountryByContinent,
  randomCountryByRegion,

  getCountryMmaLevel,
  getCountryMarketLevel,
  getCountryPopularity,
  getCountryFightCulture,
  getCountryCurrency,

  compareCountries,

  getTopMmaCountries,
  getTopMarketCountries,
  getTopFightCultureCountries,

  calculateCareerValue,
  getCareerValueRanking,

  getCountryNeighbors,
  getSameRegionCountries,

  getNationality,
  getLanguage,
  getTimezone,

  ensureCountriesState,
  initializeCountries,

  validateCountry,
  validateCountries,

  getCountriesSnapshot
};

export {
  COUNTRIES_VERSION,
  COUNTRIES,

  getCountry,
  getCountryByCode,
  getAllCountries,
  getCountriesByContinent,
  getCountriesByRegion,
  searchCountries,

  randomCountry,
  randomCountryByContinent,
  randomCountryByRegion,

  getCountryMmaLevel,
  getCountryMarketLevel,
  getCountryPopularity,
  getCountryFightCulture,
  getCountryCurrency,

  compareCountries,

  getTopMmaCountries,
  getTopMarketCountries,
  getTopFightCultureCountries,

  calculateCareerValue,
  getCareerValueRanking,

  getCountryNeighbors,
  getSameRegionCountries,

  getNationality,
  getLanguage,
  getTimezone,

  ensureCountriesState,
  initializeCountries,

  validateCountry,
  validateCountries,

  getCountriesSnapshot
};

export default countriesAPI;
