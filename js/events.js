/* =========================================================
   MMA LIFE DYNASTY
   EVENTS.JS
   PROJETO 1 — EVENTOS + CINTURÕES + MUNDO MMA
========================================================= */


/* =========================================================
   EVENTOS
========================================================= */

const events = [

    /* =====================================================
       🥋 AMADOR
       ===================================================== */

    {
        id: "amateur_cup",
        name: "Copa Amadora de MMA",
        level: 0,
        international: false,
        professional: false,
        careerStage: "amateur",
        purse: 0,
        winBonus: 0,
        prestige: 5,
        championship: false
    },

    {
        id: "amateur_brazil",
        name: "Circuito Amador Brasileiro",
        level: 0,
        international: false,
        professional: false,
        careerStage: "amateur",
        purse: 0,
        winBonus: 0,
        prestige: 7,
        championship: false
    },

    {
        id: "amateur_state",
        name: "Campeonato Estadual de MMA",
        level: 0,
        international: false,
        professional: false,
        careerStage: "amateur",
        purse: 0,
        winBonus: 0,
        prestige: 10,
        championship: false
    },


    /* =====================================================
       🇧🇷 REGIONAL
       ===================================================== */

    {
        id: "shooto_brasil",
        name: "Shooto Brasil",
        level: 1,
        international: false,
        professional: true,
        careerStage: "regional",
        country: "Brasil",
        purse: 300,
        winBonus: 300,
        prestige: 25,
        championship: true
    },

    {
        id: "regional_brazilian",
        name: "Circuito Regional Brasileiro",
        level: 1,
        international: false,
        professional: true,
        careerStage: "regional",
        country: "Brasil",
        purse: 300,
        winBonus: 300,
        prestige: 20,
        championship: true
    },

    {
        id: "regional_fight_night",
        name: "Regional MMA Fight Night",
        level: 1,
        international: false,
        professional: true,
        careerStage: "regional",
        country: "Brasil",
        purse: 300,
        winBonus: 300,
        prestige: 15,
        championship: true
    },


    /* =====================================================
       🇧🇷 NACIONAL
       ===================================================== */

    {
        id: "jungle_fight",
        name: "Jungle Fight",
        level: 2,
        international: false,
        professional: true,
        careerStage: "national",
        country: "Brasil",
        purse: 1000,
        winBonus: 1000,
        prestige: 45,
        championship: true
    },

    {
        id: "brazilian_mma_championship",
        name: "Campeonato Brasileiro de MMA",
        level: 2,
        international: false,
        professional: true,
        careerStage: "national",
        country: "Brasil",
        purse: 1000,
        winBonus: 1000,
        prestige: 40,
        championship: true
    },

    {
        id: "brazil_mma_championship",
        name: "Brazil MMA Championship",
        level: 3,
        international: false,
        professional: true,
        careerStage: "national",
        country: "Brasil",
        purse: 1000,
        winBonus: 1000,
        prestige: 50,
        championship: true
    },


    /* =====================================================
       🇺🇸 NACIONAL ESTRANGEIRO
       ===================================================== */

    {
        id: "lfa",
        name: "LFA",
        level: 2,
        international: false,
        professional: true,
        careerStage: "national",
        country: "Estados Unidos",
        foreign: true,
        purse: 1000,
        winBonus: 1000,
        prestige: 50,
        championship: true,
        foreignChance: 5
    },

    {
        id: "cffc",
        name: "CFFC",
        level: 2,
        international: false,
        professional: true,
        careerStage: "national",
        country: "Estados Unidos",
        foreign: true,
        purse: 1000,
        winBonus: 1000,
        prestige: 45,
        championship: true,
        foreignChance: 4
    },


    /* =====================================================
       🌎 INTERNACIONAL
       ===================================================== */

    {
        id: "pfl",
        name: "PFL",
        level: 4,
        international: true,
        professional: true,
        careerStage: "international",
        country: "Estados Unidos",
        purse: 8000,
        winBonus: 8000,
        prestige: 80,
        championship: true,
        minimumManagerContacts: 45
    },

    {
        id: "one",
        name: "ONE Championship",
        level: 4,
        international: true,
        professional: true,
        careerStage: "international",
        country: "Singapura",
        purse: 8000,
        winBonus: 8000,
        prestige: 82,
        championship: true,
        minimumManagerContacts: 45
    },

    {
        id: "bellator",
        name: "Bellator",
        level: 4,
        international: true,
        professional: true,
        careerStage: "international",
        country: "Estados Unidos",
        purse: 7500,
        winBonus: 7500,
        prestige: 78,
        championship: true,
        minimumManagerContacts: 45
    },

    {
        id: "rizin",
        name: "RIZIN",
        level: 4,
        international: true,
        professional: true,
        careerStage: "international",
        country: "Japão",
        purse: 7000,
        winBonus: 7000,
        prestige: 75,
        championship: true,
        minimumManagerContacts: 45
    },

    {
        id: "ksw",
        name: "KSW",
        level: 4,
        international: true,
        professional: true,
        careerStage: "international",
        country: "Polônia",
        purse: 6000,
        winBonus: 6000,
        prestige: 70,
        championship: true,
        minimumManagerContacts: 45
    },

    {
        id: "oktagon",
        name: "OKTAGON MMA",
        level: 4,
        international: true,
        professional: true,
        careerStage: "international",
        country: "República Tcheca",
        purse: 6000,
        winBonus: 6000,
        prestige: 68,
        championship: true,
        minimumManagerContacts: 45
    },

    {
        id: "cage_warriors",
        name: "Cage Warriors",
        level: 4,
        international: true,
        professional: true,
        careerStage: "international",
        country: "Reino Unido",
        purse: 5000,
        winBonus: 5000,
        prestige: 65,
        championship: true,
        minimumManagerContacts: 45
    },

    {
        id: "brave",
        name: "BRAVE Combat Federation",
        level: 4,
        international: true,
        professional: true,
        careerStage: "international",
        country: "Bahrein",
        purse: 5000,
        winBonus: 5000,
        prestige: 65,
        championship: true,
        minimumManagerContacts: 45
    },

    {
        id: "uae_warriors",
        name: "UAE Warriors",
        level: 4,
        international: true,
        professional: true,
        careerStage: "international",
        country: "Emirados Árabes Unidos",
        purse: 5500,
        winBonus: 5500,
        prestige: 67,
        championship: true,
        minimumManagerContacts: 45
    },


    /* =====================================================
       👑 ELITE — UFC
       ===================================================== */

    {
        id: "ufc_fight_night",
        name: "UFC Fight Night",
        level: 6,
        international: true,
        professional: true,
        careerStage: "elite",
        country: "Estados Unidos",
        purse: 12000,
        winBonus: 12000,
        prestige: 100,
        championship: true,
        minimumManagerContacts: 80
    },

    {
        id: "ufc",
        name: "UFC",
        level: 6,
        international: true,
        professional: true,
        careerStage: "elite",
        country: "Estados Unidos",
        purse: 12000,
        winBonus: 12000,
        prestige: 100,
        championship: true,
        minimumManagerContacts: 80
    }

];


/* =========================================================
   CATEGORIAS OFICIAIS DO JOGO
========================================================= */

const eventWeightClasses = [

    "Peso Leve",
    "Peso Meio-Médio",
    "Peso Médio",
    "Peso Meio-Pesado",
    "Peso Pesado"

];


/* =========================================================
   ESTRUTURA DE CINTURÃO
========================================================= */

function createChampionship(event, weightClass) {

    return {

        id:
            event.id +
            "_" +
            weightClass
                .toLowerCase()
                .replace(/\s+/g, "_"),

        organization:
            event.name,

        organizationId:
            event.id,

        weightClass:
            weightClass,

        champion: null,

        interimChampion: null,

        defenses: 0,

        titleFights: 0,

        created: true

    };

}


/* =========================================================
   GERAR CINTURÕES DE UMA ORGANIZAÇÃO
========================================================= */

function generateOrganizationChampionships(event) {

    if (
        !event ||
        !event.championship
    ) {

        return [];

    }


    return eventWeightClasses.map(
        weightClass =>
            createChampionship(
                event,
                weightClass
            )
    );

}


/* =========================================================
   OBTER CINTURÃO DO EVENTO
========================================================= */

function getEventChampionship(
    event,
    weightClass
) {

    if (
        !event ||
        !event.championship
    ) {

        return null;

    }


    return {

        organization:
            event.name,

        organizationId:
            event.id,

        weightClass:
            weightClass,

        champion:
            null,

        interimChampion:
            null,

        defenses:
            0,

        titleFights:
            0

    };

}


/* =========================================================
   ESTÁGIO DA CARREIRA
========================================================= */

function getCareerStage() {

    if (
        !player.professional ||
        !player.professional.active
    ) {

        return "amateur";

    }


    return (
        player.careerStage ||
        "regional"
    );

}


/* =========================================================
   EVENTO AMADOR
========================================================= */

function generateAmateurEvent() {

    const amateurEvents =
        events.filter(
            event =>
                event.careerStage ===
                "amateur"
        );


    return amateurEvents[
        Math.floor(
            Math.random() *
            amateurEvents.length
        )
    ];

}


/* =========================================================
   EVENTOS REGIONAIS
========================================================= */

function generateRegionalEvent() {

    const regionalEvents =
        events.filter(
            event =>
                event.careerStage ===
                "regional"
        );


    return regionalEvents[
        Math.floor(
            Math.random() *
            regionalEvents.length
        )
    ];

}


/* =========================================================
   EVENTOS NACIONAIS
========================================================= */

function generateNationalEvent() {

    const nationalEvents =
        events.filter(
            event =>
                event.careerStage ===
                "national" &&
                !event.foreign
        );


    if (
        player.country ===
        "Brasil"
    ) {

        if (
            player.manager &&
            Math.random() < 0.08
        ) {

            const foreignEvents =
                events.filter(
                    event =>
                        event.careerStage ===
                        "national" &&
                        event.foreign
                );


            if (
                foreignEvents.length > 0
            ) {

                return foreignEvents[
                    Math.floor(
                        Math.random() *
                        foreignEvents.length
                    )
                ];

            }

        }

    }


    return nationalEvents[
        Math.floor(
            Math.random() *
            nationalEvents.length
        )
    ];

}


/* =========================================================
   EVENTOS INTERNACIONAIS
========================================================= */

function generateInternationalEvent() {

    const internationalEvents =
        events.filter(
            event =>
                event.careerStage ===
                "international"
        );


    return internationalEvents[
        Math.floor(
            Math.random() *
            internationalEvents.length
        )
    ];

}


/* =========================================================
   EVENTOS ELITE
========================================================= */

function generateEliteEvent() {

    const eliteEvents =
        events.filter(
            event =>
                event.careerStage ===
                "elite"
        );


    return eliteEvents[
        Math.floor(
            Math.random() *
            eliteEvents.length
        )
    ];

}


/* =========================================================
   PFL WORLD TOURNAMENT
========================================================= */

function generatePFLTournament() {

    return {

        id:
            "pfl_world_tournament",

        name:
            "PFL World Tournament",

        level:
            5,

        international:
            true,

        professional:
            true,

        careerStage:
            "international",

        country:
            "Estados Unidos",

        purse:
            8000,

        winBonus:
            8000,

        prestige:
            90,

        championship:
            true,

        tournament:
            true,

        tournamentName:
            "PFL World Tournament",

        tournamentPrize:
            1000000,

        tournamentRound:
            1,

        titleFight:
            false

    };

}


/* =========================================================
   GERAR EVENTO
========================================================= */

function generateEvent() {

    const stage =
        getCareerStage();


    if (
        stage ===
        "amateur"
    ) {

        return generateAmateurEvent();

    }


    if (
        stage ===
        "regional"
    ) {

        return generateRegionalEvent();

    }


    if (
        stage ===
        "national"
    ) {

        return generateNationalEvent();

    }


    if (
        stage ===
        "international"
    ) {

        if (
            player.manager &&
            Math.random() < 0.10
        ) {

            return generatePFLTournament();

        }


        return generateInternationalEvent();

    }


    if (
        stage ===
        "elite"
    ) {

        return generateEliteEvent();

    }


    return generateAmateurEvent();

}


/* =========================================================
   PREPARAR EVENTO PARA O LUTADOR
========================================================= */

function prepareEventForPlayer(event) {

    if (!event) {

        return null;

    }


    const weightClass =
        player.weight ||
        "Peso Leve";


    const prepared = {

        ...event,

        weightClass:
            weightClass,

        titleFight:
            false,

        championship:
            event.championship
                ? getEventChampionship(
                    event,
                    weightClass
                )
                : null

    };


    /*
     * Se o jogador já possuir cinturão
     * naquela organização e categoria,
     * existe possibilidade de defesa.
     */

    if (
        player.championship &&
        player.championship.title &&
        player.championship.organization ===
            event.name &&
        player.championship.weightClass ===
            weightClass
    ) {

        prepared.titleFight =
            true;

        prepared.titleDefense =
            true;

    }


    return prepared;

}


/* =========================================================
   UTILIDADE — PRESTÍGIO
========================================================= */

function getEventPrestige(event) {

    if (!event) {

        return 0;

    }


    return event.prestige || 0;

}


/* =========================================================
   UTILIDADE — BOLSA
========================================================= */

function getEventPurse(event) {

    if (!event) {

        return 0;

    }


    return event.purse || 0;

}


/* =========================================================
   UTILIDADE — BÔNUS
========================================================= */

function getEventWinBonus(event) {

    if (!event) {

        return 0;

    }


    return (
        event.winBonus ||
        event.purse ||
        0
    );

}


/* =========================================================
   🌎 MUNDO MMA — SIMULAÇÃO INDEPENDENTE
========================================================= */

const mmaWorld = {

    initialized: false,

    week: 0,

    fighters: [],

    eventsThisWeek: [],

    news: [],

    championships: []

};


/* =========================================================
   NOMES PARA LUTADORES DO MUNDO
========================================================= */

const worldFirstNames = [

    "Carlos",
    "João",
    "Pedro",
    "Lucas",
    "Rafael",
    "Gabriel",
    "Mateus",
    "Bruno",
    "Diego",
    "André",
    "Felipe",
    "Victor",
    "Marcos",
    "Thiago",
    "Gustavo",
    "Daniel",
    "Leonardo",
    "Ricardo",
    "Alex",
    "Eduardo"

];


const worldLastNames = [

    "Silva",
    "Santos",
    "Oliveira",
    "Souza",
    "Costa",
    "Pereira",
    "Almeida",
    "Ferreira",
    "Rodrigues",
    "Martins",
    "Carvalho",
    "Lima",
    "Gomes",
    "Ribeiro",
    "Barbosa",
    "Mendes",
    "Dias",
    "Teixeira",
    "Moreira",
    "Correia"

];


/* =========================================================
   PAÍSES
========================================================= */

const worldCountries = [

    "Brasil",
    "Estados Unidos",
    "Japão",
    "México",
    "Canadá",
    "Reino Unido",
    "Rússia",
    "França",
    "Austrália",
    "Argentina"

];


/* =========================================================
   CATEGORIAS
========================================================= */

const worldWeights = [

    "Peso Leve",
    "Peso Meio-Médio",
    "Peso Médio",
    "Peso Meio-Pesado",
    "Peso Pesado"

];


/* =========================================================
   ORGANIZAÇÕES DO MUNDO
========================================================= */

const worldOrganizations = [

    {
        id: "world_regional_brazil",
        name: "Circuito Regional Brasileiro",
        stage: "regional",
        country: "Brasil",
        level: 1,
        prestige: 20
    },

    {
        id: "world_shooto_brasil",
        name: "Shooto Brasil",
        stage: "regional",
        country: "Brasil",
        level: 1,
        prestige: 25
    },

    {
        id: "world_jungle_fight",
        name: "Jungle Fight",
        stage: "national",
        country: "Brasil",
        level: 2,
        prestige: 45
    },

    {
        id: "world_lfa",
        name: "LFA",
        stage: "national",
        country: "Estados Unidos",
        level: 2,
        prestige: 50
    },

    {
        id: "world_pfl",
        name: "PFL",
        stage: "international",
        country: "Estados Unidos",
        level: 4,
        prestige: 80
    },

    {
        id: "world_one",
        name: "ONE Championship",
        stage: "international",
        country: "Singapura",
        level: 4,
        prestige: 82
    },

    {
        id: "world_bellator",
        name: "Bellator",
        stage: "international",
        country: "Estados Unidos",
        level: 4,
        prestige: 78
    },

    {
        id: "world_rizin",
        name: "RIZIN",
        stage: "international",
        country: "Japão",
        level: 4,
        prestige: 75
    },

    {
        id: "world_ksw",
        name: "KSW",
        stage: "international",
        country: "Polônia",
        level: 4,
        prestige: 70
    },

    {
        id: "world_uae",
        name: "UAE Warriors",
        stage: "international",
        country: "Emirados Árabes",
        level: 4,
        prestige: 67
    },

    {
        id: "world_ufc",
        name: "UFC",
        stage: "elite",
        country: "Estados Unidos",
        level: 6,
        prestige: 100
    }

];


/* =========================================================
   GERAR NOME
========================================================= */

function worldRandomName() {

    const first =
        worldFirstNames[
            Math.floor(
                Math.random() *
                worldFirstNames.length
            )
        ];


    const last =
        worldLastNames[
            Math.floor(
                Math.random() *
                worldLastNames.length
            )
        ];


    return first + " " + last;

}


/* =========================================================
   CRIAR LUTADOR DO MUNDO
========================================================= */

function createWorldFighter(
    weight,
    organization,
    index
) {

    return {

        id:
            "world_" +
            Date.now() +
            "_" +
            index +
            "_" +
            Math.floor(
                Math.random() * 100000
            ),

        name:
            worldRandomName(),

        country:
            worldCountries[
                Math.floor(
                    Math.random() *
                    worldCountries.length
                )
            ],

        weight:
            weight,

        organization:
            organization.name,

        organizationId:
            organization.id,

        organizationLevel:
            organization.level,

        careerStage:
            organization.stage,

        wins:
            Math.floor(
                Math.random() * 8
            ),

        losses:
            Math.floor(
                Math.random() * 3
            ),

        draws:
            0,

        ranking:
            null,

        champion:
            false,

        interimChampion:
            false,

        power:
            45 +
            Math.random() * 35,

        fame:
            5 +
            Math.random() * 30,

        active:
            true,

        injuredWeeks:
            0,

        age:
            20 +
            Math.floor(
                Math.random() * 17
            )

    };

}


/* =========================================================
   INICIALIZAR MUNDO
========================================================= */

function initializeMMWorld() {

    if (
        mmaWorld.initialized
    ) {

        return;

    }


    mmaWorld.fighters = [];

    mmaWorld.championships = [];


    let fighterIndex = 0;


    worldOrganizations.forEach(
        organization => {

            /*
             * Cria cinturões para organizações
             * profissionais.
             */

            if (
                organization.stage !==
                "regional" ||
                organization.prestige >= 20
            ) {

                worldWeights.forEach(
                    weight => {

                        mmaWorld.championships.push({

                            id:
                                organization.id +
                                "_" +
                                weight,

                            organization:
                                organization.name,

                            organizationId:
                                organization.id,

                            weightClass:
                                weight,

                            champion:
                                null,

                            interimChampion:
                                null,

                            defenses:
                                0,

                            titleFights:
                                0

                        });

                    }
                );

            }


            worldWeights.forEach(
                weight => {

                    let amount = 0;


                    if (
                        organization.stage ===
                        "regional"
                    ) {

                        amount = 10;

                    }


                    if (
                        organization.stage ===
                        "national"
                    ) {

                        amount = 15;

                    }


                    if (
                        organization.stage ===
                        "international"
                    ) {

                        amount = 20;

                    }


                    if (
                        organization.stage ===
                        "elite"
                    ) {

                        amount = 20;

                    }


                    for (
                        let i = 0;
                        i < amount;
                        i++
                    ) {

                        mmaWorld.fighters.push(

                            createWorldFighter(
                                weight,
                                organization,
                                fighterIndex++
                            )

                        );

                    }

                }
            );

        }
    );


    updateWorldRankings();

    updateWorldChampions();


    mmaWorld.initialized =
        true;

}


/* =========================================================
   OBTER LUTADORES DE UMA ORGANIZAÇÃO
========================================================= */

function getWorldFighters(
    organization,
    weight
) {

    return mmaWorld.fighters.filter(
        fighter =>

            fighter.active &&

            fighter.organization ===
            organization &&

            fighter.weight ===
            weight

    );

}


/* =========================================================
   ATUALIZAR RANKINGS
========================================================= */

function updateWorldRankings() {

    worldOrganizations.forEach(
        organization => {

            worldWeights.forEach(
                weight => {

                    const fighters =
                        getWorldFighters(
                            organization.name,
                            weight
                        );


                    fighters.sort(
                        (a, b) => {

                            const scoreA =
                                (
                                    a.wins * 4
                                ) +
                                a.fame +
                                a.power;


                            const scoreB =
                                (
                                    b.wins * 4
                                ) +
                                b.fame +
                                b.power;


                            return scoreB -
                                   scoreA;

                        }
                    );


                    fighters.forEach(
                        (
                            fighter,
                            index
                        ) => {

                            fighter.ranking =
                                index + 1;

                        }
                    );

                }
            );

        }
    );

}


/* =========================================================
   ATUALIZAR CAMPEÕES DO MUNDO
========================================================= */

function updateWorldChampions() {

    if (
        !mmaWorld.championships
    ) {

        return;

    }


    mmaWorld.championships.forEach(
        championship => {

            const ranking =
                getWorldRanking(
                    championship.organization,
                    championship.weightClass
                );


            const champion =
                ranking[0] || null;


            mmaWorld.fighters.forEach(
                fighter => {

                    if (
                        fighter.organization ===
                            championship.organization &&
                        fighter.weight ===
                            championship.weightClass
                    ) {

                        fighter.champion =
                            false;

                        fighter.interimChampion =
                            false;

                    }

                }
            );


            if (champion) {

                champion.champion =
                    true;

                championship.champion =
                    champion.id;

            }

        }
    );

}


/* =========================================================
   SIMULAR UMA LUTA DO MUNDO
========================================================= */

function simulateWorldFight(
    fighterA,
    fighterB
) {

    if (
        !fighterA ||
        !fighterB
    ) {

        return null;

    }


    const powerA =
        fighterA.power +
        (
            Math.random() * 20
        ) -
        10;


    const powerB =
        fighterB.power +
        (
            Math.random() * 20
        ) -
        10;


    let winner;
    let loser;


    if (
        powerA >= powerB
    ) {

        winner =
            fighterA;

        loser =
            fighterB;

    } else {

        winner =
            fighterB;

        loser =
            fighterA;

    }


    winner.wins++;

    loser.losses++;

    winner.fame += 1;


    if (
        loser.fame > 0
    ) {

        loser.fame -= 0.5;

    }


    winner.power =
        Math.min(
            100,
            winner.power +
            0.2
        );


    loser.power =
        Math.max(
            30,
            loser.power -
            0.1
        );


    return {

        winner:
            winner,

        loser:
            loser

    };

}


/* =========================================================
   SIMULAR UMA ORGANIZAÇÃO
========================================================= */

function simulateWorldOrganization(
    organization
) {

    worldWeights.forEach(
        weight => {

            const fighters =
                getWorldFighters(
                    organization.name,
                    weight
                );


            const shuffled =
                [...fighters].sort(
                    () =>
                        Math.random() -
                        0.5
                );


            for (
                let i = 0;
                i + 1 < shuffled.length;
                i += 2
            ) {

                if (
                    Math.random() >
                    0.35
                ) {

                    continue;

                }


                const result =
                    simulateWorldFight(
                        shuffled[i],
                        shuffled[i + 1]
                    );


                if (
                    result
                ) {

                    mmaWorld.eventsThisWeek.push({

                        organization:
                            organization.name,

                        organizationId:
                            organization.id,

                        weight:
                            weight,

                        winner:
                            result.winner.name,

                        winnerId:
                            result.winner.id,

                        loser:
                            result.loser.name,

                        loserId:
                            result.loser.id

                    });

                }

            }

        }
    );

}


/* =========================================================
   SIMULAR UMA SEMANA
========================================================= */

function simulateMMWorldWeek() {

    initializeMMWorld();


    mmaWorld.week++;


    mmaWorld.eventsThisWeek = [];


    worldOrganizations.forEach(
        organization => {

            simulateWorldOrganization(
                organization
            );

        }
    );


    updateWorldRankings();

    updateWorldChampions();


    if (
        mmaWorld.eventsThisWeek.length >
        0
    ) {

        const news =
            mmaWorld.eventsThisWeek
                .slice(0, 5)
                .map(
                    fight =>

                        "🏆 " +
                        fight.winner +
                        " venceu " +
                        fight.loser +
                        " (" +
                        fight.organization +
                        ")"

                );


        mmaWorld.news.unshift(
            ...news
        );


        mmaWorld.news =
            mmaWorld.news.slice(
                0,
                30
            );

    }


    return mmaWorld.eventsThisWeek;

}


/* =========================================================
   RANKING DE UMA ORGANIZAÇÃO
========================================================= */

function getWorldRanking(
    organization,
    weight
) {

    return mmaWorld.fighters
        .filter(
            fighter =>

                fighter.active &&

                fighter.organization ===
                organization &&

                fighter.weight ===
                weight

        )
        .sort(
            (a, b) => {

                const scoreA =
                    (
                        a.wins * 4
                    ) +
                    a.fame +
                    a.power;


                const scoreB =
                    (
                        b.wins * 4
                    ) +
                    b.fame +
                    b.power;


                return scoreB -
                       scoreA;

            }
        )
        .slice(
            0,
            15
        );

}


/* =========================================================
   CAMPEÃO
========================================================= */

function getWorldChampion(
    organization,
    weight
) {

    const ranking =
        getWorldRanking(
            organization,
            weight
        );


    return ranking[0] || null;

}


/* =========================================================
   CINTURÃO DO MUNDO
========================================================= */

function getWorldChampionship(
    organization,
    weight
) {

    if (
        !mmaWorld.championships
    ) {

        return null;

    }


    return (
        mmaWorld.championships.find(
            championship =>

                championship.organization ===
                organization &&

                championship.weightClass ===
                weight

        ) || null
    );

}


/* =========================================================
   NOTÍCIAS DO MUNDO
========================================================= */

function getWorldNews() {

    return (
        mmaWorld.news || []
    );

}


/* =========================================================
   DISPONIBILIZAR FUNÇÕES GLOBALMENTE
========================================================= */

window.generateEvent =
    generateEvent;

window.prepareEventForPlayer =
    prepareEventForPlayer;

window.generateAmateurEvent =
    generateAmateurEvent;

window.generateRegionalEvent =
    generateRegionalEvent;

window.generateNationalEvent =
    generateNationalEvent;

window.generateInternationalEvent =
    generateInternationalEvent;

window.generateEliteEvent =
    generateEliteEvent;

window.generatePFLTournament =
    generatePFLTournament;

window.getEventPrestige =
    getEventPrestige;

window.getEventPurse =
    getEventPurse;

window.getEventWinBonus =
    getEventWinBonus;

window.getEventChampionship =
    getEventChampionship;

window.generateOrganizationChampionships =
    generateOrganizationChampionships;

window.simulateMMWorldWeek =
    simulateMMWorldWeek;

window.getWorldRanking =
    getWorldRanking;

window.getWorldChampion =
    getWorldChampion;

window.getWorldChampionship =
    getWorldChampionship;

window.getWorldNews =
    getWorldNews;
