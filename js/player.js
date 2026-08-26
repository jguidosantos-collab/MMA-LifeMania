/* =========================================================
   MMA LIFE DYNASTY
   PLAYER.JS
   PROJETO 1 — BASE DEFINITIVA DO JOGADOR
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
            if (roll < 0.05) return 40;
            if (roll < 0.10) return 41;
            if (roll < 0.20) return 42;
            if (roll < 0.35) return 43;
            if (roll < 0.55) return 44;
            if (roll < 0.75) return 45;
            if (roll < 0.88) return 46;
            if (roll < 0.95) return 47;
            if (roll < 0.98) return 48;
            if (roll < 0.995) return 49;
            return 50;
        })(),
        /* =====================================================
           AMADOR
        ===================================================== */
        amateur: {
            wins: 0,
            losses: 0,
            draws: 0,
            ranking: 50
        },
        /* =====================================================
           PROFISSIONAL
        ===================================================== */
        professional: {
            active: false,
            wins: 0,
            losses: 0,
            draws: 0,
            ranking: null
        },
        /* =====================================================
           ATRIBUTOS
        ===================================================== */
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
        /* =====================================================
           CONDIÇÃO
        ===================================================== */
        health: 100,
        fatigue: 0,
        /* =====================================================
           EQUIPE
        ===================================================== */
        team: null,
        teamOffers: [],
        /* =====================================================
           EMPRESÁRIO
        ===================================================== */
        manager: null,
        managerOffers: [],
        /* =====================================================
           CARREIRA
        ===================================================== */
        nextFight: null,
        currentPromotion: null,
        currentContract: null,
        contracts: [],
        opportunities: [],
        promotionHistory: {},
        /* =====================================================
           CAMPEONATO / CINTURÕES
        ===================================================== */
        championship: {
            title: null,
            organization: null,
            weightClass: null,
            defenses: 0,
            titleWins: 0,
            titleLosses: 0,
            interim: false,
            formerChampion: false
        },
        titles: [],
        titleHistory: [],
        /* =====================================================
           TREINAMENTO
        ===================================================== */
        trainingPlan: {
            weeks: {}
        },
        /* =====================================================
           PATROCÍNIOS
           Máximo de 4 patrocinadores ativos.
        ===================================================== */
        sponsors: {
            active: [],
            offers: [],
            history: [],
            maxSlots: 4,
            totalIncome: 0
        },
        /* =====================================================
           METAS
        ===================================================== */
        goals: {
            active: [],
            completed: [],
            failed: [],
            progress: {}
        },
        /* =====================================================
           REDES SOCIAIS
        ===================================================== */
        socialMedia: {
            followers: 0,
            likes: 0,
            posts: 0,
            engagement: 0,
            reputation: 0,
            verified: false,
            platformLevel: 0,
            history: []
        },
        /* =====================================================
           NOTÍCIAS / IMPRENSA
        ===================================================== */
        media: {
            headlines: [],
            interviews: [],
            appearances: [],
            pressReputation: 0,
            publicImage: 0
        },
        /* =====================================================
           FINANÇAS
        ===================================================== */
        finances: {
            careerIncome: 0,
            fightIncome: 0,
            sponsorIncome: 0,
            investmentIncome: 0,
            propertyIncome: 0,
            expenses: 0,
            taxesPaid: 0,
            legalExpenses: 0,
            netWorth: 500,
            history: []
        },
        /* =====================================================
           PATRIMÔNIO
        ===================================================== */
        assets: {
            houses: [],
            vehicles: [],
            businesses: [],
            other: []
        },
        /* =====================================================
           INVESTIMENTOS
        ===================================================== */
        investments: {
            stocks: [],
            funds: [],
            realEstate: [],
            businesses: [],
            other: [],
            totalInvested: 0,
            totalProfit: 0,
            history: []
        },
        /* =====================================================
           IMPOSTOS
        ===================================================== */
        taxes: {
            country: "Brasil",
            taxRate: 0,
            accumulated: 0,
            paid: 0,
            pending: 0,
            history: []
        },
        /* =====================================================
           QUESTÕES JURÍDICAS
        ===================================================== */
        legal: {
            activeCases: [],
            completedCases: [],
            lawsuitsWon: 0,
            lawsuitsLost: 0,
            settlements: 0,
            legalExpenses: 0,
            reputationImpact: 0
        },
        /* =====================================================
           VIDA
        ===================================================== */
        relationship: "Solteiro",
        partner: null,
        married: false,
        children: [],
        /* =====================================================
           LEGADO / FAMÍLIA
        ===================================================== */
        legacy: {
            generation: 1,
            familyName: "",
            descendants: [],
            legacyScore: 0
        },
        /* =====================================================
           HISTÓRICO
        ===================================================== */
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
