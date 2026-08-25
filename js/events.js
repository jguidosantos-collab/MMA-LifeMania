const events = [

    /* =====================================================
       🥋 AMADOR
       ===================================================== */

    {
        name: "Copa Amadora de MMA",
        level: 0,
        international: false,
        professional: false,
        purse: 0
    },

    {
        name: "Circuito Amador Brasileiro",
        level: 0,
        international: false,
        professional: false,
        purse: 0
    },

    {
        name: "Campeonato Estadual de MMA",
        level: 0,
        international: false,
        professional: false,
        purse: 0
    },


    /* =====================================================
       🇧🇷 REGIONAL
       ===================================================== */

    {
        name: "Shooto Brasil",
        level: 1,
        international: false,
        professional: true,
        careerStage: "regional",
        purse: 300
    },

    {
        name: "Circuito Regional Brasileiro",
        level: 1,
        international: false,
        professional: true,
        careerStage: "regional",
        purse: 300
    },

    {
        name: "Regional MMA Fight Night",
        level: 1,
        international: false,
        professional: true,
        careerStage: "regional",
        purse: 300
    },


    /* =====================================================
       🇧🇷 NACIONAL
       ===================================================== */

    {
        name: "Jungle Fight",
        level: 2,
        international: false,
        professional: true,
        careerStage: "national",
        purse: 1000
    },

    {
        name: "Campeonato Brasileiro de MMA",
        level: 2,
        international: false,
        professional: true,
        careerStage: "national",
        purse: 1000
    },

    {
        name: "Brazil MMA Championship",
        level: 3,
        international: false,
        professional: true,
        careerStage: "national",
        purse: 1000
    },


    /* =====================================================
       🇺🇸 NACIONAL ESTRANGEIRO
       ===================================================== */

    {
        name: "LFA",
        level: 2,
        international: false,
        professional: true,
        careerStage: "national",
        country: "Estados Unidos",
        foreign: true,
        purse: 1000
    },

    {
        name: "CFFC",
        level: 2,
        international: false,
        professional: true,
        careerStage: "national",
        country: "Estados Unidos",
        foreign: true,
        purse: 1000
    },


    /* =====================================================
       🌎 INTERNACIONAL
       ===================================================== */

    {
        name: "PFL",
        level: 4,
        international: true,
        professional: true,
        careerStage: "international",
        purse: 8000
    },

    {
        name: "ONE Championship",
        level: 4,
        international: true,
        professional: true,
        careerStage: "international",
        purse: 8000
    },

    {
        name: "Bellator",
        level: 4,
        international: true,
        professional: true,
        careerStage: "international",
        purse: 7500
    },

    {
        name: "RIZIN",
        level: 4,
        international: true,
        professional: true,
        careerStage: "international",
        purse: 7000
    },

    {
        name: "KSW",
        level: 4,
        international: true,
        professional: true,
        careerStage: "international",
        purse: 6000
    },

    {
        name: "OKTAGON MMA",
        level: 4,
        international: true,
        professional: true,
        careerStage: "international",
        purse: 6000
    },

    {
        name: "Cage Warriors",
        level: 4,
        international: true,
        professional: true,
        careerStage: "international",
        purse: 5000
    },

    {
        name: "BRAVE Combat Federation",
        level: 4,
        international: true,
        professional: true,
        careerStage: "international",
        purse: 5000
    },

    {
        name: "UAE Warriors",
        level: 4,
        international: true,
        professional: true,
        careerStage: "international",
        purse: 5500
    },


    /* =====================================================
       👑 ELITE — UFC
       ===================================================== */

    {
        name: "UFC Fight Night",
        level: 6,
        international: true,
        professional: true,
        careerStage: "elite",
        purse: 12000
    },

    {
        name: "UFC",
        level: 6,
        international: true,
        professional: true,
        careerStage: "elite",
        purse: 12000
    }

];


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
                event.careerStage === undefined &&
                event.level === 0
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

    let nationalEvents =
        events.filter(
            event =>
                event.careerStage ===
                "national" &&
                !event.foreign
        );


    /*
     * Para brasileiro:
     *
     * prioridade absoluta aos eventos
     * nacionais brasileiros.
     */

    if (
        player.country ===
        "Brasil"
    ) {

        /*
         * Pequena chance de evento estrangeiro
         * somente se houver empresário.
         */

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

        purse:
            8000,

        winBonus:
            8000,

        tournament:
            true,

        tournamentName:
            "PFL World Tournament",

        tournamentPrize:
            1000000,

        tournamentRound:
            1

    };

}


/* =========================================================
   GERAR EVENTO
========================================================= */

function generateEvent() {

    const stage =
        getCareerStage();


    /* =====================================================
       AMADOR
       ===================================================== */

    if (
        stage ===
        "amateur"
    ) {

        return generateAmateurEvent();

    }


    /* =====================================================
       REGIONAL
       ===================================================== */

    if (
        stage ===
        "regional"
    ) {

        return generateRegionalEvent();

    }


    /* =====================================================
       NACIONAL
       ===================================================== */

    if (
        stage ===
        "national"
    ) {

        return generateNationalEvent();

    }


    /* =====================================================
       INTERNACIONAL
       ===================================================== */

    if (
        stage ===
        "international"
    ) {

        /*
         * PFL Tournament é raro.
         *
         * Só aparece para lutadores
         * com empresário.
         */

        if (
            player.manager &&
            Math.random() < 0.10
        ) {

            return generatePFLTournament();

        }


        return generateInternationalEvent();

    }


    /* =====================================================
       ELITE
       ===================================================== */

    if (
        stage ===
        "elite"
    ) {

        return generateEliteEvent();

    }


    return generateAmateurEvent();

}
/* =========================================================
   🌎 MUNDO MMA — SIMULAÇÃO INDEPENDENTE
   ========================================================= */

const mmaWorld = {

    initialized: false,

    week: 0,

    fighters: [],

    eventsThisWeek: [],

    news: []

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
        name: "Circuito Regional Brasileiro",
        stage: "regional",
        country: "Brasil",
        level: 1
    },

    {
        name: "Shooto Brasil",
        stage: "regional",
        country: "Brasil",
        level: 1
    },

    {
        name: "Jungle Fight",
        stage: "national",
        country: "Brasil",
        level: 2
    },

    {
        name: "LFA",
        stage: "national",
        country: "Estados Unidos",
        level: 2
    },

    {
        name: "PFL",
        stage: "international",
        country: "Estados Unidos",
        level: 4
    },

    {
        name: "ONE Championship",
        stage: "international",
        country: "Singapura",
        level: 4
    },

    {
        name: "Bellator",
        stage: "international",
        country: "Estados Unidos",
        level: 4
    },

    {
        name: "RIZIN",
        stage: "international",
        country: "Japão",
        level: 4
    },

    {
        name: "KSW",
        stage: "international",
        country: "Polônia",
        level: 4
    },

    {
        name: "UAE Warriors",
        stage: "international",
        country: "Emirados Árabes",
        level: 4
    },

    {
        name: "UFC",
        stage: "elite",
        country: "Estados Unidos",
        level: 6
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

    const fighter = {

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


    return fighter;

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


    let fighterIndex = 0;


    /*
     * Criamos lutadores para cada organização
     * e categoria.
     */

    worldOrganizations.forEach(
        organization => {

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

    /*
     * Cada organização possui seu próprio ranking.
     */

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
                                (
                                    a.fame
                                ) +
                                (
                                    a.power
                                );


                            const scoreB =
                                (
                                    b.wins * 4
                                ) +
                                (
                                    b.fame
                                ) +
                                (
                                    b.power
                                );


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


                            fighter.champion =
                                index === 0;

                        }
                    );

                }
            );

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

        return;

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


    /*
     * Pequena evolução do vencedor.
     */

    winner.power =
        Math.min(
            100,
            winner.power +
            0.2
        );


    /*
     * Pequena perda de forma do derrotado.
     */

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


            /*
             * Embaralha os lutadores.
             */

            const shuffled =
                [...fighters].sort(
                    () =>
                        Math.random() -
                        0.5
                );


            /*
             * Aproximadamente metade
             * luta naquela semana.
             */

            for (
                let i = 0;
                i + 1 < shuffled.length;
                i += 2
            ) {

                /*
                 * Nem todo lutador luta
                 * toda semana.
                 */

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

                        weight:
                            weight,

                        winner:
                            result.winner.name,

                        loser:
                            result.loser.name

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

    /*
     * Inicializa o mundo na primeira utilização.
     */

    initializeMMWorld();


    mmaWorld.week++;


    mmaWorld.eventsThisWeek = [];


    /*
     * Todas as organizações funcionam
     * independentemente do jogador.
     */

    worldOrganizations.forEach(
        organization => {

            simulateWorldOrganization(
                organization
            );

        }
    );


    /*
     * Atualiza rankings depois das lutas.
     */

    updateWorldRankings();


    /*
     * Guarda algumas notícias.
     */

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


        /*
         * Mantém somente as
         * últimas 30 notícias.
         */

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
   NOTÍCIAS DO MUNDO
========================================================= */

function getWorldNews() {

    return (
        mmaWorld.news || []
    );

}
