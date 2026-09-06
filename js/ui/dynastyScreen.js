/* ============================================================
   MMA LIFE DYNASTY
   UI — DYNASTY SCREEN
   Arquivo: js/ui/dynastyScreen.js
   ============================================================ */

const DYNASTY_SCREEN_VERSION = 1;

const dynastyScreenState = {
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
    return database || dynastyScreenState.database || window.MMA_LIFE_DATABASE || {};
}

function getPlayer(database) {
    return database?.player || {};
}

function getDynasty(database) {
    return database?.dynasty || {};
}

function getLife(database) {
    return database?.life || {};
}

function getBusiness(database) {
    return database?.business || {};
}

function getCareer(database) {
    return database?.career || {};
}

function getMedia(database) {
    return database?.media || {};
}

function getNested(object, path, fallback = null) {
    if (!object || !path) return fallback;

    const parts = Array.isArray(path)
        ? path
        : String(path).split(".");

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
    return value &&
        typeof value === "object" &&
        !Array.isArray(value)
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

    return new Intl.NumberFormat("pt-BR").format(
        Math.round(number)
    );
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

function capitalize(value) {
    if (!value) return "";

    const text = String(value)
        .replace(/_/g, " ")
        .trim();

    return text.charAt(0).toUpperCase() + text.slice(1);
}

function clamp(value, min = 0, max = 100) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return min;
    }

    return Math.max(
        min,
        Math.min(max, number)
    );
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

    return (
        player.fullName ||
        player.name ||
        `${firstName} ${lastName}`.trim() ||
        "Lutador"
    );
}

function getNickname(player) {
    return (
        player.nickname ||
        player.nickName ||
        player.apelido ||
        ""
    );
}

function getPlayerAge(player) {
    return (
        player.age ??
        player.identity?.age ??
        player.profile?.age ??
        18
    );
}

function getPlayerId(player, database) {
    return (
        player.id ||
        player.playerId ||
        database?.dynasty?.activeCharacterId ||
        "player"
    );
}

/* ============================================================
   DINASTIA — FONTES DE DADOS
   ============================================================ */

function getGenerations(database) {
    const dynasty = getDynasty(database);

    return safeArray(
        dynasty.generations ||
        dynasty.generationHistory ||
        dynasty.familyGenerations
    );
}

function getInheritance(database) {
    const dynasty = getDynasty(database);

    return safeArray(
        dynasty.inheritance ||
        dynasty.inheritances ||
        dynasty.succession ||
        dynasty.assetsTransferred
    );
}

function getGenealogy(database) {
    const dynasty = getDynasty(database);

    return safeArray(
        dynasty.genealogy ||
        dynasty.familyTree ||
        dynasty.tree ||
        dynasty.family
    );
}

function getHeir(database) {
    const dynasty = getDynasty(database);

    return (
        dynasty.heir ||
        dynasty.currentHeir ||
        dynasty.successor ||
        null
    );
}

function getActiveCharacter(database) {
    const dynasty = getDynasty(database);

    return (
        dynasty.activeCharacter ||
        dynasty.character ||
        null
    );
}

function getDynastyHistory(database) {
    const dynasty = getDynasty(database);

    return safeArray(
        dynasty.history ||
        dynasty.legacyHistory ||
        dynasty.events
    );
}

function getDynastyMilestones(database) {
    const dynasty = getDynasty(database);

    return safeArray(
        dynasty.milestones ||
        dynasty.achievements
    );
}

/* ============================================================
   FAMÍLIA
   ============================================================ */

function getFamily(database) {
    return getLife(database)?.family || {};
}

function getChildren(database) {
    const life = getLife(database);
    const family = getFamily(database);

    return safeArray(
        life.children ||
        family.children
    );
}

function getParents(database) {
    const life = getLife(database);
    const family = getFamily(database);

    return safeArray(
        life.parents ||
        family.parents
    );
}

function getSiblings(database) {
    const life = getLife(database);
    const family = getFamily(database);

    return safeArray(
        life.siblings ||
        family.siblings
    );
}

function getPartner(database) {
    const life = getLife(database);

    return (
        life.partner ||
        life.marriage?.partner ||
        null
    );
}

/* ============================================================
   PATRIMÔNIO
   ============================================================ */

function getFinances(database) {
    return (
        getBusiness(database)?.finances ||
        {}
    );
}

function getWealth(database) {
    return (
        getBusiness(database)?.wealth ||
        {}
    );
}

function getCash(database) {
    const finances = getFinances(database);

    return Number(
        finances.cash ??
        getBusiness(database)?.cash ??
        0
    );
}

function getNetWorth(database) {
    const finances = getFinances(database);
    const wealth = getWealth(database);

    return Number(
        wealth.netWorth ??
        finances.netWorth ??
        finances.totalWealth ??
        finances.cash ??
        0
    );
}

function getCareerEarnings(database) {
    const finances = getFinances(database);

    return Number(
        finances.careerEarnings ??
        finances.earnings ??
        getBusiness(database)?.income?.careerEarnings ??
        0
    );
}

function getAssets(database) {
    const finances = getFinances(database);

    return safeArray(
        finances.assets ||
        getBusiness(database)?.assets
    );
}

/* ============================================================
   LEGADO
   ============================================================ */

function getLegacy(database) {
    const dynasty = getDynasty(database);
    const career = getCareer(database);

    return (
        dynasty.legacy ||
        career.legacy ||
        {}
    );
}

function getLegacyScore(database) {
    const legacy = getLegacy(database);

    return Number(
        legacy.score ??
        legacy.legacyScore ??
        legacy.value ??
        0
    );
}

function getLegacyRank(database) {
    const legacy = getLegacy(database);

    return (
        legacy.rank ||
        legacy.level ||
        legacy.title ||
        "Em construção"
    );
}

function getHallOfFame(database) {
    const legacy = getLegacy(database);

    return (
        legacy.hallOfFame ||
        legacy.hof ||
        null
    );
}

/* ============================================================
   ESTATÍSTICAS DA DINASTIA
   ============================================================ */

function getGenerationCount(database) {
    const generations = getGenerations(database);

    if (generations.length > 0) {
        return generations.length;
    }

    const dynasty = getDynasty(database);

    return Number(
        dynasty.generationCount ||
        dynasty.generationsCount ||
        1
    );
}

function getFamilyMemberCount(database) {
    const genealogy = getGenealogy(database);

    if (genealogy.length > 0) {
        return genealogy.length;
    }

    return (
        getChildren(database).length +
        getParents(database).length +
        getSiblings(database).length +
        (getPartner(database) ? 1 : 0) +
        1
    );
}

function getDescendantCount(database) {
    const dynasty = getDynasty(database);

    const directValue =
        dynasty.descendantCount ??
        dynasty.descendantsCount;

    if (directValue !== undefined) {
        return Number(directValue) || 0;
    }

    return getChildren(database).length;
}

function getInheritanceValue(database) {
    const dynasty = getDynasty(database);

    const directValue =
        dynasty.inheritanceValue ??
        dynasty.totalInherited ??
        dynasty.totalInheritance;

    if (directValue !== undefined) {
        return Number(directValue) || 0;
    }

    return getInheritance(database).reduce(
        (total, item) => {
            return total + Number(
                item.value ??
                item.amount ??
                item.total ??
                0
            );
        },
        0
    );
}

function getDynastyWealth(database) {
    const dynasty = getDynasty(database);

    return Number(
        dynasty.familyWealth ??
        dynasty.dynastyWealth ??
        dynasty.totalWealth ??
        getNetWorth(database)
    );
}

function getDynastyScore(database) {
    const dynasty = getDynasty(database);

    const direct =
        dynasty.score ??
        dynasty.dynastyScore ??
        dynasty.legacyScore;

    if (direct !== undefined) {
        return clamp(direct, 0, 100);
    }

    const legacy = clamp(
        getLegacyScore(database),
        0,
        100
    );

    const generations =
        Math.min(
            getGenerationCount(database) * 5,
            25
        );

    const descendants =
        Math.min(
            getDescendantCount(database) * 3,
            20
        );

    const wealth =
        getDynastyWealth(database) >= 100000000
            ? 20
            : getDynastyWealth(database) >= 10000000
                ? 15
                : getDynastyWealth(database) >= 1000000
                    ? 10
                    : 5;

    return clamp(
        legacy * 0.5 +
        generations +
        descendants +
        wealth,
        0,
        100
    );
}

/* ============================================================
   NÍVEIS
   ============================================================ */

function getDynastyLevel(score) {
    if (score >= 90) return "Dinastia lendária";
    if (score >= 75) return "Dinastia poderosa";
    if (score >= 60) return "Dinastia estabelecida";
    if (score >= 40) return "Família influente";
    if (score >= 20) return "Dinastia emergente";

    return "Família em construção";
}

function getLegacyLevel(score) {
    if (score >= 90) return "Lenda";
    if (score >= 75) return "Ícone";
    if (score >= 60) return "Grande legado";
    if (score >= 40) return "Legado respeitável";
    if (score >= 20) return "Legado em crescimento";

    return "Legado inicial";
}

/* ============================================================
   HERDEIRO
   ============================================================ */

function getHeirName(heir) {
    if (!heir) return "Nenhum herdeiro definido";

    return (
        heir.fullName ||
        heir.name ||
        `${heir.firstName || ""} ${heir.lastName || ""}`.trim() ||
        "Herdeiro"
    );
}

function getHeirAge(heir) {
    if (!heir) return null;

    return (
        heir.age ??
        heir.currentAge ??
        heir.identity?.age ??
        null
    );
}

function getHeirRelationship(heir) {
    if (!heir) return "";

    return (
        heir.relationship ||
        heir.relation ||
        heir.type ||
        "Descendente"
    );
}

function getHeirStatus(database) {
    const heir = getHeir(database);

    if (!heir) {
        return {
            exists: false,
            label: "Sem herdeiro"
        };
    }

    return {
        exists: true,
        label:
            heir.ready ||
            heir.isReady
                ? "Pronto para sucessão"
                : "Herdeiro definido"
    };
}

/* ============================================================
   GERAÇÕES
   ============================================================ */

function getGenerationLabel(generation, index) {
    return (
        generation.name ||
        generation.title ||
        generation.label ||
        `Geração ${index + 1}`
    );
}

function getGenerationCharacter(generation) {
    return (
        generation.characterName ||
        generation.name ||
        generation.playerName ||
        generation.fighterName ||
        "Personagem"
    );
}

function getGenerationStatus(generation) {
    return (
        generation.status ||
        generation.state ||
        "Concluída"
    );
}

function getGenerationWealth(generation) {
    return Number(
        generation.wealth ??
        generation.netWorth ??
        generation.legacyValue ??
        0
    );
}

/* ============================================================
   GENEALOGIA
   ============================================================ */

function getMemberName(member) {
    if (!member) return "Membro da família";

    return (
        member.fullName ||
        member.name ||
        `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
        "Membro da família"
    );
}

function getMemberRelation(member) {
    if (!member) return "";

    return (
        member.relationship ||
        member.relation ||
        member.type ||
        "Parente"
    );
}

function getMemberGeneration(member) {
    const generation =
        member.generation ??
        member.generationIndex ??
        member.gen;

    if (generation === undefined) {
        return null;
    }

    return Number(generation);
}

/* ============================================================
   RESUMO
   ============================================================ */

function getDynastySummary(database) {
    const score = getDynastyScore(database);
    const legacyScore = clamp(
        getLegacyScore(database)
    );

    return {
        generationCount:
            getGenerationCount(database),

        familyMemberCount:
            getFamilyMemberCount(database),

        descendantCount:
            getDescendantCount(database),

        inheritanceValue:
            getInheritanceValue(database),

        dynastyWealth:
            getDynastyWealth(database),

        dynastyScore:
            score,

        dynastyLevel:
            getDynastyLevel(score),

        legacyScore,

        legacyLevel:
            getLegacyLevel(legacyScore),

        heir:
            getHeir(database),

        heirStatus:
            getHeirStatus(database),

        hallOfFame:
            getHallOfFame(database)
    };
}

/* ============================================================
   COMPONENTES VISUAIS
   ============================================================ */

function renderStatCard(
    label,
    value,
    subtitle,
    progress = null
) {
    const progressValue =
        progress === null
            ? null
            : clamp(progress);

    return `
        <div class="dynasty-stat-card">
            <div class="dynasty-stat-label">
                ${escapeHTML(label)}
            </div>

            <div class="dynasty-stat-value">
                ${escapeHTML(value)}
            </div>

            <div class="dynasty-stat-subtitle">
                ${escapeHTML(subtitle)}
            </div>

            ${
                progressValue !== null
                    ? `
                        <div class="dynasty-progress">
                            <div
                                class="dynasty-progress-fill"
                                style="width:${progressValue}%"
                            ></div>
                        </div>
                    `
                    : ""
            }
        </div>
    `;
}

function renderMemberCard(member) {
    const name = getMemberName(member);
    const relation = getMemberRelation(member);
    const age =
        member.age ??
        member.currentAge ??
        null;

    return `
        <article class="dynasty-member-card">
            <div class="dynasty-member-avatar">
                ${escapeHTML(
                    name.charAt(0).toUpperCase()
                )}
            </div>

            <div class="dynasty-member-info">
                <strong>
                    ${escapeHTML(name)}
                </strong>

                <span>
                    ${escapeHTML(
                        capitalize(relation)
                    )}
                    ${
                        age !== null
                            ? ` • ${escapeHTML(age)} anos`
                            : ""
                    }
                </span>
            </div>
        </article>
    `;
}

function renderGenerationCard(
    generation,
    index
) {
    const wealth =
        getGenerationWealth(generation);

    return `
        <article class="dynasty-generation-card">
            <div class="dynasty-generation-number">
                ${index + 1}
            </div>

            <div class="dynasty-generation-content">
                <span class="dynasty-kicker">
                    ${escapeHTML(
                        getGenerationLabel(
                            generation,
                            index
                        )
                    )}
                </span>

                <h4>
                    ${escapeHTML(
                        getGenerationCharacter(
                            generation
                        )
                    )}
                </h4>

                <div class="dynasty-generation-meta">
                    <span>
                        ${escapeHTML(
                            capitalize(
                                getGenerationStatus(
                                    generation
                                )
                            )
                        )}
                    </span>

                    ${
                        wealth > 0
                            ? `
                                <span>
                                    ${formatMoney(wealth)}
                                </span>
                            `
                            : ""
                    }
                </div>
            </div>
        </article>
    `;
}

function renderInheritanceCard(item) {
    const value = Number(
        item.value ??
        item.amount ??
        item.total ??
        0
    );

    const description =
        item.description ||
        item.assetName ||
        item.asset ||
        item.type ||
        "Transferência patrimonial";

    const from =
        item.from ||
        item.previousOwner ||
        item.source ||
        "";

    const to =
        item.to ||
        item.newOwner ||
        item.destination ||
        "";

    return `
        <article class="dynasty-inheritance-card">
            <div class="dynasty-inheritance-icon">
                ⇢
            </div>

            <div class="dynasty-inheritance-content">
                <strong>
                    ${escapeHTML(
                        capitalize(description)
                    )}
                </strong>

                ${
                    value > 0
                        ? `
                            <span>
                                ${formatMoney(value)}
                            </span>
                        `
                        : ""
                }

                ${
                    from || to
                        ? `
                            <small>
                                ${escapeHTML(from || "—")}
                                →
                                ${escapeHTML(to || "—")}
                            </small>
                        `
                        : ""
                }
            </div>
        </article>
    `;
}

function renderTimelineItem(item) {
    const title =
        item.title ||
        item.name ||
        item.event ||
        item.description ||
        "Evento da dinastia";

    const date =
        item.date ||
        item.createdAt ||
        item.year ||
        "";

    return `
        <div class="dynasty-timeline-item">
            <div class="dynasty-timeline-dot"></div>

            <div class="dynasty-timeline-content">
                <strong>
                    ${escapeHTML(title)}
                </strong>

                ${
                    date
                        ? `
                            <span>
                                ${escapeHTML(date)}
                            </span>
                        `
                        : ""
                }
            </div>
        </div>
    `;
}

/* ============================================================
   OVERVIEW
   ============================================================ */

function renderOverview(database) {
    const summary =
        getDynastySummary(database);

    const generations =
        getGenerations(database)
            .slice()
            .reverse()
            .slice(0, 5);

    const children =
        getChildren(database)
            .slice(0, 4);

    const history =
        getDynastyHistory(database)
            .slice()
            .reverse()
            .slice(0, 5);

    const heir =
        summary.heir;

    return `
        <section class="dynasty-section">
            <div class="dynasty-section-header">
                <div>
                    <span class="dynasty-kicker">
                        DINASTIA
                    </span>

                    <h3>
                        Construindo algo que vai além da sua carreira
                    </h3>

                    <p>
                        Sua carreira pode terminar, mas seu patrimônio,
                        sua família e seu legado podem continuar por
                        gerações.
                    </p>
                </div>
            </div>

            <div class="dynasty-stats-grid">
                ${renderStatCard(
                    "Pontuação da dinastia",
                    formatNumber(
                        summary.dynastyScore
                    ),
                    summary.dynastyLevel,
                    summary.dynastyScore
                )}

                ${renderStatCard(
                    "Gerações",
                    formatNumber(
                        summary.generationCount
                    ),
                    "Histórico familiar"
                )}

                ${renderStatCard(
                    "Descendentes",
                    formatNumber(
                        summary.descendantCount
                    ),
                    "Família futura"
                )}

                ${renderStatCard(
                    "Membros",
                    formatNumber(
                        summary.familyMemberCount
                    ),
                    "Árvore familiar"
                )}

                ${renderStatCard(
                    "Patrimônio familiar",
                    formatMoney(
                        summary.dynastyWealth
                    ),
                    "Riqueza acumulada"
                )}

                ${renderStatCard(
                    "Legado",
                    formatNumber(
                        summary.legacyScore
                    ),
                    summary.legacyLevel,
                    summary.legacyScore
                )}
            </div>
        </section>

        <section class="dynasty-two-column">
            <div class="dynasty-panel">
                <div class="dynasty-panel-header">
                    <div>
                        <span class="dynasty-kicker">
                            SUCESSÃO
                        </span>

                        <h3>
                            Herdeiro
                        </h3>
                    </div>
                </div>

                ${
                    heir
                        ? `
                            <div class="dynasty-heir-card">
                                <div class="dynasty-heir-avatar">
                                    ${escapeHTML(
                                        getHeirName(heir)
                                            .charAt(0)
                                            .toUpperCase()
                                    )}
                                </div>

                                <div>
                                    <h4>
                                        ${escapeHTML(
                                            getHeirName(
                                                heir
                                            )
                                        )}
                                    </h4>

                                    <p>
                                        ${escapeHTML(
                                            capitalize(
                                                getHeirRelationship(
                                                    heir
                                                )
                                            )
                                        )}
                                        ${
                                            getHeirAge(
                                                heir
                                            ) !== null
                                                ? ` • ${escapeHTML(
                                                    getHeirAge(
                                                        heir
                                                    )
                                                )} anos`
                                                : ""
                                        }
                                    </p>

                                    <span class="dynasty-heir-status">
                                        ${escapeHTML(
                                            summary
                                                .heirStatus
                                                .label
                                        )}
                                    </span>
                                </div>
                            </div>
                        `
                        : `
                            <div class="dynasty-empty">
                                <div class="dynasty-empty-icon">
                                    ♔
                                </div>

                                <strong>
                                    Nenhum herdeiro definido
                                </strong>

                                <p>
                                    Seus descendentes poderão assumir
                                    seu legado no futuro.
                                </p>
                            </div>
                        `
                }
            </div>

            <div class="dynasty-panel">
                <div class="dynasty-panel-header">
                    <div>
                        <span class="dynasty-kicker">
                            PATRIMÔNIO
                        </span>

                        <h3>
                            Riqueza da família
                        </h3>
                    </div>
                </div>

                <div class="dynasty-wealth">
                    <div class="dynasty-wealth-main">
                        ${formatMoney(
                            summary.dynastyWealth
                        )}
                    </div>

                    <div class="dynasty-wealth-grid">
                        <div>
                            <span>
                                Seu patrimônio
                            </span>

                            <strong>
                                ${formatMoney(
                                    getNetWorth(
                                        database
                                    )
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Ganhos de carreira
                            </span>

                            <strong>
                                ${formatMoney(
                                    getCareerEarnings(
                                        database
                                    )
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Heranças
                            </span>

                            <strong>
                                ${formatMoney(
                                    summary.inheritanceValue
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Ativos
                            </span>

                            <strong>
                                ${formatNumber(
                                    getAssets(
                                        database
                                    ).length
                                )}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="dynasty-two-column">
            <div class="dynasty-panel">
                <div class="dynasty-panel-header">
                    <div>
                        <span class="dynasty-kicker">
                            FAMÍLIA
                        </span>

                        <h3>
                            Próxima geração
                        </h3>
                    </div>

                    <button
                        class="dynasty-link-button"
                        data-dynasty-tab="genealogy"
                    >
                        Ver árvore
                    </button>
                </div>

                <div class="dynasty-members-list">
                    ${
                        children.length
                            ? children
                                .map(
                                    renderMemberCard
                                )
                                .join("")
                            : `
                                <div class="dynasty-empty">
                                    Você ainda não possui
                                    descendentes registrados.
                                </div>
                            `
                    }
                </div>
            </div>

            <div class="dynasty-panel">
                <div class="dynasty-panel-header">
                    <div>
                        <span class="dynasty-kicker">
                            HISTÓRIA
                        </span>

                        <h3>
                            Últimos acontecimentos
                        </h3>
                    </div>

                    <button
                        class="dynasty-link-button"
                        data-dynasty-tab="history"
                    >
                        Ver histórico
                    </button>
                </div>

                <div class="dynasty-timeline">
                    ${
                        history.length
                            ? history
                                .map(
                                    renderTimelineItem
                                )
                                .join("")
                            : `
                                <div class="dynasty-empty">
                                    A história da sua dinastia
                                    começará a ser registrada
                                    aqui.
                                </div>
                            `
                    }
                </div>
            </div>
        </section>

        <section class="dynasty-section">
            <div class="dynasty-section-header">
                <div>
                    <span class="dynasty-kicker">
                        GERAÇÕES
                    </span>

                    <h3>
                        Linha da sua dinastia
                    </h3>
                </div>
            </div>

            <div class="dynasty-generations">
                ${
                    generations.length
                        ? generations
                            .map(
                                (
                                    generation,
                                    index
                                ) =>
                                    renderGenerationCard(
                                        generation,
                                        index
                                    )
                            )
                            .join("")
                        : `
                            <div class="dynasty-empty">
                                Sua primeira geração está
                                construindo o ponto de partida
                                da dinastia.
                            </div>
                        `
                }
            </div>
        </section>
    `;
}

/* ============================================================
   GENEALOGIA
   ============================================================ */

function renderGenealogy(database) {
    const genealogy =
        getGenealogy(database);

    const parents =
        getParents(database);

    const siblings =
        getSiblings(database);

    const children =
        getChildren(database);

    const partner =
        getPartner(database);

    const player =
        getPlayer(database);

    let members = [];

    if (genealogy.length) {
        members = genealogy;
    } else {
        members = [
            ...parents,
            ...siblings,
            ...(partner ? [partner] : []),
            ...children
        ];
    }

    return `
        <section class="dynasty-section">
            <div class="dynasty-section-header">
                <div>
                    <span class="dynasty-kicker">
                        GENEALOGIA
                    </span>

                    <h3>
                        Árvore familiar
                    </h3>

                    <p>
                        Todas as pessoas que fazem parte da
                        história da sua família.
                    </p>
                </div>
            </div>

            <div class="dynasty-tree">
                <div class="dynasty-tree-level">
                    <div class="dynasty-tree-label">
                        VOCÊ
                    </div>

                    <div class="dynasty-tree-node current">
                        <div class="dynasty-tree-avatar">
                            ${escapeHTML(
                                getPlayerName(player)
                                    .charAt(0)
                                    .toUpperCase()
                            )}
                        </div>

                        <strong>
                            ${escapeHTML(
                                getPlayerName(player)
                            )}
                        </strong>

                        <span>
                            Geração atual
                        </span>
                    </div>
                </div>

                <div class="dynasty-tree-connector">
                    ↓
                </div>

                <div class="dynasty-tree-level">
                    <div class="dynasty-tree-label">
                        DESCENDENTES
                    </div>

                    <div class="dynasty-tree-nodes">
                        ${
                            children.length
                                ? children
                                    .map(
                                        renderTreeNode
                                    )
                                    .join("")
                                : `
                                    <div class="dynasty-empty">
                                        Nenhum descendente
                                        registrado.
                                    </div>
                                `
                        }
                    </div>
                </div>
            </div>

            <div class="dynasty-family-groups">
                <div class="dynasty-family-group">
                    <h4>
                        Pais
                    </h4>

                    <div class="dynasty-members-list">
                        ${
                            parents.length
                                ? parents
                                    .map(
                                        renderMemberCard
                                    )
                                    .join("")
                                : `
                                    <div class="dynasty-empty">
                                        Nenhum registro.
                                    </div>
                                `
                        }
                    </div>
                </div>

                <div class="dynasty-family-group">
                    <h4>
                        Irmãos
                    </h4>

                    <div class="dynasty-members-list">
                        ${
                            siblings.length
                                ? siblings
                                    .map(
                                        renderMemberCard
                                    )
                                    .join("")
                                : `
                                    <div class="dynasty-empty">
                                        Nenhum registro.
                                    </div>
                                `
                        }
                    </div>
                </div>

                <div class="dynasty-family-group">
                    <h4>
                        Outros membros
                    </h4>

                    <div class="dynasty-members-list">
                        ${
                            members.length
                                ? members
                                    .slice(0, 10)
                                    .map(
                                        renderMemberCard
                                    )
                                    .join("")
                                : `
                                    <div class="dynasty-empty">
                                        A árvore familiar ainda
                                        está sendo construída.
                                    </div>
                                `
                        }
                    </div>
                </div>
            </div>
        </section>
    `;
}

function renderTreeNode(member) {
    const name =
        getMemberName(member);

    return `
        <div class="dynasty-tree-node">
            <div class="dynasty-tree-avatar">
                ${escapeHTML(
                    name.charAt(0).toUpperCase()
                )}
            </div>

            <strong>
                ${escapeHTML(name)}
            </strong>

            <span>
                ${escapeHTML(
                    capitalize(
                        getMemberRelation(member)
                    )
                )}
            </span>
        </div>
    `;
}

/* ============================================================
   GERAÇÕES
   ============================================================ */

function renderGenerations(database) {
    const generations =
        getGenerations(database);

    return `
        <section class="dynasty-section">
            <div class="dynasty-section-header">
                <div>
                    <span class="dynasty-kicker">
                        GERAÇÕES
                    </span>

                    <h3>
                        História da família
                    </h3>

                    <p>
                        Cada personagem jogável pode representar
                        uma nova geração da sua dinastia.
                    </p>
                </div>
            </div>

            <div class="dynasty-generations-large">
                ${
                    generations.length
                        ? generations
                            .map(
                                (
                                    generation,
                                    index
                                ) =>
                                    renderGenerationCard(
                                        generation,
                                        index
                                    )
                            )
                            .join("")
                        : `
                            <div class="dynasty-empty">
                                <div class="dynasty-empty-icon">
                                    ♜
                                </div>

                                <strong>
                                    Primeira geração
                                </strong>

                                <p>
                                    Esta é a origem da sua
                                    dinastia. Quando a sucessão
                                    acontecer, uma nova geração
                                    poderá continuar sua história.
                                </p>
                            </div>
                        `
                }
            </div>
        </section>
    `;
}

/* ============================================================
   HERANÇA
   ============================================================ */

function renderInheritance(database) {
    const inheritance =
        getInheritance(database);

    const total =
        getInheritanceValue(database);

    return `
        <section class="dynasty-section">
            <div class="dynasty-section-header">
                <div>
                    <span class="dynasty-kicker">
                        SUCESSÃO PATRIMONIAL
                    </span>

                    <h3>
                        Heranças e transferências
                    </h3>

                    <p>
                        O patrimônio acumulado pela família pode
                        passar para a próxima geração.
                    </p>
                </div>
            </div>

            <div class="dynasty-inheritance-summary">
                <span>
                    Total transferido
                </span>

                <strong>
                    ${formatMoney(total)}
                </strong>
            </div>

            <div class="dynasty-inheritance-list">
                ${
                    inheritance.length
                        ? inheritance
                            .map(
                                renderInheritanceCard
                            )
                            .join("")
                        : `
                            <div class="dynasty-empty">
                                Nenhuma transferência de patrimônio
                                foi registrada ainda.
                            </div>
                        `
                }
            </div>
        </section>
    `;
}

/* ============================================================
   HISTÓRICO
   ============================================================ */

function renderHistory(database) {
    const history =
        getDynastyHistory(database)
            .slice()
            .reverse();

    return `
        <section class="dynasty-section">
            <div class="dynasty-section-header">
                <div>
                    <span class="dynasty-kicker">
                        HISTÓRICO
                    </span>

                    <h3>
                        História da dinastia
                    </h3>

                    <p>
                        Os momentos que definiram sua família
                        ao longo das gerações.
                    </p>
                </div>
            </div>

            <div class="dynasty-history">
                ${
                    history.length
                        ? history
                            .map(
                                renderTimelineItem
                            )
                            .join("")
                        : `
                            <div class="dynasty-empty">
                                Nenhum acontecimento histórico
                                registrado ainda.
                            </div>
                        `
                }
            </div>
        </section>
    `;
}

/* ============================================================
   LEGADO
   ============================================================ */

function renderLegacy(database) {
    const legacyScore =
        clamp(getLegacyScore(database));

    const dynastyScore =
        getDynastyScore(database);

    const hallOfFame =
        getHallOfFame(database);

    const milestones =
        getDynastyMilestones(database);

    return `
        <section class="dynasty-section">
            <div class="dynasty-section-header">
                <div>
                    <span class="dynasty-kicker">
                        LEGADO
                    </span>

                    <h3>
                        O que ficará depois de você
                    </h3>

                    <p>
                        Seu legado é formado por conquistas,
                        títulos, dinheiro, influência e pela
                        continuidade da sua família.
                    </p>
                </div>
            </div>

            <div class="dynasty-legacy-grid">
                ${renderStatCard(
                    "Legado pessoal",
                    formatNumber(
                        legacyScore
                    ),
                    getLegacyLevel(
                        legacyScore
                    ),
                    legacyScore
                )}

                ${renderStatCard(
                    "Dinastia",
                    formatNumber(
                        dynastyScore
                    ),
                    getDynastyLevel(
                        dynastyScore
                    ),
                    dynastyScore
                )}

                ${renderStatCard(
                    "Gerações",
                    formatNumber(
                        getGenerationCount(
                            database
                        )
                    ),
                    "Continuidade familiar"
                )}

                ${renderStatCard(
                    "Patrimônio",
                    formatMoney(
                        getDynastyWealth(
                            database
                        )
                    ),
                    "Riqueza familiar"
                )}
            </div>

            <div class="dynasty-panel">
                <div class="dynasty-panel-header">
                    <div>
                        <span class="dynasty-kicker">
                            HALL DA FAMA
                        </span>

                        <h3>
                            Reconhecimento histórico
                        </h3>
                    </div>
                </div>

                ${
                    hallOfFame
                        ? `
                            <div class="dynasty-hof-card">
                                <div class="dynasty-hof-icon">
                                    🏆
                                </div>

                                <div>
                                    <strong>
                                        Hall da Fama
                                    </strong>

                                    <p>
                                        ${
                                            escapeHTML(
                                                hallOfFame.name ||
                                                hallOfFame.title ||
                                                "Membro do Hall da Fama"
                                            )
                                        }
                                    </p>
                                </div>
                            </div>
                        `
                        : `
                            <div class="dynasty-empty">
                                O Hall da Fama ainda não faz
                                parte da sua história.
                            </div>
                        `
                }
            </div>

            <div class="dynasty-panel">
                <div class="dynasty-panel-header">
                    <div>
                        <span class="dynasty-kicker">
                            MARCOS
                        </span>

                        <h3>
                            Grandes momentos
                        </h3>
                    </div>
                </div>

                <div class="dynasty-milestones">
                    ${
                        milestones.length
                            ? milestones
                                .map(
                                    renderTimelineItem
                                )
                                .join("")
                            : `
                                <div class="dynasty-empty">
                                    Os grandes marcos da sua
                                    dinastia aparecerão aqui.
                                </div>
                            `
                    }
                </div>
            </div>
        </section>
    `;
}

/* ============================================================
   TABS
   ============================================================ */

const DYNASTY_TABS = [
    {
        id: "overview",
        label: "Visão geral"
    },
    {
        id: "genealogy",
        label: "Genealogia"
    },
    {
        id: "generations",
        label: "Gerações"
    },
    {
        id: "inheritance",
        label: "Herança"
    },
    {
        id: "history",
        label: "Histórico"
    },
    {
        id: "legacy",
        label: "Legado"
    }
];

function renderTabs() {
    return `
        <div class="dynasty-tabs">
            ${DYNASTY_TABS.map((tab) => `
                <button
                    class="dynasty-tab ${
                        dynastyScreenState.activeTab === tab.id
                            ? "active"
                            : ""
                    }"
                    data-dynasty-tab="${escapeHTML(
                        tab.id
                    )}"
                >
                    ${escapeHTML(
                        tab.label
                    )}
                </button>
            `).join("")}
        </div>
    `;
}

function renderActiveTab(database) {
    switch (
        dynastyScreenState.activeTab
    ) {
        case "genealogy":
            return renderGenealogy(database);

        case "generations":
            return renderGenerations(database);

        case "inheritance":
            return renderInheritance(database);

        case "history":
            return renderHistory(database);

        case "legacy":
            return renderLegacy(database);

        case "overview":
        default:
            return renderOverview(database);
    }
}

/* ============================================================
   CABEÇALHO
   ============================================================ */

function renderHeader(database) {
    const player =
        getPlayer(database);

    const summary =
        getDynastySummary(database);

    return `
        <header class="dynasty-header">
            <div class="dynasty-header-main">
                <div class="dynasty-avatar">
                    ${escapeHTML(
                        getPlayerName(player)
                            .charAt(0)
                            .toUpperCase()
                    )}
                </div>

                <div>
                    <span class="dynasty-kicker">
                        MMA LIFE DYNASTY
                    </span>

                    <h2>
                        ${escapeHTML(
                            getPlayerName(player)
                        )}
                    </h2>

                    ${
                        getNickname(player)
                            ? `
                                <div class="dynasty-nickname">
                                    "${escapeHTML(
                                        getNickname(
                                            player
                                        )
                                    )}"
                                </div>
                            `
                            : ""
                    }

                    <p>
                        ${escapeHTML(
                            getPlayerAge(player)
                        )} anos • Geração atual
                    </p>
                </div>
            </div>

            <div class="dynasty-header-score">
                <span>
                    STATUS DA DINASTIA
                </span>

                <strong>
                    ${escapeHTML(
                        summary.dynastyLevel
                    )}
                </strong>

                <small>
                    ${formatNumber(
                        summary.dynastyScore
                    )} / 100
                </small>
            </div>
        </header>
    `;
}

/* ============================================================
   RENDER
   ============================================================ */

function render(database = null) {
    const db =
        getDatabase(database);

    dynastyScreenState.database = db;

    const content =
        ensureContent();

    content.innerHTML = `
        <div class="dynasty-screen">
            ${renderHeader(db)}

            ${renderTabs()}

            <div class="dynasty-screen-content">
                ${renderActiveTab(db)}
            </div>
        </div>
    `;

    dynastyScreenState.lastRender =
        Date.now();

    bindEvents();

    return content;
}

/* ============================================================
   EVENTOS
   ============================================================ */

function bindEvents() {
    document
        .querySelectorAll(
            "[data-dynasty-tab]"
        )
        .forEach((button) => {
            button.addEventListener(
                "click",
                () => {
                    const tab =
                        button.dataset
                            .dynastyTab;

                    if (!tab) return;

                    setTab(tab);
                }
            );
        });
}

/* ============================================================
   ESTILOS
   ============================================================ */

function injectStyles() {
    if (
        getElement(
            "mma-life-dynasty-screen-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement("style");

    style.id =
        "mma-life-dynasty-screen-styles";

    style.textContent = `
        .dynasty-screen {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 24px;
            box-sizing: border-box;
        }

        .dynasty-header {
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

        .dynasty-header-main {
            display: flex;
            align-items: center;
            gap: 18px;
            min-width: 0;
        }

        .dynasty-avatar {
            width: 64px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 18px;
            background: rgba(255,255,255,.08);
            border: 1px solid rgba(255,255,255,.1);
            font-size: 25px;
            font-weight: 800;
        }

        .dynasty-header h2 {
            margin: 0;
            font-size: 28px;
            line-height: 1.1;
        }

        .dynasty-header p {
            margin: 7px 0 0;
            font-size: 13px;
            opacity: .6;
        }

        .dynasty-nickname {
            margin-top: 4px;
            font-size: 13px;
            font-style: italic;
            opacity: .7;
        }

        .dynasty-kicker {
            display: block;
            margin-bottom: 6px;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: .14em;
            text-transform: uppercase;
            opacity: .5;
        }

        .dynasty-header-score {
            min-width: 200px;
            padding: 16px 18px;
            border-radius: 16px;
            background: rgba(255,255,255,.05);
            text-align: right;
        }

        .dynasty-header-score span {
            display: block;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .12em;
            opacity: .5;
        }

        .dynasty-header-score strong {
            display: block;
            margin-top: 5px;
            font-size: 17px;
        }

        .dynasty-header-score small {
            display: block;
            margin-top: 4px;
            font-size: 11px;
            opacity: .55;
        }

        .dynasty-tabs {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            margin-bottom: 20px;
            padding-bottom: 3px;
        }

        .dynasty-tab,
        .dynasty-link-button {
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

        .dynasty-tab:hover,
        .dynasty-link-button:hover {
            background: rgba(255,255,255,.07);
        }

        .dynasty-tab.active {
            background: rgba(255,255,255,.12);
            border-color: rgba(255,255,255,.18);
        }

        .dynasty-section {
            margin-bottom: 22px;
        }

        .dynasty-section-header {
            margin-bottom: 16px;
        }

        .dynasty-section-header h3 {
            margin: 0;
            font-size: 21px;
        }

        .dynasty-section-header p {
            max-width: 760px;
            margin: 7px 0 0;
            font-size: 13px;
            line-height: 1.55;
            opacity: .6;
        }

        .dynasty-stats-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
        }

        .dynasty-stat-card {
            padding: 18px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 16px;
            background: rgba(255,255,255,.035);
        }

        .dynasty-stat-label {
            font-size: 10px;
            font-weight: 900;
            letter-spacing: .08em;
            text-transform: uppercase;
            opacity: .5;
        }

        .dynasty-stat-value {
            margin-top: 9px;
            font-size: 25px;
            font-weight: 800;
        }

        .dynasty-stat-subtitle {
            min-height: 18px;
            margin-top: 5px;
            font-size: 11px;
            opacity: .55;
        }

        .dynasty-progress {
            width: 100%;
            height: 5px;
            margin-top: 12px;
            overflow: hidden;
            border-radius: 999px;
            background: rgba(255,255,255,.08);
        }

        .dynasty-progress-fill {
            height: 100%;
            border-radius: inherit;
            background: currentColor;
        }

        .dynasty-two-column {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
            margin-bottom: 18px;
        }

        .dynasty-panel {
            min-width: 0;
            padding: 20px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 18px;
            background: rgba(255,255,255,.03);
        }

        .dynasty-panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }

        .dynasty-panel-header h3 {
            margin: 0;
            font-size: 18px;
        }

        .dynasty-link-button {
            padding: 8px 11px;
            font-size: 10px;
        }

        .dynasty-heir-card {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 17px;
            border-radius: 15px;
            background: rgba(255,255,255,.035);
        }

        .dynasty-heir-avatar {
            width: 52px;
            height: 52px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 15px;
            background: rgba(255,255,255,.08);
            font-size: 20px;
            font-weight: 800;
        }

        .dynasty-heir-card h4 {
            margin: 0;
            font-size: 16px;
        }

        .dynasty-heir-card p {
            margin: 5px 0;
            font-size: 11px;
            opacity: .55;
        }

        .dynasty-heir-status {
            display: inline-block;
            font-size: 10px;
            font-weight: 700;
            opacity: .7;
        }

        .dynasty-wealth-main {
            margin-bottom: 17px;
            font-size: 29px;
            font-weight: 800;
        }

        .dynasty-wealth-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
        }

        .dynasty-wealth-grid > div {
            padding: 12px;
            border-radius: 12px;
            background: rgba(255,255,255,.035);
        }

        .dynasty-wealth-grid span,
        .dynasty-wealth-grid strong {
            display: block;
        }

        .dynasty-wealth-grid span {
            font-size: 10px;
            opacity: .5;
        }

        .dynasty-wealth-grid strong {
            margin-top: 4px;
            font-size: 13px;
        }

        .dynasty-members-list {
            display: grid;
            gap: 9px;
        }

        .dynasty-member-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 13px;
            background: rgba(255,255,255,.025);
        }

        .dynasty-member-avatar {
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 11px;
            background: rgba(255,255,255,.07);
            font-weight: 800;
        }

        .dynasty-member-info strong,
        .dynasty-member-info span {
            display: block;
        }

        .dynasty-member-info strong {
            font-size: 13px;
        }

        .dynasty-member-info span {
            margin-top: 3px;
            font-size: 10px;
            opacity: .55;
        }

        .dynasty-timeline {
            display: grid;
            gap: 4px;
        }

        .dynasty-timeline-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 11px 0;
        }

        .dynasty-timeline-dot {
            width: 8px;
            height: 8px;
            margin-top: 5px;
            flex-shrink: 0;
            border-radius: 50%;
            background: currentColor;
        }

        .dynasty-timeline-content strong,
        .dynasty-timeline-content span {
            display: block;
        }

        .dynasty-timeline-content strong {
            font-size: 12px;
        }

        .dynasty-timeline-content span {
            margin-top: 3px;
            font-size: 10px;
            opacity: .5;
        }

        .dynasty-generations,
        .dynasty-generations-large {
            display: grid;
            gap: 10px;
        }

        .dynasty-generation-card {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 16px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 15px;
            background: rgba(255,255,255,.03);
        }

        .dynasty-generation-number {
            width: 45px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 13px;
            background: rgba(255,255,255,.07);
            font-size: 18px;
            font-weight: 800;
        }

        .dynasty-generation-content {
            min-width: 0;
        }

        .dynasty-generation-content h4 {
            margin: 0;
            font-size: 15px;
        }

        .dynasty-generation-meta {
            display: flex;
            gap: 14px;
            margin-top: 5px;
            font-size: 10px;
            opacity: .55;
        }

        .dynasty-tree {
            padding: 24px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 18px;
            background: rgba(255,255,255,.025);
        }

        .dynasty-tree-level {
            text-align: center;
        }

        .dynasty-tree-label {
            margin-bottom: 12px;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .14em;
            opacity: .45;
        }

        .dynasty-tree-node {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            min-width: 130px;
            padding: 15px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 15px;
            background: rgba(255,255,255,.035);
        }

        .dynasty-tree-node.current {
            border-color: rgba(255,255,255,.16);
        }

        .dynasty-tree-avatar {
            width: 42px;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
            border-radius: 12px;
            background: rgba(255,255,255,.08);
            font-weight: 800;
        }

        .dynasty-tree-node strong {
            font-size: 12px;
            text-align: center;
        }

        .dynasty-tree-node span {
            margin-top: 4px;
            font-size: 9px;
            opacity: .5;
            text-align: center;
        }

        .dynasty-tree-connector {
            margin: 14px 0;
            font-size: 20px;
            text-align: center;
            opacity: .4;
        }

        .dynasty-tree-nodes {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
        }

        .dynasty-family-groups {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
            margin-top: 18px;
        }

        .dynasty-family-group {
            padding: 17px;
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 16px;
            background: rgba(255,255,255,.025);
        }

        .dynasty-family-group h4 {
            margin: 0 0 13px;
            font-size: 14px;
        }

        .dynasty-inheritance-summary {
            padding: 22px;
            margin-bottom: 14px;
            border-radius: 17px;
            background: rgba(255,255,255,.035);
        }

        .dynasty-inheritance-summary span,
        .dynasty-inheritance-summary strong {
            display: block;
        }

        .dynasty-inheritance-summary span {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: .1em;
            opacity: .5;
        }

        .dynasty-inheritance-summary strong {
            margin-top: 7px;
            font-size: 28px;
        }

        .dynasty-inheritance-list {
            display: grid;
            gap: 10px;
        }

        .dynasty-inheritance-card {
            display: flex;
            align-items: center;
            gap: 13px;
            padding: 15px;
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 14px;
            background: rgba(255,255,255,.025);
        }

        .dynasty-inheritance-icon {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 12px;
            background: rgba(255,255,255,.07);
            font-size: 18px;
        }

        .dynasty-inheritance-content strong,
        .dynasty-inheritance-content span,
        .dynasty-inheritance-content small {
            display: block;
        }

        .dynasty-inheritance-content strong {
            font-size: 13px;
        }

        .dynasty-inheritance-content span {
            margin-top: 3px;
            font-size: 12px;
            font-weight: 700;
        }

        .dynasty-inheritance-content small {
            margin-top: 4px;
            font-size: 9px;
            opacity: .5;
        }

        .dynasty-history {
            padding: 18px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 17px;
            background: rgba(255,255,255,.025);
        }

        .dynasty-legacy-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 12px;
            margin-bottom: 18px;
        }

        .dynasty-hof-card {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 18px;
            border-radius: 15px;
            background: rgba(255,255,255,.035);
        }

        .dynasty-hof-icon {
            width: 45px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 13px;
            background: rgba(255,255,255,.07);
            font-size: 21px;
        }

        .dynasty-hof-card strong {
            font-size: 14px;
        }

        .dynasty-hof-card p {
            margin: 5px 0 0;
            font-size: 11px;
            opacity: .55;
        }

        .dynasty-empty {
            padding: 24px;
            border: 1px dashed rgba(255,255,255,.1);
            border-radius: 14px;
            text-align: center;
            font-size: 12px;
            line-height: 1.55;
            opacity: .55;
        }

        .dynasty-empty strong {
            display: block;
            margin-bottom: 6px;
            font-size: 13px;
            opacity: 1;
        }

        .dynasty-empty p {
            max-width: 500px;
            margin: 0 auto;
        }

        .dynasty-empty-icon {
            margin-bottom: 8px;
            font-size: 24px;
        }

        .dynasty-milestones {
            display: grid;
            gap: 4px;
        }

        @media (max-width: 1000px) {
            .dynasty-stats-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .dynasty-legacy-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .dynasty-family-groups {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 800px) {
            .dynasty-two-column {
                grid-template-columns: 1fr;
            }

            .dynasty-header {
                flex-direction: column;
                align-items: flex-start;
            }

            .dynasty-header-score {
                width: 100%;
                box-sizing: border-box;
                text-align: left;
            }
        }

        @media (max-width: 560px) {
            .dynasty-screen {
                padding: 14px;
            }

            .dynasty-header {
                padding: 20px;
                border-radius: 16px;
            }

            .dynasty-header h2 {
                font-size: 22px;
            }

            .dynasty-stats-grid,
            .dynasty-legacy-grid {
                grid-template-columns: 1fr;
            }

            .dynasty-panel {
                padding: 16px;
            }

            .dynasty-wealth-grid {
                grid-template-columns: 1fr;
            }

            .dynasty-tree {
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
    dynastyScreenState.database =
        getDatabase(database);

    dynastyScreenState.initialized =
        true;

    injectStyles();

    return render(
        dynastyScreenState.database
    );
}

function refresh(database = null) {
    if (database) {
        dynastyScreenState.database =
            database;
    }

    injectStyles();

    return render(
        dynastyScreenState.database ||
        getDatabase()
    );
}

function open(
    tab = "overview",
    database = null
) {
    const validTab =
        DYNASTY_TABS.some(
            (item) => item.id === tab
        );

    dynastyScreenState.activeTab =
        validTab
            ? tab
            : "overview";

    return initialize(database);
}

function close() {
    const content =
        getElement(
            "mma-life-content"
        );

    if (content) {
        content.innerHTML = "";
    }
}

function setTab(tab) {
    const exists =
        DYNASTY_TABS.some(
            (item) => item.id === tab
        );

    if (!exists) {
        return false;
    }

    dynastyScreenState.activeTab =
        tab;

    if (dynastyScreenState.database) {
        render(
            dynastyScreenState.database
        );
    }

    return true;
}

function getActiveTab() {
    return dynastyScreenState.activeTab;
}

function getState() {
    return clone(
        dynastyScreenState
    );
}

function getSnapshot() {
    return {
        version:
            DYNASTY_SCREEN_VERSION,

        state:
            getState(),

        summary:
            dynastyScreenState.database
                ? getDynastySummary(
                    dynastyScreenState.database
                )
                : null
    };
}

function validate(database = null) {
    const db =
        database ||
        dynastyScreenState.database;

    const errors = [];
    const warnings = [];

    if (!db) {
        errors.push(
            "Database não encontrada."
        );
    }

    if (
        dynastyScreenState.activeTab &&
        !DYNASTY_TABS.some(
            (tab) =>
                tab.id ===
                dynastyScreenState.activeTab
        )
    ) {
        warnings.push(
            "A aba ativa não é reconhecida."
        );
    }

    if (db) {
        if (!db.dynasty) {
            warnings.push(
                "Estrutura dynasty não encontrada; usando valores padrão."
            );
        }

        if (!db.life) {
            warnings.push(
                "Estrutura life não encontrada."
            );
        }
    }

    return {
        valid:
            errors.length === 0,

        errors,
        warnings
    };
}

/* ============================================================
   API PÚBLICA
   ============================================================ */

const dynastyScreenAPI = {
    version:
        DYNASTY_SCREEN_VERSION,

    initialize,
    refresh,
    render,
    open,
    close,

    setTab,
    getActiveTab,

    getDatabase,
    getDynastySummary,

    getGenerations,
    getInheritance,
    getGenealogy,
    getHeir,

    getChildren,
    getParents,
    getSiblings,
    getPartner,

    getNetWorth,
    getCash,
    getCareerEarnings,
    getAssets,

    getLegacy,
    getLegacyScore,
    getDynastyScore,
    getDynastyLevel,

    getState,
    getSnapshot,
    validate
};

/* ============================================================
   GLOBAL
   ============================================================ */

if (typeof window !== "undefined") {
    window.dynastyScreenAPI =
        dynastyScreenAPI;

    window.MMA_LIFE_DYNASTY_SCREEN =
        dynastyScreenAPI;

    window.dispatchEvent(
        new CustomEvent(
            "mma-life-dynasty-screen-ready",
            {
                detail:
                    dynastyScreenAPI
            }
        )
    );
}

/* ============================================================
   EXPORTS
   ============================================================ */

export {
    DYNASTY_SCREEN_VERSION,
    dynastyScreenAPI,

    initialize,
    refresh,
    render,
    open,
    close,

    setTab,
    getActiveTab,

    getDynastySummary,

    getGenerations,
    getInheritance,
    getGenealogy,
    getHeir,

    getChildren,
    getParents,
    getSiblings,
    getPartner,

    getNetWorth,
    getCash,
    getCareerEarnings,
    getAssets,

    getLegacy,
    getLegacyScore,
    getDynastyScore,
    getDynastyLevel,

    getState,
    getSnapshot,
    validate
};

export default dynastyScreenAPI;
