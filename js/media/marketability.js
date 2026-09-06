/* ============================================================
   MMA LIFE DYNASTY
   MEDIA — MARKETABILITY ENGINE
   ============================================================

   Responsável por transformar a presença pública do lutador
   em um índice comercial e midiático.

   Influencia futuramente:
   - Valor de patrocínios
   - Valor de contratos
   - Interesse das organizações
   - Main events
   - PPV / audiência
   - Convites para mídia
   - Eventos especiais
   - Valor comercial
   - Poder de negociação
   - Popularidade
   - Potencial de crescimento de fãs

   Este arquivo é independente para reduzir dependências
   circulares entre os módulos.
   ============================================================ */

const MARKETABILITY_VERSION = 1;


/* ============================================================
   CONFIGURATION
   ============================================================ */

const MARKETABILITY_CONFIG = {
    min: 0,
    max: 100,

    defaults: {
        marketability: 25,

        commercialValue: 25,
        mediaValue: 25,
        fanValue: 25,
        sponsorValue: 25,
        eventValue: 25,
        negotiationPower: 25
    },

    weights: {
        fame: 0.22,
        reputation: 0.12,
        persona: 0.16,
        followers: 0.16,
        popularity: 0.12,
        performance: 0.10,
        championship: 0.07,
        consistency: 0.05
    },

    levels: [
        {
            id: "unknown",
            label: "Desconhecido",
            min: 0
        },
        {
            id: "local",
            label: "Nome Local",
            min: 15
        },
        {
            id: "regional",
            label: "Nome Regional",
            min: 30
        },
        {
            id: "national",
            label: "Nome Nacional",
            min: 45
        },
        {
            id: "international",
            label: "Nome Internacional",
            min: 60
        },
        {
            id: "star",
            label: "Estrela",
            min: 75
        },
        {
            id: "superstar",
            label: "Superstar",
            min: 90
        }
    ],

    thresholds: {
        mediaInterview: 25,
        sponsorship: 35,
        majorSponsor: 55,
        mainEvent: 60,
        coMainEvent: 70,
        ppvStar: 75,
        superstar: 90
    },

    bonuses: {
        title: 4,
        titleDefense: 2,
        majorWin: 3,
        upsetWin: 4,
        knockout: 1,
        submission: 1,
        viralMoment: 3,
        rivalry: 2,
        award: 2
    },

    penalties: {
        inactivity: 0.25,
        controversy: 1,
        badLoss: 1,
        scandal: 4
    }
};


/* ============================================================
   HELPERS
   ============================================================ */

function clamp(
    value,
    min = 0,
    max = 100
) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return min;
    }

    return Math.max(
        min,
        Math.min(max, number)
    );
}

function round(
    value,
    decimals = 2
) {
    const factor =
        10 ** decimals;

    return Math.round(
        Number(value) * factor
    ) / factor;
}

function nowISO() {
    return new Date().toISOString();
}

function ensureDatabase(database) {
    if (
        !database ||
        typeof database !== "object"
    ) {
        throw new Error(
            "Marketability Engine: database inválido."
        );
    }

    if (
        !database.media ||
        typeof database.media !== "object"
    ) {
        database.media = {};
    }

    return database;
}


/* ============================================================
   STATE
   ============================================================ */

function createMarketabilityState() {
    return {
        version:
            MARKETABILITY_VERSION,

        marketability:
            MARKETABILITY_CONFIG
                .defaults
                .marketability,

        commercialValue:
            MARKETABILITY_CONFIG
                .defaults
                .commercialValue,

        mediaValue:
            MARKETABILITY_CONFIG
                .defaults
                .mediaValue,

        fanValue:
            MARKETABILITY_CONFIG
                .defaults
                .fanValue,

        sponsorValue:
            MARKETABILITY_CONFIG
                .defaults
                .sponsorValue,

        eventValue:
            MARKETABILITY_CONFIG
                .defaults
                .eventValue,

        negotiationPower:
            MARKETABILITY_CONFIG
                .defaults
                .negotiationPower,

        components: {
            fame: 0,
            reputation: 0,
            persona: 0,
            followers: 0,
            popularity: 0,
            performance: 0,
            championship: 0,
            consistency: 0
        },

        history: [],

        statistics: {
            totalChanges: 0,
            positiveChanges: 0,
            negativeChanges: 0,

            majorWins: 0,
            upsetWins: 0,
            knockouts: 0,
            submissions: 0,

            titlesWon: 0,
            titleDefenses: 0,

            viralMoments: 0,
            rivalries: 0,
            awards: 0,

            controversies: 0,
            scandals: 0,

            weeksInactive: 0
        },

        lastUpdate: null
    };
}


/* ============================================================
   ENSURE
   ============================================================ */

function ensureMarketability(database) {
    ensureDatabase(database);

    if (
        !database.media.marketability ||
        typeof database.media.marketability !== "object"
    ) {
        database.media.marketability =
            createMarketabilityState();
    }

    const state =
        database.media.marketability;

    const defaults =
        MARKETABILITY_CONFIG.defaults;

    for (
        const key of Object.keys(defaults)
    ) {
        if (
            !Number.isFinite(
                Number(state[key])
            )
        ) {
            state[key] =
                defaults[key];
        }

        state[key] =
            clamp(state[key]);
    }

    if (
        !state.components ||
        typeof state.components !== "object"
    ) {
        state.components = {
            fame: 0,
            reputation: 0,
            persona: 0,
            followers: 0,
            popularity: 0,
            performance: 0,
            championship: 0,
            consistency: 0
        };
    }

    if (!Array.isArray(state.history)) {
        state.history = [];
    }

    if (
        !state.statistics ||
        typeof state.statistics !== "object"
    ) {
        state.statistics =
            createMarketabilityState()
                .statistics;
    }

    return state;
}


/* ============================================================
   GENERIC VALUE READERS
   ============================================================ */

function getNestedValue(
    object,
    path,
    fallback = 0
) {
    if (
        !object ||
        typeof object !== "object"
    ) {
        return fallback;
    }

    const parts =
        path.split(".");

    let current = object;

    for (const part of parts) {
        if (
            current === null ||
            current === undefined
        ) {
            return fallback;
        }

        current = current[part];
    }

    const value =
        Number(current);

    return Number.isFinite(value)
        ? value
        : fallback;
}


/* ============================================================
   FAME INPUT
   ============================================================ */

function getFameInput(database) {
    ensureDatabase(database);

    if (
        database.media.fame &&
        typeof database.media.fame === "object"
    ) {
        return clamp(
            database.media.fame.fame
        );
    }

    if (
        Number.isFinite(
            Number(database.media.fame)
        )
    ) {
        return clamp(
            database.media.fame
        );
    }

    return 0;
}


/* ============================================================
   REPUTATION INPUT
   ============================================================ */

function getReputationInput(database) {
    ensureDatabase(database);

    if (
        database.media.reputation &&
        typeof database.media.reputation === "object"
    ) {
        return clamp(
            database.media.reputation.reputation
        );
    }

    if (
        Number.isFinite(
            Number(database.media.reputation)
        )
    ) {
        return clamp(
            database.media.reputation
        );
    }

    return 50;
}


/* ============================================================
   PERSONA INPUT
   ============================================================ */

function getPersonaInput(database) {
    ensureDatabase(database);

    const persona =
        database.media.persona;

    if (
        !persona ||
        typeof persona !== "object"
    ) {
        return 50;
    }

    const values = [
        persona.charisma,
        persona.confidence,
        persona.showmanship,
        persona.fanConnection,
        persona.mediaAppeal,
        persona.commercialAppeal
    ]
        .map(Number)
        .filter(Number.isFinite);

    if (values.length === 0) {
        return 50;
    }

    const total =
        values.reduce(
            (sum, value) =>
                sum + clamp(value),
            0
        );

    return clamp(
        total / values.length
    );
}


/* ============================================================
   FOLLOWERS INPUT
   ============================================================ */

function getFollowersInput(database) {
    ensureDatabase(database);

    let followers = 0;

    if (
        database.media.followers !== undefined
    ) {
        followers =
            Number(
                database.media.followers
            );
    }

    if (
        database.media.media &&
        Number.isFinite(
            Number(
                database.media.media.followers
            )
        )
    ) {
        followers =
            Number(
                database.media.media.followers
            );
    }

    if (
        database.media.followers &&
        typeof database.media.followers === "object"
    ) {
        followers =
            Number(
                database.media.followers.total ||
                database.media.followers.followers ||
                0
            );
    }

    if (!Number.isFinite(followers)) {
        followers = 0;
    }

    return Math.max(
        0,
        followers
    );
}


/* ============================================================
   FOLLOWER SCORE
   ============================================================ */

function followersToScore(
    followers
) {
    const value =
        Math.max(
            0,
            Number(followers) || 0
        );

    if (value <= 1000) {
        return value / 100;
    }

    if (value <= 10000) {
        return 10 +
            ((value - 1000) / 9000) * 15;
    }

    if (value <= 100000) {
        return 25 +
            ((value - 10000) / 90000) * 20;
    }

    if (value <= 1000000) {
        return 45 +
            ((value - 100000) / 900000) * 25;
    }

    if (value <= 10000000) {
        return 70 +
            ((value - 1000000) / 9000000) * 20;
    }

    return clamp(
        90 +
        Math.log10(
            value / 10000000
        ) * 5
    );
}


/* ============================================================
   POPULARITY INPUT
   ============================================================ */

function getPopularityInput(database) {
    ensureDatabase(database);

    const media =
        database.media;

    const values = [
        media.popularity,
        media.exposure,
        media.audience
    ]
        .map(Number)
        .filter(Number.isFinite);

    if (values.length === 0) {
        return 25;
    }

    return clamp(
        values.reduce(
            (sum, value) =>
                sum + value,
            0
        ) / values.length
    );
}


/* ============================================================
   PERFORMANCE INPUT
   ============================================================ */

function getPerformanceInput(database) {
    ensureDatabase(database);

    const records =
        database.career &&
        database.career.records;

    if (
        !records ||
        typeof records !== "object"
    ) {
        return 25;
    }

    const wins =
        Number(
            records.wins ||
            records.totalWins ||
            0
        );

    const losses =
        Number(
            records.losses ||
            records.totalLosses ||
            0
        );

    const fights =
        Number(
            records.total ||
            records.fights ||
            wins + losses
        );

    if (fights <= 0) {
        return 25;
    }

    const winRate =
        clamp(
            (wins / fights) * 100
        );

    return clamp(
        15 +
        winRate * 0.70 +
        Math.min(
            15,
            fights * 0.5
        )
    );
}


/* ============================================================
   CHAMPIONSHIP INPUT
   ============================================================ */

function getChampionshipInput(database) {
    ensureDatabase(database);

    let score = 0;

    const career =
        database.career;

    if (
        career &&
        Array.isArray(
            career.titles
        )
    ) {
        score += Math.min(
            60,
            career.titles.length * 10
        );
    }

    if (
        career &&
        career.professional &&
        Array.isArray(
            career.professional.titles
        )
    ) {
        score += Math.min(
            60,
            career.professional.titles.length * 10
        );
    }

    if (
        career &&
        career.currentTitle
    ) {
        score += 20;
    }

    return clamp(
        score
    );
}


/* ============================================================
   CONSISTENCY INPUT
   ============================================================ */

function getConsistencyInput(database) {
    ensureDatabase(database);

    const records =
        database.career &&
        database.career.records;

    if (
        !records ||
        typeof records !== "object"
    ) {
        return 25;
    }

    const fights =
        Number(
            records.total ||
            records.fights ||
            0
        );

    const wins =
        Number(
            records.wins ||
            0
        );

    if (fights <= 0) {
        return 25;
    }

    const base =
        Math.min(
            60,
            fights * 2
        );

    const winBonus =
        Math.min(
            40,
            wins * 1.5
        );

    return clamp(
        base + winBonus
    );
}


/* ============================================================
   CALCULATE COMPONENTS
   ============================================================ */

function calculateComponents(database) {
    const fame =
        getFameInput(database);

    const reputation =
        getReputationInput(database);

    const persona =
        getPersonaInput(database);

    const followers =
        followersToScore(
            getFollowersInput(database)
        );

    const popularity =
        getPopularityInput(database);

    const performance =
        getPerformanceInput(database);

    const championship =
        getChampionshipInput(database);

    const consistency =
        getConsistencyInput(database);

    return {
        fame,
        reputation,
        persona,
        followers,
        popularity,
        performance,
        championship,
        consistency
    };
}


/* ============================================================
   BASE MARKETABILITY
   ============================================================ */

function calculateMarketability(
    database
) {
    const components =
        calculateComponents(
            database
        );

    const weights =
        MARKETABILITY_CONFIG.weights;

    let score = 0;

    for (
        const [component, weight]
        of Object.entries(weights)
    ) {
        score +=
            components[component] *
            weight;
    }

    return clamp(
        round(score)
    );
}


/* ============================================================
   SET MARKETABILITY
   ============================================================ */

function setMarketability(
    database,
    value,
    reason = "Marketability adjustment"
) {
    const state =
        ensureMarketability(
            database
        );

    const before =
        state.marketability;

    const after =
        clamp(value);

    const amount =
        after - before;

    state.marketability =
        after;

    const entry = {
        id:
            `market_${Date.now()}_` +
            `${Math.floor(
                Math.random() * 100000
            )}`,

        timestamp:
            nowISO(),

        type:
            "marketability",

        amount:
            round(amount),

        reason,

        before:
            round(before),

        after:
            round(after)
    };

    state.history.push(
        entry
    );

    if (
        state.history.length >
        500
    ) {
        state.history.splice(
            0,
            state.history.length - 500
        );
    }

    state.statistics.totalChanges++;

    if (amount > 0) {
        state.statistics.positiveChanges++;
    }

    if (amount < 0) {
        state.statistics.negativeChanges++;
    }

    state.lastUpdate =
        entry;

    return after;
}


/* ============================================================
   SYNCHRONIZE
   ============================================================ */

function syncMarketability(
    database
) {
    const state =
        ensureMarketability(
            database
        );

    const components =
        calculateComponents(
            database
        );

    state.components =
        components;

    const calculated =
        calculateMarketability(
            database
        );

    const before =
        state.marketability;

    state.marketability =
        calculated;

    state.commercialValue =
        calculateCommercialValue(
            database
        );

    state.mediaValue =
        calculateMediaValue(
            database
        );

    state.fanValue =
        calculateFanValue(
            database
        );

    state.sponsorValue =
        calculateSponsorValue(
            database
        );

    state.eventValue =
        calculateEventValue(
            database
        );

    state.negotiationPower =
        calculateNegotiationPower(
            database
        );

    if (
        Math.abs(
            calculated - before
        ) > 0.01
    ) {
        const entry = {
            id:
                `sync_${Date.now()}_` +
                `${Math.floor(
                    Math.random() * 100000
                )}`,

            timestamp:
                nowISO(),

            type:
                "synchronization",

            amount:
                round(
                    calculated - before
                ),

            reason:
                "Marketability synchronized",

            before:
                round(before),

            after:
                round(calculated),

            components: {
                ...components
            }
        };

        state.history.push(
            entry
        );

        if (
            state.history.length >
            500
        ) {
            state.history.splice(
                0,
                state.history.length - 500
            );
        }

        state.lastUpdate =
            entry;
    }

    return getMarketabilityProfile(
        database
    );
}


/* ============================================================
   SECONDARY VALUES
   ============================================================ */

function calculateCommercialValue(
    database
) {
    const components =
        calculateComponents(
            database
        );

    return clamp(
        round(
            components.fame * 0.20 +
            components.reputation * 0.20 +
            components.persona * 0.15 +
            components.followers * 0.20 +
            components.popularity * 0.10 +
            components.performance * 0.05 +
            components.championship * 0.05 +
            components.consistency * 0.05
        )
    );
}

function calculateMediaValue(
    database
) {
    const components =
        calculateComponents(
            database
        );

    return clamp(
        round(
            components.fame * 0.25 +
            components.persona * 0.25 +
            components.followers * 0.15 +
            components.popularity * 0.15 +
            components.performance * 0.10 +
            components.reputation * 0.10
        )
    );
}

function calculateFanValue(
    database
) {
    const components =
        calculateComponents(
            database
        );

    return clamp(
        round(
            components.followers * 0.35 +
            components.fame * 0.20 +
            components.persona * 0.20 +
            components.popularity * 0.15 +
            components.reputation * 0.10
        )
    );
}

function calculateSponsorValue(
    database
) {
    const components =
        calculateComponents(
            database
        );

    return clamp(
        round(
            components.reputation * 0.25 +
            components.followers * 0.25 +
            components.persona * 0.15 +
            components.fame * 0.15 +
            components.popularity * 0.10 +
            components.performance * 0.10
        )
    );
}

function calculateEventValue(
    database
) {
    const components =
        calculateComponents(
            database
        );

    return clamp(
        round(
            components.fame * 0.25 +
            components.performance * 0.20 +
            components.followers * 0.20 +
            components.popularity * 0.15 +
            components.championship * 0.10 +
            components.persona * 0.10
        )
    );
}

function calculateNegotiationPower(
    database
) {
    const state =
        ensureMarketability(
            database
        );

    return clamp(
        round(
            state.marketability * 0.60 +
            state.commercialValue * 0.20 +
            state.sponsorValue * 0.10 +
            state.eventValue * 0.10
        )
    );
}


/* ============================================================
   LEVEL
   ============================================================ */

function getMarketabilityLevel(
    value
) {
    const score =
        clamp(value);

    let current =
        MARKETABILITY_CONFIG
            .levels[0];

    for (
        const level
        of MARKETABILITY_CONFIG.levels
    ) {
        if (
            score >= level.min
        ) {
            current =
                level;
        }
    }

    return {
        ...current,
        score
    };
}

function getMarketabilityLevelLabel(
    database
) {
    return getMarketabilityLevel(
        ensureMarketability(
            database
        ).marketability
    ).label;
}


/* ============================================================
   OPPORTUNITY CHECKS
   ============================================================ */

function canReceiveMediaInterview(
    database
) {
    return (
        ensureMarketability(
            database
        ).marketability >=
        MARKETABILITY_CONFIG
            .thresholds
            .mediaInterview
    );
}

function canAttractSponsor(
    database
) {
    return (
        ensureMarketability(
            database
        ).marketability >=
        MARKETABILITY_CONFIG
            .thresholds
            .sponsorship
    );
}

function canAttractMajorSponsor(
    database
) {
    return (
        ensureMarketability(
            database
        ).marketability >=
        MARKETABILITY_CONFIG
            .thresholds
            .majorSponsor
    );
}

function canMainEvent(
    database
) {
    return (
        ensureMarketability(
            database
        ).marketability >=
        MARKETABILITY_CONFIG
            .thresholds
            .mainEvent
    );
}

function canCoMainEvent(
    database
) {
    return (
        ensureMarketability(
            database
        ).marketability >=
        MARKETABILITY_CONFIG
            .thresholds
            .coMainEvent
    );
}

function canBecomePPVStar(
    database
) {
    return (
        ensureMarketability(
            database
        ).marketability >=
        MARKETABILITY_CONFIG
            .thresholds
            .ppvStar
    );
}

function isSuperstar(
    database
) {
    return (
        ensureMarketability(
            database
        ).marketability >=
        MARKETABILITY_CONFIG
            .thresholds
            .superstar
    );
}


/* ============================================================
   EVENT BONUSES
   ============================================================ */

function applyBonus(
    database,
    amount,
    reason
) {
    const current =
        ensureMarketability(
            database
        ).marketability;

    return setMarketability(
        database,
        current + Number(amount || 0),
        reason
    );
}

function processMajorWin(
    database,
    opponentLevel = "major"
) {
    const state =
        ensureMarketability(
            database
        );

    state.statistics.majorWins++;

    let bonus =
        MARKETABILITY_CONFIG
            .bonuses
            .majorWin;

    if (
        opponentLevel ===
        "elite"
    ) {
        bonus += 2;
    }

    if (
        opponentLevel ===
        "champion"
    ) {
        bonus += 3;
    }

    applyBonus(
        database,
        bonus,
        `Major victory: ${opponentLevel}`
    );

    return syncMarketability(
        database
    );
}

function processUpsetWin(
    database
) {
    const state =
        ensureMarketability(
            database
        );

    state.statistics.upsetWins++;

    applyBonus(
        database,
        MARKETABILITY_CONFIG
            .bonuses
            .upsetWin,
        "Upset victory"
    );

    return syncMarketability(
        database
    );
}

function processKnockout(
    database
) {
    const state =
        ensureMarketability(
            database
        );

    state.statistics.knockouts++;

    applyBonus(
        database,
        MARKETABILITY_CONFIG
            .bonuses
            .knockout,
        "Knockout finish"
    );

    return syncMarketability(
        database
    );
}

function processSubmission(
    database
) {
    const state =
        ensureMarketability(
            database
        );

    state.statistics.submissions++;

    applyBonus(
        database,
        MARKETABILITY_CONFIG
            .bonuses
            .submission,
        "Submission finish"
    );

    return syncMarketability(
        database
    );
}


/* ============================================================
   CHAMPIONSHIP
   ============================================================ */

function processTitleWin(
    database,
    titleName = "Championship"
) {
    const state =
        ensureMarketability(
            database
        );

    state.statistics.titlesWon++;

    applyBonus(
        database,
        MARKETABILITY_CONFIG
            .bonuses
            .title,
        `Won title: ${titleName}`
    );

    return syncMarketability(
        database
    );
}

function processTitleDefense(
    database,
    titleName = "Championship"
) {
    const state =
        ensureMarketability(
            database
        );

    state.statistics.titleDefenses++;

    applyBonus(
        database,
        MARKETABILITY_CONFIG
            .bonuses
            .titleDefense,
        `Title defense: ${titleName}`
    );

    return syncMarketability(
        database
    );
}


/* ============================================================
   VIRAL / RIVALRY / AWARDS
   ============================================================ */

function processViralMoment(
    database,
    reason = "Viral moment"
) {
    const state =
        ensureMarketability(
            database
        );

    state.statistics.viralMoments++;

    applyBonus(
        database,
        MARKETABILITY_CONFIG
            .bonuses
            .viralMoment,
        reason
    );

    return syncMarketability(
        database
    );
}

function processRivalry(
    database,
    intensity = "medium"
) {
    const state =
        ensureMarketability(
            database
        );

    state.statistics.rivalries++;

    let bonus = 1;

    if (
        intensity === "low"
    ) {
        bonus = 0.5;
    }

    if (
        intensity === "high"
    ) {
        bonus = 2;
    }

    if (
        intensity === "extreme"
    ) {
        bonus = 3;
    }

    applyBonus(
        database,
        bonus,
        `Rivalry: ${intensity}`
    );

    return syncMarketability(
        database
    );
}

function processAward(
    database,
    awardName = "Career Award"
) {
    const state =
        ensureMarketability(
            database
        );

    state.statistics.awards++;

    applyBonus(
        database,
        MARKETABILITY_CONFIG
            .bonuses
            .award,
        `Award: ${awardName}`
    );

    return syncMarketability(
        database
    );
}


/* ============================================================
   NEGATIVE EVENTS
   ============================================================ */

function processControversy(
    database,
    severity = "medium"
) {
    const state =
        ensureMarketability(
            database
        );

    state.statistics.controversies++;

    let penalty =
        MARKETABILITY_CONFIG
            .penalties
            .controversy;

    if (
        severity === "low"
    ) {
        penalty = 0.5;
    }

    if (
        severity === "high"
    ) {
        penalty = 2;
    }

    if (
        severity === "extreme"
    ) {
        penalty = 4;
    }

    applyBonus(
        database,
        -penalty,
        `Controversy: ${severity}`
    );

    return syncMarketability(
        database
    );
}

function processScandal(
    database,
    reason = "Major scandal"
) {
    const state =
        ensureMarketability(
            database
        );

    state.statistics.scandals++;

    applyBonus(
        database,
        -MARKETABILITY_CONFIG
            .penalties
            .scandal,
        reason
    );

    return syncMarketability(
        database
    );
}

function processBadLoss(
    database,
    reason = "Bad defeat"
) {
    applyBonus(
        database,
        -MARKETABILITY_CONFIG
            .penalties
            .badLoss,
        reason
    );

    return syncMarketability(
        database
    );
}


/* ============================================================
   INACTIVITY
   ============================================================ */

function processInactivity(
    database,
    weeks = 1
) {
    const state =
        ensureMarketability(
            database
        );

    const duration =
        Math.max(
            0,
            Number(weeks) || 0
        );

    state.statistics.weeksInactive +=
        duration;

    if (duration <= 0) {
        return getMarketabilityProfile(
            database
        );
    }

    const penalty =
        MARKETABILITY_CONFIG
            .penalties
            .inactivity *
        duration;

    applyBonus(
        database,
        -penalty,
        `Inactivity: ${duration} week(s)`
    );

    return syncMarketability(
        database
    );
}


/* ============================================================
   VALUE MULTIPLIERS
   ============================================================ */

function getSponsorshipMultiplier(
    database
) {
    const value =
        ensureMarketability(
            database
        ).sponsorValue;

    return round(
        0.5 +
        value / 50
    );
}

function getContractMultiplier(
    database
) {
    const value =
        ensureMarketability(
            database
        ).negotiationPower;

    return round(
        0.75 +
        value / 100
    );
}

function getPPVMultiplier(
    database
) {
    const value =
        ensureMarketability(
            database
        ).eventValue;

    return round(
        0.5 +
        value / 50
    );
}

function getMediaMultiplier(
    database
) {
    const value =
        ensureMarketability(
            database
        ).mediaValue;

    return round(
        0.5 +
        value / 50
    );
}


/* ============================================================
   MAIN EVENT SCORE
   ============================================================ */

function getMainEventScore(
    database
) {
    const state =
        ensureMarketability(
            database
        );

    return clamp(
        round(
            state.marketability * 0.50 +
            state.eventValue * 0.30 +
            state.mediaValue * 0.20
        )
    );
}


/* ============================================================
   PROFILE
   ============================================================ */

function getMarketabilityProfile(
    database
) {
    const state =
        ensureMarketability(
            database
        );

    const level =
        getMarketabilityLevel(
            state.marketability
        );

    return {
        marketability:
            round(
                state.marketability
            ),

        level:
            level.id,

        levelLabel:
            level.label,

        commercialValue:
            round(
                state.commercialValue
            ),

        mediaValue:
            round(
                state.mediaValue
            ),

        fanValue:
            round(
                state.fanValue
            ),

        sponsorValue:
            round(
                state.sponsorValue
            ),

        eventValue:
            round(
                state.eventValue
            ),

        negotiationPower:
            round(
                state.negotiationPower
            ),

        mainEventScore:
            getMainEventScore(
                database
            ),

        components: {
            ...state.components
        },

        opportunities: {
            mediaInterview:
                canReceiveMediaInterview(
                    database
                ),

            sponsorship:
                canAttractSponsor(
                    database
                ),

            majorSponsor:
                canAttractMajorSponsor(
                    database
                ),

            mainEvent:
                canMainEvent(
                    database
                ),

            coMainEvent:
                canCoMainEvent(
                    database
                ),

            ppvStar:
                canBecomePPVStar(
                    database
                ),

            superstar:
                isSuperstar(
                    database
                )
        },

        multipliers: {
            sponsorship:
                getSponsorshipMultiplier(
                    database
                ),

            contract:
                getContractMultiplier(
                    database
                ),

            ppv:
                getPPVMultiplier(
                    database
                ),

            media:
                getMediaMultiplier(
                    database
                )
        },

        statistics: {
            ...state.statistics
        },

        lastUpdate:
            state.lastUpdate
    };
}


/* ============================================================
   NEXT LEVEL
   ============================================================ */

function getNextMarketabilityLevel(
    database
) {
    const current =
        ensureMarketability(
            database
        ).marketability;

    for (
        const level
        of MARKETABILITY_CONFIG.levels
    ) {
        if (
            level.min > current
        ) {
            return {
                id:
                    level.id,

                label:
                    level.label,

                required:
                    level.min,

                remaining:
                    round(
                        level.min -
                        current
                    )
            };
        }
    }

    return null;
}


/* ============================================================
   HISTORY
   ============================================================ */

function getMarketabilityHistory(
    database,
    limit = 50
) {
    const state =
        ensureMarketability(
            database
        );

    const amount =
        Math.max(
            1,
            Math.floor(
                Number(limit) || 50
            )
        );

    return state.history
        .slice(-amount)
        .reverse()
        .map(
            entry => ({
                ...entry
            })
        );
}


/* ============================================================
   STATISTICS
   ============================================================ */

function getMarketabilityStatistics(
    database
) {
    const state =
        ensureMarketability(
            database
        );

    return {
        ...state.statistics,

        currentMarketability:
            round(
                state.marketability
            ),

        level:
            getMarketabilityLevelLabel(
                database
            ),

        commercialValue:
            round(
                state.commercialValue
            ),

        mediaValue:
            round(
                state.mediaValue
            ),

        sponsorValue:
            round(
                state.sponsorValue
            ),

        negotiationPower:
            round(
                state.negotiationPower
            )
    };
}


/* ============================================================
   SNAPSHOT
   ============================================================ */

function createMarketabilitySnapshot(
    database
) {
    return {
        timestamp:
            nowISO(),

        ...getMarketabilityProfile(
            database
        )
    };
}


/* ============================================================
   VALIDATION
   ============================================================ */

function validateMarketability(
    database
) {
    try {
        const state =
            ensureMarketability(
                database
            );

        const problems = [];

        const fields = [
            "marketability",
            "commercialValue",
            "mediaValue",
            "fanValue",
            "sponsorValue",
            "eventValue",
            "negotiationPower"
        ];

        for (
            const field
            of fields
        ) {
            const value =
                Number(
                    state[field]
                );

            if (
                !Number.isFinite(
                    value
                )
            ) {
                problems.push(
                    `Invalid value: ${field}`
                );
            }

            if (
                value < 0 ||
                value > 100
            ) {
                problems.push(
                    `Value outside range: ${field}`
                );
            }
        }

        if (
            !Array.isArray(
                state.history
            )
        ) {
            problems.push(
                "History is not an array."
            );
        }

        if (
            !state.components
        ) {
            problems.push(
                "Components missing."
            );
        }

        if (
            !state.statistics
        ) {
            problems.push(
                "Statistics missing."
            );
        }

        return {
            valid:
                problems.length === 0,

            problems
        };

    } catch (error) {
        return {
            valid: false,

            problems: [
                error.message
            ]
        };
    }
}


/* ============================================================
   RESET
   ============================================================ */

function resetMarketability(
    database
) {
    ensureDatabase(
        database
    );

    database.media.marketability =
        createMarketabilityState();

    return database.media.marketability;
}


/* ============================================================
   SUMMARY
   ============================================================ */

function getMarketabilitySummary(
    database
) {
    const profile =
        getMarketabilityProfile(
            database
        );

    return {
        score:
            profile.marketability,

        level:
            profile.levelLabel,

        commercialValue:
            profile.commercialValue,

        mediaValue:
            profile.mediaValue,

        fanValue:
            profile.fanValue,

        sponsorValue:
            profile.sponsorValue,

        eventValue:
            profile.eventValue,

        negotiationPower:
            profile.negotiationPower,

        mainEventScore:
            profile.mainEventScore,

        opportunities:
            profile.opportunities,

        multipliers:
            profile.multipliers
    };
}


/* ============================================================
   DEFAULT EXPORT
   ============================================================ */

const MarketabilityEngine = {
    MARKETABILITY_VERSION,
    MARKETABILITY_CONFIG,

    createMarketabilityState,
    ensureMarketability,

    getFameInput,
    getReputationInput,
    getPersonaInput,
    getFollowersInput,
    getPopularityInput,
    getPerformanceInput,
    getChampionshipInput,
    getConsistencyInput,

    followersToScore,

    calculateComponents,
    calculateMarketability,

    setMarketability,
    syncMarketability,

    calculateCommercialValue,
    calculateMediaValue,
    calculateFanValue,
    calculateSponsorValue,
    calculateEventValue,
    calculateNegotiationPower,

    getMarketabilityLevel,
    getMarketabilityLevelLabel,

    canReceiveMediaInterview,
    canAttractSponsor,
    canAttractMajorSponsor,
    canMainEvent,
    canCoMainEvent,
    canBecomePPVStar,
    isSuperstar,

    processMajorWin,
    processUpsetWin,
    processKnockout,
    processSubmission,

    processTitleWin,
    processTitleDefense,

    processViralMoment,
    processRivalry,
    processAward,

    processControversy,
    processScandal,
    processBadLoss,

    processInactivity,

    getSponsorshipMultiplier,
    getContractMultiplier,
    getPPVMultiplier,
    getMediaMultiplier,

    getMainEventScore,

    getMarketabilityProfile,
    getNextMarketabilityLevel,

    getMarketabilityHistory,
    getMarketabilityStatistics,

    createMarketabilitySnapshot,

    validateMarketability,
    resetMarketability,

    getMarketabilitySummary
};


/* ============================================================
   NAMED EXPORTS
   ============================================================ */

export {
    MARKETABILITY_VERSION,
    MARKETABILITY_CONFIG,

    createMarketabilityState,
    ensureMarketability,

    getFameInput,
    getReputationInput,
    getPersonaInput,
    getFollowersInput,
    getPopularityInput,
    getPerformanceInput,
    getChampionshipInput,
    getConsistencyInput,

    followersToScore,

    calculateComponents,
    calculateMarketability,

    setMarketability,
    syncMarketability,

    calculateCommercialValue,
    calculateMediaValue,
    calculateFanValue,
    calculateSponsorValue,
    calculateEventValue,
    calculateNegotiationPower,

    getMarketabilityLevel,
    getMarketabilityLevelLabel,

    canReceiveMediaInterview,
    canAttractSponsor,
    canAttractMajorSponsor,
    canMainEvent,
    canCoMainEvent,
    canBecomePPVStar,
    isSuperstar,

    processMajorWin,
    processUpsetWin,
    processKnockout,
    processSubmission,

    processTitleWin,
    processTitleDefense,

    processViralMoment,
    processRivalry,
    processAward,

    processControversy,
    processScandal,
    processBadLoss,

    processInactivity,

    getSponsorshipMultiplier,
    getContractMultiplier,
    getPPVMultiplier,
    getMediaMultiplier,

    getMainEventScore,

    getMarketabilityProfile,
    getNextMarketabilityLevel,

    getMarketabilityHistory,
    getMarketabilityStatistics,

    createMarketabilitySnapshot,

    validateMarketability,
    resetMarketability,

    getMarketabilitySummary
};

export default MarketabilityEngine;
