/* ============================================================
   MMA LIFE DYNASTY
   LIFE HISTORY SYSTEM
   Arquivo: js/life/lifeHistory.js
   ============================================================ */

const LIFE_HISTORY_VERSION = 1;

/* ============================================================
   CONSTANTES
   ============================================================ */

const HISTORY_CATEGORIES = Object.freeze({
    LIFE: "life",
    RELATIONSHIP: "relationship",
    FAMILY: "family",
    CAREER: "career",
    MMA: "mma",
    EDUCATION: "education",
    EMPLOYMENT: "employment",
    FINANCE: "finance",
    HEALTH: "health",
    RESIDENCE: "residence",
    VEHICLE: "vehicle",
    LIFESTYLE: "lifestyle",
    SOCIAL: "social",
    TRAVEL: "travel",
    MEDIA: "media",
    LEGACY: "legacy",
    DYNASTY: "dynasty",
    PERSONAL: "personal",
    OTHER: "other"
});

const HISTORY_TYPES = Object.freeze({
    BIRTH: "birth",
    AGE: "age",
    BIRTHDAY: "birthday",
    DEATH: "death",

    RELATIONSHIP_STARTED: "relationship_started",
    RELATIONSHIP_CHANGED: "relationship_changed",
    RELATIONSHIP_ENDED: "relationship_ended",
    DATING: "dating",
    ENGAGEMENT: "engagement",
    MARRIAGE: "marriage",
    SEPARATION: "separation",
    DIVORCE: "divorce",

    CHILD_BIRTH: "child_birth",
    CHILD_MILESTONE: "child_milestone",
    FAMILY: "family",

    EDUCATION_STARTED: "education_started",
    EDUCATION_COMPLETED: "education_completed",
    EDUCATION_FAILED: "education_failed",
    DEGREE: "degree",

    JOB_STARTED: "job_started",
    JOB_PROMOTION: "job_promotion",
    JOB_LOST: "job_lost",
    BUSINESS_STARTED: "business_started",
    BUSINESS_SUCCESS: "business_success",

    MONEY_GAIN: "money_gain",
    MONEY_LOSS: "money_loss",
    INVESTMENT: "investment",
    DEBT: "debt",
    ASSET_PURCHASE: "asset_purchase",
    ASSET_SALE: "asset_sale",
    WEALTH_MILESTONE: "wealth_milestone",

    HEALTH: "health",
    INJURY: "injury",
    RECOVERY: "recovery",

    MOVE: "move",
    HOME_PURCHASE: "home_purchase",
    HOME_SALE: "home_sale",

    VEHICLE_PURCHASE: "vehicle_purchase",
    VEHICLE_SALE: "vehicle_sale",
    VEHICLE_LOSS: "vehicle_loss",

    TRAINING: "training",
    FIGHT: "fight",
    FIGHT_WIN: "fight_win",
    FIGHT_LOSS: "fight_loss",
    FIGHT_DRAW: "fight_draw",
    CONTRACT: "contract",
    PROMOTION_CHANGE: "promotion_change",
    RANKING: "ranking",
    TITLE_WON: "title_won",
    TITLE_LOST: "title_lost",
    RETIREMENT: "retirement",

    FAME: "fame",
    FOLLOWERS: "followers",
    MEDIA: "media",
    AWARD: "award",
    CONTROVERSY: "controversy",
    RIVALRY: "rivalry",

    TRAVEL: "travel",
    SOCIAL: "social",
    CELEBRATION: "celebration",

    PERSONAL_SUCCESS: "personal_success",
    PERSONAL_FAILURE: "personal_failure",
    MILESTONE: "milestone",

    LEGACY: "legacy",
    INHERITANCE: "inheritance",
    DYNASTY: "dynasty",

    EVENT: "event",
    DECISION: "decision",
    CUSTOM: "custom"
});

const HISTORY_IMPORTANCE = Object.freeze({
    TRIVIAL: 1,
    LOW: 2,
    NORMAL: 3,
    IMPORTANT: 4,
    MAJOR: 5,
    LEGENDARY: 6
});

/* ============================================================
   CONFIGURAÇÃO
   ============================================================ */

const HISTORY_CONFIG = Object.freeze({
    maxEntries: 5000,
    maxSearchResults: 500,
    maxMilestones: 1000,
    archiveAfterEntries: 4000,
    keepRecentEntries: 3000,

    defaultImportance: HISTORY_IMPORTANCE.NORMAL,

    automaticTypes: [
        HISTORY_TYPES.BIRTH,
        HISTORY_TYPES.BIRTHDAY,
        HISTORY_TYPES.DEATH,
        HISTORY_TYPES.FIGHT,
        HISTORY_TYPES.TITLE_WON,
        HISTORY_TYPES.TITLE_LOST,
        HISTORY_TYPES.MARRIAGE,
        HISTORY_TYPES.DIVORCE,
        HISTORY_TYPES.CHILD_BIRTH,
        HISTORY_TYPES.GRADUATION,
        HISTORY_TYPES.RETIREMENT
    ]
});

/* ============================================================
   UTILIDADES
   ============================================================ */

function cloneHistoryData(value) {
    if (value === undefined || value === null) {
        return value;
    }

    try {
        return JSON.parse(JSON.stringify(value));
    } catch (error) {
        return value;
    }
}

function historyClamp(value, min, max) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return min;
    }

    return Math.min(max, Math.max(min, number));
}

function historyRandomInt(min, max) {
    const low = Math.ceil(min);
    const high = Math.floor(max);

    return Math.floor(Math.random() * (high - low + 1)) + low;
}

function historyGenerateId(prefix = "history") {
    return (
        prefix +
        "_" +
        Date.now().toString(36) +
        "_" +
        Math.random().toString(36).slice(2, 9)
    );
}

function historyNormalizeText(value, fallback = "") {
    if (value === undefined || value === null) {
        return fallback;
    }

    return String(value).trim();
}

function historyNormalizeNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number) ? number : fallback;
}

function historyGetPath(object, path, fallback = undefined) {
    if (!object || !path) {
        return fallback;
    }

    const parts = String(path).split(".");
    let current = object;

    for (const part of parts) {
        if (
            current === null ||
            current === undefined ||
            typeof current !== "object" ||
            !(part in current)
        ) {
            return fallback;
        }

        current = current[part];
    }

    return current;
}

function historySetPath(object, path, value) {
    if (!object || !path) {
        return false;
    }

    const parts = String(path).split(".");
    let current = object;

    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];

        if (
            !current[part] ||
            typeof current[part] !== "object"
        ) {
            current[part] = {};
        }

        current = current[part];
    }

    current[parts[parts.length - 1]] = value;

    return true;
}

function historyGetPlayer(database) {
    return (
        database?.player ||
        database?.career?.player ||
        null
    );
}

function historyGetDate(database, entry = null) {
    if (entry?.date) {
        return entry.date;
    }

    if (database?.meta?.currentDate) {
        return database.meta.currentDate;
    }

    if (database?.calendar?.currentDate) {
        return database.calendar.currentDate;
    }

    return null;
}

function historyGetYear(database, entry = null) {
    if (entry?.year !== undefined && entry?.year !== null) {
        return historyNormalizeNumber(entry.year);
    }

    if (database?.meta?.currentYear) {
        return historyNormalizeNumber(database.meta.currentYear);
    }

    if (database?.calendar?.year) {
        return historyNormalizeNumber(database.calendar.year);
    }

    return 1;
}

function historyGetWeek(database, entry = null) {
    if (entry?.week !== undefined && entry?.week !== null) {
        return historyNormalizeNumber(entry.week);
    }

    if (database?.meta?.currentWeek) {
        return historyNormalizeNumber(database.meta.currentWeek);
    }

    if (database?.calendar?.week) {
        return historyNormalizeNumber(database.calendar.week);
    }

    return 1;
}

function historyGetAge(database, entry = null) {
    if (entry?.age !== undefined && entry?.age !== null) {
        return historyNormalizeNumber(entry.age);
    }

    const player = historyGetPlayer(database);

    if (player?.age !== undefined) {
        return historyNormalizeNumber(player.age);
    }

    if (database?.life?.age !== undefined) {
        return historyNormalizeNumber(database.life.age);
    }

    return null;
}

/* ============================================================
   ESTADO
   ============================================================ */

function createEmptyLifeHistoryState() {
    return {
        version: LIFE_HISTORY_VERSION,

        entries: [],
        milestones: [],
        archive: [],

        stats: {
            totalEntries: 0,
            totalMilestones: 0,
            importantEvents: 0,
            majorEvents: 0,
            legendaryEvents: 0,

            byCategory: {},
            byType: {},

            firstEntryDate: null,
            lastEntryDate: null,

            firstEntryYear: null,
            lastEntryYear: null,

            oldestAge: null,
            latestAge: null
        },

        indexes: {
            years: {},
            categories: {},
            types: {},
            ages: {}
        },

        settings: {
            maxEntries: HISTORY_CONFIG.maxEntries,
            keepRecentEntries: HISTORY_CONFIG.keepRecentEntries,
            autoArchive: true
        }
    };
}

function ensureLifeHistoryState(database) {
    if (!database) {
        return null;
    }

    if (!database.life) {
        database.life = {};
    }

    if (!database.life.history) {
        database.life.history = createEmptyLifeHistoryState();
    }

    const state = database.life.history;

    if (!Array.isArray(state.entries)) {
        state.entries = [];
    }

    if (!Array.isArray(state.milestones)) {
        state.milestones = [];
    }

    if (!Array.isArray(state.archive)) {
        state.archive = [];
    }

    if (!state.stats) {
        state.stats = createEmptyLifeHistoryState().stats;
    }

    if (!state.indexes) {
        state.indexes = createEmptyLifeHistoryState().indexes;
    }

    if (!state.settings) {
        state.settings = createEmptyLifeHistoryState().settings;
    }

    return state;
}

/* ============================================================
   NORMALIZAÇÃO
   ============================================================ */

function normalizeHistoryCategory(category) {
    const value = historyNormalizeText(
        category,
        HISTORY_CATEGORIES.OTHER
    ).toLowerCase();

    const values = Object.values(HISTORY_CATEGORIES);

    return values.includes(value)
        ? value
        : HISTORY_CATEGORIES.OTHER;
}

function normalizeHistoryType(type) {
    const value = historyNormalizeText(
        type,
        HISTORY_TYPES.CUSTOM
    ).toLowerCase();

    const values = Object.values(HISTORY_TYPES);

    return values.includes(value)
        ? value
        : HISTORY_TYPES.CUSTOM;
}

function normalizeHistoryImportance(importance) {
    const value = historyNormalizeNumber(
        importance,
        HISTORY_CONFIG.defaultImportance
    );

    return historyClamp(
        Math.round(value),
        HISTORY_IMPORTANCE.TRIVIAL,
        HISTORY_IMPORTANCE.LEGENDARY
    );
}

function normalizeHistoryEntry(database, input = {}) {
    const player = historyGetPlayer(database);

    const entry = {
        id: historyNormalizeText(
            input.id,
            historyGenerateId()
        ),

        version: LIFE_HISTORY_VERSION,

        category: normalizeHistoryCategory(
            input.category
        ),

        type: normalizeHistoryType(
            input.type
        ),

        importance: normalizeHistoryImportance(
            input.importance
        ),

        title: historyNormalizeText(
            input.title,
            "Evento da vida"
        ),

        description: historyNormalizeText(
            input.description,
            ""
        ),

        date: input.date || historyGetDate(database),

        year: historyNormalizeNumber(
            input.year,
            historyGetYear(database, input)
        ),

        week: historyNormalizeNumber(
            input.week,
            historyGetWeek(database, input)
        ),

        age: input.age !== undefined
            ? historyNormalizeNumber(input.age)
            : historyGetAge(database, input),

        month: input.month !== undefined
            ? historyNormalizeNumber(input.month)
            : null,

        outcome: historyNormalizeText(
            input.outcome,
            "neutral"
        ),

        tags: Array.isArray(input.tags)
            ? [...new Set(input.tags.map(String))]
            : [],

        relatedIds: Array.isArray(input.relatedIds)
            ? [...new Set(input.relatedIds.map(String))]
            : [],

        metadata: input.metadata &&
            typeof input.metadata === "object"
            ? cloneHistoryData(input.metadata)
            : {},

        snapshot: input.snapshot &&
            typeof input.snapshot === "object"
            ? cloneHistoryData(input.snapshot)
            : {},

        source: historyNormalizeText(
            input.source,
            "system"
        ),

        eventId: input.eventId || null,

        milestone: Boolean(input.milestone),

        hidden: Boolean(input.hidden),

        createdAt: input.createdAt ||
            new Date().toISOString()
    };

    if (
        entry.month === null &&
        entry.date
    ) {
        const parsed = new Date(entry.date);

        if (!Number.isNaN(parsed.getTime())) {
            entry.month = parsed.getMonth() + 1;
        }
    }

    if (!entry.description) {
        entry.description = entry.title;
    }

    if (
        player &&
        !entry.metadata.playerId &&
        player.id
    ) {
        entry.metadata.playerId = player.id;
    }

    return entry;
}

/* ============================================================
   ORDENAÇÃO
   ============================================================ */

function compareHistoryEntries(a, b) {
    const yearA = historyNormalizeNumber(a?.year, 0);
    const yearB = historyNormalizeNumber(b?.year, 0);

    if (yearA !== yearB) {
        return yearA - yearB;
    }

    const weekA = historyNormalizeNumber(a?.week, 0);
    const weekB = historyNormalizeNumber(b?.week, 0);

    if (weekA !== weekB) {
        return weekA - weekB;
    }

    const dateA = a?.date
        ? new Date(a.date).getTime()
        : 0;

    const dateB = b?.date
        ? new Date(b.date).getTime()
        : 0;

    if (
        Number.isFinite(dateA) &&
        Number.isFinite(dateB) &&
        dateA !== dateB
    ) {
        return dateA - dateB;
    }

    const createdA = a?.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;

    const createdB = b?.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;

    return createdA - createdB;
}

function sortHistory(database, descending = false) {
    const state = ensureLifeHistoryState(database);

    state.entries.sort((a, b) => {
        const result = compareHistoryEntries(a, b);

        return descending ? -result : result;
    });

    return state.entries;
}

/* ============================================================
   ÍNDICES
   ============================================================ */

function rebuildHistoryIndexes(database) {
    const state = ensureLifeHistoryState(database);

    state.indexes = {
        years: {},
        categories: {},
        types: {},
        ages: {}
    };

    for (const entry of state.entries) {
        const yearKey = String(entry.year);
        const ageKey =
            entry.age === null || entry.age === undefined
                ? "unknown"
                : String(entry.age);

        if (!state.indexes.years[yearKey]) {
            state.indexes.years[yearKey] = [];
        }

        if (!state.indexes.categories[entry.category]) {
            state.indexes.categories[entry.category] = [];
        }

        if (!state.indexes.types[entry.type]) {
            state.indexes.types[entry.type] = [];
        }

        if (!state.indexes.ages[ageKey]) {
            state.indexes.ages[ageKey] = [];
        }

        state.indexes.years[yearKey].push(entry.id);
        state.indexes.categories[entry.category].push(entry.id);
        state.indexes.types[entry.type].push(entry.id);
        state.indexes.ages[ageKey].push(entry.id);
    }

    return state.indexes;
}

/* ============================================================
   ESTATÍSTICAS
   ============================================================ */

function rebuildHistoryStats(database) {
    const state = ensureLifeHistoryState(database);

    const stats = {
        totalEntries: state.entries.length,
        totalMilestones: state.milestones.length,

        importantEvents: 0,
        majorEvents: 0,
        legendaryEvents: 0,

        byCategory: {},
        byType: {},

        firstEntryDate: null,
        lastEntryDate: null,

        firstEntryYear: null,
        lastEntryYear: null,

        oldestAge: null,
        latestAge: null
    };

    for (const entry of state.entries) {
        const category = entry.category;
        const type = entry.type;

        stats.byCategory[category] =
            (stats.byCategory[category] || 0) + 1;

        stats.byType[type] =
            (stats.byType[type] || 0) + 1;

        if (
            entry.importance >=
            HISTORY_IMPORTANCE.IMPORTANT
        ) {
            stats.importantEvents++;
        }

        if (
            entry.importance >=
            HISTORY_IMPORTANCE.MAJOR
        ) {
            stats.majorEvents++;
        }

        if (
            entry.importance >=
            HISTORY_IMPORTANCE.LEGENDARY
        ) {
            stats.legendaryEvents++;
        }

        if (entry.year !== null) {
            if (
                stats.firstEntryYear === null ||
                entry.year < stats.firstEntryYear
            ) {
                stats.firstEntryYear = entry.year;
            }

            if (
                stats.lastEntryYear === null ||
                entry.year > stats.lastEntryYear
            ) {
                stats.lastEntryYear = entry.year;
            }
        }

        if (entry.date) {
            if (
                !stats.firstEntryDate ||
                entry.date < stats.firstEntryDate
            ) {
                stats.firstEntryDate = entry.date;
            }

            if (
                !stats.lastEntryDate ||
                entry.date > stats.lastEntryDate
            ) {
                stats.lastEntryDate = entry.date;
            }
        }

        if (entry.age !== null && entry.age !== undefined) {
            if (
                stats.oldestAge === null ||
                entry.age < stats.oldestAge
            ) {
                stats.oldestAge = entry.age;
            }

            if (
                stats.latestAge === null ||
                entry.age > stats.latestAge
            ) {
                stats.latestAge = entry.age;
            }
        }
    }

    state.stats = stats;

    return stats;
}

/* ============================================================
   ADICIONAR HISTÓRICO
   ============================================================ */

function addHistoryEntry(database, input = {}) {
    const state = ensureLifeHistoryState(database);

    const entry = normalizeHistoryEntry(
        database,
        input
    );

    const existingIndex = state.entries.findIndex(
        item => item.id === entry.id
    );

    if (existingIndex !== -1) {
        state.entries[existingIndex] = entry;
    } else {
        state.entries.push(entry);
    }

    if (entry.milestone) {
        addMilestone(database, entry);
    }

    sortHistory(database);
    rebuildHistoryIndexes(database);
    rebuildHistoryStats(database);

    enforceHistoryLimits(database);

    return cloneHistoryData(entry);
}

/* ============================================================
   MILESTONES
   ============================================================ */

function addMilestone(database, input = {}) {
    const state = ensureLifeHistoryState(database);

    const milestone =
        input.id && input.title && input.type
            ? normalizeHistoryEntry(database, input)
            : normalizeHistoryEntry(database, {
                ...input,
                milestone: true
            });

    milestone.milestone = true;

    const existingIndex =
        state.milestones.findIndex(
            item => item.id === milestone.id
        );

    if (existingIndex !== -1) {
        state.milestones[existingIndex] = milestone;
    } else {
        state.milestones.push(milestone);
    }

    state.milestones.sort(compareHistoryEntries);

    if (
        state.milestones.length >
        HISTORY_CONFIG.maxMilestones
    ) {
        state.milestones =
            state.milestones.slice(
                -HISTORY_CONFIG.maxMilestones
            );
    }

    rebuildHistoryStats(database);

    return cloneHistoryData(milestone);
}

function recordMilestone(
    database,
    title,
    description,
    options = {}
) {
    return addHistoryEntry(database, {
        ...options,

        category:
            options.category ||
            HISTORY_CATEGORIES.PERSONAL,

        type:
            options.type ||
            HISTORY_TYPES.MILESTONE,

        importance:
            options.importance ||
            HISTORY_IMPORTANCE.IMPORTANT,

        title,
        description,

        milestone: true
    });
}

/* ============================================================
   REGISTROS ESPECÍFICOS
   ============================================================ */

function recordBirth(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.LIFE,
        type: HISTORY_TYPES.BIRTH,
        importance: HISTORY_IMPORTANCE.MAJOR,
        title: data.title || "Nascimento",
        description:
            data.description ||
            "Nascimento do personagem.",
        milestone: true
    });
}

function recordBirthday(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.LIFE,
        type: HISTORY_TYPES.BIRTHDAY,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.NORMAL,
        title: data.title || "Aniversário",
        description:
            data.description ||
            `O personagem completou ${data.age ?? historyGetAge(database)} anos.`
    });
}

function recordDeath(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.LIFE,
        type: HISTORY_TYPES.DEATH,
        importance: HISTORY_IMPORTANCE.LEGENDARY,
        title: data.title || "Falecimento",
        description:
            data.description ||
            "Fim da vida do personagem.",
        milestone: true
    });
}

function recordRelationship(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.RELATIONSHIP,
        type:
            data.type ||
            HISTORY_TYPES.RELATIONSHIP_CHANGED,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.NORMAL,
        title:
            data.title ||
            "Mudança de relacionamento",
        description:
            data.description ||
            "O relacionamento do personagem mudou."
    });
}

function recordMarriage(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.RELATIONSHIP,
        type: HISTORY_TYPES.MARRIAGE,
        importance: HISTORY_IMPORTANCE.MAJOR,
        title: data.title || "Casamento",
        description:
            data.description ||
            "O personagem se casou.",
        milestone: true
    });
}

function recordDivorce(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.RELATIONSHIP,
        type: HISTORY_TYPES.DIVORCE,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.IMPORTANT,
        title: data.title || "Divórcio",
        description:
            data.description ||
            "O casamento chegou ao fim."
    });
}

function recordChildBirth(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.FAMILY,
        type: HISTORY_TYPES.CHILD_BIRTH,
        importance: HISTORY_IMPORTANCE.MAJOR,
        title: data.title || "Nascimento de filho",
        description:
            data.description ||
            "Um novo membro entrou para a família.",
        milestone: true
    });
}

function recordFamily(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.FAMILY,
        type:
            data.type ||
            HISTORY_TYPES.FAMILY,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.NORMAL,
        title:
            data.title ||
            "Acontecimento familiar",
        description:
            data.description ||
            "Um acontecimento importante ocorreu na família."
    });
}

function recordEducation(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.EDUCATION,
        type:
            data.type ||
            HISTORY_TYPES.EDUCATION_COMPLETED,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.NORMAL,
        title:
            data.title ||
            "Educação",
        description:
            data.description ||
            "O personagem teve uma mudança na vida acadêmica."
    });
}

function recordEmployment(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.EMPLOYMENT,
        type:
            data.type ||
            HISTORY_TYPES.JOB_STARTED,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.NORMAL,
        title:
            data.title ||
            "Trabalho",
        description:
            data.description ||
            "O personagem teve uma mudança profissional."
    });
}

function recordFinance(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.FINANCE,
        type:
            data.type ||
            HISTORY_TYPES.MONEY_GAIN,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.NORMAL,
        title:
            data.title ||
            "Acontecimento financeiro",
        description:
            data.description ||
            "Houve uma mudança financeira importante."
    });
}

function recordHealth(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.HEALTH,
        type:
            data.type ||
            HISTORY_TYPES.HEALTH,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.NORMAL,
        title:
            data.title ||
            "Saúde",
        description:
            data.description ||
            "A saúde do personagem sofreu uma alteração."
    });
}

function recordResidence(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.RESIDENCE,
        type:
            data.type ||
            HISTORY_TYPES.MOVE,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.NORMAL,
        title:
            data.title ||
            "Mudança de residência",
        description:
            data.description ||
            "O personagem mudou de residência."
    });
}

function recordVehicle(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.VEHICLE,
        type:
            data.type ||
            HISTORY_TYPES.VEHICLE_PURCHASE,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.NORMAL,
        title:
            data.title ||
            "Veículo",
        description:
            data.description ||
            "O personagem teve uma mudança relacionada a veículo."
    });
}

function recordLifestyle(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.LIFESTYLE,
        type:
            data.type ||
            HISTORY_TYPES.MILESTONE,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.NORMAL,
        title:
            data.title ||
            "Mudança de estilo de vida",
        description:
            data.description ||
            "O padrão de vida do personagem mudou."
    });
}

/* ============================================================
   MMA
   ============================================================ */

function recordFight(database, data = {}) {
    const result = historyNormalizeText(
        data.result,
        "unknown"
    ).toLowerCase();

    let type = HISTORY_TYPES.FIGHT;

    if (
        result === "win" ||
        result === "won" ||
        result === "victory"
    ) {
        type = HISTORY_TYPES.FIGHT_WIN;
    } else if (
        result === "loss" ||
        result === "lost" ||
        result === "defeat"
    ) {
        type = HISTORY_TYPES.FIGHT_LOSS;
    } else if (
        result === "draw" ||
        result === "empate"
    ) {
        type = HISTORY_TYPES.FIGHT_DRAW;
    }

    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.MMA,
        type,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.IMPORTANT,
        title:
            data.title ||
            "Luta de MMA",
        description:
            data.description ||
            "O personagem participou de uma luta profissional ou amadora.",
        metadata: {
            ...data.metadata,
            opponentId:
                data.opponentId ||
                data.opponent?.id ||
                null,
            opponentName:
                data.opponentName ||
                data.opponent?.name ||
                null,
            result,
            method: data.method || null,
            round: data.round || null,
            time: data.time || null,
            eventId: data.eventId || null,
            promotionId: data.promotionId || null
        }
    });
}

function recordContract(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.MMA,
        type: HISTORY_TYPES.CONTRACT,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.IMPORTANT,
        title:
            data.title ||
            "Novo contrato",
        description:
            data.description ||
            "O personagem assinou um novo contrato."
    });
}

function recordPromotionChange(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.MMA,
        type: HISTORY_TYPES.PROMOTION_CHANGE,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.IMPORTANT,
        title:
            data.title ||
            "Mudança de organização",
        description:
            data.description ||
            "O personagem mudou de organização."
    });
}

function recordRanking(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.MMA,
        type: HISTORY_TYPES.RANKING,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.IMPORTANT,
        title:
            data.title ||
            "Mudança no ranking",
        description:
            data.description ||
            "A posição do personagem no ranking mudou."
    });
}

function recordTitle(database, data = {}) {
    const won = data.won !== false;

    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.MMA,
        type: won
            ? HISTORY_TYPES.TITLE_WON
            : HISTORY_TYPES.TITLE_LOST,
        importance: HISTORY_IMPORTANCE.MAJOR,
        title:
            data.title ||
            (won ? "Título conquistado" : "Título perdido"),
        description:
            data.description ||
            (
                won
                    ? "O personagem conquistou um título."
                    : "O personagem perdeu um título."
            ),
        milestone: won
    });
}

function recordRetirement(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.MMA,
        type: HISTORY_TYPES.RETIREMENT,
        importance: HISTORY_IMPORTANCE.LEGENDARY,
        title:
            data.title ||
            "Aposentadoria",
        description:
            data.description ||
            "O personagem encerrou sua carreira no MMA.",
        milestone: true
    });
}

/* ============================================================
   LEGADO / DINASTIA
   ============================================================ */

function recordLegacy(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.LEGACY,
        type:
            data.type ||
            HISTORY_TYPES.LEGACY,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.MAJOR,
        title:
            data.title ||
            "Marco de legado",
        description:
            data.description ||
            "O personagem alcançou um novo marco de legado.",
        milestone: data.milestone !== false
    });
}

function recordInheritance(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.DYNASTY,
        type: HISTORY_TYPES.INHERITANCE,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.LEGENDARY,
        title:
            data.title ||
            "Herança",
        description:
            data.description ||
            "Uma transferência de patrimônio ocorreu dentro da dinastia.",
        milestone: true
    });
}

function recordDynasty(database, data = {}) {
    return addHistoryEntry(database, {
        ...data,
        category: HISTORY_CATEGORIES.DYNASTY,
        type: HISTORY_TYPES.DYNASTY,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.MAJOR,
        title:
            data.title ||
            "Marco da dinastia",
        description:
            data.description ||
            "A dinastia alcançou um novo marco.",
        milestone: data.milestone !== false
    });
}

/* ============================================================
   EVENTOS DO LIFE EVENTS
   ============================================================ */

function recordEvent(database, event = {}) {
    const categoryMap = {
        relationship: HISTORY_CATEGORIES.RELATIONSHIP,
        family: HISTORY_CATEGORIES.FAMILY,
        career: HISTORY_CATEGORIES.CAREER,
        education: HISTORY_CATEGORIES.EDUCATION,
        finance: HISTORY_CATEGORIES.FINANCE,
        health: HISTORY_CATEGORIES.HEALTH,
        residence: HISTORY_CATEGORIES.RESIDENCE,
        vehicle: HISTORY_CATEGORIES.VEHICLE,
        social: HISTORY_CATEGORIES.SOCIAL,
        travel: HISTORY_CATEGORIES.TRAVEL,
        mma: HISTORY_CATEGORIES.MMA,
        personal: HISTORY_CATEGORIES.PERSONAL,
        rare: HISTORY_CATEGORIES.PERSONAL,
        life: HISTORY_CATEGORIES.LIFE
    };

    const category =
        categoryMap[event.category] ||
        HISTORY_CATEGORIES.OTHER;

    const importance =
        event.importance ||
        HISTORY_IMPORTANCE.NORMAL;

    return addHistoryEntry(database, {
        id:
            event.historyId ||
            historyGenerateId("event_history"),

        category,

        type:
            event.type ||
            HISTORY_TYPES.EVENT,

        importance,

        title:
            event.title ||
            "Evento da vida",

        description:
            event.description ||
            event.text ||
            "Um acontecimento ocorreu na vida do personagem.",

        date: event.date,

        year: event.year,

        week: event.week,

        age: event.age,

        tags: [
            ...(Array.isArray(event.tags)
                ? event.tags
                : []),
            "life-event"
        ],

        relatedIds: event.relatedIds || [],

        metadata: {
            eventType: event.type || null,
            rarity: event.rarity || null,
            status: event.status || null,
            outcome: event.outcome || null,
            sourceEvent: true
        },

        source: "lifeEvents",

        eventId: event.id || null,

        milestone:
            Boolean(event.milestone)
    });
}

function recordDecision(database, decision = {}) {
    return addHistoryEntry(database, {
        ...decision,

        category:
            decision.category ||
            HISTORY_CATEGORIES.PERSONAL,

        type:
            HISTORY_TYPES.DECISION,

        importance:
            decision.importance ||
            HISTORY_IMPORTANCE.IMPORTANT,

        title:
            decision.title ||
            "Decisão importante",

        description:
            decision.description ||
            "O personagem tomou uma decisão que alterou sua trajetória.",

        metadata: {
            ...decision.metadata,
            decisionId:
                decision.decisionId ||
                decision.id ||
                null,
            selectedOption:
                decision.selectedOption ||
                decision.option ||
                null
        },

        source: decision.source || "lifeEvents"
    });
}

/* ============================================================
   CONSULTAS
   ============================================================ */

function getHistoryEntries(database, options = {}) {
    const state = ensureLifeHistoryState(database);

    let entries = [...state.entries];

    if (options.category) {
        entries = entries.filter(
            entry =>
                entry.category ===
                normalizeHistoryCategory(
                    options.category
                )
        );
    }

    if (options.type) {
        entries = entries.filter(
            entry =>
                entry.type ===
                normalizeHistoryType(
                    options.type
                )
        );
    }

    if (options.year !== undefined) {
        entries = entries.filter(
            entry =>
                Number(entry.year) ===
                Number(options.year)
        );
    }

    if (options.month !== undefined) {
        entries = entries.filter(
            entry =>
                Number(entry.month) ===
                Number(options.month)
        );
    }

    if (options.age !== undefined) {
        entries = entries.filter(
            entry =>
                Number(entry.age) ===
                Number(options.age)
        );
    }

    if (options.minAge !== undefined) {
        entries = entries.filter(
            entry =>
                Number(entry.age) >=
                Number(options.minAge)
        );
    }

    if (options.maxAge !== undefined) {
        entries = entries.filter(
            entry =>
                Number(entry.age) <=
                Number(options.maxAge)
        );
    }

    if (options.minImportance !== undefined) {
        entries = entries.filter(
            entry =>
                entry.importance >=
                Number(options.minImportance)
        );
    }

    if (options.milestone !== undefined) {
        entries = entries.filter(
            entry =>
                entry.milestone ===
                Boolean(options.milestone)
        );
    }

    if (options.source) {
        entries = entries.filter(
            entry =>
                entry.source ===
                options.source
        );
    }

    if (options.tag) {
        const tag = String(options.tag).toLowerCase();

        entries = entries.filter(
            entry =>
                entry.tags.some(
                    item =>
                        String(item).toLowerCase() ===
                        tag
                )
        );
    }

    if (options.search) {
        const search = String(
            options.search
        ).toLowerCase();

        entries = entries.filter(entry => {
            const text = [
                entry.title,
                entry.description,
                entry.category,
                entry.type,
                ...entry.tags
            ]
                .join(" ")
                .toLowerCase();

            return text.includes(search);
        });
    }

    entries.sort(compareHistoryEntries);

    if (options.descending) {
        entries.reverse();
    }

    if (options.limit !== undefined) {
        const limit = historyClamp(
            Number(options.limit),
            1,
            HISTORY_CONFIG.maxSearchResults
        );

        entries = entries.slice(0, limit);
    }

    return cloneHistoryData(entries);
}

function getHistoryById(database, id) {
    const state = ensureLifeHistoryState(database);

    const entry = state.entries.find(
        item => item.id === id
    );

    return entry
        ? cloneHistoryData(entry)
        : null;
}

function findHistory(database, predicate) {
    const state = ensureLifeHistoryState(database);

    if (typeof predicate !== "function") {
        return null;
    }

    const entry = state.entries.find(predicate);

    return entry
        ? cloneHistoryData(entry)
        : null;
}

function searchHistory(database, text, options = {}) {
    return getHistoryEntries(database, {
        ...options,
        search: text
    });
}

function getLatestHistory(database, count = 10) {
    return getHistoryEntries(database, {
        descending: true,
        limit: count
    });
}

function getFirstHistory(database, count = 10) {
    return getHistoryEntries(database, {
        descending: false,
        limit: count
    });
}

function getLatestMilestones(database, count = 10) {
    const state = ensureLifeHistoryState(database);

    return cloneHistoryData(
        [...state.milestones]
            .sort(compareHistoryEntries)
            .reverse()
            .slice(0, count)
    );
}

/* ============================================================
   LINHA DO TEMPO
   ============================================================ */

function getTimeline(database, options = {}) {
    const entries = getHistoryEntries(
        database,
        options
    );

    const grouped = {};

    for (const entry of entries) {
        const key =
            options.groupBy === "age"
                ? `age_${entry.age}`
                : options.groupBy === "month"
                    ? `year_${entry.year}_month_${entry.month}`
                    : `year_${entry.year}`;

        if (!grouped[key]) {
            grouped[key] = {
                key,
                year: entry.year,
                month: entry.month,
                age: entry.age,
                entries: []
            };
        }

        grouped[key].entries.push(entry);
    }

    return Object.values(grouped).sort(
        (a, b) => {
            if (a.year !== b.year) {
                return a.year - b.year;
            }

            if (
                a.month !== null &&
                b.month !== null &&
                a.month !== b.month
            ) {
                return a.month - b.month;
            }

            return (
                historyNormalizeNumber(a.age, 0) -
                historyNormalizeNumber(b.age, 0)
            );
        }
    );
}

function getYearTimeline(database, year) {
    return getTimeline(database, {
        year
    });
}

function getAgeTimeline(database, age) {
    return getTimeline(database, {
        age
    });
}

/* ============================================================
   RESUMOS
   ============================================================ */

function getYearSummary(database, year) {
    const entries = getHistoryEntries(
        database,
        { year }
    );

    return buildHistorySummary(
        entries,
        {
            type: "year",
            value: year
        }
    );
}

function getAgeSummary(database, age) {
    const entries = getHistoryEntries(
        database,
        { age }
    );

    return buildHistorySummary(
        entries,
        {
            type: "age",
            value: age
        }
    );
}

function buildHistorySummary(
    entries,
    period = {}
) {
    const summary = {
        type: period.type || "custom",
        value:
            period.value !== undefined
                ? period.value
                : null,

        total: entries.length,

        important: 0,
        major: 0,
        legendary: 0,

        categories: {},
        types: {},

        milestones: 0,

        wins: 0,
        losses: 0,
        draws: 0,

        financialGain: 0,
        financialLoss: 0,

        entries: cloneHistoryData(entries)
    };

    for (const entry of entries) {
        summary.categories[entry.category] =
            (summary.categories[entry.category] || 0) + 1;

        summary.types[entry.type] =
            (summary.types[entry.type] || 0) + 1;

        if (
            entry.importance >=
            HISTORY_IMPORTANCE.IMPORTANT
        ) {
            summary.important++;
        }

        if (
            entry.importance >=
            HISTORY_IMPORTANCE.MAJOR
        ) {
            summary.major++;
        }

        if (
            entry.importance >=
            HISTORY_IMPORTANCE.LEGENDARY
        ) {
            summary.legendary++;
        }

        if (entry.milestone) {
            summary.milestones++;
        }

        if (entry.type === HISTORY_TYPES.FIGHT_WIN) {
            summary.wins++;
        }

        if (entry.type === HISTORY_TYPES.FIGHT_LOSS) {
            summary.losses++;
        }

        if (entry.type === HISTORY_TYPES.FIGHT_DRAW) {
            summary.draws++;
        }

        if (entry.type === HISTORY_TYPES.MONEY_GAIN) {
            summary.financialGain +=
                historyNormalizeNumber(
                    entry.metadata?.amount,
                    0
                );
        }

        if (entry.type === HISTORY_TYPES.MONEY_LOSS) {
            summary.financialLoss +=
                historyNormalizeNumber(
                    entry.metadata?.amount,
                    0
                );
        }
    }

    return summary;
}

/* ============================================================
   REGISTRO FINANCEIRO
   ============================================================ */

function recordMoneyGain(
    database,
    amount,
    data = {}
) {
    return recordFinance(database, {
        ...data,
        type: HISTORY_TYPES.MONEY_GAIN,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.NORMAL,
        title:
            data.title ||
            "Dinheiro recebido",
        description:
            data.description ||
            `O personagem recebeu ${amount}.`,
        metadata: {
            ...data.metadata,
            amount: historyNormalizeNumber(amount)
        }
    });
}

function recordMoneyLoss(
    database,
    amount,
    data = {}
) {
    return recordFinance(database, {
        ...data,
        type: HISTORY_TYPES.MONEY_LOSS,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.NORMAL,
        title:
            data.title ||
            "Dinheiro gasto",
        description:
            data.description ||
            `O personagem gastou ${amount}.`,
        metadata: {
            ...data.metadata,
            amount: historyNormalizeNumber(amount)
        }
    });
}

function recordWealthMilestone(
    database,
    netWorth,
    data = {}
) {
    return recordFinance(database, {
        ...data,
        type: HISTORY_TYPES.WEALTH_MILESTONE,
        importance:
            data.importance ||
            HISTORY_IMPORTANCE.MAJOR,
        title:
            data.title ||
            "Marco de patrimônio",
        description:
            data.description ||
            `O patrimônio alcançou ${netWorth}.`,
        metadata: {
            ...data.metadata,
            netWorth:
                historyNormalizeNumber(netWorth)
        },
        milestone: true
    });
}

/* ============================================================
   ARQUIVAMENTO
   ============================================================ */

function archiveOldHistory(database) {
    const state = ensureLifeHistoryState(database);

    if (
        !state.settings.autoArchive ||
        state.entries.length <=
        HISTORY_CONFIG.archiveAfterEntries
    ) {
        return 0;
    }

    const keep =
        state.settings.keepRecentEntries ||
        HISTORY_CONFIG.keepRecentEntries;

    const amountToArchive =
        state.entries.length - keep;

    if (amountToArchive <= 0) {
        return 0;
    }

    const archived =
        state.entries.splice(
            0,
            amountToArchive
        );

    state.archive.push(...archived);

    rebuildHistoryIndexes(database);
    rebuildHistoryStats(database);

    return archived.length;
}

function enforceHistoryLimits(database) {
    const state = ensureLifeHistoryState(database);

    if (
        state.entries.length >
        HISTORY_CONFIG.archiveAfterEntries
    ) {
        archiveOldHistory(database);
    }

    if (
        state.entries.length >
        state.settings.maxEntries
    ) {
        const excess =
            state.entries.length -
            state.settings.maxEntries;

        state.entries =
            state.entries.slice(excess);
    }

    if (
        state.archive.length >
        HISTORY_CONFIG.maxEntries
    ) {
        state.archive =
            state.archive.slice(
                -HISTORY_CONFIG.maxEntries
            );
    }

    rebuildHistoryIndexes(database);
    rebuildHistoryStats(database);

    return state;
}

function clearHistoryArchive(database) {
    const state = ensureLifeHistoryState(database);

    state.archive = [];

    return true;
}

/* ============================================================
   REMOÇÃO
   ============================================================ */

function removeHistoryEntry(database, id) {
    const state = ensureLifeHistoryState(database);

    const index = state.entries.findIndex(
        entry => entry.id === id
    );

    if (index === -1) {
        return null;
    }

    const removed =
        state.entries.splice(index, 1)[0];

    state.milestones =
        state.milestones.filter(
            entry => entry.id !== id
        );

    rebuildHistoryIndexes(database);
    rebuildHistoryStats(database);

    return cloneHistoryData(removed);
}

function clearHistory(database) {
    const state = ensureLifeHistoryState(database);

    state.entries = [];
    state.milestones = [];
    state.archive = [];

    rebuildHistoryIndexes(database);
    rebuildHistoryStats(database);

    return true;
}

/* ============================================================
   PONTUAÇÃO DA VIDA
   ============================================================ */

function calculateLifeHistoryScore(database) {
    const state = ensureLifeHistoryState(database);

    let score = 0;

    for (const entry of state.entries) {
        score += entry.importance * 2;

        if (entry.milestone) {
            score += 10;
        }

        if (entry.type === HISTORY_TYPES.FIGHT_WIN) {
            score += 8;
        }

        if (entry.type === HISTORY_TYPES.TITLE_WON) {
            score += 50;
        }

        if (entry.type === HISTORY_TYPES.RETIREMENT) {
            score += 25;
        }

        if (entry.type === HISTORY_TYPES.MARRIAGE) {
            score += 15;
        }

        if (entry.type === HISTORY_TYPES.CHILD_BIRTH) {
            score += 20;
        }

        if (entry.type === HISTORY_TYPES.WEALTH_MILESTONE) {
            score += 20;
        }

        if (entry.type === HISTORY_TYPES.LEGACY) {
            score += 30;
        }

        if (entry.type === HISTORY_TYPES.DYNASTY) {
            score += 40;
        }
    }

    return Math.max(
        0,
        Math.round(score)
    );
}

/* ============================================================
   SNAPSHOT
   ============================================================ */

function getLifeHistorySnapshot(database) {
    const state = ensureLifeHistoryState(database);

    return {
        version: LIFE_HISTORY_VERSION,

        entries: cloneHistoryData(
            state.entries
        ),

        milestones: cloneHistoryData(
            state.milestones
        ),

        archiveCount:
            state.archive.length,

        stats: cloneHistoryData(
            state.stats
        ),

        score:
            calculateLifeHistoryScore(
                database
            )
    };
}

/* ============================================================
   VALIDAÇÃO
   ============================================================ */

function validateLifeHistory(database) {
    const state = ensureLifeHistoryState(database);

    const errors = [];
    const warnings = [];

    if (!Array.isArray(state.entries)) {
        errors.push(
            "entries deve ser um array."
        );
    }

    if (!Array.isArray(state.milestones)) {
        errors.push(
            "milestones deve ser um array."
        );
    }

    if (!Array.isArray(state.archive)) {
        errors.push(
            "archive deve ser um array."
        );
    }

    const ids = new Set();

    for (const entry of state.entries) {
        if (!entry.id) {
            errors.push(
                "Existe uma entrada sem ID."
            );
        }

        if (ids.has(entry.id)) {
            errors.push(
                `ID de histórico duplicado: ${entry.id}`
            );
        }

        ids.add(entry.id);

        if (!entry.title) {
            warnings.push(
                `Entrada ${entry.id} sem título.`
            );
        }

        if (!entry.category) {
            warnings.push(
                `Entrada ${entry.id} sem categoria.`
            );
        }

        if (!entry.type) {
            warnings.push(
                `Entrada ${entry.id} sem tipo.`
            );
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        totalEntries: state.entries.length,
        totalMilestones:
            state.milestones.length,
        archiveCount:
            state.archive.length
    };
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

function initializeLifeHistory(database) {
    const state = ensureLifeHistoryState(database);

    rebuildHistoryIndexes(database);
    rebuildHistoryStats(database);

    return state;
}

function resetLifeHistory(database) {
    if (!database) {
        return null;
    }

    if (!database.life) {
        database.life = {};
    }

    database.life.history =
        createEmptyLifeHistoryState();

    return database.life.history;
}

/* ============================================================
   CONFIGURAÇÕES
   ============================================================ */

function configureLifeHistory(
    database,
    settings = {}
) {
    const state = ensureLifeHistoryState(database);

    if (settings.maxEntries !== undefined) {
        state.settings.maxEntries =
            historyClamp(
                settings.maxEntries,
                100,
                50000
            );
    }

    if (
        settings.keepRecentEntries !==
        undefined
    ) {
        state.settings.keepRecentEntries =
            historyClamp(
                settings.keepRecentEntries,
                100,
                50000
            );
    }

    if (
        settings.autoArchive !==
        undefined
    ) {
        state.settings.autoArchive =
            Boolean(
                settings.autoArchive
            );
    }

    enforceHistoryLimits(database);

    return cloneHistoryData(
        state.settings
    );
}

/* ============================================================
   API
   ============================================================ */

const lifeHistoryAPI = {
    version: LIFE_HISTORY_VERSION,

    categories: HISTORY_CATEGORIES,
    types: HISTORY_TYPES,
    importance: HISTORY_IMPORTANCE,
    config: HISTORY_CONFIG,

    createEmptyState:
        createEmptyLifeHistoryState,

    ensureState:
        ensureLifeHistoryState,

    initialize:
        initializeLifeHistory,

    reset:
        resetLifeHistory,

    configure:
        configureLifeHistory,

    normalizeEntry:
        normalizeHistoryEntry,

    add:
        addHistoryEntry,

    remove:
        removeHistoryEntry,

    clear:
        clearHistory,

    getById:
        getHistoryById,

    find:
        findHistory,

    getEntries:
        getHistoryEntries,

    search:
        searchHistory,

    latest:
        getLatestHistory,

    first:
        getFirstHistory,

    getMilestones:
        getLatestMilestones,

    addMilestone,

    recordMilestone,

    recordBirth,
    recordBirthday,
    recordDeath,

    recordRelationship,
    recordMarriage,
    recordDivorce,

    recordChildBirth,
    recordFamily,

    recordEducation,
    recordEmployment,

    recordFinance,
    recordMoneyGain,
    recordMoneyLoss,
    recordWealthMilestone,

    recordHealth,
    recordResidence,
    recordVehicle,
    recordLifestyle,

    recordFight,
    recordContract,
    recordPromotionChange,
    recordRanking,
    recordTitle,
    recordRetirement,

    recordLegacy,
    recordInheritance,
    recordDynasty,

    recordEvent,
    recordDecision,

    getTimeline,
    getYearTimeline,
    getAgeTimeline,

    getYearSummary,
    getAgeSummary,

    archive:
        archiveOldHistory,

    clearArchive:
        clearHistoryArchive,

    enforceLimits:
        enforceHistoryLimits,

    calculateScore:
        calculateLifeHistoryScore,

    getSnapshot:
        getLifeHistorySnapshot,

    validate:
        validateLifeHistory,

    sort:
        sortHistory,

    rebuildIndexes:
        rebuildHistoryIndexes,

    rebuildStats:
        rebuildHistoryStats
};

/* ============================================================
   EXPORTS
   ============================================================ */

export {
    LIFE_HISTORY_VERSION,

    HISTORY_CATEGORIES,
    HISTORY_TYPES,
    HISTORY_IMPORTANCE,
    HISTORY_CONFIG,

    createEmptyLifeHistoryState,
    ensureLifeHistoryState,

    normalizeHistoryEntry,

    addHistoryEntry,
    removeHistoryEntry,
    clearHistory,

    addMilestone,
    recordMilestone,

    recordBirth,
    recordBirthday,
    recordDeath,

    recordRelationship,
    recordMarriage,
    recordDivorce,

    recordChildBirth,
    recordFamily,

    recordEducation,
    recordEmployment,

    recordFinance,
    recordMoneyGain,
    recordMoneyLoss,
    recordWealthMilestone,

    recordHealth,
    recordResidence,
    recordVehicle,
    recordLifestyle,

    recordFight,
    recordContract,
    recordPromotionChange,
    recordRanking,
    recordTitle,
    recordRetirement,

    recordLegacy,
    recordInheritance,
    recordDynasty,

    recordEvent,
    recordDecision,

    getHistoryEntries,
    getHistoryById,
    findHistory,
    searchHistory,

    getLatestHistory,
    getFirstHistory,
    getLatestMilestones,

    getTimeline,
    getYearTimeline,
    getAgeTimeline,

    getYearSummary,
    getAgeSummary,

    archiveOldHistory,
    clearHistoryArchive,
    enforceHistoryLimits,

    calculateLifeHistoryScore,

    getLifeHistorySnapshot,

    validateLifeHistory,

    initializeLifeHistory,
    resetLifeHistory,
    configureLifeHistory,

    rebuildHistoryIndexes,
    rebuildHistoryStats,

    lifeHistoryAPI
};

export default lifeHistoryAPI;
