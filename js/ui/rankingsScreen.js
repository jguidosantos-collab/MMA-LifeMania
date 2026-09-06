/* ============================================================
   MMA LIFE DYNASTY
   UI — RANKINGS SCREEN
   Arquivo: js/ui/rankingsScreen.js
   ============================================================ */

const RANKINGS_SCREEN_VERSION = 1;

const rankingsScreenState = {
    initialized: false,
    database: null,
    activeTab: "overview",
    selectedDivision: null,
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
    return (
        database ||
        rankingsScreenState.database ||
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

    const text = String(value)
        .replace(/_/g, " ")
        .trim();

    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );
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

function getPlayerId(player) {
    return (
        player.id ||
        player.playerId ||
        player.identity?.id ||
        "player"
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

    if (!values.length) {
        return 0;
    }

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

function getCareer(database) {
    return database?.career || {};
}

function getCurrentPromotion(database) {
    const career =
        getCareer(database);

    const promotions =
        database?.promotions || {};

    return (
        career.currentPromotion ||
        career.promotion ||
        career.organization ||
        promotions.currentPromotion ||
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
        ),

        noContests: Number(
            record.noContests ??
            record.nc ??
            career.noContests ??
            0
        )
    };
}

function getCareerRank(database) {
    const career =
        getCareer(database);

    return (
        career.rank ??
        career.currentRank ??
        career.ranking ??
        null
    );
}

/* ============================================================
   RANKINGS DATA
   ============================================================ */

function getRankingsState(database) {
    return (
        database?.rankings ||
        database?.career?.rankings ||
        database?.world?.rankings ||
        {}
    );
}

function getRankingCollection(database) {
    const state =
        getRankingsState(database);

    return (
        state.rankings ||
        state.divisions ||
        state.categories ||
        state
    );
}

function getAllRankingEntries(database) {
    const collection =
        getRankingCollection(database);

    return safeArray(collection);
}

/* ============================================================
   ORGANIZAÇÕES
   ============================================================ */

function getPromotionsState(database) {
    return database?.promotions || {};
}

function getWorld(database) {
    return database?.world || {};
}

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

function normalizePromotion(promotion) {
    if (!promotion) return null;

    return {
        id:
            promotion.id ||
            promotion.promotionId ||
            promotion.organizationId,

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

        level:
            Number(
                promotion.level ??
                promotion.tier ??
                1
            ),

        prestige:
            Number(
                promotion.prestige ??
                promotion.reputation ??
                0
            ),

        divisions:
            safeArray(
                promotion.divisions ||
                promotion.weightClasses
            )
    };
}

function getPromotions(database) {
    return safeArray(
        getPromotionCollection(database)
    )
        .map(normalizePromotion)
        .filter(Boolean);
}

function findPromotion(
    database,
    id
) {
    if (!id) return null;

    return (
        getPromotions(database)
            .find(
                promotion =>
                    String(
                        promotion.id
                    ) === String(id)
            ) || null
    );
}

/* ============================================================
   DIVISÕES
   ============================================================ */

const DEFAULT_DIVISIONS = [
    "Flyweight",
    "Bantamweight",
    "Featherweight",
    "Lightweight",
    "Welterweight",
    "Middleweight",
    "Light Heavyweight",
    "Heavyweight"
];

function normalizeDivisionName(value) {
    if (!value) return "Divisão";

    if (typeof value === "object") {
        return (
            value.name ||
            value.label ||
            value.weightClass ||
            value.category ||
            "Divisão"
        );
    }

    return String(value);
}

function getAvailableDivisions(
    database
) {
    const divisionsState =
        getRankingsState(database);

    const direct =
        safeArray(
            divisionsState.divisions ||
            divisionsState.weightClasses
        );

    const fromPromotions =
        getPromotions(database)
            .flatMap(
                promotion =>
                    promotion.divisions
            );

    const all =
        [
            ...direct,
            ...fromPromotions
        ]
            .map(
                normalizeDivisionName
            )
            .filter(Boolean);

    const unique =
        [
            ...new Set(
                all
            )
        ];

    return unique.length
        ? unique
        : DEFAULT_DIVISIONS;
}

/* ============================================================
   NORMALIZAÇÃO DE RANKING
   ============================================================ */

function normalizeRankingEntry(
    entry,
    index = 0
) {
    if (!entry) return null;

    const fighter =
        entry.fighter ||
        entry.player ||
        entry.fighterData ||
        null;

    const fighterId =
        entry.fighterId ||
        entry.playerId ||
        entry.id ||
        fighter?.id ||
        fighter?.fighterId ||
        `fighter-${index}`;

    const name =
        entry.name ||
        entry.fighterName ||
        fighter?.name ||
        fighter?.fullName ||
        "Lutador";

    const rank =
        Number(
            entry.rank ??
            entry.position ??
            entry.place ??
            index + 1
        );

    const record =
        entry.record ||
        fighter?.record ||
        {};

    return {
        id: fighterId,

        fighterId,

        name,

        rank:
            Number.isFinite(rank)
                ? rank
                : index + 1,

        previousRank:
            entry.previousRank ??
            entry.lastRank ??
            null,

        movement:
            entry.movement ??
            entry.change ??
            null,

        movementDirection:
            entry.movementDirection ||
            null,

        wins:
            Number(
                entry.wins ??
                record.wins ??
                fighter?.wins ??
                0
            ),

        losses:
            Number(
                entry.losses ??
                record.losses ??
                fighter?.losses ??
                0
            ),

        draws:
            Number(
                entry.draws ??
                record.draws ??
                fighter?.draws ??
                0
            ),

        noContests:
            Number(
                entry.noContests ??
                record.noContests ??
                fighter?.noContests ??
                0
            ),

        overall:
            Number(
                entry.overall ??
                entry.ovr ??
                fighter?.overall ??
                fighter?.ovr ??
                0
            ),

        age:
            Number(
                entry.age ??
                fighter?.age ??
                0
            ),

        country:
            entry.country ||
            fighter?.country ||
            "",

        gym:
            entry.gym ||
            fighter?.gym ||
            fighter?.team ||
            "",

        style:
            entry.style ||
            fighter?.style ||
            fighter?.fightingStyle ||
            "",

        division:
            entry.division ||
            entry.weightClass ||
            fighter?.weightClass ||
            fighter?.division ||
            "",

        promotionId:
            entry.promotionId ||
            entry.organizationId ||
            fighter?.promotionId ||
            null,

        promotionName:
            entry.promotionName ||
            entry.organizationName ||
            fighter?.promotionName ||
            "",

        champion:
            Boolean(
                entry.champion ||
                entry.isChampion ||
                entry.titleHolder
            ),

        interimChampion:
            Boolean(
                entry.interimChampion ||
                entry.isInterimChampion
            ),

        contender:
            Boolean(
                entry.contender ||
                entry.isContender
            ),

        titleShot:
            Boolean(
                entry.titleShot ||
                entry.hasTitleShot
            ),

        points:
            Number(
                entry.points ??
                entry.score ??
                entry.rankingPoints ??
                0
            ),

        active:
            entry.active !== false
    };
}

/* ============================================================
   CAMPEÕES
   ============================================================ */

function getChampionsState(database) {
    return (
        database?.world?.champions ||
        database?.career?.champions ||
        database?.rankings?.champions ||
        {}
    );
}

function getChampionForDivision(
    database,
    division,
    promotionId = null
) {
    const champions =
        getChampionsState(database);

    const list =
        safeArray(champions);

    const found =
        list.find(
            champion => {
                const championDivision =
                    champion.division ||
                    champion.weightClass ||
                    champion.category;

                const championPromotion =
                    champion.promotionId ||
                    champion.organizationId;

                const divisionMatch =
                    String(
                        championDivision
                    ).toLowerCase() ===
                    String(
                        division
                    ).toLowerCase();

                const promotionMatch =
                    !promotionId ||
                    !championPromotion ||
                    String(
                        championPromotion
                    ) ===
                    String(
                        promotionId
                    );

                return (
                    divisionMatch &&
                    promotionMatch
                );
            }
        );

    if (found) {
        return (
            found.name ||
            found.fighterName ||
            found.fighter ||
            null
        );
    }

    return null;
}

/* ============================================================
   FILTROS
   ============================================================ */

function getRankingEntriesForDivision(
    database,
    division = null,
    promotionId = null
) {
    const entries =
        getAllRankingEntries(database)
            .map(
                normalizeRankingEntry
            )
            .filter(Boolean)
            .filter(
                entry =>
                    entry.active !== false
            );

    return entries
        .filter(
            entry => {
                if (!division) {
                    return true;
                }

                const entryDivision =
                    entry.division;

                if (!entryDivision) {
                    return true;
                }

                return (
                    String(
                        entryDivision
                    ).toLowerCase() ===
                    String(
                        division
                    ).toLowerCase()
                );
            }
        )
        .filter(
            entry => {
                if (!promotionId) {
                    return true;
                }

                if (!entry.promotionId) {
                    return true;
                }

                return (
                    String(
                        entry.promotionId
                    ) ===
                    String(
                        promotionId
                    )
                );
            }
        )
        .sort(
            (a, b) =>
                a.rank - b.rank
        );
}

/* ============================================================
   PLAYER RANKING
   ============================================================ */

function findPlayerRanking(
    database,
    entries
) {
    const player =
        getPlayer(database);

    const playerId =
        getPlayerId(player);

    const playerName =
        getPlayerName(player)
            .toLowerCase();

    return (
        entries.find(
            entry =>
                String(
                    entry.fighterId
                ) ===
                String(
                    playerId
                )
        ) ||
        entries.find(
            entry =>
                String(
                    entry.name
                ).toLowerCase() ===
                playerName
        ) ||
        null
    );
}

function getPlayerRankingPosition(
    database
) {
    const division =
        getCurrentDivision(
            database
        );

    const promotionId =
        getCurrentPromotionId(
            database
        );

    const entries =
        getRankingEntriesForDivision(
            database,
            division,
            promotionId
        );

    const playerRanking =
        findPlayerRanking(
            database,
            entries
        );

    if (playerRanking) {
        return playerRanking.rank;
    }

    const careerRank =
        getCareerRank(
            database
        );

    return careerRank ?? null;
}

function getRankingStatus(
    rank
) {
    if (
        rank === null ||
        rank === undefined
    ) {
        return "Não ranqueado";
    }

    const number =
        Number(rank);

    if (!Number.isFinite(number)) {
        return "Não ranqueado";
    }

    if (number === 1) {
        return "Campeão / topo";
    }

    if (number <= 5) {
        return "Top 5";
    }

    if (number <= 10) {
        return "Top 10";
    }

    if (number <= 15) {
        return "Top 15";
    }

    if (number <= 25) {
        return "Ranqueado";
    }

    return "Fora do ranking";
}

/* ============================================================
   MOVIMENTAÇÃO
   ============================================================ */

function getMovement(
    entry
) {
    if (!entry) {
        return {
            value: 0,
            label: "—",
            direction: "none"
        };
    }

    if (
        entry.movementDirection
    ) {
        const value =
            Number(
                entry.movement
            ) || 0;

        return {
            value,
            label:
                value > 0
                    ? `+${value}`
                    : value < 0
                        ? `${value}`
                        : "—",
            direction:
                entry.movementDirection
        };
    }

    if (
        entry.previousRank !== null &&
        entry.previousRank !== undefined
    ) {
        const current =
            Number(entry.rank);

        const previous =
            Number(
                entry.previousRank
            );

        if (
            Number.isFinite(
                current
            ) &&
            Number.isFinite(
                previous
            )
        ) {
            const change =
                previous - current;

            return {
                value: change,

                label:
                    change > 0
                        ? `+${change}`
                        : change < 0
                            ? `${change}`
                            : "—",

                direction:
                    change > 0
                        ? "up"
                        : change < 0
                            ? "down"
                            : "none"
            };
        }
    }

    return {
        value: 0,
        label: "—",
        direction: "none"
    };
}

/* ============================================================
   NÍVEIS DO RANKING
   ============================================================ */

function getRankLabel(rank) {
    if (rank === 1) {
        return "C";
    }

    if (rank >= 2 && rank <= 5) {
        return String(rank);
    }

    if (rank >= 6 && rank <= 10) {
        return String(rank);
    }

    if (rank >= 11 && rank <= 15) {
        return String(rank);
    }

    return String(rank);
}

function getContenderLabel(
    rank,
    champion = false
) {
    if (champion) {
        return "CAMPEÃO";
    }

    if (rank === 1) {
        return "Nº 1";
    }

    if (rank <= 5) {
        return "TITLE CONTENDER";
    }

    if (rank <= 10) {
        return "CONTENDER";
    }

    if (rank <= 15) {
        return "RANQUEADO";
    }

    return "";
}

/* ============================================================
   RENDER — HEADER
   ============================================================ */

function renderHeader(
    database
) {
    const player =
        getPlayer(database);

    const currentPromotion =
        getCurrentPromotion(database);

    const promotion =
        typeof currentPromotion ===
        "object"
            ? normalizePromotion(
                currentPromotion
            )
            : findPromotion(
                database,
                currentPromotion
            );

    const division =
        getCurrentDivision(
            database
        );

    const rank =
        getPlayerRankingPosition(
            database
        );

    return `
        <header class="rankings-header">
            <div class="rankings-header-main">
                <div class="rankings-header-icon">
                    🏆
                </div>

                <div>
                    <span class="rankings-kicker">
                        MUNDO DO MMA
                    </span>

                    <h2>
                        Rankings
                    </h2>

                    <p>
                        Suba posições, conquiste oportunidades
                        e chegue ao topo da sua divisão.
                    </p>
                </div>
            </div>

            <div class="rankings-player-summary">
                <strong>
                    ${escapeHTML(
                        getPlayerName(
                            player
                        )
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        promotion?.name ||
                        "Sem organização"
                    )}
                </span>

                <small>
                    ${escapeHTML(
                        division
                    )}
                    ${
                        rank
                            ? ` • Nº ${formatNumber(
                                rank
                            )}`
                            : ""
                    }
                </small>
            </div>
        </header>
    `;
}

/* ============================================================
   TABS
   ============================================================ */

const RANKING_TABS = [
    {
        id: "overview",
        label: "Visão geral"
    },
    {
        id: "division",
        label: "Minha divisão"
    },
    {
        id: "top5",
        label: "Top 5"
    },
    {
        id: "top15",
        label: "Top 15"
    },
    {
        id: "champions",
        label: "Campeões"
    }
];

function renderTabs() {
    return `
        <div class="rankings-tabs">
            ${RANKING_TABS.map(
                tab => `
                    <button
                        class="rankings-tab ${
                            rankingsScreenState.activeTab ===
                            tab.id
                                ? "active"
                                : ""
                        }"
                        data-ranking-tab="${escapeHTML(
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
   OVERVIEW
   ============================================================ */

function renderOverview(
    database
) {
    const player =
        getPlayer(database);

    const division =
        getCurrentDivision(
            database
        );

    const promotionId =
        getCurrentPromotionId(
            database
        );

    const entries =
        getRankingEntriesForDivision(
            database,
            division,
            promotionId
        );

    const playerRanking =
        findPlayerRanking(
            database,
            entries
        );

    const rank =
        playerRanking?.rank ??
        getPlayerRankingPosition(
            database
        );

    const movement =
        getMovement(
            playerRanking
        );

    const champion =
        getChampionForDivision(
            database,
            division,
            promotionId
        );

    const record =
        getCareerRecord(database);

    return `
        <section class="rankings-section">
            <div class="rankings-section-header">
                <div>
                    <span class="rankings-kicker">
                        SUA CARREIRA
                    </span>

                    <h3>
                        Situação no ranking
                    </h3>
                </div>
            </div>

            <div class="rankings-overview-grid">
                <div class="ranking-position-card">
                    <span>
                        POSIÇÃO
                    </span>

                    <strong>
                        ${
                            rank
                                ? `#${formatNumber(
                                    rank
                                )}`
                                : "—"
                        }
                    </strong>

                    <small>
                        ${escapeHTML(
                            getRankingStatus(
                                rank
                            )
                        )}
                    </small>
                </div>

                <div class="ranking-position-card">
                    <span>
                        MOVIMENTO
                    </span>

                    <strong>
                        ${escapeHTML(
                            movement.label
                        )}
                    </strong>

                    <small>
                        Última atualização
                    </small>
                </div>

                <div class="ranking-position-card">
                    <span>
                        OVR
                    </span>

                    <strong>
                        ${formatNumber(
                            getPlayerOverall(
                                player
                            )
                        )}
                    </strong>

                    <small>
                        Nível do lutador
                    </small>
                </div>

                <div class="ranking-position-card">
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

        <section class="rankings-two-column">
            <div class="rankings-panel">
                <div class="rankings-panel-header">
                    <div>
                        <span class="rankings-kicker">
                            DIVISÃO
                        </span>

                        <h3>
                            ${escapeHTML(
                                division
                            )}
                        </h3>
                    </div>
                </div>

                ${
                    champion
                        ? `
                            <div class="rankings-champion-highlight">
                                <div class="rankings-champion-icon">
                                    👑
                                </div>

                                <div>
                                    <span>
                                        CAMPEÃO ATUAL
                                    </span>

                                    <strong>
                                        ${escapeHTML(
                                            champion
                                        )}
                                    </strong>
                                </div>
                            </div>
                        `
                        : `
                            <div class="rankings-empty">
                                Campeão desta divisão ainda
                                não foi identificado.
                            </div>
                        `
                }
            </div>

            <div class="rankings-panel">
                <div class="rankings-panel-header">
                    <div>
                        <span class="rankings-kicker">
                            PRÓXIMO PASSO
                        </span>

                        <h3>
                            Caminho até o título
                        </h3>
                    </div>
                </div>

                ${renderRankingPath(
                    rank
                )}
            </div>
        </section>

        <section class="rankings-section">
            <div class="rankings-section-header">
                <div>
                    <span class="rankings-kicker">
                        TOP DA DIVISÃO
                    </span>

                    <h3>
                        Principais nomes
                    </h3>
                </div>

                <button
                    class="rankings-link-button"
                    data-ranking-tab="division"
                >
                    Ver ranking completo
                </button>
            </div>

            <div class="rankings-list compact">
                ${
                    entries.length
                        ? entries
                            .slice(0, 5)
                            .map(
                                (
                                    entry,
                                    index
                                ) =>
                                    renderRankingRow(
                                        entry,
                                        database,
                                        index
                                    )
                            )
                            .join("")
                        : `
                            <div class="rankings-empty">
                                Nenhum ranking disponível
                                para esta divisão.
                            </div>
                        `
                }
            </div>
        </section>
    `;
}

function renderRankingPath(
    rank
) {
    const milestones = [
        {
            rank: 15,
            label: "Top 15"
        },
        {
            rank: 10,
            label: "Top 10"
        },
        {
            rank: 5,
            label: "Top 5"
        },
        {
            rank: 1,
            label: "Título"
        }
    ];

    return `
        <div class="ranking-path">
            ${milestones.map(
                milestone => {
                    const reached =
                        rank !== null &&
                        rank !== undefined &&
                        Number(rank) <=
                            milestone.rank;

                    return `
                        <div
                            class="ranking-path-step ${
                                reached
                                    ? "reached"
                                    : ""
                            }"
                        >
                            <div>
                                ${
                                    reached
                                        ? "✓"
                                        : milestone.rank
                                }
                            </div>

                            <span>
                                ${escapeHTML(
                                    milestone.label
                                )}
                            </span>
                        </div>
                    `;
                }
            ).join("")}
        </div>
    `;
}

/* ============================================================
   DIVISÃO
   ============================================================ */

function renderDivision(
    database
) {
    const division =
        rankingsScreenState
            .selectedDivision ||
        getCurrentDivision(
            database
        );

    const promotionId =
        rankingsScreenState
            .selectedPromotionId ||
        getCurrentPromotionId(
            database
        );

    const entries =
        getRankingEntriesForDivision(
            database,
            division,
            promotionId
        );

    const champion =
        getChampionForDivision(
            database,
            division,
            promotionId
        );

    const divisions =
        getAvailableDivisions(
            database
        );

    return `
        <section class="rankings-section">
            <div class="rankings-section-header">
                <div>
                    <span class="rankings-kicker">
                        RANKING
                    </span>

                    <h3>
                        ${escapeHTML(
                            division
                        )}
                    </h3>
                </div>

                <select
                    class="rankings-select"
                    data-ranking-division-select
                >
                    ${divisions.map(
                        item => `
                            <option
                                value="${escapeHTML(
                                    item
                                )}"
                                ${
                                    String(
                                        item
                                    ).toLowerCase() ===
                                    String(
                                        division
                                    ).toLowerCase()
                                        ? "selected"
                                        : ""
                                }
                            >
                                ${escapeHTML(
                                    item
                                )}
                            </option>
                        `
                    ).join("")}
                </select>
            </div>

            ${
                champion
                    ? `
                        <div class="rankings-champion-banner">
                            <div class="rankings-champion-icon">
                                👑
                            </div>

                            <div>
                                <span>
                                    CAMPEÃO
                                </span>

                                <strong>
                                    ${escapeHTML(
                                        champion
                                    )}
                                </strong>

                                <small>
                                    ${escapeHTML(
                                        division
                                    )}
                                </small>
                            </div>
                        </div>
                    `
                    : ""
            }

            <div class="rankings-list">
                ${
                    entries.length
                        ? entries
                            .map(
                                (
                                    entry,
                                    index
                                ) =>
                                    renderRankingRow(
                                        entry,
                                        database,
                                        index
                                    )
                            )
                            .join("")
                        : `
                            <div class="rankings-empty">
                                Nenhum lutador encontrado
                                neste ranking.
                            </div>
                        `
                }
            </div>
        </section>
    `;
}

/* ============================================================
   TOP 5 / TOP 15
   ============================================================ */

function renderTopRanking(
    database,
    limit
) {
    const division =
        rankingsScreenState
            .selectedDivision ||
        getCurrentDivision(
            database
        );

    const promotionId =
        rankingsScreenState
            .selectedPromotionId ||
        getCurrentPromotionId(
            database
        );

    const entries =
        getRankingEntriesForDivision(
            database,
            division,
            promotionId
        )
            .slice(0, limit);

    return `
        <section class="rankings-section">
            <div class="rankings-section-header">
                <div>
                    <span class="rankings-kicker">
                        ${escapeHTML(
                            division
                        )}
                    </span>

                    <h3>
                        Top ${formatNumber(
                            limit
                        )}
                    </h3>

                    <p>
                        Os principais lutadores da divisão.
                    </p>
                </div>
            </div>

            <div class="rankings-top-grid">
                ${
                    entries.length
                        ? entries
                            .map(
                                (
                                    entry,
                                    index
                                ) =>
                                    renderRankingFeature(
                                        entry,
                                        database,
                                        index
                                    )
                            )
                            .join("")
                        : `
                            <div class="rankings-empty">
                                Ranking ainda não disponível.
                            </div>
                        `
                }
            </div>
        </section>
    `;
}

function renderRankingFeature(
    entry,
    database,
    index
) {
    const movement =
        getMovement(entry);

    const isPlayer =
        isPlayerEntry(
            entry,
            database
        );

    return `
        <article
            class="ranking-feature-card ${
                isPlayer
                    ? "player"
                    : ""
            }"
        >
            <div class="ranking-feature-rank">
                ${
                    entry.rank === 1
                        ? "👑"
                        : `#${formatNumber(
                            entry.rank
                        )}`
                }
            </div>

            <div class="ranking-feature-body">
                <div class="ranking-feature-top">
                    <span class="ranking-feature-badge">
                        ${escapeHTML(
                            getContenderLabel(
                                entry.rank,
                                entry.champion
                            )
                        )}
                    </span>

                    <span class="ranking-movement ${
                        movement.direction
                    }">
                        ${escapeHTML(
                            movement.label
                        )}
                    </span>
                </div>

                <h4>
                    ${escapeHTML(
                        entry.name
                    )}
                </h4>

                <p>
                    ${escapeHTML(
                        entry.country ||
                        "—"
                    )}
                </p>

                <div class="ranking-feature-stats">
                    <span>
                        OVR
                        <strong>
                            ${formatNumber(
                                entry.overall
                            )}
                        </strong>
                    </span>

                    <span>
                        Record
                        <strong>
                            ${formatNumber(
                                entry.wins
                            )}-${formatNumber(
                                entry.losses
                            )}
                        </strong>
                    </span>
                </div>
            </div>
        </article>
    `;
}

/* ============================================================
   CAMPEÕES
   ============================================================ */

function renderChampions(
    database
) {
    const divisions =
        getAvailableDivisions(
            database
        );

    const promotionId =
        getCurrentPromotionId(
            database
        );

    return `
        <section class="rankings-section">
            <div class="rankings-section-header">
                <div>
                    <span class="rankings-kicker">
                        TÍTULOS
                    </span>

                    <h3>
                        Campeões por divisão
                    </h3>

                    <p>
                        Os atuais detentores dos cinturões
                        registrados no mundo.
                    </p>
                </div>
            </div>

            <div class="champions-grid">
                ${divisions.map(
                    division => {
                        const champion =
                            getChampionForDivision(
                                database,
                                division,
                                promotionId
                            );

                        return `
                            <article class="champion-card">
                                <div class="champion-card-icon">
                                    🏆
                                </div>

                                <span>
                                    ${escapeHTML(
                                        division
                                    )}
                                </span>

                                <strong>
                                    ${
                                        champion
                                            ? escapeHTML(
                                                champion
                                            )
                                            : "Vaga"
                                    }
                                </strong>

                                <small>
                                    ${
                                        champion
                                            ? "Campeão atual"
                                            : "Nenhum campeão registrado"
                                    }
                                </small>
                            </article>
                        `;
                    }
                ).join("")}
            </div>
        </section>
    `;
}

/* ============================================================
   RANKING ROW
   ============================================================ */

function isPlayerEntry(
    entry,
    database
) {
    const player =
        getPlayer(database);

    const playerId =
        getPlayerId(player);

    return (
        String(
            entry.fighterId
        ) ===
        String(
            playerId
        ) ||
        String(
            entry.name
        ).toLowerCase() ===
        getPlayerName(player)
            .toLowerCase()
    );
}

function renderRankingRow(
    entry,
    database,
    index
) {
    const movement =
        getMovement(entry);

    const isPlayer =
        isPlayerEntry(
            entry,
            database
        );

    return `
        <article
            class="ranking-row ${
                isPlayer
                    ? "player"
                    : ""
            }"
        >
            <div class="ranking-row-position">
                ${
                    entry.champion
                        ? "👑"
                        : `#${formatNumber(
                            entry.rank
                        )}`
                }
            </div>

            <div class="ranking-row-fighter">
                <div class="ranking-row-avatar">
                    ${escapeHTML(
                        entry.name
                            .slice(0, 1)
                            .toUpperCase()
                    )}
                </div>

                <div>
                    <strong>
                        ${escapeHTML(
                            entry.name
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            entry.country ||
                            entry.gym ||
                            "Lutador"
                        )}
                    </span>
                </div>
            </div>

            <div class="ranking-row-record">
                <strong>
                    ${formatNumber(
                        entry.wins
                    )}-${formatNumber(
                        entry.losses
                    )}
                </strong>

                <span>
                    ${formatNumber(
                        entry.draws
                    )} E
                </span>
            </div>

            <div class="ranking-row-ovr">
                <span>
                    OVR
                </span>

                <strong>
                    ${formatNumber(
                        entry.overall
                    )}
                </strong>
            </div>

            <div class="ranking-row-movement ${
                movement.direction
            }">
                ${escapeHTML(
                    movement.label
                )}
            </div>

            <div class="ranking-row-status">
                ${escapeHTML(
                    getContenderLabel(
                        entry.rank,
                        entry.champion
                    )
                )}
            </div>
        </article>
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

    rankingsScreenState.database =
        db;

    const content =
        ensureContent();

    content.innerHTML = `
        <div class="rankings-screen">
            ${renderHeader(db)}

            ${renderTabs()}

            <div class="rankings-screen-content">
                ${renderActiveTab(db)}
            </div>
        </div>
    `;

    rankingsScreenState.lastRender =
        Date.now();

    bindEvents();

    return content;
}

function renderActiveTab(
    database
) {
    switch (
        rankingsScreenState.activeTab
    ) {
        case "division":
            return renderDivision(
                database
            );

        case "top5":
            return renderTopRanking(
                database,
                5
            );

        case "top15":
            return renderTopRanking(
                database,
                15
            );

        case "champions":
            return renderChampions(
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
   EVENTOS
   ============================================================ */

function bindEvents() {
    document
        .querySelectorAll(
            "[data-ranking-tab]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    setTab(
                        button.dataset
                            .rankingTab
                    );
                }
            );
        });

    const divisionSelect =
        document.querySelector(
            "[data-ranking-division-select]"
        );

    if (divisionSelect) {
        divisionSelect.addEventListener(
            "change",
            event => {
                rankingsScreenState
                    .selectedDivision =
                    event.target.value;

                render(
                    rankingsScreenState.database
                );
            }
        );
    }
}

/* ============================================================
   NAVEGAÇÃO
   ============================================================ */

function setTab(tab) {
    const valid =
        RANKING_TABS.some(
            item =>
                item.id === tab
        );

    if (!valid) {
        return false;
    }

    rankingsScreenState.activeTab =
        tab;

    render(
        rankingsScreenState.database ||
        getDatabase()
    );

    return true;
}

function setDivision(
    division
) {
    if (!division) {
        rankingsScreenState
            .selectedDivision =
            null;
    } else {
        rankingsScreenState
            .selectedDivision =
            division;
    }

    render(
        rankingsScreenState.database ||
        getDatabase()
    );

    return true;
}

function setPromotion(
    promotionId
) {
    rankingsScreenState
        .selectedPromotionId =
        promotionId || null;

    render(
        rankingsScreenState.database ||
        getDatabase()
    );

    return true;
}

function open(
    tab = "overview",
    database = null
) {
    rankingsScreenState
        .activeTab =
        RANKING_TABS.some(
            item =>
                item.id === tab
        )
            ? tab
            : "overview";

    rankingsScreenState
        .selectedDivision =
        null;

    rankingsScreenState
        .selectedPromotionId =
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
   API DE RANKINGS
   ============================================================ */

function getRankings(
    database = null
) {
    return getAllRankingEntries(
        getDatabase(database)
    )
        .map(
            normalizeRankingEntry
        )
        .filter(Boolean);
}

function getDivisionRanking(
    division,
    database = null
) {
    const db =
        getDatabase(database);

    return getRankingEntriesForDivision(
        db,
        division,
        getCurrentPromotionId(db)
    );
}

function getPlayerRanking(
    database = null
) {
    const db =
        getDatabase(database);

    const division =
        getCurrentDivision(db);

    const promotionId =
        getCurrentPromotionId(db);

    const entries =
        getRankingEntriesForDivision(
            db,
            division,
            promotionId
        );

    return findPlayerRanking(
        db,
        entries
    );
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

function initialize(
    database = null
) {
    rankingsScreenState.database =
        getDatabase(database);

    rankingsScreenState.initialized =
        true;

    injectStyles();

    return render(
        rankingsScreenState.database
    );
}

function refresh(
    database = null
) {
    if (database) {
        rankingsScreenState.database =
            database;
    }

    injectStyles();

    return render(
        rankingsScreenState.database ||
        getDatabase()
    );
}

function getState() {
    return clone(
        rankingsScreenState
    );
}

function getSnapshot() {
    const database =
        rankingsScreenState.database ||
        getDatabase();

    return {
        version:
            RANKINGS_SCREEN_VERSION,

        state:
            getState(),

        playerRanking:
            getPlayerRanking(
                database
            ),

        currentDivision:
            getCurrentDivision(
                database
            ),

        currentPromotionId:
            getCurrentPromotionId(
                database
            ),

        rankings:
            getRankings(
                database
            )
    };
}

function validate(
    database = null
) {
    const db =
        database ||
        rankingsScreenState.database;

    const errors = [];
    const warnings = [];

    if (!db) {
        errors.push(
            "Database não encontrada."
        );
    }

    if (
        !RANKING_TABS.some(
            tab =>
                tab.id ===
                rankingsScreenState.activeTab
        )
    ) {
        warnings.push(
            "A aba ativa do ranking é inválida."
        );
    }

    if (db) {
        const rankings =
            getRankings(db);

        if (!rankings.length) {
            warnings.push(
                "Nenhum lutador foi encontrado nos rankings."
            );
        }

        const division =
            getCurrentDivision(db);

        if (!division) {
            warnings.push(
                "A divisão atual do jogador não foi identificada."
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
            "mma-life-rankings-screen-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement("style");

    style.id =
        "mma-life-rankings-screen-styles";

    style.textContent = `
        .rankings-screen {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 24px;
            box-sizing: border-box;
        }

        .rankings-header {
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

        .rankings-header-main {
            display: flex;
            align-items: center;
            gap: 15px;
            min-width: 0;
        }

        .rankings-header-icon {
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

        .rankings-header h2 {
            margin: 0;
            font-size: 28px;
        }

        .rankings-header p {
            margin: 7px 0 0;
            font-size: 12px;
            line-height: 1.5;
            opacity: .55;
        }

        .rankings-kicker {
            display: block;
            margin-bottom: 5px;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .14em;
            text-transform: uppercase;
            opacity: .48;
        }

        .rankings-player-summary {
            min-width: 190px;
            padding: 14px 16px;
            border-radius: 14px;
            background: rgba(255,255,255,.04);
        }

        .rankings-player-summary strong,
        .rankings-player-summary span,
        .rankings-player-summary small {
            display: block;
        }

        .rankings-player-summary strong {
            font-size: 13px;
        }

        .rankings-player-summary span {
            margin-top: 4px;
            font-size: 10px;
            opacity: .55;
        }

        .rankings-player-summary small {
            margin-top: 5px;
            font-size: 10px;
            font-weight: 800;
        }

        .rankings-tabs {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            margin-bottom: 20px;
        }

        .rankings-tab,
        .rankings-link-button,
        .rankings-select {
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

        .rankings-tab.active {
            background: rgba(255,255,255,.12);
            border-color: rgba(255,255,255,.16);
        }

        .rankings-section {
            margin-bottom: 22px;
        }

        .rankings-section-header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 15px;
            margin-bottom: 15px;
        }

        .rankings-section-header h3 {
            margin: 0;
            font-size: 21px;
        }

        .rankings-section-header p {
            margin: 7px 0 0;
            font-size: 11px;
            opacity: .5;
        }

        .rankings-overview-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
        }

        .ranking-position-card {
            padding: 18px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 16px;
            background: rgba(255,255,255,.03);
        }

        .ranking-position-card span,
        .ranking-position-card strong,
        .ranking-position-card small {
            display: block;
        }

        .ranking-position-card span {
            font-size: 8px;
            font-weight: 900;
            letter-spacing: .08em;
            opacity: .45;
        }

        .ranking-position-card strong {
            margin-top: 7px;
            font-size: 26px;
        }

        .ranking-position-card small {
            margin-top: 4px;
            font-size: 9px;
            opacity: .5;
        }

        .rankings-two-column {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
            margin-bottom: 20px;
        }

        .rankings-panel {
            padding: 19px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 18px;
            background: rgba(255,255,255,.025);
        }

        .rankings-panel-header {
            margin-bottom: 15px;
        }

        .rankings-panel-header h3 {
            margin: 0;
            font-size: 17px;
        }

        .rankings-champion-highlight {
            display: flex;
            align-items: center;
            gap: 13px;
            padding: 15px;
            border-radius: 14px;
            background: rgba(255,255,255,.04);
        }

        .rankings-champion-icon {
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 12px;
            background: rgba(255,255,255,.08);
            font-size: 20px;
        }

        .rankings-champion-highlight span,
        .rankings-champion-highlight strong {
            display: block;
        }

        .rankings-champion-highlight span {
            font-size: 8px;
            font-weight: 900;
            opacity: .45;
        }

        .rankings-champion-highlight strong {
            margin-top: 4px;
            font-size: 14px;
        }

        .ranking-path {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
        }

        .ranking-path-step {
            text-align: center;
            opacity: .35;
        }

        .ranking-path-step.reached {
            opacity: 1;
        }

        .ranking-path-step div {
            width: 34px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 6px;
            border-radius: 50%;
            background: rgba(255,255,255,.07);
            font-size: 10px;
            font-weight: 900;
        }

        .ranking-path-step.reached div {
            background: rgba(255,255,255,.15);
        }

        .ranking-path-step span {
            font-size: 8px;
            font-weight: 700;
        }

        .rankings-list {
            display: grid;
            gap: 8px;
        }

        .rankings-list.compact {
            gap: 7px;
        }

        .ranking-row {
            display: grid;
            grid-template-columns: 65px minmax(180px, 1fr) 105px 75px 75px 130px;
            align-items: center;
            gap: 12px;
            padding: 13px 14px;
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 14px;
            background: rgba(255,255,255,.025);
        }

        .ranking-row.player {
            border-color: rgba(255,255,255,.18);
            background: rgba(255,255,255,.055);
        }

        .ranking-row-position {
            font-size: 12px;
            font-weight: 900;
        }

        .ranking-row-fighter {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
        }

        .ranking-row-avatar {
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 10px;
            background: rgba(255,255,255,.08);
            font-size: 11px;
            font-weight: 900;
        }

        .ranking-row-fighter strong,
        .ranking-row-fighter span {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .ranking-row-fighter strong {
            font-size: 11px;
        }

        .ranking-row-fighter span {
            margin-top: 3px;
            font-size: 8px;
            opacity: .45;
        }

        .ranking-row-record strong,
        .ranking-row-record span {
            display: block;
        }

        .ranking-row-record strong {
            font-size: 11px;
        }

        .ranking-row-record span {
            margin-top: 2px;
            font-size: 8px;
            opacity: .45;
        }

        .ranking-row-ovr span,
        .ranking-row-ovr strong {
            display: block;
        }

        .ranking-row-ovr span {
            font-size: 7px;
            opacity: .45;
        }

        .ranking-row-ovr strong {
            margin-top: 2px;
            font-size: 12px;
        }

        .ranking-row-movement {
            font-size: 10px;
            font-weight: 900;
        }

        .ranking-row-movement.up,
        .ranking-movement.up {
            opacity: 1;
        }

        .ranking-row-movement.down,
        .ranking-movement.down {
            opacity: .55;
        }

        .ranking-row-status {
            font-size: 8px;
            font-weight: 900;
            letter-spacing: .04em;
            opacity: .5;
        }

        .rankings-top-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
        }

        .ranking-feature-card {
            display: flex;
            gap: 15px;
            padding: 17px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 16px;
            background: rgba(255,255,255,.025);
        }

        .ranking-feature-card.player {
            border-color: rgba(255,255,255,.18);
        }

        .ranking-feature-rank {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 13px;
            background: rgba(255,255,255,.08);
            font-size: 13px;
            font-weight: 900;
        }

        .ranking-feature-body {
            min-width: 0;
            flex: 1;
        }

        .ranking-feature-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }

        .ranking-feature-badge {
            font-size: 7px;
            font-weight: 900;
            letter-spacing: .08em;
            opacity: .5;
        }

        .ranking-movement {
            font-size: 9px;
            font-weight: 900;
        }

        .ranking-feature-body h4 {
            margin: 7px 0 3px;
            font-size: 14px;
        }

        .ranking-feature-body p {
            margin: 0;
            font-size: 9px;
            opacity: .45;
        }

        .ranking-feature-stats {
            display: flex;
            gap: 15px;
            margin-top: 11px;
        }

        .ranking-feature-stats span {
            font-size: 8px;
            opacity: .45;
        }

        .ranking-feature-stats strong {
            margin-left: 4px;
            font-size: 10px;
            opacity: 1;
        }

        .rankings-champion-banner {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 17px;
            margin-bottom: 13px;
            border: 1px solid rgba(255,255,255,.09);
            border-radius: 16px;
            background: rgba(255,255,255,.04);
        }

        .rankings-champion-banner span,
        .rankings-champion-banner strong,
        .rankings-champion-banner small {
            display: block;
        }

        .rankings-champion-banner span {
            font-size: 8px;
            font-weight: 900;
            opacity: .45;
        }

        .rankings-champion-banner strong {
            margin-top: 4px;
            font-size: 16px;
        }

        .rankings-champion-banner small {
            margin-top: 3px;
            font-size: 9px;
            opacity: .45;
        }

        .rankings-select {
            min-width: 170px;
        }

        .champions-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
        }

        .champion-card {
            padding: 17px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 16px;
            background: rgba(255,255,255,.025);
        }

        .champion-card-icon {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
            border-radius: 11px;
            background: rgba(255,255,255,.07);
        }

        .champion-card span,
        .champion-card strong,
        .champion-card small {
            display: block;
        }

        .champion-card span {
            font-size: 9px;
            opacity: .45;
        }

        .champion-card strong {
            margin-top: 5px;
            font-size: 13px;
        }

        .champion-card small {
            margin-top: 4px;
            font-size: 8px;
            opacity: .4;
        }

        .rankings-empty {
            padding: 25px 18px;
            border: 1px dashed rgba(255,255,255,.1);
            border-radius: 15px;
            text-align: center;
            font-size: 10px;
            line-height: 1.5;
            opacity: .55;
        }

        @media (max-width: 1050px) {
            .rankings-overview-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .ranking-row {
                grid-template-columns: 55px minmax(150px, 1fr) 90px 65px 65px 100px;
            }

            .champions-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 850px) {
            .rankings-header {
                flex-wrap: wrap;
            }

            .rankings-player-summary {
                width: 100%;
                box-sizing: border-box;
            }

            .rankings-two-column {
                grid-template-columns: 1fr;
            }

            .rankings-top-grid {
                grid-template-columns: 1fr;
            }

            .ranking-row {
                grid-template-columns: 48px minmax(150px, 1fr) 80px 55px;
            }

            .ranking-row-movement,
            .ranking-row-status {
                display: none;
            }
        }

        @media (max-width: 560px) {
            .rankings-screen {
                padding: 14px;
            }

            .rankings-header {
                padding: 19px;
            }

            .rankings-header h2 {
                font-size: 22px;
            }

            .rankings-overview-grid {
                grid-template-columns: 1fr 1fr;
            }

            .ranking-position-card {
                padding: 14px;
            }

            .ranking-position-card strong {
                font-size: 21px;
            }

            .ranking-row {
                grid-template-columns: 42px minmax(120px, 1fr) 60px;
                gap: 8px;
            }

            .ranking-row-ovr {
                display: none;
            }

            .ranking-row-fighter {
                gap: 7px;
            }

            .ranking-row-avatar {
                width: 30px;
                height: 30px;
            }

            .champions-grid {
                grid-template-columns: 1fr;
            }

            .ranking-path {
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
            }

            .rankings-section-header {
                align-items: flex-start;
                flex-direction: column;
            }

            .rankings-select {
                width: 100%;
            }
        }
    `;

    document.head.appendChild(style);
}

/* ============================================================
   API PÚBLICA
   ============================================================ */

const rankingsScreenAPI = {
    version:
        RANKINGS_SCREEN_VERSION,

    initialize,
    refresh,
    render,
    open,
    close,

    setTab,
    setDivision,
    setPromotion,

    getRankings,
    getDivisionRanking,
    getPlayerRanking,
    getPlayerRankingPosition,

    getCurrentDivision,
    getCurrentPromotionId,

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
    window.rankingsScreenAPI =
        rankingsScreenAPI;

    window.MMA_LIFE_RANKINGS_SCREEN =
        rankingsScreenAPI;

    window.dispatchEvent(
        new CustomEvent(
            "mma-life-rankings-screen-ready",
            {
                detail:
                    rankingsScreenAPI
            }
        )
    );
}

/* ============================================================
   EXPORTS
   ============================================================ */

export {
    RANKINGS_SCREEN_VERSION,
    rankingsScreenAPI,

    initialize,
    refresh,
    render,
    open,
    close,

    setTab,
    setDivision,
    setPromotion,

    getRankings,
    getDivisionRanking,
    getPlayerRanking,
    getPlayerRankingPosition,

    getCurrentDivision,
    getCurrentPromotionId,

    getState,
    getSnapshot,
    validate
};

export default rankingsScreenAPI;
