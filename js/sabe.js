/* =========================================================
MMA LIFE DYNASTY
SAVE.JS
SISTEMA DE SAVE / LOAD
========================================================= */

/* =========================================================
CONFIGURAÇÕES
========================================================= */

const SAVE_CONFIG = {

storageKey:
    "mma_life_dynasty_save_v1",
version:
    1

};

/* =========================================================
SALVAR JOGO
========================================================= */

function saveGame(player) {

if (!player) {
    return {
        success: false,
        message: "Nenhum lutador para salvar."
    };
}
try {
    player.lastUpdated =
        new Date().toISOString();
    const saveData = {
        version:
            SAVE_CONFIG.version,
        savedAt:
            new Date().toISOString(),
        player:
            player
    };
    localStorage.setItem(
        SAVE_CONFIG.storageKey,
        JSON.stringify(saveData)
    );
    return {
        success: true,
        message: "Jogo salvo com sucesso."
    };
} catch (error) {
    console.error(
        "Erro ao salvar jogo:",
        error
    );
    return {
        success: false,
        message:
            "Não foi possível salvar o jogo."
    };
}

}

/* =========================================================
CARREGAR JOGO
========================================================= */

function loadGame() {

try {
    const rawData =
        localStorage.getItem(
            SAVE_CONFIG.storageKey
        );
    if (!rawData) {
        return null;
    }
    const saveData =
        JSON.parse(rawData);
    if (
        !saveData ||
        !saveData.player
    ) {
        return null;
    }
    return saveData.player;
} catch (error) {
    console.error(
        "Erro ao carregar jogo:",
        error
    );
    return null;
}

}

/* =========================================================
VERIFICAR SE EXISTE SAVE
========================================================= */

function hasSaveGame() {

try {
    return Boolean(
        localStorage.getItem(
            SAVE_CONFIG.storageKey
        )
    );
} catch (error) {
    return false;
}

}

/* =========================================================
APAGAR SAVE
========================================================= */

function deleteSaveGame() {

try {
    localStorage.removeItem(
        SAVE_CONFIG.storageKey
    );
    return true;
} catch (error) {
    console.error(
        "Erro ao apagar save:",
        error
    );
    return false;
}

}

/* =========================================================
EXPORTAR SAVE
========================================================= */

function exportSave(player) {

if (!player) {
    return null;
}
const saveData = {
    version:
        SAVE_CONFIG.version,
    exportedAt:
        new Date().toISOString(),
    player:
        player
};
return JSON.stringify(
    saveData,
    null,
    2
);

}

/* =========================================================
IMPORTAR SAVE
========================================================= */

function importSave(jsonData) {

if (!jsonData) {
    return {
        success: false,
        player: null,
        message:
            "Nenhum dado foi fornecido."
    };
}
try {
    const saveData =
        typeof jsonData === "string"
            ? JSON.parse(jsonData)
            : jsonData;
    if (
        !saveData ||
        !saveData.player
    ) {
        return {
            success: false,
            player: null,
            message:
                "Save inválido."
        };
    }
    return {
        success: true,
        player:
            saveData.player,
        message:
            "Save importado com sucesso."
    };
} catch (error) {
    console.error(
        "Erro ao importar save:",
        error
    );
    return {
        success: false,
        player: null,
        message:
            "Não foi possível importar o save."
    };
}

}
