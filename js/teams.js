/* =========================================================
   MMA LIFE DYNASTY
   TEAM.JS
   SISTEMA DE EQUIPE
   COMPATÍVEL COM MAIN.JS + MANAGERS.JS + CONTRACTS.JS
========================================================= */
/* =========================================================
   UTILIDADES
========================================================= */
function teamGetElement(id) {
    return document.getElementById(id);
}
/* =========================================================
   GARANTIR PLAYER
========================================================= */
function ensureTeamPlayer() {
    if (
        typeof window.player === "undefined" ||
        !window.player
    ) {
        if (
            typeof createDefaultPlayer === "function"
        ) {
            window.player =
                createDefaultPlayer();
        }
    }
}
/* =========================================================
   GARANTIR OFERTAS
========================================================= */
function ensureManagerOffers() {
    ensureTeamPlayer();
    if (
        !Array.isArray(
            player.managerOffers
        )
    ) {
        player.managerOffers = [];
    }
}
/* =========================================================
   TELA PRINCIPAL DA EQUIPE
========================================================= */
function teamScreen() {
    ensureTeamPlayer();
    ensureManagerOffers();
    const content =
        teamGetElement("content");
    if (!content) {
        console.error(
            "Elemento #content não encontrado."
        );
        return;
    }
    /* =====================================================
       SEM EMPRESÁRIO
    ===================================================== */
    if (!player.manager) {
        renderManagerSearch();
        return;
    }
    /* =====================================================
       COM EMPRESÁRIO
    ===================================================== */
    renderCurrentManager();
}
/* =========================================================
   PROCURAR EMPRESÁRIO
========================================================= */
function renderManagerSearch() {
    ensureManagerOffers();
    const content =
        teamGetElement("content");
    if (!content) {
        return;
    }
    /*
     * Se não existem ofertas,
     * gera automaticamente.
     */
    if (
        player.managerOffers.length === 0 &&
        typeof generateManagerOffers === "function"
    ) {
        generateManagerOffers();
    }
    const offers =
        player.managerOffers || [];
    let offersHTML = "";
    if (offers.length === 0) {
        offersHTML = `
            <div class="card">
                <div class="title">
                    👔 NENHUM EMPRESÁRIO DISPONÍVEL
                </div>
                <p>
                    No momento nenhum empresário
                    está interessado em representar
                    você.
                </p>
                <button
                    class="main-button"
                    onclick="refreshManagerOffers()">
                    🔄 PROCURAR NOVAMENTE
                </button>
            </div>
        `;
    }
    else {
        offersHTML =
            offers.map(
                function(manager, index) {
                    return `
                        <div class="card">
                            <div class="title">
                                👔 ${manager.name}
                            </div>
                            <div class="statline">
                                <span>
                                    Nível
                                </span>
                                <b>
                                    ${manager.level}
                                </b>
                            </div>
                            <div class="statline">
                                <span>
                                    Comissão
                                </span>
                                <b>
                                    ${manager.commission}%
                                </b>
                            </div>
                            <div class="statline">
                                <span>
                                    Contatos
                                </span>
                                <b>
                                    ${manager.contacts}
                                </b>
                            </div>
                            <div class="statline">
                                <span>
                                    Negociação
                                </span>
                                <b>
                                    ${manager.negotiation}
                                </b>
                            </div>
                            <div class="statline">
                                <span>
                                    Acesso internacional
                                </span>
                                <b>
                                    ${manager.internationalAccess}
                                </b>
                            </div>
                            <button
                                class="green"
                                onclick="hireManager(${index})">
                                🤝 CONTRATAR
                            </button>
                        </div>
                    `;
                }
            ).join("");
    }
    content.innerHTML = `
        <div class="card">
            <div class="title">
                👔 EMPRESÁRIO
            </div>
            <p>
                Um bom empresário pode abrir portas,
                melhorar seus contratos e facilitar
                oportunidades internacionais.
            </p>
        </div>
        ${offersHTML}
        <div class="card">
            <button
                class="main-button"
                onclick="refreshManagerOffers()">
                🔎 PROCURAR EMPRESÁRIOS
            </button>
        </div>
    `;
}
/* =========================================================
   ATUALIZAR OFERTAS
========================================================= */
function refreshManagerOffers() {
    ensureTeamPlayer();
    player.managerOffers = [];
    if (
        typeof generateManagerOffers ===
        "function"
    ) {
        generateManagerOffers();
    }
    save();
    teamScreen();
}
/* =========================================================
   EMPRESÁRIO ATUAL
========================================================= */
function renderCurrentManager() {
    ensureTeamPlayer();
    const content =
        teamGetElement("content");
    if (!content) {
        return;
    }
    const manager =
        player.manager;
    if (!manager) {
        renderManagerSearch();
        return;
    }
    let contract = null;
    if (
        typeof ensureManagerContract ===
        "function"
    ) {
        contract =
            ensureManagerContract();
    }
    else {
        contract =
            player.managerContract ||
            null;
    }
    const active =
        contract &&
        contract.active;
    const remainingYears =
        contract
        ?
        Number(
            contract.yearsRemaining ??
            contract.remainingYears ??
            0
        )
        :
        0;
    const remainingWeeks =
        contract
        ?
        Number(
            contract.remainingWeeks || 0
        )
        :
        0;
    content.innerHTML = `
        <div class="card">
            <div class="title">
                👔 SEU EMPRESÁRIO
            </div>
            <div class="fighter-card">
                <div class="fighter-avatar">
                    👔
                </div>
                <div class="fighter-info">
                    <h2>
                        ${manager.name}
                    </h2>
                    <p>
                        ${manager.level || "Empresário"}
                    </p>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="title">
                📊 ATRIBUTOS
            </div>
            <div class="statline">
                <span>
                    Nível
                </span>
                <b>
                    ${manager.level || "-"}
                </b>
            </div>
            <div class="statline">
                <span>
                    Contatos
                </span>
                <b>
                    ${manager.contacts || 0}
                </b>
            </div>
            <div class="statline">
                <span>
                    Negociação
                </span>
                <b>
                    ${manager.negotiation || 0}
                </b>
            </div>
            <div class="statline">
                <span>
                    Acesso internacional
                </span>
                <b>
                    ${manager.internationalAccess || 0}
                </b>
            </div>
            <div class="statline">
                <span>
                    Comissão
                </span>
                <b>
                    ${manager.commission || 0}%
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                📄 CONTRATO DO EMPRESÁRIO
            </div>
            ${
                active
                ?
                `
                    <div class="statline">
                        <span>
                            Status
                        </span>
                        <b>
                            🟢 Ativo
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Duração restante
                        </span>
                        <b>
                            ${remainingYears} anos
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Semanas restantes
                        </span>
                        <b>
                            ${remainingWeeks}
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Comissão
                        </span>
                        <b>
                            ${contract.commission || manager.commission || 0}%
                        </b>
                    </div>
                `
                :
                `
                    <div class="statline">
                        <span>
                            Status
                        </span>
                        <b>
                            🔴 Encerrado
                        </b>
                    </div>
                    <p>
                        Seu contrato com
                        ${manager.name}
                        terminou.
                    </p>
                    <button
                        class="green"
                        onclick="renewManagerContract()">
                        🔄 RENOVAR CONTRATO
                    </button>
                    <button
                        class="gray"
                        onclick="declineManagerRenewal()">
                        🚪 NÃO RENOVAR
                    </button>
                `
            }
        </div>
        <div class="card">
            <div class="title">
                📈 EFEITO NA CARREIRA
            </div>
            <div class="statline">
                <span>
                    Bônus de negociação
                </span>
                <b>
                    ${
                        typeof getManagerNegotiationBonus ===
                        "function"
                        ?
                        Math.round(
                            getManagerNegotiationBonus()
                        )
                        :
                        0
                    }
                </b>
            </div>
            <div class="statline">
                <span>
                    Acesso internacional
                </span>
                <b>
                    ${
                        typeof getManagerInternationalAccess ===
                        "function"
                        ?
                        getManagerInternationalAccess()
                        :
                        manager.internationalAccess || 0
                    }
                </b>
            </div>
            <div class="statline">
                <span>
                    Nível do empresário
                </span>
                <b>
                    ${
                        typeof getManagerLevel ===
                        "function"
                        ?
                        getManagerLevel()
                        :
                        manager.levelNumber || 1
                    }
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                🥊 CARREIRA
            </div>
            <p>
                Seu empresário trabalha para encontrar
                lutas, negociar contratos e aumentar
                suas oportunidades.
            </p>
            ${
                active
                ?
                `
                <button
                    class="main-button"
                    onclick="tab('career')">
                    📈 VER CARREIRA
                </button>
                `
                :
                ""
            }
        </div>
    `;
}
/* =========================================================
   COMPATIBILIDADE
========================================================= */
window.teamScreen =
    teamScreen;
window.refreshManagerOffers =
    refreshManagerOffers;
/* =========================================================
   INICIALIZAÇÃO SEGURA
========================================================= */
console.log(
    "✅ TEAM.JS carregado."
);
