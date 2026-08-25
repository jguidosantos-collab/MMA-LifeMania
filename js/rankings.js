function updateRanking() {

    const record =
        player.professional.wins -
        player.professional.losses;


    if (!player.professional.active) {

        return;

    }


    let ranking =
        50 -
        player.professional.wins * 2 +
        player.professional.losses * 3;


    ranking =
        Math.max(
            1,
            Math.min(
                50,
                ranking
            )
        );


    player.professional.ranking =
        ranking;

}


function rankingText() {

    if (
        !player.professional.active
    ) {

        return "Amador";

    }


    return "#" +
        player.professional.ranking;

}
