/* =========================================================
   MMA LIFE DYNASTY
   LIFE.JS
========================================================= */

function lifeScreen() {

    if (typeof window.player === "undefined" || !window.player) {
        return;
    }

    const content = document.getElementById("content");

    if (!content) {
        return;
    }

    const player = window.player;

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
                👤 VIDA PESSOAL
            </div>

            <div class="statline">
                <span>Idade</span>
                <b>${player.age || 18} anos</b>
            </div>

            <div class="statline">
                <span>Dinheiro</span>
                <b>$${Math.round(player.money || 0)}</b>
            </div>

            <div class="statline">
                <span>Fama</span>
                <b>${Math.round(player.fame || 0)}</b>
            </div>

        </div>

        <div class="card">

            <div class="title">
                ❤️ RELACIONAMENTOS
            </div>

            <p>
                Você ainda está construindo sua vida pessoal.
            </p>

            <button
                class="main-button"
                onclick="familyScreen()">

                👨‍👩‍👧 FAMÍLIA

            </button>

        </div>

        <div class="card">

            <div class="title">
                🏠 ROTINA
            </div>

            <p>
                Cuide da sua saúde, carreira e vida pessoal.
            </p>

            <button
                class="main-button"
                onclick="rest()">

                😴 DESCANSAR

            </button>

        </div>

    `;
}


/* =========================================================
   FUNÇÃO GLOBAL
========================================================= */

window.lifeScreen = lifeScreen;
