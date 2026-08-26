/* =========================================================
   MMA LIFE DYNASTY
   EVENTS.JS
   PROJETO — EVENTOS + CINTURÕES + MUNDO MMA
========================================================= */
/* =========================================================
   EVENTOS
========================================================= */
const events = [
    /* ================= AMADOR ================= */
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
    /* ================= REGIONAL ================= */
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
    /* ================= NACIONAL ================= */
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
    /* ================= NACIONAL ESTRANGEIRO ================= */
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
    /* ================= INTERNACIONAL ================= */
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
    /* ================= UFC ================= */
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
   CATEGORIAS
========================================================= */
const eventWeightClasses = [
    "Peso Leve",
    "Peso Meio-Médio",
    "Peso Médio",
    "Peso Meio-Pesado",
    "Peso Pesado"
];
/* =========================================================
   CINTURÕES
========================================================= */
function createChampionship(event, weightClass) {
    return {
        id:
            event.id +
            "_" +
            weightClass
                .toLowerCase()
                .replace(/\s+/g, "_"),
        organization: event.name,
        organizationId: event.id,
        weightClass: weightClass,
        champion: null,
        interimChampion: null,
        defenses: 0,
        titleFights: 0,
        created: true
    };
}
function generateOrganizationChampionships(event) {
    if (!event || !event.championship) {
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
function getEventChampionship(event, weightClass) {
    if (!event || !event.championship) {
        return null;
    }
    return createChampionship(
        event,
        weightClass
    );
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
    return player.careerStage || "regional";
}
/* =========================================================
   EVENTOS
========================================================= */
function generateAmateurEvent() {
    const list =
        events.filter(
            event =>
                event.careerStage === "amateur"
        );
    return list[
        Math.floor(
            Math.random() * list.length
        )
    ];
}
function generateRegionalEvent() {
    const list =
        events.filter(
            event =>
                event.careerStage === "regional"
        );
    return list[
        Math.floor(
            Math.random() * list.length
        )
    ];
}
function generateNationalEvent() {
    const nationalEvents =
        events.filter(
            event =>
                event.careerStage === "national" &&
                !event.foreign
        );
    if (
        player.country === "Brasil" &&
        player.manager &&
        Math.random() < 0.08
    ) {
        const foreignEvents =
            events.filter(
                event =>
                    event.careerStage === "national" &&
                    event.foreign
            );
        if (foreignEvents.length > 0) {
            return foreignEvents[
                Math.floor(
                    Math.random() *
                    foreignEvents.length
                )
            ];
        }
    }
    return nationalEvents[
        Math.floor(
            Math.random() *
            nationalEvents.length
        )
    ];
}
function generateInternationalEvent() {
    const list =
        events.filter(
            event =>
                event.careerStage === "international"
        );
    return list[
        Math.floor(
            Math.random() * list.length
        )
    ];
}
function generateEliteEvent() {
    const list =
        events.filter(
            event =>
                event.careerStage === "elite"
        );
    return list[
        Math.floor(
            Math.random() * list.length
        )
    ];
}
/* =========================================================
   PFL WORLD TOURNAMENT
========================================================= */
function generatePFLTournament() {
    return {
        id: "pfl_world_tournament",
        name: "PFL World Tournament",
        level: 5,
        international: true,
        professional: true,
        careerStage: "international",
        country: "Estados Unidos",
        purse: 8000,
        winBonus: 8000,
        prestige: 90,
        championship: true,
        tournament: true,
        tournamentName: "PFL World Tournament",
        tournamentPrize: 1000000,
        tournamentRound: 1,
        titleFight: false,
        rounds: 3
    };
}
/* =========================================================
   GERAR EVENTO
========================================================= */
function generateEvent() {
    const stage =
        getCareerStage();
    if (stage === "amateur") {
        return generateAmateurEvent();
    }
    if (stage === "regional") {
        return generateRegionalEvent();
    }
    if (stage === "national") {
        return generateNationalEvent();
    }
    if (stage === "international") {
        if (
            player.manager &&
            Math.random() < 0.10
        ) {
            return generatePFLTournament();
        }
        return generateInternationalEvent();
    }
    if (stage === "elite") {
        return generateEliteEvent();
    }
    return generateAmateurEvent();
}
/* =========================================================
   PREPARAR EVENTO
========================================================= */
function prepareEventForPlayer(event) {
    if (!event) {
        return null;
    }
    const weightClass =
        player.weight || "Peso Leve";
    const prepared = {
        ...event,
        weightClass: weightClass,
        titleFight: false,
        championship:
            event.championship
                ? getEventChampionship(
                    event,
                    weightClass
                )
                : null
    };
    if (
        player.championship &&
        player.championship.title &&
        player.championship.organization === event.name &&
        player.championship.weightClass === weightClass
    ) {
        prepared.titleFight = true;
        prepared.titleDefense = true;
    }
    /*
     * TODA LUTA DE CINTURÃO = 5 ROUNDS
     */
    if (
        prepared.titleFight ||
        prepared.titleDefense
    ) {
        prepared.rounds = 5;
    }
    else if (
        typeof prepared.rounds !== "number"
    ) {
        prepared.rounds = 3;
    }
    return prepared;
}
/* =========================================================
   UTILIDADES
========================================================= */
function getEventPrestige(event) {
    return event
        ? event.prestige || 0
        : 0;
}
function getEventPurse(event) {
    return event
        ? event.purse || 0
        : 0;
}
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
   🌎 MUNDO MMA
========================================================= */
const mmaWorld = {
    initialized: false,
    week: 0,
    fighters: [],
    eventsThisWeek: [],
    news: [],
    championships: [],
    ufcP4P: []
};
/* =========================================================
   NOMES
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
const worldWeights = [
    "Peso Leve",
    "Peso Meio-Médio",
    "Peso Médio",
    "Peso Meio-Pesado",
    "Peso Pesado"
];
/* =========================================================
   ORGANIZAÇÕES
========================================================= */
const worldOrganizations = [
    {
        id: "world_regional_brazil",
        name: "Circuito Regional Brasileiro",
        stage: "regional",
        country: "Brasil",
        level: 1,
        prestige: 20,
        minWeeksBetweenFights: 4
    },
    {
        id: "world_shooto_brasil",
        name: "Shooto Brasil",
        stage: "regional",
        country: "Brasil",
        level: 1,
        prestige: 25,
        minWeeksBetweenFights: 4
    },
    {
        id: "world_jungle_fight",
        name: "Jungle Fight",
        stage: "national",
        country: "Brasil",
        level: 2,
        prestige: 45,
        minWeeksBetweenFights: 6
    },
    {
        id: "world_lfa",
        name: "LFA",
        stage: "national",
        country: "Estados Unidos",
        level: 2,
        prestige: 50,
        minWeeksBetweenFights: 6
    },
    {
        id: "world_pfl",
        name: "PFL",
        stage: "international",
        country: "Estados Unidos",
        level: 4,
        prestige: 80,
        minWeeksBetweenFights: 8
    },
    {
        id: "world_one",
        name: "ONE Championship",
        stage: "international",
        country: "Singapura",
        level: 4,
        prestige: 82,
        minWeeksBetweenFights: 8
    },
    {
        id: "world_bellator",
        name: "Bellator",
        stage: "international",
        country: "Estados Unidos",
        level: 4,
        prestige: 78,
        minWeeksBetweenFights: 8
    },
    {
        id: "world_rizin",
        name: "RIZIN",
        stage: "international",
        country: "Japão",
        level: 4,
        prestige: 75,
        minWeeksBetweenFights: 8
    },
    {
        id: "world_ksw",
        name: "KSW",
        stage: "international",
        country: "Polônia",
        level: 4,
        prestige: 70,
        minWeeksBetweenFights: 8
    },
    {
        id: "world_uae",
        name: "UAE Warriors",
        stage: "international",
        country: "Emirados Árabes",
        level: 4,
        prestige: 67,
        minWeeksBetweenFights: 8
    },
    {
        id: "world_ufc",
        name: "UFC",
        stage: "elite",
        country: "Estados Unidos",
        level: 6,
        prestige: 100,
        minWeeksBetweenFights: 10
    }
];
/* =========================================================
   NOME
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
   CRIAR LUTADOR
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
        weight: weight,
        organization: organization.name,
        organizationId: organization.id,
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
        draws: 0,
        ranking: null,
        champion: false,
        interimChampion: false,
        power:
            45 +
            Math.random() * 35,
        fame:
            5 +
            Math.random() * 30,
        active: true,
        injuredWeeks: 0,
        weeksSinceLastFight:
            8 +
            Math.floor(
                Math.random() * 12
            ),
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
    if (mmaWorld.initialized) {
        return;
    }
    mmaWorld.fighters = [];
    mmaWorld.championships = [];
    mmaWorld.ufcP4P = [];
    let fighterIndex = 0;
    worldOrganizations.forEach(
        organization => {
            worldWeights.forEach(
                weight => {
                    mmaWorld.championships.push({
                        id:
                            organization.id +
                            "_" +
                            weight
                                .toLowerCase()
                                .replace(/\s+/g, "_"),
                        organization:
                            organization.name,
                        organizationId:
                            organization.id,
                        weightClass:
                            weight,
                        champion: null,
                        interimChampion: null,
                        defenses: 0,
                        titleFights: 0
                    });
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
                        amount = 25;
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
    updateUFCPoundForPound();
    mmaWorld.initialized = true;
}
/* =========================================================
   LUTADORES DA ORGANIZAÇÃO
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
   RANKING
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
                    (a.wins * 4) +
                    a.fame +
                    a.power;
                const scoreB =
                    (b.wins * 4) +
                    b.fame +
                    b.power;
                return scoreB - scoreA;
            }
        )
        .slice(0, 15);
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
                        getWorldRanking(
                            organization.name,
                            weight
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
   CAMPEÕES
========================================================= */
function updateWorldChampions() {
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
                        fighter.champion = false;
                        fighter.interimChampion = false;
                    }
                }
            );
            if (champion) {
                champion.champion = true;
                championship.champion =
                    champion.id;
            }
        }
    );
}
/* =========================================================
   UFC POUND FOR POUND
========================================================= */
function updateUFCPoundForPound() {
    const ufcFighters =
        mmaWorld.fighters.filter(
            fighter =>
                fighter.active &&
                fighter.organization === "UFC"
        );
    mmaWorld.ufcP4P =
        ufcFighters
            .map(
                fighter => ({
                    ...fighter,
                    p4pScore:
                        (
                            fighter.power * 0.45
                        ) +
                        (
                            fighter.fame * 0.25
                        ) +
                        (
                            fighter.wins * 4
                        ) +
                        (
                            fighter.champion
                                ? 25
                                : 0
                        )
                })
            )
            .sort(
                (a, b) =>
                    b.p4pScore -
                    a.p4pScore
            )
            .slice(0, 15)
            .map(
                (
                    fighter,
                    index
                ) => ({
                    ...fighter,
                    p4pRanking:
                        index + 1
                })
            );
}
/* =========================================================
   SIMULAR LUTA
========================================================= */
function simulateWorldFight(
    fighterA,
    fighterB
) {
    if (!fighterA || !fighterB) {
        return null;
    }
    const powerA =
        fighterA.power +
        (Math.random() * 20) -
        10;
    const powerB =
        fighterB.power +
        (Math.random() * 20) -
        10;
    let winner;
    let loser;
    if (powerA >= powerB) {
        winner = fighterA;
        loser = fighterB;
    }
    else {
        winner = fighterB;
        loser = fighterA;
    }
    winner.wins++;
    loser.losses++;
    winner.fame += 1;
    loser.fame =
        Math.max(
            0,
            loser.fame - 0.5
        );
    winner.power =
        Math.min(
            100,
            winner.power + 0.2
        );
    loser.power =
        Math.max(
            30,
            loser.power - 0.1
        );
    winner.weeksSinceLastFight = 0;
    loser.weeksSinceLastFight = 0;
    return {
        winner,
        loser
    };
}
/* =========================================================
   SIMULAR ORGANIZAÇÃO
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
                )
                .filter(
                    fighter =>
                        fighter.weeksSinceLastFight >=
                        organization.minWeeksBetweenFights
                );
            const shuffled =
                [...fighters].sort(
                    () =>
                        Math.random() - 0.5
                );
            for (
                let i = 0;
                i + 1 < shuffled.length;
                i += 2
            ) {
                if (
                    Math.random() > 0.35
                ) {
                    continue;
                }
                const result =
                    simulateWorldFight(
                        shuffled[i],
                        shuffled[i + 1]
                    );
                if (result) {
                    mmaWorld.eventsThisWeek.push({
                        organization:
                            organization.name,
                        organizationId:
                            organization.id,
                        weight: weight,
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
    /*
     * Todo mundo fica uma semana mais próximo
     * da próxima luta.
     */
    mmaWorld.fighters.forEach(
        fighter => {
            if (fighter.active) {
                fighter.weeksSinceLastFight++;
                if (
                    fighter.injuredWeeks > 0
                ) {
                    fighter.injuredWeeks--;
                }
            }
        }
    );
    /*
     * Cada organização possui
     * seu próprio ritmo.
     */
    worldOrganizations.forEach(
        organization => {
            simulateWorldOrganization(
                organization
            );
        }
    );
    updateWorldRankings();
    updateWorldChampions();
    updateUFCPoundForPound();
    if (
        mmaWorld.eventsThisWeek.length > 0
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
   CAMPEÃO
========================================================= */
function getWorldChampion(
    organization,
    weight
) {
    const championship =
        getWorldChampionship(
            organization,
            weight
        );
    if (
        championship &&
        championship.champion
    ) {
        return mmaWorld.fighters.find(
            fighter =>
                fighter.id ===
                championship.champion
        ) || null;
    }
    return null;
}
/* =========================================================
   CINTURÃO
========================================================= */
function getWorldChampionship(
    organization,
    weight
) {
    if (!mmaWorld.championships) {
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
   POUND FOR POUND UFC
========================================================= */
function getUFCPoundForPound() {
    return mmaWorld.ufcP4P || [];
}
/* =========================================================
   NOTÍCIAS
========================================================= */
function getWorldNews() {
    return mmaWorld.news || [];
}
/* =========================================================
   DISPONIBILIZAR GLOBALMENTE
========================================================= */
window.events =
    events;
window.eventWeightClasses =
    eventWeightClasses;
window.mmaWorld =
    mmaWorld;
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
window.getWorldFighters =
    getWorldFighters;
window.getWorldRanking =
    getWorldRanking;
window.getWorldChampion =
    getWorldChampion;
window.getWorldChampionship =
    getWorldChampionship;
window.getUFCPoundForPound =
    getUFCPoundForPound;
window.updateUFCPoundForPound =
    updateUFCPoundForPound;
window.getWorldNews =
    getWorldNews;
