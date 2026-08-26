/* =========================================================
   MMA LIFE DYNASTY
   TRAINING.JS
   SISTEMA DE TREINAMENTO
========================================================= */

function training() {

    ensurePlayer();

    const content = getElement("content");

    if (!content) {
        return;
    }

    const player = window.player;
    const attributes = player.attributes || {};

    content.innerHTML = `

        <div class="card">

            <div class="title">
                🏋️ CENTRO DE TREINAMENTO
            </div>

            <p>
                Desenvolva suas habilidades e prepare-se
                para sua próxima luta.
            </p>

        </div>


        <div class="card">

            <div class="title">
                📊 ATRIBUTOS
            </div>

            <div class="statline">
                <span>Força</span>
                <b>${Math.round(attributes.strength || 0)}</b>
            </div>

            <div class="statline">
                <span>Striking</span>
                <b>${Math.round(attributes.striking || 0)}</b>
            </div>

            <div class="statline">
                <span>Wrestling</span>
                <b>${Math.round(attributes.wrestling || 0)}</b>
            </div>

            <div class="statline">
                <span>Grappling</span>
                <b>${Math.round(attributes.grappling || 0)}</b>
            </div>

            <div class="statline">
                <span>Cardio</span>
                <b>${Math.round(attributes.cardio || 0)}</b>
            </div>

            <div class="statline">
                <span>Técnica</span>
                <b>${Math.round(attributes.technique || 0)}</b>
            </div>

            <div class="statline">
                <span>Defesa</span>
                <b>${Math.round(attributes.defense || 0)}</b>
            </div>

        </div>


        <div class="card">

            <div class="title">
                🥊 TREINAR
            </div>

            <p>
                Fadiga atual:
                <strong>
                    ${Math.round(player.fatigue || 0)}%
                </strong>
            </p>

            <button
                class="main-button"
                onclick="trainAttribute('strength')">

                💪 FORÇA

            </button>

            <button
                class="main-button"
                onclick="trainAttribute('striking')">

                👊 STRIKING

            </button>

            <button
                class="main-button"
                onclick="trainAttribute('wrestling')">

                🤼 WRESTLING

            </button>

            <button
                class="main-button"
                onclick="trainAttribute('grappling')">

                🥋 GRAPPLING

            </button>

            <button
                class="main-button"
                onclick="trainAttribute('cardio')">

                🫀 CARDIO

            </button>

            <button
                class="main-button"
                onclick="trainAttribute('technique')">

                🎯 TÉCNICA

            </button>

            <button
                class="main-button"
                onclick="trainAttribute('defense')">

                🛡️ DEFESA

            </button>

        </div>


        <div class="card">

            <div class="title">
                😴 RECUPERAÇÃO
            </div>

            <button
                class="main-button"
                onclick="rest()">

                😴 DESCANSAR

            </button>

        </div>

    `;
}


/* =========================================================
   REALIZAR TREINO
========================================================= */

function trainAttribute(attribute) {

    ensurePlayer();

    const player = window.player;

    if ((player.fatigue || 0) >= 85) {

        alert(
            "Você está muito cansado. Descanse antes de treinar."
        );

        return;
    }

    if (!player.attributes) {
        player.attributes = {};
    }

    const current =
        Number(
            player.attributes[attribute] || 45
        );

    const potential =
        Number(
            player.potential || 90
        );

    if (current >= potential) {

        alert(
            "Você atingiu seu limite de potencial neste atributo."
        );

        return;
    }

    const gain =
        0.2 + Math.random() * 0.5;

    player.attributes[attribute] =
        Math.min(
            potential,
            Number(
                (current + gain).toFixed(2)
            )
        );

    player.fatigue =
        Math.min(
            100,
            Number(player.fatigue || 0) + 8
        );

    player.health =
        Math.max(
            20,
            Number(player.health || 100) - 1
        );

    player.log =
        player.log || [];

    player.log.unshift(
        "🏋️ Treino realizado: " + attribute
    );

    saveGame();

    training();
}


/* =========================================================
   DISPONIBILIZAR GLOBALMENTE
========================================================= */

window.training =
    training;

window.trainAttribute =
    trainAttribute;
