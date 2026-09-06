/* ============================================================
   MMA LIFE DYNASTY
   UI BOOTSTRAP
   ------------------------------------------------------------
   Responsabilidade:
   - Inicializar toda a camada de UI
   - Conectar UI ao database principal
   - Preparar HUD, menu, layout e telas
   - Escolher Character Creation ou Dashboard
   - Centralizar navegação inicial
   - Expor API global da UI
   ============================================================ */

const UI_BOOTSTRAP_VERSION = 1;

const UI_BOOTSTRAP_STATUS = {
    IDLE: "idle",
    INITIALIZING: "initializing",
    READY: "ready",
    ERROR: "error"
};

const uiBootstrapState = {
    version: UI_BOOTSTRAP_VERSION,

    status: UI_BOOTSTRAP_STATUS.IDLE,

    initialized: false,
    database: null,
    ready: false,

    currentScreen: null,

    errors: [],
    warnings: [],

    initializedAt: null,
    lastRenderAt: null,
    lastNavigationAt: null
};


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
        error: error ? String(error.message || error) : null,
        timestamp: nowISO()
    };

    uiBootstrapState.errors.push(entry);

    if (uiBootstrapState.errors.length > 50) {
        uiBootstrapState.errors.shift();
    }

    console.error("[MMA LIFE UI BOOTSTRAP]", message, error || "");
}

function pushWarning(message) {
    const entry = {
        message,
        timestamp: nowISO()
    };

    uiBootstrapState.warnings.push(entry);

    if (uiBootstrapState.warnings.length > 50) {
        uiBootstrapState.warnings.shift();
    }

    console.warn("[MMA LIFE UI BOOTSTRAP]", message);
}


/* ============================================================
   DATABASE
   ============================================================ */

function getDatabase() {
    if (uiBootstrapState.database) {
        return uiBootstrapState.database;
    }

    if (
        typeof globalThis !== "undefined" &&
        globalThis.MMA_LIFE_DATABASE
    ) {
        return globalThis.MMA_LIFE_DATABASE;
    }

    if (
        typeof globalThis !== "undefined" &&
        globalThis.MMA_LIFE_GAME &&
        typeof globalThis.MMA_LIFE_GAME.getDatabase === "function"
    ) {
        try {
            return globalThis.MMA_LIFE_GAME.getDatabase();
        } catch (error) {
            pushWarning("Não foi possível obter o database através do jogo.");
        }
    }

    return null;
}

function setDatabase(database) {
    uiBootstrapState.database = database || null;

    if (
        typeof globalThis !== "undefined" &&
        database
    ) {
        globalThis.MMA_LIFE_DATABASE = database;
    }

    return uiBootstrapState.database;
}

function ensureDatabase() {
    let database = getDatabase();

    if (!database) {
        database = createFallbackDatabase();
        setDatabase(database);
    }

    return database;
}

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

        career: {
            stage: "Amateur",
            professional: false,
            history: [],
            titles: [],
            contracts: []
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
                assets: []
            }
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
            lifestyle: {}
        },

        dynasty: {
            activeCharacterId: null,
            generations: [],
            inheritance: [],
            genealogy: [],
            history: []
        },

        media: {
            fame: 0,
            followers: 0,
            reputation: 0,
            news: [],
            rivalries: [],
            awards: []
        },

        world: {
            fighters: {},
            promotions: {},
            events: {},
            rankings: {},
            champions: {},
            gyms: {},
            venues: {},
            countries: {},
            cities: {}
        },

        settings: {
            language: "pt-BR",
            currency: "USD",
            difficulty: "normal",
            notifications: true,
            autosave: true,
            compactMode: false,
            showHints: true,
            confirmActions: true,
            animations: true
        },

        notifications: [],
        history: []
    };
}


/* ============================================================
   PREPARAÇÃO DO DATABASE
   ============================================================ */

function prepareDatabase(database) {
    const db = database || createFallbackDatabase();

    if (!db.meta) {
        db.meta = {};
    }

    if (!db.settings) {
        db.settings = {};
    }

    if (!db.notifications) {
        db.notifications = [];
    }

    if (!db.history) {
        db.history = [];
    }

    if (!db.world) {
        db.world = {};
    }

    if (!db.career) {
        db.career = {};
    }

    if (!db.training) {
        db.training = {};
    }

    if (!db.business) {
        db.business = {};
    }

    if (!db.life) {
        db.life = {};
    }

    if (!db.dynasty) {
        db.dynasty = {};
    }

    if (!db.media) {
        db.media = {};
    }

    return db;
}


/* ============================================================
   DETECÇÃO DOS MÓDULOS
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
   INICIALIZAÇÃO DE UM MÓDULO
   ============================================================ */

function initializeModule(api, name, database) {
    if (!api) {
        pushWarning(`${name} não encontrado. Continuando sem ele.`);
        return false;
    }

    try {
        if (typeof api.initialize === "function") {
            api.initialize(database);
            return true;
        }

        if (typeof api.init === "function") {
            api.init(database);
            return true;
        }

        if (typeof api.start === "function") {
            api.start(database);
            return true;
        }

        return true;
    } catch (error) {
        pushError(`Erro ao inicializar ${name}.`, error);
        return false;
    }
}


/* ============================================================
   INICIALIZAÇÃO DOS MÓDULOS PRINCIPAIS
   ============================================================ */

function initializeCoreUI(database) {
    const modules = [
        {
            name: "Game UI",
            api: getGlobalAPI("gameUIAPI")
        },
        {
            name: "HUD",
            api: getGlobalAPI("hudAPI")
        },
        {
            name: "Main Menu",
            api: getGlobalAPI("mainMenuAPI")
        },
        {
            name: "Layout",
            api: getGlobalAPI("layoutAPI")
        },
        {
            name: "Screens",
            api: getGlobalAPI("screensAPI")
        },
        {
            name: "Character Creation",
            api: getGlobalAPI("characterCreationAPI")
        },
        {
            name: "Life UI",
            api: getGlobalAPI("lifeUIAPI")
        },
        {
            name: "Life Dashboard",
            api: getGlobalAPI("lifeDashboardAPI")
        },
        {
            name: "Life Screen",
            api: getGlobalAPI("lifeScreenAPI")
        },
        {
            name: "Life Navigation",
            api: getGlobalAPI("lifeNavigationAPI")
        },
        {
            name: "Life Menu",
            api: getGlobalAPI("lifeMenuAPI")
        },
        {
            name: "Life Router",
            api: getGlobalAPI("lifeRouterAPI")
        }
    ];

    const results = {};

    for (const module of modules) {
        results[module.name] = initializeModule(
            module.api,
            module.name,
            database
        );
    }

    return results;
}


/* ============================================================
   REGISTRO DAS TELAS
   ============================================================ */

function registerScreens(database) {
    const gameUI = getGlobalAPI("gameUIAPI");
    const screens = getGlobalAPI("screensAPI");

    const screenAPIs = [
        ["characterCreation", "characterCreationAPI"],
        ["dashboard", "dashboardAPI"],
        ["career", "careerScreenAPI"],
        ["training", "trainingScreenAPI"],
        ["fights", "fightsScreenAPI"],
        ["life", "lifeOverviewScreenAPI"],
        ["family", "familyScreenAPI"],
        ["finances", "financesScreenAPI"],
        ["media", "mediaScreenAPI"],
        ["dynasty", "dynastyScreenAPI"],
        ["promotion", "promotionScreenAPI"],
        ["rankings", "rankingsScreenAPI"],
        ["contracts", "contractsScreenAPI"],
        ["profile", "profileScreenAPI"],
        ["settings", "settingsScreenAPI"]
    ];

    const results = {};

    for (const [screenName, apiName] of screenAPIs) {
        const api = getGlobalAPI(apiName);

        if (!api) {
            results[screenName] = false;
            continue;
        }

        try {
            if (typeof screens?.registerScreen === "function") {
                screens.registerScreen(
                    screenName,
                    api
                );

                results[screenName] = true;
                continue;
            }

            if (typeof gameUI?.registerScreen === "function") {
                gameUI.registerScreen(
                    screenName,
                    api
                );

                results[screenName] = true;
                continue;
            }

            results[screenName] = false;
        } catch (error) {
            results[screenName] = false;
            pushError(
                `Erro ao registrar a tela ${screenName}.`,
                error
            );
        }
    }

    return results;
}


/* ============================================================
   PREPARAÇÃO DO LAYOUT
   ============================================================ */

function prepareLayout(database) {
    const layout = getGlobalAPI("layoutAPI");

    if (!layout) {
        pushWarning("layoutAPI não encontrado.");
        return false;
    }

    try {
        if (typeof layout.initialize === "function") {
            layout.initialize(database);
        }

        if (typeof layout.render === "function") {
            layout.render(database);
        }

        return true;
    } catch (error) {
        pushError("Erro ao preparar o layout.", error);
        return false;
    }
}


/* ============================================================
   PREPARAÇÃO DO HUD
   ============================================================ */

function prepareHUD(database) {
    const hud = getGlobalAPI("hudAPI");

    if (!hud) {
        pushWarning("hudAPI não encontrado.");
        return false;
    }

    try {
        if (typeof hud.initialize === "function") {
            hud.initialize(database);
        }

        if (typeof hud.show === "function") {
            hud.show();
        }

        if (typeof hud.refresh === "function") {
            hud.refresh(database);
        }

        return true;
    } catch (error) {
        pushError("Erro ao preparar HUD.", error);
        return false;
    }
}


/* ============================================================
   PREPARAÇÃO DO MENU
   ============================================================ */

function prepareMainMenu(database) {
    const menu = getGlobalAPI("mainMenuAPI");

    if (!menu) {
        pushWarning("mainMenuAPI não encontrado.");
        return false;
    }

    try {
        if (typeof menu.initialize === "function") {
            menu.initialize(database);
        }

        if (typeof menu.render === "function") {
            menu.render(database);
        }

        return true;
    } catch (error) {
        pushError("Erro ao preparar menu principal.", error);
        return false;
    }
}


/* ============================================================
   PREPARAÇÃO DAS TELAS
   ============================================================ */

function prepareScreens(database) {
    const screens = getGlobalAPI("screensAPI");

    if (!screens) {
        pushWarning("screensAPI não encontrado.");
        return false;
    }

    try {
        if (typeof screens.initialize === "function") {
            screens.initialize(database);
        }

        return true;
    } catch (error) {
        pushError("Erro ao preparar registro de telas.", error);
        return false;
    }
}


/* ============================================================
   RENDER DA TELA
   ============================================================ */

function renderScreen(screenName, database = getDatabase()) {
    const db = prepareDatabase(database);

    uiBootstrapState.database = db;
    uiBootstrapState.currentScreen = screenName;
    uiBootstrapState.lastRenderAt = nowISO();

    const screens = getGlobalAPI("screensAPI");

    if (screens && typeof screens.open === "function") {
        try {
            const result = screens.open(screenName, db);

            uiBootstrapState.lastNavigationAt = nowISO();

            return result;
        } catch (error) {
            pushError(
                `Erro ao abrir a tela ${screenName}.`,
                error
            );
        }
    }

    const gameUI = getGlobalAPI("gameUIAPI");

    if (gameUI && typeof gameUI.navigate === "function") {
        try {
            const result = gameUI.navigate(
                screenName,
                db
            );

            uiBootstrapState.lastNavigationAt = nowISO();

            return result;
        } catch (error) {
            pushError(
                `Erro ao navegar para ${screenName}.`,
                error
            );
        }
    }

    return false;
}


/* ============================================================
   CHARACTER CREATION
   ============================================================ */

function hasPlayer(database) {
    return Boolean(
        database &&
        database.player &&
        (
            database.player.id ||
            database.player.firstName ||
            database.player.name
        )
    );
}

function startCharacterCreation(database) {
    const creation = getGlobalAPI("characterCreationAPI");

    if (!creation) {
        pushWarning(
            "characterCreationAPI não encontrado. Abrindo dashboard."
        );

        return renderScreen("dashboard", database);
    }

    try {
        if (typeof creation.initialize === "function") {
            creation.initialize(database);
        }

        if (typeof creation.start === "function") {
            return creation.start(database);
        }

        if (typeof creation.open === "function") {
            return creation.open(database);
        }

        return renderScreen(
            "characterCreation",
            database
        );
    } catch (error) {
        pushError(
            "Erro ao iniciar criação de personagem.",
            error
        );

        return renderScreen(
            "characterCreation",
            database
        );
    }
}


/* ============================================================
   DASHBOARD
   ============================================================ */

function startDashboard(database) {
    return renderScreen(
        "dashboard",
        database
    );
}


/* ============================================================
   NAVEGAÇÃO
   ============================================================ */

function open(screenName, database = getDatabase()) {
    if (!screenName) {
        return false;
    }

    const db = prepareDatabase(database);

    uiBootstrapState.database = db;

    return renderScreen(
        screenName,
        db
    );
}

function close() {
    const screens = getGlobalAPI("screensAPI");

    if (screens && typeof screens.close === "function") {
        try {
            screens.close();
        } catch (error) {
            pushError(
                "Erro ao fechar tela.",
                error
            );
        }
    }

    uiBootstrapState.currentScreen = null;

    return true;
}

function navigate(screenName, database = getDatabase()) {
    return open(
        screenName,
        database
    );
}


/* ============================================================
   REFRESH
   ============================================================ */

function refresh(database = getDatabase()) {
    const db = prepareDatabase(database);

    setDatabase(db);

    const gameUI = getGlobalAPI("gameUIAPI");
    const hud = getGlobalAPI("hudAPI");
    const layout = getGlobalAPI("layoutAPI");
    const screens = getGlobalAPI("screensAPI");

    try {
        if (layout && typeof layout.refresh === "function") {
            layout.refresh(db);
        }
    } catch (error) {
        pushWarning("Falha ao atualizar layout.");
    }

    try {
        if (hud && typeof hud.refresh === "function") {
            hud.refresh(db);
        }
    } catch (error) {
        pushWarning("Falha ao atualizar HUD.");
    }

    try {
        if (gameUI && typeof gameUI.refresh === "function") {
            gameUI.refresh(db);
        }
    } catch (error) {
        pushWarning("Falha ao atualizar Game UI.");
    }

    try {
        if (screens && typeof screens.refresh === "function") {
            screens.refresh(db);
        }
    } catch (error) {
        pushWarning("Falha ao atualizar telas.");
    }

    uiBootstrapState.lastRenderAt = nowISO();

    return true;
}


/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

function initialize(database = null) {
    if (
        uiBootstrapState.initialized &&
        uiBootstrapState.database
    ) {
        return getSnapshot();
    }

    uiBootstrapState.status =
        UI_BOOTSTRAP_STATUS.INITIALIZING;

    try {
        let db = database || getDatabase();

        if (!db) {
            db = createFallbackDatabase();
        }

        db = prepareDatabase(db);

        setDatabase(db);

        initializeCoreUI(db);

        registerScreens(db);

        prepareLayout(db);
        prepareHUD(db);
        prepareMainMenu(db);
        prepareScreens(db);

        uiBootstrapState.initialized = true;
        uiBootstrapState.ready = true;

        uiBootstrapState.status =
            UI_BOOTSTRAP_STATUS.READY;

        uiBootstrapState.initializedAt = nowISO();

        if (typeof document !== "undefined") {
            document.dispatchEvent(
                new CustomEvent(
                    "mma-life-ui-bootstrap-ready",
                    {
                        detail: {
                            database: db
                        }
                    }
                )
            );
        }

        return getSnapshot();

    } catch (error) {
        uiBootstrapState.status =
            UI_BOOTSTRAP_STATUS.ERROR;

        uiBootstrapState.ready = false;

        pushError(
            "Falha geral na inicialização da UI.",
            error
        );

        return getSnapshot();
    }
}


/* ============================================================
   START
   ============================================================ */

function start(database = null) {
    if (!uiBootstrapState.initialized) {
        initialize(database);
    }

    const db =
        database ||
        uiBootstrapState.database ||
        getDatabase();

    if (!db) {
        pushError(
            "Não foi possível iniciar a UI: database inexistente."
        );

        return false;
    }

    setDatabase(db);

    try {
        if (hasPlayer(db)) {
            startDashboard(db);
        } else {
            startCharacterCreation(db);
        }

        refresh(db);

        return true;

    } catch (error) {
        pushError(
            "Erro ao iniciar interface do jogo.",
            error
        );

        return false;
    }
}


/* ============================================================
   VALIDAÇÃO
   ============================================================ */

function validate(database = getDatabase()) {
    const errors = [];
    const warnings = [];

    if (!database) {
        errors.push("Database não encontrado.");
    }

    if (!uiBootstrapState.initialized) {
        warnings.push(
            "UI Bootstrap ainda não foi inicializado."
        );
    }

    if (!uiBootstrapState.ready) {
        warnings.push(
            "UI Bootstrap ainda não está pronta."
        );
    }

    if (
        typeof document !== "undefined" &&
        !document.body
    ) {
        warnings.push(
            "document.body ainda não está disponível."
        );
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}


/* ============================================================
   ESTADO
   ============================================================ */

function getState() {
    return {
        ...uiBootstrapState,
        database: uiBootstrapState.database
            ? "[DATABASE]"
            : null
    };
}

function getSnapshot() {
    return {
        version: UI_BOOTSTRAP_VERSION,

        status: uiBootstrapState.status,

        initialized: uiBootstrapState.initialized,

        ready: uiBootstrapState.ready,

        currentScreen:
            uiBootstrapState.currentScreen,

        initializedAt:
            uiBootstrapState.initializedAt,

        lastRenderAt:
            uiBootstrapState.lastRenderAt,

        lastNavigationAt:
            uiBootstrapState.lastNavigationAt,

        errors: clone(
            uiBootstrapState.errors
        ),

        warnings: clone(
            uiBootstrapState.warnings
        ),

        validation: validate(
            uiBootstrapState.database
        )
    };
}


/* ============================================================
   RESET
   ============================================================ */

function reset() {
    uiBootstrapState.status =
        UI_BOOTSTRAP_STATUS.IDLE;

    uiBootstrapState.initialized = false;
    uiBootstrapState.ready = false;

    uiBootstrapState.database = null;

    uiBootstrapState.currentScreen = null;

    uiBootstrapState.errors = [];
    uiBootstrapState.warnings = [];

    uiBootstrapState.initializedAt = null;
    uiBootstrapState.lastRenderAt = null;
    uiBootstrapState.lastNavigationAt = null;

    return getSnapshot();
}


/* ============================================================
   EVENTOS
   ============================================================ */

function bindEvents() {
    if (typeof document === "undefined") {
        return false;
    }

    document.addEventListener(
        "mma-life-game-ready",
        (event) => {
            const database =
                event?.detail?.database ||
                getDatabase();

            if (database) {
                setDatabase(database);

                if (!uiBootstrapState.initialized) {
                    initialize(database);
                }

                start(database);
            }
        }
    );

    document.addEventListener(
        "mma-life-profile-screen-ready",
        () => {
            refresh();
        }
    );

    document.addEventListener(
        "mma-life-settings-changed",
        () => {
            refresh();
        }
    );

    document.addEventListener(
        "mma-life-life-updated",
        () => {
            refresh();
        }
    );

    document.addEventListener(
        "mma-life-fight-result",
        () => {
            refresh();
        }
    );

    return true;
}


/* ============================================================
   API
   ============================================================ */

const uiBootstrapAPI = {
    version: UI_BOOTSTRAP_VERSION,

    initialize,
    start,

    refresh,

    open,
    close,
    navigate,

    getDatabase,
    setDatabase,

    getState,
    getSnapshot,

    validate,

    reset,

    bindEvents,

    hasPlayer,

    startCharacterCreation,
    startDashboard,

    UI_BOOTSTRAP_STATUS
};


/* ============================================================
   GLOBAL
   ============================================================ */

if (typeof globalThis !== "undefined") {
    globalThis.uiBootstrapAPI =
        uiBootstrapAPI;

    globalThis.MMA_LIFE_UI_BOOTSTRAP =
        uiBootstrapAPI;
}


/* ============================================================
   AUTO BIND
   ============================================================ */

if (typeof document !== "undefined") {
    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            () => {
                bindEvents();
            },
            {
                once: true
            }
        );
    } else {
        bindEvents();
    }
}


/* ============================================================
   EXPORTS
   ============================================================ */

export {
    UI_BOOTSTRAP_VERSION,
    UI_BOOTSTRAP_STATUS,

    uiBootstrapAPI,

    initialize,
    start,

    refresh,

    open,
    close,
    navigate,

    getDatabase,
    setDatabase,

    getState,
    getSnapshot,

    validate,

    reset,

    bindEvents,

    hasPlayer,
    startCharacterCreation,
    startDashboard
};

export default uiBootstrapAPI;
