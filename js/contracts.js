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
            player.careerStage = "regional";

updateCareerStage();
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
    promotion.level <= 3 &&
    !promotion.international
) {

    if (
        player.careerStage === "regional"
    ) {

        return (
            player.professional.wins >= 3 &&
            player.fame >= 10
        );

    }


    return (
        player.careerStage === "national" ||
        player.careerStage === "international" ||
        player.careerStage === "elite"
    );

}


    /*
     * =====================================
     * INTERNACIONAL
     * =====================================
     */

    if (
    promotion.international &&
    promotion.level >= 3 &&
    promotion.level <= 5
) {

    if (!player.manager) {

        return false;

    }


    if (
        player.manager.contacts < 45
    ) {

        return false;

    }


    if (
        player.careerStage !== "international" &&
        player.careerStage !== "elite"
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

    if (
    promotion.level >= 6
) {

    if (!promotion.elite &&
        player.careerStage !== "elite") {

        return false;

    }


    if (!player.manager) {

        return false;

    }


    if (
        player.manager.contacts < 80
    ) {

        return false;

    }


    return (
        player.careerStage === "elite" &&
        player.professional.wins >= 8 &&
        player.fame >= 50
    );

}


function updateCareerStage() {

    /*
     * AMADOR
     *
     * Não pode sair antes dos 18.
     */

    if (!player.professional.active) {

        player.careerStage =
            "amateur";

        return;

    }


    /*
     * PRIMEIRO PASSO PROFISSIONAL
     *
     * Sempre começa no regional.
     */

    if (
        player.careerStage === "amateur"
    ) {

        player.careerStage =
            "regional";

        return;

    }


    /*
     * REGIONAL → NACIONAL
     */

    if (
        player.careerStage === "regional" &&
        player.professional.wins >= 3 &&
        player.fame >= 10
    ) {

        player.careerStage =
            "national";

        player.log.unshift(
            "🇧🇷 Você alcançou o circuito nacional!"
        );

        return;

    }


    /*
     * NACIONAL → INTERNACIONAL
     *
     * Empresário obrigatório.
     */

    if (
        player.careerStage === "national" &&
        player.professional.wins >= 5 &&
        player.fame >= 25 &&
        player.manager &&
        player.manager.contacts >= 45
    ) {

        player.careerStage =
            "international";

        player.log.unshift(
            "🌎 Seu empresário abriu as portas do circuito internacional!"
        );

        return;

    }


    /*
     * INTERNACIONAL → ELITE
     *
     * Empresário forte obrigatório.
     */

    if (
        player.careerStage === "international" &&
        player.professional.wins >= 8 &&
        player.fame >= 50 &&
        player.manager &&
        player.manager.contacts >= 80
    ) {

        player.careerStage =
            "elite";

        player.log.unshift(
            "👑 Você alcançou a elite mundial!"
        );

        return;

    }

}

    function generateContractOffers() {

    if (!player.professional.active) {

        return [];

    }


    const available =
        promotions.filter(
            promotion =>
                canReceiveOffer(promotion)
        );


    return available
        .slice(0, 3)
        .map(
            promotion =>
                calculateContractOffer(
                    promotion
                )
        );

}

function generateContractOffers() {

    if (!player.professional.active) {

        return [];

    }


    /*
     * Atualiza a etapa da carreira
     */

    updateCareerStage();


    /*
     * Seleciona somente organizações
     * permitidas para o estágio atual.
     */

    const available =
        promotions.filter(
            promotion =>
                canReceiveOffer(promotion)
        );


    /*
     * Limita a quantidade de ofertas
     * para não encher a tela.
     */

    return available
        .slice(0, 3)
        .map(
            promotion =>
                calculateContractOffer(
                    promotion
                )
        );

}

function generateContractOffers() {

    if (!player.professional.active) {

        return [];

    }


    updateCareerStage();


    const available =
        promotions.filter(
            promotion =>
                canReceiveOffer(promotion)
        );


    return available
        .slice(0, 3)
        .map(
            promotion =>
                calculateContractOffer(
                    promotion
                )
        );

}

function generateContractOffers() {

    if (!player.professional.active) {
        return [];
    }

    const available =
        promotions.filter(
            promotion =>
                canReceiveOffer(promotion)
        );

    return available
        .slice(0, 3)
        .map(
            promotion =>
                calculateContractOffer(promotion)
        );

}
