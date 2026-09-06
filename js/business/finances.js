/* ============================================================
   MMA LIFE DYNASTY
   BUSINESS — FINANCES
   ============================================================

   Sistema financeiro do lutador:
   - Saldo
   - Receitas
   - Despesas
   - Bolsas de luta
   - Bônus
   - Patrocínios
   - Comissão de manager
   - Treinamento
   - Camp
   - Viagens
   - Compras
   - Patrimônio
   - Ativos
   - Passivos
   - Patrimônio líquido
   - Histórico financeiro
   - Fluxo de caixa
   - Relatórios
   - Preparação para herança / Dynasty

   Arquivo independente.
   ============================================================ */

const FINANCES_VERSION = 1;

// ============================================================
// TIPOS DE TRANSAÇÃO
// ============================================================

const TRANSACTION_TYPES = Object.freeze({
    FIGHT_PURSE: "fight_purse",
    WIN_BONUS: "win_bonus",
    PERFORMANCE_BONUS: "performance_bonus",
    KNOCKOUT_BONUS: "knockout_bonus",
    SUBMISSION_BONUS: "submission_bonus",
    TITLE_BONUS: "title_bonus",
    TOURNAMENT_BONUS: "tournament_bonus",

    SPONSORSHIP: "sponsorship",
    SPONSOR_BONUS: "sponsor_bonus",
    ENDORSEMENT: "endorsement",
    MEDIA: "media",

    MANAGER_COMMISSION: "manager_commission",

    TRAINING: "training",
    CAMP: "camp",
    GYM: "gym",
    COACH: "coach",
    MEDICAL: "medical",
    PHYSIO: "physio",
    RECOVERY: "recovery",
    TRAVEL: "travel",
    FOOD: "food",
    HOUSING: "housing",

    VEHICLE: "vehicle",
    PROPERTY: "property",
    EQUIPMENT: "equipment",
    EDUCATION: "education",

    FAMILY: "family",
    CHILDREN: "children",
    LIFESTYLE: "lifestyle",
    ENTERTAINMENT: "entertainment",

    TAX: "tax",
    LEGAL: "legal",
    INSURANCE: "insurance",

    INVESTMENT: "investment",
    INVESTMENT_RETURN: "investment_return",

    DEBT: "debt",
    DEBT_PAYMENT: "debt_payment",

    GIFT: "gift",
    INHERITANCE: "inheritance",

    OTHER_INCOME: "other_income",
    OTHER_EXPENSE: "other_expense"
});

// ============================================================
// CATEGORIAS
// ============================================================

const FINANCE_CATEGORIES = Object.freeze({
    COMBAT: "combat",
    SPONSORSHIP: "sponsorship",
    MANAGEMENT: "management",
    TRAINING: "training",
    HEALTH: "health",
    TRAVEL: "travel",
    LIFESTYLE: "lifestyle",
    FAMILY: "family",
    ASSETS: "assets",
    EDUCATION: "education",
    TAXES: "taxes",
    INVESTMENTS: "investments",
    DEBT: "debt",
    DYNASTY: "dynasty",
    OTHER: "other"
});

// ============================================================
// CONFIGURAÇÃO
// ============================================================

const FINANCE_CONFIG = Object.freeze({
    defaultCurrency: "USD",

    startingCash: 0,

    maxTransactionHistory: 5000,

    minimumTransaction: 0.01,

    defaultTaxRate: 0,

    defaultSavingsRate: 0.10,

    managerCommissionCategory:
        FINANCE_CATEGORIES.MANAGEMENT
});

// ============================================================
// TIPOS DE ATIVOS
// ============================================================

const ASSET_TYPES = Object.freeze({
    CASH: "cash",
    PROPERTY: "property",
    VEHICLE: "vehicle",
    EQUIPMENT: "equipment",
    INVESTMENT: "investment",
    BUSINESS: "business",
    OTHER: "other"
});

// ============================================================
// TIPOS DE PASSIVOS
// ============================================================

const LIABILITY_TYPES = Object.freeze({
    LOAN: "loan",
    MORTGAGE: "mortgage",
    CREDIT: "credit",
    DEBT: "debt",
    OTHER: "other"
});

// ============================================================
// UTILITÁRIOS
// ============================================================

function safeNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}

function clamp(value, min, max) {
    return Math.max(
        min,
        Math.min(max, value)
    );
}

function normalizeText(
    value,
    fallback = ""
) {
    if (
        value === null ||
        value === undefined
    ) {
        return fallback;
    }

    return String(value).trim();
}

function generateId(prefix = "id") {
    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 10)}`;
}

function deepClone(value) {
    return JSON.parse(
        JSON.stringify(value)
    );
}

// ============================================================
// CRIAÇÃO DA ESTRUTURA FINANCEIRA
// ============================================================

function createFinancialState(
    data = {}
) {
    return {
        version: FINANCES_VERSION,

        currency:
            data.currency ||
            FINANCE_CONFIG.defaultCurrency,

        cash:
            Math.max(
                0,
                safeNumber(
                    data.cash,
                    FINANCE_CONFIG.startingCash
                )
            ),

        totalIncome:
            Math.max(
                0,
                safeNumber(
                    data.totalIncome,
                    0
                )
            ),

        totalExpenses:
            Math.max(
                0,
                safeNumber(
                    data.totalExpenses,
                    0
                )
            ),

        careerEarnings:
            Math.max(
                0,
                safeNumber(
                    data.careerEarnings,
                    0
                )
            ),

        careerExpenses:
            Math.max(
                0,
                safeNumber(
                    data.careerExpenses,
                    0
                )
            ),

        assets:
            Array.isArray(data.assets)
                ? deepClone(data.assets)
                : [],

        liabilities:
            Array.isArray(data.liabilities)
                ? deepClone(data.liabilities)
                : [],

        transactions:
            Array.isArray(data.transactions)
                ? deepClone(
                    data.transactions
                )
                : [],

        incomeByCategory:
            data.incomeByCategory
                ? deepClone(
                    data.incomeByCategory
                )
                : {},

        expensesByCategory:
            data.expensesByCategory
                ? deepClone(
                    data.expensesByCategory
                )
                : {},

        monthly:
            data.monthly
                ? deepClone(data.monthly)
                : {},

        yearly:
            data.yearly
                ? deepClone(data.yearly)
                : {},

        statistics: {
            fightsPaid:
                safeNumber(
                    data.statistics?.fightsPaid,
                    0
                ),

            sponsorshipPayments:
                safeNumber(
                    data.statistics?.sponsorshipPayments,
                    0
                ),

            managerCommissions:
                safeNumber(
                    data.statistics?.managerCommissions,
                    0
                ),

            purchases:
                safeNumber(
                    data.statistics?.purchases,
                    0
                ),

            investments:
                safeNumber(
                    data.statistics?.investments,
                    0
                ),

            investmentReturns:
                safeNumber(
                    data.statistics?.investmentReturns,
                    0
                )
        }
    };
}

// ============================================================
// TRANSAÇÃO
// ============================================================

function createTransaction(
    data = {}
) {
    const amount =
        Math.abs(
            safeNumber(
                data.amount,
                0
            )
        );

    const direction =
        data.direction === "expense" ||
        data.direction === "out"
            ? "expense"
            : "income";

    return {
        id:
            data.id ||
            generateId("transaction"),

        type:
            data.type ||
            (
                direction === "income"
                    ? TRANSACTION_TYPES.OTHER_INCOME
                    : TRANSACTION_TYPES.OTHER_EXPENSE
            ),

        category:
            data.category ||
            FINANCE_CATEGORIES.OTHER,

        direction,

        amount,

        currency:
            data.currency ||
            FINANCE_CONFIG.defaultCurrency,

        description:
            normalizeText(
                data.description,
                ""
            ),

        date:
            data.date ||
            new Date().toISOString(),

        balanceBefore:
            safeNumber(
                data.balanceBefore,
                0
            ),

        balanceAfter:
            safeNumber(
                data.balanceAfter,
                0
            ),

        referenceId:
            data.referenceId ||
            null,

        fightId:
            data.fightId ||
            null,

        contractId:
            data.contractId ||
            null,

        sponsorId:
            data.sponsorId ||
            null,

        managerId:
            data.managerId ||
            null,

        assetId:
            data.assetId ||
            null,

        metadata:
            data.metadata
                ? deepClone(
                    data.metadata
                )
                : {}
    };
}

// ============================================================
// REGISTRAR TRANSAÇÃO
// ============================================================

function recordTransaction(
    finances,
    data = {}
) {
    if (!finances) {
        return null;
    }

    const amount =
        Math.abs(
            safeNumber(
                data.amount,
                0
            )
        );

    if (
        amount <
        FINANCE_CONFIG.minimumTransaction
    ) {
        return null;
    }

    if (!Array.isArray(finances.transactions)) {
        finances.transactions = [];
    }

    const direction =
        data.direction === "expense" ||
        data.direction === "out"
            ? "expense"
            : "income";

    const balanceBefore =
        safeNumber(
            finances.cash,
            0
        );

    let balanceAfter;

    if (direction === "income") {
        balanceAfter =
            balanceBefore + amount;
    } else {
        balanceAfter =
            balanceBefore - amount;
    }

    const transaction =
        createTransaction({
            ...data,

            direction,

            amount,

            balanceBefore,

            balanceAfter
        });

    finances.cash =
        balanceAfter;

    if (direction === "income") {
        finances.totalIncome +=
            amount;

        finances.careerEarnings +=
            amount;

        const category =
            data.category ||
            FINANCE_CATEGORIES.OTHER;

        finances.incomeByCategory[
            category
        ] =
            safeNumber(
                finances.incomeByCategory[
                    category
                ],
                0
            ) + amount;

    } else {
        finances.totalExpenses +=
            amount;

        finances.careerExpenses +=
            amount;

        const category =
            data.category ||
            FINANCE_CATEGORIES.OTHER;

        finances.expensesByCategory[
            category
        ] =
            safeNumber(
                finances.expensesByCategory[
                    category
                ],
                0
            ) + amount;
    }

    finances.transactions.push(
        transaction
    );

    if (
        finances.transactions.length >
        FINANCE_CONFIG.maxTransactionHistory
    ) {
        finances.transactions =
            finances.transactions.slice(
                -FINANCE_CONFIG.maxTransactionHistory
            );
    }

    updateFinancialPeriodTotals(
        finances,
        transaction
    );

    return transaction;
}

// ============================================================
// RECEITA
// ============================================================

function addIncome(
    finances,
    amount,
    data = {}
) {
    return recordTransaction(
        finances,
        {
            ...data,

            amount,

            direction: "income"
        }
    );
}

// ============================================================
// DESPESA
// ============================================================

function addExpense(
    finances,
    amount,
    data = {}
) {
    return recordTransaction(
        finances,
        {
            ...data,

            amount,

            direction: "expense"
        }
    );
}

// ============================================================
// BOLSA DE LUTA
// ============================================================

function recordFightPurse(
    finances,
    amount,
    fightId = null,
    description = "Bolsa de luta"
) {
    if (!finances) {
        return null;
    }

    finances.statistics.fightsPaid++;

    return addIncome(
        finances,
        amount,
        {
            type:
                TRANSACTION_TYPES.FIGHT_PURSE,

            category:
                FINANCE_CATEGORIES.COMBAT,

            description,

            fightId
        }
    );
}

// ============================================================
// BÔNUS DE VITÓRIA
// ============================================================

function recordWinBonus(
    finances,
    amount,
    fightId = null
) {
    return addIncome(
        finances,
        amount,
        {
            type:
                TRANSACTION_TYPES.WIN_BONUS,

            category:
                FINANCE_CATEGORIES.COMBAT,

            description:
                "Bônus de vitória",

            fightId
        }
    );
}

// ============================================================
// BÔNUS DE PERFORMANCE
// ============================================================

function recordPerformanceBonus(
    finances,
    amount,
    fightId = null
) {
    return addIncome(
        finances,
        amount,
        {
            type:
                TRANSACTION_TYPES.PERFORMANCE_BONUS,

            category:
                FINANCE_CATEGORIES.COMBAT,

            description:
                "Bônus de performance",

            fightId
        }
    );
}

// ============================================================
// BÔNUS DE TÍTULO
// ============================================================

function recordTitleBonus(
    finances,
    amount,
    fightId = null
) {
    return addIncome(
        finances,
        amount,
        {
            type:
                TRANSACTION_TYPES.TITLE_BONUS,

            category:
                FINANCE_CATEGORIES.COMBAT,

            description:
                "Bônus de título",

            fightId
        }
    );
}

// ============================================================
// PATROCÍNIO
// ============================================================

function recordSponsorshipPayment(
    finances,
    amount,
    sponsorId = null,
    contractId = null,
    description =
        "Pagamento de patrocínio"
) {
    if (!finances) {
        return null;
    }

    finances.statistics.sponsorshipPayments++;

    return addIncome(
        finances,
        amount,
        {
            type:
                TRANSACTION_TYPES.SPONSORSHIP,

            category:
                FINANCE_CATEGORIES.SPONSORSHIP,

            description,

            sponsorId,

            contractId
        }
    );
}

// ============================================================
// ENDORSEMENT / PUBLICIDADE
// ============================================================

function recordEndorsementIncome(
    finances,
    amount,
    description =
        "Contrato publicitário"
) {
    return addIncome(
        finances,
        amount,
        {
            type:
                TRANSACTION_TYPES.ENDORSEMENT,

            category:
                FINANCE_CATEGORIES.SPONSORSHIP,

            description
        }
    );
}

// ============================================================
// COMISSÃO DO MANAGER
// ============================================================

function recordManagerCommission(
    finances,
    amount,
    managerId = null,
    referenceId = null
) {
    if (!finances) {
        return null;
    }

    finances.statistics.managerCommissions++;

    return addExpense(
        finances,
        amount,
        {
            type:
                TRANSACTION_TYPES.MANAGER_COMMISSION,

            category:
                FINANCE_CATEGORIES.MANAGEMENT,

            description:
                "Comissão do manager",

            managerId,

            referenceId
        }
    );
}

// ============================================================
// CUSTOS DE TREINAMENTO
// ============================================================

function recordTrainingExpense(
    finances,
    amount,
    description =
        "Treinamento"
) {
    return addExpense(
        finances,
        amount,
        {
            type:
                TRANSACTION_TYPES.TRAINING,

            category:
                FINANCE_CATEGORIES.TRAINING,

            description
        }
    );
}

// ============================================================
// CUSTO DE CAMP
// ============================================================

function recordCampExpense(
    finances,
    amount,
    description =
        "Camp de treinamento"
) {
    return addExpense(
        finances,
        amount,
        {
            type:
                TRANSACTION_TYPES.CAMP,

            category:
                FINANCE_CATEGORIES.TRAINING,

            description
        }
    );
}

// ============================================================
// CUSTO MÉDICO
// ============================================================

function recordMedicalExpense(
    finances,
    amount,
    description =
        "Despesa médica"
) {
    return addExpense(
        finances,
        amount,
        {
            type:
                TRANSACTION_TYPES.MEDICAL,

            category:
                FINANCE_CATEGORIES.HEALTH,

            description
        }
    );
}

// ============================================================
// VIAGEM
// ============================================================

function recordTravelExpense(
    finances,
    amount,
    description =
        "Viagem"
) {
    return addExpense(
        finances,
        amount,
        {
            type:
                TRANSACTION_TYPES.TRAVEL,

            category:
                FINANCE_CATEGORIES.TRAVEL,

            description
        }
    );
}

// ============================================================
// COMPRA DE ATIVO
// ============================================================

function purchaseAsset(
    finances,
    data = {}
) {
    if (!finances) {
        return {
            success: false,
            reason:
                "Estado financeiro inválido."
        };
    }

    const price =
        Math.max(
            0,
            safeNumber(
                data.price,
                0
            )
        );

    if (price <= 0) {
        return {
            success: false,
            reason:
                "Preço inválido."
        };
    }

    if (
        finances.cash <
        price
    ) {
        return {
            success: false,
            reason:
                "Saldo insuficiente."
        };
    }

    const asset = {
        id:
            data.id ||
            generateId("asset"),

        type:
            data.type ||
            ASSET_TYPES.OTHER,

        name:
            normalizeText(
                data.name,
                "Ativo"
            ),

        description:
            normalizeText(
                data.description,
                ""
            ),

        purchasePrice:
            price,

        currentValue:
            Math.max(
                0,
                safeNumber(
                    data.currentValue,
                    price
                )
            ),

        purchaseDate:
            data.purchaseDate ||
            new Date().toISOString(),

        country:
            data.country ||
            null,

        city:
            data.city ||
            null,

        metadata:
            data.metadata
                ? deepClone(
                    data.metadata
                )
                : {}
    };

    const transaction =
        addExpense(
            finances,
            price,
            {
                type:
                    asset.type ===
                    ASSET_TYPES.PROPERTY
                        ? TRANSACTION_TYPES.PROPERTY
                        : asset.type ===
                          ASSET_TYPES.VEHICLE
                            ? TRANSACTION_TYPES.VEHICLE
                            : TRANSACTION_TYPES.OTHER_EXPENSE,

                category:
                    FINANCE_CATEGORIES.ASSETS,

                description:
                    `Compra: ${asset.name}`,

                assetId:
                    asset.id
            }
        );

    if (!transaction) {
        return {
            success: false,
            reason:
                "Não foi possível registrar a compra."
        };
    }

    finances.assets.push(
        asset
    );

    finances.statistics.purchases++;

    return {
        success: true,

        asset,

        transaction
    };
}

// ============================================================
// VENDA DE ATIVO
// ============================================================

function sellAsset(
    finances,
    assetId,
    salePrice,
    description = "Venda de ativo"
) {
    if (!finances) {
        return {
            success: false,
            reason:
                "Estado financeiro inválido."
        };
    }

    const index =
        finances.assets.findIndex(
            asset =>
                asset.id === assetId
        );

    if (index < 0) {
        return {
            success: false,
            reason:
                "Ativo não encontrado."
        };
    }

    const asset =
        finances.assets[index];

    const amount =
        Math.max(
            0,
            safeNumber(
                salePrice,
                0
            )
        );

    if (amount <= 0) {
        return {
            success: false,
            reason:
                "Valor de venda inválido."
        };
    }

    const transaction =
        addIncome(
            finances,
            amount,
            {
                type:
                    asset.type ===
                    ASSET_TYPES.PROPERTY
                        ? TRANSACTION_TYPES.PROPERTY
                        : asset.type ===
                          ASSET_TYPES.VEHICLE
                            ? TRANSACTION_TYPES.VEHICLE
                            : TRANSACTION_TYPES.OTHER_INCOME,

                category:
                    FINANCE_CATEGORIES.ASSETS,

                description,

                assetId
            }
        );

    finances.assets.splice(
        index,
        1
    );

    return {
        success: true,

        asset,

        salePrice: amount,

        transaction
    };
}

// ============================================================
// ATUALIZAR VALOR DO ATIVO
// ============================================================

function updateAssetValue(
    finances,
    assetId,
    newValue
) {
    if (!finances?.assets) {
        return false;
    }

    const asset =
        finances.assets.find(
            item =>
                item.id === assetId
        );

    if (!asset) {
        return false;
    }

    asset.currentValue =
        Math.max(
            0,
            safeNumber(
                newValue,
                asset.currentValue
            )
        );

    return true;
}

// ============================================================
// PASSIVOS / DÍVIDAS
// ============================================================

function addLiability(
    finances,
    data = {}
) {
    if (!finances) {
        return null;
    }

    const liability = {
        id:
            data.id ||
            generateId("liability"),

        type:
            data.type ||
            LIABILITY_TYPES.DEBT,

        name:
            normalizeText(
                data.name,
                "Dívida"
            ),

        originalAmount:
            Math.max(
                0,
                safeNumber(
                    data.originalAmount,
                    0
                )
            ),

        remainingAmount:
            Math.max(
                0,
                safeNumber(
                    data.remainingAmount,
                    data.originalAmount
                )
            ),

        interestRate:
            Math.max(
                0,
                safeNumber(
                    data.interestRate,
                    0
                )
            ),

        monthlyPayment:
            Math.max(
                0,
                safeNumber(
                    data.monthlyPayment,
                    0
                )
            ),

        createdAt:
            data.createdAt ||
            new Date().toISOString(),

        dueDate:
            data.dueDate ||
            null,

        metadata:
            data.metadata
                ? deepClone(
                    data.metadata
                )
                : {}
    };

    finances.liabilities.push(
        liability
    );

    return liability;
}

// ============================================================
// PAGAR DÍVIDA
// ============================================================

function payLiability(
    finances,
    liabilityId,
    amount
) {
    if (!finances) {
        return {
            success: false,
            reason:
                "Estado financeiro inválido."
        };
    }

    const liability =
        finances.liabilities.find(
            item =>
                item.id ===
                liabilityId
        );

    if (!liability) {
        return {
            success: false,
            reason:
                "Dívida não encontrada."
        };
    }

    const requested =
        Math.max(
            0,
            safeNumber(
                amount,
                0
            )
        );

    const payment =
        Math.min(
            requested,
            liability.remainingAmount
        );

    if (
        payment <= 0
    ) {
        return {
            success: false,
            reason:
                "Valor de pagamento inválido."
        };
    }

    if (
        finances.cash <
        payment
    ) {
        return {
            success: false,
            reason:
                "Saldo insuficiente."
        };
    }

    const transaction =
        addExpense(
            finances,
            payment,
            {
                type:
                    TRANSACTION_TYPES.DEBT_PAYMENT,

                category:
                    FINANCE_CATEGORIES.DEBT,

                description:
                    `Pagamento: ${liability.name}`,

                referenceId:
                    liability.id
            }
        );

    liability.remainingAmount =
        Math.max(
            0,
            liability.remainingAmount -
            payment
        );

    return {
        success: true,

        amount: payment,

        remainingDebt:
            liability.remainingAmount,

        transaction
    };
}

// ============================================================
// INVESTIMENTOS
// ============================================================

function makeInvestment(
    finances,
    data = {}
) {
    if (!finances) {
        return {
            success: false,
            reason:
                "Estado financeiro inválido."
        };
    }

    const amount =
        Math.max(
            0,
            safeNumber(
                data.amount,
                0
            )
        );

    if (amount <= 0) {
        return {
            success: false,
            reason:
                "Valor de investimento inválido."
        };
    }

    if (
        finances.cash <
        amount
    ) {
        return {
            success: false,
            reason:
                "Saldo insuficiente."
        };
    }

    const asset = {
        id:
            data.id ||
            generateId("investment"),

        type:
            ASSET_TYPES.INVESTMENT,

        name:
            normalizeText(
                data.name,
                "Investimento"
            ),

        purchasePrice:
            amount,

        currentValue:
            amount,

        purchaseDate:
            data.purchaseDate ||
            new Date().toISOString(),

        expectedReturn:
            safeNumber(
                data.expectedReturn,
                0
            ),

        maturityDate:
            data.maturityDate ||
            null,

        metadata:
            data.metadata
                ? deepClone(
                    data.metadata
                )
                : {}
    };

    const transaction =
        addExpense(
            finances,
            amount,
            {
                type:
                    TRANSACTION_TYPES.INVESTMENT,

                category:
                    FINANCE_CATEGORIES.INVESTMENTS,

                description:
                    `Investimento: ${asset.name}`,

                assetId:
                    asset.id
            }
        );

    if (!transaction) {
        return {
            success: false,
            reason:
                "Falha ao registrar investimento."
        };
    }

    finances.assets.push(
        asset
    );

    finances.statistics.investments++;

    return {
        success: true,

        investment:
            asset,

        transaction
    };
}

// ============================================================
// RETORNO DE INVESTIMENTO
// ============================================================

function recordInvestmentReturn(
    finances,
    amount,
    investmentId = null
) {
    if (!finances) {
        return null;
    }

    finances.statistics.investmentReturns++;

    if (investmentId) {
        const investment =
            finances.assets.find(
                asset =>
                    asset.id ===
                    investmentId
            );

        if (investment) {
            investment.currentValue +=
                Math.max(
                    0,
                    safeNumber(
                        amount,
                        0
                    )
                );
        }
    }

    return addIncome(
        finances,
        amount,
        {
            type:
                TRANSACTION_TYPES.INVESTMENT_RETURN,

            category:
                FINANCE_CATEGORIES.INVESTMENTS,

            description:
                "Retorno de investimento",

            assetId:
                investmentId
        }
    );
}

// ============================================================
// HERANÇA
// ============================================================

function recordInheritance(
    finances,
    amount,
    source = null
) {
    return addIncome(
        finances,
        amount,
        {
            type:
                TRANSACTION_TYPES.INHERITANCE,

            category:
                FINANCE_CATEGORIES.DYNASTY,

            description:
                source
                    ? `Herança recebida de ${source}`
                    : "Herança recebida"
        }
    );
}

// ============================================================
// IMPOSTOS
// ============================================================

function calculateTaxes(
    finances,
    rate = FINANCE_CONFIG.defaultTaxRate
) {
    const income =
        Math.max(
            0,
            safeNumber(
                finances?.totalIncome,
                0
            )
        );

    const taxRate =
        clamp(
            safeNumber(rate, 0),
            0,
            1
        );

    return income * taxRate;
}

function recordTaxPayment(
    finances,
    amount,
    description =
        "Pagamento de impostos"
) {
    return addExpense(
        finances,
        amount,
        {
            type:
                TRANSACTION_TYPES.TAX,

            category:
                FINANCE_CATEGORIES.TAXES,

            description
        }
    );
}

// ============================================================
// FLUXO DE CAIXA POR PERÍODO
// ============================================================

function getTransactionsByPeriod(
    finances,
    startDate,
    endDate
) {
    if (!finances?.transactions) {
        return [];
    }

    const start =
        startDate
            ? new Date(startDate)
            : null;

    const end =
        endDate
            ? new Date(endDate)
            : null;

    return finances.transactions.filter(
        transaction => {
            const date =
                new Date(
                    transaction.date
                );

            if (
                start &&
                date < start
            ) {
                return false;
            }

            if (
                end &&
                date > end
            ) {
                return false;
            }

            return true;
        }
    );
}

function calculateCashFlow(
    finances,
    startDate = null,
    endDate = null
) {
    const transactions =
        getTransactionsByPeriod(
            finances,
            startDate,
            endDate
        );

    let income = 0;
    let expenses = 0;

    for (
        const transaction of
        transactions
    ) {
        if (
            transaction.direction ===
            "income"
        ) {
            income +=
                transaction.amount;
        } else {
            expenses +=
                transaction.amount;
        }
    }

    return {
        income,

        expenses,

        net:
            income -
            expenses,

        transactions:
            transactions.length
    };
}

// ============================================================
// PERÍODOS
// ============================================================

function getPeriodKey(
    date
) {
    const d =
        date instanceof Date
            ? date
            : new Date(date);

    const year =
        d.getUTCFullYear();

    const month =
        String(
            d.getUTCMonth() + 1
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}`;
}

function getYearKey(
    date
) {
    const d =
        date instanceof Date
            ? date
            : new Date(date);

    return String(
        d.getUTCFullYear()
    );
}

function updateFinancialPeriodTotals(
    finances,
    transaction
) {
    if (!finances || !transaction) {
        return;
    }

    const date =
        new Date(
            transaction.date
        );

    const monthKey =
        getPeriodKey(date);

    const yearKey =
        getYearKey(date);

    if (!finances.monthly[monthKey]) {
        finances.monthly[monthKey] = {
            income: 0,
            expenses: 0,
            net: 0
        };
    }

    if (!finances.yearly[yearKey]) {
        finances.yearly[yearKey] = {
            income: 0,
            expenses: 0,
            net: 0
        };
    }

    const monthly =
        finances.monthly[monthKey];

    const yearly =
        finances.yearly[yearKey];

    if (
        transaction.direction ===
        "income"
    ) {
        monthly.income +=
            transaction.amount;

        yearly.income +=
            transaction.amount;
    } else {
        monthly.expenses +=
            transaction.amount;

        yearly.expenses +=
            transaction.amount;
    }

    monthly.net =
        monthly.income -
        monthly.expenses;

    yearly.net =
        yearly.income -
        yearly.expenses;
}

// ============================================================
// PATRIMÔNIO
// ============================================================

function calculateAssetValue(
    finances
) {
    if (!finances?.assets) {
        return 0;
    }

    return finances.assets.reduce(
        (total, asset) =>
            total +
            Math.max(
                0,
                safeNumber(
                    asset.currentValue,
                    0
                )
            ),
        0
    );
}

function calculateLiabilityValue(
    finances
) {
    if (!finances?.liabilities) {
        return 0;
    }

    return finances.liabilities.reduce(
        (total, liability) =>
            total +
            Math.max(
                0,
                safeNumber(
                    liability.remainingAmount,
                    0
                )
            ),
        0
    );
}

function calculateTotalAssets(
    finances
) {
    return (
        Math.max(
            0,
            safeNumber(
                finances?.cash,
                0
            )
        ) +
        calculateAssetValue(
            finances
        )
    );
}

function calculateNetWorth(
    finances
) {
    return (
        calculateTotalAssets(
            finances
        ) -
        calculateLiabilityValue(
            finances
        )
    );
}

// ============================================================
// RESUMO FINANCEIRO
// ============================================================

function getFinancialSummary(
    finances
) {
    if (!finances) {
        return null;
    }

    return {
        currency:
            finances.currency,

        cash:
            safeNumber(
                finances.cash
            ),

        totalIncome:
            safeNumber(
                finances.totalIncome
            ),

        totalExpenses:
            safeNumber(
                finances.totalExpenses
            ),

        netCareerIncome:
            finances.totalIncome -
            finances.totalExpenses,

        careerEarnings:
            safeNumber(
                finances.careerEarnings
            ),

        careerExpenses:
            safeNumber(
                finances.careerExpenses
            ),

        assetValue:
            calculateAssetValue(
                finances
            ),

        liabilities:
            calculateLiabilityValue(
                finances
            ),

        totalAssets:
            calculateTotalAssets(
                finances
            ),

        netWorth:
            calculateNetWorth(
                finances
            ),

        transactionCount:
            Array.isArray(
                finances.transactions
            )
                ? finances.transactions.length
                : 0
    };
}

// ============================================================
// RELATÓRIO DE CARREIRA
// ============================================================

function getCareerFinancialReport(
    finances
) {
    if (!finances) {
        return null;
    }

    const categories = {};

    for (
        const transaction of
        finances.transactions || []
    ) {
        const category =
            transaction.category ||
            FINANCE_CATEGORIES.OTHER;

        if (!categories[category]) {
            categories[category] = {
                income: 0,
                expenses: 0,
                net: 0
            };
        }

        if (
            transaction.direction ===
            "income"
        ) {
            categories[category].income +=
                transaction.amount;
        } else {
            categories[category].expenses +=
                transaction.amount;
        }

        categories[category].net =
            categories[category].income -
            categories[category].expenses;
    }

    return {
        summary:
            getFinancialSummary(
                finances
            ),

        categories,

        incomeByCategory:
            deepClone(
                finances.incomeByCategory
            ),

        expensesByCategory:
            deepClone(
                finances.expensesByCategory
            ),

        monthly:
            deepClone(
                finances.monthly
            ),

        yearly:
            deepClone(
                finances.yearly
            )
    };
}

// ============================================================
// ÚLTIMAS TRANSAÇÕES
// ============================================================

function getRecentTransactions(
    finances,
    limit = 20
) {
    if (!finances?.transactions) {
        return [];
    }

    return finances.transactions
        .slice(
            -Math.max(
                1,
                Math.floor(
                    safeNumber(
                        limit,
                        20
                    )
                )
            )
        )
        .reverse();
}

// ============================================================
// TRANSAÇÕES POR TIPO
// ============================================================

function getTransactionsByType(
    finances,
    type
) {
    if (!finances?.transactions) {
        return [];
    }

    return finances.transactions.filter(
        transaction =>
            transaction.type ===
            type
    );
}

// ============================================================
// TRANSAÇÕES POR CATEGORIA
// ============================================================

function getTransactionsByCategory(
    finances,
    category
) {
    if (!finances?.transactions) {
        return [];
    }

    return finances.transactions.filter(
        transaction =>
            transaction.category ===
            category
    );
}

// ============================================================
// RECEITA MÉDIA
// ============================================================

function calculateAverageIncome(
    finances,
    months = 12
) {
    const monthCount =
        Math.max(
            1,
            Math.floor(
                safeNumber(
                    months,
                    12
                )
            )
        );

    return (
        safeNumber(
            finances?.totalIncome,
            0
        ) /
        monthCount
    );
}

// ============================================================
// DESPESA MÉDIA
// ============================================================

function calculateAverageExpenses(
    finances,
    months = 12
) {
    const monthCount =
        Math.max(
            1,
            Math.floor(
                safeNumber(
                    months,
                    12
                )
            )
        );

    return (
        safeNumber(
            finances?.totalExpenses,
            0
        ) /
        monthCount
    );
}

// ============================================================
// TAXA DE POUPANÇA
// ============================================================

function calculateSavingsRate(
    finances
) {
    const income =
        safeNumber(
            finances?.totalIncome,
            0
        );

    if (income <= 0) {
        return 0;
    }

    const net =
        income -
        safeNumber(
            finances?.totalExpenses,
            0
        );

    return clamp(
        net / income,
        -1,
        1
    );
}

// ============================================================
// CAPACIDADE DE COMPRA
// ============================================================

function canAfford(
    finances,
    amount
) {
    return (
        safeNumber(
            finances?.cash,
            0
        ) >=
        Math.max(
            0,
            safeNumber(
                amount,
                0
            )
        )
    );
}

// ============================================================
// TRANSFERÊNCIA ENTRE CONTAS
// ============================================================

function transferMoney(
    fromFinances,
    toFinances,
    amount,
    description =
        "Transferência"
) {
    if (
        !fromFinances ||
        !toFinances
    ) {
        return {
            success: false,
            reason:
                "Conta financeira inválida."
        };
    }

    const value =
        Math.max(
            0,
            safeNumber(
                amount,
                0
            )
        );

    if (value <= 0) {
        return {
            success: false,
            reason:
                "Valor inválido."
        };
    }

    if (
        fromFinances.cash <
        value
    ) {
        return {
            success: false,
            reason:
                "Saldo insuficiente."
        };
    }

    const outgoing =
        addExpense(
            fromFinances,
            value,
            {
                type:
                    TRANSACTION_TYPES.OTHER_EXPENSE,

                category:
                    FINANCE_CATEGORIES.OTHER,

                description
            }
        );

    const incoming =
        addIncome(
            toFinances,
            value,
            {
                type:
                    TRANSACTION_TYPES.OTHER_INCOME,

                category:
                    FINANCE_CATEGORIES.OTHER,

                description
            }
        );

    return {
        success: true,

        outgoing,

        incoming
    };
}

// ============================================================
// LIMPEZA DE HISTÓRICO
// ============================================================

function trimTransactionHistory(
    finances,
    maxTransactions =
        FINANCE_CONFIG.maxTransactionHistory
) {
    if (
        !finances ||
        !Array.isArray(
            finances.transactions
        )
    ) {
        return 0;
    }

    const max =
        Math.max(
            1,
            Math.floor(
                safeNumber(
                    maxTransactions,
                    FINANCE_CONFIG.maxTransactionHistory
                )
            )
        );

    if (
        finances.transactions.length <=
        max
    ) {
        return 0;
    }

    const removed =
        finances.transactions.length -
        max;

    finances.transactions =
        finances.transactions.slice(
            -max
        );

    return removed;
}

// ============================================================
// VALIDAÇÃO
// ============================================================

function validateFinancialState(
    finances
) {
    const errors = [];

    if (!finances) {
        return {
            valid: false,

            errors: [
                "Estado financeiro inexistente."
            ]
        };
    }

    if (
        !Number.isFinite(
            Number(finances.cash)
        )
    ) {
        errors.push(
            "Saldo inválido."
        );
    }

    if (
        !Number.isFinite(
            Number(
                finances.totalIncome
            )
        )
    ) {
        errors.push(
            "Receita total inválida."
        );
    }

    if (
        !Number.isFinite(
            Number(
                finances.totalExpenses
            )
        )
    ) {
        errors.push(
            "Despesa total inválida."
        );
    }

    if (
        !Array.isArray(
            finances.transactions
        )
    ) {
        errors.push(
            "Histórico de transações inválido."
        );
    }

    if (
        !Array.isArray(
            finances.assets
        )
    ) {
        errors.push(
            "Lista de ativos inválida."
        );
    }

    if (
        !Array.isArray(
            finances.liabilities
        )
    ) {
        errors.push(
            "Lista de passivos inválida."
        );
    }

    return {
        valid:
            errors.length === 0,

        errors
    };
}

// ============================================================
// CLONE / SNAPSHOT
// ============================================================

function cloneFinancialState(
    finances
) {
    return finances
        ? deepClone(finances)
        : null;
}

function snapshotFinances(
    finances
) {
    if (!finances) {
        return null;
    }

    return {
        version:
            FINANCES_VERSION,

        currency:
            finances.currency,

        cash:
            finances.cash,

        totalIncome:
            finances.totalIncome,

        totalExpenses:
            finances.totalExpenses,

        careerEarnings:
            finances.careerEarnings,

        careerExpenses:
            finances.careerExpenses,

        totalAssets:
            calculateTotalAssets(
                finances
            ),

        netWorth:
            calculateNetWorth(
                finances
            ),

        assetCount:
            finances.assets?.length || 0,

        liabilityCount:
            finances.liabilities?.length || 0,

        transactionCount:
            finances.transactions?.length || 0
    };
}

// ============================================================
// EXPORTS
// ============================================================

export {
    FINANCES_VERSION,

    TRANSACTION_TYPES,

    FINANCE_CATEGORIES,

    FINANCE_CONFIG,

    ASSET_TYPES,

    LIABILITY_TYPES,

    createFinancialState,

    createTransaction,

    recordTransaction,

    addIncome,
    addExpense,

    recordFightPurse,
    recordWinBonus,
    recordPerformanceBonus,
    recordTitleBonus,

    recordSponsorshipPayment,
    recordEndorsementIncome,

    recordManagerCommission,

    recordTrainingExpense,
    recordCampExpense,
    recordMedicalExpense,
    recordTravelExpense,

    purchaseAsset,
    sellAsset,
    updateAssetValue,

    addLiability,
    payLiability,

    makeInvestment,
    recordInvestmentReturn,

    recordInheritance,

    calculateTaxes,
    recordTaxPayment,

    getTransactionsByPeriod,
    calculateCashFlow,

    getPeriodKey,
    getYearKey,

    updateFinancialPeriodTotals,

    calculateAssetValue,
    calculateLiabilityValue,
    calculateTotalAssets,
    calculateNetWorth,

    getFinancialSummary,
    getCareerFinancialReport,

    getRecentTransactions,
    getTransactionsByType,
    getTransactionsByCategory,

    calculateAverageIncome,
    calculateAverageExpenses,
    calculateSavingsRate,

    canAfford,

    transferMoney,

    trimTransactionHistory,

    validateFinancialState,

    cloneFinancialState,
    snapshotFinances
};

export default {
    FINANCES_VERSION,

    TRANSACTION_TYPES,
    FINANCE_CATEGORIES,
    FINANCE_CONFIG,

    ASSET_TYPES,
    LIABILITY_TYPES,

    createFinancialState,
    createTransaction,

    recordTransaction,

    addIncome,
    addExpense,

    recordFightPurse,
    recordWinBonus,
    recordPerformanceBonus,
    recordTitleBonus,

    recordSponsorshipPayment,
    recordEndorsementIncome,

    recordManagerCommission,

    recordTrainingExpense,
    recordCampExpense,
    recordMedicalExpense,
    recordTravelExpense,

    purchaseAsset,
    sellAsset,
    updateAssetValue,

    addLiability,
    payLiability,

    makeInvestment,
    recordInvestmentReturn,

    recordInheritance,

    calculateTaxes,
    recordTaxPayment,

    getTransactionsByPeriod,
    calculateCashFlow,

    getPeriodKey,
    getYearKey,

    updateFinancialPeriodTotals,

    calculateAssetValue,
    calculateLiabilityValue,
    calculateTotalAssets,
    calculateNetWorth,

    getFinancialSummary,
    getCareerFinancialReport,

    getRecentTransactions,
    getTransactionsByType,
    getTransactionsByCategory,

    calculateAverageIncome,
    calculateAverageExpenses,
    calculateSavingsRate,

    canAfford,

    transferMoney,

    trimTransactionHistory,

    validateFinancialState,

    cloneFinancialState,
    snapshotFinances
};
