/* =========================================================
   MMA LIFE DYNASTY
   MAIN.JS
   CONTROLE PRINCIPAL DO JOGO
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
        if (typeof createDefaultPlayer === "function") {
            window.player = createDefaultPlayer();
        } else {
            console.error(
                "createDefaultPlayer() não encontrada."
            );
        }
    }
}
/* =========================================================
   NORMALIZAR DADOS NOVOS
========================================================= */
function normalizePlayerData() {
    ensurePlayer();
    if (!window.player) {
        return;
    }
    const p = window.player;
    /* =========================
       ESTRUTURAS PRINCIPAIS
    ========================= */
    p.attributes =
        p.attributes || {};
    p.professional =
        p.professional || {};
    p.amateur =
        p.amateur || {};
    p.trainingPlan =
        p.trainingPlan || {};
    p.log =
        Array.isArray(p.log)
            ? p.log
            : [];
    /* =========================
       CONTRATOS
    ========================= */
    p.promotionHistory =
        p.promotionHistory || {};
    if (
        typeof p.currentContract ===
        "undefined"
    ) {
        p.currentContract = null;
    }
    if (
        typeof p.currentPromotion ===
        "undefined"
    ) {
        p.currentPromotion = null;
    }
    /* =========================
       CARREIRA
    ========================= */
    if (!p.careerStage) {
        if (
            p.professional &&
            p.professional.active
        ) {
            p.careerStage =
                "regional";
        } else {
            p.careerStage =
                "amateur";
        }
    }
    /* =========================
       CALENDÁRIO
    ========================= */
    if (
        typeof p.week !== "number"
    ) {
        p.week = 1;
    }
    if (
        typeof p.year !== "number"
    ) {
        p.year = 2026;
    }
    /* =========================
       CONDIÇÃO
    ========================= */
    if (
        typeof p.health !== "number"
    ) {
        p.health = 100;
    }
    if (
        typeof p.fatigue !== "number"
    ) {
        p.fatigue = 0;
    }
    if (
        typeof p.money !== "number"
    ) {
        p.money = 0;
    }
    if (
        typeof p.fame !== "number"
    ) {
        p.fame = 0;
    }
}
/* =========================================================
   SALVAR
========================================================= */
function saveGame() {
    ensurePlayer();
    normalizePlayerData();
    if (!window.player) {
        return;
    }
    localStorage.setItem(
        "mmaLifePlayer",
        JSON.stringify(window.player)
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
        const base =
            createDefaultPlayer();
        window.player = {
            ...base,
            ...data,
            attributes: {
                ...base.attributes,
                ...(data.attributes || {})
            },
            professional: {
                ...base.professional,
                ...(data.professional || {})
            },
            amateur: {
                ...base.amateur,
                ...(data.amateur || {})
            },
            trainingPlan: {
                ...base.trainingPlan,
                ...(data.trainingPlan || {})
            },
            promotionHistory: {
                ...(base.promotionHistory || {}),
                ...(data.promotionHistory || {})
            }
        };
        normalizePlayerData();
        return true;
    } catch (error) {
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
    const creation =
        getElement("creation");
    const creator =
        getElement("creator");
    const game =
        getElement("game");
    if (
        !creation ||
        !creator ||
        !game
    ) {
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
                type="button"
                class="green"
                onclick="createNewPlayer()">
                🥊 CRIAR LUTADOR
            </button>
            <button
                type="button"
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
    const newPlayer =
        createDefaultPlayer();
    newPlayer.name =
        name;
    const country =
        getElement(
            "newPlayerCountry"
        );
    const weight =
        getElement(
            "newPlayerWeight"
        );
    const style =
        getElement(
            "newPlayerStyle"
        );
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
    /* =========================
       INÍCIO DA CARREIRA
    ========================= */
    newPlayer.age = 15;
    newPlayer.week = 1;
    newPlayer.year = 2026;
    newPlayer.money = 0;
    newPlayer.fame = 0;
    newPlayer.health = 100;
    newPlayer.fatigue = 0;
    newPlayer.careerStage =
        "amateur";
    newPlayer.professional =
        newPlayer.professional || {};
    newPlayer.professional.active =
        false;
    newPlayer.log = [
        `🥊 ${name} iniciou sua carreira no MMA.`
    ];
    /* =========================
       CONTRATOS
    ========================= */
    newPlayer.promotionHistory =
        {};
    newPlayer.currentPromotion =
        null;
    newPlayer.currentContract =
        null;
    window.player =
        newPlayer;
    /* =========================
       NOVO MUNDO MMA
    ========================= */
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
    }
    saveGame();
    /* ENTRA NO JOGO */
    showGame();
    home();
}
/* =========================================================
   OVERALL
========================================================= */
function getOverall() {
    ensurePlayer();
    const player =
        window.player;
    if (
        typeof player.overall === "number" &&
        !player._overallStarted
    ) {
        return player.overall;
    }
    const attributes =
        player.attributes || {};
    const values = [
        Number(attributes.strength || 40),
        Number(attributes.striking || 40),
        Number(attributes.wrestling || 40),
        Number(attributes.grappling || 40),
        Number(attributes.cardio || 40),
        Number(attributes.technique || 40),
        Number(attributes.defense || 40),
        Number(attributes.fightIQ || 40),
        Number(attributes.chin || 40),
        Number(attributes.offense || 40),
        Number(attributes.blocking || 40)
    ];
    const average =
        values.reduce(
            function(total, value) {
                return total + value;
            },
            0
        ) / values.length;
    return Math.min(
        Number(
            player.potential || 90
        ),
        Math.round(average)
    );
}
/* =========================================================
   PÁGINA INÍCIO
========================================================= */
function home() {
    ensurePlayer();
    normalizePlayerData();
    const content =
        getContent();
    if (!content) {
        console.error(
            "Elemento #content não encontrado."
        );
        return;
    }
    const player =
        window.player;
    const pro =
        player.professional || {};
    const amateur =
        player.amateur || {};
    const proRecord =
        `${pro.wins || 0}-${pro.losses || 0}-${pro.draws || 0}`;
    const amateurRecord =
        `${amateur.wins || 0}-${amateur.losses || 0}-${amateur.draws || 0}`;
    content.innerHTML = `
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
        <div class="stats-grid">
            <div class="stat-card">
                <span>IDADE</span>
                <strong>
                    ${player.age || 18}
                </strong>
            </div>
            <div class="stat-card">
                <span>OVR</span>
                <strong>
                    ${getOverall()}
                </strong>
            </div>
            <div class="stat-card">
                <span>POTENCIAL</span>
                <strong>
                    ${player.potential || 90}
                </strong>
            </div>
            <div class="stat-card">
                <span>FAMA</span>
                <strong>
                    ${Math.round(player.fame || 0)}
                </strong>
            </div>
        </div>
        <div class="card">
            <div class="title">
                📅 CALENDÁRIO
            </div>
            <div class="statline">
                <span>
                    Temporada
                </span>
                <b>
                    Ano ${player.year || 2026}
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
            <button
                class="main-button"
                onclick="nextWeek()">
                ⏭️ AVANÇAR SEMANA
            </button>
        </div>
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
                            ? "Profissional"
                            : "Amador"
                    }
                </b>
            </div>
            <div class="statline">
                <span>
                    Recorde profissional
                </span>
                <b>
                    ${proRecord}
                </b>
            </div>
            <div class="statline">
                <span>
                    Recorde amador
                </span>
                <b>
                    ${amateurRecord}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                ⚔️ PRÓXIMA LUTA
            </div>
            ${
                player.nextFight
                ?
                `
                    <div class="statline">
                        <span>
                            Evento
                        </span>
                        <b>
                            ${player.nextFight.event.name}
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Adversário
                        </span>
                        <b>
                            ${player.nextFight.opponent.displayName}
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            OVR adversário
                        </span>
                        <b>
                            ${player.nextFight.opponent.power}
                        </b>
                    </div>
                    <button
                        class="main-button"
                        onclick="fightScreen()">
                        👊 VER LUTA
                    </button>
                `
                :
                `
                    <p>
                        Nenhuma luta marcada.
                    </p>
                    <button
                        class="main-button"
                        onclick="fightScreen()">
                        🔎 PROCURAR LUTA
                    </button>
                `
            }
        </div>
        <div class="card">
            <div class="title">
                ❤️ CONDIÇÃO
            </div>
            <div class="statline">
                <span>
                    Saúde
                </span>
                <b>
                    ${Math.round(player.health || 100)}%
                </b>
            </div>
            <div class="statline">
                <span>
                    Fadiga
                </span>
                <b>
                    ${Math.round(player.fatigue || 0)}%
                </b>
            </div>
            <div class="statline">
                <span>
                    Dinheiro
                </span>
                <b>
                    $${Math.round(player.money || 0)}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                🏆 CARREIRA MMA
            </div>
            <div class="statline">
                <span>
                    Estágio
                </span>
                <b>
                    ${
                        typeof getCareerStageLabel ===
                        "function"
                            ? getCareerStageLabel()
                            : (
                                player.careerStage ||
                                "Amador"
                            )
                    }
                </b>
            </div>
            ${
                player.currentContract &&
                player.currentContract.active
                ?
                `
                    <div class="statline">
                        <span>
                            Organização
                        </span>
                        <b>
                            ${player.currentContract.promotionName}
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Contrato
                        </span>
                        <b>
                            ${
                                player.currentContract.fightsCompleted
                                || 0
                            }
                            /
                            ${
                                player.currentContract.fights
                                || 0
                            }
                            lutas
                        </b>
                    </div>
                `
                :
                `
                    <div class="statline">
                        <span>
                            Contrato
                        </span>
                        <b>
                            Nenhum contrato ativo
                        </b>
                    </div>
                `
            }
        </div>
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
        if (
            typeof window.fightScreen ===
            "function"
        ) {
            window.fightScreen();
        }
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
        } else {
            console.error(
                "lifeScreen() não encontrada."
            );
        }
        return;
    }
    if (name === "ranking") {
        if (
            typeof window.rankingScreen ===
            "function"
        ) {
            window.rankingScreen();
        }
        return;
    }
}
/* =========================================================
   PROCESSAR TREINO
========================================================= */
function processTrainingWeek() {
    ensurePlayer();
    const player =
        window.player;
    const plan =
        player.trainingPlan &&
        player.trainingPlan.weeks
            ? player.trainingPlan.weeks[player.week]
            : [];
    if (
        !Array.isArray(plan)
    ) {
        return;
    }
    plan.forEach(
        function(training) {
            const attribute =
                training.attribute;
            if (!attribute) {
                return;
            }
            const current =
                Number(
                    player.attributes[attribute] || 60
                );
            const potential =
                Number(
                    player.potential || 90
                );
            if (
                current >= potential
            ) {
                return;
            }
            const gain =
                Math.min(
                    Number(
                        training.gain || 0.5
                    ),
                    potential - current
                );
            player.attributes[attribute] =
                Number(
                    (
                        current + gain
                    ).toFixed(2)
                );
        }
    );
}
/* =========================================================
   MUNDO DO MMA
========================================================= */
function processMMAWorldWeek() {
    /*
     * O mundo roda de forma independente.
     */
    if (
        typeof window.simulateMMWorldWeek ===
        "function"
    ) {
        try {
            window.simulateMMWorldWeek();
        } catch (error) {
            console.error(
                "Erro ao simular mundo do MMA:",
                error
            );
        }
    }
}
/* =========================================================
   CONTRATOS / OPORTUNIDADES
========================================================= */
function processContractOpportunities() {
    ensurePlayer();
    const player =
        window.player;
    /*
     * Só procura propostas para
     * lutador profissional ativo.
     */
    if (
        !player.professional ||
        !player.professional.active
    ) {
        return;
    }
    /*
     * Não cria novas propostas se
     * já existe contrato ativo.
     */
    if (
        player.currentContract &&
        player.currentContract.active
    ) {
        return;
    }
    /*
     * O sistema de contratos continua
     * responsável por gerar as ofertas.
     */
    if (
        typeof window.generateContractOffers !==
        "function"
    ) {
        return;
    }
    try {
        const offers =
            window.generateContractOffers();
        if (
            !Array.isArray(offers) ||
            offers.length === 0
        ) {
            return;
        }
        /*
         * Guarda as ofertas para a tela
         * de carreira/equipe poder utilizar.
         */
        player.contractOffers =
            offers;
    } catch (error) {
        console.error(
            "Erro ao gerar ofertas:",
            error
        );
    }
}
/* =========================================================
   PRÓXIMA SEMANA
========================================================= */
function nextWeek() {
    ensurePlayer();
    const player =
        window.player;
    if (!player) {
        return;
    }
    /*
     * =====================================================
     * VIDA
     * =====================================================
     */
    if (
        typeof window.processLifeWeek ===
        "function"
    ) {
        try {
            window.processLifeWeek();
        } catch (error) {
            console.error(
                "Erro ao processar semana da vida:",
                error
            );
        }
    }
    /*
     * =====================================================
     * TREINAMENTO
     * =====================================================
     */
    processTrainingWeek();
    /*
     * =====================================================
     * MUNDO DO MMA
     * =====================================================
     *
     * O mundo acontece independentemente
     * do jogador.
     */
    processMMAWorldWeek();
    /*
     * =====================================================
     * RECUPERAÇÃO
     * =====================================================
     */
    player.fatigue =
        Math.max(
            0,
            Number(
                player.fatigue || 0
            ) - 10
        );
    player.health =
        Math.min(
            100,
            Number(
                player.health || 100
            ) + 3
        );
    /*
     * =====================================================
     * OPORTUNIDADES
     * =====================================================
     */
    processContractOpportunities();
    /*
     * =====================================================
     * AVANÇA SEMANA
     * =====================================================
     */
    player.week =
        Number(
            player.week || 1
        ) + 1;
    /*
     * =====================================================
     * NOVO ANO
     * =====================================================
     */
    if (
        player.week > 52
    ) {
        player.week = 1;
        player.year =
            Number(
                player.year || 2026
            ) + 1;
        player.age =
            Number(
                player.age || 18
            ) + 1;
        player.log =
            player.log || [];
        player.log.unshift(
            `🎆 Começou o Ano ${player.year}.`
        );
    }
    /*
     * =====================================================
     * SALVAR
     * =====================================================
     */
    saveGame();
    /*
     * =====================================================
     * ATUALIZAR TELA
     * =====================================================
     */
    home();
}
/* =========================================================
   DESCANSAR
========================================================= */
function rest() {
    ensurePlayer();
    const player =
        window.player;
    if (!player) {
        return;
    }
    player.fatigue =
        Math.max(
            0,
            Number(
                player.fatigue || 0
            ) - 15
        );
    player.health =
        Math.min(
            100,
            Number(
                player.health || 100
            ) + 5
        );
    nextWeek();
}
/* =========================================================
   REINICIAR JOGO
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
    window.player =
        createDefaultPlayer();
    /*
     * Reinicia também o mundo do MMA.
     */
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
        creation.classList.remove("hidden");
        creation.style.display =
            "block";
    }
    startGame();
}
/* =========================================================
   COMPATIBILIDADE
========================================================= */
window.save =
    saveGame;
window.createPlayer =
    createNewPlayer;
window.createPlayerFromScreen =
    createNewPlayer;
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
/* =========================================================
   CARREIRA
========================================================= */
function career() {
    ensurePlayer();
    normalizePlayerData();
    const content =
        getElement("content");
    if (!content) {
        return;
    }
    const p =
        window.player;
    const amateur =
        p.amateur || {};
    const professional =
        p.professional || {};
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🥊 CARREIRA
            </div>
            <p>
                Acompanhe sua trajetória no MMA.
            </p>
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
                📈 STATUS
            </div>
            <div class="statline">
                <span>
                    Estágio
                </span>
                <b>
                    ${
                        typeof getCareerStageLabel ===
                        "function"
                            ? getCareerStageLabel()
                            : (
                                p.careerStage ||
                                "amateur"
                            )
                    }
                </b>
            </div>
            <div class="statline">
                <span>
                    Idade
                </span>
                <b>
                    ${p.age || 18} anos
                </b>
            </div>
            <div class="statline">
                <span>
                    Fama
                </span>
                <b>
                    ${Math.round(p.fame || 0)}
                </b>
            </div>
            <div class="statline">
                <span>
                    Dinheiro
                </span>
                <b>
                    $${Math.round(p.money || 0)}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                📄 CONTRATO
            </div>
            ${
                p.currentContract &&
                p.currentContract.active
                ?
                `
                    <div class="statline">
                        <span>
                            Organização
                        </span>
                        <b>
                            ${p.currentContract.promotionName}
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Lutas
                        </span>
                        <b>
                            ${
                                p.currentContract.fightsCompleted ||
                                0
                            }
                            /
                            ${
                                p.currentContract.fights ||
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
                                p.currentContract.purse || 0
                            )}
                        </b>
                    </div>
                `
                :
                `
                    <p>
                        Nenhum contrato ativo.
                    </p>
                    ${
                        p.contractOffers &&
                        p.contractOffers.length > 0
                        ?
                        `
                            <p>
                                📬 Existem
                                ${
                                    p.contractOffers.length
                                }
                                oportunidade(s)
                                disponíveis.
                            </p>
                        `
                        :
                        `
                            <p>
                                Continue sua carreira
                                para receber novas
                                oportunidades.
                            </p>
                        `
                    }
                `
            }
        </div>
        <div class="card">
            <div class="title">
                🏆 OBJETIVO
            </div>
            <p>
                Comece no circuito amador,
                evolua seu lutador,
                conquiste vitórias,
                torne-se profissional
                e busque os grandes títulos.
            </p>
        </div>
    `;
}
window.career =
    career;
/* =========================================================
   INICIALIZAÇÃO
========================================================= */
function initializeMmaLife() {
    const saved =
        localStorage.getItem(
            "mmaLifePlayer"
        );
    /*
     * CARREIRA SALVA
     */
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
    /*
     * NOVA CARREIRA
     */
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
} else {
    initializeMmaLife();
}
