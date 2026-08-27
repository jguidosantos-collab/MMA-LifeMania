/* =========================================================
   MMA LIFE DYNASTY
   MANAGERS.JS
   EMPRESÁRIO — SISTEMA COMPLETO
   VERSÃO CORRIGIDA E ESTÁVEL
   FLUXO:
   ATLETA AMADOR
        ↓
   SEM EMPRESÁRIO
        ↓
   PROCURAR EMPRESÁRIO
        ↓
   ESCOLHER EMPRESÁRIO
        ↓
   CONTRATAR
        ↓
   EMPRESÁRIO AVALIA O ATLETA
        ↓
   PERGUNTA:
   "QUER SE TORNAR PROFISSIONAL?"
        ↓
   SIM → PROFISSIONAL
        ↓
   EMPRESÁRIO PROCURA LUTAS
        ↓
   OFERTA
        ↓
   NEGOCIAÇÃO
        ↓
   ACEITAR
        ↓
   CAMP
        ↓
   LUTA
        ↓
   RESULTADO
        ↓
   DESCANSO PÓS-LUTA
        ↓
   ESPERA REALISTA
        ↓
   NOVA OFERTA
========================================================= */
/* =========================================================
   CONFIGURAÇÕES
========================================================= */
const MANAGER_CONFIG = {
    minCampWeeks: 4,
    maxCampWeeks: 8,
    postFightRestWeeks: 2,
    searchCooldownWeeks: 2,
    minSearchWaitWeeks: 1,
    maxSearchWaitWeeks: 4,
    firstFightWeek: 1,
    offerChance: 0.60,
    minContractFights: 3,
    maxContractFights: 5,
    professionalMinAge: 18,
    professionalDecisionCooldownWeeks: 12
};
/* =========================================================
   EVENTOS
========================================================= */
const MANAGER_EVENTS = [
    /* =====================================================
       REGIONAL
    ===================================================== */
    {
        name: "MMA Fight Night",
        category: "regional",
        type: "regional",
        prestige: 20,
        basePurse: 200,
        winBonus: 200,
        minContract: 3,
        maxContract: 5,
        negotiable: false,
        ppv: false,
        elite: false
    },
    {
        name: "Brazil Combat",
        category: "regional",
        type: "regional",
        prestige: 25,
        basePurse: 200,
        winBonus: 200,
        minContract: 3,
        maxContract: 5,
        negotiable: false,
        ppv: false,
        elite: false
    },
    {
        name: "Fight Arena",
        category: "regional",
        type: "regional",
        prestige: 30,
        basePurse: 200,
        winBonus: 200,
        minContract: 3,
        maxContract: 5,
        negotiable: false,
        ppv: false,
        elite: false
    },
    {
        name: "Future Fighters",
        category: "regional",
        type: "regional",
        prestige: 35,
        basePurse: 200,
        winBonus: 200,
        minContract: 3,
        maxContract: 5,
        negotiable: false,
        ppv: false,
        elite: false
    },
    {
        name: "National Combat",
        category: "regional",
        type: "regional",
        prestige: 40,
        basePurse: 200,
        winBonus: 200,
        minContract: 3,
        maxContract: 5,
        negotiable: false,
        ppv: false,
        elite: false
    },
    /* =====================================================
       NACIONAL
    ===================================================== */
    {
        name: "Warriors Championship",
        category: "national",
        type: "national",
        prestige: 50,
        basePurse: 1000,
        winBonus: 1000,
        minContract: 3,
        maxContract: 5,
        negotiable: false,
        ppv: false,
        elite: false
    },
    {
        name: "Combat Warriors",
        category: "national",
        type: "national",
        prestige: 55,
        basePurse: 1000,
        winBonus: 1000,
        minContract: 3,
        maxContract: 5,
        negotiable: false,
        ppv: false,
        elite: false
    },
    {
        name: "Cage Warriors Brasil",
        category: "national",
        type: "national",
        prestige: 60,
        basePurse: 1000,
        winBonus: 1000,
        minContract: 3,
        maxContract: 5,
        negotiable: false,
        ppv: false,
        elite: false
    },
    {
        name: "Ultimate Fight League",
        category: "national",
        type: "national",
        prestige: 65,
        basePurse: 1000,
        winBonus: 1000,
        minContract: 3,
        maxContract: 5,
        negotiable: false,
        ppv: false,
        elite: false
    },
    /* =====================================================
       MUNDIAL
    ===================================================== */
    {
        name: "PFL",
        category: "world",
        type: "world",
        prestige: 75,
        basePurse: 8000,
        winBonus: 8000,
        minContract: 2,
        maxContract: 3,
        negotiable: true,
        ppv: true,
        elite: false
    },
    {
        name: "Bellator",
        category: "world",
        type: "world",
        prestige: 80,
        basePurse: 8000,
        winBonus: 8000,
        minContract: 2,
        maxContract: 3,
        negotiable: true,
        ppv: true,
        elite: false
    },
    {
        name: "ONE Championship",
        category: "world",
        type: "world",
        prestige: 82,
        basePurse: 8000,
        winBonus: 8000,
        minContract: 2,
        maxContract: 3,
        negotiable: true,
        ppv: true,
        elite: false
    },
    {
        name: "Rizin",
        category: "world",
        type: "world",
        prestige: 78,
        basePurse: 8000,
        winBonus: 8000,
        minContract: 2,
        maxContract: 3,
        negotiable: true,
        ppv: true,
        elite: false
    },
    /* =====================================================
       ELITE
    ===================================================== */
    {
        name: "UFC",
        category: "elite",
        type: "elite",
        prestige: 95,
        basePurse: 12000,
        winBonus: 12000,
        minContract: 3,
        maxContract: 3,
        negotiable: true,
        ppv: true,
        elite: true
    },
    {
        name: "UFC — Evento Grande",
        category: "elite",
        type: "elite_big",
        prestige: 100,
        basePurse: 25000,
        winBonus: 25000,
        minContract: 3,
        maxContract: 5,
        negotiable: true,
        ppv: true,
        elite: true
    },
    {
        name: "UFC — Disputa de Título",
        category: "elite",
        type: "title",
        prestige: 105,
        basePurse: 200000,
        winBonus: 200000,
        minContract: 1,
        maxContract: 1,
        negotiable: true,
        ppv: true,
        elite: true
    },
    {
        name: "UFC — Defesa de Cinturão",
        category: "elite",
        type: "title_defense",
        prestige: 110,
        basePurse: 200000,
        winBonus: 200000,
        minContract: 1,
        maxContract: 1,
        negotiable: true,
        ppv: true,
        elite: true
    }
];
/* =========================================================
   ESTADO
========================================================= */
window.mmaManager = null;
/* =========================================================
   UTILIDADES
========================================================= */
function getManagerPlayer() {
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
function managerPlayer() {
    return getManagerPlayer();
}
/* =========================================================
   SALVAR
========================================================= */
function managerSave() {
    try {
        if (
            typeof window.saveGame ===
            "function"
        ) {
            window.saveGame();
        }
    }
    catch (error) {
        console.warn(
            "MANAGERS.JS: erro ao salvar.",
            error
        );
    }
}
/* =========================================================
   RANDOM
========================================================= */
function managerRandom(min, max) {
    return (
        Math.random() *
        (
            max - min
        )
    ) + min;
}
/* =========================================================
   RANDOM INTEGER
========================================================= */
function managerRandomInt(min, max) {
    return Math.floor(
        managerRandom(
            min,
            max + 1
        )
    );
}
/* =========================================================
   CLAMP
========================================================= */
function managerClamp(value, min, max) {
    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );
}
/* =========================================================
   GARANTIR ESTRUTURA
========================================================= */
function ensureManagerData() {
    const player =
        managerPlayer();
    if (!player) {
        return;
    }
    if (
        typeof player.manager ===
        "undefined"
    ) {
        player.manager = null;
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
        typeof player.managerSearchWeek !==
        "number"
    ) {
        player.managerSearchWeek = -999;
    }
    if (
        typeof player.managerOfferPending !==
        "boolean"
    ) {
        player.managerOfferPending = false;
    }
    if (
        typeof player.managerContractFightNumber !==
        "number"
    ) {
        player.managerContractFightNumber = 0;
    }
    if (
        typeof player.managerContractTotalFights !==
        "number"
    ) {
        player.managerContractTotalFights = 0;
    }
    if (
        typeof player.managerContractEvent !==
        "string"
    ) {
        player.managerContractEvent = "";
    }
    if (
        typeof player.managerContractCategory !==
        "string"
    ) {
        player.managerContractCategory = "";
    }
    if (
        typeof player.postFightRestWeeks !==
        "number"
    ) {
        player.postFightRestWeeks = 0;
    }
    if (
        typeof player.postFightRestActive !==
        "boolean"
    ) {
        player.postFightRestActive = false;
    }
    if (
        typeof player.managerNextSearchWeek !==
        "number"
    ) {
        player.managerNextSearchWeek = 0;
    }
    if (
        typeof player.professionalDecisionPending !==
        "boolean"
    ) {
        player.professionalDecisionPending = false;
    }
    if (
        typeof player.professionalDecisionMade !==
        "boolean"
    ) {
        player.professionalDecisionMade = false;
    }
    if (
        typeof player.professionalDecisionWeek !==
        "number"
    ) {
        player.professionalDecisionWeek = -999;
    }
    if (
        typeof player.managerSearchAfterRest !==
        "boolean"
    ) {
        player.managerSearchAfterRest = false;
    }
}
/* =========================================================
   TEM EMPRESÁRIO?
========================================================= */
function hasManager() {
    const player =
        managerPlayer();
    if (!player) {
        return false;
    }
    ensureManagerData();
    return Boolean(
        player.manager &&
        player.manager.active !== false
    );
}
/* =========================================================
   OVERALL
========================================================= */
function managerGetPlayerOverall() {
    const player =
        managerPlayer();
    if (!player) {
        return 45;
    }
    try {
        if (
            typeof window.getOverall ===
            "function"
        ) {
            const value =
                Number(
                    window.getOverall()
                );
            if (
                Number.isFinite(value) &&
                value > 0
            ) {
                return value;
            }
        }
    }
    catch (error) {
        console.warn(
            "MANAGERS.JS: getOverall indisponível."
        );
    }
    const overall =
        Number(
            player.overall || 45
        );
    return (
        Number.isFinite(overall) &&
        overall > 0
    )
        ?
        overall
        :
        45;
}
/* =========================================================
   VERIFICAR AMADOR
========================================================= */
function managerIsAmateur() {
    const player =
        managerPlayer();
    if (!player) {
        return true;
    }
    if (
        player.careerStage ===
        "amateur"
    ) {
        return true;
    }
    if (
        player.careerStage ===
        "professional"
    ) {
        return false;
    }
    if (
        player.professional &&
        player.professional.active === true
    ) {
        return false;
    }
    return (
        Number(
            player.age || 15
        ) < 18
    );
}
/* =========================================================
   GERAR OPONENTE
========================================================= */
function generateManagerOpponent() {
    const player =
        managerPlayer();
    const playerOverall =
        managerGetPlayerOverall();
    const variation =
        managerRandomInt(
            -8,
            8
        );
    const opponentOverall =
        managerClamp(
            Math.round(
                playerOverall +
                variation
            ),
            30,
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
        "Henrique Dias",
        "Rodrigo Alves",
        "Marcos Vinicius",
        "Daniel Costa",
        "Arthur Souza",
        "Vinicius Rocha"
    ];
    let name =
        names[
            managerRandomInt(
                0,
                names.length - 1
            )
        ];
    if (
        player &&
        player.name &&
        name === player.name
    ) {
        name =
            "Ricardo Martins";
    }
    const styles = [
        "Striker",
        "Wrestler",
        "Grappler",
        "Completo"
    ];
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
        overall:
            opponentOverall,
        power:
            opponentOverall,
        age:
            managerRandomInt(
                18,
                35
            ),
        country:
            player?.country ||
            "Brasil",
        style:
            styles[
                managerRandomInt(
                    0,
                    styles.length - 1
                )
            ],
        wins:
            managerRandomInt(
                0,
                15
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
   ESCOLHER EVENTO
========================================================= */
function generateManagerEvent() {
    const overall =
        managerGetPlayerOverall();
    let availableEvents =
        MANAGER_EVENTS.slice();
    if (
        overall < 50
    ) {
        availableEvents =
            availableEvents.filter(
                function(event) {
                    return (
                        event.category ===
                        "regional"
                    );
                }
            );
    }
    else if (
        overall < 65
    ) {
        availableEvents =
            availableEvents.filter(
                function(event) {
                    return (
                        event.category ===
                        "regional" ||
                        event.category ===
                        "national"
                    );
                }
            );
    }
    else if (
        overall < 75
    ) {
        availableEvents =
            availableEvents.filter(
                function(event) {
                    return (
                        event.category ===
                        "regional" ||
                        event.category ===
                        "national" ||
                        event.category ===
                        "world"
                    );
                }
            );
    }
    if (
        availableEvents.length === 0
    ) {
        availableEvents =
            MANAGER_EVENTS.filter(
                function(event) {
                    return (
                        event.category ===
                        "regional"
                    );
                }
            );
    }
    const event =
        availableEvents[
            managerRandomInt(
                0,
                availableEvents.length - 1
            )
        ];
    return {
        name:
            event.name,
        category:
            event.category,
        type:
            event.type,
        prestige:
            event.prestige,
        basePurse:
            event.basePurse,
        winBonus:
            event.winBonus,
        minContract:
            event.minContract,
        maxContract:
            event.maxContract,
        negotiable:
            event.negotiable,
        ppv:
            event.ppv,
        elite:
            event.elite,
        isBigEvent:
            (
                event.type ===
                "elite_big" ||
                event.type ===
                "title" ||
                event.type ===
                "title_defense"
            )
    };
}
/* =========================================================
   BOLSAS
========================================================= */
function calculateRegionalPurse() {
    return 200;
}
function calculateNationalPurse() {
    return 1000;
}
function calculateWorldPurse() {
    const player =
        managerPlayer();
    const fightNumber =
        Number(
            player?.managerContractFightNumber ||
            0
        );
    if (
        fightNumber <= 3
    ) {
        return 8000;
    }
    if (
        fightNumber <= 6
    ) {
        return 10000;
    }
    return managerClamp(
        Math.round(
            managerRandom(
                80000,
                350000
            )
        ),
        80000,
        350000
    );
}
function calculateElitePurse(event) {
    const player =
        managerPlayer();
    const fightNumber =
        Number(
            player?.managerContractFightNumber ||
            0
        );
    if (
        event.type ===
        "elite"
    ) {
        if (
            fightNumber <= 0
        ) {
            return 12000;
        }
        if (
            fightNumber <= 3
        ) {
            return managerRandomInt(
                12000,
                25000
            );
        }
        return managerClamp(
            Math.round(
                managerRandom(
                    200000,
                    1000000
                )
            ),
            200000,
            1000000
        );
    }
    if (
        event.type ===
        "elite_big"
    ) {
        return managerClamp(
            Math.round(
                managerRandom(
                    25000,
                    1000000
                )
            ),
            25000,
            1000000
        );
    }
    if (
        event.type ===
        "title" ||
        event.type ===
        "title_defense"
    ) {
        return managerClamp(
            Math.round(
                managerRandom(
                    200000,
                    1000000
                )
            ),
            200000,
            1000000
        );
    }
    return 12000;
}
function calculateManagerPurse(event) {
    if (!event) {
        return 200;
    }
    if (
        event.category ===
        "regional"
    ) {
        return calculateRegionalPurse();
    }
    if (
        event.category ===
        "national"
    ) {
        return calculateNationalPurse();
    }
    if (
        event.category ===
        "world"
    ) {
        return calculateWorldPurse();
    }
    if (
        event.category ===
        "elite"
    ) {
        return calculateElitePurse(
            event
        );
    }
    return 200;
}
/* =========================================================
   BÔNUS
========================================================= */
function calculateManagerWinBonus(purse) {
    if (
        managerIsAmateur()
    ) {
        return 0;
    }
    return Math.round(
        Number(
            purse || 0
        )
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
    if (
        !event ||
        event.category ===
        "regional" ||
        event.category ===
        "national" ||
        event.negotiable === false
    ) {
        return {
            available: false,
            currentPurse:
                Number(purse || 0),
            minimum:
                Number(purse || 0),
            maximum:
                Number(purse || 0),
            requested:
                Number(purse || 0),
            successChance:
                100,
            ppvAvailable:
                false,
            ppv:
                0,
            status:
                "fixed"
        };
    }
    const minimum =
        Number(purse || 0);
    const maximum =
        Math.min(
            1000000,
            Math.max(
                minimum,
                Math.round(
                    minimum * 2
                )
            )
        );
    const requested =
        managerClamp(
            Math.round(
                managerRandom(
                    minimum,
                    maximum
                )
            ),
            minimum,
            maximum
        );
    const ratio =
        requested /
        Math.max(
            1,
            maximum
        );
    let successChance =
        90 -
        ratio * 75;
    successChance +=
        Number(
            player?.manager?.negotiation ||
            50
        ) * 0.15;
    successChance =
        managerClamp(
            Math.round(
                successChance
            ),
            10,
            90
        );
    const ppv =
        managerClamp(
            Number(
                managerRandom(
                    1,
                    10
                ).toFixed(1)
            ),
            1,
            10
        );
    return {
        available:
            true,
        currentPurse:
            minimum,
        minimum:
            minimum,
        maximum:
            maximum,
        requested:
            requested,
        successChance:
            successChance,
        ppvAvailable:
            Boolean(event.ppv),
        ppv:
            event.ppv
                ?
                ppv
                :
                0,
        negotiationType:
            event.category,
        status:
            "pending"
    };
}
/* =========================================================
   NEGOCIAR OFERTA
========================================================= */
function negotiateManagerFightOffer(amount) {
    const player =
        managerPlayer();
    ensureManagerData();
    if (!player) {
        return false;
    }
    const offer =
        player.managerFightOffer;
    if (!offer) {
        return false;
    }
    const negotiation =
        offer.negotiation;
    if (
        !negotiation ||
        negotiation.available !== true
    ) {
        return true;
    }
    if (
        negotiation.status ===
        "accepted"
    ) {
        return true;
    }
    let requested =
        Number(amount);
    if (
        !Number.isFinite(requested)
    ) {
        requested =
            Number(
                negotiation.requested ||
                negotiation.currentPurse ||
                0
            );
    }
    requested =
        managerClamp(
            Math.round(
                requested
            ),
            Number(
                negotiation.minimum ||
                0
            ),
            Number(
                negotiation.maximum ||
                requested
            )
        );
    negotiation.requested =
        requested;
    /*
       A chance de negociação leva em conta:
       - qualidade do empresário
       - valor pedido
       - dificuldade da negociação
    */
    const minimum =
        Number(
            negotiation.minimum ||
            0
        );
    const maximum =
        Number(
            negotiation.maximum ||
            minimum
        );
    const ratio =
        requested /
        Math.max(
            1,
            maximum
        );
    let chance =
        90 -
        ratio * 75;
    chance +=
        Number(
            player.manager?.negotiation ||
            50
        ) * 0.15;
    chance =
        managerClamp(
            Math.round(chance),
            5,
            95
        );
    negotiation.successChance =
        chance;
    const success =
        Math.random() * 100 <
        chance;
    if (
        success
    ) {
        /*
           A bolsa negociada passa
           a ser a nova bolsa da luta.
        */
        const oldPurse =
            Number(
                offer.purse ||
                0
            );
        const newPurse =
            requested;
        offer.purse =
            newPurse;
        offer.fightPurse =
            newPurse;
        /*
           O bônus acompanha a bolsa.
        */
        if (
            !offer.amateur
        ) {
            offer.winBonus =
                calculateManagerWinBonus(
                    newPurse
                );
        }
        offer.totalWinPayout =
            Number(
                offer.purse || 0
            ) +
            Number(
                offer.winBonus || 0
            );
        negotiation.currentPurse =
            newPurse;
        negotiation.requested =
            newPurse;
        negotiation.status =
            "accepted";
        negotiation.success =
            true;
        if (
            Array.isArray(
                player.log
            )
        ) {
            player.log.unshift(
                `🤝 Negociação concluída! A bolsa passou de $${oldPurse.toLocaleString("en-US")} para $${newPurse.toLocaleString("en-US")}.`
            );
        }
        managerSave();
        return true;
    }
    /*
       Negociação recusada.
       A oferta original continua válida.
    */
    negotiation.status =
        "failed";
    negotiation.success =
        false;
    negotiation.counterOffer =
        minimum;
    if (
        Array.isArray(
            player.log
        )
    ) {
        player.log.unshift(
            `❌ A organização recusou a negociação de $${requested.toLocaleString("en-US")}.`
        );
        player.log.unshift(
            `💰 A oferta original de $${minimum.toLocaleString("en-US")} continua disponível.`
        );
    }
    managerSave();
    return false;
}
/* =========================================================
   GERAR OFERTA
========================================================= */
function generateManagerFightOffer() {
    const player =
        managerPlayer();
    ensureManagerData();
    if (
        !hasManager()
    ) {
        return null;
    }
    const amateur =
        managerIsAmateur();
    const opponent =
        generateManagerOpponent();
    const event =
        generateManagerEvent();
    let purse =
        0;
    if (
        !amateur
    ) {
        purse =
            calculateManagerPurse(
                event
            );
    }
    const winBonus =
        amateur
            ?
            0
            :
            calculateManagerWinBonus(
                purse
            );
    const campWeeks =
        managerRandomInt(
            MANAGER_CONFIG.minCampWeeks,
            MANAGER_CONFIG.maxCampWeeks
        );
    const contractFights =
        managerRandomInt(
            event.minContract,
            event.maxContract
        );
    const negotiation =
        amateur
            ?
            {
                available: false,
                currentPurse: 0,
                minimum: 0,
                maximum: 0,
                requested: 0,
                successChance: 100,
                ppvAvailable: false,
                ppv: 0,
                status: "fixed"
            }
            :
            createNegotiationData(
                purse,
                event
            );
    return {
        id:
            ++player.managerOfferId,
        type:
            "fight",
        status:
            "pending",
        createdWeek:
            Number(
                player.week || 0
            ),
        createdYear:
            Number(
                player.year || 2026
            ),
        eventName:
            event.name,
        eventType:
            event.type,
        eventCategory:
            event.category,
        eventPrestige:
            event.prestige,
        isBigEvent:
            Boolean(
                event.isBigEvent
            ),
        event:
            event,
        opponent:
            opponent,
        opponentName:
            opponent.name,
        opponentDisplayName:
            opponent.displayName,
        opponentOverall:
            opponent.overall,
        opponentPower:
            opponent.power,
        purse:
            purse,
        fightPurse:
            purse,
        winBonus:
            winBonus,
        totalWinPayout:
            purse +
            winBonus,
        amateur:
            amateur,
        contractFights:
            contractFights,
        contractRemaining:
            contractFights,
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
        ppvAvailable:
            Boolean(
                event.ppv &&
                !amateur
            ),
        ppvPercentage:
            Number(
                negotiation.ppv ||
                0
            ),
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
}
/* =========================================================
   PODE PROCURAR?
========================================================= */
function managerCanSearchFight() {
    const player =
        managerPlayer();
    if (!player) {
        return false;
    }
    ensureManagerData();
    if (
        !hasManager()
    ) {
        return false;
    }
    if (
        player.postFightRestActive === true &&
        Number(
            player.postFightRestWeeks || 0
        ) > 0
    ) {
        return false;
    }
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
        Number(
            player.managerSearchCooldown || 0
        ) > 0
    ) {
        return false;
    }
    const currentWeek =
        Number(
            player.week || 0
        );
    if (
        currentWeek <
        Number(
            player.managerNextSearchWeek || 0
        )
    ) {
        return false;
    }
    return true;
}
/* =========================================================
   PROCESSAR OFERTA
========================================================= */
function processManagerFightOffer() {
    const player =
        managerPlayer();
    if (!player) {
        return null;
    }
    ensureManagerData();
    if (
        !hasManager()
    ) {
        return null;
    }
    if (
        player.postFightRestActive === true &&
        Number(
            player.postFightRestWeeks || 0
        ) > 0
    ) {
        return null;
    }
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
        Number(
            player.managerSearchCooldown || 0
        ) > 0
    ) {
        return null;
    }
    const currentWeek =
        Number(
            player.week || 0
        );
    if (
        currentWeek <
        Number(
            player.managerNextSearchWeek || 0
        )
    ) {
        return null;
    }
    if (
        currentWeek ===
        Number(
            player.managerLastOfferWeek
        )
    ) {
        return null;
    }
    player.managerLastOfferWeek =
        currentWeek;
    if (
        Math.random() >
        MANAGER_CONFIG.offerChance
    ) {
        const wait =
            managerRandomInt(
                MANAGER_CONFIG.minSearchWaitWeeks,
                MANAGER_CONFIG.maxSearchWaitWeeks
            );
        player.managerNextSearchWeek =
            currentWeek +
            wait;
        player.managerSearchCooldown =
            0;
        player.managerSearching =
            false;
        managerSave();
        return null;
    }
    const offer =
        generateManagerFightOffer();
    if (
        !offer
    ) {
        return null;
    }
    player.managerFightOffer =
        offer;
    player.managerOfferPending =
        true;
    player.managerSearching =
        false;
    player.managerSearchWeek =
        currentWeek;
    player.managerOffers =
        [];
    if (
        Array.isArray(
            player.log
        )
    ) {
        if (
            offer.amateur
        ) {
            player.log.unshift(
                `📩 Seu empresário encontrou uma luta amadora contra ${offer.opponentName}.`
            );
        }
        else {
            player.log.unshift(
                `📩 Seu empresário encontrou uma luta contra ${offer.opponentName} no ${offer.eventName}.`
            );
        }
    }
    managerSave();
    try {
        if (
            typeof window.home ===
            "function"
        ) {
            window.home();
        }
    }
    catch (error) {}
    return offer;
}
/* =========================================================
   ACEITAR OFERTA
========================================================= */
function acceptManagerFightOffer() {
    const player =
        managerPlayer();
    if (!player) {
        return false;
    }
    ensureManagerData();
    const offer =
        player.managerFightOffer;
    if (
        !offer
    ) {
        alert(
            "Não existe nenhuma proposta de luta."
        );
        return false;
    }
    if (
        !offer.opponent
    ) {
        alert(
            "Erro: adversário não encontrado na proposta."
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
    if (
        player.postFightRestActive === true &&
        Number(
            player.postFightRestWeeks || 0
        ) > 0
    ) {
        alert(
            "Você ainda está no período de recuperação pós-luta."
        );
        return false;
    }
    /*
       Se a negociação ainda estiver pendente,
       a oferta original continua válida.
       Portanto o jogador pode aceitar
       mesmo sem negociar.
    */
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
            player.week || 0
        );
    const fightWeek =
        currentWeek +
        campWeeks;
    const opponent =
        offer.opponent
            ?
            {
                ...offer.opponent
            }
            :
            null;
    if (!opponent) {
        alert(
            "Erro: adversário não encontrado."
        );
        return false;
    }
    player.nextFight = {
        id:
            "FIGHT-" +
            Date.now() +
            "-" +
            managerRandomInt(
                1000,
                9999
            ),
        status:
            "camp",
        event:
            offer.event,
        eventName:
            offer.eventName,
        eventType:
            offer.eventType,
        eventCategory:
            offer.eventCategory,
        eventPrestige:
            offer.eventPrestige,
        isBigEvent:
            offer.isBigEvent,
        opponent:
            opponent,
        opponentName:
            offer.opponentName,
        opponentDisplayName:
            offer.opponentDisplayName,
        opponentOverall:
            Number(
                offer.opponentOverall ||
                opponent.overall ||
                45
            ),
        opponentPower:
            Number(
                offer.opponentPower ||
                opponent.power ||
                45
            ),
        purse:
            Number(
                offer.purse || 0
            ),
        fightPurse:
            Number(
                offer.fightPurse ||
                offer.purse ||
                0
            ),
        winBonus:
            Number(
                offer.winBonus || 0
            ),
        totalWinPayout:
            Number(
                offer.totalWinPayout ||
                (
                    Number(
                        offer.purse || 0
                    ) +
                    Number(
                        offer.winBonus || 0
                    )
                )
            ),
        contractFights:
            Number(
                offer.contractFights ||
                1
            ),
        contractRemaining:
            Number(
                offer.contractFights ||
                1
            ),
        campWeeks:
            campWeeks,
        campStartWeek:
            currentWeek,
        fightWeek:
            fightWeek,
        weeksRemaining:
            campWeeks,
        acceptedWeek:
            currentWeek,
        acceptedYear:
            Number(
                player.year || 2026
            ),
        ppvAvailable:
            Boolean(
                offer.ppvAvailable
            ),
        ppvPercentage:
            Number(
                offer.ppvPercentage || 0
            ),
        result:
            null,
        completed:
            false
    };
    player.managerContractFightNumber =
        Number(
            player.managerContractFightNumber ||
            0
        );
    player.managerContractTotalFights =
        Number(
            offer.contractFights ||
            1
        );
    player.managerContractEvent =
        offer.eventName;
    player.managerContractCategory =
        offer.eventCategory;
    /*
       Se não existe contrato,
       cria o contrato.
       Se já existe contrato,
       mantém o contrato existente.
    */
    if (
        !player.currentContract
    ) {
        player.currentContract = {
            event:
                offer.eventName,
            eventName:
                offer.eventName,
            category:
                offer.eventCategory,
            type:
                offer.eventType,
            totalFights:
                Number(
                    offer.contractFights ||
                    1
                ),
            fightsCompleted:
                0,
            fightsRemaining:
                Number(
                    offer.contractFights ||
                    1
                ),
            purse:
                Number(
                    offer.purse ||
                    0
                ),
            winBonus:
                Number(
                    offer.winBonus ||
                    0
                ),
            ppv:
                Number(
                    offer.ppvPercentage ||
                    0
                )
        };
    }
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
    player.managerNextSearchWeek =
        fightWeek;
    if (
        Array.isArray(
            player.log
        )
    ) {
        player.log.unshift(
            `🥊 Luta aceita! ${player.name || "Você"} enfrentará ${offer.opponentName}.`
        );
        player.log.unshift(
            `🏟️ Evento: ${offer.eventName}.`
        );
        if (
            offer.amateur
        ) {
            player.log.unshift(
                "🥊 Luta amadora confirmada."
            );
        }
        else {
            player.log.unshift(
                `💰 Bolsa: $${Number(offer.purse || 0).toLocaleString("en-US")} + $${Number(offer.winBonus || 0).toLocaleString("en-US")} de bônus de vitória.`
            );
        }
        player.log.unshift(
            `🏋️ Camp de ${campWeeks} semanas iniciado. A luta será na semana ${fightWeek}.`
        );
    }
    managerSave();
    try {
        if (
            typeof window.home ===
            "function"
        ) {
            window.home();
        }
    }
    catch (error) {}
    return true;
}
/* =========================================================
   RECUSAR
========================================================= */
function declineManagerFightOffer() {
    const player =
        managerPlayer();
    if (!player) {
        return false;
    }
    ensureManagerData();
    if (
        !player.managerFightOffer
    ) {
        alert(
            "Não existe nenhuma proposta."
        );
        return false;
    }
    const opponentName =
        player.managerFightOffer.opponentName ||
        "adversário";
    player.managerFightOffer =
        null;
    player.managerOfferPending =
        false;
    player.managerOffers =
        [];
    player.managerSearching =
        false;
    const currentWeek =
        Number(
            player.week || 0
        );
    const wait =
        managerRandomInt(
            2,
            4
        );
    player.managerNextSearchWeek =
        currentWeek +
        wait;
    player.managerSearchCooldown =
        0;
    if (
        Array.isArray(
            player.log
        )
    ) {
        player.log.unshift(
            `❌ Você recusou a luta contra ${opponentName}.`
        );
        player.log.unshift(
            "📅 Seu empresário vai procurar outra oportunidade nas próximas semanas."
        );
    }
    managerSave();
    try {
        if (
            typeof window.home ===
            "function"
        ) {
            window.home();
        }
    }
    catch (error) {}
    return true;
}
/* =========================================================
   CAMP
========================================================= */
function isInFightCamp() {
    const player =
        managerPlayer();
    if (!player) {
        return false;
    }
    const fight =
        player.nextFight;
    if (
        !fight
    ) {
        return false;
    }
    if (
        fight.completed ===
        true
    ) {
        return false;
    }
    return (
        fight.status ===
        "camp" ||
        fight.status ===
        "scheduled" ||
        fight.status ===
        "fight_day"
    );
}
/* =========================================================
   DIA DA LUTA
========================================================= */
function managerIsFightDay() {
    const player =
        managerPlayer();
    if (!player) {
        return false;
    }
    const fight =
        player.nextFight;
    if (
        !fight
    ) {
        return false;
    }
    if (
        fight.completed ===
        true
    ) {
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
        "number" &&
        fight.weeksRemaining <= 0
    ) {
        return true;
    }
    if (
        typeof fight.fightWeek ===
        "number"
    ) {
        return (
            Number(
                player.week || 0
            ) >=
            Number(
                fight.fightWeek
            )
        );
    }
    return false;
}
/* =========================================================
   PROCESSAR CAMP
========================================================= */
function processManagerCampWeek() {
    const player =
        managerPlayer();
    if (!player) {
        return;
    }
    ensureManagerData();
    const fight =
        player.nextFight;
    if (
        !fight ||
        fight.completed === true
    ) {
        return;
    }
    const currentWeek =
        Number(
            player.week || 0
        );
    const fightWeek =
        Number(
            fight.fightWeek
        );
    if (
        !Number.isFinite(
            fightWeek
        )
    ) {
        return;
    }
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
    if (
        fight.fightDayNotified !==
        true
    ) {
        fight.fightDayNotified =
            true;
        if (
            Array.isArray(
                player.log
            )
        ) {
            player.log.unshift(
                `🥊 DIA DA LUTA! ${fight.opponentName} aguarda você no ${fight.eventName}.`
            );
        }
        managerSave();
    }
}
/* =========================================================
   DESCANSO PÓS-LUTA
========================================================= */
function processManagerPostFightRest() {
    const player =
        managerPlayer();
    if (!player) {
        return false;
    }
    ensureManagerData();
    if (
        player.postFightRestActive !== true
    ) {
        return false;
    }
    const remaining =
        Number(
            player.postFightRestWeeks || 0
        );
    if (
        remaining <= 0
    ) {
        player.postFightRestWeeks =
            0;
        player.postFightRestActive =
            false;
        return false;
    }
    player.postFightRestWeeks =
        Math.max(
            0,
            remaining - 1
        );
    if (
        player.postFightRestWeeks <= 0
    ) {
        player.postFightRestWeeks =
            0;
        player.postFightRestActive =
            false;
        const currentWeek =
            Number(
                player.week || 0
            );
        const wait =
            managerRandomInt(
                MANAGER_CONFIG.minSearchWaitWeeks,
                MANAGER_CONFIG.maxSearchWaitWeeks
            );
        player.managerNextSearchWeek =
            currentWeek +
            wait;
        if (
            Array.isArray(
                player.log
            )
        ) {
            player.log.unshift(
                "🥊 Recuperação pós-luta concluída."
            );
            player.log.unshift(
                "📅 Seu empresário continuará procurando uma nova oportunidade."
            );
        }
    }
    else {
        if (
            Array.isArray(
                player.log
            )
        ) {
            player.log.unshift(
                `🛌 Recuperação pós-luta: ${player.postFightRestWeeks} semana(s) restante(s).`
            );
        }
    }
    managerSave();
    return true;
}
/* =========================================================
   PROCESSAR SEMANA
========================================================= */
function processManagerWeek() {
    const player =
        managerPlayer();
    if (!player) {
        return;
    }
    ensureManagerData();
    if (
        !hasManager()
    ) {
        return;
    }
    if (
        player.postFightRestActive === true
    ) {
        processManagerPostFightRest();
        return;
    }
    if (
        player.nextFight
    ) {
        processManagerCampWeek();
        return;
    }
    if (
        player.managerFightOffer
    ) {
        return;
    }
    processManagerFightOffer();
}
/* =========================================================
   BLOQUEAR AVANÇO NO DIA DA LUTA
========================================================= */
function managerShouldBlockWeekAdvance() {
    return managerIsFightDay();
}
/* =========================================================
   PODE LUTAR?
========================================================= */
function managerCanFightNow() {
    const player =
        managerPlayer();
    if (
        !player ||
        !player.nextFight
    ) {
        return false;
    }
    return managerIsFightDay();
}
/* =========================================================
   COMPLETAR LUTA
========================================================= */
function completeManagerFight(result) {
    const player =
        managerPlayer();
    if (!player) {
        return;
    }
    ensureManagerData();
    const fight =
        player.nextFight;
    if (
        !fight
    ) {
        return;
    }
    fight.status =
        "completed";
    fight.completed =
        true;
    fight.result =
        result ||
        null;
    /*
       CONTRATO
    */
    if (
        player.currentContract
    ) {
        player.currentContract.fightsCompleted =
            Number(
                player.currentContract.fightsCompleted ||
                0
            ) + 1;
        player.currentContract.fightsRemaining =
            Math.max(
                0,
                Number(
                    player.currentContract.fightsRemaining ||
                    0
                ) - 1
            );
        player.managerContractFightNumber =
            Number(
                player.managerContractFightNumber ||
                0
            ) + 1;
        if (
            player.currentContract.fightsRemaining <=
            0
        ) {
            if (
                Array.isArray(
                    player.log
                )
            ) {
                player.log.unshift(
                    `📋 Contrato com ${player.currentContract.eventName || player.currentContract.event} encerrado.`
                );
            }
            player.currentContract =
                null;
            player.managerContractFightNumber =
                0;
            player.managerContractTotalFights =
                0;
            player.managerContractEvent =
                "";
            player.managerContractCategory =
                "";
        }
    }
    /*
       DESCANSO
    */
    player.postFightRestWeeks =
        MANAGER_CONFIG.postFightRestWeeks;
    player.postFightRestActive =
        true;
    /*
       LIMPAR LUTA
    */
    player.nextFight =
        null;
    player.managerFightOffer =
        null;
    player.managerOffers =
        [];
    player.managerOfferPending =
        false;
    player.managerSearching =
        false;
    player.managerSearchCooldown =
        0;
    /*
       Próxima busca somente depois
       do descanso + espera realista.
    */
    player.managerNextSearchWeek =
        Number(
            player.week || 0
        ) +
        MANAGER_CONFIG.postFightRestWeeks +
        managerRandomInt(
            MANAGER_CONFIG.minSearchWaitWeeks,
            MANAGER_CONFIG.maxSearchWaitWeeks
        );
    if (
        Array.isArray(
            player.log
        )
    ) {
        player.log.unshift(
            `🛌 Descanso pós-luta iniciado. Você terá ${MANAGER_CONFIG.postFightRestWeeks} semanas de recuperação.`
        );
        player.log.unshift(
            "📋 O empresário encerrou o processo desta luta."
        );
    }
    managerSave();
}
/* =========================================================
   CANCELAR LUTA
========================================================= */
function cancelManagerFight(reason) {
    const player =
        managerPlayer();
    if (!player) {
        return false;
    }
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
    player.managerOfferPending =
        false;
    player.managerOffers =
        [];
    player.managerSearchCooldown =
        0;
    player.managerNextSearchWeek =
        Number(
            player.week || 0
        ) +
        managerRandomInt(
            2,
            4
        );
    if (
        Array.isArray(
            player.log
        )
    ) {
        player.log.unshift(
            `⚠️ A luta contra ${opponent} foi cancelada${reason ? `: ${reason}` : "."}`
        );
    }
    managerSave();
    return true;
}
/* =========================================================
   PROFISSIONALIZAÇÃO
========================================================= */
function managerCanAskProfessional() {
    const player =
        managerPlayer();
    if (!player) {
        return false;
    }
    ensureManagerData();
    if (
        !managerIsAmateur()
    ) {
        return false;
    }
    if (
        Number(
            player.age || 0
        ) <
        MANAGER_CONFIG.professionalMinAge
    ) {
        return false;
    }
    if (
        !hasManager()
    ) {
        return false;
    }
    if (
        player.professionalDecisionMade ===
        true
    ) {
        return false;
    }
    if (
        player.professionalDecisionPending ===
        true
    ) {
        return false;
    }
    return true;
}
/* =========================================================
   PERGUNTAR PROFISSIONALIZAÇÃO
========================================================= */
function askProfessionalTransition() {
    const player =
        managerPlayer();
    if (!player) {
        return false;
    }
    ensureManagerData();
    if (
        !managerCanAskProfessional()
    ) {
        return false;
    }
    player.professionalDecisionPending =
        true;
    if (
        Array.isArray(
            player.log
        )
    ) {
        player.log.unshift(
            "💼 Seu empresário quer conversar sobre sua carreira."
        );
        player.log.unshift(
            "🥊 Você já está pronto para considerar uma carreira profissional."
        );
    }
    managerSave();
    /*
       Mantido como fallback para a versão atual.
       Posteriormente a interface poderá substituir
       este confirm por uma tela própria.
    */
    try {
        const answer =
            confirm(
                "Seu empresário acredita que você está pronto para se tornar profissional.\n\nDeseja migrar para o MMA profissional?"
            );
        if (
            answer
        ) {
            acceptProfessionalTransition();
        }
        else {
            declineProfessionalTransition();
        }
    }
    catch (error) {
        console.warn(
            "Pergunta de profissionalização não pôde ser exibida.",
            error
        );
    }
    return true;
}
/* =========================================================
   ACEITAR PROFISSIONAL
========================================================= */
function acceptProfessionalTransition() {
    const player =
        managerPlayer();
    if (!player) {
        return false;
    }
    ensureManagerData();
    player.careerStage =
        "professional";
    player.professionalDecisionPending =
        false;
    player.professionalDecisionMade =
        true;
    player.professionalDecisionWeek =
        Number(
            player.week || 0
        );
    if (
        !player.professional
    ) {
        player.professional = {};
    }
    player.professional.active =
        true;
    if (
        typeof player.professional.wins !==
        "number"
    ) {
        player.professional.wins =
            0;
    }
    if (
        typeof player.professional.losses !==
        "number"
    ) {
        player.professional.losses =
            0;
    }
    if (
        typeof player.professional.draws !==
        "number"
    ) {
        player.professional.draws =
            0;
    }
    if (
        Array.isArray(
            player.log
        )
    ) {
        player.log.unshift(
            "🥊 PARABÉNS! Você se tornou um atleta profissional."
        );
        player.log.unshift(
            "💼 Seu empresário começará a buscar oportunidades profissionais."
        );
    }
    player.managerNextSearchWeek =
        Number(
            player.week || 0
        ) +
        managerRandomInt(
            1,
            3
        );
    managerSave();
    try {
        if (
            typeof window.home ===
            "function"
        ) {
            window.home();
        }
    }
    catch (error) {}
    return true;
}
/* =========================================================
   RECUSAR PROFISSIONAL
========================================================= */
function declineProfessionalTransition() {
    const player =
        managerPlayer();
    if (!player) {
        return false;
    }
    ensureManagerData();
    player.professionalDecisionPending =
        false;
    player.professionalDecisionMade =
        true;
    player.professionalDecisionWeek =
        Number(
            player.week || 0
        );
    if (
        Array.isArray(
            player.log
        )
    ) {
        player.log.unshift(
            "🥊 Você decidiu continuar no MMA amador por enquanto."
        );
    }
    managerSave();
    return true;
}
/* =========================================================
   PROCESSAR PROFISSIONALIZAÇÃO
========================================================= */
function processManagerProfessionalTransition() {
    const player =
        managerPlayer();
    if (!player) {
        return false;
    }
    ensureManagerData();
    if (
        !managerCanAskProfessional()
    ) {
        return false;
    }
    return askProfessionalTransition();
}
/* =========================================================
   EMPRESÁRIOS DISPONÍVEIS
========================================================= */
function getAvailableManagers() {
    return [
        {
            id:
                "manager_1",
            name:
                "Carlos Mendes",
            reputation:
                60,
            experience:
                50,
            negotiation:
                55,
            network:
                50,
            description:
                "Empresário equilibrado, bom para atletas iniciantes."
        },
        {
            id:
                "manager_2",
            name:
                "Ricardo Alves",
            reputation:
                75,
            experience:
                70,
            negotiation:
                65,
            network:
                70,
            description:
                "Empresário experiente com boa rede nacional."
        },
        {
            id:
                "manager_3",
            name:
                "Marcos Oliveira",
            reputation:
                85,
            experience:
                85,
            negotiation:
                80,
            network:
                85,
            description:
                "Empresário de alto nível, focado em grandes organizações."
        },
        {
            id:
                "manager_4",
            name:
                "Fernando Costa",
            reputation:
                55,
            experience:
                40,
            negotiation:
                70,
            network:
                45,
            description:
                "Bom negociador, ideal para quem quer melhorar as bolsas."
        }
    ];
}
/* =========================================================
   CONTRATAR
========================================================= */
function hireManager(managerId) {
    const player =
        managerPlayer();
    if (!player) {
        return false;
    }
    ensureManagerData();
    const managers =
        getAvailableManagers();
    const selected =
        managers.find(
            function(manager) {
                return (
                    manager.id ===
                    managerId
                );
            }
        );
    if (
        !selected
    ) {
        alert(
            "Empresário não encontrado."
        );
        return false;
    }
    player.manager = {
        id:
            selected.id,
        active:
            true,
        name:
            selected.name,
        reputation:
            selected.reputation,
        experience:
            selected.experience,
        negotiation:
            selected.negotiation,
        network:
            selected.network
    };
    player.managerFightOffer =
        null;
    player.managerOffers =
        [];
    player.managerOfferPending =
        false;
    player.managerSearching =
        false;
    player.managerSearchCooldown =
        0;
    const currentWeek =
        Number(
            player.week || 0
        );
    player.managerNextSearchWeek =
        currentWeek +
        managerRandomInt(
            1,
            3
        );
    if (
        Array.isArray(
            player.log
        )
    ) {
        player.log.unshift(
            `💼 Você contratou o empresário ${selected.name}.`
        );
        player.log.unshift(
            "📅 Seu novo empresário começará a procurar oportunidades nas próximas semanas."
        );
    }
    managerSave();
    try {
        if (
            typeof window.home ===
            "function"
        ) {
            window.home();
        }
    }
    catch (error) {}
    return true;
}
/* =========================================================
   DEMITIR
========================================================= */
function fireManager() {
    const player =
        managerPlayer();
    if (!player) {
        return false;
    }
    ensureManagerData();
    if (
        !hasManager()
    ) {
        return false;
    }
    const managerName =
        player.manager.name ||
        "seu empresário";
    player.manager =
        null;
    player.managerFightOffer =
        null;
    player.managerOffers =
        [];
    player.managerOfferPending =
        false;
    player.managerSearching =
        false;
    player.managerSearchCooldown =
        0;
    player.managerNextSearchWeek =
        0;
    if (
        Array.isArray(
            player.log
        )
    ) {
        player.log.unshift(
            `💼 Você encerrou o contrato com ${managerName}.`
        );
        player.log.unshift(
            "🔎 Agora você precisa procurar outro empresário."
        );
    }
    managerSave();
    try {
        if (
            typeof window.home ===
            "function"
        ) {
            window.home();
        }
    }
    catch (error) {}
    return true;
}
/* =========================================================
   TESTE
========================================================= */
function createManagerTestOffer() {
    const player =
        managerPlayer();
    if (!player) {
        return false;
    }
    ensureManagerData();
    if (
        !hasManager()
    ) {
        return false;
    }
    if (
        player.nextFight
    ) {
        return false;
    }
    if (
        player.postFightRestActive
    ) {
        return false;
    }
    const offer =
        generateManagerFightOffer();
    if (
        !offer
    ) {
        return false;
    }
    player.managerFightOffer =
        offer;
    player.managerOfferPending =
        true;
    player.managerOffers =
        [];
    managerSave();
    return true;
}
/* =========================================================
   FORÇAR OFERTA
========================================================= */
function forceManagerFightOffer() {
    const player =
        managerPlayer();
    if (!player) {
        return false;
    }
    ensureManagerData();
    if (
        !hasManager()
    ) {
        return false;
    }
    if (
        player.nextFight
    ) {
        return false;
    }
    if (
        player.postFightRestActive
    ) {
        return false;
    }
    const offer =
        generateManagerFightOffer();
    if (
        !offer
    ) {
        return false;
    }
    player.managerFightOffer =
        offer;
    player.managerOfferPending =
        true;
    player.managerOffers =
        [];
    managerSave();
    return offer;
}
/* =========================================================
   GETTERS
========================================================= */
function getManagerFightOffer() {
    const player =
        managerPlayer();
    if (!player) {
        return null;
    }
    ensureManagerData();
    return (
        player.managerFightOffer ||
        null
    );
}
function getManagerCurrentFight() {
    const player =
        managerPlayer();
    if (!player) {
        return null;
    }
    return (
        player.nextFight ||
        null
    );
}
function getManagerPostFightRest() {
    const player =
        managerPlayer();
    if (!player) {
        return {
            active:
                false,
            weeksRemaining:
                0
        };
    }
    ensureManagerData();
    return {
        active:
            player.postFightRestActive === true,
        weeksRemaining:
            Number(
                player.postFightRestWeeks || 0
            )
    };
}
/* =========================================================
   PROCESSAR ANO
========================================================= */
function processManagerContractYear() {
    const player =
        managerPlayer();
    if (!player) {
        return;
    }
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
   INICIALIZAÇÃO
========================================================= */
function initializeManagers() {
    try {
        ensureManagerData();
    }
    catch (error) {
        console.error(
            "MANAGERS.JS: erro na inicialização.",
            error
        );
    }
}
/* =========================================================
   EXPORTAR
========================================================= */
window.ensureManagerData =
    ensureManagerData;
window.hasManager =
    hasManager;
window.getAvailableManagers =
    getAvailableManagers;
window.hireManager =
    hireManager;
window.fireManager =
    fireManager;
window.isInFightCamp =
    isInFightCamp;
window.managerIsFightDay =
    managerIsFightDay;
window.managerCanSearchFight =
    managerCanSearchFight;
window.managerCanFightNow =
    managerCanFightNow;
window.managerShouldBlockWeekAdvance =
    managerShouldBlockWeekAdvance;
window.processManagerFightOffer =
    processManagerFightOffer;
window.processManagerCampWeek =
    processManagerCampWeek;
window.processManagerPostFightRest =
    processManagerPostFightRest;
window.processManagerWeek =
    processManagerWeek;
window.acceptManagerFightOffer =
    acceptManagerFightOffer;
window.declineManagerFightOffer =
    declineManagerFightOffer;
window.negotiateManagerFightOffer =
    negotiateManagerFightOffer;
window.processManagerContractYear =
    processManagerContractYear;
window.completeManagerFight =
    completeManagerFight;
window.cancelManagerFight =
    cancelManagerFight;
window.createManagerTestOffer =
    createManagerTestOffer;
window.forceManagerFightOffer =
    forceManagerFightOffer;
window.getManagerFightOffer =
    getManagerFightOffer;
window.getManagerCurrentFight =
    getManagerCurrentFight;
window.getManagerPostFightRest =
    getManagerPostFightRest;
window.generateManagerOpponent =
    generateManagerOpponent;
window.generateManagerEvent =
    generateManagerEvent;
window.generateManagerFightOffer =
    generateManagerFightOffer;
window.calculateManagerPurse =
    calculateManagerPurse;
window.calculateManagerWinBonus =
    calculateManagerWinBonus;
window.calculateWorldPurse =
    calculateWorldPurse;
window.calculateElitePurse =
    calculateElitePurse;
window.createNegotiationData =
    createNegotiationData;
window.managerCanAskProfessional =
    managerCanAskProfessional;
window.askProfessionalTransition =
    askProfessionalTransition;
window.acceptProfessionalTransition =
    acceptProfessionalTransition;
window.declineProfessionalTransition =
    declineProfessionalTransition;
window.processManagerProfessionalTransition =
    processManagerProfessionalTransition;
/* =========================================================
   DOM
========================================================= */
if (
    typeof document !==
    "undefined"
) {
    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initializeManagers
        );
    }
    else {
        initializeManagers();
    }
}
/* =========================================================
   FIM DO MANAGERS.JS
========================================================= */
