/* =========================================================
   MMA LIFE DYNASTY
   MANAGERS.JS
   EMPRESÁRIO — SISTEMA COMPLETO
   VERSÃO INTEGRADA COM O PROJETO ATUAL

   COMPATIBILIDADE:
   - player.js
   - main.js
   - fights.js
   - save.js

   PRINCÍPIOS:
   - window.player é a fonte única de dados
   - managerFightOffer é a oferta principal
   - fightOffers funciona como espelho de compatibilidade
   - nextFight é a única luta efetivamente marcada
   - manager NÃO navega automaticamente para home()
   - adversário é preservado dentro da luta
   - contrato ativo bloqueia novas ofertas
========================================================= */


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const MANAGER_CONFIG = {

    minCampWeeks: 4,
    maxCampWeeks: 8,

    postFightRestWeeks: 2,

    minSearchWaitWeeks: 1,
    maxSearchWaitWeeks: 4,

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
       INTERNACIONAL
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
   ESTADO GLOBAL
========================================================= */

window.mmaManager = null;


/* =========================================================
   PLAYER
========================================================= */

function managerPlayer() {

    if (
        !window.player &&
        typeof window.createDefaultPlayer === "function"
    ) {

        try {

            window.player =
                window.createDefaultPlayer();

        }
        catch (error) {

            console.warn(
                "MANAGER: não foi possível criar player:",
                error
            );

        }

    }

    return window.player || null;

}


/* =========================================================
   SAVE
========================================================= */

function managerSave() {

    try {

        if (
            typeof window.saveGame === "function"
        ) {

            return window.saveGame();

        }

        if (
            typeof window.save === "function"
        ) {

            return window.save();

        }

    }
    catch (error) {

        console.warn(
            "MANAGER: erro ao salvar:",
            error
        );

    }

    return false;

}


/* =========================================================
   ATUALIZAÇÃO SEGURA DA INTERFACE

   IMPORTANTE:
   NÃO chamar home() automaticamente.

   Isso evita que uma ação do empresário
   tire o jogador da tela atual.
========================================================= */

function managerRefreshUI() {

    try {

        if (
            typeof window.updateUI === "function"
        ) {

            window.updateUI();

        }

    }
    catch (error) {

        console.warn(
            "MANAGER: erro em updateUI:",
            error
        );

    }

}


/* =========================================================
   UTILIDADES
========================================================= */

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


function managerClamp(value, min, max) {

    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );

}


function managerNumber(value, fallback = 0) {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;

}


/* =========================================================
   SEMANA ABSOLUTA

   Mantém compatibilidade com o calendário
   do main.js.
========================================================= */

function managerAbsoluteWeek(
    year,
    week
) {

    const y =
        managerNumber(
            year,
            2026
        );

    const w =
        managerNumber(
            week,
            0
        );

    return (
        y * 53 +
        w
    );

}


/* =========================================================
   ESTRUTURA DO MANAGER
========================================================= */

function ensureManagerData() {

    const player =
        managerPlayer();

    if (!player) {
        return null;
    }


    if (
        typeof player.manager === "undefined"
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
        typeof player.managerFightOffer === "undefined"
    ) {

        player.managerFightOffer = null;

    }


    if (
        !Array.isArray(
            player.fightOffers
        )
    ) {

        player.fightOffers = [];

    }


    if (
        typeof player.managerSearchCooldown !== "number"
    ) {

        player.managerSearchCooldown = 0;

    }


    if (
        typeof player.managerLastOfferWeek !== "number"
    ) {

        player.managerLastOfferWeek = -999;

    }


    if (
        typeof player.managerOfferId !== "number"
    ) {

        player.managerOfferId = 0;

    }


    if (
        typeof player.managerSearching !== "boolean"
    ) {

        player.managerSearching = false;

    }


    if (
        typeof player.managerSearchWeek !== "number"
    ) {

        player.managerSearchWeek = -999;

    }


    if (
        typeof player.managerOfferPending !== "boolean"
    ) {

        player.managerOfferPending = false;

    }


    if (
        typeof player.managerContractFightNumber !== "number"
    ) {

        player.managerContractFightNumber = 0;

    }


    if (
        typeof player.managerContractTotalFights !== "number"
    ) {

        player.managerContractTotalFights = 0;

    }


    if (
        typeof player.managerContractEvent !== "string"
    ) {

        player.managerContractEvent = "";

    }


    if (
        typeof player.managerContractCategory !== "string"
    ) {

        player.managerContractCategory = "";

    }


    if (
        typeof player.postFightRestWeeks !== "number"
    ) {

        player.postFightRestWeeks = 0;

    }


    if (
        typeof player.postFightRestActive !== "boolean"
    ) {

        player.postFightRestActive = false;

    }


    if (
        typeof player.managerNextSearchWeek !== "number"
    ) {

        player.managerNextSearchWeek = 0;

    }


    if (
        typeof player.managerSearchAfterRest !== "boolean"
    ) {

        player.managerSearchAfterRest = false;

    }


    if (
        typeof player.professionalDecisionPending !== "boolean"
    ) {

        player.professionalDecisionPending = false;

    }


    if (
        typeof player.professionalDecisionMade !== "boolean"
    ) {

        player.professionalDecisionMade = false;

    }


    if (
        typeof player.professionalDecisionWeek !== "number"
    ) {

        player.professionalDecisionWeek = -999;

    }


    if (
        !player.professional ||
        typeof player.professional !== "object"
    ) {

        player.professional = {

            active: false,
            wins: 0,
            losses: 0,
            draws: 0,
            ranking: null

        };

    }


    if (
        !player.amateur ||
        typeof player.amateur !== "object"
    ) {

        player.amateur = {

            wins: 0,
            losses: 0,
            draws: 0,
            ranking: 50

        };

    }


    if (
        !Array.isArray(player.log)
    ) {

        player.log = [];

    }


    /*
       Compatibilidade com ofertas antigas.
    */

    if (
        player.managerFightOffer &&
        !Array.isArray(player.fightOffers)
    ) {

        player.fightOffers = [
            player.managerFightOffer
        ];

    }


    /*
       Compatibilidade com nextFight antigo.
    */

    if (player.nextFight) {

        const fight =
            player.nextFight;


        if (
            fight.fightWeek === undefined
        ) {

            if (
                fight.week !== undefined
            ) {

                fight.fightWeek =
                    managerNumber(
                        fight.week,
                        managerNumber(
                            player.week,
                            0
                        ) + 2
                    );

            }
            else {

                fight.fightWeek =
                    managerNumber(
                        player.week,
                        0
                    ) + 2;

            }

        }


        if (
            fight.fightYear === undefined
        ) {

            fight.fightYear =
                managerNumber(
                    fight.year,
                    managerNumber(
                        player.year,
                        2026
                    )
                );

        }


        fight.week =
            fight.fightWeek;


        if (
            !fight.status
        ) {

            fight.status =
                "scheduled";

        }

    }


    return player;

}


/* =========================================================
   EMPRESÁRIO ATIVO
========================================================= */

function hasManager() {

    const player =
        ensureManagerData();

    if (!player) {
        return false;
    }

    return Boolean(
        player.manager &&
        player.manager.active !== false
    );

}


/* =========================================================
   PROFISSIONAL
========================================================= */

function managerIsProfessional() {

    const player =
        managerPlayer();

    if (!player) {
        return false;
    }


    return Boolean(

        player.careerStage === "professional" ||

        (
            player.professional &&
            player.professional.active === true
        )

    );

}


/* =========================================================
   AMADOR

   Regra simples e segura:
   se não é profissional, é amador.
========================================================= */

function managerIsAmateur() {

    return !managerIsProfessional();

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
            typeof window.getOverall === "function"
        ) {

            const value =
                Number(
                    window.getOverall()
                );

            if (
                Number.isFinite(value) &&
                value > 0
            ) {

                return managerClamp(
                    Math.round(value),
                    1,
                    99
                );

            }

        }

    }
    catch (error) {}


    const fallback =
        Number(
            player.overall
        );


    if (
        Number.isFinite(fallback) &&
        fallback > 0
    ) {

        return managerClamp(
            Math.round(fallback),
            1,
            99
        );

    }


    return 45;

}


/* =========================================================
   ESTÁGIO DE CARREIRA
========================================================= */

function managerGetCareerStage() {

    const player =
        managerPlayer();

    if (!player) {
        return "amateur";
    }


    if (
        managerIsProfessional()
    ) {

        if (
            player.careerStage
        ) {

            return player.careerStage;

        }

        return "professional";

    }


    return "amateur";

}


/* =========================================================
   OPONENTE
========================================================= */

function generateManagerOpponent() {

    const player =
        managerPlayer();

    const overall =
        managerGetPlayerOverall();


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
        name.toLowerCase() ===
        String(player.name).toLowerCase()
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


    const opponentOverall =
        managerClamp(

            Math.round(
                overall +
                managerRandomInt(
                    -8,
                    8
                )
            ),

            30,
            95

        );


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
   EVENTO

   PROGRESSÃO:
   AMADOR:
   somente regional

   PROFISSIONAL:
   OVR < 50  -> regional
   OVR < 65  -> nacional
   OVR < 75  -> internacional
   OVR >= 75 -> elite
========================================================= */

function generateManagerEvent() {

    const player =
        managerPlayer();

    const overall =
        managerGetPlayerOverall();


    let available = [];


    if (
        managerIsAmateur()
    ) {

        available =
            MANAGER_EVENTS.filter(
                function(event) {

                    return (
                        event.category ===
                        "regional"
                    );

                }
            );

    }
    else if (
        overall < 50
    ) {

        available =
            MANAGER_EVENTS.filter(
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

        available =
            MANAGER_EVENTS.filter(
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

        available =
            MANAGER_EVENTS.filter(
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
    else {

        available =
            MANAGER_EVENTS.slice();

    }


    if (
        !available.length
    ) {

        available =
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
        available[
            managerRandomInt(
                0,
                available.length - 1
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
                event.type === "elite_big" ||
                event.type === "title" ||
                event.type === "title_defense"
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


    return managerRandomInt(
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
        event &&
        event.type === "elite"
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


        return managerRandomInt(
            200000,
            1000000
        );

    }


    if (
        event &&
        event.type === "elite_big"
    ) {

        return managerRandomInt(
            25000,
            1000000
        );

    }


    if (
        event &&
        (
            event.type === "title" ||
            event.type === "title_defense"
        )
    ) {

        return managerRandomInt(
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
        event.category === "regional"
    ) {

        return calculateRegionalPurse();

    }


    if (
        event.category === "national"
    ) {

        return calculateNationalPurse();

    }


    if (
        event.category === "world"
    ) {

        return calculateWorldPurse();

    }


    if (
        event.category === "elite"
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

    if (
        managerIsAmateur()
    ) {

        return 0;

    }


    return Math.max(
        0,
        Math.round(
            Number(purse || 0)
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
        event.category === "regional" ||
        event.category === "national"
    ) {

        return {

            available: false,

            currentPurse: purse,

            minimum: purse,

            maximum: purse,

            requested: purse,

            successChance: 100,

            ppvAvailable: false,

            ppv: 0,

            negotiated: false,

            accepted: false

        };

    }


    const minimum =
        Math.max(
            0,
            Number(purse || 0)
        );


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
        managerRandomInt(
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


    const managerNegotiation =
        Number(
            player?.manager?.negotiation ||
            50
        );


    successChance +=
        managerNegotiation *
        0.15;


    successChance =
        managerClamp(
            Math.round(
                successChance
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

        available: true,

        currentPurse: minimum,

        minimum: minimum,

        maximum: maximum,

        requested: requested,

        successChance: successChance,

        ppvAvailable: true,

        ppv: ppv,

        negotiationType:
            event.category,

        negotiated: false,

        accepted: false

    };

}


/* =========================================================
   ESPELHAR OFERTA PARA MAIN.JS

   managerFightOffer:
   fonte principal.

   fightOffers:
   compatibilidade com sistemas
   que esperam a fila de ofertas.
========================================================= */

function syncManagerOfferToMain() {

    const player =
        ensureManagerData();

    if (!player) {
        return;
    }


    if (
        player.managerFightOffer
    ) {

        player.fightOffers = [
            player.managerFightOffer
        ];

        player.managerOffers = [
            player.managerFightOffer
        ];

    }
    else {

        player.fightOffers = [];

        player.managerOffers = [];

    }

}


/* =========================================================
   REMOVER OFERTA
========================================================= */

function clearManagerOffer() {

    const player =
        ensureManagerData();

    if (!player) {
        return;
    }


    player.managerFightOffer =
        null;

    player.managerOfferPending =
        false;

    player.managerOffers =
        [];

    player.fightOffers =
        [];

}


/* =========================================================
   OFERTA DE LUTA
========================================================= */

function generateManagerFightOffer() {

    const player =
        ensureManagerData();

    if (
        !player ||
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


    /*
       Amador não recebe bolsa.
    */

    const purse =
        amateur
            ? 0
            : calculateManagerPurse(
                event
            );


    const winBonus =
        amateur
            ? 0
            : calculateManagerWinBonus(
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
            ? {

                available: false,
                currentPurse: 0,
                minimum: 0,
                maximum: 0,
                requested: 0,
                successChance: 100,
                ppvAvailable: false,
                ppv: 0,
                negotiated: false,
                accepted: false

            }
            : createNegotiationData(
                purse,
                event
            );


    const currentWeek =
        Number(
            player.week || 0
        );


    const currentYear =
        Number(
            player.year || 2026
        );


    return {

        id:
            ++player.managerOfferId,

        type:
            "fight",

        status:
            "pending",

        createdWeek:
            currentWeek,

        createdYear:
            currentYear,

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
            {
                ...opponent
            },

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
                negotiation.ppv || 0
            ),

        accepted:
            false,

        declined:
            false,

        expired:
            false,

        fightWeek:
            null,

        fightYear:
            null,

        weeksRemaining:
            campWeeks

    };

}


/* =========================================================
   PODE PROCURAR LUTA
========================================================= */

function managerCanSearchFight() {

    const player =
        ensureManagerData();

    if (
        !player ||
        !hasManager()
    ) {

        return false;

    }


    /*
       Amador/profissionalização continua
       sendo tratada separadamente.
    */


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


    /*
       Não procurar nova luta enquanto
       contrato ainda possui lutas.
    */

    if (
        player.currentContract &&
        Number(
            player.currentContract.fightsRemaining || 0
        ) > 0
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
   COMPATIBILIDADE

   Alguns sistemas antigos podem chamar:

   managerSearchForFight()
========================================================= */

function managerSearchForFight() {

    return processManagerFightOffer();

}


/* =========================================================
   PROCESSAR OFERTA
========================================================= */

function processManagerFightOffer() {

    const player =
        ensureManagerData();

    if (
        !player ||
        !hasManager()
    ) {

        return null;

    }


    if (
        !managerCanSearchFight()
    ) {

        return (
            player.managerFightOffer ||
            null
        );

    }


    const currentWeek =
        Number(
            player.week || 0
        );


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


    player.managerSearching =
        true;


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


        player.managerSearching =
            false;


        managerSave();

        managerRefreshUI();


        return null;

    }


    const offer =
        generateManagerFightOffer();


    if (!offer) {

        player.managerSearching =
            false;

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


    syncManagerOfferToMain();


    if (
        Array.isArray(player.log)
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

    managerRefreshUI();


    return offer;

}


/* =========================================================
   NEGOCIAR OFERTA
========================================================= */

function negotiateManagerFightOffer() {

    const player =
        ensureManagerData();

    if (!player) {
        return false;
    }


    const offer =
        player.managerFightOffer;


    if (!offer) {

        alert(
            "Não existe nenhuma oferta para negociar."
        );

        return false;

    }


    if (
        !offer.negotiation ||
        offer.negotiation.available !== true
    ) {

        alert(
            "Esta oferta não pode ser negociada."
        );

        return false;

    }


    if (
        offer.negotiation.negotiated === true
    ) {

        alert(
            "Esta oferta já foi negociada."
        );

        return false;

    }


    const negotiation =
        offer.negotiation;


    const roll =
        Math.random() * 100;


    negotiation.negotiated =
        true;


    if (
        roll <=
        Number(
            negotiation.successChance
        )
    ) {

        const newPurse =
            Number(
                negotiation.requested
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
            newPurse +
            offer.winBonus;


        negotiation.currentPurse =
            newPurse;


        negotiation.accepted =
            true;


        offer.ppvPercentage =
            Number(
                negotiation.ppv || 0
            );


        if (
            Array.isArray(player.log)
        ) {

            player.log.unshift(
                `🤝 Negociação aceita! A bolsa foi aumentada para $${newPurse.toLocaleString("en-US")}.`
            );

        }

    }
    else {

        negotiation.accepted =
            false;


        if (
            Array.isArray(player.log)
        ) {

            player.log.unshift(
                "❌ A organização recusou a negociação. A oferta original continua válida."
            );

        }

    }


    player.managerFightOffer =
        offer;


    player.managerOfferPending =
        true;


    syncManagerOfferToMain();


    managerSave();

    managerRefreshUI();


    return negotiation.accepted;

}


/* =========================================================
   ACEITAR OFERTA
========================================================= */

function acceptManagerFightOffer() {

    const player =
        ensureManagerData();

    if (!player) {
        return false;
    }


    const offer =
        player.managerFightOffer;


    if (!offer) {

        alert(
            "Não existe nenhuma proposta de luta."
        );

        return false;

    }


    if (!offer.opponent) {

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
            "Você ainda está se recuperando."
        );

        return false;

    }


    /*
       Proteção contra dois contratos simultâneos.
    */

    if (
        player.currentContract &&
        Number(
            player.currentContract.fightsRemaining || 0
        ) > 0
    ) {

        alert(
            "Você já possui um contrato ativo."
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


    const currentYear =
        Number(
            player.year || 2026
        );


    const fightAbsolute =
        managerAbsoluteWeek(
            currentYear,
            currentWeek
        ) +
        campWeeks;


    const fightYear =
        Math.floor(
            fightAbsolute / 53
        );


    const fightWeek =
        fightAbsolute % 53;


    const opponent =
        {
            ...offer.opponent
        };


    /*
       Segurança contra OVR inválido.
    */

    const opponentPower =
        managerClamp(

            Number(
                opponent.power ||
                opponent.overall ||
                45
            ),

            1,
            99

        );


    opponent.power =
        opponentPower;


    opponent.overall =
        opponentPower;


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
            "scheduled",

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
            Boolean(
                offer.isBigEvent
            ),

        opponent:
            opponent,

        opponentName:
            opponent.name,

        opponentDisplayName:
            opponent.displayName ||
            opponent.name,

        opponentOverall:
            opponentPower,

        opponentPower:
            opponentPower,

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
                offer.contractFights || 1
            ),

        contractRemaining:
            Number(
                offer.contractFights || 1
            ),

        campWeeks:
            campWeeks,

        campStartWeek:
            currentWeek,

        campStartYear:
            currentYear,

        fightWeek:
            fightWeek,

        fightYear:
            fightYear,

        /*
           Compatibilidade com main.js
        */

        week:
            fightWeek,

        year:
            fightYear,

        weeksRemaining:
            campWeeks,

        acceptedWeek:
            currentWeek,

        acceptedYear:
            currentYear,

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


    /* =====================================================
       CONTRATO
    ===================================================== */

    player.managerContractFightNumber =
        Number(
            player.managerContractFightNumber || 0
        );


    player.managerContractTotalFights =
        Number(
            offer.contractFights || 1
        );


    player.managerContractEvent =
        offer.eventName;


    player.managerContractCategory =
        offer.eventCategory;


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
                offer.contractFights || 1
            ),

        fightsCompleted:
            0,

        fightsRemaining:
            Number(
                offer.contractFights || 1
            ),

        purse:
            Number(
                offer.purse || 0
            ),

        winBonus:
            Number(
                offer.winBonus || 0
            ),

        ppv:
            Number(
                offer.ppvPercentage || 0
            )

    };


    /*
       Oferta deixa de existir.
    */

    clearManagerOffer();


    player.managerSearching =
        false;


    player.managerSearchCooldown =
        0;


    player.managerNextSearchWeek =
        fightAbsolute;


    if (
        Array.isArray(player.log)
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
                `💰 Bolsa: $${Number(offer.purse || 0).toLocaleString("en-US")} + $${Number(offer.winBonus || 0).toLocaleString("en-US")} de bônus.`
            );

        }


        player.log.unshift(
            `🏋️ Camp de ${campWeeks} semanas iniciado. A luta será na semana ${fightWeek}.`
        );

    }


    managerSave();

    managerRefreshUI();


    return true;

}


/* =========================================================
   RECUSAR OFERTA
========================================================= */

function declineManagerFightOffer() {

    const player =
        ensureManagerData();

    if (
        !player ||
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


    clearManagerOffer();


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
            2,
            4
        );


    if (
        Array.isArray(player.log)
    ) {

        player.log.unshift(
            `❌ Você recusou a luta contra ${opponentName}.`
        );

        player.log.unshift(
            "📅 Seu empresário vai procurar outra oportunidade."
        );

    }


    managerSave();

    managerRefreshUI();


    return true;

}


/* =========================================================
   CAMP
========================================================= */

function isInFightCamp() {

    const player =
        managerPlayer();

    const fight =
        player?.nextFight;


    if (!fight) {
        return false;
    }


    if (
        fight.completed === true
    ) {

        return false;

    }


    return (

        fight.status === "camp" ||
        fight.status === "scheduled" ||
        fight.status === "ready" ||
        fight.status === "fight_day"

    );

}


/* =========================================================
   DIA DA LUTA
========================================================= */

function managerIsFightDay() {

    const player =
        managerPlayer();

    const fight =
        player?.nextFight;


    if (!fight) {
        return false;
    }


    if (
        fight.completed === true
    ) {

        return false;

    }


    if (
        fight.status === "fight_day"
    ) {

        return true;

    }


    const currentAbsolute =
        managerAbsoluteWeek(
            player.year,
            player.week
        );


    const fightAbsolute =
        managerAbsoluteWeek(

            fight.fightYear ||
            fight.year ||
            player.year,

            fight.fightWeek ||
            fight.week ||
            player.week

        );


    return (
        currentAbsolute >=
        fightAbsolute
    );

}


/* =========================================================
   PROCESSAR CAMP
========================================================= */

function processManagerCampWeek() {

    const player =
        ensureManagerData();

    const fight =
        player?.nextFight;


    if (
        !player ||
        !fight ||
        fight.completed === true
    ) {

        return;

    }


    const currentAbsolute =
        managerAbsoluteWeek(
            player.year,
            player.week
        );


    const fightAbsolute =
        managerAbsoluteWeek(

            fight.fightYear ||
            fight.year ||
            player.year,

            fight.fightWeek ||
            fight.week ||
            player.week

        );


    const remaining =
        Math.max(
            0,
            fightAbsolute -
            currentAbsolute
        );


    fight.weeksRemaining =
        remaining;


    if (
        currentAbsolute <
        fightAbsolute
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
        fight.fightDayNotified !== true
    ) {

        fight.fightDayNotified =
            true;


        if (
            Array.isArray(player.log)
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
        ensureManagerData();


    if (
        !player ||
        player.postFightRestActive !== true
    ) {

        return false;

    }


    let remaining =
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


    remaining =
        Math.max(
            0,
            remaining - 1
        );


    player.postFightRestWeeks =
        remaining;


    if (
        remaining <= 0
    ) {

        player.postFightRestWeeks =
            0;

        player.postFightRestActive =
            false;


        player.managerSearchAfterRest =
            true;


        const currentWeek =
            Number(
                player.week || 0
            );


        player.managerNextSearchWeek =
            currentWeek +
            managerRandomInt(
                MANAGER_CONFIG.minSearchWaitWeeks,
                MANAGER_CONFIG.maxSearchWaitWeeks
            );


        if (
            Array.isArray(player.log)
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
            Array.isArray(player.log)
        ) {

            player.log.unshift(
                `🛌 Recuperação pós-luta: ${remaining} semana(s) restante(s).`
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
        ensureManagerData();


    if (
        !player ||
        !hasManager()
    ) {

        return;

    }


    /*
       RECUPERAÇÃO TEM PRIORIDADE.
    */

    if (
        player.postFightRestActive === true
    ) {

        processManagerPostFightRest();

        return;

    }


    /*
       LUTA MARCADA.
    */

    if (
        player.nextFight
    ) {

        processManagerCampWeek();

        return;

    }


    /*
       OFERTA EXISTENTE.
    */

    if (
        player.managerFightOffer
    ) {

        return;

    }


    /*
       PROFISSIONALIZAÇÃO.
    */

    if (
        managerCanAskProfessional()
    ) {

        processManagerProfessionalTransition();

        return;

    }


    /*
       BUSCAR LUTA.
    */

    processManagerFightOffer();

}


/* =========================================================
   BLOQUEAR AVANÇO NA SEMANA DA LUTA
========================================================= */

function managerShouldBlockWeekAdvance() {

    return managerIsFightDay();

}


/* =========================================================
   PODE LUTAR
========================================================= */

function managerCanFightNow() {

    return managerIsFightDay();

}


/* =========================================================
   COMPLETAR LUTA
========================================================= */

function completeManagerFight(result) {

    const player =
        ensureManagerData();


    if (
        !player ||
        !player.nextFight
    ) {

        return false;

    }


    const fight =
        player.nextFight;


    fight.status =
        "completed";


    fight.completed =
        true;


    fight.result =
        result || null;


    /* =====================================================
       CONTRATO
    ===================================================== */

    if (
        player.currentContract
    ) {

        player.currentContract.fightsCompleted =
            Number(
                player.currentContract.fightsCompleted || 0
            ) + 1;


        player.currentContract.fightsRemaining =
            Math.max(

                0,

                Number(
                    player.currentContract.fightsRemaining || 0
                ) - 1

            );


        player.managerContractFightNumber =
            Number(
                player.managerContractFightNumber || 0
            ) + 1;


        if (
            player.currentContract.fightsRemaining <= 0
        ) {

            if (
                Array.isArray(player.log)
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


    /* =====================================================
       DESCANSO
    ===================================================== */

    player.postFightRestWeeks =
        MANAGER_CONFIG.postFightRestWeeks;


    player.postFightRestActive =
        true;


    player.managerSearchAfterRest =
        false;


    /* =====================================================
       LIMPAR LUTA
    ===================================================== */

    player.nextFight =
        null;


    clearManagerOffer();


    player.managerSearching =
        false;


    player.managerSearchCooldown =
        0;


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
        Array.isArray(player.log)
    ) {

        player.log.unshift(
            `🛌 Descanso pós-luta iniciado. Você terá ${MANAGER_CONFIG.postFightRestWeeks} semanas de recuperação.`
        );

        player.log.unshift(
            "📋 O empresário encerrou o processo desta luta."
        );

    }


    managerSave();

    managerRefreshUI();


    return true;

}


/* =========================================================
   CANCELAR LUTA
========================================================= */

function cancelManagerFight(reason) {

    const player =
        ensureManagerData();


    if (
        !player ||
        !player.nextFight
    ) {

        return false;

    }


    const opponent =
        player.nextFight.opponentName ||
        "adversário";


    player.nextFight =
        null;


    clearManagerOffer();


    player.managerSearching =
        false;


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
        Array.isArray(player.log)
    ) {

        player.log.unshift(
            `⚠️ A luta contra ${opponent} foi cancelada${reason ? `: ${reason}` : "."}`
        );

    }


    managerSave();

    managerRefreshUI();


    return true;

}


/* =========================================================
   PROFISSIONALIZAÇÃO
========================================================= */

function managerCanAskProfessional() {

    const player =
        ensureManagerData();


    if (!player) {
        return false;
    }


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
        player.professionalDecisionMade === true
    ) {

        return false;

    }


    if (
        player.professionalDecisionPending === true
    ) {

        return false;

    }


    return true;

}


/* =========================================================
   PERGUNTA PROFISSIONAL
========================================================= */

function askProfessionalTransition() {

    const player =
        ensureManagerData();


    if (
        !managerCanAskProfessional()
    ) {

        return false;

    }


    player.professionalDecisionPending =
        true;


    if (
        Array.isArray(player.log)
    ) {

        player.log.unshift(
            "💼 Seu empresário acredita que você está pronto para o MMA profissional."
        );

    }


    managerSave();


    try {

        const answer =
            window.confirm(

                "Seu empresário acredita que você está pronto para se tornar profissional.\n\nDeseja migrar para o MMA profissional?"

            );


        if (
            answer
        ) {

            return acceptProfessionalTransition();

        }


        return declineProfessionalTransition();

    }
    catch (error) {

        console.warn(
            "MANAGER: não foi possível abrir confirmação profissional."
        );

        /*
           Não deixar estado travado
           se o navegador impedir confirm().
        */

        player.professionalDecisionPending =
            false;

        managerSave();

    }


    return false;

}


/* =========================================================
   ACEITAR PROFISSIONAL
========================================================= */

function acceptProfessionalTransition() {

    const player =
        ensureManagerData();


    if (!player) {
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
        typeof player.professional.wins !== "number"
    ) {

        player.professional.wins = 0;

    }


    if (
        typeof player.professional.losses !== "number"
    ) {

        player.professional.losses = 0;

    }


    if (
        typeof player.professional.draws !== "number"
    ) {

        player.professional.draws = 0;

    }


    player.managerNextSearchWeek =
        Number(
            player.week || 0
        ) +
        managerRandomInt(
            1,
            3
        );


    if (
        Array.isArray(player.log)
    ) {

        player.log.unshift(
            "🥊 PARABÉNS! Você se tornou um atleta profissional."
        );

        player.log.unshift(
            "💼 Seu empresário começará a buscar oportunidades profissionais."
        );

    }


    managerSave();

    managerRefreshUI();


    return true;

}


/* =========================================================
   RECUSAR PROFISSIONAL
========================================================= */

function declineProfessionalTransition() {

    const player =
        ensureManagerData();


    if (!player) {
        return false;
    }


    player.professionalDecisionPending =
        false;


    player.professionalDecisionMade =
        true;


    player.professionalDecisionWeek =
        Number(
            player.week || 0
        );


    if (
        Array.isArray(player.log)
    ) {

        player.log.unshift(
            "🥊 Você decidiu continuar no MMA amador por enquanto."
        );

    }


    /*
       Depois da decisão, permite nova
       avaliação somente após cooldown.
    */

    player.managerNextSearchWeek =
        Number(
            player.week || 0
        ) +
        MANAGER_CONFIG.professionalDecisionCooldownWeeks;


    managerSave();

    managerRefreshUI();


    return true;

}


/* =========================================================
   PROCESSAR PROFISSIONALIZAÇÃO
========================================================= */

function processManagerProfessionalTransition() {

    const player =
        ensureManagerData();


    if (
        !player ||
        !managerCanAskProfessional()
    ) {

        return false;

    }


    /*
       Cooldown real após decisão.
    */

    const currentWeek =
        Number(
            player.week || 0
        );


    const decisionWeek =
        Number(
            player.professionalDecisionWeek ||
            -999
        );


    if (
        decisionWeek > -999 &&
        currentWeek <
        decisionWeek +
        MANAGER_CONFIG.professionalDecisionCooldownWeeks
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
        ensureManagerData();


    if (!player) {
        return false;
    }


    const selected =
        getAvailableManagers().find(
            function(manager) {

                return (
                    manager.id ===
                    managerId
                );

            }
        );


    if (!selected) {

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


    clearManagerOffer();


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
        Array.isArray(player.log)
    ) {

        player.log.unshift(
            `💼 Você contratou o empresário ${selected.name}.`
        );

        player.log.unshift(
            "📅 Seu novo empresário começará a procurar oportunidades."
        );

    }


    managerSave();

    managerRefreshUI();


    return true;

}


/* =========================================================
   DEMITIR
========================================================= */

function fireManager() {

    const player =
        ensureManagerData();


    if (
        !player ||
        !hasManager()
    ) {

        return false;

    }


    const managerName =
        player.manager.name ||
        "seu empresário";


    player.manager =
        null;


    clearManagerOffer();


    player.managerSearching =
        false;


    player.managerSearchCooldown =
        0;


    if (
        Array.isArray(player.log)
    ) {

        player.log.unshift(
            `💼 Você encerrou o contrato com ${managerName}.`
        );

        player.log.unshift(
            "🔎 Agora você precisa procurar outro empresário."
        );

    }


    managerSave();

    managerRefreshUI();


    return true;

}


/* =========================================================
   TESTE
========================================================= */

function createManagerTestOffer() {

    const player =
        ensureManagerData();


    if (
        !player ||
        !hasManager()
    ) {

        return false;

    }


    if (
        player.nextFight ||
        player.postFightRestActive
    ) {

        return false;

    }


    if (
        player.currentContract &&
        Number(
            player.currentContract.fightsRemaining || 0
        ) > 0
    ) {

        return false;

    }


    const offer =
        generateManagerFightOffer();


    if (!offer) {
        return false;
    }


    player.managerFightOffer =
        offer;


    player.managerOfferPending =
        true;


    syncManagerOfferToMain();


    managerSave();

    managerRefreshUI();


    return true;

}


/* =========================================================
   FORÇAR OFERTA
========================================================= */

function forceManagerFightOffer() {

    const player =
        ensureManagerData();


    if (
        !player ||
        !hasManager()
    ) {

        return false;

    }


    if (
        player.nextFight ||
        player.postFightRestActive
    ) {

        return false;

    }


    if (
        player.currentContract &&
        Number(
            player.currentContract.fightsRemaining || 0
        ) > 0
    ) {

        return false;

    }


    const offer =
        generateManagerFightOffer();


    if (!offer) {
        return false;
    }


    player.managerFightOffer =
        offer;


    player.managerOfferPending =
        true;


    syncManagerOfferToMain();


    managerSave();

    managerRefreshUI();


    return offer;

}


/* =========================================================
   GETTERS
========================================================= */

function getManagerFightOffer() {

    const player =
        ensureManagerData();


    return (
        player?.managerFightOffer ||
        null
    );

}


function getManagerCurrentFight() {

    const player =
        managerPlayer();


    return (
        player?.nextFight ||
        null
    );

}


function getManagerPostFightRest() {

    const player =
        ensureManagerData();


    return {

        active:
            player?.postFightRestActive === true,

        weeksRemaining:
            Number(
                player?.postFightRestWeeks || 0
            )

    };

}


/* =========================================================
   ANO
========================================================= */

function processManagerContractYear() {

    const player =
        ensureManagerData();


    if (
        !player?.manager
    ) {

        return;

    }


    player.manager.experience =
        managerClamp(

            Number(
                player.manager.experience || 50
            ) + 1,

            1,
            100

        );


    player.manager.network =
        managerClamp(

            Number(
                player.manager.network || 50
            ) + 1,

            1,
            100

        );


    managerSave();

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initializeManagers() {

    ensureManagerData();

}


/* =========================================================
   EXPORTAÇÕES
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

/*
   COMPATIBILIDADE COM VERSÕES ANTIGAS
*/

window.managerSearchForFight =
    managerSearchForFight;

window.searchManagerFight =
    managerSearchForFight;


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
   INICIALIZAÇÃO SEGURA
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeManagers,
        {
            once: true
        }
    );

}
else {

    initializeManagers();

}


/* =========================================================
   FIM DO MANAGERS.JS
========================================================= */
