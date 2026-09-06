/*
============================================================
MMA LIFE DYNASTY
LIFE BOOTSTRAP
============================================================

Responsabilidade:
- Inicializar o módulo LIFE.
- Preparar o database.
- Conectar o Life Controller ao estado do jogo.
- Garantir que os principais módulos LIFE estejam disponíveis.
- Inicializar o LIFE apenas uma vez.
- Permitir inicialização manual pelo main.js.
- Não avançar tempo do jogo.
- Não criar um segundo estado de jogo.
============================================================
*/

const LIFE_BOOTSTRAP_VERSION = 1;

const LIFE_BOOTSTRAP_CONFIG = {
    autoInitialize: true,

    defaultSection: "overview",

    syncHash: true,

    openOnStart: false,

    initializeUI: true,

    initializeSystems: true,

    validateOnStart: true
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

function generateId(
    prefix = "life_bootstrap"
) {
    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 9)}`;
}

/* =========================================================
   ESTADO
========================================================= */

function createBootstrapState() {
    return {
        version:
            LIFE_BOOTSTRAP_VERSION,

        initialized: false,

        database: null,

        startedAt: null,

        lastInitializeAt: null,

        initializeCount: 0,

        controllerInitialized: false,

        systemsInitialized: false,

        uiInitialized: false,

        validation: null,

        errors: [],

        warnings: [],

        history: [],

        maxHistory: 50,

        createdAt: Date.now(),

        updatedAt: Date.now()
    };
}

let bootstrapState =
    createBootstrapState();

/* =========================================================
   DATABASE
========================================================= */

function setDatabase(database) {
    bootstrapState.database =
        database || null;

    if (
        bootstrapState.database &&
        typeof bootstrapState.database ===
            "object"
    ) {
        const life =
            ensureObject(
                bootstrapState.database,
                "life"
            );

        if (
            !life.bootstrap ||
            typeof life.bootstrap !==
                "object"
        ) {
            life.bootstrap = {};
        }

        const saved =
            life.bootstrap;

        bootstrapState.initializeCount =
            Number(
                saved.initializeCount
            ) || 0;

        bootstrapState.startedAt =
            saved.startedAt ||
            null;
    }

    return bootstrapState.database;
}

function getDatabase() {
    return bootstrapState.database;
}

function persistState() {
    const database =
        bootstrapState.database;

    if (
        !database ||
        typeof database !== "object"
    ) {
        return;
    }

    const life =
        ensureObject(
            database,
            "life"
        );

    life.bootstrap = {
        version:
            LIFE_BOOTSTRAP_VERSION,

        initialized:
            bootstrapState.initialized,

        startedAt:
            bootstrapState.startedAt,

        lastInitializeAt:
            bootstrapState.lastInitializeAt,

        initializeCount:
            bootstrapState.initializeCount,

        controllerInitialized:
            bootstrapState.controllerInitialized,

        systemsInitialized:
            bootstrapState.systemsInitialized,

        uiInitialized:
            bootstrapState.uiInitialized,

        validation:
            clone(
                bootstrapState.validation
            ),

        updatedAt:
            Date.now()
    };
}

/* =========================================================
   API DISCOVERY
========================================================= */

function getAPI(name) {
    try {
        if (
            typeof globalThis !==
                "undefined" &&
            globalThis[name]
        ) {
            return globalThis[name];
        }
    } catch {
        // Ignorar.
    }

    return null;
}

function callAPI(
    api,
    methods,
    ...args
) {
    if (!api) {
        return {
            success: false,
            result: null,
            method: null,
            reason: "api_not_found"
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
            typeof api[method] ===
            "function"
        ) {
            try {
                return {
                    success: true,
                    result:
                        api[method](
                            ...args
                        ),
                    method
                };
            } catch (error) {
                return {
                    success: false,
                    result: null,
                    method,
                    error
                };
            }
        }
    }

    return {
        success: false,
        result: null,
        method: null,
        reason:
            "method_not_found"
    };
}

/* =========================================================
   COMPONENTES
========================================================= */

function getComponents() {
    return {
        controller:
            getAPI(
                "lifeControllerAPI"
            ),

        router:
            getAPI(
                "lifeRouterAPI"
            ),

        navigation:
            getAPI(
                "lifeNavigationAPI"
            ),

        screen:
            getAPI(
                "lifeScreenAPI"
            ),

        menu:
            getAPI(
                "lifeMenuAPI"
            ),

        dashboard:
            getAPI(
                "lifeDashboardAPI"
            ),

        ui:
            getAPI(
                "lifeUIAPI"
            ),

        integration:
            getAPI(
                "lifeIntegrationAPI"
            ),

        engine:
            getAPI(
                "lifeEngineAPI"
            ),

        events:
            getAPI(
                "lifeEventsAPI"
            ),

        history:
            getAPI(
                "lifeHistoryAPI"
            ),

        milestones:
            getAPI(
                "lifeMilestonesAPI"
            )
    };
}

/* =========================================================
   PREPARAÇÃO DO ESTADO LIFE
========================================================= */

function prepareLifeDatabase(
    database
) {
    if (
        !database ||
        typeof database !== "object"
    ) {
        return null;
    }

    const life =
        ensureObject(
            database,
            "life"
        );

    /*
    --------------------------------------------------------
    Metadados do LIFE
    --------------------------------------------------------
    */

    if (
        !life.meta ||
        typeof life.meta !== "object"
    ) {
        life.meta = {};
    }

    if (
        !life.meta.createdAt
    ) {
        life.meta.createdAt =
            Date.now();
    }

    life.meta.version =
        LIFE_BOOTSTRAP_VERSION;

    /*
    --------------------------------------------------------
    Estruturas básicas para evitar
    undefined durante inicialização.
    --------------------------------------------------------
    */

    ensureObject(
        life,
        "relationships",
        {}
    );

    ensureObject(
        life,
        "marriage",
        {}
    );

    ensureObject(
        life,
        "children",
        {}
    );

    ensureObject(
        life,
        "family",
        {}
    );

    ensureObject(
        life,
        "education",
        {}
    );

    ensureObject(
        life,
        "employment",
        {}
    );

    ensureObject(
        life,
        "residence",
        {}
    );

    ensureObject(
        life,
        "vehicles",
        {}
    );

    ensureObject(
        life,
        "lifestyle",
        {}
    );

    ensureObject(
        life,
        "engine",
        {}
    );

    ensureObject(
        life,
        "events",
        {}
    );

    ensureObject(
        life,
        "history",
        {}
    );

    ensureObject(
        life,
        "milestones",
        {}
    );

    ensureObject(
        life,
        "integration",
        {}
    );

    ensureObject(
        life,
        "navigation",
        {}
    );

    ensureObject(
        life,
        "screen",
        {}
    );

    ensureObject(
        life,
        "menu",
        {}
    );

    ensureObject(
        life,
        "dashboard",
        {}
    );

    ensureObject(
        life,
        "ui",
        {}
    );

    ensureObject(
        life,
        "router",
        {}
    );

    ensureObject(
        life,
        "controller",
        {}
    );

    return database;
}

/* =========================================================
   REGISTRO DE BOOTSTRAP
========================================================= */

function addBootstrapHistory(
    action,
    details = {}
) {
    const entry = {
        id:
            generateId(
                "life_boot"
            ),

        action,

        details:
            clone(details),

        timestamp:
            Date.now(),

        date:
            new Date().toISOString()
    };

    bootstrapState.history.push(
        entry
    );

    if (
        bootstrapState.history
            .length >
        bootstrapState.maxHistory
    ) {
        bootstrapState.history =
            bootstrapState.history.slice(
                -bootstrapState.maxHistory
            );
    }

    return entry;
}

/* =========================================================
   VALIDAÇÃO
========================================================= */

function validateDatabase(
    database
) {
    const errors = [];
    const warnings = [];

    if (
        !database ||
        typeof database !== "object"
    ) {
        errors.push(
            "Database do jogo não é válido."
        );

        return {
            valid: false,
            errors,
            warnings
        };
    }

    if (
        !database.life ||
        typeof database.life !==
            "object"
    ) {
        errors.push(
            "database.life não existe."
        );
    }

    if (
        !database.player
    ) {
        warnings.push(
            "database.player ainda não existe."
        );
    }

    if (
        !database.career
    ) {
        warnings.push(
            "database.career ainda não existe."
        );
    }

    if (
        !database.business
    ) {
        warnings.push(
            "database.business ainda não existe."
        );
    }

    return {
        valid:
            errors.length === 0,

        errors,

        warnings
    };
}

function validateComponents() {
    const components =
        getComponents();

    const errors = [];
    const warnings = [];

    const required = [
        "controller",
        "router",
        "navigation",
        "screen",
        "menu",
        "dashboard",
        "ui",
        "integration",
        "engine",
        "events",
        "history",
        "milestones"
    ];

    for (
        const name
        of required
    ) {
        if (
            !components[name]
        ) {
            warnings.push(
                `API ${name} não está disponível.`
            );
        }
    }

    return {
        valid:
            errors.length === 0,

        errors,

        warnings,

        available:
            Object.fromEntries(
                Object.entries(
                    components
                ).map(
                    ([name, api]) => [
                        name,
                        Boolean(api)
                    ]
                )
            )
    };
}

/* =========================================================
   INICIALIZAÇÃO DO CONTROLLER
========================================================= */

function initializeController(
    database,
    options
) {
    const controller =
        getAPI(
            "lifeControllerAPI"
        );

    if (!controller) {
        bootstrapState.warnings.push(
            "lifeControllerAPI não encontrada."
        );

        return {
            success: false,
            reason:
                "controller_not_available"
        };
    }

    const result =
        callAPI(
            controller,
            "initialize",
            database,
            {
                ...options,

                active:
                    options.openOnStart ===
                    true,

                section:
                    options.defaultSection ||
                    LIFE_BOOTSTRAP_CONFIG
                        .defaultSection,

                syncHash:
                    options.syncHash ??
                    LIFE_BOOTSTRAP_CONFIG
                        .syncHash
            }
        );

    bootstrapState.controllerInitialized =
        result.success;

    if (!result.success) {
        bootstrapState.errors.push({
            id:
                generateId(
                    "life_controller_error"
                ),

            action:
                "initialize-controller",

            message:
                result.error?.message ||
                result.reason ||
                "Erro ao inicializar Life Controller.",

            timestamp:
                Date.now()
        });
    }

    return result;
}

/* =========================================================
   INICIALIZAÇÃO DIRETA DOS SISTEMAS
========================================================= */

function initializeSystems(
    database,
    options
) {
    const results = {};

    const components =
        getComponents();

    /*
    --------------------------------------------------------
    Caso o Controller exista, ele é a autoridade principal.
    --------------------------------------------------------
    */

    if (
        components.controller
    ) {
        const controllerResult =
            callAPI(
                components.controller,
                "initialize",
                database,
                {
                    ...options,
                    force:
                        options.force === true
                }
            );

        results.controller =
            controllerResult;

        bootstrapState.controllerInitialized =
            controllerResult.success;

        bootstrapState.systemsInitialized =
            controllerResult.success;

        return results;
    }

    /*
    --------------------------------------------------------
    Fallback para inicialização manual.
    --------------------------------------------------------
    */

    const order = [
        "engine",
        "history",
        "events",
        "milestones",
        "integration",
        "navigation",
        "ui",
        "dashboard",
        "screen",
        "menu",
        "router"
    ];

    for (
        const name
        of order
    ) {
        const api =
            components[name];

        if (!api) {
            results[name] = {
                success: false,
                skipped: true,
                reason:
                    "api_not_available"
            };

            continue;
        }

        const result =
            callAPI(
                api,
                [
                    "initialize",
                    "init"
                ],
                database,
                options
            );

        results[name] =
            result;
    }

    bootstrapState.systemsInitialized =
        true;

    return results;
}

/* =========================================================
   INICIALIZAÇÃO DA UI
========================================================= */

function initializeUI(
    database,
    options
) {
    const components =
        getComponents();

    const results = {};

    const uiOrder = [
        "ui",
        "dashboard",
        "screen",
        "menu",
        "navigation",
        "router"
    ];

    for (
        const name
        of uiOrder
    ) {
        const api =
            components[name];

        if (!api) {
            results[name] = {
                success: false,
                skipped: true,
                reason:
                    "api_not_available"
            };

            continue;
        }

        /*
        ----------------------------------------------------
        Controller já pode ter inicializado o componente.
        Não forçar nova inicialização desnecessariamente.
        ----------------------------------------------------
        */

        if (
            components.controller
        ) {
            results[name] = {
                success: true,
                delegated: true
            };

            continue;
        }

        results[name] =
            callAPI(
                api,
                [
                    "initialize",
                    "init"
                ],
                database,
                options
            );
    }

    bootstrapState.uiInitialized =
        true;

    return results;
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
    Evita inicialização duplicada.
    --------------------------------------------------------
    */

    if (
        bootstrapState.initialized &&
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
        setDatabase(database);
    }

    if (
        !bootstrapState.database
    ) {
        bootstrapState.errors.push({
            id:
                generateId(
                    "life_bootstrap_error"
                ),

            action:
                "initialize",

            message:
                "Nenhum database foi fornecido ao Life Bootstrap.",

            timestamp:
                Date.now()
        });

        return {
            success: false,

            initialized: false,

            errors:
                clone(
                    bootstrapState.errors
                )
        };
    }

    prepareLifeDatabase(
        bootstrapState.database
    );

    /*
    --------------------------------------------------------
    Validação inicial
    --------------------------------------------------------
    */

    const databaseValidation =
        validateDatabase(
            bootstrapState.database
        );

    bootstrapState.validation =
        databaseValidation;

    if (
        LIFE_BOOTSTRAP_CONFIG
            .validateOnStart
    ) {
        bootstrapState.warnings.push(
            ...databaseValidation
                .warnings
        );

        bootstrapState.errors.push(
            ...databaseValidation
                .errors
                .map(
                    message => ({
                        id:
                            generateId(
                                "life_validation_error"
                            ),

                        action:
                            "validation",

                        message,

                        timestamp:
                            Date.now()
                    })
                )
        );
    }

    /*
    --------------------------------------------------------
    Validação dos componentes
    --------------------------------------------------------
    */

    const componentValidation =
        validateComponents();

    bootstrapState.warnings.push(
        ...componentValidation
            .warnings
    );

    /*
    --------------------------------------------------------
    Configuração efetiva
    --------------------------------------------------------
    */

    const effectiveOptions = {
        ...LIFE_BOOTSTRAP_CONFIG,
        ...options,

        defaultSection:
            options.defaultSection ||
            LIFE_BOOTSTRAP_CONFIG
                .defaultSection,

        syncHash:
            options.syncHash ??
            LIFE_BOOTSTRAP_CONFIG
                .syncHash
    };

    /*
    --------------------------------------------------------
    Inicialização dos sistemas
    --------------------------------------------------------
    */

    let systemResults = null;

    if (
        effectiveOptions
            .initializeSystems !==
        false
    ) {
        systemResults =
            initializeSystems(
                bootstrapState.database,
                effectiveOptions
            );
    }

    /*
    --------------------------------------------------------
    Inicialização UI
    --------------------------------------------------------
    */

    let uiResults = null;

    if (
        effectiveOptions
            .initializeUI !==
        false
    ) {
        uiResults =
            initializeUI(
                bootstrapState.database,
                effectiveOptions
            );
    }

    /*
    --------------------------------------------------------
    Estado final
    --------------------------------------------------------
    */

    bootstrapState.initialized =
        true;

    bootstrapState.initializeCount +=
        1;

    bootstrapState.lastInitializeAt =
        Date.now();

    if (
        !bootstrapState.startedAt
    ) {
        bootstrapState.startedAt =
            Date.now();
    }

    bootstrapState.updatedAt =
        Date.now();

    addBootstrapHistory(
        "initialize",
        {
            section:
                effectiveOptions
                    .defaultSection,

            systemsInitialized:
                bootstrapState
                    .systemsInitialized,

            uiInitialized:
                bootstrapState
                    .uiInitialized
        }
    );

    persistState();

    return {
        success: true,

        initialized: true,

        database:
            bootstrapState.database,

        systems:
            systemResults,

        ui:
            uiResults,

        validation:
            clone(
                bootstrapState.validation
            ),

        components:
            componentValidation,

        state:
            getState()
    };
}

/* =========================================================
   OPEN
========================================================= */

function open(
    section = null
) {
    const controller =
        getAPI(
            "lifeControllerAPI"
        );

    if (!controller) {
        return {
            success: false,
            reason:
                "controller_not_available"
        };
    }

    const result =
        callAPI(
            controller,
            "open",
            {
                section:
                    section ||
                    LIFE_BOOTSTRAP_CONFIG
                        .defaultSection,

                reason:
                    "bootstrap-open"
            }
        );

    return result;
}

/* =========================================================
   CLOSE
========================================================= */

function close() {
    const controller =
        getAPI(
            "lifeControllerAPI"
        );

    if (!controller) {
        return {
            success: false,
            reason:
                "controller_not_available"
        };
    }

    return callAPI(
        controller,
        "close",
        {
            reason:
                "bootstrap-close"
        }
    );
}

/* =========================================================
   REFRESH
========================================================= */

function refresh(
    options = {}
) {
    const controller =
        getAPI(
            "lifeControllerAPI"
        );

    if (!controller) {
        return {
            success: false,
            reason:
                "controller_not_available"
        };
    }

    return callAPI(
        controller,
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
    const controller =
        getAPI(
            "lifeControllerAPI"
        );

    if (!controller) {
        return {
            success: false,
            reason:
                "controller_not_available"
        };
    }

    return callAPI(
        controller,
        "processWeek",
        options
    );
}

function processMonth(
    options = {}
) {
    const controller =
        getAPI(
            "lifeControllerAPI"
        );

    if (!controller) {
        return {
            success: false,
            reason:
                "controller_not_available"
        };
    }

    return callAPI(
        controller,
        "processMonth",
        options
    );
}

function processYear(
    options = {}
) {
    const controller =
        getAPI(
            "lifeControllerAPI"
        );

    if (!controller) {
        return {
            success: false,
            reason:
                "controller_not_available"
        };
    }

    return callAPI(
        controller,
        "processYear",
        options
    );
}

/* =========================================================
   CONFIGURAÇÃO
========================================================= */

function getConfig() {
    return clone(
        LIFE_BOOTSTRAP_CONFIG
    );
}

function configure(
    options = {}
) {
    if (
        typeof options.autoInitialize ===
        "boolean"
    ) {
        LIFE_BOOTSTRAP_CONFIG
            .autoInitialize =
            options.autoInitialize;
    }

    if (
        typeof options.defaultSection ===
        "string"
    ) {
        LIFE_BOOTSTRAP_CONFIG
            .defaultSection =
            options.defaultSection;
    }

    if (
        typeof options.syncHash ===
        "boolean"
    ) {
        LIFE_BOOTSTRAP_CONFIG
            .syncHash =
            options.syncHash;
    }

    if (
        typeof options.openOnStart ===
        "boolean"
    ) {
        LIFE_BOOTSTRAP_CONFIG
            .openOnStart =
            options.openOnStart;
    }

    if (
        typeof options.initializeUI ===
        "boolean"
    ) {
        LIFE_BOOTSTRAP_CONFIG
            .initializeUI =
            options.initializeUI;
    }

    if (
        typeof options.initializeSystems ===
        "boolean"
    ) {
        LIFE_BOOTSTRAP_CONFIG
            .initializeSystems =
            options.initializeSystems;
    }

    if (
        typeof options.validateOnStart ===
        "boolean"
    ) {
        LIFE_BOOTSTRAP_CONFIG
            .validateOnStart =
            options.validateOnStart;
    }

    return getConfig();
}

/* =========================================================
   ESTADO
========================================================= */

function getState() {
    return {
        version:
            LIFE_BOOTSTRAP_VERSION,

        initialized:
            bootstrapState.initialized,

        startedAt:
            bootstrapState.startedAt,

        lastInitializeAt:
            bootstrapState.lastInitializeAt,

        initializeCount:
            bootstrapState.initializeCount,

        controllerInitialized:
            bootstrapState.controllerInitialized,

        systemsInitialized:
            bootstrapState.systemsInitialized,

        uiInitialized:
            bootstrapState.uiInitialized,

        validation:
            clone(
                bootstrapState.validation
            ),

        errors:
            clone(
                bootstrapState.errors
            ),

        warnings:
            clone(
                bootstrapState.warnings
            ),

        history:
            clone(
                bootstrapState.history
            ),

        updatedAt:
            bootstrapState.updatedAt
    };
}

function getSummary() {
    return {
        initialized:
            bootstrapState.initialized,

        controllerInitialized:
            bootstrapState
                .controllerInitialized,

        systemsInitialized:
            bootstrapState
                .systemsInitialized,

        uiInitialized:
            bootstrapState
                .uiInitialized,

        initializeCount:
            bootstrapState
                .initializeCount,

        errors:
            bootstrapState
                .errors.length,

        warnings:
            bootstrapState
                .warnings.length
    };
}

/* =========================================================
   SNAPSHOT
========================================================= */

function snapshot() {
    return {
        version:
            LIFE_BOOTSTRAP_VERSION,

        config:
            getConfig(),

        state:
            getState(),

        summary:
            getSummary()
    };
}

/* =========================================================
   RESET
========================================================= */

function reset() {
    bootstrapState =
        createBootstrapState();

    return getState();
}

/* =========================================================
   API
========================================================= */

const lifeBootstrapAPI = {
    version:
        LIFE_BOOTSTRAP_VERSION,

    config:
        LIFE_BOOTSTRAP_CONFIG,

    /* Database */
    setDatabase,
    getDatabase,

    /* Components */
    getComponents,

    /* Preparation */
    prepareLifeDatabase,

    /* Validation */
    validateDatabase,
    validateComponents,

    /* Lifecycle */
    initialize,
    open,
    close,
    refresh,

    /* Processing */
    processWeek,
    processMonth,
    processYear,

    /* Configuration */
    getConfig,
    configure,

    /* State */
    getState,
    getSummary,
    snapshot,
    reset
};

/* =========================================================
   GLOBAL
========================================================= */

if (
    typeof globalThis !==
    "undefined"
) {
    globalThis.lifeBootstrapAPI =
        lifeBootstrapAPI;
}

/* =========================================================
   EXPORT
========================================================= */

export {
    LIFE_BOOTSTRAP_VERSION,
    LIFE_BOOTSTRAP_CONFIG,
    lifeBootstrapAPI,

    setDatabase,
    getDatabase,

    getComponents,

    prepareLifeDatabase,

    validateDatabase,
    validateComponents,

    initialize,
    open,
    close,
    refresh,

    processWeek,
    processMonth,
    processYear,

    getConfig,
    configure,

    getState,
    getSummary,
    snapshot,
    reset
};

export default lifeBootstrapAPI;
