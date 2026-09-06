// ============================================================
// MMA LIFE DYNASTY
// UI — MAIN MENU
// ============================================================

const MAIN_MENU_VERSION = 1;

const mainMenuState = {
    initialized: false,
    database: null,
    open: false,
    collapsed: false,
    activeSection: "dashboard",
    sections: [],
    lastRender: 0
};

// ============================================================
// CONFIGURAÇÃO
// ============================================================

const DEFAULT_SECTIONS = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: "⌂",
        description: "Visão geral da sua vida e carreira."
    },

    {
        id: "career",
        label: "Carreira",
        icon: "🥊",
        description: "Sua trajetória dentro do MMA."
    },

    {
        id: "training",
        label: "Treinamento",
        icon: "🏋",
        description: "Treinos, evolução e preparação."
    },

    {
        id: "fights",
        label: "Lutas",
        icon: "⚔",
        description: "Próximas lutas e histórico."
    },

    {
        id: "life",
        label: "Vida",
        icon: "♥",
        description: "Sua vida fora do octógono."
    },

    {
        id: "family",
        label: "Família",
        icon: "👨‍👩‍👧",
        description: "Relacionamentos, casamento e filhos."
    },

    {
        id: "finances",
        label: "Finanças",
        icon: "💰",
        description: "Dinheiro, patrimônio e negócios."
    },

    {
        id: "media",
        label: "Mídia",
        icon: "★",
        description: "Fama, seguidores e reputação."
    },

    {
        id: "dynasty",
        label: "Dinastia",
        icon: "♛",
        description: "Legado, herança e gerações."
    }
];

// ============================================================
// UTILIDADES
// ============================================================

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

function getDatabase(database = null) {
    return (
        database ||
        mainMenuState.database ||
        (typeof window !== "undefined"
            ? window.MMA_LIFE_DATABASE
            : null) ||
        null
    );
}

function setDatabase(database) {
    mainMenuState.database =
        database || null;

    return mainMenuState.database;
}

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getElement(id) {
    if (typeof document === "undefined") {
        return null;
    }

    return document.getElementById(id);
}

// ============================================================
// SEÇÕES
// ============================================================

function normalizeSection(section = {}) {
    return {
        id: String(
            section.id ||
            section.name ||
            "section"
        ),

        label: String(
            section.label ||
            section.title ||
            section.name ||
            "Seção"
        ),

        icon: String(
            section.icon ||
            "•"
        ),

        description: String(
            section.description ||
            ""
        ),

        visible:
            section.visible !== false,

        disabled:
            Boolean(section.disabled),

        badge:
            section.badge ??
            null
    };
}

function setSections(sections = []) {
    if (!Array.isArray(sections)) {
        return false;
    }

    mainMenuState.sections =
        sections
            .map(normalizeSection);

    return true;
}

function addSection(section) {
    const normalized =
        normalizeSection(section);

    const existing =
        mainMenuState.sections
            .findIndex(
                item =>
                    item.id ===
                    normalized.id
            );

    if (existing >= 0) {
        mainMenuState.sections[
            existing
        ] = normalized;
    } else {
        mainMenuState.sections.push(
            normalized
        );
    }

    return clone(normalized);
}

function removeSection(id) {
    const index =
        mainMenuState.sections
            .findIndex(
                section =>
                    section.id === id
            );

    if (index < 0) {
        return false;
    }

    mainMenuState.sections.splice(
        index,
        1
    );

    return true;
}

function getSection(id) {
    return clone(
        mainMenuState.sections.find(
            section =>
                section.id === id
        ) || null
    );
}

function getSections() {
    return clone(
        mainMenuState.sections
    );
}

// ============================================================
// SEÇÃO ATIVA
// ============================================================

function getActiveSection() {
    return mainMenuState.activeSection;
}

function setActiveSection(
    id,
    options = {}
) {
    if (!id) {
        return false;
    }

    const section =
        mainMenuState.sections.find(
            item =>
                item.id === id
        );

    if (!section) {
        return false;
    }

    if (section.disabled) {
        return false;
    }

    mainMenuState.activeSection =
        id;

    if (
        options.navigate !== false
    ) {
        navigateToSection(
            id,
            options
        );
    }

    render();

    return true;
}

// ============================================================
// NAVEGAÇÃO
// ============================================================

function navigateToSection(
    id,
    options = {}
) {
    if (
        typeof window ===
        "undefined"
    ) {
        return false;
    }

    const uiAPI =
        window.uiAPI ||
        window.MMA_LIFE_UI ||
        null;

    const lifeRouterAPI =
        window.lifeRouterAPI ||
        window.MMA_LIFE_LIFE_ROUTER ||
        null;

    const lifeNavigationAPI =
        window.lifeNavigationAPI ||
        window.MMA_LIFE_LIFE_NAVIGATION ||
        null;

    try {

        if (
            lifeRouterAPI &&
            typeof lifeRouterAPI.navigate ===
                "function"
        ) {
            lifeRouterAPI.navigate(
                id,
                options
            );

            return true;
        }

        if (
            lifeNavigationAPI &&
            typeof lifeNavigationAPI.navigate ===
                "function"
        ) {
            lifeNavigationAPI.navigate(
                id,
                options
            );

            return true;
        }

        if (
            uiAPI &&
            typeof uiAPI.openScreen ===
                "function"
        ) {
            uiAPI.openScreen(
                id,
                options
            );

            return true;
        }

        const hash =
            id === "dashboard"
                ? "#dashboard"
                : `#${id}`;

        window.location.hash =
            hash;

        return true;

    } catch (error) {

        console.error(
            "[MAIN MENU] Erro na navegação:",
            error
        );

        return false;
    }
}

// ============================================================
// BADGES
// ============================================================

function getBadgeForSection(
    section,
    database
) {
    if (
        section.badge !== null &&
        section.badge !== undefined
    ) {
        return section.badge;
    }

    if (section.id === "fights") {
        const events =
            database?.world?.events;

        if (Array.isArray(events)) {
            const upcoming =
                events.filter(
                    event =>
                        event?.status ===
                        "scheduled"
                );

            return upcoming.length || null;
        }

        if (
            events &&
            typeof events ===
                "object"
        ) {
            const upcoming =
                Object.values(events)
                    .filter(
                        event =>
                            event?.status ===
                            "scheduled"
                    );

            return upcoming.length || null;
        }
    }

    if (
        section.id === "family"
    ) {
        const children =
            database?.life?.children;

        if (
            Array.isArray(children)
        ) {
            return children.length || null;
        }
    }

    if (
        section.id === "media"
    ) {
        const news =
            database?.media?.news;

        if (Array.isArray(news)) {
            const unread =
                news.filter(
                    item =>
                        !item.read
                );

            return unread.length || null;
        }
    }

    return null;
}

// ============================================================
// RENDER
// ============================================================

function render(
    database = null
) {
    if (
        typeof document ===
        "undefined"
    ) {
        return "";
    }

    const db =
        getDatabase(database);

    const container =
        getElement(
            "mma-life-main-menu"
        );

    if (!container) {
        return "";
    }

    const sections =
        mainMenuState.sections
            .filter(
                section =>
                    section.visible !== false
            );

    container.innerHTML = `
        <div class="
            mma-life-main-menu
            ${
                mainMenuState.collapsed
                    ? "is-collapsed"
                    : ""
            }
            ${
                mainMenuState.open
                    ? "is-open"
                    : ""
            }
        ">

            <div class="
                mma-life-main-menu-header
            ">

                <div class="
                    mma-life-main-menu-title
                ">
                    <span>MMA LIFE</span>
                    <strong>DYNASTY</strong>
                </div>

                <button
                    type="button"
                    class="
                        mma-life-main-menu-toggle
                    "
                    data-menu-action="collapse"
                    aria-label="Recolher menu"
                >
                    ${
                        mainMenuState.collapsed
                            ? "›"
                            : "‹"
                    }
                </button>

            </div>

            <div class="
                mma-life-main-menu-sections
            ">

                ${sections.map(
                    section => {

                        const badge =
                            getBadgeForSection(
                                section,
                                db
                            );

                        return `
                            <button
                                type="button"
                                class="
                                    mma-life-main-menu-item
                                    ${
                                        mainMenuState
                                            .activeSection ===
                                        section.id
                                            ? "active"
                                            : ""
                                    }
                                    ${
                                        section.disabled
                                            ? "disabled"
                                            : ""
                                    }
                                "
                                data-menu-section="${escapeHTML(
                                    section.id
                                )}"
                                ${
                                    section.disabled
                                        ? "disabled"
                                        : ""
                                }
                            >

                                <span class="
                                    mma-life-main-menu-icon
                                ">
                                    ${escapeHTML(
                                        section.icon
                                    )}
                                </span>

                                <span class="
                                    mma-life-main-menu-label
                                ">
                                    ${escapeHTML(
                                        section.label
                                    )}
                                </span>

                                ${
                                    badge
                                        ? `
                                            <span class="
                                                mma-life-main-menu-badge
                                            ">
                                                ${escapeHTML(
                                                    badge
                                                )}
                                            </span>
                                        `
                                        : ""
                                }

                            </button>
                        `;
                    }
                ).join("")}

            </div>

            <div class="
                mma-life-main-menu-footer
            ">

                <button
                    type="button"
                    class="
                        mma-life-main-menu-item
                    "
                    data-menu-action="settings"
                >
                    <span class="
                        mma-life-main-menu-icon
                    ">
                        ⚙
                    </span>

                    <span class="
                        mma-life-main-menu-label
                    ">
                        Configurações
                    </span>
                </button>

            </div>

        </div>
    `;

    bindEvents();

    mainMenuState.lastRender =
        Date.now();

    return container.innerHTML;
}

// ============================================================
// CONTAINER
// ============================================================

function createContainer() {
    if (
        typeof document ===
        "undefined"
    ) {
        return null;
    }

    let container =
        getElement(
            "mma-life-main-menu"
        );

    if (!container) {
        container =
            document.createElement(
                "aside"
            );

        container.id =
            "mma-life-main-menu";

        document.body.prepend(
            container
        );
    }

    return container;
}

// ============================================================
// EVENTOS
// ============================================================

function bindEvents() {
    if (
        typeof document ===
        "undefined"
    ) {
        return;
    }

    const container =
        getElement(
            "mma-life-main-menu"
        );

    if (!container) {
        return;
    }

    container
        .querySelectorAll(
            "[data-menu-section]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset
                            .menuSection;

                    setActiveSection(
                        id
                    );
                }
            );

        });

    container
        .querySelectorAll(
            "[data-menu-action]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset
                            .menuAction;

                    if (
                        action ===
                        "collapse"
                    ) {
                        toggleCollapse();
                    }

                    if (
                        action ===
                        "settings"
                    ) {
                        navigateToSection(
                            "settings"
                        );
                    }

                }
            );

        });
}

// ============================================================
// ABRIR / FECHAR
// ============================================================

function open() {
    mainMenuState.open =
        true;

    const container =
        getElement(
            "mma-life-main-menu"
        );

    if (container) {
        container.classList.add(
            "is-open"
        );
    }

    return true;
}

function close() {
    mainMenuState.open =
        false;

    const container =
        getElement(
            "mma-life-main-menu"
        );

    if (container) {
        container.classList.remove(
            "is-open"
        );
    }

    return true;
}

function toggle() {
    if (mainMenuState.open) {
        return close();
    }

    return open();
}

// ============================================================
// COLLAPSE
// ============================================================

function collapse() {
    mainMenuState.collapsed =
        true;

    const container =
        getElement(
            "mma-life-main-menu"
        );

    if (container) {
        container.classList.add(
            "is-collapsed"
        );
    }

    return true;
}

function expand() {
    mainMenuState.collapsed =
        false;

    const container =
        getElement(
            "mma-life-main-menu"
        );

    if (container) {
        container.classList.remove(
            "is-collapsed"
        );
    }

    return true;
}

function toggleCollapse() {
    if (
        mainMenuState.collapsed
    ) {
        return expand();
    }

    return collapse();
}

// ============================================================
// ESTILOS
// ============================================================

function injectStyles() {
    if (
        typeof document ===
        "undefined"
    ) {
        return;
    }

    if (
        getElement(
            "mma-life-main-menu-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "mma-life-main-menu-styles";

    style.textContent = `
        #mma-life-main-menu {
            position: relative;
            z-index: 900;
        }

        .mma-life-main-menu {
            width: 230px;
            min-height: 100%;
            display: flex;
            flex-direction: column;
            background: #0c0c10;
            border-right: 1px solid
                rgba(255,255,255,.07);
            transition:
                width .2s ease,
                transform .2s ease;
        }

        .mma-life-main-menu-header {
            min-height: 68px;
            padding: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            border-bottom: 1px solid
                rgba(255,255,255,.07);
        }

        .mma-life-main-menu-title {
            min-width: 0;
        }

        .mma-life-main-menu-title span {
            display: block;
            color: #85858e;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: .15em;
        }

        .mma-life-main-menu-title strong {
            display: block;
            margin-top: 2px;
            color: #ffffff;
            font-size: 15px;
            letter-spacing: .08em;
        }

        .mma-life-main-menu-toggle {
            width: 30px;
            height: 30px;
            flex-shrink: 0;
            border: 1px solid
                rgba(255,255,255,.08);
            border-radius: 7px;
            background: rgba(255,255,255,.035);
            color: #a0a0a8;
            cursor: pointer;
        }

        .mma-life-main-menu-toggle:hover {
            background: rgba(255,255,255,.08);
            color: #ffffff;
        }

        .mma-life-main-menu-sections {
            flex: 1;
            padding: 10px;
        }

        .mma-life-main-menu-item {
            width: 100%;
            min-height: 44px;
            margin-bottom: 4px;
            padding: 9px 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            border: 0;
            border-radius: 9px;
            background: transparent;
            color: #8e8e97;
            cursor: pointer;
            text-align: left;
            transition:
                background .15s ease,
                color .15s ease;
        }

        .mma-life-main-menu-item:hover {
            background:
                rgba(255,255,255,.055);
            color: #ffffff;
        }

        .mma-life-main-menu-item.active {
            background:
                rgba(255,255,255,.095);
            color: #ffffff;
        }

        .mma-life-main-menu-item.disabled {
            opacity: .35;
            cursor: not-allowed;
        }

        .mma-life-main-menu-icon {
            width: 25px;
            min-width: 25px;
            text-align: center;
            font-size: 15px;
        }

        .mma-life-main-menu-label {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 12px;
            font-weight: 600;
        }

        .mma-life-main-menu-badge {
            min-width: 18px;
            height: 18px;
            padding: 0 5px;
            display: grid;
            place-items: center;
            border-radius: 99px;
            background: #ffffff;
            color: #0b0b0f;
            font-size: 9px;
            font-weight: 900;
        }

        .mma-life-main-menu-footer {
            padding: 10px;
            border-top: 1px solid
                rgba(255,255,255,.07);
        }

        .mma-life-main-menu.is-collapsed {
            width: 66px;
        }

        .mma-life-main-menu.is-collapsed
        .mma-life-main-menu-label,
        .mma-life-main-menu.is-collapsed
        .mma-life-main-menu-title,
        .mma-life-main-menu.is-collapsed
        .mma-life-main-menu-badge {
            display: none;
        }

        .mma-life-main-menu.is-collapsed
        .mma-life-main-menu-header {
            justify-content: center;
        }

        .mma-life-main-menu.is-collapsed
        .mma-life-main-menu-item {
            justify-content: center;
            padding-left: 6px;
            padding-right: 6px;
        }

        .mma-life-main-menu.is-collapsed
        .mma-life-main-menu-icon {
            width: 30px;
        }

        @media (max-width: 800px) {

            #mma-life-main-menu {
                position: fixed;
                inset: 0 auto 0 0;
                z-index: 5000;
            }

            .mma-life-main-menu {
                width: 250px;
                min-height: 100vh;
                transform: translateX(-100%);
                box-shadow:
                    15px 0 50px
                    rgba(0,0,0,.35);
            }

            .mma-life-main-menu.is-open {
                transform:
                    translateX(0);
            }

            .mma-life-main-menu.is-collapsed {
                width: 250px;
            }

            .mma-life-main-menu.is-collapsed
            .mma-life-main-menu-label {
                display: block;
            }

            .mma-life-main-menu.is-collapsed
            .mma-life-main-menu-title {
                display: block;
            }

            .mma-life-main-menu.is-collapsed
            .mma-life-main-menu-item {
                justify-content: flex-start;
                padding-left: 10px;
                padding-right: 10px;
            }
        }
    `;

    document.head.appendChild(
        style
    );
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

function initializeMainMenu(
    database = null,
    options = {}
) {
    if (database) {
        setDatabase(database);
    }

    if (
        !mainMenuState.sections.length
    ) {
        setSections(
            DEFAULT_SECTIONS
        );
    }

    injectStyles();
    createContainer();

    mainMenuState.initialized =
        true;

    if (
        options.activeSection
    ) {
        const exists =
            mainMenuState.sections
                .some(
                    section =>
                        section.id ===
                        options.activeSection
                );

        if (exists) {
            mainMenuState.activeSection =
                options.activeSection;
        }
    }

    if (
        options.open === true
    ) {
        mainMenuState.open =
            true;
    }

    if (
        options.collapsed === true
    ) {
        mainMenuState.collapsed =
            true;
    }

    if (
        options.render !== false
    ) {
        render(database);
    }

    return getState();
}

// ============================================================
// REFRESH
// ============================================================

function refresh(
    database = null
) {
    if (database) {
        setDatabase(database);
    }

    if (
        !mainMenuState.initialized
    ) {
        initializeMainMenu(
            database,
            {
                render: false
            }
        );
    }

    return render(
        getDatabase(database)
    );
}

// ============================================================
// ESTADO
// ============================================================

function getState() {
    return {
        version:
            MAIN_MENU_VERSION,

        initialized:
            mainMenuState.initialized,

        open:
            mainMenuState.open,

        collapsed:
            mainMenuState.collapsed,

        activeSection:
            mainMenuState.activeSection,

        sections:
            mainMenuState.sections.map(
                section => section.id
            ),

        lastRender:
            mainMenuState.lastRender
    };
}

function snapshot() {
    return {
        version:
            MAIN_MENU_VERSION,

        state:
            clone(mainMenuState)
    };
}

function validate() {
    const errors = [];

    if (
        !mainMenuState.initialized
    ) {
        errors.push(
            "Menu principal não inicializado."
        );
    }

    if (
        !mainMenuState.sections.length
    ) {
        errors.push(
            "Nenhuma seção registrada."
        );
    }

    if (
        mainMenuState.activeSection &&
        !mainMenuState.sections.some(
            section =>
                section.id ===
                mainMenuState.activeSection
        )
    ) {
        errors.push(
            "A seção ativa não existe."
        );
    }

    return {
        valid:
            errors.length === 0,
        errors
    };
}

// ============================================================
// API
// ============================================================

export const mainMenuAPI = {

    version:
        MAIN_MENU_VERSION,

    initialize:
        initializeMainMenu,

    init:
        initializeMainMenu,

    render,
    refresh,

    open,
    close,
    toggle,

    collapse,
    expand,
    toggleCollapse,

    setActiveSection,
    getActiveSection,

    navigateToSection,

    setSections,
    addSection,
    removeSection,
    getSection,
    getSections,

    getDatabase,
    setDatabase,

    getState,
    snapshot,
    validate
};

// ============================================================
// GLOBAL
// ============================================================

if (
    typeof window !== "undefined"
) {
    window.mainMenuAPI =
        mainMenuAPI;

    window.MMA_LIFE_MAIN_MENU =
        mainMenuAPI;
}

// ============================================================
// READY
// ============================================================

if (
    typeof window !== "undefined"
) {
    window.dispatchEvent(
        new CustomEvent(
            "mma-life-main-menu-ready",
            {
                detail: {
                    api:
                        mainMenuAPI,

                    version:
                        MAIN_MENU_VERSION
                }
            }
        )
    );
}

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default mainMenuAPI;
