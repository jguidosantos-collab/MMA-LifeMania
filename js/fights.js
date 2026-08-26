/* =========================================================
   MMA LIFE DYNASTY
   FIGHTS.JS
   SISTEMA DE LUTAS
========================================================= */


let currentOpponent = null;
let currentEvent = null;


/* =========================================================
   UTILIDADES
========================================================= */

function getFightCareerStage() {

    ensurePlayer();

    const player = window.player;

    if (player.careerStage) {
        return player.careerStage;
    }

    if (
        player.professional &&
        player.professional.active
    ) {
        return "regional";
    }

    return "amateur";
}


/* =========================================================
   RECUPERAÇÃO
========================================================= */

function isPlayerRecovering() {

    ensurePlayer();

    const player = window.player;

    const until =
        Number(player.recoveryUntilWeek || 0);

    const currentWeek =
        Number(player.week || 1);

    return until > currentWeek;
}


function getRecoveryRemaining() {

    ensurePlayer();

    const player = window.player;

    const until =
        Number(player.recoveryUntilWeek || 0);

    const currentWeek =
        Number(player.week || 1);

    return Math.max(
        0,
        until - currentWeek
    );
}


/* =========================================================
   FINALIZAR RECUPERAÇÃO
========================================================= */

function processFightRecovery() {

    ensurePlayer();

    const player = window.player;

    if (!player.recoveryUntilWeek) {
        return;
    }

    const remaining =
        getRecoveryRemaining();

    if (remaining <= 0) {

        player.recoveryWeeks = 0;

        player.recoveryUntilWeek = 0;

        player.log =
            player.log || [];

        player.log.unshift(
            "🩹 Você terminou sua recuperação e está liberado para lutar novamente."
        );

        save();
    }

}


/* =========================================================
   CALCULAR RISCO DA LUTA
========================================================= */

function calculateFightRisk(
    event,
    opponent
) {

    let risk = 10;


    if (event) {

        risk +=
            Number(event.level || 1) * 10;

    }


    if (opponent) {

        risk +=
            Number(opponent.power || 50) / 5;

    }


    risk =
        Math.round(risk);


    return Math.max(
        10,
        Math.min(
            100,
            risk
        )
    );

}


/* =========================================================
   CALCULAR RECUPERAÇÃO
   4 A 12 SEMANAS
========================================================= */

function calculateRecoveryWeeks(risk) {

    risk =
        Number(risk || 10);


    if (risk < 35) {

        return 4;

    }

    if (risk < 50) {

        return 6;

    }

    if (risk < 65) {

        return 8;

    }

    if (risk < 80) {

        return 10;

    }

    return 12;

}


/* =========================================================
   EMPRESÁRIO PROCURA LUTA
========================================================= */

function managerFindFight() {

    ensurePlayer();

    const player = window.player;


    /* =====================================================
       PRECISA SER PROFISSIONAL
    ===================================================== */

    if (
        !player.professional ||
        !player.professional.active
    ) {

        alert(
            "O sistema de empresário para ofertas de luta é destinado à carreira profissional."
        );

        return;

    }


    /* =====================================================
       PRECISA TER EMPRESÁRIO
    ===================================================== */

    if (!player.manager) {

        alert(
            "Você precisa ter um empresário para receber ofertas de luta."
        );

        return;

    }


    /* =====================================================
       JÁ ESTÁ EM RECUPERAÇÃO
    ===================================================== */

    if (isPlayerRecovering()) {

        alert(

            "🩹 Você ainda está em recuperação.\n\n" +

            "Semanas restantes: " +
            getRecoveryRemaining()

        );

        fightScreen();

        return;

    }


    /* =====================================================
       JÁ EXISTE OFERTA
    ===================================================== */

    if (player.fightOffer) {

        fightScreen();

        return;

    }


    /* =====================================================
       JÁ TEM LUTA MARCADA
    ===================================================== */

    if (player.nextFight) {

        fightScreen();

        return;

    }


    /* =====================================================
       GERAR EVENTO
    ===================================================== */

    currentEvent =
        generateEvent();


    if (!currentEvent) {

        alert(
            "O empresário não encontrou uma oportunidade de luta neste momento."
        );

        return;

    }


    /* =====================================================
       GERAR ADVERSÁRIO
    ===================================================== */

    currentOpponent =
        generateFighter();


    if (!currentOpponent) {

        alert(
            "O empresário não encontrou um adversário disponível."
        );

        return;

    }


    /* =====================================================
       FORÇA DO EVENTO
    ===================================================== */

    currentOpponent.power =
        Number(
            currentOpponent.power || 50
        ) +
        Number(
            currentEvent.level || 1
        ) * 5;


    /* =====================================================
       BOLSA
    ===================================================== */

    let purse =
        Number(
            currentEvent.purse || 0
        );


    if (
        player.currentContract &&
        player.currentContract.active
    ) {

        purse =
            Number(
                player.currentContract.purse ||
                purse
            );

    }


    /* =====================================================
       RISCO
    ===================================================== */

    const risk =
        calculateFightRisk(
            currentEvent,
            currentOpponent
        );


    /* =====================================================
       RECUPERAÇÃO
    ===================================================== */

    const recoveryWeeks =
        calculateRecoveryWeeks(
            risk
        );


    /* =====================================================
       SEMANA PROPOSTA
       
       O empresário não marca uma luta
       imediatamente.
       
       Mínimo de 2 semanas de preparação.
       ===================================================== */

    const proposedWeek =
        Number(
            player.week || 1
        ) + 2;


    /* =====================================================
       CRIAR OFERTA
    ===================================================== */

    player.fightOffer = {

        opponent:
            currentOpponent,

        event:
            currentEvent,

        purse:
            purse,

        risk:
            risk,

        recoveryWeeks:
            recoveryWeeks,

        proposedWeek:
            proposedWeek,

        amateur:
            false,

        offeredAtWeek:
            player.week

    };


    player.log =
        player.log || [];


    player.log.unshift(

        "📩 Seu empresário apresentou uma nova oferta de luta: " +
        currentEvent.name

    );


    save();


    fightScreen();

}


/* =========================================================
   EMPRESÁRIO AUTOMÁTICO
========================================================= */

function processManagerFightOffer() {

    ensurePlayer();

    const player = window.player;


    /* =====================================================
       SÓ PROFISSIONAL
    ===================================================== */

    if (
        !player.professional ||
        !player.professional.active
    ) {

        return;

    }


    /* =====================================================
       SEM EMPRESÁRIO
    ===================================================== */

    if (!player.manager) {

        return;

    }


    /* =====================================================
       RECUPERAÇÃO
    ===================================================== */

    if (isPlayerRecovering()) {

        return;

    }


    /* =====================================================
       JÁ TEM OFERTA
    ===================================================== */

    if (player.fightOffer) {

        return;

    }


    /* =====================================================
       JÁ TEM LUTA
    ===================================================== */

    if (player.nextFight) {

        return;

    }


    /*
     * O empresário procura automaticamente.
     *
     * Existe uma pequena chance de ele não
     * encontrar uma luta naquela semana.
     */

    const chance =
        Math.random();


    if (chance > 0.65) {

        return;

    }


    managerFindFight();

}


/* =========================================================
   ACEITAR OFERTA
========================================================= */

function acceptFightOffer() {

    ensurePlayer();

    const player = window.player;


    if (!player.fightOffer) {

        return;

    }


    if (isPlayerRecovering()) {

        alert(
            "Você ainda está em recuperação."
        );

        return;

    }


    player.nextFight = {

        opponent:
            player.fightOffer.opponent,

        event:
            player.fightOffer.event,

        purse:
            player.fightOffer.purse,

        week:
            player.fightOffer.proposedWeek,

        risk:
            player.fightOffer.risk,

        recoveryWeeks:
            player.fightOffer.recoveryWeeks,

        amateur:
            false

    };


    player.log =
        player.log || [];


    player.log.unshift(

        "📅 Luta aceita: " +
        player.nextFight.event.name

    );


    player.fightOffer =
        null;


    currentOpponent =
        player.nextFight.opponent;


    currentEvent =
        player.nextFight.event;


    save();


    fightScreen();

}


/* =========================================================
   RECUSAR OFERTA
========================================================= */

function declineFightOffer() {

    ensurePlayer();

    const player = window.player;


    if (!player.fightOffer) {

        return;

    }


    const eventName =
        player.fightOffer.event.name;


    player.log =
        player.log || [];


    player.log.unshift(

        "❌ Oferta recusada: " +
        eventName

    );


    player.fightOffer =
        null;


    currentOpponent =
        null;


    currentEvent =
        null;


    save();


    fightScreen();

}


/* =========================================================
   PROCURAR LUTA
========================================================= */

function findFight() {

    ensurePlayer();

    const player = window.player;


    /* =====================================================
       PROFISSIONAL
       
       NÃO PODE PROCURAR.
       O EMPRESÁRIO PROCURA.
       ===================================================== */

    if (
        player.professional &&
        player.professional.active
    ) {

        alert(

            "👔 Como profissional, você não procura mais suas próprias lutas.\n\n" +

            "Seu empresário será responsável por encontrar oportunidades."

        );

        managerFindFight();

        return;

    }


    /* =====================================================
       JÁ TEM LUTA
    ===================================================== */

    if (player.nextFight) {

        alert(
            "Você já tem uma luta marcada."
        );

        return;

    }


    if (player.fightOffer) {

        alert(
            "Você já possui uma oferta de luta."
        );

        return;

    }


    /* =====================================================
       AMADOR
       ===================================================== */

    currentEvent =
        generateEvent();


    currentOpponent =
        generateFighter();


    currentOpponent.power +=
        currentEvent.level * 5;


    player.nextFight = {

        opponent:
            currentOpponent,

        event:
            currentEvent,

        purse:
            currentEvent.purse,

        week:
            player.week + 1,

        amateur:
            true,

        risk:
            0,

        recoveryWeeks:
            0

    };


    player.log =
        player.log || [];


    player.log.unshift(

        "🥋 Luta amadora marcada: " +
        currentEvent.name

    );


    save();

    fightScreen();

}


/* =========================================================
   REGISTRAR LUTA NO CONTRATO
========================================================= */

function registerContractFight(won) {

    ensurePlayer();

    const player = window.player;


    if (
        !player.currentContract ||
        !player.currentContract.active
    ) {

        return;

    }


    player.currentContract.fightsCompleted =
        (
            player.currentContract.fightsCompleted ||
            0
        ) + 1;


    const totalFights =
        player.currentContract.fights || 3;


    if (
        player.currentContract.fightsCompleted >=
        totalFights
    ) {

        player.currentContract.active =
            false;


        player.log.unshift(

            "📄 Contrato encerrado com " +
            player.currentContract.promotionName +
            "."

        );


        alert(

            "📄 CONTRATO ENCERRADO!\n\n" +

            player.currentContract.promotionName +

            "\n\n" +

            "Lutas realizadas: " +
            totalFights

        );


        player.lastContract = {

            ...player.currentContract

        };


        player.currentContract =
            null;


        save();

        return;

    }


    const remaining =
        totalFights -
        player.currentContract.fightsCompleted;


    player.log.unshift(

        "📄 Contrato: " +
        remaining +
        " luta(s) restante(s)."

    );


    save();

}


/* =========================================================
   LUTAR
========================================================= */

function fight() {

    ensurePlayer();

    const player = window.player;


    if (!player.nextFight) {

        return;

    }


    /* =====================================================
       VERIFICAR SEMANA
    ===================================================== */

    const fightWeek =
        Number(
            player.nextFight.week ||
            player.week
        );


    if (
        Number(player.week) <
        fightWeek
    ) {

        alert(

            "📅 Essa luta está marcada para a semana " +
            fightWeek +
            ".\n\n" +

            "Você ainda precisa avançar o tempo."

        );

        return;

    }


    if (
        Number(player.week) >
        fightWeek
    ) {

        alert(
            "⚠️ A data dessa luta já passou."
        );

        return;

    }


    const opponent =
        player.nextFight.opponent;


    const event =
        player.nextFight.event;


    const a =
        player.attributes;


    const isAmateur =
        player.nextFight.amateur === true;


    /* =====================================================
       FORÇA
    ===================================================== */

    let fighterPower = (

        Number(a.strength || 40) +
        Number(a.striking || 40) +
        Number(a.wrestling || 40) +
        Number(a.grappling || 40) +
        Number(a.cardio || 40) +
        Number(a.technique || 40) +
        Number(a.defense || 40) +
        Number(a.fightIQ || 40) +
        Number(a.mental || 40) +
        Number(a.confidence || 40)

    ) / 10;


    fighterPower +=
        Number(
            player.professional.wins || 0
        ) * 1.5;


    fighterPower +=
        Number(
            player.amateur.wins || 0
        ) * 0.5;


    if (player.team) {

        fighterPower +=
            Number(
                player.team.quality || 0
            ) / 8;

    }


    fighterPower -=
        Number(
            player.fatigue || 0
        ) / 5;


    fighterPower +=
        Math.random() * 20 - 10;


    const enemyPower =
        Number(
            opponent.power || 50
        );


    const won =
        fighterPower >= enemyPower;


    /* =====================================================
       VITÓRIA
    ===================================================== */

    if (won) {

        if (isAmateur) {

            player.amateur.wins++;


            player.fame +=
                1;


            player.attributes.confidence =
                Math.min(
                    100,
                    Number(
                        player.attributes.confidence || 40
                    ) + 2
                );


            player.log.unshift(

                "🥋 Vitória amadora contra " +
                opponent.displayName +
                " no " +
                event.name

            );


            alert(

                "🥋 VITÓRIA AMADORA!\n\n" +
                opponent.displayName +
                "\n\n" +
                "Bolsa: $0"

            );

        }

        else {

            player.professional.wins++;


            opponent.losses =
                Number(
                    opponent.losses || 0
                ) + 1;


            let purse =
                Number(
                    event.purse || 0
                );


            let winBonus =
                0;


            if (
                player.currentContract &&
                player.currentContract.active
            ) {

                purse =
                    Number(
                        player.currentContract.purse ||
                        purse
                    );


                winBonus =
                    Number(
                        player.currentContract.winBonus ||
                        0
                    );

            }


            let payout;


            if (
                typeof calculateFightPayout ===
                "function"
            ) {

                payout =
                    calculateFightPayout(
                        purse,
                        winBonus
                    );

            }

            else {

                payout = {

                    gross:
                        purse + winBonus,

                    managerCut:
                        0,

                    teamCut:
                        0,

                    net:
                        purse + winBonus

                };

            }


            const finalMoney =
                Number(
                    payout.net || 0
                );


            player.money +=
                finalMoney;


            player.fame +=
                Number(
                    event.level || 1
                ) * 4;


            player.attributes.confidence =
                Math.min(
                    100,
                    Number(
                        player.attributes.confidence || 40
                    ) + 3
                );


            registerContractFight(
                true
            );


            player.log.unshift(

                "🏆 Vitória contra " +
                opponent.displayName +
                " no " +
                event.name

            );


            alert(

                "🏆 VITÓRIA!\n\n" +

                opponent.displayName +

                "\n\n" +

                "Bolsa: $" +
                Math.round(purse) +

                "\n" +

                "Bônus: $" +
                Math.round(winBonus) +

                "\n\n" +

                "Total bruto: $" +
                Math.round(payout.gross || 0) +

                "\n" +

                "Empresário: -$" +
                Math.round(payout.managerCut || 0) +

                "\n" +

                "Academia: -$" +
                Math.round(payout.teamCut || 0) +

                "\n\n" +

                "Você recebeu: $" +
                Math.round(finalMoney)

            );

        }

    }


    /* =====================================================
       DERROTA
    ===================================================== */

    else {

        if (isAmateur) {

            player.amateur.losses++;


            player.fame =
                Math.max(
                    0,
                    player.fame - 1
                );


            player.attributes.confidence =
                Math.max(
                    0,
                    Number(
                        player.attributes.confidence || 40
                    ) - 2
                );


            player.log.unshift(

                "❌ Derrota amadora contra " +
                opponent.displayName

            );


            alert(

                "❌ DERROTA AMADORA!\n\n" +
                opponent.displayName

            );

        }

        else {

            player.professional.losses++;


            opponent.wins =
                Number(
                    opponent.wins || 0
                ) + 1;


            let purse =
                Number(
                    event.purse || 0
                );


            if (
                player.currentContract &&
                player.currentContract.active
            ) {

                purse =
                    Number(
                        player.currentContract.purse ||
                        purse
                    );

            }


            let payout;


            if (
                typeof calculateFightPayout ===
                "function"
            ) {

                payout =
                    calculateFightPayout(
                        purse,
                        0
                    );

            }

            else {

                payout = {

                    gross:
                        purse,

                    managerCut:
                        0,

                    teamCut:
                        0,

                    net:
                        purse

                };

            }


            const finalMoney =
                Number(
                    payout.net || 0
                );


            player.money +=
                finalMoney;


            player.fame =
                Math.max(
                    0,
                    player.fame -
                    Number(
                        event.level || 1
                    ) * 2
                );


            player.attributes.confidence =
                Math.max(
                    0,
                    Number(
                        player.attributes.confidence || 40
                    ) - 4
                );


            registerContractFight(
                false
            );


            player.log.unshift(

                "❌ Derrota contra " +
                opponent.displayName +
                " no " +
                event.name

            );


            alert(

                "❌ DERROTA!\n\n" +

                opponent.displayName +

                "\n\n" +

                "Bolsa: $" +
                Math.round(purse) +

                "\n\n" +

                "Empresário: -$" +
                Math.round(payout.managerCut || 0) +

                "\n" +

                "Academia: -$" +
                Math.round(payout.teamCut || 0) +

                "\n\n" +

                "Você recebeu: $" +
                Math.round(finalMoney)

            );

        }

    }


    /* =====================================================
       RECUPERAÇÃO PÓS-LUTA
       
       Somente profissional.
       4 a 12 semanas.
    ===================================================== */

    if (!isAmateur) {

        const recoveryWeeks =
            Number(
                player.nextFight.recoveryWeeks || 4
            );


        player.recoveryWeeks =
            Math.max(
                4,
                Math.min(
                    12,
                    recoveryWeeks
                )
            );


        player.recoveryUntilWeek =
            Number(
                player.week || 1
            ) +
            player.recoveryWeeks;


        player.log.unshift(

            "🩹 Recuperação pós-luta: " +
            player.recoveryWeeks +
            " semanas."

        );

    }


    /* =====================================================
       DANO
    ===================================================== */

    player.health =
        Math.max(
            20,
            Number(
                player.health || 100
            ) -
            (
                10 +
                Number(
                    event.level || 1
                ) * 2
            )
        );


    player.fatigue =
        Math.min(
            100,
            Number(
                player.fatigue || 0
            ) + 30
        );


    /* =====================================================
       LIMPAR
    ===================================================== */

    player.nextFight =
        null;


    player.fightOffer =
        null;


    currentOpponent =
        null;


    currentEvent =
        null;


    if (
        typeof updateRanking ===
        "function"
    ) {

        updateRanking();

    }


    save();


    home();

}


/* =========================================================
   TELA DE LUTAS
========================================================= */

function fightScreen() {

    ensurePlayer();

    const content =
        getElement("content");


    if (!content) {
        return;
    }


    const player =
        window.player;


    const isProfessional =
        player.professional &&
        player.professional.active;


    const recovering =
        isPlayerRecovering();


    const recoveryRemaining =
        getRecoveryRemaining();


    content.innerHTML = `

        <div class="card">

            <div class="title">
                ⚔️ CENTRAL DE LUTAS
            </div>

            <p>
                ${
                    isProfessional
                    ?
                    "Seu empresário procura oportunidades para você."
                    :
                    "Gerencie suas lutas e procure seu próximo adversário."
                }
            </p>

        </div>


        ${
            isProfessional &&
            recovering

            ?

            `

            <div class="card">

                <div class="title">
                    🩹 RECUPERAÇÃO PÓS-LUTA
                </div>

                <p>
                    Você ainda está se recuperando da última luta.
                </p>


                <div class="statline">

                    <span>
                        Semanas restantes
                    </span>

                    <b>
                        ${recoveryRemaining}
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Recuperação total
                    </span>

                    <b>
                        ${player.recoveryWeeks || 4}
                        semanas
                    </b>

                </div>


                <p>
                    Seu empresário aguardará você estar liberado antes de apresentar uma nova luta.
                </p>

            </div>

            `

            :

            ""
        }


        ${
            isProfessional &&
            player.fightOffer &&
            !recovering

            ?

            `

            <div class="card">

                <div class="title">
                    📩 OFERTA DE LUTA
                </div>


                <p>
                    👔 Seu empresário encontrou esta oportunidade para você:
                </p>


                <div class="statline">

                    <span>
                        Organização
                    </span>

                    <b>
                        ${player.fightOffer.event.name}
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Adversário
                    </span>

                    <b>
                        ${player.fightOffer.opponent.displayName}
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Força
                    </span>

                    <b>
                        ${Math.round(
                            player.fightOffer.opponent.power
                        )}
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Bolsa
                    </span>

                    <b>
                        $${Math.round(
                            player.fightOffer.purse
                        )}
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Risco
                    </span>

                    <b>
                        ${player.fightOffer.risk}%
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Recuperação estimada
                    </span>

                    <b>
                        ${player.fightOffer.recoveryWeeks}
                        semanas
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Semana proposta
                    </span>

                    <b>
                        ${player.fightOffer.proposedWeek}
                    </b>

                </div>


                <button
                    class="green"
                    onclick="acceptFightOffer()">

                    ✅ ACEITAR LUTA

                </button>


                <button
                    class="gray"
                    onclick="declineFightOffer()">

                    ❌ RECUSAR

                </button>

            </div>

            `

            :

            ""
        }


        <div class="card">

            <div class="title">
                📅 PRÓXIMA LUTA
            </div>


            ${
                player.nextFight
                ?

                `

                    <div class="statline">

                        <span>
                            Evento
                        </span>

                        <b>
                            ${player.nextFight.event.name}
                        </b>

                    </div>


                    <div class="statline">

                        <span>
                            Adversário
                        </span>

                        <b>
                            ${player.nextFight.opponent.displayName}
                        </b>

                    </div>


                    <div class="statline">

                        <span>
                            Força
                        </span>

                        <b>
                            ${Math.round(
                                player.nextFight.opponent.power
                            )}
                        </b>

                    </div>


                    <div class="statline">

                        <span>
                            Semana
                        </span>

                        <b>
                            ${player.nextFight.week}
                        </b>

                    </div>


                    ${
                        player.nextFight.risk
                        ?

                        `

                        <div class="statline">

                            <span>
                                Risco
                            </span>

                            <b>
                                ${player.nextFight.risk}%
                            </b>

                        </div>


                        <div class="statline">

                            <span>
                                Recuperação estimada
                            </span>

                            <b>
                                ${player.nextFight.recoveryWeeks}
                                semanas
                            </b>

                        </div>

                        `

                        :

                        ""
                    }


                    ${
                        Number(player.week) >=
                        Number(player.nextFight.week)

                        ?

                        `

                        <button
                            class="main-button"
                            onclick="fight()">

                            👊 LUTAR

                        </button>

                        `

                        :

                        `

                        <p>
                            ⏳ Prepare-se para a luta.
                        </p>

                        `

                    }

                `

                :

                `

                    <p>
                        ${
                            isProfessional
                            ?
                            "Nenhuma luta aceita no momento. Seu empresário está procurando oportunidades."
                            :
                            "Você não possui uma luta marcada."
                        }
                    </p>


                    ${
                        !isProfessional
                        ?

                        `

                        <button
                            class="main-button"
                            onclick="findFight()">

                            🔎 PROCURAR LUTA

                        </button>

                        `

                        :

                        ""

                    }

                `
            }

        </div>


        <div class="card">

            <div class="title">
                📊 SEU STATUS
            </div>


            <div class="statline">

                <span>
                    Amador
                </span>

                <b>
                    ${player.amateur.wins}-
                    ${player.amateur.losses}-
                    ${player.amateur.draws}
                </b>

            </div>


            <div class="statline">

                <span>
                    Profissional
                </span>

                <b>
                    ${player.professional.wins}-
                    ${player.professional.losses}-
                    ${player.professional.draws}
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


            ${
                player.recoveryWeeks > 0

                ?

                `

                <div class="statline">

                    <span>
                        Recuperação total
                    </span>

                    <b>
                        ${player.recoveryWeeks}
                        semanas
                    </b>

                </div>

                `

                :

                ""

            }

        </div>

    `;

}


/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */

window.findFight =
    findFight;

window.managerFindFight =
    managerFindFight;

window.processManagerFightOffer =
    processManagerFightOffer;

window.acceptFightOffer =
    acceptFightOffer;

window.declineFightOffer =
    declineFightOffer;

window.fight =
    fight;

window.fightScreen =
    fightScreen;

window.isPlayerRecovering =
    isPlayerRecovering;

window.getRecoveryRemaining =
    getRecoveryRemaining;

window.processFightRecovery =
    processFightRecovery;
