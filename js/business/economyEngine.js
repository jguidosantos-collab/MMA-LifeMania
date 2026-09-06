// ============================================================
// MMA LIFE DYNASTY
// BUSINESS — ECONOMY ENGINE CONTROLLER
// ============================================================
//
// Conecta a economia ao restante do jogo.
//
// Responsável por:
// - Inicializar a economia
// - Atualizar economia semanalmente
// - Atualizar economia mensalmente
// - Detectar mudança de mês/ano
// - Aplicar inflação
// - Aplicar custo de vida
// - Ajustar bolsas de luta
// - Ajustar salários
// - Ajustar patrocínios
// - Ajustar contratos
// - Atualizar moedas
// - Atualizar economias nacionais
// - Gerar eventos econômicos
// - Gerar avisos econômicos
// - Criar histórico
//
// Arquivo independente para reduzir dependências circulares.
// ============================================================

import {
  ECONOMY_VERSION,
  ECONOMY_STATES,
  ECONOMIC_STATE_LABELS,
  ECONOMY_CONFIG,
  createEconomyState,
  ensureDatabase,
  installEconomy,
  getEconomicState,
  getEconomicStateLabel,
  getStateMultipliers,
  setEconomicState,
  determineEconomicState,
  getInflation,
  calculateInflationAdjustment,
  getCostOfLiving,
  calculateCostOfLiving,
  adjustPriceForInflation,
  calculateSalary,
  calculateFightPurse,
  calculateWinBonus,
  calculateSponsorshipValue,
  calculateContractValue,
  calculateIncomeValue,
  calculateSpendingCost,
  convertCurrency,
  updateCurrencies,
  updateCountryEconomy,
  updateWeeklyEconomy,
  updateMonthlyEconomy,
  triggerEconomicShock,
  createEconomySnapshot,
  getEconomySummary,
  getEconomicHealth,
  getMarketConditions,
  getEconomicWarnings,
  validateEconomy
} from "./economy.js";


// ============================================================
// ENGINE VERSION
// ============================================================

const ECONOMY_ENGINE_VERSION = 1;


// ============================================================
// ENGINE CONFIG
// ============================================================

const ECONOMY_ENGINE_CONFIG = Object.freeze({
  weeklyUpdateEnabled: true,
  monthlyUpdateEnabled: true,

  automaticSnapshots: true,

  generateEconomicEvents: true,

  maxEventsPerMonth: 2,

  eventChancePerMonth: 0.12,

  applyCountryEconomy: true,

  applyGlobalEconomy: true,

  updateCurrencies: true,

  updateWorldCountries: true,

  notificationsEnabled: true,

  inflationWarningThreshold: 0.08,

  crisisWarningThreshold: 0.10,

  recessionGrowthThreshold: -0.03,

  boomGrowthThreshold: 0.06
});


// ============================================================
// ECONOMIC EVENT TYPES
// ============================================================

const ECONOMIC_EVENTS = Object.freeze({
  MARKET_BOOM: "market_boom",
  MARKET_CRASH: "market_crash",
  INFLATION_SPIKE: "inflation_spike",
  INFLATION_DROP: "inflation_drop",
  RECESSION: "recession",
  RECOVERY: "recovery",
  CURRENCY_SHOCK: "currency_shock",
  CONSUMER_CONFIDENCE: "consumer_confidence",
  EMPLOYMENT_SHOCK: "employment_shock",
  STABLE_PERIOD: "stable_period"
});


const ECONOMIC_EVENT_LABELS = Object.freeze({
  [ECONOMIC_EVENTS.MARKET_BOOM]:
    "Expansão econômica",

  [ECONOMIC_EVENTS.MARKET_CRASH]:
    "Queda do mercado",

  [ECONOMIC_EVENTS.INFLATION_SPIKE]:
    "Aumento da inflação",

  [ECONOMIC_EVENTS.INFLATION_DROP]:
    "Queda da inflação",

  [ECONOMIC_EVENTS.RECESSION]:
    "Recessão econômica",

  [ECONOMIC_EVENTS.RECOVERY]:
    "Recuperação econômica",

  [ECONOMIC_EVENTS.CURRENCY_SHOCK]:
    "Choque cambial",

  [ECONOMIC_EVENTS.CONSUMER_CONFIDENCE]:
    "Mudança na confiança do consumidor",

  [ECONOMIC_EVENTS.EMPLOYMENT_SHOCK]:
    "Mudança no mercado de trabalho",

  [ECONOMIC_EVENTS.STABLE_PERIOD]:
    "Período econômico estável"
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
  return Math.trunc(
    number(value, fallback)
  );
}


function clamp(value, min, max) {
  return Math.min(
    max,
    Math.max(
      min,
      number(value, min)
    )
  );
}


function round(value, decimals = 2) {
  const factor =
    10 ** decimals;

  return (
    Math.round(
      number(value, 0) *
        factor
    ) / factor
  );
}


function random(min = 0, max = 1) {
  return (
    Math.random() *
      (max - min) +
    min
  );
}


function randomId(prefix = "economy") {
  return (
    prefix +
    "_" +
    Date.now().toString(36) +
    "_" +
    Math.random()
      .toString(36)
      .slice(2, 8)
  );
}


function clone(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return value;
  }

  return JSON.parse(
    JSON.stringify(value)
  );
}


function getCurrentDate(database) {
  return (
    database?.meta?.currentDate ||
    database?.calendar?.currentDate ||
    new Date()
      .toISOString()
      .slice(0, 10)
  );
}


function getCurrentWeek(database) {
  return integer(
    database?.meta?.currentWeek ??
      database?.calendar?.currentWeek,
    1
  );
}


function getCurrentYear(database) {
  return integer(
    database?.meta?.currentYear ??
      database?.calendar?.currentYear,
    1
  );
}


function getCurrentMonth(database) {
  if (
    database?.calendar?.currentMonth !==
    undefined
  ) {
    return integer(
      database.calendar.currentMonth,
      1
    );
  }

  const date =
    getCurrentDate(database);

  const parsed =
    new Date(date);

  if (
    !Number.isNaN(
      parsed.getTime()
    )
  ) {
    return (
      parsed.getUTCMonth() + 1
    );
  }

  return 1;
}


// ============================================================
// DATABASE INITIALIZATION
// ============================================================

function ensureEngineState(
  database = {}
) {
  database =
    ensureDatabase(database);

  if (
    !database.economyEngine
  ) {
    database.economyEngine = {
      version:
        ECONOMY_ENGINE_VERSION,

      initialized: false,

      lastWeeklyUpdate: null,

      lastMonthlyUpdate: null,

      lastYearlyUpdate: null,

      currentMonth: 0,

      currentYear: 0,

      events: [],

      notifications: [],

      statistics: {
        weeklyUpdates: 0,
        monthlyUpdates: 0,
        yearlyUpdates: 0,
        economicEvents: 0,
        crises: 0,
        recessions: 0,
        booms: 0
      }
    };
  }

  if (
    !Array.isArray(
      database.economyEngine.events
    )
  ) {
    database.economyEngine.events = [];
  }

  if (
    !Array.isArray(
      database.economyEngine.notifications
    )
  ) {
    database.economyEngine.notifications = [];
  }

  if (
    !database.economyEngine.statistics
  ) {
    database.economyEngine.statistics = {
      weeklyUpdates: 0,
      monthlyUpdates: 0,
      yearlyUpdates: 0,
      economicEvents: 0,
      crises: 0,
      recessions: 0,
      booms: 0
    };
  }

  return database;
}


// ============================================================
// INITIALIZE ENGINE
// ============================================================

function initializeEconomyEngine(
  database
) {
  database =
    ensureEngineState(
      database
    );

  if (
    !database.economy ||
    !database.economy.global
  ) {
    database.economy =
      createEconomyState();
  }

  installEconomy(
    database
  );

  database.economyEngine.initialized =
    true;

  database.economyEngine.currentMonth =
    getCurrentMonth(database);

  database.economyEngine.currentYear =
    getCurrentYear(database);

  if (
    !database.economy.lastUpdate?.date
  ) {
    createEconomySnapshot(
      database,
      "initial"
    );
  }

  return database.economyEngine;
}


// ============================================================
// DETECT TIME CHANGE
// ============================================================

function detectEconomyTimeChange(
  database
) {
  database =
    ensureEngineState(
      database
    );

  const currentMonth =
    getCurrentMonth(database);

  const currentYear =
    getCurrentYear(database);

  const previousMonth =
    integer(
      database.economyEngine.currentMonth,
      currentMonth
    );

  const previousYear =
    integer(
      database.economyEngine.currentYear,
      currentYear
    );

  const monthChanged =
    currentMonth !==
    previousMonth;

  const yearChanged =
    currentYear !==
    previousYear;

  database.economyEngine.currentMonth =
    currentMonth;

  database.economyEngine.currentYear =
    currentYear;

  return {
    monthChanged,
    yearChanged,
    previousMonth,
    currentMonth,
    previousYear,
    currentYear
  };
}


// ============================================================
// WEEKLY PROCESS
// ============================================================

function processEconomyWeek(
  database
) {
  database =
    ensureEngineState(
      database
    );

  if (
    !database.economyEngine
      .initialized
  ) {
    initializeEconomyEngine(
      database
    );
  }

  const result =
    updateWeeklyEconomy(
      database
    );

  database.economyEngine
    .lastWeeklyUpdate = {
      date:
        getCurrentDate(database),

      week:
        getCurrentWeek(database),

      year:
        getCurrentYear(database)
    };

  database.economyEngine.statistics
    .weeklyUpdates++;

  processEconomicStateChange(
    database,
    result
  );

  processEconomicWarnings(
    database
  );

  if (
    ECONOMY_ENGINE_CONFIG
      .generateEconomicEvents
  ) {
    maybeGenerateEconomicEvent(
      database,
      "weekly"
    );
  }

  return result;
}


// ============================================================
// MONTHLY PROCESS
// ============================================================

function processEconomyMonth(
  database
) {
  database =
    ensureEngineState(
      database
    );

  if (
    !database.economyEngine
      .initialized
  ) {
    initializeEconomyEngine(
      database
    );
  }

  const result =
    updateMonthlyEconomy(
      database
    );

  database.economyEngine
    .lastMonthlyUpdate = {
      date:
        getCurrentDate(database),

      week:
        getCurrentWeek(database),

      year:
        getCurrentYear(database),

      month:
        getCurrentMonth(database)
    };

  database.economyEngine.statistics
    .monthlyUpdates++;

  processEconomicStateChange(
    database,
    result
  );

  processEconomicWarnings(
    database
  );

  if (
    ECONOMY_ENGINE_CONFIG
      .generateEconomicEvents
  ) {
    maybeGenerateEconomicEvent(
      database,
      "monthly"
    );
  }

  return result;
}


// ============================================================
// YEARLY PROCESS
// ============================================================

function processEconomyYear(
  database
) {
  database =
    ensureEngineState(
      database
    );

  const summary =
    getEconomySummary(
      database
    );

  database.economyEngine
    .lastYearlyUpdate = {
      date:
        getCurrentDate(database),

      year:
        getCurrentYear(database),

      summary
    };

  database.economyEngine.statistics
    .yearlyUpdates++;

  return summary;
}


// ============================================================
// MASTER TIME PROCESSOR
// ============================================================

function processEconomyTime(
  database,
  options = {}
) {
  database =
    ensureEngineState(
      database
    );

  if (
    !database.economyEngine
      .initialized
  ) {
    initializeEconomyEngine(
      database
    );
  }

  const result = {
    weekly: null,
    monthly: null,
    yearly: null,
    timeChange: null
  };

  result.timeChange =
    detectEconomyTimeChange(
      database
    );

  if (
    options.weekly !== false &&
    ECONOMY_ENGINE_CONFIG
      .weeklyUpdateEnabled
  ) {
    result.weekly =
      processEconomyWeek(
        database
      );
  }

  if (
    result.timeChange
      .monthChanged &&
    options.monthly !== false &&
    ECONOMY_ENGINE_CONFIG
      .monthlyUpdateEnabled
  ) {
    result.monthly =
      processEconomyMonth(
        database
      );
  }

  if (
    result.timeChange
      .yearChanged
  ) {
    result.yearly =
      processEconomyYear(
        database
      );
  }

  return result;
}


// ============================================================
// STATE CHANGE PROCESSING
// ============================================================

function processEconomicStateChange(
  database,
  result
) {
  if (
    !result ||
    !result.changed
  ) {
    return null;
  }

  const previous =
    result.previousState;

  const current =
    result.state;

  const event = {
    id:
      randomId("economicstate"),

    type:
      "state_change",

    date:
      getCurrentDate(database),

    week:
      getCurrentWeek(database),

    year:
      getCurrentYear(database),

    previousState:
      previous,

    currentState:
      current,

    label:
      ECONOMIC_STATE_LABELS[current] ||
      current,

    growthRate:
      number(
        result.growthRate,
        0
      ),

    inflation:
      number(
        result.inflation,
        0
      )
  };

  database.economyEngine.events.push(
    event
  );

  database.economyEngine.statistics
    .economicEvents++;

  if (
    current ===
    ECONOMY_STATES.CRISIS
  ) {
    database.economyEngine.statistics
      .crises++;
  }

  if (
    current ===
    ECONOMY_STATES.RECESSION
  ) {
    database.economyEngine.statistics
      .recessions++;
  }

  if (
    current ===
    ECONOMY_STATES.BOOM
  ) {
    database.economyEngine.statistics
      .booms++;
  }

  trimEngineHistory(
    database
  );

  addEconomyNotification(
    database,
    buildStateChangeMessage(
      previous,
      current
    ),
    "economy"
  );

  return event;
}


function buildStateChangeMessage(
  previous,
  current
) {
  const previousLabel =
    ECONOMIC_STATE_LABELS[
      previous
    ] ||
    previous;

  const currentLabel =
    ECONOMIC_STATE_LABELS[
      current
    ] ||
    current;

  return (
    `A economia mundial mudou de ` +
    `${previousLabel} para ` +
    `${currentLabel}.`
  );
}


// ============================================================
// RANDOM ECONOMIC EVENTS
// ============================================================

function maybeGenerateEconomicEvent(
  database,
  frequency = "monthly"
) {
  if (
    frequency === "weekly" &&
    random() >
      0.02
  ) {
    return null;
  }

  if (
    frequency === "monthly" &&
    random() >
      ECONOMY_ENGINE_CONFIG
        .eventChancePerMonth
  ) {
    return null;
  }

  return generateEconomicEvent(
    database
  );
}


function generateEconomicEvent(
  database,
  forcedType = null
) {
  database =
    ensureEngineState(
      database
    );

  const global =
    database.economy.global;

  let type =
    forcedType;

  if (!type) {
    const roll =
      random();

    if (
      roll < 0.15
    ) {
      type =
        ECONOMIC_EVENTS.MARKET_BOOM;
    } else if (
      roll < 0.30
    ) {
      type =
        ECONOMIC_EVENTS.MARKET_CRASH;
    } else if (
      roll < 0.45
    ) {
      type =
        ECONOMIC_EVENTS.INFLATION_SPIKE;
    } else if (
      roll < 0.55
    ) {
      type =
        ECONOMIC_EVENTS.INFLATION_DROP;
    } else if (
      roll < 0.67
    ) {
      type =
        ECONOMIC_EVENTS.RECESSION;
    } else if (
      roll < 0.77
    ) {
      type =
        ECONOMIC_EVENTS.RECOVERY;
    } else if (
      roll < 0.87
    ) {
      type =
        ECONOMIC_EVENTS.CURRENCY_SHOCK;
    } else if (
      roll < 0.94
    ) {
      type =
        ECONOMIC_EVENTS.CONSUMER_CONFIDENCE;
    } else {
      type =
        ECONOMIC_EVENTS.EMPLOYMENT_SHOCK;
    }
  }

  let strength =
    random(0.5, 1.25);

  switch (type) {
    case ECONOMIC_EVENTS.MARKET_BOOM:
      triggerEconomicShock(
        database,
        "boom",
        strength
      );
      break;

    case ECONOMIC_EVENTS.MARKET_CRASH:
      triggerEconomicShock(
        database,
        "recession",
        strength
      );
      break;

    case ECONOMIC_EVENTS.INFLATION_SPIKE:
      triggerEconomicShock(
        database,
        "inflation",
        strength
      );
      break;

    case ECONOMIC_EVENTS.INFLATION_DROP:
      triggerEconomicShock(
        database,
        "deflation",
        strength
      );
      break;

    case ECONOMIC_EVENTS.RECESSION:
      triggerEconomicShock(
        database,
        "recession",
        strength
      );
      break;

    case ECONOMIC_EVENTS.RECOVERY:
      triggerEconomicShock(
        database,
        "boom",
        strength * 0.5
      );
      break;

    case ECONOMIC_EVENTS.CURRENCY_SHOCK:
      updateCurrencies(
        database
      );
      break;

    case ECONOMIC_EVENTS.CONSUMER_CONFIDENCE:
      global.consumerConfidence =
        clamp(
          global.consumerConfidence +
            random(-12, 12),
          0,
          100
        );
      break;

    case ECONOMIC_EVENTS.EMPLOYMENT_SHOCK:
      global.employment =
        clamp(
          global.employment +
            random(-5, 5),
          0,
          100
        );
      break;

    default:
      return null;
  }

  global.state =
    determineEconomicState(
      global.growthRate,
      global.consumerConfidence
    );

  global.stateLabel =
    ECONOMIC_STATE_LABELS[
      global.state
    ];

  const event = {
    id:
      randomId("economicevent"),

    type,

    label:
      ECONOMIC_EVENT_LABELS[type] ||
      type,

    date:
      getCurrentDate(database),

    week:
      getCurrentWeek(database),

    year:
      getCurrentYear(database),

    month:
      getCurrentMonth(database),

    strength:
      round(strength, 3),

    economicState:
      global.state,

    growthRate:
      round(
        global.growthRate,
        5
      ),

    inflation:
      round(
        global.inflation,
        5
      ),

    consumerConfidence:
      round(
        global.consumerConfidence,
        2
      ),

    employment:
      round(
        global.employment,
        2
      ),

    marketConfidence:
      round(
        global.marketConfidence,
        2
      )
  };

  database.economyEngine.events.push(
    event
  );

  database.economyEngine.statistics
    .economicEvents++;

  trimEngineHistory(
    database
  );

  addEconomyNotification(
    database,
    buildEconomicEventMessage(
      event
    ),
    "economic_event"
  );

  return event;
}


function buildEconomicEventMessage(
  event
) {
  switch (event.type) {
    case ECONOMIC_EVENTS.MARKET_BOOM:
      return (
        "A economia entrou em forte expansão. " +
        "Bolsas, salários e patrocínios tendem a subir."
      );

    case ECONOMIC_EVENTS.MARKET_CRASH:
      return (
        "O mercado sofreu uma forte queda. " +
        "Negociações e oportunidades financeiras podem piorar."
      );

    case ECONOMIC_EVENTS.INFLATION_SPIKE:
      return (
        "A inflação aumentou. " +
        "O custo de vida e os preços estão subindo."
      );

    case ECONOMIC_EVENTS.INFLATION_DROP:
      return (
        "A inflação caiu. " +
        "O poder de compra melhorou."
      );

    case ECONOMIC_EVENTS.RECESSION:
      return (
        "Uma recessão atingiu a economia. " +
        "Organizações podem reduzir investimentos."
      );

    case ECONOMIC_EVENTS.RECOVERY:
      return (
        "A economia começou a se recuperar."
      );

    case ECONOMIC_EVENTS.CURRENCY_SHOCK:
      return (
        "O mercado cambial sofreu alterações."
      );

    case ECONOMIC_EVENTS.CONSUMER_CONFIDENCE:
      return (
        "A confiança dos consumidores mudou."
      );

    case ECONOMIC_EVENTS.EMPLOYMENT_SHOCK:
      return (
        "O mercado de trabalho sofreu uma mudança."
      );

    default:
      return (
        "A economia mundial sofreu uma alteração."
      );
  }
}


// ============================================================
// WARNINGS
// ============================================================

function processEconomicWarnings(
  database
) {
  if (
    !ECONOMY_ENGINE_CONFIG
      .notificationsEnabled
  ) {
    return [];
  }

  const warnings =
    getEconomicWarnings(
      database
    );

  for (
    const warning
    of warnings
  ) {
    addEconomyNotification(
      database,
      warning.message,
      warning.type,
      warning.severity
    );
  }

  return warnings;
}


function addEconomyNotification(
  database,
  message,
  type = "economy",
  severity = "info"
) {
  database =
    ensureEngineState(
      database
    );

  const notification = {
    id:
      randomId("econnotification"),

    type,

    severity,

    message,

    date:
      getCurrentDate(database),

    week:
      getCurrentWeek(database),

    year:
      getCurrentYear(database),

    read: false
  };

  database.economyEngine
    .notifications
    .push(notification);

  while (
    database.economyEngine
      .notifications.length >
    100
  ) {
    database.economyEngine
      .notifications
      .shift();
  }

  return notification;
}


// ============================================================
// ECONOMIC CALCULATIONS
// ============================================================

function getFightEconomicValue(
  database,
  basePurse,
  countryCode = null
) {
  return calculateFightPurse(
    database,
    basePurse,
    countryCode
  );
}


function getWinBonusEconomicValue(
  database,
  baseBonus,
  countryCode = null
) {
  return calculateWinBonus(
    database,
    baseBonus,
    countryCode
  );
}


function getSalaryEconomicValue(
  database,
  baseSalary,
  countryCode = null
) {
  return calculateSalary(
    database,
    baseSalary,
    countryCode
  );
}


function getSponsorEconomicValue(
  database,
  baseValue,
  countryCode = null
) {
  return calculateSponsorshipValue(
    database,
    baseValue,
    countryCode
  );
}


function getContractEconomicValue(
  database,
  baseValue,
  countryCode = null
) {
  return calculateContractValue(
    database,
    baseValue,
    countryCode
  );
}


function getIncomeEconomicValue(
  database,
  baseValue,
  countryCode = null
) {
  return calculateIncomeValue(
    database,
    baseValue,
    countryCode
  );
}


function getExpenseEconomicValue(
  database,
  baseValue,
  countryCode = null
) {
  return calculateSpendingCost(
    database,
    baseValue,
    countryCode
  );
}


function getInflationAdjustedValue(
  database,
  baseValue,
  months = 1,
  countryCode = null
) {
  return calculateInflationAdjustment(
    database,
    baseValue,
    months,
    countryCode
  );
}


function getAdjustedPrice(
  database,
  basePrice,
  months = 1,
  countryCode = null
) {
  return adjustPriceForInflation(
    database,
    basePrice,
    months,
    countryCode
  );
}


function getLivingCost(
  database,
  baseCost,
  countryCode = null
) {
  return calculateCostOfLiving(
    database,
    baseCost,
    countryCode
  );
}


function convertMoney(
  database,
  amount,
  fromCurrency,
  toCurrency
) {
  return convertCurrency(
    database,
    amount,
    fromCurrency,
    toCurrency
  );
}


// ============================================================
// ECONOMIC IMPACT ON PLAYER
// ============================================================

function calculatePlayerEconomicImpact(
  database,
  player = {}
) {
  database =
    ensureEngineState(
      database
    );

  const countryCode =
    player.country ||
    player.countryCode ||
    player.nationality ||
    "US";

  const global =
    database.economy.global;

  const state =
    getEconomicState(
      database
    );

  const multipliers =
    getStateMultipliers(
      database
    );

  const country =
    database.economy.countries[
      String(
        countryCode
      ).toUpperCase()
    ];

  const countryCost =
    country?.costOfLiving ||
    1;

  return {
    country:
      countryCode,

    economicState:
      state,

    economicStateLabel:
      getEconomicStateLabel(
        database
      ),

    incomeMultiplier:
      round(
        multipliers.income *
          (country?.baseSalary || 1),
        4
      ),

    purseMultiplier:
      round(
        multipliers.purse *
          (country?.basePurse || 1),
        4
      ),

    sponsorshipMultiplier:
      round(
        multipliers.sponsorship *
          (country?.sponsorMultiplier || 1),
        4
      ),

    contractMultiplier:
      round(
        multipliers.contract *
          (country?.contractMultiplier || 1),
        4
      ),

    costOfLiving:
      round(
        countryCost,
        3
      ),

    inflation:
      round(
        country?.inflation ??
          global.inflation,
        4
      ),

    purchasingPower:
      round(
        1 /
          Math.max(
            0.01,
            countryCost
          ),
        4
      )
  };
}


// ============================================================
// PROMOTION ECONOMIC IMPACT
// ============================================================

function calculatePromotionEconomicImpact(
  database,
  promotion = {}
) {
  database =
    ensureEngineState(
      database
    );

  const countryCode =
    promotion.country ||
    promotion.countryCode ||
    "US";

  const country =
    database.economy.countries[
      String(
        countryCode
      ).toUpperCase()
    ];

  const multipliers =
    getStateMultipliers(
      database
    );

  const level =
    Math.max(
      1,
      integer(
        promotion.level,
        1
      )
    );

  const levelBonus =
    1 +
    (level - 1) *
      0.08;

  return {
    country:
      countryCode,

    level,

    economicState:
      getEconomicState(
        database
      ),

    purseMultiplier:
      round(
        (country?.basePurse || 1) *
          multipliers.purse *
          levelBonus,
        4
      ),

    sponsorshipMultiplier:
      round(
        (country?.sponsorMultiplier || 1) *
          multipliers.sponsorship *
          levelBonus,
        4
      ),

    contractMultiplier:
      round(
        (country?.contractMultiplier || 1) *
          multipliers.contract *
          levelBonus,
        4
      )
  };
}


// ============================================================
// WORLD ECONOMY STATUS
// ============================================================

function getWorldEconomyStatus(
  database
) {
  database =
    ensureEngineState(
      database
    );

  return {
    version:
      ECONOMY_VERSION,

    engineVersion:
      ECONOMY_ENGINE_VERSION,

    summary:
      getEconomySummary(
        database
      ),

    health:
      getEconomicHealth(
        database
      ),

    market:
      getMarketConditions(
        database
      ),

    warnings:
      getEconomicWarnings(
        database
      ),

    state:
      getEconomicState(
        database
      ),

    stateLabel:
      getEconomicStateLabel(
        database
      )
  };
}


// ============================================================
// EVENTS / HISTORY
// ============================================================

function getEconomicEvents(
  database,
  limit = 20
) {
  database =
    ensureEngineState(
      database
    );

  return database
    .economyEngine
    .events
    .slice(
      -Math.max(
        1,
        integer(limit, 20)
      )
    )
    .map(clone);
}


function getEconomicNotifications(
  database,
  limit = 20,
  unreadOnly = false
) {
  database =
    ensureEngineState(
      database
    );

  let list =
    database
      .economyEngine
      .notifications;

  if (unreadOnly) {
    list =
      list.filter(
        item => !item.read
      );
  }

  return list
    .slice(
      -Math.max(
        1,
        integer(limit, 20)
      )
    )
    .map(clone);
}


function markEconomicNotificationRead(
  database,
  notificationId
) {
  database =
    ensureEngineState(
      database
    );

  const notification =
    database
      .economyEngine
      .notifications
      .find(
        item =>
          item.id ===
          notificationId
      );

  if (!notification) {
    return false;
  }

  notification.read = true;

  return true;
}


function markAllEconomicNotificationsRead(
  database
) {
  database =
    ensureEngineState(
      database
    );

  for (
    const notification
    of database
      .economyEngine
      .notifications
  ) {
    notification.read = true;
  }

  return true;
}


function trimEngineHistory(
  database
) {
  database =
    ensureEngineState(
      database
    );

  while (
    database
      .economyEngine
      .events.length >
    200
  ) {
    database
      .economyEngine
      .events
      .shift();
  }
}


// ============================================================
// SNAPSHOT
// ============================================================

function createEngineSnapshot(
  database
) {
  database =
    ensureEngineState(
      database
    );

  return {
    id:
      randomId("ecoengsnapshot"),

    date:
      getCurrentDate(database),

    week:
      getCurrentWeek(database),

    year:
      getCurrentYear(database),

    month:
      getCurrentMonth(database),

    engine:
      clone(
        database.economyEngine
      ),

    economy:
      clone(
        database.economy
      )
  };
}


// ============================================================
// VALIDATION
// ============================================================

function validateEconomyEngine(
  database
) {
  database =
    ensureEngineState(
      database
    );

  const economyValidation =
    validateEconomy(
      database
    );

  const errors = [
    ...economyValidation.errors
  ];

  if (
    !database.economyEngine
  ) {
    errors.push(
      "economyEngine ausente."
    );
  }

  if (
    database.economyEngine &&
    !Array.isArray(
      database.economyEngine.events
    )
  ) {
    errors.push(
      "Lista de eventos econômicos inválida."
    );
  }

  if (
    database.economyEngine &&
    !Array.isArray(
      database.economyEngine
        .notifications
    )
  ) {
    errors.push(
      "Lista de notificações econômicas inválida."
    );
  }

  return {
    valid:
      errors.length === 0,

    errors,

    economy:
      economyValidation
  };
}


// ============================================================
// RESET ENGINE
// ============================================================

function resetEconomyEngine(
  database
) {
  database =
    ensureDatabase(
      database
    );

  database.economy =
    createEconomyState();

  delete database.economyEngine;

  initializeEconomyEngine(
    database
  );

  return database.economyEngine;
}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export {
  ECONOMY_ENGINE_VERSION,

  ECONOMY_ENGINE_CONFIG,

  ECONOMIC_EVENTS,

  ECONOMIC_EVENT_LABELS,

  ensureEngineState,

  initializeEconomyEngine,

  detectEconomyTimeChange,

  processEconomyWeek,

  processEconomyMonth,

  processEconomyYear,

  processEconomyTime,

  processEconomicStateChange,

  maybeGenerateEconomicEvent,

  generateEconomicEvent,

  processEconomicWarnings,

  addEconomyNotification,

  getFightEconomicValue,

  getWinBonusEconomicValue,

  getSalaryEconomicValue,

  getSponsorEconomicValue,

  getContractEconomicValue,

  getIncomeEconomicValue,

  getExpenseEconomicValue,

  getInflationAdjustedValue,

  getAdjustedPrice,

  getLivingCost,

  convertMoney,

  calculatePlayerEconomicImpact,

  calculatePromotionEconomicImpact,

  getWorldEconomyStatus,

  getEconomicEvents,

  getEconomicNotifications,

  markEconomicNotificationRead,

  markAllEconomicNotificationsRead,

  createEngineSnapshot,

  validateEconomyEngine,

  resetEconomyEngine
};


export default {
  version:
    ECONOMY_ENGINE_VERSION,

  config:
    ECONOMY_ENGINE_CONFIG,

  events:
    ECONOMIC_EVENTS,

  initialize:
    initializeEconomyEngine,

  processWeek:
    processEconomyWeek,

  processMonth:
    processEconomyMonth,

  processYear:
    processEconomyYear,

  processTime:
    processEconomyTime,

  generateEvent:
    generateEconomicEvent,

  getFightValue:
    getFightEconomicValue,

  getWinBonus:
    getWinBonusEconomicValue,

  getSalary:
    getSalaryEconomicValue,

  getSponsorValue:
    getSponsorEconomicValue,

  getContractValue:
    getContractEconomicValue,

  getIncomeValue:
    getIncomeEconomicValue,

  getExpenseValue:
    getExpenseEconomicValue,

  getInflationAdjustedValue:
    getInflationAdjustedValue,

  getAdjustedPrice:
    getAdjustedPrice,

  getLivingCost:
    getLivingCost,

  convertMoney,

  getPlayerImpact:
    calculatePlayerEconomicImpact,

  getPromotionImpact:
    calculatePromotionEconomicImpact,

  getWorldStatus:
    getWorldEconomyStatus,

  getEvents:
    getEconomicEvents,

  getNotifications:
    getEconomicNotifications,

  markNotificationRead:
    markEconomicNotificationRead,

  markAllNotificationsRead:
    markAllEconomicNotificationsRead,

  snapshot:
    createEngineSnapshot,

  validate:
    validateEconomyEngine,

  reset:
    resetEconomyEngine
};
