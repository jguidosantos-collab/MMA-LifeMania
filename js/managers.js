/* =========================================================
   👔 SISTEMA DE EMPRESÁRIOS
   ========================================================= */


/* =========================================================
   GERAR COMISSÃO
========================================================= */

function randomManagerCommission(
    min,
    max
) {

    return Math.floor(
        min +
        Math.random() *
        (
            max -
            min +
            1
        )
    );

}


/* =========================================================
   BANCO DE EMPRESÁRIOS
========================================================= */

const managers = [

    /* =====================================================
       🟢 INICIANTES
       ===================================================== */

    {
        name: "Carlos Mendes",
        level: "Iniciante",
        levelNumber: 1,

        commission:
            randomManagerCommission(
                10,
                15
            ),

        contacts:
            20 +
            Math.floor(
                Math.random() * 16
            ),

        negotiation:
            25 +
            Math.floor(
                Math.random() * 21
            ),

        internationalAccess:
            10 +
            Math.floor(
                Math.random() * 16
            )

    },

    {
        name: "Lucas Ferreira",
        level: "Iniciante",
        levelNumber: 1,

        commission:
            randomManagerCommission(
                10,
                15
            ),

        contacts:
            20 +
            Math.floor(
                Math.random() * 16
            ),

        negotiation:
            30 +
            Math.floor(
                Math.random() * 21
            ),

        internationalAccess:
            15 +
            Math.floor(
                Math.random() * 16
            )

    },

    {
        name: "Bruno Almeida",
        level: "Iniciante",
        levelNumber: 1,

        commission:
            randomManagerCommission(
                10,
                15
            ),

        contacts:
            25 +
            Math.floor(
                Math.random() * 16
            ),

        negotiation:
            25 +
            Math.floor(
                Math.random() * 21
            ),

        internationalAccess:
            10 +
            Math.floor(
                Math.random() * 21
            )

    },


    /* =====================================================
       🔵 INTERMEDIÁRIOS
       ===================================================== */

    {
        name: "Rafael Costa",
        level: "Intermediário",
        levelNumber: 2,

        commission:
            randomManagerCommission(
                13,
                20
            ),

        contacts:
            40 +
            Math.floor(
                Math.random() * 31
            ),

        negotiation:
            45 +
            Math.floor(
                Math.random() * 31
            ),

        internationalAccess:
            35 +
            Math.floor(
                Math.random() * 31
            )

    },

    {
        name: "André Silva",
        level: "Intermediário",
        levelNumber: 2,

        commission:
            randomManagerCommission(
                13,
                20
            ),

        contacts:
            45 +
            Math.floor(
                Math.random() * 31
            ),

        negotiation:
            50 +
            Math.floor(
                Math.random() * 31
            ),

        internationalAccess:
            40 +
            Math.floor(
                Math.random() * 31
            )

    },

    {
        name: "Thiago Rodrigues",
        level: "Intermediário",
        levelNumber: 2,

        commission:
            randomManagerCommission(
                13,
                20
            ),

        contacts:
            40 +
            Math.floor(
                Math.random() * 36
            ),

        negotiation:
            55 +
            Math.floor(
                Math.random() * 26
            ),

        internationalAccess:
            45 +
            Math.floor(
                Math.random() * 26
            )

    },

    {
        name: "Felipe Martins",
        level: "Intermediário",
        levelNumber: 2,

        commission:
            randomManagerCommission(
                13,
                20
            ),

        contacts:
            50 +
            Math.floor(
                Math.random() * 26
            ),

        negotiation:
            45 +
            Math.floor(
                Math.random() * 36
            ),

        internationalAccess:
            40 +
            Math.floor(
                Math.random() * 31
            )

    },


    /* =====================================================
       🟣 ELITE
       ===================================================== */

    {
        name: "Marcos Oliveira",
        level: "Elite",
        levelNumber: 3,

        commission:
            randomManagerCommission(
                15,
                25
            ),

        contacts:
            80 +
            Math.floor(
                Math.random() * 21
            ),

        negotiation:
            75 +
            Math.floor(
                Math.random() * 26
            ),

        internationalAccess:
            75 +
            Math.floor(
                Math.random() * 26
            )

    },

    {
        name: "Eduardo Martins",
        level: "Elite",
        levelNumber: 3,

        commission:
            randomManagerCommission(
                15,
                25
            ),

        contacts:
            85 +
            Math.floor(
                Math.random() * 16
            ),

        negotiation:
            80 +
            Math.floor(
                Math.random() * 21
            ),

        internationalAccess:
            80 +
            Math.floor(
                Math.random() * 21
            )

    },

    {
        name: "Ricardo Fernandes",
        level: "Elite",
        levelNumber: 3,

        commission:
            randomManagerCommission(
                15,
                25
            ),

        contacts:
            90 +
            Math.floor(
                Math.random() * 11
            ),

        negotiation:
            85 +
            Math.floor(
                Math.random() * 16
            ),

        internationalAccess:
            85 +
            Math.floor(
                Math.random() * 16
            )

    }

];


/* =========================================================
   REQUISITOS PARA APARECER EMPRESÁRIO
========================================================= */

function canOfferManager(
    manager
) {

    const fame =
        player.fame || 0;

    const wins =
        player.professional
        ? (
            player.professional.wins ||
            0
        )
        : 0;


    /* =====================================================
       🟢 INICIANTE
       ===================================================== */

    if (
        manager.levelNumber === 1
    ) {

        return true;

    }


    /* =====================================================
       🔵 INTERMEDIÁRIO
       ===================================================== */

    if (
        manager.levelNumber === 2
    ) {

        return (
            fame >= 10 ||
            wins >= 3
        );

    }


    /* =====================================================
       🟣 ELITE
       ===================================================== */

    if (
        manager.levelNumber === 3
    ) {

        return (
            fame >= 35 &&
            wins >= 7
        );

    }


    return false;

}


/* =========================================================
   GERAR OFERTAS DE EMPRESÁRIOS
========================================================= */

function generateManagerOffers() {

    player.managerOffers = [];


    const possible =
        managers.filter(
            manager =>
                canOfferManager(
                    manager
                )
        );


    /*
     * Embaralha.
     */

    const shuffled =
        [...possible].sort(
            () =>
                Math.random() -
                0.5
        );


    /*
     * Máximo de 3 propostas.
     */

    const selected =
        shuffled.slice(
            0,
            3
        );


    /*
     * Criamos uma cópia do empresário
     * para que a comissão seja individual.
     */

    player.managerOffers =
        selected.map(
            manager => ({

                ...manager

            })
        );

}


/* =========================================================
   CONTRATAR EMPRESÁRIO
========================================================= */

function hireManager(
    index
) {

    const manager =
        player.managerOffers[
            index
        ];


    if (!manager) {

        return;

    }


    player.manager = {

        name:
            manager.name,

        level:
            manager.level,

        levelNumber:
            manager.levelNumber,

        commission:
            manager.commission,

        contacts:
            manager.contacts,

        negotiation:
            manager.negotiation,

        internationalAccess:
            manager.internationalAccess

    };


    player.log.unshift(

        "👔 " +
        manager.name +
        " tornou-se seu empresário."

    );


    save();


    alert(

        "👔 EMPRESÁRIO CONTRATADO!\n\n" +

        manager.name +

        "\n\n" +

        "Nível: " +
        manager.level +

        "\n" +

        "Comissão: " +
        manager.commission +
        "%\n\n" +

        "Contatos: " +
        manager.contacts +
        "\n" +

        "Negociação: " +
        manager.negotiation +
        "\n" +

        "Acesso internacional: " +
        manager.internationalAccess

    );


    teamScreen();

}


/* =========================================================
   BÔNUS DE NEGOCIAÇÃO
========================================================= */

function getManagerNegotiationBonus() {

    if (
        !player.manager
    ) {

        return 0;

    }


    const negotiation =
        player.manager.negotiation ||
        0;


    /*
     * 0–100 de negociação
     *
     * Pode gerar aproximadamente
     * 0% até 20% de aumento.
     */

    return (
        negotiation / 5
    );

}


/* =========================================================
   ACESSO INTERNACIONAL
========================================================= */

function getManagerInternationalAccess() {

    if (
        !player.manager
    ) {

        return 0;

    }


    return (
        player.manager
            .internationalAccess ||
        0
    );

}


/* =========================================================
   NÍVEL DO EMPRESÁRIO
========================================================= */

function getManagerLevel() {

    if (
        !player.manager
    ) {

        return 0;

    }


    return (
        player.manager.levelNumber ||
        1
    );

}
