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
function getCareerStageLabel() {

    const stage =
        player.careerStage ||
        "amateur";


    const labels = {

        amateur:
            "🥋 Amador",

        regional:
            "🏟️ Regional",

        national:
            "🇧🇷 Nacional",

        international:
            "🌎 Internacional",

        elite:
            "👑 Elite"

    };


    return (
        labels[stage] ||
        "🥋 Amador"
    );

}

function calculateContractOffer(promotion) {

    let multiplier = 1;


    /*
     * =====================================================
     * EMPRESÁRIO
     * =====================================================
     */

    if (player.manager) {

        multiplier +=
            (
                player.manager.contacts ||
                0
            ) / 200;


        /*
         * Empresário também consegue
         * negociar melhor conforme o nível.
         */

        if (
            player.manager.level
        ) {

            const level =
                String(
                    player.manager.level
                ).toLowerCase();


            if (
                level.includes("elite")
            ) {

                multiplier +=
                    0.25;

            }

            else if (
                level.includes("alto") ||
                level.includes("high")
            ) {

                multiplier +=
                    0.15;

            }

        }

    }


    /*
     * =====================================================
     * FAMA
     * =====================================================
     */

    multiplier +=
        (
            player.fame ||
            0
        ) / 500;


    /*
     * =====================================================
     * HISTÓRICO COM A ORGANIZAÇÃO
     * =====================================================
     */

    let previousContracts = 0;


    if (
        typeof getPromotionHistory ===
        "function"
    ) {

        const history =
            getPromotionHistory(
                promotion.id
            );


        if (
            history
        ) {

            previousContracts =
                history.contracts ||
                0;

        }

    }


    /*
     * Segundo contrato e seguintes
     * ficam mais valiosos.
     */

    if (
        previousContracts > 0
    ) {

        multiplier +=
            Math.min(
                0.50,
                previousContracts *
                0.10
            );

    }


    /*
     * =====================================================
     * DESEMPENHO
     * =====================================================
     */

    const wins =
        player.professional
        ? (
            player.professional.wins ||
            0
        )
        : 0;


    const losses =
        player.professional
        ? (
            player.professional.losses ||
            0
        )
        : 0;


    /*
     * Cartel positivo aumenta poder
     * de negociação.
     */

    if (
        wins > losses
    ) {

        multiplier +=
            Math.min(
                0.30,
                (
                    wins -
                    losses
                ) / 30
            );

    }


    /*
     * =====================================================
     * NÚMERO DE LUTAS
     * =====================================================
     *
     * Entre 3 e 5.
     */

    const fights =
        3 +
        Math.floor(
            Math.random() * 3
        );


    /*
     * =====================================================
     * BOLSA
     * =====================================================
     */

    const purse =
        Math.round(
            promotion.basePurse *
            multiplier
        );


    /*
     * =====================================================
     * BÔNUS
     * =====================================================
     */

    const winBonus =
        Math.round(
            promotion.basePurse *
            multiplier
        );


    return {

        promotion:
            promotion,

        fights:
            fights,

        purse:
            purse,

        winBonus:
            winBonus,

        multiplier:
            multiplier

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

     * Estágio atual do lutador.

     *

     * Não alteramos automaticamente o estágio.

     * Uma proposta maior pode aparecer antes da hora.

     */

    const stage =

        player.careerStage ||

        "regional";

    /*

     * Procura organizações que o lutador

     * pode receber proposta.

     */

    const possible =

        promotions.filter(

            promotion => {

                /*

                 * Verifica requisitos.

                 */

                if (

                    !canReceiveOffer(

                        promotion

                    )

                ) {

                    return false;

                }

                /*

                 * Verifica se a organização

                 * combina com o jogador.

                 */

                if (

                    typeof promotionMatchesPlayer ===

                    "function"

                ) {

                    if (

                        !promotionMatchesPlayer(

                            promotion

                        )

                    ) {

                        return false;

                    }

                }

                return true;

            }

        );

    /*

     * =====================================================

     * ORDENAÇÃO DAS OPORTUNIDADES

     * =====================================================

     *

     * Organizações próximas do estágio atual

     * aparecem com mais frequência.

     *

     * Propostas acima do estágio são possíveis,

     * mas mais raras.

     */

    const stageLevel = {

        amateur: 0,

        regional: 1,

        national: 2,

        international: 3,

        elite: 4

    };

    const currentLevel =

        stageLevel[stage] || 1;

    const scored =

        possible.map(

            promotion => {

                let level =

                    promotion.level || 1;

                let score = 100;

                /*

                 * Organização abaixo/acima

                 * do estágio.

                 */

                if (

                    level <

                    currentLevel

                ) {

                    score -=

                        (

                            currentLevel -

                            level

                        ) * 20;

                }

                if (

                    level >

                    currentLevel

                ) {

                    /*

                     * Quanto maior o salto,

                     * mais difícil aparecer.

                     */

                    score -=

                        (

                            level -

                            currentLevel

                        ) * 35;

                }

                /*

                 * Fama ajuda a chamar

                 * organizações maiores.

                 */

                score +=

                    player.fame / 5;

                /*

                 * Empresário aumenta muito

                 * a chance de oportunidades.

                 */

                if (

                    player.manager

                ) {

                    score +=

                        (

                            player.manager.contacts ||

                            0

                        ) / 2;

                }

                /*

                 * Prestígio da organização.

                 */

                score +=

                    (

                        promotion.prestige ||

                        0

                    ) / 3;

                return {

                    promotion:

                        promotion,

                    score:

                        Math.max(

                            1,

                            score

                        )

                };

            }

        );

    /*

     * =====================================================

     * SORTEIO PONDERADO

     * =====================================================

     */

    function weightedRandom(list) {

        const total =

            list.reduce(

                (

                    sum,

                    item

                ) =>

                    sum +

                    item.score,

                0

            );

        let random =

            Math.random() *

            total;

        for (

            const item of list

        ) {

            random -=

                item.score;

            if (

                random <= 0

            ) {

                return item;

            }

        }

        return list[

            list.length - 1

        ];

    }

    const selected = [];

    const pool =

        [...scored];

    /*

     * No máximo 3 propostas.

     */

    while (

        pool.length > 0 &&

        selected.length < 3

    ) {

        const chosen =

            weightedRandom(

                pool

            );

        if (!chosen) {

            break;

        }

        selected.push(

            chosen.promotion

        );

        const index =

            pool.indexOf(

                chosen

            );

        if (

            index >= 0

        ) {

            pool.splice(

                index,

                1

            );

        }

    }

    /*

     * Transforma organizações

     * em ofertas financeiras.

     */

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
