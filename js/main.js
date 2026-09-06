/*
============================================================
MMA LIFE DYNASTY
MAIN GAME
============================================================

MAESTRO CENTRAL DO JOGO

Responsabilidades:
- Criar o database principal
- Inicializar o CORE
- Inicializar PLAYER
- Inicializar TRAINING
- Inicializar MMA
- Inicializar CAREER
- Inicializar PROMOTIONS
- Inicializar BUSINESS
- Inicializar MEDIA
- Inicializar WORLD
- Inicializar LIFE
- Conectar LIFE Game Bridge
- Controlar semanas, meses e anos
- Encaminhar eventos do jogo
- Save / Load
- Disponibilizar API global

Arquitetura:

MAIN
 │
 ├── CORE
 │    ├── State
 │    ├── RNG
 │    ├── Clock
 │    ├── Calendar
 │    ├── Events
 │    ├── Save
 │    └── Engine
 │
 ├── PLAYER
 ├── TRAINING
 ├── MMA
 ├── CAREER
 ├── PROMOTIONS
 ├── BUSINESS
 ├── MEDIA
 ├── WORLD
 │
 └── LIFE
      └── LIFE GAME BRIDGE

IMPORTANTE:
O CORE é o dono do tempo do jogo.
O LIFE acompanha o tempo através do Game Bridge.
============================================================
*/


/* =========================================================
   CORE
========================================================= */

import * as stateAPI from "./core/state.js";
import * as rngAPI from "./core/rng.js";
import * as clockAPI from "./core/clock.js";
import * as calendarAPI from "./core/calendar.js";
import * as eventsAPI from "./core/events.js";
import * as saveAPI from "./core/save.js";
import * as engineAPI from "./core/engine.js";


/* =========================================================
   PLAYER
========================================================= */

import * as identityAPI from "./player/identity.js";
import * as attributesAPI from "./player/attributes.js";
import * as potentialAPI from "./player/potential.js";
import * as geneticsAPI from "./player/genetics.js";
import * as healthAPI from "./player/health.js";


/* =========================================================
   TRAINING
========================================================= */

import * as trainingAPI from "./training/training.js";
import * as campAPI from "./training/camp.js";
import * as recoveryAPI from "./training/recovery.js";
import * as fatigueAPI from "./training/fatigue.js";
import * as weightCutAPI from "./training/weightCut.js";
import * as trainingEngineAPI from "./training/trainingEngine.js";


/* =========================================================
   MMA
========================================================= */

import * as stylesAPI from "./mma/styles.js";
import * as fightersAPI from "./mma/fighters.js";
import * as fightEngineAPI from "./mma/fightEngine.js";
import * as matchmakingAPI from "./mma/matchmaking.js";
import * as weightClassesAPI from "./mma/weightClasses.js";
import * as matchupAPI from "./mma/matchup.js";


/* =========================================================
   CAREER
========================================================= */

import * as amateurAPI from "./career/amateur.js";
import * as professionalAPI from "./career/professional.js";
import * as rankingsAPI from "./career/rankings.js";
import * as titlesAPI from "./career/titles.js";
import * as recordsAPI from "./career/records.js";
import * as careerLegacyAPI from "./career/legacy.js";


/* =========================================================
   PROMOTIONS
========================================================= */

import * as promotionsAPI from "./promotions/promotions.js";
import * as contractsAPI from "./promotions/contracts.js";
import * as promotionEventsAPI from "./promotions/events.js";
import * as divisionsAPI from "./promotions/divisions.js";


/* =========================================================
   BUSINESS
========================================================= */

import * as managersAPI from "./business/managers.js";
import * as sponsorsAPI from "./business/sponsors.js";
import * as financesAPI from "./business/finances.js";
import * as negotiationsAPI from "./business/negotiations.js";
import * as endorsementsAPI from "./business/endorsements.js";
import * as incomeAPI from "./business/income.js";
import * as expensesAPI from "./business/expenses.js";
import * as assetsAPI from "./business/assets.js";
import * as wealthAPI from "./business/wealth.js";
import * as financialEngineAPI from "./business/financialEngine.js";
import * as marketAPI from "./business/market.js";
import * as economyAPI from "./business/economy.js";
import * as economyEngineAPI from "./business/economyEngine.js";


/* =========================================================
   MEDIA
========================================================= */

import * as mediaAPI from "./media/media.js";
import * as fameAPI from "./media/fame.js";
import * as reputationAPI from "./media/reputation.js";
import * as personaAPI from "./media/persona.js";
import * as marketabilityAPI from "./media/marketability.js";
import * as popularityAPI from "./media/popularity.js";
import * as followersAPI from "./media/followers.js";
import * as socialMediaAPI from "./media/socialMedia.js";
import * as newsAPI from "./media/news.js";
import * as rivalriesAPI from "./media/rivalries.js";
import * as controversiesAPI from "./media/controversies.js";
import * as awardsAPI from "./media/awards.js";
import * as retirementAPI from "./media/retirement.js";
import * as mediaLegacyAPI from "./media/legacy.js";
import * as mediaEngineAPI from "./media/mediaEngine.js";


/* =========================================================
   WORLD
========================================================= */

import * as countriesAPI from "./world/countries.js";
import * as citiesAPI from "./world/cities.js";
import * as gymsAPI from "./world/gyms.js";
import * as venuesAPI from "./world/venues.js";
import * as organizationsAPI from "./world/organizations.js";
import * as worldEventsAPI from "./world/events.js";
import * as worldSimulationAPI from "./world/worldSimulation.js";
import * as worldEngineAPI from "./world/worldEngine.js";


/* =========================================================
   LIFE
========================================================= */

import lifeAPI from "./life/index.js";


/* =========================================================
   CONSTANTES
========================================================= */

const MAIN_VERSION = 1;

const GAME_STATUS = {
    CREATED: "created",
    INITIALIZING: "initializing",
    READY: "ready",
    RUNNING: "running",
    PAUSED: "paused",
    GAME_OVER: "game_over",
    ERROR: "error"
};


/* =========================================================
   ESTADO DO MAIN
========================================================= */

const mainState = {

    version: MAIN_VERSION,

    status: GAME_STATUS.CREATED,

    database: null,

    initialized: false,

    started: false,

    paused: false,

    currentCycle: null,

    lastCycle: null,

    cycleCount: 0,

    lastSaveAt: null,

    lastLoadAt: null,

    errors: [],

    warnings: []

};


/* =========================================================
   REGISTRO CENTRAL DOS MÓDULOS
========================================================= */

const gameModules = {

    /* CORE */

    core: {
        state: stateAPI,
        rng: rngAPI,
        clock: clockAPI,
        calendar: calendarAPI,
        events: eventsAPI,
        save: saveAPI,
        engine: engineAPI
    },


    /* PLAYER */

    player: {
        identity: identityAPI,
        attributes: attributesAPI,
        potential: potentialAPI,
        genetics: geneticsAPI,
        health: healthAPI
    },


    /* TRAINING */

    training: {
        training: trainingAPI,
        camp: campAPI,
        recovery: recoveryAPI,
        fatigue: fatigueAPI,
        weightCut: weightCutAPI,
        engine: trainingEngineAPI
    },


    /* MMA */

    mma: {
        styles: stylesAPI,
        fighters: fightersAPI,
        fightEngine: fightEngineAPI,
        matchmaking: matchmakingAPI,
        weightClasses: weightClassesAPI,
        matchup: matchupAPI
    },


    /* CAREER */

    career: {
        amateur: amateurAPI,
        professional: professionalAPI,
        rankings: rankingsAPI,
        titles: titlesAPI,
        records: recordsAPI,
        legacy: careerLegacyAPI
    },


    /* PROMOTIONS */

    promotions: {
        promotions: promotionsAPI,
        contracts: contractsAPI,
        events: promotionEventsAPI,
        divisions: divisionsAPI
    },


    /* BUSINESS */

    business: {
        managers: managersAPI,
        sponsors: sponsorsAPI,
        finances: financesAPI,
        negotiations: negotiationsAPI,
        endorsements: endorsementsAPI,
        income: incomeAPI,
        expenses: expensesAPI,
        assets: assetsAPI,
        wealth: wealthAPI,
        financialEngine: financialEngineAPI,
        market: marketAPI,
        economy: economyAPI,
        economyEngine: economyEngineAPI
    },


    /* MEDIA */

    media: {
        media: mediaAPI,
        fame: fameAPI,
        reputation: reputationAPI,
        persona: personaAPI,
        marketability: marketabilityAPI,
        popularity: popularityAPI,
        followers: followersAPI,
        socialMedia: socialMediaAPI,
        news: newsAPI,
        rivalries: rivalriesAPI,
        controversies: controversiesAPI,
        awards: awardsAPI,
        retirement: retirementAPI,
        legacy: mediaLegacyAPI,
        engine: mediaEngineAPI
    },


    /* WORLD */

    world: {
        countries: countriesAPI,
        cities: citiesAPI,
        gyms: gymsAPI,
        venues: venuesAPI,
        organizations: organizationsAPI,
        events: worldEventsAPI,
        simulation: worldSimulationAPI,
        engine: worldEngineAPI
    },


    /* LIFE */

    life: lifeAPI

};


/* =========================================================
   UTILITÁRIOS
========================================================= */

function isObject(value) {

    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );

}


function clone(value) {

    if (
        value === undefined ||
        value === null
    ) {

        return value;

    }

    try {

        return JSON.parse(
            JSON.stringify(value)
        );

    } catch {

        return value;

    }

}


function ensureObject(
    parent,
    key,
    fallback = {}
) {

    if (
        !parent[key] ||
        !isObject(parent[key])
    ) {

        parent[key] = fallback;

    }

    return parent[key];

}


function now() {

    return Date.now();

}


/* =========================================================
   LOG DE ERROS
========================================================= */

function addError(
    message,
    module = "main",
    error = null
) {

    const entry = {

        module,

        message: String(message),

        error:
            error?.message ||
            null,

        timestamp: now()

    };

    mainState.errors.push(
        entry
    );

    if (
        mainState.errors.length > 50
    ) {

        mainState.errors.shift();

    }

    return entry;

}


/* =========================================================
   LOG DE AVISOS
========================================================= */

function addWarning(
    message,
    module = "main"
) {

    const entry = {

        module,

        message: String(message),

        timestamp: now()

    };

    mainState.warnings.push(
        entry
    );

    if (
        mainState.warnings.length > 50
    ) {

        mainState.warnings.shift();

    }

    return entry;

}


/* =========================================================
   PREPARAR DATABASE
========================================================= */

function prepareDatabase(
    database
) {

    if (
        !database ||
        !isObject(database)
    ) {

        return null;

    }


    /* =====================================================
       META
    ===================================================== */

    const meta =
        ensureObject(
            database,
            "meta",
            {}
        );

    meta.gameVersion =
        MAIN_VERSION;

    if (
        !meta.startedAt
    ) {

        meta.startedAt =
            new Date().toISOString();

    }


    /* =====================================================
       WORLD
    ===================================================== */

    const world =
        ensureObject(
            database,
            "world",
            {}
        );

    ensureObject(
        world,
        "fighters",
        {}
    );

    ensureObject(
        world,
        "promotions",
        {}
    );

    ensureObject(
        world,
        "events",
        {}
    );

    ensureObject(
        world,
        "rankings",
        {}
    );

    ensureObject(
        world,
        "champions",
        {}
    );

    ensureObject(
        world,
        "gyms",
        {}
    );

    ensureObject(
        world,
        "venues",
        {}
    );

    ensureObject(
        world,
        "countries",
        {}
    );

    ensureObject(
        world,
        "cities",
        {}
    );


    /* =====================================================
       PLAYER
    ===================================================== */

    ensureObject(
        database,
        "player",
        {}
    );


    /* =====================================================
       CAREER
    ===================================================== */

    const career =
        ensureObject(
            database,
            "career",
            {}
        );

    if (
        !career.stage
    ) {

        career.stage =
            "Amateur";

    }


    if (
        career.professional ===
        undefined
    ) {

        career.professional =
            false;

    }


    /* =====================================================
       TRAINING
    ===================================================== */

    const training =
        ensureObject(
            database,
            "training",
            {}
        );

    if (
        training.energy ===
        undefined
    ) {

        training.energy = 100;

    }


    if (
        training.fatigue ===
        undefined
    ) {

        training.fatigue = 0;

    }


    /* =====================================================
       BUSINESS
    ===================================================== */

    const business =
        ensureObject(
            database,
            "business",
            {}
        );

    ensureObject(
        business,
        "finances",
        {
            cash: 0,
            careerEarnings: 0,
            expenses: 0,
            assets: []
        }
    );


    /* =====================================================
       MEDIA
    ===================================================== */

    const media =
        ensureObject(
            database,
            "media",
            {}
        );

    if (
        media.fame ===
        undefined
    ) {

        media.fame = 0;

    }

    if (
        media.followers ===
        undefined
    ) {

        media.followers = 0;

    }

    if (
        media.reputation ===
        undefined
    ) {

        media.reputation = 0;

    }


    /* =====================================================
       CALENDAR
    ===================================================== */

    ensureObject(
        database,
        "calendar",
        {}
    );


    /* =====================================================
       HISTORY
    ===================================================== */

    ensureObject(
        database,
        "history",
        []
    );


    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

    if (
        !Array.isArray(
            database.notifications
        )
    ) {

        database.notifications =
            [];

    }


    /* =====================================================
       LIFE
    ===================================================== */

    if (
        lifeAPI &&
        typeof lifeAPI.prepareDatabase ===
            "function"
    ) {

        try {

            lifeAPI.prepareDatabase(
                database
            );

        } catch (error) {

            addError(
                "Falha ao preparar o database do LIFE.",
                "life",
                error
            );

        }

    }


    return database;

}


/* =========================================================
   CRIAR DATABASE
========================================================= */

function createDatabase() {

    let database = null;


    /*
    ---------------------------------------------------------
    Tenta usar o sistema oficial de STATE.
    ---------------------------------------------------------
    */

    try {

        if (
            typeof stateAPI.createEmptyGameState ===
                "function"
        ) {

            database =
                stateAPI.createEmptyGameState();

        } else if (
            typeof stateAPI.createInitialState ===
                "function"
        ) {

            database =
                stateAPI.createInitialState();

        } else if (
            typeof stateAPI.createState ===
                "function"
        ) {

            database =
                stateAPI.createState();

        }

    } catch (error) {

        addError(
            "Erro ao criar o estado inicial através do CORE.",
            "core.state",
            error
        );

    }


    /*
    ---------------------------------------------------------
    Fallback
    ---------------------------------------------------------
    */

    if (
        !database
    ) {

        database = {

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

            world: {},

            career: {},

            training: {},

            health: {},

            business: {},

            life: {},

            dynasty: {},

            media: {},

            promoter: {},

            calendar: {},

            history: [],

            notifications: [],

            settings: {

                language: "pt-BR",

                currency: "BRL"

            }

        };

    }


    return prepareDatabase(
        database
    );

}


/* =========================================================
   REGISTRAR DATABASE NOS MÓDULOS
========================================================= */

function registerDatabase(
    database
) {

    if (
        !database
    ) {

        return false;

    }


    mainState.database =
        database;


    /*
    ---------------------------------------------------------
    CORE STATE
    ---------------------------------------------------------
    */

    const stateMethods = [
        "setDatabase",
        "setState",
        "setGameState"
    ];


    for (
        const method
        of stateMethods
    ) {

        if (
            typeof stateAPI[method] ===
                "function"
        ) {

            try {

                stateAPI[method](
                    database
                );

                break;

            } catch {

                /* tenta próximo método */

            }

        }

    }


    /*
    ---------------------------------------------------------
    LIFE
    ---------------------------------------------------------
    */

    try {

        if (
            lifeAPI &&
            typeof lifeAPI.setDatabase ===
                "function"
        ) {

            lifeAPI.setDatabase(
                database
            );

        }

    } catch (error) {

        addError(
            "Não foi possível conectar o LIFE ao database.",
            "life",
            error
        );

    }


    /*
    ---------------------------------------------------------
    APIs GLOBAIS
    ---------------------------------------------------------
    */

    if (
        typeof globalThis !==
        "undefined"
    ) {

        globalThis.MMA_LIFE_DATABASE =
            database;

        globalThis.MMA_LIFE_GAME =
            mainAPI;

    }


    return true;

}


/* =========================================================
   CHAMAR INITIALIZER
========================================================= */

function initializeModule(
    module,
    database,
    options = {}
) {

    if (
        !module
    ) {

        return {

            success: false,

            reason:
                "module_missing"

        };

    }


    const methods = [

        "initialize",

        "init",

        "setup"

    ];


    for (
        const method
        of methods
    ) {

        if (
            typeof module[method] ===
                "function"
        ) {

            try {

                const result =
                    module[method](
                        database,
                        options
                    );

                return {

                    success: true,

                    method,

                    result

                };

            } catch (error) {

                return {

                    success: false,

                    method,

                    error

                };

            }

        }

    }


    /*
    ---------------------------------------------------------
    Alguns módulos são apenas bancos de dados/API e não
    precisam de inicialização.
    ---------------------------------------------------------
    */

    return {

        success: true,

        skipped: true,

        reason:
            "no_initializer"

    };

}


/* =========================================================
   INICIALIZAR GRUPO
========================================================= */

function initializeGroup(
    groupName,
    group,
    database,
    options = {}
) {

    const results = {};


    if (
        !group
    ) {

        return results;

    }


    for (
        const [
            moduleName,
            module
        ]
        of Object.entries(group)
    ) {

        const result =
            initializeModule(
                module,
                database,
                options
            );


        results[moduleName] =
            result;


        if (
            !result.success
        ) {

            addWarning(
                `Falha ao inicializar ${groupName}.${moduleName}.`,
                groupName
            );

        }

    }


    return results;

}


/* =========================================================
   INICIALIZAR CORE
========================================================= */

function initializeCore(
    database,
    options = {}
) {

    return initializeGroup(
        "core",
        gameModules.core,
        database,
        options
    );

}


/* =========================================================
   INICIALIZAR PLAYER
========================================================= */

function initializePlayer(
    database,
    options = {}
) {

    return initializeGroup(
        "player",
        gameModules.player,
        database,
        options
    );

}


/* =========================================================
   INICIALIZAR TRAINING
========================================================= */

function initializeTraining(
    database,
    options = {}
) {

    return initializeGroup(
        "training",
        gameModules.training,
        database,
        options
    );

}


/* =========================================================
   INICIALIZAR MMA
========================================================= */

function initializeMMA(
    database,
    options = {}
) {

    return initializeGroup(
        "mma",
        gameModules.mma,
        database,
        options
    );

}


/* =========================================================
   INICIALIZAR CAREER
========================================================= */

function initializeCareer(
    database,
    options = {}
) {

    return initializeGroup(
        "career",
        gameModules.career,
        database,
        options
    );

}


/* =========================================================
   INICIALIZAR PROMOTIONS
========================================================= */

function initializePromotions(
    database,
    options = {}
) {

    return initializeGroup(
        "promotions",
        gameModules.promotions,
        database,
        options
    );

}


/* =========================================================
   INICIALIZAR BUSINESS
========================================================= */

function initializeBusiness(
    database,
    options = {}
) {

    return initializeGroup(
        "business",
        gameModules.business,
        database,
        options
    );

}


/* =========================================================
   INICIALIZAR MEDIA
========================================================= */

function initializeMedia(
    database,
    options = {}
) {

    return initializeGroup(
        "media",
        gameModules.media,
        database,
        options
    );

}


/* =========================================================
   INICIALIZAR WORLD
========================================================= */

function initializeWorld(
    database,
    options = {}
) {

    return initializeGroup(
        "world",
        gameModules.world,
        database,
        options
    );

}


/* =========================================================
   INICIALIZAR LIFE
========================================================= */

function initializeLife(
    database,
    options = {}
) {

    if (
        !lifeAPI
    ) {

        return {

            success: false,

            reason:
                "life_api_missing"

        };

    }


    try {

        if (
            typeof lifeAPI.initialize ===
                "function"
        ) {

            return lifeAPI.initialize(
                database,
                {

                    ...options,

                    initializeGameBridge:
                        true,

                    initializeBootstrap:
                        true

                }
            );

        }

    } catch (error) {

        addError(
            "Erro ao inicializar LIFE.",
            "life",
            error
        );

        return {

            success: false,

            error

        };

    }


    return {

        success: false,

        reason:
            "life_initialize_missing"

    };

}


/* =========================================================
   INICIALIZAÇÃO COMPLETA
========================================================= */

function initialize(
    options = {}
) {

    if (
        mainState.initialized &&
        !options.force
    ) {

        return {

            success: true,

            alreadyInitialized: true,

            state:
                getState()

        };

    }


    mainState.status =
        GAME_STATUS.INITIALIZING;


    mainState.errors = [];

    mainState.warnings = [];


    /*
    ---------------------------------------------------------
    DATABASE
    ---------------------------------------------------------
    */

    const database =
        options.database ||
        createDatabase();


    if (
        !database
    ) {

        mainState.status =
            GAME_STATUS.ERROR;


        addError(
            "Não foi possível criar o database principal."
        );


        return {

            success: false,

            state:
                getState()

        };

    }


    registerDatabase(
        database
    );


    const results = {};


    /*
    ---------------------------------------------------------
    ORDEM DEFINITIVA
    ---------------------------------------------------------

    CORE
       ↓
    WORLD
       ↓
    PLAYER
       ↓
    MMA
       ↓
    TRAINING
       ↓
    CAREER
       ↓
    PROMOTIONS
       ↓
    BUSINESS
       ↓
    MEDIA
       ↓
    LIFE
    ---------------------------------------------------------
    */


    results.core =
        initializeCore(
            database,
            options
        );


    results.world =
        initializeWorld(
            database,
            options
        );


    results.player =
        initializePlayer(
            database,
            options
        );


    results.mma =
        initializeMMA(
            database,
            options
        );


    results.training =
        initializeTraining(
            database,
            options
        );


    results.career =
        initializeCareer(
            database,
            options
        );


    results.promotions =
        initializePromotions(
            database,
            options
        );


    results.business =
        initializeBusiness(
            database,
            options
        );


    results.media =
        initializeMedia(
            database,
            options
        );


    results.life =
        initializeLife(
            database,
            options
        );


    /*
    ---------------------------------------------------------
    STATUS
    ---------------------------------------------------------
    */

    mainState.initialized =
        true;

    mainState.started =
        false;

    mainState.paused =
        false;

    mainState.status =
        GAME_STATUS.READY;


    /*
    ---------------------------------------------------------
    GLOBAL
    ---------------------------------------------------------
    */

    registerDatabase(
        database
    );


    /*
    ---------------------------------------------------------
    EVENTO GLOBAL DE JOGO PRONTO
    ---------------------------------------------------------
    */

    emitGameEvent(
        {
            type:
                "game_initialized",

            category:
                "system",

            database

        },
        {
            silent: true
        }
    );


    return {

        success: true,

        initialized: true,

        database,

        results,

        state:
            getState()

    };

}


/* =========================================================
   INICIAR PARTIDA
========================================================= */

function startGame(
    options = {}
) {

    if (
        !mainState.initialized
    ) {

        const result =
            initialize(
                options
            );


        if (
            !result.success
        ) {

            return result;

        }

    }


    mainState.started =
        true;

    mainState.paused =
        false;

    mainState.status =
        GAME_STATUS.RUNNING;


    /*
    ---------------------------------------------------------
    Primeiro processamento opcional
    ---------------------------------------------------------
    */

    if (
        options.processInitialWeek
    ) {

        processWeek({
            source:
                "game_start"
        });

    }


    emitGameEvent(
        {
            type:
                "game_started",

            category:
                "system"

        }
    );


    return {

        success: true,

        state:
            getState()

    };

}


/* =========================================================
   PAUSAR
========================================================= */

function pauseGame() {

    if (
        !mainState.started
    ) {

        return {

            success: false,

            reason:
                "game_not_started"

        };

    }


    mainState.paused =
        true;

    mainState.status =
        GAME_STATUS.PAUSED;


    return {

        success: true,

        state:
            getState()

    };

}


/* =========================================================
   RETOMAR
========================================================= */

function resumeGame() {

    if (
        !mainState.initialized
    ) {

        return {

            success: false,

            reason:
                "game_not_initialized"

        };

    }


    mainState.paused =
        false;

    mainState.started =
        true;

    mainState.status =
        GAME_STATUS.RUNNING;


    return {

        success: true,

        state:
            getState()

    };

}


/* =========================================================
   TEMPO — HELPERS
========================================================= */

function getCalendar() {

    if (
        mainState.database?.calendar
    ) {

        return mainState.database.calendar;

    }


    return null;

}


function getCurrentWeek() {

    const calendar =
        getCalendar();


    if (
        calendar?.week !==
        undefined
    ) {

        return calendar.week;

    }


    if (
        mainState.database?.meta
            ?.currentWeek !==
        undefined
    ) {

        return mainState.database.meta.currentWeek;

    }


    return 1;

}


function getCurrentMonth() {

    const calendar =
        getCalendar();


    if (
        calendar?.month !==
        undefined
    ) {

        return calendar.month;

    }


    return 1;

}


function getCurrentYear() {

    const calendar =
        getCalendar();


    if (
        calendar?.year !==
        undefined
    ) {

        return calendar.year;

    }


    if (
        mainState.database?.meta
            ?.currentYear !==
        undefined
    ) {

        return mainState.database.meta.currentYear;

    }


    return 1;

}


/* =========================================================
   PROCESSAR SEMANA
========================================================= */

function processWeek(
    options = {}
) {

    if (
        !mainState.initialized
    ) {

        return {

            success: false,

            reason:
                "game_not_initialized"

        };

    }


    if (
        mainState.paused &&
        !options.force
    ) {

        return {

            success: false,

            reason:
                "game_paused"

        };

    }


    mainState.currentCycle =
        "week";


    let result = null;


    try {

        /*
        -----------------------------------------------------
        O CORE continua sendo responsável pelo avanço do
        tempo.
        -----------------------------------------------------
        */

        if (
            typeof engineAPI.processWeek ===
                "function"
        ) {

            result =
                engineAPI.processWeek(
                    mainState.database,
                    options
                );

        } else if (
            typeof engineAPI.advanceWeek ===
                "function"
        ) {

            result =
                engineAPI.advanceWeek(
                    mainState.database,
                    options
                );

        }


    } catch (error) {

        addError(
            "Erro no processamento da semana pelo CORE.",
            "core.engine",
            error
        );

    }


    /*
    ---------------------------------------------------------
    LIFE acompanha a semana através do Bridge.
    ---------------------------------------------------------
    */

    let lifeResult =
        null;


    try {

        if (
            lifeAPI &&
            typeof lifeAPI.processWeek ===
                "function"
        ) {

            lifeResult =
                lifeAPI.processWeek({
                    ...options,

                    source:
                        "main.processWeek",

                    database:
                        mainState.database

                });

        }

    } catch (error) {

        addError(
            "Erro no processamento semanal do LIFE.",
            "life",
            error
        );

    }


    /*
    ---------------------------------------------------------
    WORLD
    ---------------------------------------------------------
    */

    let worldResult =
        null;


    try {

        if (
            typeof worldEngineAPI.simulateWeek ===
                "function"
        ) {

            worldResult =
                worldEngineAPI.simulateWeek(
                    mainState.database,
                    options
                );

        } else if (
            typeof worldSimulationAPI.simulateWeek ===
                "function"
        ) {

            worldResult =
                worldSimulationAPI.simulateWeek(
                    mainState.database,
                    options
                );

        }

    } catch (error) {

        addWarning(
            "Simulação semanal do WORLD apresentou uma falha.",
            "world"
        );

    }


    mainState.lastCycle =
        "week";

    mainState.cycleCount +=
        1;


    emitGameEvent(
        {
            type:
                "week_processed",

            category:
                "calendar",

            week:
                getCurrentWeek(),

            month:
                getCurrentMonth(),

            year:
                getCurrentYear()

        },
        {
            silent:
                options.silentEvents
        }
    );


    return {

        success: true,

        type:
            "week",

        core:
            result,

        life:
            lifeResult,

        world:
            worldResult,

        calendar:
            clone(
                getCalendar()
            ),

        state:
            getState()

    };

}


/* =========================================================
   PROCESSAR MÊS
========================================================= */

function processMonth(
    options = {}
) {

    if (
        !mainState.initialized
    ) {

        return {

            success: false,

            reason:
                "game_not_initialized"

        };

    }


    mainState.currentCycle =
        "month";


    let result =
        null;


    try {

        if (
            typeof engineAPI.processMonth ===
                "function"
        ) {

            result =
                engineAPI.processMonth(
                    mainState.database,
                    options
                );

        } else if (
            typeof engineAPI.advanceMonth ===
                "function"
        ) {

            result =
                engineAPI.advanceMonth(
                    mainState.database,
                    options
                );

        }

    } catch (error) {

        addError(
            "Erro no processamento mensal do CORE.",
            "core.engine",
            error
        );

    }


    let lifeResult =
        null;


    try {

        if (
            typeof lifeAPI.processMonth ===
                "function"
        ) {

            lifeResult =
                lifeAPI.processMonth({
                    ...options,

                    source:
                        "main.processMonth",

                    database:
                        mainState.database

                });

        }

    } catch (error) {

        addError(
            "Erro no processamento mensal do LIFE.",
            "life",
            error
        );

    }


    mainState.lastCycle =
        "month";

    mainState.cycleCount +=
        1;


    emitGameEvent(
        {
            type:
                "month_processed",

            category:
                "calendar",

            month:
                getCurrentMonth(),

            year:
                getCurrentYear()

        },
        {
            silent:
                options.silentEvents
        }
    );


    return {

        success: true,

        type:
            "month",

        core:
            result,

        life:
            lifeResult,

        calendar:
            clone(
                getCalendar()
            ),

        state:
            getState()

    };

}


/* =========================================================
   PROCESSAR ANO
========================================================= */

function processYear(
    options = {}
) {

    if (
        !mainState.initialized
    ) {

        return {

            success: false,

            reason:
                "game_not_initialized"

        };

    }


    mainState.currentCycle =
        "year";


    let result =
        null;


    try {

        if (
            typeof engineAPI.processYear ===
                "function"
        ) {

            result =
                engineAPI.processYear(
                    mainState.database,
                    options
                );

        } else if (
            typeof engineAPI.advanceYear ===
                "function"
        ) {

            result =
                engineAPI.advanceYear(
                    mainState.database,
                    options
                );

        }

    } catch (error) {

        addError(
            "Erro no processamento anual do CORE.",
            "core.engine",
            error
        );

    }


    let lifeResult =
        null;


    try {

        if (
            typeof lifeAPI.processYear ===
                "function"
        ) {

            lifeResult =
                lifeAPI.processYear({
                    ...options,

                    source:
                        "main.processYear",

                    database:
                        mainState.database

                });

        }

    } catch (error) {

        addError(
            "Erro no processamento anual do LIFE.",
            "life",
            error
        );

    }


    mainState.lastCycle =
        "year";

    mainState.cycleCount +=
        1;


    emitGameEvent(
        {
            type:
                "year_processed",

            category:
                "calendar",

            year:
                getCurrentYear()

        },
        {
            silent:
                options.silentEvents
        }
    );


    return {

        success: true,

        type:
            "year",

        core:
            result,

        life:
            lifeResult,

        calendar:
            clone(
                getCalendar()
            ),

        state:
            getState()

    };

}


/* =========================================================
   PROCESSAR CICLO
========================================================= */

function processCycle(
    type,
    options = {}
) {

    const normalized =
        String(
            type || ""
        )
            .toLowerCase()
            .trim();


    switch (
        normalized
    ) {

        case "week":
        case "weekly":
        case "semana":
        case "semanal":

            return processWeek(
                options
            );


        case "month":
        case "monthly":
        case "mes":
        case "mês":
        case "mensal":

            return processMonth(
                options
            );


        case "year":
        case "yearly":
        case "ano":
        case "anual":

            return processYear(
                options
            );


        default:

            return {

                success: false,

                reason:
                    "unknown_cycle",

                type

            };

    }

}


/* =========================================================
   EVENTOS DO JOGO
========================================================= */

function emitGameEvent(
    event,
    options = {}
) {

    if (
        !event ||
        !isObject(event)
    ) {

        return {

            success: false,

            reason:
                "invalid_event"

        };

    }


    const normalizedEvent = {

        ...clone(event),

        timestamp:
            event.timestamp ||
            new Date().toISOString()

    };


    /*
    ---------------------------------------------------------
    CORE EVENTS
    ---------------------------------------------------------
    */

    try {

        if (
            typeof eventsAPI.emit ===
                "function"
        ) {

            eventsAPI.emit(
                mainState.database,
                normalizedEvent
            );

        } else if (
            typeof eventsAPI.emitEvent ===
                "function"
        ) {

            eventsAPI.emitEvent(
                mainState.database,
                normalizedEvent
            );

        } else if (
            typeof eventsAPI.record ===
                "function"
        ) {

            eventsAPI.record(
                mainState.database,
                normalizedEvent
            );

        }

    } catch (error) {

        if (
            !options.silent
        ) {

            addWarning(
                "CORE não conseguiu registrar um evento.",
                "core.events"
            );

        }

    }


    /*
    ---------------------------------------------------------
    LIFE GAME BRIDGE
    ---------------------------------------------------------
    */

    let lifeResult =
        null;


    try {

        if (
            lifeAPI &&
            typeof lifeAPI.onGameEvent ===
                "function"
        ) {

            lifeResult =
                lifeAPI.onGameEvent(
                    normalizedEvent,
                    {
                        database:
                            mainState.database
                    }
                );

        }

    } catch (error) {

        addWarning(
            "LIFE não conseguiu receber um evento do jogo.",
            "life"
        );

    }


    /*
    ---------------------------------------------------------
    GLOBAL LISTENERS
    ---------------------------------------------------------
    */

    if (
        typeof globalThis !==
        "undefined" &&
        typeof globalThis.dispatchEvent ===
            "function" &&
        typeof CustomEvent !==
            "undefined"
    ) {

        try {

            globalThis.dispatchEvent(
                new CustomEvent(
                    "mma-life-game-event",
                    {
                        detail:
                            normalizedEvent
                    }
                )
            );

        } catch {

            /* navegador sem suporte */

        }

    }


    return {

        success: true,

        event:
            normalizedEvent,

        life:
            lifeResult

    };

}


/* =========================================================
   EVENTOS ESPECÍFICOS
========================================================= */

function onFight(
    fight,
    options = {}
) {

    let result =
        null;


    try {

        if (
            typeof lifeAPI.onFight ===
                "function"
        ) {

            result =
                lifeAPI.onFight(
                    fight,
                    options
                );

        }

    } catch (error) {

        addWarning(
            "Erro ao enviar luta para o LIFE.",
            "life"
        );

    }


    emitGameEvent(
        {
            type:
                "fight",

            category:
                "mma",

            ...clone(fight)

        },
        {
            silent:
                options.silent
        }
    );


    return {

        success: true,

        life:
            result

    };

}


/* =========================================================
   CONTRATO
========================================================= */

function onContract(
    contract,
    options = {}
) {

    let result =
        null;


    try {

        if (
            typeof lifeAPI.onContract ===
                "function"
        ) {

            result =
                lifeAPI.onContract(
                    contract,
                    options
                );

        }

    } catch {

        addWarning(
            "Erro ao enviar contrato para o LIFE.",
            "life"
        );

    }


    emitGameEvent(
        {
            type:
                "contract",

            category:
                "career",

            ...clone(contract)

        },
        {
            silent:
                options.silent
        }
    );


    return {

        success: true,

        life:
            result

    };

}


/* =========================================================
   TÍTULO
========================================================= */

function onTitle(
    title,
    options = {}
) {

    let result =
        null;


    try {

        if (
            typeof lifeAPI.onTitle ===
                "function"
        ) {

            result =
                lifeAPI.onTitle(
                    title,
                    options
                );

        }

    } catch {

        addWarning(
            "Erro ao enviar título para o LIFE.",
            "life"
        );

    }


    emitGameEvent(
        {
            type:
                "title",

            category:
                "career",

            ...clone(title)

        },
        {
            silent:
                options.silent
        }
    );


    return {

        success: true,

        life:
            result

    };

}


/* =========================================================
   CASAMENTO
========================================================= */

function onMarriage(
    marriage,
    options = {}
) {

    let result =
        null;


    try {

        if (
            typeof lifeAPI.onMarriage ===
                "function"
        ) {

            result =
                lifeAPI.onMarriage(
                    marriage,
                    options
                );

        }

    } catch {

        addWarning(
            "Erro ao enviar casamento para o LIFE.",
            "life"
        );

    }


    emitGameEvent(
        {
            type:
                "marriage",

            category:
                "relationship",

            ...clone(marriage)

        },
        {
            silent:
                options.silent
        }
    );


    return {

        success: true,

        life:
            result

    };

}


/* =========================================================
   NASCIMENTO DE FILHO
========================================================= */

function onChildBirth(
    child,
    options = {}
) {

    let result =
        null;


    try {

        if (
            typeof lifeAPI.onChildBirth ===
                "function"
        ) {

            result =
                lifeAPI.onChildBirth(
                    child,
                    options
                );

        }

    } catch {

        addWarning(
            "Erro ao enviar nascimento de filho para o LIFE.",
            "life"
        );

    }


    emitGameEvent(
        {
            type:
                "child_birth",

            category:
                "family",

            ...clone(child)

        },
        {
            silent:
                options.silent
        }
    );


    return {

        success: true,

        life:
            result

    };

}


/* =========================================================
   MORTE
========================================================= */

function onDeath(
    death,
    options = {}
) {

    let result =
        null;


    try {

        if (
            typeof lifeAPI.onDeath ===
                "function"
        ) {

            result =
                lifeAPI.onDeath(
                    death,
                    options
                );

            }

    } catch {

        addWarning(
            "Erro ao enviar morte para o LIFE.",
            "life"
        );

    }


    emitGameEvent(
        {
            type:
                "death",

            category:
                "life",

            ...clone(death)

        },
        {
            silent:
                options.silent
        }
    );


    mainState.status =
        GAME_STATUS.GAME_OVER;


    return {

        success: true,

        life:
            result

    };

}


/* =========================================================
   SAVE
========================================================= */

function saveGame(
    options = {}
) {

    if (
        !mainState.database
    ) {

        return {

            success: false,

            reason:
                "database_missing"

        };

    }


    let result =
        null;


    try {

        if (
            typeof saveAPI.saveGame ===
                "function"
        ) {

            result =
                saveAPI.saveGame(
                    mainState.database,
                    options
                );

        } else if (
            typeof saveAPI.save ===
                "function"
        ) {

            result =
                saveAPI.save(
                    mainState.database,
                    options
                );

        } else {

            /*
            -------------------------------------------------
            Fallback localStorage
            -------------------------------------------------
            */

            if (
                typeof localStorage !==
                    "undefined"
            ) {

                localStorage.setItem(
                    "mma-life-dynasty-save",
                    JSON.stringify(
                        mainState.database
                    )
                );

                result = {

                    success: true,

                    method:
                        "localStorage"

                };

            }

        }

    } catch (error) {

        addError(
            "Erro ao salvar o jogo.",
            "core.save",
            error
        );

        return {

            success: false,

            error

        };

    }


    mainState.lastSaveAt =
        now();


    /*
    ---------------------------------------------------------
    LIFE SAVE HOOK
    ---------------------------------------------------------
    */

    try {

        if (
            typeof lifeAPI.onSave ===
                "function"
        ) {

            lifeAPI.onSave(
                options
            );

        }

    } catch {

        /* hook opcional */

    }


    return {

        success: true,

        result,

        savedAt:
            mainState.lastSaveAt

    };

}


/* =========================================================
   LOAD
========================================================= */

function loadGame(
    options = {}
) {

    let database =
        options.database ||
        null;


    /*
    ---------------------------------------------------------
    CORE SAVE
    ---------------------------------------------------------
    */

    if (
        !database
    ) {

        try {

            if (
                typeof saveAPI.loadGame ===
                    "function"
            ) {

                database =
                    saveAPI.loadGame(
                        options
                    );

            } else if (
                typeof saveAPI.load ===
                    "function"
            ) {

                database =
                    saveAPI.load(
                        options
                    );

            }

        } catch (error) {

            addError(
                "Erro ao carregar o save.",
                "core.save",
                error
            );

        }

    }


    /*
    ---------------------------------------------------------
    FALLBACK LOCALSTORAGE
    ---------------------------------------------------------
    */

    if (
        !database &&
        typeof localStorage !==
            "undefined"
    ) {

        try {

            const raw =
                localStorage.getItem(
                    "mma-life-dynasty-save"
                );


            if (
                raw
            ) {

                database =
                    JSON.parse(
                        raw
                    );

            }

        } catch (error) {

            addError(
                "Save local inválido.",
                "core.save",
                error
            );

        }

    }


    if (
        !database
    ) {

        return {

            success: false,

            reason:
                "save_not_found"

        };

    }


    /*
    ---------------------------------------------------------
    PREPARAR E REGISTRAR
    ---------------------------------------------------------
    */

    database =
        prepareDatabase(
            database
        );


    registerDatabase(
        database
    );


    /*
    ---------------------------------------------------------
    LIFE LOAD
    ---------------------------------------------------------
    */

    try {

        if (
            typeof lifeAPI.onLoad ===
                "function"
        ) {

            lifeAPI.onLoad(
                database,
                options
            );

        }

    } catch (error) {

        addWarning(
            "LIFE carregou o database com avisos.",
            "life"
        );

    }


    mainState.database =
        database;

    mainState.initialized =
        true;

    mainState.started =
        true;

    mainState.paused =
        false;

    mainState.status =
        GAME_STATUS.RUNNING;

    mainState.lastLoadAt =
        now();


    emitGameEvent(
        {
            type:
                "game_loaded",

            category:
                "system"

        },
        {
            silent: true
        }
    );


    return {

        success: true,

        database,

        loadedAt:
            mainState.lastLoadAt,

        state:
            getState()

    };

}


/* =========================================================
   RESET
========================================================= */

function resetGame(
    options = {}
) {

    /*
    ---------------------------------------------------------
    LIFE
    ---------------------------------------------------------
    */

    try {

        if (
            typeof lifeAPI.reset ===
                "function"
        ) {

            lifeAPI.reset(
                options
            );

        }

    } catch {

        /* reset opcional */

    }


    /*
    ---------------------------------------------------------
    CORE
    ---------------------------------------------------------
    */

    try {

        if (
            typeof stateAPI.resetState ===
                "function"
        ) {

            stateAPI.resetState();

        } else if (
            typeof stateAPI.reset ===
                "function"
        ) {

            stateAPI.reset();

        }

    } catch {

        /* fallback */

    }


    /*
    ---------------------------------------------------------
    NOVO DATABASE
    ---------------------------------------------------------
    */

    if (
        options.createNew !== false
    ) {

        const database =
            createDatabase();


        registerDatabase(
            database
        );

    } else {

        mainState.database =
            null;

    }


    mainState.status =
        GAME_STATUS.CREATED;

    mainState.initialized =
        false;

    mainState.started =
        false;

    mainState.paused =
        false;

    mainState.currentCycle =
        null;

    mainState.lastCycle =
        null;

    mainState.cycleCount =
        0;


    return getState();

}


/* =========================================================
   GET DATABASE
========================================================= */

function getDatabase() {

    return mainState.database;

}


/* =========================================================
   GET MODULE
========================================================= */

function getModule(
    path
) {

    if (
        !path
    ) {

        return null;

    }


    const parts =
        String(
            path
        )
            .split(".")
            .filter(Boolean);


    let current =
        gameModules;


    for (
        const part
        of parts
    ) {

        if (
            current?.[part] ===
            undefined
        ) {

            return null;

        }

        current =
            current[part];

    }


    return current;

}


/* =========================================================
   GET MODULES
========================================================= */

function getModules() {

    return gameModules;

}


/* =========================================================
   SNAPSHOT
========================================================= */

function snapshot() {

    return {

        version:
            MAIN_VERSION,

        state:
            getState(),

        database:
            clone(
                mainState.database
            )

    };

}


/* =========================================================
   ESTADO
========================================================= */

function getState() {

    return {

        version:
            MAIN_VERSION,

        status:
            mainState.status,

        initialized:
            mainState.initialized,

        started:
            mainState.started,

        paused:
            mainState.paused,

        currentCycle:
            mainState.currentCycle,

        lastCycle:
            mainState.lastCycle,

        cycleCount:
            mainState.cycleCount,

        currentWeek:
            getCurrentWeek(),

        currentMonth:
            getCurrentMonth(),

        currentYear:
            getCurrentYear(),

        lastSaveAt:
            mainState.lastSaveAt,

        lastLoadAt:
            mainState.lastLoadAt,

        databaseAvailable:
            Boolean(
                mainState.database
            ),

        errors:
            clone(
                mainState.errors
            ),

        warnings:
            clone(
                mainState.warnings
            )

    };

}


/* =========================================================
   VALIDAÇÃO
========================================================= */

function validate() {

    const errors = [];
    const warnings = [];


    if (
        !mainState.database
    ) {

        errors.push(
            "Database principal não conectado."
        );

    }


    if (
        !mainState.initialized
    ) {

        warnings.push(
            "Jogo ainda não foi inicializado."
        );

    }


    if (
        !lifeAPI
    ) {

        errors.push(
            "LIFE API não encontrada."
        );

    }


    if (
        mainState.database &&
        !mainState.database.player
    ) {

        warnings.push(
            "Nenhum jogador foi criado ainda."
        );

    }


    if (
        mainState.errors.length
    ) {

        warnings.push(
            `${mainState.errors.length} erro(s) registrados durante a execução.`
        );

    }


    return {

        valid:
            errors.length === 0,

        errors,

        warnings

    };

}


/* =========================================================
   API PRINCIPAL
========================================================= */

const mainAPI = {

    version:
        MAIN_VERSION,

    status:
        GAME_STATUS,

    modules:
        gameModules,

    /* Database */

    createDatabase,

    prepareDatabase,

    registerDatabase,

    getDatabase,

    getModule,

    getModules,

    /* Lifecycle */

    initialize,

    startGame,

    pauseGame,

    resumeGame,

    resetGame,

    /* Time */

    getCurrentWeek,

    getCurrentMonth,

    getCurrentYear,

    processWeek,

    processMonth,

    processYear,

    processCycle,

    /* Events */

    emitGameEvent,

    onFight,

    onContract,

    onTitle,

    onMarriage,

    onChildBirth,

    onDeath,

    /* Save */

    saveGame,

    loadGame,

    /* State */

    getState,

    snapshot,

    validate

};


/* =========================================================
   EXPOSIÇÃO GLOBAL
========================================================= */

if (
    typeof globalThis !==
    "undefined"
) {

    globalThis.MMA_LIFE_GAME =
        mainAPI;

    globalThis.MMA_LIFE_DATABASE =
        null;

    globalThis.mmaLifeGame =
        mainAPI;

    globalThis.lifeAPI =
        lifeAPI;

}


/* =========================================================
   EXPORTS
========================================================= */

export {

    MAIN_VERSION,

    GAME_STATUS,

    gameModules,

    mainAPI,

    createDatabase,

    prepareDatabase,

    registerDatabase,

    getDatabase,

    getModule,

    getModules,

    initialize,

    startGame,

    pauseGame,

    resumeGame,

    resetGame,

    getCurrentWeek,

    getCurrentMonth,

    getCurrentYear,

    processWeek,

    processMonth,

    processYear,

    processCycle,

    emitGameEvent,

    onFight,

    onContract,

    onTitle,

    onMarriage,

    onChildBirth,

    onDeath,

    saveGame,

    loadGame,

    getState,

    snapshot,

    validate

};

export default mainAPI;


/* =========================================================
   AUTO-REGISTRO
========================================================= */

if (
    typeof document !==
    "undefined"
) {

    /*
    ---------------------------------------------------------
    O main NÃO inicia automaticamente uma partida.
    
    Ele apenas fica disponível para o index.html/UI.
    
    A partida será iniciada pelo fluxo de criação/novo jogo.
    ---------------------------------------------------------
    */

    document.dispatchEvent(
        new CustomEvent(
            "mma-life-main-ready",
            {
                detail: {
                    api:
                        mainAPI
                }
            }
        )
    );

}
