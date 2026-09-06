// ============================================================
// MMA LIFE DYNASTY — TRAINING SCREEN
// js/ui/trainingScreen.js
// ============================================================

const TRAINING_SCREEN_VERSION = 1;

const trainingScreenState = {
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
    return database || trainingScreenState.database || window.MMA_LIFE_DATABASE || {};
}

function getPlayer(database) {
    return database?.player || {};
}

function getTraining(database) {
    return database?.training || {};
}

function getHealth(database) {
    return database?.health || {};
}

function getCamp(database) {
    return getTraining(database).camp || null;
}

function getWeight(database) {
    const player = getPlayer(database);
    const training = getTraining(database);

    return Number(
        training.weight ??
        player.weight ??
        player.physical?.weight ??
        0
    );
}

function getEnergy(database) {
    const value = Number(getTraining(database).energy);
    return Number.isFinite(value) ? value : 0;
}

function getFatigue(database) {
    const value = Number(getTraining(database).fatigue);
    return Number.isFinite(value) ? value : 0;
}

function getHealthValue(database) {
    const training = getTraining(database);
    const health = getHealth(database);

    const value = Number(
        health.overall ??
        health.value ??
        health.condition ??
        training.health ??
        100
    );

    return Number.isFinite(value) ? value : 100;
}

function getSessions(database) {
    const sessions = getTraining(database).sessions;

    if (Array.isArray(sessions)) {
        return sessions;
    }

    return [];
}

function getWeeklyPlan(database) {
    return getTraining(database).weeklyPlan || null;
}

function getWeightCut(database) {
    return getTraining(database).weightCut || null;
}

function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, Number(value) || 0));
}

function formatNumber(value) {
    return new Intl.NumberFormat("pt-BR").format(
        Number(value) || 0
    );
}

function formatWeight(value) {
    const number = Number(value);

    if (!Number.isFinite(number) || number <= 0) {
        return "—";
    }

    return `${number.toFixed(1).replace(".", ",")} kg`;
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
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
// TRAINING DATA
// ============================================================

const TRAINING_TYPES = [
    {
        id: "striking",
        name: "Striking",
        description: "Boxe, kickboxing, muay thai e trabalho de distância.",
        icon: "🥊"
    },
    {
        id: "grappling",
        name: "Grappling",
        description: "Quedas, wrestling, controle e transições.",
        icon: "🤼"
    },
    {
        id: "bjj",
        name: "Jiu-Jitsu",
        description: "Solo, finalizações, defesa e posições.",
        icon: "🥋"
    },
    {
        id: "conditioning",
        name: "Condicionamento",
        description: "Cardio, resistência e capacidade de luta.",
        icon: "🏃"
    },
    {
        id: "strength",
        name: "Força",
        description: "Força máxima, potência e explosão.",
        icon: "🏋️"
    },
    {
        id: "speed",
        name: "Velocidade",
        description: "Velocidade, reflexos e explosão.",
        icon: "⚡"
    },
    {
        id: "technique",
        name: "Técnica MMA",
        description: "Integração das áreas específicas do MMA.",
        icon: "🥊"
    },
    {
        id: "recovery",
        name: "Recuperação",
        description: "Reduz fadiga e ajuda na recuperação.",
        icon: "🛌"
    }
];

const TRAINING_LEVELS = {
    light: {
        id: "light",
        name: "Leve",
        energy: 8,
        fatigue: 4,
        intensity: 40
    },
    moderate: {
        id: "moderate",
        name: "Moderado",
        energy: 15,
        fatigue: 8,
        intensity: 60
    },
    hard: {
        id: "hard",
        name: "Forte",
        energy: 24,
        fatigue: 14,
        intensity: 80
    },
    extreme: {
        id: "extreme",
        name: "Extremo",
        energy: 35,
        fatigue: 22,
        intensity: 100
    }
};

// ============================================================
// DERIVED DATA
// ============================================================

function getTrainingCondition(database) {
    const energy = clamp(getEnergy(database));
    const fatigue = clamp(getFatigue(database));
    const health = clamp(getHealthValue(database));

    return Math.round(
        (energy * 0.35) +
        ((100 - fatigue) * 0.30) +
        (health * 0.35)
    );
}

function getConditionLabel(value) {
    if (value >= 85) return "Excelente";
    if (value >= 70) return "Muito boa";
    if (value >= 55) return "Boa";
    if (value >= 40) return "Regular";
    if (value >= 25) return "Ruim";

    return "Crítica";
}

function getEnergyLabel(value) {
    if (value >= 80) return "Alta";
    if (value >= 60) return "Boa";
    if (value >= 40) return "Moderada";
    if (value >= 20) return "Baixa";

    return "Muito baixa";
}

function getFatigueLabel(value) {
    if (value <= 15) return "Muito baixa";
    if (value <= 35) return "Baixa";
    if (value <= 55) return "Moderada";
    if (value <= 75) return "Alta";

    return "Extrema";
}

function getHealthLabel(value) {
    if (value >= 90) return "Excelente";
    if (value >= 75) return "Boa";
    if (value >= 60) return "Regular";
    if (value >= 40) return "Ruim";

    return "Crítica";
}

// ============================================================
// CAMP
// ============================================================

function getCampStatus(database) {
    const camp = getCamp(database);

    if (!camp) {
        return {
            active: false,
            name: "Sem camp ativo",
            progress: 0,
            weeksRemaining: 0
        };
    }

    const progress = clamp(
        camp.progress ??
        camp.completion ??
        camp.percent ??
        0
    );

    const weeksRemaining = Number(
        camp.weeksRemaining ??
        camp.remainingWeeks ??
        camp.durationRemaining ??
        0
    );

    return {
        active: Boolean(camp.active ?? true),
        name: camp.name || "Camp de luta",
        progress,
        weeksRemaining: Number.isFinite(weeksRemaining)
            ? weeksRemaining
            : 0
    };
}

// ============================================================
// WEEKLY PLAN
// ============================================================

function getPlanDays(database) {
    const plan = getWeeklyPlan(database);

    if (!plan) {
        return [];
    }

    if (Array.isArray(plan)) {
        return plan;
    }

    if (Array.isArray(plan.days)) {
        return plan.days;
    }

    if (Array.isArray(plan.sessions)) {
        return plan.sessions;
    }

    return [];
}

function normalizePlanDay(day, index) {
    if (typeof day === "string") {
        return {
            day: index + 1,
            name: day,
            sessions: []
        };
    }

    const sessions = Array.isArray(day?.sessions)
        ? day.sessions
        : [];

    return {
        day: day?.day ?? day?.weekday ?? index + 1,
        name:
            day?.name ||
            day?.label ||
            `Dia ${index + 1}`,
        sessions
    };
}

// ============================================================
// SESSION HISTORY
// ============================================================

function getRecentSessions(database, limit = 8) {
    return getSessions(database)
        .slice()
        .reverse()
        .slice(0, limit);
}

function getSessionName(session) {
    return (
        session?.name ||
        session?.type ||
        session?.trainingType ||
        session?.category ||
        "Treino"
    );
}

function getSessionIntensity(session) {
    const intensity = Number(
        session?.intensity ??
        session?.level ??
        0
    );

    if (!Number.isFinite(intensity)) {
        return "—";
    }

    if (intensity <= 40) return "Leve";
    if (intensity <= 60) return "Moderado";
    if (intensity <= 80) return "Forte";

    return "Extremo";
}

// ============================================================
// RENDER — HEADER
// ============================================================

function renderHeader(database) {
    const playerName = getPlayerName(database);
    const condition = getTrainingCondition(database);

    return `
        <section class="training-header">
            <div>
                <div class="training-eyebrow">PREPARAÇÃO</div>
                <h1>Treinamento</h1>
                <p>
                    Gerencie seus treinos, energia, fadiga,
                    recuperação e preparação para as próximas lutas.
                </p>
            </div>

            <div class="training-condition">
                <span>Condição</span>
                <strong>${condition}%</strong>
                <small>${escapeHTML(getConditionLabel(condition))}</small>
            </div>
        </section>
    `;
}

// ============================================================
// RENDER — RESOURCES
// ============================================================

function renderResources(database) {
    const energy = clamp(getEnergy(database));
    const fatigue = clamp(getFatigue(database));
    const health = clamp(getHealthValue(database));

    return `
        <section class="training-resources">

            <div class="training-resource-card">
                <div class="resource-top">
                    <span class="resource-icon">⚡</span>
                    <span>Energia</span>
                </div>

                <strong>${energy}</strong>

                <div class="resource-bar">
                    <div style="width:${energy}%"></div>
                </div>

                <small>${escapeHTML(getEnergyLabel(energy))}</small>
            </div>

            <div class="training-resource-card">
                <div class="resource-top">
                    <span class="resource-icon">😮‍💨</span>
                    <span>Fadiga</span>
                </div>

                <strong>${fatigue}</strong>

                <div class="resource-bar">
                    <div style="width:${fatigue}%"></div>
                </div>

                <small>${escapeHTML(getFatigueLabel(fatigue))}</small>
            </div>

            <div class="training-resource-card">
                <div class="resource-top">
                    <span class="resource-icon">❤️</span>
                    <span>Saúde</span>
                </div>

                <strong>${health}</strong>

                <div class="resource-bar">
                    <div style="width:${health}%"></div>
                </div>

                <small>${escapeHTML(getHealthLabel(health))}</small>
            </div>

        </section>
    `;
}

// ============================================================
// RENDER — WEIGHT
// ============================================================

function renderWeight(database) {
    const weight = getWeight(database);
    const weightCut = getWeightCut(database);

    const targetWeight = Number(
        weightCut?.targetWeight ??
        weightCut?.target ??
        weightCut?.goalWeight ??
        0
    );

    const difference =
        targetWeight > 0 && weight > 0
            ? weight - targetWeight
            : null;

    return `
        <section class="training-card weight-card">

            <div class="section-heading">
                <div>
                    <span class="section-kicker">PESO</span>
                    <h2>Controle de peso</h2>
                </div>
            </div>

            <div class="weight-main">

                <div class="weight-current">
                    <span>Peso atual</span>
                    <strong>${formatWeight(weight)}</strong>
                </div>

                ${
                    targetWeight > 0
                        ? `
                            <div class="weight-target">
                                <span>Meta</span>
                                <strong>${formatWeight(targetWeight)}</strong>
                            </div>

                            <div class="weight-difference">
                                <span>Diferença</span>
                                <strong>
                                    ${
                                        difference > 0
                                            ? `${difference.toFixed(1).replace(".", ",")} kg`
                                            : difference < 0
                                                ? `${Math.abs(difference).toFixed(1).replace(".", ",")} kg abaixo`
                                                : "Meta atingida"
                                    }
                                </strong>
                            </div>
                        `
                        : `
                            <div class="weight-target">
                                <span>Meta</span>
                                <strong>Não definida</strong>
                            </div>
                        `
                }

            </div>

        </section>
    `;
}

// ============================================================
// RENDER — CAMP
// ============================================================

function renderCamp(database) {
    const camp = getCampStatus(database);

    return `
        <section class="training-card">

            <div class="section-heading">
                <div>
                    <span class="section-kicker">CAMP</span>
                    <h2>Preparação para luta</h2>
                </div>

                <span class="status-pill ${camp.active ? "active" : ""}">
                    ${camp.active ? "Ativo" : "Inativo"}
                </span>
            </div>

            <div class="camp-content">

                <div class="camp-title">
                    <strong>${escapeHTML(camp.name)}</strong>

                    ${
                        camp.weeksRemaining > 0
                            ? `<span>${camp.weeksRemaining} semanas restantes</span>`
                            : ""
                    }
                </div>

                <div class="camp-progress">
                    <div style="width:${camp.progress}%"></div>
                </div>

                <div class="camp-footer">
                    <span>Progresso</span>
                    <strong>${camp.progress}%</strong>
                </div>

            </div>

        </section>
    `;
}

// ============================================================
// RENDER — TRAINING TYPES
// ============================================================

function renderTrainingTypes() {
    return `
        <section class="training-card">

            <div class="section-heading">
                <div>
                    <span class="section-kicker">TREINOS</span>
                    <h2>Áreas de treinamento</h2>
                </div>
            </div>

            <div class="training-types-grid">

                ${TRAINING_TYPES.map(type => `
                    <button
                        class="training-type"
                        type="button"
                        data-training-type="${escapeHTML(type.id)}"
                    >
                        <span class="training-type-icon">
                            ${type.icon}
                        </span>

                        <span class="training-type-content">
                            <strong>${escapeHTML(type.name)}</strong>
                            <small>${escapeHTML(type.description)}</small>
                        </span>
                    </button>
                `).join("")}

            </div>

        </section>
    `;
}

// ============================================================
// RENDER — INTENSITY
// ============================================================

function renderIntensity() {
    return `
        <section class="training-card">

            <div class="section-heading">
                <div>
                    <span class="section-kicker">INTENSIDADE</span>
                    <h2>Nível do treino</h2>
                </div>
            </div>

            <div class="intensity-grid">

                ${Object.values(TRAINING_LEVELS).map(level => `
                    <button
                        class="intensity-button"
                        type="button"
                        data-training-intensity="${level.id}"
                    >
                        <strong>${escapeHTML(level.name)}</strong>

                        <span>
                            ${level.energy} energia
                        </span>

                        <small>
                            +${level.fatigue} fadiga
                        </small>
                    </button>
                `).join("")}

            </div>

        </section>
    `;
}

// ============================================================
// RENDER — WEEKLY PLAN
// ============================================================

function renderWeeklyPlan(database) {
    const days = getPlanDays(database);

    if (!days.length) {
        return `
            <section class="training-card">

                <div class="section-heading">
                    <div>
                        <span class="section-kicker">SEMANA</span>
                        <h2>Plano semanal</h2>
                    </div>
                </div>

                <div class="empty-training">
                    Nenhum plano semanal definido.
                </div>

            </section>
        `;
    }

    return `
        <section class="training-card">

            <div class="section-heading">
                <div>
                    <span class="section-kicker">SEMANA</span>
                    <h2>Plano semanal</h2>
                </div>
            </div>

            <div class="weekly-plan">

                ${days.slice(0, 7).map((rawDay, index) => {

                    const day = normalizePlanDay(rawDay, index);

                    return `
                        <div class="weekly-day">

                            <div class="weekly-day-header">
                                <strong>${escapeHTML(day.name)}</strong>
                            </div>

                            <div class="weekly-day-sessions">

                                ${
                                    day.sessions.length
                                        ? day.sessions.map(session => `
                                            <span class="session-chip">
                                                ${escapeHTML(
                                                    typeof session === "string"
                                                        ? session
                                                        : getSessionName(session)
                                                )}
                                            </span>
                                        `).join("")
                                        : `<span class="empty-day">Descanso</span>`
                                }

                            </div>

                        </div>
                    `;
                }).join("")}

            </div>

        </section>
    `;
}

// ============================================================
// RENDER — RECENT SESSIONS
// ============================================================

function renderRecentSessions(database) {
    const sessions = getRecentSessions(database);

    return `
        <section class="training-card">

            <div class="section-heading">
                <div>
                    <span class="section-kicker">HISTÓRICO</span>
                    <h2>Treinos recentes</h2>
                </div>

                <span class="section-count">
                    ${formatNumber(getSessions(database).length)}
                </span>
            </div>

            ${
                sessions.length
                    ? `
                        <div class="sessions-list">

                            ${sessions.map(session => `
                                <div class="session-row">

                                    <div class="session-main">
                                        <strong>
                                            ${escapeHTML(getSessionName(session))}
                                        </strong>

                                        <small>
                                            ${escapeHTML(
                                                session?.date ||
                                                session?.day ||
                                                "Data não informada"
                                            )}
                                        </small>
                                    </div>

                                    <div class="session-meta">
                                        <span>
                                            ${escapeHTML(getSessionIntensity(session))}
                                        </span>
                                    </div>

                                </div>
                            `).join("")}

                        </div>
                    `
                    : `
                        <div class="empty-training">
                            Nenhum treino registrado ainda.
                        </div>
                    `
            }

        </section>
    `;
}

// ============================================================
// RENDER — MAIN
// ============================================================

function render(database = getDatabase()) {

    trainingScreenState.database = database;

    const content = `
        <div class="training-screen">

            ${renderHeader(database)}

            ${renderResources(database)}

            <div class="training-columns">

                <div class="training-main-column">

                    ${renderTrainingTypes()}

                    ${renderIntensity()}

                    ${renderWeeklyPlan(database)}

                    ${renderRecentSessions(database)}

                </div>

                <div class="training-side-column">

                    ${renderWeight(database)}

                    ${renderCamp(database)}

                </div>

            </div>

        </div>
    `;

    trainingScreenState.lastRender = {
        timestamp: Date.now(),
        html: content
    };

    return content;
}

// ============================================================
// DOM
// ============================================================

function getContentElement() {
    return document.getElementById("mma-life-content");
}

function renderToDOM(database = getDatabase()) {

    const content = getContentElement();

    if (!content) {
        return false;
    }

    content.innerHTML = render(database);

    bindEvents();

    return true;
}

// ============================================================
// EVENTS
// ============================================================

function showTrainingMessage(message) {

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

    console.info(`[Training] ${message}`);
}

function performTraining(type, intensity) {

    const database = getDatabase();

    const trainingAPI =
        window.trainingEngineAPI ||
        window.trainingAPI;

    if (!trainingAPI) {
        showTrainingMessage(
            "Sistema de treinamento ainda não está disponível."
        );
        return;
    }

    try {

        if (typeof trainingAPI.train === "function") {

            trainingAPI.train(
                database,
                type,
                intensity
            );

        } else if (typeof trainingAPI.performTraining === "function") {

            trainingAPI.performTraining(
                database,
                type,
                intensity
            );

        } else if (typeof trainingAPI.executeTraining === "function") {

            trainingAPI.executeTraining(
                database,
                type,
                intensity
            );

        } else {

            showTrainingMessage(
                "Ação de treinamento será ativada na integração do jogo."
            );

            return;
        }

        trainingScreenState.database = database;

        renderToDOM(database);

    } catch (error) {

        console.error(
            "[TrainingScreen] Erro ao executar treino:",
            error
        );

        showTrainingMessage(
            "Não foi possível executar esse treino."
        );
    }
}

function bindEvents() {

    const trainingButtons =
        document.querySelectorAll(
            "[data-training-type]"
        );

    trainingButtons.forEach(button => {

        button.addEventListener("click", () => {

            const type =
                button.dataset.trainingType;

            const currentIntensity =
                button.closest(".training-card")
                    ?.querySelector(
                        "[data-training-intensity].selected"
                    )
                    ?.dataset.trainingIntensity ||
                "moderate";

            performTraining(
                type,
                currentIntensity
            );
        });
    });

    const intensityButtons =
        document.querySelectorAll(
            "[data-training-intensity]"
        );

    intensityButtons.forEach(button => {

        button.addEventListener("click", () => {

            intensityButtons.forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");

            showTrainingMessage(
                `Intensidade selecionada: ${button.textContent.trim()}`
            );
        });
    });
}

// ============================================================
// STYLES
// ============================================================

function injectStyles() {

    if (
        document.getElementById(
            "mma-life-training-screen-styles"
        )
    ) {
        return;
    }

    const style = document.createElement("style");

    style.id =
        "mma-life-training-screen-styles";

    style.textContent = `

        .training-screen {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 24px;
            box-sizing: border-box;
        }

        .training-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 24px;
            margin-bottom: 24px;
        }

        .training-eyebrow,
        .section-kicker {
            font-size: 11px;
            font-weight: 800;
            letter-spacing: .12em;
            opacity: .6;
            text-transform: uppercase;
        }

        .training-header h1 {
            margin: 4px 0 6px;
            font-size: 32px;
        }

        .training-header p {
            margin: 0;
            max-width: 700px;
            opacity: .7;
            line-height: 1.5;
        }

        .training-condition {
            min-width: 150px;
            padding: 18px;
            border-radius: 16px;
            border: 1px solid rgba(127,127,127,.18);
            text-align: center;
        }

        .training-condition span,
        .training-condition small {
            display: block;
            opacity: .65;
        }

        .training-condition strong {
            display: block;
            font-size: 28px;
            margin: 4px 0;
        }

        .training-resources {
            display: grid;
            grid-template-columns:
                repeat(3, minmax(0, 1fr));
            gap: 14px;
            margin-bottom: 18px;
        }

        .training-resource-card,
        .training-card {
            border: 1px solid rgba(127,127,127,.18);
            border-radius: 16px;
            padding: 18px;
            box-sizing: border-box;
        }

        .resource-top {
            display: flex;
            gap: 8px;
            align-items: center;
            opacity: .75;
        }

        .resource-icon {
            font-size: 18px;
        }

        .training-resource-card > strong {
            display: block;
            font-size: 28px;
            margin: 8px 0;
        }

        .resource-bar,
        .camp-progress {
            height: 7px;
            overflow: hidden;
            border-radius: 999px;
            background: rgba(127,127,127,.16);
        }

        .resource-bar div,
        .camp-progress div {
            height: 100%;
            border-radius: inherit;
            background: currentColor;
        }

        .training-resource-card small {
            display: block;
            margin-top: 8px;
            opacity: .65;
        }

        .training-columns {
            display: grid;
            grid-template-columns:
                minmax(0, 2fr)
                minmax(280px, 1fr);
            gap: 18px;
        }

        .training-main-column,
        .training-side-column {
            display: flex;
            flex-direction: column;
            gap: 18px;
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

        .section-count,
        .status-pill {
            padding: 5px 9px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 700;
            background: rgba(127,127,127,.12);
        }

        .status-pill.active {
            background: rgba(60,180,100,.16);
        }

        .training-types-grid {
            display: grid;
            grid-template-columns:
                repeat(2, minmax(0, 1fr));
            gap: 10px;
        }

        .training-type,
        .intensity-button {
            border: 1px solid rgba(127,127,127,.18);
            background: transparent;
            color: inherit;
            border-radius: 12px;
            padding: 14px;
            cursor: pointer;
            text-align: left;
            transition:
                transform .15s ease,
                border-color .15s ease;
        }

        .training-type:hover,
        .intensity-button:hover {
            transform: translateY(-1px);
        }

        .training-type {
            display: flex;
            gap: 12px;
            align-items: flex-start;
        }

        .training-type-icon {
            font-size: 24px;
            line-height: 1;
        }

        .training-type-content {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .training-type-content strong {
            font-size: 14px;
        }

        .training-type-content small {
            opacity: .62;
            line-height: 1.35;
        }

        .intensity-grid {
            display: grid;
            grid-template-columns:
                repeat(4, minmax(0, 1fr));
            gap: 10px;
        }

        .intensity-button {
            text-align: center;
        }

        .intensity-button strong,
        .intensity-button span,
        .intensity-button small {
            display: block;
        }

        .intensity-button span {
            margin-top: 6px;
            font-size: 12px;
            opacity: .7;
        }

        .intensity-button small {
            margin-top: 3px;
            opacity: .55;
        }

        .intensity-button.selected {
            border-width: 2px;
        }

        .weekly-plan {
            display: grid;
            gap: 8px;
        }

        .weekly-day {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: center;
            padding: 12px;
            border-radius: 10px;
            background: rgba(127,127,127,.06);
        }

        .weekly-day-sessions {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            justify-content: flex-end;
        }

        .session-chip {
            padding: 5px 8px;
            border-radius: 999px;
            background: rgba(127,127,127,.12);
            font-size: 11px;
        }

        .empty-day,
        .empty-training {
            opacity: .55;
            font-size: 13px;
        }

        .sessions-list {
            display: flex;
            flex-direction: column;
        }

        .session-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding: 12px 0;
            border-bottom: 1px solid rgba(127,127,127,.12);
        }

        .session-row:last-child {
            border-bottom: none;
        }

        .session-main strong,
        .session-main small {
            display: block;
        }

        .session-main small {
            margin-top: 3px;
            opacity: .55;
        }

        .session-meta span {
            font-size: 11px;
            opacity: .65;
        }

        .weight-main {
            display: grid;
            grid-template-columns:
                repeat(3, minmax(0, 1fr));
            gap: 10px;
        }

        .weight-current,
        .weight-target,
        .weight-difference {
            padding: 12px;
            border-radius: 10px;
            background: rgba(127,127,127,.06);
        }

        .weight-current span,
        .weight-target span,
        .weight-difference span {
            display: block;
            font-size: 11px;
            opacity: .6;
        }

        .weight-current strong,
        .weight-target strong,
        .weight-difference strong {
            display: block;
            margin-top: 5px;
        }

        .camp-title {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 12px;
        }

        .camp-title span {
            font-size: 11px;
            opacity: .6;
        }

        .camp-footer {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
            font-size: 12px;
            opacity: .65;
        }

        @media (max-width: 900px) {

            .training-columns {
                grid-template-columns: 1fr;
            }

            .training-resources {
                grid-template-columns: 1fr;
            }

        }

        @media (max-width: 650px) {

            .training-screen {
                padding: 16px;
            }

            .training-header {
                align-items: flex-start;
                flex-direction: column;
            }

            .training-condition {
                width: 100%;
                box-sizing: border-box;
            }

            .training-types-grid,
            .intensity-grid {
                grid-template-columns: 1fr;
            }

            .weight-main {
                grid-template-columns: 1fr;
            }

            .weekly-day {
                align-items: flex-start;
                flex-direction: column;
            }

            .weekly-day-sessions {
                justify-content: flex-start;
            }

        }

    `;

    document.head.appendChild(style);
}

// ============================================================
// PUBLIC API
// ============================================================

function initialize(database = getDatabase()) {

    trainingScreenState.database = database;

    injectStyles();

    trainingScreenState.initialized = true;

    renderToDOM(database);

    return trainingScreenAPI;
}

function refresh(database = getDatabase()) {

    trainingScreenState.database = database;

    injectStyles();

    renderToDOM(database);

    return trainingScreenState.lastRender;
}

function getState() {
    return clone(trainingScreenState);
}

function snapshot(database = getDatabase()) {

    return {
        version: TRAINING_SCREEN_VERSION,
        timestamp: Date.now(),
        training: clone(getTraining(database)),
        health: clone(getHealth(database)),
        player: clone(getPlayer(database))
    };
}

function validate(database = getDatabase()) {

    const errors = [];
    const training = getTraining(database);

    if (!database) {
        errors.push("Database não encontrada.");
    }

    if (!training || typeof training !== "object") {
        errors.push("Estado de treinamento inválido.");
    }

    const energy = getEnergy(database);
    const fatigue = getFatigue(database);

    if (energy < 0 || energy > 100) {
        errors.push("Energia fora do intervalo 0–100.");
    }

    if (fatigue < 0 || fatigue > 100) {
        errors.push("Fadiga fora do intervalo 0–100.");
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// ============================================================
// GLOBAL API
// ============================================================

const trainingScreenAPI = {
    version: TRAINING_SCREEN_VERSION,

    initialize,
    refresh,
    render,
    renderToDOM,

    getState,
    snapshot,
    validate,

    getTraining,
    getEnergy,
    getFatigue,
    getHealthValue,
    getWeight,
    getCampStatus,
    getTrainingCondition,

    performTraining,

    TRAINING_TYPES,
    TRAINING_LEVELS
};

if (typeof window !== "undefined") {

    window.trainingScreenAPI =
        trainingScreenAPI;

    window.MMA_LIFE_TRAINING_SCREEN =
        trainingScreenAPI;

    window.dispatchEvent(
        new CustomEvent(
            "mma-life-training-screen-ready",
            {
                detail: trainingScreenAPI
            }
        )
    );
}

export {
    TRAINING_SCREEN_VERSION,
    TRAINING_TYPES,
    TRAINING_LEVELS,
    trainingScreenAPI
};

export default trainingScreenAPI;
