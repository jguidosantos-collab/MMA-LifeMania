/* =========================================================
   MMA LIFE DYNASTY
   FIGHTS.JS
   FIGHT ENGINE — VERSÃO GIGANTE
   =========================================================

   SISTEMA:
   - Tela completa de combate
   - Pré-luta
   - Aquecimento
   - Estratégia
   - Round a round
   - Stamina
   - Saúde
   - Dano
   - Golpes
   - Quedas
   - Controle no chão
   - Finalizações
   - TKO
   - KO
   - Decisão
   - Empate
   - Lesões
   - Cartões dos juízes
   - Momentum
   - Confiança
   - Fight IQ
   - Cardio
   - Queixo
   - Defesa
   - Striking
   - Wrestling
   - Grappling
   - Técnica
   - Ofensiva
   - Bloqueio
   - Estilo
   - Fama
   - Bolsa
   - Bônus
   - Histórico
   - Ranking
   - Recuperação
   - Integração com empresário
   - Integração com campeonato
   - Compatibilidade com main.js
========================================================= */


/* =========================================================
   ESTADO GLOBAL DA LUTA
========================================================= */

window.mmaFight = null;


/* =========================================================
   UTILIDADES
========================================================= */

function fightPlayer() {

    if (
        typeof window.player === "undefined" ||
        !window.player
    ) {

        if (
            typeof window.createDefaultPlayer ===
            "function"
        ) {

            window.player =
                window.createDefaultPlayer();

        }

    }

    return window.player;
}


function fightSave() {

    if (
        typeof window.saveGame ===
        "function"
    ) {

        window.saveGame();

    }

}


function fightContent() {

    return document.getElementById(
        "content"
    );

}


function fightClamp(
    value,
    min,
    max
) {

    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );

}


function fightRandom(
    min,
    max
) {

    return (
        Math.random() *
        (
            max - min
        )
    ) + min;

}


function fightRandomInt(
    min,
    max
) {

    return Math.floor(
        fightRandom(
            min,
            max + 1
        )
    );

}


function fightChance(
    probability
) {

    return Math.random() <
        probability;

}


function fightRound(
    value
) {

    return Math.round(
        Number(value || 0)
    );

}


/* =========================================================
   GARANTIR ESTRUTURA
========================================================= */

function ensureFightStructures() {

    const p =
        fightPlayer();

    if (!p) {
        return null;
    }


    if (!p.attributes) {

        p.attributes = {};

    }


    const defaults = {

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

    };


    Object.keys(defaults)
        .forEach(
            function(key) {

                if (
                    typeof p.attributes[key] !==
                    "number"
                ) {

                    p.attributes[key] =
                        defaults[key];

                }

            }
        );


    if (!p.amateur) {

        p.amateur = {

            wins: 0,
            losses: 0,
            draws: 0,
            ranking: 50

        };

    }


    if (!p.professional) {

        p.professional = {

            active: false,
            wins: 0,
            losses: 0,
            draws: 0,
            ranking: null

        };

    }


    if (!Array.isArray(
        p.fightHistory
    )) {

        p.fightHistory = [];

    }


    if (!Array.isArray(
        p.log
    )) {

        p.log = [];

    }


    if (
        typeof p.health !==
        "number"
    ) {

        p.health = 100;

    }


    if (
        typeof p.fatigue !==
        "number"
    ) {

        p.fatigue = 0;

    }


    if (
        typeof p.fame !==
        "number"
    ) {

        p.fame = 0;

    }


    if (
        typeof p.money !==
        "number"
    ) {

        p.money = 0;

    }


    if (
        typeof p.overall !==
        "number"
    ) {

        p.overall = 45;

    }


    return p;

}


/* =========================================================
   OBTER OVR
========================================================= */

function fightGetOVR(
    fighter
) {

    if (!fighter) {
        return 40;
    }


    if (
        typeof fighter.power ===
        "number"
    ) {

        return fightClamp(
            fighter.power,
            1,
            99
        );

    }


    if (
        typeof fighter.ovr ===
        "number"
    ) {

        return fightClamp(
            fighter.ovr,
            1,
            99
        );

    }


    const a =
        fighter.attributes ||
        fighter;


    const values = [

        Number(a.strength || 40),
        Number(a.striking || 40),
        Number(a.wrestling || 40),
        Number(a.grappling || 40),
        Number(a.cardio || 40),
        Number(a.technique || 40),
        Number(a.defense || 40),
        Number(a.fightIQ || 40),
        Number(a.chin || 40),
        Number(a.offense || 40),
        Number(a.blocking || 40)

    ];


    const average =
        values.reduce(
            function(total, value) {

                return total + value;

            },
            0
        ) /
        values.length;


    return fightClamp(
        Math.round(average),
        1,
        99
    );

}


/* =========================================================
   NORMALIZAR ADVERSÁRIO
========================================================= */

function normalizeOpponent(
    opponent
) {

    if (!opponent) {

        return {

            name:
                "Adversário Desconhecido",

            displayName:
                "Adversário Desconhecido",

            power: 50,

            ovr: 50,

            style: "Completo",

            country: "Brasil",

            wins: 0,
            losses: 0,
            draws: 0,

            attributes: {

                strength: 50,
                striking: 50,
                wrestling: 50,
                grappling: 50,
                cardio: 50,
                technique: 50,
                defense: 50,
                fightIQ: 50,
                chin: 50,
                offense: 50,
                blocking: 50

            }

        };

    }


    if (!opponent.attributes) {

        const ovr =
            fightGetOVR(
                opponent
            );


        opponent.attributes = {

            strength:
                fightClamp(
                    ovr +
                    fightRandomInt(-8, 8),
                    20,
                    95
                ),

            striking:
                fightClamp(
                    ovr +
                    fightRandomInt(-8, 8),
                    20,
                    95
                ),

            wrestling:
                fightClamp(
                    ovr +
                    fightRandomInt(-8, 8),
                    20,
                    95
                ),

            grappling:
                fightClamp(
                    ovr +
                    fightRandomInt(-8, 8),
                    20,
                    95
                ),

            cardio:
                fightClamp(
                    ovr +
                    fightRandomInt(-8, 8),
                    20,
                    95
                ),

            technique:
                fightClamp(
                    ovr +
                    fightRandomInt(-8, 8),
                    20,
                    95
                ),

            defense:
                fightClamp(
                    ovr +
                    fightRandomInt(-8, 8),
                    20,
                    95
                ),

            fightIQ:
                fightClamp(
                    ovr +
                    fightRandomInt(-8, 8),
                    20,
                    95
                ),

            chin:
                fightClamp(
                    ovr +
                    fightRandomInt(-8, 8),
                    20,
                    95
                ),

            offense:
                fightClamp(
                    ovr +
                    fightRandomInt(-8, 8),
                    20,
                    95
                ),

            blocking:
                fightClamp(
                    ovr +
                    fightRandomInt(-8, 8),
                    20,
                    95
                )

        };

    }


    if (!opponent.name) {

        opponent.name =
            opponent.displayName ||
            "Adversário";

    }


    if (!opponent.displayName) {

        opponent.displayName =
            opponent.name;

    }


    return opponent;

}


/* =========================================================
   ESTILO
========================================================= */

function getStyleData(
    style
) {

    const normalized =
        String(
            style || "Completo"
        )
        .toLowerCase();


    if (
        normalized.includes(
            "striker"
        )
    ) {

        return {

            name: "Striker",

            striking: 1.15,
            wrestling: 0.85,
            grappling: 0.90,
            defense: 1.00,
            cardio: 1.00,

            koBonus: 1.25,
            submissionBonus: 0.75

        };

    }


    if (
        normalized.includes(
            "wrestler"
        )
    ) {

        return {

            name: "Wrestler",

            striking: 0.90,
            wrestling: 1.20,
            grappling: 1.05,
            defense: 1.05,
            cardio: 1.05,

            koBonus: 0.90,
            submissionBonus: 1.00

        };

    }


    if (
        normalized.includes(
            "grappler"
        )
    ) {

        return {

            name: "Grappler",

            striking: 0.90,
            wrestling: 1.05,
            grappling: 1.25,
            defense: 1.00,
            cardio: 0.95,

            koBonus: 0.85,
            submissionBonus: 1.30

        };

    }


    return {

        name: "Completo",

        striking: 1.00,
        wrestling: 1.00,
        grappling: 1.00,
        defense: 1.00,
        cardio: 1.00,

        koBonus: 1.00,
        submissionBonus: 1.00

    };

}


/* =========================================================
   ESTRATÉGIAS
========================================================= */

const FIGHT_STRATEGIES = {

    balanced: {

        name:
            "Equilibrada",

        description:
            "Mistura ataque, defesa e controle do ritmo.",

        offense: 1.00,
        defense: 1.00,
        stamina: 1.00,
        finish: 1.00

    },


    aggressive: {

        name:
            "Agressiva",

        description:
            "Busca dominar e terminar a luta rapidamente.",

        offense: 1.25,
        defense: 0.82,
        stamina: 0.78,
        finish: 1.25

    },


    technical: {

        name:
            "Técnica",

        description:
            "Prioriza precisão, distância e eficiência.",

        offense: 1.05,
        defense: 1.15,
        stamina: 1.05,
        finish: 0.95

    },


    wrestling: {

        name:
            "Wrestling",

        description:
            "Pressiona com quedas e controle no chão.",

        offense: 1.05,
        defense: 1.00,
        stamina: 0.88,
        finish: 1.05

    },


    counter: {

        name:
            "Contra-ataque",

        description:
            "Espera o erro para responder com golpes fortes.",

        offense: 0.92,
        defense: 1.20,
        stamina: 1.08,
        finish: 1.20

    },


    survival: {

        name:
            "Sobrevivência",

        description:
            "Protege a condição e busca chegar aos juízes.",

        offense: 0.70,
        defense: 1.30,
        stamina: 1.20,
        finish: 0.65

    }

};


/* =========================================================
   INICIAR LUTA
========================================================= */

function startFight() {

    const player =
        ensureFightStructures();

    if (!player) {
        return;
    }


    if (
        !player.nextFight
    ) {

        alert(
            "Você não possui uma luta marcada."
        );

        return;

    }


    const scheduled =
        player.nextFight;


    const opponent =
        normalizeOpponent(
            scheduled.opponent
        );


    const event =
        scheduled.event ||
        {

            name:
                "MMA FIGHT NIGHT",

            organization:
                player.organization ||
                "Circuito Regional",

            venue:
                "Arena MMA",

            city:
                "São Paulo",

            country:
                "Brasil"

        };


    const rounds =
        scheduled.rounds ||
        (
            scheduled.titleFight
                ? 5
                : 3
        );


    window.mmaFight = {

        active: true,

        finished: false,

        player: player,

        opponent: opponent,

        event: event,

        titleFight:
            !!scheduled.titleFight,

        interimTitle:
            !!scheduled.interimTitle,

        rounds:
            rounds,

        currentRound: 0,

        playerScore: 0,

        opponentScore: 0,

        playerDamage: 0,

        opponentDamage: 0,

        playerStamina: 100,

        opponentStamina: 100,

        playerHealth: 100,

        opponentHealth: 100,

        playerMomentum: 50,

        opponentMomentum: 50,

        playerKnockdowns: 0,

        opponentKnockdowns: 0,

        playerTakedowns: 0,

        opponentTakedowns: 0,

        playerControl: 0,

        opponentControl: 0,

        playerSignificantStrikes: 0,

        opponentSignificantStrikes: 0,

        playerTotalStrikes: 0,

        opponentTotalStrikes: 0,

        playerGrappling: 0,

        opponentGrappling: 0,

        playerCriticalHits: 0,

        opponentCriticalHits: 0,

        playerStrategy:
            "balanced",

        opponentStrategy:
            chooseOpponentStrategy(
                opponent
            ),

        playerRoundScores: [],

        opponentRoundScores: [],

        log: [],

        lastAction:
            null,

        lastEvent:
            null,

        decision:
            null,

        winner:
            null,

        method:
            null,

        finishRound:
            null,

        finishTime:
            null

    };


    fightAddLog(
        "🔔 A luta vai começar!"
    );


    renderFightScreen();

}


/* =========================================================
   ESCOLHER ESTRATÉGIA DO ADVERSÁRIO
========================================================= */

function chooseOpponentStrategy(
    opponent
) {

    const style =
        getStyleData(
            opponent.style
        );


    if (
        style.name ===
        "Striker"
    ) {

        return fightChance(0.45)
            ? "aggressive"
            : "technical";

    }


    if (
        style.name ===
        "Wrestler"
    ) {

        return fightChance(0.60)
            ? "wrestling"
            : "aggressive";

    }


    if (
        style.name ===
        "Grappler"
    ) {

        return fightChance(0.60)
            ? "wrestling"
            : "technical";

    }


    const choices = [

        "balanced",
        "aggressive",
        "technical",
        "wrestling",
        "counter"

    ];


    return choices[
        fightRandomInt(
            0,
            choices.length - 1
        )
    ];

}


/* =========================================================
   TELA DA LUTA
========================================================= */

function fightScreen() {

    const player =
        ensureFightStructures();


    if (!player) {
        return;
    }


    if (
        !window.mmaFight ||
        !window.mmaFight.active
    ) {

        if (
            player.nextFight &&
            (
                typeof player.nextFight.weeksRemaining !==
                "number" ||
                player.nextFight.weeksRemaining <= 0
            )
        ) {

            startFight();
            return;

        }


        renderNoFightScreen();
        return;

    }


    renderFightScreen();

}


/* =========================================================
   TELA SEM LUTA
========================================================= */

function renderNoFightScreen() {

    const content =
        fightContent();


    if (!content) {
        return;
    }


    content.innerHTML = `

        <div class="card">

            <div class="title">
                👊 COMBATE
            </div>

            <p>
                Você não possui uma luta
                acontecendo neste momento.
            </p>

            <button
                class="main-button"
                onclick="home()">
                🏠 VOLTAR
            </button>

        </div>

    `;

}


/* =========================================================
   RENDER PRINCIPAL
========================================================= */

function renderFightScreen() {

    const content =
        fightContent();


    const fight =
        window.mmaFight;


    if (
        !content ||
        !fight
    ) {

        return;

    }


    const player =
        fight.player;


    const opponent =
        fight.opponent;


    const pOVR =
        fightGetOVR(
            player
        );


    const oOVR =
        fightGetOVR(
            opponent
        );


    const playerHealth =
        fightRound(
            fight.playerHealth
        );


    const opponentHealth =
        fightRound(
            fight.opponentHealth
        );


    const playerStamina =
        fightRound(
            fight.playerStamina
        );


    const opponentStamina =
        fightRound(
            fight.opponentStamina
        );


    content.innerHTML = `

        <div class="card fight-header">

            <div class="title">
                🥊 ${fight.event.name}
            </div>

            <p>
                ${
                    fight.event.city ||
                    "Local desconhecido"
                }
                •
                ${
                    fight.event.venue ||
                    "Arena"
                }
            </p>

            ${
                fight.titleFight
                ?
                `
                    <div class="fight-title-badge">
                        🏆 LUTA PELO TÍTULO
                    </div>
                `
                :
                ""
            }

        </div>


        <div class="card">

            <div class="fight-versus">

                <div class="fight-corner">

                    <div class="fight-avatar">
                        🥊
                    </div>

                    <h2>
                        ${
                            player.name ||
                            "Você"
                        }
                    </h2>

                    <p>
                        OVR ${pOVR}
                    </p>

                    <strong>
                        ${
                            player.style ||
                            "Completo"
                        }
                    </strong>

                </div>


                <div class="fight-vs">
                    VS
                </div>


                <div class="fight-corner">

                    <div class="fight-avatar">
                        🥊
                    </div>

                    <h2>
                        ${
                            opponent.displayName ||
                            opponent.name
                        }
                    </h2>

                    <p>
                        OVR ${oOVR}
                    </p>

                    <strong>
                        ${
                            opponent.style ||
                            "Completo"
                        }
                    </strong>

                </div>

            </div>

        </div>


        <div class="stats-grid">

            <div class="stat-card">

                <span>
                    ROUND
                </span>

                <strong>
                    ${
                        fight.currentRound
                        ||
                        "PRÉ-LUTA"
                    }
                    /
                    ${fight.rounds}
                </strong>

            </div>


            <div class="stat-card">

                <span>
                    SEU VIGOR
                </span>

                <strong>
                    ${playerStamina}%
                </strong>

            </div>


            <div class="stat-card">

                <span>
                    SUA SAÚDE
                </span>

                <strong>
                    ${playerHealth}%
                </strong>

            </div>


            <div class="stat-card">

                <span>
                    MOMENTUM
                </span>

                <strong>
                    ${fightRound(
                        fight.playerMomentum
                    )}
                </strong>

            </div>

        </div>


        <div class="card">

            <div class="title">
                📊 CONDIÇÃO
            </div>


            <div class="statline">

                <span>
                    ${
                        player.name ||
                        "Você"
                    }
                </span>

                <b>
                    ${playerHealth}%
                    ❤️
                </b>

            </div>


            <div class="statline">

                <span>
                    ${
                        opponent.displayName ||
                        opponent.name
                    }
                </span>

                <b>
                    ${opponentHealth}%
                    ❤️
                </b>

            </div>


            <div class="statline">

                <span>
                    Seu vigor
                </span>

                <b>
                    ${playerStamina}%
                </b>

            </div>


            <div class="statline">

                <span>
                    Vigor adversário
                </span>

                <b>
                    ${opponentStamina}%
                </b>

            </div>

        </div>


        ${
            fight.currentRound === 0
            ?
            renderPreFight()
            :
            renderFightControls()
        }


        ${renderFightStatistics()}


        ${renderFightLog()}

    `;

}


/* =========================================================
   PRÉ-LUTA
========================================================= */

function renderPreFight() {

    const fight =
        window.mmaFight;


    return `

        <div class="card">

            <div class="title">
                🔔 ÚLTIMOS MOMENTOS
            </div>

            <p>
                Os dois lutadores estão
                prontos para entrar no cage.
            </p>

            <div class="statline">

                <span>
                    Sua estratégia
                </span>

                <b>
                    ${
                        FIGHT_STRATEGIES[
                            fight.playerStrategy
                        ].name
                    }
                </b>

            </div>


            <button
                class="main-button"
                onclick="beginFightRounds()">
                🔔 COMEÇAR LUTA
            </button>

        </div>

        <div class="card">

            <div class="title">
                🎯 ESTRATÉGIA
            </div>

            <button
                class="main-button"
                onclick="setFightStrategy('balanced')">
                ⚖️ EQUILIBRADA
            </button>

            <button
                class="main-button"
                onclick="setFightStrategy('aggressive')">
                🔥 AGRESSIVA
            </button>

            <button
                class="main-button"
                onclick="setFightStrategy('technical')">
                🎯 TÉCNICA
            </button>

            <button
                class="main-button"
                onclick="setFightStrategy('wrestling')">
                🤼 WRESTLING
            </button>

            <button
                class="main-button"
                onclick="setFightStrategy('counter')">
                🥶 CONTRA-ATAQUE
            </button>

            <button
                class="main-button"
                onclick="setFightStrategy('survival')">
                🛡️ SOBREVIVÊNCIA
            </button>

        </div>

    `;

}


/* =========================================================
   COMEÇAR ROUNDS
========================================================= */

function beginFightRounds() {

    const fight =
        window.mmaFight;


    if (!fight) {
        return;
    }


    fight.currentRound = 1;


    fightAddLog(
        "🔔 Round 1 começou!"
    );


    renderFightScreen();

}


/* =========================================================
   CONTROLES
========================================================= */

function renderFightControls() {

    const fight =
        window.mmaFight;


    if (
        fight.finished
    ) {

        return renderFightResult();

    }


    return `

        <div class="card">

            <div class="title">
                🎮 COMANDO DO ROUND
            </div>

            <p>
                Escolha como você quer
                conduzir o combate.
            </p>


            <button
                class="main-button"
                onclick="fightAction('striking')">
                👊 BOXE / STRIKING
            </button>


            <button
                class="main-button"
                onclick="fightAction('power')">
                💥 BUSCAR O GOLPE FORTE
            </button>


            <button
                class="main-button"
                onclick="fightAction('wrestling')">
                🤼 BUSCAR QUEDA
            </button>


            <button
                class="main-button"
                onclick="fightAction('grappling')">
                🥋 JOGO DE CHÃO
            </button>


            <button
                class="main-button"
                onclick="fightAction('counter')">
                🥶 CONTRA-ATACAR
            </button>


            <button
                class="main-button"
                onclick="fightAction('defend')">
                🛡️ DEFENDER / RESPIRAR
            </button>


            <button
                class="main-button"
                onclick="fightAction('pressure')">
                🔥 PRESSIONAR
            </button>

        </div>


        <div class="card">

            <div class="title">
                🎯 ESTRATÉGIA ATUAL
            </div>

            <p>
                ${
                    FIGHT_STRATEGIES[
                        fight.playerStrategy
                    ].name
                }
            </p>


            <button
                class="main-button"
                onclick="toggleFightStrategyMenu()">
                🔄 MUDAR ESTRATÉGIA
            </button>

        </div>

    `;

}


/* =========================================================
   MENU ESTRATÉGIA
========================================================= */

function toggleFightStrategyMenu() {

    const fight =
        window.mmaFight;


    if (!fight) {
        return;
    }


    const content =
        fightContent();


    if (!content) {
        return;
    }


    const existing =
        document.getElementById(
            "fight-strategy-menu"
        );


    if (existing) {

        existing.remove();
        return;

    }


    const box =
        document.createElement(
            "div"
        );


    box.id =
        "fight-strategy-menu";


    box.className =
        "card";


    box.innerHTML = `

        <div class="title">
            🎯 ESCOLHA SUA ESTRATÉGIA
        </div>

        ${Object.keys(
            FIGHT_STRATEGIES
        )
        .map(
            function(key) {

                const strategy =
                    FIGHT_STRATEGIES[key];


                return `

                    <button
                        class="main-button"
                        onclick="setFightStrategy('${key}')">

                        ${strategy.name}

                    </button>

                    <p>
                        ${strategy.description}
                    </p>

                `;

            }
        )
        .join("")}

    `;


    content.appendChild(
        box
    );

}


/* =========================================================
   ALTERAR ESTRATÉGIA
========================================================= */

function setFightStrategy(
    strategy
) {

    const fight =
        window.mmaFight;


    if (!fight) {
        return;
    }


    if (
        !FIGHT_STRATEGIES[
            strategy
        ]
    ) {

        return;

    }


    fight.playerStrategy =
        strategy;


    fightAddLog(
        "🎯 Estratégia alterada para " +
        FIGHT_STRATEGIES[
            strategy
        ].name +
        "."
    );


    renderFightScreen();

}


/* =========================================================
   EXECUTAR AÇÃO
========================================================= */

function fightAction(
    action
) {

    const fight =
        window.mmaFight;


    if (
        !fight ||
        fight.finished
    ) {

        return;

    }


    if (
        fight.currentRound <= 0
    ) {

        return;

    }


    fight.lastAction =
        action;


    simulateRound(
        action
    );


    if (
        fight.finished
    ) {

        renderFightScreen();
        return;

    }


    fight.currentRound++;


    if (
        fight.currentRound >
        fight.rounds
    ) {

        finishByDecision();

        renderFightScreen();

        return;

    }


    fightAddLog(
        "🔔 Round " +
        fight.currentRound +
        " começou."
    );


    renderFightScreen();

}


/* =========================================================
   SIMULAR ROUND
========================================================= */

function simulateRound(
    playerAction
) {

    const fight =
        window.mmaFight;


    const player =
        fight.player;


    const opponent =
        fight.opponent;


    const pa =
        player.attributes || {};


    const oa =
        opponent.attributes || {};


    const pStyle =
        getStyleData(
            player.style
        );


    const oStyle =
        getStyleData(
            opponent.style
        );


    const pStrategy =
        FIGHT_STRATEGIES[
            fight.playerStrategy
        ];


    const oStrategy =
        FIGHT_STRATEGIES[
            fight.opponentStrategy
        ];


    /* =====================================================
       CARDIO
    ===================================================== */

    const playerCardio =
        Number(
            pa.cardio || 45
        );


    const opponentCardio =
        Number(
            oa.cardio || 45
        );


    /* =====================================================
       EFICIÊNCIA
    ===================================================== */

    const playerEfficiency =
        fightClamp(
            (
                playerCardio +
                Number(
                    pa.technique || 45
                ) +
                Number(
                    pa.fightIQ || 40
                )
            ) / 3,
            1,
            99
        );


    const opponentEfficiency =
        fightClamp(
            (
                opponentCardio +
                Number(
                    oa.technique || 45
                ) +
                Number(
                    oa.fightIQ || 45
                )
            ) / 3,
            1,
            99
        );


    /* =====================================================
       CUSTO DE STAMINA
    ===================================================== */

    let playerCost =
        10;


    if (
        playerAction ===
        "power"
    ) {

        playerCost = 19;

    }


    if (
        playerAction ===
        "wrestling"
    ) {

        playerCost = 14;

    }


    if (
        playerAction ===
        "grappling"
    ) {

        playerCost = 12;

    }


    if (
        playerAction ===
        "pressure"
    ) {

        playerCost = 18;

    }


    if (
        playerAction ===
        "counter"
    ) {

        playerCost = 8;

    }


    if (
        playerAction ===
        "defend"
    ) {

        playerCost = 5;

    }


    playerCost *=
        pStrategy.stamina;


    playerCost *=
        (
            1 -
            (
                playerCardio /
                250
            )
        );


    const opponentCost =
        10 *
        oStrategy.stamina *
        (
            1 -
            opponentCardio /
            250
        );


    fight.playerStamina =
        fightClamp(
            fight.playerStamina -
            playerCost +
            fightRandom(
                -2,
                2
            ),
            0,
            100
        );


    fight.opponentStamina =
        fightClamp(
            fight.opponentStamina -
            opponentCost +
            fightRandom(
                -2,
                2
            ),
            0,
            100
        );


    /* =====================================================
       ATAQUE BASE
    ===================================================== */

    let playerAttack =
        0;


    let opponentAttack =
        0;


    let playerDefense =
        0;


    let opponentDefense =
        0;


    playerDefense =
        Number(
            pa.defense || 45
        ) *
        pStrategy.defense;


    opponentDefense =
        Number(
            oa.defense || 45
        ) *
        oStrategy.defense;


    /* =====================================================
       AÇÕES DO JOGADOR
    ===================================================== */

    if (
        playerAction ===
        "striking"
    ) {

        playerAttack =
            (
                Number(
                    pa.striking || 45
                ) * 0.45
            ) +
            (
                Number(
                    pa.technique || 45
                ) * 0.25
            ) +
            (
                Number(
                    pa.offense || 45
                ) * 0.20
            ) +
            (
                Number(
                    pa.speed || 45
                ) * 0.10
            );


        playerAttack *=
            pStyle.striking;

    }


    if (
        playerAction ===
        "power"
    ) {

        playerAttack =
            (
                Number(
                    pa.striking || 45
                ) * 0.35
            ) +
            (
                Number(
                    pa.strength || 45
                ) * 0.35
            ) +
            (
                Number(
                    pa.offense || 45
                ) * 0.20
            ) +
            (
                Number(
                    pa.technique || 45
                ) * 0.10
            );


        playerAttack *=
            pStyle.striking *
            1.20;

    }


    if (
        playerAction ===
        "wrestling"
    ) {

        playerAttack =
            (
                Number(
                    pa.wrestling || 45
                ) * 0.55
            ) +
            (
                Number(
                    pa.strength || 45
                ) * 0.20
            ) +
            (
                Number(
                    pa.technique || 45
                ) * 0.15
            ) +
            (
                Number(
                    pa.fightIQ || 40
                ) * 0.10
            );


        playerAttack *=
            pStyle.wrestling;

    }


    if (
        playerAction ===
        "grappling"
    ) {

        playerAttack =
            (
                Number(
                    pa.grappling || 45
                ) * 0.55
            ) +
            (
                Number(
                    pa.wrestling || 45
                ) * 0.20
            ) +
            (
                Number(
                    pa.technique || 45
                ) * 0.15
            ) +
            (
                Number(
                    pa.fightIQ || 40
                ) * 0.10
            );


        playerAttack *=
            pStyle.grappling;

    }


    if (
        playerAction ===
        "counter"
    ) {

        playerAttack =
            (
                Number(
                    pa.striking || 45
                ) * 0.35
            ) +
            (
                Number(
                    pa.technique || 45
                ) * 0.25
            ) +
            (
                Number(
                    pa.defense || 45
                ) * 0.20
            ) +
            (
                Number(
                    pa.fightIQ || 40
                ) * 0.20
            );


        playerAttack *=
            1.05;

    }


    if (
        playerAction ===
        "pressure"
    ) {

        playerAttack =
            (
                Number(
                    pa.striking || 45
                ) * 0.35
            ) +
            (
                Number(
                    pa.wrestling || 45
                ) * 0.25
            ) +
            (
                Number(
                    pa.offense || 45
                ) * 0.25
            ) +
            (
                Number(
                    pa.strength || 45
                ) * 0.15
            );


        playerAttack *=
            1.15;

    }


    if (
        playerAction ===
        "defend"
    ) {

        playerAttack =
            Number(
                pa.technique || 45
            ) *
            0.55;

        playerDefense *=
            1.35;

    }


    /* =====================================================
       ATAQUE ADVERSÁRIO
    ===================================================== */

    const opponentStyle =
        oStyle.name;


    if (
        opponentStyle ===
        "Striker"
    ) {

        opponentAttack =
            (
                Number(
                    oa.striking || 45
                ) * 0.50
            ) +
            (
                Number(
                    oa.offense || 45
                ) * 0.25
            ) +
            (
                Number(
                    oa.technique || 45
                ) * 0.15
            ) +
            (
                Number(
                    oa.strength || 45
                ) * 0.10
            );

    }


    else if (
        opponentStyle ===
        "Wrestler"
    ) {

        opponentAttack =
            (
                Number(
                    oa.wrestling || 45
                ) * 0.45
            ) +
            (
                Number(
                    oa.strength || 45
                ) * 0.20
            ) +
            (
                Number(
                    oa.grappling || 45
                ) * 0.20
            ) +
            (
                Number(
                    oa.technique || 45
                ) * 0.15
            );

    }


    else if (
        opponentStyle ===
        "Grappler"
    ) {

        opponentAttack =
            (
                Number(
                    oa.grappling || 45
                ) * 0.45
            ) +
            (
                Number(
                    oa.wrestling || 45
                ) * 0.25
            ) +
            (
                Number(
                    oa.technique || 45
                ) * 0.20
            ) +
            (
                Number(
                    oa.fightIQ || 45
                ) * 0.10
            );

    }


    else {

        opponentAttack =
            (
                Number(
                    oa.striking || 45
                ) * 0.30
            ) +
            (
                Number(
                    oa.wrestling || 45
                ) * 0.25
            ) +
            (
                Number(
                    oa.grappling || 45
                ) * 0.20
            ) +
            (
                Number(
                    oa.technique || 45
                ) * 0.15
            ) +
            (
                Number(
                    oa.offense || 45
                ) * 0.10
            );

    }


    opponentAttack *=
        oStrategy.offense;


    /* =====================================================
       FADIGA DURANTE A LUTA
    ===================================================== */

    const playerFatiguePenalty =
        (
            100 -
            fight.playerStamina
        ) * 0.18;


    const opponentFatiguePenalty =
        (
            100 -
            fight.opponentStamina
        ) * 0.18;


    playerAttack -=
        playerFatiguePenalty;


    opponentAttack -=
        opponentFatiguePenalty;


    /* =====================================================
       VARIAÇÃO NATURAL
    ===================================================== */

    playerAttack +=
        fightRandom(
            -8,
            8
        );


    opponentAttack +=
        fightRandom(
            -8,
            8
        );


    /* =====================================================
       MOMENTUM
    ===================================================== */

    playerAttack +=
        (
            fight.playerMomentum -
            50
        ) * 0.18;


    opponentAttack +=
        (
            fight.opponentMomentum -
            50
        ) * 0.18;


    /* =====================================================
       PRECISÃO
    ===================================================== */

    const playerAccuracy =
        fightClamp(
            0.45 +
            (
                (
                    Number(
                        pa.technique || 45
                    ) +
                    Number(
                        pa.offense || 45
                    ) +
                    Number(
                        pa.fightIQ || 40
                    )
                ) /
                500
            ),
            0.40,
            0.78
        );


    const opponentAccuracy =
        fightClamp(
            0.45 +
            (
                (
                    Number(
                        oa.technique || 45
                    ) +
                    Number(
                        oa.offense || 45
                    ) +
                    Number(
                        oa.fightIQ || 45
                    )
                ) /
                500
            ),
            0.40,
            0.78
        );


    /* =====================================================
       IMPACTO CONTRA DEFESA
    ===================================================== */

    const playerHitValue =
        playerAttack -
        opponentDefense *
        0.45;


    const opponentHitValue =
        opponentAttack -
        playerDefense *
        0.45;


    let playerLanded =
        Math.max(
            0,
            Math.round(
                playerHitValue /
                5
            )
        );


    let opponentLanded =
        Math.max(
            0,
            Math.round(
                opponentHitValue /
                5
            )
        );


    playerLanded =
        Math.round(
            playerLanded *
            playerAccuracy
        );


    opponentLanded =
        Math.round(
            opponentLanded *
            opponentAccuracy
        );


    /* =====================================================
       DEFESA / CONTRA-ATAQUE
    ===================================================== */

    if (
        playerAction ===
        "counter"
    ) {

        if (
            fightChance(
                0.35 +
                Number(
                    pa.fightIQ || 40
                ) /
                500
            )
        ) {

            playerLanded +=
                fightRandomInt(
                    2,
                    6
                );

            fight.playerMomentum =
                fightClamp(
                    fight.playerMomentum +
                    8,
                    0,
                    100
                );

            fightAddLog(
                "🥶 Contra-ataque perfeito!"
            );

        }

    }


    if (
        playerAction ===
        "defend"
    ) {

        opponentLanded =
            Math.round(
                opponentLanded *
                0.55
            );

    }


    /* =====================================================
       GOLPES SIGNIFICATIVOS
    ===================================================== */

    fight.playerTotalStrikes +=
        Math.max(
            1,
            playerLanded
        );


    fight.opponentTotalStrikes +=
        Math.max(
            1,
            opponentLanded
        );


    fight.playerSignificantStrikes +=
        Math.round(
            playerLanded *
            0.70
        );


    fight.opponentSignificantStrikes +=
        Math.round(
            opponentLanded *
            0.70
        );


    /* =====================================================
       DANO
    ===================================================== */

    let playerDamage =
        playerLanded *
        (
            0.70 +
            Number(
                pa.striking || 45
            ) /
            180
        );


    let opponentDamage =
        opponentLanded *
        (
            0.70 +
            Number(
                oa.striking || 45
            ) /
            180
        );


    if (
        playerAction ===
        "power"
    ) {

        playerDamage *=
            1.65;

    }


    if (
        playerAction ===
        "pressure"
    ) {

        playerDamage *=
            1.15;

    }


    if (
        playerAction ===
        "defend"
    ) {

        opponentDamage *=
            0.65;

    }


    /* =====================================================
       QUEIXO
    ===================================================== */

    const playerChin =
        Number(
            pa.chin || 45
        );


    const opponentChin =
        Number(
            oa.chin || 45
        );


    playerDamage *=
        (
            1.15 -
            playerChin /
            400
        );


    opponentDamage *=
        (
            1.15 -
            opponentChin /
            400
        );


    /* =====================================================
       APLICAR DANO
    ===================================================== */

    fight.opponentHealth =
        fightClamp(
            fight.opponentHealth -
            playerDamage,
            0,
            100
        );


    fight.playerHealth =
        fightClamp(
            fight.playerHealth -
            opponentDamage,
            0,
            100
        );


    fight.playerDamage +=
        playerDamage;


    fight.opponentDamage +=
        opponentDamage;


    /* =====================================================
       QUEDAS
    ===================================================== */

    if (
        playerAction ===
        "wrestling"
    ) {

        const takedownChance =
            fightClamp(
                0.25 +
                (
                    Number(
                        pa.wrestling || 45
                    ) -
                    Number(
                        oa.wrestling || 45
                    )
                ) /
                180 +
                Number(
                    pa.fightIQ || 40
                ) /
                500,
                0.08,
                0.75
            );


        if (
            fightChance(
                takedownChance
            )
        ) {

            fight.playerTakedowns++;

            fight.playerControl +=
                fightRandomInt(
                    25,
                    55
                );


            fightAddLog(
                "🤼 Você conseguiu a queda!"
            );


            const groundDamage =
                (
                    Number(
                        pa.grappling || 45
                    ) +
                    Number(
                        pa.wrestling || 45
                    )
                ) /
                12;


            fight.opponentHealth =
                fightClamp(
                    fight.opponentHealth -
                    groundDamage,
                    0,
                    100
                );


            fight.opponentStamina =
                fightClamp(
                    fight.opponentStamina -
                    fightRandom(
                        5,
                        13
                    ),
                    0,
                    100
                );

        }

        else {

            fightAddLog(
                "❌ O adversário defendeu a queda."
            );

        }

    }


    /* =====================================================
       JOGO DE CHÃO
    ===================================================== */

    if (
        playerAction ===
        "grappling"
    ) {

        const submissionChance =
            fightClamp(
                0.03 +
                (
                    Number(
                        pa.grappling || 45
                    ) -
                    Number(
                        oa.grappling || 45
                    )
                ) /
                500 +
                Number(
                    pa.technique || 45
                ) /
                1500,
                0.01,
                0.25
            );


        if (
            fightChance(
                submissionChance
            )
        ) {

            finishFight(
                "win",
                "submission",
                "Finalização"
            );

            return;

        }


        const ground =
            (
                Number(
                    pa.grappling || 45
                ) +
                Number(
                    pa.technique || 45
                )
            ) /
            10;


        fight.opponentHealth =
            fightClamp(
                fight.opponentHealth -
                ground,
                0,
                100
            );


        fight.opponentStamina =
            fightClamp(
                fight.opponentStamina -
                fightRandom(
                    8,
                    17
                ),
                0,
                100
            );


        fight.playerGrappling +=
            1;


        fight.playerControl +=
            fightRandomInt(
                20,
                45
            );


        fightAddLog(
            "🥋 Você trabalhou no chão."
        );

    }


    /* =====================================================
       FINALIZAÇÃO ADVERSÁRIA
    ===================================================== */

    if (
        fight.opponentStamina <
        35 &&
        fightChance(
            0.035 +
            Number(
                oa.grappling || 45
            ) /
            2000
        )
    ) {

        finishFight(
            "loss",
            "submission",
            "Finalização"
        );

        return;

    }


    /* =====================================================
       KNOCKDOWNS
    ===================================================== */

    const playerPower =
        (
            Number(
                pa.strength || 45
            ) +
            Number(
                pa.striking || 45
            ) +
            Number(
                pa.offense || 45
            )
        ) / 3;


    const opponentPower =
        (
            Number(
                oa.strength || 45
            ) +
            Number(
                oa.striking || 45
            ) +
            Number(
                oa.offense || 45
            )
        ) / 3;


    const playerKDChance =
        fightClamp(
            (
                playerDamage /
                100
            ) *
            (
                playerPower /
                65
            ) *
            pStyle.koBonus *
            pStrategy.finish *
            0.20,
            0,
            0.30
        );


    const opponentKDChance =
        fightClamp(
            (
                opponentDamage /
                100
            ) *
            (
                opponentPower /
                65
            ) *
            oStyle.koBonus *
            oStrategy.finish *
            0.20,
            0,
            0.30
        );


    if (
        fightChance(
            playerKDChance
        )
    ) {

        fight.playerKnockdowns++;


        fight.playerMomentum =
            fightClamp(
                fight.playerMomentum +
                15,
                0,
                100
            );


        fight.opponentMomentum =
            fightClamp(
                fight.opponentMomentum -
                15,
                0,
                100
            );


        fightAddLog(
            "💥 KNOCKDOWN! Você derrubou o adversário!"
        );


        fight.opponentHealth =
            fightClamp(
                fight.opponentHealth -
                fightRandom(
                    4,
                    10
                ),
                0,
                100
            );

    }


    if (
        fightChance(
            opponentKDChance
        )
    ) {

        fight.opponentKnockdowns++;


        fight.opponentMomentum =
            fightClamp(
                fight.opponentMomentum +
                15,
                0,
                100
            );


        fight.playerMomentum =
            fightClamp(
                fight.playerMomentum -
                15,
                0,
                100
            );


        fightAddLog(
            "💥 KNOCKDOWN! Você foi derrubado!"
        );


        fight.playerHealth =
            fightClamp(
                fight.playerHealth -
                fightRandom(
                    4,
                    10
                ),
                0,
                100
            );

    }


    /* =====================================================
       CRÍTICOS
    ===================================================== */

    const playerCriticalChance =
        fightClamp(
            0.02 +
            playerPower /
            5000,
            0.01,
            0.08
        );


    const opponentCriticalChance =
        fightClamp(
            0.02 +
            opponentPower /
            5000,
            0.01,
            0.08
        );


    if (
        fightChance(
            playerCriticalChance
        )
    ) {

        const critical =
            fightRandom(
                5,
                12
            );


        fight.opponentHealth =
            fightClamp(
                fight.opponentHealth -
                critical,
                0,
                100
            );


        fight.playerCriticalHits++;


        fightAddLog(
            "💥 Golpe crítico seu!"
        );

    }


    if (
        fightChance(
            opponentCriticalChance
        )
    ) {

        const critical =
            fightRandom(
                5,
                12
            );


        fight.playerHealth =
            fightClamp(
                fight.playerHealth -
                critical,
                0,
                100
            );


        fight.opponentCriticalHits++;


        fightAddLog(
            "💥 O adversário acertou um golpe crítico!"
        );

    }


    /* =====================================================
       RECUPERAÇÃO ENTRE ROUNDS
    ===================================================== */

    const playerRecovery =
        playerCardio /
        22;


    const opponentRecovery =
        opponentCardio /
        22;


    fight.playerStamina =
        fightClamp(
            fight.playerStamina +
            playerRecovery,
            0,
            100
        );


    fight.opponentStamina =
        fightClamp(
            fight.opponentStamina +
            opponentRecovery,
            0,
            100
        );


    /* =====================================================
       PONTUAÇÃO DO ROUND
    ===================================================== */

    const playerRoundScore =
        calculateRoundScore(
            playerLanded,
            playerDamage,
            fight.playerKnockdowns,
            fight.playerTakedowns,
            fight.playerControl,
            playerAction
        );


    const opponentRoundScore =
        calculateRoundScore(
            opponentLanded,
            opponentDamage,
            fight.opponentKnockdowns,
            fight.opponentTakedowns,
            fight.opponentControl,
            "balanced"
        );


    let finalPlayerScore =
        playerRoundScore;


    let finalOpponentScore =
        opponentRoundScore;


    if (
        fight.playerKnockdowns >
        fight.opponentKnockdowns
    ) {

        finalPlayerScore +=
            10;

    }


    if (
        fight.opponentKnockdowns >
        fight.playerKnockdowns
    ) {

        finalOpponentScore +=
            10;

    }


    fight.playerRoundScores.push(
        fightRound(
            finalPlayerScore
        )
    );


    fight.opponentRoundScores.push(
        fightRound(
            finalOpponentScore
        )
    );


    if (
        finalPlayerScore >
        finalOpponentScore
    ) {

        fight.playerScore +=
            10;

        fight.opponentScore +=
            9;


        fight.playerMomentum =
            fightClamp(
                fight.playerMomentum +
                5,
                0,
                100
            );


        fight.opponentMomentum =
            fightClamp(
                fight.opponentMomentum -
                4,
                0,
                100
            );


        fightAddLog(
            "📋 Você venceu o round " +
            fight.currentRound +
            " por aproximadamente " +
            "10-9."
        );

    }


    else if (
        finalOpponentScore >
        finalPlayerScore
    ) {

        fight.playerScore +=
            9;

        fight.opponentScore +=
            10;


        fight.opponentMomentum =
            fightClamp(
                fight.opponentMomentum +
                5,
                0,
                100
            );


        fight.playerMomentum =
            fightClamp(
                fight.playerMomentum -
                4,
                0,
                100
            );


        fightAddLog(
            "📋 O adversário venceu o round " +
            fight.currentRound +
            " por aproximadamente " +
            "10-9."
        );

    }


    else {

        fight.playerScore +=
            10;

        fight.opponentScore +=
            10;


        fightAddLog(
            "📋 Round equilibrado: 10-10."
        );

    }


    /* =====================================================
       TKO / KO
    ===================================================== */

    if (
        fight.opponentHealth <=
        0
    ) {

        finishFight(
            "win",
            "KO",
            "KO"
        );

        return;

    }


    if (
        fight.playerHealth <=
        0
    ) {

        finishFight(
            "loss",
            "KO",
            "KO"
        );

        return;

    }


    if (
        fight.opponentHealth <
        12 &&
        fightChance(
            0.25
        )
    ) {

        finishFight(
            "win",
            "TKO",
            "TKO"
        );

        return;

    }


    if (
        fight.playerHealth <
        12 &&
        fightChance(
            0.25
        )
    ) {

        finishFight(
            "loss",
            "TKO",
            "TKO"
        );

        return;

    }

}


/* =========================================================
   PONTUAÇÃO
========================================================= */

function calculateRoundScore(
    strikes,
    damage,
    knockdowns,
    takedowns,
    control,
    action
) {

    let score =
        0;


    score +=
        strikes *
        1.10;


    score +=
        damage *
        2.20;


    score +=
        knockdowns *
        18;


    score +=
        takedowns *
        7;


    score +=
        control *
        0.08;


    if (
        action ===
        "pressure"
    ) {

        score *=
            1.05;

    }


    if (
        action ===
        "defend"
    ) {

        score *=
            0.82;

    }


    return score;

}


/* =========================================================
   FINALIZAÇÃO DA LUTA
========================================================= */

function finishFight(
    winner,
    method,
    displayMethod
) {

    const fight =
        window.mmaFight;


    if (
        !fight ||
        fight.finished
    ) {

        return;

    }


    fight.finished =
        true;


    fight.active =
        false;


    fight.winner =
        winner;


    fight.method =
        method;


    fight.finishRound =
        fight.currentRound;


    fight.finishTime =
        "Round " +
        fight.currentRound;


    fight.decision = {

        winner:
            winner,

        method:
            method,

        display:
            displayMethod,

        round:
            fight.currentRound

    };


    if (
        winner ===
        "win"
    ) {

        fightAddLog(
            "🏆 FIM DE LUTA! VOCÊ VENCEU POR " +
            displayMethod +
            "!"
        );

    }


    else if (
        winner ===
        "loss"
    ) {

        fightAddLog(
            "❌ FIM DE LUTA! VOCÊ PERDEU POR " +
            displayMethod +
            "."
        );

    }


    else {

        fightAddLog(
            "🤝 FIM DE LUTA! EMPATE."
        );

    }


    processFightResult();


}


/* =========================================================
   DECISÃO
========================================================= */

function finishByDecision() {

    const fight =
        window.mmaFight;


    if (
        !fight ||
        fight.finished
    ) {

        return;

    }


    let winner =
        "draw";


    if (
        fight.playerScore >
        fight.opponentScore
    ) {

        winner =
            "win";

    }


    else if (
        fight.opponentScore >
        fight.playerScore
    ) {

        winner =
            "loss";

    }


    finishFight(
        winner,
        "decision",
        "Decisão dos juízes"
    );

}


/* =========================================================
   RESULTADO
========================================================= */

function renderFightResult() {

    const fight =
        window.mmaFight;


    if (!fight) {
        return "";
    }


    let title =
        "🤝 EMPATE";


    if (
        fight.winner ===
        "win"
    ) {

        title =
            "🏆 VITÓRIA!";

    }


    if (
        fight.winner ===
        "loss"
    ) {

        title =
            "❌ DERROTA";

    }


    return `

        <div class="card">

            <div class="title">
                ${title}
            </div>

            <h2>
                ${
                    fight.player.name
                }
            </h2>

            <p>
                ${
                    fight.winner === "win"
                    ? "Você venceu!"
                    :
                    fight.winner === "loss"
                    ? "Você perdeu."
                    :
                    "A luta terminou empatada."
                }
            </p>

            <div class="statline">

                <span>
                    Método
                </span>

                <b>
                    ${
                        fight.decision.display
                    }
                </b>

            </div>

            <div class="statline">

                <span>
                    Round
                </span>

                <b>
                    ${
                        fight.finishRound
                    }
                </b>

            </div>

            <div class="statline">

                <span>
                    Seu dano
                </span>

                <b>
                    ${
                        fightRound(
                            fight.playerDamage
                        )
                    }
                </b>

            </div>

            <div class="statline">

                <span>
                    Dano adversário
                </span>

                <b>
                    ${
                        fightRound(
                            fight.opponentDamage
                        )
                    }
                </b>

            </div>

            <div class="statline">

                <span>
                    Seus knockdowns
                </span>

                <b>
                    ${
                        fight.playerKnockdowns
                    }
                </b>

            </div>

            <div class="statline">

                <span>
                    Knockdowns adversário
                </span>

                <b>
                    ${
                        fight.opponentKnockdowns
                    }
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                📋 CARTÕES
            </div>

            ${
                fight.playerRoundScores
                    .map(
                        function(score, index) {

                            return `

                                <div class="statline">

                                    <span>
                                        Round ${
                                            index + 1
                                        }
                                    </span>

                                    <b>
                                        ${
                                            score
                                        }
                                        -
                                        ${
                                            fight.opponentRoundScores[
                                                index
                                            ]
                                        }
                                    </b>

                                </div>

                            `;

                        }
                    )
                    .join("")
            }


            <div class="statline">

                <span>
                    Total
                </span>

                <b>
                    ${
                        fight.playerScore
                    }
                    -
                    ${
                        fight.opponentScore
                    }
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                💰 RESULTADO FINANCEIRO
            </div>

            <div class="statline">

                <span>
                    Bolsa
                </span>

                <b>
                    $
                    ${
                        fightRound(
                            calculateFightPurse()
                        )
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    Bônus
                </span>

                <b>
                    $
                    ${
                        fightRound(
                            calculateFightBonus()
                        )
                    }
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                📈 CONSEQUÊNCIAS
            </div>

            <p>
                ${
                    getFightResultMessage()
                }
            </p>

            <button
                class="main-button"
                onclick="closeFightAndReturnHome()">
                🏠 CONTINUAR CARREIRA
            </button>

        </div>

    `;

}


/* =========================================================
   ESTATÍSTICAS
========================================================= */

function renderFightStatistics() {

    const fight =
        window.mmaFight;


    if (!fight) {
        return "";
    }


    return `

        <div class="card">

            <div class="title">
                📊 ESTATÍSTICAS DA LUTA
            </div>


            <div class="statline">

                <span>
                    Golpes totais
                </span>

                <b>
                    ${
                        fight.playerTotalStrikes
                    }
                    -
                    ${
                        fight.opponentTotalStrikes
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    Golpes significativos
                </span>

                <b>
                    ${
                        fight.playerSignificantStrikes
                    }
                    -
                    ${
                        fight.opponentSignificantStrikes
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    Knockdowns
                </span>

                <b>
                    ${
                        fight.playerKnockdowns
                    }
                    -
                    ${
                        fight.opponentKnockdowns
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    Quedas
                </span>

                <b>
                    ${
                        fight.playerTakedowns
                    }
                    -
                    ${
                        fight.opponentTakedowns
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    Controle
                </span>

                <b>
                    ${
                        fightRound(
                            fight.playerControl
                        )
                    }
                    -
                    ${
                        fightRound(
                            fight.opponentControl
                        )
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    Golpes críticos
                </span>

                <b>
                    ${
                        fight.playerCriticalHits
                    }
                    -
                    ${
                        fight.opponentCriticalHits
                    }
                </b>

            </div>

        </div>

    `;

}


/* =========================================================
   LOG
========================================================= */

function renderFightLog() {

    const fight =
        window.mmaFight;


    if (!fight) {
        return "";
    }


    const recent =
        fight.log
            .slice(
                -12
            )
            .reverse();


    return `

        <div class="card">

            <div class="title">
                📰 NARRAÇÃO DA LUTA
            </div>

            ${
                recent.length
                ?
                recent
                    .map(
                        function(item) {

                            return `
                                <p>
                                    ${item}
                                </p>
                            `;

                        }
                    )
                    .join("")
                :
                `
                    <p>
                        A luta ainda não começou.
                    </p>
                `
            }

        </div>

    `;

}


/* =========================================================
   ADICIONAR LOG
========================================================= */

function fightAddLog(
    message
) {

    const fight =
        window.mmaFight;


    if (!fight) {
        return;
    }


    fight.log.push(
        message
    );


    if (
        fight.log.length >
        100
    ) {

        fight.log.shift();

    }

}


/* =========================================================
   BOLSA
========================================================= */

function calculateFightPurse() {

    const fight =
        window.mmaFight;


    if (!fight) {
        return 0;
    }


    const player =
        fight.player;


    if (
        !player.professional ||
        !player.professional.active
    ) {

        return 100 +
            fightRandomInt(
                0,
                200
            );

    }


    const opponentOVR =
        fightGetOVR(
            fight.opponent
        );


    let purse =
        800 +
        opponentOVR *
        35 +
        fightRandomInt(
            0,
            800
        );


    if (
        fight.titleFight
    ) {

        purse *=
            1.75;

    }


    return Math.round(
        purse
    );

}


/* =========================================================
   BÔNUS
========================================================= */

function calculateFightBonus() {

    const fight =
        window.mmaFight;


    if (!fight) {
        return 0;
    }


    if (
        fight.winner !==
        "win"
    ) {

        return 0;

    }


    const opponentOVR =
        fightGetOVR(
            fight.opponent
        );


    let bonus =
        300 +
        opponentOVR *
        20 +
        fightRandomInt(
            0,
            500
        );


    if (
        fight.method ===
        "KO" ||
        fight.method ===
        "TKO" ||
        fight.method ===
        "submission"
    ) {

        bonus *=
            1.35;

    }


    if (
        fight.titleFight
    ) {

        bonus *=
            1.50;

    }


    return Math.round(
        bonus
    );

}


/* =========================================================
   PROCESSAR RESULTADO
========================================================= */

function processFightResult() {

    const fight =
        window.mmaFight;


    const player =
        fight.player;


    const purse =
        calculateFightPurse();


    const bonus =
        calculateFightBonus();


    const total =
        purse +
        bonus;


    player.money =
        Number(
            player.money || 0
        ) +
        total;


    if (!player.finances) {

        player.finances = {

            careerIncome: 0,
            fightIncome: 0,
            sponsorIncome: 0,
            investmentIncome: 0,
            propertyIncome: 0,
            expenses: 0,
            taxesPaid: 0,
            legalExpenses: 0,
            netWorth: 0,
            history: []

        };

    }


    player.finances.fightIncome =
        Number(
            player.finances.fightIncome ||
            0
        ) +
        total;


    player.finances.careerIncome =
        Number(
            player.finances.careerIncome ||
            0
        ) +
        total;


    /* =====================================================
       RECORD
    ===================================================== */

    let record;


    if (
        player.professional &&
        player.professional.active
    ) {

        record =
            player.professional;

    }

    else {

        record =
            player.amateur;

    }


    if (
        fight.winner ===
        "win"
    ) {

        record.wins =
            Number(
                record.wins || 0
            ) + 1;

    }


    else if (
        fight.winner ===
        "loss"
    ) {

        record.losses =
            Number(
                record.losses || 0
            ) + 1;

    }


    else {

        record.draws =
            Number(
                record.draws || 0
            ) + 1;

    }


    /* =====================================================
       FAMA
    ===================================================== */

    let fameChange =
        1;


    if (
        fight.winner ===
        "win"
    ) {

        fameChange =
            5;

    }


    if (
        fight.winner ===
        "loss"
    ) {

        fameChange =
            -1;

    }


    if (
        fight.method ===
        "KO"
    ) {

        fameChange +=
            5;

    }


    if (
        fight.method ===
        "TKO"
    ) {

        fameChange +=
            3;

    }


    if (
        fight.method ===
        "submission"
    ) {

        fameChange +=
            4;

    }


    if (
        fight.titleFight
    ) {

        fameChange +=
            8;

    }


    player.fame =
        Math.max(
            0,
            Number(
                player.fame || 0
            ) +
            fameChange
        );


    /* =====================================================
       CONFIANÇA
    ===================================================== */

    if (
        player.attributes
    ) {

        if (
            fight.winner ===
            "win"
        ) {

            player.attributes.confidence =
                fightClamp(
                    Number(
                        player.attributes.confidence ||
                        40
                    ) + 5,
                    0,
                    100
                );

        }

        else if (
            fight.winner ===
            "loss"
        ) {

            player.attributes.confidence =
                fightClamp(
                    Number(
                        player.attributes.confidence ||
                        40
                    ) - 5,
                    0,
                    100
                );

        }

    }


    /* =====================================================
       HISTÓRICO
    ===================================================== */

    const historyEntry = {

        year:
            Number(
                player.year || 2026
            ),

        week:
            Number(
                player.week || 1
            ),

        event:
            fight.event.name,

        opponent:
            fight.opponent.displayName ||
            fight.opponent.name,

        opponentOVR:
            fightGetOVR(
                fight.opponent
            ),

        result:
            fight.winner,

        method:
            fight.method,

        round:
            fight.finishRound,

        purse:
            purse,

        bonus:
            bonus,

        titleFight:
            !!fight.titleFight,

        playerScore:
            fight.playerScore,

        opponentScore:
            fight.opponentScore

    };


    player.fightHistory.unshift(
        historyEntry
    );


    /* =====================================================
       LOG
    ===================================================== */

    player.log.unshift(

        fight.winner === "win"
        ?
        `🏆 ${player.name} venceu ${fight.opponent.displayName || fight.opponent.name} por ${fight.decision.display}.`
        :
        fight.winner === "loss"
        ?
        `❌ ${player.name} perdeu para ${fight.opponent.displayName || fight.opponent.name} por ${fight.decision.display}.`
        :
        `🤝 ${player.name} empatou com ${fight.opponent.displayName || fight.opponent.name}.`

    );


    /* =====================================================
       REMOVER PRÓXIMA LUTA
    ===================================================== */

    player.nextFight =
        null;


    /* =====================================================
       RECUPERAÇÃO
    ===================================================== */

    const recovery =
        calculateRecoveryWeeks();


    player.fightRecoveryWeeks =
        recovery;


    player.fightRecoveryUntilWeek =
        Number(
            player.week || 1
        ) +
        recovery;


    player.health =
        fightClamp(
            Number(
                player.health || 100
            ) -
            calculatePostFightDamage(),
            1,
            100
        );


    player.fatigue =
        fightClamp(
            Number(
                player.fatigue || 0
            ) +
            25 +
            fightRandomInt(
                0,
                20
            ),
            0,
            100
        );


    /* =====================================================
       RANKING
    ===================================================== */

    processFightRanking();


    /* =====================================================
       CAMPEONATO
    ===================================================== */

    processFightChampionship();


    fightSave();

}


/* =========================================================
   DANO PÓS-LUTA
========================================================= */

function calculatePostFightDamage() {

    const fight =
        window.mmaFight;


    if (!fight) {
        return 0;
    }


    let damage =
        4;


    damage +=
        fight.playerDamage *
        0.35;


    if (
        fight.winner ===
        "loss"
    ) {

        damage +=
            5;

    }


    if (
        fight.method ===
        "KO"
    ) {

        damage +=
            10;

    }


    if (
        fight.opponentKnockdowns >
        0
    ) {

        damage +=
            fight.opponentKnockdowns *
            5;

    }


    return Math.round(
        damage
    );

}


/* =========================================================
   RECUPERAÇÃO
========================================================= */

function calculateRecoveryWeeks() {

    const fight =
        window.mmaFight;


    if (!fight) {
        return 1;
    }


    let weeks =
        1;


    if (
        fight.method ===
        "KO"
    ) {

        weeks +=
            3;

    }


    if (
        fight.method ===
        "TKO"
    ) {

        weeks +=
            2;

    }


    if (
        fight.method ===
        "submission"
    ) {

        weeks +=
            1;

    }


    if (
        fight.opponentKnockdowns >=
        2
    ) {

        weeks +=
            2;

    }


    if (
        fight.playerHealth <
        40
    ) {

        weeks +=
            2;

    }


    return fightClamp(
        weeks,
        1,
        8
    );

}


/* =========================================================
   MENSAGEM RESULTADO
========================================================= */

function getFightResultMessage() {

    const fight =
        window.mmaFight;


    if (
        fight.winner ===
        "win"
    ) {

        if (
            fight.method ===
            "KO"
        ) {

            return `
                Você conseguiu um nocaute
                e aumentou sua reputação.
                O desempenho também pode
                acelerar sua ascensão no ranking.
            `;

        }


        if (
            fight.method ===
            "submission"
        ) {

            return `
                Você mostrou domínio técnico
                e finalizou seu adversário.
            `;

        }


        return `
            Você venceu e continua avançando
            na carreira.
        `;

    }


    if (
        fight.winner ===
        "loss"
    ) {

        return `
            A derrota não encerra sua carreira.
            Agora será necessário recuperar sua
            condição e voltar ao treinamento.
        `;

    }


    return `
        Um empate mantém sua carreira aberta.
        A próxima oportunidade pode ser decisiva.
    `;

}


/* =========================================================
   RANKING
========================================================= */

function processFightRanking() {

    const player =
        fightPlayer();


    if (!player) {
        return;
    }


    if (
        !player.professional ||
        !player.professional.active
    ) {

        return;

    }


    let ranking =
        player.professional.ranking;


    if (
        typeof ranking !==
        "number"
    ) {

        ranking = 30;

    }


    if (
        window.mmaFight.winner ===
        "win"
    ) {

        ranking -= 3;

    }


    if (
        window.mmaFight.winner ===
        "loss"
    ) {

        ranking += 3;

    }


    ranking =
        fightClamp(
            ranking,
            1,
            100
        );


    player.professional.ranking =
        ranking;


    if (
        ranking <= 15
    ) {

        player.careerStage =
            "international";

    }


    if (
        ranking <= 5
    ) {

        player.careerStage =
            "elite";

    }


}


/* =========================================================
   CAMPEONATO
========================================================= */

function processFightChampionship() {

    const player =
        fightPlayer();


    const fight =
        window.mmaFight;


    if (
        !player ||
        !fight ||
        !fight.titleFight
    ) {

        return;

    }


    if (!player.championship) {

        player.championship = {

            title: null,
            organization: null,
            weightClass: null,
            defenses: 0,
            titleWins: 0,
            titleLosses: 0,
            interim: false,
            formerChampion: false

        };

    }


    if (
        fight.winner ===
        "win"
    ) {

        player.championship.title =
            "Campeão";

        player.championship.organization =
            fight.event.organization ||
            "MMA";

        player.championship.weightClass =
            player.weight;

        player.championship.titleWins =
            Number(
                player.championship.titleWins ||
                0
            ) + 1;

        player.championship.formerChampion =
            false;


        player.log.unshift(
            "🏆 VOCÊ CONQUISTOU UM CINTURÃO!"
        );

    }


    else if (
        fight.winner ===
        "loss"
    ) {

        if (
            player.championship.title
        ) {

            player.championship.title =
                null;

            player.championship.formerChampion =
                true;

            player.championship.titleLosses =
                Number(
                    player.championship.titleLosses ||
                    0
                ) + 1;

            player.log.unshift(
                "💔 Você perdeu o cinturão."
            );

        }

    }

}


/* =========================================================
   FECHAR LUTA
========================================================= */

function closeFightAndReturnHome() {

    window.mmaFight =
        null;


    fightSave();


    if (
        typeof window.home ===
        "function"
    ) {

        window.home();

    }

}


/* =========================================================
   RECUPERAÇÃO EXTERNA
   Compatível com main.js
========================================================= */

function processFightRecovery() {

    const player =
        ensureFightStructures();


    if (!player) {
        return;
    }


    if (
        Number(
            player.fightRecoveryWeeks ||
            0
        ) > 0
    ) {

        player.fightRecoveryWeeks =
            Math.max(
                0,
                Number(
                    player.fightRecoveryWeeks
                ) - 1
            );


        if (
            player.fightRecoveryWeeks ===
            0
        ) {

            player.health =
                fightClamp(
                    Number(
                        player.health || 0
                    ) +
                    20,
                    0,
                    100
                );

        }

    }


    player.health =
        fightClamp(
            Number(
                player.health || 100
            ) +
            3,
            0,
            100
        );


    player.fatigue =
        fightClamp(
            Number(
                player.fatigue || 0
            ) -
            10,
            0,
            100
        );


    fightSave();

}


/* =========================================================
   CRIAR LUTA MANUAL
========================================================= */

function createManualFight(
    opponent,
    event,
    options
) {

    const player =
        ensureFightStructures();


    if (!player) {
        return null;
    }


    const normalizedOpponent =
        normalizeOpponent(
            opponent
        );


    player.nextFight = {

        opponent:
            normalizedOpponent,

        event:
            event ||
            {

                name:
                    "MMA NIGHT",

                organization:
                    player.organization ||
                    "Circuito Regional",

                venue:
                    "Arena MMA",

                city:
                    "São Paulo",

                country:
                    "Brasil"

            },

        weeksRemaining:
            0,

        titleFight:
            !!(
                options &&
                options.titleFight
            ),

        rounds:
            (
                options &&
                options.rounds
            ) ||
            (
                options &&
                options.titleFight
                ? 5
                : 3
            )

    };


    fightSave();


    return player.nextFight;

}


/* =========================================================
   ACEITAR OFERTA DO EMPRESÁRIO
========================================================= */

function acceptManagerFightOffer() {

    const player =
        ensureFightStructures();


    if (!player) {
        return;
    }


    const offer =
        player.managerFightOffer ||
        (
            Array.isArray(
                player.managerOffers
            )
            ?
            player.managerOffers[0]
            :
            null
        );


    if (!offer) {

        alert(
            "Nenhuma oferta de luta disponível."
        );

        return;

    }


    const opponent =
        normalizeOpponent({

            name:
                offer.opponentName ||
                "Adversário",

            displayName:
                offer.opponentName ||
                "Adversário",

            power:
                offer.opponentOVR ||
                offer.power ||
                50,

            ovr:
                offer.opponentOVR ||
                offer.power ||
                50,

            style:
                offer.opponentStyle ||
                "Completo",

            country:
                "Brasil"

        });


    const event = {

        name:
            offer.eventName ||
            "MMA FIGHT NIGHT",

        organization:
            offer.organization ||
            player.organization ||
            "Circuito Regional",

        venue:
            offer.venue ||
            "Arena MMA",

        city:
            offer.city ||
            "São Paulo",

        country:
            "Brasil"

    };


    player.nextFight = {

        opponent:
            opponent,

        event:
            event,

        weeksRemaining:
            Number(
                offer.weeksRemaining ||
                0
            ),

        fightWeek:
            offer.fightWeek,

        titleFight:
            !!offer.titleFight,

        rounds:
            offer.rounds ||
            (
                offer.titleFight
                ? 5
                : 3
            ),

        purse:
            offer.purse ||
            0,

        winBonus:
            offer.winBonus ||
            0

    };


    player.managerFightOffer =
        null;


    if (
        Array.isArray(
            player.managerOffers
        )
    ) {

        player.managerOffers =
            player.managerOffers.filter(
                function(item) {

                    return item !==
                        offer;

                }
            );

    }


    player.log.unshift(
        `📅 Luta aceita contra ${opponent.displayName}.`
    );


    fightSave();


    if (
        typeof window.home ===
        "function"
    ) {

        window.home();

    }

}


/* =========================================================
   RECUSAR OFERTA
========================================================= */

function declineManagerFightOffer() {

    const player =
        ensureFightStructures();


    if (!player) {
        return;
    }


    const offer =
        player.managerFightOffer;


    if (!offer) {
        return;
    }


    player.managerFightOffer =
        null;


    if (
        Array.isArray(
            player.managerOffers
        )
    ) {

        player.managerOffers =
            player.managerOffers.filter(
                function(item) {

                    return item !==
                        offer;

                }
            );

    }


    player.log.unshift(
        "❌ Você recusou a proposta de luta."
    );


    fightSave();


    if (
        typeof window.home ===
        "function"
    ) {

        window.home();

    }

}


/* =========================================================
   GERAR OFERTA DE LUTA
========================================================= */

function generateFightOffer() {

    const player =
        ensureFightStructures();


    if (!player) {
        return null;
    }


    const playerOVR =
        fightGetOVR(
            player
        );


    const names = [

        "Carlos Silva",
        "Lucas Ferreira",
        "Matheus Santos",
        "Rafael Oliveira",
        "Bruno Costa",
        "Diego Almeida",
        "Gabriel Souza",
        "Anderson Lima",
        "Felipe Rocha",
        "Victor Martins",
        "João Ribeiro",
        "Pedro Mendes",
        "Marcos Carvalho",
        "Thiago Alves",
        "Eduardo Santos",
        "Renato Barbosa",
        "Caio Martins",
        "Vinícius Rocha"

    ];


    const styles = [

        "Striker",
        "Wrestler",
        "Grappler",
        "Completo"

    ];


    const opponentOVR =
        fightClamp(
            playerOVR +
            fightRandomInt(
                -8,
                8
            ),
            35,
            95
        );


    const opponentName =
        names[
            fightRandomInt(
                0,
                names.length - 1
            )
        ];


    const opponentStyle =
        styles[
            fightRandomInt(
                0,
                styles.length - 1
            )
        ];


    const eventNames = [

        "MMA NIGHT",
        "FIGHT NIGHT",
        "WARRIOR FC",
        "BRAZIL FIGHT",
        "COMBAT NIGHT",
        "ARENA COMBAT",
        "RISING FIGHTERS"

    ];


    const eventName =
        eventNames[
            fightRandomInt(
                0,
                eventNames.length - 1
            )
        ];


    const professional =
        !!(
            player.professional &&
            player.professional.active
        );


    const purse =
        professional
        ?
        Math.round(
            800 +
            opponentOVR *
            35 +
            fightRandomInt(
                0,
                800
            )
        )
        :
        fightRandomInt(
            100,
            300
        );


    const winBonus =
        professional
        ?
        Math.round(
            300 +
            opponentOVR *
            20 +
            fightRandomInt(
                0,
                500
            )
        )
        :
        fightRandomInt(
            50,
            150
        );


    return {

        eventName:
            eventName,

        opponentName:
            opponentName,

        opponentOVR:
            opponentOVR,

        opponentStyle:
            opponentStyle,

        purse:
            purse,

        winBonus:
            winBonus,

        weeksRemaining:
            professional
            ? 4
            : 3,

        rounds:
            3,

        titleFight:
            false

    };

}


/* =========================================================
   PROCESSAR OFERTA AUTOMÁTICA
========================================================= */

function processManagerFightOffer() {

    const player =
        ensureFightStructures();


    if (!player) {
        return;
    }


    if (
        player.nextFight
    ) {

        return;

    }


    if (
        player.managerFightOffer
    ) {

        return;

    }


    if (
        fightChance(
            0.35
        )
    ) {

        player.managerFightOffer =
            generateFightOffer();


        player.log.unshift(
            "📩 Seu empresário encontrou uma nova oportunidade de luta."
        );


        fightSave();

    }

}


/* =========================================================
   FUNÇÃO LEGADA / COMPATIBILIDADE
========================================================= */

function openFight() {

    fightScreen();

}


function startNextFight() {

    startFight();

}


/* =========================================================
   EXPORTAR GLOBALMENTE
========================================================= */

window.fightScreen =
    fightScreen;


window.startFight =
    startFight;


window.openFight =
    openFight;


window.startNextFight =
    startNextFight;


window.beginFightRounds =
    beginFightRounds;


window.fightAction =
    fightAction;


window.setFightStrategy =
    setFightStrategy;


window.toggleFightStrategyMenu =
    toggleFightStrategyMenu;


window.closeFightAndReturnHome =
    closeFightAndReturnHome;


window.processFightRecovery =
    processFightRecovery;


window.createManualFight =
    createManualFight;


window.acceptManagerFightOffer =
    acceptManagerFightOffer;


window.declineManagerFightOffer =
    declineManagerFightOffer;


window.generateFightOffer =
    generateFightOffer;


window.processManagerFightOffer =
    processManagerFightOffer;


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

ensureFightStructures();


console.log(
    "🥊 MMA LIFE DYNASTY — FIGHT ENGINE GIGANTE CARREGADO."
);
