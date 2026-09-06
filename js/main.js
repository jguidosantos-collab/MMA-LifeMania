/* ============================================================
   MMA LIFE DYNASTY
   MAIN GAME ENGINE
   ------------------------------------------------------------
   Responsabilidade:
   - Orquestrar todos os sistemas principais
   - Ser o dono do ciclo do jogo
   - Conectar CORE, PLAYER, MMA, CAREER, BUSINESS, LIFE e UI
   - Controlar semana / mês / ano
   - Save / Load / Reset
   - Inicialização geral
   ============================================================ */

const MAIN_VERSION = 2;

const GAME_STATUS = {
    IDLE: "idle",
    INITIALIZING: "initializing",
    READY: "ready",
    RUNNING: "running",
    PAUSED: "paused",
    ERROR: "error"
};


/* ============================================================
   ESTADO
   ============================================================ */

const mainState = {
    version: MAIN_VERSION,

    status: GAME_STATUS.IDLE,

    database: null,

    initialized: false,
    started: false,
    paused: false,

    cycles: {
        weeks: 0,
        months: 0,
        years: 0
    },

    lastCycle: {
        type: null,
        at: null
    },

    saveCount: 0,
    loadCount: 0,

    errors: [],
    warnings: [],

    initializedAt: null,
    startedAt: null
};


/* ============================================================
   REGISTRO DOS MÓDULOS
   ============================================================ */

const gameModules = {};


/* ============================================================
   UTILIDADES
   ============================================================ */

function clone(value) {
    if (value === undefined || value === null) {
        return value;
    }

    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function nowISO() {
    return new Date().toISOString();
}

function pushError(message, error = null) {
    const entry = {
        message,
        error: error
            ? String(error.message || error)
            : null,
        timestamp: nowISO()
    };

    mainState.errors.push(entry);

    if (mainState.errors.length > 100) {
        mainState.errors.shift();
    }

    console.error(
        "[MMA LIFE MAIN]",
        message,
        error || ""
    );
}

function pushWarning(message) {
    const entry = {
        message,
        timestamp: nowISO()
    };

    mainState.warnings.push(entry);

    if (mainState.warnings.length > 100) {
        mainState.warnings.shift();
    }

    console.warn(
        "[MMA LIFE MAIN]",
        message
    );
}


/* ============================================================
   GLOBAL API
   ============================================================ */

function getGlobalAPI(name) {
    if (
        typeof globalThis === "undefined" ||
        !name
    ) {
        return null;
    }

    return globalThis[name] || null;
}


/* ============================================================
   DATABASE
   ============================================================ */

function getDatabase() {
    if (mainState.database) {
        return mainState.database;
    }

    if (
        typeof globalThis !== "undefined" &&
        globalThis.MMA_LIFE_DATABASE
    ) {
        mainState.database =
            globalThis.MMA_LIFE_DATABASE;

        return mainState.database;
    }

    return null;
}

function setDatabase(database) {
    if (!database) {
        return null;
    }

    mainState.database = database;

    if (typeof globalThis !== "undefined") {
        globalThis.MMA_LIFE_DATABASE =
            database;
    }

    return database;
}


/* ============================================================
   DATABASE FALLBACK
   ============================================================ */

function createFallbackDatabase() {
    return {
        version: 1,

        meta: {
            startedAt: null,
            lastSavedAt: null,
            currentDate: null,
            currentWeek: 1,
            currentYear: 1,
            difficulty: "normal"
        },

        player: null,

        world: {
            fighters: {},
            promotions: {},
            events: {},
            rankings: {},
            champions: {},
            gyms: {},
            venues: {},
            countries: {},
            cities: {},
            news: {},
            tournaments: {}
        },

        career: {
            stage: "Amateur",
            professional: false,

            history: [],
            titles: [],
            contracts: [],

            amateur: {},
            professionalCareer: {},

            currentPromotion: null,
            currentDivision: null,
            rank: null
        },

        training: {
            energy: 100,
            fatigue: 0,
            health: 100,

            sessions: [],
            weeklyPlan: null,
            camp: null,
            recovery: {},
            weight: {}
        },

        health: {},

        business: {
            manager: null,

            sponsors: [],
            contracts: [],
            negotiations: [],
            endorsements: [],

            income: [],
            expenses: [],

            finances: {
                cash: 0,
                careerEarnings: 0,
                expenses: 0,
                assets: [],
                transactions: []
            }
        },

        media: {
            fame: 0,
            followers: 0,
            reputation: 0,

            persona: {},
            marketability: 0,
            popularity: 0,

            socialMedia: {},
            news: [],
            rivalries: [],
            controversies: [],
            awards: [],
            retirement: {}
        },

        life: {
            relationships: [],
            partner: null,
            marriage: null,

            children: [],

            family: {
                parents: [],
                siblings: [],
                children: []
            },

            education: {},
            employment: {},
            residence: {},
            vehicles: [],
            lifestyle: {},

            history: [],
            milestones: {},
            integration: {}
        },

        dynasty: {
            activeCharacterId: null,

            generations: [],
            inheritance: [],
            genealogy: [],

            heir: null,
            history: [],
            legacy: {}
        },

        promoter: {
            active: false,
            promotion: null,
            staff: [],
            events: [],
            fighters: [],
            finances: {}
        },

        calendar: {
            date: null,
            week: 1,
            month: 1,
            year: 1
        },

        history: [],
        notifications: [],

        settings: {
            language: "pt-BR",
            currency: "USD",
            difficulty: "normal",

            notifications: true,

            autosave: true,
            autosaveInterval: "month",

            compactMode: false,
            showHints: true,
            confirmActions: true,
            animations: true
        }
    };
}


/* ============================================================
   PREPARAR DATABASE
   ============================================================ */

function prepareDatabase(database) {
    const db =
        database ||
        createFallbackDatabase();

    const objects = [
        "meta",
        "world",
        "career",
        "training",
        "health",
        "business",
        "media",
        "life",
        "dynasty",
        "promoter",
        "calendar",
        "settings"
    ];

    for (const key of objects) {
        if (
            !db[key] ||
            typeof db[key] !== "object"
        ) {
            db[key] = {};
        }
    }

    if (!Array.isArray(db.history)) {
        db.history = [];
    }

    if (!Array.isArray(db.notifications)) {
        db.notifications = [];
    }

    return db;
}


/* ============================================================
   REGISTRO
   ============================================================ */

function registerModule(
    name,
    api,
    category = "other"
) {
    if (!name) {
        return false;
    }

    gameModules[name] = {
        name,
        api: api || null,
        category
    };

    return true;
}

function registerDatabase(database) {
    setDatabase(
        prepareDatabase(database)
    );

    return mainState.database;
}


/* ============================================================
   INICIALIZADOR GENÉRICO
   ============================================================ */

function initializeModule(
    name,
    api,
    database
) {
    if (!api) {
        pushWarning(
            `${name} não está disponível.`
        );

        return false;
    }

    try {
        if (
            typeof api.initialize ===
            "function"
        ) {
            api.initialize(database);
        } else if (
            typeof api.init ===
            "function"
        ) {
            api.init(database);
        }

        return true;

    } catch (error) {
        pushError(
            `Erro ao inicializar ${name}.`,
            error
        );

        return false;
    }
}


/* ============================================================
   INICIALIZAÇÃO DE GRUPO
   ============================================================ */

function initializeGroup(
    category,
    database
) {
    const modules =
        Object.values(gameModules)
            .filter(
                module =>
                    module.category === category
            );

    const results = {};

    for (const module of modules) {
        results[module.name] =
            initializeModule(
                module.name,
                module.api,
                database
            );
    }

    return results;
}


/* ============================================================
   DESCOBRIR SISTEMAS
   ============================================================ */

function discoverModules() {
    registerModule(
        "constants",
        getGlobalAPI("constantsAPI"),
        "core"
    );

    registerModule(
        "state",
        getGlobalAPI("stateAPI"),
        "core"
    );

    registerModule(
        "rng",
        getGlobalAPI("rngAPI"),
        "core"
    );

    registerModule(
        "clock",
        getGlobalAPI("clockAPI"),
        "core"
    );

    registerModule(
        "calendar",
        getGlobalAPI("calendarAPI"),
        "core"
    );

    registerModule(
        "events",
        getGlobalAPI("eventsAPI"),
        "core"
    );

    registerModule(
        "save",
        getGlobalAPI("saveAPI"),
        "core"
    );

    registerModule(
        "engine",
        getGlobalAPI("engineAPI"),
        "core"
    );


    /* PLAYER */

    registerModule(
        "identity",
        getGlobalAPI("identityAPI"),
        "player"
    );

    registerModule(
        "attributes",
        getGlobalAPI("attributesAPI"),
        "player"
    );

    registerModule(
        "potential",
        getGlobalAPI("potentialAPI"),
        "player"
    );

    registerModule(
        "genetics",
        getGlobalAPI("geneticsAPI"),
        "player"
    );

    registerModule(
        "health",
        getGlobalAPI("healthAPI"),
        "player"
    );


    /* TRAINING */

    registerModule(
        "training",
        getGlobalAPI("trainingAPI"),
        "training"
    );

    registerModule(
        "camp",
        getGlobalAPI("campAPI"),
        "training"
    );

    registerModule(
        "recovery",
        getGlobalAPI("recoveryAPI"),
        "training"
    );

    registerModule(
        "fatigue",
        getGlobalAPI("fatigueAPI"),
        "training"
    );

    registerModule(
        "weightCut",
        getGlobalAPI("weightCutAPI"),
        "training"
    );

    registerModule(
        "trainingEngine",
        getGlobalAPI("trainingEngineAPI"),
        "training"
    );


    /* MMA */

    registerModule(
        "styles",
        getGlobalAPI("stylesAPI"),
        "mma"
    );

    registerModule(
        "fighters",
        getGlobalAPI("fightersAPI"),
        "mma"
    );

    registerModule(
        "fightEngine",
        getGlobalAPI("fightEngineAPI"),
        "mma"
    );

    registerModule(
        "matchmaking",
        getGlobalAPI("matchmakingAPI"),
        "mma"
    );

    registerModule(
        "weightClasses",
        getGlobalAPI("weightClassesAPI"),
        "mma"
    );

    registerModule(
        "matchup",
        getGlobalAPI("matchupAPI"),
        "mma"
    );


    /* CAREER */

    registerModule(
        "amateur",
        getGlobalAPI("amateurAPI"),
        "career"
    );

    registerModule(
        "professional",
        getGlobalAPI("professionalAPI"),
        "career"
    );

    registerModule(
        "rankings",
        getGlobalAPI("rankingsAPI"),
        "career"
    );

    registerModule(
        "titles",
        getGlobalAPI("titlesAPI"),
        "career"
    );

    registerModule(
        "records",
        getGlobalAPI("recordsAPI"),
        "career"
    );

    registerModule(
        "careerLegacy",
        getGlobalAPI("careerLegacyAPI"),
        "career"
    );


    /* PROMOTIONS */

    registerModule(
        "promotions",
        getGlobalAPI("promotionsAPI"),
        "promotions"
    );

    registerModule(
        "contracts",
        getGlobalAPI("contractsAPI"),
        "promotions"
    );

    registerModule(
        "promotionEvents",
        getGlobalAPI("promotionEventsAPI"),
        "promotions"
    );

    registerModule(
        "divisions",
        getGlobalAPI("divisionsAPI"),
        "promotions"
    );


    /* BUSINESS */

    registerModule(
        "managers",
        getGlobalAPI("managersAPI"),
        "business"
    );

    registerModule(
        "sponsors",
        getGlobalAPI("sponsorsAPI"),
        "business"
    );

    registerModule(
        "finances",
        getGlobalAPI("financesAPI"),
        "business"
    );

    registerModule(
        "negotiations",
        getGlobalAPI("negotiationsAPI"),
        "business"
    );

    registerModule(
        "endorsements",
        getGlobalAPI("endorsementsAPI"),
        "business"
    );

    registerModule(
        "income",
        getGlobalAPI("incomeAPI"),
        "business"
    );

    registerModule(
        "expenses",
        getGlobalAPI("expensesAPI"),
        "business"
    );

    registerModule(
        "assets",
        getGlobalAPI("assetsAPI"),
        "business"
    );

    registerModule(
        "wealth",
        getGlobalAPI("wealthAPI"),
        "business"
    );

    registerModule(
        "financialEngine",
        getGlobalAPI("financialEngineAPI"),
        "business"
    );

    registerModule(
        "market",
        getGlobalAPI("marketAPI"),
        "business"
    );

    registerModule(
        "economy",
        getGlobalAPI("economyAPI"),
        "business"
    );

    registerModule(
        "economyEngine",
        getGlobalAPI("economyEngineAPI"),
        "business"
    );


    /* MEDIA */

    registerModule(
        "media",
        getGlobalAPI("mediaAPI"),
        "media"
    );

    registerModule(
        "fame",
        getGlobalAPI("fameAPI"),
        "media"
    );

    registerModule(
        "reputation",
        getGlobalAPI("reputationAPI"),
        "media"
    );

    registerModule(
        "persona",
        getGlobalAPI("personaAPI"),
        "media"
    );

    registerModule(
        "marketability",
        getGlobalAPI("marketabilityAPI"),
        "media"
    );

    registerModule(
        "popularity",
        getGlobalAPI("popularityAPI"),
        "media"
    );

    registerModule(
        "followers",
        getGlobalAPI("followersAPI"),
        "media"
    );

    registerModule(
        "socialMedia",
        getGlobalAPI("socialMediaAPI"),
        "media"
    );

    registerModule(
        "news",
        getGlobalAPI("newsAPI"),
        "media"
    );

    registerModule(
        "rivalries",
        getGlobalAPI("rivalriesAPI"),
        "media"
    );

    registerModule(
        "controversies",
        getGlobalAPI("controversiesAPI"),
        "media"
    );

    registerModule(
        "awards",
        getGlobalAPI("awardsAPI"),
        "media"
    );

    registerModule(
        "retirement",
        getGlobalAPI("retirementAPI"),
        "media"
    );

    registerModule(
        "mediaLegacy",
        getGlobalAPI("mediaLegacyAPI"),
        "media"
    );

    registerModule(
        "mediaEngine",
        getGlobalAPI("mediaEngineAPI"),
        "media"
    );


    /* WORLD */

    registerModule(
        "countries",
        getGlobalAPI("countriesAPI"),
        "world"
    );

    registerModule(
        "cities",
        getGlobalAPI("citiesAPI"),
        "world"
    );

    registerModule(
        "gyms",
        getGlobalAPI("gymsAPI"),
        "world"
    );

    registerModule(
        "venues",
        getGlobalAPI("venuesAPI"),
        "world"
    );

    registerModule(
        "organizations",
        getGlobalAPI("organizationsAPI"),
        "world"
    );

    registerModule(
        "worldEvents",
        getGlobalAPI("worldEventsAPI"),
        "world"
    );

    registerModule(
        "worldSimulation",
        getGlobalAPI("worldSimulationAPI"),
        "world"
    );

    registerModule(
        "worldEngine",
        getGlobalAPI("worldEngineAPI"),
        "world"
    );


    /* LIFE */

    registerModule(
        "relationships",
        getGlobalAPI("relationshipsAPI"),
        "life"
    );

    registerModule(
        "marriage",
        getGlobalAPI("marriageAPI"),
        "life"
    );

    registerModule(
        "children",
        getGlobalAPI("childrenAPI"),
        "life"
    );

    registerModule(
        "family",
        getGlobalAPI("familyAPI"),
        "life"
    );

    registerModule(
        "education",
        getGlobalAPI("educationAPI"),
        "life"
    );

    registerModule(
        "employment",
        getGlobalAPI("employmentAPI"),
        "life"
    );

    registerModule(
        "residence",
        getGlobalAPI("residenceAPI"),
        "life"
    );

    registerModule(
        "vehicles",
        getGlobalAPI("vehiclesAPI"),
        "life"
    );

    registerModule(
        "lifestyle",
        getGlobalAPI("lifestyleAPI"),
        "life"
    );

    registerModule(
        "lifeEngine",
        getGlobalAPI("lifeEngineAPI"),
        "life"
    );

    registerModule(
        "lifeEvents",
        getGlobalAPI("lifeEventsAPI"),
        "life"
    );

    registerModule(
        "lifeHistory",
        getGlobalAPI("lifeHistoryAPI"),
        "life"
    );

    registerModule(
        "lifeIntegration",
        getGlobalAPI("lifeIntegrationAPI"),
        "life"
    );

    registerModule(
        "lifeMilestones",
        getGlobalAPI("lifeMilestonesAPI"),
        "life"
    );


    /* DYNASTY / BRIDGE */

    registerModule(
        "lifeGameBridge",
        getGlobalAPI("lifeGameBridgeAPI"),
        "integration"
    );

    registerModule(
        "lifeBootstrap",
        getGlobalAPI("lifeBootstrapAPI"),
        "integration"
    );

    registerModule(
        "lifeController",
        getGlobalAPI("lifeControllerAPI"),
        "integration"
    );
}


/* ============================================================
   INICIALIZAÇÃO DOS SISTEMAS
   ============================================================ */

function initializeSystems(database) {
    const order = [
        "core",
        "world",
        "player",
        "mma",
        "training",
        "career",
        "promotions",
        "business",
        "media",
        "life"
    ];

    const results = {};

    for (const category of order) {
        results[category] =
            initializeGroup(
                category,
                database
            );
    }

    return results;
}


/* ============================================================
   INICIALIZAÇÃO LIFE
   ------------------------------------------------------------
   IMPORTANTE:
   O MAIN será o dono do ciclo.
   O bridge será chamado UMA vez por ciclo.
   ============================================================ */

function initializeLife(database) {
    const bridge =
        getGlobalAPI(
            "lifeGameBridgeAPI"
        );

    if (
        bridge &&
        typeof bridge.initialize ===
        "function"
    ) {
        try {
            bridge.initialize(database);
        } catch (error) {
            pushError(
                "Erro ao inicializar Life Game Bridge.",
                error
            );
        }
    }

    const bootstrap =
        getGlobalAPI(
            "lifeBootstrapAPI"
        );

    if (
        bootstrap &&
        typeof bootstrap.initialize ===
        "function"
    ) {
        try {
            bootstrap.initialize(database);
        } catch (error) {
            pushError(
                "Erro ao inicializar Life Bootstrap.",
                error
            );
        }
    }
}


/* ============================================================
   INICIALIZAÇÃO DA UI
   ============================================================ */

function initializeUI(database) {
    const bootstrap =
        getGlobalAPI(
            "uiBootstrapAPI"
        );

    if (
        bootstrap &&
        typeof bootstrap.initialize ===
        "function"
    ) {
        try {
            bootstrap.initialize(database);
        } catch (error) {
            pushError(
                "Erro ao inicializar UI Bootstrap.",
                error
            );
        }
    }

    const ui =
        getGlobalAPI("uiAPI");

    if (
        ui &&
        typeof ui.initialize ===
        "function"
    ) {
        try {
            ui.initialize(database);
        } catch (error) {
            pushWarning(
                "UI principal não pôde ser inicializada."
            );
        }
    }
}


/* ============================================================
   INICIALIZAÇÃO GERAL
   ============================================================ */

function initialize(database = null) {
    if (
        mainState.initialized &&
        mainState.database
    ) {
        return getSnapshot();
    }

    mainState.status =
        GAME_STATUS.INITIALIZING;

    try {
        discoverModules();

        const db =
            prepareDatabase(
                database ||
                getDatabase() ||
                createFallbackDatabase()
            );

        registerDatabase(db);

        if (
            !db.meta.startedAt
        ) {
            db.meta.startedAt =
                nowISO();
        }

        if (
            !db.meta.currentDate
        ) {
            db.meta.currentDate =
                nowISO();
        }

        initializeSystems(db);

        initializeLife(db);

        initializeUI(db);

        mainState.initialized = true;

        mainState.status =
            GAME_STATUS.READY;

        mainState.initializedAt =
            nowISO();

        if (
            typeof document !==
            "undefined"
        ) {
            document.dispatchEvent(
                new CustomEvent(
                    "mma-life-game-ready",
                    {
                        detail: {
                            database: db,
                            version: MAIN_VERSION
                        }
                    }
                )
            );
        }

        return getSnapshot();

    } catch (error) {
        mainState.status =
            GAME_STATUS.ERROR;

        pushError(
            "Falha geral na inicialização do jogo.",
            error
        );

        return getSnapshot();
    }
}


/* ============================================================
   START
   ============================================================ */

function start(database = null) {
    if (!mainState.initialized) {
        initialize(database);
    }

    if (
        mainState.status ===
        GAME_STATUS.ERROR
    ) {
        return false;
    }

    mainState.started = true;
    mainState.paused = false;

    mainState.status =
        GAME_STATUS.RUNNING;

    mainState.startedAt =
        mainState.startedAt ||
        nowISO();

    const uiBootstrap =
        getGlobalAPI(
            "uiBootstrapAPI"
        );

    if (
        uiBootstrap &&
        typeof uiBootstrap.start ===
        "function"
    ) {
        try {
            uiBootstrap.start(
                mainState.database
            );
        } catch (error) {
            pushWarning(
                "UI Bootstrap não conseguiu iniciar."
            );
        }
    }

    refreshUI();

    return true;
}


/* ============================================================
   PAUSE
   ============================================================ */

function pause() {
    if (!mainState.started) {
        return false;
    }

    mainState.paused = true;

    mainState.status =
        GAME_STATUS.PAUSED;

    return true;
}


/* ============================================================
   RESUME
   ============================================================ */

function resume() {
    if (!mainState.started) {
        return start();
    }

    mainState.paused = false;

    mainState.status =
        GAME_STATUS.RUNNING;

    return true;
}


/* ============================================================
   CALENDÁRIO
   ============================================================ */

function getCalendar() {
    const db = getDatabase();

    if (!db) {
        return null;
    }

    return {
        meta: clone(
            db.meta || {}
        ),

        calendar: clone(
            db.calendar || {}
        )
    };
}


/* ============================================================
   PROCESSAR SEMANA
   ------------------------------------------------------------
   UMA única chamada ao LIFE BRIDGE.
   ============================================================ */

function processWeek(context = {}) {
    const db = getDatabase();

    if (!db) {
        return false;
    }

    if (mainState.paused) {
        return false;
    }

    try {
        const engine =
            getGlobalAPI("engineAPI");

        if (
            engine &&
            typeof engine.processWeek ===
            "function"
        ) {
            engine.processWeek(
                db,
                context
            );
        } else if (
            engine &&
            typeof engine.week ===
            "function"
        ) {
            engine.week(
                db,
                context
            );
        }

        const bridge =
            getGlobalAPI(
                "lifeGameBridgeAPI"
            );

        if (
            bridge &&
            typeof bridge.processWeek ===
            "function"
        ) {
            bridge.processWeek(
                db,
                context
            );
        }

        mainState.cycles.weeks += 1;

        mainState.lastCycle = {
            type: "week",
            at: nowISO()
        };

        refreshUI();

        return true;

    } catch (error) {
        pushError(
            "Erro ao processar semana.",
            error
        );

        return false;
    }
}


/* ============================================================
   PROCESSAR MÊS
   ============================================================ */

function processMonth(context = {}) {
    const db = getDatabase();

    if (!db) {
        return false;
    }

    if (mainState.paused) {
        return false;
    }

    try {
        const engine =
            getGlobalAPI("engineAPI");

        if (
            engine &&
            typeof engine.processMonth ===
            "function"
        ) {
            engine.processMonth(
                db,
                context
            );
        } else if (
            engine &&
            typeof engine.month ===
            "function"
        ) {
            engine.month(
                db,
                context
            );
        }

        const bridge =
            getGlobalAPI(
                "lifeGameBridgeAPI"
            );

        if (
            bridge &&
            typeof bridge.processMonth ===
            "function"
        ) {
            bridge.processMonth(
                db,
                context
            );
        }

        mainState.cycles.months += 1;

        mainState.lastCycle = {
            type: "month",
            at: nowISO()
        };

        refreshUI();

        return true;

    } catch (error) {
        pushError(
            "Erro ao processar mês.",
            error
        );

        return false;
    }
}


/* ============================================================
   PROCESSAR ANO
   ============================================================ */

function processYear(context = {}) {
    const db = getDatabase();

    if (!db) {
        return false;
    }

    if (mainState.paused) {
        return false;
    }

    try {
        const engine =
            getGlobalAPI("engineAPI");

        if (
            engine &&
            typeof engine.processYear ===
            "function"
        ) {
            engine.processYear(
                db,
                context
            );
        } else if (
            engine &&
            typeof engine.year ===
            "function"
        ) {
            engine.year(
                db,
                context
            );
        }

        const bridge =
            getGlobalAPI(
                "lifeGameBridgeAPI"
            );

        if (
            bridge &&
            typeof bridge.processYear ===
            "function"
        ) {
            bridge.processYear(
                db,
                context
            );
        }

        mainState.cycles.years += 1;

        mainState.lastCycle = {
            type: "year",
            at: nowISO()
        };

        refreshUI();

        return true;

    } catch (error) {
        pushError(
            "Erro ao processar ano.",
            error
        );

        return false;
    }
}


/* ============================================================
   CICLO COMPLETO
   ============================================================ */

function processCycle(
    type = "week",
    context = {}
) {
    switch (
        String(type).toLowerCase()
    ) {
        case "week":
        case "weekly":
        case "semana":
        case "semanal":
            return processWeek(
                context
            );

        case "month":
        case "monthly":
        case "mes":
        case "mês":
        case "mensal":
            return processMonth(
                context
            );

        case "year":
        case "yearly":
        case "ano":
        case "anual":
            return processYear(
                context
            );

        default:
            pushWarning(
                `Tipo de ciclo desconhecido: ${type}`
            );

            return false;
    }
}


/* ============================================================
   EVENTOS DO JOGO
   ============================================================ */

function emitGameEvent(
    eventName,
    payload = {}
) {
    const db = getDatabase();

    const events =
        getGlobalAPI("eventsAPI");

    try {
        if (
            events &&
            typeof events.emit ===
            "function"
        ) {
            events.emit(
                eventName,
                payload,
                db
            );
        }
    } catch (error) {
        pushWarning(
            `Falha ao emitir evento ${eventName}.`
        );
    }

    const bridge =
        getGlobalAPI(
            "lifeGameBridgeAPI"
        );

    try {
        if (
            bridge &&
            typeof bridge.handleEvent ===
            "function"
        ) {
            bridge.handleEvent(
                eventName,
                payload,
                db
            );
        }
    } catch (error) {
        pushWarning(
            `Life Bridge não processou ${eventName}.`
        );
    }

    if (
        typeof document !==
        "undefined"
    ) {
        try {
            document.dispatchEvent(
                new CustomEvent(
                    `mma-life-${eventName}`,
                    {
                        detail: {
                            database: db,
                            payload
                        }
                    }
                )
            );
        } catch {
            /* Evento visual não é crítico. */
        }
    }

    return true;
}


/* ============================================================
   EVENTOS ESPECIAIS
   ============================================================ */

function onFight(
    fightResult = {}
) {
    return emitGameEvent(
        "fight-result",
        fightResult
    );
}

function onContract(
    contract = {}
) {
    return emitGameEvent(
        "contract",
        contract
    );
}

function onTitle(
    title = {}
) {
    return emitGameEvent(
        "title",
        title
    );
}

function onMarriage(
    marriage = {}
) {
    return emitGameEvent(
        "marriage",
        marriage
    );
}

function onChildBirth(
    child = {}
) {
    return emitGameEvent(
        "child-birth",
        child
    );
}

function onDeath(
    character = {}
) {
    return emitGameEvent(
        "death",
        character
    );
}


/* ============================================================
   UI
   ============================================================ */

function refreshUI() {
    const db = getDatabase();

    if (!db) {
        return false;
    }

    const uiBootstrap =
        getGlobalAPI(
            "uiBootstrapAPI"
        );

    if (
        uiBootstrap &&
        typeof uiBootstrap.refresh ===
        "function"
    ) {
        try {
            uiBootstrap.refresh(db);
        } catch {
            pushWarning(
                "Falha ao atualizar UI Bootstrap."
            );
        }
    }

    const gameUI =
        getGlobalAPI("gameUIAPI");

    if (
        gameUI &&
        typeof gameUI.refresh ===
        "function"
    ) {
        try {
            gameUI.refresh(db);
        } catch {
            pushWarning(
                "Falha ao atualizar Game UI."
            );
        }
    }

    const hud =
        getGlobalAPI("hudAPI");

    if (
        hud &&
        typeof hud.refresh ===
        "function"
    ) {
        try {
            hud.refresh(db);
        } catch {
            pushWarning(
                "Falha ao atualizar HUD."
            );
        }
    }

    return true;
}


/* ============================================================
   NAVEGAÇÃO
   ============================================================ */

function openScreen(
    screenName
) {
    const uiBootstrap =
        getGlobalAPI(
            "uiBootstrapAPI"
        );

    if (
        uiBootstrap &&
        typeof uiBootstrap.open ===
        "function"
    ) {
        return uiBootstrap.open(
            screenName,
            getDatabase()
        );
    }

    const gameUI =
        getGlobalAPI("gameUIAPI");

    if (
        gameUI &&
        typeof gameUI.navigate ===
        "function"
    ) {
        return gameUI.navigate(
            screenName,
            getDatabase()
        );
    }

    return false;
}


/* ============================================================
   SAVE
   ============================================================ */

function save() {
    const db = getDatabase();

    if (!db) {
        return false;
    }

    try {
        const saveAPI =
            getGlobalAPI("saveAPI");

        let result = false;

        if (
            saveAPI &&
            typeof saveAPI.save ===
            "function"
        ) {
            result =
                saveAPI.save(db);
        } else {
            if (
                typeof localStorage !==
                "undefined"
            ) {
                localStorage.setItem(
                    "mma-life-dynasty-save",
                    JSON.stringify(db)
                );

                result = true;
            }
        }

        if (result !== false) {
            db.meta =
                db.meta || {};

            db.meta.lastSavedAt =
                nowISO();

            mainState.saveCount += 1;
        }

        return result;

    } catch (error) {
        pushError(
            "Erro ao salvar jogo.",
            error
        );

        return false;
    }
}


/* ============================================================
   LOAD
   ============================================================ */

function load() {
    try {
        const saveAPI =
            getGlobalAPI("saveAPI");

        let loaded = null;

        if (
            saveAPI &&
            typeof saveAPI.load ===
            "function"
        ) {
            loaded =
                saveAPI.load();
        } else if (
            typeof localStorage !==
            "undefined"
        ) {
            const raw =
                localStorage.getItem(
                    "mma-life-dynasty-save"
                );

            if (raw) {
                loaded =
                    JSON.parse(raw);
            }
        }

        if (!loaded) {
            return false;
        }

        const db =
            prepareDatabase(
                loaded
            );

        setDatabase(db);

        mainState.loadCount += 1;

        refreshUI();

        if (
            typeof document !==
            "undefined"
        ) {
            document.dispatchEvent(
                new CustomEvent(
                    "mma-life-game-loaded",
                    {
                        detail: {
                            database: db
                        }
                    }
                )
            );
        }

        return db;

    } catch (error) {
        pushError(
            "Erro ao carregar jogo.",
            error
        );

        return false;
    }
}


/* ============================================================
   RESET
   ============================================================ */

function reset() {
    try {
        const db =
            createFallbackDatabase();

        setDatabase(db);

        mainState.cycles = {
            weeks: 0,
            months: 0,
            years: 0
        };

        mainState.lastCycle = {
            type: null,
            at: null
        };

        mainState.started = false;
        mainState.paused = false;

        refreshUI();

        if (
            typeof document !==
            "undefined"
        ) {
            document.dispatchEvent(
                new CustomEvent(
                    "mma-life-game-reset",
                    {
                        detail: {
                            database: db
                        }
                    }
                )
            );
        }

        return db;

    } catch (error) {
        pushError(
            "Erro ao resetar jogo.",
            error
        );

        return false;
    }
}


/* ============================================================
   GETTERS
   ============================================================ */

function getModule(name) {
    return (
        gameModules[name] ||
        null
    );
}

function getModules() {
    return {
        ...gameModules
    };
}

function getState() {
    return {
        version: MAIN_VERSION,

        status: mainState.status,

        initialized:
            mainState.initialized,

        started:
            mainState.started,

        paused:
            mainState.paused,

        cycles:
            clone(mainState.cycles),

        lastCycle:
            clone(mainState.lastCycle),

        saveCount:
            mainState.saveCount,

        loadCount:
            mainState.loadCount,

        initializedAt:
            mainState.initializedAt,

        startedAt:
            mainState.startedAt,

        errors:
            clone(mainState.errors),

        warnings:
            clone(mainState.warnings)
    };
}


/* ============================================================
   SNAPSHOT
   ============================================================ */

function getSnapshot() {
    const db = getDatabase();

    return {
        version: MAIN_VERSION,

        state: getState(),

        database: db
            ? clone(db)
            : null,

        calendar: getCalendar(),

        validation: validate()
    };
}


/* ============================================================
   VALIDAÇÃO
   ============================================================ */

function validate() {
    const errors = [];
    const warnings = [];

    const db =
        getDatabase();

    if (!db) {
        errors.push(
            "Database inexistente."
        );
    }

    if (
        !mainState.initialized
    ) {
        warnings.push(
            "Game ainda não foi inicializado."
        );
    }

    if (
        !mainState.started
    ) {
        warnings.push(
            "Game ainda não foi iniciado."
        );
    }

    const requiredSections = [
        "meta",
        "player",
        "world",
        "career",
        "training",
        "business",
        "media",
        "life",
        "dynasty"
    ];

    if (db) {
        for (
            const section
            of requiredSections
        ) {
            if (
                section !== "player" &&
                (
                    !db[section] ||
                    typeof db[section] !==
                    "object"
                )
            ) {
                warnings.push(
                    `Seção ${section} está ausente.`
                );
            }
        }
    }

    return {
        valid:
            errors.length === 0,

        errors,
        warnings
    };
}


/* ============================================================
   AUTOSAVE
   ============================================================ */

function autoSaveIfNeeded(
    type
) {
    const db = getDatabase();

    if (!db) {
        return false;
    }

    const settings =
        db.settings || {};

    if (
        settings.autosave === false
    ) {
        return false;
    }

    const interval =
        settings.autosaveInterval ||
        "month";

    if (
        interval === type
    ) {
        return save();
    }

    return false;
}


/* ============================================================
   CICLO COM AUTOSAVE
   ============================================================ */

function processWeekWithAutoSave(
    context = {}
) {
    const result =
        processWeek(context);

    return result;
}

function processMonthWithAutoSave(
    context = {}
) {
    const result =
        processMonth(context);

    if (result) {
        autoSaveIfNeeded(
            "month"
        );
    }

    return result;
}

function processYearWithAutoSave(
    context = {}
) {
    const result =
        processYear(context);

    if (result) {
        autoSaveIfNeeded(
            "year"
        );
    }

    return result;
}


/* ============================================================
   API PRINCIPAL
   ============================================================ */

const mainAPI = {
    version: MAIN_VERSION,

    GAME_STATUS,

    initialize,
    start,

    pause,
    resume,

    processWeek,
    processMonth,
    processYear,
    processCycle,

    processWeekWithAutoSave,
    processMonthWithAutoSave,
    processYearWithAutoSave,

    getCalendar,

    emitGameEvent,

    onFight,
    onContract,
    onTitle,
    onMarriage,
    onChildBirth,
    onDeath,

    refreshUI,
    openScreen,

    save,
    load,
    reset,

    getDatabase,
    setDatabase,

    registerModule,
    registerDatabase,

    getModule,
    getModules,

    getState,
    getSnapshot,
    validate,

    createFallbackDatabase
};


/* ============================================================
   EXPOSIÇÃO GLOBAL
   ============================================================ */

if (
    typeof globalThis !==
    "undefined"
) {
    globalThis.MMA_LIFE_GAME =
        mainAPI;

    globalThis.mmaLifeGame =
        mainAPI;

    globalThis.MMA_LIFE_DATABASE =
        mainState.database;

    globalThis.mainAPI =
        mainAPI;
}


/* ============================================================
   EXPORTS
   ============================================================ */

export {
    MAIN_VERSION,
    GAME_STATUS,

    mainAPI,

    initialize,
    start,

    pause,
    resume,

    processWeek,
    processMonth,
    processYear,
    processCycle,

    processWeekWithAutoSave,
    processMonthWithAutoSave,
    processYearWithAutoSave,

    getCalendar,

    emitGameEvent,

    onFight,
    onContract,
    onTitle,
    onMarriage,
    onChildBirth,
    onDeath,

    refreshUI,
    openScreen,

    save,
    load,
    reset,

    getDatabase,
    setDatabase,

    registerModule,
    registerDatabase,

    getModule,
    getModules,

    getState,
    getSnapshot,
    validate
};

export default mainAPI;


/* ============================================================
   AUTO START
   ------------------------------------------------------------
   O main.js não inicia imediatamente se outro arquivo estiver
   controlando o carregamento. Ele aguarda DOMContentLoaded.
   ============================================================ */

if (
    typeof document !==
    "undefined"
) {
    const boot = () => {
        try {
            initialize();
            start();
        } catch (error) {
            pushError(
                "Falha no auto-start do jogo.",
                error
            );
        }
    };

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            boot,
            {
                once: true
            }
        );
    } else {
        boot();
    }
}
