// ============================================================
// MMA LIFE DYNASTY
// UI — FAMILY SCREEN
// Arquivo: js/ui/familyScreen.js
// ============================================================

const FAMILY_SCREEN_VERSION = 1;

const state = {
    initialized: false,
    database: null,
    lastRender: null,
    activeTab: "overview"
};

// ============================================================
// UTILITÁRIOS
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
    if (database) return database;

    if (globalThis.MMA_LIFE_DATABASE) {
        return globalThis.MMA_LIFE_DATABASE;
    }

    if (globalThis.MMA_LIFE_GAME?.getDatabase) {
        return globalThis.MMA_LIFE_GAME.getDatabase();
    }

    return state.database;
}

function getLife(database = null) {
    const db = getDatabase(database);

    if (!db) return {};

    if (!db.life) {
        db.life = {};
    }

    return db.life;
}

function getPlayer(database = null) {
    const db = getDatabase(database);

    return db?.player || {};
}

function safeArray(value) {
    return Array.isArray(value) ? value : [];
}

function escapeHTML(value) {
    if (value === undefined || value === null) return "";

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatNumber(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) return "0";

    return new Intl.NumberFormat("pt-BR").format(
        Math.round(number)
    );
}

function formatMoney(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) return "$0";

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(number);
}

function capitalize(value) {
    if (!value) return "";

    return String(value).charAt(0).toUpperCase() +
        String(value).slice(1);
}

// ============================================================
// PLAYER
// ============================================================

function getPlayerName(player) {
    if (!player) return "Jogador";

    if (player.fullName) return player.fullName;
    if (player.displayName) return player.displayName;

    const first =
        player.firstName ||
        player.firstname ||
        player.name ||
        "";

    const last =
        player.lastName ||
        player.lastname ||
        "";

    return `${first} ${last}`.trim() || "Jogador";
}

function getPlayerAge(player) {
    const age =
        player?.age ??
        player?.identity?.age ??
        player?.birth?.age;

    return Number.isFinite(Number(age))
        ? Number(age)
        : "—";
}

// ============================================================
// FAMILY DATA
// ============================================================

function getFamily(life) {
    const family = life?.family || {};

    return {
        parents: safeArray(family.parents),
        siblings: safeArray(family.siblings),
        children: safeArray(
            family.children ||
            life?.children?.children ||
            life?.children
        ),
        grandparents: safeArray(family.grandparents),
        grandchildren: safeArray(family.grandchildren),
        spouses: safeArray(family.spouses),
        members: safeArray(family.members),
        history: safeArray(family.history)
    };
}

function getFamilyState(life) {
    return life?.family || {};
}

function getChildData(life) {
    const childrenState = life?.children || {};

    return {
        children: safeArray(
            childrenState.children ||
            childrenState.items
        ),
        count: safeArray(
            childrenState.children ||
            childrenState.items
        ).length
    };
}

function getFamilyMembers(family) {
    const combined = [
        ...family.parents,
        ...family.siblings,
        ...family.children,
        ...family.grandparents,
        ...family.grandchildren,
        ...family.spouses,
        ...family.members
    ];

    const seen = new Set();

    return combined.filter(member => {
        if (!member || typeof member !== "object") {
            return false;
        }

        const id =
            member.id ||
            member.characterId ||
            member.personId ||
            member.name ||
            Math.random();

        if (seen.has(id)) {
            return false;
        }

        seen.add(id);

        return true;
    });
}

// ============================================================
// RELAÇÃO / LABELS
// ============================================================

function relationLabel(member, fallback = "Família") {
    if (!member) return fallback;

    const relation =
        member.relation ||
        member.relationship ||
        member.type ||
        member.role ||
        "";

    const labels = {
        parent: "Pai/Mãe",
        father: "Pai",
        mother: "Mãe",
        sibling: "Irmão/Irmã",
        brother: "Irmão",
        sister: "Irmã",
        child: "Filho(a)",
        son: "Filho",
        daughter: "Filha",
        spouse: "Cônjuge",
        partner: "Companheiro(a)",
        grandparent: "Avô/Avó",
        grandfather: "Avô",
        grandmother: "Avó",
        grandchild: "Neto(a)",
        grandson: "Neto",
        granddaughter: "Neta",
        family: "Família"
    };

    return labels[relation] ||
        capitalize(relation) ||
        fallback;
}

function getMemberName(member) {
    return (
        member?.fullName ||
        member?.displayName ||
        member?.name ||
        `${member?.firstName || ""} ${member?.lastName || ""}`.trim() ||
        "Membro da família"
    );
}

function getMemberAge(member) {
    const age =
        member?.age ??
        member?.identity?.age;

    return Number.isFinite(Number(age))
        ? Number(age)
        : "—";
}

function getMemberGender(member) {
    return (
        member?.gender ||
        member?.identity?.gender ||
        ""
    );
}

function getMemberStatus(member) {
    return (
        member?.status ||
        member?.lifeStatus ||
        (member?.alive === false ? "Falecido" : "Vivo")
    );
}

// ============================================================
// GENEAOLOGIA
// ============================================================

function getGeneration(member) {
    const generation =
        member?.generation ??
        member?.familyGeneration ??
        member?.genealogy?.generation;

    return Number.isFinite(Number(generation))
        ? Number(generation)
        : null;
}

function generationLabel(member) {
    const generation = getGeneration(member);

    if (generation === null) {
        return "";
    }

    if (generation === 0) return "Geração do jogador";
    if (generation > 0) return `Geração +${generation}`;
    return `Geração ${generation}`;
}

// ============================================================
// STATS
// ============================================================

function getFamilyStats(life, database) {
    const family = getFamily(life);
    const childrenData = getChildData(life);

    return {
        parents: family.parents.length,
        siblings: family.siblings.length,
        children: Math.max(
            family.children.length,
            childrenData.count
        ),
        grandparents: family.grandparents.length,
        grandchildren: family.grandchildren.length,
        total: getFamilyMembers(family).length,
        familyScore:
            life?.family?.familyScore ??
            life?.family?.score ??
            "—",
        netWorth:
            life?.family?.familyWealth ??
            life?.family?.wealth ??
            database?.business?.wealth?.netWorth ??
            0
    };
}

// ============================================================
// CARDS
// ============================================================

function renderStatCards(life, database) {
    const stats = getFamilyStats(life, database);

    return `
        <section class="family-stat-grid">

            <article class="family-stat-card">
                <span>Pais</span>
                <strong>${formatNumber(stats.parents)}</strong>
            </article>

            <article class="family-stat-card">
                <span>Irmãos</span>
                <strong>${formatNumber(stats.siblings)}</strong>
            </article>

            <article class="family-stat-card">
                <span>Filhos</span>
                <strong>${formatNumber(stats.children)}</strong>
            </article>

            <article class="family-stat-card">
                <span>Avós</span>
                <strong>${formatNumber(stats.grandparents)}</strong>
            </article>

            <article class="family-stat-card">
                <span>Netos</span>
                <strong>${formatNumber(stats.grandchildren)}</strong>
            </article>

            <article class="family-stat-card">
                <span>Membros</span>
                <strong>${formatNumber(stats.total)}</strong>
            </article>

        </section>
    `;
}

function renderMemberCard(member, defaultRelation = "Família") {
    const name = getMemberName(member);
    const age = getMemberAge(member);
    const relation = relationLabel(member, defaultRelation);
    const status = getMemberStatus(member);
    const generation = generationLabel(member);

    const alive =
        member?.alive !== false &&
        status !== "Falecido";

    return `
        <article class="family-member-card">

            <div class="family-member-avatar">
                ${escapeHTML(
                    name.charAt(0).toUpperCase()
                )}
            </div>

            <div class="family-member-main">

                <div class="family-member-name">
                    <strong>${escapeHTML(name)}</strong>

                    ${
                        alive
                            ? `<span class="family-alive">Vivo</span>`
                            : `<span class="family-dead">Falecido</span>`
                    }
                </div>

                <span class="family-member-relation">
                    ${escapeHTML(relation)}
                </span>

                ${
                    age !== "—"
                        ? `
                            <span class="family-member-meta">
                                ${formatNumber(age)} anos
                            </span>
                        `
                        : ""
                }

                ${
                    generation
                        ? `
                            <span class="family-member-generation">
                                ${escapeHTML(generation)}
                            </span>
                        `
                        : ""
                }

            </div>

        </article>
    `;
}

function renderMemberSection(title, members, defaultRelation) {
    const list = safeArray(members);

    return `
        <section class="family-section">

            <div class="family-section-header">
                <div>
                    <span class="family-section-kicker">
                        FAMÍLIA
                    </span>

                    <h2>${escapeHTML(title)}</h2>
                </div>

                <span class="family-section-count">
                    ${formatNumber(list.length)}
                </span>
            </div>

            ${
                list.length
                    ? `
                        <div class="family-member-grid">
                            ${list.map(member =>
                                renderMemberCard(
                                    member,
                                    defaultRelation
                                )
                            ).join("")}
                        </div>
                    `
                    : `
                        <div class="family-empty">
                            Nenhum registro nesta categoria.
                        </div>
                    `
            }

        </section>
    `;
}

// ============================================================
// ÁRVORE FAMILIAR
// ============================================================

function renderFamilyTree(family, database) {
    const player = getPlayer(database);

    const parents = family.parents;
    const siblings = family.siblings;
    const children = family.children;
    const spouse =
        family.spouses[0] ||
        getLife(database)?.partner ||
        getLife(database)?.marriage?.partner ||
        null;

    return `
        <section class="family-tree-section">

            <div class="family-section-header">
                <div>
                    <span class="family-section-kicker">
                        GENEALOGIA
                    </span>

                    <h2>Árvore familiar</h2>

                    <p>
                        Sua linhagem atual e as próximas gerações.
                    </p>
                </div>
            </div>

            <div class="family-tree">

                <div class="family-tree-level">

                    ${
                        parents.length
                            ? parents.map(parent => `
                                <div class="family-tree-node">
                                    <strong>
                                        ${escapeHTML(
                                            getMemberName(parent)
                                        )}
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            relationLabel(
                                                parent,
                                                "Pai/Mãe"
                                            )
                                        )}
                                    </span>
                                </div>
                            `).join("")
                            : `
                                <div class="family-tree-node empty">
                                    <strong>Sem registro</strong>
                                    <span>Pais</span>
                                </div>
                            `
                    }

                </div>

                <div class="family-tree-connector"></div>

                <div class="family-tree-level family-tree-current">

                    <div class="family-tree-node player">

                        <div class="family-tree-player-avatar">
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
                            Jogador · ${escapeHTML(
                                String(
                                    getPlayerAge(player)
                                )
                            )} anos
                        </span>

                    </div>

                    ${
                        spouse
                            ? `
                                <div class="family-tree-link">♥</div>

                                <div class="family-tree-node">

                                    <strong>
                                        ${escapeHTML(
                                            getMemberName(spouse)
                                        )}
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            relationLabel(
                                                spouse,
                                                "Cônjuge"
                                            )
                                        )}
                                    </span>

                                </div>
                            `
                            : ""
                    }

                </div>

                <div class="family-tree-connector"></div>

                <div class="family-tree-level">

                    ${
                        children.length
                            ? children.map(child => `
                                <div class="family-tree-node">

                                    <strong>
                                        ${escapeHTML(
                                            getMemberName(child)
                                        )}
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            relationLabel(
                                                child,
                                                "Filho(a)"
                                            )
                                        )}
                                    </span>

                                    ${
                                        getMemberAge(child) !== "—"
                                            ? `
                                                <small>
                                                    ${formatNumber(
                                                        getMemberAge(child)
                                                    )} anos
                                                </small>
                                            `
                                            : ""
                                    }

                                </div>
                            `).join("")
                            : `
                                <div class="family-tree-node empty">
                                    <strong>—</strong>
                                    <span>Próxima geração</span>
                                </div>
                            `
                    }

                </div>

                ${
                    !children.length
                        ? `
                            <div class="family-tree-note">
                                Seus filhos poderão continuar sua história
                                e formar novas gerações no sistema Dynasty.
                            </div>
                        `
                        : ""
                }

            </div>

        </section>
    `;
}

// ============================================================
// FAMILY HISTORY
// ============================================================

function renderFamilyHistory(family) {
    const history = safeArray(family.history);

    return `
        <section class="family-section family-history-section">

            <div class="family-section-header">
                <div>
                    <span class="family-section-kicker">
                        HISTÓRIA
                    </span>

                    <h2>História da família</h2>
                </div>

                <span class="family-section-count">
                    ${formatNumber(history.length)}
                </span>
            </div>

            ${
                history.length
                    ? `
                        <div class="family-history-list">
                            ${history
                                .slice()
                                .reverse()
                                .map(event => `
                                    <div class="family-history-row">

                                        <div class="family-history-marker">
                                            ●
                                        </div>

                                        <div>

                                            <strong>
                                                ${escapeHTML(
                                                    event.title ||
                                                    event.name ||
                                                    "Acontecimento familiar"
                                                )}
                                            </strong>

                                            <span>
                                                ${escapeHTML(
                                                    event.date ||
                                                    event.year ||
                                                    event.createdAt ||
                                                    ""
                                                )}
                                            </span>

                                            ${
                                                event.description
                                                    ? `
                                                        <p>
                                                            ${escapeHTML(
                                                                event.description
                                                            )}
                                                        </p>
                                                    `
                                                    : ""
                                            }

                                        </div>

                                    </div>
                                `)
                                .join("")}
                        </div>
                    `
                    : `
                        <div class="family-empty">
                            Ainda não existem acontecimentos familiares registrados.
                        </div>
                    `
            }

        </section>
    `;
}

// ============================================================
// OVERVIEW
// ============================================================

function renderOverview(database) {
    const life = getLife(database);
    const family = getFamily(life);

    return `
        ${renderFamilyTree(family, database)}

        <div class="family-columns">

            ${renderMemberSection(
                "Pais",
                family.parents,
                "Pai/Mãe"
            )}

            ${renderMemberSection(
                "Irmãos",
                family.siblings,
                "Irmão/Irmã"
            )}

            ${renderMemberSection(
                "Filhos",
                family.children,
                "Filho(a)"
            )}

            ${renderMemberSection(
                "Avós",
                family.grandparents,
                "Avô/Avó"
            )}

            ${renderMemberSection(
                "Netos",
                family.grandchildren,
                "Neto(a)"
            )}

        </div>

        ${renderFamilyHistory(family)}
    `;
}

// ============================================================
// CHILDREN
// ============================================================

function renderChildren(database) {
    const life = getLife(database);
    const family = getFamily(life);
    const childrenData = getChildData(life);

    const children =
        family.children.length
            ? family.children
            : childrenData.children;

    return `
        <section class="family-detail">

            <div class="family-detail-header">
                <span class="family-section-kicker">
                    DESCENDENTES
                </span>

                <h2>Filhos</h2>

                <p>
                    Acompanhe o crescimento, personalidade,
                    educação e futuro dos seus filhos.
                </p>
            </div>

            ${
                children.length
                    ? `
                        <div class="family-children-grid">
                            ${children.map(child => `
                                <article class="family-child-card">

                                    <div class="family-child-top">

                                        <div class="family-child-avatar">
                                            ${escapeHTML(
                                                getMemberName(child)
                                                    .charAt(0)
                                                    .toUpperCase()
                                            )}
                                        </div>

                                        <div>
                                            <strong>
                                                ${escapeHTML(
                                                    getMemberName(child)
                                                )}
                                            </strong>

                                            <span>
                                                ${escapeHTML(
                                                    relationLabel(
                                                        child,
                                                        "Filho(a)"
                                                    )
                                                )}
                                            </span>
                                        </div>

                                    </div>

                                    <div class="family-child-stats">

                                        <div>
                                            <span>Idade</span>
                                            <strong>
                                                ${escapeHTML(
                                                    String(
                                                        getMemberAge(child)
                                                    )
                                                )}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Gênero</span>
                                            <strong>
                                                ${escapeHTML(
                                                    getMemberGender(child) ||
                                                    "—"
                                                )}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Potencial</span>
                                            <strong>
                                                ${escapeHTML(
                                                    String(
                                                        child.potential ??
                                                        child.genetics?.potential ??
                                                        "—"
                                                    )
                                                )}
                                            </strong>
                                        </div>

                                    </div>

                                    ${
                                        child.personality
                                            ? `
                                                <div class="family-child-tag">
                                                    ${escapeHTML(
                                                        child.personality
                                                    )}
                                                </div>
                                            `
                                            : ""
                                    }

                                </article>
                            `).join("")}
                        </div>
                    `
                    : `
                        <div class="family-empty large">
                            Você ainda não possui filhos.
                            Quando tiver, eles aparecerão aqui.
                        </div>
                    `
            }

        </section>
    `;
}

// ============================================================
// PARENTS
// ============================================================

function renderParents(database) {
    const life = getLife(database);
    const family = getFamily(life);

    return `
        <section class="family-detail">

            <div class="family-detail-header">
                <span class="family-section-kicker">
                    ORIGEM
                </span>

                <h2>Pais</h2>

                <p>
                    Conheça os membros da família que formam sua origem.
                </p>
            </div>

            ${
                family.parents.length
                    ? `
                        <div class="family-parents-grid">
                            ${family.parents.map(parent => `
                                <article class="family-parent-card">

                                    <div class="family-parent-avatar">
                                        ${escapeHTML(
                                            getMemberName(parent)
                                                .charAt(0)
                                                .toUpperCase()
                                        )}
                                    </div>

                                    <div>
                                        <strong>
                                            ${escapeHTML(
                                                getMemberName(parent)
                                            )}
                                        </strong>

                                        <span>
                                            ${escapeHTML(
                                                relationLabel(
                                                    parent,
                                                    "Pai/Mãe"
                                                )
                                            )}
                                        </span>

                                        ${
                                            getMemberAge(parent) !== "—"
                                                ? `
                                                    <small>
                                                        ${formatNumber(
                                                            getMemberAge(parent)
                                                        )} anos
                                                    </small>
                                                `
                                                : ""
                                        }

                                    </div>

                                </article>
                            `).join("")}
                        </div>
                    `
                    : `
                        <div class="family-empty large">
                            Os dados dos seus pais ainda não foram registrados.
                        </div>
                    `
            }

        </section>
    `;
}

// ============================================================
// GENERATIONS
// ============================================================

function renderGenerations(database) {
    const life = getLife(database);
    const family = getFamily(life);

    const allMembers = getFamilyMembers(family);

    const grouped = {};

    allMembers.forEach(member => {
        const generation = getGeneration(member);

        const key =
            generation === null
                ? "unknown"
                : String(generation);

        if (!grouped[key]) {
            grouped[key] = [];
        }

        grouped[key].push(member);
    });

    const groups = Object.entries(grouped);

    return `
        <section class="family-detail">

            <div class="family-detail-header">
                <span class="family-section-kicker">
                    DINASTIA
                </span>

                <h2>Gerações</h2>

                <p>
                    A evolução da sua família ao longo das gerações.
                </p>
            </div>

            ${
                groups.length
                    ? `
                        <div class="family-generation-list">

                            ${groups.map(([generation, members]) => `

                                <div class="family-generation">

                                    <div class="family-generation-header">

                                        <strong>
                                            ${
                                                generation === "unknown"
                                                    ? "Geração não definida"
                                                    : generation === "0"
                                                        ? "Geração do jogador"
                                                        : `Geração ${escapeHTML(generation)}`
                                            }
                                        </strong>

                                        <span>
                                            ${formatNumber(
                                                members.length
                                            )} membro(s)
                                        </span>

                                    </div>

                                    <div class="family-member-grid">
                                        ${members.map(member =>
                                            renderMemberCard(
                                                member,
                                                "Família"
                                            )
                                        ).join("")}
                                    </div>

                                </div>

                            `).join("")}

                        </div>
                    `
                    : `
                        <div class="family-empty large">
                            Ainda não existem gerações suficientes para exibir.
                        </div>
                    `
            }

        </section>
    `;
}

// ============================================================
// RENDER PRINCIPAL
// ============================================================

function renderTab(tab, database) {
    switch (tab) {
        case "children":
            return renderChildren(database);

        case "parents":
            return renderParents(database);

        case "generations":
            return renderGenerations(database);

        case "overview":
        default:
            return renderOverview(database);
    }
}

function render(database = null) {
    const db = getDatabase(database);

    if (!db) {
        return `
            <section class="family-error">
                <h2>Família</h2>
                <p>Banco de dados ainda não disponível.</p>
            </section>
        `;
    }

    state.database = db;

    const life = getLife(db);
    const player = getPlayer(db);

    const html = `
        <div class="family-screen">

            <section class="family-header">

                <div>
                    <span class="family-eyebrow">
                        LIFE DYNASTY
                    </span>

                    <h1>Família</h1>

                    <p>
                        Sua família é parte fundamental da sua história,
                        legado e futuras gerações.
                    </p>
                </div>

                <div class="family-player-summary">

                    <div class="family-player-avatar">
                        ${escapeHTML(
                            getPlayerName(player)
                                .charAt(0)
                                .toUpperCase()
                        )}
                    </div>

                    <div>
                        <strong>
                            ${escapeHTML(
                                getPlayerName(player)
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                String(
                                    getPlayerAge(player)
                                )
                            )} anos
                        </span>
                    </div>

                </div>

            </section>

            ${renderStatCards(life, db)}

            <nav class="family-tabs">

                ${renderTabButton(
                    "overview",
                    "Visão geral"
                )}

                ${renderTabButton(
                    "parents",
                    "Pais"
                )}

                ${renderTabButton(
                    "children",
                    "Filhos"
                )}

                ${renderTabButton(
                    "generations",
                    "Gerações"
                )}

            </nav>

            <main class="family-content">

                ${renderTab(
                    state.activeTab,
                    db
                )}

            </main>

        </div>
    `;

    state.lastRender = {
        timestamp: Date.now(),
        tab: state.activeTab
    };

    return html;
}

function renderTabButton(id, label) {
    const active =
        state.activeTab === id
            ? "active"
            : "";

    return `
        <button
            type="button"
            class="family-tab ${active}"
            data-family-tab="${escapeHTML(id)}"
        >
            ${escapeHTML(label)}
        </button>
    `;
}

// ============================================================
// DOM
// ============================================================

function getContentElement() {
    return (
        document.getElementById("mma-life-content") ||
        document.querySelector("#mma-life-content")
    );
}

function renderToDOM(database = null) {
    const content = getContentElement();

    if (!content) {
        return false;
    }

    content.innerHTML = render(database);

    bindEvents();

    return true;
}

// ============================================================
// EVENTOS
// ============================================================

function bindEvents() {
    const buttons = document.querySelectorAll(
        "[data-family-tab]"
    );

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const tab = button.dataset.familyTab;

            if (!tab) return;

            setActiveTab(tab);

            renderToDOM(
                state.database
            );
        });
    });
}

function setActiveTab(tab) {
    const allowed = [
        "overview",
        "parents",
        "children",
        "generations"
    ];

    if (!allowed.includes(tab)) {
        return false;
    }

    state.activeTab = tab;

    return true;
}

// ============================================================
// ESTILOS
// ============================================================

function injectStyles() {
    if (document.getElementById("mma-life-family-screen-styles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "mma-life-family-screen-styles";

    style.textContent = `
        .family-screen {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 24px;
            box-sizing: border-box;
        }

        .family-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 24px;
        }

        .family-eyebrow,
        .family-section-kicker {
            display: block;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1.5px;
            opacity: .6;
            text-transform: uppercase;
            margin-bottom: 5px;
        }

        .family-header h1 {
            margin: 0;
            font-size: 32px;
            line-height: 1.1;
        }

        .family-header p {
            margin: 8px 0 0;
            opacity: .65;
            max-width: 700px;
        }

        .family-player-summary {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 210px;
        }

        .family-player-summary > div:last-child {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .family-player-summary span {
            font-size: 12px;
            opacity: .6;
        }

        .family-player-avatar,
        .family-member-avatar,
        .family-parent-avatar,
        .family-child-avatar,
        .family-tree-player-avatar {
            display: grid;
            place-items: center;
            border: 1px solid rgba(127,127,127,.25);
            border-radius: 50%;
            flex-shrink: 0;
        }

        .family-player-avatar {
            width: 48px;
            height: 48px;
            font-weight: 900;
        }

        .family-stat-grid {
            display: grid;
            grid-template-columns: repeat(6, minmax(0, 1fr));
            gap: 10px;
            margin-bottom: 20px;
        }

        .family-stat-card {
            padding: 15px;
            border: 1px solid rgba(127,127,127,.22);
            border-radius: 15px;
            background: rgba(127,127,127,.045);
        }

        .family-stat-card span {
            font-size: 11px;
            opacity: .6;
            display: block;
        }

        .family-stat-card strong {
            display: block;
            font-size: 24px;
            margin-top: 7px;
        }

        .family-tabs {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding: 4px 2px 14px;
        }

        .family-tab {
            border: 1px solid rgba(127,127,127,.24);
            background: transparent;
            color: inherit;
            border-radius: 999px;
            padding: 9px 15px;
            cursor: pointer;
            font: inherit;
            white-space: nowrap;
            opacity: .7;
        }

        .family-tab:hover {
            opacity: 1;
        }

        .family-tab.active {
            opacity: 1;
            border-color: currentColor;
            font-weight: 800;
        }

        .family-tree-section,
        .family-section,
        .family-detail {
            margin-bottom: 20px;
        }

        .family-section,
        .family-tree-section {
            border: 1px solid rgba(127,127,127,.22);
            border-radius: 17px;
            padding: 20px;
            background: rgba(127,127,127,.035);
        }

        .family-section-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 18px;
        }

        .family-section-header h2,
        .family-detail-header h2 {
            margin: 0;
            font-size: 21px;
        }

        .family-section-header p,
        .family-detail-header p {
            margin: 7px 0 0;
            opacity: .62;
        }

        .family-section-count {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 30px;
            height: 30px;
            padding: 0 8px;
            border-radius: 999px;
            border: 1px solid rgba(127,127,127,.25);
            font-size: 12px;
            font-weight: 800;
        }

        .family-tree {
            overflow-x: auto;
            padding: 10px 0;
        }

        .family-tree-level {
            display: flex;
            align-items: stretch;
            justify-content: center;
            gap: 12px;
            min-width: max-content;
        }

        .family-tree-node {
            min-width: 145px;
            padding: 13px;
            border: 1px solid rgba(127,127,127,.22);
            border-radius: 13px;
            background: rgba(127,127,127,.05);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            gap: 4px;
        }

        .family-tree-node strong {
            font-size: 13px;
        }

        .family-tree-node span,
        .family-tree-node small {
            font-size: 10px;
            opacity: .6;
        }

        .family-tree-node.player {
            min-width: 175px;
            border-width: 2px;
        }

        .family-tree-node.empty {
            opacity: .5;
            border-style: dashed;
        }

        .family-tree-current {
            gap: 10px;
        }

        .family-tree-link {
            display: grid;
            place-items: center;
            align-self: center;
            opacity: .65;
        }

        .family-tree-connector {
            height: 22px;
            width: 2px;
            margin: 0 auto;
            background: currentColor;
            opacity: .16;
        }

        .family-tree-player-avatar {
            width: 38px;
            height: 38px;
            margin-bottom: 2px;
            font-weight: 900;
        }

        .family-tree-note {
            max-width: 600px;
            margin: 18px auto 0;
            padding: 13px;
            border-radius: 12px;
            border: 1px dashed rgba(127,127,127,.24);
            text-align: center;
            font-size: 12px;
            opacity: .65;
        }

        .family-columns {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
        }

        .family-member-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
        }

        .family-member-card {
            display: flex;
            align-items: center;
            gap: 11px;
            padding: 13px;
            border: 1px solid rgba(127,127,127,.2);
            border-radius: 13px;
            background: rgba(127,127,127,.035);
        }

        .family-member-avatar {
            width: 42px;
            height: 42px;
            font-weight: 800;
        }

        .family-member-main {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .family-member-name {
            display: flex;
            align-items: center;
            gap: 7px;
            min-width: 0;
        }

        .family-member-name strong {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .family-alive,
        .family-dead {
            font-size: 9px;
            padding: 3px 6px;
            border-radius: 999px;
            border: 1px solid rgba(127,127,127,.2);
            white-space: nowrap;
        }

        .family-dead {
            opacity: .55;
        }

        .family-member-relation,
        .family-member-meta,
        .family-member-generation {
            font-size: 10px;
            opacity: .6;
        }

        .family-empty {
            padding: 18px;
            text-align: center;
            border: 1px dashed rgba(127,127,127,.25);
            border-radius: 12px;
            opacity: .62;
            font-size: 12px;
        }

        .family-empty.large {
            padding: 35px 20px;
            font-size: 13px;
        }

        .family-detail-header {
            margin-bottom: 18px;
        }

        .family-children-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
        }

        .family-child-card,
        .family-parent-card {
            border: 1px solid rgba(127,127,127,.22);
            border-radius: 16px;
            padding: 18px;
            background: rgba(127,127,127,.04);
        }

        .family-child-top,
        .family-parent-card {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .family-child-avatar,
        .family-parent-avatar {
            width: 48px;
            height: 48px;
            font-weight: 900;
        }

        .family-child-top > div:last-child,
        .family-parent-card > div:last-child {
            display: flex;
            flex-direction: column;
            gap: 3px;
            min-width: 0;
        }

        .family-child-top span,
        .family-parent-card span,
        .family-parent-card small {
            font-size: 11px;
            opacity: .6;
        }

        .family-child-stats {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
            margin-top: 17px;
        }

        .family-child-stats > div {
            padding: 10px;
            border-radius: 10px;
            background: rgba(127,127,127,.05);
        }

        .family-child-stats span {
            display: block;
            font-size: 9px;
            opacity: .55;
            text-transform: uppercase;
        }

        .family-child-stats strong {
            display: block;
            margin-top: 4px;
            font-size: 13px;
        }

        .family-child-tag {
            display: inline-block;
            margin-top: 13px;
            padding: 5px 9px;
            border: 1px solid rgba(127,127,127,.2);
            border-radius: 999px;
            font-size: 10px;
        }

        .family-parents-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
        }

        .family-generation-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .family-generation {
            padding: 16px;
            border: 1px solid rgba(127,127,127,.2);
            border-radius: 14px;
            background: rgba(127,127,127,.03);
        }

        .family-generation-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 12px;
        }

        .family-generation-header span {
            font-size: 11px;
            opacity: .6;
        }

        .family-history-list {
            display: flex;
            flex-direction: column;
        }

        .family-history-row {
            display: grid;
            grid-template-columns: 20px 1fr;
            gap: 12px;
            padding: 13px 0;
            border-bottom: 1px solid rgba(127,127,127,.15);
        }

        .family-history-row:last-child {
            border-bottom: 0;
        }

        .family-history-marker {
            font-size: 10px;
            padding-top: 3px;
            opacity: .55;
        }

        .family-history-row strong,
        .family-history-row span {
            display: block;
        }

        .family-history-row span {
            font-size: 10px;
            opacity: .55;
            margin-top: 3px;
        }

        .family-history-row p {
            margin: 5px 0 0;
            font-size: 12px;
            opacity: .65;
        }

        .family-error {
            padding: 30px;
            text-align: center;
        }

        @media (max-width: 1100px) {
            .family-stat-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }

            .family-member-grid,
            .family-children-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }

        @media (max-width: 760px) {
            .family-screen {
                padding: 15px;
            }

            .family-header {
                flex-direction: column;
                align-items: flex-start;
            }

            .family-player-summary {
                width: 100%;
            }

            .family-stat-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .family-columns {
                grid-template-columns: 1fr;
            }

            .family-member-grid,
            .family-children-grid,
            .family-parents-grid {
                grid-template-columns: 1fr;
            }

            .family-tree-level {
                justify-content: flex-start;
            }
        }

        @media (max-width: 480px) {
            .family-stat-grid {
                grid-template-columns: 1fr;
            }

            .family-header h1 {
                font-size: 27px;
            }

            .family-child-stats {
                grid-template-columns: 1fr;
            }
        }
    `;

    document.head.appendChild(style);
}

// ============================================================
// CONTROLE
// ============================================================

function initialize(database = null) {
    state.database = getDatabase(database);

    injectStyles();

    state.initialized = true;

    return renderToDOM(
        state.database
    );
}

function refresh(database = null) {
    if (database) {
        state.database = database;
    }

    injectStyles();

    return renderToDOM(
        state.database || getDatabase()
    );
}

function open(tab = "overview", database = null) {
    setActiveTab(tab);

    if (database) {
        state.database = database;
    }

    return refresh(
        state.database
    );
}

function close() {
    return true;
}

// ============================================================
// ESTADO
// ============================================================

function getState() {
    return clone({
        version: FAMILY_SCREEN_VERSION,
        initialized: state.initialized,
        activeTab: state.activeTab,
        lastRender: state.lastRender
    });
}

function getSnapshot(database = null) {
    const db = getDatabase(database);
    const life = getLife(db);
    const family = getFamily(life);

    return {
        version: FAMILY_SCREEN_VERSION,
        player: clone(getPlayer(db)),
        family: clone(family),
        children: clone(getChildData(life))
    };
}

function validate(database = null) {
    const db = getDatabase(database);

    const errors = [];

    if (!db) {
        errors.push("Database não disponível.");
    }

    if (typeof document === "undefined") {
        errors.push("Ambiente DOM não disponível.");
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// ============================================================
// API
// ============================================================

const familyScreenAPI = {
    version: FAMILY_SCREEN_VERSION,

    initialize,
    refresh,
    render,
    renderToDOM,

    open,
    close,

    setActiveTab,

    getState,
    getSnapshot,
    validate,

    getDatabase,
    getLife,
    getPlayer,

    getFamily,
    getFamilyState,
    getChildData,
    getFamilyMembers,

    getFamilyStats
};

globalThis.familyScreenAPI = familyScreenAPI;
globalThis.MMA_LIFE_FAMILY_SCREEN = familyScreenAPI;

// ============================================================
// READY
// ============================================================

if (typeof window !== "undefined") {
    window.addEventListener(
        "DOMContentLoaded",
        () => {
            injectStyles();

            window.dispatchEvent(
                new CustomEvent(
                    "mma-life-family-screen-ready",
                    {
                        detail: familyScreenAPI
                    }
                )
            );
        }
    );
}

// ============================================================
// EXPORTS
// ============================================================

export {
    FAMILY_SCREEN_VERSION,
    familyScreenAPI,

    initialize,
    refresh,
    render,
    renderToDOM,

    open,
    close,

    setActiveTab,

    getState,
    getSnapshot,
    validate
};

export default familyScreenAPI;
