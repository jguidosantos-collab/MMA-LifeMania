/* ============================================================
   MMA LIFE DYNASTY
   LIFE NAVIGATION
   ------------------------------------------------------------
   Navegação entre as áreas da vida do jogador.
   ============================================================ */

const LIFE_NAVIGATION_VERSION = 2;

const LIFE_NAVIGATION_CONFIG = {
    version: LIFE_NAVIGATION_VERSION,

    rootId: "life-navigation",

    defaultSection: "overview",

    rememberLastSection: true,

    sections: {
        overview: true,
        relationships: true,
        family: true,
        career: true,
        finances: true,
        lifestyle: true,
        media: true,
        history: true,
        milestones: true,
        dynasty: true,
        notifications: true
    },

    labels: {
        overview: "Visão Geral",
        relationships: "Relacionamentos",
        family: "Família",
        career: "Carreira",
        finances: "Finanças",
        lifestyle: "Estilo de Vida",
        media: "Mídia",
        history: "Histórico",
        milestones: "Conquistas",
        dynasty: "Dinastia",
        notifications: "Notificações"
    },

    icons: {
        overview: "🏠",
        relationships: "❤️",
        family: "👨‍👩‍👧‍👦",
        career: "🥊",
        finances: "💰",
        lifestyle: "✨",
        media: "📱",
        history: "📖",
        milestones: "🏆",
        dynasty: "👑",
        notifications: "🔔"
    }
};


/* ============================================================
   ESTADO
   ============================================================ */

const navigationState = {

    database: null,

    initialized: false,

    currentSection:
        LIFE_NAVIGATION_CONFIG.defaultSection,

    previousSection: null,

    history: [],

    maxHistory: 100,

    listeners: [],

    lastNavigationAt: null
};


/* ============================================================
   UTILITÁRIOS
   ============================================================ */

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

    } catch (error) {

        return value;
    }
}


function normalizeText(value) {

    return String(value ?? "")
        .trim()
        .toLowerCase();
}


function generateId(
    prefix = "navigation"
) {

    return (
        `${prefix}_` +
        `${Date.now()}_` +
        Math.random()
            .toString(36)
            .slice(2, 9)
    );
}


function ensureArray(value) {

    return Array.isArray(value)
        ? value
        : [];
}


function ensureObject(value) {

    return (
        value &&
        typeof value === "object"
    )
        ? value
        : {};
}


/* ============================================================
   DATABASE
   ============================================================ */

function getDatabase() {

    return navigationState.database;
}


function setDatabase(database) {

    navigationState.database =
        database;

    return database;
}


function ensureDatabase(
    database = navigationState.database
) {

    if (
        !database ||
        typeof database !== "object"
    ) {

        navigationState.database = {};
    }

    if (
        !navigationState.database.life ||
        typeof navigationState.database.life !== "object"
    ) {

        navigationState.database.life = {};
    }

    if (
        !navigationState.database.life.navigation ||
        typeof navigationState.database.life.navigation !== "object"
    ) {

        navigationState.database.life.navigation = {

            version:
                LIFE_NAVIGATION_VERSION,

            currentSection:
                LIFE_NAVIGATION_CONFIG.defaultSection,

            previousSection: null,

            history: [],

            lastNavigationAt: null
        };
    }

    return navigationState.database;
}


/* ============================================================
   SEÇÕES
   ============================================================ */

function getSectionIds() {

    return Object.keys(
        LIFE_NAVIGATION_CONFIG.sections
    ).filter(sectionId => {

        return (
            LIFE_NAVIGATION_CONFIG
                .sections[sectionId] !== false
        );
    });
}


function normalizeSection(section) {

    const normalized =
        normalizeText(section);

    if (!normalized) {

        return null;
    }

    const aliases = {

        home: "overview",

        dashboard: "overview",

        profile: "overview",

        relationship:
            "relationships",

        relationships:
            "relationships",

        family:
            "family",

        career:
            "career",

        finance:
            "finances",

        finances:
            "finances",

        money:
            "finances",

        lifestyle:
            "lifestyle",

        life_style:
            "lifestyle",

        media:
            "media",

        social:
            "media",

        history:
            "history",

        timeline:
            "history",

        milestones:
            "milestones",

        achievements:
            "milestones",

        dynasty:
            "dynasty",

        legacy:
            "dynasty",

        notification:
            "notifications",

        notifications:
            "notifications"
    };

    const resolved =
        aliases[normalized] ||
        normalized;

    if (
        !getSectionIds()
            .includes(resolved)
    ) {

        return null;
    }

    return resolved;
}


function isValidSection(section) {

    return Boolean(
        normalizeSection(section)
    );
}


/* ============================================================
   INFORMAÇÕES DAS SEÇÕES
   ============================================================ */

function getCurrentSection() {

    return navigationState
        .currentSection;
}


function getPreviousSection() {

    return navigationState
        .previousSection;
}


function getSectionLabel(section) {

    const normalized =
        normalizeSection(section);

    if (!normalized) {

        return null;
    }

    return (
        LIFE_NAVIGATION_CONFIG
            .labels[normalized] ||
        normalized
    );
}


function getSectionIcon(section) {

    const normalized =
        normalizeSection(section);

    if (!normalized) {

        return null;
    }

    return (
        LIFE_NAVIGATION_CONFIG
            .icons[normalized] ||
        ""
    );
}


function getSection(section) {

    const normalized =
        normalizeSection(section);

    if (!normalized) {

        return null;
    }

    return {

        id: normalized,

        label:
            getSectionLabel(
                normalized
            ),

        icon:
            getSectionIcon(
                normalized
            ),

        enabled:
            LIFE_NAVIGATION_CONFIG
                .sections[normalized] !== false,

        active:
            navigationState
                .currentSection === normalized
    };
}


function getSections() {

    return getSectionIds()
        .map(section => {

            return getSection(section);
        });
}


/* ============================================================
   HISTÓRICO
   ============================================================ */

function normalizeHistoryItem(item) {

    if (
        !item ||
        typeof item !== "object"
    ) {

        return null;
    }

    const section =
        normalizeSection(
            item.section
        );

    if (!section) {

        return null;
    }

    return {

        id:
            item.id ||
            generateId(),

        section,

        previousSection:
            normalizeSection(
                item.previousSection
            ) || null,

        timestamp:
            item.timestamp ||
            new Date().toISOString()
    };
}


function addNavigationHistory(
    section,
    previousSection
) {

    const item =
        normalizeHistoryItem({

            section,

            previousSection,

            timestamp:
                new Date().toISOString()
        });

    if (!item) {

        return null;
    }

    navigationState.history
        .push(item);

    if (
        navigationState.history.length >
        navigationState.maxHistory
    ) {

        navigationState.history =
            navigationState.history.slice(
                -navigationState.maxHistory
            );
    }

    return item;
}


function getNavigationHistory(
    limit = 20
) {

    const safeLimit =
        Math.max(
            1,
            Number(limit) || 20
        );

    return clone(
        navigationState.history.slice(
            -safeLimit
        )
    );
}


function clearNavigationHistory() {

    navigationState.history = [];

    syncPersistentState();

    return [];
}


/* ============================================================
   PERSISTÊNCIA
   ============================================================ */

function syncPersistentState() {

    const database =
        ensureDatabase();

    database.life.navigation = {

        version:
            LIFE_NAVIGATION_VERSION,

        currentSection:
            navigationState.currentSection,

        previousSection:
            navigationState.previousSection,

        history:
            clone(
                navigationState.history
            ),

        lastNavigationAt:
            navigationState.lastNavigationAt
    };

    return (
        database.life.navigation
    );
}


function loadPersistentState() {

    const database =
        ensureDatabase();

    const stored =
        ensureObject(
            database.life.navigation
        );

    navigationState.currentSection =
        normalizeSection(
            stored.currentSection
        ) ||
        LIFE_NAVIGATION_CONFIG
            .defaultSection;

    navigationState.previousSection =
        normalizeSection(
            stored.previousSection
        ) || null;

    navigationState.history =
        ensureArray(
            stored.history
        )
        .map(item =>
            normalizeHistoryItem(item)
        )
        .filter(Boolean)
        .slice(
            -navigationState.maxHistory
        );

    navigationState.lastNavigationAt =
        stored.lastNavigationAt ||
        null;

    return syncPersistentState();
}


/* ============================================================
   LISTENERS
   ============================================================ */

function addListener(callback) {

    if (
        typeof callback !==
        "function"
    ) {

        return false;
    }

    if (
        !navigationState.listeners
            .includes(callback)
    ) {

        navigationState.listeners
            .push(callback);
    }

    return true;
}


function removeListener(callback) {

    const index =
        navigationState.listeners
            .indexOf(callback);

    if (index === -1) {

        return false;
    }

    navigationState.listeners
        .splice(index, 1);

    return true;
}


function notifyListeners(event) {

    const listeners =
        navigationState
            .listeners
            .slice();

    listeners.forEach(listener => {

        try {

            listener(
                clone(event)
            );

        } catch (error) {

            console.error(
                "[MMA LIFE DYNASTY] " +
                "lifeNavigation listener error:",
                error
            );
        }
    });
}


/* ============================================================
   NAVEGAÇÃO
   ============================================================ */

function navigate(
    section,
    options = {}
) {

    const normalized =
        normalizeSection(section);

    if (!normalized) {

        return {

            success: false,

            changed: false,

            error:
                "INVALID_SECTION",

            section: null
        };
    }

    const previous =
        navigationState
            .currentSection;

    if (
        previous === normalized &&
        options.force !== true
    ) {

        return {

            success: true,

            changed: false,

            section: normalized,

            previousSection: previous
        };
    }

    navigationState.previousSection =
        previous;

    navigationState.currentSection =
        normalized;

    navigationState.lastNavigationAt =
        new Date().toISOString();

    addNavigationHistory(
        normalized,
        previous
    );

    syncPersistentState();

    const event = {

        type: "navigation",

        section: normalized,

        previousSection: previous,

        timestamp:
            navigationState
                .lastNavigationAt
    };

    notifyListeners(event);

    return {

        success: true,

        changed: true,

        section: normalized,

        previousSection: previous,

        event
    };
}


function goTo(
    section,
    options = {}
) {

    return navigate(
        section,
        options
    );
}


function goBack() {

    const previous =
        navigationState
            .previousSection;

    if (!previous) {

        return {

            success: false,

            changed: false,

            error:
                "NO_PREVIOUS_SECTION"
        };
    }

    return navigate(
        previous,
        {
            force: true
        }
    );
}


function goHome() {

    return navigate(
        "overview"
    );
}


function refresh() {

    const current =
        navigationState
            .currentSection;

    return navigate(
        current,
        {
            force: true,
            refresh: true
        }
    );
}


/* ============================================================
   NAVEGAÇÃO POR POSIÇÃO
   ============================================================ */

function getCurrentIndex() {

    return getSectionIds()
        .indexOf(
            navigationState
                .currentSection
        );
}


function goNext() {

    const sections =
        getSectionIds();

    if (!sections.length) {

        return {

            success: false,

            error:
                "NO_SECTIONS"
        };
    }

    const currentIndex =
        getCurrentIndex();

    const nextIndex =
        currentIndex < 0
            ? 0
            : (
                currentIndex + 1
            ) %
            sections.length;

    return navigate(
        sections[nextIndex]
    );
}


function goPrevious() {

    const sections =
        getSectionIds();

    if (!sections.length) {

        return {

            success: false,

            error:
                "NO_SECTIONS"
        };
    }

    const currentIndex =
        getCurrentIndex();

    const previousIndex =
        currentIndex <= 0
            ? sections.length - 1
            : currentIndex - 1;

    return navigate(
        sections[previousIndex]
    );
}


/* ============================================================
   ATALHOS
   ============================================================ */

function openOverview() {

    return navigate("overview");
}


function openRelationships() {

    return navigate(
        "relationships"
    );
}


function openFamily() {

    return navigate("family");
}


function openCareer() {

    return navigate("career");
}


function openFinances() {

    return navigate(
        "finances"
    );
}


function openLifestyle() {

    return navigate(
        "lifestyle"
    );
}


function openMedia() {

    return navigate("media");
}


function openHistory() {

    return navigate(
        "history"
    );
}


function openMilestones() {

    return navigate(
        "milestones"
    );
}


function openDynasty() {

    return navigate(
        "dynasty"
    );
}


function openNotifications() {

    return navigate(
        "notifications"
    );
}


/* ============================================================
   HASH / URL
   ============================================================ */

function sectionToHash(section) {

    const normalized =
        normalizeSection(section);

    if (!normalized) {

        return "";
    }

    return `#life/${normalized}`;
}


function hashToSection(hash) {

    const value =
        String(hash || "")
            .trim()
            .replace(/^#/, "");

    if (!value) {

        return null;
    }

    if (
        value.startsWith("life/")
    ) {

        return normalizeSection(
            value.slice(5)
        );
    }

    return normalizeSection(value);
}


function updateHash(section) {

    if (
        typeof window ===
        "undefined"
    ) {

        return false;
    }

    const hash =
        sectionToHash(section);

    if (!hash) {

        return false;
    }

    try {

        window.history
            .replaceState(
                null,
                "",
                hash
            );

        return true;

    } catch (error) {

        window.location.hash =
            hash;

        return true;
    }
}


/* ============================================================
   LIFE UI
   ============================================================ */

function getLifeUIAPI() {

    if (
        typeof globalThis !==
        "undefined" &&
        globalThis.lifeUIAPI
    ) {

        return globalThis.lifeUIAPI;
    }

    return null;
}


function renderCurrentSection(
    options = {}
) {

    const api =
        getLifeUIAPI();

    const section =
        navigationState
            .currentSection;

    if (!api) {

        return {

            success: false,

            error:
                "LIFE_UI_NOT_AVAILABLE",

            section
        };
    }

    try {

        if (
            typeof api.renderSection ===
            "function"
        ) {

            return {

                success: true,

                section,

                result:
                    api.renderSection(
                        section,
                        options
                    )
            };
        }

        if (
            typeof api.update ===
            "function"
        ) {

            return {

                success: true,

                section,

                result:
                    api.update(
                        options
                    )
            };
        }

        if (
            typeof api.refresh ===
            "function"
        ) {

            return {

                success: true,

                section,

                result:
                    api.refresh(
                        options
                    )
            };
        }

        return {

            success: false,

            error:
                "NO_RENDER_METHOD",

            section
        };

    } catch (error) {

        console.error(
            "[MMA LIFE DYNASTY] " +
            "Life UI render error:",
            error
        );

        return {

            success: false,

            error:
                "RENDER_ERROR",

            section,

            message:
                error.message
        };
    }
}


function navigateAndRender(
    section,
    options = {}
) {

    const navigation =
        navigate(
            section,
            options
        );

    if (
        !navigation.success
    ) {

        return navigation;
    }

    updateHash(
        navigation.section
    );

    const render =
        renderCurrentSection(
            options
        );

    return {

        ...navigation,

        render
    };
}


/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

function initialize(
    database = null
) {

    if (database) {

        setDatabase(
            database
        );
    }

    ensureDatabase();

    loadPersistentState();

    navigationState.initialized =
        true;

    return {

        success: true,

        version:
            LIFE_NAVIGATION_VERSION,

        currentSection:
            navigationState
                .currentSection,

        sections:
            getSections()
    };
}


function init(database = null) {

    return initialize(
        database
    );
}


/* ============================================================
   RESET
   ============================================================ */

function reset() {

    navigationState.currentSection =
        LIFE_NAVIGATION_CONFIG
            .defaultSection;

    navigationState.previousSection =
        null;

    navigationState.history = [];

    navigationState.lastNavigationAt =
        null;

    syncPersistentState();

    return {

        success: true,

        section:
            navigationState
                .currentSection
    };
}


/* ============================================================
   ESTADO
   ============================================================ */

function getState() {

    return {

        version:
            LIFE_NAVIGATION_VERSION,

        initialized:
            navigationState
                .initialized,

        currentSection:
            navigationState
                .currentSection,

        previousSection:
            navigationState
                .previousSection,

        history:
            getNavigationHistory(
                navigationState
                    .maxHistory
            ),

        lastNavigationAt:
            navigationState
                .lastNavigationAt
    };
}


/* ============================================================
   API
   ============================================================ */

const lifeNavigationAPI = {

    version:
        LIFE_NAVIGATION_VERSION,

    config:
        LIFE_NAVIGATION_CONFIG,

    state:
        navigationState,

    initialize,

    init,

    reset,

    getState,

    getDatabase,

    setDatabase,

    ensureDatabase,

    getSectionIds,

    normalizeSection,

    isValidSection,

    getCurrentSection,

    getPreviousSection,

    getSectionLabel,

    getSectionIcon,

    getSection,

    getSections,

    navigate,

    goTo,

    goBack,

    goHome,

    refresh,

    goNext,

    goPrevious,

    navigateAndRender,

    renderCurrentSection,

    updateHash,

    sectionToHash,

    hashToSection,

    addListener,

    removeListener,

    getNavigationHistory,

    clearNavigationHistory,

    syncPersistentState,

    loadPersistentState,

    openOverview,

    openRelationships,

    openFamily,

    openCareer,

    openFinances,

    openLifestyle,

    openMedia,

    openHistory,

    openMilestones,

    openDynasty,

    openNotifications
};


/* ============================================================
   GLOBAL
   ============================================================ */

if (
    typeof globalThis !==
    "undefined"
) {

    globalThis.lifeNavigationAPI =
        lifeNavigationAPI;
}


/* ============================================================
   EXPORT
   ============================================================ */

export {

    LIFE_NAVIGATION_VERSION,

    LIFE_NAVIGATION_CONFIG,

    navigationState,

    lifeNavigationAPI,

    initialize,

    init,

    reset,

    getState,

    getDatabase,

    setDatabase,

    ensureDatabase,

    getSectionIds,

    normalizeSection,

    isValidSection,

    getCurrentSection,

    getPreviousSection,

    getSectionLabel,

    getSectionIcon,

    getSection,

    getSections,

    navigate,

    goTo,

    goBack,

    goHome,

    refresh,

    goNext,

    goPrevious,

    navigateAndRender,

    renderCurrentSection,

    updateHash,

    sectionToHash,

    hashToSection,

    addListener,

    removeListener,

    getNavigationHistory,

    clearNavigationHistory,

    syncPersistentState,

    loadPersistentState,

    openOverview,

    openRelationships,

    openFamily,

    openCareer,

    openFinances,

    openLifestyle,

    openMedia,

    openHistory,

    openMilestones,

    openDynasty,

    openNotifications
};


/* ============================================================
   AUTO-INICIALIZAÇÃO
   ============================================================ */

try {

    if (
        typeof document !==
        "undefined"
    ) {

        if (
            document.readyState ===
            "loading"
        ) {

            document.addEventListener(
                "DOMContentLoaded",
                () => {

                    try {

                        if (
                            !navigationState
                                .initialized
                        ) {

                            initialize();
                        }

                    } catch (error) {

                        console.error(
                            "[MMA LIFE DYNASTY] " +
                            "Life Navigation initialization error:",
                            error
                        );
                    }
                },
                {
                    once: true
                }
            );

        } else {

            initialize();
        }
    }

} catch (error) {

    console.error(
        "[MMA LIFE DYNASTY] " +
        "Life Navigation boot error:",
        error
    );
}
