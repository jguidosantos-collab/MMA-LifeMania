// ============================================================
// MMA LIFE DYNASTY
// LIFE UI
// Arquivo: js/life/lifeUI.js
// Versão: 1.0
// ============================================================
//
// Responsabilidade:
// - Criar a camada visual dos sistemas de vida
// - Exibir histórico de vida
// - Exibir marcos/milestones
// - Exibir relacionamentos e família
// - Exibir carreira e evolução pessoal
// - Exibir patrimônio e estilo de vida
// - Exibir notificações
// - Criar componentes reutilizáveis
// - Não depende diretamente de outros módulos
//
// IMPORTANTE:
// Este arquivo foi desenvolvido para funcionar mesmo antes
// de toda a integração final dos demais módulos.
// ============================================================

const LIFE_UI_VERSION = 1;

// ============================================================
// CONFIGURAÇÃO
// ============================================================

const LIFE_UI_CONFIG = {
    rootId: "life-ui-root",

    classes: {
        root: "life-ui",
        section: "life-ui-section",
        card: "life-ui-card",
        grid: "life-ui-grid",
        list: "life-ui-list",
        item: "life-ui-item",
        empty: "life-ui-empty",
        header: "life-ui-header",
        title: "life-ui-title",
        subtitle: "life-ui-subtitle",
        badge: "life-ui-badge",
        stat: "life-ui-stat",
        statLabel: "life-ui-stat-label",
        statValue: "life-ui-stat-value",
        progress: "life-ui-progress",
        progressBar: "life-ui-progress-bar",
        notification: "life-ui-notification"
    },

    currency: "USD",

    maxHistoryItems: 50,
    maxMilestones: 30,
    maxNotifications: 10,

    animations: true,

    sections: {
        overview: true,
        history: true,
        milestones: true,
        relationships: true,
        family: true,
        career: true,
        finances: true,
        lifestyle: true,
        notifications: true
    }
};

// ============================================================
// UTILITÁRIOS
// ============================================================

function clone(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function safeNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}

function clamp(value, min = 0, max = 100) {
    return Math.min(
        max,
        Math.max(
            min,
            safeNumber(value, min)
        )
    );
}

function normalizeText(value, fallback = "") {
    if (value === null || value === undefined) {
        return fallback;
    }

    return String(value);
}

function escapeHTML(value) {
    return normalizeText(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getPath(object, path, fallback = undefined) {
    if (!object || !path) {
        return fallback;
    }

    const parts = String(path).split(".");
    let current = object;

    for (const part of parts) {
        if (
            current === null ||
            current === undefined ||
            !(part in Object(current))
        ) {
            return fallback;
        }

        current = current[part];
    }

    return current === undefined
        ? fallback
        : current;
}

function firstDefined(...values) {
    for (const value of values) {
        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return undefined;
}

function formatMoney(value, currency = LIFE_UI_CONFIG.currency) {
    const amount = safeNumber(value);

    try {
        return new Intl.NumberFormat(
            "en-US",
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
    return safeNumber(value).toLocaleString("pt-BR");
}

function formatPercent(value) {
    return `${Math.round(clamp(value))}%`;
}

function formatDate(date) {
    if (!date) {
        return "—";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return escapeHTML(date);
    }

    return parsed.toLocaleDateString(
        "pt-BR"
    );
}

function capitalize(value) {
    const text = normalizeText(value);

    if (!text) {
        return "";
    }

    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );
}

function humanize(value) {
    return capitalize(
        normalizeText(value)
            .replace(/_/g, " ")
            .replace(/-/g, " ")
    );
}

function createElement(tag, className = "", html = "") {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (html !== "") {
        element.innerHTML = html;
    }

    return element;
}

function ensureRoot(root = null) {
    if (root instanceof HTMLElement) {
        return root;
    }

    let element = document.getElementById(
        LIFE_UI_CONFIG.rootId
    );

    if (!element) {
        element = createElement(
            "div",
            LIFE_UI_CONFIG.classes.root
        );

        element.id = LIFE_UI_CONFIG.rootId;

        if (document.body) {
            document.body.appendChild(element);
        }
    }

    return element;
}

// ============================================================
// EXTRAÇÃO DE DADOS
// ============================================================

function getPlayer(database) {
    return getPath(
        database,
        "player",
        {}
    ) || {};
}

function getLife(database) {
    return getPath(
        database,
        "life",
        {}
    ) || {};
}

function getCareer(database) {
    return getPath(
        database,
        "career",
        {}
    ) || {};
}

function getBusiness(database) {
    return getPath(
        database,
        "business",
        {}
    ) || {};
}

function getMedia(database) {
    return getPath(
        database,
        "media",
        {}
    ) || {};
}

function getTraining(database) {
    return getPath(
        database,
        "training",
        {}
    ) || {};
}

function getDynasty(database) {
    return getPath(
        database,
        "dynasty",
        {}
    ) || {};
}

function getLifeHistory(database) {
    return getPath(
        database,
        "life.history",
        {}
    ) || {};
}

function getMilestones(database) {
    return getPath(
        database,
        "life.milestones",
        getPath(
            database,
            "database.life.milestones",
            {}
        )
    ) || {};
}

function getLifeEvents(database) {
    return getPath(
        database,
        "life.events",
        {}
    ) || {};
}

function getRelationships(database) {
    const life = getLife(database);

    return firstDefined(
        life.relationships,
        life.relationship,
        []
    ) || [];
}

function getChildren(database) {
    const life = getLife(database);

    if (Array.isArray(life.children)) {
        return life.children;
    }

    if (Array.isArray(life.family?.children)) {
        return life.family.children;
    }

    return [];
}

function getFamilyMembers(database) {
    const life = getLife(database);

    const family = life.family || {};

    const parents = Array.isArray(family.parents)
        ? family.parents
        : [];

    const siblings = Array.isArray(family.siblings)
        ? family.siblings
        : [];

    const children = getChildren(database);

    return [
        ...parents,
        ...siblings,
        ...children
    ];
}

function getHistoryEntries(database) {
    const history = getLifeHistory(database);

    if (Array.isArray(history.entries)) {
        return history.entries;
    }

    if (Array.isArray(history.history)) {
        return history.history;
    }

    return [];
}

function getMilestoneDefinitions(database) {
    const milestones = getMilestones(database);

    if (Array.isArray(milestones.definitions)) {
        return milestones.definitions;
    }

    if (milestones.definitions && typeof milestones.definitions === "object") {
        return Object.values(
            milestones.definitions
        );
    }

    return [];
}

function getMilestoneAchievements(database) {
    const milestones = getMilestones(database);

    if (Array.isArray(milestones.achievements)) {
        return milestones.achievements;
    }

    if (
        milestones.achievements &&
        typeof milestones.achievements === "object"
    ) {
        return Object.values(
            milestones.achievements
        );
    }

    return [];
}

// ============================================================
// DADOS DERIVADOS
// ============================================================

function getPlayerName(database) {
    const player = getPlayer(database);

    return firstDefined(
        player.name,
        player.fullName,
        player.identity?.name,
        "Lutador"
    );
}

function getPlayerAge(database) {
    const player = getPlayer(database);

    return safeNumber(
        firstDefined(
            player.age,
            player.identity?.age,
            getPath(database, "meta.age"),
            0
        )
    );
}

function getCareerStage(database) {
    const career = getCareer(database);

    return firstDefined(
        career.stage,
        career.careerStage,
        career.currentStage,
        getPlayer(database).careerStage,
        "Amateur"
    );
}

function getProfessionalStatus(database) {
    const career = getCareer(database);

    return Boolean(
        firstDefined(
            career.professional,
            career.active,
            getPlayer(database).professional?.active,
            false
        )
    );
}

function getWins(database) {
    const career = getCareer(database);

    return safeNumber(
        firstDefined(
            career.professional?.wins,
            career.stats?.wins,
            career.record?.wins,
            career.wins,
            getPath(database, "career.records.wins"),
            0
        )
    );
}

function getLosses(database) {
    const career = getCareer(database);

    return safeNumber(
        firstDefined(
            career.professional?.losses,
            career.stats?.losses,
            career.record?.losses,
            career.losses,
            getPath(database, "career.records.losses"),
            0
        )
    );
}

function getDraws(database) {
    const career = getCareer(database);

    return safeNumber(
        firstDefined(
            career.professional?.draws,
            career.stats?.draws,
            career.record?.draws,
            career.draws,
            0
        )
    );
}

function getTotalFights(database) {
    return (
        getWins(database) +
        getLosses(database) +
        getDraws(database)
    );
}

function getFollowers(database) {
    const media = getMedia(database);

    return safeNumber(
        firstDefined(
            media.followers,
            media.socialMedia?.followers,
            0
        )
    );
}

function getFame(database) {
    const media = getMedia(database);

    return clamp(
        firstDefined(
            media.fame,
            media.popularity,
            0
        )
    );
}

function getReputation(database) {
    const media = getMedia(database);

    return clamp(
        firstDefined(
            media.reputation,
            0
        )
    );
}

function getCash(database) {
    const business = getBusiness(database);

    return safeNumber(
        firstDefined(
            business.finances?.cash,
            business.cash,
            0
        )
    );
}

function getNetWorth(database) {
    const business = getBusiness(database);

    const direct = firstDefined(
        business.finances?.netWorth,
        business.wealth?.netWorth,
        business.netWorth
    );

    if (direct !== undefined) {
        return safeNumber(direct);
    }

    const assets = Array.isArray(
        business.finances?.assets
    )
        ? business.finances.assets
        : [];

    const assetValue = assets.reduce(
        (total, asset) => {
            return total +
                safeNumber(
                    firstDefined(
                        asset.value,
                        asset.price,
                        asset.currentValue,
                        0
                    )
                );
        },
        0
    );

    return getCash(database) + assetValue;
}

function getRelationshipCount(database) {
    return getRelationships(database).length;
}

function getChildrenCount(database) {
    return getChildren(database).length;
}

function getMilestonesAchievedCount(database) {
    return getMilestoneAchievements(
        database
    ).filter(
        item =>
            item &&
            (
                item.status === "achieved" ||
                item.achieved === true ||
                !item.status
            )
    ).length;
}

// ============================================================
// ÍCONES
// ============================================================

function getCategoryIcon(category) {
    const icons = {
        life: "🌱",
        mma: "🥊",
        career: "🏆",
        relationship: "❤️",
        family: "👨‍👩‍👧",
        education: "🎓",
        employment: "💼",
        finance: "💰",
        health: "❤️‍🩹",
        residence: "🏠",
        vehicle: "🚗",
        lifestyle: "✨",
        media: "📱",
        legacy: "🏛️",
        dynasty: "👑",
        personal: "⭐",
        rare: "💎",
        social: "👥",
        travel: "✈️"
    };

    return icons[
        normalizeText(category).toLowerCase()
    ] || "📌";
}

function getStatusIcon(status) {
    const icons = {
        achieved: "✓",
        available: "!",
        locked: "🔒",
        failed: "✕",
        hidden: "?"
    };

    return icons[
        normalizeText(status).toLowerCase()
    ] || "•";
}

// ============================================================
// ESTILOS
// ============================================================

function injectStyles() {
    if (document.getElementById("life-ui-styles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "life-ui-styles";

    style.textContent = `
        .life-ui {
            width: 100%;
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
        }

        .life-ui *,
        .life-ui *::before,
        .life-ui *::after {
            box-sizing: border-box;
        }

        .life-ui-section {
            margin-bottom: 24px;
        }

        .life-ui-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 14px;
        }

        .life-ui-title {
            margin: 0;
            font-size: 22px;
            font-weight: 800;
        }

        .life-ui-subtitle {
            margin: 4px 0 0;
            color: #6b7280;
            font-size: 14px;
        }

        .life-ui-grid {
            display: grid;
            grid-template-columns: repeat(
                auto-fit,
                minmax(180px, 1fr)
            );
            gap: 12px;
        }

        .life-ui-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            padding: 16px;
            box-shadow:
                0 2px 8px rgba(
                    0,
                    0,
                    0,
                    0.04
                );
        }

        .life-ui-card:hover {
            box-shadow:
                0 5px 18px rgba(
                    0,
                    0,
                    0,
                    0.08
                );
        }

        .life-ui-stat {
            min-height: 92px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .life-ui-stat-label {
            color: #6b7280;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: .04em;
            margin-bottom: 7px;
        }

        .life-ui-stat-value {
            font-size: 23px;
            font-weight: 800;
        }

        .life-ui-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .life-ui-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 12px;
            border: 1px solid #e5e7eb;
            border-radius: 11px;
            background: #fff;
        }

        .life-ui-item-main {
            min-width: 0;
        }

        .life-ui-item-title {
            font-weight: 700;
            margin-bottom: 3px;
        }

        .life-ui-item-description {
            color: #6b7280;
            font-size: 13px;
        }

        .life-ui-item-meta {
            color: #9ca3af;
            font-size: 12px;
            white-space: nowrap;
        }

        .life-ui-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 8px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 700;
            background: #f3f4f6;
        }

        .life-ui-progress {
            width: 100%;
            height: 7px;
            background: #e5e7eb;
            border-radius: 999px;
            overflow: hidden;
            margin-top: 8px;
        }

        .life-ui-progress-bar {
            height: 100%;
            width: 0;
            background: #111827;
            border-radius: inherit;
            transition: width .3s ease;
        }

        .life-ui-empty {
            padding: 22px;
            text-align: center;
            border: 1px dashed #d1d5db;
            border-radius: 12px;
            color: #6b7280;
            background: #fafafa;
        }

        .life-ui-notification {
            padding: 12px 14px;
            border-radius: 11px;
            border: 1px solid #e5e7eb;
            background: #fff;
        }

        .life-ui-profile {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .life-ui-avatar {
            width: 58px;
            height: 58px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #111827;
            color: white;
            font-size: 24px;
            font-weight: 800;
            flex-shrink: 0;
        }

        .life-ui-record {
            font-size: 13px;
            color: #6b7280;
            margin-top: 5px;
        }

        .life-ui-section-divider {
            height: 1px;
            background: #e5e7eb;
            margin: 16px 0;
        }

        .life-ui-milestone-achieved {
            border-color: #d1d5db;
        }

        .life-ui-milestone-locked {
            opacity: .62;
        }

        .life-ui-milestone-icon {
            font-size: 25px;
            flex-shrink: 0;
        }

        .life-ui-notification-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        @media (max-width: 600px) {
            .life-ui-card {
                padding: 13px;
            }

            .life-ui-title {
                font-size: 19px;
            }

            .life-ui-stat-value {
                font-size: 20px;
            }

            .life-ui-item {
                align-items: flex-start;
            }

            .life-ui-item-meta {
                white-space: normal;
                text-align: right;
            }
        }
    `;

    document.head.appendChild(style);
}

// ============================================================
// COMPONENTES BÁSICOS
// ============================================================

function createSection(title, subtitle = "") {
    const section = createElement(
        "section",
        LIFE_UI_CONFIG.classes.section
    );

    const header = createElement(
        "div",
        LIFE_UI_CONFIG.classes.header
    );

    const headingWrapper = createElement(
        "div"
    );

    const titleElement = createElement(
        "h2",
        LIFE_UI_CONFIG.classes.title
    );

    titleElement.textContent = title;

    headingWrapper.appendChild(
        titleElement
    );

    if (subtitle) {
        const subtitleElement = createElement(
            "div",
            LIFE_UI_CONFIG.classes.subtitle
        );

        subtitleElement.textContent =
            subtitle;

        headingWrapper.appendChild(
            subtitleElement
        );
    }

    header.appendChild(
        headingWrapper
    );

    section.appendChild(header);

    return section;
}

function createStatCard(label, value) {
    const card = createElement(
        "div",
        `${LIFE_UI_CONFIG.classes.card} ${LIFE_UI_CONFIG.classes.stat}`
    );

    const labelElement = createElement(
        "div",
        LIFE_UI_CONFIG.classes.statLabel
    );

    labelElement.textContent = label;

    const valueElement = createElement(
        "div",
        LIFE_UI_CONFIG.classes.statValue
    );

    valueElement.textContent =
        normalizeText(value);

    card.appendChild(labelElement);
    card.appendChild(valueElement);

    return card;
}

function createEmpty(message) {
    const element = createElement(
        "div",
        LIFE_UI_CONFIG.classes.empty
    );

    element.textContent = message;

    return element;
}

function createBadge(text) {
    const badge = createElement(
        "span",
        LIFE_UI_CONFIG.classes.badge
    );

    badge.textContent = text;

    return badge;
}

// ============================================================
// PERFIL
// ============================================================

function renderProfile(database) {
    const section = createSection(
        "Vida",
        "A trajetória pessoal e profissional do personagem."
    );

    const card = createElement(
        "div",
        LIFE_UI_CONFIG.classes.card
    );

    const profile = createElement(
        "div",
        "life-ui-profile"
    );

    const avatar = createElement(
        "div",
        "life-ui-avatar"
    );

    const name = getPlayerName(
        database
    );

    avatar.textContent =
        name.charAt(0).toUpperCase();

    const info = createElement(
        "div"
    );

    const title = createElement(
        "div",
        LIFE_UI_CONFIG.classes.title
    );

    title.textContent = name;

    const subtitle = createElement(
        "div",
        LIFE_UI_CONFIG.classes.subtitle
    );

    subtitle.textContent =
        `Idade: ${getPlayerAge(database)} • ${getCareerStage(database)}`;

    const record = createElement(
        "div",
        "life-ui-record"
    );

    record.textContent =
        `Cartel: ${getWins(database)}-${getLosses(database)}-${getDraws(database)}`;

    info.appendChild(title);
    info.appendChild(subtitle);
    info.appendChild(record);

    profile.appendChild(avatar);
    profile.appendChild(info);

    card.appendChild(profile);

    section.appendChild(card);

    return section;
}

// ============================================================
// VISÃO GERAL
// ============================================================

function renderOverview(database) {
    const section = createSection(
        "Visão geral",
        "Principais indicadores da vida atual."
    );

    const grid = createElement(
        "div",
        LIFE_UI_CONFIG.classes.grid
    );

    grid.appendChild(
        createStatCard(
            "Idade",
            `${getPlayerAge(database)} anos`
        )
    );

    grid.appendChild(
        createStatCard(
            "Carreira",
            getCareerStage(database)
        )
    );

    grid.appendChild(
        createStatCard(
            "Cartel",
            `${getWins(database)}-${getLosses(database)}-${getDraws(database)}`
        )
    );

    grid.appendChild(
        createStatCard(
            "Patrimônio",
            formatMoney(
                getNetWorth(database)
            )
        )
    );

    grid.appendChild(
        createStatCard(
            "Relacionamentos",
            formatNumber(
                getRelationshipCount(database)
            )
        )
    );

    grid.appendChild(
        createStatCard(
            "Filhos",
            formatNumber(
                getChildrenCount(database)
            )
        )
    );

    grid.appendChild(
        createStatCard(
            "Fama",
            formatPercent(
                getFame(database)
            )
        )
    );

    grid.appendChild(
        createStatCard(
            "Seguidores",
            formatNumber(
                getFollowers(database)
            )
        )
    );

    section.appendChild(grid);

    return section;
}

// ============================================================
// HISTÓRICO
// ============================================================

function normalizeHistoryEntry(entry) {
    return {
        id: firstDefined(
            entry?.id,
            entry?._id,
            ""
        ),
        title: firstDefined(
            entry?.title,
            entry?.name,
            entry?.description,
            "Evento"
        ),
        description: firstDefined(
            entry?.description,
            entry?.details,
            ""
        ),
        category: firstDefined(
            entry?.category,
            entry?.type,
            "other"
        ),
        date: firstDefined(
            entry?.date,
            entry?.timestamp,
            entry?.createdAt,
            null
        ),
        importance: safeNumber(
            firstDefined(
                entry?.importance,
                1
            )
        )
    };
}

function renderHistory(database) {
    const section = createSection(
        "Histórico de vida",
        "Os principais acontecimentos da trajetória."
    );

    const entries = getHistoryEntries(
        database
    )
        .map(normalizeHistoryEntry)
        .sort(
            (a, b) =>
                new Date(b.date || 0) -
                new Date(a.date || 0)
        )
        .slice(
            0,
            LIFE_UI_CONFIG.maxHistoryItems
        );

    if (!entries.length) {
        section.appendChild(
            createEmpty(
                "Ainda não existem acontecimentos registrados."
            )
        );

        return section;
    }

    const list = createElement(
        "div",
        LIFE_UI_CONFIG.classes.list
    );

    for (const entry of entries) {
        const item = createElement(
            "div",
            LIFE_UI_CONFIG.classes.item
        );

        const main = createElement(
            "div",
            "life-ui-item-main"
        );

        const title = createElement(
            "div",
            "life-ui-item-title"
        );

        title.textContent =
            `${getCategoryIcon(entry.category)} ${entry.title}`;

        const description = createElement(
            "div",
            "life-ui-item-description"
        );

        description.textContent =
            entry.description;

        main.appendChild(title);

        if (entry.description) {
            main.appendChild(
                description
            );
        }

        const meta = createElement(
            "div",
            "life-ui-item-meta"
        );

        meta.textContent =
            formatDate(entry.date);

        item.appendChild(main);
        item.appendChild(meta);

        list.appendChild(item);
    }

    section.appendChild(list);

    return section;
}

// ============================================================
// MILESTONES
// ============================================================

function normalizeMilestone(
    definition,
    achievements
) {
    const id = firstDefined(
        definition?.id,
        definition?.key,
        definition?.code,
        ""
    );

    const achievement =
        achievements.find(
            item =>
                item &&
                (
                    item.id === id ||
                    item.milestoneId === id ||
                    item.key === id
                )
        );

    const achieved =
        Boolean(
            achievement &&
            (
                achievement.status === "achieved" ||
                achievement.achieved === true ||
                !achievement.status
            )
        ) ||
        definition?.status === "achieved";

    const progress = clamp(
        firstDefined(
            achievement?.progress,
            definition?.progress,
            achieved ? 100 : 0
        )
    );

    return {
        id,
        title: firstDefined(
            definition?.title,
            definition?.name,
            "Marco"
        ),
        description: firstDefined(
            definition?.description,
            ""
        ),
        category: firstDefined(
            definition?.category,
            "personal"
        ),
        rarity: firstDefined(
            definition?.rarity,
            "common"
        ),
        importance: safeNumber(
            firstDefined(
                definition?.importance,
                1
            )
        ),
        status: achieved
            ? "achieved"
            : firstDefined(
                achievement?.status,
                definition?.status,
                "locked"
            ),
        progress
    };
}

function renderMilestoneItem(
    milestone
) {
    const item = createElement(
        "div",
        `${LIFE_UI_CONFIG.classes.item} ${
            milestone.status === "achieved"
                ? "life-ui-milestone-achieved"
                : ""
        } ${
            milestone.status === "locked"
                ? "life-ui-milestone-locked"
                : ""
        }`
    );

    const icon = createElement(
        "div",
        "life-ui-milestone-icon"
    );

    icon.textContent =
        milestone.status === "achieved"
            ? "🏆"
            : getStatusIcon(
                milestone.status
            );

    const main = createElement(
        "div",
        "life-ui-item-main"
    );

    const title = createElement(
        "div",
        "life-ui-item-title"
    );

    title.textContent =
        `${getCategoryIcon(milestone.category)} ${milestone.title}`;

    const description = createElement(
        "div",
        "life-ui-item-description"
    );

    description.textContent =
        milestone.description;

    main.appendChild(title);

    if (milestone.description) {
        main.appendChild(
            description
        );
    }

    if (
        milestone.status !== "achieved" &&
        milestone.progress > 0
    ) {
        const progress = createElement(
            "div",
            LIFE_UI_CONFIG.classes.progress
        );

        const bar = createElement(
            "div",
            LIFE_UI_CONFIG.classes.progressBar
        );

        bar.style.width =
            `${milestone.progress}%`;

        progress.appendChild(bar);
        main.appendChild(progress);
    }

    const meta = createElement(
        "div",
        "life-ui-item-meta"
    );

    meta.textContent =
        `${humanize(milestone.rarity)} • ${milestone.progress}%`;

    item.appendChild(icon);
    item.appendChild(main);
    item.appendChild(meta);

    return item;
}

function renderMilestones(database) {
    const section = createSection(
        "Marcos",
        "Conquistas que definem a vida e a carreira."
    );

    const definitions =
        getMilestoneDefinitions(
            database
        );

    const achievements =
        getMilestoneAchievements(
            database
        );

    const milestones = definitions
        .map(
            definition =>
                normalizeMilestone(
                    definition,
                    achievements
                )
        )
        .sort(
            (a, b) => {
                if (
                    a.status === "achieved" &&
                    b.status !== "achieved"
                ) {
                    return -1;
                }

                if (
                    a.status !== "achieved" &&
                    b.status === "achieved"
                ) {
                    return 1;
                }

                return b.importance -
                    a.importance;
            }
        )
        .slice(
            0,
            LIFE_UI_CONFIG.maxMilestones
        );

    if (!milestones.length) {
        section.appendChild(
            createEmpty(
                "Nenhum marco disponível ainda."
            )
        );

        return section;
    }

    const list = createElement(
        "div",
        LIFE_UI_CONFIG.classes.list
    );

    milestones.forEach(
        milestone =>
            list.appendChild(
                renderMilestoneItem(
                    milestone
                )
            )
    );

    section.appendChild(list);

    return section;
}

// ============================================================
// RELACIONAMENTOS
// ============================================================

function normalizeRelationship(
    relationship
) {
    return {
        name: firstDefined(
            relationship?.name,
            relationship?.personName,
            relationship?.targetName,
            "Pessoa"
        ),
        type: firstDefined(
            relationship?.type,
            relationship?.relation,
            "relationship"
        ),
        status: firstDefined(
            relationship?.status,
            ""
        ),
        quality: clamp(
            firstDefined(
                relationship?.quality,
                relationship?.level,
                relationship?.compatibility,
                0
            )
        )
    };
}

function renderRelationships(database) {
    const section = createSection(
        "Relacionamentos",
        "Pessoas importantes na vida do personagem."
    );

    const relationships =
        getRelationships(database)
            .map(
                normalizeRelationship
            )
            .slice(0, 20);

    if (!relationships.length) {
        section.appendChild(
            createEmpty(
                "Nenhum relacionamento registrado."
            )
        );

        return section;
    }

    const list = createElement(
        "div",
        LIFE_UI_CONFIG.classes.list
    );

    relationships.forEach(
        relationship => {
            const item = createElement(
                "div",
                LIFE_UI_CONFIG.classes.item
            );

            const main = createElement(
                "div",
                "life-ui-item-main"
            );

            const title = createElement(
                "div",
                "life-ui-item-title"
            );

            title.textContent =
                `❤️ ${relationship.name}`;

            const description =
                createElement(
                    "div",
                    "life-ui-item-description"
                );

            description.textContent =
                humanize(
                    relationship.type
                );

            main.appendChild(title);
            main.appendChild(description);

            const meta = createElement(
                "div",
                "life-ui-item-meta"
            );

            if (
                relationship.quality > 0
            ) {
                meta.textContent =
                    `${relationship.quality}%`;
            } else {
                meta.textContent =
                    relationship.status ||
                    "Ativo";
            }

            item.appendChild(main);
            item.appendChild(meta);

            list.appendChild(item);
        }
    );

    section.appendChild(list);

    return section;
}

// ============================================================
// FAMÍLIA
// ============================================================

function normalizeFamilyMember(member) {
    return {
        name: firstDefined(
            member?.name,
            member?.fullName,
            "Familiar"
        ),
        relation: firstDefined(
            member?.relation,
            member?.type,
            member?.relationship,
            "family"
        ),
        age: firstDefined(
            member?.age,
            null
        )
    };
}

function renderFamily(database) {
    const section = createSection(
        "Família",
        "Estrutura familiar e próxima geração."
    );

    const children =
        getChildren(database)
            .map(
                normalizeFamilyMember
            );

    const familyMembers =
        getFamilyMembers(database)
            .map(
                normalizeFamilyMember
            );

    const allMembers = [
        ...familyMembers
    ];

    if (
        children.length &&
        !allMembers.some(
            member =>
                children.some(
                    child =>
                        child.name ===
                        member.name
                )
        )
    ) {
        allMembers.push(
            ...children
        );
    }

    if (!allMembers.length) {
        section.appendChild(
            createEmpty(
                "Nenhum familiar registrado."
            )
        );

        return section;
    }

    const list = createElement(
        "div",
        LIFE_UI_CONFIG.classes.list
    );

    allMembers
        .slice(0, 30)
        .forEach(member => {
            const item = createElement(
                "div",
                LIFE_UI_CONFIG.classes.item
            );

            const main = createElement(
                "div",
                "life-ui-item-main"
            );

            const title = createElement(
                "div",
                "life-ui-item-title"
            );

            title.textContent =
                `👤 ${member.name}`;

            const description =
                createElement(
                    "div",
                    "life-ui-item-description"
                );

            description.textContent =
                humanize(
                    member.relation
                );

            main.appendChild(title);
            main.appendChild(
                description
            );

            const meta =
                createElement(
                    "div",
                    "life-ui-item-meta"
                );

            if (member.age !== null) {
                meta.textContent =
                    `${safeNumber(member.age)} anos`;
            }

            item.appendChild(main);
            item.appendChild(meta);

            list.appendChild(item);
        });

    section.appendChild(list);

    return section;
}

// ============================================================
// CARREIRA
// ============================================================

function renderCareer(database) {
    const section = createSection(
        "Carreira",
        "Evolução esportiva e profissional."
    );

    const grid = createElement(
        "div",
        LIFE_UI_CONFIG.classes.grid
    );

    grid.appendChild(
        createStatCard(
            "Estágio",
            getCareerStage(database)
        )
    );

    grid.appendChild(
        createStatCard(
            "Profissional",
            getProfessionalStatus(database)
                ? "Sim"
                : "Não"
        )
    );

    grid.appendChild(
        createStatCard(
            "Lutas",
            formatNumber(
                getTotalFights(database)
            )
        )
    );

    grid.appendChild(
        createStatCard(
            "Vitórias",
            formatNumber(
                getWins(database)
            )
        )
    );

    grid.appendChild(
        createStatCard(
            "Derrotas",
            formatNumber(
                getLosses(database)
            )
        )
    );

    grid.appendChild(
        createStatCard(
            "Empates",
            formatNumber(
                getDraws(database)
            )
        )
    );

    section.appendChild(grid);

    return section;
}

// ============================================================
// FINANÇAS
// ============================================================

function renderFinances(database) {
    const section = createSection(
        "Patrimônio",
        "Situação financeira atual."
    );

    const grid = createElement(
        "div",
        LIFE_UI_CONFIG.classes.grid
    );

    grid.appendChild(
        createStatCard(
            "Dinheiro disponível",
            formatMoney(
                getCash(database)
            )
        )
    );

    grid.appendChild(
        createStatCard(
            "Patrimônio líquido",
            formatMoney(
                getNetWorth(database)
            )
        )
    );

    const business =
        getBusiness(database);

    const earnings =
        safeNumber(
            firstDefined(
                business.finances?.careerEarnings,
                business.income?.careerEarnings,
                business.careerEarnings,
                0
            )
        );

    const expenses =
        safeNumber(
            firstDefined(
                business.finances?.expenses,
                business.expenses?.total,
                business.totalExpenses,
                0
            )
        );

    grid.appendChild(
        createStatCard(
            "Ganhos de carreira",
            formatMoney(
                earnings
            )
        )
    );

    grid.appendChild(
        createStatCard(
            "Despesas",
            formatMoney(
                expenses
            )
        )
    );

    section.appendChild(grid);

    return section;
}

// ============================================================
// ESTILO DE VIDA
// ============================================================

function renderLifestyle(database) {
    const section = createSection(
        "Estilo de vida",
        "Como o patrimônio e as escolhas afetam a vida."
    );

    const life =
        getLife(database);

    const lifestyle =
        life.lifestyle || {};

    const level =
        firstDefined(
            lifestyle.level,
            lifestyle.currentLevel,
            lifestyle.tier,
            1
        );

    const happiness =
        clamp(
            firstDefined(
                lifestyle.happiness,
                lifestyle.derived?.happiness,
                0
            )
        );

    const comfort =
        clamp(
            firstDefined(
                lifestyle.comfort,
                lifestyle.derived?.comfort,
                0
            )
        );

    const stress =
        clamp(
            firstDefined(
                lifestyle.stress,
                lifestyle.derived?.stress,
                0
            )
        );

    const grid = createElement(
        "div",
        LIFE_UI_CONFIG.classes.grid
    );

    grid.appendChild(
        createStatCard(
            "Nível",
            humanize(level)
        )
    );

    grid.appendChild(
        createStatCard(
            "Felicidade",
            formatPercent(
                happiness
            )
        )
    );

    grid.appendChild(
        createStatCard(
            "Conforto",
            formatPercent(
                comfort
            )
        )
    );

    grid.appendChild(
        createStatCard(
            "Estresse",
            formatPercent(
                stress
            )
        )
    );

    section.appendChild(grid);

    return section;
}

// ============================================================
// MÍDIA
// ============================================================

function renderMedia(database) {
    const section = createSection(
        "Imagem pública",
        "Fama, reputação e influência."
    );

    const grid = createElement(
        "div",
        LIFE_UI_CONFIG.classes.grid
    );

    grid.appendChild(
        createStatCard(
            "Fama",
            formatPercent(
                getFame(database)
            )
        )
    );

    grid.appendChild(
        createStatCard(
            "Reputação",
            formatPercent(
                getReputation(database)
            )
        )
    );

    grid.appendChild(
        createStatCard(
            "Seguidores",
            formatNumber(
                getFollowers(database)
            )
        )
    );

    section.appendChild(grid);

    return section;
}

// ============================================================
// DINASTIA
// ============================================================

function renderDynasty(database) {
    const section = createSection(
        "Dinastia",
        "O legado que poderá continuar pelas próximas gerações."
    );

    const dynasty =
        getDynasty(database);

    const generations =
        Array.isArray(
            dynasty.generations
        )
            ? dynasty.generations
            : [];

    const genealogy =
        Array.isArray(
            dynasty.genealogy
        )
            ? dynasty.genealogy
            : [];

    const activeCharacter =
        firstDefined(
            dynasty.activeCharacterId,
            "Atual"
        );

    const grid = createElement(
        "div",
        LIFE_UI_CONFIG.classes.grid
    );

    grid.appendChild(
        createStatCard(
            "Personagem ativo",
            activeCharacter
        )
    );

    grid.appendChild(
        createStatCard(
            "Gerações",
            formatNumber(
                generations.length
            )
        )
    );

    grid.appendChild(
        createStatCard(
            "Árvore genealógica",
            formatNumber(
                genealogy.length
            )
        )
    );

    grid.appendChild(
        createStatCard(
            "Marcos conquistados",
            formatNumber(
                getMilestonesAchievedCount(
                    database
                )
            )
        )
    );

    section.appendChild(grid);

    return section;
}

// ============================================================
// NOTIFICAÇÕES
// ============================================================

function getNotifications(database) {
    const candidates = [
        getPath(
            database,
            "notifications",
            []
        ),
        getPath(
            database,
            "life.notifications",
            []
        ),
        getPath(
            database,
            "life.milestones.notifications",
            []
        ),
        getPath(
            database,
            "life.events.notifications",
            []
        )
    ];

    const notifications = [];

    for (const list of candidates) {
        if (!Array.isArray(list)) {
            continue;
        }

        notifications.push(
            ...list
        );
    }

    return notifications
        .filter(Boolean)
        .slice(
            -LIFE_UI_CONFIG.maxNotifications
        )
        .reverse();
}

function renderNotifications(database) {
    const section = createSection(
        "Notificações",
        "Novidades importantes da sua vida."
    );

    const notifications =
        getNotifications(
            database
        );

    if (!notifications.length) {
        section.appendChild(
            createEmpty(
                "Nenhuma notificação nova."
            )
        );

        return section;
    }

    const list = createElement(
        "div",
        "life-ui-notification-list"
    );

    notifications.forEach(
        notification => {
            const item = createElement(
                "div",
                LIFE_UI_CONFIG.classes.notification
            );

            const title =
                firstDefined(
                    notification.title,
                    notification.message,
                    notification.text,
                    "Notificação"
                );

            const description =
                firstDefined(
                    notification.description,
                    notification.details,
                    ""
                );

            const titleElement =
                createElement(
                    "div",
                    "life-ui-item-title"
                );

            titleElement.textContent =
                `🔔 ${title}`;

            item.appendChild(
                titleElement
            );

            if (description) {
                const descriptionElement =
                    createElement(
                        "div",
                        "life-ui-item-description"
                    );

                descriptionElement.textContent =
                    description;

                item.appendChild(
                    descriptionElement
                );
            }

            list.appendChild(item);
        }
    );

    section.appendChild(list);

    return section;
}

// ============================================================
// DASHBOARD COMPLETO
// ============================================================

function renderDashboard(
    database,
    root = null
) {
    injectStyles();

    const container =
        ensureRoot(root);

    container.innerHTML = "";

    if (
        LIFE_UI_CONFIG.sections.overview
    ) {
        container.appendChild(
            renderProfile(database)
        );

        container.appendChild(
            renderOverview(database)
        );
    }

    if (
        LIFE_UI_CONFIG.sections.history
    ) {
        container.appendChild(
            renderHistory(database)
        );
    }

    if (
        LIFE_UI_CONFIG.sections.milestones
    ) {
        container.appendChild(
            renderMilestones(database)
        );
    }

    if (
        LIFE_UI_CONFIG.sections.relationships
    ) {
        container.appendChild(
            renderRelationships(database)
        );
    }

    if (
        LIFE_UI_CONFIG.sections.family
    ) {
        container.appendChild(
            renderFamily(database)
        );
    }

    if (
        LIFE_UI_CONFIG.sections.career
    ) {
        container.appendChild(
            renderCareer(database)
        );
    }

    if (
        LIFE_UI_CONFIG.sections.finances
    ) {
        container.appendChild(
            renderFinances(database)
        );
    }

    if (
        LIFE_UI_CONFIG.sections.lifestyle
    ) {
        container.appendChild(
            renderLifestyle(database)
        );
    }

    if (
        LIFE_UI_CONFIG.sections.notifications
    ) {
        container.appendChild(
            renderNotifications(database)
        );
    }

    if (
        LIFE_UI_CONFIG.sections.overview
    ) {
        container.appendChild(
            renderMedia(database)
        );

        container.appendChild(
            renderDynasty(database)
        );
    }

    return container;
}

// ============================================================
// RENDERIZAÇÃO DE SEÇÕES INDIVIDUAIS
// ============================================================

function renderSection(
    sectionName,
    database,
    root = null
) {
    injectStyles();

    const container =
        ensureRoot(root);

    let section;

    switch (
        normalizeText(
            sectionName
        ).toLowerCase()
    ) {
        case "overview":
        case "overview":
            section =
                renderOverview(
                    database
                );
            break;

        case "profile":
            section =
                renderProfile(
                    database
                );
            break;

        case "history":
            section =
                renderHistory(
                    database
                );
            break;

        case "milestones":
        case "marcos":
            section =
                renderMilestones(
                    database
                );
            break;

        case "relationships":
        case "relacionamentos":
            section =
                renderRelationships(
                    database
                );
            break;

        case "family":
        case "familia":
            section =
                renderFamily(
                    database
                );
            break;

        case "career":
        case "carreira":
            section =
                renderCareer(
                    database
                );
            break;

        case "finances":
        case "finance":
        case "financas":
            section =
                renderFinances(
                    database
                );
            break;

        case "lifestyle":
        case "estilo":
            section =
                renderLifestyle(
                    database
                );
            break;

        case "media":
            section =
                renderMedia(
                    database
                );
            break;

        case "dynasty":
        case "dinastia":
            section =
                renderDynasty(
                    database
                );
            break;

        case "notifications":
        case "notificacoes":
            section =
                renderNotifications(
                    database
                );
            break;

        default:
            return null;
    }

    container.appendChild(
        section
    );

    return section;
}

// ============================================================
// NOTIFICAÇÃO VISUAL TEMPORÁRIA
// ============================================================

function showToast(
    message,
    options = {}
) {
    injectStyles();

    const duration =
        safeNumber(
            options.duration,
            3500
        );

    const toast =
        createElement(
            "div",
            LIFE_UI_CONFIG.classes.notification
        );

    toast.style.position =
        "fixed";

    toast.style.right =
        "18px";

    toast.style.bottom =
        "18px";

    toast.style.zIndex =
        "99999";

    toast.style.maxWidth =
        "340px";

    toast.style.boxShadow =
        "0 8px 30px rgba(0,0,0,.18)";

    toast.textContent =
        normalizeText(
            message
        );

    document.body.appendChild(
        toast
    );

    window.setTimeout(
        () => {
            toast.remove();
        },
        duration
    );

    return toast;
}

// ============================================================
// ATUALIZAÇÃO
// ============================================================

function update(
    database,
    root = null
) {
    return renderDashboard(
        database,
        root
    );
}

function refresh(
    database,
    root = null
) {
    return update(
        database,
        root
    );
}

// ============================================================
// CONFIGURAÇÃO
// ============================================================

function configure(options = {}) {
    if (
        !options ||
        typeof options !== "object"
    ) {
        return clone(
            LIFE_UI_CONFIG
        );
    }

    if (
        options.sections &&
        typeof options.sections === "object"
    ) {
        Object.assign(
            LIFE_UI_CONFIG.sections,
            options.sections
        );
    }

    if (
        options.classes &&
        typeof options.classes === "object"
    ) {
        Object.assign(
            LIFE_UI_CONFIG.classes,
            options.classes
        );
    }

    if (
        options.rootId !== undefined
    ) {
        LIFE_UI_CONFIG.rootId =
            options.rootId;
    }

    if (
        options.currency !== undefined
    ) {
        LIFE_UI_CONFIG.currency =
            options.currency;
    }

    if (
        options.maxHistoryItems !== undefined
    ) {
        LIFE_UI_CONFIG.maxHistoryItems =
            safeNumber(
                options.maxHistoryItems,
                50
            );
    }

    if (
        options.maxMilestones !== undefined
    ) {
        LIFE_UI_CONFIG.maxMilestones =
            safeNumber(
                options.maxMilestones,
                30
            );
    }

    if (
        options.maxNotifications !== undefined
    ) {
        LIFE_UI_CONFIG.maxNotifications =
            safeNumber(
                options.maxNotifications,
                10
            );
    }

    if (
        options.animations !== undefined
    ) {
        LIFE_UI_CONFIG.animations =
            Boolean(
                options.animations
            );
    }

    return clone(
        LIFE_UI_CONFIG
    );
}

function getConfig() {
    return clone(
        LIFE_UI_CONFIG
    );
}

// ============================================================
// SNAPSHOT
// ============================================================

function snapshot(database) {
    return {
        version: LIFE_UI_VERSION,

        player: {
            name: getPlayerName(
                database
            ),
            age: getPlayerAge(
                database
            )
        },

        career: {
            stage: getCareerStage(
                database
            ),
            professional:
                getProfessionalStatus(
                    database
                ),
            wins: getWins(
                database
            ),
            losses: getLosses(
                database
            ),
            draws: getDraws(
                database
            ),
            fights: getTotalFights(
                database
            )
        },

        life: {
            relationships:
                getRelationshipCount(
                    database
                ),
            children:
                getChildrenCount(
                    database
                ),
            history:
                getHistoryEntries(
                    database
                ).length,
            milestones:
                getMilestonesAchievedCount(
                    database
                )
        },

        media: {
            fame:
                getFame(database),
            reputation:
                getReputation(database),
            followers:
                getFollowers(database)
        },

        finances: {
            cash:
                getCash(database),
            netWorth:
                getNetWorth(database)
        },

        dynasty: {
            generations:
                Array.isArray(
                    getDynasty(database)
                        .generations
                )
                    ? getDynasty(database)
                        .generations.length
                    : 0
        },

        generatedAt:
            new Date().toISOString()
    };
}

// ============================================================
// VALIDAÇÃO
// ============================================================

function validate(database) {
    const errors = [];

    if (
        database === null ||
        typeof database !== "object"
    ) {
        errors.push(
            "database inválido"
        );
    }

    if (
        !database.player
    ) {
        errors.push(
            "player não encontrado"
        );
    }

    if (
        !database.life
    ) {
        errors.push(
            "life não encontrado"
        );
    }

    return {
        valid:
            errors.length === 0,
        errors
    };
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

function initialize(
    database,
    root = null
) {
    injectStyles();

    if (
        !database ||
        typeof database !== "object"
    ) {
        return {
            initialized: false,
            error: "database inválido"
        };
    }

    const container =
        ensureRoot(root);

    container.dataset
        .lifeUiVersion =
        String(
            LIFE_UI_VERSION
        );

    return {
        initialized: true,
        root: container,
        snapshot:
            snapshot(database)
    };
}

// ============================================================
// API PÚBLICA
// ============================================================

const lifeUIAPI = {
    version:
        LIFE_UI_VERSION,

    config:
        LIFE_UI_CONFIG,

    initialize,

    render:
        renderDashboard,

    renderDashboard,

    renderSection,

    renderProfile,
    renderOverview,
    renderHistory,
    renderMilestones,
    renderRelationships,
    renderFamily,
    renderCareer,
    renderFinances,
    renderLifestyle,
    renderMedia,
    renderDynasty,
    renderNotifications,

    update,
    refresh,

    showToast,

    configure,
    getConfig,

    snapshot,
    validate,

    getPlayerName,
    getPlayerAge,
    getCareerStage,
    getProfessionalStatus,

    getWins,
    getLosses,
    getDraws,
    getTotalFights,

    getFollowers,
    getFame,
    getReputation,

    getCash,
    getNetWorth,

    getRelationshipCount,
    getChildrenCount,
    getMilestonesAchievedCount,

    getCategoryIcon,
    getStatusIcon
};

// ============================================================
// EXPOSIÇÃO GLOBAL
// ============================================================

if (
    typeof globalThis !== "undefined"
) {
    globalThis.lifeUIAPI =
        lifeUIAPI;
}

// ============================================================
// EXPORT
// ============================================================

export {
    LIFE_UI_VERSION,
    LIFE_UI_CONFIG,

    lifeUIAPI,

    initialize,

    renderDashboard,
    renderSection,

    renderProfile,
    renderOverview,
    renderHistory,
    renderMilestones,
    renderRelationships,
    renderFamily,
    renderCareer,
    renderFinances,
    renderLifestyle,
    renderMedia,
    renderDynasty,
    renderNotifications,

    update,
    refresh,

    showToast,

    configure,
    getConfig,

    snapshot,
    validate
};

export default lifeUIAPI;
