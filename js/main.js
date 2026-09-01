/* =========================================================
   MMA LIFE DYNASTY
   MAIN.JS
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

    if (element) {
        element.textContent = message || "";
    }
}


function showGameMessage(message) {

    const element =
        getElement("game-message");

    if (element) {
        element.textContent = message || "";
    }
}


/* =========================================================
   DINHEIRO
========================================================= */

function formatMoney(value) {

    const amount =
        Number(value) || 0;

    return "$" + Math.floor(amount).toLocaleString("pt-BR");

}


/* =========================================================
   DASHBOARD
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

}


/* =========================================================
   VOLTAR
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


    try {

        currentPlayer =
            createPlayer({

                name: name,

                country: country,

                city: city,

                weightClass: weightClass,

                style: style

            });


        updateDashboard();


        showScreen(
            "screen-dashboard"
        );


        saveGame(currentPlayer);


        showGameMessage(
            "Carreira criada com sucesso."
        );


    } catch (error) {

        console.error(
            "Erro ao criar lutador:",
            error
        );

        alert(
            "Erro ao criar o lutador. Verifique os arquivos JavaScript."
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


    try {

        currentPlayer =
            createPlayer(savedPlayer);


        updateDashboard();


        showScreen(
            "screen-dashboard"
        );


        showGameMessage(
            "Jogo carregado com sucesso."
        );

    } catch (error) {

        console.error(
            "Erro ao carregar jogo:",
            error
        );

        showHomeMessage(
            "Erro ao carregar o jogo."
        );

    }

}


/* =========================================================
   SALVAR
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

    showGameMessage(
        "O sistema de treinamento será adicionado em seguida."
    );

}


/* =========================================================
   EVENTOS
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

        newGameButton.onclick =
            startNewGame;

    }


    if (loadGameButton) {

        loadGameButton.onclick =
            loadSavedGame;

    }


    if (createPlayerButton) {

        createPlayerButton.onclick =
            createNewPlayerFromForm;

    }


    if (backHomeButton) {

        backHomeButton.onclick =
            backToHome;

    }


    if (trainingButton) {

        trainingButton.onclick =
            openTraining;

    }


    if (advanceWeekButton) {

        advanceWeekButton.onclick =
            advanceGameWeek;

    }


    if (saveButton) {

        saveButton.onclick =
            saveCurrentGame;

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
