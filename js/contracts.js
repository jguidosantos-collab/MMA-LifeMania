/* =========================================================
   CONTRATOS — MMA LIFE DYNASTY
========================================================= */


/* =========================================================
   UTILIDADES
========================================================= */

function randomInt(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


function clamp(value, min, max) {

    return Math.max(
        min,
        Math.min(max, value)
    );

}


/* =========================================================
   HISTÓRICO COM ORGANIZAÇÃO
========================================================= */

function getPromotionHistory(promotionId) {

    if (!player.promotionHistory) {

        player.promotionHistory = {};

    }


    if (!player.promotionHistory[promotionId]) {

        player.promotionHistory[promotionId] = {

            fights: 0,

            wins: 0,

            losses: 0,

            purse: 0,

            winBonus: 0,

            contracts: 0

        };

    }


    return player.promotionHistory[promotionId];

}


/* =========================================================
   NÍVEL DO EMPRESÁRIO
========================================================= */

function getManagerNegotiation() {

    if (!player.manager) {

        return 0;

    }


    return clamp(
        player.manager.contacts || 0,
        0,
        100
    );

}


/* =========================================================
   MULTIPLICADOR DE NEGOCIAÇÃO
========================================================= */

function getNegotiationMultiplier() {

    const contacts =
        getManagerNegotiation();


    /*
     * Sem empresário:
     * negociação mínima.
     */

    if (!player.manager) {

        return 1;

    }


    /*
     * Empresário aumenta progressivamente
     * a capacidade de negociação.
     */

    return (
        1 +
        contacts / 250
    );

}


/* =========================================================
   DESEMPENHO
========================================================= */

function getPerformanceMultiplier() {

    const wins =
        player.professional.wins || 0;

    const losses =
        player.professional.losses || 0;


    const fights =
        wins + losses;


    if (fights <= 0) {

        return 1;

    }


    const winRate =
        wins / fights;


    /*
     * Cartel vencedor gera pequeno
     * aumento na negociação.
     */

    if (winRate >= 0.80) {

        return 1.15;

    }


    if (winRate >= 0.65) {

        return 1.08;

    }


    if (winRate >= 0.50) {

        return 1.03;

    }


    return 0.95;

}


/* =========================================================
   HISTÓRICO COM A ORGANIZAÇÃO
========================================================= */

function getPromotionMultiplier(promotion) {

    const history =
        getPromotionHistory(
            promotion.id
        );


    /*
     * Quanto mais o lutador luta
     * pela organização, maior a chance
     * de uma renovação melhor.
     */

    if (history.contracts <= 0) {

        return 1;

    }


    let multiplier = 1;


    if (history.wins >= 3) {

        multiplier += 0.08;

    }


    if (history.wins >= 5) {

        multiplier += 0.10;

    }


    if (history.wins >= 8) {

        multiplier += 0.15;

    }


    return multiplier;

}


/* =========================================================
   QUANTIDADE DE LUTAS
========================================================= */

function generateContractLength(promotion) {

    const min =
        promotion.minFights || 3;

    const max =
        promotion.maxFights || 5;


    return randomInt(
        min,
        max
    );

}


/* =========================================================
   BOLSA BASE
========================================================= */

function calculateBasePurse(promotion) {

    return (
        promotion.basePurse || 0
    );

}


function calculateBaseWinBonus(promotion) {

    return (
        promotion.baseWinBonus ||
        promotion.basePurse ||
        0
    );

}


/* =========================================================
   OFERTA DE CONTRATO
========================================================= */

function calculateContractOffer(promotion) {

    const negotiation =
        getNegotiationMultiplier();


    const performance =
        getPerformanceMultiplier();


    const promotionMultiplier =
        getPromotionMultiplier(
            promotion
        );


    /*
     * Fama também ajuda o empresário
     * a negociar.
     */

    const fameMultiplier =
        1 +
        clamp(
            player.fame || 0,
            0,
            100
        ) / 1000;


    const totalMultiplier =
        negotiation *
        performance *
        promotionMultiplier *
        fameMultiplier;


    let purse =
        Math.round(
            calculateBasePurse(
                promotion
            ) *
            totalMultiplier
        );


    let winBonus =
        Math.round(
            calculateBaseWinBonus(
                promotion
            ) *
            totalMultiplier
        );


    /*
     * Garante que a oferta nunca fique
     * abaixo da bolsa base.
     */

    purse =
        Math.max(
            calculateBasePurse(
                promotion
            ),
            purse
        );


    winBonus =
        Math.max(
            calculateBaseWinBonus(
                promotion
            ),
            winBonus
        );


    /*
     * Segundo contrato e contratos seguintes
     * ganham um pequeno aumento.
     */

    const history =
        getPromotionHistory(
            promotion.id
        );


    if (
        history.contracts > 0
    ) {

        purse =
            Math.round(
                purse *
                (
                    1 +
                    Math.min(
                        history.contracts * 0.05,
                        0.20
                    )
                )
            );


        winBonus =
            Math.round(
                winBonus *
                (
                    1 +
                    Math.min(
                        history.contracts * 0.05,
                        0.20
                    )
                )
            );

    }


    return {

        promotion: promotion,

        fights:
            generateContractLength(
                promotion
            ),

        purse: purse,

        winBonus: winBonus,

        negotiation:
            Math.round(
                (
                    totalMultiplier - 1
                ) * 100
            )

    };

}


/* =========================================================
   VERIFICAÇÃO DE OFERTA
========================================================= */

function canReceiveOffer(promotion) {

    if (
        !player.professional ||
        !player.professional.active
    ) {

        return false;

    }


    const stage =
        player.careerStage ||
        "regional";


    const wins =
        player.professional.wins || 0;


    const fame =
        player.fame || 0;


    const manager =
        player.manager;


    const contacts =
        manager
        ? (manager.contacts || 0)
        : 0;


    /* =====================================================
       🏟️ REGIONAL
    ===================================================== */

    if (
        promotion.careerStage ===
        "regional"
    ) {

        return (
            stage === "regional" ||
            stage === "national" ||
            stage === "international" ||
            stage === "elite"
        );

    }


    /* =====================================================
       🇧🇷 NACIONAL
    ===================================================== */

    if (
        promotion.careerStage ===
        "national"
    ) {

        if (
            stage === "regional"
        ) {

            return (
                wins >= 3 &&
                fame >= 10
            );

        }


        return (
            stage === "national" ||
            stage === "international" ||
            stage === "elite"
        );

    }


    /* =====================================================
       🌎 INTERNACIONAL
    ===================================================== */

    if (
        promotion.careerStage ===
        "international"
    ) {

        /*
         * Empresário é praticamente obrigatório
         * para conseguir uma oportunidade internacional.
         */

        if (!manager) {

            return false;

        }


        if (
            contacts <
            (
                promotion.minimumManagerContacts ||
                45
            )
        ) {

            return false;

        }


        /*
         * CAMINHO NORMAL
         *
         * Nacional → Internacional
         */

        if (
            stage === "international" ||
            stage === "elite"
        ) {

            return (
                wins >= 5 &&
                fame >= 25
            );

        }


        /*
         * =================================================
         * 🚀 SALTO REGIONAL → INTERNACIONAL
         * =================================================
         *
         * Extremamente bom + empresário forte.
         */

        if (
            stage === "regional"
        ) {

            if (
                contacts >= 80 &&
                wins >= 7 &&
                fame >= 35
            ) {

                return (
                    Math.random() <
                    0.20
                );

            }

        }


        return false;

    }


    /* =====================================================
       👑 ELITE / UFC
    ===================================================== */

    if (
        promotion.careerStage ===
        "elite"
    ) {

        /*
         * UFC exige empresário forte.
         */

        if (!manager) {

            return false;

        }


        if (
            contacts <
            (
                promotion.minimumManagerContacts ||
                80
            )
        ) {

            return false;

        }


        /*
         * CAMINHO NORMAL
         *
         * Internacional → Elite
         */

        if (
            stage === "international"
        ) {

            if (
                wins >= 8 &&
                fame >= 50
            ) {

                return (
                    Math.random() <
                    0.35
                );

            }


            return false;

        }


        /*
         * =================================================
         * 🚀 NACIONAL → UFC
         * =================================================
         */

        if (
            stage === "national"
        ) {

            if (
                contacts >= 90 &&
                wins >= 10 &&
                fame >= 65
            ) {

                return (
                    Math.random() <
                    0.10
                );

            }


            return false;

        }


        /*
         * =================================================
         * 🚀 REGIONAL → UFC
         * =================================================
         *
         * Extremamente raro.
         */

        if (
            stage === "regional"
        ) {

            if (
                contacts >= 95 &&
                wins >= 12 &&
                fame >= 80
            ) {

                return (
                    Math.random() <
                    0.02
                );

            }


            return false;

        }


        /*
         * Já está na elite.
         */

        if (
            stage === "elite"
        ) {

            return (
                wins >= 8 &&
                fame >= 50
            );

        }

    }


    return false;

}

/* =========================================================
   OPORTUNIDADES ESTRANGEIRAS RARAS
========================================================= */

function foreignOpportunityChance(
    promotion
) {

    if (
        !player.manager
    ) {

        return 0;

    }


    const contacts =
        player.manager.contacts || 0;


    let chance =
        promotion.foreignChance || 0;


    /*
     * Empresário melhora muito a chance
     * de encontrar oportunidades fora.
     */

    if (
        contacts >= 60
    ) {

        chance += 5;

    }


    if (
        contacts >= 80
    ) {

        chance += 10;

    }


    if (
        contacts >= 95
    ) {

        chance += 15;

    }


    return clamp(
        chance,
        0,
        100
    );

}


/* =========================================================
   FILTRO GEOGRÁFICO
========================================================= */

function promotionMatchesPlayer(
    promotion
) {

    /*
     * Organizações internacionais:
     * podem aparecer normalmente quando
     * o lutador já chegou ao internacional.
     */

    if (
        promotion.international
    ) {

        return true;

    }


    /*
     * Se não houver país salvo,
     * não bloqueia a oferta.
     */

    if (
        !player.country
    ) {

        return true;

    }


    /*
     * Oferta do mesmo país.
     */

    if (
        promotion.country ===
        player.country
    ) {

        return true;

    }


    /*
     * Organização estrangeira:
     * só pode aparecer como oportunidade
     * especial e rara.
     */

    const chance =
        foreignOpportunityChance(
            promotion
        );


    return (
        Math.random() * 100
        <
        chance
    );

}


/* =========================================================
   GERAR OFERTAS
========================================================= */

function generateContractOffers() {

    if (
        !player.professional ||
        !player.professional.active
    ) {

        return [];

    }


    /*
     * Atualiza progressão.
     */

    updateCareerStage();


    const possible =
        promotions.filter(
            promotion => {

                if (
                    !canReceiveOffer(
                        promotion
                    )
                ) {

                    return false;

                }


                return promotionMatchesPlayer(
                    promotion
                );

            }
        );


    /*
     * Em vez de mostrar todas as
     * organizações, selecionamos poucas.
     */

    const shuffled =
        [...possible]
            .sort(
                () =>
                    Math.random() -
                    0.5
            );


    const selected =
        shuffled.slice(
            0,
            3
        );


    return selected.map(
        promotion =>
            calculateContractOffer(
                promotion
            )
    );

}


/* =========================================================
   ASSINAR CONTRATO
========================================================= */

function acceptPromotion(id) {

    const promotion =
        promotions.find(
            p =>
                p.id === id
        );


    if (!promotion) {

        return;

    }


    const offer =
        calculateContractOffer(
            promotion
        );


    player.currentPromotion =
        promotion;


    player.currentContract = {

        promotionId:
            promotion.id,

        promotionName:
            promotion.name,

        fights:
            offer.fights,

        fightsCompleted: 0,

        purse:
            offer.purse,

        winBonus:
            offer.winBonus,

        active: true,

        contractNumber:
            (
                getPromotionHistory(
                    promotion.id
                ).contracts || 0
            ) + 1

    };


    /*
     * Atualiza histórico.
     */

    const history =
        getPromotionHistory(
            promotion.id
        );


    history.contracts++;


    player.log.unshift(

        "✍️ Contrato assinado com " +
        promotion.name +
        " por " +
        offer.fights +
        " lutas."

    );


    player.log.unshift(

        "💰 Bolsa: $" +
        offer.purse +
        " + $" +
        offer.winBonus +
        " por vitória."

    );


    save();


    if (
        typeof career ===
        "function"
    ) {

        career();

    }

}


/* =========================================================
   FINALIZAR LUTA DO CONTRATO
========================================================= */

function registerContractFight(
    won
) {

    if (
        !player.currentContract ||
        !player.currentContract.active
    ) {

        return;

    }


    const contract =
        player.currentContract;


    const history =
        getPromotionHistory(
            contract.promotionId
        );


    contract.fightsCompleted++;


    history.fights++;


    if (won) {

        history.wins++;

        player.money +=
            contract.winBonus;

    }
    else {

        history.losses++;

    }


    /*
     * Bolsa da luta é paga sempre.
     */

    player.money +=
        contract.purse;


    /*
     * Contrato terminou?
     */

    if (
        contract.fightsCompleted >=
        contract.fights
    ) {

        contract.active =
            false;


        player.log.unshift(

            "📄 Seu contrato com " +
            contract.promotionName +
            " terminou."

        );


        player.log.unshift(

            "📈 Uma nova negociação está disponível."

        );

    }


    save();

}


/* =========================================================
   RENOVAÇÃO
========================================================= */

function generateRenewalOffer() {

    if (
        !player.currentContract
    ) {

        return null;

    }


    const promotion =
        promotions.find(
            p =>
                p.id ===
                player.currentContract
                    .promotionId
        );


    if (!promotion) {

        return null;

    }


    return calculateContractOffer(
        promotion
    );

}


/* =========================================================
   RENOVAR
========================================================= */

function renewContract() {

    const offer =
        generateRenewalOffer();


    if (!offer) {

        return;

    }


    player.currentContract = {

        promotionId:
            offer.promotion.id,

        promotionName:
            offer.promotion.name,

        fights:
            offer.fights,

        fightsCompleted: 0,

        purse:
            offer.purse,

        winBonus:
            offer.winBonus,

        active: true,

        contractNumber:
            (
                getPromotionHistory(
                    offer.promotion.id
                ).contracts || 0
            ) + 1

    };


    const history =
        getPromotionHistory(
            offer.promotion.id
        );


    history.contracts++;


    player.log.unshift(

        "🔄 Contrato renovado com " +
        offer.promotion.name

    );


    player.log.unshift(

        "💰 Nova bolsa: $" +
        offer.purse

    );


    save();

}
