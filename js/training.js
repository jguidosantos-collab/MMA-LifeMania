/* =========================================================
MMA LIFE DYNASTY
TRAINING.JS
SISTEMA DE TREINAMENTO

* CAMP MENSAL
    ========================================================= */

/* =========================================================
TREINAMENTO ATUAL — PRESERVADO
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
            📅 CAMP
        </div>
        <p>
            Planeje suas próximas 4 semanas
            de preparação.
        </p>
        <button
            class="main-button"
            onclick="campScreen()">
            🏋️ PLANEJAR CAMP
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
REALIZAR TREINO — PRESERVADO
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
CAMP — GARANTIR DADOS
========================================================= */

function ensureCampData() {

ensurePlayer();
const player = window.player;
if (!player) {
    return null;
}
if (
    !player.trainingCamp ||
    typeof player.trainingCamp !== "object"
) {
    player.trainingCamp = {};
}
if (
    !Array.isArray(
        player.trainingCamp.weeks
    )
) {
    player.trainingCamp.weeks = [
        {
            type: "Treino",
            focus: "striking",
            intensity: 2
        },
        {
            type: "Treino",
            focus: "wrestling",
            intensity: 2
        },
        {
            type: "Treino",
            focus: "grappling",
            intensity: 2
        },
        {
            type: "Descanso",
            focus: "recovery",
            intensity: 0
        }
    ];
}
while (
    player.trainingCamp.weeks.length < 4
) {
    player.trainingCamp.weeks.push({
        type: "Descanso",
        focus: "recovery",
        intensity: 0
    });
}
if (
    player.trainingCamp.weeks.length > 4
) {
    player.trainingCamp.weeks =
        player.trainingCamp.weeks.slice(
            0,
            4
        );
}
return player;

}

/* =========================================================
NOMES DO CAMP
========================================================= */

function campFocusName(focus) {

if (focus === "strength") {
    return "💪 Força";
}
if (focus === "striking") {
    return "👊 Striking";
}
if (focus === "wrestling") {
    return "🤼 Wrestling";
}
if (focus === "grappling") {
    return "🥋 Grappling";
}
if (focus === "cardio") {
    return "🫀 Cardio";
}
if (focus === "technique") {
    return "🎯 Técnica";
}
if (focus === "defense") {
    return "🛡️ Defesa";
}
if (focus === "recovery") {
    return "😴 Descanso";
}
return "Treino";

}

/* =========================================================
INTENSIDADE
========================================================= */

function campIntensityName(intensity) {

if (Number(intensity) === 1) {
    return "🟢 Leve";
}
if (Number(intensity) === 2) {
    return "🟡 Normal";
}
if (Number(intensity) === 3) {
    return "🔴 Intenso";
}
return "Descanso";

}

/* =========================================================
CONFIGURAR SEMANA DO CAMP
========================================================= */

function setCampWeek(
index,
type,
focus,
intensity
) {

const player =
    ensureCampData();
if (!player) {
    return;
}
const week =
    Number(index);
if (
    week < 0 ||
    week > 3
) {
    return;
}
player.trainingCamp.weeks[week] = {
    type:
        type,
    focus:
        focus,
    intensity:
        Number(intensity)
};
saveGame();
campScreen();

}

/* =========================================================
CAMP — GANHO DE ATRIBUTO
========================================================= */

function campGainAttribute(
attribute,
amount
) {

const player =
    window.player;
if (!player) {
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
if (
    current >= potential
) {
    return;
}
const gain =
    Math.min(
        Number(amount),
        potential - current
    );
player.attributes[attribute] =
    Number(
        (
            current + gain
        ).toFixed(2)
    );

}

/* =========================================================
CAMP — PROCESSAR SEMANA
========================================================= */

function processCampWeek(campWeek) {

const player =
    window.player;
if (!player) {
    return;
}
if (
    !campWeek ||
    campWeek.type === "Descanso" ||
    campWeek.focus === "recovery"
) {
    player.fatigue =
        Math.max(
            0,
            Number(player.fatigue || 0) - 15
        );
    player.health =
        Math.min(
            100,
            Number(player.health || 100) + 5
        );
    return;
}
const intensity =
    Number(
        campWeek.intensity || 1
    );
/*
 * EVOLUÇÃO
 *
 * Leve    = +0.50
 * Normal  = +0.70
 * Intenso = +0.90
 */
let gain = 0.50;
if (intensity === 2) {
    gain = 0.70;
}
if (intensity === 3) {
    gain = 0.90;
}
const focus =
    campWeek.focus;
if (focus === "strength") {
    campGainAttribute(
        "strength",
        gain
    );
}
if (focus === "striking") {
    campGainAttribute(
        "striking",
        gain
    );
    campGainAttribute(
        "technique",
        gain * 0.50
    );
}
if (focus === "wrestling") {
    campGainAttribute(
        "wrestling",
        gain
    );
    campGainAttribute(
        "strength",
        gain * 0.50
    );
}
if (focus === "grappling") {
    campGainAttribute(
        "grappling",
        gain
    );
    campGainAttribute(
        "technique",
        gain * 0.50
    );
}
if (focus === "cardio") {
    campGainAttribute(
        "cardio",
        gain
    );
}
if (focus === "technique") {
    campGainAttribute(
        "technique",
        gain
    );
}
if (focus === "defense") {
    campGainAttribute(
        "defense",
        gain
    );
}
/*
 * FADIGA
 */
player.fatigue =
    Math.min(
        100,
        Number(player.fatigue || 0) +
        (intensity * 7)
    );
/*
 * SAÚDE
 */
player.health =
    Math.max(
        20,
        Number(player.health || 100) -
        (intensity * 1)
    );

}

/* =========================================================
FORMA DO CAMP
========================================================= */

function getCampForm() {

const player =
    window.player;
if (!player) {
    return 0;
}
const health =
    Number(
        player.health || 100
    );
const fatigue =
    Number(
        player.fatigue || 0
    );
let form = 70;
form +=
    (health - 70) * 0.30;
form -=
    fatigue * 0.25;
return Math.max(
    0,
    Math.min(
        100,
        Math.round(form)
    )
);

}

/* =========================================================
TELA DO CAMP
========================================================= */

function campScreen() {

const player =
    ensureCampData();
if (!player) {
    return;
}
const content =
    getElement("content");
if (!content) {
    return;
}
let weeksHTML = "";
player.trainingCamp.weeks.forEach(
    function(campWeek, index) {
        weeksHTML += `
            <div class="card">
                <div class="title">
                    📅 SEMANA ${index + 1}
                </div>
                <div class="statline">
                    <span>
                        Foco
                    </span>
                    <b>
                        ${campFocusName(
                            campWeek.focus
                        )}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Intensidade
                    </span>
                    <b>
                        ${campIntensityName(
                            campWeek.intensity
                        )}
                    </b>
                </div>
                <br>
                <button
                    class="main-button"
                    onclick="setCampWeek(
                        ${index},
                        'Treino',
                        'strength',
                        1
                    )">
                    💪 FORÇA LEVE
                </button>
                <button
                    class="main-button"
                    onclick="setCampWeek(
                        ${index},
                        'Treino',
                        'striking',
                        2
                    )">
                    👊 STRIKING NORMAL
                </button>
                <button
                    class="main-button"
                    onclick="setCampWeek(
                        ${index},
                        'Treino',
                        'wrestling',
                        3
                    )">
                    🤼 WRESTLING INTENSO
                </button>
                <button
                    class="main-button"
                    onclick="setCampWeek(
                        ${index},
                        'Treino',
                        'grappling',
                        2
                    )">
                    🥋 GRAPPLING NORMAL
                </button>
                <button
                    class="main-button"
                    onclick="setCampWeek(
                        ${index},
                        'Treino',
                        'cardio',
                        2
                    )">
                    🫀 CARDIO NORMAL
                </button>
                <button
                    class="main-button"
                    onclick="setCampWeek(
                        ${index},
                        'Treino',
                        'technique',
                        1
                    )">
                    🎯 TÉCNICA LEVE
                </button>
                <button
                    class="main-button"
                    onclick="setCampWeek(
                        ${index},
                        'Treino',
                        'defense',
                        2
                    )">
                    🛡️ DEFESA NORMAL
                </button>
                <button
                    class="gray"
                    onclick="setCampWeek(
                        ${index},
                        'Descanso',
                        'recovery',
                        0
                    )">
                    😴 DESCANSO
                </button>
            </div>
        `;
    }
);
content.innerHTML = `
    <div class="card">
        <div class="title">
            🏋️ CAMP MENSAL
        </div>
        <p>
            Planeje suas próximas 4 semanas
            de treinamento.
        </p>
    </div>
    <div class="card">
        <div class="title">
            🧠 ESTADO DO LUTADOR
        </div>
        <div class="statline">
            <span>
                Forma
            </span>
            <b>
                ${getCampForm()}/100
            </b>
        </div>
        <div class="statline">
            <span>
                Fadiga
            </span>
            <b>
                ${Math.round(
                    player.fatigue || 0
                )}%
            </b>
        </div>
        <div class="statline">
            <span>
                Saúde
            </span>
            <b>
                ${Math.round(
                    player.health || 100
                )}%
            </b>
        </div>
    </div>
    ${weeksHTML}
    <div class="card">
        <div class="title">
            💾 PLANEJAMENTO
        </div>
        <p>
            O CAMP é salvo automaticamente.
            O treino programado será aplicado
            conforme as semanas avançarem.
        </p>
        <button
            class="gray"
            onclick="training()">
            ← VOLTAR AO TREINAMENTO
        </button>
    </div>
`;

}

/* =========================================================
FUNÇÕES GLOBAIS
========================================================= */

window.training =
training;

window.trainAttribute =
trainAttribute;

window.campScreen =
campScreen;

window.setCampWeek =
setCampWeek;

window.processCampWeek =
processCampWeek;

window.getCampForm =
getCampForm;
