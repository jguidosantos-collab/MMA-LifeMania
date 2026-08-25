const opponents = [

    "Lucas Rocha",
    "Bruno Mendes",
    "Rafael Costa",
    "Diego Santos",
    "Caio Almeida",
    "Mateus Lima",
    "Victor Silva",
    "Gabriel Torres",
    "Henrique Souza",
    "Pedro Martins",
    "Gustavo Alves",
    "Renan Costa"

];


function findFight() {

    if (player.nextFight) {

        alert(
            "Você já possui uma luta marcada."
        );

        return;
    }

    const name =
        opponents[
            Math.floor(
                Math.random() *
                opponents.length
            )
        ];

    player.nextFight = {

        name: name,

        power:
            40 +
            Math.random() * 35,

        purse:
            300 +
            player.fame * 50

    };

    player.log.unshift(
        "📅 Luta marcada contra " +
        name
    );

    save();

    fightScreen();
}


function fight() {

    if (!player.nextFight) {

        return;
    }

    const a =
        player.attributes;


    let mine = (

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


    mine +=
        Math.random() * 20 -
        player.fatigue / 8;


    const enemy =

        player.nextFight.power +
        Math.random() * 25;


    if (mine >= enemy) {

        if (
            player.professional.active
        ) {

            player.professional.wins++;

        } else {

            player.amateur.wins++;

        }


        player.money +=
            player.nextFight.purse * 2;


        player.fame +=

            player.professional.active
                ? 5
                : 2;


        player.log.unshift(

            "🏆 Vitória sobre " +
            player.nextFight.name

        );

        alert("🏆 VITÓRIA!");

    } else {

        if (
            player.professional.active
        ) {

            player.professional.losses++;

        } else {

            player.amateur.losses++;

        }


        player.log.unshift(

            "❌ Derrota contra " +
            player.nextFight.name

        );

        alert("❌ DERROTA!");

    }


    player.health =

        Math.max(
            20,
            player.health - 15
        );


    player.fatigue =

        Math.min(
            100,
            player.fatigue + 30
        );


    player.nextFight = null;


    save();

    home();
}
