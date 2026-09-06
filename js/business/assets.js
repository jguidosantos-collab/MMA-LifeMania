// ============================================================
// MMA LIFE DYNASTY
// js/business/assets.js
// Sistema central de patrimônio e ativos do jogador
// ============================================================

export const ASSETS_VERSION = 1;

// ============================================================
// TIPOS DE ATIVOS
// ============================================================

export const ASSET_TYPES = Object.freeze({
  CASH: "cash",
  BANK_ACCOUNT: "bank_account",
  INVESTMENT: "investment",
  STOCK: "stock",
  FUND: "fund",
  CRYPTO: "crypto",
  REAL_ESTATE: "real_estate",
  HOUSE: "house",
  APARTMENT: "apartment",
  LAND: "land",
  COMMERCIAL_PROPERTY: "commercial_property",
  VEHICLE: "vehicle",
  MOTORCYCLE: "motorcycle",
  BOAT: "boat",
  AIRCRAFT: "aircraft",
  EQUIPMENT: "equipment",
  BUSINESS: "business",
  GYM: "gym",
  PROMOTION: "promotion",
  BRAND: "brand",
  MERCHANDISE: "merchandise",
  JEWELRY: "jewelry",
  COLLECTIBLE: "collectible",
  OTHER: "other"
});

// ============================================================
// STATUS
// ============================================================

export const ASSET_STATUS = Object.freeze({
  ACTIVE: "active",
  SOLD: "sold",
  LOST: "lost",
  TRANSFERRED: "transferred",
  INHERITED: "inherited"
});

// ============================================================
// CONFIGURAÇÃO
// ============================================================

export const ASSET_CONFIG = Object.freeze({
  minimumValue: 0,

  maximumValue: 1000000000000,

  defaultCurrency: "USD",

  historyLimit: 1000,

  appreciation: {
    realEstate: 0.03,
    vehicle: -0.08,
    investment: 0.06,
    business: 0.05,
    equipment: -0.12,
    collectible: 0.04,
    default: 0
  }
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

function randomId(prefix = "asset") {
  return (
    `${prefix}_` +
    `${Date.now()}_` +
    `${Math.floor(Math.random() * 1000000)}`
  );
}

// ============================================================
// CONFIGURAÇÃO DE APRECIAÇÃO
// ============================================================

export function getDefaultAppreciationRate(
  type
) {
  switch (type) {
    case ASSET_TYPES.REAL_ESTATE:
    case ASSET_TYPES.HOUSE:
    case ASSET_TYPES.APARTMENT:
    case ASSET_TYPES.LAND:
    case ASSET_TYPES.COMMERCIAL_PROPERTY:
      return ASSET_CONFIG.appreciation.realEstate;

    case ASSET_TYPES.VEHICLE:
    case ASSET_TYPES.MOTORCYCLE:
    case ASSET_TYPES.BOAT:
    case ASSET_TYPES.AIRCRAFT:
      return ASSET_CONFIG.appreciation.vehicle;

    case ASSET_TYPES.INVESTMENT:
    case ASSET_TYPES.STOCK:
    case ASSET_TYPES.FUND:
    case ASSET_TYPES.CRYPTO:
      return ASSET_CONFIG.appreciation.investment;

    case ASSET_TYPES.BUSINESS:
    case ASSET_TYPES.GYM:
    case ASSET_TYPES.PROMOTION:
    case ASSET_TYPES.BRAND:
      return ASSET_CONFIG.appreciation.business;

    case ASSET_TYPES.EQUIPMENT:
      return ASSET_CONFIG.appreciation.equipment;

    case ASSET_TYPES.COLLECTIBLE:
    case ASSET_TYPES.JEWELRY:
      return ASSET_CONFIG.appreciation.collectible;

    default:
      return ASSET_CONFIG.appreciation.default;
  }
}

// ============================================================
// NORMALIZAÇÃO
// ============================================================

function normalizeAsset(
  input = {}
) {
  const purchaseValue =
    clamp(
      number(
        input.purchaseValue ??
          input.cost ??
          input.value,
        0
      ),
      ASSET_CONFIG.minimumValue,
      ASSET_CONFIG.maximumValue
    );

  const currentValue =
    clamp(
      number(
        input.currentValue ??
          input.marketValue ??
          purchaseValue,
        purchaseValue
      ),
      ASSET_CONFIG.minimumValue,
      ASSET_CONFIG.maximumValue
    );

  const appreciationRate =
    number(
      input.appreciationRate,
      getDefaultAppreciationRate(
        input.type
      )
    );

  return {
    name:
      input.name ||
      "Unnamed Asset",

    type:
      input.type ||
      ASSET_TYPES.OTHER,

    status:
      input.status ||
      ASSET_STATUS.ACTIVE,

    description:
      input.description ||
      "",

    currency:
      input.currency ||
      ASSET_CONFIG.defaultCurrency,

    purchaseValue:
      Math.round(
        purchaseValue
      ),

    currentValue:
      Math.round(
        currentValue
      ),

    appreciationRate,

    purchaseDate:
      input.purchaseDate
        ? isoDate(
            input.purchaseDate
          )
        : null,

    location:
      clone(
        input.location
      ) || null,

    incomeGenerating:
      input.incomeGenerating === true,

    monthlyIncome:
      Math.max(
        0,
        number(
          input.monthlyIncome,
          0
        )
      ),

    monthlyExpense:
      Math.max(
        0,
        number(
          input.monthlyExpense,
          0
        )
      ),

    debt:
      Math.max(
        0,
        number(
          input.debt,
          0
        )
      ),

    ownerId:
      input.ownerId ||
      null,

    parentAssetId:
      input.parentAssetId ||
      null,

    acquiredThrough:
      input.acquiredThrough ||
      "purchase",

    metadata:
      clone(
        input.metadata
      ) || {}
  };
}

// ============================================================
// CRIAÇÃO
// ============================================================

export function createAsset(
  input = {}
) {
  const now =
    normalizeDate(
      input.date ||
      new Date()
    );

  const normalized =
    normalizeAsset(
      input
    );

  return {
    version:
      ASSETS_VERSION,

    id:
      input.id ||
      randomId(),

    createdAt:
      isoDate(now),

    updatedAt:
      isoDate(now),

    ...normalized
  };
}

// ============================================================
// ATIVOS ESPECÍFICOS
// ============================================================

export function createRealEstateAsset(
  options = {}
) {
  return createAsset({
    ...options,

    type:
      options.type ||
      ASSET_TYPES.REAL_ESTATE
  });
}

export function createHouseAsset(
  options = {}
) {
  return createAsset({
    ...options,

    type:
      ASSET_TYPES.HOUSE
  });
}

export function createApartmentAsset(
  options = {}
) {
  return createAsset({
    ...options,

    type:
      ASSET_TYPES.APARTMENT
  });
}

export function createLandAsset(
  options = {}
) {
  return createAsset({
    ...options,

    type:
      ASSET_TYPES.LAND
  });
}

export function createCommercialPropertyAsset(
  options = {}
) {
  return createAsset({
    ...options,

    type:
      ASSET_TYPES.COMMERCIAL_PROPERTY
  });
}

export function createVehicleAsset(
  options = {}
) {
  return createAsset({
    ...options,

    type:
      ASSET_TYPES.VEHICLE
  });
}

export function createMotorcycleAsset(
  options = {}
) {
  return createAsset({
    ...options,

    type:
      ASSET_TYPES.MOTORCYCLE
  });
}

export function createBoatAsset(
  options = {}
) {
  return createAsset({
    ...options,

    type:
      ASSET_TYPES.BOAT
  });
}

export function createAircraftAsset(
  options = {}
) {
  return createAsset({
    ...options,

    type:
      ASSET_TYPES.AIRCRAFT
  });
}

export function createInvestmentAsset(
  options = {}
) {
  return createAsset({
    ...options,

    type:
      options.type ||
      ASSET_TYPES.INVESTMENT
  });
}

export function createStockAsset(
  options = {}
) {
  return createAsset({
    ...options,

    type:
      ASSET_TYPES.STOCK
  });
}

export function createFundAsset(
  options = {}
) {
  return createAsset({
    ...options,

    type:
      ASSET_TYPES.FUND
  });
}

export function createCryptoAsset(
  options = {}
) {
  return createAsset({
    ...options,

    type:
      ASSET_TYPES.CRYPTO
  });
}

export function createBusinessAsset(
  options = {}
) {
  return createAsset({
    ...options,

    type:
      ASSET_TYPES.BUSINESS
  });
}

export function createGymAsset(
  options = {}
) {
  return createAsset({
    ...options,

    type:
      ASSET_TYPES.GYM
  });
}

export function createPromotionAsset(
  options = {}
) {
  return createAsset({
    ...options,

    type:
      ASSET_TYPES.PROMOTION
  });
}

export function createBrandAsset(
  options = {}
) {
  return createAsset({
    ...options,

    type:
      ASSET_TYPES.BRAND
  });
}

export function createEquipmentAsset(
  options = {}
) {
  return createAsset({
    ...options,

    type:
      ASSET_TYPES.EQUIPMENT
  });
}

// ============================================================
// BANCO DE ATIVOS
// ============================================================

export function addAssetToDatabase(
  database,
  asset
) {
  if (
    !database ||
    !asset
  ) {
    return false;
  }

  if (
    !database.assets
  ) {
    database.assets = {};
  }

  database.assets[
    asset.id
  ] = clone(asset);

  trimAssetHistory(
    database
  );

  return true;
}

function trimAssetHistory(
  database
) {
  if (
    !database ||
    !database.assets
  ) {
    return;
  }

  const entries =
    Object.entries(
      database.assets
    );

  if (
    entries.length <=
    ASSET_CONFIG.historyLimit
  ) {
    return;
  }

  entries.sort(
    (
      [, a],
      [, b]
    ) =>
      new Date(
        a.createdAt
      ) -
      new Date(
        b.createdAt
      )
  );

  const removeCount =
    entries.length -
    ASSET_CONFIG.historyLimit;

  for (
    let i = 0;
    i < removeCount;
    i++
  ) {
    delete database.assets[
      entries[i][0]
    ];
  }
}

// ============================================================
// CONSULTAS
// ============================================================

export function getAsset(
  database,
  assetId
) {
  if (
    !database ||
    !database.assets ||
    !assetId
  ) {
    return null;
  }

  return (
    database.assets[
      assetId
    ] || null
  );
}

export function getAllAssets(
  database
) {
  if (
    !database ||
    !database.assets
  ) {
    return [];
  }

  return Object.values(
    database.assets
  );
}

export function getActiveAssets(
  database
) {
  return getAllAssets(
    database
  ).filter(
    asset =>
      asset.status ===
      ASSET_STATUS.ACTIVE
  );
}

export function getAssetsByType(
  database,
  type
) {
  return getAllAssets(
    database
  ).filter(
    asset =>
      asset.type === type
  );
}

export function getAssetsByStatus(
  database,
  status
) {
  return getAllAssets(
    database
  ).filter(
    asset =>
      asset.status === status
  );
}

export function getPlayerAssets(
  database,
  playerId
) {
  if (
    !playerId
  ) {
    return [];
  }

  return getAllAssets(
    database
  ).filter(
    asset =>
      asset.ownerId ===
      playerId
  );
}

// ============================================================
// VALOR TOTAL
// ============================================================

export function calculateTotalAssetValue(
  database,
  options = {}
) {
  let assets =
    getAllAssets(
      database
    );

  if (
    options.activeOnly
  ) {
    assets =
      assets.filter(
        asset =>
          asset.status ===
          ASSET_STATUS.ACTIVE
      );
  }

  if (
    options.type
  ) {
    assets =
      assets.filter(
        asset =>
          asset.type ===
          options.type
      );
  }

  if (
    options.status
  ) {
    assets =
      assets.filter(
        asset =>
          asset.status ===
          options.status
      );
  }

  const purchaseValue =
    assets.reduce(
      (
        total,
        asset
      ) =>
        total +
        number(
          asset.purchaseValue,
          0
        ),
      0
    );

  const currentValue =
    assets.reduce(
      (
        total,
        asset
      ) =>
        total +
        number(
          asset.currentValue,
          0
        ),
      0
    );

  const debt =
    assets.reduce(
      (
        total,
        asset
      ) =>
        total +
        number(
          asset.debt,
          0
        ),
      0
    );

  return {
    count:
      assets.length,

    purchaseValue:
      Math.round(
        purchaseValue
      ),

    currentValue:
      Math.round(
        currentValue
      ),

    debt:
      Math.round(
        debt
      ),

    equity:
      Math.round(
        currentValue -
        debt
      ),

    appreciation:
      Math.round(
        currentValue -
        purchaseValue
      )
  };
}

// ============================================================
// PATRIMÔNIO POR TIPO
// ============================================================

export function getAssetBreakdown(
  database
) {
  const assets =
    getActiveAssets(
      database
    );

  const breakdown = {};

  for (
    const asset of assets
  ) {
    const type =
      asset.type ||
      ASSET_TYPES.OTHER;

    if (
      !breakdown[type]
    ) {
      breakdown[type] = {
        count: 0,
        purchaseValue: 0,
        currentValue: 0,
        debt: 0,
        equity: 0
      };
    }

    breakdown[type].count += 1;

    breakdown[type].purchaseValue +=
      number(
        asset.purchaseValue,
        0
      );

    breakdown[type].currentValue +=
      number(
        asset.currentValue,
        0
      );

    breakdown[type].debt +=
      number(
        asset.debt,
        0
      );
  }

  for (
    const type of Object.keys(
      breakdown
    )
  ) {
    breakdown[type].purchaseValue =
      Math.round(
        breakdown[type].purchaseValue
      );

    breakdown[type].currentValue =
      Math.round(
        breakdown[type].currentValue
      );

    breakdown[type].debt =
      Math.round(
        breakdown[type].debt
      );

    breakdown[type].equity =
      Math.round(
        breakdown[type].currentValue -
        breakdown[type].debt
      );
  }

  return breakdown;
}

// ============================================================
// ATUALIZAÇÃO DE VALOR
// ============================================================

export function updateAssetValue(
  asset,
  newValue,
  date = new Date()
) {
  if (!asset) {
    return null;
  }

  const value =
    clamp(
      number(
        newValue,
        asset.currentValue
      ),
      ASSET_CONFIG.minimumValue,
      ASSET_CONFIG.maximumValue
    );

  asset.currentValue =
    Math.round(value);

  asset.updatedAt =
    isoDate(date);

  return asset;
}

// ============================================================
// APRECIAÇÃO
// ============================================================

export function calculateAppreciatedValue(
  asset,
  periods = 1
) {
  if (!asset) {
    return 0;
  }

  const currentValue =
    number(
      asset.currentValue,
      0
    );

  const rate =
    number(
      asset.appreciationRate,
      0
    );

  const totalPeriods =
    Math.max(
      0,
      number(
        periods,
        1
      )
    );

  return Math.round(
    currentValue *
      Math.pow(
        1 + rate,
        totalPeriods
      )
  );
}

export function appreciateAsset(
  asset,
  periods = 1,
  date = new Date()
) {
  if (!asset) {
    return null;
  }

  const newValue =
    calculateAppreciatedValue(
      asset,
      periods
    );

  return updateAssetValue(
    asset,
    newValue,
    date
  );
}

// ============================================================
// DEPRECIAÇÃO
// ============================================================

export function calculateDepreciation(
  asset,
  rate,
  periods = 1
) {
  if (!asset) {
    return 0;
  }

  const currentValue =
    number(
      asset.currentValue,
      0
    );

  const depreciationRate =
    Math.max(
      0,
      number(
        rate,
        0
      )
    );

  const totalPeriods =
    Math.max(
      0,
      number(
        periods,
        1
      )
    );

  return Math.round(
    currentValue *
      Math.pow(
        1 -
          depreciationRate,
        totalPeriods
      )
  );
}

export function depreciateAsset(
  asset,
  rate,
  periods = 1,
  date = new Date()
) {
  if (!asset) {
    return null;
  }

  const newValue =
    calculateDepreciation(
      asset,
      rate,
      periods
    );

  return updateAssetValue(
    asset,
    newValue,
    date
  );
}

// ============================================================
// RENDA DOS ATIVOS
// ============================================================

export function calculateMonthlyAssetIncome(
  database
) {
  return getActiveAssets(
    database
  ).reduce(
    (
      total,
      asset
    ) =>
      total +
      number(
        asset.monthlyIncome,
        0
      ),
    0
  );
}

export function calculateMonthlyAssetExpenses(
  database
) {
  return getActiveAssets(
    database
  ).reduce(
    (
      total,
      asset
    ) =>
      total +
      number(
        asset.monthlyExpense,
        0
      ),
    0
  );
}

export function calculateMonthlyAssetProfit(
  database
) {
  return (
    calculateMonthlyAssetIncome(
      database
    ) -
    calculateMonthlyAssetExpenses(
      database
    )
  );
}

// ============================================================
// VENDA
// ============================================================

export function sellAsset(
  database,
  assetId,
  saleValue,
  options = {}
) {
  const asset =
    getAsset(
      database,
      assetId
    );

  if (!asset) {
    return {
      success: false,
      reason: "asset_not_found"
    };
  }

  if (
    asset.status !==
    ASSET_STATUS.ACTIVE
  ) {
    return {
      success: false,
      reason: "asset_not_active"
    };
  }

  const value =
    Math.max(
      0,
      number(
        saleValue,
        asset.currentValue
      )
    );

  const debt =
    Math.max(
      0,
      number(
        asset.debt,
        0
      )
    );

  const netSaleValue =
    Math.max(
      0,
      value - debt
    );

  asset.currentValue =
    Math.round(value);

  asset.status =
    ASSET_STATUS.SOLD;

  asset.updatedAt =
    isoDate(
      options.date ||
      new Date()
    );

  asset.saleDate =
    asset.updatedAt;

  asset.saleValue =
    Math.round(value);

  asset.netSaleValue =
    Math.round(
      netSaleValue
    );

  asset.saleReference =
    options.referenceId ||
    null;

  return {
    success: true,

    asset,

    saleValue:
      Math.round(value),

    debt:
      Math.round(debt),

    netSaleValue:
      Math.round(
        netSaleValue
      ),

    profit:
      Math.round(
        value -
        number(
          asset.purchaseValue,
          0
        )
      )
  };
}

// ============================================================
// TRANSFERÊNCIA
// ============================================================

export function transferAsset(
  database,
  assetId,
  newOwnerId,
  options = {}
) {
  const asset =
    getAsset(
      database,
      assetId
    );

  if (!asset) {
    return {
      success: false,
      reason: "asset_not_found"
    };
  }

  if (!newOwnerId) {
    return {
      success: false,
      reason: "owner_missing"
    };
  }

  asset.ownerId =
    newOwnerId;

  asset.status =
    options.status ||
    ASSET_STATUS.TRANSFERRED;

  asset.updatedAt =
    isoDate(
      options.date ||
      new Date()
    );

  asset.transferReason =
    options.reason ||
    "transfer";

  return {
    success: true,
    asset
  };
}

// ============================================================
// HERANÇA
// ============================================================

export function inheritAsset(
  database,
  assetId,
  heirId,
  options = {}
) {
  const asset =
    getAsset(
      database,
      assetId
    );

  if (!asset) {
    return {
      success: false,
      reason: "asset_not_found"
    };
  }

  if (!heirId) {
    return {
      success: false,
      reason: "heir_missing"
    };
  }

  asset.ownerId =
    heirId;

  asset.status =
    ASSET_STATUS.INHERITED;

  asset.acquiredThrough =
    "inheritance";

  asset.updatedAt =
    isoDate(
      options.date ||
      new Date()
    );

  asset.inheritanceId =
    options.inheritanceId ||
    null;

  return {
    success: true,
    asset,

    inheritedValue:
      Math.round(
        number(
          asset.currentValue,
          0
        )
      )
  };
}

// ============================================================
// REMOVER ATIVO
// ============================================================

export function removeAsset(
  database,
  assetId
) {
  if (
    !database ||
    !database.assets ||
    !assetId
  ) {
    return false;
  }

  if (
    !database.assets[
      assetId
    ]
  ) {
    return false;
  }

  delete database.assets[
    assetId
  ];

  return true;
}

// ============================================================
// VALIDAÇÃO
// ============================================================

export function validateAsset(
  asset
) {
  const errors = [];

  if (!asset) {
    return {
      valid: false,
      errors: [
        "asset_missing"
      ]
    };
  }

  if (!asset.id) {
    errors.push(
      "id_missing"
    );
  }

  if (!asset.name) {
    errors.push(
      "name_missing"
    );
  }

  if (!asset.type) {
    errors.push(
      "type_missing"
    );
  }

  if (
    number(
      asset.purchaseValue,
      -1
    ) < 0
  ) {
    errors.push(
      "invalid_purchase_value"
    );
  }

  if (
    number(
      asset.currentValue,
      -1
    ) < 0
  ) {
    errors.push(
      "invalid_current_value"
    );
  }

  if (
    number(
      asset.debt,
      -1
    ) < 0
  ) {
    errors.push(
      "invalid_debt"
    );
  }

  if (
    number(
      asset.monthlyIncome,
      -1
    ) < 0
  ) {
    errors.push(
      "invalid_monthly_income"
    );
  }

  if (
    number(
      asset.monthlyExpense,
      -1
    ) < 0
  ) {
    errors.push(
      "invalid_monthly_expense"
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

export function snapshotAsset(
  asset
) {
  return clone(
    asset
  );
}

// ============================================================
// RESUMO PATRIMONIAL
// ============================================================

export function getAssetSummary(
  database
) {
  const valuation =
    calculateTotalAssetValue(
      database,
      {
        activeOnly: true
      }
    );

  const monthlyIncome =
    calculateMonthlyAssetIncome(
      database
    );

  const monthlyExpenses =
    calculateMonthlyAssetExpenses(
      database
    );

  return {
    assetCount:
      valuation.count,

    purchaseValue:
      valuation.purchaseValue,

    currentValue:
      valuation.currentValue,

    debt:
      valuation.debt,

    equity:
      valuation.equity,

    appreciation:
      valuation.appreciation,

    monthlyIncome:
      Math.round(
        monthlyIncome
      ),

    monthlyExpenses:
      Math.round(
        monthlyExpenses
      ),

    monthlyProfit:
      Math.round(
        monthlyIncome -
        monthlyExpenses
      ),

    breakdown:
      getAssetBreakdown(
        database
      )
  };
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  ASSETS_VERSION,

  ASSET_TYPES,

  ASSET_STATUS,

  ASSET_CONFIG,

  getDefaultAppreciationRate,

  createAsset,

  createRealEstateAsset,

  createHouseAsset,

  createApartmentAsset,

  createLandAsset,

  createCommercialPropertyAsset,

  createVehicleAsset,

  createMotorcycleAsset,

  createBoatAsset,

  createAircraftAsset,

  createInvestmentAsset,

  createStockAsset,

  createFundAsset,

  createCryptoAsset,

  createBusinessAsset,

  createGymAsset,

  createPromotionAsset,

  createBrandAsset,

  createEquipmentAsset,

  addAssetToDatabase,

  getAsset,

  getAllAssets,

  getActiveAssets,

  getAssetsByType,

  getAssetsByStatus,

  getPlayerAssets,

  calculateTotalAssetValue,

  getAssetBreakdown,

  updateAssetValue,

  calculateAppreciatedValue,

  appreciateAsset,

  calculateDepreciation,

  depreciateAsset,

  calculateMonthlyAssetIncome,

  calculateMonthlyAssetExpenses,

  calculateMonthlyAssetProfit,

  sellAsset,

  transferAsset,

  inheritAsset,

  removeAsset,

  validateAsset,

  snapshotAsset,

  getAssetSummary
};
