/* =========================================================
   MMA LIFE DYNASTY
   MAIN.JS
   CONTROLE PRINCIPAL DO JOGO
========================================================= */


/* =========================================================
   ESTADO PRINCIPAL
========================================================= */

let currentPlayer = null;


/* =========================================================
   UTILIDADES
========================================================= */

function getElement(id) {

    return document.getElementById(id);

}


function showScreen(screenId) {

    const screens =
        document.querySelectorAll(".screen");

    screens.forEach(screen => {

        screen.classList.remove("active");

    });


    const target =
        getElement(screenId);

    if (target) {

        target.classList.add("active");

    }

}


/* =========================================================
   MENSAGENS
========================================================= */

function showHomeMessage(message) {

    const element =
        getElement("load-message");

    if (!element) {
        return;
    }

    element.textContent =
        message || "";

}


function showGameMessage(message) {

    const element =
        getElement("game-message");

    if (!element) {
        return;
    }

    element.textContent =
        message || "";

}


/* =========================================================
   FORMATAÇÃO
========================================================= */

function formatMoney(value) {

    const amount =
        Number(value) || 0;


    return new Intl.NumberFormat(
        "pt-BR",
        {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


/* =========================================================
   ATUALIZAR DASHBOARD
========================================================= */

function updateDashboard() {

    if (!currentPlayer) {
        return;
    }


    const player =
        currentPlayer;


    const record =
        getRecordString(player);


    const weightClass =
        WEIGHT_CLASSES[player.weightClass];


    const style =
        FIGHT_STYLES[player.style];


    getElement("dashboard-name").textContent =
        player.name;


    getElement("dashboard-record").textContent =
        record;


    getElement("dashboard-age").textContent =
        player.age;


    getElement("dashboard-week").textContent =
        player.week;


    getElement("dashboard-year").textContent =
        player.year;


    getElement("dashboard-ovr").textContent =
        player.ovr;


    getElement("dashboard-potential").textContent =
        player.potential;


    getElement("dashboard-health").textContent =
        Math.round(player.health);


    getElement("dashboard-energy").textContent =
        Math.round(player.energy);


    getElement("dashboard-weight").textContent =
        weightClass
            ? `${weightClass.name} — ${weightClass.limitKg} kg`
            : player.weightClass;


    getElement("dashboard-style").textContent =
        style
            ? style.name
            : player.style;


    getElement("dashboard-country").textContent =
        player.country;


    getElement("dashboard-money").textContent =
        formatMoney(player.money);

}


/* =========================================================
   NOVO JOGO
========================================================= */

function startNewGame() {

    showHomeMessage("");

    showScreen("screen-creation");


    const nameInput =
        getElement("player-name");

    const cityInput =
        getElement("player-city");


    if (nameInput) {

        nameInput.value = "";

        setTimeout(() => {

            nameInput.focus();

        }, 100);

    }


    if (cityInput) {

        cityInput.value = "";

    }

}


/* =========================================================
   VOLTAR PARA HOME
========================================================= */

function backToHome() {

    showHomeMessage("");

    showScreen("screen-home");

}


/* =========================================================
   CRIAR LUTADOR
========================================================= */

function createNewPlayerFromForm() {

    const nameInput =
        getElement("player-name");

    const countryInput =
        getElement("player-country");

    const cityInput =
        getElement("player-city");

    const weightInput =
        getElement("player-weight");

    const styleInput =
        getElement("player-style");


    const name =
        nameInput
            ? nameInput.value.trim()
            : "";


    if (!name) {

        alert(
            "Digite o nome do lutador."
        );

        if (nameInput) {

            nameInput.focus();

        }

        return;

    }


    const country =
        countryInput
            ? countryInput.value
            : "Brasil";


    const city =
        cityInput &&
        cityInput.value.trim()
            ? cityInput.value.trim()
            : "São Paulo";


    const weightClass =
        weightInput
            ? weightInput.value
            : "Lightweight";


    const style =
        styleInput
            ? styleInput.value
            : "Balanced";


    currentPlayer =
        createPlayer({

            name: name,

            country: country,

            city: city,

            weightClass: weightClass,

            style: style

        });


    GameEngine.initialize();


    const saveResult =
        saveGame(currentPlayer);


    updateDashboard();


    showScreen(
        "screen-dashboard"
    );


    if (saveResult.success) {

        showGameMessage(
            "Carreira criada. Boa sorte!"
        );

    } else {

        showGameMessage(
            "Carreira criada."
        );

    }

}


/* =========================================================
   CARREGAR JOGO
========================================================= */

function loadSavedGame() {

    showHomeMessage("");


    if (!hasSaveGame()) {

        showHomeMessage(
            "Nenhum jogo salvo encontrado."
        );

        return;

    }


    const savedPlayer =
        loadGame();


    if (!savedPlayer) {

        showHomeMessage(
            "O save não pôde ser carregado."
        );

        return;

    }


    currentPlayer =
        createPlayer(savedPlayer);


    GameEngine.initialize();


    updateDashboard();


    showScreen(
        "screen-dashboard"
    );


    showGameMessage(
        "Jogo carregado com sucesso."
    );

}


/* =========================================================
   SALVAR JOGO ATUAL
========================================================= */

function saveCurrentGame() {

    if (!currentPlayer) {

        return;

    }


    const result =
        saveGame(currentPlayer);


    showGameMessage(
        result.message
    );

}


/* =========================================================
   AVANÇAR SEMANA
========================================================= */

function advanceGameWeek() {

    if (!currentPlayer) {

        return;

    }


    const result =
        GameEngine.advanceWeek(
            currentPlayer
        );


    if (!result.success) {

        showGameMessage(
            result.message
        );

        return;

    }


    updateDashboard();


    saveGame(currentPlayer);


    if (result.newYear) {

        showGameMessage(

            `Novo ano! Você agora tem ${result.age} anos.`

        );

    } else {

        showGameMessage(

            `Semana ${result.week} avançada.`

        );

    }

}


/* =========================================================
   TREINAMENTO
========================================================= */

function openTraining() {

    if (!currentPlayer) {

        return;

    }


    showGameMessage(

        "Sistema de treinamento será ativado nesta etapa."

    );

}


/* =========================================================
   EVENTOS DOS BOTÕES
========================================================= */

function setupEvents() {


    const newGameButton =
        getElement("btn-new-game");


    const loadGameButton =
        getElement("btn-load-game");


    const createPlayerButton =
        getElement("btn-create-player");


    const backHomeButton =
        getElement("btn-back-home");


    const trainingButton =
        getElement("btn-training");


    const advanceWeekButton =
        getElement("btn-advance-week");


    const saveButton =
        getElement("btn-save-game");


    if (newGameButton) {

        newGameButton.addEventListener(
            "click",
            startNewGame
        );

    }


    if (loadGameButton) {

        loadGameButton.addEventListener(
            "click",
            loadSavedGame
        );

    }


    if (createPlayerButton) {

        createPlayerButton.addEventListener(
            "click",
            createNewPlayerFromForm
        );

    }


    if (backHomeButton) {

        backHomeButton.addEventListener(
            "click",
            backToHome
        );

    }


    if (trainingButton) {

        trainingButton.addEventListener(
            "click",
            openTraining
        );

    }


    if (advanceWeekButton) {

        advanceWeekButton.addEventListener(
            "click",
            advanceGameWeek
        );

    }


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            saveCurrentGame
        );

    }

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initializeGame() {

    setupEvents();


    currentPlayer = null;


    showScreen(
        "screen-home"
    );

}


document.addEventListener(
    "DOMContentLoaded",
    initializeGame
);
