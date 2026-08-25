let player = null;

function createPlayer() {

    player = {

        name: "",

        country: "Brasil",

        weight: "Peso Leve",

        style: "Completo",

        age: 15,

        week: 0,

        year: 2026,

        money: 500,

        fame: 0,

        amateur: {
            wins: 0,
            losses: 0,
            draws: 0,
            ranking: 50
        },

        professional: {
            active: false,
            wins: 0,
            losses: 0,
            draws: 0,
            ranking: null
        },

        attributes: {

            strength: 45,

            striking: 45,

            wrestling: 45,

            grappling: 45,

            cardio: 45,

            technique: 45,

            defense: 45,

            fightIQ: 40,

            mental: 45,

            discipline: 50,

            confidence: 40

        },

        health: 100,

        fatigue: 0,

        team: null,

        manager: null,

        nextFight: null,

currentPromotion: null,

contracts: [],

opportunities: [],

championship: {

    title: null,

    defenses: 0,

    titleWins: 0,

    titleLosses: 0

},
        relationship: "Solteiro",

        partner: null,

        married: false,

        children: [],

        teamOffers: [],

        managerOffers: [],

        log: [
            "🥊 Sua carreira começou aos 15 anos."
        ]

    };

}
