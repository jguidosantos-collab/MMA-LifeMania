// ============================================================
// MMA LIFE DYNASTY
// UI — LIFE OVERVIEW SCREEN
// Arquivo: js/ui/lifeOverviewScreen.js
// ============================================================

const LIFE_OVERVIEW_SCREEN_VERSION = 1;

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

    if (!db) return {};

    return db.player || {};
}

function getNested(object, path, fallback = null) {
    if (!object || !path) return fallback;

    const parts = path.split(".");
    let current = object;

    for (const part of parts) {
        if (current == null || current[part] === undefined) {
            return fallback;
        }

        current = current[part];
    }

    return current;
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

    return new Intl.NumberFormat("pt-BR").format(Math.round(number));
}

function formatMoney(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "$0";
    }

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

function safeArray(value) {
    return Array.isArray(value) ? value : [];
}

function safeObject(value) {
    return value && typeof value === "object" ? value : {};
}

function getName(player) {
    const first =
        player.firstName ||
        player.firstname ||
        player.name ||
        "";

    const last =
        player.lastName ||
        player.lastname ||
        "";

    const full =
        player.fullName ||
        player.displayName ||
        "";

    if (full) return full;

    return `${first} ${last}`.trim() || "Jogador";
}

function getAge(player) {
    const age =
        player.age ??
        player.identity?.age ??
        player.birth?.age ??
        player.life?.age;

    return Number.isFinite(Number(age))
        ? Number(age)
        : "—";
}

function getGender(player) {
    return (
        player.gender ||
        player.identity?.gender ||
        "—"
    );
}

function getCountry(player) {
    return (
        player.country ||
        player.identity?.country ||
        player.location?.country ||
        "—"
    );
}

function getCity(player) {
    return (
        player.city ||
        player.identity?.city ||
        player.location?.city ||
        "—"
    );
}

// ============================================================
// LIFE DATA
// ============================================================

function getRelationships(life) {
    return safeArray(
        life.relationships ||
        life.relationships?.items
    );
}

function getChildren(life, player) {
    const children =
        life.children?.children ||
        life.children ||
        player.children ||
        [];

    return safeArray(children);
}

function getFamily(life) {
    const family = life.family || {};

    return {
        parents: safeArray(family.parents),
        siblings: safeArray(family.siblings),
        children: safeArray(family.children),
        members: safeArray(family.members)
    };
}

function getPartner(life) {
    return (
        life.partner ||
        life.marriage?.partner ||
        life.relationships?.partner ||
        null
    );
}

function getMarriage(life) {
    return life.marriage || {};
}

function getEducation(life) {
    return life.education || {};
}

function getEmployment(life) {
    return life.employment || {};
}

function getResidence(life) {
    return life.residence || {};
}

function getVehicles(life) {
    const vehicles = life.vehicles || {};

    if (Array.isArray(vehicles)) {
        return vehicles;
    }

    return safeArray(
        vehicles.vehicles ||
        vehicles.garage ||
        vehicles.items
    );
}

function getLifestyle(life) {
    return life.lifestyle || {};
}

function getLifeHistory(life) {
    const history = life.history || {};

    if (Array.isArray(history)) {
        return history;
    }

    return safeArray(
        history.entries ||
        history.records ||
        history.events
    );
}

function getMilestones(life) {
    const milestones = life.milestones || {};

    if (Array.isArray(milestones)) {
        return milestones;
    }

    return safeArray(
        milestones.completed ||
        milestones.items ||
        milestones.records
    );
}

// ============================================================
// DERIVAÇÕES
// ============================================================

function getRelationshipCount(life) {
    return getRelationships(life).length;
}

function getFriendCount(life) {
    const relationships = getRelationships(life);

    return relationships.filter(relation => {
        const type =
            relation.type ||
            relation.category ||
            relation.status;

        return [
            "friend",
            "best_friend",
            "friendship"
        ].includes(type);
    }).length;
}

function getRivalCount(life) {
    const relationships = getRelationships(life);

    return relationships.filter(relation => {
        const type =
            relation.type ||
            relation.category ||
            relation.status;

        return [
            "rival",
            "enemy"
        ].includes(type);
    }).length;
}

function getMarriageStatus(life) {
    const marriage = getMarriage(life);

    return (
        marriage.status ||
        life.relationshipStatus ||
        (getPartner(life) ? "partner" : "single")
    );
}

function getEmploymentStatus(life) {
    const employment = getEmployment(life);

    return (
        employment.status ||
        (employment.active ? "employed" : "unemployed")
    );
}

function getResidenceName(life) {
    const residence = getResidence(life);

    return (
        residence.name ||
        residence.type ||
        residence.property?.name ||
        residence.property?.type ||
        "Não definida"
    );
}

function getLifestyleLevel(life) {
    const lifestyle = getLifestyle(life);

    return (
        lifestyle.level ||
        lifestyle.currentLevel ||
        lifestyle.tier ||
        "—"
    );
}

function getNetWorth(database) {
    const db = getDatabase(database);

    const candidates = [
        getNested(db, "business.wealth.netWorth"),
        getNested(db, "business.finances.netWorth"),
        getNested(db, "business.finances.cash"),
        getNested(db, "business.finance.netWorth"),
        getNested(db, "player.money"),
        getNested(db, "player.cash")
    ];

    for (const value of candidates) {
        const number = Number(value);

        if (Number.isFinite(number)) {
            return number;
        }
    }

    return 0;
}

function getLifeScore(life) {
    const engine = life.engine || {};

    return (
        engine.lifeScore ??
        life.lifeScore ??
        life.score ??
        "—"
    );
}

// ============================================================
// LABELS
// ============================================================

function relationshipLabel(type) {
    const labels = {
        stranger: "Desconhecido",
        acquaintance: "Conhecido",
        friend: "Amigo",
        best_friend: "Melhor amigo",
        rival: "Rival",
        enemy: "Inimigo",
        romantic_interest: "Interesse romântico",
        partner: "Parceiro(a)",
        ex_partner: "Ex-parceiro(a)",
        family: "Família",
        parent: "Pai/Mãe",
        child: "Filho(a)",
        sibling: "Irmão/Irmã",
        grandparent: "Avô/Avó",
        grandchild: "Neto(a)"
    };

    return labels[type] || capitalize(type || "Relação");
}

function marriageLabel(status) {
    const labels = {
        dating: "Namorando",
        serious: "Relacionamento sério",
        engaged: "Noivo(a)",
        married: "Casado(a)",
        separated: "Separado(a)",
        divorced: "Divorciado(a)",
        widowed: "Viúvo(a)",
        partner: "Companheiro(a)",
        single: "Solteiro(a)"
    };

    return labels[status] || capitalize(status || "—");
}

function employmentLabel(status) {
    const labels = {
        employed: "Empregado",
        active: "Trabalhando",
        unemployed: "Desempregado",
        retired: "Aposentado",
        self_employed: "Autônomo",
        inactive: "Inativo"
    };

    return labels[status] || capitalize(status || "—");
}

function lifestyleLabel(level) {
    if (level === "—") return "—";

    const labels = {
        1: "Sobrevivência",
        2: "Básico",
        3: "Modesto",
        4: "Confortável",
        5: "Alto",
        6: "Premium",
        7: "Luxo",
        8: "Ultra Luxo",
        9: "Elite",
        10: "Bilionário"
    };

    return labels[level] || capitalize(level);
}

// ============================================================
// RENDER — COMPONENTES
// ============================================================

function renderHeader(database) {
    const player = getPlayer(database);
    const life = getLife(database);

    return `
        <section class="life-overview-header">
            <div>
                <span class="life-overview-eyebrow">LIFE</span>
                <h1>Vida</h1>
                <p>
                    Acompanhe sua vida pessoal, família, patrimônio
                    e evolução fora do octógono.
                </p>
            </div>

            <div class="life-overview-profile">
                <div class="life-overview-avatar">
                    ${escapeHTML(
                        getName(player).charAt(0).toUpperCase()
                    )}
                </div>

                <div>
                    <strong>${escapeHTML(getName(player))}</strong>
                    <span>
                        ${escapeHTML(String(getAge(player)))} anos
                        · ${escapeHTML(getCountry(player))}
                    </span>
                </div>
            </div>
        </section>
    `;
}

function renderQuickStats(database) {
    const life = getLife(database);

    const relationships = getRelationshipCount(life);
    const friends = getFriendCount(life);
    const children = getChildren(life, getPlayer(database)).length;
    const milestones = getMilestones(life).length;
    const netWorth = getNetWorth(database);
    const score = getLifeScore(life);

    return `
        <section class="life-stat-grid">

            <article class="life-stat-card">
                <span>Relacionamentos</span>
                <strong>${formatNumber(relationships)}</strong>
                <small>${formatNumber(friends)} amizades</small>
            </article>

            <article class="life-stat-card">
                <span>Família</span>
                <strong>${formatNumber(children)}</strong>
                <small>filho(s)</small>
            </article>

            <article class="life-stat-card">
                <span>Patrimônio</span>
                <strong>${formatMoney(netWorth)}</strong>
                <small>valor estimado</small>
            </article>

            <article class="life-stat-card">
                <span>Marcos</span>
                <strong>${formatNumber(milestones)}</strong>
                <small>conquistas de vida</small>
            </article>

            <article class="life-stat-card">
                <span>Life Score</span>
                <strong>${escapeHTML(String(score))}</strong>
                <small>qualidade da trajetória</small>
            </article>

        </section>
    `;
}

function renderPersonalCard(database) {
    const player = getPlayer(database);

    return `
        <article class="life-card">
            <div class="life-card-header">
                <div>
                    <span class="life-card-kicker">IDENTIDADE</span>
                    <h2>Informações pessoais</h2>
                </div>
            </div>

            <div class="life-info-list">

                <div>
                    <span>Nome</span>
                    <strong>${escapeHTML(getName(player))}</strong>
                </div>

                <div>
                    <span>Idade</span>
                    <strong>${escapeHTML(String(getAge(player)))}</strong>
                </div>

                <div>
                    <span>Gênero</span>
                    <strong>${escapeHTML(String(getGender(player)))}</strong>
                </div>

                <div>
                    <span>País</span>
                    <strong>${escapeHTML(String(getCountry(player)))}</strong>
                </div>

                <div>
                    <span>Cidade</span>
                    <strong>${escapeHTML(String(getCity(player)))}</strong>
                </div>

            </div>
        </article>
    `;
}

function renderRelationshipCard(database) {
    const life = getLife(database);
    const relationships = getRelationships(life);
    const partner = getPartner(life);
    const status = getMarriageStatus(life);

    const recent = relationships.slice(-5).reverse();

    return `
        <article class="life-card">

            <div class="life-card-header">
                <div>
                    <span class="life-card-kicker">SOCIAL</span>
                    <h2>Relacionamentos</h2>
                </div>

                <span class="life-card-badge">
                    ${formatNumber(relationships.length)}
                </span>
            </div>

            <div class="life-highlight">
                <div>
                    <span>Status amoroso</span>
                    <strong>${escapeHTML(marriageLabel(status))}</strong>
                </div>

                <div>
                    <span>Parceiro(a)</span>
                    <strong>
                        ${escapeHTML(
                            partner?.name ||
                            partner?.fullName ||
                            "Nenhum"
                        )}
                    </strong>
                </div>
            </div>

            ${
                recent.length
                    ? `
                        <div class="life-list">
                            ${recent.map(relation => `
                                <div class="life-list-row">
                                    <div class="life-list-icon">♥</div>

                                    <div>
                                        <strong>
                                            ${escapeHTML(
                                                relation.name ||
                                                relation.fullName ||
                                                "Pessoa"
                                            )}
                                        </strong>

                                        <span>
                                            ${escapeHTML(
                                                relationshipLabel(
                                                    relation.type ||
                                                    relation.category ||
                                                    relation.status
                                                )
                                            )}
                                        </span>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    `
                    : `
                        <div class="life-empty">
                            Você ainda não possui relacionamentos registrados.
                        </div>
                    `
            }

        </article>
    `;
}

function renderFamilyCard(database) {
    const life = getLife(database);
    const player = getPlayer(database);
    const family = getFamily(life);
    const children = getChildren(life, player);

    return `
        <article class="life-card">

            <div class="life-card-header">
                <div>
                    <span class="life-card-kicker">FAMÍLIA</span>
                    <h2>Família</h2>
                </div>
            </div>

            <div class="life-family-grid">

                <div>
                    <span>Pais</span>
                    <strong>${formatNumber(family.parents.length)}</strong>
                </div>

                <div>
                    <span>Irmãos</span>
                    <strong>${formatNumber(family.siblings.length)}</strong>
                </div>

                <div>
                    <span>Filhos</span>
                    <strong>${formatNumber(children.length)}</strong>
                </div>

                <div>
                    <span>Membros</span>
                    <strong>${formatNumber(family.members.length)}</strong>
                </div>

            </div>

            ${
                children.length
                    ? `
                        <div class="life-list">
                            ${children.slice(0, 4).map(child => `
                                <div class="life-list-row">
                                    <div class="life-list-icon">♟</div>

                                    <div>
                                        <strong>
                                            ${escapeHTML(
                                                child.name ||
                                                child.fullName ||
                                                "Filho(a)"
                                            )}
                                        </strong>

                                        <span>
                                            ${escapeHTML(
                                                child.age !== undefined
                                                    ? `${child.age} anos`
                                                    : "Idade não definida"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    `
                    : `
                        <div class="life-empty">
                            Nenhum filho registrado.
                        </div>
                    `
            }

        </article>
    `;
}

function renderCareerOutsideMMA(database) {
    const life = getLife(database);
    const education = getEducation(life);
    const employment = getEmployment(life);

    return `
        <article class="life-card">

            <div class="life-card-header">
                <div>
                    <span class="life-card-kicker">DESENVOLVIMENTO</span>
                    <h2>Educação e trabalho</h2>
                </div>
            </div>

            <div class="life-highlight">

                <div>
                    <span>Educação</span>
                    <strong>
                        ${escapeHTML(
                            education.level ||
                            education.currentLevel ||
                            education.status ||
                            "Não definida"
                        )}
                    </strong>
                </div>

                <div>
                    <span>Emprego</span>
                    <strong>
                        ${escapeHTML(
                            employment.jobTitle ||
                            employment.profession ||
                            employment.career ||
                            employment.title ||
                            "Nenhum"
                        )}
                    </strong>
                </div>

            </div>

            <div class="life-mini-stats">

                <div>
                    <span>Status profissional</span>
                    <strong>
                        ${escapeHTML(
                            employmentLabel(
                                getEmploymentStatus(life)
                            )
                        )}
                    </strong>
                </div>

                <div>
                    <span>Salário</span>
                    <strong>
                        ${formatMoney(
                            employment.salary ||
                            employment.monthlySalary ||
                            0
                        )}
                    </strong>
                </div>

            </div>

        </article>
    `;
}

function renderHomeCard(database) {
    const life = getLife(database);
    const residence = getResidence(life);

    return `
        <article class="life-card">

            <div class="life-card-header">
                <div>
                    <span class="life-card-kicker">PATRIMÔNIO</span>
                    <h2>Residência</h2>
                </div>
            </div>

            <div class="life-property">

                <div class="life-property-icon">⌂</div>

                <div>
                    <strong>
                        ${escapeHTML(getResidenceName(life))}
                    </strong>

                    <span>
                        ${
                            residence.ownership
                                ? escapeHTML(
                                    capitalize(
                                        residence.ownership
                                    )
                                )
                                : "Situação não definida"
                        }
                    </span>
                </div>

            </div>

            <div class="life-mini-stats">

                <div>
                    <span>Custo mensal</span>
                    <strong>
                        ${formatMoney(
                            residence.monthlyCost ||
                            residence.monthlyExpenses ||
                            residence.rent ||
                            0
                        )}
                    </strong>
                </div>

                <div>
                    <span>Valor</span>
                    <strong>
                        ${formatMoney(
                            residence.value ||
                            residence.price ||
                            0
                        )}
                    </strong>
                </div>

            </div>

        </article>
    `;
}

function renderVehiclesCard(database) {
    const life = getLife(database);
    const vehicles = getVehicles(life);

    return `
        <article class="life-card">

            <div class="life-card-header">
                <div>
                    <span class="life-card-kicker">GARAGEM</span>
                    <h2>Veículos</h2>
                </div>

                <span class="life-card-badge">
                    ${formatNumber(vehicles.length)}
                </span>
            </div>

            ${
                vehicles.length
                    ? `
                        <div class="life-list">
                            ${vehicles.slice(0, 4).map(vehicle => `
                                <div class="life-list-row">

                                    <div class="life-list-icon">▣</div>

                                    <div>
                                        <strong>
                                            ${escapeHTML(
                                                vehicle.name ||
                                                vehicle.model ||
                                                vehicle.brand ||
                                                "Veículo"
                                            )}
                                        </strong>

                                        <span>
                                            ${escapeHTML(
                                                vehicle.type ||
                                                vehicle.category ||
                                                "Veículo"
                                            )}
                                        </span>
                                    </div>

                                    <strong class="life-list-value">
                                        ${formatMoney(
                                            vehicle.value ||
                                            vehicle.price ||
                                            0
                                        )}
                                    </strong>

                                </div>
                            `).join("")}
                        </div>
                    `
                    : `
                        <div class="life-empty">
                            Sua garagem está vazia.
                        </div>
                    `
            }

        </article>
    `;
}

function renderLifestyleCard(database) {
    const life = getLife(database);
    const lifestyle = getLifestyle(life);

    return `
        <article class="life-card">

            <div class="life-card-header">
                <div>
                    <span class="life-card-kicker">ESTILO DE VIDA</span>
                    <h2>Qualidade de vida</h2>
                </div>
            </div>

            <div class="life-lifestyle-level">

                <div class="life-level-number">
                    ${escapeHTML(
                        String(getLifestyleLevel(life))
                    )}
                </div>

                <div>
                    <span>Nível atual</span>

                    <strong>
                        ${escapeHTML(
                            lifestyleLabel(
                                getLifestyleLevel(life)
                            )
                        )}
                    </strong>

                    <small>
                        ${
                            lifestyle.happiness !== undefined
                                ? `Felicidade: ${formatNumber(lifestyle.happiness)}`
                                : "Felicidade não registrada"
                        }
                    </small>
                </div>

            </div>

            <div class="life-mini-stats">

                <div>
                    <span>Conforto</span>
                    <strong>
                        ${escapeHTML(
                            String(
                                lifestyle.comfort ??
                                lifestyle.comfortScore ??
                                "—"
                            )
                        )}
                    </strong>
                </div>

                <div>
                    <span>Estresse</span>
                    <strong>
                        ${escapeHTML(
                            String(
                                lifestyle.stress ??
                                lifestyle.stressScore ??
                                "—"
                            )
                        )}
                    </strong>
                </div>

            </div>

        </article>
    `;
}

function renderHistoryCard(database) {
    const life = getLife(database);
    const history = getLifeHistory(life);

    const recent = history.slice(-6).reverse();

    return `
        <article class="life-card life-card-wide">

            <div class="life-card-header">
                <div>
                    <span class="life-card-kicker">HISTÓRIA</span>
                    <h2>Últimos acontecimentos</h2>
                </div>

                <span class="life-card-badge">
                    ${formatNumber(history.length)}
                </span>
            </div>

            ${
                recent.length
                    ? `
                        <div class="life-timeline">
                            ${recent.map(item => `
                                <div class="life-timeline-item">

                                    <div class="life-timeline-dot"></div>

                                    <div>
                                        <strong>
                                            ${escapeHTML(
                                                item.title ||
                                                item.name ||
                                                item.description ||
                                                "Acontecimento"
                                            )}
                                        </strong>

                                        <span>
                                            ${escapeHTML(
                                                item.date ||
                                                item.createdAt ||
                                                item.year ||
                                                ""
                                            )}
                                        </span>

                                        ${
                                            item.description &&
                                            item.title
                                                ? `
                                                    <p>
                                                        ${escapeHTML(
                                                            item.description
                                                        )}
                                                    </p>
                                                `
                                                : ""
                                        }

                                    </div>

                                </div>
                            `).join("")}
                        </div>
                    `
                    : `
                        <div class="life-empty">
                            Sua história de vida ainda está começando.
                        </div>
                    `
            }

        </article>
    `;
}

function renderMilestonesCard(database) {
    const life = getLife(database);
    const milestones = getMilestones(life);

    const recent = milestones.slice(-6).reverse();

    return `
        <article class="life-card life-card-wide">

            <div class="life-card-header">
                <div>
                    <span class="life-card-kicker">CONQUISTAS</span>
                    <h2>Marcos de vida</h2>
                </div>

                <span class="life-card-badge">
                    ${formatNumber(milestones.length)}
                </span>
            </div>

            ${
                recent.length
                    ? `
                        <div class="life-milestone-grid">
                            ${recent.map(milestone => `
                                <div class="life-milestone">

                                    <div class="life-milestone-icon">
                                        ★
                                    </div>

                                    <div>
                                        <strong>
                                            ${escapeHTML(
                                                milestone.name ||
                                                milestone.title ||
                                                milestone.label ||
                                                "Marco"
                                            )}
                                        </strong>

                                        <span>
                                            ${escapeHTML(
                                                milestone.description ||
                                                milestone.date ||
                                                ""
                                            )}
                                        </span>
                                    </div>

                                </div>
                            `).join("")}
                        </div>
                    `
                    : `
                        <div class="life-empty">
                            Nenhum marco de vida conquistado ainda.
                        </div>
                    `
            }

        </article>
    `;
}

// ============================================================
// RENDER — ABAS
// ============================================================

function renderOverview(database) {
    return `
        <div class="life-overview-grid">

            ${renderPersonalCard(database)}
            ${renderRelationshipCard(database)}

            ${renderFamilyCard(database)}
            ${renderCareerOutsideMMA(database)}

            ${renderHomeCard(database)}
            ${renderVehiclesCard(database)}

            ${renderLifestyleCard(database)}
            ${renderMilestonesCard(database)}

            ${renderHistoryCard(database)}

        </div>
    `;
}

function renderRelationships(database) {
    const life = getLife(database);
    const relationships = getRelationships(life);

    return `
        <section class="life-detail-section">

            <div class="life-detail-header">
                <span class="life-card-kicker">SOCIAL</span>
                <h2>Todos os relacionamentos</h2>
                <p>
                    Pessoas importantes, amizades, rivais e relações amorosas.
                </p>
            </div>

            <div class="life-detail-grid">

                ${
                    relationships.length
                        ? relationships.map(relation => `
                            <article class="life-detail-card">

                                <div class="life-detail-icon">♥</div>

                                <div>
                                    <strong>
                                        ${escapeHTML(
                                            relation.name ||
                                            relation.fullName ||
                                            "Pessoa"
                                        )}
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            relationshipLabel(
                                                relation.type ||
                                                relation.category ||
                                                relation.status
                                            )
                                        )}
                                    </span>

                                    ${
                                        relation.score !== undefined
                                            ? `
                                                <small>
                                                    Relação:
                                                    ${formatNumber(
                                                        relation.score
                                                    )}
                                                </small>
                                            `
                                            : ""
                                    }

                                </div>

                            </article>
                        `).join("")
                        : `
                            <div class="life-empty">
                                Nenhum relacionamento cadastrado.
                            </div>
                        `
                }

            </div>

        </section>
    `;
}

function renderFamily(database) {
    const life = getLife(database);
    const family = getFamily(life);
    const children = getChildren(life, getPlayer(database));

    const all = [
        ...family.parents,
        ...family.siblings,
        ...children,
        ...family.members
    ];

    return `
        <section class="life-detail-section">

            <div class="life-detail-header">
                <span class="life-card-kicker">FAMÍLIA</span>
                <h2>Árvore familiar</h2>
                <p>
                    Acompanhe os membros da família e a evolução das gerações.
                </p>
            </div>

            <div class="life-detail-grid">

                ${
                    all.length
                        ? all.map(member => `
                            <article class="life-detail-card">

                                <div class="life-detail-icon">♟</div>

                                <div>
                                    <strong>
                                        ${escapeHTML(
                                            member.name ||
                                            member.fullName ||
                                            "Membro da família"
                                        )}
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            member.relation ||
                                            member.type ||
                                            "Família"
                                        )}
                                    </span>

                                    ${
                                        member.age !== undefined
                                            ? `
                                                <small>
                                                    ${formatNumber(member.age)}
                                                    anos
                                                </small>
                                            `
                                            : ""
                                    }

                                </div>

                            </article>
                        `).join("")
                        : `
                            <div class="life-empty">
                                Sua árvore familiar ainda não possui registros.
                            </div>
                        `
                }

            </div>

        </section>
    `;
}

function renderFinances(database) {
    const life = getLife(database);
    const netWorth = getNetWorth(database);

    const residence = getResidence(life);
    const vehicles = getVehicles(life);

    return `
        <section class="life-detail-section">

            <div class="life-detail-header">
                <span class="life-card-kicker">PATRIMÔNIO</span>
                <h2>Vida financeira</h2>
                <p>
                    Visão geral do patrimônio ligado à sua vida pessoal.
                </p>
            </div>

            <div class="life-finance-grid">

                <article class="life-finance-card">
                    <span>Patrimônio</span>
                    <strong>${formatMoney(netWorth)}</strong>
                </article>

                <article class="life-finance-card">
                    <span>Residência</span>
                    <strong>
                        ${formatMoney(
                            residence.value ||
                            residence.price ||
                            0
                        )}
                    </strong>
                </article>

                <article class="life-finance-card">
                    <span>Veículos</span>
                    <strong>
                        ${formatMoney(
                            vehicles.reduce(
                                (total, vehicle) =>
                                    total +
                                    Number(
                                        vehicle.value ||
                                        vehicle.price ||
                                        0
                                    ),
                                0
                            )
                        )}
                    </strong>
                </article>

                <article class="life-finance-card">
                    <span>Despesas mensais</span>
                    <strong>
                        ${formatMoney(
                            (residence.monthlyCost || 0) +
                            (life.lifestyle?.monthlyExpenses || 0)
                        )}
                    </strong>
                </article>

            </div>

        </section>
    `;
}

function renderLifestyle(database) {
    const life = getLife(database);
    const lifestyle = getLifestyle(life);

    return `
        <section class="life-detail-section">

            <div class="life-detail-header">
                <span class="life-card-kicker">ESTILO DE VIDA</span>
                <h2>Seu estilo de vida</h2>
                <p>
                    Conforto, felicidade, gastos e qualidade de vida.
                </p>
            </div>

            <div class="life-lifestyle-panel">

                <div class="life-big-level">
                    ${escapeHTML(
                        String(getLifestyleLevel(life))
                    )}
                </div>

                <div>
                    <span>Nível de vida</span>
                    <h3>
                        ${escapeHTML(
                            lifestyleLabel(
                                getLifestyleLevel(life)
                            )
                        )}
                    </h3>

                    <p>
                        ${
                            lifestyle.description ||
                            "Seu estilo de vida será afetado pelo patrimônio, renda, gastos e decisões pessoais."
                        }
                    </p>
                </div>

            </div>

        </section>
    `;
}

function renderHistory(database) {
    const life = getLife(database);
    const history = getLifeHistory(life);

    return `
        <section class="life-detail-section">

            <div class="life-detail-header">
                <span class="life-card-kicker">HISTÓRIA</span>
                <h2>Linha do tempo</h2>
                <p>
                    Todos os acontecimentos importantes da sua vida.
                </p>
            </div>

            <div class="life-full-history">

                ${
                    history.length
                        ? history.slice().reverse().map(item => `
                            <div class="life-full-history-row">

                                <div class="life-history-date">
                                    ${escapeHTML(
                                        item.date ||
                                        item.createdAt ||
                                        item.year ||
                                        ""
                                    )}
                                </div>

                                <div>
                                    <strong>
                                        ${escapeHTML(
                                            item.title ||
                                            item.name ||
                                            "Acontecimento"
                                        )}
                                    </strong>

                                    <p>
                                        ${escapeHTML(
                                            item.description ||
                                            ""
                                        )}
                                    </p>
                                </div>

                            </div>
                        `).join("")
                        : `
                            <div class="life-empty">
                                Nenhum acontecimento registrado.
                            </div>
                        `
                }

            </div>

        </section>
    `;
}

function renderMilestones(database) {
    const life = getLife(database);
    const milestones = getMilestones(life);

    return `
        <section class="life-detail-section">

            <div class="life-detail-header">
                <span class="life-card-kicker">CONQUISTAS</span>
                <h2>Marcos da vida</h2>
                <p>
                    Grandes momentos que definem sua trajetória.
                </p>
            </div>

            <div class="life-detail-grid">

                ${
                    milestones.length
                        ? milestones.map(milestone => `
                            <article class="life-detail-card">

                                <div class="life-detail-icon">★</div>

                                <div>
                                    <strong>
                                        ${escapeHTML(
                                            milestone.name ||
                                            milestone.title ||
                                            milestone.label ||
                                            "Marco"
                                        )}
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            milestone.description ||
                                            milestone.date ||
                                            ""
                                        )}
                                    </span>
                                </div>

                            </article>
                        `).join("")
                        : `
                            <div class="life-empty">
                                Nenhum marco conquistado ainda.
                            </div>
                        `
                }

            </div>

        </section>
    `;
}

// ============================================================
// RENDER PRINCIPAL
// ============================================================

function render(database = null) {
    const db = getDatabase(database);

    if (!db) {
        return `
            <section class="life-overview-error">
                <h2>Vida</h2>
                <p>Banco de dados ainda não disponível.</p>
            </section>
        `;
    }

    state.database = db;

    const tab = state.activeTab;

    let content;

    switch (tab) {
        case "relationships":
            content = renderRelationships(db);
            break;

        case "family":
            content = renderFamily(db);
            break;

        case "finances":
            content = renderFinances(db);
            break;

        case "lifestyle":
            content = renderLifestyle(db);
            break;

        case "history":
            content = renderHistory(db);
            break;

        case "milestones":
            content = renderMilestones(db);
            break;

        case "overview":
        default:
            content = renderOverview(db);
            break;
    }

    const html = `
        <div class="life-overview-screen">

            ${renderHeader(db)}

            ${renderQuickStats(db)}

            <nav class="life-tabs">

                ${renderTab("overview", "Visão geral")}
                ${renderTab("relationships", "Relacionamentos")}
                ${renderTab("family", "Família")}
                ${renderTab("finances", "Finanças")}
                ${renderTab("lifestyle", "Estilo de vida")}
                ${renderTab("history", "História")}
                ${renderTab("milestones", "Marcos")}

            </nav>

            <main class="life-tab-content">
                ${content}
            </main>

        </div>
    `;

    state.lastRender = {
        timestamp: Date.now(),
        tab,
        html
    };

    return html;
}

function renderTab(id, label) {
    const active = state.activeTab === id;

    return `
        <button
            type="button"
            class="life-tab ${active ? "active" : ""}"
            data-life-tab="${escapeHTML(id)}"
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
        "[data-life-tab]"
    );

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const tab = button.dataset.lifeTab;

            if (!tab) return;

            setActiveTab(tab);
            renderToDOM(state.database);
        });
    });
}

function setActiveTab(tab) {
    const allowed = [
        "overview",
        "relationships",
        "family",
        "finances",
        "lifestyle",
        "history",
        "milestones"
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
    if (document.getElementById("mma-life-overview-styles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "mma-life-overview-styles";

    style.textContent = `
        .life-overview-screen {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 24px;
            box-sizing: border-box;
        }

        .life-overview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 24px;
            margin-bottom: 24px;
        }

        .life-overview-eyebrow,
        .life-card-kicker {
            display: block;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 1.5px;
            opacity: .65;
            margin-bottom: 5px;
            text-transform: uppercase;
        }

        .life-overview-header h1 {
            margin: 0;
            font-size: 32px;
            line-height: 1.1;
        }

        .life-overview-header p {
            margin: 8px 0 0;
            opacity: .7;
            max-width: 650px;
        }

        .life-overview-profile {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 220px;
        }

        .life-overview-profile > div:last-child {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .life-overview-profile span {
            font-size: 12px;
            opacity: .65;
        }

        .life-overview-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background: currentColor;
            color: inherit;
            border: 1px solid currentColor;
            font-weight: 900;
            position: relative;
        }

        .life-overview-avatar::after {
            content: "";
            position: absolute;
            inset: 3px;
            border-radius: 50%;
            border: 1px solid rgba(127,127,127,.25);
        }

        .life-stat-grid {
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 12px;
            margin-bottom: 20px;
        }

        .life-stat-card,
        .life-card,
        .life-finance-card,
        .life-detail-card {
            border: 1px solid rgba(127,127,127,.22);
            border-radius: 16px;
            background: rgba(127,127,127,.045);
        }

        .life-stat-card {
            padding: 16px;
        }

        .life-stat-card span,
        .life-stat-card small {
            display: block;
            opacity: .65;
        }

        .life-stat-card strong {
            display: block;
            font-size: 23px;
            margin: 7px 0 3px;
        }

        .life-stat-card small {
            font-size: 11px;
        }

        .life-tabs {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding: 4px 2px 12px;
            margin-bottom: 4px;
            scrollbar-width: thin;
        }

        .life-tab {
            border: 1px solid rgba(127,127,127,.25);
            background: transparent;
            border-radius: 999px;
            padding: 9px 14px;
            cursor: pointer;
            white-space: nowrap;
            font: inherit;
            color: inherit;
            opacity: .75;
        }

        .life-tab:hover {
            opacity: 1;
        }

        .life-tab.active {
            opacity: 1;
            border-color: currentColor;
            font-weight: 800;
        }

        .life-overview-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
        }

        .life-card {
            padding: 20px;
            min-width: 0;
        }

        .life-card-wide {
            grid-column: 1 / -1;
        }

        .life-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 18px;
        }

        .life-card-header h2 {
            margin: 0;
            font-size: 18px;
        }

        .life-card-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 28px;
            height: 28px;
            padding: 0 8px;
            border-radius: 999px;
            border: 1px solid rgba(127,127,127,.25);
            font-size: 12px;
            font-weight: 800;
        }

        .life-info-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
        }

        .life-info-list > div,
        .life-mini-stats > div,
        .life-highlight > div {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .life-info-list span,
        .life-mini-stats span,
        .life-highlight span,
        .life-family-grid span,
        .life-property span,
        .life-lifestyle-level span,
        .life-finance-card span {
            font-size: 11px;
            opacity: .6;
            text-transform: uppercase;
            letter-spacing: .4px;
        }

        .life-info-list strong,
        .life-mini-stats strong,
        .life-highlight strong {
            font-size: 14px;
        }

        .life-highlight {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(127,127,127,.16);
            margin-bottom: 14px;
        }

        .life-family-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 10px;
            margin-bottom: 16px;
        }

        .life-family-grid > div {
            padding: 12px;
            border-radius: 12px;
            background: rgba(127,127,127,.06);
        }

        .life-family-grid strong {
            display: block;
            font-size: 20px;
            margin-top: 5px;
        }

        .life-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .life-list-row {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            border-radius: 12px;
            background: rgba(127,127,127,.045);
        }

        .life-list-icon {
            width: 32px;
            height: 32px;
            border-radius: 9px;
            display: grid;
            place-items: center;
            border: 1px solid rgba(127,127,127,.2);
            flex-shrink: 0;
        }

        .life-list-row > div:nth-child(2) {
            display: flex;
            flex-direction: column;
            min-width: 0;
            flex: 1;
        }

        .life-list-row span {
            font-size: 11px;
            opacity: .6;
            margin-top: 2px;
        }

        .life-list-value {
            font-size: 12px;
        }

        .life-property {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 18px;
        }

        .life-property-icon {
            width: 46px;
            height: 46px;
            border-radius: 12px;
            display: grid;
            place-items: center;
            border: 1px solid rgba(127,127,127,.25);
            font-size: 20px;
        }

        .life-property > div:last-child {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .life-mini-stats {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
        }

        .life-lifestyle-level {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 18px;
        }

        .life-level-number,
        .life-big-level {
            display: grid;
            place-items: center;
            width: 58px;
            height: 58px;
            border-radius: 16px;
            border: 1px solid rgba(127,127,127,.25);
            font-size: 25px;
            font-weight: 900;
            flex-shrink: 0;
        }

        .life-lifestyle-level > div:last-child {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .life-lifestyle-level small {
            opacity: .6;
            font-size: 11px;
        }

        .life-empty {
            padding: 18px;
            text-align: center;
            border-radius: 12px;
            border: 1px dashed rgba(127,127,127,.25);
            opacity: .65;
            font-size: 13px;
        }

        .life-timeline {
            display: flex;
            flex-direction: column;
            gap: 0;
        }

        .life-timeline-item {
            display: grid;
            grid-template-columns: 18px 1fr;
            gap: 12px;
            position: relative;
            padding-bottom: 18px;
        }

        .life-timeline-item:last-child {
            padding-bottom: 0;
        }

        .life-timeline-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 2px solid currentColor;
            margin-top: 4px;
        }

        .life-timeline-item strong {
            display: block;
            font-size: 14px;
        }

        .life-timeline-item span {
            display: block;
            font-size: 11px;
            opacity: .55;
            margin-top: 3px;
        }

        .life-timeline-item p {
            margin: 6px 0 0;
            font-size: 12px;
            opacity: .7;
        }

        .life-milestone-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
        }

        .life-milestone {
            display: flex;
            gap: 10px;
            padding: 12px;
            border-radius: 12px;
            background: rgba(127,127,127,.045);
        }

        .life-milestone-icon {
            width: 30px;
            height: 30px;
            display: grid;
            place-items: center;
            border-radius: 8px;
            border: 1px solid rgba(127,127,127,.22);
            flex-shrink: 0;
        }

        .life-milestone strong,
        .life-milestone span {
            display: block;
        }

        .life-milestone span {
            margin-top: 3px;
            font-size: 11px;
            opacity: .6;
        }

        .life-detail-section {
            padding: 4px 0 20px;
        }

        .life-detail-header {
            margin-bottom: 18px;
        }

        .life-detail-header h2 {
            margin: 0;
            font-size: 25px;
        }

        .life-detail-header p {
            margin: 7px 0 0;
            opacity: .65;
            max-width: 700px;
        }

        .life-detail-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
        }

        .life-detail-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 15px;
        }

        .life-detail-icon {
            width: 42px;
            height: 42px;
            display: grid;
            place-items: center;
            border-radius: 12px;
            border: 1px solid rgba(127,127,127,.22);
            flex-shrink: 0;
        }

        .life-detail-card > div:last-child {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .life-detail-card span,
        .life-detail-card small {
            font-size: 11px;
            opacity: .6;
        }

        .life-finance-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 12px;
        }

        .life-finance-card {
            padding: 18px;
        }

        .life-finance-card strong {
            display: block;
            font-size: 22px;
            margin-top: 8px;
        }

        .life-lifestyle-panel {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 24px;
            border: 1px solid rgba(127,127,127,.22);
            border-radius: 16px;
            background: rgba(127,127,127,.045);
        }

        .life-lifestyle-panel h3 {
            margin: 5px 0;
            font-size: 23px;
        }

        .life-lifestyle-panel p {
            margin: 0;
            opacity: .65;
            max-width: 650px;
        }

        .life-full-history {
            display: flex;
            flex-direction: column;
            gap: 0;
        }

        .life-full-history-row {
            display: grid;
            grid-template-columns: 130px 1fr;
            gap: 18px;
            padding: 16px 0;
            border-bottom: 1px solid rgba(127,127,127,.16);
        }

        .life-full-history-row:last-child {
            border-bottom: 0;
        }

        .life-history-date {
            font-size: 12px;
            opacity: .6;
        }

        .life-full-history-row p {
            margin: 5px 0 0;
            font-size: 12px;
            opacity: .65;
        }

        .life-overview-error {
            padding: 30px;
            text-align: center;
        }

        @media (max-width: 1100px) {
            .life-stat-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }

            .life-detail-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .life-finance-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }

        @media (max-width: 760px) {
            .life-overview-screen {
                padding: 15px;
            }

            .life-overview-header {
                align-items: flex-start;
                flex-direction: column;
            }

            .life-overview-profile {
                width: 100%;
            }

            .life-stat-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .life-overview-grid {
                grid-template-columns: 1fr;
            }

            .life-card-wide {
                grid-column: auto;
            }

            .life-family-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .life-milestone-grid {
                grid-template-columns: 1fr;
            }

            .life-detail-grid {
                grid-template-columns: 1fr;
            }

            .life-finance-grid {
                grid-template-columns: 1fr;
            }

            .life-full-history-row {
                grid-template-columns: 1fr;
                gap: 6px;
            }
        }

        @media (max-width: 480px) {
            .life-stat-grid {
                grid-template-columns: 1fr;
            }

            .life-info-list,
            .life-highlight,
            .life-mini-stats {
                grid-template-columns: 1fr;
            }

            .life-overview-header h1 {
                font-size: 27px;
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

    return renderToDOM(state.database);
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

    return refresh(state.database);
}

function close() {
    return true;
}

// ============================================================
// ESTADO
// ============================================================

function getState() {
    return clone({
        version: LIFE_OVERVIEW_SCREEN_VERSION,
        initialized: state.initialized,
        activeTab: state.activeTab,
        lastRender: state.lastRender
            ? {
                timestamp: state.lastRender.timestamp,
                tab: state.lastRender.tab
            }
            : null
    });
}

function getSnapshot(database = null) {
    const db = getDatabase(database);
    const life = getLife(db);

    return {
        version: LIFE_OVERVIEW_SCREEN_VERSION,
        player: clone(getPlayer(db)),
        relationships: clone(getRelationships(life)),
        family: clone(getFamily(life)),
        marriage: clone(getMarriage(life)),
        education: clone(getEducation(life)),
        employment: clone(getEmployment(life)),
        residence: clone(getResidence(life)),
        vehicles: clone(getVehicles(life)),
        lifestyle: clone(getLifestyle(life)),
        history: clone(getLifeHistory(life)),
        milestones: clone(getMilestones(life))
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

const lifeOverviewScreenAPI = {
    version: LIFE_OVERVIEW_SCREEN_VERSION,

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
    getPlayer,
    getLife,
    getRelationships,
    getChildren,
    getFamily,
    getPartner,
    getMarriage,
    getEducation,
    getEmployment,
    getResidence,
    getVehicles,
    getLifestyle,
    getLifeHistory,
    getMilestones
};

globalThis.lifeOverviewScreenAPI = lifeOverviewScreenAPI;
globalThis.MMA_LIFE_LIFE_OVERVIEW_SCREEN = lifeOverviewScreenAPI;

// ============================================================
// EVENTO READY
// ============================================================

if (typeof window !== "undefined") {
    window.addEventListener("DOMContentLoaded", () => {
        injectStyles();

        window.dispatchEvent(
            new CustomEvent(
                "mma-life-life-overview-screen-ready",
                {
                    detail: lifeOverviewScreenAPI
                }
            )
        );
    });
}

// ============================================================
// EXPORTS
// ============================================================

export {
    LIFE_OVERVIEW_SCREEN_VERSION,
    lifeOverviewScreenAPI,

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

export default lifeOverviewScreenAPI;
