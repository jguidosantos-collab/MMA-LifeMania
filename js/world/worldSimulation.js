// ============================================================
// MMA LIFE DYNASTY
// WORLD — WORLD SIMULATION
// Arquivo: js/world/worldSimulation.js
// ============================================================

const WORLD_SIMULATION_VERSION = 1;

// ============================================================
// CONFIGURAÇÕES
// ============================================================

export const WORLD_SIMULATION_CONFIG = {
    eventsPerWeekMin: 1,
    eventsPerWeekMax: 4,

    regionalEventChance: 0.45,
    nationalEventChance: 0.30,
    internationalEventChance: 0.18,
    eliteEventChance: 0.07,

    fighterActivityChance: 0.70,
    injuryChance: 0.08,
    retirementChance: 0.01,

    rankingUpdateChance: 1,
    newsChance: 0.55,

    maxGeneratedEventsPerWeek: 5,
    maxStoredNews: 200,
    maxStoredHistory: 500
};

// ============================================================
// TIPOS DE SIMULAÇÃO
// ============================================================

export const SIMULATION_ACTIONS = {
    WEEK: "week",
    MONTH: "month",
    YEAR: "year",
    EVENT: "event",
    FIGHTER: "fighter",
    ORGANIZATION: "organization"
};

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

function randomInt(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function randomChance(chance) {
    return Math.random() < chance;
}

function getArray(value) {
    return Array.isArray(value) ? value : [];
}

function getObjectValues(value) {
    if (!value || typeof value !== "object") {
        return [];
    }

    return Object.values(value);
}

// ============================================================
// SIMULATION STATE
// ============================================================

export function ensureWorldSimulationState(database) {
    if (!database) {
        return null;
    }

    if (!database.simulation) {
        database.simulation = {};
    }

    if (!Number.isFinite(database.simulation.week)) {
        database.simulation.week = 1;
    }

    if (!Number.isFinite(database.simulation.year)) {
        database.simulation.year = 1;
    }

    if (!Number.isFinite(database.simulation.totalWeeks)) {
        database.simulation.totalWeeks = 0;
    }

    if (!Number.isFinite(database.simulation.totalEvents)) {
        database.simulation.totalEvents = 0;
    }

    if (!Number.isFinite(database.simulation.totalFights)) {
        database.simulation.totalFights = 0;
    }

    if (!Number.isFinite(database.simulation.lastSimulationAt)) {
        database.simulation.lastSimulationAt = null;
    }

    if (!Array.isArray(database.simulation.history)) {
        database.simulation.history = [];
    }

    return database;
}

// ============================================================
// WORLD SNAPSHOT
// ============================================================

export function getWorldSnapshot(database) {
    return {
        fighters:
            getObjectValues(database?.fighters).length,

        promotions:
            getObjectValues(database?.promotions).length,

        organizations:
            getObjectValues(database?.organizations).length,

        events:
            getObjectValues(database?.events).length,

        rankings:
            getObjectValues(database?.rankings).length,

        cities:
            getObjectValues(database?.cities).length,

        countries:
            getObjectValues(database?.countries).length,

        gyms:
            getObjectValues(database?.gyms).length,

        venues:
            getObjectValues(database?.venues).length
    };
}

// ============================================================
// ORGANIZAÇÕES DISPONÍVEIS
// ============================================================

export function getSimulationOrganizations(database) {
    const organizations =
        database?.organizations ||
        database?.promotions ||
        {};

    return getObjectValues(organizations)
        .filter(
            organization =>
                organization &&
                organization.active !== false
        );
}

// ============================================================
// LUTADORES DISPONÍVEIS
// ============================================================

export function getSimulationFighters(database) {
    return getObjectValues(
        database?.fighters || {}
    ).filter(
        fighter =>
            fighter &&
            fighter.active !== false
    );
}

export function getActiveFighters(database) {
    return getSimulationFighters(database)
        .filter(fighter => {
            if (
                fighter.status === "retired" ||
                fighter.retired === true
            ) {
                return false;
            }

            if (
                fighter.health &&
                fighter.health.active === false
            ) {
                return false;
            }

            return true;
        });
}

// ============================================================
// SELEÇÃO DE LUTADORES
// ============================================================

export function selectRandomFighter(
    database,
    options = {}
) {
    let fighters =
        getActiveFighters(database);

    if (options.organizationId) {
        const organizationId =
            normalizeId(options.organizationId);

        fighters = fighters.filter(
            fighter =>
                normalizeId(
                    fighter.organizationId
                ) === organizationId ||
                normalizeId(
                    fighter.currentOrganizationId
                ) === organizationId
        );
    }

    if (options.division) {
        const division =
            normalizeId(options.division);

        fighters = fighters.filter(
            fighter =>
                normalizeId(
                    fighter.division ||
                    fighter.weightClass
                ) === division
        );
    }

    if (options.countryId) {
        const countryId =
            normalizeId(options.countryId);

        fighters = fighters.filter(
            fighter =>
                normalizeId(
                    fighter.countryId
                ) === countryId
        );
    }

    if (!fighters.length) {
        return null;
    }

    return clone(
        fighters[
            randomInt(0, fighters.length - 1)
        ]
    );
}

export function selectTwoDifferentFighters(
    database,
    options = {}
) {
    const fighters =
        getActiveFighters(database);

    if (fighters.length < 2) {
        return null;
    }

    let first =
        selectRandomFighter(
            database,
            options
        );

    if (!first) {
        return null;
    }

    const remaining =
        fighters.filter(
            fighter =>
                normalizeId(fighter.id) !==
                normalizeId(first.id)
        );

    if (!remaining.length) {
        return null;
    }

    const second =
        clone(
            remaining[
                randomInt(0, remaining.length - 1)
            ]
        );

    return {
        fighterA: first,
        fighterB: second
    };
}

// ============================================================
// ORGANIZAÇÃO DO LUTADOR
// ============================================================

export function getFighterOrganization(
    fighter,
    database
) {
    if (!fighter) {
        return null;
    }

    const organizationId =
        fighter.organizationId ||
        fighter.currentOrganizationId ||
        fighter.promotionId;

    if (!organizationId) {
        return null;
    }

    const organizations =
        database?.organizations ||
        database?.promotions ||
        {};

    return (
        Object.values(organizations)
            .find(
                organization =>
                    normalizeId(
                        organization.id
                    ) ===
                    normalizeId(
                        organizationId
                    )
            ) || null
    );
}

// ============================================================
// NÍVEL DA ORGANIZAÇÃO
// ============================================================

export function getOrganizationLevel(
    organization
) {
    if (!organization) {
        return 1;
    }

    if (
        Number.isFinite(
            organization.level
        )
    ) {
        return Number(organization.level);
    }

    const tier =
        String(
            organization.tier || ""
        ).toLowerCase();

    if (tier === "elite") {
        return 10;
    }

    if (tier === "international") {
        return 7;
    }

    if (tier === "national") {
        return 4;
    }

    return 1;
}

// ============================================================
// TIPO DE EVENTO
// ============================================================

export function determineEventType(
    organization
) {
    const level =
        getOrganizationLevel(
            organization
        );

    if (level >= 9) {
        return "elite_event";
    }

    if (level >= 6) {
        return "international_event";
    }

    if (level >= 3) {
        return "national_event";
    }

    return "regional_event";
}

// ============================================================
// EVENTO POR ORGANIZAÇÃO
// ============================================================

export function generateWorldEventForOrganization(
    database,
    organization
) {
    if (!organization) {
        return null;
    }

    const eventType =
        determineEventType(
            organization
        );

    const level =
        getOrganizationLevel(
            organization
        );

    const cities =
        getObjectValues(
            database?.cities || {}
        );

    const venues =
        getObjectValues(
            database?.venues || {}
        );

    let city = null;

    if (organization.cityId) {
        city =
            cities.find(
                item =>
                    normalizeId(item.id) ===
                    normalizeId(
                        organization.cityId
                    )
            ) || null;
    }

    if (!city && cities.length) {
        const matching =
            cities.filter(
                item =>
                    !organization.countryId ||
                    normalizeId(
                        item.countryId
                    ) ===
                    normalizeId(
                        organization.countryId
                    )
            );

        if (matching.length) {
            city =
                clone(
                    matching[
                        randomInt(
                            0,
                            matching.length - 1
                        )
                    ]
                );
        }
    }

    let venue = null;

    if (city) {
        const cityVenues =
            venues.filter(
                item =>
                    normalizeId(
                        item.cityId
                    ) ===
                    normalizeId(city.id) &&
                    item.active !== false
            );

        if (cityVenues.length) {
            venue =
                clone(
                    cityVenues[
                        randomInt(
                            0,
                            cityVenues.length - 1
                        )
                    ]
                );
        }
    }

    if (!venue && venues.length) {
        venue =
            clone(
                venues[
                    randomInt(
                        0,
                        venues.length - 1
                    )
                ]
            );
    }

    const eventName =
        generateEventName(
            organization,
            eventType
        );

    const event = {
        id: generateSimulationEventId(),

        name: eventName,

        shortName:
            organization.shortName ||
            organization.name ||
            "MMA Event",

        organizationId:
            organization.id || null,

        countryId:
            city?.countryId ||
            organization.countryId ||
            venue?.countryId ||
            null,

        cityId:
            city?.id ||
            organization.cityId ||
            venue?.cityId ||
            null,

        venueId:
            venue?.id || null,

        type: eventType,

        status: "scheduled",

        importance:
            calculateGeneratedEventImportance(
                level,
                eventType
            ),

        level,

        year:
            database?.simulation?.year ||
            1,

        month:
            null,

        day:
            null,

        week:
            database?.simulation?.week ||
            1,

        date: null,

        mainEvent: null,

        coMainEvent: null,

        fights: [],

        titleFights: [],

        tournamentId: null,

        championshipId: null,

        weightClasses:
            getOrganizationDivisions(
                organization
            ),

        expectedAttendance: 0,

        actualAttendance: 0,

        prestige:
            calculateGeneratedEventPrestige(
                organization,
                level
            ),

        mediaValue:
            calculateGeneratedMediaValue(
                organization,
                level
            ),

        popularity:
            Number(
                organization.popularity || 0
            ),

        ticketPrice:
            calculateGeneratedTicketPrice(
                organization,
                level
            ),

        ticketRevenue: 0,
        broadcastRevenue: 0,
        sponsorshipRevenue: 0,
        totalRevenue: 0,
        expenses: 0,
        profit: 0,

        broadcast: {
            available:
                level >= 3,

            network: null,

            viewers: 0,

            revenue: 0
        },

        ppv: {
            available:
                level >= 9,

            buys: 0,

            price:
                level >= 9
                    ? 79
                    : 0,

            revenue: 0
        },

        bonuses: {
            performance: 0,
            fightOfTheNight: 0,
            knockout: 0,
            submission: 0
        },

        results: [],

        generated: true,

        simulated: false,

        active: true,

        createdAt:
            new Date().toISOString(),

        completedAt: null
    };

    return event;
}

// ============================================================
// NOME DO EVENTO
// ============================================================

function generateEventName(
    organization,
    eventType
) {
    const base =
        organization?.shortName ||
        organization?.name ||
        "MMA";

    const number =
        randomInt(1, 99);

    if (eventType === "elite_event") {
        return `${base} ${number}`;
    }

    if (eventType === "international_event") {
        return `${base} International ${number}`;
    }

    if (eventType === "national_event") {
        return `${base} National ${number}`;
    }

    return `${base} Combat ${number}`;
}

// ============================================================
// DIVISÕES
// ============================================================

function getOrganizationDivisions(
    organization
) {
    if (
        Array.isArray(
            organization?.divisions
        )
    ) {
        return [
            ...organization.divisions
        ];
    }

    return [
        "flyweight",
        "bantamweight",
        "featherweight",
        "lightweight",
        "welterweight",
        "middleweight",
        "light_heavyweight",
        "heavyweight"
    ];
}

// ============================================================
// EVENT ID
// ============================================================

function generateSimulationEventId() {
    return `sim_event_${Date.now()}_${Math.floor(
        Math.random() * 1000000
    )}`;
}

// ============================================================
// EVENT IMPORTANCE
// ============================================================

function calculateGeneratedEventImportance(
    level,
    eventType
) {
    let importance =
        Number(level || 1);

    if (eventType === "elite_event") {
        importance += 5;
    } else if (
        eventType === "international_event"
    ) {
        importance += 3;
    } else if (
        eventType === "national_event"
    ) {
        importance += 2;
    }

    return importance;
}

// ============================================================
// EVENT PRESTIGE
// ============================================================

function calculateGeneratedEventPrestige(
    organization,
    level
) {
    const organizationPrestige =
        Number(
            organization?.prestige || 0
        );

    return Math.round(
        organizationPrestige * 0.7 +
        Number(level || 1) * 10
    );
}

// ============================================================
// MEDIA VALUE
// ============================================================

function calculateGeneratedMediaValue(
    organization,
    level
) {
    const media =
        Number(
            organization?.mediaLevel || 0
        );

    const popularity =
        Number(
            organization?.popularity || 0
        );

    return Math.round(
        media * 0.5 +
        popularity * 0.4 +
        Number(level || 1) * 10
    );
}

// ============================================================
// TICKET PRICE
// ============================================================

function calculateGeneratedTicketPrice(
    organization,
    level
) {
    const market =
        Number(
            organization?.marketLevel || 0
        );

    let price =
        20 +
        market * 0.35 +
        level * 5;

    if (level >= 9) {
        price += 50;
    }

    return Math.max(
        10,
        Math.round(price)
    );
}

// ============================================================
// GERAR EVENTOS DA SEMANA
// ============================================================

export function generateWeeklyWorldEvents(
    database,
    options = {}
) {
    ensureWorldSimulationState(database);

    const organizations =
        getSimulationOrganizations(
            database
        );

    if (!organizations.length) {
        return [];
    }

    const generated = [];

    const maxEvents =
        Math.min(
            Number(
                options.maxEvents ||
                WORLD_SIMULATION_CONFIG
                    .maxGeneratedEventsPerWeek
            ),
            organizations.length
        );

    const shuffled =
        shuffleArray(
            organizations
        );

    for (
        let i = 0;
        i < maxEvents;
        i++
    ) {
        if (
            !shouldOrganizationGenerateEvent(
                shuffled[i]
            )
        ) {
            continue;
        }

        const event =
            generateWorldEventForOrganization(
                database,
                shuffled[i]
            );

        if (!event) {
            continue;
        }

        addEventToDatabase(
            database,
            event
        );

        generated.push(
            clone(event)
        );
    }

    database.simulation.totalEvents +=
        generated.length;

    return generated;
}

// ============================================================
// CHANCE DE EVENTO POR ORGANIZAÇÃO
// ============================================================

function shouldOrganizationGenerateEvent(
    organization
) {
    if (!organization) {
        return false;
    }

    const level =
        getOrganizationLevel(
            organization
        );

    let chance =
        WORLD_SIMULATION_CONFIG
            .fighterActivityChance;

    if (level >= 9) {
        chance += 0.15;
    }

    if (level >= 6) {
        chance += 0.10;
    }

    return randomChance(
        Math.min(0.95, chance)
    );
}

// ============================================================
// ADICIONAR EVENTO
// ============================================================

export function addEventToDatabase(
    database,
    event
) {
    if (!database || !event) {
        return null;
    }

    if (!database.events) {
        database.events = {};
    }

    database.events[event.id] =
        clone(event);

    return clone(event);
}

// ============================================================
// SIMULAR EVENTO
// ============================================================

export function simulateWorldEvent(
    database,
    eventId
) {
    const event =
        getWorldEventFromDatabase(
            database,
            eventId
        );

    if (!event) {
        return null;
    }

    if (
        event.status === "completed" ||
        event.status === "cancelled"
    ) {
        return clone(event);
    }

    const organization =
        getFighterOrganization(
            {
                organizationId:
                    event.organizationId
            },
            database
        );

    const fightCount =
        determineFightCount(
            event
        );

    const fights = [];

    for (
        let i = 0;
        i < fightCount;
        i++
    ) {
        const matchup =
            selectTwoDifferentFighters(
                database,
                {
                    organizationId:
                        event.organizationId
                }
            );

        if (!matchup) {
            break;
        }

        const fight =
            simulateWorldFight(
                matchup.fighterA,
                matchup.fighterB
            );

        fights.push(fight);
    }

    event.fights =
        fights.map(
            fight => fight.id
        );

    event.results =
        fights.map(
            fight => clone(fight)
        );

    event.mainEvent =
        fights.length
            ? fights[fights.length - 1].id
            : null;

    event.coMainEvent =
        fights.length >= 2
            ? fights[fights.length - 2].id
            : null;

    event.status = "completed";

    event.simulated = true;

    event.completedAt =
        new Date().toISOString();

    event.expectedAttendance =
        calculateSimulatedAttendance(
            event
        );

    event.actualAttendance =
        calculateActualAttendance(
            event
        );

    event.ticketRevenue =
        calculateSimulatedTicketRevenue(
            event
        );

    event.broadcastRevenue =
        calculateSimulatedBroadcastRevenue(
            event
        );

    event.sponsorshipRevenue =
        calculateSimulatedSponsorshipRevenue(
            event,
            organization
        );

    event.ppv =
        calculateSimulatedPPV(
            event
        );

    event.totalRevenue =
        event.ticketRevenue +
        event.broadcastRevenue +
        event.sponsorshipRevenue +
        Number(
            event.ppv?.revenue || 0
        );

    event.expenses =
        calculateSimulatedExpenses(
            event,
            fights.length
        );

    event.profit =
        event.totalRevenue -
        event.expenses;

    updateEventInDatabase(
        database,
        event
    );

    database.simulation.totalFights +=
        fights.length;

    return clone(event);
}

// ============================================================
// BUSCAR EVENTO
// ============================================================

function getWorldEventFromDatabase(
    database,
    eventId
) {
    if (!database?.events) {
        return null;
    }

    const id =
        normalizeId(eventId);

    return (
        Object.values(
            database.events
        ).find(
            event =>
                normalizeId(event.id) ===
                id
        ) || null
    );
}

// ============================================================
// ATUALIZAR EVENTO
// ============================================================

function updateEventInDatabase(
    database,
    event
) {
    if (!database?.events || !event?.id) {
        return false;
    }

    database.events[event.id] =
        clone(event);

    return true;
}

// ============================================================
// QUANTIDADE DE LUTAS
// ============================================================

function determineFightCount(event) {
    if (
        event.type === "elite_event"
    ) {
        return randomInt(8, 13);
    }

    if (
        event.type === "international_event"
    ) {
        return randomInt(7, 11);
    }

    if (
        event.type === "national_event"
    ) {
        return randomInt(5, 9);
    }

    return randomInt(3, 7);
}

// ============================================================
// SIMULAÇÃO DE LUTA
// ============================================================

export function simulateWorldFight(
    fighterA,
    fighterB
) {
    const scoreA =
        calculateFighterFightScore(
            fighterA
        );

    const scoreB =
        calculateFighterFightScore(
            fighterB
        );

    const total =
        scoreA + scoreB;

    const probabilityA =
        total > 0
            ? scoreA / total
            : 0.5;

    const fighterAWins =
        Math.random() < probabilityA;

    const winner =
        fighterAWins
            ? fighterA
            : fighterB;

    const loser =
        fighterAWins
            ? fighterB
            : fighterA;

    const method =
        determineFightMethod();

    const round =
        randomInt(1, 5);

    return {
        id:
            `sim_fight_${Date.now()}_${Math.floor(
                Math.random() * 1000000
            )}`,

        fighterAId:
            fighterA?.id || null,

        fighterBId:
            fighterB?.id || null,

        winnerId:
            winner?.id || null,

        loserId:
            loser?.id || null,

        method,

        round,

        time:
            generateFightTime(),

        scoreA,
        scoreB,

        titleFight: false,

        completed: true,

        simulated: true
    };
}

// ============================================================
// SCORE DO LUTADOR
// ============================================================

function calculateFighterFightScore(
    fighter
) {
    if (!fighter) {
        return 1;
    }

    const attributes =
        fighter.attributes ||
        {};

    const values = [
        fighter.ovr,
        fighter.rating,
        attributes.striking,
        attributes.grappling,
        attributes.wrestling,
        attributes.submission,
        attributes.defense,
        attributes.cardio,
        attributes.power,
        attributes.speed
    ].filter(
        value =>
            Number.isFinite(
                Number(value)
            )
    );

    if (!values.length) {
        return 50 +
            Math.random() * 20;
    }

    const average =
        values.reduce(
            (sum, value) =>
                sum + Number(value),
            0
        ) / values.length;

    const experience =
        Number(
            fighter.experience ||
            fighter.fights ||
            0
        );

    const age =
        Number(
            fighter.age || 0
        );

    const ageModifier =
        age >= 20 && age <= 34
            ? 1.05
            : age >= 35 && age <= 38
                ? 1
                : age > 38
                    ? 0.92
                    : 0.95;

    const experienceModifier =
        1 +
        Math.min(
            0.15,
            experience * 0.005
        );

    const randomness =
        0.90 +
        Math.random() * 0.20;

    return (
        average *
        ageModifier *
        experienceModifier *
        randomness
    );
}

// ============================================================
// MÉTODO
// ============================================================

function determineFightMethod() {
    const roll =
        Math.random();

    if (roll < 0.38) {
        return "decision";
    }

    if (roll < 0.58) {
        return "ko";
    }

    if (roll < 0.78) {
        return "submission";
    }

    if (roll < 0.90) {
        return "tko";
    }

    return "doctor_stoppage";
}

// ============================================================
// TEMPO DE LUTA
// ============================================================

function generateFightTime() {
    const minutes =
        randomInt(0, 4);

    const seconds =
        randomInt(0, 59);

    return `${String(minutes).padStart(
        2,
        "0"
    )}:${String(seconds).padStart(
        2,
        "0"
    )}`;
}

// ============================================================
// PÚBLICO
// ============================================================

function calculateSimulatedAttendance(
    event
) {
    const base =
        event.type === "elite_event"
            ? 15000
            : event.type === "international_event"
                ? 8000
                : event.type === "national_event"
                    ? 4000
                    : 1500;

    const popularity =
        Number(
            event.popularity || 0
        );

    const prestige =
        Number(
            event.prestige || 0
        );

    return Math.round(
        base +
        popularity * 20 +
        prestige * 10
    );
}

function calculateActualAttendance(
    event
) {
    const expected =
        Number(
            event.expectedAttendance || 0
        );

    const variation =
        0.85 +
        Math.random() * 0.25;

    return Math.max(
        0,
        Math.round(
            expected * variation
        )
    );
}

// ============================================================
// RECEITAS
// ============================================================

function calculateSimulatedTicketRevenue(
    event
) {
    return Math.round(
        Number(
            event.actualAttendance || 0
        ) *
        Number(
            event.ticketPrice || 0
        )
    );
}

function calculateSimulatedBroadcastRevenue(
    event
) {
    if (
        !event.broadcast?.available
    ) {
        return 0;
    }

    const media =
        Number(
            event.mediaValue || 0
        );

    const popularity =
        Number(
            event.popularity || 0
        );

    return Math.round(
        media * 500 +
        popularity * 300
    );
}

function calculateSimulatedSponsorshipRevenue(
    event,
    organization
) {
    const market =
        Number(
            organization?.marketLevel || 0
        );

    return Math.round(
        Number(
            event.prestige || 0
        ) * 100 +
        market * 500
    );
}

function calculateSimulatedPPV(
    event
) {
    if (!event.ppv?.available) {
        return {
            available: false,
            buys: 0,
            price: 0,
            revenue: 0
        };
    }

    const buys =
        Math.max(
            0,
            Math.round(
                Number(
                    event.popularity || 0
                ) * 100 +
                Number(
                    event.mediaValue || 0
                ) * 75
            )
        );

    const price =
        Number(
            event.ppv.price || 79
        );

    return {
        available: true,
        buys,
        price,
        revenue:
            buys * price
    };
}

// ============================================================
// DESPESAS
// ============================================================

function calculateSimulatedExpenses(
    event,
    fightCount
) {
    const production =
        Number(
            event.prestige || 0
        ) * 50;

    const fighterCosts =
        Number(fightCount || 0) *
        500;

    const venueCosts =
        Number(
            event.actualAttendance || 0
        ) * 2;

    return Math.round(
        production +
        fighterCosts +
        venueCosts
    );
}

// ============================================================
// ATUALIZAÇÃO DOS LUTADORES
// ============================================================

export function applyFightResultToFighters(
    database,
    fight
) {
    if (!fight) {
        return false;
    }

    const fighters =
        database?.fighters || {};

    const winner =
        fighters[fight.winnerId];

    const loser =
        fighters[fight.loserId];

    if (winner) {
        applyWinnerResult(
            winner
        );
    }

    if (loser) {
        applyLoserResult(
            loser
        );
    }

    return true;
}

function applyWinnerResult(
    fighter
) {
    if (!fighter) {
        return;
    }

    if (!fighter.record) {
        fighter.record = {
            wins: 0,
            losses: 0,
            draws: 0,
            nc: 0
        };
    }

    fighter.record.wins =
        Number(
            fighter.record.wins || 0
        ) + 1;

    fighter.wins =
        Number(
            fighter.wins || 0
        ) + 1;

    fighter.fights =
        Number(
            fighter.fights || 0
        ) + 1;

    fighter.lastFightResult =
        "win";

    fighter.lastFightAt =
        new Date().toISOString();
}

function applyLoserResult(
    fighter
) {
    if (!fighter) {
        return;
    }

    if (!fighter.record) {
        fighter.record = {
            wins: 0,
            losses: 0,
            draws: 0,
            nc: 0
        };
    }

    fighter.record.losses =
        Number(
            fighter.record.losses || 0
        ) + 1;

    fighter.losses =
        Number(
            fighter.losses || 0
        ) + 1;

    fighter.fights =
        Number(
            fighter.fights || 0
        ) + 1;

    fighter.lastFightResult =
        "loss";

    fighter.lastFightAt =
        new Date().toISOString();
}

// ============================================================
// SIMULAÇÃO DE RESULTADOS
// ============================================================

export function applyEventResults(
    database,
    event
) {
    if (!event) {
        return false;
    }

    const results =
        getArray(
            event.results
        );

    results.forEach(
        fight => {
            applyFightResultToFighters(
                database,
                fight
            );
        }
    );

    return true;
}

// ============================================================
// ATUALIZAÇÃO DE RANKINGS
// ============================================================

export function simulateRankingUpdate(
    database
) {
    if (!database) {
        return null;
    }

    const fighters =
        getActiveFighters(
            database
        );

    const sorted =
        [...fighters].sort(
            (a, b) =>
                calculateFighterRankingScore(
                    b
                ) -
                calculateFighterRankingScore(
                    a
                )
        );

    if (!database.rankings) {
        database.rankings = {};
    }

    const divisions = {};

    sorted.forEach(
        fighter => {
            const division =
                fighter.division ||
                fighter.weightClass ||
                "unknown";

            if (!divisions[division]) {
                divisions[division] = [];
            }

            divisions[division].push(
                fighter.id
            );
        }
    );

    Object.entries(
        divisions
    ).forEach(
        ([division, fighterIds]) => {
            database.rankings[
                division
            ] = {
                division,
                updatedAt:
                    new Date().toISOString(),
                fighters:
                    fighterIds.slice(
                        0,
                        15
                    )
            };
        }
    );

    return clone(
        database.rankings
    );
}

// ============================================================
// SCORE DE RANKING
// ============================================================

function calculateFighterRankingScore(
    fighter
) {
    const ovr =
        Number(
            fighter?.ovr ||
            fighter?.rating ||
            50
        );

    const wins =
        Number(
            fighter?.wins ||
            fighter?.record?.wins ||
            0
        );

    const losses =
        Number(
            fighter?.losses ||
            fighter?.record?.losses ||
            0
        );

    const experience =
        Number(
            fighter?.experience ||
            fighter?.fights ||
            0
        );

    return (
        ovr * 10 +
        wins * 5 -
        losses * 2 +
        Math.min(
            experience,
            20
        )
    );
}

// ============================================================
// LESÕES
// ============================================================

export function simulateFighterHealth(
    database
) {
    const fighters =
        getActiveFighters(
            database
        );

    let injuries = 0;

    fighters.forEach(
        fighter => {
            if (
                randomChance(
                    WORLD_SIMULATION_CONFIG
                        .injuryChance
                )
            ) {
                applySimulatedInjury(
                    fighter
                );

                injuries++;
            }
        }
    );

    return injuries;
}

function applySimulatedInjury(
    fighter
) {
    if (!fighter) {
        return;
    }

    if (!fighter.health) {
        fighter.health = {};
    }

    const durations = [
        1,
        2,
        3,
        4,
        6,
        8
    ];

    const weeks =
        durations[
            randomInt(
                0,
                durations.length - 1
            )
        ];

    fighter.health.injured = true;

    fighter.health.injuryWeeks =
        weeks;

    fighter.health.status =
        "injured";
}

// ============================================================
// RECUPERAÇÃO DE LESÕES
// ============================================================

export function recoverFighters(
    database
) {
    const fighters =
        getSimulationFighters(
            database
        );

    let recovered = 0;

    fighters.forEach(
        fighter => {
            if (
                !fighter.health?.injured
            ) {
                return;
            }

            fighter.health.injuryWeeks =
                Math.max(
                    0,
                    Number(
                        fighter.health
                            .injuryWeeks ||
                        0
                    ) - 1
                );

            if (
                fighter.health.injuryWeeks <=
                0
            ) {
                fighter.health.injured =
                    false;

                fighter.health.status =
                    "healthy";

                recovered++;
            }
        }
    );

    return recovered;
}

// ============================================================
// APOSENTADORIA
// ============================================================

export function simulateRetirements(
    database
) {
    const fighters =
        getActiveFighters(
            database
        );

    let retirements = 0;

    fighters.forEach(
        fighter => {
            const age =
                Number(
                    fighter.age || 0
                );

            let chance =
                WORLD_SIMULATION_CONFIG
                    .retirementChance;

            if (age >= 38) {
                chance += 0.05;
            }

            if (age >= 40) {
                chance += 0.15;
            }

            if (age >= 42) {
                chance += 0.30;
            }

            if (
                randomChance(
                    Math.min(
                        0.80,
                        chance
                    )
                )
            ) {
                fighter.retired =
                    true;

                fighter.active =
                    false;

                fighter.status =
                    "retired";

                retirements++;
            }
        }
    );

    return retirements;
}

// ============================================================
// NOTÍCIAS
// ============================================================

export function generateWorldNews(
    database,
    event = null
) {
    if (
        !database ||
        !randomChance(
            WORLD_SIMULATION_CONFIG
                .newsChance
        )
    ) {
        return null;
    }

    if (!database.news) {
        database.news = [];
    }

    let news = null;

    if (event) {
        news =
            createEventNews(
                event
            );
    } else {
        news =
            createGenericWorldNews(
                database
            );
    }

    if (!news) {
        return null;
    }

    database.news.unshift(
        news
    );

    database.news =
        database.news.slice(
            0,
            WORLD_SIMULATION_CONFIG
                .maxStoredNews
        );

    return clone(news);
}

function createEventNews(
    event
) {
    return {
        id:
            `news_${Date.now()}_${Math.floor(
                Math.random() * 100000
            )}`,

        type:
            "event",

        title:
            `${event.name} movimenta o mundo do MMA`,

        text:
            `${event.name} foi realizado e teve ${getArray(
                event.results
            ).length} lutas simuladas.`,

        eventId:
            event.id,

        date:
            new Date().toISOString(),

        importance:
            Number(
                event.importance || 1
            )
    };
}

function createGenericWorldNews(
    database
) {
    const fighters =
        getActiveFighters(
            database
        );

    if (!fighters.length) {
        return null;
    }

    const fighter =
        fighters[
            randomInt(
                0,
                fighters.length - 1
            )
        ];

    return {
        id:
            `news_${Date.now()}_${Math.floor(
                Math.random() * 100000
            )}`,

        type:
            "world",

        title:
            "Movimentação no mundo do MMA",

        text:
            `${fighter.name || "Um lutador"} continua sua trajetória no cenário mundial.`,

        fighterId:
            fighter.id,

        date:
            new Date().toISOString(),

        importance: 1
    };
}

// ============================================================
// SHUFFLE
// ============================================================

function shuffleArray(array = []) {
    const result = [
        ...array
    ];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {
        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [
            result[i],
            result[j]
        ] = [
            result[j],
            result[i]
        ];
    }

    return result;
}

// ============================================================
// HISTÓRICO DA SIMULAÇÃO
// ============================================================

function addSimulationHistory(
    database,
    entry
) {
    ensureWorldSimulationState(
        database
    );

    database.simulation.history.push(
        {
            ...entry,
            timestamp:
                new Date().toISOString()
        }
    );

    if (
        database.simulation.history.length >
        WORLD_SIMULATION_CONFIG
            .maxStoredHistory
    ) {
        database.simulation.history =
            database.simulation.history.slice(
                -WORLD_SIMULATION_CONFIG
                    .maxStoredHistory
            );
    }
}

// ============================================================
// SIMULAR UMA SEMANA
// ============================================================

export function simulateWorldWeek(
    database,
    options = {}
) {
    ensureWorldSimulationState(
        database
    );

    const result = {
        action:
            SIMULATION_ACTIONS.WEEK,

        week:
            database.simulation.week,

        year:
            database.simulation.year,

        generatedEvents: [],

        completedEvents: [],

        fights: 0,

        injuries: 0,

        recovered: 0,

        retirements: 0,

        news: [],

        rankingsUpdated: false
    };

    // --------------------------------------------------------
    // 1. Recuperação
    // --------------------------------------------------------

    result.recovered =
        recoverFighters(
            database
        );

    // --------------------------------------------------------
    // 2. Gerar eventos
    // --------------------------------------------------------

    result.generatedEvents =
        generateWeeklyWorldEvents(
            database,
            options
        );

    // --------------------------------------------------------
    // 3. Simular eventos existentes
    // --------------------------------------------------------

    const scheduledEvents =
        getObjectValues(
            database.events || {}
        ).filter(
            event =>
                event.status ===
                "scheduled"
        );

    scheduledEvents.forEach(
        event => {
            const simulated =
                simulateWorldEvent(
                    database,
                    event.id
                );

            if (simulated) {
                result.completedEvents.push(
                    simulated
                );

                result.fights +=
                    getArray(
                        simulated.results
                    ).length;

                applyEventResults(
                    database,
                    simulated
                );

                const news =
                    generateWorldNews(
                        database,
                        simulated
                    );

                if (news) {
                    result.news.push(
                        news
                    );
                }
            }
        }
    );

    // --------------------------------------------------------
    // 4. Saúde
    // --------------------------------------------------------

    result.injuries =
        simulateFighterHealth(
            database
        );

    // --------------------------------------------------------
    // 5. Aposentadorias
    // --------------------------------------------------------

    result.retirements =
        simulateRetirements(
            database
        );

    // --------------------------------------------------------
    // 6. Rankings
    // --------------------------------------------------------

    if (
        randomChance(
            WORLD_SIMULATION_CONFIG
                .rankingUpdateChance
        )
    ) {
        simulateRankingUpdate(
            database
        );

        result.rankingsUpdated =
            true;
    }

    // --------------------------------------------------------
    // 7. Avançar semana
    // --------------------------------------------------------

    advanceSimulationWeek(
        database
    );

    database.simulation.totalWeeks++;

    database.simulation.lastSimulationAt =
        Date.now();

    addSimulationHistory(
        database,
        {
            action:
                SIMULATION_ACTIONS.WEEK,

            week:
                result.week,

            year:
                result.year,

            generatedEvents:
                result.generatedEvents.length,

            completedEvents:
                result.completedEvents.length,

            fights:
                result.fights,

            injuries:
                result.injuries,

            recovered:
                result.recovered,

            retirements:
                result.retirements
        }
    );

    return clone(result);
}

// ============================================================
// AVANÇAR SEMANA
// ============================================================

export function advanceSimulationWeek(
    database
) {
    ensureWorldSimulationState(
        database
    );

    database.simulation.week++;

    if (
        database.simulation.week > 52
    ) {
        database.simulation.week = 1;
        database.simulation.year++;
    }

    return {
        week:
            database.simulation.week,

        year:
            database.simulation.year
    };
}

// ============================================================
// SIMULAR MÊS
// ============================================================

export function simulateWorldMonth(
    database,
    options = {}
) {
    const results = [];

    for (
        let i = 0;
        i < 4;
        i++
    ) {
        results.push(
            simulateWorldWeek(
                database,
                options
            )
        );
    }

    return {
        action:
            SIMULATION_ACTIONS.MONTH,

        weeks: results,

        totalEvents:
            results.reduce(
                (sum, item) =>
                    sum +
                    item.generatedEvents.length,
                0
            ),

        totalFights:
            results.reduce(
                (sum, item) =>
                    sum + item.fights,
                0
            ),

        totalInjuries:
            results.reduce(
                (sum, item) =>
                    sum + item.injuries,
                0
            ),

        totalRetirements:
            results.reduce(
                (sum, item) =>
                    sum + item.retirements,
                0
            )
    };
}

// ============================================================
// SIMULAR ANO
// ============================================================

export function simulateWorldYear(
    database,
    options = {}
) {
    const results = [];

    for (
        let i = 0;
        i < 52;
        i++
    ) {
        results.push(
            simulateWorldWeek(
                database,
                options
            )
        );
    }

    return {
        action:
            SIMULATION_ACTIONS.YEAR,

        weeks: results,

        totalEvents:
            results.reduce(
                (sum, item) =>
                    sum +
                    item.generatedEvents.length,
                0
            ),

        totalFights:
            results.reduce(
                (sum, item) =>
                    sum + item.fights,
                0
            ),

        totalInjuries:
            results.reduce(
                (sum, item) =>
                    sum + item.injuries,
                0
            ),

        totalRetirements:
            results.reduce(
                (sum, item) =>
                    sum + item.retirements,
                0
            )
    };
}

// ============================================================
// SIMULAR VÁRIAS SEMANAS
// ============================================================

export function simulateWorldWeeks(
    database,
    weeks = 1,
    options = {}
) {
    const count =
        Math.max(
            0,
            Number(weeks || 0)
        );

    const results = [];

    for (
        let i = 0;
        i < count;
        i++
    ) {
        results.push(
            simulateWorldWeek(
                database,
                options
            )
        );
    }

    return results;
}

// ============================================================
// ESTATÍSTICAS
// ============================================================

export function getWorldSimulationStats(
    database
) {
    ensureWorldSimulationState(
        database
    );

    const fighters =
        getSimulationFighters(
            database
        );

    const activeFighters =
        getActiveFighters(
            database
        );

    const events =
        getObjectValues(
            database?.events || {}
        );

    const completedEvents =
        events.filter(
            event =>
                event.status ===
                "completed"
        );

    const scheduledEvents =
        events.filter(
            event =>
                event.status ===
                "scheduled"
        );

    const totalFights =
        events.reduce(
            (sum, event) =>
                sum +
                getArray(
                    event.results
                ).length,
            0
        );

    return {
        version:
            WORLD_SIMULATION_VERSION,

        currentWeek:
            database.simulation.week,

        currentYear:
            database.simulation.year,

        totalWeeks:
            database.simulation.totalWeeks,

        totalEvents:
            database.simulation.totalEvents,

        totalFights:
            database.simulation.totalFights ||
            totalFights,

        totalFighters:
            fighters.length,

        activeFighters:
            activeFighters.length,

        retiredFighters:
            fighters.length -
            activeFighters.length,

        totalEventsStored:
            events.length,

        completedEvents:
            completedEvents.length,

        scheduledEvents:
            scheduledEvents.length,

        injuries:
            fighters.filter(
                fighter =>
                    fighter.health?.injured
            ).length,

        lastSimulationAt:
            database.simulation
                .lastSimulationAt
    };
}

// ============================================================
// RESET
// ============================================================

export function resetWorldSimulation(
    database
) {
    if (!database) {
        return null;
    }

    database.simulation = {
        week: 1,
        year: 1,
        totalWeeks: 0,
        totalEvents: 0,
        totalFights: 0,
        lastSimulationAt: null,
        history: []
    };

    return database.simulation;
}

// ============================================================
// SNAPSHOT
// ============================================================

export function getWorldSimulationSnapshot(
    database
) {
    return {
        version:
            WORLD_SIMULATION_VERSION,

        config:
            clone(
                WORLD_SIMULATION_CONFIG
            ),

        simulation:
            clone(
                database?.simulation || {}
            ),

        world:
            getWorldSnapshot(
                database
            ),

        stats:
            getWorldSimulationStats(
                database
            )
    };
}

// ============================================================
// API
// ============================================================

export const worldSimulationAPI = {
    version:
        WORLD_SIMULATION_VERSION,

    WORLD_SIMULATION_CONFIG,

    SIMULATION_ACTIONS,

    ensureWorldSimulationState,

    getWorldSnapshot,

    getSimulationOrganizations,
    getSimulationFighters,
    getActiveFighters,

    selectRandomFighter,
    selectTwoDifferentFighters,

    getFighterOrganization,
    getOrganizationLevel,

    determineEventType,

    generateWorldEventForOrganization,
    generateWeeklyWorldEvents,

    addEventToDatabase,

    simulateWorldEvent,
    simulateWorldFight,

    applyFightResultToFighters,
    applyEventResults,

    simulateRankingUpdate,

    simulateFighterHealth,
    recoverFighters,
    simulateRetirements,

    generateWorldNews,

    simulateWorldWeek,
    simulateWorldWeeks,
    simulateWorldMonth,
    simulateWorldYear,

    advanceSimulationWeek,

    getWorldSimulationStats,
    getWorldSimulationSnapshot,

    resetWorldSimulation
};

export default worldSimulationAPI;
