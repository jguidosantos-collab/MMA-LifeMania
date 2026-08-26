/* =========================================================
   MMA LIFE DYNASTY
   PLAYER.JS
   SISTEMA BASE DO JOGADOR
========================================================= */

var player = null;


/* =========================================================
   CRIAR JOGADOR PADRÃO
========================================================= */

function createDefaultPlayer() {

    player = {

        name: "",

        country: "Brasil",

        weight: "Peso Leve",

        style: "Completo",

        age: 15,

        careerStage: "amateur",

        week: 0,

        year: 2026,

        money: 500,

        fame: 0,

        potential: Math.floor(
    Math.random() * 13
) + 78,

overall: (() => {

    const roll = Math.random();

    if (roll < 0.05) {
        return 40;
    }

    if (roll < 0.10) {
        return 41;
    }

    if (roll < 0.20) {
        return 42;
    }

    if (roll < 0.35) {
        return 43;
    }

    if (roll < 0.55) {
        return 44;
    }

    if (roll < 0.75) {
        return 45;
    }

    if (roll < 0.88) {
        return 46;
    }

    if (roll < 0.95) {
        return 47;
    }

    if (roll < 0.98) {
        return 48;
    }

    if (roll < 0.995) {
        return 49;
    }

    return 50;

})(),


        /* =========================
           AMADOR
        ========================= */

        amateur: {

            wins: 0,

            losses: 0,

            draws: 0,

            ranking: 50

        },


        /* =========================
           PROFISSIONAL
        ========================= */

        professional: {

            active: false,

            wins: 0,

            losses: 0,

            draws: 0,

            ranking: null

        },


        /* =========================
           ATRIBUTOS
        ========================= */

        attributes: {

            strength: 45,

            striking: 45,

            wrestling: 45,

            grappling: 45,

            cardio: 45,

            technique: 45,

            defense: 45,

            fightIQ: 40,

            chin: 45,

            offense: 45,

            blocking: 45,

            mental: 45,

            discipline: 50,

            confidence: 40

        },


        /* =========================
           CONDIÇÃO
        ========================= */

        health: 100,

        fatigue: 0,


        /* =========================
           EQUIPE
        ========================= */

        team: null,

        teamOffers: [],


        /* =========================
           EMPRESÁRIO
        ========================= */

        manager: null,

        managerOffers: [],


        /* =========================
           CARREIRA
        ========================= */

        nextFight: null,

        currentPromotion: null,

        contracts: [],

        opportunities: [],


        /* =========================
           CAMPEONATO
        ========================= */

        championship: {

            title: null,

            defenses: 0,

            titleWins: 0,

            titleLosses: 0

        },


        /* =========================
           TREINAMENTO
        ========================= */

        trainingPlan: {

            weeks: {}

        },


        /* =========================
           VIDA
        ========================= */

        relationship: "Solteiro",

        partner: null,

        married: false,

        children: [],


        /* =========================
           HISTÓRICO
        ========================= */

        log: [

            "🥊 Sua carreira começou aos 15 anos."

        ]

    };


    return player;
}


/* =========================================================
   COMPATIBILIDADE
========================================================= */

function createPlayer() {

    return createDefaultPlayer();

}


/* =========================================================
   DISPONIBILIZAR GLOBALMENTE
========================================================= */

window.createDefaultPlayer =
    createDefaultPlayer;

window.createPlayer =
    createPlayer;
// player atualizado
