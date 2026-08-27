/* =========================================================
   MMA LIFE DYNASTY
   MANAGERS.JS
   SISTEMA DE EMPRESÁRIO
   VERSÃO ATUALIZADA
   REGRAS:
   - ATLETA COMEÇA SEM EMPRESÁRIO
   - PRECISA CONTRATAR EMPRESÁRIO
   - AMADOR: MÁXIMO 5 LUTAS POR ANO
   - LUTAS AMADORAS RESPEITAM CAMP + DESCANSO
   - AOS 18 ANOS: EMPRESÁRIO PODE OFERECER MIGRAÇÃO
     PARA O PROFISSIONAL
   - PROFISSIONAL: RITMO REALISTA DE 2-4 LUTAS/ANO
   - NUNCA GERAR LUTA AUTOMATICAMENTE APÓS O DESCANSO
   - EMPRESÁRIO PRECISA PROCURAR UMA OPORTUNIDADE
   - TROCA DE EMPRESÁRIO NÃO QUEBRA O ADVERSÁRIO
========================================================= */
/* =========================================================
   CONFIGURAÇÕES
========================================================= */
const MANAGER_CONFIG = {
    /* CAMP */
    minCampWeeks: 4,
    maxCampWeeks: 8,
    /* DESCANSO */
    postFightRestWeeks: 3,
    /* TEMPO MÍNIMO ENTRE BUSCAS */
    searchCooldownWeeks: 2,
    /* CHANCE DE ENCONTRAR LUTA */
    offerChance: 0.35,
    /* PRIMEIRA SEMANA EM QUE PODE PROCURAR */
    firstFightWeek: 1,
    /* LIMITE AMADOR */
    amateurMaxFightsPerYear: 5,
    /* MÍNIMO DE LUTAS AMADORAS ANTES DO PROFISSIONAL */
    amateurMinimumFightsBeforePro: 5,
    /* IDADE MÍNIMA PARA PROFISSIONAL */
    professionalAge: 18,
    /* INTERVALO REALISTA PROFISSIONAL */
    professionalMinWeeksBetweenFights: 8,
    professionalMaxWeeksBetweenFights: 20,
    /* PROPOSTA DE MIGRAÇÃO */
    proOfferChance: 0.70,
    /* OFERTA NÃO FICA ETERNA */
    maxOfferAge: 2,
    /* CONTRATOS */
    minContractFights: 3,
    maxContractFights: 5
};
/* =========================================================
   EVENTOS
========================================================= */
const MANAGER_EVENTS = [
    /* =========================
       AMADOR
    ========================= */
    {
        name: "MMA Fight Night",
        category: "amateur",
        type: "amateur",
        prestige: 20,
        basePurse: 0,
        winBonus: 0,
        minContract: 1,
        maxContract: 1,
        negotiable: false,
        ppv: false,
        elite: false
    },
    {
        name: "Brazil Combat Amateur",
        category: "amateur",
        type: "amateur",
        prestige: 25,
        basePurse: 0,
        winBonus: 0,
        minContract: 1,
        maxContract: 1,
        negotiable: false,
        ppv: false,
        elite: false
    },
    {
        name: "Future Fighters",
        category: "amateur",
        type: "amateur",
        prestige: 30,
        basePurse: 0,
        winBonus: 0,
        minContract: 1,
        maxContract: 1,
        negotiable: false,
        ppv: false,
        elite: false
    },
    {
        name: "National Amateur Championship",
        category: "amateur",
        type: "amateur",
        prestige: 40,
        basePurse: 0,
        winBonus: 0,
        minContract: 1,
        maxContract: 1,
        negotiable: false,
        ppv: false,
        elite: false
    },
    /* =========================
       REGIONAL PROFISSIONAL
    ========================= */
    {
        name: "MMA Fight Night",
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
    {
        name: "Brazil Combat",
        category: "regional",
        type: "regional",
        prestige: 45,
        basePurse: 300,
        winBonus: 300,
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
        prestige: 50,
        basePurse: 400,
        winBonus: 400,
        minContract: 3,
        maxContract: 5,
        negotiable: false,
        ppv: false,
        elite: false
    },
    /* =========================
       NACIONAL
    ========================= */
    {
        name: "Warriors Championship",
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
        name: "Combat Warriors",
        category: "national",
        type: "national",
        prestige: 65,
        basePurse: 1500,
        winBonus: 1500,
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
        prestige: 70,
        basePurse: 2000,
        winBonus: 2000,
        minContract: 3,
        maxContract: 5,
        negotiable: false,
        ppv: false,
        elite: false
    },
    /* =========================
       MUNDIAL
    ========================= */
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
    /* =========================
       ELITE
    ========================= */
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
   UTILIDADE
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
    } catch (error) {
        console.warn(
            "Erro ao salvar:",
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
        (max - min)
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
   ESTRUTURA DO EMPRESÁRIO
========================================================= */
function ensureManagerData() {
    const player =
        managerPlayer();
    /*
       IMPORTANTE:
       NÃO CRIAMOS MAIS EMPRESÁRIO AUTOMATICAMENTE.
       O jogador começa sem empresário.
    */
    if (
        !player.manager
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
    /*
       CONTROLE DE LUTAS DO ANO
    */
    if (
        typeof player.managerYearFightCount !==
        "number"
    ) {
        player.managerYearFightCount = 0;
    }
    if (
        typeof player.managerFightCountYear !==
        "number"
    ) {
        player.managerFightCountYear =
            Number(
                player.year || 2026
            );
    }
    /*
       ÚLTIMA SEMANA EM QUE O ATLETA LUTOU
    */
    if (
        typeof player.managerLastFightWeek !==
        "number"
    ) {
        player.managerLastFightWeek = -999;
    }
    /*
       MIGRAÇÃO PROFISSIONAL
    */
    if (
        typeof player.managerProTransitionOffer !==
        "boolean"
    ) {
        player.managerProTransitionOffer =
            false;
    }
    if (
        typeof player.managerProTransitionAsked !==
        "boolean"
    ) {
        player.managerProTransitionAsked =
            false;
    }
}
/* =========================================================
   VERIFICAR SE É AMADOR
========================================================= */
function managerIsAmateur() {
    const player =
        managerPlayer();
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
    if (
        Number(player.age || 15) >=
        MANAGER_CONFIG.professionalAge &&
        player.careerStage ===
        "professional"
    ) {
        return false;
    }
    return true;
}
/* =========================================================
   GARANTIR ESTRUTURA PROFISSIONAL
========================================================= */
function ensureProfessionalStructure() {
    const player =
        managerPlayer();
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
        player.professional.wins = 0;
    }
    if (
        typeof player.professional.losses !==
        "number"
    ) {
        player.professional.losses = 0;
    }
    if (
        typeof player.professional.draws !==
        "number"
    ) {
        player.professional.draws = 0;
    }
}
/* =========================================================
   MIGRAR PARA PROFISSIONAL
========================================================= */
function acceptProfessionalTransition() {
    const player =
        managerPlayer();
    ensureManagerData();
    if (
        Number(player.age || 0) <
        MANAGER_CONFIG.professionalAge
    ) {
        alert(
            "Você ainda não tem 18 anos."
        );
        return false;
    }
    if (
        !managerIsAmateur()
    ) {
        return false;
    }
    ensureProfessionalStructure();
    player.careerStage =
        "professional";
    player.managerProTransitionOffer =
        false;
    player.managerProTransitionAsked =
        true;
    player.managerYearFightCount =
        0;
    player.managerFightCountYear =
        Number(
            player.year || 2026
        );
    if (
        Array.isArray(
            player.log
        )
    ) {
        player.log.unshift(
            "🥊 Você decidiu iniciar sua carreira profissional no MMA!"
        );
        player.log.unshift(
            "📋 Seu empresário agora buscará oportunidades profissionais."
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
    } catch (error) {}
    return true;
}
/* =========================================================
   RECUSAR PROFISSIONAL
========================================================= */
function declineProfessionalTransition() {
    const player =
        managerPlayer();
    ensureManagerData();
    player.managerProTransitionOffer =
        false;
    player.managerProTransitionAsked =
        true;
    if (
        Array.isArray(
            player.log
        )
    ) {
        player.log.unshift(
            "🥊 Você decidiu continuar lutando como amador por enquanto."
        );
    }
    managerSave();
    return true;
}
/* =========================================================
   VERIFICAR TRANSIÇÃO
========================================================= */
function checkProfessionalTransition() {
    const player =
        managerPlayer();
    ensureManagerData();
    if (
        !player.manager
    ) {
        return false;
    }
    if (
        !managerIsAmateur()
    ) {
        return false;
    }
    if (
        Number(player.age || 0) <
        MANAGER_CONFIG.professionalAge
    ) {
        return false;
    }
    if (
        player.managerProTransitionAsked ===
        true
    ) {
        return false;
    }
    const amateurFights =
        Number(
            player.managerTotalAmateurFights ||
            0
        );
    if (
        amateurFights <
        MANAGER_CONFIG.amateurMinimumFightsBeforePro
    ) {
        return false;
    }
    if (
        Math.random() >
        MANAGER_CONFIG.proOfferChance
    ) {
        return false;
    }
    player.managerProTransitionOffer =
        true;
    player.managerProTransitionAsked =
        true;
    if (
        Array.isArray(
            player.log
        )
    ) {
        player.log.unshift(
            "📋 Seu empresário quer conversar sobre sua passagem para o MMA profissional."
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
    } catch (error) {}
    return true;
}
/* =========================================================
   OVERALL
========================================================= */
function managerGetPlayerOverall() {
    const player =
        managerPlayer();
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
    } catch (error) {}
    const overall =
        Number(
            player.overall || 45
        );
    return (
        Number.isFinite(overall) &&
        overall > 0
    )
        ? overall
        : 45;
}
/* =========================================================
   ADVERSÁRIO
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
            player.country ||
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
    const player =
        managerPlayer();
    const amateur =
        managerIsAmateur();
    let availableEvents =
        MANAGER_EVENTS.filter(
            function(event) {
                if (
                    amateur
                ) {
                    return (
                        event.category ===
                        "amateur"
                    );
                }
                return (
                    event.category !==
                    "amateur"
                );
            }
        );
    const overall =
        managerGetPlayerOverall();
    if (
        !amateur
    ) {
        if (
            overall < 50
        ) {
            availableEvents =
                availableEvents.filter(
                    event =>
                        event.category ===
                        "regional"
                );
        }
        else if (
            overall < 65
        ) {
            availableEvents =
                availableEvents.filter(
                    event =>
                        event.category ===
                        "regional" ||
                        event.category ===
                        "national"
                );
        }
        else if (
            overall < 75
        ) {
            availableEvents =
                availableEvents.filter(
                    event =>
                        event.category ===
                        "regional" ||
                        event.category ===
                        "national" ||
                        event.category ===
                        "world"
                );
        }
    }
    if (
        availableEvents.length ===
        0
    ) {
        availableEvents =
            MANAGER_EVENTS.filter(
                event =>
                    amateur
                    ?
                    event.category ===
                    "amateur"
                    :
                    event.category ===
                    "regional"
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
function calculateManagerPurse(event) {
    const player =
        managerPlayer();
    if (
        managerIsAmateur()
    ) {
        return 0;
    }
    if (
        !event
    ) {
        return 200;
    }
    if (
        event.category ===
        "regional"
    ) {
        return event.basePurse || 200;
    }
    if (
        event.category ===
        "national"
    ) {
        return event.basePurse || 1000;
    }
    if (
        event.category ===
        "world"
    ) {
        return event.basePurse || 8000;
    }
    if (
        event.category ===
        "elite"
    ) {
        return event.basePurse || 12000;
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
        event.category ===
        "regional" ||
        event.category ===
        "national"
    ) {
        return {
            available: false,
            currentPurse:
                purse,
            minimum:
                purse,
            maximum:
                purse,
            successChance:
                100,
            ppvAvailable:
                false,
            ppv:
                0
        };
    }
    const minimum =
        Number(purse);
    const maximum =
        Math.min(
            1000000,
            Math.max(
                minimum,
                minimum * 2
            )
        );
    const requested =
        Math.round(
            managerRandom(
                minimum,
                maximum
            )
        );
    const successChance =
        managerClamp(
            Math.round(
                80 +
                Number(
                    player.manager?.negotiation ||
                    50
                ) * 0.10
            ),
            10,
            90
        );
    const ppv =
        Number(
            managerRandom(
                1,
                10
            ).toFixed(1)
        );
    return {
        available:
            true,
        currentPurse:
            purse,
        minimum:
            minimum,
        maximum:
            maximum,
        requested:
            requested,
        successChance:
            successChance,
        ppvAvailable:
            true,
        ppv:
            ppv
    };
}
/* =========================================================
   GERAR OFERTA
========================================================= */
function generateManagerFightOffer() {
    const player =
        managerPlayer();
    ensureManagerData();
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
        amateur
        ?
        1
        :
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
            successChance: 100,
            ppvAvailable: false,
            ppv: 0
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
   CONTROLE DE LUTAS DO ANO
========================================================= */
function resetManagerYearCounterIfNeeded() {
    const player =
        managerPlayer();
    const currentYear =
        Number(
            player.year || 2026
        );
    if (
        Number(
            player.managerFightCountYear
        ) !==
        currentYear
    ) {
        player.managerFightCountYear =
            currentYear;
        player.managerYearFightCount =
            0;
    }
}
/* =========================================================
   CONTAR LUTA
========================================================= */
function managerRegisterFightForYear() {
    const player =
        managerPlayer();
    resetManagerYearCounterIfNeeded();
    player.managerYearFightCount =
        Number(
            player.managerYearFightCount ||
            0
        ) + 1;
    player.managerLastFightWeek =
        Number(
            player.week || 0
        );
    if (
        managerIsAmateur()
    ) {
        player.managerTotalAmateurFights =
            Number(
                player.managerTotalAmateurFights ||
                0
            ) + 1;
    }
}
/* =========================================================
   PODE PROCURAR LUTA?
========================================================= */
function managerCanSearchFight() {
    const player =
        managerPlayer();
    ensureManagerData();
    resetManagerYearCounterIfNeeded();
    /*
       SEM EMPRESÁRIO = NÃO HÁ PROPOSTA
    */
    if (
        !player.manager
    ) {
        return false;
    }
    /*
       TRANSIÇÃO PENDENTE
    */
    if (
        player.managerProTransitionOffer
    ) {
        return false;
    }
    /*
       DESCANSO
    */
    if (
        player.postFightRestActive ===
        true &&
        Number(
            player.postFightRestWeeks ||
            0
        ) > 0
    ) {
        return false;
    }
    /*
       JÁ TEM LUTA
    */
    if (
        player.nextFight
    ) {
        return false;
    }
    /*
       JÁ TEM OFERTA
    */
    if (
        player.managerFightOffer
    ) {
        return false;
    }
    /*
       LIMITE ANUAL AMADOR
    */
    if (
        managerIsAmateur() &&
        Number(
            player.managerYearFightCount ||
            0
        ) >=
        MANAGER_CONFIG.amateurMaxFightsPerYear
    ) {
        return false;
    }
    /*
       COOLDOWN
    */
    if (
        Number(
            player.managerSearchCooldown ||
            0
        ) > 0
    ) {
        return false;
    }
    /*
       DISTÂNCIA MÍNIMA ENTRE LUTAS
    */
    const currentWeek =
        Number(
            player.week || 0
        );
    const lastFightWeek =
        Number(
            player.managerLastFightWeek ||
            -999
        );
    if (
        currentWeek -
        lastFightWeek <
        MANAGER_CONFIG.professionalMinWeeksBetweenFights &&
        lastFightWeek > -900
    ) {
        /*
           Para amador usamos uma distância
           menor, mas ainda realista.
        */
        const minimumAmateurGap =
            5;
        if (
            managerIsAmateur()
        ) {
            if (
                currentWeek -
                lastFightWeek <
                minimumAmateurGap
            ) {
                return false;
            }
        }
        else {
            return false;
        }
    }
    return true;
}
/* =========================================================
   PROCESSAR OFERTA
========================================================= */
function processManagerFightOffer() {
    const player =
        managerPlayer();
    ensureManagerData();
    resetManagerYearCounterIfNeeded();
    /*
       SEM EMPRESÁRIO
    */
    if (
        !player.manager
    ) {
        return null;
    }
    /*
       TRANSIÇÃO
    */
    if (
        player.managerProTransitionOffer
    ) {
        return null;
    }
    /*
       DESCANSO
    */
    if (
        player.postFightRestActive ===
        true &&
        Number(
            player.postFightRestWeeks ||
            0
        ) > 0
    ) {
        return null;
    }
    /*
       LUTA EXISTENTE
    */
    if (
        player.nextFight
    ) {
        return null;
    }
    /*
       OFERTA EXISTENTE
    */
    if (
        player.managerFightOffer
    ) {
        return player.managerFightOffer;
    }
    /*
       NÃO PODE PROCURAR
    */
    if (
        !managerCanSearchFight()
    ) {
        return null;
    }
    const currentWeek =
        Number(
            player.week || 0
        );
    /*
       NÃO PROCURAR DUAS VEZES
       NA MESMA SEMANA
    */
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
    /*
       CHANCE DE OFERTA
    */
    if (
        Math.random() >
        MANAGER_CONFIG.offerChance
    ) {
        player.managerSearchCooldown =
            MANAGER_CONFIG.searchCooldownWeeks;
        managerSave();
        return null;
    }
    const offer =
        generateManagerFightOffer();
    if (
        !offer ||
        !offer.opponent
    ) {
        console.error(
            "Erro ao gerar oferta."
        );
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
                `📩 Seu empresário encontrou uma luta amadora contra ${offer.opponentName} no ${offer.eventName}.`
            );
        }
        else {
            player.log.unshift(
                `📩 Seu empresário encontrou uma luta profissional contra ${offer.opponentName} no ${offer.eventName}. Bolsa: $${Number(offer.purse || 0).toLocaleString("en-US")}.`
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
    } catch (error) {}
    return offer;
}
/* =========================================================
   ACEITAR OFERTA
========================================================= */
function acceptManagerFightOffer() {
    const player =
        managerPlayer();
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
    /*
       SEGURANÇA CONTRA ERRO
       "ADVERSÁRIO NÃO ENCONTRADO"
    */
    if (
        !offer.opponent
    ) {
        offer.opponent =
            generateManagerOpponent();
        offer.opponentName =
            offer.opponent.name;
        offer.opponentDisplayName =
            offer.opponent.displayName;
        offer.opponentOverall =
            offer.opponent.overall;
        offer.opponentPower =
            offer.opponent.power;
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
        player.postFightRestActive ===
        true &&
        Number(
            player.postFightRestWeeks ||
            0
        ) > 0
    ) {
        alert(
            "Você ainda está se recuperando da última luta."
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
            player.week || 0
        );
    const fightWeek =
        currentWeek +
        campWeeks;
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
            offer.opponent,
        opponentName:
            offer.opponentName,
        opponentDisplayName:
            offer.opponentDisplayName,
        opponentOverall:
            Number(
                offer.opponentOverall ||
                45
            ),
        opponentPower:
            Number(
                offer.opponentPower ||
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
                0
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
        amateur:
            Boolean(
                offer.amateur
            ),
        ppvAvailable:
            Boolean(
                offer.ppvAvailable
            ),
        ppvPercentage:
            Number(
                offer.ppvPercentage ||
                0
            ),
        result:
            null,
        completed:
            false
    };
    /*
       REGISTRA A LUTA
    */
    managerRegisterFightForYear();
    /*
       CONTRATO
    */
    if (
        !offer.amateur &&
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
        player.managerContractFightNumber =
            0;
        player.managerContractTotalFights =
            Number(
                offer.contractFights ||
                1
            );
        player.managerContractEvent =
            offer.eventName;
        player.managerContractCategory =
            offer.eventCategory;
    }
    /*
       LIMPAR OFERTA
    */
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
        player.log.unshift(
            `🏋️ Camp de ${campWeeks} semanas iniciado. A luta será na semana ${fightWeek}.`
        );
        if (
            offer.amateur
        ) {
            player.log.unshift(
                "🥊 Luta amadora confirmada. Bolsa: $0."
            );
        }
        else {
            player.log.unshift(
                `💰 Bolsa: $${Number(offer.purse || 0).toLocaleString("en-US")} + bônus de vitória.`
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
    } catch (error) {}
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
        return false;
    }
    const opponent =
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
    player.managerSearchCooldown =
        2;
    if (
        Array.isArray(
            player.log
        )
    ) {
        player.log.unshift(
            `❌ Você recusou a luta contra ${opponent}.`
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
    } catch (error) {}
    return true;
}
/* =========================================================
   CAMP
========================================================= */
function isInFightCamp() {
    const player =
        managerPlayer();
    const fight =
        player.nextFight;
    if (
        !fight ||
        fight.completed === true
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
    const fight =
        player.nextFight;
    if (
        !fight
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
        fight.weeksRemaining <=
        0
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
    }
}
/* =========================================================
   DESCANSO
========================================================= */
function processManagerPostFightRest() {
    const player =
        managerPlayer();
    ensureManagerData();
    if (
        player.postFightRestActive !==
        true
    ) {
        return false;
    }
    const remaining =
        Number(
            player.postFightRestWeeks ||
            0
        );
    if (
        remaining <=
        0
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
        player.postFightRestWeeks <=
        0
    ) {
        player.postFightRestWeeks =
            0;
        player.postFightRestActive =
            false;
        /*
           IMPORTANTE:
           NÃO GERAR OFERTA AQUI.
           Apenas liberar o empresário
           para procurar novamente.
        */
        player.managerSearchCooldown =
            2;
        if (
            Array.isArray(
                player.log
            )
        ) {
            player.log.unshift(
                "🥊 Recuperação concluída. Seu empresário começará a procurar uma nova oportunidade."
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
    ensureManagerData();
    resetManagerYearCounterIfNeeded();
    /*
       SEM EMPRESÁRIO
    */
    if (
        !player.manager
    ) {
        return;
    }
    /*
       TRANSIÇÃO
    */
    if (
        player.managerProTransitionOffer
    ) {
        return;
    }
    /*
       DESCANSO
    */
    if (
        player.postFightRestActive ===
        true
    ) {
        processManagerPostFightRest();
        return;
    }
    /*
       CAMP
    */
    if (
        player.nextFight
    ) {
        processManagerCampWeek();
        managerSave();
        return;
    }
    /*
       OFERTA EXISTENTE
    */
    if (
        player.managerFightOffer
    ) {
        return;
    }
    /*
       AOS 18:
       VERIFICAR TRANSIÇÃO
    */
    if (
        checkProfessionalTransition()
    ) {
        return;
    }
    /*
       EMPRESÁRIO PROCURA
    */
    processManagerFightOffer();
    /*
       DIMINUIR COOLDOWN
    */
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
    }
    managerSave();
}
/* =========================================================
   BLOQUEIO DO BOTÃO AVANÇAR
========================================================= */
function managerShouldBlockWeekAdvance() {
    const player =
        managerPlayer();
    if (
        player.postFightRestActive ===
        true &&
        Number(
            player.postFightRestWeeks ||
            0
        ) > 0
    ) {
        return false;
    }
    if (
        !player.nextFight
    ) {
        return false;
    }
    return managerIsFightDay();
}
/* =========================================================
   PODE LUTAR
========================================================= */
function managerCanFightNow() {
    const player =
        managerPlayer();
    if (
        !player.nextFight
    ) {
        return false;
    }
    return managerIsFightDay();
}
/* =========================================================
   FINALIZAR LUTA
   CHAMADO PELO FIGHTS.JS
========================================================= */
function completeManagerFight(result) {
    const player =
        managerPlayer();
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
        result || null;
    /*
       CONTRATO PROFISSIONAL
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
    /*
       COOLDOWN
    */
    player.managerSearchCooldown =
        2;
    /*
       RESULTADO PROFISSIONAL
       CASO FIGHTS.JS NÃO TENHA
       ATUALIZADO A CARREIRA
    */
    if (
        !managerIsAmateur() &&
        result
    ) {
        const outcome =
            String(
                result.result ||
                result.outcome ||
                result.status ||
                ""
            ).toLowerCase();
        if (
            outcome === "win" ||
            outcome === "victory" ||
            outcome === "vitoria"
        ) {
            if (
                player.professional
            ) {
                player.professional.wins =
                    Number(
                        player.professional.wins ||
                        0
                    ) + 1;
            }
        }
        else if (
            outcome === "loss" ||
            outcome === "defeat" ||
            outcome === "derrota"
        ) {
            if (
                player.professional
            ) {
                player.professional.losses =
                    Number(
                        player.professional.losses ||
                        0
                    ) + 1;
            }
        }
    }
    if (
        Array.isArray(
            player.log
        )
    ) {
        player.log.unshift(
            `🛌 Descanso pós-luta iniciado. Você terá ${MANAGER_CONFIG.postFightRestWeeks} semanas de recuperação.`
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
        2;
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
   OFERTA DE TESTE
========================================================= */
function createManagerTestOffer() {
    const player =
        managerPlayer();
    ensureManagerData();
    if (
        !player.manager
    ) {
        return false;
    }
    if (
        player.nextFight ||
        player.managerFightOffer
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
    player.managerFightOffer =
        offer;
    player.managerOfferPending =
        true;
    managerSave();
    try {
        if (
            typeof window.home ===
            "function"
        ) {
            window.home();
        }
    } catch (error) {}
    return true;
}
/* =========================================================
   FORÇAR OFERTA
========================================================= */
function forceManagerFightOffer() {
    const player =
        managerPlayer();
    ensureManagerData();
    if (
        !player.manager
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
    managerSave();
    return offer;
}
/* =========================================================
   GET OFERTA
========================================================= */
function getManagerFightOffer() {
    const player =
        managerPlayer();
    ensureManagerData();
    return (
        player.managerFightOffer ||
        null
    );
}
/* =========================================================
   GET LUTA
========================================================= */
function getManagerCurrentFight() {
    const player =
        managerPlayer();
    return (
        player.nextFight ||
        null
    );
}
/* =========================================================
   GET DESCANSO
========================================================= */
function getManagerPostFightRest() {
    const player =
        managerPlayer();
    ensureManagerData();
    return {
        active:
            player.postFightRestActive ===
            true,
        weeksRemaining:
            Number(
                player.postFightRestWeeks ||
                0
            )
    };
}
/* =========================================================
   EMPRESÁRIO ATUAL
========================================================= */
function getCurrentManager() {
    const player =
        managerPlayer();
    ensureManagerData();
    return (
        player.manager ||
        null
    );
}
/* =========================================================
   CONTRATAR EMPRESÁRIO
========================================================= */
function hireManager(managerData) {
    const player =
        managerPlayer();
    ensureManagerData();
    if (
        player.manager
    ) {
        alert(
            "Você já possui um empresário."
        );
        return false;
    }
    const data =
        managerData ||
        {};
    player.manager = {
        active:
            true,
        name:
            data.name ||
            "Carlos Mendes",
        reputation:
            Number(
                data.reputation ||
                50
            ),
        experience:
            Number(
                data.experience ||
                50
            ),
        negotiation:
            Number(
                data.negotiation ||
                50
            ),
        network:
            Number(
                data.network ||
                50
            )
    };
    player.managerSearchCooldown =
        2;
    player.managerLastOfferWeek =
        -999;
    player.managerSearching =
        false;
    if (
        Array.isArray(
            player.log
        )
    ) {
        player.log.unshift(
            `🤝 Você contratou o empresário ${player.manager.name}.`
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
    } catch (error) {}
    return true;
}
/* =========================================================
   DEMITIR EMPRESÁRIO
========================================================= */
function fireManager() {
    const player =
        managerPlayer();
    ensureManagerData();
    if (
        !player.manager
    ) {
        return false;
    }
    if (
        player.nextFight
    ) {
        alert(
            "Você não pode trocar de empresário durante uma luta marcada."
        );
        return false;
    }
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
    if (
        Array.isArray(
            player.log
        )
    ) {
        player.log.unshift(
            "📋 Você encerrou o contrato com seu empresário."
        );
    }
    managerSave();
    return true;
}
/* =========================================================
   PROCESSAR ANO
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
    resetManagerYearCounterIfNeeded();
    managerSave();
}
/* =========================================================
   INICIALIZAÇÃO
========================================================= */
function initializeManagers() {
    ensureManagerData();
}
/* =========================================================
   EXPORTAR
========================================================= */
window.ensureManagerData =
    ensureManagerData;
window.managerIsAmateur =
    managerIsAmateur;
window.acceptProfessionalTransition =
    acceptProfessionalTransition;
window.declineProfessionalTransition =
    declineProfessionalTransition;
window.checkProfessionalTransition =
    checkProfessionalTransition;
window.ensureProfessionalStructure =
    ensureProfessionalStructure;
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
window.getCurrentManager =
    getCurrentManager;
window.hireManager =
    hireManager;
window.fireManager =
    fireManager;
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
window.createNegotiationData =
    createNegotiationData;
/* =========================================================
   INICIALIZAÇÃO
========================================================= */
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
/* =========================================================
   FIM DO MANAGERS.JS
========================================================= */
