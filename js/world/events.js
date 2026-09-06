// ============================================================
// MMA LIFE DYNASTY
// WORLD — EVENTS
// Arquivo: js/world/events.js
// ============================================================

const WORLD_EVENTS_VERSION = 1;

// ============================================================
// EVENT TYPES
// ============================================================

export const WORLD_EVENT_TYPES = {
    FIGHT_CARD: "fight_card",
    TOURNAMENT: "tournament",
    TITLE_EVENT: "title_event",
    SHOWCASE: "showcase",
    AMATEUR_EVENT: "amateur_event",
    REGIONAL_EVENT: "regional_event",
    NATIONAL_EVENT: "national_event",
    INTERNATIONAL_EVENT: "international_event",
    ELITE_EVENT: "elite_event"
};

// ============================================================
// EVENT STATUS
// ============================================================

export const WORLD_EVENT_STATUS = {
    SCHEDULED: "scheduled",
    ANNOUNCED: "announced",
    ACTIVE: "active",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    POSTPONED: "postponed"
};

// ============================================================
// IMPORTANCE
// ============================================================

export const WORLD_EVENT_IMPORTANCE = {
    LOCAL: 1,
    REGIONAL: 2,
    NATIONAL: 3,
    INTERNATIONAL: 4,
    ELITE: 5,
    MAJOR: 6
};

// ============================================================
// DEFAULT EVENT
// ============================================================

export function createWorldEvent(data = {}) {
    const event = {
        id: data.id || generateEventId(),

        name: data.name || "MMA Event",

        shortName:
            data.shortName ||
            data.name ||
            "MMA Event",

        organizationId:
            data.organizationId || null,

        countryId:
            data.countryId || null,

        cityId:
            data.cityId || null,

        venueId:
            data.venueId || null,

        type:
            data.type ||
            WORLD_EVENT_TYPES.FIGHT_CARD,

        status:
            data.status ||
            WORLD_EVENT_STATUS.SCHEDULED,

        importance:
            Number.isFinite(data.importance)
                ? data.importance
                : WORLD_EVENT_IMPORTANCE.LOCAL,

        level:
            Number.isFinite(data.level)
                ? data.level
                : 1,

        year:
            Number.isFinite(data.year)
                ? data.year
                : null,

        month:
            Number.isFinite(data.month)
                ? data.month
                : null,

        day:
            Number.isFinite(data.day)
                ? data.day
                : null,

        date:
            data.date || null,

        week:
            Number.isFinite(data.week)
                ? data.week
                : null,

        mainEvent:
            data.mainEvent || null,

        coMainEvent:
            data.coMainEvent || null,

        fights:
            Array.isArray(data.fights)
                ? [...data.fights]
                : [],

        titleFights:
            Array.isArray(data.titleFights)
                ? [...data.titleFights]
                : [],

        tournamentId:
            data.tournamentId || null,

        championshipId:
            data.championshipId || null,

        weightClasses:
            Array.isArray(data.weightClasses)
                ? [...data.weightClasses]
                : [],

        expectedAttendance:
            Number.isFinite(data.expectedAttendance)
                ? data.expectedAttendance
                : 0,

        actualAttendance:
            Number.isFinite(data.actualAttendance)
                ? data.actualAttendance
                : 0,

        prestige:
            Number.isFinite(data.prestige)
                ? data.prestige
                : 0,

        mediaValue:
            Number.isFinite(data.mediaValue)
                ? data.mediaValue
                : 0,

        popularity:
            Number.isFinite(data.popularity)
                ? data.popularity
                : 0,

        ticketPrice:
            Number.isFinite(data.ticketPrice)
                ? data.ticketPrice
                : 0,

        ticketRevenue:
            Number.isFinite(data.ticketRevenue)
                ? data.ticketRevenue
                : 0,

        broadcastRevenue:
            Number.isFinite(data.broadcastRevenue)
                ? data.broadcastRevenue
                : 0,

        sponsorshipRevenue:
            Number.isFinite(data.sponsorshipRevenue)
                ? data.sponsorshipRevenue
                : 0,

        totalRevenue:
            Number.isFinite(data.totalRevenue)
                ? data.totalRevenue
                : 0,

        expenses:
            Number.isFinite(data.expenses)
                ? data.expenses
                : 0,

        profit:
            Number.isFinite(data.profit)
                ? data.profit
                : 0,

        broadcast:
            data.broadcast || {
                available: false,
                network: null,
                viewers: 0,
                revenue: 0
            },

        ppv:
            data.ppv || {
                available: false,
                buys: 0,
                price: 0,
                revenue: 0
            },

        bonuses:
            data.bonuses || {
                performance: 0,
                fightOfTheNight: 0,
                knockout: 0,
                submission: 0
            },

        weather:
            data.weather || null,

        notes:
            data.notes || "",

        results:
            Array.isArray(data.results)
                ? [...data.results]
                : [],

        generated:
            Boolean(data.generated),

        simulated:
            Boolean(data.simulated),

        active:
            data.active !== false,

        createdAt:
            data.createdAt || null,

        completedAt:
            data.completedAt || null
    };

    return event;
}

// ============================================================
// ID
// ============================================================

function generateEventId() {
    return `world_event_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

// ============================================================
// HELPERS
// ============================================================

function clone(value) {
    if (value === undefined || value === null) {
        return value;
    }

    return JSON.parse(JSON.stringify(value));
}

function normalizeId(value) {
    if (value === null || value === undefined) {
        return null;
    }

    return String(value).trim().toLowerCase();
}

function normalizeType(value) {
    if (!value) {
        return null;
    }

    return String(value).trim().toLowerCase();
}

function normalizeStatus(value) {
    if (!value) {
        return null;
    }

    return String(value).trim().toLowerCase();
}

// ============================================================
// BASIC QUERIES
// ============================================================

export function getWorldEvent(database, eventId) {
    if (!database || !database.events) {
        return null;
    }

    const id = normalizeId(eventId);

    const event = Object.values(database.events).find(
        item => normalizeId(item.id) === id
    );

    return event ? clone(event) : null;
}

export function getAllWorldEvents(database) {
    if (!database || !database.events) {
        return [];
    }

    return Object.values(database.events).map(clone);
}

export function getActiveWorldEvents(database) {
    return getAllWorldEvents(database).filter(
        event => event.active !== false
    );
}

// ============================================================
// FILTERS
// ============================================================

export function getWorldEventsByOrganization(
    database,
    organizationId
) {
    const id = normalizeId(organizationId);

    return getAllWorldEvents(database).filter(
        event => normalizeId(event.organizationId) === id
    );
}

export function getWorldEventsByCountry(
    database,
    countryId
) {
    const id = normalizeId(countryId);

    return getAllWorldEvents(database).filter(
        event => normalizeId(event.countryId) === id
    );
}

export function getWorldEventsByCity(
    database,
    cityId
) {
    const id = normalizeId(cityId);

    return getAllWorldEvents(database).filter(
        event => normalizeId(event.cityId) === id
    );
}

export function getWorldEventsByVenue(
    database,
    venueId
) {
    const id = normalizeId(venueId);

    return getAllWorldEvents(database).filter(
        event => normalizeId(event.venueId) === id
    );
}

export function getWorldEventsByType(
    database,
    type
) {
    const normalized = normalizeType(type);

    return getAllWorldEvents(database).filter(
        event => normalizeType(event.type) === normalized
    );
}

export function getWorldEventsByStatus(
    database,
    status
) {
    const normalized = normalizeStatus(status);

    return getAllWorldEvents(database).filter(
        event => normalizeStatus(event.status) === normalized
    );
}

export function getWorldEventsByLevel(
    database,
    level
) {
    return getAllWorldEvents(database).filter(
        event => Number(event.level) === Number(level)
    );
}

export function getWorldEventsByYear(
    database,
    year
) {
    return getAllWorldEvents(database).filter(
        event => Number(event.year) === Number(year)
    );
}

export function getWorldEventsByMonth(
    database,
    year,
    month
) {
    return getAllWorldEvents(database).filter(
        event =>
            Number(event.year) === Number(year) &&
            Number(event.month) === Number(month)
    );
}

export function getWorldEventsByWeek(
    database,
    year,
    week
) {
    return getAllWorldEvents(database).filter(
        event =>
            Number(event.year) === Number(year) &&
            Number(event.week) === Number(week)
    );
}

// ============================================================
// DATE
// ============================================================

export function getWorldEventsByDate(
    database,
    date
) {
    if (!date) {
        return [];
    }

    return getAllWorldEvents(database).filter(
        event => event.date === date
    );
}

export function getUpcomingWorldEvents(
    database,
    currentDate = null
) {
    const events = getActiveWorldEvents(database)
        .filter(event =>
            event.status === WORLD_EVENT_STATUS.SCHEDULED ||
            event.status === WORLD_EVENT_STATUS.ANNOUNCED
        );

    if (!currentDate) {
        return events;
    }

    const current = new Date(currentDate);

    if (Number.isNaN(current.getTime())) {
        return events;
    }

    return events
        .filter(event => {
            if (!event.date) {
                return true;
            }

            const date = new Date(event.date);

            if (Number.isNaN(date.getTime())) {
                return true;
            }

            return date >= current;
        })
        .sort(sortByDate);
}

export function getCompletedWorldEvents(database) {
    return getAllWorldEvents(database)
        .filter(event =>
            event.status === WORLD_EVENT_STATUS.COMPLETED
        )
        .sort(sortByDateDescending);
}

// ============================================================
// SORTING
// ============================================================

export function sortWorldEventsByDate(events = []) {
    return [...events].sort(sortByDate);
}

function sortByDate(a, b) {
    const dateA = a.date
        ? new Date(a.date).getTime()
        : Number.MAX_SAFE_INTEGER;

    const dateB = b.date
        ? new Date(b.date).getTime()
        : Number.MAX_SAFE_INTEGER;

    return dateA - dateB;
}

function sortByDateDescending(a, b) {
    const dateA = a.date
        ? new Date(a.date).getTime()
        : 0;

    const dateB = b.date
        ? new Date(b.date).getTime()
        : 0;

    return dateB - dateA;
}

// ============================================================
// SEARCH
// ============================================================

export function searchWorldEvents(
    database,
    query
) {
    if (!query) {
        return [];
    }

    const search = String(query)
        .trim()
        .toLowerCase();

    if (!search) {
        return [];
    }

    return getAllWorldEvents(database).filter(event => {
        const fields = [
            event.id,
            event.name,
            event.shortName,
            event.organizationId,
            event.countryId,
            event.cityId,
            event.venueId,
            event.type,
            event.status
        ];

        return fields.some(field =>
            field !== null &&
            field !== undefined &&
            String(field)
                .toLowerCase()
                .includes(search)
        );
    });
}

// ============================================================
// EVENT IMPORTANCE
// ============================================================

export function calculateEventImportance(event = {}) {
    let score = 0;

    score += Number(event.level || 0) * 10;
    score += Number(event.prestige || 0) * 0.35;
    score += Number(event.mediaValue || 0) * 0.2;
    score += Number(event.popularity || 0) * 0.2;

    if (Array.isArray(event.titleFights)) {
        score += event.titleFights.length * 20;
    }

    if (event.mainEvent) {
        score += 15;
    }

    if (event.ppv?.available) {
        score += 20;
    }

    return Math.round(score);
}

export function getEventImportance(event = {}) {
    return calculateEventImportance(event);
}

// ============================================================
// EVENT PRESTIGE
// ============================================================

export function calculateEventPrestige(event = {}) {
    let prestige = 0;

    prestige += Number(event.level || 1) * 10;

    prestige += Number(event.popularity || 0) * 0.3;

    prestige += Number(event.mediaValue || 0) * 0.25;

    if (event.type === WORLD_EVENT_TYPES.TITLE_EVENT) {
        prestige += 30;
    }

    if (event.type === WORLD_EVENT_TYPES.ELITE_EVENT) {
        prestige += 40;
    }

    if (Array.isArray(event.titleFights)) {
        prestige += event.titleFights.length * 15;
    }

    return Math.max(0, Math.round(prestige));
}

// ============================================================
// ATTENDANCE
// ============================================================

export function calculateExpectedAttendance(
    event = {},
    venue = null
) {
    const capacity = Number(
        venue?.capacity ||
        event.expectedAttendance ||
        0
    );

    if (capacity <= 0) {
        return 0;
    }

    let rate = 0.45;

    rate += Number(event.popularity || 0) / 500;
    rate += Number(event.prestige || 0) / 1000;

    if (event.type === WORLD_EVENT_TYPES.ELITE_EVENT) {
        rate += 0.25;
    }

    if (event.type === WORLD_EVENT_TYPES.TITLE_EVENT) {
        rate += 0.10;
    }

    rate = Math.max(0.10, Math.min(1, rate));

    return Math.round(capacity * rate);
}

export function calculateAttendanceRate(
    attendance,
    capacity
) {
    if (!capacity || capacity <= 0) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(1, Number(attendance || 0) / capacity)
    );
}

// ============================================================
// REVENUE
// ============================================================

export function calculateTicketRevenue(
    event = {},
    attendance = null
) {
    const people =
        attendance !== null
            ? attendance
            : event.actualAttendance ||
              event.expectedAttendance ||
              0;

    const ticketPrice = Number(event.ticketPrice || 0);

    return Math.max(
        0,
        Math.round(people * ticketPrice)
    );
}

export function calculateTotalRevenue(event = {}) {
    const ticketRevenue =
        Number(event.ticketRevenue || 0);

    const broadcastRevenue =
        Number(event.broadcastRevenue || 0);

    const sponsorshipRevenue =
        Number(event.sponsorshipRevenue || 0);

    const ppvRevenue =
        Number(event.ppv?.revenue || 0);

    return Math.max(
        0,
        Math.round(
            ticketRevenue +
            broadcastRevenue +
            sponsorshipRevenue +
            ppvRevenue
        )
    );
}

export function calculateEventProfit(event = {}) {
    const revenue =
        calculateTotalRevenue(event);

    const expenses =
        Number(event.expenses || 0);

    return Math.round(revenue - expenses);
}

// ============================================================
// BROADCAST
// ============================================================

export function calculateBroadcastValue(
    event = {}
) {
    let value = 0;

    value += Number(event.popularity || 0) * 100;
    value += Number(event.mediaValue || 0) * 150;
    value += Number(event.prestige || 0) * 75;

    if (event.type === WORLD_EVENT_TYPES.ELITE_EVENT) {
        value *= 2;
    }

    return Math.max(0, Math.round(value));
}

// ============================================================
// PPV
// ============================================================

export function calculatePPVRevenue(
    event = {},
    buys = null,
    price = null
) {
    const ppvBuys =
        buys !== null
            ? Number(buys)
            : Number(event.ppv?.buys || 0);

    const ppvPrice =
        price !== null
            ? Number(price)
            : Number(event.ppv?.price || 0);

    return Math.max(
        0,
        Math.round(ppvBuys * ppvPrice)
    );
}

export function calculateExpectedPPVBuys(
    event = {}
) {
    if (!event.ppv?.available) {
        return 0;
    }

    let buys = 0;

    buys += Number(event.popularity || 0) * 100;
    buys += Number(event.mediaValue || 0) * 75;
    buys += Number(event.prestige || 0) * 50;

    if (event.type === WORLD_EVENT_TYPES.ELITE_EVENT) {
        buys *= 2;
    }

    return Math.max(0, Math.round(buys));
}

// ============================================================
// EVENT CAPACITY
// ============================================================

export function hasAvailableFightSlots(
    event = {},
    maxFights = 12
) {
    const fights =
        Array.isArray(event.fights)
            ? event.fights.length
            : 0;

    return fights < maxFights;
}

export function getFightCount(event = {}) {
    return Array.isArray(event.fights)
        ? event.fights.length
        : 0;
}

export function getTitleFightCount(event = {}) {
    return Array.isArray(event.titleFights)
        ? event.titleFights.length
        : 0;
}

// ============================================================
// FIGHT MANAGEMENT
// ============================================================

export function addFightToWorldEvent(
    event,
    fightId
) {
    if (!event || !fightId) {
        return false;
    }

    if (!Array.isArray(event.fights)) {
        event.fights = [];
    }

    if (event.fights.includes(fightId)) {
        return false;
    }

    event.fights.push(fightId);

    return true;
}

export function removeFightFromWorldEvent(
    event,
    fightId
) {
    if (!event || !Array.isArray(event.fights)) {
        return false;
    }

    const index =
        event.fights.indexOf(fightId);

    if (index === -1) {
        return false;
    }

    event.fights.splice(index, 1);

    return true;
}

export function addTitleFightToWorldEvent(
    event,
    fightId
) {
    if (!event || !fightId) {
        return false;
    }

    if (!Array.isArray(event.titleFights)) {
        event.titleFights = [];
    }

    if (event.titleFights.includes(fightId)) {
        return false;
    }

    event.titleFights.push(fightId);

    return true;
}

// ============================================================
// STATUS
// ============================================================

export function isScheduledEvent(event = {}) {
    return (
        event.status ===
        WORLD_EVENT_STATUS.SCHEDULED
    );
}

export function isAnnouncedEvent(event = {}) {
    return (
        event.status ===
        WORLD_EVENT_STATUS.ANNOUNCED
    );
}

export function isCompletedEvent(event = {}) {
    return (
        event.status ===
        WORLD_EVENT_STATUS.COMPLETED
    );
}

export function isCancelledEvent(event = {}) {
    return (
        event.status ===
        WORLD_EVENT_STATUS.CANCELLED
    );
}

export function isActiveEvent(event = {}) {
    return (
        event.status ===
        WORLD_EVENT_STATUS.ACTIVE
    );
}

// ============================================================
// EVENT TYPE HELPERS
// ============================================================

export function isAmateurEvent(event = {}) {
    return (
        event.type ===
        WORLD_EVENT_TYPES.AMATEUR_EVENT
    );
}

export function isRegionalEvent(event = {}) {
    return (
        event.type ===
        WORLD_EVENT_TYPES.REGIONAL_EVENT
    );
}

export function isNationalEvent(event = {}) {
    return (
        event.type ===
        WORLD_EVENT_TYPES.NATIONAL_EVENT
    );
}

export function isInternationalEvent(event = {}) {
    return (
        event.type ===
        WORLD_EVENT_TYPES.INTERNATIONAL_EVENT
    );
}

export function isEliteEvent(event = {}) {
    return (
        event.type ===
        WORLD_EVENT_TYPES.ELITE_EVENT
    );
}

export function isTitleEvent(event = {}) {
    return (
        event.type ===
        WORLD_EVENT_TYPES.TITLE_EVENT
    );
}

// ============================================================
// RANDOM EVENT
// ============================================================

export function randomWorldEvent(database) {
    const events =
        getActiveWorldEvents(database);

    if (!events.length) {
        return null;
    }

    const index =
        Math.floor(
            Math.random() * events.length
        );

    return clone(events[index]);
}

export function randomWorldEventByType(
    database,
    type
) {
    const events =
        getWorldEventsByType(database, type);

    if (!events.length) {
        return null;
    }

    const index =
        Math.floor(
            Math.random() * events.length
        );

    return clone(events[index]);
}

export function randomWorldEventByOrganization(
    database,
    organizationId
) {
    const events =
        getWorldEventsByOrganization(
            database,
            organizationId
        );

    if (!events.length) {
        return null;
    }

    const index =
        Math.floor(
            Math.random() * events.length
        );

    return clone(events[index]);
}

// ============================================================
// DATABASE STATE
// ============================================================

export function ensureWorldEventsState(database) {
    if (!database) {
        return null;
    }

    if (!database.events) {
        database.events = {};
    }

    return database;
}

export function initializeWorldEvents(
    database,
    events = []
) {
    ensureWorldEventsState(database);

    const source =
        Array.isArray(events)
            ? events
            : Object.values(events || {});

    source.forEach(eventData => {
        const event =
            createWorldEvent(eventData);

        database.events[event.id] = event;
    });

    return database.events;
}

export function addWorldEvent(
    database,
    data
) {
    ensureWorldEventsState(database);

    const event =
        createWorldEvent(data);

    database.events[event.id] = event;

    return clone(event);
}

export function updateWorldEvent(
    database,
    eventId,
    updates = {}
) {
    ensureWorldEventsState(database);

    const id = normalizeId(eventId);

    const existing =
        Object.values(database.events).find(
            event =>
                normalizeId(event.id) === id
        );

    if (!existing) {
        return null;
    }

    Object.assign(existing, updates);

    return clone(existing);
}

export function removeWorldEvent(
    database,
    eventId
) {
    ensureWorldEventsState(database);

    const id = normalizeId(eventId);

    const key =
        Object.keys(database.events).find(
            key =>
                normalizeId(
                    database.events[key].id
                ) === id
        );

    if (!key) {
        return false;
    }

    delete database.events[key];

    return true;
}

// ============================================================
// COMPLETE EVENT
// ============================================================

export function completeWorldEvent(
    database,
    eventId,
    results = []
) {
    const event =
        updateWorldEvent(
            database,
            eventId,
            {
                status:
                    WORLD_EVENT_STATUS.COMPLETED,

                results:
                    Array.isArray(results)
                        ? [...results]
                        : [],

                completedAt:
                    new Date().toISOString(),

                simulated: true
            }
        );

    if (!event) {
        return null;
    }

    return event;
}

// ============================================================
// CANCEL EVENT
// ============================================================

export function cancelWorldEvent(
    database,
    eventId,
    reason = ""
) {
    return updateWorldEvent(
        database,
        eventId,
        {
            status:
                WORLD_EVENT_STATUS.CANCELLED,

            notes: reason || ""
        }
    );
}

// ============================================================
// EVENT SUMMARY
// ============================================================

export function getWorldEventSummary(
    event = {}
) {
    return {
        id: event.id || null,

        name: event.name || "",

        organizationId:
            event.organizationId || null,

        countryId:
            event.countryId || null,

        cityId:
            event.cityId || null,

        venueId:
            event.venueId || null,

        type:
            event.type || null,

        status:
            event.status || null,

        level:
            event.level || 0,

        date:
            event.date || null,

        fights:
            getFightCount(event),

        titleFights:
            getTitleFightCount(event),

        prestige:
            event.prestige || 0,

        popularity:
            event.popularity || 0,

        expectedAttendance:
            event.expectedAttendance || 0,

        actualAttendance:
            event.actualAttendance || 0,

        totalRevenue:
            event.totalRevenue || 0,

        expenses:
            event.expenses || 0,

        profit:
            event.profit || 0
    };
}

// ============================================================
// VALIDATION
// ============================================================

export function validateWorldEvent(event) {
    const errors = [];

    if (!event || typeof event !== "object") {
        return {
            valid: false,
            errors: ["Event must be an object."]
        };
    }

    if (!event.id) {
        errors.push("Missing event id.");
    }

    if (!event.name) {
        errors.push("Missing event name.");
    }

    if (!event.type) {
        errors.push("Missing event type.");
    }

    if (!Object.values(WORLD_EVENT_TYPES).includes(event.type)) {
        errors.push("Invalid event type.");
    }

    if (!Object.values(WORLD_EVENT_STATUS).includes(event.status)) {
        errors.push("Invalid event status.");
    }

    if (
        event.fights !== undefined &&
        !Array.isArray(event.fights)
    ) {
        errors.push("Fights must be an array.");
    }

    if (
        event.titleFights !== undefined &&
        !Array.isArray(event.titleFights)
    ) {
        errors.push(
            "Title fights must be an array."
        );
    }

    if (
        event.year !== null &&
        event.year !== undefined &&
        !Number.isFinite(event.year)
    ) {
        errors.push("Invalid event year.");
    }

    if (
        event.month !== null &&
        event.month !== undefined &&
        !Number.isFinite(event.month)
    ) {
        errors.push("Invalid event month.");
    }

    if (
        event.month !== null &&
        event.month !== undefined &&
        (
            event.month < 1 ||
            event.month > 12
        )
    ) {
        errors.push("Event month must be 1-12.");
    }

    if (
        event.day !== null &&
        event.day !== undefined &&
        !Number.isFinite(event.day)
    ) {
        errors.push("Invalid event day.");
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

export function validateWorldEvents(
    database
) {
    const events =
        getAllWorldEvents(database);

    const results =
        events.map(event => ({
            id: event.id,
            ...validateWorldEvent(event)
        }));

    const invalid =
        results.filter(
            result => !result.valid
        );

    return {
        valid: invalid.length === 0,
        total: results.length,
        validCount:
            results.length - invalid.length,
        invalidCount:
            invalid.length,
        results
    };
}

// ============================================================
// SNAPSHOT
// ============================================================

export function getWorldEventsSnapshot(
    database
) {
    return {
        version:
            WORLD_EVENTS_VERSION,

        total:
            getAllWorldEvents(database).length,

        active:
            getActiveWorldEvents(database).length,

        scheduled:
            getWorldEventsByStatus(
                database,
                WORLD_EVENT_STATUS.SCHEDULED
            ).length,

        announced:
            getWorldEventsByStatus(
                database,
                WORLD_EVENT_STATUS.ANNOUNCED
            ).length,

        completed:
            getWorldEventsByStatus(
                database,
                WORLD_EVENT_STATUS.COMPLETED
            ).length,

        cancelled:
            getWorldEventsByStatus(
                database,
                WORLD_EVENT_STATUS.CANCELLED
            ).length,

        events:
            getAllWorldEvents(database)
    };
}

// ============================================================
// API
// ============================================================

export const worldEventsAPI = {
    version: WORLD_EVENTS_VERSION,

    WORLD_EVENT_TYPES,
    WORLD_EVENT_STATUS,
    WORLD_EVENT_IMPORTANCE,

    createWorldEvent,

    getWorldEvent,
    getAllWorldEvents,
    getActiveWorldEvents,

    getWorldEventsByOrganization,
    getWorldEventsByCountry,
    getWorldEventsByCity,
    getWorldEventsByVenue,
    getWorldEventsByType,
    getWorldEventsByStatus,
    getWorldEventsByLevel,
    getWorldEventsByYear,
    getWorldEventsByMonth,
    getWorldEventsByWeek,

    getWorldEventsByDate,
    getUpcomingWorldEvents,
    getCompletedWorldEvents,

    sortWorldEventsByDate,
    searchWorldEvents,

    calculateEventImportance,
    getEventImportance,
    calculateEventPrestige,

    calculateExpectedAttendance,
    calculateAttendanceRate,

    calculateTicketRevenue,
    calculateTotalRevenue,
    calculateEventProfit,

    calculateBroadcastValue,

    calculatePPVRevenue,
    calculateExpectedPPVBuys,

    hasAvailableFightSlots,
    getFightCount,
    getTitleFightCount,

    addFightToWorldEvent,
    removeFightFromWorldEvent,
    addTitleFightToWorldEvent,

    isScheduledEvent,
    isAnnouncedEvent,
    isCompletedEvent,
    isCancelledEvent,
    isActiveEvent,

    isAmateurEvent,
    isRegionalEvent,
    isNationalEvent,
    isInternationalEvent,
    isEliteEvent,
    isTitleEvent,

    randomWorldEvent,
    randomWorldEventByType,
    randomWorldEventByOrganization,

    ensureWorldEventsState,
    initializeWorldEvents,
    addWorldEvent,
    updateWorldEvent,
    removeWorldEvent,

    completeWorldEvent,
    cancelWorldEvent,

    getWorldEventSummary,

    validateWorldEvent,
    validateWorldEvents,

    getWorldEventsSnapshot
};

export default worldEventsAPI;
