// ============================================================
// MMA LIFE DYNASTY
// LIFE DASHBOARD
// Arquivo: js/life/lifeDashboard.js
// Versão: 1.0
// ============================================================
//
// Responsabilidade:
// - Organizar o painel principal da VIDA
// - Integrar visualmente os sistemas de vida
// - Exibir perfil, carreira, família, dinheiro,
//   relacionamentos, estilo de vida, histórico,
//   milestones, mídia e dinastia
// - Servir como controlador da interface de vida
//
// IMPORTANTE:
// Este arquivo NÃO altera a lógica dos sistemas.
// Ele apenas organiza e apresenta os dados existentes.
//
// Não depende de imports obrigatórios.
// Pode funcionar mesmo enquanto a integração final
// dos módulos ainda está sendo construída.
// ============================================================

const LIFE_DASHBOARD_VERSION = 1;

// ============================================================
// CONFIGURAÇÃO
// ============================================================

const LIFE_DASHBOARD_CONFIG = {
    rootId: "life-dashboard-root",

    title: "Minha Vida",

    subtitle:
        "Acompanhe sua vida, carreira, patrimônio, família e legado.",

    autoRefresh: false,

    refreshInterval: 5000,

    sections: {
        profile: true,
        summary: true,
        career: true,
        family: true,
        relationships: true,
        finances: true,
        lifestyle: true,
        media: true,
        milestones: true,
        history: true,
        dynasty: true,
        notifications: true
    }
};

// ============================================================
// UTILITÁRIOS
// ============================================================

function safeNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
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

function escapeHTML(value) {
    return String(
        value === undefined ||
        value === null
            ? ""
            : value
    )
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function clamp(
    value,
    min = 0,
    max = 100
) {
    return Math.min(
        max,
        Math.max(
            min,
            safeNumber(value)
        )
    );
}

function formatNumber(value) {
    return safeNumber(
        value
    ).toLocaleString(
        "pt-BR"
    );
}

function formatMoney(
    value,
    currency = "USD"
) {
    const amount =
        safeNumber(value);

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

function formatPercent(value) {
    return `${Math.round(
        clamp(value)
    )}%`;
}

function humanize(value) {
    return String(
        value === undefined ||
        value === null
            ? ""
            : value
    )
        .replace(/_/g, " ")
        .replace(/-/g, " ")
        .replace(/\b\w/g, char =>
            char.toUpperCase()
        );
}

// ============================================================
// ACESSO À API DE LIFE UI
// ============================================================

function getLifeUIAPI() {
    if (
        typeof globalThis !== "undefined" &&
        globalThis.lifeUIAPI
    ) {
        return globalThis.lifeUIAPI;
    }

    return null;
}

function callLifeUI(
    method,
    database,
    ...args
) {
    const api =
        getLifeUIAPI();

    if (
        api &&
        typeof api[method] === "function"
    ) {
        try {
            return api[method](
                database,
                ...args
            );
        } catch {
            return null;
        }
    }

    return null;
}

// ============================================================
// ACESSO AO BANCO
// ============================================================

function getPlayer(database) {
    return getPath(
        database,
        "player",
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

function getLife(database) {
    return getPath(
        database,
        "life",
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

function getDynasty(database) {
    return getPath(
        database,
        "dynasty",
        {}
    ) || {};
}

// ============================================================
// DADOS DO PERSONAGEM
// ============================================================

function getPlayerName(database) {
    const player =
        getPlayer(database);

    return firstDefined(
        player.name,
        player.fullName,
        player.identity?.name,
        "Lutador"
    );
}

function getPlayerAge(database) {
    const player =
        getPlayer(database);

    return safeNumber(
        firstDefined(
            player.age,
            player.identity?.age,
            getPath(
                database,
                "meta.age"
            ),
            0
        )
    );
}

function getPlayerCountry(database) {
    const player =
        getPlayer(database);

    return firstDefined(
        player.country,
        player.countryName,
        player.identity?.country,
        player.nationality,
        "—"
    );
}

function getPlayerCity(database) {
    const player =
        getPlayer(database);

    return firstDefined(
        player.city,
        player.cityName,
        player.identity?.city,
        "—"
    );
}

function getCareerStage(database) {
    const career =
        getCareer(database);

    return firstDefined(
        career.stage,
        career.careerStage,
        career.currentStage,
        getPlayer(database).careerStage,
        "Amateur"
    );
}

function isProfessional(database) {
    const career =
        getCareer(database);

    return Boolean(
        firstDefined(
            career.professional,
            career.active,
            getPlayer(database).professional?.active,
            false
        )
    );
}

// ============================================================
// CARTEL
// ============================================================

function getWins(database) {
    const career =
        getCareer(database);

    return safeNumber(
        firstDefined(
            career.professional?.wins,
            career.stats?.wins,
            career.record?.wins,
            career.wins,
            getPath(
                database,
                "career.records.wins"
            ),
            0
        )
    );
}

function getLosses(database) {
    const career =
        getCareer(database);

    return safeNumber(
        firstDefined(
            career.professional?.losses,
            career.stats?.losses,
            career.record?.losses,
            career.losses,
            getPath(
                database,
                "career.records.losses"
            ),
            0
        )
    );
}

function getDraws(database) {
    const career =
        getCareer(database);

    return safeNumber(
        firstDefined(
            career.professional?.draws,
            career.stats?.draws,
            career.record?.draws,
            career.draws,
            getPath(
                database,
                "career.records.draws"
            ),
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

// ============================================================
// VIDA
// ============================================================

function getRelationships(database) {
    const life =
        getLife(database);

    if (
        Array.isArray(
            life.relationships
        )
    ) {
        return life.relationships;
    }

    return [];
}

function getChildren(database) {
    const life =
        getLife(database);

    if (
        Array.isArray(
            life.children
        )
    ) {
        return life.children;
    }

    if (
        Array.isArray(
            life.family?.children
        )
    ) {
        return life.family.children;
    }

    return [];
}

function getParents(database) {
    const life =
        getLife(database);

    if (
        Array.isArray(
            life.parents
        )
    ) {
        return life.parents;
    }

    if (
        Array.isArray(
            life.family?.parents
        )
    ) {
        return life.family.parents;
    }

    return [];
}

function getSiblings(database) {
    const life =
        getLife(database);

    if (
        Array.isArray(
            life.siblings
        )
    ) {
        return life.siblings;
    }

    if (
        Array.isArray(
            life.family?.siblings
        )
    ) {
        return life.family.siblings;
    }

    return [];
}

function getPartner(database) {
    const life =
        getLife(database);

    return firstDefined(
        life.partner,
        life.relationshipStatus?.partner,
        life.marriage?.partner,
        null
    );
}

// ============================================================
// FINANÇAS
// ============================================================

function getCash(database) {
    const business =
        getBusiness(database);

    return safeNumber(
        firstDefined(
            business.finances?.cash,
            business.cash,
            0
        )
    );
}

function getNetWorth(database) {
    const business =
        getBusiness(database);

    const direct =
        firstDefined(
            business.finances?.netWorth,
            business.wealth?.netWorth,
            business.netWorth
        );

    if (
        direct !== undefined
    ) {
        return safeNumber(
            direct
        );
    }

    const assets =
        Array.isArray(
            business.finances?.assets
        )
            ? business.finances.assets
            : [];

    const assetsValue =
        assets.reduce(
            (
                total,
                asset
            ) =>
                total +
                safeNumber(
                    firstDefined(
                        asset.value,
                        asset.currentValue,
                        asset.price,
                        0
                    )
                ),
            0
        );

    return (
        getCash(database) +
        assetsValue
    );
}

// ============================================================
// MÍDIA
// ============================================================

function getFame(database) {
    const media =
        getMedia(database);

    return clamp(
        firstDefined(
            media.fame,
            media.popularity,
            0
        )
    );
}

function getFollowers(database) {
    const media =
        getMedia(database);

    return safeNumber(
        firstDefined(
            media.followers,
            media.socialMedia?.followers,
            0
        )
    );
}

function getReputation(database) {
    const media =
        getMedia(database);

    return clamp(
        firstDefined(
            media.reputation,
            0
        )
    );
}

// ============================================================
// DINASTIA
// ============================================================

function getGenerationCount(database) {
    const dynasty =
        getDynasty(database);

    if (
        Array.isArray(
            dynasty.generations
        )
    ) {
        return dynasty.generations.length;
    }

    return safeNumber(
        firstDefined(
            dynasty.generation,
            dynasty.currentGeneration,
            0
        )
    );
}

function getActiveCharacter(database) {
    const dynasty =
        getDynasty(database);

    return firstDefined(
        dynasty.activeCharacterId,
        getPlayerName(database)
    );
}

// ============================================================
// ESTADO DO DASHBOARD
// ============================================================

let dashboardState = {
    database: null,
    root: null,
    initialized: false,
    lastRenderAt: null,
    refreshTimer: null
};

// ============================================================
// ESTILOS
// ============================================================

function injectStyles() {
    if (
        document.getElementById(
            "life-dashboard-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "life-dashboard-styles";

    style.textContent = `
        .life-dashboard {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 18px;
            font-family:
                Arial,
                Helvetica,
                sans-serif;
            color: #111827;
        }

        .life-dashboard-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 20px;
        }

        .life-dashboard-heading {
            min-width: 0;
        }

        .life-dashboard-title {
            margin: 0;
            font-size: 30px;
            font-weight: 800;
        }

        .life-dashboard-subtitle {
            margin-top: 6px;
            color: #6b7280;
            font-size: 14px;
        }

        .life-dashboard-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .life-dashboard-button {
            border: 1px solid #d1d5db;
            background: #ffffff;
            color: #111827;
            border-radius: 9px;
            padding: 8px 12px;
            cursor: pointer;
            font-weight: 700;
        }

        .life-dashboard-button:hover {
            background: #f3f4f6;
        }

        .life-dashboard-profile {
            display: grid;
            grid-template-columns:
                minmax(220px, 1fr)
                minmax(300px, 2fr);
            gap: 14px;
            margin-bottom: 18px;
        }

        .life-dashboard-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 15px;
            padding: 16px;
            box-shadow:
                0 2px 8px
                rgba(
                    0,
                    0,
                    0,
                    .04
                );
        }

        .life-dashboard-profile-main {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .life-dashboard-avatar {
            width: 66px;
            height: 66px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #111827;
            color: #ffffff;
            font-size: 28px;
            font-weight: 800;
            flex-shrink: 0;
        }

        .life-dashboard-name {
            font-size: 23px;
            font-weight: 800;
        }

        .life-dashboard-meta {
            margin-top: 4px;
            color: #6b7280;
            font-size: 13px;
        }

        .life-dashboard-record {
            margin-top: 7px;
            font-weight: 700;
        }

        .life-dashboard-grid {
            display: grid;
            grid-template-columns:
                repeat(
                    auto-fit,
                    minmax(
                        160px,
                        1fr
                    )
                );
            gap: 10px;
        }

        .life-dashboard-stat {
            padding: 14px;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            background: #ffffff;
        }

        .life-dashboard-stat-label {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: .04em;
        }

        .life-dashboard-stat-value {
            margin-top: 5px;
            font-size: 21px;
            font-weight: 800;
        }

        .life-dashboard-section {
            margin-top: 22px;
        }

        .life-dashboard-section-header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 11px;
        }

        .life-dashboard-section-title {
            margin: 0;
            font-size: 20px;
            font-weight: 800;
        }

        .life-dashboard-section-subtitle {
            color: #6b7280;
            font-size: 12px;
        }

        .life-dashboard-columns {
            display: grid;
            grid-template-columns:
                repeat(
                    auto-fit,
                    minmax(
                        280px,
                        1fr
                    )
                );
            gap: 12px;
        }

        .life-dashboard-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .life-dashboard-list-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 11px;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            background: #ffffff;
        }

        .life-dashboard-list-main {
            min-width: 0;
        }

        .life-dashboard-list-title {
            font-weight: 700;
        }

        .life-dashboard-list-description {
            margin-top: 3px;
            color: #6b7280;
            font-size: 12px;
        }

        .life-dashboard-list-meta {
            color: #6b7280;
            font-size: 12px;
            text-align: right;
            white-space: nowrap;
        }

        .life-dashboard-empty {
            padding: 20px;
            border: 1px dashed #d1d5db;
            border-radius: 12px;
            text-align: center;
            color: #6b7280;
            background: #fafafa;
        }

        .life-dashboard-badge {
            display: inline-flex;
            align-items: center;
            padding: 4px 8px;
            border-radius: 999px;
            background: #f3f4f6;
            font-size: 11px;
            font-weight: 700;
        }

        .life-dashboard-progress {
            width: 100%;
            height: 7px;
            margin-top: 8px;
            overflow: hidden;
            background: #e5e7eb;
            border-radius: 999px;
        }

        .life-dashboard-progress-bar {
            width: 0;
            height: 100%;
            background: #111827;
            border-radius: inherit;
        }

        @media (
            max-width: 700px
        ) {
            .life-dashboard {
                padding: 12px;
            }

            .life-dashboard-header {
                align-items: flex-start;
                flex-direction: column;
            }

            .life-dashboard-title {
                font-size: 25px;
            }

            .life-dashboard-profile {
                grid-template-columns: 1fr;
            }

            .life-dashboard-list-item {
                align-items: flex-start;
            }

            .life-dashboard-list-meta {
                white-space: normal;
            }
        }
    `;

    document.head.appendChild(
        style
    );
}

// ============================================================
// ELEMENTOS
// ============================================================

function createElement(
    tag,
    className = "",
    text = ""
) {
    const element =
        document.createElement(
            tag
        );

    if (className) {
        element.className =
            className;
    }

    if (text !== "") {
        element.textContent =
            text;
    }

    return element;
}

function createStat(
    label,
    value
) {
    const card =
        createElement(
            "div",
            "life-dashboard-stat"
        );

    const labelElement =
        createElement(
            "div",
            "life-dashboard-stat-label",
            label
        );

    const valueElement =
        createElement(
            "div",
            "life-dashboard-stat-value",
            value
        );

    card.appendChild(
        labelElement
    );

    card.appendChild(
        valueElement
    );

    return card;
}

function createSection(
    title,
    subtitle = ""
) {
    const section =
        createElement(
            "section",
            "life-dashboard-section"
        );

    const header =
        createElement(
            "div",
            "life-dashboard-section-header"
        );

    const titleElement =
        createElement(
            "h2",
            "life-dashboard-section-title",
            title
        );

    header.appendChild(
        titleElement
    );

    if (subtitle) {
        header.appendChild(
            createElement(
                "div",
                "life-dashboard-section-subtitle",
                subtitle
            )
        );
    }

    section.appendChild(
        header
    );

    return section;
}

function createEmpty(
    message
) {
    return createElement(
        "div",
        "life-dashboard-empty",
        message
    );
}

// ============================================================
// PERFIL
// ============================================================

function renderProfile(
    database
) {
    const wrapper =
        createElement(
            "div",
            "life-dashboard-profile"
        );

    const profile =
        createElement(
            "div",
            "life-dashboard-card"
        );

    const main =
        createElement(
            "div",
            "life-dashboard-profile-main"
        );

    const name =
        getPlayerName(
            database
        );

    const avatar =
        createElement(
            "div",
            "life-dashboard-avatar",
            name
                .charAt(0)
                .toUpperCase()
        );

    const info =
        createElement(
            "div"
        );

    info.appendChild(
        createElement(
            "div",
            "life-dashboard-name",
            name
        )
    );

    info.appendChild(
        createElement(
            "div",
            "life-dashboard-meta",
            `${getPlayerAge(database)} anos • ${getPlayerCity(database)}, ${getPlayerCountry(database)}`
        )
    );

    info.appendChild(
        createElement(
            "div",
            "life-dashboard-record",
            `Cartel ${getWins(database)}-${getLosses(database)}-${getDraws(database)}`
        )
    );

    main.appendChild(
        avatar
    );

    main.appendChild(
        info
    );

    profile.appendChild(
        main
    );

    const careerCard =
        createElement(
            "div",
            "life-dashboard-card"
        );

    const careerGrid =
        createElement(
            "div",
            "life-dashboard-grid"
        );

    careerGrid.appendChild(
        createStat(
            "Carreira",
            getCareerStage(
                database
            )
        )
    );

    careerGrid.appendChild(
        createStat(
            "Profissional",
            isProfessional(
                database
            )
                ? "Sim"
                : "Não"
        )
    );

    careerGrid.appendChild(
        createStat(
            "Lutas",
            formatNumber(
                getTotalFights(
                    database
                )
            )
        )
    );

    careerGrid.appendChild(
        createStat(
            "Gerações",
            formatNumber(
                getGenerationCount(
                    database
                )
            )
        )
    );

    careerCard.appendChild(
        careerGrid
    );

    wrapper.appendChild(
        profile
    );

    wrapper.appendChild(
        careerCard
    );

    return wrapper;
}

// ============================================================
// RESUMO
// ============================================================

function renderSummary(
    database
) {
    const section =
        createSection(
            "Resumo",
            "Os principais números da sua vida."
        );

    const grid =
        createElement(
            "div",
            "life-dashboard-grid"
        );

    grid.appendChild(
        createStat(
            "Patrimônio",
            formatMoney(
                getNetWorth(
                    database
                )
            )
        )
    );

    grid.appendChild(
        createStat(
            "Dinheiro",
            formatMoney(
                getCash(
                    database
                )
            )
        )
    );

    grid.appendChild(
        createStat(
            "Relacionamentos",
            formatNumber(
                getRelationships(
                    database
                ).length
            )
        )
    );

    grid.appendChild(
        createStat(
            "Filhos",
            formatNumber(
                getChildren(
                    database
                ).length
            )
        )
    );

    grid.appendChild(
        createStat(
            "Fama",
            formatPercent(
                getFame(
                    database
                )
            )
        )
    );

    grid.appendChild(
        createStat(
            "Seguidores",
            formatNumber(
                getFollowers(
                    database
                )
            )
        )
    );

    section.appendChild(
        grid
    );

    return section;
}

// ============================================================
// CARREIRA
// ============================================================

function renderCareer(
    database
) {
    const section =
        createSection(
            "Carreira",
            "Sua trajetória dentro do MMA."
        );

    const grid =
        createElement(
            "div",
            "life-dashboard-grid"
        );

    grid.appendChild(
        createStat(
            "Estágio",
            getCareerStage(
                database
            )
        )
    );

    grid.appendChild(
        createStat(
            "Vitórias",
            formatNumber(
                getWins(
                    database
                )
            )
        )
    );

    grid.appendChild(
        createStat(
            "Derrotas",
            formatNumber(
                getLosses(
                    database
                )
            )
        )
    );

    grid.appendChild(
        createStat(
            "Empates",
            formatNumber(
                getDraws(
                    database
                )
            )
        )
    );

    section.appendChild(
        grid
    );

    return section;
}

// ============================================================
// FAMÍLIA
// ============================================================

function renderFamily(
    database
) {
    const section =
        createSection(
            "Família",
            "Sua família e a próxima geração."
        );

    const grid =
        createElement(
            "div",
            "life-dashboard-grid"
        );

    grid.appendChild(
        createStat(
            "Pais",
            formatNumber(
                getParents(
                    database
                ).length
            )
        )
    );

    grid.appendChild(
        createStat(
            "Irmãos",
            formatNumber(
                getSiblings(
                    database
                ).length
            )
        )
    );

    grid.appendChild(
        createStat(
            "Filhos",
            formatNumber(
                getChildren(
                    database
                ).length
            )
        )
    );

    const partner =
        getPartner(
            database
        );

    let partnerName =
        "Solteiro";

    if (
        partner &&
        typeof partner === "object"
    ) {
        partnerName =
            firstDefined(
                partner.name,
                partner.fullName,
                "Em relacionamento"
            );
    } else if (
        typeof partner === "string"
    ) {
        partnerName =
            partner;
    }

    grid.appendChild(
        createStat(
            "Parceiro(a)",
            partnerName
        )
    );

    section.appendChild(
        grid
    );

    return section;
}

// ============================================================
// RELACIONAMENTOS
// ============================================================

function renderRelationships(
    database
) {
    const section =
        createSection(
            "Relacionamentos",
            "Pessoas que fazem parte da sua história."
        );

    const relationships =
        getRelationships(
            database
        );

    if (
        !relationships.length
    ) {
        section.appendChild(
            createEmpty(
                "Nenhum relacionamento registrado."
            )
        );

        return section;
    }

    const list =
        createElement(
            "div",
            "life-dashboard-list"
        );

    relationships
        .slice(0, 8)
        .forEach(
            relationship => {
                const item =
                    createElement(
                        "div",
                        "life-dashboard-list-item"
                    );

                const main =
                    createElement(
                        "div",
                        "life-dashboard-list-main"
                    );

                const name =
                    firstDefined(
                        relationship?.name,
                        relationship?.personName,
                        relationship?.targetName,
                        "Pessoa"
                    );

                const type =
                    firstDefined(
                        relationship?.type,
                        relationship?.relation,
                        "relationship"
                    );

                main.appendChild(
                    createElement(
                        "div",
                        "life-dashboard-list-title",
                        `❤️ ${name}`
                    )
                );

                main.appendChild(
                    createElement(
                        "div",
                        "life-dashboard-list-description",
                        humanize(type)
                    )
                );

                const meta =
                    createElement(
                        "div",
                        "life-dashboard-list-meta",
                        relationship?.status ||
                        ""
                    );

                item.appendChild(
                    main
                );

                item.appendChild(
                    meta
                );

                list.appendChild(
                    item
                );
            }
        );

    section.appendChild(
        list
    );

    return section;
}

// ============================================================
// FINANÇAS
// ============================================================

function renderFinances(
    database
) {
    const section =
        createSection(
            "Patrimônio",
            "Sua situação financeira."
        );

    const grid =
        createElement(
            "div",
            "life-dashboard-grid"
        );

    grid.appendChild(
        createStat(
            "Dinheiro disponível",
            formatMoney(
                getCash(
                    database
                )
            )
        )
    );

    grid.appendChild(
        createStat(
            "Patrimônio líquido",
            formatMoney(
                getNetWorth(
                    database
                )
            )
        )
    );

    const business =
        getBusiness(
            database
        );

    grid.appendChild(
        createStat(
            "Ganhos da carreira",
            formatMoney(
                firstDefined(
                    business.finances?.careerEarnings,
                    business.income?.careerEarnings,
                    business.careerEarnings,
                    0
                )
            )
        )
    );

    grid.appendChild(
        createStat(
            "Despesas",
            formatMoney(
                firstDefined(
                    business.finances?.expenses,
                    business.expenses?.total,
                    business.totalExpenses,
                    0
                )
            )
        )
    );

    section.appendChild(
        grid
    );

    return section;
}

// ============================================================
// ESTILO DE VIDA
// ============================================================

function renderLifestyle(
    database
) {
    const section =
        createSection(
            "Estilo de vida",
            "Conforto, felicidade e qualidade de vida."
        );

    const lifestyle =
        getLife(database)
            .lifestyle || {};

    const derived =
        lifestyle.derived || {};

    const level =
        firstDefined(
            lifestyle.level,
            lifestyle.currentLevel,
            lifestyle.tier,
            1
        );

    const happiness =
        firstDefined(
            lifestyle.happiness,
            derived.happiness,
            0
        );

    const comfort =
        firstDefined(
            lifestyle.comfort,
            derived.comfort,
            0
        );

    const stress =
        firstDefined(
            lifestyle.stress,
            derived.stress,
            0
        );

    const grid =
        createElement(
            "div",
            "life-dashboard-grid"
        );

    grid.appendChild(
        createStat(
            "Nível",
            humanize(level)
        )
    );

    grid.appendChild(
        createStat(
            "Felicidade",
            formatPercent(
                happiness
            )
        )
    );

    grid.appendChild(
        createStat(
            "Conforto",
            formatPercent(
                comfort
            )
        )
    );

    grid.appendChild(
        createStat(
            "Estresse",
            formatPercent(
                stress
            )
        )
    );

    section.appendChild(
        grid
    );

    return section;
}

// ============================================================
// MÍDIA
// ============================================================

function renderMedia(
    database
) {
    const section =
        createSection(
            "Imagem pública",
            "Como o mundo enxerga seu personagem."
        );

    const grid =
        createElement(
            "div",
            "life-dashboard-grid"
        );

    grid.appendChild(
        createStat(
            "Fama",
            formatPercent(
                getFame(
                    database
                )
            )
        )
    );

    grid.appendChild(
        createStat(
            "Reputação",
            formatPercent(
                getReputation(
                    database
                )
            )
        )
    );

    grid.appendChild(
        createStat(
            "Seguidores",
            formatNumber(
                getFollowers(
                    database
                )
            )
        )
    );

    section.appendChild(
        grid
    );

    return section;
}

// ============================================================
// MILESTONES
// ============================================================

function renderMilestones(
    database
) {
    const section =
        createSection(
            "Marcos da vida",
            "Conquistas que definem sua trajetória."
        );

    const result =
        callLifeUI(
            "renderMilestones",
            database
        );

    if (
        result &&
        result instanceof HTMLElement
    ) {
        const content =
            result.querySelector(
                ".life-ui-list, .life-ui-empty"
            );

        if (content) {
            section.appendChild(
                content.cloneNode(
                    true
                )
            );

            return section;
        }
    }

    const milestones =
        getPath(
            database,
            "life.milestones.achievements",
            []
        );

    if (
        !Array.isArray(
            milestones
        ) ||
        !milestones.length
    ) {
        section.appendChild(
            createEmpty(
                "Nenhum marco conquistado ainda."
            )
        );

        return section;
    }

    const list =
        createElement(
            "div",
            "life-dashboard-list"
        );

    milestones
        .filter(
            milestone =>
                milestone.status ===
                    "achieved" ||
                milestone.achieved === true ||
                !milestone.status
        )
        .slice(0, 8)
        .forEach(
            milestone => {
                const item =
                    createElement(
                        "div",
                        "life-dashboard-list-item"
                    );

                const title =
                    firstDefined(
                        milestone.title,
                        milestone.name,
                        "Marco"
                    );

                item.appendChild(
                    createElement(
                        "div",
                        "life-dashboard-list-title",
                        `🏆 ${title}`
                    )
                );

                item.appendChild(
                    createElement(
                        "div",
                        "life-dashboard-list-meta",
                        "Conquistado"
                    )
                );

                list.appendChild(
                    item
                );
            }
        );

    section.appendChild(
        list
    );

    return section;
}

// ============================================================
// HISTÓRICO
// ============================================================

function renderHistory(
    database
) {
    const section =
        createSection(
            "Histórico",
            "Os acontecimentos mais recentes."
        );

    const result =
        callLifeUI(
            "renderHistory",
            database
        );

    if (
        result &&
        result instanceof HTMLElement
    ) {
        const content =
            result.querySelector(
                ".life-ui-list, .life-ui-empty"
            );

        if (content) {
            section.appendChild(
                content.cloneNode(
                    true
                )
            );

            return section;
        }
    }

    const entries =
        getPath(
            database,
            "life.history.entries",
            []
        );

    if (
        !Array.isArray(
            entries
        ) ||
        !entries.length
    ) {
        section.appendChild(
            createEmpty(
                "Nenhum acontecimento registrado."
            )
        );

        return section;
    }

    const list =
        createElement(
            "div",
            "life-dashboard-list"
        );

    entries
        .slice(-8)
        .reverse()
        .forEach(
            entry => {
                const item =
                    createElement(
                        "div",
                        "life-dashboard-list-item"
                    );

                const title =
                    firstDefined(
                        entry.title,
                        entry.name,
                        entry.description,
                        "Evento"
                    );

                const category =
                    firstDefined(
                        entry.category,
                        entry.type,
                        "life"
                    );

                item.appendChild(
                    createElement(
                        "div",
                        "life-dashboard-list-title",
                        `📌 ${title}`
                    )
                );

                item.appendChild(
                    createElement(
                        "div",
                        "life-dashboard-list-meta",
                        humanize(category)
                    )
                );

                list.appendChild(
                    item
                );
            }
        );

    section.appendChild(
        list
    );

    return section;
}

// ============================================================
// DINASTIA
// ============================================================

function renderDynasty(
    database
) {
    const section =
        createSection(
            "Dinastia",
            "O legado que poderá continuar pelas próximas gerações."
        );

    const dynasty =
        getDynasty(
            database
        );

    const grid =
        createElement(
            "div",
            "life-dashboard-grid"
        );

    grid.appendChild(
        createStat(
            "Personagem ativo",
            getActiveCharacter(
                database
            )
        )
    );

    grid.appendChild(
        createStat(
            "Gerações",
            formatNumber(
                getGenerationCount(
                    database
                )
            )
        )
    );

    const genealogy =
        Array.isArray(
            dynasty.genealogy
        )
            ? dynasty.genealogy.length
            : 0;

    grid.appendChild(
        createStat(
            "Descendentes registrados",
            formatNumber(
                genealogy
            )
        )
    );

    const inheritance =
        Array.isArray(
            dynasty.inheritance
        )
            ? dynasty.inheritance.length
            : 0;

    grid.appendChild(
        createStat(
            "Heranças",
            formatNumber(
                inheritance
            )
        )
    );

    section.appendChild(
        grid
    );

    return section;
}

// ============================================================
// NOTIFICAÇÕES
// ============================================================

function renderNotifications(
    database
) {
    const section =
        createSection(
            "Notificações",
            "Acontecimentos que merecem sua atenção."
        );

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

    candidates.forEach(
        list => {
            if (
                Array.isArray(
                    list
                )
            ) {
                notifications.push(
                    ...list
                );
            }
        }
    );

    if (
        !notifications.length
    ) {
        section.appendChild(
            createEmpty(
                "Nenhuma notificação nova."
            )
        );

        return section;
    }

    const list =
        createElement(
            "div",
            "life-dashboard-list"
        );

    notifications
        .slice(-8)
        .reverse()
        .forEach(
            notification => {
                const item =
                    createElement(
                        "div",
                        "life-dashboard-list-item"
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

                const main =
                    createElement(
                        "div",
                        "life-dashboard-list-main"
                    );

                main.appendChild(
                    createElement(
                        "div",
                        "life-dashboard-list-title",
                        `🔔 ${title}`
                    )
                );

                if (
                    description
                ) {
                    main.appendChild(
                        createElement(
                            "div",
                            "life-dashboard-list-description",
                            description
                        )
                    );
                }

                item.appendChild(
                    main
                );

                list.appendChild(
                    item
                );
            }
        );

    section.appendChild(
        list
    );

    return section;
}

// ============================================================
// CABEÇALHO
// ============================================================

function renderHeader(
    database
) {
    const header =
        createElement(
            "header",
            "life-dashboard-header"
        );

    const heading =
        createElement(
            "div",
            "life-dashboard-heading"
        );

    heading.appendChild(
        createElement(
            "h1",
            "life-dashboard-title",
            LIFE_DASHBOARD_CONFIG.title
        )
    );

    heading.appendChild(
        createElement(
            "div",
            "life-dashboard-subtitle",
            `${LIFE_DASHBOARD_CONFIG.subtitle} • ${getPlayerName(database)}`
        )
    );

    const actions =
        createElement(
            "div",
            "life-dashboard-actions"
        );

    const refreshButton =
        createElement(
            "button",
            "life-dashboard-button",
            "↻ Atualizar"
        );

    refreshButton.type =
        "button";

    refreshButton.addEventListener(
        "click",
        () => {
            refresh(
                dashboardState.database,
                dashboardState.root
            );
        }
    );

    actions.appendChild(
        refreshButton
    );

    header.appendChild(
        heading
    );

    header.appendChild(
        actions
    );

    return header;
}

// ============================================================
// DASHBOARD COMPLETO
// ============================================================

function renderDashboard(
    database,
    root = null
) {
    injectStyles();

    if (
        !database ||
        typeof database !== "object"
    ) {
        return null;
    }

    let container = root;

    if (
        !(container instanceof HTMLElement)
    ) {
        container =
            document.getElementById(
                LIFE_DASHBOARD_CONFIG.rootId
            );
    }

    if (!container) {
        container =
            document.createElement(
                "div"
            );

        container.id =
            LIFE_DASHBOARD_CONFIG.rootId;

        if (document.body) {
            document.body.appendChild(
                container
            );
        }
    }

    container.className =
        "life-dashboard";

    container.innerHTML =
        "";

    container.appendChild(
        renderHeader(
            database
        )
    );

    if (
        LIFE_DASHBOARD_CONFIG.sections.profile
    ) {
        container.appendChild(
            renderProfile(
                database
            )
        );
    }

    if (
        LIFE_DASHBOARD_CONFIG.sections.summary
    ) {
        container.appendChild(
            renderSummary(
                database
            )
        );
    }

    if (
        LIFE_DASHBOARD_CONFIG.sections.career
    ) {
        container.appendChild(
            renderCareer(
                database
            )
        );
    }

    if (
        LIFE_DASHBOARD_CONFIG.sections.family
    ) {
        container.appendChild(
            renderFamily(
                database
            )
        );
    }

    if (
        LIFE_DASHBOARD_CONFIG.sections.relationships
    ) {
        container.appendChild(
            renderRelationships(
                database
            )
        );
    }

    if (
        LIFE_DASHBOARD_CONFIG.sections.finances
    ) {
        container.appendChild(
            renderFinances(
                database
            )
        );
    }

    if (
        LIFE_DASHBOARD_CONFIG.sections.lifestyle
    ) {
        container.appendChild(
            renderLifestyle(
                database
            )
        );
    }

    if (
        LIFE_DASHBOARD_CONFIG.sections.media
    ) {
        container.appendChild(
            renderMedia(
                database
            )
        );
    }

    if (
        LIFE_DASHBOARD_CONFIG.sections.milestones
    ) {
        container.appendChild(
            renderMilestones(
                database
            )
        );
    }

    if (
        LIFE_DASHBOARD_CONFIG.sections.history
    ) {
        container.appendChild(
            renderHistory(
                database
            )
        );
    }

    if (
        LIFE_DASHBOARD_CONFIG.sections.dynasty
    ) {
        container.appendChild(
            renderDynasty(
                database
            )
        );
    }

    if (
        LIFE_DASHBOARD_CONFIG.sections.notifications
    ) {
        container.appendChild(
            renderNotifications(
                database
            )
        );
    }

    dashboardState.database =
        database;

    dashboardState.root =
        container;

    dashboardState.initialized =
        true;

    dashboardState.lastRenderAt =
        new Date().toISOString();

    return container;
}

// ============================================================
// REFRESH
// ============================================================

function refresh(
    database = null,
    root = null
) {
    const currentDatabase =
        database ||
        dashboardState.database;

    const currentRoot =
        root ||
        dashboardState.root;

    if (
        !currentDatabase
    ) {
        return null;
    }

    return renderDashboard(
        currentDatabase,
        currentRoot
    );
}

// ============================================================
// AUTO REFRESH
// ============================================================

function startAutoRefresh(
    database = null,
    root = null
) {
    stopAutoRefresh();

    const currentDatabase =
        database ||
        dashboardState.database;

    const currentRoot =
        root ||
        dashboardState.root;

    if (
        !currentDatabase
    ) {
        return false;
    }

    dashboardState.database =
        currentDatabase;

    dashboardState.root =
        currentRoot;

    dashboardState.refreshTimer =
        window.setInterval(
            () => {
                refresh(
                    dashboardState.database,
                    dashboardState.root
                );
            },
            LIFE_DASHBOARD_CONFIG.refreshInterval
        );

    return true;
}

function stopAutoRefresh() {
    if (
        dashboardState.refreshTimer !==
        null
    ) {
        window.clearInterval(
            dashboardState.refreshTimer
        );

        dashboardState.refreshTimer =
            null;
    }

    return true;
}

// ============================================================
// CONFIGURAÇÃO
// ============================================================

function configure(
    options = {}
) {
    if (
        !options ||
        typeof options !== "object"
    ) {
        return {
            ...LIFE_DASHBOARD_CONFIG,
            sections: {
                ...LIFE_DASHBOARD_CONFIG.sections
            }
        };
    }

    if (
        options.sections &&
        typeof options.sections === "object"
    ) {
        Object.assign(
            LIFE_DASHBOARD_CONFIG.sections,
            options.sections
        );
    }

    if (
        options.title !== undefined
    ) {
        LIFE_DASHBOARD_CONFIG.title =
            String(
                options.title
            );
    }

    if (
        options.subtitle !== undefined
    ) {
        LIFE_DASHBOARD_CONFIG.subtitle =
            String(
                options.subtitle
            );
    }

    if (
        options.rootId !== undefined
    ) {
        LIFE_DASHBOARD_CONFIG.rootId =
            String(
                options.rootId
            );
    }

    if (
        options.autoRefresh !== undefined
    ) {
        LIFE_DASHBOARD_CONFIG.autoRefresh =
            Boolean(
                options.autoRefresh
            );
    }

    if (
        options.refreshInterval !== undefined
    ) {
        LIFE_DASHBOARD_CONFIG.refreshInterval =
            Math.max(
                1000,
                safeNumber(
                    options.refreshInterval,
                    5000
                )
            );
    }

    return {
        ...LIFE_DASHBOARD_CONFIG,
        sections: {
            ...LIFE_DASHBOARD_CONFIG.sections
        }
    };
}

function getConfig() {
    return {
        ...LIFE_DASHBOARD_CONFIG,
        sections: {
            ...LIFE_DASHBOARD_CONFIG.sections
        }
    };
}

// ============================================================
// SNAPSHOT
// ============================================================

function snapshot(
    database
) {
    return {
        version:
            LIFE_DASHBOARD_VERSION,

        player: {
            name:
                getPlayerName(
                    database
                ),
            age:
                getPlayerAge(
                    database
                ),
            country:
                getPlayerCountry(
                    database
                ),
            city:
                getPlayerCity(
                    database
                )
        },

        career: {
            stage:
                getCareerStage(
                    database
                ),
            professional:
                isProfessional(
                    database
                ),
            wins:
                getWins(
                    database
                ),
            losses:
                getLosses(
                    database
                ),
            draws:
                getDraws(
                    database
                ),
            fights:
                getTotalFights(
                    database
                )
        },

        life: {
            relationships:
                getRelationships(
                    database
                ).length,
            parents:
                getParents(
                    database
                ).length,
            siblings:
                getSiblings(
                    database
                ).length,
            children:
                getChildren(
                    database
                ).length,
            partner:
                Boolean(
                    getPartner(
                        database
                    )
                )
        },

        finances: {
            cash:
                getCash(
                    database
                ),
            netWorth:
                getNetWorth(
                    database
                )
        },

        media: {
            fame:
                getFame(
                    database
                ),
            followers:
                getFollowers(
                    database
                ),
            reputation:
                getReputation(
                    database
                )
        },

        dynasty: {
            activeCharacter:
                getActiveCharacter(
                    database
                ),
            generations:
                getGenerationCount(
                    database
                )
        },

        lastRenderAt:
            dashboardState.lastRenderAt
    };
}

// ============================================================
// VALIDAÇÃO
// ============================================================

function validate(
    database
) {
    const errors = [];

    if (
        !database ||
        typeof database !== "object"
    ) {
        errors.push(
            "database inválido"
        );
    }

    if (
        database &&
        !database.player
    ) {
        errors.push(
            "player não encontrado"
        );
    }

    if (
        database &&
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

    const validation =
        validate(
            database
        );

    if (
        !validation.valid
    ) {
        return {
            initialized: false,
            errors:
                validation.errors
        };
    }

    const container =
        renderDashboard(
            database,
            root
        );

    if (
        LIFE_DASHBOARD_CONFIG.autoRefresh
    ) {
        startAutoRefresh(
            database,
            container
        );
    }

    return {
        initialized: true,
        root: container,
        snapshot:
            snapshot(
                database
            )
    };
}

// ============================================================
// DESTRUIR
// ============================================================

function destroy() {
    stopAutoRefresh();

    if (
        dashboardState.root &&
        dashboardState.root.parentNode
    ) {
        dashboardState.root.parentNode.removeChild(
            dashboardState.root
        );
    }

    dashboardState = {
        database: null,
        root: null,
        initialized: false,
        lastRenderAt: null,
        refreshTimer: null
    };

    return true;
}

// ============================================================
// API
// ============================================================

const lifeDashboardAPI = {
    version:
        LIFE_DASHBOARD_VERSION,

    config:
        LIFE_DASHBOARD_CONFIG,

    initialize,

    render:
        renderDashboard,

    renderDashboard,

    refresh,

    startAutoRefresh,
    stopAutoRefresh,

    destroy,

    configure,
    getConfig,

    snapshot,
    validate,

    renderProfile,
    renderSummary,
    renderCareer,
    renderFamily,
    renderRelationships,
    renderFinances,
    renderLifestyle,
    renderMedia,
    renderMilestones,
    renderHistory,
    renderDynasty,
    renderNotifications,

    getPlayerName,
    getPlayerAge,
    getPlayerCountry,
    getPlayerCity,

    getCareerStage,
    isProfessional,

    getWins,
    getLosses,
    getDraws,
    getTotalFights,

    getRelationships,
    getChildren,
    getParents,
    getSiblings,
    getPartner,

    getCash,
    getNetWorth,

    getFame,
    getFollowers,
    getReputation,

    getGenerationCount,
    getActiveCharacter
};

// ============================================================
// EXPOSIÇÃO GLOBAL
// ============================================================

if (
    typeof globalThis !== "undefined"
) {
    globalThis.lifeDashboardAPI =
        lifeDashboardAPI;
}

// ============================================================
// EXPORT
// ============================================================

export {
    LIFE_DASHBOARD_VERSION,
    LIFE_DASHBOARD_CONFIG,

    lifeDashboardAPI,

    initialize,

    renderDashboard,
    renderProfile,
    renderSummary,
    renderCareer,
    renderFamily,
    renderRelationships,
    renderFinances,
    renderLifestyle,
    renderMedia,
    renderMilestones,
    renderHistory,
    renderDynasty,
    renderNotifications,

    refresh,

    startAutoRefresh,
    stopAutoRefresh,

    destroy,

    configure,
    getConfig,

    snapshot,
    validate
};

export default lifeDashboardAPI;
