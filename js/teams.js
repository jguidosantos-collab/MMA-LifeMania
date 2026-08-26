/* =========================================================
   🏢 MMA LIFE DYNASTY
   TEAM.JS
   SISTEMA DEFINITIVO DE EQUIPES, ACADEMIAS E TREINADORES
========================================================= */
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
function teamSave() {
    if (typeof saveGame === "function") {
        saveGame();
    }
    else if (typeof save === "function") {
        save();
    }
    else {
        localStorage.setItem(
            "mmaLifePlayer",
            JSON.stringify(window.player)
        );
    }
}
/* =========================================================
   BANCO DE EQUIPES
   TOP 10 DE CADA PAÍS
========================================================= */
const mmaTeams = [
    /* =====================================================
       🇧🇷 BRASIL
    ===================================================== */
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
    /* =====================================================
       🇺🇸 ESTADOS UNIDOS
    ===================================================== */
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
    /* =====================================================
       🇯🇵 JAPÃO
    ===================================================== */
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
    /* =====================================================
       🇲🇽 MÉXICO
    ===================================================== */
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
    /* =====================================================
       🇦🇷 ARGENTINA
    ===================================================== */
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
    /* =====================================================
       🇨🇦 CANADÁ
    ===================================================== */
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
    /* =====================================================
       🇷🇺 RÚSSIA
    ===================================================== */
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
    /* =====================================================
       🇬🇧 REINO UNIDO
    ===================================================== */
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
   GERADOR AUXILIAR PARA OS PAÍSES
   QUE POSSUEM TOP 10 PADRONIZADO
========================================================= */
function createCountryTeams(
    country,
    prefix,
    names
) {
    return names.map(
        (name, index) => {
            const rank =
                index + 1;
            const prestige =
                98 -
                (
                    index * 3
                );
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
                    (
                        10 - rank
                    ) * 120,
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
   TREINADORES DAS EQUIPES
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
   TREINADORES PARTICULARES
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
   GARANTIR ESTRUTURA DO PLAYER
========================================================= */
function ensureTeamPlayer() {
    if (
        typeof window.player ===
        "undefined" ||
        !window.player
    ) {
        if (
            typeof createDefaultPlayer ===
            "function"
        ) {
            window.player =
                createDefaultPlayer();
        }
    }
    if (!player.team) {
        player.team = null;
    }
    if (!player.coach) {
        player.coach = null;
    }
    if (!player.privateCoach) {
        player.privateCoach = null;
    }
    if (!player.teamHistory) {
        player.teamHistory = [];
    }
}
/* =========================================================
   CHANCE DE ENTRAR NA EQUIPE
========================================================= */
function getTeamAcceptanceChance(team) {
    ensureTeamPlayer();
    const ovr =
        typeof getOverall === "function"
        ? getOverall()
        : 40;
    const fame =
        Number(
            player.fame || 0
        );
    let chance =
        15;
    chance +=
        ovr -
        50;
    chance +=
        fame / 5;
    chance +=
        (
            100 -
            team.prestige
        ) / 2;
    return teamClamp(
        chance,
        5,
        95
    );
}
/* =========================================================
   CONTRATAR EQUIPE
========================================================= */
function joinTeam(teamId) {
    ensureTeamPlayer();
    const team =
        mmaTeams.find(
            item =>
                item.id === teamId
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
            "\n\n" +
            "Tente melhorar seu OVR, fama e carreira."
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
            team.rank % teamCoaches.length
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
    player.log =
        player.log || [];
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
        "\n\n" +
        "Treinador: " +
        player.coach.name
    );
    teamScreen();
}
/* =========================================================
   SAIR DA EQUIPE
========================================================= */
function leaveTeam() {
    ensureTeamPlayer();
    if (!player.team) {
        return;
    }
    const oldTeam =
        player.team.name;
    player.team = null;
    player.coach = null;
    player.log =
        player.log || [];
    player.log.unshift(
        "🚪 Você deixou a equipe " +
        oldTeam +
        "."
    );
    teamSave();
    teamScreen();
}
/* =========================================================
   CONTRATAR TREINADOR PARTICULAR
========================================================= */
function hirePrivateCoach(coachId) {
    ensureTeamPlayer();
    const coach =
        privateCoaches.find(
            item =>
                item.id === coachId
        );
    if (!coach) {
        return;
    }
    const money =
        Number(
            player.money || 0
        );
    if (
        money <
        coach.cost
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
    player.log =
        player.log || [];
    player.log.unshift(
        "🥋 Você contratou o treinador particular " +
        coach.name +
        "."
    );
    teamSave();
    alert(
        "🥋 TREINADOR PARTICULAR CONTRATADO!\n\n" +
        coach.name +
        "\n" +
        "Especialidade: " +
        coach.specialty +
        "\n" +
        "Nível: " +
        coach.level +
        "\n\n" +
        "Custo: $" +
        coach.cost +
        "\n" +
        "Custo semanal: $" +
        coach.weeklyCost
    );
    teamScreen();
}
/* =========================================================
   DEMITIR TREINADOR PARTICULAR
========================================================= */
function firePrivateCoach() {
    ensureTeamPlayer();
    if (!player.privateCoach) {
        return;
    }
    const name =
        player.privateCoach.name;
    player.privateCoach = null;
    player.log =
        player.log || [];
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
    ensureTeamPlayer();
    if (!player.team) {
        return;
    }
    const team =
        mmaTeams.find(
            item =>
                item.id ===
                player.team.id
        );
    if (!team) {
        return;
    }
    if (!player.attributes) {
        player.attributes = {};
    }
    const specialty =
        team.specialty;
    let attribute;
    if (
        specialty ===
        "Striking"
    ) {
        attribute =
            "striking";
    }
    else if (
        specialty ===
        "Wrestling"
    ) {
        attribute =
            "wrestling";
    }
    else if (
        specialty ===
        "Grappling"
    ) {
        attribute =
            "grappling";
    }
    else {
        attribute =
            "technique";
    }
    const current =
        Number(
            player.attributes[
                attribute
            ] || 40
        );
    const potential =
        Number(
            player.potential ||
            90
        );
    const gain =
        0.20 +
        (
            team.coaching /
            500
        );
    player.attributes[
        attribute
    ] =
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
        coach.specialty ===
        "Striking"
    ) {
        attribute =
            "striking";
    }
    else if (
        coach.specialty ===
        "Wrestling"
    ) {
        attribute =
            "wrestling";
    }
    else if (
        coach.specialty ===
        "Grappling"
    ) {
        attribute =
            "grappling";
    }
    else {
        attribute =
            "technique";
    }
    const current =
        Number(
            player.attributes[
                attribute
            ] || 40
        );
    const potential =
        Number(
            player.potential ||
            90
        );
    const gain =
        0.35 +
        (
            coach.level /
            500
        );
    player.attributes[
        attribute
    ] =
        Number(
            Math.min(
                potential,
                current + gain
            ).toFixed(2)
        );
}
/* =========================================================
   PROCESSAR EQUIPE NA VIRADA DA SEMANA
========================================================= */
function processTeamWeek() {
    ensureTeamPlayer();
    applyTeamTraining();
    applyPrivateCoachTraining();
    if (
        player.privateCoach
    ) {
        const cost =
            Number(
                player.privateCoach
                    .weeklyCost || 0
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
   FILTRAR EQUIPES DO PAÍS
========================================================= */
function getTeamsByCountry(
    country
) {
    return mmaTeams.filter(
        team =>
            team.country ===
            country
    );
}
/* =========================================================
   TELA DE EQUIPE
========================================================= */
function teamScreen() {
    ensureTeamPlayer();
    showGame();
    const content =
        getElement("content");
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
    if (player.team) {
        teamHTML = `
            <div class="card">
                <div class="title">
                    🏢 SUA EQUIPE
                </div>
                <div class="statline">
                    <span>Equipe</span>
                    <b>
                        ${player.team.name}
                    </b>
                </div>
                <div class="statline">
                    <span>País</span>
                    <b>
                        ${player.team.country}
                    </b>
                </div>
                <div class="statline">
                    <span>Ranking</span>
                    <b>
                        #${player.team.rank}
                    </b>
                </div>
                <div class="statline">
                    <span>Especialidade</span>
                    <b>
                        ${player.team.specialty}
                    </b>
                </div>
                ${
                    player.coach
                    ?
                    `
                    <div class="statline">
                        <span>Treinador</span>
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
                teams.map(
                    team => `
                    <div class="card">
                        <div class="title">
                            #${team.rank}
                            ${team.name}
                        </div>
                        <div class="statline">
                            <span>Prestígio</span>
                            <b>
                                ${team.prestige}
                            </b>
                        </div>
                        <div class="statline">
                            <span>Estrutura</span>
                            <b>
                                ${team.structure}
                            </b>
                        </div>
                        <div class="statline">
                            <span>Treinamento</span>
                            <b>
                                ${team.coaching}
                            </b>
                        </div>
                        <div class="statline">
                            <span>Especialidade</span>
                            <b>
                                ${team.specialty}
                            </b>
                        </div>
                        <div class="statline">
                            <span>Custo</span>
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
                    `
                ).join("")
            }
        `;
    }
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
                        privateCoaches.map(
                            coach => `
                                <div
                                    class="statline"
                                    style="margin-top:10px"
                                >
                                    <span>
                                        ${coach.name}
                                        —
                                        ${coach.specialty}
                                    </span>
                                    <b>
                                        Nível ${coach.level}
                                    </b>
                                </div>
                                <button
                                    class="green"
                                    onclick="hirePrivateCoach('${coach.id}')">
                                    🥋 CONTRATAR
                                    $${coach.cost}
                                </button>
                            `
                        ).join("")
                    }
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
   COMPATIBILIDADE
========================================================= */
window.mmaTeams =
    mmaTeams;
window.teamCoaches =
    teamCoaches;
window.privateCoaches =
    privateCoaches;
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
/* =========================================================
   INICIALIZAÇÃO
========================================================= */
if (
    typeof window.player !==
    "undefined" &&
    window.player
) {
    ensureTeamPlayer();
}
