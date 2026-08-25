let currentOpponent = null;
let currentEvent = null;

function findFight() {

    if (player.nextFight) {
        alert("Você já tem uma luta marcada.");
        return;
    }

    currentEvent = generateEvent();

    currentOpponent = generateFighter();

    // Quanto maior o evento, mais forte o adversário
    currentOpponent.power +=
        currentEvent.level * 5;

    player.nextFight = {

        opponent: currentOpponent,

        event: currentEvent,

        purse: currentEvent.purse,

        week: player.week + 1

    };

    player.log.unshift(
        "📅 Luta marcada: " +
        currentEvent.name
    );

    save();

    fightScreen();
}


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


    // experiência influencia
    fighterPower +=
        player.professional.wins * 1.5;


    // equipe influencia
    if (player.team) {

        fighterPower +=
            player.team.quality / 8;

    }


    // fadiga prejudica
    fighterPower -=
        player.fatigue / 5;


    // pequena variação aleatória
    fighterPower +=
        Math.random() * 20 - 10;


    const enemyPower =
        opponent.power;


    const won =
        fighterPower >= enemyPower;


    if (won) {

        player.professional.wins++;

        opponent.losses++;

        const baseMoney =
            event.purse;


        // empresário pega comissão
        let commission = 0;

        if (player.manager) {

            commission =
                player.manager.commission;

        }


        const finalMoney =
            baseMoney -
            (baseMoney * commission / 100);


        player.money +=
            finalMoney;


        // fama proporcional ao evento
        player.fame +=
            event.level * 4;


        // confiança
        player.attributes.confidence =
            Math.min(
                100,
                player.attributes.confidence + 3
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
            Math.round(finalMoney)

        );

    } else {

        player.professional.losses++;

        opponent.wins++;


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


        player.log.unshift(

            "❌ Derrota contra " +
            opponent.displayName

        );


        alert(

            "❌ DERROTA!\n\n" +
            opponent.displayName

        );

    }


    // dano da luta
    player.health =
        Math.max(
            20,
            player.health -
            (10 + event.level * 2)
        );


    player.fatigue =
        Math.min(
            100,
            player.fatigue + 30
        );


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
