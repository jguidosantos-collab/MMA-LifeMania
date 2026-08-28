/* =========================================================
   MMA LIFE DYNASTY
   SAVE.JS
   SISTEMA DE SALVAMENTO E CARREGAMENTO
   VERSÃO CORRIGIDA
========================================================= */
/* =========================================================
   CHAVE DO SAVE
========================================================= */
const SAVE_KEY = "mmaLifePlayer";
/* =========================================================
   SALVAR JOGO
========================================================= */
function saveGame() {
    try {
        if (
            typeof window.player === "undefined" ||
            !window.player
        ) {
            console.warn(
                "Não foi possível salvar: player inexistente."
            );
            return false;
        }
        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(
                window.player
            )
        );
        return true;
    }
    catch (error) {
        console.error(
            "Erro ao salvar o jogo:",
            error
        );
        return false;
    }
}
/* =========================================================
   ALIAS — SAVE
   OUTROS ARQUIVOS USAM window.save()
========================================================= */
function save() {
    return saveGame();
}
/* =========================================================
   CARREGAR JOGO
========================================================= */
function loadGame() {
    try {
        const raw =
            localStorage.getItem(
                SAVE_KEY
            );
        if (!raw) {
            return false;
        }
        const data =
            JSON.parse(raw);
        if (
            !data ||
            typeof data !== "object"
        ) {
            return false;
        }
        /*
           IMPORTANTE:
           Não substituir o objeto player inteiro
           de forma cega.
           Mantemos a referência global e copiamos
           os dados do save para ela.
        */
        if (
            typeof window.player === "undefined" ||
            !window.player
        ) {
            window.player = {};
        }
        Object.assign(
            window.player,
            data
        );
        /*
           Garantir estruturas essenciais.
        */
        window.player.attributes =
            window.player.attributes || {};
        window.player.amateur =
            window.player.amateur || {
                wins: 0,
                losses: 0,
                draws: 0,
                ranking: 50
            };
        window.player.professional =
            window.player.professional || {
                active: false,
                wins: 0,
                losses: 0,
                draws: 0,
                ranking: null
            };
        window.player.trainingPlan =
            window.player.trainingPlan || {
                weeks: {}
            };
        window.player.trainingPlan.weeks =
            window.player.trainingPlan.weeks || {};
        window.player.children =
            Array.isArray(
                window.player.children
            )
            ? window.player.children
            : [];
        window.player.log =
            Array.isArray(
                window.player.log
            )
            ? window.player.log
            : [];
        return true;
    }
    catch (error) {
        console.error(
            "Erro ao carregar o jogo:",
            error
        );
        return false;
    }
}
/* =========================================================
   ALIAS — LOAD
   O MAIN.JS USA window.load()
========================================================= */
function load() {
    return loadGame();
}
/* =========================================================
   APAGAR SAVE
========================================================= */
function clearSave() {
    try {
        localStorage.removeItem(
            SAVE_KEY
        );
        return true;
    }
    catch (error) {
        console.error(
            "Erro ao apagar save:",
            error
        );
        return false;
    }
}
/* =========================================================
   EXPORTAR FUNÇÕES
========================================================= */
window.saveGame =
    saveGame;
window.save =
    save;
window.loadGame =
    loadGame;
window.load =
    load;
window.clearSave =
    clearSave;
