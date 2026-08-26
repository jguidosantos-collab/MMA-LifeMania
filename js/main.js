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

    const creation =
        getElement("creation");

    const game =
        getElement("game");

    const tabs =
        getElement("tabs");


    if (creation) {

        creation.classList.remove("hidden");

        creation.style.display =
            "block";

    }


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

}


function showGame() {

    const creation =
        getElement("creation");

    const game =
        getElement("game");

    const tabs =
        getElement("tabs");


    if (creation) {

        creation.classList.add("hidden");

        creation.style.display =
            "none";

    }


    if (game) {

        game.classList.remove("hidden");

        game.style.display =
            "block";

        game.style.visibility =
            "visible";

        game.style.opacity =
            "1";

    }


    if (tabs) {

        tabs.classList.remove("hidden");

        tabs.style.display =
            "flex";

        tabs.style.visibility =
            "visible";

        tabs.style.opacity =
            "1";

    }

}


/* =========================================================
   GARANTIR PLAYER
========================================================= */

function ensurePlayer() {

    if (
        typeof window.player ===
            "undefined" ||
        !window.player
    ) {

        if (
            typeof window.createDefaultPlayer ===
            "function"
        ) {

            window.player =
                window.createDefaultPlayer();

        }

    }

}


/* =========================================================
   SALVAR
========================================================= */

function saveGame() {

    ensurePlayer();

    localStorage.setItem(

        "mmaLifePlayer",

        JSON.stringify(
            window.player
        )

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


        if (!data.currentContract) {

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

    ensurePlayer();


    const player =
        window.player;


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
   VERIFICAR SE A LUTA ESTÁ NO MOMENTO
========================================================= */

function isFightDue() {

    ensurePlayer();


    const player =
        window.player;


    if (!player.nextFight) {

        return false;

    }


    const fight =
        player.nextFight;


    const currentWeek =
        Number(
            player.week || 1
        );


    const fightWeek =
        Number(

            fight.week ??
            fight.fightWeek ??
            currentWeek

        );


    const currentYear =
        Number(
            player.year || 2026
        );


    const fightYear =
        Number(

            fight.year ??
            fight.fightYear ??
            currentYear

        );


    if (
        currentYear > fightYear
    ) {

        return true;

    }


    if (
        currentYear === fightYear &&
        currentWeek >= fightWeek
    ) {

        return true;

    }


    return false;

}


/* =========================================================
   VERIFICAR SE PODE AVANÇAR
========================================================= */

function canAdvanceWeek() {

    ensurePlayer();


    const player =
        window.player;


    /*
       REGRA PRINCIPAL:

       Se existe uma luta marcada
       para esta semana ou uma semana
       anterior, o calendário trava.

       O jogador precisa realizar a luta.
    */

    if (
        player.nextFight &&
        isFightDue()
    ) {

        return false;

    }


    /*
       Algumas versões do fight.js
       podem utilizar uma flag própria
       de bloqueio.
    */

    if (
        player.fightDayLocked === true
    ) {

        return false;

    }


    if (
        player.fightLocked === true
    ) {

        return false;

    }


    return true;

}


/* =========================================================
   MOSTRAR BLOQUEIO DA LUTA
========================================================= */

function showFightDayLock() {

    ensurePlayer();


    const content =
        getContent();


    if (!content) {

        return;

    }


    const player =
        window.player;


    const fight =
        player.nextFight;


    if (!fight) {

        if (
            typeof window.fightScreen ===
            "function"
        ) {

            window.fightScreen();

        }

        return;

    }


    const opponent =
        fight.opponent || {};


    const event =
        fight.event || {};


    content.innerHTML = `

        <div class="card">

            <div class="title">
                🥊 DIA DE LUTA
            </div>


            <div style="
                text-align:center;
                font-size:42px;
                margin:15px 0;
            ">

                ⚔️

            </div>


            <h2 style="
                text-align:center;
                margin-bottom:10px;
            ">

                ${event.name || "EVENTO DE MMA"}

            </h2>


            <p style="
                text-align:center;
            ">

                Hoje é o dia da sua luta.

            </p>


            <div class="statline">

                <span>
                    Adversário
                </span>

                <b>
                    ${
                        opponent.displayName ||
                        opponent.name ||
                        "Adversário"
                    }
                </b>

            </div>


            <div class="statline">

                <span>
                    OVR
                </span>

                <b>
                    ${
                        opponent.power ||
                        opponent.ovr ||
                        "?"
                    }
                </b>

            </div>


            <p style="
                text-align:center;
                margin-top:18px;
                font-weight:bold;
            ">

                ⛔ Você não pode avançar
                para outra semana antes
                de realizar esta luta.

            </p>


            <button
                class="main-button"
                onclick="fightScreen()">

                🥊 IR PARA O EVENTO

            </button>

        </div>

    `;

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


    const fightDue =
        isFightDue();


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
                fightDue
                ?
                `
                    <div style="
                        margin-top:15px;
                        padding:12px;
                        border-radius:10px;
                        text-align:center;
                        font-weight:bold;
                    ">

                        🥊 DIA DE LUTA

                    </div>


                    <button
                        class="main-button"
                        onclick="fightScreen()">

                        ⚔️ IR PARA A LUTA

                    </button>
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
                    Recorde amador
                </span>

                <b>
                    ${amateurRecord}
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
                            ${
                                player.nextFight.event &&
                                player.nextFight.event.name
                                ?
                                player.nextFight.event.name
                                :
                                "Evento de MMA"
                            }
                        </b>

                    </div>


                    <div class="statline">

                        <span>
                            Adversário
                        </span>

                        <b>
                            ${
                                player.nextFight.opponent &&
                                (
                                    player.nextFight.opponent.displayName ||
                                    player.nextFight.opponent.name
                                )
                                ?
                                (
                                    player.nextFight.opponent.displayName ||
                                    player.nextFight.opponent.name
                                )
                                :
                                "Adversário"
                            }
                        </b>

                    </div>


                    ${
                        player.nextFight.offer
                        ?
                        `
                            <div class="statline">

                                <span>
                                    Bolsa
                                </span>

                                <b>
                                    $${Math.round(
                                        player.nextFight.offer.purse ||
                                        player.nextFight.purse ||
                                        0
                                    )}
                                </b>

                            </div>


                            <div class="statline">

                                <span>
                                    Bônus vitória
                                </span>

                                <b>
                                    $${Math.round(
                                        player.nextFight.offer.winBonus ||
                                        player.nextFight.winBonus ||
                                        0
                                    )}
                                </b>

                            </div>
                        `
                        :
                        ""
                    }


                    <button
                        class="main-button"
                        onclick="fightScreen()">

                        ${
                            fightDue
                            ?
                            "🥊 DIA DE LUTA"
                            :
                            "📋 VER EVENTO"
                        }

                    </button>

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
                            "Nenhuma luta marcada."
                        }

                    </p>


                    ${
                        !(
                            player.professional &&
                            player.professional.active
                        )
                        ?
                        `

                        <button
                            class="main-button"
                            onclick="fightScreen()">

                            🔎 ÁREA DE LUTAS

                        </button>

                        `
                        :
                        ""
                    }

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
                🌎 MUNDO MMA
            </div>


            <div class="statline">

                <span>
                    Semana do mundo
                </span>

                <b>

                    ${
                        typeof window.mmaWorld !==
                        "undefined"
                        ?
                        window.mmaWorld.week || 0
                        :
                        0
                    }

                </b>

            </div>


            <p>

                As organizações continuam
                realizando eventos enquanto
                sua carreira evolui.

            </p>

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
                    "Erro ao abrir a tela de equipe:",
                    error
                );


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

        else {

            console.error(
                "teamScreen() não encontrada."
            );


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

        return;

    }


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


    if (name === "ranking") {

        showGame();


        if (
            typeof window.rankingScreen ===
            "function"
        ) {

            window.rankingScreen();

        }

        else {

            console.error(
                "rankingScreen() não encontrada."
            );


            content.innerHTML = `

                <div class="card">

                    <div class="title">
                        🏆 RANKING
                    </div>


                    <p>
                        Sistema de ranking ainda não carregado.
                    </p>

                </div>

            `;

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
       BLOQUEIO PRINCIPAL DA CARREIRA
    ===================================================== */

    if (
        !canAdvanceWeek()
    ) {

        showFightDayLock();

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
       TREINAMENTO
    ===================================================== */

    const plan =

        player.trainingPlan &&
        player.trainingPlan.weeks

        ?

        player.trainingPlan.weeks[
            player.week
        ]

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

                        player.attributes[
                            attribute
                        ] || 60

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


                player.attributes[
                    attribute
                ] =

                    Number(

                        (
                            current + gain
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
       AVANÇAR SEMANA
    ===================================================== */

    player.week =

        Number(
            player.week || 1
        ) + 1;


    /* =====================================================
       RECUPERAÇÃO DO FIGHT.JS
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
       EMPRESÁRIO PROCURA OFERTA
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
                "Erro ao procurar oferta de luta:",
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
                player.year || 2026
            ) + 1;


        player.age =

            Number(
                player.age || 15
            ) + 1;


        player.log =
            player.log || [];


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
                    "Erro ao processar contrato do empresário:",
                    error
                );

            }

        }

    }


    /* =====================================================
       SALVAR
    ===================================================== */

    saveGame();


    /* =====================================================
       ATUALIZAR
    ===================================================== */

    home();

}


/* =========================================================
   DESCANSAR
========================================================= */

function rest() {

    ensurePlayer();


    /*
       Descansar também respeita
       o bloqueio da luta.
    */

    if (
        !canAdvanceWeek()
    ) {

        showFightDayLock();

        return;

    }


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


    localStorage.removeItem(
        "mmaLifePlayer"
    );


    window.player =
        createDefaultPlayer();


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

    ensurePlayer();


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


    const careerStage =
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


    const contract =
        p.currentContract;


    const amateurFights =

        Number(amateur.wins || 0) +

        Number(amateur.losses || 0) +

        Number(amateur.draws || 0);


    const professionalActive =

        professional.active === true;


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
                    ${p.age || 15} anos
                </b>

            </div>


            <div class="statline">

                <span>
                    Fama
                </span>

                <b>
                    ${Math.round(
                        p.fame || 0
                    )}
                </b>

            </div>


            <div class="statline">

                <span>
                    Dinheiro
                </span>

                <b>
                    $${Math.round(
                        p.money || 0
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


            ${
                !professionalActive
                ?
                `
                    <div class="statline">

                        <span>
                            Lutas amadoras
                        </span>

                        <b>
                            ${amateurFights} / 3
                        </b>

                    </div>


                    <p style="
                        margin-top:12px;
                    ">

                        Para se tornar profissional,
                        você precisa ter pelo menos
                        <strong>3 lutas amadoras</strong>
                        e ter
                        <strong>18 anos</strong>.

                    </p>
                `
                :
                ""
            }

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
                            $${Math.round(
                                contract.purse || 0
                            )}
                        </b>

                    </div>


                    <div class="statline">

                        <span>
                            Bônus por vitória
                        </span>

                        <b>
                            $${Math.round(
                                contract.winBonus || 0
                            )}
                        </b>

                    </div>

                `
                :
                `

                    <p>
                        ${
                            professionalActive
                            ?
                            "Nenhum contrato profissional ativo."
                            :
                            "Você ainda está construindo sua carreira amadora."
                        }
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
                faça suas primeiras lutas,
                evolua seu lutador,
                alcance os requisitos,
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


window.canAdvanceWeek =
    canAdvanceWeek;


window.isFightDue =
    isFightDue;


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
