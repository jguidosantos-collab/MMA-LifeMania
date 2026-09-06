// ============================================================
// MMA LIFE DYNASTY
// UI — CAREER SCREEN
// ============================================================

const CAREER_SCREEN_VERSION = 1;

const careerScreenState = {
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
        careerScreenState.database ||
        (typeof window !== "undefined"
            ? window.MMA_LIFE_DATABASE
            : null) ||
        null
    );
}

function setDatabase(database) {
    careerScreenState.database =
        database || null;

    return careerScreenState.database;
}

function getElement(id) {
    if (typeof document === "undefined") {
        return null;
    }

    return document.getElementById(id);
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
// PLAYER
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
        "Lutador"
    );
}

function getAge(database) {
    const player =
        getPlayer(database);

    const identity =
        getIdentity(database);

    return Number(
        player.age ??
        identity.age ??
        18
    ) || 18;
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

// ============================================================
// CAREER
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

function getProfessional(database) {
    const career =
        getCareer(database);

    const player =
        getPlayer(database);

    return (
        career.professional ||
        player.professional ||
        {}
    );
}

function isProfessional(database) {
    const career =
        getCareer(database);

    const player =
        getPlayer(database);

    return Boolean(
        career.professional === true ||
        career.isProfessional === true ||
        career.professional?.active === true ||
        player.professional === true ||
        player.professional?.active === true
    );
}

function getPromotion(database) {
    const career =
        getCareer(database);

    const professional =
        getProfessional(database);

    const promotion =
        career.currentPromotion ||
        career.currentOrganization ||
        professional.promotion ||
        professional.organization ||
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

function getDivision(database) {
    const career =
        getCareer(database);

    return (
        career.division ||
        career.weightClass ||
        getWeightClass(database)
    );
}

// ============================================================
// RECORD
// ============================================================

function getRecord(database) {
    const career =
        getCareer(database);

    const player =
        getPlayer(database);

    const records =
        career.records ||
        player.records ||
        {};

    const professional =
        records.professional ||
        career.professional ||
        {};

    const amateur =
        records.amateur ||
        career.amateur ||
        {};

    return {
        wins: Number(
            professional.wins ??
            records.wins ??
            0
        ) || 0,

        losses: Number(
            professional.losses ??
            records.losses ??
            0
        ) || 0,

        draws: Number(
            professional.draws ??
            records.draws ??
            0
        ) || 0,

        nc: Number(
            professional.nc ??
            records.nc ??
            0
        ) || 0,

        amateurWins: Number(
            amateur.wins ??
            0
        ) || 0,

        amateurLosses: Number(
            amateur.losses ??
            0
        ) || 0,

        amateurDraws: Number(
            amateur.draws ??
            0
        ) || 0
    };
}

function getTotalFights(database) {
    const record =
        getRecord(database);

    return (
        record.wins +
        record.losses +
        record.draws +
        record.nc
    );
}

function getWinRate(database) {
    const record =
        getRecord(database);

    const decisions =
        record.wins +
        record.losses +
        record.draws;

    if (!decisions) {
        return 0;
    }

    return (
        record.wins /
        decisions
    ) * 100;
}

// ============================================================
// RANKING
// ============================================================

function getRank(database) {
    const career =
        getCareer(database);

    const rankings =
        database?.world?.rankings ||
        {};

    const playerRank =
        rankings.player ||
        {};

    return (
        career.rank ??
        career.currentRank ??
        playerRank.rank ??
        "—"
    );
}

function getRankingPoints(database) {
    const career =
        getCareer(database);

    const rankings =
        career.ranking ||
        {};

    return Number(
        rankings.points ??
        career.rankingPoints ??
        0
    ) || 0;
}

// ============================================================
// TITLES
// ============================================================

function getTitles(database) {
    const career =
        getCareer(database);

    const titles =
        career.titles ||
        database?.world?.champions?.playerTitles ||
        [];

    if (
        Array.isArray(titles)
    ) {
        return titles;
    }

    if (
        titles &&
        typeof titles === "object"
    ) {
        return Object.values(
            titles
        );
    }

    return [];
}

function getTitleCount(database) {
    return getTitles(database).length;
}

function getTitleDefenses(database) {
    const career =
        getCareer(database);

    const titles =
        getTitles(database);

    const careerDefenses =
        Number(
            career.titleDefenses
        );

    if (
        Number.isFinite(
            careerDefenses
        )
    ) {
        return careerDefenses;
    }

    return titles.reduce(
        (total, title) =>
            total +
            Number(
                title.defenses ??
                title.defended ??
                0
            ),
        0
    );
}

// ============================================================
// CONTRACTS
// ============================================================

function getContracts(database) {
    const career =
        getCareer(database);

    const business =
        database?.business ||
        {};

    const contracts =
        career.contracts ||
        business.contracts ||
        [];

    if (
        Array.isArray(contracts)
    ) {
        return contracts;
    }

    if (
        contracts &&
        typeof contracts === "object"
    ) {
        return Object.values(
            contracts
        );
    }

    return [];
}

function getActiveContract(database) {
    const contracts =
        getContracts(database);

    return (
        contracts.find(
            contract =>
                contract &&
                (
                    contract.active === true ||
                    contract.status === "active"
                )
        ) ||
        null
    );
}

function getRemainingFights(contract) {
    if (!contract) {
        return 0;
    }

    return Number(
        contract.remainingFights ??
        contract.fightsRemaining ??
        0
    ) || 0;
}

// ============================================================
// CAREER PROGRESS
// ============================================================

const CAREER_ORDER = [
    "Amateur",
    "Regional",
    "National",
    "International",
    "Elite"
];

function getCareerIndex(database) {
    const stage =
        getCareerStage(database);

    const index =
        CAREER_ORDER.indexOf(
            stage
        );

    return index >= 0
        ? index
        : 0;
}

function getCareerProgress(database) {
    const index =
        getCareerIndex(database);

    if (
        index >=
        CAREER_ORDER.length - 1
    ) {
        return 100;
    }

    return (
        index /
        (CAREER_ORDER.length - 1)
    ) * 100;
}

function getNextStage(database) {
    const index =
        getCareerIndex(database);

    return (
        CAREER_ORDER[index + 1] ||
        null
    );
}

// ============================================================
// OVR / POTENCIAL
// ============================================================

function getAttributes(database) {
    return (
        getPlayer(database).attributes ||
        {}
    );
}

function getOverall(database) {
    const player =
        getPlayer(database);

    const direct =
        Number(
            player.overall ??
            player.ovr
        );

    if (
        Number.isFinite(direct)
    ) {
        return clamp(direct);
    }

    const values =
        Object.values(
            getAttributes(database)
        )
            .map(Number)
            .filter(Number.isFinite);

    if (!values.length) {
        return 0;
    }

    return clamp(
        values.reduce(
            (sum, value) =>
                sum + value,
            0
        ) / values.length
    );
}

function getPotential(database) {
    const player =
        getPlayer(database);

    const potential =
        player.potential;

    if (
        potential &&
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
// CARD
// ============================================================

function renderCard(
    title,
    content,
    className = ""
) {
    return `
        <section class="
            mma-life-career-card
            ${className}
        ">

            <div class="
                mma-life-career-card-title
            ">
                ${escapeHTML(title)}
            </div>

            <div class="
                mma-life-career-card-content
            ">
                ${content}
            </div>

        </section>
    `;
}

// ============================================================
// HEADER
// ============================================================

function renderHeader(database) {
    const name =
        getPlayerName(database);

    const stage =
        getCareerStage(database);

    const age =
        getAge(database);

    const division =
        getDivision(database);

    const promotion =
        getPromotion(database);

    return `
        <section class="
            mma-life-career-header
        ">

            <div class="
                mma-life-career-header-main
            ">

                <div class="
                    mma-life-career-header-label
                ">
                    CARREIRA
                </div>

                <h1>
                    ${escapeHTML(name)}
                </h1>

                <div class="
                    mma-life-career-header-meta
                ">

                    <span>
                        ${escapeHTML(
                            stage
                        )}
                    </span>

                    <span>
                        ${age} anos
                    </span>

                    <span>
                        ${escapeHTML(
                            division
                        )}
                    </span>

                    <span>
                        ${escapeHTML(
                            promotion
                        )}
                    </span>

                </div>

            </div>

            <div class="
                mma-life-career-header-ovr
            ">

                <span>OVR</span>

                <strong>
                    ${Math.round(
                        getOverall(
                            database
                        )
                    )}
                </strong>

            </div>

        </section>
    `;
}

// ============================================================
// PROGRESSÃO
// ============================================================

function renderCareerProgress(database) {
    const progress =
        getCareerProgress(database);

    const stage =
        getCareerStage(database);

    const nextStage =
        getNextStage(database);

    return renderCard(
        "PROGRESSÃO DA CARREIRA",
        `
            <div class="
                mma-life-career-stage-line
            ">

                ${CAREER_ORDER.map(
                    (item, index) => `
                        <div class="
                            mma-life-career-stage
                            ${
                                index <=
                                getCareerIndex(
                                    database
                                )
                                    ? "active"
                                    : ""
                            }
                        ">

                            <div class="
                                mma-life-career-stage-dot
                            "></div>

                            <span>
                                ${escapeHTML(
                                    item
                                )}
                            </span>

                        </div>
                    `
                ).join("")}

            </div>

            <div class="
                mma-life-career-progress-track
            ">
                <div
                    class="
                        mma-life-career-progress-fill
                    "
                    style="width:${progress}%"
                ></div>
            </div>

            <div class="
                mma-life-career-progress-info
            ">

                <span>
                    Estágio atual:
                    <strong>
                        ${escapeHTML(
                            stage
                        )}
                    </strong>
                </span>

                <span>
                    ${
                        nextStage
                            ? `Próximo:
                                ${escapeHTML(
                                    nextStage
                                )}`
                            : "Nível máximo"
                    }
                </span>

            </div>
        `,
        "progress-card"
    );
}

// ============================================================
// CARTEL
// ============================================================

function renderRecord(database) {
    const record =
        getRecord(database);

    return renderCard(
        "CARTEL",
        `
            <div class="
                mma-life-record-main
            ">

                <div>
                    <strong>
                        ${record.wins}
                    </strong>
                    <span>Vitórias</span>
                </div>

                <div>
                    <strong>
                        ${record.losses}
                    </strong>
                    <span>Derrotas</span>
                </div>

                <div>
                    <strong>
                        ${record.draws}
                    </strong>
                    <span>Empates</span>
                </div>

                <div>
                    <strong>
                        ${record.nc}
                    </strong>
                    <span>NC</span>
                </div>

            </div>

            <div class="
                mma-life-record-footer
            ">

                <span>
                    Total de lutas:
                    <strong>
                        ${getTotalFights(
                            database
                        )}
                    </strong>
                </span>

                <span>
                    Aproveitamento:
                    <strong>
                        ${Math.round(
                            getWinRate(
                                database
                            )
                        )}%
                    </strong>
                </span>

            </div>

            ${
                record.amateurWins ||
                record.amateurLosses ||
                record.amateurDraws
                    ? `
                        <div class="
                            mma-life-amateur-record
                        ">
                            Amador:
                            <strong>
                                ${record.amateurWins}-
                                ${record.amateurLosses}-
                                ${record.amateurDraws}
                            </strong>
                        </div>
                    `
                    : ""
            }
        `,
        "record-card"
    );
}

// ============================================================
// RANKING
// ============================================================

function renderRanking(database) {
    const rank =
        getRank(database);

    const points =
        getRankingPoints(database);

    return renderCard(
        "RANKING",
        `
            <div class="
                mma-life-ranking-main
            ">

                <div class="
                    mma-life-ranking-position
                ">

                    <span>POSIÇÃO</span>

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

                <div class="
                    mma-life-ranking-points
                ">

                    <span>PONTOS</span>

                    <strong>
                        ${formatNumber(
                            points
                        )}
                    </strong>

                </div>

            </div>
        `,
        "ranking-card"
    );
}

// ============================================================
// TÍTULOS
// ============================================================

function renderTitles(database) {
    const titles =
        getTitles(database);

    if (!titles.length) {
        return renderCard(
            "TÍTULOS",
            `
                <div class="
                    mma-life-career-empty
                ">
                    <strong>
                        Nenhum título conquistado
                    </strong>

                    <span>
                        Seu primeiro cinturão ainda está esperando.
                    </span>
                </div>
            `,
            "titles-card"
        );
    }

    return renderCard(
        "TÍTULOS",
        `
            <div class="
                mma-life-titles-list
            ">

                ${titles.map(
                    title => `
                        <div class="
                            mma-life-title-item
                        ">

                            <div class="
                                mma-life-title-icon
                            ">
                                🏆
                            </div>

                            <div class="
                                mma-life-title-info
                            ">

                                <strong>
                                    ${escapeHTML(
                                        title.name ||
                                        title.title ||
                                        title.division ||
                                        "Título"
                                    )}
                                </strong>

                                <span>
                                    ${
                                        title.organization ||
                                        title.promotion ||
                                        ""
                                    }
                                </span>

                            </div>

                            <div class="
                                mma-life-title-defenses
                            ">

                                <strong>
                                    ${Number(
                                        title.defenses ??
                                        title.defended ??
                                        0
                                    ) || 0}
                                </strong>

                                <span>
                                    defesas
                                </span>

                            </div>

                        </div>
                    `
                ).join("")}

            </div>

            <div class="
                mma-life-title-summary
            ">

                <span>
                    Títulos:
                    <strong>
                        ${getTitleCount(
                            database
                        )}
                    </strong>
                </span>

                <span>
                    Defesas:
                    <strong>
                        ${getTitleDefenses(
                            database
                        )}
                    </strong>
                </span>

            </div>
        `,
        "titles-card"
    );
}

// ============================================================
// CONTRATO
// ============================================================

function renderContract(database) {
    const contract =
        getActiveContract(database);

    if (!contract) {
        return renderCard(
            "CONTRATO ATUAL",
            `
                <div class="
                    mma-life-career-empty
                ">
                    <strong>
                        Sem contrato ativo
                    </strong>

                    <span>
                        Você está livre para negociar sua próxima oportunidade.
                    </span>
                </div>
            `,
            "contract-card"
        );
    }

    const promotion =
        contract.promotion ||
        contract.organization ||
        getPromotion(database);

    const purse =
        Number(
            contract.purse ??
            contract.basePurse ??
            0
        ) || 0;

    const winBonus =
        Number(
            contract.winBonus ??
            contract.bonus ??
            0
        ) || 0;

    return renderCard(
        "CONTRATO ATUAL",
        `
            <div class="
                mma-life-contract-header
            ">

                <div>
                    <span>ORGANIZAÇÃO</span>
                    <strong>
                        ${escapeHTML(
                            typeof promotion ===
                                "object"
                                ? promotion.name ||
                                  promotion.shortName ||
                                  "Organização"
                                : promotion
                        )}
                    </strong>
                </div>

                <div>
                    <span>LUTAS RESTANTES</span>
                    <strong>
                        ${getRemainingFights(
                            contract
                        )}
                    </strong>
                </div>

            </div>

            <div class="
                mma-life-contract-values
            ">

                <div>
                    <span>BOLSA</span>
                    <strong>
                        ${escapeHTML(
                            formatMoney(
                                purse
                            )
                        )}
                    </strong>
                </div>

                <div>
                    <span>BÔNUS DE VITÓRIA</span>
                    <strong>
                        ${escapeHTML(
                            formatMoney(
                                winBonus
                            )
                        )}
                    </strong>
                </div>

            </div>
        `,
        "contract-card"
    );
}

// ============================================================
// POTENCIAL
// ============================================================

function renderPotential(database) {
    const overall =
        getOverall(database);

    const potential =
        getPotential(database);

    const room =
        Math.max(
            0,
            potential - overall
        );

    return renderCard(
        "DESENVOLVIMENTO",
        `
            <div class="
                mma-life-development-values
            ">

                <div>
                    <span>OVR ATUAL</span>
                    <strong>
                        ${Math.round(
                            overall
                        )}
                    </strong>
                </div>

                <div>
                    <span>POTENCIAL</span>
                    <strong>
                        ${Math.round(
                            potential
                        )}
                    </strong>
                </div>

                <div>
                    <span>ESPAÇO PARA EVOLUIR</span>
                    <strong>
                        +${Math.round(
                            room
                        )}
                    </strong>
                </div>

            </div>

            <div class="
                mma-life-development-track
            ">

                <div
                    style="
                        width:${clamp(
                            overall
                        )}%;
                    "
                ></div>

            </div>
        `,
        "development-card"
    );
}

// ============================================================
// DASHBOARD DA CARREIRA
// ============================================================

function renderCareerScreen(
    database = null
) {
    const db =
        getDatabase(database);

    return `
        <div
            class="mma-life-career-screen"
            data-career-screen
        >

            ${renderHeader(db)}

            ${renderCareerProgress(db)}

            <div class="
                mma-life-career-grid
            ">

                <div class="
                    mma-life-career-column
                ">

                    ${renderRecord(db)}

                    ${renderRanking(db)}

                    ${renderTitles(db)}

                </div>

                <div class="
                    mma-life-career-column
                ">

                    ${renderContract(db)}

                    ${renderPotential(db)}

                    ${renderCard(
                        "DIVISÃO",
                        `
                            <div class="
                                mma-life-division-box
                            ">

                                <span>
                                    CATEGORIA DE PESO
                                </span>

                                <strong>
                                    ${escapeHTML(
                                        getDivision(
                                            db
                                        )
                                    )}
                                </strong>

                            </div>
                        `,
                        "division-card"
                    )}

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
            "mma-life-career-screen"
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
            "mma-life-career-screen-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "mma-life-career-screen-styles";

    style.textContent = `
        .mma-life-career-screen {
            width: 100%;
            max-width: 1500px;
            margin: 0 auto;
        }

        .mma-life-career-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            padding: 22px;
            border:
                1px solid
                rgba(255,255,255,.07);
            border-radius: 14px;
            background:
                rgba(255,255,255,.025);
        }

        .mma-life-career-header-main {
            min-width: 0;
        }

        .mma-life-career-header-label {
            color: #66666f;
            font-size: 9px;
            font-weight: 850;
            letter-spacing: .14em;
        }

        .mma-life-career-header h1 {
            margin: 5px 0 0;
            color: #ffffff;
            font-size: 22px;
            font-weight: 850;
            letter-spacing: -.025em;
        }

        .mma-life-career-header-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
            margin-top: 10px;
        }

        .mma-life-career-header-meta span {
            padding: 5px 8px;
            border-radius: 6px;
            background:
                rgba(255,255,255,.045);
            color: #96969e;
            font-size: 9px;
        }

        .mma-life-career-header-ovr {
            width: 75px;
            height: 75px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 15px;
            background:
                rgba(255,255,255,.07);
        }

        .mma-life-career-header-ovr span {
            color: #6b6b73;
            font-size: 8px;
            font-weight: 800;
        }

        .mma-life-career-header-ovr strong {
            margin-top: 2px;
            color: #ffffff;
            font-size: 28px;
            line-height: 1;
        }

        .mma-life-career-card {
            padding: 17px;
            border:
                1px solid
                rgba(255,255,255,.07);
            border-radius: 13px;
            background:
                rgba(255,255,255,.022);
        }

        .mma-life-career-card-title {
            margin-bottom: 15px;
            color: #686870;
            font-size: 9px;
            font-weight: 850;
            letter-spacing: .13em;
        }

        .mma-life-career-card-content {
            width: 100%;
        }

        .progress-card {
            margin-top: 12px;
        }

        .mma-life-career-stage-line {
            display: grid;
            grid-template-columns:
                repeat(5, 1fr);
            gap: 4px;
        }

        .mma-life-career-stage {
            position: relative;
            text-align: center;
        }

        .mma-life-career-stage-dot {
            width: 10px;
            height: 10px;
            margin: 0 auto 7px;
            border-radius: 50%;
            background:
                rgba(255,255,255,.09);
            border:
                2px solid
                rgba(255,255,255,.12);
        }

        .mma-life-career-stage.active
        .mma-life-career-stage-dot {
            background: #ffffff;
            border-color: #ffffff;
        }

        .mma-life-career-stage span {
            color: #5f5f67;
            font-size: 8px;
            font-weight: 700;
        }

        .mma-life-career-stage.active span {
            color: #c4c4ca;
        }

        .mma-life-career-progress-track {
            height: 5px;
            margin-top: 13px;
            overflow: hidden;
            border-radius: 99px;
            background:
                rgba(255,255,255,.07);
        }

        .mma-life-career-progress-fill {
            height: 100%;
            border-radius: inherit;
            background: #ffffff;
        }

        .mma-life-career-progress-info {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-top: 9px;
            color: #66666f;
            font-size: 9px;
        }

        .mma-life-career-progress-info strong {
            color: #bcbcc3;
        }

        .mma-life-career-grid {
            display: grid;
            grid-template-columns:
                minmax(0, 1fr)
                minmax(0, 1fr);
            gap: 12px;
            margin-top: 12px;
        }

        .mma-life-career-column {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .mma-life-record-main {
            display: grid;
            grid-template-columns:
                repeat(4, 1fr);
            gap: 8px;
        }

        .mma-life-record-main > div {
            padding: 11px 6px;
            text-align: center;
            border-radius: 8px;
            background:
                rgba(255,255,255,.035);
        }

        .mma-life-record-main strong {
            display: block;
            color: #ffffff;
            font-size: 19px;
        }

        .mma-life-record-main span {
            display: block;
            margin-top: 3px;
            color: #64646c;
            font-size: 8px;
            text-transform: uppercase;
        }

        .mma-life-record-footer {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin-top: 14px;
            padding-top: 12px;
            border-top:
                1px solid
                rgba(255,255,255,.055);
            color: #686870;
            font-size: 9px;
        }

        .mma-life-record-footer strong {
            color: #c1c1c8;
        }

        .mma-life-amateur-record {
            margin-top: 10px;
            color: #62626a;
            font-size: 9px;
        }

        .mma-life-amateur-record strong {
            color: #9999a1;
        }

        .mma-life-ranking-main {
            display: grid;
            grid-template-columns:
                1fr 1fr;
            gap: 10px;
        }

        .mma-life-ranking-main > div {
            padding: 15px;
            border-radius: 9px;
            background:
                rgba(255,255,255,.035);
        }

        .mma-life-ranking-main span,
        .mma-life-contract-header span,
        .mma-life-contract-values span,
        .mma-life-development-values span,
        .mma-life-division-box span {
            display: block;
            color: #62626a;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: .07em;
        }

        .mma-life-ranking-main strong {
            display: block;
            margin-top: 4px;
            color: #ffffff;
            font-size: 23px;
        }

        .mma-life-titles-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .mma-life-title-item {
            display: flex;
            align-items: center;
            gap: 11px;
            padding: 10px;
            border-radius: 8px;
            background:
                rgba(255,255,255,.035);
        }

        .mma-life-title-icon {
            width: 34px;
            height: 34px;
            display: grid;
            place-items: center;
            flex-shrink: 0;
            border-radius: 8px;
            background:
                rgba(255,255,255,.06);
            font-size: 15px;
        }

        .mma-life-title-info {
            min-width: 0;
            flex: 1;
        }

        .mma-life-title-info strong {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #ffffff;
            font-size: 10px;
        }

        .mma-life-title-info span {
            display: block;
            margin-top: 3px;
            color: #65656d;
            font-size: 8px;
        }

        .mma-life-title-defenses {
            text-align: right;
        }

        .mma-life-title-defenses strong {
            display: block;
            color: #ffffff;
            font-size: 13px;
        }

        .mma-life-title-defenses span {
            color: #62626a;
            font-size: 7px;
        }

        .mma-life-title-summary {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-top: 11px;
            padding-top: 11px;
            border-top:
                1px solid
                rgba(255,255,255,.055);
            color: #62626a;
            font-size: 9px;
        }

        .mma-life-title-summary strong {
            color: #c0c0c7;
        }

        .mma-life-contract-header {
            display: grid;
            grid-template-columns:
                1fr auto;
            gap: 15px;
        }

        .mma-life-contract-header strong {
            display: block;
            margin-top: 5px;
            color: #ffffff;
            font-size: 14px;
        }

        .mma-life-contract-values {
            display: grid;
            grid-template-columns:
                1fr 1fr;
            gap: 10px;
            margin-top: 16px;
            padding-top: 13px;
            border-top:
                1px solid
                rgba(255,255,255,.055);
        }

        .mma-life-contract-values strong {
            display: block;
            margin-top: 4px;
            color: #ffffff;
            font-size: 12px;
        }

        .mma-life-development-values {
            display: grid;
            grid-template-columns:
                repeat(3, 1fr);
            gap: 8px;
        }

        .mma-life-development-values > div {
            padding: 11px;
            border-radius: 8px;
            background:
                rgba(255,255,255,.035);
        }

        .mma-life-development-values strong {
            display: block;
            margin-top: 4px;
            color: #ffffff;
            font-size: 17px;
        }

        .mma-life-development-track {
            height: 5px;
            margin-top: 15px;
            overflow: hidden;
            border-radius: 99px;
            background:
                rgba(255,255,255,.07);
        }

        .mma-life-development-track > div {
            height: 100%;
            border-radius: inherit;
            background: #ffffff;
        }

        .mma-life-division-box {
            padding: 15px;
            border-radius: 9px;
            background:
                rgba(255,255,255,.035);
        }

        .mma-life-division-box strong {
            display: block;
            margin-top: 5px;
            color: #ffffff;
            font-size: 16px;
        }

        .mma-life-career-empty {
            min-height: 95px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .mma-life-career-empty strong {
            color: #c3c3ca;
            font-size: 11px;
        }

        .mma-life-career-empty span {
            margin-top: 5px;
            color: #62626a;
            font-size: 9px;
        }

        @media (max-width: 850px) {

            .mma-life-career-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 600px) {

            .mma-life-career-header {
                align-items: flex-start;
            }

            .mma-life-career-header-ovr {
                width: 60px;
                height: 60px;
            }

            .mma-life-career-header-ovr strong {
                font-size: 22px;
            }

            .mma-life-career-stage span {
                font-size: 7px;
            }

            .mma-life-record-main {
                grid-template-columns:
                    repeat(2, 1fr);
            }

            .mma-life-development-values {
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

function initializeCareerScreen(
    database = null,
    options = {}
) {
    if (database) {
        setDatabase(database);
    }

    injectStyles();
    createContainer();

    careerScreenState.initialized =
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
        !careerScreenState.initialized
    ) {
        initializeCareerScreen(
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
        renderCareerScreen(
            getDatabase()
        );

    container.innerHTML =
        html;

    careerScreenState.lastRender =
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
            CAREER_SCREEN_VERSION,

        initialized:
            careerScreenState.initialized,

        lastRender:
            careerScreenState.lastRender
    };
}

function snapshot() {
    return {
        version:
            CAREER_SCREEN_VERSION,

        state:
            clone(
                careerScreenState
            )
    };
}

function validate() {
    const errors = [];

    if (
        !careerScreenState.initialized
    ) {
        errors.push(
            "Tela de carreira não inicializada."
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

export const careerScreenAPI = {

    version:
        CAREER_SCREEN_VERSION,

    initialize:
        initializeCareerScreen,

    init:
        initializeCareerScreen,

    render,
    refresh,

    renderCareerScreen,

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
    window.careerScreenAPI =
        careerScreenAPI;

    window.MMA_LIFE_CAREER_SCREEN =
        careerScreenAPI;
}

// ============================================================
// READY EVENT
// ============================================================

if (
    typeof window !== "undefined"
) {
    window.dispatchEvent(
        new CustomEvent(
            "mma-life-career-screen-ready",
            {
                detail: {
                    api:
                        careerScreenAPI,

                    version:
                        CAREER_SCREEN_VERSION
                }
            }
        )
    );
}

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default careerScreenAPI;
