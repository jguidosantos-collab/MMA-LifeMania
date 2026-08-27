/* =========================================================
   MMA LIFE DYNASTY
   MANAGERS.JS
   EMPRESÁRIO — VERSÃO COMPLETA / ATUALIZADA

   FLUXO:

   SEM LUTA
       ↓
   EMPRESÁRIO PROCURA
       ↓
   PROPOSTA
       ↓
   JOGADOR ACEITA / RECUSA
       ↓
   CAMP
       ↓
   DIA DA LUTA
       ↓
   FIGHTS.JS
       ↓
   RESULTADO
       ↓
   EMPRESÁRIO VOLTA A PROCURAR

   SISTEMAS:
   - propostas
   - bolsa
   - bônus
   - adversário
   - eventos pequenos
   - eventos grandes
   - negociação
   - camp
   - semanas de preparação
   - travamento no dia da luta
   - cooldown
   - integração com fights.js
   - integração com main.js
========================================================= */


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const MANAGER_CONFIG = {

    minCampWeeks: 4,

    maxCampWeeks: 8,

    firstFightWeek: 4,

    searchCooldownWeeks: 2,

    offerChance: 0.75,

    maxOfferAge: 1,

    bigEventChance: 0.18,

    negotiationChance: 0.70,

    minBigEventPurse: 5000,

    maxBigEventPurse: 25000

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


/* =========================================================
   SALVAR
========================================================= */

function managerSave() {

    if (
        typeof window.saveGame ===
        "function"
    ) {

        window.saveGame();

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
        (max - min)
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


    /* =====================================================
       EMPRESÁRIO
    ===================================================== */

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


    /* =====================================================
       OFERTAS
    ===================================================== */

    if (
        !Array.isArray(
            player.managerOffers
        )
    ) {

        player.managerOffers = [];

    }


    /* =====================================================
       COOLDOWN
    ===================================================== */

    if (
        typeof player.managerSearchCooldown !==
        "number"
    ) {

        player.managerSearchCooldown = 0;

    }


    /* =====================================================
       ÚLTIMA OFERTA
    ===================================================== */

    if (
        typeof player.managerLastOfferWeek !==
        "number"
    ) {

        player.managerLastOfferWeek = -999;

    }


    /* =====================================================
       ID
    ===================================================== */

    if (
        typeof player.managerOfferId !==
        "number"
    ) {

        player.managerOfferId = 0;

    }


    /* =====================================================
       ESTADOS
    ===================================================== */

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


    /* =====================================================
       NEGOCIAÇÃO
    ===================================================== */

    if (
        typeof player.contractNegotiation !==
        "boolean"
    ) {

        player.contractNegotiation = false;

    }


    if (
        !Array.isArray(
            player.contractOffers
        )
    ) {

        player.contractOffers = [];

    }

}


/* =========================================================
   OVR DO JOGADOR
========================================================= */

function managerGetPlayerOverall() {

    const player =
        managerPlayer();


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


    if (
        typeof player.overall ===
        "number"
    ) {

        return Number(
            player.overall
        );

    }


    return 45;

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


    if (
        fight.status === "camp"
    ) {

        return true;

    }


    if (
        fight.status === "scheduled"
    ) {

        return true;

    }


    if (
        fight.status === "fight_day"
    ) {

        return true;

    }


    if (
        typeof fight.fightWeek ===
        "number"
    ) {

        return (
            Number(player.week || 0) <=
            Number(fight.fightWeek)
        );

    }


    return false;

}


/* =========================================================
   VERIFICAR DIA DA LUTA
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
        fight.status === "fight_day"
    ) {

        return true;

    }


    if (
        typeof fight.weeksRemaining ===
        "number"
    ) {

        return (
            Number(
                fight.weeksRemaining
            ) <= 0
        );

    }


    if (
        typeof fight.fightWeek ===
        "number"
    ) {

        return (
            Number(player.week || 0) >=
            Number(fight.fightWeek)
        );

    }


    return false;

}


/* =========================================================
   PODE PROCURAR?
========================================================= */

function managerCanSearchFight() {

    const player =
        managerPlayer();

    ensureManagerData();


    /*
       JÁ TEM LUTA
    */

    if (
        player.nextFight
    ) {

        return false;

    }


    /*
       JÁ TEM PROPOSTA
    */

    if (
        player.managerFightOffer
    ) {

        return false;

    }


    /*
       FILA
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
       COOLDOWN
    */

    if (
        Number(
            player.managerSearchCooldown || 0
        ) > 0
    ) {

        return false;

    }


    return true;

}


/* =========================================================
   NOMES
========================================================= */

const MANAGER_FIGHTER_NAMES = [

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
    "Arthur Lima",
    "Miguel Costa",
    "Daniel Rocha",
    "Fernando Alves",
    "Rodrigo Martins",
    "Vinícius Souza",
    "Samuel Ferreira",
    "Ruan Carvalho",
    "Diego Ramos",
    "Alexandre Mendes"

];


/* =========================================================
   GERAR ADVERSÁRIO
========================================================= */

function generateManagerOpponent() {

    const player =
        managerPlayer();


    const playerOverall =
        managerGetPlayerOverall();


    /*
       DIFERENÇA DE FORÇA
    */

    const variation =
        managerRandomInt(
            -8,
            8
        );


    const opponentPower =
        managerClamp(
            Math.round(
                playerOverall +
                variation
            ),
            35,
            95
        );


    /*
       NOME
    */

    let name =
        MANAGER_FIGHTER_NAMES[
            managerRandomInt(
                0,
                MANAGER_FIGHTER_NAMES.length - 1
            )
        ];


    /*
       NÃO LUTAR CONTRA SI MESMO
    */

    if (
        player.name &&
        name === player.name
    ) {

        name =
            "Ricardo Martins";

    }


    /*
       RECORD
    */

    const wins =
        managerRandomInt(
            0,
            18
        );


    const losses =
        managerRandomInt(
            0,
            8
        );


    const draws =
        managerRandomInt(
            0,
            2
        );


    /*
       ADVERSÁRIO COMPLETO
    */

    const opponent = {

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

        fullName:
            name,

        power:
            opponentPower,

        overall:
            opponentPower,

        ovr:
            opponentPower,

        age:
            managerRandomInt(
                18,
                35
            ),

        country:
            player.country ||
            "Brasil",

        weight:
            player.weight ||
            "Peso Leve",

        style:
            [
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
            wins,

        losses:
            losses,

        draws:
            draws,

        record:
            `${wins}-${losses}-${draws}`,

        attributes: {

            strength:
                managerClamp(
                    opponentPower +
                    managerRandomInt(
                        -10,
                        5
                    ),
                    30,
                    95
                ),

            striking:
                managerClamp(
                    opponentPower +
                    managerRandomInt(
                        -10,
                        5
                    ),
                    30,
                    95
                ),

            wrestling:
                managerClamp(
                    opponentPower +
                    managerRandomInt(
                        -10,
                        5
                    ),
                    30,
                    95
                ),

            grappling:
                managerClamp(
                    opponentPower +
                    managerRandomInt(
                        -10,
                        5
                    ),
                    30,
                    95
                ),

            cardio:
                managerClamp(
                    opponentPower +
                    managerRandomInt(
                        -10,
                        5
                    ),
                    30,
                    95
                ),

            technique:
                managerClamp(
                    opponentPower +
                    managerRandomInt(
                        -10,
                        5
                    ),
                    30,
                    95
                ),

            defense:
                managerClamp(
                    opponentPower +
                    managerRandomInt(
                        -10,
                        5
                    ),
                    30,
                    95
                ),

            fightIQ:
                managerClamp(
                    opponentPower +
                    managerRandomInt(
                        -10,
                        5
                    ),
                    30,
                    95
                ),

            chin:
                managerClamp(
                    opponentPower +
                    managerRandomInt(
                        -10,
                        5
                    ),
                    30,
                    95
                )

        }

    };


    /*
       GARANTIA EXTRA
    */

    opponent.displayName =
        opponent.name;

    opponent.power =
        Number(opponent.power);

    opponent.overall =
        Number(opponent.overall);


    return opponent;

}


/* =========================================================
   NOMES DOS EVENTOS
========================================================= */

const MANAGER_SMALL_EVENTS = [

    "MMA Fight Night",

    "Brazil Combat",

    "Fight Arena",

    "Future Fighters",

    "National Combat",

    "Combat Warriors",

    "Cage Warriors Brasil",

    "Regional Fight League",

    "Warriors Championship",

    "MMA Revolution"

];


const MANAGER_BIG_EVENTS = [

    "MMA WORLD GRAND PRIX",

    "GLOBAL COMBAT CHAMPIONSHIP",

    "WORLD FIGHT NIGHT",

    "INTERNATIONAL MMA ELITE",

    "MMA DYNASTY GRAND EVENT",

    "GLOBAL FIGHT CHAMPIONSHIP",

    "WORLD COMBAT SERIES"

];


/* =========================================================
   EVENTO
========================================================= */

function generateManagerEvent() {

    const isBig =
        Math.random() <
        MANAGER_CONFIG.bigEventChance;


    if (isBig) {

        return {

            name:
                MANAGER_BIG_EVENTS[
                    managerRandomInt(
                        0,
                        MANAGER_BIG_EVENTS.length - 1
                    )
                ],

            type:
                "big",

            prestige:
                managerRandomInt(
                    75,
                    100
                ),

            isBigEvent:
                true

        };

    }


    return {

        name:
            MANAGER_SMALL_EVENTS[
                managerRandomInt(
                    0,
                    MANAGER_SMALL_EVENTS.length - 1
                )
            ],

        type:
            "regional",

        prestige:
            managerRandomInt(
                25,
                65
            ),

        isBigEvent:

           /* =========================================================
   CALCULAR BOLSA DA LUTA
   AMADOR = SEM BOLSA
   PROFISSIONAL = BOLSA NORMAL
========================================================= */

function calculateManagerPurse() {

    const player =
        managerPlayer();

    /*
       =====================================================
       AMADOR
       =====================================================

       Lutador amador NÃO recebe bolsa.
    */

    if (
        !player.professional ||
        player.professional.active !== true
    ) {

        return 0;

    }


    /*
       =====================================================
       PROFISSIONAL
       =====================================================
    */

    const overall =
        typeof window.getOverall ===
        "function"
        ?
        Number(
            window.getOverall()
        )
        :
        Number(
            player.overall || 45
        );


    const fame =
        Number(
            player.fame || 0
        );


    const purse =
        800 +
        overall * 35 +
        fame * 15;


    return Math.round(
        purse
    );

}


/* =========================================================
   BOLSA DE EVENTO GRANDE
========================================================= */

function calculateBigEventPurse() {

    const player =
        managerPlayer();


    const overall =
        managerGetPlayerOverall();


    const fame =
        Number(
            player.fame || 0
        );


    const base =
        MANAGER_CONFIG.minBigEventPurse;


    const value =
        base +

        overall * 80 +

        fame * 40;


    return Math.round(

        managerClamp(
            value,
            MANAGER_CONFIG.minBigEventPurse,
            MANAGER_CONFIG.maxBigEventPurse
        )

    );

}


/* =========================================================
   BÔNUS
========================================================= */

function calculateManagerWinBonus(
    purse
) {

    return Math.round(

        Number(purse || 0) *
        0.50

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


    const manager =
        player.manager || {};


    const negotiationSkill =
        Number(
            manager.negotiation || 50
        );


    const shouldNegotiate =

        Boolean(
            event.isBigEvent
        ) &&

        (
            Math.random() <
            MANAGER_CONFIG.negotiationChance
        );


    if (
        !shouldNegotiate
    ) {

        return {

            available:
                false,

            requestedPurse:
                purse,

            minimumPurse:
                purse,

            maximumPurse:
                purse,

            rounds:
                0,

            successChance:
                0

        };

    }


    /*
       Quanto melhor o empresário,
       maior o teto.
    */

    const bonusPercent =
        managerClamp(

            0.10 +

            negotiationSkill / 1000,

            0.10,

            0.20

        );


    const maximumPurse =
        Math.round(

            purse *
            (1 + bonusPercent)

        );


    const minimumPurse =
        Math.round(

            purse *
            0.85

        );


    return {

        available:
            true,

        requestedPurse:
            purse,

        minimumPurse:
            minimumPurse,

        maximumPurse:
            maximumPurse,

        rounds:
            1,

        successChance:
            managerClamp(
                40 +
                negotiationSkill * 0.5,
                20,
                90
            )

    };

}


/* =========================================================
   GERAR OFERTA
========================================================= */
function generateManagerFightOffer() {
    const player =
        managerPlayer();
    ensureManagerData();
    /* =====================================================
       ADVERSÁRIO
    ===================================================== */
    const opponent =
        generateManagerOpponent();
    /* =====================================================
       EVENTO
    ===================================================== */
    const event =
        generateManagerEvent();
    /* =====================================================
       VERIFICAR SE É PROFISSIONAL
    ===================================================== */
    const isProfessional =
        Boolean(
            player.professional &&
            player.professional.active === true
        );
    /* =====================================================
       BOLSA E BÔNUS
       AMADOR:
       - Bolsa = $0
       - Bônus = $0
       PROFISSIONAL:
       - Evento normal = bolsa normal
       - Evento grande = bolsa especial
       - Bônus calculado normalmente
    ===================================================== */
    let purse = 0;
    let winBonus = 0;
    if (
        isProfessional
    ) {
        if (
            event.isBigEvent === true
        ) {
            purse =
                calculateBigEventPurse();
        }
        else {
            purse =
                calculateManagerPurse();
        }
        winBonus =
            calculateManagerWinBonus(
                purse
            );
    }
    /* =====================================================
       GARANTIR NÚMEROS VÁLIDOS
    ===================================================== */
    purse =
        Number(purse || 0);
    winBonus =
        Number(winBonus || 0);
    /* =====================================================
       CAMP
    ===================================================== */
    const campWeeks =
        managerRandomInt(
            MANAGER_CONFIG.minCampWeeks,
            MANAGER_CONFIG.maxCampWeeks
        );
    /* =====================================================
       NEGOCIAÇÃO
       A negociação só fica disponível
       quando for uma luta profissional
       em evento grande.
    ===================================================== */
    let negotiation = {
        available: false,
        basePurse:
            purse,
        currentPurse:
            purse,
        originalPurse:
            purse,
        maxPurse:
            purse,
        rounds: 0,
        completed: false
    };
    if (
        isProfessional &&
        event.isBigEvent === true &&
        typeof createNegotiationData ===
        "function"
    ) {
        negotiation =
            createNegotiationData(
                purse,
                event
            );
    }
    /* =====================================================
       CRIAR OFERTA
    ===================================================== */
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
                player.week || 1
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
            prestige:
                event.prestige,
            isBigEvent:
                Boolean(
                    event.isBigEvent
                )
        },
        /* =================================================
           ADVERSÁRIO
           Mantemos TODOS os campos para evitar
           o problema do adversário aparecer
           como "não encontrado" no Fight.js.
        ================================================= */
        opponent:
            opponent,
        opponentName:
            opponent.name ||
            opponent.displayName ||
            "Adversário",
        opponentDisplayName:
            opponent.displayName ||
            opponent.name ||
            "Adversário",
        opponentOverall:
            Number(
                opponent.overall ||
                opponent.power ||
                0
            ),
        opponentPower:
            Number(
                opponent.power ||
                opponent.overall ||
                0
            ),
        /* =================================================
           FINANCEIRO
        ================================================= */
        purse:
            purse,
        fightPurse:
            purse,
        winBonus:
            winBonus,
        totalWinPayout:
            purse +
            winBonus,
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
                negotiation &&
                negotiation.available === true
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
           COMPATIBILIDADE COM FIGHT.JS
        ================================================= */
        fightWeek:
            null,
        weeksRemaining:
            campWeeks
    };
    /* =====================================================
       LOG DA OFERTA
    ===================================================== */
    if (
        Array.isArray(player.log)
    ) {
        if (
            isProfessional
        ) {
            player.log.unshift(
                `📩 Empresário encontrou uma luta contra ${offer.opponentName}. Bolsa: $${Math.round(purse)}.`
            );
        }
        else {
            player.log.unshift(
                `📩 Empresário encontrou uma luta amadora contra ${offer.opponentName}.`
            );
        }
    }
    return offer;
}

/* =========================================================
   PROCESSAR PROPOSTA
========================================================= */

function processManagerFightOffer() {

    const player =
        managerPlayer();


    ensureManagerData();


    /*
       NÃO PROCURAR SE JÁ TEM LUTA
    */

    if (
        player.nextFight
    ) {

        return null;

    }


    /*
       NÃO CRIAR OUTRA PROPOSTA
    */

    if (
        player.managerFightOffer
    ) {

        return player.managerFightOffer;

    }


    /*
       FILA
    */

    if (
        Array.isArray(
            player.managerOffers
        ) &&
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
       COOLDOWN
    */

    if (
        Number(
            player.managerSearchCooldown || 0
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


    /*
       SEMANA ATUAL
    */

    const currentWeek =
        Number(
            player.week || 1
        );


    /*
       PRIMEIRA LUTA
    */

    if (
        currentWeek <
        MANAGER_CONFIG.firstFightWeek
    ) {

        return null;

    }


    /*
       NÃO REPETIR NA MESMA SEMANA
    */

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


    /*
       CHANCE
    */

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


    /*
       GERAR
    */

    const offer =
        generateManagerFightOffer();


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
       LOG
    */

    if (
        Array.isArray(
            player.log
        )
    ) {

        player.log.unshift(

            `📩 Seu empresário encontrou uma luta contra ${offer.opponentName}.`

        );


        if (
            offer.isBigEvent
        ) {

            player.log.unshift(

                `🔥 GRANDE EVENTO: ${offer.eventName}. Bolsa oferecida: $${offer.purse}.`

            );

        }

    }


    managerSave();


    /*
       ATUALIZAR HOME
    */

    if (
        typeof window.home ===
        "function"
    ) {

        window.home();

    }


    return offer;

}


/* =========================================================
   NEGOCIAR OFERTA
========================================================= */

function negotiateManagerFightOffer() {

    const player =
        managerPlayer();


    ensureManagerData();


    const offer =
        player.managerFightOffer;


    if (!offer) {

        alert(
            "Não existe nenhuma proposta para negociar."
        );

        return false;

    }


    if (
        !offer.negotiable ||
        !offer.negotiation ||
        !offer.negotiation.available
    ) {

        alert(
            "Esta luta não possui negociação disponível."
        );

        return false;

    }


    const negotiation =
        offer.negotiation;


    /*
       VERIFICAR LIMITE
    */

    if (
        negotiation.rounds <= 0
    ) {

        alert(
            "A negociação desta luta já foi utilizada."
        );

        return false;

    }


    const chance =
        Number(
            negotiation.successChance ||
            50
        );


    const success =
        Math.random() * 100 <
        chance;


    negotiation.rounds =
        0;


    if (success) {

        const newPurse =
            Number(
                negotiation.maximumPurse
            );


        offer.purse =
            newPurse;


        offer.fightPurse =
            newPurse;


        offer.winBonus =
            calculateManagerWinBonus(
                newPurse
            );


        offer.totalWinPayout =

            Number(
                offer.purse +
                offer.winBonus
            );


        offer.negotiated =
            true;


        offer.negotiationResult =
            "success";


        if (
            Array.isArray(
                player.log
            )
        ) {

            player.log.unshift(

                `💰 Negociação bem-sucedida! A bolsa subiu para $${newPurse}.`

            );

        }


        alert(

            `💰 NEGOCIAÇÃO VENCIDA!\n\nBolsa final: $${newPurse}\nBônus: $${offer.winBonus}`

        );

    }
    else {

        offer.negotiated =
            true;


        offer.negotiationResult =
            "failed";


        if (
            Array.isArray(
                player.log
            )
        ) {

            player.log.unshift(

                "❌ O evento recusou o aumento da bolsa."

            );

        }


        alert(
            "❌ A negociação não deu certo. A bolsa original foi mantida."
        );

    }


    managerSave();


    if (
        typeof window.home ===
        "function"
    ) {

        window.home();

    }


    return success;

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


    if (!offer) {

        alert(
            "Não existe nenhuma proposta de luta."
        );

        return false;

    }


    /*
       NÃO ACEITAR SE JÁ EXISTE LUTA
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
       GARANTIR ADVERSÁRIO
    */

    let opponent =
        offer.opponent;


    /*
       COMPATIBILIDADE COM OFERTAS ANTIGAS
    */

    if (
        !opponent
    ) {

        opponent =
            generateManagerOpponent();

    }


    /*
       CORRIGIR CAMPOS DO ADVERSÁRIO
    */

    opponent.name =
        opponent.name ||
        opponent.displayName ||
        offer.opponentName ||
        "Adversário";


    opponent.displayName =
        opponent.displayName ||
        opponent.name;


    opponent.power =
        Number(
            opponent.power ||
            opponent.overall ||
            offer.opponentPower ||
            managerGetPlayerOverall()
        );


    opponent.overall =
        Number(
            opponent.overall ||
            opponent.power
        );


    opponent.ovr =
        Number(
            opponent.ovr ||
            opponent.overall
        );


    /*
       CAMP
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


    /*
       SEMANA ATUAL
    */

    const currentWeek =
        Number(
            player.week || 1
        );


    /*
       SEMANA DA LUTA
    */

    const fightWeek =
        currentWeek +
        campWeeks;


    /*
       CRIAR LUTA
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


        /*
           STATUS
        */

        status:
            "camp",


        /*
           EVENTO
        */

        event: {

            name:
                offer.eventName,

            type:
                offer.eventType ||
                "regional",

            prestige:
                offer.eventPrestige ||
                50,

            isBigEvent:
                Boolean(
                    offer.isBigEvent
                )

        },


        eventName:
            offer.eventName,


        eventType:
            offer.eventType ||
            "regional",


        isBigEvent:
            Boolean(
                offer.isBigEvent
            ),


        /*
           ADVERSÁRIO
        */

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


        /*
           DINHEIRO
        */

        purse:
            Number(
                offer.purse || 0
            ),

        fightPurse:
            Number(
                offer.purse || 0
            ),

        winBonus:
            Number(
                offer.winBonus || 0
            ),


        /*
           CAMP
        */

        campWeeks:
            campWeeks,

        campStartWeek:
            currentWeek,

        fightWeek:
            fightWeek,

        weeksRemaining:
            campWeeks,


        /*
           DATAS
        */

        acceptedWeek:
            currentWeek,

        acceptedYear:
            Number(
                player.year || 2026
            ),


        /*
           RESULTADO
        */

        result:
            null,

        completed:
            false

    };


    /*
       CAMPOS DE COMPATIBILIDADE
    */

    player.nextFight.weeksToFight =
        campWeeks;


    player.nextFight.remainingWeeks =
        campWeeks;


    player.nextFight.trainingWeeks =
        campWeeks;


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


    /*
       NEGOCIAÇÃO ENCERRADA
    */

    player.contractNegotiation =
        false;


    /*
       LOG
    */

    if (
        Array.isArray(
            player.log
        )
    ) {

        player.log.unshift(

            `🥊 Luta aceita! ${player.name || "Seu lutador"} enfrentará ${opponent.name} em ${offer.eventName}.`

        );


        player.log.unshift(

            `🏋️ CAMP INICIADO: ${campWeeks} semanas de preparação.`

        );


        player.log.unshift(

            `💰 Bolsa: $${Math.round(offer.purse || 0)} | Bônus: $${Math.round(offer.winBonus || 0)}.`

        );

    }


    managerSave();


    /*
       ATUALIZAR HOME
    */

    if (
        typeof window.home ===
        "function"
    ) {

        window.home();

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

        (
            player.managerFightOffer.opponent &&
            player.managerFightOffer.opponent.name
        ) ||

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

            `❌ Você recusou a luta contra ${opponentName}.`

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
   PROCESSAR CAMP
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


    if (
        fight.status ===
        "completed"
    ) {

        return;

    }


    const currentWeek =
        Number(
            player.week || 0
        );


    const fightWeek =
        Number(
            fight.fightWeek ||
            currentWeek
        );


    /*
       CALCULAR RESTANTE
    */

    const remaining =
        Math.max(

            0,

            fightWeek -
            currentWeek

        );


    fight.weeksRemaining =
        remaining;


    fight.remainingWeeks =
        remaining;


    fight.weeksToFight =
        remaining;


    /*
       CAMP
    */

    if (
        currentWeek <
        fightWeek
    ) {

        fight.status =
            "camp";

        return;

    }


    /*
       DIA DA LUTA
    */

    fight.status =
        "fight_day";


    fight.weeksRemaining =
        0;


    fight.remainingWeeks =
        0;


    fight.weeksToFight =
        0;

}


/* =========================================================
   PROCESSAR SEMANA
========================================================= */

function processManagerWeek() {

    const player =
        managerPlayer();


    ensureManagerData();


    /*
       =====================================================
       SE TEM LUTA
       =====================================================
    */

    if (
        player.nextFight
    ) {

        processManagerCampWeek();

        managerSave();

        return;

    }


    /*
       =====================================================
       SE TEM OFERTA
       =====================================================
    */

    if (
        player.managerFightOffer
    ) {

        managerSave();

        return;

    }


    /*
       =====================================================
       SEM LUTA
       EMPRESÁRIO PROCURA
       =====================================================
    */

    processManagerFightOffer();

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

        (
            player.nextFight.opponent &&
            player.nextFight.opponent.name
        ) ||

        "adversário";


    player.nextFight =
        null;


    player.managerFightOffer =
        null;


    player.managerOfferPending =
        false;


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


    if (!fight) {

        return;

    }


    /*
       MARCAR COMO COMPLETA
    */

    fight.status =
        "completed";


    fight.completed =
        true;


    fight.result =
        result || null;


    /*
       GUARDAR HISTÓRICO
    */

    if (
        !Array.isArray(
            player.fightHistory
        )
    ) {

        player.fightHistory = [];

    }


    player.fightHistory.push({

        id:
            fight.id,

        event:
            fight.eventName,

        opponent:
            fight.opponentName,

        opponentOverall:
            fight.opponentOverall ||
            fight.opponentPower ||
            0,

        purse:
            fight.purse ||
            0,

        winBonus:
            fight.winBonus ||
            0,

        result:
            result || null,

        year:
            player.year,

        week:
            player.week

    });


    /*
       LIMPAR LUTA
    */

    player.nextFight =
        null;


    /*
       LIMPAR OFERTA
    */

    player.managerFightOffer =
        null;


    player.managerOffers =
        [];


    player.managerOfferPending =
        false;


    /*
       COOLDOWN
    */

    player.managerSearchCooldown =
        MANAGER_CONFIG.searchCooldownWeeks;


    /*
       LOG
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

        alert(
            "Você já possui uma luta marcada."
        );

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
   GARANTIR OFERTA VISÍVEL
========================================================= */

function getManagerCurrentOffer() {

    const player =
        managerPlayer();


    ensureManagerData();


    return (
        player.managerFightOffer ||
        null
    );

}


/* =========================================================
   FORMATAR NOME DO ADVERSÁRIO
========================================================= */

function getManagerOpponentName(
    offer
) {

    if (!offer) {

        return "A definir";

    }


    if (
        offer.opponentName
    ) {

        return offer.opponentName;

    }


    if (
        offer.opponent &&
        offer.opponent.name
    ) {

        return offer.opponent.name;

    }


    if (
        offer.opponent &&
        offer.opponent.displayName
    ) {

        return offer.opponent.displayName;

    }


    return "A definir";

}


/* =========================================================
   FORMATAR OVR DO ADVERSÁRIO
========================================================= */

function getManagerOpponentOverall(
    offer
) {

    if (!offer) {

        return 0;

    }


    if (
        offer.opponentOverall
    ) {

        return Number(
            offer.opponentOverall
        );

    }


    if (
        offer.opponentPower
    ) {

        return Number(
            offer.opponentPower
        );

    }


    if (
        offer.opponent &&
        offer.opponent.overall
    ) {

        return Number(
            offer.opponent.overall
        );

    }


    if (
        offer.opponent &&
        offer.opponent.power
    ) {

        return Number(
            offer.opponent.power
        );

    }


    return 0;

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


window.getManagerCurrentOffer =
    getManagerCurrentOffer;


window.getManagerOpponentName =
    getManagerOpponentName;


window.getManagerOpponentOverall =
    getManagerOpponentOverall;


/* =========================================================
   DOM READY
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
