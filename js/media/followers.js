/* ============================================================
   MMA LIFE DYNASTY
   MEDIA — FOLLOWERS ENGINE
   ============================================================

   Sistema responsável pela base de seguidores do lutador.

   FOLLOWERS
   → Número de pessoas que acompanham o lutador.

   POPULARITY
   → Quanto o público gosta/acompanha o lutador.

   FAME
   → Quanto o lutador é conhecido.

   REPUTATION
   → Como o público percebe o comportamento do lutador.

   PERSONA
   → Como o lutador se apresenta ao público.

   MARKETABILITY
   → Valor comercial produzido pela combinação dos sistemas.

   Este módulo controla:
   - Seguidores
   - Crescimento
   - Perda de seguidores
   - Crescimento orgânico
   - Viralização
   - Ganhos após lutas
   - Ganhos após títulos
   - Ganhos após entrevistas
   - Ganhos após rivalidades
   - Ganhos por atividade
   - Marcos de seguidores
   - Histórico
   - Estatísticas
   - Multiplicadores
   - Engajamento

   O arquivo é independente para evitar dependências circulares.
   ============================================================ */

const FOLLOWERS_VERSION = 1;


/* ============================================================
   CONFIGURATION
   ============================================================ */

const FOLLOWERS_CONFIG = {

    min: 0,

    max: Number.MAX_SAFE_INTEGER,

    defaults: {

        followers: 100,

        engagementRate: 5,

        growthRate: 0,

        momentum: 0,

        reach: 100,

        loyalty: 20,

        engagement: 20
    },

    growth: {

        baseWeeklyRate: 0.01,

        minimumGrowth: 0,

        viralMultiplier: 5,

        titleMultiplier: 3,

        majorWinMultiplier: 2,

        popularityMultiplier: 1,

        fameMultiplier: 0.5
    },

    loss: {

        inactivityRate: 0.005,

        badLossRate: 0.01,

        controversyRate: 0.005,

        scandalRate: 0.05
    },

    bonuses: {

        winBase: 25,

        majorWinBase: 100,

        upsetBase: 150,

        knockoutBase: 50,

        submissionBase: 50,

        titleBase: 500,

        titleDefenseBase: 150,

        viralBase: 250,

        rivalryBase: 100,

        interviewBase: 25,

        fanInteractionBase: 20,

        awardBase: 100,

        comebackBase: 100
    },

    milestones: [

        100,

        500,

        1000,

        5000,

        10000,

        25000,

        50000,

        100000,

        250000,

        500000,

        1000000,

        2500000,

        5000000,

        10000000,

        25000000,

        50000000,

        100000000
    ],

    tiers: [

        {
            id: "unknown",
            label: "Sem Público",
            min: 0
        },

        {
            id: "local",
            label: "Público Local",
            min: 100
        },

        {
            id: "regional",
            label: "Público Regional",
            min: 1000
        },

        {
            id: "national",
            label: "Público Nacional",
            min: 10000
        },

        {
            id: "large",
            label: "Grande Audiência",
            min: 100000
        },

        {
            id: "star",
            label: "Estrela",
            min: 1000000
        },

        {
            id: "superstar",
            label: "Superstar",
            min: 10000000
        },

        {
            id: "global_icon",
            label: "Ícone Global",
            min: 50000000
        }
    ]
};


/* ============================================================
   HELPERS
   ============================================================ */

function clamp(
    value,
    min = 0,
    max = 100
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


function integer(
    value
) {

    const number =
        Number(value);

    if (
        !Number.isFinite(number)
    ) {

        return 0;
    }

    return Math.round(
        number
    );
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
            "Followers Engine: database inválido."
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


function readNumber(
    value,
    fallback = 0
) {

    const number =
        Number(value);

    return Number.isFinite(
        number
    )
        ? number
        : fallback;
}


/* ============================================================
   STATE
   ============================================================ */

function createFollowersState() {

    return {

        version:
            FOLLOWERS_VERSION,

        followers:
            FOLLOWERS_CONFIG
                .defaults
                .followers,

        engagementRate:
            FOLLOWERS_CONFIG
                .defaults
                .engagementRate,

        growthRate:
            FOLLOWERS_CONFIG
                .defaults
                .growthRate,

        momentum:
            FOLLOWERS_CONFIG
                .defaults
                .momentum,

        reach:
            FOLLOWERS_CONFIG
                .defaults
                .reach,

        loyalty:
            FOLLOWERS_CONFIG
                .defaults
                .loyalty,

        engagement:
            FOLLOWERS_CONFIG
                .defaults
                .engagement,

        weeklyGrowth: 0,

        lastWeekFollowers:
            FOLLOWERS_CONFIG
                .defaults
                .followers,

        components: {

            popularity: 0,

            fame: 0,

            reputation: 0,

            persona: 0,

            performance: 0,

            activity: 0,

            momentum: 0
        },

        history: [],

        milestones: [],

        viralMoments: [],

        statistics: {

            totalChanges: 0,

            followersGained: 0,

            followersLost: 0,

            weeksProcessed: 0,

            fights: 0,

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

            weeksInactive: 0,

            milestonesReached: 0
        },

        lastUpdate:
            null
    };
}


/* ============================================================
   ENSURE
   ============================================================ */

function ensureFollowers(
    database
) {

    ensureDatabase(
        database
    );

    if (
        !database.media.followers ||
        typeof database.media.followers !== "object"
    ) {

        database.media.followers =
            createFollowersState();
    }

    const state =
        database.media.followers;

    const defaults =
        FOLLOWERS_CONFIG.defaults;

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
    }

    state.followers =
        Math.max(
            0,
            integer(
                state.followers
            )
        );

    state.lastWeekFollowers =
        Math.max(
            0,
            integer(
                state.lastWeekFollowers
            )
        );

    state.engagementRate =
        clamp(
            state.engagementRate
        );

    state.growthRate =
        clamp(
            state.growthRate,
            -100,
            100
        );

    state.momentum =
        clamp(
            state.momentum,
            -100,
            100
        );

    state.reach =
        clamp(
            state.reach
        );

    state.loyalty =
        clamp(
            state.loyalty
        );

    state.engagement =
        clamp(
            state.engagement
        );

    if (
        !state.components ||
        typeof state.components !== "object"
    ) {

        state.components =
            createFollowersState()
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
            state.milestones
        )
    ) {

        state.milestones = [];
    }

    if (
        !Array.isArray(
            state.viralMoments
        )
    ) {

        state.viralMoments = [];
    }

    if (
        !state.statistics ||
        typeof state.statistics !== "object"
    ) {

        state.statistics =
            createFollowersState()
                .statistics;
    }

    return state;
}


/* ============================================================
   EXTERNAL MEDIA VALUES
   ============================================================ */

function getPopularityInput(
    database
) {

    ensureDatabase(
        database
    );

    const popularity =
        database.media.popularity;

    if (
        popularity &&
        typeof popularity === "object"
    ) {

        return clamp(
            readNumber(
                popularity.popularity,
                20
            )
        );
    }

    return clamp(
        readNumber(
            popularity,
            20
        )
    );
}


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

    return clamp(
        readNumber(
            reputation,
            50
        )
    );
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

        return 25;
    }

    const values = [

        persona.charisma,

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

        return 25;
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
   PERFORMANCE
   ============================================================ */

function getPerformanceInput(
    database
) {

    ensureDatabase(
        database
    );

    const records =
        database.career
            ?.records ||
        database.career
            ?.professional
            ?.records ||
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

    return clamp(

        10 +

        (
            wins /
            fights
        ) * 70 +

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

    const state =
        ensureFollowers(
            database
        );

    const inactiveWeeks =
        readNumber(
            state.statistics
                ?.weeksInactive,
            0
        );

    return clamp(
        100 -
        inactiveWeeks * 5
    );
}


/* ============================================================
   MOMENTUM
   ============================================================ */

function getMomentumInput(
    database
) {

    const state =
        ensureFollowers(
            database
        );

    return clamp(
        50 +
        state.momentum
    );
}


/* ============================================================
   COMPONENTS
   ============================================================ */

function calculateComponents(
    database
) {

    return {

        popularity:
            getPopularityInput(
                database
            ),

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

        performance:
            getPerformanceInput(
                database
            ),

        activity:
            getActivityInput(
                database
            ),

        momentum:
            getMomentumInput(
                database
            )
    };
}


/* ============================================================
   ORGANIC GROWTH RATE
   ============================================================ */

function calculateGrowthRate(
    database
) {

    const components =
        calculateComponents(
            database
        );

    const state =
        ensureFollowers(
            database
        );

    let rate =
        FOLLOWERS_CONFIG
            .growth
            .baseWeeklyRate;

    rate +=
        components.popularity *
        0.0005;

    rate +=
        components.fame *
        0.0002;

    rate +=
        components.persona *
        0.0002;

    rate +=
        components.performance *
        0.0002;

    rate +=
        components.momentum *
        0.0001;

    rate -=
        Math.max(
            0,
            state.statistics
                .weeksInactive
        ) *
        0.001;

    return clamp(
        rate * 100,
        -50,
        100
    );
}


/* ============================================================
   WEEKLY ORGANIC GROWTH
   ============================================================ */

function processWeeklyGrowth(
    database,
    weeks = 1
) {

    const state =
        ensureFollowers(
            database
        );

    const duration =
        Math.max(
            0,
            integer(weeks)
        );

    if (
        duration <= 0
    ) {

        return getFollowersProfile(
            database
        );
    }

    let totalChange = 0;

    for (
        let week = 0;
        week < duration;
        week++
    ) {

        const rate =
            calculateGrowthRate(
                database
            );

        state.growthRate =
            rate;

        const before =
            state.followers;

        const growth =
            Math.round(
                before *
                (rate / 100)
            );

        const finalGrowth =
            Math.max(
                0,
                growth
            );

        state.followers +=
            finalGrowth;

        state.weeklyGrowth =
            finalGrowth;

        state.statistics
            .weeksProcessed++;

        totalChange +=
            finalGrowth;

        if (
            finalGrowth > 0
        ) {

            state.statistics
                .followersGained +=
                finalGrowth;
        }

        recordHistory(
            database,
            finalGrowth,
            `Organic weekly growth`
        );

        checkMilestones(
            database
        );
    }

    state.lastWeekFollowers =
        state.followers;

    updateDerivedValues(
        database
    );

    return {
        ...getFollowersProfile(
            database
        ),

        weeklyChange:
            totalChange
    };
}


/* ============================================================
   ADD FOLLOWERS
   ============================================================ */

function addFollowers(
    database,
    amount,
    reason = "Follower growth"
) {

    const state =
        ensureFollowers(
            database
        );

    const change =
        integer(amount);

    if (
        change === 0
    ) {

        return state.followers;
    }

    const before =
        state.followers;

    const after =
        Math.max(
            0,
            before + change
        );

    const actualChange =
        after - before;

    state.followers =
        after;

    if (
        actualChange > 0
    ) {

        state.statistics
            .followersGained +=
            actualChange;
    }

    if (
        actualChange < 0
    ) {

        state.statistics
            .followersLost +=
            Math.abs(
                actualChange
            );
    }

    recordHistory(
        database,
        actualChange,
        reason
    );

    checkMilestones(
        database
    );

    updateDerivedValues(
        database
    );

    return state.followers;
}


/* ============================================================
   REMOVE FOLLOWERS
   ============================================================ */

function removeFollowers(
    database,
    amount,
    reason = "Follower loss"
) {

    const value =
        Math.abs(
            integer(amount)
        );

    return addFollowers(
        database,
        -value,
        reason
    );
}


/* ============================================================
   HISTORY
   ============================================================ */

function recordHistory(
    database,
    amount,
    reason
) {

    const state =
        ensureFollowers(
            database
        );

    const before =
        state.followers -
        integer(amount);

    const after =
        state.followers;

    const entry = {

        id:
            `followers_${Date.now()}_` +
            `${Math.floor(
                Math.random() * 100000
            )}`,

        timestamp:
            nowISO(),

        amount:
            integer(amount),

        reason,

        before:
            Math.max(
                0,
                integer(before)
            ),

        after:
            Math.max(
                0,
                integer(after)
            )
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

    state.statistics
        .totalChanges++;

    if (
        amount !== 0
    ) {

        state.lastUpdate =
            entry;
    }

    return entry;
}


/* ============================================================
   DERIVED VALUES
   ============================================================ */

function updateDerivedValues(
    database
) {

    const state =
        ensureFollowers(
            database
        );

    const components =
        calculateComponents(
            database
        );

    state.components =
        components;

    state.engagementRate =
        clamp(

            2 +

            components.persona * 0.03 +

            components.reputation * 0.02 +

            components.popularity * 0.02
        );

    state.engagement =
        clamp(

            components.popularity * 0.35 +

            components.persona * 0.25 +

            components.reputation * 0.15 +

            components.performance * 0.10 +

            components.momentum * 0.15
        );

    state.loyalty =
        clamp(

            components.reputation * 0.30 +

            components.persona * 0.20 +

            components.performance * 0.20 +

            components.popularity * 0.20 +

            components.momentum * 0.10
        );

    state.reach =
        clamp(

            components.fame * 0.30 +

            components.popularity * 0.25 +

            components.persona * 0.15 +

            components.performance * 0.15 +

            components.momentum * 0.15
        );

    state.growthRate =
        calculateGrowthRate(
            database
        );

    return state;
}


/* ============================================================
   MILESTONES
   ============================================================ */

function checkMilestones(
    database
) {

    const state =
        ensureFollowers(
            database
        );

    for (
        const milestone
        of FOLLOWERS_CONFIG.milestones
    ) {

        if (
            state.followers >=
            milestone
        ) {

            const alreadyReached =
                state.milestones
                    .some(
                        item =>
                            Number(
                                item.value
                            ) ===
                            milestone
                    );

            if (
                !alreadyReached
            ) {

                state.milestones.push({

                    value:
                        milestone,

                    reachedAt:
                        nowISO(),

                    followers:
                        state.followers
                });

                state.statistics
                    .milestonesReached++;
            }
        }
    }

    return state.milestones;
}


/* ============================================================
   FIGHT EVENTS
   ============================================================ */

function processFight(
    database
) {

    const state =
        ensureFollowers(
            database
        );

    state.statistics.fights++;

    return updateDerivedValues(
        database
    );
}


function processWin(
    database
) {

    const state =
        ensureFollowers(
            database
        );

    state.statistics.wins++;

    state.momentum =
        clamp(
            state.momentum + 3,
            -100,
            100
        );

    const base =
        FOLLOWERS_CONFIG
            .bonuses
            .winBase;

    const popularity =
        getPopularityInput(
            database
        );

    const fame =
        getFameInput(
            database
        );

    const gain =
        Math.max(
            1,
            Math.round(
                base *
                (
                    1 +
                    popularity / 100
                ) *
                (
                    1 +
                    fame / 200
                )
            )
        );

    addFollowers(
        database,
        gain,
        "Fight victory"
    );

    return getFollowersProfile(
        database
    );
}


function processLoss(
    database
) {

    const state =
        ensureFollowers(
            database
        );

    state.statistics.losses++;

    state.momentum =
        clamp(
            state.momentum - 4,
            -100,
            100
        );

    const loss =
        Math.max(
            1,
            Math.round(
                state.followers *
                0.001
            )
        );

    removeFollowers(
        database,
        loss,
        "Fight defeat"
    );

    return getFollowersProfile(
        database
    );
}


function processMajorWin(
    database,
    opponentLevel = "major"
) {

    const state =
        ensureFollowers(
            database
        );

    state.statistics.majorWins++;

    state.momentum =
        clamp(
            state.momentum + 6,
            -100,
            100
        );

    let multiplier = 1;

    if (
        opponentLevel === "elite"
    ) {

        multiplier = 2;
    }

    if (
        opponentLevel === "champion"
    ) {

        multiplier = 3;
    }

    const gain =
        Math.round(

            FOLLOWERS_CONFIG
                .bonuses
                .majorWinBase *

            multiplier *

            (
                1 +
                getPopularityInput(
                    database
                ) / 100
            )
        );

    addFollowers(
        database,
        gain,
        `Major victory: ${opponentLevel}`
    );

    return getFollowersProfile(
        database
    );
}


function processUpsetWin(
    database
) {

    const state =
        ensureFollowers(
            database
        );

    state.statistics.upsetWins++;

    state.momentum =
        clamp(
            state.momentum + 10,
            -100,
            100
        );

    const gain =
        Math.round(

            FOLLOWERS_CONFIG
                .bonuses
                .upsetBase *

            (
                1 +
                getPopularityInput(
                    database
                ) / 100
            )
        );

    addFollowers(
        database,
        gain,
        "Upset victory"
    );

    return getFollowersProfile(
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
        ensureFollowers(
            database
        );

    state.statistics.knockouts++;

    state.momentum =
        clamp(
            state.momentum + 3,
            -100,
            100
        );

    const gain =
        Math.round(

            FOLLOWERS_CONFIG
                .bonuses
                .knockoutBase *

            (
                1 +
                getPopularityInput(
                    database
                ) / 100
            )
        );

    addFollowers(
        database,
        gain,
        "Knockout finish"
    );

    return getFollowersProfile(
        database
    );
}


function processSubmission(
    database
) {

    const state =
        ensureFollowers(
            database
        );

    state.statistics.submissions++;

    state.momentum =
        clamp(
            state.momentum + 3,
            -100,
            100
        );

    const gain =
        Math.round(

            FOLLOWERS_CONFIG
                .bonuses
                .submissionBase *

            (
                1 +
                getPopularityInput(
                    database
                ) / 100
            )
        );

    addFollowers(
        database,
        gain,
        "Submission finish"
    );

    return getFollowersProfile(
        database
    );
}


/* ============================================================
   TITLES
   ============================================================ */

function processTitleWin(
    database,
    titleName = "Championship"
) {

    const state =
        ensureFollowers(
            database
        );

    state.statistics.titlesWon++;

    state.momentum =
        clamp(
            state.momentum + 12,
            -100,
            100
        );

    const gain =
        Math.round(

            FOLLOWERS_CONFIG
                .bonuses
                .titleBase *

            (
                1 +
                getPopularityInput(
                    database
                ) / 100
            )
        );

    addFollowers(
        database,
        gain,
        `Won title: ${titleName}`
    );

    return getFollowersProfile(
        database
    );
}


function processTitleDefense(
    database,
    titleName = "Championship"
) {

    const state =
        ensureFollowers(
            database
        );

    state.statistics
        .titleDefenses++;

    state.momentum =
        clamp(
            state.momentum + 5,
            -100,
            100
        );

    const gain =
        Math.round(

            FOLLOWERS_CONFIG
                .bonuses
                .titleDefenseBase *

            (
                1 +
                getPopularityInput(
                    database
                ) / 100
            )
        );

    addFollowers(
        database,
        gain,
        `Title defense: ${titleName}`
    );

    return getFollowersProfile(
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
        ensureFollowers(
            database
        );

    state.statistics
        .viralMoments++;

    let multiplier = 1;

    if (
        intensity === "low"
    ) {

        multiplier = 0.5;
    }

    if (
        intensity === "high"
    ) {

        multiplier = 2;
    }

    if (
        intensity === "extreme"
    ) {

        multiplier = 5;
    }

    const base =
        FOLLOWERS_CONFIG
            .bonuses
            .viralBase;

    const gain =
        Math.round(

            base *

            multiplier *

            (
                1 +
                getPopularityInput(
                    database
                ) / 100
            )
        );

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

        followersGained:
            gain
    });

    if (
        state.viralMoments.length >
        100
    ) {

        state.viralMoments.splice(
            0,
            state.viralMoments.length - 100
        );
    }

    state.momentum =
        clamp(
            state.momentum +
            gain / 100,
            -100,
            100
        );

    addFollowers(
        database,
        gain,
        description
    );

    return getFollowersProfile(
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
        ensureFollowers(
            database
        );

    state.statistics.rivalries++;

    let multiplier = 1;

    if (
        intensity === "low"
    ) {

        multiplier = 0.5;
    }

    if (
        intensity === "high"
    ) {

        multiplier = 2;
    }

    if (
        intensity === "extreme"
    ) {

        multiplier = 4;
    }

    const gain =
        Math.round(

            FOLLOWERS_CONFIG
                .bonuses
                .rivalryBase *

            multiplier
        );

    addFollowers(
        database,
        gain,
        `Rivalry: ${intensity}`
    );

    return getFollowersProfile(
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
        ensureFollowers(
            database
        );

    state.statistics.interviews++;

    let multiplier = 1;

    if (
        quality === "excellent"
    ) {

        multiplier = 2;
    }

    if (
        quality === "viral"
    ) {

        multiplier = 5;
    }

    if (
        quality === "bad"
    ) {

        multiplier = -0.5;
    }

    const gain =
        Math.round(

            FOLLOWERS_CONFIG
                .bonuses
                .interviewBase *

            multiplier
        );

    addFollowers(
        database,
        gain,
        `Interview: ${quality}`
    );

    return getFollowersProfile(
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
        ensureFollowers(
            database
        );

    state.statistics
        .fanInteractions++;

    let multiplier = 1;

    if (
        quality === "excellent"
    ) {

        multiplier = 2;
    }

    if (
        quality === "viral"
    ) {

        multiplier = 4;
    }

    if (
        quality === "bad"
    ) {

        multiplier = -0.5;
    }

    const gain =
        Math.round(

            FOLLOWERS_CONFIG
                .bonuses
                .fanInteractionBase *

            multiplier
        );

    addFollowers(
        database,
        gain,
        `Fan interaction: ${quality}`
    );

    return getFollowersProfile(
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
        ensureFollowers(
            database
        );

    state.statistics.awards++;

    addFollowers(
        database,
        FOLLOWERS_CONFIG
            .bonuses
            .awardBase,
        `Award: ${awardName}`
    );

    return getFollowersProfile(
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
        ensureFollowers(
            database
        );

    state.statistics.comebacks++;

    state.momentum =
        clamp(
            state.momentum + 5,
            -100,
            100
        );

    addFollowers(
        database,
        FOLLOWERS_CONFIG
            .bonuses
            .comebackBase,
        "Career comeback"
    );

    return getFollowersProfile(
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
        ensureFollowers(
            database
        );

    const duration =
        Math.max(
            0,
            integer(weeks)
        );

    if (
        duration <= 0
    ) {

        return getFollowersProfile(
            database
        );
    }

    state.statistics
        .weeksInactive +=
        duration;

    state.momentum =
        clamp(
            state.momentum -
            duration * 2,
            -100,
            100
        );

    const loss =
        Math.round(

            state.followers *

            (
                FOLLOWERS_CONFIG
                    .loss
                    .inactivityRate *
                duration
            )
        );

    removeFollowers(
        database,
        loss,
        `Inactivity: ${duration} week(s)`
    );

    return getFollowersProfile(
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
        ensureFollowers(
            database
        );

    state.statistics.controversies++;

    let rate =
        FOLLOWERS_CONFIG
            .loss
            .controversyRate;

    if (
        severity === "low"
    ) {

        rate *= 0.5;
    }

    if (
        severity === "high"
    ) {

        rate *= 2;
    }

    if (
        severity === "extreme"
    ) {

        rate *= 4;
    }

    const loss =
        Math.round(
            state.followers *
            rate
        );

    state.momentum =
        clamp(
            state.momentum -
            3,
            -100,
            100
        );

    removeFollowers(
        database,
        loss,
        `Controversy: ${severity}`
    );

    return getFollowersProfile(
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
        ensureFollowers(
            database
        );

    state.statistics.scandals++;

    const loss =
        Math.round(

            state.followers *

            FOLLOWERS_CONFIG
                .loss
                .scandalRate
        );

    state.momentum =
        clamp(
            state.momentum - 15,
            -100,
            100
        );

    removeFollowers(
        database,
        loss,
        reason
    );

    return getFollowersProfile(
        database
    );
}


/* ============================================================
   BAD LOSS
   ============================================================ */

function processBadLoss(
    database,
    reason = "Bad defeat"
) {

    const state =
        ensureFollowers(
            database
        );

    const loss =
        Math.round(

            state.followers *

            FOLLOWERS_CONFIG
                .loss
                .badLossRate
        );

    state.momentum =
        clamp(
            state.momentum - 6,
            -100,
            100
        );

    removeFollowers(
        database,
        loss,
        reason
    );

    return getFollowersProfile(
        database
    );
}


/* ============================================================
   FOLLOWER TIER
   ============================================================ */

function getFollowerTier(
    followers
) {

    const value =
        Math.max(
            0,
            integer(followers)
        );

    let current =
        FOLLOWERS_CONFIG
            .tiers[0];

    for (
        const tier
        of FOLLOWERS_CONFIG.tiers
    ) {

        if (
            value >= tier.min
        ) {

            current =
                tier;
        }
    }

    return {

        ...current,

        followers:
            value
    };
}


function getFollowerTierLabel(
    database
) {

    const state =
        ensureFollowers(
            database
        );

    return getFollowerTier(
        state.followers
    ).label;
}


/* ============================================================
   NEXT MILESTONE
   ============================================================ */

function getNextFollowerMilestone(
    database
) {

    const state =
        ensureFollowers(
            database
        );

    for (
        const milestone
        of FOLLOWERS_CONFIG
            .milestones
    ) {

        if (
            milestone >
            state.followers
        ) {

            return {

                value:
                    milestone,

                remaining:
                    milestone -
                    state.followers,

                progress:
                    round(

                        (
                            state.followers /
                            milestone
                        ) * 100
                    )
            };
        }
    }

    return null;
}


/* ============================================================
   ENGAGEMENT
   ============================================================ */

function calculateEngagementScore(
    database
) {

    const state =
        ensureFollowers(
            database
        );

    updateDerivedValues(
        database
    );

    return clamp(

        state.engagement * 0.60 +

        state.loyalty * 0.25 +

        state.engagementRate * 2
    );
}


/* ============================================================
   REACH
   ============================================================ */

function calculateReach(
    database
) {

    const state =
        ensureFollowers(
            database
        );

    updateDerivedValues(
        database
    );

    const base =
        state.followers;

    const multiplier =
        0.5 +
        state.reach / 100;

    return Math.max(
        0,
        Math.round(
            base *
            multiplier
        )
    );
}


/* ============================================================
   SOCIAL POST POTENTIAL
   ============================================================ */

function getSocialPostPotential(
    database
) {

    const state =
        ensureFollowers(
            database
        );

    updateDerivedValues(
        database
    );

    return clamp(

        state.engagement * 0.35 +

        state.reach * 0.25 +

        state.loyalty * 0.20 +

        state.momentum * 0.20
    );
}


/* ============================================================
   PROFILE
   ============================================================ */

function getFollowersProfile(
    database
) {

    const state =
        ensureFollowers(
            database
        );

    updateDerivedValues(
        database
    );

    const tier =
        getFollowerTier(
            state.followers
        );

    return {

        followers:
            state.followers,

        formattedFollowers:
            formatFollowers(
                state.followers
            ),

        tier:
            tier.id,

        tierLabel:
            tier.label,

        engagementRate:
            round(
                state.engagementRate
            ),

        engagement:
            round(
                state.engagement
            ),

        loyalty:
            round(
                state.loyalty
            ),

        reach:
            round(
                state.reach
            ),

        momentum:
            round(
                state.momentum
            ),

        weeklyGrowth:
            integer(
                state.weeklyGrowth
            ),

        growthRate:
            round(
                state.growthRate
            ),

        estimatedReach:
            calculateReach(
                database
            ),

        engagementScore:
            round(
                calculateEngagementScore(
                    database
                )
            ),

        socialPostPotential:
            round(
                getSocialPostPotential(
                    database
                )
            ),

        nextMilestone:
            getNextFollowerMilestone(
                database
            ),

        components: {
            ...state.components
        },

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
   FORMAT
   ============================================================ */

function formatFollowers(
    followers
) {

    const value =
        Math.max(
            0,
            integer(followers)
        );

    if (
        value < 1000
    ) {

        return String(
            value
        );
    }

    if (
        value < 1000000
    ) {

        return `${round(
            value / 1000,
            1
        )}K`;
    }

    if (
        value < 1000000000
    ) {

        return `${round(
            value / 1000000,
            1
        )}M`;
    }

    return `${round(
        value / 1000000000,
        2
    )}B`;
}


/* ============================================================
   HISTORY
   ============================================================ */

function getFollowersHistory(
    database,
    limit = 50
) {

    const state =
        ensureFollowers(
            database
        );

    const amount =
        Math.max(
            1,
            integer(limit)
        );

    return state.history
        .slice(-amount)
        .reverse()
        .map(
            item => ({
                ...item
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
        ensureFollowers(
            database
        );

    const amount =
        Math.max(
            1,
            integer(limit)
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

function getFollowersStatistics(
    database
) {

    const state =
        ensureFollowers(
            database
        );

    return {

        ...state.statistics,

        currentFollowers:
            state.followers,

        formattedFollowers:
            formatFollowers(
                state.followers
            ),

        tier:
            getFollowerTierLabel(
                database
            ),

        engagement:
            round(
                state.engagement
            ),

        loyalty:
            round(
                state.loyalty
            ),

        reach:
            round(
                state.reach
            ),

        momentum:
            round(
                state.momentum
            ),

        growthRate:
            round(
                state.growthRate
            )
    };
}


/* ============================================================
   SNAPSHOT
   ============================================================ */

function createFollowersSnapshot(
    database
) {

    return {

        timestamp:
            nowISO(),

        ...getFollowersProfile(
            database
        )
    };
}


/* ============================================================
   VALIDATION
   ============================================================ */

function validateFollowers(
    database
) {

    try {

        const state =
            ensureFollowers(
                database
            );

        const problems = [];

        const numericFields = [

            "followers",

            "engagementRate",

            "growthRate",

            "momentum",

            "reach",

            "loyalty",

            "engagement"
        ];

        for (
            const field
            of numericFields
        ) {

            if (
                !Number.isFinite(
                    Number(
                        state[field]
                    )
                )
            ) {

                problems.push(
                    `Invalid value: ${field}`
                );
            }
        }

        if (
            state.followers < 0
        ) {

            problems.push(
                "Followers cannot be negative."
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
                state.milestones
            )
        ) {

            problems.push(
                "Milestones is not an array."
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

function resetFollowers(
    database
) {

    ensureDatabase(
        database
    );

    database.media.followers =
        createFollowersState();

    return database.media.followers;
}


/* ============================================================
   SUMMARY
   ============================================================ */

function getFollowersSummary(
    database
) {

    const profile =
        getFollowersProfile(
            database
        );

    return {

        followers:
            profile.followers,

        formattedFollowers:
            profile.formattedFollowers,

        tier:
            profile.tierLabel,

        engagement:
            profile.engagement,

        loyalty:
            profile.loyalty,

        reach:
            profile.reach,

        momentum:
            profile.momentum,

        weeklyGrowth:
            profile.weeklyGrowth,

        growthRate:
            profile.growthRate,

        estimatedReach:
            profile.estimatedReach,

        engagementScore:
            profile.engagementScore,

        socialPostPotential:
            profile.socialPostPotential,

        nextMilestone:
            profile.nextMilestone
    };
}


/* ============================================================
   DEFAULT EXPORT
   ============================================================ */

const FollowersEngine = {

    FOLLOWERS_VERSION,

    FOLLOWERS_CONFIG,

    createFollowersState,

    ensureFollowers,

    getPopularityInput,

    getFameInput,

    getReputationInput,

    getPersonaInput,

    getPerformanceInput,

    getActivityInput,

    getMomentumInput,

    calculateComponents,

    calculateGrowthRate,

    processWeeklyGrowth,

    addFollowers,

    removeFollowers,

    recordHistory,

    updateDerivedValues,

    checkMilestones,

    processFight,

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

    processInactivity,

    processControversy,

    processScandal,

    processBadLoss,

    getFollowerTier,

    getFollowerTierLabel,

    getNextFollowerMilestone,

    calculateEngagementScore,

    calculateReach,

    getSocialPostPotential,

    getFollowersProfile,

    formatFollowers,

    getFollowersHistory,

    getViralMoments,

    getFollowersStatistics,

    createFollowersSnapshot,

    validateFollowers,

    resetFollowers,

    getFollowersSummary
};


/* ============================================================
   NAMED EXPORTS
   ============================================================ */

export {

    FOLLOWERS_VERSION,

    FOLLOWERS_CONFIG,

    createFollowersState,

    ensureFollowers,

    getPopularityInput,

    getFameInput,

    getReputationInput,

    getPersonaInput,

    getPerformanceInput,

    getActivityInput,

    getMomentumInput,

    calculateComponents,

    calculateGrowthRate,

    processWeeklyGrowth,

    addFollowers,

    removeFollowers,

    recordHistory,

    updateDerivedValues,

    checkMilestones,

    processFight,

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

    processInactivity,

    processControversy,

    processScandal,

    processBadLoss,

    getFollowerTier,

    getFollowerTierLabel,

    getNextFollowerMilestone,

    calculateEngagementScore,

    calculateReach,

    getSocialPostPotential,

    getFollowersProfile,

    formatFollowers,

    getFollowersHistory,

    getViralMoments,

    getFollowersStatistics,

    createFollowersSnapshot,

    validateFollowers,

    resetFollowers,

    getFollowersSummary
};


export default FollowersEngine;
