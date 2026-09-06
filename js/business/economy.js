// ============================================================
// MMA LIFE DYNASTY
// BUSINESS — ECONOMY ENGINE
// ============================================================
//
// Responsável por:
// - Economia mundial
// - Inflação
// - Custo de vida
// - Salários
// - Bolsas de luta
// - Patrocínios
// - Contratos
// - Câmbio
// - Ciclos econômicos
// - Boom / estável / recessão / crise
// - Economia por país
// - Ajuste de preços
// - Histórico econômico
// - Atualização semanal e mensal
//
// Arquivo independente para evitar dependências circulares.
// ============================================================

const ECONOMY_VERSION = 1;

const ECONOMY_STATES = Object.freeze({
  BOOM: "boom",
  GROWTH: "growth",
  STABLE: "stable",
  SLOWDOWN: "slowdown",
  RECESSION: "recession",
  CRISIS: "crisis"
});

const ECONOMIC_STATE_LABELS = Object.freeze({
  [ECONOMY_STATES.BOOM]: "Boom econômico",
  [ECONOMY_STATES.GROWTH]: "Crescimento",
  [ECONOMY_STATES.STABLE]: "Estável",
  [ECONOMY_STATES.SLOWDOWN]: "Desaceleração",
  [ECONOMY_STATES.RECESSION]: "Recessão",
  [ECONOMY_STATES.CRISIS]: "Crise econômica"
});

const ECONOMIC_STATE_MULTIPLIERS = Object.freeze({
  [ECONOMY_STATES.BOOM]: {
    income: 1.15,
    salary: 1.12,
    purse: 1.15,
    sponsorship: 1.18,
    contract: 1.15,
    spending: 1.10,
    investment: 1.18
  },

  [ECONOMY_STATES.GROWTH]: {
    income: 1.07,
    salary: 1.06,
    purse: 1.07,
    sponsorship: 1.08,
    contract: 1.07,
    spending: 1.05,
    investment: 1.08
  },

  [ECONOMY_STATES.STABLE]: {
    income: 1,
    salary: 1,
    purse: 1,
    sponsorship: 1,
    contract: 1,
    spending: 1,
    investment: 1
  },

  [ECONOMY_STATES.SLOWDOWN]: {
    income: 0.95,
    salary: 0.96,
    purse: 0.96,
    sponsorship: 0.94,
    contract: 0.95,
    spending: 0.97,
    investment: 0.94
  },

  [ECONOMY_STATES.RECESSION]: {
    income: 0.85,
    salary: 0.88,
    purse: 0.86,
    sponsorship: 0.80,
    contract: 0.84,
    spending: 0.90,
    investment: 0.82
  },

  [ECONOMY_STATES.CRISIS]: {
    income: 0.70,
    salary: 0.72,
    purse: 0.68,
    sponsorship: 0.58,
    contract: 0.65,
    spending: 0.82,
    investment: 0.65
  }
});

const ECONOMY_CONFIG = Object.freeze({
  baseInflation: 0.04,

  minInflation: -0.02,
  maxInflation: 0.30,

  weeklyInflationVariation: 0.0015,
  monthlyInflationVariation: 0.006,

  defaultCostOfLiving: 1,

  minimumCostOfLiving: 0.45,
  maximumCostOfLiving: 3.50,

  minimumExchangeRate: 0.01,

  historyLimit: 240,

  weeklyUpdateChance: 0.04,
  monthlyStateChangeChance: 0.18,

  recessionThreshold: -0.03,
  crisisThreshold: -0.10,
  boomThreshold: 0.06,

  priceSensitivity: 1,
  incomeSensitivity: 1
});


// ============================================================
// COUNTRY ECONOMIC PROFILES
// ============================================================

const COUNTRY_ECONOMIC_PROFILES = Object.freeze({
  BR: {
    code: "BR",
    name: "Brasil",
    currency: "BRL",
    currencySymbol: "R$",
    economicStrength: 0.72,
    costOfLiving: 0.72,
    baseSalary: 1,
    basePurse: 0.78,
    sponsorMultiplier: 0.78,
    contractMultiplier: 0.80,
    inflation: 0.045,
    stability: 0.68
  },

  US: {
    code: "US",
    name: "Estados Unidos",
    currency: "USD",
    currencySymbol: "$",
    economicStrength: 1.00,
    costOfLiving: 1.00,
    baseSalary: 1.25,
    basePurse: 1.30,
    sponsorMultiplier: 1.35,
    contractMultiplier: 1.30,
    inflation: 0.035,
    stability: 0.90
  },

  CA: {
    code: "CA",
    name: "Canadá",
    currency: "CAD",
    currencySymbol: "C$",
    economicStrength: 0.94,
    costOfLiving: 1.02,
    baseSalary: 1.10,
    basePurse: 1.08,
    sponsorMultiplier: 1.12,
    contractMultiplier: 1.08,
    inflation: 0.032,
    stability: 0.90
  },

  MX: {
    code: "MX",
    name: "México",
    currency: "MXN",
    currencySymbol: "$",
    economicStrength: 0.62,
    costOfLiving: 0.62,
    baseSalary: 0.78,
    basePurse: 0.72,
    sponsorMultiplier: 0.70,
    contractMultiplier: 0.74,
    inflation: 0.048,
    stability: 0.70
  },

  GB: {
    code: "GB",
    name: "Reino Unido",
    currency: "GBP",
    currencySymbol: "£",
    economicStrength: 0.98,
    costOfLiving: 1.15,
    baseSalary: 1.18,
    basePurse: 1.15,
    sponsorMultiplier: 1.20,
    contractMultiplier: 1.18,
    inflation: 0.035,
    stability: 0.88
  },

  IE: {
    code: "IE",
    name: "Irlanda",
    currency: "EUR",
    currencySymbol: "€",
    economicStrength: 0.96,
    costOfLiving: 1.20,
    baseSalary: 1.18,
    basePurse: 1.12,
    sponsorMultiplier: 1.18,
    contractMultiplier: 1.15,
    inflation: 0.038,
    stability: 0.87
  },

  FR: {
    code: "FR",
    name: "França",
    currency: "EUR",
    currencySymbol: "€",
    economicStrength: 0.94,
    costOfLiving: 1.08,
    baseSalary: 1.10,
    basePurse: 1.08,
    sponsorMultiplier: 1.10,
    contractMultiplier: 1.08,
    inflation: 0.032,
    stability: 0.86
  },

  DE: {
    code: "DE",
    name: "Alemanha",
    currency: "EUR",
    currencySymbol: "€",
    economicStrength: 0.98,
    costOfLiving: 1.05,
    baseSalary: 1.15,
    basePurse: 1.12,
    sponsorMultiplier: 1.15,
    contractMultiplier: 1.12,
    inflation: 0.030,
    stability: 0.91
  },

  ES: {
    code: "ES",
    name: "Espanha",
    currency: "EUR",
    currencySymbol: "€",
    economicStrength: 0.88,
    costOfLiving: 0.92,
    baseSalary: 0.96,
    basePurse: 0.94,
    sponsorMultiplier: 0.96,
    contractMultiplier: 0.94,
    inflation: 0.034,
    stability: 0.82
  },

  IT: {
    code: "IT",
    name: "Itália",
    currency: "EUR",
    currencySymbol: "€",
    economicStrength: 0.86,
    costOfLiving: 0.90,
    baseSalary: 0.94,
    basePurse: 0.92,
    sponsorMultiplier: 0.94,
    contractMultiplier: 0.92,
    inflation: 0.034,
    stability: 0.80
  },

  AU: {
    code: "AU",
    name: "Austrália",
    currency: "AUD",
    currencySymbol: "A$",
    economicStrength: 0.98,
    costOfLiving: 1.20,
    baseSalary: 1.20,
    basePurse: 1.16,
    sponsorMultiplier: 1.20,
    contractMultiplier: 1.16,
    inflation: 0.033,
    stability: 0.91
  },

  JP: {
    code: "JP",
    name: "Japão",
    currency: "JPY",
    currencySymbol: "¥",
    economicStrength: 0.96,
    costOfLiving: 1.00,
    baseSalary: 1.08,
    basePurse: 1.06,
    sponsorMultiplier: 1.08,
    contractMultiplier: 1.06,
    inflation: 0.020,
    stability: 0.92
  },

  CN: {
    code: "CN",
    name: "China",
    currency: "CNY",
    currencySymbol: "¥",
    economicStrength: 0.95,
    costOfLiving: 0.78,
    baseSalary: 1.00,
    basePurse: 1.02,
    sponsorMultiplier: 1.00,
    contractMultiplier: 1.02,
    inflation: 0.025,
    stability: 0.88
  },

  SG: {
    code: "SG",
    name: "Singapura",
    currency: "SGD",
    currencySymbol: "S$",
    economicStrength: 1.00,
    costOfLiving: 1.35,
    baseSalary: 1.30,
    basePurse: 1.25,
    sponsorMultiplier: 1.28,
    contractMultiplier: 1.25,
    inflation: 0.028,
    stability: 0.95
  },

  AE: {
    code: "AE",
    name: "Emirados Árabes Unidos",
    currency: "AED",
    currencySymbol: "د.إ",
    economicStrength: 0.98,
    costOfLiving: 1.28,
    baseSalary: 1.25,
    basePurse: 1.28,
    sponsorMultiplier: 1.30,
    contractMultiplier: 1.30,
    inflation: 0.030,
    stability: 0.93
  },

  SA: {
    code: "SA",
    name: "Arábia Saudita",
    currency: "SAR",
    currencySymbol: "﷼",
    economicStrength: 0.92,
    costOfLiving: 0.95,
    baseSalary: 1.12,
    basePurse: 1.20,
    sponsorMultiplier: 1.18,
    contractMultiplier: 1.18,
    inflation: 0.025,
    stability: 0.90
  },

  KR: {
    code: "KR",
    name: "Coreia do Sul",
    currency: "KRW",
    currencySymbol: "₩",
    economicStrength: 0.94,
    costOfLiving: 0.95,
    baseSalary: 1.05,
    basePurse: 1.02,
    sponsorMultiplier: 1.08,
    contractMultiplier: 1.05,
    inflation: 0.027,
    stability: 0.87
  },

  TH: {
    code: "TH",
    name: "Tailândia",
    currency: "THB",
    currencySymbol: "฿",
    economicStrength: 0.65,
    costOfLiving: 0.55,
    baseSalary: 0.70,
    basePurse: 0.68,
    sponsorMultiplier: 0.68,
    contractMultiplier: 0.68,
    inflation: 0.038,
    stability: 0.72
  },

  PH: {
    code: "PH",
    name: "Filipinas",
    currency: "PHP",
    currencySymbol: "₱",
    economicStrength: 0.55,
    costOfLiving: 0.50,
    baseSalary: 0.62,
    basePurse: 0.58,
    sponsorMultiplier: 0.58,
    contractMultiplier: 0.60,
    inflation: 0.040,
    stability: 0.68
  },

  AR: {
    code: "AR",
    name: "Argentina",
    currency: "ARS",
    currencySymbol: "$",
    economicStrength: 0.52,
    costOfLiving: 0.58,
    baseSalary: 0.58,
    basePurse: 0.55,
    sponsorMultiplier: 0.54,
    contractMultiplier: 0.56,
    inflation: 0.080,
    stability: 0.45
  },

  CL: {
    code: "CL",
    name: "Chile",
    currency: "CLP",
    currencySymbol: "$",
    economicStrength: 0.74,
    costOfLiving: 0.72,
    baseSalary: 0.82,
    basePurse: 0.76,
    sponsorMultiplier: 0.76,
    contractMultiplier: 0.76,
    inflation: 0.040,
    stability: 0.82
  },

  CO: {
    code: "CO",
    name: "Colômbia",
    currency: "COP",
    currencySymbol: "$",
    economicStrength: 0.65,
    costOfLiving: 0.60,
    baseSalary: 0.68,
    basePurse: 0.64,
    sponsorMultiplier: 0.64,
    contractMultiplier: 0.65,
    inflation: 0.042,
    stability: 0.70
  },

  ZA: {
    code: "ZA",
    name: "África do Sul",
    currency: "ZAR",
    currencySymbol: "R",
    economicStrength: 0.58,
    costOfLiving: 0.62,
    baseSalary: 0.66,
    basePurse: 0.62,
    sponsorMultiplier: 0.60,
    contractMultiplier: 0.62,
    inflation: 0.045,
    stability: 0.62
  },

  NZ: {
    code: "NZ",
    name: "Nova Zelândia",
    currency: "NZD",
    currencySymbol: "NZ$",
    economicStrength: 0.91,
    costOfLiving: 1.10,
    baseSalary: 1.08,
    basePurse: 1.02,
    sponsorMultiplier: 1.08,
    contractMultiplier: 1.04,
    inflation: 0.033,
    stability: 0.89
  }
});


// ============================================================
// CURRENCY TABLE
// Valores aproximados em relação ao USD.
// O jogo pode alterar esses valores dinamicamente.
// ============================================================

const BASE_CURRENCY_RATES = Object.freeze({
  USD: 1,
  BRL: 5.10,
  CAD: 1.36,
  MXN: 18.50,
  GBP: 0.76,
  EUR: 0.86,
  AUD: 1.52,
  JPY: 150,
  CNY: 7.20,
  SGD: 1.35,
  AED: 3.67,
  SAR: 3.75,
  KRW: 1380,
  THB: 33.50,
  PHP: 57,
  ARS: 1400,
  CLP: 950,
  COP: 4000,
  ZAR: 17.50,
  NZD: 1.67
});


// ============================================================
// HELPERS
// ============================================================

function number(value, fallback = 0) {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}

function integer(value, fallback = 0) {
  return Math.trunc(number(value, fallback));
}

function clamp(value, min, max) {
  return Math.min(
    max,
    Math.max(min, number(value, min))
  );
}

function round(value, decimals = 2) {
  const factor = 10 ** decimals;

  return Math.round(
    number(value, 0) * factor
  ) / factor;
}

function random(min = 0, max = 1) {
  return Math.random() * (max - min) + min;
}

function randomBetween(min, max) {
  return random(min, max);
}

function randomId(prefix = "eco") {
  return (
    prefix +
    "_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).slice(2, 8)
  );
}

function clone(value) {
  if (value === undefined || value === null) {
    return value;
  }

  return JSON.parse(JSON.stringify(value));
}

function normalizeCode(code) {
  if (!code) {
    return "US";
  }

  return String(code)
    .trim()
    .toUpperCase();
}

function normalizeCurrency(currency) {
  if (!currency) {
    return "USD";
  }

  return String(currency)
    .trim()
    .toUpperCase();
}

function getDate(database) {
  return (
    database?.meta?.currentDate ||
    database?.calendar?.currentDate ||
    new Date().toISOString().slice(0, 10)
  );
}

function getWeek(database) {
  return integer(
    database?.meta?.currentWeek ??
    database?.calendar?.currentWeek,
    1
  );
}

function getYear(database) {
  return integer(
    database?.meta?.currentYear ??
    database?.calendar?.currentYear,
    1
  );
}


// ============================================================
// DATABASE INITIALIZATION
// ============================================================

function ensureDatabase(database = {}) {
  if (!database || typeof database !== "object") {
    database = {};
  }

  if (!database.economy) {
    database.economy = createEconomyState();
  }

  if (!database.world) {
    database.world = {};
  }

  if (!database.world.countries) {
    database.world.countries = {};
  }

  return database;
}


// ============================================================
// CREATE ECONOMY STATE
// ============================================================

function createEconomyState(options = {}) {
  const state = options.state || ECONOMY_STATES.STABLE;

  const economy = {
    version: ECONOMY_VERSION,

    global: {
      state,
      stateLabel:
        ECONOMIC_STATE_LABELS[state] ||
        ECONOMIC_STATE_LABELS[ECONOMY_STATES.STABLE],

      growthRate: number(
        options.growthRate,
        0.025
      ),

      inflation: clamp(
        number(
          options.inflation,
          ECONOMY_CONFIG.baseInflation
        ),
        ECONOMY_CONFIG.minInflation,
        ECONOMY_CONFIG.maxInflation
      ),

      interestRate: number(
        options.interestRate,
        0.05
      ),

      consumerConfidence: clamp(
        number(
          options.consumerConfidence,
          70
        ),
        0,
        100
      ),

      employment: clamp(
        number(
          options.employment,
          94
        ),
        0,
        100
      ),

      marketConfidence: clamp(
        number(
          options.marketConfidence,
          70
        ),
        0,
        100
      ),

      costOfLiving: clamp(
        number(
          options.costOfLiving,
          ECONOMY_CONFIG.defaultCostOfLiving
        ),
        ECONOMY_CONFIG.minimumCostOfLiving,
        ECONOMY_CONFIG.maximumCostOfLiving
      )
    },

    currencies: {},

    countries: {},

    history: [],

    lastUpdate: {
      date: null,
      week: 0,
      year: 0,
      type: null
    },

    statistics: {
      updates: 0,
      boomPeriods: 0,
      recessionPeriods: 0,
      crisisPeriods: 0
    }
  };

  initializeCurrencies(economy);
  initializeCountries(economy);

  return economy;
}


// ============================================================
// INITIALIZE CURRENCIES
// ============================================================

function initializeCurrencies(economy) {
  if (!economy.currencies) {
    economy.currencies = {};
  }

  for (const [currency, usdRate] of Object.entries(
    BASE_CURRENCY_RATES
  )) {
    if (!economy.currencies[currency]) {
      economy.currencies[currency] = {
        currency,
        usdRate: number(usdRate, 1),
        previousUsdRate: number(usdRate, 1),
        change: 0,
        volatility: getCurrencyVolatility(currency)
      };
    }
  }

  return economy.currencies;
}


function getCurrencyVolatility(currency) {
  const highVolatility = [
    "ARS",
    "BRL",
    "MXN",
    "CLP",
    "COP",
    "ZAR",
    "TRY"
  ];

  const lowVolatility = [
    "USD",
    "EUR",
    "GBP",
    "SGD",
    "AED",
    "SAR",
    "JPY"
  ];

  if (highVolatility.includes(currency)) {
    return 0.025;
  }

  if (lowVolatility.includes(currency)) {
    return 0.008;
  }

  return 0.015;
}


// ============================================================
// INITIALIZE COUNTRIES
// ============================================================

function initializeCountries(economy) {
  if (!economy.countries) {
    economy.countries = {};
  }

  for (const [code, profile] of Object.entries(
    COUNTRY_ECONOMIC_PROFILES
  )) {
    if (!economy.countries[code]) {
      economy.countries[code] =
        createCountryEconomy(profile);
    }
  }

  return economy.countries;
}


function createCountryEconomy(profile) {
  return {
    code: profile.code,
    name: profile.name,

    currency: profile.currency,
    currencySymbol: profile.currencySymbol,

    economicStrength: profile.economicStrength,

    state: ECONOMY_STATES.STABLE,

    growthRate: 0.025,

    inflation: profile.inflation,

    costOfLiving: profile.costOfLiving,

    baseSalary: profile.baseSalary,
    basePurse: profile.basePurse,

    sponsorMultiplier:
      profile.sponsorMultiplier,

    contractMultiplier:
      profile.contractMultiplier,

    stability: profile.stability,

    consumerConfidence: 70,
    employment: 94,
    marketConfidence: 70,

    lastUpdate: null,

    history: []
  };
}


// ============================================================
// COUNTRY LOOKUP
// ============================================================

function getCountryProfile(countryCode) {
  const code = normalizeCode(countryCode);

  const profile =
    COUNTRY_ECONOMIC_PROFILES[code];

  return profile
    ? clone(profile)
    : clone(COUNTRY_ECONOMIC_PROFILES.US);
}


function getCountryEconomy(
  database,
  countryCode
) {
  database = ensureDatabase(database);

  const code = normalizeCode(countryCode);

  if (!database.economy.countries[code]) {
    const profile =
      getCountryProfile(code);

    database.economy.countries[code] =
      createCountryEconomy(profile);
  }

  return database.economy.countries[code];
}


// ============================================================
// ECONOMIC STATE
// ============================================================

function getEconomicState(database) {
  database = ensureDatabase(database);

  return (
    database.economy.global.state ||
    ECONOMY_STATES.STABLE
  );
}


function getEconomicStateLabel(database) {
  const state = getEconomicState(database);

  return (
    ECONOMIC_STATE_LABELS[state] ||
    "Estável"
  );
}


function getStateMultipliers(database) {
  const state = getEconomicState(database);

  return clone(
    ECONOMIC_STATE_MULTIPLIERS[state] ||
    ECONOMIC_STATE_MULTIPLIERS[
      ECONOMY_STATES.STABLE
    ]
  );
}


function setEconomicState(
  database,
  state,
  reason = "manual"
) {
  database = ensureDatabase(database);

  if (!ECONOMIC_STATE_MULTIPLIERS[state]) {
    state = ECONOMY_STATES.STABLE;
  }

  const previous =
    database.economy.global.state;

  database.economy.global.state = state;

  database.economy.global.stateLabel =
    ECONOMIC_STATE_LABELS[state];

  if (state === ECONOMY_STATES.BOOM) {
    database.economy.statistics.boomPeriods++;
  }

  if (
    state === ECONOMY_STATES.RECESSION
  ) {
    database.economy.statistics.recessionPeriods++;
  }

  if (
    state === ECONOMY_STATES.CRISIS
  ) {
    database.economy.statistics.crisisPeriods++;
  }

  return {
    previous,
    current: state,
    reason,
    changed: previous !== state
  };
}


// ============================================================
// DETERMINE STATE FROM GROWTH
// ============================================================

function determineEconomicState(
  growthRate,
  confidence = 70
) {
  const growth = number(growthRate, 0);
  const confidenceValue =
    number(confidence, 70);

  if (
    growth >= 0.08 &&
    confidenceValue >= 80
  ) {
    return ECONOMY_STATES.BOOM;
  }

  if (
    growth >= 0.025
  ) {
    return ECONOMY_STATES.GROWTH;
  }

  if (
    growth >= -0.015
  ) {
    return ECONOMY_STATES.STABLE;
  }

  if (
    growth >= -0.035
  ) {
    return ECONOMY_STATES.SLOWDOWN;
  }

  if (
    growth >= ECONOMY_CONFIG.crisisThreshold
  ) {
    return ECONOMY_STATES.RECESSION;
  }

  return ECONOMY_STATES.CRISIS;
}


// ============================================================
// INFLATION
// ============================================================

function getInflation(
  database,
  countryCode = null
) {
  database = ensureDatabase(database);

  if (countryCode) {
    return number(
      getCountryEconomy(
        database,
        countryCode
      ).inflation,
      database.economy.global.inflation
    );
  }

  return number(
    database.economy.global.inflation,
    ECONOMY_CONFIG.baseInflation
  );
}


function setInflation(
  database,
  inflation,
  countryCode = null
) {
  database = ensureDatabase(database);

  const value = clamp(
    number(inflation, 0),
    ECONOMY_CONFIG.minInflation,
    ECONOMY_CONFIG.maxInflation
  );

  if (countryCode) {
    const country =
      getCountryEconomy(
        database,
        countryCode
      );

    country.inflation = value;

    return value;
  }

  database.economy.global.inflation =
    value;

  return value;
}


function calculateInflationAdjustment(
  database,
  amount,
  months = 1,
  countryCode = null
) {
  const inflation =
    getInflation(
      database,
      countryCode
    );

  const base =
    number(amount, 0);

  return round(
    base *
      Math.pow(
        1 + inflation,
        number(months, 1)
      ),
    2
  );
}


// ============================================================
// COST OF LIVING
// ============================================================

function getCostOfLiving(
  database,
  countryCode = null
) {
  database = ensureDatabase(database);

  if (countryCode) {
    return clamp(
      number(
        getCountryEconomy(
          database,
          countryCode
        ).costOfLiving,
        1
      ),
      ECONOMY_CONFIG.minimumCostOfLiving,
      ECONOMY_CONFIG.maximumCostOfLiving
    );
  }

  return clamp(
    number(
      database.economy.global.costOfLiving,
      1
    ),
    ECONOMY_CONFIG.minimumCostOfLiving,
    ECONOMY_CONFIG.maximumCostOfLiving
  );
}


function calculateCostOfLiving(
  database,
  baseCost,
  countryCode = null
) {
  const cost =
    number(baseCost, 0);

  const multiplier =
    getCostOfLiving(
      database,
      countryCode
    );

  return round(
    cost * multiplier,
    2
  );
}


function adjustPriceForInflation(
  database,
  basePrice,
  months = 1,
  countryCode = null
) {
  const price =
    calculateInflationAdjustment(
      database,
      basePrice,
      months,
      countryCode
    );

  const costOfLiving =
    getCostOfLiving(
      database,
      countryCode
    );

  return round(
    price *
      Math.pow(
        costOfLiving,
        0.25
      ),
    2
  );
}


// ============================================================
// SALARIES
// ============================================================

function getSalaryMultiplier(
  database,
  countryCode = null
) {
  database = ensureDatabase(database);

  const stateMultiplier =
    getStateMultipliers(database)
      .salary;

  const country =
    countryCode
      ? getCountryEconomy(
          database,
          countryCode
        )
      : null;

  const countryMultiplier =
    country?.baseSalary || 1;

  return round(
    stateMultiplier *
      countryMultiplier,
    4
  );
}


function calculateSalary(
  database,
  baseSalary,
  countryCode = null
) {
  return round(
    number(baseSalary, 0) *
      getSalaryMultiplier(
        database,
        countryCode
      ),
    2
  );
}


// ============================================================
// FIGHT PURSES
// ============================================================

function getPurseMultiplier(
  database,
  countryCode = null
) {
  database = ensureDatabase(database);

  const stateMultiplier =
    getStateMultipliers(database)
      .purse;

  const country =
    countryCode
      ? getCountryEconomy(
          database,
          countryCode
        )
      : null;

  const countryMultiplier =
    country?.basePurse || 1;

  return round(
    stateMultiplier *
      countryMultiplier,
    4
  );
}


function calculateFightPurse(
  database,
  basePurse,
  countryCode = null
) {
  return round(
    number(basePurse, 0) *
      getPurseMultiplier(
        database,
        countryCode
      ),
    2
  );
}


function calculateWinBonus(
  database,
  baseBonus,
  countryCode = null
) {
  return round(
    number(baseBonus, 0) *
      getPurseMultiplier(
        database,
        countryCode
      ),
    2
  );
}


// ============================================================
// SPONSORSHIPS
// ============================================================

function getSponsorshipMultiplier(
  database,
  countryCode = null
) {
  database = ensureDatabase(database);

  const stateMultiplier =
    getStateMultipliers(database)
      .sponsorship;

  const country =
    countryCode
      ? getCountryEconomy(
          database,
          countryCode
        )
      : null;

  const countryMultiplier =
    country?.sponsorMultiplier || 1;

  return round(
    stateMultiplier *
      countryMultiplier,
    4
  );
}


function calculateSponsorshipValue(
  database,
  baseValue,
  countryCode = null
) {
  return round(
    number(baseValue, 0) *
      getSponsorshipMultiplier(
        database,
        countryCode
      ),
    2
  );
}


// ============================================================
// CONTRACTS
// ============================================================

function getContractMultiplier(
  database,
  countryCode = null
) {
  database = ensureDatabase(database);

  const stateMultiplier =
    getStateMultipliers(database)
      .contract;

  const country =
    countryCode
      ? getCountryEconomy(
          database,
          countryCode
        )
      : null;

  const countryMultiplier =
    country?.contractMultiplier || 1;

  return round(
    stateMultiplier *
      countryMultiplier,
    4
  );
}


function calculateContractValue(
  database,
  baseValue,
  countryCode = null
) {
  return round(
    number(baseValue, 0) *
      getContractMultiplier(
        database,
        countryCode
      ),
    2
  );
}


// ============================================================
// INCOME / SPENDING POWER
// ============================================================

function calculateIncomeValue(
  database,
  baseValue,
  countryCode = null
) {
  database = ensureDatabase(database);

  const stateMultiplier =
    getStateMultipliers(database)
      .income;

  const country =
    countryCode
      ? getCountryEconomy(
          database,
          countryCode
        )
      : null;

  const countryMultiplier =
    country?.economicStrength || 1;

  return round(
    number(baseValue, 0) *
      stateMultiplier *
      countryMultiplier,
    2
  );
}


function calculateSpendingCost(
  database,
  baseCost,
  countryCode = null
) {
  database = ensureDatabase(database);

  const stateMultiplier =
    getStateMultipliers(database)
      .spending;

  return round(
    calculateCostOfLiving(
      database,
      baseCost,
      countryCode
    ) *
      stateMultiplier,
    2
  );
}


// ============================================================
// CURRENCY
// ============================================================

function getCurrencyRate(
  database,
  currency
) {
  database = ensureDatabase(database);

  const code =
    normalizeCurrency(currency);

  if (!database.economy.currencies[code]) {
    database.economy.currencies[code] = {
      currency: code,
      usdRate:
        number(
          BASE_CURRENCY_RATES[code],
          1
        ),
      previousUsdRate:
        number(
          BASE_CURRENCY_RATES[code],
          1
        ),
      change: 0,
      volatility:
        getCurrencyVolatility(code)
    };
  }

  return number(
    database.economy.currencies[code]
      .usdRate,
    1
  );
}


function convertCurrency(
  database,
  amount,
  fromCurrency,
  toCurrency
) {
  const from =
    getCurrencyRate(
      database,
      fromCurrency
    );

  const to =
    getCurrencyRate(
      database,
      toCurrency
    );

  const usdValue =
    number(amount, 0) / from;

  return round(
    usdValue * to,
    2
  );
}


function updateCurrencies(database) {
  database = ensureDatabase(database);

  const currencies =
    database.economy.currencies;

  for (const currency of Object.keys(
    currencies
  )) {
    const data =
      currencies[currency];

    const volatility =
      number(
        data.volatility,
        0.015
      );

    const previous =
      number(
        data.usdRate,
        1
      );

    const change =
      randomBetween(
        -volatility,
        volatility
      );

    data.previousUsdRate =
      previous;

    data.usdRate =
      Math.max(
        ECONOMY_CONFIG.minimumExchangeRate,
        previous *
          (1 + change)
      );

    data.change =
      round(
        data.usdRate /
          previous -
          1,
        6
      );
  }

  return currencies;
}


// ============================================================
// COUNTRY UPDATE
// ============================================================

function updateCountryEconomy(
  database,
  countryCode,
  type = "monthly"
) {
  database = ensureDatabase(database);

  const country =
    getCountryEconomy(
      database,
      countryCode
    );

  const profile =
    getCountryProfile(
      countryCode
    );

  const state =
    getEconomicState(database);

  const stateMultiplier =
    ECONOMIC_STATE_MULTIPLIERS[state] ||
    ECONOMIC_STATE_MULTIPLIERS.stable;

  const variation =
    type === "weekly"
      ? randomBetween(
          -0.004,
          0.004
        )
      : randomBetween(
          -0.015,
          0.015
        );

  const growth =
    clamp(
      country.growthRate +
        variation,
      -0.20,
      0.20
    );

  country.growthRate =
    round(growth, 5);

  country.inflation =
    clamp(
      country.inflation +
        randomBetween(
          -0.003,
          0.003
        ),
      ECONOMY_CONFIG.minInflation,
      ECONOMY_CONFIG.maxInflation
    );

  country.consumerConfidence =
    clamp(
      country.consumerConfidence +
        randomBetween(
          -4,
          4
        ) +
        (stateMultiplier.income - 1) *
          10,
      0,
      100
    );

  country.employment =
    clamp(
      country.employment +
        randomBetween(
          -1.5,
          1.5
        ) +
        growth * 10,
      0,
      100
    );

  country.marketConfidence =
    clamp(
      country.marketConfidence +
        randomBetween(
          -4,
          4
        ) +
        growth * 20,
      0,
      100
    );

  country.state =
    determineEconomicState(
      country.growthRate,
      country.consumerConfidence
    );

  const inflationImpact =
    1 +
    country.inflation;

  country.costOfLiving =
    clamp(
      country.costOfLiving *
        Math.pow(
          inflationImpact,
          type === "weekly"
            ? 1 / 52
            : 1 / 12
        ),
      ECONOMY_CONFIG.minimumCostOfLiving,
      ECONOMY_CONFIG.maximumCostOfLiving
    );

  country.lastUpdate =
    getDate(database);

  country.history.push({
    id: randomId("countryeco"),
    date: getDate(database),
    week: getWeek(database),
    year: getYear(database),
    type,
    state: country.state,
    growthRate: country.growthRate,
    inflation: country.inflation,
    costOfLiving: country.costOfLiving,
    consumerConfidence:
      country.consumerConfidence,
    employment: country.employment,
    marketConfidence:
      country.marketConfidence
  });

  trimHistory(country.history);

  return country;
}


// ============================================================
// GLOBAL WEEKLY UPDATE
// ============================================================

function updateWeeklyEconomy(
  database
) {
  database = ensureDatabase(database);

  const economy =
    database.economy;

  const global =
    economy.global;

  const previousState =
    global.state;

  const growthVariation =
    randomBetween(
      -ECONOMY_CONFIG.weeklyInflationVariation * 10,
      ECONOMY_CONFIG.weeklyInflationVariation * 10
    );

  global.growthRate =
    clamp(
      number(
        global.growth
