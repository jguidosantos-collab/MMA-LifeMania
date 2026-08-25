function generateOpportunity() {

    const opportunities = [];


    /*
     * Oferta normal
     */

    promotions.forEach(promotion => {

        if (
            canReceiveOffer(promotion)
        ) {

            opportunities.push({

                type: "contract",

                promotion:

                    promotion,

                message:

                    "Uma organização está interessada em você."

            });

        }

    });


    /*
     * O empresário pode abrir
     * uma porta inesperada.
     */

    if (
        player.manager &&
        player.manager.contacts >= 80 &&
        player.professional.wins >= 5
    ) {

        const elite =
            promotions.find(
                p => p.elite
            );


        if (elite) {

            opportunities.push({

                type: "elite",

                promotion: elite,

                message:

                    "🔥 Seu empresário conseguiu uma oportunidade direta na elite!"

            });

        }

    }


    if (
        opportunities.length === 0
    ) {

        return null;

    }


    return opportunities[
        Math.floor(
            Math.random() *
            opportunities.length
        )
    ];

}
