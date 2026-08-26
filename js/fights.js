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
   EMPRESÁRIO PROCURA LUTA
========================================================= */

function managerFindFight() {

    ensurePlayer();

    const player = window.player;


    /* =====================================================
       JÁ EXISTE OFERTA
    ===================================================== */

    if (player.fightOffer) {

        alert(
            "Você já possui uma oferta de luta."
        );

        fightScreen();

        return;

    }


    /* =====================================================
       JÁ TEM LUTA MARCADA
    ===================================================== */

    if (player.nextFight) {

        alert(
            "Você já tem uma luta marcada."
        );

        fightScreen();

        return;

    }


    /* =====================================================
       AMADOR
       
       No amador continua podendo procurar luta.
       ===================================================== */

    if (
        !player.professional ||
        !player.professional.active
    ) {

        findFight();

        return;

    }


    /* =====================================================
       EMPRESÁRIO
       
       A partir do profissional, o empresário procura.
       ===================================================== */

    if (!player.manager) {

        alert(
            "Você precisa de um empresário para receber ofertas de luta."
        );

        return;

    }


    currentEvent =
        generateEvent();


    currentOpponent =
        generateFighter();


    currentOpponent.power +=
        currentEvent.level * 5;


    let purse =
        currentEvent.purse;


    if (
        player.currentContract &&
        player.currentContract.active
    ) {

        purse =
            player.currentContract.purse;

    }


    /*
     * Risco básico da luta.
     *
     * Lutas maiores e adversários mais fortes
     * aumentam o risco.
     */

    let risk =
        Math.round(
            (
                currentEvent.level * 10
            ) +
            (
                currentOpponent.power / 5
            )
        );


    risk =
        Math.max(
            10,
            Math.min(
                100,
                risk
            )
        );


    /*
     * Descanso estimado.
     *
     * 4 a 12 semanas.
     */

    let recoveryWeeks;


    if (risk < 35) {

        recoveryWeeks = 4;

    }
    else if (risk < 50) {

        recoveryWeeks = 6;

    }
    else if (risk < 65) {

        recoveryWeeks = 8;

    }
    else if (risk < 80) {

        recoveryWeeks = 10;

    }
    else {

        recoveryWeeks = 12;

    }


    /*
     * Cria a oferta.
     */

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
            player.week + 2,

        amateur:
            false

    };


    player.log =
        player.log || [];


    player.log.unshift(

        "📩 Seu empresário recebeu uma oferta de luta: " +
        currentEvent.name

    );


    save();


    fightScreen();

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

    if (!player.professional.active) {

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
                true

        };


        player.log =
            player.log || [];


        player.log.unshift(

            "🥋 Luta amadora marcada: " +
            currentEvent.name

        );


        save();

        fightScreen();

        return;

    }


    /*
     * IMPORTANTE:
     *
     * Profissional NÃO procura mais a própria luta.
     *
     * O empresário faz isso.
     */

    managerFindFight();

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

        a.strength +
        a.striking +
        a.wrestling +
        a.grappling +
        a.cardio +
        a.technique +
        a.defense +
        a.fightIQ +
        a.mental +
        a.confidence

    ) / 10;


    fighterPower +=
        player.professional.wins * 1.5;


    fighterPower +=
        player.amateur.wins * 0.5;


    if (player.team) {

        fighterPower +=
            player.team.quality / 8;

    }


    fighterPower -=
        player.fatigue / 5;


    fighterPower +=
        Math.random() * 20 - 10;


    const enemyPower =
        opponent.power;


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
                    player.attributes.confidence + 2
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


            opponent.losses++;


            let purse =
                event.purse;


            let winBonus =
                0;


            if (
                player.currentContract &&
                player.currentContract.active
            ) {

                purse =
                    player.currentContract.purse;


                winBonus =
                    player.currentContract.winBonus;

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
                payout.net;


            player.money +=
                finalMoney;


            player.fame +=
                event.level * 4;


            player.attributes.confidence =
                Math.min(
                    100,
                    player.attributes.confidence + 3
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
                Math.round(payout.gross) +

                "\n" +

                "Empresário: -$" +
                Math.round(payout.managerCut) +

                "\n" +

                "Academia: -$" +
                Math.round(payout.teamCut) +

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
                    player.attributes.confidence - 2
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


            opponent.wins++;


            let purse =
                event.purse;


            if (
                player.currentContract &&
                player.currentContract.active
            ) {

                purse =
                    player.currentContract.purse;

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
                payout.net;


            player.money +=
                finalMoney;


            player.fame =
                Math.max(
                    0,
                    player.fame -
                    event.level * 2
                );


            player.attributes.confidence =
                Math.max(
                    0,
                    player.attributes.confidence - 4
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
                Math.round(payout.managerCut) +

                "\n" +

                "Academia: -$" +
                Math.round(payout.teamCut) +

                "\n\n" +

                "Você recebeu: $" +
                Math.round(finalMoney)

            );

        }

    }


    /* =====================================================
       RECUPERAÇÃO PÓS-LUTA
    ===================================================== */

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


    /* =====================================================
       DANO
    ===================================================== */

    player.health =
        Math.max(
            20,
            player.health -
            (
                10 +
                event.level * 2
            )
        );


    player.fatigue =
        Math.min(
            100,
            player.fatigue + 30
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


    updateRanking();


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
            player.fightOffer
            ?

            `

            <div class="card">

                <div class="title">
                    📩 OFERTA DE LUTA
                </div>


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

                        `

                        :

                        ""
                    }


                    <button
                        class="main-button"
                        onclick="fight()">

                        👊 LUTAR

                    </button>

                `

                :

                `

                    <p>
                        ${
                            isProfessional
                            ?
                            "Nenhuma luta aceita no momento. Aguarde uma oferta do empresário."
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
                    ${player.amateur.wins}-${player.amateur.losses}-${player.amateur.draws}
                </b>

            </div>


            <div class="statline">

                <span>
                    Profissional
                </span>

                <b>
                    ${player.professional.wins}-${player.professional.losses}-${player.professional.draws}
                </b>

            </div>


            <div class="statline">

                <span>
                    Fadiga
                </span>

                <b>
                    ${Math.round(player.fatigue)}%
                </b>

            </div>


            ${
                player.recoveryWeeks > 0
                ?

                `

                <div class="statline">

                    <span>
                        Recuperação
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

window.acceptFightOffer =
    acceptFightOffer;

window.declineFightOffer =
    declineFightOffer;

window.fight =
    fight;

window.fightScreen =
    fightScreen;
