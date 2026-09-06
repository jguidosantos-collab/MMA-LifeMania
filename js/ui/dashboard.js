// ============================================================
// MMA LIFE DYNASTY
// UI — DASHBOARD
// ============================================================

const DASHBOARD_VERSION = 1;

const dashboardState = {
    initialized: false,
    database: null,
    lastRender: 0
};

// ============================================================
// UTILIDADES
// ============================================================

function clone(value) {
    if (value === undefined || value === null) {
        return value;
    }

    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function getDatabase(database = null) {
    return (
        database ||
        dashboardState.database ||
        (typeof window !== "undefined"
            ? window.MMA_LIFE_DATABASE
            : null) ||
        null
    );
}

function setDatabase(database) {
    dashboardState.database =
        database || null;

    return dashboardState.database;
}

function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getElement(id) {
    if (typeof document === "undefined") {
        return null;
    }

    return document.getElementById(id);
}

function clamp(value, min = 0, max = 100) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return min;
    }

    return Math.min(
        max,
        Math.max(min, number)
    );
}

function formatNumber(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return new Intl.NumberFormat(
        "pt-BR"
    ).format(number);
}

function formatMoney(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "US$ 0";
    }

    return new Intl.NumberFormat(
        "pt-BR",
        {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
        }
    ).format(number);
}

function capitalize(value) {
    const text = String(value ?? "");

    if (!text) {
        return "";
    }

    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );
}

// ============================================================
// ACESSO AO PLAYER
// ============================================================

function getPlayer(database) {
    return database?.player || {};
}

function getIdentity(database) {
    const player =
        getPlayer(database);

    return (
        player.identity ||
        player.profile ||
        {}
    );
}

function getPlayerName(database) {
    const player =
        getPlayer(database);

    const identity =
        getIdentity(database);

    return (
        identity.fullName ||
        identity.name ||
        player.fullName ||
        player.name ||
        [
            identity.firstName,
            identity.lastName
        ]
            .filter(Boolean)
            .join(" ") ||
        "Novo Lutador"
    );
}

function getNickname(database) {
    const identity =
        getIdentity(database);

    const player =
        getPlayer(database);

    return (
        identity.nickname ||
        player.nickname ||
        ""
    );
}

function getAge(database) {
    const player =
        getPlayer(database);

    const identity =
        getIdentity(database);

    return (
        Number(
            player.age ??
            identity.age ??
            18
        ) || 18
    );
}

function getCountry(database) {
    const player =
        getPlayer(database);

    const identity =
        getIdentity(database);

    return (
        identity.countryName ||
        identity.country ||
        player.countryName ||
        player.country ||
        "Brasil"
    );
}

function getCity(database) {
    const player =
        getPlayer(database);

    const identity =
        getIdentity(database);

    return (
        identity.cityName ||
        identity.city ||
        player.cityName ||
        player.city ||
        "—"
    );
}

function getWeightClass(database) {
    const player =
        getPlayer(database);

    return (
        player.weightClass ||
        player.weightClassName ||
        player.division ||
        "—"
    );
}

function getFightingStyle(database) {
    const player =
        getPlayer(database);

    return (
        player.fightingStyle ||
        player.style ||
        player.martialArt ||
        "MMA"
    );
}

function getStance(database) {
    const player =
        getPlayer(database);

    return (
        player.stance ||
        "Orthodox"
    );
}

// ============================================================
// CARREIRA
// ============================================================

function getCareer(database) {
    return database?.career || {};
}

function getCareerStage(database) {
    const career =
        getCareer(database);

    const player =
        getPlayer(database);

    return (
        career.stage ||
        career.careerStage ||
        player.careerStage ||
        "Amateur"
    );
}

function isProfessional(database) {
    const career =
        getCareer(database);

    const player =
        getPlayer(database);

    return Boolean(
        career.professional ??
        career.isProfessional ??
        player.professional?.active ??
        player.professional ??
        false
    );
}

function getCurrentPromotion(database) {
    const career =
        getCareer(database);

    const professional =
        career.professional;

    const promotion =
        career.currentPromotion ||
        career.currentOrganization ||
        professional?.promotion ||
        professional?.organization ||
        null;

    if (
        typeof promotion === "string"
    ) {
        return promotion;
    }

    if (
        promotion &&
        typeof promotion === "object"
    ) {
        return (
            promotion.name ||
            promotion.shortName ||
            promotion.id ||
            "Sem organização"
        );
    }

    return "Sem organização";
}

function getRank(database) {
    const career =
        getCareer(database);

    const rankings =
        database?.world?.rankings ||
        {};

    return (
        career.rank ??
        career.currentRank ??
        rankings.player?.rank ??
        "—"
    );
}

function getRecord(database) {
    const career =
        getCareer(database);

    const player =
        getPlayer(database);

    const records =
        career.records ||
        player.records ||
        {};

    const amateur =
        records.amateur ||
        career.amateur ||
        {};

    const professional =
        records.professional ||
        career.professional ||
        {};

    return {
        wins:
            Number(
                professional.wins ??
                records.wins ??
                0
            ) || 0,

        losses:
            Number(
                professional.losses ??
                records.losses ??
                0
            ) || 0,

        draws:
            Number(
                professional.draws ??
                records.draws ??
                0
            ) || 0,

        amateurWins:
            Number(
                amateur.wins ??
                0
            ) || 0,

        amateurLosses:
            Number(
                amateur.losses ??
                0
            ) || 0
    };
}

// ============================================================
// ATRIBUTOS
// ============================================================

function getAttributes(database) {
    const player =
        getPlayer(database);

    return (
        player.attributes ||
        database?.player?.attributes ||
        {}
    );
}

function getOverall(database) {
    const player =
        getPlayer(database);

    const attributes =
        getAttributes(database);

    if (
        Number.isFinite(
            Number(player.overall)
        )
    ) {
        return clamp(
            Number(player.overall)
        );
    }

    const values =
        Object.values(attributes)
            .map(Number)
            .filter(Number.isFinite);

    if (!values.length) {
        return 0;
    }

    return clamp(
        Math.round(
            values.reduce(
                (sum, value) =>
                    sum + value,
                0
            ) / values.length
        )
    );
}

function getTopAttributes(database) {
    const attributes =
        getAttributes(database);

    const ignored = [
        "overall",
        "ovr",
        "potential",
        "age"
    ];

    return Object.entries(
        attributes
    )
        .filter(
            ([key, value]) =>
                !ignored.includes(
                    key.toLowerCase()
                ) &&
                Number.isFinite(
                    Number(value)
                )
        )
        .map(
            ([key, value]) => ({
                key,
                value: clamp(
                    Number(value)
                )
            })
        )
        .sort(
            (a, b) =>
                b.value - a.value
        )
        .slice(0, 4);
}

function attributeLabel(key) {
    const labels = {
        striking: "Striking",
        grappling: "Grappling",
        wrestling: "Wrestling",
        submission: "Finalizações",
        takedown: "Quedas",
        takedowns: "Quedas",
        defense: "Defesa",
        speed: "Velocidade",
        power: "Potência",
        cardio: "Cardio",
        endurance: "Resistência",
        strength: "Força",
        technique: "Técnica",
        chin: "Queixo",
        recovery: "Recuperação"
    };

    return (
        labels[key] ||
        capitalize(
            String(key)
                .replaceAll("_", " ")
        )
    );
}

// ============================================================
// RECURSOS
// ============================================================

function getTraining(database) {
    return database?.training || {};
}

function getEnergy(database) {
    const training =
        getTraining(database);

    return clamp(
        Number(
            training.energy ??
            training.stamina ??
            100
        ),
        0,
        100
    );
}

function getFatigue(database) {
    const training =
        getTraining(database);

    return clamp(
        Number(
            training.fatigue ??
            0
        ),
        0,
        100
    );
}

function getHealth(database) {
    const health =
        database?.health ||
        database?.training?.health ||
        {};

    return clamp(
        Number(
            health.overall ??
            health.value ??
            health.condition ??
            100
        ),
        0,
        100
    );
}

function getPotential(database) {
    const player =
        getPlayer(database);

    const potential =
        player.potential;

    if (
        typeof potential === "object"
    ) {
        return clamp(
            Number(
                potential.overall ??
                potential.value ??
                potential.rating ??
                0
            )
        );
    }

    return clamp(
        Number(
            potential ??
            player.potentialRating ??
            0
        )
    );
}

// ============================================================
// FINANÇAS
// ============================================================

function getCash(database) {
    const business =
        database?.business ||
        {};

    const finances =
        business.finances ||
        {};

    return Number(
        finances.cash ??
        business.cash ??
        database?.finances?.cash ??
        0
    ) || 0;
}

function getCareerEarnings(database) {
    const finances =
        database?.business?.finances ||
        {};

    return Number(
        finances.careerEarnings ??
        finances.totalEarnings ??
        0
    ) || 0;
}

function getNetWorth(database) {
    const business =
        database?.business ||
        {};

    const wealth =
        business.wealth ||
        {};

    return Number(
        wealth.netWorth ??
        business.netWorth ??
        database?.finances?.netWorth ??
        getCash(database)
    ) || 0;
}

// ============================================================
// MÍDIA
// ============================================================

function getMedia(database) {
    return database?.media || {};
}

function getFame(database) {
    const media =
        getMedia(database);

    return clamp(
        Number(
            media.fame ??
            media.fameScore ??
            0
        )
    );
}

function getFollowers(database) {
    const media =
        getMedia(database);

    return Math.max(
        0,
        Number(
            media.followers ??
            media.socialFollowers ??
            0
        ) || 0
    );
}

function getReputation(database) {
    const media =
        getMedia(database);

    return clamp(
        Number(
            media.reputation ??
            0
        )
    );
}

// ============================================================
// FAMÍLIA
// ============================================================

function getChildren(database) {
    const life =
        database?.life ||
        {};

    if (
        Array.isArray(life.children)
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

function getPartner(database) {
    const life =
        database?.life ||
        {};

    const partner =
        life.partner ||
        life.marriage?.partner ||
        null;

    if (
        typeof partner === "string"
    ) {
        return partner;
    }

    if (
        partner &&
        typeof partner === "object"
    ) {
        return (
            partner.name ||
            partner.fullName ||
            "Relacionamento"
        );
    }

    return "Solteiro";
}

// ============================================================
// PRÓXIMA LUTA
// ============================================================

function getNextFight(database) {
    const events =
        database?.world?.events;

    let list = [];

    if (
        Array.isArray(events)
    ) {
        list = events;
    } else if (
        events &&
        typeof events === "object"
    ) {
        list =
            Object.values(events);
    }

    const fights =
        database?.career?.upcomingFights ||
        database?.mma?.upcomingFights ||
        [];

    if (
        Array.isArray(fights) &&
        fights.length
    ) {
        return fights[0];
    }

    const playerId =
        database?.player?.id;

    const candidates =
        list.filter(
            event =>
                event &&
                (
                    event.status ===
                        "scheduled" ||
                    event.status ===
                        "upcoming" ||
                    event.status ===
                        "confirmed"
                )
        );

    if (!candidates.length) {
        return null;
    }

    for (
        const event of candidates
    ) {
        const eventFights =
            Array.isArray(
                event.fights
            )
                ? event.fights
                : [];

        const fight =
            eventFights.find(
                item =>
                    item.playerId ===
                        playerId ||
                    item.fighterId ===
                        playerId ||
                    item.redCorner?.id ===
                        playerId ||
                    item.blueCorner?.id ===
                        playerId
            );

        if (fight) {
            return {
                ...fight,
                event
            };
        }
    }

    return null;
}

function getOpponentName(fight) {
    if (!fight) {
        return "";
    }

    const playerId =
        fight.playerId ||
        fight.fighterId;

    const possible = [
        fight.opponent,
        fight.opponentName,
        fight.redCorner,
        fight.blueCorner
    ];

    for (
        const value of possible
    ) {
        if (
            typeof value === "string"
        ) {
            return value;
        }

        if (
            value &&
            typeof value === "object"
        ) {
            const id =
                value.id;

            if (
                id !== playerId
            ) {
                return (
                    value.name ||
                    value.fullName ||
                    ""
                );
            }
        }
    }

    return "Adversário";
}

// ============================================================
// DATA
// ============================================================

function getCurrentDate(database) {
    const meta =
        database?.meta ||
        {};

    const calendar =
        database?.calendar ||
        {};

    return (
        meta.currentDate ||
        calendar.currentDate ||
        "Dia não definido"
    );
}

// ============================================================
// COMPONENTES
// ============================================================

function renderProgress(
    value,
    label,
    extraClass = ""
) {
    const percentage =
        clamp(value);

    return `
        <div class="
            mma-life-dashboard-progress
            ${extraClass}
        ">

            <div class="
                mma-life-dashboard-progress-top
            ">
                <span>
                    ${escapeHTML(label)}
                </span>

                <strong>
                    ${Math.round(
                        percentage
                    )}
                </strong>
            </div>

            <div class="
                mma-life-dashboard-progress-track
            ">
                <div
                    class="
                        mma-life-dashboard-progress-fill
                    "
                    style="width:${percentage}%"
                ></div>
            </div>

        </div>
    `;
}

function renderCard(
    title,
    content,
    className = ""
) {
    return `
        <section class="
            mma-life-dashboard-card
            ${className}
        ">

            <div class="
                mma-life-dashboard-card-title
            ">
                ${escapeHTML(title)}
            </div>

            <div class="
                mma-life-dashboard-card-content
            ">
                ${content}
            </div>

        </section>
    `;
}

// ============================================================
// PERFIL
// ============================================================

function renderProfile(database) {
    const name =
        getPlayerName(database);

    const nickname =
        getNickname(database);

    const age =
        getAge(database);

    const country =
        getCountry(database);

    const city =
        getCity(database);

    const division =
        getWeightClass(database);

    const style =
        getFightingStyle(database);

    const stance =
        getStance(database);

    const stage =
        getCareerStage(database);

    const professional =
        isProfessional(database);

    return `
        <section class="
            mma-life-dashboard-profile
        ">

            <div class="
                mma-life-dashboard-avatar
            ">
                🥊
            </div>

            <div class="
                mma-life-dashboard-profile-main
            ">

                <div class="
                    mma-life-dashboard-profile-name
                ">
                    ${escapeHTML(name)}
                </div>

                ${
                    nickname
                        ? `
                            <div class="
                                mma-life-dashboard-profile-nickname
                            ">
                                “${escapeHTML(
                                    nickname
                                )}”
                            </div>
                        `
                        : ""
                }

                <div class="
                    mma-life-dashboard-profile-meta
                ">

                    <span>
                        ${escapeHTML(
                            age
                        )} anos
                    </span>

                    <span>
                        ${escapeHTML(
                            city
                        )}, ${escapeHTML(
                            country
                        )}
                    </span>

                    <span>
                        ${escapeHTML(
                            division
                        )}
                    </span>

                </div>

            </div>

            <div class="
                mma-life-dashboard-career-badge
            ">

                <span>
                    ${professional
                        ? "PROFISSIONAL"
                        : "AMADOR"}
                </span>

                <strong>
                    ${escapeHTML(stage)}
                </strong>

            </div>

        </section>

        <section class="
            mma-life-dashboard-style-row
        ">

            <div>
                <span>Estilo</span>
                <strong>
                    ${escapeHTML(style)}
                </strong>
            </div>

            <div>
                <span>Base</span>
                <strong>
                    ${escapeHTML(stance)}
                </strong>
            </div>

            <div>
                <span>Organização</span>
                <strong>
                    ${escapeHTML(
                        getCurrentPromotion(
                            database
                        )
                    )}
                </strong>
            </div>

        </section>
    `;
}

// ============================================================
// RESUMO DE CARREIRA
// ============================================================

function renderCareer(database) {
    const record =
        getRecord(database);

    const overall =
        getOverall(database);

    const potential =
        getPotential(database);

    const rank =
        getRank(database);

    return renderCard(
        "CARREIRA",
        `
            <div class="
                mma-life-dashboard-career-top
            ">

                <div class="
                    mma-life-dashboard-overall
                ">
                    <span>OVR</span>
                    <strong>
                        ${Math.round(
                            overall
                        )}
                    </strong>
                </div>

                <div class="
                    mma-life-dashboard-record
                ">

                    <strong>
                        ${record.wins} -
                        ${record.losses} -
                        ${record.draws}
                    </strong>

                    <span>
                        Cartel profissional
                    </span>

                </div>

                <div class="
                    mma-life-dashboard-rank
                ">

                    <span>Ranking</span>

                    <strong>
                        ${
                            rank === "—"
                                ? "—"
                                : `#${escapeHTML(
                                    rank
                                )}`
                        }
                    </strong>

                </div>

            </div>

            ${renderProgress(
                potential,
                "Potencial"
            )}
        `,
        "career-card"
    );
}

// ============================================================
// RECURSOS
// ============================================================

function renderResources(database) {
    return renderCard(
        "RECURSOS",
        `
            ${renderProgress(
                getEnergy(database),
                "Energia"
            )}

            ${renderProgress(
                100 -
                    getFatigue(database),
                "Recuperação"
            )}

            ${renderProgress(
                getHealth(database),
                "Saúde"
            )}

            <div class="
                mma-life-dashboard-resource-money
            ">
                <span>Dinheiro disponível</span>
                <strong>
                    ${escapeHTML(
                        formatMoney(
                            getCash(database)
                        )
                    )}
                </strong>
            </div>
        `,
        "resources-card"
    );
}

// ============================================================
// PRÓXIMA LUTA
// ============================================================

function renderNextFight(database) {
    const fight =
        getNextFight(database);

    if (!fight) {
        return renderCard(
            "PRÓXIMA LUTA",
            `
                <div class="
                    mma-life-dashboard-empty
                ">
                    <span class="
                        mma-life-dashboard-empty-icon
                    ">
                        ⚔
                    </span>

                    <strong>
                        Nenhuma luta marcada
                    </strong>

                    <p>
                        Continue sua carreira,
                        treine e procure novas oportunidades.
                    </p>
                </div>
            `,
            "fight-card"
        );
    }

    const opponent =
        getOpponentName(fight);

    const event =
        fight.event ||
        {};

    const promotion =
        event.organization ||
        event.promotion ||
        fight.promotion ||
        "Evento";

    return renderCard(
        "PRÓXIMA LUTA",
        `
            <div class="
                mma-life-dashboard-fight
            ">

                <div class="
                    mma-life-dashboard-fight-event
                ">
                    ${escapeHTML(
                        event.name ||
                        fight.eventName ||
                        "Próximo combate"
                    )}
                </div>

                <div class="
                    mma-life-dashboard-fight-versus
                ">

                    <div>
                        <span>VOCÊ</span>
                        <strong>
                            ${escapeHTML(
                                getPlayerName(
                                    database
                                )
                            )}
                        </strong>
                    </div>

                    <b>VS</b>

                    <div>
                        <span>ADVERSÁRIO</span>
                        <strong>
                            ${escapeHTML(
                                opponent
                            )}
                        </strong>
                    </div>

                </div>

                <div class="
                    mma-life-dashboard-fight-meta
                ">
                    <span>
                        ${escapeHTML(
                            promotion
                        )}
                    </span>

                    <span>
                        ${
                            event.date ||
                            fight.date ||
                            "Data a definir"
                        }
                    </span>
                </div>

            </div>
        `,
        "fight-card"
    );
}

// ============================================================
// ATRIBUTOS
// ============================================================

function renderAttributes(database) {
    const attributes =
        getTopAttributes(database);

    if (!attributes.length) {
        return renderCard(
            "ATRIBUTOS",
            `
                <div class="
                    mma-life-dashboard-empty
                ">
                    Atributos ainda não definidos.
                </div>
            `,
            "attributes-card"
        );
    }

    return renderCard(
        "PRINCIPAIS ATRIBUTOS",
        `
            <div class="
                mma-life-dashboard-attributes
            ">

                ${attributes.map(
                    attribute =>
                        renderProgress(
                            attribute.value,
                            attributeLabel(
                                attribute.key
                            )
                        )
                ).join("")}

            </div>
        `,
        "attributes-card"
    );
}

// ============================================================
// VIDA
// ============================================================

function renderLife(database) {
    const children =
        getChildren(database);

    const partner =
        getPartner(database);

    return renderCard(
        "VIDA",
        `
            <div class="
                mma-life-dashboard-life-grid
            ">

                <div>
                    <span>Relacionamento</span>
                    <strong>
                        ${escapeHTML(
                            partner
                        )}
                    </strong>
                </div>

                <div>
                    <span>Filhos</span>
                    <strong>
                        ${formatNumber(
                            children.length
                        )}
                    </strong>
                </div>

                <div>
                    <span>Patrimônio</span>
                    <strong>
                        ${escapeHTML(
                            formatMoney(
                                getNetWorth(
                                    database
                                )
                            )
                        )}
                    </strong>
                </div>

                <div>
                    <span>Data</span>
                    <strong>
                        ${escapeHTML(
                            getCurrentDate(
                                database
                            )
                        )}
                    </strong>
                </div>

            </div>
        `,
        "life-card"
    );
}

// ============================================================
// MÍDIA
// ============================================================

function renderMedia(database) {
    return renderCard(
        "MÍDIA",
        `
            <div class="
                mma-life-dashboard-media-grid
            ">

                <div>
                    <span>Fama</span>
                    <strong>
                        ${Math.round(
                            getFame(database)
                        )}
                    </strong>
                </div>

                <div>
                    <span>Seguidores</span>
                    <strong>
                        ${formatNumber(
                            getFollowers(
                                database
                            )
                        )}
                    </strong>
                </div>

                <div>
                    <span>Reputação</span>
                    <strong>
                        ${Math.round(
                            getReputation(
                                database
                            )
                        )}
                    </strong>
                </div>

            </div>
        `,
        "media-card"
    );
}

// ============================================================
// DASHBOARD COMPLETO
// ============================================================

function renderDashboard(
    database = null
) {
    const db =
        getDatabase(database);

    return `
        <div
            class="mma-life-dashboard"
            data-dashboard
        >

            ${renderProfile(db)}

            <div class="
                mma-life-dashboard-grid
            ">

                <div class="
                    mma-life-dashboard-column
                ">

                    ${renderCareer(db)}

                    ${renderNextFight(db)}

                    ${renderAttributes(db)}

                </div>

                <div class="
                    mma-life-dashboard-column
                ">

                    ${renderResources(db)}

                    ${renderLife(db)}

                    ${renderMedia(db)}

                </div>

            </div>

        </div>
    `;
}

// ============================================================
// CONTAINER
// ============================================================

function getContainer() {
    return (
        getElement(
            "mma-life-content"
        ) ||
        getElement(
            "mma-life-dashboard"
        )
    );
}

function createContainer() {
    if (
        typeof document === "undefined"
    ) {
        return null;
    }

    let container =
        getContainer();

    if (container) {
        return container;
    }

    container =
        document.createElement(
            "div"
        );

    container.id =
        "mma-life-content";

    document.body.appendChild(
        container
    );

    return container;
}

// ============================================================
// ESTILOS
// ============================================================

function injectStyles() {
    if (
        typeof document === "undefined"
    ) {
        return;
    }

    if (
        getElement(
            "mma-life-dashboard-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "mma-life-dashboard-styles";

    style.textContent = `
        .mma-life-dashboard {
            width: 100%;
            max-width: 1500px;
            margin: 0 auto;
        }

        .mma-life-dashboard-profile {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 20px;
            border: 1px solid
                rgba(255,255,255,.07);
            border-radius: 14px;
            background:
                rgba(255,255,255,.025);
        }

        .mma-life-dashboard-avatar {
            width: 64px;
            height: 64px;
            flex-shrink: 0;
            display: grid;
            place-items: center;
            border-radius: 15px;
            background:
                rgba(255,255,255,.07);
            border: 1px solid
                rgba(255,255,255,.08);
            font-size: 28px;
        }

        .mma-life-dashboard-profile-main {
            min-width: 0;
            flex: 1;
        }

        .mma-life-dashboard-profile-name {
            color: #ffffff;
            font-size: 21px;
            font-weight: 850;
            letter-spacing: -.02em;
        }

        .mma-life-dashboard-profile-nickname {
            margin-top: 2px;
            color: #777780;
            font-size: 11px;
        }

        .mma-life-dashboard-profile-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
            margin-top: 9px;
        }

        .mma-life-dashboard-profile-meta span {
            padding: 5px 8px;
            border-radius: 6px;
            background:
                rgba(255,255,255,.045);
            color: #9999a2;
            font-size: 10px;
        }

        .mma-life-dashboard-career-badge {
            min-width: 105px;
            padding: 10px;
            text-align: right;
        }

        .mma-life-dashboard-career-badge span {
            display: block;
            color: #686871;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: .1em;
        }

        .mma-life-dashboard-career-badge strong {
            display: block;
            margin-top: 4px;
            color: #ffffff;
            font-size: 12px;
        }

        .mma-life-dashboard-style-row {
            display: grid;
            grid-template-columns:
                repeat(3, 1fr);
            gap: 10px;
            margin-top: 10px;
        }

        .mma-life-dashboard-style-row > div {
            padding: 11px 13px;
            border:
                1px solid
                rgba(255,255,255,.055);
            border-radius: 9px;
            background:
                rgba(255,255,255,.018);
        }

        .mma-life-dashboard-style-row span,
        .mma-life-dashboard-life-grid span,
        .mma-life-dashboard-media-grid span {
            display: block;
            color: #66666f;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .07em;
        }

        .mma-life-dashboard-style-row strong {
            display: block;
            margin-top: 4px;
            color: #c7c7cd;
            font-size: 11px;
        }

        .mma-life-dashboard-grid {
            display: grid;
            grid-template-columns:
                minmax(0, 1fr)
                minmax(0, 1fr);
            gap: 12px;
            margin-top: 12px;
        }

        .mma-life-dashboard-column {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .mma-life-dashboard-card {
            padding: 17px;
            border:
                1px solid
                rgba(255,255,255,.07);
            border-radius: 13px;
            background:
                rgba(255,255,255,.022);
        }

        .mma-life-dashboard-card-title {
            margin-bottom: 14px;
            color: #696971;
            font-size: 9px;
            font-weight: 850;
            letter-spacing: .13em;
        }

        .mma-life-dashboard-card-content {
            width: 100%;
        }

        .mma-life-dashboard-career-top {
            display: grid;
            grid-template-columns:
                auto 1fr auto;
            align-items: center;
            gap: 14px;
            margin-bottom: 17px;
        }

        .mma-life-dashboard-overall {
            width: 65px;
            height: 65px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 14px;
            background:
                rgba(255,255,255,.06);
        }

        .mma-life-dashboard-overall span {
            color: #686871;
            font-size: 8px;
            font-weight: 800;
        }

        .mma-life-dashboard-overall strong {
            margin-top: 2px;
            color: #ffffff;
            font-size: 23px;
            line-height: 1;
        }

        .mma-life-dashboard-record strong {
            display: block;
            color: #ffffff;
            font-size: 18px;
        }

        .mma-life-dashboard-record span {
            display: block;
            margin-top: 3px;
            color: #696971;
            font-size: 9px;
        }

        .mma-life-dashboard-rank {
            text-align: right;
        }

        .mma-life-dashboard-rank span {
            display: block;
            color: #696971;
            font-size: 9px;
        }

        .mma-life-dashboard-rank strong {
            display: block;
            margin-top: 3px;
            color: #ffffff;
            font-size: 17px;
        }

        .mma-life-dashboard-progress {
            margin-top: 11px;
        }

        .mma-life-dashboard-progress:first-child {
            margin-top: 0;
        }

        .mma-life-dashboard-progress-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
        }

        .mma-life-dashboard-progress-top span {
            color: #85858d;
            font-size: 10px;
        }

        .mma-life-dashboard-progress-top strong {
            color: #bdbdc4;
            font-size: 9px;
        }

        .mma-life-dashboard-progress-track {
            height: 5px;
            overflow: hidden;
            border-radius: 99px;
            background:
                rgba(255,255,255,.07);
        }

        .mma-life-dashboard-progress-fill {
            height: 100%;
            border-radius: inherit;
            background: #ffffff;
            transition: width .25s ease;
        }

        .mma-life-dashboard-resource-money {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-top: 17px;
            padding-top: 14px;
            border-top:
                1px solid
                rgba(255,255,255,.055);
        }

        .mma-life-dashboard-resource-money span {
            color: #777780;
            font-size: 10px;
        }

        .mma-life-dashboard-resource-money strong {
            color: #ffffff;
            font-size: 14px;
        }

        .mma-life-dashboard-fight-event {
            color: #66666f;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: .08em;
        }

        .mma-life-dashboard-fight-versus {
            display: grid;
            grid-template-columns:
                1fr auto 1fr;
            align-items: center;
            gap: 10px;
            margin: 16px 0;
        }

        .mma-life-dashboard-fight-versus > div {
            min-width: 0;
        }

        .mma-life-dashboard-fight-versus > div:last-child {
            text-align: right;
        }

        .mma-life-dashboard-fight-versus span {
            display: block;
            color: #66666f;
            font-size: 8px;
            font-weight: 800;
        }

        .mma-life-dashboard-fight-versus strong {
            display: block;
            margin-top: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #ffffff;
            font-size: 12px;
        }

        .mma-life-dashboard-fight-versus b {
            color: #777780;
            font-size: 11px;
        }

        .mma-life-dashboard-fight-meta {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            padding-top: 12px;
            border-top:
                1px solid
                rgba(255,255,255,.055);
            color: #8a8a93;
            font-size: 9px;
        }

        .mma-life-dashboard-attributes {
            display: grid;
            grid-template-columns:
                1fr 1fr;
            column-gap: 18px;
        }

        .mma-life-dashboard-life-grid {
            display: grid;
            grid-template-columns:
                1fr 1fr;
            gap: 14px;
        }

        .mma-life-dashboard-life-grid strong,
        .mma-life-dashboard-media-grid strong {
            display: block;
            margin-top: 4px;
            color: #ffffff;
            font-size: 12px;
        }

        .mma-life-dashboard-media-grid {
            display: grid;
            grid-template-columns:
                repeat(3, 1fr);
            gap: 10px;
        }

        .mma-life-dashboard-media-grid > div {
            padding: 11px;
            border-radius: 8px;
            background:
                rgba(255,255,255,.035);
        }

        .mma-life-dashboard-empty {
            min-height: 105px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #707079;
            font-size: 10px;
        }

        .mma-life-dashboard-empty-icon {
            margin-bottom: 8px;
            color: #ffffff;
            font-size: 21px;
        }

        .mma-life-dashboard-empty strong {
            color: #c3c3c9;
            font-size: 11px;
        }

        .mma-life-dashboard-empty p {
            max-width: 330px;
            margin: 5px 0 0;
            color: #606068;
            font-size: 9px;
            line-height: 1.5;
        }

        @media (max-width: 900px) {

            .mma-life-dashboard-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 600px) {

            .mma-life-dashboard-profile {
                align-items: flex-start;
                flex-wrap: wrap;
            }

            .mma-life-dashboard-career-badge {
                width: 100%;
                padding: 0;
                text-align: left;
            }

            .mma-life-dashboard-style-row {
                grid-template-columns: 1fr;
            }

            .mma-life-dashboard-career-top {
                grid-template-columns:
                    auto 1fr;
            }

            .mma-life-dashboard-rank {
                display: none;
            }

            .mma-life-dashboard-attributes {
                grid-template-columns: 1fr;
            }

            .mma-life-dashboard-media-grid {
                grid-template-columns: 1fr;
            }
        }
    `;

    document.head.appendChild(
        style
    );
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

function initializeDashboard(
    database = null,
    options = {}
) {
    if (database) {
        setDatabase(database);
    }

    injectStyles();
    createContainer();

    dashboardState.initialized =
        true;

    if (
        options.render !== false
    ) {
        render(
            getDatabase()
        );
    }

    return getState();
}

// ============================================================
// RENDER
// ============================================================

function render(
    database = null
) {
    if (database) {
        setDatabase(database);
    }

    if (
        !dashboardState.initialized
    ) {
        initializeDashboard(
            database,
            {
                render: false
            }
        );
    }

    const container =
        createContainer();

    if (!container) {
        return "";
    }

    const html =
        renderDashboard(
            getDatabase()
        );

    container.innerHTML =
        html;

    dashboardState.lastRender =
        Date.now();

    return html;
}

// ============================================================
// REFRESH
// ============================================================

function refresh(
    database = null
) {
    return render(
        database
    );
}

// ============================================================
// ESTADO
// ============================================================

function getState() {
    return {
        version:
            DASHBOARD_VERSION,

        initialized:
            dashboardState.initialized,

        lastRender:
            dashboardState.lastRender
    };
}

function snapshot() {
    return {
        version:
            DASHBOARD_VERSION,

        state:
            clone(
                dashboardState
            )
    };
}

function validate() {
    const errors = [];

    if (
        !dashboardState.initialized
    ) {
        errors.push(
            "Dashboard não inicializado."
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

export const dashboardAPI = {

    version:
        DASHBOARD_VERSION,

    initialize:
        initializeDashboard,

    init:
        initializeDashboard,

    render,
    refresh,

    renderDashboard,

    getDatabase,
    setDatabase,

    getState,
    snapshot,
    validate
};

// ============================================================
// GLOBAL
// ============================================================

if (
    typeof window !== "undefined"
) {
    window.dashboardAPI =
        dashboardAPI;

    window.MMA_LIFE_DASHBOARD =
        dashboardAPI;
}

// ============================================================
// READY EVENT
// ============================================================

if (
    typeof window !== "undefined"
) {
    window.dispatchEvent(
        new CustomEvent(
            "mma-life-dashboard-ready",
            {
                detail: {
                    api:
                        dashboardAPI,

                    version:
                        DASHBOARD_VERSION
                }
            }
        )
    );
}

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default dashboardAPI;
