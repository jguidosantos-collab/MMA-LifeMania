/* ============================================================
   MMA LIFE DYNASTY
   UI — CONTRACTS SCREEN
   Arquivo: js/ui/contractsScreen.js
   ============================================================ */

const CONTRACTS_SCREEN_VERSION = 1;

const contractsScreenState = {
    initialized: false,
    database: null,
    activeTab: "overview",
    selectedContractId: null,
    lastRender: null
};

/* ============================================================
   UTILIDADES
   ============================================================ */

function clone(value) {
    if (value === undefined) return undefined;

    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function getDatabase(database = null) {
    return (
        database ||
        contractsScreenState.database ||
        window.MMA_LIFE_DATABASE ||
        {}
    );
}

function getElement(id) {
    return document.getElementById(id);
}

function ensureContent() {
    let content = getElement("mma-life-content");

    if (!content) {
        content = document.createElement("main");
        content.id = "mma-life-content";
        document.body.appendChild(content);
    }

    return content;
}

function safeArray(value) {
    if (Array.isArray(value)) return value;

    if (value && Array.isArray(value.items)) {
        return value.items;
    }

    if (value && Array.isArray(value.list)) {
        return value.list;
    }

    if (value && Array.isArray(value.data)) {
        return value.data;
    }

    if (value && typeof value === "object") {
        return Object.values(value);
    }

    return [];
}

function safeObject(value) {
    return (
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
    )
        ? value
        : {};
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
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
        return "US$ 0";
    }

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(number);
}

function capitalize(value) {
    if (!value) return "";

    return String(value)
        .replace(/_/g, " ")
        .replace(/\b\w/g, letter =>
            letter.toUpperCase()
        );
}

function getNested(
    object,
    path,
    fallback = null
) {
    if (!object || !path) {
        return fallback;
    }

    const parts = Array.isArray(path)
        ? path
        : String(path).split(".");

    let current = object;

    for (const part of parts) {
        if (current == null) {
            return fallback;
        }

        current = current[part];
    }

    return current ?? fallback;
}

/* ============================================================
   PLAYER
   ============================================================ */

function getPlayer(database) {
    return database?.player || {};
}

function getPlayerName(player) {
    const first =
        player.firstName ||
        player.firstname ||
        "";

    const last =
        player.lastName ||
        player.lastname ||
        "";

    return (
        player.fullName ||
        player.name ||
        `${first} ${last}`.trim() ||
        "Lutador"
    );
}

function getPlayerOverall(player) {
    const attributes =
        player.attributes || {};

    return Number(
        player.overall ??
        player.ovr ??
        attributes.overall ??
        attributes.ovr ??
        0
    ) || 0;
}

/* ============================================================
   CAREER
   ============================================================ */

function getCareer(database) {
    return database?.career || {};
}

function getCurrentPromotion(database) {
    const career =
        getCareer(database);

    return (
        career.currentPromotion ||
        career.promotion ||
        career.organization ||
        null
    );
}

function getCurrentPromotionName(
    database
) {
    const promotion =
        getCurrentPromotion(database);

    if (!promotion) {
        return "Sem organização";
    }

    if (typeof promotion === "string") {
        return promotion;
    }

    return (
        promotion.name ||
        promotion.title ||
        promotion.shortName ||
        "Organização"
    );
}

function getCurrentDivision(database) {
    const career =
        getCareer(database);

    const player =
        getPlayer(database);

    return (
        career.currentDivision ||
        career.division ||
        career.weightClass ||
        player.weightClass ||
        player.division ||
        "Não definida"
    );
}

function getCareerRecord(database) {
    const career =
        getCareer(database);

    const record =
        career.record ||
        career.professional?.record ||
        {};

    return {
        wins: Number(
            record.wins ??
            career.wins ??
            0
        ),

        losses: Number(
            record.losses ??
            career.losses ??
            0
        ),

        draws: Number(
            record.draws ??
            career.draws ??
            0
        )
    };
}

/* ============================================================
   CONTRACT DATA
   ============================================================ */

function getContractsState(database) {
    return (
        database?.contracts ||
        database?.promotions?.contracts ||
        database?.career?.contracts ||
        {}
    );
}

function getOffersCollection(database) {
    const state =
        getContractsState(database);

    return (
        state.offers ||
        state.contractOffers ||
        state.proposals ||
        []
    );
}

function getActiveContractCollection(
    database
) {
    const state =
        getContractsState(database);

    return (
        state.active ||
        state.current ||
        state.currentContract ||
        state.contract ||
        []
    );
}

function getContractHistory(
    database
) {
    const state =
        getContractsState(database);

    return (
        state.history ||
        state.past ||
        state.completed ||
        []
    );
}

/* ============================================================
   NORMALIZAÇÃO
   ============================================================ */

function normalizeContract(
    contract,
    index = 0,
    type = "contract"
) {
    if (!contract) return null;

    const promotion =
        contract.promotion ||
        contract.organization ||
        {};

    const id =
        contract.id ||
        contract.contractId ||
        `${type}-${index}`;

    const promotionId =
        contract.promotionId ||
        contract.organizationId ||
        promotion.id ||
        null;

    const promotionName =
        contract.promotionName ||
        contract.organizationName ||
        promotion.name ||
        promotion.title ||
        "Organização";

    const fights =
        Number(
            contract.fights ??
            contract.numberOfFights ??
            contract.fightCount ??
            contract.totalFights ??
            contract.bouts ??
            0
        );

    const completedFights =
        Number(
            contract.completedFights ??
            contract.fightsCompleted ??
            contract.usedFights ??
            0
        );

    const remainingFights =
        Number(
            contract.remainingFights ??
            contract.fightsRemaining ??
            Math.max(
                0,
                fights - completedFights
            )
        );

    const purse =
        Number(
            contract.purse ??
            contract.basePurse ??
            contract.fightPurse ??
            contract.showMoney ??
            0
        );

    const winBonus =
        Number(
            contract.winBonus ??
            contract.bonus ??
            contract.win ??
            0
        );

    const titleBonus =
        Number(
            contract.titleBonus ??
            contract.championshipBonus ??
            0
        );

    const mainEventBonus =
        Number(
            contract.mainEventBonus ??
            contract.mainEvent ??
            0
        );

    const signingBonus =
        Number(
            contract.signingBonus ??
            contract.signOnBonus ??
            0
        );

    const guaranteed =
        Number(
            contract.guaranteed ??
            contract.guaranteedMoney ??
            0
        );

    const status =
        contract.status ||
        (
            type === "offer"
                ? "pending"
                : "active"
        );

    return {
        id,

        type,

        promotionId,

        promotionName,

        promotionShortName:
            contract.promotionShortName ||
            promotion.shortName ||
            promotion.acronym ||
            "",

        division:
            contract.division ||
            contract.weightClass ||
            getCurrentDivision(
                contractsScreenState.database || {}
            ),

        fights,

        completedFights,

        remainingFights,

        purse,

        winBonus,

        titleBonus,

        mainEventBonus,

        signingBonus,

        guaranteed,

        commission:
            Number(
                contract.commission ??
                contract.managerCommission ??
                0
            ),

        duration:
            Number(
                contract.duration ??
                contract.durationMonths ??
                contract.months ??
                0
            ),

        startDate:
            contract.startDate ||
            contract.startedAt ||
            null,

        endDate:
            contract.endDate ||
            contract.expiresAt ||
            contract.expirationDate ||
            null,

        status,

        exclusive:
            Boolean(
                contract.exclusive ??
                contract.exclusivity
            ),

        titleShot:
            Boolean(
                contract.titleShot ||
                contract.guaranteedTitleShot
            ),

        immediateTitleShot:
            Boolean(
                contract.immediateTitleShot
            ),

        renegotiation:
            Boolean(
                contract.renegotiation ||
                contract.canRenegotiate
            ),

        automaticExtension:
            Boolean(
                contract.automaticExtension ||
                contract.autoRenew
            ),

        notes:
            contract.notes ||
            contract.clauses ||
            contract.conditions ||
            "",

        raw: contract
    };
}

/* ============================================================
   GETTERS
   ============================================================ */

function getOffers(database) {
    return safeArray(
        getOffersCollection(database)
    )
        .map(
            (item, index) =>
                normalizeContract(
                    item,
                    index,
                    "offer"
                )
        )
        .filter(Boolean);
}

function getActiveContract(
    database
) {
    const collection =
        getActiveContractCollection(
            database
        );

    if (
        collection &&
        !Array.isArray(collection) &&
        typeof collection === "object"
    ) {
        return normalizeContract(
            collection,
            0,
            "active"
        );
    }

    const contracts =
        safeArray(collection);

    if (!contracts.length) {
        return null;
    }

    return normalizeContract(
        contracts[0],
        0,
        "active"
    );
}

function getContractHistoryEntries(
    database
) {
    return safeArray(
        getContractHistory(database)
    )
        .map(
            (item, index) =>
                normalizeContract(
                    item,
                    index,
                    "history"
                )
        )
        .filter(Boolean);
}

function getAllContracts(
    database
) {
    return [
        ...getOffers(database),
        ...(getActiveContract(database)
            ? [
                getActiveContract(
                    database
                )
            ]
            : []),
        ...getContractHistoryEntries(
            database
        )
    ];
}

/* ============================================================
   STATUS
   ============================================================ */

function getStatusLabel(status) {
    const labels = {
        pending: "Pendente",
        active: "Ativo",
        accepted: "Aceito",
        rejected: "Recusado",
        expired: "Expirado",
        completed: "Concluído",
        terminated: "Encerrado",
        cancelled: "Cancelado"
    };

    return (
        labels[
            String(status)
                .toLowerCase()
        ] ||
        capitalize(status) ||
        "Desconhecido"
    );
}

function getStatusClass(status) {
    switch (
        String(status)
            .toLowerCase()
    ) {
        case "active":
        case "accepted":
            return "active";

        case "pending":
            return "pending";

        case "rejected":
        case "expired":
        case "terminated":
        case "cancelled":
            return "negative";

        case "completed":
            return "completed";

        default:
            return "";
    }
}

/* ============================================================
   VALORES
   ============================================================ */

function calculateFightValue(
    contract
) {
    if (!contract) {
        return 0;
    }

    return (
        Number(contract.purse) +
        Number(contract.winBonus)
    );
}

function calculatePotentialValue(
    contract
) {
    if (!contract) {
        return 0;
    }

    const fights =
        Number(
            contract.fights
        ) || 0;

    return (
        Number(contract.purse) * fights +
        Number(contract.winBonus) * fights +
        Number(contract.signingBonus) +
        Number(contract.titleBonus) +
        Number(contract.mainEventBonus)
    );
}

/* ============================================================
   CABEÇALHO
   ============================================================ */

function renderHeader(
    database
) {
    const player =
        getPlayer(database);

    const activeContract =
        getActiveContract(
            database
        );

    const offers =
        getOffers(database);

    return `
        <header class="contracts-header">
            <div class="contracts-header-main">
                <div class="contracts-header-icon">
                    📄
                </div>

                <div>
                    <span class="contracts-kicker">
                        CARREIRA PROFISSIONAL
                    </span>

                    <h2>
                        Contratos
                    </h2>

                    <p>
                        Gerencie ofertas, bolsas,
                        bônus e compromissos da sua carreira.
                    </p>
                </div>
            </div>

            <div class="contracts-player-summary">
                <strong>
                    ${escapeHTML(
                        getPlayerName(
                            player
                        )
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        getCurrentPromotionName(
                            database
                        )
                    )}
                </span>

                <small>
                    ${
                        activeContract
                            ? "Contrato ativo"
                            : offers.length
                                ? `${formatNumber(
                                    offers.length
                                )} oferta(s)`
                                : "Sem contrato"
                    }
                </small>
            </div>
        </header>
    `;
}

/* ============================================================
   TABS
   ============================================================ */

const CONTRACT_TABS = [
    {
        id: "overview",
        label: "Visão geral"
    },
    {
        id: "offers",
        label: "Ofertas"
    },
    {
        id: "active",
        label: "Contrato atual"
    },
    {
        id: "history",
        label: "Histórico"
    }
];

function renderTabs() {
    return `
        <div class="contracts-tabs">
            ${CONTRACT_TABS.map(
                tab => `
                    <button
                        class="contracts-tab ${
                            contractsScreenState.activeTab ===
                            tab.id
                                ? "active"
                                : ""
                        }"
                        data-contract-tab="${escapeHTML(
                            tab.id
                        )}"
                    >
                        ${escapeHTML(
                            tab.label
                        )}
                    </button>
                `
            ).join("")}
        </div>
    `;
}

/* ============================================================
   VISÃO GERAL
   ============================================================ */

function renderOverview(
    database
) {
    const active =
        getActiveContract(
            database
        );

    const offers =
        getOffers(database);

    const history =
        getContractHistoryEntries(
            database
        );

    const record =
        getCareerRecord(database);

    const player =
        getPlayer(database);

    return `
        <section class="contracts-section">
            <div class="contracts-section-header">
                <div>
                    <span class="contracts-kicker">
                        SITUAÇÃO
                    </span>

                    <h3>
                        Resumo contratual
                    </h3>
                </div>
            </div>

            <div class="contracts-summary-grid">
                <div class="contract-stat-card">
                    <span>
                        CONTRATO
                    </span>

                    <strong>
                        ${
                            active
                                ? "ATIVO"
                                : "LIVRE"
                        }
                    </strong>

                    <small>
                        ${
                            active
                                ? escapeHTML(
                                    active.promotionName
                                )
                                : "Você está disponível para novas propostas."
                        }
                    </small>
                </div>

                <div class="contract-stat-card">
                    <span>
                        OFERTAS
                    </span>

                    <strong>
                        ${formatNumber(
                            offers.length
                        )}
                    </strong>

                    <small>
                        Propostas pendentes
                    </small>
                </div>

                <div class="contract-stat-card">
                    <span>
                        CONTRATOS
                    </span>

                    <strong>
                        ${formatNumber(
                            history.length +
                            (active ? 1 : 0)
                        )}
                    </strong>

                    <small>
                        Na carreira
                    </small>
                </div>

                <div class="contract-stat-card">
                    <span>
                        RECORD
                    </span>

                    <strong>
                        ${formatNumber(
                            record.wins
                        )}-${formatNumber(
                            record.losses
                        )}
                    </strong>

                    <small>
                        ${formatNumber(
                            record.draws
                        )} empates
                    </small>
                </div>
            </div>
        </section>

        ${
            active
                ? renderActiveContractCard(
                    active,
                    database
                )
                : renderFreeAgentCard(
                    database
                )
        }

        ${
            offers.length
                ? `
                    <section class="contracts-section">
                        <div class="contracts-section-header">
                            <div>
                                <span class="contracts-kicker">
                                    MERCADO
                                </span>

                                <h3>
                                    Ofertas recebidas
                                </h3>
                            </div>

                            <button
                                class="contracts-link-button"
                                data-contract-tab="offers"
                            >
                                Ver todas
                            </button>
                        </div>

                        <div class="contracts-offers-grid">
                            ${offers
                                .slice(0, 3)
                                .map(
                                    offer =>
                                        renderOfferCard(
                                            offer,
                                            database
                                        )
                                )
                                .join("")}
                        </div>
                    </section>
                `
                : ""
        }

        <section class="contracts-section">
            <div class="contracts-section-header">
                <div>
                    <span class="contracts-kicker">
                        VALOR
                    </span>

                    <h3>
                        Potencial financeiro
                    </h3>
                </div>
            </div>

            <div class="contract-value-panel">
                <div>
                    <span>
                        OVR atual
                    </span>

                    <strong>
                        ${formatNumber(
                            getPlayerOverall(
                                player
                            )
                        )}
                    </strong>
                </div>

                <div>
                    <span>
                        Divisão
                    </span>

                    <strong>
                        ${escapeHTML(
                            getCurrentDivision(
                                database
                            )
                        )}
                    </strong>
                </div>

                <div>
                    <span>
                        Organização
                    </span>

                    <strong>
                        ${escapeHTML(
                            getCurrentPromotionName(
                                database
                            )
                        )}
                    </strong>
                </div>
            </div>
        </section>
    `;
}

/* ============================================================
   FREE AGENT
   ============================================================ */

function renderFreeAgentCard() {
    return `
        <section class="contracts-section">
            <div class="free-agent-card">
                <div class="free-agent-icon">
                    🥊
                </div>

                <div>
                    <span class="contracts-kicker">
                        STATUS
                    </span>

                    <h3>
                        Agente livre
                    </h3>

                    <p>
                        Você não possui contrato ativo.
                        Novas organizações podem enviar propostas
                        conforme sua carreira evolui.
                    </p>
                </div>
            </div>
        </section>
    `;
}

/* ============================================================
   CONTRATO ATIVO
   ============================================================ */

function renderActiveContractCard(
    contract,
    database
) {
    return `
        <section class="contracts-section">
            <div class="contracts-section-header">
                <div>
                    <span class="contracts-kicker">
                        CONTRATO ATUAL
                    </span>

                    <h3>
                        ${escapeHTML(
                            contract.promotionName
                        )}
                    </h3>
                </div>

                <span class="contract-status active">
                    ${escapeHTML(
                        getStatusLabel(
                            contract.status
                        )
                    )}
                </span>
            </div>

            <div class="active-contract-card">
                <div class="active-contract-main">
                    <div class="contract-promotion-logo">
                        ${escapeHTML(
                            (
                                contract
                                    .promotionShortName ||
                                contract
                                    .promotionName ||
                                "MMA"
                            )
                                .slice(0, 3)
                                .toUpperCase()
                        )}
                    </div>

                    <div>
                        <span class="contracts-kicker">
                            ORGANIZAÇÃO
                        </span>

                        <h3>
                            ${escapeHTML(
                                contract.promotionName
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                contract.division
                            )}
                        </p>
                    </div>
                </div>

                ${renderContractStats(
                    contract
                )}

                ${renderContractClauses(
                    contract
                )}

                <div class="contract-card-actions">
                    <button
                        class="contract-primary-button"
                        data-contract-action="details"
                        data-contract-id="${escapeHTML(
                            contract.id
                        )}"
                    >
                        Ver contrato
                    </button>

                    ${
                        contract.renegotiation
                            ? `
                                <button
                                    class="contract-secondary-button"
                                    data-contract-action="renegotiate"
                                    data-contract-id="${escapeHTML(
                                        contract.id
                                    )}"
                                >
                                    Renegociar
                                </button>
                            `
                            : ""
                    }
                </div>
            </div>
        </section>
    `;
}

/* ============================================================
   STATS DO CONTRATO
   ============================================================ */

function renderContractStats(
    contract
) {
    return `
        <div class="contract-details-grid">
            <div class="contract-detail">
                <span>
                    LUTAS
                </span>

                <strong>
                    ${formatNumber(
                        contract.fights
                    )}
                </strong>

                <small>
                    ${formatNumber(
                        contract.remainingFights
                    )}
                    restantes
                </small>
            </div>

            <div class="contract-detail">
                <span>
                    BOLSA
                </span>

                <strong>
                    ${formatMoney(
                        contract.purse
                    )}
                </strong>

                <small>
                    por luta
                </small>
            </div>

            <div class="contract-detail">
                <span>
                    WIN BONUS
                </span>

                <strong>
                    ${formatMoney(
                        contract.winBonus
                    )}
                </strong>

                <small>
                    por vitória
                </small>
            </div>

            <div class="contract-detail">
                <span>
                    VALOR POR VITÓRIA
                </span>

                <strong>
                    ${formatMoney(
                        calculateFightValue(
                            contract
                        )
                    )}
                </strong>

                <small>
                    bolsa + bônus
                </small>
            </div>
        </div>
    `;
}

/* ============================================================
   CLÁUSULAS
   ============================================================ */

function renderContractClauses(
    contract
) {
    const clauses = [];

    if (contract.titleShot) {
        clauses.push(
            "Possui oportunidade de título"
        );
    }

    if (contract.immediateTitleShot) {
        clauses.push(
            "Title shot imediato"
        );
    }

    if (contract.exclusive) {
        clauses.push(
            "Contrato exclusivo"
        );
    }

    if (contract.automaticExtension) {
        clauses.push(
            "Renovação automática"
        );
    }

    if (contract.renegotiation) {
        clauses.push(
            "Permite renegociação"
        );
    }

    if (contract.signingBonus > 0) {
        clauses.push(
            `Bônus de assinatura: ${formatMoney(
                contract.signingBonus
            )}`
        );
    }

    if (contract.titleBonus > 0) {
        clauses.push(
            `Bônus de título: ${formatMoney(
                contract.titleBonus
            )}`
        );
    }

    if (contract.mainEventBonus > 0) {
        clauses.push(
            `Bônus de main event: ${formatMoney(
                contract.mainEventBonus
            )}`
        );
    }

    if (!clauses.length) {
        return "";
    }

    return `
        <div class="contract-clauses">
            <span class="contracts-kicker">
                CLÁUSULAS E BENEFÍCIOS
            </span>

            <div>
                ${clauses.map(
                    clause => `
                        <span class="contract-clause">
                            ✓
                            ${escapeHTML(
                                clause
                            )}
                        </span>
                    `
                ).join("")}
            </div>
        </div>
    `;
}

/* ============================================================
   OFERTAS
   ============================================================ */

function renderOffers(
    database
) {
    const offers =
        getOffers(database);

    return `
        <section class="contracts-section">
            <div class="contracts-section-header">
                <div>
                    <span class="contracts-kicker">
                        MERCADO
                    </span>

                    <h3>
                        Ofertas de contrato
                    </h3>

                    <p>
                        Avalie as propostas disponíveis
                        antes de aceitar uma nova oportunidade.
                    </p>
                </div>
            </div>

            ${
                offers.length
                    ? `
                        <div class="contracts-offers-grid large">
                            ${offers
                                .map(
                                    offer =>
                                        renderOfferCard(
                                            offer,
                                            database
                                        )
                                )
                                .join("")}
                        </div>
                    `
                    : `
                        <div class="contracts-empty">
                            <strong>
                                Nenhuma oferta pendente
                            </strong>

                            <span>
                                Continue lutando, aumentando sua fama
                                e melhorando seu ranking para atrair
                                novas organizações.
                            </span>
                        </div>
                    `
            }
        </section>
    `;
}

function renderOfferCard(
    offer,
    database
) {
    const potential =
        calculatePotentialValue(
            offer
        );

    return `
        <article
            class="contract-offer-card ${
                contractsScreenState
                    .selectedContractId ===
                offer.id
                    ? "selected"
                    : ""
            }"
        >
            <div class="offer-card-header">
                <div>
                    <span class="contracts-kicker">
                        PROPOSTA
                    </span>

                    <h4>
                        ${escapeHTML(
                            offer.promotionName
                        )}
                    </h4>
                </div>

                <span class="contract-status pending">
                    ${escapeHTML(
                        getStatusLabel(
                            offer.status
                        )
                    )}
                </span>
            </div>

            <div class="offer-card-division">
                ${escapeHTML(
                    offer.division
                )}
            </div>

            <div class="offer-card-stats">
                <div>
                    <span>
                        LUTAS
                    </span>

                    <strong>
                        ${formatNumber(
                            offer.fights
                        )}
                    </strong>
                </div>

                <div>
                    <span>
                        BOLSA
                    </span>

                    <strong>
                        ${formatMoney(
                            offer.purse
                        )}
                    </strong>
                </div>

                <div>
                    <span>
                        VITÓRIA
                    </span>

                    <strong>
                        ${formatMoney(
                            offer.winBonus
                        )}
                    </strong>
                </div>
            </div>

            <div class="offer-potential">
                <span>
                    POTENCIAL DO CONTRATO
                </span>

                <strong>
                    ${formatMoney(
                        potential
                    )}
                </strong>

                <small>
                    considerando todas as lutas
                    + bônus cadastrados
                </small>
            </div>

            ${renderOfferClauses(
                offer
            )}

            <div class="offer-card-actions">
                <button
                    class="contract-primary-button"
                    data-contract-action="accept"
                    data-contract-id="${escapeHTML(
                        offer.id
                    )}"
                >
                    Aceitar
                </button>

                <button
                    class="contract-secondary-button"
                    data-contract-action="details"
                    data-contract-id="${escapeHTML(
                        offer.id
                    )}"
                >
                    Detalhes
                </button>

                <button
                    class="contract-danger-button"
                    data-contract-action="reject"
                    data-contract-id="${escapeHTML(
                        offer.id
                    )}"
                >
                    Recusar
                </button>
            </div>
        </article>
    `;
}

function renderOfferClauses(
    offer
) {
    const clauses = [];

    if (offer.titleShot) {
        clauses.push(
            "Title shot"
        );
    }

    if (offer.immediateTitleShot) {
        clauses.push(
            "Título imediato"
        );
    }

    if (offer.exclusive) {
        clauses.push(
            "Exclusivo"
        );
    }

    if (offer.signingBonus > 0) {
        clauses.push(
            `Signing bonus ${formatMoney(
                offer.signingBonus
            )}`
        );
    }

    if (!clauses.length) {
        return "";
    }

    return `
        <div class="offer-clauses">
            ${clauses.map(
                clause => `
                    <span>
                        ✓ ${escapeHTML(
                            clause
                        )}
                    </span>
                `
            ).join("")}
        </div>
    `;
}

/* ============================================================
   HISTÓRICO
   ============================================================ */

function renderHistory(
    database
) {
    const history =
        getContractHistoryEntries(
            database
        );

    return `
        <section class="contracts-section">
            <div class="contracts-section-header">
                <div>
                    <span class="contracts-kicker">
                        CARREIRA
                    </span>

                    <h3>
                        Histórico de contratos
                    </h3>
                </div>
            </div>

            ${
                history.length
                    ? `
                        <div class="contracts-history">
                            ${history
                                .map(
                                    (
                                        contract,
                                        index
                                    ) =>
                                        renderHistoryRow(
                                            contract,
                                            index
                                        )
                                )
                                .join("")}
                        </div>
                    `
                    : `
                        <div class="contracts-empty">
                            <strong>
                                Nenhum contrato encerrado
                            </strong>

                            <span>
                                Seu histórico aparecerá aqui
                                conforme sua carreira avançar.
                            </span>
                        </div>
                    `
            }
        </section>
    `;
}

function renderHistoryRow(
    contract,
    index
) {
    return `
        <article class="contract-history-row">
            <div class="history-contract-number">
                #${formatNumber(
                    index + 1
                )}
            </div>

            <div class="history-contract-main">
                <strong>
                    ${escapeHTML(
                        contract.promotionName
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        contract.division
                    )}
                </span>
            </div>

            <div class="history-contract-fights">
                <span>
                    LUTAS
                </span>

                <strong>
                    ${formatNumber(
                        contract.fights
                    )}
                </strong>
            </div>

            <div class="history-contract-purse">
                <span>
                    BOLSA
                </span>

                <strong>
                    ${formatMoney(
                        contract.purse
                    )}
                </strong>
            </div>

            <div>
                <span class="contract-status ${
                    getStatusClass(
                        contract.status
                    )
                }">
                    ${escapeHTML(
                        getStatusLabel(
                            contract.status
                        )
                    )}
                </span>
            </div>
        </article>
    `;
}

/* ============================================================
   CONTRATO DETALHADO
   ============================================================ */

function renderContractDetails(
    contract
) {
    if (!contract) {
        return `
            <section class="contracts-section">
                <div class="contracts-empty">
                    Contrato não encontrado.
                </div>
            </section>
        `;
    }

    return `
        <section class="contracts-section">
            <button
                class="contracts-back-button"
                data-contract-action="back"
            >
                ← Voltar
            </button>

            <div class="contract-detail-header">
                <div>
                    <span class="contracts-kicker">
                        CONTRATO
                    </span>

                    <h3>
                        ${escapeHTML(
                            contract.promotionName
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            contract.division
                        )}
                    </p>
                </div>

                <span class="contract-status ${
                    getStatusClass(
                        contract.status
                    )
                }">
                    ${escapeHTML(
                        getStatusLabel(
                            contract.status
                        )
                    )}
                </span>
            </div>

            ${renderContractStats(
                contract
            )}

            <div class="contract-full-grid">
                <div class="contract-full-panel">
                    <span class="contracts-kicker">
                        FINANCEIRO
                    </span>

                    <h4>
                        Valores
                    </h4>

                    <div class="contract-full-list">
                        ${renderFullValueRow(
                            "Bolsa por luta",
                            formatMoney(
                                contract.purse
                            )
                        )}

                        ${renderFullValueRow(
                            "Bônus de vitória",
                            formatMoney(
                                contract.winBonus
                            )
                        )}

                        ${renderFullValueRow(
                            "Bônus de título",
                            formatMoney(
                                contract.titleBonus
                            )
                        )}

                        ${renderFullValueRow(
                            "Bônus de main event",
                            formatMoney(
                                contract.mainEventBonus
                            )
                        )}

                        ${renderFullValueRow(
                            "Bônus de assinatura",
                            formatMoney(
                                contract.signingBonus
                            )
                        )}

                        ${renderFullValueRow(
                            "Garantido",
                            formatMoney(
                                contract.guaranteed
                            )
                        )}

                        ${renderFullValueRow(
                            "Potencial máximo",
                            formatMoney(
                                calculatePotentialValue(
                                    contract
                                )
                            )
                        )}
                    </div>
                </div>

                <div class="contract-full-panel">
                    <span class="contracts-kicker">
                        ESTRUTURA
                    </span>

                    <h4>
                        Condições
                    </h4>

                    <div class="contract-full-list">
                        ${renderFullValueRow(
                            "Lutas contratadas",
                            formatNumber(
                                contract.fights
                            )
                        )}

                        ${renderFullValueRow(
                            "Lutas concluídas",
                            formatNumber(
                                contract.completedFights
                            )
                        )}

                        ${renderFullValueRow(
                            "Lutas restantes",
                            formatNumber(
                                contract.remainingFights
                            )
                        )}

                        ${renderFullValueRow(
                            "Duração",
                            contract.duration
                                ? `${formatNumber(
                                    contract.duration
                                )} meses`
                                : "Não informada"
                        )}

                        ${renderFullValueRow(
                            "Exclusividade",
                            contract.exclusive
                                ? "Sim"
                                : "Não"
                        )}

                        ${renderFullValueRow(
                            "Renegociação",
                            contract.renegotiation
                                ? "Permitida"
                                : "Não prevista"
                        )}
                    </div>
                </div>
            </div>

            ${renderContractClauses(
                contract
            )}

            ${
                contract.notes
                    ? `
                        <div class="contract-notes">
                            <span class="contracts-kicker">
                                OBSERVAÇÕES
                            </span>

                            <p>
                                ${escapeHTML(
                                    contract.notes
                                )}
                            </p>
                        </div>
                    `
                    : ""
            }

            ${
                contract.type === "offer"
                    ? `
                        <div class="contract-detail-actions">
                            <button
                                class="contract-primary-button"
                                data-contract-action="accept"
                                data-contract-id="${escapeHTML(
                                    contract.id
                                )}"
                            >
                                Aceitar proposta
                            </button>

                            <button
                                class="contract-danger-button"
                                data-contract-action="reject"
                                data-contract-id="${escapeHTML(
                                    contract.id
                                )}"
                            >
                                Recusar
                            </button>
                        </div>
                    `
                    : ""
            }
        </section>
    `;
}

function renderFullValueRow(
    label,
    value
) {
    return `
        <div class="contract-full-row">
            <span>
                ${escapeHTML(
                    label
                )}
            </span>

            <strong>
                ${escapeHTML(
                    value
                )}
            </strong>
        </div>
    `;
}

/* ============================================================
   RENDER PRINCIPAL
   ============================================================ */

function render(
    database = null
) {
    const db =
        getDatabase(database);

    contractsScreenState.database =
        db;

    const content =
        ensureContent();

    let body;

    if (
        contractsScreenState
            .selectedContractId
    ) {
        const contract =
            getAllContracts(db)
                .find(
                    item =>
                        String(
                            item.id
                        ) ===
                        String(
                            contractsScreenState
                                .selectedContractId
                        )
                );

        body =
            renderContractDetails(
                contract
            );
    } else {
        body =
            renderActiveTab(db);
    }

    content.innerHTML = `
        <div class="contracts-screen">
            ${renderHeader(db)}

            ${
                contractsScreenState
                    .selectedContractId
                    ? ""
                    : renderTabs()
            }

            <div class="contracts-screen-content">
                ${body}
            </div>
        </div>
    `;

    contractsScreenState.lastRender =
        Date.now();

    bindEvents();

    return content;
}

function renderActiveTab(
    database
) {
    switch (
        contractsScreenState.activeTab
    ) {
        case "offers":
            return renderOffers(
                database
            );

        case "active": {
            const active =
                getActiveContract(
                    database
                );

            return active
                ? renderActiveContractCard(
                    active,
                    database
                )
                : renderFreeAgentCard(
                    database
                );
        }

        case "history":
            return renderHistory(
                database
            );

        case "overview":
        default:
            return renderOverview(
                database
            );
    }
}

/* ============================================================
   AÇÕES
   ============================================================ */

function getContractsAPI() {
    return (
        window.contractsAPI ||
        window.MMA_LIFE_CONTRACTS ||
        window.promotionsAPI ||
        window.MMA_LIFE_PROMOTIONS ||
        null
    );
}

function performContractAction(
    action,
    contractId
) {
    const api =
        getContractsAPI();

    const database =
        contractsScreenState.database ||
        getDatabase();

    const contract =
        getAllContracts(database)
            .find(
                item =>
                    String(
                        item.id
                    ) ===
                    String(
                        contractId
                    )
            );

    if (!contract) {
        return false;
    }

    try {
        if (
            action === "accept"
        ) {
            if (
                typeof api?.acceptOffer ===
                "function"
            ) {
                api.acceptOffer(
                    database,
                    contractId
                );
            } else if (
                typeof api?.acceptContract ===
                "function"
            ) {
                api.acceptContract(
                    database,
                    contractId
                );
            } else {
                contract.status =
                    "accepted";
            }
        }

        if (
            action === "reject"
        ) {
            if (
                typeof api?.rejectOffer ===
                "function"
            ) {
                api.rejectOffer(
                    database,
                    contractId
                );
            } else if (
                typeof api?.rejectContract ===
                "function"
            ) {
                api.rejectContract(
                    database,
                    contractId
                );
            } else {
                contract.status =
                    "rejected";
            }
        }

        if (
            action === "renegotiate"
        ) {
            if (
                typeof api?.renegotiate ===
                "function"
            ) {
                api.renegotiate(
                    database,
                    contractId
                );
            } else if (
                typeof api?.renegotiateContract ===
                "function"
            ) {
                api.renegotiateContract(
                    database,
                    contractId
                );
            }
        }

        return true;
    } catch (error) {
        console.error(
            "MMA Life Dynasty — erro na ação contratual:",
            error
        );

        return false;
    }
}

/* ============================================================
   EVENTOS DOM
   ============================================================ */

function bindEvents() {
    document
        .querySelectorAll(
            "[data-contract-tab]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    setTab(
                        button.dataset
                            .contractTab
                    );
                }
            );
        });

    document
        .querySelectorAll(
            "[data-contract-action]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    handleAction(
                        button.dataset
                            .contractAction,
                        button.dataset
                            .contractId
                    );
                }
            );
        });
}

function handleAction(
    action,
    contractId
) {
    if (
        action === "details"
    ) {
        contractsScreenState
            .selectedContractId =
            contractId;

        render(
            contractsScreenState.database
        );

        return;
    }

    if (
        action === "back"
    ) {
        contractsScreenState
            .selectedContractId =
            null;

        render(
            contractsScreenState.database
        );

        return;
    }

    if (
        action === "accept" ||
        action === "reject" ||
        action === "renegotiate"
    ) {
        const success =
            performContractAction(
                action,
                contractId
            );

        if (success) {
            contractsScreenState
                .selectedContractId =
                null;

            refresh();
        }
    }
}

/* ============================================================
   NAVEGAÇÃO
   ============================================================ */

function setTab(tab) {
    const valid =
        CONTRACT_TABS.some(
            item =>
                item.id === tab
        );

    if (!valid) {
        return false;
    }

    contractsScreenState
        .activeTab =
        tab;

    contractsScreenState
        .selectedContractId =
        null;

    render(
        contractsScreenState.database ||
        getDatabase()
    );

    return true;
}

function selectContract(
    contractId
) {
    contractsScreenState
        .selectedContractId =
        contractId;

    render(
        contractsScreenState.database ||
        getDatabase()
    );

    return true;
}

function clearSelection() {
    contractsScreenState
        .selectedContractId =
        null;

    render(
        contractsScreenState.database ||
        getDatabase()
    );

    return true;
}

function open(
    tab = "overview",
    database = null
) {
    contractsScreenState
        .activeTab =
        CONTRACT_TABS.some(
            item =>
                item.id === tab
        )
            ? tab
            : "overview";

    contractsScreenState
        .selectedContractId =
        null;

    return initialize(
        database
    );
}

function close() {
    const content =
        getElement(
            "mma-life-content"
        );

    if (content) {
        content.innerHTML = "";
    }
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

function initialize(
    database = null
) {
    contractsScreenState.database =
        getDatabase(database);

    contractsScreenState.initialized =
        true;

    injectStyles();

    return render(
        contractsScreenState.database
    );
}

function refresh(
    database = null
) {
    if (database) {
        contractsScreenState.database =
            database;
    }

    injectStyles();

    return render(
        contractsScreenState.database ||
        getDatabase()
    );
}

/* ============================================================
   ESTADO / SNAPSHOT / VALIDAÇÃO
   ============================================================ */

function getState() {
    return clone(
        contractsScreenState
    );
}

function getSnapshot() {
    const database =
        contractsScreenState.database ||
        getDatabase();

    return {
        version:
            CONTRACTS_SCREEN_VERSION,

        state:
            getState(),

        activeContract:
            getActiveContract(
                database
            ),

        offers:
            getOffers(
                database
            ),

        history:
            getContractHistoryEntries(
                database
            )
    };
}

function validate(
    database = null
) {
    const db =
        database ||
        contractsScreenState.database;

    const errors = [];
    const warnings = [];

    if (!db) {
        errors.push(
            "Database não encontrada."
        );
    }

    if (
        !CONTRACT_TABS.some(
            tab =>
                tab.id ===
                contractsScreenState.activeTab
        )
    ) {
        warnings.push(
            "A aba atual é inválida."
        );
    }

    if (db) {
        const offers =
            getOffers(db);

        const active =
            getActiveContract(db);

        if (
            offers.length === 0 &&
            !active
        ) {
            warnings.push(
                "O jogador não possui contrato ativo nem ofertas pendentes."
            );
        }
    }

    return {
        valid:
            errors.length === 0,

        errors,
        warnings
    };
}

/* ============================================================
   ESTILOS
   ============================================================ */

function injectStyles() {
    if (
        getElement(
            "mma-life-contracts-screen-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement("style");

    style.id =
        "mma-life-contracts-screen-styles";

    style.textContent = `
        .contracts-screen {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 24px;
            box-sizing: border-box;
        }

        .contracts-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
            padding: 26px;
            margin-bottom: 18px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 20px;
            background: rgba(255,255,255,.035);
        }

        .contracts-header-main {
            display: flex;
            align-items: center;
            gap: 15px;
            min-width: 0;
        }

        .contracts-header-icon {
            width: 58px;
            height: 58px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 16px;
            background: rgba(255,255,255,.08);
            font-size: 25px;
        }

        .contracts-header h2 {
            margin: 0;
            font-size: 28px;
        }

        .contracts-header p {
            margin: 7px 0 0;
            font-size: 12px;
            line-height: 1.5;
            opacity: .55;
        }

        .contracts-kicker {
            display: block;
            margin-bottom: 5px;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .14em;
            text-transform: uppercase;
            opacity: .48;
        }

        .contracts-player-summary {
            min-width: 190px;
            padding: 14px 16px;
            border-radius: 14px;
            background: rgba(255,255,255,.04);
        }

        .contracts-player-summary strong,
        .contracts-player-summary span,
        .contracts-player-summary small {
            display: block;
        }

        .contracts-player-summary strong {
            font-size: 13px;
        }

        .contracts-player-summary span {
            margin-top: 4px;
            font-size: 10px;
            opacity: .55;
        }

        .contracts-player-summary small {
            margin-top: 5px;
            font-size: 10px;
            font-weight: 800;
        }

        .contracts-tabs {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            margin-bottom: 20px;
        }

        .contracts-tab,
        .contracts-link-button,
        .contracts-back-button {
            border: 1px solid rgba(255,255,255,.08);
            background: rgba(255,255,255,.035);
            color: inherit;
            border-radius: 10px;
            padding: 10px 13px;
            font: inherit;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
            white-space: nowrap;
        }

        .contracts-tab.active {
            background: rgba(255,255,255,.12);
            border-color: rgba(255,255,255,.16);
        }

        .contracts-section {
            margin-bottom: 22px;
        }

        .contracts-section-header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 15px;
            margin-bottom: 15px;
        }

        .contracts-section-header h3 {
            margin: 0;
            font-size: 21px;
        }

        .contracts-section-header p {
            margin: 7px 0 0;
            font-size: 11px;
            opacity: .5;
        }

        .contracts-summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
        }

        .contract-stat-card {
            padding: 18px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 16px;
            background: rgba(255,255,255,.03);
        }

        .contract-stat-card span,
        .contract-stat-card strong,
        .contract-stat-card small {
            display: block;
        }

        .contract-stat-card span {
            font-size: 8px;
            font-weight: 900;
            letter-spacing: .08em;
            opacity: .45;
        }

        .contract-stat-card strong {
            margin-top: 7px;
            font-size: 22px;
        }

        .contract-stat-card small {
            margin-top: 4px;
            font-size: 9px;
            line-height: 1.4;
            opacity: .5;
        }

        .active-contract-card,
        .contract-offer-card {
            padding: 20px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 18px;
            background: rgba(255,255,255,.025);
        }

        .active-contract-main {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 18px;
        }

        .contract-promotion-logo {
            width: 52px;
            height: 52px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 14px;
            background: rgba(255,255,255,.08);
            font-size: 12px;
            font-weight: 900;
        }

        .active-contract-main h3 {
            margin: 0;
            font-size: 19px;
        }

        .active-contract-main p {
            margin: 5px 0 0;
            font-size: 10px;
            opacity: .5;
        }

        .contract-details-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-top: 15px;
        }

        .contract-detail {
            padding: 14px;
            border-radius: 13px;
            background: rgba(255,255,255,.035);
        }

        .contract-detail span,
        .contract-detail strong,
        .contract-detail small {
            display: block;
        }

        .contract-detail span {
            font-size: 8px;
            font-weight: 900;
            opacity: .43;
        }

        .contract-detail strong {
            margin-top: 6px;
            font-size: 14px;
        }

        .contract-detail small {
            margin-top: 3px;
            font-size: 8px;
            opacity: .42;
        }

        .contract-status {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 5px 8px;
            border-radius: 8px;
            font-size: 7px;
            font-weight: 900;
            letter-spacing: .06em;
            text-transform: uppercase;
            background: rgba(255,255,255,.07);
            opacity: .75;
        }

        .contract-status.active,
        .contract-status.completed {
            opacity: 1;
        }

        .contract-status.negative {
            opacity: .45;
        }

        .contract-status.pending {
            opacity: .7;
        }

        .contract-clauses {
            margin-top: 18px;
            padding-top: 16px;
            border-top: 1px solid rgba(255,255,255,.07);
        }

        .contract-clauses > div {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
        }

        .contract-clause {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 7px 9px;
            border-radius: 8px;
            background: rgba(255,255,255,.045);
            font-size: 8px;
        }

        .contract-card-actions,
        .offer-card-actions,
        .contract-detail-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 18px;
        }

        .contract-primary-button,
        .contract-secondary-button,
        .contract-danger-button {
            border: 1px solid rgba(255,255,255,.1);
            color: inherit;
            border-radius: 9px;
            padding: 9px 12px;
            background: rgba(255,255,255,.06);
            font: inherit;
            font-size: 9px;
            font-weight: 800;
            cursor: pointer;
        }

        .contract-primary-button {
            background: rgba(255,255,255,.12);
        }

        .contract-danger-button {
            opacity: .65;
        }

        .contracts-offers-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
        }

        .contracts-offers-grid.large {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .contract-offer-card.selected {
            border-color: rgba(255,255,255,.18);
        }

        .offer-card-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 10px;
        }

        .offer-card-header h4 {
            margin: 0;
            font-size: 15px;
        }

        .offer-card-division {
            margin-top: 5px;
            font-size: 9px;
            opacity: .45;
        }

        .offer-card-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 7px;
            margin-top: 17px;
        }

        .offer-card-stats > div {
            padding: 11px;
            border-radius: 10px;
            background: rgba(255,255,255,.035);
        }

        .offer-card-stats span,
        .offer-card-stats strong {
            display: block;
        }

        .offer-card-stats span {
            font-size: 7px;
            opacity: .42;
        }

        .offer-card-stats strong {
            margin-top: 5px;
            font-size: 11px;
        }

        .offer-potential {
            margin-top: 10px;
            padding: 12px;
            border-radius: 11px;
            background: rgba(255,255,255,.045);
        }

        .offer-potential span,
        .offer-potential strong,
        .offer-potential small {
            display: block;
        }

        .offer-potential span {
            font-size: 7px;
            font-weight: 900;
            opacity: .43;
        }

        .offer-potential strong {
            margin-top: 4px;
            font-size: 15px;
        }

        .offer-potential small {
            margin-top: 3px;
            font-size: 7px;
            opacity: .4;
        }

        .offer-clauses {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 10px;
        }

        .offer-clauses span {
            padding: 5px 7px;
            border-radius: 7px;
            background: rgba(255,255,255,.04);
            font-size: 7px;
        }

        .free-agent-card {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 20px;
            border: 1px dashed rgba(255,255,255,.12);
            border-radius: 17px;
            background: rgba(255,255,255,.02);
        }

        .free-agent-icon {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 13px;
            background: rgba(255,255,255,.07);
            font-size: 21px;
        }

        .free-agent-card h3 {
            margin: 0;
            font-size: 16px;
        }

        .free-agent-card p {
            margin: 5px 0 0;
            font-size: 10px;
            line-height: 1.5;
            opacity: .5;
        }

        .contract-value-panel {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            padding: 18px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 16px;
            background: rgba(255,255,255,.025);
        }

        .contract-value-panel span,
        .contract-value-panel strong {
            display: block;
        }

        .contract-value-panel span {
            font-size: 8px;
            opacity: .45;
        }

        .contract-value-panel strong {
            margin-top: 5px;
            font-size: 13px;
        }

        .contracts-history {
            display: grid;
            gap: 8px;
        }

        .contract-history-row {
            display: grid;
            grid-template-columns: 50px minmax(180px, 1fr) 90px 120px 100px;
            align-items: center;
            gap: 12px;
            padding: 13px;
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 13px;
            background: rgba(255,255,255,.025);
        }

        .history-contract-number {
            font-size: 10px;
            font-weight: 900;
            opacity: .45;
        }

        .history-contract-main strong,
        .history-contract-main span,
        .history-contract-fights span,
        .history-contract-fights strong,
        .history-contract-purse span,
        .history-contract-purse strong {
            display: block;
        }

        .history-contract-main strong {
            font-size: 11px;
        }

        .history-contract-main span,
        .history-contract-fights span,
        .history-contract-purse span {
            margin-top: 3px;
            font-size: 8px;
            opacity: .42;
        }

        .history-contract-fights strong,
        .history-contract-purse strong {
            margin-top: 3px;
            font-size: 10px;
        }

        .contracts-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 140px;
            padding: 25px;
            border: 1px dashed rgba(255,255,255,.1);
            border-radius: 15px;
            text-align: center;
        }

        .contracts-empty strong {
            font-size: 12px;
        }

        .contracts-empty span {
            max-width: 420px;
            margin-top: 7px;
            font-size: 9px;
            line-height: 1.5;
            opacity: .48;
        }

        .contracts-back-button {
            margin-bottom: 18px;
        }

        .contract-detail-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 15px;
            margin-bottom: 17px;
        }

        .contract-detail-header h3 {
            margin: 0;
            font-size: 23px;
        }

        .contract-detail-header p {
            margin: 5px 0 0;
            font-size: 10px;
            opacity: .5;
        }

        .contract-full-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
            margin-top: 14px;
        }

        .contract-full-panel {
            padding: 18px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 16px;
            background: rgba(255,255,255,.025);
        }

        .contract-full-panel h4 {
            margin: 0 0 14px;
            font-size: 15px;
        }

        .contract-full-list {
            display: grid;
            gap: 7px;
        }

        .contract-full-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 9px 0;
            border-bottom: 1px solid rgba(255,255,255,.05);
        }

        .contract-full-row:last-child {
            border-bottom: 0;
        }

        .contract-full-row span {
            font-size: 9px;
            opacity: .48;
        }

        .contract-full-row strong {
            font-size: 10px;
            text-align: right;
        }

        .contract-notes {
            margin-top: 14px;
            padding: 16px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 14px;
            background: rgba(255,255,255,.025);
        }

        .contract-notes p {
            margin: 7px 0 0;
            font-size: 10px;
            line-height: 1.5;
            opacity: .55;
        }

        @media (max-width: 1050px) {
            .contracts-summary-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .contracts-offers-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .contract-history-row {
                grid-template-columns: 45px minmax(150px, 1fr) 80px 100px 90px;
            }
        }

        @media (max-width: 850px) {
            .contracts-header {
                flex-wrap: wrap;
            }

            .contracts-player-summary {
                width: 100%;
                box-sizing: border-box;
            }

            .contract-details-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .contracts-offers-grid,
            .contracts-offers-grid.large,
            .contract-full-grid {
                grid-template-columns: 1fr;
            }

            .contract-history-row {
                grid-template-columns: 45px minmax(150px, 1fr) 75px;
            }

            .history-contract-purse,
            .contract-history-row > div:last-child {
                display: none;
            }
        }

        @media (max-width: 560px) {
            .contracts-screen {
                padding: 14px;
            }

            .contracts-header {
                padding: 19px;
            }

            .contracts-header h2 {
                font-size: 22px;
            }

            .contracts-summary-grid {
                grid-template-columns: 1fr 1fr;
            }

            .contract-stat-card {
                padding: 14px;
            }

            .contract-stat-card strong {
                font-size: 18px;
            }

            .contract-details-grid {
                grid-template-columns: 1fr 1fr;
            }

            .contract-value-panel {
                grid-template-columns: 1fr;
            }

            .offer-card-stats {
                grid-template-columns: 1fr;
            }

            .contract-detail-header {
                flex-direction: column;
            }

            .contract-history-row {
                grid-template-columns: 40px minmax(120px, 1fr) 60px;
                gap: 7px;
            }

            .history-contract-fights {
                display: none;
            }
        }
    `;

    document.head.appendChild(style);
}

/* ============================================================
   API
   ============================================================ */

const contractsScreenAPI = {
    version:
        CONTRACTS_SCREEN_VERSION,

    initialize,
    refresh,
    render,
    open,
    close,

    setTab,
    selectContract,
    clearSelection,

    getOffers,
    getActiveContract,
    getContractHistoryEntries,
    getAllContracts,

    getState,
    getSnapshot,
    validate
};

/* ============================================================
   GLOBAL
   ============================================================ */

if (
    typeof window !== "undefined"
) {
    window.contractsScreenAPI =
        contractsScreenAPI;

    window.MMA_LIFE_CONTRACTS_SCREEN =
        contractsScreenAPI;

    window.dispatchEvent(
        new CustomEvent(
            "mma-life-contracts-screen-ready",
            {
                detail:
                    contractsScreenAPI
            }
        )
    );
}

/* ============================================================
   EXPORTS
   ============================================================ */

export {
    CONTRACTS_SCREEN_VERSION,
    contractsScreenAPI,

    initialize,
    refresh,
    render,
    open,
    close,

    setTab,
    selectContract,
    clearSelection,

    getOffers,
    getActiveContract,
    getContractHistoryEntries,
    getAllContracts,

    getState,
    getSnapshot,
    validate
};

export default contractsScreenAPI;
