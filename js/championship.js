function initializeChampionship() {

    if (!player.championship) {

        player.championship = {

            title: null,

            defenses: 0,

            titleWins: 0,

            titleLosses: 0

        };

    }

}


function eligibleForTitle() {

    initializeChampionship();


    if (
        !player.professional.active
    ) {

        return false;

    }


    if (
        player.professional.ranking === null
    ) {

        return false;

    }


    return (

        player.professional.ranking <= 5 &&

        player.professional.wins >= 5

    );

}


function winTitle() {

    initializeChampionship();


    player.championship.title =
        player.currentPromotion.name;


    player.championship.titleWins++;


    player.championship.defenses = 0;


    player.fame += 20;


    player.log.unshift(

        "👑 VOCÊ CONQUISTOU O CINTURÃO!"

    );


    save();

}


function defendTitle() {

    initializeChampionship();


    if (
        !player.championship.title
    ) {

        return;

    }


    player.championship.defenses++;


    player.fame += 10;


    player.money +=
        25000;


    player.log.unshift(

        "🛡️ Cinturão defendido com sucesso."

    );


    save();

}
