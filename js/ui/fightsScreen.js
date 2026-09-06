// ============================================================
// MMA LIFE DYNASTY — FIGHTS SCREEN
// js/ui/fightsScreen.js
// ============================================================

const FIGHTS_SCREEN_VERSION = 1;

const fightsScreenState = {
    initialized: false,
    database: null,
    lastRender: null
};

// ============================================================
// UTILITIES
// ============================================================

function clone(value) {
    if (value === undefined) return undefined;

    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function getDatabase(database = null) {
    return database || fightsScreenState.database || window.MMA_LIFE_DATABASE || {};
}

function getPlayer(database) {
    return database?.player || {};
}

function getCareer(database) {
    return database?.career || {};
}

function getWorld(database) {
    return database?.world || {};
}

function getFighters(database) {
    return getWorld(database).fighters || {};
}

function getEvents(database) {
    return getWorld(database).events || {};
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatNumber(value) {
    return new Intl.NumberFormat("pt-BR").format(
        Number(value) || 0
    );
}

function formatMoney(value) {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "$0";
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(amount);
}

function getPlayerName(database) {
    const player = getPlayer(database);
    const identity = player.identity || {};

    return (
        player.name ||
        identity.fullName ||
        [
            identity.firstName || player.firstName,
            identity.lastName || player.lastName
        ]
            .filter(Boolean)
            .join(" ") ||
        "Lutador"
    );
}

// ============================================================
// PLAYER DATA
// ============================================================

function getPlayerRecord(database) {
    const career = getCareer(database);

    const record =
        career.record ||
        career.professional?.record ||
        career.amateur?.record ||
        {};

    return {
        wins: Number(
            record.wins ??
            career.wins ??
            career.professional?.wins ??
            0
        ) || 0,

        losses: Number(
            record.losses ??
            career.losses ??
            career.professional?.losses ??
            0
        ) || 0,

        draws: Number(
            record.draws ??
            career.draws ??
            career.professional?.draws ??
            0
        ) || 0
    };
}

function getPlayerWeightClass(database) {
    const player = getPlayer(database);

    return (
        player.weightClass ||
        player.weight_class ||
        player.physical?.weightClass ||
        getCareer(database).division ||
        "Não definida"
    );
}

function getPlayerOverall(database) {
    const player = getPlayer(database);
    const attributes =
        player.attributes ||
        {};

    const values = Object.values(attributes)
        .map(Number)
        .filter(value => Number.isFinite(value));

    if (!values.length) {
        return Number(
            player.overall ??
            player.ovr ??
            0
        ) || 0;
    }

    return Math.round(
        values.reduce(
            (sum, value) => sum + value,
            0
        ) / values.length
    );
}

// ============================================================
// FIGHT EXTRACTION
// ============================================================

function normalizeFight(fight, source = {}) {

    if (!fight || typeof fight !== "object") {
        return null;
    }

    return {
        id:
            fight.id ||
            fight.fightId ||
            `${source.id || "event"}-${Math.random().toString(36).slice(2, 8)}`,

        eventId:
            fight.eventId ||
            source.id ||
            null,

        date:
            fight.date ||
            source.date ||
            null,

        opponent:
            fight.opponent ||
            fight.opponentName ||
            fight.enemy ||
            fight.fighterB ||
            null,

        opponentId:
            fight.opponentId ||
            fight.opponent_id ||
            null,

        playerSide:
            fight.playerSide ||
            "A",

        status:
            fight.status ||
            "scheduled",

        result:
            fight.result ||
            null,

        method:
            fight.method ||
            null,

        round:
            fight.round ||
            null,

        time:
            fight.time ||
            null,

        promotion:
            fight.promotion ||
            source.promotion ||
            source.organization ||
            null,

        venue:
            fight.venue ||
            source.venue ||
            null,

        weightClass:
            fight.weightClass ||
            fight.division ||
            getPlayerWeightClass({
                player: fight.player || {}
            }),

        purse:
            Number(
                fight.purse ??
                fight.bonus ??
                0
            ) || 0,

        titleFight:
            Boolean(
                fight.titleFight ||
                fight.isTitleFight
            ),

        mainEvent:
            Boolean(
                fight.mainEvent ||
                fight.isMainEvent
            ),

        raw: fight
    };
}

function objectValues(value) {
    if (!value || typeof value !== "object") {
        return [];
    }

    return Array.isArray(value)
        ? value
        : Object.values(value);
}

function extractFights(database) {

    const candidates = [];

    const worldEvents = getEvents(database);

    objectValues(worldEvents).forEach(event => {

        if (!event || typeof event !== "object") {
            return;
        }

        const eventFights =
            event.fights ||
            event.card ||
            event.bouts ||
            [];

        objectValues(eventFights).forEach(fight => {

            const normalized =
                normalizeFight(fight, event);

            if (normalized) {
                candidates.push(normalized);
            }
        });
    });

    const career = getCareer(database);

    const careerFights =
        career.fights ||
        career.history ||
        [];

    objectValues(careerFights).forEach(fight => {

        const normalized =
            normalizeFight(fight);

        if (normalized) {
            candidates.push(normalized);
        }
    });

    const unique = new Map();

    candidates.forEach(fight => {
        if (!unique.has(fight.id)) {
            unique.set(fight.id, fight);
        }
    });

    return Array.from(unique.values());
}

function isUpcomingFight(fight) {

    const status = String(
        fight.status || ""
    ).toLowerCase();

    return [
        "scheduled",
        "upcoming",
        "pending",
        "booked",
        "confirmed"
    ].includes(status);
}

function isCompletedFight(fight) {

    const status = String(
        fight.status || ""
    ).toLowerCase();

    return [
        "completed",
        "finished",
        "done",
        "simulated"
    ].includes(status);
}

// ============================================================
// UPCOMING FIGHT
// ============================================================

function getUpcomingFight(database) {

    const fights = extractFights(database);

    const upcoming =
        fights.filter(isUpcomingFight);

    if (!upcoming.length) {
        return null;
    }

    return upcoming.sort((a, b) => {

        const dateA =
            a.date
                ? new Date(a.date).getTime()
                : Infinity;

        const dateB =
            b.date
                ? new Date(b.date).getTime()
                : Infinity;

        return dateA - dateB;

    })[0];
}

// ============================================================
// OPPONENT
// ============================================================

function findOpponent(database, fight) {

    if (!fight) {
        return null;
    }

    const fighters = getFighters(database);

    if (
        fight.opponentId &&
        fighters[fight.opponentId]
    ) {
        return fighters[fight.opponentId];
    }

    const opponentName =
        String(fight.opponent || "")
            .toLowerCase()
            .trim();

    if (!opponentName) {
        return null;
    }

    return objectValues(fighters)
        .find(fighter => {

            const name = String(
                fighter?.name ||
                fighter?.fullName ||
                ""
            )
                .toLowerCase()
                .trim();

            return name === opponentName;
        }) || null;
}

function getOpponentName(database, fight) {

    const opponent =
        findOpponent(database, fight);

    return (
        opponent?.name ||
        opponent?.fullName ||
        fight?.opponent ||
        "Adversário"
    );
}

function getOpponentOverall(database, fight) {

    const opponent =
        findOpponent(database, fight);

    if (!opponent) {
        return "—";
    }

    const attributes =
        opponent.attributes || {};

    const values = Object.values(attributes)
        .map(Number)
        .filter(value => Number.isFinite(value));

    if (!values.length) {

        return Number(
            opponent.overall ??
            opponent.ovr ??
            0
        ) || "—";
    }

    return Math.round(
        values.reduce(
            (sum, value) => sum + value,
            0
        ) / values.length
    );
}

// ============================================================
// FIGHT DISPLAY
// ============================================================

function formatFightDate(date) {

    if (!date) {
        return "Data a definir";
    }

    const parsed =
        new Date(date);

    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {
        return String(date);
    }

    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    ).format(parsed);
}

function getFightStatusLabel(fight) {

    if (!fight) {
        return "Sem luta";
    }

    if (isCompletedFight(fight)) {
        return "Finalizada";
    }

    if (isUpcomingFight(fight)) {
        return "Agendada";
    }

    return "Pendente";
}

function getFightStatusClass(fight) {

    if (isCompletedFight(fight)) {
        return "completed";
    }

    if (isUpcomingFight(fight)) {
        return "upcoming";
    }

    return "pending";
}

// ============================================================
// RENDER — HEADER
// ============================================================

function renderHeader(database) {

    const record =
        getPlayerRecord(database);

    return `
        <section class="fights-header">

            <div>

                <span class="fights-eyebrow">
                    MMA
                </span>

                <h1>Minhas Lutas</h1>

                <p>
                    Acompanhe suas próximas lutas,
                    adversários, resultados e histórico.
                </p>

            </div>

            <div class="fighter-record">

                <span>Cartel</span>

                <strong>
                    ${record.wins}-${record.losses}-${record.draws}
                </strong>

                <small>
                    ${escapeHTML(
                        getPlayerWeightClass(database)
                    )}
                </small>

            </div>

        </section>
    `;
}

// ============================================================
// RENDER — NEXT FIGHT
// ============================================================

function renderNextFight(database) {

    const fight =
        getUpcomingFight(database);

    if (!fight) {

        return `
            <section class="fight-feature-card empty">

                <div class="section-heading">
                    <div>
                        <span class="section-kicker">
                            PRÓXIMA LUTA
                        </span>

                        <h2>Nenhuma luta marcada</h2>
                    </div>
                </div>

                <p>
                    Você ainda não possui uma luta confirmada.
                    Continue treinando e acompanhe novas oportunidades.
                </p>

                <button
                    type="button"
                    class="fight-action"
                    data-fight-action="find-opponent"
                >
                    Procurar oportunidade
                </button>

            </section>
        `;
    }

    const opponentName =
        getOpponentName(database, fight);

    const opponentOverall =
        getOpponentOverall(database, fight);

    return `
        <section class="fight-feature-card">

            <div class="section-heading">

                <div>
                    <span class="section-kicker">
                        PRÓXIMA LUTA
                    </span>

                    <h2>
                        ${escapeHTML(
                            fight.promotion ||
                            "Evento"
                        )}
                    </h2>
                </div>

                <span class="
                    fight-status
                    ${getFightStatusClass(fight)}
                ">
                    ${escapeHTML(
                        getFightStatusLabel(fight)
                    )}
                </span>

            </div>

            <div class="fight-matchup">

                <div class="fighter-side player-side">

                    <div class="fighter-avatar">
                        👤
                    </div>

                    <span>VOCÊ</span>

                    <strong>
                        ${escapeHTML(
                            getPlayerName(database)
                        )}
                    </strong>

                    <small>
                        OVR ${getPlayerOverall(database)}
                    </small>

                </div>

                <div class="fight-vs">
                    <span>VS</span>
                </div>

                <div class="fighter-side opponent-side">

                    <div class="fighter-avatar">
                        🥊
                    </div>

                    <span>ADVERSÁRIO</span>

                    <strong>
                        ${escapeHTML(opponentName)}
                    </strong>

                    <small>
                        OVR ${escapeHTML(
                            opponentOverall
                        )}
                    </small>

                </div>

            </div>

            <div class="fight-details">

                <div>
                    <span>Data</span>
                    <strong>
                        ${escapeHTML(
                            formatFightDate(fight.date)
                        )}
                    </strong>
                </div>

                <div>
                    <span>Categoria</span>
                    <strong>
                        ${escapeHTML(
                            fight.weightClass ||
                            getPlayerWeightClass(database)
                        )}
                    </strong>
                </div>

                <div>
                    <span>Local</span>
                    <strong>
                        ${escapeHTML(
                            fight.venue ||
                            "A definir"
                        )}
                    </strong>
                </div>

                <div>
                    <span>Bolsa</span>
                    <strong>
                        ${formatMoney(fight.purse)}
                    </strong>
                </div>

            </div>

            ${
                fight.titleFight
                    ? `
                        <div class="title-fight-banner">
                            🏆 DISPUTA DE TÍTULO
                        </div>
                    `
                    : ""
            }

            <div class="fight-actions">

                <button
                    type="button"
                    class="fight-action primary"
                    data-fight-action="prepare"
                >
                    Preparar para luta
                </button>

                <button
                    type="button"
                    class="fight-action"
                    data-fight-action="gameplan"
                >
                    Gameplan
                </button>

                <button
                    type="button"
                    class="fight-action"
                    data-fight-action="details"
                >
                    Detalhes
                </button>

            </div>

        </section>
    `;
}

// ============================================================
// RENDER — UPCOMING LIST
// ============================================================

function renderUpcomingFights(database) {

    const fights =
        extractFights(database)
            .filter(isUpcomingFight)
            .sort((a, b) => {

                const dateA =
                    a.date
                        ? new Date(a.date).getTime()
                        : Infinity;

                const dateB =
                    b.date
                        ? new Date(b.date).getTime()
                        : Infinity;

                return dateA - dateB;
            });

    const nextFight =
        getUpcomingFight(database);

    const remaining =
        fights.filter(
            fight => fight.id !== nextFight?.id
        );

    return `
        <section class="fights-card">

            <div class="section-heading">

                <div>
                    <span class="section-kicker">
                        CALENDÁRIO
                    </span>

                    <h2>Próximas lutas</h2>
                </div>

                <span class="section-count">
                    ${remaining.length}
                </span>

            </div>

            ${
                remaining.length
                    ? `
                        <div class="fight-list">

                            ${remaining.map(fight => `
                                <div class="fight-row">

                                    <div class="fight-row-date">
                                        ${escapeHTML(
                                            formatFightDate(
                                                fight.date
                                            )
                                        )}
                                    </div>

                                    <div class="fight-row-main">

                                        <strong>
                                            ${escapeHTML(
                                                getOpponentName(
                                                    database,
                                                    fight
                                                )
                                            )}
                                        </strong>

                                        <small>
                                            ${
                                                escapeHTML(
                                                    fight.promotion ||
                                                    "Evento"
                                                )
                                            }
                                            •
                                            ${
                                                escapeHTML(
                                                    fight.weightClass ||
                                                    getPlayerWeightClass(database)
                                                )
                                            }
                                        </small>

                                    </div>

                                    <span class="
                                        fight-status
                                        ${getFightStatusClass(fight)}
                                    ">
                                        ${escapeHTML(
                                            getFightStatusLabel(fight)
                                        )}
                                    </span>

                                </div>
                            `).join("")}

                        </div>
                    `
                    : `
                        <div class="empty-fights">
                            Nenhuma outra luta está agendada.
                        </div>
                    `
            }

        </section>
    `;
}

// ============================================================
// RENDER — RECENT RESULTS
// ============================================================

function getRecentResults(database) {

    return extractFights(database)
        .filter(isCompletedFight)
        .sort((a, b) => {

            const dateA =
                a.date
                    ? new Date(a.date).getTime()
                    : 0;

            const dateB =
                b.date
                    ? new Date(b.date).getTime()
                    : 0;

            return dateB - dateA;

        })
        .slice(0, 8);
}

function getResultLabel(fight) {

    const result =
        String(
            fight.result || ""
        ).toLowerCase();

    if (
        [
            "win",
            "won",
            "victory",
            "vitoria",
            "vitória"
        ].includes(result)
    ) {
        return "VITÓRIA";
    }

    if (
        [
            "loss",
            "lost",
            "defeat",
            "derrota"
        ].includes(result)
    ) {
        return "DERROTA";
    }

    if (
        [
            "draw",
            "empate"
        ].includes(result)
    ) {
        return "EMPATE";
    }

    if (
        [
            "nc",
            "no_contest"
        ].includes(result)
    ) {
        return "NO CONTEST";
    }

    return "RESULTADO";
}

function getResultClass(fight) {

    const label =
        getResultLabel(fight);

    if (label === "VITÓRIA") {
        return "win";
    }

    if (label === "DERROTA") {
        return "loss";
    }

    if (label === "EMPATE") {
        return "draw";
    }

    if (label === "NO CONTEST") {
        return "nc";
    }

    return "neutral";
}

function renderRecentResults(database) {

    const results =
        getRecentResults(database);

    return `
        <section class="fights-card">

            <div class="section-heading">

                <div>
                    <span class="section-kicker">
                        HISTÓRICO
                    </span>

                    <h2>Resultados recentes</h2>
                </div>

                <span class="section-count">
                    ${formatNumber(
                        extractFights(database)
                            .filter(isCompletedFight)
                            .length
                    )}
                </span>

            </div>

            ${
                results.length
                    ? `
                        <div class="results-list">

                            ${results.map(fight => `

                                <div class="result-row">

                                    <div class="
                                        result-indicator
                                        ${getResultClass(fight)}
                                    ">
                                        ${escapeHTML(
                                            getResultLabel(fight)
                                        )}
                                    </div>

                                    <div class="result-main">

                                        <strong>
                                            vs.
                                            ${escapeHTML(
                                                getOpponentName(
                                                    database,
                                                    fight
                                                )
                                            )}
                                        </strong>

                                        <small>
                                            ${
                                                escapeHTML(
                                                    fight.promotion ||
                                                    "Evento"
                                                )
                                            }
                                            •
                                            ${
                                                escapeHTML(
                                                    fight.method ||
                                                    "Método não informado"
                                                )
                                            }
                                        </small>

                                    </div>

                                    <div class="result-date">

                                        ${escapeHTML(
                                            formatFightDate(
                                                fight.date
                                            )
                                        )}

                                    </div>

                                </div>

                            `).join("")}

                        </div>
                    `
                    : `
                        <div class="empty-fights">
                            Nenhuma luta finalizada ainda.
                        </div>
                    `
            }

        </section>
    `;
}

// ============================================================
// RENDER — STATS
// ============================================================

function renderFightStats(database) {

    const fights =
        extractFights(database);

    const completed =
        fights.filter(isCompletedFight);

    const upcoming =
        fights.filter(isUpcomingFight);

    const wins =
        completed.filter(
            fight =>
                getResultLabel(fight) === "VITÓRIA"
        ).length;

    const losses =
        completed.filter(
            fight =>
                getResultLabel(fight) === "DERROTA"
        ).length;

    return `
        <section class="fight-stats-grid">

            <div class="fight-stat">
                <span>Lutas totais</span>
                <strong>${fights.length}</strong>
            </div>

            <div class="fight-stat">
                <span>Vitórias</span>
                <strong>${wins}</strong>
            </div>

            <div class="fight-stat">
                <span>Derrotas</span>
                <strong>${losses}</strong>
            </div>

            <div class="fight-stat">
                <span>Próximas</span>
                <strong>${upcoming.length}</strong>
            </div>

        </section>
    `;
}

// ============================================================
// RENDER MAIN
// ============================================================

function render(database = getDatabase()) {

    fightsScreenState.database =
        database;

    const html = `
        <div class="fights-screen">

            ${renderHeader(database)}

            ${renderStats(database)}

            ${renderNextFight(database)}

            <div class="fights-columns">

                <div class="fights-main-column">
                    ${renderUpcomingFights(database)}
                    ${renderRecentResults(database)}
                </div>

                <aside class="fights-side-column">

                    <section class="fights-card fighter-summary">

                        <div class="section-heading">

                            <div>
                                <span class="section-kicker">
                                    SEU LUTADOR
                                </span>

                                <h2>
                                    ${escapeHTML(
                                        getPlayerName(database)
                                    )}
                                </h2>
                            </div>

                        </div>

                        <div class="fighter-summary-grid">

                            <div>
                                <span>OVR</span>
                                <strong>
                                    ${getPlayerOverall(database)}
                                </strong>
                            </div>

                            <div>
                                <span>Peso</span>
                                <strong>
                                    ${escapeHTML(
                                        getPlayerWeightClass(database)
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Cartel</span>
                                <strong>
                                    ${
                                        getPlayerRecord(database).wins
                                    }-
                                    ${
                                        getPlayerRecord(database).losses
                                    }-
                                    ${
                                        getPlayerRecord(database).draws
                                    }
                                </strong>
                            </div>

                        </div>

                    </section>

                </aside>

            </div>

        </div>
    `;

    fightsScreenState.lastRender = {
        timestamp: Date.now(),
        html
    };

    return html;
}

// ============================================================
// DOM
// ============================================================

function getContentElement() {
    return document.getElementById(
        "mma-life-content"
    );
}

function renderToDOM(database = getDatabase()) {

    const content =
        getContentElement();

    if (!content) {
        return false;
    }

    content.innerHTML =
        render(database);

    bindEvents();

    return true;
}

// ============================================================
// ACTIONS
// ============================================================

function showMessage(message) {

    if (
        window.gameUIAPI &&
        typeof window.gameUIAPI.toast === "function"
    ) {
        window.gameUIAPI.toast(message);
        return;
    }

    if (
        window.lifeUIAPI &&
        typeof window.lifeUIAPI.toast === "function"
    ) {
        window.lifeUIAPI.toast(message);
        return;
    }

    console.info(
        `[FightsScreen] ${message}`
    );
}

function handleFightAction(action) {

    const database =
        getDatabase();

    switch (action) {

        case "prepare":

            showMessage(
                "Preparação para a luta selecionada."
            );

            if (
                window.lifeRouterAPI &&
                typeof window.lifeRouterAPI.navigate === "function"
            ) {
                window.lifeRouterAPI.navigate(
                    "training"
                );
            }

            break;

        case "gameplan":

            showMessage(
                "Gameplan será configurado no sistema de luta."
            );

            break;

        case "details":

            showMessage(
                "Detalhes completos da luta serão exibidos aqui."
            );

            break;

        case "find-opponent":

            showMessage(
                "Buscando uma nova oportunidade de luta."
            );

            break;

        default:

            showMessage(
                "Ação de luta não reconhecida."
            );
    }

    fightsScreenState.database =
        database;
}

// ============================================================
// EVENTS
// ============================================================

function bindEvents() {

    const actionButtons =
        document.querySelectorAll(
            "[data-fight-action]"
        );

    actionButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                handleFightAction(
                    button.dataset.fightAction
                );

            }
        );

    });
}

// ============================================================
// STYLES
// ============================================================

function injectStyles() {

    if (
        document.getElementById(
            "mma-life-fights-screen-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement("style");

    style.id =
        "mma-life-fights-screen-styles";

    style.textContent = `

        .fights-screen {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 24px;
            box-sizing: border-box;
        }

        .fights-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 24px;
            margin-bottom: 20px;
        }

        .fights-eyebrow,
        .section-kicker {
            font-size: 11px;
            font-weight: 800;
            letter-spacing: .12em;
            text-transform: uppercase;
            opacity: .6;
        }

        .fights-header h1 {
            margin: 4px 0 6px;
            font-size: 32px;
        }

        .fights-header p {
            margin: 0;
            opacity: .7;
            line-height: 1.5;
            max-width: 720px;
        }

        .fighter-record {
            min-width: 150px;
            padding: 18px;
            border-radius: 16px;
            border: 1px solid rgba(127,127,127,.18);
            text-align: center;
        }

        .fighter-record span,
        .fighter-record small {
            display: block;
            opacity: .6;
        }

        .fighter-record strong {
            display: block;
            margin: 4px 0;
            font-size: 28px;
        }

        .fight-stats-grid {
            display: grid;
            grid-template-columns:
                repeat(4, minmax(0, 1fr));
            gap: 12px;
            margin-bottom: 18px;
        }

        .fight-stat {
            padding: 16px;
            border: 1px solid rgba(127,127,127,.18);
            border-radius: 14px;
        }

        .fight-stat span {
            display: block;
            font-size: 12px;
            opacity: .6;
        }

        .fight-stat strong {
            display: block;
            margin-top: 6px;
            font-size: 24px;
        }

        .fight-feature-card,
        .fights-card {
            border: 1px solid rgba(127,127,127,.18);
            border-radius: 16px;
            padding: 18px;
            box-sizing: border-box;
        }

        .fight-feature-card {
            margin-bottom: 18px;
        }

        .fight-feature-card.empty {
            text-align: center;
        }

        .section-heading {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }

        .section-heading h2 {
            margin: 4px 0 0;
            font-size: 20px;
        }

        .section-count {
            padding: 5px 9px;
            border-radius: 999px;
            background: rgba(127,127,127,.12);
            font-size: 11px;
            font-weight: 700;
        }

        .fight-status {
            display: inline-flex;
            align-items: center;
            padding: 5px 9px;
            border-radius: 999px;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
        }

        .fight-status.upcoming {
            background: rgba(60,140,255,.12);
        }

        .fight-status.completed {
            background: rgba(60,180,100,.12);
        }

        .fight-status.pending {
            background: rgba(180,140,60,.12);
        }

        .fight-matchup {
            display: grid;
            grid-template-columns:
                1fr auto 1fr;
            align-items: center;
            gap: 20px;
            padding: 16px 0 22px;
        }

        .fighter-side {
            text-align: center;
        }

        .fighter-avatar {
            width: 76px;
            height: 76px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 10px;
            border-radius: 50%;
            background: rgba(127,127,127,.1);
            font-size: 32px;
        }

        .fighter-side > span {
            display: block;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: .08em;
            opacity: .55;
        }

        .fighter-side strong {
            display: block;
            margin-top: 5px;
            font-size: 18px;
        }

        .fighter-side small {
            display: block;
            margin-top: 4px;
            opacity: .6;
        }

        .fight-vs {
            width: 44px;
            height: 44px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            background: rgba(127,127,127,.1);
            font-weight: 900;
            font-size: 13px;
        }

        .fight-details {
            display: grid;
            grid-template-columns:
                repeat(4, minmax(0, 1fr));
            gap: 10px;
            padding: 14px 0;
            border-top: 1px solid rgba(127,127,127,.12);
            border-bottom: 1px solid rgba(127,127,127,.12);
        }

        .fight-details div {
            padding: 10px;
            border-radius: 10px;
            background: rgba(127,127,127,.06);
        }

        .fight-details span {
            display: block;
            font-size: 10px;
            opacity: .55;
        }

        .fight-details strong {
            display: block;
            margin-top: 4px;
            font-size: 13px;
        }

        .title-fight-banner {
            margin-top: 14px;
            padding: 11px;
            border-radius: 10px;
            text-align: center;
            font-size: 12px;
            font-weight: 800;
            background: rgba(180,140,60,.12);
        }

        .fight-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 16px;
        }

        .fight-action {
            border: 1px solid rgba(127,127,127,.2);
            border-radius: 10px;
            padding: 10px 14px;
            background: transparent;
            color: inherit;
            cursor: pointer;
            font-weight: 700;
        }

        .fight-action.primary {
            background: currentColor;
            color: Canvas;
        }

        .fights-columns {
            display: grid;
            grid-template-columns:
                minmax(0, 2fr)
                minmax(260px, 1fr);
            gap: 18px;
        }

        .fights-main-column,
        .fights-side-column {
            display: flex;
            flex-direction: column;
            gap: 18px;
        }

        .fight-list,
        .results-list {
            display: flex;
            flex-direction: column;
        }

        .fight-row,
        .result-row {
            display: grid;
            align-items: center;
            gap: 12px;
            padding: 13px 0;
            border-bottom: 1px solid rgba(127,127,127,.12);
        }

        .fight-row {
            grid-template-columns:
                130px
                1fr
                auto;
        }

        .result-row {
            grid-template-columns:
                100px
                1fr
                120px;
        }

        .fight-row:last-child,
        .result-row:last-child {
            border-bottom: none;
        }

        .fight-row-date,
        .result-date {
            font-size: 11px;
            opacity: .6;
        }

        .fight-row-main strong,
        .fight-row-main small,
        .result-main strong,
        .result-main small {
            display: block;
        }

        .fight-row-main small,
        .result-main small {
            margin-top: 4px;
            opacity: .55;
            font-size: 11px;
        }

        .result-indicator {
            padding: 7px 8px;
            border-radius: 8px;
            text-align: center;
            font-size: 10px;
            font-weight: 800;
        }

        .result-indicator.win {
            background: rgba(60,180,100,.14);
        }

        .result-indicator.loss {
            background: rgba(220,70,70,.14);
        }

        .result-indicator.draw {
            background: rgba(180,140,60,.14);
        }

        .result-indicator.nc {
            background: rgba(120,120,120,.14);
        }

        .result-date {
            text-align: right;
        }

        .fighter-summary-grid {
            display: grid;
            grid-template-columns:
                repeat(3, 1fr);
            gap: 8px;
        }

        .fighter-summary-grid div {
            padding: 12px;
            border-radius: 10px;
            background: rgba(127,127,127,.06);
        }

        .fighter-summary-grid span {
            display: block;
            font-size: 10px;
            opacity: .55;
        }

        .fighter-summary-grid strong {
            display: block;
            margin-top: 5px;
            font-size: 14px;
        }

        .empty-fights {
            padding: 20px 0;
            text-align: center;
            opacity: .55;
            font-size: 13px;
        }

        @media (max-width: 900px) {

            .fights-columns {
                grid-template-columns: 1fr;
            }

            .fight-details {
                grid-template-columns:
                    repeat(2, minmax(0, 1fr));
            }

        }

        @media (max-width: 650px) {

            .fights-screen {
                padding: 16px;
            }

            .fights-header {
                flex-direction: column;
                align-items: flex-start;
            }

            .fighter-record {
                width: 100%;
                box-sizing: border-box;
            }

            .fight-stats-grid {
                grid-template-columns:
                    repeat(2, minmax(0, 1fr));
            }

            .fight-matchup {
                gap: 8px;
            }

            .fighter-avatar {
                width: 60px;
                height: 60px;
                font-size: 26px;
            }

            .fighter-side strong {
                font-size: 14px;
            }

            .fight-details {
                grid-template-columns: 1fr;
            }

            .fight-row {
                grid-template-columns: 1fr;
                gap: 6px;
            }

            .result-row {
                grid-template-columns:
                    90px
                    1fr;
            }

            .result-date {
                display: none;
            }

            .fighter-summary-grid {
                grid-template-columns: 1fr;
            }

        }

    `;

    document.head.appendChild(style);
}

// ============================================================
// PUBLIC API
// ============================================================

function initialize(database = getDatabase()) {

    fightsScreenState.database =
        database;

    injectStyles();

    fightsScreenState.initialized =
        true;

    renderToDOM(database);

    return fightsScreenAPI;
}

function refresh(database = getDatabase()) {

    fightsScreenState.database =
        database;

    injectStyles();

    renderToDOM(database);

    return fightsScreenState.lastRender;
}

function getState() {
    return clone(
        fightsScreenState
    );
}

function snapshot(database = getDatabase()) {

    return {
        version:
            FIGHTS_SCREEN_VERSION,

        timestamp:
            Date.now(),

        player:
            clone(getPlayer(database)),

        career:
            clone(getCareer(database)),

        fights:
            clone(extractFights(database)),

        upcomingFight:
            clone(getUpcomingFight(database))
    };
}

function validate(database = getDatabase()) {

    const errors = [];

    if (!database) {
        errors.push(
            "Database não encontrada."
        );
    }

    if (
        !database?.player ||
        typeof database.player !== "object"
    ) {
        errors.push(
            "Jogador não encontrado."
        );
    }

    return {
        valid:
            errors.length === 0,

        errors
    };
}

// ============================================================
// GLOBAL API
// ============================================================

const fightsScreenAPI = {

    version:
        FIGHTS_SCREEN_VERSION,

    initialize,
    refresh,

    render,
    renderToDOM,

    getState,
    snapshot,
    validate,

    getPlayerRecord,
    getPlayerWeightClass,
    getPlayerOverall,

    extractFights,
    getUpcomingFight,
    getRecentResults,

    findOpponent,
    getOpponentName,
    getOpponentOverall,

    handleFightAction
};

if (typeof window !== "undefined") {

    window.fightsScreenAPI =
        fightsScreenAPI;

    window.MMA_LIFE_FIGHTS_SCREEN =
        fightsScreenAPI;

    window.dispatchEvent(
        new CustomEvent(
            "mma-life-fights-screen-ready",
            {
                detail:
                    fightsScreenAPI
            }
        )
    );
}

export {
    FIGHTS_SCREEN_VERSION,
    fightsScreenAPI
};

export default fightsScreenAPI;
