// ============================================================
// MMA LIFE DYNASTY
// js/business/negotiations.js
// Sistema de negociações
// ============================================================

export const NEGOTIATIONS_VERSION = 1;

// ============================================================
// STATUS
// ============================================================

export const NEGOTIATION_STATUS = Object.freeze({
  PENDING: "pending",
  ACTIVE: "active",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
  COMPLETED: "completed"
});

// ============================================================
// TIPOS
// ============================================================

export const NEGOTIATION_TYPES = Object.freeze({
  PROMOTION_CONTRACT: "promotion_contract",
  RENEWAL: "renewal",
  SPONSOR: "sponsor",
  MANAGER: "manager",
  FIGHT: "fight",
  BONUS: "bonus"
});

// ============================================================
// CONFIGURAÇÃO
// ============================================================

export const NEGOTIATION_CONFIG = Object.freeze({
  maxRounds: 5,

  expirationDays: 14,

  minSuccessChance: 0.05,
  maxSuccessChance: 0.95,

  minDemandMultiplier: 0.80,
  maxDemandMultiplier: 1.80,

  baseNegotiationPower: 50,

  managerInfluence: 0.15,

  ovrWeight: 0.25,
  fameWeight: 0.20,
  rankingWeight: 0.20,
  recordWeight: 0.15,
  titleWeight: 0.10,
  streakWeight: 0.10,

  promotionInterestWeight: 0.60,
  marketValueWeight: 0.40,

  counterIncrease: 0.10,

  minimumPurse: 0,
  minimumWinBonus: 0,

  defaultFightCount: 3,
  minimumFightCount: 1,
  maximumFightCount: 8
});

// ============================================================
// HELPERS
// ============================================================

function number(value, fallback = 0) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function integer(value, fallback = 0) {
  return Math.round(number(value, fallback));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function safeString(value, fallback = "") {
  return value == null ? fallback : String(value);
}

function clone(value) {
  if (value == null) return value;

  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
}

function normalizeDate(date) {
  if (!date) return new Date();

  const parsed = date instanceof Date
    ? new Date(date.getTime())
    : new Date(date);

  return Number.isNaN(parsed.getTime())
    ? new Date()
    : parsed;
}

function addDays(date, days) {
  const result = normalizeDate(date);

  result.setDate(result.getDate() + integer(days, 0));

  return result;
}

function isoDate(date) {
  return normalizeDate(date).toISOString();
}

function randomId(prefix = "neg") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
}

function normalizePercentage(value) {
  const n = number(value, 0);

  if (n <= 1) {
    return clamp(n * 100, 0, 100);
  }

  return clamp(n, 0, 100);
}

function getNested(object, paths, fallback = 0) {
  if (!object || !Array.isArray(paths)) {
    return fallback;
  }

  for (const path of paths) {
    const parts = path.split(".");
    let current = object;

    for (const part of parts) {
      if (current == null) {
        current = undefined;
        break;
      }

      current = current[part];
    }

    if (current !== undefined && current !== null) {
      return current;
    }
  }

  return fallback;
}

// ============================================================
// EXTRAÇÃO DE DADOS DO LUTADOR
// ============================================================

function getOVR(fighter) {
  return clamp(
    number(
      getNested(fighter, [
        "ovr",
        "overall",
        "rating",
        "attributes.ovr",
        "stats.ovr"
      ], 50),
      50
    ),
    1,
    100
  );
}

function getFame(fighter) {
  return clamp(
    number(
      getNested(fighter, [
        "fame",
        "media.fame",
        "popularity",
        "reputation"
      ], 0),
      0
    ),
    0,
    100
  );
}

function getFollowers(fighter) {
  return Math.max(
    0,
    integer(
      getNested(fighter, [
        "followers",
        "media.followers",
        "social.followers"
      ], 0),
      0
    )
  );
}

function getRanking(fighter) {
  const directRanking = getNested(fighter, [
    "rank",
    "ranking",
    "career.rank",
    "career.professional.rank",
    "ranking.position"
  ], 0);

  const rank = number(directRanking, 0);

  if (rank <= 0) {
    return 0;
  }

  // Quanto menor o número, melhor.
  return clamp(31 - rank, 0, 30) / 30 * 100;
}

function getWins(fighter) {
  return Math.max(
    0,
    integer(
      getNested(fighter, [
        "wins",
        "record.wins",
        "career.wins",
        "career.professional.wins",
        "record.pro.wins"
      ], 0),
      0
    )
  );
}

function getLosses(fighter) {
  return Math.max(
    0,
    integer(
      getNested(fighter, [
        "losses",
        "record.losses",
        "career.losses",
        "career.professional.losses",
        "record.pro.losses"
      ], 0),
      0
    )
  );
}

function getProfessionalFights(fighter) {
  const explicit = getNested(fighter, [
    "career.professional.fights",
    "professional.fights",
    "record.pro.fights"
  ], null);

  if (explicit !== null) {
    return Math.max(0, integer(explicit));
  }

  return getWins(fighter) + getLosses(fighter);
}

function getWinStreak(fighter) {
  return Math.max(
    0,
    integer(
      getNested(fighter, [
        "winStreak",
        "streak",
        "career.winStreak",
        "career.professional.winStreak"
      ], 0),
      0
    )
  );
}

function hasTitle(fighter) {
  const champion = getNested(fighter, [
    "champion",
    "isChampion",
    "career.champion",
    "career.professional.champion",
    "title"
  ], false);

  if (champion === true) {
    return true;
  }

  if (typeof champion === "string" && champion.length > 0) {
    return true;
  }

  const titles = getNested(fighter, [
    "titles",
    "career.titles",
    "career.professional.titles"
  ], []);

  return Array.isArray(titles) && titles.length > 0;
}

function getPromotionLevel(promotion) {
  return clamp(
    number(
      getNested(promotion, [
        "level",
        "tier",
        "rank"
      ], 1),
      1
    ),
    1,
    10
  );
}

function getManagerSkill(manager) {
  return clamp(
    number(
      getNested(manager, [
        "negotiation",
        "negotiationSkill",
        "skills.negotiation",
        "attributes.negotiation",
        "skill"
      ], 50),
      50
    ),
    0,
    100
  );
}

// ============================================================
// VALOR DE MERCADO
// ============================================================

export function calculateFighterMarketValue(fighter = {}, options = {}) {
  const ovr = getOVR(fighter);
  const fame = getFame(fighter);
  const followers = getFollowers(fighter);
  const ranking = getRanking(fighter);
  const wins = getWins(fighter);
  const losses = getLosses(fighter);
  const fights = getProfessionalFights(fighter);
  const streak = getWinStreak(fighter);
  const champion = hasTitle(fighter);

  let value = 0;

  // OVR
  value += ovr * 1000;

  // Fama
  value += fame * 2500;

  // Seguidores
  if (followers > 0) {
    value += Math.min(followers / 100, 1000000);
  }

  // Ranking
  value += ranking * 3500;

  // Experiência
  value += Math.min(fights * 3000, 150000);

  // Vitórias
  value += Math.min(wins * 5000, 300000);

  // Derrotas reduzem levemente o valor
  value -= Math.min(losses * 2000, 100000);

  // Sequência
  value += Math.min(streak * 15000, 150000);

  // Campeão
  if (champion) {
    value += 250000;
  }

  // Multiplicador de nível da promoção atual
  const promotionLevel = number(options.promotionLevel, 0);

  if (promotionLevel > 0) {
    value *= 1 + clamp(promotionLevel * 0.04, 0, 0.40);
  }

  return Math.max(0, Math.round(value));
}

// ============================================================
// PODER DE NEGOCIAÇÃO
// ============================================================

export function calculateNegotiationPower(
  fighter = {},
  manager = {},
  options = {}
) {
  const ovr = getOVR(fighter);
  const fame = getFame(fighter);
  const ranking = getRanking(fighter);

  const wins = getWins(fighter);
  const losses = getLosses(fighter);

  const fights = Math.max(
    1,
    getProfessionalFights(fighter)
  );

  const streak = getWinStreak(fighter);

  const winRate = clamp(
    wins / fights,
    0,
    1
  ) * 100;

  const titleBonus = hasTitle(fighter) ? 100 : 0;

  const recordScore = clamp(
    winRate * 0.7 +
    Math.min(wins, 20) * 1.5 -
    Math.min(losses, 15) * 1.0,
    0,
    100
  );

  const streakScore = clamp(
    streak * 12,
    0,
    100
  );

  const base =
    ovr * NEGOTIATION_CONFIG.ovrWeight +
    fame * NEGOTIATION_CONFIG.fameWeight +
    ranking * NEGOTIATION_CONFIG.rankingWeight +
    recordScore * NEGOTIATION_CONFIG.recordWeight +
    titleBonus * NEGOTIATION_CONFIG.titleWeight +
    streakScore * NEGOTIATION_CONFIG.streakWeight;

  const managerSkill = getManagerSkill(manager);

  const managerContribution =
    managerSkill *
    NEGOTIATION_CONFIG.managerInfluence;

  const result = base + managerContribution;

  return clamp(
    number(options.modifier, 1) * result,
    0,
    100
  );
}

// ============================================================
// INTERESSE DA PROMOÇÃO
// ============================================================

export function calculatePromotionInterest(
  fighter = {},
  promotion = {},
  options = {}
) {
  const ovr = getOVR(fighter);
  const fame = getFame(fighter);
  const ranking = getRanking(fighter);

  const wins = getWins(fighter);
  const fights = Math.max(
    1,
    getProfessionalFights(fighter)
  );

  const winRate = clamp(
    wins / fights,
    0,
    1
  ) * 100;

  const champion = hasTitle(fighter);

  const promotionLevel = getPromotionLevel(promotion);

  let skillScore = ovr * 0.40;
  let fameScore = fame * 0.25;
  let rankingScore = ranking * 0.20;
  let recordScore = winRate * 0.15;

  let interest =
    skillScore +
    fameScore +
    rankingScore +
    recordScore;

  if (champion) {
    interest += 10;
  }

  // Lutadores muito abaixo do nível da promoção
  // recebem um pequeno redutor.
  const expectedLevel = clamp(
    promotionLevel * 10,
    10,
    100
  );

  if (ovr + 15 < expectedLevel) {
    interest -= 10;
  }

  // Quanto mais forte a promoção, maior a exigência.
  if (promotionLevel >= 5 && ovr < 70) {
    interest -= 10;
  }

  if (promotionLevel >= 7 && ovr < 80) {
    interest -= 10;
  }

  interest += number(options.modifier, 0);

  return clamp(interest, 0, 100);
}

// ============================================================
// INTERESSE DE PATROCINADOR
// ============================================================

export function calculateSponsorInterest(
  fighter = {},
  sponsor = {},
  options = {}
) {
  const ovr = getOVR(fighter);
  const fame = getFame(fighter);
  const followers = getFollowers(fighter);
  const ranking = getRanking(fighter);

  const followerScore = clamp(
    Math.log10(Math.max(followers, 1)) * 10,
    0,
    100
  );

  let interest =
    fame * 0.35 +
    followerScore * 0.35 +
    ranking * 0.15 +
    ovr * 0.15;

  const sponsorBudget = number(
    getNested(sponsor, [
      "budget",
      "marketingBudget",
      "sponsorshipBudget"
    ], 0),
    0
  );

  if (sponsorBudget > 0) {
    interest += Math.min(
      sponsorBudget / 1000000 * 5,
      10
    );
  }

  interest += number(options.modifier, 0);

  return clamp(interest, 0, 100);
}

// ============================================================
// OFERTA INICIAL
// ============================================================

export function calculateOpeningOffer(
  fighter = {},
  party = {},
  options = {}
) {
  const type =
    options.type ||
    NEGOTIATION_TYPES.PROMOTION_CONTRACT;

  const marketValue = calculateFighterMarketValue(
    fighter,
    {
      promotionLevel: getPromotionLevel(party)
    }
  );

  const negotiationPower = calculateNegotiationPower(
    fighter,
    options.manager || {},
    options
  );

  const interest =
    type === NEGOTIATION_TYPES.SPONSOR
      ? calculateSponsorInterest(fighter, party, options)
      : calculatePromotionInterest(fighter, party, options);

  const fights = clamp(
    integer(
      options.fights,
      NEGOTIATION_CONFIG.defaultFightCount
    ),
    NEGOTIATION_CONFIG.minimumFightCount,
    NEGOTIATION_CONFIG.maximumFightCount
  );

  let purse = 0;
  let winBonus = 0;
  let signingBonus = 0;
  let performanceBonus = 0;
  let titleBonus = 0;

  if (type === NEGOTIATION_TYPES.SPONSOR) {
    const sponsorshipBase =
      Math.max(
        1000,
        marketValue * 0.02
      );

    purse =
      sponsorshipBase *
      (0.60 + interest / 200);

    signingBonus =
      purse * 0.20;

    performanceBonus =
      purse * 0.15;
  } else {
    const promotionMultiplier =
      0.40 +
      interest / 100;

    purse =
      marketValue *
      0.015 *
      promotionMultiplier;

    // Piso para não gerar contratos absurdamente baixos
    purse = Math.max(
      purse,
      300
    );

    winBonus =
      purse *
      (0.60 + negotiationPower / 200);

    signingBonus =
      purse *
      0.25;

    performanceBonus =
      purse *
      0.20;

    titleBonus =
      purse *
      0.75;
  }

  const demandMultiplier =
    clamp(
      0.85 +
      negotiationPower / 250,
      NEGOTIATION_CONFIG.minDemandMultiplier,
      NEGOTIATION_CONFIG.maxDemandMultiplier
    );

  // Uma promoção interessada paga mais.
  const interestMultiplier =
    0.75 + interest / 200;

  purse *= demandMultiplier * interestMultiplier;
  winBonus *= demandMultiplier * interestMultiplier;

  return normalizeOffer({
    purse,
    winBonus,
    signingBonus,
    performanceBonus,
    titleBonus,
    fights,
    durationMonths: Math.max(
      3,
      fights * 3
    ),
    exclusivity: true,
    renewal: true,
    marketValue,
    negotiationPower,
    interest
  });
}

// ============================================================
// NORMALIZAÇÃO DA OFERTA
// ============================================================

function normalizeOffer(offer = {}) {
  return {
    purse: Math.max(
      NEGOTIATION_CONFIG.minimumPurse,
      Math.round(number(offer.purse, 0))
    ),

    winBonus: Math.max(
      NEGOTIATION_CONFIG.minimumWinBonus,
      Math.round(number(offer.winBonus, 0))
    ),

    signingBonus: Math.max(
      0,
      Math.round(number(offer.signingBonus, 0))
    ),

    performanceBonus: Math.max(
      0,
      Math.round(number(offer.performanceBonus, 0))
    ),

    titleBonus: Math.max(
      0,
      Math.round(number(offer.titleBonus, 0))
    ),

    fights: clamp(
      integer(
        offer.fights,
        NEGOTIATION_CONFIG.defaultFightCount
      ),
      NEGOTIATION_CONFIG.minimumFightCount,
      NEGOTIATION_CONFIG.maximumFightCount
    ),

    durationMonths: Math.max(
      1,
      integer(offer.durationMonths, 12)
    ),

    exclusivity:
      offer.exclusivity !== false,

    renewal:
      offer.renewal !== false,

    marketValue: Math.max(
      0,
      Math.round(number(offer.marketValue, 0))
    ),

    negotiationPower: clamp(
      number(offer.negotiationPower, 0),
      0,
      100
    ),

    interest: clamp(
      number(offer.interest, 0),
      0,
      100
    )
  };
}

// ============================================================
// COUNTEROFFER
// ============================================================

export function calculateCounterOffer(
  currentOffer = {},
  fighter = {},
  manager = {},
  options = {}
) {
  const current = normalizeOffer(currentOffer);

  const negotiationPower =
    calculateNegotiationPower(
      fighter,
      manager,
      options
    );

  const round =
    Math.max(
      1,
      integer(options.round, 1)
    );

  const requestedMultiplier =
    clamp(
      1 +
      NEGOTIATION_CONFIG.counterIncrease +
      negotiationPower / 500 +
      (round - 1) * 0.03,
      1,
      NEGOTIATION_CONFIG.maxDemandMultiplier
    );

  const counter = {
    ...current,

    purse:
      current.purse *
      requestedMultiplier,

    winBonus:
      current.winBonus *
      requestedMultiplier,

    signingBonus:
      current.signingBonus *
      requestedMultiplier,

    performanceBonus:
      current.performanceBonus *
      requestedMultiplier,

    titleBonus:
      current.titleBonus *
      requestedMultiplier
  };

  if (options.fights !== undefined) {
    counter.fights = clamp(
      integer(options.fights),
      NEGOTIATION_CONFIG.minimumFightCount,
      NEGOTIATION_CONFIG.maximumFightCount
    );
  }

  if (options.durationMonths !== undefined) {
    counter.durationMonths = Math.max(
      1,
      integer(options.durationMonths)
    );
  }

  return normalizeOffer(counter);
}

// ============================================================
// CHANCE DE SUCESSO
// ============================================================

function calculateSuccessChance(
  negotiation,
  offer,
  options = {}
) {
  const power = clamp(
    number(
      negotiation?.metrics?.negotiationPower,
      50
    ),
    0,
    100
  );

  const interest = clamp(
    number(
      negotiation?.metrics?.interest,
      50
    ),
    0,
    100
  );

  const original = normalizeOffer(
    negotiation?.originalOffer || offer
  );

  const requested = normalizeOffer(offer);

  const originalTotal =
    original.purse +
    original.winBonus * 0.7 +
    original.signingBonus * 0.5 +
    original.performanceBonus * 0.4 +
    original.titleBonus * 0.3;

  const requestedTotal =
    requested.purse +
    requested.winBonus * 0.7 +
    requested.signingBonus * 0.5 +
    requested.performanceBonus * 0.4 +
    requested.titleBonus * 0.3;

  let demandRatio = 1;

  if (originalTotal > 0) {
    demandRatio =
      requestedTotal /
      originalTotal;
  }

  const demandPenalty =
    Math.max(
      0,
      demandRatio - 1
    ) * 35;

  let chance =
    0.35 +
    power / 250 +
    interest / 500 -
    demandPenalty / 100;

  chance += number(
    options.modifier,
    0
  );

  return clamp(
    chance,
    NEGOTIATION_CONFIG.minSuccessChance,
    NEGOTIATION_CONFIG.maxSuccessChance
  );
}

// ============================================================
// CRIAÇÃO DA NEGOCIAÇÃO
// ============================================================

export function createNegotiation(
  options = {}
) {
  const now = normalizeDate(
    options.date || new Date()
  );

  const fighter =
    clone(options.fighter) ||
    {};

  const party =
    clone(options.party) ||
    {};

  const manager =
    clone(options.manager) ||
    {};

  const type =
    options.type ||
    NEGOTIATION_TYPES.PROMOTION_CONTRACT;

  const id =
    options.id ||
    randomId("neg");

  const openingOffer =
    options.offer
      ? normalizeOffer(options.offer)
      : calculateOpeningOffer(
          fighter,
          party,
          {
            ...options,
            manager,
            type
          }
        );

  const negotiationPower =
    calculateNegotiationPower(
      fighter,
      manager,
      options
    );

  const interest =
    type === NEGOTIATION_TYPES.SPONSOR
      ? calculateSponsorInterest(
          fighter,
          party,
          options
        )
      : calculatePromotionInterest(
          fighter,
          party,
          options
        );

  const expiresAt =
    options.expiresAt
      ? isoDate(options.expiresAt)
      : isoDate(
          addDays(
            now,
            options.expirationDays ??
              NEGOTIATION_CONFIG.expirationDays
          )
        );

  const negotiation = {
    version: NEGOTIATIONS_VERSION,

    id,

    type,

    status:
      options.status ||
      NEGOTIATION_STATUS.PENDING,

    createdAt: isoDate(now),

    updatedAt: isoDate(now),

    expiresAt,

    fighter: {
      id:
        fighter.id ||
        fighter.fighterId ||
        fighter.playerId ||
        null,

      name:
        fighter.name ||
        fighter.fullName ||
        "Fighter"
    },

    counterparty: {
      id:
        party.id ||
        party.promotionId ||
        party.sponsorId ||
        null,

      name:
        party.name ||
        party.promotionName ||
        party.sponsorName ||
        "Counterparty",

      type:
        type === NEGOTIATION_TYPES.SPONSOR
          ? "sponsor"
          : "promotion"
    },

    manager: {
      id:
        manager.id ||
        manager.managerId ||
        null,

      name:
        manager.name ||
        null
    },

    originalOffer:
      clone(openingOffer),

    currentOffer:
      clone(openingOffer),

    acceptedOffer:
      null,

    metrics: {
      marketValue:
        number(
          openingOffer.marketValue,
          calculateFighterMarketValue(fighter)
        ),

      negotiationPower,

      interest,

      successChance:
        calculateSuccessChance(
          null,
          openingOffer,
          {}
        )
    },

    negotiation: {
      round: 0,

      maxRounds:
        NEGOTIATION_CONFIG.maxRounds,

      counteroffersMade: 0,

      lastAction: "created"
    },

    terms: {
      fights:
        openingOffer.fights,

      durationMonths:
        openingOffer.durationMonths,

      exclusivity:
        openingOffer.exclusivity,

      renewal:
        openingOffer.renewal
    },

    conditions:
      clone(options.conditions) || {},

    history: [
      {
        timestamp: isoDate(now),
        action: "created",
        offer: clone(openingOffer)
      }
    ],

    metadata:
      clone(options.metadata) || {}
  };

  negotiation.metrics.successChance =
    calculateSuccessChance(
      negotiation,
      negotiation.currentOffer
    );

  return negotiation;
}

// ============================================================
// REGISTRAR NO BANCO
// ============================================================

export function addNegotiationToDatabase(
  database,
  negotiation
) {
  if (!database || !negotiation) {
    return false;
  }

  if (!database.negotiations) {
    database.negotiations = {};
  }

  database.negotiations[
    negotiation.id
  ] = clone(negotiation);

  return true;
}

// ============================================================
// GET
// ============================================================

export function getNegotiation(
  database,
  negotiationId
) {
  if (
    !database ||
    !database.negotiations ||
    !negotiationId
  ) {
    return null;
  }

  return database.negotiations[
    negotiationId
  ] || null;
}

export function getAllNegotiations(
  database
) {
  if (
    !database ||
    !database.negotiations
  ) {
    return [];
  }

  return Object.values(
    database.negotiations
  );
}

export function getActiveNegotiations(
  database
) {
  return getAllNegotiations(database)
    .filter(
      negotiation =>
        negotiation.status ===
          NEGOTIATION_STATUS.PENDING ||
        negotiation.status ===
          NEGOTIATION_STATUS.ACTIVE
    );
}

export function getPlayerNegotiations(
  database,
  playerId
) {
  if (!playerId) {
    return [];
  }

  return getAllNegotiations(database)
    .filter(
      negotiation =>
        negotiation.fighter?.id === playerId
    );
}

// ============================================================
// COUNTEROFFER
// ============================================================

export function makeCounterOffer(
  negotiation,
  fighter = {},
  manager = {},
  options = {}
) {
  if (!negotiation) {
    return {
      success: false,
      reason: "invalid_negotiation"
    };
  }

  if (
    negotiation.status !==
      NEGOTIATION_STATUS.PENDING &&
    negotiation.status !==
      NEGOTIATION_STATUS.ACTIVE
  ) {
    return {
      success: false,
      reason: "negotiation_not_active"
    };
  }

  if (
    negotiation.negotiation.round >=
    negotiation.negotiation.maxRounds
  ) {
    return {
      success: false,
      reason: "maximum_rounds_reached"
    };
  }

  const now = normalizeDate(
    options.date || new Date()
  );

  if (
    new Date(negotiation.expiresAt) <
    now
  ) {
    negotiation.status =
      NEGOTIATION_STATUS.EXPIRED;

    negotiation.updatedAt =
      isoDate(now);

    return {
      success: false,
      reason: "expired"
    };
  }

  negotiation.status =
    NEGOTIATION_STATUS.ACTIVE;

  negotiation.negotiation.round += 1;

  negotiation.negotiation.counteroffersMade += 1;

  const counterOffer =
    calculateCounterOffer(
      negotiation.currentOffer,
      fighter,
      manager,
      {
        ...options,
        round:
          negotiation.negotiation.round
      }
    );

  negotiation.currentOffer =
    counterOffer;

  negotiation.terms = {
    fights: counterOffer.fights,
    durationMonths:
      counterOffer.durationMonths,
    exclusivity:
      counterOffer.exclusivity,
    renewal:
      counterOffer.renewal
  };

  negotiation.metrics.successChance =
    calculateSuccessChance(
      negotiation,
      counterOffer
    );

  negotiation.negotiation.lastAction =
    "counteroffer";

  negotiation.updatedAt =
    isoDate(now);

  negotiation.history.push({
    timestamp: isoDate(now),
    action: "counteroffer",
    round:
      negotiation.negotiation.round,
    offer:
      clone(counterOffer),
    successChance:
      negotiation.metrics.successChance
  });

  return {
    success: true,
    negotiation,
    offer: clone(counterOffer),
    successChance:
      negotiation.metrics.successChance
  };
}

// ============================================================
// ACEITAR
// ============================================================

export function acceptOffer(
  negotiation,
  options = {}
) {
  if (!negotiation) {
    return {
      success: false,
      reason: "invalid_negotiation"
    };
  }

  if (
    negotiation.status !==
      NEGOTIATION_STATUS.PENDING &&
    negotiation.status !==
      NEGOTIATION_STATUS.ACTIVE
  ) {
    return {
      success: false,
      reason: "negotiation_not_active"
    };
  }

  const now = normalizeDate(
    options.date || new Date()
  );

  if (
    new Date(negotiation.expiresAt) <
    now
  ) {
    negotiation.status =
      NEGOTIATION_STATUS.EXPIRED;

    negotiation.updatedAt =
      isoDate(now);

    return {
      success: false,
      reason: "expired"
    };
  }

  const offer =
    clone(negotiation.currentOffer);

  negotiation.status =
    NEGOTIATION_STATUS.ACCEPTED;

  negotiation.acceptedOffer =
    offer;

  negotiation.updatedAt =
    isoDate(now);

  negotiation.negotiation.lastAction =
    "accepted";

  negotiation.history.push({
    timestamp: isoDate(now),
    action: "accepted",
    round:
      negotiation.negotiation.round,
    offer:
      clone(offer)
  });

  return {
    success: true,
    negotiation,
    offer
  };
}

// ============================================================
// REJEITAR
// ============================================================

export function rejectOffer(
  negotiation,
  options = {}
) {
  if (!negotiation) {
    return {
      success: false,
      reason: "invalid_negotiation"
    };
  }

  if (
    negotiation.status !==
      NEGOTIATION_STATUS.PENDING &&
    negotiation.status !==
      NEGOTIATION_STATUS.ACTIVE
  ) {
    return {
      success: false,
      reason: "negotiation_not_active"
    };
  }

  const now = normalizeDate(
    options.date || new Date()
  );

  negotiation.status =
    NEGOTIATION_STATUS.REJECTED;

  negotiation.updatedAt =
    isoDate(now);

  negotiation.negotiation.lastAction =
    "rejected";

  negotiation.history.push({
    timestamp: isoDate(now),
    action: "rejected",
    round:
      negotiation.negotiation.round
  });

  return {
    success: true,
    negotiation
  };
}

// ============================================================
// EXPIRAR
// ============================================================

export function expireNegotiation(
  negotiation,
  options = {}
) {
  if (!negotiation) {
    return {
      success: false,
      reason: "invalid_negotiation"
    };
  }

  if (
    negotiation.status ===
      NEGOTIATION_STATUS.ACCEPTED ||
    negotiation.status ===
      NEGOTIATION_STATUS.REJECTED ||
    negotiation.status ===
      NEGOTIATION_STATUS.CANCELLED ||
    negotiation.status ===
      NEGOTIATION_STATUS.COMPLETED
  ) {
    return {
      success: false,
      reason: "cannot_expire"
    };
  }

  const now = normalizeDate(
    options.date || new Date()
  );

  negotiation.status =
    NEGOTIATION_STATUS.EXPIRED;

  negotiation.updatedAt =
    isoDate(now);

  negotiation.negotiation.lastAction =
    "expired";

  negotiation.history.push({
    timestamp: isoDate(now),
    action: "expired"
  });

  return {
    success: true,
    negotiation
  };
}

// ============================================================
// CANCELAR
// ============================================================

export function cancelNegotiation(
  negotiation,
  options = {}
) {
  if (!negotiation) {
    return {
      success: false,
      reason: "invalid_negotiation"
    };
  }

  const now = normalizeDate(
    options.date || new Date()
  );

  negotiation.status =
    NEGOTIATION_STATUS.CANCELLED;

  negotiation.updatedAt =
    isoDate(now);

  negotiation.negotiation.lastAction =
    "cancelled";

  negotiation.history.push({
    timestamp: isoDate(now),
    action: "cancelled"
  });

  return {
    success: true,
    negotiation
  };
}

// ============================================================
// PROCESSAMENTO
// ============================================================

export function processNegotiation(
  negotiation,
  options = {}
) {
  if (!negotiation) {
    return {
      status: "invalid"
    };
  }

  const now = normalizeDate(
    options.date || new Date()
  );

  if (
    negotiation.status ===
      NEGOTIATION_STATUS.PENDING ||
    negotiation.status ===
      NEGOTIATION_STATUS.ACTIVE
  ) {
    if (
      negotiation.expiresAt &&
      new Date(negotiation.expiresAt) <
        now
    ) {
      expireNegotiation(
        negotiation,
        {
          date: now
        }
      );

      return {
        status: "expired",
        negotiation
      };
    }
  }

  negotiation.updatedAt =
    isoDate(now);

  return {
    status:
      negotiation.status,
    negotiation
  };
}

// ============================================================
// COMPLETAR
// ============================================================

export function completeNegotiation(
  negotiation,
  options = {}
) {
  if (!negotiation) {
    return {
      success: false,
      reason: "invalid_negotiation"
    };
  }

  if (
    negotiation.status !==
      NEGOTIATION_STATUS.ACCEPTED
  ) {
    return {
      success: false,
      reason: "negotiation_not_accepted"
    };
  }

  const now = normalizeDate(
    options.date || new Date()
  );

  negotiation.status =
    NEGOTIATION_STATUS.COMPLETED;

  negotiation.updatedAt =
    isoDate(now);

  negotiation.negotiation.lastAction =
    "completed";

  negotiation.history.push({
    timestamp: isoDate(now),
    action: "completed",
    offer:
      clone(
        negotiation.acceptedOffer
      )
  });

  return {
    success: true,
    negotiation
  };
}

// ============================================================
// RESUMO
// ============================================================

export function getNegotiationSummary(
  negotiation
) {
  if (!negotiation) {
    return null;
  }

  const offer =
    negotiation.currentOffer || {};

  return {
    id:
      negotiation.id,

    type:
      negotiation.type,

    status:
      negotiation.status,

    fighter:
      negotiation.fighter?.name ||
      "Fighter",

    counterparty:
      negotiation.counterparty?.name ||
      "Counterparty",

    purse:
      number(offer.purse, 0),

    winBonus:
      number(offer.winBonus, 0),

    signingBonus:
      number(offer.signingBonus, 0),

    performanceBonus:
      number(
        offer.performanceBonus,
        0
      ),

    titleBonus:
      number(
        offer.titleBonus,
        0
      ),

    fights:
      number(offer.fights, 0),

    durationMonths:
      number(
        offer.durationMonths,
        0
      ),

    negotiationPower:
      number(
        negotiation.metrics?.negotiationPower,
        0
      ),

    interest:
      number(
        negotiation.metrics?.interest,
        0
      ),

    successChance:
      number(
        negotiation.metrics?.successChance,
        0
      ),

    round:
      number(
        negotiation.negotiation?.round,
        0
      ),

    expiresAt:
      negotiation.expiresAt
  };
}

// ============================================================
// VALIDAÇÃO
// ============================================================

export function validateNegotiation(
  negotiation
) {
  const errors = [];

  if (!negotiation) {
    return {
      valid: false,
      errors: ["negotiation_missing"]
    };
  }

  if (!negotiation.id) {
    errors.push("id_missing");
  }

  if (!negotiation.type) {
    errors.push("type_missing");
  }

  if (!negotiation.status) {
    errors.push("status_missing");
  }

  if (!negotiation.fighter) {
    errors.push("fighter_missing");
  }

  if (!negotiation.counterparty) {
    errors.push("counterparty_missing");
  }

  if (!negotiation.currentOffer) {
    errors.push("current_offer_missing");
  }

  if (
    negotiation.currentOffer &&
    number(
      negotiation.currentOffer.purse,
      -1
    ) < 0
  ) {
    errors.push("invalid_purse");
  }

  if (
    negotiation.currentOffer &&
    number(
      negotiation.currentOffer.winBonus,
      -1
    ) < 0
  ) {
    errors.push("invalid_win_bonus");
  }

  return {
    valid:
      errors.length === 0,

    errors
  };
}

// ============================================================
// SNAPSHOT
// ============================================================

export function snapshotNegotiation(
  negotiation
) {
  return clone(negotiation);
}

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default {
  NEGOTIATIONS_VERSION,
  NEGOTIATION_STATUS,
  NEGOTIATION_TYPES,
  NEGOTIATION_CONFIG,

  calculateFighterMarketValue,
  calculateNegotiationPower,
  calculatePromotionInterest,
  calculateSponsorInterest,

  calculateOpeningOffer,
  calculateCounterOffer,

  createNegotiation,

  makeCounterOffer,
  acceptOffer,
  rejectOffer,
  expireNegotiation,
  cancelNegotiation,
  completeNegotiation,

  processNegotiation,

  addNegotiationToDatabase,
  getNegotiation,
  getAllNegotiations,
  getActiveNegotiations,
  getPlayerNegotiations,

  getNegotiationSummary,
  validateNegotiation,
  snapshotNegotiation
};
