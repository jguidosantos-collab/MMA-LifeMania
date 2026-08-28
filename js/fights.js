/* =========================================================
   MMA LIFE DYNASTY
   FIGHTS.JS
   MOTOR DE LUTAS + INTEGRAÇÃO COM EMPRESÁRIO
   VERSÃO ATUALIZADA
========================================================= */


/* =========================================================
   ESTADO GLOBAL
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


/* =========================================================
   OBTER OVERALL DO JOGADOR
========================================================= */

function fightGetPlayerOverall() {

    const player =
        fightPlayer();

    if (
        typeof window.getOverall ===
        "function"
    ) {

        const overall =
            Number(
                window.getOverall()
            );

        if (
            Number.isFinite(overall) &&
            overall > 0
        ) {

            return overall;

        }

    }

    if (
        typeof player.overall ===
        "number"
    ) {

        return player.overall;

    }

    return 45;

}


/* =========================================================
   OBTER ADVERSÁRIO DA LUTA
   REGRA FUNDAMENTAL:
   NÃO PROCURAR OUTRO LUTADOR SE
   nextFight.opponent JÁ EXISTE.
========================================================= */

/* =========================================================
   OBTER ADVERSÁRIO DA LUTA
   VERSÃO COMPATÍVEL COM TODOS OS FORMATOS
   Prioridade:
   1. nextFight.opponent
   2. nextFight.opponentData
   3. dados antigos salvos diretamente em nextFight
   4. mmaWorld.fighters como último fallback
   IMPORTANTE:
   Nunca gerar um novo adversário aqui.
   O adversário da luta deve permanecer o mesmo.
========================================================= */
function getCurrentFightOpponent() {
    const player =
        fightPlayer();
    const fight =
        player?.nextFight;
    if (!fight) {
        return null;
    }
    /* =====================================================
       1. FORMATO ATUAL
       nextFight.opponent
    ===================================================== */
    if (
        fight.opponent &&
        typeof fight.opponent === "object"
    ) {
        return fight.opponent;
    }
    /* =====================================================
       2. FORMATO ANTIGO
       nextFight.opponentData
    ===================================================== */
    if (
        fight.opponentData &&
        typeof fight.opponentData === "object"
    ) {
        return fight.opponentData;
    }
    /* =====================================================
       3. MIGRAÇÃO DE SAVE ANTIGO
       Alguns saves possuem somente:
       opponentName
       opponentOverall
       opponentPower
       opponentStyle
       opponentAge
       etc.
       Nesse caso reconstruímos o objeto.
    ===================================================== */
    const opponentName =
        fight.opponentName ||
        fight.opponentDisplayName ||
        fight.opponent_name;
    if (opponentName) {
        let opponentOverall =
            Number(
                fight.opponentOverall
            );
        if (
            !Number.isFinite(opponentOverall) ||
            opponentOverall <= 0
        ) {
            opponentOverall =
                Number(
                    fight.opponentPower
                );
        }
        if (
            !Number.isFinite(opponentOverall) ||
            opponentOverall <= 0
        ) {
            opponentOverall = 45;
        }
        opponentOverall =
            fightClamp(
                Math.round(
                    opponentOverall
                ),
                30,
                99
            );
        const opponent = {
            id:
                fight.opponentId ||
                (
                    "OPP-LEGACY-" +
                    Date.now() +
                    "-" +
                    fightRandomInt(
                        1000,
                        9999
                    )
                ),
            name:
                opponentName,
            displayName:
                opponentName,
            overall:
                opponentOverall,
            power:
                opponentOverall,
            age:
                Number.isFinite(
                    Number(
                        fight.opponentAge
                    )
                )
                    ?
                    Number(
                        fight.opponentAge
                    )
                    :
                    25,
            country:
                fight.opponentCountry ||
                player.country ||
                "Brasil",
            style:
                fight.opponentStyle ||
                "Completo",
            wins:
                Number.isFinite(
                    Number(
                        fight.opponentWins
                    )
                )
                    ?
                    Number(
                        fight.opponentWins
                    )
                    :
                    0,
            losses:
                Number.isFinite(
                    Number(
                        fight.opponentLosses
                    )
                )
                    ?
                    Number(
                        fight.opponentLosses
                    )
                    :
                    0,
            draws:
                Number.isFinite(
                    Number(
                        fight.opponentDraws
                    )
                )
                    ?
                    Number(
                        fight.opponentDraws
                    )
                    :
                    0
        };
        /* =================================================
           GRAVAR A MIGRAÇÃO NA PRÓPRIA LUTA
        ================================================= */
        fight.opponent =
            opponent;
        fight.opponentName =
            opponent.name;
        fight.opponentDisplayName =
            opponent.displayName;
        fight.opponentOverall =
            opponent.overall;
        fight.opponentPower =
            opponent.power;
        /*
           Salvar imediatamente para que
           o problema não volte no próximo reload.
        */
        try {
            if (
                typeof window.saveGame ===
                "function"
            ) {
                window.saveGame();
            }
            else if (
                typeof window.save ===
                "function"
            ) {
                window.save();
            }
        }
        catch (error) {
            console.warn(
                "Não foi possível salvar a migração do adversário:",
                error
            );
        }
        return opponent;
    }
    /* =====================================================
       4. ÚLTIMO FALLBACK
       Procurar no mundo de lutadores.
    ===================================================== */
    if (
        typeof window.mmaWorld !==
        "undefined" &&
        Array.isArray(
            window.mmaWorld.fighters
        )
    ) {
        const found =
            window.mmaWorld.fighters.find(
                function(fighter) {
                    return (
                        fighter.name ===
                        fight.opponentName ||
                        fighter.displayName ===
                        fight.opponentName
                    );
                }
            );
        if (found) {
            fight.opponent =
                found;
            fight.opponentName =
                found.displayName ||
                found.name;
            fight.opponentOverall =
                Number(
                    found.overall ||
                    found.power ||
                    45
                );
            fight.opponentPower =
                fight.opponentOverall;
            try {
                if (
                    typeof window.saveGame ===
                    "function"
                ) {
                    window.saveGame();
                }
            }
            catch (error) {}
            return found;
        }
    }
    return null;
}

/* =========================================================
   NORMALIZAR ADVERSÁRIO
========================================================= */

function normalizeFightOpponent() {

    const player =
        fightPlayer();

    const fight =
        player.nextFight;

    if (!fight) {

        return null;

    }

    let opponent =
        getCurrentFightOpponent();


    /* =====================================================
       PROTEÇÃO CONTRA O PROBLEMA OVR 0
    ===================================================== */

    if (!opponent) {

        return null;

    }


    let power =
        Number(
            opponent.power
        );

    if (
        !Number.isFinite(power) ||
        power <= 0
    ) {

        power =
            Number(
                opponent.overall
            );

    }

    if (
        !Number.isFinite(power) ||
        power <= 0
    ) {

        power = 45;

    }


    opponent.power =
        fightClamp(
            power,
            1,
            99
        );

    opponent.overall =
        opponent.power;


    if (
        !opponent.name &&
        opponent.displayName
    ) {

        opponent.name =
            opponent.displayName;

    }


    if (
        !opponent.displayName &&
        opponent.name
    ) {

        opponent.displayName =
            opponent.name;

    }


    if (!opponent.name) {

        opponent.name =
            "Adversário";

    }


    if (!opponent.style) {

        opponent.style =
            "Completo";

    }


    if (
        typeof opponent.age !==
        "number"
    ) {

        opponent.age = 25;

    }


    if (
        typeof opponent.wins !==
        "number"
    ) {

        opponent.wins = 0;

    }


    if (
        typeof opponent.losses !==
        "number"
    ) {

        opponent.losses = 0;

    }


    if (
        typeof opponent.draws !==
        "number"
    ) {

        opponent.draws = 0;

    }


    /*
       GRAVAR NOVAMENTE NA LUTA.
       ASSIM O ADVERSÁRIO FICA PRESO
       ÀQUELA LUTA.
    */

    fight.opponent =
        opponent;

    fight.opponentName =
        opponent.displayName ||
        opponent.name;

    fight.opponentOverall =
        opponent.overall;

    fight.opponentPower =
        opponent.power;


    return opponent;

}


/* =========================================================
   VERIFICAR DIA DA LUTA
========================================================= */

function fightIsFightDay() {

    const player =
        fightPlayer();

    const fight =
        player.nextFight;

    if (!fight) {

        return false;

    }


    if (
        fight.status ===
        "fight_day"
    ) {

        return true;

    }


    if (
        typeof fight.weeksRemaining ===
        "number" &&
        fight.weeksRemaining <= 0
    ) {

        return true;

    }


    if (
        typeof fight.fightWeek ===
        "number" &&
        Number(player.week) >=
        Number(fight.fightWeek)
    ) {

        return true;

    }


    return false;

}


/* =========================================================
   GERAR ATRIBUTOS TEMPORÁRIOS DO ADVERSÁRIO
========================================================= */

function buildOpponentStats(
    opponent
) {

    const overall =
        Number(
            opponent.overall ||
            opponent.power ||
            45
        );

    const base =
        fightClamp(
            overall,
            30,
            99
        );

    return {

        strength:
            fightClamp(
                base +
                fightRandomInt(
                    -8,
                    8
                ),
                20,
                100
            ),

        striking:
            fightClamp(
                base +
                fightRandomInt(
                    -8,
                    8
                ),
                20,
                100
            ),

        wrestling:
            fightClamp(
                base +
                fightRandomInt(
                    -8,
                    8
                ),
                20,
                100
            ),

        grappling:
            fightClamp(
                base +
                fightRandomInt(
                    -8,
                    8
                ),
                20,
                100
            ),

        cardio:
            fightClamp(
                base +
                fightRandomInt(
                    -8,
                    8
                ),
                20,
                100
            ),

        technique:
            fightClamp(
                base +
                fightRandomInt(
                    -8,
                    8
                ),
                20,
                100
            ),

        defense:
            fightClamp(
                base +
                fightRandomInt(
                    -8,
                    8
                ),
                20,
                100
            ),

        fightIQ:
            fightClamp(
                base +
                fightRandomInt(
                    -8,
                    8
                ),
                20,
                100
            ),

        chin:
            fightClamp(
                base +
                fightRandomInt(
                    -8,
                    8
                ),
                20,
                100
            ),

        offense:
            fightClamp(
                base +
                fightRandomInt(
                    -8,
                    8
                ),
                20,
                100
            ),

        blocking:
            fightClamp(
                base +
                fightRandomInt(
                    -8,
                    8
                ),
                20,
                100
            )

    };

}


/* =========================================================
   CRIAR ESTADO DA LUTA
========================================================= */

function createFightState() {

    const player =
        fightPlayer();

    const fight =
        player.nextFight;

    if (!fight) {

        return null;

    }


    const opponent =
        normalizeFightOpponent();

    if (!opponent) {

        return null;

    }


    const playerOverall =
        fightGetPlayerOverall();


    return {

        round: 1,

        maxRounds:
            fight.maxRounds ||
            3,

        playerScore: 0,

        opponentScore: 0,

        playerHealth:
            fightClamp(
                Number(
                    player.health ||
                    100
                ),
                1,
                100
            ),

        opponentHealth: 100,

        playerStamina:
            fightClamp(
                100 -
                Number(
                    player.fatigue ||
                    0
                ),
                20,
                100
            ),

        opponentStamina: 100,

        playerDamage: 0,

        opponentDamage: 0,

        momentum: 0,

        playerMomentum: 0,

        opponentMomentum: 0,

        roundHistory: [],

        log: [],

        playerOverall:
            playerOverall,

        opponentOverall:
            Number(
                opponent.overall ||
                opponent.power ||
                45
            ),

        opponent:
            opponent,

        opponentStats:
            buildOpponentStats(
                opponent
            ),

        finished: false,

        result: null,

        phase:
            "pre_fight"

    };

}


/* =========================================================
   TELA DE LUTA
========================================================= */

function fightScreen() {

    const player =
        fightPlayer();

    const content =
        fightContent();

    if (!content) {

        return;

    }


    if (!player.nextFight) {

        content.innerHTML = `

            <div class="card">

                <div class="title">
                    ⚔️ LUTA
                </div>

                <p>
                    Você não possui uma luta
                    marcada.
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


    if (!fightIsFightDay()) {

        const fight =
            player.nextFight;

        const weeks =
            Math.max(
                0,
                Number(
                    fight.fightWeek ||
                    player.week
                ) -
                Number(
                    player.week
                )
            );

        content.innerHTML = `

            <div class="card">

                <div class="title">
                    🏋️ CAMP DE LUTA
                </div>

                <p>
                    Sua luta ainda não chegou.
                </p>

                <div class="statline">
                    <span>
                        Adversário
                    </span>

                    <b>
                        ${
                            fight.opponentName ||
                            (
                                fight.opponent &&
                                (
                                    fight.opponent.displayName ||
                                    fight.opponent.name
                                )
                            ) ||
                            "A definir"
                        }
                    </b>
                </div>

                <div class="statline">
                    <span>
                        OVR
                    </span>

                    <b>
                        ${
                            (
                                fight.opponent &&
                                (
                                    fight.opponent.overall ||
                                    fight.opponent.power
                                )
                            ) ||
                            0
                        }
                    </b>
                </div>

                <div class="statline">
                    <span>
                        Camp
                    </span>

                    <b>
                        ${weeks} semanas
                    </b>
                </div>

                <p>
                    Continue sua preparação.
                    A luta ficará bloqueada
                    até o dia correto.
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


    const opponent =
        normalizeFightOpponent();


    /* =====================================================
       CORREÇÃO DEFINITIVA
       NÃO PERMITIR FIGHT COM OVR 0
    ===================================================== */

    if (!opponent) {

        content.innerHTML = `

            <div class="card">

                <div class="title">
                    ⚠️ ERRO NA LUTA
                </div>

                <p>
                    O adversário desta luta
                    não foi carregado.
                </p>

                <p>
                    A luta não será iniciada
                    para evitar um combate
                    com OVR 0.
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


    const opponentOverall =
        Number(
            opponent.overall ||
            opponent.power ||
            45
        );


    content.innerHTML = `

        <div class="card fight-header">

            <div class="title">
                🚨 DIA DA LUTA
            </div>

            <p>
                É hora de lutar.
            </p>

        </div>


        <div class="card">

            <div class="title">
                🥊 SEU LUTADOR
            </div>

            <div class="statline">

                <span>
                    ${player.name || "Lutador"}
                </span>

                <b>
                    OVR ${fightGetPlayerOverall()}
                </b>

            </div>

            <div class="statline">

                <span>
                    Saúde
                </span>

                <b>
                    ${Math.round(
                        player.health ||
                        100
                    )}%
                </b>

            </div>

            <div class="statline">

                <span>
                    Fadiga
                </span>

                <b>
                    ${Math.round(
                        player.fatigue ||
                        0
                    )}%
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                ⚔️ ADVERSÁRIO
            </div>

            <div class="statline">

                <span>
                    Nome
                </span>

                <b>
                    ${
                        opponent.displayName ||
                        opponent.name
                    }
                </b>

            </div>

            <div class="statline">

                <span>
                    OVR
                </span>

                <b>
                    ${opponentOverall}
                </b>

            </div>

            <div class="statline">

                <span>
                    Estilo
                </span>

                <b>
                    ${opponent.style || "Completo"}
                </b>

            </div>

            <div class="statline">

                <span>
                    Recorde
                </span>

                <b>
                    ${
                        opponent.wins || 0
                    }-
                    ${
                        opponent.losses || 0
                    }-
                    ${
                        opponent.draws || 0
                    }
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                💰 CONTRATO DA LUTA
            </div>

            <div class="statline">

                <span>
                    Bolsa
                </span>

                <b>
                    $${Math.round(
                        player.nextFight.purse ||
                        0
                    )}
                </b>

            </div>

            <div class="statline">

                <span>
                    Bônus por vitória
                </span>

                <b>
                    $${Math.round(
                        player.nextFight.winBonus ||
                        0
                    )}
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                🥊 COMEÇAR COMBATE
            </div>

            <button
                class="green"
                onclick="startFight()">

                👊 LUTAR AGORA

            </button>

            <button
                class="gray"
                onclick="home()">

                ← VOLTAR

            </button>

        </div>

    `;

}


/* =========================================================
   INICIAR LUTA
========================================================= */

function startFight() {

    const player =
        fightPlayer();

    if (!player.nextFight) {

        alert(
            "Você não possui uma luta marcada."
        );

        return;

    }


    if (!fightIsFightDay()) {

        alert(
            "A luta ainda não chegou ao dia marcado."
        );

        return;

    }


    const opponent =
        normalizeFightOpponent();

    if (!opponent) {

        alert(
            "O adversário não foi carregado corretamente."
        );

        return;

    }


    /*
       GARANTIR QUE O OVR NUNCA SEJA ZERO
    */

    if (
        !opponent.overall ||
        Number(
            opponent.overall
        ) <= 0
    ) {

        opponent.overall =
            Number(
                opponent.power ||
                45
            );

    }


    window.mmaFight =
        createFightState();


    if (!window.mmaFight) {

        alert(
            "Não foi possível iniciar a luta."
        );

        return;

    }


    window.mmaFight.phase =
        "round";


    renderFightRound();

}


/* =========================================================
   RENDER ROUND
========================================================= */

function renderFightRound() {

    const content =
        fightContent();

    const state =
        window.mmaFight;

    if (
        !content ||
        !state
    ) {

        return;

    }


    if (state.finished) {

        renderFightResult();

        return;

    }


    const opponent =
        state.opponent;


    content.innerHTML = `

        <div class="card">

            <div class="title">
                🥊 ROUND ${state.round}
            </div>

            <div class="statline">

                <span>
                    ${fightPlayer().name}
                </span>

                <b>
                    OVR ${state.playerOverall}
                </b>

            </div>

            <div class="statline">

                <span>
                    ${opponent.displayName || opponent.name}
                </span>

                <b>
                    OVR ${state.opponentOverall}
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                ❤️ SAÚDE
            </div>

            <div class="statline">

                <span>
                    Você
                </span>

                <b>
                    ${Math.round(
                        state.playerHealth
                    )}%
                </b>

            </div>

            <div class="statline">

                <span>
                    Adversário
                </span>

                <b>
                    ${Math.round(
                        state.opponentHealth
                    )}%
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                ⚡ STAMINA
            </div>

            <div class="statline">

                <span>
                    Você
                </span>

                <b>
                    ${Math.round(
                        state.playerStamina
                    )}%
                </b>

            </div>

            <div class="statline">

                <span>
                    Adversário
                </span>

                <b>
                    ${Math.round(
                        state.opponentStamina
                    )}%
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                🎯 ESCOLHA SUA AÇÃO
            </div>

            <button
                class="main-button"
                onclick="fightAction('striking')">

                👊 STRIKING

            </button>

            <button
                class="main-button"
                onclick="fightAction('wrestling')">

                🤼 QUEDA / WRESTLING

            </button>

            <button
                class="main-button"
                onclick="fightAction('grappling')">

                🥋 GRAPPLING

            </button>

            <button
                class="main-button"
                onclick="fightAction('defense')">

                🛡️ DEFESA

            </button>

            <button
                class="main-button"
                onclick="fightAction('cardio')">

                🫁 CONTROLAR RITMO

            </button>

        </div>


        <div class="card">

            <div class="title">
                📋 ROUND
            </div>

            <div id="fightLog">

                Escolha sua ação.

            </div>

        </div>

    `;

}


/* =========================================================
   EXECUTAR AÇÃO
========================================================= */

function fightAction(
    action
) {

    const state =
        window.mmaFight;

    const player =
        fightPlayer();

    if (
        !state ||
        state.finished
    ) {

        return;

    }


    const opponent =
        state.opponent;

    const attributes =
        player.attributes || {};


    let playerPower =
        state.playerOverall;

    let opponentPower =
        state.opponentOverall;


    let actionName =
        "ação";


    switch (action) {

        case "striking":

            playerPower =
                Number(
                    attributes.striking ||
                    45
                ) +
                Number(
                    attributes.offense ||
                    45
                ) * 0.35 +
                Number(
                    attributes.technique ||
                    45
                ) * 0.35;

            actionName =
                "👊 Striking";

            break;


        case "wrestling":

            playerPower =
                Number(
                    attributes.wrestling ||
                    45
                ) +
                Number(
                    attributes.strength ||
                    45
                ) * 0.4 +
                Number(
                    attributes.fightIQ ||
                    40
                ) * 0.3;

            actionName =
                "🤼 Wrestling";

            break;


        case "grappling":

            playerPower =
                Number(
                    attributes.grappling ||
                    45
                ) +
                Number(
                    attributes.technique ||
                    45
                ) * 0.4 +
                Number(
                    attributes.fightIQ ||
                    40
                ) * 0.3;

            actionName =
                "🥋 Grappling";

            break;


        case "defense":

            playerPower =
                Number(
                    attributes.defense ||
                    45
                ) +
                Number(
                    attributes.blocking ||
                    45
                ) * 0.5 +
                Number(
                    attributes.chin ||
                    45
                ) * 0.25;

            actionName =
                "🛡️ Defesa";

            break;


        case "cardio":

            playerPower =
                Number(
                    attributes.cardio ||
                    45
                ) +
                Number(
                    attributes.fightIQ ||
                    40
                ) * 0.4;

            actionName =
                "🫁 Controle de ritmo";

            break;

    }


    const opponentStats =
        state.opponentStats;


    if (action === "striking") {

        opponentPower =
            (
                opponentStats.striking +
                opponentStats.defense +
                opponentStats.chin
            ) / 3;

    }

    else if (
        action === "wrestling"
    ) {

        opponentPower =
            (
                opponentStats.wrestling +
                opponentStats.strength +
                opponentStats.defense
            ) / 3;

    }

    else if (
        action === "grappling"
    ) {

        opponentPower =
            (
                opponentStats.grappling +
                opponentStats.technique +
                opponentStats.defense
            ) / 3;

    }

    else if (
        action === "defense"
    ) {

        opponentPower =
            (
                opponentStats.offense +
                opponentStats.striking
            ) / 2;

    }

    else {

        opponentPower =
            opponentStats.cardio;

    }


    playerPower =
        Number(playerPower) *
        fightRandom(
            0.85,
            1.15
        );


    opponentPower =
        Number(opponentPower) *
        fightRandom(
            0.85,
            1.15
        );


    /*
       FADIGA
    */

    const playerFatigue =
        Number(
            player.fatigue ||
            0
        );


    playerPower -=
        playerFatigue *
        0.18;


    playerPower +=
        state.playerMomentum *
        0.5;


    opponentPower +=
        state.opponentMomentum *
        0.5;


    /*
       RESULTADO DO MOMENTO
    */

    let playerDamage =
        0;

    let opponentDamage =
        0;


    if (
        playerPower >=
        opponentPower
    ) {

        const advantage =
            playerPower -
            opponentPower;

        playerDamage =
            fightClamp(
                3 +
                advantage *
                0.12 +
                fightRandom(
                    0,
                    5
                ),
                1,
                18
            );

        opponentDamage =
            fightClamp(
                2 +
                advantage *
                0.05 +
                fightRandom(
                    0,
                    4
                ),
                0,
                10
            );

        state.playerScore +=
            1;

        state.playerMomentum =
            fightClamp(
                state.playerMomentum +
                2,
                -10,
                10
            );

        state.opponentMomentum =
            fightClamp(
                state.opponentMomentum -
                1,
                -10,
                10
            );

    }

    else {

        const advantage =
            opponentPower -
            playerPower;

        opponentDamage =
            fightClamp(
                3 +
                advantage *
                0.12 +
                fightRandom(
                    0,
                    5
                ),
                1,
                18
            );

        playerDamage =
            fightClamp(
                2 +
                advantage *
                0.05 +
                fightRandom(
                    0,
                    4
                ),
                0,
                10
            );

        state.opponentScore +=
            1;

        state.opponentMomentum =
            fightClamp(
                state.opponentMomentum +
                2,
                -10,
                10
            );

        state.playerMomentum =
            fightClamp(
                state.playerMomentum -
                1,
                -10,
                10
            );

    }


    /*
       DEFESA REDUZ DANO
    */

    if (
        action === "defense"
    ) {

        playerDamage *=
            0.45;

    }


    /*
       CARDIO REDUZ CONSUMO
    */

    if (
        action === "cardio"
    ) {

        playerDamage *=
            0.75;

        player.fatigue =
            Math.max(
                0,
                playerFatigue - 4
            );

    }


    /*
       STAMINA
    */

    const staminaCost = {

        striking: 7,

        wrestling: 10,

        grappling: 9,

        defense: 4,

        cardio: 2

    }[action] || 6;


    state.playerStamina =
        Math.max(
            0,
            state.playerStamina -
            staminaCost
        );


    state.opponentStamina =
        Math.max(
            0,
            state.opponentStamina -
            fightRandom(
                4,
                8
            )
        );


    /*
       APLICAR DANO
    */

    state.playerHealth =
        Math.max(
            0,
            state.playerHealth -
            opponentDamage
        );


    state.opponentHealth =
        Math.max(
            0,
            state.opponentHealth -
            playerDamage
        );


    state.playerDamage +=
        opponentDamage;


    state.opponentDamage +=
        playerDamage;


    state.roundHistory.push({

        round:
            state.round,

        action:
            action,

        playerDamage:
            playerDamage,

        opponentDamage:
            opponentDamage,

        playerScore:
            state.playerScore,

        opponentScore:
            state.opponentScore

    });


    state.log.push(
        `${actionName}: você causou ${Math.round(playerDamage)} de dano e recebeu ${Math.round(opponentDamage)}.`
    );


    /*
       KO / TKO
    */

    if (
        state.opponentHealth <=
        0
    ) {

        finishFight(
            "KO",
            "player"
        );

        return;

    }


    if (
        state.playerHealth <=
        0
    ) {

        finishFight(
            "KO",
            "opponent"
        );

        return;

    }


    /*
       FIM DO ROUND
    */

    if (
        state.round >=
        state.maxRounds
    ) {

        finishFight(
            "decision"
        );

        return;

    }


    state.round +=
        1;


    renderFightRound();

}


/* =========================================================
   FINALIZAR LUTA
========================================================= */

function finishFight(
    method,
    winner
) {

    const state =
        window.mmaFight;

    const player =
        fightPlayer();

    if (
        !state ||
        state.finished
    ) {

        return;

    }


    state.finished =
        true;


    let result =
        "draw";


    if (
        winner ===
        "player"
    ) {

        result =
            "win";

    }

    else if (
        winner ===
        "opponent"
    ) {

        result =
            "loss";

    }

    else {

        if (
            state.playerScore >
            state.opponentScore
        ) {

            result =
                "win";

        }

        else if (
            state.opponentScore >
            state.playerScore
        ) {

            result =
                "loss";

        }

        else {

            result =
                "draw";

        }

    }


    state.result = {

        result:
            result,

        method:
            method,

        playerScore:
            state.playerScore,

        opponentScore:
            state.opponentScore

    };


    applyFightResult(
        result,
        method
    );


    renderFightResult();

}


/* =========================================================
   APLICAR RESULTADO AO JOGADOR
========================================================= */

function applyFightResult(
    result,
    method
) {

    const player =
        fightPlayer();

    const fight =
        player.nextFight;

    if (!fight) {

        return;

    }


    const pro =
        player.professional ||
        {};

    const amateur =
        player.amateur ||
        {};


    /*
       VERIFICAR SE É PROFISSIONAL
    */

    const isProfessional =
        pro.active === true;


    if (isProfessional) {

        if (result === "win") {

            pro.wins =
                Number(
                    pro.wins || 0
                ) + 1;

        }

        else if (
            result === "loss"
        ) {

            pro.losses =
                Number(
                    pro.losses || 0
                ) + 1;

        }

        else {

            pro.draws =
                Number(
                    pro.draws || 0
                ) + 1;

        }

    }

    else {

        if (result === "win") {

            amateur.wins =
                Number(
                    amateur.wins || 0
                ) + 1;

        }

        else if (
            result === "loss"
        ) {

            amateur.losses =
                Number(
                    amateur.losses || 0
                ) + 1;

        }

        else {

            amateur.draws =
                Number(
                    amateur.draws || 0
                ) + 1;

        }

    }


    /*
       DINHEIRO
    */

    const purse =
        Number(
            fight.purse ||
            0
        );

    const winBonus =
        Number(
            fight.winBonus ||
            0
        );


    let income =
        purse;


    if (
        result ===
        "win"
    ) {

        income +=
            winBonus;

    }


    player.money =
        Number(
            player.money ||
            0
        ) +
        income;


    /*
       FAMA
    */

    if (
        result ===
        "win"
    ) {

        player.fame =
            Number(
                player.fame ||
                0
            ) +
            3;

    }

    else if (
        result ===
        "loss"
    ) {

        player.fame =
            Math.max(
                0,
                Number(
                    player.fame ||
                    0
                ) - 1
            );

    }


    /*
       SAÚDE PÓS-LUTA
    */

    player.health =
        fightClamp(
            Number(
                player.health ||
                100
            ) -
            stateDamageForRecovery(),
            30,
            100
        );


    /*
       FADIGA
    */

    player.fatigue =
        fightClamp(
            Number(
                player.fatigue ||
                0
            ) + 25,
            0,
            100
        );


    /*
       HISTÓRICO
    */

    player.log =
        player.log ||
        [];


    const opponentName =
        fight.opponentName ||
        (
            fight.opponent &&
            (
                fight.opponent.displayName ||
                fight.opponent.name
            )
        ) ||
        "Adversário";


    if (
        result ===
        "win"
    ) {

        player.log.unshift(
            `🏆 Vitória por ${method} contra ${opponentName}. Bolsa: $${Math.round(income)}.`
        );

    }

    else if (
        result ===
        "loss"
    ) {

        player.log.unshift(
            `❌ Derrota por ${method} contra ${opponentName}.`
        );

    }

    else {

        player.log.unshift(
            `🤝 Empate contra ${opponentName}.`
        );

    }


    /*
       ATUALIZAR CONTRATO
    */

    if (
        typeof window.processContractFight ===
        "function"
    ) {

        try {

            window.processContractFight(
                result,
                income
            );

        }
        catch (error) {

            console.error(
                "Erro no contrato:",
                error
            );

        }

    }


    /*
       ATUALIZAR RANKING
    */

    if (
        typeof window.processRankingFight ===
        "function"
    ) {

        try {

            window.processRankingFight(
                result
            );

        }
        catch (error) {

            console.error(
                "Erro no ranking:",
                error
            );

        }

    }


    /*
       EMPRESÁRIO:
       ENCERRA A LUTA.
    */

    if (
        typeof window.completeManagerFight ===
        "function"
    ) {

        try {

            window.completeManagerFight({

                result:
                    result,

                method:
                    method,

                opponent:
                    opponentName,

                income:
                    income

            });

        }
        catch (error) {

            console.error(
                "Erro ao finalizar luta do empresário:",
                error
            );

        }

    }

    else {

        /*
           FALLBACK
        */

        player.nextFight =
            null;

    }


    fightSave();

}


/* =========================================================
   DANO PARA RECUPERAÇÃO
========================================================= */

function stateDamageForRecovery() {

    const state =
        window.mmaFight;

    if (!state) {

        return 5;

    }


    const damage =
        Number(
            state.playerDamage ||
            0
        );


    return fightClamp(
        damage * 0.12,
        3,
        25
    );

}


/* =========================================================
   TELA DO RESULTADO
========================================================= */

function renderFightResult() {

    const content =
        fightContent();

    const state =
        window.mmaFight;


    if (
        !content ||
        !state ||
        !state.result
    ) {

        return;

    }


    const player =
        fightPlayer();

    const fight =
        player.nextFight;


    const result =
        state.result;


    let title =
        "🤝 EMPATE";


    if (
        result.result ===
        "win"
    ) {

        title =
            "🏆 VITÓRIA";

    }

    else if (
        result.result ===
        "loss"
    ) {

        title =
            "❌ DERROTA";

    }


    /*
       ATENÇÃO:
       completeManagerFight já pode ter
       limpado nextFight.
       Por isso pegamos os dados do state.
    */

    const opponentName =
        state.opponent &&
        (
            state.opponent.displayName ||
            state.opponent.name
        )
        ||
        "Adversário";


    const income =
        result.result ===
        "win"
        ?
        Number(
            (
                player.lastFightIncome ||
                0
            )
        )
        :
        Number(
            (
                player.lastFightIncome ||
                0
            )
        );


    content.innerHTML = `

        <div class="card">

            <div class="title">
                ${title}
            </div>

            <p>
                ${player.name}
                vs
                ${opponentName}
            </p>

            <div class="statline">

                <span>
                    Resultado
                </span>

                <b>
                    ${
                        result.result === "win"
                        ?
                        "VITÓRIA"
                        :
                        result.result === "loss"
                        ?
                        "DERROTA"
                        :
                        "EMPATE"
                    }
                </b>

            </div>

            <div class="statline">

                <span>
                    Método
                </span>

                <b>
                    ${result.method}
                </b>

            </div>

            <div class="statline">

                <span>
                    Placar
                </span>

                <b>
                    ${result.playerScore}
                    -
                    ${result.opponentScore}
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                💰 PAGAMENTO
            </div>

            <div class="statline">

                <span>
                    Bolsa
                </span>

                <b>
                    $${Math.round(
                        state.fightPurse ||
                        0
                    )}
                </b>

            </div>

            <div class="statline">

                <span>
                    Bônus
                </span>

                <b>
                    $${Math.round(
                        state.fightWinBonus ||
                        0
                    )}
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                📋 HISTÓRICO
            </div>

            ${
                state.log
                .slice(-8)
                .reverse()
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
            }

        </div>


        <div class="card">

            <button
                class="main-button"
                onclick="finishFightScreen()">

                🏠 CONTINUAR CARREIRA

            </button>

        </div>

    `;

}


/* =========================================================
   FINALIZAR TELA
========================================================= */

function finishFightScreen() {

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
   NEGOCIAÇÃO DE EVENTO GRANDE
========================================================= */

function isBigFightEvent(
    offer
) {

    if (!offer) {

        return false;

    }


    if (
        offer.bigEvent ===
        true
    ) {

        return true;

    }


    const name =
        String(
            offer.eventName ||
            ""
        ).toLowerCase();


    const bigWords = [

        "championship",

        "grand",

        "super",

        "ultimate",

        "world",

        "major",

        "elite",

        "final",

        "title",

        "premium",

        "main event"

    ];


    return bigWords.some(
        function(word) {

            return name.includes(
                word
            );

        }
    );

}


/* =========================================================
   CALCULAR BOLSA NEGOCIADA
========================================================= */

function calculateNegotiatedPurse(
    offer,
    requested
) {

    const player =
        fightPlayer();


    const current =
        Number(
            offer.purse ||
            0
        );


    const fame =
        Number(
            player.fame ||
            0
        );


    const overall =
        fightGetPlayerOverall();


    const maximum =
        Math.round(
            current *
            (
                1.15 +
                Math.min(
                    fame,
                    100
                ) *
                0.003 +
                Math.max(
                    0,
                    overall - 50
                ) *
                0.002
            )
        );


    return fightClamp(
        Math.round(
            requested
        ),
        current,
        maximum
    );

}


/* =========================================================
   NEGOCIAR OFERTA
========================================================= */

function negotiateManagerFightOffer() {

    const player =
        fightPlayer();

    const offer =
        player.managerFightOffer;


    if (!offer) {

        alert(
            "Não existe uma proposta para negociar."
        );

        return;

    }


    if (
        !isBigFightEvent(
            offer
        )
    ) {

        alert(
            "Esta luta não exige negociação especial."
        );

        return;

    }


    const currentPurse =
        Number(
            offer.purse ||
            0
        );


    const suggested =
        Math.round(
            currentPurse *
            1.15
        );


    const value =
        prompt(
            `A organização ofereceu $${currentPurse} de bolsa.\n\nQuanto você deseja pedir?`,
            String(
                suggested
            )
        );


    if (
        value ===
        null
    ) {

        return;

    }


    const requested =
        Number(
            String(
                value
            ).replace(
                ",",
                "."
            )
        );


    if (
        !Number.isFinite(
            requested
        ) ||
        requested <= 0
    ) {

        alert(
            "Digite um valor válido."
        );

        return;

    }


    const maximum =
        Math.round(
            currentPurse *
            1.35
        );


    if (
        requested >
        maximum
    ) {

        alert(
            `O empresário acha o pedido alto demais. Tente até aproximadamente $${maximum}.`
        );

        return;

    }


    const negotiated =
        calculateNegotiatedPurse(
            offer,
            requested
        );


    /*
       CHANCE DA NEGOCIAÇÃO SER ACEITA
    */

    const increase =
        negotiated -
        currentPurse;


    const difficulty =
        increase /
        Math.max(
            1,
            currentPurse
        );


    let chance =
        0.85 -
        difficulty *
        1.5;


    chance +=
        Number(
            player.manager &&
            player.manager.negotiation ||
            50
        ) *
        0.002;


    chance =
        fightClamp(
            chance,
            0.25,
            0.95
        );


    if (
        Math.random() <=
        chance
    ) {

        offer.purse =
            negotiated;

        offer.winBonus =
            Math.round(
                negotiated *
                0.5
            );


        offer.negotiated =
            true;

        offer.negotiatedPurse =
            negotiated;


        player.log =
            player.log ||
            [];


        player.log.unshift(
            `🤝 Negociação bem-sucedida! A bolsa subiu para $${negotiated}.`
        );


        fightSave();


        alert(
            `🤝 NEGOCIAÇÃO ACEITA!\n\nNova bolsa: $${negotiated}\nBônus por vitória: $${offer.winBonus}`
        );


        if (
            typeof window.home ===
            "function"
        ) {

            window.home();

        }

    }

    else {

        /*
           ORGANIZAÇÃO PODE MANTER
           A PROPOSTA ORIGINAL.
        */

        alert(
            "❌ A organização não aceitou o valor pedido. A proposta original continua disponível."
        );

    }

}


/* =========================================================
   RENDERIZAR PROPOSTA DO EMPRESÁRIO
   PODE SER USADO PELO MAIN/MANAGERS.
========================================================= */

function renderFightOfferDetails(
    offer
) {

    if (!offer) {

        return "";

    }


    const bigEvent =
        isBigFightEvent(
            offer
        );


    const opponent =
        offer.opponent ||
        {};


    const opponentName =
        offer.opponentName ||
        opponent.displayName ||
        opponent.name ||
        "Adversário";


    const opponentOverall =
        Number(
            opponent.overall ||
            opponent.power ||
            45
        );


    return `

        <div class="statline">

            <span>
                🥊 Adversário
            </span>

            <b>
                ${opponentName}
            </b>

        </div>


        <div class="statline">

            <span>
                OVR
            </span>

            <b>
                ${opponentOverall}
            </b>

        </div>


        <div class="statline">

            <span>
                📅 Evento
            </span>

            <b>
                ${
                    offer.eventName ||
                    "Evento MMA"
                }
            </b>

        </div>


        <div class="statline">

            <span>
                💰 Bolsa
            </span>

            <b>
                $${Math.round(
                    offer.purse ||
                    0
                )}
            </b>

        </div>


        <div class="statline">

            <span>
                🏆 Bônus por vitória
            </span>

            <b>
                $${Math.round(
                    offer.winBonus ||
                    0
                )}
            </b>

        </div>


        <div class="statline">

            <span>
                🏋️ Camp
            </span>

            <b>
                ${
                    offer.campWeeks ||
                    4
                } semanas
            </b>

        </div>


        ${
            bigEvent
            ?
            `
                <div class="card">

                    <div class="title">
                        👑 EVENTO GRANDE
                    </div>

                    <p>
                        Seu empresário acredita
                        que você tem poder de
                        negociação para aumentar
                        sua bolsa.
                    </p>

                    <button
                        class="main-button"
                        onclick="negotiateManagerFightOffer()">

                        💰 NEGOCIAR BOLSA

                    </button>

                </div>
            `
            :
            ""
        }

    `;

}


/* =========================================================
   EXPORTAR
========================================================= */

window.fightScreen =
    fightScreen;

window.startFight =
    startFight;

window.fightAction =
    fightAction;

window.finishFight =
    finishFight;

window.finishFightScreen =
    finishFightScreen;

window.getCurrentFightOpponent =
    getCurrentFightOpponent;

window.normalizeFightOpponent =
    normalizeFightOpponent;

window.negotiateManagerFightOffer =
    negotiateManagerFightOffer;

window.isBigFightEvent =
    isBigFightEvent;

window.renderFightOfferDetails =
    renderFightOfferDetails;


/* =========================================================
   GARANTIR DADOS DO PAGAMENTO
   Antes de finalizar a luta.
========================================================= */

const originalApplyFightResult =
    applyFightResult;


/*
   Guardar valores da luta no estado
   antes que o manager limpe nextFight.
*/

applyFightResult =
    function(
        result,
        method
    ) {

        const state =
            window.mmaFight;

        const player =
            fightPlayer();

        const fight =
            player.nextFight;


        if (state && fight) {

            state.fightPurse =
                Number(
                    fight.purse ||
                    0
                );

            state.fightWinBonus =
                Number(
                    fight.winBonus ||
                    0
                );

        }


        originalApplyFightResult(
            result,
            method
        );

    };


/* =========================================================
   FIM
========================================================= */
