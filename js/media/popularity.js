/* ============================================================
   MMA LIFE DYNASTY
   MEDIA — POPULARITY ENGINE
   ============================================================

   Responsável pela popularidade do lutador perante o público.

   DIFERENÇA ENTRE SISTEMAS:

   FAME
   → O quanto o lutador é conhecido.

   REPUTATION
   → O que as pessoas pensam sobre o lutador.

   PERSONA
   → Como o lutador se apresenta ao público.

   POPULARITY
   → O quanto o público realmente gosta, acompanha e
     demonstra interesse pelo lutador.

   MARKETABILITY
   → O valor comercial gerado pela combinação desses fatores.

   A popularidade poderá influenciar:
   - Seguidores
   - Audiência
   - Venda de PPV
   - Bilheteria
   - Merchandising
   - Patrocínios
   - Main events
   - Convites para eventos
   - Rivalidades
   - Interesse das organizações
   - Crescimento da carreira

   Este arquivo é independente para evitar dependências
   circulares entre os módulos.
   ============================================================ */

const POPULARITY_VERSION = 1;


/* ============================================================
   CONFIGURATION
   ============================================================ */

const POPULARITY_CONFIG = {

    min: 0,
    max: 100,

    defaults: {
        popularity: 20,

        fanLoyalty: 20,
        fanConnection: 20,
        audienceInterest: 20,
        entertainmentValue: 20,
        publicAppeal: 20,

        momentum: 0
    },

    weights: {

        fame: 0.15,
        reputation: 0.10,
        persona: 0.20,
        followers: 0.20,
        performance: 0.15,
        activity: 0.05,
        entertainment: 0.10,
        momentum: 0.05
    },

    levels: [

        {
            id: "unknown",
            label: "Desconhecido",
            min: 0
        },

        {
            id: "local",
            label: "Popular Localmente",
            min: 15
        },

        {
            id: "regional",
            label: "Popular Regionalmente",
            min: 30
        },

        {
            id: "national",
            label: "Popular Nacionalmente",
            min: 45
        },

        {
            id: "international",
            label: "Popular Internacionalmente",
            min: 60
        },

        {
            id: "star",
            label: "Grande Estrela",
            min: 75
        },

        {
            id: "superstar",
            label: "Superstar",
            min: 90
        }
    ],

    thresholds: {

        fanBase: 20,

        strongFanBase: 40,

        majorAudience: 55,

        mainEvent: 65,

        ppvDraw: 75,

        superstar: 90
    },

    bonuses: {

        win: 1.5,

        majorWin: 3,

        upsetWin: 4,

        knockout: 1.5,

        submission: 1.5,

        titleWin: 4,

        titleDefense: 2,

        viralMoment: 4,

        rivalry: 2,

        interview: 0.5,

        fanInteraction: 0.5,

        award: 2,

        comeback: 2
    },

    penalties: {

        loss: 1.5,

        badLoss: 3,

        inactivity: 0.35,

        controversy: 1,

        scandal: 5
    }
};


/* ============================================================
   HELPERS
   ============================================================ */

function clamp(
    value,
    min = POPULARITY_CONFIG.min,
    max = POPULARITY_CONFIG.max
) {

    const number =
        Number(value);

    if (
        !Number.isFinite(number)
    ) {
        return min;
    }

    return Math.max(
        min,
        Math.min(
            max,
            number
        )
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

    return new Date()
        .toISOString();
}


function ensureDatabase(
    database
) {

    if (
        !database ||
        typeof database !== "object"
    ) {

        throw new Error(
            "Popularity Engine: database inválido."
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

function createPopularityState() {

    return {

        version:
            POPULARITY_VERSION,

        popularity:
            POPULARITY_CONFIG
                .defaults
                .popularity,

        fanLoyalty:
            POPULARITY_CONFIG
                .defaults
                .fanLoyalty,

        fanConnection:
            POPULARITY_CONFIG
                .defaults
                .fanConnection,

        audienceInterest:
            POPULARITY_CONFIG
                .defaults
                .audienceInterest,

        entertainmentValue:
            POPULARITY_CONFIG
                .defaults
                .entertainmentValue,

        publicAppeal:
            POPULARITY_CONFIG
                .defaults
                .publicAppeal,

        momentum:
            POPULARITY_CONFIG
                .defaults
                .momentum,

        components: {

            fame: 0,

            reputation: 0,

            persona: 0,

            followers: 0,

            performance: 0,

            activity: 0,

            entertainment: 0,

            momentum: 0
        },

        history: [],

        viralMoments: [],

        milestones: [],

        statistics: {

            totalChanges: 0,

            positiveChanges: 0,

            negativeChanges: 0,

            wins: 0,

            losses: 0,

            majorWins: 0,

            upsetWins: 0,

            knockouts: 0,

            submissions: 0,

            titlesWon: 0,

            titleDefenses: 0,

            viralMoments: 0,

            rivalries: 0,

            interviews: 0,

            fanInteractions: 0,

            awards: 0,

            comebacks: 0,

            controversies: 0,

            scandals: 0,

            weeksInactive: 0
        },

        lastUpdate:
            null
    };
}


/* ============================================================
   ENSURE
   ============================================================ */

function ensurePopularity(
    database
) {

    ensureDatabase(
        database
    );

    if (
        !database.media.popularity ||
        typeof database.media.popularity !== "object"
    ) {

        database.media.popularity =
            createPopularityState();
    }

    const state =
        database.media.popularity;

    const defaults =
        POPULARITY_CONFIG.defaults;

    for (
        const key
        of Object.keys(defaults)
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

        state.components =
            createPopularityState()
                .components;
    }

    if (
        !Array.isArray(
            state.history
        )
    ) {

        state.history = [];
    }

    if (
        !Array.isArray(
            state.viralMoments
        )
    ) {

        state.viralMoments = [];
    }

    if (
        !Array.isArray(
            state.milestones
        )
    ) {

        state.milestones = [];
    }

    if (
        !state.statistics ||
        typeof state.statistics !== "object"
    ) {

        state.statistics =
            createPopularityState()
                .statistics;
    }

    return state;
}


/* ============================================================
   GENERIC READERS
   ============================================================ */

function readNumber(
    value,
    fallback = 0
) {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}


/* ============================================================
   FAME
   ============================================================ */

function getFameInput(
    database
) {

    ensureDatabase(
        database
    );

    const fame =
        database.media.fame;

    if (
        fame &&
        typeof fame === "object"
    ) {

        return clamp(
            readNumber(
                fame.fame,
                0
            )
        );
    }

    return clamp(
        readNumber(
            fame,
            0
        )
    );
}


/* ============================================================
   REPUTATION
   ============================================================ */

function getReputationInput(
    database
) {

    ensureDatabase(
        database
    );

    const reputation =
        database.media.reputation;

    if (
        reputation &&
        typeof reputation === "object"
    ) {

        return clamp(
            readNumber(
                reputation.reputation,
                50
            )
        );
    }

    if (
        Number.isFinite(
            Number(reputation)
        )
    ) {

        return clamp(
            reputation
        );
    }

    return 50;
}


/* ============================================================
   PERSONA
   ============================================================ */

function getPersonaInput(
    database
) {

    ensureDatabase(
        database
    );

    const persona =
        database.media.persona;

    if (
        !persona ||
        typeof persona !== "object"
    ) {

        return 30;
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
        .filter(
            Number.isFinite
        );

    if (
        values.length === 0
    ) {

        return 30;
    }

    return clamp(

        values.reduce(
            (
                total,
                value
            ) =>
                total + clamp(value),
            0
        ) / values.length
    );
}


/* ============================================================
   FOLLOWERS
   ============================================================ */

function getFollowersInput(
    database
) {

    ensureDatabase(
        database
    );

    let followers = 0;

    const media =
        database.media;

    if (
        Number.isFinite(
            Number(
                media.followers
            )
        )
    ) {

        followers =
            Number(
                media.followers
            );
    }

    if (
        media.followers &&
        typeof media.followers === "object"
    ) {

        followers =
            readNumber(
                media.followers.total ??
                media.followers.followers ??
                media.followers.count,
                followers
            );
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
            readNumber(
                followers,
                0
            )
        );

    if (
        value <= 1000
    ) {

        return clamp(
            value / 100
        );
    }

    if (
        value <= 10000
    ) {

        return clamp(

            10 +

            (
                (value - 1000) /
                9000
            ) * 15
        );
    }

    if (
        value <= 100000
    ) {

        return clamp(

            25 +

            (
                (value - 10000) /
                90000
            ) * 20
        );
    }

    if (
        value <= 1000000
    ) {

        return clamp(

            45 +

            (
                (value - 100000) /
                900000
            ) * 25
        );
    }

    if (
        value <= 10000000
    ) {

        return clamp(

            70 +

            (
                (value - 1000000) /
                9000000
            ) * 20
        );
    }

    return clamp(

        90 +

        Math.log10(
            value / 10000000
        ) * 5
    );
}


/* ============================================================
   PERFORMANCE
   ============================================================ */

function getPerformanceInput(
    database
) {

    ensureDatabase(
        database
    );

    const career =
        database.career;

    if (
        !career ||
        typeof career !== "object"
    ) {

        return 20;
    }

    const records =
        career.records ||
        career.professional?.records ||
        {};

    const wins =
        readNumber(
            records.wins ??
            records.totalWins,
            0
        );

    const losses =
        readNumber(
            records.losses ??
            records.totalLosses,
            0
        );

    const fights =
        readNumber(
            records.total ??
            records.fights,
            wins + losses
        );

    if (
        fights <= 0
    ) {

        return 20;
    }

    const winRate =
        clamp(
            (
                wins /
                fights
            ) * 100
        );

    return clamp(

        10 +

        winRate * 0.70 +

        Math.min(
            20,
            fights * 0.75
        )
    );
}


/* ============================================================
   ACTIVITY
   ============================================================ */

function getActivityInput(
    database
) {

    ensureDatabase(
        database
    );

    const state =
        database.media.popularity;

    const weeksInactive =
        readNumber(
            state?.statistics
                ?.weeksInactive,
            0
        );

    return clamp(
        100 -
        weeksInactive * 5
    );
}


/* ============================================================
   ENTERTAINMENT
   ============================================================ */

function getEntertainmentInput(
    database
) {

    ensureDatabase(
        database
    );

    const persona =
        database.media.persona;

    if (
        !persona ||
        typeof persona !== "object"
    ) {

        return 20;
    }

    const values = [

        persona.showmanship,

        persona.charisma,

        persona.mediaAppeal,

        persona.fanConnection,

        persona.commercialAppeal
    ]
        .map(Number)
        .filter(
            Number.isFinite
        );

    if (
        values.length === 0
    ) {

        return 20;
    }

    return clamp(

        values.reduce(
            (
                total,
                value
            ) =>
                total + clamp(value),
            0
        ) / values.length
    );
}


/* ============================================================
   MOMENTUM
   ============================================================ */

function getMomentumInput(
    database
) {

    const state =
        ensurePopularity(
            database
        );

    return clamp(
        50 +
        state.momentum
    );
}


/* ============================================================
   COMPONENT CALCULATION
   ============================================================ */

function calculateComponents(
    database
) {

    return {

        fame:
            getFameInput(
                database
            ),

        reputation:
            getReputationInput(
                database
            ),

        persona:
            getPersonaInput(
                database
            ),

        followers:
            followersToScore(
                getFollowersInput(
                    database
                )
            ),

        performance:
            getPerformanceInput(
                database
            ),

        activity:
            getActivityInput(
                database
            ),

        entertainment:
            getEntertainmentInput(
                database
            ),

        momentum:
            getMomentumInput(
                database
            )
    };
}


/* ============================================================
   CALCULATE POPULARITY
   ============================================================ */

function calculatePopularity(
    database
) {

    const components =
        calculateComponents(
            database
        );

    const weights =
        POPULARITY_CONFIG
            .weights;

    let score = 0;

    for (
        const [
            component,
            weight
        ]
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
   SET POPULARITY
   ============================================================ */

function setPopularity(
    database,
    value,
    reason = "Popularity adjustment"
) {

    const state =
        ensurePopularity(
            database
        );

    const before =
        state.popularity;

    const after =
        clamp(value);

    const amount =
        after - before;

    state.popularity =
        after;

    const entry = {

        id:
            `pop_${Date.now()}_` +
            `${Math.floor(
                Math.random() * 100000
            )}`,

        timestamp:
            nowISO(),

        type:
            "popularity",

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
        state.history.length > 500
    ) {

        state.history.splice(
            0,
            state.history.length - 500
        );
    }

    state.statistics.totalChanges++;

    if (
        amount > 0
    ) {

        state.statistics
            .positiveChanges++;
    }

    if (
        amount < 0
    ) {

        state.statistics
            .negativeChanges++;
    }

    state.lastUpdate =
        entry;

    return after;
}


/* ============================================================
   ADD POPULARITY
   ============================================================ */

function addPopularity(
    database,
    amount,
    reason = "Popularity change"
) {

    const state =
        ensurePopularity(
            database
        );

    return setPopularity(

        database,

        state.popularity +
        readNumber(
            amount,
            0
        ),

        reason
    );
}


/* ============================================================
   SYNCHRONIZE
   ============================================================ */

function syncPopularity(
    database
) {

    const state =
        ensurePopularity(
            database
        );

    const components =
        calculateComponents(
            database
        );

    state.components =
        components;

    const calculated =
        calculatePopularity(
            database
        );

    const before =
        state.popularity;

    state.popularity =
        calculated;

    state.fanLoyalty =
        clamp(
            calculated * 0.75
        );

    state.fanConnection =
        clamp(
            (
                components.persona * 0.40 +
                components.reputation * 0.20 +
                components.fame * 0.15 +
                components.followers * 0.25
            )
        );

    state.audienceInterest =
        clamp(
            (
                components.fame * 0.25 +
                components.followers * 0.25 +
                components.performance * 0.20 +
                components.entertainment * 0.20 +
                components.momentum * 0.10
            )
        );

    state.entertainmentValue =
        clamp(
            components.entertainment
        );

    state.publicAppeal =
        clamp(
            (
                components.reputation * 0.25 +
                components.persona * 0.25 +
                components.followers * 0.20 +
                components.fame * 0.15 +
                components.performance * 0.15
            )
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
                "Popularity synchronized",

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
            state.history.length > 500
        ) {

            state.history.splice(
                0,
                state.history.length - 500
            );
        }

        state.lastUpdate =
            entry;
    }

    checkPopularityMilestones(
        database
    );

    return getPopularityProfile(
        database
    );
}


/* ============================================================
   LEVEL
   ============================================================ */

function getPopularityLevel(
    value
) {

    const score =
        clamp(value);

    let current =
        POPULARITY_CONFIG
            .levels[0];

    for (
        const level
        of POPULARITY_CONFIG.levels
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


function getPopularityLevelLabel(
    database
) {

    const state =
        ensurePopularity(
            database
        );

    return getPopularityLevel(
        state.popularity
    ).label;
}


/* ============================================================
   EVENT BONUS
   ============================================================ */

function applyBonus(
    database,
    amount,
    reason
) {

    return addPopularity(
        database,
        amount,
        reason
    );
}


/* ============================================================
   FIGHT EVENTS
   ============================================================ */

function processWin(
    database
) {

    const state =
        ensurePopularity(
            database
        );

    state.statistics.wins++;

    state.momentum =
        clamp(
            state.momentum + 2,
            -50,
            50
        );

    applyBonus(
        database,
        POPULARITY_CONFIG
            .bonuses
            .win,
        "Fight victory"
    );

    return syncPopularity(
        database
    );
}


function processLoss(
    database
) {

    const state =
        ensurePopularity(
            database
        );

    state.statistics.losses++;

    state.momentum =
        clamp(
            state.momentum - 3,
            -50,
            50
        );

    applyBonus(
        database,
        -POPULARITY_CONFIG
            .penalties
            .loss,
        "Fight defeat"
    );

    return syncPopularity(
        database
    );
}


function processMajorWin(
    database,
    opponentLevel = "major"
) {

    const state =
        ensurePopularity(
            database
        );

    state.statistics.majorWins++;

    state.momentum =
        clamp(
            state.momentum + 5,
            -50,
            50
        );

    let bonus =
        POPULARITY_CONFIG
            .bonuses
            .majorWin;

    if (
        opponentLevel === "elite"
    ) {

        bonus += 2;
    }

    if (
        opponentLevel === "champion"
    ) {

        bonus += 3;
    }

    applyBonus(
        database,
        bonus,
        `Major victory: ${opponentLevel}`
    );

    return syncPopularity(
        database
    );
}


function processUpsetWin(
    database
) {

    const state =
        ensurePopularity(
            database
        );

    state.statistics.upsetWins++;

    state.momentum =
        clamp(
            state.momentum + 7,
            -50,
            50
        );

    applyBonus(
        database,
        POPULARITY_CONFIG
            .bonuses
            .upsetWin,
        "Upset victory"
    );

    return syncPopularity(
        database
    );
}


/* ============================================================
   FINISHES
   ============================================================ */

function processKnockout(
    database
) {

    const state =
        ensurePopularity(
            database
        );

    state.statistics.knockouts++;

    state.momentum =
        clamp(
            state.momentum + 2,
            -50,
            50
        );

    applyBonus(
        database,
        POPULARITY_CONFIG
            .bonuses
            .knockout,
        "Knockout finish"
    );

    return syncPopularity(
        database
    );
}


function processSubmission(
    database
) {

    const state =
        ensurePopularity(
            database
        );

    state.statistics.submissions++;

    state.momentum =
        clamp(
            state.momentum + 2,
            -50,
            50
        );

    applyBonus(
        database,
        POPULARITY_CONFIG
            .bonuses
            .submission,
        "Submission finish"
    );

    return syncPopularity(
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
        ensurePopularity(
            database
        );

    state.statistics.titlesWon++;

    state.momentum =
        clamp(
            state.momentum + 8,
            -50,
            50
        );

    applyBonus(
        database,
        POPULARITY_CONFIG
            .bonuses
            .titleWin,
        `Won title: ${titleName}`
    );

    return syncPopularity(
        database
    );
}


function processTitleDefense(
    database,
    titleName = "Championship"
) {

    const state =
        ensurePopularity(
            database
        );

    state.statistics.titleDefenses++;

    state.momentum =
        clamp(
            state.momentum + 3,
            -50,
            50
        );

    applyBonus(
        database,
        POPULARITY_CONFIG
            .bonuses
            .titleDefense,
        `Title defense: ${titleName}`
    );

    return syncPopularity(
        database
    );
}


/* ============================================================
   VIRAL MOMENT
   ============================================================ */

function processViralMoment(
    database,
    description = "Viral moment",
    intensity = "medium"
) {

    const state =
        ensurePopularity(
            database
        );

    state.statistics
        .viralMoments++;

    let bonus = 2;

    if (
        intensity === "low"
    ) {

        bonus = 1;
    }

    if (
        intensity === "high"
    ) {

        bonus = 4;
    }

    if (
        intensity === "extreme"
    ) {

        bonus = 7;
    }

    state.viralMoments.push({

        id:
            `viral_${Date.now()}_` +
            `${Math.floor(
                Math.random() * 100000
            )}`,

        timestamp:
            nowISO(),

        description,

        intensity,

        popularityGain:
            bonus
    });

    if (
        state.viralMoments.length > 100
    ) {

        state.viralMoments.splice(
            0,
            state.viralMoments.length - 100
        );
    }

    state.momentum =
        clamp(
            state.momentum + bonus,
            -50,
            50
        );

    applyBonus(
        database,
        bonus,
        description
    );

    return syncPopularity(
        database
    );
}


/* ============================================================
   RIVALRY
   ============================================================ */

function processRivalry(
    database,
    intensity = "medium"
) {

    const state =
        ensurePopularity(
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

        bonus = 3;
    }

    if (
        intensity === "extreme"
    ) {

        bonus = 5;
    }

    state.momentum =
        clamp(
            state.momentum + bonus,
            -50,
            50
        );

    applyBonus(
        database,
        bonus,
        `Rivalry: ${intensity}`
    );

    return syncPopularity(
        database
    );
}


/* ============================================================
   INTERVIEW
   ============================================================ */

function processInterview(
    database,
    quality = "normal"
) {

    const state =
        ensurePopularity(
            database
        );

    state.statistics.interviews++;

    let bonus =
        POPULARITY_CONFIG
            .bonuses
            .interview;

    if (
        quality === "excellent"
    ) {

        bonus = 2;
    }

    if (
        quality === "viral"
    ) {

        bonus = 4;
    }

    if (
        quality === "bad"
    ) {

        bonus = -1;
    }

    applyBonus(
        database,
        bonus,
        `Interview: ${quality}`
    );

    return syncPopularity(
        database
    );
}


/* ============================================================
   FAN INTERACTION
   ============================================================ */

function processFanInteraction(
    database,
    quality = "normal"
) {

    const state =
        ensurePopularity(
            database
        );

    state.statistics
        .fanInteractions++;

    let bonus =
        POPULARITY_CONFIG
            .bonuses
            .fanInteraction;

    if (
        quality === "excellent"
    ) {

        bonus = 1.5;
    }

    if (
        quality === "viral"
    ) {

        bonus = 3;
    }

    if (
        quality === "bad"
    ) {

        bonus = -0.5;
    }

    applyBonus(
        database,
        bonus,
        `Fan interaction: ${quality}`
    );

    return syncPopularity(
        database
    );
}


/* ============================================================
   AWARD
   ============================================================ */

function processAward(
    database,
    awardName = "Career Award"
) {

    const state =
        ensurePopularity(
            database
        );

    state.statistics.awards++;

    applyBonus(
        database,
        POPULARITY_CONFIG
            .bonuses
            .award,
        `Award: ${awardName}`
    );

    return syncPopularity(
        database
    );
}


/* ============================================================
   COMEBACK
   ============================================================ */

function processComeback(
    database
) {

    const state =
        ensurePopularity(
            database
        );

    state.statistics.comebacks++;

    state.momentum =
        clamp(
            state.momentum + 5,
            -50,
            50
        );

    applyBonus(
        database,
        POPULARITY_CONFIG
            .bonuses
            .comeback,
        "Career comeback"
    );

    return syncPopularity(
        database
    );
}


/* ============================================================
   CONTROVERSY
   ============================================================ */

function processControversy(
    database,
    severity = "medium"
) {

    const state =
        ensurePopularity(
            database
        );

    state.statistics.controversies++;

    let penalty =
        POPULARITY_CONFIG
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

    state.momentum =
        clamp(
            state.momentum - penalty,
            -50,
            50
        );

    applyBonus(
        database,
        -penalty,
        `Controversy: ${severity}`
    );

    return syncPopularity(
        database
    );
}


/* ============================================================
   SCANDAL
   ============================================================ */

function processScandal(
    database,
    reason = "Major scandal"
) {

    const state =
        ensurePopularity(
            database
        );

    state.statistics.scandals++;

    state.momentum =
        clamp(
            state.momentum - 8,
            -50,
            50
        );

    applyBonus(
        database,
        -POPULARITY_CONFIG
            .penalties
            .scandal,
        reason
    );

    return syncPopularity(
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
        ensurePopularity(
            database
        );

    const duration =
        Math.max(
            0,
            Math.floor(
                readNumber(
                    weeks,
                    0
                )
            )
        );

    if (
        duration <= 0
    ) {

        return getPopularityProfile(
            database
        );
    }

    state.statistics
        .weeksInactive +=
        duration;

    state.momentum =
        clamp(
            state.momentum -
            duration * 1.5,
            -50,
            50
        );

    const penalty =
        POPULARITY_CONFIG
            .penalties
            .inactivity *
        duration;

    applyBonus(
        database,
        -penalty,
        `Inactivity: ${duration} week(s)`
    );

    return syncPopularity(
        database
    );
}


/* ============================================================
   MILESTONES
   ============================================================ */

function checkPopularityMilestones(
    database
) {

    const state =
        ensurePopularity(
            database
        );

    const milestones =
        POPULARITY_CONFIG
            .levels;

    for (
        const milestone
        of milestones
    ) {

        if (
            state.popularity >=
            milestone.min &&
            !state.milestones
                .some(
                    item =>
                        item.id ===
                        milestone.id
                )
        ) {

            state.milestones.push({

                id:
                    milestone.id,

                label:
                    milestone.label,

                reachedAt:
                    nowISO(),

                value:
                    state.popularity
            });
        }
    }

    return state.milestones;
}


/* ============================================================
   OPPORTUNITY CHECKS
   ============================================================ */

function hasFanBase(
    database
) {

    return (
        ensurePopularity(
            database
        ).popularity >=
        POPULARITY_CONFIG
            .thresholds
            .fanBase
    );
}


function hasStrongFanBase(
    database
) {

    return (
        ensurePopularity(
            database
        ).popularity >=
        POPULARITY_CONFIG
            .thresholds
            .strongFanBase
    );
}


function attractsMajorAudience(
    database
) {

    return (
        ensurePopularity(
            database
        ).popularity >=
        POPULARITY_CONFIG
            .thresholds
            .majorAudience
    );
}


function canMainEvent(
    database
) {

    return (
        ensurePopularity(
            database
        ).popularity >=
        POPULARITY_CONFIG
            .thresholds
            .mainEvent
    );
}


function isPPVDraw(
    database
) {

    return (
        ensurePopularity(
            database
        ).popularity >=
        POPULARITY_CONFIG
            .thresholds
            .ppvDraw
    );
}


function isSuperstar(
    database
) {

    return (
        ensurePopularity(
            database
        ).popularity >=
        POPULARITY_CONFIG
            .thresholds
            .superstar
    );
}


/* ============================================================
   AUDIENCE MULTIPLIERS
   ============================================================ */

function getAudienceMultiplier(
    database
) {

    const value =
        ensurePopularity(
            database
        ).popularity;

    return round(
        0.50 +
        value / 100
    );
}


function getPPVMultiplier(
    database
) {

    const value =
        ensurePopularity(
            database
        ).popularity;

    return round(
        0.40 +
        value / 50
    );
}


function getTicketSalesMultiplier(
    database
) {

    const value =
        ensurePopularity(
            database
        ).popularity;

    return round(
        0.50 +
        value / 100
    );
}


function getMerchandiseMultiplier(
    database
) {

    const value =
        ensurePopularity(
            database
        ).fanLoyalty;

    return round(
        0.50 +
        value / 100
    );
}


/* ============================================================
   NEXT LEVEL
   ============================================================ */

function getNextPopularityLevel(
    database
) {

    const current =
        ensurePopularity(
            database
        ).popularity;

    for (
        const level
        of POPULARITY_CONFIG.levels
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
   PROFILE
   ============================================================ */

function getPopularityProfile(
    database
) {

    const state =
        ensurePopularity(
            database
        );

    const level =
        getPopularityLevel(
            state.popularity
        );

    return {

        popularity:
            round(
                state.popularity
            ),

        level:
            level.id,

        levelLabel:
            level.label,

        fanLoyalty:
            round(
                state.fanLoyalty
            ),

        fanConnection:
            round(
                state.fanConnection
            ),

        audienceInterest:
            round(
                state.audienceInterest
            ),

        entertainmentValue:
            round(
                state.entertainmentValue
            ),

        publicAppeal:
            round(
                state.publicAppeal
            ),

        momentum:
            round(
                state.momentum
            ),

        components: {
            ...state.components
        },

        opportunities: {

            fanBase:
                hasFanBase(
                    database
                ),

            strongFanBase:
                hasStrongFanBase(
                    database
                ),

            majorAudience:
                attractsMajorAudience(
                    database
                ),

            mainEvent:
                canMainEvent(
                    database
                ),

            ppvDraw:
                isPPVDraw(
                    database
                ),

            superstar:
                isSuperstar(
                    database
                )
        },

        multipliers: {

            audience:
                getAudienceMultiplier(
                    database
                ),

            ppv:
                getPPVMultiplier(
                    database
                ),

            ticketSales:
                getTicketSalesMultiplier(
                    database
                ),

            merchandise:
                getMerchandiseMultiplier(
                    database
                )
        },

        nextLevel:
            getNextPopularityLevel(
                database
            ),

        statistics: {
            ...state.statistics
        },

        milestones:
            state.milestones
                .map(
                    item => ({
                        ...item
                    })
                ),

        lastUpdate:
            state.lastUpdate
    };
}


/* ============================================================
   HISTORY
   ============================================================ */

function getPopularityHistory(
    database,
    limit = 50
) {

    const state =
        ensurePopularity(
            database
        );

    const amount =
        Math.max(
            1,
            Math.floor(
                readNumber(
                    limit,
                    50
                )
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
   VIRAL MOMENTS
   ============================================================ */

function getViralMoments(
    database,
    limit = 20
) {

    const state =
        ensurePopularity(
            database
        );

    const amount =
        Math.max(
            1,
            Math.floor(
                readNumber(
                    limit,
                    20
                )
            )
        );

    return state.viralMoments
        .slice(-amount)
        .reverse()
        .map(
            item => ({
                ...item
            })
        );
}


/* ============================================================
   STATISTICS
   ============================================================ */

function getPopularityStatistics(
    database
) {

    const state =
        ensurePopularity(
            database
        );

    return {

        ...state.statistics,

        currentPopularity:
            round(
                state.popularity
            ),

        level:
            getPopularityLevelLabel(
                database
            ),

        fanLoyalty:
            round(
                state.fanLoyalty
            ),

        fanConnection:
            round(
                state.fanConnection
            ),

        audienceInterest:
            round(
                state.audienceInterest
            ),

        entertainmentValue:
            round(
                state.entertainmentValue
            ),

        publicAppeal:
            round(
                state.publicAppeal
            ),

        momentum:
            round(
                state.momentum
            )
    };
}


/* ============================================================
   SNAPSHOT
   ============================================================ */

function createPopularitySnapshot(
    database
) {

    return {

        timestamp:
            nowISO(),

        ...getPopularityProfile(
            database
        )
    };
}


/* ============================================================
   VALIDATION
   ============================================================ */

function validatePopularity(
    database
) {

    try {

        const state =
            ensurePopularity(
                database
            );

        const problems = [];

        const fields = [

            "popularity",

            "fanLoyalty",

            "fanConnection",

            "audienceInterest",

            "entertainmentValue",

            "publicAppeal"
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
            state.momentum < -50 ||
            state.momentum > 50
        ) {

            problems.push(
                "Momentum outside range."
            );
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
            !Array.isArray(
                state.viralMoments
            )
        ) {

            problems.push(
                "Viral moments is not an array."
            );
        }

        if (
            !Array.isArray(
                state.milestones
            )
        ) {

            problems.push(
                "Milestones is not an array."
            );
        }

        return {

            valid:
                problems.length === 0,

            problems
        };

    } catch (
        error
    ) {

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

function resetPopularity(
    database
) {

    ensureDatabase(
        database
    );

    database.media.popularity =
        createPopularityState();

    return database.media.popularity;
}


/* ============================================================
   SUMMARY
   ============================================================ */

function getPopularitySummary(
    database
) {

    const profile =
        getPopularityProfile(
            database
        );

    return {

        score:
            profile.popularity,

        level:
            profile.levelLabel,

        fanLoyalty:
            profile.fanLoyalty,

        fanConnection:
            profile.fanConnection,

        audienceInterest:
            profile.audienceInterest,

        entertainmentValue:
            profile.entertainmentValue,

        publicAppeal:
            profile.publicAppeal,

        momentum:
            profile.momentum,

        opportunities:
            profile.opportunities,

        multipliers:
            profile.multipliers
    };
}


/* ============================================================
   DEFAULT EXPORT
   ============================================================ */

const PopularityEngine = {

    POPULARITY_VERSION,

    POPULARITY_CONFIG,

    createPopularityState,

    ensurePopularity,

    getFameInput,

    getReputationInput,

    getPersonaInput,

    getFollowersInput,

    followersToScore,

    getPerformanceInput,

    getActivityInput,

    getEntertainmentInput,

    getMomentumInput,

    calculateComponents,

    calculatePopularity,

    setPopularity,

    addPopularity,

    syncPopularity,

    getPopularityLevel,

    getPopularityLevelLabel,

    processWin,

    processLoss,

    processMajorWin,

    processUpsetWin,

    processKnockout,

    processSubmission,

    processTitleWin,

    processTitleDefense,

    processViralMoment,

    processRivalry,

    processInterview,

    processFanInteraction,

    processAward,

    processComeback,

    processControversy,

    processScandal,

    processInactivity,

    hasFanBase,

    hasStrongFanBase,

    attractsMajorAudience,

    canMainEvent,

    isPPVDraw,

    isSuperstar,

    getAudienceMultiplier,

    getPPVMultiplier,

    getTicketSalesMultiplier,

    getMerchandiseMultiplier,

    getNextPopularityLevel,

    getPopularityProfile,

    getPopularityHistory,

    getViralMoments,

    getPopularityStatistics,

    createPopularitySnapshot,

    validatePopularity,

    resetPopularity,

    getPopularitySummary,

    checkPopularityMilestones
};


/* ============================================================
   NAMED EXPORTS
   ============================================================ */

export {

    POPULARITY_VERSION,

    POPULARITY_CONFIG,

    createPopularityState,

    ensurePopularity,

    getFameInput,

    getReputationInput,

    getPersonaInput,

    getFollowersInput,

    followersToScore,

    getPerformanceInput,

    getActivityInput,

    getEntertainmentInput,

    getMomentumInput,

    calculateComponents,

    calculatePopularity,

    setPopularity,

    addPopularity,

    syncPopularity,

    getPopularityLevel,

    getPopularityLevelLabel,

    processWin,

    processLoss,

    processMajorWin,

    processUpsetWin,

    processKnockout,

    processSubmission,

    processTitleWin,

    processTitleDefense,

    processViralMoment,

    processRivalry,

    processInterview,

    processFanInteraction,

    processAward,

    processComeback,

    processControversy,

    processScandal,

    processInactivity,

    hasFanBase,

    hasStrongFanBase,

    attractsMajorAudience,

    canMainEvent,

    isPPVDraw,

    isSuperstar,

    getAudienceMultiplier,

    getPPVMultiplier,

    getTicketSalesMultiplier,

    getMerchandiseMultiplier,

    getNextPopularityLevel,

    getPopularityProfile,

    getPopularityHistory,

    getViralMoments,

    getPopularityStatistics,

    createPopularitySnapshot,

    validatePopularity,

    resetPopularity,

    getPopularitySummary,

    checkPopularityMilestones
};


export default PopularityEngine;
