/* ============================================================
   MMA LIFE DYNASTY
   LIFE — VEHICLES
   Sistema de veículos, compra, financiamento, manutenção,
   combustível, seguro, garagem, patrimônio e venda.
   ============================================================ */

const VEHICLES_VERSION = 1;

/* ============================================================
   TIPOS DE VEÍCULO
   ============================================================ */

const VEHICLE_TYPES = {
  BICYCLE: "bicycle",
  MOTORCYCLE: "motorcycle",
  SCOOTER: "scooter",
  COMPACT_CAR: "compact_car",
  SEDAN: "sedan",
  HATCHBACK: "hatchback",
  SUV: "suv",
  PICKUP: "pickup",
  SPORTS_CAR: "sports_car",
  LUXURY_CAR: "luxury_car",
  SUPERCAR: "supercar",
  ELECTRIC_CAR: "electric_car",
  VAN: "van",
  TRUCK: "truck"
};

/* ============================================================
   CATEGORIAS
   ============================================================ */

const VEHICLE_CATEGORIES = {
  PERSONAL: "personal",
  FAMILY: "family",
  SPORTS: "sports",
  LUXURY: "luxury",
  WORK: "work",
  UTILITY: "utility"
};

/* ============================================================
   COMBUSTÍVEL
   ============================================================ */

const FUEL_TYPES = {
  NONE: "none",
  GASOLINE: "gasoline",
  ETHANOL: "ethanol",
  FLEX: "flex",
  DIESEL: "diesel",
  HYBRID: "hybrid",
  ELECTRIC: "electric"
};

/* ============================================================
   PROPRIEDADE
   ============================================================ */

const VEHICLE_OWNERSHIP = {
  OWNED: "owned",
  FINANCED: "financed",
  LEASED: "leased",
  FAMILY: "family",
  COMPANY: "company",
  TEMPORARY: "temporary"
};

/* ============================================================
   ESTADO
   ============================================================ */

const VEHICLE_STATUS = {
  ACTIVE: "active",
  STORED: "stored",
  DAMAGED: "damaged",
  MAINTENANCE: "maintenance",
  SOLD: "sold",
  SCRAPPED: "scrapped"
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

function generateId(prefix = "vehicle") {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

/* ============================================================
   LABELS
   ============================================================ */

function getVehicleTypeLabel(type) {
  const labels = {
    bicycle: "Bicicleta",
    motorcycle: "Motocicleta",
    scooter: "Scooter",
    compact_car: "Carro compacto",
    sedan: "Sedã",
    hatchback: "Hatch",
    suv: "SUV",
    pickup: "Picape",
    sports_car: "Carro esportivo",
    luxury_car: "Carro de luxo",
    supercar: "Supercarro",
    electric_car: "Carro elétrico",
    van: "Van",
    truck: "Caminhão"
  };

  return (
    labels[type] ||
    "Veículo"
  );
}

function getCategoryLabel(
  category
) {
  const labels = {
    personal: "Pessoal",
    family: "Familiar",
    sports: "Esportivo",
    luxury: "Luxo",
    work: "Trabalho",
    utility: "Utilitário"
  };

  return (
    labels[category] ||
    "Outro"
  );
}

function getFuelTypeLabel(
  fuel
) {
  const labels = {
    none: "Sem combustível",
    gasoline: "Gasolina",
    ethanol: "Etanol",
    flex: "Flex",
    diesel: "Diesel",
    hybrid: "Híbrido",
    electric: "Elétrico"
  };

  return (
    labels[fuel] ||
    "Desconhecido"
  );
}

function getOwnershipLabel(
  ownership
) {
  const labels = {
    owned: "Próprio",
    financed: "Financiado",
    leased: "Leasing",
    family: "Familiar",
    company: "Empresa",
    temporary: "Temporário"
  };

  return (
    labels[ownership] ||
    "Desconhecido"
  );
}

/* ============================================================
   CATÁLOGO PADRÃO
   ============================================================ */

const DEFAULT_VEHICLE_CATALOG = [
  {
    id: "basic_bicycle",
    type: VEHICLE_TYPES.BICYCLE,
    category: VEHICLE_CATEGORIES.PERSONAL,
    name: "Bicicleta básica",
    brand: "Genérica",
    fuelType: FUEL_TYPES.NONE,
    price: 1200,
    maintenance: 40,
    insurance: 0,
    fuelCost: 0,
    prestige: 5,
    comfort: 25,
    reliability: 70,
    performance: 30,
    familyCapacity: 1
  },

  {
    id: "basic_motorcycle",
    type: VEHICLE_TYPES.MOTORCYCLE,
    category: VEHICLE_CATEGORIES.PERSONAL,
    name: "Motocicleta básica",
    brand: "Genérica",
    fuelType: FUEL_TYPES.FLEX,
    price: 14000,
    maintenance: 180,
    insurance: 90,
    fuelCost: 180,
    prestige: 15,
    comfort: 45,
    reliability: 70,
    performance: 60,
    familyCapacity: 2
  },

  {
    id: "premium_motorcycle",
    type: VEHICLE_TYPES.MOTORCYCLE,
    category: VEHICLE_CATEGORIES.SPORTS,
    name: "Motocicleta premium",
    brand: "Genérica",
    fuelType: FUEL_TYPES.GASOLINE,
    price: 65000,
    maintenance: 450,
    insurance: 280,
    fuelCost: 350,
    prestige: 50,
    comfort: 55,
    reliability: 80,
    performance: 85,
    familyCapacity: 2
  },

  {
    id: "compact_car",
    type: VEHICLE_TYPES.COMPACT_CAR,
    category: VEHICLE_CATEGORIES.PERSONAL,
    name: "Carro compacto",
    brand: "Genérica",
    fuelType: FUEL_TYPES.FLEX,
    price: 75000,
    maintenance: 350,
    insurance: 180,
    fuelCost: 450,
    prestige: 20,
    comfort: 55,
    reliability: 75,
    performance: 50,
    familyCapacity: 5
  },

  {
    id: "sedan",
    type: VEHICLE_TYPES.SEDAN,
    category: VEHICLE_CATEGORIES.PERSONAL,
    name: "Sedã",
    brand: "Genérica",
    fuelType: FUEL_TYPES.FLEX,
    price: 130000,
    maintenance: 500,
    insurance: 300,
    fuelCost: 600,
    prestige: 35,
    comfort: 75,
    reliability: 80,
    performance: 60,
    familyCapacity: 5
  },

  {
    id: "family_suv",
    type: VEHICLE_TYPES.SUV,
    category: VEHICLE_CATEGORIES.FAMILY,
    name: "SUV familiar",
    brand: "Genérica",
    fuelType: FUEL_TYPES.FLEX,
    price: 220000,
    maintenance: 750,
    insurance: 450,
    fuelCost: 800,
    prestige: 50,
    comfort: 82,
    reliability: 82,
    performance: 70,
    familyCapacity: 7
  },

  {
    id: "pickup",
    type: VEHICLE_TYPES.PICKUP,
    category: VEHICLE_CATEGORIES.UTILITY,
    name: "Picape",
    brand: "Genérica",
    fuelType: FUEL_TYPES.DIESEL,
    price: 280000,
    maintenance: 900,
    insurance: 500,
    fuelCost: 900,
    prestige: 55,
    comfort: 70,
    reliability: 88,
    performance: 78,
    familyCapacity: 5
  },

  {
    id: "electric_car",
    type: VEHICLE_TYPES.ELECTRIC_CAR,
    category: VEHICLE_CATEGORIES.PERSONAL,
    name: "Carro elétrico",
    brand: "Genérica",
    fuelType: FUEL_TYPES.ELECTRIC,
    price: 300000,
    maintenance: 400,
    insurance: 550,
    fuelCost: 180,
    prestige: 65,
    comfort: 85,
    reliability: 88,
    performance: 75,
    familyCapacity: 5
  },

  {
    id: "sports_car",
    type: VEHICLE_TYPES.SPORTS_CAR,
    category: VEHICLE_CATEGORIES.SPORTS,
    name: "Carro esportivo",
    brand: "Genérica",
    fuelType: FUEL_TYPES.GASOLINE,
    price: 600000,
    maintenance: 1800,
    insurance: 1500,
    fuelCost: 1400,
    prestige: 85,
    comfort: 75,
    reliability: 78,
    performance: 95,
    familyCapacity: 2
  },

  {
    id: "luxury_suv",
    type: VEHICLE_TYPES.LUXURY_CAR,
    category: VEHICLE_CATEGORIES.LUXURY,
    name: "SUV de luxo",
    brand: "Genérica",
    fuelType: FUEL_TYPES.GASOLINE,
    price: 900000,
    maintenance: 2400,
    insurance: 1800,
    fuelCost: 1600,
    prestige: 92,
    comfort: 95,
    reliability: 90,
    performance: 85,
    familyCapacity: 7
  },

  {
    id: "supercar",
    type: VEHICLE_TYPES.SUPERCAR,
    category: VEHICLE_CATEGORIES.LUXURY,
    name: "Supercarro",
    brand: "Genérica",
    fuelType: FUEL_TYPES.GASOLINE,
    price: 3500000,
    maintenance: 7000,
    insurance: 6000,
    fuelCost: 3000,
    prestige: 100,
    comfort: 85,
    reliability: 75,
    performance: 100,
    familyCapacity: 2
  },

  {
    id: "van",
    type: VEHICLE_TYPES.VAN,
    category: VEHICLE_CATEGORIES.FAMILY,
    name: "Van familiar",
    brand: "Genérica",
    fuelType: FUEL_TYPES.DIESEL,
    price: 350000,
    maintenance: 1200,
    insurance: 600,
    fuelCost: 1100,
    prestige: 40,
    comfort: 80,
    reliability: 85,
    performance: 55,
    familyCapacity: 12
  }
];

/* ============================================================
   TIPOS DE VEÍCULO
   ============================================================ */

function createVehicleType(
  data = {}
) {
  return {
    id:
      normalizeId(data.id) ||
      generateId("vehicle_type"),

    type:
      data.type ||
      VEHICLE_TYPES.SEDAN,

    category:
      data.category ||
      VEHICLE_CATEGORIES.PERSONAL,

    name:
      data.name ||
      "Veículo",

    brand:
      data.brand ||
      "Genérica",

    fuelType:
      data.fuelType ||
      FUEL_TYPES.FLEX,

    price:
      Math.max(
        0,
        Number(
          data.price ?? 0
        )
      ),

    maintenance:
      Math.max(
        0,
        Number(
          data.maintenance ?? 0
        )
      ),

    insurance:
      Math.max(
        0,
        Number(
          data.insurance ?? 0
        )
      ),

    fuelCost:
      Math.max(
        0,
        Number(
          data.fuelCost ?? 0
        )
      ),

    prestige:
      clamp(
        Number(
          data.prestige ?? 0
        ),
        0,
        100
      ),

    comfort:
      clamp(
        Number(
          data.comfort ?? 50
        ),
        0,
        100
      ),

    reliability:
      clamp(
        Number(
          data.reliability ?? 70
        ),
        0,
        100
      ),

    performance:
      clamp(
        Number(
          data.performance ?? 50
        ),
        0,
        100
      ),

    familyCapacity:
      Math.max(
        1,
        Number(
          data.familyCapacity ?? 2
        )
      )
  };
}

function getVehicleType(
  vehicleTypeId
) {
  const id =
    normalizeId(
      vehicleTypeId
    );

  const vehicle =
    DEFAULT_VEHICLE_CATALOG.find(
      item =>
        normalizeId(item.id) === id
    );

  return vehicle
    ? clone(vehicle)
    : null;
}

function getAllVehicleTypes() {
  return DEFAULT_VEHICLE_CATALOG.map(
    clone
  );
}

function getVehicleTypesByCategory(
  category
) {
  return DEFAULT_VEHICLE_CATALOG
    .filter(
      vehicle =>
        vehicle.category ===
        category
    )
    .map(clone);
}

function getVehicleTypesByPriceRange(
  minPrice = 0,
  maxPrice = Infinity
) {
  return DEFAULT_VEHICLE_CATALOG
    .filter(
      vehicle =>
        vehicle.price >=
          Number(minPrice) &&
        vehicle.price <=
          Number(maxPrice)
    )
    .map(clone);
}

/* ============================================================
   CRIAÇÃO DO VEÍCULO
   ============================================================ */

function createVehicle(
  data = {}
) {
  const catalog =
    data.vehicleTypeId
      ? getVehicleType(
          data.vehicleTypeId
        )
      : null;

  const purchasePrice =
    Math.max(
      0,
      Number(
        data.purchasePrice ??
          catalog?.price ??
          0
      )
    );

  return {
    id:
      normalizeId(data.id) ||
      generateId("vehicle"),

    vehicleTypeId:
      data.vehicleTypeId ||
      catalog?.id ||
      null,

    type:
      data.type ||
      catalog?.type ||
      VEHICLE_TYPES.SEDAN,

    category:
      data.category ||
      catalog?.category ||
      VEHICLE_CATEGORIES.PERSONAL,

    name:
      data.name ||
      catalog?.name ||
      "Veículo",

    brand:
      data.brand ||
      catalog?.brand ||
      "Genérica",

    model:
      data.model ||
      null,

    year:
      Number(
        data.year ??
          new Date().getFullYear()
      ),

    fuelType:
      data.fuelType ||
      catalog?.fuelType ||
      FUEL_TYPES.FLEX,

    ownership:
      data.ownership ||
      VEHICLE_OWNERSHIP.OWNED,

    status:
      data.status ||
      VEHICLE_STATUS.ACTIVE,

    purchasePrice,

    marketValue:
      Math.max(
        0,
        Number(
          data.marketValue ??
            purchasePrice
        )
      ),

    mileage:
      Math.max(
        0,
        Number(
          data.mileage ?? 0
        )
      ),

    maintenanceLevel:
      clamp(
        Number(
          data.maintenanceLevel ??
            100
        ),
        0,
        100
      ),

    condition:
      clamp(
        Number(
          data.condition ?? 100
        ),
        0,
        100
      ),

    comfort:
      clamp(
        Number(
          data.comfort ??
            catalog?.comfort ??
            50
        ),
        0,
        100
      ),

    reliability:
      clamp(
        Number(
          data.reliability ??
            catalog?.reliability ??
            70
        ),
        0,
        100
      ),

    performance:
      clamp(
        Number(
          data.performance ??
            catalog?.performance ??
            50
        ),
        0,
        100
      ),

    prestige:
      clamp(
        Number(
          data.prestige ??
            catalog?.prestige ??
            20
        ),
        0,
        100
      ),

    familyCapacity:
      Math.max(
        1,
        Number(
          data.familyCapacity ??
            catalog?.familyCapacity ??
            2
        )
      ),

    insuranceMonthly:
      Math.max(
        0,
        Number(
          data.insuranceMonthly ??
            catalog?.insurance ??
            0
        )
      ),

    maintenanceMonthly:
      Math.max(
        0,
        Number(
          data.maintenanceMonthly ??
            catalog?.maintenance ??
            0
        )
      ),

    fuelMonthly:
      Math.max(
        0,
        Number(
          data.fuelMonthly ??
            catalog?.fuelCost ??
            0
        )
      ),

    financing:
      data.financing
        ? clone(data.financing)
        : null,

    accessories:
      Array.isArray(
        data.accessories
      )
        ? [...data.accessories]
        : [],

    location:
      data.location || null,

    primaryDriverId:
      normalizeId(
        data.primaryDriverId
      ),

    purchaseDate:
      data.purchaseDate ||
      null,

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

function ensureVehicleState(
  database
) {
  if (!database) {
    return null;
  }

  if (!database.life) {
    database.life = {};
  }

  if (!database.life.vehicles) {
    database.life.vehicles = {};
  }

  const state =
    database.life.vehicles;

  if (!state.profiles) {
    state.profiles = {};
  }

  if (!Array.isArray(state.vehicles)) {
    state.vehicles = [];
  }

  if (!Array.isArray(state.garages)) {
    state.garages = [];
  }

  if (!Array.isArray(state.history)) {
    state.history = [];
  }

  return state;
}

/* ============================================================
   PERFIL
   ============================================================ */

function createVehicleProfile(
  data = {}
) {
  return {
    entityId:
      normalizeId(
        data.entityId
      ),

    vehicles: Array.isArray(
      data.vehicles
    )
      ? data.vehicles.map(
          clone
        )
      : [],

    garageCapacity:
      Math.max(
        0,
        Number(
          data.garageCapacity ??
            1
        )
      ),

    totalVehicleValue:
      Math.max(
        0,
        Number(
          data.totalVehicleValue ??
            0
        )
      ),

    monthlyVehicleCost:
      Math.max(
        0,
        Number(
          data.monthlyVehicleCost ??
            0
        )
      ),

    history:
      Array.isArray(
        data.history
      )
        ? data.history.map(
            clone
          )
        : [],

    updatedAt:
      new Date().toISOString()
  };
}

function addVehicleProfile(
  database,
  entityId,
  data = {}
) {
  const state =
    ensureVehicleState(
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
    createVehicleProfile({
      ...data,
      entityId: id
    });

  state.profiles[id] =
    profile;

  return clone(profile);
}

function getVehicleProfile(
  database,
  entityId
) {
  const state =
    ensureVehicleState(
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

function findVehicleProfileReference(
  database,
  entityId
) {
  const state =
    ensureVehicleState(
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

function updateVehicleProfile(
  database,
  entityId,
  updates = {}
) {
  const profile =
    findVehicleProfileReference(
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

  profile.updatedAt =
    new Date().toISOString();

  return clone(profile);
}

/* ============================================================
   VEÍCULOS DO JOGADOR
   ============================================================ */

function getVehicles(
  database,
  entityId
) {
  const profile =
    findVehicleProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return [];
  }

  return profile.vehicles.map(
    clone
  );
}

function getActiveVehicles(
  database,
  entityId
) {
  return getVehicles(
    database,
    entityId
  ).filter(
    vehicle =>
      vehicle.status ===
      VEHICLE_STATUS.ACTIVE
  );
}

function getVehicle(
  database,
  entityId,
  vehicleId
) {
  const profile =
    findVehicleProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  const id =
    normalizeId(vehicleId);

  const vehicle =
    profile.vehicles.find(
      item =>
        normalizeId(item.id) ===
        id
    );

  return vehicle
    ? clone(vehicle)
    : null;
}

function findVehicleReference(
  database,
  entityId,
  vehicleId
) {
  const profile =
    findVehicleProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  const id =
    normalizeId(vehicleId);

  return (
    profile.vehicles.find(
      item =>
        normalizeId(item.id) ===
        id
    ) || null
  );
}

/* ============================================================
   GARAGEM
   ============================================================ */

function canStoreVehicle(
  database,
  entityId
) {
  const profile =
    findVehicleProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return false;
  }

  return (
    getActiveVehicles(
      database,
      entityId
    ).length <
    profile.garageCapacity
  );
}

function setGarageCapacity(
  database,
  entityId,
  capacity
) {
  const profile =
    findVehicleProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  profile.garageCapacity =
    Math.max(
      0,
      Number(capacity) || 0
    );

  return clone(profile);
}

function upgradeGarage(
  database,
  entityId,
  additionalSlots
) {
  const profile =
    findVehicleProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  profile.garageCapacity +=
    Math.max(
      0,
      Number(
        additionalSlots
      ) || 0
    );

  return clone(profile);
}

/* ============================================================
   COMPRA À VISTA
   ============================================================ */

function buyVehicle(
  database,
  entityId,
  vehicleTypeId,
  options = {}
) {
  const profile =
    findVehicleProfileReference(
      database,
      entityId
    );

  const type =
    getVehicleType(
      vehicleTypeId
    );

  if (
    !profile ||
    !type
  ) {
    return null;
  }

  if (
    !canStoreVehicle(
      database,
      entityId
    )
  ) {
    return null;
  }

  const vehicle =
    createVehicle({
      ...options,

      vehicleTypeId:
        type.id,

      type:
        type.type,

      category:
        type.category,

      name:
        type.name,

      brand:
        options.brand ||
        type.brand,

      fuelType:
        options.fuelType ||
        type.fuelType,

      ownership:
        VEHICLE_OWNERSHIP.OWNED,

      purchasePrice:
        options.purchasePrice ??
        type.price,

      marketValue:
        options.marketValue ??
        type.price,

      insuranceMonthly:
        options.insuranceMonthly ??
        type.insurance,

      maintenanceMonthly:
        options.maintenanceMonthly ??
        type.maintenance,

      fuelMonthly:
        options.fuelMonthly ??
        type.fuelCost,

      prestige:
        options.prestige ??
        type.prestige,

      comfort:
        options.comfort ??
        type.comfort,

      reliability:
        options.reliability ??
        type.reliability,

      performance:
        options.performance ??
        type.performance,

      familyCapacity:
        options.familyCapacity ??
        type.familyCapacity
    });

  profile.vehicles.push(
    vehicle
  );

  profile.totalVehicleValue +=
    vehicle.marketValue;

  addVehicleHistory(
    profile,
    "purchase",
    `Comprou ${vehicle.name}.`,
    {
      vehicleId:
        vehicle.id,

      price:
        vehicle.purchasePrice,

      ownership:
        vehicle.ownership
    }
  );

  recalculateProfileTotals(
    profile
  );

  return clone(vehicle);
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

function buyVehicleFinanced(
  database,
  entityId,
  vehicleTypeId,
  options = {}
) {
  const profile =
    findVehicleProfileReference(
      database,
      entityId
    );

  const type =
    getVehicleType(
      vehicleTypeId
    );

  if (
    !profile ||
    !type
  ) {
    return null;
  }

  if (
    !canStoreVehicle(
      database,
      entityId
    )
  ) {
    return null;
  }

  const price =
    Math.max(
      0,
      Number(
        options.purchasePrice ??
          type.price
      )
    );

  const downPayment =
    Math.max(
      0,
      Number(
        options.downPayment ??
          price * 0.2
      )
    );

  if (
    downPayment >
    price
  ) {
    return null;
  }

  const principal =
    Math.max(
      0,
      price -
        downPayment
    );

  const months =
    Math.max(
      6,
      Number(
        options.termMonths ??
          60
      )
    );

  const interestRate =
    Math.max(
      0,
      Number(
        options.interestRate ??
          0.012
      )
    );

  const monthlyPayment =
    calculateLoanPayment(
      principal,
      interestRate,
      months
    );

  const vehicle =
    createVehicle({
      ...options,

      vehicleTypeId:
        type.id,

      type:
        type.type,

      category:
        type.category,

      name:
        type.name,

      brand:
        options.brand ||
        type.brand,

      fuelType:
        options.fuelType ||
        type.fuelType,

      ownership:
        VEHICLE_OWNERSHIP.FINANCED,

      purchasePrice:
        price,

      marketValue:
        price,

      insuranceMonthly:
        options.insuranceMonthly ??
        type.insurance,

      maintenanceMonthly:
        options.maintenanceMonthly ??
        type.maintenance,

      fuelMonthly:
        options.fuelMonthly ??
        type.fuelCost,

      financing: {
        principal,
        downPayment,
        interestRate,
        termMonths: months,
        remainingMonths:
          months,
        monthlyPayment,
        remainingBalance:
          principal
      }
    });

  profile.vehicles.push(
    vehicle
  );

  addVehicleHistory(
    profile,
    "financed_purchase",
    `Comprou ${vehicle.name} financiado.`,
    {
      vehicleId:
        vehicle.id,

      price,

      downPayment,

      monthlyPayment,

      termMonths:
        months
    }
  );

  recalculateProfileTotals(
    profile
  );

  return clone(vehicle);
}

/* ============================================================
   FINANCIAMENTO MENSAL
   ============================================================ */

function processVehicleFinancingMonth(
  vehicle
) {
  if (
    !vehicle ||
    !vehicle.financing
  ) {
    return null;
  }

  const financing =
    vehicle.financing;

  if (
    financing.remainingMonths <=
      0 ||
    financing.remainingBalance <=
      0
  ) {
    vehicle.ownership =
      VEHICLE_OWNERSHIP.OWNED;

    vehicle.financing =
      null;

    return vehicle;
  }

  const payment =
    Number(
      financing.monthlyPayment
    ) || 0;

  const interest =
    Number(
      financing.interestRate
    ) || 0;

  const interestAmount =
    financing.remainingBalance *
    interest;

  const principalPaid =
    Math.max(
      0,
      payment -
        interestAmount
    );

  financing.remainingBalance =
    Math.max(
      0,
      financing.remainingBalance -
        principalPaid
    );

  financing.remainingMonths =
    Math.max(
      0,
      financing.remainingMonths -
        1
    );

  if (
    financing.remainingMonths <=
      0 ||
    financing.remainingBalance <=
      1
  ) {
    financing.remainingMonths =
      0;

    financing.remainingBalance =
      0;

    vehicle.ownership =
      VEHICLE_OWNERSHIP.OWNED;

    vehicle.financing =
      null;
  }

  return vehicle;
}

/* ============================================================
   CUSTO MENSAL
   ============================================================ */

function calculateVehicleMonthlyCost(
  vehicle
) {
  if (!vehicle) {
    return 0;
  }

  let total = 0;

  total +=
    Number(
      vehicle.insuranceMonthly
    ) || 0;

  total +=
    Number(
      vehicle.maintenanceMonthly
    ) || 0;

  total +=
    Number(
      vehicle.fuelMonthly
    ) || 0;

  if (
    vehicle.financing
      ?.monthlyPayment
  ) {
    total +=
      Number(
        vehicle.financing
          .monthlyPayment
      ) || 0;
  }

  return Math.max(
    0,
    Math.round(total)
  );
}

function recalculateProfileTotals(
  profile
) {
  if (!profile) {
    return null;
  }

  const activeVehicles =
    profile.vehicles.filter(
      vehicle =>
        vehicle.status !==
        VEHICLE_STATUS.SOLD
    );

  profile.totalVehicleValue =
    activeVehicles.reduce(
      (sum, vehicle) =>
        sum +
        Number(
          vehicle.marketValue
        ),
      0
    );

  profile.monthlyVehicleCost =
    activeVehicles.reduce(
      (sum, vehicle) =>
        sum +
        calculateVehicleMonthlyCost(
          vehicle
        ),
      0
    );

  profile.updatedAt =
    new Date().toISOString();

  return profile;
}

/* ============================================================
   MANUTENÇÃO
   ============================================================ */

function performMaintenance(
  database,
  entityId,
  vehicleId,
  amount = 100
) {
  const vehicle =
    findVehicleReference(
      database,
      entityId,
      vehicleId
    );

  if (!vehicle) {
    return null;
  }

  const investment =
    Math.max(
      0,
      Number(amount) || 0
    );

  const improvement =
    clamp(
      investment / 100,
      1,
      30
    );

  vehicle.maintenanceLevel =
    clamp(
      vehicle.maintenanceLevel +
        improvement,
      0,
      100
    );

  vehicle.condition =
    clamp(
      vehicle.condition +
        improvement,
      0,
      100
    );

  vehicle.status =
    VEHICLE_STATUS.ACTIVE;

  addVehicleHistory(
    findVehicleProfileReference(
      database,
      entityId
    ),
    "maintenance",
    `Realizou manutenção em ${vehicle.name}.`,
    {
      vehicleId:
        vehicle.id,

      cost:
        investment
    }
  );

  return clone(vehicle);
}

/* ============================================================
   DANO / RECUPERAÇÃO
   ============================================================ */

function damageVehicle(
  database,
  entityId,
  vehicleId,
  damage = 20
) {
  const vehicle =
    findVehicleReference(
      database,
      entityId,
      vehicleId
    );

  if (!vehicle) {
    return null;
  }

  const value =
    clamp(
      Number(damage) || 0,
      0,
      100
    );

  vehicle.condition =
    clamp(
      vehicle.condition -
        value,
      0,
      100
    );

  vehicle.maintenanceLevel =
    clamp(
      vehicle.maintenanceLevel -
        value * 0.75,
      0,
      100
    );

  if (
    vehicle.condition <= 20
  ) {
    vehicle.status =
      VEHICLE_STATUS.DAMAGED;
  }

  return clone(vehicle);
}

function repairVehicle(
  database,
  entityId,
  vehicleId
) {
  const vehicle =
    findVehicleReference(
      database,
      entityId,
      vehicleId
    );

  if (!vehicle) {
    return null;
  }

  vehicle.condition =
    100;

  vehicle.maintenanceLevel =
    100;

  vehicle.status =
    VEHICLE_STATUS.ACTIVE;

  return clone(vehicle);
}

/* ============================================================
   QUILOMETRAGEM
   ============================================================ */

function addMileage(
  database,
  entityId,
  vehicleId,
  kilometers
) {
  const vehicle =
    findVehicleReference(
      database,
      entityId,
      vehicleId
    );

  if (!vehicle) {
    return null;
  }

  const km =
    Math.max(
      0,
      Number(kilometers) || 0
    );

  vehicle.mileage +=
    km;

  const wear =
    km / 10000;

  vehicle.condition =
    clamp(
      vehicle.condition -
        wear,
      0,
      100
    );

  vehicle.maintenanceLevel =
    clamp(
      vehicle.maintenanceLevel -
        wear * 1.2,
      0,
      100
    );

  return clone(vehicle);
}

/* ============================================================
   VALORIZAÇÃO / DEPRECIAÇÃO
   ============================================================ */

function calculateVehicleDepreciation(
  vehicle,
  annualRate = 0.10
) {
  if (!vehicle) {
    return 0;
  }

  const rate =
    clamp(
      Number(
        annualRate
      ) || 0,
      0,
      0.80
    );

  const oldValue =
    Number(
      vehicle.marketValue
    ) || 0;

  const conditionFactor =
    clamp(
      vehicle.condition /
        100,
      0.25,
      1
    );

  const adjustedRate =
    rate *
    (
      1.2 -
      conditionFactor *
      0.2
    );

  const depreciation =
    oldValue *
    adjustedRate;

  vehicle.marketValue =
    Math.max(
      0,
      Math.round(
        oldValue -
          depreciation
      )
    );

  return Math.round(
    depreciation
  );
}

function processVehicleYear(
  database,
  entityId
) {
  const profile =
    findVehicleProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  profile.vehicles.forEach(
    vehicle => {
      if (
        vehicle.status !==
        VEHICLE_STATUS.SOLD
      ) {
        calculateVehicleDepreciation(
          vehicle
        );

        vehicle.condition =
          clamp(
            vehicle.condition -
              randomFloat(
                1,
                5
              ),
            0,
            100
          );

        vehicle.updatedAt =
          new Date().toISOString();
      }
    }
  );

  recalculateProfileTotals(
    profile
  );

  addVehicleHistory(
    profile,
    "yearly_update",
    "Veículos atualizados pela depreciação anual."
  );

  return clone(profile);
}

/* ============================================================
   VENDA
   ============================================================ */

function sellVehicle(
  database,
  entityId,
  vehicleId,
  salePrice = null
) {
  const profile =
    findVehicleProfileReference(
      database,
      entityId
    );

  const vehicle =
    findVehicleReference(
      database,
      entityId,
      vehicleId
    );

  if (
    !profile ||
    !vehicle
  ) {
    return null;
  }

  if (
    vehicle.status ===
    VEHICLE_STATUS.SOLD
  ) {
    return null;
  }

  const price =
    Math.max(
      0,
      Number(
        salePrice ??
          vehicle.marketValue
      )
    );

  const remainingDebt =
    Number(
      vehicle.financing
        ?.remainingBalance
    ) || 0;

  const netValue =
    Math.max(
      0,
      price -
        remainingDebt
    );

  const sale = {
    vehicleId:
      vehicle.id,

    name:
      vehicle.name,

    salePrice:
      price,

    remainingDebt,

    netValue,

    date:
      new Date().toISOString()
  };

  vehicle.status =
    VEHICLE_STATUS.SOLD;

  vehicle.updatedAt =
    new Date().toISOString();

  addVehicleHistory(
    profile,
    "sale",
    `Vendeu ${vehicle.name}.`,
    sale
  );

  recalculateProfileTotals(
    profile
  );

  return clone(sale);
}

/* ============================================================
   USO FAMILIAR
   ============================================================ */

function assignDriver(
  database,
  entityId,
  vehicleId,
  driverId
) {
  const vehicle =
    findVehicleReference(
      database,
      entityId,
      vehicleId
    );

  if (!vehicle) {
    return null;
  }

  vehicle.primaryDriverId =
    normalizeId(
      driverId
    );

  return clone(vehicle);
}

function isFamilyVehicle(
  vehicle
) {
  if (!vehicle) {
    return false;
  }

  return (
    vehicle.category ===
      VEHICLE_CATEGORIES.FAMILY ||
    vehicle.familyCapacity >= 5
  );
}

/* ============================================================
   PRESTÍGIO
   ============================================================ */

function calculateVehiclePrestige(
  vehicle
) {
  if (!vehicle) {
    return 0;
  }

  const condition =
    vehicle.condition / 100;

  const prestige =
    vehicle.prestige *
    condition;

  return clamp(
    Math.round(prestige),
    0,
    100
  );
}

function calculateVehicleComfort(
  vehicle
) {
  if (!vehicle) {
    return 0;
  }

  return clamp(
    Math.round(
      (
        vehicle.comfort *
          0.7 +
        vehicle.condition *
          0.3
      )
    ),
    0,
    100
  );
}

/* ============================================================
   HISTÓRICO
   ============================================================ */

function addVehicleHistory(
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
        "vehicle_history"
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

function getVehicleHistory(
  database,
  entityId
) {
  const profile =
    getVehicleProfile(
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

function processVehicleMonth(
  database,
  entityId
) {
  const profile =
    findVehicleProfileReference(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  profile.vehicles.forEach(
    vehicle => {
      if (
        vehicle.status ===
        VEHICLE_STATUS.SOLD
      ) {
        return;
      }

      if (
        vehicle.financing
      ) {
        processVehicleFinancingMonth(
          vehicle
        );
      }

      const wear =
        randomFloat(
          0.1,
          0.8
        );

      vehicle.condition =
        clamp(
          vehicle.condition -
            wear,
          0,
          100
        );

      vehicle.maintenanceLevel =
        clamp(
          vehicle.maintenanceLevel -
            wear,
          0,
          100
        );

      if (
        vehicle.condition <= 10
      ) {
        vehicle.status =
          VEHICLE_STATUS.DAMAGED;
      }
    }
  );

  recalculateProfileTotals(
    profile
  );

  return clone(profile);
}

/* ============================================================
   RECOMENDAÇÃO
   ============================================================ */

function getRecommendedVehicle(
  availableMoney = 0,
  familySize = 1,
  category = null
) {
  const money =
    Math.max(
      0,
      Number(
        availableMoney
      ) || 0
    );

  const family =
    Math.max(
      1,
      Number(
        familySize
      ) || 1
    );

  let candidates =
    getAllVehicleTypes();

  if (category) {
    candidates =
      candidates.filter(
        vehicle =>
          vehicle.category ===
          category
      );
  }

  candidates =
    candidates.filter(
      vehicle =>
        vehicle.price <=
          money &&
        vehicle.familyCapacity >=
          family
    );

  if (
    candidates.length === 0
  ) {
    return null;
  }

  candidates.sort(
    (a, b) =>
      b.price -
      a.price
  );

  return clone(
    candidates[0]
  );
}

/* ============================================================
   ESTATÍSTICAS
   ============================================================ */

function calculateVehicleStats(
  database,
  entityId
) {
  const profile =
    getVehicleProfile(
      database,
      entityId
    );

  if (!profile) {
    return null;
  }

  const active =
    profile.vehicles.filter(
      vehicle =>
        vehicle.status !==
        VEHICLE_STATUS.SOLD
    );

  const totalValue =
    active.reduce(
      (sum, vehicle) =>
        sum +
        Number(
          vehicle.marketValue
        ),
      0
    );

  const monthlyCost =
    active.reduce(
      (sum, vehicle) =>
        sum +
        calculateVehicleMonthlyCost(
          vehicle
        ),
      0
    );

  const prestige =
    active.length > 0
      ? Math.round(
          active.reduce(
            (sum, vehicle) =>
              sum +
              calculateVehiclePrestige(
                vehicle
              ),
            0
          ) /
            active.length
        )
      : 0;

  return {
    totalVehicles:
      active.length,

    garageCapacity:
      profile.garageCapacity,

    availableGarageSlots:
      Math.max(
        0,
        profile.garageCapacity -
          active.length
      ),

    totalVehicleValue:
      Math.round(
        totalValue
      ),

    monthlyVehicleCost:
      Math.round(
        monthlyCost
      ),

    averagePrestige:
      prestige,

    familyVehicles:
      active.filter(
        isFamilyVehicle
      ).length,

    luxuryVehicles:
      active.filter(
        vehicle =>
          vehicle.category ===
          VEHICLE_CATEGORIES.LUXURY
      ).length,

    sportsVehicles:
      active.filter(
        vehicle =>
          vehicle.category ===
          VEHICLE_CATEGORIES.SPORTS
      ).length,

    financedVehicles:
      active.filter(
        vehicle =>
          vehicle.ownership ===
          VEHICLE_OWNERSHIP.FINANCED
      ).length
  };
}

/* ============================================================
   SNAPSHOT
   ============================================================ */

function getVehiclesSnapshot(
  database
) {
  const state =
    ensureVehicleState(
      database
    );

  if (!state) {
    return null;
  }

  const profiles =
    Object.values(
      state.profiles
    );

  const allVehicles =
    profiles.flatMap(
      profile =>
        profile.vehicles
    );

  const activeVehicles =
    allVehicles.filter(
      vehicle =>
        vehicle.status !==
        VEHICLE_STATUS.SOLD
    );

  return {
    version:
      VEHICLES_VERSION,

    profiles:
      profiles.length,

    totalVehicles:
      activeVehicles.length,

    totalValue:
      Math.round(
        activeVehicles.reduce(
          (sum, vehicle) =>
            sum +
            Number(
              vehicle.marketValue
            ),
          0
        )
      ),

    totalMonthlyCost:
      Math.round(
        activeVehicles.reduce(
          (sum, vehicle) =>
            sum +
            calculateVehicleMonthlyCost(
              vehicle
            ),
          0
        )
      ),

    financedVehicles:
      activeVehicles.filter(
        vehicle =>
          vehicle.ownership ===
          VEHICLE_OWNERSHIP.FINANCED
      ).length,

    catalog:
      getAllVehicleTypes()
  };
}

/* ============================================================
   VALIDAÇÃO
   ============================================================ */

function validateVehicle(
  vehicle
) {
  const errors = [];

  if (!vehicle) {
    return {
      valid: false,
      errors: [
        "Veículo inexistente."
      ]
    };
  }

  if (!vehicle.id) {
    errors.push(
      "ID do veículo ausente."
    );
  }

  if (
    !Object.values(
      VEHICLE_TYPES
    ).includes(
      vehicle.type
    )
  ) {
    errors.push(
      "Tipo de veículo inválido."
    );
  }

  if (
    !Object.values(
      VEHICLE_OWNERSHIP
    ).includes(
      vehicle.ownership
    )
  ) {
    errors.push(
      "Tipo de propriedade inválido."
    );
  }

  if (
    !Object.values(
      VEHICLE_STATUS
    ).includes(
      vehicle.status
    )
  ) {
    errors.push(
      "Status do veículo inválido."
    );
  }

  if (
    !Number.isFinite(
      Number(
        vehicle.marketValue
      )
    )
  ) {
    errors.push(
      "Valor de mercado inválido."
    );
  }

  if (
    !Number.isFinite(
      Number(
        vehicle.condition
      )
    )
  ) {
    errors.push(
      "Condição do veículo inválida."
    );
  }

  return {
    valid:
      errors.length === 0,

    errors
  };
}

function validateVehicleState(
  database
) {
  const state =
    ensureVehicleState(
      database
    );

  if (!state) {
    return {
      valid: false,
      total: 0,
      results: []
    };
  }

  const results = [];

  Object.entries(
    state.profiles
  ).forEach(
    ([entityId, profile]) => {
      profile.vehicles.forEach(
        vehicle => {
          results.push({
            entityId,
            vehicleId:
              vehicle.id,
            ...validateVehicle(
              vehicle
            )
          });
        }
      );
    }
  );

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

function initializeVehicles(
  database,
  entityId = null,
  data = {}
) {
  const state =
    ensureVehicleState(
      database
    );

  if (!state) {
    return null;
  }

  if (entityId) {
    const existing =
      getVehicleProfile(
        database,
        entityId
      );

    if (!existing) {
      addVehicleProfile(
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

function resetVehicles(
  database
) {
  if (!database) {
    return null;
  }

  if (!database.life) {
    database.life = {};
  }

  database.life.vehicles = {
    profiles: {},
    vehicles: [],
    garages: [],
    history: []
  };

  return database.life.vehicles;
}

/* ============================================================
   API
   ============================================================ */

const vehiclesAPI = {
  VEHICLES_VERSION,

  VEHICLE_TYPES,
  VEHICLE_CATEGORIES,
  FUEL_TYPES,
  VEHICLE_OWNERSHIP,
  VEHICLE_STATUS,

  DEFAULT_VEHICLE_CATALOG,

  getVehicleTypeLabel,
  getCategoryLabel,
  getFuelTypeLabel,
  getOwnershipLabel,

  createVehicleType,
  getVehicleType,
  getAllVehicleTypes,
  getVehicleTypesByCategory,
  getVehicleTypesByPriceRange,

  createVehicle,

  ensureVehicleState,

  createVehicleProfile,
  addVehicleProfile,
  getVehicleProfile,
  findVehicleProfileReference,
  updateVehicleProfile,

  getVehicles,
  getActiveVehicles,
  getVehicle,
  findVehicleReference,

  canStoreVehicle,
  setGarageCapacity,
  upgradeGarage,

  buyVehicle,
  calculateLoanPayment,
  buyVehicleFinanced,
  processVehicleFinancingMonth,

  calculateVehicleMonthlyCost,
  recalculateProfileTotals,

  performMaintenance,
  damageVehicle,
  repairVehicle,

  addMileage,

  calculateVehicleDepreciation,
  processVehicleYear,

  sellVehicle,

  assignDriver,
  isFamilyVehicle,

  calculateVehiclePrestige,
  calculateVehicleComfort,

  addVehicleHistory,
  getVehicleHistory,

  processVehicleMonth,

  getRecommendedVehicle,

  calculateVehicleStats,
  getVehiclesSnapshot,

  validateVehicle,
  validateVehicleState,

  initializeVehicles,
  resetVehicles
};

export default vehiclesAPI;

export {
  VEHICLES_VERSION,

  VEHICLE_TYPES,
  VEHICLE_CATEGORIES,
  FUEL_TYPES,
  VEHICLE_OWNERSHIP,
  VEHICLE_STATUS,

  DEFAULT_VEHICLE_CATALOG,

  getVehicleTypeLabel,
  getCategoryLabel,
  getFuelTypeLabel,
  getOwnershipLabel,

  createVehicleType,
  getVehicleType,
  getAllVehicleTypes,
  getVehicleTypesByCategory,
  getVehicleTypesByPriceRange,

  createVehicle,

  ensureVehicleState,

  createVehicleProfile,
  addVehicleProfile,
  getVehicleProfile,
  findVehicleProfileReference,
  updateVehicleProfile,

  getVehicles,
  getActiveVehicles,
  getVehicle,
  findVehicleReference,

  canStoreVehicle,
  setGarageCapacity,
  upgradeGarage,

  buyVehicle,
  calculateLoanPayment,
  buyVehicleFinanced,
  processVehicleFinancingMonth,

  calculateVehicleMonthlyCost,
  recalculateProfileTotals,

  performMaintenance,
  damageVehicle,
  repairVehicle,

  addMileage,

  calculateVehicleDepreciation,
  processVehicleYear,

  sellVehicle,

  assignDriver,
  isFamilyVehicle,

  calculateVehiclePrestige,
  calculateVehicleComfort,

  addVehicleHistory,
  getVehicleHistory,

  processVehicleMonth,

  getRecommendedVehicle,

  calculateVehicleStats,
  getVehiclesSnapshot,

  validateVehicle,
  validateVehicleState,

  initializeVehicles,
  resetVehicles,

  vehiclesAPI
};
