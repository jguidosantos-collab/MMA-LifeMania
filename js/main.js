function tab(name) {

    if (name === "home") {
        home();
    }

    if (name === "career") {
        career();
    }

    if (name === "train") {
        training();
    }

    if (name === "fight") {
        fightScreen();
    }

    if (name === "team") {
        teamScreen();
    }

    if (name === "life") {
        familyScreen();
    }
    if (name === "ranking") {
        rankingScreen();
    }
}


/* =========================
   COMEÇAR JOGO
========================= */

function startGame() {
    document.getElementById("content").innerHTML = `
        <div class="start-screen">
            <div class="start-logo">
                🥊
            </div>
            <h1>
                MMA LIFE
            </h1>
            <p class="start-subtitle">
                CONSTRUA SUA CARREIRA.
                ESCREVA SEU LEGADO.
            </p>
            <div class="start-preview">
                <div class="start-fighter">
                    👤
                </div>
                <div class="start-preview-text">
                    <strong>
                        SUA HISTÓRIA COMEÇA AQUI
                    </strong>
                    <span>
                        Crie seu lutador e entre
                        no mundo profissional do MMA.
                    </span>
                </div>
            </div>
            <button
                class="start-button"
                onclick="initCreation()">
                🆕 CRIAR NOVO LUTADOR
            </button>
            <button
                class="start-secondary"
                onclick="loadGame()">
                ▶️ CONTINUAR CARREIRA
            </button>
            <div class="start-footer">
                AMADOR → REGIONAL → NACIONAL
                → INTERNACIONAL → UFC
            </div>
        </div>
    `;
}
/* =========================
   VIRAR PROFISSIONAL
========================= */

function turnProfessional() {

    if (player.age < 18) {

        alert(
            "Você precisa ter 18 anos para se tornar profissional."
        );

        return;

    }


    if (player.professional.active) {

        alert(
            "Você já é profissional."
        );

        return;

    }


    /*
     * Ativa a carreira profissional
     */

    player.professional.active = true;


    /*
     * Todo lutador começa
     * obrigatoriamente no Regional.
     */

    player.careerStage = "regional";


    /*
     * Garante que não exista
     * uma promoção grande selecionada
     * antes da hora.
     */

    player.currentPromotion = null;


    /*
     * Mensagem no histórico
     */

    player.log.unshift(
        "🥊 Você se tornou profissional e começou no circuito regional."
    );


    save();


    alert(
        "🥊 Parabéns!\n\n" +
        "Você agora é um lutador profissional.\n\n" +
        "Sua carreira começa no circuito REGIONAL."
    );


    home();

}

/* =========================
   TELA INICIAL
========================= */

function home() {
    const p = player.professional || {};
    const amateur = player.amateur || {};
    const recordPro =
        `${p.wins || 0}-${p.losses || 0}-${p.draws || 0}`;
    const recordAmateur =
        `${amateur.wins || 0}-${amateur.losses || 0}-${amateur.draws || 0}`;
    const nextFight =
        player.nextFight || null;
    const team =
        player.team || null;
    const manager =
        player.manager || null;
    document.getElementById("content").innerHTML = `
        <div class="home-container">
            <!-- =========================================
                 CABEÇALHO DO LUTADOR
            ========================================== -->
            <div class="fighter-header">
                <div class="fighter-avatar">
                    <div class="avatar-placeholder">
                        🥊
                    </div>
                </div>
                <div class="fighter-info">
                    <div class="fighter-name">
                        ${player.name || "Lutador"}
                    </div>
                    <div class="fighter-country">
                        🇧🇷 ${player.country || "Brasil"}
                    </div>
                    <div class="fighter-weight">
                        ${player.weight || "Categoria"}
                    </div>
                </div>
            </div>
            <!-- =========================================
                 STATUS PRINCIPAL
            ========================================== -->
            <div class="stats-grid">
                <div class="stat-card">
                    <span>IDADE</span>
                    <strong>
                        ${player.age || 18}
                    </strong>
                </div>
                <div class="stat-card">
                    <span>FAMA</span>
                    <strong>
                        ${Math.round(player.fame || 0)}
                    </strong>
                </div>
                <div class="stat-card">
                    <span>PATRIMÔNIO</span>
                    <strong>
                        $${Math.round(player.money || 0)}
                    </strong>
                </div>
                <div class="stat-card">
                    <span>RANKING</span>
                    <strong>
                        ${typeof rankingText === "function"
                            ? rankingText()
                            : "—"}
                    </strong>
                </div>
            </div>
            <!-- =========================================
                 PRÓXIMA LUTA
            ========================================== -->
            <div class="section-title">
                🔥 PRÓXIMO COMPROMISSO
            </div>
            ${
                nextFight
                ?
                `
                <div class="fight-card">
                    <div class="fight-event">
                        ${nextFight.event.name}
                    </div>
                    <div class="fight-versus">
                        <div class="fighter-side">
                            <div class="mini-avatar">
                                🥊
                            </div>
                            <strong>
                                ${player.name}
                            </strong>
                        </div>
                        <div class="vs">
                            VS
                        </div>
                        <div class="fighter-side">
                            <div class="mini-avatar">
                                👊
                            </div>
                            <strong>
                                ${nextFight.opponent.displayName}
                            </strong>
                        </div>
                    </div>
                    <div class="fight-details">
                        <span>
                            📅 Semana ${nextFight.week}
                        </span>
                        <span>
                            💰 $${Math.round(nextFight.purse || 0)}
                        </span>
                    </div>
                    <button
                        class="main-button red"
                        onclick="fightScreen()">
                        👊 VER LUTA
                    </button>
                </div>
                `
                :
                `
                <div class="empty-card">
                    <div class="empty-icon">
                        🥊
                    </div>
                    <strong>
                        Nenhuma luta marcada
                    </strong>
                    <p>
                        Prepare-se para o próximo desafio.
                    </p>
                    <button
                        class="main-button"
                        onclick="fightScreen()">
                        🔎 PROCURAR LUTA
                    </button>
                </div>
                `
            }
            <!-- =========================================
                 CARREIRA
            ========================================== -->
            <div class="section-title">
                🏆 MINHA CARREIRA
            </div>
            <div class="career-card">
                <div class="career-stage">
                    ${
                        player.careerStage === "elite"
                        ? "👑 ELITE"
                        :
                        player.careerStage === "international"
                        ? "🌎 INTERNACIONAL"
                        :
                        player.careerStage === "national"
                        ? "🇧🇷 NACIONAL"
                        :
                        player.professional &&
                        player.professional.active
                        ? "🥊 REGIONAL"
                        : "🥋 AMADOR"
                    }
                </div>
                <div class="record">
                    <div>
                        <span>PROFISSIONAL</span>
                        <strong>
                            ${recordPro}
                        </strong>
                    </div>
                    <div>
                        <span>AMADOR</span>
                        <strong>
                            ${recordAmateur}
                        </strong>
                    </div>
                </div>
                <button
                    class="main-button"
                    onclick="career()">
                    🏆 ABRIR CARREIRA
                </button>
            </div>
            <!-- =========================================
                 EQUIPE
            ========================================== -->
            <div class="section-title">
                🏢 MEU TIME
            </div>
            <div class="team-preview">
                <div>
                    <span>ACADEMIA</span>
                    <strong>
                        ${
                            team
                            ? team.name
                            : "Nenhuma academia"
                        }
                    </strong>
                </div>
                <div>
                    <span>EMPRESÁRIO</span>
                    <strong>
                        ${
                            manager
                            ? manager.name
                            : "Nenhum empresário"
                        }
                    </strong>
                </div>
                <button
                    class="main-button"
                    onclick="teamScreen()">
                    🏢 EQUIPE
                </button>
            </div>
            <!-- =========================================
                 ATALHOS
            ========================================== -->
            <div class="section-title">
                🌎 MUNDO DO MMA
            </div>
            <div class="quick-grid">
                <button
                    onclick="career()">
                    🏆
                    <span>
                        Carreira
                    </span>
                </button>
                <button
                    onclick="fightScreen()">
                    👊
                    <span>
                        Lutas
                    </span>
                </button>
                <button
                    onclick="teamScreen()">
                    🏢
                    <span>
                        Equipe
                    </span>
                </button>
                <button
                    onclick="familyScreen()">
                    ❤️
                    <span>
                        Vida
                    </span>
                </button>
            </div>
            <!-- =========================================
                 STATUS FÍSICO
            ========================================== -->
            <div class="section-title">
                ❤️ CONDIÇÃO FÍSICA
            </div>
            <div class="condition-card">
                <div>
                    <span>SAÚDE</span>
                    <strong>
                        ${Math.round(player.health || 0)}%
                    </strong>
                </div>
                <div>
                    <span>FADIGA</span>
                    <strong>
                        ${Math.round(player.fatigue || 0)}%
                    </strong>
                </div>
            </div>
        <div class="restart-section">
    <button
        class="main-button gray"
        onclick="resetGame()">
        🔄 REINICIAR JOGO
    </button>
</div>
        </div>
    `;
}


/* =========================
   CARREIRA
========================= */

function acceptPromotion(id) {

    const promotion =
        promotions.find(
            p => p.id === id
        );


    if (!promotion) {

        return;

    }


    /*
     * Verifica se a proposta ainda é válida.
     */

    if (
        !canReceiveOffer(
            promotion
        )
    ) {

        alert(
            "Essa oportunidade não está mais disponível."
        );

        return;

    }


    /*
     * Calcula a proposta financeira.
     */

    const offer =
        calculateContractOffer(
            promotion
        );


    /*
     * Guarda a organização atual.
     */

    player.currentPromotion =
        promotion;


    /*
     * Cria o contrato.
     */

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
            1

    };


    /*
     * =====================================================
     * ATUALIZA O ESTÁGIO DA CARREIRA
     * =====================================================
     *
     * A promoção só acontece quando o contrato
     * é realmente assinado.
     */

    if (
        promotion.careerStage ===
        "regional"
    ) {

        player.careerStage =
            "regional";

    }


    if (
        promotion.careerStage ===
        "national"
    ) {

        player.careerStage =
            "national";


        player.log.unshift(

            "🇧🇷 Você entrou no circuito nacional."

        );

    }


    if (
        promotion.careerStage ===
        "international"
    ) {

        player.careerStage =
            "international";


        player.log.unshift(

            "🌎 Você chegou ao circuito internacional!"

        );

    }


    if (
        promotion.careerStage ===
        "elite"
    ) {

        player.careerStage =
            "elite";


        player.log.unshift(

            "👑 VOCÊ CHEGOU À ELITE DO MMA!"

        );

    }


    /*
     * Fama pela assinatura.
     */

    player.fame +=
        Math.max(
            1,
            Math.floor(
                (
                    promotion.prestige ||
                    0
                ) / 20
            )
        );


    /*
     * Registra no histórico.
     */

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

            history.contracts =
                (
                    history.contracts ||
                    0
                ) + 1;

        }

    }


    /*
     * Mensagem.
     */

    alert(

        "✍️ CONTRATO ASSINADO!\n\n" +

        promotion.name +

        "\n\n" +

        "Lutas: " +
        offer.fights +

        "\n" +

        "Bolsa: $" +
        offer.purse +

        "\n" +

        "Bônus de vitória: $" +
        offer.winBonus

    );


    player.log.unshift(

        "✍️ Contrato assinado com " +
        promotion.name +
        " por " +
        offer.fights +
        " lutas."

    );


    save();


    career();

}
/* =========================
   CARREIRA
========================= */

function career() {

    initializeChampionship();


    const a =
        player.attributes || {};


    const title =
        player.championship &&
        player.championship.title
        ?
        player.championship.title
        :
        "Nenhum";


    /*
     * Gera as oportunidades disponíveis.
     */

    let offers = [];


    if (
        typeof generateContractOffers ===
        "function"
    ) {

        offers =
            generateContractOffers();

    }


    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">
                🥊 CARREIRA
            </div>


            <div class="statline">

                <span>
                    Status
                </span>

                <b>
                    ${
                        player.professional &&
                        player.professional.active
                        ?
                        "Profissional"
                        :
                        "Amador"
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    Estágio
                </span>

                <b>
                    ${
                        player.careerStage
                        ||
                        "regional"
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    Ranking
                </span>

                <b>
                    ${
                        typeof rankingText ===
                        "function"
                        ?
                        rankingText()
                        :
                        "Sem ranking"
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    Vitórias
                </span>

                <b>
                    ${
                        player.professional
                        ?
                        player.professional.wins
                        :
                        0
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    Derrotas
                </span>

                <b>
                    ${
                        player.professional
                        ?
                        player.professional.losses
                        :
                        0
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    Fama
                </span>

                <b>
                    ${Math.round(player.fame || 0)}
                </b>

            </div>


            <div class="statline">

                <span>
                    Cinturão
                </span>

                <b>
                    ${title}
                </b>

            </div>


            <div class="statline">

                <span>
                    Defesas
                </span>

                <b>
                    ${
                        player.championship
                        ?
                        player.championship.defenses
                        :
                        0
                    }
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                📄 OPORTUNIDADES
            </div>


            ${
                offers.length === 0

                ?

                `

                <p>
                    Nenhuma organização está
                    oferecendo contrato no momento.
                </p>

                `

                :

                offers
                    .map(

                        offer => `

                        <div class="card">

                            <div class="title">
                                ${offer.promotion.name}
                            </div>


                            <div class="statline">

                                <span>
                                    País
                                </span>

                                <b>
                                    ${
                                        offer.promotion.country
                                    }
                                </b>

                            </div>


                            <div class="statline">

                                <span>
                                    Nível
                                </span>

                                <b>
                                    ${
                                        offer.promotion.careerStage
                                        ||
                                        "Profissional"
                                    }
                                </b>

                            </div>


                            <div class="statline">

                                <span>
                                    Prestígio
                                </span>

                                <b>
                                    ${
                                        offer.promotion.prestige
                                    }
                                </b>

                            </div>


                            <div class="statline">

                                <span>
                                    Lutas
                                </span>

                                <b>
                                    ${
                                        offer.fights
                                    }
                                </b>

                            </div>


                            <div class="statline">

                                <span>
                                    Bolsa
                                </span>

                                <b>
                                    $${Math.round(
                                        offer.purse
                                    )}
                                </b>

                            </div>


                            <div class="statline">

                                <span>
                                    Bônus de vitória
                                </span>

                                <b>
                                    $${Math.round(
                                        offer.winBonus
                                    )}
                                </b>

                            </div>


                            <button
                                class="green"
                                onclick="
                                    acceptPromotion(
                                        ${offer.promotion.id}
                                    )
                                ">

                                ✍️ ACEITAR CONTRATO

                            </button>

                        </div>

                        `

                    )
                    .join("")
            }

        </div>


        ${
            player.currentContract &&
            player.currentContract.active

            ?

            `

            <div class="card">

                <div class="title">
                    📑 CONTRATO ATUAL
                </div>


                <div class="statline">

                    <span>
                        Organização
                    </span>

                    <b>
                        ${
                            player.currentContract
                                .promotionName
                        }
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Lutas contratadas
                    </span>

                    <b>
                        ${
                            player.currentContract
                                .fights
                        }
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Lutas realizadas
                    </span>

                    <b>
                        ${
                            player.currentContract
                                .fightsCompleted
                        }
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Bolsa
                    </span>

                    <b>
                        $${Math.round(
                            player.currentContract.purse
                        )}
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Bônus de vitória
                    </span>

                    <b>
                        $${Math.round(
                            player.currentContract.winBonus
                        )}
                    </b>

                </div>

            </div>

            `

            :

            ""

        }

        `;

}

/* =========================
   TREINAMENTO
========================= */

function training() {

    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">

                🏋️ TREINAMENTO

            </div>


            <div class="statline">

                <span>
                    Fadiga
                </span>

                <b>
                    ${Math.round(player.fatigue)}%
                </b>

            </div>


            <div class="statline">

                <span>
                    Saúde
                </span>

                <b>
                    ${Math.round(player.health)}%
                </b>

            </div>


            <button
                onclick="train('strength')">

                💪 Força

            </button>


            <button
                onclick="train('striking')">

                👊 Striking

            </button>


            <button
                onclick="train('wrestling')">

                🤼 Wrestling

            </button>


            <button
                onclick="train('grappling')">

                🥋 Grappling

            </button>


            <button
                onclick="train('cardio')">

                🏃 Cardio

            </button>


            <button
                onclick="train('technique')">

                🎯 Técnica

            </button>


            <button
                class="gray"
                onclick="rest()">

                😴 Descansar

            </button>

        </div>

        `;

}


/* =========================
   LUTAS
========================= */

function fightScreen() {

    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">
                ⚔️ PRÓXIMA LUTA
            </div>

            ${
                player.nextFight

                ?

                `

                <div class="statline">

                    <span>Evento</span>

                    <b>
                        ${player.nextFight.event.name}
                    </b>

                </div>

                <div class="statline">

                    <span>Adversário</span>

                    <b>
                        ${player.nextFight.opponent.displayName}
                    </b>

                </div>

                <div class="statline">

                    <span>Nacionalidade</span>

                    <b>
                        ${player.nextFight.opponent.country}
                    </b>

                </div>

                <div class="statline">

                    <span>Força estimada</span>

                    <b>
                        ${Math.round(
                            player.nextFight.opponent.power
                        )}
                    </b>

                </div>

                <div class="statline">

                    <span>Bolsa</span>

                    <b>
                        $${player.nextFight.purse}
                    </b>

                </div>

                <button
                    class="green"
                    onclick="fight()">

                    🔥 LUTAR AGORA

                </button>

                `

                :

                `

                <p>
                    Nenhuma luta marcada.
                </p>

                <button
                    onclick="findFight()">

                    🔎 PROCURAR ADVERSÁRIO

                </button>

                `

            }

        </div>

        <div class="card">

            <div class="title">
                🏆 RANKING
            </div>

            <div class="statline">

                <span>
                    Posição
                </span>

                <b>
                    ${rankingText()}
                </b>

            </div>

        </div>

        `;

}

function teamScreen() {

    /*
     * Garante que existam ofertas.
     */

    if (
        !player.teamOffers ||
        player.teamOffers.length === 0
    ) {

        generateTeamOffers();

    }


    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">

                🏢 EQUIPE E EMPRESÁRIO

            </div>


            <div class="statline">

                <span>
                    Academia atual
                </span>

                <b>

                    ${
                        player.team
                        ?
                        player.team.name
                        :
                        "Nenhuma"
                    }

                </b>

            </div>


            ${
                player.team
                ?

                `

                <div class="statline">

                    <span>
                        País
                    </span>

                    <b>
                        ${player.team.country}
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Cidade
                    </span>

                    <b>
                        ${player.team.city}
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Mensalidade
                    </span>

                    <b>
                        $${player.team.monthlyCost}
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Comissão por luta
                    </span>

                    <b>
                        ${player.team.fightFee}%
                    </b>

                </div>

                `

                :

                `

                <p>
                    Você ainda não possui uma academia.
                </p>

                `

            }


            <div class="statline">

                <span>
                    Empresário
                </span>

                <b>

                    ${
                        player.manager
                        ?
                        player.manager.name
                        :
                        "Nenhum"
                    }

                </b>

            </div>


            <button
                class="blue"
                onclick="
                    generateTeamOffers();
                    teamScreen();
                ">

                🏢 PROCURAR ACADEMIAS

            </button>

        </div>


        ${
            player.teamOffers &&
            player.teamOffers.length > 0

            ?

            `

            <div class="card">

                <div class="title">

                    🔎 ACADEMIAS DISPONÍVEIS

                </div>


                ${
                    player.teamOffers
                        .map(

                            (team, index) => `

                            <div class="card">

                                <div class="title">

                                    🥊 ${team.name}

                                </div>


                                <div class="statline">

                                    <span>
                                        País
                                    </span>

                                    <b>
                                        ${team.country}
                                    </b>

                                </div>


                                <div class="statline">

                                    <span>
                                        Cidade
                                    </span>

                                    <b>
                                        ${team.city}
                                    </b>

                                </div>


                                <div class="statline">

                                    <span>
                                        Reputação
                                    </span>

                                    <b>
                                        ${team.reputation}
                                    </b>

                                </div>


                                <div class="statline">

                                    <span>
                                        Qualidade
                                    </span>

                                    <b>
                                        ${team.quality}
                                    </b>

                                </div>


                                <div class="statline">

                                    <span>
                                        Especialidade
                                    </span>

                                    <b>
                                        ${team.specialty}
                                    </b>

                                </div>


                                <div class="statline">

                                    <span>
                                        Mensalidade
                                    </span>

                                    <b>
                                        $${team.monthlyCost}
                                    </b>

                                </div>


                                <div class="statline">

                                    <span>
                                        Comissão
                                    </span>

                                    <b>
                                        ${team.fightFee}%
                                    </b>

                                </div>


                                <button
                                    class="green"
                                    onclick="
                                        joinTeam(${index})
                                    ">

                                    ✅ ENTRAR NA ACADEMIA

                                </button>


                                <button
                                    onclick="
                                        tryoutTeam(${index})
                                    ">

                                    🥊 FAZER TESTE

                                </button>

                            </div>

                            `

                        )
                        .join("")

                }

            </div>

            `

            :

            ""

        }


        ${
            player.manager
            ?

            `

            <div class="card">

                <div class="title">

                    👔 EMPRESÁRIO

                </div>


                <div class="statline">

                    <span>
                        Nome
                    </span>

                    <b>
                        ${player.manager.name}
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Nível
                    </span>

                    <b>
                        ${player.manager.level}
                    </b>

                </div>


                <div class="statline">

                    <span>
                        Comissão
                    </span>

                    <b>
                        ${player.manager.commission}%
                    </b>

                </div>

            </div>

            `

            :

            ""

        }

        `;

}
/* =========================
   EQUIPE
========================= */




/* =========================
   VIDA / FAMÍLIA
========================= */

function familyScreen() {

    const adult =
        player.age >= 18;


    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">
                ❤️ VIDA
            </div>


            <div class="statline">

                <span>Idade</span>

                <b>
                    ${player.age}
                </b>

            </div>


            <div class="statline">

                <span>Status</span>

                <b>
                    ${player.relationship}
                </b>

            </div>


            <div class="statline">

                <span>Dinheiro</span>

                <b>
                    $${Math.round(player.money)}
                </b>

            </div>


            ${
                !adult

                ?

                `

                <div class="card">

                    🔒 Vida familiar liberada
                    aos 18 anos.

                </div>

                `

                :

                ""

            }


            ${
                adult &&
                player.relationship === "Solteiro"

                ?

                `

                <button
                    onclick="dating()">

                    ❤️ COMEÇAR RELACIONAMENTO

                </button>

                `

                :

                ""

            }


            ${
                adult &&
                player.relationship === "Namorando"

                ?

                `

                <button
                    onclick="dating()">

                    💍 CASAR — $500

                </button>

                `

                :

                ""

            }


            ${
                player.married

                ?

                `

                <button
                    class="green"
                    onclick="haveChild()">

                    👶 TER FILHO — $1.000

                </button>

                `

                :

                ""

            }

        </div>


        <div class="card">

            <div class="title">

                👑 DINASTIA

            </div>


            <div class="statline">

                <span>
                    Geração
                </span>

                <b>
                    ${
                        player.children.length > 0
                        ? "2ª geração"
                        : "1ª geração"
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    Filhos
                </span>

                <b>
                    ${player.children.length}/5
                </b>

            </div>


            ${
                player.children.length > 0

                ?

                player.children
                    .map(

                        child => `

                        <div class="statline">

                            <span>
                                👶 ${child.name}
                            </span>

                            <b>
                                ${child.age} anos
                            </b>

                        </div>

                        `

                    )
                    .join("")

                :

                `
                <p>
                    Sua dinastia ainda não começou.
                </p>
                `

            }

        </div>

        `;

}

/* =========================
   CRIAÇÃO DO LUTADOR
========================= */

function initCreation() {

    document
        .getElementById("creator")
        .innerHTML = `

        <div class="card">

            <div class="title">

                🥊 CRIAR LUTADOR

            </div>


            <input
                id="playerName"
                placeholder="Nome do lutador"
            >


            <select id="country">

                <option>
                    Brasil
                </option>

                <option>
                    Estados Unidos
                </option>

                <option>
                    Japão
                </option>

                <option>
                    México
                </option>

                <option>
                    Argentina
                </option>

                <option>
                    Canadá
                </option>

                <option>
                    Rússia
                </option>

                <option>
                    Reino Unido
                </option>

            </select>


            <select id="weight">

                <option>
                    Peso Leve
                </option>

                <option>
                    Peso Meio-Médio
                </option>

                <option>
                    Peso Médio
                </option>

                <option>
                    Peso Meio-Pesado
                </option>

                <option>
                    Peso Pesado
                </option>

            </select>


            <select id="style">

                <option>
                    Completo
                </option>

                <option>
                    Striker
                </option>

                <option>
                    Wrestler
                </option>

                <option>
                    Grappler
                </option>

            </select>


            <button
                class="green"
                onclick="startGame()">

                ✅ COMEÇAR CARREIRA

            </button>

        </div>

        `;

}


/* =========================
   INICIALIZAÇÃO
========================= */

initCreation();

load();
function rankingScreen() {

    initializeMMWorld();

    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">
                🏆 RANKINGS DO MUNDO
            </div>

            <p>
                Escolha uma organização para
                consultar os rankings.
            </p>

        </div>


        <div class="card">

            <div class="title">
                🇧🇷 REGIONAL
            </div>

            <button
                onclick="
                    showRankingOrganization(
                        'Shooto Brasil'
                    )
                ">

                🥋 Shooto Brasil

            </button>

            <button
                onclick="
                    showRankingOrganization(
                        'Circuito Regional Brasileiro'
                    )
                ">

                🥊 Circuito Regional Brasileiro

            </button>

        </div>


        <div class="card">

            <div class="title">
                🇧🇷 NACIONAL
            </div>

            <button
                onclick="
                    showRankingOrganization(
                        'Jungle Fight'
                    )
                ">

                🇧🇷 Jungle Fight

            </button>

        </div>


        <div class="card">

            <div class="title">
                🌎 INTERNACIONAL
            </div>

            <button
                onclick="
                    showRankingOrganization(
                        'PFL'
                    )
                ">

                🏆 PFL

            </button>

            <button
                onclick="
                    showRankingOrganization(
                        'ONE Championship'
                    )
                ">

                🥊 ONE Championship

            </button>

            <button
                onclick="
                    showRankingOrganization(
                        'Bellator'
                    )
                ">

                🥊 Bellator

            </button>

            <button
                onclick="
                    showRankingOrganization(
                        'RIZIN'
                    )
                ">

                🇯🇵 RIZIN

            </button>

            <button
                onclick="
                    showRankingOrganization(
                        'KSW'
                    )
                ">

                🇵🇱 KSW

            </button>

            <button
                onclick="
                    showRankingOrganization(
                        'UAE Warriors'
                    )
                ">

                🇦🇪 UAE Warriors

            </button>

        </div>


        <div class="card">

            <div class="title">
                👑 ELITE
            </div>

            <button
                onclick="
                    showRankingOrganization(
                        'UFC'
                    )
                ">

                🥇 UFC

            </button>

        </div>

        `;

}

function showRankingOrganization(
    organization
) {

    initializeMMWorld();

    const weight =
        player.weight || "Peso Leve";

    const ranking =
        getWorldRanking(
            organization,
            weight
        );

    const champion =
        getWorldChampion(
            organization,
            weight
        );

    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">
                🏆 ${organization}
            </div>

            <div class="statline">

                <span>
                    Categoria
                </span>

                <b>
                    ${weight}
                </b>

            </div>

            <div class="statline">

                <span>
                    👑 Campeão
                </span>

                <b>
                    ${
                        champion
                        ? champion.name
                        : "Nenhum"
                    }
                </b>

            </div>

        </div>

        <div class="card">

            <div class="title">
                📊 TOP 15
            </div>

            ${
                ranking
                    .map(
                        (fighter, index) => `

                        <div class="statline">

                            <span>
                                #${index + 1}
                                ${fighter.name}
                            </span>

                            <b>
                                ${fighter.wins}-
                                ${fighter.losses}
                            </b>

                        </div>

                        `
                    )
                    .join("")
            }

        </div>

        `;

}
