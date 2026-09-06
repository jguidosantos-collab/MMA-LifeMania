/* ============================================================
   MMA LIFE DYNASTY
   UI — MEDIA SCREEN
   Arquivo: js/ui/mediaScreen.js
   ============================================================ */

const MEDIA_SCREEN_VERSION = 1;

const mediaScreenState = {
    initialized: false,
    database: null,
    activeTab: "overview",
    lastRender: null
};

/* ============================================================
   UTILIDADES
   ============================================================ */

function clone(value) {
    if (value === undefined) return undefined;

    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function getDatabase(database = null) {
    return database || mediaScreenState.database || window.MMA_LIFE_DATABASE || {};
}

function getPlayer(database) {
    return database?.player || {};
}

function getMedia(database) {
    return database?.media || {};
}

function getNested(object, path, fallback = null) {
    if (!object || !path) return fallback;

    const parts = Array.isArray(path) ? path : String(path).split(".");

    let current = object;

    for (const part of parts) {
        if (current == null) return fallback;
        current = current[part];
    }

    return current ?? fallback;
}

function safeArray(value) {
    if (Array.isArray(value)) return value;

    if (value && Array.isArray(value.items)) {
        return value.items;
    }

    if (value && Array.isArray(value.list)) {
        return value.list;
    }

    if (value && Array.isArray(value.data)) {
        return value.data;
    }

    return [];
}

function safeObject(value) {
    return value && typeof value === "object" && !Array.isArray(value)
        ? value
        : {};
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
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return new Intl.NumberFormat("pt-BR").format(Math.round(number));
}

function formatMoney(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "US$ 0";
    }

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(number);
}

function formatPercent(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0%";
    }

    return `${Math.round(number)}%`;
}

function capitalize(value) {
    if (!value) return "";

    const text = String(value);

    return text.charAt(0).toUpperCase() + text.slice(1);
}

function clamp(value, min = 0, max = 100) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return min;
    }

    return Math.max(min, Math.min(max, number));
}

function getElement(id) {
    return document.getElementById(id);
}

function ensureContent() {
    let content = getElement("mma-life-content");

    if (!content) {
        content = document.createElement("main");
        content.id = "mma-life-content";

        document.body.appendChild(content);
    }

    return content;
}

/* ============================================================
   IDENTIDADE
   ============================================================ */

function getPlayerName(player) {
    const firstName =
        player.firstName ||
        player.firstname ||
        "";

    const lastName =
        player.lastName ||
        player.lastname ||
        "";

    const fullName =
        player.fullName ||
        player.name ||
        `${firstName} ${lastName}`.trim();

    return fullName || "Lutador";
}

function getNickname(player) {
    return (
        player.nickname ||
        player.nickName ||
        player.apelido ||
        ""
    );
}

function getAge(player) {
    return (
        player.age ??
        player.identity?.age ??
        player.profile?.age ??
        18
    );
}

function getCountry(player) {
    return (
        player.country ||
        player.identity?.country ||
        player.profile?.country ||
        "Brasil"
    );
}

function getCity(player) {
    return (
        player.city ||
        player.identity?.city ||
        player.profile?.city ||
        ""
    );
}

/* ============================================================
   MEDIA — FONTES DE DADOS
   ============================================================ */

function getFame(database) {
    const media = getMedia(database);

    return Number(
        media.fame ??
        media.fameScore ??
        media.fameLevel ??
        getNested(database, "media.fame.value", 0) ??
        0
    );
}

function getFollowers(database) {
    const media = getMedia(database);

    return Number(
        media.followers ??
        media.socialMedia?.followers ??
        media.social?.followers ??
        getNested(database, "media.followers.value", 0) ??
        0
    );
}

function getReputation(database) {
    const media = getMedia(database);

    return Number(
        media.reputation ??
        media.reputationScore ??
        getNested(database, "media.reputation.value", 0) ??
        0
    );
}

function getPopularity(database) {
    const media = getMedia(database);

    return Number(
        media.popularity ??
        media.popularityScore ??
        getNested(database, "media.popularity.value", 0) ??
        0
    );
}

function getMarketability(database) {
    const media = getMedia(database);

    return Number(
        media.marketability ??
        media.marketabilityScore ??
        getNested(database, "media.marketability.value", 0) ??
        0
    );
}

function getPersona(database) {
    const media = getMedia(database);

    return (
        media.persona ||
        media.personality ||
        getNested(database, "media.persona.profile", null) ||
        {}
    );
}

function getSocialMedia(database) {
    const media = getMedia(database);

    return (
        media.socialMedia ||
        media.social ||
        {}
    );
}

function getNews(database) {
    const media = getMedia(database);

    return safeArray(
        media.news ||
        database.world?.news ||
        database.news
    );
}

function getRivalries(database) {
    const media = getMedia(database);

    return safeArray(
        media.rivalries ||
        database.rivalries
    );
}

function getControversies(database) {
    const media = getMedia(database);

    return safeArray(
        media.controversies ||
        database.controversies
    );
}

function getAwards(database) {
    const media = getMedia(database);

    return safeArray(
        media.awards ||
        database.awards
    );
}

function getMediaHistory(database) {
    const media = getMedia(database);

    return safeArray(
        media.history ||
        database.mediaHistory
    );
}

/* ============================================================
   DERIVADOS
   ============================================================ */

function getFameLevel(fame) {
    if (fame >= 90) return "Lenda mundial";
    if (fame >= 75) return "Superestrela";
    if (fame >= 60) return "Estrela internacional";
    if (fame >= 45) return "Nome conhecido";
    if (fame >= 30) return "Popular";
    if (fame >= 15) return "Em ascensão";

    return "Desconhecido";
}

function getReputationLevel(reputation) {
    if (reputation >= 90) return "Excelente";
    if (reputation >= 75) return "Muito alta";
    if (reputation >= 60) return "Alta";
    if (reputation >= 45) return "Boa";
    if (reputation >= 30) return "Regular";
    if (reputation >= 15) return "Baixa";

    return "Negativa";
}

function getPopularityLevel(popularity) {
    if (popularity >= 90) return "Fenômeno";
    if (popularity >= 75) return "Muito popular";
    if (popularity >= 60) return "Popular";
    if (popularity >= 40) return "Conhecido";
    if (popularity >= 20) return "Emergente";

    return "Pouco conhecido";
}

function getMarketabilityLevel(marketability) {
    if (marketability >= 90) return "Ícone comercial";
    if (marketability >= 75) return "Muito comercial";
    if (marketability >= 60) return "Alta";
    if (marketability >= 40) return "Boa";
    if (marketability >= 20) return "Moderada";

    return "Baixa";
}

function getPersonaName(persona) {
    if (!persona) return "Não definida";

    if (typeof persona === "string") {
        return capitalize(persona.replace(/_/g, " "));
    }

    return (
        persona.name ||
        persona.label ||
        persona.type ||
        persona.archetype ||
        "Não definida"
    );
}

function getPersonaDescription(persona) {
    if (!persona || typeof persona !== "object") {
        return "Sua personalidade pública ainda está sendo construída.";
    }

    return (
        persona.description ||
        persona.bio ||
        persona.summary ||
        "Sua imagem pública continuará evoluindo conforme sua carreira."
    );
}

function getFollowerGrowth(database) {
    const social = getSocialMedia(database);

    return Number(
        social.growth ??
        social.followerGrowth ??
        social.monthlyGrowth ??
        0
    );
}

function getEngagement(database) {
    const social = getSocialMedia(database);

    return Number(
        social.engagement ??
        social.engagementRate ??
        0
    );
}

function getSocialPlatformCount(database) {
    const social = getSocialMedia(database);

    const platforms = safeArray(
        social.platforms ||
        social.accounts
    );

    if (platforms.length > 0) {
        return platforms.length;
    }

    return Object.keys(
        safeObject(social.platforms)
    ).length;
}

function getActiveRivalries(database) {
    return getRivalries(database).filter((rivalry) => {
        const status = String(
            rivalry.status ||
            rivalry.state ||
            "active"
        ).toLowerCase();

        return ![
            "ended",
            "finished",
            "resolved",
            "inactive"
        ].includes(status);
    });
}

function getActiveControversies(database) {
    return getControversies(database).filter((controversy) => {
        const status = String(
            controversy.status ||
            controversy.state ||
            "active"
        ).toLowerCase();

        return ![
            "resolved",
            "ended",
            "finished",
            "inactive"
        ].includes(status);
    });
}

/* ============================================================
   RESUMO
   ============================================================ */

function getMediaSummary(database) {
    const fame = clamp(getFame(database));
    const followers = Math.max(0, getFollowers(database));
    const reputation = clamp(getReputation(database));
    const popularity = clamp(getPopularity(database));
    const marketability = clamp(getMarketability(database));

    return {
        fame,
        fameLevel: getFameLevel(fame),
        followers,
        reputation,
        reputationLevel: getReputationLevel(reputation),
        popularity,
        popularityLevel: getPopularityLevel(popularity),
        marketability,
        marketabilityLevel: getMarketabilityLevel(marketability),
        followerGrowth: getFollowerGrowth(database),
        engagement: getEngagement(database),
        platforms: getSocialPlatformCount(database),
        rivalries: getActiveRivalries(database).length,
        controversies: getActiveControversies(database).length,
        news: getNews(database).length,
        awards: getAwards(database).length
    };
}

/* ============================================================
   FORMATAÇÃO DE NOTÍCIAS
   ============================================================ */

function getNewsTitle(news) {
    return (
        news.title ||
        news.headline ||
        news.name ||
        "Notícia"
    );
}

function getNewsText(news) {
    return (
        news.description ||
        news.summary ||
        news.text ||
        news.content ||
        "Uma nova notícia sobre sua carreira."
    );
}

function getNewsDate(news) {
    return (
        news.date ||
        news.createdAt ||
        news.timestamp ||
        ""
    );
}

function getNewsImportance(news) {
    const value =
        news.importance ??
        news.impact ??
        news.mediaImpact ??
        0;

    return Number(value) || 0;
}

/* ============================================================
   RIVALIDADES
   ============================================================ */

function getRivalName(rivalry) {
    return (
        rivalry.opponentName ||
        rivalry.opponent ||
        rivalry.fighterName ||
        rivalry.name ||
        "Rival"
    );
}

function getRivalryIntensity(rivalry) {
    return clamp(
        rivalry.intensity ??
        rivalry.heat ??
        rivalry.score ??
        0
    );
}

function getRivalryStatus(rivalry) {
    const status = String(
        rivalry.status ||
        rivalry.state ||
        "active"
    ).toLowerCase();

    const labels = {
        active: "Ativa",
        ongoing: "Ativa",
        developing: "Em desenvolvimento",
        ended: "Encerrada",
        resolved: "Resolvida",
        inactive: "Inativa"
    };

    return labels[status] || capitalize(status);
}

/* ============================================================
   CONTROVÉRSIAS
   ============================================================ */

function getControversyTitle(controversy) {
    return (
        controversy.title ||
        controversy.name ||
        controversy.type ||
        "Controvérsia"
    );
}

function getControversySeverity(controversy) {
    return clamp(
        controversy.severity ??
        controversy.impact ??
        controversy.heat ??
        0
    );
}

function getControversyStatus(controversy) {
    const status = String(
        controversy.status ||
        controversy.state ||
        "active"
    ).toLowerCase();

    const labels = {
        active: "Ativa",
        ongoing: "Ativa",
        resolved: "Resolvida",
        ended: "Encerrada",
        inactive: "Inativa"
    };

    return labels[status] || capitalize(status);
}

/* ============================================================
   PRÊMIOS
   ============================================================ */

function getAwardName(award) {
    return (
        award.name ||
        award.title ||
        award.award ||
        "Prêmio"
    );
}

function getAwardYear(award) {
    return (
        award.year ||
        award.date ||
        award.season ||
        ""
    );
}

function getAwardDescription(award) {
    return (
        award.description ||
        award.reason ||
        award.category ||
        "Reconhecimento recebido durante a carreira."
    );
}

/* ============================================================
   CARDS
   ============================================================ */

function renderStatCard(label, value, subtitle, progress = null) {
    const progressValue =
        progress === null
            ? null
            : clamp(progress);

    return `
        <div class="media-stat-card">
            <div class="media-stat-label">
                ${escapeHTML(label)}
            </div>

            <div class="media-stat-value">
                ${escapeHTML(value)}
            </div>

            <div class="media-stat-subtitle">
                ${escapeHTML(subtitle)}
            </div>

            ${
                progressValue !== null
                    ? `
                        <div class="media-progress">
                            <div
                                class="media-progress-fill"
                                style="width:${progressValue}%"
                            ></div>
                        </div>
                    `
                    : ""
            }
        </div>
    `;
}

function renderNewsCard(news) {
    const importance = getNewsImportance(news);

    return `
        <article class="media-news-card">
            <div class="media-news-top">
                <span class="media-news-tag">
                    ${importance >= 70 ? "DESTAQUE" : "NOTÍCIA"}
                </span>

                ${
                    getNewsDate(news)
                        ? `
                            <span class="media-news-date">
                                ${escapeHTML(getNewsDate(news))}
                            </span>
                        `
                        : ""
                }
            </div>

            <h4>
                ${escapeHTML(getNewsTitle(news))}
            </h4>

            <p>
                ${escapeHTML(getNewsText(news))}
            </p>
        </article>
    `;
}

function renderRivalryCard(rivalry) {
    const intensity = getRivalryIntensity(rivalry);

    return `
        <article class="media-rivalry-card">
            <div class="media-rivalry-icon">
                ⚔
            </div>

            <div class="media-rivalry-content">
                <div class="media-rivalry-title">
                    ${escapeHTML(getRivalName(rivalry))}
                </div>

                <div class="media-rivalry-status">
                    ${escapeHTML(getRivalryStatus(rivalry))}
                </div>

                <div class="media-progress">
                    <div
                        class="media-progress-fill"
                        style="width:${intensity}%"
                    ></div>
                </div>

                <div class="media-small-label">
                    Intensidade: ${formatPercent(intensity)}
                </div>
            </div>
        </article>
    `;
}

function renderControversyCard(controversy) {
    const severity = getControversySeverity(controversy);

    return `
        <article class="media-controversy-card">
            <div class="media-controversy-top">
                <strong>
                    ${escapeHTML(getControversyTitle(controversy))}
                </strong>

                <span>
                    ${escapeHTML(
                        getControversyStatus(controversy)
                    )}
                </span>
            </div>

            <div class="media-progress">
                <div
                    class="media-progress-fill"
                    style="width:${severity}%"
                ></div>
            </div>

            <div class="media-small-label">
                Impacto: ${formatPercent(severity)}
            </div>
        </article>
    `;
}

function renderAwardCard(award) {
    return `
        <article class="media-award-card">
            <div class="media-award-icon">
                🏆
            </div>

            <div>
                <strong>
                    ${escapeHTML(getAwardName(award))}
                </strong>

                <p>
                    ${escapeHTML(getAwardDescription(award))}
                </p>

                ${
                    getAwardYear(award)
                        ? `
                            <span class="media-award-year">
                                ${escapeHTML(
                                    getAwardYear(award)
                                )}
                            </span>
                        `
                        : ""
                }
            </div>
        </article>
    `;
}

/* ============================================================
   OVERVIEW
   ============================================================ */

function renderOverview(database) {
    const summary = getMediaSummary(database);
    const news = getNews(database)
        .slice()
        .sort(
            (a, b) =>
                getNewsImportance(b) -
                getNewsImportance(a)
        )
        .slice(0, 5);

    const rivalries = getActiveRivalries(database)
        .slice()
        .sort(
            (a, b) =>
                getRivalryIntensity(b) -
                getRivalryIntensity(a)
        )
        .slice(0, 4);

    const controversies = getActiveControversies(database)
        .slice()
        .sort(
            (a, b) =>
                getControversySeverity(b) -
                getControversySeverity(a)
        )
        .slice(0, 3);

    return `
        <section class="media-section">
            <div class="media-section-header">
                <div>
                    <span class="media-kicker">
                        VISIBILIDADE
                    </span>

                    <h3>
                        Sua presença no mundo do MMA
                    </h3>

                    <p>
                        Fama, seguidores, reputação e força comercial
                        evoluem conforme suas escolhas e resultados.
                    </p>
                </div>
            </div>

            <div class="media-stats-grid">
                ${renderStatCard(
                    "Fama",
                    formatNumber(summary.fame),
                    summary.fameLevel,
                    summary.fame
                )}

                ${renderStatCard(
                    "Seguidores",
                    formatNumber(summary.followers),
                    summary.followerGrowth > 0
                        ? `+${formatNumber(summary.followerGrowth)} no período`
                        : "Sem crescimento registrado"
                )}

                ${renderStatCard(
                    "Reputação",
                    formatNumber(summary.reputation),
                    summary.reputationLevel,
                    summary.reputation
                )}

                ${renderStatCard(
                    "Popularidade",
                    formatNumber(summary.popularity),
                    summary.popularityLevel,
                    summary.popularity
                )}

                ${renderStatCard(
                    "Marketability",
                    formatNumber(summary.marketability),
                    summary.marketabilityLevel,
                    summary.marketability
                )}

                ${renderStatCard(
                    "Engajamento",
                    formatPercent(summary.engagement),
                    `${summary.platforms} plataforma(s)`
                )}
            </div>
        </section>

        <section class="media-two-column">
            <div class="media-panel">
                <div class="media-panel-header">
                    <div>
                        <span class="media-kicker">
                            MÍDIA
                        </span>

                        <h3>
                            Últimas notícias
                        </h3>
                    </div>

                    <button
                        class="media-link-button"
                        data-media-tab="news"
                    >
                        Ver todas
                    </button>
                </div>

                <div class="media-news-list">
                    ${
                        news.length
                            ? news.map(renderNewsCard).join("")
                            : `
                                <div class="media-empty">
                                    Ainda não há notícias relevantes
                                    sobre sua carreira.
                                </div>
                            `
                    }
                </div>
            </div>

            <div class="media-panel">
                <div class="media-panel-header">
                    <div>
                        <span class="media-kicker">
                            CONFRONTOS
                        </span>

                        <h3>
                            Rivalidades
                        </h3>
                    </div>

                    <button
                        class="media-link-button"
                        data-media-tab="rivalries"
                    >
                        Ver todas
                    </button>
                </div>

                <div class="media-rivalry-list">
                    ${
                        rivalries.length
                            ? rivalries
                                .map(renderRivalryCard)
                                .join("")
                            : `
                                <div class="media-empty">
                                    Nenhuma rivalidade ativa.
                                </div>
                            `
                    }
                </div>
            </div>
        </section>

        <section class="media-two-column">
            <div class="media-panel">
                <div class="media-panel-header">
                    <div>
                        <span class="media-kicker">
                            IMAGEM PÚBLICA
                        </span>

                        <h3>
                            Persona
                        </h3>
                    </div>
                </div>

                <div class="media-persona">
                    <div class="media-persona-icon">
                        ★
                    </div>

                    <div>
                        <h4>
                            ${escapeHTML(
                                getPersonaName(
                                    getPersona(database)
                                )
                            )}
                        </h4>

                        <p>
                            ${escapeHTML(
                                getPersonaDescription(
                                    getPersona(database)
                                )
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <div class="media-panel">
                <div class="media-panel-header">
                    <div>
                        <span class="media-kicker">
                            ATENÇÃO
                        </span>

                        <h3>
                            Controvérsias
                        </h3>
                    </div>

                    <button
                        class="media-link-button"
                        data-media-tab="controversies"
                    >
                        Ver todas
                    </button>
                </div>

                <div class="media-controversy-list">
                    ${
                        controversies.length
                            ? controversies
                                .map(renderControversyCard)
                                .join("")
                            : `
                                <div class="media-empty">
                                    Nenhuma controvérsia ativa.
                                </div>
                            `
                    }
                </div>
            </div>
        </section>
    `;
}

/* ============================================================
   SOCIAL MEDIA
   ============================================================ */

function renderSocial(database) {
    const social = getSocialMedia(database);
    const summary = getMediaSummary(database);

    const platforms = safeArray(
        social.platforms ||
        social.accounts
    );

    return `
        <section class="media-section">
            <div class="media-section-header">
                <div>
                    <span class="media-kicker">
                        REDES SOCIAIS
                    </span>

                    <h3>
                        Sua audiência
                    </h3>

                    <p>
                        Sua presença digital influencia fama,
                        popularidade e oportunidades comerciais.
                    </p>
                </div>
            </div>

            <div class="media-stats-grid">
                ${renderStatCard(
                    "Seguidores",
                    formatNumber(summary.followers),
                    summary.followerGrowth >= 0
                        ? `+${formatNumber(summary.followerGrowth)} crescimento`
                        : `${formatNumber(summary.followerGrowth)} crescimento`
                )}

                ${renderStatCard(
                    "Engajamento",
                    formatPercent(summary.engagement),
                    "Interação da audiência"
                )}

                ${renderStatCard(
                    "Plataformas",
                    formatNumber(summary.platforms),
                    "Canais ativos"
                )}
            </div>

            <div class="media-panel">
                <div class="media-panel-header">
                    <div>
                        <span class="media-kicker">
                            PERFIS
                        </span>

                        <h3>
                            Contas sociais
                        </h3>
                    </div>
                </div>

                <div class="media-platform-list">
                    ${
                        platforms.length
                            ? platforms.map((platform) => `
                                <div class="media-platform">
                                    <div>
                                        <strong>
                                            ${escapeHTML(
                                                platform.name ||
                                                platform.platform ||
                                                "Rede social"
                                            )}
                                        </strong>

                                        <span>
                                            ${formatNumber(
                                                platform.followers ||
                                                platform.audience ||
                                                0
                                            )} seguidores
                                        </span>
                                    </div>

                                    <div>
                                        ${formatPercent(
                                            platform.engagement ||
                                            0
                                        )}
                                    </div>
                                </div>
                            `).join("")
                            : `
                                <div class="media-empty">
                                    As redes sociais serão desbloqueadas
                                    conforme sua carreira avançar.
                                </div>
                            `
                    }
                </div>
            </div>
        </section>
    `;
}

/* ============================================================
   NOTÍCIAS
   ============================================================ */

function renderNews(database) {
    const news = getNews(database)
        .slice()
        .sort(
            (a, b) =>
                getNewsImportance(b) -
                getNewsImportance(a)
        );

    return `
        <section class="media-section">
            <div class="media-section-header">
                <div>
                    <span class="media-kicker">
                        IMPRENSA
                    </span>

                    <h3>
                        Notícias
                    </h3>

                    <p>
                        Tudo que a mídia está falando sobre você.
                    </p>
                </div>
            </div>

            <div class="media-news-grid">
                ${
                    news.length
                        ? news.map(renderNewsCard).join("")
                        : `
                            <div class="media-empty">
                                Nenhuma notícia registrada.
                            </div>
                        `
                }
            </div>
        </section>
    `;
}

/* ============================================================
   RIVALIDADES
   ============================================================ */

function renderRivalries(database) {
    const rivalries = getRivalries(database)
        .slice()
        .sort(
            (a, b) =>
                getRivalryIntensity(b) -
                getRivalryIntensity(a)
        );

    return `
        <section class="media-section">
            <div class="media-section-header">
                <div>
                    <span class="media-kicker">
                        RIVALIDADES
                    </span>

                    <h3>
                        Seus principais rivais
                    </h3>

                    <p>
                        Rivalidades podem aumentar a atenção da mídia,
                        vender mais lutas e mudar sua carreira.
                    </p>
                </div>
            </div>

            <div class="media-rivalry-grid">
                ${
                    rivalries.length
                        ? rivalries
                            .map(renderRivalryCard)
                            .join("")
                        : `
                            <div class="media-empty">
                                Você ainda não possui rivalidades.
                            </div>
                        `
                }
            </div>
        </section>
    `;
}

/* ============================================================
   CONTROVÉRSIAS
   ============================================================ */

function renderControversies(database) {
    const controversies = getControversies(database)
        .slice()
        .sort(
            (a, b) =>
                getControversySeverity(b) -
                getControversySeverity(a)
        );

    return `
        <section class="media-section">
            <div class="media-section-header">
                <div>
                    <span class="media-kicker">
                        CONTROVÉRSIAS
                    </span>

                    <h3>
                        Imagem e riscos
                    </h3>

                    <p>
                        Suas atitudes fora do octógono também podem
                        afetar sua reputação.
                    </p>
                </div>
            </div>

            <div class="media-controversy-grid">
                ${
                    controversies.length
                        ? controversies
                            .map(renderControversyCard)
                            .join("")
                        : `
                            <div class="media-empty">
                                Nenhuma controvérsia registrada.
                            </div>
                        `
                }
            </div>
        </section>
    `;
}

/* ============================================================
   PRÊMIOS
   ============================================================ */

function renderAwards(database) {
    const awards = getAwards(database)
        .slice()
        .reverse();

    return `
        <section class="media-section">
            <div class="media-section-header">
                <div>
                    <span class="media-kicker">
                        RECONHECIMENTO
                    </span>

                    <h3>
                        Prêmios e reconhecimentos
                    </h3>

                    <p>
                        Conquistas que ajudam a construir seu legado.
                    </p>
                </div>
            </div>

            <div class="media-awards-grid">
                ${
                    awards.length
                        ? awards.map(renderAwardCard).join("")
                        : `
                            <div class="media-empty">
                                Você ainda não recebeu prêmios.
                            </div>
                        `
                }
            </div>
        </section>
    `;
}

/* ============================================================
   TABS
   ============================================================ */

const MEDIA_TABS = [
    {
        id: "overview",
        label: "Visão geral"
    },
    {
        id: "social",
        label: "Redes sociais"
    },
    {
        id: "news",
        label: "Notícias"
    },
    {
        id: "rivalries",
        label: "Rivalidades"
    },
    {
        id: "controversies",
        label: "Controvérsias"
    },
    {
        id: "awards",
        label: "Prêmios"
    }
];

function renderTabs() {
    return `
        <div class="media-tabs">
            ${MEDIA_TABS.map((tab) => `
                <button
                    class="media-tab ${
                        mediaScreenState.activeTab === tab.id
                            ? "active"
                            : ""
                    }"
                    data-media-tab="${escapeHTML(tab.id)}"
                >
                    ${escapeHTML(tab.label)}
                </button>
            `).join("")}
        </div>
    `;
}

function renderActiveTab(database) {
    switch (mediaScreenState.activeTab) {
        case "social":
            return renderSocial(database);

        case "news":
            return renderNews(database);

        case "rivalries":
            return renderRivalries(database);

        case "controversies":
            return renderControversies(database);

        case "awards":
            return renderAwards(database);

        case "overview":
        default:
            return renderOverview(database);
    }
}

/* ============================================================
   CABEÇALHO
   ============================================================ */

function renderHeader(database) {
    const player = getPlayer(database);
    const summary = getMediaSummary(database);

    return `
        <header class="media-header">
            <div class="media-header-main">
                <div class="media-avatar">
                    ${escapeHTML(
                        getPlayerName(player)
                            .charAt(0)
                            .toUpperCase()
                    )}
                </div>

                <div>
                    <span class="media-kicker">
                        MEDIA CENTER
                    </span>

                    <h2>
                        ${escapeHTML(getPlayerName(player))}
                    </h2>

                    ${
                        getNickname(player)
                            ? `
                                <div class="media-nickname">
                                    "${escapeHTML(
                                        getNickname(player)
                                    )}"
                                </div>
                            `
                            : ""
                    }

                    <p>
                        ${escapeHTML(getCountry(player))}
                        ${
                            getCity(player)
                                ? ` • ${escapeHTML(getCity(player))}`
                                : ""
                        }
                        • ${escapeHTML(getAge(player))} anos
                    </p>
                </div>
            </div>

            <div class="media-header-score">
                <span>
                    NÍVEL DE FAMA
                </span>

                <strong>
                    ${escapeHTML(summary.fameLevel)}
                </strong>

                <small>
                    ${formatNumber(summary.fame)} / 100
                </small>
            </div>
        </header>
    `;
}

/* ============================================================
   RENDER PRINCIPAL
   ============================================================ */

function render(database = null) {
    const db = getDatabase(database);

    mediaScreenState.database = db;

    const content = ensureContent();

    content.innerHTML = `
        <div class="media-screen">
            ${renderHeader(db)}

            ${renderTabs()}

            <div class="media-screen-content">
                ${renderActiveTab(db)}
            </div>
        </div>
    `;

    mediaScreenState.lastRender = Date.now();

    bindEvents();

    return content;
}

/* ============================================================
   EVENTOS
   ============================================================ */

function bindEvents() {
    document
        .querySelectorAll("[data-media-tab]")
        .forEach((button) => {
            button.addEventListener("click", () => {
                const tab = button.dataset.mediaTab;

                if (!tab) return;

                mediaScreenState.activeTab = tab;

                render(mediaScreenState.database);
            });
        });
}

/* ============================================================
   ESTILOS
   ============================================================ */

function injectStyles() {
    if (getElement("mma-life-media-screen-styles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "mma-life-media-screen-styles";

    style.textContent = `
        .media-screen {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 24px;
            box-sizing: border-box;
        }

        .media-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 24px;
            padding: 28px;
            margin-bottom: 18px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 20px;
            background: rgba(255,255,255,.035);
        }

        .media-header-main {
            display: flex;
            align-items: center;
            gap: 18px;
            min-width: 0;
        }

        .media-avatar {
            width: 64px;
            height: 64px;
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            font-size: 25px;
            font-weight: 800;
            background: rgba(255,255,255,.08);
            border: 1px solid rgba(255,255,255,.1);
        }

        .media-kicker {
            display: block;
            margin-bottom: 6px;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: .14em;
            text-transform: uppercase;
            opacity: .55;
        }

        .media-header h2 {
            margin: 0;
            font-size: 28px;
            line-height: 1.1;
        }

        .media-header p {
            margin: 7px 0 0;
            opacity: .6;
            font-size: 13px;
        }

        .media-nickname {
            margin-top: 4px;
            opacity: .7;
            font-size: 13px;
            font-style: italic;
        }

        .media-header-score {
            min-width: 180px;
            padding: 16px 18px;
            border-radius: 16px;
            background: rgba(255,255,255,.05);
            text-align: right;
        }

        .media-header-score span {
            display: block;
            font-size: 10px;
            letter-spacing: .12em;
            font-weight: 800;
            opacity: .5;
        }

        .media-header-score strong {
            display: block;
            margin-top: 5px;
            font-size: 17px;
        }

        .media-header-score small {
            display: block;
            margin-top: 4px;
            opacity: .55;
        }

        .media-tabs {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding-bottom: 3px;
            margin-bottom: 20px;
        }

        .media-tab,
        .media-link-button {
            border: 1px solid rgba(255,255,255,.09);
            background: rgba(255,255,255,.035);
            color: inherit;
            border-radius: 10px;
            padding: 10px 14px;
            font: inherit;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            white-space: nowrap;
        }

        .media-tab:hover,
        .media-link-button:hover {
            background: rgba(255,255,255,.07);
        }

        .media-tab.active {
            background: rgba(255,255,255,.12);
            border-color: rgba(255,255,255,.18);
        }

        .media-section {
            margin-bottom: 22px;
        }

        .media-section-header {
            margin-bottom: 16px;
        }

        .media-section-header h3 {
            margin: 0;
            font-size: 21px;
        }

        .media-section-header p {
            margin: 7px 0 0;
            max-width: 720px;
            opacity: .6;
            font-size: 13px;
            line-height: 1.5;
        }

        .media-stats-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
        }

        .media-stat-card {
            padding: 18px;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,.08);
            background: rgba(255,255,255,.035);
        }

        .media-stat-label {
            font-size: 11px;
            font-weight: 800;
            letter-spacing: .08em;
            text-transform: uppercase;
            opacity: .5;
        }

        .media-stat-value {
            margin-top: 9px;
            font-size: 26px;
            font-weight: 800;
        }

        .media-stat-subtitle {
            margin-top: 5px;
            min-height: 18px;
            font-size: 12px;
            opacity: .6;
        }

        .media-progress {
            width: 100%;
            height: 5px;
            margin-top: 12px;
            border-radius: 999px;
            overflow: hidden;
            background: rgba(255,255,255,.08);
        }

        .media-progress-fill {
            height: 100%;
            border-radius: inherit;
            background: currentColor;
        }

        .media-two-column {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
            margin-bottom: 18px;
        }

        .media-panel {
            min-width: 0;
            padding: 20px;
            border-radius: 18px;
            border: 1px solid rgba(255,255,255,.08);
            background: rgba(255,255,255,.03);
        }

        .media-panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }

        .media-panel-header h3 {
            margin: 0;
            font-size: 18px;
        }

        .media-link-button {
            padding: 8px 11px;
            font-size: 11px;
        }

        .media-news-list,
        .media-rivalry-list,
        .media-controversy-list {
            display: grid;
            gap: 10px;
        }

        .media-news-grid,
        .media-rivalry-grid,
        .media-controversy-grid,
        .media-awards-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
        }

        .media-news-card {
            padding: 16px;
            border-radius: 14px;
            border: 1px solid rgba(255,255,255,.07);
            background: rgba(255,255,255,.025);
        }

        .media-news-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
            margin-bottom: 9px;
        }

        .media-news-tag {
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .12em;
            opacity: .5;
        }

        .media-news-date {
            font-size: 10px;
            opacity: .45;
        }

        .media-news-card h4 {
            margin: 0;
            font-size: 15px;
            line-height: 1.35;
        }

        .media-news-card p {
            margin: 8px 0 0;
            font-size: 12px;
            line-height: 1.55;
            opacity: .65;
        }

        .media-rivalry-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 13px;
            border-radius: 13px;
            border: 1px solid rgba(255,255,255,.07);
            background: rgba(255,255,255,.025);
        }

        .media-rivalry-icon {
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 11px;
            background: rgba(255,255,255,.07);
        }

        .media-rivalry-content {
            flex: 1;
            min-width: 0;
        }

        .media-rivalry-title {
            font-weight: 800;
            font-size: 14px;
        }

        .media-rivalry-status {
            margin-top: 2px;
            font-size: 11px;
            opacity: .55;
        }

        .media-small-label {
            margin-top: 6px;
            font-size: 10px;
            opacity: .5;
        }

        .media-controversy-card {
            padding: 13px;
            border-radius: 13px;
            border: 1px solid rgba(255,255,255,.07);
            background: rgba(255,255,255,.025);
        }

        .media-controversy-top {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 8px;
        }

        .media-controversy-top strong {
            font-size: 13px;
        }

        .media-controversy-top span {
            font-size: 10px;
            opacity: .55;
        }

        .media-persona {
            display: flex;
            gap: 14px;
            align-items: flex-start;
            padding: 16px;
            border-radius: 14px;
            background: rgba(255,255,255,.035);
        }

        .media-persona-icon {
            width: 42px;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 12px;
            background: rgba(255,255,255,.07);
            font-size: 20px;
        }

        .media-persona h4 {
            margin: 0;
            font-size: 16px;
        }

        .media-persona p {
            margin: 7px 0 0;
            font-size: 12px;
            line-height: 1.5;
            opacity: .6;
        }

        .media-platform-list {
            display: grid;
            gap: 9px;
        }

        .media-platform {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            padding: 14px;
            border-radius: 13px;
            border: 1px solid rgba(255,255,255,.07);
            background: rgba(255,255,255,.025);
        }

        .media-platform strong,
        .media-platform span {
            display: block;
        }

        .media-platform strong {
            font-size: 13px;
        }

        .media-platform span {
            margin-top: 3px;
            font-size: 11px;
            opacity: .55;
        }

        .media-platform > div:last-child {
            font-size: 12px;
            font-weight: 800;
        }

        .media-award-card {
            display: flex;
            gap: 13px;
            padding: 17px;
            border-radius: 15px;
            border: 1px solid rgba(255,255,255,.08);
            background: rgba(255,255,255,.03);
        }

        .media-award-icon {
            width: 42px;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 12px;
            background: rgba(255,255,255,.07);
        }

        .media-award-card strong {
            font-size: 14px;
        }

        .media-award-card p {
            margin: 5px 0 0;
            font-size: 11px;
            line-height: 1.45;
            opacity: .6;
        }

        .media-award-year {
            display: inline-block;
            margin-top: 7px;
            font-size: 10px;
            opacity: .5;
        }

        .media-empty {
            padding: 24px;
            border-radius: 14px;
            border: 1px dashed rgba(255,255,255,.1);
            text-align: center;
            font-size: 12px;
            line-height: 1.5;
            opacity: .55;
        }

        @media (max-width: 900px) {
            .media-stats-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .media-two-column {
                grid-template-columns: 1fr;
            }

            .media-news-grid,
            .media-rivalry-grid,
            .media-controversy-grid,
            .media-awards-grid {
                grid-template-columns: 1fr;
            }

            .media-header {
                align-items: flex-start;
                flex-direction: column;
            }

            .media-header-score {
                width: 100%;
                box-sizing: border-box;
                text-align: left;
            }
        }

        @media (max-width: 560px) {
            .media-screen {
                padding: 14px;
            }

            .media-header {
                padding: 20px;
                border-radius: 16px;
            }

            .media-header h2 {
                font-size: 22px;
            }

            .media-stats-grid {
                grid-template-columns: 1fr;
            }

            .media-tabs {
                margin-right: -4px;
            }

            .media-panel {
                padding: 16px;
            }
        }
    `;

    document.head.appendChild(style);
}

/* ============================================================
   API
   ============================================================ */

function initialize(database = null) {
    mediaScreenState.database = getDatabase(database);
    mediaScreenState.initialized = true;

    injectStyles();

    return render(mediaScreenState.database);
}

function refresh(database = null) {
    if (database) {
        mediaScreenState.database = database;
    }

    injectStyles();

    return render(
        mediaScreenState.database ||
        getDatabase()
    );
}

function open(tab = "overview", database = null) {
    const validTab = MEDIA_TABS.some(
        (item) => item.id === tab
    );

    mediaScreenState.activeTab = validTab
        ? tab
        : "overview";

    return initialize(database);
}

function close() {
    const content = getElement("mma-life-content");

    if (content) {
        content.innerHTML = "";
    }
}

function setTab(tab) {
    const exists = MEDIA_TABS.some(
        (item) => item.id === tab
    );

    if (!exists) {
        return false;
    }

    mediaScreenState.activeTab = tab;

    if (mediaScreenState.database) {
        render(mediaScreenState.database);
    }

    return true;
}

function getActiveTab() {
    return mediaScreenState.activeTab;
}

function getState() {
    return clone(mediaScreenState);
}

function getSnapshot() {
    return {
        version: MEDIA_SCREEN_VERSION,
        state: getState(),
        summary: mediaScreenState.database
            ? getMediaSummary(mediaScreenState.database)
            : null
    };
}

function validate(database = null) {
    const db = database || mediaScreenState.database;

    const errors = [];
    const warnings = [];

    if (!db) {
        errors.push("Database não encontrada.");
    }

    if (
        mediaScreenState.activeTab &&
        !MEDIA_TABS.some(
            (tab) =>
                tab.id === mediaScreenState.activeTab
        )
    ) {
        warnings.push(
            "A aba ativa não é reconhecida."
        );
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

/* ============================================================
   GLOBAL
   ============================================================ */

const mediaScreenAPI = {
    version: MEDIA_SCREEN_VERSION,

    initialize,
    refresh,
    render,
    open,
    close,

    setTab,
    getActiveTab,

    getDatabase,
    getMediaSummary,

    getFame,
    getFollowers,
    getReputation,
    getPopularity,
    getMarketability,
    getPersona,
    getSocialMedia,
    getNews,
    getRivalries,
    getControversies,
    getAwards,

    getState,
    getSnapshot,
    validate
};

if (typeof window !== "undefined") {
    window.mediaScreenAPI = mediaScreenAPI;
    window.MMA_LIFE_MEDIA_SCREEN = mediaScreenAPI;

    window.dispatchEvent(
        new CustomEvent("mma-life-media-screen-ready", {
            detail: mediaScreenAPI
        })
    );
}

export {
    MEDIA_SCREEN_VERSION,
    mediaScreenAPI,

    initialize,
    refresh,
    render,
    open,
    close,
    setTab,
    getActiveTab,
    getMediaSummary,
    getFame,
    getFollowers,
    getReputation,
    getPopularity,
    getMarketability,
    getPersona,
    getSocialMedia,
    getNews,
    getRivalries,
    getControversies,
    getAwards,
    getState,
    getSnapshot,
    validate
};

export default mediaScreenAPI;
