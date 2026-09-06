// ============================================================
// MMA LIFE DYNASTY
// UI — HUD
// ============================================================

const HUD_VERSION = 1;

const hudState = {
    initialized: false,
    database: null,
    visible: true,
    collapsed: false,
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
    return (
        database ||
        hudState.database ||
        window.MMA_LIFE_DATABASE ||
        null
    );
}

function setDatabase(database) {
    hudState.database = database || null;

    return hudState.database;
}

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function clamp(value, min = 0, max = 100) {
    return Math.max(
        min,
        Math.min(max, Number(value) || 0)
    );
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString("pt-BR");
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

function getElement(id) {
    if (typeof document === "undefined") return null;

    return document.getElementById(id);
}

// ============================================================
// DADOS DO JOGADOR
// ============================================================

function getPlayer(database = null) {
    const db = getDatabase(database);

    return db?.player || {};
}

function getIdentity(database = null) {
    const player = getPlayer(database);

    return player.identity || player;
}

function getPlayerName(database = null) {
    const identity = getIdentity(database);

    const firstName =
        identity.firstName ||
        identity.firstname ||
        "";

    const lastName =
        identity.lastName ||
        identity.lastname ||
        "";

    const nickname =
        identity.nickname ||
        identity.nickName ||
        "";

    const fullName =
        `${firstName} ${lastName}`.trim();

    return (
        nickname ||
        fullName ||
        "Novo Lutador"
    );
}

function getAge(database = null) {
    const identity = getIdentity(database);

    return Number(
        identity.age ??
        getPlayer(database).age ??
        18
    );
}

function getCareerStage(database = null) {
    const db = getDatabase(database);

    return (
        db?.career?.stage ||
        db?.career?.careerStage ||
        "Amateur"
    );
}

function getWeight(database = null) {
    const db = getDatabase(database);

    return Number(
        db?.training?.weight ??
        db?.player?.weight ??
        getIdentity(database).weight ??
        0
    );
}

function getWeightClass(database = null) {
    const db = getDatabase(database);

    return (
        db?.player?.weightClass ||
        db?.player?.physical?.weightClass ||
        getIdentity(database).weightClass ||
        ""
    );
}

// ============================================================
// ATRIBUTOS
// ============================================================

function getAttributes(database = null) {
    const player = getPlayer(database);

    return (
        player.attributes ||
        player.stats ||
        {}
    );
}

function getOverall(database = null) {
    const player = getPlayer(database);

    if (
        Number.isFinite(
            Number(player.ovr)
        )
    ) {
        return Number(player.ovr);
    }

    if (
        Number.isFinite(
            Number(player.overall)
        )
    ) {
        return Number(player.overall);
    }

    const attributes = getAttributes(database);

    const values = Object.values(attributes)
        .filter(value => Number.isFinite(Number(value)))
        .map(Number);

    if (!values.length) {
        return 0;
    }

    return Math.round(
        values.reduce(
            (sum, value) => sum + value,
            0
        ) / values.length
    );
}

// ============================================================
// TREINAMENTO / ENERGIA
// ============================================================

function getEnergy(database = null) {
    const db = getDatabase(database);

    return clamp(
        db?.training?.energy ?? 100
    );
}

function getFatigue(database = null) {
    const db = getDatabase(database);

    return clamp(
        db?.training?.fatigue ?? 0
    );
}

function getHealth(database = null) {
    const db = getDatabase(database);

    const health =
        db?.health?.overall ??
        db?.health?.value ??
        db?.training?.health ??
        100;

    return clamp(health);
}

function getEnergyStatus(value) {
    if (value >= 75) return "high";
    if (value >= 40) return "medium";
    return "low";
}

function getFatigueStatus(value) {
    if (value < 25) return "low";
    if (value < 60) return "medium";
    return "high";
}

function getHealthStatus(value) {
    if (value >= 75) return "high";
    if (value >= 40) return "medium";
    return "low";
}

// ============================================================
// CARREIRA
// ============================================================

function getRecord(database = null) {
    const db = getDatabase(database);

    const record =
        db?.career?.professional?.record ||
        db?.career?.record ||
        db?.player?.record ||
        {};

    return {
        wins: Number(record.wins || 0),
        losses: Number(record.losses || 0),
        draws: Number(record.draws || 0),
        noContests: Number(
            record.noContests ||
            record.nc ||
            0
        )
    };
}

function getRecordText(database = null) {
    const record = getRecord(database);

    return `${record.wins}-${record.losses}-${record.draws}`;
}

function getRank(database = null) {
    const db = getDatabase(database);

    return (
        db?.career?.professional?.rank ??
        db?.career?.rank ??
        null
    );
}

function getCurrentPromotion(database = null) {
    const db = getDatabase(database);

    return (
        db?.career?.professional?.currentPromotion ||
        db?.career?.currentPromotion ||
        null
    );
}

// ============================================================
// FINANÇAS
// ============================================================

function getCash(database = null) {
    const db = getDatabase(database);

    return Number(
        db?.business?.finances?.cash ??
        db?.business?.cash ??
        0
    );
}

function getCurrency(database = null) {
    const db = getDatabase(database);

    return (
        db?.settings?.currency ||
        "USD"
    );
}

// ============================================================
// MÍDIA
// ============================================================

function getFame(database = null) {
    const db = getDatabase(database);

    return Number(
        db?.media?.fame ??
        0
    );
}

function getFollowers(database = null) {
    const db = getDatabase(database);

    return Number(
        db?.media?.followers ??
        0
    );
}

function getReputation(database = null) {
    const db = getDatabase(database);

    return Number(
        db?.media?.reputation ??
        0
    );
}

// ============================================================
// CALENDÁRIO
// ============================================================

function getCalendar(database = null) {
    const db = getDatabase(database);

    return (
        db?.calendar ||
        db?.meta ||
        {}
    );
}

function getDateText(database = null) {
    const calendar = getCalendar(database);

    if (calendar.currentDate) {
        return String(calendar.currentDate);
    }

    const year =
        calendar.currentYear ||
        1;

    const week =
        calendar.currentWeek ||
        1;

    return `Ano ${year} • Semana ${week}`;
}

// ============================================================
// STATUS
// ============================================================

function getStatus(database = null) {
    const player = getPlayer(database);

    return (
        player.status ||
        "active"
    );
}

function getStatusLabel(status) {
    const labels = {
        active: "Ativo",
        injured: "Lesionado",
        suspended: "Suspenso",
        retired: "Aposentado",
        dead: "Falecido"
    };

    return (
        labels[status] ||
        "Ativo"
    );
}

// ============================================================
// RENDER — BARRA SUPERIOR
// ============================================================

function renderTopBar(database) {
    const name =
        getPlayerName(database);

    const age =
        getAge(database);

    const stage =
        getCareerStage(database);

    const ovr =
        getOverall(database);

    const record =
        getRecordText(database);

    const status =
        getStatus(database);

    return `
        <div class="mma-life-hud-topbar">

            <div class="mma-life-hud-profile">

                <div class="mma-life-hud-avatar">
                    ${escapeHTML(
                        name
                            .charAt(0)
                            .toUpperCase()
                    )}
                </div>

                <div class="mma-life-hud-profile-text">

                    <strong>
                        ${escapeHTML(name)}
                    </strong>

                    <span>
                        ${age} anos •
                        ${escapeHTML(stage)}
                    </span>

                </div>

            </div>

            <div class="mma-life-hud-career">

                <div class="mma-life-hud-career-item">
                    <small>OVR</small>
                    <strong>${ovr}</strong>
                </div>

                <div class="mma-life-hud-career-item">
                    <small>REC</small>
                    <strong>${record}</strong>
                </div>

                <div class="mma-life-hud-career-item">
                    <small>STATUS</small>
                    <strong>
                        ${escapeHTML(
                            getStatusLabel(status)
                        )}
                    </strong>
                </div>

            </div>

        </div>
    `;
}

// ============================================================
// RENDER — RECURSOS
// ============================================================

function renderResources(database) {
    const energy =
        getEnergy(database);

    const fatigue =
        getFatigue(database);

    const health =
        getHealth(database);

    return `
        <div class="mma-life-hud-resources">

            <div class="mma-life-hud-resource">

                <div class="mma-life-hud-resource-head">
                    <span>Energia</span>
                    <strong>${Math.round(energy)}</strong>
                </div>

                <div class="mma-life-hud-bar">
                    <div
                        class="mma-life-hud-fill energy ${getEnergyStatus(energy)}"
                        style="width:${energy}%"
                    ></div>
                </div>

            </div>

            <div class="mma-life-hud-resource">

                <div class="mma-life-hud-resource-head">
                    <span>Saúde</span>
                    <strong>${Math.round(health)}</strong>
                </div>

                <div class="mma-life-hud-bar">
                    <div
                        class="mma-life-hud-fill health ${getHealthStatus(health)}"
                        style="width:${health}%"
                    ></div>
                </div>

            </div>

            <div class="mma-life-hud-resource">

                <div class="mma-life-hud-resource-head">
                    <span>Fadiga</span>
                    <strong>${Math.round(fatigue)}</strong>
                </div>

                <div class="mma-life-hud-bar">
                    <div
                        class="mma-life-hud-fill fatigue ${getFatigueStatus(fatigue)}"
                        style="width:${fatigue}%"
                    ></div>
                </div>

            </div>

        </div>
    `;
}

// ============================================================
// RENDER — RESUMO
// ============================================================

function renderSummary(database) {
    const weight =
        getWeight(database);

    const weightClass =
        getWeightClass(database);

    const promotion =
        getCurrentPromotion(database);

    const rank =
        getRank(database);

    const fame =
        getFame(database);

    const followers =
        getFollowers(database);

    const reputation =
        getReputation(database);

    const cash =
        getCash(database);

    const currency =
        getCurrency(database);

    return `
        <div class="mma-life-hud-summary">

            <div class="mma-life-hud-summary-item">
                <span>Peso</span>
                <strong>
                    ${weight > 0
                        ? `${weight} kg`
                        : "—"}
                </strong>
            </div>

            <div class="mma-life-hud-summary-item">
                <span>Categoria</span>
                <strong>
                    ${escapeHTML(
                        weightClass || "—"
                    )}
                </strong>
            </div>

            <div class="mma-life-hud-summary-item">
                <span>Organização</span>
                <strong>
                    ${escapeHTML(
                        promotion || "—"
                    )}
                </strong>
            </div>

            <div class="mma-life-hud-summary-item">
                <span>Ranking</span>
                <strong>
                    ${
                        rank !== null &&
                        rank !== undefined
                            ? `#${rank}`
                            : "—"
                    }
                </strong>
            </div>

            <div class="mma-life-hud-summary-item">
                <span>Fama</span>
                <strong>
                    ${formatNumber(fame)}
                </strong>
            </div>

            <div class="mma-life-hud-summary-item">
                <span>Seguidores</span>
                <strong>
                    ${formatNumber(followers)}
                </strong>
            </div>

            <div class="mma-life-hud-summary-item">
                <span>Reputação</span>
                <strong>
                    ${formatNumber(reputation)}
                </strong>
            </div>

            <div class="mma-life-hud-summary-item">
                <span>Dinheiro</span>
                <strong>
                    ${formatMoney(
                        cash,
                        currency
                    )}
                </strong>
            </div>

        </div>
    `;
}

// ============================================================
// RENDER COMPLETO
// ============================================================

function render(database = null) {
    const db =
        getDatabase(database);

    if (typeof document === "undefined") {
        return "";
    }

    const container =
        getElement("mma-life-hud");

    if (!container) {
        return "";
    }

    container.innerHTML = `
        <div class="mma-life-hud">

            ${renderTopBar(db)}

            ${renderResources(db)}

            ${renderSummary(db)}

            <div class="mma-life-hud-date">
                ${escapeHTML(
                    getDateText(db)
                )}
            </div>

        </div>
    `;

    bindEvents();

    hudState.lastRender =
        Date.now();

    return container.innerHTML;
}

// ============================================================
// CONTAINER
// ============================================================

function createContainer() {
    if (typeof document === "undefined") {
        return null;
    }

    let container =
        getElement("mma-life-hud");

    if (!container) {
        container =
            document.createElement("aside");

        container.id =
            "mma-life-hud";

        container.className =
            "mma-life-hud-container";

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
    if (typeof document === "undefined") {
        return;
    }

    const container =
        getElement("mma-life-hud");

    if (!container) {
        return;
    }

    container
        .querySelectorAll(
            "[data-hud-action]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.hudAction;

                    if (
                        action ===
                        "toggle"
                    ) {
                        toggle();
                    }

                }
            );

        });
}

// ============================================================
// VISIBILIDADE
// ============================================================

function show() {
    hudState.visible = true;

    const container =
        getElement("mma-life-hud");

    if (container) {
        container.style.display =
            "";
    }

    return true;
}

function hide() {
    hudState.visible = false;

    const container =
        getElement("mma-life-hud");

    if (container) {
        container.style.display =
            "none";
    }

    return true;
}

function toggle() {
    if (hudState.visible) {
        return hide();
    }

    return show();
}

// ============================================================
// COLLAPSE
// ============================================================

function collapse() {
    hudState.collapsed = true;

    const container =
        getElement("mma-life-hud");

    if (container) {
        container.classList.add(
            "is-collapsed"
        );
    }

    return true;
}

function expand() {
    hudState.collapsed = false;

    const container =
        getElement("mma-life-hud");

    if (container) {
        container.classList.remove(
            "is-collapsed"
        );
    }

    return true;
}

function toggleCollapse() {
    if (hudState.collapsed) {
        return expand();
    }

    return collapse();
}

// ============================================================
// ESTILOS
// ============================================================

function injectStyles() {
    if (typeof document === "undefined") {
        return;
    }

    if (
        getElement(
            "mma-life-hud-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement("style");

    style.id =
        "mma-life-hud-styles";

    style.textContent = `
        .mma-life-hud-container {
            width: 100%;
            z-index: 1000;
        }

        .mma-life-hud {
            width: 100%;
            padding: 12px 16px;
            background: rgba(10,10,14,.96);
            border-bottom: 1px solid rgba(255,255,255,.08);
            box-shadow:
                0 8px 30px rgba(0,0,0,.18);
        }

        .mma-life-hud-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            max-width: 1400px;
            margin: 0 auto;
        }

        .mma-life-hud-profile {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
        }

        .mma-life-hud-avatar {
            width: 40px;
            height: 40px;
            flex-shrink: 0;
            display: grid;
            place-items: center;
            border-radius: 50%;
            background: #ffffff;
            color: #0b0b0f;
            font-weight: 900;
        }

        .mma-life-hud-profile-text {
            min-width: 0;
        }

        .mma-life-hud-profile-text strong {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
        }

        .mma-life-hud-profile-text span {
            display: block;
            margin-top: 3px;
            color: #85858e;
            font-size: 11px;
        }

        .mma-life-hud-career {
            display: flex;
            align-items: center;
            gap: 18px;
        }

        .mma-life-hud-career-item {
            text-align: right;
        }

        .mma-life-hud-career-item small {
            display: block;
            color: #777781;
            font-size: 9px;
            letter-spacing: .08em;
        }

        .mma-life-hud-career-item strong {
            display: block;
            margin-top: 2px;
            font-size: 13px;
        }

        .mma-life-hud-resources {
            display: grid;
            grid-template-columns:
                repeat(3, minmax(120px, 1fr));
            gap: 12px;
            max-width: 1400px;
            margin: 12px auto 0;
        }

        .mma-life-hud-resource {
            min-width: 0;
        }

        .mma-life-hud-resource-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            color: #9999a2;
            font-size: 10px;
        }

        .mma-life-hud-resource-head strong {
            color: #ffffff;
        }

        .mma-life-hud-bar {
            height: 5px;
            overflow: hidden;
            border-radius: 99px;
            background: rgba(255,255,255,.08);
        }

        .mma-life-hud-fill {
            height: 100%;
            border-radius: inherit;
            transition: width .25s ease;
        }

        .mma-life-hud-fill.energy {
            background: #ffffff;
        }

        .mma-life-hud-fill.health {
            background: #b8b8c0;
        }

        .mma-life-hud-fill.fatigue {
            background: #666670;
        }

        .mma-life-hud-summary {
            display: grid;
            grid-template-columns:
                repeat(8, minmax(70px, 1fr));
            gap: 7px;
            max-width: 1400px;
            margin: 10px auto 0;
        }

        .mma-life-hud-summary-item {
            min-width: 0;
            padding: 8px;
            border-radius: 7px;
            background: rgba(255,255,255,.035);
        }

        .mma-life-hud-summary-item span {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #777781;
            font-size: 9px;
        }

        .mma-life-hud-summary-item strong {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-top: 3px;
            font-size: 11px;
        }

        .mma-life-hud-date {
            max-width: 1400px;
            margin: 8px auto 0;
            color: #666670;
            text-align: right;
            font-size: 9px;
        }

        .mma-life-hud.is-collapsed
        .mma-life-hud-resources,
        .mma-life-hud.is-collapsed
        .mma-life-hud-summary,
        .mma-life-hud.is-collapsed
        .mma-life-hud-date {
            display: none;
        }

        @media (max-width: 900px) {

            .mma-life-hud-summary {
                grid-template-columns:
                    repeat(4, minmax(70px, 1fr));
            }

        }

        @media (max-width: 600px) {

            .mma-life-hud {
                padding: 10px;
            }

            .mma-life-hud-topbar {
                align-items: flex-start;
            }

            .mma-life-hud-career {
                gap: 9px;
            }

            .mma-life-hud-career-item:nth-child(
                3
            ) {
                display: none;
            }

            .mma-life-hud-resources {
                grid-template-columns: 1fr;
                gap: 7px;
            }

            .mma-life-hud-summary {
                grid-template-columns:
                    repeat(2, minmax(0, 1fr));
            }

        }
    `;

    document.head.appendChild(style);
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

function initializeHUD(
    database = null,
    options = {}
) {
    if (database) {
        setDatabase(database);
    }

    injectStyles();

    createContainer();

    hudState.initialized = true;

    if (options.visible === false) {
        hide();
    } else {
        show();
    }

    if (options.render !== false) {
        render(database);
    }

    return getState();
}

// ============================================================
// REFRESH
// ============================================================

function refresh(database = null) {
    if (database) {
        setDatabase(database);
    }

    if (!hudState.initialized) {
        initializeHUD(
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
        version: HUD_VERSION,
        initialized:
            hudState.initialized,
        visible:
            hudState.visible,
        collapsed:
            hudState.collapsed,
        lastRender:
            hudState.lastRender
    };
}

function snapshot() {
    return {
        version: HUD_VERSION,
        state: clone(hudState)
    };
}

function validate() {
    const errors = [];

    if (!hudState.initialized) {
        errors.push(
            "HUD não inicializado."
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

export const hudAPI = {

    version: HUD_VERSION,

    initialize: initializeHUD,
    init: initializeHUD,

    render,
    refresh,

    show,
    hide,
    toggle,

    collapse,
    expand,
    toggleCollapse,

    getDatabase,
    setDatabase,

    getPlayer,
    getIdentity,
    getPlayerName,
    getAge,
    getCareerStage,
    getWeight,
    getWeightClass,

    getAttributes,
    getOverall,

    getEnergy,
    getFatigue,
    getHealth,

    getRecord,
    getRecordText,
    getRank,
    getCurrentPromotion,

    getCash,
    getCurrency,

    getFame,
    getFollowers,
    getReputation,

    getDateText,

    getStatus,
    getStatusLabel,

    getState,
    snapshot,
    validate
};

// ============================================================
// GLOBAL
// ============================================================

if (typeof window !== "undefined") {

    window.hudAPI =
        hudAPI;

    window.MMA_LIFE_HUD =
        hudAPI;
}

// ============================================================
// READY EVENT
// ============================================================

if (typeof window !== "undefined") {

    window.dispatchEvent(
        new CustomEvent(
            "mma-life-hud-ready",
            {
                detail: {
                    api: hudAPI,
                    version: HUD_VERSION
                }
            }
        )
    );
}

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default hudAPI;
