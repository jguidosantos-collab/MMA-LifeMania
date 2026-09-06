/*
============================================================
MMA LIFE DYNASTY
LIFE ROUTER
============================================================

Responsabilidade:
- Centralizar a navegação do módulo LIFE.
- Sincronizar Menu + Navigation + Screen + Dashboard.
- Controlar seção atual.
- Manter histórico de navegação.
- Sincronizar hash da URL.
- Permitir navegação por código.
- Servir como ponto único de entrada para outras partes
  do jogo que precisem abrir uma seção da vida.

IMPORTANTE:
Este arquivo é propositalmente independente.
A integração definitiva com o restante do jogo acontece
posteriormente pelo main.js / engine principal.
============================================================
*/

const LIFE_ROUTER_VERSION = 1;

const LIFE_ROUTER_CONFIG = {
    defaultSection: "overview",

    syncHash: true,

    sections: [
        "overview",
        "relationships",
        "family",
        "career",
        "finances",
        "lifestyle",
        "media",
        "history",
        "milestones",
        "dynasty",
        "notifications"
    ],

    labels: {
        overview: "Visão Geral",
        relationships: "Relacionamentos",
        family: "Família",
        career: "Carreira",
        finances: "Finanças",
        lifestyle: "Estilo de Vida",
        media: "Mídia",
        history: "Histórico",
        milestones: "Marcos",
        dynasty: "Dinastia",
        notifications: "Notificações"
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

function normalizeText(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase();
}

function generateId(prefix = "router") {
    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 9)}`;
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

    return current === undefined ? fallback : current;
}

function ensureObject(parent, key, fallback = {}) {
    if (!parent[key] || typeof parent[key] !== "object") {
        parent[key] = fallback;
    }

    return parent[key];
}

/* =========================================================
   SEÇÕES
========================================================= */

function getSections() {
    return [...LIFE_ROUTER_CONFIG.sections];
}

function isValidSection(section) {
    return LIFE_ROUTER_CONFIG.sections.includes(
        normalizeText(section)
    );
}

function normalizeSection(section) {
    const normalized = normalizeText(section);

    if (isValidSection(normalized)) {
        return normalized;
    }

    const aliases = {
        home: "overview",
        dashboard: "overview",
        inicio: "overview",
        início: "overview",

        relationship: "relationships",
        relations: "relationships",
        relacionamentos: "relationships",

        family: "family",
        familia: "family",
        família: "family",

        work: "career",
        job: "career",

        money: "finances",
        finance: "finances",
        financial: "finances",

        lifestyle: "lifestyle",

        social: "media",

        history: "history",

        milestone: "milestones",

        dynasty: "dynasty",

        notification: "notifications",
        notifications: "notifications"
    };

    return aliases[normalized] || LIFE_ROUTER_CONFIG.defaultSection;
}

/* =========================================================
   ESTADO
========================================================= */

function createRouterState() {
    return {
        version: LIFE_ROUTER_VERSION,

        initialized: false,

        currentSection: LIFE_ROUTER_CONFIG.defaultSection,
        previousSection: null,

        history: [],

        maxHistory: 100,

        listeners: [],

        navigationCount: 0,

        lastNavigationAt: null,

        lastNavigationReason: null,

        syncHash: LIFE_ROUTER_CONFIG.syncHash,

        createdAt: Date.now(),
        updatedAt: Date.now()
    };
}

let database = null;
let routerState = createRouterState();

/* =========================================================
   DATABASE
========================================================= */

function setDatabase(db) {
    database = db;

    if (!database || typeof database !== "object") {
        return database;
    }

    const life = ensureObject(database, "life");

    if (!life.router || typeof life.router !== "object") {
        life.router = {};
    }

    const saved = life.router;

    routerState = {
        ...createRouterState(),
        ...saved,

        history: Array.isArray(saved.history)
            ? saved.history
            : [],

        listeners: [],

        initialized: Boolean(saved.initialized)
    };

    routerState.currentSection = normalizeSection(
        routerState.currentSection
    );

    routerState.updatedAt = Date.now();

    return database;
}

function getDatabase() {
    return database;
}

function persistState() {
    if (!database || typeof database !== "object") {
        return;
    }

    const life = ensureObject(database, "life");

    life.router = {
        ...routerState,
        listeners: undefined
    };

    delete life.router.listeners;
}

/* =========================================================
   API EXTERNA
========================================================= */

function getAPI(name) {
    try {
        if (globalThis && globalThis[name]) {
            return globalThis[name];
        }
    } catch {
        // Ambiente sem globalThis utilizável.
    }

    return null;
}

function callAPI(api, methods, ...args) {
    if (!api) {
        return {
            success: false,
            result: null,
            method: null
        };
    }

    const methodList = Array.isArray(methods)
        ? methods
        : [methods];

    for (const method of methodList) {
        if (typeof api[method] === "function") {
            try {
                return {
                    success: true,
                    result: api[method](...args),
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
        method: null
    };
}

function getNavigationAPI() {
    return getAPI("lifeNavigationAPI");
}

function getScreenAPI() {
    return getAPI("lifeScreenAPI");
}

function getDashboardAPI() {
    return getAPI("lifeDashboardAPI");
}

function getMenuAPI() {
    return getAPI("lifeMenuAPI");
}

function getUIAPI() {
    return getAPI("lifeUIAPI");
}

/* =========================================================
   HASH
========================================================= */

function getHashSection() {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const hash = String(window.location.hash || "");

        if (!hash) {
            return null;
        }

        const prefix = "#life-";

        if (!hash.toLowerCase().startsWith(prefix)) {
            return null;
        }

        const section = hash.slice(prefix.length);

        if (!section) {
            return null;
        }

        return normalizeSection(section);
    } catch {
        return null;
    }
}

function updateHash(section, replace = false) {
    if (!routerState.syncHash) {
        return;
    }

    if (typeof window === "undefined") {
        return;
    }

    try {
        const newHash = `#life-${section}`;

        if (window.location.hash === newHash) {
            return;
        }

        if (
            replace &&
            window.history &&
            typeof window.history.replaceState === "function"
        ) {
            window.history.replaceState(
                null,
                "",
                newHash
            );
        } else {
            window.location.hash = newHash;
        }
    } catch {
        // Hash não deve impedir a navegação.
    }
}

/* =========================================================
   HISTÓRICO
========================================================= */

function addHistoryEntry(
    from,
    to,
    reason = "navigation"
) {
    const entry = {
        id: generateId("life_route"),
        from: from || null,
        to,
        reason,
        timestamp: Date.now(),
        date: new Date().toISOString()
    };

    routerState.history.push(entry);

    if (
        routerState.history.length >
        routerState.maxHistory
    ) {
        routerState.history =
            routerState.history.slice(
                -routerState.maxHistory
            );
    }

    return entry;
}

function getHistory(limit = null) {
    const history = [...routerState.history];

    if (
        Number.isFinite(limit) &&
        limit > 0
    ) {
        return history.slice(-limit);
    }

    return history;
}

function clearHistory() {
    routerState.history = [];
    persistState();

    return true;
}

/* =========================================================
   LISTENERS
========================================================= */

function addListener(callback) {
    if (typeof callback !== "function") {
        return false;
    }

    if (!routerState.listeners.includes(callback)) {
        routerState.listeners.push(callback);
    }

    return true;
}

function removeListener(callback) {
    const index =
        routerState.listeners.indexOf(callback);

    if (index === -1) {
        return false;
    }

    routerState.listeners.splice(index, 1);

    return true;
}

function notifyListeners(payload) {
    const listeners = [
        ...routerState.listeners
    ];

    for (const listener of listeners) {
        try {
            listener(payload);
        } catch (error) {
            console.error(
                "[lifeRouter] Listener error:",
                error
            );
        }
    }
}

/* =========================================================
   SINCRONIZAÇÃO
========================================================= */

function syncNavigation(section, options = {}) {
    const navigationAPI =
        getNavigationAPI();

    const screenAPI =
        getScreenAPI();

    const dashboardAPI =
        getDashboardAPI();

    const menuAPI =
        getMenuAPI();

    const uiAPI =
        getUIAPI();

    const results = {};

    if (options.syncNavigation !== false) {
        results.navigation = callAPI(
            navigationAPI,
            [
                "navigate",
                "goTo"
            ],
            section,
            {
                source: "lifeRouter",
                reason:
                    options.reason ||
                    "router"
            }
        );
    }

    if (options.syncScreen !== false) {
        results.screen = callAPI(
            screenAPI,
            [
                "setCurrentSection",
                "navigate"
            ],
            section,
            {
                source: "lifeRouter"
            }
        );
    }

    if (options.syncDashboard !== false) {
        results.dashboard = callAPI(
            dashboardAPI,
            [
                "renderSection",
                "refresh"
            ],
            section,
            {
                source: "lifeRouter"
            }
        );
    }

    if (options.syncMenu !== false) {
        results.menu = callAPI(
            menuAPI,
            [
                "navigate",
                "setCurrentSection"
            ],
            section,
            {
                source: "lifeRouter"
            }
        );
    }

    if (options.syncUI !== false) {
        results.ui = callAPI(
            uiAPI,
            [
                "renderSection",
                "update",
                "refresh"
            ],
            section,
            {
                source: "lifeRouter"
            }
        );
    }

    return results;
}

/* =========================================================
   NAVEGAÇÃO PRINCIPAL
========================================================= */

function navigate(section, options = {}) {
    const target = normalizeSection(section);
    const current = routerState.currentSection;

    const force =
        options.force === true;

    if (
        current === target &&
        !force
    ) {
        if (options.syncHash !== false) {
            updateHash(target, true);
        }

        return {
            success: true,
            changed: false,
            section: target,
            previousSection:
                routerState.previousSection
        };
    }

    routerState.previousSection =
        current || null;

    routerState.currentSection =
        target;

    routerState.navigationCount += 1;

    routerState.lastNavigationAt =
        Date.now();

    routerState.lastNavigationReason =
        options.reason ||
        "navigation";

    const historyEntry =
        addHistoryEntry(
            current,
            target,
            options.reason ||
                "navigation"
        );

    routerState.updatedAt =
        Date.now();

    persistState();

    if (options.syncHash !== false) {
        updateHash(
            target,
            options.replaceHash === true
        );
    }

    const syncResults =
        syncNavigation(
            target,
            options
        );

    const payload = {
        type: "life:navigation",
        success: true,
        changed: true,
        section: target,
        previousSection:
            routerState.previousSection,
        reason:
            options.reason ||
            "navigation",
        historyEntry,
        syncResults,
        timestamp: Date.now()
    };

    notifyListeners(payload);

    return payload;
}

/* =========================================================
   ATALHOS
========================================================= */

function goHome(options = {}) {
    return navigate(
        LIFE_ROUTER_CONFIG.defaultSection,
        {
            ...options,
            reason:
                options.reason ||
                "home"
        }
    );
}

function goBack(options = {}) {
    const history =
        routerState.history;

    if (!history.length) {
        return goHome({
            ...options,
            reason:
                options.reason ||
                "back-empty-history"
        });
    }

    const current =
        routerState.currentSection;

    for (
        let i = history.length - 1;
        i >= 0;
        i--
    ) {
        const entry = history[i];

        if (
            entry.to === current &&
            entry.from &&
            entry.from !== current
        ) {
            return navigate(
                entry.from,
                {
                    ...options,
                    reason:
                        options.reason ||
                        "back"
                }
            );
        }
    }

    return goHome({
        ...options,
        reason:
            options.reason ||
            "back-home"
    });
}

function goNext(options = {}) {
    const sections =
        getSections();

    const currentIndex =
        sections.indexOf(
            routerState.currentSection
        );

    const nextIndex =
        currentIndex === -1
            ? 0
            : (currentIndex + 1) %
              sections.length;

    return navigate(
        sections[nextIndex],
        {
            ...options,
            reason:
                options.reason ||
                "next"
        }
    );
}

function goPrevious(options = {}) {
    const sections =
        getSections();

    const currentIndex =
        sections.indexOf(
            routerState.currentSection
        );

    const previousIndex =
        currentIndex <= 0
            ? sections.length - 1
            : currentIndex - 1;

    return navigate(
        sections[previousIndex],
        {
            ...options,
            reason:
                options.reason ||
                "previous"
        }
    );
}

/* =========================================================
   ATALHOS POR SEÇÃO
========================================================= */

function overview(options = {}) {
    return navigate("overview", {
        ...options,
        reason:
            options.reason ||
            "shortcut-overview"
    });
}

function relationships(options = {}) {
    return navigate("relationships", {
        ...options,
        reason:
            options.reason ||
            "shortcut-relationships"
    });
}

function family(options = {}) {
    return navigate("family", {
        ...options,
        reason:
            options.reason ||
            "shortcut-family"
    });
}

function career(options = {}) {
    return navigate("career", {
        ...options,
        reason:
            options.reason ||
            "shortcut-career"
    });
}

function finances(options = {}) {
    return navigate("finances", {
        ...options,
        reason:
            options.reason ||
            "shortcut-finances"
    });
}

function lifestyle(options = {}) {
    return navigate("lifestyle", {
        ...options,
        reason:
            options.reason ||
            "shortcut-lifestyle"
    });
}

function media(options = {}) {
    return navigate("media", {
        ...options,
        reason:
            options.reason ||
            "shortcut-media"
    });
}

function history(options = {}) {
    return navigate("history", {
        ...options,
        reason:
            options.reason ||
            "shortcut-history"
    });
}

function milestones(options = {}) {
    return navigate("milestones", {
        ...options,
        reason:
            options.reason ||
            "shortcut-milestones"
    });
}

function dynasty(options = {}) {
    return navigate("dynasty", {
        ...options,
        reason:
            options.reason ||
            "shortcut-dynasty"
    });
}

function notifications(options = {}) {
    return navigate("notifications", {
        ...options,
        reason:
            options.reason ||
            "shortcut-notifications"
    });
}

/* =========================================================
   ESTADO ATUAL
========================================================= */

function getCurrentSection() {
    return routerState.currentSection;
}

function getPreviousSection() {
    return routerState.previousSection;
}

function getCurrentLabel() {
    return (
        LIFE_ROUTER_CONFIG.labels[
            routerState.currentSection
        ] ||
        routerState.currentSection
    );
}

function getSectionLabel(section) {
    const normalized =
        normalizeSection(section);

    return (
        LIFE_ROUTER_CONFIG.labels[
            normalized
        ] ||
        normalized
    );
}

/* =========================================================
   REFRESH
========================================================= */

function refresh(options = {}) {
    const section =
        routerState.currentSection;

    const results =
        syncNavigation(
            section,
            {
                ...options,
                reason:
                    options.reason ||
                    "refresh"
            }
        );

    routerState.updatedAt =
        Date.now();

    persistState();

    const payload = {
        success: true,
        section,
        results,
        timestamp: Date.now()
    };

    notifyListeners({
        type: "life:refresh",
        ...payload
    });

    return payload;
}

/* =========================================================
   HASH ROUTING
========================================================= */

function handleHashChange() {
    const section =
        getHashSection();

    if (!section) {
        return false;
    }

    navigate(section, {
        reason: "hash",
        syncHash: false
    });

    return true;
}

function startHashRouting() {
    if (typeof window === "undefined") {
        return false;
    }

    try {
        if (
            !window.__MMA_LIFE_ROUTER_HASH_HANDLER__
        ) {
            const handler =
                () => handleHashChange();

            window.addEventListener(
                "hashchange",
                handler
            );

            window.__MMA_LIFE_ROUTER_HASH_HANDLER__ =
                handler;
        }

        return true;
    } catch {
        return false;
    }
}

function stopHashRouting() {
    if (typeof window === "undefined") {
        return false;
    }

    try {
        const handler =
            window.__MMA_LIFE_ROUTER_HASH_HANDLER__;

        if (handler) {
            window.removeEventListener(
                "hashchange",
                handler
            );

            delete window.__MMA_LIFE_ROUTER_HASH_HANDLER__;
        }

        return true;
    } catch {
        return false;
    }
}

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initialize(db = null, options = {}) {
    if (db) {
        setDatabase(db);
    }

    if (!database) {
        database = {};
        setDatabase(database);
    }

    routerState.initialized = true;

    routerState.syncHash =
        options.syncHash ??
        routerState.syncHash ??
        LIFE_ROUTER_CONFIG.syncHash;

    if (
        Number.isFinite(
            options.maxHistory
        ) &&
        options.maxHistory > 0
    ) {
        routerState.maxHistory =
            Math.floor(
                options.maxHistory
            );
    }

    const hashSection =
        routerState.syncHash
            ? getHashSection()
            : null;

    const initialSection =
        options.section
            ? normalizeSection(
                  options.section
              )
            : hashSection ||
              normalizeSection(
                  routerState.currentSection
              );

    routerState.currentSection =
        initialSection;

    routerState.updatedAt =
        Date.now();

    persistState();

    if (routerState.syncHash) {
        startHashRouting();

        updateHash(
            initialSection,
            true
        );
    }

    if (options.render !== false) {
        syncNavigation(
            initialSection,
            {
                reason: "initialize"
            }
        );
    }

    return getState();
}

function destroy() {
    stopHashRouting();

    routerState.listeners = [];

    routerState.initialized = false;

    persistState();

    return true;
}

function reset(options = {}) {
    stopHashRouting();

    routerState =
        createRouterState();

    if (options.keepSection) {
        routerState.currentSection =
            normalizeSection(
                options.keepSection
            );
    }

    if (database) {
        persistState();
    }

    return getState();
}

/* =========================================================
   CONFIGURAÇÃO
========================================================= */

function getConfig() {
    return clone(
        LIFE_ROUTER_CONFIG
    );
}

function configure(options = {}) {
    if (
        options.defaultSection
    ) {
        const section =
            normalizeSection(
                options.defaultSection
            );

        LIFE_ROUTER_CONFIG.defaultSection =
            section;
    }

    if (
        typeof options.syncHash ===
        "boolean"
    ) {
        routerState.syncHash =
            options.syncHash;
    }

    if (
        Array.isArray(
            options.sections
        ) &&
        options.sections.length
    ) {
        const validSections =
            options.sections
                .map(normalizeSection)
                .filter(
                    (section, index, array) =>
                        array.indexOf(
                            section
                        ) === index
                );

        if (validSections.length) {
            LIFE_ROUTER_CONFIG.sections =
                validSections;

            if (
                !isValidSection(
                    LIFE_ROUTER_CONFIG
                        .defaultSection
                )
            ) {
                LIFE_ROUTER_CONFIG
                    .defaultSection =
                    validSections[0];
            }
        }
    }

    persistState();

    return getConfig();
}

/* =========================================================
   SNAPSHOT
========================================================= */

function getState() {
    return {
        version:
            LIFE_ROUTER_VERSION,

        initialized:
            routerState.initialized,

        currentSection:
            routerState.currentSection,

        previousSection:
            routerState.previousSection,

        currentLabel:
            getCurrentLabel(),

        history:
            clone(routerState.history),

        navigationCount:
            routerState.navigationCount,

        lastNavigationAt:
            routerState.lastNavigationAt,

        lastNavigationReason:
            routerState.lastNavigationReason,

        maxHistory:
            routerState.maxHistory,

        syncHash:
            routerState.syncHash,

        updatedAt:
            routerState.updatedAt
    };
}

function snapshot() {
    return {
        version:
            LIFE_ROUTER_VERSION,

        state:
            getState(),

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
        !isValidSection(
            routerState.currentSection
        )
    ) {
        errors.push(
            "currentSection inválida."
        );
    }

    if (
        routerState.previousSection !==
            null &&
        !isValidSection(
            routerState.previousSection
        )
    ) {
        warnings.push(
            "previousSection inválida."
        );
    }

    if (
        !Array.isArray(
            routerState.history
        )
    ) {
        errors.push(
            "history deve ser um array."
        );
    }

    if (
        !Number.isFinite(
            routerState.maxHistory
        ) ||
        routerState.maxHistory <= 0
    ) {
        errors.push(
            "maxHistory inválido."
        );
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

/* =========================================================
   API
========================================================= */

const lifeRouterAPI = {
    version:
        LIFE_ROUTER_VERSION,

    config:
        LIFE_ROUTER_CONFIG,

    /* Database */
    setDatabase,
    getDatabase,

    /* Sections */
    getSections,
    isValidSection,
    normalizeSection,
    getSectionLabel,

    /* Navigation */
    navigate,
    goHome,
    goBack,
    goNext,
    goPrevious,

    /* Shortcuts */
    overview,
    relationships,
    family,
    career,
    finances,
    lifestyle,
    media,
    history,
    milestones,
    dynasty,
    notifications,

    /* Current state */
    getCurrentSection,
    getPreviousSection,
    getCurrentLabel,

    /* History */
    getHistory,
    clearHistory,

    /* Refresh */
    refresh,

    /* Hash */
    getHashSection,
    updateHash,
    startHashRouting,
    stopHashRouting,
    handleHashChange,

    /* Listeners */
    addListener,
    removeListener,

    /* Lifecycle */
    initialize,
    destroy,
    reset,

    /* Config */
    getConfig,
    configure,

    /* State */
    getState,
    snapshot,
    validate
};

/* =========================================================
   GLOBAL
========================================================= */

if (
    typeof globalThis !== "undefined"
) {
    globalThis.lifeRouterAPI =
        lifeRouterAPI;
}

/* =========================================================
   EXPORT
========================================================= */

export {
    LIFE_ROUTER_VERSION,
    LIFE_ROUTER_CONFIG,
    lifeRouterAPI,

    setDatabase,
    getDatabase,

    getSections,
    isValidSection,
    normalizeSection,
    getSectionLabel,

    navigate,
    goHome,
    goBack,
    goNext,
    goPrevious,

    overview,
    relationships,
    family,
    career,
    finances,
    lifestyle,
    media,
    history,
    milestones,
    dynasty,
    notifications,

    getCurrentSection,
    getPreviousSection,
    getCurrentLabel,

    getHistory,
    clearHistory,

    refresh,

    getHashSection,
    updateHash,
    startHashRouting,
    stopHashRouting,
    handleHashChange,

    addListener,
    removeListener,

    initialize,
    destroy,
    reset,

    getConfig,
    configure,

    getState,
    snapshot,
    validate
};

export default lifeRouterAPI;
