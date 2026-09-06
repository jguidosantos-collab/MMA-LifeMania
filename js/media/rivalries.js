/* ============================================================
   MMA LIFE DYNASTY
   MEDIA — RIVALRIES ENGINE
   ------------------------------------------------------------
   Sistema completo de rivalidades entre lutadores.

   Responsabilidades:
   - Criar rivalidades
   - Aumentar/diminuir intensidade
   - Provocações
   - Trash talk
   - Confrontos
   - Rivalidades por título
   - Rivalidades pessoais
   - Rivalidades esportivas
   - Revanche
   - Impacto na mídia
   - Impacto nas redes sociais
   - Interesse dos fãs
   - Valor comercial
   - Rivalidades históricas
   - Encerramento
   - Histórico
   - Estatísticas

   Este módulo não depende de outros arquivos para funcionar.
============================================================ */

const RIVALRIES_VERSION = 1;

/* ============================================================
   CONFIGURAÇÃO
============================================================ */

const RIVALRIES_CONFIG = {
    maxActive: 200,
    maxHistory: 1000,

    intensity: {
        min: 0,
        max: 100,

        starting: 15,

        escalation: {
            insult: 8,
            trashTalk: 10,
            confrontation: 12,
            socialMedia: 8,
            closeFight: 15,
            controversialFight: 18,
            titleDispute: 12,
            revenge: 20,
            rematch: 15,
            publicCallout: 10
        },

        reduction: {
            inactivity: 4,
            apology: 12,
            reconciliation: 20,
            time: 3
        }
    },

    interest: {
        base: 10,
        intensityMultiplier: 0.8,
        fameMultiplier: 0.25,
        popularityMultiplier: 0.2,
        followersMultiplier: 0.001,
        titleBonus: 20,
        mainEventBonus: 15
    },

    commercial: {
        base: 1,
        intensityMultiplier: 0.015,
        interestMultiplier: 0.01,
        fameMultiplier: 0.005
    },

    heatLevels: {
        cold: {
            min: 0,
            max: 19,
            label: "Fria"
        },

        developing: {
            min: 20,
            max: 39,
            label: "Em desenvolvimento"
        },

        heated: {
            min: 40,
            max: 59,
            label: "Aquecida"
        },

        intense: {
            min: 60,
            max: 79,
            label: "Intensa"
        },

        explosive: {
            min: 80,
            max: 94,
            label: "Explosiva"
        },

        legendary: {
            min: 95,
            max: 100,
            label: "Lendária"
        }
    },

    types: {
        SPORTING: "sporting",
        PERSONAL: "personal",
        TITLE: "title",
        GYM: "gym",
        NATIONAL: "national",
        SOCIAL: "social",
        BUSINESS: "business",
        HISTORICAL: "historical"
    }
};

/* ============================================================
   TIPOS DE EVENTOS
============================================================ */

const RIVALRY_EVENTS = {
    INSULT: "insult",
    TRASH_TALK: "trash_talk",
    PUBLIC_CALLOUT: "public_callout",
    SOCIAL_MEDIA: "social_media",
    INTERVIEW: "interview",
    CONFRONTATION: "confrontation",
    CLOSE_FIGHT: "close_fight",
    CONTROVERSIAL_FIGHT: "controversial_fight",
    TITLE_DISPUTE: "title_dispute",
    REVENGE: "revenge",
    REMATCH: "rematch",
    WIN: "win",
    LOSS: "loss",
    APOLOGY: "apology",
    RECONCILIATION: "reconciliation",
    INACTIVITY: "inactivity",
    RETIREMENT: "retirement",
    COMEBACK: "comeback"
};

/* ============================================================
   UTILITÁRIOS
============================================================ */

function clamp(value, min, max) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return min;
    }

    return Math.min(max, Math.max(min, number));
}

function randomInt(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function randomItem(array) {
    if (!Array.isArray(array) || !array.length) {
        return null;
    }

    return array[
        randomInt(0, array.length - 1)
    ];
}

function safeString(value, fallback = "") {
    if (
        value === null ||
        value === undefined
    ) {
        return fallback;
    }

    return String(value);
}

function createId(prefix = "rivalry") {
    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 9)}`;
}

function nowISO() {
    return new Date().toISOString();
}

/* ============================================================
   NOMES
============================================================ */

function getEntityName(entity, fallback = "Lutador") {
    if (!entity) {
        return fallback;
    }

    if (typeof entity === "string") {
        return entity;
    }

    return (
        entity.name ||
        entity.fullName ||
        entity.displayName ||
        entity.nickname ||
        fallback
    );
}

function getFighterId(fighter) {
    if (!fighter) {
        return null;
    }

    if (typeof fighter === "string") {
        return fighter;
    }

    return (
        fighter.id ||
        fighter.fighterId ||
        null
    );
}

function getFighterName(fighter) {
    return getEntityName(
        fighter,
        "Lutador"
    );
}

/* ============================================================
   ESTADO
============================================================ */

function createRivalriesState() {
    return {
        version: RIVALRIES_VERSION,

        active: [],

        history: [],

        events: [],

        statistics: {
            totalCreated: 0,
            totalEnded: 0,
            totalEvents: 0,

            playerRivalries: 0,
            legendaryRivalries: 0,

            byType: {},
            byHeatLevel: {},

            mostIntense: null,
            mostPopular: null,
            longestRivalry: null,

            lastCreatedAt: null,
            lastEventAt: null
        }
    };
}

function ensureRivalries(database) {
    if (!database) {
        return createRivalriesState();
    }

    if (!database.media) {
        database.media = {};
    }

    if (!database.media.rivalries) {
        database.media.rivalries =
            createRivalriesState();
    }

    const state =
        database.media.rivalries;

    if (!Array.isArray(state.active)) {
        state.active = [];
    }

    if (!Array.isArray(state.history)) {
        state.history = [];
    }

    if (!Array.isArray(state.events)) {
        state.events = [];
    }

    if (!state.statistics) {
        state.statistics =
            createRivalriesState().statistics;
    }

    return state;
}

/* ============================================================
   HEAT LEVEL
============================================================ */

function getHeatLevel(intensity) {
    const score =
        clamp(
            intensity,
            0,
            100
        );

    const levels =
        RIVALRIES_CONFIG.heatLevels;

    for (const key of Object.keys(levels)) {
        const level = levels[key];

        if (
            score >= level.min &&
            score <= level.max
        ) {
            return key;
        }
    }

    return "cold";
}

function getHeatLevelLabel(intensityOrLevel) {
    let level =
        intensityOrLevel;

    if (
        typeof intensityOrLevel ===
        "number"
    ) {
        level =
            getHeatLevel(
                intensityOrLevel
            );
    }

    return (
        RIVALRIES_CONFIG
            .heatLevels[level]
            ?.label ||
        "Fria"
    );
}

/* ============================================================
   TIPO DE RIVALIDADE
============================================================ */

function normalizeRivalryType(type) {
    const valid =
        Object.values(
            RIVALRIES_CONFIG.types
        );

    if (valid.includes(type)) {
        return type;
    }

    return RIVALRIES_CONFIG.types.SPORTING;
}

/* ============================================================
   ENCONTRAR RIVALIDADE
============================================================ */

function findRivalryById(
    database,
    rivalryId
) {
    const state =
        ensureRivalries(database);

    return state.active.find(
        rivalry =>
            rivalry.id === rivalryId
    ) || null;
}

function findRivalryBetween(
    database,
    fighterA,
    fighterB
) {
    const state =
        ensureRivalries(database);

    const idA =
        getFighterId(fighterA);

    const idB =
        getFighterId(fighterB);

    const nameA =
        getFighterName(fighterA);

    const nameB =
        getFighterName(fighterB);

    return (
        state.active.find(
            rivalry => {
                const sameIds =
                    idA &&
                    idB &&
                    (
                        (
                            rivalry.fighterA.id === idA &&
                            rivalry.fighterB.id === idB
                        ) ||
                        (
                            rivalry.fighterA.id === idB &&
                            rivalry.fighterB.id === idA
                        )
                    );

                const sameNames =
                    (
                        rivalry.fighterA.name === nameA &&
                        rivalry.fighterB.name === nameB
                    ) ||
                    (
                        rivalry.fighterA.name === nameB &&
                        rivalry.fighterB.name === nameA
                    );

                return sameIds || sameNames;
            }
        ) || null
    );
}

/* ============================================================
   PLAYER
============================================================ */

function getPlayer(database) {
    return database?.player || null;
}

function isPlayer(
    database,
    fighter
) {
    const player =
        getPlayer(database);

    if (!player || !fighter) {
        return false;
    }

    const playerId =
        player.id ||
        player.playerId;

    const fighterId =
        getFighterId(fighter);

    if (
        playerId &&
        fighterId
    ) {
        return playerId === fighterId;
    }

    return fighter === player;
}

function rivalryInvolvesPlayer(
    database,
    rivalry
) {
    return Boolean(
        rivalry &&
        (
            isPlayer(
                database,
                rivalry.fighterA
            ) ||
            isPlayer(
                database,
                rivalry.fighterB
            )
        )
    );
}

/* ============================================================
   CRIAÇÃO
============================================================ */

function createRivalry(
    database,
    options = {}
) {
    const state =
        ensureRivalries(database);

    const fighterA =
        options.fighterA ||
        options.fighter ||
        null;

    const fighterB =
        options.fighterB ||
        options.opponent ||
        null;

    if (!fighterA || !fighterB) {
        return null;
    }

    if (
        getFighterId(fighterA) &&
        getFighterId(fighterB) &&
        getFighterId(fighterA) ===
        getFighterId(fighterB)
    ) {
        return null;
    }

    const existing =
        findRivalryBetween(
            database,
            fighterA,
            fighterB
        );

    if (existing) {
        return existing;
    }

    const type =
        normalizeRivalryType(
            options.type
        );

    const startingIntensity =
        clamp(
            options.intensity ??
            RIVALRIES_CONFIG
                .intensity
                .starting,
            0,
            100
        );

    const rivalry = {
        id:
            options.id ||
            createId(),

        version:
            RIVALRIES_VERSION,

        createdAt:
            options.createdAt ||
            nowISO(),

        updatedAt:
            nowISO(),

        endedAt: null,

        active: true,

        type,

        status: "active",

        fighterA: {
            id:
                getFighterId(
                    fighterA
                ),

            name:
                getFighterName(
                    fighterA
                )
        },

        fighterB: {
            id:
                getFighterId(
                    fighterB
                ),

            name:
                getFighterName(
                    fighterB
                )
        },

        intensity:
            startingIntensity,

        heatLevel:
            getHeatLevel(
                startingIntensity
            ),

        heatLabel:
            getHeatLevelLabel(
                startingIntensity
            ),

        interest:
            0,

        commercialMultiplier:
            1,

        publicAttention:
            0,

        mediaAttention:
            0,

        socialAttention:
            0,

        titleRelated:
            Boolean(
                options.titleRelated
            ),

        titleId:
            options.titleId ||
            null,

        division:
            options.division ||
            null,

        promotionId:
            options.promotionId ||
            null,

        promotionName:
            options.promotionName ||
            null,

        fightCount: 0,

        previousFights: [],

        rematches: 0,

        callouts: 0,

        confrontations: 0,

        trashTalkCount: 0,

        socialEvents: 0,

        mediaEvents: 0,

        winsA: 0,
        winsB: 0,

        draws: 0,

        lastFightAt: null,
        lastEventAt:
            nowISO(),

        durationWeeks: 0,

        historical: false,

        legendary: false,

        notes:
            Array.isArray(
                options.notes
            )
                ? [...options.notes]
                : [],

        tags:
            Array.isArray(
                options.tags
            )
                ? [...options.tags]
                : []
    };

    recalculateRivalry(
        database,
        rivalry
    );

    state.active.unshift(
        rivalry
    );

    state.statistics.totalCreated += 1;

    state.statistics.lastCreatedAt =
        rivalry.createdAt;

    state.statistics.byType[type] =
        (
            state.statistics.byType[type] ||
            0
        ) + 1;

    if (
        rivalryInvolvesPlayer(
            database,
            rivalry
        )
    ) {
        state.statistics.playerRivalries += 1;
    }

    updateRivalryStatistics(
        database
    );

    trimRivalries(
        database
    );

    return rivalry;
}

/* ============================================================
   CÁLCULO DE INTERESSE
============================================================ */

function readMediaMetric(
    database,
    fighter,
    metric
) {
    const id =
        getFighterId(fighter);

    const player =
        getPlayer(database);

    const isPlayerFighter =
        isPlayer(
            database,
            fighter
        );

    if (
        isPlayerFighter &&
        player
    ) {
        const paths = {
            fame: [
                ["media", "fame"],
                ["media", "fame", "score"]
            ],

            popularity: [
                ["media", "popularity"],
                ["media", "popularity", "score"]
            ],

            followers: [
                ["media", "followers"],
                ["media", "followers", "totalFollowers"]
            ]
        };

        const pathList =
            paths[metric] || [];

        for (
            const path of pathList
        ) {
            let current =
                database;

            for (
                const key of path
            ) {
                if (
                    current === null ||
                    current === undefined
                ) {
                    current =
                        undefined;
                    break;
                }

                current =
                    current[key];
            }

            if (
                Number.isFinite(
                    Number(current)
                )
            ) {
                return Number(current);
            }
        }
    }

    if (
        fighter &&
        Number.isFinite(
            Number(
                fighter[metric]
            )
        )
    ) {
        return Number(
            fighter[metric]
        );
    }

    if (
        fighter?.media &&
        Number.isFinite(
            Number(
                fighter.media[metric]
            )
        )
    ) {
        return Number(
            fighter.media[metric]
        );
    }

    if (
        id &&
        database?.world?.fighters?.[id]
    ) {
        const worldFighter =
            database.world.fighters[id];

        if (
            Number.isFinite(
                Number(
                    worldFighter[metric]
                )
            )
        ) {
            return Number(
                worldFighter[metric]
            );
        }
    }

    return 0;
}

function calculateRivalryInterest(
    database,
    rivalry
) {
    if (!rivalry) {
        return 0;
    }

    const fameA =
        readMediaMetric(
            database,
            rivalry.fighterA,
            "fame"
        );

    const fameB =
        readMediaMetric(
            database,
            rivalry.fighterB,
            "fame"
        );

    const popularityA =
        readMediaMetric(
            database,
            rivalry.fighterA,
            "popularity"
        );

    const popularityB =
        readMediaMetric(
            database,
            rivalry.fighterB,
            "popularity"
        );

    const followersA =
        readMediaMetric(
            database,
            rivalry.fighterA,
            "followers"
        );

    const followersB =
        readMediaMetric(
            database,
            rivalry.fighterB,
            "followers"
        );

    let interest =
        RIVALRIES_CONFIG.interest.base;

    interest +=
        rivalry.intensity *
        RIVALRIES_CONFIG
            .interest
            .intensityMultiplier;

    interest +=
        (
            fameA +
            fameB
        ) *
        RIVALRIES_CONFIG
            .interest
            .fameMultiplier;

    interest +=
        (
            popularityA +
            popularityB
        ) *
        RIVALRIES_CONFIG
            .interest
            .popularityMultiplier;

    interest +=
        (
            followersA +
            followersB
        ) *
        RIVALRIES_CONFIG
            .interest
            .followersMultiplier;

    if (
        rivalry.titleRelated
    ) {
        interest +=
            RIVALRIES_CONFIG
                .interest
                .titleBonus;
    }

    return clamp(
        Math.round(
            interest
        ),
        0,
        100
    );
}

/* ============================================================
   VALOR COMERCIAL
============================================================ */

function calculateCommercialMultiplier(
    rivalry
) {
    if (!rivalry) {
        return 1;
    }

    const multiplier =
        RIVALRIES_CONFIG
            .commercial
            .base +

        rivalry.intensity *
        RIVALRIES_CONFIG
            .commercial
            .intensityMultiplier +

        rivalry.interest *
        RIVALRIES_CONFIG
            .commercial
            .interestMultiplier;

    return Math.max(
        1,
        Number(
            multiplier.toFixed(2)
        )
    );
}

/* ============================================================
   RECÁLCULO
============================================================ */

function recalculateRivalry(
    database,
    rivalry
) {
    if (!rivalry) {
        return null;
    }

    rivalry.intensity =
        clamp(
            rivalry.intensity,
            0,
            100
        );

    rivalry.heatLevel =
        getHeatLevel(
            rivalry.intensity
        );

    rivalry.heatLabel =
        getHeatLevelLabel(
            rivalry.intensity
        );

    rivalry.interest =
        calculateRivalryInterest(
            database,
            rivalry
        );

    rivalry.commercialMultiplier =
        calculateCommercialMultiplier(
            rivalry
        );

    rivalry.publicAttention =
        clamp(
            Math.round(
                (
                    rivalry.intensity +
                    rivalry.interest
                ) / 2
            ),
            0,
            100
        );

    rivalry.mediaAttention =
        clamp(
            Math.round(
                (
                    rivalry.intensity *
                    0.7
                ) +
                (
                    rivalry.interest *
                    0.3
                )
            ),
            0,
            100
        );

    rivalry.socialAttention =
        clamp(
            Math.round(
                (
                    rivalry.intensity *
                    0.5
                ) +
                (
                    rivalry.interest *
                    0.5
                )
            ),
            0,
            100
        );

    rivalry.historical =
        rivalry.fightCount >= 3 ||
        rivalry.durationWeeks >= 52;

    rivalry.legendary =
        rivalry.intensity >= 95 ||
        (
            rivalry.fightCount >= 4 &&
            rivalry.interest >= 80
        );

    rivalry.updatedAt =
        nowISO();

    return rivalry;
}

/* ============================================================
   INTENSIDADE
============================================================ */

function changeRivalryIntensity(
    database,
    rivalryOrId,
    amount,
    reason = "event"
) {
    const rivalry =
        typeof rivalryOrId ===
        "string"
            ? findRivalryById(
                database,
                rivalryOrId
            )
            : rivalryOrId;

    if (!rivalry) {
        return null;
    }

    const previous =
        rivalry.intensity;

    rivalry.intensity =
        clamp(
            previous +
            Number(amount || 0),
            0,
            100
        );

    rivalry.notes.push({
        date: nowISO(),
        reason,
        previous,
        current:
            rivalry.intensity
    });

    recalculateRivalry(
        database,
        rivalry
    );

    return {
        rivalry,
        previous,
        current:
            rivalry.intensity,
        change:
            rivalry.intensity -
            previous
    };
}

/* ============================================================
   EVENTO DA RIVALIDADE
============================================================ */

function addRivalryEvent(
    database,
    rivalryOrId,
    options = {}
) {
    const state =
        ensureRivalries(database);

    const rivalry =
        typeof rivalryOrId ===
        "string"
            ? findRivalryById(
                database,
                rivalryOrId
            )
            : rivalryOrId;

    if (!rivalry) {
        return null;
    }

    const eventType =
        options.type ||
        RIVALRY_EVENTS.INSULT;

    const escalation =
        RIVALRIES_CONFIG
            .intensity
            .escalation;

    const reduction =
        RIVALRIES_CONFIG
            .intensity
            .reduction;

    const amounts = {
        [RIVALRY_EVENTS.INSULT]:
            escalation.insult,

        [RIVALRY_EVENTS.TRASH_TALK]:
            escalation.trashTalk,

        [RIVALRY_EVENTS.PUBLIC_CALLOUT]:
            escalation.publicCallout,

        [RIVALRY_EVENTS.SOCIAL_MEDIA]:
            escalation.socialMedia,

        [RIVALRY_EVENTS.INTERVIEW]:
            escalation.trashTalk,

        [RIVALRY_EVENTS.CONFRONTATION]:
            escalation.confrontation,

        [RIVALRY_EVENTS.CLOSE_FIGHT]:
            escalation.closeFight,

        [RIVALRY_EVENTS.CONTROVERSIAL_FIGHT]:
            escalation.controversialFight,

        [RIVALRY_EVENTS.TITLE_DISPUTE]:
            escalation.titleDispute,

        [RIVALRY_EVENTS.REVENGE]:
            escalation.revenge,

        [RIVALRY_EVENTS.REMATCH]:
            escalation.rematch,

        [RIVALRY_EVENTS.WIN]:
            3,

        [RIVALRY_EVENTS.LOSS]:
            3,

        [RIVALRY_EVENTS.APOLOGY]:
            -reduction.apology,

        [RIVALRY_EVENTS.RECONCILIATION]:
            -reduction.reconciliation,

        [RIVALRY_EVENTS.INACTIVITY]:
            -reduction.inactivity,

        [RIVALRY_EVENTS.RETIREMENT]:
            -10,

        [RIVALRY_EVENTS.COMEBACK]:
            escalation.comeback || 10
    };

    const amount =
        Number.isFinite(
            Number(options.amount)
        )
            ? Number(options.amount)
            : (
                amounts[eventType] ??
                0
            );

    const event = {
        id:
            options.id ||
            createId("rivalry_event"),

        rivalryId:
            rivalry.id,

        timestamp:
            options.timestamp ||
            nowISO(),

        type:
            eventType,

        amount,

        fighterId:
            options.fighterId ||
            null,

        fighterName:
            options.fighterName ||
            null,

        description:
            options.description ||
            getDefaultEventDescription(
                rivalry,
                eventType
            ),

        mediaImpact:
            options.mediaImpact ??
            0,

        socialImpact:
            options.socialImpact ??
            0,

        fanImpact:
            options.fanImpact ??
            0,

        fightId:
            options.fightId ||
            null,

        eventId:
            options.eventId ||
            null,

        notes:
            options.notes ||
            ""
    };

    state.events.unshift(
        event
    );

    state.statistics.totalEvents += 1;

    state.statistics.lastEventAt =
        event.timestamp;

    rivalry.lastEventAt =
        event.timestamp;

    if (
        eventType ===
        RIVALRY_EVENTS.PUBLIC_CALLOUT
    ) {
        rivalry.callouts += 1;
    }

    if (
        eventType ===
        RIVALRY_EVENTS.CONFRONTATION
    ) {
        rivalry.confrontations += 1;
    }

    if (
        eventType ===
        RIVALRY_EVENTS.TRASH_TALK ||
        eventType ===
        RIVALRY_EVENTS.INSULT ||
        eventType ===
        RIVALRY_EVENTS.INTERVIEW
    ) {
        rivalry.trashTalkCount += 1;
    }

    if (
        eventType ===
        RIVALRY_EVENTS.SOCIAL_MEDIA
    ) {
        rivalry.socialEvents += 1;
    }

    if (
        eventType ===
        RIVALRY_EVENTS.INTERVIEW
    ) {
        rivalry.mediaEvents += 1;
    }

    if (
        eventType ===
        RIVALRY_EVENTS.APOLOGY ||
        eventType ===
        RIVALRY_EVENTS.RECONCILIATION
    ) {
        if (
            rivalry.intensity <= 5
        ) {
            endRivalry(
                database,
                rivalry,
                "reconciliation"
            );
        }
    }

    changeRivalryIntensity(
        database,
        rivalry,
        amount,
        eventType
    );

    recalculateRivalry(
        database,
        rivalry
    );

    trimRivalries(
        database
    );

    return event;
}

/* ============================================================
   DESCRIÇÕES
============================================================ */

function getDefaultEventDescription(
    rivalry,
    type
) {
    const a =
        rivalry.fighterA.name;

    const b =
        rivalry.fighterB.name;

    const descriptions = {
        [RIVALRY_EVENTS.INSULT]:
            `${a} e ${b} trocam insultos publicamente.`,

        [RIVALRY_EVENTS.TRASH_TALK]:
            `${a} e ${b} aumentam o trash talk antes de um possível confronto.`,

        [RIVALRY_EVENTS.PUBLIC_CALLOUT]:
            `${a} desafia ${b} publicamente.`,

        [RIVALRY_EVENTS.SOCIAL_MEDIA]:
            `${a} e ${b} trocam provocações nas redes sociais.`,

        [RIVALRY_EVENTS.INTERVIEW]:
            `Declarações em entrevista aumentam a tensão entre ${a} e ${b}.`,

        [RIVALRY_EVENTS.CONFRONTATION]:
            `${a} e ${b} protagonizam um confronto diante das câmeras.`,

        [RIVALRY_EVENTS.CLOSE_FIGHT]:
            `Uma luta equilibrada entre ${a} e ${b} aumenta a rivalidade.`,

        [RIVALRY_EVENTS.CONTROVERSIAL_FIGHT]:
            `Uma luta controversa entre ${a} e ${b} aumenta a tensão.`,

        [RIVALRY_EVENTS.TITLE_DISPUTE]:
            `A disputa pelo cinturão coloca ${a} e ${b} em rota de colisão.`,

        [RIVALRY_EVENTS.REVENGE]:
            `${a} busca vingança contra ${b}.`,

        [RIVALRY_EVENTS.REMATCH]:
            `${a} e ${b} se preparam para uma revanche.`,

        [RIVALRY_EVENTS.WIN]:
            `${a} derrota ${b}.`,

        [RIVALRY_EVENTS.LOSS]:
            `${b} derrota ${a}.`,

        [RIVALRY_EVENTS.APOLOGY]:
            `${a} pede desculpas a ${b}.`,

        [RIVALRY_EVENTS.RECONCILIATION]:
            `${a} e ${b} fazem as pazes.`,

        [RIVALRY_EVENTS.INACTIVITY]:
            `A falta de novos confrontos reduz a tensão entre ${a} e ${b}.`,

        [RIVALRY_EVENTS.RETIREMENT]:
            `A aposentadoria de um dos lutadores muda o futuro da rivalidade.`,

        [RIVALRY_EVENTS.COMEBACK]:
            `O retorno de um dos lutadores reacende a rivalidade.`
    };

    return (
        descriptions[type] ||
        `Um novo acontecimento movimenta a rivalidade entre ${a} e ${b}.`
    );
}

/* ============================================================
   TRASH TALK
============================================================ */

function triggerTrashTalk(
    database,
    rivalryOrId,
    options = {}
) {
    return addRivalryEvent(
        database,
        rivalryOrId,
        {
            ...options,
            type:
                RIVALRY_EVENTS.TRASH_TALK
        }
    );
}

function triggerInsult(
    database,
    rivalryOrId,
    options = {}
) {
    return addRivalryEvent(
        database,
        rivalryOrId,
        {
            ...options,
            type:
                RIVALRY_EVENTS.INSULT
        }
    );
}

function triggerCallout(
    database,
    rivalryOrId,
    options = {}
) {
    return addRivalryEvent(
        database,
        rivalryOrId,
        {
            ...options,
            type:
                RIVALRY_EVENTS.PUBLIC_CALLOUT
        }
    );
}

/* ============================================================
   CONFRONTAÇÃO
============================================================ */

function triggerConfrontation(
    database,
    rivalryOrId,
    options = {}
) {
    return addRivalryEvent(
        database,
        rivalryOrId,
        {
            ...options,
            type:
                RIVALRY_EVENTS.CONFRONTATION
        }
    );
}

/* ============================================================
   REDES SOCIAIS
============================================================ */

function triggerSocialMediaRivalry(
    database,
    rivalryOrId,
    options = {}
) {
    return addRivalryEvent(
        database,
        rivalryOrId,
        {
            ...options,
            type:
                RIVALRY_EVENTS.SOCIAL_MEDIA
        }
    );
}

/* ============================================================
   ENTREVISTA
============================================================ */

function triggerInterviewRivalry(
    database,
    rivalryOrId,
    options = {}
) {
    return addRivalryEvent(
        database,
        rivalryOrId,
        {
            ...options,
            type:
                RIVALRY_EVENTS.INTERVIEW
        }
    );
}

/* ============================================================
   DISPUTA DE TÍTULO
============================================================ */

function triggerTitleDispute(
    database,
    rivalryOrId,
    options = {}
) {
    const rivalry =
        typeof rivalryOrId ===
        "string"
            ? findRivalryById(
                database,
                rivalryOrId
            )
            : rivalryOrId;

    if (!rivalry) {
        return null;
    }

    rivalry.titleRelated = true;

    if (options.titleId) {
        rivalry.titleId =
            options.titleId;
    }

    return addRivalryEvent(
        database,
        rivalry,
        {
            ...options,
            type:
                RIVALRY_EVENTS.TITLE_DISPUTE
        }
    );
}

/* ============================================================
   REVANCHE
============================================================ */

function triggerRevenge(
    database,
    rivalryOrId,
    options = {}
) {
    const rivalry =
        typeof rivalryOrId ===
        "string"
            ? findRivalryById(
                database,
                rivalryOrId
            )
            : rivalryOrId;

    if (!rivalry) {
        return null;
    }

    rivalry.rematches += 1;

    return addRivalryEvent(
        database,
        rivalry,
        {
            ...options,
            type:
                RIVALRY_EVENTS.REVENGE
        }
    );
}

function triggerRematch(
    database,
    rivalryOrId,
    options = {}
) {
    const rivalry =
        typeof rivalryOrId ===
        "string"
            ? findRivalryById(
                database,
                rivalryOrId
            )
            : rivalryOrId;

    if (!rivalry) {
        return null;
    }

    rivalry.rematches += 1;

    return addRivalryEvent(
        database,
        rivalry,
        {
            ...options,
            type:
                RIVALRY_EVENTS.REMATCH
        }
    );
}

/* ============================================================
   LUTA ENTRE RIVAIS
============================================================ */

function registerRivalryFight(
    database,
    rivalryOrId,
    options = {}
) {
    const rivalry =
        typeof rivalryOrId ===
        "string"
            ? findRivalryById(
                database,
                rivalryOrId
            )
            : rivalryOrId;

    if (!rivalry) {
        return null;
    }

    const fighterAId =
        getFighterId(
            rivalry.fighterA
        );

    const fighterBId =
        getFighterId(
            rivalry.fighterB
        );

    const winnerId =
        options.winnerId ||
        getFighterId(
            options.winner
        );

    rivalry.fightCount += 1;

    if (
        winnerId &&
        winnerId === fighterAId
    ) {
        rivalry.winsA += 1;
    } else if (
        winnerId &&
        winnerId === fighterBId
    ) {
        rivalry.winsB += 1;
    } else {
        rivalry.draws += 1;
    }

    const fightRecord = {
        fightId:
            options.fightId ||
            null,

        eventId:
            options.eventId ||
            null,

        date:
            options.date ||
            nowISO(),

        winnerId:
            winnerId ||
            null,

        method:
            options.method ||
            null,

        round:
            options.round ||
            null,

        controversial:
            Boolean(
                options.controversial
            ),

        close:
            Boolean(
                options.close
            )
    };

    rivalry.previousFights.push(
        fightRecord
    );

    rivalry.lastFightAt =
        fightRecord.date;

    rivalry.lastEventAt =
        fightRecord.date;

    if (
        options.controversial
    ) {
        addRivalryEvent(
            database,
            rivalry,
            {
                type:
                    RIVALRY_EVENTS
                        .CONTROVERSIAL_FIGHT,

                fightId:
                    options.fightId,

                eventId:
                    options.eventId,

                description:
                    `A luta entre ${rivalry.fighterA.name} e ${rivalry.fighterB.name} terminou cercada de controvérsia.`
            }
        );
    } else if (
        options.close
    ) {
        addRivalryEvent(
            database,
            rivalry,
            {
                type:
                    RIVALRY_EVENTS
                        .CLOSE_FIGHT,

                fightId:
                    options.fightId,

                eventId:
                    options.eventId
            }
        );
    } else {
        addRivalryEvent(
            database,
            rivalry,
            {
                type:
                    RIVALRY_EVENTS.WIN,

                fightId:
                    options.fightId,

                eventId:
                    options.eventId
            }
        );
    }

    if (
        rivalry.fightCount >= 2
    ) {
        rivalry.historical =
            true;
    }

    if (
        rivalry.fightCount >= 3
    ) {
        rivalry.legendary =
            true;
    }

    recalculateRivalry(
        database,
        rivalry
    );

    return rivalry;
}

/* ============================================================
   RESULTADO DA LUTA
============================================================ */

function processRivalryFight(
    database,
    options = {}
) {
    let rivalry =
        options.rivalry ||
        null;

    if (!rivalry) {
        rivalry =
            findRivalryBetween(
                database,
                options.fighterA ||
                options.fighter,
                options.fighterB ||
                options.opponent
            );
    }

    if (!rivalry) {
        rivalry =
            createRivalry(
                database,
                {
                    fighterA:
                        options.fighterA ||
                        options.fighter,

                    fighterB:
                        options.fighterB ||
                        options.opponent,

                    type:
                        options.type ||
                        RIVALRIES_CONFIG
                            .types
                            .SPORTING,

                    intensity:
                        options.intensity ||
                        35
                }
            );
    }

    if (!rivalry) {
        return null;
    }

    return registerRivalryFight(
        database,
        rivalry,
        options
    );
}

/* ============================================================
   ENCERRAMENTO
============================================================ */

function endRivalry(
    database,
    rivalryOrId,
    reason = "ended"
) {
    const state =
        ensureRivalries(database);

    const rivalry =
        typeof rivalryOrId ===
        "string"
            ? findRivalryById(
                database,
                rivalryOrId
            )
            : rivalryOrId;

    if (!rivalry) {
        return false;
    }

    rivalry.active = false;
    rivalry.status = "ended";
    rivalry.endedAt =
        nowISO();

    rivalry.endReason =
        reason;

    const index =
        state.active.findIndex(
            item =>
                item.id ===
                rivalry.id
        );

    if (index !== -1) {
        state.active.splice(
            index,
            1
        );
    }

    state.history.unshift(
        {
            ...rivalry
        }
    );

    state.statistics.totalEnded += 1;

    updateRivalryStatistics(
        database
    );

    trimRivalries(
        database
    );

    return true;
}

/* ============================================================
   RECONCILIAÇÃO
============================================================ */

function reconcileRivalry(
    database,
    rivalryOrId,
    options = {}
) {
    const rivalry =
        typeof rivalryOrId ===
        "string"
            ? findRivalryById(
                database,
                rivalryOrId
            )
            : rivalryOrId;

    if (!rivalry) {
        return null;
    }

    addRivalryEvent(
        database,
        rivalry,
        {
            ...options,
            type:
                RIVALRY_EVENTS.RECONCILIATION
        }
    );

    if (
        rivalry.intensity <= 20 ||
        options.end
    ) {
        endRivalry(
            database,
            rivalry,
            "reconciliation"
        );
    }

    return rivalry;
}

/* ============================================================
   DURAÇÃO
============================================================ */

function updateRivalryDuration(
    rivalry,
    weeks = 1
) {
    if (!rivalry) {
        return null;
    }

    rivalry.durationWeeks +=
        Math.max(
            0,
            Number(weeks) || 0
        );

    return rivalry.durationWeeks;
}

/* ============================================================
   PROCESSAMENTO SEMANAL
============================================================ */

function processWeeklyRivalries(
    database,
    weeks = 1
) {
    const state =
        ensureRivalries(database);

    const count =
        Math.max(
            1,
            Number(weeks) || 1
        );

    for (
        const rivalry of state.active
    ) {
        updateRivalryDuration(
            rivalry,
            count
        );

        if (
            rivalry.intensity > 0
        ) {
            changeRivalryIntensity(
                database,
                rivalry,
                -(
                    RIVALRIES_CONFIG
                        .intensity
                        .reduction
                        .time *
                    count
                ),
                "weekly_decay"
            );
        }

        if (
            rivalry.intensity <= 0
        ) {
            rivalry.intensity = 0;

            recalculateRivalry(
                database,
                rivalry
            );
        }
    }

    updateRivalryStatistics(
        database
    );

    return getActiveRivalries(
        database
    );
}

/* ============================================================
   CONSULTAS
============================================================ */

function getActiveRivalries(
    database,
    options = {}
) {
    const state =
        ensureRivalries(database);

    let result =
        [...state.active];

    if (options.type) {
        result =
            result.filter(
                rivalry =>
                    rivalry.type ===
                    options.type
            );
    }

    if (options.heatLevel) {
        result =
            result.filter(
                rivalry =>
                    rivalry.heatLevel ===
                    options.heatLevel
            );
    }

    if (
        options.minIntensity !==
        undefined
    ) {
        result =
            result.filter(
                rivalry =>
                    rivalry.intensity >=
                    Number(
                        options.minIntensity
                    )
            );
    }

    if (options.playerOnly) {
        result =
            result.filter(
                rivalry =>
                    rivalryInvolvesPlayer(
                        database,
                        rivalry
                    )
            );
    }

    result.sort(
        (a, b) =>
            b.intensity -
            a.intensity
    );

    const limit =
        Number.isFinite(
            Number(options.limit)
        )
            ? Number(options.limit)
            : 50;

    return result.slice(
        0,
        Math.max(1, limit)
    );
}

function getPlayerRivalries(
    database,
    limit = 20
) {
    return getActiveRivalries(
        database,
        {
            playerOnly: true,
            limit
        }
    );
}

function getHotRivalries(
    database,
    limit = 10
) {
    return getActiveRivalries(
        database,
        {
            minIntensity: 60,
            limit
        }
    );
}

function getLegendaryRivalries(
    database,
    limit = 20
) {
    const state =
        ensureRivalries(database);

    return [
        ...state.active,
        ...state.history
    ]
        .filter(
            rivalry =>
                rivalry.legendary ||
                rivalry.historical
        )
        .sort(
            (a, b) =>
                b.intensity -
                a.intensity
        )
        .slice(
            0,
            limit
        );
}

function getRivalryHistory(
    database,
    limit = 50
) {
    const state =
        ensureRivalries(database);

    return state.history
        .slice(
            0,
            Math.max(1, limit)
        );
}

function getRivalryEvents(
    database,
    rivalryId,
    limit = 50
) {
    const state =
        ensureRivalries(database);

    return state.events
        .filter(
            event =>
                event.rivalryId ===
                rivalryId
        )
        .slice(
            0,
            Math.max(1, limit)
        );
}

/* ============================================================
   PERFIL
============================================================ */

function getRivalryProfile(
    database,
    rivalryId
) {
    const state =
        ensureRivalries(database);

    const active =
        state.active.find(
            rivalry =>
                rivalry.id ===
                rivalryId
        );

    const archived =
        state.history.find(
            rivalry =>
                rivalry.id ===
                rivalryId
        );

    const rivalry =
        active ||
        archived;

    if (!rivalry) {
        return null;
    }

    return {
        ...rivalry,

        heatLevel:
            getHeatLevel(
                rivalry.intensity
            ),

        heatLabel:
            getHeatLevelLabel(
                rivalry.intensity
            ),

        active:
            Boolean(
                active
            ),

        events:
            getRivalryEvents(
                database,
                rivalryId
            )
    };
}

/* ============================================================
   ESTATÍSTICAS
============================================================ */

function updateRivalryStatistics(
    database
) {
    const state =
        ensureRivalries(database);

    const all = [
        ...state.active,
        ...state.history
    ];

    const mostIntense =
        [...all]
            .sort(
                (a, b) =>
                    b.intensity -
                    a.intensity
            )[0] ||
        null;

    const mostPopular =
        [...all]
            .sort(
                (a, b) =>
                    b.interest -
                    a.interest
            )[0] ||
        null;

    const longest =
        [...all]
            .sort(
                (a, b) =>
                    b.durationWeeks -
                    a.durationWeeks
            )[0] ||
        null;

    state.statistics.mostIntense =
        mostIntense?.id ||
        null;

    state.statistics.mostPopular =
        mostPopular?.id ||
        null;

    state.statistics.longestRivalry =
        longest?.id ||
        null;

    state.statistics.legendaryRivalries =
        all.filter(
            rivalry =>
                rivalry.legendary
        ).length;

    return state.statistics;
}

function getRivalryStatistics(
    database
) {
    const state =
        ensureRivalries(database);

    updateRivalryStatistics(
        database
    );

    return {
        ...state.statistics,

        activeCount:
            state.active.length,

        historyCount:
            state.history.length,

        eventCount:
            state.events.length
    };
}

/* ============================================================
   COMPARAÇÃO
============================================================ */

function compareRivalries(
    rivalryA,
    rivalryB
) {
    if (!rivalryA || !rivalryB) {
        return null;
    }

    return {
        intensityDifference:
            rivalryA.intensity -
            rivalryB.intensity,

        interestDifference:
            rivalryA.interest -
            rivalryB.interest,

        commercialDifference:
            rivalryA.commercialMultiplier -
            rivalryB.commercialMultiplier,

        moreIntense:
            rivalryA.intensity >=
            rivalryB.intensity
                ? rivalryA.id
                : rivalryB.id,

        morePopular:
            rivalryA.interest >=
            rivalryB.interest
                ? rivalryA.id
                : rivalryB.id
    };
}

/* ============================================================
   VERIFICAÇÕES
============================================================ */

function canCreateRivalry(
    database,
    fighterA,
    fighterB
) {
    if (!fighterA || !fighterB) {
        return {
            allowed: false,
            reason:
                "Dois lutadores são necessários."
        };
    }

    const idA =
        getFighterId(fighterA);

    const idB =
        getFighterId(fighterB);

    if (
        idA &&
        idB &&
        idA === idB
    ) {
        return {
            allowed: false,
            reason:
                "Um lutador não pode rivalizar consigo mesmo."
        };
    }

    const existing =
        findRivalryBetween(
            database,
            fighterA,
            fighterB
        );

    if (existing) {
        return {
            allowed: false,
            reason:
                "Já existe uma rivalidade ativa entre esses lutadores.",
            existing
        };
    }

    return {
        allowed: true,
        reason: null
    };
}

/* ============================================================
   BUSCA POR LUTADOR
============================================================ */

function getRivalriesForFighter(
    database,
    fighter,
    options = {}
) {
    const state =
        ensureRivalries(database);

    const fighterId =
        getFighterId(fighter);

    const fighterName =
        getFighterName(fighter);

    let result =
        state.active.filter(
            rivalry => {
                const matchId =
                    fighterId &&
                    (
                        rivalry.fighterA.id === fighterId ||
                        rivalry.fighterB.id === fighterId
                    );

                const matchName =
                    rivalry.fighterA.name === fighterName ||
                    rivalry.fighterB.name === fighterName;

                return (
                    matchId ||
                    matchName
                );
            }
        );

    if (options.includeHistory) {
        result = [
            ...result,
            ...state.history.filter(
                rivalry => {
                    const matchId =
                        fighterId &&
                        (
                            rivalry.fighterA.id === fighterId ||
                            rivalry.fighterB.id === fighterId
                        );

                    const matchName =
                        rivalry.fighterA.name === fighterName ||
                        rivalry.fighterB.name === fighterName;

                    return (
                        matchId ||
                        matchName
                    );
                }
            )
        ];
    }

    return result;
}

/* ============================================================
   IMPACTO DE MÍDIA
============================================================ */

function getMediaImpact(
    rivalry
) {
    if (!rivalry) {
        return {
            fame: 0,
            popularity: 0,
            followers: 0,
            reputation: 0,
            marketability: 0
        };
    }

    const intensity =
        rivalry.intensity;

    const interest =
        rivalry.interest;

    return {
        fame:
            Math.round(
                intensity *
                0.08
            ),

        popularity:
            Math.round(
                interest *
                0.1
            ),

        followers:
            Math.round(
                interest *
                0.5
            ),

        reputation:
            rivalry.type ===
            RIVALRIES_CONFIG
                .types
                .PERSONAL
                ? -Math.round(
                    intensity *
                    0.03
                )
                : Math.round(
                    intensity *
                    0.01
                ),

        marketability:
            Math.round(
                (
                    intensity +
                    interest
                ) *
                0.05
            )
    };
}

/* ============================================================
   GERAR RIVALIDADE AUTOMÁTICA
============================================================ */

function generateRandomRivalry(
    database,
    fighterA,
    fighterB,
    options = {}
) {
    const check =
        canCreateRivalry(
            database,
            fighterA,
            fighterB
        );

    if (!check.allowed) {
        return check.existing ||
            null;
    }

    const types =
        Object.values(
            RIVALRIES_CONFIG.types
        );

    const type =
        options.type ||
        randomItem(types);

    const intensity =
        options.intensity ??
        randomInt(
            10,
            40
        );

    return createRivalry(
        database,
        {
            fighterA,
            fighterB,
            type,
            intensity,
            titleRelated:
                Boolean(
                    options.titleRelated
                ),
            division:
                options.division ||
                null,
            promotionId:
                options.promotionId ||
                null,
            promotionName:
                options.promotionName ||
                null
        }
    );
}

/* ============================================================
   LIMPEZA
============================================================ */

function trimRivalries(
    database
) {
    const state =
        ensureRivalries(database);

    if (
        state.active.length >
        RIVALRIES_CONFIG.maxActive
    ) {
        state.active =
            state.active
                .sort(
                    (a, b) =>
                        b.intensity -
                        a.intensity
                )
                .slice(
                    0,
                    RIVALRIES_CONFIG.maxActive
                );
    }

    if (
        state.history.length >
        RIVALRIES_CONFIG.maxHistory
    ) {
        state.history =
            state.history.slice(
                0,
                RIVALRIES_CONFIG.maxHistory
            );
    }

    if (
        state.events.length >
        RIVALRIES_CONFIG.maxHistory
    ) {
        state.events =
            state.events.slice(
                0,
                RIVALRIES_CONFIG.maxHistory
            );
    }
}

/* ============================================================
   VALIDAÇÃO
============================================================ */

function validateRivalry(
    rivalry
) {
    const errors = [];

    if (!rivalry) {
        errors.push(
            "Rivalidade inexistente."
        );

        return {
            valid: false,
            errors
        };
    }

    if (!rivalry.id) {
        errors.push(
            "Rivalidade sem ID."
        );
    }

    if (
        !rivalry.fighterA ||
        !rivalry.fighterB
    ) {
        errors.push(
            "Rivalidade precisa de dois lutadores."
        );
    }

    if (
        rivalry.fighterA &&
        rivalry.fighterB &&
        rivalry.fighterA.id &&
        rivalry.fighterB.id &&
        rivalry.fighterA.id ===
        rivalry.fighterB.id
    ) {
        errors.push(
            "Os dois lados da rivalidade não podem ser o mesmo lutador."
        );
    }

    if (
        !Number.isFinite(
            Number(
                rivalry.intensity
            )
        )
    ) {
        errors.push(
            "Intensidade inválida."
        );
    }

    if (
        rivalry.intensity < 0 ||
        rivalry.intensity > 100
    ) {
        errors.push(
            "Intensidade deve estar entre 0 e 100."
        );
    }

    if (!rivalry.type) {
        errors.push(
            "Rivalidade sem tipo."
        );
    }

    return {
        valid:
            errors.length === 0,

        errors
    };
}

function validateRivalriesSystem(
    database
) {
    const state =
        ensureRivalries(database);

    const errors = [];

    if (
        !Array.isArray(
            state.active
        )
    ) {
        errors.push(
            "active não é um array."
        );
    }

    if (
        !Array.isArray(
            state.history
        )
    ) {
        errors.push(
            "history não é um array."
        );
    }

    for (
        const rivalry of state.active
    ) {
        const validation =
            validateRivalry(
                rivalry
            );

        if (!validation.valid) {
            errors.push(
                ...validation.errors.map(
                    error =>
                        `${rivalry?.id || "unknown"}: ${error}`
                )
            );
        }
    }

    return {
        valid:
            errors.length === 0,

        errors
    };
}

/* ============================================================
   RESUMO
============================================================ */

function getRivalriesSummary(
    database
) {
    const state =
        ensureRivalries(database);

    const active =
        getActiveRivalries(
            database,
            {
                limit: 5
            }
        );

    const player =
        getPlayerRivalries(
            database,
            5
        );

    const legendary =
        getLegendaryRivalries(
            database,
            5
        );

    return {
        version:
            RIVALRIES_VERSION,

        activeCount:
            state.active.length,

        historyCount:
            state.history.length,

        eventCount:
            state.events.length,

        playerRivalries:
            player.length,

        legendaryCount:
            legendary.length,

        hottest:
            active,

        player:

            player,

        legendary:
            legendary,

        statistics:
            getRivalryStatistics(
                database
            )
    };
}

/* ============================================================
   RESET
============================================================ */

function resetRivalries(
    database
) {
    if (!database) {
        return createRivalriesState();
    }

    if (!database.media) {
        database.media = {};
    }

    database.media.rivalries =
        createRivalriesState();

    return database.media.rivalries;
}

/* ============================================================
   EXPORTS
============================================================ */

export {
    RIVALRIES_VERSION,
    RIVALRIES_CONFIG,
    RIVALRY_EVENTS,

    createRivalriesState,
    ensureRivalries,

    getHeatLevel,
    getHeatLevelLabel,

    findRivalryById,
    findRivalryBetween,

    createRivalry,
    canCreateRivalry,

    calculateRivalryInterest,
    calculateCommercialMultiplier,
    recalculateRivalry,

    changeRivalryIntensity,
    addRivalryEvent,

    triggerTrashTalk,
    triggerInsult,
    triggerCallout,
    triggerConfrontation,
    triggerSocialMediaRivalry,
    triggerInterviewRivalry,
    triggerTitleDispute,

    triggerRevenge,
    triggerRematch,

    registerRivalryFight,
    processRivalryFight,

    reconcileRivalry,
    endRivalry,

    updateRivalryDuration,
    processWeeklyRivalries,

    getActiveRivalries,
    getPlayerRivalries,
    getHotRivalries,
    getLegendaryRivalries,
    getRivalriesForFighter,

    getRivalryHistory,
    getRivalryEvents,
    getRivalryProfile,

    getRivalryStatistics,
    compareRivalries,

    getMediaImpact,

    generateRandomRivalry,

    validateRivalry,
    validateRivalriesSystem,

    getRivalriesSummary,

    resetRivalries
};

export default {
    RIVALRIES_VERSION,
    RIVALRIES_CONFIG,
    RIVALRY_EVENTS,

    createRivalriesState,
    ensureRivalries,

    getHeatLevel,
    getHeatLevelLabel,

    findRivalryById,
    findRivalryBetween,

    createRivalry,
    canCreateRivalry,

    calculateRivalryInterest,
    calculateCommercialMultiplier,
    recalculateRivalry,

    changeRivalryIntensity,
    addRivalryEvent,

    triggerTrashTalk,
    triggerInsult,
    triggerCallout,
    triggerConfrontation,
    triggerSocialMediaRivalry,
    triggerInterviewRivalry,
    triggerTitleDispute,

    triggerRevenge,
    triggerRematch,

    registerRivalryFight,
    processRivalryFight,

    reconcileRivalry,
    endRivalry,

    updateRivalryDuration,
    processWeeklyRivalries,

    getActiveRivalries,
    getPlayerRivalries,
    getHotRivalries,
    getLegendaryRivalries,
    getRivalriesForFighter,

    getRivalryHistory,
    getRivalryEvents,
    getRivalryProfile,

    getRivalryStatistics,
    compareRivalries,

    getMediaImpact,

    generateRandomRivalry,

    validateRivalry,
    validateRivalriesSystem,

    getRivalriesSummary,

    resetRivalries
};
