function calculateContractOffer(promotion) {

    let multiplier = 1;

    if (player.manager) {

        multiplier +=
            player.manager.contacts / 200;

    }

    multiplier +=
        player.fame / 500;


    return {

        promotion: promotion,

        fights:
            Math.max(
                1,
                Math.floor(
                    3 +
                    player.fame / 25
                )
            ),

        purse:
            Math.round(
                promotion.basePurse *
                multiplier
            ),

        winBonus:
            Math.round(
                promotion.basePurse *
                multiplier *
                0.5
            )

    };

}


function canReceiveOffer(promotion) {

    const wins =
        player.professional.wins;

    const fame =
        player.fame;

    const ranking =
        player.professional.ranking;


    /*
     * Organizações menores:
     * acesso relativamente fácil.
     */

    if (promotion.level <= 3) {

        return true;

    }


    /*
     * Organizações intermediárias.
     */

    if (promotion.level <= 6) {

        return (
            wins >= 3 ||
            fame >= 15
        );

    }


    /*
     * Organizações grandes.
     */

    if (promotion.level <= 8) {

        return (
            wins >= 6 &&
            fame >= 35
        );

    }


    /*
     * Elite.
     *
     * Não exige passar por todas
     * as organizações.
     */

    if (promotion.level >= 9) {

        return (

            (
                wins >= 8 &&
                fame >= 60
            )

            ||

            (
                player.manager &&
                player.manager.contacts >= 85 &&
                wins >= 5 &&
                fame >= 45
            )

        );

    }


    return false;

}


function generateContractOffers() {

    const offers = [];

    promotions.forEach(promotion => {

        if (
            canReceiveOffer(promotion)
        ) {

            offers.push(
                calculateContractOffer(
                    promotion
                )
            );

        }

    });


    return offers;

}
