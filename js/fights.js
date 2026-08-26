alert("FIGHTS TESTE");
let currentOpponent = null;
let currentEvent = null;


/* =========================================================
   PROCURAR LUTA
========================================================= */

function findFight() {

    if (player.nextFight) {

        alert(
            "Você já tem uma luta marcada."
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


        player.log.unshift(

            "🥋 Luta amadora marcada: " +
            currentEvent.name

        );


        save();

        fightScreen();

        return;

    }


    /* =====================================================
       PROFISSIONAL
    ===================================================== */

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


    player.nextFight = {

        opponent:
            currentOpponent,

        event:
            currentEvent,

        purse:
            purse,

        week:
            player.week + 1,

        amateur:
            false

    };


    player.log.unshift(

        "📅 Luta profissional marcada: " +
        currentEvent.name

    );


    save();

    fightScreen();

}


/* =========================================================
   REGISTRAR LUTA NO CONTRATO
========================================================= */

function registerContractFight(won) {

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


            /* =================================================
               PAGAMENTO
            ================================================= */

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


            /* =================================================
               PAGAMENTO DA DERROTA
            ================================================= */

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

    const content = getElement("content");

    if (!content) {
        return;
    }

    const player = window.player;

    content.innerHTML = `

        <div class="card">

            <div class="title">
                ⚔️ CENTRAL DE LUTAS
            </div>

            <p>
                Gerencie suas lutas e procure seu próximo adversário.
            </p>

        </div>

        <div class="card">

            <div class="title">
                📅 PRÓXIMA LUTA
            </div>

            ${
                player.nextFight
                ?

                `
                    <div class="statline">
                        <span>Evento</span>
                        <b>
                            ${player.nextFight.event.name}
                        </b>
                    </div>

                    <div class="statline">
                        <span>Adversário</span>
                        <b>
                            ${player.nextFight.opponent.displayName}
                        </b>
                    </div>

                    <div class="statline">
                        <span>Força</span>
                        <b>
                            ${Math.round(player.nextFight.opponent.power)}
                        </b>
                    </div>

                    <button
                        class="main-button"
                        onclick="fight()">

                        👊 LUTAR

                    </button>
                `

                :

                `
                    <p>
                        Você não possui uma luta marcada.
                    </p>

                    <button
                        class="main-button"
                        onclick="findFight()">

                        🔎 PROCURAR LUTA

                    </button>
                `
            }

        </div>

        <div class="card">

            <div class="title">
                📊 SEU STATUS
            </div>

            <div class="statline">
                <span>Amador</span>
                <b>
                    ${player.amateur.wins}-${player.amateur.losses}-${player.amateur.draws}
                </b>
            </div>

            <div class="statline">
                <span>Profissional</span>
                <b>
                    ${player.professional.wins}-${player.professional.losses}-${player.professional.draws}
                </b>
            </div>

            <div class="statline">
                <span>Fadiga</span>
                <b>
                    ${Math.round(player.fatigue)}%
                </b>
            </div>

        </div>

    `;
}


/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */

window.findFight = findFight;
window.fight = fight;
window.fightScreen = fightScreen;
