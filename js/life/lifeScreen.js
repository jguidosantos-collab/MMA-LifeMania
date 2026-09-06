/* ============================================================
   MMA LIFE DYNASTY
   LIFE SCREEN
   ------------------------------------------------------------
   Camada principal da tela "Vida".

   Responsabilidades:
   - Integrar Life Dashboard
   - Integrar Life Navigation
   - Controlar seção ativa
   - Renderizar a tela de vida
   - Atualizar dashboard e navegação
   - Criar estrutura visual da tela
   - Preparar integração futura com o Engine principal

   Não depende de imports neste momento para evitar
   dependências circulares durante a construção do projeto.
   ============================================================ */

const LIFE_SCREEN_VERSION = 1;


/* ============================================================
   CONFIGURAÇÃO
   ============================================================ */

const LIFE_SCREEN_CONFIG = {
    version: LIFE_SCREEN_VERSION,

    rootId: "life-screen",

    navigationId: "life-screen-navigation",

    dashboardId: "life-screen-dashboard",

    defaultSection: "overview",

    autoRefresh: false,

    refreshInterval: 5000,

    showNavigation: true,

    showDashboard: true,

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

    title: "Vida",

    subtitle:
        "Sua vida, carreira, família e legado."
};


/* ============================================================
   ESTADO
   ============================================================ */

const lifeScreenState = {
    database: null,

    initialized: false,

    root: null,

    currentSection:
        LIFE_SCREEN_CONFIG.defaultSection,

    previousSection: null,

    lastRenderAt: null,

    lastRefreshAt: null,

    refreshTimer: null,

    listeners: [],

    rendering: false
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


function generateId(prefix = "life_screen") {
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
    return lifeScreenState.database;
}


function setDatabase(database) {
    lifeScreenState.database =
        database;

    return database;
}


function ensureDatabase(
    database =
        lifeScreenState.database
) {
    if (
        !database ||
        typeof database !== "object"
    ) {
        lifeScreenState.database = {};
    }

    const db =
        lifeScreenState.database;

    if (!db.life) {
        db.life = {};
    }

    if (!db.life.screen) {
        db.life.screen = {
            version:
                LIFE_SCREEN_VERSION,

            currentSection:
                LIFE_SCREEN_CONFIG
                    .defaultSection,

            previousSection: null,

            lastRenderAt: null,

            lastRefreshAt: null
        };
    }

    return db;
}


function syncDatabaseState() {
    const database =
        ensureDatabase();

    database.life.screen = {
        ...database.life.screen,

        version:
            LIFE_SCREEN_VERSION,

        currentSection:
            lifeScreenState.currentSection,

        previousSection:
            lifeScreenState.previousSection,

        lastRenderAt:
            lifeScreenState.lastRenderAt,

        lastRefreshAt:
            lifeScreenState.lastRefreshAt
    };

    return database.life.screen;
}


function loadDatabaseState() {
    const database =
        ensureDatabase();

    const stored =
        ensureObject(
            database.life.screen
        );

    const section =
        normalizeSection(
            stored.currentSection
        );

    if (section) {
        lifeScreenState.currentSection =
            section;
    }

    const previous =
        normalizeSection(
            stored.previousSection
        );

    lifeScreenState.previousSection =
        previous || null;

    lifeScreenState.lastRenderAt =
        stored.lastRenderAt || null;

    lifeScreenState.lastRefreshAt =
        stored.lastRefreshAt || null;

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


function getDashboardAPI() {
    if (
        typeof globalThis !== "undefined" &&
        globalThis.lifeDashboardAPI
    ) {
        return globalThis.lifeDashboardAPI;
    }

    return null;
}


function getLifeUIAPI() {
    if (
        typeof globalThis !== "undefined" &&
        globalThis.lifeUIAPI
    ) {
        return globalThis.lifeUIAPI;
    }

    return null;
}


function callAPI(
    api,
    method,
    ...args
) {
    if (
        !api ||
        typeof api[method] !== "function"
    ) {
        return {
            success: false,
            error:
                `METHOD_NOT_AVAILABLE:${method}`
        };
    }

    try {
        return {
            success: true,

            result:
                api[method](...args)
        };
    } catch (error) {
        return {
            success: false,

            error: "API_ERROR",

            message:
                error.message
        };
    }
}


/* ============================================================
   SEÇÕES
   ============================================================ */

function getSections() {
    const navigation =
        getNavigationAPI();

    if (
        navigation &&
        typeof navigation.getSections ===
            "function"
    ) {
        const sections =
            navigation.getSections();

        if (
            Array.isArray(sections) &&
            sections.length
        ) {
            return sections;
        }
    }

    return LIFE_SCREEN_CONFIG.sections
        .map(id => ({
            id,

            label:
                getFallbackLabel(id),

            icon:
                getFallbackIcon(id),

            enabled: true,

            active:
                id ===
                lifeScreenState.currentSection
        }));
}


function getFallbackLabel(section) {
    const labels = {
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
    };

    return (
        labels[section] ||
        section
    );
}


function getFallbackIcon(section) {
    const icons = {
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
    };

    return (
        icons[section] ||
        ""
    );
}


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

    if (
        !LIFE_SCREEN_CONFIG.sections
            .includes(normalized)
    ) {
        return null;
    }

    return normalized;
}


function isValidSection(section) {
    return Boolean(
        normalizeSection(section)
    );
}


/* ============================================================
   ESTADO DE SEÇÃO
   ============================================================ */

function getCurrentSection() {
    return (
        lifeScreenState.currentSection
    );
}


function getPreviousSection() {
    return (
        lifeScreenState.previousSection
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
        lifeScreenState.currentSection;

    lifeScreenState.previousSection =
        previous;

    lifeScreenState.currentSection =
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

    const navigation =
        getNavigationAPI();

    let result = null;

    if (
        navigation &&
        typeof navigation.navigate ===
            "function"
    ) {
        try {
            result =
                navigation.navigate(
                    normalized,
                    options
                );
        } catch (error) {
            result = {
                success: false,

                error:
                    "NAVIGATION_API_ERROR",

                message:
                    error.message
            };
        }
    }

    const local =
        setCurrentSection(
            normalized
        );

    if (
        options.updateHash !== false &&
        LIFE_SCREEN_CONFIG.syncHash
    ) {
        updateHash(normalized);
    }

    const renderResult =
        options.render === false
            ? null
            : renderContent(options);

    notifyListeners({
        type: "section_changed",

        section: normalized,

        previousSection:
            local.previousSection,

        navigationResult:
            clone(result),

        timestamp:
            new Date().toISOString()
    });

    return {
        success: true,

        section: normalized,

        previousSection:
            local.previousSection,

        navigation:
            result,

        render:
            renderResult
    };
}


function goHome() {
    return navigate("overview");
}


function goBack() {
    const navigation =
        getNavigationAPI();

    if (
        navigation &&
        typeof navigation.goBack ===
            "function"
    ) {
        const result =
            navigation.goBack();

        const section =
            normalizeSection(
                result?.section
            );

        if (section) {
            setCurrentSection(
                section
            );

            renderContent();
        }

        return result;
    }

    const previous =
        lifeScreenState.previousSection;

    if (!previous) {
        return {
            success: false,

            error:
                "NO_PREVIOUS_SECTION"
        };
    }

    return navigate(previous);
}


function goNext() {
    const navigation =
        getNavigationAPI();

    if (
        navigation &&
        typeof navigation.goNext ===
            "function"
    ) {
        const result =
            navigation.goNext();

        const section =
            normalizeSection(
                result?.section
            );

        if (section) {
            setCurrentSection(
                section
            );

            renderContent();
        }

        return result;
    }

    const sections =
        LIFE_SCREEN_CONFIG.sections;

    const index =
        sections.indexOf(
            lifeScreenState.currentSection
        );

    const next =
        sections[
            (index + 1) %
            sections.length
        ];

    return navigate(next);
}


function goPrevious() {
    const navigation =
        getNavigationAPI();

    if (
        navigation &&
        typeof navigation.goPrevious ===
            "function"
    ) {
        const result =
            navigation.goPrevious();

        const section =
            normalizeSection(
                result?.section
            );

        if (section) {
            setCurrentSection(
                section
            );

            renderContent();
        }

        return result;
    }

    const sections =
        LIFE_SCREEN_CONFIG.sections;

    const index =
        sections.indexOf(
            lifeScreenState.currentSection
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

    if (
        !LIFE_SCREEN_CONFIG.syncHash
    ) {
        return false;
    }

    const hash =
        sectionToHash(section);

    if (!hash) {
        return false;
    }

    try {
        if (
            window.location.hash !==
            hash
        ) {
            window.history.replaceState(
                null,
                "",
                hash
            );
        }

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
            "life-screen-styles"
        )
    ) {
        return true;
    }

    const style =
        document.createElement("style");

    style.id =
        "life-screen-styles";

    style.textContent = `
        .life-screen {
            width: 100%;
            min-height: 100%;
            box-sizing: border-box;
        }

        .life-screen-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 18px;
        }

        .life-screen-title {
            margin: 0;
            font-size: 28px;
            line-height: 1.15;
            font-weight: 800;
        }

        .life-screen-subtitle {
            margin: 6px 0 0;
            opacity: .7;
            line-height: 1.4;
        }

        .life-screen-navigation {
            width: 100%;
            margin-bottom: 18px;
        }

        .life-screen-dashboard {
            width: 100%;
        }

        .life-screen-content {
            width: 100%;
        }

        .life-screen-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 180px;
            opacity: .7;
        }

        .life-screen-empty {
            padding: 30px 20px;
            text-align: center;
            border: 1px dashed rgba(127,127,127,.3);
            border-radius: 14px;
            opacity: .75;
        }

        @media (max-width: 700px) {
            .life-screen-header {
                flex-direction: column;
            }

            .life-screen-title {
                font-size: 24px;
            }
        }
    `;

    document.head.appendChild(style);

    return true;
}


/* ============================================================
   HEADER
   ============================================================ */

function renderHeader(
    container
) {
    const header =
        createElement(
            "header",
            "life-screen-header"
        );

    if (!header) {
        return null;
    }

    const info =
        createElement(
            "div",
            "life-screen-header-info"
        );

    const title =
        createElement(
            "h1",
            "life-screen-title",
            LIFE_SCREEN_CONFIG.title
        );

    const subtitle =
        createElement(
            "p",
            "life-screen-subtitle",
            LIFE_SCREEN_CONFIG.subtitle
        );

    if (title) {
        info.appendChild(title);
    }

    if (subtitle) {
        info.appendChild(
            subtitle
        );
    }

    header.appendChild(info);

    container.appendChild(header);

    return header;
}


/* ============================================================
   NAVEGAÇÃO VISUAL
   ============================================================ */

function renderNavigation(
    container
) {
    if (
        !LIFE_SCREEN_CONFIG.showNavigation
    ) {
        return null;
    }

    const navigationAPI =
        getNavigationAPI();

    if (
        navigationAPI &&
        typeof navigationAPI.render ===
            "function"
    ) {
        try {
            return navigationAPI.render(
                container
            );
        } catch (error) {
            console.warn(
                "lifeNavigation render error:",
                error
            );
        }
    }

    const navigation =
        createElement(
            "nav",
            "life-navigation"
        );

    if (!navigation) {
        return null;
    }

    getSections().forEach(
        section => {
            if (
                section.enabled === false
            ) {
                return;
            }

            const button =
                createElement(
                    "button",
                    "life-navigation-item"
                );

            if (!button) {
                return;
            }

            button.type =
                "button";

            button.dataset.section =
                section.id;

            if (
                section.id ===
                lifeScreenState.currentSection
            ) {
                button.classList.add(
                    "active"
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
                button.appendChild(
                    icon
                );
            }

            if (label) {
                button.appendChild(
                    label
                );
            }

            button.addEventListener(
                "click",
                () => {
                    navigate(
                        section.id
                    );
                }
            );

            navigation.appendChild(
                button
            );
        }
    );

    container.appendChild(
        navigation
    );

    return navigation;
}


/* ============================================================
   DASHBOARD
   ============================================================ */

function renderDashboard(
    container,
    options = {}
) {
    if (
        !LIFE_SCREEN_CONFIG.showDashboard
    ) {
        return null;
    }

    const dashboardContainer =
        createElement(
            "div",
            "life-screen-dashboard"
        );

    if (!dashboardContainer) {
        return null;
    }

    dashboardContainer.id =
        LIFE_SCREEN_CONFIG
            .dashboardId;

    container.appendChild(
        dashboardContainer
    );

    const dashboardAPI =
        getDashboardAPI();

    if (
        dashboardAPI &&
        typeof dashboardAPI.renderDashboard ===
            "function"
    ) {
        try {
            dashboardAPI.renderDashboard(
                dashboardContainer,
                options
            );

            return dashboardContainer;
        } catch (error) {
            console.warn(
                "lifeDashboard render error:",
                error
            );
        }
    }

    if (
        dashboardAPI &&
        typeof dashboardAPI.refresh ===
            "function"
    ) {
        try {
            dashboardAPI.refresh({
                container:
                    dashboardContainer,
                ...options
            });

            return dashboardContainer;
        } catch (error) {
            console.warn(
                "lifeDashboard refresh error:",
                error
            );
        }
    }

    const lifeUI =
        getLifeUIAPI();

    if (
        lifeUI &&
        typeof lifeUI.renderDashboard ===
            "function"
    ) {
        try {
            lifeUI.renderDashboard(
                dashboardContainer,
                options
            );

            return dashboardContainer;
        } catch (error) {
            console.warn(
                "lifeUI dashboard error:",
                error
            );
        }
    }

    dashboardContainer.appendChild(
        createElement(
            "div",
            "life-screen-empty",
            "Dashboard de vida aguardando integração."
        )
    );

    return dashboardContainer;
}


/* ============================================================
   CONTEÚDO
   ============================================================ */

function renderContent(
    options = {}
) {
    const root =
        lifeScreenState.root;

    if (!root) {
        return {
            success: false,

            error:
                "ROOT_NOT_AVAILABLE"
        };
    }

    const content =
        root.querySelector(
            ".life-screen-content"
        );

    if (!content) {
        return {
            success: false,

            error:
                "CONTENT_NOT_AVAILABLE"
        };
    }

    lifeScreenState.rendering =
        true;

    try {
        content.innerHTML = "";

        const dashboardAPI =
            getDashboardAPI();

        let rendered = false;

        if (
            dashboardAPI &&
            typeof dashboardAPI.renderSection ===
                "function"
        ) {
            try {
                const result =
                    dashboardAPI.renderSection(
                        lifeScreenState
                            .currentSection,
                        {
                            container: content,
                            ...options
                        }
                    );

                if (
                    result !== undefined
                ) {
                    rendered = true;
                }
            } catch (error) {
                console.warn(
                    "lifeDashboard section error:",
                    error
                );
            }
        }

        if (!rendered) {
            const lifeUI =
                getLifeUIAPI();

            if (
                lifeUI &&
                typeof lifeUI.renderSection ===
                    "function"
            ) {
                try {
                    lifeUI.renderSection(
                        lifeScreenState
                            .currentSection,
                        {
                            container: content,
                            ...options
                        }
                    );

                    rendered = true;
                } catch (error) {
                    console.warn(
                        "lifeUI section error:",
                        error
                    );
                }
            }
        }

        if (!rendered) {
            const empty =
                createElement(
                    "div",
                    "life-screen-empty",
                    `Seção "${getFallbackLabel(
                        lifeScreenState
                            .currentSection
                    )}" aguardando integração.`
                );

            if (empty) {
                content.appendChild(
                    empty
                );
            }
        }

        updateNavigationActiveState();

        lifeScreenState.lastRenderAt =
            new Date().toISOString();

        syncDatabaseState();

        return {
            success: true,

            section:
                lifeScreenState
                    .currentSection,

            rendered
        };

    } finally {
        lifeScreenState.rendering =
            false;
    }
}


/* ============================================================
   ATUALIZAÇÃO DOS BOTÕES
   ============================================================ */

function updateNavigationActiveState() {
    const root =
        lifeScreenState.root;

    if (!root) {
        return;
    }

    const buttons =
        root.querySelectorAll(
            "[data-section]"
        );

    buttons.forEach(button => {
        const section =
            normalizeSection(
                button.dataset.section
            );

        const active =
            section ===
            lifeScreenState.currentSection;

        button.classList.toggle(
            "active",
            active
        );

        if (active) {
            button.setAttribute(
                "aria-current",
                "page"
            );
        } else {
            button.removeAttribute(
                "aria-current"
            );
        }
    });
}


/* ============================================================
   RENDERIZAÇÃO PRINCIPAL
   ============================================================ */

function render(
    target = LIFE_SCREEN_CONFIG.rootId,
    options = {}
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
                "ROOT_NOT_FOUND",

            rootId:
                typeof target === "string"
                    ? target
                    : null
        };
    }

    injectStyles();

    lifeScreenState.root =
        root;

    root.innerHTML = "";

    root.classList.add(
        "life-screen"
    );

    renderHeader(root);

    const navigationContainer =
        createElement(
            "div",
            "life-screen-navigation"
        );

    if (navigationContainer) {
        navigationContainer.id =
            LIFE_SCREEN_CONFIG
                .navigationId;

        root.appendChild(
            navigationContainer
        );

        renderNavigation(
            navigationContainer
        );
    }

    const content =
        createElement(
            "main",
            "life-screen-content"
        );

    if (content) {
        root.appendChild(content);
    }

    if (
        options.showDashboard === true
    ) {
        renderDashboard(
            root,
            options
        );
    }

    const contentResult =
        renderContent(options);

    lifeScreenState.lastRenderAt =
        new Date().toISOString();

    syncDatabaseState();

    return {
        success: true,

        root,

        section:
            lifeScreenState
                .currentSection,

        content:
            contentResult
    };
}


/* ============================================================
   REFRESH
   ============================================================ */

function refresh(
    options = {}
) {
    lifeScreenState.lastRefreshAt =
        new Date().toISOString();

    const dashboardAPI =
        getDashboardAPI();

    let dashboardResult = null;

    if (
        dashboardAPI &&
        typeof dashboardAPI.refresh ===
            "function"
    ) {
        try {
            dashboardResult =
                dashboardAPI.refresh(
                    options
                );
        } catch (error) {
            dashboardResult = {
                success: false,

                error:
                    "DASHBOARD_REFRESH_ERROR",

                message:
                    error.message
            };
        }
    }

    const contentResult =
        renderContent(options);

    syncDatabaseState();

    notifyListeners({
        type: "refresh",

        section:
            lifeScreenState
                .currentSection,

        timestamp:
            lifeScreenState
                .lastRefreshAt
    });

    return {
        success: true,

        dashboard:
            dashboardResult,

        content:
            contentResult,

        timestamp:
            lifeScreenState
                .lastRefreshAt
    };
}


/* ============================================================
   AUTO REFRESH
   ============================================================ */

function startAutoRefresh(
    interval =
        LIFE_SCREEN_CONFIG
            .refreshInterval
) {
    stopAutoRefresh();

    const milliseconds =
        Math.max(
            1000,
            Number(interval) || 5000
        );

    lifeScreenState.refreshTimer =
        setInterval(
            () => {
                if (
                    lifeScreenState.initialized
                ) {
                    refresh();
                }
            },
            milliseconds
        );

    LIFE_SCREEN_CONFIG.autoRefresh =
        true;

    LIFE_SCREEN_CONFIG.refreshInterval =
        milliseconds;

    return true;
}


function stopAutoRefresh() {
    if (
        lifeScreenState.refreshTimer
    ) {
        clearInterval(
            lifeScreenState.refreshTimer
        );

        lifeScreenState.refreshTimer =
            null;
    }

    LIFE_SCREEN_CONFIG.autoRefresh =
        false;

    return true;
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
        !lifeScreenState.listeners
            .includes(callback)
    ) {
        lifeScreenState.listeners
            .push(callback);
    }

    return true;
}


function removeListener(callback) {
    const index =
        lifeScreenState.listeners
            .indexOf(callback);

    if (index === -1) {
        return false;
    }

    lifeScreenState.listeners
        .splice(index, 1);

    return true;
}


function notifyListeners(event) {
    lifeScreenState.listeners
        .slice()
        .forEach(listener => {
            try {
                listener(
                    clone(event)
                );
            } catch (error) {
                console.error(
                    "lifeScreen listener error:",
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
        LIFE_SCREEN_CONFIG.rootId =
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
            LIFE_SCREEN_CONFIG
                .defaultSection =
                section;
        }
    }

    if (
        options.showNavigation !==
        undefined
    ) {
        LIFE_SCREEN_CONFIG
            .showNavigation =
            Boolean(
                options.showNavigation
            );
    }

    if (
        options.showDashboard !==
        undefined
    ) {
        LIFE_SCREEN_CONFIG
            .showDashboard =
            Boolean(
                options.showDashboard
            );
    }

    if (
        options.syncHash !==
        undefined
    ) {
        LIFE_SCREEN_CONFIG
            .syncHash =
            Boolean(
                options.syncHash
            );
    }

    if (
        options.autoRefresh !==
        undefined
    ) {
        LIFE_SCREEN_CONFIG
            .autoRefresh =
            Boolean(
                options.autoRefresh
            );
    }

    if (
        options.refreshInterval !==
        undefined
    ) {
        const interval =
            Number(
                options.refreshInterval
            );

        if (
            Number.isFinite(interval) &&
            interval >= 1000
        ) {
            LIFE_SCREEN_CONFIG
                .refreshInterval =
                interval;
        }
    }

    if (
        Array.isArray(
            options.sections
        )
    ) {
        const sections =
            options.sections
                .map(normalizeSection)
                .filter(Boolean);

        if (sections.length) {
            LIFE_SCREEN_CONFIG.sections =
                [
                    ...new Set(sections)
                ];
        }
    }

    if (
        options.title !== undefined
    ) {
        LIFE_SCREEN_CONFIG.title =
            String(options.title);
    }

    if (
        options.subtitle !== undefined
    ) {
        LIFE_SCREEN_CONFIG.subtitle =
            String(
                options.subtitle
            );
    }

    syncDatabaseState();

    return getConfig();
}


function getConfig() {
    return clone(
        LIFE_SCREEN_CONFIG
    );
}


/* ============================================================
   SNAPSHOT
   ============================================================ */

function getSnapshot() {
    return {
        version:
            LIFE_SCREEN_VERSION,

        initialized:
            lifeScreenState.initialized,

        currentSection:
            lifeScreenState.currentSection,

        previousSection:
            lifeScreenState.previousSection,

        lastRenderAt:
            lifeScreenState.lastRenderAt,

        lastRefreshAt:
            lifeScreenState.lastRefreshAt,

        autoRefresh:
            Boolean(
                lifeScreenState
                    .refreshTimer
            ),

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
            lifeScreenState.currentSection
        )
    ) {
        errors.push(
            "currentSection inválida."
        );
    }

    if (
        lifeScreenState.previousSection &&
        !isValidSection(
            lifeScreenState.previousSection
        )
    ) {
        warnings.push(
            "previousSection inválida."
        );
    }

    if (
        !Array.isArray(
            LIFE_SCREEN_CONFIG.sections
        ) ||
        !LIFE_SCREEN_CONFIG.sections.length
    ) {
        errors.push(
            "Nenhuma seção de vida configurada."
        );
    }

    if (
        LIFE_SCREEN_CONFIG
            .refreshInterval < 1000
    ) {
        warnings.push(
            "refreshInterval inferior a 1000ms."
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
        LIFE_SCREEN_CONFIG.syncHash
            ? readHash()
            : null;

    if (hashSection) {
        lifeScreenState.currentSection =
            hashSection;
    }

    if (
        !isValidSection(
            lifeScreenState.currentSection
        )
    ) {
        lifeScreenState.currentSection =
            LIFE_SCREEN_CONFIG
                .defaultSection;
    }

    lifeScreenState.initialized =
        true;

    syncDatabaseState();

    if (
        options.render !== false &&
        typeof document !== "undefined"
    ) {
        render(
            options.root ||
            LIFE_SCREEN_CONFIG.rootId,
            options
        );
    }

    if (
        options.autoRefresh === true
    ) {
        startAutoRefresh(
            options.refreshInterval ||
            LIFE_SCREEN_CONFIG
                .refreshInterval
        );
    }

    return getSnapshot();
}


/* ============================================================
   DESTROY
   ============================================================ */

function destroy() {
    stopAutoRefresh();

    lifeScreenState.listeners = [];

    lifeScreenState.root = null;

    lifeScreenState.initialized =
        false;

    lifeScreenState.rendering =
        false;

    return true;
}


/* ============================================================
   RESET
   ============================================================ */

function reset() {
    stopAutoRefresh();

    lifeScreenState.currentSection =
        LIFE_SCREEN_CONFIG
            .defaultSection;

    lifeScreenState.previousSection =
        null;

    lifeScreenState.lastRenderAt =
        null;

    lifeScreenState.lastRefreshAt =
        null;

    lifeScreenState.initialized =
        false;

    lifeScreenState.rendering =
        false;

    syncDatabaseState();

    return getSnapshot();
}


/* ============================================================
   API
   ============================================================ */

const lifeScreenAPI = {
    version:
        LIFE_SCREEN_VERSION,

    config:
        LIFE_SCREEN_CONFIG,

    initialize,

    destroy,

    reset,

    configure,

    getConfig,

    getDatabase,

    setDatabase,

    ensureDatabase,

    getCurrentSection,

    getPreviousSection,

    setCurrentSection,

    getSections,

    isValidSection,

    normalizeSection,

    navigate,

    goHome,

    goBack,

    goNext,

    goPrevious,

    sectionToHash,

    hashToSection,

    updateHash,

    readHash,

    navigateFromHash,

    render,

    renderHeader,

    renderNavigation,

    renderDashboard,

    renderContent,

    updateNavigationActiveState,

    refresh,

    startAutoRefresh,

    stopAutoRefresh,

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
    globalThis.lifeScreenAPI =
        lifeScreenAPI;
}


/* ============================================================
   EXPORT
   ============================================================ */

export {
    LIFE_SCREEN_VERSION,
    LIFE_SCREEN_CONFIG,
    lifeScreenAPI,

    initialize,
    destroy,
    reset,

    configure,
    getConfig,

    getDatabase,
    setDatabase,
    ensureDatabase,

    getCurrentSection,
    getPreviousSection,
    setCurrentSection,

    getSections,
    isValidSection,
    normalizeSection,

    navigate,
    goHome,
    goBack,
    goNext,
    goPrevious,

    sectionToHash,
    hashToSection,
    updateHash,
    readHash,
    navigateFromHash,

    render,
    renderHeader,
    renderNavigation,
    renderDashboard,
    renderContent,
    updateNavigationActiveState,

    refresh,
    startAutoRefresh,
    stopAutoRefresh,

    addListener,
    removeListener,

    getSnapshot,
    validate
};

export default lifeScreenAPI;
