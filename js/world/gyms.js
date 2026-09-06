// ============================================================
// MMA LIFE DYNASTY
// WORLD — GYMS
// Arquivo: js/world/gyms.js
// ============================================================

const GYMS_VERSION = 1;

// ============================================================
// DATABASE
// ============================================================

const GYMS = {

    // ========================================================
    // BRASIL
    // ========================================================

    "chute-boxe-curitiba": {
        id: "chute-boxe-curitiba",
        name: "Chute Boxe Curitiba",
        countryId: "BRA",
        cityId: "curitiba",
        level: 9,
        reputation: 9,
        trainingLevel: 9,
        facilities: 8,
        coaching: 10,
        specialties: [
            "muay_thai",
            "striking",
            "conditioning",
            "mma"
        ],
        cost: 3500,
        capacity: 120,
        fame: 9,
        active: true
    },

    "nova-uniao-rio": {
        id: "nova-uniao-rio",
        name: "Nova União Rio de Janeiro",
        countryId: "BRA",
        cityId: "rio-de-janeiro",
        level: 9,
        reputation: 10,
        trainingLevel: 9,
        facilities: 8,
        coaching: 10,
        specialties: [
            "bjj",
            "grappling",
            "mma",
            "conditioning"
        ],
        cost: 4000,
        capacity: 130,
        fame: 10,
        active: true
    },

    "team-nogueira-rio": {
        id: "team-nogueira-rio",
        name: "Team Nogueira",
        countryId: "BRA",
        cityId: "rio-de-janeiro",
        level: 9,
        reputation: 10,
        trainingLevel: 9,
        facilities: 9,
        coaching: 9,
        specialties: [
            "bjj",
            "boxing",
            "mma",
            "grappling"
        ],
        cost: 4500,
        capacity: 140,
        fame: 10,
        active: true
    },

    "x-gym-rio": {
        id: "x-gym-rio",
        name: "X-Gym",
        countryId: "BRA",
        cityId: "rio-de-janeiro",
        level: 10,
        reputation: 10,
        trainingLevel: 10,
        facilities: 10,
        coaching: 10,
        specialties: [
            "bjj",
            "boxing",
            "muay_thai",
            "mma",
            "grappling",
            "conditioning"
        ],
        cost: 6000,
        capacity: 160,
        fame: 10,
        active: true
    },

    "maromba-mma-sp": {
        id: "maromba-mma-sp",
        name: "Maromba MMA Academy",
        countryId: "BRA",
        cityId: "sao-paulo",
        level: 7,
        reputation: 7,
        trainingLevel: 7,
        facilities: 7,
        coaching: 7,
        specialties: [
            "mma",
            "conditioning",
            "boxing"
        ],
        cost: 2200,
        capacity: 100,
        fame: 6,
        active: true
    },

    "black-house-sp": {
        id: "black-house-sp",
        name: "Black House São Paulo",
        countryId: "BRA",
        cityId: "sao-paulo",
        level: 9,
        reputation: 9,
        trainingLevel: 9,
        facilities: 9,
        coaching: 9,
        specialties: [
            "mma",
            "striking",
            "bjj",
            "conditioning"
        ],
        cost: 4500,
        capacity: 130,
        fame: 9,
        active: true
    },

    "pitbull-brothers": {
        id: "pitbull-brothers",
        name: "Pitbull Brothers",
        countryId: "BRA",
        cityId: "natal",
        level: 9,
        reputation: 9,
        trainingLevel: 9,
        facilities: 8,
        coaching: 10,
        specialties: [
            "mma",
            "bjj",
            "boxing",
            "conditioning"
        ],
        cost: 4000,
        capacity: 110,
        fame: 9,
        active: true
    },

    "mma-amapa": {
        id: "mma-amapa",
        name: "Amapá Combat Academy",
        countryId: "BRA",
        cityId: "macapa",
        level: 4,
        reputation: 4,
        trainingLevel: 4,
        facilities: 4,
        coaching: 5,
        specialties: [
            "mma",
            "boxing",
            "conditioning"
        ],
        cost: 800,
        capacity: 70,
        fame: 3,
        active: true
    },

    // ========================================================
    // ESTADOS UNIDOS
    // ========================================================

    "american-top-team": {
        id: "american-top-team",
        name: "American Top Team",
        countryId: "USA",
        cityId: "miami",
        level: 10,
        reputation: 10,
        trainingLevel: 10,
        facilities: 10,
        coaching: 10,
        specialties: [
            "mma",
            "wrestling",
            "boxing",
            "bjj",
            "conditioning"
        ],
        cost: 7000,
        capacity: 200,
        fame: 10,
        active: true
    },

    "att-atlanta": {
        id: "att-atlanta",
        name: "American Top Team Atlanta",
        countryId: "USA",
        cityId: "atlanta",
        level: 8,
        reputation: 8,
        trainingLevel: 8,
        facilities: 8,
        coaching: 8,
        specialties: [
            "mma",
            "wrestling",
            "boxing"
        ],
        cost: 4000,
        capacity: 140,
        fame: 8,
        active: true
    },

    "ufc-performance-institute": {
        id: "ufc-performance-institute",
        name: "UFC Performance Institute",
        countryId: "USA",
        cityId: "las-vegas",
        level: 10,
        reputation: 10,
        trainingLevel: 10,
        facilities: 10,
        coaching: 10,
        specialties: [
            "mma",
            "wrestling",
            "striking",
            "bjj",
            "conditioning",
            "sports_science",
            "recovery"
        ],
        cost: 10000,
        capacity: 250,
        fame: 10,
        active: true
    },

    "jackson-wink": {
        id: "jackson-wink",
        name: "Jackson-Wink MMA",
        countryId: "USA",
        cityId: "albuquerque",
        level: 9,
        reputation: 9,
        trainingLevel: 9,
        facilities: 9,
        coaching: 9,
        specialties: [
            "mma",
            "striking",
            "wrestling",
            "gameplan"
        ],
        cost: 5000,
        capacity: 150,
        fame: 9,
        active: true
    },

    "aka-california": {
        id: "aka-california",
        name: "American Kickboxing Academy",
        countryId: "USA",
        cityId: "san-jose",
        level: 10,
        reputation: 10,
        trainingLevel: 10,
        facilities: 9,
        coaching: 10,
        specialties: [
            "wrestling",
            "mma",
            "striking",
            "conditioning"
        ],
        cost: 6500,
        capacity: 180,
        fame: 10,
        active: true
    },

    // ========================================================
    // CANADÁ
    // ========================================================

    "tristar-montreal": {
        id: "tristar-montreal",
        name: "Tristar Gym",
        countryId: "CAN",
        cityId: "montreal",
        level: 10,
        reputation: 10,
        trainingLevel: 10,
        facilities: 9,
        coaching: 10,
        specialties: [
            "mma",
            "boxing",
            "wrestling",
            "gameplan",
            "conditioning"
        ],
        cost: 6000,
        capacity: 160,
        fame: 10,
        active: true
    },

    // ========================================================
    // MÉXICO
    // ========================================================

    "lobo-gym-mexico": {
        id: "lobo-gym-mexico",
        name: "Lobo Gym",
        countryId: "MEX",
        cityId: "mexico-city",
        level: 8,
        reputation: 8,
        trainingLevel: 8,
        facilities: 7,
        coaching: 9,
        specialties: [
            "boxing",
            "mma",
            "conditioning"
        ],
        cost: 2500,
        capacity: 120,
        fame: 8,
        active: true
    },

    // ========================================================
    // EUROPA
    // ========================================================

    "paris-mma": {
        id: "paris-mma",
        name: "Paris MMA Academy",
        countryId: "FRA",
        cityId: "paris",
        level: 8,
        reputation: 8,
        trainingLevel: 8,
        facilities: 9,
        coaching: 8,
        specialties: [
            "mma",
            "boxing",
            "wrestling",
            "conditioning"
        ],
        cost: 4500,
        capacity: 130,
        fame: 7,
        active: true
    },

    "london-shooters": {
        id: "london-shooters",
        name: "London Combat Academy",
        countryId: "GBR",
        cityId: "london",
        level: 8,
        reputation: 8,
        trainingLevel: 8,
        facilities: 9,
        coaching: 8,
        specialties: [
            "mma",
            "boxing",
            "bjj",
            "conditioning"
        ],
        cost: 5000,
        capacity: 140,
        fame: 8,
        active: true
    },

    "spitfire-moscow": {
        id: "spitfire-moscow",
        name: "Spitfire MMA Moscow",
        countryId: "RUS",
        cityId: "moscow",
        level: 8,
        reputation: 8,
        trainingLevel: 8,
        facilities: 8,
        coaching: 9,
        specialties: [
            "wrestling",
            "sambo",
            "mma",
            "conditioning"
        ],
        cost: 3000,
        capacity: 140,
        fame: 8,
        active: true
    },

    // ========================================================
    // GEÓRGIA
    // ========================================================

    "georgia-combat": {
        id: "georgia-combat",
        name: "Georgia Combat Academy",
        countryId: "GEO",
        cityId: "tbilisi",
        level: 8,
        reputation: 8,
        trainingLevel: 8,
        facilities: 7,
        coaching: 9,
        specialties: [
            "wrestling",
            "grappling",
            "judo",
            "mma"
        ],
        cost: 2200,
        capacity: 120,
        fame: 7,
        active: true
    },

    // ========================================================
    // ORIENTE MÉDIO
    // ========================================================

    "abu-dhabi-mma": {
        id: "abu-dhabi-mma",
        name: "Abu Dhabi Combat Academy",
        countryId: "ARE",
        cityId: "abu-dhabi",
        level: 9,
        reputation: 9,
        trainingLevel: 9,
        facilities: 10,
        coaching: 9,
        specialties: [
            "bjj",
            "grappling",
            "mma",
            "conditioning",
            "recovery"
        ],
        cost: 6500,
        capacity: 180,
        fame: 9,
        active: true
    },

    // ========================================================
    // JAPÃO
    // ========================================================

    "tokyo-mma": {
        id: "tokyo-mma",
        name: "Tokyo MMA Institute",
        countryId: "JPN",
        cityId: "tokyo",
        level: 8,
        reputation: 8,
        trainingLevel: 8,
        facilities: 9,
        coaching: 8,
        specialties: [
            "mma",
            "judo",
            "boxing",
            "grappling"
        ],
        cost: 5000,
        capacity: 150,
        fame: 8,
        active: true
    },

    // ========================================================
    // THAILAND
    // ========================================================

    "tiger-muay-thai": {
        id: "tiger-muay-thai",
        name: "Tiger Muay Thai",
        countryId: "THA",
        cityId: "phuket",
        level: 10,
        reputation: 10,
        trainingLevel: 10,
        facilities: 10,
        coaching: 10,
        specialties: [
            "muay_thai",
            "striking",
            "mma",
            "conditioning",
            "recovery"
        ],
        cost: 5000,
        capacity: 250,
        fame: 10,
        active: true
    },

    // ========================================================
    // AUSTRÁLIA
    // ========================================================

    "sydney-mma": {
        id: "sydney-mma",
        name: "Sydney MMA Academy",
        countryId: "AUS",
        cityId: "sydney",
        level: 8,
        reputation: 8,
        trainingLevel: 8,
        facilities: 9,
        coaching: 8,
        specialties: [
            "mma",
            "boxing",
            "bjj",
            "wrestling"
        ],
        cost: 5000,
        capacity: 140,
        fame: 8,
        active: true
    }
};

// ============================================================
// HELPERS
// ============================================================

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function normalizeGymId(id) {
    if (!id) return null;

    return String(id)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
}

function normalizeSpecialty(specialty) {
    if (!specialty) return "";

    return String(specialty)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");
}

// ============================================================
// GET
// ============================================================

function getGym(id) {
    const gymId = normalizeGymId(id);

    if (!gymId || !GYMS[gymId]) {
        return null;
    }

    return clone(GYMS[gymId]);
}

function getAllGyms() {
    return Object.values(GYMS).map(clone);
}

function getActiveGyms() {
    return getAllGyms().filter(gym => gym.active !== false);
}

function getGymsByCountry(countryId) {
    if (!countryId) return [];

    const id = String(countryId).toUpperCase();

    return getActiveGyms().filter(
        gym => String(gym.countryId).toUpperCase() === id
    );
}

function getGymsByCity(cityId) {
    if (!cityId) return [];

    const id = normalizeGymId(cityId);

    return getActiveGyms().filter(
        gym => normalizeGymId(gym.cityId) === id
    );
}

function getGymsByLevel(minLevel = 1) {
    const level = Number(minLevel) || 1;

    return getActiveGyms()
        .filter(gym => gym.level >= level)
        .sort((a, b) => b.level - a.level);
}

function getGymsBySpecialty(specialty) {
    const normalized = normalizeSpecialty(specialty);

    if (!normalized) return [];

    return getActiveGyms().filter(
        gym => Array.isArray(gym.specialties) &&
            gym.specialties.includes(normalized)
    );
}

function searchGyms(query) {
    if (!query) return [];

    const search = String(query).trim().toLowerCase();

    return getActiveGyms().filter(gym => {
        return (
            gym.name.toLowerCase().includes(search) ||
            gym.id.toLowerCase().includes(search) ||
            gym.countryId.toLowerCase().includes(search) ||
            gym.cityId.toLowerCase().includes(search) ||
            gym.specialties.some(specialty =>
                specialty.toLowerCase().includes(search)
            )
        );
    });
}

// ============================================================
// RANDOM
// ============================================================

function randomGym() {
    const gyms = getActiveGyms();

    if (!gyms.length) return null;

    return clone(
        gyms[Math.floor(Math.random() * gyms.length)]
    );
}

function randomGymByCountry(countryId) {
    const gyms = getGymsByCountry(countryId);

    if (!gyms.length) return null;

    return clone(
        gyms[Math.floor(Math.random() * gyms.length)]
    );
}

function randomGymByCity(cityId) {
    const gyms = getGymsByCity(cityId);

    if (!gyms.length) return null;

    return clone(
        gyms[Math.floor(Math.random() * gyms.length)]
    );
}

function randomGymBySpecialty(specialty) {
    const gyms = getGymsBySpecialty(specialty);

    if (!gyms.length) return null;

    return clone(
        gyms[Math.floor(Math.random() * gyms.length)]
    );
}

// ============================================================
// RANKINGS
// ============================================================

function getTopGyms(limit = 10) {
    const amount = Math.max(1, Number(limit) || 10);

    return getActiveGyms()
        .sort((a, b) => {
            const scoreA = calculateGymScore(a);
            const scoreB = calculateGymScore(b);

            return scoreB - scoreA;
        })
        .slice(0, amount);
}

function getTopGymsByTraining(limit = 10) {
    const amount = Math.max(1, Number(limit) || 10);

    return getActiveGyms()
        .sort((a, b) =>
            b.trainingLevel - a.trainingLevel
        )
        .slice(0, amount);
}

function getTopGymsByCoaching(limit = 10) {
    const amount = Math.max(1, Number(limit) || 10);

    return getActiveGyms()
        .sort((a, b) =>
            b.coaching - a.coaching
        )
        .slice(0, amount);
}

function getTopGymsByReputation(limit = 10) {
    const amount = Math.max(1, Number(limit) || 10);

    return getActiveGyms()
        .sort((a, b) =>
            b.reputation - a.reputation
        )
        .slice(0, amount);
}

// ============================================================
// SCORE
// ============================================================

function calculateGymScore(gym) {
    if (!gym) return 0;

    const level = Number(gym.level) || 0;
    const reputation = Number(gym.reputation) || 0;
    const training = Number(gym.trainingLevel) || 0;
    const facilities = Number(gym.facilities) || 0;
    const coaching = Number(gym.coaching) || 0;
    const fame = Number(gym.fame) || 0;

    return (
        level * 0.20 +
        reputation * 0.15 +
        training * 0.25 +
        facilities * 0.15 +
        coaching * 0.20 +
        fame * 0.05
    );
}

// ============================================================
// TRAINING BONUSES
// ============================================================

function getGymTrainingBonus(gymOrId) {
    const gym = typeof gymOrId === "string"
        ? getGym(gymOrId)
        : gymOrId;

    if (!gym) return 0;

    return Math.round(
        Math.max(0, Math.min(25, gym.trainingLevel * 2.5))
    );
}

function getGymCoachingBonus(gymOrId) {
    const gym = typeof gymOrId === "string"
        ? getGym(gymOrId)
        : gymOrId;

    if (!gym) return 0;

    return Math.round(
        Math.max(0, Math.min(25, gym.coaching * 2.5))
    );
}

function getGymFacilityBonus(gymOrId) {
    const gym = typeof gymOrId === "string"
        ? getGym(gymOrId)
        : gymOrId;

    if (!gym) return 0;

    return Math.round(
        Math.max(0, Math.min(20, gym.facilities * 2))
    );
}

function getGymReputationBonus(gymOrId) {
    const gym = typeof gymOrId === "string"
        ? getGym(gymOrId)
        : gymOrId;

    if (!gym) return 0;

    return Math.round(
        Math.max(0, Math.min(20, gym.reputation * 2))
    );
}

// ============================================================
// SPECIALTY BONUS
// ============================================================

function hasGymSpecialty(gymOrId, specialty) {
    const gym = typeof gymOrId === "string"
        ? getGym(gymOrId)
        : gymOrId;

    if (!gym || !Array.isArray(gym.specialties)) {
        return false;
    }

    return gym.specialties.includes(
        normalizeSpecialty(specialty)
    );
}

function getSpecialtyBonus(gymOrId, specialty) {
    const gym = typeof gymOrId === "string"
        ? getGym(gymOrId)
        : gymOrId;

    if (!gym) return 0;

    return hasGymSpecialty(gym, specialty)
        ? 10
        : 0;
}

function getGymTotalTrainingBonus(gymOrId, specialty = null) {
    const gym = typeof gymOrId === "string"
        ? getGym(gymOrId)
        : gymOrId;

    if (!gym) return 0;

    let bonus = 0;

    bonus += getGymTrainingBonus(gym);
    bonus += getGymCoachingBonus(gym);
    bonus += getGymFacilityBonus(gym);

    if (specialty) {
        bonus += getSpecialtyBonus(gym, specialty);
    }

    return Math.min(60, bonus);
}

// ============================================================
// COST
// ============================================================

function getGymCost(gymOrId) {
    const gym = typeof gymOrId === "string"
        ? getGym(gymOrId)
        : gymOrId;

    if (!gym) return 0;

    return Number(gym.cost) || 0;
}

function calculateMonthlyGymCost(gymOrId) {
    return getGymCost(gymOrId);
}

function canAffordGym(gymOrId, money) {
    const cost = getGymCost(gymOrId);

    return Number(money) >= cost;
}

// ============================================================
// CAPACITY
// ============================================================

function getGymCapacity(gymOrId) {
    const gym = typeof gymOrId === "string"
        ? getGym(gymOrId)
        : gymOrId;

    if (!gym) return 0;

    return Number(gym.capacity) || 0;
}

// ============================================================
// CAREER VALUE
// ============================================================

function calculateGymCareerValue(gymOrId) {
    const gym = typeof gymOrId === "string"
        ? getGym(gymOrId)
        : gymOrId;

    if (!gym) return 0;

    const score = calculateGymScore(gym);

    return Math.round(
        Math.max(0, Math.min(100, score * 10))
    );
}

// ============================================================
// PLAYER DEVELOPMENT
// ============================================================

function calculateDevelopmentMultiplier(gymOrId) {
    const gym = typeof gymOrId === "string"
        ? getGym(gymOrId)
        : gymOrId;

    if (!gym) return 1;

    const training = Number(gym.trainingLevel) || 0;
    const coaching = Number(gym.coaching) || 0;
    const facilities = Number(gym.facilities) || 0;

    const average =
        (training + coaching + facilities) / 3;

    return Number(
        (0.75 + average * 0.05).toFixed(3)
    );
}

function calculateAttributeTrainingBonus(
    gymOrId,
    specialty = null
) {
    const multiplier =
        calculateDevelopmentMultiplier(gymOrId);

    let bonus = multiplier;

    if (specialty && hasGymSpecialty(gymOrId, specialty)) {
        bonus += 0.10;
    }

    return Number(bonus.toFixed(3));
}

// ============================================================
// WORLD STATE
// ============================================================

function ensureGymsState(database) {
    if (!database || typeof database !== "object") {
        return null;
    }

    if (!database.world) {
        database.world = {};
    }

    if (!database.world.gyms) {
        database.world.gyms = {};
    }

    return database.world.gyms;
}

function initializeGyms(database) {
    const gymsState = ensureGymsState(database);

    if (!gymsState) {
        return null;
    }

    Object.keys(GYMS).forEach(id => {
        if (!gymsState[id]) {
            gymsState[id] = clone(GYMS[id]);
        }
    });

    return gymsState;
}

function resetGyms(database) {
    const gymsState = ensureGymsState(database);

    if (!gymsState) {
        return null;
    }

    Object.keys(gymsState).forEach(id => {
        delete gymsState[id];
    });

    Object.keys(GYMS).forEach(id => {
        gymsState[id] = clone(GYMS[id]);
    });

    return gymsState;
}

// ============================================================
// CUSTOM GYM
// ============================================================

function createGym(data = {}) {
    const id = normalizeGymId(
        data.id ||
        data.name ||
        `gym-${Date.now()}`
    );

    return {
        id,
        name: data.name || "Nova Academia",
        countryId: data.countryId || "BRA",
        cityId: data.cityId || null,
        level: Number(data.level) || 1,
        reputation: Number(data.reputation) || 1,
        trainingLevel: Number(data.trainingLevel) || 1,
        facilities: Number(data.facilities) || 1,
        coaching: Number(data.coaching) || 1,
        specialties: Array.isArray(data.specialties)
            ? data.specialties.map(normalizeSpecialty)
            : ["mma"],
        cost: Number(data.cost) || 500,
        capacity: Number(data.capacity) || 50,
        fame: Number(data.fame) || 1,
        active: data.active !== false
    };
}

// ============================================================
// VALIDATION
// ============================================================

function validateGym(gym) {
    const errors = [];

    if (!gym || typeof gym !== "object") {
        return {
            valid: false,
            errors: ["Academia inválida."]
        };
    }

    if (!gym.id) {
        errors.push("Academia precisa de um id.");
    }

    if (!gym.name) {
        errors.push("Academia precisa de um nome.");
    }

    if (!gym.countryId) {
        errors.push("Academia precisa de um país.");
    }

    if (!gym.cityId) {
        errors.push("Academia precisa de uma cidade.");
    }

    const numericFields = [
        "level",
        "reputation",
        "trainingLevel",
        "facilities",
        "coaching",
        "cost",
        "capacity",
        "fame"
    ];

    numericFields.forEach(field => {
        if (
            gym[field] === undefined ||
            gym[field] === null ||
            Number.isNaN(Number(gym[field]))
        ) {
            errors.push(`${field} inválido.`);
        }
    });

    if (!Array.isArray(gym.specialties)) {
        errors.push("Especialidades precisam ser um array.");
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

function validateGyms(database = GYMS) {
    const errors = [];

    Object.values(database).forEach(gym => {
        const result = validateGym(gym);

        if (!result.valid) {
            errors.push({
                id: gym?.id || "unknown",
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

function getGymsSnapshot() {
    return {
        version: GYMS_VERSION,
        count: Object.keys(GYMS).length,
        activeCount: getActiveGyms().length,
        gyms: getAllGyms()
    };
}

// ============================================================
// API
// ============================================================

const gymsAPI = {
    GYMS_VERSION,
    GYMS,

    getGym,
    getAllGyms,
    getActiveGyms,
    getGymsByCountry,
    getGymsByCity,
    getGymsByLevel,
    getGymsBySpecialty,
    searchGyms,

    randomGym,
    randomGymByCountry,
    randomGymByCity,
    randomGymBySpecialty,

    getTopGyms,
    getTopGymsByTraining,
    getTopGymsByCoaching,
    getTopGymsByReputation,

    calculateGymScore,
    calculateGymCareerValue,

    getGymTrainingBonus,
    getGymCoachingBonus,
    getGymFacilityBonus,
    getGymReputationBonus,
    getSpecialtyBonus,
    getGymTotalTrainingBonus,

    getGymCost,
    calculateMonthlyGymCost,
    canAffordGym,

    getGymCapacity,

    calculateDevelopmentMultiplier,
    calculateAttributeTrainingBonus,

    hasGymSpecialty,

    ensureGymsState,
    initializeGyms,
    resetGyms,

    createGym,

    validateGym,
    validateGyms,

    getGymsSnapshot
};

export {
    GYMS_VERSION,
    GYMS,

    getGym,
    getAllGyms,
    getActiveGyms,
    getGymsByCountry,
    getGymsByCity,
    getGymsByLevel,
    getGymsBySpecialty,
    searchGyms,

    randomGym,
    randomGymByCountry,
    randomGymByCity,
    randomGymBySpecialty,

    getTopGyms,
    getTopGymsByTraining,
    getTopGymsByCoaching,
    getTopGymsByReputation,

    calculateGymScore,
    calculateGymCareerValue,

    getGymTrainingBonus,
    getGymCoachingBonus,
    getGymFacilityBonus,
    getGymReputationBonus,
    getSpecialtyBonus,
    getGymTotalTrainingBonus,

    getGymCost,
    calculateMonthlyGymCost,
    canAffordGym,

    getGymCapacity,

    calculateDevelopmentMultiplier,
    calculateAttributeTrainingBonus,

    hasGymSpecialty,

    ensureGymsState,
    initializeGyms,
    resetGyms,

    createGym,

    validateGym,
    validateGyms,

    getGymsSnapshot
};

export default gymsAPI;
