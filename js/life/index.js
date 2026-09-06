/*
============================================================
MMA LIFE DYNASTY
LIFE MODULE INDEX
============================================================

Responsabilidade:
- Ser a entrada oficial do módulo LIFE.
- Importar todos os sistemas LIFE.
- Disponibilizar uma API única.
- Inicializar os módulos na ordem correta.
- Conectar o Bootstrap ao Controller.
- Facilitar a integração com main.js.
============================================================
*/

/* =========================================================
   CORE DO LIFE
========================================================= */

import lifeEngineAPI from "./lifeEngine.js";
import lifeEventsAPI from "./lifeEvents.js";
import lifeHistoryAPI from "./lifeHistory.js";
import lifeMilestonesAPI from "./lifeMilestones.js";
import lifeIntegrationAPI from "./lifeIntegration.js";

/* =========================================================
   SISTEMAS DE VIDA
========================================================= */

import relationshipsAPI from "./relationships.js";
import marriageAPI from "./marriage.js";
import childrenAPI from "./children.js";
import familyAPI from "./family.js";
import educationAPI from "./education.js";
import employmentAPI from "./employment.js";
import residenceAPI from "./residence.js";
import vehiclesAPI from "./vehicles.js";
import lifestyleAPI from "./lifestyle.js";

/* =========================================================
   INTERFACE LIFE
========================================================= */

import lifeUIAPI from "./lifeUI.js";
import lifeDashboardAPI from "./lifeDashboard.js";
import lifeNavigationAPI from "./lifeNavigation.js";
import lifeScreenAPI from "./lifeScreen.js";
import lifeMenuAPI from "./lifeMenu.js";
import lifeRouterAPI from "./lifeRouter.js";

/* =========================================================
   CONTROLE
========================================================= */

import lifeControllerAPI from "./lifeController.js";
import lifeBootstrapAPI from "./lifeBootstrap.js";

/* =========================================================
   VERSÃO
========================================================= */

const LIFE_MODULE_VERSION = 1;

/* =========================================================
   REGISTRO DE SISTEMAS
========================================================= */

const lifeModules = {
    engine: lifeEngineAPI,

    events: lifeEventsAPI,

    history: lifeHistoryAPI,

    milestones: lifeMilestonesAPI,

    integration: lifeIntegrationAPI,

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

    "ui",
    "dashboard",
    "navigation",
    "screen",
    "menu",
    "router",

    "controller"
];

/* =========================================================
   ESTADO
========================================================= */

let lifeModuleState = {
    initialized: false,

    database: null,

    initializedModules: [],

    failedModules: [],

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

function ensureObject(
    parent,
    key,
    fallback = {}
) {
    if (
        !parent[key] ||
        typeof parent[key] !== "object"
    ) {
        parent[key] = fallback;
    }

    return parent[key];
}

/* =========================================================
   DATABASE
========================================================= */

function setDatabase(database) {
    lifeModuleState.database =
        database || null;

    if (
        lifeModuleState.database &&
        typeof lifeModuleState.database ===
            "object"
    ) {
        ensureObject(
            lifeModuleState.database,
            "life",
            {}
        );
    }

    return lifeModuleState.database;
}

function getDatabase() {
    return lifeModuleState.database;
}

/* =========================================================
   ACESSO A MÓDULOS
========================================================= */

function getModule(name) {
    return lifeModules[name] || null;
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
   PREPARAÇÃO
========================================================= */

function prepareDatabase(
    database
) {
    if (
        !database ||
        typeof database !== "object"
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

    /*
    --------------------------------------------------------
    Estruturas fundamentais.
    --------------------------------------------------------
    */

    const structures = [
        "relationships",
        "marriage",
        "children",
        "family",
        "education",
        "employment",
        "residence",
        "vehicles",
        "lifestyle",
        "engine",
        "events",
        "history",
        "milestones",
        "integration",
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

    if (
        !life.meta ||
        typeof life.meta !== "object"
    ) {
        life.meta = {};
    }

    life.meta.moduleVersion =
        LIFE_MODULE_VERSION;

    if (
        !life.meta.createdAt
    ) {
        life.meta.createdAt =
            Date.now();
    }

    return database;
}

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initialize(
    database = null,
    options = {}
) {
    /*
    --------------------------------------------------------
    Se já estiver inicializado, não duplicar.
    --------------------------------------------------------
    */

    if (
        lifeModuleState.initialized &&
        !options.force
    ) {
        return getState();
    }

    /*
    --------------------------------------------------------
    Database
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
                "Nenhum database foi fornecido ao módulo LIFE."
            ]
        };
    }

    lifeModuleState.errors = [];
    lifeModuleState.warnings = [];

    lifeModuleState
        .initializedModules = [];

    lifeModuleState
        .failedModules = [];

    /*
    --------------------------------------------------------
    IMPORTANTE:
    O Bootstrap é o responsável pela inicialização final
    dos componentes de controle e UI.

    Aqui inicializamos os sistemas-base primeiro.
    --------------------------------------------------------
    */

    const results = {};

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
            callModule(
                name,
                [
                    "initialize",
                    "init"
                ],
                lifeModuleState.database,
                options
            );

        results[name] =
            result;

        if (result.success) {
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
    Bootstrap:
    inicializa Controller + UI + Router.
    --------------------------------------------------------
    */

    const bootstrapResult =
        callModule(
            "bootstrap",
            "initialize",
            lifeModuleState.database,
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
        bootstrapResult;

    if (
        bootstrapResult.success
    ) {
        lifeModuleState
            .initializedModules
            .push("bootstrap");
    } else {
        lifeModuleState
            .failedModules
            .push("bootstrap");

        lifeModuleState.errors.push({
            module: "bootstrap",

            message:
                bootstrapResult.error?.message ||
                bootstrapResult.reason ||
                "Falha no Bootstrap."
        });
    }

    /*
    --------------------------------------------------------
    Estado final.
    --------------------------------------------------------
    */

    lifeModuleState.initialized =
        lifeModuleState.failedModules
            .length === 0;

    /*
    Mesmo havendo módulos opcionais indisponíveis,
    o LIFE pode continuar funcionando.
    --------------------------------------------------------
    */

    if (
        !lifeModuleState.initialized &&
        lifeModuleState.initializedModules
            .length > 0
    ) {
        lifeModuleState.warnings.push(
            "O módulo LIFE foi inicializado parcialmente."
        );
    }

    lifeModuleState.lastInitializeAt =
        Date.now();

    lifeModuleState.initializeCount +=
        1;

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

    if (controller) {
        const result =
            callModule(
                "controller",
                "open",
                {
                    section
                }
            );

        if (result.success) {
            return result.result;
        }
    }

    const bootstrap =
        getModule(
            "bootstrap"
        );

    if (bootstrap) {
        return callModule(
            "bootstrap",
            "open",
            section
        );
    }

    return {
        success: false,

        reason:
            "life_controller_unavailable"
    };
}

/* =========================================================
   FECHAR LIFE
========================================================= */

function close() {
    return callModule(
        "controller",
        "close"
    );
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

    return open(section);
}

/* =========================================================
   NAVEGAÇÃO
========================================================= */

function navigate(
    section,
    options = {}
) {
    return callModule(
        "router",
        [
            "navigate",
            "goTo"
        ],
        section,
        options
    );
}

function goHome(
    options = {}
) {
    return callModule(
        "router",
        "goHome",
        options
    );
}

function goBack(
    options = {}
) {
    return callModule(
        "router",
        "goBack",
        options
    );
}

/* =========================================================
   REFRESH
========================================================= */

function refresh(
    options = {}
) {
    return callModule(
        "controller",
        "refresh",
        options
    );
}

/* =========================================================
   PROCESSAMENTO
========================================================= */

function processWeek(
    options = {}
) {
    return callModule(
        "controller",
        "processWeek",
        options
    );
}

function processMonth(
    options = {}
) {
    return callModule(
        "controller",
        "processMonth",
        options
    );
}

function processYear(
    options = {}
) {
    return callModule(
        "controller",
        "processYear",
        options
    );
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
            getSummary()
    };
}

/* =========================================================
   RESET
========================================================= */

function reset(
    options = {}
) {
    /*
    --------------------------------------------------------
    Reset em ordem reversa.
    --------------------------------------------------------
    */

    const resetOrder = [
        "controller",
        "router",
        "menu",
        "screen",
        "navigation",
        "dashboard",
        "ui",
        "bootstrap",
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
                // Reset individual não deve
                // interromper os demais.
            }
        }
    }

    lifeModuleState = {
        initialized: false,

        database:
            options.keepDatabase === false
                ? null
                : lifeModuleState.database,

        initializedModules: [],

        failedModules: [],

        lastInitializeAt: null,

        initializeCount: 0,

        errors: [],

        warnings: []
    };

    return getState();
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
            "Database não está conectado."
        );
    }

    if (
        !lifeModuleState.initialized
    ) {
        warnings.push(
            "Módulo LIFE ainda não foi totalmente inicializado."
        );
    }

    if (
        lifeModuleState.failedModules
            .length > 0
    ) {
        warnings.push(
            `Existem ${lifeModuleState.failedModules.length} módulos com falha.`
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

const lifeAPI = {
    version:
        LIFE_MODULE_VERSION,

    config: {
        version:
            LIFE_MODULE_VERSION,

        initializationOrder:
            [...LIFE_INITIALIZATION_ORDER]
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

    /* Refresh */
    refresh,

    /* Processing */
    processWeek,
    processMonth,
    processYear,

    /* State */
    getState,
    getSummary,
    snapshot,
    validate,

    /* Reset */
    reset
};

/* =========================================================
   GLOBAL
========================================================= */

if (
    typeof globalThis !==
    "undefined"
) {
    globalThis.lifeAPI =
        lifeAPI;

    globalThis.MMA_LIFE =
        lifeAPI;

    /*
    Também disponibilizamos os módulos individualmente
    para os arquivos que ainda trabalham através de
    globalThis.
    */

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
}

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
