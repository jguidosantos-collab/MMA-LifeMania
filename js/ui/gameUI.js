// ============================================================
// MMA LIFE DYNASTY
// UI — GAME UI
// ============================================================

const GAME_UI_VERSION = 1;

const gameUIState = {
    initialized: false,
    database: null,
    activeScreen: "characterCreation",
    screens: {},
    notifications: [],
    modal: null,
    lastRender: 0
};

// ============================================================
// UTILIDADES
// ============================================================

function clone(value) {
    if (value === undefined || value === null) return value;

    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function getDatabase(database = null) {
    return database || gameUIState.database || window.MMA_LIFE_DATABASE || null;
}

function setDatabase(database) {
    gameUIState.database = database || null;

    if (typeof window !== "undefined") {
        window.MMA_LIFE_DATABASE = database || null;
    }

    return gameUIState.database;
}

function getElement(id) {
    if (typeof document === "undefined") return null;
    return document.getElementById(id);
}

function ensureRoot() {
    if (typeof document === "undefined") return null;

    let root = document.getElementById("mma-life-app");

    if (!root) {
        root = document.createElement("div");
        root.id = "mma-life-app";
        document.body.appendChild(root);
    }

    return root;
}

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatMoney(value, currency = "USD") {
    const amount = Number(value) || 0;

    try {
        return new Intl.NumberFormat(
            currency === "BRL" ? "pt-BR" : "en-US",
            {
                style: "currency",
                currency
            }
        ).format(amount);
    } catch {
        return `${currency} ${amount.toLocaleString()}`;
    }
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString("pt-BR");
}

function capitalize(value) {
    if (!value) return "";

    return String(value)
        .charAt(0)
        .toUpperCase() + String(value).slice(1);
}

// ============================================================
// SCREEN REGISTRY
// ============================================================

function registerScreen(name, config = {}) {
    if (!name) return false;

    gameUIState.screens[name] = {
        name,
        title: config.title || capitalize(name),
        render: typeof config.render === "function"
            ? config.render
            : null,
        onOpen: typeof config.onOpen === "function"
            ? config.onOpen
            : null,
        onClose: typeof config.onClose === "function"
            ? config.onClose
            : null
    };

    return true;
}

function unregisterScreen(name) {
    if (!name) return false;

    delete gameUIState.screens[name];

    return true;
}

function getScreen(name) {
    return gameUIState.screens[name] || null;
}

function getScreens() {
    return clone(gameUIState.screens);
}

// ============================================================
// ACTIVE SCREEN
// ============================================================

function getActiveScreen() {
    return gameUIState.activeScreen;
}

function setActiveScreen(name, options = {}) {
    if (!name) return false;

    const screen = getScreen(name);

    if (!screen) {
        return false;
    }

    const previous = getScreen(gameUIState.activeScreen);

    if (
        previous &&
        previous.name !== name &&
        typeof previous.onClose === "function"
    ) {
        try {
            previous.onClose(getDatabase());
        } catch (error) {
            console.error("[GAME UI] Erro ao fechar tela:", error);
        }
    }

    gameUIState.activeScreen = name;

    if (typeof screen.onOpen === "function") {
        try {
            screen.onOpen(getDatabase(), options);
        } catch (error) {
            console.error("[GAME UI] Erro ao abrir tela:", error);
        }
    }

    render(options);

    return true;
}

// ============================================================
// NOTIFICAÇÕES
// ============================================================

function addNotification(notification = {}) {
    const item = {
        id: notification.id || `ui_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
        type: notification.type || "info",
        title: notification.title || "Notificação",
        message: notification.message || "",
        createdAt: notification.createdAt || new Date().toISOString(),
        read: Boolean(notification.read)
    };

    gameUIState.notifications.unshift(item);

    if (gameUIState.notifications.length > 50) {
        gameUIState.notifications.length = 50;
    }

    return clone(item);
}

function removeNotification(id) {
    const index = gameUIState.notifications.findIndex(
        notification => notification.id === id
    );

    if (index === -1) return false;

    gameUIState.notifications.splice(index, 1);

    return true;
}

function markNotificationRead(id) {
    const notification = gameUIState.notifications.find(
        item => item.id === id
    );

    if (!notification) return false;

    notification.read = true;

    return true;
}

function getNotifications(options = {}) {
    let notifications = [...gameUIState.notifications];

    if (options.unreadOnly) {
        notifications = notifications.filter(item => !item.read);
    }

    if (options.type) {
        notifications = notifications.filter(
            item => item.type === options.type
        );
    }

    return clone(notifications);
}

function clearNotifications() {
    gameUIState.notifications = [];

    return true;
}

// ============================================================
// MODAL
// ============================================================

function openModal(config = {}) {
    gameUIState.modal = {
        title: config.title || "",
        content: config.content || "",
        type: config.type || "default",
        closable: config.closable !== false
    };

    renderModal();

    return clone(gameUIState.modal);
}

function closeModal() {
    gameUIState.modal = null;

    const modal = getElement("mma-life-modal");

    if (modal) {
        modal.remove();
    }

    return true;
}

function renderModal() {
    if (typeof document === "undefined") return;

    const existing = getElement("mma-life-modal");

    if (existing) {
        existing.remove();
    }

    if (!gameUIState.modal) return;

    const modal = document.createElement("div");

    modal.id = "mma-life-modal";
    modal.className = "mma-life-modal";

    modal.innerHTML = `
        <div class="mma-life-modal-backdrop"></div>

        <div class="mma-life-modal-box">
            <div class="mma-life-modal-header">
                <h2>${escapeHTML(gameUIState.modal.title)}</h2>

                ${
                    gameUIState.modal.closable
                        ? `<button
                            type="button"
                            class="mma-life-modal-close"
                            data-action="close-modal"
                        >×</button>`
                        : ""
                }
            </div>

            <div class="mma-life-modal-content">
                ${gameUIState.modal.content}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const backdrop = modal.querySelector(
        ".mma-life-modal-backdrop"
    );

    if (backdrop && gameUIState.modal.closable) {
        backdrop.addEventListener("click", closeModal);
    }

    const closeButton = modal.querySelector(
        '[data-action="close-modal"]'
    );

    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }
}

// ============================================================
// TOAST
// ============================================================

function showToast(message, type = "info", duration = 3000) {
    if (typeof document === "undefined") return;

    let container = getElement("mma-life-toast-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "mma-life-toast-container";
        container.className = "mma-life-toast-container";

        document.body.appendChild(container);
    }

    const toast = document.createElement("div");

    toast.className = `mma-life-toast mma-life-toast-${type}`;

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("is-removing");

        setTimeout(() => {
            toast.remove();
        }, 250);
    }, duration);
}

// ============================================================
// HEADER
// ============================================================

function renderHeader(database) {
    const player = database?.player || {};
    const identity = player.identity || player;

    const firstName =
        identity.firstName ||
        player.firstName ||
        "";

    const lastName =
        identity.lastName ||
        player.lastName ||
        "";

    const fullName =
        `${firstName} ${lastName}`.trim() ||
        "Novo Lutador";

    const age =
        Number(identity.age ?? player.age ?? 18);

    const careerStage =
        database?.career?.stage ||
        "Amateur";

    return `
        <header class="mma-life-header">

            <div class="mma-life-brand">
                <div class="mma-life-logo">MMA</div>

                <div>
                    <strong>MMA LIFE DYNASTY</strong>
                    <span>Career • Life • Legacy</span>
                </div>
            </div>

            <div class="mma-life-player-mini">

                <div class="mma-life-player-name">
                    ${escapeHTML(fullName)}
                </div>

                <div class="mma-life-player-info">
                    <span>${age} anos</span>
                    <span>${escapeHTML(careerStage)}</span>
                </div>

            </div>

        </header>
    `;
}

// ============================================================
// NAVIGATION
// ============================================================

function renderNavigation() {
    const items = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: "⌂"
        },
        {
            id: "career",
            label: "Carreira",
            icon: "🥊"
        },
        {
            id: "training",
            label: "Treino",
            icon: "🏋"
        },
        {
            id: "life",
            label: "Vida",
            icon: "♥"
        },
        {
            id: "family",
            label: "Família",
            icon: "👨‍👩‍👧"
        },
        {
            id: "finances",
            label: "Finanças",
            icon: "💰"
        },
        {
            id: "media",
            label: "Mídia",
            icon: "★"
        }
    ];

    return `
        <nav class="mma-life-navigation">

            ${items.map(item => `
                <button
                    type="button"
                    class="mma-life-nav-item ${
                        gameUIState.activeScreen === item.id
                            ? "active"
                            : ""
                    }"
                    data-screen="${item.id}"
                >
                    <span class="mma-life-nav-icon">
                        ${item.icon}
                    </span>

                    <span>
                        ${item.label}
                    </span>
                </button>
            `).join("")}

        </nav>
    `;
}

// ============================================================
// DASHBOARD
// ============================================================

function renderDashboard(database) {
    const player = database?.player || {};
    const career = database?.career || {};
    const training = database?.training || {};
    const business = database?.business || {};
    const media = database?.media || {};

    const identity = player.identity || player;

    const name =
        `${identity.firstName || ""} ${identity.lastName || ""}`
            .trim() ||
        "Novo Lutador";

    const age = Number(identity.age || 18);

    const record = career.professional?.record ||
        career.record ||
        {};

    const wins = Number(record.wins || 0);
    const losses = Number(record.losses || 0);
    const draws = Number(record.draws || 0);

    const cash =
        business.finances?.cash ??
        business.cash ??
        0;

    const fame =
        media.fame ??
        0;

    const followers =
        media.followers ??
        0;

    const energy =
        training.energy ??
        100;

    return `
        <section class="mma-life-dashboard">

            <div class="mma-life-welcome-card">

                <div>
                    <span class="mma-life-eyebrow">
                        SUA JORNADA
                    </span>

                    <h1>
                        ${escapeHTML(name)}
                    </h1>

                    <p>
                        ${age} anos •
                        ${escapeHTML(career.stage || "Amateur")}
                    </p>
                </div>

                <div class="mma-life-record">

                    <span>REGISTRO</span>

                    <strong>
                        ${wins}-${losses}-${draws}
                    </strong>

                </div>

            </div>

            <div class="mma-life-stat-grid">

                <div class="mma-life-stat-card">
                    <span>Energia</span>
                    <strong>${energy}</strong>
                    <small>/ 100</small>
                </div>

                <div class="mma-life-stat-card">
                    <span>Fama</span>
                    <strong>${formatNumber(fame)}</strong>
                </div>

                <div class="mma-life-stat-card">
                    <span>Seguidores</span>
                    <strong>${formatNumber(followers)}</strong>
                </div>

                <div class="mma-life-stat-card">
                    <span>Patrimônio</span>
                    <strong>${formatMoney(cash)}</strong>
                </div>

            </div>

            <div class="mma-life-dashboard-columns">

                <div class="mma-life-panel">

                    <div class="mma-life-panel-title">
                        Próximos passos
                    </div>

                    <div class="mma-life-action-list">

                        <button
                            type="button"
                            data-screen="training"
                        >
                            <strong>Treinar</strong>
                            <span>
                                Desenvolva seus atributos
                            </span>
                        </button>

                        <button
                            type="button"
                            data-screen="career"
                        >
                            <strong>Carreira</strong>
                            <span>
                                Veja sua evolução no MMA
                            </span>
                        </button>

                        <button
                            type="button"
                            data-screen="life"
                        >
                            <strong>Vida</strong>
                            <span>
                                Gerencie sua vida fora do octógono
                            </span>
                        </button>

                    </div>

                </div>

                <div class="mma-life-panel">

                    <div class="mma-life-panel-title">
                        Dinastia
                    </div>

                    <p class="mma-life-muted">
                        Sua carreira é apenas o começo.
                        Construa patrimônio, forme uma família
                        e deixe um legado para as próximas gerações.
                    </p>

                </div>

            </div>

        </section>
    `;
}

// ============================================================
// GENERIC SCREEN
// ============================================================

function renderGenericScreen(database, name) {
    const titles = {
        career: "Carreira",
        training: "Treinamento",
        life: "Vida",
        family: "Família",
        finances: "Finanças",
        media: "Mídia"
    };

    const descriptions = {
        career: "Gerencie sua carreira profissional no MMA.",
        training: "Treine, evolua seus atributos e cuide da recuperação.",
        life: "Construa sua vida fora do MMA.",
        family: "Relacionamentos, casamento, filhos e gerações.",
        finances: "Gerencie dinheiro, patrimônio, contratos e riqueza.",
        media: "Fama, seguidores, reputação e presença pública."
    };

    return `
        <section class="mma-life-placeholder-screen">

            <span class="mma-life-eyebrow">
                MMA LIFE DYNASTY
            </span>

            <h1>
                ${escapeHTML(titles[name] || capitalize(name))}
            </h1>

            <p>
                ${escapeHTML(
                    descriptions[name] ||
                    "Esta área será carregada pelo módulo correspondente."
                )}
            </p>

        </section>
    `;
}

// ============================================================
// MAIN RENDER
// ============================================================

function render(options = {}) {
    if (typeof document === "undefined") {
        return null;
    }

    const root = ensureRoot();

    if (!root) return null;

    const database = getDatabase();

    gameUIState.lastRender = Date.now();

    let content = "";

    if (gameUIState.activeScreen === "dashboard") {
        content = renderDashboard(database);
    } else {
        const screen = getScreen(gameUIState.activeScreen);

        if (screen?.render) {
            try {
                content = screen.render(
                    database,
                    options
                );
            } catch (error) {
                console.error(
                    "[GAME UI] Erro ao renderizar tela:",
                    error
                );

                content = renderGenericScreen(
                    database,
                    gameUIState.activeScreen
                );
            }
        } else {
            content = renderGenericScreen(
                database,
                gameUIState.activeScreen
            );
        }
    }

    root.innerHTML = `
        <div class="mma-life-shell">

            ${renderHeader(database)}

            <div class="mma-life-body">

                ${renderNavigation()}

                <main class="mma-life-content">
                    ${content}
                </main>

            </div>

        </div>
    `;

    bindEvents();

    return root;
}

// ============================================================
// EVENTOS
// ============================================================

function bindEvents() {
    if (typeof document === "undefined") return;

    document
        .querySelectorAll("[data-screen]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const screen =
                    button.dataset.screen;

                if (!screen) return;

                if (!getScreen(screen)) {
                    registerDefaultScreen(screen);
                }

                setActiveScreen(screen);
            });
        });
}

function registerDefaultScreen(name) {
    if (!name || getScreen(name)) return;

    registerScreen(name, {
        title: capitalize(name),
        render: database =>
            renderGenericScreen(database, name)
    });
}

// ============================================================
// ESTILOS
// ============================================================

function injectStyles() {
    if (typeof document === "undefined") return;

    if (getElement("mma-life-game-ui-styles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "mma-life-game-ui-styles";

    style.textContent = `
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family:
                Inter,
                system-ui,
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                sans-serif;
            background: #0b0b0f;
            color: #f5f5f5;
        }

        button {
            font: inherit;
        }

        .mma-life-shell {
            min-height: 100vh;
            background:
                radial-gradient(
                    circle at top right,
                    rgba(255,255,255,.06),
                    transparent 35%
                ),
                #0b0b0f;
        }

        .mma-life-header {
            min-height: 72px;
            padding: 14px 22px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            border-bottom: 1px solid rgba(255,255,255,.08);
            background: rgba(12,12,16,.96);
        }

        .mma-life-brand {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .mma-life-logo {
            width: 42px;
            height: 42px;
            border-radius: 10px;
            display: grid;
            place-items: center;
            background: #ffffff;
            color: #0b0b0f;
            font-size: 12px;
            font-weight: 900;
        }

        .mma-life-brand strong {
            display: block;
            font-size: 14px;
            letter-spacing: .08em;
        }

        .mma-life-brand span {
            display: block;
            margin-top: 3px;
            color: #8f8f98;
            font-size: 11px;
        }

        .mma-life-player-mini {
            text-align: right;
        }

        .mma-life-player-name {
            font-weight: 700;
            font-size: 14px;
        }

        .mma-life-player-info {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 4px;
            color: #8f8f98;
            font-size: 11px;
        }

        .mma-life-body {
            display: flex;
            min-height: calc(100vh - 72px);
        }

        .mma-life-navigation {
            width: 210px;
            flex-shrink: 0;
            padding: 16px 10px;
            border-right: 1px solid rgba(255,255,255,.07);
            background: rgba(9,9,12,.8);
        }

        .mma-life-nav-item {
            width: 100%;
            border: 0;
            background: transparent;
            color: #a4a4ad;
            padding: 12px;
            margin-bottom: 4px;
            border-radius: 9px;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            text-align: left;
            transition: .15s ease;
        }

        .mma-life-nav-item:hover,
        .mma-life-nav-item.active {
            background: rgba(255,255,255,.08);
            color: #ffffff;
        }

        .mma-life-nav-icon {
            width: 24px;
            text-align: center;
        }

        .mma-life-content {
            flex: 1;
            min-width: 0;
            padding: 28px;
        }

        .mma-life-dashboard {
            max-width: 1200px;
            margin: 0 auto;
        }

        .mma-life-welcome-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            padding: 28px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 16px;
            background: rgba(255,255,255,.035);
        }

        .mma-life-eyebrow {
            display: block;
            margin-bottom: 7px;
            color: #8f8f98;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: .14em;
        }

        .mma-life-welcome-card h1,
        .mma-life-placeholder-screen h1 {
            margin: 0;
            font-size: clamp(26px, 4vw, 40px);
        }

        .mma-life-welcome-card p,
        .mma-life-placeholder-screen p {
            margin: 7px 0 0;
            color: #92929b;
        }

        .mma-life-record {
            text-align: right;
        }

        .mma-life-record span {
            display: block;
            color: #777781;
            font-size: 10px;
            letter-spacing: .12em;
        }

        .mma-life-record strong {
            display: block;
            margin-top: 5px;
            font-size: 28px;
        }

        .mma-life-stat-grid {
            display: grid;
            grid-template-columns:
                repeat(4, minmax(0, 1fr));
            gap: 12px;
            margin-top: 14px;
        }

        .mma-life-stat-card {
            padding: 18px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 14px;
            background: rgba(255,255,255,.025);
        }

        .mma-life-stat-card span {
            display: block;
            color: #888892;
            font-size: 12px;
        }

        .mma-life-stat-card strong {
            display: inline-block;
            margin-top: 8px;
            font-size: 22px;
        }

        .mma-life-stat-card small {
            color: #777781;
        }

        .mma-life-dashboard-columns {
            display: grid;
            grid-template-columns:
                minmax(0, 1.4fr)
                minmax(0, 1fr);
            gap: 14px;
            margin-top: 14px;
        }

        .mma-life-panel {
            padding: 20px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 14px;
            background: rgba(255,255,255,.025);
        }

        .mma-life-panel-title {
            margin-bottom: 14px;
            font-size: 14px;
            font-weight: 800;
        }

        .mma-life-action-list {
            display: grid;
            gap: 8px;
        }

        .mma-life-action-list button {
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 10px;
            background: rgba(255,255,255,.025);
            color: #ffffff;
            padding: 13px;
            text-align: left;
            cursor: pointer;
        }

        .mma-life-action-list button:hover {
            background: rgba(255,255,255,.07);
        }

        .mma-life-action-list strong,
        .mma-life-action-list span {
            display: block;
        }

        .mma-life-action-list span {
            margin-top: 4px;
            color: #85858e;
            font-size: 12px;
        }

        .mma-life-muted {
            color: #8b8b94;
            line-height: 1.6;
        }

        .mma-life-placeholder-screen {
            max-width: 800px;
            margin: 40px auto;
            padding: 40px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 16px;
            background: rgba(255,255,255,.025);
        }

        .mma-life-toast-container {
            position: fixed;
            right: 18px;
            bottom: 18px;
            z-index: 10000;
            display: grid;
            gap: 8px;
        }

        .mma-life-toast {
            max-width: 320px;
            padding: 12px 15px;
            border-radius: 9px;
            background: #ffffff;
            color: #0b0b0f;
            font-size: 13px;
            box-shadow: 0 10px 30px rgba(0,0,0,.35);
            animation: mmaLifeToastIn .2s ease;
        }

        .mma-life-toast.is-removing {
            opacity: 0;
            transform: translateY(5px);
            transition: .25s ease;
        }

        .mma-life-modal {
            position: fixed;
            inset: 0;
            z-index: 20000;
            display: grid;
            place-items: center;
            padding: 20px;
        }

        .mma-life-modal-backdrop {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,.75);
        }

        .mma-life-modal-box {
            position: relative;
            width: min(600px, 100%);
            max-height: 90vh;
            overflow: auto;
            border: 1px solid rgba(255,255,255,.1);
            border-radius: 16px;
            background: #111116;
            box-shadow: 0 25px 80px rgba(0,0,0,.55);
        }

        .mma-life-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 18px 20px;
            border-bottom: 1px solid rgba(255,255,255,.07);
        }

        .mma-life-modal-header h2 {
            margin: 0;
            font-size: 18px;
        }

        .mma-life-modal-close {
            border: 0;
            background: transparent;
            color: #9999a2;
            font-size: 26px;
            cursor: pointer;
        }

        .mma-life-modal-content {
            padding: 20px;
        }

        @keyframes mmaLifeToastIn {
            from {
                opacity: 0;
                transform: translateY(8px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 800px) {

            .mma-life-body {
                display: block;
            }

            .mma-life-navigation {
                width: 100%;
                display: flex;
                overflow-x: auto;
                border-right: 0;
                border-bottom: 1px solid rgba(255,255,255,.07);
            }

            .mma-life-nav-item {
                width: auto;
                min-width: max-content;
                margin: 0 4px 0 0;
            }

            .mma-life-content {
                padding: 18px;
            }

            .mma-life-stat-grid {
                grid-template-columns:
                    repeat(2, minmax(0, 1fr));
            }

            .mma-life-dashboard-columns {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 520px) {

            .mma-life-header {
                padding: 12px 14px;
            }

            .mma-life-player-mini {
                display: none;
            }

            .mma-life-welcome-card {
                display: block;
            }

            .mma-life-record {
                margin-top: 18px;
                text-align: left;
            }

            .mma-life-stat-grid {
                grid-template-columns: 1fr;
            }
        }
    `;

    document.head.appendChild(style);
}

// ============================================================
// INTEGRAÇÃO COM OUTROS MÓDULOS DE UI
// ============================================================

function registerExternalScreens() {
    if (typeof window === "undefined") return;

    const characterCreationAPI =
        window.characterCreationAPI ||
        window.MMA_LIFE_CHARACTER_CREATION ||
        null;

    if (characterCreationAPI?.render) {
        registerScreen("characterCreation", {
            title: "Criação do Personagem",
            render: database =>
                characterCreationAPI.render(database)
        });
    }

    const lifeDashboardAPI =
        window.lifeDashboardAPI ||
        window.MMA_LIFE_LIFE_DASHBOARD ||
        null;

    if (lifeDashboardAPI?.render) {
        registerScreen("life", {
            title: "Vida",
            render: database =>
                lifeDashboardAPI.render(database)
        });
    }

    const lifeScreenAPI =
        window.lifeScreenAPI ||
        window.MMA_LIFE_LIFE_SCREEN ||
        null;

    if (lifeScreenAPI?.render) {
        registerScreen("lifeScreen", {
            title: "Vida",
            render: database =>
                lifeScreenAPI.render(database)
        });
    }
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

function initializeGameUI(database = null, options = {}) {
    if (database) {
        setDatabase(database);
    } else {
        database = getDatabase();
    }

    injectStyles();

    registerScreen("dashboard", {
        title: "Dashboard",
        render: renderDashboard
    });

    registerDefaultScreen("career");
    registerDefaultScreen("training");
    registerDefaultScreen("life");
    registerDefaultScreen("family");
    registerDefaultScreen("finances");
    registerDefaultScreen("media");

    registerExternalScreens();

    gameUIState.initialized = true;

    if (options.render !== false) {
        render(options);
    }

    return getState();
}

// ============================================================
// REFRESH
// ============================================================

function refresh(database = null, options = {}) {
    if (database) {
        setDatabase(database);
    }

    if (!gameUIState.initialized) {
        initializeGameUI(database, {
            ...options,
            render: false
        });
    }

    registerExternalScreens();

    return render(options);
}

// ============================================================
// ESTADO
// ============================================================

function getState() {
    return {
        version: GAME_UI_VERSION,
        initialized: gameUIState.initialized,
        activeScreen: gameUIState.activeScreen,
        screens: Object.keys(gameUIState.screens),
        notifications: gameUIState.notifications.length,
        modalOpen: Boolean(gameUIState.modal),
        lastRender: gameUIState.lastRender
    };
}

function snapshot() {
    return clone({
        version: GAME_UI_VERSION,
        state: gameUIState
    });
}

function validate() {
    const errors = [];

    if (!gameUIState.activeScreen) {
        errors.push("Tela ativa não definida.");
    }

    if (
        gameUIState.activeScreen &&
        !getScreen(gameUIState.activeScreen)
    ) {
        errors.push(
            `Tela ativa inexistente: ${gameUIState.activeScreen}`
        );
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// ============================================================
// API
// ============================================================

export const gameUIAPI = {
    version: GAME_UI_VERSION,

    initialize: initializeGameUI,
    init: initializeGameUI,

    render,
    refresh,

    registerScreen,
    unregisterScreen,
    getScreen,
    getScreens,

    getActiveScreen,
    setActiveScreen,

    addNotification,
    removeNotification,
    markNotificationRead,
    getNotifications,
    clearNotifications,

    openModal,
    closeModal,

    showToast,

    getDatabase,
    setDatabase,

    getState,
    snapshot,
    validate
};

// ============================================================
// GLOBAL
// ============================================================

if (typeof window !== "undefined") {
    window.gameUIAPI = gameUIAPI;
    window.MMA_LIFE_GAME_UI = gameUIAPI;
}

// ============================================================
// EVENTO DE READY
// ============================================================

if (typeof window !== "undefined") {
    window.dispatchEvent(
        new CustomEvent("mma-life-game-ui-ready", {
            detail: {
                api: gameUIAPI,
                version: GAME_UI_VERSION
            }
        })
    );
}

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default gameUIAPI;
