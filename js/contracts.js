/* =========================================================
   CONTRATOS — MMA LIFE DYNASTY
   SISTEMA DEFINITIVO DE CONTRATOS
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


    if (!player.manager) {

        return 1;

    }


    return (
        1 +
        contacts / 250
    );

}


/* =========================================================
   DESEMPENHO
========================================================= */

function getPerformanceMultiplier() {

    const professional =
        player.professional || {};


    const wins =
        professional.wins || 0;

    const losses =
        professional.losses || 0;


    const fights =
        wins + losses;


    if (fights <= 0) {

        return 1;

    }


    const winRate =
        wins / fights;


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
   ESTÁGIO DA CARREIRA
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


/* =========================================================
   OFERTA DE CONTRATO
========================================================= */

function calculateContractOffer(promotion) {

    let multiplier = 1;


    /* =====================================================
       EMPRESÁRIO
    ===================================================== */

    if (player.manager) {

        multiplier +=
            (
                player.manager.contacts ||
                0
            ) / 200;


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

                multiplier += 0.25;

            }

            else if (
                level.includes("alto") ||
                level.includes("high")
            ) {

                multiplier += 0.15;

            }

        }

    }


    /* =====================================================
       FAMA
    ===================================================== */

    multiplier +=
        (
            player.fame ||
            0
        ) / 500;


    /* =====================================================
       HISTÓRICO
    ===================================================== */

    let previousContracts = 0;


    if (
        typeof getPromotionHistory ===
        "function"
    ) {

        const history =
            getPromotionHistory(
                promotion.id
            );


        if (history) {

            previousContracts =
                history.contracts || 0;

        }

    }


    if (
        previousContracts > 0
    ) {

        multiplier +=
            Math.min(
                0.50,
                previousContracts * 0.10
            );

    }


    /* =====================================================
       DESEMPENHO
    ===================================================== */

    const performance =
        getPerformanceMultiplier();


    multiplier *=
        performance;


    /* =====================================================
       NÚMERO DE LUTAS
    ===================================================== */

    const fights =
        generateContractLength(
            promotion
        );


    /* =====================================================
       BOLSA
    ===================================================== */

    const basePurse =
        calculateBasePurse(
            promotion
        );


    const purse =
        Math.round(
            basePurse *
            multiplier
        );


    /* =====================================================
       BÔNUS DE VITÓRIA
    ===================================================== */

    const baseWinBonus =
        calculateBaseWinBonus(
            promotion
        );


    const winBonus =
        Math.round(
            baseWinBonus *
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
       REGIONAL
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
       NACIONAL
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
       INTERNACIONAL
    ===================================================== */

    if (
        promotion.careerStage ===
        "international"
    ) {

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


        if (
            stage === "international" ||
            stage === "elite"
        ) {

            return (
                wins >= 5 &&
                fame >= 25
            );

        }


        /* =================================================
           SALTO REGIONAL → INTERNACIONAL
        ================================================= */

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
       ELITE / UFC
    ===================================================== */

    if (
        promotion.careerStage ===
        "elite"
    ) {

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


        /* =================================================
           INTERNACIONAL → ELITE
        ================================================= */

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


        /* =================================================
           NACIONAL → ELITE
        ================================================= */

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


        /* =================================================
           REGIONAL → ELITE
        ================================================= */

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


        /* =================================================
           JÁ ESTÁ NA ELITE
        ================================================= */

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
   OPORTUNIDADES ESTRANGEIRAS
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

    if (
        promotion.international
    ) {

        return true;

    }


    if (
        !player.country
    ) {

        return true;

    }


    if (
        promotion.country ===
        player.country
    ) {

        return true;

    }


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


    const stage =
        player.careerStage ||
        "regional";


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


    /* =====================================================
       NÍVEIS
    ===================================================== */

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

                const level =
                    promotion.level || 1;


                let score = 100;


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

                    score -=
                        (
                            level -
                            currentLevel
                        ) * 35;

                }


                score +=
                    (
                        player.fame || 0
                    ) / 5;


                if (
                    player.manager
                ) {

                    score +=
                        (
                            player.manager.contacts ||
                            0
                        ) / 2;

                }


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


    /* =====================================================
       SORTEIO PONDERADO
    ===================================================== */

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


    /* =====================================================
       NO MÁXIMO 3 PROPOSTAS
    ===================================================== */

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

    ensureContractPlayer();


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

        fightsCompleted:
            0,

        purse:
            offer.purse,

        winBonus:
            offer.winBonus,

        active:
            true,

        contractNumber:
            (
                getPromotionHistory(
                    promotion.id
                ).contracts || 0
            ) + 1

    };


    const history =
        getPromotionHistory(
            promotion.id
        );


    history.contracts++;


    player.log =
        player.log || [];


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

    ensureContractPlayer();


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


        player.money =
            Number(
                player.money || 0
            ) +
            Number(
                contract.winBonus || 0
            );

    }

    else {

        history.losses++;

    }


    /* =====================================================
       BOLSA DA LUTA
       É PAGA SEMPRE
    ===================================================== */

    player.money =
        Number(
            player.money || 0
        ) +
        Number(
            contract.purse || 0
        );


    /* =====================================================
       CONTRATO TERMINOU
       NÃO RENOVA AUTOMATICAMENTE
    ===================================================== */

    if (
        contract.fightsCompleted >=
        contract.fights
    ) {

        contract.active =
            false;


        contract.status =
            "finished";


        player.contractNegotiation =
            true;


        player.log =
            player.log || [];


        player.log.unshift(

            "📄 CONTRATO ENCERRADO: " +
            contract.promotionName

        );


        player.log.unshift(

            "🤝 Você pode aceitar uma nova proposta, " +
            "recusar ou negociar."

        );

    }


    save();

}


/* =========================================================
   VERIFICAR SE EXISTE CONTRATO ENCERRADO
========================================================= */

function isContractFinished() {

    if (
        !player.currentContract
    ) {

        return false;

    }


    return (
        player.currentContract.active === false &&
        player.currentContract.status === "finished"
    );

}


/* =========================================================
   NOVA NEGOCIAÇÃO
========================================================= */

function negotiateContract() {

    ensureContractPlayer();


    if (
        !isContractFinished()
    ) {

        return null;

    }


    const offers =
        generateContractOffers();


    player.contractNegotiation =
        true;


    save();


    return offers;

}


/* =========================================================
   RECUSAR RENOVAÇÃO
========================================================= */

function declineContract() {

    ensureContractPlayer();


    if (
        !player.currentContract
    ) {

        return;

    }


    if (
        player.currentContract.active
    ) {

        return;

    }


    player.contractNegotiation =
        false;


    player.currentContract =
        null;


    player.currentPromotion =
        null;


    player.log =
        player.log || [];


    player.log.unshift(

        "❌ Proposta de continuidade recusada."

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
   NOVA OFERTA APÓS CONTRATO
========================================================= */

function generatePostContractOffers() {

    ensureContractPlayer();


    if (
        !player.currentContract
    ) {

        return [];

    }


    if (
        player.currentContract.active
    ) {

        return [];

    }


    return generateContractOffers();

}


/* =========================================================
   GERAR OFERTA DE RENOVAÇÃO
========================================================= */

function generateRenewalOffer() {

    ensureContractPlayer();


    if (
        !player.currentContract
    ) {

        return null;

    }


    if (
        player.currentContract.active
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
   RENOVAR CONTRATO
========================================================= */

function renewContract() {

    ensureContractPlayer();


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

        fightsCompleted:
            0,

        purse:
            offer.purse,

        winBonus:
            offer.winBonus,

        active:
            true,

        status:
            "active",

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


    player.contractNegotiation =
        false;


    player.currentPromotion =
        offer.promotion;


    player.log =
        player.log || [];


    player.log.unshift(

        "🔄 Contrato renovado com " +
        offer.promotion.name

    );


    player.log.unshift(

        "💰 Nova bolsa: $" +
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
   GARANTIR PLAYER
   Evita erro caso contracts.js seja carregado
   antes de player.js em alguma situação.
========================================================= */

function ensureContractPlayer() {

    if (
        typeof window.player ===
        "undefined" ||
        !window.player
    ) {

        if (
            typeof createDefaultPlayer ===
            "function"
        ) {

            window.player =
                createDefaultPlayer();

        }

    }


    if (!player.log) {

        player.log = [];

    }

}


/* =========================================================
   COMPATIBILIDADE GLOBAL
========================================================= */

window.getPromotionHistory =
    getPromotionHistory;

window.getManagerNegotiation =
    getManagerNegotiation;

window.getNegotiationMultiplier =
    getNegotiationMultiplier;

window.getPerformanceMultiplier =
    getPerformanceMultiplier;

window.getPromotionMultiplier =
    getPromotionMultiplier;

window.generateContractLength =
    generateContractLength;

window.calculateBasePurse =
    calculateBasePurse;

window.calculateBaseWinBonus =
    calculateBaseWinBonus;

window.getCareerStageLabel =
    getCareerStageLabel;

window.calculateContractOffer =
    calculateContractOffer;

window.canReceiveOffer =
    canReceiveOffer;

window.foreignOpportunityChance =
    foreignOpportunityChance;

window.promotionMatchesPlayer =
    promotionMatchesPlayer;

window.generateContractOffers =
    generateContractOffers;

window.acceptPromotion =
    acceptPromotion;

window.registerContractFight =
    registerContractFight;

window.isContractFinished =
    isContractFinished;

window.negotiateContract =
    negotiateContract;

window.declineContract =
    declineContract;

window.generatePostContractOffers =
    generatePostContractOffers;

window.generateRenewalOffer =
    generateRenewalOffer;

window.renewContract =
    renewContract;
