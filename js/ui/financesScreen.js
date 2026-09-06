// ============================================================
// MMA LIFE DYNASTY
// UI — FINANCES SCREEN
// Arquivo: js/ui/financesScreen.js
// ============================================================

const FINANCES_SCREEN_VERSION = 1;

const state = {
    initialized: false,
    database: null,
    activeTab: "overview",
    lastRender: null
};

// ============================================================
// UTILITÁRIOS
// ============================================================

function clone(value) {
    if (value === undefined || value === null) return value;

    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function getDatabase(database = null) {
    if (database) return database;

    if (globalThis.MMA_LIFE_DATABASE) {
        return globalThis.MMA_LIFE_DATABASE;
    }

    if (globalThis.MMA_LIFE_GAME?.getDatabase) {
        return globalThis.MMA_LIFE_GAME.getDatabase();
    }

    return state.database;
}

function getBusiness(database = null) {
    const db = getDatabase(database);

    if (!db) return {};

    if (!db.business) {
        db.business = {};
    }

    return db.business;
}

function getPlayer(database = null) {
    const db = getDatabase(database);

    return db?.player || {};
}

function safeArray(value) {
    return Array.isArray(value) ? value : [];
}

function safeObject(value) {
    return value && typeof value === "object"
        ? value
        : {};
}

function escapeHTML(value) {
    if (value === undefined || value === null) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatNumber(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return new Intl.NumberFormat("pt-BR").format(
        Math.round(number)
    );
}

function formatMoney(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "$0";
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(number);
}

function formatPercent(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0%";
    }

    return `${Math.round(number)}%`;
}

function capitalize(value) {
    if (!value) return "";

    return String(value).charAt(0).toUpperCase() +
        String(value).slice(1);
}

// ============================================================
// EXTRAÇÃO FINANCEIRA
// ============================================================

function getFinances(database = null) {
    const business = getBusiness(database);

    return safeObject(
        business.finances
    );
}

function getFinancialEngine(database = null) {
    const business = getBusiness(database);

    return safeObject(
        business.financialEngine ||
        business.engine
    );
}

function getWealth(database = null) {
    const business = getBusiness(database);

    return safeObject(
        business.wealth
    );
}

function getIncome(database = null) {
    const business = getBusiness(database);

    return safeObject(
        business.income
    );
}

function getExpenses(database = null) {
    const business = getBusiness(database);

    return safeObject(
        business.expenses
    );
}

function getAssets(database = null) {
    const business = getBusiness(database);

    const assets =
        business.assets?.items ||
        business.finances?.assets ||
        business.wealth?.assets ||
        business.assetList ||
        [];

    return safeArray(assets);
}

function getSponsors(database = null) {
    const business = getBusiness(database);

    return safeArray(
        business.sponsors
    );
}

function getContracts(database = null) {
    const business = getBusiness(database);

    return safeArray(
        business.contracts
    );
}

function getEndorsements(database = null) {
    const business = getBusiness(database);

    return safeArray(
        business.endorsements
    );
}

function getNegotiations(database = null) {
    const business = getBusiness(database);

    return safeArray(
        business.negotiations
    );
}

// ============================================================
// VALORES
// ============================================================

function getCash(database = null) {
    const db = getDatabase(database);
    const business = getBusiness(db);
    const finances = getFinances(db);

    const value =
        finances.cash ??
        business.cash ??
        business.balance ??
        db?.business?.finances?.cash ??
        0;

    return Number(value) || 0;
}

function getCareerEarnings(database = null) {
    const db = getDatabase(database);
    const finances = getFinances(db);
    const income = getIncome(db);

    return Number(
        finances.careerEarnings ??
        finances.earnings ??
        income.careerEarnings ??
        income.total ??
        0
    ) || 0;
}

function getTotalIncome(database = null) {
    const db = getDatabase(database);
    const finances = getFinances(db);
    const income = getIncome(db);

    return Number(
        income.totalIncome ??
        income.total ??
        finances.totalIncome ??
        finances.income ??
        finances.careerEarnings ??
        0
    ) || 0;
}

function getTotalExpenses(database = null) {
    const db = getDatabase(database);
    const finances = getFinances(db);
    const expenses = getExpenses(db);

    return Number(
        expenses.totalExpenses ??
        expenses.total ??
        finances.totalExpenses ??
        finances.expenses ??
        0
    ) || 0;
}

function getNetWorth(database = null) {
    const db = getDatabase(database);
    const finances = getFinances(db);
    const wealth = getWealth(db);

    const direct =
        wealth.netWorth ??
        wealth.totalNetWorth ??
        finances.netWorth ??
        db?.business?.netWorth;

    if (direct !== undefined && direct !== null) {
        return Number(direct) || 0;
    }

    const assets = getAssets(db);

    const assetValue = assets.reduce(
        (total, asset) => {
            const value =
                asset.currentValue ??
                asset.value ??
                asset.price ??
                0;

            return total + (Number(value) || 0);
        },
        0
    );

    return getCash(db) + assetValue;
}

function getMonthlyIncome(database = null) {
    const db = getDatabase(database);
    const income = getIncome(db);

    return Number(
        income.monthly ??
        income.monthlyIncome ??
        income.averageMonthly ??
        0
    ) || 0;
}

function getMonthlyExpenses(database = null) {
    const db = getDatabase(database);
    const expenses = getExpenses(db);

    return Number(
        expenses.monthly ??
        expenses.monthlyExpenses ??
        expenses.averageMonthly ??
        0
    ) || 0;
}

function getMonthlyProfit(database = null) {
    const income = getMonthlyIncome(database);
    const expenses = getMonthlyExpenses(database);

    return income - expenses;
}

// ============================================================
// MANAGER
// ============================================================

function getManager(database = null) {
    const business = getBusiness(database);

    return (
        business.manager ||
        null
    );
}

function getManagerName(database = null) {
    const manager = getManager(database);

    if (!manager) {
        return "Sem empresário";
    }

    if (typeof manager === "string") {
        return manager;
    }

    return (
        manager.name ||
        manager.fullName ||
        "Empresário"
    );
}

// ============================================================
// PROMOÇÃO / CARREIRA
// ============================================================

function getCareer(database = null) {
    const db = getDatabase(database);

    return db?.career || {};
}

function getCurrentPromotion(database = null) {
    const career = getCareer(database);

    const promotion =
        career.currentPromotion ||
        career.currentOrganization ||
        career.organization ||
        career.promotion;

    if (!promotion) {
        return "Independente";
    }

    if (typeof promotion === "string") {
        return promotion;
    }

    return (
        promotion.name ||
        promotion.displayName ||
        promotion.shortName ||
        "Organização"
    );
}

// ============================================================
// HISTÓRICO
// ============================================================

function getFinancialHistory(database = null) {
    const business = getBusiness(database);

    return safeArray(
        business.history ||
        business.finances?.history ||
        business.wealth?.history ||
        business.income?.history
    );
}

function getRecentTransactions(database = null) {
    const db = getDatabase(database);

    const business = getBusiness(db);

    const candidates = [
        business.transactions,
        business.finances?.transactions,
        business.income?.transactions,
        business.expenses?.transactions,
        business.financialEngine?.transactions
    ];

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
            return candidate;
        }
    }

    return [];
}

// ============================================================
// CATEGORIAS DE DESPESA
// ============================================================

function getExpenseCategories(database = null) {
    const expenses = getExpenses(database);

    const categories =
        expenses.categories ||
        expenses.byCategory ||
        expenses.breakdown;

    if (Array.isArray(categories)) {
        return categories;
    }

    if (categories && typeof categories === "object") {
        return Object.entries(categories).map(
            ([name, value]) => ({
                name,
                value
            })
        );
    }

    return [];
}

// ============================================================
// ESTATÍSTICAS
// ============================================================

function getFinancialStats(database = null) {
    const db = getDatabase(database);

    const cash = getCash(db);
    const income = getTotalIncome(db);
    const expenses = getTotalExpenses(db);
    const netWorth = getNetWorth(db);
    const monthlyIncome = getMonthlyIncome(db);
    const monthlyExpenses = getMonthlyExpenses(db);

    const monthlyProfit =
        monthlyIncome - monthlyExpenses;

    const savingsRate =
        monthlyIncome > 0
            ? (monthlyProfit / monthlyIncome) * 100
            : 0;

    return {
        cash,
        income,
        expenses,
        netWorth,
        monthlyIncome,
        monthlyExpenses,
        monthlyProfit,
        savingsRate,
        careerEarnings: getCareerEarnings(db),
        assets: getAssets(db).length,
        sponsors: getSponsors(db).length,
        contracts: getContracts(db).length,
        endorsements: getEndorsements(db).length
    };
}

// ============================================================
// TÍTULO DE VALOR
// ============================================================

function getWealthLevel(netWorth) {
    if (netWorth >= 1_000_000_000) {
        return "Bilionário";
    }

    if (netWorth >= 100_000_000) {
        return "Ultra rico";
    }

    if (netWorth >= 10_000_000) {
        return "Muito rico";
    }

    if (netWorth >= 1_000_000) {
        return "Milionário";
    }

    if (netWorth >= 100_000) {
        return "Próspero";
    }

    if (netWorth >= 10_000) {
        return "Estável";
    }

    return "Iniciante";
}

// ============================================================
// COMPONENTES
// ============================================================

function renderHeader(database) {
    const player = getPlayer(database);
    const stats = getFinancialStats(database);

    return `
        <section class="finances-header">

            <div>
                <span class="finances-eyebrow">
                    MMA LIFE DYNASTY
                </span>

                <h1>Finanças</h1>

                <p>
                    Controle sua renda, patrimônio, contratos,
                    patrocinadores e evolução financeira.
                </p>
            </div>

            <div class="finances-player-summary">

                <div class="finances-avatar">
                    ${escapeHTML(
                        (
                            player?.firstName ||
                            player?.name ||
                            "J"
                        )
                        .charAt(0)
                        .toUpperCase()
                    )}
                </div>

                <div>
                    <strong>
                        ${escapeHTML(
                            player?.fullName ||
                            player?.displayName ||
                            `${player?.firstName || ""} ${player?.lastName || ""}`.trim() ||
                            "Jogador"
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            getWealthLevel(
                                stats.netWorth
                            )
                        )}
                    </span>
                </div>

            </div>

        </section>
    `;
}

function renderMainStats(database) {
    const stats = getFinancialStats(database);

    return `
        <section class="finance-stat-grid">

            <article class="finance-stat-card highlight">

                <span>Patrimônio líquido</span>

                <strong>
                    ${formatMoney(stats.netWorth)}
                </strong>

                <small>
                    ${escapeHTML(
                        getWealthLevel(stats.netWorth)
                    )}
                </small>

            </article>

            <article class="finance-stat-card">

                <span>Dinheiro disponível</span>

                <strong>
                    ${formatMoney(stats.cash)}
                </strong>

            </article>

            <article class="finance-stat-card">

                <span>Ganhos de carreira</span>

                <strong>
                    ${formatMoney(stats.careerEarnings)}
                </strong>

            </article>

            <article class="finance-stat-card">

                <span>Renda mensal</span>

                <strong>
                    ${formatMoney(stats.monthlyIncome)}
                </strong>

            </article>

            <article class="finance-stat-card">

                <span>Despesas mensais</span>

                <strong>
                    ${formatMoney(stats.monthlyExpenses)}
                </strong>

            </article>

            <article class="finance-stat-card">

                <span>Lucro mensal</span>

                <strong class="${
                    stats.monthlyProfit >= 0
                        ? "finance-positive"
                        : "finance-negative"
                }">
                    ${formatMoney(stats.monthlyProfit)}
                </strong>

            </article>

        </section>
    `;
}

function renderOverviewCards(database) {
    const stats = getFinancialStats(database);

    return `
        <section class="finance-overview-grid">

            <article class="finance-panel">

                <div class="finance-panel-header">
                    <div>
                        <span>FLUXO FINANCEIRO</span>
                        <h2>Resumo</h2>
                    </div>
                </div>

                <div class="finance-flow">

                    <div class="finance-flow-row">
                        <span>Entradas</span>
                        <strong class="finance-positive">
                            ${formatMoney(stats.monthlyIncome)}
                        </strong>
                    </div>

                    <div class="finance-flow-row">
                        <span>Saídas</span>
                        <strong class="finance-negative">
                            ${formatMoney(stats.monthlyExpenses)}
                        </strong>
                    </div>

                    <div class="finance-flow-divider"></div>

                    <div class="finance-flow-row total">
                        <span>Resultado</span>
                        <strong>
                            ${formatMoney(stats.monthlyProfit)}
                        </strong>
                    </div>

                </div>

            </article>

            <article class="finance-panel">

                <div class="finance-panel-header">
                    <div>
                        <span>EFICIÊNCIA</span>
                        <h2>Taxa de economia</h2>
                    </div>
                </div>

                <div class="finance-progress-container">

                    <div class="finance-progress-label">
                        <span>Economia mensal</span>

                        <strong>
                            ${formatPercent(
                                Math.max(
                                    0,
                                    Math.min(
                                        100,
                                        stats.savingsRate
                                    )
                                )
                            )}
                        </strong>
                    </div>

                    <div class="finance-progress">
                        <div
                            class="finance-progress-fill"
                            style="width:${Math.max(
                                0,
                                Math.min(
                                    100,
                                    stats.savingsRate
                                )
                            )}%"
                        ></div>
                    </div>

                    <small>
                        Quanto da sua renda mensal permanece
                        depois das despesas.
                    </small>

                </div>

            </article>

        </section>
    `;
}

function renderCareerMoney(database) {
    const career = getCareer(database);
    const stats = getFinancialStats(database);

    return `
        <section class="finance-panel">

            <div class="finance-panel-header">

                <div>
                    <span>CARREIRA</span>
                    <h2>Dinheiro no MMA</h2>
                </div>

            </div>

            <div class="finance-career-grid">

                <div class="finance-mini-card">
                    <span>Organização</span>
                    <strong>
                        ${escapeHTML(
                            getCurrentPromotion(database)
                        )}
                    </strong>
                </div>

                <div class="finance-mini-card">
                    <span>Ganhos de carreira</span>
                    <strong>
                        ${formatMoney(
                            stats.careerEarnings
                        )}
                    </strong>
                </div>

                <div class="finance-mini-card">
                    <span>Contratos</span>
                    <strong>
                        ${formatNumber(
                            stats.contracts
                        )}
                    </strong>
                </div>

                <div class="finance-mini-card">
                    <span>Patrocínios</span>
                    <strong>
                        ${formatNumber(
                            stats.sponsors
                        )}
                    </strong>
                </div>

            </div>

            ${
                career?.record
                    ? `
                        <div class="finance-career-record">

                            <span>Registro atual</span>

                            <strong>
                                ${escapeHTML(
                                    String(
                                        career.record
                                    )
                                )}
                            </strong>

                        </div>
                    `
                    : ""
            }

        </section>
    `;
}

function renderAssets(database) {
    const assets = getAssets(database);

    return `
        <section class="finance-panel">

            <div class="finance-panel-header">

                <div>
                    <span>PATRIMÔNIO</span>
                    <h2>Ativos</h2>
                </div>

                <span class="finance-count">
                    ${formatNumber(assets.length)}
                </span>

            </div>

            ${
                assets.length
                    ? `
                        <div class="finance-assets-grid">

                            ${assets
                                .slice(0, 12)
                                .map(asset => {

                                    const name =
                                        asset.name ||
                                        asset.title ||
                                        asset.type ||
                                        "Ativo";

                                    const value =
                                        asset.currentValue ??
                                        asset.value ??
                                        asset.price ??
                                        0;

                                    const category =
                                        asset.category ||
                                        asset.type ||
                                        "Patrimônio";

                                    return `
                                        <article class="finance-asset-card">

                                            <div class="finance-asset-icon">
                                                ${escapeHTML(
                                                    String(name)
                                                        .charAt(0)
                                                        .toUpperCase()
                                                )}
                                            </div>

                                            <div class="finance-asset-info">

                                                <strong>
                                                    ${escapeHTML(name)}
                                                </strong>

                                                <span>
                                                    ${escapeHTML(
                                                        capitalize(
                                                            String(category)
                                                        )
                                                    )}
                                                </span>

                                            </div>

                                            <b>
                                                ${formatMoney(value)}
                                            </b>

                                        </article>
                                    `;
                                })
                                .join("")}

                        </div>
                    `
                    : `
                        <div class="finance-empty">
                            Você ainda não possui ativos registrados.
                        </div>
                    `
            }

        </section>
    `;
}

function renderSponsors(database) {
    const sponsors = getSponsors(database);

    return `
        <section class="finance-panel">

            <div class="finance-panel-header">

                <div>
                    <span>MARKETING</span>
                    <h2>Patrocinadores</h2>
                </div>

                <span class="finance-count">
                    ${formatNumber(sponsors.length)}
                </span>

            </div>

            ${
                sponsors.length
                    ? `
                        <div class="finance-list">

                            ${sponsors.map(sponsor => {

                                const name =
                                    sponsor.name ||
                                    sponsor.company ||
                                    sponsor.brand ||
                                    "Patrocinador";

                                const value =
                                    sponsor.value ??
                                    sponsor.payment ??
                                    sponsor.amount ??
                                    sponsor.monthlyValue ??
                                    0;

                                const status =
                                    sponsor.status ||
                                    "Ativo";

                                return `
                                    <article class="finance-list-row">

                                        <div class="finance-list-icon">
                                            ${escapeHTML(
                                                name
                                                    .charAt(0)
                                                    .toUpperCase()
                                            )}
                                        </div>

                                        <div class="finance-list-main">

                                            <strong>
                                                ${escapeHTML(name)}
                                            </strong>

                                            <span>
                                                ${escapeHTML(
                                                    capitalize(
                                                        String(status)
                                                    )
                                                )}
                                            </span>

                                        </div>

                                        <strong>
                                            ${formatMoney(value)}
                                        </strong>

                                    </article>
                                `;
                            }).join("")}

                        </div>
                    `
                    : `
                        <div class="finance-empty">
                            Você ainda não possui patrocinadores.
                        </div>
                    `
            }

        </section>
    `;
}

function renderContracts(database) {
    const contracts = getContracts(database);

    return `
        <section class="finance-panel">

            <div class="finance-panel-header">

                <div>
                    <span>NEGÓCIOS</span>
                    <h2>Contratos</h2>
                </div>

                <span class="finance-count">
                    ${formatNumber(contracts.length)}
                </span>

            </div>

            ${
                contracts.length
                    ? `
                        <div class="finance-list">

                            ${contracts.map(contract => {

                                const name =
                                    contract.promotionName ||
                                    contract.organizationName ||
                                    contract.organization ||
                                    contract.name ||
                                    "Contrato";

                                const purse =
                                    contract.purse ??
                                    contract.basePurse ??
                                    contract.fightPurse ??
                                    0;

                                const bonus =
                                    contract.winBonus ??
                                    contract.bonus ??
                                    0;

                                const fights =
                                    contract.fights ??
                                    contract.totalFights ??
                                    contract.remainingFights ??
                                    "—";

                                const status =
                                    contract.status ||
                                    "Ativo";

                                return `
                                    <article class="finance-contract-card">

                                        <div class="finance-contract-header">

                                            <strong>
                                                ${escapeHTML(name)}
                                            </strong>

                                            <span>
                                                ${escapeHTML(
                                                    capitalize(
                                                        String(status)
                                                    )
                                                )}
                                            </span>

                                        </div>

                                        <div class="finance-contract-values">

                                            <div>
                                                <small>Bolsa</small>
                                                <strong>
                                                    ${formatMoney(purse)}
                                                </strong>
                                            </div>

                                            <div>
                                                <small>Vitória</small>
                                                <strong>
                                                    ${formatMoney(bonus)}
                                                </strong>
                                            </div>

                                            <div>
                                                <small>Lutas</small>
                                                <strong>
                                                    ${escapeHTML(
                                                        String(fights)
                                                    )}
                                                </strong>
                                            </div>

                                        </div>

                                    </article>
                                `;
                            }).join("")}

                        </div>
                    `
                    : `
                        <div class="finance-empty">
                            Você ainda não possui contratos registrados.
                        </div>
                    `
            }

        </section>
    `;
}

function renderExpenseCategories(database) {
    const categories =
        getExpenseCategories(database);

    return `
        <section class="finance-panel">

            <div class="finance-panel-header">

                <div>
                    <span>DESPESAS</span>
                    <h2>Por categoria</h2>
                </div>

            </div>

            ${
                categories.length
                    ? `
                        <div class="finance-category-list">

                            ${categories
                                .slice(0, 15)
                                .map(category => {

                                    const name =
                                        category.name ||
                                        category.category ||
                                        "Categoria";

                                    const value =
                                        category.value ??
                                        category.amount ??
                                        category.total ??
                                        0;

                                    return `
                                        <div class="finance-category-row">

                                            <div class="finance-category-label">
                                                <span>
                                                    ${escapeHTML(
                                                        capitalize(
                                                            String(name)
                                                        )
                                                    )}
                                                </span>

                                                <strong>
                                                    ${formatMoney(value)}
                                                </strong>
                                            </div>

                                            <div class="finance-category-bar">
                                                <div
                                                    style="width:${Math.min(
                                                        100,
                                                        Math.max(
                                                            2,
                                                            (
                                                                Number(value) ||
                                                                0
                                                            ) /
                                                            Math.max(
                                                                1,
                                                                getMonthlyExpenses(database)
                                                            ) *
                                                            100
                                                        )
                                                    )}%"
                                                ></div>
                                            </div>

                                        </div>
                                    `;
                                })
                                .join("")}

                        </div>
                    `
                    : `
                        <div class="finance-empty">
                            Ainda não existem categorias de despesas registradas.
                        </div>
                    `
            }

        </section>
    `;
}

function renderTransactions(database) {
    const transactions =
        getRecentTransactions(database);

    return `
        <section class="finance-panel">

            <div class="finance-panel-header">

                <div>
                    <span>MOVIMENTAÇÕES</span>
                    <h2>Transações recentes</h2>
                </div>

                <span class="finance-count">
                    ${formatNumber(transactions.length)}
                </span>

            </div>

            ${
                transactions.length
                    ? `
                        <div class="finance-transactions">

                            ${transactions
                                .slice(-12)
                                .reverse()
                                .map(transaction => {

                                    const description =
                                        transaction.description ||
                                        transaction.name ||
                                        transaction.title ||
                                        "Movimentação";

                                    const amount =
                                        Number(
                                            transaction.amount ??
                                            transaction.value ??
                                            transaction.total ??
                                            0
                                        ) || 0;

                                    const type =
                                        transaction.type ||
                                        (
                                            amount >= 0
                                                ? "income"
                                                : "expense"
                                        );

                                    const positive =
                                        type === "income" ||
                                        type === "revenue" ||
                                        amount >= 0;

                                    return `
                                        <div class="finance-transaction">

                                            <div class="finance-transaction-icon">
                                                ${positive ? "+" : "−"}
                                            </div>

                                            <div class="finance-transaction-main">

                                                <strong>
                                                    ${escapeHTML(
                                                        description
                                                    )}
                                                </strong>

                                                <span>
                                                    ${escapeHTML(
                                                        transaction.date ||
                                                        transaction.createdAt ||
                                                        ""
                                                    )}
                                                </span>

                                            </div>

                                            <strong class="${
                                                positive
                                                    ? "finance-positive"
                                                    : "finance-negative"
                                            }">
                                                ${
                                                    positive
                                                        ? "+"
                                                        : "−"
                                                }${formatMoney(
                                                    Math.abs(amount)
                                                )}
                                            </strong>

                                        </div>
                                    `;
                                })
                                .join("")}

                        </div>
                    `
                    : `
                        <div class="finance-empty">
                            Nenhuma transação recente registrada.
                        </div>
                    `
            }

        </section>
    `;
}

// ============================================================
// TABS
// ============================================================

function renderTabButton(id, label) {
    return `
        <button
            type="button"
            class="finance-tab ${
                state.activeTab === id
                    ? "active"
                    : ""
            }"
            data-finance-tab="${escapeHTML(id)}"
        >
            ${escapeHTML(label)}
        </button>
    `;
}

function renderOverviewTab(database) {
    return `
        ${renderOverviewCards(database)}
        ${renderCareerMoney(database)}
        ${renderAssets(database)}
        ${renderSponsors(database)}
    `;
}

function renderIncomeTab(database) {
    return `
        ${renderCareerMoney(database)}
        ${renderSponsors(database)}
        ${renderContracts(database)}

        <section class="finance-panel">

            <div class="finance-panel-header">
                <div>
                    <span>OUTRAS RECEITAS</span>
                    <h2>Endossos</h2>
                </div>

                <span class="finance-count">
                    ${formatNumber(
                        getEndorsements(database).length
                    )}
                </span>
            </div>

            ${
                getEndorsements(database).length
                    ? `
                        <div class="finance-list">
                            ${getEndorsements(database)
                                .map(item => {

                                    const name =
                                        item.name ||
                                        item.brand ||
                                        "Endosso";

                                    const value =
                                        item.value ??
                                        item.amount ??
                                        item.payment ??
                                        0;

                                    return `
                                        <div class="finance-list-row">

                                            <div class="finance-list-icon">
                                                ${escapeHTML(
                                                    name
                                                        .charAt(0)
                                                        .toUpperCase()
                                                )}
                                            </div>

                                            <div class="finance-list-main">
                                                <strong>
                                                    ${escapeHTML(name)}
                                                </strong>

                                                <span>
                                                    Endosso
                                                </span>
                                            </div>

                                            <strong>
                                                ${formatMoney(value)}
                                            </strong>

                                        </div>
                                    `;
                                })
                                .join("")}
                        </div>
                    `
                    : `
                        <div class="finance-empty">
                            Nenhum endosso registrado.
                        </div>
                    `
            }

        </section>
    `;
}

function renderExpensesTab(database) {
    return `
        ${renderOverviewCards(database)}
        ${renderExpenseCategories(database)}
    `;
}

function renderAssetsTab(database) {
    return `
        ${renderAssets(database)}
    `;
}

function renderContractsTab(database) {
    return `
        ${renderContracts(database)}
        ${renderNegotiations(database)}
    `;
}

function renderNegotiations(database) {
    const negotiations =
        getNegotiations(database);

    return `
        <section class="finance-panel">

            <div class="finance-panel-header">

                <div>
                    <span>NEGOCIAÇÃO</span>
                    <h2>Negociações</h2>
                </div>

                <span class="finance-count">
                    ${formatNumber(
                        negotiations.length
                    )}
                </span>

            </div>

            ${
                negotiations.length
                    ? `
                        <div class="finance-list">

                            ${negotiations.map(item => {

                                const name =
                                    item.name ||
                                    item.type ||
                                    item.description ||
                                    "Negociação";

                                const value =
                                    item.value ??
                                    item.amount ??
                                    0;

                                const status =
                                    item.status ||
                                    "Em andamento";

                                return `
                                    <div class="finance-list-row">

                                        <div class="finance-list-icon">
                                            $
                                        </div>

                                        <div class="finance-list-main">
                                            <strong>
                                                ${escapeHTML(name)}
                                            </strong>

                                            <span>
                                                ${escapeHTML(
                                                    capitalize(
                                                        String(status)
                                                    )
                                                )}
                                            </span>
                                        </div>

                                        <strong>
                                            ${formatMoney(value)}
                                        </strong>

                                    </div>
                                `;
                            }).join("")}

                        </div>
                    `
                    : `
                        <div class="finance-empty">
                            Nenhuma negociação em andamento.
                        </div>
                    `
            }

        </section>
    `;
}

function renderTransactionsTab(database) {
    return `
        ${renderTransactions(database)}
    `;
}

function renderTabContent(database) {
    switch (state.activeTab) {
        case "income":
            return renderIncomeTab(database);

        case "expenses":
            return renderExpensesTab(database);

        case "assets":
            return renderAssetsTab(database);

        case "contracts":
            return renderContractsTab(database);

        case "transactions":
            return renderTransactionsTab(database);

        case "overview":
        default:
            return renderOverviewTab(database);
    }
}

// ============================================================
// RENDER
// ============================================================

function render(database = null) {
    const db = getDatabase(database);

    if (!db) {
        return `
            <section class="finance-error">
                <h2>Finanças</h2>
                <p>Banco de dados ainda não disponível.</p>
            </section>
        `;
    }

    state.database = db;

    const html = `
        <div class="finances-screen">

            ${renderHeader(db)}

            ${renderMainStats(db)}

            <nav class="finance-tabs">

                ${renderTabButton(
                    "overview",
                    "Visão geral"
                )}

                ${renderTabButton(
                    "income",
                    "Receitas"
                )}

                ${renderTabButton(
                    "expenses",
                    "Despesas"
                )}

                ${renderTabButton(
                    "assets",
                    "Patrimônio"
                )}

                ${renderTabButton(
                    "contracts",
                    "Contratos"
                )}

                ${renderTabButton(
                    "transactions",
                    "Transações"
                )}

            </nav>

            <main class="finance-content">

                ${renderTabContent(db)}

            </main>

        </div>
    `;

    state.lastRender = {
        timestamp: Date.now(),
        tab: state.activeTab
    };

    return html;
}

// ============================================================
// DOM
// ============================================================

function getContentElement() {
    return (
        document.getElementById("mma-life-content") ||
        document.querySelector("#mma-life-content")
    );
}

function renderToDOM(database = null) {
    const content = getContentElement();

    if (!content) {
        return false;
    }

    content.innerHTML = render(database);

    bindEvents();

    return true;
}

// ============================================================
// EVENTOS
// ============================================================

function bindEvents() {
    const buttons = document.querySelectorAll(
        "[data-finance-tab]"
    );

    buttons.forEach(button => {
        button.addEventListener(
            "click",
            () => {

                const tab =
                    button.dataset.financeTab;

                if (!tab) return;

                setActiveTab(tab);

                renderToDOM(
                    state.database
                );
            }
        );
    });
}

function setActiveTab(tab) {
    const allowed = [
        "overview",
        "income",
        "expenses",
        "assets",
        "contracts",
        "transactions"
    ];

    if (!allowed.includes(tab)) {
        return false;
    }

    state.activeTab = tab;

    return true;
}

// ============================================================
// ESTILOS
// ============================================================

function injectStyles() {
    if (
        document.getElementById(
            "mma-life-finances-screen-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement("style");

    style.id =
        "mma-life-finances-screen-styles";

    style.textContent = `
        .finances-screen {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 24px;
            box-sizing: border-box;
        }

        .finances-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 24px;
        }

        .finances-eyebrow {
            display: block;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1.5px;
            opacity: .6;
            margin-bottom: 5px;
        }

        .finances-header h1 {
            margin: 0;
            font-size: 32px;
        }

        .finances-header p {
            margin: 8px 0 0;
            opacity: .65;
            max-width: 700px;
        }

        .finances-player-summary {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 210px;
        }

        .finances-player-summary > div:last-child {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .finances-player-summary span {
            font-size: 11px;
            opacity: .6;
        }

        .finances-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 1px solid rgba(127,127,127,.25);
            display: grid;
            place-items: center;
            font-weight: 900;
        }

        .finance-stat-grid {
            display: grid;
            grid-template-columns: repeat(6, minmax(0, 1fr));
            gap: 10px;
            margin-bottom: 20px;
        }

        .finance-stat-card {
            padding: 16px;
            border: 1px solid rgba(127,127,127,.22);
            border-radius: 15px;
            background: rgba(127,127,127,.045);
        }

        .finance-stat-card.highlight {
            border-width: 2px;
        }

        .finance-stat-card span {
            display: block;
            font-size: 10px;
            opacity: .6;
        }

        .finance-stat-card strong {
            display: block;
            font-size: 21px;
            margin-top: 8px;
            word-break: break-word;
        }

        .finance-stat-card small {
            display: block;
            margin-top: 5px;
            font-size: 10px;
            opacity: .55;
        }

        .finance-positive {
            font-weight: 800;
        }

        .finance-negative {
            font-weight: 800;
        }

        .finance-tabs {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding: 3px 2px 15px;
        }

        .finance-tab {
            border: 1px solid rgba(127,127,127,.24);
            background: transparent;
            color: inherit;
            border-radius: 999px;
            padding: 9px 15px;
            cursor: pointer;
            font: inherit;
            white-space: nowrap;
            opacity: .7;
        }

        .finance-tab:hover {
            opacity: 1;
        }

        .finance-tab.active {
            opacity: 1;
            border-color: currentColor;
            font-weight: 800;
        }

        .finance-content {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .finance-overview-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
        }

        .finance-panel {
            padding: 20px;
            border: 1px solid rgba(127,127,127,.22);
            border-radius: 17px;
            background: rgba(127,127,127,.035);
        }

        .finance-panel-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 15px;
            margin-bottom: 18px;
        }

        .finance-panel-header span {
            display: block;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1.2px;
            opacity: .55;
            margin-bottom: 5px;
        }

        .finance-panel-header h2 {
            margin: 0;
            font-size: 20px;
        }

        .finance-count {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 30px;
            height: 30px;
            padding: 0 8px;
            border-radius: 999px;
            border: 1px solid rgba(127,127,127,.22);
            font-size: 11px;
            font-weight: 800;
        }

        .finance-flow {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .finance-flow-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
        }

        .finance-flow-row span {
            font-size: 13px;
            opacity: .7;
        }

        .finance-flow-row strong {
            font-size: 14px;
        }

        .finance-flow-row.total strong {
            font-size: 20px;
        }

        .finance-flow-divider {
            height: 1px;
            background: rgba(127,127,127,.16);
        }

        .finance-progress-container {
            padding-top: 4px;
        }

        .finance-progress-label {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 8px;
            font-size: 12px;
        }

        .finance-progress {
            height: 10px;
            border-radius: 999px;
            background: rgba(127,127,127,.12);
            overflow: hidden;
        }

        .finance-progress-fill {
            height: 100%;
            border-radius: inherit;
            background: currentColor;
        }

        .finance-progress-container small {
            display: block;
            margin-top: 10px;
            font-size: 10px;
            opacity: .55;
        }

        .finance-career-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 10px;
        }

        .finance-mini-card {
            padding: 14px;
            border-radius: 12px;
            border: 1px solid rgba(127,127,127,.18);
            background: rgba(127,127,127,.035);
        }

        .finance-mini-card span {
            display: block;
            font-size: 10px;
            opacity: .55;
        }

        .finance-mini-card strong {
            display: block;
            margin-top: 7px;
            font-size: 14px;
            word-break: break-word;
        }

        .finance-career-record {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding-top: 16px;
            margin-top: 16px;
            border-top: 1px solid rgba(127,127,127,.16);
        }

        .finance-career-record span {
            font-size: 11px;
            opacity: .55;
        }

        .finance-career-record strong {
            font-size: 13px;
        }

        .finance-assets-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
        }

        .finance-asset-card {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 13px;
            border-radius: 13px;
            border: 1px solid rgba(127,127,127,.18);
            background: rgba(127,127,127,.035);
        }

        .finance-asset-icon,
        .finance-list-icon {
            width: 38px;
            height: 38px;
            flex-shrink: 0;
            border-radius: 11px;
            border: 1px solid rgba(127,127,127,.2);
            display: grid;
            place-items: center;
            font-weight: 900;
            font-size: 13px;
        }

        .finance-asset-info {
            min-width: 0;
            flex: 1;
        }

        .finance-asset-info strong {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 12px;
        }

        .finance-asset-info span {
            display: block;
            margin-top: 3px;
            font-size: 9px;
            opacity: .55;
        }

        .finance-asset-card > b {
            font-size: 11px;
            white-space: nowrap;
        }

        .finance-list {
            display: flex;
            flex-direction: column;
        }

        .finance-list-row {
            display: flex;
            align-items: center;
            gap: 11px;
            padding: 12px 0;
            border-bottom: 1px solid rgba(127,127,127,.14);
        }

        .finance-list-row:last-child {
            border-bottom: 0;
        }

        .finance-list-main {
            min-width: 0;
            flex: 1;
        }

        .finance-list-main strong {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 13px;
        }

        .finance-list-main span {
            display: block;
            margin-top: 3px;
            font-size: 10px;
            opacity: .55;
        }

        .finance-list-row > strong {
            font-size: 12px;
            white-space: nowrap;
        }

        .finance-contract-card {
            padding: 15px 0;
            border-bottom: 1px solid rgba(127,127,127,.14);
        }

        .finance-contract-card:last-child {
            border-bottom: 0;
        }

        .finance-contract-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }

        .finance-contract-header strong {
            font-size: 14px;
        }

        .finance-contract-header span {
            font-size: 9px;
            padding: 4px 7px;
            border-radius: 999px;
            border: 1px solid rgba(127,127,127,.2);
            opacity: .65;
        }

        .finance-contract-values {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
            margin-top: 12px;
        }

        .finance-contract-values > div {
            padding: 10px;
            border-radius: 10px;
            background: rgba(127,127,127,.045);
        }

        .finance-contract-values small {
            display: block;
            font-size: 9px;
            opacity: .5;
        }

        .finance-contract-values strong {
            display: block;
            margin-top: 4px;
            font-size: 12px;
        }

        .finance-category-list {
            display: flex;
            flex-direction: column;
            gap: 14px;
        }

        .finance-category-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 6px;
        }

        .finance-category-label span {
            font-size: 11px;
            opacity: .65;
        }

        .finance-category-label strong {
            font-size: 11px;
        }

        .finance-category-bar {
            height: 7px;
            border-radius: 999px;
            overflow: hidden;
            background: rgba(127,127,127,.1);
        }

        .finance-category-bar > div {
            height: 100%;
            border-radius: inherit;
            background: currentColor;
        }

        .finance-transactions {
            display: flex;
            flex-direction: column;
        }

        .finance-transaction {
            display: flex;
            align-items: center;
            gap: 11px;
            padding: 12px 0;
            border-bottom: 1px solid rgba(127,127,127,.14);
        }

        .finance-transaction:last-child {
            border-bottom: 0;
        }

        .finance-transaction-icon {
            width: 34px;
            height: 34px;
            display: grid;
            place-items: center;
            border-radius: 10px;
            border: 1px solid rgba(127,127,127,.2);
            font-weight: 900;
        }

        .finance-transaction-main {
            flex: 1;
            min-width: 0;
        }

        .finance-transaction-main strong {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 12px;
        }

        .finance-transaction-main span {
            display: block;
            margin-top: 3px;
            font-size: 9px;
            opacity: .5;
        }

        .finance-transaction > strong {
            font-size: 12px;
            white-space: nowrap;
        }

        .finance-empty {
            padding: 28px 15px;
            border: 1px dashed rgba(127,127,127,.22);
            border-radius: 12px;
            text-align: center;
            font-size: 12px;
            opacity: .6;
        }

        .finance-error {
            padding: 30px;
            text-align: center;
        }

        @media (max-width: 1150px) {
            .finance-stat-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }

            .finance-assets-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }

        @media (max-width: 850px) {
            .finance-overview-grid {
                grid-template-columns: 1fr;
            }

            .finance-career-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }

        @media (max-width: 700px) {
            .finances-screen {
                padding: 15px;
            }

            .finances-header {
                flex-direction: column;
                align-items: flex-start;
            }

            .finances-player-summary {
                width: 100%;
            }

            .finance-stat-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .finance-assets-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 480px) {
            .finance-stat-grid {
                grid-template-columns: 1fr;
            }

            .finance-career-grid {
                grid-template-columns: 1fr;
            }

            .finance-contract-values {
                grid-template-columns: 1fr;
            }

            .finances-header h1 {
                font-size: 27px;
            }
        }
    `;

    document.head.appendChild(style);
}

// ============================================================
// CONTROLE
// ============================================================

function initialize(database = null) {
    state.database = getDatabase(database);

    injectStyles();

    state.initialized = true;

    return renderToDOM(
        state.database
    );
}

function refresh(database = null) {
    if (database) {
        state.database = database;
    }

    injectStyles();

    return renderToDOM(
        state.database || getDatabase()
    );
}

function open(tab = "overview", database = null) {
    setActiveTab(tab);

    if (database) {
        state.database = database;
    }

    return refresh(
        state.database
    );
}

function close() {
    return true;
}

// ============================================================
// ESTADO / SNAPSHOT / VALIDAÇÃO
// ============================================================

function getState() {
    return clone({
        version: FINANCES_SCREEN_VERSION,
        initialized: state.initialized,
        activeTab: state.activeTab,
        lastRender: state.lastRender
    });
}

function getSnapshot(database = null) {
    const db = getDatabase(database);

    return {
        version: FINANCES_SCREEN_VERSION,
        stats: getFinancialStats(db),
        cash: getCash(db),
        netWorth: getNetWorth(db),
        assets: clone(getAssets(db)),
        sponsors: clone(getSponsors(db)),
        contracts: clone(getContracts(db)),
        endorsements: clone(getEndorsements(db)),
        transactions: clone(
            getRecentTransactions(db)
        )
    };
}

function validate(database = null) {
    const db = getDatabase(database);

    const errors = [];

    if (!db) {
        errors.push(
            "Database não disponível."
        );
    }

    if (typeof document === "undefined") {
        errors.push(
            "Ambiente DOM não disponível."
        );
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// ============================================================
// API
// ============================================================

const financesScreenAPI = {
    version: FINANCES_SCREEN_VERSION,

    initialize,
    refresh,
    render,
    renderToDOM,

    open,
    close,

    setActiveTab,

    getState,
    getSnapshot,
    validate,

    getDatabase,
    getBusiness,
    getPlayer,

    getFinances,
    getFinancialEngine,
    getWealth,
    getIncome,
    getExpenses,

    getAssets,
    getSponsors,
    getContracts,
    getEndorsements,
    getNegotiations,

    getCash,
    getCareerEarnings,
    getTotalIncome,
    getTotalExpenses,
    getNetWorth,
    getMonthlyIncome,
    getMonthlyExpenses,
    getMonthlyProfit,

    getManager,
    getManagerName,
    getCareer,
    getCurrentPromotion,

    getFinancialHistory,
    getRecentTransactions,
    getExpenseCategories,

    getFinancialStats,
    getWealthLevel
};

globalThis.financesScreenAPI =
    financesScreenAPI;

globalThis.MMA_LIFE_FINANCES_SCREEN =
    financesScreenAPI;

// ============================================================
// READY
// ============================================================

if (typeof window !== "undefined") {
    window.addEventListener(
        "DOMContentLoaded",
        () => {

            injectStyles();

            window.dispatchEvent(
                new CustomEvent(
                    "mma-life-finances-screen-ready",
                    {
                        detail:
                            financesScreenAPI
                    }
                )
            );
        }
    );
}

// ============================================================
// EXPORTS
// ============================================================

export {
    FINANCES_SCREEN_VERSION,
    financesScreenAPI,

    initialize,
    refresh,
    render,
    renderToDOM,

    open,
    close,

    setActiveTab,

    getState,
    getSnapshot,
    validate
};

export default financesScreenAPI;
