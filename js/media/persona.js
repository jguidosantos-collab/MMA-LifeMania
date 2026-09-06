/* ============================================================
   MMA LIFE DYNASTY
   MEDIA — PERSONA ENGINE
   ============================================================

   Responsável por:
   - Persona pública do lutador
   - Arquétipo de personalidade pública
   - Carisma
   - Agressividade promocional
   - Humildade
   - Confiança
   - Polêmica
   - Conexão com fãs
   - Apelo comercial
   - Apelo midiático
   - Imagem profissional
   - Evolução da persona ao longo da carreira
   - Histórico de mudanças
   - Compatibilidade com mídia, patrocinadores e rivalidades

   Arquivo independente para reduzir dependências circulares.
   ============================================================ */

const PERSONA_VERSION = 1;

const PERSONA_CONFIG = {
    min: 0,
    max: 100,

    defaults: {
        charisma: 50,
        confidence: 50,
        humility: 50,
        aggression: 50,
        showmanship: 50,
        controversy: 20,
        fanConnection: 50,
        professionalism: 50,
        mediaAppeal: 50,
        commercialAppeal: 50
    },

    archetypes: [
        {
            id: "hero",
            label: "Herói",
            description: "Lutador carismático, competitivo e querido pelo público.",
            requirements: {
                charisma: 60,
                humility: 55,
                fanConnection: 65
            }
        },
        {
            id: "villain",
            label: "Vilão",
            description: "Lutador provocador que gera rejeição e atenção.",
            requirements: {
                aggression: 65,
                showmanship: 60,
                controversy: 50
            }
        },
        {
            id: "showman",
            label: "Showman",
            description: "Lutador extremamente voltado para entretenimento e espetáculo.",
            requirements: {
                charisma: 70,
                showmanship: 70,
                mediaAppeal: 65
            }
        },
        {
            id: "warrior",
            label: "Guerreiro",
            description: "Atleta conhecido principalmente pela intensidade e competitividade.",
            requirements: {
                aggression: 65,
                confidence: 65,
                professionalism: 55
            }
        },
        {
            id: "professional",
            label: "Profissional",
            description: "Atleta disciplinado, respeitoso e confiável.",
            requirements: {
                professionalism: 75,
                humility: 60,
                fanConnection: 50
            }
        },
        {
            id: "star",
            label: "Superstar",
            description: "Personalidade completa com grande apelo comercial e midiático.",
            requirements: {
                charisma: 75,
                confidence: 70,
                fanConnection: 75,
                mediaAppeal: 75,
                commercialAppeal: 75
            }
        },
        {
            id: "cult_figure",
            label: "Figura Cult",
            description: "Lutador com uma identidade única e uma base de fãs extremamente fiel.",
            requirements: {
                fanConnection: 80,
                showmanship: 60,
                charisma: 60
            }
        },
        {
            id: "quiet_assassin",
            label: "Assassino Silencioso",
            description: "Lutador reservado, confiante e conhecido por falar pouco e lutar muito.",
            requirements: {
                confidence: 70,
                aggression: 65,
                controversy: 15
            }
        },
        {
            id: "underdog",
            label: "Underdog",
            description: "Lutador que conquista o público através de superação e resiliência.",
            requirements: {
                humility: 70,
                fanConnection: 70,
                professionalism: 60
            }
        }
    ],

    behaviorImpact: {
        respectful: {
            humility: 1.5,
            professionalism: 1,
            fanConnection: 1
        },

        confident: {
            confidence: 1.5,
            mediaAppeal: 0.75
        },

        aggressive: {
            aggression: 2,
            showmanship: 0.75,
            controversy: 1
        },

        humble: {
            humility: 2,
            fanConnection: 1.5,
            commercialAppeal: 0.5
        },

        charismatic: {
            charisma: 2,
            fanConnection: 1.5,
            mediaAppeal: 1
        },

        controversial: {
            controversy: 3,
            mediaAppeal: 1,
            fanConnection: -0.5
        },

        professional: {
            professionalism: 2,
            commercialAppeal: 1,
            mediaAppeal: 0.5
        },

        toxic: {
            aggression: 2,
            controversy: 4,
            professionalism: -3,
            fanConnection: -2,
            commercialAppeal: -3
        }
    }
};


/* ============================================================
   HELPERS
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

    return Math.round(
        Number(value) * factor
    ) / factor;
}

function nowISO() {
    return new Date().toISOString();
}

function ensureDatabase(database) {
    if (!database || typeof database !== "object") {
        throw new Error("Persona Engine: database inválido.");
    }

    if (!database.media || typeof database.media !== "object") {
        database.media = {};
    }

    return database;
}


/* ============================================================
   STATE
   ============================================================ */

function createPersonaState() {
    return {
        version: PERSONA_VERSION,

        archetype: "professional",

        charisma: PERSONA_CONFIG.defaults.charisma,
        confidence: PERSONA_CONFIG.defaults.confidence,
        humility: PERSONA_CONFIG.defaults.humility,
        aggression: PERSONA_CONFIG.defaults.aggression,
        showmanship: PERSONA_CONFIG.defaults.showmanship,
        controversy: PERSONA_CONFIG.defaults.controversy,
        fanConnection: PERSONA_CONFIG.defaults.fanConnection,
        professionalism: PERSONA_CONFIG.defaults.professionalism,
        mediaAppeal: PERSONA_CONFIG.defaults.mediaAppeal,
        commercialAppeal: PERSONA_CONFIG.defaults.commercialAppeal,

        slogan: "",
        nickname: "",

        history: [],
        behaviorHistory: [],

        statistics: {
            positiveBehaviors: 0,
            negativeBehaviors: 0,
            controversialMoments: 0,
            interviews: 0,
            socialPosts: 0,
            viralMoments: 0,
            fanMilestones: 0,
            archetypeChanges: 0
        },

        lastChange: null,
        lastBehavior: null
    };
}


/* ============================================================
   ENSURE
   ============================================================ */

function ensurePersona(database) {
    ensureDatabase(database);

    if (
        !database.media.persona ||
        typeof database.media.persona !== "object"
    ) {
        database.media.persona = createPersonaState();
    }

    const state = database.media.persona;

    for (
        const key of Object.keys(PERSONA_CONFIG.defaults)
    ) {
        if (!Number.isFinite(Number(state[key]))) {
            state[key] =
                PERSONA_CONFIG.defaults[key];
        }

        state[key] = clamp(state[key]);
    }

    if (!Array.isArray(state.history)) {
        state.history = [];
    }

    if (!Array.isArray(state.behaviorHistory)) {
        state.behaviorHistory = [];
    }

    if (
        !state.statistics ||
        typeof state.statistics !== "object"
    ) {
        state.statistics =
            createPersonaState().statistics;
    }

    if (!state.archetype) {
        state.archetype = "professional";
    }

    return state;
}


/* ============================================================
   GETTERS
   ============================================================ */

function getPersona(database) {
    return ensurePersona(database);
}

function getCharisma(database) {
    return ensurePersona(database).charisma;
}

function getConfidence(database) {
    return ensurePersona(database).confidence;
}

function getHumility(database) {
    return ensurePersona(database).humility;
}

function getAggression(database) {
    return ensurePersona(database).aggression;
}

function getShowmanship(database) {
    return ensurePersona(database).showmanship;
}

function getControversy(database) {
    return ensurePersona(database).controversy;
}

function getFanConnection(database) {
    return ensurePersona(database).fanConnection;
}

function getProfessionalism(database) {
    return ensurePersona(database).professionalism;
}

function getMediaAppeal(database) {
    return ensurePersona(database).mediaAppeal;
}

function getCommercialAppeal(database) {
    return ensurePersona(database).commercialAppeal;
}

function getArchetype(database) {
    return ensurePersona(database).archetype;
}


/* ============================================================
   SETTERS
   ============================================================ */

function setMetric(
    database,
    metric,
    value,
    reason = "Persona adjustment"
) {
    const state = ensurePersona(database);

    if (
        !Object.prototype.hasOwnProperty.call(
            PERSONA_CONFIG.defaults,
            metric
        )
    ) {
        throw new Error(
            `Persona Engine: métrica inválida: ${metric}`
        );
    }

    const before = state[metric];
    const after = clamp(value);
    const amount = after - before;

    state[metric] = after;

    const entry = {
        id:
            `persona_${Date.now()}_` +
            `${Math.floor(Math.random() * 100000)}`,

        timestamp: nowISO(),

        type: metric,

        amount: round(amount),

        reason,

        before: round(before),

        after: round(after)
    };

    state.history.push(entry);

    if (state.history.length > 500) {
        state.history.splice(
            0,
            state.history.length - 500
        );
    }

    state.lastChange = entry;

    return after;
}

function addMetric(
    database,
    metric,
    amount,
    reason = "Persona change"
) {
    const state = ensurePersona(database);

    return setMetric(
        database,
        metric,
        state[metric] + Number(amount || 0),
        reason
    );
}


/* ============================================================
   BEHAVIOR
   ============================================================ */

function applyBehavior(
    database,
    behavior,
    reason = null
) {
    const state = ensurePersona(database);

    const impact =
        PERSONA_CONFIG.behaviorImpact[behavior];

    if (!impact) {
        throw new Error(
            `Persona Engine: comportamento inválido: ${behavior}`
        );
    }

    let totalPositive = 0;
    let totalNegative = 0;

    for (const [metric, amount] of Object.entries(impact)) {
        addMetric(
            database,
            metric,
            amount,
            reason ||
                `Behavior: ${behavior}`
        );

        if (amount > 0) {
            totalPositive += amount;
        } else if (amount < 0) {
            totalNegative += Math.abs(amount);
        }
    }

    if (totalPositive >= totalNegative) {
        state.statistics.positiveBehaviors++;
    } else {
        state.statistics.negativeBehaviors++;
    }

    const entry = {
        id:
            `behavior_${Date.now()}_` +
            `${Math.floor(Math.random() * 100000)}`,

        timestamp: nowISO(),

        behavior,

        reason:
            reason ||
            `Behavior: ${behavior}`,

        impact: {
            ...impact
        }
    };

    state.behaviorHistory.push(entry);

    if (state.behaviorHistory.length > 300) {
        state.behaviorHistory.splice(
            0,
            state.behaviorHistory.length - 300
        );
    }

    state.lastBehavior = entry;

    updateArchetype(database);

    return getPersonaProfile(database);
}


/* ============================================================
   INTERVIEW
   ============================================================ */

function processInterview(
    database,
    style = "professional"
) {
    const state = ensurePersona(database);

    state.statistics.interviews++;

    switch (style) {
        case "professional":
            return applyBehavior(
                database,
                "professional",
                "Professional interview"
            );

        case "charismatic":
            return applyBehavior(
                database,
                "charismatic",
                "Charismatic interview"
            );

        case "humble":
            return applyBehavior(
                database,
                "humble",
                "Humble interview"
            );

        case "confident":
            return applyBehavior(
                database,
                "confident",
                "Confident interview"
            );

        case "aggressive":
            return applyBehavior(
                database,
                "aggressive",
                "Aggressive interview"
            );

        case "controversial":
            return applyBehavior(
                database,
                "controversial",
                "Controversial interview"
            );

        case "toxic":
            return applyBehavior(
                database,
                "toxic",
                "Toxic interview"
            );

        default:
            return getPersonaProfile(database);
    }
}


/* ============================================================
   SOCIAL MEDIA
   ============================================================ */

function processSocialMedia(
    database,
    style = "neutral"
) {
    const state = ensurePersona(database);

    state.statistics.socialPosts++;

    switch (style) {
        case "positive":
            return applyBehavior(
                database,
                "humble",
                "Positive social media activity"
            );

        case "professional":
            return applyBehavior(
                database,
                "professional",
                "Professional social media activity"
            );

        case "charismatic":
            return applyBehavior(
                database,
                "charismatic",
                "Charismatic social media activity"
            );

        case "confident":
            return applyBehavior(
                database,
                "confident",
                "Confident social media activity"
            );

        case "trash_talk":
            return applyBehavior(
                database,
                "aggressive",
                "Trash talk on social media"
            );

        case "controversial":
            return applyBehavior(
                database,
                "controversial",
                "Controversial social media activity"
            );

        case "toxic":
            return applyBehavior(
                database,
                "toxic",
                "Toxic social media activity"
            );

        default:
            return getPersonaProfile(database);
    }
}


/* ============================================================
   VIRAL MOMENT
   ============================================================ */

function processViralMoment(
    database,
    type = "positive"
) {
    const state = ensurePersona(database);

    state.statistics.viralMoments++;

    if (type === "positive") {
        addMetric(
            database,
            "mediaAppeal",
            3,
            "Positive viral moment"
        );

        addMetric(
            database,
            "fanConnection",
            4,
            "Positive viral moment"
        );

        addMetric(
            database,
            "commercialAppeal",
            2,
            "Positive viral moment"
        );
    } else if (type === "controversial") {
        addMetric(
            database,
            "mediaAppeal",
            4,
            "Controversial viral moment"
        );

        addMetric(
            database,
            "controversy",
            5,
            "Controversial viral moment"
        );

        addMetric(
            database,
            "fanConnection",
            -1,
            "Controversial viral moment"
        );
    } else if (type === "negative") {
        addMetric(
            database,
            "mediaAppeal",
            1,
            "Negative viral moment"
        );

        addMetric(
            database,
            "fanConnection",
            -4,
            "Negative viral moment"
        );

        addMetric(
            database,
            "commercialAppeal",
            -3,
            "Negative viral moment"
        );
    }

    updateArchetype(database);

    return getPersonaProfile(database);
}


/* ============================================================
   FAN CONNECTION
   ============================================================ */

function processFanMilestone(
    database,
    milestone = "general"
) {
    const state = ensurePersona(database);

    state.statistics.fanMilestones++;

    addMetric(
        database,
        "fanConnection",
        1.5,
        `Fan milestone: ${milestone}`
    );

    addMetric(
        database,
        "commercialAppeal",
        0.75,
        `Fan milestone: ${milestone}`
    );

    return getPersonaProfile(database);
}


/* ============================================================
   FIGHT PERSONALITY IMPACT
   ============================================================ */

function processFightPersona(
    database,
    result,
    options = {}
) {
    const state = ensurePersona(database);

    const normalized =
        String(result || "").toLowerCase();

    if (
        normalized === "win" ||
        normalized === "won" ||
        normalized === "victory"
    ) {
        addMetric(
            database,
            "confidence",
            1,
            "Fight victory"
        );

        addMetric(
            database,
            "fanConnection",
            0.5,
            "Fight victory"
        );
    }

    if (
        normalized === "loss" ||
        normalized === "lost" ||
        normalized === "defeat"
    ) {
        addMetric(
            database,
            "confidence",
            -0.5,
            "Fight defeat"
        );
    }

    const method =
        String(options.method || "").toLowerCase();

    if (
        method.includes("ko") ||
        method.includes("tko")
    ) {
        addMetric(
            database,
            "aggression",
            0.5,
            "Highlight-reel finish"
        );

        addMetric(
            database,
            "showmanship",
            0.5,
            "Highlight-reel finish"
        );
    }

    if (options.underdogWin === true) {
        addMetric(
            database,
            "fanConnection",
            3,
            "Underdog victory"
        );

        addMetric(
            database,
            "humility",
            0.5,
            "Underdog victory"
        );
    }

    updateArchetype(database);

    return getPersonaProfile(database);
}


/* ============================================================
   TITLE IMPACT
   ============================================================ */

function processTitleWin(
    database,
    titleName = "Championship"
) {
    addMetric(
        database,
        "confidence",
        2,
        `Title win: ${titleName}`
    );

    addMetric(
        database,
        "showmanship",
        1,
        `Title win: ${titleName}`
    );

    addMetric(
        database,
        "fanConnection",
        2,
        `Title win: ${titleName}`
    );

    addMetric(
        database,
        "commercialAppeal",
        2,
        `Title win: ${titleName}`
    );

    updateArchetype(database);

    return getPersonaProfile(database);
}

function processTitleDefense(
    database,
    titleName = "Championship"
) {
    addMetric(
        database,
        "confidence",
        1,
        `Title defense: ${titleName}`
    );

    addMetric(
        database,
        "fanConnection",
        1,
        `Title defense: ${titleName}`
    );

    addMetric(
        database,
        "professionalism",
        0.5,
        `Title defense: ${titleName}`
    );

    updateArchetype(database);

    return getPersonaProfile(database);
}

function processTitleLoss(
    database,
    titleName = "Championship"
) {
    addMetric(
        database,
        "confidence",
        -1,
        `Title loss: ${titleName}`
    );

    updateArchetype(database);

    return getPersonaProfile(database);
}


/* ============================================================
   RIVALRY
   ============================================================ */

function processRivalry(
    database,
    intensity = "medium"
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

    addMetric(
        database,
        "showmanship",
        amount,
        "Rivalry development"
    );

    addMetric(
        database,
        "mediaAppeal",
        amount,
        "Rivalry development"
    );

    addMetric(
        database,
        "fanConnection",
        amount * 0.5,
        "Rivalry development"
    );

    updateArchetype(database);

    return getPersonaProfile(database);
}


/* ============================================================
   ARCHETYPE
   ============================================================ */

function calculateArchetypeScore(
    database,
    archetype
) {
    const state = ensurePersona(database);

    const requirements =
        archetype.requirements;

    let score = 0;
    let count = 0;

    for (
        const [metric, minimum] of
        Object.entries(requirements)
    ) {
        const value = state[metric];

        if (!Number.isFinite(Number(value))) {
            continue;
        }

        const ratio =
            clamp(
                (value / minimum) * 100,
                0,
                120
            );

        score += ratio;
        count++;
    }

    if (count === 0) {
        return 0;
    }

    return score / count;
}

function determineArchetype(database) {
    ensurePersona(database);

    let best = null;
    let bestScore = -Infinity;

    for (
        const archetype of
        PERSONA_CONFIG.archetypes
    ) {
        const score =
            calculateArchetypeScore(
                database,
                archetype
            );

        if (score > bestScore) {
            bestScore = score;
            best = archetype;
        }
    }

    if (!best) {
        return PERSONA_CONFIG.archetypes[0];
    }

    return {
        ...best,
        score: round(bestScore)
    };
}

function updateArchetype(database) {
    const state = ensurePersona(database);

    const determined =
        determineArchetype(database);

    const previous = state.archetype;

    if (previous !== determined.id) {
        state.statistics.archetypeChanges++;

        state.history.push({
            id:
                `archetype_${Date.now()}_` +
                `${Math.floor(Math.random() * 100000)}`,

            timestamp: nowISO(),

            type: "archetype_change",

            previous,

            current: determined.id,

            score: determined.score
        });
    }

    state.archetype = determined.id;

    return determined;
}


/* ============================================================
   ARCHETYPE INFO
   ============================================================ */

function getArchetypeInfo(database) {
    const state = ensurePersona(database);

    const archetype =
        PERSONA_CONFIG.archetypes.find(
            item => item.id === state.archetype
        );

    if (!archetype) {
        return null;
    }

    return {
        ...archetype,
        score:
            calculateArchetypeScore(
                database,
                archetype
            )
    };
}

function getAllArchetypes(database) {
    return PERSONA_CONFIG.archetypes
        .map(archetype => ({
            ...archetype,
            score:
                round(
                    calculateArchetypeScore(
                        database,
                        archetype
                    )
                )
        }))
        .sort(
            (a, b) =>
                b.score - a.score
        );
}


/* ============================================================
   BRANDING
   ============================================================ */

function setSlogan(
    database,
    slogan
) {
    const state = ensurePersona(database);

    state.slogan =
        String(slogan || "").trim();

    return state.slogan;
}

function setNickname(
    database,
    nickname
) {
    const state = ensurePersona(database);

    state.nickname =
        String(nickname || "").trim();

    return state.nickname;
}


/* ============================================================
   MARKETABILITY
   ============================================================ */

function calculateMarketability(database) {
    const state = ensurePersona(database);

    return round(
        state.charisma * 0.15 +
        state.confidence * 0.10 +
        state.showmanship * 0.15 +
        state.fanConnection * 0.20 +
        state.mediaAppeal * 0.20 +
        state.commercialAppeal * 0.20
    );
}

function calculateMediaAppeal(database) {
    const state = ensurePersona(database);

    return round(
        state.charisma * 0.20 +
        state.showmanship * 0.20 +
        state.confidence * 0.15 +
        state.controversy * 0.10 +
        state.fanConnection * 0.15 +
        state.mediaAppeal * 0.20
    );
}

function calculateCommercialAppeal(database) {
    const state = ensurePersona(database);

    return round(
        state.charisma * 0.15 +
        state.professionalism * 0.20 +
        state.humility * 0.10 +
        state.fanConnection * 0.25 +
        state.mediaAppeal * 0.10 +
        state.commercialAppeal * 0.20
    );
}


/* ============================================================
   PROFILE
   ============================================================ */

function getPersonaProfile(database) {
    const state = ensurePersona(database);
    const archetype = getArchetypeInfo(database);

    return {
        archetype: state.archetype,

        archetypeLabel:
            archetype
                ? archetype.label
                : "Unknown",

        archetypeDescription:
            archetype
                ? archetype.description
                : "",

        charisma:
            round(state.charisma),

        confidence:
            round(state.confidence),

        humility:
            round(state.humility),

        aggression:
            round(state.aggression),

        showmanship:
            round(state.showmanship),

        controversy:
            round(state.controversy),

        fanConnection:
            round(state.fanConnection),

        professionalism:
            round(state.professionalism),

        mediaAppeal:
            round(state.mediaAppeal),

        commercialAppeal:
            round(state.commercialAppeal),

        marketability:
            calculateMarketability(database),

        calculatedMediaAppeal:
            calculateMediaAppeal(database),

        calculatedCommercialAppeal:
            calculateCommercialAppeal(database),

        slogan: state.slogan,

        nickname: state.nickname,

        statistics: {
            ...state.statistics
        },

        lastChange:
            state.lastChange,

        lastBehavior:
            state.lastBehavior
    };
}


/* ============================================================
   SNAPSHOT
   ============================================================ */

function createPersonaSnapshot(database) {
    return {
        timestamp: nowISO(),
        ...getPersonaProfile(database)
    };
}


/* ============================================================
   HISTORY
   ============================================================ */

function getPersonaHistory(
    database,
    limit = 50
) {
    const state = ensurePersona(database);

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
        .map(item => ({
            ...item
        }));
}

function getBehaviorHistory(
    database,
    limit = 50
) {
    const state = ensurePersona(database);

    const amount =
        Math.max(
            1,
            Math.floor(
                Number(limit) || 50
            )
        );

    return state.behaviorHistory
        .slice(-amount)
        .reverse()
        .map(item => ({
            ...item
        }));
}


/* ============================================================
   STATISTICS
   ============================================================ */

function getPersonaStatistics(database) {
    const state = ensurePersona(database);

    return {
        ...state.statistics,

        currentArchetype:
            state.archetype,

        marketability:
            calculateMarketability(database),

        mediaAppeal:
            calculateMediaAppeal(database),

        commercialAppeal:
            calculateCommercialAppeal(database)
    };
}


/* ============================================================
   VALIDATION
   ============================================================ */

function validatePersona(database) {
    try {
        const state = ensurePersona(database);

        const problems = [];

        for (
            const metric of
            Object.keys(PERSONA_CONFIG.defaults)
        ) {
            const value =
                Number(state[metric]);

            if (!Number.isFinite(value)) {
                problems.push(
                    `Invalid metric: ${metric}`
                );
            }

            if (
                value < 0 ||
                value > 100
            ) {
                problems.push(
                    `Metric outside range: ${metric}`
                );
            }
        }

        if (!state.archetype) {
            problems.push(
                "Archetype missing."
            );
        }

        if (!Array.isArray(state.history)) {
            problems.push(
                "History is not an array."
            );
        }

        if (
            !Array.isArray(
                state.behaviorHistory
            )
        ) {
            problems.push(
                "Behavior history is not an array."
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

function resetPersona(database) {
    ensureDatabase(database);

    database.media.persona =
        createPersonaState();

    return database.media.persona;
}


/* ============================================================
   SUMMARY
   ============================================================ */

function getPersonaSummary(database) {
    const profile =
        getPersonaProfile(database);

    return {
        archetype:
            profile.archetypeLabel,

        marketability:
            profile.marketability,

        mediaAppeal:
            profile.calculatedMediaAppeal,

        commercialAppeal:
            profile.calculatedCommercialAppeal,

        strongestTraits: [
            {
                name: "Charisma",
                value: profile.charisma
            },
            {
                name: "Confidence",
                value: profile.confidence
            },
            {
                name: "Humility",
                value: profile.humility
            },
            {
                name: "Aggression",
                value: profile.aggression
            },
            {
                name: "Showmanship",
                value: profile.showmanship
            },
            {
                name: "Fan Connection",
                value: profile.fanConnection
            },
            {
                name: "Professionalism",
                value: profile.professionalism
            },
            {
                name: "Media Appeal",
                value: profile.mediaAppeal
            },
            {
                name: "Commercial Appeal",
                value: profile.commercialAppeal
            }
        ]
            .sort(
                (a, b) =>
                    b.value - a.value
            )
            .slice(0, 3),

        weakestTraits: [
            {
                name: "Charisma",
                value: profile.charisma
            },
            {
                name: "Confidence",
                value: profile.confidence
            },
            {
                name: "Humility",
                value: profile.humility
            },
            {
                name: "Aggression",
                value: profile.aggression
            },
            {
                name: "Showmanship",
                value: profile.showmanship
            },
            {
                name: "Fan Connection",
                value: profile.fanConnection
            },
            {
                name: "Professionalism",
                value: profile.professionalism
            },
            {
                name: "Media Appeal",
                value: profile.mediaAppeal
            },
            {
                name: "Commercial Appeal",
                value: profile.commercialAppeal
            }
        ]
            .sort(
                (a, b) =>
                    a.value - b.value
            )
            .slice(0, 3),

        statistics:
            profile.statistics
    };
}


/* ============================================================
   DEFAULT EXPORT
   ============================================================ */

const PersonaEngine = {
    PERSONA_VERSION,
    PERSONA_CONFIG,

    createPersonaState,
    ensurePersona,

    getPersona,

    getCharisma,
    getConfidence,
    getHumility,
    getAggression,
    getShowmanship,
    getControversy,
    getFanConnection,
    getProfessionalism,
    getMediaAppeal,
    getCommercialAppeal,
    getArchetype,

    setMetric,
    addMetric,

    applyBehavior,

    processInterview,
    processSocialMedia,
    processViralMoment,
    processFanMilestone,

    processFightPersona,

    processTitleWin,
    processTitleDefense,
    processTitleLoss,

    processRivalry,

    determineArchetype,
    updateArchetype,

    getArchetypeInfo,
    getAllArchetypes,

    setSlogan,
    setNickname,

    calculateMarketability,
    calculateMediaAppeal,
    calculateCommercialAppeal,

    getPersonaProfile,

    createPersonaSnapshot,

    getPersonaHistory,
    getBehaviorHistory,

    getPersonaStatistics,

    validatePersona,
    resetPersona,

    getPersonaSummary
};


/* ============================================================
   NAMED EXPORTS
   ============================================================ */

export {
    PERSONA_VERSION,
    PERSONA_CONFIG,

    createPersonaState,
    ensurePersona,

    getPersona,

    getCharisma,
    getConfidence,
    getHumility,
    getAggression,
    getShowmanship,
    getControversy,
    getFanConnection,
    getProfessionalism,
    getMediaAppeal,
    getCommercialAppeal,
    getArchetype,

    setMetric,
    addMetric,

    applyBehavior,

    processInterview,
    processSocialMedia,
    processViralMoment,
    processFanMilestone,

    processFightPersona,

    processTitleWin,
    processTitleDefense,
    processTitleLoss,

    processRivalry,

    determineArchetype,
    updateArchetype,

    getArchetypeInfo,
    getAllArchetypes,

    setSlogan,
    setNickname,

    calculateMarketability,
    calculateMediaAppeal,
    calculateCommercialAppeal,

    getPersonaProfile,

    createPersonaSnapshot,

    getPersonaHistory,
    getBehaviorHistory,

    getPersonaStatistics,

    validatePersona,
    resetPersona,

    getPersonaSummary
};

export default PersonaEngine;
