/* ============================================================
   MMA LIFE DYNASTY
   LIFE MILESTONES
   Sistema de grandes marcos da vida, carreira e legado
   ============================================================ */

const LIFE_MILESTONES_VERSION = 1;

/* ============================================================
   CONSTANTES
   ============================================================ */

export const MILESTONE_CATEGORIES = {
    LIFE: "life",
    MMA: "mma",
    CAREER: "career",
    RELATIONSHIP: "relationship",
    FAMILY: "family",
    EDUCATION: "education",
    EMPLOYMENT: "employment",
    FINANCE: "finance",
    HEALTH: "health",
    RESIDENCE: "residence",
    VEHICLE: "vehicle",
    LIFESTYLE: "lifestyle",
    MEDIA: "media",
    LEGACY: "legacy",
    DYNASTY: "dynasty",
    PERSONAL: "personal",
    RARE: "rare"
};

export const MILESTONE_STATUS = {
    LOCKED: "locked",
    AVAILABLE: "available",
    ACHIEVED: "achieved",
    FAILED: "failed",
    HIDDEN: "hidden"
};

export const MILESTONE_IMPORTANCE = {
    TRIVIAL: 1,
    LOW: 2,
    NORMAL: 3,
    IMPORTANT: 4,
    MAJOR: 5,
    LEGENDARY: 6
};

export const MILESTONE_RARITY = {
    COMMON: "common",
    UNCOMMON: "uncommon",
    RARE: "rare",
    VERY_RARE: "very_rare",
    LEGENDARY: "legendary"
};

/* ============================================================
   CONFIGURAÇÃO
   ============================================================ */

const DEFAULT_CONFIG = {
    automaticChecks: true,
    automaticRewards: true,
    automaticHistory: true,
    notifications: true,

    maxAchievements: 5000,
    maxNotifications: 500,
    maxHistory: 5000,

    checkMonthly: true,
    checkYearly: true,
    checkAfterFight: true,
    checkAfterContract: true,
    checkAfterTitle: true,
    checkAfterLifeEvent: true
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
    const number = Number(value);

    if (!Number.isFinite(number)) return min;

    return Math.max(min, Math.min(max, number));
}

function toNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number) ? number : fallback;
}

function normalizeText(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase();
}

function generateId(prefix = "milestone") {
    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 9)}`;
}

function nowISO() {
    return new Date().toISOString();
}

function getPath(object, path, fallback = undefined) {
    if (!object || !path) return fallback;

    const parts = String(path).split(".");
    let current = object;

    for (const part of parts) {
        if (current === null || current === undefined) {
            return fallback;
        }

        current = current[part];
    }

    return current === undefined ? fallback : current;
}

function hasPath(object, path) {
    return getPath(object, path, undefined) !== undefined;
}

function setPath(object, path, value) {
    if (!object || !path) return false;

    const parts = String(path).split(".");
    let current = object;

    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];

        if (
            current[part] === null ||
            current[part] === undefined ||
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
    const current = toNumber(getPath(object, path, 0));

    return setPath(object, path, current + toNumber(amount));
}

function arrayLength(value) {
    return Array.isArray(value) ? value.length : 0;
}

function includesValue(value, target) {
    if (Array.isArray(value)) {
        return value.some(
            item =>
                normalizeText(item) === normalizeText(target) ||
                normalizeText(item?.id) === normalizeText(target) ||
                normalizeText(item?.name) === normalizeText(target)) ;
    }

    return normalizeText(value) === normalizeText(target);
}

function getPlayerAge(database) {
    return toNumber(
        getPath(database, "player.age",
            getPath(database, "age", 0)
        ),
        0
    );
}

function getCurrentYear(database) {
    return toNumber(
        getPath(database, "meta.currentYear",
            getPath(database, "calendar.year", 1)
        ),
        1
    );
}

function getCurrentDate(database) {
    return (
        getPath(database, "meta.currentDate",
            getPath(database, "calendar.currentDate", null)
        ) || null
    );
}

function getCareerStage(database) {
    return (
        getPath(database, "career.stage", "") ||
        getPath(database, "player.careerStage", "") ||
        ""
    );
}

function getProfessional(database) {
    return Boolean(
        getPath(database, "career.professional", false) ||
        getPath(database, "player.professional.active", false) ||
        getPath(database, "player.professional", false)
    );
}

function getCareerHistory(database) {
    const history =
        getPath(database, "career.history", null) ||
        getPath(database, "player.career.history", null);

    return Array.isArray(history) ? history : [];
}

function getTitles(database) {
    const titles =
        getPath(database, "career.titles", null) ||
        getPath(database, "player.career.titles", null);

    return Array.isArray(titles) ? titles : [];
}

function getChildren(database) {
    const children =
        getPath(database, "life.family.children", null) ||
        getPath(database, "life.children", null) ||
        getPath(database, "dynasty.children", null);

    return Array.isArray(children) ? children : [];
}

function getRelationships(database) {
    const relationships =
        getPath(database, "life.relationships", null);

    return Array.isArray(relationships) ? relationships : [];
}

function getMarriage(database) {
    return (
        getPath(database, "life.marriage", null) ||
        getPath(database, "life.partner.marriage", null) ||
        null
    );
}

function getEducation(database) {
    return getPath(database, "life.education", {}) || {};
}

function getEmployment(database) {
    return getPath(database, "life.employment", {}) || {};
}

function getResidence(database) {
    return getPath(database, "life.residence", {}) || {};
}

function getVehicles(database) {
    const garage =
        getPath(database, "life.vehicles.garage", null) ||
        getPath(database, "life.vehicles", null);

    return Array.isArray(garage) ? garage : [];
}

function getNetWorth(database) {
    const direct = getPath(
        database,
        "business.finances.netWorth",
        undefined
    );

    if (direct !== undefined) {
        return toNumber(direct);
    }

    const wealth = getPath(
        database,
        "business.wealth.netWorth",
        undefined
    );

    if (wealth !== undefined) {
        return toNumber(wealth);
    }

    const cash = toNumber(
        getPath(database, "business.finances.cash", 0)
    );

    const assets = getPath(
        database,
        "business.finances.assets",
        []
    );

    let assetValue = 0;

    if (Array.isArray(assets)) {
        assetValue = assets.reduce(
            (sum, asset) =>
                sum +
                toNumber(
                    asset?.value ??
                    asset?.currentValue ??
                    asset?.purchasePrice ??
                    0
                ),
            0
        );
    }

    return cash + assetValue;
}

function getFollowers(database) {
    return toNumber(
        getPath(database, "media.followers", 0)
    );
}

function getFame(database) {
    return toNumber(
        getPath(database, "media.fame", 0)
    );
}

function getRank(database) {
    const rank = getPath(database, "career.rank", null);

    if (typeof rank === "number") {
        return rank;
    }

    if (rank && typeof rank === "object") {
        return toNumber(rank.position ?? rank.rank, 999);
    }

    return toNumber(
        getPath(database, "career.professional.rank", 999),
        999
    );
}

function getRecords(database) {
    return (
        getPath(database, "career.records", {}) ||
        getPath(database, "career.professional.records", {}) ||
        {}
    );
}

function getWinCount(database) {
    const records = getRecords(database);

    return toNumber(
        records.wins ??
        records.win ??
        getPath(database, "career.professional.wins", 0),
        0
    );
}

function getFightCount(database) {
    const records = getRecords(database);

    return toNumber(
        records.total ??
        records.fights ??
        getPath(database, "career.professional.fights", 0),
        0
    );
}

/* ============================================================
   CATÁLOGO DE MARCOS
   ============================================================ */

export const MILESTONE_DEFINITIONS = [

    /* --------------------------------------------------------
       VIDA
       -------------------------------------------------------- */

    {
        id: "birth",
        title: "Nascimento",
        description: "Você nasceu e iniciou sua história.",
        category: MILESTONE_CATEGORIES.LIFE,
        type: "birth",
        importance: MILESTONE_IMPORTANCE.TRIVIAL,
        rarity: MILESTONE_RARITY.COMMON,
        repeatable: false,
        condition: {
            type: "age_min",
            value: 0
        },
        score: 1
    },

    {
        id: "age_18",
        title: "Maioridade",
        description: "Você chegou aos 18 anos.",
        category: MILESTONE_CATEGORIES.LIFE,
        type: "age",
        importance: MILESTONE_IMPORTANCE.IMPORTANT,
        rarity: MILESTONE_RARITY.COMMON,
        repeatable: false,
        condition: {
            type: "age_min",
            value: 18
        },
        score: 10
    },

    {
        id: "age_30",
        title: "30 anos",
        description: "Você completou 30 anos.",
        category: MILESTONE_CATEGORIES.LIFE,
        type: "age",
        importance: MILESTONE_IMPORTANCE.NORMAL,
        rarity: MILESTONE_RARITY.COMMON,
        repeatable: false,
        condition: {
            type: "age_min",
            value: 30
        },
        score: 15
    },

    {
        id: "age_40",
        title: "40 anos",
        description: "Você completou 40 anos.",
        category: MILESTONE_CATEGORIES.LIFE,
        type: "age",
        importance: MILESTONE_IMPORTANCE.IMPORTANT,
        rarity: MILESTONE_RARITY.COMMON,
        repeatable: false,
        condition: {
            type: "age_min",
            value: 40
        },
        score: 25
    },

    {
        id: "age_50",
        title: "50 anos",
        description: "Você completou 50 anos.",
        category: MILESTONE_CATEGORIES.LIFE,
        type: "age",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.UNCOMMON,
        repeatable: false,
        condition: {
            type: "age_min",
            value: 50
        },
        score: 40
    },

    /* --------------------------------------------------------
       MMA
       -------------------------------------------------------- */

    {
        id: "first_training",
        title: "Primeiro Treino",
        description: "Você começou sua jornada nas artes marciais.",
        category: MILESTONE_CATEGORIES.MMA,
        type: "training",
        importance: MILESTONE_IMPORTANCE.IMPORTANT,
        rarity: MILESTONE_RARITY.COMMON,
        repeatable: false,
        condition: {
            type: "path_length_min",
            paths: [
                "training.sessions",
                "player.training.sessions"
            ],
            value: 1
        },
        score: 10
    },

    {
        id: "first_amateur_fight",
        title: "Primeira Luta Amadora",
        description: "Você entrou oficialmente no mundo das competições.",
        category: MILESTONE_CATEGORIES.MMA,
        type: "amateur_fight",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.COMMON,
        repeatable: false,
        condition: {
            type: "career_history_type",
            values: [
                "amateur_fight",
                "fight",
                "amateur"
            ]
        },
        score: 20
    },

    {
        id: "first_amateur_win",
        title: "Primeira Vitória Amadora",
        description: "Você conquistou sua primeira vitória competitiva.",
        category: MILESTONE_CATEGORIES.MMA,
        type: "amateur_win",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.COMMON,
        repeatable: false,
        condition: {
            type: "career_history_result",
            values: [
                "win",
                "victory",
                "amateur_win"
            ]
        },
        score: 25
    },

    {
        id: "amateur_champion",
        title: "Campeão Amador",
        description: "Você conquistou um título no MMA amador.",
        category: MILESTONE_CATEGORIES.MMA,
        type: "amateur_title",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.UNCOMMON,
        repeatable: false,
        condition: {
            type: "title_count_min",
            value: 1
        },
        score: 50
    },

    {
        id: "pro_debut",
        title: "Estreia Profissional",
        description: "Você realizou sua primeira luta profissional.",
        category: MILESTONE_CATEGORIES.CAREER,
        type: "pro_debut",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.COMMON,
        repeatable: false,
        condition: {
            type: "professional"
        },
        score: 50
    },

    {
        id: "first_pro_win",
        title: "Primeira Vitória Profissional",
        description: "Você venceu sua primeira luta como profissional.",
        category: MILESTONE_CATEGORIES.CAREER,
        type: "pro_win",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.COMMON,
        repeatable: false,
        condition: {
            type: "professional_wins_min",
            value: 1
        },
        score: 60
    },

    {
        id: "first_professional_contract",
        title: "Primeiro Contrato Profissional",
        description: "Você assinou seu primeiro contrato profissional.",
        category: MILESTONE_CATEGORIES.CAREER,
        type: "contract",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.COMMON,
        repeatable: false,
        condition: {
            type: "contract_count_min",
            value: 1
        },
        score: 50
    },

    {
        id: "international_contract",
        title: "Contrato Internacional",
        description: "Você conseguiu espaço em uma organização internacional.",
        category: MILESTONE_CATEGORIES.CAREER,
        type: "international_contract",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.UNCOMMON,
        repeatable: false,
        condition: {
            type: "career_stage_any",
            values: [
                "International",
                "Elite",
                "International Fighter",
                "Elite Fighter"
            ]
        },
        score: 100
    },

    {
        id: "ufc_debut",
        title: "Estreia no UFC",
        description: "Você chegou ao maior palco do MMA.",
        category: MILESTONE_CATEGORIES.MMA,
        type: "ufc_debut",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.LEGENDARY,
        repeatable: false,
        condition: {
            type: "organization",
            values: [
                "UFC",
                "ufc"
            ]
        },
        score: 250
    },

    {
        id: "ufc_first_win",
        title: "Primeira Vitória no UFC",
        description: "Você venceu sua primeira luta dentro do UFC.",
        category: MILESTONE_CATEGORIES.MMA,
        type: "ufc_win",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.LEGENDARY,
        repeatable: false,
        condition: {
            type: "organization_win",
            organization: "UFC"
        },
        score: 300
    },

    /* --------------------------------------------------------
       RANKING
       -------------------------------------------------------- */

    {
        id: "rank_top_15",
        title: "Top 15",
        description: "Você entrou no Top 15 da sua divisão.",
        category: MILESTONE_CATEGORIES.CAREER,
        type: "ranking",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.UNCOMMON,
        repeatable: false,
        condition: {
            type: "rank_max",
            value: 15
        },
        score: 100
    },

    {
        id: "rank_top_10",
        title: "Top 10",
        description: "Você entrou no Top 10 da sua divisão.",
        category: MILESTONE_CATEGORIES.CAREER,
        type: "ranking",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.RARE,
        repeatable: false,
        condition: {
            type: "rank_max",
            value: 10
        },
        score: 150
    },

    {
        id: "rank_top_5",
        title: "Top 5",
        description: "Você chegou ao Top 5 da divisão.",
        category: MILESTONE_CATEGORIES.CAREER,
        type: "ranking",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.VERY_RARE,
        repeatable: false,
        condition: {
            type: "rank_max",
            value: 5
        },
        score: 200
    },

    {
        id: "rank_number_one",
        title: "Número 1",
        description: "Você se tornou o desafiante número 1.",
        category: MILESTONE_CATEGORIES.CAREER,
        type: "ranking",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.LEGENDARY,
        repeatable: false,
        condition: {
            type: "rank_max",
            value: 1
        },
        score: 300
    },

    /* --------------------------------------------------------
       TÍTULOS
       -------------------------------------------------------- */

    {
        id: "first_major_title",
        title: "Primeiro Título",
        description: "Você conquistou seu primeiro cinturão importante.",
        category: MILESTONE_CATEGORIES.MMA,
        type: "title",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.VERY_RARE,
        repeatable: false,
        condition: {
            type: "title_count_min",
            value: 1
        },
        score: 300
    },

    {
        id: "title_defense",
        title: "Primeira Defesa de Título",
        description: "Você defendeu um cinturão com sucesso.",
        category: MILESTONE_CATEGORIES.MMA,
        type: "title_defense",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.VERY_RARE,
        repeatable: false,
        condition: {
            type: "career_history_type",
            values: [
                "title_defense",
                "title_defended",
                "successful_title_defense"
            ]
        },
        score: 350
    },

    {
        id: "double_champion",
        title: "Campeão de Duas Divisões",
        description: "Você conquistou títulos em duas divisões diferentes.",
        category: MILESTONE_CATEGORIES.MMA,
        type: "double_champion",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.LEGENDARY,
        repeatable: false,
        condition: {
            type: "title_divisions_min",
            value: 2
        },
        score: 500
    },

    /* --------------------------------------------------------
       RELACIONAMENTOS
       -------------------------------------------------------- */

    {
        id: "first_serious_relationship",
        title: "Primeiro Relacionamento Sério",
        description: "Você iniciou seu primeiro relacionamento sério.",
        category: MILESTONE_CATEGORIES.RELATIONSHIP,
        type: "relationship",
        importance: MILESTONE_IMPORTANCE.IMPORTANT,
        rarity: MILESTONE_RARITY.COMMON,
        repeatable: false,
        condition: {
            type: "relationship_type",
            values: [
                "partner",
                "serious",
                "romantic"
            ]
        },
        score: 20
    },

    {
        id: "engagement",
        title: "Noivado",
        description: "Você ficou noivo.",
        category: MILESTONE_CATEGORIES.RELATIONSHIP,
        type: "engagement",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.UNCOMMON,
        repeatable: false,
        condition: {
            type: "marriage_status",
            values: [
                "engaged",
                "married"
            ]
        },
        score: 50
    },

    {
        id: "marriage",
        title: "Casamento",
        description: "Você se casou.",
        category: MILESTONE_CATEGORIES.RELATIONSHIP,
        type: "marriage",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.UNCOMMON,
        repeatable: false,
        condition: {
            type: "marriage_status",
            values: [
                "married"
            ]
        },
        score: 75
    },

    /* --------------------------------------------------------
       FAMÍLIA
       -------------------------------------------------------- */

    {
        id: "first_child",
        title: "Primeiro Filho",
        description: "Você teve seu primeiro filho.",
        category: MILESTONE_CATEGORIES.FAMILY,
        type: "child_birth",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.UNCOMMON,
        repeatable: false,
        condition: {
            type: "children_min",
            value: 1
        },
        score: 100
    },

    {
        id: "three_children",
        title: "Família Grande",
        description: "Você chegou a três filhos.",
        category: MILESTONE_CATEGORIES.FAMILY,
        type: "children",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.RARE,
        repeatable: false,
        condition: {
            type: "children_min",
            value: 3
        },
        score: 150
    },

    {
        id: "five_children",
        title: "Grande Dinastia Familiar",
        description: "Sua família chegou a cinco filhos.",
        category: MILESTONE_CATEGORIES.FAMILY,
        type: "children",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.VERY_RARE,
        repeatable: false,
        condition: {
            type: "children_min",
            value: 5
        },
        score: 250
    },

    /* --------------------------------------------------------
       EDUCAÇÃO
       -------------------------------------------------------- */

    {
        id: "education_started",
        title: "Início dos Estudos",
        description: "Você iniciou uma formação educacional.",
        category: MILESTONE_CATEGORIES.EDUCATION,
        type: "education",
        importance: MILESTONE_IMPORTANCE.NORMAL,
        rarity: MILESTONE_RARITY.COMMON,
        repeatable: false,
        condition: {
            type: "education_active"
        },
        score: 20
    },

    {
        id: "graduation",
        title: "Formatura",
        description: "Você concluiu uma formação.",
        category: MILESTONE_CATEGORIES.EDUCATION,
        type: "graduation",
        importance: MILESTONE_IMPORTANCE.IMPORTANT,
        rarity: MILESTONE_RARITY.COMMON,
        repeatable: false,
        condition: {
            type: "education_completed"
        },
        score: 50
    },

    /* --------------------------------------------------------
       EMPREGO
       -------------------------------------------------------- */

    {
        id: "first_job",
        title: "Primeiro Emprego",
        description: "Você conseguiu seu primeiro trabalho.",
        category: MILESTONE_CATEGORIES.EMPLOYMENT,
        type: "job",
        importance: MILESTONE_IMPORTANCE.IMPORTANT,
        rarity: MILESTONE_RARITY.COMMON,
        repeatable: false,
        condition: {
            type: "employment_active"
        },
        score: 25
    },

    {
        id: "career_promotion",
        title: "Primeira Promoção",
        description: "Você foi promovido no trabalho.",
        category: MILESTONE_CATEGORIES.EMPLOYMENT,
        type: "promotion",
        importance: MILESTONE_IMPORTANCE.IMPORTANT,
        rarity: MILESTONE_RARITY.UNCOMMON,
        repeatable: false,
        condition: {
            type: "career_history_type",
            values: [
                "job_promotion",
                "promotion"
            ]
        },
        score: 50
    },

    {
        id: "business_owner",
        title: "Empreendedor",
        description: "Você iniciou seu próprio negócio.",
        category: MILESTONE_CATEGORIES.EMPLOYMENT,
        type: "business",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.UNCOMMON,
        repeatable: false,
        condition: {
            type: "business_active"
        },
        score: 100
    },

    /* --------------------------------------------------------
       FINANÇAS
       -------------------------------------------------------- */

    {
        id: "wealth_100k",
        title: "Primeiros 100 Mil",
        description: "Seu patrimônio chegou a 100 mil.",
        category: MILESTONE_CATEGORIES.FINANCE,
        type: "wealth",
        importance: MILESTONE_IMPORTANCE.IMPORTANT,
        rarity: MILESTONE_RARITY.COMMON,
        repeatable: false,
        condition: {
            type: "net_worth_min",
            value: 100000
        },
        score: 50
    },

    {
        id: "wealth_1m",
        title: "Milionário",
        description: "Seu patrimônio chegou a 1 milhão.",
        category: MILESTONE_CATEGORIES.FINANCE,
        type: "wealth",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.UNCOMMON,
        repeatable: false,
        condition: {
            type: "net_worth_min",
            value: 1000000
        },
        score: 150
    },

    {
        id: "wealth_10m",
        title: "Multimilionário",
        description: "Seu patrimônio chegou a 10 milhões.",
        category: MILESTONE_CATEGORIES.FINANCE,
        type: "wealth",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.RARE,
        repeatable: false,
        condition: {
            type: "net_worth_min",
            value: 10000000
        },
        score: 300
    },

    {
        id: "wealth_100m",
        title: "Centimilionário",
        description: "Seu patrimônio chegou a 100 milhões.",
        category: MILESTONE_CATEGORIES.FINANCE,
        type: "wealth",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.VERY_RARE,
        repeatable: false,
        condition: {
            type: "net_worth_min",
            value: 100000000
        },
        score: 500
    },

    {
        id: "wealth_1b",
        title: "Bilionário",
        description: "Seu patrimônio chegou a 1 bilhão.",
        category: MILESTONE_CATEGORIES.FINANCE,
        type: "wealth",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.LEGENDARY,
        repeatable: false,
        condition: {
            type: "net_worth_min",
            value: 1000000000
        },
        score: 1000
    },

    /* --------------------------------------------------------
       RESIDÊNCIA
       -------------------------------------------------------- */

    {
        id: "first_home",
        title: "Primeira Casa",
        description: "Você conquistou sua primeira residência própria.",
        category: MILESTONE_CATEGORIES.RESIDENCE,
        type: "home",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.COMMON,
        repeatable: false,
        condition: {
            type: "residence_owned"
        },
        score: 75
    },

    {
        id: "luxury_home",
        title: "Casa de Luxo",
        description: "Você alcançou um padrão residencial de luxo.",
        category: MILESTONE_CATEGORIES.RESIDENCE,
        type: "luxury_home",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.RARE,
        repeatable: false,
        condition: {
            type: "residence_quality_min",
            value: 7
        },
        score: 150
    },

    {
        id: "mansion",
        title: "Mansão",
        description: "Você conquistou uma mansão.",
        category: MILESTONE_CATEGORIES.RESIDENCE,
        type: "mansion",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.VERY_RARE,
        repeatable: false,
        condition: {
            type: "residence_type",
            values: [
                "mansion",
                "estate",
                "farm"
            ]
        },
        score: 250
    },

    /* --------------------------------------------------------
       VEÍCULOS
       -------------------------------------------------------- */

    {
        id: "first_vehicle",
        title: "Primeiro Veículo",
        description: "Você comprou seu primeiro veículo.",
        category: MILESTONE_CATEGORIES.VEHICLE,
        type: "vehicle",
        importance: MILESTONE_IMPORTANCE.NORMAL,
        rarity: MILESTONE_RARITY.COMMON,
        repeatable: false,
        condition: {
            type: "vehicles_min",
            value: 1
        },
        score: 25
    },

    {
        id: "luxury_vehicle",
        title: "Veículo de Luxo",
        description: "Você comprou um veículo de alto padrão.",
        category: MILESTONE_CATEGORIES.VEHICLE,
        type: "luxury_vehicle",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.RARE,
        repeatable: false,
        condition: {
            type: "vehicle_category",
            values: [
                "luxury",
                "supercar",
                "sports"
            ]
        },
        score: 100
    },

    /* --------------------------------------------------------
       MÍDIA
       -------------------------------------------------------- */

    {
        id: "fame_100",
        title: "Famoso",
        description: "Sua fama chegou a 100.",
        category: MILESTONE_CATEGORIES.MEDIA,
        type: "fame",
        importance: MILESTONE_IMPORTANCE.IMPORTANT,
        rarity: MILESTONE_RARITY.COMMON,
        repeatable: false,
        condition: {
            type: "fame_min",
            value: 100
        },
        score: 50
    },

    {
        id: "followers_100k",
        title: "100 Mil Seguidores",
        description: "Você alcançou 100 mil seguidores.",
        category: MILESTONE_CATEGORIES.MEDIA,
        type: "followers",
        importance: MILESTONE_IMPORTANCE.MAJOR,
        rarity: MILESTONE_RARITY.UNCOMMON,
        repeatable: false,
        condition: {
            type: "followers_min",
            value: 100000
        },
        score: 100
    },

    {
        id: "followers_1m",
        title: "1 Milhão de Seguidores",
        description: "Você ultrapassou a marca de um milhão de seguidores.",
        category: MILESTONE_CATEGORIES.MEDIA,
        type: "followers",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.RARE,
        repeatable: false,
        condition: {
            type: "followers_min",
            value: 1000000
        },
        score: 250
    },

    {
        id: "followers_10m",
        title: "10 Milhões de Seguidores",
        description: "Você se tornou uma das maiores personalidades do mundo.",
        category: MILESTONE_CATEGORIES.MEDIA,
        type: "followers",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.VERY_RARE,
        repeatable: false,
        condition: {
            type: "followers_min",
            value: 10000000
        },
        score: 500
    },

    /* --------------------------------------------------------
       LEGADO
       -------------------------------------------------------- */

    {
        id: "retirement",
        title: "Aposentadoria",
        description: "Você encerrou oficialmente sua carreira como lutador.",
        category: MILESTONE_CATEGORIES.LEGACY,
        type: "retirement",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.UNCOMMON,
        repeatable: false,
        condition: {
            type: "retired"
        },
        score: 200
    },

    {
        id: "hall_of_fame",
        title: "Hall da Fama",
        description: "Seu legado foi reconhecido entrando para o Hall da Fama.",
        category: MILESTONE_CATEGORIES.LEGACY,
        type: "hall_of_fame",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.LEGENDARY,
        repeatable: false,
        condition: {
            type: "hall_of_fame"
        },
        score: 1000
    },

    /* --------------------------------------------------------
       DINASTIA
       -------------------------------------------------------- */

    {
        id: "dynasty_founded",
        title: "Dinastia Fundada",
        description: "Você estabeleceu uma família e um legado para futuras gerações.",
        category: MILESTONE_CATEGORIES.DYNASTY,
        type: "dynasty",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.RARE,
        repeatable: false,
        condition: {
            type: "dynasty_active"
        },
        score: 300
    },

    {
        id: "first_heir",
        title: "Primeiro Herdeiro",
        description: "A próxima geração da sua família está preparada para continuar o legado.",
        category: MILESTONE_CATEGORIES.DYNASTY,
        type: "heir",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.VERY_RARE,
        repeatable: false,
        condition: {
            type: "heir_exists"
        },
        score: 500
    },

    {
        id: "second_generation",
        title: "Segunda Geração",
        description: "Seu legado ultrapassou a primeira geração.",
        category: MILESTONE_CATEGORIES.DYNASTY,
        type: "generation",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.LEGENDARY,
        repeatable: false,
        condition: {
            type: "generation_min",
            value: 2
        },
        score: 750
    },

    {
        id: "third_generation",
        title: "Terceira Geração",
        description: "Sua família se tornou uma verdadeira dinastia.",
        category: MILESTONE_CATEGORIES.DYNASTY,
        type: "generation",
        importance: MILESTONE_IMPORTANCE.LEGENDARY,
        rarity: MILESTONE_RARITY.LEGENDARY,
        repeatable: false,
        condition: {
            type: "generation_min",
            value: 3
        },
        score: 1500
    }
];

/* ============================================================
   ESTADO
   ============================================================ */

function createEmptyState() {
    return {
        version: LIFE_MILESTONES_VERSION,

        definitions: clone(MILESTONE_DEFINITIONS),

        achievements: [],

        progress: {},

        history: [],

        notifications: [],

        stats: {
            totalDefined: MILESTONE_DEFINITIONS.length,
            achieved: 0,
            available: 0,
            locked: 0,
            failed: 0,
            totalScore: 0,
            highestImportance: 0,
            highestRarity: null,
            lastAchievedAt: null
        },

        settings: clone(DEFAULT_CONFIG),

        initializedAt: null,
        lastCheckAt: null
    };
}

function ensureState(database) {
    if (!database) {
        throw new Error("lifeMilestones: database é obrigatório.");
    }

    if (!database.life) {
        database.life = {};
    }

    if (!database.life.milestones) {
        database.life.milestones = createEmptyState();
    }

    const state = database.life.milestones;

    if (!Array.isArray(state.definitions)) {
        state.definitions = clone(MILESTONE_DEFINITIONS);
    }

    if (!Array.isArray(state.achievements)) {
        state.achievements = [];
    }

    if (!state.progress || typeof state.progress !== "object") {
        state.progress = {};
    }

    if (!Array.isArray(state.history)) {
        state.history = [];
    }

    if (!Array.isArray(state.notifications)) {
        state.notifications = [];
    }

    if (!state.stats || typeof state.stats !== "object") {
        state.stats = {};
    }

    state.settings = {
        ...DEFAULT_CONFIG,
        ...(state.settings || {})
    };

    return state;
}

/* ============================================================
   DEFINIÇÕES
   ============================================================ */

export function getMilestoneDefinition(database, milestoneId) {
    const state = ensureState(database);

    return (
        state.definitions.find(
            milestone => milestone.id === milestoneId
        ) || null
    );
}

export function getAllMilestoneDefinitions(database) {
    const state = ensureState(database);

    return clone(state.definitions);
}

export function registerMilestoneDefinition(
    database,
    definition
) {
    const state = ensureState(database);

    if (!definition?.id) {
        throw new Error(
            "lifeMilestones: definição precisa de id."
        );
    }

    const normalized = normalizeDefinition(definition);

    const index = state.definitions.findIndex(
        item => item.id === normalized.id
    );

    if (index >= 0) {
        state.definitions[index] = normalized;
    } else {
        state.definitions.push(normalized);
    }

    state.stats.totalDefined = state.definitions.length;

    return clone(normalized);
}

function normalizeDefinition(definition) {
    return {
        id: String(definition.id),

        title:
            definition.title ||
            definition.name ||
            "Marco",

        description:
            definition.description ||
            "",

        category:
            definition.category ||
            MILESTONE_CATEGORIES.PERSONAL,

        type:
            definition.type ||
            "custom",

        importance: clamp(
            definition.importance ?? 3,
            1,
            6
        ),

        rarity:
            definition.rarity ||
            MILESTONE_RARITY.COMMON,

        repeatable:
            Boolean(definition.repeatable),

        condition:
            clone(definition.condition || null),

        requirements:
            clone(definition.requirements || []),

        rewards:
            clone(definition.rewards || []),

        score: toNumber(
            definition.score,
            0
        ),

        hidden:
            Boolean(definition.hidden),

        icon:
            definition.icon ||
            null,

        metadata:
            clone(definition.metadata || {})
    };
}

/* ============================================================
   CONDIÇÕES
   ============================================================ */

export function evaluateMilestoneCondition(
    database,
    condition
) {
    if (!condition) return false;

    switch (condition.type) {

        case "age_min":
            return getPlayerAge(database) >=
                toNumber(condition.value);

        case "age_max":
            return getPlayerAge(database) <=
                toNumber(condition.value);

        case "professional":
            return getProfessional(database);

        case "career_stage_any":
            return includesValue(
                condition.values,
                getCareerStage(database)
            );

        case "career_history_type": {
            const history = getCareerHistory(database);

            return history.some(item =>
                includesValue(
                    condition.values,
                    item?.type
                )
            );
        }

        case "career_history_result": {
            const history = getCareerHistory(database);

            return history.some(item =>
                includesValue(
                    condition.values,
                    item?.result
                ) ||
                includesValue(
                    condition.values,
                    item?.outcome
                )
            );
        }

        case "professional_wins_min":
            return getWinCount(database) >=
                toNumber(condition.value);

        case "professional_fights_min":
            return getFightCount(database) >=
                toNumber(condition.value);

        case "contract_count_min": {
            const contracts =
                getPath(
                    database,
                    "career.contracts",
                    getPath(
                        database,
                        "business.contracts",
                        []
                    )
                );

            return arrayLength(contracts) >=
                toNumber(condition.value);
        }

        case "organization": {
            const organization =
                getPath(
                    database,
                    "career.currentOrganization",
                    getPath(
                        database,
                        "career.organization",
                        getPath(
                            database,
                            "player.career.organization",
                            ""
                        )
                    )
                );

            return includesValue(
                condition.values,
                organization
            );
        }

        case "organization_win": {
            const history = getCareerHistory(database);

            return history.some(item =>
                includesValue(
                    condition.values || [condition.organization],
                    item?.organization
                ) &&
                includesValue(
                    ["win", "victory"],
                    item?.result
                )
            );
        }

        case "rank_max":
            return getRank(database) <=
                toNumber(condition.value);

        case "title_count_min":
            return getTitles(database).length >=
                toNumber(condition.value);

        case "title_divisions_min": {
            const titles = getTitles(database);

            const divisions = new Set();

            for (const title of titles) {
                const division =
                    title?.divisionId ??
                    title?.division ??
                    title?.weightClass;

                if (division) {
                    divisions.add(
                        normalizeText(division)
                    );
                }
            }

            return divisions.size >=
                toNumber(condition.value);
        }

        case "relationship_type": {
            const relationships =
                getRelationships(database);

            return relationships.some(
                relationship =>
                    includesValue(
                        condition.values,
                        relationship?.type
                    ) ||
                    includesValue(
                        condition.values,
                        relationship?.status
                    )
            );
        }

        case "marriage_status": {
            const marriage = getMarriage(database);

            const status =
                marriage?.status ??
                getPath(
                    database,
                    "life.marriage.status",
                    null
                );

            return includesValue(
                condition.values,
                status
            );
        }

        case "children_min":
            return getChildren(database).length >=
                toNumber(condition.value);

        case "education_active": {
            const education = getEducation(database);

            return Boolean(
                education.active ??
                education.current ??
                education.program ??
                education.enrolled
            );
        }

        case "education_completed": {
            const education = getEducation(database);

            return Boolean(
                education.completed ??
                education.graduated ??
                education.degree
            );
        }

        case "employment_active": {
            const employment = getEmployment(database);

            return Boolean(
                employment.active ??
                employment.current ??
                employment.job ??
                employment.status === "employed"
            );
        }

        case "business_active": {
            const businesses =
                getPath(
                    database,
                    "business.businesses",
                    getPath(
                        database,
                        "life.employment.businesses",
                        []
                    )
                );

            return arrayLength(businesses) > 0;
        }

        case "net_worth_min":
            return getNetWorth(database) >=
                toNumber(condition.value);

        case "residence_owned": {
            const residence = getResidence(database);

            return Boolean(
                residence.owned ??
                residence.owner ??
                residence.ownership === "owned" ??
                residence.type === "house"
            );
        }

        case "residence_quality_min": {
            const residence = getResidence(database);

            return toNumber(
                residence.quality ??
                residence.level ??
                residence.rating ??
                0
            ) >= toNumber(condition.value);
        }

        case "residence_type": {
            const residence = getResidence(database);

            return includesValue(
                condition.values,
                residence.type
            );
        }

        case "vehicles_min":
            return getVehicles(database).length >=
                toNumber(condition.value);

        case "vehicle_category": {
            const vehicles = getVehicles(database);

            return vehicles.some(vehicle =>
                includesValue(
                    condition.values,
                    vehicle?.category
                ) ||
                includesValue(
                    condition.values,
                    vehicle?.type
                )
            );
        }

        case "fame_min":
            return getFame(database) >=
                toNumber(condition.value);

        case "followers_min":
            return getFollowers(database) >=
                toNumber(condition.value);

        case "retired":
            return Boolean(
                getPath(
                    database,
                    "career.retired",
                    false
                ) ||
                getPath(
                    database,
                    "media.retirement.retired",
                    false
                ) ||
                getPath(
                    database,
                    "player.retired",
                    false
                )
            );

        case "hall_of_fame":
            return Boolean(
                getPath(
                    database,
                    "career.hallOfFame",
                    false
                ) ||
                getPath(
                    database,
                    "career.hallOfFame.inducted",
                    false
                ) ||
                getPath(
                    database,
                    "media.legacy.hallOfFame",
                    false
                )
            );

        case "dynasty_active":
            return Boolean(
                getPath(
                    database,
                    "dynasty.active",
                    false
                ) ||
                getPath(
                    database,
                    "dynasty.activeCharacterId",
                    null
                )
            );

        case "heir_exists":
            return Boolean(
                getPath(
                    database,
                    "dynasty.heir",
                    null
                ) ||
                getPath(
                    database,
                    "dynasty.heirId",
                    null
                ) ||
                getPath(
                    database,
                    "dynasty.successor",
                    null
                )
            );

        case "generation_min":
            return toNumber(
                getPath(
                    database,
                    "dynasty.generation",
                    getPath(
                        database,
                        "dynasty.currentGeneration",
                        1
                    )
                ),
                1
            ) >= toNumber(condition.value);

        case "path_length_min": {
            const paths =
                Array.isArray(condition.paths)
                    ? condition.paths
                    : [];

            return paths.some(
                path =>
                    arrayLength(
                        getPath(
                            database,
                            path,
                            []
                        )
                    ) >=
                    toNumber(condition.value)
            );
        }

        case "path_exists":
            return hasPath(
                database,
                condition.path
            );

        case "path_equals":
            return (
                getPath(
                    database,
                    condition.path,
                    undefined
                ) === condition.value
            );

        case "path_greater_or_equal":
            return toNumber(
                getPath(
                    database,
                    condition.path,
                    0
                )
            ) >= toNumber(condition.value);

        case "path_less_or_equal":
            return toNumber(
                getPath(
                    database,
                    condition.path,
                    0
                )
            ) <= toNumber(condition.value);

        case "all":
            return Array.isArray(condition.conditions) &&
                condition.conditions.every(
                    child =>
                        evaluateMilestoneCondition(
                            database,
                            child
                        )
                );

        case "any":
            return Array.isArray(condition.conditions) &&
                condition.conditions.some(
                    child =>
                        evaluateMilestoneCondition(
                            database,
                            child
                        )
                );

        case "not":
            return !evaluateMilestoneCondition(
                database,
                condition.condition
            );

        default:
            return false;
    }
}

/* ============================================================
   PROGRESSO
   ============================================================ */

export function calculateMilestoneProgress(
    database,
    definition
) {
    if (!definition) return 0;

    const condition = definition.condition;

    if (!condition) {
        return 0;
    }

    switch (condition.type) {

        case "age_min":
            return clamp(
                getPlayerAge(database) /
                Math.max(1, toNumber(condition.value)),
                0,
                1
            );

        case "professional_wins_min":
            return clamp(
                getWinCount(database) /
                Math.max(1, toNumber(condition.value)),
                0,
                1
            );

        case "professional_fights_min":
            return clamp(
                getFightCount(database) /
                Math.max(1, toNumber(condition.value)),
                0,
                1
            );

        case "title_count_min":
            return clamp(
                getTitles(database).length /
                Math.max(1, toNumber(condition.value)),
                0,
                1
            );

        case "children_min":
            return clamp(
                getChildren(database).length /
                Math.max(1, toNumber(condition.value)),
                0,
                1
            );

        case "net_worth_min":
            return clamp(
                getNetWorth(database) /
                Math.max(1, toNumber(condition.value)),
                0,
                1
            );

        case "followers_min":
            return clamp(
                getFollowers(database) /
                Math.max(1, toNumber(condition.value)),
                0,
                1
            );

        case "fame_min":
            return clamp(
                getFame(database) /
                Math.max(1, toNumber(condition.value)),
                0,
                1
            );

        case "rank_max": {
            const rank = getRank(database);

            if (rank >= 999) return 0;

            return clamp(
                toNumber(condition.value) /
                Math.max(
                    1,
                    rank
                ),
                0,
                1
            );
        }

        default:
            return evaluateMilestoneCondition(
                database,
                condition
            )
                ? 1
                : 0;
    }
}

/* ============================================================
   ACHIEVEMENT
   ============================================================ */

function findAchievement(
    database,
    milestoneId
) {
    const state = ensureState(database);

    return state.achievements.find(
        achievement =>
            achievement.milestoneId === milestoneId
    ) || null;
}

export function hasAchievedMilestone(
    database,
    milestoneId
) {
    const achievement =
        findAchievement(
            database,
            milestoneId
        );

    return achievement?.status ===
        MILESTONE_STATUS.ACHIEVED;
}

export function achieveMilestone(
    database,
    milestoneId,
    options = {}
) {
    const state = ensureState(database);

    const definition =
        getMilestoneDefinition(
            database,
            milestoneId
        );

    if (!definition) {
        return null;
    }

    const existing =
        findAchievement(
            database,
            milestoneId
        );

    if (
        existing &&
        existing.status === MILESTONE_STATUS.ACHIEVED &&
        !definition.repeatable
    ) {
        return clone(existing);
    }

    const achievement = {
        id: generateId("achievement"),

        milestoneId: definition.id,

        title: definition.title,

        description: definition.description,

        category: definition.category,

        type: definition.type,

        importance: definition.importance,

        rarity: definition.rarity,

        status: MILESTONE_STATUS.ACHIEVED,

        score: toNumber(
            definition.score,
            0
        ),

        age: getPlayerAge(database),

        year: getCurrentYear(database),

        date: getCurrentDate(database),

        achievedAt: nowISO(),

        source:
            options.source ||
            "automatic",

        context:
            clone(options.context || {}),

        rewards:
            clone(definition.rewards || {})
    };

    if (
        existing &&
        definition.repeatable
    ) {
        state.achievements.push(
            achievement
        );
    } else if (existing) {
        const index =
            state.achievements.indexOf(
                existing
            );

        state.achievements[index] =
            achievement;
    } else {
        state.achievements.push(
            achievement
        );
    }

    state.history.push({
        id: generateId("milestone_history"),

        action: "achieved",

        milestoneId: definition.id,

        title: definition.title,

        age: getPlayerAge(database),

        year: getCurrentYear(database),

        date: getCurrentDate(database),

        timestamp: nowISO(),

        source:
            options.source ||
            "automatic"
    });

    if (state.settings.notifications) {
        state.notifications.unshift({
            id: generateId("milestone_notification"),

            milestoneId: definition.id,

            title: definition.title,

            description: definition.description,

            importance: definition.importance,

            rarity: definition.rarity,

            createdAt: nowISO(),

            read: false
        });
    }

    updateStats(database);

    syncHistory(
        database,
        achievement,
        options
    );

    applyRewards(
        database,
        definition,
        options
    );

    trimState(database);

    return clone(achievement);
}

/* ============================================================
   RECOMPENSAS
   ============================================================ */

function applyRewards(
    database,
    definition,
    options = {}
) {
    const state = ensureState(database);

    if (
        !state.settings.automaticRewards ||
        options.applyRewards === false
    ) {
        return [];
    }

    const rewards =
        Array.isArray(definition.rewards)
            ? definition.rewards
            : [];

    const applied = [];

    for (const reward of rewards) {
        if (!reward?.type) continue;

        switch (reward.type) {

            case "add":
                if (reward.path) {
                    addPath(
                        database,
                        reward.path,
                        reward.amount
                    );

                    applied.push(
                        clone(reward)
                    );
                }
                break;

            case "set":
                if (reward.path) {
                    setPath(
                        database,
                        reward.path,
                        clone(reward.value)
                    );

                    applied.push(
                        clone(reward)
                    );
                }
                break;

            case "score":
                addPath(
                    database,
                    "life.milestones.stats.rewardScore",
                    reward.amount || 0
                );

                applied.push(
                    clone(reward)
                );
                break;

            default:
                break;
        }
    }

    return applied;
}

/* ============================================================
   HISTÓRICO
   ============================================================ */

function syncHistory(
    database,
    achievement,
    options = {}
) {
    const state = ensureState(database);

    if (!state.settings.automaticHistory) {
        return;
    }

    const api =
        options.apis?.lifeHistory ||
        options.lifeHistoryAPI ||
        null;

    if (
        api &&
        typeof api.add === "function"
    ) {
        try {
            api.add(
                database,
                {
                    type: "milestone",
                    title: achievement.title,
                    description:
                        achievement.description,
                    importance:
                        achievement.importance,
                    category:
                        achievement.category,
                    milestoneId:
                        achievement.milestoneId,
                    age:
                        achievement.age,
                    year:
                        achievement.year
                }
            );
        } catch {
            /* Histórico é opcional. */
        }
    }
}

/* ============================================================
   CHECK DE UM MARCO
   ============================================================ */

export function checkMilestone(
    database,
    milestoneId,
    options = {}
) {
    const definition =
        getMilestoneDefinition(
            database,
            milestoneId
        );

    if (!definition) {
        return {
            milestoneId,
            exists: false,
            eligible: false,
            progress: 0
        };
    }

    const achieved =
        hasAchievedMilestone(
            database,
            milestoneId
        );

    if (
        achieved &&
        !definition.repeatable
    ) {
        return {
            milestoneId,
            exists: true,
            eligible: false,
            achieved: true,
            progress: 1
        };
    }

    const progress =
        calculateMilestoneProgress(
            database,
            definition
        );

    const eligible =
        evaluateMilestoneCondition(
            database,
            definition.condition
        );

    if (
        eligible &&
        options.achieve !== false
    ) {
        const achievement =
            achieveMilestone(
                database,
                milestoneId,
                options
            );

        return {
            milestoneId,
            exists: true,
            eligible: true,
            achieved: true,
            progress: 1,
            achievement
        };
    }

    updateProgress(
        database,
        milestoneId,
        progress
    );

    return {
        milestoneId,
        exists: true,
        eligible,
        achieved,
        progress
    };
}

/* ============================================================
   CHECK DE TODOS
   ============================================================ */

export function checkAllMilestones(
    database,
    options = {}
) {
    const state = ensureState(database);

    const results = [];
    const newlyAchieved = [];

    for (const definition of state.definitions) {

        if (definition.hidden && !options.includeHidden) {
            continue;
        }

        const before =
            hasAchievedMilestone(
                database,
                definition.id
            );

        const result =
            checkMilestone(
                database,
                definition.id,
                {
                    ...options,
                    achieve:
                        options.achieve !== false
                }
            );

        results.push(result);

        const after =
            hasAchievedMilestone(
                database,
                definition.id
            );

        if (!before && after) {
            newlyAchieved.push(
                definition.id
            );
        }
    }

    state.lastCheckAt = nowISO();

    updateStats(database);
    trimState(database);

    return {
        checked: results.length,

        achieved:
            results.filter(
                result => result.achieved
            ).length,

        newlyAchieved,

        results
    };
}

/* ============================================================
   PROGRESSO
   ============================================================ */

function updateProgress(
    database,
    milestoneId,
    progress
) {
    const state = ensureState(database);

    state.progress[milestoneId] = {
        milestoneId,

        progress:
            clamp(progress, 0, 1),

        percentage:
            Math.round(
                clamp(progress, 0, 1) * 100
            ),

        age:
            getPlayerAge(database),

        year:
            getCurrentYear(database),

        updatedAt:
            nowISO()
    };
}

export function getMilestoneProgress(
    database,
    milestoneId
) {
    const state = ensureState(database);

    const stored =
        state.progress[milestoneId];

    if (stored) {
        return clone(stored);
    }

    const definition =
        getMilestoneDefinition(
            database,
            milestoneId
        );

    if (!definition) {
        return null;
    }

    const progress =
        calculateMilestoneProgress(
            database,
            definition
        );

    return {
        milestoneId,

        progress,

        percentage:
            Math.round(progress * 100)
    };
}

/* ============================================================
   STATUS
   ============================================================ */

export function getMilestoneStatus(
    database,
    milestoneId
) {
    const definition =
        getMilestoneDefinition(
            database,
            milestoneId
        );

    if (!definition) {
        return null;
    }

    if (
        hasAchievedMilestone(
            database,
            milestoneId
        )
    ) {
        return MILESTONE_STATUS.ACHIEVED;
    }

    if (
        evaluateMilestoneCondition(
            database,
            definition.condition
        )
    ) {
        return MILESTONE_STATUS.AVAILABLE;
    }

    return definition.hidden
        ? MILESTONE_STATUS.HIDDEN
        : MILESTONE_STATUS.LOCKED;
}

/* ============================================================
   CONSULTAS
   ============================================================ */

export function getAchievedMilestones(
    database
) {
    const state = ensureState(database);

    return clone(
        state.achievements.filter(
            achievement =>
                achievement.status ===
                MILESTONE_STATUS.ACHIEVED
        )
    );
}

export function getAvailableMilestones(
    database
) {
    const state = ensureState(database);

    return state.definitions
        .filter(definition =>
            !hasAchievedMilestone(
                database,
                definition.id
            ) &&
            evaluateMilestoneCondition(
                database,
                definition.condition
            )
        )
        .map(clone);
}

export function getLockedMilestones(
    database
) {
    const state = ensureState(database);

    return state.definitions
        .filter(definition =>
            !hasAchievedMilestone(
                database,
                definition.id
            ) &&
            !evaluateMilestoneCondition(
                database,
                definition.condition
            )
        )
        .map(clone);
}

export function getNextMilestones(
    database,
    limit = 5
) {
    const state = ensureState(database);

    const candidates =
        state.definitions
            .filter(definition =>
                !hasAchievedMilestone(
                    database,
                    definition.id
                )
            )
            .map(definition => ({
                definition,

                progress:
                    calculateMilestoneProgress(
                        database,
                        definition
                    )
            }))
            .sort(
                (a, b) =>
                    b.progress - a.progress ||
                    b.definition.importance -
                    a.definition.importance
            );

    return candidates
        .slice(0, limit)
        .map(item => ({
            ...clone(item.definition),

            progress:
                item.progress,

            percentage:
                Math.round(
                    item.progress * 100
                )
        }));
}

export function getMilestonesByCategory(
    database,
    category
) {
    const state = ensureState(database);

    return clone(
        state.definitions.filter(
            definition =>
                definition.category === category
        )
    );
}

export function getMilestonesByRarity(
    database,
    rarity
) {
    const state = ensureState(database);

    return clone(
        state.definitions.filter(
            definition =>
                definition.rarity === rarity
        )
    );
}

export function getMilestonesByImportance(
    database,
    importance
) {
    const state = ensureState(database);

    return clone(
        state.definitions.filter(
            definition =>
                definition.importance ===
                importance
        )
    );
}

export function searchMilestones(
    database,
    query
) {
    const state = ensureState(database);

    const normalized =
        normalizeText(query);

    if (!normalized) {
        return clone(state.definitions);
    }

    return clone(
        state.definitions.filter(
            definition =>
                normalizeText(
                    definition.title
                ).includes(normalized) ||
                normalizeText(
                    definition.description
                ).includes(normalized) ||
                normalizeText(
                    definition.category
                ).includes(normalized) ||
                normalizeText(
                    definition.type
                ).includes(normalized)
        )
    );
}

/* ============================================================
   ESTATÍSTICAS
   ============================================================ */

export function updateStats(database) {
    const state = ensureState(database);

    const achieved =
        state.achievements.filter(
            achievement =>
                achievement.status ===
                MILESTONE_STATUS.ACHIEVED
        );

    const available =
        state.definitions.filter(
            definition =>
                !hasAchievedMilestone(
                    database,
                    definition.id
                ) &&
                evaluateMilestoneCondition(
                    database,
                    definition.condition
                )
        );

    const locked =
        state.definitions.filter(
            definition =>
                !hasAchievedMilestone(
                    database,
                    definition.id
                ) &&
                !evaluateMilestoneCondition(
                    database,
                    definition.condition
                )
        );

    const totalScore =
        achieved.reduce(
            (sum, achievement) =>
                sum +
                toNumber(
                    achievement.score
                ),
            0
        );

    const highestImportance =
        achieved.reduce(
            (max, achievement) =>
                Math.max(
                    max,
                    toNumber(
                        achievement.importance
                    )
                ),
            0
        );

    const rarityOrder = {
        [MILESTONE_RARITY.COMMON]: 1,
        [MILESTONE_RARITY.UNCOMMON]: 2,
        [MILESTONE_RARITY.RARE]: 3,
        [MILESTONE_RARITY.VERY_RARE]: 4,
        [MILESTONE_RARITY.LEGENDARY]: 5
    };

    let highestRarity = null;

    for (const achievement of achieved) {
        if (
            !highestRarity ||
            rarityOrder[achievement.rarity] >
            rarityOrder[highestRarity]
        ) {
            highestRarity =
                achievement.rarity;
        }
    }

    const last =
        [...achieved].sort(
            (a, b) =>
                new Date(b.achievedAt) -
                new Date(a.achievedAt)
        )[0] || null;

    state.stats = {
        ...state.stats,

        totalDefined:
            state.definitions.length,

        achieved:
            achieved.length,

        available:
            available.length,

        locked:
            locked.length,

        failed:
            state.achievements.filter(
                achievement =>
                    achievement.status ===
                    MILESTONE_STATUS.FAILED
            ).length,

        totalScore,

        highestImportance,

        highestRarity,

        lastAchievedAt:
            last?.achievedAt || null,

        completionPercentage:
            state.definitions.length > 0
                ? Math.round(
                    achieved.length /
                    state.definitions.length *
                    100
                )
                : 0
    };

    return clone(state.stats);
}

export function getMilestoneScore(
    database
) {
    updateStats(database);

    return toNumber(
        ensureState(database)
            .stats
            .totalScore
    );
}

/* ============================================================
   NOTIFICAÇÕES
   ============================================================ */

export function getMilestoneNotifications(
    database,
    unreadOnly = false
) {
    const state = ensureState(database);

    const notifications =
        unreadOnly
            ? state.notifications.filter(
                notification =>
                    !notification.read
            )
            : state.notifications;

    return clone(notifications);
}

export function markNotificationRead(
    database,
    notificationId
) {
    const state = ensureState(database);

    const notification =
        state.notifications.find(
            item =>
                item.id === notificationId
        );

    if (!notification) {
        return false;
    }

    notification.read = true;

    return true;
}

export function markAllNotificationsRead(
    database
) {
    const state = ensureState(database);

    for (const notification of state.notifications) {
        notification.read = true;
    }

    return true;
}

/* ============================================================
   PROCESSAMENTO AUTOMÁTICO
   ============================================================ */

export function processMilestones(
    database,
    context = {}
) {
    const state = ensureState(database);

    if (!state.settings.automaticChecks) {
        return {
            processed: false,
            reason: "automatic_checks_disabled",
            newlyAchieved: []
        };
    }

    const result =
        checkAllMilestones(
            database,
            {
                ...context,

                achieve: true
            }
        );

    state.lastCheckAt = nowISO();

    return {
        processed: true,

        context:
            context.type ||
            "general",

        checked:
            result.checked,

        newlyAchieved:
            result.newlyAchieved
    };
}

export function processMilestoneWeek(
    database
) {
    return processMilestones(
        database,
        {
            type: "week"
        }
    );
}

export function processMilestoneMonth(
    database
) {
    const state = ensureState(database);

    if (!state.settings.checkMonthly) {
        return {
            processed: false,
            reason: "monthly_checks_disabled"
        };
    }

    return processMilestones(
        database,
        {
            type: "month"
        }
    );
}

export function processMilestoneYear(
    database
) {
    const state = ensureState(database);

    if (!state.settings.checkYearly) {
        return {
            processed: false,
            reason: "yearly_checks_disabled"
        };
    }

    return processMilestones(
        database,
        {
            type: "year"
        }
    );
}

export function processAfterFight(
    database,
    fight = {},
    apis = {}
) {
    const state = ensureState(database);

    if (!state.settings.checkAfterFight) {
        return {
            processed: false
        };
    }

    return processMilestones(
        database,
        {
            type: "fight",
            fight,
            apis
        }
    );
}

export function processAfterContract(
    database,
    contract = {},
    apis = {}
) {
    const state = ensureState(database);

    if (!state.settings.checkAfterContract) {
        return {
            processed: false
        };
    }

    return processMilestones(
        database,
        {
            type: "contract",
            contract,
            apis
        }
    );
}

export function processAfterTitle(
    database,
    title = {},
    apis = {}
) {
    const state = ensureState(database);

    if (!state.settings.checkAfterTitle) {
        return {
            processed: false
        };
    }

    return processMilestones(
        database,
        {
            type: "title",
            title,
            apis
        }
    );
}

export function processAfterLifeEvent(
    database,
    event = {},
    apis = {}
) {
    const state = ensureState(database);

    if (!state.settings.checkAfterLifeEvent) {
        return {
            processed: false
        };
    }

    return processMilestones(
        database,
        {
            type: "life_event",
            event,
            apis
        }
    );
}

/* ============================================================
   HISTÓRICO DE MARCOS
   ============================================================ */

export function getMilestoneHistory(
    database,
    limit = 100
) {
    const state = ensureState(database);

    return clone(
        state.history
            .slice()
            .reverse()
            .slice(0, limit)
    );
}

/* ============================================================
   RESUMO
   ============================================================ */

export function getMilestoneSummary(
    database
) {
    const state = ensureState(database);

    updateStats(database);

    const achieved =
        getAchievedMilestones(database);

    return {
        version:
            LIFE_MILESTONES_VERSION,

        age:
            getPlayerAge(database),

        year:
            getCurrentYear(database),

        totalDefined:
            state.stats.totalDefined,

        achieved:
            state.stats.achieved,

        available:
            state.stats.available,

        locked:
            state.stats.locked,

        score:
            state.stats.totalScore,

        completionPercentage:
            state.stats.completionPercentage,

        highestImportance:
            state.stats.highestImportance,

        highestRarity:
            state.stats.highestRarity,

        recent:
            achieved
                .slice()
                .sort(
                    (a, b) =>
                        new Date(b.achievedAt) -
                        new Date(a.achievedAt)
                )
                .slice(0, 5),

        next:
            getNextMilestones(
                database,
                5
            )
    };
}

/* ============================================================
   RESET / SNAPSHOT
   ============================================================ */

export function snapshotMilestones(
    database
) {
    const state = ensureState(database);

    return clone(state);
}

export function resetMilestones(
    database
) {
    if (!database) {
        throw new Error(
            "lifeMilestones: database é obrigatório."
        );
    }

    database.life = database.life || {};

    database.life.milestones =
        createEmptyState();

    database.life.milestones.initializedAt =
        nowISO();

    return clone(
        database.life.milestones
    );
}

/* ============================================================
   CONFIGURAÇÃO
   ============================================================ */

export function configureMilestones(
    database,
    configuration = {}
) {
    const state = ensureState(database);

    state.settings = {
        ...state.settings,
        ...configuration
    };

    return clone(
        state.settings
    );
}

export function getMilestoneConfig(
    database
) {
    const state = ensureState(database);

    return clone(
        state.settings
    );
}

/* ============================================================
   VALIDAÇÃO
   ============================================================ */

export function validateMilestones(
    database
) {
    const state = ensureState(database);

    const errors = [];
    const warnings = [];

    if (!Array.isArray(state.definitions)) {
        errors.push(
            "definitions precisa ser um array."
        );
    }

    if (!Array.isArray(state.achievements)) {
        errors.push(
            "achievements precisa ser um array."
        );
    }

    if (!Array.isArray(state.history)) {
        errors.push(
            "history precisa ser um array."
        );
    }

    const ids = new Set();

    for (const definition of state.definitions) {
        if (!definition.id) {
            errors.push(
                "Existe definição sem id."
            );
            continue;
        }

        if (ids.has(definition.id)) {
            errors.push(
                `ID duplicado: ${definition.id}`
            );
        }

        ids.add(definition.id);

        if (!definition.title) {
            warnings.push(
                `Marco ${definition.id} não possui título.`
            );
        }

        if (!definition.condition) {
            warnings.push(
                `Marco ${definition.id} não possui condição.`
            );
        }
    }

    for (const achievement of state.achievements) {
        if (!achievement.milestoneId) {
            errors.push(
                "Achievement sem milestoneId."
            );
        }
    }

    return {
        valid:
            errors.length === 0,

        errors,

        warnings,

        definitions:
            state.definitions.length,

        achievements:
            state.achievements.length
    };
}

/* ============================================================
   TRIM
   ============================================================ */

function trimState(database) {
    const state = ensureState(database);

    if (
        state.achievements.length >
        state.settings.maxAchievements
    ) {
        state.achievements =
            state.achievements.slice(
                -state.settings.maxAchievements
            );
    }

    if (
        state.history.length >
        state.settings.maxHistory
    ) {
        state.history =
            state.history.slice(
                -state.settings.maxHistory
            );
    }

    if (
        state.notifications.length >
        state.settings.maxNotifications
    ) {
        state.notifications =
            state.notifications.slice(
                0,
                state.settings.maxNotifications
            );
    }
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

export function initializeMilestones(
    database,
    options = {}
) {
    const state = ensureState(database);

    if (!state.initializedAt) {
        state.initializedAt =
            nowISO();
    }

    if (
        options.checkNow !== false
    ) {
        checkAllMilestones(
            database,
            {
                source: "initialization",
                achieve: true
            }
        );
    }

    updateStats(database);

    return clone(state);
}

/* ============================================================
   API
   ============================================================ */

export const lifeMilestonesAPI = {
    version:
        LIFE_MILESTONES_VERSION,

    categories:
        MILESTONE_CATEGORIES,

    statuses:
        MILESTONE_STATUS,

    importance:
        MILESTONE_IMPORTANCE,

    rarity:
        MILESTONE_RARITY,

    definitions:
        MILESTONE_DEFINITIONS,

    initialize:
        initializeMilestones,

    reset:
        resetMilestones,

    ensureState,

    configure:
        configureMilestones,

    getConfig:
        getMilestoneConfig,

    getDefinition:
        getMilestoneDefinition,

    getDefinitions:
        getAllMilestoneDefinitions,

    register:
        registerMilestoneDefinition,

    evaluate:
        evaluateMilestoneCondition,

    calculateProgress:
        calculateMilestoneProgress,

    getProgress:
        getMilestoneProgress,

    getStatus:
        getMilestoneStatus,

    check:
        checkMilestone,

    checkAll:
        checkAllMilestones,

    process:
        processMilestones,

    processWeek:
        processMilestoneWeek,

    processMonth:
        processMilestoneMonth,

    processYear:
        processMilestoneYear,

    afterFight:
        processAfterFight,

    afterContract:
        processAfterContract,

    afterTitle:
        processAfterTitle,

    afterLifeEvent:
        processAfterLifeEvent,

    achieve:
        achieveMilestone,

    hasAchieved:
        hasAchievedMilestone,

    getAchieved:
        getAchievedMilestones,

    getAvailable:
        getAvailableMilestones,

    getLocked:
        getLockedMilestones,

    getNext:
        getNextMilestones,

    byCategory:
        getMilestonesByCategory,

    byRarity:
        getMilestonesByRarity,

    byImportance:
        getMilestonesByImportance,

    search:
        searchMilestones,

    getHistory:
        getMilestoneHistory,

    getNotifications:
        getMilestoneNotifications,

    markNotificationRead,

    markAllNotificationsRead,

    getScore:
        getMilestoneScore,

    updateStats,

    getSummary:
        getMilestoneSummary,

    snapshot:
        snapshotMilestones,

    validate:
        validateMilestones
};

export default lifeMilestonesAPI;
