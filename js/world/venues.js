// ============================================================
// MMA LIFE DYNASTY
// WORLD — VENUES
// Arquivo: js/world/venues.js
// ============================================================

const VENUES_VERSION = 1;

// ============================================================
// DATABASE
// ============================================================

const VENUES = {

    // ========================================================
    // BRASIL
    // ========================================================

    "ginasio-ibirapuera": {
        id: "ginasio-ibirapuera",
        name: "Ginásio do Ibirapuera",
        countryId: "BRA",
        cityId: "sao-paulo",
        type: "arena",
        level: 8,
        prestige: 9,
        capacity: 11000,
        cost: 120000,
        ticketValue: 45,
        facilities: 8,
        productionLevel: 8,
        mediaLevel: 8,
        internationalAccess: 8,
        fightAtmosphere: 9,
        suitableFor: [
            "regional",
            "national",
            "international"
        ],
        active: true
    },

    "maracanazinho": {
        id: "maracanazinho",
        name: "Maracanãzinho",
        countryId: "BRA",
        cityId: "rio-de-janeiro",
        type: "arena",
        level: 9,
        prestige: 10,
        capacity: 11800,
        cost: 150000,
        ticketValue: 50,
        facilities: 9,
        productionLevel: 9,
        mediaLevel: 10,
        internationalAccess: 9,
        fightAtmosphere: 10,
        suitableFor: [
            "national",
            "international",
            "elite"
        ],
        active: true
    },

    "arena-carioca": {
        id: "arena-carioca",
        name: "Arena Carioca",
        countryId: "BRA",
        cityId: "rio-de-janeiro",
        type: "arena",
        level: 10,
        prestige: 10,
        capacity: 14000,
        cost: 180000,
        ticketValue: 60,
        facilities: 10,
        productionLevel: 10,
        mediaLevel: 10,
        internationalAccess: 10,
        fightAtmosphere: 9,
        suitableFor: [
            "national",
            "international",
            "elite"
        ],
        active: true
    },

    "mineirinho": {
        id: "mineirinho",
        name: "Mineirinho",
        countryId: "BRA",
        cityId: "belo-horizonte",
        type: "arena",
        level: 8,
        prestige: 8,
        capacity: 25000,
        cost: 160000,
        ticketValue: 40,
        facilities: 7,
        productionLevel: 8,
        mediaLevel: 8,
        internationalAccess: 7,
        fightAtmosphere: 9,
        suitableFor: [
            "regional",
            "national",
            "international"
        ],
        active: true
    },

    "arena-curitiba": {
        id: "arena-curitiba",
        name: "Curitiba Fight Arena",
        countryId: "BRA",
        cityId: "curitiba",
        type: "arena",
        level: 7,
        prestige: 7,
        capacity: 8500,
        cost: 90000,
        ticketValue: 35,
        facilities: 7,
        productionLevel: 7,
        mediaLevel: 7,
        internationalAccess: 6,
        fightAtmosphere: 8,
        suitableFor: [
            "regional",
            "national",
            "international"
        ],
        active: true
    },

    "arena-amapa": {
        id: "arena-amapa",
        name: "Amapá Combat Arena",
        countryId: "BRA",
        cityId: "macapa",
        type: "arena",
        level: 4,
        prestige: 4,
        capacity: 3500,
        cost: 25000,
        ticketValue: 20,
        facilities: 4,
        productionLevel: 4,
        mediaLevel: 3,
        internationalAccess: 3,
        fightAtmosphere: 8,
        suitableFor: [
            "regional",
            "national"
        ],
        active: true
    },

    // ========================================================
    // ESTADOS UNIDOS
    // ========================================================

    "t-mobile-arena": {
        id: "t-mobile-arena",
        name: "T-Mobile Arena",
        countryId: "USA",
        cityId: "las-vegas",
        type: "arena",
        level: 10,
        prestige: 10,
        capacity: 19500,
        cost: 500000,
        ticketValue: 120,
        facilities: 10,
        productionLevel: 10,
        mediaLevel: 10,
        internationalAccess: 10,
        fightAtmosphere: 10,
        suitableFor: [
            "international",
            "elite"
        ],
        active: true
    },

    "madison-square-garden": {
        id: "madison-square-garden",
        name: "Madison Square Garden",
        countryId: "USA",
        cityId: "new-york",
        type: "arena",
        level: 10,
        prestige: 10,
        capacity: 20789,
        cost: 600000,
        ticketValue: 150,
        facilities: 10,
        productionLevel: 10,
        mediaLevel: 10,
        internationalAccess: 10,
        fightAtmosphere: 10,
        suitableFor: [
            "international",
            "elite"
        ],
        active: true
    },

    "kaseya-center": {
        id: "kaseya-center",
        name: "Miami Fight Arena",
        countryId: "USA",
        cityId: "miami",
        type: "arena",
        level: 9,
        prestige: 9,
        capacity: 19600,
        cost: 450000,
        ticketValue: 110,
        facilities: 10,
        productionLevel: 9,
        mediaLevel: 9,
        internationalAccess: 10,
        fightAtmosphere: 9,
        suitableFor: [
            "international",
            "elite"
        ],
        active: true
    },

    // ========================================================
    // CANADÁ
    // ========================================================

    "bell-centre": {
        id: "bell-centre",
        name: "Bell Centre",
        countryId: "CAN",
        cityId: "montreal",
        type: "arena",
        level: 10,
        prestige: 10,
        capacity: 21000,
        cost: 500000,
        ticketValue: 100,
        facilities: 10,
        productionLevel: 10,
        mediaLevel: 10,
        internationalAccess: 10,
        fightAtmosphere: 9,
        suitableFor: [
            "international",
            "elite"
        ],
        active: true
    },

    // ========================================================
    // MÉXICO
    // ========================================================

    "arena-mexico": {
        id: "arena-mexico",
        name: "Arena México",
        countryId: "MEX",
        cityId: "mexico-city",
        type: "arena",
        level: 9,
        prestige: 10,
        capacity: 16600,
        cost: 220000,
        ticketValue: 55,
        facilities: 8,
        productionLevel: 8,
        mediaLevel: 9,
        internationalAccess: 8,
        fightAtmosphere: 10,
        suitableFor: [
            "national",
            "international",
            "elite"
        ],
        active: true
    },

    // ========================================================
    // EUROPA
    // ========================================================

    "o2-arena-london": {
        id: "o2-arena-london",
        name: "O2 Arena",
        countryId: "GBR",
        cityId: "london",
        type: "arena",
        level: 10,
        prestige: 10,
        capacity: 20000,
        cost: 550000,
        ticketValue: 110,
        facilities: 10,
        productionLevel: 10,
        mediaLevel: 10,
        internationalAccess: 10,
        fightAtmosphere: 9,
        suitableFor: [
            "international",
            "elite"
        ],
        active: true
    },

    "accor-arena": {
        id: "accor-arena",
        name: "Paris Fight Arena",
        countryId: "FRA",
        cityId: "paris",
        type: "arena",
        level: 9,
        prestige: 9,
        capacity: 15000,
        cost: 400000,
        ticketValue: 95,
        facilities: 10,
        productionLevel: 9,
        mediaLevel: 9,
        internationalAccess: 10,
        fightAtmosphere: 9,
        suitableFor: [
            "international",
            "elite"
        ],
        active: true
    },

    "berlin-combat-hall": {
        id: "berlin-combat-hall",
        name: "Berlin Combat Hall",
        countryId: "DEU",
        cityId: "berlin",
        type: "arena",
        level: 8,
        prestige: 8,
        capacity: 12000,
        cost: 300000,
        ticketValue: 75,
        facilities: 9,
        productionLevel: 8,
        mediaLevel: 8,
        internationalAccess: 9,
        fightAtmosphere: 8,
        suitableFor: [
            "national",
            "international"
        ],
        active: true
    },

    // ========================================================
    // RÚSSIA / LESTE EUROPEU
    // ========================================================

    "moscow-combat-arena": {
        id: "moscow-combat-arena",
        name: "Moscow Combat Arena",
        countryId: "RUS",
        cityId: "moscow",
        type: "arena",
        level: 9,
        prestige: 9,
        capacity: 15000,
        cost: 280000,
        ticketValue: 60,
        facilities: 8,
        productionLevel: 9,
        mediaLevel: 9,
        internationalAccess: 8,
        fightAtmosphere: 10,
        suitableFor: [
            "national",
            "international"
        ],
        active: true
    },

    // ========================================================
    // ORIENTE MÉDIO
    // ========================================================

    "etihad-arena": {
        id: "etihad-arena",
        name: "Etihad Arena",
        countryId: "ARE",
        cityId: "abu-dhabi",
        type: "arena",
        level: 10,
        prestige: 10,
        capacity: 18000,
        cost: 500000,
        ticketValue: 130,
        facilities: 10,
        productionLevel: 10,
        mediaLevel: 10,
        internationalAccess: 10,
        fightAtmosphere: 10,
        suitableFor: [
            "international",
            "elite"
        ],
        active: true
    },

    // ========================================================
    // ÁSIA
    // ========================================================

    "saitama-super-arena": {
        id: "saitama-super-arena",
        name: "Saitama Super Arena",
        countryId: "JPN",
        cityId: "tokyo",
        type: "arena",
        level: 10,
        prestige: 10,
        capacity: 37000,
        cost: 650000,
        ticketValue: 100,
        facilities: 10,
        productionLevel: 10,
        mediaLevel: 10,
        internationalAccess: 10,
        fightAtmosphere: 10,
        suitableFor: [
            "international",
            "elite"
        ],
        active: true
    },

    "impact-arena-bangkok": {
        id: "impact-arena-bangkok",
        name: "Bangkok Combat Arena",
        countryId: "THA",
        cityId: "bangkok",
        type: "arena",
        level: 8,
        prestige: 8,
        capacity: 12000,
        cost: 180000,
        ticketValue: 45,
        facilities: 8,
        productionLevel: 8,
        mediaLevel: 8,
        internationalAccess: 8,
        fightAtmosphere: 10,
        suitableFor: [
            "national",
            "international"
        ],
        active: true
    },

    // ========================================================
    // AUSTRÁLIA
    // ========================================================

    "qudos-bank-arena": {
        id: "qudos-bank-arena",
        name: "Qudos Bank Arena",
        countryId: "AUS",
        cityId: "sydney",
        type: "arena",
        level: 10,
        prestige: 9,
        capacity: 21000,
        cost: 450000,
        ticketValue: 100,
        facilities: 10,
        productionLevel: 10,
        mediaLevel: 9,
        internationalAccess: 10,
        fightAtmosphere: 9,
        suitableFor: [
            "international",
            "elite"
        ],
        active: true
    }
};

// ============================================================
// HELPERS
// ============================================================

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function normalizeVenueId(id) {
    if (!id) return null;

    return String(id)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
}

function normalizeType(type) {
    if (!type) return "";

    return String(type)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");
}

// ============================================================
// GET
// ============================================================

function getVenue(id) {
    const venueId = normalizeVenueId(id);

    if (!venueId || !VENUES[venueId]) {
        return null;
    }

    return clone(VENUES[venueId]);
}

function getAllVenues() {
    return Object.values(VENUES).map(clone);
}

function getActiveVenues() {
    return getAllVenues().filter(
        venue => venue.active !== false
    );
}

function getVenuesByCountry(countryId) {
    if (!countryId) return [];

    const id = String(countryId).toUpperCase();

    return getActiveVenues().filter(
        venue => String(venue.countryId).toUpperCase() === id
    );
}

function getVenuesByCity(cityId) {
    if (!cityId) return [];

    const id = normalizeVenueId(cityId);

    return getActiveVenues().filter(
        venue => normalizeVenueId(venue.cityId) === id
    );
}

function getVenuesByType(type) {
    const normalized = normalizeType(type);

    if (!normalized) return [];

    return getActiveVenues().filter(
        venue => normalizeType(venue.type) === normalized
    );
}

function getVenuesByLevel(minLevel = 1) {
    const level = Number(minLevel) || 1;

    return getActiveVenues()
        .filter(venue => venue.level >= level)
        .sort((a, b) => b.level - a.level);
}

function searchVenues(query) {
    if (!query) return [];

    const search = String(query)
        .trim()
        .toLowerCase();

    return getActiveVenues().filter(venue => {
        return (
            venue.name.toLowerCase().includes(search) ||
            venue.id.toLowerCase().includes(search) ||
            venue.countryId.toLowerCase().includes(search) ||
            venue.cityId.toLowerCase().includes(search) ||
            venue.type.toLowerCase().includes(search)
        );
    });
}

// ============================================================
// RANDOM
// ============================================================

function randomVenue() {
    const venues = getActiveVenues();

    if (!venues.length) return null;

    return clone(
        venues[Math.floor(Math.random() * venues.length)]
    );
}

function randomVenueByCountry(countryId) {
    const venues = getVenuesByCountry(countryId);

    if (!venues.length) return null;

    return clone(
        venues[Math.floor(Math.random() * venues.length)]
    );
}

function randomVenueByCity(cityId) {
    const venues = getVenuesByCity(cityId);

    if (!venues.length) return null;

    return clone(
        venues[Math.floor(Math.random() * venues.length)]
    );
}

// ============================================================
// RANKING
// ============================================================

function calculateVenueScore(venue) {
    if (!venue) return 0;

    const level = Number(venue.level) || 0;
    const prestige = Number(venue.prestige) || 0;
    const facilities = Number(venue.facilities) || 0;
    const production = Number(venue.productionLevel) || 0;
    const media = Number(venue.mediaLevel) || 0;
    const access = Number(venue.internationalAccess) || 0;
    const atmosphere = Number(venue.fightAtmosphere) || 0;

    return (
        level * 0.20 +
        prestige * 0.20 +
        facilities * 0.15 +
        production * 0.15 +
        media * 0.10 +
        access * 0.10 +
        atmosphere * 0.10
    );
}

function getTopVenues(limit = 10) {
    const amount = Math.max(1, Number(limit) || 10);

    return getActiveVenues()
        .sort(
            (a, b) =>
                calculateVenueScore(b) -
                calculateVenueScore(a)
        )
        .slice(0, amount);
}

function getTopVenuesByCapacity(limit = 10) {
    const amount = Math.max(1, Number(limit) || 10);

    return getActiveVenues()
        .sort((a, b) => b.capacity - a.capacity)
        .slice(0, amount);
}

function getTopVenuesByPrestige(limit = 10) {
    const amount = Math.max(1, Number(limit) || 10);

    return getActiveVenues()
        .sort((a, b) => b.prestige - a.prestige)
        .slice(0, amount);
}

// ============================================================
// EVENT COMPATIBILITY
// ============================================================

function canHostEvent(venueOrId, eventLevel) {
    const venue = typeof venueOrId === "string"
        ? getVenue(venueOrId)
        : venueOrId;

    if (!venue || !eventLevel) {
        return false;
    }

    const level = normalizeType(eventLevel);

    if (!Array.isArray(venue.suitableFor)) {
        return false;
    }

    return venue.suitableFor.includes(level);
}

function getSuitableVenues(eventLevel) {
    const level = normalizeType(eventLevel);

    if (!level) return [];

    return getActiveVenues()
        .filter(venue => canHostEvent(venue, level))
        .sort(
            (a, b) =>
                calculateVenueScore(b) -
                calculateVenueScore(a)
        );
}

// ============================================================
// ATTENDANCE
// ============================================================

function getVenueCapacity(venueOrId) {
    const venue = typeof venueOrId === "string"
        ? getVenue(venueOrId)
        : venueOrId;

    if (!venue) return 0;

    return Number(venue.capacity) || 0;
}

function calculateExpectedAttendance(
    venueOrId,
    eventPopularity = 50
) {
    const venue = typeof venueOrId === "string"
        ? getVenue(venueOrId)
        : venueOrId;

    if (!venue) return 0;

    const capacity = getVenueCapacity(venue);

    const popularity = Math.max(
        0,
        Math.min(100, Number(eventPopularity) || 0)
    );

    const baseRate =
        0.20 + popularity * 0.0075;

    return Math.min(
        capacity,
        Math.max(
            0,
            Math.round(capacity * baseRate)
        )
    );
}

function calculateAttendanceRate(
    venueOrId,
    eventPopularity = 50
) {
    const capacity = getVenueCapacity(venueOrId);

    if (!capacity) return 0;

    const attendance =
        calculateExpectedAttendance(
            venueOrId,
            eventPopularity
        );

    return Number(
        ((attendance / capacity) * 100).toFixed(2)
    );
}

// ============================================================
// TICKETS / REVENUE
// ============================================================

function getTicketValue(venueOrId) {
    const venue = typeof venueOrId === "string"
        ? getVenue(venueOrId)
        : venueOrId;

    if (!venue) return 0;

    return Number(venue.ticketValue) || 0;
}

function calculateTicketRevenue(
    venueOrId,
    eventPopularity = 50
) {
    const attendance =
        calculateExpectedAttendance(
            venueOrId,
            eventPopularity
        );

    const ticketValue =
        getTicketValue(venueOrId);

    return Math.round(
        attendance * ticketValue
    );
}

function getVenueCost(venueOrId) {
    const venue = typeof venueOrId === "string"
        ? getVenue(venueOrId)
        : venueOrId;

    if (!venue) return 0;

    return Number(venue.cost) || 0;
}

function calculateEventVenueProfit(
    venueOrId,
    eventPopularity = 50
) {
    const revenue =
        calculateTicketRevenue(
            venueOrId,
            eventPopularity
        );

    const cost =
        getVenueCost(venueOrId);

    return revenue - cost;
}

// ============================================================
// EVENT BONUSES
// ============================================================

function getVenueProductionBonus(venueOrId) {
    const venue = typeof venueOrId === "string"
        ? getVenue(venueOrId)
        : venueOrId;

    if (!venue) return 0;

    return Math.min(
        25,
        Math.round(
            (Number(venue.productionLevel) || 0) * 2.5
        )
    );
}

function getVenueMediaBonus(venueOrId) {
    const venue = typeof venueOrId === "string"
        ? getVenue(venueOrId)
        : venueOrId;

    if (!venue) return 0;

    return Math.min(
        25,
        Math.round(
            (Number(venue.mediaLevel) || 0) * 2.5
        )
    );
}

function getVenuePrestigeBonus(venueOrId) {
    const venue = typeof venueOrId === "string"
        ? getVenue(venueOrId)
        : venueOrId;

    if (!venue) return 0;

    return Math.min(
        25,
        Math.round(
            (Number(venue.prestige) || 0) * 2.5
        )
    );
}

function getVenueAtmosphereBonus(venueOrId) {
    const venue = typeof venueOrId === "string"
        ? getVenue(venueOrId)
        : venueOrId;

    if (!venue) return 0;

    return Math.min(
        25,
        Math.round(
            (Number(venue.fightAtmosphere) || 0) * 2.5
        )
    );
}

// ============================================================
// INTERNATIONAL EVENTS
// ============================================================

function getInternationalAccess(venueOrId) {
    const venue = typeof venueOrId === "string"
        ? getVenue(venueOrId)
        : venueOrId;

    if (!venue) return 0;

    return Number(
        venue.internationalAccess
    ) || 0;
}

function isInternationalVenue(venueOrId) {
    return getInternationalAccess(venueOrId) >= 7;
}

function isEliteVenue(venueOrId) {
    return canHostEvent(venueOrId, "elite");
}

// ============================================================
// STATE INTEGRATION
// ============================================================

function ensureVenuesState(database) {
    if (!database || typeof database !== "object") {
        return null;
    }

    if (!database.world) {
        database.world = {};
    }

    if (!database.world.venues) {
        database.world.venues = {};
    }

    return database.world.venues;
}

function initializeVenues(database) {
    const venuesState = ensureVenuesState(database);

    if (!venuesState) {
        return null;
    }

    Object.keys(VENUES).forEach(id => {
        if (!venuesState[id]) {
            venuesState[id] = clone(VENUES[id]);
        }
    });

    return venuesState;
}

function resetVenues(database) {
    const venuesState = ensureVenuesState(database);

    if (!venuesState) {
        return null;
    }

    Object.keys(venuesState).forEach(id => {
        delete venuesState[id];
    });

    Object.keys(VENUES).forEach(id => {
        venuesState[id] = clone(VENUES[id]);
    });

    return venuesState;
}

// ============================================================
// CUSTOM VENUE
// ============================================================

function createVenue(data = {}) {
    const id = normalizeVenueId(
        data.id ||
        data.name ||
        `venue-${Date.now()}`
    );

    return {
        id,
        name: data.name || "Nova Arena",
        countryId: data.countryId || "BRA",
        cityId: data.cityId || null,
        type: data.type || "arena",

        level: Number(data.level) || 1,
        prestige: Number(data.prestige) || 1,

        capacity: Number(data.capacity) || 1000,
        cost: Number(data.cost) || 10000,
        ticketValue: Number(data.ticketValue) || 20,

        facilities: Number(data.facilities) || 1,
        productionLevel:
            Number(data.productionLevel) || 1,

        mediaLevel:
            Number(data.mediaLevel) || 1,

        internationalAccess:
            Number(data.internationalAccess) || 1,

        fightAtmosphere:
            Number(data.fightAtmosphere) || 1,

        suitableFor: Array.isArray(data.suitableFor)
            ? data.suitableFor.map(normalizeType)
            : ["regional"],

        active: data.active !== false
    };
}

// ============================================================
// VALIDATION
// ============================================================

function validateVenue(venue) {
    const errors = [];

    if (!venue || typeof venue !== "object") {
        return {
            valid: false,
            errors: ["Arena inválida."]
        };
    }

    if (!venue.id) {
        errors.push("Arena precisa de um id.");
    }

    if (!venue.name) {
        errors.push("Arena precisa de um nome.");
    }

    if (!venue.countryId) {
        errors.push("Arena precisa de um país.");
    }

    if (!venue.cityId) {
        errors.push("Arena precisa de uma cidade.");
    }

    const numericFields = [
        "level",
        "prestige",
        "capacity",
        "cost",
        "ticketValue",
        "facilities",
        "productionLevel",
        "mediaLevel",
        "internationalAccess",
        "fightAtmosphere"
    ];

    numericFields.forEach(field => {
        if (
            venue[field] === undefined ||
            venue[field] === null ||
            Number.isNaN(Number(venue[field]))
        ) {
            errors.push(`${field} inválido.`);
        }
    });

    if (!Array.isArray(venue.suitableFor)) {
        errors.push(
            "suitableFor precisa ser um array."
        );
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

function validateVenues(database = VENUES) {
    const errors = [];

    Object.values(database).forEach(venue => {
        const result = validateVenue(venue);

        if (!result.valid) {
            errors.push({
                id: venue?.id || "unknown",
                errors: result.errors
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

function getVenuesSnapshot() {
    return {
        version: VENUES_VERSION,
        count: Object.keys(VENUES).length,
        activeCount: getActiveVenues().length,
        venues: getAllVenues()
    };
}

// ============================================================
// API
// ============================================================

const venuesAPI = {
    VENUES_VERSION,
    VENUES,

    getVenue,
    getAllVenues,
    getActiveVenues,
    getVenuesByCountry,
    getVenuesByCity,
    getVenuesByType,
    getVenuesByLevel,
    searchVenues,

    randomVenue,
    randomVenueByCountry,
    randomVenueByCity,

    calculateVenueScore,
    getTopVenues,
    getTopVenuesByCapacity,
    getTopVenuesByPrestige,

    canHostEvent,
    getSuitableVenues,

    getVenueCapacity,
    calculateExpectedAttendance,
    calculateAttendanceRate,

    getTicketValue,
    calculateTicketRevenue,
    getVenueCost,
    calculateEventVenueProfit,

    getVenueProductionBonus,
    getVenueMediaBonus,
    getVenuePrestigeBonus,
    getVenueAtmosphereBonus,

    getInternationalAccess,
    isInternationalVenue,
    isEliteVenue,

    ensureVenuesState,
    initializeVenues,
    resetVenues,

    createVenue,

    validateVenue,
    validateVenues,

    getVenuesSnapshot
};

// ============================================================
// EXPORTS
// ============================================================

export {
    VENUES_VERSION,
    VENUES,

    getVenue,
    getAllVenues,
    getActiveVenues,
    getVenuesByCountry,
    getVenuesByCity,
    getVenuesByType,
    getVenuesByLevel,
    searchVenues,

    randomVenue,
    randomVenueByCountry,
    randomVenueByCity,

    calculateVenueScore,
    getTopVenues,
    getTopVenuesByCapacity,
    getTopVenuesByPrestige,

    canHostEvent,
    getSuitableVenues,

    getVenueCapacity,
    calculateExpectedAttendance,
    calculateAttendanceRate,

    getTicketValue,
    calculateTicketRevenue,
    getVenueCost,
    calculateEventVenueProfit,

    getVenueProductionBonus,
    getVenueMediaBonus,
    getVenuePrestigeBonus,
    getVenueAtmosphereBonus,

    getInternationalAccess,
    isInternationalVenue,
    isEliteVenue,

    ensureVenuesState,
    initializeVenues,
    resetVenues,

    createVenue,

    validateVenue,
    validateVenues,

    getVenuesSnapshot
};

export default venuesAPI;
