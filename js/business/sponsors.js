/* ============================================================
   MMA LIFE DYNASTY
   BUSINESS — SPONSORS
   ============================================================

   Sistema de patrocinadores:
   - Patrocinadores locais, regionais, nacionais e internacionais
   - Ofertas e contratos
   - Pagamento fixo
   - Bônus por luta
   - Bônus por vitória
   - Bônus por título
   - Bônus de mídia/PPV
   - Exclusividade
   - Fama e seguidores influenciando propostas
   - Evolução do patrocínio conforme a carreira
   - Histórico financeiro
   - Validação e snapshots

   Arquivo independente para evitar dependências circulares.
   ============================================================ */

const SPONSORS_VERSION = 1;

// ============================================================
// STATUS
// ============================================================

const SPONSOR_STATUS = Object.freeze({
    AVAILABLE: "available",
    INTERESTED: "interested",
    ACTIVE: "active",
    EXPIRED: "expired",
    TERMINATED: "terminated"
});

// ============================================================
// NÍVEIS
// ============================================================

const SPONSOR_LEVELS = Object.freeze({
    LOCAL: "local",
    REGIONAL: "regional",
    NATIONAL: "national",
    INTERNATIONAL: "international",
    GLOBAL: "global"
});

const SPONSOR_LEVEL_ORDER = Object.freeze([
    SPONSOR_LEVELS.LOCAL,
    SPONSOR_LEVELS.REGIONAL,
    SPONSOR_LEVELS.NATIONAL,
    SPONSOR_LEVELS.INTERNATIONAL,
    SPONSOR_LEVELS.GLOBAL
]);

// ============================================================
// TIPOS
// ============================================================

const SPONSOR_TYPES = Object.freeze({
    APPAREL: "apparel",
    EQUIPMENT: "equipment",
    NUTRITION: "nutrition",
    TECHNOLOGY: "technology",
    FINANCE: "finance",
    AUTOMOTIVE: "automotive",
    LIFESTYLE: "lifestyle",
    MEDIA: "media",
    ENTERTAINMENT: "entertainment",
    HEALTH: "health",
    TRAVEL: "travel",
    GAMING: "gaming"
});

// ============================================================
// TIPOS DE CONTRATO
// ============================================================

const SPONSOR_CONTRACT_TYPES = Object.freeze({
    FIXED: "fixed",
    BONUS: "bonus",
    EXCLUSIVE: "exclusive",
    CAMPAIGN: "campaign",
    ENDORSEMENT: "endorsement"
});

// ============================================================
// CONFIGURAÇÃO
// ============================================================

const SPONSOR_CONFIG = Object.freeze({
    minFame: 0,
    maxFame: 100,

    minFollowers: 0,

    minContractWeeks: 4,
    maxContractWeeks: 104,

    defaultContractWeeks: 12,

    minPayment: 50,

    defaultFightBonus: 100,
    defaultWinBonus: 100,
    defaultTitleBonus: 500,

    commissionEligible: true,

    fameWeight: 0.35,
    followersWeight: 0.25,
    ovrWeight: 0.20,
    rankingWeight: 0.10,
    careerWeight: 0.10,

    localMultiplier: 1,
    regionalMultiplier: 1.5,
    nationalMultiplier: 3,
    internationalMultiplier: 7,
    globalMultiplier: 15
});

// ============================================================
// VALORES BASE POR NÍVEL
// ============================================================

const BASE_SPONSOR_VALUES = Object.freeze({
    [SPONSOR_LEVELS.LOCAL]: {
        fixed: 250,
        fight: 100,
        win: 100,
        title: 300
    },

    [SPONSOR_LEVELS.REGIONAL]: {
        fixed: 750,
        fight: 250,
        win: 250,
        title: 750
    },

    [SPONSOR_LEVELS.NATIONAL]: {
        fixed: 2500,
        fight: 750,
        win: 750,
        title: 2500
    },

    [SPONSOR_LEVELS.INTERNATIONAL]: {
        fixed: 10000,
        fight: 2500,
        win: 3000,
        title: 10000
    },

    [SPONSOR_LEVELS.GLOBAL]: {
        fixed: 30000,
        fight: 7500,
        win: 10000,
        title: 50000
    }
});

// ============================================================
// UTILITÁRIOS
// ============================================================

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function safeNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}

function normalizeText(value, fallback = "") {
    if (value === null || value === undefined) {
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
    return JSON.parse(JSON.stringify(value));
}

function getPlayerValue(player, keys, fallback = 0) {
    if (!player || !Array.isArray(keys)) {
        return fallback;
    }

    for (const key of keys) {
        if (
            Object.prototype.hasOwnProperty.call(player, key) &&
            player[key] !== null &&
            player[key] !== undefined
        ) {
            return player[key];
        }
    }

    return fallback;
}

function getPlayerFame(player) {
    return safeNumber(
        getPlayerValue(
            player,
            ["fame", "mediaFame"],
            getPlayerValue(player?.media, ["fame"], 0)
        ),
        0
    );
}

function getPlayerFollowers(player) {
    return safeNumber(
        getPlayerValue(
            player,
            ["followers"],
            getPlayerValue(player?.media, ["followers"], 0)
        ),
        0
    );
}

function getPlayerOVR(player) {
    return safeNumber(
        getPlayerValue(
            player,
            ["ovr", "overall"],
            getPlayerValue(player?.attributes, ["ovr", "overall"], 0)
        ),
        0
    );
}

function getPlayerRank(player) {
    const rank = safeNumber(
        getPlayerValue(
            player,
            ["rank", "ranking"],
            getPlayerValue(player?.career, ["rank", "ranking"], 0)
        ),
        0
    );

    if (rank <= 0) {
        return 0;
    }

    return rank;
}

function getProfessionalFights(player) {
    return safeNumber(
        getPlayerValue(
            player?.career?.professional,
            ["fights"],
            getPlayerValue(player?.career, ["professionalFights"], 0)
        ),
        0
    );
}

// ============================================================
// NÍVEL DO PATROCÍNIO
// ============================================================

function normalizeSponsorLevel(level) {
    if (!level) {
        return SPONSOR_LEVELS.LOCAL;
    }

    const normalized = String(level).toLowerCase();

    if (SPONSOR_LEVEL_ORDER.includes(normalized)) {
        return normalized;
    }

    return SPONSOR_LEVELS.LOCAL;
}

function getSponsorLevelIndex(level) {
    return SPONSOR_LEVEL_ORDER.indexOf(
        normalizeSponsorLevel(level)
    );
}

function compareSponsorLevels(a, b) {
    return getSponsorLevelIndex(b) - getSponsorLevelIndex(a);
}

function getSponsorLevelMultiplier(level) {
    const normalized = normalizeSponsorLevel(level);

    const multipliers = {
        [SPONSOR_LEVELS.LOCAL]:
            SPONSOR_CONFIG.localMultiplier,

        [SPONSOR_LEVELS.REGIONAL]:
            SPONSOR_CONFIG.regionalMultiplier,

        [SPONSOR_LEVELS.NATIONAL]:
            SPONSOR_CONFIG.nationalMultiplier,

        [SPONSOR_LEVELS.INTERNATIONAL]:
            SPONSOR_CONFIG.internationalMultiplier,

        [SPONSOR_LEVELS.GLOBAL]:
            SPONSOR_CONFIG.globalMultiplier
    };

    return multipliers[normalized] || 1;
}

// ============================================================
// CRIAÇÃO DE PATROCINADOR
// ============================================================

function createSponsor(data = {}) {
    const level = normalizeSponsorLevel(data.level);

    return {
        id: data.id || generateId("sponsor"),

        name: normalizeText(
            data.name,
            "Patrocinador Sem Nome"
        ),

        shortName: normalizeText(
            data.shortName,
            ""
        ),

        description: normalizeText(
            data.description,
            ""
        ),

        level,

        type: data.type || SPONSOR_TYPES.LIFESTYLE,

        country: normalizeText(
            data.country,
            ""
        ),

        city: normalizeText(
            data.city,
            ""
        ),

        status:
            data.status ||
            SPONSOR_STATUS.AVAILABLE,

        reputation: clamp(
            safeNumber(data.reputation, 50),
            1,
            100
        ),

        prestige: clamp(
            safeNumber(data.prestige, 50),
            1,
            100
        ),

        budget: Math.max(
            0,
            safeNumber(data.budget, 100000)
        ),

        minimumFame: Math.max(
            0,
            safeNumber(data.minimumFame, 0)
        ),

        minimumFollowers: Math.max(
            0,
            safeNumber(data.minimumFollowers, 0)
        ),

        minimumOVR: clamp(
            safeNumber(data.minimumOVR, 0),
            0,
            100
        ),

        minimumProfessionalFights:
            Math.max(
                0,
                safeNumber(
                    data.minimumProfessionalFights,
                    0
                )
            ),

        preferredPersonas:
            Array.isArray(data.preferredPersonas)
                ? [...data.preferredPersonas]
                : [],

        preferredCountries:
            Array.isArray(data.preferredCountries)
                ? [...data.preferredCountries]
                : [],

        preferredStyles:
            Array.isArray(data.preferredStyles)
                ? [...data.preferredStyles]
                : [],

        exclusivityCategory:
            normalizeText(
                data.exclusivityCategory,
                ""
            ),

        contracts: Array.isArray(data.contracts)
            ? deepClone(data.contracts)
            : [],

        interestedFighters:
            Array.isArray(data.interestedFighters)
                ? [...data.interestedFighters]
                : [],

        history: Array.isArray(data.history)
            ? deepClone(data.history)
            : [],

        stats: {
            contractsSigned: safeNumber(
                data.stats?.contractsSigned,
                0
            ),

            contractsCompleted: safeNumber(
                data.stats?.contractsCompleted,
                0
            ),

            contractsTerminated: safeNumber(
                data.stats?.contractsTerminated,
                0
            ),

            totalPaid: safeNumber(
                data.stats?.totalPaid,
                0
            )
        }
    };
}

// ============================================================
// DATABASE
// ============================================================

function createSponsorDatabase(data = {}) {
    return {
        version: SPONSORS_VERSION,

        sponsors: {},

        contracts: {},

        payments: [],

        history: [],

        ...data,

        sponsors: data.sponsors || {},

        contracts: data.contracts || {},

        payments: Array.isArray(data.payments)
            ? data.payments
            : [],

        history: Array.isArray(data.history)
            ? data.history
            : []
    };
}

function addSponsorToDatabase(database, sponsor) {
    if (!database || !sponsor?.id) {
        return false;
    }

    if (!database.sponsors) {
        database.sponsors = {};
    }

    database.sponsors[sponsor.id] =
        deepClone(sponsor);

    return true;
}

function removeSponsorFromDatabase(database, sponsorId) {
    if (
        !database?.sponsors ||
        !database.sponsors[sponsorId]
    ) {
        return false;
    }

    delete database.sponsors[sponsorId];

    return true;
}

function getSponsor(database, sponsorId) {
    if (!database?.sponsors || !sponsorId) {
        return null;
    }

    return database.sponsors[sponsorId] || null;
}

function getAllSponsors(database) {
    if (!database?.sponsors) {
        return [];
    }

    return Object.values(database.sponsors);
}

// ============================================================
// FILTROS
// ============================================================

function filterSponsors(
    database,
    filters = {}
) {
    let sponsors = getAllSponsors(database);

    if (filters.level) {
        sponsors = sponsors.filter(
            sponsor =>
                sponsor.level ===
                normalizeSponsorLevel(filters.level)
        );
    }

    if (filters.type) {
        sponsors = sponsors.filter(
            sponsor =>
                sponsor.type === filters.type
        );
    }

    if (filters.status) {
        sponsors = sponsors.filter(
            sponsor =>
                sponsor.status === filters.status
        );
    }

    if (filters.country) {
        sponsors = sponsors.filter(
            sponsor =>
                sponsor.country === filters.country
        );
    }

    if (filters.minimumReputation !== undefined) {
        sponsors = sponsors.filter(
            sponsor =>
                sponsor.reputation >=
                safeNumber(
                    filters.minimumReputation
                )
        );
    }

    return sponsors;
}

function searchSponsors(
    database,
    query
) {
    const text = normalizeText(
        query
    ).toLowerCase();

    if (!text) {
        return getAllSponsors(database);
    }

    return getAllSponsors(database).filter(
        sponsor =>
            sponsor.name
                .toLowerCase()
                .includes(text) ||
            sponsor.shortName
                .toLowerCase()
                .includes(text) ||
            sponsor.type
                .toLowerCase()
                .includes(text) ||
            sponsor.level
                .toLowerCase()
                .includes(text)
    );
}

// ============================================================
// PERFIL DO LUTADOR
// ============================================================

function calculateFameScore(player) {
    return clamp(
        getPlayerFame(player),
        0,
        100
    );
}

function calculateFollowersScore(player) {
    const followers =
        getPlayerFollowers(player);

    if (followers <= 0) {
        return 0;
    }

    // Escala logarítmica.
    return clamp(
        Math.log10(followers + 1) * 20,
        0,
        100
    );
}

function calculateOVRScore(player) {
    return clamp(
        getPlayerOVR(player),
        0,
        100
    );
}

function calculateRankingScore(player) {
    const rank = getPlayerRank(player);

    if (!rank) {
        return 0;
    }

    if (rank === 1) return 100;
    if (rank <= 3) return 90;
    if (rank <= 5) return 80;
    if (rank <= 10) return 65;
    if (rank <= 15) return 50;

    return 30;
}

function calculateCareerScore(player) {
    const fights =
        getProfessionalFights(player);

    return clamp(
        fights * 3,
        0,
        100
    );
}

function calculateSponsorAttractiveness(player) {
    if (!player) {
        return 0;
    }

    const fame =
        calculateFameScore(player);

    const followers =
        calculateFollowersScore(player);

    const ovr =
        calculateOVRScore(player);

    const ranking =
        calculateRankingScore(player);

    const career =
        calculateCareerScore(player);

    return clamp(
        fame * SPONSOR_CONFIG.fameWeight +
        followers * SPONSOR_CONFIG.followersWeight +
        ovr * SPONSOR_CONFIG.ovrWeight +
        ranking * SPONSOR_CONFIG.rankingWeight +
        career * SPONSOR_CONFIG.careerWeight,
        0,
        100
    );
}

// ============================================================
// ELEGIBILIDADE
// ============================================================

function checkSponsorEligibility(
    sponsor,
    player
) {
    if (!sponsor || !player) {
        return {
            eligible: false,
            score: 0,
            reasons: ["Dados insuficientes."]
        };
    }

    const reasons = [];

    const fame =
        getPlayerFame(player);

    const followers =
        getPlayerFollowers(player);

    const ovr =
        getPlayerOVR(player);

    const fights =
        getProfessionalFights(player);

    if (fame < sponsor.minimumFame) {
        reasons.push(
            `Fama mínima: ${sponsor.minimumFame}.`
        );
    }

    if (
        followers <
        sponsor.minimumFollowers
    ) {
        reasons.push(
            `Seguidores mínimos: ${sponsor.minimumFollowers}.`
        );
    }

    if (ovr < sponsor.minimumOVR) {
        reasons.push(
            `OVR mínimo: ${sponsor.minimumOVR}.`
        );
    }

    if (
        fights <
        sponsor.minimumProfessionalFights
    ) {
        reasons.push(
            `Lutas profissionais mínimas: ${sponsor.minimumProfessionalFights}.`
        );
    }

    const attractiveness =
        calculateSponsorAttractiveness(player);

    const levelRequirement =
        getSponsorLevelIndex(sponsor.level);

    const scoreRequirement =
        levelRequirement * 15;

    if (
        attractiveness <
        scoreRequirement
    ) {
        reasons.push(
            "O perfil atual ainda não é suficientemente atrativo para este patrocinador."
        );
    }

    return {
        eligible:
            reasons.length === 0,

        score: attractiveness,

        reasons
    };
}

// ============================================================
// VALOR DO PATROCÍNIO
// ============================================================

function calculateSponsorshipValue(
    sponsor,
    player,
    options = {}
) {
    if (!sponsor) {
        return {
            fixedPayment: 0,
            fightBonus: 0,
            winBonus: 0,
            titleBonus: 0,
            mediaBonus: 0,
            totalEstimated: 0
        };
    }

    const base =
        BASE_SPONSOR_VALUES[
            normalizeSponsorLevel(
                sponsor.level
            )
        ] ||
        BASE_SPONSOR_VALUES[
            SPONSOR_LEVELS.LOCAL
        ];

    const attractiveness =
        calculateSponsorAttractiveness(
            player
        );

    /*
     * 50 = valor base.
     * Quanto maior a atratividade,
     * maior o contrato.
     */
    const popularityMultiplier =
        0.75 +
        attractiveness / 100;

    const reputationMultiplier =
        0.75 +
        safeNumber(
            sponsor.reputation,
            50
        ) / 200;

    const prestigeMultiplier =
        0.75 +
        safeNumber(
            sponsor.prestige,
            50
        ) / 200;

    const multiplier =
        popularityMultiplier *
        reputationMultiplier *
        prestigeMultiplier;

    const fixedPayment = Math.max(
        SPONSOR_CONFIG.minPayment,
        Math.round(
            base.fixed *
            multiplier
        )
    );

    const fightBonus = Math.max(
        0,
        Math.round(
            base.fight *
            multiplier
        )
    );

    const winBonus = Math.max(
        0,
        Math.round(
            base.win *
            multiplier
        )
    );

    const titleBonus = Math.max(
        0,
        Math.round(
            base.title *
            multiplier
        )
    );

    const mediaBonus = Math.max(
        0,
        Math.round(
            fixedPayment *
            0.25
        )
    );

    const fights =
        safeNumber(
            options.expectedFights,
            3
        );

    const expectedWins =
        safeNumber(
            options.expectedWins,
            Math.max(
                0,
                Math.floor(fights * 0.6)
            )
        );

    const expectedTitles =
        safeNumber(
            options.expectedTitles,
            0
        );

    const totalEstimated =
        fixedPayment +
        fightBonus * fights +
        winBonus * expectedWins +
        titleBonus * expectedTitles +
        mediaBonus;

    return {
        fixedPayment,
        fightBonus,
        winBonus,
        titleBonus,
        mediaBonus,
        totalEstimated
    };
}

// ============================================================
// OFERTA
// ============================================================

function calculateSponsorOffer(
    sponsor,
    player,
    options = {}
) {
    if (!sponsor || !player) {
        return null;
    }

    const eligibility =
        checkSponsorEligibility(
            sponsor,
            player
        );

    if (!eligibility.eligible) {
        return {
            acceptedAutomatically: false,
            eligible: false,
            attractiveness: eligibility.score,
            reasons: eligibility.reasons
        };
    }

    const values =
        calculateSponsorshipValue(
            sponsor,
            player,
            options
        );

    return {
        id: generateId("sponsor_offer"),

        sponsorId: sponsor.id,

        fighterId:
            player.id ||
            player.playerId ||
            null,

        status:
            SPONSOR_STATUS.INTERESTED,

        eligible: true,

        acceptedAutomatically:
            eligibility.score >= 85,

        attractiveness:
            eligibility.score,

        values,

        offeredAt:
            options.offeredAt ||
            new Date().toISOString(),

        expiresAt:
            options.expiresAt ||
            null
    };
}

// ============================================================
// CONTRATO
// ============================================================

function createSponsorshipContract(
    sponsor,
    player,
    options = {}
) {
    if (!sponsor) {
        throw new Error(
            "Patrocinador inválido."
        );
    }

    const fighterId =
        options.fighterId ||
        player?.id ||
        player?.playerId ||
        null;

    const durationWeeks = clamp(
        Math.floor(
            safeNumber(
                options.durationWeeks,
                SPONSOR_CONFIG.defaultContractWeeks
            )
        ),
        SPONSOR_CONFIG.minContractWeeks,
        SPONSOR_CONFIG.maxContractWeeks
    );

    const values =
        options.values ||
        calculateSponsorshipValue(
            sponsor,
            player,
            {
                expectedFights:
                    options.expectedFights || 3
            }
        );

    const startDate =
        options.startDate ||
        new Date().toISOString();

    const contract = {
        id:
            options.id ||
            generateId("sponsor_contract"),

        sponsorId:
            sponsor.id,

        fighterId,

        sponsorName:
            sponsor.name,

        status:
            options.status ||
            SPONSOR_STATUS.INTERESTED,

        type:
            options.type ||
            SPONSOR_CONTRACT_TYPES.FIXED,

        level:
            sponsor.level,

        category:
            sponsor.type,

        startDate,

        endDate:
            options.endDate ||
            null,

        durationWeeks,

        payments: {
            fixedPayment:
                Math.max(
                    0,
                    safeNumber(
                        values.fixedPayment
                    )
                ),

            fightBonus:
                Math.max(
                    0,
                    safeNumber(
                        values.fightBonus
                    )
                ),

            winBonus:
                Math.max(
                    0,
                    safeNumber(
                        values.winBonus
                    )
                ),

            titleBonus:
                Math.max(
                    0,
                    safeNumber(
                        values.titleBonus
                    )
                ),

            mediaBonus:
                Math.max(
                    0,
                    safeNumber(
                        values.mediaBonus
                    )
                )
        },

        exclusivity: {
            enabled:
                Boolean(
                    options.exclusive ||
                    options.exclusivity
                ),

            category:
                options.exclusivityCategory ||
                sponsor.exclusivityCategory ||
                null
        },

        conditions: {
            minimumFights:
                Math.max(
                    0,
                    safeNumber(
                        options.minimumFights,
                        0
                    )
                ),

            minimumMediaAppearances:
                Math.max(
                    0,
                    safeNumber(
                        options.minimumMediaAppearances,
                        0
                    )
                ),

            socialMediaPosts:
                Math.max(
                    0,
                    safeNumber(
                        options.socialMediaPosts,
                        0
                    )
                )
        },

        stats: {
            fights: 0,
            wins: 0,
            losses: 0,
            titles: 0,
            mediaAppearances: 0,

            totalPaid: 0,

            payments: 0
        },

        history: [],

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()
    };

    return contract;
}

// ============================================================
// ATIVAR CONTRATO
// ============================================================

function activateSponsorshipContract(
    contract,
    options = {}
) {
    if (!contract) {
        return null;
    }

    contract.status =
        SPONSOR_STATUS.ACTIVE;

    contract.startDate =
        options.startDate ||
        contract.startDate ||
        new Date().toISOString();

    if (!contract.endDate) {
        const start =
            new Date(
                contract.startDate
            );

        start.setDate(
            start.getDate() +
            contract.durationWeeks * 7
        );

        contract.endDate =
            start.toISOString();
    }

    contract.updatedAt =
        new Date().toISOString();

    contract.history.push({
        id: generateId("sponsor_history"),

        type: "activated",

        date:
            new Date().toISOString()
    });

    return contract;
}

// ============================================================
// ASSINAR
// ============================================================

function signSponsorshipContract(
    contract,
    player,
    sponsor
) {
    if (!contract) {
        return {
            success: false,
            reason: "Contrato inválido."
        };
    }

    if (contract.status === SPONSOR_STATUS.ACTIVE) {
        return {
            success: false,
            reason: "Contrato já está ativo."
        };
    }

    if (sponsor && player) {
        const eligibility =
            checkSponsorEligibility(
                sponsor,
                player
            );

        if (!eligibility.eligible) {
            return {
                success: false,
                reason:
                    "O lutador não atende aos requisitos.",
                details:
                    eligibility.reasons
            };
        }
    }

    activateSponsorshipContract(
        contract
    );

    if (sponsor) {
        if (
            !Array.isArray(
                sponsor.contracts
            )
        ) {
            sponsor.contracts = [];
        }

        sponsor.contracts.push(
            contract.id
        );

        sponsor.stats.contractsSigned++;
    }

    return {
        success: true,
        contract
    };
}

// ============================================================
// PAGAMENTOS
// ============================================================

const SPONSOR_PAYMENT_TYPES = Object.freeze({
    FIXED: "fixed",
    FIGHT: "fight",
    WIN: "win",
    TITLE: "title",
    MEDIA: "media",
    CUSTOM: "custom"
});

function recordSponsorPayment(
    contract,
    type,
    amount,
    database = null,
    metadata = {}
) {
    if (!contract) {
        return null;
    }

    const payment = {
        id: generateId("sponsor_payment"),

        contractId:
            contract.id,

        sponsorId:
            contract.sponsorId,

        fighterId:
            contract.fighterId,

        type,

        amount: Math.max(
            0,
            safeNumber(amount, 0)
        ),

        date:
            metadata.date ||
            new Date().toISOString(),

        fightId:
            metadata.fightId ||
            null,

        description:
            metadata.description ||
            ""
    };

    contract.stats.totalPaid +=
        payment.amount;

    contract.stats.payments++;

    contract.history.push({
        id: generateId("sponsor_history"),

        type: "payment",

        paymentId:
            payment.id,

        amount:
            payment.amount,

        paymentType:
            payment.type,

        date:
            payment.date
    });

    contract.updatedAt =
        new Date().toISOString();

    if (database) {
        if (!Array.isArray(database.payments)) {
            database.payments = [];
        }

        database.payments.push(
            deepClone(payment)
        );
    }

    return payment;
}

// ============================================================
// PAGAMENTO FIXO
// ============================================================

function processSponsorFixedPayment(
    contract,
    database = null
) {
    if (
        !contract ||
        contract.status !==
            SPONSOR_STATUS.ACTIVE
    ) {
        return null;
    }

    return recordSponsorPayment(
        contract,
        SPONSOR_PAYMENT_TYPES.FIXED,
        contract.payments.fixedPayment,
        database
    );
}

// ============================================================
// PAGAMENTO POR LUTA
// ============================================================

function processSponsorFightPayment(
    contract,
    fightResult = {},
    database = null
) {
    if (
        !contract ||
        contract.status !==
            SPONSOR_STATUS.ACTIVE
    ) {
        return null;
    }

    const fightPayment =
        recordSponsorPayment(
            contract,
            SPONSOR_PAYMENT_TYPES.FIGHT,
            contract.payments.fightBonus,
            database,
            {
                fightId:
                    fightResult.fightId ||
                    fightResult.id ||
                    null
            }
        );

    contract.stats.fights++;

    if (
        fightResult.result === "win" ||
        fightResult.won === true
    ) {
        contract.stats.wins++;

        recordSponsorPayment(
            contract,
            SPONSOR_PAYMENT_TYPES.WIN,
            contract.payments.winBonus,
            database,
            {
                fightId:
                    fightResult.fightId ||
                    fightResult.id ||
                    null
            }
        );
    }

    if (
        fightResult.titleWin === true ||
        fightResult.wonTitle === true
    ) {
        contract.stats.titles++;

        recordSponsorPayment(
            contract,
            SPONSOR_PAYMENT_TYPES.TITLE,
            contract.payments.titleBonus,
            database,
            {
                fightId:
                    fightResult.fightId ||
                    fightResult.id ||
                    null
            }
        );
    }

    contract.updatedAt =
        new Date().toISOString();

    return fightPayment;
}

// ============================================================
// PAGAMENTO DE MÍDIA
// ============================================================

function processSponsorMediaPayment(
    contract,
    database = null,
    metadata = {}
) {
    if (
        !contract ||
        contract.status !==
            SPONSOR_STATUS.ACTIVE
    ) {
        return null;
    }

    contract.stats.mediaAppearances++;

    return recordSponsorPayment(
        contract,
        SPONSOR_PAYMENT_TYPES.MEDIA,
        contract.payments.mediaBonus,
        database,
        metadata
    );
}

// ============================================================
// ENCERRAMENTO
// ============================================================

function terminateSponsorshipContract(
    contract,
    reason = "other",
    sponsor = null
) {
    if (!contract) {
        return false;
    }

    contract.status =
        SPONSOR_STATUS.TERMINATED;

    contract.history.push({
        id: generateId("sponsor_history"),

        type: "terminated",

        reason,

        date:
            new Date().toISOString()
    });

    contract.updatedAt =
        new Date().toISOString();

    if (sponsor) {
        sponsor.stats.contractsTerminated++;
    }

    return true;
}

function expireSponsorshipContract(
    contract,
    sponsor = null
) {
    if (!contract) {
        return false;
    }

    contract.status =
        SPONSOR_STATUS.EXPIRED;

    contract.history.push({
        id: generateId("sponsor_history"),

        type: "expired",

        date:
            new Date().toISOString()
    });

    contract.updatedAt =
        new Date().toISOString();

    if (sponsor) {
        sponsor.stats.contractsCompleted++;
    }

    return true;
}

// ============================================================
// CONTRATOS ATIVOS
// ============================================================

function getActiveSponsorships(
    database,
    fighterId = null
) {
    if (!database?.contracts) {
        return [];
    }

    let contracts =
        Object.values(
            database.contracts
        );

    contracts =
        contracts.filter(
            contract =>
                contract.status ===
                SPONSOR_STATUS.ACTIVE
        );

    if (fighterId) {
        contracts =
            contracts.filter(
                contract =>
                    contract.fighterId ===
                    fighterId
            );
    }

    return contracts;
}

function getFighterSponsorships(
    database,
    fighterId
) {
    return getActiveSponsorships(
        database,
        fighterId
    );
}

// ============================================================
// RENDA
// ============================================================

function calculateTotalSponsorshipIncome(
    database,
    fighterId = null
) {
    const contracts =
        getActiveSponsorships(
            database,
            fighterId
        );

    return contracts.reduce(
        (total, contract) =>
            total +
            safeNumber(
                contract.stats?.totalPaid,
                0
            ),
        0
    );
}

function calculatePotentialSponsorshipIncome(
    database,
    fighterId = null
) {
    const contracts =
        getActiveSponsorships(
            database,
            fighterId
        );

    return contracts.reduce(
        (total, contract) =>
            total +
            safeNumber(
                contract.payments?.fixedPayment,
                0
            ),
        0
    );
}

// ============================================================
// EXCLUSIVIDADE
// ============================================================

function hasSponsorExclusivityConflict(
    contracts,
    sponsor
) {
    if (
        !sponsor ||
        !Array.isArray(contracts)
    ) {
        return false;
    }

    const category =
        sponsor.exclusivityCategory ||
        sponsor.type;

    return contracts.some(
        contract =>
            contract.status ===
                SPONSOR_STATUS.ACTIVE &&
            contract.exclusivity?.enabled &&
            (
                contract.exclusivity.category ===
                category
            )
    );
}

// ============================================================
// EVOLUÇÃO DO PATROCÍNIO
// ============================================================

function calculateSponsorEvolution(
    sponsor,
    player
) {
    if (!sponsor || !player) {
        return {
            currentLevel:
                sponsor?.level ||
                SPONSOR_LEVELS.LOCAL,

            recommendedLevel:
                sponsor?.level ||
                SPONSOR_LEVELS.LOCAL,

            attractiveness: 0,

            shouldUpgrade: false
        };
    }

    const attractiveness =
        calculateSponsorAttractiveness(
            player
        );

    let recommendedLevel =
        SPONSOR_LEVELS.LOCAL;

    if (attractiveness >= 90) {
        recommendedLevel =
            SPONSOR_LEVELS.GLOBAL;
    } else if (attractiveness >= 75) {
        recommendedLevel =
            SPONSOR_LEVELS.INTERNATIONAL;
    } else if (attractiveness >= 55) {
        recommendedLevel =
            SPONSOR_LEVELS.NATIONAL;
    } else if (attractiveness >= 30) {
        recommendedLevel =
            SPONSOR_LEVELS.REGIONAL;
    }

    const currentLevel =
        normalizeSponsorLevel(
            sponsor.level
        );

    return {
        currentLevel,

        recommendedLevel,

        attractiveness,

        shouldUpgrade:
            getSponsorLevelIndex(
                recommendedLevel
            ) >
            getSponsorLevelIndex(
                currentLevel
            )
    };
}

// ============================================================
// PROMOÇÃO DO CONTRATO
// ============================================================

function upgradeSponsorshipContract(
    contract,
    sponsor,
    player
) {
    if (!contract || !sponsor) {
        return null;
    }

    const evolution =
        calculateSponsorEvolution(
            sponsor,
            player
        );

    if (!evolution.shouldUpgrade) {
        return contract;
    }

    const values =
        calculateSponsorshipValue(
            sponsor,
            player
        );

    contract.payments =
        values;

    contract.history.push({
        id: generateId("sponsor_history"),

        type: "contract_upgraded",

        previousLevel:
            contract.level,

        newLevel:
            evolution.recommendedLevel,

        date:
            new Date().toISOString()
    });

    contract.level =
        evolution.recommendedLevel;

    contract.updatedAt =
        new Date().toISOString();

    return contract;
}

// ============================================================
// PROCESSAMENTO DE CONTRATOS
// ============================================================

function processSponsorshipContracts(
    database,
    currentDate = new Date()
) {
    if (!database?.contracts) {
        return {
            processed: 0,
            expired: 0
        };
    }

    const date =
        currentDate instanceof Date
            ? currentDate
            : new Date(currentDate);

    let processed = 0;
    let expired = 0;

    for (
        const contract of
        Object.values(database.contracts)
    ) {
        if (
            contract.status !==
            SPONSOR_STATUS.ACTIVE
        ) {
            continue;
        }

        processed++;

        if (
            contract.endDate &&
            date >=
                new Date(
                    contract.endDate
                )
        ) {
            expireSponsorshipContract(
                contract
            );

            expired++;
        }
    }

    return {
        processed,
        expired
    };
}

// ============================================================
// INSERIR CONTRATO NO DATABASE
// ============================================================

function addSponsorshipContractToDatabase(
    database,
    contract
) {
    if (
        !database ||
        !contract?.id
    ) {
        return false;
    }

    if (!database.contracts) {
        database.contracts = {};
    }

    database.contracts[
        contract.id
    ] = deepClone(contract);

    return true;
}

function getSponsorshipContract(
    database,
    contractId
) {
    if (
        !database?.contracts ||
        !contractId
    ) {
        return null;
    }

    return (
        database.contracts[
            contractId
        ] || null
    );
}

function getAllSponsorshipContracts(
    database
) {
    if (!database?.contracts) {
        return [];
    }

    return Object.values(
        database.contracts
    );
}

// ============================================================
// HISTÓRICO
// ============================================================

function registerSponsorHistory(
    database,
    event
) {
    if (!database) {
        return false;
    }

    if (!Array.isArray(database.history)) {
        database.history = [];
    }

    database.history.push({
        id: generateId("sponsor_world_history"),

        date:
            new Date().toISOString(),

        ...deepClone(event)
    });

    return true;
}

// ============================================================
// RESUMO
// ============================================================

function getSponsorSummary(
    sponsor
) {
    if (!sponsor) {
        return null;
    }

    return {
        id: sponsor.id,

        name: sponsor.name,

        level: sponsor.level,

        type: sponsor.type,

        status: sponsor.status,

        reputation: sponsor.reputation,

        prestige: sponsor.prestige,

        budget: sponsor.budget,

        contracts:
            Array.isArray(
                sponsor.contracts
            )
                ? sponsor.contracts.length
                : 0,

        totalPaid:
            safeNumber(
                sponsor.stats?.totalPaid,
                0
            ),

        contractsSigned:
            safeNumber(
                sponsor.stats?.contractsSigned,
                0
            ),

        contractsCompleted:
            safeNumber(
                sponsor.stats?.contractsCompleted,
                0
            )
    };
}

function getFighterSponsorshipSummary(
    database,
    fighterId
) {
    const contracts =
        getFighterSponsorships(
            database,
            fighterId
        );

    return {
        fighterId,

        sponsors:
            contracts.map(
                contract => ({
                    contractId:
                        contract.id,

                    sponsorId:
                        contract.sponsorId,

                    sponsorName:
                        contract.sponsorName,

                    level:
                        contract.level,

                    category:
                        contract.category,

                    totalPaid:
                        safeNumber(
                            contract.stats?.totalPaid,
                            0
                        ),

                    fights:
                        safeNumber(
                            contract.stats?.fights,
                            0
                        ),

                    wins:
                        safeNumber(
                            contract.stats?.wins,
                            0
                        ),

                    titles:
                        safeNumber(
                            contract.stats?.titles,
                            0
                        )
                })
            ),

        totalIncome:
            calculateTotalSponsorshipIncome(
                database,
                fighterId
            )
    };
}

// ============================================================
// VALIDAÇÃO
// ============================================================

function validateSponsor(
    sponsor
) {
    const errors = [];

    if (!sponsor) {
        return {
            valid: false,
            errors: [
                "Patrocinador inexistente."
            ]
        };
    }

    if (!sponsor.id) {
        errors.push(
            "Patrocinador sem ID."
        );
    }

    if (!sponsor.name) {
        errors.push(
            "Patrocinador sem nome."
        );
    }

    if (
        !SPONSOR_LEVEL_ORDER.includes(
            sponsor.level
        )
    ) {
        errors.push(
            "Nível de patrocinador inválido."
        );
    }

    if (!sponsor.type) {
        errors.push(
            "Tipo de patrocinador ausente."
        );
    }

    if (
        sponsor.reputation < 1 ||
        sponsor.reputation > 100
    ) {
        errors.push(
            "Reputação deve estar entre 1 e 100."
        );
    }

    if (
        sponsor.prestige < 1 ||
        sponsor.prestige > 100
    ) {
        errors.push(
            "Prestígio deve estar entre 1 e 100."
        );
    }

    return {
        valid:
            errors.length === 0,

        errors
    };
}

function validateSponsorshipContract(
    contract
) {
    const errors = [];

    if (!contract) {
        return {
            valid: false,
            errors: [
                "Contrato inexistente."
            ]
        };
    }

    if (!contract.id) {
        errors.push(
            "Contrato sem ID."
        );
    }

    if (!contract.sponsorId) {
        errors.push(
            "Contrato sem sponsorId."
        );
    }

    if (!contract.fighterId) {
        errors.push(
            "Contrato sem fighterId."
        );
    }

    if (
        !contract.payments
    ) {
        errors.push(
            "Contrato sem estrutura de pagamentos."
       
