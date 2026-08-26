/* =========================================================
   🏢 MMA LIFE DYNASTY
   TEAM.JS
   SISTEMA COMPLETO E PROTEGIDO

   EQUIPES
   TREINADORES
   TREINADORES PARTICULARES
   EMPRESÁRIOS
   CONTRATOS
========================================================= */

(function () {

"use strict";

/* =========================================================
   UTILIDADES
========================================================= */

function teamRandomInt(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

function teamClamp(value, min, max) {
    return Math.max(
        min,
        Math.min(max, value)
    );
}

function getTeamPlayer() {

    if (
        typeof window.player === "undefined" ||
        !window.player
    ) {

        if (
            typeof window.createDefaultPlayer === "function"
        ) {
            window.player =
                window.createDefaultPlayer();
        }
        else {
            window.player = {};
        }
    }

    return window.player;
}

function teamSave() {

    try {

        if (
            typeof window.saveGame === "function"
        ) {
            window.saveGame();
            return;
        }

        if (
            typeof window.save === "function"
        ) {
            window.save();
            return;
        }

        localStorage.setItem(
            "mmaLifePlayer",
            JSON.stringify(
                window.player
            )
        );

    }
    catch (error) {

        console.error(
            "Erro ao salvar jogador:",
            error
        );

    }
}


/* =========================================================
   GERADOR DE EQUIPES
========================================================= */

function createCountryTeams(
    country,
    prefix,
    names
) {

    return names.map(
        function (name, index) {

            const rank =
                index + 1;

            const prestige =
                98 -
                (index * 3);

            return {

                id:
                    prefix.toLowerCase() +
                    "_" +
                    String(rank).padStart(2, "0"),

                name:
                    name,

                country:
                    country,

                rank:
                    rank,

                prestige:
                    teamClamp(
                        prestige,
                        70,
                        98
                    ),

                structure:
                    teamClamp(
                        prestige - 2,
                        68,
                        96
                    ),

                coaching:
                    teamClamp(
                        prestige + 1,
                        72,
                        99
                    ),

                cost:
                    700 +
                    (10 - rank) * 120,

                specialty:
                    [
                        "Completo",
                        "Striking",
                        "Wrestling",
                        "Grappling"
                    ][
                        index % 4
                    ]

            };

        }
    );

}


/* =========================================================
   🏢 BANCO DE EQUIPES
========================================================= */

const mmaTeams = [

    /* =========================
       🇧🇷 BRASIL
    ========================= */

    {
        id: "br_01",
        name: "Nova União",
        country: "Brasil",
        rank: 1,
        prestige: 98,
        structure: 96,
        coaching: 98,
        cost: 1800,
        specialty: "Grappling"
    },

    {
        id: "br_02",
        name: "Chute Boxe",
        country: "Brasil",
        rank: 2,
        prestige: 97,
        structure: 94,
        coaching: 97,
        cost: 1750,
        specialty: "Striking"
    },

    {
        id: "br_03",
        name: "Team Nogueira",
        country: "Brasil",
        rank: 3,
        prestige: 95,
        structure: 94,
        coaching: 95,
        cost: 1650,
        specialty: "Completo"
    },

    {
        id: "br_04",
        name: "Pitbull Brothers",
        country: "Brasil",
        rank: 4,
        prestige: 94,
        structure: 91,
        coaching: 94,
        cost: 1550,
        specialty: "Completo"
    },

    {
        id: "br_05",
        name: "X-Gym",
        country: "Brasil",
        rank: 5,
        prestige: 93,
        structure: 92,
        coaching: 93,
        cost: 1500,
        specialty: "Striking"
    },

    {
        id: "br_06",
        name: "Team Shogun",
        country: "Brasil",
        rank: 6,
        prestige: 90,
        structure: 88,
        coaching: 91,
        cost: 1350,
        specialty: "Striking"
    },

    {
        id: "br_07",
        name: "RFT Team",
        country: "Brasil",
        rank: 7,
        prestige: 87,
        structure: 85,
        coaching: 88,
        cost: 1200,
        specialty: "Wrestling"
    },

    {
        id: "br_08",
        name: "GFT Team",
        country: "Brasil",
        rank: 8,
        prestige: 84,
        structure: 82,
        coaching: 86,
        cost: 1100,
        specialty: "Grappling"
    },

    {
        id: "br_09",
        name: "Alliance Brasil",
        country: "Brasil",
        rank: 9,
        prestige: 81,
        structure: 80,
        coaching: 83,
        cost: 950,
        specialty: "Grappling"
    },

    {
        id: "br_10",
        name: "Arena Fight Team",
        country: "Brasil",
        rank: 10,
        prestige: 78,
        structure: 76,
        coaching: 80,
        cost: 800,
        specialty: "Completo"
    },


    /* =========================
       🇺🇸 ESTADOS UNIDOS
    ========================= */

    {
        id: "us_01",
        name: "American Top Team",
        country: "Estados Unidos",
        rank: 1,
        prestige: 99,
        structure: 99,
        coaching: 98,
        cost: 2200,
        specialty: "Completo"
    },

    {
        id: "us_02",
        name: "American Kickboxing Academy",
        country: "Estados Unidos",
        rank: 2,
        prestige: 98,
        structure: 97,
        coaching: 98,
        cost: 2100,
        specialty: "Wrestling"
    },

    {
        id: "us_03",
        name: "Jackson Wink",
        country: "Estados Unidos",
        rank: 3,
        prestige: 97,
        structure: 96,
        coaching: 97,
        cost: 2000,
        specialty: "Striking"
    },

    {
        id: "us_04",
        name: "American Kickboxing Team",
        country: "Estados Unidos",
        rank: 4,
        prestige: 94,
        structure: 94,
        coaching: 94,
        cost: 1800,
        specialty: "Striking"
    },

    {
        id: "us_05",
        name: "Kings MMA",
        country: "Estados Unidos",
        rank: 5,
        prestige: 93,
        structure: 92,
        coaching: 94,
        cost: 1750,
        specialty: "Muay Thai"
    },

    {
        id: "us_06",
        name: "Elevation Fight Team",
        country: "Estados Unidos",
        rank: 6,
        prestige: 90,
        structure: 89,
        coaching: 91,
        cost: 1500,
        specialty: "Completo"
    },

    {
        id: "us_07",
        name: "Sanford MMA",
        country: "Estados Unidos",
        rank: 7,
        prestige: 89,
        structure: 91,
        coaching: 90,
        cost: 1450,
        specialty: "Striking"
    },

    {
        id: "us_08",
        name: "Factory X",
        country: "Estados Unidos",
        rank: 8,
        prestige: 86,
        structure: 85,
        coaching: 88,
        cost: 1300,
        specialty: "Completo"
    },

    {
        id: "us_09",
        name: "Fortis MMA",
        country: "Estados Unidos",
        rank: 9,
        prestige: 84,
        structure: 84,
        coaching: 86,
        cost: 1200,
        specialty: "Wrestling"
    },

    {
        id: "us_10",
        name: "Glory MMA Academy",
        country: "Estados Unidos",
        rank: 10,
        prestige: 80,
        structure: 79,
        coaching: 82,
        cost: 1000,
        specialty: "Striking"
    },


    /* =========================
       🇯🇵 JAPÃO
    ========================= */

    {
        id: "jp_01",
        name: "Japanese Combat Elite",
        country: "Japão",
        rank: 1,
        prestige: 97,
        structure: 95,
        coaching: 98,
        cost: 1900,
        specialty: "Grappling"
    },

    {
        id: "jp_02",
        name: "Pancrase Team",
        country: "Japão",
        rank: 2,
        prestige: 95,
        structure: 93,
        coaching: 96,
        cost: 1800,
        specialty: "Completo"
    },

    {
        id: "jp_03",
        name: "Shooto Elite",
        country: "Japão",
        rank: 3,
        prestige: 93,
        structure: 91,
        coaching: 94,
        cost: 1650,
        specialty: "Grappling"
    },

    {
        id: "jp_04",
        name: "Rizin Combat Team",
        country: "Japão",
        rank: 4,
        prestige: 92,
        structure: 90,
        coaching: 93,
        cost: 1600,
        specialty: "Completo"
    },

    {
        id: "jp_05",
        name: "Tokyo Fight Academy",
        country: "Japão",
        rank: 5,
        prestige: 88,
        structure: 87,
        coaching: 89,
        cost: 1400,
        specialty: "Striking"
    },

    {
        id: "jp_06",
        name: "Osaka Combat Club",
        country: "Japão",
        rank: 6,
        prestige: 85,
        structure: 84,
        coaching: 87,
        cost: 1250,
        specialty: "Wrestling"
    },

    {
        id: "jp_07",
        name: "Kyoto MMA",
        country: "Japão",
        rank: 7,
        prestige: 82,
        structure: 80,
        coaching: 84,
        cost: 1100,
        specialty: "Grappling"
    },

    {
        id: "jp_08",
        name: "Samurai Fight Team",
        country: "Japão",
        rank: 8,
        prestige: 80,
        structure: 79,
        coaching: 82,
        cost: 1000,
        specialty: "Striking"
    },

    {
        id: "jp_09",
        name: "Nippon Combat",
        country: "Japão",
        rank: 9,
        prestige: 77,
        structure: 76,
        coaching: 79,
        cost: 900,
        specialty: "Completo"
    },

    {
        id: "jp_10",
        name: "Tokyo Warriors",
        country: "Japão",
        rank: 10,
        prestige: 74,
        structure: 73,
        coaching: 77,
        cost: 800,
        specialty: "Completo"
    },


    /* =========================
       🇲🇽 MÉXICO
    ========================= */

    {
        id: "mx_01",
        name: "Mexico Combat Elite",
        country: "México",
        rank: 1,
        prestige: 95,
        structure: 91,
        coaching: 96,
        cost: 1500,
        specialty: "Striking"
    },

    {
        id: "mx_02",
        name: "Azteca Fight Team",
        country: "México",
        rank: 2,
        prestige: 92,
        structure: 89,
        coaching: 94,
        cost: 1400,
        specialty: "Grappling"
    },

    {
        id: "mx_03",
        name: "Mexico MMA Academy",
        country: "México",
        rank: 3,
        prestige: 89,
        structure: 87,
        coaching: 91,
        cost: 1300,
        specialty: "Completo"
    },

    {
        id: "mx_04",
        name: "Guerreros MMA",
        country: "México",
        rank: 4,
        prestige: 86,
        structure: 84,
        coaching: 89,
        cost: 1150,
        specialty: "Striking"
    },

    {
        id: "mx_05",
        name: "Tijuana Combat",
        country: "México",
        rank: 5,
        prestige: 83,
        structure: 81,
        coaching: 86,
        cost: 1050,
        specialty: "Wrestling"
    },

    {
        id: "mx_06",
        name: "Azteca Warriors",
        country: "México",
        rank: 6,
        prestige: 80,
        structure: 78,
        coaching: 83,
        cost: 950,
        specialty: "Striking"
    },

    {
        id: "mx_07",
        name: "Monterrey MMA",
        country: "México",
        rank: 7,
        prestige: 77,
        structure: 76,
        coaching: 80,
        cost: 850,
        specialty: "Completo"
    },

    {
        id: "mx_08",
        name: "Guadalajara Fight Team",
        country: "México",
        rank: 8,
        prestige: 75,
        structure: 73,
        coaching: 78,
        cost: 800,
        specialty: "Grappling"
    },

    {
        id: "mx_09",
        name: "Cancun Combat",
        country: "México",
        rank: 9,
        prestige: 72,
        structure: 70,
        coaching: 75,
        cost: 700,
        specialty: "Striking"
    },

    {
        id: "mx_10",
        name: "Maya Fight Academy",
        country: "México",
        rank: 10,
        prestige: 69,
        structure: 68,
        coaching: 72,
        cost: 600,
        specialty: "Completo"
    },


    /* =========================
       🇦🇷 ARGENTINA
    ========================= */

    ...createCountryTeams(
        "Argentina",
        "AR",
        [
            "Buenos Aires Combat",
            "Argentina MMA Elite",
            "Pampa Fight Team",
            "Patagonia Combat",
            "Andes MMA",
            "Tango Fight Team",
            "Buenos Aires Warriors",
            "Cordoba Combat",
            "Rosario MMA",
            "Argentina Fight Academy"
        ]
    ),


    /* =========================
       🇨🇦 CANADÁ
    ========================= */

    ...createCountryTeams(
        "Canadá",
        "CA",
        [
            "Canadian Combat Elite",
            "Northern MMA",
            "Toronto Fight Team",
            "Montreal Combat",
            "Maple Fight Academy",
            "Vancouver MMA",
            "Canadian Warriors",
            "Ottawa Combat",
            "Quebec Fight Team",
            "North Star MMA"
        ]
    ),


    /* =========================
       🇷🇺 RÚSSIA
    ========================= */

    ...createCountryTeams(
        "Rússia",
        "RU",
        [
            "Russian Combat Elite",
            "Caucasus Fight Team",
            "Moscow MMA",
            "Dagestan Combat",
            "Russian Warriors",
            "Siberia Fight Team",
            "Volga Combat",
            "Moscow Warriors",
            "Northern Combat",
            "Russian Fight Academy"
        ]
    ),


    /* =========================
       🇬🇧 REINO UNIDO
    ========================= */

    ...createCountryTeams(
        "Reino Unido",
        "UK",
        [
            "British Combat Elite",
            "London Fight Team",
            "UK MMA Academy",
            "Manchester Combat",
            "London Warriors",
            "British Warriors",
            "Birmingham MMA",
            "Liverpool Fight Team",
            "Scotland Combat",
            "British Fight Academy"
        ]
    )

];


/* =========================================================
   🥋 TREINADORES
========================================================= */

const teamCoaches = [

    {
        id: "coach_01",
        name: "Ricardo Almeida",
        specialty: "Completo",
        level: 95,
        privateCost: 850,
        weeklyCost: 120
    },

    {
        id: "coach_02",
        name: "Marcelo Rocha",
        specialty: "Striking",
        level: 93,
        privateCost: 800,
        weeklyCost: 115
    },

    {
        id: "coach_03",
        name: "Fernando Costa",
        specialty: "Wrestling",
        level: 91,
        privateCost: 750,
        weeklyCost: 110
    },

    {
        id: "coach_04",
        name: "Daniel Souza",
        specialty: "Grappling",
        level: 90,
        privateCost: 720,
        weeklyCost: 105
    },

    {
        id: "coach_05",
        name: "Anderson Lima",
        specialty: "Striking",
        level: 87,
        privateCost: 650,
        weeklyCost: 95
    },

    {
        id: "coach_06",
        name: "Paulo Mendes",
        specialty: "Completo",
        level: 85,
        privateCost: 600,
        weeklyCost: 90
    }

];


/* =========================================================
   👤 TREINADORES PARTICULARES
========================================================= */

const privateCoaches = [

    {
        id: "private_01",
        name: "Rafael Mendes",
        specialty: "Striking",
        level: 92,
        cost: 900,
        weeklyCost: 150
    },

    {
        id: "private_02",
        name: "Bruno Silva",
        specialty: "Wrestling",
        level: 90,
        cost: 850,
        weeklyCost: 140
    },

    {
        id: "private_03",
        name: "Carlos Oliveira",
        specialty: "Grappling",
        level: 94,
        cost: 1000,
        weeklyCost: 160
    },

    {
        id: "private_04",
        name: "Eduardo Santos",
        specialty: "Completo",
        level: 96,
        cost: 1200,
        weeklyCost: 180
    }

];


/* =========================================================
   👔 EMPRESÁRIOS
========================================================= */

function randomManagerCommission(min, max) {

    return Math.floor(
        min +
        Math.random() *
        (
            max -
            min +
            1
        )
    );

}

const managers = [

    /* INICIANTES */

    {
        name: "Carlos Mendes",
        level: "Iniciante",
        levelNumber: 1,
        commission: randomManagerCommission(10, 15),
        contacts: 20 + teamRandomInt(0, 15),
        negotiation: 25 + teamRandomInt(0, 20),
        internationalAccess: 10 + teamRandomInt(0, 15)
    },

    {
        name: "Lucas Ferreira",
        level: "Iniciante",
        levelNumber: 1,
        commission: randomManagerCommission(10, 15),
        contacts: 20 + teamRandomInt(0, 15),
        negotiation: 30 + teamRandomInt(0, 20),
        internationalAccess: 15 + teamRandomInt(0, 15)
    },

    {
        name: "Bruno Almeida",
        level: "Iniciante",
        levelNumber: 1,
        commission: randomManagerCommission(10, 15),
        contacts: 25 + teamRandomInt(0, 15),
        negotiation: 25 + teamRandomInt(0, 20),
        internationalAccess: 10 + teamRandomInt(0, 20)
    },


    /* INTERMEDIÁRIOS */

    {
        name: "Rafael Costa",
        level: "Intermediário",
        levelNumber: 2,
        commission: randomManagerCommission(13, 20),
        contacts: 40 + teamRandomInt(0, 30),
        negotiation: 45 + teamRandomInt(0, 30),
        internationalAccess: 35 + teamRandomInt(0, 30)
    },

    {
        name: "André Silva",
        level: "Intermediário",
        levelNumber: 2,
        commission: randomManagerCommission(13, 20),
        contacts: 45 + teamRandomInt(0, 30),
        negotiation: 50 + teamRandomInt(0, 30),
        internationalAccess: 40 + teamRandomInt(0, 30)
    },

    {
        name: "Thiago Rodrigues",
        level: "Intermediário",
        levelNumber: 2,
        commission: randomManagerCommission(13, 20),
        contacts: 40 + teamRandomInt(0, 35),
        negotiation: 55 + teamRandomInt(0, 25),
        internationalAccess: 45 + teamRandomInt(0, 25)
    },

    {
        name: "Felipe Martins",
        level: "Intermediário",
        levelNumber: 2,
        commission: randomManagerCommission(13, 20),
        contacts: 50 + teamRandomInt(0, 25),
        negotiation: 45 + teamRandomInt(0, 35),
        internationalAccess: 40 + teamRandomInt(0, 30)
    },


    /* ELITE */

    {
        name: "Marcos Oliveira",
        level: "Elite",
        levelNumber: 3,
        commission: randomManagerCommission(15, 25),
        contacts: 80 + teamRandomInt(0, 20),
        negotiation: 75 + teamRandomInt(0, 25),
        internationalAccess: 75 + teamRandomInt(0, 25)
    },

    {
        name: "Eduardo Martins",
        level: "Elite",
        levelNumber: 3,
        commission: randomManagerCommission(15, 25),
        contacts: 85 + teamRandomInt(0, 15),
        negotiation: 80 + teamRandomInt(0, 20),
        internationalAccess: 80 + teamRandomInt(0, 20)
    },

    {
        name: "Ricardo Fernandes",
        level: "Elite",
        levelNumber: 3,
        commission: randomManagerCommission(15, 25),
        contacts: 90 + teamRandomInt(0, 10),
        negotiation: 85 + teamRandomInt(0, 15),
        internationalAccess: 85 + teamRandomInt(0, 15)
    }

];


/* =========================================================
   INICIALIZAÇÃO DO PLAYER
========================================================= */

function ensureTeamPlayer() {

    const player =
        getTeamPlayer();

    if (!player.team) {
        player.team = null;
    }

    if (!player.coach) {
        player.coach = null;
    }

    if (!player.privateCoach) {
        player.privateCoach = null;
    }

    if (!Array.isArray(player.teamHistory)) {
        player.teamHistory = [];
    }

    if (!Array.isArray(player.managerOffers)) {
        player.managerOffers = [];
    }

    if (
        typeof player.manager === "undefined"
    ) {
        player.manager = null;
    }

    if (
        typeof player.managerContract === "undefined"
    ) {
        player.managerContract = null;
    }

    if (
        typeof player.managerContractExpired === "undefined"
    ) {
        player.managerContractExpired = false;
    }

    if (!Array.isArray(player.log)) {
        player.log = [];
    }

    return player;
}


/* =========================================================
   👔 REQUISITOS EMPRESÁRIO
========================================================= */

function canOfferManager(manager) {

    const player =
        ensureTeamPlayer();

    const fame =
        Number(player.fame || 0);

    const wins =
        player.professional
            ?
            Number(
                player.professional.wins || 0
            )
            :
            0;

    if (manager.levelNumber === 1) {
        return true;
    }

    if (manager.levelNumber === 2) {
        return (
            fame >= 10 ||
            wins >= 3
        );
    }

    if (manager.levelNumber === 3) {
        return (
            fame >= 35 &&
            wins >= 7
        );
    }

    return false;
}


/* =========================================================
   GERAR OFERTAS
========================================================= */

function generateManagerOffers() {

    const player =
        ensureTeamPlayer();

    const possible =
        managers.filter(
            function (manager) {
                return canOfferManager(manager);
            }
        );

    const shuffled =
        possible
            .slice()
            .sort(
                function () {
                    return Math.random() - 0.5;
                }
            );

    player.managerOffers =
        shuffled
            .slice(0, 3)
            .map(
                function (manager) {
                    return {
                        ...manager
                    };
                }
            );

}


/* =========================================================
   CONTRATO EMPRESÁRIO
========================================================= */

function createManagerContract(manager) {

    const player =
        ensureTeamPlayer();

    return {

        active: true,

        durationYears: 4,

        remainingYears: 4,

        yearsRemaining: 4,

        remainingWeeks: 208,

        commission:
            Number(
                manager.commission || 0
            ),

        managerName:
            manager.name,

        startedYear:
            Number(
                player.year || 2026
            ),

        startedWeek:
            Number(
                player.week || 1
            )

    };

}


/* =========================================================
   GARANTIR CONTRATO
========================================================= */

function ensureManagerContract() {

    const player =
        ensureTeamPlayer();

    if (!player.manager) {
        return null;
    }

    if (!player.managerContract) {

        if (
            player.manager.contract
        ) {

            player.managerContract = {
                ...player.manager.contract
            };

        }
        else {

            player.managerContract =
                createManagerContract(
                    player.manager
                );

        }

    }

    const contract =
        player.managerContract;

    if (
        typeof contract.active !== "boolean"
    ) {
        contract.active = true;
    }

    if (
        typeof contract.durationYears !== "number"
    ) {
        contract.durationYears = 4;
    }

    if (
        typeof contract.remainingYears !== "number"
    ) {

        if (
            typeof contract.yearsRemaining === "number"
        ) {

            contract.remainingYears =
                contract.yearsRemaining;

        }
        else {

            contract.remainingYears = 4;

        }

    }

    contract.yearsRemaining =
        Number(
            contract.remainingYears || 0
        );

    if (
        typeof contract.remainingWeeks !== "number"
    ) {

        contract.remainingWeeks =
            contract.remainingYears * 52;

    }

    if (
        typeof contract.commission !== "number"
    ) {

        contract.commission =
            Number(
                player.manager.commission || 0
            );

    }

    player.manager.contract =
        contract;

    return contract;
}


/* =========================================================
   CONTRATAR EMPRESÁRIO
========================================================= */

function hireManager(index) {

    const player =
        ensureTeamPlayer();

    if (
        !Array.isArray(player.managerOffers) ||
        player.managerOffers.length === 0
    ) {

        generateManagerOffers();

    }

    const manager =
        player.managerOffers[index];

    if (!manager) {
        return;
    }

    player.manager = {

        name:
            manager.name,

        level:
            manager.level,

        levelNumber:
            manager.levelNumber,

        commission:
            manager.commission,

        contacts:
            manager.contacts,

        negotiation:
            manager.negotiation,

        internationalAccess:
            manager.internationalAccess

    };

    player.managerContract =
        createManagerContract(
            manager
        );

    player.manager.contract =
        player.managerContract;

    player.managerContractExpired =
        false;

    player.log.unshift(
        "👔 " +
        manager.name +
        " tornou-se seu empresário com contrato de 4 anos."
    );

    teamSave();

    alert(
        "👔 EMPRESÁRIO CONTRATADO!\n\n" +

        manager.name +

        "\n\nNível: " +
        manager.level +

        "\nComissão: " +
        manager.commission +
        "%" +

        "\n\nContrato: 4 anos" +

        "\n\nContatos: " +
        manager.contacts +

        "\nNegociação: " +
        manager.negotiation +

        "\nAcesso internacional: " +
        manager.internationalAccess
    );

    teamScreen();

}


/* =========================================================
   STATUS CONTRATO
========================================================= */

function getManagerContractStatus() {

    const player =
        ensureTeamPlayer();

    if (!player.manager) {
        return null;
    }

    return ensureManagerContract();

}


/* =========================================================
   CONTRATO ATIVO
========================================================= */

function hasActiveManagerContract() {

    const contract =
        getManagerContractStatus();

    if (!contract) {
        return false;
    }

    return (
        contract.active === true &&
        Number(
            contract.remainingYears || 0
        ) > 0
    );

}


/* =========================================================
   PROCESSAR CONTRATO
========================================================= */

function processManagerContractYear() {

    const player =
        ensureTeamPlayer();

    if (!player.manager) {
        return;
    }

    const contract =
        ensureManagerContract();

    if (
        !contract ||
        !contract.active
    ) {
        return;
    }

    contract.remainingYears =
        Math.max(
            0,
            Number(
                contract.remainingYears || 0
            ) - 1
        );

    contract.yearsRemaining =
        contract.remainingYears;

    contract.remainingWeeks =
        Math.max(
            0,
            Number(
                contract.remainingWeeks || 0
            ) - 52
        );

    player.manager.contract =
        contract;

    if (
        contract.remainingYears <= 0
    ) {

        contract.remainingYears = 0;

        contract.yearsRemaining = 0;

        contract.remainingWeeks = 0;

        contract.active = false;

        player.managerContractExpired =
            true;

        player.log.unshift(
            "📄 O contrato com " +
            player.manager.name +
            " chegou ao fim."
        );

    }

    teamSave();

}


/* =========================================================
   RENOVAR CONTRATO
========================================================= */

function renewManagerContract() {

    const player =
        ensureTeamPlayer();

    if (!player.manager) {
        return;
    }

    const oldContract =
        ensureManagerContract();

    if (
        oldContract &&
        oldContract.active
    ) {

        alert(
            "📄 Seu contrato atual ainda está ativo."
        );

        return;
    }

    player.managerContract = {

        active: true,

        durationYears: 4,

        remainingYears: 4,

        yearsRemaining: 4,

        remainingWeeks: 208,

        commission:
            Number(
                player.manager.commission || 0
            ),

        managerName:
            player.manager.name,

        startedYear:
            Number(
                player.year || 2026
            ),

        startedWeek:
            Number(
                player.week || 1
            )

    };

    player.manager.contract =
        player.managerContract;

    player.managerContractExpired =
        false;

    player.log.unshift(
        "🔄 Contrato renovado com " +
        player.manager.name +
        " por mais 4 anos."
    );

    teamSave();

    alert(
        "🔄 CONTRATO RENOVADO!\n\n" +

        player.manager.name +

        "\n\nDuração: 4 anos" +

        "\nComissão: " +
        player.manager.commission +
        "%"
    );

    if (
        typeof window.home === "function"
    ) {

        window.home();

    }
    else {

        teamScreen();

    }

}


/* =========================================================
   NÃO RENOVAR
========================================================= */

function declineManagerRenewal() {

    const player =
        ensureTeamPlayer();

    if (!player.manager) {
        return;
    }

    const managerName =
        player.manager.name;

    player.log.unshift(
        "🚪 Você decidiu não renovar o contrato com " +
        managerName +
        "."
    );

    player.manager = null;

    player.managerContract = null;

    player.managerContractExpired =
        false;

    teamSave();

    alert(
        "🚪 CONTRATO ENCERRADO\n\n" +
        "Você decidiu seguir sua carreira sem empresário."
    );

    if (
        typeof window.home === "function"
    ) {
        window.home();
    }
    else {
        teamScreen();
    }

}


/* =========================================================
   BÔNUS EMPRESÁRIO
========================================================= */

function getManagerNegotiationBonus() {

    const player =
        ensureTeamPlayer();

    if (!player.manager) {
        return 0;
    }

    return (
        Number(
            player.manager.negotiation || 0
        ) / 5
    );

}

function getManagerInternationalAccess() {

    const player =
        ensureTeamPlayer();

    if (!player.manager) {
        return 0;
    }

    return Number(
        player.manager.internationalAccess || 0
    );

}

function getManagerLevel() {

    const player =
        ensureTeamPlayer();

    if (!player.manager) {
        return 0;
    }

    return Number(
        player.manager.levelNumber || 1
    );

}


/* =========================================================
   ACEITAÇÃO DA EQUIPE
========================================================= */

function getTeamAcceptanceChance(team) {

    const player =
        ensureTeamPlayer();

    let ovr = 40;

    if (
        typeof window.getOverall === "function"
    ) {

        try {

            ovr =
                Number(
                    window.getOverall()
                );

        }
        catch (error) {

            ovr = 40;

        }

    }

    const fame =
        Number(
            player.fame || 0
        );

    let chance = 15;

    chance +=
        ovr - 50;

    chance +=
        fame / 5;

    chance +=
        (
            100 -
            Number(team.prestige || 0)
        ) / 2;

    return teamClamp(
        chance,
        5,
        95
    );

}


/* =========================================================
   ENTRAR NA EQUIPE
========================================================= */

function joinTeam(teamId) {

    const player =
        ensureTeamPlayer();

    const team =
        mmaTeams.find(
            function (item) {
                return item.id === teamId;
            }
        );

    if (!team) {
        return;
    }

    const chance =
        getTeamAcceptanceChance(
            team
        );

    if (
        Math.random() * 100 >
        chance
    ) {

        alert(
            "🏢 A equipe recusou sua entrada.\n\n" +

            "Equipe: " +
            team.name +

            "\n\nTente melhorar seu OVR, fama e carreira."
        );

        return;
    }

    player.team = {

        id:
            team.id,

        name:
            team.name,

        country:
            team.country,

        rank:
            team.rank,

        prestige:
            team.prestige,

        specialty:
            team.specialty

    };

    player.teamHistory.push({

        team:
            team.name,

        country:
            team.country,

        joinedYear:
            player.year,

        joinedWeek:
            player.week

    });

    const coach =
        teamCoaches[
            (team.rank - 1) %
            teamCoaches.length
        ];

    player.coach = {

        id:
            coach.id,

        name:
            coach.name,

        specialty:
            coach.specialty,

        level:
            Math.min(
                99,
                coach.level +
                Math.floor(
                    (
                        100 -
                        team.rank
                    ) / 10
                )
            )

    };

    player.log.unshift(
        "🏢 Você entrou para " +
        team.name +
        "."
    );

    teamSave();

    alert(
        "🏢 EQUIPE CONTRATADA!\n\n" +

        team.name +

        "\n" +
        team.country +

        "\n\nTreinador: " +
        player.coach.name
    );

    teamScreen();

}


/* =========================================================
   SAIR DA EQUIPE
========================================================= */

function leaveTeam() {

    const player =
        ensureTeamPlayer();

    if (!player.team) {
        return;
    }

    const oldTeam =
        player.team.name;

    player.team = null;

    player.coach = null;

    player.log.unshift(
        "🚪 Você deixou a equipe " +
        oldTeam +
        "."
    );

    teamSave();

    teamScreen();

}


/* =========================================================
   TREINADOR PARTICULAR
========================================================= */

function hirePrivateCoach(coachId) {

    const player =
        ensureTeamPlayer();

    const coach =
        privateCoaches.find(
            function (item) {
                return item.id === coachId;
            }
        );

    if (!coach) {
        return;
    }

    const money =
        Number(
            player.money || 0
        );

    if (
        money < coach.cost
    ) {

        alert(
            "💰 Dinheiro insuficiente.\n\n" +
            "Custo: $" +
            coach.cost
        );

        return;
    }

    player.money =
        money -
        coach.cost;

    player.privateCoach = {

        id:
            coach.id,

        name:
            coach.name,

        specialty:
            coach.specialty,

        level:
            coach.level,

        weeklyCost:
            coach.weeklyCost

    };

    player.log.unshift(
        "🥋 Você contratou o treinador particular " +
        coach.name +
        "."
    );

    teamSave();

    alert(
        "🥋 TREINADOR PARTICULAR CONTRATADO!\n\n" +

        coach.name +

        "\nEspecialidade: " +
        coach.specialty +

        "\nNível: " +
        coach.level +

        "\n\nCusto: $" +
        coach.cost +

        "\nCusto semanal: $" +
        coach.weeklyCost
    );

    teamScreen();

}


/* =========================================================
   DEMITIR TREINADOR PARTICULAR
========================================================= */

function firePrivateCoach() {

    const player =
        ensureTeamPlayer();

    if (!player.privateCoach) {
        return;
    }

    const name =
        player.privateCoach.name;

    player.privateCoach = null;

    player.log.unshift(
        "🥋 Você encerrou o trabalho com " +
        name +
        "."
    );

    teamSave();

    teamScreen();

}


/* =========================================================
   TREINAMENTO DA EQUIPE
========================================================= */

function applyTeamTraining() {

    const player =
        ensureTeamPlayer();

    if (!player.team) {
        return;
    }

    const team =
        mmaTeams.find(
            function (item) {
                return item.id === player.team.id;
            }
        );

    if (!team) {
        return;
    }

    if (!player.attributes) {
        player.attributes = {};
    }

    let attribute;

    if (
        team.specialty === "Striking"
    ) {
        attribute = "striking";
    }
    else if (
        team.specialty === "Wrestling"
    ) {
        attribute = "wrestling";
    }
    else if (
        team.specialty === "Grappling"
    ) {
        attribute = "grappling";
    }
    else {
        attribute = "technique";
    }

    const current =
        Number(
            player.attributes[attribute] || 40
        );

    const potential =
        Number(
            player.potential || 90
        );

    const gain =
        0.20 +
        (
            Number(team.coaching || 0) / 500
        );

    player.attributes[attribute] =
        Number(
            Math.min(
                potential,
                current + gain
            ).toFixed(2)
        );

}


/* =========================================================
   TREINAMENTO PARTICULAR
========================================================= */

function applyPrivateCoachTraining() {

    const player =
        ensureTeamPlayer();

    if (!player.privateCoach) {
        return;
    }

    if (!player.attributes) {
        player.attributes = {};
    }

    const coach =
        player.privateCoach;

    let attribute;

    if (
        coach.specialty === "Striking"
    ) {
        attribute = "striking";
    }
    else if (
        coach.specialty === "Wrestling"
    ) {
        attribute = "wrestling";
    }
    else if (
        coach.specialty === "Grappling"
    ) {
        attribute = "grappling";
    }
    else {
        attribute = "technique";
    }

    const current =
        Number(
            player.attributes[attribute] || 40
        );

    const potential =
        Number(
            player.potential || 90
        );

    const gain =
        0.35 +
        (
            Number(coach.level || 0) / 500
        );

    player.attributes[attribute] =
        Number(
            Math.min(
                potential,
                current + gain
            ).toFixed(2)
        );

}


/* =========================================================
   PROCESSAR SEMANA
========================================================= */

function processTeamWeek() {

    const player =
        ensureTeamPlayer();

    applyTeamTraining();

    applyPrivateCoachTraining();

    if (
        player.privateCoach
    ) {

        const cost =
            Number(
                player.privateCoach.weeklyCost || 0
            );

        player.money =
            Math.max(
                0,
                Number(
                    player.money || 0
                ) - cost
            );

    }

    teamSave();

}


/* =========================================================
   EQUIPES POR PAÍS
========================================================= */

function getTeamsByCountry(country) {

    return mmaTeams.filter(
        function (team) {

            return (
                team.country === country
            );

        }
    );

}


/* =========================================================
   TELA DE EMPRESÁRIO
========================================================= */

function openManagerOffers() {

    const player =
        ensureTeamPlayer();

    generateManagerOffers();

    const content =
        document.getElementById(
            "content"
        );

    if (!content) {
        return;
    }

    if (
        !player.managerOffers ||
        player.managerOffers.length === 0
    ) {

        content.innerHTML = `

            <div class="card">

                <div class="title">
                    👔 EMPRESÁRIOS
                </div>

                <p>
                    Nenhum empresário está
                    disponível neste momento.
                </p>

                <button
                    class="gray"
                    onclick="teamScreen()">

                    VOLTAR

                </button>

            </div>

        `;

        return;
    }

    content.innerHTML = `

        <div class="card">

            <div class="title">
                👔 ESCOLHA SEU EMPRESÁRIO
            </div>

            <p>
                As ofertas disponíveis dependem
                da sua fama e carreira.
            </p>

        </div>

        ${
            player.managerOffers
                .map(
                    function (manager, index) {

                        return `

                            <div class="card">

                                <div class="title">
                                    👔 ${manager.name}
                                </div>

                                <div class="statline">
                                    <span>
                                        Nível
                                    </span>

                                    <b>
                                        ${manager.level}
                                    </b>
                                </div>

                                <div class="statline">
                                    <span>
                                        Comissão
                                    </span>

                                    <b>
                                        ${manager.commission}%
                                    </b>
                                </div>

                                <div class="statline">
                                    <span>
                                        Contatos
                                    </span>

                                    <b>
                                        ${manager.contacts}
                                    </b>
                                </div>

                                <div class="statline">
                                    <span>
                                        Negociação
                                    </span>

                                    <b>
                                        ${manager.negotiation}
                                    </b>
                                </div>

                                <div class="statline">
                                    <span>
                                        Acesso internacional
                                    </span>

                                    <b>
                                        ${manager.internationalAccess}
                                    </b>
                                </div>

                                <button
                                    class="green"
                                    onclick="hireManager(${index})">

                                    👔 CONTRATAR EMPRESÁRIO

                                </button>

                            </div>

                        `;

                    }
                )
                .join("")
        }

        <button
            class="main-button"
            onclick="teamScreen()">

            ⬅️ VOLTAR

        </button>

    `;

}


/* =========================================================
   TELA PRINCIPAL DA EQUIPE
========================================================= */

function teamScreen() {

    const player =
        ensureTeamPlayer();

    if (
        typeof window.showGame === "function"
    ) {

        try {
            window.showGame();
        }
        catch (error) {
            console.warn(
                "showGame não pôde ser executado:",
                error
            );
        }

    }

    const content =
        document.getElementById(
            "content"
        );

    if (!content) {
        return;
    }

    const country =
        player.country ||
        "Brasil";

    const teams =
        getTeamsByCountry(
            country
        );

    let teamHTML = "";


    /* =====================================================
       JÁ TEM EQUIPE
    ===================================================== */

    if (player.team) {

        teamHTML = `

            <div class="card">

                <div class="title">
                    🏢 SUA EQUIPE
                </div>

                <div class="statline">
                    <span>
                        Equipe
                    </span>

                    <b>
                        ${player.team.name}
                    </b>
                </div>

                <div class="statline">
                    <span>
                        País
                    </span>

                    <b>
                        ${player.team.country}
                    </b>
                </div>

                <div class="statline">
                    <span>
                        Ranking
                    </span>

                    <b>
                        #${player.team.rank}
                    </b>
                </div>

                <div class="statline">
                    <span>
                        Especialidade
                    </span>

                    <b>
                        ${player.team.specialty}
                    </b>
                </div>

                ${
                    player.coach
                        ?
                        `

                            <div class="statline">

                                <span>
                                    Treinador
                                </span>

                                <b>
                                    ${player.coach.name}
                                </b>

                            </div>

                        `
                        :
                        ""
                }

                <button
                    class="gray"
                    onclick="leaveTeam()">

                    🚪 SAIR DA EQUIPE

                </button>

            </div>

        `;

    }


    /* =====================================================
       PROCURAR EQUIPE
    ===================================================== */

    else {

        teamHTML = `

            <div class="card">

                <div class="title">
                    🏢 PROCURAR EQUIPE
                </div>

                <p>
                    Escolha uma academia para
                    desenvolver sua carreira.
                </p>

            </div>

            ${
                teams
                    .map(
                        function (team) {

                            return `

                                <div class="card">

                                    <div class="title">

                                        #${team.rank}
                                        ${team.name}

                                    </div>

                                    <div class="statline">

                                        <span>
                                            Prestígio
                                        </span>

                                        <b>
                                            ${team.prestige}
                                        </b>

                                    </div>

                                    <div class="statline">

                                        <span>
                                            Estrutura
                                        </span>

                                        <b>
                                            ${team.structure}
                                        </b>

                                    </div>

                                    <div class="statline">

                                        <span>
                                            Treinamento
                                        </span>

                                        <b>
                                            ${team.coaching}
                                        </b>

                                    </div>

                                    <div class="statline">

                                        <span>
                                            Especialidade
                                        </span>

                                        <b>
                                            ${team.specialty}
                                        </b>

                                    </div>

                                    <div class="statline">

                                        <span>
                                            Custo
                                        </span>

                                        <b>
                                            $${team.cost}
                                        </b>

                                    </div>

                                    <button
                                        class="green"
                                        onclick="joinTeam('${team.id}')">

                                        🥊 TENTAR ENTRAR

                                    </button>

                                </div>

                            `;

                        }
                    )
                    .join("")
            }

        `;

    }


    /* =====================================================
       HTML COMPLETO
    ===================================================== */

    content.innerHTML = `

        <div class="card">

            <div class="title">
                🏢 EQUIPE
            </div>

            <p>
                ${country}
            </p>

        </div>


        ${teamHTML}


        <!-- =================================================
             TREINADOR PARTICULAR
        ================================================== -->

        <div class="card">

            <div class="title">
                🥋 TREINADOR PARTICULAR
            </div>

            ${
                player.privateCoach
                    ?

                    `

                        <div class="statline">

                            <span>
                                Treinador
                            </span>

                            <b>
                                ${player.privateCoach.name}
                            </b>

                        </div>

                        <div class="statline">

                            <span>
                                Especialidade
                            </span>

                            <b>
                                ${player.privateCoach.specialty}
                            </b>

                        </div>

                        <div class="statline">

                            <span>
                                Nível
                            </span>

                            <b>
                                ${player.privateCoach.level}
                            </b>

                        </div>

                        <div class="statline">

                            <span>
                                Custo semanal
                            </span>

                            <b>
                                $${player.privateCoach.weeklyCost}
                            </b>

                        </div>

                        <button
                            class="gray"
                            onclick="firePrivateCoach()">

                            🚪 ENCERRAR TREINADOR

                        </button>

                    `

                    :

                    `

                        <p>
                            Tenha dinheiro suficiente
                            para contratar um treinador
                            particular.
                        </p>

                        ${
                            privateCoaches
                                .map(
                                    function (coach) {

                                        return `

                                            <div
                                                class="statline"
                                                style="margin-top:10px">

                                                <span>
                                                    ${coach.name}
                                                    —
                                                    ${coach.specialty}
                                                </span>

                                                <b>
                                                    Nível
                                                    ${coach.level}
                                                </b>

                                            </div>

                                            <button
                                                class="green"
                                                onclick="hirePrivateCoach('${coach.id}')">

                                                🥋 CONTRATAR
                                                $${coach.cost}

                                            </button>

                                        `;

                                    }
                                )
                                .join("")
                        }

                    `
            }

        </div>


        <!-- =================================================
             👔 EMPRESÁRIO
        ================================================== -->

        <div class="card">

            <div class="title">
                👔 EMPRESÁRIO
            </div>

            ${
                player.manager

                    ?

                    `

                        <div class="statline">

                            <span>
                                Empresário
                            </span>

                            <b>
                                ${player.manager.name}
                            </b>

                        </div>

                        <div class="statline">

                            <span>
                                Nível
                            </span>

                            <b>
                                ${player.manager.level}
                            </b>

                        </div>

                        <div class="statline">

                            <span>
                                Comissão
                            </span>

                            <b>
                                ${player.manager.commission}%
                            </b>

                        </div>

                        <div class="statline">

                            <span>
                                Contatos
                            </span>

                            <b>
                                ${player.manager.contacts}
                            </b>

                        </div>

                        <div class="statline">

                            <span>
                                Negociação
                            </span>

                            <b>
                                ${player.manager.negotiation}
                            </b>

                        </div>

                        <div class="statline">

                            <span>
                                Acesso internacional
                            </span>

                            <b>
                                ${player.manager.internationalAccess}
                            </b>

                        </div>

                        ${
                            getManagerContractStatus()
                                ?

                                `

                                    <div class="statline">

                                        <span>
                                            Contrato
                                        </span>

                                        <b>

                                            ${
                                                getManagerContractStatus()
                                                    .yearsRemaining
                                            }

                                            anos

                                        </b>

                                    </div>

                                `

                                :

                                ""
                        }

                        ${
                            player.managerContractExpired

                                ?

                                `

                                    <button
                                        class="green"
                                        onclick="renewManagerContract()">

                                        🔄 RENOVAR CONTRATO

                                    </button>

                                    <button
                                        class="gray"
                                        onclick="declineManagerRenewal()">

                                        🚪 NÃO RENOVAR

                                    </button>

                                `

                                :

                                ""
                        }

                    `

                    :

                    `

                        <p>
                            Você ainda não possui
                            empresário.
                        </p>

                        <p>
                            Empresários podem melhorar
                            suas negociações, contatos
                            e oportunidades internacionais.
                        </p>

                        <button
                            class="green"
                            onclick="openManagerOffers()">

                            👔 PROCURAR EMPRESÁRIO

                        </button>

                    `
            }

        </div>


        <button
            class="main-button"
            onclick="tab('home')">

            🏠 VOLTAR AO INÍCIO

        </button>

    `;

}


/* =========================================================
   🌎 EXPORTAR TUDO PARA O WINDOW
   ISSO É IMPORTANTE PARA O MAIN.JS
========================================================= */

window.mmaTeams =
    mmaTeams;

window.teamCoaches =
    teamCoaches;

window.privateCoaches =
    privateCoaches;

window.managers =
    managers;


/* EQUIPE */

window.ensureTeamPlayer =
    ensureTeamPlayer;

window.teamScreen =
    teamScreen;

window.joinTeam =
    joinTeam;

window.leaveTeam =
    leaveTeam;

window.hirePrivateCoach =
    hirePrivateCoach;

window.firePrivateCoach =
    firePrivateCoach;

window.processTeamWeek =
    processTeamWeek;

window.applyTeamTraining =
    applyTeamTraining;

window.applyPrivateCoachTraining =
    applyPrivateCoachTraining;

window.getTeamsByCountry =
    getTeamsByCountry;

window.getTeamAcceptanceChance =
    getTeamAcceptanceChance;


/* EMPRESÁRIO */

window.generateManagerOffers =
    generateManagerOffers;

window.openManagerOffers =
    openManagerOffers;

window.hireManager =
    hireManager;

window.canOfferManager =
    canOfferManager;

window.getManagerNegotiationBonus =
    getManagerNegotiationBonus;

window.getManagerInternationalAccess =
    getManagerInternationalAccess;

window.getManagerLevel =
    getManagerLevel;

window.createManagerContract =
    createManagerContract;

window.ensureManagerContract =
    ensureManagerContract;

window.processManagerContractYear =
    processManagerContractYear;

window.getManagerContractStatus =
    getManagerContractStatus;

window.hasActiveManagerContract =
    hasActiveManagerContract;

window.renewManagerContract =
    renewManagerContract;

window.declineManagerRenewal =
    declineManagerRenewal;


/* =========================================================
   ✅ MARCADOR DE SISTEMA CARREGADO
========================================================= */

window.teamSystemLoaded =
    true;


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

try {

    if (
        typeof window.player !== "undefined" &&
        window.player
    ) {

        ensureTeamPlayer();

    }

}
catch (error) {

    console.error(
        "Erro ao inicializar TEAM.JS:",
        error
    );

}


/* =========================================================
   FIM DO TEAM.JS
========================================================= */

})();
