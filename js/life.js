const WEEKLY_FAMILY_COST = 25;


function advanceWeek() {

    player.week++;


    /*
     * 52 semanas = 1 ano
     */

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


        /*
         * Experiência melhora a inteligência
         * de luta com o passar dos anos.
         */

        if (
            player.professional.active
        ) {

            player.attributes.fightIQ =
                Math.min(
                    100,
                    player.attributes.fightIQ + 0.5
                );

        }

    }


    /*
     * RECUPERAÇÃO
     */

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


    /*
     * CUSTO DA EQUIPE
     */

    if (player.team) {

        player.money -=
            Math.floor(
                player.team.fee / 4
            );

    }


    /*
     * CUSTO DA FAMÍLIA
     */

    if (
        player.married
    ) {

        player.money -=
            WEEKLY_FAMILY_COST;

    }


    /*
     * EVITA DINHEIRO NEGATIVO
     */

    if (player.money < 0) {

        player.money = 0;

    }


    save();

    home();

}


function turnProfessional() {

    if (player.age < 18) {

        alert(
            "🥊 Você precisa ter 18 anos para virar profissional."
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
