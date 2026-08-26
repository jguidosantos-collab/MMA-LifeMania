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

        window.player =
            createDefaultPlayer();

    }

}


/* =========================================================
   SALVAR
========================================================= */

function saveGame() {

    ensurePlayer();

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

            currentContract: {
                ...(base.currentContract || {}),
                ...(data.currentContract || {})
            },

            promotionHistory: {
                ...(base.promotionHistory || {}),
                ...(data.promotionHistory || {})
            }

        };


        /*
         * Se não houver contrato salvo,
         * não deixamos um objeto vazio ser tratado
         * como contrato ativo.
         */

        if (
            !data.currentContract
        ) {

            window.player.currentContract =
                base.currentContract || null;

        }


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

    const creation =
        getElement("creation");

    const creator =
        getElement("creator");

    const game =
        getElement("game");

    const tabs =
        getElement("tabs");


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
   NOME OFICIAL: openCharacterCreation
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


    newPlayer.age = 15;
    newPlayer.week = 1;
    newPlayer.year = 2026;
    newPlayer.money = 0;
    newPlayer.fame = 0;
    newPlayer.health = 100;
    newPlayer.fatigue = 0;


    /*
     * Garante estruturas utilizadas
     * pelos novos sistemas.
     */

    if (!newPlayer.promotionHistory) {

        newPlayer.promotionHistory = {};

    }


    if (
        typeof newPlayer.currentContract ===
        "undefined"
    ) {

        newPlayer.currentContract = null;

    }


    newPlayer.log = [

        `🥊 ${name} iniciou sua carreira no MMA.`

    ];


    window.player =
        newPlayer;


    /*
     * Reinicia o mundo independente
     * quando uma nova carreira começa.
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


    saveGame();

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


    /*
     * O OVR inicial é o valor sorteado na criação.
     */

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

        Number(player.potential || 90),

        Math.round(average)

    );

}


/* =========================================================
   PÁGINA INÍCIO
========================================================= */

function home() {

    ensurePlayer();


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


        ${
            player.managerContractExpired
            ?
            `

            <div class="card">

                <div class="title">
                    👔 CONTRATO ENCERRADO
                </div>

                <p>

                    Seu contrato com

                    <strong>
                        ${
                            player.manager
                            ?
                            player.manager.name
                            :
                            "seu empresário"
                        }
                    </strong>

                    chegou ao fim.

                </p>

                <p>
                    Deseja negociar um novo
                    contrato com seu empresário?
                </p>


                <button
                    class="green"
                    onclick="renewManagerContract()">

                    🤝 NEGOCIAR NOVO CONTRATO

                </button>


                <button
                    class="gray"
                    onclick="declineManagerRenewal()">

                    🚪 NÃO RENOVAR

                </button>

            </div>

            `
            :
            ""
        }


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

                <span>
                    IDADE
                </span>

                <strong>
                    ${player.age || 18}
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
                    POTENCIAL
                </span>

                <strong>
                    ${player.potential || 90}
                </strong>

            </div>


            <div class="stat-card">

                <span>
                    FAMA
                </span>

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

                        ?

                        "Profissional"

                        :

                        "Amador"
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


    /* =========================
       INÍCIO
    ========================= */

    if (name === "home") {

        home();

        return;

    }


    /* =========================
       CARREIRA
    ========================= */

    if (name === "career") {

        career();

        return;

    }


    /* =========================
       TREINO
    ========================= */

    if (name === "train") {

        if (
            typeof window.training ===
            "function"
        ) {

            window.training();

        }

        return;

    }


    /* =========================
       LUTAS
    ========================= */

    if (name === "fight") {

        if (
            typeof window.fightScreen ===
            "function"
        ) {

            window.fightScreen();

        }

        return;

    }


    /* =========================
       EQUIPE
    ========================= */

    if (name === "team") {

        ensurePlayer();

        showGame();

        if (
            typeof window.teamScreen ===
            "function"
        ) {

            try {

                window.teamScreen();

            }
            catch (error) {

                console.error(
                    "Erro ao abrir a tela de Equipe:",
                    error
                );

                const content =
                    getElement("content");

                if (content) {

                    content.innerHTML = `

                        <div class="card">

                            <div class="title">
                                🏢 EQUIPE
                            </div>

                            <p>
                                Ocorreu um erro ao abrir
                                a tela de equipe.
                            </p>

                            <button
                                class="main-button"
                                onclick="tab('home')">

                                🏠 VOLTAR AO INÍCIO

                            </button>

                        </div>

                    `;

                }

            }

        }
        else {

            console.error(
                "teamScreen() não encontrada."
            );

            const content =
                getElement("content");

            if (content) {

                content.innerHTML = `

                    <div class="card">

                        <div class="title">
                            🏢 EQUIPE
                        </div>

                        <p>
                            Sistema de equipe não carregado.
                        </p>

                        <button
                            class="main-button"
                            onclick="tab('home')">

                            🏠 VOLTAR AO INÍCIO

                        </button>

                    </div>

                `;

            }

        }

        return;

    }


    /* =========================
       VIDA
    ========================= */

    if (name === "life") {

        showGame();

        if (
            typeof window.lifeScreen ===
            "function"
        ) {

            window.lifeScreen();

        }
        else {

            console.error(
                "lifeScreen() não encontrada."
            );

        }

        return;

    }


    /* =========================
       RANKING
    ========================= */

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
   PRÓXIMA SEMANA
========================================================= */

function nextWeek() {

    ensurePlayer();


    const player =
        window.player;


    /* =====================================================
       VIDA
       ===================================================== */

    if (
        typeof window.processLifeWeek ===
        "function"
    ) {

        window.processLifeWeek();

    }


    /* =====================================================
       MUNDO MMA
       ===================================================== */

    /*
     * O mundo funciona de forma independente.
     *
     * Se o arquivo do Mundo MMA estiver carregado,
     * uma semana é simulada junto com o avanço
     * da carreira do jogador.
     *
     * Se o sistema ainda não estiver carregado,
     * simplesmente continua normalmente.
     */

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
       TREINAMENTO
       ===================================================== */

    const plan =
        player.trainingPlan &&
        player.trainingPlan.weeks

        ?

        player.trainingPlan.weeks[player.week]

        :

        [];


    if (
        Array.isArray(plan)
    ) {

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


    /* =====================================================
       RECUPERAÇÃO
       ===================================================== */

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


    /* =====================================================
       AVANÇA SEMANA
       ===================================================== */

    player.week =
        Number(
            player.week || 1
        ) + 1;


    /* =====================================================
       NOVO ANO
       ===================================================== */

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


        /* =================================================
           CONTRATO DO EMPRESÁRIO
           
           IMPORTANTE:
           Só processa aqui, na virada do ano.
           
           Portanto:
           4 anos
           ↓
           vira o ano
           ↓
           3 anos
           ================================================= */

        if (
            typeof window.processManagerContractYear ===
            "function"
        ) {

            try {

                window.processManagerContractYear();

            }
            catch (error) {

                console.error(
                    "Erro ao processar contrato do empresário:",
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

    ensurePlayer();


    const player =
        window.player;


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


    /*
     * Apaga a carreira salva.
     */

    localStorage.removeItem(
        "mmaLifePlayer"
    );


    /*
     * Cria jogador novo.
     */

    window.player =
        createDefaultPlayer();


    /*
     * Reinicia Mundo MMA.
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


    /*
     * Esconde o jogo.
     */

    const game =
        getElement("game");

    const tabs =
        getElement("tabs");


    if (game) {

        game.classList.add("hidden");

        game.style.display = "none";

    }


    if (tabs) {

        tabs.classList.add("hidden");

        tabs.style.display = "none";

    }


    /*
     * Mostra tela inicial.
     */

    const creation =
        getElement("creation");


    if (creation) {

        creation.classList.remove("hidden");

        creation.style.display = "block";

    }


    startGame();

}


/* =========================================================
   CARREIRA
========================================================= */

function career() {

    ensurePlayer();


    const content =
        getElement("content");


    if (!content) return;


    const p =
        window.player;


    const amateur =
        p.amateur || {};


    const professional =
        p.professional || {};


    /*
     * Estágio da carreira.
     */

    let careerStage =
        p.careerStage ||
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


    /*
     * Contrato atual.
     */

    const contract =
        p.currentContract;


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
                            ${contract.fightsCompleted || 0}
                            /
                            ${contract.fights || 0}
                        </b>

                    </div>


                    <div class="statline">

                        <span>
                            Bolsa
                        </span>

                        <b>
                            $${Math.round(contract.purse || 0)}
                        </b>

                    </div>


                    <div class="statline">

                        <span>
                            Bônus por vitória
                        </span>

                        <b>
                            $${Math.round(contract.winBonus || 0)}
                        </b>

                    </div>

                `

                :

                `

                    <p>
                        Nenhum contrato profissional ativo.
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
                evolua seu lutador,
                conquiste vitórias,
                torne-se profissional
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


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initializeMmaLife() {

    const saved =
        localStorage.getItem(
            "mmaLifePlayer"
        );


    /*
     * EXISTE UMA CARREIRA SALVA
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
     * NÃO EXISTE CARREIRA
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

}
else {

    initializeMmaLife();

}
