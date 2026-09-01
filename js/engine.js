/* =========================================================
MMA LIFE DYNASTY
ENGINE.JS
MOTOR PRINCIPAL DO JOGO
========================================================= */

/* =========================================================
CONFIGURAÇÕES DO TEMPO
========================================================= */

const GAME_TIME = {

weeksPerYear: 52,
startingYear: 1,
energyRecoveryPerWeek: 35,
healthRecoveryPerWeek: 8,
moraleRecoveryPerWeek: 3,
confidenceRecoveryPerWeek: 2

};

/* =========================================================
ESTADO DO ENGINE
========================================================= */

const GameEngine = {

initialized: false,
paused: false,
lastTick: null,
initialize() {
    this.initialized = true;
    this.paused = false;
    this.lastTick = new Date().toISOString();
},
/* =====================================================
   AVANÇAR UMA SEMANA
===================================================== */
advanceWeek(player) {
    if (!player) {
        return {
            success: false,
            message: "Nenhum lutador carregado."
        };
    }
    /* ---------------------------------------------
       1. SEMANA
    --------------------------------------------- */
    player.week++;
    /* ---------------------------------------------
       2. NOVO ANO
    --------------------------------------------- */
    let newYear = false;
    if (
        player.week >
        GAME_TIME.weeksPerYear
    ) {
        player.week = 1;
        player.year++;
        player.age++;
        newYear = true;
    }
    /* ---------------------------------------------
       3. RECUPERAÇÃO
    --------------------------------------------- */
    recoverPlayer(player);
    /* ---------------------------------------------
       4. EXPERIÊNCIA DE VIDA
    --------------------------------------------- */
    player.experience += 1;
    /* ---------------------------------------------
       5. TREINAMENTO SEMANAL
    --------------------------------------------- */
    if (player.training) {
        player.training.weeksTrained++;
        player.training.sessions = 0;
    }
    /* ---------------------------------------------
       6. LIMITAR STATUS
    --------------------------------------------- */
    clampPlayerStats(player);
    /* ---------------------------------------------
       7. ATUALIZAR DATA
    --------------------------------------------- */
    player.lastUpdated =
        new Date().toISOString();
    this.lastTick =
        player.lastUpdated;
    return {
        success: true,
        newYear,
        week: player.week,
        year: player.year,
        age: player.age
    };
}

};

/* =========================================================
RECUPERAÇÃO DO LUTADOR
========================================================= */

function recoverPlayer(player) {

if (!player) {
    return;
}
/* ENERGIA */
player.energy =
    Math.min(
        100,
        player.energy +
        GAME_TIME.energyRecoveryPerWeek
    );
/* SAÚDE */
player.health =
    Math.min(
        100,
        player.health +
        GAME_TIME.healthRecoveryPerWeek
    );
/* MORAL */
player.morale =
    Math.min(
        100,
        player.morale +
        GAME_TIME.moraleRecoveryPerWeek
    );
/* CONFIANÇA */
player.confidence =
    Math.min(
        100,
        player.confidence +
        GAME_TIME.confidenceRecoveryPerWeek
    );

}

/* =========================================================
CONSUMIR ENERGIA
========================================================= */

function consumeEnergy(player, amount) {

if (!player) {
    return false;
}
amount =
    Math.max(
        0,
        Number(amount) || 0
    );
if (player.energy < amount) {
    return false;
}
player.energy -= amount;
clampPlayerStats(player);
return true;

}

/* =========================================================
ALTERAR SAÚDE
========================================================= */

function changeHealth(player, amount) {

if (!player) {
    return;
}
player.health +=
    Number(amount) || 0;
clampPlayerStats(player);

}

/* =========================================================
ALTERAR MORAL
========================================================= */

function changeMorale(player, amount) {

if (!player) {
    return;
}
player.morale +=
    Number(amount) || 0;
clampPlayerStats(player);

}

/* =========================================================
ALTERAR CONFIANÇA
========================================================= */

function changeConfidence(player, amount) {

if (!player) {
    return;
}
player.confidence +=
    Number(amount) || 0;
clampPlayerStats(player);

}

/* =========================================================
ALTERAR FAMA
========================================================= */

function changeFame(player, amount) {

if (!player) {
    return;
}
player.fame +=
    Number(amount) || 0;
player.fame =
    Math.max(
        0,
        player.fame
    );

}

/* =========================================================
ADICIONAR SEGUIDORES
========================================================= */

function addFollowers(player, amount) {

if (!player) {
    return;
}
player.followers +=
    Number(amount) || 0;
player.followers =
    Math.max(
        0,
        Math.floor(player.followers)
    );

}

/* =========================================================
ADICIONAR DINHEIRO
========================================================= */

function addMoney(player, amount) {

if (!player) {
    return;
}
player.money +=
    Number(amount) || 0;
player.money =
    Math.max(
        0,
        player.money
    );
player.careerEarnings =
    Math.max(
        0,
        player.careerEarnings
    );

}

/* =========================================================
GASTAR DINHEIRO
========================================================= */

function spendMoney(player, amount) {

if (!player) {
    return false;
}
amount =
    Math.max(
        0,
        Number(amount) || 0
    );
if (player.money < amount) {
    return false;
}
player.money -= amount;
return true;

}

/* =========================================================
RESULTADO DE UMA SEMANA
========================================================= */

function createWeekSummary(
player,
result = {}
) {

if (!player) {
    return null;
}
return {
    week: player.week,
    year: player.year,
    age: player.age,
    events:
        result.events ||
        [],
    training:
        result.training ||
        null,
    fights:
        result.fights ||
        [],
    financial:
        result.financial ||
        null,
    messages:
        result.messages ||
        []
};

}

/* =========================================================
INICIALIZAR ENGINE
========================================================= */

GameEngine.initialize();
