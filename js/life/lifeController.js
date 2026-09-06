/*
============================================================
MMA LIFE DYNASTY
LIFE CONTROLLER
============================================================

Responsabilidade:
- Ser o controlador central do módulo LIFE.
- Inicializar os componentes LIFE na ordem correta.
- Conectar Router, Navigation, Screen, Menu e Dashboard.
- Integrar Life Engine, Life Events, Life History,
  Life Milestones e Life Integration.
- Controlar abertura/fechamento do módulo LIFE.
- Centralizar refresh.
- Evitar inicializações duplicadas.
- Servir como ponto principal para o main.js.
============================================================
*/

const LIFE_CONTROLLER_VERSION = 1;

const LIFE_CONTROLLER_CONFIG = {
    rootId: "life",

    autoInitialize: true,

    autoRefresh: false,

    refreshInterval: 5000,

    defaultSection: "overview",

    syncHash: true,

    components: {
        engine: true,
        events: true,
        history: true,
        milestones: true,
        integration: true,
        navigation: true,
        ui: true,
        dashboard: true,
        screen: true,
        menu: true
    }
};

/* =========================================================
   UTILITÁRIOS
========================================================= */

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

function ensureObject(parent, key, fallback = {}) {
    if (!parent[key] || typeof parent[key] !== "object") {
        parent[key] = fallback;
    }

    return parent[key];
}

function getPath(object, path, fallback = undefined) {
    if (!object || !path) {
        return fallback;
    }

    const parts = String(path).split(".");
    let current = object;

    for (const part of parts) {
        if (
            current === null ||
            current === undefined ||
            !Object.prototype.hasOwnProperty.call(current, part)
        ) {
            return fallback;
        }

        current = current[part];
    }

    return current === undefined
        ? fallback
        : current;
}

function generateId(prefix = "life_controller") {
    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 9)}`;
}

/* =========================================================
   ESTADO
========================================================= */

function createControllerState() {
    return {
        version: LIFE_CONTROLLER_VERSION,

        initialized: false,

        active: false,

        database: null,

        currentSection: LIFE_CONTROLLER_CONFIG.defaultSection,

        previousSection: null,

        lastInitializedAt: null,

        lastRefreshAt: null,

        lastProcessAt: null,

        refreshCount: 0,

        processCount: 0,

        errors: [],

        warnings: [],

        modules: {},

        refreshTimer: null,

        listeners: [],

        createdAt: Date.now(),

        updatedAt: Date.now()
    };
}

let controllerState = createControllerState();

/* =========================================================
   DATABASE
========================================================= */

function setDatabase(database) {
    controllerState.database =
        database || null;

    if (
        controllerState.database &&
        typeof controllerState.database === "object"
    ) {
        const life = ensureObject(
            controllerState.database,
            "life"
        );

        if (
            !life.controller ||
            typeof life.controller !== "object"
        ) {
            life.controller = {};
        }

        const saved = life.controller;

        controllerState.currentSection =
            saved.currentSection ||
            controllerState.currentSection;

        controllerState.previousSection =
            saved.previousSection ??
            controllerState.previousSection;

        controllerState.refreshCount =
            Number(saved.refreshCount) || 0;

        controllerState.processCount =
            Number(saved.processCount) || 0;
    }

    return controllerState.database;
}

function getDatabase() {
    return controllerState.database;
}

function persistState() {
    const database =
        controllerState.database;

    if (
        !database ||
        typeof database !== "object"
    ) {
        return;
    }

    const life =
        ensureObject(database, "life");

    life.controller = {
        version:
            LIFE_CONTROLLER_VERSION,

        initialized:
            controllerState.initialized,

        active:
            controllerState.active,

        currentSection:
            controllerState.currentSection,

        previousSection:
            controllerState.previousSection,

        lastInitializedAt:
            controllerState.lastInitializedAt,

        lastRefreshAt:
            controllerState.lastRefreshAt,

        lastProcessAt:
            controllerState.lastProcessAt,

        refreshCount:
            controllerState.refreshCount,

        processCount:
            controllerState.processCount,

        modules:
            clone(controllerState.modules),

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
            typeof globalThis !== "undefined" &&
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

    for (const method of methodList) {
        if (
            typeof api[method] ===
            "function"
        ) {
            try {
                return {
                    success: true,
                    result:
                        api[method](...args),
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
        reason: "method_not_found"
    };
}

/* =========================================================
   COMPONENTES
========================================================= */

function getComponents() {
    return {
        engine:
            getAPI("lifeEngineAPI"),

        events:
            getAPI("lifeEventsAPI"),

        history:
            getAPI("lifeHistoryAPI"),

        milestones:
            getAPI("lifeMilestonesAPI"),

        integration:
            getAPI("lifeIntegrationAPI"),

        navigation:
            getAPI("lifeNavigationAPI"),

        ui:
            getAPI("lifeUIAPI"),

        dashboard:
            getAPI("lifeDashboardAPI"),

        screen:
            getAPI("lifeScreenAPI"),

        menu:
            getAPI("lifeMenuAPI"),

        router:
            getAPI("lifeRouterAPI")
    };
}

function registerComponents() {
    const components =
        getComponents();

    controllerState.modules = {};

    for (
        const [name, api]
        of Object.entries(components)
    ) {
        controllerState.modules[name] = {
            available:
                Boolean(api),

            initialized: false,

            lastAction: null,

            lastActionAt: null
        };
    }

    return components;
}

/* =========================================================
   REGISTRO DE MÓDULO
========================================================= */

function markModule(
    name,
    initialized,
    action = null
) {
    if (
        !controllerState.modules[name]
    ) {
        controllerState.modules[name] = {
            available: false,
            initialized: false,
            lastAction: null,
            lastActionAt: null
        };
    }

    controllerState.modules[name].initialized =
        Boolean(initialized);

    if (action) {
        controllerState.modules[name].lastAction =
            action;

        controllerState.modules[name].lastActionAt =
            Date.now();
    }
}

/* =========================================================
   INICIALIZAÇÃO DE COMPONENTES
========================================================= */

function initializeComponent(
    name,
    api,
    options = {}
) {
    if (!api) {
        markModule(
            name,
            false,
            "unavailable"
        );

        return {
            success: false,
            skipped: true,
            reason: "api_not_found"
        };
    }

    const result =
        callAPI(
            api,
            [
                "initialize",
                "init"
            ],
            controllerState.database,
            options
        );

    if (result.success) {
        markModule(
            name,
            true,
            "initialize"
        );
    } else {
        markModule(
            name,
            false,
            "initialize_error"
        );

        controllerState.errors.push({
            id: generateId("life_error"),
            module: name,
            action: "initialize",
            message:
                result.error?.message ||
                result.reason ||
                "Erro ao inicializar módulo.",
            timestamp: Date.now()
        });
    }

    return result;
}

/* =========================================================
   ORDEM DE INICIALIZAÇÃO
========================================================= */

function initializeSystems(options = {}) {
    const components =
        getComponents();

    const results = {};

    /*
    --------------------------------------------------------
    1. ENGINE
    --------------------------------------------------------
    */

    if (
        LIFE_CONTROLLER_CONFIG
            .components.engine
    ) {
        results.engine =
            initializeComponent(
                "engine",
                components.engine,
                options
            );
    }

    /*
    --------------------------------------------------------
    2. HISTORY
    --------------------------------------------------------
    */

    if (
        LIFE_CONTROLLER_CONFIG
            .components.history
    ) {
        results.history =
            initializeComponent(
                "history",
                components.history,
                options
            );
    }

    /*
    --------------------------------------------------------
    3. EVENTS
    --------------------------------------------------------
    */

    if (
        LIFE_CONTROLLER_CONFIG
            .components.events
    ) {
        results.events =
            initializeComponent(
                "events",
                components.events,
                options
            );
    }

    /*
    --------------------------------------------------------
    4. MILESTONES
    --------------------------------------------------------
    */

    if (
        LIFE_CONTROLLER_CONFIG
            .components.milestones
    ) {
        results.milestones =
            initializeComponent(
                "milestones",
                components.milestones,
                options
            );
    }

    /*
    --------------------------------------------------------
    5. INTEGRATION
    --------------------------------------------------------
    */

    if (
        LIFE_CONTROLLER_CONFIG
            .components.integration
    ) {
        results.integration =
            initializeComponent(
                "integration",
                components.integration,
                options
            );
    }

    /*
    --------------------------------------------------------
    6. NAVIGATION
    --------------------------------------------------------
    */

    if (
        LIFE_CONTROLLER_CONFIG
            .components.navigation
    ) {
        results.navigation =
            initializeComponent(
                "navigation",
                components.navigation,
                {
                    ...options,
                    section:
                        options.section ||
                        controllerState.currentSection
                }
            );
    }

    /*
    --------------------------------------------------------
    7. UI
    --------------------------------------------------------
    */

    if (
        LIFE_CONTROLLER_CONFIG
            .components.ui
    ) {
        results.ui =
            initializeComponent(
                "ui",
                components.ui,
                options
            );
    }

    /*
    --------------------------------------------------------
    8. DASHBOARD
    --------------------------------------------------------
    */

    if (
        LIFE_CONTROLLER_CONFIG
            .components.dashboard
    ) {
        results.dashboard =
            initializeComponent(
                "dashboard",
                components.dashboard,
                options
            );
    }

    /*
    --------------------------------------------------------
    9. SCREEN
    --------------------------------------------------------
    */

    if (
        LIFE_CONTROLLER_CONFIG
            .components.screen
    ) {
        results.screen =
            initializeComponent(
                "screen",
                components.screen,
                {
                    ...options,
                    defaultSection:
                        options.section ||
                        controllerState.currentSection
                }
            );
    }

    /*
    --------------------------------------------------------
    10. MENU
    --------------------------------------------------------
    */

    if (
        LIFE_CONTROLLER_CONFIG
            .components.menu
    ) {
        results.menu =
            initializeComponent(
                "menu",
                components.menu,
                {
                    ...options,
                    defaultSection:
                        options.section ||
                        controllerState.currentSection
                }
            );
    }

    /*
    --------------------------------------------------------
    11. ROUTER
    --------------------------------------------------------
    */

    if (components.router) {
        results.router =
            initializeComponent(
                "router",
                components.router,
                {
                    ...options,
                    section:
                        options.section ||
                        controllerState.currentSection,
                    syncHash:
                        options.syncHash ??
                        LIFE_CONTROLLER_CONFIG.syncHash
                }
            );
    }

    return results;
}

/* =========================================================
   NAVEGAÇÃO
========================================================= */

function navigate(
    section,
    options = {}
) {
    const router =
        getAPI("lifeRouterAPI");

    if (router) {
        const result =
            callAPI(
                router,
                [
                    "navigate",
                    "goTo"
                ],
                section,
                options
            );

        if (result.success) {
            controllerState.previousSection =
                controllerState.currentSection;

            controllerState.currentSection =
                result.result?.section ||
                section;

            persistState();

            return result.result;
        }
    }

    const navigation =
        getAPI("lifeNavigationAPI");

    if (navigation) {
        const result =
            callAPI(
                navigation,
                [
                    "navigate",
                    "goTo"
                ],
                section,
                options
            );

        if (result.success) {
            controllerState.previousSection =
                controllerState.currentSection;

            controllerState.currentSection =
                section;

            persistState();

            return result.result;
        }
    }

    return {
        success: false,
        section,
        reason: "router_not_available"
    };
}

function goHome(options = {}) {
    return navigate(
        LIFE_CONTROLLER_CONFIG.defaultSection,
        {
            ...options,
            reason:
                options.reason ||
                "controller-home"
        }
    );
}

function goBack(options = {}) {
    const router =
        getAPI("lifeRouterAPI");

    if (router) {
        const result =
            callAPI(
                router,
                "goBack",
                options
            );

        if (result.success) {
            controllerState.currentSection =
                result.result?.section ||
                controllerState.currentSection;

            persistState();

            return result.result;
        }
    }

    return goHome({
        ...options,
        reason:
            options.reason ||
            "controller-back"
    });
}

/* =========================================================
   REFRESH
========================================================= */

function refresh(options = {}) {
    controllerState.refreshCount += 1;

    controllerState.lastRefreshAt =
        Date.now();

    const results = {};

    const router =
        getAPI("lifeRouterAPI");

    const screen =
        getAPI("lifeScreenAPI");

    const dashboard =
        getAPI("lifeDashboardAPI");

    const menu =
        getAPI("lifeMenuAPI");

    const ui =
        getAPI("lifeUIAPI");

    /*
    --------------------------------------------------------
    Router
    --------------------------------------------------------
    */

    if (router) {
        results.router =
            callAPI(
                router,
                "refresh",
                {
                    ...options,
                    reason:
                        options.reason ||
                        "controller-refresh"
                }
            );
    }

    /*
    --------------------------------------------------------
    Screen
    --------------------------------------------------------
    */

    if (screen) {
        results.screen =
            callAPI(
                screen,
                "refresh",
                {
                    ...options,
                    reason:
                        options.reason ||
                        "controller-refresh"
                }
            );
    }

    /*
    --------------------------------------------------------
    Dashboard
    --------------------------------------------------------
    */

    if (dashboard) {
        results.dashboard =
            callAPI(
                dashboard,
                "refresh",
                {
                    ...options,
                    reason:
                        options.reason ||
                        "controller-refresh"
                }
            );
    }

    /*
    --------------------------------------------------------
    Menu
    --------------------------------------------------------
    */

    if (menu) {
        results.menu =
            callAPI(
                menu,
                "refresh",
                {
                    ...options,
                    reason:
                        options.reason ||
                        "controller-refresh"
                }
            );
    }

    /*
    --------------------------------------------------------
    UI
    --------------------------------------------------------
    */

    if (ui) {
        results.ui =
            callAPI(
                ui,
                "refresh",
                {
                    ...options,
                    reason:
                        options.reason ||
                        "controller-refresh"
                }
            );
    }

    controllerState.updatedAt =
        Date.now();

    persistState();

    const payload = {
        success: true,

        section:
            controllerState.currentSection,

        results,

        refreshCount:
            controllerState.refreshCount,

        timestamp:
            Date.now()
    };

    notifyListeners({
        type: "life:refresh",
        ...payload
    });

    return payload;
}

/* =========================================================
   PROCESSAMENTO DO LIFE
========================================================= */

function processWeek(options = {}) {
    const integration =
        getAPI("lifeIntegrationAPI");

    const engine =
        getAPI("lifeEngineAPI");

    controllerState.processCount += 1;

    controllerState.lastProcessAt =
        Date.now();

    let result = null;

    if (integration) {
        result =
            callAPI(
                integration,
                [
                    "processLifeWeek",
                    "processWeek"
                ],
                options
            );
    }

    if (
        !result ||
        !result.success
    ) {
        if (engine) {
            result =
                callAPI(
                    engine,
                    [
                        "processLifeWeek",
                        "processWeek"
                    ],
                    options
                );
        }
    }

    persistState();

    notifyListeners({
        type: "life:week",
        result,
        timestamp: Date.now()
    });

    return result;
}

function processMonth(options = {}) {
    const integration =
        getAPI("lifeIntegrationAPI");

    const engine =
        getAPI("lifeEngineAPI");

    controllerState.processCount += 1;

    controllerState.lastProcessAt =
        Date.now();

    let result = null;

    if (integration) {
        result =
            callAPI(
                integration,
                [
                    "processLifeMonth",
                    "processMonth"
                ],
                options
            );
    }

    if (
        !result ||
        !result.success
    ) {
        if (engine) {
            result =
                callAPI(
                    engine,
                    [
                        "processLifeMonth",
                        "processMonth"
                    ],
                    options
                );
        }
    }

    persistState();

    notifyListeners({
        type: "life:month",
        result,
        timestamp: Date.now()
    });

    return result;
}

function processYear(options = {}) {
    const integration =
        getAPI("lifeIntegrationAPI");

    const engine =
        getAPI("lifeEngineAPI");

    controllerState.processCount += 1;

    controllerState.lastProcessAt =
        Date.now();

    let result = null;

    if (integration) {
        result =
            callAPI(
                integration,
                [
                    "processLifeYear",
                    "processYear"
                ],
                options
            );
    }

    if (
        !result ||
        !result.success
    ) {
        if (engine) {
            result =
                callAPI(
                    engine,
                    [
                        "processLifeYear",
                        "processYear"
                    ],
                    options
                );
        }
    }

    persistState();

    notifyListeners({
        type: "life:year",
        result,
        timestamp: Date.now()
    });

    return result;
}

function processCycle(
    cycle,
    options = {}
) {
    const normalized =
        String(
            cycle || "month"
        ).toLowerCase();

    switch (normalized) {
        case "week":
        case "weekly":
        case "semana":
            return processWeek(options);

        case "year":
        case "yearly":
        case "ano":
        case "ano":
        case "yearly":
            return processYear(options);

        case "month":
        case "monthly":
        case "mes":
        default:
            return processMonth(options);
    }
}

/* =========================================================
   ABRIR / FECHAR LIFE
========================================================= */

function open(options = {}) {
    controllerState.active = true;

    if (options.section) {
        controllerState.currentSection =
            options.section;
    }

    const result =
        navigate(
            controllerState.currentSection,
            {
                ...options,
                reason:
                    options.reason ||
                    "open-life"
            }
        );

    persistState();

    notifyListeners({
        type: "life:open",
        section:
            controllerState.currentSection,
        result,
        timestamp: Date.now()
    });

    return {
        success: true,
        active: true,
        section:
            controllerState.currentSection,
        result
    };
}

function close(options = {}) {
    controllerState.active = false;

    persistState();

    notifyListeners({
        type: "life:close",
        timestamp: Date.now(),
        reason:
            options.reason ||
            "close-life"
    });

    return {
        success: true,
        active: false
    };
}

function toggle(options = {}) {
    if (controllerState.active) {
        return close(options);
    }

    return open(options);
}

/* =========================================================
   AUTO REFRESH
========================================================= */

function startAutoRefresh() {
    stopAutoRefresh();

    if (
        typeof window === "undefined"
    ) {
        return false;
    }

    const interval =
        Number(
            LIFE_CONTROLLER_CONFIG
                .refreshInterval
        );

    if (
        !Number.isFinite(interval) ||
        interval <= 0
    ) {
        return false;
    }

    controllerState.refreshTimer =
        window.setInterval(
            () => {
                if (
                    controllerState.active
                ) {
                    refresh({
                        reason:
                            "auto-refresh"
                    });
                }
            },
            interval
        );

    return true;
}

function stopAutoRefresh() {
    if (
        controllerState.refreshTimer
    ) {
        if (
            typeof window !==
            "undefined"
        ) {
            window.clearInterval(
                controllerState.refreshTimer
            );
        }

        controllerState.refreshTimer =
            null;
    }

    return true;
}

/* =========================================================
   LISTENERS
========================================================= */

function addListener(callback) {
    if (
        typeof callback !==
        "function"
    ) {
        return false;
    }

    if (
        !controllerState.listeners
            .includes(callback)
    ) {
        controllerState.listeners.push(
            callback
        );
    }

    return true;
}

function removeListener(callback) {
    const index =
        controllerState.listeners
            .indexOf(callback);

    if (index === -1) {
        return false;
    }

    controllerState.listeners.splice(
        index,
        1
    );

    return true;
}

function notifyListeners(payload) {
    const listeners = [
        ...controllerState.listeners
    ];

    for (const listener of listeners) {
        try {
            listener(payload);
        } catch (error) {
            console.error(
                "[lifeController] Listener error:",
                error
            );
        }
    }
}

/* =========================================================
   INICIALIZAÇÃO PRINCIPAL
========================================================= */

function initialize(
    database = null,
    options = {}
) {
    if (
        controllerState.initialized &&
        !options.force
    ) {
        return getState();
    }

    if (database) {
        setDatabase(database);
    }

    if (
        !controllerState.database
    ) {
        setDatabase({});
    }

    controllerState.errors = [];
    controllerState.warnings = [];

    controllerState.currentSection =
        options.section ||
        LIFE_CONTROLLER_CONFIG.defaultSection;

    controllerState.initialized = true;

    controllerState.active =
        options.active ??
        false;

    controllerState.lastInitializedAt =
        Date.now();

    controllerState.updatedAt =
        Date.now();

    registerComponents();

    const systemResults =
        initializeSystems(
            options
        );

    /*
    --------------------------------------------------------
    Router deve ser a autoridade final da seção.
    --------------------------------------------------------
    */

    const router =
        getAPI("lifeRouterAPI");

    if (router) {
        const current =
            callAPI(
                router,
                "getCurrentSection"
            );

        if (
            current.success &&
            current.result
        ) {
            controllerState.currentSection =
                current.result;
        }
    }

    /*
    --------------------------------------------------------
    Auto refresh
    --------------------------------------------------------
    */

    if (
        options.autoRefresh ??
        LIFE_CONTROLLER_CONFIG.autoRefresh
    ) {
        startAutoRefresh();
    }

    persistState();

    const payload = {
        success: true,

        initialized: true,

        active:
            controllerState.active,

        currentSection:
            controllerState.currentSection,

        systems:
            systemResults,

        modules:
            clone(controllerState.modules),

        errors:
            clone(controllerState.errors),

        warnings:
            clone(controllerState.warnings),

        timestamp:
            Date.now()
    };

    notifyListeners({
        type: "life:initialized",
        ...payload
    });

    return payload;
}

/* =========================================================
   DESTROY
========================================================= */

function destroy() {
    stopAutoRefresh();

    const components =
        getComponents();

    const destroyOrder = [
        "menu",
        "screen",
        "dashboard",
        "ui",
        "navigation",
        "integration",
        "milestones",
        "events",
        "history",
        "engine"
    ];

    for (
        const name
        of destroyOrder
    ) {
        const api =
            components[name];

        if (!api) {
            continue;
        }

        const result =
            callAPI(
                api,
                "destroy"
            );

        if (result.success) {
            markModule(
                name,
                false,
                "destroy"
            );
        }
    }

    controllerState.active = false;

    controllerState.initialized =
        false;

    persistState();

    return true;
}

/* =========================================================
   RESET
========================================================= */

function reset(options = {}) {
    stopAutoRefresh();

    const components =
        getComponents();

    const resetOrder = [
        "integration",
        "milestones",
        "events",
        "history",
        "engine",
        "navigation",
        "ui",
        "dashboard",
        "screen",
        "menu",
        "router"
    ];

    for (
        const name
        of resetOrder
    ) {
        const api =
            components[name];

        if (!api) {
            continue;
        }

        callAPI(
            api,
            "reset",
            options
        );
    }

    controllerState =
        createControllerState();

    if (
        options.database
    ) {
        setDatabase(
            options.database
        );
    }

    if (
        controllerState.database
    ) {
        persistState();
    }

    return getState();
}

/* =========================================================
   CONFIGURAÇÃO
========================================================= */

function getConfig() {
    return clone(
        LIFE_CONTROLLER_CONFIG
    );
}

function configure(options = {}) {
    if (
        typeof options.rootId ===
        "string" &&
        options.rootId.trim()
    ) {
        LIFE_CONTROLLER_CONFIG.rootId =
            options.rootId.trim();
    }

    if (
        typeof options.autoInitialize ===
        "boolean"
    ) {
        LIFE_CONTROLLER_CONFIG
            .autoInitialize =
            options.autoInitialize;
    }

    if (
        typeof options.autoRefresh ===
        "boolean"
    ) {
        LIFE_CONTROLLER_CONFIG
            .autoRefresh =
            options.autoRefresh;
    }

    if (
        Number.isFinite(
            options.refreshInterval
        ) &&
        options.refreshInterval > 0
    ) {
        LIFE_CONTROLLER_CONFIG
            .refreshInterval =
            options.refreshInterval;
    }

    if (
        typeof options.defaultSection ===
        "string"
    ) {
        LIFE_CONTROLLER_CONFIG
            .defaultSection =
            options.defaultSection;
    }

    if (
        typeof options.syncHash ===
        "boolean"
    ) {
        LIFE_CONTROLLER_CONFIG
            .syncHash =
            options.syncHash;
    }

    if (
        options.components &&
        typeof options.components ===
            "object"
    ) {
        LIFE_CONTROLLER_CONFIG
            .components = {
                ...LIFE_CONTROLLER_CONFIG.components,
                ...options.components
            };
    }

    return getConfig();
}

/* =========================================================
   ESTADO
========================================================= */

function getState() {
    return {
        version:
            LIFE_CONTROLLER_VERSION,

        initialized:
            controllerState.initialized,

        active:
            controllerState.active,

        currentSection:
            controllerState.currentSection,

        previousSection:
            controllerState.previousSection,

        lastInitializedAt:
            controllerState.lastInitializedAt,

        lastRefreshAt:
            controllerState.lastRefreshAt,

        lastProcessAt:
            controllerState.lastProcessAt,

        refreshCount:
            controllerState.refreshCount,

        processCount:
            controllerState.processCount,

        modules:
            clone(controllerState.modules),

        errors:
            clone(controllerState.errors),

        warnings:
            clone(controllerState.warnings),

        autoRefresh:
            Boolean(
                controllerState.refreshTimer
            ),

        updatedAt:
            controllerState.updatedAt
    };
}

/* =========================================================
   SUMMARY
========================================================= */

function getSummary() {
    const modules =
        controllerState.modules;

    let available = 0;
    let initialized = 0;

    for (
        const module
        of Object.values(modules)
    ) {
        if (module.available) {
            available++;
        }

        if (module.initialized) {
            initialized++;
        }
    }

    return {
        initialized:
            controllerState.initialized,

        active:
            controllerState.active,

        section:
            controllerState.currentSection,

        modulesAvailable:
            available,

        modulesInitialized:
            initialized,

        moduleCount:
            Object.keys(modules).length,

        refreshCount:
            controllerState.refreshCount,

        processCount:
            controllerState.processCount,

        errors:
            controllerState.errors.length,

        warnings:
            controllerState.warnings.length
    };
}

/* =========================================================
   SNAPSHOT
========================================================= */

function snapshot() {
    return {
        version:
            LIFE_CONTROLLER_VERSION,

        state:
            getState(),

        summary:
            getSummary(),

        config:
            getConfig()
    };
}

/* =========================================================
   VALIDAÇÃO
========================================================= */

function validate() {
    const errors = [];
    const warnings = [];

    if (
        !controllerState.initialized
    ) {
        warnings.push(
            "Life Controller ainda não foi inicializado."
        );
    }

    if (
        typeof controllerState.currentSection !==
        "string"
    ) {
        errors.push(
            "currentSection inválida."
        );
    }

    if (
        !controllerState.modules ||
        typeof controllerState.modules !==
            "object"
    ) {
        errors.push(
            "Registro de módulos inválido."
        );
    }

    if (
        controllerState.refreshCount <
        0
    ) {
        errors.push(
            "refreshCount inválido."
        );
    }

    if (
        controllerState.processCount <
        0
    ) {
        errors.push(
            "processCount inválido."
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
   API
========================================================= */

const lifeControllerAPI = {
    version:
        LIFE_CONTROLLER_VERSION,

    config:
        LIFE_CONTROLLER_CONFIG,

    /* Database */
    setDatabase,
    getDatabase,

    /* Components */
    getComponents,
    registerComponents,

    /* Navigation */
    navigate,
    goHome,
    goBack,

    /* Life */
    open,
    close,
    toggle,

    /* Refresh */
    refresh,

    /* Processing */
    processWeek,
    processMonth,
    processYear,
    processCycle,

    /* Auto refresh */
    startAutoRefresh,
    stopAutoRefresh,

    /* Listeners */
    addListener,
    removeListener,

    /* Lifecycle */
    initialize,
    destroy,
    reset,

    /* Configuration */
    getConfig,
    configure,

    /* State */
    getState,
    getSummary,
    snapshot,
    validate
};

/* =========================================================
   GLOBAL
========================================================= */

if (
    typeof globalThis !==
    "undefined"
) {
    globalThis.lifeControllerAPI =
        lifeControllerAPI;
}

/* =========================================================
   EXPORT
========================================================= */

export {
    LIFE_CONTROLLER_VERSION,
    LIFE_CONTROLLER_CONFIG,
    lifeControllerAPI,

    setDatabase,
    getDatabase,

    getComponents,
    registerComponents,

    navigate,
    goHome,
    goBack,

    open,
    close,
    toggle,

    refresh,

    processWeek,
    processMonth,
    processYear,
    processCycle,

    startAutoRefresh,
    stopAutoRefresh,

    addListener,
    removeListener,

    initialize,
    destroy,
    reset,

    getConfig,
    configure,

    getState,
    getSummary,
    snapshot,
    validate
};

export default lifeControllerAPI;
