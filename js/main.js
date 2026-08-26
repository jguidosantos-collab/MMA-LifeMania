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
<button
    class="gray"
    onclick="resetGame()">

    🔄 REINICIAR CARREIRA

</button>
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
    onclick="alert('BOTÃO FUNCIONOU'); createNewPlayer();">

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
alert("1 - createNewPlayer foi acionada");
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

    newPlayer.overall = 60;


    newPlayer.log = [

        `🥊 ${name} iniciou sua carreira no MMA.`

    ];


    window.player =
        newPlayer;


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

    const attributes =
        window.player.attributes || {};

    const values = [

        Number(
            attributes.strength || 60
        ),

        Number(
            attributes.striking || 60
        ),

        Number(
            attributes.wrestling || 60
        ),

        Number(
            attributes.grappling || 60
        ),

        Number(
            attributes.cardio || 60
        ),

        Number(
            attributes.technique || 60
        ),

        Number(
            attributes.defense || 60
        ),

        Number(
            attributes.fightIQ || 60
        ),

        Number(
            attributes.chin || 60
        ),

        Number(
            attributes.offense || 60
        ),

        Number(
            attributes.blocking || 60
        )

    ];

    const average =
        values.reduce(
            function (
                total,
                value
            ) {

                return total + value;

            },
            0
        ) / values.length;


    return Math.min(

        Number(
            window.player.potential || 98
        ),

        Math.round(
            average
        )

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

    const content = getElement("content");

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

        if (typeof window.training === "function") {

            window.training();

        }

        return;
    }


    /* =========================
       LUTAS
    ========================= */

    if (name === "fight") {

        if (typeof window.fightScreen === "function") {

            window.fightScreen();

        }

        return;
    }


    /* =========================
       EQUIPE
    ========================= */

    if (name === "team") {

        if (typeof window.teamScreen === "function") {

            window.teamScreen();

        }

        return;
    }


    /* =========================
       VIDA
    ========================= */

    if (name === "life") {

    showGame();

    if (typeof window.lifeScreen === "function") {
        window.lifeScreen();
    } else {
        console.error("lifeScreen() não encontrada.");
    }

    return;
}

    /* =========================
       RANKING
    ========================= */

    if (name === "ranking") {

        if (typeof window.rankingScreen === "function") {

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


    const plan =
        player.trainingPlan &&
        player.trainingPlan.weeks
            ? player.trainingPlan.weeks[player.week]
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


    /* Recuperação */

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


    /* Avança semana */

    player.week =
        Number(
            player.week || 1
        ) + 1;


    /* Novo ano */

    if (
        player.week > 52
    ) {

        player.week = 1;

        player.year =
            Number(
                player.year || 1
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

    const confirmed = confirm(
        "Apagar esta carreira e criar um novo lutador?"
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem("mmaLifePlayer");

    window.player = createDefaultPlayer();

    startGame();
}


/* =========================================================
   COMPATIBILIDADE
   APENAS ALIASES — SEM DUPLICAR FUNÇÕES
========================================================= */

/*
 * Alguns arquivos antigos do projeto podem chamar save().
 * Portanto mantemos apenas este alias.
 */

window.save =
    saveGame;


/*
 * Alguns arquivos antigos podem chamar
 * createPlayer() ou createPlayerFromScreen().
 *
 * Eles apontam para a ÚNICA função oficial:
 * createNewPlayer().
 */

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

    const content = getElement("content");

    if (!content) return;

    const p = window.player;

    const amateur = p.amateur || {};
    const professional = p.professional || {};

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
                <span>Amador</span>
                <b>
                    ${amateur.wins || 0}-
                    ${amateur.losses || 0}-
                    ${amateur.draws || 0}
                </b>
            </div>

            <div class="statline">
                <span>Profissional</span>
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
                <span>Categoria</span>

                <b>
                    ${
                        professional.active
                        ? "Profissional"
                        : "Amador"
                    }
                </b>
            </div>

            <div class="statline">
                <span>Idade</span>

                <b>
                    ${p.age || 18} anos
                </b>
            </div>

            <div class="statline">
                <span>Fama</span>

                <b>
                    ${Math.round(p.fame || 0)}
                </b>
            </div>

            <div class="statline">
                <span>Dinheiro</span>

                <b>
                    $${Math.round(p.money || 0)}
                </b>
            </div>

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
   VIDA
========================================================= */

function lifeScreen() {

    ensurePlayer();

    const content = getElement("content");

    if (!content) return;

    const p = window.player;

    const children =
        Array.isArray(p.children)
            ? p.children
            : [];

    content.innerHTML = `

        <div class="card">

            <div class="title">
                ❤️ VIDA
            </div>

            <p>
                Sua vida fora do octógono.
            </p>

        </div>

        <div class="card">

            <div class="title">
                💕 RELACIONAMENTO
            </div>

            <div class="statline">
                <span>Status</span>
                <b>
                    ${p.relationship || "Solteiro"}
                </b>
            </div>

            <div class="statline">
                <span>Casado</span>
                <b>
                    ${p.married ? "Sim" : "Não"}
                </b>
            </div>

        </div>

        <div class="card">

            <div class="title">
                👶 FAMÍLIA
            </div>

            <div class="statline">
                <span>Filhos</span>
                <b>
                    ${children.length}
                </b>
            </div>

        </div>

        <div class="card">

            <div class="title">
                🧬 LEGADO
            </div>

            <p>
                Construa sua família e, no futuro,
                seu legado poderá continuar através
                dos seus filhos.
            </p>

        </div>

    `;
}


/* =========================================================
   FUNÇÕES GLOBAIS
========================================================= */

window.career = career;
window.lifeScreen = lifeScreen;
/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initializeMmaLife() {

    const loaded =
        loadGame();


    /*
     * JOGADOR EXISTE
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
     * NOVO JOGO
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
