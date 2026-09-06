/* ============================================================
   MMA LIFE DYNASTY
   UI — PROFILE SCREEN
   Arquivo: js/ui/profileScreen.js
   ============================================================ */

const PROFILE_SCREEN_VERSION = 1;

const profileScreenState = {
    initialized: false,
    database: null,
    activeTab: "overview",
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
        profileScreenState.database ||
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

function getIdentity(player) {
    return (
        player.identity ||
        player.profile ||
        {}
    );
}

function getPlayerName(player) {
    const identity =
        getIdentity(player);

    const first =
        player.firstName ||
        identity.firstName ||
        player.firstname ||
        "";

    const last =
        player.lastName ||
        identity.lastName ||
        player.lastname ||
        "";

    return (
        player.fullName ||
        identity.fullName ||
        player.name ||
        identity.name ||
        `${first} ${last}`.trim() ||
        "Lutador"
    );
}

function getNickname(player) {
    const identity =
        getIdentity(player);

    return (
        player.nickname ||
        player.nickName ||
        identity.nickname ||
        identity.nickName ||
        ""
    );
}

function getAge(player) {
    return Number(
        player.age ??
        player.identity?.age ??
        18
    );
}

function getGender(player) {
    return (
        player.gender ||
        player.sex ||
        player.identity?.gender ||
        "Não informado"
    );
}

function getCountry(player) {
    return (
        player.country ||
        player.countryName ||
        player.nationality ||
        player.identity?.country ||
        "Não informado"
    );
}

function getCity(player) {
    return (
        player.city ||
        player.cityName ||
        player.birthCity ||
        player.identity?.city ||
        "Não informado"
    );
}

function getHeight(player) {
    return Number(
        player.height ??
        player.heightCm ??
        player.physical?.height ??
        0
    );
}

function getWeight(player) {
    return Number(
        player.weight ??
        player.currentWeight ??
        player.physical?.weight ??
        0
    );
}

function getWeightClass(player) {
    return (
        player.weightClass ||
        player.division ||
        player.physical?.weightClass ||
        "Não definida"
    );
}

function getFightingStyle(player) {
    return (
        player.fightingStyle ||
        player.style ||
        player.combatStyle ||
        player.mmaStyle ||
        "MMA"
    );
}

function getStance(player) {
    return (
        player.stance ||
        player.guard ||
        player.position ||
        "Não definida"
    );
}

function getOverall(player) {
    const attributes =
        safeObject(
            player.attributes
        );

    return Number(
        player.overall ??
        player.ovr ??
        attributes.overall ??
        attributes.ovr ??
        0
    ) || 0;
}

function getPotential(player) {
    const potential =
        player.potential;

    if (
        potential &&
        typeof potential === "object"
    ) {
        return Number(
            potential.value ??
            potential.rating ??
            potential.max ??
            0
        ) || 0;
    }

    return Number(
        potential ??
        player.potentialRating ??
        0
    ) || 0;
}

/* ============================================================
   ATRIBUTOS
   ============================================================ */

const ATTRIBUTE_LABELS = {
    striking: "Striking",
    boxing: "Boxe",
    kickboxing: "Kickboxing",
    muayThai: "Muay Thai",
    wrestling: "Wrestling",
    takedowns: "Quedas",
    grappling: "Grappling",
    jiuJitsu: "Jiu-Jitsu",
    submission: "Finalização",
    groundAndPound: "Ground & Pound",
    defense: "Defesa",
    strikingDefense: "Defesa de golpes",
    takedownDefense: "Defesa de quedas",
    cardio: "Cardio",
    speed: "Velocidade",
    power: "Potência",
    strength: "Força",
    durability: "Durabilidade",
    chin: "Queixo",
    recovery: "Recuperação",
    stamina: "Resistência",
    agility: "Agilidade",
    technique: "Técnica",
    fightIQ: "QI de luta",
    intelligence: "Inteligência",
    aggression: "Agressividade",
    composure: "Controle emocional",
    confidence: "Confiança"
};

const ATTRIBUTE_GROUPS = [
    {
        id: "striking",
        title: "Striking",
        attributes: [
            "striking",
            "boxing",
            "kickboxing",
            "muayThai",
            "power",
            "speed"
        ]
    },
    {
        id: "grappling",
        title: "Grappling",
        attributes: [
            "wrestling",
            "takedowns",
            "grappling",
            "jiuJitsu",
            "submission",
            "groundAndPound"
        ]
    },
    {
        id: "defense",
        title: "Defesa",
        attributes: [
            "defense",
            "strikingDefense",
            "takedownDefense",
            "durability",
            "chin",
            "recovery"
        ]
    },
    {
        id: "physical",
        title: "Físico",
        attributes: [
            "strength",
            "cardio",
            "stamina",
            "agility",
            "speed",
            "power"
        ]
    },
    {
        id: "mental",
        title: "Mental",
        attributes: [
            "fightIQ",
            "intelligence",
            "aggression",
            "composure",
            "confidence"
        ]
    }
];

function getAttributes(player) {
    return safeObject(
        player.attributes
    );
}

function getAttributeValue(
    attributes,
    key
) {
    const value =
        attributes[key];

    if (
        value &&
        typeof value === "object"
    ) {
        return Number(
            value.value ??
            value.rating ??
            value.current ??
            0
        ) || 0;
    }

    return Number(
        value ?? 0
    ) || 0;
}

function getAverageAttributes(
    player
) {
    const attributes =
        getAttributes(player);

    const values = Object.keys(
        ATTRIBUTE_LABELS
    )
        .map(key =>
            getAttributeValue(
                attributes,
                key
            )
        )
        .filter(value =>
            value > 0
        );

    if (!values.length) {
        return 0;
    }

    return (
        values.reduce(
            (sum, value) =>
                sum + value,
            0
        ) / values.length
    );
}

/* ============================================================
   POTENCIAL / GENÉTICA
   ============================================================ */

function getPotentialData(player) {
    return safeObject(
        player.potential
    );
}

function getGenetics(player) {
    return safeObject(
        player.genetics
    );
}

function getGeneticValue(
    genetics,
    key
) {
    const value =
        genetics[key];

    if (
        value &&
        typeof value === "object"
    ) {
        return Number(
            value.value ??
            value.rating ??
            value.score ??
            0
        ) || 0;
    }

    return Number(
        value ?? 0
    ) || 0;
}

function getPersonality(player) {
    return (
        player.personality ||
        player.personalityType ||
        player.mental?.personality ||
        "Não definida"
    );
}

/* ============================================================
   HEALTH
   ============================================================ */

function getHealthState(database) {
    return (
        database?.health ||
        database?.player?.health ||
        database?.training?.health ||
        {}
    );
}

function getHealthValue(
    database,
    key,
    fallback = 0
) {
    const health =
        getHealthState(
            database
        );

    const value =
        health[key];

    if (
        value &&
        typeof value === "object"
    ) {
        return Number(
            value.value ??
            value.current ??
            value.rating ??
            fallback
        ) || fallback;
    }

    return Number(
        value ?? fallback
    ) || fallback;
}

function getHealthSummary(
    database
) {
    return {
        health: clamp(
            getHealthValue(
                database,
                "health",
                getHealthValue(
                    database,
                    "overall",
                    100
                )
            )
        ),

        energy: clamp(
            getNested(
                database,
                "training.energy",
                100
            )
        ),

        fatigue: clamp(
            getNested(
                database,
                "training.fatigue",
                0
            )
        ),

        injuries:
            safeArray(
                getNested(
                    database,
                    "health.injuries",
                    []
                )
            ).length
    };
}

/* ============================================================
   CAREER
   ============================================================ */

function getCareer(database) {
    return database?.career || {};
}

function getCareerStage(
    database
) {
    const career =
        getCareer(database);

    return (
        career.stage ||
        career.careerStage ||
        "Amateur"
    );
}

function getProfessionalStatus(
    database
) {
    const career =
        getCareer(database);

    return Boolean(
        career.professional ||
        career.isProfessional ||
        career.pro
    );
}

function getRecord(database) {
    const career =
        getCareer(database);

    const professional =
        safeObject(
            career.professional
        );

    const record =
        career.record ||
        professional.record ||
        {};

    return {
        wins: Number(
            record.wins ??
            career.wins ??
            professional.wins ??
            0
        ),

        losses: Number(
            record.losses ??
            career.losses ??
            professional.losses ??
            0
        ),

        draws: Number(
            record.draws ??
            career.draws ??
            professional.draws ??
            0
        ),

        noContests: Number(
            record.noContests ??
            record.nc ??
            0
        )
    };
}

function getRank(database) {
    const career =
        getCareer(database);

    const rankings =
        database?.world?.rankings ||
        database?.career?.rankings ||
        {};

    return (
        career.rank ??
        career.ranking ??
        career.currentRank ??
        rankings.playerRank ??
        "—"
    );
}

function getCurrentPromotion(
    database
) {
    const career =
        getCareer(database);

    const promotion =
        career.currentPromotion ||
        career.promotion ||
        career.organization;

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

function getTitles(database) {
    return safeArray(
        getCareer(database).titles ||
        database?.world?.titles ||
        []
    );
}

/* ============================================================
   FAMA / FINANÇAS
   ============================================================ */

function getMedia(database) {
    return database?.media || {};
}

function getBusiness(database) {
    return database?.business || {};
}

function getFame(database) {
    const media =
        getMedia(database);

    return Number(
        media.fame ??
        media.popularity ??
        media.marketability ??
        0
    ) || 0;
}

function getFollowers(database) {
    return Number(
        getMedia(database).followers ??
        getMedia(database).socialMedia?.followers ??
        0
    ) || 0;
}

function getReputation(database) {
    return Number(
        getMedia(database).reputation ??
        0
    ) || 0;
}

function getCash(database) {
    const business =
        getBusiness(database);

    const finances =
        business.finances ||
        {};

    return Number(
        finances.cash ??
        business.cash ??
        0
    ) || 0;
}

function getCareerEarnings(
    database
) {
    const business =
        getBusiness(database);

    const finances =
        business.finances ||
        {};

    return Number(
        finances.careerEarnings ??
        business.careerEarnings ??
        0
    ) || 0;
}

/* ============================================================
   TABS
   ============================================================ */

const PROFILE_TABS = [
    {
        id: "overview",
        label: "Visão geral"
    },
    {
        id: "attributes",
        label: "Atributos"
    },
    {
        id: "physical",
        label: "Físico"
    },
    {
        id: "mental",
        label: "Mental"
    },
    {
        id: "genetics",
        label: "Genética"
    },
    {
        id: "career",
        label: "Carreira"
    }
];

function renderTabs() {
    return `
        <div class="profile-tabs">
            ${PROFILE_TABS.map(
                tab => `
                    <button
                        class="profile-tab ${
                            profileScreenState.activeTab ===
                            tab.id
                                ? "active"
                                : ""
                        }"
                        data-profile-tab="${escapeHTML(
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
   HEADER
   ============================================================ */

function renderHeader(
    database
) {
    const player =
        getPlayer(database);

    const nickname =
        getNickname(player);

    const overall =
        getOverall(player);

    const stage =
        getCareerStage(database);

    return `
        <header class="profile-header">
            <div class="profile-avatar">
                ${escapeHTML(
                    getPlayerName(
                        player
                    )
                        .slice(0, 2)
                        .toUpperCase()
                )}
            </div>

            <div class="profile-header-main">
                <span class="profile-kicker">
                    PERFIL DO LUTADOR
                </span>

                <h2>
                    ${escapeHTML(
                        getPlayerName(
                            player
                        )
                    )}
                </h2>

                ${
                    nickname
                        ? `
                            <div class="profile-nickname">
                                "${escapeHTML(
                                    nickname
                                )}"
                            </div>
                        `
                        : ""
                }

                <div class="profile-header-meta">
                    <span>
                        ${escapeHTML(
                            stage
                        )}
                    </span>

                    <span>
                        OVR ${formatNumber(
                            overall
                        )}
                    </span>

                    <span>
                        ${escapeHTML(
                            getWeightClass(
                                player
                            )
                        )}
                    </span>
                </div>
            </div>

            <div class="profile-rating">
                <span>
                    OVR
                </span>

                <strong>
                    ${formatNumber(
                        overall
                    )}
                </strong>

                ${
                    getPotential(player)
                        ? `
                            <small>
                                POT ${formatNumber(
                                    getPotential(
                                        player
                                    )
                                )}
                            </small>
                        `
                        : ""
                }
            </div>
        </header>
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

    const record =
        getRecord(database);

    const health =
        getHealthSummary(
            database
        );

    return `
        <section class="profile-section">
            <div class="profile-section-header">
                <div>
                    <span class="profile-kicker">
                        IDENTIDADE
                    </span>

                    <h3>
                        Informações pessoais
                    </h3>
                </div>
            </div>

            <div class="profile-info-grid">
                ${renderInfoCard(
                    "Idade",
                    `${formatNumber(
                        getAge(player)
                    )} anos`
                )}

                ${renderInfoCard(
                    "Gênero",
                    capitalize(
                        getGender(
                            player
                        )
                    )
                )}

                ${renderInfoCard(
                    "País",
                    getCountry(
                        player
                    )
                )}

                ${renderInfoCard(
                    "Cidade",
                    getCity(
                        player
                    )
                )}

                ${renderInfoCard(
                    "Altura",
                    getHeight(player)
                        ? `${formatNumber(
                            getHeight(
                                player
                            )
                        )} cm`
                        : "—"
                )}

                ${renderInfoCard(
                    "Peso",
                    getWeight(player)
                        ? `${formatNumber(
                            getWeight(
                                player
                            )
                        )} kg`
                        : "—"
                )}

                ${renderInfoCard(
                    "Divisão",
                    getWeightClass(
                        player
                    )
                )}

                ${renderInfoCard(
                    "Estilo",
                    capitalize(
                        getFightingStyle(
                            player
                        )
                    )
                )}
            </div>
        </section>

        <section class="profile-section">
            <div class="profile-section-header">
                <div>
                    <span class="profile-kicker">
                        COMBATE
                    </span>

                    <h3>
                        Perfil esportivo
                    </h3>
                </div>
            </div>

            <div class="profile-combat-panel">
                <div class="profile-style-display">
                    <div class="profile-style-icon">
                        🥊
                    </div>

                    <div>
                        <span>
                            ESTILO PRINCIPAL
                        </span>

                        <strong>
                            ${escapeHTML(
                                capitalize(
                                    getFightingStyle(
                                        player
                                    )
                                )
                            )}
                        </strong>

                        <small>
                            Base:
                            ${escapeHTML(
                                capitalize(
                                    getStance(
                                        player
                                    )
                                )
                            )}
                        </small>
                    </div>
                </div>

                <div class="profile-record">
                    <span>
                        CARTEL
                    </span>

                    <strong>
                        ${formatNumber(
                            record.wins
                        )} -
                        ${formatNumber(
                            record.losses
                        )} -
                        ${formatNumber(
                            record.draws
                        )}
                    </strong>

                    <small>
                        ${
                            record.noContests
                                ? `${formatNumber(
                                    record.noContests
                                )} NC`
                                : "Sem NC"
                        }
                    </small>
                </div>
            </div>
        </section>

        <section class="profile-section">
            <div class="profile-section-header">
                <div>
                    <span class="profile-kicker">
                        ESTADO
                    </span>

                    <h3>
                        Condição atual
                    </h3>
                </div>
            </div>

            <div class="profile-condition-grid">
                ${renderConditionBar(
                    "Saúde",
                    health.health
                )}

                ${renderConditionBar(
                    "Energia",
                    health.energy
                )}

                ${renderConditionBar(
                    "Fadiga",
                    100 -
                    health.fatigue
                )}

                <div class="profile-condition-card">
                    <span>
                        LESÕES
                    </span>

                    <strong>
                        ${formatNumber(
                            health.injuries
                        )}
                    </strong>

                    <small>
                        registradas
                    </small>
                </div>
            </div>
        </section>

        <section class="profile-section">
            <div class="profile-section-header">
                <div>
                    <span class="profile-kicker">
                        STATUS
                    </span>

                    <h3>
                        Indicadores da carreira
                    </h3>
                </div>
            </div>

            <div class="profile-info-grid">
                ${renderInfoCard(
                    "Organização",
                    getCurrentPromotion(
                        database
                    )
                )}

                ${renderInfoCard(
                    "Ranking",
                    String(
                        getRank(
                            database
                        )
                    )
                )}

                ${renderInfoCard(
                    "Fama",
                    formatNumber(
                        getFame(
                            database
                        )
                    )
                )}

                ${renderInfoCard(
                    "Seguidores",
                    formatNumber(
                        getFollowers(
                            database
                        )
                    )
                )}

                ${renderInfoCard(
                    "Reputação",
                    formatNumber(
                        getReputation(
                            database
                        )
                    )
                )}

                ${renderInfoCard(
                    "Patrimônio líquido",
                    formatMoney(
                        getCash(
                            database
                        )
                    )
                )}
            </div>
        </section>
    `;
}

function renderInfoCard(
    label,
    value
) {
    return `
        <div class="profile-info-card">
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

function renderConditionBar(
    label,
    value
) {
    const percentage =
        clamp(value);

    return `
        <div class="profile-condition-card">
            <div class="profile-condition-top">
                <span>
                    ${escapeHTML(
                        label
                    )}
                </span>

                <strong>
                    ${formatNumber(
                        percentage
                    )}
                </strong>
            </div>

            <div class="profile-progress">
                <div
                    class="profile-progress-fill"
                    style="width:${percentage}%"
                ></div>
            </div>
        </div>
    `;
}

/* ============================================================
   ATRIBUTOS
   ============================================================ */

function renderAttributes(
    database
) {
    const player =
        getPlayer(database);

    const attributes =
        getAttributes(player);

    return `
        <section class="profile-section">
            <div class="profile-section-header">
                <div>
                    <span class="profile-kicker">
                        DESENVOLVIMENTO
                    </span>

                    <h3>
                        Atributos de combate
                    </h3>

                    <p>
                        Valores atuais do lutador.
                    </p>
                </div>

                <div class="profile-average">
                    MÉDIA
                    <strong>
                        ${formatNumber(
                            getAverageAttributes(
                                player
                            )
                        )}
                    </strong>
                </div>
            </div>

            <div class="attribute-groups">
                ${ATTRIBUTE_GROUPS.map(
                    group =>
                        renderAttributeGroup(
                            group,
                            attributes
                        )
                ).join("")}
            </div>
        </section>
    `;
}

function renderAttributeGroup(
    group,
    attributes
) {
    return `
        <div class="attribute-group">
            <div class="attribute-group-header">
                <h4>
                    ${escapeHTML(
                        group.title
                    )}
                </h4>
            </div>

            <div class="attribute-list">
                ${group.attributes.map(
                    key => {
                        const value =
                            getAttributeValue(
                                attributes,
                                key
                            );

                        return `
                            <div class="attribute-row">
                                <div class="attribute-label">
                                    <span>
                                        ${escapeHTML(
                                            ATTRIBUTE_LABELS[
                                                key
                                            ] ||
                                            capitalize(
                                                key
                                            )
                                        )}
                                    </span>

                                    <strong>
                                        ${formatNumber(
                                            value
                                        )}
                                    </strong>
                                </div>

                                <div class="attribute-bar">
                                    <div
                                        class="attribute-bar-fill"
                                        style="width:${clamp(
                                            value
                                        )}%"
                                    ></div>
                                </div>
                            </div>
                        `;
                    }
                ).join("")}
            </div>
        </div>
    `;
}

/* ============================================================
   FÍSICO
   ============================================================ */

function renderPhysical(
    database
) {
    const player =
        getPlayer(database);

    const physical =
        safeObject(
            player.physical
        );

    const attributes =
        getAttributes(player);

    const physicalStats = [
        {
            label: "Força",
            value: getAttributeValue(
                attributes,
                "strength"
            )
        },
        {
            label: "Potência",
            value: getAttributeValue(
                attributes,
                "power"
            )
        },
        {
            label: "Velocidade",
            value: getAttributeValue(
                attributes,
                "speed"
            )
        },
        {
            label: "Agilidade",
            value: getAttributeValue(
                attributes,
                "agility"
            )
        },
        {
            label: "Cardio",
            value: getAttributeValue(
                attributes,
                "cardio"
            )
        },
        {
            label: "Resistência",
            value: getAttributeValue(
                attributes,
                "stamina"
            )
        },
        {
            label: "Durabilidade",
            value: getAttributeValue(
                attributes,
                "durability"
            )
        },
        {
            label: "Queixo",
            value: getAttributeValue(
                attributes,
                "chin"
            )
        }
    ];

    return `
        <section class="profile-section">
            <div class="profile-section-header">
                <div>
                    <span class="profile-kicker">
                        FÍSICO
                    </span>

                    <h3>
                        Características físicas
                    </h3>
                </div>
            </div>

            <div class="physical-overview">
                ${renderPhysicalMetric(
                    "Altura",
                    getHeight(player)
                        ? `${formatNumber(
                            getHeight(
                                player
                            )
                        )} cm`
                        : "—"
                )}

                ${renderPhysicalMetric(
                    "Peso",
                    getWeight(player)
                        ? `${formatNumber(
                            getWeight(
                                player
                            )
                        )} kg`
                        : "—"
                )}

                ${renderPhysicalMetric(
                    "Divisão",
                    getWeightClass(
                        player
                    )
                )}

                ${renderPhysicalMetric(
                    "Stance",
                    capitalize(
                        getStance(
                            player
                        )
                    )
                )}
            </div>

            <div class="physical-attributes">
                ${physicalStats.map(
                    stat =>
                        renderMetricBar(
                            stat.label,
                            stat.value
                        )
                ).join("")}
            </div>

            ${
                Object.keys(
                    physical
                ).length
                    ? `
                        <div class="physical-extra">
                            <span class="profile-kicker">
                                DADOS FÍSICOS
                            </span>

                            <div>
                                ${Object.entries(
                                    physical
                                )
                                    .filter(
                                        ([key]) =>
                                            ![
                                                "height",
                                                "weight",
                                                "weightClass"
                                            ].includes(
                                                key
                                            )
                                    )
                                    .slice(
                                        0,
                                        10
                                    )
                                    .map(
                                        (
                                            [
                                                key,
                                                value
                                            ]
                                        ) =>
                                            renderInfoCard(
                                                capitalize(
                                                    key
                                                ),
                                                typeof value ===
                                                    "object"
                                                    ? JSON.stringify(
                                                        value
                                                    )
                                                    : String(
                                                        value
                                                    )
                                            )
                                    )
                                    .join("")}
                            </div>
                        </div>
                    `
                    : ""
            }
        </section>
    `;
}

function renderPhysicalMetric(
    label,
    value
) {
    return `
        <div class="physical-metric">
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

function renderMetricBar(
    label,
    value
) {
    return `
        <div class="metric-bar-row">
            <div>
                <span>
                    ${escapeHTML(
                        label
                    )}
                </span>

                <strong>
                    ${formatNumber(
                        value
                    )}
                </strong>
            </div>

            <div class="attribute-bar">
                <div
                    class="attribute-bar-fill"
                    style="width:${clamp(
                        value
                    )}%"
                ></div>
            </div>
        </div>
    `;
}

/* ============================================================
   MENTAL
   ============================================================ */

function renderMental(
    database
) {
    const player =
        getPlayer(database);

    const attributes =
        getAttributes(player);

    const personality =
        getPersonality(player);

    const mentalAttributes = [
        "fightIQ",
        "intelligence",
        "aggression",
        "composure",
        "confidence"
    ];

    return `
        <section class="profile-section">
            <div class="profile-section-header">
                <div>
                    <span class="profile-kicker">
                        MENTE
                    </span>

                    <h3>
                        Perfil mental
                    </h3>
                </div>
            </div>

            <div class="mental-personality-card">
                <div class="mental-personality-icon">
                    🧠
                </div>

                <div>
                    <span>
                        PERSONALIDADE
                    </span>

                    <strong>
                        ${escapeHTML(
                            capitalize(
                                personality
                            )
                        )}
                    </strong>

                    <small>
                        Influencia decisões,
                        comportamento e evolução.
                    </small>
                </div>
            </div>

            <div class="mental-attributes">
                ${mentalAttributes.map(
                    key =>
                        renderMetricBar(
                            ATTRIBUTE_LABELS[
                                key
                            ],
                            getAttributeValue(
                                attributes,
                                key
                            )
                        )
                ).join("")}
            </div>
        </section>
    `;
}

/* ============================================================
   GENÉTICA
   ============================================================ */

function renderGenetics(
    database
) {
    const player =
        getPlayer(database);

    const genetics =
        getGenetics(player);

    const potential =
        getPotentialData(
            player
        );

    const entries =
        Object.entries(
            genetics
        )
            .filter(
                ([key]) =>
                    ![
                        "parents",
                        "mother",
                        "father",
                        "children"
                    ].includes(
                        key
                    )
            )
            .slice(
                0,
                12
            );

    return `
        <section class="profile-section">
            <div class="profile-section-header">
                <div>
                    <span class="profile-kicker">
                        HERANÇA
                    </span>

                    <h3>
                        Genética e potencial
                    </h3>

                    <p>
                        Características que podem influenciar
                        o teto de desenvolvimento.
                    </p>
                </div>
            </div>

            <div class="genetics-highlight-grid">
                <div class="genetic-highlight">
                    <span>
                        POTENCIAL
                    </span>

                    <strong>
                        ${formatNumber(
                            getPotential(
                                player
                            )
                        )}
                    </strong>

                    <small>
                        teto estimado
                    </small>
                </div>

                <div class="genetic-highlight">
                    <span>
                        OVR ATUAL
                    </span>

                    <strong>
                        ${formatNumber(
                            getOverall(
                                player
                            )
                        )}
                    </strong>

                    <small>
                        nível atual
                    </small>
                </div>

                <div class="genetic-highlight">
                    <span>
                        ESPAÇO DE EVOLUÇÃO
                    </span>

                    <strong>
                        ${formatNumber(
                            Math.max(
                                0,
                                getPotential(
                                    player
                                ) -
                                getOverall(
                                    player
                                )
                            )
                        )}
                    </strong>

                    <small>
                        pontos possíveis
                    </small>
                </div>
            </div>

            ${
                entries.length
                    ? `
                        <div class="genetics-list">
                            ${entries.map(
                                (
                                    [
                                        key,
                                        value
                                    ]
                                ) =>
                                    renderGeneticRow(
                                        key,
                                        getGeneticValue(
                                            genetics,
                                            key
                                        ),
                                        value
                                    )
                            ).join("")}
                        </div>
                    `
                    : `
                        <div class="profile-empty">
                            Dados genéticos detalhados
                            ainda não estão disponíveis.
                        </div>
                    `
            }

            ${
                Object.keys(
                    potential
                ).length
                    ? `
                        <div class="potential-data">
                            <span class="profile-kicker">
                                DADOS DE POTENCIAL
                            </span>

                            <div>
                                ${Object.entries(
                                    potential
                                )
                                    .filter(
                                        ([key]) =>
                                            ![
                                                "value",
                                                "rating",
                                                "max"
                                            ].includes(
                                                key
                                            )
                                    )
                                    .slice(
                                        0,
                                        8
                                    )
                                    .map(
                                        (
                                            [
                                                key,
                                                value
                                            ]
                                        ) =>
                                            renderInfoCard(
                                                capitalize(
                                                    key
                                                ),
                                                typeof value ===
                                                    "object"
                                                    ? JSON.stringify(
                                                        value
                                                    )
                                                    : String(
                                                        value
                                                    )
                                            )
                                    )
                                    .join("")}
                            </div>
                        </div>
                    `
                    : ""
            }
        </section>
    `;
}

function renderGeneticRow(
    key,
    value,
    rawValue
) {
    const displayValue =
        value > 0
            ? formatNumber(
                value
            )
            : typeof rawValue ===
                "string"
                ? rawValue
                : "—";

    return `
        <div class="genetic-row">
            <div>
                <span>
                    ${escapeHTML(
                        capitalize(
                            key
                        )
                    )}
                </span>

                <strong>
                    ${escapeHTML(
                        displayValue
                    )}
                </strong>
            </div>

            ${
                value > 0
                    ? `
                        <div class="attribute-bar">
                            <div
                                class="attribute-bar-fill"
                                style="width:${clamp(
                                    value
                                )}%"
                            ></div>
                        </div>
                    `
                    : ""
            }
        </div>
    `;
}

/* ============================================================
   CARREIRA
   ============================================================ */

function renderCareer(
    database
) {
    const player =
        getPlayer(database);

    const record =
        getRecord(database);

    const titles =
        getTitles(database);

    const professional =
        getProfessionalStatus(
            database
        );

    return `
        <section class="profile-section">
            <div class="profile-section-header">
                <div>
                    <span class="profile-kicker">
                        TRAJETÓRIA
                    </span>

                    <h3>
                        Carreira
                    </h3>
                </div>
            </div>

            <div class="career-profile-grid">
                ${renderCareerStat(
                    "Etapa",
                    getCareerStage(
                        database
                    )
                )}

                ${renderCareerStat(
                    "Profissional",
                    professional
                        ? "Sim"
                        : "Não"
                )}

                ${renderCareerStat(
                    "Organização",
                    getCurrentPromotion(
                        database
                    )
                )}

                ${renderCareerStat(
                    "Ranking",
                    String(
                        getRank(
                            database
                        )
                    )
                )}

                ${renderCareerStat(
                    "Vitórias",
                    formatNumber(
                        record.wins
                    )
                )}

                ${renderCareerStat(
                    "Derrotas",
                    formatNumber(
                        record.losses
                    )
                )}

                ${renderCareerStat(
                    "Empates",
                    formatNumber(
                        record.draws
                    )
                )}

                ${renderCareerStat(
                    "Títulos",
                    formatNumber(
                        titles.length
                    )
                )}
            </div>
        </section>

        <section class="profile-section">
            <div class="profile-section-header">
                <div>
                    <span class="profile-kicker">
                        CONQUISTAS
                    </span>

                    <h3>
                        Títulos
                    </h3>
                </div>
            </div>

            ${
                titles.length
                    ? `
                        <div class="profile-title-list">
                            ${titles.map(
                                title =>
                                    `
                                        <div class="profile-title-card">
                                            <div class="title-icon">
                                                🏆
                                            </div>

                                            <div>
                                                <strong>
                                                    ${escapeHTML(
                                                        title.name ||
                                                        title.title ||
                                                        title.division ||
                                                        "Título"
                                                    )}
                                                </strong>

                                                <span>
                                                    ${escapeHTML(
                                                        title.promotion ||
                                                        title.organization ||
                                                        ""
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    `
                            ).join("")}
                        </div>
                    `
                    : `
                        <div class="profile-empty">
                            Nenhum título conquistado ainda.
                        </div>
                    `
            }
        </section>
    `;
}

function renderCareerStat(
    label,
    value
) {
    return `
        <div class="career-stat">
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

    profileScreenState.database =
        db;

    const content =
        ensureContent();

    content.innerHTML = `
        <div class="profile-screen">
            ${renderHeader(db)}

            ${renderTabs()}

            <div class="profile-screen-content">
                ${renderActiveTab(db)}
            </div>
        </div>
    `;

    profileScreenState.lastRender =
        Date.now();

    bindEvents();

    return content;
}

function renderActiveTab(
    database
) {
    switch (
        profileScreenState.activeTab
    ) {
        case "attributes":
            return renderAttributes(
                database
            );

        case "physical":
            return renderPhysical(
                database
            );

        case "mental":
            return renderMental(
                database
            );

        case "genetics":
            return renderGenetics(
                database
            );

        case "career":
            return renderCareer(
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
            "[data-profile-tab]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    setTab(
                        button.dataset
                            .profileTab
                    );
                }
            );
        });
}

function setTab(tab) {
    const valid =
        PROFILE_TABS.some(
            item =>
                item.id === tab
        );

    if (!valid) {
        return false;
    }

    profileScreenState.activeTab =
        tab;

    render(
        profileScreenState.database ||
        getDatabase()
    );

    return true;
}

/* ============================================================
   ABRIR / FECHAR
   ============================================================ */

function open(
    tab = "overview",
    database = null
) {
    profileScreenState.activeTab =
        PROFILE_TABS.some(
            item =>
                item.id === tab
        )
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
   INICIALIZAÇÃO
   ============================================================ */

function initialize(
    database = null
) {
    profileScreenState.database =
        getDatabase(database);

    profileScreenState.initialized =
        true;

    injectStyles();

    return render(
        profileScreenState.database
    );
}

function refresh(
    database = null
) {
    if (database) {
        profileScreenState.database =
            database;
    }

    injectStyles();

    return render(
        profileScreenState.database ||
        getDatabase()
    );
}

/* ============================================================
   ESTADO / SNAPSHOT / VALIDAÇÃO
   ============================================================ */

function getState() {
    return clone(
        profileScreenState
    );
}

function getSnapshot() {
    const database =
        profileScreenState.database ||
        getDatabase();

    const player =
        getPlayer(database);

    return {
        version:
            PROFILE_SCREEN_VERSION,

        state:
            getState(),

        player: {
            name:
                getPlayerName(
                    player
                ),

            age:
                getAge(player),

            country:
                getCountry(player),

            city:
                getCity(player),

            weightClass:
                getWeightClass(
                    player
                ),

            overall:
                getOverall(player),

            potential:
                getPotential(player),

            fightingStyle:
                getFightingStyle(
                    player
                ),

            stance:
                getStance(player)
        },

        career: {
            stage:
                getCareerStage(
                    database
                ),

            professional:
                getProfessionalStatus(
                    database
                ),

            record:
                getRecord(database),

            rank:
                getRank(database),

            promotion:
                getCurrentPromotion(
                    database
                )
        }
    };
}

function validate(
    database = null
) {
    const db =
        database ||
        profileScreenState.database;

    const errors = [];
    const warnings = [];

    if (!db) {
        errors.push(
            "Database não encontrada."
        );
    }

    if (db) {
        const player =
            getPlayer(db);

        if (!player) {
            errors.push(
                "Jogador não encontrado."
            );
        }

        if (
            !PROFILE_TABS.some(
                tab =>
                    tab.id ===
                    profileScreenState.activeTab
            )
        ) {
            warnings.push(
                "A aba ativa do perfil é inválida."
            );
        }

        if (
            getOverall(player) <= 0
        ) {
            warnings.push(
                "OVR do jogador ainda não foi definido."
            );
        }

        if (
            !getWeightClass(player)
        ) {
            warnings.push(
                "Divisão de peso não definida."
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
            "mma-life-profile-screen-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement("style");

    style.id =
        "mma-life-profile-screen-styles";

    style.textContent = `
        .profile-screen {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 24px;
            box-sizing: border-box;
        }

        .profile-header {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 25px;
            margin-bottom: 17px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 20px;
            background: rgba(255,255,255,.035);
        }

        .profile-avatar {
            width: 72px;
            height: 72px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 20px;
            background: rgba(255,255,255,.08);
            font-size: 21px;
            font-weight: 900;
        }

        .profile-header-main {
            min-width: 0;
            flex: 1;
        }

        .profile-header h2 {
            margin: 0;
            font-size: 28px;
        }

        .profile-nickname {
            margin-top: 3px;
            font-size: 11px;
            opacity: .5;
        }

        .profile-kicker {
            display: block;
            margin-bottom: 5px;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .14em;
            text-transform: uppercase;
            opacity: .46;
        }

        .profile-header-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 10px;
        }

        .profile-header-meta span {
            padding: 6px 8px;
            border-radius: 8px;
            background: rgba(255,255,255,.05);
            font-size: 8px;
            font-weight: 800;
        }

        .profile-rating {
            min-width: 95px;
            padding: 14px;
            border-radius: 15px;
            background: rgba(255,255,255,.06);
            text-align: center;
        }

        .profile-rating span,
        .profile-rating strong,
        .profile-rating small {
            display: block;
        }

        .profile-rating span {
            font-size: 8px;
            font-weight: 900;
            opacity: .45;
        }

        .profile-rating strong {
            margin-top: 3px;
            font-size: 31px;
            line-height: 1;
        }

        .profile-rating small {
            margin-top: 5px;
            font-size: 8px;
            font-weight: 900;
            opacity: .55;
        }

        .profile-tabs {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            margin-bottom: 20px;
        }

        .profile-tab {
            border: 1px solid rgba(255,255,255,.08);
            background: rgba(255,255,255,.035);
            color: inherit;
            border-radius: 10px;
            padding: 10px 13px;
            font: inherit;
            font-size: 10px;
            font-weight: 800;
            cursor: pointer;
            white-space: nowrap;
        }

        .profile-tab.active {
            background: rgba(255,255,255,.12);
            border-color: rgba(255,255,255,.16);
        }

        .profile-section {
            margin-bottom: 23px;
        }

        .profile-section-header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 15px;
            margin-bottom: 14px;
        }

        .profile-section-header h3 {
            margin: 0;
            font-size: 20px;
        }

        .profile-section-header p {
            margin: 6px 0 0;
            font-size: 10px;
            opacity: .5;
        }

        .profile-info-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }

        .profile-info-card {
            padding: 15px;
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 13px;
            background: rgba(255,255,255,.025);
        }

        .profile-info-card span,
        .profile-info-card strong {
            display: block;
        }

        .profile-info-card span {
            font-size: 8px;
            font-weight: 900;
            letter-spacing: .06em;
            opacity: .43;
        }

        .profile-info-card strong {
            margin-top: 6px;
            font-size: 11px;
        }

        .profile-combat-panel {
            display: grid;
            grid-template-columns: 1fr 220px;
            gap: 12px;
            padding: 18px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 16px;
            background: rgba(255,255,255,.025);
        }

        .profile-style-display {
            display: flex;
            align-items: center;
            gap: 13px;
        }

        .profile-style-icon {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 13px;
            background: rgba(255,255,255,.07);
            font-size: 21px;
        }

        .profile-style-display span,
        .profile-style-display strong,
        .profile-style-display small {
            display: block;
        }

        .profile-style-display span,
        .profile-record span {
            font-size: 8px;
            font-weight: 900;
            opacity: .43;
        }

        .profile-style-display strong {
            margin-top: 4px;
            font-size: 15px;
        }

        .profile-style-display small {
            margin-top: 3px;
            font-size: 9px;
            opacity: .48;
        }

        .profile-record {
            padding: 12px;
            border-radius: 11px;
            background: rgba(255,255,255,.04);
        }

        .profile-record strong,
        .profile-record small {
            display: block;
        }

        .profile-record strong {
            margin-top: 5px;
            font-size: 17px;
        }

        .profile-record small {
            margin-top: 3px;
            font-size: 8px;
            opacity: .43;
        }

        .profile-condition-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }

        .profile-condition-card {
            padding: 14px;
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 13px;
            background: rgba(255,255,255,.025);
        }

        .profile-condition-top {
            display: flex;
            justify-content: space-between;
            gap: 10px;
        }

        .profile-condition-card span,
        .profile-condition-card strong,
        .profile-condition-card small {
            display: block;
        }

        .profile-condition-card span {
            font-size: 8px;
            font-weight: 900;
            opacity: .43;
        }

        .profile-condition-card strong {
            margin-top: 5px;
            font-size: 17px;
        }

        .profile-condition-card small {
            margin-top: 3px;
            font-size: 8px;
            opacity: .42;
        }

        .profile-progress,
        .attribute-bar {
            width: 100%;
            height: 6px;
            overflow: hidden;
            margin-top: 9px;
            border-radius: 99px;
            background: rgba(255,255,255,.06);
        }

        .profile-progress-fill,
        .attribute-bar-fill {
            height: 100%;
            border-radius: inherit;
            background: rgba(255,255,255,.48);
        }

        .profile-average {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 10px;
            border-radius: 9px;
            background: rgba(255,255,255,.045);
            font-size: 8px;
            font-weight: 900;
            opacity: .65;
        }

        .profile-average strong {
            font-size: 13px;
            opacity: 1;
        }

        .attribute-groups {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
        }

        .attribute-group {
            padding: 17px;
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 15px;
            background: rgba(255,255,255,.025);
        }

        .attribute-group-header h4 {
            margin: 0 0 14px;
            font-size: 13px;
        }

        .attribute-list {
            display: grid;
            gap: 11px;
        }

        .attribute-label {
            display: flex;
            justify-content: space-between;
            gap: 10px;
        }

        .attribute-label span {
            font-size: 9px;
            opacity: .62;
        }

        .attribute-label strong {
            font-size: 9px;
        }

        .physical-overview {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 16px;
        }

        .physical-metric {
            padding: 15px;
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 13px;
            background: rgba(255,255,255,.025);
        }

        .physical-metric span,
        .physical-metric strong {
            display: block;
        }

        .physical-metric span {
            font-size: 8px;
            opacity: .44;
        }

        .physical-metric strong {
            margin-top: 6px;
            font-size: 13px;
        }

        .physical-attributes,
        .mental-attributes {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 13px 18px;
            padding: 18px;
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 15px;
            background: rgba(255,255,255,.025);
        }

        .metric-bar-row > div:first-child {
            display: flex;
            justify-content: space-between;
            gap: 10px;
        }

        .metric-bar-row span {
            font-size: 9px;
            opacity: .55;
        }

        .metric-bar-row strong {
            font-size: 9px;
        }

        .physical-extra,
        .potential-data {
            margin-top: 15px;
        }

        .physical-extra > div,
        .potential-data > div {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 9px;
        }

        .mental-personality-card {
            display: flex;
            align-items: center;
            gap: 13px;
            padding: 18px;
            margin-bottom: 13px;
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 15px;
            background: rgba(255,255,255,.025);
        }

        .mental-personality-icon {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 13px;
            background: rgba(255,255,255,.07);
            font-size: 21px;
        }

        .mental-personality-card span,
        .mental-personality-card strong,
        .mental-personality-card small {
            display: block;
        }

        .mental-personality-card span {
            font-size: 8px;
            font-weight: 900;
            opacity: .43;
        }

        .mental-personality-card strong {
            margin-top: 4px;
            font-size: 16px;
        }

        .mental-personality-card small {
            margin-top: 4px;
            font-size: 9px;
            opacity: .48;
        }

        .genetics-highlight-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 13px;
        }

        .genetic-highlight {
            padding: 17px;
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 15px;
            background: rgba(255,255,255,.025);
        }

        .genetic-highlight span,
        .genetic-highlight strong,
        .genetic-highlight small {
            display: block;
        }

        .genetic-highlight span {
            font-size: 8px;
            font-weight: 900;
            opacity: .43;
        }

        .genetic-highlight strong {
            margin-top: 5px;
            font-size: 24px;
        }

        .genetic-highlight small {
            margin-top: 3px;
            font-size: 8px;
            opacity: .42;
        }

        .genetics-list {
            display: grid;
            gap: 8px;
        }

        .genetic-row {
            padding: 12px 14px;
            border: 1px solid rgba(255,255,255,.06);
            border-radius: 11px;
            background: rgba(255,255,255,.025);
        }

        .genetic-row > div:first-child {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }

        .genetic-row span {
            font-size: 9px;
            opacity: .55;
        }

        .genetic-row strong {
            font-size: 10px;
        }

        .career-profile-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }

        .career-stat {
            padding: 16px;
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 14px;
            background: rgba(255,255,255,.025);
        }

        .career-stat span,
        .career-stat strong {
            display: block;
        }

        .career-stat span {
            font-size: 8px;
            font-weight: 900;
            opacity: .43;
        }

        .career-stat strong {
            margin-top: 6px;
            font-size: 12px;
        }

        .profile-title-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }

        .profile-title-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 15px;
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 14px;
            background: rgba(255,255,255,.025);
        }

        .title-icon {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 11px;
            background: rgba(255,255,255,.07);
        }

        .profile-title-card strong,
        .profile-title-card span {
            display: block;
        }

        .profile-title-card strong {
            font-size: 11px;
        }

        .profile-title-card span {
            margin-top: 4px;
            font-size: 8px;
            opacity: .45;
        }

        .profile-empty {
            padding: 25px;
            border: 1px dashed rgba(255,255,255,.1);
            border-radius: 14px;
            text-align: center;
            font-size: 10px;
            opacity: .5;
        }

        @media (max-width: 1050px) {
            .profile-info-grid,
            .profile-condition-grid,
            .career-profile-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .attribute-groups {
                grid-template-columns: 1fr;
            }

            .physical-overview {
                grid-template-columns: repeat(2, 1fr);
            }

            .genetics-highlight-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        @media (max-width: 800px) {
            .profile-combat-panel {
                grid-template-columns: 1fr;
            }

            .physical-attributes,
            .mental-attributes {
                grid-template-columns: 1fr;
            }

            .physical-extra > div,
            .potential-data > div {
                grid-template-columns: repeat(2, 1fr);
            }

            .profile-title-list {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 560px) {
            .profile-screen {
                padding: 14px;
            }

            .profile-header {
                align-items: flex-start;
                padding: 18px;
            }

            .profile-avatar {
                width: 55px;
                height: 55px;
                border-radius: 15px;
            }

            .profile-header h2 {
                font-size: 20px;
            }

            .profile-rating {
                min-width: 65px;
                padding: 10px;
            }

            .profile-rating strong {
                font-size: 23px;
            }

            .profile-info-grid,
            .profile-condition-grid,
            .career-profile-grid,
            .physical-overview {
                grid-template-columns: 1fr 1fr;
            }

            .genetics-highlight-grid {
                grid-template-columns: 1fr;
            }

            .physical-extra > div,
            .potential-data > div {
                grid-template-columns: 1fr;
            }
        }
    `;

    document.head.appendChild(style);
}

/* ============================================================
   API
   ============================================================ */

const profileScreenAPI = {
    version:
        PROFILE_SCREEN_VERSION,

    initialize,
    refresh,
    render,
    open,
    close,

    setTab,

    getState,
    getSnapshot,
    validate,

    getPlayer,
    getPlayerName,
    getOverall,
    getPotential,
    getAttributes,
    getRecord,
    getCareerStage,
    getCurrentPromotion
};

/* ============================================================
   GLOBAL
   ============================================================ */

if (
    typeof window !== "undefined"
) {
    window.profileScreenAPI =
        profileScreenAPI;

    window.MMA_LIFE_PROFILE_SCREEN =
        profileScreenAPI;

    window.dispatchEvent(
        new CustomEvent(
            "mma-life-profile-screen-ready",
            {
                detail:
                    profileScreenAPI
            }
        )
    );
}

/* ============================================================
   EXPORTS
   ============================================================ */

export {
    PROFILE_SCREEN_VERSION,
    profileScreenAPI,

    initialize,
    refresh,
    render,
    open,
    close,

    setTab,

    getPlayer,
    getPlayerName,
    getOverall,
    getPotential,
    getAttributes,
    getRecord,
    getCareerStage,
    getCurrentPromotion,

    getState,
    getSnapshot,
    validate
};

export default profileScreenAPI;
