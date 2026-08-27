/* =========================================================
   MMA LIFE DYNASTY
   SAVE.JS
   SISTEMA DE SALVAMENTO
   =========================================================
   CORREÇÃO:
   - Usa o mesmo save utilizado pelo main.js
   - Remove conflito com mmaLifeDynastyV1
   - Não duplica resetGame()
   - Mantém compatibilidade com o sistema atual
========================================================= */
/* =========================================================
   SALVAR
========================================================= */
function save() {
    if (
        typeof window.player === "undefined" ||
        !window.player
    ) {
        return;
    }
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
function load() {
    const data =
        localStorage.getItem(
            "mmaLifePlayer"
        );
    if (!data) {
        return false;
    }
    try {
        window.player =
            JSON.parse(data);
        const creation =
            document.getElementById(
                "creation"
            );
        const game =
            document.getElementById(
                "game"
            );
        const tabs =
            document.getElementById(
                "tabs"
            );
        if (creation) {
            creation.classList.add(
                "hidden"
            );
        }
        if (game) {
            game.classList.remove(
                "hidden"
            );
        }
        if (tabs) {
            tabs.classList.remove(
                "hidden"
            );
        }
        if (
            typeof window.home ===
            "function"
        ) {
            window.home();
        }
        return true;
    }
    catch (error) {
        console.error(
            "Erro ao carregar save:",
            error
        );
        return false;
    }
}
/* =========================================================
   DISPONIBILIZAR GLOBALMENTE
========================================================= */
window.save =
    save;
window.load =
    load;
/* =========================================================
   OBSERVAÇÃO
=========================================================
   O resetGame() NÃO fica neste arquivo.
   Ele já é controlado pelo main.js,
   evitando duas funções com o mesmo nome
   disputando o controle do jogo.
========================================================= */
