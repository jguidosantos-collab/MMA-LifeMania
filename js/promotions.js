const promotions = [

    /* =====================================================
       🇧🇷 REGIONAL — BRASIL
       ===================================================== */

    {
        id: 1,
        name: "Circuito Regional de MMA",
        country: "Brasil",
        countries: ["Brasil"],
        region: "South America",
        careerStage: "regional",

        level: 1,

        prestige: 8,

        basePurse: 300,
        baseWinBonus: 300,

        minFights: 3,
        maxFights: 5,

        international: false,
        elite: false,

        managerRequired: false,
        minimumManagerContacts: 0,

        foreignChance: 0
    },


    {
        id: 2,
        name: "Shooto Brasil",
        country: "Brasil",
        countries: ["Brasil"],
        region: "South America",
        careerStage: "regional",

        level: 1,

        prestige: 15,

        basePurse: 300,
        baseWinBonus: 300,

        minFights: 3,
        maxFights: 5,

        international: false,
        elite: false,

        managerRequired: false,
        minimumManagerContacts: 0,

        foreignChance: 1
    },


    {
        id: 3,
        name: "Circuito Brasileiro de Combate",
        country: "Brasil",
        countries: ["Brasil"],
        region: "South America",
        careerStage: "regional",

        level: 1,

        prestige: 12,

        basePurse: 300,
        baseWinBonus: 300,

        minFights: 3,
        maxFights: 5,

        international: false,
        elite: false,

        managerRequired: false,
        minimumManagerContacts: 0,

        foreignChance: 0
    },


    /* =====================================================
       🇧🇷 NACIONAL — BRASIL
       ===================================================== */

    {
        id: 10,
        name: "Jungle Fight",
        country: "Brasil",
        countries: ["Brasil"],
        region: "South America",
        careerStage: "national",

        level: 2,

        prestige: 30,

        basePurse: 1000,
        baseWinBonus: 1000,

        minFights: 3,
        maxFights: 5,

        international: false,
        elite: false,

        managerRequired: false,
        minimumManagerContacts: 0,

        foreignChance: 3,

        specialEvents: [
            "Fight do Milhão"
        ]
    },


    {
        id: 11,
        name: "Brazilian MMA Championship",
        country: "Brasil",
        countries: ["Brasil"],
        region: "South America",
        careerStage: "national",

        level: 2,

        prestige: 25,

        basePurse: 1000,
        baseWinBonus: 1000,

        minFights: 3,
        maxFights: 5,

        international: false,
        elite: false,

        managerRequired: false,
        minimumManagerContacts: 0,

        foreignChance: 2
    },


    {
        id: 12,
        name: "Arena Nacional MMA",
        country: "Brasil",
        countries: ["Brasil"],
        region: "South America",
        careerStage: "national",

        level: 2,

        prestige: 28,

        basePurse: 1000,
        baseWinBonus: 1000,

        minFights: 3,
        maxFights: 5,

        international: false,
        elite: false,

        managerRequired: false,
        minimumManagerContacts: 0,

        foreignChance: 2
    },


    /* =====================================================
       🇺🇸 NACIONAL — ESTADOS UNIDOS
       ===================================================== */

    {
        id: 20,
        name: "LFA",
        country: "Estados Unidos",
        countries: ["Estados Unidos"],
        region: "North America",
        careerStage: "national",

        level: 2,

        prestige: 35,

        basePurse: 1000,
        baseWinBonus: 1000,

        minFights: 3,
        maxFights: 5,

        international: false,
        elite: false,

        managerRequired: true,
        minimumManagerContacts: 35,

        foreignChance: 5
    },


    {
        id: 21,
        name: "CFFC",
        country: "Estados Unidos",
        countries: ["Estados Unidos"],
        region: "North America",
        careerStage: "national",

        level: 2,

        prestige: 30,

        basePurse: 1000,
        baseWinBonus: 1000,

        minFights: 3,
        maxFights: 5,

        international: false,
        elite: false,

        managerRequired: true,
        minimumManagerContacts: 40,

        foreignChance: 3
    },


    {
        id: 22,
        name: "Fury Fighting Championship",
        country: "Estados Unidos",
        countries: ["Estados Unidos"],
        region: "North America",
        careerStage: "national",

        level: 2,

        prestige: 32,

        basePurse: 1000,
        baseWinBonus: 1000,

        minFights: 3,
        maxFights: 5,

        international: false,
        elite: false,

        managerRequired: true,
        minimumManagerContacts: 40,

        foreignChance: 3
    },


    /* =====================================================
       🌎 INTERNACIONAL
       ===================================================== */

    {
        id: 30,
        name: "PFL",
        country: "Internacional",
        countries: [
            "Estados Unidos",
            "Brasil",
            "Europa",
            "Internacional"
        ],
        region: "Global",

        careerStage: "international",

        level: 5,

        prestige: 75,

        basePurse: 8000,
        baseWinBonus: 8000,

        minFights: 3,
        maxFights: 5,

        international: true,
        elite: false,

        managerRequired: true,
        minimumManagerContacts: 60,

        foreignChance: 100,

        grandPrix: true,

        grandPrixName: "PFL World Tournament",

        grandPrixPrize: 1000000
    },


    {
        id: 31,
        name: "ONE Championship",
        country: "Internacional",
        countries: [
            "Tailândia",
            "Japão",
            "Brasil",
            "Estados Unidos",
            "Internacional"
        ],
        region: "Global",

        careerStage: "international",

        level: 5,

        prestige: 78,

        basePurse: 8000,
        baseWinBonus: 8000,

        minFights: 3,
        maxFights: 5,

        international: true,
        elite: false,

        managerRequired: true,
        minimumManagerContacts: 60,

        foreignChance: 100
    },


    {
        id: 32,
        name: "Bellator",
        country: "Estados Unidos",
        countries: [
            "Estados Unidos",
            "Internacional"
        ],
        region: "Global",

        careerStage: "international",

        level: 5,

        prestige: 72,

        basePurse: 7500,
        baseWinBonus: 7500,

        minFights: 3,
        maxFights: 5,

        international: true,
        elite: false,

        managerRequired: true,
        minimumManagerContacts: 65,

        foreignChance: 100,

        legacyBrand: true
    },


    {
        id: 33,
        name: "RIZIN",
        country: "Japão",
        countries: [
            "Japão",
            "Internacional"
        ],
        region: "Asia",

        careerStage: "international",

        level: 5,

        prestige: 70,

        basePurse: 7000,
        baseWinBonus: 7000,

        minFights: 3,
        maxFights: 5,

        international: true,
        elite: false,

        managerRequired: true,
        minimumManagerContacts: 60,

        foreignChance: 100
    },


    {
        id: 34,
        name: "KSW",
        country: "Polônia",
        countries: [
            "Polônia",
            "Europa",
            "Internacional"
        ],
        region: "Europe",

        careerStage: "international",

        level: 4,

        prestige: 65,

        basePurse: 6000,
        baseWinBonus: 6000,

        minFights: 3,
        maxFights: 5,

        international: true,
        elite: false,

        managerRequired: true,
        minimumManagerContacts: 55,

        foreignChance: 100
    },


    {
        id: 35,
        name: "OKTAGON MMA",
        country: "Europa",
        countries: [
            "República Tcheca",
            "Alemanha",
            "Europa",
            "Internacional"
        ],
        region: "Europe",

        careerStage: "international",

        level: 4,

        prestige: 62,

        basePurse: 6000,
        baseWinBonus: 6000,

        minFights: 3,
        maxFights: 5,

        international: true,
        elite: false,

        managerRequired: true,
        minimumManagerContacts: 55,

        foreignChance: 100
    },


    {
        id: 36,
        name: "Cage Warriors",
        country: "Reino Unido",
        countries: [
            "Reino Unido",
            "Europa",
            "Internacional"
        ],
        region: "Europe",

        careerStage: "international",

        level: 4,

        prestige: 60,

        basePurse: 5000,
        baseWinBonus: 5000,

        minFights: 3,
        maxFights: 5,

        international: true,
        elite: false,

        managerRequired: true,
        minimumManagerContacts: 50,

        foreignChance: 100
    },


    {
        id: 37,
        name: "BRAVE Combat Federation",
        country: "Bahrein",
        countries: [
            "Bahrein",
            "Internacional"
        ],
        region: "Middle East",

        careerStage: "international",

        level: 4,

        prestige: 58,

        basePurse: 5000,
        baseWinBonus: 5000,

        minFights: 3,
        maxFights: 5,

        international: true,
        elite: false,

        managerRequired: true,
        minimumManagerContacts: 50,

        foreignChance: 100
    },


    {
        id: 38,
        name: "UAE Warriors",
        country: "Emirados Árabes Unidos",
        countries: [
            "Emirados Árabes Unidos",
            "Internacional"
        ],
        region: "Middle East",

        careerStage: "international",

        level: 4,

        prestige: 60,

        basePurse: 5500,
        baseWinBonus: 5500,

        minFights: 3,
        maxFights: 5,

        international: true,
        elite: false,

        managerRequired: true,
        minimumManagerContacts: 50,

        foreignChance: 100
    },


    {
        id: 39,
        name: "ACA",
        country: "Rússia",
        countries: [
            "Rússia",
            "Europa",
            "Internacional"
        ],
        region: "Europe",

        careerStage: "international",

        level: 5,

        prestige: 68,

        basePurse: 6500,
        baseWinBonus: 6500,

        minFights: 3,
        maxFights: 5,

        international: true,
        elite: false,

        managerRequired: true,
        minimumManagerContacts: 65,

        foreignChance: 100
    },


    /* =====================================================
       👑 ELITE
       ===================================================== */

    {
        id: 100,

        name: "UFC",

        country: "Estados Unidos",

        countries: [
            "Estados Unidos",
            "Internacional"
        ],

        region: "Global",

        careerStage: "elite",

        level: 10,

        prestige: 100,

        basePurse: 12000,
        baseWinBonus: 12000,

        minFights: 3,
        maxFights: 5,

        international: true,

        elite: true,

        managerRequired: true,

        minimumManagerContacts: 80,

        foreignChance: 100,

        contenderSeries: true,

        roadToUFC: true
    }

];
