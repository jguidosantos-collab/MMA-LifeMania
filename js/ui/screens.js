// ============================================================
// MMA LIFE DYNASTY
// UI — SCREENS
// ============================================================

const SCREENS_VERSION = 1;

const screensState = {
    initialized: false,
    database: null,
    activeScreen: "dashboard",
    screens: {},
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
        screensState.database ||
        (typeof window !== "undefined"
            ? window.MMA_LIFE_DATABASE
            : null) ||
        null
    );
}

function setDatabase(database) {
    screensState.database = database || null;
    return screensState.database;
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
// DEFINIÇÃO DAS TELAS
// ============================================================

const DEFAULT_SCREENS = {

    dashboard: {
        id: "dashboard",
        title: "Dashboard",
        subtitle: "Visão geral da sua vida, carreira e patrimônio.",
        icon: "⌂"
    },

    career: {
        id: "career",
        title: "Carreira",
        subtitle: "Acompanhe sua evolução como lutador.",
        icon: "🥊"
    },

    training: {
        id: "training",
        title: "Treinamento",
        subtitle: "Treine, evolua seus atributos e prepare-se para lutar.",
        icon: "🏋"
    },

    fights: {
        id: "fights",
        title: "Lutas",
        subtitle: "Próximos combates, resultados e histórico.",
        icon: "⚔"
    },

    life: {
        id: "life",
        title: "Vida",
        subtitle: "Gerencie sua vida fora do MMA.",
        icon: "♥"
    },

    family: {
        id: "family",
        title: "Família",
        subtitle: "Relacionamentos, casamento, filhos e família.",
        icon: "👨‍👩‍👧"
    },

    finances: {
        id: "finances",
        title: "Finanças",
        subtitle: "Dinheiro, patrimônio, renda e despesas.",
        icon: "💰"
    },

    media: {
        id: "media",
        title: "Mídia",
        subtitle: "Fama, seguidores, reputação e notícias.",
        icon: "★"
    },

    dynasty: {
        id: "dynasty",
        title: "Dinastia",
        subtitle: "Seu legado através das gerações.",
        icon: "♛"
    },

    settings: {
        id: "settings",
        title: "Configurações",
        subtitle: "Configurações do jogo.",
        icon: "⚙"
    }
};

// ============================================================
// NORMALIZAÇÃO
// ============================================================

function normalizeScreen(screen = {}) {
    return {
        id: String(
            screen.id ||
            screen.name ||
            "screen"
        ),

        title: String(
            screen.title ||
            screen.label ||
            screen.name ||
            "Tela"
        ),

        subtitle: String(
            screen.subtitle ||
            screen.description ||
            ""
        ),

        icon: String(
            screen.icon ||
            "•"
        ),

        visible:
            screen.visible !== false,

        disabled:
            Boolean(screen.disabled),

        render:
            typeof screen.render === "function"
                ? screen.render
                : null,

        onOpen:
            typeof screen.onOpen === "function"
                ? screen.onOpen
                : null,

        onClose:
            typeof screen.onClose === "function"
                ? screen.onClose
                : null
    };
}

// ============================================================
// REGISTRO
// ============================================================

function registerScreen(
    screen,
    options = {}
) {
    const normalized =
        normalizeScreen(screen);

    screensState.screens[
        normalized.id
    ] = normalized;

    if (
        options.render === true &&
        typeof normalized.render === "function"
    ) {
        try {
            normalized.render(
                getDatabase(),
                normalized
            );
        } catch (error) {
            console.error(
                "[SCREENS] Erro ao renderizar tela:",
                error
            );
        }
    }

    return clone({
        ...normalized,
        render: undefined,
        onOpen: undefined,
        onClose: undefined
    });
}

function registerScreens(
    screens = {}
) {
    if (!screens) {
        return false;
    }

    if (Array.isArray(screens)) {
        screens.forEach(
            screen =>
                registerScreen(screen)
        );
    } else {
        Object.entries(
            screens
        ).forEach(
            ([id, screen]) => {

                registerScreen({
                    ...(screen || {}),
                    id:
                        screen?.id ||
                        id
                });

            }
        );
    }

    return true;
}

function unregisterScreen(id) {
    if (
        !screensState.screens[id]
    ) {
        return false;
    }

    delete screensState.screens[id];

    return true;
}

function getScreen(id) {
    const screen =
        screensState.screens[id];

    if (!screen) {
        return null;
    }

    return {
        id: screen.id,
        title: screen.title,
        subtitle: screen.subtitle,
        icon: screen.icon,
        visible: screen.visible,
        disabled: screen.disabled
    };
}

function getScreens() {
    return Object.values(
        screensState.screens
    ).map(
        screen => ({
            id: screen.id,
            title: screen.title,
            subtitle: screen.subtitle,
            icon: screen.icon,
            visible: screen.visible,
            disabled: screen.disabled
        })
    );
}

// ============================================================
// TELA ATIVA
// ============================================================

function getActiveScreen() {
    return screensState.activeScreen;
}

function setActiveScreen(
    id,
    options = {}
) {
    const screen =
        screensState.screens[id];

    if (!screen) {
        return false;
    }

    if (
        screen.disabled ||
        screen.visible === false
    ) {
        return false;
    }

    const previous =
        screensState.activeScreen;

    if (
        previous !== id
    ) {
        const previousScreen =
            screensState.screens[
                previous
            ];

        if (
            previousScreen &&
            typeof previousScreen.onClose ===
                "function"
        ) {
            try {
                previousScreen.onClose(
                    getDatabase(),
                    previousScreen
                );
            } catch (error) {
                console.error(
                    "[SCREENS] Erro ao fechar tela:",
                    error
                );
            }
        }
    }

    screensState.activeScreen =
        id;

    if (
        typeof screen.onOpen ===
        "function"
    ) {
        try {
            screen.onOpen(
                getDatabase(),
                screen
            );
        } catch (error) {
            console.error(
                "[SCREENS] Erro ao abrir tela:",
                error
            );
        }
    }

    if (
        options.render !== false
    ) {
        render(
            getDatabase()
        );
    }

    return true;
}

// ============================================================
// NAVEGAÇÃO
// ============================================================

function navigate(
    id,
    options = {}
) {
    if (
        !screensState.screens[id]
    ) {
        return false;
    }

    const changed =
        setActiveScreen(
            id,
            {
                render: false
            }
        );

    if (!changed) {
        return false;
    }

    if (
        typeof window !== "undefined"
    ) {
        const router =
            window.lifeRouterAPI ||
            window.MMA_LIFE_LIFE_ROUTER ||
            null;

        const navigation =
            window.lifeNavigationAPI ||
            window.MMA_LIFE_LIFE_NAVIGATION ||
            null;

        if (
            options.updateHash !== false
        ) {
            try {

                if (
                    router &&
                    typeof router.navigate ===
                        "function"
                ) {
                    router.navigate(
                        id,
                        {
                            ...options,
                            updateHash: true,
                            render: false
                        }
                    );
                } else if (
                    navigation &&
                    typeof navigation.navigate ===
                        "function"
                ) {
                    navigation.navigate(
                        id,
                        {
                            ...options,
                            updateHash: true,
                            render: false
                        }
                    );
                } else {
                    window.location.hash =
                        `#${id}`;
                }

            } catch (error) {
                console.error(
                    "[SCREENS] Erro de navegação:",
                    error
                );
            }
        }
    }

    render(
        getDatabase()
    );

    return true;
}

// ============================================================
// COMPONENTES
// ============================================================

function renderHeader(
    screen
) {
    return `
        <div class="
            mma-life-screen-header
        ">

            <div class="
                mma-life-screen-heading
            ">

                <div class="
                    mma-life-screen-icon
                ">
                    ${escapeHTML(
                        screen.icon
                    )}
                </div>

                <div>

                    <h1 class="
                        mma-life-screen-title
                    ">
                        ${escapeHTML(
                            screen.title
                        )}
                    </h1>

                    ${
                        screen.subtitle
                            ? `
                                <p class="
                                    mma-life-screen-subtitle
                                ">
                                    ${escapeHTML(
                                        screen.subtitle
                                    )}
                                </p>
                            `
                            : ""
                    }

                </div>

            </div>

        </div>
    `;
}

// ============================================================
// FALLBACKS
// ============================================================

function renderFallback(
    screen,
    database
) {
    const player =
        database?.player ||
        {};

    const identity =
        player.identity ||
        {};

    const name =
        identity.name ||
        player.name ||
        "Novo lutador";

    return `
        <div class="
            mma-life-screen-fallback
        ">

            <div class="
                mma-life-screen-fallback-icon
            ">
                ${escapeHTML(
                    screen.icon
                )}
            </div>

            <h2>
                ${escapeHTML(
                    screen.title
                )}
            </h2>

            <p>
                Esta área está pronta para receber
                o sistema de ${escapeHTML(
                    screen.title
                )}.
            </p>

            <div class="
                mma-life-screen-fallback-player
            ">
                <strong>
                    ${escapeHTML(name)}
                </strong>
            </div>

        </div>
    `;
}

// ============================================================
// RENDER DA TELA
// ============================================================

function renderScreen(
    id,
    database = null
) {
    const db =
        getDatabase(database);

    const screen =
        screensState.screens[id];

    if (!screen) {
        return `
            <div class="
                mma-life-screen-error
            ">
                Tela não encontrada.
            </div>
        `;
    }

    let content = "";

    if (
        typeof screen.render ===
        "function"
    ) {
        try {

            const result =
                screen.render(
                    db,
                    screen
                );

            if (
                typeof result ===
                "string"
            ) {
                content = result;
            } else if (
                result instanceof HTMLElement
            ) {
                content = "";
            } else if (
                result !== undefined &&
                result !== null
            ) {
                content =
                    String(result);
            }

        } catch (error) {

            console.error(
                `[SCREENS] Erro na tela ${id}:`,
                error
            );

            content = `
                <div class="
                    mma-life-screen-error
                ">
                    <strong>
                        Não foi possível carregar esta tela.
                    </strong>

                    <span>
                        ${escapeHTML(
                            error.message
                        )}
                    </span>
                </div>
            `;
        }
    }

    if (!content) {
        content =
            renderFallback(
                screen,
                db
            );
    }

    return `
        <div
            class="mma-life-screen"
            data-screen-id="${escapeHTML(id)}"
        >

            ${renderHeader(screen)}

            <div class="
                mma-life-screen-body
            ">
                ${content}
            </div>

        </div>
    `;
}

// ============================================================
// CONTAINER
// ============================================================

function getContainer() {
    return (
        getElement(
            "mma-life-content"
        ) ||
        getElement(
            "mma-life-screen-container"
        )
    );
}

function createContainer() {
    if (
        typeof document ===
        "undefined"
    ) {
        return null;
    }

    let container =
        getContainer();

    if (container) {
        return container;
    }

    container =
        document.createElement(
            "main"
        );

    container.id =
        "mma-life-content";

    document.body.appendChild(
        container
    );

    return container;
}

// ============================================================
// RENDER PRINCIPAL
// ============================================================

function render(
    database = null
) {
    if (database) {
        setDatabase(database);
    }

    const container =
        createContainer();

    if (!container) {
        return "";
    }

    const screen =
        screensState.screens[
            screensState.activeScreen
        ];

    if (!screen) {
        screensState.activeScreen =
            "dashboard";
    }

    const html =
        renderScreen(
            screensState.activeScreen,
            getDatabase()
        );

    container.innerHTML =
        html;

    screensState.lastRender =
        Date.now();

    return html;
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
            "mma-life-screens-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "mma-life-screens-styles";

    style.textContent = `
        .mma-life-screen {
            width: 100%;
            max-width: 1500px;
            margin: 0 auto;
            box-sizing: border-box;
        }

        .mma-life-screen-header {
            margin-bottom: 22px;
        }

        .mma-life-screen-heading {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .mma-life-screen-icon {
            width: 42px;
            height: 42px;
            display: grid;
            place-items: center;
            flex-shrink: 0;
            border-radius: 11px;
            background:
                rgba(255,255,255,.06);
            border:
                1px solid
                rgba(255,255,255,.08);
            font-size: 19px;
        }

        .mma-life-screen-title {
            margin: 0;
            color: #ffffff;
            font-size: 25px;
            font-weight: 850;
            letter-spacing: -.025em;
        }

        .mma-life-screen-subtitle {
            margin: 4px 0 0;
            color: #777780;
            font-size: 12px;
            line-height: 1.5;
        }

        .mma-life-screen-body {
            width: 100%;
        }

        .mma-life-screen-fallback {
            min-height: 320px;
            padding: 45px 25px;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            border:
                1px solid
                rgba(255,255,255,.07);
            border-radius: 14px;
            background:
                rgba(255,255,255,.025);
        }

        .mma-life-screen-fallback-icon {
            width: 64px;
            height: 64px;
            display: grid;
            place-items: center;
            margin-bottom: 15px;
            border-radius: 18px;
            background:
                rgba(255,255,255,.06);
            font-size: 28px;
        }

        .mma-life-screen-fallback h2 {
            margin: 0;
            color: #ffffff;
            font-size: 20px;
        }

        .mma-life-screen-fallback p {
            max-width: 480px;
            margin: 8px auto 20px;
            color: #74747d;
            font-size: 12px;
            line-height: 1.6;
        }

        .mma-life-screen-fallback-player {
            padding: 9px 15px;
            border-radius: 8px;
            background:
                rgba(255,255,255,.05);
            color: #bdbdc5;
            font-size: 11px;
        }

        .mma-life-screen-error {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 7px;
            border:
                1px solid
                rgba(255,80,80,.2);
            border-radius: 12px;
            background:
                rgba(255,80,80,.04);
            color: #ffb0b0;
            font-size: 12px;
        }

        .mma-life-screen-error strong {
            color: #ffffff;
        }

        @media (max-width: 800px) {

            .mma-life-screen-title {
                font-size: 21px;
            }

            .mma-life-screen-header {
                margin-bottom: 17px;
            }

            .mma-life-screen-icon {
                width: 38px;
                height: 38px;
                font-size: 17px;
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

function initializeScreens(
    database = null,
    options = {}
) {
    if (database) {
        setDatabase(database);
    }

    injectStyles();
    createContainer();

    if (
        !Object.keys(
            screensState.screens
        ).length
    ) {
        registerScreens(
            DEFAULT_SCREENS
        );
    }

    screensState.initialized =
        true;

    if (
        options.activeScreen &&
        screensState.screens[
            options.activeScreen
        ]
    ) {
        screensState.activeScreen =
            options.activeScreen;
    }

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
        !screensState.initialized
    ) {
        initializeScreens(
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
            SCREENS_VERSION,

        initialized:
            screensState.initialized,

        activeScreen:
            screensState.activeScreen,

        screenCount:
            Object.keys(
                screensState.screens
            ).length,

        lastRender:
            screensState.lastRender
    };
}

function snapshot() {
    return {
        version:
            SCREENS_VERSION,

        state:
            clone(
                getState()
            ),

        screens:
            getScreens()
    };
}

function validate() {
    const errors = [];

    if (
        !screensState.initialized
    ) {
        errors.push(
            "Sistema de telas não inicializado."
        );
    }

    if (
        !screensState.screens[
            screensState.activeScreen
        ]
    ) {
        errors.push(
            "Tela ativa não existe."
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

export const screensAPI = {

    version:
        SCREENS_VERSION,

    initialize:
        initializeScreens,

    init:
        initializeScreens,

    render,
    refresh,

    navigate,
    setActiveScreen,
    getActiveScreen,

    registerScreen,
    registerScreens,
    unregisterScreen,

    getScreen,
    getScreens,

    renderScreen,
    renderHeader,

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
    window.screensAPI =
        screensAPI;

    window.MMA_LIFE_SCREENS =
        screensAPI;
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
            "mma-life-screens-ready",
            {
                detail: {
                    api:
                        screensAPI,

                    version:
                        SCREENS_VERSION
                }
            }
        )
    );
}

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default screensAPI;
