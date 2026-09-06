/* ============================================================
   MMA LIFE DYNASTY
   LIFE EVENTS SYSTEM
   Arquivo: js/life/lifeEvents.js
   Versão: 1
   ============================================================ */

const LIFE_EVENTS_VERSION = 1;

/* ============================================================
   CONSTANTES
   ============================================================ */

const LIFE_EVENT_CATEGORIES = {
    LIFE: "life",
    RELATIONSHIP: "relationship",
    FAMILY: "family",
    CAREER: "career",
    EDUCATION: "education",
    FINANCE: "finance",
    HEALTH: "health",
    RESIDENCE: "residence",
    VEHICLE: "vehicle",
    SOCIAL: "social",
    TRAVEL: "travel",
    MMA: "mma",
    PERSONAL: "personal",
    RARE: "rare",
    CHOICE: "choice"
};

const LIFE_EVENT_TYPES = {
    BIRTH: "birth",
    BIRTHDAY: "birthday",
    RELATIONSHIP: "relationship",
    DATING: "dating",
    ENGAGEMENT: "engagement",
    MARRIAGE: "marriage",
    SEPARATION: "separation",
    DIVORCE: "divorce",
    CHILD_BIRTH: "child_birth",
    FAMILY: "family",
    FRIENDSHIP: "friendship",
    RIVALRY: "rivalry",

    EDUCATION_START: "education_start",
    EDUCATION_COMPLETE: "education_complete",
    EDUCATION_FAILURE: "education_failure",

    JOB_START: "job_start",
    JOB_PROMOTION: "job_promotion",
    JOB_LOSS: "job_loss",
    BUSINESS: "business",

    MONEY_GAIN: "money_gain",
    MONEY_LOSS: "money_loss",
    INVESTMENT: "investment",
    DEBT: "debt",
    WEALTH: "wealth",

    HEALTH: "health",
    INJURY: "injury",
    RECOVERY: "recovery",

    MOVE: "move",
    HOME_PURCHASE: "home_purchase",
    HOME_SALE: "home_sale",

    VEHICLE_PURCHASE: "vehicle_purchase",
    VEHICLE_LOSS: "vehicle_loss",

    TRAVEL: "travel",
    SOCIAL: "social",
    CELEBRATION: "celebration",

    MMA_FIGHT: "mma_fight",
    MMA_CONTRACT: "mma_contract",
    MMA_TITLE: "mma_title",
    MMA_RETIREMENT: "mma_retirement",

    PERSONAL_SUCCESS: "personal_success",
    PERSONAL_FAILURE: "personal_failure",

    RANDOM_POSITIVE: "random_positive",
    RANDOM_NEGATIVE: "random_negative",
    RANDOM_NEUTRAL: "random_neutral",

    RARE: "rare",
    CHOICE: "choice",
    CUSTOM: "custom"
};

const LIFE_EVENT_RARITIES = {
    COMMON: "common",
    UNCOMMON: "uncommon",
    RARE: "rare",
    VERY_RARE: "very_rare",
    LEGENDARY: "legendary"
};

const LIFE_EVENT_STATUS = {
    AVAILABLE: "available",
    ACTIVE: "active",
    SCHEDULED: "scheduled",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    EXPIRED: "expired"
};

const LIFE_EVENT_OUTCOMES = {
    POSITIVE: "positive",
    NEGATIVE: "negative",
    NEUTRAL: "neutral",
    MIXED: "mixed"
};

const LIFE_EVENT_CONFIG = {
    maxActiveEvents: 10,
    maxHistory: 500,
    maxDecisions: 300,
    maxCooldowns: 300,

    monthlyGenerationChance: 0.45,
    rareEventChance: 0.03,
    veryRareEventChance: 0.008,
    legendaryEventChance: 0.001,

    defaultDurationMonths: 1,
    decisionDurationMonths: 1
};

/* ============================================================
   UTILITÁRIOS
   ============================================================ */

function clone(value) {
    if (value === undefined) return undefined;

    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function random(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(random(min, max + 1));
}

function chance(probability) {
    return Math.random() < probability;
}

function generateId(prefix = "life_event") {
    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 10)}`;
}

function normalizeText(value, fallback = "") {
    if (value === null || value === undefined) return fallback;
    return String(value).trim();
}

function normalizeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
}

function getPath(object, path, fallback = undefined) {
    if (!object || !path) return fallback;

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

function setPath(object, path, value) {
    if (!object || !path) return false;

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

function addPath(object, path, amount) {
    const current = normalizeNumber(getPath(object, path, 0));
    return setPath(object, path, current + normalizeNumber(amount));
}

function multiplyPath(object, path, multiplier) {
    const current = normalizeNumber(getPath(object, path, 0));
    return setPath(object, path, current * normalizeNumber(multiplier, 1));
}

function getPlayer(database) {
    return database?.player || null;
}

function getPlayerAge(database) {
    const player = getPlayer(database);

    return normalizeNumber(
        player?.age ??
        player?.identity?.age ??
        player?.personal?.age,
        0
    );
}

function getCurrentDate(database) {
    return database?.meta?.currentDate ||
        database?.calendar?.currentDate ||
        null;
}

function getCurrentMonth(database) {
    return normalizeNumber(
        database?.calendar?.month ??
        database?.meta?.currentMonth ??
        1,
        1
    );
}

function getCurrentYear(database) {
    return normalizeNumber(
        database?.calendar?.year ??
        database?.meta?.currentYear ??
        1,
        1
    );
}

function getCareerStage(database) {
    return database?.career?.stage ||
        database?.player?.careerStage ||
        "Amateur";
}

function getCash(database) {
    return normalizeNumber(
        database?.business?.finances?.cash ??
        database?.business?.cash ??
        database?.finances?.cash,
        0
    );
}

function getNetWorth(database) {
    return normalizeNumber(
        database?.business?.wealth?.netWorth ??
        database?.business?.finances?.netWorth ??
        database?.wealth?.netWorth ??
        getCash(database),
        getCash(database)
    );
}

/* ============================================================
   TEMPLATES DE EVENTOS
   ============================================================ */

const LIFE_EVENT_TEMPLATES = [
    {
        id: "birthday",
        category: LIFE_EVENT_CATEGORIES.LIFE,
        type: LIFE_EVENT_TYPES.BIRTHDAY,
        rarity: LIFE_EVENT_RARITIES.COMMON,
        outcome: LIFE_EVENT_OUTCOMES.NEUTRAL,
        weight: 100,
        minAge: 1,
        title: "Aniversário",
        description: "Você completou mais um ano de vida.",
        tags: ["idade", "vida"]
    },

    {
        id: "new_friend",
        category: LIFE_EVENT_CATEGORIES.RELATIONSHIP,
        type: LIFE_EVENT_TYPES.FRIENDSHIP,
        rarity: LIFE_EVENT_RARITIES.COMMON,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 25,
        minAge: 8,
        title: "Nova amizade",
        description: "Você conheceu alguém com quem pode construir uma grande amizade.",
        effects: [
            {
                type: "add",
                path: "media.reputation",
                value: 1
            }
        ],
        tags: ["amizade", "social"]
    },

    {
        id: "romantic_interest",
        category: LIFE_EVENT_CATEGORIES.RELATIONSHIP,
        type: LIFE_EVENT_TYPES.DATING,
        rarity: LIFE_EVENT_RARITIES.COMMON,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 18,
        minAge: 14,
        title: "Novo interesse amoroso",
        description: "Alguém especial entrou na sua vida.",
        tags: ["romance", "relacionamento"]
    },

    {
        id: "serious_relationship",
        category: LIFE_EVENT_CATEGORIES.RELATIONSHIP,
        type: LIFE_EVENT_TYPES.RELATIONSHIP,
        rarity: LIFE_EVENT_RARITIES.UNCOMMON,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 10,
        minAge: 18,
        title: "Relacionamento sério",
        description: "Seu relacionamento começou a ficar mais sério.",
        tags: ["romance", "relacionamento"]
    },

    {
        id: "engagement",
        category: LIFE_EVENT_CATEGORIES.RELATIONSHIP,
        type: LIFE_EVENT_TYPES.ENGAGEMENT,
        rarity: LIFE_EVENT_RARITIES.UNCOMMON,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 6,
        minAge: 18,
        title: "Noivado",
        description: "Seu relacionamento avançou para uma nova etapa.",
        tags: ["noivado", "família"]
    },

    {
        id: "marriage",
        category: LIFE_EVENT_CATEGORIES.RELATIONSHIP,
        type: LIFE_EVENT_TYPES.MARRIAGE,
        rarity: LIFE_EVENT_RARITIES.UNCOMMON,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 5,
        minAge: 18,
        title: "Casamento",
        description: "Você decidiu construir uma vida ao lado de alguém.",
        tags: ["casamento", "família"]
    },

    {
        id: "child_birth",
        category: LIFE_EVENT_CATEGORIES.FAMILY,
        type: LIFE_EVENT_TYPES.CHILD_BIRTH,
        rarity: LIFE_EVENT_RARITIES.UNCOMMON,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 5,
        minAge: 18,
        title: "Nascimento de um filho",
        description: "Uma nova geração da sua família chegou.",
        tags: ["filho", "família", "dinastia"]
    },

    {
        id: "education_start",
        category: LIFE_EVENT_CATEGORIES.EDUCATION,
        type: LIFE_EVENT_TYPES.EDUCATION_START,
        rarity: LIFE_EVENT_RARITIES.COMMON,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 12,
        minAge: 6,
        title: "Início dos estudos",
        description: "Uma nova etapa de aprendizado começou.",
        tags: ["educação", "estudos"]
    },

    {
        id: "education_complete",
        category: LIFE_EVENT_CATEGORIES.EDUCATION,
        type: LIFE_EVENT_TYPES.EDUCATION_COMPLETE,
        rarity: LIFE_EVENT_RARITIES.UNCOMMON,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 7,
        minAge: 16,
        title: "Conclusão dos estudos",
        description: "Você concluiu uma importante etapa da sua formação.",
        effects: [
            {
                type: "add",
                path: "life.education.skills",
                value: 1
            }
        ],
        tags: ["educação", "conquista"]
    },

    {
        id: "first_job",
        category: LIFE_EVENT_CATEGORIES.CAREER,
        type: LIFE_EVENT_TYPES.JOB_START,
        rarity: LIFE_EVENT_RARITIES.COMMON,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 10,
        minAge: 16,
        title: "Primeiro emprego",
        description: "Você conseguiu seu primeiro trabalho.",
        tags: ["emprego", "carreira"]
    },

    {
        id: "job_promotion",
        category: LIFE_EVENT_CATEGORIES.CAREER,
        type: LIFE_EVENT_TYPES.JOB_PROMOTION,
        rarity: LIFE_EVENT_RARITIES.UNCOMMON,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 8,
        minAge: 18,
        title: "Promoção",
        description: "Seu desempenho chamou atenção e você recebeu uma promoção.",
        effects: [
            {
                type: "add",
                path: "business.finances.cash",
                value: 500
            }
        ],
        tags: ["carreira", "dinheiro"]
    },

    {
        id: "job_loss",
        category: LIFE_EVENT_CATEGORIES.CAREER,
        type: LIFE_EVENT_TYPES.JOB_LOSS,
        rarity: LIFE_EVENT_RARITIES.UNCOMMON,
        outcome: LIFE_EVENT_OUTCOMES.NEGATIVE,
        weight: 4,
        minAge: 16,
        title: "Perda do emprego",
        description: "Você perdeu sua principal fonte de renda profissional.",
        tags: ["emprego", "problema"]
    },

    {
        id: "unexpected_money",
        category: LIFE_EVENT_CATEGORIES.FINANCE,
        type: LIFE_EVENT_TYPES.MONEY_GAIN,
        rarity: LIFE_EVENT_RARITIES.UNCOMMON,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 8,
        minAge: 16,
        title: "Dinheiro inesperado",
        description: "Uma oportunidade inesperada trouxe dinheiro para sua vida.",
        effects: [
            {
                type: "random_add",
                path: "business.finances.cash",
                min: 100,
                max: 5000
            }
        ],
        tags: ["dinheiro", "sorte"]
    },

    {
        id: "financial_problem",
        category: LIFE_EVENT_CATEGORIES.FINANCE,
        type: LIFE_EVENT_TYPES.MONEY_LOSS,
        rarity: LIFE_EVENT_RARITIES.UNCOMMON,
        outcome: LIFE_EVENT_OUTCOMES.NEGATIVE,
        weight: 7,
        minAge: 18,
        title: "Problema financeiro",
        description: "Uma despesa inesperada afetou suas finanças.",
        effects: [
            {
                type: "random_add",
                path: "business.finances.cash",
                min: -3000,
                max: -100
            }
        ],
        tags: ["dinheiro", "problema"]
    },

    {
        id: "new_home",
        category: LIFE_EVENT_CATEGORIES.RESIDENCE,
        type: LIFE_EVENT_TYPES.MOVE,
        rarity: LIFE_EVENT_RARITIES.UNCOMMON,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 5,
        minAge: 18,
        title: "Mudança de residência",
        description: "Você decidiu começar uma nova fase em outro lugar.",
        tags: ["casa", "mudança"]
    },

    {
        id: "vehicle_purchase",
        category: LIFE_EVENT_CATEGORIES.VEHICLE,
        type: LIFE_EVENT_TYPES.VEHICLE_PURCHASE,
        rarity: LIFE_EVENT_RARITIES.UNCOMMON,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 5,
        minAge: 18,
        title: "Novo veículo",
        description: "Você comprou um novo veículo para sua vida pessoal.",
        tags: ["veículo", "patrimônio"]
    },

    {
        id: "travel",
        category: LIFE_EVENT_CATEGORIES.TRAVEL,
        type: LIFE_EVENT_TYPES.TRAVEL,
        rarity: LIFE_EVENT_RARITIES.COMMON,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 7,
        minAge: 12,
        title: "Viagem",
        description: "Você teve a oportunidade de conhecer um novo lugar.",
        tags: ["viagem", "experiência"]
    },

    {
        id: "health_problem",
        category: LIFE_EVENT_CATEGORIES.HEALTH,
        type: LIFE_EVENT_TYPES.HEALTH,
        rarity: LIFE_EVENT_RARITIES.UNCOMMON,
        outcome: LIFE_EVENT_OUTCOMES.NEGATIVE,
        weight: 5,
        minAge: 18,
        title: "Problema de saúde",
        description: "Sua saúde exigiu atenção e cuidados.",
        tags: ["saúde"]
    },

    {
        id: "recovery",
        category: LIFE_EVENT_CATEGORIES.HEALTH,
        type: LIFE_EVENT_TYPES.RECOVERY,
        rarity: LIFE_EVENT_RARITIES.COMMON,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 6,
        minAge: 18,
        title: "Recuperação",
        description: "Você se recuperou de um período difícil.",
        tags: ["saúde", "recuperação"]
    },

    {
        id: "mma_opportunity",
        category: LIFE_EVENT_CATEGORIES.MMA,
        type: LIFE_EVENT_TYPES.MMA_CONTRACT,
        rarity: LIFE_EVENT_RARITIES.UNCOMMON,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 6,
        minAge: 18,
        title: "Oportunidade no MMA",
        description: "Uma nova oportunidade profissional surgiu para você.",
        conditions: [
            {
                type: "career_stage",
                values: [
                    "Regional",
                    "National",
                    "International",
                    "Elite"
                ]
            }
        ],
        tags: ["MMA", "carreira"]
    },

    {
        id: "mma_title",
        category: LIFE_EVENT_CATEGORIES.MMA,
        type: LIFE_EVENT_TYPES.MMA_TITLE,
        rarity: LIFE_EVENT_RARITIES.RARE,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 2,
        minAge: 18,
        title: "Disputa de cinturão",
        description: "Seu desempenho colocou você em posição de disputar um título.",
        conditions: [
            {
                type: "career_stage",
                values: [
                    "National",
                    "International",
                    "Elite"
                ]
            }
        ],
        tags: ["MMA", "título"]
    },

    {
        id: "social_celebration",
        category: LIFE_EVENT_CATEGORIES.SOCIAL,
        type: LIFE_EVENT_TYPES.CELEBRATION,
        rarity: LIFE_EVENT_RARITIES.COMMON,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 10,
        minAge: 12,
        title: "Grande celebração",
        description: "Você participou de um momento social importante.",
        tags: ["social", "felicidade"]
    },

    {
        id: "personal_success",
        category: LIFE_EVENT_CATEGORIES.PERSONAL,
        type: LIFE_EVENT_TYPES.PERSONAL_SUCCESS,
        rarity: LIFE_EVENT_RARITIES.UNCOMMON,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 8,
        minAge: 16,
        title: "Conquista pessoal",
        description: "Você alcançou algo importante para sua vida.",
        tags: ["conquista", "vida"]
    },

    {
        id: "personal_failure",
        category: LIFE_EVENT_CATEGORIES.PERSONAL,
        type: LIFE_EVENT_TYPES.PERSONAL_FAILURE,
        rarity: LIFE_EVENT_RARITIES.UNCOMMON,
        outcome: LIFE_EVENT_OUTCOMES.NEGATIVE,
        weight: 5,
        minAge: 16,
        title: "Fracasso temporário",
        description: "Algo que você queria não saiu como esperado.",
        tags: ["problema", "experiência"]
    },

    {
        id: "rare_luck",
        category: LIFE_EVENT_CATEGORIES.RARE,
        type: LIFE_EVENT_TYPES.RARE,
        rarity: LIFE_EVENT_RARITIES.RARE,
        outcome: LIFE_EVENT_OUTCOMES.POSITIVE,
        weight: 1,
        minAge: 18,
        title: "Grande golpe de sorte",
        description: "Uma oportunidade extremamente rara apareceu na sua vida.",
        effects: [
            {
                type: "random_add",
                path: "business.finances.cash",
                min: 5000,
                max: 50000
            },
            {
                type: "add",
                path: "media.fame",
                value: 5
            }
        ],
        tags: ["raro", "sorte", "dinheiro"]
    }
];

/* ============================================================
   DECISÕES
   ============================================================ */

const LIFE_DECISION_TEMPLATES = [
    {
        id: "career_risk",
        category: LIFE_EVENT_CATEGORIES.CHOICE,
        type: LIFE_EVENT_TYPES.CHOICE,
        rarity: LIFE_EVENT_RARITIES.UNCOMMON,
        minAge: 18,
        title: "Uma escolha de carreira",
        description:
            "Você recebeu uma oportunidade que pode mudar sua trajetória profissional.",
        options: [
            {
                id: "accept",
                title: "Aceitar",
                description: "Assumir o risco e buscar crescimento.",
                effects: [
                    {
                        type: "add",
                        path: "media.reputation",
                        value: 3
                    },
                    {
                        type: "add",
                        path: "media.fame",
                        value: 2
                    }
                ],
                outcome: LIFE_EVENT_OUTCOMES.POSITIVE
            },
            {
                id: "decline",
                title: "Recusar",
                description: "Manter sua situação atual.",
                effects: [
                    {
                        type: "add",
                        path: "media.reputation",
                        value: 1
                    }
                ],
                outcome: LIFE_EVENT_OUTCOMES.NEUTRAL
            }
        ]
    },

    {
        id: "money_choice",
        category: LIFE_EVENT_CATEGORIES.FINANCE,
        type: LIFE_EVENT_TYPES.CHOICE,
        rarity: LIFE_EVENT_RARITIES.UNCOMMON,
        minAge: 18,
        title: "Decisão financeira",
        description:
            "Você recebeu uma oportunidade para investir seu dinheiro.",
        options: [
            {
                id: "invest",
                title: "Investir",
                description: "Assumir risco em busca de crescimento.",
                effects: [
                    {
                        type: "random_add",
                        path: "business.finances.cash",
                        min: -2000,
                        max: 10000
                    }
                ],
                outcome: LIFE_EVENT_OUTCOMES.MIXED
            },
            {
                id: "save",
                title: "Guardar",
                description: "Preservar o dinheiro.",
                effects: [
                    {
                        type: "add",
                        path: "business.finances.cash",
                        value: 0
                    }
                ],
                outcome: LIFE_EVENT_OUTCOMES.NEUTRAL
            }
        ]
    }
];

/* ============================================================
   NORMALIZAÇÃO
   ============================================================ */

function normalizeCondition(condition) {
    if (!condition || typeof condition !== "object") {
        return null;
    }

    return {
        type: condition.type || "custom",
        path: condition.path || null,
        value: condition.value,
        values: Array.isArray(condition.values)
            ? [...condition.values]
            : null,
        min: condition.min,
        max: condition.max,
        equals: condition.equals
    };
}

function normalizeEffect(effect) {
    if (!effect || typeof effect !== "object") {
        return null;
    }

    return {
        type: effect.type || "add",
        path: effect.path || null,
        value: effect.value,
        min: effect.min,
        max: effect.max,
        multiplier: effect.multiplier,
        valueType: effect.valueType || null
    };
}

function normalizeOption(option) {
    if (!option || typeof option !== "object") {
        return null;
    }

    return {
        id: option.id || generateId("option"),
        title: normalizeText(option.title, "Escolher"),
        description: normalizeText(option.description),
        requirements: Array.isArray(option.requirements)
            ? option.requirements.map(normalizeCondition).filter(Boolean)
            : [],
        effects: Array.isArray(option.effects)
            ? option.effects.map(normalizeEffect).filter(Boolean)
            : [],
        outcome: option.outcome || LIFE_EVENT_OUTCOMES.NEUTRAL
    };
}

function normalizeEvent(event) {
    if (!event || typeof event !== "object") {
        return null;
    }

    const normalized = {
        id: event.id || generateId("life_event"),
        templateId: event.templateId || null,

        category:
            event.category ||
            LIFE_EVENT_CATEGORIES.LIFE,

        type:
            event.type ||
            LIFE_EVENT_TYPES.CUSTOM,

        rarity:
            event.rarity ||
            LIFE_EVENT_RARITIES.COMMON,

        status:
            event.status ||
            LIFE_EVENT_STATUS.AVAILABLE,

        outcome:
            event.outcome ||
            LIFE_EVENT_OUTCOMES.NEUTRAL,

        title:
            normalizeText(event.title, "Acontecimento da vida"),

        description:
            normalizeText(event.description),

        age:
            normalizeNumber(
                event.age,
                getPlayerAge({
                    player: event.player
                })
            ),

        year:
            normalizeNumber(event.year, 0),

        month:
            normalizeNumber(event.month, 0),

        date:
            event.date || null,

        scheduledAt:
            event.scheduledAt || null,

        expiresAt:
            event.expiresAt || null,

        importance:
            normalizeNumber(event.importance, 1),

        weight:
            normalizeNumber(event.weight, 1),

        tags:
            Array.isArray(event.tags)
                ? [...event.tags]
                : [],

        conditions:
            Array.isArray(event.conditions)
                ? event.conditions
                    .map(normalizeCondition)
                    .filter(Boolean)
                : [],

        effects:
            Array.isArray(event.effects)
                ? event.effects
                    .map(normalizeEffect)
                    .filter(Boolean)
                : [],

        options:
            Array.isArray(event.options)
                ? event.options
                    .map(normalizeOption)
                    .filter(Boolean)
                : [],

        selectedOptionId:
            event.selectedOptionId || null,

        decision:
            event.decision
                ? clone(event.decision)
                : null,

        metadata:
            event.metadata && typeof event.metadata === "object"
                ? clone(event.metadata)
                : {},

        generated:
            event.generated !== false,

        simulated:
            event.simulated === true,

        createdAt:
            event.createdAt || new Date().toISOString(),

        activatedAt:
            event.activatedAt || null,

        completedAt:
            event.completedAt || null,

        cancelledAt:
            event.cancelledAt || null,

        result:
            event.result
                ? clone(event.result)
                : null
    };

    return normalized;
}

/* ============================================================
   ESTADO
   ============================================================ */

function createLifeEventsState() {
    return {
        version: LIFE_EVENTS_VERSION,

        active: [],

        available: [],

        scheduled: [],

        history: [],

        decisions: [],

        cooldowns: {},

        stats: {
            generated: 0,
            completed: 0,
            cancelled: 0,
            expired: 0,
            positive: 0,
            negative: 0,
            neutral: 0,
            choices: 0,
            rare: 0,
            veryRare: 0,
            legendary: 0
        },

        lastGeneratedAt: null,
        lastProcessedAt: null
    };
}

function ensureLifeEventsState(database) {
    if (!database) {
        throw new Error(
            "lifeEvents: database é obrigatório."
        );
    }

    if (!database.life) {
        database.life = {};
    }

    if (!database.life.events) {
        database.life.events = createLifeEventsState();
    }

    const state = database.life.events;

    state.version = state.version || LIFE_EVENTS_VERSION;

    if (!Array.isArray(state.active)) {
        state.active = [];
    }

    if (!Array.isArray(state.available)) {
        state.available = [];
    }

    if (!Array.isArray(state.scheduled)) {
        state.scheduled = [];
    }

    if (!Array.isArray(state.history)) {
        state.history = [];
    }

    if (!Array.isArray(state.decisions)) {
        state.decisions = [];
    }

    if (!state.cooldowns || typeof state.cooldowns !== "object") {
        state.cooldowns = {};
    }

    if (!state.stats || typeof state.stats !== "object") {
        state.stats = createLifeEventsState().stats;
    }

    return state;
}

/* ============================================================
   TEMPLATES
   ============================================================ */

function getAllEventTemplates() {
    return clone(LIFE_EVENT_TEMPLATES);
}

function getEventTemplate(templateId) {
    const template = LIFE_EVENT_TEMPLATES.find(
        item => item.id === templateId
    );

    return template ? clone(template) : null;
}

function getAllDecisionTemplates() {
    return clone(LIFE_DECISION_TEMPLATES);
}

function getDecisionTemplate(templateId) {
    const template = LIFE_DECISION_TEMPLATES.find(
        item => item.id === templateId
    );

    return template ? clone(template) : null;
}

function getTemplatesByCategory(category) {
    return LIFE_EVENT_TEMPLATES
        .filter(item => item.category === category)
        .map(clone);
}

function getTemplatesByType(type) {
    return LIFE_EVENT_TEMPLATES
        .filter(item => item.type === type)
        .map(clone);
}

function getTemplatesByRarity(rarity) {
    return LIFE_EVENT_TEMPLATES
        .filter(item => item.rarity === rarity)
        .map(clone);
}

/* ============================================================
   CONDIÇÕES
   ============================================================ */

function evaluateCondition(condition, database) {
    if (!condition) return true;

    const playerAge = getPlayerAge(database);

    switch (condition.type) {
        case "age":
            return (
                (condition.min === undefined ||
                    playerAge >= condition.min) &&
                (condition.max === undefined ||
                    playerAge <= condition.max)
            );

        case "career_stage": {
            const stage = getCareerStage(database);

            if (Array.isArray(condition.values)) {
                return condition.values.includes(stage);
            }

            return stage === condition.value;
        }

        case "cash": {
            const cash = getCash(database);

            return (
                (condition.min === undefined ||
                    cash >= condition.min) &&
                (condition.max === undefined ||
                    cash <= condition.max)
            );
        }

        case "net_worth": {
            const netWorth = getNetWorth(database);

            return (
                (condition.min === undefined ||
                    netWorth >= condition.min) &&
                (condition.max === undefined ||
                    netWorth <= condition.max)
            );
        }

        case "path": {
            const current = getPath(
                database,
                condition.path,
                undefined
            );

            if (condition.equals !== undefined) {
                return current === condition.equals;
            }

            if (Array.isArray(condition.values)) {
                return condition.values.includes(current);
            }

            if (
                condition.min !== undefined &&
                normalizeNumber(current) < condition.min
            ) {
                return false;
            }

            if (
                condition.max !== undefined &&
                normalizeNumber(current) > condition.max
            ) {
                return false;
            }

            if (condition.value !== undefined) {
                return current === condition.value;
            }

            return true;
        }

        case "has_partner":
            return Boolean(
                database?.life?.partner ||
                database?.life?.marriage?.partner ||
                database?.life?.marriage?.status === "married"
            );

        case "has_children":
            return (
                Array.isArray(database?.life?.children)
                    ? database.life.children.length > 0
                    : Array.isArray(database?.life?.family?.children)
                        ? database.life.family.children.length > 0
                        : false
            );

        case "professional":
            return Boolean(
                database?.career?.professional ||
                database?.career?.professional?.active
            );

        case "custom":
            return true;

        default:
            return true;
    }
}

function evaluateConditions(conditions, database) {
    if (!Array.isArray(conditions) || conditions.length === 0) {
        return true;
    }

    return conditions.every(
        condition => evaluateCondition(condition, database)
    );
}

/* ============================================================
   COOLDOWN
   ============================================================ */

function isOnCooldown(database, templateId) {
    const state = ensureLifeEventsState(database);

    const cooldown = state.cooldowns[templateId];

    if (!cooldown) return false;

    const currentYear = getCurrentYear(database);
    const currentMonth = getCurrentMonth(database);

    const currentIndex =
        currentYear * 12 + currentMonth;

    const cooldownIndex =
        normalizeNumber(cooldown.year, currentYear) * 12 +
        normalizeNumber(cooldown.month, currentMonth);

    return currentIndex < cooldownIndex;
}

function setCooldown(
    database,
    templateId,
    months = 1
) {
    const state = ensureLifeEventsState(database);

    const currentYear = getCurrentYear(database);
    const currentMonth = getCurrentMonth(database);

    const totalMonths =
        currentYear * 12 +
        currentMonth +
        Math.max(0, months);

    const year =
        Math.floor(totalMonths / 12);

    const month =
        totalMonths % 12 || 12;

    state.cooldowns[templateId] = {
        year,
        month
    };

    return state.cooldowns[templateId];
}

function clearCooldown(database, templateId) {
    const state = ensureLifeEventsState(database);

    delete state.cooldowns[templateId];

    return true;
}

function cleanupCooldowns(database) {
    const state = ensureLifeEventsState(database);

    const currentYear = getCurrentYear(database);
    const currentMonth = getCurrentMonth(database);

    const currentIndex =
        currentYear * 12 + currentMonth;

    for (const templateId of Object.keys(state.cooldowns)) {
        const cooldown = state.cooldowns[templateId];

        const cooldownIndex =
            normalizeNumber(cooldown.year, 0) * 12 +
            normalizeNumber(cooldown.month, 0);

        if (cooldownIndex <= currentIndex) {
            delete state.cooldowns[templateId];
        }
    }

    return true;
}

/* ============================================================
   CRIAÇÃO
   ============================================================ */

function createEvent(data = {}) {
    return normalizeEvent({
        ...data,
        id: data.id || generateId("life_event"),
        createdAt:
            data.createdAt ||
            new Date().toISOString()
    });
}

function createEventFromTemplate(
    templateId,
    database,
    overrides = {}
) {
    const template =
        getEventTemplate(templateId);

    if (!template) {
        return null;
    }

    if (
        template.minAge !== undefined &&
        getPlayerAge(database) < template.minAge
    ) {
        return null;
    }

    if (
        template.maxAge !== undefined &&
        getPlayerAge(database) > template.maxAge
    ) {
        return null;
    }

    if (
        template.conditions &&
        !evaluateConditions(
            template.conditions,
            database
        )
    ) {
        return null;
    }

    if (isOnCooldown(database, templateId)) {
        return null;
    }

    return createEvent({
        templateId: template.id,

        category: template.category,
        type: template.type,
        rarity: template.rarity,
        outcome: template.outcome,

        title: template.title,
        description: template.description,

        age: getPlayerAge(database),
        year: getCurrentYear(database),
        month: getCurrentMonth(database),
        date: getCurrentDate(database),

        importance:
            template.importance ||
            rarityImportance(template.rarity),

        weight:
            template.weight || 1,

        tags:
            template.tags || [],

        conditions:
            template.conditions || [],

        effects:
            template.effects || [],

        options:
            template.options || [],

        metadata: {
            generatedFromTemplate: true,
            ...clone(template.metadata || {}),
            ...clone(overrides.metadata || {})
        },

        ...clone(overrides)
    });
}

function createDecisionEvent(
    templateId,
    database,
    overrides = {}
) {
    const template =
        getDecisionTemplate(templateId);

    if (!template) {
        return null;
    }

    if (
        template.minAge !== undefined &&
        getPlayerAge(database) < template.minAge
    ) {
        return null;
    }

    return createEvent({
        templateId: template.id,

        category:
            template.category ||
            LIFE_EVENT_CATEGORIES.CHOICE,

        type:
            template.type ||
            LIFE_EVENT_TYPES.CHOICE,

        rarity:
            template.rarity ||
            LIFE_EVENT_RARITIES.UNCOMMON,

        outcome:
            LIFE_EVENT_OUTCOMES.NEUTRAL,

        title: template.title,
        description: template.description,

        age: getPlayerAge(database),
        year: getCurrentYear(database),
        month: getCurrentMonth(database),
        date: getCurrentDate(database),

        importance: 3,

        options:
            template.options || [],

        decision: {
            required: true,
            deadlineMonths:
                LIFE_EVENT_CONFIG.decisionDurationMonths,
            selected: false
        },

        ...clone(overrides)
    });
}

/* ============================================================
   IMPORTÂNCIA / RARIDADE
   ============================================================ */

function rarityImportance(rarity) {
    switch (rarity) {
        case LIFE_EVENT_RARITIES.COMMON:
            return 1;

        case LIFE_EVENT_RARITIES.UNCOMMON:
            return 2;

        case LIFE_EVENT_RARITIES.RARE:
            return 4;

        case LIFE_EVENT_RARITIES.VERY_RARE:
            return 7;

        case LIFE_EVENT_RARITIES.LEGENDARY:
            return 10;

        default:
            return 1;
    }
}

function rarityChance(rarity) {
    switch (rarity) {
        case LIFE_EVENT_RARITIES.COMMON:
            return 1;

        case LIFE_EVENT_RARITIES.UNCOMMON:
            return 0.5;

        case LIFE_EVENT_RARITIES.RARE:
            return LIFE_EVENT_CONFIG.rareEventChance;

        case LIFE_EVENT_RARITIES.VERY_RARE:
            return LIFE_EVENT_CONFIG.veryRareEventChance;

        case LIFE_EVENT_RARITIES.LEGENDARY:
            return LIFE_EVENT_CONFIG.legendaryEventChance;

        default:
            return 1;
    }
}

/* ============================================================
   SELEÇÃO ALEATÓRIA
   ============================================================ */

function getEligibleTemplates(database) {
    const age = getPlayerAge(database);

    return LIFE_EVENT_TEMPLATES.filter(template => {
        if (
            template.minAge !== undefined &&
            age < template.minAge
        ) {
            return false;
        }

        if (
            template.maxAge !== undefined &&
            age > template.maxAge
        ) {
            return false;
        }

        if (
            template.conditions &&
            !evaluateConditions(
                template.conditions,
                database
            )
        ) {
            return false;
        }

        if (isOnCooldown(database, template.id)) {
            return false;
        }

        return true;
    });
}

function weightedRandomTemplate(
    templates,
    database
) {
    if (!Array.isArray(templates) || !templates.length) {
        return null;
    }

    const eligible = templates.filter(
        template => {
            const rarityRoll =
                rarityChance(template.rarity);

            if (
                template.rarity !==
                LIFE_EVENT_RARITIES.COMMON &&
                template.rarity !==
                LIFE_EVENT_RARITIES.UNCOMMON
            ) {
                return chance(rarityRoll);
            }

            return true;
        }
    );

    if (!eligible.length) {
        return null;
    }

    const totalWeight =
        eligible.reduce(
            (sum, item) =>
                sum +
                Math.max(
                    0.01,
                    normalizeNumber(item.weight, 1)
                ),
            0
        );

    let roll = random(0, totalWeight);

    for (const template of eligible) {
        roll -= Math.max(
            0.01,
            normalizeNumber(template.weight, 1)
        );

        if (roll <= 0) {
            return template;
        }
    }

    return eligible[eligible.length - 1];
}

/* ============================================================
   EFEITOS
   ============================================================ */

function calculateEffectValue(effect) {
    if (!effect) return 0;

    if (effect.type === "random_add") {
        const min =
            normalizeNumber(effect.min, 0);

        const max =
            normalizeNumber(effect.max, min);

        return randomInt(
            Math.min(min, max),
            Math.max(min, max)
        );
    }

    return normalizeNumber(
        effect.value,
        0
    );
}

function applyEffect(
    effect,
    database
) {
    if (!effect || !effect.path) {
        return {
            success: false,
            reason: "invalid_effect"
        };
    }

    const value =
        calculateEffectValue(effect);

    switch (effect.type) {
        case "set":
            setPath(
                database,
                effect.path,
                effect.value
            );

            return {
                success: true,
                type: "set",
                path: effect.path,
                value: effect.value
            };

        case "add":
        case "random_add":
            addPath(
                database,
                effect.path,
                value
            );

            return {
                success: true,
                type: effect.type,
                path: effect.path,
                value
            };

        case "subtract":
            addPath(
                database,
                effect.path,
                -Math.abs(value)
            );

            return {
                success: true,
                type: "subtract",
                path: effect.path,
                value: -Math.abs(value)
            };

        case "multiply":
            multiplyPath(
                database,
                effect.path,
                normalizeNumber(
                    effect.multiplier,
                    1
                )
            );

            return {
                success: true,
                type: "multiply",
                path: effect.path,
                multiplier:
                    normalizeNumber(
                        effect.multiplier,
                        1
                    )
            };

        default:
            return {
                success: false,
                reason: "unknown_effect",
                effect
            };
    }
}

function applyEffects(
    effects,
    database
) {
    if (!Array.isArray(effects)) {
        return [];
    }

    return effects
        .map(effect =>
            applyEffect(effect, database)
        );
}

/* ============================================================
   DECISÕES
   ============================================================ */

function getDecisionOptions(event) {
    if (!event || !Array.isArray(event.options)) {
        return [];
    }

    return event.options.map(clone);
}

function canChooseOption(
    event,
    optionId,
    database
) {
    if (!event) {
        return {
            allowed: false,
            reason: "event_not_found"
        };
    }

    const option =
        event.options?.find(
            item => item.id === optionId
        );

    if (!option) {
        return {
            allowed: false,
            reason: "option_not_found"
        };
    }

    if (
        !evaluateConditions(
            option.requirements,
            database
        )
    ) {
        return {
            allowed: false,
            reason: "requirements_not_met"
        };
    }

    return {
        allowed: true,
        option: clone(option)
    };
}

function chooseEventOption(
    database,
    eventId,
    optionId
) {
    const state =
        ensureLifeEventsState(database);

    const event =
        state.active.find(
            item => item.id === eventId
        ) ||
        state.available.find(
            item => item.id === eventId
        );

    if (!event) {
        return {
            success: false,
            reason: "event_not_found"
        };
    }

    const check =
        canChooseOption(
            event,
            optionId,
            database
        );

    if (!check.allowed) {
        return {
            success: false,
            reason: check.reason
        };
    }

    const option = check.option;

    const effectResults =
        applyEffects(
            option.effects,
            database
        );

    event.selectedOptionId =
        option.id;

    event.outcome =
        option.outcome ||
        LIFE_EVENT_OUTCOMES.NEUTRAL;

    event.result = {
        selectedOptionId: option.id,
        title: option.title,
        outcome: event.outcome,
        effects: effectResults
    };

    event.decision = {
        ...(event.decision || {}),
        required: false,
        selected: true,
        selectedAt:
            new Date().toISOString()
    };

    completeEvent(
        database,
        event.id,
        event.result
    );

    const stateAfter =
        ensureLifeEventsState(database);

    stateAfter.decisions.push({
        id: generateId("decision"),
        eventId: event.id,
        optionId: option.id,
        selectedAt:
            new Date().toISOString(),
        outcome: event.outcome
    });

    if (
        stateAfter.decisions.length >
        LIFE_EVENT_CONFIG.maxDecisions
    ) {
        stateAfter.decisions =
            stateAfter.decisions.slice(
                -LIFE_EVENT_CONFIG.maxDecisions
            );
    }

    return {
        success: true,
        event: clone(event),
        option,
        effects: effectResults
    };
}

/* ============================================================
   CRUD
   ============================================================ */

function addEvent(
    database,
    event,
    target = "available"
) {
    const state =
        ensureLifeEventsState(database);

    const normalized =
        normalizeEvent(event);

    if (!normalized) {
        return null;
    }

    const collection =
        state[target];

    if (!Array.isArray(collection)) {
        return null;
    }

    collection.push(normalized);

    return normalized;
}

function getEvent(
    database,
    eventId
) {
    const state =
        ensureLifeEventsState(database);

    const collections = [
        state.active,
        state.available,
        state.scheduled,
        state.history
    ];

    for (const collection of collections) {
        const found =
            collection.find(
                event => event.id === eventId
            );

        if (found) {
            return found;
        }
    }

    return null;
}

function removeEvent(
    database,
    eventId
) {
    const state =
        ensureLifeEventsState(database);

    const collections = [
        state.active,
        state.available,
        state.scheduled
    ];

    for (const collection of collections) {
        const index =
            collection.findIndex(
                event => event.id === eventId
            );

        if (index !== -1) {
            return collection.splice(index, 1)[0];
        }
    }

    return null;
}

/* ============================================================
   STATUS
   ============================================================ */

function activateEvent(
    database,
    eventId
) {
    const state =
        ensureLifeEventsState(database);

    const index =
        state.available.findIndex(
            event => event.id === eventId
        );

    if (index === -1) {
        return null;
    }

    if (
        state.active.length >=
        LIFE_EVENT_CONFIG.maxActiveEvents
    ) {
        return null;
    }

    const event =
        state.available.splice(
            index,
            1
        )[0];

    event.status =
        LIFE_EVENT_STATUS.ACTIVE;

    event.activatedAt =
        new Date().toISOString();

    state.active.push(event);

    return event;
}

function scheduleEvent(
    database,
    event,
    scheduledAt
) {
    const state =
        ensureLifeEventsState(database);

    const normalized =
        normalizeEvent({
            ...event,
            status:
                LIFE_EVENT_STATUS.SCHEDULED,
            scheduledAt
        });

    state.scheduled.push(normalized);

    return normalized;
}

function completeEvent(
    database,
    eventId,
    result = null
) {
    const state =
        ensureLifeEventsState(database);

    let event = null;

    let index =
        state.active.findIndex(
            item => item.id === eventId
        );

    if (index !== -1) {
        event =
            state.active.splice(
                index,
                1
            )[0];
    } else {
        index =
            state.available.findIndex(
                item => item.id === eventId
            );

        if (index !== -1) {
            event =
                state.available.splice(
                    index,
                    1
                )[0];
        }
    }

    if (!event) {
        return null;
    }

    event.status =
        LIFE_EVENT_STATUS.COMPLETED;

    event.completedAt =
        new Date().toISOString();

    event.result =
        result ||
        event.result ||
        null;

    state.history.push(event);

    state.stats.completed++;

    updateOutcomeStats(
        state,
        event.outcome
    );

    if (
        event.rarity ===
        LIFE_EVENT_RARITIES.RARE
    ) {
        state.stats.rare++;
    }

    if (
        event.rarity ===
        LIFE_EVENT_RARITIES.VERY_RARE
    ) {
        state.stats.veryRare++;
    }

    if (
        event.rarity ===
        LIFE_EVENT_RARITIES.LEGENDARY
    ) {
        state.stats.legendary++;
    }

    trimHistory(state);

    return event;
}

function cancelEvent(
    database,
    eventId,
    reason = "cancelled"
) {
    const state =
        ensureLifeEventsState(database);

    const event =
        removeEvent(
            database,
            eventId
        );

    if (!event) {
        return null;
    }

    event.status =
        LIFE_EVENT_STATUS.CANCELLED;

    event.cancelledAt =
        new Date().toISOString();

    event.result = {
        reason
    };

    state.history.push(event);

    state.stats.cancelled++;

    trimHistory(state);

    return event;
}

function expireEvent(
    database,
    eventId,
    reason = "expired"
) {
    const state =
        ensureLifeEventsState(database);

    const event =
        removeEvent(
            database,
            eventId
        );

    if (!event) {
        return null;
    }

    event.status =
        LIFE_EVENT_STATUS.EXPIRED;

    event.result = {
        reason
    };

    state.history.push(event);

    state.stats.expired++;

    trimHistory(state);

    return event;
}

function updateOutcomeStats(
    state,
    outcome
) {
    if (
        outcome ===
        LIFE_EVENT_OUTCOMES.POSITIVE
    ) {
        state.stats.positive++;
    } else if (
        outcome ===
        LIFE_EVENT_OUTCOMES.NEGATIVE
    ) {
        state.stats.negative++;
    } else {
        state.stats.neutral++;
    }
}

function trimHistory(state) {
    if (
        state.history.length >
        LIFE_EVENT_CONFIG.maxHistory
    ) {
        state.history =
            state.history.slice(
                -LIFE_EVENT_CONFIG.maxHistory
            );
    }
}

/* ============================================================
   GERAÇÃO
   ============================================================ */

function generateRandomEvent(
    database,
    options = {}
) {
    const state =
        ensureLifeEventsState(database);

    const eligible =
        getEligibleTemplates(database);

    if (!eligible.length) {
        return null;
    }

    let templates = eligible;

    if (options.category) {
        templates =
            templates.filter(
                item =>
                    item.category ===
                    options.category
            );
    }

    if (options.type) {
        templates =
            templates.filter(
                item =>
                    item.type ===
                    options.type
            );
    }

    if (options.rarity) {
        templates =
            templates.filter(
                item =>
                    item.rarity ===
                    options.rarity
            );
    }

    if (!templates.length) {
        return null;
    }

    const template =
        weightedRandomTemplate(
            templates,
            database
        );

    if (!template) {
        return null;
    }

    const event =
        createEventFromTemplate(
            template.id,
            database,
            options.overrides || {}
        );

    if (!event) {
        return null;
    }

    addEvent(
        database,
        event,
        options.target || "available"
    );

    setCooldown(
        database,
        template.id,
        options.cooldownMonths || 3
    );

    state.stats.generated++;

    state.lastGeneratedAt =
        new Date().toISOString();

    return event;
}

function generateDecisionEvent(
    database,
    templateId,
    overrides = {}
) {
    const template =
        templateId
            ? getDecisionTemplate(templateId)
            : LIFE_DECISION_TEMPLATES[
                randomInt(
                    0,
                    LIFE_DECISION_TEMPLATES.length - 1
                )
            ];

    if (!template) {
        return null;
    }

    const event =
        createDecisionEvent(
            template.id,
            database,
            overrides
        );

    if (!event) {
        return null;
    }

    addEvent(
        database,
        event,
        "available"
    );

    const state =
        ensureLifeEventsState(database);

    state.stats.generated++;
    state.stats.choices++;

    return event;
}

/* ============================================================
   PROCESSAMENTO MENSAL
   ============================================================ */

function processScheduledEvents(database) {
    const state =
        ensureLifeEventsState(database);

    const currentDate =
        getCurrentDate(database);

    const currentYear =
        getCurrentYear(database);

    const currentMonth =
        getCurrentMonth(database);

    const ready = [];

    for (
        let i = state.scheduled.length - 1;
        i >= 0;
        i--
    ) {
        const event =
            state.scheduled[i];

        const eventYear =
            normalizeNumber(
                event.year,
                currentYear
            );

        const eventMonth =
            normalizeNumber(
                event.month,
                currentMonth
            );

        const due =
            event.scheduledAt === currentDate ||
            (
                eventYear < currentYear ||
                (
                    eventYear === currentYear &&
                    eventMonth <= currentMonth
                )
            );

        if (due) {
            state.scheduled.splice(i, 1);

            event.status =
                LIFE_EVENT_STATUS.AVAILABLE;

            state.available.push(event);

            ready.push(event);
        }
    }

    return ready;
}

function processActiveEvents(database) {
    const state =
        ensureLifeEventsState(database);

    const processed = [];

    for (const event of [...state.active]) {
        if (
            event.decision?.required &&
            !event.decision?.selected
        ) {
            continue;
        }

        processed.push(event);
    }

    return processed;
}

function processExpirations(database) {
    const state =
        ensureLifeEventsState(database);

    const currentYear =
        getCurrentYear(database);

    const currentMonth =
        getCurrentMonth(database);

    const expired = [];

    for (const event of [...state.available]) {
        if (!event.expiresAt) {
            continue;
        }

        const expiresDate =
            new Date(event.expiresAt);

        if (Number.isNaN(expiresDate.getTime())) {
            continue;
        }

        const now =
            new Date(
                currentYear,
                currentMonth - 1,
                1
            );

        if (now > expiresDate) {
            const result =
                expireEvent(
                    database,
                    event.id
                );

            if (result) {
                expired.push(result);
            }
        }
    }

    return expired;
}

function processLifeEventsMonth(
    database,
    options = {}
) {
    const state =
        ensureLifeEventsState(database);

    cleanupCooldowns(database);

    const scheduled =
        processScheduledEvents(database);

    const expirations =
        processExpirations(database);

    let generated = null;

    const allowGeneration =
        options.generate !== false;

    if (
        allowGeneration &&
        state.active.length <
        LIFE_EVENT_CONFIG.maxActiveEvents
    ) {
        if (
            chance(
                options.generationChance ??
                LIFE_EVENT_CONFIG.monthlyGenerationChance
            )
        ) {
            generated =
                generateRandomEvent(
                    database,
                    {
                        target: "available"
                    }
                );
        }
    }

    state.lastProcessedAt =
        new Date().toISOString();

    return {
        generated,
        scheduled,
        expirations,
        active:
            [...state.active],
        available:
            [...state.available]
    };
}

/* ============================================================
   PROCESSAMENTO ANUAL
   ============================================================ */

function processLifeEventsYear(
    database
) {
    const state =
        ensureLifeEventsState(database);

    const age =
        getPlayerAge(database);

    let birthday =
        null;

    if (age > 0) {
        birthday =
            createEvent({
                category:
                    LIFE_EVENT_CATEGORIES.LIFE,

                type:
                    LIFE_EVENT_TYPES.BIRTHDAY,

                rarity:
                    LIFE_EVENT_RARITIES.COMMON,

                outcome:
                    LIFE_EVENT_OUTCOMES.NEUTRAL,

                title:
                    "Aniversário",

                description:
                    `Você completou ${age} anos.`,

                age,

                year:
                    getCurrentYear(database),

                month:
                    getCurrentMonth(database),

                importance: 1,

                generated: true
            });

        addEvent(
            database,
            birthday,
            "history"
        );

        birthday.status =
            LIFE_EVENT_STATUS.COMPLETED;

        birthday.completedAt =
            new Date().toISOString();

        state.stats.generated++;
        state.stats.completed++;
        state.stats.neutral++;

        trimHistory(state);
    }

    return {
        birthday,
        age
    };
}

/* ============================================================
   CONSULTAS
   ============================================================ */

function getActiveEvents(database) {
    return clone(
        ensureLifeEventsState(database)
            .active
    );
}

function getAvailableEvents(database) {
    return clone(
        ensureLifeEventsState(database)
            .available
    );
}

function getScheduledEvents(database) {
    return clone(
        ensureLifeEventsState(database)
            .scheduled
    );
}

function getEventHistory(database) {
    return clone(
        ensureLifeEventsState(database)
            .history
    );
}

function getDecisionHistory(database) {
    return clone(
        ensureLifeEventsState(database)
            .decisions
    );
}

function getEventsByCategory(
    database,
    category
) {
    return getEventHistory(database)
        .filter(
            event =>
                event.category === category
        );
}

function getEventsByType(
    database,
    type
) {
    return getEventHistory(database)
        .filter(
            event =>
                event.type === type
        );
}

function getEventsByRarity(
    database,
    rarity
) {
    return getEventHistory(database)
        .filter(
            event =>
                event.rarity === rarity
        );
}

function getPositiveEvents(database) {
    return getEventHistory(database)
        .filter(
            event =>
                event.outcome ===
                LIFE_EVENT_OUTCOMES.POSITIVE
        );
}

function getNegativeEvents(database) {
    return getEventHistory(database)
        .filter(
            event =>
                event.outcome ===
                LIFE_EVENT_OUTCOMES.NEGATIVE
        );
}

function searchEvents(
    database,
    query
) {
    const text =
        normalizeText(
            query
        ).toLowerCase();

    if (!text) {
        return [];
    }

    return getEventHistory(database)
        .filter(event => {
            const haystack = [
                event.title,
                event.description,
                event.category,
                event.type,
                event.rarity,
                ...(event.tags || [])
            ]
                .join(" ")
                .toLowerCase();

            return haystack.includes(text);
        });
}

/* ============================================================
   HISTÓRICO
   ============================================================ */

function recordCustomEvent(
    database,
    data
) {
    const event =
        createEvent({
            ...data,
            status:
                LIFE_EVENT_STATUS.COMPLETED,
            completedAt:
                new Date().toISOString()
        });

    const state =
        ensureLifeEventsState(database);

    state.history.push(event);

    state.stats.generated++;
    state.stats.completed++;

    updateOutcomeStats(
        state,
        event.outcome
    );

    trimHistory(state);

    return event;
}

/* ============================================================
   ESTATÍSTICAS
   ============================================================ */

function getEventStats(database) {
    const state =
        ensureLifeEventsState(database);

    const total =
        state.history.length;

    const positive =
        state.stats.positive;

    const negative =
        state.stats.negative;

    const neutral =
        state.stats.neutral;

    return {
        ...clone(state.stats),

        active:
            state.active.length,

        available:
            state.available.length,

        scheduled:
            state.scheduled.length,

        history:
            state.history.length,

        total,

        positiveRate:
            total > 0
                ? positive / total
                : 0,

        negativeRate:
            total > 0
                ? negative / total
                : 0,

        neutralRate:
            total > 0
                ? neutral / total
                : 0
    };
}

function getLifeEventScore(database) {
    const state =
        ensureLifeEventsState(database);

    let score = 0;

    for (const event of state.history) {
        switch (event.outcome) {
            case LIFE_EVENT_OUTCOMES.POSITIVE:
                score += event.importance || 1;
                break;

            case LIFE_EVENT_OUTCOMES.NEGATIVE:
                score -= event.importance || 1;
                break;

            case LIFE_EVENT_OUTCOMES.MIXED:
                score +=
                    (event.importance || 1) * 0.25;
                break;

            default:
                break;
        }
    }

    return Math.round(score);
}

/* ============================================================
   SNAPSHOT
   ============================================================ */

function getLifeEventsSnapshot(database) {
    const state =
        ensureLifeEventsState(database);

    return {
        version:
            LIFE_EVENTS_VERSION,

        active:
            clone(state.active),

        available:
            clone(state.available),

        scheduled:
            clone(state.scheduled),

        history:
            clone(state.history),

        decisions:
            clone(state.decisions),

        cooldowns:
            clone(state.cooldowns),

        stats:
            clone(state.stats),

        score:
            getLifeEventScore(database),

        lastGeneratedAt:
            state.lastGeneratedAt,

        lastProcessedAt:
            state.lastProcessedAt
    };
}

/* ============================================================
   VALIDAÇÃO
   ============================================================ */

function validateEvent(event) {
    const errors = [];

    if (!event || typeof event !== "object") {
        return {
            valid: false,
            errors: ["Evento inválido."]
        };
    }

    if (!event.id) {
        errors.push("Evento sem ID.");
    }

    if (!event.title) {
        errors.push("Evento sem título.");
    }

    if (!event.category) {
        errors.push("Evento sem categoria.");
    }

    if (!event.type) {
        errors.push("Evento sem tipo.");
    }

    if (
        !Object.values(
            LIFE_EVENT_STATUS
        ).includes(event.status)
    ) {
        errors.push("Status de evento inválido.");
    }

    if (
        !Object.values(
            LIFE_EVENT_OUTCOMES
        ).includes(event.outcome)
    ) {
        errors.push("Resultado de evento inválido.");
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

function validateLifeEvents(database) {
    const state =
        ensureLifeEventsState(database);

    const errors = [];

    const collections = [
        ["active", state.active],
        ["available", state.available],
        ["scheduled", state.scheduled],
        ["history", state.history]
    ];

    for (const [name, collection] of collections) {
        if (!Array.isArray(collection)) {
            errors.push(
                `${name} não é um array.`
            );
            continue;
        }

        for (const event of collection) {
            const result =
                validateEvent(event);

            if (!result.valid) {
                errors.push(
                    ...result.errors.map(
                        error =>
                            `${name}: ${error}`
                    )
                );
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/* ============================================================
   INICIALIZAÇÃO / RESET
   ============================================================ */

function initializeLifeEvents(database) {
    const state =
        ensureLifeEventsState(database);

    state.version =
        LIFE_EVENTS_VERSION;

    return state;
}

function resetLifeEvents(database) {
    if (!database) {
        throw new Error(
            "lifeEvents: database é obrigatório."
        );
    }

    if (!database.life) {
        database.life = {};
    }

    database.life.events =
        createLifeEventsState();

    return database.life.events;
}

/* ============================================================
   API
   ============================================================ */

const lifeEventsAPI = {
    LIFE_EVENTS_VERSION,

    LIFE_EVENT_CATEGORIES,
    LIFE_EVENT_TYPES,
    LIFE_EVENT_RARITIES,
    LIFE_EVENT_STATUS,
    LIFE_EVENT_OUTCOMES,
    LIFE_EVENT_CONFIG,

    LIFE_EVENT_TEMPLATES,
    LIFE_DECISION_TEMPLATES,

    createLifeEventsState,
    ensureLifeEventsState,

    getAllEventTemplates,
    getEventTemplate,
    getAllDecisionTemplates,
    getDecisionTemplate,
    getTemplatesByCategory,
    getTemplatesByType,
    getTemplatesByRarity,

    evaluateCondition,
    evaluateConditions,

    isOnCooldown,
    setCooldown,
    clearCooldown,
    cleanupCooldowns,

    createEvent,
    createEventFromTemplate,
    createDecisionEvent,

    rarityImportance,
    rarityChance,

    getEligibleTemplates,
    weightedRandomTemplate,

    calculateEffectValue,
    applyEffect,
    applyEffects,

    getDecisionOptions,
    canChooseOption,
    chooseEventOption,

    addEvent,
    getEvent,
    removeEvent,

    activateEvent,
    scheduleEvent,
    completeEvent,
    cancelEvent,
    expireEvent,

    generateRandomEvent,
    generateDecisionEvent,

    processScheduledEvents,
    processActiveEvents,
    processExpirations,
    processLifeEventsMonth,
    processLifeEventsYear,

    getActiveEvents,
    getAvailableEvents,
    getScheduledEvents,
    getEventHistory,
    getDecisionHistory,

    getEventsByCategory,
    getEventsByType,
    getEventsByRarity,
    getPositiveEvents,
    getNegativeEvents,
    searchEvents,

    recordCustomEvent,

    getEventStats,
    getLifeEventScore,

    getLifeEventsSnapshot,

    validateEvent,
    validateLifeEvents,

    initializeLifeEvents,
    resetLifeEvents
};

export {
    LIFE_EVENTS_VERSION,

    LIFE_EVENT_CATEGORIES,
    LIFE_EVENT_TYPES,
    LIFE_EVENT_RARITIES,
    LIFE_EVENT_STATUS,
    LIFE_EVENT_OUTCOMES,
    LIFE_EVENT_CONFIG,

    LIFE_EVENT_TEMPLATES,
    LIFE_DECISION_TEMPLATES,

    createLifeEventsState,
    ensureLifeEventsState,

    getAllEventTemplates,
    getEventTemplate,
    getAllDecisionTemplates,
    getDecisionTemplate,
    getTemplatesByCategory,
    getTemplatesByType,
    getTemplatesByRarity,

    evaluateCondition,
    evaluateConditions,

    isOnCooldown,
    setCooldown,
    clearCooldown,
    cleanupCooldowns,

    createEvent,
    createEventFromTemplate,
    createDecisionEvent,

    rarityImportance,
    rarityChance,

    getEligibleTemplates,
    weightedRandomTemplate,

    calculateEffectValue,
    applyEffect,
    applyEffects,

    getDecisionOptions,
    canChooseOption,
    chooseEventOption,

    addEvent,
    getEvent,
    removeEvent,

    activateEvent,
    scheduleEvent,
    completeEvent,
    cancelEvent,
    expireEvent,

    generateRandomEvent,
    generateDecisionEvent,

    processScheduledEvents,
    processActiveEvents,
    processExpirations,
    processLifeEventsMonth,
    processLifeEventsYear,

    getActiveEvents,
    getAvailableEvents,
    getScheduledEvents,
    getEventHistory,
    getDecisionHistory,

    getEventsByCategory,
    getEventsByType,
    getEventsByRarity,
    getPositiveEvents,
    getNegativeEvents,
    searchEvents,

    recordCustomEvent,

    getEventStats,
    getLifeEventScore,

    getLifeEventsSnapshot,

    validateEvent,
    validateLifeEvents,

    initializeLifeEvents,
    resetLifeEvents,

    lifeEventsAPI
};

export default lifeEventsAPI;
