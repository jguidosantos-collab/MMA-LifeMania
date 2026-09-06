/* ============================================================
   MMA LIFE DYNASTY
   LIFE — RESIDENCE
   Sistema de moradia, imóveis, aluguel, compra e qualidade de vida
   ============================================================ */

const RESIDENCE_VERSION = 1;

/* ============================================================
   TIPOS DE RESIDÊNCIA
   ============================================================ */

const RESIDENCE_TYPES = {
  HOMELESS: "homeless",
  SHARED: "shared",
  ROOM: "room",
  STUDIO: "studio",
  APARTMENT: "apartment",
  HOUSE: "house",
  CONDO: "condo",
  PENTHOUSE: "penthouse",
  MANSION: "mansion",
  FARM: "farm",
  ESTATE: "estate"
};

/* ============================================================
   REGIME DE MORADIA
   ============================================================ */

const RESIDENCE_OWNERSHIP = {
  HOMELESS: "homeless",
  RENTED: "rented",
  OWNED: "owned",
  FINANCED: "financed",
  SHARED: "shared",
  FAMILY: "family",
  TEMPORARY: "temporary"
};

/* ============================================================
   NÍVEIS DE QUALIDADE
   ============================================================ */

const RESIDENCE_QUALITY = {
  VERY_LOW: 1,
  LOW: 2,
  BASIC: 3,
  STANDARD: 4,
  COMFORTABLE: 5,
  HIGH: 6,
  LUXURY: 7,
  ULTRA_LUXURY: 8
};

/* ============================================================
   UTILITÁRIOS
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

function generateId(prefix = "residence") {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

/* ============================================================
   LABELS
   ============================================================ */

function getResidenceTypeLabel(type) {
  const labels = {
    homeless: "Sem moradia",
    shared: "Moradia compartilhada",
    room: "Quarto",
    studio: "Studio",
    apartment: "Apartamento",
    house: "Casa",
    condo: "Condomínio",
    penthouse: "Cobertura",
    mansion: "Mansão",
    farm: "Fazenda",
    estate: "Propriedade de luxo"
  };

  return (
    labels[type] ||
    "Desconhecido"
  );
}

function getOwnershipLabel(ownership) {
  const labels = {
    homeless: "Sem moradia",
    rented: "Alugada",
    owned: "Própria",
    financed: "Financiada",
    shared: "Compartilhada",
    family: "Familiar",
    temporary: "Temporária"
  };

  return (
    labels[ownership] ||
    "Desconhecido"
  );
}

function getQualityLabel(quality) {
  const labels = {
    1: "Muito baixa",
    2: "Baixa",
    3: "Básica",
    4: "Padrão",
    5: "Confortável",
    6: "Alta",
    7: "Luxo",
    8: "Ultra luxo"
  };

  return (
    labels[quality] ||
    "Desconhecida"
  );
}

/* ============================================================
   TIPOS PADRÃO
   ============================================================ */

const DEFAULT_RESIDENCE_CATALOG = [
  {
    id: "room",
    type: RESIDENCE_TYPES.ROOM,
    name: "Quarto alugado",
    quality: 2,
    capacity: 1,
    monthlyRent: 500,
    purchasePrice: 0,
    maintenance: 50,
    comfort: 25,
    security: 35,
    prestige: 5,
    privacy: 20,
    space: 15,
    suitableFor: [
      "single"
    ]
  },

  {
    id: "shared_apartment",
    type: RESIDENCE_TYPES.SHARED,
    name: "Apartamento compartilhado",
    quality: 3,
    capacity: 3,
    monthlyRent: 900,
    purchasePrice: 0,
    maintenance: 100,
    comfort: 40,
    security: 45,
    prestige: 10,
    privacy: 25,
    space: 30,
    suitableFor: [
      "single",
      "couple"
    ]
  },

  {
    id: "studio",
    type: RESIDENCE_TYPES.STUDIO,
    name: "Studio",
    quality: 3,
    capacity: 1,
    monthlyRent: 1200,
    purchasePrice: 180000,
    maintenance: 150,
    comfort: 45,
    security: 55,
    prestige: 15,
    privacy: 55,
    space: 30,
    suitableFor: [
      "single"
    ]
  },

  {
    id: "basic_apartment",
    type: RESIDENCE_TYPES.APARTMENT,
    name: "Apartamento básico",
    quality: 4,
    capacity: 3,
    monthlyRent: 1800,
    purchasePrice: 280000,
    maintenance: 250,
    comfort: 55,
    security: 60,
    prestige: 25,
    privacy: 60,
    space: 45,
    suitableFor: [
      "single",
      "couple",
      "small_family"
    ]
  },

  {
    id: "comfortable_apartment",
    type: RESIDENCE_TYPES.APARTMENT,
    name: "Apartamento confortável",
    quality: 5,
    capacity: 4,
    monthlyRent: 3000,
    purchasePrice: 500000,
    maintenance: 450,
    comfort: 70,
    security: 70,
    prestige: 40,
    privacy: 70,
    space: 60,
    suitableFor: [
      "couple",
      "small_family",
      "family"
    ]
  },

  {
    id: "house",
    type: RESIDENCE_TYPES.HOUSE,
    name: "Casa",
    quality: 5,
    capacity: 5,
    monthlyRent: 3500,
    purchasePrice: 650000,
    maintenance: 500,
    comfort: 72,
    security: 65,
    prestige: 45,
    privacy: 80,
    space: 75,
    suitableFor: [
      "couple",
      "small_family",
      "family"
    ]
  },

  {
    id: "luxury_condo",
    type: RESIDENCE_TYPES.CONDO,
    name: "Condomínio de luxo",
    quality: 6,
    capacity: 5,
    monthlyRent: 6000,
    purchasePrice: 1200000,
    maintenance: 900,
    comfort: 82,
    security: 88,
    prestige: 65,
    privacy: 75,
    space: 70,
    suitableFor: [
      "couple",
      "family"
    ]
  },

  {
    id: "penthouse",
    type: RESIDENCE_TYPES.PENTHOUSE,
    name: "Cobertura",
    quality: 7,
    capacity: 6,
    monthlyRent: 12000,
    purchasePrice: 3000000,
    maintenance: 1800,
    comfort: 92,
    security: 90,
    prestige: 85,
    privacy: 90,
    space: 90,
    suitableFor: [
      "family",
      "wealthy"
    ]
  },

  {
    id: "mansion",
    type: RESIDENCE_TYPES.MANSION,
    name: "Mansão",
    quality: 8,
    capacity: 10,
    monthlyRent: 25000,
    purchasePrice: 8000000,
    maintenance: 4000,
    comfort: 98,
    security: 95,
    prestige: 98,
    privacy: 98,
    space: 100,
    suitableFor: [
      "wealthy",
      "family"
    ]
  },

  {
    id: "farm",
    type: RESIDENCE_TYPES.FARM,
    name: "Fazenda",
    quality: 7,
    capacity: 8,
    monthlyRent: 10000,
    purchasePrice: 5000000,
    maintenance: 2500,
    comfort: 88,
    security: 80,
    prestige: 80,
    privacy: 100,
    space: 100,
    suitableFor: [
      "family",
      "wealthy"
    ]
  },

  {
    id: "estate",
    type: RESIDENCE_TYPES.ESTATE,
    name: "Propriedade de luxo",
    quality: 8,
    capacity: 12,
    monthlyRent: 40000,
    purchasePrice: 15000000,
    maintenance: 7000,
    comfort: 100,
    security: 100,
    prestige: 100,
    privacy: 100,
    space: 100,
    suitableFor: [
      "wealthy",
      "family"
    ]
  }
];

/* ============================================================
   CATÁLOGO
   ============================================================ */

function createResidenceType(
  data = {}
) {
  return {
    id:
      normalizeId(data.id) ||
      generateId("residence_type"),

    type:
      data.type ||
      RESIDENCE_TYPES.APARTMENT,

    name:
      data.name ||
      "Residência",

    quality:
      clamp(
        Number(
          data.quality ?? 4
        ),
        1,
        8
      ),

    capacity:
      Math.max(
        1,
        Number(
          data.capacity ?? 2
        )
      ),

    monthlyRent:
      Math.max(
        0,
        Number(
          data.monthlyRent ?? 0
        )
      ),

    purchasePrice:
      Math.max(
        0,
        Number(
          data.purchasePrice ?? 0
        )
      ),

    maintenance:
      Math.max(
        0,
        Number(
          data.maintenance ?? 0
        )
      ),

    comfort:
      clamp(
        Number(
          data.comfort ?? 50
        ),
        0,
        100
      ),

    security:
      clamp(
        Number(
          data.security ?? 50
        ),
        0,
        100
      ),

    prestige:
      clamp(
        Number(
          data.prestige ?? 50
        ),
        0,
        100
      ),

    privacy:
      clamp(
        Number(
          data.privacy ?? 50
        ),
        0,
        100
      ),

    space:
      clamp(
        Number(
          data.space ?? 50
        ),
        0,
        100
      ),

    suitableFor:
      Array.isArray(
        data.suitableFor
      )
        ? [...data.suitableFor]
        : [
            "single",
            "couple"
          ]
  };
}

function getResidenceType(
  residenceId
) {
  const id =
    normalizeId(
      residenceId
    );

  const residence =
    DEFAULT_RESIDENCE_CATALOG.find(
      item =>
        normalizeId(item.id) === id
    );

  return residence
    ? clone(residence)
    : null;
}

function getAllResidenceTypes() {
  return DEFAULT_RESIDENCE_CATALOG.map(
    clone
  );
}

function getResidenceTypesByQuality(
  quality
) {
  return DEFAULT_RESIDENCE_CATALOG
    .filter(
      item =>
        item.quality ===
        Number(quality)
    )
    .map(clone);
}

function getResidenceTypesByCapacity(
  capacity
) {
  return DEFAULT_RESIDENCE_CATALOG
    .filter(
      item =>
        item.capacity >=
        Number(capacity)
    )
    .map(clone);
}

/* ============================================================
   PERFIL DE RESIDÊNCIA
   ============================================================ */

function createResidence(
  data = {}
) {
  const catalog =
    data.residenceTypeId
      ? getResidenceType(
          data.residenceTypeId
        )
      : null;

  return {
    id:
      normalizeId(data.id) ||
      generateId("residence"),

    residenceTypeId:
      data.residenceTypeId ||
      catalog?.id ||
      null,

    type:
      data.type ||
      catalog?.type ||
      RESIDENCE_TYPES.HOMELESS,

    name:
      data.name ||
      catalog?.name ||
      "Sem moradia",

    ownership:
      data.ownership ||
      RESIDENCE_OWNERSHIP.HOMELESS,

    address:
      data.address || null,

    cityId:
      normalizeId(
        data.cityId
      ),

    countryId:
      normalizeId(
        data.countryId
      ),

    quality:
      clamp(
        Number(
          data.quality ??
            catalog?.quality ??
            1
        ),
        1,
        8
      ),

    capacity:
      Math.max(
        1,
        Number(
          data.capacity ??
            catalog?.capacity ??
            1
        )
      ),

    occupants:
      Array.isArray(
        data.occupants
      )
        ? data.occupants.map(
            normalizeId
          ).filter(Boolean)
        : [],

    purchasePrice:
      Math.max(
        0,
        Number(
          data.purchasePrice ??
            catalog?.purchasePrice ??
            0
        )
      ),

    marketValue:
      Math.max(
        0,
        Number(
          data.marketValue ??
            data.purchasePrice ??
            catalog?.purchasePrice ??
            0
        )
      ),

    monthlyRent:
      Math.max(
        0,
        Number(
          data.monthlyRent ??
            catalog?.monthlyRent ??
            0
        )
      ),

    monthlyMaintenance:
      Math.max(
        0,
        Number(
          data.monthlyMaintenance ??
            catalog?.maintenance ??
            0
        )
      ),

    mortgage:
      data.mortgage
        ? clone(data.mortgage)
        : null,

    features:
      Array.isArray(data.features)
        ? [...data.features]
        : [],

    comfort:
      clamp(
        Number(
          data.comfort ??
            catalog?.comfort ??
            25
        ),
        0,
        100
      ),

    security:
      clamp(
        Number(
          data.security ??
            catalog?.security ??
            30
        ),
        0,
        100
      ),

    prestige:
      clamp(
        Number(
          data.prestige ??
            catalog?.prestige ??
            5
        ),
        0,
        100
      ),

    privacy:
      clamp(
        Number(
          data.privacy ??
            catalog?.privacy ??
            20
        ),
        0,
        100
      ),

    space:
      clamp(
        Number(
          data.space ??
            catalog?.space ??
            15
        ),
        0,
        100
      ),

    happinessBonus:
      0,

    healthBonus:
      0,

    securityBonus:
      0,

    active:
      data.active !== false,

    purchaseDate:
      data.purchaseDate ||
      null,

    moveInDate:
      data.moveInDate ||
      new Date().toISOString(),

    createdAt:
      data.createdAt ||
      new Date().toISOString(),

    updatedAt:
      data.updatedAt ||
      new Date().toISOString()
  };
}

/* ============================================================
   ESTADO
   ============================================================ */

function ensureResidenceState(
  database
) {
  if (!database) {
    return null;
  }

  if (!database.life) {
    database.life = {};
  }

  if (!database.life.residence) {
    database.life.residence = {};
  }

  const residence =
    database.life.residence;

  if (!residence.profiles) {
    residence.profiles = {};
  }

  if (
    !Array.isArray(
      residence.properties
    )
  ) {
    residence.properties = [];
  }

  if (
    !Array.isArray(
      residence.history
    )
  ) {
    residence.history = [];
  }

  return residence;
}

/* ============================================================
   PERFIS
   ============================================================ */

function addResidenceProfile(
  database,
  entityId,
  data = {}
) {
  const state =
    ensureResidenceState(
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
    createResidence(
      data
    );

  state.profiles[id] =
    profile;

  return clone(profile);
}

function getResidenceProfile(
  database,
  entityId
) {
  const state =
    ensureResidenceState(
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

function findResidenceProfileReference(
  database,
  entityId
) {
  const state =
    ensureResidenceState(
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

function getAllResidenceProfiles(
  database
) {
  const state =
    ensureResidenceState(
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

function updateResidenceProfile(
  database,
  entityId,
  updates = {}
) {
  const profile =
    findResidenceProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  Object.keys(updates).forEach(
    key => {
      if (
        updates[key] !== undefined
      ) {
        profile[key] =
          clone(updates[key]);
      }
    }
  );

  profile.updatedAt =
    new Date().toISOString();

  return clone(profile);
}

/* ============================================================
   CUSTO DE MORADIA
   ============================================================ */

function calculateMonthlyResidenceCost(
  residence
) {
  if (!residence) {
    return 0;
  }

  let total = 0;

  if (
    residence.ownership ===
    RESIDENCE_OWNERSHIP.RENTED
  ) {
    total +=
      Number(
        residence.monthlyRent
      ) || 0;
  }

  if (
    residence.ownership ===
      RESIDENCE_OWNERSHIP.OWNED ||
    residence.ownership ===
      RESIDENCE_OWNERSHIP.FINANCED
  ) {
    total +=
      Number(
        residence.monthlyMaintenance
      ) || 0;
  }

  if (
    residence.ownership ===
    RESIDENCE_OWNERSHIP.SHARED
  ) {
    total +=
      (
        Number(
          residence.monthlyRent
        ) || 0
      ) / 2;
  }

  if (
    residence.ownership ===
    RESIDENCE_OWNERSHIP.FAMILY
  ) {
    total +=
      Number(
        residence.monthlyMaintenance
      ) || 0;
  }

  if (
    residence.mortgage?.monthlyPayment
  ) {
    total +=
      Number(
        residence.mortgage
          .monthlyPayment
      ) || 0;
  }

  return Math.max(
    0,
    Math.round(total)
  );
}

/* ============================================================
   ALUGUEL
   ============================================================ */

function rentResidence(
  database,
  entityId,
  residenceTypeId,
  options = {}
) {
  const profile =
    findResidenceProfileReference(
      database,
      entityId
    );

  const type =
    getResidenceType(
      residenceTypeId
    );

  if (
    !profile ||
    !type
  ) {
    return null;
  }

  const residence =
    createResidence({
      ...options,

      residenceTypeId:
        type.id,

      type:
        type.type,

      name:
        type.name,

      ownership:
        RESIDENCE_OWNERSHIP.RENTED,

      monthlyRent:
        options.monthlyRent ??
        type.monthlyRent,

      monthlyMaintenance:
        options.monthlyMaintenance ??
        type.maintenance
    });

  profile.ownership =
    residence.ownership;

  profile.residenceTypeId =
    residence.residenceTypeId;

  profile.type =
    residence.type;

  profile.name =
    residence.name;

  profile.address =
    residence.address;

  profile.cityId =
    residence.cityId;

  profile.countryId =
    residence.countryId;

  profile.quality =
    residence.quality;

  profile.capacity =
    residence.capacity;

  profile.occupants =
    residence.occupants;

  profile.purchasePrice =
    residence.purchasePrice;

  profile.marketValue =
    residence.marketValue;

  profile.monthlyRent =
    residence.monthlyRent;

  profile.monthlyMaintenance =
    residence.monthlyMaintenance;

  profile.mortgage =
    residence.mortgage;

  profile.features =
    residence.features;

  profile.comfort =
    residence.comfort;

  profile.security =
    residence.security;

  profile.prestige =
    residence.prestige;

  profile.privacy =
    residence.privacy;

  profile.space =
    residence.space;

  profile.active =
    true;

  profile.moveInDate =
    new Date().toISOString();

  addResidenceHistory(
    profile,
    "rent",
    `Alugou ${residence.name}.`,
    {
      residenceTypeId:
        residence.residenceTypeId,
      monthlyRent:
        residence.monthlyRent
    }
  );

  return clone(
    profile
  );
}

/* ============================================================
   COMPRA
   ============================================================ */

function buyResidence(
  database,
  entityId,
  residenceTypeId,
  options = {}
) {
  const profile =
    findResidenceProfileReference(
      database,
      entityId
    );

  const type =
    getResidenceType(
      residenceTypeId
    );

  if (
    !profile ||
    !type
  ) {
    return null;
  }

  if (
    type.purchasePrice <= 0
  ) {
    return null;
  }

  const purchasePrice =
    Math.max(
      0,
      Number(
        options.purchasePrice ??
          type.purchasePrice
      )
    );

  const ownership =
    options.financed
      ? RESIDENCE_OWNERSHIP.FINANCED
      : RESIDENCE_OWNERSHIP.OWNED;

  const residence =
    createResidence({
      ...options,

      residenceTypeId:
        type.id,

      type:
        type.type,

      name:
        type.name,

      ownership,

      purchasePrice,

      marketValue:
        options.marketValue ??
        purchasePrice,

      monthlyMaintenance:
        options.monthlyMaintenance ??
        type.maintenance
    });

  if (
    options.financed
  ) {
    const downPayment =
      Math.max(
        0,
        Number(
          options.downPayment ??
            purchasePrice * 0.2
        )
      );

    const financedAmount =
      Math.max(
        0,
        purchasePrice -
          downPayment
      );

    const months =
      Math.max(
        12,
        Number(
          options.termMonths ??
            240
        )
      );

    const interest =
      Math.max(
        0,
        Number(
          options.interestRate ??
            0.008
        )
      );

    const monthlyPayment =
      calculateLoanPayment(
        financedAmount,
        interest,
        months
      );

    residence.mortgage = {
      principal:
        financedAmount,

      downPayment,

      interestRate:
        interest,

      termMonths:
        months,

      remainingMonths:
        months,

      monthlyPayment,

      remainingBalance:
        calculateRemainingBalance(
          financedAmount,
          interest,
          monthlyPayment,
          months
        )
    };
  }

  Object.assign(
    profile,
    residence
  );

  profile.purchaseDate =
    new Date().toISOString();

  profile.moveInDate =
    new Date().toISOString();

  addResidenceHistory(
    profile,
    "purchase",
    `Comprou ${residence.name}.`,
    {
      residenceTypeId:
        residence.residenceTypeId,

      purchasePrice:
        residence.purchasePrice,

      financed:
        Boolean(
          options.financed
        )
    }
  );

  return clone(
    profile
  );
}

/* ============================================================
   FINANCIAMENTO
   ============================================================ */

function calculateLoanPayment(
  principal,
  monthlyRate,
  months
) {
  if (
    principal <= 0 ||
    months <= 0
  ) {
    return 0;
  }

  if (
    monthlyRate <= 0
  ) {
    return Math.round(
      principal / months
    );
  }

  const payment =
    principal *
    (
      monthlyRate *
      Math.pow(
        1 + monthlyRate,
        months
      )
    ) /
    (
      Math.pow(
        1 + monthlyRate,
        months
      ) - 1
    );

  return Math.round(
    payment
  );
}

function calculateRemainingBalance(
  principal,
  monthlyRate,
  payment,
  remainingMonths
) {
  if (
    principal <= 0 ||
    remainingMonths <= 0
  ) {
    return 0;
  }

  if (
    monthlyRate <= 0
  ) {
    return Math.max(
      0,
      Math.round(
        principal -
          payment *
            remainingMonths
      )
    );
  }

  const balance =
    principal *
      Math.pow(
        1 + monthlyRate,
        remainingMonths
      ) -
    payment *
      (
        Math.pow(
          1 + monthlyRate,
          remainingMonths
        ) - 1
      ) /
      monthlyRate;

  return Math.max(
    0,
    Math.round(balance)
  );
}

function processMortgageMonth(
  database,
  entityId
) {
  const profile =
    findResidenceProfileReference(
      database,
      entityId
    );

  if (
    !profile ||
    !profile.mortgage
  ) {
    return null;
  }

  const mortgage =
    profile.mortgage;

  if (
    mortgage.remainingMonths <= 0
  ) {
    mortgage.remainingBalance =
      0;

    return clone(profile);
  }

  mortgage.remainingMonths -=
    1;

  mortgage.remainingBalance =
    calculateRemainingBalance(
      Number(
        mortgage.remainingBalance
      ) || 0,
      Number(
        mortgage.interestRate
      ) || 0,
      Number(
        mortgage.monthlyPayment
      ) || 0,
      Number(
        mortgage.remainingMonths
      ) || 0
    );

  if (
    mortgage.remainingMonths <= 0 ||
    mortgage.remainingBalance <= 0
  ) {
    mortgage.remainingMonths =
      0;

    mortgage.remainingBalance =
      0;

    profile.ownership =
      RESIDENCE_OWNERSHIP.OWNED;

    profile.mortgage = null;

    addResidenceHistory(
      profile,
      "mortgage_paid",
      "Quitou o financiamento do imóvel."
    );
  }

  return clone(profile);
}

/* ============================================================
   MUDANÇA
   ============================================================ */

function moveToResidence(
  database,
  entityId,
  residenceData
) {
  const profile =
    findResidenceProfileReference(
      database,
      entityId
    );

  if (
    !profile ||
    !residenceData
  ) {
    return null;
  }

  const previous =
    clone(profile);

  Object.assign(
    profile,
    createResidence(
      {
        ...residenceData,

        id:
          profile.id
      }
    )
  );

  profile.moveInDate =
    new Date().toISOString();

  addResidenceHistory(
    profile,
    "move",
    `Mudou-se para ${profile.name}.`,
    {
      previousResidence:
        previous.name,

      newResidence:
        profile.name,

      cityId:
        profile.cityId,

      countryId:
        profile.countryId
    }
  );

  return clone(profile);
}

/* ============================================================
   VENDA
   ============================================================ */

function sellResidence(
  database,
  entityId,
  salePrice = null
) {
  const profile =
    findResidenceProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  if (
    profile.ownership !==
      RESIDENCE_OWNERSHIP.OWNED &&
    profile.ownership !==
      RESIDENCE_OWNERSHIP.FINANCED
  ) {
    return null;
  }

  const value =
    Math.max(
      0,
      Number(
        salePrice ??
          profile.marketValue
      )
    );

  const sold = {
    residenceId:
      profile.id,

    name:
      profile.name,

    salePrice:
      value,

    previousOwnership:
      profile.ownership,

    date:
      new Date().toISOString()
  };

  if (
    profile.mortgage
  ) {
    sold.remainingMortgage =
      Number(
        profile.mortgage
          .remainingBalance
      ) || 0;

    sold.netValue =
      Math.max(
        0,
        value -
          sold.remainingMortgage
      );
  } else {
    sold.netValue =
      value;
  }

  profile.active =
    false;

  profile.ownership =
    RESIDENCE_OWNERSHIP.TEMPORARY;

  profile.currentlyOwned =
    false;

  addResidenceHistory(
    profile,
    "sale",
    `Vendeu ${profile.name}.`,
    sold
  );

  return clone(
    sold
  );
}

/* ============================================================
   OCUPANTES
   ============================================================ */

function addOccupant(
  database,
  entityId,
  occupantId
) {
  const profile =
    findResidenceProfileReference(
      database,
      entityId
    );

  const id =
    normalizeId(
      occupantId
    );

  if (
    !profile ||
    !id
  ) {
    return false;
  }

  if (
    profile.occupants.includes(
      id
    )
  ) {
    return true;
  }

  if (
    profile.occupants.length >=
    profile.capacity
  ) {
    return false;
  }

  profile.occupants.push(
    id
  );

  return true;
}

function removeOccupant(
  database,
  entityId,
  occupantId
) {
  const profile =
    findResidenceProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return false;
  }

  const id =
    normalizeId(
      occupantId
    );

  profile.occupants =
    profile.occupants.filter(
      occupant =>
        occupant !== id
    );

  return true;
}

function getOccupants(
  database,
  entityId
) {
  const profile =
    getResidenceProfile(
      database,
      entityId
    );

  return profile
    ? [...profile.occupants]
    : [];
}

function hasAvailableCapacity(
  residence
) {
  if (!residence) {
    return false;
  }

  return (
    residence.occupants.length <
    residence.capacity
  );
}

/* ============================================================
   QUALIDADE DE VIDA
   ============================================================ */

function calculateResidenceQualityScore(
  residence
) {
  if (!residence) {
    return 0;
  }

  const score =
    residence.comfort *
      0.25 +
    residence.security *
      0.25 +
    residence.privacy *
      0.15 +
    residence.space *
      0.15 +
    residence.prestige *
      0.10 +
    residence.quality *
      10 *
      0.10;

  return clamp(
    Math.round(score),
    0,
    100
  );
}

function calculateHappinessBonus(
  residence
) {
  if (!residence) {
    return -25;
  }

  const score =
    calculateResidenceQualityScore(
      residence
    );

  return Math.round(
    (score - 50) /
      5
  );
}

function calculateHealthBonus(
  residence
) {
  if (!residence) {
    return -10;
  }

  return Math.round(
    (
      residence.comfort *
        0.6 +
      residence.security *
        0.4 -
      50
    ) / 10
  );
}

function calculateSecurityBonus(
  residence
) {
  if (!residence) {
    return -25;
  }

  return Math.round(
    (
      residence.security -
      50
    ) / 5
  );
}

function updateResidenceBonuses(
  profile
) {
  if (!profile) {
    return null;
  }

  profile.happinessBonus =
    calculateHappinessBonus(
      profile
    );

  profile.healthBonus =
    calculateHealthBonus(
      profile
    );

  profile.securityBonus =
    calculateSecurityBonus(
      profile
    );

  return profile;
}

/* ============================================================
   VALORIZAÇÃO
   ============================================================ */

function calculatePropertyAppreciation(
  residence,
  annualRate = 0.04
) {
  if (
    !residence ||
    residence.marketValue <= 0
  ) {
    return 0;
  }

  const rate =
    Number(
      annualRate
    ) || 0;

  const increase =
    residence.marketValue *
    rate;

  residence.marketValue =
    Math.max(
      0,
      Math.round(
        residence.marketValue +
          increase
      )
    );

  return Math.round(
    increase
  );
}

function processResidenceYear(
  database,
  entityId,
  annualRate = null
) {
  const profile =
    findResidenceProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  if (
    profile.ownership ===
      RESIDENCE_OWNERSHIP.OWNED ||
    profile.ownership ===
      RESIDENCE_OWNERSHIP.FINANCED
  ) {
    const rate =
      annualRate ??
      randomFloat(
        0.01,
        0.08
      );

    calculatePropertyAppreciation(
      profile,
      rate
    );
  }

  updateResidenceBonuses(
    profile
  );

  addResidenceHistory(
    profile,
    "yearly_update",
    "Residência atualizada pela valorização anual.",
    {
      marketValue:
        profile.marketValue
    }
  );

  return clone(profile);
}

/* ============================================================
   CARREIRA / PATRIMÔNIO
   ============================================================ */

function canAffordResidence(
  availableMoney,
  residenceType,
  mode = "rent"
) {
  if (
    !residenceType
  ) {
    return false;
  }

  const money =
    Math.max(
      0,
      Number(
        availableMoney
      ) || 0
    );

  if (
    mode === "buy"
  ) {
    return (
      money >=
      residenceType.purchasePrice
    );
  }

  if (
    mode === "rent"
  ) {
    return (
      money >=
      residenceType.monthlyRent
    );
  }

  return false;
}

function getRecommendedResidence(
  wealth = 0,
  familySize = 1
) {
  const money =
    Math.max(
      0,
      Number(wealth) || 0
    );

  const size =
    Math.max(
      1,
      Number(familySize) || 1
    );

  let candidates =
    getAllResidenceTypes()
      .filter(
        residence =>
          residence.capacity >=
          size
      );

  if (
    candidates.length === 0
  ) {
    candidates =
      getAllResidenceTypes();
  }

  const budget =
    money > 0
      ? money * 0.35
      : 0;

  const affordable =
    candidates.filter(
      residence =>
        residence.purchasePrice <=
        budget
    );

  if (
    affordable.length > 0
  ) {
    return affordable[
      affordable.length - 1
    ];
  }

  return candidates[0] || null;
}

/* ============================================================
   HISTÓRICO
   ============================================================ */

function addResidenceHistory(
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
        "residence_history"
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

function getResidenceHistory(
  database,
  entityId
) {
  const profile =
    getResidenceProfile(
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
   PROCESSAMENTO MENSAL
   ============================================================ */

function processResidenceMonth(
  database,
  entityId
) {
  const profile =
    findResidenceProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  updateResidenceBonuses(
    profile
  );

  if (
    profile.mortgage
  ) {
    processMortgageMonth(
      database,
      entityId
    );
  }

  return clone(profile);
}

/* ============================================================
   ESTATÍSTICAS
   ============================================================ */

function calculateResidenceStats(
  database,
  entityId
) {
  const profile =
    getResidenceProfile(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  updateResidenceBonuses(
    profile
  );

  return {
    name:
      profile.name,

    type:
      profile.type,

    typeLabel:
      getResidenceTypeLabel(
        profile.type
      ),

    ownership:
      profile.ownership,

    ownershipLabel:
      getOwnershipLabel(
        profile.ownership
      ),

    quality:
      profile.quality,

    qualityLabel:
      getQualityLabel(
        profile.quality
      ),

    capacity:
      profile.capacity,

    occupants:
      profile.occupants.length,

    availableCapacity:
      Math.max(
        0,
        profile.capacity -
          profile.occupants.length
      ),

    marketValue:
      profile.marketValue,

    purchasePrice:
      profile.purchasePrice,

    monthlyRent:
      profile.monthlyRent,

    monthlyMaintenance:
      profile.monthlyMaintenance,

    monthlyCost:
      calculateMonthlyResidenceCost(
        profile
      ),

    comfort:
      profile.comfort,

    security:
      profile.security,

    privacy:
      profile.privacy,

    space:
      profile.space,

    prestige:
      profile.prestige,

    qualityOfLife:
      calculateResidenceQualityScore(
        profile
      ),

    happinessBonus:
      profile.happinessBonus,

    healthBonus:
      profile.healthBonus,

    securityBonus:
      profile.securityBonus,

    mortgage:
      profile.mortgage
        ? clone(
            profile.mortgage
          )
        : null
  };
}

/* ============================================================
   SNAPSHOT
   ============================================================ */

function getResidenceSnapshot(
  database
) {
  const profiles =
    getAllResidenceProfiles(
      database
    );

  return {
    version:
      RESIDENCE_VERSION,

    totalProfiles:
      profiles.length,

    owned:
      profiles.filter(
        profile =>
          profile.ownership ===
            RESIDENCE_OWNERSHIP.OWNED ||
          profile.ownership ===
            RESIDENCE_OWNERSHIP.FINANCED
      ).length,

    rented:
      profiles.filter(
        profile =>
          profile.ownership ===
          RESIDENCE_OWNERSHIP.RENTED
      ).length,

    homeless:
      profiles.filter(
        profile =>
          profile.ownership ===
          RESIDENCE_OWNERSHIP.HOMELESS
      ).length,

    totalPropertyValue:
      profiles.reduce(
        (sum, profile) =>
          sum +
          Number(
            profile.marketValue
          ),
        0
      ),

    totalMonthlyHousingCost:
      profiles.reduce(
        (sum, profile) =>
          sum +
          calculateMonthlyResidenceCost(
            profile
          ),
        0
      ),

    catalog:
      getAllResidenceTypes()
  };
}

/* ============================================================
   VALIDAÇÃO
   ============================================================ */

function validateResidence(
  residence
) {
  const errors = [];

  if (!residence) {
    return {
      valid: false,
      errors: [
        "Residência inexistente."
      ]
    };
  }

  if (!residence.id) {
    errors.push(
      "ID da residência ausente."
    );
  }

  if (
    !Object.values(
      RESIDENCE_TYPES
    ).includes(
      residence.type
    )
  ) {
    errors.push(
      "Tipo de residência inválido."
    );
  }

  if (
    !Object.values(
      RESIDENCE_OWNERSHIP
    ).includes(
      residence.ownership
    )
  ) {
    errors.push(
      "Regime de propriedade inválido."
    );
  }

  if (
    !Number.isFinite(
      Number(
        residence.quality
      )
    )
  ) {
    errors.push(
      "Qualidade da residência inválida."
    );
  }

  if (
    !Number.isFinite(
      Number(
        residence.capacity
      )
    )
  ) {
    errors.push(
      "Capacidade da residência inválida."
    );
  }

  if (
    !Array.isArray(
      residence.occupants
    )
  ) {
    errors.push(
      "Lista de ocupantes inválida."
    );
  }

  return {
    valid:
      errors.length === 0,

    errors
  };
}

function validateResidenceState(
  database
) {
  const profiles =
    getAllResidenceProfiles(
      database
    );

  const results =
    profiles.map(profile => ({
      entityId:
        profile.entityId,

      ...validateResidence(
        profile
      )
    }));

  return {
    valid:
      results.every(
        result =>
          result.valid
      ),

    total:
      results.length,

    results
  };
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

function initializeResidence(
  database,
  entityId = null,
  data = {}
) {
  const state =
    ensureResidenceState(
      database
    );

  if (!state) {
    return null;
  }

  if (entityId) {
    const existing =
      getResidenceProfile(
        database,
        entityId
      );

    if (!existing) {
      addResidenceProfile(
        database,
        entityId,
        data
      );
    }
  }

  return state;
}

/* ============================================================
   RESET
   ============================================================ */

function resetResidence(
  database
) {
  if (!database) {
    return null;
  }

  if (!database.life) {
    database.life = {};
  }

  database.life.residence = {
    profiles: {},
    properties: [],
    history: []
  };

  return database.life.residence;
}

/* ============================================================
   API
   ============================================================ */

const residenceAPI = {
  RESIDENCE_VERSION,

  RESIDENCE_TYPES,
  RESIDENCE_OWNERSHIP,
  RESIDENCE_QUALITY,

  DEFAULT_RESIDENCE_CATALOG,

  getResidenceTypeLabel,
  getOwnershipLabel,
  getQualityLabel,

  createResidenceType,
  getResidenceType,
  getAllResidenceTypes,
  getResidenceTypesByQuality,
  getResidenceTypesByCapacity,

  createResidence,

  ensureResidenceState,

  addResidenceProfile,
  getResidenceProfile,
  findResidenceProfileReference,
  getAllResidenceProfiles,
  updateResidenceProfile,

  calculateMonthlyResidenceCost,

  rentResidence,
  buyResidence,

  calculateLoanPayment,
  calculateRemainingBalance,
  processMortgageMonth,

  moveToResidence,
  sellResidence,

  addOccupant,
  removeOccupant,
  getOccupants,
  hasAvailableCapacity,

  calculateResidenceQualityScore,
  calculateHappinessBonus,
  calculateHealthBonus,
  calculateSecurityBonus,
  updateResidenceBonuses,

  calculatePropertyAppreciation,
  processResidenceYear,

  canAffordResidence,
  getRecommendedResidence,

  addResidenceHistory,
  getResidenceHistory,

  processResidenceMonth,

  calculateResidenceStats,
  getResidenceSnapshot,

  validateResidence,
  validateResidenceState,

  initializeResidence,
  resetResidence
};

export default residenceAPI;

export {
  RESIDENCE_VERSION,

  RESIDENCE_TYPES,
  RESIDENCE_OWNERSHIP,
  RESIDENCE_QUALITY,

  DEFAULT_RESIDENCE_CATALOG,

  getResidenceTypeLabel,
  getOwnershipLabel,
  getQualityLabel,

  createResidenceType,
  getResidenceType,
  getAllResidenceTypes,
  getResidenceTypesByQuality,
  getResidenceTypesByCapacity,

  createResidence,

  ensureResidenceState,

  addResidenceProfile,
  getResidenceProfile,
  findResidenceProfileReference,
  getAllResidenceProfiles,
  updateResidenceProfile,

  calculateMonthlyResidenceCost,

  rentResidence,
  buyResidence,

  calculateLoanPayment,
  calculateRemainingBalance,
  processMortgageMonth,

  moveToResidence,
  sellResidence,

  addOccupant,
  removeOccupant,
  getOccupants,
  hasAvailableCapacity,

  calculateResidenceQualityScore,
  calculateHappinessBonus,
  calculateHealthBonus,
  calculateSecurityBonus,
  updateResidenceBonuses,

  calculatePropertyAppreciation,
  processResidenceYear,

  canAffordResidence,
  getRecommendedResidence,

  addResidenceHistory,
  getResidenceHistory,

  processResidenceMonth,

  calculateResidenceStats,
  getResidenceSnapshot,

  validateResidence,
  validateResidenceState,

  initializeResidence,
  resetResidence,

  residenceAPI
};
