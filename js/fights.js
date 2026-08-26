/* =========================================================
   MMA LIFE DYNASTY
   FIGHTS.JS
   SISTEMA DE LUTAS + CAMP + OFERTA DO EMPRESÁRIO
   VERSÃO CORRIGIDA
========================================================= */

window.mmaFight = null;


/* =========================================================
   UTILIDADES
========================================================= */

function fightPlayer() {

    if (!window.player) {

        if (typeof createDefaultPlayer === "function") {
            window.player = createDefaultPlayer();
        }

    }

    return window.player;
}


function fightSave() {

    if (typeof window.saveGame === "function") {
        window.saveGame();
    }

}


function fightContent() {

    return document.getElementById("content");

}


function fightRandom(min, max) {

    return Math.random() * (max - min) + min;

}


function fightClamp(value, min, max) {

    return Math.max(
        min,
        Math.min(max, value)
    );

}


/* =========================================================
   GARANTIR ESTRUTURA DE LUTAS
========================================================= */

function ensureFightData() {

    const p = fightPlayer();

    if (!p) return;


    if (!p.fightSystem) {

        p.fightSystem = {

            campActive: false,

            campStartedWeek: null,

            campWeeks: 0,

            campTotalWeeks: 0,

            offerPending: false,

            lastOfferWeek: null,

            fightsCompleted: 0,

            lastFightWeek: null

        };

    }


    if (!Array.isArray(p.fightHistory)) {
        p.fightHistory = [];
    }


    if (!Array.isArray(p.fightOffers)) {
        p.fightOffers = [];
    }


    if (!Array.isArray(p.fightNews)) {
        p.fightNews = [];
    }

}


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const FIGHT_CONFIG = {

    minimumCampWeeks: 4,

    maximumCampWeeks: 8,

    amateurCampWeeks: 4,

    professionalCampWeeks: 6,

    minimumWeeksBetweenFights: 4,

    managerOfferChance: 0.65

};


/* =========================================================
   VERIFICAR SE ESTÁ EM CAMP
========================================================= */

function isFightCampActive() {

    ensureFightData();

    const p = fightPlayer();

    return !!(
        p &&
        p.fightSystem &&
        p.fightSystem.campActive
    );

}


window.isFightCampActive =
    isFightCampActive;


/* =========================================================
   VERIFICAR SE TEM OFERTA
========================================================= */

function hasFightOffer() {

    const p = fightPlayer();

    if (!p) return false;

    return (
        Array.isArray(p.fightOffers) &&
        p.fightOffers.length > 0
    );

}


/* =========================================================
   GERAR ADVERSÁRIO
========================================================= */

function generateFightOpponent() {

    const p = fightPlayer();

    const playerOVR =
        typeof window.getOverall === "function"
            ? Number(window.getOverall())
            : Number(p.overall || 45);


    const opponentOVR =
        Math.round(
            fightClamp(
                playerOVR +
                fightRandom(-7, 8),
                35,
                95
            )
        );


    const names = [

        "Carlos Almeida",
        "Lucas Ferreira",
        "Rafael Costa",
        "Diego Santos",
        "Bruno Oliveira",
        "Matheus Silva",
        "André Souza",
        "Gabriel Rocha",
        "Victor Lima",
        "João Mendes",
        "Pedro Ribeiro",
        "Felipe Martins",
        "Marcos Vieira",
        "Thiago Barbosa",
        "Eduardo Castro"

    ];


    const styles = [

        "Striker",
        "Wrestler",
        "Grappler",
        "Completo"

    ];


    const name =
        names[
            Math.floor(
                Math.random() * names.length
            )
        ];


    return {

        name: name,

        displayName: name,

        power: opponentOVR,

        overall: opponentOVR,

        style:
            styles[
                Math.floor(
                    Math.random() * styles.length
                )
            ],

        record: {

            wins:
                Math.floor(
                    Math.random() * 12
                ),

            losses:
                Math.floor(
                    Math.random() * 6
                ),

            draws: 0

        }

    };

}


/* =========================================================
   GERAR EVENTO
========================================================= */

function generateFightEvent() {

    const events = [

        "MMA Fight Night",

        "Warriors FC",

        "Brazil Combat",

        "Cage Warriors",

        "Titan MMA",

        "Global Fight League",

        "Ultimate Combat",

        "National MMA"

    ];


    return {

        name:
            events[
                Math.floor(
                    Math.random() * events.length
                )
            ]

    };

}


/* =========================================================
   EMPRESÁRIO PROCURA LUTA
   IMPORTANTE:
   NÃO CRIA LUTA.
   CRIA APENAS OFERTA.
========================================================= */

function processManagerFightOffer() {

    ensureFightData();

    const p = fightPlayer();

    if (!p) return;


    /* -----------------------------------------
       NÃO OFERECER SE JÁ EXISTE LUTA
    ----------------------------------------- */

    if (p.nextFight) {
        return;
    }


    /* -----------------------------------------
       NÃO OFERECER SE JÁ EXISTE OFERTA
    ----------------------------------------- */

    if (hasFightOffer()) {
        return;
    }


    /* -----------------------------------------
       PRIMEIRA LUTA AMADORA
    ----------------------------------------- */

    const amateur =
        p.amateur || {

            wins: 0,
            losses: 0,
            draws: 0

        };


    const totalAmateurFights =
        Number(amateur.wins || 0) +
        Number(amateur.losses || 0) +
        Number(amateur.draws || 0);


    /* -----------------------------------------
       TEMPO PARA PRIMEIRA OFERTA
    ----------------------------------------- */

    if (
        totalAmateurFights === 0 &&
        Number(p.week || 1) < 4
    ) {

        return;

    }


    /* -----------------------------------------
       EVITAR OFERTA TODA SEMANA
    ----------------------------------------- */

    const lastOffer =
        p.fightSystem.lastOfferWeek;


    if (
        typeof lastOffer === "number" &&
        Number(p.week) - lastOffer < 4
    ) {

        return;

    }


    /* -----------------------------------------
       CHANCE DO EMPRESÁRIO
    ----------------------------------------- */

    if (
        Math.random() >
        FIGHT_CONFIG.managerOfferChance
    ) {

        return;

    }


    const opponent =
        generateFightOpponent();


    const event =
        generateFightEvent();


    const professional =
        p.professional &&
        p.professional.active;


    const campWeeks =
        professional
            ? FIGHT_CONFIG.professionalCampWeeks
            : FIGHT_CONFIG.amateurCampWeeks;


    const purse =
        professional
            ? Math.round(
                700 +
                opponent.power * 45
            )
            : Math.round(
                100 +
                opponent.power * 5
            );


    const winBonus =
        professional
            ? Math.round(
                purse * 0.5
            )
            : Math.round(
                purse * 0.25
            );


    const offer = {

        id:
            "fight_" +
            Date.now() +
            "_" +
            Math.floor(
                Math.random() * 99999
            ),

        eventName:
            event.name,

        event:
            event,

        opponent:
            opponent,

        opponentName:
            opponent.displayName,

        purse:
            purse,

        winBonus:
            winBonus,

        campWeeks:
            campWeeks,

        offeredWeek:
            Number(p.week || 1),

        professional:
            professional

    };


    p.fightOffers.push(
        offer
    );


    p.fightSystem.offerPending =
        true;


    p.fightSystem.lastOfferWeek =
        Number(p.week || 1);


    p.log =
        p.log || [];


    p.log.unshift(
        `📩 Seu empresário encontrou uma luta contra ${opponent.displayName}.`
    );


    fightSave();


    if (
        typeof window.home === "function"
    ) {

        window.home();

    }

}


/* =========================================================
   ACEITAR OFERTA
========================================================= */

function acceptManagerFightOffer() {

    ensureFightData();

    const p = fightPlayer();

    if (!p) return;


    if (!hasFightOffer()) {

        alert(
            "Você não possui uma oferta de luta."
        );

        return;

    }


    if (p.nextFight) {

        alert(
            "Você já possui uma luta marcada."
        );

        return;

    }


    const offer =
        p.fightOffers[0];


    const campWeeks =
        Number(
            offer.campWeeks ||
            FIGHT_CONFIG.minimumCampWeeks
        );


    /* -----------------------------------------
       CAMP COMEÇA AGORA
    ----------------------------------------- */

    p.fightSystem.campActive =
        true;


    p.fightSystem.campStartedWeek =
        Number(p.week || 1);


    p.fightSystem.campWeeks =
        0;


    p.fightSystem.campTotalWeeks =
        campWeeks;


    /* -----------------------------------------
       LUTA SERÁ MARCADA DEPOIS DO CAMP
    ----------------------------------------- */

    p.nextFight = {

        status: "camp",

        event:
            offer.event,

        opponent:
            offer.opponent,

        opponentName:
            offer.opponentName,

        purse:
            offer.purse,

        winBonus:
            offer.winBonus,

        campWeeks:
            campWeeks,

        campCompletedWeeks:
            0,

        fightWeek:
            null,

        weeksRemaining:
            campWeeks,

        acceptedWeek:
            Number(p.week || 1),

        professional:
            offer.professional

    };


    /* -----------------------------------------
       REMOVER OFERTA
    ----------------------------------------- */

    p.fightOffers.shift();


    p.fightSystem.offerPending =
        false;


    p.log =
        p.log || [];


    p.log.unshift(
        `🥊 Luta aceita contra ${offer.opponentName}. Camp de ${campWeeks} semanas iniciado.`
    );


    fightSave();


    alert(
        `🥊 LUTA ACEITA!\n\n` +
        `Adversário: ${offer.opponentName}\n` +
        `Evento: ${offer.eventName}\n\n` +
        `Seu camp começa agora.\n` +
        `Serão ${campWeeks} semanas de preparação.`
    );


    if (
        typeof window.home === "function"
    ) {

        window.home();

    }

}


window.acceptManagerFightOffer =
    acceptManagerFightOffer;


/* =========================================================
   RECUSAR OFERTA
========================================================= */

function declineManagerFightOffer() {

    ensureFightData();

    const p = fightPlayer();

    if (!p) return;


    if (!hasFightOffer()) {
        return;
    }


    const offer =
        p.fightOffers.shift();


    p.fightSystem.offerPending =
        false;


    p.log =
        p.log || [];


    p.log.unshift(
        `❌ Você recusou a luta contra ${offer.opponentName}.`
    );


    fightSave();


    if (
        typeof window.home === "function"
    ) {

        window.home();

    }

}


window.declineManagerFightOffer =
    declineManagerFightOffer;


/* =========================================================
   PROCESSAR CAMP
   É CHAMADO QUANDO AVANÇA A SEMANA
========================================================= */

function processFightCampWeek() {

    ensureFightData();

    const p = fightPlayer();

    if (!p || !p.nextFight) {
        return;
    }


    const fight =
        p.nextFight;


    if (
        fight.status !== "camp"
    ) {

        return;

    }


    /* -----------------------------------------
       UMA SEMANA DE CAMP COMPLETA
    ----------------------------------------- */

    fight.campCompletedWeeks =
        Number(
            fight.campCompletedWeeks || 0
        ) + 1;


    p.fightSystem.campWeeks =
        fight.campCompletedWeeks;


    /* -----------------------------------------
       TREINAMENTO ESPECIAL DE CAMP
    ----------------------------------------- */

    const attributes =
        p.attributes || {};


    const gains = {

        strength: 0.15,

        striking: 0.18,

        wrestling: 0.18,

        grappling: 0.18,

        cardio: 0.22,

        technique: 0.15,

        defense: 0.15,

        fightIQ: 0.12,

        chin: 0.05,

        offense: 0.15,

        blocking: 0.15

    };


    Object.keys(gains).forEach(
        function(attribute) {

            if (
                typeof attributes[attribute] !==
                "number"
            ) {

                return;

            }


            const potential =
                Number(
                    p.potential || 90
                );


            attributes[attribute] =
                Math.min(
                    potential,
                    Number(
                        (
                            attributes[attribute] +
                            gains[attribute]
                        ).toFixed(2)
                    )
                );

        }
    );


    /* -----------------------------------------
       FATIGA DO CAMP
    ----------------------------------------- */

    p.fatigue =
        Math.min(
            100,
            Number(p.fatigue || 0) + 5
        );


    /* -----------------------------------------
       SAÚDE
    ----------------------------------------- */

    p.health =
        Math.max(
            70,
            Number(p.health || 100) - 1
        );


    /* -----------------------------------------
       CAMP TERMINOU?
    ----------------------------------------- */

    if (
        fight.campCompletedWeeks >=
        fight.campWeeks
    ) {

        finishFightCamp();

    }


    fightSave();

}


/* =========================================================
   FINALIZAR CAMP
========================================================= */

function finishFightCamp() {

    const p = fightPlayer();

    if (!p || !p.nextFight) {
        return;
    }


    const fight =
        p.nextFight;


    fight.status =
        "scheduled";


    /* -----------------------------------------
       LUTA É NA SEMANA SEGUINTE AO CAMP
    ----------------------------------------- */

    fight.fightWeek =
        Number(p.week || 1) + 1;


    fight.weeksRemaining =
        1;


    p.fightSystem.campActive =
        false;


    p.log =
        p.log || [];


    p.log.unshift(
        `🔥 Camp encerrado. A luta contra ${fight.opponentName} será na próxima semana.`
    );


    fightSave();

}


/* =========================================================
   VERIFICAR DIA DA LUTA
========================================================= */

function isFightDay() {

    const p = fightPlayer();

    if (!p || !p.nextFight) {
        return false;
    }


    const fight =
        p.nextFight;


    if (
        fight.status === "fight_day"
    ) {

        return true;

    }


    if (
        fight.status === "scheduled" &&
        typeof fight.fightWeek === "number" &&
        Number(p.week) >=
        Number(fight.fightWeek)
    ) {

        return true;

    }


    return false;

}


window.isFightDay =
    isFightDay;


/* =========================================================
   ATUALIZAR CONTAGEM DA LUTA
========================================================= */

function processFightWeek() {

    const p = fightPlayer();

    if (!p || !p.nextFight) {
        return;
    }


    const fight =
        p.nextFight;


    if (
        fight.status === "camp"
    ) {

        processFightCampWeek();

        return;

    }


    if (
        fight.status !== "scheduled"
    ) {

        return;

    }


    const remaining =
        Number(
            fight.fightWeek || 0
        ) -
        Number(
            p.week || 0
        );


    fight.weeksRemaining =
        Math.max(
            0,
            remaining
        );


    if (
        remaining <= 0
    ) {

        fight.status =
            "fight_day";


        fight.weeksRemaining =
            0;


        p.log =
            p.log || [];


        p.log.unshift(
            `🚨 DIA DA LUTA! ${fight.opponentName} espera por você.`
        );

    }


    fightSave();

}


/* =========================================================
   TELA DA LUTA
========================================================= */

function fightScreen() {

    const p = fightPlayer();

    if (!p) return;


    ensureFightData();


    const content =
        fightContent();


    if (!content) return;


    /* -----------------------------------------
       SEM LUTA
    ----------------------------------------- */

    if (!p.nextFight) {

        content.innerHTML = `

            <div class="card">

                <div class="title">
                    ⚔️ LUTAS
                </div>

                <p>
                    Você não possui uma luta marcada.
                </p>

                <p>
                    Seu empresário precisa encontrar
                    uma oportunidade para você.
                </p>

                <button
                    class="main-button"
                    onclick="home()">

                    🏠 VOLTAR

                </button>

            </div>

        `;

        return;

    }


    const fight =
        p.nextFight;


    /* -----------------------------------------
       CAMP
    ----------------------------------------- */

    if (
        fight.status === "camp"
    ) {

        content.innerHTML = `

            <div class="card">

                <div class="title">
                    🥊 CAMP DE PREPARAÇÃO
                </div>

                <p>
                    Você aceitou a luta contra
                    <strong>
                        ${fight.opponentName}
                    </strong>.
                </p>

                <div class="statline">
                    <span>
                        Evento
                    </span>

                    <b>
                        ${
                            fight.event
                            ?
                            fight.event.name
                            :
                            "Evento MMA"
                        }
                    </b>
                </div>

                <div class="statline">
                    <span>
                        Camp
                    </span>

                    <b>
                        ${
                            fight.campCompletedWeeks || 0
                        }
                        /
                        ${
                            fight.campWeeks || 0
                        }
                        semanas
                    </b>
                </div>

                <div class="statline">
                    <span>
                        Adversário
                    </span>

                    <b>
                        ${fight.opponentName}
                    </b>
                </div>

                <div class="statline">
                    <span>
                        OVR adversário
                    </span>

                    <b>
                        ${
                            fight.opponent
                            ?
                            fight.opponent.power
                            :
                            0
                        }
                    </b>
                </div>

            </div>


            <div class="card">

                <div class="title">
                    🏋️ PREPARAÇÃO
                </div>

                <p>
                    Continue avançando as semanas.
                    Cada semana representa uma etapa
                    do camp.
                </p>

                <p>
                    O treino especial do camp melhora
                    seus atributos de combate.
                </p>

            </div>


            <div class="card">

                <button
                    class="main-button"
                    onclick="home()">

                    🏠 VOLTAR

                </button>

            </div>

        `;

        return;

    }


    /* -----------------------------------------
       DIA DA LUTA
    ----------------------------------------- */

    if (
        isFightDay()
    ) {

        content.innerHTML = `

            <div class="card fight-day-alert">

                <div class="title">
                    🚨 DIA DA LUTA
                </div>

                <h2>
                    ${fight.opponentName}
                </h2>

                <p>
                    ${fight.event ? fight.event.name : "Evento MMA"}
                </p>

                <div class="statline">
                    <span>
                        Seu OVR
                    </span>

                    <b>
                        ${
                            typeof window.getOverall ===
                            "function"
                            ?
                            window.getOverall()
                            :
                            p.overall || 0
                        }
                    </b>
                </div>

                <div class="statline">
                    <span>
                        OVR adversário
                    </span>

                    <b>
                        ${
                            fight.opponent
                            ?
                            fight.opponent.power
                            :
                            0
                        }
                    </b>
                </div>

                <div class="statline">
                    <span>
                        Bolsa
                    </span>

                    <b>
                        $${Math.round(
                            fight.purse || 0
                        )}
                    </b>
                </div>

                <div class="statline">
                    <span>
                        Bônus
                    </span>

                    <b>
                        $${Math.round(
                            fight.winBonus || 0
                        )}
                    </b>
                </div>

                <button
                    class="main-button"
                    onclick="startFight()">

                    👊 LUTAR AGORA

                </button>

            </div>

        `;

        return;

    }


    /* -----------------------------------------
       LUTA AGENDADA
    ----------------------------------------- */

    content.innerHTML = `

        <div class="card">

            <div class="title">
                ⚔️ PRÓXIMO COMBATE
            </div>

            <h2>
                ${fight.opponentName}
            </h2>

            <p>
                ${
                    fight.event
                    ?
                    fight.event.name
                    :
                    "Evento MMA"
                }
            </p>

            <div class="statline">
                <span>
                    Camp
                </span>

                <b>
                    CONCLUÍDO
                </b>
            </div>

            <div class="statline">
                <span>
                    Luta
                </span>

                <b>
                    Semana ${fight.fightWeek}
                </b>
            </div>

            <div class="statline">
                <span>
                    Tempo
                </span>

                <b>
                    ${
                        fight.weeksRemaining <= 0
                        ?
                        "HOJE"
                        :
                        fight.weeksRemaining +
                        " semana(s)"
                    }
                </b>
            </div>

        </div>

    `;

}


/* =========================================================
   INICIAR LUTA
========================================================= */

function startFight() {

    const p = fightPlayer();

    if (!p || !p.nextFight) {
        return;
    }


    if (!isFightDay()) {

        alert(
            "A luta ainda não chegou ao dia marcado."
        );

        return;

    }


    window.mmaFight = {

        player: p,

        opponent:
            p.nextFight.opponent,

        round: 1,

        maxRounds:
            p.nextFight.titleFight
                ? 5
                : 3,

        playerHealth: 100,

        opponentHealth: 100,

        playerStamina: 100,

        opponentStamina: 100,

        playerScore: 0,

        opponentScore: 0,

        finished: false,

        log: []

    };


    renderFightEngine();

}


/* =========================================================
   ENGINE SIMPLES E ESTÁVEL
========================================================= */

function renderFightEngine() {

    const content =
        fightContent();


    const state =
        window.mmaFight;


    if (!content || !state) {
        return;
    }


    if (
        state.finished
    ) {

        renderFightResult();

        return;

    }


    content.innerHTML = `

        <div class="card">

            <div class="title">
                🥊 COMBATE — ROUND ${state.round}
            </div>

            <div class="statline">
                <span>
                    ${state.player.name}
                </span>

                <b>
                    ${Math.round(state.playerHealth)}%
                </b>
            </div>

            <div class="statline">
                <span>
                    ${state.opponent.displayName}
                </span>

                <b>
                    ${Math.round(state.opponentHealth)}%
                </b>
            </div>

            <div class="statline">
                <span>
                    Sua stamina
                </span>

                <b>
                    ${Math.round(state.playerStamina)}%
                </b>
            </div>

        </div>


        <div class="card">

            <div class="title">
                🎯 ESCOLHA SUA AÇÃO
            </div>

            <button
                class="main-button"
                onclick="fightAction('strike')">

                👊 TROCAÇÃO

            </button>

            <button
                class="main-button"
                onclick="fightAction('wrestling')">

                🤼 QUEDA

            </button>

            <button
                class="main-button"
                onclick="fightAction('grapple')">

                🥋 GRAPPLING

            </button>

            <button
                class="main-button"
                onclick="fightAction('defend')">

                🛡️ DEFENDER

            </button>

        </div>


        <div class="card">

            <div class="title">
                📋 COMENTÁRIOS
            </div>

            ${
                state.log
                .slice(-6)
                .reverse()
                .map(
                    function(line) {

                        return `
                            <p>
                                ${line}
                            </p>
                        `;

                    }
                )
                .join("")
            }

        </div>

    `;

}


/* =========================================================
   AÇÃO DE LUTA
========================================================= */

function fightAction(action) {

    const state =
        window.mmaFight;


    if (!state || state.finished) {
        return;
    }


    const p =
        state.player;


    const a =
        p.attributes || {};


    const opponent =
        state.opponent;


    const opponentPower =
        Number(
            opponent.power || 45
        );


    let playerPower =
        Number(
            typeof window.getOverall ===
            "function"
                ?
                window.getOverall()
                :
                p.overall || 45
        );


    if (
        action === "strike"
    ) {

        playerPower +=
            Number(a.striking || 45) * 0.2;

    }


    if (
        action === "wrestling"
    ) {

        playerPower +=
            Number(a.wrestling || 45) * 0.2;

    }


    if (
        action === "grapple"
    ) {

        playerPower +=
            Number(a.grappling || 45) * 0.2;

    }


    if (
        action === "defend"
    ) {

        playerPower +=
            Number(a.defense || 45) * 0.35;

    }


    const roll =
        fightRandom(
            -15,
            15
        );


    const advantage =
        playerPower -
        opponentPower +
        roll;


    let playerDamage = 0;

    let opponentDamage = 0;


    if (
        action === "defend"
    ) {

        opponentDamage =
            Math.max(
                0,
                3 +
                advantage * 0.08
            );

    }

    else {

        playerDamage =
            Math.max(
                2,
                7 +
                advantage * 0.15
            );


        opponentDamage =
            Math.max(
                2,
                7 +
                advantage * 0.18
            );

    }


    state.opponentHealth =
        fightClamp(
            state.opponentHealth -
            playerDamage,
            0,
            100
        );


    state.playerHealth =
        fightClamp(
            state.playerHealth -
            playerDamage * 0.65 +
            opponentDamage * 0.1,
            0,
            100
        );


    state.playerStamina =
        fightClamp(
            state.playerStamina -
            (
                action === "defend"
                    ? 3
                    : 7
            ),
            0,
            100
        );


    const actionNames = {

        strike: "trocação",

        wrestling: "wrestling",

        grapple: "grappling",

        defend: "defesa"

    };


    state.log.push(
        `🥊 Você utilizou ${actionNames[action]}.`
    );


    if (
        playerDamage > 15
    ) {

        state.log.push(
            "💥 Você conectou um golpe forte!"
        );

    }


    if (
        state.opponentHealth <= 0
    ) {

        state.finished = true;

        state.result =
            "win";

        renderFightResult();

        return;

    }


    if (
        state.playerHealth <= 0
    ) {

        state.finished = true;

        state.result =
            "loss";

        renderFightResult();

        return;

    }


    /* -----------------------------------------
       TERMINAR ROUND
    ----------------------------------------- */

    if (
        state.playerStamina <= 10 ||
        state.opponentStamina <= 10
    ) {

        finishRound();

        return;

    }


    renderFightEngine();

}


/* =========================================================
   TERMINAR ROUND
========================================================= */

function finishRound() {

    const state =
        window.mmaFight;


    if (!state) return;


    if (
        state.round >=
        state.maxRounds
    ) {

        state.finished =
            true;


        if (
            state.playerHealth >
            state.opponentHealth
        ) {

            state.result =
                "win";

        }

        else if (
            state.playerHealth <
            state.opponentHealth
        ) {

            state.result =
                "loss";

        }

        else {

            state.result =
                "draw";

        }


        renderFightResult();

        return;

    }


    state.round += 1;


    state.playerStamina =
        Math.min(
            100,
            state.playerStamina + 15
        );


    state.opponentStamina =
        Math.min(
            100,
            state.opponentStamina + 15
        );


    state.log.push(
        `🔔 Fim do round. Começando o round ${state.round}.`
    );


    renderFightEngine();

}


/* =========================================================
   RESULTADO
========================================================= */

function renderFightResult() {

    const content =
        fightContent();


    const state =
        window.mmaFight;


    if (!content || !state) {
        return;
    }


    let title =
        "⚖️ EMPATE";


    if (
        state.result === "win"
    ) {

        title =
            "🏆 VITÓRIA!";

    }


    if (
        state.result === "loss"
    ) {

        title =
            "❌ DERROTA";

    }


    content.innerHTML = `

        <div class="card">

            <div class="title">
                ${title}
            </div>

            <h2>
                ${state.player.name}
                vs
                ${state.opponent.displayName}
            </h2>

            <div class="statline">
                <span>
                    Sua saúde
                </span>

                <b>
                    ${Math.round(state.playerHealth)}%
                </b>
            </div>

            <div class="statline">
                <span>
                    Saúde adversário
                </span>

                <b>
                    ${Math.round(state.opponentHealth)}%
                </b>
            </div>

            <button
                class="main-button"
                onclick="completeFightResult()">

                ✅ FINALIZAR COMBATE

            </button>

        </div>

    `;

}


/* =========================================================
   FINALIZAR RESULTADO
========================================================= */

function completeFightResult() {

    const p =
        fightPlayer();


    if (!p || !p.nextFight) {
        return;
    }


    const fight =
        p.nextFight;


    const result =
        window.mmaFight.result;


    if (!p.amateur) {

        p.amateur = {

            wins: 0,

            losses: 0,

            draws: 0

        };

    }


    if (!p.professional) {

        p.professional = {

            active: false,

            wins: 0,

            losses: 0,

            draws: 0

        };

    }


    const professional =
        !!fight.professional;


    const record =
        professional
            ? p.professional
            : p.amateur;


    if (
        result === "win"
    ) {

        record.wins =
            Number(record.wins || 0) + 1;


        p.fame =
            Number(p.fame || 0) +
            (
                professional
                    ? 5
                    : 1
            );


        p.money =
            Number(p.money || 0) +
            Number(fight.purse || 0) +
            Number(fight.winBonus || 0);


        p.log =
            p.log || [];


        p.log.unshift(
            `🏆 Vitória sobre ${fight.opponentName}.`
        );

    }

    else if (
        result === "loss"
    ) {

        record.losses =
            Number(record.losses || 0) + 1;


        p.log =
            p.log || [];


        p.log.unshift(
            `❌ Derrota contra ${fight.opponentName}.`
        );

    }

    else {

        record.draws =
            Number(record.draws || 0) + 1;


        p.log =
            p.log || [];


        p.log.unshift(
            `⚖️ Empate contra ${fight.opponentName}.`
        );

    }


    /* -----------------------------------------
       HISTÓRICO
    ----------------------------------------- */

    p.fightHistory.push({

        year:
            Number(p.year || 2026),

        week:
            Number(p.week || 1),

        opponent:
            fight.opponentName,

        result:
            result,

        event:
            fight.event
                ?
                fight.event.name
                :
                "Evento MMA",

        purse:
            Number(fight.purse || 0),

        professional:
            professional

    });


    /* -----------------------------------------
       CONTROLE
    ----------------------------------------- */

    p.fightSystem.fightsCompleted =
        Number(
            p.fightSystem.fightsCompleted || 0
        ) + 1;


    p.fightSystem.lastFightWeek =
        Number(p.week || 1);


    /* -----------------------------------------
       RECUPERAÇÃO
    ----------------------------------------- */

    p.fatigue =
        Math.min(
            100,
            Number(p.fatigue || 0) + 20
        );


    p.health =
        Math.max(
            40,
            Number(p.health || 100) - 10
        );


    /* -----------------------------------------
       LIMPAR LUTA
    ----------------------------------------- */

    p.nextFight =
        null;


    p.fightSystem.campActive =
        false;


    window.mmaFight =
        null;


    fightSave();


    alert(
        result === "win"
            ? "🏆 Vitória registrada!"
            : result === "loss"
                ? "❌ Derrota registrada."
                : "⚖️ Empate registrado."
    );


    if (
        typeof window.home ===
        "function"
    ) {

        window.home();

    }

}


/* =========================================================
   RECUPERAÇÃO
========================================================= */

function processFightRecovery() {

    const p =
        fightPlayer();


    if (!p) return;


    if (
        !p.nextFight
    ) {

        p.health =
            Math.min(
                100,
                Number(p.health || 100) + 5
            );


        p.fatigue =
            Math.max(
                0,
                Number(p.fatigue || 0) - 10
            );

    }

}


window.processFightRecovery =
    processFightRecovery;


/* =========================================================
   EXPOR FUNÇÕES
========================================================= */

window.processManagerFightOffer =
    processManagerFightOffer;


window.processFightCampWeek =
    processFightCampWeek;


window.processFightWeek =
    processFightWeek;


window.fightScreen =
    fightScreen;


window.startFight =
    startFight;


window.fightAction =
    fightAction;


window.completeFightResult =
    completeFightResult;


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

ensureFightData();
