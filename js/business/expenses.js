// ============================================================
// MMA LIFE DYNASTY
// js/business/expenses.js
// Sistema central de despesas do jogador
// ============================================================

export const EXPENSES_VERSION = 1;

// ============================================================
// TIPOS DE DESPESA
// ============================================================

export const EXPENSE_TYPES = Object.freeze({
  TRAINING: "training",
  CAMP: "camp",
  COACH: "coach",
  MANAGER: "manager",
  MEDICAL: "medical",
  RECOVERY: "recovery",
  GYM: "gym",
  TRAVEL: "travel",
  HOTEL: "hotel",
  FOOD: "food",
  EQUIPMENT: "equipment",
  CLOTHING: "clothing",
  VEHICLE: "vehicle",
  HOUSING: "housing",
  RENT: "rent",
  UTILITIES: "utilities",
  EDUCATION: "education",
  FAMILY: "family",
  CHILDREN: "children",
  ENTERTAINMENT: "entertainment",
  LIFESTYLE: "lifestyle",
  TAX: "tax",
  LEGAL: "legal",
  INSURANCE: "insurance",
  CONTRACT: "contract",
  PROMOTION: "promotion",
  BUSINESS: "business",
  INVESTMENT: "investment",
  DEBT: "debt",
  INTEREST: "interest",
  PENALTY: "penalty",
  FINE: "fine",
  DONATION: "donation",
  GIFT: "gift",
  OTHER: "other"
});

// ============================================================
// CONFIGURAÇÃO
// ============================================================

export const EXPENSE_CONFIG = Object.freeze({
  minimumAmount: 0,

  maximumAmount: 1000000000000,

  defaultCurrency: "USD",

  historyLimit: 1000,

  recurringPeriods: [
    "daily",
    "weekly",
    "monthly",
    "quarterly",
    "yearly"
  ]
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

function randomId(prefix = "expense") {
  return (
    `${prefix}_` +
    `${Date.now()}_` +
    `${Math.floor(Math.random() * 1000000)}`
  );
}

// ============================================================
// NORMALIZAÇÃO
// ============================================================

function normalizeExpense(
  input = {}
) {
  const amount =
    clamp(
      number(
        input.amount ??
          input.value,
        0
      ),
      EXPENSE_CONFIG.minimumAmount,
      EXPENSE_CONFIG.maximumAmount
    );

  return {
    amount:
      Math.round(amount),

    currency:
      input.currency ||
      EXPENSE_CONFIG.defaultCurrency,

    type:
      input.type ||
      EXPENSE_TYPES.OTHER,

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

    fightId:
      input.fightId ||
      null,

    eventId:
      input.eventId ||
      null,

    managerId:
      input.managerId ||
      null,

    sponsorId:
      input.sponsorId ||
      null,

    assetId:
      input.assetId ||
      null,

    metadata:
      clone(
        input.metadata
      ) || {}
  };
}

// ============================================================
// CRIAÇÃO
// ============================================================

export function createExpense(
  input = {}
) {
  const now =
    normalizeDate(
      input.date ||
      new Date()
    );

  const normalized =
    normalizeExpense(
      input
    );

  return {
    version:
      EXPENSES_VERSION,

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
// DESPESAS DE TREINAMENTO
// ============================================================

export function createTrainingExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.TRAINING,

    source:
      options.source ||
      "training",

    description:
      options.description ||
      "Training expense"
  });
}

export function createCampExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.CAMP,

    source:
      options.source ||
      "camp",

    description:
      options.description ||
      "Training camp expense"
  });
}

export function createCoachExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.COACH,

    source:
      options.source ||
      "coach",

    description:
      options.description ||
      "Coach payment"
  });
}

export function createManagerExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.MANAGER,

    source:
      options.source ||
      "manager",

    description:
      options.description ||
      "Manager commission",

    managerId:
      options.managerId ||
      null
  });
}

// ============================================================
// SAÚDE E RECUPERAÇÃO
// ============================================================

export function createMedicalExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.MEDICAL,

    source:
      options.source ||
      "medical",

    description:
      options.description ||
      "Medical expense"
  });
}

export function createRecoveryExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.RECOVERY,

    source:
      options.source ||
      "recovery",

    description:
      options.description ||
      "Recovery expense"
  });
}

export function createInsuranceExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.INSURANCE,

    source:
      options.source ||
      "insurance",

    description:
      options.description ||
      "Insurance payment"
  });
}

// ============================================================
// ACADEMIA / EQUIPAMENTO
// ============================================================

export function createGymExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.GYM,

    source:
      options.source ||
      "gym",

    description:
      options.description ||
      "Gym membership"
  });
}

export function createEquipmentExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.EQUIPMENT,

    source:
      options.source ||
      "equipment",

    description:
      options.description ||
      "Training equipment"
  });
}

// ============================================================
// VIAGEM
// ============================================================

export function createTravelExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.TRAVEL,

    source:
      options.source ||
      "travel",

    description:
      options.description ||
      "Travel expense",

    fightId:
      options.fightId ||
      null,

    eventId:
      options.eventId ||
      null
  });
}

export function createHotelExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.HOTEL,

    source:
      options.source ||
      "hotel",

    description:
      options.description ||
      "Hotel expense",

    eventId:
      options.eventId ||
      null
  });
}

// ============================================================
// ALIMENTAÇÃO
// ============================================================

export function createFoodExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.FOOD,

    source:
      options.source ||
      "food",

    description:
      options.description ||
      "Food expense"
  });
}

// ============================================================
// MORADIA
// ============================================================

export function createHousingExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.HOUSING,

    source:
      options.source ||
      "housing",

    description:
      options.description ||
      "Housing expense"
  });
}

export function createRentExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.RENT,

    source:
      options.source ||
      "rent",

    description:
      options.description ||
      "Rent payment",

    recurring:
      options.recurring ??
      true,

    recurringPeriod:
      options.recurringPeriod ||
      "monthly"
  });
}

export function createUtilitiesExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.UTILITIES,

    source:
      options.source ||
      "utilities",

    description:
      options.description ||
      "Utilities"
  });
}

// ============================================================
// FAMÍLIA / VIDA
// ============================================================

export function createFamilyExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.FAMILY,

    source:
      options.source ||
      "family",

    description:
      options.description ||
      "Family expense"
  });
}

export function createChildrenExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.CHILDREN,

    source:
      options.source ||
      "children",

    description:
      options.description ||
      "Children expense"
  });
}

export function createEducationExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.EDUCATION,

    source:
      options.source ||
      "education",

    description:
      options.description ||
      "Education expense"
  });
}

export function createLifestyleExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.LIFESTYLE,

    source:
      options.source ||
      "lifestyle",

    description:
      options.description ||
      "Lifestyle expense"
  });
}

export function createEntertainmentExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.ENTERTAINMENT,

    source:
      options.source ||
      "entertainment",

    description:
      options.description ||
      "Entertainment expense"
  });
}

// ============================================================
// VEÍCULOS
// ============================================================

export function createVehicleExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.VEHICLE,

    source:
      options.source ||
      "vehicle",

    description:
      options.description ||
      "Vehicle expense",

    assetId:
      options.assetId ||
      null
  });
}

// ============================================================
// NEGÓCIOS
// ============================================================

export function createBusinessExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.BUSINESS,

    source:
      options.source ||
      "business",

    description:
      options.description ||
      "Business expense"
  });
}

export function createPromotionExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.PROMOTION,

    source:
      options.source ||
      "promotion",

    description:
      options.description ||
      "Promotion expense",

    promotionId:
      options.promotionId ||
      null
  });
}

export function createContractExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.CONTRACT,

    source:
      options.source ||
      "contract",

    description:
      options.description ||
      "Contract expense"
  });
}

// ============================================================
// INVESTIMENTOS
// ============================================================

export function createInvestmentExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.INVESTMENT,

    source:
      options.source ||
      "investment",

    description:
      options.description ||
      "Investment contribution"
  });
}

// ============================================================
// IMPOSTOS
// ============================================================

export function createTaxExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.TAX,

    source:
      options.source ||
      "tax",

    description:
      options.description ||
      "Tax payment"
  });
}

// ============================================================
// JURÍDICO
// ============================================================

export function createLegalExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.LEGAL,

    source:
      options.source ||
      "legal",

    description:
      options.description ||
      "Legal expense"
  });
}

// ============================================================
// DÍVIDAS
// ============================================================

export function createDebtExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.DEBT,

    source:
      options.source ||
      "debt",

    description:
      options.description ||
      "Debt payment"
  });
}

export function createInterestExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.INTEREST,

    source:
      options.source ||
      "interest",

    description:
      options.description ||
      "Interest payment"
  });
}

// ============================================================
// MULTAS / PENALIDADES
// ============================================================

export function createPenaltyExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.PENALTY,

    source:
      options.source ||
      "penalty",

    description:
      options.description ||
      "Penalty"
  });
}

export function createFineExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.FINE,

    source:
      options.source ||
      "fine",

    description:
      options.description ||
      "Fine"
  });
}

// ============================================================
// DOAÇÕES / PRESENTES
// ============================================================

export function createDonationExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.DONATION,

    source:
      options.source ||
      "donation",

    description:
      options.description ||
      "Donation"
  });
}

export function createGiftExpense(
  options = {}
) {
  return createExpense({
    ...options,

    type:
      EXPENSE_TYPES.GIFT,

    source:
      options.source ||
      "gift",

    description:
      options.description ||
      "Gift given"
  });
}

// ============================================================
// BANCO DE DESPESAS
// ============================================================

export function addExpenseToDatabase(
  database,
  expense
) {
  if (
    !database ||
    !expense
  ) {
    return false;
  }

  if (
    !database.expenses
  ) {
    database.expenses = {};
  }

  database.expenses[
    expense.id
  ] = clone(expense);

  trimExpenseHistory(
    database
  );

  return true;
}

function trimExpenseHistory(
  database
) {
  if (
    !database ||
    !database.expenses
  ) {
    return;
  }

  const entries =
    Object.entries(
      database.expenses
    );

  if (
    entries.length <=
    EXPENSE_CONFIG.historyLimit
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
    EXPENSE_CONFIG.historyLimit;

  for (
    let i = 0;
    i < removeCount;
    i++
  ) {
    delete database.expenses[
      entries[i][0]
    ];
  }
}

// ============================================================
// CONSULTAS
// ============================================================

export function getExpense(
  database,
  expenseId
) {
  if (
    !database ||
    !database.expenses ||
    !expenseId
  ) {
    return null;
  }

  return (
    database.expenses[
      expenseId
    ] || null
  );
}

export function getAllExpenses(
  database
) {
  if (
    !database ||
    !database.expenses
  ) {
    return [];
  }

  return Object.values(
    database.expenses
  );
}

export function getExpensesByType(
  database,
  type
) {
  return getAllExpenses(
    database
  ).filter(
    expense =>
      expense.type === type
  );
}

export function getExpensesBySource(
  database,
  source
) {
  return getAllExpenses(
    database
  ).filter(
    expense =>
      expense.source === source
  );
}

export function getPlayerExpenses(
  database,
  playerId
) {
  if (
    !playerId
  ) {
    return [];
  }

  return getAllExpenses(
    database
  ).filter(
    expense =>
      expense.playerId ===
      playerId
  );
}

// ============================================================
// FILTRO POR PERÍODO
// ============================================================

function filterExpensesByPeriod(
  expenses,
  options = {}
) {
  let filtered =
    [...expenses];

  if (
    options.startDate
  ) {
    const start =
      new Date(
        options.startDate
      );

    filtered =
      filtered.filter(
        expense =>
          new Date(
            expense.date
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

    filtered =
      filtered.filter(
        expense =>
          new Date(
            expense.date
          ) <= end
      );
  }

  if (
    options.type
  ) {
    filtered =
      filtered.filter(
        expense =>
          expense.type ===
          options.type
      );
  }

  if (
    options.source
  ) {
    filtered =
      filtered.filter(
        expense =>
          expense.source ===
          options.source
      );
  }

  return filtered;
}

// ============================================================
// TOTAL DE DESPESAS
// ============================================================

export function calculateTotalExpenses(
  database,
  options = {}
) {
  const expenses =
    filterExpensesByPeriod(
      getAllExpenses(
        database
      ),
      options
    );

  const total =
    expenses.reduce(
      (
        sum,
        expense
      ) =>
        sum +
        number(
          expense.amount,
          0
        ),
      0
    );

  return {
    count:
      expenses.length,

    total:
      Math.round(total)
  };
}

// ============================================================
// RESUMO POR TIPO
// ============================================================

export function getExpenseBreakdown(
  database,
  options = {}
) {
  const expenses =
    filterExpensesByPeriod(
      getAllExpenses(
        database
      ),
      options
    );

  const breakdown = {};

  for (
    const expense of expenses
  ) {
    const type =
      expense.type ||
      EXPENSE_TYPES.OTHER;

    if (
      !breakdown[type]
    ) {
      breakdown[type] = {
        count: 0,
        total: 0
      };
    }

    breakdown[type].count += 1;

    breakdown[type].total +=
      number(
        expense.amount,
        0
      );
  }

  for (
    const type of Object.keys(
      breakdown
    )
  ) {
    breakdown[type].total =
      Math.round(
        breakdown[type].total
      );
  }

  return breakdown;
}

// ============================================================
// RESUMO POR ANO
// ============================================================

export function getAnnualExpenses(
  database,
  year
) {
  const targetYear =
    integer(year, 0);

  return getAllExpenses(
    database
  ).filter(
    expense =>
      new Date(
        expense.date
      ).getFullYear() ===
      targetYear
  );
}

export function calculateAnnualExpenses(
  database,
  year
) {
  return getAnnualExpenses(
    database,
    year
  ).reduce(
    (
      total,
      expense
    ) =>
      total +
      number(
        expense.amount,
        0
      ),
    0
  );
}

// ============================================================
// RESUMO MENSAL
// ============================================================

export function getMonthlyExpenses(
  database,
  year,
  month
) {
  const targetYear =
    integer(year, 0);

  const targetMonth =
    integer(month, 0);

  return getAllExpenses(
    database
  ).filter(
    expense => {
      const date =
        new Date(
          expense.date
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

export function calculateMonthlyExpenses(
  database,
  year,
  month
) {
  return getMonthlyExpenses(
    database,
    year,
    month
  ).reduce(
    (
      total,
      expense
    ) =>
      total +
      number(
        expense.amount,
        0
      ),
    0
  );
}

// ============================================================
// DESPESAS RECORRENTES
// ============================================================

export function getRecurringExpenses(
  database
) {
  return getAllExpenses(
    database
  ).filter(
    expense =>
      expense.recurring ===
      true
  );
}

// ============================================================
// PROJEÇÃO DE DESPESAS
// ============================================================

export function projectRecurringExpenses(
  database,
  months = 12
) {
  const recurring =
    getRecurringExpenses(
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
    const expense of recurring
  ) {
    const amount =
      number(
        expense.amount,
        0
      );

    const period =
      String(
        expense.recurringPeriod ||
        "monthly"
      ).toLowerCase();

    if (
      period === "daily"
    ) {
      monthly +=
        amount * 30.44;
    } else if (
      period === "weekly"
    ) {
      monthly +=
        amount * 4.33;
    } else if (
      period === "quarterly"
    ) {
      monthly +=
        amount / 3;
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
// MAIOR DESPESA
// ============================================================

export function getLargestExpense(
  database,
  options = {}
) {
  const expenses =
    filterExpensesByPeriod(
      getAllExpenses(
        database
      ),
      options
    );

  if (
    expenses.length === 0
  ) {
    return null;
  }

  return expenses.reduce(
    (
      largest,
      current
    ) =>
      number(
        current.amount,
        0
      ) >
      number(
        largest.amount,
        0
      )
        ? current
        : largest
  );
}

// ============================================================
// MÉDIA
// ============================================================

export function calculateAverageExpense(
  database,
  options = {}
) {
  const result =
    calculateTotalExpenses(
      database,
      options
    );

  if (
    result.count <= 0
  ) {
    return 0;
  }

  return Math.round(
    result.total /
    result.count
  );
}

// ============================================================
// REMOVER DESPESA
// ============================================================

export function removeExpense(
  database,
  expenseId
) {
  if (
    !database ||
    !database.expenses ||
    !expenseId
  ) {
    return false;
  }

  if (
    !database.expenses[
      expenseId
    ]
  ) {
    return false;
  }

  delete database.expenses[
    expenseId
  ];

  return true;
}

// ============================================================
// VALIDAÇÃO
// ============================================================

export function validateExpense(
  expense
) {
  const errors = [];

  if (!expense) {
    return {
      valid: false,
      errors: [
        "expense_missing"
      ]
    };
  }

  if (!expense.id) {
    errors.push(
      "id_missing"
    );
  }

  if (!expense.type) {
    errors.push(
      "type_missing"
    );
  }

  if (
    number(
      expense.amount,
      -1
    ) < 0
  ) {
    errors.push(
      "invalid_amount"
    );
  }

  if (
    expense.recurring &&
    !expense.recurringPeriod
  ) {
    errors.push(
      "recurring_period_missing"
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

export function snapshotExpense(
  expense
) {
  return clone(
    expense
  );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  EXPENSES_VERSION,

  EXPENSE_TYPES,

  EXPENSE_CONFIG,

  createExpense,

  createTrainingExpense,

  createCampExpense,

  createCoachExpense,

  createManagerExpense,

  createMedicalExpense,

  createRecoveryExpense,

  createInsuranceExpense,

  createGymExpense,

  createEquipmentExpense,

  createTravelExpense,

  createHotelExpense,

  createFoodExpense,

  createHousingExpense,

  createRentExpense,

  createUtilitiesExpense,

  createFamilyExpense,

  createChildrenExpense,

  createEducationExpense,

  createLifestyleExpense,

  createEntertainmentExpense,

  createVehicleExpense,

  createBusinessExpense,

  createPromotionExpense,

  createContractExpense,

  createInvestmentExpense,

  createTaxExpense,

  createLegalExpense,

  createDebtExpense,

  createInterestExpense,

  createPenaltyExpense,

  createFineExpense,

  createDonationExpense,

  createGiftExpense,

  addExpenseToDatabase,

  getExpense,

  getAllExpenses,

  getExpensesByType,

  getExpensesBySource,

  getPlayerExpenses,

  calculateTotalExpenses,

  getExpenseBreakdown,

  getAnnualExpenses,

  calculateAnnualExpenses,

  getMonthlyExpenses,

  calculateMonthlyExpenses,

  getRecurringExpenses,

  projectRecurringExpenses,

  getLargestExpense,

  calculateAverageExpense,

  removeExpense,

  validateExpense,

  snapshotExpense
};
