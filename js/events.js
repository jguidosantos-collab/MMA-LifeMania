const events = [

    {
        name: "MMA Regional",
        level: 1,
        international: false,
        purse: 500
    },

    {
        name: "MMA Brasil",
        level: 2,
        international: false,
        purse: 1500
    },

    {
        name: "MMA National",
        level: 3,
        international: false,
        purse: 3000
    },

    {
        name: "MMA International",
        level: 4,
        international: true,
        purse: 7500
    },

    {
        name: "World Combat Night",
        level: 5,
        international: true,
        purse: 15000
    },

    {
        name: "Global MMA Championship",
        level: 6,
        international: true,
        purse: 30000
    }

];


function getCareerStage() {

    if (!player.professional.active) {
        return "amateur";
    }

    if (!player.careerStage) {
        return "regional";
    }

    return player.careerStage;

}


function generateEvent() {

    const stage =
        getCareerStage();


    /*
     * AMADOR
     *
     * O lutador ainda não é profissional.
     * Só pode participar de eventos amadores.
     */

    if (stage === "amateur") {

        return {

            name: "Circuito Amador",
            level: 0,
            international: false,
            professional: false,
            purse: 0

        };

    }


    /*
     * REGIONAL
     *
     * Primeira etapa profissional.
     */

    if (stage === "regional") {

        const regionalEvents =
            events.filter(event =>
                event.level === 1 &&
                !event.international
            );

        return regionalEvents[
            Math.floor(
                Math.random() *
                regionalEvents.length
            )
        ];

    }


    /*
     * NACIONAL
     *
     * Somente eventos nacionais.
     */

    if (stage === "national") {

        const nationalEvents =
            events.filter(event =>
                event.level >= 2 &&
                event.level <= 3 &&
                !event.international
            );

        return nationalEvents[
            Math.floor(
                Math.random() *
                nationalEvents.length
            )
        ];

    }


    /*
     * INTERNACIONAL
     *
     * Somente depois de conquistar
     * acesso à fase internacional.
     */

    if (stage === "international") {

        const internationalEvents =
            events.filter(event =>
                event.international &&
                event.level >= 4 &&
                event.level <= 5
            );

        return internationalEvents[
            Math.floor(
                Math.random() *
                internationalEvents.length
            )
        ];

    }


    /*
     * ELITE
     */

    if (stage === "elite") {

        const eliteEvents =
            events.filter(event =>
                event.international &&
                event.level >= 6
            );

        return eliteEvents[
            Math.floor(
                Math.random() *
                eliteEvents.length
            )
        ];

    }


    return events[0];

}
