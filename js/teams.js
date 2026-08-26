/* =========================================================
   🏢 SISTEMA DE ACADEMIAS / EQUIPES
   ========================================================= */
/* =========================================================
   🏢 BASE DE ACADEMIAS
========================================================= */
const teams = [
    {
        name: "National Combat Academy",
        country: "Brasil",
        city: "São Paulo",
        level: "Regional",
        reputation: 25,
        quality: 45,
        specialty: "MMA",
        monthlyCost: 120,
        fightFee: 10
    },
    {
        name: "Team Fortaleza MMA",
        country: "Brasil",
        city: "Fortaleza",
        level: "Regional",
        reputation: 20,
        quality: 42,
        specialty: "Wrestling",
        monthlyCost: 100,
        fightFee: 10
    },
    {
        name: "Curitiba Fight Team",
        country: "Brasil",
        city: "Curitiba",
        level: "Regional",
        reputation: 30,
        quality: 48,
        specialty: "Grappling",
        monthlyCost: 130,
        fightFee: 11
    },
    {
        name: "Nova União",
        country: "Brasil",
        city: "Rio de Janeiro",
        level: "Elite",
        reputation: 80,
        quality: 88,
        specialty: "Grappling / MMA",
        monthlyCost: 500,
        fightFee: 12
    },
    {
        name: "Chute Boxe",
        country: "Brasil",
        city: "Curitiba",
        level: "Elite",
        reputation: 85,
        quality: 90,
        specialty: "Muay Thai / MMA",
        monthlyCost: 550,
        fightFee: 13
    },
    {
        name: "Fighting Nerds",
        country: "Brasil",
        city: "São Paulo",
        level: "Elite",
        reputation: 90,
        quality: 94,
        specialty: "MMA / Striking",
        monthlyCost: 600,
        fightFee: 14
    },
    {
        name: "Team Nogueira",
        country: "Brasil",
        city: "Rio de Janeiro",
        level: "Elite",
        reputation: 82,
        quality: 87,
        specialty: "MMA / Grappling",
        monthlyCost: 480,
        fightFee: 12
    },
    {
        name: "American Top Team",
        country: "Estados Unidos",
        city: "Coconut Creek, Florida",
        level: "Elite",
        reputation: 95,
        quality: 97,
        specialty: "MMA Completo",
        monthlyCost: 1000,
        fightFee: 15
    },
    {
        name: "American Kickboxing Academy",
        country: "Estados Unidos",
        city: "San Jose, California",
        level: "Elite",
        reputation: 94,
        quality: 96,
        specialty: "Wrestling / MMA",
        monthlyCost: 950,
        fightFee: 15
    },
    {
        name: "Jackson-Wink MMA",
        country: "Estados Unidos",
        city: "Albuquerque, New Mexico",
        level: "Elite",
        reputation: 93,
        quality: 95,
        specialty: "Gameplan / MMA",
        monthlyCost: 900,
        fightFee: 14
    },
    {
        name: "Kings MMA",
        country: "Estados Unidos",
        city: "Huntington Beach, California",
        level: "Elite",
        reputation: 92,
        quality: 95,
        specialty: "Muay Thai / Striking",
        monthlyCost: 850,
        fightFee: 14
    },
    {
        name: "Xtreme Couture",
        country: "Estados Unidos",
        city: "Las Vegas, Nevada",
        level: "Elite",
        reputation: 91,
        quality: 94,
        specialty: "MMA Completo",
        monthlyCost: 850,
        fightFee: 14
    },
    {
        name: "Kill Cliff FC",
        country: "Estados Unidos",
        city: "Deerfield Beach, Florida",
        level: "Elite",
        reputation: 92,
        quality: 95,
        specialty: "MMA / Wrestling",
        monthlyCost: 900,
        fightFee: 15
    },
    {
        name: "Tristar Gym",
        country: "Canadá",
        city: "Montreal",
        level: "Elite",
        reputation: 90,
        quality: 94,
        specialty: "MMA / Wrestling",
        monthlyCost: 800,
        fightFee: 14
    },
    {
        name: "City Kickboxing",
        country: "Nova Zelândia",
        city: "Auckland",
        level: "Elite",
        reputation: 94,
        quality: 97,
        specialty: "Kickboxing / MMA",
        monthlyCost: 850,
        fightFee: 15
    },
    {
        name: "Tiger Muay Thai",
        country: "Tailândia",
        city: "Phuket",
        level: "Internacional",
        reputation: 88,
        quality: 91,
        specialty: "Muay Thai / MMA",
        monthlyCost: 650,
        fightFee: 13
    },
    {
        name: "MMA Factory",
        country: "França",
        city: "Paris",
        level: "Internacional",
        reputation: 87,
        quality: 91,
        specialty: "MMA Completo",
        monthlyCost: 700,
        fightFee: 13
    },
    {
        name: "SBG Ireland",
        country: "Irlanda",
        city: "Dublin",
        level: "Internacional",
        reputation: 86,
        quality: 89,
        specialty: "MMA / Grappling",
        monthlyCost: 650,
        fightFee: 13
    },
    {
        name: "RIZIN Training Camp",
        country: "Japão",
        city: "Tokyo",
        level: "Internacional",
        reputation: 84,
        quality: 89,
        specialty: "MMA / Striking",
        monthlyCost: 600,
        fightFee: 12
    },
    {
        name: "Eagles MMA",
        country: "Rússia",
        city: "Dagestan",
        level: "Elite",
        reputation: 94,
        quality: 97,
        specialty: "Wrestling / Sambo",
        monthlyCost: 750,
        fightFee: 14
    }
];
/* =========================================================
   🎲 GERAR OFERTAS
========================================================= */
function generateTeamOffers() {
    ensurePlayer();
    player.teamOffers = [];
    const reputation =
        Number(player.fame || 0);
    const currentCountry =
        player.country || "Brasil";
    let available =
        teams.filter(team => {
            if (
                team.reputation >
                reputation + 25
            ) {
                return false;
            }
            if (
                team.reputation >= 90 &&
                reputation < 60
            ) {
                if (
                    !player.manager ||
                    Number(player.manager.contacts || 0) < 80
                ) {
                    return false;
                }
            }
            return true;
        });
    const localTeams =
        available.filter(
            team =>
                team.country === currentCountry
        );
    const foreignTeams =
        available.filter(
            team =>
                team.country !== currentCountry
        );
    available = [
        ...localTeams,
        ...foreignTeams
    ];
    available =
        [...available].sort(
            () =>
                Math.random() - 0.5
        );
    player.teamOffers =
        available.slice(0, 3);
}
/* =========================================================
   🥊 ENTRAR NA ACADEMIA
========================================================= */
function joinTeam(index) {
    ensurePlayer();
    if (
        !player.teamOffers ||
        !player.teamOffers[index]
    ) {
        return;
    }
    const team =
        player.teamOffers[index];
    const fame =
        Number(player.fame || 0);
    if (
        fame + 25 <
        team.reputation
    ) {
        alert(
            "❌ A academia recusou você.\n\n" +
            team.name +
            "\n\n" +
            "Reputação necessária: " +
            team.reputation +
            "\n" +
            "Sua reputação: " +
            Math.round(fame)
        );
        return;
    }
    if (
        Number(player.money || 0) <
        Number(team.monthlyCost || 0)
    ) {
        alert(
            "💰 Você não possui dinheiro suficiente para pagar a mensalidade."
        );
        return;
    }
    player.team = team;
    player.log =
        player.log || [];
    player.log.unshift(
        "🏢 Você entrou para " +
        team.name +
        " em " +
        team.city +
        ", " +
        team.country
    );
    save();
    alert(
        "🥊 NOVA ACADEMIA!\n\n" +
        team.name +
        "\n\n" +
        "📍 " +
        team.city +
        ", " +
        team.country +
        "\n\n" +
        "⭐ Reputação: " +
        team.reputation +
        "\n" +
        "💪 Qualidade: " +
        team.quality +
        "\n" +
        "💵 Mensalidade: $" +
        team.monthlyCost +
        "\n" +
        "🥊 Comissão por luta: " +
        team.fightFee +
        "%"
    );
    teamScreen();
}
/* =========================================================
   🥊 TESTE NA ACADEMIA
========================================================= */
function tryoutTeam(index) {
    ensurePlayer();
    if (
        !player.teamOffers ||
        !player.teamOffers[index]
    ) {
        return;
    }
    const team =
        player.teamOffers[index];
    const fame =
        Number(player.fame || 0);
    const difference =
        team.reputation - fame;
    let chance = 70;
    if (
        difference > 20
    ) {
        chance -= difference;
    }
    if (
        player.manager
    ) {
        chance += Math.min(
            20,
            Number(player.manager.contacts || 0) / 10
        );
    }
    chance =
        Math.max(
            5,
            Math.min(90, chance)
        );
    const success =
        Math.random() * 100 <
        chance;
    if (!success) {
        alert(
            "❌ TESTE REPROVADO!\n\n" +
            team.name +
            "\n\n" +
            "A academia considera que você ainda precisa evoluir antes de entrar."
        );
        return;
    }
    joinTeam(index);
}
/* =========================================================
   💰 CUSTO MENSAL
========================================================= */
function payTeamMonthlyCost() {
    ensurePlayer();
    if (!player.team) {
        return;
    }
    const cost =
        Number(
            player.team.monthlyCost || 0
        );
    if (cost <= 0) {
        return;
    }
    if (
        Number(player.money || 0) >= cost
    ) {
        player.money -= cost;
        player.log =
            player.log || [];
        player.log.unshift(
            "🏢 Mensalidade paga: $" +
            cost +
            " — " +
            player.team.name
        );
    }
    else {
        player.log =
            player.log || [];
        player.log.unshift(
            "⚠️ Você não conseguiu pagar a mensalidade da academia."
        );
    }
    save();
}
/* =========================================================
   💰 DESCONTO DA ACADEMIA
========================================================= */
function calculateTeamFightCut(amount) {
    ensurePlayer();
    if (!player.team) {
        return 0;
    }
    const fee =
        Number(
            player.team.fightFee || 0
        );
    return (
        Number(amount || 0) *
        fee /
        100
    );
}
/* =========================================================
   💰 PAGAMENTO FINAL
========================================================= */
function calculateFightPayout(
    purse,
    winBonus
) {
    ensurePlayer();
    const gross =
        Number(purse || 0) +
        Number(winBonus || 0);
    let managerCut = 0;
    let teamCut = 0;
    if (
        player.manager
    ) {
        managerCut =
            gross *
            Number(
                player.manager.commission || 0
            ) /
            100;
    }
    if (
        player.team
    ) {
        teamCut =
            gross *
            Number(
                player.team.fightFee || 0
            ) /
            100;
    }
    const net =
        gross -
        managerCut -
        teamCut;
    return {
        gross: gross,
        managerCut: managerCut,
        teamCut: teamCut,
        net: Math.max(0, net)
    };
}
/* =========================================================
   👔 VERIFICAR CONTRATO ATIVO DO EMPRESÁRIO
========================================================= */
function hasActiveManagerContract() {
    ensurePlayer();
    if (!player.manager) {
        return false;
    }
    const contract =
        player.manager.contract;
    if (!contract) {
        return false;
    }
    return (
        contract.active === true &&
        Number(contract.yearsRemaining || 0) > 0
    );
}
/* =========================================================
   🏢 TELA DE EQUIPE
========================================================= */
function teamScreen() {
    ensurePlayer();
    const team =
        player.team || null;
    const manager =
        player.manager || null;
    const content =
        document.getElementById("content");
    if (!content) {
        console.error(
            "Elemento #content não encontrado."
        );
        return;
    }
    content.innerHTML = `
        <!-- =================================================
             ACADEMIA
        ================================================== -->
        <div class="card">
            <div class="title">
                🏢 ACADEMIA
            </div>
            ${
                team
                ?
                `
                <div class="statline">
                    <span>Academia atual</span>
                    <b>${team.name}</b>
                </div>
                <div class="statline">
                    <span>País</span>
                    <b>${team.country || "Não informado"}</b>
                </div>
                <div class="statline">
                    <span>Cidade</span>
                    <b>${team.city || "Não informado"}</b>
                </div>
                <div class="statline">
                    <span>Nível</span>
                    <b>${team.level || "Regional"}</b>
                </div>
                <div class="statline">
                    <span>Reputação</span>
                    <b>${team.reputation || 0}</b>
                </div>
                <div class="statline">
                    <span>Qualidade</span>
                    <b>${team.quality || 0}</b>
                </div>
                <div class="statline">
                    <span>Especialidade</span>
                    <b>${team.specialty || "MMA"}</b>
                </div>
                <div class="statline">
                    <span>Mensalidade</span>
                    <b>$${team.monthlyCost || 0}</b>
                </div>
                <div class="statline">
                    <span>Comissão por luta</span>
                    <b>${team.fightFee || 0}%</b>
                </div>
                `
                :
                `
                <p>
                    🥊 Você ainda não possui uma academia.
                </p>
                `
            }
            <button
                type="button"
                class="green"
                onclick="
                    generateTeamOffers();
                    teamScreen();
                "
            >
                🔎 PROCURAR ACADEMIAS
            </button>
        </div>
        <!-- =================================================
             OFERTAS DE ACADEMIA
        ================================================== -->
        ${
            (player.teamOffers || [])
                .map(
                    (offer, index) => `
                    <div class="card">
                        <div class="title">
                            🏢 ${offer.name}
                        </div>
                        <div class="statline">
                            <span>País</span>
                            <b>${offer.country}</b>
                        </div>
                        <div class="statline">
                            <span>Cidade</span>
                            <b>${offer.city}</b>
                        </div>
                        <div class="statline">
                            <span>Nível</span>
                            <b>${offer.level}</b>
                        </div>
                        <div class="statline">
                            <span>Reputação</span>
                            <b>${offer.reputation}</b>
                        </div>
                        <div class="statline">
                            <span>Qualidade</span>
                            <b>${offer.quality}</b>
                        </div>
                        <div class="statline">
                            <span>Especialidade</span>
                            <b>${offer.specialty}</b>
                        </div>
                        <div class="statline">
                            <span>Mensalidade</span>
                            <b>$${offer.monthlyCost}</b>
                        </div>
                        <div class="statline">
                            <span>Comissão por luta</span>
                            <b>${offer.fightFee}%</b>
                        </div>
                        <button
                            type="button"
                            class="green"
                            onclick="joinTeam(${index})"
                        >
                            🤝 ENTRAR
                        </button>
                        <button
                            type="button"
                            class="blue"
                            onclick="tryoutTeam(${index})"
                        >
                            🥊 FAZER TESTE
                        </button>
                    </div>
                    `
                )
                .join("")
        }
        <!-- =================================================
             EMPRESÁRIO
        ================================================== -->
        <div class="card">
            <div class="title">
                👔 EMPRESÁRIO
            </div>
            ${
                manager
                ?
                `
                <div class="statline">
                    <span>Empresário</span>
                    <b>${manager.name}</b>
                </div>
                <div class="statline">
                    <span>Nível</span>
                    <b>${manager.level}</b>
                </div>
                <div class="statline">
                    <span>Comissão</span>
                    <b>${manager.commission || 0}%</b>
                </div>
                <div class="statline">
                    <span>Contatos</span>
                    <b>${manager.contacts || 0}</b>
                </div>
                <div class="statline">
                    <span>Negociação</span>
                    <b>${manager.negotiation || 0}</b>
                </div>
                <div class="statline">
                    <span>Acesso internacional</span>
                    <b>${manager.internationalAccess || 0}</b>
                </div>
                ${
                    manager.contract
                    ?
                    `
                    <div class="statline">
                        <span>Contrato</span>
                        <b>
                            ${
                                manager.contract.active
                                ? "Ativo"
                                : "Encerrado"
                            }
                        </b>
                    </div>
                    <div class="statline">
                        <span>Anos restantes</span>
                        <b>
                            ${
                                manager.contract.yearsRemaining || 0
                            }
                        </b>
                    </div>
                    <div class="statline">
                        <span>Término</span>
                        <b>
                            Ano ${
                                manager.contract.endYear || "-"
                            }
                        </b>
                    </div>
                    ${
                        manager.contract.active
                        ?
                        `
                        <button
                            type="button"
                            class="gray"
                            onclick="terminateManagerContract()"
                        >
                            ⚖️ RESCINDIR CONTRATO
                        </button>
                        `
                        :
                        `
                        <button
                            type="button"
                            class="green"
                            onclick="renegotiateManagerContract()"
                        >
                            🤝 RENEGOCIAR CONTRATO
                        </button>
                        `
                    }
                    `
                    :
                    `
                    <div class="statline">
                        <span>Contrato</span>
                        <b>Sem contrato</b>
                    </div>
                    `
                }
                `
                :
                `
                <p>
                    👔 Você ainda não possui empresário.
                </p>
                `
            }
            ${
                !hasActiveManagerContract()
                ?
                `
                <button
                    type="button"
                    class="gray"
                    onclick="
                        generateManagerOffers();
                        teamScreen();
                    "
                >
                    👔 PROCURAR EMPRESÁRIOS
                </button>
                `
                :
                ""
            }
        </div>
        <!-- =================================================
             OFERTAS DE EMPRESÁRIOS
        ================================================== -->
        ${
            !hasActiveManagerContract()
            ?
            (player.managerOffers || [])
                .map(
                    (managerOffer, index) => `
                    <div class="card">
                        <div class="title">
                            👔 ${managerOffer.name}
                        </div>
                        <div class="statline">
                            <span>Nível</span>
                            <b>${managerOffer.level}</b>
                        </div>
                        <div class="statline">
                            <span>Comissão</span>
                            <b>${managerOffer.commission || 0}%</b>
                        </div>
                        <div class="statline">
                            <span>Contatos</span>
                            <b>${managerOffer.contacts || 0}</b>
                        </div>
                        <div class="statline">
                            <span>Negociação</span>
                            <b>${managerOffer.negotiation || 0}</b>
                        </div>
                        <div class="statline">
                            <span>Acesso internacional</span>
                            <b>${managerOffer.internationalAccess || 0}</b>
                        </div>
                        <button
                            type="button"
                            class="gray"
                            onclick="hireManager(${index})"
                        >
                            🤝 CONTRATAR
                        </button>
                    </div>
                    `
                )
                .join("")
            :
            ""
        }
    `;
}
/* =========================================================
   🌎 FUNÇÕES GLOBAIS
========================================================= */
window.generateTeamOffers =
    generateTeamOffers;
window.joinTeam =
    joinTeam;
window.tryoutTeam =
    tryoutTeam;
window.payTeamMonthlyCost =
    payTeamMonthlyCost;
window.calculateTeamFightCut =
    calculateTeamFightCut;
window.calculateFightPayout =
    calculateFightPayout;
window.teamScreen =
    teamScreen;
window.hasActiveManagerContract =
    hasActiveManagerContract;
