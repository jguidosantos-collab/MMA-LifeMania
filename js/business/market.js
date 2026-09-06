// ============================================================
// MMA LIFE DYNASTY
// js/business/market.js
// Mercado de atletas, valor de mercado e demanda
// ============================================================

export const MARKET_VERSION = 1;

// ============================================================
// CONFIGURAÇÃO
// ============================================================

export const MARKET_CONFIG = Object.freeze({
  baseValue: 1000,

  minimumValue: 100,

  maximumValue: 1000000000,

  factors: {
    ovr: 0.35,
    potential: 0.10,
    fame: 0.20,
    ranking: 0.15,
    record: 0.08,
    titles: 0.12
  },

  winMultiplier: 1.08,
  lossMultiplier: 0.92,

  titleWinMultiplier: 1.25,
  titleDefenseMultiplier: 1.10,

  knockoutMultiplier: 1.06,
  submissionMultiplier: 1.05,

  inactivityPenalty: 0.97,

  maximumHistory: 500
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

function clamp(value, min, max) {
  return Math.min(
    max,
    Math.max(
      min,
      value
    )
  );
}

function integer(value, fallback = 0) {
  return Math.round(
    number(value, fallback)
  );
}

function clone(value) {
  if (value == null) {
    return value;
  }

  try {
    return JSON.parse(
      JSON.stringify(value)
    );
  } catch {
    return value;
  }
}

function makeId(prefix = "market") {
  return (
    prefix +
    "_" +
    Date.now().toString(36) +
    "_" +
    Math.random()
      .toString(36)
      .slice(2, 9)
  );
}

// ============================================================
// ESTRUTURA
// ============================================================

export function ensureMarket(
  database
) {
  if (!database) {
    return null;
  }

  if (!database.market) {
    database.market = {};
  }

  if (
    !database.market.fighters
  ) {
    database.market.fighters = {};
  }

  if (
    !database.market.history
  ) {
    database.market.history = [];
  }

  if (
    !database.market.transactions
  ) {
    database.market.transactions = [];
  }

  if (
    !database.market.statistics
  ) {
    database.market.statistics = {
      highestValue: 0,
      lowestValue: 0,
      averageValue: 0,
      totalTransactions: 0
    };
  }

  return database.market;
}

// ============================================================
// EXTRAÇÃO DE VALORES
// ============================================================

function getPlayer(
  database
) {
  return (
    database?.player ||
    {}
  );
}

function getAttributes(
  player
) {
  return (
    player?.attributes ||
    {}
  );
}

function getOVR(
  player
) {
  return clamp(
    number(
      player?.ovr ??
        player?.OVR ??
        player?.overall ??
        player?.rating ??
        player?.attributes?.ovr,
      0
    ),
    0,
    100
  );
}

function getPotential(
  player
) {
  return clamp(
    number(
      player?.potential ??
        player?.attributes?.potential ??
        player?.development?.potential,
      0
    ),
    0,
    100
  );
}

function getFame(
  player
) {
  return clamp(
    number(
      player?.fame ??
        player?.media?.fame ??
        databaseSafeFame(
          player
        ),
      0
    ),
    0,
    100
  );
}

function databaseSafeFame(
  player
) {
  if (
    player?.media &&
    typeof player.media ===
      "object"
  ) {
    return number(
      player.media.fame,
      0
    );
  }

  return 0;
}

function getRanking(
  player
) {
  const ranking =
    player?.ranking ??
    player?.rank ??
    player?.career?.rank ??
    player?.professional?.rank;

  if (
    ranking ===
    "champion"
  ) {
    return 0;
  }

  return Math.max(
    0,
    integer(
      ranking,
      100
    )
  );
}

function getRecord(
  player
) {
  const record =
    player?.record ??
    player?.career?.record ??
    player?.professional?.record ??
    {};

  return {
    wins: Math.max(
      0,
      integer(
        record.wins,
        0
      )
    ),

    losses: Math.max(
      0,
      integer(
        record.losses,
        0
      )
    ),

    draws: Math.max(
      0,
      integer(
        record.draws,
        0
      )
    )
  };
}

function getTitles(
  player
) {
  const titles =
    player?.titles ??
    player?.career?.titles ??
    [];

  if (
    Array.isArray(
      titles
    )
  ) {
    return titles.length;
  }

  if (
    typeof titles ===
    "number"
  ) {
    return integer(
      titles,
      0
    );
  }

  return 0;
}

// ============================================================
// SCORE DE RECORD
// ============================================================

export function calculateRecordScore(
  player
) {
  const record =
    getRecord(
      player
    );

  const total =
    record.wins +
    record.losses +
    record.draws;

  if (
    total <= 0
  ) {
    return 0;
  }

  const winRate =
    record.wins /
    total;

  const experienceBonus =
    clamp(
      total / 30,
      0,
      1
    );

  return clamp(
    (
      winRate *
        80
    ) +
      (
        experienceBonus *
        20
      ),
    0,
    100
  );
}

// ============================================================
// SCORE DE RANKING
// ============================================================

export function calculateRankingScore(
  player
) {
  const ranking =
    getRanking(
      player
    );

  if (
    ranking === 0
  ) {
    return 100;
  }

  if (
    ranking >= 100
  ) {
    return 0;
  }

  return clamp(
    100 -
      (
        ranking *
        0.9
      ),
    0,
    100
  );
}

// ============================================================
// SCORE DE TÍTULOS
// ============================================================

export function calculateTitleScore(
  player
) {
  const titles =
    getTitles(
      player
    );

  return clamp(
    titles *
      20,
    0,
    100
  );
}

// ============================================================
// SCORE DE MERCADO
// ============================================================

export function calculateMarketScore(
  player
) {
  const ovr =
    getOVR(
      player
    );

  const potential =
    getPotential(
      player
    );

  const fame =
    getFame(
      player
    );

  const ranking =
    calculateRankingScore(
      player
    );

  const record =
    calculateRecordScore(
      player
    );

  const titles =
    calculateTitleScore(
      player
    );

  const score =
    (
      ovr *
      MARKET_CONFIG.factors.ovr
    ) +
    (
      potential *
      MARKET_CONFIG.factors.potential
    ) +
    (
      fame *
      MARKET_CONFIG.factors.fame
    ) +
    (
      ranking *
      MARKET_CONFIG.factors.ranking
    ) +
    (
      record *
      MARKET_CONFIG.factors.record
    ) +
    (
      titles *
      MARKET_CONFIG.factors.titles
    );

  return clamp(
    score,
    0,
    100
  );
}

// ============================================================
// VALOR BASE
// ============================================================

export function calculateBaseMarketValue(
  player
) {
  const score =
    calculateMarketScore(
      player
    );

  const normalized =
    score /
    100;

  const exponent =
    1.8;

  const value =
    MARKET_CONFIG.baseValue *
    Math.pow(
      1 +
        normalized *
        100,
      exponent
    );

  return clamp(
    Math.round(
      value
    ),
    MARKET_CONFIG.minimumValue,
    MARKET_CONFIG.maximumValue
  );
}

// ============================================================
// VALOR DE MERCADO
// ============================================================

export function calculateMarketValue(
  player,
  options = {}
) {
  const base =
    calculateBaseMarketValue(
      player
    );

  let value =
    base;

  if (
    options.recentWin
  ) {
    value *=
      MARKET_CONFIG.winMultiplier;
  }

  if (
    options.recentLoss
  ) {
    value *=
      MARKET_CONFIG.lossMultiplier;
  }

  if (
    options.titleWin
  ) {
    value *=
      MARKET_CONFIG.titleWinMultiplier;
  }

  if (
    options.titleDefense
  ) {
    value *=
      MARKET_CONFIG.titleDefenseMultiplier;
  }

  if (
    options.knockout
  ) {
    value *=
      MARKET_CONFIG.knockoutMultiplier;
  }

  if (
    options.submission
  ) {
    value *=
      MARKET_CONFIG.submissionMultiplier;
  }

  if (
    options.inactive
  ) {
    value *=
      MARKET_CONFIG.inactivityPenalty;
  }

  if (
    options.multiplier
  ) {
    value *=
      number(
        options.multiplier,
        1
      );
  }

  return clamp(
    Math.round(
      value
    ),
    MARKET_CONFIG.minimumValue,
    MARKET_CONFIG.maximumValue
  );
}

// ============================================================
// VARIAÇÃO DE MERCADO
// ============================================================

export function calculateMarketChange(
  oldValue,
  newValue
) {
  const oldAmount =
    number(
      oldValue,
      0
    );

  const newAmount =
    number(
      newValue,
      0
    );

  const absolute =
    newAmount -
    oldAmount;

  const percentage =
    oldAmount !== 0
      ? (
          Math.round(
            (
              absolute /
              Math.abs(
                oldAmount
              )
            ) *
              10000
          ) / 100
        )
      : 0;

  return {
    absolute:
      Math.round(
        absolute
      ),

    percentage,

    direction:
      absolute > 0
        ? "up"
        : absolute < 0
          ? "down"
          : "stable"
  };
}

// ============================================================
// DEMANDA
// ============================================================

export function calculateDemand(
  player
) {
  const score =
    calculateMarketScore(
      player
    );

  if (
    score >= 90
  ) {
    return {
      score,
      level:
        "extreme",
      label:
        "Demanda extrema"
    };
  }

  if (
    score >= 75
  ) {
    return {
      score,
      level:
        "very_high",
      label:
        "Demanda muito alta"
    };
  }

  if (
    score >= 60
  ) {
    return {
      score,
      level:
        "high",
      label:
        "Demanda alta"
    };
  }

  if (
    score >= 40
  ) {
    return {
      score,
      level:
        "medium",
      label:
        "Demanda média"
    };
  }

  if (
    score >= 20
  ) {
    return {
      score,
      level:
        "low",
      label:
        "Demanda baixa"
    };
  }

  return {
    score,
    level:
      "very_low",
    label:
      "Demanda muito baixa"
  };
}

// ============================================================
// INTERESSE DE PROMOÇÃO
// ============================================================

export function calculatePromotionInterest(
  player,
  promotion = {}
) {
  const marketScore =
    calculateMarketScore(
      player
    );

  const promotionLevel =
    clamp(
      number(
        promotion.level ??
          promotion.tier ??
          promotion.rank,
        1
      ),
      1,
      5
    );

  const prestige =
    clamp(
      number(
        promotion.prestige,
        promotionLevel *
          20
      ),
      0,
      100
    );

  const gap =
    marketScore -
    prestige;

  let interest =
    50 +
    gap *
      0.5;

  if (
    promotion.isElite
  ) {
    interest =
      marketScore *
      0.9;
  }

  return clamp(
    Math.round(
      interest
    ),
    0,
    100
  );
}

// ============================================================
// INTERESSE DE PATROCINADOR
// ============================================================

export function calculateSponsorInterest(
  player,
  sponsor = {}
) {
  const fame =
    getFame(
      player
    );

  const marketScore =
    calculateMarketScore(
      player
    );

  const sponsorPrestige =
    clamp(
      number(
        sponsor.prestige,
        50
      ),
      0,
      100
    );

  const audienceFit =
    clamp(
      number(
        sponsor.audienceFit,
        50
      ),
      0,
      100
    );

  const score =
    (
      fame *
      0.4
    ) +
    (
      marketScore *
      0.3
    ) +
    (
      audienceFit *
      0.2
    ) +
    (
      sponsorPrestige *
      0.1
    );

  return clamp(
    Math.round(
      score
    ),
    0,
    100
  );
}

// ============================================================
// PODER DE NEGOCIAÇÃO
// ============================================================

export function calculateNegotiationPower(
  player
) {
  const market =
    calculateMarketScore(
      player
    );

  const fame =
    getFame(
      player
    );

  const ranking =
    calculateRankingScore(
      player
    );

  const titles =
    calculateTitleScore(
      player
    );

  const record =
    calculateRecordScore(
      player
    );

  const power =
    (
      market *
      0.35
    ) +
    (
      fame *
      0.25
    ) +
    (
      ranking *
      0.20
    ) +
    (
      titles *
      0.10
    ) +
    (
      record *
      0.10
    );

  return clamp(
    Math.round(
      power
    ),
    0,
    100
  );
}

// ============================================================
// VALOR DE CONTRATO
// ============================================================

export function calculateContractMarketValue(
  player,
  promotion = {}
) {
  const marketValue =
    calculateMarketValue(
      player
    );

  const interest =
    calculatePromotionInterest(
      player,
      promotion
    );

  const negotiation =
    calculateNegotiationPower(
      player
    );

  const promotionMultiplier =
    number(
      promotion.contractMultiplier,
      1
    );

  const value =
    marketValue *
    (
      0.5 +
      (
        interest /
        100
      )
    ) *
    (
      0.75 +
      (
        negotiation /
        400
      )
    ) *
    promotionMultiplier;

  return clamp(
    Math.round(
      value
    ),
    MARKET_CONFIG.minimumValue,
    MARKET_CONFIG.maximumValue
  );
}

// ============================================================
// REGISTRO DE LUTADOR
// ============================================================

export function updateFighterMarket(
  database,
  fighterId,
  fighter = null,
  options = {}
) {
  const market =
    ensureMarket(
      database
    );

  if (!market) {
    return null;
  }

  const player =
    fighter ||
    (
      fighterId ===
      database.player?.id
        ? database.player
        : database.world?.fighters?.[
            fighterId
          ]
    ) ||
    {};

  const previous =
    market.fighters[
      fighterId
    ];

  const previousValue =
    number(
      previous?.value,
      0
    );

  const value =
    calculateMarketValue(
      player,
      options
    );

  const change =
    calculateMarketChange(
      previousValue,
      value
    );

  const demand =
    calculateDemand(
      player
    );

  const record = {
    fighterId,

    value,

    previousValue,

    change,

    score:
      calculateMarketScore(
        player
      ),

    demand,

    negotiationPower:
      calculateNegotiationPower(
        player
      ),

    updatedAt:
      new Date().toISOString()
  };

  market.fighters[
    fighterId
  ] = record;

  market.history.push(
    {
      id:
        makeId(
          "market_history"
        ),

      ...clone(
        record
      )
    }
  );

  if (
    market.history.length >
    MARKET_CONFIG.maximumHistory
  ) {
    market.history =
      market.history.slice(
        -MARKET_CONFIG.maximumHistory
      );
  }

  updateMarketStatistics(
    database
  );

  return clone(
    record
  );
}

// ============================================================
// VALOR DO JOGADOR
// ============================================================

export function getPlayerMarketValue(
  database
) {
  const player =
    getPlayer(
      database
    );

  const fighterId =
    player.id ||
    "player";

  const market =
    ensureMarket(
      database
    );

  const existing =
    market.fighters[
      fighterId
    ];

  if (
    existing
  ) {
    return existing.value;
  }

  return calculateMarketValue(
    player
  );
}

// ============================================================
// DADOS DO MERCADO DO JOGADOR
// ============================================================

export function getPlayerMarketProfile(
  database
) {
  const player =
    getPlayer(
      database
    );

  return {
    value:
      getPlayerMarketValue(
        database
      ),

    score:
      calculateMarketScore(
        player
      ),

    demand:
      calculateDemand(
        player
      ),

    negotiationPower:
      calculateNegotiationPower(
        player
      ),

    recordScore:
      calculateRecordScore(
        player
      ),

    rankingScore:
      calculateRankingScore(
        player
      ),

    titleScore:
      calculateTitleScore(
        player
      )
  };
}

// ============================================================
// PROCESSAR RESULTADO DE LUTA
// ============================================================

export function processFightResult(
  database,
  fighterId,
  result = {}
) {
  const fighter =
    fighterId ===
    database.player?.id
      ? database.player
      : database.world?.fighters?.[
          fighterId
        ];

  if (!fighter) {
    return null;
  }

  const options = {
    recentWin:
      result.outcome ===
      "win",

    recentLoss:
      result.outcome ===
      "loss",

    titleWin:
      Boolean(
        result.titleWin
      ),

    titleDefense:
      Boolean(
        result.titleDefense
      ),

    knockout:
      [
        "ko",
        "tko",
        "knockout",
        "technical_knockout"
      ].includes(
        result.method
      ),

    submission:
      [
        "submission",
        "sub"
      ].includes(
        result.method
      )
  };

  return updateFighterMarket(
    database,
    fighterId,
    fighter,
    options
  );
}

// ============================================================
// INATIVIDADE
// ============================================================

export function processInactivity(
  database,
  fighterId
) {
  const fighter =
    fighterId ===
    database.player?.id
      ? database.player
      : database.world?.fighters?.[
          fighterId
        ];

  if (!fighter) {
    return null;
  }

  return updateFighterMarket(
    database,
    fighterId,
    fighter,
    {
      inactive:
        true
    }
  );
}

// ============================================================
// ESTATÍSTICAS DO MERCADO
// ============================================================

export function updateMarketStatistics(
  database
) {
  const market =
    ensureMarket(
      database
    );

  if (!market) {
    return null;
  }

  const values =
    Object.values(
      market.fighters
    ).map(
      fighter =>
        number(
          fighter.value,
          0
        )
    );

  if (
    values.length === 0
  ) {
    market.statistics = {
      highestValue: 0,
      lowestValue: 0,
      averageValue: 0,
      totalTransactions: 0
    };

    return market.statistics;
  }

  market.statistics.highestValue =
    Math.round(
      Math.max(
        ...values
      )
    );

  market.statistics.lowestValue =
    Math.round(
      Math.min(
        ...values
      )
    );

  market.statistics.averageValue =
    Math.round(
      values.reduce(
        (
          total,
          value
        ) =>
          total +
          value,
        0
      ) /
        values.length
    );

  market.statistics.totalTransactions =
    market.transactions.length;

  return market.statistics;
}

// ============================================================
// TRANSAÇÃO DE MERCADO
// ============================================================

export function registerMarketTransaction(
  database,
  transaction = {}
) {
  const market =
    ensureMarket(
      database
    );

  if (!market) {
    return null;
  }

  const record = {
    id:
      transaction.id ||
      makeId(
        "market_transaction"
      ),

    type:
      transaction.type ||
      "contract",

    fighterId:
      transaction.fighterId ||
      null,

    promotionId:
      transaction.promotionId ||
      null,

    sponsorId:
      transaction.sponsorId ||
      null,

    amount:
      Math.max(
        0,
        number(
          transaction.amount,
          0
        )
      ),

    date:
      transaction.date ||
      new Date().toISOString(),

    description:
      transaction.description ||
      "",

    metadata:
      clone(
        transaction.metadata ||
          {}
      )
  };

  market.transactions.push(
    record
  );

  if (
    market.transactions.length >
    MARKET_CONFIG.maximumHistory
  ) {
    market.transactions =
      market.transactions.slice(
        -MARKET_CONFIG.maximumHistory
      );
  }

  updateMarketStatistics(
    database
  );

  return clone(
    record
  );
}

// ============================================================
// HISTÓRICO DO LUTADOR
// ============================================================

export function getFighterMarketHistory(
  database,
  fighterId
) {
  const market =
    ensureMarket(
      database
    );

  if (!market) {
    return [];
  }

  return clone(
    market.history.filter(
      entry =>
        entry.fighterId ===
        fighterId
    )
  );
}

// ============================================================
// COMPARAR LUTADORES
// ============================================================

export function compareFightersMarket(
  fighterA,
  fighterB
) {
  const valueA =
    calculateMarketValue(
      fighterA
    );

  const valueB =
    calculateMarketValue(
      fighterB
    );

  const scoreA =
    calculateMarketScore(
      fighterA
    );

  const scoreB =
    calculateMarketScore(
      fighterB
    );

  return {
    fighterA: {
      value:
        valueA,
      score:
        scoreA,
      demand:
        calculateDemand(
          fighterA
        ),
      negotiationPower:
        calculateNegotiationPower(
          fighterA
        )
    },

    fighterB: {
      value:
        valueB,
      score:
        scoreB,
      demand:
        calculateDemand(
          fighterB
        ),
      negotiationPower:
        calculateNegotiationPower(
          fighterB
        )
    },

    valueDifference:
      Math.round(
        valueA -
          valueB
      ),

    scoreDifference:
      Math.round(
        scoreA -
          scoreB
      )
  };
}

// ============================================================
// RANKING DE VALOR
// ============================================================

export function getMarketLeaderboard(
  database,
  limit = 20
) {
  const market =
    ensureMarket(
      database
    );

  if (!market) {
    return [];
  }

  return Object.values(
    market.fighters
  )
    .sort(
      (
        a,
        b
      ) =>
        number(
          b.value,
          0
        ) -
        number(
          a.value,
          0
        )
    )
    .slice(
      0,
      Math.max(
        1,
        integer(
          limit,
          20
        )
      )
    )
    .map(
      (
        fighter,
        index
      ) => ({
        rank:
          index + 1,

        ...clone(
          fighter
        )
      })
    );
}

// ============================================================
// SNAPSHOT
// ============================================================

export function snapshotMarket(
  database
) {
  const market =
    ensureMarket(
      database
    );

  return clone(
    market
  );
}

// ============================================================
// VALIDAÇÃO
// ============================================================

export function validateMarket(
  database
) {
  const market =
    ensureMarket(
      database
    );

  const errors = [];

  if (!market) {
    return {
      valid: false,
      errors: [
        "Market não inicializado."
      ]
    };
  }

  if (
    typeof market.fighters !==
    "object"
  ) {
    errors.push(
      "fighters deve ser um objeto."
    );
  }

  if (
    !Array.isArray(
      market.history
    )
  ) {
    errors.push(
      "history deve ser um array."
    );
  }

  if (
    !Array.isArray(
      market.transactions
    )
  ) {
    errors.push(
      "transactions deve ser um array."
    );
  }

  for (
    const fighter of
      Object.values(
        market.fighters
      )
  ) {
    if (
      !Number.isFinite(
        Number(
          fighter.value
        )
      )
    ) {
      errors.push(
        `Valor de mercado inválido para ${fighter.fighterId || "fighter"}.`
      );
    }
  }

  return {
    valid:
      errors.length === 0,

    errors
  };
}

// ============================================================
// RESET
// ============================================================

export function resetMarket(
  database
) {
  if (!database) {
    return false;
  }

  database.market = {
    fighters: {},
    history: [],
    transactions: [],

    statistics: {
      highestValue: 0,
      lowestValue: 0,
      averageValue: 0,
      totalTransactions: 0
    }
  };

  return true;
}

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default {
  MARKET_VERSION,
  MARKET_CONFIG,

  ensureMarket,

  calculateRecordScore,
  calculateRankingScore,
  calculateTitleScore,

  calculateMarketScore,
  calculateBaseMarketValue,
  calculateMarketValue,

  calculateMarketChange,

  calculateDemand,
  calculatePromotionInterest,
  calculateSponsorInterest,

  calculateNegotiationPower,
  calculateContractMarketValue,

  updateFighterMarket,
  getPlayerMarketValue,
  getPlayerMarketProfile,

  processFightResult,
  processInactivity,

  updateMarketStatistics,

  registerMarketTransaction,

  getFighterMarketHistory,

  compareFightersMarket,

  getMarketLeaderboard,

  snapshotMarket,
  validateMarket,

  resetMarket
};
