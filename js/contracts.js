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

    /*
     * =====================================
     * AMADOR
     * =====================================
     *
     * Lutador amador NÃO recebe contrato
     * profissional.
     */

    if (!player.professional.active) {

        return false;

    }


    /*
     * =====================================
     * REGIONAL
     * =====================================
     *
     * Todo profissional começa aqui.
     */

    if (promotion.level === 1) {

        return (
            player.careerStage === "regional"
            ||
            player.careerStage === "national"
            ||
            player.careerStage === "international"
            ||
            player.careerStage === "elite"
        );

    }


    /*
     * =====================================
     * NACIONAL
     * =====================================
     */

    if (
        promotion.level >= 2 &&
        promotion.level <= 3
    ) {

        if (
            player.careerStage === "regional"
        ) {

            /*
             * Para sair do regional:
             *
             * mínimo de 3 vitórias
             * ou fama suficiente.
             */

            return (
                player.professional.wins >= 3 &&
                player.fame >= 10
            );

        }


        return (
            player.careerStage === "national"
            ||
            player.careerStage === "international"
            ||
            player.careerStage === "elite"
        );

    }


    /*
     * =====================================
     * INTERNACIONAL
     * =====================================
     */

    if (
        promotion.level >= 4 &&
        promotion.level <= 5
    ) {

        /*
         * Sem empresário:
         * NÃO entra no internacional.
         */

        if (!player.manager) {

            return false;

        }


        /*
         * Empresário precisa ter contatos.
         */

        if (
            player.manager.contacts < 45
        ) {

            return false;

        }


        /*
         * Precisa ter carreira nacional.
         */

        if (
            player.careerStage !==
            "international" &&
            player.careerStage !==
            "elite"
        ) {

            return false;

        }


        return (
            player.professional.wins >= 5 &&
            player.fame >= 25
        );

    }


    /*
     * =====================================
     * ELITE
     * =====================================
     */

    if (promotion.level >= 6) {

        /*
         * Empresário obrigatório.
         */

        if (!player.manager) {

            return false;

        }


        /*
         * Empresário precisa ter contatos
         * realmente altos.
         */

        if (
            player.manager.contacts < 80
        ) {

            return false;

        }


        /*
         * Precisa ter chegado à fase elite.
         */

        if (
            player.careerStage !== "elite"
        ) {

            return false;

        }


        return (
            player.professional.wins >= 8 &&
            player.fame >= 50
        );

    }


    return false;

}
