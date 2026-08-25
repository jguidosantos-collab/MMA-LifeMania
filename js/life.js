function advanceWeek() {

    player.week++;


    // 52 semanas = 1 ano
    if (player.week % 52 === 0) {

        player.age++;

        player.year++;


        player.children.forEach(child => {

            child.age++;

        });


        player.log.unshift(

            "🎂 Você completou " +
            player.age +
            " anos."

        );


        // Pequena evolução natural
        // da experiência do lutador

        if (
            player.professional.active
        ) {

            player.attributes.fightIQ =
                Math.min(
                    100,
                    player.attributes.fightIQ + 0.3
                );

        }

    }


    // Recuperação semanal

    player.fatigue =
        Math.max(
            0,
            player.fatigue - 8
        );


    player.health =
        Math.min(
            100,
            player.health + 3
        );


    // Custo da equipe

    if (player.team) {

        player.money -=
            Math.floor(
                player.team.fee / 4
            );

    }


    save();

    home();

}


function turnProfessional() {

    if (player.age < 18) {

        alert(
            "Você precisa ter 18 anos."
        );

        return;

    }


    if (
        player.professional.active
    ) {

        return;

    }


    player.professional.active =
        true;


    player.professional.ranking =
        50;


    player.log.unshift(

        "🏆 Você se tornou lutador profissional!"

    );


    save();

    home();

}
