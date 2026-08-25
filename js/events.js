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
