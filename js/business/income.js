// ============================================================
// MMA LIFE DYNASTY
// js/business/income.js
// Sistema central de receitas do jogador
// ============================================================

export const INCOME_VERSION = 1;

// ============================================================
// TIPOS DE RECEITA
// ============================================================

export const INCOME_TYPES = Object.freeze({
  FIGHT_PURSE: "fight_purse",
  WIN_BONUS: "win_bonus",
  PERFORMANCE_BONUS: "performance_bonus",
  TITLE_BONUS: "title_bonus",
  SIGNING_BONUS: "signing_bonus",
  SPONSORSHIP: "sponsorship",
  ENDORSEMENT: "endorsement",
  PPV: "ppv",
  TOURNAMENT: "tournament",
  PRIZE: "prize",
  APPEARANCE: "appearance",
  SOCIAL_MEDIA: "social_media",
  MERCHANDISE: "merchandise",
  INVESTMENT: "investment",
  BUSINESS: "business",
  SALARY: "salary",
  COACHING: "coaching",
  COMMENTARY: "commentary",
  OWN_PROMOTION: "own_promotion",
  INHERITANCE: "inheritance",
  GIFT: "gift",
  OTHER: "other"
});

// ============================================================
// CONFIGURAÇÃO
// ============================================================

export const INCOME_CONFIG = Object.freeze({
  minimumAmount: 0,

  maximumAmount: 1000000000000,

  defaultCurrency: "USD",

  ppvDefaultShare: 0.01,

  ppvMinimumBuyers: 0,

  historyLimit: 500,

  taxEnabled: false,

  defaultTaxRate: 0,

  inflationRate: 0
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

  return Number.isNaN(
    result.getTime()
  )
    ? new Date()
    : result;
}

function isoDate(date) {
  return normalizeDate(
    date
  ).toISOString();
}

function randomId(prefix = "income") {
  return (
    `${prefix}_` +
    `${Date.now()}_` +
    `${Math.floor(Math.random() * 1000000)}`
  );
}

// ============================================================
// NORMALIZAÇÃO
// ============================================================

function normalizeIncome(input = {}) {
  const grossAmount =
    clamp(
      number(
        input.grossAmount ??
          input.amount ??
          input.value,
        0
      ),
      INCOME_CONFIG.minimumAmount,
      INCOME_CONFIG.maximumAmount
    );

  const taxRate =
    clamp(
      number(
        input.taxRate ??
          INCOME_CONFIG.defaultTaxRate,
        0
      ),
      0,
      1
    );

  const tax =
    input.taxEnabled === false &&
    input.taxRate === undefined
      ? 0
      : Math.round(
          grossAmount *
          taxRate
        );

  const netAmount =
    Math.max(
      0,
      Math.round(
        grossAmount - tax
      )
    );

  return {
    grossAmount:
      Math.round(grossAmount),

    tax:
      Math.round(tax),

    netAmount,

    currency:
      input.currency ||
      INCOME_CONFIG.defaultCurrency,

    type:
      input.type ||
      INCOME_TYPES.OTHER,

    source:
      input.source ||
      "unknown",

    description:
      input.description ||
      "",

    recurring:
      input.recurring === true,

    recurringPeriod:
      input.recurringPeriod ||
      null,

    referenceId:
      input.referenceId ||
      null,

    promotionId:
      input.promotionId ||
      null,

    sponsorId:
      input.sponsorId ||
      null,

    endorsementId:
      input.endorsementId ||
      null,

    fightId:
      input.fightId ||
      null,

    eventId:
      input.eventId ||
      null,

    metadata:
      clone(
        input.metadata
      ) || {}
  };
}

// ============================================================
// CRIAÇÃO DE TRANSAÇÃO
// ============================================================

export function createIncome(
  input = {}
) {
  const now =
    normalizeDate(
      input.date ||
      new Date()
    );

  const normalized =
    normalizeIncome(input);

  return {
    version:
      INCOME_VERSION,

    id:
      input.id ||
      randomId(),

    date:
      isoDate(now),

    createdAt:
      isoDate(now),

    ...normalized
  };
}

// ============================================================
// RECEITAS DE LUTA
// ============================================================

export function createFightPurseIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.FIGHT_PURSE,

    source:
      options.source ||
      "fight",

    description:
      options.description ||
      "Fight purse",

    fightId:
      options.fightId ||
      null,

    eventId:
      options.eventId ||
      null,

    promotionId:
      options.promotionId ||
      null
  });
}

export function createWinBonusIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.WIN_BONUS,

    source:
      options.source ||
      "fight",

    description:
      options.description ||
      "Win bonus",

    fightId:
      options.fightId ||
      null,

    eventId:
      options.eventId ||
      null,

    promotionId:
      options.promotionId ||
      null
  });
}

export function createPerformanceBonusIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.PERFORMANCE_BONUS,

    source:
      options.source ||
      "fight",

    description:
      options.description ||
      "Performance bonus",

    fightId:
      options.fightId ||
      null,

    eventId:
      options.eventId ||
      null,

    promotionId:
      options.promotionId ||
      null
  });
}

export function createTitleBonusIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.TITLE_BONUS,

    source:
      options.source ||
      "title",

    description:
      options.description ||
      "Title bonus",

    fightId:
      options.fightId ||
      null,

    eventId:
      options.eventId ||
      null,

    promotionId:
      options.promotionId ||
      null
  });
}

export function createSigningBonusIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.SIGNING_BONUS,

    source:
      options.source ||
      "contract",

    description:
      options.description ||
      "Contract signing bonus",

    promotionId:
      options.promotionId ||
      null
  });
}

// ============================================================
// PATROCÍNIOS
// ============================================================

export function createSponsorshipIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.SPONSORSHIP,

    source:
      options.source ||
      "sponsor",

    description:
      options.description ||
      "Sponsorship payment",

    sponsorId:
      options.sponsorId ||
      null
  });
}

// ============================================================
// ENDORSEMENTS
// ============================================================

export function createEndorsementIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.ENDORSEMENT,

    source:
      options.source ||
      "endorsement",

    description:
      options.description ||
      "Endorsement payment",

    endorsementId:
      options.endorsementId ||
      null,

    sponsorId:
      options.sponsorId ||
      null
  });
}

// ============================================================
// PPV
// ============================================================

export function calculatePPVIncome(
  options = {}
) {
  const buyers =
    Math.max(
      INCOME_CONFIG.ppvMinimumBuyers,
      integer(
        options.buyers,
        0
      )
    );

  const ppvPrice =
    Math.max(
      0,
      number(
        options.ppvPrice,
        0
      )
    );

  const share =
    clamp(
      number(
        options.share ??
          INCOME_CONFIG.ppvDefaultShare,
        INCOME_CONFIG.ppvDefaultShare
      ),
      0,
      1
    );

  const grossRevenue =
    buyers *
    ppvPrice;

  const fighterRevenue =
    grossRevenue *
    share;

  return {
    buyers,

    ppvPrice,

    share,

    grossRevenue,

    fighterRevenue:
      Math.round(
        fighterRevenue
      )
  };
}

export function createPPVIncome(
  options = {}
) {
  const calculated =
    calculatePPVIncome(
      options
    );

  return createIncome({
    ...options,

    amount:
      options.amount ??
      calculated.fighterRevenue,

    type:
      INCOME_TYPES.PPV,

    source:
      options.source ||
      "ppv",

    description:
      options.description ||
      "PPV revenue",

    eventId:
      options.eventId ||
      null,

    metadata: {
      ...(
        options.metadata ||
        {}
      ),

      buyers:
        calculated.buyers,

      ppvPrice:
        calculated.ppvPrice,

      share:
        calculated.share,

      grossRevenue:
        calculated.grossRevenue
    }
  });
}

// ============================================================
// PREMIAÇÕES
// ============================================================

export function createPrizeIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.PRIZE,

    source:
      options.source ||
      "prize",

    description:
      options.description ||
      "Prize money"
  });
}

export function createTournamentIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.TOURNAMENT,

    source:
      options.source ||
      "tournament",

    description:
      options.description ||
      "Tournament prize"
  });
}

// ============================================================
// APARIÇÕES
// ============================================================

export function createAppearanceIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.APPEARANCE,

    source:
      options.source ||
      "appearance",

    description:
      options.description ||
      "Public appearance"
  });
}

export function createSocialMediaIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.SOCIAL_MEDIA,

    source:
      options.source ||
      "social_media",

    description:
      options.description ||
      "Social media revenue"
  });
}

// ============================================================
// MERCHANDISE
// ============================================================

export function createMerchandiseIncome(
  options = {}
) {
  const units =
    Math.max(
      0,
      integer(
        options.units,
        0
      )
    );

  const unitProfit =
    Math.max(
      0,
      number(
        options.unitProfit,
        0
      )
    );

  const calculated =
    units *
    unitProfit;

  return createIncome({
    ...options,

    amount:
      options.amount ??
      calculated,

    type:
      INCOME_TYPES.MERCHANDISE,

    source:
      options.source ||
      "merchandise",

    description:
      options.description ||
      "Merchandise revenue",

    metadata: {
      ...(
        options.metadata ||
        {}
      ),

      units,

      unitProfit
    }
  });
}

// ============================================================
// INVESTIMENTOS
// ============================================================

export function createInvestmentIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.INVESTMENT,

    source:
      options.source ||
      "investment",

    description:
      options.description ||
      "Investment return"
  });
}

// ============================================================
// NEGÓCIOS
// ============================================================

export function createBusinessIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.BUSINESS,

    source:
      options.source ||
      "business",

    description:
      options.description ||
      "Business revenue"
  });
}

// ============================================================
// SALÁRIO
// ============================================================

export function createSalaryIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.SALARY,

    source:
      options.source ||
      "employment",

    description:
      options.description ||
      "Salary"
  });
}

// ============================================================
// COACHING / COMENTÁRIOS
// ============================================================

export function createCoachingIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.COACHING,

    source:
      options.source ||
      "coaching",

    description:
      options.description ||
      "Coaching income"
  });
}

export function createCommentaryIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.COMMENTARY,

    source:
      options.source ||
      "commentary",

    description:
      options.description ||
      "Commentary income"
  });
}

// ============================================================
// PROMOÇÃO PRÓPRIA
// ============================================================

export function createOwnPromotionIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.OWN_PROMOTION,

    source:
      options.source ||
      "own_promotion",

    description:
      options.description ||
      "Own promotion revenue"
  });
}

// ============================================================
// HERANÇA
// ============================================================

export function createInheritanceIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.INHERITANCE,

    source:
      options.source ||
      "inheritance",

    description:
      options.description ||
      "Inheritance received"
  });
}

// ============================================================
// PRESENTES
// ============================================================

export function createGiftIncome(
  options = {}
) {
  return createIncome({
    ...options,

    type:
      INCOME_TYPES.GIFT,

    source:
      options.source ||
      "gift",

    description:
      options.description ||
      "Gift received"
  });
}

// ============================================================
// BANCO DE RECEITAS
// ============================================================

export function addIncomeToDatabase(
  database,
  income
) {
  if (
    !database ||
    !income
  ) {
    return false;
  }

  if (
    !database.income
  ) {
    database.income = {};
  }

  database.income[
    income.id
  ] = clone(income);

  trimIncomeHistory(
    database
  );

  return true;
}

function trimIncomeHistory(
  database
) {
  if (
    !database ||
    !database.income
  ) {
    return;
  }

  const entries =
    Object.entries(
      database.income
    );

  if (
    entries.length <=
    INCOME_CONFIG.historyLimit
  ) {
    return;
  }

  entries.sort(
    (
      [, a],
      [, b]
    ) =>
      new Date(
        a.date
      ) -
      new Date(
        b.date
      )
  );

  const removeCount =
    entries.length -
    INCOME_CONFIG.historyLimit;

  for (
    let i = 0;
    i < removeCount;
    i++
  ) {
    delete database.income[
      entries[i][0]
    ];
  }
}

// ============================================================
// CONSULTAS
// ============================================================

export function getIncome(
  database,
  incomeId
) {
  if (
    !database ||
    !database.income ||
    !incomeId
  ) {
    return null;
  }

  return (
    database.income[
      incomeId
    ] || null
  );
}

export function getAllIncome(
  database
) {
  if (
    !database ||
    !database.income
  ) {
    return [];
  }

  return Object.values(
    database.income
  );
}

export function getIncomeByType(
  database,
  type
) {
  return getAllIncome(
    database
  ).filter(
    income =>
      income.type === type
  );
}

export function getIncomeBySource(
  database,
  source
) {
  return getAllIncome(
    database
  ).filter(
    income =>
      income.source === source
  );
}

export function getPlayerIncome(
  database,
  playerId
) {
  if (
    !playerId
  ) {
    return [];
  }

  return getAllIncome(
    database
  ).filter(
    income =>
      income.playerId ===
      playerId
  );
}

// ============================================================
// TOTAIS
// ============================================================

export function calculateTotalIncome(
  database,
  options = {}
) {
  let incomes =
    getAllIncome(
      database
    );

  if (
    options.type
  ) {
    incomes =
      incomes.filter(
        income =>
          income.type ===
          options.type
      );
  }

  if (
    options.source
  ) {
    incomes =
      incomes.filter(
        income =>
          income.source ===
          options.source
      );
  }

  if (
    options.startDate
  ) {
    const start =
      new Date(
        options.startDate
      );

    incomes =
      incomes.filter(
        income =>
          new Date(
            income.date
          ) >= start
      );
  }

  if (
    options.endDate
  ) {
    const end =
      new Date(
        options.endDate
      );

    incomes =
      incomes.filter(
        income =>
          new Date(
            income.date
          ) <= end
      );
  }

  const gross =
    incomes.reduce(
      (
        total,
        income
      ) =>
        total +
        number(
          income.grossAmount,
          0
        ),
      0
    );

  const taxes =
    incomes.reduce(
      (
        total,
        income
      ) =>
        total +
        number(
          income.tax,
          0
        ),
      0
    );

  const net =
    incomes.reduce(
      (
        total,
        income
      ) =>
        total +
        number(
          income.netAmount,
          income.grossAmount
        ),
      0
    );

  return {
    count:
      incomes.length,

    gross:
      Math.round(gross),

    taxes:
      Math.round(taxes),

    net:
      Math.round(net)
  };
}

// ============================================================
// RESUMO POR TIPO
// ============================================================

export function getIncomeBreakdown(
  database,
  options = {}
) {
  const incomes =
    getAllIncome(
      database
    );

  const breakdown = {};

  for (
    const income of incomes
  ) {
    if (
      options.startDate &&
      new Date(
        income.date
      ) <
      new Date(
        options.startDate
      )
    ) {
      continue;
    }

    if (
      options.endDate &&
      new Date(
        income.date
      ) >
      new Date(
        options.endDate
      )
    ) {
      continue;
    }

    const type =
      income.type ||
      INCOME_TYPES.OTHER;

    if (
      !breakdown[type]
    ) {
      breakdown[type] = {
        count: 0,
        gross: 0,
        taxes: 0,
        net: 0
      };
    }

    breakdown[type].count += 1;

    breakdown[type].gross +=
      number(
        income.grossAmount,
        0
      );

    breakdown[type].taxes +=
      number(
        income.tax,
        0
      );

    breakdown[type].net +=
      number(
        income.netAmount,
        income.grossAmount
      );
  }

  for (
    const type of Object.keys(
      breakdown
    )
  ) {
    breakdown[type].gross =
      Math.round(
        breakdown[type].gross
      );

    breakdown[type].taxes =
      Math.round(
        breakdown[type].taxes
      );

    breakdown[type].net =
      Math.round(
        breakdown[type].net
      );
  }

  return breakdown;
}

// ============================================================
// RESUMO POR ANO
// ============================================================

export function getAnnualIncome(
  database,
  year
) {
  const incomes =
    getAllIncome(
      database
    );

  const targetYear =
    integer(year, 0);

  return incomes.filter(
    income =>
      new Date(
        income.date
      ).getFullYear() ===
      targetYear
  );
}

export function calculateAnnualIncome(
  database,
  year
) {
  const incomes =
    getAnnualIncome(
      database,
      year
    );

  return incomes.reduce(
    (
      total,
      income
    ) =>
      total +
      number(
        income.netAmount,
        income.grossAmount
      ),
    0
  );
}

// ============================================================
// RESUMO MENSAL
// ============================================================

export function getMonthlyIncome(
  database,
  year,
  month
) {
  const incomes =
    getAllIncome(
      database
    );

  const targetYear =
    integer(year, 0);

  const targetMonth =
    integer(month, 0);

  return incomes.filter(
    income => {
      const date =
        new Date(
          income.date
        );

      return (
        date.getFullYear() ===
          targetYear &&
        date.getMonth() + 1 ===
          targetMonth
      );
    }
  );
}

export function calculateMonthlyIncome(
  database,
  year,
  month
) {
  const incomes =
    getMonthlyIncome(
      database,
      year,
      month
    );

  return incomes.reduce(
    (
      total,
      income
    ) =>
      total +
      number(
        income.netAmount,
        income.grossAmount
      ),
    0
  );
}

// ============================================================
// MÉDIA
// ============================================================

export function calculateAverageIncome(
  database,
  options = {}
) {
  const result =
    calculateTotalIncome(
      database,
      options
    );

  if (
    result.count <= 0
  ) {
    return 0;
  }

  return Math.round(
    result.net /
    result.count
  );
}

// ============================================================
// MAIOR RECEITA
// ============================================================

export function getLargestIncome(
  database,
  options = {}
) {
  const incomes =
    getAllIncome(
      database
    );

  if (
    incomes.length === 0
  ) {
    return null;
  }

  let filtered =
    incomes;

  if (
    options.type
  ) {
    filtered =
      filtered.filter(
        income =>
          income.type ===
          options.type
      );
  }

  if (
    options.startDate
  ) {
    filtered =
      filtered.filter(
        income =>
          new Date(
            income.date
          ) >=
          new Date(
            options.startDate
          )
      );
  }

  if (
    options.endDate
  ) {
    filtered =
      filtered.filter(
        income =>
          new Date(
            income.date
          ) <=
          new Date(
            options.endDate
          )
      );
  }

  if (
    filtered.length ===
    0
  ) {
    return null;
  }

  return filtered.reduce(
    (
      largest,
      current
    ) =>
      number(
        current.netAmount,
        0
      ) >
      number(
        largest.netAmount,
        0
      )
        ? current
        : largest
  );
}

// ============================================================
// RECEITAS RECORRENTES
// ============================================================

export function getRecurringIncome(
  database
) {
  return getAllIncome(
    database
  ).filter(
    income =>
      income.recurring ===
      true
  );
}

// ============================================================
// PROJEÇÃO
// ============================================================

export function projectRecurringIncome(
  database,
  months = 12
) {
  const recurring =
    getRecurringIncome(
      database
    );

  const targetMonths =
    Math.max(
      0,
      integer(months, 12)
    );

  let monthly =
    0;

  for (
    const income of recurring
  ) {
    const amount =
      number(
        income.netAmount,
        income.grossAmount
      );

    const period =
      String(
        income.recurringPeriod ||
        "monthly"
      ).toLowerCase();

    if (
      period === "weekly"
    ) {
      monthly +=
        amount * 4.33;
    } else if (
      period === "yearly" ||
      period === "annual"
    ) {
      monthly +=
        amount / 12;
    } else {
      monthly +=
        amount;
    }
  }

  return {
    monthly:
      Math.round(
        monthly
      ),

    yearly:
      Math.round(
        monthly * 12
      ),

    periodMonths:
      targetMonths,

    projected:
      Math.round(
        monthly *
        targetMonths
      )
  };
}

// ============================================================
// VALIDAÇÃO
// ============================================================

export function validateIncome(
  income
) {
  const errors = [];

  if (!income) {
    return {
      valid: false,
      errors: [
        "income_missing"
      ]
    };
  }

  if (!income.id) {
    errors.push(
      "id_missing"
    );
  }

  if (!income.type) {
    errors.push(
      "type_missing"
    );
  }

  if (
    number(
      income.grossAmount,
      -1
    ) < 0
  ) {
    errors.push(
      "invalid_gross_amount"
    );
  }

  if (
    number(
      income.netAmount,
      -1
    ) < 0
  ) {
    errors.push(
      "invalid_net_amount"
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

export function snapshotIncome(
  income
) {
  return clone(
    income
  );
}

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default {
  INCOME_VERSION,

  INCOME_TYPES,

  INCOME_CONFIG,

  createIncome,

  createFightPurseIncome,

  createWinBonusIncome,

  createPerformanceBonusIncome,

  createTitleBonusIncome,

  createSigningBonusIncome,

  createSponsorshipIncome,

  createEndorsementIncome,

  calculatePPVIncome,

  createPPVIncome,

  createPrizeIncome,

  createTournamentIncome,

  createAppearanceIncome,

  createSocialMediaIncome,

  createMerchandiseIncome,

  createInvestmentIncome,

  createBusinessIncome,

  createSalaryIncome,

  createCoachingIncome,

  createCommentaryIncome,

  createOwnPromotionIncome,

  createInheritanceIncome,

  createGiftIncome,

  addIncomeToDatabase,

  getIncome,

  getAllIncome,

  getIncomeByType,

  getIncomeBySource,

  getPlayerIncome,

  calculateTotalIncome,

  getIncomeBreakdown,

  getAnnualIncome,

  calculateAnnualIncome,

  getMonthlyIncome,

  calculateMonthlyIncome,

  calculateAverageIncome,

  getLargestIncome,

  getRecurringIncome,

  projectRecurringIncome,

  validateIncome,

  snapshotIncome
};
