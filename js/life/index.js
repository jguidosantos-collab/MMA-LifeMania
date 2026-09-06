/*
============================================================
MMA LIFE DYNASTY
LIFE MODULE INDEX
============================================================

Entrada central do sistema LIFE.

Responsabilidades:
- Registrar todos os módulos LIFE.
- Centralizar as APIs.
- Inicializar os sistemas na ordem correta.
- Conectar o Game Bridge.
- Disponibilizar uma API única para o restante do jogo.
- Preparar a futura conexão com main.js.
============================================================
*/

import lifeEngineAPI from "./lifeEngine.js";
import lifeEventsAPI from "./lifeEvents.js";
import lifeHistoryAPI from "./lifeHistory.js";
import lifeMilestonesAPI from "./lifeMilestones.js";
import lifeIntegrationAPI from "./lifeIntegration.js";
import lifeGameBridgeAPI from "./lifeGameBridge.js";

import relationshipsAPI from "./relationships.js";
import marriageAPI from "./marriage.js";
import childrenAPI from "./children.js";
import familyAPI from "./family.js";
import educationAPI from "./education.js";
import employmentAPI from "./employment.js";
import residenceAPI from "./residence.js";
import vehiclesAPI from "./vehicles.js";
import lifestyleAPI from "./lifestyle.js";

import lifeUIAPI from "./lifeUI.js";
import lifeDashboardAPI from "./lifeDashboard.js";
import lifeNavigationAPI from "./lifeNavigation.js";
import lifeScreenAPI from "./lifeScreen.js";
import lifeMenuAPI from "./lifeMenu.js";
import lifeRouterAPI from "./lifeRouter.js";

import lifeControllerAPI from "./lifeController.js";
import lifeBootstrapAPI from "./lifeBootstrap.js";

/* =========================================================
   VERSÃO
========================================================= */

const LIFE_MODULE_VERSION = 2;

/* =========================================================
   REGISTRO DOS MÓDULOS
========================================================= */

const lifeModules = {
    engine: lifeEngineAPI,

    events: lifeEventsAPI,

    history: lifeHistoryAPI,

    milestones: lifeMilestonesAPI,

    integration: lifeIntegrationAPI,

    gameBridge: lifeGameBridgeAPI,

    relationships: relationshipsAPI,

    marriage: marriageAPI,

    children: childrenAPI,

    family: familyAPI,

    education: educationAPI,

    employment: employmentAPI,

    residence: residenceAPI,

    vehicles: vehiclesAPI,

    lifestyle: lifestyleAPI,

    ui: lifeUIAPI,

    dashboard: lifeDashboardAPI,

    navigation: lifeNavigationAPI,

    screen: lifeScreenAPI,

    menu: lifeMenuAPI,

    router: lifeRouterAPI,

    controller: lifeControllerAPI,

    bootstrap: lifeBootstrapAPI
};

/* =========================================================
   ORDEM DE INICIALIZAÇÃO
========================================================= */

const LIFE_INITIALIZATION_ORDER = [
    "engine",

    "relationships",
    "marriage",
    "children",
    "family",

    "education",
    "employment",
    "residence",
    "vehicles",
    "lifestyle",

    "history",
    "events",
    "milestones",

    "integration",

    "gameBridge",

    "ui",
    "dashboard",
    "navigation",
    "screen",
    "menu",
    "router",

    "controller",

    "bootstrap"
];

/* =========================================================
   ESTADO
========================================================= */

let lifeModuleState = {
    initialized: false,

    database: null,

    initializedModules: [],

    failedModules: [],

    optionalModules: [],

    lastInitializeAt: null,

    initializeCount: 0,

    errors: [],

    warnings: []
};

/* =========================================================
   UTILITÁRIOS
========================================================= */

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

function isObject(value) {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );
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

/* =========================================================
   DATABASE
========================================================= */

function setDatabase(database) {
    if (
        !database ||
        !isObject(database)
    ) {
        lifeModuleState.database = null;

        return null;
    }

    lifeModuleState.database =
        database;

    ensureObject(
        database,
        "life",
        {}
    );

    return database;
}

function getDatabase() {
    return lifeModuleState.database;
}

/* =========================================================
   PREPARAÇÃO DO LIFE
========================================================= */

function prepareDatabase(
    database = lifeModuleState.database
) {
    if (
        !database ||
        !isObject(database)
    ) {
        return null;
    }

    setDatabase(database);

    const life =
        ensureObject(
            database,
            "life",
            {}
        );

    const structures = [
        "engine",
        "events",
        "history",
        "milestones",
        "integration",
        "gameBridge",

        "relationships",
        "marriage",
        "children",
        "family",
        "education",
        "employment",
        "residence",
        "vehicles",
        "lifestyle",

        "ui",
        "dashboard",
        "navigation",
        "screen",
        "menu",
        "router",
        "controller",
        "bootstrap"
    ];

    for (
        const structure
        of structures
    ) {
        ensureObject(
            life,
            structure,
            {}
        );
    }

    const meta =
        ensureObject(
            life,
            "meta",
            {}
        );

    meta.moduleVersion =
        LIFE_MODULE_VERSION;

    if (
        !meta.createdAt
    ) {
        meta.createdAt =
            Date.now();
    }

    meta.lastPreparedAt =
        Date.now();

    return database;
}

/* =========================================================
   MÓDULOS
========================================================= */

function getModule(name) {
    return (
        lifeModules[name] ||
        null
    );
}

function getModules() {
    return {
        ...lifeModules
    };
}

function hasModule(name) {
    return Boolean(
        lifeModules[name]
    );
}

/* =========================================================
   CHAMADA SEGURA
========================================================= */

function callModule(
    name,
    methods,
    ...args
) {
    const module =
        getModule(name);

    if (!module) {
        return {
            success: false,

            module: name,

            reason:
                "module_not_found"
        };
    }

    const methodList =
        Array.isArray(methods)
            ? methods
            : [methods];

    for (
        const method
        of methodList
    ) {
        if (
            typeof module[method] ===
            "function"
        ) {
            try {
                return {
                    success: true,

                    module: name,

                    method,

                    result:
                        module[method](
                            ...args
                        )
                };
            } catch (error) {
                return {
                    success: false,

                    module: name,

                    method,

                    error
                };
            }
        }
    }

    return {
        success: false,

        module: name,

        reason:
            "method_not_found"
    };
}

/* =========================================================
   REGISTRO GLOBAL
========================================================= */

function registerGlobalAPIs() {
    if (
        typeof globalThis ===
        "undefined"
    ) {
        return false;
    }

    globalThis.lifeAPI =
        lifeAPI;

    globalThis.MMA_LIFE =
        lifeAPI;

    globalThis.lifeEngineAPI =
        lifeEngineAPI;

    globalThis.lifeEventsAPI =
        lifeEventsAPI;

    globalThis.lifeHistoryAPI =
        lifeHistoryAPI;

    globalThis.lifeMilestonesAPI =
        lifeMilestonesAPI;

    globalThis.lifeIntegrationAPI =
        lifeIntegrationAPI;

    globalThis.lifeGameBridgeAPI =
        lifeGameBridgeAPI;

    globalThis.relationshipsAPI =
        relationshipsAPI;

    globalThis.marriageAPI =
        marriageAPI;

    globalThis.childrenAPI =
        childrenAPI;

    globalThis.familyAPI =
        familyAPI;

    globalThis.educationAPI =
        educationAPI;

    globalThis.employmentAPI =
        employmentAPI;

    globalThis.residenceAPI =
        residenceAPI;

    globalThis.vehiclesAPI =
        vehiclesAPI;

    globalThis.lifestyleAPI =
        lifestyleAPI;

    globalThis.lifeUIAPI =
        lifeUIAPI;

    globalThis.lifeDashboardAPI =
        lifeDashboardAPI;

    globalThis.lifeNavigationAPI =
        lifeNavigationAPI;

    globalThis.lifeScreenAPI =
        lifeScreenAPI;

    globalThis.lifeMenuAPI =
        lifeMenuAPI;

    globalThis.lifeRouterAPI =
        lifeRouterAPI;

    globalThis.lifeControllerAPI =
        lifeControllerAPI;

    globalThis.lifeBootstrapAPI =
        lifeBootstrapAPI;

    return true;
}

/* =========================================================
   INICIALIZAÇÃO DE UM MÓDULO
========================================================= */

function initializeModule(
    name,
    options = {}
) {
    const module =
        getModule(name);

    if (!module) {
        return {
            success: false,

            module: name,

            reason:
                "module_not_found"
        };
    }

    /*
    --------------------------------------------------------
    Módulos que não precisam ser inicializados
    individualmente podem simplesmente ser registrados.
    --------------------------------------------------------
    */

    if (
        typeof module.initialize !==
        "function" &&
        typeof module.init !==
            "function"
    ) {
        lifeModuleState
            .optionalModules
            .push(name);

        return {
            success: true,

            module: name,

            skipped: true,

            reason:
                "no_initializer"
        };
    }

    try {
        const method =
            typeof module.initialize ===
            "function"
                ? "initialize"
                : "init";

        const result =
            module[method](
                lifeModuleState.database,
                options
            );

        return {
            success: true,

            module: name,

            method,

            result
        };
    } catch (error) {
        return {
            success: false,

            module: name,

            error
        };
    }
}

/* =========================================================
   INICIALIZAÇÃO PRINCIPAL
========================================================= */

function initialize(
    database = null,
    options = {}
) {
    /*
    --------------------------------------------------------
    DATABASE
    --------------------------------------------------------
    */

    if (database) {
        prepareDatabase(
            database
        );
    }

    if (
        !lifeModuleState.database
    ) {
        return {
            success: false,

            initialized: false,

            errors: [
                "Nenhum database foi fornecido ao LIFE."
            ]
        };
    }

    /*
    --------------------------------------------------------
    RESET DO ESTADO DE INICIALIZAÇÃO
    --------------------------------------------------------
    */

    if (
        lifeModuleState.initialized &&
        !options.force
    ) {
        return {
            success: true,

            alreadyInitialized: true,

            state:
                getState()
        };
    }

    lifeModuleState.initializedModules =
        [];

    lifeModuleState.failedModules =
        [];

    lifeModuleState.optionalModules =
        [];

    lifeModuleState.errors = [];

    lifeModuleState.warnings = [];

    /*
    --------------------------------------------------------
    PREPARAÇÃO
    --------------------------------------------------------
    */

    prepareDatabase();

    registerGlobalAPIs();

    const results = {};

    /*
    --------------------------------------------------------
    SISTEMAS BASE
    --------------------------------------------------------
    */

    const baseOrder = [
        "engine",

        "relationships",
        "marriage",
        "children",
        "family",

        "education",
        "employment",
        "residence",
        "vehicles",
        "lifestyle",

        "history",
        "events",
        "milestones",

        "integration"
    ];

    for (
        const name
        of baseOrder
    ) {
        const result =
            initializeModule(
                name,
                options
            );

        results[name] =
            result;

        if (
            result.success
        ) {
            lifeModuleState
                .initializedModules
                .push(name);
        } else {
            lifeModuleState
                .failedModules
                .push(name);

            lifeModuleState.errors.push({
                module: name,

                message:
                    result.error?.message ||
                    result.reason ||
                    "Falha na inicialização."
            });
        }
    }

    /*
    --------------------------------------------------------
    GAME BRIDGE
    --------------------------------------------------------
    */

    if (
        options.initializeGameBridge !==
        false
    ) {
        const result =
            initializeModule(
                "gameBridge",
                {
                    ...options,

                    automaticSync:
                        options.automaticSync ??
                        true
                }
            );

        results.gameBridge =
            result;

        if (
            result.success
        ) {
            lifeModuleState
                .initializedModules
                .push("gameBridge");
        } else {
            lifeModuleState
                .failedModules
                .push("gameBridge");

            lifeModuleState.errors.push({
                module:
                    "gameBridge",

                message:
                    result.error?.message ||
                    result.reason ||
                    "Falha no Game Bridge."
            });
        }
    } else {
        lifeModuleState
            .optionalModules
            .push(
                "gameBridge"
            );

        results.gameBridge = {
            success: true,

            skipped: true,

            reason:
                "game_bridge_disabled"
        };
    }

    /*
    --------------------------------------------------------
    BOOTSTRAP
    --------------------------------------------------------
    */

    if (
        options.initializeBootstrap !==
        false
    ) {
        const result =
            initializeModule(
                "bootstrap",
                {
                    ...options,

                    initializeSystems:
                        options.initializeSystems ??
                        true,

                    initializeUI:
                        options.initializeUI ??
                        true,

                    defaultSection:
                        options.defaultSection ||
                        "overview"
                }
            );

        results.bootstrap =
            result;

        if (
            result.success
        ) {
            lifeModuleState
                .initializedModules
                .push(
                    "bootstrap"
                );
        } else {
            lifeModuleState
                .failedModules
                .push(
                    "bootstrap"
                );

            lifeModuleState.errors.push({
                module:
                    "bootstrap",

                message:
                    result.error?.message ||
                    result.reason ||
                    "Falha no Bootstrap."
            });
        }
    }

    /*
    --------------------------------------------------------
    STATUS
    --------------------------------------------------------
    */

    lifeModuleState.initialized =
        lifeModuleState
            .failedModules
            .length === 0;

    /*
    --------------------------------------------------------
    AVISOS
    --------------------------------------------------------
    */

    if (
        lifeModuleState.failedModules
            .length > 0
    ) {
        lifeModuleState.warnings.push(
            "O LIFE foi inicializado parcialmente."
        );
    }

    lifeModuleState.lastInitializeAt =
        Date.now();

    lifeModuleState.initializeCount +=
        1;

    registerGlobalAPIs();

    return {
        success:
            lifeModuleState
                .initializedModules
                .length > 0,

        initialized:
            lifeModuleState.initialized,

        results,

        state:
            getState()
    };
}

/* =========================================================
   ABRIR LIFE
========================================================= */

function open(
    section = "overview"
) {
    const controller =
        getModule(
            "controller"
        );

    if (
        controller &&
        typeof controller.open ===
            "function"
    ) {
        try {
            return controller.open({
                section
            });
        } catch {
            // Continua para fallback.
        }
    }

    const bootstrap =
        getModule(
            "bootstrap"
        );

    if (
        bootstrap &&
        typeof bootstrap.open ===
            "function"
    ) {
        try {
            return bootstrap.open(
                section
            );
        } catch {
            // Continua para fallback.
        }
    }

    const router =
        getModule(
            "router"
        );

    if (
        router &&
        typeof router.navigate ===
            "function"
    ) {
        return router.navigate(
            section
        );
    }

    return {
        success: false,

        reason:
            "life_ui_unavailable"
    };
}

/* =========================================================
   FECHAR
========================================================= */

function close() {
    const controller =
        getModule(
            "controller"
        );

    if (
        controller &&
        typeof controller.close ===
            "function"
    ) {
        return controller.close();
    }

    return {
        success: false,

        reason:
            "life_controller_unavailable"
    };
}

/* =========================================================
   TOGGLE
========================================================= */

function toggle(
    section = "overview"
) {
    const controller =
        getModule(
            "controller"
        );

    if (
        controller &&
        typeof controller.toggle ===
            "function"
    ) {
        return controller.toggle({
            section
        });
    }

    return open(
        section
    );
}

/* =========================================================
   NAVEGAÇÃO
========================================================= */

function navigate(
    section,
    options = {}
) {
    const router =
        getModule(
            "router"
        );

    if (
        router &&
        typeof router.navigate ===
            "function"
    ) {
        return router.navigate(
            section,
            options
        );
    }

    const navigation =
        getModule(
            "navigation"
        );

    if (
        navigation &&
        typeof navigation.navigate ===
            "function"
    ) {
        return navigation.navigate(
            section,
            options
        );
    }

    return {
        success: false,

        reason:
            "life_navigation_unavailable"
    };
}

function goHome(
    options = {}
) {
    const router =
        getModule(
            "router"
        );

    if (
        router &&
        typeof router.goHome ===
            "function"
    ) {
        return router.goHome(
            options
        );
    }

    return navigate(
        "overview",
        options
    );
}

function goBack(
    options = {}
) {
    const router =
        getModule(
            "router"
        );

    if (
        router &&
        typeof router.goBack ===
            "function"
    ) {
        return router.goBack(
            options
        );
    }

    return {
        success: false,

        reason:
            "life_router_unavailable"
    };
}

/* =========================================================
   REFRESH
========================================================= */

function refresh(
    options = {}
) {
    const controller =
        getModule(
            "controller"
        );

    if (
        controller &&
        typeof controller.refresh ===
            "function"
    ) {
        return controller.refresh(
            options
        );
    }

    const dashboard =
        getModule(
            "dashboard"
        );

    if (
        dashboard &&
        typeof dashboard.refresh ===
            "function"
    ) {
        return dashboard.refresh(
            options
        );
    }

    const ui =
        getModule(
            "ui"
        );

    if (
        ui &&
        typeof ui.refresh ===
            "function"
    ) {
        return ui.refresh(
            options
        );
    }

    return {
        success: false,

        reason:
            "life_ui_unavailable"
    };
}

/* =========================================================
   CICLOS
========================================================= */

function processWeek(
    options = {}
) {
    const bridge =
        getModule(
            "gameBridge"
        );

    if (
        bridge &&
        typeof bridge.processWeek ===
            "function"
    ) {
        return bridge.processWeek(
            options
        );
    }

    const controller =
        getModule(
            "controller"
        );

    if (
        controller &&
        typeof controller.processWeek ===
            "function"
    ) {
        return controller.processWeek(
            options
        );
    }

    return {
        success: false,

        reason:
            "life_cycle_controller_unavailable"
    };
}

function processMonth(
    options = {}
) {
    const bridge =
        getModule(
            "gameBridge"
        );

    if (
        bridge &&
        typeof bridge.processMonth ===
            "function"
    ) {
        return bridge.processMonth(
            options
        );
    }

    const controller =
        getModule(
            "controller"
        );

    if (
        controller &&
        typeof controller.processMonth ===
            "function"
    ) {
        return controller.processMonth(
            options
        );
    }

    return {
        success: false,

        reason:
            "life_cycle_controller_unavailable"
    };
}

function processYear(
    options = {}
) {
    const bridge =
        getModule(
            "gameBridge"
        );

    if (
        bridge &&
        typeof bridge.processYear ===
            "function"
    ) {
        return bridge.processYear(
            options
        );
    }

    const controller =
        getModule(
            "controller"
        );

    if (
        controller &&
        typeof controller.processYear ===
            "function"
    ) {
        return controller.processYear(
            options
        );
    }

    return {
        success: false,

        reason:
            "life_cycle_controller_unavailable"
    };
}

function processCycle(
    type,
    options = {}
) {
    const bridge =
        getModule(
            "gameBridge"
        );

    if (
        bridge &&
        typeof bridge.processCycle ===
            "function"
    ) {
        return bridge.processCycle(
            type,
            options
        );
    }

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

function onGameEvent(
    event,
    options = {}
) {
    const bridge =
        getModule(
            "gameBridge"
        );

    if (
        bridge &&
        typeof bridge.onGameEvent ===
            "function"
    ) {
        return bridge.onGameEvent(
            event,
            options
        );
    }

    const events =
        getModule(
            "events"
        );

    if (
        events &&
        typeof events.recordEvent ===
            "function"
    ) {
        return events.recordEvent(
            lifeModuleState.database,
            event,
            options
        );
    }

    return {
        success: false,

        reason:
            "life_event_system_unavailable"
    };
}

/* =========================================================
   EVENTOS ESPECÍFICOS
========================================================= */

function onFight(
    fight,
    options = {}
) {
    const bridge =
        getModule(
            "gameBridge"
        );

    if (
        bridge &&
        typeof bridge.onFight ===
            "function"
    ) {
        return bridge.onFight(
            fight,
            options
        );
    }

    return onGameEvent(
        {
            type: "fight",

            category: "mma",

            ...clone(fight)
        },
        options
    );
}

function onContract(
    contract,
    options = {}
) {
    const bridge =
        getModule(
            "gameBridge"
        );

    if (
        bridge &&
        typeof bridge.onContract ===
            "function"
    ) {
        return bridge.onContract(
            contract,
            options
        );
    }

    return onGameEvent(
        {
            type: "contract",

            category: "career",

            ...clone(contract)
        },
        options
    );
}

function onTitle(
    title,
    options = {}
) {
    const bridge =
        getModule(
            "gameBridge"
        );

    if (
        bridge &&
        typeof bridge.onTitle ===
            "function"
    ) {
        return bridge.onTitle(
            title,
            options
        );
    }

    return onGameEvent(
        {
            type: "title",

            category: "career",

            ...clone(title)
        },
        options
    );
}

function onMarriage(
    marriage,
    options = {}
) {
    const bridge =
        getModule(
            "gameBridge"
        );

    if (
        bridge &&
        typeof bridge.onMarriage ===
            "function"
    ) {
        return bridge.onMarriage(
            marriage,
            options
        );
    }

    return onGameEvent(
        {
            type: "marriage",

            category: "relationship",

            ...clone(marriage)
        },
        options
    );
}

function onChildBirth(
    child,
    options = {}
) {
    const bridge =
        getModule(
            "gameBridge"
        );

    if (
        bridge &&
        typeof bridge.onChildBirth ===
            "function"
    ) {
        return bridge.onChildBirth(
            child,
            options
        );
    }

    return onGameEvent(
        {
            type: "child_birth",

            category: "family",

            ...clone(child)
        },
        options
    );
}

function onDeath(
    death,
    options = {}
) {
    const bridge =
        getModule(
            "gameBridge"
        );

    if (
        bridge &&
        typeof bridge.onDeath ===
            "function"
    ) {
        return bridge.onDeath(
            death,
            options
        );
    }

    return onGameEvent(
        {
            type: "death",

            category: "life",

            ...clone(death)
        },
        options
    );
}

/* =========================================================
   SAVE / LOAD
========================================================= */

function onSave(
    options = {}
) {
    const bridge =
        getModule(
            "gameBridge"
        );

    if (
        bridge &&
        typeof bridge.onSave ===
            "function"
    ) {
        return bridge.onSave(
            options
        );
    }

    return {
        success: false,

        reason:
            "life_game_bridge_unavailable"
    };
}

function onLoad(
    database,
    options = {}
) {
    const bridge =
        getModule(
            "gameBridge"
        );

    if (
        bridge &&
        typeof bridge.onLoad ===
            "function"
    ) {
        return bridge.onLoad(
            database,
            options
        );
    }

    if (
        database
    ) {
        prepareDatabase(
            database
        );
    }

    return {
        success:
            Boolean(
                lifeModuleState.database
            ),

        state:
            getState()
    };
}

/* =========================================================
   ESTADO
========================================================= */

function getState() {
    return {
        version:
            LIFE_MODULE_VERSION,

        initialized:
            lifeModuleState.initialized,

        databaseAvailable:
            Boolean(
                lifeModuleState.database
            ),

        initializedModules:
            [
                ...lifeModuleState
                    .initializedModules
            ],

        failedModules:
            [
                ...lifeModuleState
                    .failedModules
            ],

        optionalModules:
            [
                ...lifeModuleState
                    .optionalModules
            ],

        lastInitializeAt:
            lifeModuleState
                .lastInitializeAt,

        initializeCount:
            lifeModuleState
                .initializeCount,

        errors:
            clone(
                lifeModuleState.errors
            ),

        warnings:
            clone(
                lifeModuleState.warnings
            )
    };
}

/* =========================================================
   RESUMO
========================================================= */

function getSummary() {
    const total =
        Object.keys(
            lifeModules
        ).length;

    const initialized =
        lifeModuleState
            .initializedModules
            .length;

    const failed =
        lifeModuleState
            .failedModules
            .length;

    const optional =
        lifeModuleState
            .optionalModules
            .length;

    return {
        version:
            LIFE_MODULE_VERSION,

        initialized:
            lifeModuleState.initialized,

        totalModules:
            total,

        initializedModules:
            initialized,

        failedModules:
            failed,

        optionalModules:
            optional,

        activeModules:
            initialized +
            optional,

        percentage:
            total > 0
                ? Math.round(
                      (initialized /
                          total) *
                          100
                  )
                : 0,

        errors:
            lifeModuleState
                .errors.length,

        warnings:
            lifeModuleState
                .warnings.length
    };
}

/* =========================================================
   SNAPSHOT
========================================================= */

function snapshot() {
    return {
        version:
            LIFE_MODULE_VERSION,

        state:
            getState(),

        summary:
            getSummary(),

        database:
            lifeModuleState.database
                ? clone(
                      lifeModuleState
                          .database
                          .life
                  )
                : null
    };
}

/* =========================================================
   VALIDAÇÃO
========================================================= */

function validate() {
    const errors = [];
    const warnings = [];

    if (
        !lifeModuleState.database
    ) {
        errors.push(
            "Database do jogo não está conectado ao LIFE."
        );
    }

    if (
        !lifeModuleState.initialized
    ) {
        warnings.push(
            "O módulo LIFE ainda não está totalmente inicializado."
        );
    }

    if (
        lifeModuleState.failedModules
            .length > 0
    ) {
        warnings.push(
            `${lifeModuleState.failedModules.length} módulo(s) apresentaram falha.`
        );
    }

    if (
        !getModule(
            "gameBridge"
        )
    ) {
        errors.push(
            "LIFE Game Bridge não está registrado."
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
   RESET
========================================================= */

function reset(
    options = {}
) {
    const resetOrder = [
        "bootstrap",
        "controller",
        "router",
        "menu",
        "screen",
        "navigation",
        "dashboard",
        "ui",

        "gameBridge",
        "integration",
        "milestones",
        "events",
        "history",

        "lifestyle",
        "vehicles",
        "residence",
        "employment",
        "education",

        "family",
        "children",
        "marriage",
        "relationships",

        "engine"
    ];

    for (
        const name
        of resetOrder
    ) {
        const module =
            getModule(name);

        if (
            module &&
            typeof module.reset ===
                "function"
        ) {
            try {
                module.reset(
                    options
                );
            } catch {
                // Reset isolado.
            }
        }
    }

    const database =
        lifeModuleState.database;

    lifeModuleState = {
        initialized: false,

        database:
            options.keepDatabase === false
                ? null
                : database,

        initializedModules: [],

        failedModules: [],

        optionalModules: [],

        lastInitializeAt: null,

        initializeCount: 0,

        errors: [],

        warnings: []
    };

    return getState();
}

/* =========================================================
   API CENTRAL
========================================================= */

const lifeAPI = {
    version:
        LIFE_MODULE_VERSION,

    config: {
        version:
            LIFE_MODULE_VERSION,

        initializationOrder:
            [
                ...LIFE_INITIALIZATION_ORDER
            ]
    },

    /* Database */
    setDatabase,

    getDatabase,

    prepareDatabase,

    /* Modules */
    getModule,

    getModules,

    hasModule,

    callModule,

    /* Lifecycle */
    initialize,

    open,

    close,

    toggle,

    /* Navigation */
    navigate,

    goHome,

    goBack,

    /* UI */
    refresh,

    /* Cycles */
    processWeek,

    processMonth,

    processYear,

    processCycle,

    /* Game events */
    onGameEvent,

    onFight,

    onContract,

    onTitle,

    onMarriage,

    onChildBirth,

    onDeath,

    /* Save / Load */
    onSave,

    onLoad,

    /* State */
    getState,

    getSummary,

    snapshot,

    validate,

    /* Reset */
    reset
};

/* =========================================================
   REGISTRAR APIS NOVAMENTE
========================================================= */

registerGlobalAPIs();

/* =========================================================
   EXPORTS
========================================================= */

export {
    LIFE_MODULE_VERSION,

    lifeModules,

    LIFE_INITIALIZATION_ORDER,

    lifeAPI,

    lifeEngineAPI,

    lifeEventsAPI,

    lifeHistoryAPI,

    lifeMilestonesAPI,

    lifeIntegrationAPI,

    lifeGameBridgeAPI,

    relationshipsAPI,

    marriageAPI,

    childrenAPI,

    familyAPI,

    educationAPI,

    employmentAPI,

    residenceAPI,

    vehiclesAPI,

    lifestyleAPI,

    lifeUIAPI,

    lifeDashboardAPI,

    lifeNavigationAPI,

    lifeScreenAPI,

    lifeMenuAPI,

    lifeRouterAPI,

    lifeControllerAPI,

    lifeBootstrapAPI
};

export default lifeAPI;
