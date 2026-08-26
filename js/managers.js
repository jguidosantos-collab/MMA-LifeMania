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
   GERAR DURAÇÃO DO CONTRATO
========================================================= */

function randomManagerContractYears() {

    return (
        2 +
        Math.floor(
            Math.random() * 4
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
                Math.random() * 21
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


    if (
        manager.levelNumber === 1
    ) {

        return true;

    }


    if (
        manager.levelNumber === 2
    ) {

        return (
            fame >= 10 ||
            wins >= 3
        );

    }


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
   GERAR OFERTAS
========================================================= */

function generateManagerOffers() {

    player.managerOffers = [];


    /*
     * Não permite procurar outro empresário
     * enquanto existe contrato ativo.
     */

    if (
        player.manager &&
        player.manager.contract &&
        player.manager.contract.active
    ) {

        alert(
            "👔 Você já possui um contrato ativo com " +
            player.manager.name +
            ".\n\n" +
            "O contrato precisa terminar ou ser rescindido."
        );

        return;

    }


    const possible =
        managers.filter(
            manager =>
                canOfferManager(
                    manager
                )
        );


    const shuffled =
        [...possible].sort(
            () =>
                Math.random() -
                0.5
        );


    const selected =
        shuffled.slice(
            0,
            3
        );


    player.managerOffers =
        selected.map(
            manager => ({
                ...manager
            })
        );

}


/* =========================================================
   CALCULAR INDENIZAÇÃO
========================================================= */

function calculateManagerTerminationFee() {

    if (
        !player.manager
    ) {

        return 0;

    }


    const manager =
        player.manager;

    const yearsRemaining =
        manager.contract
        ? Number(
            manager.contract.yearsRemaining || 0
        )
        : 0;

    const estimatedIncome =
        Math.max(
            1000,
            Number(
                player.money || 0
            ) + 1000
        );


    return Math.round(
        estimatedIncome *
        (
            Number(
                manager.commission || 0
            ) / 100
        ) *
        Math.max(
            1,
            yearsRemaining
        )
    );

}


/* =========================================================
   CONTRATO ATIVO?
========================================================= */

function hasActiveManagerContract() {

    return !!(
        player.manager &&
        player.manager.contract &&
        player.manager.contract.active
    );

}


/* =========================================================
   CONTRATAR EMPRESÁRIO
========================================================= */

function hireManager(
    index
) {

    const manager =
        player.managerOffers
        ? player.managerOffers[index]
        : null;


    if (!manager) {

        return;

    }


    /*
     * Segurança:
     * não permite substituir empresário
     * durante contrato.
     */

    if (
        hasActiveManagerContract()
    ) {

        alert(
            "❌ Você já possui um empresário contratado.\n\n" +
            "O contrato ainda está ativo."
        );

        return;

    }


    const years =
        randomManagerContractYears();


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
            manager.internationalAccess,

        contract: {

            active:
                true,

            durationYears:
                years,

            yearsRemaining:
                years,

            startYear:
                Number(
                    player.year || 2026
                ),

            endYear:
                Number(
                    player.year || 2026
                ) + years,

            terminationFee:
                0

        }

    };


    player.log =
        player.log || [];


    player.log.unshift(

        "👔 " +
        manager.name +
        " tornou-se seu empresário por " +
        years +
        " anos."

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

        "Contrato: " +
        years +
        " anos\n\n" +

        "Término previsto: Ano " +
        (
            Number(
                player.year || 2026
            ) + years
        )

    );


    teamScreen();

}


/* =========================================================
   RESCINDIR CONTRATO PELO LUTADOR
========================================================= */

function terminateManagerContract() {

    if (
        !hasActiveManagerContract()
    ) {

        alert(
            "Você não possui um contrato ativo."
        );

        return;

    }


    const manager =
        player.manager;

    const fee =
        calculateManagerTerminationFee();


    const confirmed =
        confirm(

            "⚠️ RESCISÃO DE CONTRATO\n\n" +

            "Empresário: " +
            manager.name +
            "\n\n" +

            "Indenização estimada: $" +
            fee +
            "\n\n" +

            "Deseja realmente rescindir o contrato?"

        );


    if (!confirmed) {

        return;

    }


    /*
     * O advogado futuramente poderá
     * negociar/reduzir essa indenização.
     */

    if (
        Number(
            player.money || 0
        ) < fee
    ) {

        alert(

            "❌ Você não possui dinheiro suficiente " +
            "para pagar a indenização.\n\n" +

            "💰 Necessário: $" +
            fee +
            "\n" +

            "💵 Seu dinheiro: $" +
            Math.round(
                player.money || 0
            )

        );

        return;

    }


    player.money -=
        fee;


    player.log.unshift(

        "⚖️ Contrato com " +
        manager.name +
        " rescindido pelo lutador. " +
        "Indenização paga: $" +
        fee

    );


    player.manager = null;


    save();


    alert(

        "⚖️ CONTRATO RESCINDIDO!\n\n" +

        "Você pagou $" +
        fee +
        " de indenização."

    );


    teamScreen();

}


/* =========================================================
   EMPRESÁRIO RESCINDE
========================================================= */

function managerTerminatesContract() {

    if (
        !hasActiveManagerContract()
    ) {

        return;

    }


    const manager =
        player.manager;


    const compensation =
        Math.round(

            Math.max(
                1000,
                Number(
                    player.money || 0
                ) + 1000
            ) *

            (
                Number(
                    manager.commission || 0
                ) / 100
            ) *

            Math.max(
                1,
                Number(
                    manager.contract.yearsRemaining || 1
                )
            )

        );


    player.money +=
        compensation;


    player.log.unshift(

        "👔 " +
        manager.name +
        " encerrou o contrato. " +
        "Indenização recebida: $" +
        compensation

    );


    player.manager = null;


    save();


    alert(

        "👔 CONTRATO ENCERRADO PELO EMPRESÁRIO!\n\n" +

        manager.name +
        " decidiu encerrar a parceria.\n\n" +

        "💰 Indenização recebida: $" +
        compensation

    );


    teamScreen();

}


/* =========================================================
   PASSAGEM DE ANO DO CONTRATO
========================================================= */

function processManagerContractYear() {

    if (
        !hasActiveManagerContract()
    ) {

        return;

    }


    const contract =
        player.manager.contract;


    /*
     * O ano só é descontado
     * uma vez quando começa
     * uma nova temporada.
     */

    if (
        contract.lastProcessedYear ===
        player.year
    ) {

        return;

    }


    contract.lastProcessedYear =
        player.year;


    contract.yearsRemaining =
        Math.max(
            0,
            Number(
                contract.yearsRemaining || 0
            ) - 1
        );


    /*
     * CONTRATO EXPIRADO
     */

    if (
        contract.yearsRemaining <= 0
    ) {

        contract.active =
            false;


        player.log =
            player.log || [];


        player.log.unshift(

            "📄 O contrato com " +
            player.manager.name +
            " chegou ao fim."

        );


        alert(

            "📄 CONTRATO ENCERRADO!\n\n" +

            "O contrato com " +
            player.manager.name +
            " terminou.\n\n" +

            "Agora você pode:\n" +

            "• Renegociar a comissão\n" +

            "• Continuar com o empresário\n" +

            "• Procurar outro empresário"

        );

    }


    save();

}


/* =========================================================
   RENOVAR / RENEGOCIAR CONTRATO
========================================================= */

function renegotiateManagerContract() {

    if (
        !player.manager
    ) {

        return;

    }


    const manager =
        player.manager;


    if (
        manager.contract &&
        manager.contract.active
    ) {

        alert(
            "O contrato ainda está ativo."
        );

        return;

    }


    const currentCommission =
        Number(
            manager.commission || 0
        );


    const bonus =
        Math.round(
            getManagerNegotiationBonus()
        );


    let suggested =
        currentCommission -
        Math.floor(
            bonus / 4
        );


    suggested =
        Math.max(
            5,
            Math.min(
                30,
                suggested
            )
        );


    const requested =
        prompt(

            "🤝 RENEGOCIAÇÃO\n\n" +

            "Comissão atual: " +
            currentCommission +
            "%\n\n" +

            "O empresário sugere aproximadamente: " +
            suggested +
            "%\n\n" +

            "Digite a nova comissão desejada:"

        );


    if (
        requested === null
    ) {

        return;

    }


    const newCommission =
        Number(
            requested
        );


    if (
        !Number.isFinite(
            newCommission
        ) ||
        newCommission < 5 ||
        newCommission > 30
    ) {

        alert(
            "A comissão deve ficar entre 5% e 30%."
        );

        return;

    }


    const difference =
        Math.abs(
            newCommission -
            currentCommission
        );


    const negotiation =
        Number(
            manager.negotiation || 0
        );


    const chance =
        Math.max(
            20,
            Math.min(
                95,
                80 +
                negotiation -
                difference * 5
            )
        );


    if (
        Math.random() * 100 >
        chance
    ) {

        alert(

            "❌ NEGOCIAÇÃO RECUSADA!\n\n" +

            manager.name +
            " não aceitou essa comissão."

        );

        return;

    }


    const years =
        randomManagerContractYears();


    manager.commission =
        newCommission;


    manager.contract = {

        active:
            true,

        durationYears:
            years,

        yearsRemaining:
            years,

        startYear:
            Number(
                player.year || 2026
            ),

        endYear:
            Number(
                player.year || 2026
            ) + years,

        terminationFee:
            0

    };


    player.log.unshift(

        "🤝 Contrato renegociado com " +
        manager.name +
        ". Comissão: " +
        newCommission +
        "% por " +
        years +
        " anos."

    );


    save();


    alert(

        "🤝 CONTRATO RENEGOCIADO!\n\n" +

        "Comissão: " +
        newCommission +
        "%\n\n" +

        "Novo contrato: " +
        years +
        " anos"

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
