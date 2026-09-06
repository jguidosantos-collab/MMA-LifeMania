/* ============================================================
   MMA LIFE DYNASTY
   UI — PROMOTION SCREEN
   Arquivo: js/ui/promotionScreen.js
   ============================================================ */

const PROMOTION_SCREEN_VERSION = 1;

const promotionScreenState = {
    initialized: false,
    database: null,
    activeTab: "overview",
    selectedPromotionId: null,
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
    return database ||
        promotionScreenState.database ||
        window.MMA_LIFE_DATABASE ||
        {};
}

function getPlayer(database) {
    return database?.player || {};
}

function getCareer(database) {
    return database?.career || {};
}

function getPromotionsState(database) {
    return database?.promotions || {};
}

function getWorld(database) {
    return database?.world || {};
}

function getBusiness(database) {
    return database?.business || {};
}

function getNested(object, path, fallback = null) {
    if (!object || !path) return fallback;

    const parts = Array.isArray(path)
        ? path
        : String(path).split(".");

    let current = object;

    for (const part of parts) {
        if (current == null) return fallback;
        current = current[part];
    }

    return current ?? fallback;
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
    return value &&
        typeof value === "object" &&
        !Array.isArray(value)
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

    const text = String(value)
        .replace(/_/g, " ")
        .trim();

    return text.charAt(0).toUpperCase() + text.slice(1);
}

function clamp(value, min = 0, max = 100) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return min;
    }

    return Math.max(
        min,
        Math.min(max, number)
    );
}

function getElement(id) {
    return document.getElementById(id);
}

function ensureContent() {
    let content =
        getElement("mma-life-content");

    if (!content) {
        content =
            document.createElement("main");

        content.id =
            "mma-life-content";

        document.body.appendChild(content);
    }

    return content;
}

/* ============================================================
   PLAYER
   ============================================================ */

function getPlayerName(player) {
    const firstName =
        player.firstName ||
        player.firstname ||
        "";

    const lastName =
        player.lastName ||
        player.lastname ||
        "";

    return (
        player.fullName ||
        player.name ||
        `${firstName} ${lastName}`.trim() ||
        "Lutador"
    );
}

function getPlayerAge(player) {
    return (
        player.age ??
        player.identity?.age ??
        player.profile?.age ??
        18
    );
}

function getPlayerOverall(player) {
    const attributes =
        player.attributes || {};

    const direct =
        player.overall ??
        player.ovr ??
        attributes.overall ??
        attributes.ovr;

    if (direct !== undefined) {
        return Number(direct) || 0;
    }

    const values = [
        attributes.striking,
        attributes.grappling,
        attributes.bjj,
        attributes.wrestling,
        attributes.defense,
        attributes.speed,
        attributes.power,
        attributes.cardio,
        attributes.technique
    ]
        .map(Number)
        .filter(Number.isFinite);

    if (!values.length) return 0;

    return Math.round(
        values.reduce(
            (total, value) =>
                total + value,
            0
        ) / values.length
    );
}

function getPlayerWeightClass(player) {
    return (
        player.weightClass ||
        player.weight_class ||
        player.division ||
        player.category ||
        "Não definida"
    );
}

/* ============================================================
   CAREER
   ============================================================ */

function getCareerStage(database) {
    const career =
        getCareer(database);

    return (
        career.stage ||
        career.careerStage ||
        career.level ||
        "Amateur"
    );
}

function isProfessional(database) {
    const career =
        getCareer(database);

    return Boolean(
        career.professional === true ||
        career.professional?.active === true ||
        career.pro === true
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
        ),

        noContests: Number(
            record.noContests ??
            record.nc ??
            career.noContests ??
            0
        )
    };
}

function getCurrentPromotion(database) {
    const career =
        getCareer(database);

    return (
        career.currentPromotion ||
        career.promotion ||
        career.organization ||
        getPromotionsState(
            database
        ).currentPromotion ||
        null
    );
}

function getCurrentPromotionId(database) {
    const promotion =
        getCurrentPromotion(database);

    if (!promotion) return null;

    if (typeof promotion === "string") {
        return promotion;
    }

    return (
        promotion.id ||
        promotion.promotionId ||
        promotion.organizationId ||
        null
    );
}

function getCurrentDivision(database) {
    const career =
        getCareer(database);

    return (
        career.currentDivision ||
        career.division ||
        career.weightClass ||
        getPlayerWeightClass(
            getPlayer(database)
        )
    );
}

function getCurrentRank(database) {
    const career =
        getCareer(database);

    return (
        career.rank ??
        career.currentRank ??
        career.ranking ??
        "Unranked"
    );
}

/* ============================================================
   PROMOTIONS
   ============================================================ */

function getPromotionCollection(database) {
    const promotionsState =
        getPromotionsState(database);

    const world =
        getWorld(database);

    return (
        promotionsState.promotions ||
        world.promotions ||
        {}
    );
}

function getPromotions(database) {
    const collection =
        getPromotionCollection(database);

    return safeArray(collection);
}

function normalizePromotion(promotion) {
    if (!promotion) return null;

    return {
        id:
            promotion.id ||
            promotion.promotionId ||
            promotion.organizationId ||
            `promotion-${Math.random()
                .toString(36)
                .slice(2, 9)}`,

        name:
            promotion.name ||
            promotion.title ||
            "Organização",

        shortName:
            promotion.shortName ||
            promotion.acronym ||
            promotion.abbreviation ||
            "",

        country:
            promotion.country ||
            promotion.countryName ||
            "",

        city:
            promotion.city ||
            promotion.cityName ||
            "",

        level:
            Number(
                promotion.level ??
                promotion.tier ??
                promotion.rank ??
                1
            ),

        tier:
            promotion.tier ||
            promotion.levelName ||
            "",

        prestige:
            Number(
                promotion.prestige ??
                promotion.reputation ??
                0
            ),

        minAge:
            Number(
                promotion.minAge ??
                promotion.minimumAge ??
                18
            ),

        minProFights:
            Number(
                promotion.minProFights ??
                promotion.minimumProfessionalFights ??
                0
            ),

        contractMin:
            Number(
                promotion.contractMin ??
                promotion.minContractFights ??
                promotion.contractLengthMin ??
                3
            ),

        contractMax:
            Number(
                promotion.contractMax ??
                promotion.maxContractFights ??
                promotion.contractLengthMax ??
                5
            ),

        basePurse:
            Number(
                promotion.basePurse ??
                promotion.purse ??
                promotion.startingPurse ??
                0
            ),

        winBonus:
            Number(
                promotion.winBonus ??
                promotion.winBonusAmount ??
                0
            ),

        titleBonus:
            Number(
                promotion.titleBonus ??
                0
            ),

        mainEventBonus:
            Number(
                promotion.mainEventBonus ??
                promotion.mainEventPay ??
                0
            ),

        divisions:
            safeArray(
                promotion.divisions ||
                promotion.weightClasses
            ),

        description:
            promotion.description ||
            "",

        active:
            promotion.active !== false
    };
}

function getNormalizedPromotions(database) {
    return getPromotions(database)
        .map(normalizePromotion)
        .filter(Boolean);
}

function findPromotionById(
    database,
    id
) {
    if (!id) return null;

    return (
        getNormalizedPromotions(
            database
        ).find(
            promotion =>
                String(
                    promotion.id
                ) === String(id)
        ) || null
    );
}

function findPromotionByName(
    database,
    name
) {
    if (!name) return null;

    const normalized =
        String(name)
            .trim()
            .toLowerCase();

    return (
        getNormalizedPromotions(
            database
        ).find(
            promotion =>
                promotion.name
                    .toLowerCase() ===
                normalized
        ) || null
    );
}

/* ============================================================
   ORGANIZAÇÃO ATUAL
   ============================================================ */

function resolveCurrentPromotion(
    database
) {
    const current =
        getCurrentPromotion(
            database
        );

    if (!current) {
        return null;
    }

    if (typeof current === "object") {
        const normalized =
            normalizePromotion(current);

        const registered =
            findPromotionById(
                database,
                normalized.id
            );

        return registered ||
            normalized;
    }

    return (
        findPromotionById(
            database,
            current
        ) ||
        findPromotionByName(
            database,
            current
        )
    );
}

/* ============================================================
   CLASSIFICAÇÃO
   ============================================================ */

function getLevelLabel(level) {
    const number =
        Number(level);

    if (number >= 10) return "Elite";
    if (number >= 7) return "Internacional";
    if (number >= 5) return "Nacional";
    if (number >= 3) return "Regional";
    return "Inicial";
}

function getPromotionBadge(
    promotion
) {
    if (!promotion) return "";

    if (
        promotion.name
            .toLowerCase()
            .includes("ufc")
    ) {
        return "ELITE";
    }

    return getLevelLabel(
        promotion.level
    ).toUpperCase();
}

function getPromotionStatus(
    promotion,
    database
) {
    if (!promotion) {
        return "Disponibilidade desconhecida";
    }

    const currentId =
        getCurrentPromotionId(
            database
        );

    if (
        currentId &&
        String(currentId) ===
        String(promotion.id)
    ) {
        return "Sua organização atual";
    }

    const player =
        getPlayer(database);

    const age =
        getPlayerAge(player);

    const record =
        getCareerRecord(database);

    const proFights =
        record.wins +
        record.losses +
        record.draws;

    if (
        age <
        promotion.minAge
    ) {
        return "Idade insuficiente";
    }

    if (
        proFights <
        promotion.minProFights
    ) {
        return "Experiência insuficiente";
    }

    return "Potencialmente acessível";
}

/* ============================================================
   CONTRATOS
   ============================================================ */

function getContracts(database) {
    const business =
        getBusiness(database);

    const career =
        getCareer(database);

    return safeArray(
        business.contracts ||
        career.contracts ||
        getPromotionsState(
            database
        ).contracts
    );
}

function getActiveContract(database) {
    const contracts =
        getContracts(database);

    return (
        contracts.find(
            contract =>
                contract.active === true ||
                contract.status === "active" ||
                contract.status === "signed"
        ) || null
    );
}

function getContractLength(contract) {
    if (!contract) return 0;

    return Number(
        contract.fights ??
        contract.fightCount ??
        contract.remainingFights ??
        contract.length ??
        0
    );
}

function getContractPurse(contract) {
    if (!contract) return 0;

    return Number(
        contract.purse ??
        contract.basePurse ??
        contract.showMoney ??
        contract.fightPurse ??
        0
    );
}

function getContractWinBonus(contract) {
    if (!contract) return 0;

    return Number(
        contract.winBonus ??
        contract.win_bonus ??
        contract.winBonusAmount ??
        0
    );
}

/* ============================================================
   OFERTAS
   ============================================================ */

function getOffers(database) {
    const promotionsState =
        getPromotionsState(database);

    const business =
        getBusiness(database);

    return safeArray(
        promotionsState.offers ||
        promotionsState.contractOffers ||
        business.contractOffers ||
        business.offers
    );
}

function normalizeOffer(
    offer,
    database
) {
    if (!offer) return null;

    const promotion =
        offer.promotion
            ? normalizePromotion(
                offer.promotion
            )
            : findPromotionById(
                database,
                offer.promotionId ||
                offer.organizationId ||
                offer.promotion
            );

    return {
        id:
            offer.id ||
            `offer-${Math.random()
                .toString(36)
                .slice(2, 9)}`,

        promotion,

        fights:
            Number(
                offer.fights ??
                offer.contractFights ??
                3
            ),

        purse:
            Number(
                offer.purse ??
                offer.basePurse ??
                0
            ),

        winBonus:
            Number(
                offer.winBonus ??
                0
            ),

        titleBonus:
            Number(
                offer.titleBonus ??
                0
            ),

        status:
            offer.status ||
            "pending",

        expiresAt:
            offer.expiresAt ||
            offer.expirationDate ||
            null
    };
}

function getNormalizedOffers(database) {
    return getOffers(database)
        .map(
            offer =>
                normalizeOffer(
                    offer,
                    database
                )
        )
        .filter(Boolean);
}

/* ============================================================
   DIVISÕES
   ============================================================ */

function getPromotionDivisions(
    promotion,
    database
) {
    if (!promotion) return [];

    if (
        promotion.divisions.length
    ) {
        return promotion.divisions;
    }

    const divisionsState =
        getPromotionsState(
            database
        ).divisions;

    const fromState =
        safeArray(
            divisionsState
        );

    if (fromState.length) {
        return fromState
            .filter(
                division => {
                    const promotionId =
                        division.promotionId ||
                        division.organizationId;

                    return (
                        !promotionId ||
                        String(
                            promotionId
                        ) ===
                        String(
                            promotion.id
                        )
                    );
                }
            );
    }

    return [];
}

function normalizeDivision(
    division
) {
    if (!division) return null;

    return {
        id:
            division.id ||
            division.weightClass ||
            division.name,

        name:
            division.name ||
            division.label ||
            division.weightClass ||
            "Divisão",

        weightClass:
            division.weightClass ||
            division.category ||
            division.name,

        champion:
            division.champion ||
            division.currentChampion ||
            null,

        rankings:
            safeArray(
                division.rankings
            ),

        active:
            division.active !== false
    };
}

/* ============================================================
   UFC / ELITE
   ============================================================ */

function isElitePromotion(
    promotion
) {
    if (!promotion) return false;

    return (
        promotion.level >= 10 ||
        promotion.tier === "elite" ||
        promotion.tier === "Elite" ||
        promotion.name
            .toLowerCase()
            .includes("ufc")
    );
}

/* ============================================================
   RENDER — HEADER
   ============================================================ */

function renderHeader(
    database
) {
    const player =
        getPlayer(database);

    const current =
        resolveCurrentPromotion(
            database
        );

    const record =
        getCareerRecord(database);

    return `
        <header class="promotion-header">
            <div class="promotion-header-main">
                <div class="promotion-header-icon">
                    🏆
                </div>

                <div>
                    <span class="promotion-kicker">
                        ORGANIZAÇÕES
                    </span>

                    <h2>
                        Promoções
                    </h2>

                    <p>
                        Encontre seu próximo desafio e suba
                        na hierarquia do MMA.
                    </p>
                </div>
            </div>

            <div class="promotion-player-summary">
                <strong>
                    ${escapeHTML(
                        getPlayerName(player)
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        getCareerStage(
                            database
                        )
                    )}
                    •
                    ${formatNumber(
                        getPlayerOverall(
                            player
                        )
                    )} OVR
                </span>

                <small>
                    ${formatNumber(
                        record.wins
                    )}-${formatNumber(
                        record.losses
                    )}-${formatNumber(
                        record.draws
                    )}
                </small>
            </div>

            ${
                current
                    ? `
                        <div class="promotion-current-badge">
                            <span>
                                ORGANIZAÇÃO ATUAL
                            </span>

                            <strong>
                                ${escapeHTML(
                                    current.name
                                )}
                            </strong>
                        </div>
                    `
                    : ""
            }
        </header>
    `;
}

/* ============================================================
   RENDER — TABS
   ============================================================ */

const PROMOTION_TABS = [
    {
        id: "overview",
        label: "Visão geral"
    },
    {
        id: "organizations",
        label: "Organizações"
    },
    {
        id: "offers",
        label: "Ofertas"
    },
    {
        id: "contract",
        label: "Contrato"
    },
    {
        id: "divisions",
        label: "Divisões"
    }
];

function renderTabs() {
    return `
        <div class="promotion-tabs">
            ${PROMOTION_TABS.map(
                tab => `
                    <button
                        class="promotion-tab ${
                            promotionScreenState.activeTab ===
                            tab.id
                                ? "active"
                                : ""
                        }"
                        data-promotion-tab="${escapeHTML(
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
   RENDER — OVERVIEW
   ============================================================ */

function renderOverview(
    database
) {
    const current =
        resolveCurrentPromotion(
            database
        );

    const promotions =
        getNormalizedPromotions(
            database
        );

    const offers =
        getNormalizedOffers(
            database
        ).filter(
            offer =>
                offer.status ===
                    "pending" ||
                offer.status ===
                    "available"
        );

    const contract =
        getActiveContract(
            database
        );

    const record =
        getCareerRecord(database);

    return `
        <section class="promotion-section">
            <div class="promotion-section-header">
                <div>
                    <span class="promotion-kicker">
                        CARREIRA
                    </span>

                    <h3>
                        Seu caminho no MMA
                    </h3>

                    <p>
                        Evolua de organizações regionais até
                        chegar ao topo do esporte.
                    </p>
                </div>
            </div>

            <div class="promotion-level-path">
                ${renderLevelStep(
                    "Amateur",
                    "Amador",
                    getCareerStage(
                        database
                    ) === "Amateur"
                )}

                <div class="promotion-path-line"></div>

                ${renderLevelStep(
                    "Regional",
                    "Regional",
                    getCareerStage(
                        database
                    ) === "Regional"
                )}

                <div class="promotion-path-line"></div>

                ${renderLevelStep(
                    "National",
                    "Nacional",
                    getCareerStage(
                        database
                    ) === "National"
                )}

                <div class="promotion-path-line"></div>

                ${renderLevelStep(
                    "International",
                    "Internacional",
                    getCareerStage(
                        database
                    ) === "International"
                )}

                <div class="promotion-path-line"></div>

                ${renderLevelStep(
                    "Elite",
                    "Elite",
                    getCareerStage(
                        database
                    ) === "Elite"
                )}
            </div>
        </section>

        <section class="promotion-stats-grid">
            ${renderStatCard(
                "Organizações",
                formatNumber(
                    promotions.length
                ),
                "Disponíveis no mundo"
            )}

            ${renderStatCard(
                "Ofertas",
                formatNumber(
                    offers.length
                ),
                "Aguardando decisão"
            )}

            ${renderStatCard(
                "Lutas no contrato",
                formatNumber(
                    getContractLength(
                        contract
                    )
                ),
                contract
                    ? "Contrato atual"
                    : "Sem contrato ativo"
            )}

            ${renderStatCard(
                "Vitórias",
                formatNumber(
                    record.wins
                ),
                "Carreira"
            )}
        </section>

        <section class="promotion-two-column">
            <div class="promotion-panel">
                <div class="promotion-panel-header">
                    <div>
                        <span class="promotion-kicker">
                            ATUAL
                        </span>

                        <h3>
                            Sua organização
                        </h3>
                    </div>
                </div>

                ${
                    current
                        ? renderPromotionHero(
                            current,
                            database
                        )
                        : `
                            <div class="promotion-empty">
                                <div class="promotion-empty-icon">
                                    🥊
                                </div>

                                <strong>
                                    Você ainda não está contratado
                                </strong>

                                <p>
                                    Conquiste vitórias e aumente
                                    sua reputação para receber
                                    oportunidades.
                                </p>
                            </div>
                        `
                }
            </div>

            <div class="promotion-panel">
                <div class="promotion-panel-header">
                    <div>
                        <span class="promotion-kicker">
                            OFERTAS
                        </span>

                        <h3>
                            Próximas oportunidades
                        </h3>
                    </div>

                    <button
                        class="promotion-link-button"
                        data-promotion-tab="offers"
                    >
                        Ver todas
                    </button>
                </div>

                ${
                    offers.length
                        ? offers
                            .slice(0, 3)
                            .map(
                                renderOfferCard
                            )
                            .join("")
                        : `
                            <div class="promotion-empty">
                                Nenhuma oferta pendente.
                            </div>
                        `
                }
            </div>
        </section>

        <section class="promotion-section">
            <div class="promotion-section-header">
                <div>
                    <span class="promotion-kicker">
                        TOPO
                    </span>

                    <h3>
                        Organizações de elite
                    </h3>
                </div>
            </div>

            <div class="promotion-elite-grid">
                ${
                    promotions
                        .filter(
                            isElitePromotion
                        )
                        .slice(0, 4)
                        .map(
                            promotion =>
                                renderPromotionCard(
                                    promotion,
                                    database
                                )
                        )
                        .join("") ||
                    `
                        <div class="promotion-empty">
                            As organizações de elite aparecerão
                            aqui quando forem carregadas no mundo.
                        </div>
                    `
                }
            </div>
        </section>
    `;
}

function renderLevelStep(
    id,
    label,
    active
) {
    return `
        <div class="promotion-level-step ${
            active
                ? "active"
                : ""
        }">
            <div class="promotion-level-circle">
                ${
                    id === "Elite"
                        ? "★"
                        : "●"
                }
            </div>

            <span>
                ${escapeHTML(
                    label
                )}
            </span>
        </div>
    `;
}

function renderStatCard(
    label,
    value,
    subtitle
) {
    return `
        <div class="promotion-stat-card">
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

            <small>
                ${escapeHTML(
                    subtitle
                )}
            </small>
        </div>
    `;
}

/* ============================================================
   RENDER — PROMOTION HERO
   ============================================================ */

function renderPromotionHero(
    promotion,
    database
) {
    const divisions =
        getPromotionDivisions(
            promotion,
            database
        );

    return `
        <div class="promotion-hero">
            <div class="promotion-logo">
                ${escapeHTML(
                    (
                        promotion.shortName ||
                        promotion.name
                    )
                        .slice(0, 3)
                        .toUpperCase()
                )}
            </div>

            <div class="promotion-hero-content">
                <div class="promotion-badge">
                    ${escapeHTML(
                        getPromotionBadge(
                            promotion
                        )
                    )}
                </div>

                <h4>
                    ${escapeHTML(
                        promotion.name
                    )}
                </h4>

                <p>
                    ${escapeHTML(
                        promotion.country ||
                        "Organização internacional"
                    )}
                </p>

                <div class="promotion-meta">
                    <span>
                        Prestígio:
                        ${formatNumber(
                            promotion.prestige
                        )}
                    </span>

                    <span>
                        ${formatNumber(
                            divisions.length
                        )} divisões
                    </span>
                </div>
            </div>
        </div>
    `;
}

/* ============================================================
   RENDER — ORGANIZAÇÕES
   ============================================================ */

function renderOrganizations(
    database
) {
    const promotions =
        getNormalizedPromotions(
            database
        );

    const levels = [
        {
            value: 10,
            label: "Elite"
        },
        {
            value: 7,
            label: "Internacional"
        },
        {
            value: 5,
            label: "Nacional"
        },
        {
            value: 3,
            label: "Regional"
        }
    ];

    return `
        <section class="promotion-section">
            <div class="promotion-section-header">
                <div>
                    <span class="promotion-kicker">
                        MUNDO DO MMA
                    </span>

                    <h3>
                        Organizações
                    </h3>

                    <p>
                        Cada organização possui exigências,
                        prestígio, salários e oportunidades
                        diferentes.
                    </p>
                </div>
            </div>

            ${levels.map(
                level => {
                    const items =
                        promotions.filter(
                            promotion =>
                                promotion.level ===
                                level.value
                        );

                    if (!items.length) {
                        return "";
                    }

                    return `
                        <div class="promotion-level-group">
                            <div class="promotion-level-title">
                                <h4>
                                    ${escapeHTML(
                                        level.label
                                    )}
                                </h4>

                                <span>
                                    ${formatNumber(
                                        items.length
                                    )}
                                </span>
                            </div>

                            <div class="promotion-card-grid">
                                ${items
                                    .map(
                                        promotion =>
                                            renderPromotionCard(
                                                promotion,
                                                database
                                            )
                                    )
                                    .join("")}
                            </div>
                        </div>
                    `;
                }
            ).join("")}
        </section>
    `;
}

function renderPromotionCard(
    promotion,
    database
) {
    const currentId =
        getCurrentPromotionId(
            database
        );

    const isCurrent =
        currentId &&
        String(currentId) ===
        String(promotion.id);

    return `
        <article
            class="promotion-card ${
                isCurrent
                    ? "current"
                    : ""
            }"
        >
            <div class="promotion-card-top">
                <div class="promotion-logo small">
                    ${escapeHTML(
                        (
                            promotion.shortName ||
                            promotion.name
                        )
                            .slice(0, 3)
                            .toUpperCase()
                    )}
                </div>

                <span class="promotion-badge">
                    ${escapeHTML(
                        getPromotionBadge(
                            promotion
                        )
                    )}
                </span>
            </div>

            <h4>
                ${escapeHTML(
                    promotion.name
                )}
            </h4>

            <p>
                ${escapeHTML(
                    promotion.country ||
                    "Internacional"
                )}
            </p>

            <div class="promotion-card-stats">
                <div>
                    <span>
                        Prestígio
                    </span>

                    <strong>
                        ${formatNumber(
                            promotion.prestige
                        )}
                    </strong>
                </div>

                <div>
                    <span>
                        Nível
                    </span>

                    <strong>
                        ${formatNumber(
                            promotion.level
                        )}
                    </strong>
                </div>
            </div>

            <div class="promotion-card-status">
                ${escapeHTML(
                    getPromotionStatus(
                        promotion,
                        database
                    )
                )}
            </div>

            <button
                class="promotion-card-button"
                data-promotion-select="${escapeHTML(
                    promotion.id
                )}"
            >
                Ver organização
            </button>
        </article>
    `;
}

/* ============================================================
   RENDER — OFERTAS
   ============================================================ */

function renderOffers(
    database
) {
    const offers =
        getNormalizedOffers(
            database
        );

    return `
        <section class="promotion-section">
            <div class="promotion-section-header">
                <div>
                    <span class="promotion-kicker">
                        NEGOCIAÇÕES
                    </span>

                    <h3>
                        Ofertas de contrato
                    </h3>

                    <p>
                        Escolha cuidadosamente suas oportunidades.
                        Uma organização maior pode acelerar sua
                        carreira, mas também aumenta o nível dos
                        adversários.
                    </p>
                </div>
            </div>

            <div class="promotion-offers-list">
                ${
                    offers.length
                        ? offers
                            .map(
                                renderOfferCard
                            )
                            .join("")
                        : `
                            <div class="promotion-empty">
                                <div class="promotion-empty-icon">
                                    ✉
                                </div>

                                <strong>
                                    Nenhuma oferta disponível
                                </strong>

                                <p>
                                    Continue lutando, evoluindo e
                                    aumentando sua fama para atrair
                                    novas organizações.
                                </p>
                            </div>
                        `
                }
            </div>
        </section>
    `;
}

function renderOfferCard(
    offer
) {
    const promotion =
        offer.promotion;

    return `
        <article class="promotion-offer-card">
            <div class="promotion-offer-main">
                <div class="promotion-logo small">
                    ${escapeHTML(
                        (
                            promotion?.shortName ||
                            promotion?.name ||
                            "ORG"
                        )
                            .slice(0, 3)
                            .toUpperCase()
                    )}
                </div>

                <div>
                    <span class="promotion-kicker">
                        OFERTA
                    </span>

                    <h4>
                        ${escapeHTML(
                            promotion?.name ||
                            "Organização"
                        )}
                    </h4>

                    <p>
                        ${escapeHTML(
                            promotion?.country ||
                            "Internacional"
                        )}
                    </p>
                </div>
            </div>

            <div class="promotion-offer-money">
                <div>
                    <span>
                        Bolsa
                    </span>

                    <strong>
                        ${formatMoney(
                            offer.purse
                        )}
                    </strong>
                </div>

                <div>
                    <span>
                        Vitória
                    </span>

                    <strong>
                        ${formatMoney(
                            offer.winBonus
                        )}
                    </strong>
                </div>

                <div>
                    <span>
                        Lutas
                    </span>

                    <strong>
                        ${formatNumber(
                            offer.fights
                        )}
                    </strong>
                </div>
            </div>

            <div class="promotion-offer-actions">
                <button
                    class="promotion-action-button primary"
                    data-promotion-offer-accept="${escapeHTML(
                        offer.id
                    )}"
                >
                    Aceitar
                </button>

                <button
                    class="promotion-action-button"
                    data-promotion-offer-details="${escapeHTML(
                        offer.id
                    )}"
                >
                    Detalhes
                </button>

                <button
                    class="promotion-action-button danger"
                    data-promotion-offer-reject="${escapeHTML(
                        offer.id
                    )}"
                >
                    Recusar
                </button>
            </div>
        </article>
    `;
}

/* ============================================================
   RENDER — CONTRATO
   ============================================================ */

function renderContract(
    database
) {
    const contract =
        getActiveContract(
            database
        );

    const current =
        resolveCurrentPromotion(
            database
        );

    return `
        <section class="promotion-section">
            <div class="promotion-section-header">
                <div>
                    <span class="promotion-kicker">
                        CONTRATO
                    </span>

                    <h3>
                        Seu acordo atual
                    </h3>
                </div>
            </div>

            ${
                contract
                    ? `
                        <div class="promotion-contract-card">
                            <div class="promotion-contract-header">
                                <div>
                                    <span>
                                        Organização
                                    </span>

                                    <h4>
                                        ${escapeHTML(
                                            current?.name ||
                                            contract.promotionName ||
                                            contract.organizationName ||
                                            "Organização"
                                        )}
                                    </h4>
                                </div>

                                <div class="promotion-contract-status">
                                    ${escapeHTML(
                                        capitalize(
                                            contract.status ||
                                            "active"
                                        )
                                    )}
                                </div>
                            </div>

                            <div class="promotion-contract-grid">
                                <div>
                                    <span>
                                        Lutas
                                    </span>

                                    <strong>
                                        ${formatNumber(
                                            getContractLength(
                                                contract
                                            )
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Bolsa
                                    </span>

                                    <strong>
                                        ${formatMoney(
                                            getContractPurse(
                                                contract
                                            )
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Bônus de vitória
                                    </span>

                                    <strong>
                                        ${formatMoney(
                                            getContractWinBonus(
                                                contract
                                            )
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Bônus de título
                                    </span>

                                    <strong>
                                        ${formatMoney(
                                            contract.titleBonus ||
                                            0
                                        )}
                                    </strong>
                                </div>
                            </div>

                            <div class="promotion-contract-note">
                                O contrato poderá evoluir conforme
                                seu desempenho, ranking, fama e
                                resultados.
                            </div>
                        </div>
                    `
                    : `
                        <div class="promotion-empty">
                            <div class="promotion-empty-icon">
                                📄
                            </div>

                            <strong>
                                Nenhum contrato ativo
                            </strong>

                            <p>
                                Você poderá receber propostas de
                                organizações conforme sua carreira
                                evoluir.
                            </p>
                        </div>
                    `
            }
        </section>
    `;
}

/* ============================================================
   RENDER — DIVISÕES
   ============================================================ */

function renderDivisions(
    database
) {
    const current =
        resolveCurrentPromotion(
            database
        );

    if (!current) {
        return `
            <section class="promotion-section">
                <div class="promotion-section-header">
                    <div>
                        <span class="promotion-kicker">
                            DIVISÕES
                        </span>

                        <h3>
                            Categorias de peso
                        </h3>
                    </div>
                </div>

                <div class="promotion-empty">
                    Você ainda não está vinculado a uma
                    organização.
                </div>
            </section>
        `;
    }

    const divisions =
        getPromotionDivisions(
            current,
            database
        )
            .map(
                normalizeDivision
            )
            .filter(Boolean);

    return `
        <section class="promotion-section">
            <div class="promotion-section-header">
                <div>
                    <span class="promotion-kicker">
                        ${escapeHTML(
                            current.name
                        )}
                    </span>

                    <h3>
                        Divisões
                    </h3>

                    <p>
                        Sua categoria atual:
                        <strong>
                            ${escapeHTML(
                                getCurrentDivision(
                                    database
                                )
                            )}
                        </strong>
                    </p>
                </div>
            </div>

            <div class="promotion-division-grid">
                ${
                    divisions.length
                        ? divisions
                            .map(
                                division =>
                                    renderDivisionCard(
                                        division,
                                        database
                                    )
                            )
                            .join("")
                        : `
                            <div class="promotion-empty">
                                As divisões desta organização
                                ainda não foram carregadas.
                            </div>
                        `
                }
            </div>
        </section>
    `;
}

function renderDivisionCard(
    division,
    database
) {
    const current =
        getCurrentDivision(
            database
        );

    const isCurrent =
        String(
            current
        ).toLowerCase() ===
        String(
            division.weightClass
        ).toLowerCase();

    const rankings =
        division.rankings;

    return `
        <article class="promotion-division-card ${
            isCurrent
                ? "current"
                : ""
        }">
            <div class="promotion-division-header">
                <h4>
                    ${escapeHTML(
                        division.name
                    )}
                </h4>

                ${
                    isCurrent
                        ? `
                            <span>
                                SUA DIVISÃO
                            </span>
                        `
                        : ""
                }
            </div>

            ${
                division.champion
                    ? `
                        <div class="promotion-champion">
                            <span>
                                CAMPEÃO
                            </span>

                            <strong>
                                ${escapeHTML(
                                    typeof division.champion ===
                                        "string"
                                        ? division.champion
                                        : division
                                            .champion
                                            .name ||
                                            "Campeão"
                                )}
                            </strong>
                        </div>
                    `
                    : ""
            }

            <div class="promotion-division-meta">
                <span>
                    ${formatNumber(
                        rankings.length
                    )} ranqueados
                </span>
            </div>
        </article>
    `;
}

/* ============================================================
   DETALHES DA ORGANIZAÇÃO
   ============================================================ */

function renderSelectedPromotion(
    database
) {
    const promotion =
        findPromotionById(
            database,
            promotionScreenState.selectedPromotionId
        );

    if (!promotion) {
        return `
            <section class="promotion-section">
                <div class="promotion-empty">
                    Organização não encontrada.
                </div>
            </section>
        `;
    }

    const divisions =
        getPromotionDivisions(
            promotion,
            database
        )
            .map(
                normalizeDivision
            )
            .filter(Boolean);

    return `
        <section class="promotion-section">
            <button
                class="promotion-back-button"
                data-promotion-back
            >
                ← Voltar
            </button>

            <div class="promotion-detail-header">
                <div class="promotion-logo large">
                    ${escapeHTML(
                        (
                            promotion.shortName ||
                            promotion.name
                        )
                            .slice(0, 3)
                            .toUpperCase()
                    )}
                </div>

                <div>
                    <span class="promotion-badge">
                        ${escapeHTML(
                            getPromotionBadge(
                                promotion
                            )
                        )}
                    </span>

                    <h3>
                        ${escapeHTML(
                            promotion.name
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            promotion.country ||
                            "Organização internacional"
                        )}
                    </p>
                </div>
            </div>

            ${
                promotion.description
                    ? `
                        <div class="promotion-description">
                            ${escapeHTML(
                                promotion.description
                            )}
                        </div>
                    `
                    : ""
            }

            <div class="promotion-detail-grid">
                ${renderStatCard(
                    "Prestígio",
                    formatNumber(
                        promotion.prestige
                    ),
                    "Influência"
                )}

                ${renderStatCard(
                    "Nível",
                    formatNumber(
                        promotion.level
                    ),
                    getLevelLabel(
                        promotion.level
                    )
                )}

                ${renderStatCard(
                    "Idade mínima",
                    formatNumber(
                        promotion.minAge
                    ),
                    "Anos"
                )}

                ${renderStatCard(
                    "Lutas profissionais",
                    formatNumber(
                        promotion.minProFights
                    ),
                    "Mínimo recomendado"
                )}
            </div>

            <div class="promotion-panel">
                <div class="promotion-panel-header">
                    <div>
                        <span class="promotion-kicker">
                            DIVISÕES
                        </span>

                        <h3>
                            Categorias disponíveis
                        </h3>
                    </div>
                </div>

                <div class="promotion-division-grid">
                    ${
                        divisions.length
                            ? divisions
                                .map(
                                    division =>
                                        renderDivisionCard(
                                            division,
                                            database
                                        )
                                )
                                .join("")
                            : `
                                <div class="promotion-empty">
                                    Nenhuma divisão registrada.
                                </div>
                            `
                    }
                </div>
            </div>

            <div class="promotion-panel">
                <div class="promotion-panel-header">
                    <div>
                        <span class="promotion-kicker">
                            FINANÇAS
                        </span>

                        <h3>
                            Estrutura de pagamento
                        </h3>
                    </div>
                </div>

                <div class="promotion-money-grid">
                    <div>
                        <span>
                            Bolsa base
                        </span>

                        <strong>
                            ${formatMoney(
                                promotion.basePurse
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Bônus de vitória
                        </span>

                        <strong>
                            ${formatMoney(
                                promotion.winBonus
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Bônus de título
                        </span>

                        <strong>
                            ${formatMoney(
                                promotion.titleBonus
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>
                            Main event
                        </span>

                        <strong>
                            ${formatMoney(
                                promotion.mainEventBonus
                            )}
                        </strong>
                    </div>
                </div>
            </div>
        </section>
    `;
}

/* ============================================================
   ABA ATIVA
   ============================================================ */

function renderActiveTab(
    database
) {
    if (
        promotionScreenState
            .selectedPromotionId
    ) {
        return renderSelectedPromotion(
            database
        );
    }

    switch (
        promotionScreenState.activeTab
    ) {
        case "organizations":
            return renderOrganizations(
                database
            );

        case "offers":
            return renderOffers(
                database
            );

        case "contract":
            return renderContract(
                database
            );

        case "divisions":
            return renderDivisions(
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
   RENDER PRINCIPAL
   ============================================================ */

function render(
    database = null
) {
    const db =
        getDatabase(database);

    promotionScreenState.database =
        db;

    const content =
        ensureContent();

    content.innerHTML = `
        <div class="promotion-screen">
            ${renderHeader(db)}

            ${
                promotionScreenState
                    .selectedPromotionId
                    ? ""
                    : renderTabs()
            }

            <div class="promotion-screen-content">
                ${renderActiveTab(db)}
            </div>
        </div>
    `;

    promotionScreenState.lastRender =
        Date.now();

    bindEvents();

    return content;
}

/* ============================================================
   EVENTOS
   ============================================================ */

function bindEvents() {
    document
        .querySelectorAll(
            "[data-promotion-tab]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    const tab =
                        button.dataset
                            .promotionTab;

                    if (!tab) return;

                    promotionScreenState
                        .selectedPromotionId =
                        null;

                    setTab(tab);
                }
            );
        });

    document
        .querySelectorAll(
            "[data-promotion-select]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    const id =
                        button.dataset
                            .promotionSelect;

                    selectPromotion(id);
                }
            );
        });

    document
        .querySelectorAll(
            "[data-promotion-back]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    clearSelectedPromotion();
                }
            );
        });

    document
        .querySelectorAll(
            "[data-promotion-offer-accept]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    handleOfferAction(
                        "accept",
                        button.dataset
                            .promotionOfferAccept
                    );
                }
            );
        });

    document
        .querySelectorAll(
            "[data-promotion-offer-reject]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    handleOfferAction(
                        "reject",
                        button.dataset
                            .promotionOfferReject
                    );
                }
            );
        });

    document
        .querySelectorAll(
            "[data-promotion-offer-details]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    handleOfferAction(
                        "details",
                        button.dataset
                            .promotionOfferDetails
                    );
                }
            );
        });
}

/* ============================================================
   AÇÕES DE PROMOÇÃO
   ============================================================ */

function getPromotionsAPI() {
    return (
        window.promotionsAPI ||
        window.MMA_LIFE_PROMOTIONS ||
        null
    );
}

function getContractsAPI() {
    return (
        window.contractsAPI ||
        window.MMA_LIFE_CONTRACTS ||
        null
    );
}

function handleOfferAction(
    action,
    offerId
) {
    const database =
        promotionScreenState.database;

    const offer =
        getNormalizedOffers(
            database
        ).find(
            item =>
                String(item.id) ===
                String(offerId)
        );

    if (!offer) {
        showMessage(
            "Oferta não encontrada."
        );

        return;
    }

    const promotionsAPI =
        getPromotionsAPI();

    const contractsAPI =
        getContractsAPI();

    if (action === "accept") {
        let handled = false;

        if (
            contractsAPI &&
            typeof contractsAPI.acceptOffer ===
                "function"
        ) {
            try {
                contractsAPI.acceptOffer(
                    database,
                    offer
                );

                handled = true;
            } catch {
                handled = false;
            }
        }

        if (
            !handled &&
            promotionsAPI &&
            typeof promotionsAPI.acceptOffer ===
                "function"
        ) {
            try {
                promotionsAPI.acceptOffer(
                    database,
                    offer
                );

                handled = true;
            } catch {
                handled = false;
            }
        }

        if (handled) {
            showMessage(
                "Oferta aceita."
            );

            render(database);
        } else {
            showMessage(
                "A oferta foi selecionada, mas o sistema de contratos ainda precisa ser integrado."
            );
        }

        return;
    }

    if (action === "reject") {
        let handled = false;

        if (
            contractsAPI &&
            typeof contractsAPI.rejectOffer ===
                "function"
        ) {
            try {
                contractsAPI.rejectOffer(
                    database,
                    offer
                );

                handled = true;
            } catch {
                handled = false;
            }
        }

        if (
            !handled &&
            promotionsAPI &&
            typeof promotionsAPI.rejectOffer ===
                "function"
        ) {
            try {
                promotionsAPI.rejectOffer(
                    database,
                    offer
                );

                handled = true;
            } catch {
                handled = false;
            }
        }

        if (handled) {
            showMessage(
                "Oferta recusada."
            );

            render(database);
        } else {
            showMessage(
                "Oferta recusada visualmente. A integração definitiva será feita na etapa de contratos."
            );
        }

        return;
    }

    if (action === "details") {
        const promotion =
            offer.promotion;

        if (promotion) {
            selectPromotion(
                promotion.id
            );
        } else {
            showMessage(
                "Detalhes da organização não encontrados."
            );
        }
    }
}

function showMessage(message) {
    if (
        typeof window.showToast ===
        "function"
    ) {
        window.showToast(
            message
        );

        return;
    }

    const gameUI =
        window.gameUIAPI;

    if (
        gameUI &&
        typeof gameUI.toast ===
            "function"
    ) {
        gameUI.toast(
            message
        );

        return;
    }

    console.info(
        "[PromotionScreen]",
        message
    );
}

/* ============================================================
   NAVEGAÇÃO
   ============================================================ */

function setTab(tab) {
    const valid =
        PROMOTION_TABS.some(
            item =>
                item.id === tab
        );

    if (!valid) {
        return false;
    }

    promotionScreenState.activeTab =
        tab;

    promotionScreenState
        .selectedPromotionId =
        null;

    if (
        promotionScreenState.database
    ) {
        render(
            promotionScreenState.database
        );
    }

    return true;
}

function selectPromotion(
    promotionId
) {
    const database =
        promotionScreenState.database ||
        getDatabase();

    const promotion =
        findPromotionById(
            database,
            promotionId
        );

    if (!promotion) {
        showMessage(
            "Organização não encontrada."
        );

        return false;
    }

    promotionScreenState
        .selectedPromotionId =
        promotion.id;

    render(database);

    return true;
}

function clearSelectedPromotion() {
    promotionScreenState
        .selectedPromotionId =
        null;

    render(
        promotionScreenState.database ||
        getDatabase()
    );
}

function open(
    tab = "overview",
    database = null
) {
    promotionScreenState
        .selectedPromotionId =
        null;

    const valid =
        PROMOTION_TABS.some(
            item =>
                item.id === tab
        );

    promotionScreenState.activeTab =
        valid
            ? tab
            : "overview";

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
   ESTADO / VALIDAÇÃO
   ============================================================ */

function initialize(
    database = null
) {
    promotionScreenState.database =
        getDatabase(database);

    promotionScreenState.initialized =
        true;

    injectStyles();

    return render(
        promotionScreenState.database
    );
}

function refresh(
    database = null
) {
    if (database) {
        promotionScreenState.database =
            database;
    }

    injectStyles();

    return render(
        promotionScreenState.database ||
        getDatabase()
    );
}

function getState() {
    return clone(
        promotionScreenState
    );
}

function getSnapshot() {
    return {
        version:
            PROMOTION_SCREEN_VERSION,

        state:
            getState(),

        currentPromotion:
            promotionScreenState.database
                ? resolveCurrentPromotion(
                    promotionScreenState.database
                )
                : null,

        promotions:
            promotionScreenState.database
                ? getNormalizedPromotions(
                    promotionScreenState.database
                )
                : []
    };
}

function validate(
    database = null
) {
    const db =
        database ||
        promotionScreenState.database;

    const errors = [];
    const warnings = [];

    if (!db) {
        errors.push(
            "Database não encontrada."
        );
    }

    if (
        !PROMOTION_TABS.some(
            tab =>
                tab.id ===
                promotionScreenState.activeTab
        )
    ) {
        warnings.push(
            "A aba ativa não é reconhecida."
        );
    }

    if (db) {
        const promotions =
            getNormalizedPromotions(
                db
            );

        if (!promotions.length) {
            warnings.push(
                "Nenhuma organização foi encontrada na database."
            );
        }

        const currentId =
            getCurrentPromotionId(
                db
            );

        if (
            currentId &&
            !findPromotionById(
                db,
                currentId
            )
        ) {
            warnings.push(
                "A organização atual do jogador não foi encontrada no cadastro de organizações."
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
            "mma-life-promotion-screen-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement("style");

    style.id =
        "mma-life-promotion-screen-styles";

    style.textContent = `
        .promotion-screen {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 24px;
            box-sizing: border-box;
        }

        .promotion-header {
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

        .promotion-header-main {
            display: flex;
            align-items: center;
            gap: 15px;
            min-width: 0;
        }

        .promotion-header-icon {
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

        .promotion-header h2 {
            margin: 0;
            font-size: 28px;
        }

        .promotion-header p {
            margin: 7px 0 0;
            font-size: 12px;
            line-height: 1.5;
            opacity: .55;
        }

        .promotion-player-summary {
            min-width: 170px;
            padding: 13px 15px;
            border-radius: 14px;
            background: rgba(255,255,255,.04);
        }

        .promotion-player-summary strong,
        .promotion-player-summary span,
        .promotion-player-summary small {
            display: block;
        }

        .promotion-player-summary strong {
            font-size: 13px;
        }

        .promotion-player-summary span {
            margin-top: 4px;
            font-size: 10px;
            opacity: .55;
        }

        .promotion-player-summary small {
            margin-top: 5px;
            font-size: 10px;
            font-weight: 800;
        }

        .promotion-current-badge {
            min-width: 180px;
            padding: 14px;
            border-radius: 14px;
            background: rgba(255,255,255,.055);
        }

        .promotion-current-badge span,
        .promotion-current-badge strong {
            display: block;
        }

        .promotion-current-badge span {
            font-size: 8px;
            font-weight: 900;
            letter-spacing: .1em;
            opacity: .5;
        }

        .promotion-current-badge strong {
            margin-top: 5px;
            font-size: 14px;
        }

        .promotion-kicker {
            display: block;
            margin-bottom: 5px;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .14em;
            text-transform: uppercase;
            opacity: .48;
        }

        .promotion-tabs {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            margin-bottom: 20px;
        }

        .promotion-tab,
        .promotion-link-button,
        .promotion-card-button,
        .promotion-action-button,
        .promotion-back-button {
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

        .promotion-tab:hover,
        .promotion-link-button:hover,
        .promotion-card-button:hover,
        .promotion-action-button:hover,
        .promotion-back-button:hover {
            background: rgba(255,255,255,.075);
        }

        .promotion-tab.active {
            background: rgba(255,255,255,.12);
            border-color: rgba(255,255,255,.16);
        }

        .promotion-section {
            margin-bottom: 22px;
        }

        .promotion-section-header {
            margin-bottom: 15px;
        }

        .promotion-section-header h3 {
            margin: 0;
            font-size: 21px;
        }

        .promotion-section-header p {
            max-width: 760px;
            margin: 7px 0 0;
            font-size: 12px;
            line-height: 1.55;
            opacity: .55;
        }

        .promotion-level-path {
            display: flex;
            align-items: center;
            width: 100%;
            overflow-x: auto;
            padding: 20px;
            box-sizing: border-box;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 17px;
            background: rgba(255,255,255,.025);
        }

        .promotion-level-step {
            min-width: 90px;
            text-align: center;
            opacity: .35;
        }

        .promotion-level-step.active {
            opacity: 1;
        }

        .promotion-level-circle {
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 7px;
            border-radius: 50%;
            background: rgba(255,255,255,.07);
            font-size: 11px;
            font-weight: 900;
        }

        .promotion-level-step.active .promotion-level-circle {
            background: rgba(255,255,255,.15);
        }

        .promotion-level-step span {
            font-size: 10px;
            font-weight: 700;
        }

        .promotion-path-line {
            flex: 1;
            min-width: 24px;
            height: 1px;
            background: rgba(255,255,255,.1);
        }

        .promotion-stats-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 12px;
            margin-bottom: 18px;
        }

        .promotion-stat-card {
            padding: 17px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 15px;
            background: rgba(255,255,255,.03);
        }

        .promotion-stat-card span,
        .promotion-stat-card strong,
        .promotion-stat-card small {
            display: block;
        }

        .promotion-stat-card span {
            font-size: 9px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: .08em;
            opacity: .48;
        }

        .promotion-stat-card strong {
            margin-top: 8px;
            font-size: 24px;
        }

        .promotion-stat-card small {
            margin-top: 4px;
            font-size: 10px;
            opacity: .5;
        }

        .promotion-two-column {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
            margin-bottom: 20px;
        }

        .promotion-panel {
            padding: 19px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 18px;
            background: rgba(255,255,255,.025);
        }

        .promotion-panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 15px;
        }

        .promotion-panel-header h3 {
            margin: 0;
            font-size: 17px;
        }

        .promotion-link-button {
            padding: 8px 10px;
            font-size: 9px;
        }

        .promotion-hero {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 16px;
            border-radius: 15px;
            background: rgba(255,255,255,.035);
        }

        .promotion-logo {
            width: 58px;
            height: 58px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 16px;
            background: rgba(255,255,255,.08);
            font-size: 17px;
            font-weight: 900;
            letter-spacing: .05em;
        }

        .promotion-logo.small {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            font-size: 12px;
        }

        .promotion-logo.large {
            width: 78px;
            height: 78px;
            border-radius: 19px;
            font-size: 22px;
        }

        .promotion-hero-content {
            min-width: 0;
        }

        .promotion-hero-content h4 {
            margin: 5px 0 0;
            font-size: 17px;
        }

        .promotion-hero-content p {
            margin: 4px 0 0;
            font-size: 10px;
            opacity: .5;
        }

        .promotion-badge {
            display: inline-block;
            padding: 4px 7px;
            border-radius: 6px;
            background: rgba(255,255,255,.08);
            font-size: 8px;
            font-weight: 900;
            letter-spacing: .1em;
        }

        .promotion-meta {
            display: flex;
            gap: 12px;
            margin-top: 10px;
            font-size: 9px;
            opacity: .55;
        }

        .promotion-elite-grid,
        .promotion-card-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
        }

        .promotion-card {
            padding: 16px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 16px;
            background: rgba(255,255,255,.025);
        }

        .promotion-card.current {
            border-color: rgba(255,255,255,.18);
        }

        .promotion-card-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }

        .promotion-card h4 {
            margin: 13px 0 4px;
            font-size: 14px;
        }

        .promotion-card > p {
            margin: 0;
            font-size: 10px;
            opacity: .5;
        }

        .promotion-card-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 7px;
            margin-top: 14px;
        }

        .promotion-card-stats div {
            padding: 9px;
            border-radius: 10px;
            background: rgba(255,255,255,.035);
        }

        .promotion-card-stats span,
        .promotion-card-stats strong {
            display: block;
        }

        .promotion-card-stats span {
            font-size: 8px;
            opacity: .45;
        }

        .promotion-card-stats strong {
            margin-top: 3px;
            font-size: 12px;
        }

        .promotion-card-status {
            min-height: 30px;
            margin-top: 11px;
            font-size: 9px;
            line-height: 1.4;
            opacity: .55;
        }

        .promotion-card-button {
            width: 100%;
            margin-top: 11px;
        }

        .promotion-level-group {
            margin-bottom: 20px;
        }

        .promotion-level-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .promotion-level-title h4 {
            margin: 0;
            font-size: 15px;
        }

        .promotion-level-title span {
            font-size: 10px;
            opacity: .45;
        }

        .promotion-offers-list {
            display: grid;
            gap: 12px;
        }

        .promotion-offer-card {
            padding: 18px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 17px;
            background: rgba(255,255,255,.025);
        }

        .promotion-offer-main {
            display: flex;
            align-items: center;
            gap: 13px;
        }

        .promotion-offer-main h4 {
            margin: 3px 0;
            font-size: 15px;
        }

        .promotion-offer-main p {
            margin: 0;
            font-size: 10px;
            opacity: .5;
        }

        .promotion-offer-money {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-top: 15px;
        }

        .promotion-offer-money div,
        .promotion-money-grid div {
            padding: 11px;
            border-radius: 11px;
            background: rgba(255,255,255,.035);
        }

        .promotion-offer-money span,
        .promotion-offer-money strong,
        .promotion-money-grid span,
        .promotion-money-grid strong {
            display: block;
        }

        .promotion-offer-money span,
        .promotion-money-grid span {
            font-size: 8px;
            opacity: .45;
        }

        .promotion-offer-money strong,
        .promotion-money-grid strong {
            margin-top: 4px;
            font-size: 13px;
        }

        .promotion-offer-actions {
            display: flex;
            gap: 8px;
            margin-top: 13px;
        }

        .promotion-action-button.primary {
            background: rgba(255,255,255,.12);
        }

        .promotion-action-button.danger {
            opacity: .65;
        }

        .promotion-contract-card {
            padding: 20px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 17px;
            background: rgba(255,255,255,.025);
        }

        .promotion-contract-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            margin-bottom: 17px;
        }

        .promotion-contract-header span {
            display: block;
            font-size: 9px;
            text-transform: uppercase;
            opacity: .45;
        }

        .promotion-contract-header h4 {
            margin: 5px 0 0;
            font-size: 18px;
        }

        .promotion-contract-status {
            padding: 7px 10px;
            border-radius: 8px;
            background: rgba(255,255,255,.07);
            font-size: 9px;
            font-weight: 800;
        }

        .promotion-contract-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
        }

        .promotion-contract-grid div {
            padding: 12px;
            border-radius: 11px;
            background: rgba(255,255,255,.035);
        }

        .promotion-contract-grid span,
        .promotion-contract-grid strong {
            display: block;
        }

        .promotion-contract-grid span {
            font-size: 8px;
            opacity: .45;
        }

        .promotion-contract-grid strong {
            margin-top: 4px;
            font-size: 13px;
        }

        .promotion-contract-note {
            margin-top: 15px;
            padding-top: 13px;
            border-top: 1px solid rgba(255,255,255,.07);
            font-size: 10px;
            line-height: 1.5;
            opacity: .5;
        }

        .promotion-division-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 11px;
        }

        .promotion-division-card {
            padding: 15px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 14px;
            background: rgba(255,255,255,.025);
        }

        .promotion-division-card.current {
            border-color: rgba(255,255,255,.18);
        }

        .promotion-division-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 8px;
        }

        .promotion-division-header h4 {
            margin: 0;
            font-size: 13px;
        }

        .promotion-division-header span {
            padding: 4px 6px;
            border-radius: 5px;
            background: rgba(255,255,255,.08);
            font-size: 7px;
            font-weight: 900;
        }

        .promotion-champion {
            margin-top: 13px;
        }

        .promotion-champion span,
        .promotion-champion strong {
            display: block;
        }

        .promotion-champion span {
            font-size: 8px;
            opacity: .45;
        }

        .promotion-champion strong {
            margin-top: 4px;
            font-size: 12px;
        }

        .promotion-division-meta {
            margin-top: 11px;
            font-size: 9px;
            opacity: .5;
        }

        .promotion-detail-header {
            display: flex;
            align-items: center;
            gap: 17px;
            padding: 22px;
            margin-bottom: 18px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 18px;
            background: rgba(255,255,255,.03);
        }

        .promotion-detail-header h3 {
            margin: 7px 0 3px;
            font-size: 24px;
        }

        .promotion-detail-header p {
            margin: 0;
            font-size: 11px;
            opacity: .5;
        }

        .promotion-description {
            margin-bottom: 18px;
            padding: 17px;
            border-radius: 15px;
            background: rgba(255,255,255,.035);
            font-size: 12px;
            line-height: 1.6;
            opacity: .65;
        }

        .promotion-detail-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 18px;
        }

        .promotion-money-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 9px;
        }

        .promotion-back-button {
            margin-bottom: 15px;
        }

        .promotion-empty {
            padding: 26px 18px;
            border: 1px dashed rgba(255,255,255,.1);
            border-radius: 15px;
            text-align: center;
            font-size: 11px;
            line-height: 1.5;
            opacity: .55;
        }

        .promotion-empty strong {
            display: block;
            margin-bottom: 5px;
            font-size: 13px;
            opacity: 1;
        }

        .promotion-empty p {
            max-width: 520px;
            margin: 5px auto 0;
        }

        .promotion-empty-icon {
            margin-bottom: 8px;
            font-size: 24px;
        }

        @media (max-width: 1050px) {
            .promotion-header {
                flex-wrap: wrap;
            }

            .promotion-stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .promotion-elite-grid,
            .promotion-card-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .promotion-division-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .promotion-detail-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .promotion-money-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 800px) {
            .promotion-two-column {
                grid-template-columns: 1fr;
            }

            .promotion-header {
                align-items: flex-start;
            }

            .promotion-player-summary,
            .promotion-current-badge {
                width: 100%;
                box-sizing: border-box;
            }

            .promotion-contract-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 560px) {
            .promotion-screen {
                padding: 14px;
            }

            .promotion-header {
                padding: 19px;
            }

            .promotion-header h2 {
                font-size: 22px;
            }

            .promotion-stats-grid,
            .promotion-elite-grid,
            .promotion-card-grid,
            .promotion-division-grid,
            .promotion-detail-grid {
                grid-template-columns: 1fr;
            }

            .promotion-offer-money {
                grid-template-columns: 1fr;
            }

            .promotion-money-grid,
            .promotion-contract-grid {
                grid-template-columns: 1fr;
            }

            .promotion-offer-actions {
                flex-wrap: wrap;
            }

            .promotion-action-button {
                flex: 1;
            }

            .promotion-detail-header {
                align-items: flex-start;
            }
        }
    `;

    document.head.appendChild(style);
}

/* ============================================================
   API
   ============================================================ */

const promotionScreenAPI = {
    version:
        PROMOTION_SCREEN_VERSION,

    initialize,
    refresh,
    render,
    open,
    close,

    setTab,
    getActiveTab: () =>
        promotionScreenState.activeTab,

    selectPromotion,
    clearSelectedPromotion,

    getPromotions,
    getNormalizedPromotions,
    findPromotionById,
    findPromotionByName,

    getCurrentPromotion:
        resolveCurrentPromotion,

    getCurrentPromotionId,

    getOffers,
    getNormalizedOffers,

    getActiveContract,

    getPromotionDivisions,

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
    window.promotionScreenAPI =
        promotionScreenAPI;

    window.MMA_LIFE_PROMOTION_SCREEN =
        promotionScreenAPI;

    window.dispatchEvent(
        new CustomEvent(
            "mma-life-promotion-screen-ready",
            {
                detail:
                    promotionScreenAPI
            }
        )
    );
}

/* ============================================================
   EXPORTS
   ============================================================ */

export {
    PROMOTION_SCREEN_VERSION,
    promotionScreenAPI,

    initialize,
    refresh,
    render,
    open,
    close,

    setTab,
    selectPromotion,
    clearSelectedPromotion,

    getPromotions,
    getNormalizedPromotions,
    findPromotionById,
    findPromotionByName,

    resolveCurrentPromotion,
    getCurrentPromotionId,

    getOffers,
    getNormalizedOffers,

    getActiveContract,
    getPromotionDivisions,

    getState,
    getSnapshot,
    validate
};

export default promotionScreenAPI;
