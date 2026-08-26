/* =========================================================
   MMA LIFE DYNASTY
   FIGHT.JS
   SISTEMA DE LUTAS
========================================================= */


/* =========================================================
   UTILIDADES
========================================================= */

function fightGetPlayer() {

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


/* =========================================================
   GERAR ADVERSÁRIO
========================================================= */

function generateFightOpponent() {

    const player =
        fightGetPlayer();


    const playerOVR =
        typeof window.getOverall ===
        "function"
        ?
        window.getOverall()
        :
        50;


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
        "Eduardo Santos"

    ];


    const styles = [

        "Striker",
        "Wrestler",
        "Grappler",
        "Completo"

    ];


    const randomName =
        names[
            Math.floor(
                Math.random() * names.length
            )
        ];


    const randomStyle =
        styles[
            Math.floor(
                Math.random() * styles.length
            )
        ];


    /*
       O adversário fica próximo do nível
       do jogador para evitar lutas absurdas.
    */

    const variation =
        Math.floor(
            Math.random() * 15
        ) - 7;


    const power =
        Math.max(
            35,
            Math.min(
                95,
                playerOVR + variation
            )
        );


    return {

        displayName:
            randomName,

        name:
            randomName,

        power:
            power,

        ovr:
            power,

        style:
            randomStyle,

        country:
            "Brasil",

        wins:
            Math.floor(
                Math.random() * 8
            ),

        losses:
            Math.floor(
                Math.random() * 5
            ),

        draws:
            0

    };

}


/* =========================================================
   GERAR EVENTO
========================================================= */

function generateFightEvent() {

    const events = [

        "MMA NIGHT",
        "FIGHT NIGHT",
        "WARRIOR FC",
        "BRAZIL FIGHT",
        "MMA CHALLENGE",
        "COMBAT NIGHT",
        "RISING FIGHTERS"

    ];


    const eventName =
        events[
            Math.floor(
                Math.random() * events.length
            )
        ];


    return {

        name:
            eventName,

        venue:
            "Arena MMA",

        city:
            "São Paulo",

        country:
            "Brasil"

    };

}


/* =========================================================
   PROCURAR LUTA
========================================================= */

function searchFight() {

    const player =
        fightGetPlayer();


    if (!player) {
        return;
    }


    /*
       Se já existe luta marcada,
       não cria outra.
    */

    if (player.nextFight) {

        fightScreen();

        return;

    }


    const opponent =
        generateFightOpponent();


    const event =
        generateFightEvent();


    player.nextFight = {

        event:
            event,

        opponent:
            opponent,

        week:
            Number(
                player.week || 1
            ),

        year:
            Number(
                player.year || 2026
            )

    };


    player.log =
        player.log || [];


    player.log.unshift(

        `📅 Luta marcada contra ${opponent.displayName}.`

    );


    fightSave();


    fightScreen();

}


/* =========================================================
   TELA DE LUTA
========================================================= */

function fightScreen() {

    const player =
        fightGetPlayer();


    const content =
        document.getElementById(
            "content"
        );


    if (!content) {

        console.error(
            "Elemento #content não encontrado."
        );

        return;

    }


    if (!player) {

        content.innerHTML = `

            <div class="card">

                <div class="title">
                    ⚔️ LUTA
                </div>

                <p>
                    Nenhum lutador carregado.
                </p>

            </div>

        `;

        return;

    }


    /*
       Se não existe luta,
       mostra botão PROCURAR LUTA.
    */

    if (!player.nextFight) {

        content.innerHTML = `

            <div class="card">

                <div class="title">
                    ⚔️ LUTA
                </div>

                <p>
                    Você ainda não possui
                    uma luta marcada.
                </p>

                <p>
                    Procure um adversário
                    para continuar sua carreira.
                </p>


                <button
                    class="main-button"
                    onclick="searchFight()">

                    🔎 PROCURAR LUTA

                </button>


                <button
                    class="gray"
                    onclick="tab('home')">

                    ← VOLTAR

                </button>

            </div>

        `;

        return;

    }


    const fight =
        player.nextFight;


    const opponent =
        fight.opponent;


    const event =
        fight.event;


    const playerOVR =
        typeof window.getOverall ===
        "function"
        ?
        window.getOverall()
        :
        50;


    content.innerHTML = `

        <div class="card">

            <div class="title">
                ⚔️ PRÓXIMA LUTA
            </div>


            <div class="statline">

                <span>
                    Evento
                </span>

                <b>
                    ${event.name}
                </b>

            </div>


            <div class="statline">

                <span>
                    Local
                </span>

                <b>
                    ${event.city}
                </b>

            </div>


            <div class="statline">

                <span>
                    Data
                </span>

                <b>
                    Semana ${fight.week}
                    / ${fight.year}
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                🥊 CONFRONTO
            </div>


            <div class="fighter-card">

                <div class="fighter-avatar">
                    🥊
                </div>


                <div class="fighter-info">

                    <h2>
                        ${player.name || "Você"}
                    </h2>

                    <p>
                        ${player.country || "Brasil"}
                    </p>

                    <p>
                        OVR: <strong>
                            ${playerOVR}
                        </strong>
                    </p>

                </div>

            </div>


            <div style="
                text-align:center;
                font-size:28px;
                margin:15px 0;
            ">

                VS

            </div>


            <div class="fighter-card">

                <div class="fighter-avatar">
                    👊
                </div>


                <div class="fighter-info">

                    <h2>
                        ${opponent.displayName}
                    </h2>

                    <p>
                        ${opponent.country}
                    </p>

                    <p>
                        OVR: <strong>
                            ${opponent.power}
                        </strong>
                    </p>

                    <p>
                        Estilo:
                        ${opponent.style}
                    </p>

                </div>

            </div>

        </div>


        <div class="card">

            <div class="title">
                ❤️ SUA CONDIÇÃO
            </div>


            <div class="statline">

                <span>
                    Saúde
                </span>

                <b>
                    ${Math.round(
                        player.health || 100
                    )}%
                </b>

            </div>


            <div class="statline">

                <span>
                    Fadiga
                </span>

                <b>
                    ${Math.round(
                        player.fatigue || 0
                    )}%
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                👊 COMBATE
            </div>


            <p>
                A luta está marcada.
                Quando chegar a hora,
                você poderá entrar no combate.
            </p>


            <button
                class="main-button"
                onclick="simulateFight()">

                🥊 LUTAR AGORA

            </button>


            <button
                class="gray"
                onclick="tab('home')">

                ← VOLTAR

            </button>

        </div>

    `;

}


/* =========================================================
   SIMULAR LUTA
========================================================= */

function simulateFight() {

    const player =
        fightGetPlayer();


    if (
        !player ||
        !player.nextFight
    ) {

        fightScreen();

        return;

    }


    const opponent =
        player.nextFight.opponent;


    const playerOVR =
        typeof window.getOverall ===
        "function"
        ?
        window.getOverall()
        :
        50;


    const opponentOVR =
        Number(
            opponent.power || 50
        );


    /*
       Fatores extras deixam o resultado
       menos previsível.
    */

    const health =
        Number(
            player.health || 100
        );


    const fatigue =
        Number(
            player.fatigue || 0
        );


    const confidence =
        Number(
            player.confidence || 50
        );


    const playerScore =

        playerOVR

        +

        (
            health - 50
        ) * 0.10

        -

        fatigue * 0.10

        +

        (
            confidence - 50
        ) * 0.05

        +

        (
            Math.random() * 20 - 10
        );


    const opponentScore =

        opponentOVR

        +

        (
            Math.random() * 20 - 10
        );


    const playerWins =
        playerScore >= opponentScore;


    /*
       Garantir estruturas.
    */

    if (!player.professional) {

        player.professional = {

            active: false,
            wins: 0,
            losses: 0,
            draws: 0

        };

    }


    if (!player.amateur) {

        player.amateur = {

            wins: 0,
            losses: 0,
            draws: 0

        };

    }


    let record;


    /*
       Se já é profissional,
       a luta conta no profissional.
       Caso contrário, conta no amador.
    */

    if (
        player.professional.active
    ) {

        record =
            player.professional;

    }
    else {

        record =
            player.amateur;

    }


    let resultText;


    if (playerWins) {

        record.wins =
            Number(record.wins || 0) + 1;


        resultText =
            "🏆 VITÓRIA!";


        player.fame =
            Number(player.fame || 0) + 3;


        player.money =
            Number(player.money || 0) + 250;


        player.confidence =
            Math.min(
                100,
                Number(
                    player.confidence || 50
                ) + 8
            );


        player.log =
            player.log || [];


        player.log.unshift(

            `🏆 Vitória sobre ${opponent.displayName}.`

        );

    }
    else {

        record.losses =
            Number(record.losses || 0) + 1;


        resultText =
            "❌ DERROTA";


        player.fame =
            Math.max(
                0,
                Number(player.fame || 0) - 1
            );


        player.money =
            Number(player.money || 0) + 100;


        player.confidence =
            Math.max(
                0,
                Number(
                    player.confidence || 50
                ) - 8
            );


        player.log =
            player.log || [];


        player.log.unshift(

            `❌ Derrota para ${opponent.displayName}.`

        );

    }


    /*
       Dano e fadiga da luta.
    */

    player.health =
        Math.max(
            40,
            Number(player.health || 100) - 15
        );


    player.fatigue =
        Math.min(
            100,
            Number(player.fatigue || 0) + 35
        );


    /*
       A luta acabou.
    */

    player.nextFight =
        null;


    fightSave();


    showFightResult(
        resultText,
        opponent,
        playerWins
    );

}


/* =========================================================
   RESULTADO
========================================================= */

function showFightResult(
    resultText,
    opponent,
    playerWins
) {

    const player =
        fightGetPlayer();


    const content =
        document.getElementById(
            "content"
        );


    if (!content) {
        return;
    }


    const record =
        player.professional &&
        player.professional.active

        ?

        player.professional

        :

        player.amateur;


    content.innerHTML = `

        <div class="card">

            <div class="title">
                🥊 RESULTADO
            </div>


            <div style="
                text-align:center;
                font-size:32px;
                font-weight:bold;
                margin:25px 0;
            ">

                ${resultText}

            </div>


            <p style="
                text-align:center;
            ">

                ${player.name}

                <strong>
                    ${playerWins ? " venceu " : " perdeu para "}
                </strong>

                ${opponent.displayName}

            </p>

        </div>


        <div class="card">

            <div class="title">
                📊 NOVO RECORDE
            </div>


            <div class="statline">

                <span>
                    Vitórias
                </span>

                <b>
                    ${record.wins || 0}
                </b>

            </div>


            <div class="statline">

                <span>
                    Derrotas
                </span>

                <b>
                    ${record.losses || 0}
                </b>

            </div>


            <div class="statline">

                <span>
                    Empates
                </span>

                <b>
                    ${record.draws || 0}
                </b>

            </div>


            <div class="statline">

                <span>
                    Fama
                </span>

                <b>
                    ${Math.round(
                        player.fame || 0
                    )}
                </b>

            </div>


            <div class="statline">

                <span>
                    Dinheiro
                </span>

                <b>
                    $${Math.round(
                        player.money || 0
                    )}
                </b>

            </div>

        </div>


        <div class="card">

            <button
                class="main-button"
                onclick="tab('home')">

                🏠 VOLTAR AO INÍCIO

            </button>


            <button
                class="gray"
                onclick="fightScreen()">

                ⚔️ TELA DE LUTA

            </button>

        </div>

    `;

}


/* =========================================================
   RECUPERAÇÃO
========================================================= */

function processFightRecovery() {

    const player =
        fightGetPlayer();


    if (!player) {
        return;
    }


    if (
        Number(
            player.fatigue || 0
        ) > 0
    ) {

        player.fatigue =
            Math.max(

                0,

                Number(
                    player.fatigue || 0
                ) - 8

            );

    }


    if (
        Number(
            player.health || 100
        ) < 100
    ) {

        player.health =
            Math.min(

                100,

                Number(
                    player.health || 100
                ) + 5

            );

    }

}


/* =========================================================
   EMPRESÁRIO PROCURA LUTA
========================================================= */

function processManagerFightOffer() {

    const player =
        fightGetPlayer();


    if (!player) {
        return;
    }


    /*
       Se já tem luta,
       não procura outra.
    */

    if (player.nextFight) {
        return;
    }


    /*
       Amadores podem procurar luta
       automaticamente de tempos em tempos.
    */

    const isProfessional =

        player.professional &&
        player.professional.active;


    const chance =
        isProfessional
        ?
        0.08
        :
        0.12;


    if (
        Math.random() > chance
    ) {

        return;

    }


    const opponent =
        generateFightOpponent();


    const event =
        generateFightEvent();


    player.nextFight = {

        event:
            event,

        opponent:
            opponent,

        week:
            Number(
                player.week || 1
            ),

        year:
            Number(
                player.year || 2026
            )

    };


    player.log =
        player.log || [];


    player.log.unshift(

        `📩 Nova luta disponível contra ${opponent.displayName}.`

    );


    fightSave();

}


/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */

window.fightScreen =
    fightScreen;


window.searchFight =
    searchFight;


window.generateFightOpponent =
    generateFightOpponent;


window.generateFightEvent =
    generateFightEvent;


window.simulateFight =
    simulateFight;


window.processFightRecovery =
    processFightRecovery;


window.processManagerFightOffer =
    processManagerFightOffer;
