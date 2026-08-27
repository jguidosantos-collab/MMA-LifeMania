/* =========================================================
   MMA LIFE DYNASTY
   MAIN.JS
   CONTROLE PRINCIPAL DO JOGO
   RESPONSABILIDADES:
   - Inicialização
   - Criação do jogador
   - Carregamento e salvamento
   - Navegação
   - Home
   - Carreira
   - Avanço de semanas
   - Bloqueio no dia da luta
   - Chamadas para Fights.js
   - Treinamento
   - Recuperação
   - Empresário
   - Ranking
   - Mundo MMA
========================================================= */
/* =========================================================
   UTILIDADES
========================================================= */
function getElement(id) {
    return document.getElementById(id);
}
function getContent() {
    return getElement("content");
}
/* =========================================================
   CONTROLE DAS PÁGINAS
========================================================= */
function showCreation() {
    const creation = getElement("creation");
    const game = getElement("game");
    const tabs = getElement("tabs");
    if (creation) {
        creation.classList.remove("hidden");
        creation.style.display = "block";
        creation.style.visibility = "visible";
        creation.style.opacity = "1";
    }
    if (game) {
        game.classList.add("hidden");
        game.style.display = "none";
    }
    if (tabs) {
        tabs.classList.add("hidden");
        tabs.style.display = "none";
    }
}
function showGame() {
    const creation = getElement("creation");
    const game = getElement("game");
    const tabs = getElement("tabs");
    if (creation) {
        creation.classList.add("hidden");
        creation.style.display = "none";
    }
    if (game) {
        game.classList.remove("hidden");
        game.style.display = "block";
        game.style.visibility = "visible";
        game.style.opacity = "1";
    }
    if (tabs) {
        tabs.classList.remove("hidden");
        tabs.style.display = "flex";
        tabs.style.visibility = "visible";
        tabs.style.opacity = "1";
    }
}
/* =========================================================
   GARANTIR PLAYER
========================================================= */
function ensurePlayer() {
    if (
        typeof window.player === "undefined" ||
        !window.player
    ) {
        if (
            typeof window.createDefaultPlayer ===
            "function"
        ) {
            window.player =
                window.createDefaultPlayer();
        } else {
            console.error(
                "createDefaultPlayer() não encontrada."
            );
            return null;
        }
    }
    return window.player;
}
/* =========================================================
   SALVAR
========================================================= */
function saveGame() {
    const player = ensurePlayer();
    if (!player) {
        return;
    }
    localStorage.setItem(
        "mmaLifePlayer",
        JSON.stringify(player)
    );
}
/* =========================================================
   CARREGAR
========================================================= */
function loadGame() {
    const saved =
        localStorage.getItem(
            "mmaLifePlayer"
        );
    if (!saved) {
        return false;
    }
    try {
        const data =
            JSON.parse(saved);
        if (!data) {
            return false;
        }
        const base =
            typeof window.createDefaultPlayer ===
            "function"
                ? window.createDefaultPlayer()
                : {};
        window.player = {
            ...base,
            ...data,
            attributes: {
                ...(base.attributes || {}),
                ...(data.attributes || {})
            },
            professional: {
                ...(base.professional || {}),
                ...(data.professional || {})
            },
            amateur: {
                ...(base.amateur || {}),
                ...(data.amateur || {})
            },
            trainingPlan: {
                ...(base.trainingPlan || {}),
                ...(data.trainingPlan || {})
            },
            currentContract: {
                ...(base.currentContract || {}),
                ...(data.currentContract || {})
            },
            promotionHistory: {
                ...(base.promotionHistory || {}),
                ...(data.promotionHistory || {})
            },
            nextFight: data.nextFight || null,
            managerFightOffer:
                data.managerFightOffer || null
        };
        return true;
    }
    catch (error) {
        console.error(
            "Erro ao carregar jogador:",
            error
        );
        return false;
    }
}
/* =========================================================
   TELA INICIAL
========================================================= */
function startGame() {
    const creation = getElement("creation");
    const creator = getElement("creator");
    const game = getElement("game");
    if (!creation || !creator || !game) {
        console.error(
            "Estrutura do index.html não encontrada."
        );
        return;
    }
    showCreation();
    creator.innerHTML = `
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
                        evolua seu lutador,
                        consiga contratos,
                        conquiste títulos
                        e construa seu legado.
                    </span>
                </div>
            </div>
            <button
                class="start-button"
                onclick="openCharacterCreation()">
                🆕 CRIAR NOVO LUTADOR
            </button>
        </div>
    `;
}
/* =========================================================
   CRIAÇÃO DO LUTADOR
========================================================= */
function openCharacterCreation() {
    showCreation();
    const creator =
        getElement("creator");
    if (!creator) {
        return;
    }
    creator.innerHTML = `
        <div class="card">
            <div class="title">
                🥊 NOVO LUTADOR
            </div>
            <p>
                Crie seu personagem
                e comece a carreira.
            </p>
            <input
                id="newPlayerName"
                type="text"
                placeholder="Nome do lutador"
            >
            <select id="newPlayerCountry">
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
            <select id="newPlayerWeight">
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
            <select id="newPlayerStyle">
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
                onclick="createNewPlayer()">
                🥊 CRIAR LUTADOR
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
function createNewPlayer() {
    const nameInput =
        getElement("newPlayerName");
    if (!nameInput) {
        return;
    }
    const name =
        nameInput.value.trim();
    if (!name) {
        alert(
            "Digite o nome do lutador."
        );
        return;
    }
    if (
        typeof window.createDefaultPlayer !==
        "function"
    ) {
        alert(
            "Erro: player.js não foi carregado."
        );
        return;
    }
    const newPlayer =
        window.createDefaultPlayer();
    newPlayer.name =
        name;
    const country =
        getElement("newPlayerCountry");
    const weight =
        getElement("newPlayerWeight");
    const style =
        getElement("newPlayerStyle");
    if (country) {
        newPlayer.country =
            country.value;
    }
    if (weight) {
        newPlayer.weight =
            weight.value;
    }
    if (style) {
        newPlayer.style =
            style.value;
    }
    newPlayer.age = 15;
    newPlayer.week = 1;
    newPlayer.year = 2026;
    newPlayer.money = 0;
    newPlayer.fame = 0;
    newPlayer.health = 100;
    newPlayer.fatigue = 0;
    newPlayer.nextFight = null;
    newPlayer.managerFightOffer = null;
    newPlayer.log = [
        `🥊 ${name} iniciou sua carreira no MMA.`
    ];
    window.player =
        newPlayer;
    /* =====================================================
       REINICIAR MUNDO MMA
    ===================================================== */
    if (
        typeof window.mmaWorld !==
        "undefined"
    ) {
        window.mmaWorld.initialized =
            false;
        window.mmaWorld.week =
            0;
        window.mmaWorld.fighters =
            [];
        window.mmaWorld.eventsThisWeek =
            [];
        window.mmaWorld.news =
            [];
        window.mmaWorld.championships =
            [];
    }
    saveGame();
    showGame();
    home();
}
/* =========================================================
   OVERALL
========================================================= */
function getOverall() {
    const player =
        ensurePlayer();
    if (!player) {
        return 0;
    }
    if (
        typeof player.overall ===
        "number" &&
        !player._overallStarted
    ) {
        return player.overall;
    }
    const attributes =
        player.attributes || {};
    const values = [
        Number(
            attributes.strength || 40
        ),
        Number(
            attributes.striking || 40
        ),
        Number(
            attributes.wrestling || 40
        ),
        Number(
            attributes.grappling || 40
        ),
        Number(
            attributes.cardio || 40
        ),
        Number(
            attributes.technique || 40
        ),
        Number(
            attributes.defense || 40
        ),
        Number(
            attributes.fightIQ || 40
        ),
        Number(
            attributes.chin || 40
        ),
        Number(
            attributes.offense || 40
        ),
        Number(
            attributes.blocking || 40
        )
    ];
    const average =
        values.reduce(
            function(
                total,
                value
            ) {
                return total + value;
            },
            0
        ) / values.length;
    return Math.min(
        Number(
            player.potential || 90
        ),
        Math.round(
            average
        )
    );
}
/* =========================================================
   DIA DA LUTA
========================================================= */
function isFightDay() {
    const player =
        ensurePlayer();
    if (!player) {
        return false;
    }
    const fight =
        player.nextFight;
    if (!fight) {
        return false;
    }
    if (
        typeof fight.weeksRemaining ===
        "number"
    ) {
        return (
            fight.weeksRemaining <= 0
        );
    }
    if (
        typeof fight.fightWeek ===
        "number"
    ) {
        return (
            Number(player.week) >=
            Number(fight.fightWeek)
        );
    }
    return false;
}
/* =========================================================
   ABRIR TELA DE LUTA
========================================================= */
function openFight() {
    ensurePlayer();
    showGame();
    if (
        typeof window.fightScreen ===
        "function"
    ) {
        window.fightScreen();
        return;
    }
    const content =
        getContent();
    if (content) {
        content.innerHTML = `
            <div class="card">
                <div class="title">
                    🥊 SISTEMA DE LUTA
                </div>
                <p>
                    O sistema de combate
                    não foi carregado.
                </p>
                <p>
                    Verifique se
                    <strong>fights.js</strong>
                    está incluído no index.html.
                </p>
                <button
                    class="main-button"
                    onclick="home()">
                    🏠 VOLTAR
                </button>
            </div>
        `;
    }
}
/* =========================================================
   OFERTA DO EMPRESÁRIO
========================================================= */
function renderManagerOffer() {
    const player =
        ensurePlayer();
    if (
        !player ||
        !player.managerFightOffer
    ) {
        return "";
    }
    const offer =
        player.managerFightOffer;
    return `
        <div class="card manager-offer">
            <div class="title">
                📩 PROPOSTA DO EMPRESÁRIO
            </div>
            <p>
                Seu empresário encontrou
                uma oportunidade para você.
            </p>
            ${
                offer.eventName
                ?
                `
                    <div class="statline">
                        <span>
                            Evento
                        </span>
                        <b>
                            ${offer.eventName}
                        </b>
                    </div>
                `
                :
                ""
            }
            ${
                offer.opponentName
                ?
                `
                    <div class="statline">
                        <span>
                            Adversário
                        </span>
                        <b>
                            ${offer.opponentName}
                        </b>
                    </div>
                `
                :
                ""
            }
            ${
                offer.purse
                ?
                `
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
                `
                :
                ""
            }
            ${
                offer.winBonus
                ?
                `
                    <div class="statline">
                        <span>
                            Bônus por vitória
                        </span>
                        <b>
                            $${Math.round(
                                offer.winBonus
                            )}
                        </b>
                    </div>
                `
                :
                ""
            }
            <button
                class="green"
                onclick="acceptManagerFightOffer()">
                ✅ ACEITAR LUTA
            </button>
            <button
                class="gray"
                onclick="declineManagerFightOffer()">
                ❌ RECUSAR
            </button>
        </div>
    `;
}
/* =========================================================
   HOME
========================================================= */
function home() {
    const player =
        ensurePlayer();
    const content =
        getContent();
    if (!player || !content) {
        return;
    }
    const pro =
        player.professional || {};
    const amateur =
        player.amateur || {};
    const proRecord =
        `${pro.wins || 0}-${pro.losses || 0}-${pro.draws || 0}`;
    const amateurRecord =
        `${amateur.wins || 0}-${amateur.losses || 0}-${amateur.draws || 0}`;
    const fight =
        player.nextFight;
    const fightDay =
        isFightDay();
    content.innerHTML = `
        ${renderManagerOffer()}
        <!-- PERFIL -->
        <div class="card fighter-card">
            <div class="fighter-avatar">
                🥊
            </div>
            <div class="fighter-info">
                <h2>
                    ${player.name || "Lutador"}
                </h2>
                <p>
                    ${player.country || "Brasil"}
                </p>
                <p>
                    ${player.weight || "Peso Leve"}
                </p>
            </div>
        </div>
        <!-- RESUMO -->
        <div class="stats-grid">
            <div class="stat-card">
                <span>
                    IDADE
                </span>
                <strong>
                    ${player.age || 15}
                </strong>
            </div>
            <div class="stat-card">
                <span>
                    OVR
                </span>
                <strong>
                    ${getOverall()}
                </strong>
            </div>
            <div class="stat-card">
                <span>
                    FAMA
                </span>
                <strong>
                    ${Math.round(
                        player.fame || 0
                    )}
                </strong>
            </div>
            <div class="stat-card">
                <span>
                    DINHEIRO
                </span>
                <strong>
                    $${Math.round(
                        player.money || 0
                    )}
                </strong>
            </div>
        </div>
        <!-- CALENDÁRIO -->
        <div class="card">
            <div class="title">
                📅 CALENDÁRIO
            </div>
            <div class="statline">
                <span>
                    Ano
                </span>
                <b>
                    ${player.year || 2026}
                </b>
            </div>
            <div class="statline">
                <span>
                    Semana
                </span>
                <b>
                    ${player.week || 1} / 52
                </b>
            </div>
            ${
                fightDay
                ?
                `
                    <div class="card fight-day-alert">
                        <div class="title">
                            🚨 DIA DA LUTA
                        </div>
                        <p>
                            Sua luta é hoje.
                            Você precisa realizar
                            o combate antes de
                            avançar a semana.
                        </p>
                        <button
                            class="main-button"
                            onclick="openFight()">
                            👊 LUTAR AGORA
                        </button>
                    </div>
                `
                :
                `
                    <button
                        class="main-button"
                        onclick="nextWeek()">
                        ⏭️ AVANÇAR SEMANA
                    </button>
                `
            }
        </div>
        <!-- PRÓXIMA LUTA -->
        <div class="card">
            <div class="title">
                ⚔️ PRÓXIMO COMBATE
            </div>
            ${
                fight
                ?
                `
                    <div class="statline">
                        <span>
                            Evento
                        </span>
                        <b>
                            ${
                                fight.event
                                ?
                                fight.event.name
                                :
                                "Evento MMA"
                            }
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Adversário
                        </span>
                        <b>
                            ${
                                fight.opponent
                                ?
                                (
                                    fight.opponent.displayName ||
                                    fight.opponent.name ||
                                    "Adversário"
                                )
                                :
                                "A definir"
                            }
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            OVR
                        </span>
                        <b>
                            ${
                                fight.opponent
                                ?
                                (
                                    fight.opponent.power ||
                                    fight.opponent.overall ||
                                    0
                                )
                                :
                                0
                            }
                        </b>
                    </div>
                    ${
                        typeof fight.weeksRemaining ===
                        "number"
                        ?
                        `
                            <div class="statline">
                                <span>
                                    Tempo
                                </span>
                                <b>
                                    ${
                                        fight.weeksRemaining <= 0
                                        ?
                                        "HOJE"
                                        :
                                        `${fight.weeksRemaining} semanas`
                                    }
                                </b>
                            </div>
                        `
                        :
                        ""
                    }
                    ${
                        fightDay
                        ?
                        `
                            <button
                                class="main-button"
                                onclick="openFight()">
                                👊 LUTAR AGORA
                            </button>
                        `
                        :
                        ""
                    }
                `
                :
                `
                    <p>
                        ${
                            player.professional &&
                            player.professional.active
                            ?
                            "Seu empresário está procurando uma nova oportunidade."
                            :
                            "Aguardando sua próxima luta amadora."
                        }
                    </p>
                `
            }
        </div>
        <!-- CARREIRA -->
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
                    Amador
                </span>
                <b>
                    ${amateurRecord}
                </b>
            </div>
            <div class="statline">
                <span>
                    Profissional
                </span>
                <b>
                    ${proRecord}
                </b>
            </div>
        </div>
        <!-- CONDIÇÃO -->
        <div class="card">
            <div class="title">
                ❤️ CONDIÇÃO
            </div>
            <div class="statline">
                <span>
                    Saúde
                </span>
                <b>
                    ${Math.round(
                        player.health || 100
                    )}%
                </b>
            </div>
            <div class="statline">
                <span>
                    Fadiga
                </span>
                <b>
                    ${Math.round(
                        player.fatigue || 0
                    )}%
                </b>
            </div>
        </div>
        <!-- RANKING -->
        <div class="card ranking-home-card">
            <div class="title">
                🏆 RANKING MUNDIAL
            </div>
            <p>
                Veja o Top 15 de cada categoria,
                campeões e os melhores lutadores
                do mundo.
            </p>
            <button
                class="main-button"
                onclick="openWorldRanking()">
                🌎 VER RANKING MUNDIAL
            </button>
        </div>
        <!-- MUNDO -->
        <div class="card">
            <div class="title">
                🌎 MUNDO MMA
            </div>
            <p>
                Eventos, lutadores,
                rankings e campeonatos
                continuam evoluindo enquanto
                sua carreira avança.
            </p>
        </div>
        <!-- JOGO -->
        <div class="card">
            <div class="title">
                ⚙️ JOGO
            </div>
            <button
                type="button"
                class="main-button"
                onclick="window.resetGame()">
                🔄 REINICIAR CARREIRA
            </button>
        </div>
    `;
}
/* =========================================================
   RANKING MUNDIAL
========================================================= */
function openWorldRanking() {
    showGame();
    if (
        typeof window.rankingScreen ===
        "function"
    ) {
        window.rankingScreen();
        return;
    }
    const content =
        getContent();
    if (content) {
        content.innerHTML = `
            <div class="card">
                <div class="title">
                    🏆 RANKING MUNDIAL
                </div>
                <p>
                    O sistema de ranking
                    não foi carregado.
                </p>
                <p>
                    Verifique se o arquivo
                    <strong>ranking.js</strong>
                    está incluído no index.html.
                </p>
                <button
                    class="main-button"
                    onclick="home()">
                    🏠 VOLTAR
                </button>
            </div>
        `;
    }
}
/* =========================================================
   NAVEGAÇÃO
========================================================= */
function tab(name) {
    showGame();
    const content =
        getElement("content");
    if (!content) {
        return;
    }
    if (name === "home") {
        home();
        return;
    }
    if (name === "career") {
        career();
        return;
    }
    if (name === "train") {
        if (
            typeof window.training ===
            "function"
        ) {
            window.training();
        }
        return;
    }
    if (name === "fight") {
        openFight();
        return;
    }
    if (name === "team") {
        if (
            typeof window.teamScreen ===
            "function"
        ) {
            window.teamScreen();
        }
        return;
    }
    if (name === "life") {
        if (
            typeof window.lifeScreen ===
            "function"
        ) {
            window.lifeScreen();
        }
        return;
    }
    if (name === "ranking") {
        openWorldRanking();
        return;
    }
}
/* =========================================================
   PRÓXIMA SEMANA
========================================================= */
function nextWeek() {
    const player =
        ensurePlayer();
    if (!player) {
        return;
    }
    /* =====================================================
       BLOQUEIO NO DIA DA LUTA
    ===================================================== */
    if (isFightDay()) {
        alert(
            "🚨 Você chegou ao dia da luta. Faça o combate antes de avançar a semana."
        );
        openFight();
        return;
    }
    /* =====================================================
       VIDA
    ===================================================== */
    if (
        typeof window.processLifeWeek ===
        "function"
    ) {
        try {
            window.processLifeWeek();
        }
        catch (error) {
            console.error(
                "Erro ao processar vida:",
                error
            );
        }
    }
    /* =====================================================
       MUNDO MMA
    ===================================================== */
    if (
        typeof window.simulateMMWorldWeek ===
        "function"
    ) {
        try {
            window.simulateMMWorldWeek();
        }
        catch (error) {
            console.error(
                "Erro ao simular Mundo MMA:",
                error
            );
        }
    }
   /* =====================================================
   CAMP DA LUTA
===================================================== */

if (
    typeof window.processFightCampWeek ===
    "function"
) {

    try {

        window.processFightCampWeek();

    }
    catch (error) {

        console.error(
            "Erro ao processar camp da luta:",
            error
        );

    }

}
    /* =====================================================
       TREINAMENTO
    ===================================================== */
    const plan =
        player.trainingPlan &&
        player.trainingPlan.weeks
        ?
        player.trainingPlan.weeks[player.week]
        :
        [];
    if (Array.isArray(plan)) {
        plan.forEach(
            function(training) {
                if (!training) {
                    return;
                }
                const attribute =
                    training.attribute;
                if (!attribute) {
                    return;
                }
                const current =
                    Number(
                        player.attributes &&
                        player.attributes[attribute]
                            || 60
                    );
                const potential =
                    Number(
                        player.potential ||
                        90
                    );
                if (
                    current >= potential
                ) {
                    return;
                }
                const gain =
                    Math.min(
                        Number(
                            training.gain ||
                            0.5
                        ),
                        potential -
                        current
                    );
                if (
                    !player.attributes
                ) {
                    player.attributes = {};
                }
                player.attributes[attribute] =
                    Number(
                        (
                            current +
                            gain
                        ).toFixed(2)
                    );
            }
        );
    }
    /* =====================================================
       RECUPERAÇÃO NORMAL
    ===================================================== */
    player.fatigue =
        Math.max(
            0,
            Number(
                player.fatigue ||
                0
            ) - 10
        );
    player.health =
        Math.min(
            100,
            Number(
                player.health ||
                100
            ) + 3
        );
    /* =====================================================
       AVANÇA SEMANA
    ===================================================== */
    player.week =
        Number(
            player.week ||
            1
        ) + 1;

   /* =====================================================
   ATUALIZAR CONTAGEM DA PRÓXIMA LUTA
===================================================== */

if (
    typeof window.updateFightCountdown ===
    "function"
) {

    try {

        window.updateFightCountdown();

    }
    catch (error) {

        console.error(
            "Erro ao atualizar contador da luta:",
            error
        );

    }

}
    /* =====================================================
       RECUPERAÇÃO PÓS-LUTA
    ===================================================== */
    if (
        typeof window.processFightRecovery ===
        "function"
    ) {
        try {
            window.processFightRecovery();
        }
        catch (error) {
            console.error(
                "Erro ao processar recuperação:",
                error
            );
        }
    }
    /* =====================================================
       EMPRESÁRIO
    ===================================================== */
    if (
        typeof window.processManagerFightOffer ===
        "function"
    ) {
        try {
            window.processManagerFightOffer();
        }
        catch (error) {
            console.error(
                "Erro ao procurar luta:",
                error
            );
        }
    }
    /* =====================================================
       RANKING
    ===================================================== */
    if (
        typeof window.processRankingWeek ===
        "function"
    ) {
        try {
            window.processRankingWeek();
        }
        catch (error) {
            console.error(
                "Erro ao atualizar ranking:",
                error
            );
        }
    }
    /* =====================================================
       NOVO ANO
    ===================================================== */
    if (
        player.week > 52
    ) {
        player.week = 1;
        player.year =
            Number(
                player.year ||
                2026
            ) + 1;
        player.age =
            Number(
                player.age ||
                15
            ) + 1;
        player.log =
            player.log ||
            [];
        player.log.unshift(
            `🎆 Começou o Ano ${player.year}.`
        );
        if (
            typeof window.processManagerContractYear ===
            "function"
        ) {
            try {
                window.processManagerContractYear();
            }
            catch (error) {
                console.error(
                    "Erro ao processar contrato:",
                    error
                );
            }
        }
    }
    saveGame();
    home();
}
/* =========================================================
   DESCANSAR
========================================================= */
function rest() {
    const player =
        ensurePlayer();
    if (!player) {
        return;
    }
    player.fatigue =
        Math.max(
            0,
            Number(
                player.fatigue ||
                0
            ) - 15
        );
    player.health =
        Math.min(
            100,
            Number(
                player.health ||
                100
            ) + 5
        );
    nextWeek();
}
/* =========================================================
   REINICIAR
========================================================= */
function resetGame() {
    const confirmed =
        confirm(
            "Apagar esta carreira e criar um novo lutador?"
        );
    if (!confirmed) {
        return;
    }
    localStorage.removeItem(
        "mmaLifePlayer"
    );
    if (
        typeof window.createDefaultPlayer ===
        "function"
    ) {
        window.player =
            window.createDefaultPlayer();
    }
    else {
        window.player =
            null;
    }
    if (
        typeof window.mmaWorld !==
        "undefined"
    ) {
        window.mmaWorld.initialized =
            false;
        window.mmaWorld.week =
            0;
        window.mmaWorld.fighters =
            [];
        window.mmaWorld.eventsThisWeek =
            [];
        window.mmaWorld.news =
            [];
        window.mmaWorld.championships =
            [];
    }
    const game =
        getElement("game");
    const tabs =
        getElement("tabs");
    if (game) {
        game.classList.add("hidden");
        game.style.display =
            "none";
    }
    if (tabs) {
        tabs.classList.add("hidden");
        tabs.style.display =
            "none";
    }
    const creation =
        getElement("creation");
    if (creation) {
        creation.classList.remove(
            "hidden"
        );
        creation.style.display =
            "block";
    }
    startGame();
}
/* =========================================================
   CARREIRA
========================================================= */
function career() {
    const player =
        ensurePlayer();
    const content =
        getElement("content");
    if (!player || !content) {
        return;
    }
    const amateur =
        player.amateur ||
        {};
    const professional =
        player.professional ||
        {};
    const careerStage =
        player.careerStage ||
        "amateur";
    const stageLabels = {
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
    const stageLabel =
        stageLabels[careerStage] ||
        "🥋 Amador";
    const contract =
        player.currentContract;
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🥊 CARREIRA
            </div>
            <p>
                Acompanhe sua trajetória
                no MMA.
            </p>
        </div>
        <div class="card">
            <div class="title">
                📈 STATUS
            </div>
            <div class="statline">
                <span>
                    Estágio
                </span>
                <b>
                    ${stageLabel}
                </b>
            </div>
            <div class="statline">
                <span>
                    Idade
                </span>
                <b>
                    ${player.age || 15} anos
                </b>
            </div>
            <div class="statline">
                <span>
                    OVR
                </span>
                <b>
                    ${getOverall()}
                </b>
            </div>
            <div class="statline">
                <span>
                    Fama
                </span>
                <b>
                    ${Math.round(
                        player.fame || 0
                    )}
                </b>
            </div>
            <div class="statline">
                <span>
                    Dinheiro
                </span>
                <b>
                    $${Math.round(
                        player.money || 0
                    )}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                📊 RECORDES
            </div>
            <div class="statline">
                <span>
                    Amador
                </span>
                <b>
                    ${amateur.wins || 0}-
                    ${amateur.losses || 0}-
                    ${amateur.draws || 0}
                </b>
            </div>
            <div class="statline">
                <span>
                    Profissional
                </span>
                <b>
                    ${professional.wins || 0}-
                    ${professional.losses || 0}-
                    ${professional.draws || 0}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                📄 CONTRATO ATUAL
            </div>
            ${
                contract &&
                contract.active
                ?
                `
                    <div class="statline">
                        <span>
                            Organização
                        </span>
                        <b>
                            ${contract.promotionName}
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Lutas
                        </span>
                        <b>
                            ${
                                contract.fightsCompleted ||
                                0
                            }
                            /
                            ${
                                contract.fights ||
                                0
                            }
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Bolsa
                        </span>
                        <b>
                            $${Math.round(
                                contract.purse ||
                                0
                            )}
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Bônus por vitória
                        </span>
                        <b>
                            $${Math.round(
                                contract.winBonus ||
                                0
                            )}
                        </b>
                    </div>
                `
                :
                `
                    <p>
                        Nenhum contrato
                        profissional ativo.
                    </p>
                `
            }
        </div>
        <div class="card">
            <div class="title">
                🏆 OBJETIVO
            </div>
            <p>
                Comece no circuito amador,
                conquiste vitórias,
                torne-se profissional
                após cumprir os requisitos
                e busque os grandes títulos.
            </p>
        </div>
    `;
}
/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */
window.startGame =
    startGame;
window.openCharacterCreation =
    openCharacterCreation;
window.createNewPlayer =
    createNewPlayer;
window.home =
    home;
window.tab =
    tab;
window.nextWeek =
    nextWeek;
window.advanceWeek =
    nextWeek;
window.rest =
    rest;
window.resetGame =
    resetGame;
window.getOverall =
    getOverall;
window.saveGame =
    saveGame;
window.save =
    saveGame;
window.createPlayer =
    createNewPlayer;
window.createPlayerFromScreen =
    createNewPlayer;
window.career =
    career;
window.openWorldRanking =
    openWorldRanking;
window.isFightDay =
    isFightDay;
window.openFight =
    openFight;
/* =========================================================
   INICIALIZAÇÃO
========================================================= */
function initializeMmaLife() {
    const saved =
        localStorage.getItem(
            "mmaLifePlayer"
        );
    if (saved) {
        if (
            loadGame() &&
            window.player &&
            window.player.name
        ) {
            showGame();
            home();
            return;
        }
    }
    window.player =
        null;
    showCreation();
    startGame();
}
/* =========================================================
   DOM READY
========================================================= */
if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        initializeMmaLife
    );
}
else {
    initializeMmaLife();
}
