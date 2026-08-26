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
function showCreation() {
    const creation = getElement("creation");
    const game = getElement("game");
    const tabs = getElement("tabs");
    if (creation) {
        creation.classList.remove("hidden");
    }
    if (game) {
        game.classList.add("hidden");
    }
    if (tabs) {
        tabs.classList.add("hidden");
    }
}
function showGame() {
    const creation = getElement("creation");
    const game = getElement("game");
    const tabs = getElement("tabs");
    if (creation) {
        creation.classList.add("hidden");
    }
    if (game) {
        game.classList.remove("hidden");
    }
    if (tabs) {
        tabs.classList.remove("hidden");
    }
}
function getContent() {
    return getElement("content");
}
/* =========================================================
   ESTADO PADRÃO
========================================================= */
function createDefaultPlayer() {
    return {
        name: "",
        country: "Brasil",
        weight: "Peso Leve",
        style: "Completo",
        age: 18,
        week: 1,
        year: 1,
        money: 0,
        fame: 0,
        health: 100,
        fatigue: 0,
        overall: 60,
        potential:
            Math.floor(
                Math.random() * 21
            ) + 78,
        relationship: "Solteiro",
        married: false,
        children: [],
        team: null,
        manager: null,
        nextFight: null,
        careerStage: "amateur",
        currentPromotion: null,
        currentContract: null,
        professional: {
            active: false,
            wins: 0,
            losses: 0,
            draws: 0
        },
        amateur: {
            wins: 0,
            losses: 0,
            draws: 0
        },
        attributes: {
            strength: 60,
            striking: 60,
            wrestling: 60,
            grappling: 60,
            cardio: 60,
            technique: 60,
            defense: 60,
            fightIQ: 60,
            chin: 60,
            offense: 60,
            blocking: 60
        },
        trainingPlan: {
            weeks: {},
            automatic: false
        },
        teamOffers: [],
        log: []
    };
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
/* Compatibilidade com arquivos antigos */
window.save = saveGame;
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
            }
        };
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

    const creation = document.getElementById("creation");
    const creator = document.getElementById("creator");
    const game = document.getElementById("game");
    const tabs = document.getElementById("tabs");

    if (!creation || !creator || !game) {
        console.error("Estrutura do index.html não encontrada.");
        return;
    }

    creation.classList.remove("hidden");
    game.classList.add("hidden");

    if (tabs) {
        tabs.classList.add("hidden");
    }

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
   ABRIR CRIAÇÃO
========================================================= */
function openCreation() {
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
                onclick="createNewPlayer()"
            >
                🥊 CRIAR LUTADOR
            </button>
            <button
                class="gray"
                onclick="startGame()"
            >
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
    const player =
        createDefaultPlayer();
    player.name =
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
        player.country =
            country.value;
    }
    if (weight) {
        player.weight =
            weight.value;
    }
    if (style) {
        player.style =
            style.value;
    }
    player.age = 18;
    player.week = 1;
    player.year = 1;
    player.overall = 60;
    /*
     * POTENCIAL
     *
     * Pode nascer de 78 até 98.
     */
    player.potential =
        Math.floor(
            Math.random() * 21
        ) + 78;
    player.log = [
        `🥊 ${name} iniciou sua carreira no MMA.`
    ];
    window.player =
        player;
    saveGame();
    /*
     * AGORA ENTRA NO JOGO.
     */
    showGame();
    home();
}
/* Compatibilidade */
window.createPlayer =
    createNewPlayer;
window.createPlayerFromScreen =
    createNewPlayer;
/* =========================================================
   OVERALL
========================================================= */
function getOverall() {
    ensurePlayer();
    const a =
        window.player.attributes || {};
    const values = [
        Number(a.strength || 60),
        Number(a.striking || 60),
        Number(a.wrestling || 60),
        Number(a.grappling || 60),
        Number(a.cardio || 60),
        Number(a.technique || 60),
        Number(a.defense || 60),
        Number(a.fightIQ || 60),
        Number(a.chin || 60),
        Number(a.offense || 60),
        Number(a.blocking || 60)
    ];
    const average =
        values.reduce(
            function (total, value) {
                return total + value;
            },
            0
        ) / values.length;
    return Math.min(
        Number(
            window.player.potential || 98
        ),
        Math.round(average)
    );
}
/* =========================================================
   MMA LIFE DYNASTY
   HOME.JS — PÁGINA INÍCIO
========================================================= */

function home() {

    const content = document.getElementById("content");

    if (!content) {
        console.error("Elemento #content não encontrado.");
        return;
    }

    const pro = player.professional || {};
    const amateur = player.amateur || {};

    const proRecord =
        `${pro.wins || 0}-${pro.losses || 0}-${pro.draws || 0}`;

    const amateurRecord =
        `${amateur.wins || 0}-${amateur.losses || 0}-${amateur.draws || 0}`;

    content.innerHTML = `

        <!-- CABEÇALHO DO LUTADOR -->
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


        <!-- PRINCIPAIS STATUS -->
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
                    ${typeof getOverall === "function"
                        ? getOverall()
                        : player.overall || 60}
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


        <!-- CALENDÁRIO -->
        <div class="card">

            <div class="title">
                📅 CALENDÁRIO
            </div>

            <div class="statline">

                <span>
                    Temporada
                </span>

                <b>
                    Ano ${player.year || 1}
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


        <!-- PRÓXIMA LUTA -->
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

    `;

}
/* =========================================================
   NAVEGAÇÃO
========================================================= */
function tab(name) {
    showGame();
    switch (name) {
        case "home":
            home();
            break;
        case "career":
            if (
                typeof career === "function"
            ) {
                career();
            } else {
                home();
            }
            break;
        case "train":
            if (
                typeof training === "function"
            ) {
                training();
            } else {
                home();
            }
            break;
        case "fight":
            if (
                typeof fightScreen === "function"
            ) {
                fightScreen();
            } else {
                home();
            }
            break;
        case "team":
            if (
                typeof teamScreen === "function"
            ) {
                teamScreen();
            } else {
                home();
            }
            break;
        case "life":
            if (
                typeof familyScreen === "function"
            ) {
                familyScreen();
            } else {
                home();
            }
            break;
        case "ranking":
            if (
                typeof rankingScreen === "function"
            ) {
                rankingScreen();
            } else {
                home();
            }
            break;
        default:
            home();
    }
}
/* =========================================================
   PRÓXIMA SEMANA
========================================================= */
function nextWeek() {
    ensurePlayer();
    const p =
        window.player;
    /*
     * Treinos programados
     */
    const plan =
        p.trainingPlan &&
        p.trainingPlan.weeks
        ? p.trainingPlan.weeks[p.week]
        : [];
    if (
        Array.isArray(plan)
    ) {
        plan.forEach(
            function (training) {
                const attribute =
                    training.attribute;
                if (!attribute) {
                    return;
                }
                const current =
                    Number(
                        p.attributes[attribute] || 60
                    );
                const potential =
                    Number(
                        p.potential || 90
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
                p.attributes[attribute] =
                    Number(
                        (
                            current + gain
                        ).toFixed(2)
                    );
            }
        );
    }
    /*
     * Recuperação
     */
    p.fatigue =
        Math.max(
            0,
            Number(p.fatigue || 0) - 10
        );
    p.health =
        Math.min(
            100,
            Number(p.health || 100) + 3
        );
    /*
     * Semana seguinte
     */
    p.week =
        Number(p.week || 1) + 1;
    /*
     * Novo ano
     */
    if (
        p.week > 52
    ) {
        p.week = 1;
        p.year =
            Number(p.year || 1) + 1;
        p.age =
            Number(p.age || 18) + 1;
        p.log =
            p.log || [];
        p.log.unshift(
            `🎆 Começou o Ano ${p.year}.`
        );
    }
    saveGame();
    home();
}
/* Compatibilidade */
window.advanceWeek =
    nextWeek;
/* =========================================================
   DESCANSAR
========================================================= */
function rest() {
    ensurePlayer();
    window.player.fatigue =
        Math.max(
            0,
            Number(
                window.player.fatigue || 0
            ) - 15
        );
    window.player.health =
        Math.min(
            100,
            Number(
                window.player.health || 100
            ) + 5
        );
    /*
     * Descansar NÃO volta
     * para a tela inicial.
     *
     * Avança a semana.
     */
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
    window.player =
        createDefaultPlayer();
    startGame();
}
/* =========================================================
   COMPATIBILIDADE
========================================================= */
window.startGame =
    startGame;
window.openCreation =
    openCreation;
window.createNewPlayer =
    createNewPlayer;
window.createPlayer =
    createNewPlayer;
window.home =
    home;
window.tab =
    tab;
window.nextWeek =
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
   INICIALIZAÇÃO
========================================================= */
function initializeMmaLife() {
    const loaded =
        loadGame();
    /*
     * TEM LUTADOR SALVO
     */
    if (
        loaded &&
        window.player &&
        window.player.name
    ) {
        showGame();
        home();
        return;
    }
    /*
     * NÃO TEM LUTADOR
     */
    window.player =
        createDefaultPlayer();
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
