// ============================================================
// MMA LIFE DYNASTY
// UI — MAIN LAYOUT
// ============================================================

const LAYOUT_VERSION = 1;

const layoutState = {
    initialized: false,
    database: null,
    mobile: false,
    menuVisible: true,
    hudVisible: true,
    contentReady: false,
    lastRender: 0
};

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
        layoutState.database ||
        (typeof window !== "undefined"
            ? window.MMA_LIFE_DATABASE
            : null) ||
        null
    );
}

function setDatabase(database) {
    layoutState.database = database || null;
    return layoutState.database;
}

function getElement(id) {
    if (typeof document === "undefined") {
        return null;
    }

    return document.getElementById(id);
}

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// ============================================================
// DETECÇÃO DE DISPOSITIVO
// ============================================================

function detectMobile() {
    if (typeof window === "undefined") {
        return false;
    }

    return (
        window.innerWidth <= 800 ||
        Boolean(
            window.matchMedia &&
            window.matchMedia(
                "(pointer: coarse)"
            ).matches
        )
    );
}

function updateResponsiveState() {
    layoutState.mobile =
        detectMobile();

    return layoutState.mobile;
}

// ============================================================
// ESTRUTURA BASE
// ============================================================

function createRoot() {
    if (typeof document === "undefined") {
        return null;
    }

    let root =
        getElement("mma-life-layout");

    if (!root) {
        root =
            document.createElement("div");

        root.id =
            "mma-life-layout";

        document.body.appendChild(root);
    }

    return root;
}

function createShell() {
    const root =
        createRoot();

    if (!root) {
        return null;
    }

    root.innerHTML = `
        <div
            class="mma-life-layout-shell"
            data-layout-shell
        >

            <div
                class="mma-life-layout-overlay"
                data-layout-overlay
            ></div>

            <aside
                class="mma-life-layout-sidebar"
                data-layout-sidebar
            >
                <div
                    id="mma-life-main-menu"
                ></div>
            </aside>

            <main
                class="mma-life-layout-main"
                data-layout-main
            >

                <header
                    class="mma-life-layout-hud"
                    data-layout-hud
                >
                    <div
                        id="mma-life-hud"
                    ></div>
                </header>

                <section
                    class="mma-life-layout-content"
                    data-layout-content
                >
                    <div
                        id="mma-life-content"
                        class="mma-life-layout-content-inner"
                    ></div>
                </section>

            </main>

        </div>
    `;

    layoutState.contentReady =
        true;

    return root;
}

// ============================================================
// CONTEÚDO
// ============================================================

function getContentContainer() {
    return getElement(
        "mma-life-content"
    );
}

function setContent(
    content = ""
) {
    const container =
        getContentContainer();

    if (!container) {
        return false;
    }

    if (
        typeof content ===
        "string"
    ) {
        container.innerHTML =
            content;
    } else if (
        content instanceof
        HTMLElement
    ) {
        container.innerHTML = "";
        container.appendChild(
            content
        );
    }

    return true;
}

function clearContent() {
    return setContent("");
}

function getContent() {
    const container =
        getContentContainer();

    return container
        ? container.innerHTML
        : "";
}

// ============================================================
// TÍTULO / CABEÇALHO DE TELA
// ============================================================

function renderScreenHeader(
    title = "",
    subtitle = ""
) {
    return `
        <div class="
            mma-life-layout-screen-header
        ">

            <div>
                <div class="
                    mma-life-layout-screen-title
                ">
                    ${escapeHTML(title)}
                </div>

                ${
                    subtitle
                        ? `
                            <div class="
                                mma-life-layout-screen-subtitle
                            ">
                                ${escapeHTML(
                                    subtitle
                                )}
                            </div>
                        `
                        : ""
                }
            </div>

        </div>
    `;
}

// ============================================================
// MENU
// ============================================================

function getMainMenuAPI() {
    if (
        typeof window ===
        "undefined"
    ) {
        return null;
    }

    return (
        window.mainMenuAPI ||
        window.MMA_LIFE_MAIN_MENU ||
        null
    );
}

function showMenu() {
    layoutState.menuVisible =
        true;

    const sidebar =
        document.querySelector(
            "[data-layout-sidebar]"
        );

    const overlay =
        document.querySelector(
            "[data-layout-overlay]"
        );

    if (sidebar) {
        sidebar.classList.add(
            "is-visible"
        );
    }

    if (
        layoutState.mobile &&
        overlay
    ) {
        overlay.classList.add(
            "is-visible"
        );
    }

    const menu =
        getMainMenuAPI();

    if (
        menu &&
        typeof menu.open ===
            "function"
    ) {
        menu.open();
    }

    return true;
}

function hideMenu() {
    layoutState.menuVisible =
        false;

    const sidebar =
        document.querySelector(
            "[data-layout-sidebar]"
        );

    const overlay =
        document.querySelector(
            "[data-layout-overlay]"
        );

    if (sidebar) {
        sidebar.classList.remove(
            "is-visible"
        );
    }

    if (overlay) {
        overlay.classList.remove(
            "is-visible"
        );
    }

    const menu =
        getMainMenuAPI();

    if (
        menu &&
        typeof menu.close ===
            "function"
    ) {
        menu.close();
    }

    return true;
}

function toggleMenu() {
    if (
        layoutState.menuVisible
    ) {
        return hideMenu();
    }

    return showMenu();
}

// ============================================================
// HUD
// ============================================================

function getHUDAPI() {
    if (
        typeof window ===
        "undefined"
    ) {
        return null;
    }

    return (
        window.hudAPI ||
        window.MMA_LIFE_HUD ||
        null
    );
}

function showHUD() {
    layoutState.hudVisible =
        true;

    const hud =
        document.querySelector(
            "[data-layout-hud]"
        );

    if (hud) {
        hud.classList.remove(
            "is-hidden"
        );
    }

    const api =
        getHUDAPI();

    if (
        api &&
        typeof api.show ===
            "function"
    ) {
        api.show();
    }

    return true;
}

function hideHUD() {
    layoutState.hudVisible =
        false;

    const hud =
        document.querySelector(
            "[data-layout-hud]"
        );

    if (hud) {
        hud.classList.add(
            "is-hidden"
        );
    }

    const api =
        getHUDAPI();

    if (
        api &&
        typeof api.hide ===
            "function"
    ) {
        api.hide();
    }

    return true;
}

function toggleHUD() {
    if (
        layoutState.hudVisible
    ) {
        return hideHUD();
    }

    return showHUD();
}

// ============================================================
// OVERLAY
// ============================================================

function closeOverlay() {
    if (
        layoutState.mobile
    ) {
        hideMenu();
    }
}

// ============================================================
// NAVEGAÇÃO
// ============================================================

function navigate(
    section,
    options = {}
) {
    if (!section) {
        return false;
    }

    const router =
        typeof window !==
            "undefined"
            ? (
                window.lifeRouterAPI ||
                window.MMA_LIFE_LIFE_ROUTER ||
                null
            )
            : null;

    if (
        router &&
        typeof router.navigate ===
            "function"
    ) {
        router.navigate(
            section,
            options
        );
    } else {
        const navigation =
            typeof window !==
                "undefined"
                ? (
                    window.lifeNavigationAPI ||
                    window.MMA_LIFE_LIFE_NAVIGATION ||
                    null
                )
                : null;

        if (
            navigation &&
            typeof navigation.navigate ===
                "function"
        ) {
            navigation.navigate(
                section,
                options
            );
        } else if (
            typeof window !==
            "undefined"
        ) {
            window.location.hash =
                `#${section}`;
        }
    }

    if (
        layoutState.mobile
    ) {
        hideMenu();
    }

    return true;
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
            "mma-life-layout-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "mma-life-layout-styles";

    style.textContent = `
        :root {
            --mma-layout-sidebar-width: 230px;
            --mma-layout-hud-height: 76px;
            --mma-layout-background: #08080b;
            --mma-layout-surface: #0d0d12;
            --mma-layout-border:
                rgba(255,255,255,.07);
        }

        html,
        body {
            margin: 0;
            padding: 0;
            min-height: 100%;
            background:
                var(--mma-layout-background);
        }

        body {
            min-height: 100vh;
            overflow-x: hidden;
        }

        #mma-life-layout {
            min-height: 100vh;
            width: 100%;
        }

        .mma-life-layout-shell {
            min-height: 100vh;
            display: flex;
            background:
                var(--mma-layout-background);
            color: #ffffff;
        }

        .mma-life-layout-sidebar {
            width:
                var(--mma-layout-sidebar-width);
            min-width:
                var(--mma-layout-sidebar-width);
            min-height: 100vh;
            position: relative;
            z-index: 1000;
            background:
                var(--mma-layout-surface);
            border-right:
                1px solid
                var(--mma-layout-border);
        }

        .mma-life-layout-main {
            min-width: 0;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .mma-life-layout-hud {
            min-height:
                var(--mma-layout-hud-height);
            position: relative;
            z-index: 800;
            background:
                var(--mma-layout-background);
            border-bottom:
                1px solid
                var(--mma-layout-border);
        }

        .mma-life-layout-hud.is-hidden {
            display: none;
        }

        .mma-life-layout-content {
            flex: 1;
            min-width: 0;
            min-height: 0;
            overflow-x: hidden;
            overflow-y: auto;
        }

        .mma-life-layout-content-inner {
            width: 100%;
            min-height: calc(
                100vh -
                var(--mma-layout-hud-height)
            );
            box-sizing: border-box;
            padding: 22px;
        }

        .mma-life-layout-screen-header {
            width: 100%;
            margin-bottom: 22px;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
        }

        .mma-life-layout-screen-title {
            color: #ffffff;
            font-size: 23px;
            font-weight: 800;
            letter-spacing: -.02em;
        }

        .mma-life-layout-screen-subtitle {
            margin-top: 5px;
            color: #777780;
            font-size: 12px;
            line-height: 1.5;
        }

        .mma-life-layout-overlay {
            display: none;
        }

        @media (max-width: 800px) {

            .mma-life-layout-sidebar {
                position: fixed;
                inset: 0 auto 0 0;
                z-index: 5000;
                width: 250px;
                min-width: 250px;
                transform:
                    translateX(-100%);
                transition:
                    transform .2s ease;
            }

            .mma-life-layout-sidebar.is-visible {
                transform:
                    translateX(0);
            }

            .mma-life-layout-overlay {
                position: fixed;
                inset: 0;
                z-index: 4900;
                background:
                    rgba(0,0,0,.55);
                backdrop-filter:
                    blur(2px);
            }

            .mma-life-layout-overlay.is-visible {
                display: block;
            }

            .mma-life-layout-content-inner {
                min-height: 100vh;
                padding: 16px;
            }

            .mma-life-layout-screen-title {
                font-size: 20px;
            }
        }
    `;

    document.head.appendChild(
        style
    );
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

    const overlay =
        document.querySelector(
            "[data-layout-overlay]"
        );

    if (overlay) {
        overlay.addEventListener(
            "click",
            closeOverlay
        );
    }

    if (
        typeof window !==
        "undefined"
    ) {
        window.addEventListener(
            "resize",
            () => {
                const wasMobile =
                    layoutState.mobile;

                updateResponsiveState();

                if (
                    wasMobile !==
                    layoutState.mobile
                ) {
                    if (
                        layoutState.mobile
                    ) {
                        hideMenu();
                    } else {
                        showMenu();
                    }
                }
            }
        );
    }
}

// ============================================================
// RENDER
// ============================================================

function render(
    database = null
) {
    if (database) {
        setDatabase(database);
    }

    updateResponsiveState();

    const root =
        getElement(
            "mma-life-layout"
        ) ||
        createRoot();

    if (!root) {
        return "";
    }

    if (
        !layoutState.contentReady
    ) {
        createShell();
    }

    const sidebar =
        document.querySelector(
            "[data-layout-sidebar]"
        );

    const hud =
        document.querySelector(
            "[data-layout-hud]"
        );

    if (sidebar) {
        sidebar.classList.toggle(
            "is-visible",
            layoutState.menuVisible
        );
    }

    if (hud) {
        hud.classList.toggle(
            "is-hidden",
            !layoutState.hudVisible
        );
    }

    mainMenuRender();
    hudRender();

    layoutState.lastRender =
        Date.now();

    return root.innerHTML;
}

// ============================================================
// RENDER EXTERNO
// ============================================================

function mainMenuRender() {
    const api =
        getMainMenuAPI();

    if (
        api &&
        typeof api.render ===
            "function"
    ) {
        try {
            api.render(
                getDatabase()
            );
        } catch (error) {
            console.error(
                "[LAYOUT] Erro ao renderizar menu:",
                error
            );
        }
    }
}

function hudRender() {
    const api =
        getHUDAPI();

    if (
        api &&
        typeof api.render ===
            "function"
    ) {
        try {
            api.render(
                getDatabase()
            );
        } catch (error) {
            console.error(
                "[LAYOUT] Erro ao renderizar HUD:",
                error
            );
        }
    }
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

function initializeLayout(
    database = null,
    options = {}
) {
    if (database) {
        setDatabase(database);
    }

    updateResponsiveState();

    injectStyles();

    createShell();

    layoutState.initialized =
        true;

    layoutState.menuVisible =
        options.menuVisible !== false;

    layoutState.hudVisible =
        options.hudVisible !== false;

    bindEvents();

    if (
        options.render !== false
    ) {
        render(
            getDatabase()
        );
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
        !layoutState.initialized
    ) {
        initializeLayout(
            database,
            {
                render: false
            }
        );
    }

    return render(
        getDatabase()
    );
}

// ============================================================
// ESTADO
// ============================================================

function getState() {
    return {
        version:
            LAYOUT_VERSION,

        initialized:
            layoutState.initialized,

        mobile:
            layoutState.mobile,

        menuVisible:
            layoutState.menuVisible,

        hudVisible:
            layoutState.hudVisible,

        contentReady:
            layoutState.contentReady,

        lastRender:
            layoutState.lastRender
    };
}

function snapshot() {
    return {
        version:
            LAYOUT_VERSION,

        state:
            clone(layoutState)
    };
}

function validate() {
    const errors = [];

    if (
        !layoutState.initialized
    ) {
        errors.push(
            "Layout não inicializado."
        );
    }

    if (
        typeof document !==
        "undefined"
    ) {
        if (
            !getElement(
                "mma-life-layout"
            )
        ) {
            errors.push(
                "Container principal do layout não encontrado."
            );
        }

        if (
            !getElement(
                "mma-life-content"
            )
        ) {
            errors.push(
                "Área de conteúdo não encontrada."
            );
        }
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

export const layoutAPI = {

    version:
        LAYOUT_VERSION,

    initialize:
        initializeLayout,

    init:
        initializeLayout,

    render,
    refresh,

    showMenu,
    hideMenu,
    toggleMenu,

    showHUD,
    hideHUD,
    toggleHUD,

    navigate,

    setContent,
    clearContent,
    getContent,

    renderScreenHeader,

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
    typeof window !==
    "undefined"
) {
    window.layoutAPI =
        layoutAPI;

    window.MMA_LIFE_LAYOUT =
        layoutAPI;
}

// ============================================================
// READY EVENT
// ============================================================

if (
    typeof window !==
    "undefined"
) {
    window.dispatchEvent(
        new CustomEvent(
            "mma-life-layout-ready",
            {
                detail: {
                    api:
                        layoutAPI,

                    version:
                        LAYOUT_VERSION
                }
            }
        )
    );
}

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default layoutAPI;
