// ============================================================
// MMA LIFE DYNASTY
// WORLD ENGINE
// ============================================================
// Orquestrador principal do sistema WORLD.
//
// Responsabilidades:
// - Inicializar os bancos do mundo
// - Conectar países, cidades, academias, arenas e organizações
// - Controlar a simulação mundial
// - Fornecer consultas consolidadas para outros sistemas
// - Avançar semanas/meses/anos do mundo
// - Gerenciar eventos mundiais
// - Criar um ponto único de acesso ao WORLD
//
// IMPORTANTE:
// Este arquivo não deve conter regras específicas de carreira,
// treino, luta ou vida do jogador.
// Ele apenas coordena os módulos WORLD.
// ============================================================

const WORLD_ENGINE_VERSION = 1;

// ------------------------------------------------------------
// ESTADO INTERNO
// ------------------------------------------------------------

let worldDatabase = null;

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

function clone(value) {
    if (value === undefined || value === null) {
        return value;
    }

    return JSON.parse(JSON.stringify(value));
}

function normalizeId(value) {
    if (value === undefined || value === null) {
        return null;
    }

    return String(value).trim().toLowerCase();
}

// ------------------------------------------------------------
// DATABASE BASE
// ------------------------------------------------------------

function createWorldDatabase() {
    return {
        countries: {},
        cities: {},
        gyms: {},
        venues: {},
        organizations: {},
        events: {},
        fighters: {},
        rankings: {},
        champions: {},
        news: [],
        tournaments: {},
        sponsors: {},
        managers: {},

        simulation: {
            week: 1,
            year: 1,
            totalWeeks: 0,
            totalEvents: 0,
            totalFights: 0,
            lastSimulationAt: null,
            history: []
        }
    };
}

// ------------------------------------------------------------
// INICIALIZAÇÃO
// ------------------------------------------------------------

function initializeWorld(database = null) {
    if (database) {
        worldDatabase = database;

        ensureWorldDatabase(worldDatabase);
    } else if (!worldDatabase) {
        worldDatabase = createWorldDatabase();
    }

    return worldDatabase;
}

function ensureWorldDatabase(database) {
    if (!database || typeof database !== "object") {
        return createWorldDatabase();
    }

    database.countries = database.countries || {};
    database.cities = database.cities || {};
    database.gyms = database.gyms || {};
    database.venues = database.venues || {};
    database.organizations = database.organizations || {};
    database.events = database.events || {};
    database.fighters = database.fighters || {};
    database.rankings = database.rankings || {};
    database.champions = database.champions || {};
    database.news = Array.isArray(database.news) ? database.news : [];
    database.tournaments = database.tournaments || {};
    database.sponsors = database.sponsors || {};
    database.managers = database.managers || {};

    database.simulation = database.simulation || {
        week: 1,
        year: 1,
        totalWeeks: 0,
        totalEvents: 0,
        totalFights: 0,
        lastSimulationAt: null,
        history: []
    };

    if (!Array.isArray(database.simulation.history)) {
        database.simulation.history = [];
    }

    return database;
}

// ------------------------------------------------------------
// DATABASE ATUAL
// ------------------------------------------------------------

function getWorldDatabase() {
    if (!worldDatabase) {
        initializeWorld();
    }

    return worldDatabase;
}

function setWorldDatabase(database) {
    worldDatabase = ensureWorldDatabase(database);

    return worldDatabase;
}

// ------------------------------------------------------------
// REGISTRO DE ENTIDADES
// ------------------------------------------------------------

function registerCountry(country) {
    const db = getWorldDatabase();

    if (!country || !country.id) {
        return null;
    }

    const id = normalizeId(country.id);

    db.countries[id] = clone(country);

    return clone(db.countries[id]);
}

function registerCity(city) {
    const db = getWorldDatabase();

    if (!city || !city.id) {
        return null;
    }

    const id = normalizeId(city.id);

    db.cities[id] = clone(city);

    return clone(db.cities[id]);
}

function registerGym(gym) {
    const db = getWorldDatabase();

    if (!gym || !gym.id) {
        return null;
    }

    const id = normalizeId(gym.id);

    db.gyms[id] = clone(gym);

    return clone(db.gyms[id]);
}

function registerVenue(venue) {
    const db = getWorldDatabase();

    if (!venue || !venue.id) {
        return null;
    }

    const id = normalizeId(venue.id);

    db.venues[id] = clone(venue);

    return clone(db.venues[id]);
}

function registerOrganization(organization) {
    const db = getWorldDatabase();

    if (!organization || !organization.id) {
        return null;
    }

    const id = normalizeId(organization.id);

    db.organizations[id] = clone(organization);

    return clone(db.organizations[id]);
}

function registerEvent(event) {
    const db = getWorldDatabase();

    if (!event || !event.id) {
        return null;
    }

    const id = normalizeId(event.id);

    db.events[id] = clone(event);

    return clone(db.events[id]);
}

function registerFighter(fighter) {
    const db = getWorldDatabase();

    if (!fighter || !fighter.id) {
        return null;
    }

    const id = normalizeId(fighter.id);

    db.fighters[id] = clone(fighter);

    return clone(db.fighters[id]);
}

// ------------------------------------------------------------
// CONSULTAS BÁSICAS
// ------------------------------------------------------------

function getCountry(countryId) {
    const db = getWorldDatabase();

    return clone(db.countries[normalizeId(countryId)] || null);
}

function getCity(cityId) {
    const db = getWorldDatabase();

    return clone(db.cities[normalizeId(cityId)] || null);
}

function getGym(gymId) {
    const db = getWorldDatabase();

    return clone(db.gyms[normalizeId(gymId)] || null);
}

function getVenue(venueId) {
    const db = getWorldDatabase();

    return clone(db.venues[normalizeId(venueId)] || null);
}

function getOrganization(organizationId) {
    const db = getWorldDatabase();

    return clone(
        db.organizations[normalizeId(organizationId)] || null
    );
}

function getEvent(eventId) {
    const db = getWorldDatabase();

    return clone(db.events[normalizeId(eventId)] || null);
}

function getFighter(fighterId) {
    const db = getWorldDatabase();

    return clone(db.fighters[normalizeId(fighterId)] || null);
}

// ------------------------------------------------------------
// LISTAGENS
// ------------------------------------------------------------

function getAllCountries() {
    return Object.values(getWorldDatabase().countries).map(clone);
}

function getAllCities() {
    return Object.values(getWorldDatabase().cities).map(clone);
}

function getAllGyms() {
    return Object.values(getWorldDatabase().gyms).map(clone);
}

function getAllVenues() {
    return Object.values(getWorldDatabase().venues).map(clone);
}

function getAllOrganizations() {
    return Object.values(getWorldDatabase().organizations).map(clone);
}

function getAllEvents() {
    return Object.values(getWorldDatabase().events).map(clone);
}

function getAllFighters() {
    return Object.values(getWorldDatabase().fighters).map(clone);
}

// ------------------------------------------------------------
// FILTROS
// ------------------------------------------------------------

function getCitiesByCountry(countryId) {
    const id = normalizeId(countryId);

    return getAllCities().filter(city =>
        normalizeId(city.countryId) === id
    );
}

function getGymsByCountry(countryId) {
    const id = normalizeId(countryId);

    return getAllGyms().filter(gym =>
        normalizeId(gym.countryId) === id
    );
}

function getGymsByCity(cityId) {
    const id = normalizeId(cityId);

    return getAllGyms().filter(gym =>
        normalizeId(gym.cityId) === id
    );
}

function getVenuesByCountry(countryId) {
    const id = normalizeId(countryId);

    return getAllVenues().filter(venue =>
        normalizeId(venue.countryId) === id
    );
}

function getVenuesByCity(cityId) {
    const id = normalizeId(cityId);

    return getAllVenues().filter(venue =>
        normalizeId(venue.cityId) === id
    );
}

function getOrganizationsByCountry(countryId) {
    const id = normalizeId(countryId);

    return getAllOrganizations().filter(org =>
        normalizeId(org.countryId) === id
    );
}

function getOrganizationsByDivision(division) {
    const normalizedDivision = normalizeId(division);

    return getAllOrganizations().filter(org => {
        if (!Array.isArray(org.divisions)) {
            return false;
        }

        return org.divisions.some(item =>
            normalizeId(item) === normalizedDivision
        );
    });
}

function getEventsByOrganization(organizationId) {
    const id = normalizeId(organizationId);

    return getAllEvents().filter(event =>
        normalizeId(event.organizationId) === id
    );
}

function getEventsByCity(cityId) {
    const id = normalizeId(cityId);

    return getAllEvents().filter(event =>
        normalizeId(event.cityId) === id
    );
}

function getFightersByCountry(countryId) {
    const id = normalizeId(countryId);

    return getAllFighters().filter(fighter =>
        normalizeId(fighter.countryId) === id
    );
}

function getFightersByOrganization(organizationId) {
    const id = normalizeId(organizationId);

    return getAllFighters().filter(fighter =>
        normalizeId(fighter.organizationId) === id
    );
}

// ------------------------------------------------------------
// EVENTOS
// ------------------------------------------------------------

function addEvent(event) {
    return registerEvent(event);
}

function updateEvent(eventId, updates = {}) {
    const db = getWorldDatabase();

    const id = normalizeId(eventId);

    if (!db.events[id]) {
        return null;
    }

    db.events[id] = {
        ...db.events[id],
        ...clone(updates)
    };

    return clone(db.events[id]);
}

function removeEvent(eventId) {
    const db = getWorldDatabase();

    const id = normalizeId(eventId);

    if (!db.events[id]) {
        return false;
    }

    delete db.events[id];

    return true;
}

function getUpcomingEvents() {
    return getAllEvents().filter(event => {
        const status = normalizeId(event.status);

        return (
            status === "scheduled" ||
            status === "announced" ||
            status === "active"
        );
    });
}

function getCompletedEvents() {
    return getAllEvents().filter(event =>
        normalizeId(event.status) === "completed"
    );
}

// ------------------------------------------------------------
// SIMULAÇÃO
// ------------------------------------------------------------

function simulateWeek(options = {}) {
    const db = getWorldDatabase();

    const result = {
        success: true,
        week: db.simulation.week,
        year: db.simulation.year,
        events: [],
        fights: 0,
        news: [],
        errors: []
    };

    try {
        if (
            typeof worldSimulationAPI !== "undefined" &&
            worldSimulationAPI &&
            typeof worldSimulationAPI.simulateWorldWeek === "function"
        ) {
            const simulationResult =
                worldSimulationAPI.simulateWorldWeek(
                    db,
                    options
                );

            if (simulationResult) {
                return simulationResult;
            }
        }

        db.simulation.totalWeeks += 1;

        const historyEntry = {
            week: db.simulation.week,
            year: db.simulation.year,
            simulatedAt: new Date().toISOString()
        };

        db.simulation.history.push(historyEntry);

        if (db.simulation.history.length > 100) {
            db.simulation.history =
                db.simulation.history.slice(-100);
        }

        result.success = true;
    } catch (error) {
        result.success = false;
        result.errors.push(error.message);
    }

    return result;
}

// ------------------------------------------------------------
// AVANÇO DE TEMPO
// ------------------------------------------------------------

function advanceWeek(options = {}) {
    const db = getWorldDatabase();

    db.simulation.week += 1;
    db.simulation.totalWeeks += 1;

    if (db.simulation.week > 52) {
        db.simulation.week = 1;
        db.simulation.year += 1;
    }

    db.simulation.lastSimulationAt =
        new Date().toISOString();

    return {
        week: db.simulation.week,
        year: db.simulation.year,
        totalWeeks: db.simulation.totalWeeks
    };
}

function advanceMonth(options = {}) {
    const db = getWorldDatabase();

    const weeks = Number(options.weeks) || 4;

    let result = null;

    for (let i = 0; i < weeks; i++) {
        result = advanceWeek(options);
    }

    return result;
}

function advanceYear(options = {}) {
    const db = getWorldDatabase();

    const startingYear = db.simulation.year;

    while (db.simulation.year === startingYear) {
        advanceWeek(options);
    }

    return {
        year: db.simulation.year,
        totalWeeks: db.simulation.totalWeeks
    };
}

// ------------------------------------------------------------
// SIMULAÇÃO COMPLETA
// ------------------------------------------------------------

function runSimulationWeeks(numberOfWeeks = 1, options = {}) {
    const total = Math.max(
        1,
        Math.floor(Number(numberOfWeeks) || 1)
    );

    const results = [];

    for (let i = 0; i < total; i++) {
        results.push(simulateWeek(options));
        advanceWeek(options);
    }

    return results;
}

// ------------------------------------------------------------
// SNAPSHOT
// ------------------------------------------------------------

function getWorldSnapshot() {
    const db = getWorldDatabase();

    return {
        version: WORLD_ENGINE_VERSION,

        simulation: clone(db.simulation),

        counts: {
            countries: Object.keys(db.countries).length,
            cities: Object.keys(db.cities).length,
            gyms: Object.keys(db.gyms).length,
            venues: Object.keys(db.venues).length,
            organizations:
                Object.keys(db.organizations).length,
            events: Object.keys(db.events).length,
            fighters: Object.keys(db.fighters).length
        },

        upcomingEvents: getUpcomingEvents().length,
        completedEvents: getCompletedEvents().length
    };
}

// ------------------------------------------------------------
// RESET
// ------------------------------------------------------------

function resetWorld() {
    worldDatabase = createWorldDatabase();

    return worldDatabase;
}

// ------------------------------------------------------------
// EXPORTAÇÃO
// ------------------------------------------------------------

const worldEngineAPI = {
    WORLD_ENGINE_VERSION,

    createWorldDatabase,
    initializeWorld,
    ensureWorldDatabase,

    getWorldDatabase,
    setWorldDatabase,

    registerCountry,
    registerCity,
    registerGym,
    registerVenue,
    registerOrganization,
    registerEvent,
    registerFighter,

    getCountry,
    getCity,
    getGym,
    getVenue,
    getOrganization,
    getEvent,
    getFighter,

    getAllCountries,
    getAllCities,
    getAllGyms,
    getAllVenues,
    getAllOrganizations,
    getAllEvents,
    getAllFighters,

    getCitiesByCountry,
    getGymsByCountry,
    getGymsByCity,
    getVenuesByCountry,
    getVenuesByCity,
    getOrganizationsByCountry,
    getOrganizationsByDivision,
    getEventsByOrganization,
    getEventsByCity,
    getFightersByCountry,
    getFightersByOrganization,

    addEvent,
    updateEvent,
    removeEvent,
    getUpcomingEvents,
    getCompletedEvents,

    simulateWeek,
    advanceWeek,
    advanceMonth,
    advanceYear,
    runSimulationWeeks,

    getWorldSnapshot,
    resetWorld
};

export {
    WORLD_ENGINE_VERSION,

    createWorldDatabase,
    initializeWorld,
    ensureWorldDatabase,

    getWorldDatabase,
    setWorldDatabase,

    registerCountry,
    registerCity,
    registerGym,
    registerVenue,
    registerOrganization,
    registerEvent,
    registerFighter,

    getCountry,
    getCity,
    getGym,
    getVenue,
    getOrganization,
    getEvent,
    getFighter,

    getAllCountries,
    getAllCities,
    getAllGyms,
    getAllVenues,
    getAllOrganizations,
    getAllEvents,
    getAllFighters,

    getCitiesByCountry,
    getGymsByCountry,
    getGymsByCity,
    getVenuesByCountry,
    getVenuesByCity,
    getOrganizationsByCountry,
    getOrganizationsByDivision,
    getEventsByOrganization,
    getEventsByCity,
    getFightersByCountry,
    getFightersByOrganization,

    addEvent,
    updateEvent,
    removeEvent,
    getUpcomingEvents,
    getCompletedEvents,

    simulateWeek,
    advanceWeek,
    advanceMonth,
    advanceYear,
    runSimulationWeeks,

    getWorldSnapshot,
    resetWorld,

    worldEngineAPI
};

export default worldEngineAPI;
