/* =========================================================
MMA LIFE DYNASTY
PLAYER.JS
SISTEMA BASE DO LUTADOR
========================================================= */

/* =========================================================
CONFIGURAÇÕES
========================================================= */

const PLAYER_CONFIG = {

startingAge: 15,
startingMoney: 0,
startingHealth: 100,
startingEnergy: 100,
startingMorale: 70,
startingConfidence: 50,
startingFame: 0,
startingFollowers: 0,
startingExperience: 0

};

/* =========================================================
CATEGORIAS
========================================================= */

const WEIGHT_CLASSES = {

Flyweight: {
    name: "Flyweight",
    limitKg: 56.7
},
Bantamweight: {
    name: "Bantamweight",
    limitKg: 61.2
},
Featherweight: {
    name: "Featherweight",
    limitKg: 65.8
},
Lightweight: {
    name: "Lightweight",
    limitKg: 70.3
},
Welterweight: {
    name: "Welterweight",
    limitKg: 77.1
},
Middleweight: {
    name: "Middleweight",
    limitKg: 83.9
},
"Light Heavyweight": {
    name: "Light Heavyweight",
    limitKg: 93.0
},
Heavyweight: {
    name: "Heavyweight",
    limitKg: 120.2
}

};

/* =========================================================
ESTILOS
========================================================= */

const FIGHT_STYLES = {

Striker: {
    name: "Striker"
},
Wrestler: {
    name: "Wrestler"
},
Grappler: {
    name: "Grappler"
},
Balanced: {
    name: "Completo"
}

};

/* =========================================================
ATRIBUTOS BASE
========================================================= */

function createBaseAttributes() {

return {
    striking: {
        boxing: randomAttribute(45, 60),
        kickboxing: randomAttribute(45, 60),
        power: randomAttribute(45, 60),
        speed: randomAttribute(45, 60),
        accuracy: randomAttribute(45, 60)
    },
    wrestling: {
        takedowns: randomAttribute(45, 60),
        takedownDefense: randomAttribute(45, 60),
        control: randomAttribute(45, 60),
        scrambling: randomAttribute(45, 60)
    },
    grappling: {
        submission: randomAttribute(45, 60),
        submissionDefense: randomAttribute(45, 60),
        groundGame: randomAttribute(45, 60),
        transitions: randomAttribute(45, 60)
    },
    physical: {
        strength: randomAttribute(45, 60),
        cardio: randomAttribute(45, 60),
        durability: randomAttribute(45, 60),
        recovery: randomAttribute(45, 60)
    },
    mental: {
        fightIQ: randomAttribute(45, 60),
        composure: randomAttribute(45, 60),
        aggression: randomAttribute(45, 60),
        discipline: randomAttribute(45, 60)
    }
};

}

/* =========================================================
ATRIBUTO ALEATÓRIO
========================================================= */

function randomAttribute(min, max) {

return Math.floor(
    Math.random() * (max - min + 1)
) + min;

}

/* =========================================================
CALCULAR OVR
========================================================= */

function calculateOverall(attributes) {

const values = [];
Object.values(attributes).forEach(category => {
    Object.values(category).forEach(value => {
        values.push(Number(value));
    });
});
if (values.length === 0) {
    return 0;
}
const total = values.reduce(
    (sum, value) => sum + value,
    0
);
return Math.round(total / values.length);

}

/* =========================================================
CALCULAR POTENCIAL
========================================================= */

function calculatePotential(attributes) {

const overall = calculateOverall(attributes);
const potentialBonus = Math.floor(
    Math.random() * 21
);
return Math.min(
    99,
    Math.max(
        overall + 10,
        overall + potentialBonus
    )
);

}

/* =========================================================
CRIAR LUTADOR
========================================================= */

function createPlayer(data = {}) {

const attributes =
    data.attributes ||
    createBaseAttributes();
const overall =
    data.ovr ??
    calculateOverall(attributes);
const potential =
    data.potential ??
    calculatePotential(attributes);
return {
    /* IDENTIDADE */
    id:
        data.id ||
        generatePlayerId(),
    name:
        data.name ||
        "Novo Lutador",
    country:
        data.country ||
        "Brasil",
    city:
        data.city ||
        "São Paulo",
    /* IDADE / TEMPO */
    age:
        data.age ??
        PLAYER_CONFIG.startingAge,
    birthYear:
        data.birthYear ??
        new Date().getFullYear() - PLAYER_CONFIG.startingAge,
    week:
        data.week ??
        1,
    year:
        data.year ??
        1,
    /* CARREIRA */
    careerStage:
        data.careerStage ||
        "Amateur",
    professional:
        data.professional ??
        false,
    weightClass:
        data.weightClass ||
        "Lightweight",
    style:
        data.style ||
        "Balanced",
    /* ATRIBUTOS */
    attributes,
    ovr: overall,
    potential,
    /* STATUS */
    health:
        data.health ??
        PLAYER_CONFIG.startingHealth,
    energy:
        data.energy ??
        PLAYER_CONFIG.startingEnergy,
    morale:
        data.morale ??
        PLAYER_CONFIG.startingMorale,
    confidence:
        data.confidence ??
        PLAYER_CONFIG.startingConfidence,
    fame:
        data.fame ??
        PLAYER_CONFIG.startingFame,
    followers:
        data.followers ??
        PLAYER_CONFIG.startingFollowers,
    experience:
        data.experience ??
        PLAYER_CONFIG.startingExperience,
    /* PESO */
    weight:
        data.weight ??
        getDefaultWeight(data.weightClass || "Lightweight"),
    /* RECORD */
    record: {
        wins:
            data.record?.wins ??
            0,
        losses:
            data.record?.losses ??
            0,
        draws:
            data.record?.draws ??
            0,
        knockouts:
            data.record?.knockouts ??
            0,
        submissions:
            data.record?.submissions ??
            0,
        decisions:
            data.record?.decisions ??
            0
    },
    /* FINANÇAS */
    money:
        data.money ??
        PLAYER_CONFIG.startingMoney,
    careerEarnings:
        data.careerEarnings ??
        0,
    /* HISTÓRICO */
    fights:
        data.fights ||
        [],
    championships:
        data.championships ||
        [],
    contracts:
        data.contracts ||
        [],
    /* TREINAMENTO */
    training: {
        sessions:
            data.training?.sessions ??
            0,
        totalSessions:
            data.training?.totalSessions ??
            0,
        weeksTrained:
            data.training?.weeksTrained ??
            0
    },
    /* RELACIONAMENTOS */
    relationships:
        data.relationships ||
        [],
    /* FAMÍLIA */
    family: {
        partner:
            data.family?.partner ||
            null,
        children:
            data.family?.children ||
            [],
        parents:
            data.family?.parents ||
            []
    },
    /* LEGADO */
    legacy: {
        legacyScore:
            data.legacy?.legacyScore ??
            0,
        goatScore:
            data.legacy?.goatScore ??
            0,
        hallOfFame:
            data.legacy?.hallOfFame ??
            false
    },
    /* METADADOS */
    createdAt:
        data.createdAt ||
        new Date().toISOString(),
    lastUpdated:
        new Date().toISOString()
};

}

/* =========================================================
ID DO LUTADOR
========================================================= */

function generatePlayerId() {

return (
    "fighter_" +
    Date.now() +
    "_" +
    Math.floor(
        Math.random() * 100000
    )
);

}

/* =========================================================
PESO INICIAL
========================================================= */

function getDefaultWeight(weightClass) {

const category =
    WEIGHT_CLASSES[weightClass];
if (!category) {
    return 70;
}
/*
   O peso inicial fica propositalmente
   acima do limite da categoria.
   O sistema de weight cut será criado
   posteriormente.
*/
return Math.round(
    category.limitKg * 1.08 * 10
) / 10;

}

/* =========================================================
RECALCULAR OVR
========================================================= */

function refreshPlayerOverall(player) {

if (!player || !player.attributes) {
    return;
}
player.ovr =
    calculateOverall(
        player.attributes
    );

}

/* =========================================================
AUMENTAR ATRIBUTO
========================================================= */

function increaseAttribute(
player,
category,
attribute,
amount
) {

if (
    !player ||
    !player.attributes ||
    !player.attributes[category] ||
    player.attributes[category][attribute] === undefined
) {
    return false;
}
const current =
    Number(
        player.attributes[category][attribute]
    );
const potentialLimit =
    Number(player.potential || 99);
player.attributes[category][attribute] =
    Math.min(
        potentialLimit,
        current + amount
    );
refreshPlayerOverall(player);
return true;

}

/* =========================================================
GANHAR EXPERIÊNCIA
========================================================= */

function addExperience(player, amount) {

if (!player) {
    return;
}
player.experience =
    Math.max(
        0,
        player.experience + amount
    );

}

/* =========================================================
RECORD
========================================================= */

function getRecordString(player) {

if (!player || !player.record) {
    return "0-0-0";
}
return (
    `${player.record.wins}-` +
    `${player.record.losses}-` +
    `${player.record.draws}`
);

}

/* =========================================================
REGISTRAR VITÓRIA
========================================================= */

function registerWin(
player,
method = “decision”
) {

if (!player || !player.record) {
    return;
}
player.record.wins++;
if (method === "ko" || method === "tko") {
    player.record.knockouts++;
}
if (method === "submission") {
    player.record.submissions++;
}
if (method === "decision") {
    player.record.decisions++;
}

}

/* =========================================================
REGISTRAR DERROTA
========================================================= */

function registerLoss(
player,
method = “decision”
) {

if (!player || !player.record) {
    return;
}
player.record.losses++;

}

/* =========================================================
REGISTRAR EMPATE
========================================================= */

function registerDraw(player) {

if (!player || !player.record) {
    return;
}
player.record.draws++;

}

/* =========================================================
LIMITAR STATUS
========================================================= */

function clampPlayerStats(player) {

if (!player) {
    return;
}
player.health =
    clamp(player.health, 0, 100);
player.energy =
    clamp(player.energy, 0, 100);
player.morale =
    clamp(player.morale, 0, 100);
player.confidence =
    clamp(player.confidence, 0, 100);
player.fame =
    Math.max(0, player.fame);
player.followers =
    Math.max(0, player.followers);

}

/* =========================================================
CLAMP
========================================================= */

function clamp(value, min, max) {

return Math.min(
    max,
    Math.max(
        min,
        Number(value) || 0
    )
);

}
