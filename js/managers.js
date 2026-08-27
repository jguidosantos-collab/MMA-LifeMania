/* =========================================================
   MMA LIFE DYNASTY
   MANAGERS.JS
   SISTEMA COMPLETO DE EMPRESÁRIO
   VERSÃO — CONTRATOS + OFERTAS + NEGOCIAÇÃO
========================================================= */
/* =========================================================
   CONFIGURAÇÕES GERAIS
========================================================= */
const MANAGER_CONFIG = {
    minCampWeeks: 4,
    maxCampWeeks: 8,
    searchCooldownWeeks: 2,
    firstFightWeek: 4,
    offerChance: 0.75,
    maxOfferAge: 1,
    /* Contratos */
    regionalMinFights: 3,
    regionalMaxFights: 5,
    nationalMinFights: 3,
    nationalMaxFights: 5,
    worldFirstMinFights: 2,
    worldFirstMaxFights: 3,
    worldSecondMinFights: 2,
    worldSecondMaxFights: 4,
    eliteFirstFights: 3,
    eliteSecondMinFights: 3,
    eliteSecondMaxFights: 5,
    /* Bolsas */
    regionalPurse: 200,
    regionalWinBonus: 200,
    nationalPurse: 1000,
    nationalWinBonus: 1000,
    worldFirstPurse: 8000,
    worldFirstWinBonus: 8000,
    worldSecondPurse: 10000,
    worldSecondMaxPurse: 20000,
    worldThirdMinPurse: 80000,
    worldMaxPurse: 350000,
    eliteFirstPurse: 12000,
    eliteFirstWinBonus: 12000,
    eliteSecondPurse: 25000,
    eliteThirdMinPurse: 200000,
    eliteMaxPurse: 1000000,
    maxPPV: 10
};
/* =========================================================
   UTILIDADES
========================================================= */
function managerPlayer() {
    if (
        typeof window.player === "undefined" ||
        !window.player
    ) {
        if (
            typeof window.createDefaultPlayer ===
            "function"
        ) {
            window.player =
                window.createDefaultPlayer();
        }
    }
    return window.player;
}
function managerSave() {
    if (
        typeof window.saveGame ===
        "function"
    ) {
        window.saveGame();
    }
}
function managerRandom(min, max) {
    return (
        Math.random() *
        (max - min)
    ) + min;
}
function managerRandomInt(min, max) {
    return Math.floor(
        managerRandom(
            min,
            max + 1
        )
    );
}
function managerClamp(
    value,
    min,
    max
) {
    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );
}
/* =========================================================
   ESTRUTURA DO EMPRESÁRIO
========================================================= */
function ensureManagerData() {
    const player =
        managerPlayer();
    if (!player.manager) {
        player.manager = {
            active: true,
            name:
                "Carlos Mendes",
            reputation: 60,
            experience: 50,
            negotiation: 55,
            network: 50
        };
    }
    if (
        !Array.isArray(
            player.managerOffers
        )
    ) {
        player.managerOffers = [];
    }
    if (
        typeof player.managerSearchCooldown !==
        "number"
    ) {
        player.managerSearchCooldown = 0;
    }
    if (
        typeof player.managerLastOfferWeek !==
        "number"
    ) {
        player.managerLastOfferWeek = -999;
    }
    if (
        typeof player.managerOfferId !==
        "number"
    ) {
        player.managerOfferId = 0;
    }
    if (
        typeof player.managerSearching !==
        "boolean"
    ) {
        player.managerSearching = false;
    }
    if (
        typeof player.managerOfferPending !==
        "boolean"
    ) {
        player.managerOfferPending = false;
    }
    if (
        !Array.isArray(
            player.managerContractHistory
        )
    ) {
        player.managerContractHistory = [];
    }
}
/* =========================================================
   ESTÁGIO DO JOGADOR
========================================================= */
function managerCareerStage() {
    const player =
        managerPlayer();
    if (
        player.professional &&
        player.professional.active
    ) {
        return (
            player.careerStage ||
            "regional"
        );
    }
    return "amateur";
}
/* =========================================================
   VERIFICAR CAMP
========================================================= */
function isInFightCamp() {
    const player =
        managerPlayer();
    const fight =
        player.nextFight;
    if (!fight) {
        return false;
    }
    return true;
}
/* =========================================================
   DIA DA LUTA
========================================================= */
function managerIsFightDay() {
    const player =
        managerPlayer();
    const fight =
        player.nextFight;
    if (!fight) {
        return false;
    }
    if (
        fight.status ===
        "fight_day"
    ) {
        return true;
    }
    if (
        typeof fight.weeksRemaining ===
        "number"
    ) {
        return (
            fight.weeksRemaining <= 0
        );
    }
    if (
        typeof fight.fightWeek ===
        "number"
    ) {
        return (
            Number(player.week) >=
            Number(fight.fightWeek)
        );
    }
    return false;
}
/* =========================================================
   CALCULAR OVR
========================================================= */
function managerOverall() {
    const player =
        managerPlayer();
    if (
        typeof window.getOverall ===
        "function"
    ) {
        return Number(
            window.getOverall()
        );
    }
    return Number(
        player.overall || 45
    );
}
/* =========================================================
   GERAR ADVERSÁRIO
========================================================= */
function generateManagerOpponent() {
    const player =
        managerPlayer();
    const overall =
        managerOverall();
    const variation =
        managerRandomInt(
            -8,
            8
        );
    const power =
        managerClamp(
            overall +
            variation,
            35,
            95
        );
    const names = [
        "Lucas Andrade",
        "Rafael Silva",
        "Bruno Costa",
        "Diego Oliveira",
        "Matheus Santos",
        "Gabriel Ferreira",
        "Pedro Almeida",
        "Victor Souza",
        "André Martins",
        "Felipe Rocha",
        "Carlos Ribeiro",
        "João Mendes",
        "Thiago Lima",
        "Renan Alves",
        "Gustavo Pereira",
        "Eduardo Carvalho",
        "Leonardo Ramos",
        "Marcelo Torres",
        "Caio Moreira",
        "Henrique Dias"
    ];
    let name =
        names[
            managerRandomInt(
                0,
                names.length - 1
            )
        ];
    if (
        player.name &&
        name === player.name
    ) {
        name =
            "Ricardo Martins";
    }
    return {
        id:
            "OPP-" +
            Date.now() +
            "-" +
            managerRandomInt(
                1000,
                9999
            ),
        name:
            name,
        displayName:
            name,
        power:
            power,
        overall:
            power,
        age:
            managerRandomInt(
                18,
                35
            ),
        country:
            player.country ||
            "Brasil",
        style: [
            "Striker",
            "Wrestler",
            "Grappler",
            "Completo"
        ][
            managerRandomInt(
                0,
                3
            )
        ],
        wins:
            managerRandomInt(
                0,
                20
            ),
        losses:
            managerRandomInt(
                0,
                8
            ),
        draws:
            0
    };
}
/* =========================================================
   EVENTOS
========================================================= */
const MANAGER_EVENTS = [
    {
        name:
            "MMA Fight Night",
        stage:
            "regional",
        type:
            "regional",
        prestige:
            20,
        isBigEvent:
            false
    },
    {
        name:
            "Brazil Combat",
        stage:
            "regional",
        type:
            "regional",
        prestige:
            25,
        isBigEvent:
            false
    },
    {
        name:
            "Fight Arena",
        stage:
            "regional",
        type:
            "regional",
        prestige:
            30,
        isBigEvent:
            false
    },
    {
        name:
            "Future Fighters",
        stage:
            "regional",
        type:
            "regional",
        prestige:
            35,
        isBigEvent:
            false
    },
    {
        name:
            "National Combat",
        stage:
            "regional",
        type:
            "regional",
        prestige:
            40,
        isBigEvent:
            false
    },
    {
        name:
            "Warriors Championship",
        stage:
            "national",
        type:
            "national",
        prestige:
            50,
        isBigEvent:
            false
    },
    {
        name:
            "Combat Warriors",
        stage:
            "national",
        type:
            "national",
        prestige:
            55,
        isBigEvent:
            false
    },
    {
        name:
            "Cage Warriors Brasil",
        stage:
            "national",
        type:
            "national",
        prestige:
            60,
        isBigEvent:
            false
    },
    {
        name:
            "Ultimate Fight League",
        stage:
            "national",
        type:
            "national",
        prestige:
            65,
        isBigEvent:
            false
    },
    {
        name:
            "PFL",
        stage:
            "world",
        type:
            "world",
        prestige:
            80,
        isBigEvent:
            true
    },
    {
        name:
            "Bellator",
        stage:
            "world",
        type:
            "world",
        prestige:
            82,
        isBigEvent:
            true
    },
    {
        name:
            "ONE Championship",
        stage:
            "world",
        type:
            "world",
        prestige:
            84,
        isBigEvent:
            true
    },
    {
        name:
            "Rizin",
        stage:
            "world",
        type:
            "world",
        prestige:
            78,
        isBigEvent:
            true
    },
    {
        name:
            "UFC",
        stage:
            "elite",
        type:
            "elite",
        prestige:
            100,
        isBigEvent:
            true
    }
];
/* =========================================================
   GERAR EVENTO
========================================================= */
function generateManagerEvent() {
    const player =
        managerPlayer();
    const stage =
        managerCareerStage();
    let available = [];
    if (
        stage ===
        "amateur"
    ) {
        available =
            MANAGER_EVENTS.filter(
                event =>
                    event.stage ===
                    "regional"
            );
    }
    else if (
        stage ===
        "regional"
    ) {
        available =
            MANAGER_EVENTS.filter(
                event =>
                    event.stage ===
                    "regional"
            );
    }
    else if (
        stage ===
        "national"
    ) {
        available =
            MANAGER_EVENTS.filter(
                event =>
                    event.stage ===
                    "national"
            );
    }
    else if (
        stage ===
        "international" ||
        stage ===
        "world"
    ) {
        available =
            MANAGER_EVENTS.filter(
                event =>
                    event.stage ===
                    "world"
            );
    }
    else {
        available =
            MANAGER_EVENTS.filter(
                event =>
                    event.stage ===
                    "elite"
            );
    }
    if (
        available.length ===
        0
    ) {
        available =
            MANAGER_EVENTS.slice();
    }
    return available[
        managerRandomInt(
            0,
            available.length - 1
        )
    ];
}
/* =========================================================
   BOLSA NORMAL
========================================================= */
function calculateManagerPurse() {
    const player =
        managerPlayer();
    const stage =
        managerCareerStage();
    if (
        stage ===
        "amateur"
    ) {
        return 0;
    }
    if (
        stage ===
        "regional"
    ) {
        return MANAGER_CONFIG.regionalPurse;
    }
    if (
        stage ===
        "national"
    ) {
        return MANAGER_CONFIG.nationalPurse;
    }
    if (
        stage ===
        "world"
    ) {
        return MANAGER_CONFIG.worldFirstPurse;
    }
    if (
        stage ===
        "elite"
    ) {
        return MANAGER_CONFIG.eliteFirstPurse;
    }
    return 0;
}
/* =========================================================
   BOLSA EVENTO GRANDE
========================================================= */
function calculateBigEventPurse() {
    const player =
        managerPlayer();
    const contractNumber =
        Number(
            player.worldContractNumber ||
            player.eliteContractNumber ||
            1
        );
    const event =
        player.managerCurrentEvent;
    if (
        event &&
        event.stage ===
        "elite"
    ) {
        if (
            contractNumber <=
            1
        ) {
            return MANAGER_CONFIG.eliteFirstPurse;
        }
        if (
            contractNumber ===
            2
        ) {
            return MANAGER_CONFIG.eliteSecondPurse;
        }
        return managerRandomInt(
            MANAGER_CONFIG.eliteThirdMinPurse,
            MANAGER_CONFIG.eliteMaxPurse
        );
    }
    if (
        contractNumber <=
        1
    ) {
        return MANAGER_CONFIG.worldFirstPurse;
    }
    if (
        contractNumber ===
        2
    ) {
        return managerRandomInt(
            MANAGER_CONFIG.worldSecondPurse,
            MANAGER_CONFIG.worldSecondMaxPurse
        );
    }
    return managerRandomInt(
        MANAGER_CONFIG.worldThirdMinPurse,
        MANAGER_CONFIG.worldMaxPurse
    );
}
/* =========================================================
   BÔNUS DE VITÓRIA
========================================================= */
function calculateManagerWinBonus(
    purse
) {
    const player =
        managerPlayer();
    if (
        !player.professional ||
        player.professional.active !== true
    ) {
        return 0;
    }
    const stage =
        managerCareerStage();
    if (
        stage ===
        "regional"
    ) {
        return MANAGER_CONFIG.regionalWinBonus;
    }
    if (
        stage ===
        "national"
    ) {
        return MANAGER_CONFIG.nationalWinBonus;
    }
    return Math.round(
        Number(purse || 0)
    );
}
/* =========================================================
   NEGOCIAÇÃO
========================================================= */
function createNegotiationData(
    purse,
    event
) {
    const player =
        managerPlayer();
    const isProfessional =
        Boolean(
            player.professional &&
            player.professional.active === true
        );
    const available =
        Boolean(
            isProfessional &&
            event &&
            event.isBigEvent
        );
    return {
        available:
            available,
        rounds:
            0,
        maxRounds:
            3,
        originalPurse:
            Number(purse || 0),
        currentPurse:
            Number(purse || 0),
        requestedPurse:
            Number(purse || 0),
        maxPurse:
            Number(purse || 0),
        ppv:
            0,
        requestedPPV:
            0,
        accepted:
            false,
        rejected:
            false,
        completed:
            false
    };
}
/* =========================================================
   CALCULAR CHANCE DE ACEITAÇÃO
========================================================= */
function managerNegotiationChance(
    requested,
    base,
    event
) {
    const player =
        managerPlayer();
    if (
        requested <=
        base
    ) {
        return 1;
    }
    const increase =
        (
            requested -
            base
        ) /
        Math.max(
            base,
            1
        );
    const managerSkill =
        Number(
            player.manager &&
            player.manager.negotiation ||
            50
        );
    const performance =
        managerPerformanceScore();
    let chance =
        0.85 -
        increase * 0.7 +
        managerSkill * 0.001 +
        performance * 0.001;
    if (
        event &&
        event.stage ===
        "elite"
    ) {
        chance -=
            increase * 0.15;
    }
    return managerClamp(
        chance,
        0.05,
        0.95
    );
}
/* =========================================================
   PERFORMANCE
========================================================= */
function managerPerformanceScore() {
    const player =
        managerPlayer();
    const pro =
        player.professional || {};
    const wins =
        Number(
            pro.wins || 0
        );
    const losses =
        Number(
            pro.losses || 0
        );
    const fame =
        Number(
            player.fame || 0
        );
    let score =
        wins * 4 -
        losses * 3 +
        fame * 0.1;
    if (
        player.championship &&
        player.championship.title
    ) {
        score +=
            20;
    }
    return managerClamp(
        score,
        0,
        100
    );
}
/* =========================================================
   NEGOCIAR BOLSA
========================================================= */
function negotiateManagerPurse(
    requestedPurse
) {
    const player =
        managerPlayer();
    const fight =
        player.managerFightOffer;
    if (!fight) {
        return {
            success: false,
            message:
                "Não existe proposta."
        };
    }
    if (
        !fight.negotiation ||
        !fight.negotiation.available
    ) {
        return {
            success: false,
            message:
                "Esta luta não permite negociação."
        };
    }
    const negotiation =
        fight.negotiation;
    if (
        negotiation.rounds >=
        negotiation.maxRounds
    ) {
        return {
            success: false,
            message:
                "Limite de negociação atingido."
        };
    }
    const base =
        Number(
            negotiation.originalPurse ||
            fight.purse ||
            0
        );
    const requested =
        Number(
            requestedPurse
        );
    if (
        !Number.isFinite(requested) ||
        requested <= 0
    ) {
        return {
            success: false,
            message:
                "Valor inválido."
        };
    }
    const event =
        fight.event ||
        null;
    const chance =
        managerNegotiationChance(
            requested,
            base,
            event
        );
    negotiation.rounds++;
    if (
        Math.random() <=
        chance
    ) {
        negotiation.currentPurse =
            Math.round(
                requested
            );
        negotiation.accepted =
            true;
        negotiation.completed =
            true;
        fight.purse =
            Math.round(
                requested
            );
        fight.fightPurse =
            Math.round(
                requested
            );
        fight.winBonus =
            Math.round(
                requested
            );
        fight.totalWinPayout =
            Math.round(
                requested * 2
            );
        return {
            success: true,
            message:
                "A organização aceitou a negociação.",
            purse:
                Math.round(
                    requested
                )
        };
    }
    negotiation.rejected =
        true;
    negotiation.completed =
        true;
    return {
        success: false,
        message:
            "A organização recusou o novo valor."
    };
}
/* =========================================================
   NEGOCIAR PPV
========================================================= */
function negotiateManagerPPV(
    requestedPPV
) {
    const player =
        managerPlayer();
    const fight =
        player.managerFightOffer;
    if (!fight) {
        return false;
    }
    if (
        !fight.negotiation ||
        !fight.negotiation.available
    ) {
        return false;
    }
    const requested =
        managerClamp(
            Number(
                requestedPPV
            ),
            0,
            MANAGER_CONFIG.maxPPV
        );
    const performance =
        managerPerformanceScore();
    const base =
        Number(
            fight.negotiation.requestedPPV ||
            0
        );
    let chance =
        0.85 -
        requested * 0.055 +
        performance * 0.002;
    if (
        requested >
        base
    ) {
        chance -=
            (
                requested -
                base
            ) *
            0.04;
    }
    chance =
        managerClamp(
            chance,
            0.05,
            0.95
        );
    if (
        Math.random() <=
        chance
    ) {
        fight.negotiation.ppv =
            requested;
        fight.ppv =
            requested;
        return true;
    }
    return false;
}
/* =========================================================
   GERAR OFERTA
========================================================= */
function generateManagerFightOffer() {
    const player =
        managerPlayer();
    ensureManagerData();
    const opponent =
        generateManagerOpponent();
    const event =
        generateManagerEvent();
    player.managerCurrentEvent =
        event;
    const isProfessional =
        Boolean(
            player.professional &&
            player.professional.active === true
        );
    let purse =
        0;
    let winBonus =
        0;
    /* =====================================================
       AMADOR
       SEM BOLSA
    ===================================================== */
    if (
        !isProfessional
    ) {
        purse =
            0;
        winBonus =
            0;
    }
    /* =====================================================
       PROFISSIONAL
    ===================================================== */
    else {
        if (
            event.stage ===
            "regional"
        ) {
            purse =
                MANAGER_CONFIG.regionalPurse;
            winBonus =
                MANAGER_CONFIG.regionalWinBonus;
        }
        else if (
            event.stage ===
            "national"
        ) {
            purse =
                MANAGER_CONFIG.nationalPurse;
            winBonus =
                MANAGER_CONFIG.nationalWinBonus;
        }
        else if (
            event.stage ===
            "world"
        ) {
            purse =
                calculateBigEventPurse();
            winBonus =
                purse;
        }
        else if (
            event.stage ===
            "elite"
        ) {
            purse =
                calculateBigEventPurse();
            winBonus =
                purse;
        }
    }
    const campWeeks =
        managerRandomInt(
            MANAGER_CONFIG.minCampWeeks,
            MANAGER_CONFIG.maxCampWeeks
        );
    const negotiation =
        createNegotiationData(
            purse,
            event
        );
    const offer = {
        id:
            ++player.managerOfferId,
        type:
            "fight",
        status:
            "pending",
        createdWeek:
            Number(
                player.week || 1
            ),
        createdYear:
            Number(
                player.year || 2026
            ),
        eventName:
            event.name,
        eventType:
            event.type,
        eventStage:
            event.stage,
        eventPrestige:
            event.prestige,
        isBigEvent:
            Boolean(
                event.isBigEvent
            ),
        event: {
            name:
                event.name,
            type:
                event.type,
            stage:
                event.stage,
            prestige:
                event.prestige,
            isBigEvent:
                Boolean(
                    event.isBigEvent
                )
        },
        opponent:
            opponent,
        opponentName:
            opponent.name,
        opponentDisplayName:
            opponent.displayName,
        opponentOverall:
            Number(
                opponent.overall
            ),
        opponentPower:
            Number(
                opponent.power
            ),
        purse:
            Number(purse),
        fightPurse:
            Number(purse),
        winBonus:
            Number(winBonus),
        totalWinPayout:
            Number(
                purse +
                winBonus
            ),
        campWeeks:
            campWeeks,
        minCampWeeks:
            MANAGER_CONFIG.minCampWeeks,
        maxCampWeeks:
            MANAGER_CONFIG.maxCampWeeks,
        negotiation:
            negotiation,
        negotiable:
            Boolean(
                negotiation.available
            ),
        ppv:
            0,
        accepted:
            false,
        declined:
            false,
        expired:
            false,
        fightWeek:
            null,
        weeksRemaining:
            campWeeks
    };
    return offer;
}
/* =========================================================
   PODE PROCURAR LUTA?
========================================================= */
function managerCanSearchFight() {
    const player =
        managerPlayer();
    ensureManagerData();
    if (
        player.nextFight
    ) {
        return false;
    }
    if (
        player.managerFightOffer
    ) {
        return false;
    }
    if (
        player.managerOffers &&
        player.managerOffers.length > 0
    ) {
        return false;
    }
    if (
        Number(
            player.managerSearchCooldown ||
            0
        ) > 0
    ) {
        return false;
    }
    return true;
}
/* =========================================================
   EMPRESÁRIO PROCURA LUTA
========================================================= */
function processManagerFightOffer() {
    const player =
        managerPlayer();
    ensureManagerData();
    if (
        player.nextFight
    ) {
        return null;
    }
    if (
        player.managerFightOffer
    ) {
        return player.managerFightOffer;
    }
    if (
        player.managerOffers.length >
        0
    ) {
        player.managerFightOffer =
            player.managerOffers[0];
        player.managerOfferPending =
            true;
        managerSave();
        return player.managerFightOffer;
    }
    if (
        Number(
            player.managerSearchCooldown ||
            0
        ) > 0
    ) {
        player.managerSearchCooldown =
            Math.max(
                0,
                Number(
                    player.managerSearchCooldown
                ) - 1
            );
        managerSave();
        return null;
    }
    const currentWeek =
        Number(
            player.week || 1
        );
    const lastOfferWeek =
        Number(
            player.managerLastOfferWeek ||
            -999
        );
    if (
        currentWeek ===
        lastOfferWeek
    ) {
        return null;
    }
    if (
        currentWeek <
        MANAGER_CONFIG.firstFightWeek
    ) {
        return null;
    }
    if (
        Math.random() >
        MANAGER_CONFIG.offerChance
    ) {
        player.managerSearchCooldown =
            MANAGER_CONFIG.searchCooldownWeeks;
        player.managerLastOfferWeek =
            currentWeek;
        managerSave();
        return null;
    }
    const offer =
        generateManagerFightOffer();
    player.managerFightOffer =
        offer;
    player.managerOfferPending =
        true;
    player.managerSearching =
        false;
    player.managerLastOfferWeek =
        currentWeek;
    player.managerOffers =
        [];
    if (
        Array.isArray(player.log)
    ) {
        player.log.unshift(
            `📩 Seu empresário encontrou ${offer.opponentName} para ${offer.eventName}.`
        );
    }
    managerSave();
    if (
        typeof window.home ===
        "function"
    ) {
        window.home();
    }
    return offer;
}
/* =========================================================
   ACEITAR LUTA
========================================================= */
function acceptManagerFightOffer() {
    const player =
        managerPlayer();
    ensureManagerData();
    const offer =
        player.managerFightOffer;
    if (!offer) {
        alert(
            "Não existe nenhuma proposta de luta."
        );
        return false;
    }
    if (
        player.nextFight
    ) {
        alert(
            "Você já possui uma luta marcada."
        );
        return false;
    }
    const campWeeks =
        managerClamp(
            Number(
                offer.campWeeks ||
                MANAGER_CONFIG.minCampWeeks
            ),
            MANAGER_CONFIG.minCampWeeks,
            MANAGER_CONFIG.maxCampWeeks
        );
    const currentWeek =
        Number(
            player.week || 1
        );
    const fightWeek =
        currentWeek +
        campWeeks;
    /* =====================================================
       CONTRATO
    ===================================================== */
    let contractFights =
        managerRandomInt(
            MANAGER_CONFIG.regionalMinFights,
            MANAGER_CONFIG.regionalMaxFights
        );
    if (
        offer.eventStage ===
        "national"
    ) {
        contractFights =
            managerRandomInt(
                MANAGER_CONFIG.nationalMinFights,
                MANAGER_CONFIG.nationalMaxFights
            );
    }
    if (
        offer.eventStage ===
        "world"
    ) {
        const contractNumber =
            Number(
                player.worldContractNumber ||
                0
            ) + 1;
        player.worldContractNumber =
            contractNumber;
        if (
            contractNumber ===
            1
        ) {
            contractFights =
                managerRandomInt(
                    MANAGER_CONFIG.worldFirstMinFights,
                    MANAGER_CONFIG.worldFirstMaxFights
                );
        }
        else {
            contractFights =
                managerRandomInt(
                    MANAGER_CONFIG.worldSecondMinFights,
                    MANAGER_CONFIG.worldSecondMaxFights
                );
        }
    }
    if (
        offer.eventStage ===
        "elite"
    ) {
        const contractNumber =
            Number(
                player.eliteContractNumber ||
                0
            ) + 1;
        player.eliteContractNumber =
            contractNumber;
        if (
            contractNumber ===
            1
        ) {
            contractFights =
                MANAGER_CONFIG.eliteFirstFights;
        }
        else {
            contractFights =
                managerRandomInt(
                    MANAGER_CONFIG.eliteSecondMinFights,
                    MANAGER_CONFIG.eliteSecondMaxFights
                );
        }
    }
    /* =====================================================
       CRIAR LUTA
    ===================================================== */
    player.nextFight = {
        id:
            "FIGHT-" +
            Date.now(),
        status:
            "camp",
        event:
            offer.event,
        eventName:
            offer.eventName,
        opponent:
            offer.opponent,
        opponentName:
            offer.opponentName,
        opponentDisplayName:
            offer.opponentDisplayName,
        opponentOverall:
            offer.opponentOverall,
        opponentPower:
            offer.opponentPower,
        purse:
            offer.purse,
        fightPurse:
            offer.purse,
        winBonus:
            offer.winBonus,
        ppv:
            offer.ppv || 0,
        campWeeks:
            campWeeks,
        campStartWeek:
            currentWeek,
        fightWeek:
            fightWeek,
        weeksRemaining:
            campWeeks,
        contractFights:
            contractFights,
        contractFightNumber:
            1,
        result:
            null,
        completed:
            false
    };
    /* =====================================================
       CONTRATO ATUAL
    ===================================================== */
    player.currentContract = {
        active:
            true,
        promotionName:
            offer.eventName,
        stage:
            offer.eventStage,
        fights:
            contractFights,
        fightsCompleted:
            0,
        purse:
            offer.purse,
        winBonus:
            offer.winBonus,
        ppv:
            offer.ppv || 0,
        startedWeek:
            currentWeek,
        startedYear:
            Number(
                player.year || 2026
            )
    };
    /* =====================================================
       PROFISSIONALIZAÇÃO
    ===================================================== */
    if (
        offer.eventStage !==
        "amateur"
    ) {
        player.professional =
            player.professional || {};
        player.professional.active =
            true;
        if (
            !player.careerStage ||
            player.careerStage ===
            "amateur"
        ) {
            player.careerStage =
                offer.eventStage ===
                "regional"
                ?
                "regional"
                :
                offer.eventStage;
        }
    }
    /* =====================================================
       LIMPAR OFERTA
    ===================================================== */
    player.managerFightOffer =
        null;
    player.managerOfferPending =
        false;
    player.managerOffers =
        [];
    player.managerSearching =
        false;
    player.managerSearchCooldown =
        0;
    /* =====================================================
       LOG
    ===================================================== */
    if (
        Array.isArray(player.log)
    ) {
        player.log.unshift(
            `🥊 Luta aceita contra ${offer.opponentName}.`
        );
        player.log.unshift(
            `🏋️ Camp de ${campWeeks} semanas iniciado.`
        );
        player.log.unshift(
            `📄 Contrato de ${contractFights} luta(s) com ${offer.eventName}.`
        );
    }
    managerSave();
    if (
        typeof window.home ===
        "function"
    ) {
        window.home();
    }
    return true;
}
/* =========================================================
   RECUSAR
========================================================= */
function declineManagerFightOffer() {
    const player =
        managerPlayer();
    ensureManagerData();
    if (
        !player.managerFightOffer
    ) {
        alert(
            "Não existe nenhuma proposta."
        );
        return false;
    }
    const opponent =
        player.managerFightOffer
            .opponentName ||
        "adversário";
    player.managerFightOffer =
        null;
    player.managerOfferPending =
        false;
    player.managerOffers =
        [];
    player.managerSearching =
        false;
    player.managerSearchCooldown =
        2;
    if (
        Array.isArray(player.log)
    ) {
        player.log.unshift(
            `❌ Você recusou a luta contra ${opponent}.`
        );
    }
    managerSave();
    if (
        typeof window.home ===
        "function"
    ) {
        window.home();
    }
    return true;
}
/* =========================================================
   CAMP
========================================================= */
function processManagerCampWeek() {
    const player =
        managerPlayer();
    ensureManagerData();
    const fight =
        player.nextFight;
    if (!fight) {
        return;
    }
    const currentWeek =
        Number(
            player.week || 1
        );
    const fightWeek =
        Number(
            fight.fightWeek ||
            currentWeek
        );
    const remaining =
        Math.max(
            0,
            fightWeek -
            currentWeek
        );
    fight.weeksRemaining =
        remaining;
    if (
        currentWeek <
        fightWeek
    ) {
        fight.status =
            "camp";
        return;
    }
    fight.status =
        "fight_day";
    fight.weeksRemaining =
        0;
}
/* =========================================================
   PROCESSAR SEMANA
========================================================= */
function processManagerWeek() {
    const player =
        managerPlayer();
    ensureManagerData();
    if (
        player.nextFight
    ) {
        processManagerCampWeek();
        managerSave();
        return;
    }
    if (
        player.managerFightOffer
    ) {
        managerSave();
        return;
    }
    processManagerFightOffer();
}
/* =========================================================
   FINALIZAR LUTA
========================================================= */
function completeManagerFight(
    result
) {
    const player =
        managerPlayer();
    ensureManagerData();
    const fight =
        player.nextFight;
    if (!fight) {
        return;
    }
    const contract =
        player.currentContract;
    if (contract) {
        contract.fightsCompleted =
            Number(
                contract.fightsCompleted ||
                0
            ) + 1;
        if (
            contract.fightsCompleted >=
            Number(
                contract.fights ||
                0
            )
        ) {
            contract.active =
                false;
            player.currentContract =
                null;
            player.managerSearchCooldown =
                1;
        }
    }
    fight.status =
        "completed";
    fight.completed =
        true;
    fight.result =
        result || null;
    player.nextFight =
        null;
    player.managerFightOffer =
        null;
    player.managerOffers =
        [];
    player.managerOfferPending =
        false;
    if (
        Array.isArray(
            player.managerContractHistory
        )
    ) {
        if (
            contract
        ) {
            player.managerContractHistory.push(
                {
                    ...contract,
                    completedAtWeek:
                        Number(
                            player.week || 1
                        )
                }
            );
        }
    }
    player.managerSearchCooldown =
        2;
    if (
        Array.isArray(player.log)
    ) {
        player.log.unshift(
            "📋 O empresário encerrou o processo desta luta."
        );
    }
    managerSave();
}
/* =========================================================
   CANCELAR LUTA
========================================================= */
function cancelManagerFight(
    reason
) {
    const player =
        managerPlayer();
    ensureManagerData();
    if (
        !player.nextFight
    ) {
        return false;
    }
    const opponent =
        player.nextFight.opponentName ||
        "adversário";
    player.nextFight =
        null;
    player.managerFightOffer =
        null;
    player.managerOffers =
        [];
    player.managerOfferPending =
        false;
    player.managerSearchCooldown =
        2;
    if (
        Array.isArray(player.log)
    ) {
        player.log.unshift(
            `⚠️ A luta contra ${opponent} foi cancelada${reason ? `: ${reason}` : "."}`
        );
    }
    managerSave();
    return true;
}
/* =========================================================
   OFERTA DE TESTE
========================================================= */
function createManagerTestOffer() {
    const player =
        managerPlayer();
    ensureManagerData();
    if (
        player.nextFight
    ) {
        return false;
    }
    const offer =
        generateManagerFightOffer();
    player.managerFightOffer =
        offer;
    player.managerOfferPending =
        true;
    player.managerOffers =
        [];
    managerSave();
    if (
        typeof window.home ===
        "function"
    ) {
        window.home();
    }
    return true;
}
/* =========================================================
   ANO
========================================================= */
function processManagerContractYear() {
    const player =
        managerPlayer();
    ensureManagerData();
    if (
        player.manager
    ) {
        player.manager.experience =
            managerClamp(
                Number(
                    player.manager.experience ||
                    50
                ) + 1,
                1,
                100
            );
        player.manager.network =
            managerClamp(
                Number(
                    player.manager.network ||
                    50
                ) + 1,
                1,
                100
            );
    }
    managerSave();
}
/* =========================================================
   EXPORTAR
========================================================= */
window.ensureManagerData =
    ensureManagerData;
window.isInFightCamp =
    isInFightCamp;
window.managerIsFightDay =
    managerIsFightDay;
window.managerCanSearchFight =
    managerCanSearchFight;
window.generateManagerOpponent =
    generateManagerOpponent;
window.generateManagerEvent =
    generateManagerEvent;
window.calculateManagerPurse =
    calculateManagerPurse;
window.calculateBigEventPurse =
    calculateBigEventPurse;
window.calculateManagerWinBonus =
    calculateManagerWinBonus;
window.createNegotiationData =
    createNegotiationData;
window.negotiateManagerPurse =
    negotiateManagerPurse;
window.negotiateManagerPPV =
    negotiateManagerPPV;
window.generateManagerFightOffer =
    generateManagerFightOffer;
window.processManagerFightOffer =
    processManagerFightOffer;
window.processManagerCampWeek =
    processManagerCampWeek;
window.processManagerWeek =
    processManagerWeek;
window.acceptManagerFightOffer =
    acceptManagerFightOffer;
window.declineManagerFightOffer =
    declineManagerFightOffer;
window.processManagerContractYear =
    processManagerContractYear;
window.completeManagerFight =
    completeManagerFight;
window.cancelManagerFight =
    cancelManagerFight;
window.createManagerTestOffer =
    createManagerTestOffer;
/* =========================================================
   INICIALIZAÇÃO
========================================================= */
if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        ensureManagerData
    );
}
else {
    ensureManagerData();
}
