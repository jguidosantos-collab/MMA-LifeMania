/* =========================================================
   MMA LIFE DYNASTY
   TEAM.JS
   SISTEMA DE EQUIPE + EMPRESÁRIO
========================================================= */


/* =========================================================
   UTILIDADES
========================================================= */

function teamGetElement(id) {
    return document.getElementById(id);
}


function ensureTeamPlayer() {

    if (
        typeof window.player === "undefined" ||
        !window.player
    ) {

        if (
            typeof createDefaultPlayer === "function"
        ) {

            window.player = createDefaultPlayer();

        }

    }

}


/* =========================================================
   BANCO DE PROFISSIONAIS
========================================================= */

const teamProfessionals = {

    coach: [

        {
            id: "coach_1",
            name: "Ricardo Almeida",
            role: "Treinador Principal",
            level: 1,
            cost: 300,
            bonuses: {
                technique: 2,
                fightIQ: 2,
                defense: 1
            }
        },

        {
            id: "coach_2",
            name: "Marcelo Vieira",
            role: "Treinador Principal",
            level: 2,
            cost: 700,
            bonuses: {
                technique: 4,
                fightIQ: 4,
                defense: 3
            }
        },

        {
            id: "coach_3",
            name: "Alexandre Costa",
            role: "Treinador Principal",
            level: 3,
            cost: 1500,
            bonuses: {
                technique: 7,
                fightIQ: 7,
                defense: 5
            }
        }

    ],


    conditioning: [

        {
            id: "conditioning_1",
            name: "Paulo Mendes",
            role: "Preparador Físico",
            level: 1,
            cost: 250,
            bonuses: {
                cardio: 3,
                strength: 1
            }
        },

        {
            id: "conditioning_2",
            name: "Fernando Lopes",
            role: "Preparador Físico",
            level: 2,
            cost: 600,
            bonuses: {
                cardio: 6,
                strength: 3
            }
        },

        {
            id: "conditioning_3",
            name: "Bruno Rocha",
            role: "Preparador Físico",
            level: 3,
            cost: 1200,
            bonuses: {
                cardio: 10,
                strength: 5
            }
        }

    ],


    striking: [

        {
            id: "striking_1",
            name: "André Santos",
            role: "Especialista em Striking",
            level: 1,
            cost: 250,
            bonuses: {
                striking: 4,
                offense: 2
            }
        },

        {
            id: "striking_2",
            name: "Diego Martins",
            role: "Especialista em Striking",
            level: 2,
            cost: 650,
            bonuses: {
                striking: 7,
                offense: 4
            }
        },

        {
            id: "striking_3",
            name: "Renato Silva",
            role: "Especialista em Striking",
            level: 3,
            cost: 1300,
            bonuses: {
                striking: 11,
                offense: 6
            }
        }

    ],


    grappling: [

        {
            id: "grappling_1",
            name: "João Ribeiro",
            role: "Especialista em Grappling",
            level: 1,
            cost: 250,
            bonuses: {
                wrestling: 3,
                grappling: 3
            }
        },

        {
            id: "grappling_2",
            name: "Carlos Nogueira",
            role: "Especialista em Grappling",
            level: 2,
            cost: 650,
            bonuses: {
                wrestling: 6,
                grappling: 6
            }
        },

        {
            id: "grappling_3",
            name: "Eduardo Lima",
            role: "Especialista em Grappling",
            level: 3,
            cost: 1300,
            bonuses: {
                wrestling: 10,
                grappling: 10
            }
        }

    ],


    nutrition: [

        {
            id: "nutrition_1",
            name: "Mariana Costa",
            role: "Nutricionista",
            level: 1,
            cost: 200,
            bonuses: {
                health: 2,
                recovery: 2
            }
        },

        {
            id: "nutrition_2",
            name: "Camila Ferreira",
            role: "Nutricionista",
            level: 2,
            cost: 500,
            bonuses: {
                health: 4,
                recovery: 4
            }
        },

        {
            id: "nutrition_3",
            name: "Juliana Martins",
            role: "Nutricionista",
            level: 3,
            cost: 1000,
            bonuses: {
                health: 7,
                recovery: 7
            }
        }

    ]

};


/* =========================================================
   NOMES DOS CARGOS
========================================================= */

const teamRoleLabels = {

    coach: "🥊 Treinador Principal",

    conditioning: "💪 Preparador Físico",

    striking: "👊 Especialista em Striking",

    grappling: "🥋 Especialista em Grappling",

    nutrition: "🥗 Nutricionista"

};


/* =========================================================
   GARANTIR EQUIPE
========================================================= */

function ensureTeam() {

    ensureTeamPlayer();

    if (
        !player.team
    ) {

        player.team = {

            coach: null,

            conditioning: null,

            striking: null,

            grappling: null,

            nutrition: null

        };

    }


    const positions = [
        "coach",
        "conditioning",
        "striking",
        "grappling",
        "nutrition"
    ];


    positions.forEach(function(position) {

        if (
            typeof player.team[position] ===
            "undefined"
        ) {

            player.team[position] = null;

        }

    });

}


/* =========================================================
   BUSCAR PROFISSIONAL
========================================================= */

function getTeamProfessional(
    position,
    id
) {

    const list =
        teamProfessionals[position] || [];


    return list.find(
        professional =>
            professional.id === id
    ) || null;

}


/* =========================================================
   CONTRATAR PROFISSIONAL
========================================================= */

function hireTeamProfessional(
    position,
    id
) {

    ensureTeam();

    const professional =
        getTeamProfessional(
            position,
            id
        );


    if (!professional) {

        return;

    }


    player.team[position] = {

        id: professional.id,

        name: professional.name,

        role: professional.role,

        level: professional.level,

        cost: professional.cost,

        bonuses: {
            ...(professional.bonuses || {})
        }

    };


    player.log =
        player.log || [];


    player.log.unshift(
        "👥 " +
        professional.name +
        " entrou para sua equipe."
    );


    if (
        typeof save === "function"
    ) {

        save();

    }

    else if (
        typeof saveGame === "function"
    ) {

        saveGame();

    }


    teamScreen();

}


/* =========================================================
   REMOVER PROFISSIONAL
========================================================= */

function removeTeamProfessional(
    position
) {

    ensureTeam();


    const professional =
        player.team[position];


    if (!professional) {

        return;

    }


    const confirmed =
        confirm(
            "Deseja retirar " +
            professional.name +
            " da sua equipe?"
        );


    if (!confirmed) {

        return;

    }


    player.log =
        player.log || [];


    player.log.unshift(
        "🚪 " +
        professional.name +
        " deixou sua equipe."
    );


    player.team[position] = null;


    if (
        typeof save === "function"
    ) {

        save();

    }

    else if (
        typeof saveGame === "function"
    ) {

        saveGame();

    }


    teamScreen();

}


/* =========================================================
   ABRIR MERCADO DE PROFISSIONAIS
========================================================= */

function openTeamMarket(
    position
) {

    ensureTeam();


    const content =
        teamGetElement("content");


    if (!content) {

        return;

    }


    const professionals =
        teamProfessionals[position] || [];


    let html = `

        <div class="card">

            <div class="title">
                ${teamRoleLabels[position]}
            </div>

            <p>
                Escolha um profissional para
                fazer parte da sua equipe.
            </p>

        </div>

    `;


    professionals.forEach(
        function(professional) {

            const bonuses =
                professional.bonuses || {};


            let bonusHTML = "";


            Object.keys(bonuses).forEach(
                function(attribute) {

                    bonusHTML += `
                        <div class="statline">
                            <span>
                                ${attribute}
                            </span>
                            <b>
                                +${bonuses[attribute]}
                            </b>
                        </div>
                    `;

                }
            );


            html += `

                <div class="card">

                    <div class="title">
                        ${professional.name}
                    </div>

                    <p>
                        ${professional.role}
                    </p>

                    <div class="statline">

                        <span>
                            Nível
                        </span>

                        <b>
                            ${professional.level}
                        </b>

                    </div>

                    <div class="statline">

                        <span>
                            Custo semanal
                        </span>

                        <b>
                            $${professional.cost}
                        </b>

                    </div>

                    ${bonusHTML}

                    <button
                        class="green"
                        onclick="
                            hireTeamProfessional(
                                '${position}',
                                '${professional.id}'
                            )
                        ">

                        🤝 CONTRATAR

                    </button>

                </div>

            `;

        }
    );


    html += `

        <div class="card">

            <button
                class="gray"
                onclick="teamScreen()">

                ← VOLTAR PARA EQUIPE

            </button>

        </div>

    `;


    content.innerHTML = html;

}


/* =========================================================
   RENDERIZAR MEMBRO DA EQUIPE
========================================================= */

function renderTeamMember(
    position
) {

    const member =
        player.team[position];


    if (!member) {

        return `

            <div class="card">

                <div class="title">
                    ${teamRoleLabels[position]}
                </div>

                <p>
                    Nenhum profissional contratado.
                </p>

                <button
                    class="main-button"
                    onclick="
                        openTeamMarket(
                            '${position}'
                        )
                    ">

                    🔎 PROCURAR PROFISSIONAL

                </button>

            </div>

        `;

    }


    const bonuses =
        member.bonuses || {};


    let bonusHTML = "";


    Object.keys(bonuses).forEach(
        function(attribute) {

            bonusHTML += `

                <div class="statline">

                    <span>
                        ${attribute}
                    </span>

                    <b>
                        +${bonuses[attribute]}
                    </b>

                </div>

            `;

        }
    );


    return `

        <div class="card">

            <div class="title">
                ${teamRoleLabels[position]}
            </div>


            <div class="fighter-card">

                <div class="fighter-avatar">
                    👤
                </div>


                <div class="fighter-info">

                    <h2>
                        ${member.name}
                    </h2>

                    <p>
                        ${member.role}
                    </p>

                </div>

            </div>


            <div class="statline">

                <span>
                    Nível
                </span>

                <b>
                    ${member.level}
                </b>

            </div>


            <div class="statline">

                <span>
                    Custo semanal
                </span>

                <b>
                    $${member.cost}
                </b>

            </div>


            ${bonusHTML}


            <button
                class="gray"
                onclick="
                    removeTeamProfessional(
                        '${position}'
                    )
                ">

                🚪 DISPENSAR

            </button>


            <button
                class="main-button"
                onclick="
                    openTeamMarket(
                        '${position}'
                    )
                ">

                🔄 TROCAR PROFISSIONAL

            </button>

        </div>

    `;

}


/* =========================================================
   CÁLCULO DOS BÔNUS DA EQUIPE
========================================================= */

function getTeamBonuses() {

    ensureTeam();


    const bonuses = {};


    Object.keys(player.team).forEach(
        function(position) {

            const member =
                player.team[position];


            if (!member) {

                return;

            }


            const memberBonuses =
                member.bonuses || {};


            Object.keys(memberBonuses).forEach(
                function(attribute) {

                    bonuses[attribute] =
                        (
                            bonuses[attribute] || 0
                        ) +
                        Number(
                            memberBonuses[attribute] || 0
                        );

                }
            );

        }
    );


    return bonuses;

}


/* =========================================================
   TELA DE EQUIPE
========================================================= */

function teamScreen() {

    ensureTeam();


    const content =
        teamGetElement("content");


    if (!content) {

        console.error(
            "Elemento #content não encontrado."
        );

        return;

    }


    let managerHTML = "";


    /* =====================================================
       EMPRESÁRIO
    ===================================================== */

    if (
        player.manager
    ) {

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


        const years =
            contract
            ?
            Number(
                contract.yearsRemaining ??
                contract.remainingYears ??
                0
            )
            :
            0;


        managerHTML = `

            <div class="card">

                <div class="title">
                    👔 EMPRESÁRIO
                </div>


                <div class="fighter-card">

                    <div class="fighter-avatar">
                        👔
                    </div>


                    <div class="fighter-info">

                        <h2>
                            ${player.manager.name}
                        </h2>

                        <p>
                            ${player.manager.level || ""}
                        </p>

                    </div>

                </div>


                <div class="statline">

                    <span>
                        Contatos
                    </span>

                    <b>
                        ${player.manager.contacts || 0}
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Negociação
                    </span>

                    <b>
                        ${player.manager.negotiation || 0}
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Contrato
                    </span>

                    <b>
                        ${
                            contract &&
                            contract.active
                            ?
                            years + " anos"
                            :
                            "Encerrado"
                        }
                    </b>

                </div>

            </div>

        `;

    }

    else {

        managerHTML = `

            <div class="card">

                <div class="title">
                    👔 EMPRESÁRIO
                </div>

                <p>
                    Você ainda não possui empresário.
                </p>

                <button
                    class="main-button"
                    onclick="refreshManagerOffers()">

                    🔎 PROCURAR EMPRESÁRIO

                </button>

            </div>

        `;

    }


    /* =====================================================
       BÔNUS TOTAIS
    ===================================================== */

    const bonuses =
        getTeamBonuses();


    let bonusHTML = "";


    Object.keys(bonuses).forEach(
        function(attribute) {

            bonusHTML += `

                <div class="statline">

                    <span>
                        ${attribute}
                    </span>

                    <b>
                        +${Math.round(
                            bonuses[attribute]
                        )}
                    </b>

                </div>

            `;

        }
    );


    if (!bonusHTML) {

        bonusHTML = `

            <p>
                Sua equipe ainda não fornece
                bônus de treinamento.
            </p>

        `;

    }


    /* =====================================================
       RENDER FINAL
    ===================================================== */

    content.innerHTML = `

        <div class="card">

            <div class="title">
                👥 EQUIPE
            </div>

            <p>
                Monte sua equipe profissional,
                melhore seu treinamento e desenvolva
                seu lutador ao longo da carreira.
            </p>

        </div>


        ${managerHTML}


        <div class="card">

            <div class="title">
                📊 BÔNUS DA EQUIPE
            </div>

            ${bonusHTML}

        </div>


        ${renderTeamMember("coach")}

        ${renderTeamMember("conditioning")}

        ${renderTeamMember("striking")}

        ${renderTeamMember("grappling")}

        ${renderTeamMember("nutrition")}


        <div class="card">

            <div class="title">
                🥊 CARREIRA
            </div>

            <button
                class="main-button"
                onclick="tab('career')">

                📈 VER CARREIRA

            </button>

        </div>

    `;

}


/* =========================================================
   APLICAÇÃO DOS BÔNUS DA EQUIPE
========================================================= */

function applyTeamBonuses() {

    ensureTeam();


    if (!player.attributes) {

        return;

    }


    const bonuses =
        getTeamBonuses();


    Object.keys(bonuses).forEach(
        function(attribute) {

            if (
                typeof player.attributes[attribute] ===
                "number"
            ) {

                player.attributes[attribute] =
                    Math.min(

                        100,

                        Number(
                            player.attributes[attribute]
                        ) +
                        Number(
                            bonuses[attribute]
                        )

                    );

            }

        }
    );

}


/* =========================================================
   CUSTO SEMANAL DA EQUIPE
========================================================= */

function getTeamWeeklyCost() {

    ensureTeam();


    let total = 0;


    Object.keys(player.team).forEach(
        function(position) {

            const member =
                player.team[position];


            if (!member) {

                return;

            }


            total +=
                Number(
                    member.cost || 0
                );

        }
    );


    return total;

}


/* =========================================================
   PAGAR EQUIPE
========================================================= */

function processTeamWeeklyCost() {

    ensureTeam();


    const cost =
        getTeamWeeklyCost();


    if (cost <= 0) {

        return;

    }


    player.money =
        Number(
            player.money || 0
        ) -
        cost;


    player.log =
        player.log || [];


    player.log.unshift(
        "💰 Equipe: -$" +
        cost +
        " em custos semanais."
    );


    if (
        player.money < 0
    ) {

        player.money = 0;

    }

}


/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */

window.teamScreen =
    teamScreen;

window.ensureTeam =
    ensureTeam;

window.hireTeamProfessional =
    hireTeamProfessional;

window.removeTeamProfessional =
    removeTeamProfessional;

window.openTeamMarket =
    openTeamMarket;

window.getTeamBonuses =
    getTeamBonuses;

window.applyTeamBonuses =
    applyTeamBonuses;

window.getTeamWeeklyCost =
    getTeamWeeklyCost;

window.processTeamWeeklyCost =
    processTeamWeeklyCost;


/* =========================================================
   COMPATIBILIDADE
========================================================= */

window.refreshManagerOffers =
    window.refreshManagerOffers ||
    function() {

        if (
            typeof generateManagerOffers ===
            "function"
        ) {

            generateManagerOffers();

        }

        teamScreen();

    };


console.log(
    "✅ TEAM.JS — Equipe + Empresário carregados."
);
