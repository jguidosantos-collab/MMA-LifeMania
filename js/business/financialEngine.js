// ============================================================
// MMA LIFE DYNASTY
// js/business/financialEngine.js
// Motor central do sistema financeiro
// ============================================================

import {
  getWealthSummary,
  recordWealthSnapshot,
  calculateCashFlow,
  calculateNetWorth,
  getCashBalance,
  getTotalAssets,
  getTotalLiabilities
} from "./wealth.js";

export const FINANCIAL_ENGINE_VERSION = 1;

// ============================================================
// CONFIGURAÇÃO
// ============================================================

export const FINANCIAL_ENGINE_CONFIG = Object.freeze({
  autoSnapshot: true,

  snapshotIntervalDays: 7,

  bankruptcyThreshold: -10000,

  warningThreshold: 5000,

  debtWarningRatio: 50,

  maxTransactionHistory: 1000
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

function makeId(prefix = "financial") {
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
// ESTRUTURA
// ============================================================

export function ensureFinancialEngine(
  database
) {
  if (!database) {
    return null;
  }

  if (!database.financialEngine) {
    database.financialEngine = {};
  }

  if (
    !database.financialEngine.transactions
  ) {
    database.financialEngine.transactions = [];
  }

  if (
    !database.financialEngine.snapshots
  ) {
    database.financialEngine.snapshots = [];
  }

  if (
    !database.financialEngine.lastSnapshotAt
  ) {
    database.financialEngine.lastSnapshotAt =
      null;
  }

  if (
    !database.financialEngine.statistics
  ) {
    database.financialEngine.statistics = {
      transactions: 0,
      income: 0,
      expenses: 0,
      netCashFlow: 0,
      highestNetWorth: 0,
      lowestNetWorth: 0
    };
  }

  return database.financialEngine;
}

// ============================================================
// GARANTIR BUSINESS
// ============================================================

function ensureBusiness(
  database
) {
  if (!database) {
    return null;
  }

  if (!database.business) {
    database.business = {};
  }

  if (
    !database.business.finances
  ) {
    database.business.finances = {};
  }

  if (
    database.business.finances.cash ===
    undefined
  ) {
    database.business.finances.cash = 0;
  }

  return database.business;
}

// ============================================================
// CAIXA
// ============================================================

export function setCash(
  database,
  amount
) {
  const business =
    ensureBusiness(
      database
    );

  if (!business) {
    return 0;
  }

  business.finances.cash =
    integer(
      amount,
      0
    );

  return business.finances.cash;
}

export function addCash(
  database,
  amount,
  metadata = {}
) {
  const value =
    number(
      amount,
      0
    );

  const current =
    getCashBalance(
      database
    );

  const newBalance =
    current +
    value;

  setCash(
    database,
    newBalance
  );

  registerFinancialTransaction(
    database,
    {
      type:
        value >= 0
          ? "cash_in"
          : "cash_out",

      amount:
        Math.abs(
          value
        ),

      direction:
        value >= 0
          ? "income"
          : "expense",

      description:
        metadata.description ||
        (
          value >= 0
            ? "Entrada de dinheiro"
            : "Saída de dinheiro"
        ),

      category:
        metadata.category ||
        "cash",

      source:
        metadata.source ||
        null,

      referenceId:
        metadata.referenceId ||
        null
    }
  );

  return newBalance;
}

export function subtractCash(
  database,
  amount,
  metadata = {}
) {
  return addCash(
    database,
    -Math.abs(
      number(
        amount,
        0
      )
    ),
    metadata
  );
}

// ============================================================
// TRANSAÇÕES
// ============================================================

export function registerFinancialTransaction(
  database,
  transaction = {}
) {
  const engine =
    ensureFinancialEngine(
      database
    );

  if (!engine) {
    return null;
  }

  const amount =
    Math.abs(
      number(
        transaction.amount,
        0
      )
    );

  const direction =
    transaction.direction ===
    "expense"
      ? "expense"
      : "income";

  const record = {
    id:
      transaction.id ||
      makeId(
        "transaction"
      ),

    date:
      isoDate(
        transaction.date
      ),

    type:
      transaction.type ||
      "other",

    direction,

    amount,

    category:
      transaction.category ||
      "other",

    description:
      transaction.description ||
      "",

    source:
      transaction.source ||
      null,

    referenceId:
      transaction.referenceId ||
      null,

    recurring:
      Boolean(
        transaction.recurring
      ),

    metadata:
      clone(
        transaction.metadata ||
          {}
      )
  };

  engine.transactions.push(
    record
  );

  if (
    engine.transactions.length >
    FINANCIAL_ENGINE_CONFIG.maxTransactionHistory
  ) {
    engine.transactions =
      engine.transactions.slice(
        -FINANCIAL_ENGINE_CONFIG.maxTransactionHistory
      );
  }

  updateFinancialStatistics(
    database
  );

  return clone(
    record
  );
}

// ============================================================
// CONSULTAS
// ============================================================

export function getTransactions(
  database,
  options = {}
) {
  const engine =
    ensureFinancialEngine(
      database
    );

  if (!engine) {
    return [];
  }

  let transactions =
    engine.transactions;

  if (
    options.type
  ) {
    transactions =
      transactions.filter(
        transaction =>
          transaction.type ===
          options.type
      );
  }

  if (
    options.category
  ) {
    transactions =
      transactions.filter(
        transaction =>
          transaction.category ===
          options.category
      );
  }

  if (
    options.direction
  ) {
    transactions =
      transactions.filter(
        transaction =>
          transaction.direction ===
          options.direction
      );
  }

  if (
    options.startDate
  ) {
    const start =
      new Date(
        options.startDate
      );

    transactions =
      transactions.filter(
        transaction =>
          new Date(
            transaction.date
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

    transactions =
      transactions.filter(
        transaction =>
          new Date(
            transaction.date
          ) <= end
      );
  }

  return clone(
    transactions
  );
}

// ============================================================
// TOTAL DE RECEITAS
// ============================================================

export function getFinancialIncome(
  database,
  options = {}
) {
  return getTransactions(
    database,
    {
      ...options,
      direction:
        "income"
    }
  ).reduce(
    (
      total,
      transaction
    ) =>
      total +
      number(
        transaction.amount,
        0
      ),
    0
  );
}

// ============================================================
// TOTAL DE DESPESAS
// ============================================================

export function getFinancialExpenses(
  database,
  options = {}
) {
  return getTransactions(
    database,
    {
      ...options,
      direction:
        "expense"
    }
  ).reduce(
    (
      total,
      transaction
    ) =>
      total +
      number(
        transaction.amount,
        0
      ),
    0
  );
}

// ============================================================
// FLUXO FINANCEIRO
// ============================================================

export function getFinancialCashFlow(
  database,
  options = {}
) {
  const income =
    getFinancialIncome(
      database,
      options
    );

  const expenses =
    getFinancialExpenses(
      database,
      options
    );

  return {
    income:
      integer(
        income
      ),

    expenses:
      integer(
        expenses
      ),

    net:
      integer(
        income -
          expenses
      )
  };
}

// ============================================================
// REGISTRAR RECEITA
// ============================================================

export function processIncome(
  database,
  amount,
  options = {}
) {
  const value =
    Math.abs(
      number(
        amount,
        0
      )
    );

  if (
    value <= 0
  ) {
    return null;
  }

  const balance =
    getCashBalance(
      database
    );

  setCash(
    database,
    balance +
      value
  );

  return registerFinancialTransaction(
    database,
    {
      type:
        options.type ||
        "income",

      amount:
        value,

      direction:
        "income",

      category:
        options.category ||
        "general_income",

      description:
        options.description ||
        "Receita",

      source:
        options.source ||
        null,

      referenceId:
        options.referenceId ||
        null,

      date:
        options.date,

      metadata:
        options.metadata
    }
  );
}

// ============================================================
// REGISTRAR DESPESA
// ============================================================

export function processExpense(
  database,
  amount,
  options = {}
) {
  const value =
    Math.abs(
      number(
        amount,
        0
      )
    );

  if (
    value <= 0
  ) {
    return null;
  }

  const balance =
    getCashBalance(
      database
    );

  setCash(
    database,
    balance -
      value
  );

  return registerFinancialTransaction(
    database,
    {
      type:
        options.type ||
        "expense",

      amount:
        value,

      direction:
        "expense",

      category:
        options.category ||
        "general_expense",

      description:
        options.description ||
        "Despesa",

      source:
        options.source ||
        null,

      referenceId:
        options.referenceId ||
        null,

      date:
        options.date,

      metadata:
        options.metadata
    }
  );
}

// ============================================================
// PAGAMENTO DE DÍVIDA
// ============================================================

export function processDebtPayment(
  database,
  amount,
  options = {}
) {
  const value =
    Math.abs(
      number(
        amount,
        0
      )
    );

  if (
    value <= 0
  ) {
    return null;
  }

  const liabilities =
    database.business?.finances
      ?.liabilities;

  if (
    Array.isArray(
      liabilities
    )
  ) {
    let remaining =
      value;

    for (
      const debt of liabilities
    ) {
      if (
        remaining <= 0
      ) {
        break;
      }

      const balance =
        number(
          debt.remaining ??
            debt.balance ??
            debt.amount,
          0
        );

      if (
        balance <= 0
      ) {
        continue;
      }

      const payment =
        Math.min(
          balance,
          remaining
        );

      if (
        debt.remaining !==
        undefined
      ) {
        debt.remaining -=
          payment;
      } else if (
        debt.balance !==
        undefined
      ) {
        debt.balance -=
          payment;
      } else {
        debt.amount -=
          payment;
      }

      remaining -=
        payment;
    }
  }

  return processExpense(
    database,
    value,
    {
      ...options,

      type:
        "debt_payment",

      category:
        "debt",

      description:
        options.description ||
        "Pagamento de dívida"
    }
  );
}

// ============================================================
// SALÁRIO / PAGAMENTO
// ============================================================

export function processSalary(
  database,
  amount,
  options = {}
) {
  return processIncome(
    database,
    amount,
    {
      ...options,

      type:
        "salary",

      category:
        "salary",

      description:
        options.description ||
        "Salário"
    }
  );
}

// ============================================================
// PAGAMENTO DE LUTA
// ============================================================

export function processFightPurse(
  database,
  amount,
  options = {}
) {
  return processIncome(
    database,
    amount,
    {
      ...options,

      type:
        "fight_purse",

      category:
        "fight",

      description:
        options.description ||
        "Bolsa de luta"
    }
  );
}

// ============================================================
// BÔNUS DE VITÓRIA
// ============================================================

export function processWinBonus(
  database,
  amount,
  options = {}
) {
  return processIncome(
    database,
    amount,
    {
      ...options,

      type:
        "win_bonus",

      category:
        "fight_bonus",

      description:
        options.description ||
        "Bônus de vitória"
    }
  );
}

// ============================================================
// PATROCÍNIO
// ============================================================

export function processSponsorship(
  database,
  amount,
  options = {}
) {
  return processIncome(
    database,
    amount,
    {
      ...options,

      type:
        "sponsorship",

      category:
        "sponsors",

      description:
        options.description ||
        "Patrocínio"
    }
  );
}

// ============================================================
// ENDORSEMENT
// ============================================================

export function processEndorsement(
  database,
  amount,
  options = {}
) {
  return processIncome(
    database,
    amount,
    {
      ...options,

      type:
        "endorsement",

      category:
        "endorsement",

      description:
        options.description ||
        "Contrato de publicidade"
    }
  );
}

// ============================================================
// PPV
// ============================================================

export function processPPV(
  database,
  amount,
  options = {}
) {
  return processIncome(
    database,
    amount,
    {
      ...options,

      type:
        "ppv",

      category:
        "ppv",

      description:
        options.description ||
        "Receita de PPV"
    }
  );
}

// ============================================================
// INVESTIMENTO
// ============================================================

export function processInvestmentIncome(
  database,
  amount,
  options = {}
) {
  return processIncome(
    database,
    amount,
    {
      ...options,

      type:
        "investment",

      category:
        "investment",

      description:
        options.description ||
        "Rendimento de investimento"
    }
  );
}

// ============================================================
// HERANÇA
// ============================================================

export function processInheritance(
  database,
  amount,
  options = {}
) {
  const transaction =
    processIncome(
      database,
      amount,
      {
        ...options,

        type:
          "inheritance",

        category:
          "inheritance",

        description:
          options.description ||
          "Herança"
      }
    );

  const engine =
    ensureFinancialEngine(
      database
    );

  if (
    engine &&
    transaction
  ) {
    database.wealth ??= {};

    database.wealth.inheritanceReceived =
      number(
        database.wealth
          .inheritanceReceived,
        0
      ) +
      transaction.amount;
  }

  return transaction;
}

// ============================================================
// PRESENTE / DOAÇÃO
// ============================================================

export function processGift(
  database,
  amount,
  options = {}
) {
  return processIncome(
    database,
    amount,
    {
      ...options,

      type:
        "gift",

      category:
        "gift",

      description:
        options.description ||
        "Presente recebido"
    }
  );
}

// ============================================================
// INVESTIMENTO DE CAPITAL
// ============================================================

export function investCash(
  database,
  amount,
  options = {}
) {
  const value =
    Math.abs(
      number(
        amount,
        0
      )
    );

  if (
    value <= 0
  ) {
    return null;
  }

  const balance =
    getCashBalance(
      database
    );

  if (
    balance <
    value &&
    !options.allowDebt
  ) {
    return {
      success: false,
      reason:
        "insufficient_funds"
    };
  }

  const transaction =
    processExpense(
      database,
      value,
      {
        ...options,

        type:
          "investment",

        category:
          "investment",

        description:
          options.description ||
          "Investimento"
      }
    );

  const engine =
    ensureFinancialEngine(
      database
    );

  if (
    engine
  ) {
    engine.statistics.totalInvestment =
      number(
        engine.statistics
          .totalInvestment,
        0
      ) +
      value;
  }

  return {
    success: true,
    amount:
      value,
    transaction
  };
}

// ============================================================
// RESUMO FINANCEIRO
// ============================================================

export function getFinancialSummary(
  database
) {
  const wealth =
    getWealthSummary(
      database
    );

  const flow =
    getFinancialCashFlow(
      database
    );

  return {
    cash:
      getCashBalance(
        database
      ),

    assets:
      getTotalAssets(
        database
      ),

    liabilities:
      getTotalLiabilities(
        database
      ),

    netWorth:
      calculateNetWorth(
        database
      ),

    grossWealth:
      wealth.grossWealth,

    income:
      flow.income,

    expenses:
      flow.expenses,

    cashFlow:
      flow.net,

    wealthClass:
      wealth.wealthClass,

    wealthLabel:
      wealth.wealthLabel,

    savingsRate:
      wealth.savingsRate,

    debtRatio:
      wealth.debtRatio,

    liquidityRatio:
      wealth.liquidityRatio
  };
}

// ============================================================
// ESTATÍSTICAS
// ============================================================

export function updateFinancialStatistics(
  database
) {
  const engine =
    ensureFinancialEngine(
      database
    );

  if (!engine) {
    return null;
  }

  const transactions =
    engine.transactions;

  const income =
    transactions
      .filter(
        transaction =>
          transaction.direction ===
          "income"
      )
      .reduce(
        (
          total,
          transaction
        ) =>
          total +
          number(
            transaction.amount,
            0
          ),
        0
      );

  const expenses =
    transactions
      .filter(
        transaction =>
          transaction.direction ===
          "expense"
      )
      .reduce(
        (
          total,
          transaction
        ) =>
          total +
          number(
            transaction.amount,
            0
          ),
        0
      );

  engine.statistics.transactions =
    transactions.length;

  engine.statistics.income =
    Math.round(
      income
    );

  engine.statistics.expenses =
    Math.round(
      expenses
    );

  engine.statistics.netCashFlow =
    Math.round(
      income -
        expenses
    );

  const netWorth =
    calculateNetWorth(
      database
    );

  if (
    engine.statistics
      .highestNetWorth ===
      0 ||
    netWorth >
      engine.statistics
        .highestNetWorth
  ) {
    engine.statistics
      .highestNetWorth =
      netWorth;
  }

  if (
    engine.statistics
      .lowestNetWorth ===
      0 ||
    netWorth <
      engine.statistics
        .lowestNetWorth
  ) {
    engine.statistics
      .lowestNetWorth =
      netWorth;
  }

  return clone(
    engine.statistics
  );
}

// ============================================================
// SNAPSHOT FINANCEIRO
// ============================================================

export function createFinancialSnapshot(
  database,
  date = new Date()
) {
  const summary =
    getFinancialSummary(
      database
    );

  return {
    id:
      makeId(
        "financial_snapshot"
      ),

    date:
      isoDate(
        date
      ),

    ...summary
  };
}

export function recordFinancialSnapshot(
  database,
  date = new Date()
) {
  const engine =
    ensureFinancialEngine(
      database
    );

  if (!engine) {
    return null;
  }

  const snapshot =
    createFinancialSnapshot(
      database,
      date
    );

  engine.snapshots.push(
    snapshot
  );

  if (
    engine.snapshots.length >
    FINANCIAL_ENGINE_CONFIG.maxTransactionHistory
  ) {
    engine.snapshots =
      engine.snapshots.slice(
        -FINANCIAL_ENGINE_CONFIG.maxTransactionHistory
      );
  }

  engine.lastSnapshotAt =
    snapshot.date;

  if (
    database.wealth
  ) {
    recordWealthSnapshot(
      database,
      date
    );
  }

  return clone(
    snapshot
  );
}

// ============================================================
// SNAPSHOT AUTOMÁTICO
// ============================================================

export function shouldCreateSnapshot(
  database,
  currentDate = new Date()
) {
  const engine =
    ensureFinancialEngine(
      database
    );

  if (
    !engine ||
    !FINANCIAL_ENGINE_CONFIG.autoSnapshot
  ) {
    return false;
  }

  if (
    !engine.lastSnapshotAt
  ) {
    return true;
  }

  const last =
    new Date(
      engine.lastSnapshotAt
    );

  const current =
    normalizeDate(
      currentDate
    );

  const difference =
    current.getTime() -
    last.getTime();

  const interval =
    FINANCIAL_ENGINE_CONFIG
      .snapshotIntervalDays *
    24 *
    60 *
    60 *
    1000;

  return (
    difference >=
    interval
  );
}

export function processAutomaticSnapshot(
  database,
  currentDate = new Date()
) {
  if (
    !shouldCreateSnapshot(
      database,
      currentDate
    )
  ) {
    return null;
  }

  return recordFinancialSnapshot(
    database,
    currentDate
  );
}

// ============================================================
// SAÚDE FINANCEIRA
// ============================================================

export function getFinancialHealth(
  database
) {
  const summary =
    getFinancialSummary(
      database
    );

  const cash =
    summary.cash;

  const netWorth =
    summary.netWorth;

  const debtRatio =
    summary.debtRatio;

  const cashFlow =
    summary.cashFlow;

  let score = 50;

  if (
    cash > 0
  ) {
    score += 10;
  }

  if (
    cash > 10000
  ) {
    score += 10;
  }

  if (
    netWorth > 0
  ) {
    score += 10;
  }

  if (
    cashFlow > 0
  ) {
    score += 10;
  }

  if (
    cashFlow > 10000
  ) {
    score += 5;
  }

  if (
    debtRatio > 50
  ) {
    score -= 15;
  }

  if (
    debtRatio > 75
  ) {
    score -= 15;
  }

  if (
    cash < 0
  ) {
    score -= 25;
  }

  score =
    Math.max(
      0,
      Math.min(
        100,
        score
      )
    );

  let status =
    "stable";

  if (
    score >= 85
  ) {
    status =
      "excellent";
  } else if (
    score >= 70
  ) {
    status =
      "good";
  } else if (
    score >= 50
  ) {
    status =
      "stable";
  } else if (
    score >= 30
  ) {
    status =
      "warning";
  } else {
    status =
      "critical";
  }

  return {
    score,
    status,

    cash,

    netWorth,

    cashFlow,

    debtRatio,

    bankrupt:
      cash <=
      FINANCIAL_ENGINE_CONFIG
        .bankruptcyThreshold
  };
}

// ============================================================
// ALERTAS
// ============================================================

export function getFinancialWarnings(
  database
) {
  const summary =
    getFinancialSummary(
      database
    );

  const warnings = [];

  if (
    summary.cash <=
    FINANCIAL_ENGINE_CONFIG
      .bankruptcyThreshold
  ) {
    warnings.push({
      type:
        "bankruptcy",
      severity:
        "critical",
      message:
        "O personagem está em situação de falência."
    });
  } else if (
    summary.cash <=
    FINANCIAL_ENGINE_CONFIG
      .warningThreshold
  ) {
    warnings.push({
      type:
        "low_cash",
      severity:
        "warning",
      message:
        "O saldo disponível está baixo."
    });
  }

  if (
    summary.cashFlow < 0
  ) {
    warnings.push({
      type:
        "negative_cashflow",
      severity:
        "warning",
      message:
        "As despesas estão superiores às receitas."
    });
  }

  if (
    summary.debtRatio >=
    FINANCIAL_ENGINE_CONFIG
      .debtWarningRatio
  ) {
    warnings.push({
      type:
        "high_debt",
      severity:
        "warning",
      message:
        "O nível de endividamento está elevado."
    });
  }

  if (
    summary.netWorth < 0
  ) {
    warnings.push({
      type:
        "negative_networth",
      severity:
        "critical",
      message:
        "O patrimônio líquido está negativo."
    });
  }

  return warnings;
}

// ============================================================
// HISTÓRICO
// ============================================================

export function getFinancialSnapshots(
  database
) {
  const engine =
    ensureFinancialEngine(
      database
    );

  return clone(
    engine?.snapshots || []
  );
}

export function getLatestFinancialSnapshot(
  database
) {
  const snapshots =
    getFinancialSnapshots(
      database
    );

  if (
    snapshots.length ===
    0
  ) {
    return null;
  }

  return snapshots[
    snapshots.length - 1
  ];
}

// ============================================================
// COMPARAÇÃO
// ============================================================

export function compareFinancialSnapshots(
  older,
  newer
) {
  if (
    !older ||
    !newer
  ) {
    return null;
  }

  return {
    cash:
      integer(
        newer.cash,
        0
      ) -
      integer(
        older.cash,
        0
      ),

    assets:
      integer(
        newer.assets,
        0
      ) -
      integer(
        older.assets,
        0
      ),

    liabilities:
      integer(
        newer.liabilities,
        0
      ) -
      integer(
        older.liabilities,
        0
      ),

    netWorth:
      integer(
        newer.netWorth,
        0
      ) -
      integer(
        older.netWorth,
        0
      ),

    income:
      integer(
        newer.income,
        0
      ) -
      integer(
        older.income,
        0
      ),

    expenses:
      integer(
        newer.expenses,
        0
      ) -
      integer(
        older.expenses,
        0
      ),

    cashFlow:
      integer(
        newer.cashFlow,
        0
      ) -
      integer(
        older.cashFlow,
        0
      )
  };
}

// ============================================================
// CATEGORIAS
// ============================================================

export function getIncomeBreakdown(
  database,
  options = {}
) {
  const transactions =
    getTransactions(
      database,
      {
        ...options,
        direction:
          "income"
      }
    );

  const breakdown = {};

  for (
    const transaction of
      transactions
  ) {
    const category =
      transaction.category ||
      "other";

    breakdown[category] =
      number(
        breakdown[category],
        0
      ) +
      number(
        transaction.amount,
        0
      );
  }

  return breakdown;
}

export function getExpenseBreakdown(
  database,
  options = {}
) {
  const transactions =
    getTransactions(
      database,
      {
        ...options,
        direction:
          "expense"
      }
    );

  const breakdown = {};

  for (
    const transaction of
      transactions
  ) {
    const category =
      transaction.category ||
      "other";

    breakdown[category] =
      number(
        breakdown[category],
        0
      ) +
      number(
        transaction.amount,
        0
      );
  }

  return breakdown;
}

// ============================================================
// RELATÓRIO FINANCEIRO
// ============================================================

export function generateFinancialReport(
  database,
  options = {}
) {
  const summary =
    getFinancialSummary(
      database
    );

  const flow =
    getFinancialCashFlow(
      database,
      options
    );

  return {
    generatedAt:
      isoDate(
        options.date
      ),

    period: {
      startDate:
        options.startDate ||
        null,

      endDate:
        options.endDate ||
        null
    },

    summary,

    periodCashFlow:
      flow,

    incomeBreakdown:
      getIncomeBreakdown(
        database,
        options
      ),

    expenseBreakdown:
      getExpenseBreakdown(
        database,
        options
      ),

    health:
      getFinancialHealth(
        database
      ),

    warnings:
      getFinancialWarnings(
        database
      ),

    wealth:
      getWealthSummary(
        database
      )
  };
}

// ============================================================
// VALIDAÇÃO
// ============================================================

export function validateFinancialEngine(
  database
) {
  const engine =
    ensureFinancialEngine(
      database
    );

  const errors = [];

  if (!engine) {
    errors.push(
      "Financial engine não inicializado."
    );

    return {
      valid: false,
      errors
    };
  }

  if (
    !Array.isArray(
      engine.transactions
    )
  ) {
    errors.push(
      "transactions deve ser um array."
    );
  }

  if (
    !Array.isArray(
      engine.snapshots
    )
  ) {
    errors.push(
      "snapshots deve ser um array."
    );
  }

  for (
    const transaction of
      engine.transactions
  ) {
    if (
      !transaction.id
    ) {
      errors.push(
        "Transação sem ID."
      );
    }

    if (
      !Number.isFinite(
        Number(
          transaction.amount
        )
      )
    ) {
      errors.push(
        `Transação ${transaction.id || "unknown"} possui valor inválido.`
      );
    }

    if (
      ![
        "income",
        "expense"
      ].includes(
        transaction.direction
      )
    ) {
      errors.push(
        `Transação ${transaction.id || "unknown"} possui direção inválida.`
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
// SNAPSHOT COMPLETO
// ============================================================

export function snapshotFinancialEngine(
  database
) {
  const engine =
    ensureFinancialEngine(
      database
    );

  return clone(
    engine
  );
}

// ============================================================
// RESET
// ============================================================

export function resetFinancialEngine(
  database
) {
  if (!database) {
    return false;
  }

  database.financialEngine = {
    transactions: [],
    snapshots: [],
    lastSnapshotAt:
      null,

    statistics: {
      transactions: 0,
      income: 0,
      expenses: 0,
      netCashFlow: 0,
      highestNetWorth: 0,
      lowestNetWorth: 0
    }
  };

  return true;
}

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default {
  FINANCIAL_ENGINE_VERSION,

  FINANCIAL_ENGINE_CONFIG,

  ensureFinancialEngine,

  setCash,
  addCash,
  subtractCash,

  registerFinancialTransaction,

  getTransactions,
  getFinancialIncome,
  getFinancialExpenses,
  getFinancialCashFlow,

  processIncome,
  processExpense,
  processDebtPayment,

  processSalary,
  processFightPurse,
  processWinBonus,
  processSponsorship,
  processEndorsement,
  processPPV,
  processInvestmentIncome,
  processInheritance,
  processGift,

  investCash,

  getFinancialSummary,

  updateFinancialStatistics,

  createFinancialSnapshot,
  recordFinancialSnapshot,

  shouldCreateSnapshot,
  processAutomaticSnapshot,

  getFinancialHealth,
  getFinancialWarnings,

  getFinancialSnapshots,
  getLatestFinancialSnapshot,

  compareFinancialSnapshots,

  getIncomeBreakdown,
  getExpenseBreakdown,

  generateFinancialReport,

  validateFinancialEngine,

  snapshotFinancialEngine,

  resetFinancialEngine
};
