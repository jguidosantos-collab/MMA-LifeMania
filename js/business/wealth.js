// ============================================================
// MMA LIFE DYNASTY
// js/business/wealth.js
// Sistema central de riqueza, patrimônio e fluxo financeiro
// ============================================================

export const WEALTH_VERSION = 1;

// ============================================================
// CONFIGURAÇÃO
// ============================================================

export const WEALTH_CONFIG = Object.freeze({
  defaultCurrency: "USD",

  wealthClasses: {
    BROKE: 0,
    SURVIVING: 1000,
    STABLE: 10000,
    COMFORTABLE: 50000,
    WEALTHY: 250000,
    RICH: 1000000,
    VERY_RICH: 10000000,
    ULTRA_RICH: 100000000,
    BILLIONAIRE: 1000000000
  },

  historyLimit: 500
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

// ============================================================
// GARANTIR ESTRUTURA FINANCEIRA
// ============================================================

export function ensureWealthStructure(
  database
) {
  if (!database) {
    return null;
  }

  if (!database.wealth) {
    database.wealth = {};
  }

  if (
    !database.wealth.history
  ) {
    database.wealth.history = [];
  }

  if (
    !database.wealth.baseline
  ) {
    database.wealth.baseline = {
      cash: 0,
      assets: 0,
      liabilities: 0,
      netWorth: 0
    };
  }

  if (
    !database.wealth.statistics
  ) {
    database.wealth.statistics = {
      highestNetWorth: 0,
      lowestNetWorth: 0,
      totalIncome: 0,
      totalExpenses: 0,
      totalInvestment: 0,
      totalInheritance: 0
    };
  }

  return database.wealth;
}

// ============================================================
// EXTRAÇÃO DE DINHEIRO
// ============================================================

export function getCashBalance(
  database
) {
  if (!database) {
    return 0;
  }

  const finances =
    database.business?.finances;

  if (finances) {
    if (
      finances.cash !== undefined
    ) {
      return number(
        finances.cash,
        0
      );
    }

    if (
      finances.balance !== undefined
    ) {
      return number(
        finances.balance,
        0
      );
    }

    if (
      finances.currentCash !== undefined
    ) {
      return number(
        finances.currentCash,
        0
      );
    }
  }

  if (
    database.business?.cash !==
    undefined
  ) {
    return number(
      database.business.cash,
      0
    );
  }

  if (
    database.player?.cash !==
    undefined
  ) {
    return number(
      database.player.cash,
      0
    );
  }

  return 0;
}

// ============================================================
// EXTRAÇÃO DE ATIVOS
// ============================================================

function getAssetsArray(
  database
) {
  if (!database) {
    return [];
  }

  if (
    database.assets &&
    typeof database.assets ===
      "object"
  ) {
    return Object.values(
      database.assets
    );
  }

  if (
    database.business?.assets &&
    typeof database.business.assets ===
      "object"
  ) {
    return Array.isArray(
      database.business.assets
    )
      ? database.business.assets
      : Object.values(
          database.business.assets
        );
  }

  return [];
}

export function getTotalAssets(
  database
) {
  const assets =
    getAssetsArray(
      database
    );

  return assets.reduce(
    (
      total,
      asset
    ) => {
      const status =
        String(
          asset?.status ||
          "active"
        ).toLowerCase();

      if (
        status === "sold" ||
        status === "lost"
      ) {
        return total;
      }

      return (
        total +
        number(
          asset?.currentValue ??
            asset?.marketValue ??
            asset?.value,
          0
        )
      );
    },
    0
  );
}

// ============================================================
// EXTRAÇÃO DE DÍVIDAS
// ============================================================

function getLiabilitiesArray(
  database
) {
  if (!database) {
    return [];
  }

  if (
    database.liabilities &&
    typeof database.liabilities ===
      "object"
  ) {
    return Array.isArray(
      database.liabilities
    )
      ? database.liabilities
      : Object.values(
          database.liabilities
        );
  }

  if (
    database.business?.finances?.liabilities &&
    typeof database.business.finances.liabilities ===
      "object"
  ) {
    return Array.isArray(
      database.business.finances.liabilities
    )
      ? database.business.finances.liabilities
      : Object.values(
          database.business.finances.liabilities
        );
  }

  if (
    database.business?.liabilities &&
    typeof database.business.liabilities ===
      "object"
  ) {
    return Array.isArray(
      database.business.liabilities
    )
      ? database.business.liabilities
      : Object.values(
          database.business.liabilities
        );
  }

  return [];
}

export function getTotalLiabilities(
  database
) {
  const liabilities =
    getLiabilitiesArray(
      database
    );

  return liabilities.reduce(
    (
      total,
      liability
    ) =>
      total +
      number(
        liability?.remaining ??
          liability?.balance ??
          liability?.amount ??
          liability?.value,
        0
      ),
    0
  );
}

// ============================================================
// RECEITAS
// ============================================================

function getIncomeArray(
  database
) {
  if (!database) {
    return [];
  }

  if (
    database.income &&
    typeof database.income ===
      "object"
  ) {
    return Array.isArray(
      database.income
    )
      ? database.income
      : Object.values(
          database.income
        );
  }

  if (
    database.business?.income &&
    typeof database.business.income ===
      "object"
  ) {
    return Array.isArray(
      database.business.income
    )
      ? database.business.income
      : Object.values(
          database.business.income
        );
  }

  if (
    database.business?.finances?.incomeHistory
  ) {
    return database.business.finances
      .incomeHistory;
  }

  if (
    database.business?.finances?.incomes
  ) {
    return Array.isArray(
      database.business.finances.incomes
    )
      ? database.business.finances.incomes
      : Object.values(
          database.business.finances.incomes
        );
  }

  return [];
}

export function getTotalIncome(
  database,
  options = {}
) {
  let incomes =
    getIncomeArray(
      database
    );

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
            income.date ||
              income.createdAt
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
            income.date ||
              income.createdAt
          ) <= end
      );
  }

  return incomes.reduce(
    (
      total,
      income
    ) =>
      total +
      number(
        income.netAmount ??
          income.amount ??
          income.value,
        0
      ),
    0
  );
}

// ============================================================
// DESPESAS
// ============================================================

function getExpensesArray(
  database
) {
  if (!database) {
    return [];
  }

  if (
    database.expenses &&
    typeof database.expenses ===
      "object"
  ) {
    return Array.isArray(
      database.expenses
    )
      ? database.expenses
      : Object.values(
          database.expenses
        );
  }

  if (
    database.business?.expenses &&
    typeof database.business.expenses ===
      "object"
  ) {
    return Array.isArray(
      database.business.expenses
    )
      ? database.business.expenses
      : Object.values(
          database.business.expenses
        );
  }

  if (
    database.business?.finances?.expenseHistory
  ) {
    return database.business.finances
      .expenseHistory;
  }

  if (
    database.business?.finances?.expenses
  ) {
    return Array.isArray(
      database.business.finances.expenses
    )
      ? database.business.finances.expenses
      : Object.values(
          database.business.finances.expenses
        );
  }

  return [];
}

export function getTotalExpenses(
  database,
  options = {}
) {
  let expenses =
    getExpensesArray(
      database
    );

  if (
    options.startDate
  ) {
    const start =
      new Date(
        options.startDate
      );

    expenses =
      expenses.filter(
        expense =>
          new Date(
            expense.date ||
              expense.createdAt
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

    expenses =
      expenses.filter(
        expense =>
          new Date(
            expense.date ||
              expense.createdAt
          ) <= end
      );
  }

  return expenses.reduce(
    (
      total,
      expense
    ) =>
      total +
      number(
        expense.amount ??
          expense.value,
        0
      ),
    0
  );
}

// ============================================================
// PATRIMÔNIO LÍQUIDO
// ============================================================

export function calculateNetWorth(
  database
) {
  const cash =
    getCashBalance(
      database
    );

  const assets =
    getTotalAssets(
      database
    );

  const liabilities =
    getTotalLiabilities(
      database
    );

  return Math.round(
    cash +
      assets -
      liabilities
  );
}

// ============================================================
// PATRIMÔNIO BRUTO
// ============================================================

export function calculateGrossWealth(
  database
) {
  return Math.round(
    getCashBalance(
      database
    ) +
      getTotalAssets(
        database
      )
  );
}

// ============================================================
// CLASSIFICAÇÃO DE RIQUEZA
// ============================================================

export function getWealthClass(
  netWorth
) {
  const value =
    number(
      netWorth,
      0
    );

  if (
    value >=
    WEALTH_CONFIG.wealthClasses.BILLIONAIRE
  ) {
    return {
      id: "billionaire",
      label: "Bilionário",
      minimum:
        WEALTH_CONFIG.wealthClasses.BILLIONAIRE
    };
  }

  if (
    value >=
    WEALTH_CONFIG.wealthClasses.ULTRA_RICH
  ) {
    return {
      id: "ultra_rich",
      label: "Ultra-rico",
      minimum:
        WEALTH_CONFIG.wealthClasses.ULTRA_RICH
    };
  }

  if (
    value >=
    WEALTH_CONFIG.wealthClasses.VERY_RICH
  ) {
    return {
      id: "very_rich",
      label: "Muito rico",
      minimum:
        WEALTH_CONFIG.wealthClasses.VERY_RICH
    };
  }

  if (
    value >=
    WEALTH_CONFIG.wealthClasses.RICH
  ) {
    return {
      id: "rich",
      label: "Rico",
      minimum:
        WEALTH_CONFIG.wealthClasses.RICH
    };
  }

  if (
    value >=
    WEALTH_CONFIG.wealthClasses.WEALTHY
  ) {
    return {
      id: "wealthy",
      label: "Abastado",
      minimum:
        WEALTH_CONFIG.wealthClasses.WEALTHY
    };
  }

  if (
    value >=
    WEALTH_CONFIG.wealthClasses.COMFORTABLE
  ) {
    return {
      id: "comfortable",
      label: "Confortável",
      minimum:
        WEALTH_CONFIG.wealthClasses.COMFORTABLE
    };
  }

  if (
    value >=
    WEALTH_CONFIG.wealthClasses.STABLE
  ) {
    return {
      id: "stable",
      label: "Estável",
      minimum:
        WEALTH_CONFIG.wealthClasses.STABLE
    };
  }

  if (
    value >=
    WEALTH_CONFIG.wealthClasses.SURVIVING
  ) {
    return {
      id: "surviving",
      label: "Sobrevivendo",
      minimum:
        WEALTH_CONFIG.wealthClasses.SURVIVING
    };
  }

  return {
    id: "broke",
    label: "Sem patrimônio",
    minimum:
      WEALTH_CONFIG.wealthClasses.BROKE
  };
}

// ============================================================
// FLUXO DE CAIXA
// ============================================================

export function calculateCashFlow(
  database,
  options = {}
) {
  const income =
    getTotalIncome(
      database,
      options
    );

  const expenses =
    getTotalExpenses(
      database,
      options
    );

  return {
    income:
      Math.round(
        income
      ),

    expenses:
      Math.round(
        expenses
      ),

    net:
      Math.round(
        income -
          expenses
      )
  };
}

// ============================================================
// TAXA DE POUPANÇA
// ============================================================

export function calculateSavingsRate(
  database,
  options = {}
) {
  const flow =
    calculateCashFlow(
      database,
      options
    );

  if (
    flow.income <= 0
  ) {
    return 0;
  }

  return (
    Math.round(
      (
        flow.net /
        flow.income
      ) *
        10000
    ) / 100
  );
}

// ============================================================
// DÍVIDA / PATRIMÔNIO
// ============================================================

export function calculateDebtRatio(
  database
) {
  const gross =
    calculateGrossWealth(
      database
    );

  const liabilities =
    getTotalLiabilities(
      database
    );

  if (
    gross <= 0
  ) {
    return liabilities > 0
      ? 100
      : 0;
  }

  return (
    Math.round(
      (
        liabilities /
        gross
      ) *
        10000
    ) / 100
  );
}

// ============================================================
// LIQUIDEZ
// ============================================================

export function calculateLiquidityRatio(
  database
) {
  const netWorth =
    calculateNetWorth(
      database
    );

  const liabilities =
    getTotalLiabilities(
      database
    );

  if (
    liabilities <= 0
  ) {
    return Infinity;
  }

  return (
    Math.round(
      (
        getCashBalance(
          database
        ) /
        liabilities
      ) *
        100
    ) / 100
  );
}

// ============================================================
// RENTABILIDADE DOS ATIVOS
// ============================================================

export function calculateAssetIncome(
  database
) {
  const assets =
    getAssetsArray(
      database
    );

  return {
    monthly:
      Math.round(
        assets.reduce(
          (
            total,
            asset
          ) =>
            total +
            number(
              asset?.monthlyIncome,
              0
            ),
          0
        )
      ),

    monthlyExpenses:
      Math.round(
        assets.reduce(
          (
            total,
            asset
          ) =>
            total +
            number(
              asset?.monthlyExpense,
              0
            ),
          0
        )
      )
  };
}

export function calculateAssetYield(
  database
) {
  const assets =
    getTotalAssets(
      database
    );

  const income =
    calculateAssetIncome(
      database
    );

  const annualProfit =
    (
      income.monthly -
      income.monthlyExpenses
    ) * 12;

  if (
    assets <= 0
  ) {
    return 0;
  }

  return (
    Math.round(
      (
        annualProfit /
        assets
      ) *
        10000
    ) / 100
  );
}

// ============================================================
// RIQUEZA HISTÓRICA
// ============================================================

export function createWealthSnapshot(
  database,
  date = new Date()
) {
  const cash =
    getCashBalance(
      database
    );

  const assets =
    getTotalAssets(
      database
    );

  const liabilities =
    getTotalLiabilities(
      database
    );

  const netWorth =
    Math.round(
      cash +
        assets -
        liabilities
    );

  return {
    date:
      isoDate(date),

    cash:
      Math.round(
        cash
      ),

    assets:
      Math.round(
        assets
      ),

    liabilities:
      Math.round(
        liabilities
      ),

    grossWealth:
      Math.round(
        cash +
          assets
      ),

    netWorth,

    wealthClass:
      getWealthClass(
        netWorth
      ).id
  };
}

export function recordWealthSnapshot(
  database,
  date = new Date()
) {
  const wealth =
    ensureWealthStructure(
      database
    );

  if (!wealth) {
    return null;
  }

  const snapshot =
    createWealthSnapshot(
      database,
      date
    );

  wealth.history.push(
    snapshot
  );

  if (
    wealth.history.length >
    WEALTH_CONFIG.historyLimit
  ) {
    wealth.history =
      wealth.history.slice(
        -WEALTH_CONFIG.historyLimit
      );
  }

  updateWealthStatistics(
    database
  );

  return snapshot;
}

// ============================================================
// ESTATÍSTICAS
// ============================================================

export function updateWealthStatistics(
  database
) {
  const wealth =
    ensureWealthStructure(
      database
    );

  if (!wealth) {
    return null;
  }

  const current =
    calculateNetWorth(
      database
    );

  const history =
    wealth.history || [];

  const values =
    history
      .map(
        snapshot =>
          number(
            snapshot.netWorth,
            0
          )
      );

  values.push(
    current
  );

  const highest =
    Math.max(
      ...values
    );

  const lowest =
    Math.min(
      ...values
    );

  wealth.statistics
    .highestNetWorth =
    Math.round(
      highest
    );

  wealth.statistics
    .lowestNetWorth =
    Math.round(
      lowest
    );

  wealth.statistics
    .totalIncome =
    Math.round(
      getTotalIncome(
        database
      )
    );

  wealth.statistics
    .totalExpenses =
    Math.round(
      getTotalExpenses(
        database
      )
    );

  return wealth.statistics;
}

// ============================================================
// EVOLUÇÃO PATRIMONIAL
// ============================================================

export function calculateWealthGrowth(
  database
) {
  const wealth =
    ensureWealthStructure(
      database
    );

  const history =
    wealth?.history || [];

  if (
    history.length < 2
  ) {
    return {
      absolute: 0,
      percentage: 0,
      first: null,
      latest:
        history[
          history.length - 1
        ] || null
    };
  }

  const first =
    history[0];

  const latest =
    history[
      history.length - 1
    ];

  const firstValue =
    number(
      first.netWorth,
      0
    );

  const latestValue =
    number(
      latest.netWorth,
      0
    );

  const absolute =
    latestValue -
    firstValue;

  const percentage =
    firstValue !== 0
      ? (
          Math.round(
            (
              absolute /
              Math.abs(
                firstValue
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

    first,

    latest
  };
}

// ============================================================
// EVOLUÇÃO ENTRE DOIS SNAPSHOTS
// ============================================================

export function compareWealthSnapshots(
  older,
  newer
) {
  if (
    !older ||
    !newer
  ) {
    return {
      cashChange: 0,
      assetChange: 0,
      liabilityChange: 0,
      netWorthChange: 0,
      percentage: 0
    };
  }

  const oldNetWorth =
    number(
      older.netWorth,
      0
    );

  const newNetWorth =
    number(
      newer.netWorth,
      0
    );

  const change =
    newNetWorth -
    oldNetWorth;

  const percentage =
    oldNetWorth !== 0
      ? (
          Math.round(
            (
              change /
              Math.abs(
                oldNetWorth
              )
            ) *
              10000
          ) / 100
        )
      : 0;

  return {
    cashChange:
      Math.round(
        number(
          newer.cash,
          0
        ) -
          number(
            older.cash,
            0
          )
      ),

    assetChange:
      Math.round(
        number(
          newer.assets,
          0
        ) -
          number(
            older.assets,
            0
          )
      ),

    liabilityChange:
      Math.round(
        number(
          newer.liabilities,
          0
        ) -
          number(
            older.liabilities,
            0
          )
      ),

    netWorthChange:
      Math.round(
        change
      ),

    percentage
  };
}

// ============================================================
// HISTÓRICO
// ============================================================

export function getWealthHistory(
  database
) {
  const wealth =
    ensureWealthStructure(
      database
    );

  return clone(
    wealth?.history || []
  );
}

export function getLatestWealthSnapshot(
  database
) {
  const history =
    getWealthHistory(
      database
    );

  if (
    history.length === 0
  ) {
    return null;
  }

  return history[
    history.length - 1
  ];
}

// ============================================================
// RESUMO COMPLETO
// ============================================================

export function getWealthSummary(
  database
) {
  const cash =
    getCashBalance(
      database
    );

  const assets =
    getTotalAssets(
      database
    );

  const liabilities =
    getTotalLiabilities(
      database
    );

  const grossWealth =
    Math.round(
      cash +
        assets
    );

  const netWorth =
    Math.round(
      grossWealth -
        liabilities
    );

  const cashFlow =
    calculateCashFlow(
      database
    );

  const wealthClass =
    getWealthClass(
      netWorth
    );

  const assetIncome =
    calculateAssetIncome(
      database
    );

  return {
    cash:
      Math.round(
        cash
      ),

    assets:
      Math.round(
        assets
      ),

    liabilities:
      Math.round(
        liabilities
      ),

    grossWealth,

    netWorth,

    wealthClass:
      wealthClass.id,

    wealthLabel:
      wealthClass.label,

    monthlyIncome:
      cashFlow.income,

    monthlyExpenses:
      cashFlow.expenses,

    monthlyCashFlow:
      cashFlow.net,

    savingsRate:
      calculateSavingsRate(
        database
      ),

    debtRatio:
      calculateDebtRatio(
        database
      ),

    liquidityRatio:
      calculateLiquidityRatio(
        database
      ),

    assetMonthlyIncome:
      assetIncome.monthly,

    assetMonthlyExpenses:
      assetIncome.monthlyExpenses,

    assetYield:
      calculateAssetYield(
        database
      ),

    highestNetWorth:
      ensureWealthStructure(
        database
      ).statistics
        .highestNetWorth,

    lowestNetWorth:
      ensureWealthStructure(
        database
      ).statistics
        .lowestNetWorth
  };
}

// ============================================================
// PATRIMÔNIO DO JOGADOR
// ============================================================

export function getPlayerWealth(
  database,
  playerId
) {
  if (
    !playerId
  ) {
    return getWealthSummary(
      database
    );
  }

  const assets =
    getAssetsArray(
      database
    ).filter(
      asset =>
        asset.ownerId ===
        playerId
    );

  const cash =
    getCashBalance(
      database
    );

  const assetValue =
    assets.reduce(
      (
        total,
        asset
      ) =>
        total +
        number(
          asset.currentValue ??
            asset.marketValue ??
            asset.value,
          0
        ),
      0
    );

  const liabilities =
    getTotalLiabilities(
      database
    );

  const netWorth =
    Math.round(
      cash +
        assetValue -
        liabilities
    );

  return {
    cash:
      Math.round(
        cash
      ),

    assets:
      Math.round(
        assetValue
      ),

    liabilities:
      Math.round(
        liabilities
      ),

    grossWealth:
      Math.round(
        cash +
          assetValue
      ),

    netWorth,

    wealthClass:
      getWealthClass(
        netWorth
      )
  };
}

// ============================================================
// PROJEÇÃO
// ============================================================

export function projectWealth(
  database,
  months = 12,
  monthlyCashFlow = null
) {
  const current =
    calculateNetWorth(
      database
    );

  const flow =
    monthlyCashFlow === null
      ? calculateCashFlow(
          database
        ).net
      : number(
          monthlyCashFlow,
          0
        );

  const targetMonths =
    Math.max(
      0,
      integer(
        months,
        12
      )
    );

  const projected =
    Math.round(
      current +
        flow *
          targetMonths
    );

  return {
    current:
      Math.round(
        current
      ),

    monthlyCashFlow:
      Math.round(
        flow
      ),

    months:
      targetMonths,

    projected,

    change:
      Math.round(
        projected -
          current
      ),

    wealthClass:
      getWealthClass(
        projected
      )
  };
}

// ============================================================
// MARCOS DE RIQUEZA
// ============================================================

export function getNextWealthMilestone(
  netWorth
) {
  const value =
    number(
      netWorth,
      0
    );

  const milestones =
    Object.entries(
      WEALTH_CONFIG.wealthClasses
    )
      .map(
        ([key, amount]) => ({
          key,
          amount
        })
      )
      .sort(
        (
          a,
          b
        ) =>
          a.amount -
          b.amount
      );

  const next =
    milestones.find(
      milestone =>
        milestone.amount >
        value
    );

  if (!next) {
    return null;
  }

  return {
    id:
      next.key.toLowerCase(),

    amount:
      next.amount,

    remaining:
      Math.max(
        0,
        next.amount -
          value
      )
  };
}

// ============================================================
// POSIÇÃO NO HISTÓRICO
// ============================================================

export function getWealthRank(
  database,
  currentNetWorth = null
) {
  const wealth =
    ensureWealthStructure(
      database
    );

  const current =
    currentNetWorth === null
      ? calculateNetWorth(
          database
        )
      : number(
          currentNetWorth,
          0
        );

  const history =
    wealth?.history || [];

  if (
    history.length === 0
  ) {
    return {
      rank: 1,
      total: 1
    };
  }

  const uniqueValues =
    history
      .map(
        snapshot =>
          number(
            snapshot.netWorth,
            0
          )
      )
      .sort(
        (
          a,
          b
        ) =>
          b - a
      );

  const rank =
    uniqueValues.filter(
      value =>
        value >
        current
    ).length + 1;

  return {
    rank,

    total:
      uniqueValues.length + 1
  };
}

// ============================================================
// SNAPSHOT / RESET
// ============================================================

export function resetWealthHistory(
  database
) {
  const wealth =
    ensureWealthStructure(
      database
    );

  if (!wealth) {
    return false;
  }

  wealth.history = [];

  wealth.statistics = {
    highestNetWorth: 0,
    lowestNetWorth: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalInvestment: 0,
    totalInheritance: 0
  };

  return true;
}

// ============================================================
// SNAPSHOT
// ============================================================

export function snapshotWealth(
  database
) {
  return clone(
    getWealthSummary(
      database
    )
  );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  WEALTH_VERSION,

  WEALTH_CONFIG,

  ensureWealthStructure,

  getCashBalance,

  getTotalAssets,

  getTotalLiabilities,

  getTotalIncome,

  getTotalExpenses,

  calculateNetWorth,

  calculateGrossWealth,

  getWealthClass,

  calculateCashFlow,

  calculateSavingsRate,

  calculateDebtRatio,

  calculateLiquidityRatio,

  calculateAssetIncome,

  calculateAssetYield,

  createWealthSnapshot,

  recordWealthSnapshot,

  updateWealthStatistics,

  calculateWealthGrowth,

  compareWealthSnapshots,

  getWealthHistory,

  getLatestWealthSnapshot,

  getWealthSummary,

  getPlayerWealth,

  projectWealth,

  getNextWealthMilestone,

  getWealthRank,

  resetWealthHistory,

  snapshotWealth
};
