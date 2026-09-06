// ============================================================
// MMA LIFE DYNASTY
// js/business/endorsements.js
// Sistema de contratos de publicidade, imagem e endorsements
// ============================================================

export const ENDORSEMENTS_VERSION = 1;

// ============================================================
// STATUS
// ============================================================

export const ENDORSEMENT_STATUS = Object.freeze({
  AVAILABLE: "available",
  OFFERED: "offered",
  NEGOTIATING: "negotiating",
  ACTIVE: "active",
  COMPLETED: "completed",
  REJECTED: "rejected",
  EXPIRED: "expired",
  CANCELLED: "cancelled"
});

// ============================================================
// TIPOS
// ============================================================

export const ENDORSEMENT_TYPES = Object.freeze({
  ADVERTISEMENT: "advertisement",
  SOCIAL_MEDIA: "social_media",
  AMBASSADOR: "ambassador",
  PRODUCT: "product",
  APPAREL: "apparel",
  EQUIPMENT: "equipment",
  NUTRITION: "nutrition",
  FITNESS: "fitness",
  GAMING: "gaming",
  AUTOMOTIVE: "automotive",
  FINANCIAL: "financial",
  LIFESTYLE: "lifestyle",
  LOCAL: "local",
  NATIONAL: "national",
  INTERNATIONAL: "international"
});

// ============================================================
// CONFIGURAÇÃO
// ============================================================

export const ENDORSEMENT_CONFIG = Object.freeze({
  minimumDealValue: 250,
  maximumDealValue: 50000000,

  defaultDurationMonths: 6,
  minimumDurationMonths: 1,
  maximumDurationMonths: 60,

  minimumCampaigns: 1,
  maximumCampaigns: 100,

  baseFameRequirement: 5,
  nationalFameRequirement: 30,
  internationalFameRequirement: 60,

  fameWeight: 0.30,
  followersWeight: 0.30,
  ovrWeight: 0.10,
  rankingWeight: 0.10,
  recordWeight: 0.10,
  championWeight: 0.10,

  exclusivityPremium: 0.25,
  internationalPremium: 1.50,
  nationalPremium: 0.75,
  ambassadorPremium: 1.50,

  renewalBaseChance: 0.65,

  expirationDays: 14
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
  return Math.round(
    number(value, fallback)
  );
}

function clamp(value, min, max) {
  return Math.min(
    Math.max(value, min),
    max
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

function normalizeDate(date) {
  if (!date) {
    return new Date();
  }

  const result =
    date instanceof Date
      ? new Date(date.getTime())
      : new Date(date);

  return Number.isNaN(result.getTime())
    ? new Date()
    : result;
}

function addDays(date, days) {
  const result =
    normalizeDate(date);

  result.setDate(
    result.getDate() +
    integer(days, 0)
  );

  return result;
}

function addMonths(date, months) {
  const result =
    normalizeDate(date);

  result.setMonth(
    result.getMonth() +
    integer(months, 0)
  );

  return result;
}

function isoDate(date) {
  return normalizeDate(
    date
  ).toISOString();
}

function randomId(prefix = "endorsement") {
  return (
    `${prefix}_` +
    `${Date.now()}_` +
    `${Math.floor(Math.random() * 1000000)}`
  );
}

function getNested(
  object,
  paths,
  fallback = 0
) {
  if (
    !object ||
    !Array.isArray(paths)
  ) {
    return fallback;
  }

  for (const path of paths) {
    const parts =
      path.split(".");

    let current = object;

    for (const part of parts) {
      if (
        current == null
      ) {
        current = undefined;
        break;
      }

      current =
        current[part];
    }

    if (
      current !== undefined &&
      current !== null
    ) {
      return current;
    }
  }

  return fallback;
}

// ============================================================
// DADOS DO LUTADOR
// ============================================================

function getFame(fighter) {
  return clamp(
    number(
      getNested(
        fighter,
        [
          "fame",
          "media.fame",
          "popularity",
          "reputation"
        ],
        0
      ),
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
      getNested(
        fighter,
        [
          "followers",
          "media.followers",
          "social.followers"
        ],
        0
      ),
      0
    )
  );
}

function getOVR(fighter) {
  return clamp(
    number(
      getNested(
        fighter,
        [
          "ovr",
          "overall",
          "rating",
          "attributes.ovr"
        ],
        50
      ),
      50
    ),
    1,
    100
  );
}

function getRanking(fighter) {
  const ranking =
    number(
      getNested(
        fighter,
        [
          "rank",
          "ranking",
          "career.rank",
          "career.professional.rank"
        ],
        0
      ),
      0
    );

  if (ranking <= 0) {
    return 0;
  }

  return clamp(
    31 - ranking,
    0,
    30
  ) / 30 * 100;
}

function getWins(fighter) {
  return Math.max(
    0,
    integer(
      getNested(
        fighter,
        [
          "wins",
          "record.wins",
          "career.wins",
          "career.professional.wins"
        ],
        0
      ),
      0
    )
  );
}

function getLosses(fighter) {
  return Math.max(
    0,
    integer(
      getNested(
        fighter,
        [
          "losses",
          "record.losses",
          "career.losses",
          "career.professional.losses"
        ],
        0
      ),
      0
    )
  );
}

function getFights(fighter) {
  const explicit =
    getNested(
      fighter,
      [
        "fights",
        "record.fights",
        "career.fights",
        "career.professional.fights"
      ],
      null
    );

  if (
    explicit !== null
  ) {
    return Math.max(
      0,
      integer(explicit)
    );
  }

  return (
    getWins(fighter) +
    getLosses(fighter)
  );
}

function getWinStreak(fighter) {
  return Math.max(
    0,
    integer(
      getNested(
        fighter,
        [
          "winStreak",
          "streak",
          "career.winStreak",
          "career.professional.winStreak"
        ],
        0
      ),
      0
    )
  );
}

function isChampion(fighter) {
  const champion =
    getNested(
      fighter,
      [
        "champion",
        "isChampion",
        "career.champion",
        "career.professional.champion"
      ],
      false
    );

  if (
    champion === true
  ) {
    return true;
  }

  const titles =
    getNested(
      fighter,
      [
        "titles",
        "career.titles",
        "career.professional.titles"
      ],
      []
    );

  return (
    Array.isArray(titles) &&
    titles.length > 0
  );
}

// ============================================================
// PERFIL COMERCIAL
// ============================================================

export function calculateCommercialValue(
  fighter = {}
) {
  const fame =
    getFame(fighter);

  const followers =
    getFollowers(fighter);

  const ovr =
    getOVR(fighter);

  const ranking =
    getRanking(fighter);

  const wins =
    getWins(fighter);

  const losses =
    getLosses(fighter);

  const fights =
    Math.max(
      1,
      getFights(fighter)
    );

  const streak =
    getWinStreak(fighter);

  const champion =
    isChampion(fighter);

  const winRate =
    clamp(
      wins / fights,
      0,
      1
    ) * 100;

  const followerScore =
    clamp(
      Math.log10(
        Math.max(
          followers,
          1
        )
      ) * 10,
      0,
      100
    );

  let score =
    fame * 0.30 +
    followerScore * 0.30 +
    ovr * 0.10 +
    ranking * 0.10 +
    winRate * 0.10 +
    (champion ? 100 : 0) * 0.10;

  score +=
    Math.min(
      streak * 3,
      10
    );

  score -=
    Math.min(
      losses * 0.5,
      10
    );

  return clamp(
    Math.round(score),
    0,
    100
  );
}

// ============================================================
// INTERESSE DA MARCA
// ============================================================

export function calculateBrandInterest(
  fighter = {},
  brand = {},
  options = {}
) {
  const commercialValue =
    calculateCommercialValue(
      fighter
    );

  const minimumFame =
    number(
      brand.minimumFame,
      0
    );

  const fame =
    getFame(fighter);

  let interest =
    commercialValue;

  if (
    fame < minimumFame
  ) {
    interest -=
      (minimumFame - fame) *
      2;
  }

  const brandType =
    brand.type ||
    options.type ||
    ENDORSEMENT_TYPES.ADVERTISEMENT;

  if (
    brandType ===
    ENDORSEMENT_TYPES.INTERNATIONAL
  ) {
    if (
      fame <
      ENDORSEMENT_CONFIG.internationalFameRequirement
    ) {
      interest -= 20;
    }
  }

  if (
    brandType ===
    ENDORSEMENT_TYPES.NATIONAL
  ) {
    if (
      fame <
      ENDORSEMENT_CONFIG.nationalFameRequirement
    ) {
      interest -= 10;
    }
  }

  if (
    brand.minimumCommercialValue
  ) {
    interest +=
      commercialValue >=
      number(
        brand.minimumCommercialValue
      )
        ? 10
        : -10;
  }

  interest +=
    number(
      options.modifier,
      0
    );

  return clamp(
    interest,
    0,
    100
  );
}

// ============================================================
// VALOR BASE DO CONTRATO
// ============================================================

export function calculateEndorsementValue(
  fighter = {},
  brand = {},
  options = {}
) {
  const commercialValue =
    calculateCommercialValue(
      fighter
    );

  const fame =
    getFame(fighter);

  const followers =
    getFollowers(fighter);

  const interest =
    calculateBrandInterest(
      fighter,
      brand,
      options
    );

  const durationMonths =
    clamp(
      integer(
        options.durationMonths ??
          brand.durationMonths ??
          ENDORSEMENT_CONFIG.defaultDurationMonths,
        ENDORSEMENT_CONFIG.defaultDurationMonths
      ),
      ENDORSEMENT_CONFIG.minimumDurationMonths,
      ENDORSEMENT_CONFIG.maximumDurationMonths
    );

  const campaigns =
    clamp(
      integer(
        options.campaigns ??
          brand.campaigns ??
          1,
        1
      ),
      ENDORSEMENT_CONFIG.minimumCampaigns,
      ENDORSEMENT_CONFIG.maximumCampaigns
    );

  let monthlyBase =
    250 +
    commercialValue * 75;

  monthlyBase *=
    0.50 +
    interest / 100;

  if (
    fame >= 60
  ) {
    monthlyBase *=
      1.35;
  }

  if (
    fame >= 80
  ) {
    monthlyBase *=
      1.75;
  }

  if (
    followers >= 1000000
  ) {
    monthlyBase *=
      1.50;
  } else if (
    followers >= 500000
  ) {
    monthlyBase *=
      1.25;
  } else if (
    followers >= 100000
  ) {
    monthlyBase *=
      1.10;
  }

  const brandTier =
    String(
      brand.tier ||
      options.tier ||
      "local"
    ).toLowerCase();

  if (
    brandTier ===
    "national"
  ) {
    monthlyBase *=
      ENDORSEMENT_CONFIG.nationalPremium;
  }

  if (
    brandTier ===
    "international"
  ) {
    monthlyBase *=
      ENDORSEMENT_CONFIG.internationalPremium;
  }

  const type =
    brand.type ||
    options.type ||
    ENDORSEMENT_TYPES.ADVERTISEMENT;

  if (
    type ===
    ENDORSEMENT_TYPES.AMBASSADOR
  ) {
    monthlyBase *=
      ENDORSEMENT_CONFIG.ambassadorPremium;
  }

  let total =
    monthlyBase *
    durationMonths;

  total *=
    Math.max(
      1,
      campaigns * 0.75
    );

  if (
    options.exclusivity === true ||
    brand.exclusivity === true
  ) {
    total *=
      1 +
      ENDORSEMENT_CONFIG.exclusivityPremium;
  }

  if (
    options.valueMultiplier
  ) {
    total *=
      number(
        options.valueMultiplier,
        1
      );
  }

  total =
    clamp(
      total,
      ENDORSEMENT_CONFIG.minimumDealValue,
      ENDORSEMENT_CONFIG.maximumDealValue
    );

  return Math.round(total);
}

// ============================================================
// OFERTA
// ============================================================

export function calculateEndorsementOffer(
  fighter = {},
  brand = {},
  options = {}
) {
  const durationMonths =
    clamp(
      integer(
        options.durationMonths ??
          brand.durationMonths ??
          ENDORSEMENT_CONFIG.defaultDurationMonths,
        6
      ),
      ENDORSEMENT_CONFIG.minimumDurationMonths,
      ENDORSEMENT_CONFIG.maximumDurationMonths
    );

  const campaigns =
    clamp(
      integer(
        options.campaigns ??
          brand.campaigns ??
          1,
        1
      ),
      ENDORSEMENT_CONFIG.minimumCampaigns,
      ENDORSEMENT_CONFIG.maximumCampaigns
    );

  const interest =
    calculateBrandInterest(
      fighter,
      brand,
      options
    );

  const total =
    calculateEndorsementValue(
      fighter,
      brand,
      {
        ...options,
        durationMonths,
        campaigns
      }
    );

  const signingBonus =
    Math.round(
      total *
      number(
        options.signingBonusRate,
        0.10
      )
    );

  const campaignPayment =
    Math.round(
      total /
      Math.max(
        campaigns,
        1
      )
    );

  return {
    totalValue: total,

    signingBonus,

    campaignPayment,

    monthlyValue:
      Math.round(
        total /
        Math.max(
          durationMonths,
          1
        )
      ),

    durationMonths,

    campaigns,

    interest,

    exclusivity:
      options.exclusivity === true ||
      brand.exclusivity === true
  };
}

// ============================================================
// CRIAÇÃO DO ENDORSEMENT
// ============================================================

export function createEndorsement(
  options = {}
) {
  const now =
    normalizeDate(
      options.date ||
      new Date()
    );

  const fighter =
    clone(
      options.fighter
    ) || {};

  const brand =
    clone(
      options.brand
    ) || {};

  const type =
    options.type ||
    brand.type ||
    ENDORSEMENT_TYPES.ADVERTISEMENT;

  const id =
    options.id ||
    randomId();

  const offer =
    options.offer
      ? clone(options.offer)
      : calculateEndorsementOffer(
          fighter,
          brand,
          {
            ...options,
            type
          }
        );

  const durationMonths =
    clamp(
      integer(
        offer.durationMonths,
        ENDORSEMENT_CONFIG.defaultDurationMonths
      ),
      ENDORSEMENT_CONFIG.minimumDurationMonths,
      ENDORSEMENT_CONFIG.maximumDurationMonths
    );

  const expiresAt =
    options.expiresAt
      ? isoDate(
          options.expiresAt
        )
      : isoDate(
          addDays(
            now,
            options.expirationDays ??
              ENDORSEMENT_CONFIG.expirationDays
          )
        );

  const endorsement = {
    version:
      ENDORSEMENTS_VERSION,

    id,

    status:
      options.status ||
      ENDORSEMENT_STATUS.OFFERED,

    type,

    createdAt:
      isoDate(now),

    updatedAt:
      isoDate(now),

    offerExpiresAt:
      expiresAt,

    startDate:
      null,

    endDate:
      null,

    fighter: {
      id:
        fighter.id ||
        fighter.playerId ||
        fighter.fighterId ||
        null,

      name:
        fighter.name ||
        fighter.fullName ||
        "Fighter"
    },

    brand: {
      id:
        brand.id ||
        brand.brandId ||
        null,

      name:
        brand.name ||
        brand.brandName ||
        "Brand",

      industry:
        brand.industry ||
        "general",

      tier:
        brand.tier ||
        "local"
    },

    terms: {
      totalValue:
        Math.round(
          number(
            offer.totalValue,
            0
          )
        ),

      signingBonus:
        Math.round(
          number(
            offer.signingBonus,
            0
          )
        ),

      campaignPayment:
        Math.round(
          number(
            offer.campaignPayment,
            0
          )
        ),

      monthlyValue:
        Math.round(
          number(
            offer.monthlyValue,
            0
          )
        ),

      durationMonths,

      campaigns:
        clamp(
          integer(
            offer.campaigns,
            1
          ),
          ENDORSEMENT_CONFIG.minimumCampaigns,
          ENDORSEMENT_CONFIG.maximumCampaigns
        ),

      exclusivity:
        offer.exclusivity === true,

      renewal:
        options.renewal !== false,

      category:
        brand.industry ||
        "general"
    },

    metrics: {
      commercialValue:
        calculateCommercialValue(
          fighter
        ),

      brandInterest:
        calculateBrandInterest(
          fighter,
          brand,
          options
        )
    },

    performance: {
      campaignsCompleted: 0,

      campaignsRequired:
        clamp(
          integer(
            offer.campaigns,
            1
          ),
          ENDORSEMENT_CONFIG.minimumCampaigns,
          ENDORSEMENT_CONFIG.maximumCampaigns
        ),

      performanceScore: 0,

      renewalEligible: true
    },

    conditions:
      clone(
        options.conditions
      ) || {},

    history: [
      {
        timestamp:
          isoDate(now),

        action:
          "created",

        offer:
          clone(offer)
      }
    ],

    metadata:
      clone(
        options.metadata
      ) || {}
  };

  return endorsement;
}

// ============================================================
// ACEITAR
// ============================================================

export function acceptEndorsement(
  endorsement,
  options = {}
) {
  if (!endorsement) {
    return {
      success: false,
      reason:
        "invalid_endorsement"
    };
  }

  if (
    endorsement.status !==
      ENDORSEMENT_STATUS.OFFERED &&
    endorsement.status !==
      ENDORSEMENT_STATUS.NEGOTIATING
  ) {
    return {
      success: false,
      reason:
        "endorsement_not_available"
    };
  }

  const now =
    normalizeDate(
      options.date ||
      new Date()
    );

  if (
    endorsement.offerExpiresAt &&
    new Date(
      endorsement.offerExpiresAt
    ) < now
  ) {
    endorsement.status =
      ENDORSEMENT_STATUS.EXPIRED;

    endorsement.updatedAt =
      isoDate(now);

    return {
      success: false,
      reason: "expired"
    };
  }

  endorsement.status =
    ENDORSEMENT_STATUS.ACTIVE;

  endorsement.startDate =
    isoDate(now);

  endorsement.endDate =
    isoDate(
      addMonths(
        now,
        endorsement.terms
          .durationMonths
      )
    );

  endorsement.updatedAt =
    isoDate(now);

  endorsement.history.push({
    timestamp:
      isoDate(now),

    action:
      "accepted"
  });

  return {
    success: true,
    endorsement
  };
}

// ============================================================
// REJEITAR
// ============================================================

export function rejectEndorsement(
  endorsement,
  options = {}
) {
  if (!endorsement) {
    return {
      success: false,
      reason:
        "invalid_endorsement"
    };
  }

  const now =
    normalizeDate(
      options.date ||
      new Date()
    );

  endorsement.status =
    ENDORSEMENT_STATUS.REJECTED;

  endorsement.updatedAt =
    isoDate(now);

  endorsement.history.push({
    timestamp:
      isoDate(now),

    action:
      "rejected"
  });

  return {
    success: true,
    endorsement
  };
}

// ============================================================
// CANCELAR
// ============================================================

export function cancelEndorsement(
  endorsement,
  options = {}
) {
  if (!endorsement) {
    return {
      success: false,
      reason:
        "invalid_endorsement"
    };
  }

  const now =
    normalizeDate(
      options.date ||
      new Date()
    );

  endorsement.status =
    ENDORSEMENT_STATUS.CANCELLED;

  endorsement.updatedAt =
    isoDate(now);

  endorsement.history.push({
    timestamp:
      isoDate(now),

    action:
      "cancelled",

    reason:
      options.reason ||
      null
  });

  return {
    success: true,
    endorsement
  };
}

// ============================================================
// CONCLUSÃO DE CAMPANHA
// ============================================================

export function completeCampaign(
  endorsement,
  options = {}
) {
  if (!endorsement) {
    return {
      success: false,
      reason:
        "invalid_endorsement"
    };
  }

  if (
    endorsement.status !==
    ENDORSEMENT_STATUS.ACTIVE
  ) {
    return {
      success: false,
      reason:
        "endorsement_not_active"
    };
  }

  const now =
    normalizeDate(
      options.date ||
      new Date()
    );

  const quality =
    clamp(
      number(
        options.performanceScore,
        75
      ),
      0,
      100
    );

  endorsement.performance
    .campaignsCompleted += 1;

  const completed =
    endorsement.performance
      .campaignsCompleted;

  const previousScore =
    endorsement.performance
      .performanceScore;

  endorsement.performance
    .performanceScore =
      completed === 1
        ? quality
        : (
            previousScore *
              (completed - 1) +
            quality
          ) /
          completed;

  endorsement.updatedAt =
    isoDate(now);

  endorsement.history.push({
    timestamp:
      isoDate(now),

    action:
      "campaign_completed",

    campaign:
      completed,

    performanceScore:
      quality
  });

  if (
    completed >=
    endorsement.performance
      .campaignsRequired
  ) {
    endorsement.performance
      .renewalEligible =
      true;
  }

  return {
    success: true,
    endorsement,

    campaignNumber:
      completed,

    performanceScore:
      quality
  };
}

// ============================================================
// RENOVAÇÃO
// ============================================================

export function calculateRenewalChance(
  endorsement,
  fighter = {},
  options = {}
) {
  if (!endorsement) {
    return 0;
  }

  const commercialValue =
    calculateCommercialValue(
      fighter
    );

  const performance =
    clamp(
      number(
        endorsement.performance
          ?.performanceScore,
        0
      ),
      0,
      100
    );

  const interest =
    clamp(
      number(
        endorsement.metrics
          ?.brandInterest,
        0
      ),
      0,
      100
    );

  let chance =
    ENDORSEMENT_CONFIG.renewalBaseChance;

  chance +=
    commercialValue / 500;

  chance +=
    performance / 500;

  chance +=
    interest / 500;

  if (
    endorsement.performance
      ?.renewalEligible
  ) {
    chance +=
      0.10;
  }

  chance +=
    number(
      options.modifier,
      0
    );

  return clamp(
    chance,
    0.05,
    0.98
  );
}

export function renewEndorsement(
  endorsement,
  fighter = {},
  options = {}
) {
  if (!endorsement) {
    return {
      success: false,
      reason:
        "invalid_endorsement"
    };
  }

  const chance =
    calculateRenewalChance(
      endorsement,
      fighter,
      options
    );

  const force =
    options.force === true;

  if (
    !force &&
    options.accepted !== true
  ) {
    return {
      success: false,
      reason:
        "renewal_requires_acceptance",

      chance
    };
  }

  const now =
    normalizeDate(
      options.date ||
      new Date()
    );

  const durationMonths =
    clamp(
      integer(
        options.durationMonths ??
          endorsement.terms.durationMonths,
        endorsement.terms.durationMonths
      ),
      ENDORSEMENT_CONFIG.minimumDurationMonths,
      ENDORSEMENT_CONFIG.maximumDurationMonths
    );

  endorsement.status =
    ENDORSEMENT_STATUS.ACTIVE;

  endorsement.startDate =
    isoDate(now);

  endorsement.endDate =
    isoDate(
      addMonths(
        now,
        durationMonths
      )
    );

  endorsement.terms
    .durationMonths =
      durationMonths;

  endorsement.updatedAt =
    isoDate(now);

  endorsement.history.push({
    timestamp:
      isoDate(now),

    action:
      "renewed",

    durationMonths,

    renewalChance:
      chance
  });

  return {
    success: true,
    endorsement,
    chance
  };
}

// ============================================================
// EXPIRAR
// ============================================================

export function expireEndorsement(
  endorsement,
  options = {}
) {
  if (!endorsement) {
    return {
      success: false,
      reason:
        "invalid_endorsement"
    };
  }

  const now =
    normalizeDate(
      options.date ||
      new Date()
    );

  endorsement.status =
    ENDORSEMENT_STATUS.EXPIRED;

  endorsement.updatedAt =
    isoDate(now);

  endorsement.history.push({
    timestamp:
      isoDate(now),

    action:
      "expired"
  });

  return {
    success: true,
    endorsement
  };
}

// ============================================================
// PROCESSAMENTO
// ============================================================

export function processEndorsement(
  endorsement,
  options = {}
) {
  if (!endorsement) {
    return {
      status: "invalid"
    };
  }

  const now =
    normalizeDate(
      options.date ||
      new Date()
    );

  if (
    endorsement.status ===
      ENDORSEMENT_STATUS.OFFERED ||
    endorsement.status ===
      ENDORSEMENT_STATUS.NEGOTIATING
  ) {
    if (
      endorsement.offerExpiresAt &&
      new Date(
        endorsement.offerExpiresAt
      ) < now
    ) {
      expireEndorsement(
        endorsement,
        {
          date: now
        }
      );

      return {
        status: "expired",
        endorsement
      };
    }
  }

  if (
    endorsement.status ===
    ENDORSEMENT_STATUS.ACTIVE
  ) {
    if (
      endorsement.endDate &&
      new Date(
        endorsement.endDate
      ) < now
    ) {
      endorsement.status =
        ENDORSEMENT_STATUS.COMPLETED;

      endorsement.updatedAt =
        isoDate(now);

      endorsement.history.push({
        timestamp:
          isoDate(now),

        action:
          "completed"
      });

      return {
        status: "completed",
        endorsement
      };
    }
  }

  endorsement.updatedAt =
    isoDate(now);

  return {
    status:
      endorsement.status,

    endorsement
  };
}

// ============================================================
// BANCO DE ENDORSEMENTS
// ============================================================

export function addEndorsementToDatabase(
  database,
  endorsement
) {
  if (
    !database ||
    !endorsement
  ) {
    return false;
  }

  if (
    !database.endorsements
  ) {
    database.endorsements = {};
  }

  database.endorsements[
    endorsement.id
  ] = clone(
    endorsement
  );

  return true;
}

export function getEndorsement(
  database,
  endorsementId
) {
  if (
    !database ||
    !database.endorsements ||
    !endorsementId
  ) {
    return null;
  }

  return (
    database.endorsements[
      endorsementId
    ] || null
  );
}

export function getAllEndorsements(
  database
) {
  if (
    !database ||
    !database.endorsements
  ) {
    return [];
  }

  return Object.values(
    database.endorsements
  );
}

export function getActiveEndorsements(
  database
) {
  return getAllEndorsements(
    database
  ).filter(
    endorsement =>
      endorsement.status ===
      ENDORSEMENT_STATUS.ACTIVE
  );
}

export function getAvailableEndorsements(
  database
) {
  return getAllEndorsements(
    database
  ).filter(
    endorsement =>
      endorsement.status ===
        ENDORSEMENT_STATUS.AVAILABLE ||
      endorsement.status ===
        ENDORSEMENT_STATUS.OFFERED
  );
}

export function getPlayerEndorsements(
  database,
  playerId
) {
  if (!playerId) {
    return [];
  }

  return getAllEndorsements(
    database
  ).filter(
    endorsement =>
      endorsement.fighter?.id ===
      playerId
  );
}

// ============================================================
// RESUMO
// ============================================================

export function getEndorsementSummary(
  endorsement
) {
  if (!endorsement) {
    return null;
  }

  return {
    id:
      endorsement.id,

    status:
      endorsement.status,

    type:
      endorsement.type,

    fighter:
      endorsement.fighter?.name ||
      "Fighter",

    brand:
      endorsement.brand?.name ||
      "Brand",

    industry:
      endorsement.brand?.industry ||
      "general",

    tier:
      endorsement.brand?.tier ||
      "local",

    totalValue:
      number(
        endorsement.terms?.totalValue,
        0
      ),

    signingBonus:
      number(
        endorsement.terms?.signingBonus,
        0
      ),

    monthlyValue:
      number(
        endorsement.terms?.monthlyValue,
        0
      ),

    durationMonths:
      number(
        endorsement.terms?.durationMonths,
        0
      ),

    campaigns:
      number(
        endorsement.terms?.campaigns,
        0
      ),

    campaignsCompleted:
      number(
        endorsement.performance
          ?.campaignsCompleted,
        0
      ),

    performanceScore:
      number(
        endorsement.performance
          ?.performanceScore,
        0
      ),

    commercialValue:
      number(
        endorsement.metrics
          ?.commercialValue,
        0
      ),

    brandInterest:
      number(
        endorsement.metrics
          ?.brandInterest,
        0
      ),

    exclusivity:
      endorsement.terms
        ?.exclusivity === true,

    startDate:
      endorsement.startDate,

    endDate:
      endorsement.endDate
  };
}

// ============================================================
// VALIDAÇÃO
// ============================================================

export function validateEndorsement(
  endorsement
) {
  const errors = [];

  if (!endorsement) {
    return {
      valid: false,
      errors: [
        "endorsement_missing"
      ]
    };
  }

  if (!endorsement.id) {
    errors.push(
      "id_missing"
    );
  }

  if (!endorsement.type) {
    errors.push(
      "type_missing"
    );
  }

  if (!endorsement.status) {
    errors.push(
      "status_missing"
    );
  }

  if (!endorsement.fighter) {
    errors.push(
      "fighter_missing"
    );
  }

  if (!endorsement.brand) {
    errors.push(
      "brand_missing"
    );
  }

  if (!endorsement.terms) {
    errors.push(
      "terms_missing"
    );
  }

  if (
    endorsement.terms &&
    number(
      endorsement.terms.totalValue,
      -1
    ) < 0
  ) {
    errors.push(
      "invalid_total_value"
    );
  }

  if (
    endorsement.terms &&
    number(
      endorsement.terms.durationMonths,
      0
    ) <= 0
  ) {
    errors.push(
      "invalid_duration"
    );
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

export function snapshotEndorsement(
  endorsement
) {
  return clone(
    endorsement
  );
}

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default {
  ENDORSEMENTS_VERSION,

  ENDORSEMENT_STATUS,

  ENDORSEMENT_TYPES,

  ENDORSEMENT_CONFIG,

  calculateCommercialValue,

  calculateBrandInterest,

  calculateEndorsementValue,

  calculateEndorsementOffer,

  calculateRenewalChance,

  createEndorsement,

  acceptEndorsement,

  rejectEndorsement,

  cancelEndorsement,

  completeCampaign,

  renewEndorsement,

  expireEndorsement,

  processEndorsement,

  addEndorsementToDatabase,

  getEndorsement,

  getAllEndorsements,

  getActiveEndorsements,

  getAvailableEndorsements,

  getPlayerEndorsements,

  getEndorsementSummary,

  validateEndorsement,

  snapshotEndorsement
};
