/* ============================================================
   MMA LIFE DYNASTY
   MEDIA — REPUTATION ENGINE
   ============================================================

   Responsável por:
   - Reputação geral do lutador
   - Profissionalismo
   - Respeito
   - Disciplina
   - Fair play / espírito esportivo
   - Confiança do público
   - Confiança das organizações
   - Confiança da equipe
   - Vitórias e derrotas
   - Títulos
   - Rivalidades
   - Polêmicas
   - Entrevistas
   - Redes sociais
   - Contratos
   - Inatividade
   - Aposentadoria
   - Prêmios
   - Histórico
   - Estatísticas

   Arquivo independente para evitar dependências circulares.
   ============================================================ */

const REPUTATION_VERSION = 1;

const REPUTATION_CONFIG = {
    min: 0,
    max: 100,

    defaults: {
        reputation: 50,
        professionalism: 50,
        respect: 50,
        discipline: 50,
        sportsmanship: 50,
        publicTrust: 50,
        organizationTrust: 50,
        teamTrust: 50
    },

    decay: {
        inactivity: -0.15,
        retirement: 0,
        controversyRecovery: 0.10
    },

    fightImpact: {
        win: 1.5,
        loss: -0.5,
        draw: 0.2,
        noContest: -0.2
    },

    titleImpact: {
        win: 4,
        defense: 2,
        loss: -1
    },

    levels: [
        {
            id: "disgraced",
            label: "Desacreditado",
            min: 0
        },
        {
            id: "poor",
            label: "Má Reputação",
            min: 20
        },
        {
            id: "average",
            label: "Reputação Regular",
            min: 40
        },
        {
            id: "respected",
            label: "Respeitado",
            min: 60
        },
        {
            id: "highly_respected",
            label: "Muito Respeitado",
            min: 75
        },
        {
            id: "legendary",
            label: "Reputação Lendária",
            min: 90
        }
    ]
};


/* ============================================================
   INTERNAL HELPERS
   ============================================================ */

function clamp(value, min = 0, max = 100) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return min;
    }

    return Math.max(min, Math.min(max, number));
}

function round(value, decimals = 2) {
    const factor = 10 ** decimals;
    return Math.round(Number(value) * factor) / factor;
}

function nowISO() {
    return new Date().toISOString();
}

function ensureDatabase(database) {
    if (!database || typeof database !== "object") {
        throw new Error("Reputation Engine: database inválido.");
    }

    if (!database.media || typeof database.media !== "object") {
        database.media = {};
    }

    return database;
}

function ensureHistory(database) {
    ensureDatabase(database);

    if (!Array.isArray(database.media.reputationHistory)) {
        database.media.reputationHistory = [];
    }

    return database.media.reputationHistory;
}

function ensureStatistics(database) {
    ensureDatabase(database);

    if (!database.media.reputationStatistics) {
        database.media.reputationStatistics = {
            totalChanges: 0,
            positiveChanges: 0,
            negativeChanges: 0,
            fights: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            controversies: 0,
            positiveActions: 0,
            negativeActions: 0,
            titleWins: 0,
            titleDefenses: 0,
            titleLosses: 0
        };
    }

    return database.media.reputationStatistics;
}

function createHistoryEntry(type, amount, reason, before, after, extra = {}) {
    return {
        id: `rep_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
        timestamp: nowISO(),
        type,
        amount: round(amount),
        reason: reason || "Unknown",
        before: round(before),
        after: round(after),
        ...extra
    };
}


/* ============================================================
   STATE
   ============================================================ */

function createReputationState() {
    return {
        version: REPUTATION_VERSION,

        reputation: REPUTATION_CONFIG.defaults.reputation,
        professionalism: REPUTATION_CONFIG.defaults.professionalism,
        respect: REPUTATION_CONFIG.defaults.respect,
        discipline: REPUTATION_CONFIG.defaults.discipline,
        sportsmanship: REPUTATION_CONFIG.defaults.sportsmanship,
        publicTrust: REPUTATION_CONFIG.defaults.publicTrust,
        organizationTrust: REPUTATION_CONFIG.defaults.organizationTrust,
        teamTrust: REPUTATION_CONFIG.defaults.teamTrust,

        level: "average",

        history: [],
        statistics: {
            totalChanges: 0,
            positiveChanges: 0,
            negativeChanges: 0,
            fights: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            controversies: 0,
            positiveActions: 0,
            negativeActions: 0,
            titleWins: 0,
            titleDefenses: 0,
            titleLosses: 0
        },

        lastChange: null,
        lastEvent: null
    };
}


/* ============================================================
   ENSURE
   ============================================================ */

function ensureReputation(database) {
    ensureDatabase(database);

    if (!database.media.reputation ||
        typeof database.media.reputation !== "object") {

        database.media.reputation = createReputationState();
    }

    const state = database.media.reputation;

    for (const key of Object.keys(REPUTATION_CONFIG.defaults)) {
        if (!Number.isFinite(Number(state[key]))) {
            state[key] = REPUTATION_CONFIG.defaults[key];
        }

        state[key] = clamp(state[key]);
    }

    if (!Array.isArray(state.history)) {
        state.history = [];
    }

    if (!state.statistics || typeof state.statistics !== "object") {
        state.statistics = createReputationState().statistics;
    }

    state.level = getReputationLevel(state.reputation).id;

    return state;
}


/* ============================================================
   GETTERS
   ============================================================ */

function getReputation(database) {
    return ensureReputation(database).reputation;
}

function getProfessionalism(database) {
    return ensureReputation(database).professionalism;
}

function getRespect(database) {
    return ensureReputation(database).respect;
}

function getDiscipline(database) {
    return ensureReputation(database).discipline;
}

function getSportsmanship(database) {
    return ensureReputation(database).sportsmanship;
}

function getPublicTrust(database) {
    return ensureReputation(database).publicTrust;
}

function getOrganizationTrust(database) {
    return ensureReputation(database).organizationTrust;
}

function getTeamTrust(database) {
    return ensureReputation(database).teamTrust;
}


/* ============================================================
   LEVEL
   ============================================================ */

function getReputationLevel(value) {
    const score = clamp(value);

    let current = REPUTATION_CONFIG.levels[0];

    for (const level of REPUTATION_CONFIG.levels) {
        if (score >= level.min) {
            current = level;
        }
    }

    return {
        ...current,
        score
    };
}

function getReputationLevelLabel(database) {
    return getReputationLevel(getReputation(database)).label;
}


/* ============================================================
   SETTERS
   ============================================================ */

function setReputation(database, value, reason = "Manual adjustment") {
    ensureReputation(database);

    const state = database.media.reputation;

    const before = state.reputation;
    const after = clamp(value);
    const amount = after - before;

    state.reputation = after;
    state.level = getReputationLevel(after).id;

    recordChange(
        database,
        "reputation",
        amount,
        reason,
        before,
        after
    );

    return after;
}

function setProfessionalism(database, value, reason = "Manual adjustment") {
    return setMetric(
        database,
        "professionalism",
        value,
        reason
    );
}

function setRespect(database, value, reason = "Manual adjustment") {
    return setMetric(
        database,
        "respect",
        value,
        reason
    );
}

function setDiscipline(database, value, reason = "Manual adjustment") {
    return setMetric(
        database,
        "discipline",
        value,
        reason
    );
}

function setSportsmanship(database, value, reason = "Manual adjustment") {
    return setMetric(
        database,
        "sportsmanship",
        value,
        reason
    );
}

function setPublicTrust(database, value, reason = "Manual adjustment") {
    return setMetric(
        database,
        "publicTrust",
        value,
        reason
    );
}

function setOrganizationTrust(database, value, reason = "Manual adjustment") {
    return setMetric(
        database,
        "organizationTrust",
        value,
        reason
    );
}

function setTeamTrust(database, value, reason = "Manual adjustment") {
    return setMetric(
        database,
        "teamTrust",
        value,
        reason
    );
}


/* ============================================================
   METRIC ENGINE
   ============================================================ */

function setMetric(database, metric, value, reason) {
    ensureReputation(database);

    const state = database.media.reputation;

    if (!(metric in REPUTATION_CONFIG.defaults)) {
        throw new Error(`Reputation Engine: métrica inválida: ${metric}`);
    }

    const before = state[metric];
    const after = clamp(value);
    const amount = after - before;

    state[metric] = after;

    recordChange(
        database,
        metric,
        amount,
        reason,
        before,
        after
    );

    return after;
}

function addMetric(database, metric, amount, reason) {
    ensureReputation(database);

    const current = database.media.reputation[metric];

    return setMetric(
        database,
        metric,
        current + Number(amount || 0),
        reason
    );
}

function addReputation(database, amount, reason = "Reputation change") {
    const current = getReputation(database);

    return setReputation(
        database,
        current + Number(amount || 0),
        reason
    );
}


/* ============================================================
   HISTORY
   ============================================================ */

function recordChange(
    database,
    type,
    amount,
    reason,
    before,
    after,
    extra = {}
) {
    const state = ensureReputation(database);
    const history = ensureHistory(database);
    const statistics = ensureStatistics(database);

    const entry = createHistoryEntry(
        type,
        amount,
        reason,
        before,
        after,
        extra
    );

    history.push(entry);

    if (history.length > 500) {
        history.splice(0, history.length - 500);
    }

    statistics.totalChanges++;

    if (amount > 0) {
        statistics.positiveChanges++;
    }

    if (amount < 0) {
        statistics.negativeChanges++;
    }

    state.lastChange = entry;
    state.lastEvent = entry;

    return entry;
}


/* ============================================================
   POSITIVE / NEGATIVE BEHAVIOR
   ============================================================ */

function positiveBehavior(
    database,
    amount = 2,
    reason = "Positive behavior"
) {
    const state = ensureReputation(database);

    const value = Number(amount);

    addMetric(database, "professionalism", value, reason);
    addMetric(database, "respect", value * 0.8, reason);
    addMetric(database, "sportsmanship", value, reason);
    addMetric(database, "publicTrust", value * 0.7, reason);
    addReputation(database, value, reason);

    state.statistics.positiveActions++;

    return getReputationProfile(database);
}

function negativeBehavior(
    database,
    amount = 2,
    reason = "Negative behavior"
) {
    const state = ensureReputation(database);

    const value = Math.abs(Number(amount));

    addMetric(database, "professionalism", -value, reason);
    addMetric(database, "respect", -value * 0.8, reason);
    addMetric(database, "sportsmanship", -value, reason);
    addMetric(database, "publicTrust", -value * 0.7, reason);
    addReputation(database, -value, reason);

    state.statistics.negativeActions++;

    return getReputationProfile(database);
}


/* ============================================================
   FIGHT IMPACT
   ============================================================ */

function processFightResult(
    database,
    result,
    options = {}
) {
    const state = ensureReputation(database);
    const statistics = ensureStatistics(database);

    const normalized = String(result || "").toLowerCase();

    let reputationChange = 0;

    if (
        normalized === "win" ||
        normalized === "won" ||
        normalized === "victory"
    ) {
        reputationChange = REPUTATION_CONFIG.fightImpact.win;
        statistics.wins++;
    } else if (
        normalized === "loss" ||
        normalized === "lost" ||
        normalized === "defeat"
    ) {
        reputationChange = REPUTATION_CONFIG.fightImpact.loss;
        statistics.losses++;
    } else if (
        normalized === "draw"
    ) {
        reputationChange = REPUTATION_CONFIG.fightImpact.draw;
        statistics.draws++;
    } else if (
        normalized === "nc" ||
        normalized === "no_contest"
    ) {
        reputationChange = REPUTATION_CONFIG.fightImpact.noContest;
    }

    statistics.fights++;

    const opponentReputation = Number(
        options.opponentReputation || 50
    );

    if (opponentReputation >= 80 && normalized.includes("win")) {
        reputationChange += 1.5;
    } else if (opponentReputation >= 65 && normalized.includes("win")) {
        reputationChange += 0.75;
    }

    const method = String(options.method || "").toLowerCase();

    if (
        normalized.includes("win") &&
        (
            method.includes("submission") ||
            method.includes("ko") ||
            method.includes("tko")
        )
    ) {
        reputationChange += 0.25;
    }

    addReputation(
        database,
        reputationChange,
        options.reason || `Fight result: ${result}`
    );

    if (normalized.includes("win")) {
        addMetric(
            database,
            "respect",
            1,
            "Fight victory"
        );

        addMetric(
            database,
            "publicTrust",
            0.5,
            "Fight victory"
        );
    }

    if (normalized.includes("loss")) {
        addMetric(
            database,
            "publicTrust",
            -0.25,
            "Fight defeat"
        );
    }

    return getReputationProfile(database);
}


/* ============================================================
   TITLE EVENTS
   ============================================================ */

function processTitleWin(database, titleName = "Championship") {
    const state = ensureReputation(database);
    const statistics = ensureStatistics(database);

    statistics.titleWins++;

    addReputation(
        database,
        REPUTATION_CONFIG.titleImpact.win,
        `Won title: ${titleName}`
    );

    addMetric(
        database,
        "respect",
        3,
        `Won title: ${titleName}`
    );

    addMetric(
        database,
        "organizationTrust",
        2,
        `Won title: ${titleName}`
    );

    return getReputationProfile(database);
}

function processTitleDefense(database, titleName = "Championship") {
    const state = ensureReputation(database);
    const statistics = ensureStatistics(database);

    statistics.titleDefenses++;

    addReputation(
        database,
        REPUTATION_CONFIG.titleImpact.defense,
        `Defended title: ${titleName}`
    );

    addMetric(
        database,
        "respect",
        1.5,
        `Defended title: ${titleName}`
    );

    addMetric(
        database,
        "organizationTrust",
        1.5,
        `Defended title: ${titleName}`
    );

    return getReputationProfile(database);
}

function processTitleLoss(database, titleName = "Championship") {
    const statistics = ensureStatistics(database);

    statistics.titleLosses++;

    addReputation(
        database,
        REPUTATION_CONFIG.titleImpact.loss,
        `Lost title: ${titleName}`
    );

    return getReputationProfile(database);
}


/* ============================================================
   RIVALRIES
   ============================================================ */

function processRivalry(
    database,
    intensity = "medium",
    positive = true
) {
    let amount = 1;

    if (intensity === "low") {
        amount = 0.5;
    }

    if (intensity === "high") {
        amount = 2;
    }

    if (intensity === "extreme") {
        amount = 3;
    }

    if (!positive) {
        amount *= -1;
    }

    addMetric(
        database,
        "respect",
        amount,
        "Rivalry development"
    );

    addMetric(
        database,
        "publicTrust",
        amount * 0.5,
        "Rivalry development"
    );

    addReputation(
        database,
        amount * 0.5,
        "Rivalry development"
    );

    return getReputationProfile(database);
}


/* ============================================================
   CONTROVERSIES
   ============================================================ */

function processControversy(
    database,
    severity = "medium",
    reason = "Controversy"
) {
    const state = ensureReputation(database);
    const statistics = ensureStatistics(database);

    let penalty = 3;

    if (severity === "low") {
        penalty = 1.5;
    }

    if (severity === "high") {
        penalty = 6;
    }

    if (severity === "extreme") {
        penalty = 12;
    }

    statistics.controversies++;

    addReputation(
        database,
        -penalty,
        reason
    );

    addMetric(
        database,
        "publicTrust",
        -penalty * 1.25,
        reason
    );

    addMetric(
        database,
        "organizationTrust",
        -penalty * 0.75,
        reason
    );

    addMetric(
        database,
        "professionalism",
        -penalty * 0.5,
        reason
    );

    return getReputationProfile(database);
}


/* ============================================================
   INTERVIEWS
   ============================================================ */

function processInterview(
    database,
    tone = "professional"
) {
    switch (tone) {
        case "professional":
            return positiveBehavior(
                database,
                1.5,
                "Professional interview"
            );

        case "respectful":
            return positiveBehavior(
                database,
                2,
                "Respectful interview"
            );

        case "confident":
            addMetric(
                database,
                "respect",
                1,
                "Confident interview"
            );

            addMetric(
                database,
                "publicTrust",
                0.5,
                "Confident interview"
            );

            return getReputationProfile(database);

        case "trash_talk":
            addMetric(
                database,
                "respect",
                -0.5,
                "Aggressive trash talk"
            );

            addMetric(
                database,
                "publicTrust",
                0.5,
                "Aggressive trash talk"
            );

            addReputation(
                database,
                0.25,
                "Aggressive trash talk"
            );

            return getReputationProfile(database);

        case "disrespectful":
            return negativeBehavior(
                database,
                3,
                "Disrespectful interview"
            );

        case "controversial":
            return processControversy(
                database,
                "low",
                "Controversial interview"
            );

        default:
            return getReputationProfile(database);
    }
}


/* ============================================================
   SOCIAL MEDIA
   ============================================================ */

function processSocialConduct(
    database,
    conduct = "neutral"
) {
    switch (conduct) {
        case "positive":
            return positiveBehavior(
                database,
                1,
                "Positive social media conduct"
            );

        case "charity":
            return positiveBehavior(
                database,
                2.5,
                "Charity / community action"
            );

        case "professional":
            addMetric(
                database,
                "professionalism",
                1.5,
                "Professional social media conduct"
            );

            addMetric(
                database,
                "publicTrust",
                1,
                "Professional social media conduct"
            );

            return getReputationProfile(database);

        case "trash_talk":
            addMetric(
                database,
                "publicTrust",
                0.5,
                "Social media trash talk"
            );

            addMetric(
                database,
                "respect",
                -0.5,
                "Social media trash talk"
            );

            return getReputationProfile(database);

        case "toxic":
            return negativeBehavior(
                database,
                3,
                "Toxic social media conduct"
            );

        case "scandal":
            return processControversy(
                database,
                "high",
                "Social media scandal"
            );

        default:
            return getReputationProfile(database);
    }
}


/* ============================================================
   CONTRACT / PROFESSIONALISM
   ============================================================ */

function processContractBehavior(
    database,
    behavior = "professional"
) {
    switch (behavior) {
        case "professional":
            addMetric(
                database,
                "professionalism",
                2,
                "Professional contract behavior"
            );

            addMetric(
                database,
                "organizationTrust",
                1.5,
                "Professional contract behavior"
            );

            addReputation(
                database,
                1,
                "Professional contract behavior"
            );

            break;

        case "late":
            addMetric(
                database,
                "professionalism",
                -1,
                "Late contract obligation"
            );

            addMetric(
                database,
                "organizationTrust",
                -1,
                "Late contract obligation"
            );

            break;

        case "breach":
            addMetric(
                database,
                "professionalism",
                -5,
                "Contract breach"
            );

            addMetric(
                database,
                "organizationTrust",
                -7,
                "Contract breach"
            );

            addReputation(
                database,
                -4,
                "Contract breach"
            );

            break;

        case "refused":
            addMetric(
                database,
                "organizationTrust",
                -1,
                "Contract refusal"
            );

            break;
    }

    return getReputationProfile(database);
}


/* ============================================================
   INACTIVITY
   ============================================================ */

function processInactivity(database, weeks = 1) {
    const duration = Math.max(0, Number(weeks) || 0);

    if (duration <= 0) {
        return getReputationProfile(database);
    }

    const penalty =
        REPUTATION_CONFIG.decay.inactivity * duration;

    addReputation(
        database,
        penalty,
        `Inactivity: ${duration} week(s)`
    );

    addMetric(
        database,
        "publicTrust",
        penalty * 0.5,
        `Inactivity: ${duration} week(s)`
    );

    return getReputationProfile(database);
}


/* ============================================================
   RETIREMENT
   ============================================================ */

function processRetirement(database) {
    addMetric(
        database,
        "respect",
        1,
        "Retirement"
    );

    addMetric(
        database,
        "publicTrust",
        0.5,
        "Retirement"
    );

    return getReputationProfile(database);
}


/* ============================================================
   AWARDS
   ============================================================ */

function processAward(
    database,
    awardName = "Career Award",
    prestige = "medium"
) {
    let amount = 1;

    if (prestige === "low") {
        amount = 0.5;
    }

    if (prestige === "high") {
        amount = 3;
    }

    if (prestige === "legendary") {
        amount = 6;
    }

    addReputation(
        database,
        amount,
        `Award: ${awardName}`
    );

    addMetric(
        database,
        "respect",
        amount,
        `Award: ${awardName}`
    );

    return getReputationProfile(database);
}


/* ============================================================
   RECOVERY
   ============================================================ */

function recoverFromControversy(database, weeks = 1) {
    const duration = Math.max(0, Number(weeks) || 0);

    if (duration <= 0) {
        return getReputationProfile(database);
    }

    const recovery =
        REPUTATION_CONFIG.decay.controversyRecovery * duration;

    addReputation(
        database,
        recovery,
        `Reputation recovery: ${duration} week(s)`
    );

    addMetric(
        database,
        "publicTrust",
        recovery,
        `Reputation recovery: ${duration} week(s)`
    );

    return getReputationProfile(database);
}


/* ============================================================
   OVERALL SCORE
   ============================================================ */

function calculateReputationFromMetrics(database) {
    const state = ensureReputation(database);

    const score =
        state.professionalism * 0.18 +
        state.respect * 0.18 +
        state.discipline * 0.14 +
        state.sportsmanship * 0.14 +
        state.publicTrust * 0.16 +
        state.organizationTrust * 0.12 +
        state.teamTrust * 0.08;

    return clamp(score);
}

function syncOverallReputation(database) {
    const calculated = calculateReputationFromMetrics(database);

    return setReputation(
        database,
        calculated,
        "Reputation synchronized from metrics"
    );
}


/* ============================================================
   PROFILE
   ============================================================ */

function getReputationProfile(database) {
    const state = ensureReputation(database);
    const level = getReputationLevel(state.reputation);

    return {
        reputation: round(state.reputation),
        level: level.id,
        levelLabel: level.label,

        professionalism: round(state.professionalism),
        respect: round(state.respect),
        discipline: round(state.discipline),
        sportsmanship: round(state.sportsmanship),
        publicTrust: round(state.publicTrust),
        organizationTrust: round(state.organizationTrust),
        teamTrust: round(state.teamTrust),

        statistics: {
            ...state.statistics
        },

        lastChange: state.lastChange
    };
}


/* ============================================================
   COMPARISON
   ============================================================ */

function compareReputation(database, otherReputation) {
    const current = getReputation(database);
    const other = clamp(otherReputation);

    return {
        current,
        other,
        difference: round(current - other),
        stronger: current > other,
        weaker: current < other,
        equal: current === other
    };
}


/* ============================================================
   RANKING / PERCENTAGE
   ============================================================ */

function getReputationPercentage(database) {
    return round(
        (getReputation(database) / 100) * 100
    );
}

function getNextReputationLevel(database) {
    const current = getReputation(database);

    for (const level of REPUTATION_CONFIG.levels) {
        if (level.min > current) {
            return {
                id: level.id,
                label: level.label,
                required: level.min,
                remaining: round(level.min - current)
            };
        }
    }

    return null;
}


/* ============================================================
   SNAPSHOT
   ============================================================ */

function createReputationSnapshot(database) {
    const profile = getReputationProfile(database);

    return {
        timestamp: nowISO(),
        ...profile
    };
}


/* ============================================================
   HISTORY ACCESS
   ============================================================ */

function getReputationHistory(database, limit = 50) {
    const history = ensureHistory(database);

    const amount = Math.max(
        1,
        Math.floor(Number(limit) || 50)
    );

    return history
        .slice(-amount)
        .reverse()
        .map(entry => ({ ...entry }));
}

function getPositiveHistory(database) {
    return getReputationHistory(database, 500)
        .filter(entry => entry.amount > 0);
}

function getNegativeHistory(database) {
    return getReputationHistory(database, 500)
        .filter(entry => entry.amount < 0);
}


/* ============================================================
   STATISTICS
   ============================================================ */

function getReputationStatistics(database) {
    const statistics = ensureStatistics(database);

    return {
        ...statistics,
        currentReputation: getReputation(database),
        level: getReputationLevelLabel(database)
    };
}


/* ============================================================
   VALIDATION
   ============================================================ */

function validateReputation(database) {
    try {
        const state = ensureReputation(database);

        const problems = [];

        for (const metric of Object.keys(REPUTATION_CONFIG.defaults)) {
            if (
                !Number.isFinite(
                    Number(state[metric])
                )
            ) {
                problems.push(
                    `Invalid metric: ${metric}`
                );
            }

            if (
                Number(state[metric]) < 0 ||
                Number(state[metric]) > 100
            ) {
                problems.push(
                    `Metric outside range: ${metric}`
                );
            }
        }

        if (!Array.isArray(state.history)) {
            problems.push("History is not an array.");
        }

        if (!state.statistics) {
            problems.push("Statistics missing.");
        }

        return {
            valid: problems.length === 0,
            problems
        };

    } catch (error) {
        return {
            valid: false,
            problems: [error.message]
        };
    }
}


/* ============================================================
   RESET
   ============================================================ */

function resetReputation(database) {
    ensureDatabase(database);

    database.media.reputation =
        createReputationState();

    return database.media.reputation;
}


/* ============================================================
   SUMMARY
   ============================================================ */

function getReputationSummary(database) {
    const profile = getReputationProfile(database);

    return {
        score: profile.reputation,
        level: profile.levelLabel,

        strongestAreas: [
            {
                name: "Professionalism",
                value: profile.professionalism
            },
            {
                name: "Respect",
                value: profile.respect
            },
            {
                name: "Discipline",
                value: profile.discipline
            },
            {
                name: "Sportsmanship",
                value: profile.sportsmanship
            },
            {
                name: "Public Trust",
                value: profile.publicTrust
            },
            {
                name: "Organization Trust",
                value: profile.organizationTrust
            },
            {
                name: "Team Trust",
                value: profile.teamTrust
            }
        ]
            .sort((a, b) => b.value - a.value)
            .slice(0, 3),

        weakestAreas: [
            {
                name: "Professionalism",
                value: profile.professionalism
            },
            {
                name: "Respect",
                value: profile.respect
            },
            {
                name: "Discipline",
                value: profile.discipline
            },
            {
                name: "Sportsmanship",
                value: profile.sportsmanship
            },
            {
                name: "Public Trust",
                value: profile.publicTrust
            },
            {
                name: "Organization Trust",
                value: profile.organizationTrust
            },
            {
                name: "Team Trust",
                value: profile.teamTrust
            }
        ]
            .sort((a, b) => a.value - b.value)
            .slice(0, 3),

        statistics: profile.statistics
    };
}


/* ============================================================
   DEFAULT EXPORT
   ============================================================ */

const ReputationEngine = {
    REPUTATION_VERSION,
    REPUTATION_CONFIG,

    createReputationState,
    ensureReputation,

    getReputation,
    getProfessionalism,
    getRespect,
    getDiscipline,
    getSportsmanship,
    getPublicTrust,
    getOrganizationTrust,
    getTeamTrust,

    getReputationLevel,
    getReputationLevelLabel,

    setReputation,
    setProfessionalism,
    setRespect,
    setDiscipline,
    setSportsmanship,
    setPublicTrust,
    setOrganizationTrust,
    setTeamTrust,

    addReputation,
    addMetric,

    positiveBehavior,
    negativeBehavior,

    processFightResult,

    processTitleWin,
    processTitleDefense,
    processTitleLoss,

    processRivalry,
    processControversy,

    processInterview,
    processSocialConduct,

    processContractBehavior,

    processInactivity,
    processRetirement,
    recoverFromControversy,

    processAward,

    calculateReputationFromMetrics,
    syncOverallReputation,

    getReputationProfile,
    getReputationSummary,

    compareReputation,
    getReputationPercentage,
    getNextReputationLevel,

    createReputationSnapshot,

    getReputationHistory,
    getPositiveHistory,
    getNegativeHistory,

    getReputationStatistics,

    validateReputation,
    resetReputation
};


/* ============================================================
   NAMED EXPORTS
   ============================================================ */

export {
    REPUTATION_VERSION,
    REPUTATION_CONFIG,

    createReputationState,
    ensureReputation,

    getReputation,
    getProfessionalism,
    getRespect,
    getDiscipline,
    getSportsmanship,
    getPublicTrust,
    getOrganizationTrust,
    getTeamTrust,

    getReputationLevel,
    getReputationLevelLabel,

    setReputation,
    setProfessionalism,
    setRespect,
    setDiscipline,
    setSportsmanship,
    setPublicTrust,
    setOrganizationTrust,
    setTeamTrust,

    addReputation,
    addMetric,

    positiveBehavior,
    negativeBehavior,

    processFightResult,

    processTitleWin,
    processTitleDefense,
    processTitleLoss,

    processRivalry,
    processControversy,

    processInterview,
    processSocialConduct,

    processContractBehavior,

    processInactivity,
    processRetirement,
    recoverFromControversy,

    processAward,

    calculateReputationFromMetrics,
    syncOverallReputation,

    getReputationProfile,
    getReputationSummary,

    compareReputation,
    getReputationPercentage,
    getNextReputationLevel,

    createReputationSnapshot,

    getReputationHistory,
    getPositiveHistory,
    getNegativeHistory,

    getReputationStatistics,

    validateReputation,
    resetReputation
};

export default ReputationEngine;
