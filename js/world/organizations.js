// ============================================================
// MMA LIFE DYNASTY
// WORLD — ORGANIZATIONS
// Arquivo: js/world/organizations.js
// ============================================================

const ORGANIZATIONS_VERSION = 1;

// ============================================================
// DATABASE
// ============================================================

const ORGANIZATIONS = {

    // ========================================================
    // ELITE
    // ========================================================

    "ufc": {
        id: "ufc",
        name: "UFC",
        shortName: "UFC",
        countryId: "USA",
        cityId: "las-vegas",
        region: "north_america",

        level: 10,
        tier: "elite",

        prestige: 100,
        popularity: 100,
        marketLevel: 100,
        mediaLevel: 100,
        globalReach: 100,

        fighterQuality: 100,
        competitionLevel: 100,

        minimumAge: 18,
        minimumProfessionalFights: 5,

        contractFightRange: [3, 6],

        basePurse: 12000,
        baseWinBonus: 12000,

        titleBonus: 50000,
        mainEventBonus: 25000,

        divisions: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        headquarters: "las-vegas",

        international: true,
        active: true
    },

    // ========================================================
    // INTERNATIONAL
    // ========================================================

    "pfl": {
        id: "pfl",
        name: "Professional Fighters League",
        shortName: "PFL",
        countryId: "USA",
        cityId: "new-york",
        region: "north_america",

        level: 8,
        tier: "international",

        prestige: 88,
        popularity: 82,
        marketLevel: 90,
        mediaLevel: 88,
        globalReach: 88,

        fighterQuality: 88,
        competitionLevel: 88,

        minimumAge: 18,
        minimumProfessionalFights: 3,

        contractFightRange: [3, 5],

        basePurse: 8000,
        baseWinBonus: 8000,

        titleBonus: 30000,
        mainEventBonus: 15000,

        divisions: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        headquarters: "new-york",

        international: true,
        active: true
    },

    "one": {
        id: "one",
        name: "ONE Championship",
        shortName: "ONE",
        countryId: "SGP",
        cityId: "singapore",
        region: "asia",

        level: 8,
        tier: "international",

        prestige: 91,
        popularity: 87,
        marketLevel: 92,
        mediaLevel: 90,
        globalReach: 94,

        fighterQuality: 90,
        competitionLevel: 91,

        minimumAge: 18,
        minimumProfessionalFights: 3,

        contractFightRange: [3, 5],

        basePurse: 7500,
        baseWinBonus: 7500,

        titleBonus: 30000,
        mainEventBonus: 15000,

        divisions: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        headquarters: "singapore",

        international: true,
        active: true
    },

    "bellator": {
        id: "bellator",
        name: "Bellator",
        shortName: "Bellator",
        countryId: "USA",
        cityId: "new-york",
        region: "north_america",

        level: 8,
        tier: "international",

        prestige: 86,
        popularity: 80,
        marketLevel: 86,
        mediaLevel: 84,
        globalReach: 86,

        fighterQuality: 87,
        competitionLevel: 87,

        minimumAge: 18,
        minimumProfessionalFights: 3,

        contractFightRange: [3, 5],

        basePurse: 7000,
        baseWinBonus: 7000,

        titleBonus: 25000,
        mainEventBonus: 12000,

        divisions: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        headquarters: "new-york",

        international: true,
        active: true
    },

    "rizin": {
        id: "rizin",
        name: "RIZIN Fighting Federation",
        shortName: "RIZIN",
        countryId: "JPN",
        cityId: "tokyo",
        region: "asia",

        level: 8,
        tier: "international",

        prestige: 88,
        popularity: 84,
        marketLevel: 82,
        mediaLevel: 86,
        globalReach: 82,

        fighterQuality: 88,
        competitionLevel: 88,

        minimumAge: 18,
        minimumProfessionalFights: 3,

        contractFightRange: [3, 5],

        basePurse: 6500,
        baseWinBonus: 6500,

        titleBonus: 22000,
        mainEventBonus: 12000,

        divisions: [
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        headquarters: "tokyo",

        international: true,
        active: true
    },

    "kof": {
        id: "kof",
        name: "King of Fighters MMA",
        shortName: "KOF",
        countryId: "GEO",
        cityId: "tbilisi",
        region: "europe",

        level: 7,
        tier: "international",

        prestige: 72,
        popularity: 65,
        marketLevel: 68,
        mediaLevel: 65,
        globalReach: 62,

        fighterQuality: 76,
        competitionLevel: 75,

        minimumAge: 18,
        minimumProfessionalFights: 2,

        contractFightRange: [3, 5],

        basePurse: 4500,
        baseWinBonus: 4500,

        titleBonus: 15000,
        mainEventBonus: 7000,

        divisions: [
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        headquarters: "tbilisi",

        international: true,
        active: true
    },

    "brave-cf": {
        id: "brave-cf",
        name: "BRAVE Combat Federation",
        shortName: "BRAVE CF",
        countryId: "BHR",
        cityId: "manama",
        region: "middle_east",

        level: 7,
        tier: "international",

        prestige: 75,
        popularity: 68,
        marketLevel: 75,
        mediaLevel: 70,
        globalReach: 78,

        fighterQuality: 77,
        competitionLevel: 76,

        minimumAge: 18,
        minimumProfessionalFights: 2,

        contractFightRange: [3, 5],

        basePurse: 4000,
        baseWinBonus: 4000,

        titleBonus: 12000,
        mainEventBonus: 6000,

        divisions: [
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        headquarters: "manama",

        international: true,
        active: true
    },

    // ========================================================
    // EUROPA
    // ========================================================

    "cage-warriors": {
        id: "cage-warriors",
        name: "Cage Warriors",
        shortName: "CW",
        countryId: "GBR",
        cityId: "london",
        region: "europe",

        level: 6,
        tier: "international",

        prestige: 70,
        popularity: 62,
        marketLevel: 65,
        mediaLevel: 62,
        globalReach: 68,

        fighterQuality: 72,
        competitionLevel: 72,

        minimumAge: 18,
        minimumProfessionalFights: 2,

        contractFightRange: [3, 5],

        basePurse: 3000,
        baseWinBonus: 3000,

        titleBonus: 10000,
        mainEventBonus: 5000,

        divisions: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        headquarters: "london",

        international: true,
        active: true
    },

    "kings-of-the-cage": {
        id: "kings-of-the-cage",
        name: "Kings of the Cage",
        shortName: "KOTC",
        countryId: "USA",
        cityId: "los-angeles",
        region: "north_america",

        level: 5,
        tier: "national",

        prestige: 55,
        popularity: 48,
        marketLevel: 55,
        mediaLevel: 45,
        globalReach: 45,

        fighterQuality: 60,
        competitionLevel: 61,

        minimumAge: 18,
        minimumProfessionalFights: 0,

        contractFightRange: [3, 5],

        basePurse: 1800,
        baseWinBonus: 1800,

        titleBonus: 6000,
        mainEventBonus: 2500,

        divisions: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        headquarters: "los-angeles",

        international: false,
        active: true
    },

    // ========================================================
    // BRASIL — NACIONAL
    // ========================================================

    "brazil-combat-league": {
        id: "brazil-combat-league",
        name: "Brazil Combat League",
        shortName: "BCL",
        countryId: "BRA",
        cityId: "sao-paulo",
        region: "south_america",

        level: 3,
        tier: "national",

        prestige: 48,
        popularity: 55,
        marketLevel: 48,
        mediaLevel: 45,
        globalReach: 25,

        fighterQuality: 52,
        competitionLevel: 52,

        minimumAge: 18,
        minimumProfessionalFights: 0,

        contractFightRange: [3, 5],

        basePurse: 1000,
        baseWinBonus: 1000,

        titleBonus: 4000,
        mainEventBonus: 1500,

        divisions: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        headquarters: "sao-paulo",

        international: false,
        active: true
    },

    "arena-nacional-mma": {
        id: "arena-nacional-mma",
        name: "Arena Nacional MMA",
        shortName: "ANMMA",
        countryId: "BRA",
        cityId: "rio-de-janeiro",
        region: "south_america",

        level: 3,
        tier: "national",

        prestige: 50,
        popularity: 58,
        marketLevel: 50,
        mediaLevel: 48,
        globalReach: 28,

        fighterQuality: 54,
        competitionLevel: 54,

        minimumAge: 18,
        minimumProfessionalFights: 0,

        contractFightRange: [3, 5],

        basePurse: 1000,
        baseWinBonus: 1000,

        titleBonus: 4500,
        mainEventBonus: 1800,

        divisions: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        headquarters: "rio-de-janeiro",

        international: false,
        active: true
    },

    // ========================================================
    // BRASIL — REGIONAL
    // ========================================================

    "circuito-regional-combate": {
        id: "circuito-regional-combate",
        name: "Circuito Regional de Combate",
        shortName: "CRC",
        countryId: "BRA",
        cityId: "sao-paulo",
        region: "south_america",

        level: 1,
        tier: "regional",

        prestige: 20,
        popularity: 25,
        marketLevel: 20,
        mediaLevel: 15,
        globalReach: 5,

        fighterQuality: 25,
        competitionLevel: 25,

        minimumAge: 18,
        minimumProfessionalFights: 0,

        contractFightRange: [1, 3],

        basePurse: 300,
        baseWinBonus: 300,

        titleBonus: 1000,
        mainEventBonus: 500,

        divisions: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        headquarters: "sao-paulo",

        international: false,
        active: true
    },

    "sul-mma": {
        id: "sul-mma",
        name: "Sul MMA Championship",
        shortName: "SMC",
        countryId: "BRA",
        cityId: "curitiba",
        region: "south_america",

        level: 1,
        tier: "regional",

        prestige: 23,
        popularity: 28,
        marketLevel: 23,
        mediaLevel: 18,
        globalReach: 6,

        fighterQuality: 28,
        competitionLevel: 28,

        minimumAge: 18,
        minimumProfessionalFights: 0,

        contractFightRange: [1, 3],

        basePurse: 350,
        baseWinBonus: 350,

        titleBonus: 1200,
        mainEventBonus: 500,

        divisions: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        headquarters: "curitiba",

        international: false,
        active: true
    },

    // ========================================================
    // MÉXICO
    // ========================================================

    "combate-global": {
        id: "combate-global",
        name: "Combate Global",
        shortName: "CG",
        countryId: "MEX",
        cityId: "mexico-city",
        region: "north_america",

        level: 5,
        tier: "national",

        prestige: 55,
        popularity: 52,
        marketLevel: 58,
        mediaLevel: 52,
        globalReach: 50,

        fighterQuality: 62,
        competitionLevel: 63,

        minimumAge: 18,
        minimumProfessionalFights: 0,

        contractFightRange: [3, 5],

        basePurse: 1500,
        baseWinBonus: 1500,

        titleBonus: 6000,
        mainEventBonus: 2500,

        divisions: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        headquarters: "mexico-city",

        international: true,
        active: true
    },

    // ========================================================
    // ÁSIA
    // ========================================================

    "deep": {
        id: "deep",
        name: "DEEP",
        shortName: "DEEP",
        countryId: "JPN",
        cityId: "tokyo",
        region: "asia",

        level: 6,
        tier: "national",

        prestige: 68,
        popularity: 58,
        marketLevel: 62,
        mediaLevel: 60,
        globalReach: 55,

        fighterQuality: 70,
        competitionLevel: 70,

        minimumAge: 18,
        minimumProfessionalFights: 0,

        contractFightRange: [3, 5],

        basePurse: 2500,
        baseWinBonus: 2500,

        titleBonus: 8000,
        mainEventBonus: 4000,

        divisions: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        headquarters: "tokyo",

        international: true,
        active: true
    },

    // ========================================================
    // AMÉRICA DO SUL
    // ========================================================

    "warrior-challenge": {
        id: "warrior-challenge",
        name: "Warrior Challenge",
        shortName: "WC",
        countryId: "USA",
        cityId: "miami",
        region: "north_america",

        level: 3,
        tier: "national",

        prestige: 42,
        popularity: 45,
        marketLevel: 45,
        mediaLevel: 40,
        globalReach: 25,

        fighterQuality: 48,
        competitionLevel: 49,

        minimumAge: 18,
        minimumProfessionalFights: 0,

        contractFightRange: [3, 5],

        basePurse: 1000,
        baseWinBonus: 1000,

        titleBonus: 4000,
        mainEventBonus: 1500,

        divisions: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        headquarters: "miami",

        international: false,
        active: true
    },

    "titan-fight-championship": {
        id: "titan-fight-championship",
        name: "Titan Fight Championship",
        shortName: "TFC",
        countryId: "MEX",
        cityId: "mexico-city",
        region: "north_america",

        level: 4,
        tier: "national",

        prestige: 50,
        popularity: 48,
        marketLevel: 52,
        mediaLevel: 45,
        globalReach: 30,

        fighterQuality: 55,
        competitionLevel: 55,

        minimumAge: 18,
        minimumProfessionalFights: 0,

        contractFightRange: [3, 5],

        basePurse: 1200,
        baseWinBonus: 1200,

        titleBonus: 5000,
        mainEventBonus: 2000,

        divisions: [
            "flyweight",
            "bantamweight",
            "featherweight",
            "lightweight",
            "welterweight",
            "middleweight",
            "light_heavyweight",
            "heavyweight"
        ],

        headquarters: "mexico-city",

        international: false,
        active: true
    }
};

// ============================================================
// HELPERS
// ============================================================

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function normalizeOrganizationId(id) {
    if (!id) return null;

    return String(id)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
}

function normalizeTier(tier) {
    if (!tier) return "";

    return String(tier)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");
}

// ============================================================
// GET
// ============================================================

function getOrganization(id) {
    const organizationId =
        normalizeOrganizationId(id);

    if (
        !organizationId ||
        !ORGANIZATIONS[organizationId]
    ) {
        return null;
    }

    return clone(
        ORGANIZATIONS[organizationId]
    );
}

function getAllOrganizations() {
    return Object.values(ORGANIZATIONS)
        .map(clone);
}

function getActiveOrganizations() {
    return getAllOrganizations()
        .filter(org => org.active !== false);
}

function getOrganizationsByCountry(countryId) {
    if (!countryId) return [];

    const id = String(countryId).toUpperCase();

    return getActiveOrganizations()
        .filter(org =>
            String(org.countryId).toUpperCase() === id
        );
}

function getOrganizationsByCity(cityId) {
    if (!cityId) return [];

    const id = normalizeOrganizationId(cityId);

    return getActiveOrganizations()
        .filter(org =>
            normalizeOrganizationId(org.cityId) === id
        );
}

function getOrganizationsByTier(tier) {
    const normalized = normalizeTier(tier);

    if (!normalized) return [];

    return getActiveOrganizations()
        .filter(org =>
            normalizeTier(org.tier) === normalized
        );
}

function getOrganizationsByLevel(minLevel = 1) {
    const level = Number(minLevel) || 1;

    return getActiveOrganizations()
        .filter(org => org.level >= level)
        .sort((a, b) => b.level - a.level);
}

function getOrganizationsByDivision(division) {
    if (!division) return [];

    const normalized = String(division)
        .trim()
        .toLowerCase();

    return getActiveOrganizations()
        .filter(org =>
            Array.isArray(org.divisions) &&
            org.divisions.includes(normalized)
        );
}

function searchOrganizations(query) {
    if (!query) return [];

    const search = String(query)
        .trim()
        .toLowerCase();

    return getActiveOrganizations()
        .filter(org => {
            return (
                org.name.toLowerCase().includes(search) ||
                org.shortName.toLowerCase().includes(search) ||
                org.id.toLowerCase().includes(search) ||
                org.countryId.toLowerCase().includes(search) ||
                org.cityId.toLowerCase().includes(search)
            );
        });
}

// ============================================================
// RANDOM
// ============================================================

function randomOrganization() {
    const organizations =
        getActiveOrganizations();

    if (!organizations.length) return null;

    return clone(
        organizations[
            Math.floor(
                Math.random() * organizations.length
            )
        ]
    );
}

function randomOrganizationByTier(tier) {
    const organizations =
        getOrganizationsByTier(tier);

    if (!organizations.length) return null;

    return clone(
        organizations[
            Math.floor(
                Math.random() * organizations.length
            )
        ]
    );
}

function randomOrganizationByCountry(countryId) {
    const organizations =
        getOrganizationsByCountry(countryId);

    if (!organizations.length) return null;

    return clone(
        organizations[
            Math.floor(
                Math.random() * organizations.length
            )
        ]
    );
}

// ============================================================
// RANKINGS
// ============================================================

function calculateOrganizationScore(org) {
    if (!org) return 0;

    const prestige =
        Number(org.prestige) || 0;

    const popularity =
        Number(org.popularity) || 0;

    const market =
        Number(org.marketLevel) || 0;

    const media =
        Number(org.mediaLevel) || 0;

    const reach =
        Number(org.globalReach) || 0;

    const quality =
        Number(org.fighterQuality) || 0;

    const competition =
        Number(org.competitionLevel) || 0;

    return (
        prestige * 0.20 +
        popularity * 0.10 +
        market * 0.15 +
        media * 0.10 +
        reach * 0.10 +
        quality * 0.20 +
        competition * 0.15
    );
}

function getTopOrganizations(limit = 10) {
    const amount =
        Math.max(1, Number(limit) || 10);

    return getActiveOrganizations()
        .sort(
            (a, b) =>
                calculateOrganizationScore(b) -
                calculateOrganizationScore(a)
        )
        .slice(0, amount);
}

function getTopOrganizationsByPrestige(limit = 10) {
    const amount =
        Math.max(1, Number(limit) || 10);

    return getActiveOrganizations()
        .sort(
            (a, b) => b.prestige - a.prestige
        )
        .slice(0, amount);
}

function getTopOrganizationsByMarket(limit = 10) {
    const amount =
        Math.max(1, Number(limit) || 10);

    return getActiveOrganizations()
        .sort(
            (a, b) =>
                b.marketLevel - a.marketLevel
        )
        .slice(0, amount);
}

function getTopOrganizationsByCompetition(limit = 10) {
    const amount =
        Math.max(1, Number(limit) || 10);

    return getActiveOrganizations()
        .sort(
            (a, b) =>
                b.competitionLevel -
                a.competitionLevel
        )
        .slice(0, amount);
}

// ============================================================
// CAREER REQUIREMENTS
// ============================================================

function getMinimumAge(organizationOrId) {
    const org =
        typeof organizationOrId === "string"
            ? getOrganization(organizationOrId)
            : organizationOrId;

    if (!org) return 18;

    return Number(org.minimumAge) || 18;
}

function getMinimumProfessionalFights(
    organizationOrId
) {
    const org =
        typeof organizationOrId === "string"
            ? getOrganization(organizationOrId)
            : organizationOrId;

    if (!org) return 0;

    return Number(
        org.minimumProfessionalFights
    ) || 0;
}

function meetsAgeRequirement(
    organizationOrId,
    age
) {
    return (
        Number(age) >=
        getMinimumAge(organizationOrId)
    );
}

function meetsFightRequirement(
    organizationOrId,
    professionalFights
) {
    return (
        Number(professionalFights) >=
        getMinimumProfessionalFights(
            organizationOrId
        )
    );
}

function canAcceptFighter(
    organizationOrId,
    fighter = {}
) {
    const org =
        typeof organizationOrId === "string"
            ? getOrganization(organizationOrId)
            : organizationOrId;

    if (!org || !fighter) {
        return false;
    }

    const age =
        Number(fighter.age) || 0;

    const professionalFights =
        Number(
            fighter.professionalFights ??
            fighter.record?.professionalFights ??
            0
        );

    return (
        meetsAgeRequirement(org, age) &&
        meetsFightRequirement(
            org,
            professionalFights
        )
    );
}

// ============================================================
// CONTRACTS
// ============================================================

function getContractFightRange(
    organizationOrId
) {
    const org =
        typeof organizationOrId === "string"
            ? getOrganization(organizationOrId)
            : organizationOrId;

    if (
        !org ||
        !Array.isArray(org.contractFightRange)
    ) {
        return [3, 3];
    }

    return [...org.contractFightRange];
}

function getMinimumContractFights(
    organizationOrId
) {
    return getContractFightRange(
        organizationOrId
    )[0];
}

function getMaximumContractFights(
    organizationOrId
) {
    return getContractFightRange(
        organizationOrId
    )[1];
}

function randomContractFightCount(
    organizationOrId
) {
    const [min, max] =
        getContractFightRange(
            organizationOrId
        );

    return (
        min +
        Math.floor(
            Math.random() *
            (max - min + 1)
        )
    );
}

// ============================================================
// MONEY
// ============================================================

function getBasePurse(organizationOrId) {
    const org =
        typeof organizationOrId === "string"
            ? getOrganization(organizationOrId)
            : organizationOrId;

    if (!org) return 0;

    return Number(org.basePurse) || 0;
}

function getBaseWinBonus(organizationOrId) {
    const org =
        typeof organizationOrId === "string"
            ? getOrganization(organizationOrId)
            : organizationOrId;

    if (!org) return 0;

    return Number(org.baseWinBonus) || 0;
}

function getTitleBonus(organizationOrId) {
    const org =
        typeof organizationOrId === "string"
            ? getOrganization(organizationOrId)
            : organizationOrId;

    if (!org) return 0;

    return Number(org.titleBonus) || 0;
}

function getMainEventBonus(organizationOrId) {
    const org =
        typeof organizationOrId === "string"
            ? getOrganization(organizationOrId)
            : organizationOrId;

    if (!org) return 0;

    return Number(org.mainEventBonus) || 0;
}

// ============================================================
// DIVISIONS
// ============================================================

function supportsDivision(
    organizationOrId,
    division
) {
    const org =
        typeof organizationOrId === "string"
            ? getOrganization(organizationOrId)
            : organizationOrId;

    if (!org || !division) return false;

    const normalized =
        String(division)
            .trim()
            .toLowerCase();

    return (
        Array.isArray(org.divisions) &&
        org.divisions.includes(normalized)
    );
}

function getOrganizationDivisions(
    organizationOrId
) {
    const org =
        typeof organizationOrId === "string"
            ? getOrganization(organizationOrId)
            : organizationOrId;

    if (!org || !Array.isArray(org.divisions)) {
        return [];
    }

    return [...org.divisions];
}

// ============================================================
// CAREER VALUE
// ============================================================

function calculateCareerValue(
    organizationOrId
) {
    const org =
        typeof organizationOrId === "string"
            ? getOrganization(organizationOrId)
            : organizationOrId;

    if (!org) return 0;

    return Math.round(
        calculateOrganizationScore(org)
    );
}

function getCareerPathOrganizations() {
    return getActiveOrganizations()
        .sort((a, b) => {
            if (a.level !== b.level) {
                return a.level - b.level;
            }

            return (
                calculateOrganizationScore(a) -
                calculateOrganizationScore(b)
            );
        });
}

// ============================================================
// TIER HELPERS
// ============================================================

function isRegionalOrganization(
    organizationOrId
) {
    const org =
        typeof organizationOrId === "string"
            ? getOrganization(organizationOrId)
            : organizationOrId;

    return (
        org &&
        normalizeTier(org.tier) === "regional"
    );
}

function isNationalOrganization(
    organizationOrId
) {
    const org =
        typeof organizationOrId === "string"
            ? getOrganization(organizationOrId)
            : organizationOrId;

    return (
        org &&
        normalizeTier(org.tier) === "national"
    );
}

function isInternationalOrganization(
    organizationOrId
) {
    const org =
        typeof organizationOrId === "string"
            ? getOrganization(organizationOrId)
            : organizationOrId;

    return (
        org &&
        normalizeTier(org.tier) === "international"
    );
}

function isEliteOrganization(
    organizationOrId
) {
    const org =
        typeof organizationOrId === "string"
            ? getOrganization(organizationOrId)
            : organizationOrId;

    return (
        org &&
        normalizeTier(org.tier) === "elite"
    );
}

// ============================================================
// WORLD STATE
// ============================================================

function ensureOrganizationsState(database) {
    if (!database || typeof database !== "object") {
        return null;
    }

    if (!database.world) {
        database.world = {};
    }

    if (!database.world.organizations) {
        database.world.organizations = {};
    }

    return database.world.organizations;
}

function initializeOrganizations(database) {
    const organizationsState =
        ensureOrganizationsState(database);

    if (!organizationsState) {
        return null;
    }

    Object.keys(ORGANIZATIONS)
        .forEach(id => {
            if (!organizationsState[id]) {
                organizationsState[id] =
                    clone(ORGANIZATIONS[id]);
            }
        });

    return organizationsState;
}

function resetOrganizations(database) {
    const organizationsState =
        ensureOrganizationsState(database);

    if (!organizationsState) {
        return null;
    }

    Object.keys(organizationsState)
        .forEach(id => {
            delete organizationsState[id];
        });

    Object.keys(ORGANIZATIONS)
        .forEach(id => {
            organizationsState[id] =
                clone(ORGANIZATIONS[id]);
        });

    return organizationsState;
}

// ============================================================
// CUSTOM ORGANIZATION
// ============================================================

function createOrganization(data = {}) {
    const id =
        normalizeOrganizationId(
            data.id ||
            data.name ||
            `organization-${Date.now()}`
        );

    return {
        id,

        name:
            data.name ||
            "Nova Organização",

        shortName:
            data.shortName ||
            "NOVA",

        countryId:
            data.countryId ||
            "BRA",

        cityId:
            data.cityId ||
            null,

        region:
            data.region ||
            "south_america",

        level:
            Number(data.level) || 1,

        tier:
            data.tier ||
            "regional",

        prestige:
            Number(data.prestige) || 1,

        popularity:
            Number(data.popularity) || 1,

        marketLevel:
            Number(data.marketLevel) || 1,

        mediaLevel:
            Number(data.mediaLevel) || 1,

        globalReach:
            Number(data.globalReach) || 1,

        fighterQuality:
            Number(data.fighterQuality) || 1,

        competitionLevel:
            Number(data.competitionLevel) || 1,

        minimumAge:
            Number(data.minimumAge) || 18,

        minimumProfessionalFights:
            Number(
                data.minimumProfessionalFights
            ) || 0,

        contractFightRange:
            Array.isArray(
                data.contractFightRange
            )
                ? [...data.contractFightRange]
                : [3, 3],

        basePurse:
            Number(data.basePurse) || 0,

        baseWinBonus:
            Number(data.baseWinBonus) || 0,

        titleBonus:
            Number(data.titleBonus) || 0,

        mainEventBonus:
            Number(data.mainEventBonus) || 0,

        divisions:
            Array.isArray(data.divisions)
                ? [...data.divisions]
                : [],

        headquarters:
            data.headquarters ||
            data.cityId ||
            null,

        international:
            data.international === true,

        active:
            data.active !== false
    };
}

// ============================================================
// VALIDATION
// ============================================================

function validateOrganization(org) {
    const errors = [];

    if (!org || typeof org !== "object") {
        return {
            valid: false,
            errors: [
                "Organização inválida."
            ]
        };
    }

    if (!org.id) {
        errors.push(
            "Organização precisa de um id."
        );
    }

    if (!org.name) {
        errors.push(
            "Organização precisa de um nome."
        );
    }

    if (!org.countryId) {
        errors.push(
            "Organização precisa de um país."
        );
    }

    if (!org.tier) {
        errors.push(
            "Organização precisa de um tier."
        );
    }

    if (!Array.isArray(org.divisions)) {
        errors.push(
            "Divisões precisam ser um array."
        );
    }

    if (
        !Array.isArray(
            org.contractFightRange
        ) ||
        org.contractFightRange.length !== 2
    ) {
        errors.push(
            "contractFightRange precisa conter mínimo e máximo."
        );
    }

    const numericFields = [
        "level",
        "prestige",
        "popularity",
        "marketLevel",
        "mediaLevel",
        "globalReach",
        "fighterQuality",
        "competitionLevel",
        "minimumAge",
        "minimumProfessionalFights",
        "basePurse",
        "baseWinBonus",
        "titleBonus",
        "mainEventBonus"
    ];

    numericFields.forEach(field => {
        if (
            org[field] === undefined ||
            org[field] === null ||
            Number.isNaN(
                Number(org[field])
            )
        ) {
            errors.push(
                `${field} inválido.`
            );
        }
    });

    return {
        valid: errors.length === 0,
        errors
    };
}

function validateOrganizations(
    database = ORGANIZATIONS
) {
    const errors = [];

    Object.values(database)
        .forEach(org => {
            const result =
                validateOrganization(org);

            if (!result.valid) {
                errors.push({
                    id:
                        org?.id ||
                        "unknown",

                    errors:
                        result.errors
                });
            }
        });

    return {
        valid: errors.length === 0,
        errors
    };
}

// ============================================================
// SNAPSHOT
// ============================================================

function getOrganizationsSnapshot() {
    return {
        version:
            ORGANIZATIONS_VERSION,

        count:
            Object.keys(
                ORGANIZATIONS
            ).length,

        activeCount:
            getActiveOrganizations()
                .length,

        regionalCount:
            getOrganizationsByTier(
                "regional"
            ).length,

        nationalCount:
            getOrganizationsByTier(
                "national"
            ).length,

        internationalCount:
            getOrganizationsByTier(
                "international"
            ).length,

        eliteCount:
            getOrganizationsByTier(
                "elite"
            ).length,

        organizations:
            getAllOrganizations()
    };
}

// ============================================================
// API
// ============================================================

const organizationsAPI = {

    ORGANIZATIONS_VERSION,
    ORGANIZATIONS,

    getOrganization,
    getAllOrganizations,
    getActiveOrganizations,

    getOrganizationsByCountry,
    getOrganizationsByCity,
    getOrganizationsByTier,
    getOrganizationsByLevel,
    getOrganizationsByDivision,

    searchOrganizations,

    randomOrganization,
    randomOrganizationByTier,
    randomOrganizationByCountry,

    calculateOrganizationScore,

    getTopOrganizations,
    getTopOrganizationsByPrestige,
    getTopOrganizationsByMarket,
    getTopOrganizationsByCompetition,

    getMinimumAge,
    getMinimumProfessionalFights,

    meetsAgeRequirement,
    meetsFightRequirement,
    canAcceptFighter,

    getContractFightRange,
    getMinimumContractFights,
    getMaximumContractFights,
    randomContractFightCount,

    getBasePurse,
    getBaseWinBonus,
    getTitleBonus,
    getMainEventBonus,

    supportsDivision,
    getOrganizationDivisions,

    calculateCareerValue,
    getCareerPathOrganizations,

    isRegionalOrganization,
    isNationalOrganization,
    isInternationalOrganization,
    isEliteOrganization,

    ensureOrganizationsState,
    initializeOrganizations,
    resetOrganizations,

    createOrganization,

    validateOrganization,
    validateOrganizations,

    getOrganizationsSnapshot
};

// ============================================================
// EXPORTS
// ============================================================

export {
    ORGANIZATIONS_VERSION,
    ORGANIZATIONS,

    getOrganization,
    getAllOrganizations,
    getActiveOrganizations,

    getOrganizationsByCountry,
    getOrganizationsByCity,
    getOrganizationsByTier,
    getOrganizationsByLevel,
    getOrganizationsByDivision,

    searchOrganizations,

    randomOrganization,
    randomOrganizationByTier,
    randomOrganizationByCountry,

    calculateOrganizationScore,

    getTopOrganizations,
    getTopOrganizationsByPrestige,
    getTopOrganizationsByMarket,
    getTopOrganizationsByCompetition,

    getMinimumAge,
    getMinimumProfessionalFights,

    meetsAgeRequirement,
    meetsFightRequirement,
    canAcceptFighter,

    getContractFightRange,
    getMinimumContractFights,
    getMaximumContractFights,
    randomContractFightCount,

    getBasePurse,
    getBaseWinBonus,
    getTitleBonus,
    getMainEventBonus,

    supportsDivision,
    getOrganizationDivisions,

    calculateCareerValue,
    getCareerPathOrganizations,

    isRegionalOrganization,
    isNationalOrganization,
    isInternationalOrganization,
    isEliteOrganization,

    ensureOrganizationsState,
    initializeOrganizations,
    resetOrganizations,

    createOrganization,

    validateOrganization,
    validateOrganizations,

    getOrganizationsSnapshot
};

export default organizationsAPI;
