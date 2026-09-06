/* ============================================================
   MMA LIFE DYNASTY
   LIFE — LIFESTYLE
   Sistema de padrão de vida, gastos pessoais, conforto,
   felicidade, estresse, status social e qualidade de vida.
   ============================================================ */

const LIFESTYLE_VERSION = 1;

/* ============================================================
   NÍVEIS DE PADRÃO DE VIDA
   ============================================================ */

const LIFESTYLE_LEVELS = {
  SURVIVAL: 1,
  BASIC: 2,
  MODEST: 3,
  COMFORTABLE: 4,
  HIGH: 5,
  PREMIUM: 6,
  LUXURY: 7,
  ULTRA_LUXURY: 8,
  ELITE: 9,
  BILLIONAIRE: 10
};

const LIFESTYLE_LEVEL_ORDER = [
  LIFESTYLE_LEVELS.SURVIVAL,
  LIFESTYLE_LEVELS.BASIC,
  LIFESTYLE_LEVELS.MODEST,
  LIFESTYLE_LEVELS.COMFORTABLE,
  LIFESTYLE_LEVELS.HIGH,
  LIFESTYLE_LEVELS.PREMIUM,
  LIFESTYLE_LEVELS.LUXURY,
  LIFESTYLE_LEVELS.ULTRA_LUXURY,
  LIFESTYLE_LEVELS.ELITE,
  LIFESTYLE_LEVELS.BILLIONAIRE
];

/* ============================================================
   CATEGORIAS DE GASTO
   ============================================================ */

const LIFESTYLE_EXPENSE_CATEGORIES = {
  HOUSING: "housing",
  VEHICLES: "vehicles",
  FOOD: "food",
  HEALTH: "health",
  FITNESS: "fitness",
  CLOTHING: "clothing",
  ENTERTAINMENT: "entertainment",
  TRAVEL: "travel",
  SECURITY: "security",
  STAFF: "staff",
  EDUCATION: "education",
  SOCIAL: "social",
  TECHNOLOGY: "technology",
  LUXURY: "luxury",
  FAMILY: "family",
  PERSONAL: "personal",
  CHARITY: "charity",
  OTHER: "other"
};

/* ============================================================
   UTILIDADES
   ============================================================ */

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function clamp(value, min, max) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}

function randomInt(min, max) {
  return Math.floor(
    Math.random() *
      (max - min + 1)
  ) + min;
}

function randomFloat(min, max) {
  return (
    Math.random() *
      (max - min) +
    min
  );
}

function randomItem(array) {
  if (
    !Array.isArray(array) ||
    array.length === 0
  ) {
    return null;
  }

  return array[
    Math.floor(
      Math.random() * array.length
    )
  ];
}

function normalizeId(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  return String(value).trim();
}

function generateId(
  prefix = "lifestyle"
) {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

/* ============================================================
   LABELS
   ============================================================ */

function getLifestyleLevelLabel(
  level
) {
  const labels = {
    1: "Sobrevivência",
    2: "Básico",
    3: "Modesto",
    4: "Confortável",
    5: "Alto",
    6: "Premium",
    7: "Luxo",
    8: "Ultra luxo",
    9: "Elite",
    10: "Bilionário"
  };

  return (
    labels[level] ||
    "Desconhecido"
  );
}

function getExpenseCategoryLabel(
  category
) {
  const labels = {
    housing: "Moradia",
    vehicles: "Veículos",
    food: "Alimentação",
    health: "Saúde",
    fitness: "Fitness",
    clothing: "Roupas",
    entertainment: "Entretenimento",
    travel: "Viagens",
    security: "Segurança",
    staff: "Funcionários",
    education: "Educação",
    social: "Vida social",
    technology: "Tecnologia",
    luxury: "Luxo",
    family: "Família",
    personal: "Pessoal",
    charity: "Caridade",
    other: "Outros"
  };

  return (
    labels[category] ||
    "Outros"
  );
}

/* ============================================================
   CONFIGURAÇÃO DOS NÍVEIS
   ============================================================ */

const LIFESTYLE_CATALOG = [
  {
    level: 1,
    id: "survival",
    name: "Sobrevivência",
    minimumMonthlyIncome: 0,
    recommendedMonthlyBudget: 1200,
    socialStatus: 5,
    comfort: 15,
    happiness: 15,
    stress: 80,
    prestige: 0,
    housingMultiplier: 0.25,
    foodMultiplier: 0.60,
    travelMultiplier: 0.05,
    entertainmentMultiplier: 0.10,
    luxuryMultiplier: 0
  },

  {
    level: 2,
    id: "basic",
    name: "Básico",
    minimumMonthlyIncome: 1500,
    recommendedMonthlyBudget: 2000,
    socialStatus: 15,
    comfort: 30,
    happiness: 30,
    stress: 65,
    prestige: 5,
    housingMultiplier: 0.30,
    foodMultiplier: 0.80,
    travelMultiplier: 0.10,
    entertainmentMultiplier: 0.20,
    luxuryMultiplier: 0
  },

  {
    level: 3,
    id: "modest",
    name: "Modesto",
    minimumMonthlyIncome: 3000,
    recommendedMonthlyBudget: 3500,
    socialStatus: 25,
    comfort: 45,
    happiness: 45,
    stress: 50,
    prestige: 10,
    housingMultiplier: 0.32,
    foodMultiplier: 1,
    travelMultiplier: 0.20,
    entertainmentMultiplier: 0.35,
    luxuryMultiplier: 0.02
  },

  {
    level: 4,
    id: "comfortable",
    name: "Confortável",
    minimumMonthlyIncome: 7000,
    recommendedMonthlyBudget: 6500,
    socialStatus: 40,
    comfort: 60,
    happiness: 60,
    stress: 35,
    prestige: 20,
    housingMultiplier: 0.35,
    foodMultiplier: 1.20,
    travelMultiplier: 0.35,
    entertainmentMultiplier: 0.50,
    luxuryMultiplier: 0.05
  },

  {
    level: 5,
    id: "high",
    name: "Alto",
    minimumMonthlyIncome: 15000,
    recommendedMonthlyBudget: 12000,
    socialStatus: 55,
    comfort: 72,
    happiness: 70,
    stress: 25,
    prestige: 35,
    housingMultiplier: 0.38,
    foodMultiplier: 1.50,
    travelMultiplier: 0.60,
    entertainmentMultiplier: 0.75,
    luxuryMultiplier: 0.10
  },

  {
    level: 6,
    id: "premium",
    name: "Premium",
    minimumMonthlyIncome: 30000,
    recommendedMonthlyBudget: 25000,
    socialStatus: 68,
    comfort: 82,
    happiness: 78,
    stress: 20,
    prestige: 50,
    housingMultiplier: 0.40,
    foodMultiplier: 2,
    travelMultiplier: 1,
    entertainmentMultiplier: 1.20,
    luxuryMultiplier: 0.20
  },

  {
    level: 7,
    id: "luxury",
    name: "Luxo",
    minimumMonthlyIncome: 75000,
    recommendedMonthlyBudget: 60000,
    socialStatus: 80,
    comfort: 90,
    happiness: 85,
    stress: 15,
    prestige: 70,
    housingMultiplier: 0.45,
    foodMultiplier: 2.50,
    travelMultiplier: 1.50,
    entertainmentMultiplier: 2,
    luxuryMultiplier: 0.35
  },

  {
    level: 8,
    id: "ultra_luxury",
    name: "Ultra luxo",
    minimumMonthlyIncome: 200000,
    recommendedMonthlyBudget: 150000,
    socialStatus: 90,
    comfort: 95,
    happiness: 90,
    stress: 10,
    prestige: 85,
    housingMultiplier: 0.50,
    foodMultiplier: 3,
    travelMultiplier: 2.50,
    entertainmentMultiplier: 3,
    luxuryMultiplier: 0.50
  },

  {
    level: 9,
    id: "elite",
    name: "Elite",
    minimumMonthlyIncome: 1000000,
    recommendedMonthlyBudget: 500000,
    socialStatus: 97,
    comfort: 98,
    happiness: 94,
    stress: 8,
    prestige: 95,
    housingMultiplier: 0.55,
    foodMultiplier: 4,
    travelMultiplier: 4,
    entertainmentMultiplier: 5,
    luxuryMultiplier: 0.70
  },

  {
    level: 10,
    id: "billionaire",
    name: "Bilionário",
    minimumMonthlyIncome: 10000000,
    recommendedMonthlyBudget: 2000000,
    socialStatus: 100,
    comfort: 100,
    happiness: 98,
    stress: 5,
    prestige: 100,
    housingMultiplier: 0.60,
    foodMultiplier: 5,
    travelMultiplier: 7,
    entertainmentMultiplier: 8,
    luxuryMultiplier: 1
  }
];

/* ============================================================
   GASTOS BASE
   ============================================================ */

const DEFAULT_EXPENSES = {
  housing: 1200,
  vehicles: 500,
  food: 800,
  health: 250,
  fitness: 200,
  clothing: 200,
  entertainment: 200,
  travel: 100,
  security: 0,
  staff: 0,
  education: 0,
  social: 150,
  technology: 100,
  luxury: 0,
  family: 200,
  personal: 150,
  charity: 0,
  other: 100
};

/* ============================================================
   PERFIL DE LIFESTYLE
   ============================================================ */

function createLifestyleProfile(
  data = {}
) {
  return {
    entityId:
      normalizeId(
        data.entityId
      ),

    level:
      clamp(
        Number(
          data.level ?? 2
        ),
        1,
        10
      ),

    levelName:
      getLifestyleLevelLabel(
        Number(
          data.level ?? 2
        )
      ),

    monthlyIncome:
      Math.max(
        0,
        Number(
          data.monthlyIncome ?? 0
        )
      ),

    monthlyBudget:
      Math.max(
        0,
        Number(
          data.monthlyBudget ??
            2000
        )
      ),

    monthlyExpenses:
      Math.max(
        0,
        Number(
          data.monthlyExpenses ?? 0
        )
      ),

    savingsRate:
      clamp(
        Number(
          data.savingsRate ?? 20
        ),
        0,
        100
      ),

    happiness:
      clamp(
        Number(
          data.happiness ?? 50
        ),
        0,
        100
      ),

    stress:
      clamp(
        Number(
          data.stress ?? 50
        ),
        0,
        100
      ),

    comfort:
      clamp(
        Number(
          data.comfort ?? 30
        ),
        0,
        100
      ),

    socialStatus:
      clamp(
        Number(
          data.socialStatus ?? 15
        ),
        0,
        100
      ),

    prestige:
      clamp(
        Number(
          data.prestige ?? 5
        ),
        0,
        100
      ),

    qualityOfLife:
      clamp(
        Number(
          data.qualityOfLife ?? 40
        ),
        0,
        100
      ),

    satisfaction:
      clamp(
        Number(
          data.satisfaction ?? 50
        ),
        0,
        100
      ),

    expenses: {
      ...clone(
        DEFAULT_EXPENSES
      ),
      ...(data.expenses
        ? clone(
            data.expenses
          )
        : {})
    },

    services: Array.isArray(
      data.services
    )
      ? data.services.map(
          clone
        )
      : [],

    staff: Array.isArray(
      data.staff
    )
      ? data.staff.map(
          clone
        )
      : [],

    travel: {
      tripsThisYear:
        Number(
          data.travel
            ?.tripsThisYear ??
            0
        ),

      travelSpending:
        Number(
          data.travel
            ?.travelSpending ??
            0
        ),

      internationalTrips:
        Number(
          data.travel
            ?.internationalTrips ??
            0
        )
    },

    luxury: {
      luxurySpending:
        Number(
          data.luxury
            ?.luxurySpending ??
            0
        ),

      luxuryPurchases:
        Number(
          data.luxury
            ?.luxuryPurchases ??
            0
        )
    },

    history:
      Array.isArray(
        data.history
      )
        ? data.history.map(
            clone
          )
        : [],

    lastProcessedMonth:
      data.lastProcessedMonth ||
      null,

    updatedAt:
      new Date().toISOString()
  };
}

/* ============================================================
   ESTADO
   ============================================================ */

function ensureLifestyleState(
  database
) {
  if (!database) {
    return null;
  }

  if (!database.life) {
    database.life = {};
  }

  if (!database.life.lifestyle) {
    database.life.lifestyle = {};
  }

  const state =
    database.life.lifestyle;

  if (!state.profiles) {
    state.profiles = {};
  }

  if (!Array.isArray(state.history)) {
    state.history = [];
  }

  return state;
}

/* ============================================================
   PERFIS
   ============================================================ */

function addLifestyleProfile(
  database,
  entityId,
  data = {}
) {
  const state =
    ensureLifestyleState(
      database
    );

  if (!state) {
    return null;
  }

  const id =
    normalizeId(entityId);

  if (!id) {
    return null;
  }

  const profile =
    createLifestyleProfile({
      ...data,
      entityId: id
    });

  state.profiles[id] =
    profile;

  return clone(profile);
}

function getLifestyleProfile(
  database,
  entityId
) {
  const state =
    ensureLifestyleState(
      database
    );

  if (!state) {
    return null;
  }

  const profile =
    state.profiles[
      normalizeId(entityId)
    ];

  return profile
    ? clone(profile)
    : null;
}

function findLifestyleProfileReference(
  database,
  entityId
) {
  const state =
    ensureLifestyleState(
      database
    );

  if (!state) {
    return null;
  }

  return (
    state.profiles[
      normalizeId(entityId)
    ] || null
  );
}

function getAllLifestyleProfiles(
  database
) {
  const state =
    ensureLifestyleState(
      database
    );

  if (!state) {
    return [];
  }

  return Object.entries(
    state.profiles
  ).map(
    ([entityId, profile]) => ({
      entityId,
      ...clone(profile)
    })
  );
}

function updateLifestyleProfile(
  database,
  entityId,
  updates = {}
) {
  const profile =
    findLifestyleProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  Object.keys(updates).forEach(
    key => {
      if (
        updates[key] !==
        undefined
      ) {
        profile[key] =
          clone(
            updates[key]
          );
      }
    }
  );

  updateLifestyleDerivedValues(
    profile
  );

  profile.updatedAt =
    new Date().toISOString();

  return clone(profile);
}

/* ============================================================
   CATÁLOGO
   ============================================================ */

function getLifestyleLevel(
  level
) {
  const item =
    LIFESTYLE_CATALOG.find(
      lifestyle =>
        lifestyle.level ===
        Number(level)
    );

  return item
    ? clone(item)
    : null;
}

function getAllLifestyleLevels() {
  return LIFESTYLE_CATALOG.map(
    clone
  );
}

function getLifestyleByName(
  name
) {
  if (!name) {
    return null;
  }

  const normalized =
    String(name)
      .trim()
      .toLowerCase();

  const item =
    LIFESTYLE_CATALOG.find(
      lifestyle =>
        lifestyle.name
          .toLowerCase() ===
        normalized
    );

  return item
    ? clone(item)
    : null;
}

/* ============================================================
   DETERMINAÇÃO DO NÍVEL
   ============================================================ */

function calculateLifestyleLevel(
  monthlyIncome = 0,
  monthlyExpenses = 0,
  netWorth = 0
) {
  const income =
    Math.max(
      0,
      Number(
        monthlyIncome
      ) || 0
    );

  const expenses =
    Math.max(
      0,
      Number(
        monthlyExpenses
      ) || 0
    );

  const wealth =
    Math.max(
      0,
      Number(
        netWorth
      ) || 0
    );

  let level = 1;

  if (
    income >= 1500 ||
    wealth >= 10000
  ) {
    level = 2;
  }

  if (
    income >= 3000 ||
    wealth >= 50000
  ) {
    level = 3;
  }

  if (
    income >= 7000 ||
    wealth >= 150000
  ) {
    level = 4;
  }

  if (
    income >= 15000 ||
    wealth >= 500000
  ) {
    level = 5;
  }

  if (
    income >= 30000 ||
    wealth >= 1500000
  ) {
    level = 6;
  }

  if (
    income >= 75000 ||
    wealth >= 5000000
  ) {
    level = 7;
  }

  if (
    income >= 200000 ||
    wealth >= 20000000
  ) {
    level = 8;
  }

  if (
    income >= 1000000 ||
    wealth >= 100000000
  ) {
    level = 9;
  }

  if (
    income >= 10000000 ||
    wealth >= 1000000000
  ) {
    level = 10;
  }

  /*
   * Evita que um padrão de gastos muito acima da renda
   * seja considerado sustentável.
   */
  if (
    expenses > income * 1.5 &&
    income > 0
  ) {
    level = Math.max(
      1,
      level - 1
    );
  }

  return level;
}

/* ============================================================
   ORÇAMENTO RECOMENDADO
   ============================================================ */

function calculateRecommendedMonthlyBudget(
  level
) {
  const lifestyle =
    getLifestyleLevel(
      level
    );

  if (!lifestyle) {
    return 0;
  }

  return lifestyle
    .recommendedMonthlyBudget;
}

function calculateSuggestedExpenses(
  level,
  monthlyIncome
) {
  const lifestyle =
    getLifestyleLevel(
      level
    );

  if (!lifestyle) {
    return {};
  }

  const income =
    Math.max(
      0,
      Number(
        monthlyIncome
      ) || 0
    );

  const budget =
    Math.min(
      lifestyle
        .recommendedMonthlyBudget,
      income > 0
        ? income * 0.85
        : lifestyle
            .recommendedMonthlyBudget
    );

  return {
    housing:
      Math.round(
        budget *
          lifestyle
            .housingMultiplier
      ),

    vehicles:
      Math.round(
        budget * 0.10
      ),

    food:
      Math.round(
        budget *
          0.12 *
          lifestyle
            .foodMultiplier
      ),

    health:
      Math.round(
        budget * 0.04
      ),

    fitness:
      Math.round(
        budget * 0.04
      ),

    clothing:
      Math.round(
        budget * 0.04
      ),

    entertainment:
      Math.round(
        budget *
          0.06 *
          lifestyle
            .entertainmentMultiplier
      ),

    travel:
      Math.round(
        budget *
          0.05 *
          lifestyle
            .travelMultiplier
      ),

    security:
      Math.round(
        budget * 0.03
      ),

    staff:
      Math.round(
        budget * 0.03
      ),

    education:
      Math.round(
        budget * 0.03
      ),

    social:
      Math.round(
        budget * 0.04
      ),

    technology:
      Math.round(
        budget * 0.03
      ),

    luxury:
      Math.round(
        budget *
          lifestyle
            .luxuryMultiplier
      ),

    family:
      Math.round(
        budget * 0.06
      ),

    personal:
      Math.round(
        budget * 0.04
      ),

    charity:
      Math.round(
        budget * 0.02
      ),

    other:
      Math.round(
        budget * 0.03
      )
  };
}

/* ============================================================
   DESPESAS
   ============================================================ */

function setExpense(
  database,
  entityId,
  category,
  amount
) {
  const profile =
    findLifestyleProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  if (
    !Object.values(
      LIFESTYLE_EXPENSE_CATEGORIES
    ).includes(
      category
    )
  ) {
    return null;
  }

  profile.expenses[
    category
  ] =
    Math.max(
      0,
      Number(amount) || 0
    );

  recalculateMonthlyExpenses(
    profile
  );

  return clone(profile);
}

function addExpense(
  database,
  entityId,
  category,
  amount
) {
  const profile =
    findLifestyleProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  if (
    !Object.values(
      LIFESTYLE_EXPENSE_CATEGORIES
    ).includes(
      category
    )
  ) {
    return null;
  }

  profile.expenses[
    category
  ] =
    Math.max(
      0,
      Number(
        profile.expenses[
          category
        ] || 0
      ) +
        Number(amount || 0)
    );

  recalculateMonthlyExpenses(
    profile
  );

  return clone(profile);
}

function recalculateMonthlyExpenses(
  profile
) {
  if (!profile) {
    return 0;
  }

  profile.monthlyExpenses =
    Object.values(
      profile.expenses || {}
    ).reduce(
      (sum, value) =>
        sum +
        Math.max(
          0,
          Number(value) || 0
        ),
      0
    );

  return Math.round(
    profile.monthlyExpenses
  );
}

/* ============================================================
   SERVIÇOS
   ============================================================ */

function addLifestyleService(
  database,
  entityId,
  service
) {
  const profile =
    findLifestyleProfileReference(
      database,
      entityId
    );

  if (
    !profile ||
    !service
  ) {
    return null;
  }

  const item = {
    id:
      normalizeId(
        service.id
      ) ||
      generateId(
        "service"
      ),

    name:
      service.name ||
      "Serviço",

    category:
      service.category ||
      "personal",

    monthlyCost:
      Math.max(
        0,
        Number(
          service.monthlyCost ??
            0
        )
      ),

    happinessBonus:
      Number(
        service.happinessBonus ??
          0
      ),

    comfortBonus:
      Number(
        service.comfortBonus ??
          0
      ),

    prestigeBonus:
      Number(
        service.prestigeBonus ??
          0
      ),

    active:
      service.active !== false
  };

  profile.services.push(
    item
  );

  recalculateServiceExpenses(
    profile
  );

  return clone(item);
}

function removeLifestyleService(
  database,
  entityId,
  serviceId
) {
  const profile =
    findLifestyleProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return false;
  }

  const id =
    normalizeId(serviceId);

  const before =
    profile.services.length;

  profile.services =
    profile.services.filter(
      service =>
        normalizeId(
          service.id
        ) !== id
    );

  recalculateServiceExpenses(
    profile
  );

  return (
    profile.services.length !==
    before
  );
}

function recalculateServiceExpenses(
  profile
) {
  if (!profile) {
    return 0;
  }

  const cost =
    profile.services
      .filter(
        service =>
          service.active !==
          false
      )
      .reduce(
        (sum, service) =>
          sum +
          Number(
            service.monthlyCost
          ),
        0
      );

  profile.expenses.personal =
    Math.max(
      0,
      Number(
        profile.expenses.personal
      ) || 0
    );

  profile.monthlyExpenses =
    Object.values(
      profile.expenses
    ).reduce(
      (sum, value) =>
        sum +
        Number(value || 0),
      0
    );

  return Math.round(cost);
}

/* ============================================================
   FUNCIONÁRIOS
   ============================================================ */

function addLifestyleStaff(
  database,
  entityId,
  staffData
) {
  const profile =
    findLifestyleProfileReference(
      database,
      entityId
    );

  if (
    !profile ||
    !staffData
  ) {
    return null;
  }

  const staff = {
    id:
      normalizeId(
        staffData.id
      ) ||
      generateId(
        "staff"
      ),

    role:
      staffData.role ||
      "Funcionário",

    salary:
      Math.max(
        0,
        Number(
          staffData.salary ??
            0
        )
      ),

    active:
      staffData.active !== false,

    happinessBonus:
      Number(
        staffData.happinessBonus ??
          0
      ),

    comfortBonus:
      Number(
        staffData.comfortBonus ??
          0
      ),

    prestigeBonus:
      Number(
        staffData.prestigeBonus ??
          0
      )
  };

  profile.staff.push(
    staff
  );

  recalculateStaffExpenses(
    profile
  );

  return clone(staff);
}

function removeLifestyleStaff(
  database,
  entityId,
  staffId
) {
  const profile =
    findLifestyleProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return false;
  }

  const id =
    normalizeId(staffId);

  const before =
    profile.staff.length;

  profile.staff =
    profile.staff.filter(
      staff =>
        normalizeId(
          staff.id
        ) !== id
    );

  recalculateStaffExpenses(
    profile
  );

  return (
    before !==
    profile.staff.length
  );
}

function recalculateStaffExpenses(
  profile
) {
  if (!profile) {
    return 0;
  }

  const cost =
    profile.staff
      .filter(
        staff =>
          staff.active !==
          false
      )
      .reduce(
        (sum, staff) =>
          sum +
          Number(
            staff.salary
          ),
        0
      );

  profile.expenses.staff =
    Math.round(cost);

  recalculateMonthlyExpenses(
    profile
  );

  return Math.round(
    cost
  );
}

/* ============================================================
   VIAGENS
   ============================================================ */

function recordTravel(
  database,
  entityId,
  data = {}
) {
  const profile =
    findLifestyleProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  const cost =
    Math.max(
      0,
      Number(
        data.cost ?? 0
      )
    );

  const international =
    Boolean(
      data.international
    );

  profile.travel
    .tripsThisYear += 1;

  profile.travel
    .travelSpending +=
    cost;

  if (international) {
    profile.travel
      .internationalTrips += 1;
  }

  profile.expenses.travel =
    Math.max(
      0,
      Number(
        profile.expenses.travel
      ) || 0
    ) +
    cost;

  addLifestyleHistory(
    profile,
    "travel",
    "Realizou uma viagem.",
    {
      cost,
      international
    }
  );

  recalculateMonthlyExpenses(
    profile
  );

  return clone(
    profile.travel
  );
}

/* ============================================================
   LUXO
   ============================================================ */

function recordLuxuryPurchase(
  database,
  entityId,
  data = {}
) {
  const profile =
    findLifestyleProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  const cost =
    Math.max(
      0,
      Number(
        data.cost ?? 0
      )
    );

  profile.luxury
    .luxuryPurchases += 1;

  profile.luxury
    .luxurySpending +=
    cost;

  profile.expenses.luxury =
    Math.max(
      0,
      Number(
        profile.expenses.luxury
      ) || 0
    ) +
    cost;

  addLifestyleHistory(
    profile,
    "luxury_purchase",
    data.description ||
      "Realizou uma compra de luxo.",
    {
      cost
    }
  );

  recalculateMonthlyExpenses(
    profile
  );

  return clone(
    profile.luxury
  );
}

/* ============================================================
   CÁLCULOS DERIVADOS
   ============================================================ */

function calculateHappiness(
  profile
) {
  if (!profile) {
    return 0;
  }

  const level =
    getLifestyleLevel(
      profile.level
    );

  if (!level) {
    return 50;
  }

  const expenseRatio =
    profile.monthlyIncome > 0
      ? profile.monthlyExpenses /
        profile.monthlyIncome
      : 1;

  let score =
    level.happiness;

  score +=
    (
      profile.comfort -
      50
    ) * 0.15;

  score +=
    (
      profile.socialStatus -
      50
    ) * 0.10;

  score -=
    profile.stress *
    0.20;

  if (
    expenseRatio > 1
  ) {
    score -= 20;
  } else if (
    expenseRatio > 0.8
  ) {
    score -= 10;
  }

  return clamp(
    Math.round(score),
    0,
    100
  );
}

function calculateStress(
  profile
) {
  if (!profile) {
    return 100;
  }

  const income =
    Number(
      profile.monthlyIncome
    ) || 0;

  const expenses =
    Number(
      profile.monthlyExpenses
    ) || 0;

  let stress = 50;

  if (
    income <= 0
  ) {
    stress += 25;
  } else {
    const ratio =
      expenses /
      income;

    if (ratio > 1) {
      stress += 30;
    } else if (
      ratio > 0.8
    ) {
      stress += 15;
    } else if (
      ratio < 0.5
    ) {
      stress -= 10;
    }
  }

  const lifestyle =
    getLifestyleLevel(
      profile.level
    );

  if (lifestyle) {
    stress +=
      lifestyle.stress -
      50;
  }

  return clamp(
    Math.round(stress),
    0,
    100
  );
}

function calculateComfort(
  profile
) {
  if (!profile) {
    return 0;
  }

  const lifestyle =
    getLifestyleLevel(
      profile.level
    );

  let score =
    lifestyle?.comfort ??
    30;

  const serviceBonus =
    profile.services
      .filter(
        service =>
          service.active !==
          false
      )
      .reduce(
        (sum, service) =>
          sum +
          Number(
            service.comfortBonus ||
              0
          ),
        0
      );

  const staffBonus =
    profile.staff
      .filter(
        staff =>
          staff.active !==
          false
      )
      .reduce(
        (sum, staff) =>
          sum +
          Number(
            staff.comfortBonus ||
              0
          ),
        0
      );

  score +=
    serviceBonus +
    staffBonus;

  return clamp(
    Math.round(score),
    0,
    100
  );
}

function calculateSocialStatus(
  profile
) {
  if (!profile) {
    return 0;
  }

  const lifestyle =
    getLifestyleLevel(
      profile.level
    );

  let score =
    lifestyle?.socialStatus ??
    10;

  score +=
    (
      profile.prestige -
      50
    ) * 0.25;

  return clamp(
    Math.round(score),
    0,
    100
  );
}

function calculateQualityOfLife(
  profile
) {
  if (!profile) {
    return 0;
  }

  const happiness =
    calculateHappiness(
      profile
    );

  const stress =
    calculateStress(
      profile
    );

  const comfort =
    calculateComfort(
      profile
    );

  const social =
    calculateSocialStatus(
      profile
    );

  return clamp(
    Math.round(
      happiness *
        0.35 +
      (100 - stress) *
        0.25 +
      comfort *
        0.25 +
      social *
        0.15
    ),
    0,
    100
  );
}

function updateLifestyleDerivedValues(
  profile
) {
  if (!profile) {
    return null;
  }

  recalculateMonthlyExpenses(
    profile
  );

  profile.happiness =
    calculateHappiness(
      profile
    );

  profile.stress =
    calculateStress(
      profile
    );

  profile.comfort =
    calculateComfort(
      profile
    );

  profile.socialStatus =
    calculateSocialStatus(
      profile
    );

  profile.qualityOfLife =
    calculateQualityOfLife(
      profile
    );

  const level =
    getLifestyleLevel(
      profile.level
    );

  profile.levelName =
    level?.name ||
    getLifestyleLevelLabel(
      profile.level
    );

  return profile;
}

/* ============================================================
   ATUALIZAÇÃO PELO PATRIMÔNIO
   ============================================================ */

function updateLifestyleFromWealth(
  database,
  entityId,
  monthlyIncome = 0,
  netWorth = 0
) {
  const profile =
    findLifestyleProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  profile.monthlyIncome =
    Math.max(
      0,
      Number(
        monthlyIncome
      ) || 0
    );

  const previousLevel =
    profile.level;

  profile.level =
    calculateLifestyleLevel(
      profile.monthlyIncome,
      profile.monthlyExpenses,
      netWorth
    );

  profile.levelName =
    getLifestyleLevelLabel(
      profile.level
    );

  if (
    profile.level !==
    previousLevel
  ) {
    addLifestyleHistory(
      profile,
      "level_change",
      `Padrão de vida alterado para ${profile.levelName}.`,
      {
        previousLevel,
        newLevel:
          profile.level,
        netWorth
      }
    );
  }

  updateLifestyleDerivedValues(
    profile
  );

  return clone(profile);
}

/* ============================================================
   PROCESSAMENTO MENSAL
   ============================================================ */

function processLifestyleMonth(
  database,
  entityId,
  options = {}
) {
  const profile =
    findLifestyleProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  if (
    options.monthlyIncome !==
    undefined
  ) {
    profile.monthlyIncome =
      Math.max(
        0,
        Number(
          options.monthlyIncome
        ) || 0
      );
  }

  if (
    options.netWorth !==
    undefined
  ) {
    profile.level =
      calculateLifestyleLevel(
        profile.monthlyIncome,
        profile.monthlyExpenses,
        options.netWorth
      );
  }

  profile.travel
    .tripsThisYear =
    Number(
      profile.travel
        .tripsThisYear
    ) || 0;

  updateLifestyleDerivedValues(
    profile
  );

  profile.savingsRate =
    profile.monthlyIncome > 0
      ? clamp(
          Math.round(
            (
              (
                profile.monthlyIncome -
                profile.monthlyExpenses
              ) /
              profile.monthlyIncome
            ) *
              100
          ),
          0,
          100
        )
      : 0;

  profile.lastProcessedMonth =
    options.date ||
    new Date().toISOString();

  addLifestyleHistory(
    profile,
    "monthly_update",
    "Padrão de vida processado.",
    {
      monthlyIncome:
        profile.monthlyIncome,

      monthlyExpenses:
        profile.monthlyExpenses,

      savingsRate:
        profile.savingsRate,

      qualityOfLife:
        profile.qualityOfLife
    }
  );

  return clone(profile);
}

/* ============================================================
   PROCESSAMENTO ANUAL
   ============================================================ */

function processLifestyleYear(
  database,
  entityId
) {
  const profile =
    findLifestyleProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  profile.travel
    .tripsThisYear = 0;

  profile.travel
    .internationalTrips = 0;

  updateLifestyleDerivedValues(
    profile
  );

  addLifestyleHistory(
    profile,
    "yearly_update",
    "Ano de estilo de vida processado."
  );

  return clone(profile);
}

/* ============================================================
   HISTÓRICO
   ============================================================ */

function addLifestyleHistory(
  profile,
  type,
  description,
  data = {}
) {
  if (!profile) {
    return null;
  }

  if (
    !Array.isArray(
      profile.history
    )
  ) {
    profile.history = [];
  }

  const event = {
    id:
      generateId(
        "lifestyle_history"
      ),

    type,

    description,

    date:
      new Date().toISOString(),

    data:
      clone(data)
  };

  profile.history.push(
    event
  );

  return clone(event);
}

function getLifestyleHistory(
  database,
  entityId
) {
  const profile =
    getLifestyleProfile(
      database,
      entityId
    );

  if (!profile) {
    return [];
  }

  return (
    profile.history || []
  ).map(clone);
}

/* ============================================================
   COMPARAÇÃO
   ============================================================ */

function compareLifestyleLevels(
  firstLevel,
  secondLevel
) {
  const first =
    Number(firstLevel);

  const second =
    Number(secondLevel);

  if (
    first === second
  ) {
    return 0;
  }

  return first >
    second
    ? 1
    : -1;
}

function isHigherLifestyle(
  firstLevel,
  secondLevel
) {
  return (
    compareLifestyleLevels(
      firstLevel,
      secondLevel
    ) > 0
  );
}

function getNextLifestyleLevel(
  level
) {
  const current =
    Number(level);

  if (
    current >= 10
  ) {
    return getLifestyleLevel(
      10
    );
  }

  return getLifestyleLevel(
    current + 1
  );
}

function getPreviousLifestyleLevel(
