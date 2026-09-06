const CITIES_VERSION = 1;

const CITIES = {
  // ==========================================================
  // BRASIL
  // ==========================================================

  SAO_PAULO: {
    id: "SAO_PAULO",
    countryId: "BRA",
    name: "São Paulo",
    state: "São Paulo",
    region: "Southeast",
    continent: "South America",
    populationLevel: 100,
    mmaLevel: 95,
    trainingLevel: 98,
    marketLevel: 100,
    fightCulture: 98,
    costOfLiving: 90,
    internationalAccess: 100,
    active: true
  },

  RIO_DE_JANEIRO: {
    id: "RIO_DE_JANEIRO",
    countryId: "BRA",
    name: "Rio de Janeiro",
    state: "Rio de Janeiro",
    region: "Southeast",
    continent: "South America",
    populationLevel: 92,
    mmaLevel: 100,
    trainingLevel: 100,
    marketLevel: 98,
    fightCulture: 100,
    costOfLiving: 88,
    internationalAccess: 100,
    active: true
  },

  CURITIBA: {
    id: "CURITIBA",
    countryId: "BRA",
    name: "Curitiba",
    state: "Paraná",
    region: "South",
    continent: "South America",
    populationLevel: 72,
    mmaLevel: 82,
    trainingLevel: 84,
    marketLevel: 72,
    fightCulture: 82,
    costOfLiving: 68,
    internationalAccess: 78,
    active: true
  },

  PORTO_ALEGRE: {
    id: "PORTO_ALEGRE",
    countryId: "BRA",
    name: "Porto Alegre",
    state: "Rio Grande do Sul",
    region: "South",
    continent: "South America",
    populationLevel: 75,
    mmaLevel: 80,
    trainingLevel: 82,
    marketLevel: 74,
    fightCulture: 82,
    costOfLiving: 68,
    internationalAccess: 78,
    active: true
  },

  BELO_HORIZONTE: {
    id: "BELO_HORIZONTE",
    countryId: "BRA",
    name: "Belo Horizonte",
    state: "Minas Gerais",
    region: "Southeast",
    continent: "South America",
    populationLevel: 82,
    mmaLevel: 84,
    trainingLevel: 86,
    marketLevel: 78,
    fightCulture: 84,
    costOfLiving: 65,
    internationalAccess: 82,
    active: true
  },

  BRASILIA: {
    id: "BRASILIA",
    countryId: "BRA",
    name: "Brasília",
    state: "Distrito Federal",
    region: "Central-West",
    continent: "South America",
    populationLevel: 78,
    mmaLevel: 72,
    trainingLevel: 75,
    marketLevel: 82,
    fightCulture: 70,
    costOfLiving: 76,
    internationalAccess: 86,
    active: true
  },

  SALVADOR: {
    id: "SALVADOR",
    countryId: "BRA",
    name: "Salvador",
    state: "Bahia",
    region: "Northeast",
    continent: "South America",
    populationLevel: 76,
    mmaLevel: 82,
    trainingLevel: 82,
    marketLevel: 74,
    fightCulture: 90,
    costOfLiving: 58,
    internationalAccess: 76,
    active: true
  },

  RECIFE: {
    id: "RECIFE",
    countryId: "BRA",
    name: "Recife",
    state: "Pernambuco",
    region: "Northeast",
    continent: "South America",
    populationLevel: 74,
    mmaLevel: 78,
    trainingLevel: 78,
    marketLevel: 70,
    fightCulture: 86,
    costOfLiving: 56,
    internationalAccess: 72,
    active: true
  },

  FORTALEZA: {
    id: "FORTALEZA",
    countryId: "BRA",
    name: "Fortaleza",
    state: "Ceará",
    region: "Northeast",
    continent: "South America",
    populationLevel: 78,
    mmaLevel: 80,
    trainingLevel: 80,
    marketLevel: 74,
    fightCulture: 88,
    costOfLiving: 55,
    internationalAccess: 74,
    active: true
  },

  MANAUS: {
    id: "MANAUS",
    countryId: "BRA",
    name: "Manaus",
    state: "Amazonas",
    region: "North",
    continent: "South America",
    populationLevel: 65,
    mmaLevel: 88,
    trainingLevel: 88,
    marketLevel: 62,
    fightCulture: 96,
    costOfLiving: 58,
    internationalAccess: 62,
    active: true
  },

  BELEM: {
    id: "BELEM",
    countryId: "BRA",
    name: "Belém",
    state: "Pará",
    region: "North",
    continent: "South America",
    populationLevel: 62,
    mmaLevel: 80,
    trainingLevel: 78,
    marketLevel: 58,
    fightCulture: 88,
    costOfLiving: 52,
    internationalAccess: 60,
    active: true
  },

  MACAPA: {
    id: "MACAPA",
    countryId: "BRA",
    name: "Macapá",
    state: "Amapá",
    region: "North",
    continent: "South America",
    populationLevel: 42,
    mmaLevel: 68,
    trainingLevel: 64,
    marketLevel: 38,
    fightCulture: 78,
    costOfLiving: 45,
    internationalAccess: 38,
    active: true
  },

  // ==========================================================
  // ESTADOS UNIDOS
  // ==========================================================

  NEW_YORK: {
    id: "NEW_YORK",
    countryId: "USA",
    name: "New York",
    state: "New York",
    region: "Northeast",
    continent: "North America",
    populationLevel: 100,
    mmaLevel: 92,
    trainingLevel: 96,
    marketLevel: 100,
    fightCulture: 88,
    costOfLiving: 100,
    internationalAccess: 100,
    active: true
  },

  LOS_ANGELES: {
    id: "LOS_ANGELES",
    countryId: "USA",
    name: "Los Angeles",
    state: "California",
    region: "West",
    continent: "North America",
    populationLevel: 98,
    mmaLevel: 94,
    trainingLevel: 100,
    marketLevel: 100,
    fightCulture: 92,
    costOfLiving: 98,
    internationalAccess: 100,
    active: true
  },

  LAS_VEGAS: {
    id: "LAS_VEGAS",
    countryId: "USA",
    name: "Las Vegas",
    state: "Nevada",
    region: "West",
    continent: "North America",
    populationLevel: 70,
    mmaLevel: 100,
    trainingLevel: 100,
    marketLevel: 100,
    fightCulture: 100,
    costOfLiving: 82,
    internationalAccess: 98,
    active: true
  },

  MIAMI: {
    id: "MIAMI",
    countryId: "USA",
    name: "Miami",
    state: "Florida",
    region: "South",
    continent: "North America",
    populationLevel: 82,
    mmaLevel: 92,
    trainingLevel: 96,
    marketLevel: 96,
    fightCulture: 92,
    costOfLiving: 88,
    internationalAccess: 100,
    active: true
  },

  JACKSONVILLE: {
    id: "JACKSONVILLE",
    countryId: "USA",
    name: "Jacksonville",
    state: "Florida",
    region: "South",
    continent: "North America",
    populationLevel: 72,
    mmaLevel: 94,
    trainingLevel: 96,
    marketLevel: 78,
    fightCulture: 94,
    costOfLiving: 62,
    internationalAccess: 78,
    active: true
  },

  HOUSTON: {
    id: "HOUSTON",
    countryId: "USA",
    name: "Houston",
    state: "Texas",
    region: "South",
    continent: "North America",
    populationLevel: 88,
    mmaLevel: 90,
    trainingLevel: 92,
    marketLevel: 88,
    fightCulture: 90,
    costOfLiving: 68,
    internationalAccess: 90,
    active: true
  },

  DALLAS: {
    id: "DALLAS",
    countryId: "USA",
    name: "Dallas",
    state: "Texas",
    region: "South",
    continent: "North America",
    populationLevel: 84,
    mmaLevel: 86,
    trainingLevel: 90,
    marketLevel: 88,
    fightCulture: 86,
    costOfLiving: 68,
    internationalAccess: 88,
    active: true
  },

  CHICAGO: {
    id: "CHICAGO",
    countryId: "USA",
    name: "Chicago",
    state: "Illinois",
    region: "Midwest",
    continent: "North America",
    populationLevel: 94,
    mmaLevel: 86,
    trainingLevel: 90,
    marketLevel: 92,
    fightCulture: 86,
    costOfLiving: 78,
    internationalAccess: 94,
    active: true
  },

  DENVER: {
    id: "DENVER",
    countryId: "USA",
    name: "Denver",
    state: "Colorado",
    region: "West",
    continent: "North America",
    populationLevel: 68,
    mmaLevel: 92,
    trainingLevel: 96,
    marketLevel: 74,
    fightCulture: 88,
    costOfLiving: 74,
    internationalAccess: 82,
    active: true
  },

  // ==========================================================
  // CANADÁ
  // ==========================================================

  TORONTO: {
    id: "TORONTO",
    countryId: "CAN",
    name: "Toronto",
    state: "Ontario",
    region: "Central Canada",
    continent: "North America",
    populationLevel: 96,
    mmaLevel: 84,
    trainingLevel: 90,
    marketLevel: 96,
    fightCulture: 82,
    costOfLiving: 94,
    internationalAccess: 96,
    active: true
  },

  MONTREAL: {
    id: "MONTREAL",
    countryId: "CAN",
    name: "Montreal",
    state: "Quebec",
    region: "Eastern Canada",
    continent: "North America",
    populationLevel: 84,
    mmaLevel: 88,
    trainingLevel: 94,
    marketLevel: 82,
    fightCulture: 92,
    costOfLiving: 72,
    internationalAccess: 90,
    active: true
  },

  VANCOUVER: {
    id: "VANCOUVER",
    countryId: "CAN",
    name: "Vancouver",
    state: "British Columbia",
    region: "Western Canada",
    continent: "North America",
    populationLevel: 78,
    mmaLevel: 78,
    trainingLevel: 84,
    marketLevel: 82,
    fightCulture: 76,
    costOfLiving: 92,
    internationalAccess: 88,
    active: true
  },

  // ==========================================================
  // MÉXICO
  // ==========================================================

  MEXICO_CITY: {
    id: "MEXICO_CITY",
    countryId: "MEX",
    name: "Cidade do México",
    state: "Mexico City",
    region: "Central Mexico",
    continent: "North America",
    populationLevel: 100,
    mmaLevel: 86,
    trainingLevel: 88,
    marketLevel: 92,
    fightCulture: 100,
    costOfLiving: 54,
    internationalAccess: 92,
    active: true
  },

  GUADALAJARA: {
    id: "GUADALAJARA",
    countryId: "MEX",
    name: "Guadalajara",
    state: "Jalisco",
    region: "Western Mexico",
    continent: "North America",
    populationLevel: 82,
    mmaLevel: 80,
    trainingLevel: 82,
    marketLevel: 76,
    fightCulture: 92,
    costOfLiving: 48,
    internationalAccess: 78,
    active: true
  },

  MONTERREY: {
    id: "MONTERREY",
    countryId: "MEX",
    name: "Monterrey",
    state: "Nuevo León",
    region: "Northern Mexico",
    continent: "North America",
    populationLevel: 78,
    mmaLevel: 76,
    trainingLevel: 80,
    marketLevel: 82,
    fightCulture: 86,
    costOfLiving: 55,
    internationalAccess: 80,
    active: true
  },

  // ==========================================================
  // ARGENTINA
  // ==========================================================

  BUENOS_AIRES: {
    id: "BUENOS_AIRES",
    countryId: "ARG",
    name: "Buenos Aires",
    state: "Buenos Aires",
    region: "Central Argentina",
    continent: "South America",
    populationLevel: 96,
    mmaLevel: 68,
    trainingLevel: 72,
    marketLevel: 78,
    fightCulture: 76,
    costOfLiving: 55,
    internationalAccess: 90,
    active: true
  },

  CORDOBA: {
    id: "CORDOBA",
    countryId: "ARG",
    name: "Córdoba",
    state: "Córdoba",
    region: "Central Argentina",
    continent: "South America",
    populationLevel: 72,
    mmaLevel: 60,
    trainingLevel: 64,
    marketLevel: 58,
    fightCulture: 68,
    costOfLiving: 44,
    internationalAccess: 62,
    active: true
  },

  // ==========================================================
  // REINO UNIDO
  // ==========================================================

  LONDON: {
    id: "LONDON",
    countryId: "GBR",
    name: "Londres",
    state: "England",
    region: "England",
    continent: "Europe",
    populationLevel: 100,
    mmaLevel: 94,
    trainingLevel: 96,
    marketLevel: 100,
    fightCulture: 92,
    costOfLiving: 100,
    internationalAccess: 100,
    active: true
  },

  MANCHESTER: {
    id: "MANCHESTER",
    countryId: "GBR",
    name: "Manchester",
    state: "England",
    region: "England",
    continent: "Europe",
    populationLevel: 82,
    mmaLevel: 88,
    trainingLevel: 92,
    marketLevel: 82,
    fightCulture: 90,
    costOfLiving: 68,
    internationalAccess: 86,
    active: true
  },

  BIRMINGHAM: {
    id: "BIRMINGHAM",
    countryId: "GBR",
    name: "Birmingham",
    state: "England",
    region: "England",
    continent: "Europe",
    populationLevel: 78,
    mmaLevel: 78,
    trainingLevel: 82,
    marketLevel: 76,
    fightCulture: 82,
    costOfLiving: 62,
    internationalAccess: 78,
    active: true
  },

  // ==========================================================
  // IRLANDA
  // ==========================================================

  DUBLIN: {
    id: "DUBLIN",
    countryId: "IRL",
    name: "Dublin",
    state: "Leinster",
    region: "Leinster",
    continent: "Europe",
    populationLevel: 82,
    mmaLevel: 92,
    trainingLevel: 94,
    marketLevel: 90,
    fightCulture: 98,
    costOfLiving: 90,
    internationalAccess: 94,
    active: true
  },

  // ==========================================================
  // FRANÇA
  // ==========================================================

  PARIS: {
    id: "PARIS",
    countryId: "FRA",
    name: "Paris",
    state: "Île-de-France",
    region: "Northern France",
    continent: "Europe",
    populationLevel: 100,
    mmaLevel: 90,
    trainingLevel: 94,
    marketLevel: 100,
    fightCulture: 88,
    costOfLiving: 94,
    internationalAccess: 100,
    active: true
  },

  LYON: {
    id: "LYON",
    countryId: "FRA",
    name: "Lyon",
    state: "Auvergne-Rhône-Alpes",
    region: "Eastern France",
    continent: "Europe",
    populationLevel: 78,
    mmaLevel: 76,
    trainingLevel: 82,
    marketLevel: 76,
    fightCulture: 76,
    costOfLiving: 68,
    internationalAccess: 82,
    active: true
  },

  // ==========================================================
  // ESPANHA
  // ==========================================================

  MADRID: {
    id: "MADRID",
    countryId: "ESP",
    name: "Madrid",
    state: "Community of Madrid",
    region: "Central Spain",
    continent: "Europe",
    populationLevel: 94,
    mmaLevel: 80,
    trainingLevel: 84,
    marketLevel: 90,
    fightCulture: 80,
    costOfLiving: 72,
    internationalAccess: 96,
    active: true
  },

  BARCELONA: {
    id: "BARCELONA",
    countryId: "ESP",
    name: "Barcelona",
    state: "Catalonia",
    region: "Northeastern Spain",
    continent: "Europe",
    populationLevel: 90,
    mmaLevel: 82,
    trainingLevel: 86,
    marketLevel: 92,
    fightCulture: 82,
    costOfLiving: 78,
    internationalAccess: 98,
    active: true
  },

  // ==========================================================
  // ALEMANHA
  // ==========================================================

  BERLIN: {
    id: "BERLIN",
    countryId: "DEU",
    name: "Berlim",
    state: "Berlin",
    region: "Eastern Germany",
    continent: "Europe",
    populationLevel: 92,
    mmaLevel: 72,
    trainingLevel: 78,
    marketLevel: 88,
    fightCulture: 72,
    costOfLiving: 68,
    internationalAccess: 96,
    active: true
  },

  // ==========================================================
  // PAÍSES BAIXOS
  // ==========================================================

  AMSTERDAM: {
    id: "AMSTERDAM",
    countryId: "NLD",
    name: "Amsterdã",
    state: "North Holland",
    region: "Western Netherlands",
    continent: "Europe",
    populationLevel: 78,
    mmaLevel: 92,
    trainingLevel: 98,
    marketLevel: 90,
    fightCulture: 98,
    costOfLiving: 88,
    internationalAccess: 98,
    active: true
  },

  // ==========================================================
  // POLÔNIA
  // ==========================================================

  WARSAW: {
    id: "WARSAW",
    countryId: "POL",
    name: "Varsóvia",
    state: "Masovian",
    region: "Central Poland",
    continent: "Europe",
    populationLevel: 82,
    mmaLevel: 88,
    trainingLevel: 92,
    marketLevel: 76,
    fightCulture: 94,
    costOfLiving: 48,
    internationalAccess: 88,
    active: true
  },

  // ==========================================================
  // RÚSSIA
  // ==========================================================

  MOSCOW: {
    id: "MOSCOW",
    countryId: "RUS",
    name: "Moscou",
    state: "Moscow",
    region: "Central Russia",
    continent: "Europe",
    populationLevel: 100,
    mmaLevel: 92,
    trainingLevel: 96,
    marketLevel: 88,
    fightCulture: 98,
    costOfLiving: 78,
    internationalAccess: 88,
    active: true
  },

  MAKHACHKALA: {
    id: "MAKHACHKALA",
    countryId: "RUS",
    name: "Makhachkala",
    state: "Dagestan",
    region: "North Caucasus",
    continent: "Europe",
    populationLevel: 58,
    mmaLevel: 100,
    trainingLevel: 100,
    marketLevel: 58,
    fightCulture: 100,
    costOfLiving: 36,
    internationalAccess: 55,
    active: true
  },

  // ==========================================================
  // GEÓRGIA
  // ==========================================================

  TBILISI: {
    id: "TBILISI",
    countryId: "GEO",
    name: "Tbilisi",
    state: "Tbilisi",
    region: "Caucasus",
    continent: "Asia",
    populationLevel: 70,
    mmaLevel: 90,
    trainingLevel: 94,
    marketLevel: 62,
    fightCulture: 98,
    costOfLiving: 38,
    internationalAccess: 72,
    active: true
  },

  // ==========================================================
  // TURQUIA
  // ==========================================================

  ISTANBUL: {
    id: "ISTANBUL",
    countryId: "TUR",
    name: "Istambul",
    state: "Istanbul",
    region: "Marmara",
    continent: "Europe",
    populationLevel: 100,
    mmaLevel: 70,
    trainingLevel: 76,
    marketLevel: 88,
    fightCulture: 82,
    costOfLiving: 52,
    internationalAccess: 96,
    active: true
  },

  // ==========================================================
  // EMIRADOS ÁRABES UNIDOS
  // ==========================================================

  ABU_DHABI: {
    id: "ABU_DHABI",
    countryId: "ARE",
    name: "Abu Dhabi",
    state: "Abu Dhabi",
    region: "Gulf",
    continent: "Asia",
    populationLevel: 72,
    mmaLevel: 82,
    trainingLevel: 88,
    marketLevel: 98,
    fightCulture: 84,
    costOfLiving: 92,
    internationalAccess: 100,
    active: true
  },

  DUBAI: {
    id: "DUBAI",
    countryId: "ARE",
    name: "Dubai",
    state: "Dubai",
    region: "Gulf",
    continent: "Asia",
    populationLevel: 88,
    mmaLevel: 76,
    trainingLevel: 84,
    marketLevel: 100,
    fightCulture: 78,
    costOfLiving: 100,
    internationalAccess: 100,
    active: true
  },

  // ==========================================================
  // ARÁBIA SAUDITA
  // ==========================================================

  RIYADH: {
    id: "RIYADH",
    countryId: "SAU",
    name: "Riad",
    state: "Riyadh",
    region: "Central Saudi Arabia",
    continent: "Asia",
    populationLevel: 84,
    mmaLevel: 68,
    trainingLevel: 74,
    marketLevel: 100,
    fightCulture: 76,
    costOfLiving: 74,
    internationalAccess: 96,
    active: true
  },

  // ==========================================================
  // JAPÃO
  // ==========================================================

  TOKYO: {
    id: "TOKYO",
    countryId: "JPN",
    name: "Tóquio",
    state: "Tokyo",
    region: "Kanto",
    continent: "Asia",
    populationLevel: 100,
    mmaLevel: 96,
    trainingLevel: 98,
    marketLevel: 100,
    fightCulture: 100,
    costOfLiving: 92,
    internationalAccess: 100,
    active: true
  },

  OSAKA: {
    id: "OSAKA",
    countryId: "JPN",
    name: "Osaka",
    state: "Osaka",
    region: "Kansai",
    continent: "Asia",
    populationLevel: 90,
    mmaLevel: 88,
    trainingLevel: 92,
    marketLevel: 86,
    fightCulture: 96,
    costOfLiving: 76,
    internationalAccess: 92,
    active: true
  },

  // ==========================================================
  // COREIA DO SUL
  // ==========================================================

  SEOUL: {
    id: "SEOUL",
    countryId: "KOR",
    name: "Seul",
    state: "Seoul",
    region: "Capital Area",
    continent: "Asia",
    populationLevel: 100,
    mmaLevel: 78,
    trainingLevel: 84,
    marketLevel: 98,
    fightCulture: 82,
    costOfLiving: 88,
    internationalAccess: 100,
    active: true
  },

  // ==========================================================
  // CHINA
  // ==========================================================

  SHANGHAI: {
    id: "SHANGHAI",
    countryId: "CHN",
    name: "Xangai",
    state: "Shanghai",
    region: "Eastern China",
    continent: "Asia",
    populationLevel: 100,
    mmaLevel: 68,
    trainingLevel: 76,
    marketLevel: 100,
    fightCulture: 72,
    costOfLiving: 78,
    internationalAccess: 100,
    active: true
  },

  BEIJING: {
    id: "BEIJING",
    countryId: "CHN",
    name: "Pequim",
    state: "Beijing",
    region: "Northern China",
    continent: "Asia",
    populationLevel: 100,
    mmaLevel: 70,
    trainingLevel: 76,
    marketLevel: 100,
    fightCulture: 72,
    costOfLiving: 76,
    internationalAccess: 98,
    active: true
  },

  // ==========================================================
  // TAILÂNDIA
  // ==========================================================

  BANGKOK: {
    id: "BANGKOK",
    countryId: "THA",
    name: "Bangkok",
    state: "Bangkok",
    region: "Central Thailand",
    continent: "Asia",
    populationLevel: 98,
    mmaLevel: 92,
    trainingLevel: 100,
    marketLevel: 90,
    fightCulture: 100,
    costOfLiving: 48,
    internationalAccess: 98,
    active: true
  },

  PHUKET: {
    id: "PHUKET",
    countryId: "THA",
    name: "Phuket",
    state: "Phuket",
    region: "Southern Thailand",
    continent: "Asia",
    populationLevel: 62,
    mmaLevel: 94,
    trainingLevel: 100,
    marketLevel: 84,
    fightCulture: 100,
    costOfLiving: 52,
    internationalAccess: 92,
    active: true
  },

  // ==========================================================
  // AUSTRÁLIA
  // ==========================================================

  SYDNEY: {
    id: "SYDNEY",
    countryId: "AUS",
    name: "Sydney",
    state: "New South Wales",
    region: "Eastern Australia",
    continent: "Oceania",
    populationLevel: 92,
    mmaLevel: 90,
    trainingLevel: 94,
    marketLevel: 96,
    fightCulture: 90,
    costOfLiving: 96,
    internationalAccess: 100,
    active: true
  },

  MELBOURNE: {
    id: "MELBOURNE",
    countryId: "AUS",
    name: "Melbourne",
    state: "Victoria",
    region: "Southeastern Australia",
    continent: "Oceania",
    populationLevel: 92,
    mmaLevel: 88,
    trainingLevel: 92,
    marketLevel: 94,
    fightCulture: 88,
    costOfLiving: 90,
    internationalAccess: 98,
    active: true
  },

  // ==========================================================
  // NOVA ZELÂNDIA
  // ==========================================================

  AUCKLAND: {
    id: "AUCKLAND",
    countryId: "NZL",
    name: "Auckland",
    state: "Auckland",
    region: "North Island",
    continent: "Oceania",
    populationLevel: 82,
    mmaLevel: 92,
    trainingLevel: 96,
    marketLevel: 82,
    fightCulture: 96,
    costOfLiving: 78,
    internationalAccess: 90,
    active: true
  },

  // ==========================================================
  // ÁFRICA DO SUL
  // ==========================================================

  JOHANNESBURG: {
    id: "JOHANNESBURG",
    countryId: "ZAF",
    name: "Joanesburgo",
    state: "Gauteng",
    region: "Highveld",
    continent: "Africa",
    populationLevel: 86,
    mmaLevel: 72,
    trainingLevel: 78,
    marketLevel: 78,
    fightCulture: 82,
    costOfLiving: 48,
    internationalAccess: 82,
    active: true
  },

  CAPE_TOWN: {
    id: "CAPE_TOWN",
    countryId: "ZAF",
    name: "Cidade do Cabo",
    state: "Western Cape",
    region: "Southwestern South Africa",
    continent: "Africa",
    populationLevel: 76,
    mmaLevel: 70,
    trainingLevel: 76,
    marketLevel: 80,
    fightCulture: 80,
    costOfLiving: 58,
    internationalAccess: 84,
    active: true
  },

  // ==========================================================
  // NIGÉRIA
  // ==========================================================

  LAGOS: {
    id: "LAGOS",
    countryId: "NGA",
    name: "Lagos",
    state: "Lagos",
    region: "Southwestern Nigeria",
    continent: "Africa",
    populationLevel: 100,
    mmaLevel: 68,
    trainingLevel: 72,
    marketLevel: 86,
    fightCulture: 80,
    costOfLiving: 42,
    internationalAccess: 82,
    active: true
  }
};

// ==========================================================
// HELPERS
// ==========================================================

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeCityId(value) {
  if (!value) {
    return null;
  }

  const text = String(value).trim();

  if (CITIES[text]) {
    return text;
  }

  const upper = text.toUpperCase();

  if (CITIES[upper]) {
    return upper;
  }

  const found = Object.values(CITIES).find(
    city =>
      city.name.toLowerCase() ===
      text.toLowerCase()
  );

  return found?.id || null;
}

// ==========================================================
// CONSULTAS
// ==========================================================

function getCity(id) {
  const normalized = normalizeCityId(id);

  if (!normalized) {
    return null;
  }

  return clone(CITIES[normalized]);
}

function getAllCities(options = {}) {
  const {
    activeOnly = true,
    countryId = null,
    continent = null,
    region = null
  } = options;

  return Object.values(CITIES)
    .filter(city => {
      if (
        activeOnly &&
        city.active !== true
      ) {
        return false;
      }

      if (
        countryId &&
        city.countryId !==
          String(countryId).toUpperCase()
      ) {
        return false;
      }

      if (
        continent &&
        city.continent !== continent
      ) {
        return false;
      }

      if (
        region &&
        city.region !== region
      ) {
        return false;
      }

      return true;
    })
    .map(clone);
}

function getCitiesByCountry(countryId) {
  return getAllCities({
    countryId
  });
}

function getCitiesByContinent(continent) {
  return getAllCities({
    continent
  });
}

function getCitiesByRegion(region) {
  return getAllCities({
    region
  });
}

function searchCities(query) {
  const text = String(query || "")
    .trim()
    .toLowerCase();

  if (!text) {
    return getAllCities();
  }

  return getAllCities({
    activeOnly: false
  }).filter(city => {
    return (
      city.id
        .toLowerCase()
        .includes(text) ||
      city.name
        .toLowerCase()
        .includes(text) ||
      city.state
        .toLowerCase()
        .includes(text) ||
      city.countryId
        .toLowerCase()
        .includes(text)
    );
  });
}

// ==========================================================
// RANDOM
// ==========================================================

function randomCity(options = {}) {
  const cities =
    getAllCities(options);

  if (!cities.length) {
    return null;
  }

  const index = Math.floor(
    Math.random() * cities.length
  );

  return cities[index];
}

function randomCityByCountry(countryId) {
  return randomCity({
    countryId
  });
}

function randomCityByContinent(continent) {
  return randomCity({
    continent
  });
}

function randomCityByRegion(region) {
  return randomCity({
    region
  });
}

// ==========================================================
// RANKINGS
// ==========================================================

function getTopMmaCities(limit = 10) {
  return getAllCities()
    .sort(
      (a, b) =>
        b.mmaLevel - a.mmaLevel
    )
    .slice(
      0,
      Math.max(1, Number(limit) || 10)
    );
}

function getTopTrainingCities(limit = 10) {
  return getAllCities()
    .sort(
      (a, b) =>
        b.trainingLevel -
        a.trainingLevel
    )
    .slice(
      0,
      Math.max(1, Number(limit) || 10)
    );
}

function getTopMarketCities(limit = 10) {
  return getAllCities()
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

function getTopFightCultureCities(
  limit = 10
) {
  return getAllCities()
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

// ==========================================================
// CITY VALUE
// ==========================================================

function calculateCityValue(id) {
  const city = getCity(id);

  if (!city) {
    return 0;
  }

  return Math.round(
    city.mmaLevel * 0.30 +
    city.trainingLevel * 0.25 +
    city.marketLevel * 0.15 +
    city.fightCulture * 0.15 +
    city.internationalAccess * 0.15
  );
}

function getCityRanking(limit = 20) {
  return getAllCities()
    .map(city => ({
      ...city,
      cityValue:
        calculateCityValue(city.id)
    }))
    .sort(
      (a, b) =>
        b.cityValue -
        a.cityValue
    )
    .slice(
      0,
      Math.max(1, Number(limit) || 20)
    );
}

// ==========================================================
// TRAINING / CAREER
// ==========================================================

function getTrainingBonus(id) {
  const city = getCity(id);

  if (!city) {
    return 0;
  }

  return Math.round(
    (city.trainingLevel - 50) *
      0.10
  );
}

function getMmaCareerBonus(id) {
  const city = getCity(id);

  if (!city) {
    return 0;
  }

  return Math.round(
    (city.mmaLevel - 50) *
      0.08
  );
}

function getMarketBonus(id) {
  const city = getCity(id);

  if (!city) {
    return 0;
  }

  return Math.round(
    (city.marketLevel - 50) *
      0.08
  );
}

function getFightCultureBonus(id) {
  const city = getCity(id);

  if (!city) {
    return 0;
  }

  return Math.round(
    (city.fightCulture - 50) *
      0.08
  );
}

// ==========================================================
// LIFE / COST
// ==========================================================

function getCostOfLiving(id) {
  return getCity(id)?.costOfLiving || 0;
}

function getInternationalAccess(id) {
  return (
    getCity(id)?.internationalAccess || 0
  );
}

function calculateMonthlyLivingCost(
  id,
  baseCost = 2000
) {
  const city = getCity(id);

  if (!city) {
    return Math.round(baseCost);
  }

  return Math.round(
    Number(baseCost) *
      (0.50 + city.costOfLiving / 100)
  );
}

// ==========================================================
// TRAVEL
// ==========================================================

function estimateTravelDifficulty(
  fromCityId,
  toCityId
) {
  const from = getCity(fromCityId);
  const to = getCity(toCityId);

  if (!from || !to) {
    return null;
  }

  let difficulty = 10;

  if (
    from.countryId !==
    to.countryId
  ) {
    difficulty += 25;
  }

  if (
    from.continent !==
    to.continent
  ) {
    difficulty += 30;
  }

  const accessDifference =
    Math.abs(
      from.internationalAccess -
        to.internationalAccess
    );

  difficulty += Math.round(
    accessDifference * 0.20
  );

  return Math.min(
    100,
    Math.max(0, difficulty)
  );
}

function estimateTravelCost(
  fromCityId,
  toCityId,
  baseCost = 500
) {
  const difficulty =
    estimateTravelDifficulty(
      fromCityId,
      toCityId
    );

  if (difficulty === null) {
    return null;
  }

  return Math.round(
    Number(baseCost) *
      (0.50 + difficulty / 100)
  );
}

// ==========================================================
// WORLD DATABASE
// ==========================================================

function ensureCitiesState(database) {
  if (
    !database ||
    typeof database !== "object"
  ) {
    return null;
  }

  if (!database.world) {
    database.world = {};
  }

  if (!database.world.cities) {
    database.world.cities = {};
  }

  for (const city of Object.values(
    CITIES
  )) {
    if (
      !database.world.cities[
        city.id
      ]
    ) {
      database.world.cities[
        city.id
      ] = clone(city);
    }
  }

  return database.world.cities;
}

function initializeCities(database) {
  return ensureCitiesState(database);
}

// ==========================================================
// VALIDAÇÃO
// ==========================================================

function validateCity(city) {
  const errors = [];

  if (!city?.id) {
    errors.push("ID ausente.");
  }

  if (!city?.countryId) {
    errors.push(
      "countryId ausente."
    );
  }

  if (!city?.name) {
    errors.push("Nome ausente.");
  }

  const numericFields = [
    "populationLevel",
    "mmaLevel",
    "trainingLevel",
    "marketLevel",
    "fightCulture",
    "costOfLiving",
    "internationalAccess"
  ];

  for (const field of numericFields) {
    const value = Number(
      city?.[field]
    );

    if (
      !Number.isFinite(value) ||
      value < 0 ||
      value > 100
    ) {
      errors.push(
        `${field} deve estar entre 0 e 100.`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateCities() {
  const results = Object.values(
    CITIES
  ).map(city => ({
    id: city.id,
    ...validateCity(city)
  }));

  return {
    valid: results.every(
      result => result.valid
    ),
    results
  };
}

// ==========================================================
// SNAPSHOT
// ==========================================================

function getCitiesSnapshot() {
  return clone(CITIES);
}

// ==========================================================
// EXPORT
// ==========================================================

const citiesAPI = {
  CITIES_VERSION,
  CITIES,

  getCity,
  getAllCities,
  getCitiesByCountry,
  getCitiesByContinent,
  getCitiesByRegion,
  searchCities,

  randomCity,
  randomCityByCountry,
  randomCityByContinent,
  randomCityByRegion,

  getTopMmaCities,
  getTopTrainingCities,
  getTopMarketCities,
  getTopFightCultureCities,

  calculateCityValue,
  getCityRanking,

  getTrainingBonus,
  getMmaCareerBonus,
  getMarketBonus,
  getFightCultureBonus,

  getCostOfLiving,
  getInternationalAccess,
  calculateMonthlyLivingCost,

  estimateTravelDifficulty,
  estimateTravelCost,

  ensureCitiesState,
  initializeCities,

  validateCity,
  validateCities,

  getCitiesSnapshot
};

export {
  CITIES_VERSION,
  CITIES,

  getCity,
  getAllCities,
  getCitiesByCountry,
  getCitiesByContinent,
  getCitiesByRegion,
  searchCities,

  randomCity,
  randomCityByCountry,
  randomCityByContinent,
  randomCityByRegion,

  getTopMmaCities,
  getTopTrainingCities,
  getTopMarketCities,
  getTopFightCultureCities,

  calculateCityValue,
  getCityRanking,

  getTrainingBonus,
  getMmaCareerBonus,
  getMarketBonus,
  getFightCultureBonus,

  getCostOfLiving,
  getInternationalAccess,
  calculateMonthlyLivingCost,

  estimateTravelDifficulty,
  estimateTravelCost,

  ensureCitiesState,
  initializeCities,

  validateCity,
  validateCities,

  getCitiesSnapshot
};

export default citiesAPI;
