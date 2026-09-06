/* ============================================================
   MMA LIFE DYNASTY
   LIFE NAVIGATION
   ------------------------------------------------------------
   Responsável pela navegação entre as áreas da vida do jogador.

   Áreas:
   - overview
   - relationships
   - family
   - career
   - finances
   - lifestyle
   - media
   - history
   - milestones
   - dynasty
   - notifications

   Este módulo é independente e preparado para integração
   posterior com o sistema principal de UI.
   ============================================================ */

const LIFE_NAVIGATION_VERSION = 1;

/* ============================================================
   CONFIGURAÇÃO
   ============================================================ */

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
   UTILITÁRIOS
   ============================================================ */

function clone(value) {
    if (value === undefined || value === null) {
        return value;
    }

    try {
        return JSON.parse(JSON.stringify(value));
    } catch (error) {
        return value;
    }
}


function normalizeText(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase();
}


function generateId(prefix = "nav") {
    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 9)}`;
}


function ensureArray(value) {
    return Array.isArray(value) ? value : [];
}


function ensureObject(value) {
    return value && typeof value === "object"
        ? value
        : {};
}


/* ============================================================
   ESTADO INTERNO
   ============================================================ */

const navigationState = {
    database: null,

    initialized: false,

    currentSection: LIFE_NAVIGATION_CONFIG.defaultSection,

    previousSection: null,

    history: [],

    maxHistory: 100,

    listeners: [],

    lastNavigationAt: null
};


/* ============================================================
   BANCO DE DADOS
   ============================================================ */

function getDatabase() {
    return navigationState.database;
}


function setDatabase(database) {
    navigationState.database = database;
    return navigationState.database;
}


function ensureDatabase(database = navigationState.database) {
    if (!database || typeof database !== "object") {
        navigationState.database = {};
    }

    if (!navigationState.database.life) {
        navigationState.database.life = {};
    }

    if (!navigationState.database.life.navigation) {
        navigationState.database.life.navigation = {
            version: LIFE_NAVIGATION_VERSION,
            currentSection: LIFE_NAVIGATION_CONFIG.defaultSection,
            previousSection: null,
            history: [],
            lastNavigationAt: null
        };
    }

    return navigationState.database;
}


/* ============================================================
   ESTADO PERSISTENTE
   ============================================================ */

function syncPersistentState() {
    const database = ensureDatabase();

    database.life.navigation = {
        ...database.life.navigation,

        version: LIFE_NAVIGATION_VERSION,

        currentSection: navigationState.currentSection,

        previousSection: navigationState.previousSection,

        history: clone(navigationState.history),

        lastNavigationAt: navigationState.lastNavigationAt
    };

    return database.life.navigation;
}


function loadPersistentState() {
    const database = ensureDatabase();

    const stored = ensureObject(database.life.navigation);

    const storedSection = normalizeSection(
        stored.currentSection
    );

    navigationState.currentSection =
        storedSection || LIFE_NAVIGATION_CONFIG.defaultSection;

    navigationState.previousSection =
        normalizeSection(stored.previousSection) || null;

    navigationState.history =
        ensureArray(stored.history)
            .map(item => normalizeHistoryItem(item))
            .filter(Boolean)
            .slice(-navigationState.maxHistory);

    navigationState.lastNavigationAt =
        stored.lastNavigationAt || null;

    return syncPersistentState();
}


/* ============================================================
   SEÇÕES
   ============================================================ */

function getSectionIds() {
    return Object.keys(LIFE_NAVIGATION_CONFIG.sections)
        .filter(sectionId =>
            LIFE_NAVIGATION_CONFIG.sections[sectionId] !== false
        );
}


function normalizeSection(section) {
    const normalized = normalizeText(section);

    if (!normalized) {
        return null;
    }

    const aliases = {
        home: "overview",
        dashboard: "overview",
        profile: "overview",
        relationships: "relationships",
        relationship: "relationships",
        family: "family",
        career: "career",
        finances: "finances",
        finance: "finances",
        money: "finances",
        lifestyle: "lifestyle",
        life_style: "lifestyle",
        media: "media",
        social: "media",
        history: "history",
        timeline: "history",
        milestones: "milestones",
        achievements: "milestones",
        dynasty: "dynasty",
        legacy: "dynasty",
        notifications: "notifications",
        notification: "notifications
    };

    const resolved = aliases[normalized] || normalized;

    if (!getSectionIds().includes(resolved)) {
        return null;
    }

    return resolved;
}


function isValidSection(section) {
    return Boolean(normalizeSection(section));
}


function getCurrentSection() {
    return navigationState.currentSection;
}


function getPreviousSection() {
    return navigationState.previousSection;
}


function getSectionLabel(section) {
    const normalized = normalizeSection(section);

    if (!normalized) {
        return null;
    }

    return LIFE_NAVIGATION_CONFIG.labels[normalized]
        || normalized;
}


function getSectionIcon(section) {
    const normalized = normalizeSection(section);

    if (!normalized) {
        return null;
    }

    return LIFE_NAVIGATION_CONFIG.icons[normalized]
        || "";
}


function getSection(section) {
    const normalized = normalizeSection(section);

    if (!normalized) {
        return null;
    }

    return {
        id: normalized,

        label: getSectionLabel(normalized),

        icon: getSectionIcon(normalized),

        enabled:
            LIFE_NAVIGATION_CONFIG.sections[normalized] !== false,

        active:
            navigationState.currentSection === normalized
    };
}


function getSections() {
    return getSectionIds().map(section => getSection(section));
}


/* ============================================================
   HISTÓRICO DE NAVEGAÇÃO
   ============================================================ */

function normalizeHistoryItem(item) {
    if (!item || typeof item !== "object") {
        return null;
    }

    const section = normalizeSection(item.section);

    if (!section) {
        return null;
    }

    return {
        id: item.id || generateId("navigation"),
        section,
        previousSection:
            normalizeSection(item.previousSection) || null,
        timestamp:
            item.timestamp || new Date().toISOString()
    };
}


function addNavigationHistory(section, previousSection) {
    const item = normalizeHistoryItem({
        id: generateId("navigation"),
        section,
        previousSection,
        timestamp: new Date().toISOString()
    });

    if (!item) {
        return null;
    }

    navigationState.history.push(item);

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


function getNavigationHistory(limit = 20) {
    const safeLimit = Math.max(
        1,
        Number(limit) || 20
    );

    return clone(
        navigationState.history.slice(-safeLimit)
    );
}


function clearNavigationHistory() {
    navigationState.history = [];

    syncPersistentState();

    return [];
}


/* ============================================================
   LISTENERS
   ============================================================ */

function addListener(callback) {
    if (typeof callback !== "function") {
        return false;
    }

    if (!navigationState.listeners.includes(callback)) {
        navigationState.listeners.push(callback);
    }

    return true;
}


function removeListener(callback) {
    const index =
        navigationState.listeners.indexOf(callback);

    if (index === -1) {
        return false;
    }

    navigationState.listeners.splice(index, 1);

    return true;
}


function notifyListeners(event) {
    const listeners =
        navigationState.listeners.slice();

    listeners.forEach(listener => {
        try {
            listener(clone(event));
        } catch (error) {
            console.error(
                "lifeNavigation listener error:",
                error
            );
        }
    });
}


/* ============================================================
   NAVEGAÇÃO
   ============================================================ */

function navigate(section, options = {}) {
    const normalized = normalizeSection(section);

    if (!normalized) {
        return {
            success: false,
            error: "INVALID_SECTION",
            section: null
        };
    }

    const previous =
        navigationState.currentSection;

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

    navigationState.previousSection = previous;

    navigationState.currentSection = normalized;

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
            navigationState.lastNavigationAt
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


function goTo(section, options = {}) {
    return navigate(section, options);
}


function goBack() {
    const previous =
        navigationState.previousSection;

    if (!previous) {
        return {
            success: false,
            error: "NO_PREVIOUS_SECTION"
        };
    }

    return navigate(previous, {
        force: true
    });
}


function goHome() {
    return navigate("overview");
}


function refresh() {
    const current =
        navigationState.currentSection;

    return navigate(current, {
        force: true,
        refresh: true
    });
}


/* ============================================================
   NAVEGAÇÃO POR POSIÇÃO
   ============================================================ */

function getCurrentIndex() {
    return getSectionIds().indexOf(
        navigationState.currentSection
    );
}


function goNext() {
    const sections = getSectionIds();

    if (!sections.length) {
        return {
            success: false,
            error: "NO_SECTIONS"
        };
    }

    const currentIndex = getCurrentIndex();

    const nextIndex =
        currentIndex < 0
            ? 0
            : (currentIndex + 1) % sections.length;

    return navigate(
        sections[nextIndex]
    );
}


function goPrevious() {
    const sections = getSectionIds();

    if (!sections.length) {
        return {
            success: false,
            error: "NO_SECTIONS"
        };
    }

    const currentIndex = getCurrentIndex();

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
    return navigate("relationships");
}


function openFamily() {
    return navigate("family");
}


function openCareer() {
    return navigate("career");
}


function openFinances() {
    return navigate("finances");
}


function openLifestyle() {
    return navigate("lifestyle");
}


function openMedia() {
    return navigate("media");
}


function openHistory() {
    return navigate("history");
}


function openMilestones() {
    return navigate("milestones");
}


function openDynasty() {
    return navigate("dynasty");
}


function openNotifications() {
    return navigate("notifications");
}


/* ============================================================
   INTEGRAÇÃO COM LIFE UI
   ============================================================ */

function getLifeUIAPI() {
    if (
        typeof globalThis !== "undefined" &&
        globalThis.lifeUIAPI
    ) {
        return globalThis.lifeUIAPI;
    }

    return null;
}


function renderCurrentSection(options = {}) {
    const api = getLifeUIAPI();

    if (!api) {
        return {
            success: false,
            error: "LIFE_UI_NOT_AVAILABLE",
            section:
                navigationState.currentSection
        };
    }

    const section =
        navigationState.currentSection;

    try {
        if (typeof api.renderSection === "function") {
            const result =
                api.renderSection(
                    section,
                    options
                );

            return {
                success: true,
                section,
                result
            };
        }

        if (typeof api.update === "function") {
            const result =
                api.update(options);

            return {
                success: true,
                section,
                result
            };
        }

        if (typeof api.refresh === "function") {
            const result =
                api.refresh(options);

            return {
                success: true,
                section,
                result
            };
        }

        return {
            success: false,
            error: "NO_RENDER_METHOD",
            section
        };

    } catch (error) {
        return {
            success: false,
            error: "RENDER_ERROR",
            section,
            message: error.message
        };
    }
}


function navigateAndRender(section, options = {}) {
    const navigation =
        navigate(section, options);

    if (!navigation.success) {
        return navigation;
    }

    const render =
        renderCurrentSection(options);

    return {
        ...navigation,
        render
    };
}


/* ============================================================
   ROTA / URL / HASH
   ============================================================ */

function sectionToHash(section) {
    const normalized = normalizeSection(section);

    if (!normalized) {
        return "";
    }

    return `#life-${normalized}`;
}


function hashToSection(hash) {
    if (!hash) {
        return null;
    }

    const normalizedHash =
        String(hash)
            .replace(/^#/, "")
            .trim();

    if (!normalizedHash) {
        return null;
    }

    const prefix = "life-";

    const section =
        normalizedHash.startsWith(prefix)
            ? normalizedHash.slice(prefix.length)
            : normalizedHash;

    return normalizeSection(section);
}


function updateLocationHash(section) {
    if (
        typeof window === "undefined" ||
        !window.location
    ) {
        return false;
    }

    const hash = sectionToHash(section);

    if (!hash) {
        return false;
    }

    try {
        window.history.replaceState(
            null,
            "",
            hash
        );

        return true;
    } catch (error) {
        try {
            window.location.hash =
                hash.substring(1);

            return true;
        } catch (fallbackError) {
            return false;
        }
    }
}


function navigateFromHash() {
    if (
        typeof window === "undefined" ||
        !window.location
    ) {
        return {
            success: false,
            error: "WINDOW_NOT_AVAILABLE"
        };
    }

    const section =
        hashToSection(
            window.location.hash
        );

    if (!section) {
        return {
            success: false,
            error: "INVALID_HASH"
        };
    }

    return navigate(section);
}


/* ============================================================
   RENDERIZAÇÃO DA NAVEGAÇÃO
   ============================================================ */

function createElement(tag, className, text) {
    if (
        typeof document === "undefined"
    ) {
        return null;
    }

    const element =
        document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}


function injectStyles() {
    if (
        typeof document === "undefined"
    ) {
        return false;
    }

    if (
        document.getElementById(
            "life-navigation-styles"
        )
    ) {
        return true;
    }

    const style =
        document.createElement("style");

    style.id =
        "life-navigation-styles";

    style.textContent = `
        .life-navigation {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            width: 100%;
            margin-bottom: 16px;
        }

        .life-navigation-item {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            min-height: 40px;
            padding: 8px 13px;
            border: 1px solid rgba(127,127,127,.22);
            border-radius: 10px;
            background: rgba(127,127,127,.08);
            cursor: pointer;
            transition:
                transform .15s ease,
                background .15s ease,
                border-color .15s ease;
            font: inherit;
        }

        .life-navigation-item:hover {
            transform: translateY(-1px);
            background: rgba(127,127,127,.14);
        }

        .life-navigation-item.active {
            border-color: rgba(127,127,127,.45);
            background: rgba(127,127,127,.2);
            font-weight: 700;
        }

        .life-navigation-icon {
            font-size: 16px;
            line-height: 1;
        }

        .life-navigation-label {
            white-space: nowrap;
        }

        @media (max-width: 700px) {
            .life-navigation {
                display: grid;
                grid-template-columns:
                    repeat(2, minmax(0, 1fr));
            }

            .life-navigation-item {
                width: 100%;
            }
        }
    `;

    document.head.appendChild(style);

    return true;
}


function render(container) {
    if (
        typeof document === "undefined"
    ) {
        return null;
    }

    const target =
        typeof container === "string"
            ? document.getElementById(container)
            : container;

    if (!target) {
        return null;
    }

    injectStyles();

    target.innerHTML = "";

    const navigation =
        createElement(
            "nav",
            "life-navigation"
        );

    if (!navigation) {
        return null;
    }

    navigation.setAttribute(
        "aria-label",
        "Navegação da vida"
    );

    getSections().forEach(section => {
        const button =
            createElement(
                "button",
                `life-navigation-item${
                    section.active
                        ? " active"
                        : ""
                }`
            );

        if (!button) {
            return;
        }

        button.type = "button";

        button.dataset.section =
            section.id;

        if (section.active) {
            button.setAttribute(
                "aria-current",
                "page"
            );
        }

        const icon =
            createElement(
                "span",
                "life-navigation-icon",
                section.icon
            );

        const label =
            createElement(
                "span",
                "life-navigation-label",
                section.label
            );

        if (icon) {
            button.appendChild(icon);
        }

        if (label) {
            button.appendChild(label);
        }

        button.addEventListener(
            "click",
            () => {
                navigateAndRender(
                    section.id
                );

                updateLocationHash(
                    section.id
                );

                render(target);
            }
        );

        navigation.appendChild(button);
    });

    target.appendChild(navigation);

    return navigation;
}


/* ============================================================
   CONFIGURAÇÃO
   ============================================================ */

function configure(options = {}) {
    if (
        !options ||
        typeof options !== "object"
    ) {
        return getConfig();
    }

    if (
        options.defaultSection !== undefined
    ) {
        const section =
            normalizeSection(
                options.defaultSection
            );

        if (section) {
            LIFE_NAVIGATION_CONFIG.defaultSection =
                section;
        }
    }

    if (
        options.rememberLastSection !== undefined
    ) {
        LIFE_NAVIGATION_CONFIG
            .rememberLastSection =
            Boolean(
                options.rememberLastSection
            );
    }

    if (
        options.maxHistory !== undefined
    ) {
        const max =
            Number(options.maxHistory);

        if (
            Number.isFinite(max) &&
            max >= 1
        ) {
            navigationState.maxHistory =
                Math.floor(max);
        }
    }

    if (
        options.sections &&
        typeof options.sections === "object"
    ) {
        Object.keys(options.sections)
            .forEach(section => {
                const normalized =
                    normalizeText(section);

                if (
                    Object.prototype
                        .hasOwnProperty.call(
                            LIFE_NAVIGATION_CONFIG.sections,
                            normalized
                        )
                ) {
                    LIFE_NAVIGATION_CONFIG
                        .sections[normalized] =
                        Boolean(
                            options.sections[section]
                        );
                }
            });
    }

    syncPersistentState();

    return getConfig();
}


function getConfig() {
    return clone({
        ...LIFE_NAVIGATION_CONFIG,

        history: {
            max:
                navigationState.maxHistory
        },

        currentSection:
            navigationState.currentSection,

        previousSection:
            navigationState.previousSection
    });
}


/* ============================================================
   SNAPSHOT
   ============================================================ */

function getSnapshot() {
    return {
        version:
            LIFE_NAVIGATION_VERSION,

        initialized:
            navigationState.initialized,

        currentSection:
            navigationState.currentSection,

        previousSection:
            navigationState.previousSection,

        current:
            getSection(
                navigationState.currentSection
            ),

        sections:
            getSections(),

        history:
            getNavigationHistory(),

        lastNavigationAt:
            navigationState.lastNavigationAt
    };
}


/* ============================================================
   VALIDAÇÃO
   ============================================================ */

function validate() {
    const errors = [];
    const warnings = [];

    if (
        !isValidSection(
            navigationState.currentSection
        )
    ) {
        errors.push(
            "currentSection inválida."
        );
    }

    if (
        navigationState.previousSection &&
        !isValidSection(
            navigationState.previousSection
        )
    ) {
        warnings.push(
            "previousSection inválida."
        );
    }

    if (
        !Array.isArray(
            navigationState.history
        )
    ) {
        errors.push(
            "navigation history inválido."
        );
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}


/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

function initialize(database = null, options = {}) {
    if (database) {
        setDatabase(database);
    }

    ensureDatabase();

    if (
        options &&
        typeof options === "object"
    ) {
        configure(options);
    }

    loadPersistentState();

    if (
        !isValidSection(
            navigationState.currentSection
        )
    ) {
        navigationState.currentSection =
            LIFE_NAVIGATION_CONFIG.defaultSection;
    }

    navigationState.initialized = true;

    syncPersistentState();

    if (
        options.render === true &&
        typeof document !== "undefined"
    ) {
        render(
            options.container ||
            LIFE_NAVIGATION_CONFIG.rootId
        );
    }

    return getSnapshot();
}


function reset() {
    navigationState.currentSection =
        LIFE_NAVIGATION_CONFIG.defaultSection;

    navigationState.previousSection =
        null;

    navigationState.history = [];

    navigationState.lastNavigationAt =
        null;

    navigationState.initialized = false;

    syncPersistentState();

    return getSnapshot();
}


/* ============================================================
   API
   ============================================================ */

const lifeNavigationAPI = {
    version:
        LIFE_NAVIGATION_VERSION,

    config:
        LIFE_NAVIGATION_CONFIG,

    initialize,

    reset,

    configure,

    getConfig,

    getDatabase,

    setDatabase,

    ensureDatabase,

    getCurrentSection,

    getPreviousSection,

    getSection,

    getSections,

    getSectionIds,

    getSectionLabel,

    getSectionIcon,

    isValidSection,

    normalizeSection,

    navigate,

    goTo,

    goBack,

    goHome,

    refresh,

    goNext,

    goPrevious,

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

    openNotifications,

    getNavigationHistory,

    clearNavigationHistory,

    addListener,

    removeListener,

    render,

    renderCurrentSection,

    navigateAndRender,

    sectionToHash,

    hashToSection,

    updateLocationHash,

    navigateFromHash,

    getSnapshot,

    validate
};


/* ============================================================
   API GLOBAL
   ============================================================ */

if (
    typeof globalThis !== "undefined"
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
    lifeNavigationAPI,

    initialize,
    reset,
    configure,
    getConfig,

    getDatabase,
    setDatabase,
    ensureDatabase,

    getCurrentSection,
    getPreviousSection,
    getSection,
    getSections,
    getSectionIds,
    getSectionLabel,
    getSectionIcon,
    isValidSection,
    normalizeSection,

    navigate,
    goTo,
    goBack,
    goHome,
    refresh,
    goNext,
    goPrevious,

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
    openNotifications,

    getNavigationHistory,
    clearNavigationHistory,

    addListener,
    removeListener,

    render,
    renderCurrentSection,
    navigateAndRender,

    sectionToHash,
    hashToSection,
    updateLocationHash,
    navigateFromHash,

    getSnapshot,
    validate
};

export default lifeNavigationAPI;
