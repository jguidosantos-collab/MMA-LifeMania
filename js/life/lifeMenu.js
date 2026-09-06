/* ============================================================
   MMA LIFE DYNASTY
   LIFE MENU
   ------------------------------------------------------------
   Menu principal da área LIFE.

   Responsabilidades:
   - Exibir as áreas da Vida
   - Controlar a seção ativa
   - Integrar com lifeNavigation
   - Integrar com lifeScreen
   - Permitir navegação por abas
   - Mostrar indicadores/badges
   - Preparar menu mobile
   - Não depende de imports neste estágio
   ============================================================ */

const LIFE_MENU_VERSION = 1;


/* ============================================================
   CONFIGURAÇÃO
   ============================================================ */

const LIFE_MENU_CONFIG = {
    version: LIFE_MENU_VERSION,

    rootId: "life-menu",

    defaultSection: "overview",

    mobileBreakpoint: 700,

    showIcons: true,

    showLabels: true,

    showBadges: true,

    compact: false,

    sections: [
        {
            id: "overview",
            label: "Visão Geral",
            icon: "🏠",
            enabled: true
        },

        {
            id: "relationships",
            label: "Relacionamentos",
            icon: "❤️",
            enabled: true
        },

        {
            id: "family",
            label: "Família",
            icon: "👨‍👩‍👧‍👦",
            enabled: true
        },

        {
            id: "career",
            label: "Carreira",
            icon: "🥊",
            enabled: true
        },

        {
            id: "finances",
            label: "Finanças",
            icon: "💰",
            enabled: true
        },

        {
            id: "lifestyle",
            label: "Estilo de Vida",
            icon: "✨",
            enabled: true
        },

        {
            id: "media",
            label: "Mídia",
            icon: "📱",
            enabled: true
        },

        {
            id: "history",
            label: "Histórico",
            icon: "📖",
            enabled: true
        },

        {
            id: "milestones",
            label: "Conquistas",
            icon: "🏆",
            enabled: true
        },

        {
            id: "dynasty",
            label: "Dinastia",
            icon: "👑",
            enabled: true
        },

        {
            id: "notifications",
            label: "Notificações",
            icon: "🔔",
            enabled: true
        }
    ]
};


/* ============================================================
   ESTADO
   ============================================================ */

const lifeMenuState = {
    database: null,

    initialized: false,

    root: null,

    currentSection:
        LIFE_MENU_CONFIG.defaultSection,

    previousSection: null,

    badges: {},

    collapsed: false,

    mobileOpen: false,

    listeners: []
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


function ensureObject(value) {
    return value &&
        typeof value === "object"
        ? value
        : {};
}


function ensureArray(value) {
    return Array.isArray(value)
        ? value
        : [];
}


function generateId(prefix = "life_menu") {
    return (
        `${prefix}_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 9)}`
    );
}


function getElement(target) {
    if (
        typeof document === "undefined"
    ) {
        return null;
    }

    if (!target) {
        return null;
    }

    if (
        typeof target === "string"
    ) {
        return document.getElementById(
            target
        );
    }

    return target;
}


function createElement(
    tag,
    className = "",
    text = undefined
) {
    if (
        typeof document === "undefined"
    ) {
        return null;
    }

    const element =
        document.createElement(tag);

    if (className) {
        element.className =
            className;
    }

    if (
        text !== undefined &&
        text !== null
    ) {
        element.textContent =
            text;
    }

    return element;
}


/* ============================================================
   BANCO DE DADOS
   ============================================================ */

function getDatabase() {
    return lifeMenuState.database;
}


function setDatabase(database) {
    lifeMenuState.database =
        database;

    return database;
}


function ensureDatabase(
    database =
        lifeMenuState.database
) {
    if (
        !database ||
        typeof database !== "object"
    ) {
        lifeMenuState.database = {};
    }

    const db =
        lifeMenuState.database;

    if (!db.life) {
        db.life = {};
    }

    if (!db.life.menu) {
        db.life.menu = {
            version:
                LIFE_MENU_VERSION,

            currentSection:
                LIFE_MENU_CONFIG
                    .defaultSection,

            previousSection: null,

            badges: {},

            collapsed: false,

            mobileOpen: false
        };
    }

    return db;
}


function syncDatabaseState() {
    const database =
        ensureDatabase();

    database.life.menu = {
        ...database.life.menu,

        version:
            LIFE_MENU_VERSION,

        currentSection:
            lifeMenuState.currentSection,

        previousSection:
            lifeMenuState.previousSection,

        badges:
            clone(
                lifeMenuState.badges
            ),

        collapsed:
            lifeMenuState.collapsed,

        mobileOpen:
            lifeMenuState.mobileOpen
    };

    return database.life.menu;
}


function loadDatabaseState() {
    const database =
        ensureDatabase();

    const stored =
        ensureObject(
            database.life.menu
        );

    const section =
        normalizeSection(
            stored.currentSection
        );

    if (section) {
        lifeMenuState.currentSection =
            section;
    }

    lifeMenuState.previousSection =
        normalizeSection(
            stored.previousSection
        ) || null;

    lifeMenuState.badges =
        ensureObject(
            stored.badges
        );

    lifeMenuState.collapsed =
        Boolean(
            stored.collapsed
        );

    lifeMenuState.mobileOpen =
        Boolean(
            stored.mobileOpen
        );

    return syncDatabaseState();
}


/* ============================================================
   APIs EXTERNAS
   ============================================================ */

function getNavigationAPI() {
    if (
        typeof globalThis !== "undefined" &&
        globalThis.lifeNavigationAPI
    ) {
        return globalThis.lifeNavigationAPI;
    }

    return null;
}


function getScreenAPI() {
    if (
        typeof globalThis !== "undefined" &&
        globalThis.lifeScreenAPI
    ) {
        return globalThis.lifeScreenAPI;
    }

    return null;
}


function getDashboardAPI() {
    if (
        typeof globalThis !== "undefined" &&
        globalThis.lifeDashboardAPI
    ) {
        return globalThis.lifeDashboardAPI;
    }

    return null;
}


/* ============================================================
   SEÇÕES
   ============================================================ */

function normalizeSection(section) {
    const value =
        normalizeText(section);

    if (!value) {
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

    const normalized =
        aliases[value] || value;

    const exists =
        LIFE_MENU_CONFIG.sections
            .some(
                item =>
                    item.id === normalized
            );

    return exists
        ? normalized
        : null;
}


function isValidSection(section) {
    return Boolean(
        normalizeSection(section)
    );
}


function getSectionDefinition(
    section
) {
    const normalized =
        normalizeSection(section);

    if (!normalized) {
        return null;
    }

    const item =
        LIFE_MENU_CONFIG.sections
            .find(
                sectionItem =>
                    sectionItem.id ===
                    normalized
            );

    return item
        ? clone(item)
        : null;
}


function getSections() {
    return LIFE_MENU_CONFIG.sections
        .filter(
            section =>
                section.enabled !== false
        )
        .map(section => ({
            ...clone(section),

            active:
                section.id ===
                lifeMenuState
                    .currentSection,

            badge:
                getBadge(
                    section.id
                )
        }));
}


function getSectionIds() {
    return getSections()
        .map(section => section.id);
}


/* ============================================================
   ESTADO DA SEÇÃO
   ============================================================ */

function getCurrentSection() {
    return (
        lifeMenuState.currentSection
    );
}


function getPreviousSection() {
    return (
        lifeMenuState.previousSection
    );
}


function setCurrentSection(
    section
) {
    const normalized =
        normalizeSection(section);

    if (!normalized) {
        return {
            success: false,

            error:
                "INVALID_SECTION"
        };
    }

    const previous =
        lifeMenuState.currentSection;

    lifeMenuState.previousSection =
        previous;

    lifeMenuState.currentSection =
        normalized;

    syncDatabaseState();

    return {
        success: true,

        changed:
            previous !== normalized,

        section: normalized,

        previousSection:
            previous
    };
}


/* ============================================================
   BADGES
   ============================================================ */

function normalizeBadge(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return null;
    }

    if (
        typeof value === "number"
    ) {
        return {
            value:
                Math.max(
                    0,
                    Math.floor(value)
                ),

            type: "number"
        };
    }

    if (
        typeof value === "boolean"
    ) {
        return {
            value: value ? 1 : 0,

            type: "number"
        };
    }

    if (
        typeof value === "string"
    ) {
        const text =
            value.trim();

        if (!text) {
            return null;
        }

        return {
            value: text,

            type: "text"
        };
    }

    if (
        typeof value === "object"
    ) {
        return {
            value:
                value.value ??
                value.count ??
                value.text ??
                "",

            type:
                value.type ||
                "text",

            label:
                value.label ||
                null
        };
    }

    return null;
}


function setBadge(
    section,
    value
) {
    const normalized =
        normalizeSection(section);

    if (!normalized) {
        return false;
    }

    const badge =
        normalizeBadge(value);

    if (!badge) {
        delete lifeMenuState.badges[
            normalized
        ];
    } else {
        lifeMenuState.badges[
            normalized
        ] = badge;
    }

    syncDatabaseState();

    notifyListeners({
        type: "badge_changed",

        section: normalized,

        badge:
            clone(badge)
    });

    updateRenderedBadges();

    return true;
}


function getBadge(section) {
    const normalized =
        normalizeSection(section);

    if (!normalized) {
        return null;
    }

    return clone(
        lifeMenuState.badges[
            normalized
        ] || null
    );
}


function removeBadge(section) {
    return setBadge(
        section,
        null
    );
}


function clearBadges() {
    lifeMenuState.badges = {};

    syncDatabaseState();

    updateRenderedBadges();

    return true;
}


function getBadgeValue(section) {
    const badge =
        getBadge(section);

    if (!badge) {
        return null;
    }

    return badge.value;
}


/* ============================================================
   BADGES AUTOMÁTICOS
   ============================================================ */

function calculateAutomaticBadges() {
    const database =
        lifeMenuState.database;

    if (!database) {
        return {};
    }

    const result = {};

    const life =
        ensureObject(
            database.life
        );

    const relationships =
        ensureArray(
            life.relationships
        );

    const notifications =
        ensureArray(
            database.notifications
        );

    const media =
        ensureObject(
            database.media
        );

    const career =
        ensureObject(
            database.career
        );

    const milestones =
        ensureObject(
            life.milestones
        );

    const children =
        ensureArray(
            life.children
        );

    if (
        relationships.length
    ) {
        result.relationships = {
            value:
                relationships.length,

            type: "number"
        };
    }

    if (
        children.length
    ) {
        result.family = {
            value:
                children.length,

            type: "number"
        };
    }

    if (
        notifications.length
    ) {
        result.notifications = {
            value:
                notifications.length,

            type: "number"
        };
    }

    if (
        milestones &&
        Array.isArray(
            milestones.notifications
        ) &&
        milestones.notifications.length
    ) {
        result.milestones = {
            value:
                milestones.notifications
                    .length,

            type: "number"
        };
    }

    const fame =
        Number(
            media.fame ?? 0
        );

    if (
        Number.isFinite(fame) &&
        fame >= 100
    ) {
        result.media = {
            value: "!",
            type: "text"
        };
    }

    const professional =
        career.professional === true ||
        career.proStatus === true ||
        career.status ===
            "professional";

    if (professional) {
        result.career = {
            value: "PRO",
            type: "text"
        };
    }

    return result;
}


function refreshAutomaticBadges() {
    const automatic =
        calculateAutomaticBadges();

    Object.keys(automatic)
        .forEach(section => {
            setBadge(
                section,
                automatic[section]
            );
        });

    return automatic;
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

            error:
                "INVALID_SECTION"
        };
    }

    const previous =
        lifeMenuState.currentSection;

    const navigation =
        getNavigationAPI();

    let navigationResult =
        null;

    if (
        navigation &&
        typeof navigation.navigate ===
            "function"
    ) {
        try {
            navigationResult =
                navigation.navigate(
                    normalized,
                    {
                        ...options,

                        render:
                            options.render ??
                            false
                    }
                );
        } catch (error) {
            navigationResult = {
                success: false,

                error:
                    "NAVIGATION_ERROR",

                message:
                    error.message
            };
        }
    }

    setCurrentSection(
        normalized
    );

    if (
        options.syncScreen !== false
    ) {
        const screen =
            getScreenAPI();

        if (
            screen &&
            typeof screen.setCurrentSection ===
                "function"
        ) {
            try {
                screen.setCurrentSection(
                    normalized
                );
            } catch (error) {
                console.warn(
                    "lifeScreen sync error:",
                    error
                );
            }
        }
    }

    if (
        options.updateHash !== false
    ) {
        updateHash(
            normalized
        );
    }

    updateRenderedActiveState();

    if (
        options.render === true
    ) {
        renderContent();
    }

    closeMobile();

    const event = {
        id:
            generateId("menu_navigation"),

        type:
            "menu_navigation",

        section:
            normalized,

        previousSection:
            previous,

        timestamp:
            new Date().toISOString()
    };

    notifyListeners(event);

    return {
        success: true,

        section:
            normalized,

        previousSection:
            previous,

        navigation:
            navigationResult,

        event
    };
}


function openSection(section) {
    return navigate(section);
}


function goHome() {
    return navigate(
        "overview"
    );
}


function goBack() {
    const previous =
        lifeMenuState.previousSection;

    if (!previous) {
        return {
            success: false,

            error:
                "NO_PREVIOUS_SECTION"
        };
    }

    return navigate(
        previous
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

    const index =
        sections.indexOf(
            lifeMenuState.currentSection
        );

    const next =
        sections[
            (index + 1) %
            sections.length
        ];

    return navigate(next);
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

    const index =
        sections.indexOf(
            lifeMenuState.currentSection
        );

    const previous =
        sections[
            index <= 0
                ? sections.length - 1
                : index - 1
        ];

    return navigate(previous);
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
   HASH
   ============================================================ */

function sectionToHash(section) {
    const normalized =
        normalizeSection(section);

    if (!normalized) {
        return "";
    }

    return `#life-${normalized}`;
}


function hashToSection(hash) {
    if (!hash) {
        return null;
    }

    const value =
        String(hash)
            .replace(/^#/, "")
            .trim();

    if (!value) {
        return null;
    }

    const section =
        value.startsWith("life-")
            ? value.slice(5)
            : value;

    return normalizeSection(
        section
    );
}


function updateHash(section) {
    if (
        typeof window === "undefined"
    ) {
        return false;
    }

    const hash =
        sectionToHash(section);

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
        return false;
    }
}


function readHash() {
    if (
        typeof window === "undefined"
    ) {
        return null;
    }

    return hashToSection(
        window.location.hash
    );
}


function navigateFromHash() {
    const section =
        readHash();

    if (!section) {
        return {
            success: false,

            error:
                "NO_VALID_HASH"
        };
    }

    return navigate(
        section,
        {
            updateHash: false
        }
    );
}


/* ============================================================
   ESTILOS
   ============================================================ */

function injectStyles() {
    if (
        typeof document === "undefined"
    ) {
        return false;
    }

    if (
        document.getElementById(
            "life-menu-styles"
        )
    ) {
        return true;
    }

    const style =
        document.createElement("style");

    style.id =
        "life-menu-styles";

    style.textContent = `
        .life-menu {
            width: 100%;
            box-sizing: border-box;
            margin-bottom: 18px;
        }

        .life-menu-bar {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            overflow-x: auto;
            scrollbar-width: thin;
            padding-bottom: 3px;
        }

        .life-menu-item {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            flex: 0 0 auto;
            min-height: 42px;
            padding: 9px 13px;
            border: 1px solid rgba(127,127,127,.22);
            border-radius: 11px;
            background: rgba(127,127,127,.07);
            color: inherit;
            cursor: pointer;
            font: inherit;
            white-space: nowrap;
            transition:
                transform .15s ease,
                background .15s ease,
                border-color .15s ease,
                opacity .15s ease;
        }

        .life-menu-item:hover {
            transform: translateY(-1px);
            background: rgba(127,127,127,.13);
        }

        .life-menu-item.active {
            background: rgba(127,127,127,.19);
            border-color: rgba(127,127,127,.45);
            font-weight: 700;
        }

        .life-menu-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 17px;
            line-height: 1;
        }

        .life-menu-label {
            line-height: 1;
        }

        .life-menu-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 18px;
            height: 18px;
            padding: 0 5px;
            border-radius: 999px;
            font-size: 10px;
            line-height: 1;
            font-weight: 800;
            background: rgba(127,127,127,.22);
        }

        .life-menu-badge:empty {
            display: none;
        }

        .life-menu-toggle {
            display: none;
            align-items: center;
            justify-content: center;
            min-width: 42px;
            min-height: 42px;
            border: 1px solid rgba(127,127,127,.22);
            border-radius: 11px;
            background: rgba(127,127,127,.08);
            color: inherit;
            cursor: pointer;
            font: inherit;
            font-size: 20px;
        }

        .life-menu.mobile-open
        .life-menu-bar {
            display: flex;
        }

        @media (max-width: 700px) {
            .life-menu-toggle {
                display: inline-flex;
            }

            .life-menu-bar {
                display: none;
                flex-direction: column;
                align-items: stretch;
                overflow: visible;
                margin-top: 8px;
            }

            .life-menu-item {
                width: 100%;
                justify-content: flex-start;
            }

            .life-menu.mobile-open
            .life-menu-bar {
                display: flex;
            }
        }

        .life-menu.compact
        .life-menu-item {
            min-height: 36px;
            padding: 7px 9px;
        }

        .life-menu.collapsed
        .life-menu-label {
            display: none;
        }

        .life-menu.collapsed
        .life-menu-item {
            min-width: 42px;
            padding: 9px;
        }
    `;

    document.head.appendChild(style);

    return true;
}


/* ============================================================
   MENU MOBILE
   ============================================================ */

function toggleMobile() {
    lifeMenuState.mobileOpen =
        !lifeMenuState.mobileOpen;

    syncDatabaseState();

    const root =
        lifeMenuState.root;

    if (root) {
        root.classList.toggle(
            "mobile-open",
            lifeMenuState.mobileOpen
        );

        updateMobileToggle();
    }

    return lifeMenuState.mobileOpen;
}


function openMobile() {
    lifeMenuState.mobileOpen =
        true;

    syncDatabaseState();

    const root =
        lifeMenuState.root;

    if (root) {
        root.classList.add(
            "mobile-open"
        );

        updateMobileToggle();
    }

    return true;
}


function closeMobile() {
    lifeMenuState.mobileOpen =
        false;

    syncDatabaseState();

    const root =
        lifeMenuState.root;

    if (root) {
        root.classList.remove(
            "mobile-open"
        );

        updateMobileToggle();
    }

    return true;
}


function updateMobileToggle() {
    const root =
        lifeMenuState.root;

    if (!root) {
        return;
    }

    const button =
        root.querySelector(
            ".life-menu-toggle"
        );

    if (!button) {
        return;
    }

    button.textContent =
        lifeMenuState.mobileOpen
            ? "✕"
            : "☰";

    button.setAttribute(
        "aria-expanded",
        lifeMenuState.mobileOpen
            ? "true"
            : "false"
    );
}


/* ============================================================
   MENU COLAPSADO
   ============================================================ */

function toggleCollapsed() {
    lifeMenuState.collapsed =
        !lifeMenuState.collapsed;

    syncDatabaseState();

    const root =
        lifeMenuState.root;

    if (root) {
        root.classList.toggle(
            "collapsed",
            lifeMenuState.collapsed
        );
    }

    return lifeMenuState.collapsed;
}


function setCollapsed(value) {
    lifeMenuState.collapsed =
        Boolean(value);

    syncDatabaseState();

    const root =
        lifeMenuState.root;

    if (root) {
        root.classList.toggle(
            "collapsed",
            lifeMenuState.collapsed
        );
    }

    return lifeMenuState.collapsed;
}


/* ============================================================
   RENDERIZAÇÃO
   ============================================================ */

function render(
    target =
        LIFE_MENU_CONFIG.rootId
) {
    if (
        typeof document === "undefined"
    ) {
        return {
            success: false,

            error:
                "DOCUMENT_NOT_AVAILABLE"
        };
    }

    const root =
        getElement(target);

    if (!root) {
        return {
            success: false,

            error:
                "ROOT_NOT_FOUND"
        };
    }

    injectStyles();

    lifeMenuState.root =
        root;

    root.innerHTML = "";

    root.classList.add(
        "life-menu"
    );

    root.classList.toggle(
        "compact",
        LIFE_MENU_CONFIG.compact
    );

    root.classList.toggle(
        "collapsed",
        lifeMenuState.collapsed
    );

    root.classList.toggle(
        "mobile-open",
        lifeMenuState.mobileOpen
    );

    const header =
        createElement(
            "div",
            "life-menu-header"
        );

    const toggle =
        createElement(
            "button",
            "life-menu-toggle",
            lifeMenuState.mobileOpen
                ? "✕"
                : "☰"
        );

    if (toggle) {
        toggle.type =
            "button";

        toggle.setAttribute(
            "aria-label",
            "Abrir menu da Vida"
        );

        toggle.setAttribute(
            "aria-expanded",
            lifeMenuState.mobileOpen
                ? "true"
                : "false"
        );

        toggle.addEventListener(
            "click",
            () => {
                toggleMobile();
            }
        );

        if (header) {
            header.appendChild(
                toggle
            );
        }
    }

    if (header) {
        root.appendChild(header);
    }

    const bar =
        createElement(
            "nav",
            "life-menu-bar"
        );

    if (!bar) {
        return {
            success: false,

            error:
                "MENU_BAR_ERROR"
        };
    }

    bar.setAttribute(
        "aria-label",
        "Menu da Vida"
    );

    getSections().forEach(
        section => {
            const button =
                createMenuItem(
                    section
                );

            if (button) {
                bar.appendChild(
                    button
                );
            }
        }
    );

    root.appendChild(bar);

    updateRenderedActiveState();

    updateRenderedBadges();

    updateMobileToggle();

    return {
        success: true,

        root,

        section:
            lifeMenuState
                .currentSection,

        items:
            getSections().length
    };
}


function createMenuItem(
    section
) {
    const button =
        createElement(
            "button",
            "life-menu-item"
        );

    if (!button) {
        return null;
    }

    button.type =
        "button";

    button.dataset.section =
        section.id;

    button.title =
        section.label;

    if (section.active) {
        button.classList.add(
            "active"
        );

        button.setAttribute(
            "aria-current",
            "page"
        );
    }

    if (
        LIFE_MENU_CONFIG.showIcons &&
        section.icon
    ) {
        const icon =
            createElement(
                "span",
                "life-menu-icon",
                section.icon
            );

        if (icon) {
            icon.setAttribute(
                "aria-hidden",
                "true"
            );

            button.appendChild(
                icon
            );
        }
    }

    if (
        LIFE_MENU_CONFIG.showLabels
    ) {
        const label =
            createElement(
                "span",
                "life-menu-label",
                section.label
            );

        if (label) {
            button.appendChild(
                label
            );
        }
    }

    if (
        LIFE_MENU_CONFIG.showBadges
    ) {
        const badge =
            createElement(
                "span",
                "life-menu-badge"
            );

        if (badge) {
            badge.dataset.badge =
                section.id;

            const value =
                getBadgeValue(
                    section.id
                );

            if (
                value !== null &&
                value !== undefined
            ) {
                badge.textContent =
                    String(value);
            }

            button.appendChild(
                badge
            );
        }
    }

    button.addEventListener(
        "click",
        () => {
            navigate(
                section.id,
                {
                    render: true
                }
            );
        }
    );

    return button;
}


function updateRenderedActiveState() {
    const root =
        lifeMenuState.root;

    if (!root) {
        return;
    }

    root.classList.toggle(
        "collapsed",
        lifeMenuState.collapsed
    );

    root.classList.toggle(
        "mobile-open",
        lifeMenuState.mobileOpen
    );

    const items =
        root.querySelectorAll(
            "[data-section]"
        );

    items.forEach(item => {
        const section =
            normalizeSection(
                item.dataset.section
            );

        const active =
            section ===
            lifeMenuState.currentSection;

        item.classList.toggle(
            "active",
            active
        );

        if (active) {
            item.setAttribute(
                "aria-current",
                "page"
            );
        } else {
            item.removeAttribute(
                "aria-current"
            );
        }
    });
}


function updateRenderedBadges() {
    const root =
        lifeMenuState.root;

    if (!root) {
        return;
    }

    const badges =
        root.querySelectorAll(
            "[data-badge]"
        );

    badges.forEach(badge => {
        const section =
            normalizeSection(
                badge.dataset.badge
            );

        const value =
            getBadgeValue(section);

        badge.textContent =
            value === null ||
            value === undefined
                ? ""
                : String(value);
    });
}


/* ============================================================
   CONTEÚDO
   ============================================================ */

function renderContent() {
    const screen =
        getScreenAPI();

    if (
        screen &&
        typeof screen.renderContent ===
            "function"
    ) {
        try {
            return screen.renderContent();
        } catch (error) {
            return {
                success: false,

                error:
                    "SCREEN_RENDER_ERROR",

                message:
                    error.message
            };
        }
    }

    const dashboard =
        getDashboardAPI();

    if (
        dashboard &&
        typeof dashboard.renderSection ===
            "function"
    ) {
        try {
            return dashboard.renderSection(
                lifeMenuState
                    .currentSection
            );
        } catch (error) {
            return {
                success: false,

                error:
                    "DASHBOARD_RENDER_ERROR",

                message:
                    error.message
            };
        }
    }

    return {
        success: false,

        error:
            "CONTENT_API_NOT_AVAILABLE"
    };
}


/* ============================================================
   LISTENERS
   ============================================================ */

function addListener(callback) {
    if (
        typeof callback !== "function"
    ) {
        return false;
    }

    if (
        !lifeMenuState.listeners
            .includes(callback)
    ) {
        lifeMenuState.listeners
            .push(callback);
    }

    return true;
}


function removeListener(callback) {
    const index =
        lifeMenuState.listeners
            .indexOf(callback);

    if (index === -1) {
        return false;
    }

    lifeMenuState.listeners
        .splice(index, 1);

    return true;
}


function notifyListeners(event) {
    lifeMenuState.listeners
        .slice()
        .forEach(listener => {
            try {
                listener(
                    clone(event)
                );
            } catch (error) {
                console.error(
                    "lifeMenu listener error:",
                    error
                );
            }
        });
}


/* ============================================================
   CONFIGURAÇÃO
   ============================================================ */

function configure(
    options = {}
) {
    if (
        !options ||
        typeof options !== "object"
    ) {
        return getConfig();
    }

    if (
        options.rootId !== undefined
    ) {
        LIFE_MENU_CONFIG.rootId =
            String(
                options.rootId
            );
    }

    if (
        options.defaultSection !==
        undefined
    ) {
        const section =
            normalizeSection(
                options.defaultSection
            );

        if (section) {
            LIFE_MENU_CONFIG
                .defaultSection =
                section;
        }
    }

    if (
        options.showIcons !==
        undefined
    ) {
        LIFE_MENU_CONFIG.showIcons =
            Boolean(
                options.showIcons
            );
    }

    if (
        options.showLabels !==
        undefined
    ) {
        LIFE_MENU_CONFIG.showLabels =
            Boolean(
                options.showLabels
            );
    }

    if (
        options.showBadges !==
        undefined
    ) {
        LIFE_MENU_CONFIG.showBadges =
            Boolean(
                options.showBadges
            );
    }

    if (
        options.compact !==
        undefined
    ) {
        LIFE_MENU_CONFIG.compact =
            Boolean(
                options.compact
            );
    }

    if (
        Array.isArray(
            options.sections
        )
    ) {
        const validSections =
            options.sections
                .map(item => {
                    if (
                        typeof item ===
                        "string"
                    ) {
                        const id =
                            normalizeSection(
                                item
                            );

                        if (!id) {
                            return null;
                        }

                        const existing =
                            getSectionDefinition(
                                id
                            );

                        return (
                            existing || {
                                id,

                                label:
                                    id,

                                icon:
                                    "",

                                enabled:
                                    true
                            }
                        );
                    }

                    if (
                        item &&
                        typeof item ===
                            "object"
                    ) {
                        const id =
                            normalizeSection(
                                item.id
                            );

                        if (!id) {
                            return null;
                        }

                        return {
                            id,

                            label:
                                item.label ||
                                getSectionDefinition(
                                    id
                                )?.label ||
                                id,

                            icon:
                                item.icon ||
                                getSectionDefinition(
                                    id
                                )?.icon ||
                                "",

                            enabled:
                                item.enabled !==
                                false
                        };
                    }

                    return null;
                })
                .filter(Boolean);

        if (
            validSections.length
        ) {
            LIFE_MENU_CONFIG.sections =
                validSections;
        }
    }

    syncDatabaseState();

    return getConfig();
}


function getConfig() {
    return clone(
        LIFE_MENU_CONFIG
    );
}


/* ============================================================
   SNAPSHOT
   ============================================================ */

function getSnapshot() {
    return {
        version:
            LIFE_MENU_VERSION,

        initialized:
            lifeMenuState.initialized,

        currentSection:
            lifeMenuState.currentSection,

        previousSection:
            lifeMenuState.previousSection,

        collapsed:
            lifeMenuState.collapsed,

        mobileOpen:
            lifeMenuState.mobileOpen,

        badges:
            clone(
                lifeMenuState.badges
            ),

        sections:
            getSections(),

        config:
            getConfig()
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
            lifeMenuState.currentSection
        )
    ) {
        errors.push(
            "currentSection inválida."
        );
    }

    if (
        lifeMenuState.previousSection &&
        !isValidSection(
            lifeMenuState.previousSection
        )
    ) {
        warnings.push(
            "previousSection inválida."
        );
    }

    if (
        !Array.isArray(
            LIFE_MENU_CONFIG.sections
        ) ||
        !LIFE_MENU_CONFIG.sections.length
    ) {
        errors.push(
            "Nenhuma seção configurada."
        );
    }

    const ids =
        LIFE_MENU_CONFIG.sections
            .map(section => section.id);

    const duplicates =
        ids.filter(
            (id, index) =>
                ids.indexOf(id) !==
                index
        );

    if (duplicates.length) {
        errors.push(
            "Existem seções duplicadas."
        );
    }

    return {
        valid:
            errors.length === 0,

        errors,

        warnings
    };
}


/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

function initialize(
    database = null,
    options = {}
) {
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

    loadDatabaseState();

    const hashSection =
        readHash();

    if (hashSection) {
        lifeMenuState.currentSection =
            hashSection;
    }

    if (
        !isValidSection(
            lifeMenuState.currentSection
        )
    ) {
        lifeMenuState.currentSection =
            LIFE_MENU_CONFIG
                .defaultSection;
    }

    lifeMenuState.initialized =
        true;

    refreshAutomaticBadges();

    syncDatabaseState();

    if (
        options.render !== false &&
        typeof document !== "undefined"
    ) {
        render(
            options.root ||
            LIFE_MENU_CONFIG.rootId
        );
    }

    return getSnapshot();
}


/* ============================================================
   RESET
   ============================================================ */

function reset() {
    lifeMenuState.currentSection =
        LIFE_MENU_CONFIG
            .defaultSection;

    lifeMenuState.previousSection =
        null;

    lifeMenuState.badges = {};

    lifeMenuState.collapsed =
        false;

    lifeMenuState.mobileOpen =
        false;

    lifeMenuState.initialized =
        false;

    syncDatabaseState();

    return getSnapshot();
}


/* ============================================================
   DESTROY
   ============================================================ */

function destroy() {
    lifeMenuState.root =
        null;

    lifeMenuState.initialized =
        false;

    lifeMenuState.listeners = [];

    return true;
}


/* ============================================================
   API
   ============================================================ */

const lifeMenuAPI = {
    version:
        LIFE_MENU_VERSION,

    config:
        LIFE_MENU_CONFIG,

    initialize,

    reset,

    destroy,

    configure,

    getConfig,

    getDatabase,

    setDatabase,

    ensureDatabase,

    getSections,

    getSectionIds,

    getSectionDefinition,

    isValidSection,

    normalizeSection,

    getCurrentSection,

    getPreviousSection,

    setCurrentSection,

    navigate,

    openSection,

    goHome,

    goBack,

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

    setBadge,

    getBadge,

    getBadgeValue,

    removeBadge,

    clearBadges,

    calculateAutomaticBadges,

    refreshAutomaticBadges,

    sectionToHash,

    hashToSection,

    updateHash,

    readHash,

    navigateFromHash,

    toggleMobile,

    openMobile,

    closeMobile,

    toggleCollapsed,

    setCollapsed,

    render,

    createMenuItem,

    updateRenderedActiveState,

    updateRenderedBadges,

    renderContent,

    addListener,

    removeListener,

    getSnapshot,

    validate
};


/* ============================================================
   API GLOBAL
   ============================================================ */

if (
    typeof globalThis !== "undefined"
) {
    globalThis.lifeMenuAPI =
        lifeMenuAPI;
}


/* ============================================================
   EXPORT
   ============================================================ */

export {
    LIFE_MENU_VERSION,
    LIFE_MENU_CONFIG,
    lifeMenuAPI,

    initialize,
    reset,
    destroy,

    configure,
    getConfig,

    getDatabase,
    setDatabase,
    ensureDatabase,

    getSections,
    getSectionIds,
    getSectionDefinition,

    isValidSection,
    normalizeSection,

    getCurrentSection,
    getPreviousSection,
    setCurrentSection,

    navigate,
    openSection,
    goHome,
    goBack,
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

    setBadge,
    getBadge,
    getBadgeValue,
    removeBadge,
    clearBadges,

    calculateAutomaticBadges,
    refreshAutomaticBadges,

    sectionToHash,
    hashToSection,
    updateHash,
    readHash,
    navigateFromHash,

    toggleMobile,
    openMobile,
    closeMobile,

    toggleCollapsed,
    setCollapsed,

    render,
    createMenuItem,
    updateRenderedActiveState,
    updateRenderedBadges,
    renderContent,

    addListener,
    removeListener,

    getSnapshot,
    validate
};

export default lifeMenuAPI;
