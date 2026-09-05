/**
 * ============================================================
 * MMA LIFE DYNASTY
 * CORE — SAVE SYSTEM
 * ============================================================
 *
 * Responsabilidade:
 * - Salvar o estado do jogo.
 * - Carregar o estado salvo.
 * - Validar e normalizar saves.
 * - Criar backups em memória.
 * - Apagar saves.
 * - Preparar autosave.
 *
 * IMPORTANTE:
 * Este módulo não controla gameplay.
 * Ele apenas persiste o estado do jogo.
 * ============================================================
 */

import {
    SAVE_KEY,
    AUTOSAVE_ENABLED,
    AUTOSAVE_INTERVAL
} from "./constants.js";

import {
    cloneGameState,
    normalizeGameState,
    validateGameState
} from "./state.js";


// ------------------------------------------------------------
// CONFIGURAÇÃO
// ------------------------------------------------------------

const BACKUP_KEY =
    `${SAVE_KEY}_backup`;

let autosaveTimer = null;


// ------------------------------------------------------------
// VERIFICAR LOCALSTORAGE
// ------------------------------------------------------------

function getStorage() {

    if (
        typeof window === "undefined" ||
        !window.localStorage
    ) {
        return null;
    }

    return window.localStorage;
}


// ------------------------------------------------------------
// SERIALIZAR ESTADO
// ------------------------------------------------------------

export function serializeGameState(state) {

    if (!state) {
        throw new Error(
            "Não é possível salvar um estado vazio."
        );
    }

    return JSON.stringify(
        state
    );
}


// ------------------------------------------------------------
// DESSERIALIZAR ESTADO
// ------------------------------------------------------------

export function deserializeGameState(
    serialized
) {

    if (
        typeof serialized !== "string" ||
        !serialized
    ) {
        throw new Error(
            "Save inválido ou vazio."
        );
    }

    try {

        return JSON.parse(
            serialized
        );

    } catch (error) {

        throw new Error(
            "Não foi possível ler o save."
        );
    }
}


// ------------------------------------------------------------
// VALIDAR ESTADO
// ------------------------------------------------------------

export function validateSave(state) {

    const validation =
        validateGameState(state);

    if (
        validation === true
    ) {
        return {
            valid: true,
            errors: []
        };
    }

    if (
        validation === false
    ) {
        return {
            valid: false,
            errors: [
                "Estado do jogo inválido."
            ]
        };
    }

    if (
        validation &&
        typeof validation === "object"
    ) {

        return {
            valid:
                validation.valid !== false,

            errors:
                validation.errors || []
        };
    }

    return {
        valid: true,
        errors: []
    };
}


// ------------------------------------------------------------
// SALVAR JOGO
// ------------------------------------------------------------

export function saveGame(state) {

    const storage =
        getStorage();

    if (!storage) {
        return {
            success: false,
            reason:
                "LocalStorage indisponível."
        };
    }

    const validation =
        validateSave(state);

    if (!validation.valid) {

        return {
            success: false,
            reason:
                "Estado inválido.",
            errors:
                validation.errors
        };
    }

    const saveState =
        cloneGameState(state);

    saveState.meta.lastSavedAt =
        new Date().toISOString();

    try {

        const serialized =
            serializeGameState(
                saveState
            );

        // Backup do save anterior
        const previousSave =
            storage.getItem(
                SAVE_KEY
            );

        if (previousSave) {

            storage.setItem(
                BACKUP_KEY,
                previousSave
            );
        }

        storage.setItem(
            SAVE_KEY,
            serialized
        );

        // Atualizar também o estado
        if (state.meta) {
            state.meta.lastSavedAt =
                saveState.meta.lastSavedAt;
        }

        return {
            success: true,

            savedAt:
                saveState.meta.lastSavedAt,

            size:
                serialized.length
        };

    } catch (error) {

        return {
            success: false,

            reason:
                "Falha ao salvar o jogo.",

            error:
                error.message
        };
    }
}


// ------------------------------------------------------------
// CARREGAR JOGO
// ------------------------------------------------------------

export function loadGame() {

    const storage =
        getStorage();

    if (!storage) {
        return {
            success: false,
            reason:
                "LocalStorage indisponível."
        };
    }

    const serialized =
        storage.getItem(
            SAVE_KEY
        );

    if (!serialized) {

        return {
            success: false,
            reason:
                "Nenhum save encontrado."
        };
    }

    try {

        const rawState =
            deserializeGameState(
                serialized
            );

        const normalizedState =
            normalizeGameState(
                rawState
            );

        const validation =
            validateSave(
                normalizedState
            );

        if (!validation.valid) {

            return {
                success: false,

                reason:
                    "O save encontrado é inválido.",

                errors:
                    validation.errors
            };
        }

        return {
            success: true,
            state:
                normalizedState
        };

    } catch (error) {

        return {
            success: false,

            reason:
                "Não foi possível carregar o save.",

            error:
                error.message
        };
    }
}


// ------------------------------------------------------------
// VERIFICAR SE EXISTE SAVE
// ------------------------------------------------------------

export function hasSave() {

    const storage =
        getStorage();

    if (!storage) {
        return false;
    }

    return Boolean(
        storage.getItem(
            SAVE_KEY
        )
    );
}


// ------------------------------------------------------------
// OBTER INFORMAÇÕES DO SAVE
// ------------------------------------------------------------

export function getSaveInfo() {

    const storage =
        getStorage();

    if (!storage) {
        return null;
    }

    const serialized =
        storage.getItem(
            SAVE_KEY
        );

    if (!serialized) {
        return null;
    }

    try {

        const state =
            deserializeGameState(
                serialized
            );

        return {

            version:
                state.version ?? null,

            currentDate:
                state.meta?.currentDate ??
                null,

            currentWeek:
                state.meta?.currentWeek ??
                null,

            currentYear:
                state.meta?.currentYear ??
                null,

            playerName:
                state.player?.name ??
                null,

            playerAge:
                state.player?.age ??
                null,

            lastSavedAt:
                state.meta?.lastSavedAt ??
                null,

            size:
                serialized.length
        };

    } catch {

        return null;
    }
}


// ------------------------------------------------------------
// APAGAR SAVE
// ------------------------------------------------------------

export function deleteSave() {

    const storage =
        getStorage();

    if (!storage) {
        return false;
    }

    try {

        storage.removeItem(
            SAVE_KEY
        );

        return true;

    } catch {

        return false;
    }
}


// ------------------------------------------------------------
// RESTAURAR BACKUP
// ------------------------------------------------------------

export function restoreBackup() {

    const storage =
        getStorage();

    if (!storage) {

        return {
            success: false,
            reason:
                "LocalStorage indisponível."
        };
    }

    const backup =
        storage.getItem(
            BACKUP_KEY
        );

    if (!backup) {

        return {
            success: false,
            reason:
                "Nenhum backup encontrado."
        };
    }

    try {

        // Validar antes de restaurar
        const rawState =
            deserializeGameState(
                backup
            );

        const normalizedState =
            normalizeGameState(
                rawState
            );

        const validation =
            validateSave(
                normalizedState
            );

        if (!validation.valid) {

            return {
                success: false,

                reason:
                    "O backup também é inválido.",

                errors:
                    validation.errors
            };
        }

        storage.setItem(
            SAVE_KEY,
            JSON.stringify(
                normalizedState
            )
        );

        return {
            success: true,
            state:
                normalizedState
        };

    } catch (error) {

        return {
            success: false,

            reason:
                "Falha ao restaurar backup.",

            error:
                error.message
        };
    }
}


// ------------------------------------------------------------
// EXPORTAR SAVE
// ------------------------------------------------------------

export function exportSave(state) {

    if (!state) {
        throw new Error(
            "Estado do jogo não informado."
        );
    }

    const cloned =
        cloneGameState(state);

    return serializeGameState(
        cloned
    );
}


// ------------------------------------------------------------
// IMPORTAR SAVE
// ------------------------------------------------------------

export function importSave(
    serialized
) {

    try {

        const rawState =
            deserializeGameState(
                serialized
            );

        const normalizedState =
            normalizeGameState(
                rawState
            );

        const validation =
            validateSave(
                normalizedState
            );

        if (!validation.valid) {

            return {
                success: false,

                reason:
                    "O arquivo de save é inválido.",

                errors:
                    validation.errors
            };
        }

        return {
            success: true,

            state:
                normalizedState
        };

    } catch (error) {

        return {
            success: false,

            reason:
                "Falha ao importar save.",

            error:
                error.message
        };
    }
}


// ------------------------------------------------------------
// AUTOSAVE
// ------------------------------------------------------------

export function startAutosave(
    getState,
    interval = AUTOSAVE_INTERVAL
) {

    stopAutosave();

    if (!AUTOSAVE_ENABLED) {
        return false;
    }

    if (
        typeof getState !== "function"
    ) {
        throw new Error(
            "getState precisa ser uma função."
        );
    }

    if (
        !Number.isFinite(interval) ||
        interval <= 0
    ) {
        throw new Error(
            "Intervalo de autosave inválido."
        );
    }

    autosaveTimer =
        setInterval(() => {

            try {

                const state =
                    getState();

                if (state) {
                    saveGame(state);
                }

            } catch (error) {

                console.error(
                    "Erro no autosave:",
                    error
                );
            }

        }, interval);

    return true;
}


// ------------------------------------------------------------
// PARAR AUTOSAVE
// ------------------------------------------------------------

export function stopAutosave() {

    if (autosaveTimer !== null) {

        clearInterval(
            autosaveTimer
        );

        autosaveTimer = null;
    }
}


// ------------------------------------------------------------
// STATUS DO AUTOSAVE
// ------------------------------------------------------------

export function isAutosaveRunning() {

    return (
        autosaveTimer !== null
    );
}


// ------------------------------------------------------------
// SAVE MANUAL COM BACKUP
// ------------------------------------------------------------

export function createManualSave(
    state
) {

    return saveGame(
        state
    );
}


// ------------------------------------------------------------
// RESUMO DO SISTEMA DE SAVE
// ------------------------------------------------------------

export function getSaveSystemStatus() {

    return {

        hasSave:
            hasSave(),

        saveInfo:
            getSaveInfo(),

        autosave:
            isAutosaveRunning(),

        storageAvailable:
            getStorage() !== null
    };
}


// ------------------------------------------------------------
// EXPORT DEFAULT
// ------------------------------------------------------------

export default {

    serializeGameState,
    deserializeGameState,

    validateSave,

    saveGame,
    loadGame,

    hasSave,
    getSaveInfo,

    deleteSave,
    restoreBackup,

    exportSave,
    importSave,

    startAutosave,
    stopAutosave,
    isAutosaveRunning,

    createManualSave,

    getSaveSystemStatus
};
