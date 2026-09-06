// ============================================================
// MMA LIFE DYNASTY
// UI — INDEX / UI BOOTSTRAP
// ============================================================

import gameUIAPI from "./gameUI.js";
import characterCreationAPI from "./characterCreation.js";

const UI_VERSION = 1;

const uiState = {
    initialized: false,
    database: null,
    currentScreen: "characterCreation",
    errors: [],
    warnings: []
};

// ============================================================
// UTILIDADES
// ============================================================

function clone(value) {
    if (value === undefined || value === null) return value;

    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function getDatabase(database = null) {
    return (
        database ||
        uiState.database ||
        window.MMA_LIFE_DATABASE ||
        null
    );
}

function setDatabase(database) {
    uiState.database = database || null;

    if (typeof window !== "undefined") {
        window.MMA_LIFE_DATABASE = database || null;
    }

    gameUIAPI.setDatabase(database);

    return uiState.database;
}

function logError(error) {
    const message =
        error instanceof Error
            ? error.message
            : String(error);

    uiState.errors.push({
        message,
        timestamp: new Date().toISOString()
    });

    if (uiState.errors.length > 50) {
        uiState.errors.shift();
    }

    console.error("[MMA LIFE UI]", error);
}

function logWarning(message) {
    uiState.warnings.push({
        message: String(message),
        timestamp: new Date().toISOString()
    });

    if (uiState.warnings.length > 50) {
        uiState.warnings.shift();
    }

    console.warn("[MMA LIFE UI]", message);
}

// ============================================================
// PREPARAÇÃO
// ============================================================

function prepareDatabase(database) {
    if (!database || typeof database !== "object") {
        return {
            player: null,
            career: {},
            training: {},
            life: {},
            business: {},
            media: {},
            dynasty: {}
        };
    }

    if (!database.career) {
        database.career = {};
    }

    if (!database.training) {
        database.training = {};
    }

    if (!database.life) {
        database.life = {};
    }

    if (!database.business) {
        database.business = {};
    }

    if (!database.media) {
        database.media = {};
    }

    if (!database.dynasty) {
        database.dynasty = {};
    }

    return database;
}

// ============================================================
// REGISTRO DAS TELAS
// ============================================================

function registerScreens() {
    gameUIAPI.registerScreen("characterCreation", {
        title: "Criação do Personagem",

        render(database) {
            return characterCreationAPI.render(database);
        }
    });

    gameUIAPI.registerScreen("dashboard", {
        title: "Dashboard"
    });

    gameUIAPI.registerScreen("career", {
        title: "Carreira"
    });

    gameUIAPI.registerScreen("training", {
        title: "Treinamento"
    });

    gameUIAPI.registerScreen("life", {
        title: "Vida"
    });

    gameUIAPI.registerScreen("family", {
        title: "Família"
    });

    gameUIAPI.registerScreen("finances", {
        title: "Finanças"
    });

    gameUIAPI.registerScreen("media", {
        title: "Mídia"
    });
}

// ============================================================
// RENDER
// ============================================================

function render(options = {}) {
    try {
        const database = getDatabase();

        if (database) {
            prepareDatabase(database);
        }

        return gameUIAPI.refresh(
            database,
            options
        );

    } catch (error) {
        logError(error);
        return null;
    }
}

// ============================================================
// NAVEGAÇÃO
// ============================================================

function openScreen(screen, options = {}) {
    if (!screen) return false;

    try {
        const exists =
            gameUIAPI.getScreen(screen);

        if (!exists) {
            logWarning(
                `Tela não registrada: ${screen}`
            );

            return false;
        }

        uiState.currentScreen = screen;

        return gameUIAPI.setActiveScreen(
            screen,
            options
        );

    } catch (error) {
        logError(error);
        return false;
    }
}

function openDashboard() {
    return openScreen("dashboard");
}

function openCharacterCreation() {
    return openScreen("characterCreation");
}

function openCareer() {
    return openScreen("career");
}

function openTraining() {
    return openScreen("training");
}

function openLife() {
    return openScreen("life");
}

function openFamily() {
    return openScreen("family");
}

function openFinances() {
    return openScreen("finances");
}

function openMedia() {
    return openScreen("media");
}

// ============================================================
// CRIAÇÃO DO PERSONAGEM
// ============================================================

function startCharacterCreation(database = null) {
    if (database) {
        setDatabase(database);
    }

    characterCreationAPI.reset();

    openCharacterCreation();

    return characterCreationAPI.getState();
}

function getCharacterCreation() {
    return characterCreationAPI.getState();
}

function updateCharacter(field, value) {
    return characterCreationAPI.setCharacterField(
        field,
        value
    );
}

function finalizeCharacterCreation() {
    const database = getDatabase();

    try {
        const result =
            characterCreationAPI.finalize(database);

        if (!result?.success) {
            return result;
        }

        setDatabase(database);

        uiState.currentScreen = "dashboard";

        openDashboard();

        return result;

    } catch (error) {
        logError(error);

        return {
            success: false,
            errors: [
                error instanceof Error
                    ? error.message
                    : String(error)
            ]
        };
    }
}

// ============================================================
// NOTIFICAÇÕES
// ============================================================

function notify(
    message,
    type = "info",
    duration = 3000
) {
    gameUIAPI.showToast(
        message,
        type,
        duration
    );

    return gameUIAPI.addNotification({
        type,
        title: type === "error"
            ? "Erro"
            : type === "warning"
                ? "Atenção"
                : type === "success"
                    ? "Sucesso"
                    : "Informação",
        message
    });
}

// ============================================================
// MODAIS
// ============================================================

function showModal(config = {}) {
    return gameUIAPI.openModal(config);
}

function closeModal() {
    return gameUIAPI.closeModal();
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

function initializeUI(database = null, options = {}) {
    try {
        if (database) {
            setDatabase(database);
        } else {
            database = getDatabase();
        }

        database = prepareDatabase(database);

        setDatabase(database);

        registerScreens();

        gameUIAPI.initialize(
            database,
            {
                render: false
            }
        );

        uiState.initialized = true;

        if (
            options.startAtCharacterCreation !== false &&
            !database.player
        ) {
            uiState.currentScreen =
                "characterCreation";

            characterCreationAPI.reset();

            gameUIAPI.setActiveScreen(
                "characterCreation"
            );

        } else {
            uiState.currentScreen =
                options.startScreen ||
                "dashboard";

            openScreen(
                uiState.currentScreen
            );
        }

        return getState();

    } catch (error) {
        logError(error);

        return {
            success: false,
            initialized: false,
            error:
                error instanceof Error
                    ? error.message
                    : String(error)
        };
    }
}

// ============================================================
// REFRESH
// ============================================================

function refresh(options = {}) {
    return render(options);
}

// ============================================================
// ESTADO
// ============================================================

function getState() {
    return {
        version: UI_VERSION,
        initialized: uiState.initialized,
        currentScreen: uiState.currentScreen,
        errors: clone(uiState.errors),
        warnings: clone(uiState.warnings),
        gameUI: gameUIAPI.getState(),
        characterCreation:
            characterCreationAPI.getState()
    };
}

function snapshot() {
    return {
        version: UI_VERSION,
        state: clone(uiState),
        gameUI: gameUIAPI.snapshot(),
        characterCreation:
            characterCreationAPI.snapshot()
    };
}

function validate() {
    const errors = [];

    if (!uiState.initialized) {
        errors.push(
            "A UI ainda não foi inicializada."
        );
    }

    if (!uiState.currentScreen) {
        errors.push(
            "Nenhuma tela atual definida."
        );
    }

    const gameUIValidation =
        gameUIAPI.validate();

    if (!gameUIValidation.valid) {
        errors.push(
            ...gameUIValidation.errors
        );
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// ============================================================
// API
// ============================================================

export const uiAPI = {

    version: UI_VERSION,

    initialize: initializeUI,
    init: initializeUI,

    render,
    refresh,

    getDatabase,
    setDatabase,

    openScreen,

    openDashboard,
    openCharacterCreation,
    openCareer,
    openTraining,
    openLife,
    openFamily,
    openFinances,
    openMedia,

    startCharacterCreation,
    getCharacterCreation,
    updateCharacter,
    finalizeCharacterCreation,

    notify,

    showModal,
    closeModal,

    getState,
    snapshot,
    validate,

    gameUI: gameUIAPI,
    characterCreation: characterCreationAPI
};

// ============================================================
// GLOBAL
// ============================================================

if (typeof window !== "undefined") {

    window.uiAPI = uiAPI;

    window.MMA_LIFE_UI = uiAPI;

    window.MMA_LIFE_GAME_UI =
        gameUIAPI;

    window.MMA_LIFE_CHARACTER_CREATION =
        characterCreationAPI;
}

// ============================================================
// READY EVENT
// ============================================================

if (typeof window !== "undefined") {

    window.dispatchEvent(
        new CustomEvent(
            "mma-life-ui-ready",
            {
                detail: {
                    api: uiAPI,
                    version: UI_VERSION
                }
            }
        )
    );
}

// ============================================================
// EXPORT
// ============================================================

export default uiAPI;
