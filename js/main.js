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

    const creation =
        document.getElementById("creation");

    const game =
        document.getElementById("game");

    const tabs =
        document.getElementById("tabs");

    const content =
        document.getElementById("content");

    if (!content) {
        return;
    }

    // Mostra a área principal do jogo
    if (creation) {
        creation.classList.add("hidden");
    }

    if (game) {
        game.classList.remove("hidden");
    }

    if (tabs) {
        tabs.classList.add("hidden");
    }

    content.innerHTML = `
        <div class="start-screen">

            <div class="start-logo">
                🥊
            </div>

            <h1>
                MMA LIFE
            </h1>

            <p class="start-subtitle">
                CONSTRUA SUA CARREIRA.<br>
                ESCREVA SEU LEGADO.
            </p>

            <div class="start-preview">

                <div class="start-fighter">
                    🥊
                </div>

                <div class="start-preview-text">

                    <strong>
                        SUA HISTÓRIA COMEÇA AQUI
                    </strong>

                    <span>
                        Comece como amador,
                        construa sua reputação,
                        conquiste contratos
                        e chegue ao topo do MMA.
                    </span>

                </div>

            </div>

            <button
                class="start-button"
                onclick="openCharacterCreation()">

                🆕 CRIAR NOVO LUTADOR

            </button>

            <div class="start-footer">
                AMADOR
                →
                REGIONAL
                →
                NACIONAL
                →
                INTERNACIONAL
                →
                UFC
            </div>

        </div>
    `;
}
/* =========================================================
   ABRIR CRIAÇÃO DO LUTADOR
========================================================= */
function openCharacterCreation() {
    const content =
        document.getElementById("content");
    if (!content) {
        return;
    }
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🥊 CRIAR NOVO LUTADOR
            </div>
            <p>
                Comece sua jornada no MMA.
            </p>
            <input
                id="playerName"
                placeholder="Nome do lutador"
            >
            <select id="country">
                <option value="Brasil">
                    🇧🇷 Brasil
                </option>
                <option value="Estados Unidos">
                    🇺🇸 Estados Unidos
                </option>
                <option value="Japão">
                    🇯🇵 Japão
                </option>
                <option value="México">
                    🇲🇽 México
                </option>
                <option value="Argentina">
                    🇦🇷 Argentina
                </option>
                <option value="Canadá">
                    🇨🇦 Canadá
                </option>
                <option value="Rússia">
                    🇷🇺 Rússia
                </option>
                <option value="Reino Unido">
                    🇬🇧 Reino Unido
                </option>
            </select>
            <select id="weight">
                <option value="Peso Leve">
                    Peso Leve
                </option>
                <option value="Peso Meio-Médio">
                    Peso Meio-Médio
                </option>
                <option value="Peso Médio">
                    Peso Médio
                </option>
                <option value="Peso Meio-Pesado">
                    Peso Meio-Pesado
                </option>
                <option value="Peso Pesado">
                    Peso Pesado
                </option>
            </select>
            <select id="style">
                <option value="Completo">
                    🥊 Completo
                </option>
                <option value="Striker">
                    👊 Striker
                </option>
                <option value="Wrestler">
                    🤼 Wrestler
                </option>
                <option value="Grappler">
                    🥋 Grappler
                </option>
            </select>
            <button
                class="green"
                onclick="createPlayerFromScreen()">
                ✅ CRIAR LUTADOR
            </button>
            <button
                class="gray"
                onclick="startGame()">
                ← VOLTAR
            </button>
        </div>
    `;
}
/* =========================================================
   CRIAR LUTADOR
========================================================= */
function createPlayerFromScreen() {

    const name =
        document.getElementById("playerName").value.trim();

    const country =
        document.getElementById("country").value;

    const weight =
        document.getElementById("weight").value;

    const style =
        document.getElementById("style").value;

    if (!name) {
        alert("Digite o nome do seu lutador.");
        return;
    }

    // Cria o jogador usando o sistema principal
    if (typeof createPlayer === "function") {
        createPlayer();

        player.name = name;
        player.country = country;
        player.weight = weight;
        player.style = style;
    }

    // Garantir dados básicos
    player.age = 15;
    player.money = 500;
    player.fame = 0;
    player.health = 100;
    player.fatigue = 0;

    player.careerStage = "amateur";
    player.nextFight = null;
    player.team = null;
    player.manager = null;

    if (!player.log) {
        player.log = [];
    }

    if (!player.children) {
        player.children = [];
    }

    // Salva o novo lutador
    save();

    // Esconde criação
    const creation =
        document.getElementById("creation");

    if (creation) {
        creation.classList.add("hidden");
    }

    // Mostra o jogo
    const game =
        document.getElementById("game");

    if (game) {
        game.classList.remove("hidden");
    }

    // Mostra as abas
    const tabs =
        document.getElementById("tabs");

    if (tabs) {
        tabs.classList.remove("hidden");
    }

    // ABRE A TELA PRINCIPAL AUTOMATICAMENTE
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

    const ranking =
        typeof rankingText === "function"
            ? rankingText()
            : "—";

    const stage =
        player.careerStage === "elite"
            ? "👑 ELITE"
            : player.careerStage === "international"
            ? "🌎 INTERNACIONAL"
            : player.careerStage === "national"
            ? "🇧🇷 NACIONAL"
            : player.professional &&
              player.professional.active
            ? "🥊 REGIONAL"
            : "🥋 AMADOR";

    document.getElementById("content").innerHTML = `

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
                    🌎 ${player.country || "Brasil"}
                </div>

                <div class="fighter-weight">
                    ${player.weight || "Categoria"} • ${stage}
                </div>

            </div>

        </div>

${overallText()}
        <div class="stats-grid">

            <div class="stat-card">
                <span>IDADE</span>
                <strong>
                    ${player.age || 15}
                </strong>
            </div>

            <div class="stat-card">
                <span>DINHEIRO</span>
                <strong>
                    $${Math.round(player.money || 0)}
                </strong>
            </div>

            <div class="stat-card">
                <span>FAMA</span>
                <strong>
                    ${Math.round(player.fame || 0)}
                </strong>
            </div>

            <div class="stat-card">
                <span>RANKING</span>
                <strong>
                    ${ranking}
                </strong>
            </div>

        </div>


        <div class="section-title">
            📅 VIDA ATUAL
        </div>

        <div class="card">

            <div class="statline">
                <span>Ano</span>
                <b>${player.year || 2026}</b>
            </div>

            <div class="statline">
                <span>Semana</span>
                <b>${player.week || 0}</b>
            </div>

            <div class="statline">
                <span>Carreira</span>
                <b>${stage}</b>
            </div>

            <div class="statline">
                <span>Profissional</span>
                <b>
                    ${
                        player.professional &&
                        player.professional.active
                            ? "Sim"
                            : "Não"
                    }
                </b>
            </div>

        </div>


        <div class="section-title">
            🔥 PRÓXIMO EVENTO
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
                        💰 $${Math.round(
                            nextFight.purse || 0
                        )}
                    </span>

                </div>

                <button
                    class="red"
                    onclick="fightScreen()">

                    👊 VER LUTA

                </button>

            </div>

            `

            :

            `

            <div class="empty-card">

                <div style="
                    font-size:38px;
                    text-align:center;
                    margin-bottom:10px;
                ">
                    🥊
                </div>

                <strong>
                    Nenhuma luta marcada
                </strong>

                <p>
                    Continue treinando e avance sua carreira.
                </p>

                <button
                    onclick="fightScreen()">

                    🔎 PROCURAR LUTA

                </button>

            </div>

            `
        }


        <div class="section-title">
            📊 CARTÃO DA CARREIRA
        </div>

        <div class="career-card">

            <div class="career-stage">
                ${stage}
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
                onclick="career()">

                🏆 ABRIR CARREIRA

            </button>

        </div>


        <div class="section-title">
            🏢 EQUIPE
        </div>

        <div class="team-preview">

            <div>

                <span>ACADEMIA</span>

                <strong>
                    ${
                        team
                            ? team.name
                            : "Nenhuma"
                    }
                </strong>

            </div>

            <div>

                <span>EMPRESÁRIO</span>

                <strong>
                    ${
                        manager
                            ? manager.name
                            : "Nenhum"
                    }
                </strong>

            </div>

            <button
                onclick="teamScreen()">

                🏢 GERENCIAR EQUIPE

            </button>

        </div>


        <div class="section-title">
            ❤️ VIDA
        </div>

        <div class="card">

            <div class="statline">

                <span>
                    Relacionamento
                </span>

                <b>
                    ${player.relationship || "Solteiro"}
                </b>

            </div>

            <div class="statline">

                <span>
                    Filhos
                </span>

                <b>
                    ${
                        player.children
                            ? player.children.length
                            : 0
                    }
                </b>

            </div>

            <button
                onclick="familyScreen()">

                ❤️ ABRIR VIDA

            </button>

        </div>


        <div class="section-title">
            ❤️ CONDIÇÃO
        </div>

        <div class="condition-card">

            <div>

                <span>SAÚDE</span>

                <strong>
                    ${Math.round(
                        player.health || 0
                    )}%
                </strong>

            </div>

            <div>

                <span>FADIGA</span>

                <strong>
                    ${Math.round(
                        player.fatigue || 0
                    )}%
                </strong>

            </div>

        </div>


        <div class="section-title">
            ⚡ AÇÕES
        </div>

        <div class="quick-grid">

            <button onclick="career()">
                🏆
                <span>Carreira</span>
            </button>

            <button onclick="training()">
                🏋️
                <span>Treinar</span>
            </button>

            <button onclick="fightScreen()">
                👊
                <span>Lutar</span>
            </button>

            <button onclick="familyScreen()">
                ❤️
                <span>Vida</span>
            </button>

        </div>


        <div class="restart-section">

            <button
                class="gray"
                onclick="resetGame()">

                🔄 REINICIAR JOGO

            </button>

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

load();

startGame();
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
/* =========================
   INICIALIZAÇÃO
========================= */
window.addEventListener("load", function () {
    if (
        typeof load === "function"
    ) {
        load();
    }
    setTimeout(function () {
        if (
            typeof player !== "undefined" &&
            player &&
            player.name
        ) {
            home();
        } else {
            startGame();
        }
    }, 100);
});
/* =========================================================
   SISTEMA DE OVERALL + POTENCIAL + ATRIBUTOS AVANÇADOS
========================================================= */

function randomPotential() {
    // Maioria dos atletas fica entre 78 e 94.
    // Talentos excepcionais podem chegar a 98.
    const roll = Math.random();

    if (roll < 0.05) return randomDecimal(94, 98);
    if (roll < 0.20) return randomDecimal(90, 94);
    if (roll < 0.50) return randomDecimal(85, 90);
    if (roll < 0.80) return randomDecimal(80, 85);

    return randomDecimal(78, 80);
}

function randomDecimal(min, max) {
    return Math.round(
        (min + Math.random() * (max - min)) * 100
    ) / 100;
}

/* =========================================================
   ATRIBUTOS DAS MODALIDADES
========================================================= */

function createAdvancedAttributes() {

    return {

        boxing: {
            jab: 60,
            straight: 60,
            hook: 60,
            uppercut: 60,
            defense: 60,
            dodge: 60,
            blocking: 60,
            counter: 60
        },

        muayThai: {
            attack: 60,
            defense: 60,
            clinch: 60,
            elbows: 60,
            knees: 60,
            kicks: 60,
            blocking: 60,
            chin: 60
        },

        kickboxing: {
            attack: 60,
            defense: 60,
            combinations: 60,
            kicks: 60,
            punches: 60,
            blocking: 60,
            movement: 60
        },

        wrestling: {
            takedown: 60,
            takedownDefense: 60,
            control: 60,
            pressure: 60,
            scramble: 60,
            clinch: 60
        },

        jiuJitsu: {
            guard: 60,
            passing: 60,
            control: 60,
            submission: 60,
            submissionDefense: 60,
            transitions: 60
        },

        physical: {
            strength: 60,
            speed: 60,
            cardio: 60,
            explosiveness: 60,
            recovery: 60
        },

        mental: {
            fightIQ: 60,
            discipline: 60,
            confidence: 60,
            composure: 60,
            experience: 60
        }

    };

}

/* =========================================================
   POTENCIAL POR ATRIBUTO
========================================================= */

function createPotentialAttributes() {

    return {

        boxing: {},
        muayThai: {},
        kickboxing: {},
        wrestling: {},
        jiuJitsu: {},
        physical: {},
        mental: {}

    };

}

/* =========================================================
   GERAR POTENCIAL INDIVIDUAL
========================================================= */

function generateAttributePotentials() {

    const attributes =
        createAdvancedAttributes();

    const potentials =
        createPotentialAttributes();

    Object.keys(attributes).forEach(category => {

        Object.keys(attributes[category])
            .forEach(attribute => {

                potentials[category][attribute] =
                    Math.round(
                        randomDecimal(
                            78,
                            98
                        ) * 100
                    ) / 100;

            });

    });

    return potentials;

}

/* =========================================================
   CALCULAR MÉDIA DE UMA MODALIDADE
========================================================= */

function categoryOverall(category) {

    if (
        !player.advancedAttributes ||
        !player.advancedAttributes[category]
    ) {
        return 60;
    }

    const values =
        Object.values(
            player.advancedAttributes[category]
        );

    if (!values.length) {
        return 60;
    }

    const total =
        values.reduce(
            (sum, value) =>
                sum + Number(value || 0),
            0
        );

    return Math.round(
        (total / values.length) * 100
    ) / 100;

}

/* =========================================================
   CALCULAR OVERALL GERAL
========================================================= */

function calculateOverall() {

    const categories = {

        boxing: 0.18,

        muayThai: 0.18,

        kickboxing: 0.12,

        wrestling: 0.16,

        jiuJitsu: 0.14,

        physical: 0.12,

        mental: 0.10

    };

    let overall = 0;

    Object.keys(categories)
        .forEach(category => {

            overall +=
                categoryOverall(category) *
                categories[category];

        });

    /*
     * O OVR nunca passa do potencial.
     */

    const potential =
        Number(
            player.potential || 90
        );

    overall =
        Math.min(
            overall,
            potential
        );

    return Math.round(
        overall * 100
    ) / 100;

}

/* =========================================================
   INICIALIZAR OVERALL DO LUTADOR
========================================================= */

function initializeOverallSystem() {

    if (
        !player.advancedAttributes
    ) {

        player.advancedAttributes =
            createAdvancedAttributes();

    }

    if (
        !player.attributePotential
    ) {

        player.attributePotential =
            generateAttributePotentials();

    }

    if (
        !player.potential
    ) {

        player.potential =
            randomPotential();

    }

    /*
     * Todo lutador novo começa
     * aproximadamente em 60 OVR.
     */

    if (
        player.overall === undefined ||
        player.overall === null
    ) {

        player.overall = 60;

    }

}

/* =========================================================
   EVOLUÇÃO DECIMAL
========================================================= */

function improveAttribute(
    category,
    attribute,
    amount
) {

    if (
        !player.advancedAttributes ||
        !player.advancedAttributes[category]
    ) {
        return;
    }

    if (
        player.advancedAttributes[category][attribute]
        === undefined
    ) {
        return;
    }

    const current =
        Number(
            player.advancedAttributes[category][attribute]
        );

    const potential =
        Number(
            player.attributePotential?.[category]?.[attribute]
            || player.potential
            || 90
        );

    let newValue =
        current + Number(amount || 0);

    /*
     * Nunca ultrapassa o potencial individual.
     */

    newValue =
        Math.min(
            newValue,
            potential
        );

    /*
     * Nunca ultrapassa 100.
     */

    newValue =
        Math.min(
            newValue,
            100
        );

    player.advancedAttributes[category][attribute] =
        Math.round(
            newValue * 100
        ) / 100;

    player.overall =
        calculateOverall();

}

/* =========================================================
   TREINO AUTOMÁTICO
========================================================= */

function automaticTraining(type) {

    initializeOverallSystem();

    const trainingMap = {

        boxing: [
            ["boxing", "jab"],
            ["boxing", "straight"],
            ["boxing", "hook"],
            ["boxing", "defense"],
            ["boxing", "blocking"]
        ],

        muayThai: [
            ["muayThai", "attack"],
            ["muayThai", "clinch"],
            ["muayThai", "elbows"],
            ["muayThai", "knees"],
            ["muayThai", "kicks"],
            ["muayThai", "blocking"]
        ],

        kickboxing: [
            ["kickboxing", "attack"],
            ["kickboxing", "combinations"],
            ["kickboxing", "kicks"],
            ["kickboxing", "punches"],
            ["kickboxing", "movement"]
        ],

        wrestling: [
            ["wrestling", "takedown"],
            ["wrestling", "takedownDefense"],
            ["wrestling", "control"],
            ["wrestling", "pressure"],
            ["wrestling", "scramble"]
        ],

        jiuJitsu: [
            ["jiuJitsu", "guard"],
            ["jiuJitsu", "passing"],
            ["jiuJitsu", "control"],
            ["jiuJitsu", "submission"],
            ["jiuJitsu", "submissionDefense"]
        ],

        physical: [
            ["physical", "strength"],
            ["physical", "speed"],
            ["physical", "cardio"],
            ["physical", "explosiveness"],
            ["physical", "recovery"]
        ],

        mental: [
            ["mental", "fightIQ"],
            ["mental", "discipline"],
            ["mental", "confidence"],
            ["mental", "composure"]
        ]

    };

    const selected =
        trainingMap[type];

    if (!selected) {
        return;
    }

    /*
     * Cada treino gera uma evolução
     * pequena e decimal.
     */

    selected.forEach(item => {

        const category = item[0];
        const attribute = item[1];

        /*
         * Quanto maior a fadiga,
         * menor a evolução.
         */

        const fatiguePenalty =
            Math.max(
                0.35,
                1 -
                (
                    Number(player.fatigue || 0)
                    / 150
                )
            );

        let evolution =
            randomDecimal(
                0.25,
                0.90
            );

        evolution *=
            fatiguePenalty;

        /*
         * Potencial alto facilita
         * evolução.
         */

        const potential =
            Number(
                player.attributePotential?.[category]?.[attribute]
                || player.potential
                || 90
            );

        const current =
            Number(
                player.advancedAttributes?.[category]?.[attribute]
                || 60
            );

        if (
            potential - current < 5
        ) {

            evolution *= 0.55;

        }

        improveAttribute(
            category,
            attribute,
            evolution
        );

    });

    /*
     * Treinar gera fadiga.
     */

    player.fatigue =
        Math.min(
            100,
            Number(player.fatigue || 0) +
            randomDecimal(5, 12)
        );

    /*
     * Saúde sofre um pequeno impacto
     * dependendo da carga.
     */

    player.health =
        Math.max(
            0,
            Number(player.health || 100) -
            randomDecimal(0.5, 2)
        );

    player.overall =
        calculateOverall();

}

/* =========================================================
   MOSTRAR OVR / POTENCIAL
========================================================= */

function overallText() {

    initializeOverallSystem();

    return `
        <div class="overall-box">
            <div>
                <span>OVR</span>
                <strong>
                    ${Number(player.overall || 60).toFixed(2)}
                </strong>
            </div>

            <div>
                <span>POTENCIAL</span>
                <strong>
                    ${Number(player.potential || 90).toFixed(2)}
                </strong>
            </div>
        </div>
    `;

}

/* =========================================================
   MOSTRAR ATRIBUTOS AVANÇADOS
========================================================= */

function advancedAttributesScreen() {

    initializeOverallSystem();

    const categories = {

        boxing: "🥊 BOXE",

        muayThai: "🇹🇭 MUAY THAI",

        kickboxing: "🥊 KICKBOXING",

        wrestling: "🤼 WRESTLING",

        jiuJitsu: "🥋 JIU-JITSU",

        physical: "💪 FÍSICO",

        mental: "🧠 MENTAL"

    };

    let html = `

        <div class="card">

            <div class="title">
                📊 ATRIBUTOS DO LUTADOR
            </div>

            ${overallText()}

        </div>

    `;

    Object.keys(categories)
        .forEach(category => {

            const overall =
                categoryOverall(category);

            html += `

                <div class="card">

                    <div class="title">

                        ${categories[category]}

                        <span style="
                            float:right;
                            font-size:14px;
                        ">
                            ${overall.toFixed(2)}
                        </span>

                    </div>

            `;

            Object.keys(
                player.advancedAttributes[category]
            ).forEach(attribute => {

                const value =
                    Number(
                        player
                            .advancedAttributes
                            [category]
                            [attribute]
                    );

                const potential =
                    Number(
                        player
                            .attributePotential
                            [category]
                            [attribute]
                    );

                const label =
                    attribute
                        .replace(
                            /([A-Z])/g,
                            " $1"
                        )
                        .replace(
                            /^./,
                            c => c.toUpperCase()
                        );

                html += `

                    <div class="statline">

                        <span>
                            ${label}
                        </span>

                        <b>
                            ${value.toFixed(2)}
                            /
                            ${potential.toFixed(2)}
                        </b>

                    </div>

                `;

            });

            html += `</div>`;

        });

    document
        .getElementById("content")
        .innerHTML = html;

}

/* =========================================================
   GARANTIR SISTEMA AO CARREGAR
========================================================= */

const oldLoad =
    typeof load === "function"
        ? load
        : null;

function initializeNewPlayerStats() {

    if (!player) {
        return;
    }

    initializeOverallSystem();

    /*
     * Compatibilidade com o sistema antigo.
     */

    player.attributes =
        player.attributes || {};

    player.attributes.overall =
        player.overall;

    player.attributes.potential =
        player.potential;

    save();

}
