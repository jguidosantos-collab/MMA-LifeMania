// ============================================================
// MMA LIFE DYNASTY
// js/promotions/promotions.js
// ============================================================
export const PROMOTIONS_VERSION = 1;
// ============================================================
// PROMOTION LEVELS
// ============================================================
export const PROMOTION_LEVELS = Object.freeze({
    REGIONAL: "Regional",
    NATIONAL: "National",
    INTERNATIONAL: "International",
    ELITE: "Elite"
});
export const PROMOTION_LEVEL_ORDER = Object.freeze([
    PROMOTION_LEVELS.REGIONAL,
    PROMOTION_LEVELS.NATIONAL,
    PROMOTION_LEVELS.INTERNATIONAL,
    PROMOTION_LEVELS.ELITE
]);
// ============================================================
// PROMOTION STATUS
// ============================================================
export const PROMOTION_STATUS = Object.freeze({
    ACTIVE: "active",
    INACTIVE: "inactive",
    SUSPENDED: "suspended",
    CLOSED: "closed"
});
// ============================================================
// PROMOTION TYPES
// ============================================================
export const PROMOTION_TYPES = Object.freeze({
    REGIONAL: "regional",
    NATIONAL: "national",
    INTERNATIONAL: "international",
    MAJOR: "major",
    ELITE: "elite",
    CUSTOM: "custom"
});
// ============================================================
// HELPERS
// ============================================================
function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number)
        ? number
        : fallback;
}
function clamp(value, min = 0, max = 100) {
    return Math.min(
        max,
        Math.max(
            min,
            safeNumber(value, min)
        )
    );
}
function clone(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return value;
    }
    return JSON.parse(
        JSON.stringify(value)
    );
}
function createId(prefix = "promotion") {
    return (
        prefix +
        "_" +
        Date.now().toString(36) +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 9)
    );
}
function normalizeText(value) {
    return String(
        value ?? ""
    )
        .trim()
        .toLowerCase();
}
// ============================================================
// DEFAULT PROMOTIONS
// ============================================================
export const DEFAULT_PROMOTIONS = Object.freeze([
    {
        id: "regional_brazil_combat",
        name: "Brazil Combat Series",
        shortName: "BCS",
        country: "Brazil",
        countryCode: "BR",
        region: "South America",
        level:
            PROMOTION_LEVELS.REGIONAL,
        type:
            PROMOTION_TYPES.REGIONAL,
        prestige: 18,
        popularity: 20,
        financialPower: 18,
        talentLevel: 25,
        active: true,
        requirements: {
            minimumAge: 15,
            minimumOVR: 20,
            minimumProfessionalFights: 0,
            minimumProfessionalWins: 0,
            minimumFame: 0
        }
    },
    {
        id: "national_brazil_mma",
        name: "Brazil National MMA",
        shortName: "BNM",
        country: "Brazil",
        countryCode: "BR",
        region: "South America",
        level:
            PROMOTION_LEVELS.NATIONAL,
        type:
            PROMOTION_TYPES.NATIONAL,
        prestige: 38,
        popularity: 40,
        financialPower: 35,
        talentLevel: 42,
        active: true,
        requirements: {
            minimumAge: 18,
            minimumOVR: 45,
            minimumProfessionalFights: 2,
            minimumProfessionalWins: 1,
            minimumFame: 5
        }
    },
    {
        id: "warrior_challenge",
        name: "Warrior Challenge",
        shortName: "WC",
        country: "United States",
        countryCode: "US",
        region: "North America",
        level:
            PROMOTION_LEVELS.NATIONAL,
        type:
            PROMOTION_TYPES.NATIONAL,
        prestige: 48,
        popularity: 50,
        financialPower: 48,
        talentLevel: 52,
        active: true,
        requirements: {
            minimumAge: 18,
            minimumOVR: 48,
            minimumProfessionalFights: 3,
            minimumProfessionalWins: 2,
            minimumFame: 10
        }
    },
    {
        id: "titan_fight_championship",
        name: "Titan Fight Championship",
        shortName: "TFC",
        country: "Mexico",
        countryCode: "MX",
        region: "North America",
        level:
            PROMOTION_LEVELS.INTERNATIONAL,
        type:
            PROMOTION_TYPES.INTERNATIONAL,
        prestige: 62,
        popularity: 60,
        financialPower: 58,
        talentLevel: 65,
        active: true,
        requirements: {
            minimumAge: 18,
            minimumOVR: 60,
            minimumProfessionalFights: 5,
            minimumProfessionalWins: 4,
            minimumFame: 20
        }
    },
    {
        id: "pfl",
        name: "Professional Fighters League",
        shortName: "PFL",
        country: "United States",
        countryCode: "US",
        region: "North America",
        level:
            PROMOTION_LEVELS.INTERNATIONAL,
        type:
            PROMOTION_TYPES.INTERNATIONAL,
        prestige: 82,
        popularity: 82,
        financialPower: 88,
        talentLevel: 86,
        active: true,
        requirements: {
            minimumAge: 18,
            minimumOVR: 72,
            minimumProfessionalFights: 8,
            minimumProfessionalWins: 6,
            minimumFame: 40
        }
    },
    {
        id: "one_championship",
        name: "ONE Championship",
        shortName: "ONE",
        country: "Singapore",
        countryCode: "SG",
        region: "Asia",
        level:
            PROMOTION_LEVELS.INTERNATIONAL,
        type:
            PROMOTION_TYPES.INTERNATIONAL,
        prestige: 86,
        popularity: 88,
        financialPower: 88,
        talentLevel: 90,
        active: true,
        requirements: {
            minimumAge: 18,
            minimumOVR: 75,
            minimumProfessionalFights: 8,
            minimumProfessionalWins: 6,
            minimumFame: 45
        }
    },
    {
        id: "bellator",
        name: "Bellator",
        shortName: "Bellator",
        country: "United States",
        countryCode: "US",
        region: "North America",
        level:
            PROMOTION_LEVELS.INTERNATIONAL,
        type:
            PROMOTION_TYPES.INTERNATIONAL,
        prestige: 84,
        popularity: 85,
        financialPower: 84,
        talentLevel: 88,
        active: true,
        requirements: {
            minimumAge: 18,
            minimumOVR: 74,
            minimumProfessionalFights: 8,
            minimumProfessionalWins: 6,
            minimumFame: 45
        }
    },
    {
        id: "ufc",
        name: "Ultimate Fighting Championship",
        shortName: "UFC",
        country: "United States",
        countryCode: "US",
        region: "Global",
        level:
            PROMOTION_LEVELS.ELITE,
        type:
            PROMOTION_TYPES.ELITE,
        prestige: 100,
        popularity: 100,
        financialPower: 100,
        talentLevel: 100,
        active: true,
        isTopOrganization: true,
        requirements: {
            minimumAge: 18,
            minimumOVR: 82,
            minimumProfessionalFights: 10,
            minimumProfessionalWins: 8,
            minimumFame: 60
        }
    }
]);
// ============================================================
// PROMOTION FACTORY
// ============================================================
export function createPromotion(options = {}) {
    const level =
        options.level ||
        PROMOTION_LEVELS.REGIONAL;
    return {
        id:
            options.id ||
            createId("promotion"),
        name:
            options.name ||
            "New MMA Promotion",
        shortName:
            options.shortName ||
            options.name ||
            "MMA",
        country:
            options.country ||
            null,
        countryCode:
            options.countryCode ||
            null,
        region:
            options.region ||
            null,
        city:
            options.city ||
            null,
        level,
        type:
            options.type ||
            levelToType(level),
        status:
            options.status ||
            PROMOTION_STATUS.ACTIVE,
        active:
            options.active !== false,
        isTopOrganization:
            options.isTopOrganization === true,
        prestige:
            clamp(
                options.prestige,
                0,
                100
            ),
        popularity:
            clamp(
                options.popularity,
                0,
                100
            ),
        financialPower:
            clamp(
                options.financialPower,
                0,
                100
            ),
        talentLevel:
            clamp(
                options.talentLevel,
                0,
                100
            ),
        divisions:
            Array.isArray(
                options.divisions
            )
                ? clone(options.divisions)
                : [],
        champions:
            options.champions
                ? clone(options.champions)
                : {},
        fighters:
            Array.isArray(
                options.fighters
            )
                ? [...options.fighters]
                : [],
        events:
            Array.isArray(
                options.events
            )
                ? [...options.events]
                : [],
        titles:
            Array.isArray(
                options.titles
            )
                ? clone(options.titles)
                : [],
        contracts:
            Array.isArray(
                options.contracts
            )
                ? clone(options.contracts)
                : [],
        finances: {
            revenue:
                safeNumber(
                    options.finances?.revenue,
                    0
                ),
            expenses:
                safeNumber(
                    options.finances?.expenses,
                    0
                ),
            balance:
                safeNumber(
                    options.finances?.balance,
                    0
                )
        },
        requirements:
            options.requirements
                ? clone(options.requirements)
                : defaultRequirements(level),
        createdAt:
            options.createdAt ||
            null,
        metadata:
            options.metadata
                ? clone(options.metadata)
                : {}
    };
}
// ============================================================
// LEVEL / TYPE HELPERS
// ============================================================
export function levelToType(level) {
    switch (level) {
        case PROMOTION_LEVELS.NATIONAL:
            return PROMOTION_TYPES.NATIONAL;
        case PROMOTION_LEVELS.INTERNATIONAL:
            return PROMOTION_TYPES.INTERNATIONAL;
        case PROMOTION_LEVELS.ELITE:
            return PROMOTION_TYPES.ELITE;
        default:
            return PROMOTION_TYPES.REGIONAL;
    }
}
export function getPromotionLevelIndex(level) {
    const index =
        PROMOTION_LEVEL_ORDER.indexOf(
            level
        );
    return index >= 0
        ? index
        : 0;
}
export function comparePromotionLevels(
    first,
    second
) {
    return (
        getPromotionLevelIndex(first) -
        getPromotionLevelIndex(second)
    );
}
// ============================================================
// REQUIREMENTS
// ============================================================
export function defaultRequirements(
    level
) {
    switch (level) {
        case PROMOTION_LEVELS.NATIONAL:
            return {
                minimumAge: 18,
                minimumOVR: 45,
                minimumProfessionalFights: 2,
                minimumProfessionalWins: 1,
                minimumFame: 5
            };
        case PROMOTION_LEVELS.INTERNATIONAL:
            return {
                minimumAge: 18,
                minimumOVR: 65,
                minimumProfessionalFights: 6,
                minimumProfessionalWins: 4,
                minimumFame: 25
            };
        case PROMOTION_LEVELS.ELITE:
            return {
                minimumAge: 18,
                minimumOVR: 82,
                minimumProfessionalFights: 10,
                minimumProfessionalWins: 8,
                minimumFame: 60
            };
        default:
            return {
                minimumAge: 15,
                minimumOVR: 20,
                minimumProfessionalFights: 0,
                minimumProfessionalWins: 0,
                minimumFame: 0
            };
    }
}
// ============================================================
// DATABASE
// ============================================================
export function createPromotionDatabase(
    options = {}
) {
    const database = {
        version:
            PROMOTIONS_VERSION,
        promotions: {},
        order: [],
        topOrganizationId:
            "ufc",
        lastUpdated:
            null
    };
    const source =
        Array.isArray(
            options.promotions
        )
            ? options.promotions
            : DEFAULT_PROMOTIONS;
    for (
        const promotionData of source
    ) {
        const promotion =
            createPromotion(
                promotionData
            );
        database.promotions[
            promotion.id
        ] = promotion;
        database.order.push(
            promotion.id
        );
    }
    if (
        options.topOrganizationId
    ) {
        database.topOrganizationId =
            options.topOrganizationId;
    }
    return database;
}
// ============================================================
// GET PROMOTIONS
// ============================================================
export function getPromotion(
    database,
    promotionId
) {
    if (
        !database ||
        !database.promotions
    ) {
        return null;
    }
    return (
        database.promotions[
            promotionId
        ] ||
        null
    );
}
export function getAllPromotions(
    database,
    options = {}
) {
    if (
        !database ||
        !database.promotions
    ) {
        return [];
    }
    let promotions =
        Object.values(
            database.promotions
        );
    if (
        options.activeOnly
    ) {
        promotions =
            promotions.filter(
                promotion =>
                    promotion.active &&
                    promotion.status ===
                        PROMOTION_STATUS.ACTIVE
            );
    }
    if (
        options.level
    ) {
        promotions =
            promotions.filter(
                promotion =>
                    promotion.level ===
                    options.level
            );
    }
    if (
        options.country
    ) {
        promotions =
            promotions.filter(
                promotion =>
                    normalizeText(
                        promotion.country
                    ) ===
                    normalizeText(
                        options.country
                    )
            );
    }
    return promotions;
}
// ============================================================
// FILTER
// ============================================================
export function filterPromotions(
    database,
    filters = {}
) {
    let promotions =
        getAllPromotions(
            database
        );
    if (
        filters.level
    ) {
        promotions =
            promotions.filter(
                promotion =>
                    promotion.level ===
                    filters.level
            );
    }
    if (
        filters.type
    ) {
        promotions =
            promotions.filter(
                promotion =>
                    promotion.type ===
                    filters.type
            );
    }
    if (
        filters.country
    ) {
        promotions =
            promotions.filter(
                promotion =>
                    normalizeText(
                        promotion.country
                    ) ===
                    normalizeText(
                        filters.country
                    )
            );
    }
    if (
        filters.region
    ) {
        promotions =
            promotions.filter(
                promotion =>
                    normalizeText(
                        promotion.region
                    ) ===
                    normalizeText(
                        filters.region
                    )
            );
    }
    if (
        filters.minPrestige !==
        undefined
    ) {
        promotions =
            promotions.filter(
                promotion =>
                    promotion.prestige >=
                    safeNumber(
                        filters.minPrestige
                    )
            );
    }
    if (
        filters.maxPrestige !==
        undefined
    ) {
        promotions =
            promotions.filter(
                promotion =>
                    promotion.prestige <=
                    safeNumber(
                        filters.maxPrestige
                    )
            );
    }
    return promotions;
}
// ============================================================
// SORT
// ============================================================
export function sortPromotions(
    promotions,
    sortBy = "prestige",
    direction = "desc"
) {
    const list =
        Array.isArray(promotions)
            ? [...promotions]
            : [];
    const multiplier =
        direction === "asc"
            ? 1
            : -1;
    list.sort(
        (a, b) => {
            let first = 0;
            let second = 0;
            switch (sortBy) {
                case "level":
                    first =
                        getPromotionLevelIndex(
                            a.level
                        );
                    second =
                        getPromotionLevelIndex(
                            b.level
                        );
                    break;
                case "popularity":
                    first =
                        safeNumber(
                            a.popularity
                        );
                    second =
                        safeNumber(
                            b.popularity
                        );
                    break;
                case "financialPower":
                    first =
                        safeNumber(
                            a.financialPower
                        );
                    second =
                        safeNumber(
                            b.financialPower
                        );
                    break;
                case "talentLevel":
                    first =
                        safeNumber(
                            a.talentLevel
                        );
                    second =
                        safeNumber(
                            b.talentLevel
                        );
                    break;
                case "prestige":
                default:
                    first =
                        safeNumber(
                            a.prestige
                        );
                    second =
                        safeNumber(
                            b.prestige
                        );
                    break;
            }
            return (
                (first - second) *
                multiplier
            );
        }
    );
    return list;
}
// ============================================================
// TOP ORGANIZATION
// ============================================================
export function getTopOrganization(
    database
) {
    if (
        !database
    ) {
        return null;
    }
    if (
        database.topOrganizationId
    ) {
        const promotion =
            getPromotion(
                database,
                database.topOrganizationId
            );
        if (
            promotion
        ) {
            return promotion;
        }
    }
    return sortPromotions(
        getAllPromotions(
            database
        ),
        "prestige",
        "desc"
    )[0] || null;
}
// ============================================================
// ORGANIZATION RANKING
// ============================================================
export function getPromotionRanking(
    database
) {
    return sortPromotions(
        getAllPromotions(
            database,
            {
                activeOnly: true
            }
        ),
        "prestige",
        "desc"
    );
}
export function getPromotionRank(
    database,
    promotionId
) {
    const ranking =
        getPromotionRanking(
            database
        );
    const index =
        ranking.findIndex(
            promotion =>
                promotion.id ===
                promotionId
        );
    return index >= 0
        ? index + 1
        : null;
}
// ============================================================
// REQUIREMENT CHECK
// ============================================================
export function getPlayerValue(
    player,
    paths = [],
    fallback = 0
) {
    for (
        const path of paths
    ) {
        const parts =
            path.split(".");
        let current =
            player;
        for (
            const part of parts
        ) {
            if (
                current === null ||
                current === undefined
            ) {
                break;
            }
            current =
                current[part];
        }
        if (
            current !== undefined &&
            current !== null
        ) {
            return safeNumber(
                current,
                fallback
            );
        }
    }
    return fallback;
}
export function getPlayerAge(
    player
) {
    return getPlayerValue(
        player,
        [
            "age",
            "identity.age",
            "physical.age"
        ],
        0
    );
}
export function getPlayerOVR(
    player
) {
    return getPlayerValue(
        player,
        [
            "ovr",
            "overall",
            "attributes.ovr",
            "ratings.ovr"
        ],
        0
    );
}
export function getProfessionalFights(
    player
) {
    return getPlayerValue(
        player,
        [
            "career.professional.stats.totalFights",
            "career.professional.record.total",
            "professional.totalFights",
            "record.professional.total"
        ],
        0
    );
}
export function getProfessionalWins(
    player
) {
    return getPlayerValue(
        player,
        [
            "career.professional.stats.wins",
            "career.professional.record.wins",
            "professional.wins",
            "record.professional.wins"
        ],
        0
    );
}
export function getPlayerFame(
    player
) {
    return getPlayerValue(
        player,
        [
            "media.fame",
            "fame",
            "media.reputation"
        ],
        0
    );
}
// ============================================================
// ELIGIBILITY
// ============================================================
export function checkPromotionEligibility(
    player,
    promotion,
    options = {}
) {
    if (
        !player ||
        !promotion
    ) {
        return {
            eligible: false,
            reasons: [
                "player_or_promotion_missing"
            ],
            requirements: {}
        };
    }
    if (
        promotion.active === false ||
        promotion.status !==
            PROMOTION_STATUS.ACTIVE
    ) {
        return {
            eligible: false,
            reasons: [
                "promotion_inactive"
            ],
            requirements:
                clone(
                    promotion.requirements
                )
        };
    }
    const requirements =
        promotion.requirements ||
        defaultRequirements(
            promotion.level
        );
    const age =
        getPlayerAge(
            player
        );
    const ovr =
        getPlayerOVR(
            player
        );
    const professionalFights =
        getProfessionalFights(
            player
        );
    const professionalWins =
        getProfessionalWins(
            player
        );
    const fame =
        getPlayerFame(
            player
        );
    const reasons = [];
    if (
        age <
        safeNumber(
            requirements.minimumAge,
            0
        )
    ) {
        reasons.push(
            "minimum_age"
        );
    }
    if (
        ovr <
        safeNumber(
            requirements.minimumOVR,
            0
        )
    ) {
        reasons.push(
            "minimum_ovr"
        );
    }
    if (
        professionalFights <
        safeNumber(
            requirements.minimumProfessionalFights,
            0
        )
    ) {
        reasons.push(
            "minimum_professional_fights"
        );
    }
    if (
        professionalWins <
        safeNumber(
            requirements.minimumProfessionalWins,
            0
        )
    ) {
        reasons.push(
            "minimum_professional_wins"
        );
    }
    if (
        fame <
        safeNumber(
            requirements.minimumFame,
            0
        )
    ) {
        reasons.push(
            "minimum_fame"
        );
    }
    return {
        eligible:
            reasons.length === 0,
        reasons,
        values: {
            age,
            ovr,
            professionalFights,
            professionalWins,
            fame
        },
        requirements:
            clone(
                requirements
            )
    };
}
// ============================================================
// CONTRACT / OFFER POWER
// ============================================================
export function calculateOfferPower(
    player,
    promotion
) {
    if (
        !player ||
        !promotion
    ) {
        return 0;
    }
    const ovr =
        getPlayerOVR(
            player
        );
    const fame =
        getPlayerFame(
            player
        );
    const wins =
        getProfessionalWins(
            player
        );
    const prestige =
        safeNumber(
            promotion.prestige,
            0
        );
    const talent =
        safeNumber(
            promotion.talentLevel,
            0
        );
    const value =
        (
            ovr * 0.35
        ) +
        (
            fame * 0.20
        ) +
        (
            Math.min(
                wins,
                20
            ) * 1.5
        ) +
        (
            prestige * 0.20
        ) +
        (
            talent * 0.05
        );
    return clamp(
        value,
        0,
        100
    );
}
// ============================================================
// PROMOTION FIT
// ============================================================
export function calculatePromotionFit(
    player,
    promotion
) {
    if (
        !player ||
        !promotion
    ) {
        return 0;
    }
    const eligibility =
        checkPromotionEligibility(
            player,
            promotion
        );
    const power =
        calculateOfferPower(
            player,
            promotion
        );
    if (
        !eligibility.eligible
    ) {
        return clamp(
            power * 0.55,
            0,
            100
        );
    }
    return clamp(
        power,
        0,
        100
    );
}
// ============================================================
// ADD / REMOVE PROMOTION
// ============================================================
export function addPromotion(
    database,
    promotionData
) {
    if (
        !database
    ) {
        return null;
    }
    if (
        !database.promotions
    ) {
        database.promotions = {};
    }
    if (
        !Array.isArray(
            database.order
        )
    ) {
        database.order = [];
    }
    const promotion =
        createPromotion(
            promotionData
        );
    database.promotions[
        promotion.id
    ] = promotion;
    if (
        !database.order.includes(
            promotion.id
        )
    ) {
        database.order.push(
            promotion.id
        );
    }
    database.lastUpdated =
        new Date().toISOString();
    return promotion;
}
export function removePromotion(
    database,
    promotionId
) {
    if (
        !database ||
        !database.promotions
    ) {
        return false;
    }
    if (
        !database.promotions[
            promotionId
        ]
    ) {
        return false;
    }
    delete database.promotions[
        promotionId
    ];
    database.order =
        Array.isArray(
            database.order
        )
            ? database.order.filter(
                id =>
                    id !==
                    promotionId
            )
            : [];
    if (
        database.topOrganizationId ===
        promotionId
    ) {
        database.topOrganizationId =
            "ufc";
    }
    database.lastUpdated =
        new Date().toISOString();
    return true;
}
// ============================================================
// UPDATE PROMOTION
// ============================================================
export function updatePromotion(
    database,
    promotionId,
    updates = {}
) {
    const promotion =
        getPromotion(
            database,
            promotionId
        );
    if (
        !promotion
    ) {
        return null;
    }
    Object.assign(
        promotion,
        clone(
            updates
        )
    );
    database.lastUpdated =
        new Date().toISOString();
    return promotion;
}
// ============================================================
// FIGHTER REGISTRATION
// ============================================================
export function addFighterToPromotion(
    database,
    promotionId,
    fighterId
) {
    const promotion =
        getPromotion(
            database,
            promotionId
        );
    if (
        !promotion ||
        !fighterId
    ) {
        return false;
    }
    if (
        !Array.isArray(
            promotion.fighters
        )
    ) {
        promotion.fighters = [];
    }
    if (
        !promotion.fighters.includes(
            fighterId
        )
    ) {
        promotion.fighters.push(
            fighterId
        );
    }
    return true;
}
export function removeFighterFromPromotion(
    database,
    promotionId,
    fighterId
) {
    const promotion =
        getPromotion(
            database,
            promotionId
        );
    if (
        !promotion ||
        !Array.isArray(
            promotion.fighters
        )
    ) {
        return false;
    }
    promotion.fighters =
        promotion.fighters.filter(
            id =>
                id !==
                fighterId
        );
    return true;
}
// ============================================================
// EVENT REGISTRATION
// ============================================================
export function addEventToPromotion(
    database,
    promotionId,
    eventId
) {
    const promotion =
        getPromotion(
            database,
            promotionId
        );
    if (
        !promotion ||
        !eventId
    ) {
        return false;
    }
    if (
        !Array.isArray(
            promotion.events
        )
    ) {
        promotion.events = [];
    }
    if (
        !promotion.events.includes(
            eventId
        )
    ) {
        promotion.events.push(
            eventId
        );
    }
    return true;
}
// ============================================================
// DIVISION REGISTRATION
// ============================================================
export function addDivisionToPromotion(
    database,
    promotionId,
    division
) {
    const promotion =
        getPromotion(
            database,
            promotionId
        );
    if (
        !promotion ||
        !division
    ) {
        return false;
    }
    if (
        !Array.isArray(
            promotion.divisions
        )
    ) {
        promotion.divisions = [];
    }
    const exists =
        promotion.divisions.some(
            item =>
                typeof item ===
                    "string"
                    ? item === division
                    : item.id === division.id
        );
    if (
        !exists
    ) {
        promotion.divisions.push(
            clone(
                division
            )
        );
    }
    return true;
}
// ============================================================
// CHAMPION
// ============================================================
export function setPromotionChampion(
    database,
    promotionId,
    division,
    fighterId
) {
    const promotion =
        getPromotion(
            database,
            promotionId
        );
    if (
        !promotion ||
        !division
    ) {
        return false;
    }
    if (
        !promotion.champions
    ) {
        promotion.champions = {};
    }
    promotion.champions[
        division
    ] =
        fighterId ||
        null;
    return true;
}
export function getPromotionChampion(
    database,
    promotionId,
    division
) {
    const promotion =
        getPromotion(
            database,
            promotionId
        );
    if (
        !promotion ||
        !promotion.champions
    ) {
        return null;
    }
    return (
        promotion.champions[
            division
        ] ||
        null
    );
}
// ============================================================
// FINANCES
// ============================================================
export function updatePromotionFinances(
    database,
    promotionId,
    revenue = 0,
    expenses = 0
) {
    const promotion =
        getPromotion(
            database,
            promotionId
        );
    if (
        !promotion
    ) {
        return null;
    }
    const income =
        safeNumber(
            revenue,
            0
        );
    const cost =
        safeNumber(
            expenses,
            0
        );
    promotion.finances.revenue +=
        income;
    promotion.finances.expenses +=
        cost;
    promotion.finances.balance +=
        income -
        cost;
    return promotion.finances;
}
// ============================================================
// PROMOTION STRENGTH
// ============================================================
export function calculatePromotionStrength(
    promotion
) {
    if (
        !promotion
    ) {
        return 0;
    }
    return clamp(
        (
            safeNumber(
                promotion.prestige
            ) * 0.35
        ) +
        (
            safeNumber(
                promotion.popularity
            ) * 0.20
        ) +
        (
            safeNumber(
                promotion.financialPower
            ) * 0.20
        ) +
        (
            safeNumber(
                promotion.talentLevel
            ) * 0.25
        ),
        0,
        100
    );
}
// ============================================================
// PLAYER PROMOTION HISTORY
// ============================================================
export function registerPlayerPromotionHistory(
    player,
    promotion,
    options = {}
) {
    if (
        !player ||
        !promotion
    ) {
        return null;
    }
    if (
        !player.career
    ) {
        player.career = {};
    }
    if (
        !Array.isArray(
            player.career.history
        )
    ) {
        player.career.history = [];
    }
    const entry = {
        promotionId:
            promotion.id,
        promotionName:
            promotion.name,
        level:
            promotion.level,
        joinedAt:
            options.joinedAt ||
            null,
        leftAt:
            options.leftAt ||
            null,
        fights:
            safeNumber(
                options.fights,
                0
            ),
        wins:
            safeNumber(
                options.wins,
                0
            ),
        losses:
            safeNumber(
                options.losses,
                0
            ),
        titleWins:
            safeNumber(
                options.titleWins,
                0
            )
    };
    player.career.history.push(
        entry
    );
    return entry;
}
// ============================================================
// VALIDATION
// ============================================================
export function validatePromotion(
    promotion
) {
    const errors = [];
    if (
        !promotion ||
        typeof promotion !==
            "object"
    ) {
        return {
            valid: false,
            errors: [
                "promotion_missing"
            ]
        };
    }
    if (
        !promotion.id
    ) {
        errors.push(
            "id_missing"
        );
    }
    if (
        !promotion.name
    ) {
        errors.push(
            "name_missing"
        );
    }
    if (
        !PROMOTION_LEVEL_ORDER.includes(
            promotion.level
        )
    ) {
        errors.push(
            "invalid_level"
        );
    }
    if (
        promotion.prestige < 0 ||
        promotion.prestige > 100
    ) {
        errors.push(
            "invalid_prestige"
        );
    }
    if (
        promotion.popularity < 0 ||
        promotion.popularity > 100
    ) {
        errors.push(
            "invalid_popularity"
        );
    }
    if (
        !Array.isArray(
            promotion.fighters
        )
    ) {
        errors.push(
            "fighters_invalid"
        );
    }
    if (
        !Array.isArray(
            promotion.events
        )
    ) {
        errors.push(
            "events_invalid"
        );
    }
    return {
        valid:
            errors.length === 0,
        errors
    };
}
export function validatePromotionDatabase(
    database
) {
    const errors = [];
    if (
        !database ||
        typeof database !==
            "object"
    ) {
        return {
            valid: false,
            errors: [
                "database_missing"
            ]
        };
    }
    if (
        !database.promotions ||
        typeof database.promotions !==
            "object"
    ) {
        errors.push(
            "promotions_missing"
        );
        return {
            valid: false,
            errors
        };
    }
    for (
        const promotion of
            Object.values(
                database.promotions
            )
    ) {
        const result =
            validatePromotion(
                promotion
            );
        if (
            !result.valid
        ) {
            errors.push({
                id:
                    promotion.id ||
                    null,
                errors:
                    result.errors
            });
        }
    }
    return {
        valid:
            errors.length === 0,
        errors
    };
}
// ============================================================
// SNAPSHOT / CLONE
// ============================================================
export function clonePromotion(
    promotion
) {
    return clone(
        promotion
    );
}
export function clonePromotionDatabase(
    database
) {
    return clone(
        database
    );
}
export function snapshotPromotions(
    database
) {
    return clone(
        database
    );
}
// ============================================================
// DEFAULT EXPORT
// ============================================================
export default {
    PROMOTIONS_VERSION,
    PROMOTION_LEVELS,
    PROMOTION_LEVEL_ORDER,
    PROMOTION_STATUS,
    PROMOTION_TYPES,
    DEFAULT_PROMOTIONS,
    createPromotion,
    createPromotionDatabase,
    levelToType,
    getPromotionLevelIndex,
    comparePromotionLevels,
    defaultRequirements,
    getPromotion,
    getAllPromotions,
    filterPromotions,
    sortPromotions,
    getTopOrganization,
    getPromotionRanking,
    getPromotionRank,
    getPlayerValue,
    getPlayerAge,
    getPlayerOVR,
    getProfessionalFights,
    getProfessionalWins,
    getPlayerFame,
    checkPromotionEligibility,
    calculateOfferPower,
    calculatePromotionFit,
    addPromotion,
    removePromotion,
    updatePromotion,
    addFighterToPromotion,
    removeFighterFromPromotion,
    addEventToPromotion,
    addDivisionToPromotion,
    setPromotionChampion,
    getPromotionChampion,
    updatePromotionFinances,
    calculatePromotionStrength,
    registerPlayerPromotionHistory,
    validatePromotion,
    validatePromotionDatabase,
    clonePromotion,
    clonePromotionDatabase,
    snapshotPromotions
};
