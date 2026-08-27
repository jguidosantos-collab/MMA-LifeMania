/* =========================================================
   MMA LIFE DYNASTY
   MANAGERS.JS
   EMPRESÁRIO — SISTEMA COMPLETO
   VERSÃO DEFINITIVA

   FLUXO:

   JOGADOR SEM LUTA
          ↓
   EMPRESÁRIO PROCURA
          ↓
   PROPOSTA DE LUTA
          ↓
   BOLSA + BÔNUS
          ↓
   ACEITAR / RECUSAR
          ↓
   CAMP
          ↓
   SEMANAS DE PREPARAÇÃO
          ↓
   DIA DA LUTA
          ↓
   BOTÃO LUTAR AGORA
          ↓
   FIGHT.JS
          ↓
   RESULTADO
          ↓
   CONTRATO / HISTÓRICO
          ↓
   EMPRESÁRIO PROCURA NOVA OPORTUNIDADE


   CATEGORIAS:

   🟢 REGIONAL
   🔵 NACIONAL
   🟣 MUNDIAL
   🔴 ELITE
========================================================= */


/* =========================================================
   CONFIGURAÇÕES GERAIS
========================================================= */

const MANAGER_CONFIG = {

    minCampWeeks: 4,

    maxCampWeeks: 8,

    searchCooldownWeeks: 1,

    firstFightWeek: 1,

    offerChance: 0.85,

    maxOfferAge: 1,

    minContractFights: 3,

    maxContractFights: 5

};


/* =========================================================
   TABELA DE EVENTOS
========================================================= */

const MANAGER_EVENTS = [

    /* =====================================================
       🟢 REGIONAL
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
       🔵 NACIONAL
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
       🟣 MUNDIAL
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
       🔴 ELITE
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
   ESTADO GLOBAL
========================================================= */

window.mmaManager = null;


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
            "Erro ao salvar jogo:",
            error
        );

    }

}


/* =========================================================
   RANDOM
========================================================= */

function managerRandom(
    min,
    max
) {

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

function managerRandomInt(
    min,
    max
) {

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
   GARANTIR ESTRUTURA
========================================================= */

function ensureManagerData() {

    const player =
        managerPlayer();


    if (
        !player.manager
    ) {

        player.manager = {

            active: true,

            name: "Carlos Mendes",

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

}


/* =========================================================
   OVERALL DO JOGADOR
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

    }
    catch (error) {

        console.warn(
            "getOverall indisponível."
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
   GERAR ADVERSÁRIO
========================================================= */

function generateManagerOpponent() {

    const player =
        managerPlayer();


    const playerOverall =
        managerGetPlayerOverall();


    /*
       ADVERSÁRIO SEMPRE TEM OVERALL VÁLIDO.
    */

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


    /*
       NUNCA deixar o adversário
       com o mesmo nome do jogador.
    */

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


    /*
       SE O JOGADOR TEM CONTRATO
       MUNDIAL, NÃO PODE RECEBER ELITE
       ENQUANTO ESTIVER PRESO AO CONTRATO.
    */

    const contract =
        player.currentContract;


    let availableEvents =
        MANAGER_EVENTS.slice();


    if (
        contract &&
        contract.category === "world"
    ) {

        availableEvents =
            availableEvents.filter(
                function(event) {

                    return (
                        event.category !==
                        "elite"
                    );

                }
            );

    }


    /*
       SE ESTÁ EM CONTRATO NACIONAL,
       PODE receber regional ou nacional.
       Eventos mundiais/elite podem
       aparecer como oportunidade maior,
       permitindo quebra conforme regras.
    */


    /*
       PESOS POR PROGRESSÃO.
    */

    const overall =
        managerGetPlayerOverall();


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


    /*
       Nunca deixar sem evento.
    */

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


    /*
       Sorteio.
    */

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
   CALCULAR BOLSA REGIONAL
========================================================= */

function calculateRegionalPurse() {

    return 200;

}


/* =========================================================
   CALCULAR BOLSA NACIONAL
========================================================= */

function calculateNationalPurse() {

    return 1000;

}


/* =========================================================
   CALCULAR BOLSA MUNDIAL
========================================================= */

function calculateWorldPurse() {

    const player =
        managerPlayer();


    /*
       PRIMEIRO CONTRATO:
       $8.000
    */

    const fightNumber =
        Number(
            player.managerContractFightNumber ||
            0
        );


    const contractCategory =
        player.managerContractCategory;


    if (
        contractCategory !==
        "world"
    ) {

        return 8000;

    }


    /*
       Segundo contrato:
       começa em $10.000.
    */

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


    /*
       Terceiro contrato:
       pode passar de $80.000.
    */

    return managerClamp(

        Math.round(
            80000 +
            managerRandom(
                0,
                270000
            )
        ),

        80000,

        350000

    );

}


/* =========================================================
   CALCULAR BOLSA ELITE
========================================================= */

function calculateElitePurse(
    event
) {

    const player =
        managerPlayer();


    const fightNumber =
        Number(
            player.managerContractFightNumber ||
            0
        );


    /*
       UFC NORMAL
       PRIMEIRO CONTRATO
    */

    if (
        event.type ===
        "elite"
    ) {

        if (
            fightNumber <= 0
        ) {

            return 12000;

        }


        /*
           Segundo contrato:
           $12k até $25k.
        */

        if (
            fightNumber <= 3
        ) {

            return managerRandomInt(
                12000,
                25000
            );

        }


        /*
           Terceiro contrato:
           $200k+
        */

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


    /*
       UFC EVENTO GRANDE
    */

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


    /*
       DISPUTA DE TÍTULO
    */

    if (
        event.type ===
        "title"
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


    /*
       DEFESA
    */

    if (
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


/* =========================================================
   CALCULAR BOLSA PRINCIPAL
========================================================= */

function calculateManagerPurse(
    event
) {

    const player =
        managerPlayer();


    if (
        !event
    ) {

        return 200;

    }


    /*
       🟢 REGIONAL
    */

    if (
        event.category ===
        "regional"
    ) {

        return calculateRegionalPurse();

    }


    /*
       🔵 NACIONAL
    */

    if (
        event.category ===
        "national"
    ) {

        return calculateNationalPurse();

    }


    /*
       🟣 MUNDIAL
    */

    if (
        event.category ===
        "world"
    ) {

        return calculateWorldPurse();

    }


    /*
       🔴 ELITE
    */

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
   BÔNUS DE VITÓRIA
========================================================= */

function calculateManagerWinBonus(
    purse
) {

    const player =
        managerPlayer();


    /*
       AMADOR:
       NUNCA TEM BOLSA.
       NUNCA TEM BÔNUS.
    */

    if (
        player.careerStage ===
        "amateur"
    ) {

        return 0;

    }


    if (
        player.professional &&
        player.professional.active !== true
    ) {

        /*
           Ainda não profissional.
           Segurança.
        */

        return 0;

    }


    /*
       REGRA:
       BÔNUS = 100% DA BOLSA.
    */

    return Math.round(
        Number(purse || 0)
    );

}


/* =========================================================
   VERIFICAR SE É AMADOR
========================================================= */

function managerIsAmateur() {

    const player =
        managerPlayer();


    if (
        player.careerStage ===
        "amateur"
    ) {

        return true;

    }


    if (
        player.professional &&
        player.professional.active === true
    ) {

        return false;

    }


    /*
       Segurança:
       idade/carreira inicial.
    */

    if (
        Number(player.age || 15) < 18
    ) {

        return true;

    }


    return false;

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


    /*
       Regional e Nacional:
       NÃO negociáveis.
    */

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


    /*
       MUNDIAL
    */

    if (
        event.category ===
        "world"
    ) {

        const minimum =
            Number(purse);


        const maximum =
            Math.min(
                350000,
                minimum * 2
            );


        const requested =
            Math.round(
                managerRandom(
                    minimum,
                    maximum
                )
            );


        /*
           Quanto maior a bolsa,
           menor a chance.
        */

        const ratio =
            requested /
            Math.max(
                1,
                maximum
            );


        const successChance =
            managerClamp(
                Math.round(
                    90 -
                    ratio * 75 +
                    Number(
                        player.manager.negotiation ||
                        0
                    ) * 0.15
                ),
                10,
                90
            );


        const ppv =
            managerClamp(

                Number(
                    (
                        managerRandom(
                            1,
                            10
                        )
                    ).toFixed(1)
                ),

                1,

                10

            );


        return {

            available: true,

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
                ppv,

            negotiationType:
                "world"

        };

    }


    /*
       ELITE
    */

    if (
        event.category ===
        "elite"
    ) {

        const minimum =
            Number(purse);


        let maximum;


        if (
            event.type ===
            "elite" &&
            minimum < 200000
        ) {

            maximum =
                Math.max(
                    25000,
                    minimum * 2
                );

        }
        else {

            maximum =
                1000000;

        }


        const requested =
            Math.round(
                managerRandom(
                    minimum,
                    maximum
                )
            );


        /*
           Bolsa maior = menor chance.
        */

        const ratio =
            requested /
            Math.max(
                1,
                maximum
            );


        let successChance =
            90 -
            ratio * 80;


        /*
           Performance melhora negociação.
        */

        const performanceBonus =
            (
                Number(
                    player.professional?.wins ||
                    0
                ) >
                Number(
                    player.professional?.losses ||
                    0
                )
            )
            ?
            10
            :
            0;


        successChance +=
            performanceBonus;


        /*
           Empresário experiente ajuda.
        */

        successChance +=
            Number(
                player.manager.negotiation ||
                50
            ) * 0.10;


        successChance =
            managerClamp(
                Math.round(
                    successChance
                ),
                5,
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

            available: true,

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
                ppv,

            negotiationType:
                "elite"

        };

    }


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


/* =========================================================
   NEGOCIAR OFERTA
========================================================= */

function negotiateManagerFightOffer(
    requestedPurse,
    requestedPPV
) {

    const player =
        managerPlayer();


    ensureManagerData();


    const offer =
        player.managerFightOffer;


    if (
        !offer
    ) {

        alert(
            "Não existe uma proposta para negociar."
        );

        return false;

    }


    if (
        !offer.negotiable
    ) {

        alert(
            "Esta proposta não pode ser negociada."
        );

        return false;

    }


    const negotiation =
        offer.negotiation ||
        {};


    const purse =
        Number(
            requestedPurse ||
            negotiation.requested ||
            offer.purse
        );


    const ppv =
        Number(
            requestedPPV ||
            negotiation.ppv ||
            0
        );


    const minimum =
        Number(
            negotiation.minimum ||
            offer.purse
        );


    const maximum =
        Number(
            negotiation.maximum ||
            minimum
        );


    /*
       Não permitir valor menor
       ou maior que o limite.
    */

    const finalPurse =
        managerClamp(
            purse,
            minimum,
            maximum
        );


    let successChance =
        Number(
            negotiation.successChance ||
            50
        );


    /*
       Pedir mais reduz chance.
    */

    const ratio =
        finalPurse /
        Math.max(
            1,
            maximum
        );


    successChance -=
        Math.round(
            ratio * 25
        );


    /*
       PPV alto reduz chance.
    */

    if (
        ppv > 0
    ) {

        successChance -=
            Math.round(
                ppv * 2
            );

    }


    successChance =
        managerClamp(
            successChance,
            3,
            90
        );


    const roll =
        managerRandom(
            0,
            100
        );


    if (
        roll <=
        successChance
    ) {

        offer.purse =
            Math.round(
                finalPurse
            );

        offer.fightPurse =
            Math.round(
                finalPurse
            );

        offer.winBonus =
            Math.round(
                finalPurse
            );

        offer.totalWinPayout =
            Math.round(
                finalPurse * 2
            );


        offer.negotiation.accepted =
            true;

        offer.negotiation.finalPurse =
            Math.round(
                finalPurse
            );

        offer.negotiation.finalPPV =
            ppv;

        offer.negotiation.result =
            "accepted";


        offer.ppvPercentage =
            ppv;


        if (
            Array.isArray(
                player.log
            )
        ) {

            player.log.unshift(

                `💰 Negociação aceita! Bolsa: $${Math.round(finalPurse).toLocaleString("en-US")} + bônus de vitória.`

            );

        }


        managerSave();


        return {

            success: true,

            purse:
                finalPurse,

            ppv:
                ppv

        };

    }


    /*
       NEGOCIAÇÃO RECUSADA.
    */

    offer.negotiation.result =
        "rejected";


    if (
        Array.isArray(
            player.log
        )
    ) {

        player.log.unshift(

            "❌ O evento recusou a negociação."

        );

    }


    managerSave();


    return {

        success: false,

        purse:
            offer.purse,

        ppv:
            0

    };

}


/* =========================================================
   GERAR OFERTA
========================================================= */

function generateManagerFightOffer() {

    const player =
        managerPlayer();


    ensureManagerData();


    /*
       NÃO GERAR BOLSA PARA AMADOR.
       Mas o empresário ainda pode encontrar
       oportunidade de luta amadora.
    */

    const amateur =
        managerIsAmateur();


    const opponent =
        generateManagerOpponent();


    const event =
        generateManagerEvent();


    /*
       Se amador, bolsa = ZERO.
    */

    let purse =
        0;


    if (
        amateur
    ) {

        purse = 0;

    }
    else {

        purse =
            calculateManagerPurse(
                event
            );

    }


    /*
       Bônus.
    */

    let winBonus =
        0;


    if (
        !amateur
    ) {

        winBonus =
            calculateManagerWinBonus(
                purse
            );

    }


    /*
       CAMP.
    */

    const campWeeks =
        managerRandomInt(

            MANAGER_CONFIG.minCampWeeks,

            MANAGER_CONFIG.maxCampWeeks

        );


    /*
       CONTRATO.
    */

    const contractFights =
        managerRandomInt(

            event.minContract,

            event.maxContract

        );


    /*
       NEGOCIAÇÃO.
    */

    let negotiation;


    if (
        amateur
    ) {

        negotiation = {

            available: false,

            currentPurse: 0,

            minimum: 0,

            maximum: 0,

            successChance: 100,

            ppvAvailable: false,

            ppv: 0

        };

    }
    else {

        negotiation =
            createNegotiationData(
                purse,
                event
            );

    }


    const offer = {

        id:
            ++player.managerOfferId,

        type:
            "fight",

        status:
            "pending",


        /* =================================================
           DATA
        ================================================= */

        createdWeek:
            Number(
                player.week || 0
            ),

        createdYear:
            Number(
                player.year || 2026
            ),


        /* =================================================
           EVENTO
        ================================================= */

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


        event: {

            name:
                event.name,

            type:
                event.type,

            category:
                event.category,

            prestige:
                event.prestige,

            isBigEvent:
                Boolean(
                    event.isBigEvent
                )

        },


        /* =================================================
           ADVERSÁRIO
        ================================================= */

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


        /* =================================================
           FINANCEIRO
        ================================================= */

        purse:
            Number(
                purse
            ),

        fightPurse:
            Number(
                purse
            ),

        winBonus:
            Number(
                winBonus
            ),

        totalWinPayout:
            Number(
                purse +
                winBonus
            ),


        /* =================================================
           AMADOR
        ================================================= */

        amateur:
            amateur,

        amateurPurse:
            amateur
            ?
            0
            :
            null,

        amateurWinBonus:
            amateur
            ?
            0
            :
            null,


        /* =================================================
           CONTRATO
        ================================================= */

        contractFights:
            contractFights,

        contractRemaining:
            contractFights,


        /* =================================================
           CAMP
        ================================================= */

        campWeeks:
            campWeeks,

        minCampWeeks:
            MANAGER_CONFIG.minCampWeeks,

        maxCampWeeks:
            MANAGER_CONFIG.maxCampWeeks,


        /* =================================================
           NEGOCIAÇÃO
        ================================================= */

        negotiation:
            negotiation,

        negotiable:
            Boolean(
                negotiation.available
            ),


        /* =================================================
           PPV
        ================================================= */

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


        /* =================================================
           STATUS
        ================================================= */

        accepted:
            false,

        declined:
            false,

        expired:
            false,


        /* =================================================
           COMPATIBILIDADE
        ================================================= */

        fightWeek:
            null,

        weeksRemaining:
            campWeeks

    };


    return offer;

}


/* =========================================================
   EMPRESÁRIO PODE PROCURAR?
========================================================= */

function managerCanSearchFight() {

    const player =
        managerPlayer();


    ensureManagerData();


    /*
       SE JÁ TEM LUTA:
       NÃO.
    */

    if (
        player.nextFight
    ) {

        return false;

    }


    /*
       SE TEM PROPOSTA:
       NÃO.
    */

    if (
        player.managerFightOffer
    ) {

        return false;

    }


    /*
       SE EXISTE FILA:
       NÃO.
    */

    if (
        Array.isArray(
            player.managerOffers
        ) &&
        player.managerOffers.length > 0
    ) {

        return false;

    }


    /*
       COOLDOWN.
    */

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


    /*
       NÃO PROCURAR DURANTE CAMP.
    */

    if (
        player.nextFight
    ) {

        return null;

    }


    /*
       NÃO CRIAR SEGUNDA PROPOSTA.
    */

    if (
        player.managerFightOffer
    ) {

        return player.managerFightOffer;

    }


    /*
       FILA.
    */

    if (
        player.managerOffers.length > 0
    ) {

        player.managerFightOffer =
            player.managerOffers[0];

        player.managerOfferPending =
            true;

        managerSave();

        return player.managerFightOffer;

    }


    /*
       COOLDOWN.
    */

    if (
        Number(
            player.managerSearchCooldown ||
            0
        ) > 0
    ) {

        return null;

    }


    /*
       SEMANA ATUAL.
    */

    const currentWeek =
        Number(
            player.week || 0
        );


    /*
       NÃO GERAR DUAS PROPOSTAS
       NA MESMA SEMANA.
    */

    if (
        currentWeek ===
        Number(
            player.managerLastOfferWeek
        )
    ) {

        return null;

    }


    /*
       PRIMEIRA SEMANA.
    */

    if (
        currentWeek <
        MANAGER_CONFIG.firstFightWeek
    ) {

        return null;

    }


    /*
       CHANCE.
    */

    if (
        Math.random() >
        MANAGER_CONFIG.offerChance
    ) {

        player.managerLastOfferWeek =
            currentWeek;

        player.managerSearchCooldown =
            MANAGER_CONFIG.searchCooldownWeeks;

        managerSave();

        return null;

    }


    /*
       GERAR.
    */

    const offer =
        generateManagerFightOffer();


    /*
       SEGURANÇA:
       adversário obrigatório.
    */

    if (
        !offer ||
        !offer.opponent
    ) {

        console.error(
            "Falha ao gerar adversário."
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


    player.managerLastOfferWeek =
        currentWeek;


    player.managerOffers =
        [];


    /*
       LOG.
    */

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

                `📩 Seu empresário encontrou uma luta contra ${offer.opponentName} no ${offer.eventName}. Bolsa: $${Number(offer.purse || 0).toLocaleString("en-US")} + bônus de vitória de $${Number(offer.winBonus || 0).toLocaleString("en-US")}.`

            );

        }

    }


    managerSave();


    /*
       ATUALIZAR HOME SE EXISTIR.
    */

    try {

        if (
            typeof window.home ===
            "function"
        ) {

            window.home();

        }

    }
    catch (error) {

        console.warn(
            "Home não pôde ser atualizada."
        );

    }


    return offer;

}


/* =========================================================
   VERIFICAR CAMP
========================================================= */

function isInFightCamp() {

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
        fight.completed ===
        true
    ) {

        return false;

    }


    if (
        fight.status ===
        "camp"
    ) {

        return true;

    }


    if (
        fight.status ===
        "scheduled"
    ) {

        return true;

    }


    if (
        fight.status ===
        "fight_day"
    ) {

        return true;

    }


    if (
        typeof fight.fightWeek ===
        "number"
    ) {

        return (
            Number(
                player.week
            ) <=
            Number(
                fight.fightWeek
            )
        );

    }


    return false;

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
       SEGURANÇA:
       adversário obrigatório.
    */

    if (
        !offer.opponent
    ) {

        alert(
            "Erro: adversário não encontrado na proposta."
        );

        console.error(
            "Oferta sem adversário:",
            offer
        );

        return false;

    }


    /*
       NÃO aceitar se já tem luta.
    */

    if (
        player.nextFight
    ) {

        alert(
            "Você já possui uma luta marcada."
        );

        return false;

    }


    /*
       CAMP.
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


    /*
       IMPORTANTE:

       A luta acontece DEPOIS do camp.

       Exemplo:

       Semana 10 = aceita
       Camp = 4 semanas
       Semana 11
       Semana 12
       Semana 13
       Semana 14
       Semana 14 = luta

    */

    const fightWeek =
        currentWeek +
        campWeeks;


    /*
       CRIAR LUTA.
    */

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


        /* EVENTO */

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


        /* ADVERSÁRIO */

        opponent:
            offer.opponent,

        opponentName:
            offer.opponentName,

        opponentDisplayName:
            offer.opponentDisplayName,

        opponentOverall:
            Number(
                offer.opponentOverall ||
                offer.opponent?.overall ||
                45
            ),

        opponentPower:
            Number(
                offer.opponentPower ||
                offer.opponent?.power ||
                45
            ),


        /* FINANCEIRO */

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


        /* CONTRATO */

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


        /* CAMP */

        campWeeks:
            campWeeks,

        campStartWeek:
            currentWeek,

        fightWeek:
            fightWeek,

        weeksRemaining:
            campWeeks,


        /* DATA */

        acceptedWeek:
            currentWeek,

        acceptedYear:
            Number(
                player.year || 2026
            ),


        /* PPV */

        ppvAvailable:
            Boolean(
                offer.ppvAvailable
            ),

        ppvPercentage:
            Number(
                offer.ppvPercentage ||
                0
            ),


        /* RESULTADO */

        result:
            null,

        completed:
            false

    };


    /*
       REGISTRAR CONTRATO.
    */

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
       CONTRATO ATUAL.
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


    /*
       LIMPAR PROPOSTA.
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


    /*
       LOG.
    */

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

                `🥊 Luta amadora confirmada. Bolsa: $0.`

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


    /*
       ATUALIZAR HOME.
    */

    try {

        if (
            typeof window.home ===
            "function"
        ) {

            window.home();

        }

    }
    catch (error) {

        console.warn(
            "Não foi possível atualizar Home."
        );

    }


    return true;

}


/* =========================================================
   RECUSAR OFERTA
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


    player.managerSearchCooldown =
        1;


    if (
        Array.isArray(
            player.log
        )
    ) {

        player.log.unshift(

            `❌ Você recusou a luta contra ${opponentName}.`

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
   PROCESSAR CAMP
========================================================= */

function processManagerCampWeek() {

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


    if (
        fight.completed ===
        true
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

        console.error(
            "Fight sem fightWeek:",
            fight
        );

        return;

    }


    /*
       SEMANAS RESTANTES.
    */

    const remaining =
        Math.max(

            0,

            fightWeek -
            currentWeek

        );


    fight.weeksRemaining =
        remaining;


    /*
       CAMP.
    */

    if (
        currentWeek <
        fightWeek
    ) {

        fight.status =
            "camp";


        /*
           Camp ativo.
        */

        return;

    }


    /*
       DIA DA LUTA.
    */

    fight.status =
        "fight_day";


    fight.weeksRemaining =
        0;


    /*
       LOG APENAS UMA VEZ.
    */

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
   PROCESSAR SEMANA DO EMPRESÁRIO
========================================================= */

function processManagerWeek() {

    const player =
        managerPlayer();


    ensureManagerData();


    /*
       PRIMEIRO:
       se existe luta,
       atualizar camp.
    */

    if (
        player.nextFight
    ) {

        processManagerCampWeek();

        managerSave();

        return;

    }


    /*
       SE EXISTE OFERTA,
       NÃO PROCURAR OUTRA.
    */

    if (
        player.managerFightOffer
    ) {

        managerSave();

        return;

    }


    /*
       SEM LUTA:
       EMPRESÁRIO PROCURA.
    */

    processManagerFightOffer();

}


/* =========================================================
   VERIFICAR SE AVANÇO DE SEMANA
   DEVE SER BLOQUEADO
========================================================= */

function managerShouldBlockWeekAdvance() {

    const player =
        managerPlayer();


    const fight =
        player.nextFight;


    if (
        !fight
    ) {

        return false;

    }


    /*
       DIA DA LUTA:
       BLOQUEAR.
    */

    if (
        managerIsFightDay()
    ) {

        return true;

    }


    return false;

}


/* =========================================================
   VERIFICAR SE PODE LUTAR
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


    player.managerOfferPending =
        false;


    player.managerOffers =
        [];


    player.managerSearchCooldown =
        1;


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
   FINALIZAR LUTA
   CHAMADO PELO FIGHTS.JS
========================================================= */

function completeManagerFight(
    result
) {

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


    /*
       SALVAR RESULTADO.
    */

    fight.status =
        "completed";


    fight.completed =
        true;


    fight.result =
        result ||
        null;


    /*
       CONTRATO.
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


        /*
           CONTRATO TERMINOU.
        */

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
       LIMPAR LUTA.
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
       PEQUENO COOLDOWN.
    */

    player.managerSearchCooldown =
        1;


    /*
       LOG.
    */

    if (
        Array.isArray(
            player.log
        )
    ) {

        player.log.unshift(

            "📋 O empresário encerrou o processo desta luta."

        );

    }


    managerSave();

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
   FORÇAR OFERTA
   ÚTIL PARA TESTE
========================================================= */

function forceManagerFightOffer() {

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
   PEGAR OFERTA ATUAL
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
   PEGAR LUTA ATUAL
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
   INICIALIZAR
========================================================= */

function initializeManagers() {

    ensureManagerData();

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


window.managerCanFightNow =
    managerCanFightNow;


window.managerShouldBlockWeekAdvance =
    managerShouldBlockWeekAdvance;


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
