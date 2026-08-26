/* =========================================================
   👔 SISTEMA DE EMPRESÁRIOS
   ========================================================= */
/* =========================================================
   GERAR COMISSÃO
========================================================= */
function randomManagerCommission(min, max) {
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
            randomManagerCommission(10, 15),
        contacts:
            20 +
            Math.floor(Math.random() * 16),
        negotiation:
            25 +
            Math.floor(Math.random() * 21),
        internationalAccess:
            10 +
            Math.floor(Math.random() * 16)
    },
    {
        name: "Lucas Ferreira",
        level: "Iniciante",
        levelNumber: 1,
        commission:
            randomManagerCommission(10, 15),
        contacts:
            20 +
            Math.floor(Math.random() * 16),
        negotiation:
            30 +
            Math.floor(Math.random() * 21),
        internationalAccess:
            15 +
            Math.floor(Math.random() * 16)
    },
    {
        name: "Bruno Almeida",
        level: "Iniciante",
        levelNumber: 1,
        commission:
            randomManagerCommission(10, 15),
        contacts:
            25 +
            Math.floor(Math.random() * 16),
        negotiation:
            25 +
            Math.floor(Math.random() * 21),
        internationalAccess:
            10 +
            Math.floor(Math.random() * 21)
    },
    /* =====================================================
       🔵 INTERMEDIÁRIOS
       ===================================================== */
    {
        name: "Rafael Costa",
        level: "Intermediário",
        levelNumber: 2,
        commission:
            randomManagerCommission(13, 20),
        contacts:
            40 +
            Math.floor(Math.random() * 31),
        negotiation:
            45 +
            Math.floor(Math.random() * 31),
        internationalAccess:
            35 +
            Math.floor(Math.random() * 31)
    },
    {
        name: "André Silva",
        level: "Intermediário",
        levelNumber: 2,
        commission:
            randomManagerCommission(13, 20),
        contacts:
            45 +
            Math.floor(Math.random() * 31),
        negotiation:
            50 +
            Math.floor(Math.random() * 31),
        internationalAccess:
            40 +
            Math.floor(Math.random() * 31)
    },
    {
        name: "Thiago Rodrigues",
        level: "Intermediário",
        levelNumber: 2,
        commission:
            randomManagerCommission(13, 20),
        contacts:
            40 +
            Math.floor(Math.random() * 36),
        negotiation:
            55 +
            Math.floor(Math.random() * 26),
        internationalAccess:
            45 +
            Math.floor(Math.random() * 26)
    },
    {
        name: "Felipe Martins",
        level: "Intermediário",
        levelNumber: 2,
        commission:
            randomManagerCommission(13, 20),
        contacts:
            50 +
            Math.floor(Math.random() * 26),
        negotiation:
            45 +
            Math.floor(Math.random() * 36),
        internationalAccess:
            40 +
            Math.floor(Math.random() * 31)
    },
    /* =====================================================
       🟣 ELITE
       ===================================================== */
    {
        name: "Marcos Oliveira",
        level: "Elite",
        levelNumber: 3,
        commission:
            randomManagerCommission(15, 25),
        contacts:
            80 +
            Math.floor(Math.random() * 21),
        negotiation:
            75 +
            Math.floor(Math.random() * 26),
        internationalAccess:
            75 +
            Math.floor(Math.random() * 26)
    },
    {
        name: "Eduardo Martins",
        level: "Elite",
        levelNumber: 3,
        commission:
            randomManagerCommission(15, 25),
        contacts:
            85 +
            Math.floor(Math.random() * 16),
        negotiation:
            80 +
            Math.floor(Math.random() * 21),
        internationalAccess:
            80 +
            Math.floor(Math.random() * 21)
    },
    {
        name: "Ricardo Fernandes",
        level: "Elite",
        levelNumber: 3,
        commission:
            randomManagerCommission(15, 25),
        contacts:
            90 +
            Math.floor(Math.random() * 11),
        negotiation:
            85 +
            Math.floor(Math.random() * 16),
        internationalAccess:
            85 +
            Math.floor(Math.random() * 16)
    }
];
/* =========================================================
   REQUISITOS PARA APARECER EMPRESÁRIO
========================================================= */
function canOfferManager(manager) {
    const fame =
        player.fame || 0;
    const wins =
        player.professional
        ? (
            player.professional.wins || 0
        )
        : 0;
    if (manager.levelNumber === 1) {
        return true;
    }
    if (manager.levelNumber === 2) {
        return (
            fame >= 10 ||
            wins >= 3
        );
    }
    if (manager.levelNumber === 3) {
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
                canOfferManager(manager)
        );
    const shuffled =
        [...possible].sort(
            () =>
                Math.random() - 0.5
        );
    const selected =
        shuffled.slice(0, 3);
    player.managerOffers =
        selected.map(
            manager => ({
                ...manager
            })
        );
}
/* =========================================================
   CRIAR CONTRATO DO EMPRESÁRIO
========================================================= */
function createManagerContract(manager) {
    /*
     * Contrato inicial padrão:
     * 4 anos.
     *
     * 1 ano = 52 semanas.
     */
    return {
        active: true,
        durationYears: 4,
        remainingYears: 4,
        remainingWeeks: 208,
        commission:
            Number(
                manager.commission || 0
            ),
        managerName:
            manager.name,
        startedYear:
            Number(
                player.year || 2026
            ),
        startedWeek:
            Number(
                player.week || 1
            )
    };
}
/* =========================================================
   GARANTIR CONTRATO DO EMPRESÁRIO
========================================================= */
function ensureManagerContract() {
    if (!player.manager) {
        return;
    }
    /*
     * Compatibilidade com carreiras
     * criadas antes deste sistema.
     */
    if (!player.managerContract) {
        player.managerContract =
            createManagerContract(
                player.manager
            );
        save();
    }
}
/* =========================================================
   CONTRATAR EMPRESÁRIO
========================================================= */
function hireManager(index) {
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
    /*
     * Cria contrato de 4 anos.
     */
    player.managerContract =
        createManagerContract(
            manager
        );
    /*
     * Remove eventual aviso antigo.
     */
    player.managerContractExpired =
        false;
    player.log =
        player.log || [];
    player.log.unshift(
        "👔 " +
        manager.name +
        " tornou-se seu empresário " +
        "com contrato de 4 anos."
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
        "Contrato: 4 anos\n\n" +
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
   PROCESSAR CONTRATO NA VIRADA DO ANO
========================================================= */
function processManagerContractYear() {
    if (!player.manager) {
        return;
    }
    ensureManagerContract();
    const contract =
        player.managerContract;
    if (!contract || !contract.active) {
        return;
    }
    /*
     * O contrato só diminui quando
     * começa um novo ano.
     *
     * Não diminui semana a semana.
     */
    contract.remainingYears =
        Math.max(
            0,
            Number(
                contract.remainingYears || 0
            ) - 1
        );
    contract.remainingWeeks =
        Math.max(
            0,
            Number(
                contract.remainingWeeks || 0
            ) - 52
        );
    /*
     * Contrato terminou.
     */
    if (
        contract.remainingYears <= 0
    ) {
        contract.remainingYears = 0;
        contract.remainingWeeks = 0;
        contract.active = false;
        player.managerContractExpired =
            true;
        player.log =
            player.log || [];
        player.log.unshift(
            "📄 O contrato com " +
            player.manager.name +
            " chegou ao fim."
        );
        save();
        return;
    }
    save();
}
/* =========================================================
   VERIFICAR CONTRATO NO INÍCIO
========================================================= */
function getManagerContractStatus() {
    if (!player.manager) {
        return null;
    }
    ensureManagerContract();
    return player.managerContract;
}
/* =========================================================
   RENOVAR CONTRATO
========================================================= */
function renewManagerContract() {
    if (!player.manager) {
        return;
    }
    ensureManagerContract();
    const oldContract =
        player.managerContract;
    /*
     * Só permite renovação depois
     * do término do contrato.
     */
    if (
        oldContract &&
        oldContract.active
    ) {
        alert(
            "📄 Seu contrato atual ainda está ativo."
        );
        return;
    }
    const manager =
        player.manager;
    /*
     * Por enquanto a renovação mantém
     * a comissão atual.
     *
     * O sistema de negociação da porcentagem
     * será usado nesta etapa posteriormente.
     */
    player.managerContract = {
        active: true,
        durationYears: 4,
        remainingYears: 4,
        remainingWeeks: 208,
        commission:
            Number(
                manager.commission || 0
            ),
        managerName:
            manager.name,
        startedYear:
            Number(
                player.year || 2026
            ),
        startedWeek:
            Number(
                player.week || 1
            )
    };
    player.managerContractExpired =
        false;
    player.log =
        player.log || [];
    player.log.unshift(
        "🔄 Contrato renovado com " +
        manager.name +
        " por mais 4 anos."
    );
    save();
    alert(
        "🔄 CONTRATO RENOVADO!\n\n" +
        manager.name +
        "\n\n" +
        "Duração: 4 anos\n" +
        "Comissão: " +
        manager.commission +
        "%"
    );
    if (
        typeof home === "function"
    ) {
        home();
    }
}
/* =========================================================
   NÃO RENOVAR
========================================================= */
function declineManagerRenewal() {
    if (!player.manager) {
        return;
    }
    const managerName =
        player.manager.name;
    player.log =
        player.log || [];
    player.log.unshift(
        "🚪 Você decidiu não renovar " +
        "o contrato com " +
        managerName +
        "."
    );
    player.manager = null;
    player.managerContract = null;
    player.managerContractExpired =
        false;
    save();
    alert(
        "🚪 CONTRATO ENCERRADO\n\n" +
        "Você decidiu seguir sua carreira " +
        "sem empresário."
    );
    home();
}
/* =========================================================
   BÔNUS DE NEGOCIAÇÃO
========================================================= */
function getManagerNegotiationBonus() {
    if (!player.manager) {
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
    if (!player.manager) {
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
    if (!player.manager) {
        return 0;
    }
    return (
        player.manager.levelNumber ||
        1
    );
}
/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */
window.generateManagerOffers =
    generateManagerOffers;
window.hireManager =
    hireManager;
window.getManagerNegotiationBonus =
    getManagerNegotiationBonus;
window.getManagerInternationalAccess =
    getManagerInternationalAccess;
window.getManagerLevel =
    getManagerLevel;
window.createManagerContract =
    createManagerContract;
window.ensureManagerContract =
    ensureManagerContract;
window.processManagerContractYear =
    processManagerContractYear;
window.getManagerContractStatus =
    getManagerContractStatus;
window.renewManagerContract =
    renewManagerContract;
window.declineManagerRenewal =
    declineManagerRenewal;
