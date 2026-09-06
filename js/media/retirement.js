/*
============================================================
MMA LIFE DYNASTY
MEDIA — RETIREMENT
============================================================
Responsabilidade:
- Sistema de aposentadoria
- Aposentadoria voluntária
- Aposentadoria forçada
- Luta de despedida
- Última luta
- Tempo aposentado
- Possibilidade de comeback
- Convites para retorno
- Impacto em fama, reputação e legado
- Histórico de aposentadoria
- Vida pós-carreira
- Integração futura com DYNASTY / LEGACY
Arquivo:
js/media/retirement.js
IMPORTANTE:
- Arquivo independente
- Não depende de outros módulos
- Não executa aposentadoria automaticamente
- O Engine poderá chamar as funções quando necessário
============================================================
*/
const RETIREMENT_VERSION = 1;
const RETIREMENT_CONFIG = {
    minimumAge: 18,
    recommendedAge: 35,
    typicalAge: 40,
    maximumCareerAge: 55,
    comeback: {
        minimumRetirementWeeks: 8,
        maximumRetirementWeeks: 520,
        baseChance: 35,
        minimumFitness: 35,
        minimumHealth: 30
    },
    farewell: {
        fameBonus: 5,
        popularityBonus: 5,
        reputationBonus: 3
    },
    retirement: {
        fameBonus: 8,
        popularityBonus: 5,
        reputationBonus: 5,
        legacyBonus: 10
    },
    forcedRetirement: {
        famePenalty: -2,
        reputationPenalty: 0,
        popularityPenalty: -3,
        legacyBonus: 5
    },
    inactivity: {
        weeklyFameDecay: 1,
        weeklyPopularityDecay: 1,
        maximumDecayWeeks: 52
    }
};
const RETIREMENT_REASONS = {
    voluntary: "voluntary",
    age: "age",
    health: "health",
    injury: "injury",
    repeatedInjuries: "repeated_injuries",
    performance: "performance",
    personal: "personal",
    family: "family",
    financial: "financial",
    suspension: "suspension",
    forced: "forced",
    medical: "medical",
    legacy: "legacy",
    farewell: "farewell",
    other: "other"
};
const RETIREMENT_TYPES = {
    normal: "normal",
    forced: "forced",
    temporary: "temporary",
    permanent: "permanent"
};
const RETIREMENT_EVENTS = {
    retirement: "retirement",
    farewell: "farewell",
    finalFight: "final_fight",
    comebackOffer: "comeback_offer",
    comebackRequest: "comeback_request",
    comebackAccepted: "comeback_accepted",
    comebackRejected: "comeback_rejected",
    comeback: "comeback",
    inactivity: "inactivity",
    anniversary: "retirement_anniversary",
    legacy: "legacy"
};
const POST_CAREER_PATHS = {
    coach: "coach",
    manager: "manager",
    promoter: "promoter",
    commentator: "commentator",
    analyst: "analyst",
    gymOwner: "gym_owner",
    media: "media",
    businessman: "businessman",
    influencer: "influencer",
    celebrity: "celebrity",
    family: "family",
    retiredLife: "retired_life",
    other: "other"
};
function clamp(value, min = 0, max = 100) {
    return Math.max(
        min,
        Math.min(
            max,
            Number(value) || 0
        )
    );
}
function randomInt(min, max) {
    return Math.floor(
        Math.random() *
            (max - min + 1)
    ) + min;
}
function createId(prefix = "retirement") {
    return `${prefix}_${Date.now()}_${Math.floor(
        Math.random() * 1000000
    )}`;
}
function nowISO() {
    return new Date().toISOString();
}
function getDatabase(database) {
    if (
        database &&
        typeof database === "object"
    ) {
        return database;
    }
    if (
        typeof globalThis !== "undefined" &&
        globalThis.database
    ) {
        return globalThis.database;
    }
    return null;
}
function getPlayer(database) {
    const db = getDatabase(database);
    return db?.player || null;
}
function getPlayerId(database) {
    const player =
        getPlayer(database);
    if (!player) {
        return null;
    }
    return (
        player.id ||
        player.playerId ||
        player.characterId ||
        null
    );
}
function getPlayerName(database) {
    const player =
        getPlayer(database);
    if (!player) {
        return "Desconhecido";
    }
    return (
        player.name ||
        player.fullName ||
        player.displayName ||
        player.nickname ||
        "Desconhecido"
    );
}
function ensureMedia(database) {
    const db = getDatabase(database);
    if (!db) {
        return null;
    }
    if (!db.media) {
        db.media = {};
    }
    return db.media;
}
function createRetirementState() {
    return {
        version: RETIREMENT_VERSION,
        retired: false,
        retirementId: null,
        type: null,
        reason: null,
        reasonLabel: null,
        retiredAt: null,
        retirementDate: null,
        retirementAge: null,
        retirementWeek: null,
        retirementYear: null,
        weeksRetired: 0,
        lastFightId: null,
        lastFightDate: null,
        lastFightResult: null,
        farewellFight: null,
        comeback: {
            eligible: false,
            requested: false,
            accepted: false,
            rejected: false,
            offers: [],
            attempts: 0,
            lastAttemptAt: null,
            lastComebackAt: null,
            cooldownWeeks: 0
        },
        postCareer: {
            active: false,
            primaryPath: null,
            secondaryPaths: [],
            startedAt: null,
            income: 0,
            assets: [],
            achievements: []
        },
        legacy: {
            score: 0,
            retirementBonus: 0,
            farewellBonus: 0,
            comebackBonus: 0
        },
        history: [],
        events: [],
        statistics: {
            retirements: 0,
            forcedRetirements: 0,
            temporaryRetirements: 0,
            permanentRetirements: 0,
            farewellFights: 0,
            comebackOffers: 0,
            comebackAttempts: 0,
            comebacks: 0,
            failedComebacks: 0,
            weeksRetired: 0
        },
        lastUpdated: nowISO()
    };
}
function ensureRetirement(database) {
    const db = getDatabase(database);
    if (!db) {
        return null;
    }
    if (!db.media) {
        db.media = {};
    }
    if (!db.media.retirement) {
        db.media.retirement =
            createRetirementState();
    }
    const state =
        db.media.retirement;
    if (
        !Array.isArray(state.history)
    ) {
        state.history = [];
    }
    if (
        !Array.isArray(state.events)
    ) {
        state.events = [];
    }
    if (
        !state.comeback ||
        typeof state.comeback !== "object"
    ) {
        state.comeback =
            createRetirementState().comeback;
    }
    if (
        !Array.isArray(
            state.comeback.offers
        )
    ) {
        state.comeback.offers = [];
    }
    if (
        !state.postCareer ||
        typeof state.postCareer !== "object"
    ) {
        state.postCareer =
            createRetirementState().postCareer;
    }
    if (
        !Array.isArray(
            state.postCareer.secondaryPaths
        )
    ) {
        state.postCareer.secondaryPaths = [];
    }
    if (
        !Array.isArray(
            state.postCareer.assets
        )
    ) {
        state.postCareer.assets = [];
    }
    if (
        !Array.isArray(
            state.postCareer.achievements
        )
    ) {
        state.postCareer.achievements = [];
    }
    if (
        !state.legacy ||
        typeof state.legacy !== "object"
    ) {
        state.legacy =
            createRetirementState().legacy;
    }
    if (
        !state.statistics ||
        typeof state.statistics !== "object"
    ) {
        state.statistics =
            createRetirementState().statistics;
    }
    state.lastUpdated = nowISO();
    return state;
}
function getReasonLabel(reason) {
    const labels = {
        voluntary: "Aposentadoria voluntária",
        age: "Idade",
        health: "Problemas de saúde",
        injury: "Lesão",
        repeated_injuries:
            "Lesões recorrentes",
        performance:
            "Queda de desempenho",
        personal: "Motivos pessoais",
        family: "Família",
        financial: "Motivos financeiros",
        suspension: "Suspensão",
        forced: "Aposentadoria forçada",
        medical: "Decisão médica",
        legacy: "Preservação do legado",
        farewell: "Luta de despedida",
        other: "Outro motivo"
    };
    return (
        labels[reason] ||
        "Aposentadoria"
    );
}
function normalizeReason(reason) {
    if (!reason) {
        return RETIREMENT_REASONS.voluntary;
    }
    const value =
        String(reason).toLowerCase();
    return Object.values(
        RETIREMENT_REASONS
    ).includes(value)
        ? value
        : RETIREMENT_REASONS.other;
}
function normalizeType(type) {
    if (!type) {
        return RETIREMENT_TYPES.normal;
    }
    const value =
        String(type).toLowerCase();
    return Object.values(
        RETIREMENT_TYPES
    ).includes(value)
        ? value
        : RETIREMENT_TYPES.normal;
}
function getCurrentAge(database) {
    const player =
        getPlayer(database);
    return Number(
        player?.age ??
        player?.identity?.age ??
        0
    );
}
function getCurrentWeek(database) {
    const db = getDatabase(database);
    return Number(
        db?.calendar?.week ??
        db?.meta?.currentWeek ??
        db?.currentWeek ??
        0
    );
}
function getCurrentYear(database) {
    const db = getDatabase(database);
    return Number(
        db?.calendar?.year ??
        db?.meta?.currentYear ??
        db?.currentYear ??
        0
    );
}
function getCurrentDate(database) {
    const db = getDatabase(database);
    return (
        db?.calendar?.date ??
        db?.meta?.currentDate ??
        nowISO()
    );
}
function getRecommendedRetirementAge(
    database
) {
    const player =
        getPlayer(database);
    const career =
        database?.career || {};
    const health =
        database?.health || {};
    const age =
        getCurrentAge(database);
    let recommended =
        RETIREMENT_CONFIG.recommendedAge;
    if (
        Number(
            player?.durability ??
            health?.durability ??
            70
        ) < 50
    ) {
        recommended -= 2;
    }
    if (
        Number(
            career?.losses ??
            career?.professional?.losses ??
            0
        ) >= 10
    ) {
        recommended -= 1;
    }
    if (
        age >= 38
    ) {
        recommended =
            Math.min(
                recommended,
                age
            );
    }
    return Math.max(
        RETIREMENT_CONFIG.minimumAge,
        recommended
    );
}
function canRetire(
    database
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return false;
    }
    if (state.retired) {
        return false;
    }
    const age =
        getCurrentAge(database);
    return (
        age >=
        RETIREMENT_CONFIG.minimumAge
    );
}
function getRetirementPressure(
    database
) {
    const age =
        getCurrentAge(database);
    const health =
        Number(
            database?.health?.overall ??
            database?.health?.score ??
            100
        );
    const fatigue =
        Number(
            database?.training?.fatigue ??
            0
        );
    const career =
        database?.career || {};
    const losses =
        Number(
            career?.losses ??
            career?.professional?.losses ??
            0
        );
    const injuries =
        Number(
            database?.health?.injuries ??
            database?.health?.injuryCount ??
            0
        );
    let pressure = 0;
    if (
        age >=
        RETIREMENT_CONFIG.recommendedAge
    ) {
        pressure +=
            (age -
                RETIREMENT_CONFIG.recommendedAge) *
            4;
    }
    if (age >= 40) {
        pressure += 15;
    }
    if (health < 60) {
        pressure +=
            (60 - health) * 0.5;
    }
    if (fatigue > 70) {
        pressure +=
            (fatigue - 70) * 0.3;
    }
    if (losses >= 5) {
        pressure +=
            Math.min(
                losses * 2,
                15
            );
    }
    if (injuries >= 3) {
        pressure += 10;
    }
    return clamp(
        Math.round(pressure),
        0,
        100
    );
}
function getRetirementRecommendation(
    database
) {
    const age =
        getCurrentAge(database);
    const pressure =
        getRetirementPressure(
            database
        );
    const recommendedAge =
        getRecommendedRetirementAge(
            database
        );
    let recommendation =
        "continue";
    if (pressure >= 75) {
        recommendation =
            "strongly_consider";
    } else if (pressure >= 50) {
        recommendation =
            "consider";
    } else if (
        age >= recommendedAge
    ) {
        recommendation =
            "consider";
    }
    return {
        age,
        recommendedAge,
        pressure,
        recommendation
    };
}
function calculateLegacyBonus(
    database,
    reason,
    type
) {
    const career =
        database?.career || {};
    const wins =
        Number(
            career?.wins ??
            career?.professional?.wins ??
            0
        );
    const titles =
        Number(
            career?.titlesWon ??
            career?.professional?.titlesWon ??
            0
        );
    const fame =
        Number(
            database?.media?.fame?.value ??
            database?.media?.fame ??
            0
        );
    let bonus = 0;
    bonus +=
        Math.min(
            wins * 0.25,
            20
        );
    bonus +=
        Math.min(
            titles * 5,
            25
        );
    bonus +=
        Math.min(
            fame * 0.1,
            10
        );
    if (
        reason ===
        RETIREMENT_REASONS.legacy
    ) {
        bonus += 10;
    }
    if (
        type ===
        RETIREMENT_TYPES.permanent
    ) {
        bonus += 5;
    }
    return Math.round(
        clamp(
            bonus,
            0,
            100
        )
    );
}
function applyRetirementMediaImpact(
    database,
    type
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    const media =
        ensureMedia(database);
    if (!media) {
        return null;
    }
    const forced =
        type ===
        RETIREMENT_TYPES.forced;
    const fameImpact =
        forced
            ? RETIREMENT_CONFIG
                  .forcedRetirement
                  .famePenalty
            : RETIREMENT_CONFIG
                  .retirement
                  .fameBonus;
    const popularityImpact =
        forced
            ? RETIREMENT_CONFIG
                  .forcedRetirement
                  .popularityPenalty
            : RETIREMENT_CONFIG
                  .retirement
                  .popularityBonus;
    const reputationImpact =
        forced
            ? RETIREMENT_CONFIG
                  .forcedRetirement
                  .reputationPenalty
            : RETIREMENT_CONFIG
                  .retirement
                  .reputationBonus;
    const fame =
        media.fame;
    if (
        fame &&
        typeof fame.addFame ===
            "function"
    ) {
        fame.addFame(
            database,
            fameImpact
        );
    }
    const popularity =
        media.popularity;
    if (
        popularity &&
        typeof popularity.addPopularity ===
            "function"
    ) {
        popularity.addPopularity(
            database,
            popularityImpact
        );
    }
    const reputation =
        media.reputation;
    if (
        reputation &&
        typeof reputation.addReputation ===
            "function"
    ) {
        reputation.addReputation(
            database,
            reputationImpact
        );
    }
    return {
        fame: fameImpact,
        popularity:
            popularityImpact,
        reputation:
            reputationImpact
    };
}
function addRetirementEvent(
    database,
    type,
    options = {}
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    const event = {
        id:
            options.id ||
            createId(
                "retirement_event"
            ),
        type,
        description:
            options.description ||
            "Novo acontecimento relacionado à aposentadoria.",
        age:
            getCurrentAge(database),
        week:
            getCurrentWeek(database),
        year:
            getCurrentYear(database),
        timestamp:
            nowISO(),
        data:
            options.data || {}
    };
    state.events.push(event);
    return event;
}
function retire(
    database,
    options = {}
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    if (state.retired) {
        return state;
    }
    if (!canRetire(database)) {
        return null;
    }
    const reason =
        normalizeReason(
            options.reason
        );
    let type =
        normalizeType(
            options.type
        );
    if (
        options.permanent === true
    ) {
        type =
            RETIREMENT_TYPES.permanent;
    }
    if (
        options.forced === true
    ) {
        type =
            RETIREMENT_TYPES.forced;
    }
    if (
        options.temporary === true
    ) {
        type =
            RETIREMENT_TYPES.temporary;
    }
    const age =
        getCurrentAge(database);
    const date =
        getCurrentDate(database);
    const week =
        getCurrentWeek(database);
    const year =
        getCurrentYear(database);
    const retirementId =
        options.id ||
        createId();
    const legacyBonus =
        calculateLegacyBonus(
            database,
            reason,
            type
        );
    state.retired = true;
    state.retirementId =
        retirementId;
    state.type =
        type;
    state.reason =
        reason;
    state.reasonLabel =
        getReasonLabel(reason);
    state.retiredAt =
        nowISO();
    state.retirementDate =
        date;
    state.retirementAge =
        age;
    state.retirementWeek =
        week;
    state.retirementYear =
        year;
    state.weeksRetired = 0;
    state.legacy.retirementBonus =
        legacyBonus;
    state.legacy.score +=
        legacyBonus;
    const record = {
        id:
            retirementId,
        type,
        reason,
        reasonLabel:
            state.reasonLabel,
        age,
        week,
        year,
        date,
        fighterId:
            getPlayerId(database),
        fighterName:
            getPlayerName(database),
        legacyBonus,
        createdAt:
            nowISO()
    };
    state.history.push(
        record
    );
    state.statistics.retirements += 1;
    if (
        type ===
        RETIREMENT_TYPES.forced
    ) {
        state.statistics
            .forcedRetirements += 1;
    }
    if (
        type ===
        RETIREMENT_TYPES.temporary
    ) {
        state.statistics
            .temporaryRetirements += 1;
    }
    if (
        type ===
        RETIREMENT_TYPES.permanent
    ) {
        state.statistics
            .permanentRetirements += 1;
    }
    addRetirementEvent(
        database,
        RETIREMENT_EVENTS.retirement,
        {
            description:
                `${getPlayerName(database)} anunciou sua aposentadoria aos ${age} anos.`,
            data: {
                reason,
                type,
                legacyBonus
            }
        }
    );
    applyRetirementMediaImpact(
        database,
        type
    );
    calculateComebackEligibility(
        database
    );
    state.lastUpdated =
        nowISO();
    return state;
}
function retireVoluntarily(
    database,
    options = {}
) {
    return retire(
        database,
        {
            ...options,
            reason:
                options.reason ||
                RETIREMENT_REASONS.voluntary,
            type:
                options.type ||
                RETIREMENT_TYPES.normal
        }
    );
}
function retireForAge(
    database,
    options = {}
) {
    return retire(
        database,
        {
            ...options,
            reason:
                RETIREMENT_REASONS.age,
            type:
                options.type ||
                RETIREMENT_TYPES.normal
        }
    );
}
function retireForHealth(
    database,
    options = {}
) {
    return retire(
        database,
        {
            ...options,
            reason:
                options.reason ||
                RETIREMENT_REASONS.health,
            type:
                RETIREMENT_TYPES.forced,
            forced: true
        }
    );
}
function retireForInjury(
    database,
    options = {}
) {
    return retire(
        database,
        {
            ...options,
            reason:
                options.reason ||
                RETIREMENT_REASONS.injury,
            type:
                RETIREMENT_TYPES.forced,
            forced: true
        }
    );
}
function retireForLegacy(
    database,
    options = {}
) {
    return retire(
        database,
        {
            ...options,
            reason:
                RETIREMENT_REASONS.legacy,
            type:
                RETIREMENT_TYPES.permanent,
            permanent: true
        }
    );
}
function setLastFight(
    database,
    fight = {}
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    state.lastFightId =
        fight.id ||
        fight.fightId ||
        null;
    state.lastFightDate =
        fight.date ||
        fight.createdAt ||
        getCurrentDate(database);
    state.lastFightResult =
        fight.result ||
        fight.outcome ||
        null;
    state.lastUpdated =
        nowISO();
    return state;
}
function scheduleFarewellFight(
    database,
    options = {}
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    const farewell = {
        id:
            options.id ||
            createId(
                "farewell"
            ),
        opponentId:
            options.opponentId ||
            null,
        opponentName:
            options.opponentName ||
            null,
        eventId:
            options.eventId ||
            null,
        promotionId:
            options.promotionId ||
            null,
        scheduledDate:
            options.scheduledDate ||
            null,
        scheduledWeek:
            options.scheduledWeek ??
            getCurrentWeek(database),
        scheduledYear:
            options.scheduledYear ??
            getCurrentYear(database),
        completed: false,
        result: null,
        createdAt:
            nowISO()
    };
    state.farewellFight =
        farewell;
    state.legacy.farewellBonus =
        RETIREMENT_CONFIG
            .farewell
            .legacyBonus || 5;
    addRetirementEvent(
        database,
        RETIREMENT_EVENTS.farewell,
        {
            description:
                `${getPlayerName(database)} agendou uma luta de despedida.`,
            data: farewell
        }
    );
    return farewell;
}
function completeFarewellFight(
    database,
    result = {}
) {
    const state =
        ensureRetirement(database);
    if (
        !state ||
        !state.farewellFight
    ) {
        return null;
    }
    if (
        state.farewellFight.completed
    ) {
        return state.farewellFight;
    }
    state.farewellFight.completed =
        true;
    state.farewellFight.result =
        result.result ||
        result.outcome ||
        null;
    state.farewellFight.completedAt =
        nowISO();
    state.statistics
        .farewellFights += 1;
    state.legacy.score +=
        RETIREMENT_CONFIG
            .farewell
            .reputationBonus;
    addRetirementEvent(
        database,
        RETIREMENT_EVENTS.finalFight,
        {
            description:
                `${getPlayerName(database)} realizou sua luta de despedida.`,
            data: {
                result:
                    state.farewellFight.result
            }
        }
    );
    return state.farewellFight;
}
function calculateComebackEligibility(
    database
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    if (!state.retired) {
        state.comeback.eligible =
            false;
        return false;
    }
    if (
        state.type ===
        RETIREMENT_TYPES.permanent
    ) {
        state.comeback.eligible =
            false;
        return false;
    }
    if (
        state.reason ===
        RETIREMENT_REASONS.medical &&
        !canMedicalComeback(database)
    ) {
        state.comeback.eligible =
            false;
        return false;
    }
    if (
        state.weeksRetired <
        RETIREMENT_CONFIG
            .comeback
            .minimumRetirementWeeks
    ) {
        state.comeback.eligible =
            false;
        return false;
    }
    if (
        state.weeksRetired >
        RETIREMENT_CONFIG
            .comeback
            .maximumRetirementWeeks
    ) {
        state.comeback.eligible =
            false;
        return false;
    }
    const health =
        Number(
            database?.health?.overall ??
            database?.health?.score ??
            100
        );
    if (
        health <
        RETIREMENT_CONFIG
            .comeback
            .minimumHealth
    ) {
        state.comeback.eligible =
            false;
        return false;
    }
    state.comeback.eligible =
        true;
    return true;
}
function canMedicalComeback(
    database
) {
    const health =
        Number(
            database?.health?.overall ??
            database?.health?.score ??
            100
        );
    return (
        health >=
        RETIREMENT_CONFIG
            .comeback
            .minimumHealth
    );
}
function calculateComebackChance(
    database
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return 0;
    }
    if (
        !calculateComebackEligibility(
            database
        )
    ) {
        return 0;
    }
    const player =
        getPlayer(database);
    const age =
        getCurrentAge(database);
    const fame =
        Number(
            database?.media?.fame?.value ??
            database?.media?.fame ??
            player?.fame ??
            0
        );
    const health =
        Number(
            database?.health?.overall ??
            database?.health?.score ??
            100
        );
    const fitness =
        Number(
            database?.training?.fitness ??
            database?.training?.condition ??
            70
        );
    let chance =
        RETIREMENT_CONFIG
            .comeback
            .baseChance;
    chance +=
        Math.min(
            fame * 0.1,
            10
        );
    chance +=
        Math.min(
            fitness * 0.1,
            10
        );
    chance +=
        Math.min(
            health * 0.1,
            10
        );
    if (age >= 40) {
        chance -= 10;
    }
    if (age >= 45) {
        chance -= 15;
    }
    if (
        state.reason ===
        RETIREMENT_REASONS.injury ||
        state.reason ===
        RETIREMENT_REASONS.repeatedInjuries
    ) {
        chance -= 10;
    }
    chance -=
        state.comeback.attempts * 5;
    return clamp(
        Math.round(chance),
        0,
        100
    );
}
function generateComebackOffer(
    database,
    options = {}
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    if (
        !calculateComebackEligibility(
            database
        )
    ) {
        return null;
    }
    const chance =
        calculateComebackChance(
            database
        );
    const offer = {
        id:
            options.id ||
            createId(
                "comeback_offer"
            ),
        promotionId:
            options.promotionId ||
            null,
        promotionName:
            options.promotionName ||
            null,
        eventId:
            options.eventId ||
            null,
        opponentId:
            options.opponentId ||
            null,
        opponentName:
            options.opponentName ||
            null,
        purse:
            Number(
                options.purse
            ) || 0,
        winBonus:
            Number(
                options.winBonus
            ) || 0,
        titleFight:
            Boolean(
                options.titleFight
            ),
        mainEvent:
            Boolean(
                options.mainEvent
            ),
        probability:
            chance,
        status:
            "pending",
        createdAt:
            nowISO()
    };
    state.comeback.offers.push(
        offer
    );
    state.statistics
        .comebackOffers += 1;
    addRetirementEvent(
        database,
        RETIREMENT_EVENTS.comebackOffer,
        {
            description:
                `${getPlayerName(database)} recebeu uma proposta para retornar ao MMA.`,
            data: offer
        }
    );
    return offer;
}
function acceptComebackOffer(
    database,
    offerId
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    const offer =
        state.comeback.offers.find(
            item =>
                item.id === offerId
        );
    if (!offer) {
        return null;
    }
    if (
        offer.status !== "pending"
    ) {
        return offer;
    }
    if (
        !calculateComebackEligibility(
            database
        )
    ) {
        offer.status =
            "rejected";
        state.comeback.rejected =
            true;
        return offer;
    }
    offer.status =
        "accepted";
    state.comeback.requested =
        true;
    state.comeback.accepted =
        true;
    state.comeback.lastAttemptAt =
        nowISO();
    state.comeback.attempts += 1;
    state.statistics
        .comebackAttempts += 1;
    addRetirementEvent(
        database,
        RETIREMENT_EVENTS.comebackAccepted,
        {
            description:
                `${getPlayerName(database)} aceitou uma proposta de retorno.`,
            data: offer
        }
    );
    return offer;
}
function rejectComebackOffer(
    database,
    offerId
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    const offer =
        state.comeback.offers.find(
            item =>
                item.id === offerId
        );
    if (!offer) {
        return null;
    }
    offer.status =
        "rejected";
    addRetirementEvent(
        database,
        RETIREMENT_EVENTS.comebackRejected,
        {
            description:
                `${getPlayerName(database)} recusou uma proposta de retorno.`,
            data: offer
        }
    );
    return offer;
}
function requestComeback(
    database,
    options = {}
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    if (
        !calculateComebackEligibility(
            database
        )
    ) {
        return {
            success: false,
            reason:
                "O lutador não está elegível para retorno."
        };
    }
    const chance =
        calculateComebackChance(
            database
        );
    const requestedChance =
        clamp(
            Number(
                options.chance ??
                chance
            ),
            0,
            100
        );
    const roll =
        randomInt(1, 100);
    state.comeback.requested =
        true;
    state.comeback.lastAttemptAt =
        nowISO();
    state.comeback.attempts += 1;
    state.statistics
        .comebackAttempts += 1;
    addRetirementEvent(
        database,
        RETIREMENT_EVENTS.comebackRequest,
        {
            description:
                `${getPlayerName(database)} solicitou um retorno ao MMA.`,
            data: {
                chance:
                    requestedChance,
                roll
            }
        }
    );
    if (
        roll <= requestedChance
    ) {
        return performComeback(
            database,
            options
        );
    }
    state.comeback.rejected =
        true;
    state.statistics
        .failedComebacks += 1;
    return {
        success: false,
        chance:
            requestedChance,
        roll,
        reason:
            "O retorno não foi aprovado neste momento."
    };
}
function performComeback(
    database,
    options = {}
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    if (!state.retired) {
        return {
            success: false,
            reason:
                "O lutador já está ativo."
        };
    }
    if (
        !calculateComebackEligibility(
            database
        )
    ) {
        return {
            success: false,
            reason:
                "O lutador não está elegível para retorno."
        };
    }
    state.retired = false;
    state.comeback.accepted =
        true;
    state.comeback.rejected =
        false;
    state.comeback.lastComebackAt =
        nowISO();
    state.comeback.cooldownWeeks = 0;
    state.legacy.comebackBonus +=
        5;
    state.legacy.score += 5;
    state.statistics.comebacks += 1;
    const comeback = {
        id:
            createId("comeback"),
        previousRetirementId:
            state.retirementId,
        previousRetirementAge:
            state.retirementAge,
        previousRetirementYear:
            state.retirementYear,
        comebackAge:
            getCurrentAge(database),
        comebackYear:
            getCurrentYear(database),
        weeksRetired:
            state.weeksRetired,
        reason:
            options.reason ||
            "Retorno ao MMA",
        createdAt:
            nowISO()
    };
    addRetirementEvent(
        database,
        RETIREMENT_EVENTS.comeback,
        {
            description:
                `${getPlayerName(database)} está de volta ao MMA!`,
            data: comeback
        }
    );
    state.history.push(
        comeback
    );
    const media =
        ensureMedia(database);
    if (media) {
        if (
            media.fame &&
            typeof media.fame.addFame ===
                "function"
        ) {
            media.fame.addFame(
                database,
                5
            );
        }
        if (
            media.popularity &&
            typeof media.popularity.addPopularity ===
                "function"
        ) {
            media.popularity.addPopularity(
                database,
                5
            );
        }
        if (
            media.followers &&
            typeof media.followers.addFollowers ===
                "function"
        ) {
            media.followers.addFollowers(
                database,
                1000
            );
        }
    }
    state.lastUpdated =
        nowISO();
    return {
        success: true,
        comeback,
        state
    };
}
function cancelRetirement(
    database,
    options = {}
) {
    return performComeback(
        database,
        {
            ...options,
            reason:
                options.reason ||
                "Retorno imediato"
        }
    );
}
function processWeeklyRetirement(
    database
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    if (!state.retired) {
        return state;
    }
    state.weeksRetired += 1;
    state.statistics
        .weeksRetired += 1;
    state.comeback.cooldownWeeks =
        Math.max(
            0,
            Number(
                state.comeback
                    .cooldownWeeks
            ) - 1
        );
    calculateComebackEligibility(
        database
    );
    if (
        state.weeksRetired %
            52 ===
        0
    ) {
        addRetirementEvent(
            database,
            RETIREMENT_EVENTS.anniversary,
            {
                description:
                    `${getPlayerName(database)} completou mais um ano aposentado.`,
                data: {
                    yearsRetired:
                        Math.floor(
                            state.weeksRetired /
                                52
                        )
                }
            }
        );
    }
    state.lastUpdated =
        nowISO();
    return state;
}
function setPostCareerPath(
    database,
    path,
    options = {}
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    if (
        !Object.values(
            POST_CAREER_PATHS
        ).includes(path)
    ) {
        path =
            POST_CAREER_PATHS
                .retiredLife;
    }
    if (
        !state.postCareer.active
    ) {
        state.postCareer.active =
            true;
        state.postCareer.startedAt =
            nowISO();
    }
    state.postCareer.primaryPath =
        path;
    if (
        options.secondaryPaths
    ) {
        state.postCareer
            .secondaryPaths =
            Array.isArray(
                options.secondaryPaths
            )
                ? [
                      ...options.secondaryPaths
                  ]
                : [];
    }
    if (
        options.income !== undefined
    ) {
        state.postCareer.income =
            Number(
                options.income
            ) || 0;
    }
    addRetirementEvent(
        database,
        RETIREMENT_EVENTS.legacy,
        {
            description:
                `${getPlayerName(database)} iniciou uma nova fase da vida após o MMA.`,
            data: {
                path
            }
        }
    );
    return state.postCareer;
}
function addPostCareerAchievement(
    database,
    achievement
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    const item = {
        id:
            achievement?.id ||
            createId(
                "post_career"
            ),
        title:
            achievement?.title ||
            "Nova conquista",
        description:
            achievement?.description ||
            "",
        year:
            achievement?.year ??
            getCurrentYear(database),
        createdAt:
            nowISO()
    };
    state.postCareer
        .achievements.push(item);
    return item;
}
function addPostCareerAsset(
    database,
    asset
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    const item = {
        id:
            asset?.id ||
            createId(
                "retirement_asset"
            ),
        name:
            asset?.name ||
            "Novo patrimônio",
        type:
            asset?.type ||
            "asset",
        value:
            Number(
                asset?.value
            ) || 0,
        acquiredAt:
            nowISO()
    };
    state.postCareer
        .assets.push(item);
    return item;
}
function getRetirementStatus(
    database
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    return {
        retired:
            state.retired,
        type:
            state.type,
        reason:
            state.reason,
        reasonLabel:
            state.reasonLabel,
        retirementAge:
            state.retirementAge,
        retirementYear:
            state.retirementYear,
        weeksRetired:
            state.weeksRetired,
        yearsRetired:
            Math.floor(
                state.weeksRetired /
                    52
            ),
        lastFightId:
            state.lastFightId,
        farewellFight:
            state.farewellFight,
        comebackEligible:
            calculateComebackEligibility(
                database
            ),
        comebackChance:
            calculateComebackChance(
                database
            ),
        postCareer:
            state.postCareer,
        legacy:
            state.legacy
    };
}
function getComebackOffers(
    database
) {
    const state =
        ensureRetirement(database);
    return state
        ? [
              ...state.comeback
                  .offers
          ]
        : [];
}
function getPendingComebackOffers(
    database
) {
    return getComebackOffers(
        database
    ).filter(
        offer =>
            offer.status ===
            "pending"
    );
}
function getRetirementHistory(
    database
) {
    const state =
        ensureRetirement(database);
    return state
        ? [
              ...state.history
          ]
        : [];
}
function getRetirementEvents(
    database
) {
    const state =
        ensureRetirement(database);
    return state
        ? [
              ...state.events
          ]
        : [];
}
function getLegacyScore(
    database
) {
    const state =
        ensureRetirement(database);
    return state
        ? Number(
              state.legacy.score
          ) || 0
        : 0;
}
function addLegacyScore(
    database,
    amount,
    reason = "Conquista"
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    const value =
        Number(amount) || 0;
    state.legacy.score +=
        value;
    addRetirementEvent(
        database,
        RETIREMENT_EVENTS.legacy,
        {
            description:
                `${reason} aumentou o legado de ${getPlayerName(database)}.`,
            data: {
                amount: value
            }
        }
    );
    return state.legacy.score;
}
function isPermanentlyRetired(
    database
) {
    const state =
        ensureRetirement(database);
    return Boolean(
        state &&
        state.retired &&
        state.type ===
            RETIREMENT_TYPES.permanent
    );
}
function isTemporarilyRetired(
    database
) {
    const state =
        ensureRetirement(database);
    return Boolean(
        state &&
        state.retired &&
        state.type ===
            RETIREMENT_TYPES.temporary
    );
}
function isRetired(
    database
) {
    const state =
        ensureRetirement(database);
    return Boolean(
        state?.retired
    );
}
function canReceiveComebackOffer(
    database
) {
    return calculateComebackEligibility(
        database
    );
}
function getRetirementRisk(
    database
) {
    const age =
        getCurrentAge(database);
    const pressure =
        getRetirementPressure(
            database
        );
    let risk =
        pressure;
    if (
        age >=
        RETIREMENT_CONFIG
            .typicalAge
    ) {
        risk += 10;
    }
    if (
        age >=
        RETIREMENT_CONFIG
            .maximumCareerAge
    ) {
        risk = 100;
    }
    return clamp(
        Math.round(risk),
        0,
        100
    );
}
function getRetirementRiskLabel(
    risk
) {
    const value =
        clamp(risk, 0, 100);
    if (value >= 80) {
        return "Muito alto";
    }
    if (value >= 60) {
        return "Alto";
    }
    if (value >= 40) {
        return "Moderado";
    }
    if (value >= 20) {
        return "Baixo";
    }
    return "Muito baixo";
}
function getStatistics(
    database
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    return {
        ...state.statistics,
        retired:
            state.retired,
        yearsRetired:
            Math.floor(
                state.weeksRetired /
                    52
            ),
        legacyScore:
            state.legacy.score,
        comebackEligible:
            calculateComebackEligibility(
                database
            ),
        comebackChance:
            calculateComebackChance(
                database
            ),
        retirementRisk:
            getRetirementRisk(
                database
            ),
        retirementRiskLabel:
            getRetirementRiskLabel(
                getRetirementRisk(
                    database
                )
            )
    };
}
function getProfile(
    database
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    return {
        status:
            getRetirementStatus(
                database
            ),
        recommendation:
            getRetirementRecommendation(
                database
            ),
        history:
            getRetirementHistory(
                database
            ),
        events:
            getRetirementEvents(
                database
            ),
        offers:
            getComebackOffers(
                database
            ),
        pendingOffers:
            getPendingComebackOffers(
                database
            ),
        legacyScore:
            getLegacyScore(
                database
            ),
        statistics:
            getStatistics(
                database
            )
    };
}
function getSummary(
    database
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    return {
        retired:
            state.retired,
        retirementType:
            state.type,
        retirementReason:
            state.reasonLabel,
        retirementAge:
            state.retirementAge,
        weeksRetired:
            state.weeksRetired,
        yearsRetired:
            Math.floor(
                state.weeksRetired /
                    52
            ),
        comebackEligible:
            calculateComebackEligibility(
                database
            ),
        comebackChance:
            calculateComebackChance(
                database
            ),
        pendingComebackOffers:
            getPendingComebackOffers(
                database
            ).length,
        legacyScore:
            state.legacy.score,
        postCareerPath:
            state.postCareer
                .primaryPath
    };
}
function validateRetirement(
    database
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return {
            valid: false,
            errors: [
                "Database não encontrado."
            ]
        };
    }
    const errors = [];
    if (
        typeof state.retired !==
        "boolean"
    ) {
        errors.push(
            "retired precisa ser boolean."
        );
    }
    if (
        !Array.isArray(
            state.history
        )
    ) {
        errors.push(
            "history precisa ser um array."
        );
    }
    if (
        !Array.isArray(
            state.events
        )
    ) {
        errors.push(
            "events precisa ser um array."
        );
    }
    if (
        state.retired &&
        !state.retirementId
    ) {
        errors.push(
            "Lutador aposentado sem retirementId."
        );
    }
    if (
        state.weeksRetired < 0
    ) {
        errors.push(
            "weeksRetired não pode ser negativo."
        );
    }
    if (
        state.type &&
        !Object.values(
            RETIREMENT_TYPES
        ).includes(state.type)
    ) {
        errors.push(
            "Tipo de aposentadoria inválido."
        );
    }
    if (
        state.reason &&
        !Object.values(
            RETIREMENT_REASONS
        ).includes(state.reason)
    ) {
        errors.push(
            "Motivo de aposentadoria inválido."
        );
    }
    return {
        valid:
            errors.length === 0,
        errors
    };
}
function snapshot(
    database
) {
    const state =
        ensureRetirement(database);
    if (!state) {
        return null;
    }
    return JSON.parse(
        JSON.stringify(state)
    );
}
function resetRetirement(
    database
) {
    const db =
        getDatabase(database);
    if (!db) {
        return null;
    }
    if (!db.media) {
        db.media = {};
    }
    db.media.retirement =
        createRetirementState();
    return db.media.retirement;
}
const retirementAPI = {
    RETIREMENT_VERSION,
    RETIREMENT_CONFIG,
    RETIREMENT_REASONS,
    RETIREMENT_TYPES,
    RETIREMENT_EVENTS,
    POST_CAREER_PATHS,
    createRetirementState,
    ensureRetirement,
    getReasonLabel,
    normalizeReason,
    normalizeType,
    getCurrentAge,
    getCurrentWeek,
    getCurrentYear,
    getCurrentDate,
    getRecommendedRetirementAge,
    canRetire,
    getRetirementPressure,
    getRetirementRecommendation,
    calculateLegacyBonus,
    applyRetirementMediaImpact,
    addRetirementEvent,
    retire,
    retireVoluntarily,
    retireForAge,
    retireForHealth,
    retireForInjury,
    retireForLegacy,
    setLastFight,
    scheduleFarewellFight,
    completeFarewellFight,
    calculateComebackEligibility,
    canMedicalComeback,
    calculateComebackChance,
    generateComebackOffer,
    acceptComebackOffer,
    rejectComebackOffer,
    requestComeback,
    performComeback,
    cancelRetirement,
    processWeeklyRetirement,
    setPostCareerPath,
    addPostCareerAchievement,
    addPostCareerAsset,
    getRetirementStatus,
    getComebackOffers,
    getPendingComebackOffers,
    getRetirementHistory,
    getRetirementEvents,
    getLegacyScore,
    addLegacyScore,
    isPermanentlyRetired,
    isTemporarilyRetired,
    isRetired,
    canReceiveComebackOffer,
    getRetirementRisk,
    getRetirementRiskLabel,
    getStatistics,
    getProfile,
    getSummary,
    validateRetirement,
    snapshot,
    resetRetirement
};
export {
    RETIREMENT_VERSION,
    RETIREMENT_CONFIG,
    RETIREMENT_REASONS,
    RETIREMENT_TYPES,
    RETIREMENT_EVENTS,
    POST_CAREER_PATHS,
    createRetirementState,
    ensureRetirement,
    getReasonLabel,
    normalizeReason,
    normalizeType,
    getCurrentAge,
    getCurrentWeek,
    getCurrentYear,
    getCurrentDate,
    getRecommendedRetirementAge,
    canRetire,
    getRetirementPressure,
    getRetirementRecommendation,
    calculateLegacyBonus,
    applyRetirementMediaImpact,
    addRetirementEvent,
    retire,
    retireVoluntarily,
    retireForAge,
    retireForHealth,
    retireForInjury,
    retireForLegacy,
    setLastFight,
    scheduleFarewellFight,
    completeFarewellFight,
    calculateComebackEligibility,
    canMedicalComeback,
    calculateComebackChance,
    generateComebackOffer,
    acceptComebackOffer,
    rejectComebackOffer,
    requestComeback,
    performComeback,
    cancelRetirement,
    processWeeklyRetirement,
    setPostCareerPath,
    addPostCareerAchievement,
    addPostCareerAsset,
    getRetirementStatus,
    getComebackOffers,
    getPendingComebackOffers,
    getRetirementHistory,
    getRetirementEvents,
    getLegacyScore,
    addLegacyScore,
    isPermanentlyRetired,
    isTemporarilyRetired,
    isRetired,
    canReceiveComebackOffer,
    getRetirementRisk,
    getRetirementRiskLabel,
    getStatistics,
    getProfile,
    getSummary,
    validateRetirement,
    snapshot,
    resetRetirement
};
export default retirementAPI;
