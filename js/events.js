EVENTS.JS — MUNDO MMA + RANKINGS + CAMPEÕES

/* =========================================================
   MMA LIFE DYNASTY
   EVENTS.JS
   EVENTOS + CINTURÕES + MUNDO MMA + RANKINGS
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
    return {
        organization: event.name,
        organizationId: event.id,
        weightClass: weightClass,
        champion: null,
        interimChampion: null,
        defenses: 0,
        titleFights: 0
    };
}
/* =========================================================
   ESTÁGIO
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
    const national =
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
        const foreign =
            events.filter(
                event =>
                    event.careerStage === "national" &&
                    event.foreign
            );
        if (foreign.length > 0) {
            return foreign[
                Math.floor(
                    Math.random() * foreign.length
                )
            ];
        }
    }
    return national[
        Math.floor(
            Math.random() * national.length
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
        titleFight: false
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
     * Luta de cinturão sempre terá 5 rounds.
     */
    if (prepared.titleFight) {
        prepared.rounds = 5;
    }
    else {
        prepared.rounds = 3;
    }
    return prepared;
}
/* =========================================================
   UTILIDADES
========================================================= */
function getEventPrestige(event) {
    return event ? event.prestige || 0 : 0;
}
function getEventPurse(event) {
    return event ? event.purse || 0 : 0;
}
function getEventWinBonus(event) {
    if (!event) {
        return 0;
    }
    return event.winBonus || event.purse || 0;
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
    rankings: {},
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
   ORGANIZAÇÕES DO MUNDO
========================================================= */
const worldOrganizations = [
    {
        id: "world_regional_brazil",
        name: "Circuito Regional Brasileiro",
        stage: "regional",
        country: "Brasil",
        level: 1,
        prestige: 20
    },
    {
        id: "world_shooto_brasil",
        name: "Shooto Brasil",
        stage: "regional",
        country: "Brasil",
        level: 1,
        prestige: 25
    },
    {
        id: "world_jungle_fight",
        name: "Jungle Fight",
        stage: "national",
        country: "Brasil",
        level: 2,
        prestige: 45
    },
    {
        id: "world_lfa",
        name: "LFA",
        stage: "national",
        country: "Estados Unidos",
        level: 2,
        prestige: 50
    },
    {
        id: "world_pfl",
        name: "PFL",
        stage: "international",
        country: "Estados Unidos",
        level: 4,
        prestige: 80
    },
    {
        id: "world_one",
        name: "ONE Championship",
        stage: "international",
        country: "Singapura",
        level: 4,
        prestige: 82
    },
    {
        id: "world_bellator",
        name: "Bellator",
        stage: "international",
        country: "Estados Unidos",
        level: 4,
        prestige: 78
    },
    {
        id: "world_rizin",
        name: "RIZIN",
        stage: "international",
        country: "Japão",
        level: 4,
        prestige: 75
    },
    {
        id: "world_ksw",
        name: "KSW",
        stage: "international",
        country: "Polônia",
        level: 4,
        prestige: 70
    },
    {
        id: "world_uae",
        name: "UAE Warriors",
        stage: "international",
        country: "Emirados Árabes",
        level: 4,
        prestige: 67
    },
    {
        id: "world_ufc",
        name: "UFC",
        stage: "elite",
        country: "Estados Unidos",
        level: 6,
        prestige: 100
    }
];
/* =========================================================
   NOME ALEATÓRIO
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
        organization:
            organization.name,
        organizationId:
            organization.id,
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
        /*
         * Evita que o mesmo lutador lute
         * toda semana.
         */
        weeksSinceFight:
            Math.floor(
                Math.random() * 20
            ),
        weeksUntilNextFight: 0,
        lastFightWeek: null,
        titleWins: 0,
        titleLosses: 0,
        defenses: 0,
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
    mmaWorld.rankings = {};
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
                    let amount = 10;
                    if (
                        organization.stage === "national"
                    ) {
                        amount = 15;
                    }
                    if (
                        organization.stage === "international"
                    ) {
                        amount = 20;
                    }
                    if (
                        organization.stage === "elite"
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
    updateWorldChampions();
    updateUFCPoundForPound();
    mmaWorld.initialized =
        true;
}
/* =========================================================
   LUTADORES DE ORGANIZAÇÃO
========================================================= */
function getWorldFighters(
    organization,
    weight
) {
    return mmaWorld.fighters.filter(
        fighter =>
            fighter.active &&
            fighter.organization === organization &&
            fighter.weight === weight
    );
}
/* =========================================================
   RANKING TOP 15
========================================================= */
function calculateWorldRankingScore(
    fighter
) {
    return (
        fighter.wins * 4 +
        fighter.fame +
        fighter.power +
        fighter.titleWins * 8 +
        fighter.defenses * 5 -
        fighter.losses * 2
    );
}
function updateWorldRankings() {
    mmaWorld.rankings = {};
    worldOrganizations.forEach(
        organization => {
            mmaWorld.rankings[
                organization.id
            ] = {};
            worldWeights.forEach(
                weight => {
                    const fighters =
                        getWorldFighters(
                            organization.name,
                            weight
                        );
                    fighters.sort(
                        (a, b) =>
                            calculateWorldRankingScore(b) -
                            calculateWorldRankingScore(a)
                    );
                    const top15 =
                        fighters.slice(
                            0,
                            15
                        );
                    top15.forEach(
                        (
                            fighter,
                            index
                        ) => {
                            fighter.ranking =
                                index + 1;
                        }
                    );
                    fighters
                        .slice(15)
                        .forEach(
                            fighter => {
                                fighter.ranking =
                                    null;
                            }
                        );
                    mmaWorld.rankings[
                        organization.id
                    ][weight] =
                        top15;
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
            const previousChampionId =
                championship.champion;
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
                        fighter.champion =
                            false;
                        fighter.interimChampion =
                            false;
                    }
                }
            );
            if (champion) {
                champion.champion =
                    true;
                championship.champion =
                    champion.id;
                if (
                    previousChampionId &&
                    previousChampionId ===
                    champion.id
                ) {
                    /*
                     * O campeão permaneceu
                     * no topo.
                     */
                }
            }
        }
    );
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
            (a, b) =>
                calculateWorldRankingScore(b) -
                calculateWorldRankingScore(a)
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
    const championship =
        getWorldChampionship(
            organization,
            weight
        );
    if (
        championship &&
        championship.champion
    ) {
        return (
            mmaWorld.fighters.find(
                fighter =>
                    fighter.id ===
                    championship.champion
            ) || null
        );
    }
    const ranking =
        getWorldRanking(
            organization,
            weight
        );
    return ranking[0] || null;
}
/* =========================================================
   CINTURÃO
========================================================= */
function getWorldChampionship(
    organization,
    weight
) {
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
   SIMULAR LUTA
========================================================= */
function simulateWorldFight(
    fighterA,
    fighterB
) {
    if (
        !fighterA ||
        !fighterB
    ) {
        return null;
    }
    const powerA =
        fighterA.power +
        Math.random() * 20 -
        10;
    const powerB =
        fighterB.power +
        Math.random() * 20 -
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
    winner.weeksSinceFight = 0;
    loser.weeksSinceFight = 0;
    winner.lastFightWeek =
        mmaWorld.week;
    loser.lastFightWeek =
        mmaWorld.week;
    return {
        winner: winner,
        loser: loser
    };
}
/* =========================================================
   LUTADORES DISPONÍVEIS
========================================================= */
function isWorldFighterAvailable(
    fighter
) {
    if (!fighter.active) {
        return false;
    }
    if (
        fighter.injuredWeeks > 0
    ) {
        return false;
    }
    if (
        fighter.weeksUntilNextFight > 0
    ) {
        return false;
    }
    /*
     * Intervalo mínimo entre lutas.
     */
    if (
        fighter.weeksSinceFight < 6
    ) {
        return false;
    }
    return true;
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
                    isWorldFighterAvailable
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
                /*
                 * Nem todo mundo luta
                 * em toda semana.
                 */
                if (
                    Math.random() >
                    0.18
                ) {
                    continue;
                }
                const fighterA =
                    shuffled[i];
                const fighterB =
                    shuffled[i + 1];
                const championship =
                    getWorldChampionship(
                        organization.name,
                        weight
                    );
                const champion =
                    championship &&
                    championship.champion ===
                    fighterA.id;
                const challenger =
                    championship &&
                    championship.champion ===
                    fighterB.id;
                const result =
                    simulateWorldFight(
                        fighterA,
                        fighterB
                    );
                if (!result) {
                    continue;
                }
                let titleFight = false;
                /*
                 * Luta de cinturão só acontece
                 * ocasionalmente.
                 */
                if (
                    championship &&
                    (
                        champion ||
                        challenger
                    ) &&
                    Math.random() < 0.15
                ) {
                    titleFight = true;
                    championship.titleFights++;
                }
                if (titleFight) {
                    if (
                        result.winner.id ===
                        championship.champion
                    ) {
                        championship.defenses++;
                        result.winner.defenses++;
                    }
                    else {
                        const oldChampion =
                            mmaWorld.fighters.find(
                                fighter =>
                                    fighter.id ===
                                    championship.champion
                            );
                        if (oldChampion) {
                            oldChampion.champion =
                                false;
                            oldChampion.titleLosses++;
                        }
                        result.winner.champion =
                            true;
                        result.winner.titleWins++;
                        championship.champion =
                            result.winner.id;
                    }
                }
                mmaWorld.eventsThisWeek.push({
                    organization:
                        organization.name,
                    organizationId:
                        organization.id,
                    weight:
                        weight,
                    winner:
                        result.winner.name,
                    winnerId:
                        result.winner.id,
                    loser:
                        result.loser.name,
                    loserId:
                        result.loser.id,
                    titleFight:
                        titleFight
                });
            }
        }
    );
}
/* =========================================================
   POUND FOR POUND UFC
========================================================= */
function updateUFCPoundForPound() {
    const ufc =
        worldOrganizations.find(
            organization =>
                organization.id ===
                "world_ufc"
        );
    if (!ufc) {
        mmaWorld.ufcP4P = [];
        return;
    }
    const allUFC =
        mmaWorld.fighters
            .filter(
                fighter =>
                    fighter.active &&
                    fighter.organizationId ===
                    ufc.id
            );
    allUFC.sort(
        (a, b) =>
            calculateWorldRankingScore(b) -
            calculateWorldRankingScore(a)
    );
    mmaWorld.ufcP4P =
        allUFC.slice(
            0,
            15
        );
}
/* =========================================================
   OBTER P4P
========================================================= */
function getUFCPoundForPound() {
    return mmaWorld.ufcP4P || [];
}
/* =========================================================
   SIMULAR UMA SEMANA
========================================================= */
function simulateMMWorldWeek() {
    initializeMMWorld();
    mmaWorld.week++;
    mmaWorld.eventsThisWeek = [];
    /*
     * Recupera lutadores.
     */
    mmaWorld.fighters.forEach(
        fighter => {
            fighter.weeksSinceFight++;
            if (
                fighter.injuredWeeks > 0
            ) {
                fighter.injuredWeeks--;
            }
            if (
                fighter.weeksUntilNextFight > 0
            ) {
                fighter.weeksUntilNextFight--;
            }
        }
    );
    /*
     * Cada organização possui
     * atividade independente.
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
    /*
     * Notícias.
     */
    if (
        mmaWorld.eventsThisWeek.length > 0
    ) {
        const news =
            mmaWorld.eventsThisWeek
                .slice(
                    0,
                    8
                )
                .map(
                    fight => {
                        if (
                            fight.titleFight
                        ) {
                            return (
                                "🏆 " +
                                fight.winner +
                                " conquistou/defendeu o cinturão contra " +
                                fight.loser +
                                " (" +
                                fight.organization +
                                ")"
                            );
                        }
                        return (
                            "🥊 " +
                            fight.winner +
                            " venceu " +
                            fight.loser +
                            " (" +
                            fight.organization +
                            ")"
                        );
                    }
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
   NOTÍCIAS
========================================================= */
function getWorldNews() {
    return mmaWorld.news || [];
}
/* =========================================================
   EXPOR FUNÇÕES
========================================================= */
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
window.getWorldRanking =
    getWorldRanking;
window.getWorldChampion =
    getWorldChampion;
window.getWorldChampionship =
    getWorldChampionship;
window.getWorldNews =
    getWorldNews;
window.getUFCPoundForPound =
    getUFCPoundForPound;
/* =========================================================
   DISPONIBILIZAR MUNDO
========================================================= */
window.mmaWorld =
    mmaWorld;
/* =========================================================
   FIM EVENTS.JS
========================================================= */
