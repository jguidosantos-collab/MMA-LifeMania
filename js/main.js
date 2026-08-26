/* =========================================================
   MMA LIFE — PAINEL PRINCIPAL
   Layout estilo BitLife
========================================================= */

function tab(name) {

    if (name === "home") home();
    if (name === "career") career();
    if (name === "train") training();
    if (name === "fight") fightScreen();
    if (name === "team") teamScreen();
    if (name === "life") familyScreen();
    if (name === "ranking") rankingScreen();
    if (name === "calendar") calendarScreen();
    if (name === "attributes") attributesScreen();
}

/* =========================================================
   UTILIDADES
========================================================= */

function safeNumber(value, fallback = 0) {
    return Number.isFinite(Number(value))
        ? Number(value)
        : fallback;
}

function getOverall() {

    if (typeof calculateOverall === "function") {
        return Math.round(calculateOverall());
    }

    const a = player.attributes || {};

    const values = [
        a.strength,
        a.striking,
        a.wrestling,
        a.grappling,
        a.cardio,
        a.technique,
        a.defense,
        a.fightIQ,
        a.mental,
        a.confidence
    ]
    .map(v => safeNumber(v, 0))
    .filter(v => v > 0);

    if (!values.length) {
        return 60;
    }

    return Math.round(
        values.reduce((sum, value) => sum + value, 0)
        / values.length
    );
}

function getPotential() {

    if (player.potential !== undefined) {
        return Math.round(player.potential);
    }

    /*
     * Potencial inicial entre 78 e 96.
     */

    player.potential =
        Math.floor(
            Math.random() * 19
        ) + 78;

    save();

    return player.potential;
}

function getWeek() {

    if (!player.week) {
        player.week = 1;
    }

    return player.week;
}

function getWeekText() {
    return `SEMANA ${getWeek()} / 52`;
}

function backHomeButton() {

    return `
        <button
            class="main-button gray"
            onclick="home()">

            ← VOLTAR AO PAINEL

        </button>
    `;
}

/* =========================================================
   COMEÇAR JOGO
========================================================= */

function startGame() {

    const content =
        document.getElementById("content");

    if (!content) return;

    content.innerHTML = `

        <div class="start-screen">

            <div class="start-logo">
                🥊
            </div>

            <h1>
                MMA LIFE
            </h1>

            <p class="start-subtitle">
                CONSTRUA SUA CARREIRA.<br>
                ESCREVA SEU LEGADO.
            </p>

            <button
                class="start-button"
                onclick="openCharacterCreation()">

                🆕 CRIAR NOVO LUTADOR

            </button>

        </div>
    `;
}

/* =========================================================
   CRIAÇÃO DO LUTADOR
========================================================= */

function openCharacterCreation() {

    const content =
        document.getElementById("content");

    content.innerHTML = `

        <div class="card">

            <div class="title">
                🥊 NOVO LUTADOR
            </div>

            <input
                id="playerName"
                placeholder="Nome do lutador"
            >

            <select id="country">

                <option value="Brasil">
                    🇧🇷 Brasil
                </option>

                <option value="Estados Unidos">
                    🇺🇸 Estados Unidos
                </option>

                <option value="Japão">
                    🇯🇵 Japão
                </option>

                <option value="México">
                    🇲🇽 México
                </option>

                <option value="Argentina">
                    🇦🇷 Argentina
                </option>

                <option value="Canadá">
                    🇨🇦 Canadá
                </option>

                <option value="Rússia">
                    🇷🇺 Rússia
                </option>

                <option value="Reino Unido">
                    🇬🇧 Reino Unido
                </option>

            </select>

            <select id="weight">

                <option>
                    Peso Leve
                </option>

                <option>
                    Peso Meio-Médio
                </option>

                <option>
                    Peso Médio
                </option>

                <option>
                    Peso Meio-Pesado
                </option>

                <option>
                    Peso Pesado
                </option>

            </select>

            <select id="style">

                <option>
                    Completo
                </option>

                <option>
                    Striker
                </option>

                <option>
                    Wrestler
                </option>

                <option>
                    Grappler
                </option>

            </select>

            <button
                class="green"
                onclick="createPlayerFromScreen()">

                ✅ CRIAR LUTADOR

            </button>

            <button
                class="gray"
                onclick="startGame()">

                ← VOLTAR

            </button>

        </div>
    `;
}

/* =========================================================
   CRIAR JOGADOR
========================================================= */

function createPlayerFromScreen() {

    const name =
        document.getElementById("playerName")
            .value.trim();

    const country =
        document.getElementById("country")
            .value;

    const weight =
        document.getElementById("weight")
            .value;

    const style =
        document.getElementById("style")
            .value;

    if (!name) {

        alert(
            "Digite o nome do lutador."
        );

        return;
    }

    player.name = name;
    player.country = country;
    player.weight = weight;
    player.style = style;

    player.age = 18;

    player.money = 0;

    player.fame = 0;

    player.health = 100;

    player.fatigue = 0;

    player.week = 1;

    /*
     * O atleta nasce com OVR 60.
     */

    player.overall = 60;

    /*
     * Potencial entre 78 e 96.
     */

    player.potential =
        Math.floor(
            Math.random() * 19
        ) + 78;

    player.professional =
        player.professional || {

            active: false,
            wins: 0,
            losses: 0,
            draws: 0

        };

    player.amateur =
        player.amateur || {

            wins: 0,
            losses: 0,
            draws: 0

        };

    player.attributes = {

        strength: 60,
        striking: 60,
        wrestling: 60,
        grappling: 60,
        cardio: 60,
        technique: 60,
        defense: 60,
        fightIQ: 60,
        mental: 60,
        confidence: 60

    };

    player.children =
        player.children || [];

    player.log =
        player.log || [];

    player.nextFight = null;

    player.team = null;

    player.manager = null;

    player.currentPromotion = null;

    player.currentContract = null;

    player.careerStage = "amateur";

    player.relationship =
        "Solteiro";

    player.married = false;

    save();

    home();
}

/* =========================================================
   PAINEL PRINCIPAL
========================================================= */

function home() {

    const p =
        player.professional || {};

    const amateur =
        player.amateur || {};

    const overall =
        getOverall();

    const potential =
        getPotential();

    const week =
        getWeek();

    const nextFight =
        player.nextFight || null;

    const team =
        player.team || null;

    const manager =
        player.manager || null;

    const recordPro =
        `${p.wins || 0}-${p.losses || 0}-${p.draws || 0}`;

    const content =
        document.getElementById("content");

    if (!content) return;

    content.innerHTML = `

        <div class="home-container">

            <!-- ================================
                 CABEÇALHO
            ================================= -->

            <div class="fighter-header">

                <div class="fighter-avatar">

                    <div class="avatar-placeholder">
                        🥊
                    </div>

                </div>

                <div class="fighter-info">

                    <div class="fighter-name">
                        ${player.name || "Lutador"}
                    </div>

                    <div class="fighter-country">
                        ${player.country || "Brasil"}
                    </div>

                    <div class="fighter-weight">
                        ${player.weight || "Categoria"}
                    </div>

                </div>

            </div>


            <!-- ================================
                 OVERALL
            ================================= -->

            <div class="stats-grid">

                <div class="stat-card">

                    <span>OVR</span>

                    <strong>
                        ${overall}
                    </strong>

                </div>

                <div class="stat-card">

                    <span>POTENCIAL</span>

                    <strong>
                        ${potential}
                    </strong>

                </div>

                <div class="stat-card">

                    <span>IDADE</span>

                    <strong>
                        ${player.age || 18}
                    </strong>

                </div>

                <div class="stat-card">

                    <span>FAMA</span>

                    <strong>
                        ${Math.round(
                            player.fame || 0
                        )}
                    </strong>

                </div>

            </div>


            <!-- ================================
                 STATUS
            ================================= -->

            <div class="card">

                <div class="title">
                    📊 STATUS
                </div>

                <div class="statline">

                    <span>
                        💰 Dinheiro
                    </span>

                    <b>
                        $${Math.round(
                            player.money || 0
                        )}
                    </b>

                </div>

                <div class="statline">

                    <span>
                        🏆 Recorde
                    </span>

                    <b>
                        ${recordPro}
                    </b>

                </div>

                <div class="statline">

                    <span>
                        ❤️ Saúde
                    </span>

                    <b>
                        ${Math.round(
                            player.health || 0
                        )}%
                    </b>

                </div>

                <div class="statline">

                    <span>
                        ⚡ Fadiga
                    </span>

                    <b>
                        ${Math.round(
                            player.fatigue || 0
                        )}%
                    </b>

                </div>

                <div class="statline">

                    <span>
                        📅 Calendário
                    </span>

                    <b>
                        ${getWeekText()}
                    </b>

                </div>

            </div>


            <!-- ================================
                 PRÓXIMA LUTA
            ================================= -->

            <div class="card">

                <div class="title">
                    👊 PRÓXIMA LUTA
                </div>

                ${
                    nextFight

                    ?

                    `

                    <div class="statline">

                        <span>
                            Adversário
                        </span>

                        <b>
                            ${
                                nextFight.opponent
                                .displayName
                            }
                        </b>

                    </div>

                    <div class="statline">

                        <span>
                            OVR adversário
                        </span>

                        <b>
                            ${
                                Math.round(
                                    nextFight.opponent
                                    .overall ||
                                    nextFight.opponent
                                    .power ||
                                    0
                                )
                            }
                        </b>

                    </div>

                    <button
                        class="main-button red"
                        onclick="fightScreen()">

                        👊 VER LUTA

                    </button>

                    `

                    :

                    `

                    <p>
                        Nenhuma luta marcada.
                    </p>

                    <button
                        class="main-button"
                        onclick="fightScreen()">

                        🔎 PROCURAR LUTA

                    </button>

                    `
                }

            </div>


            <!-- ================================
                 EQUIPE
            ================================= -->

            <div class="card">

                <div class="statline">

                    <span>
                        🏢 Academia
                    </span>

                    <b>
                        ${
                            team
                            ? team.name
                            : "Nenhuma"
                        }
                    </b>

                </div>

                <div class="statline">

                    <span>
                        👔 Empresário
                    </span>

                    <b>
                        ${
                            manager
                            ? manager.name
                            : "Nenhum"
                        }
                    </b>

                </div>

            </div>


            <!-- ================================
                 MENU PRINCIPAL
            ================================= -->

            <div class="section-title">
                🎮 MENU
            </div>

            <div class="quick-grid">

                <button
                    onclick="career()">

                    🥊

                    <span>
                        CARREIRA
                    </span>

                </button>


                <button
                    onclick="training()">

                    🏋️

                    <span>
                        CAMP
                    </span>

                </button>


                <button
                    onclick="fightScreen()">

                    👊

                    <span>
                        LUTAS
                    </span>

                </button>


                <button
                    onclick="calendarScreen()">

                    📅

                    <span>
                        CALENDÁRIO
                    </span>

                </button>


                <button
                    onclick="teamScreen()">

                    🏢

                    <span>
                        EQUIPE
                    </span>

                </button>


                <button
                    onclick="familyScreen()">

                    ❤️

                    <span>
                        VIDA
                    </span>

                </button>


                <button
                    onclick="rankingScreen()">

                    🏆

                    <span>
                        RANKINGS
                    </span>

                </button>


                <button
                    onclick="attributesScreen()">

                    📊

                    <span>
                        ATRIBUTOS
                    </span>

                </button>

            </div>

        </div>
    `;
}

/* =========================================================
   CALENDÁRIO
========================================================= */

function calendarScreen() {

    if (!player.week) {
        player.week = 1;
    }

    let html = `

        <div class="card">

            <div class="title">
                📅 CALENDÁRIO
            </div>

            <div class="statline">

                <span>
                    Semana atual
                </span>

                <b>
                    ${player.week} / 52
                </b>

            </div>

            <p>
                Acompanhe sua temporada,
                camps, lutas e eventos.
            </p>

        </div>

    `;

    for (let i = 1; i <= 52; i++) {

        let status =
            i === player.week
            ? "📍 SEMANA ATUAL"
            : i < player.week
            ? "✅ CONCLUÍDA"
            : "🔒 FUTURA";

        html += `

            <div class="card">

                <div class="statline">

                    <span>
                        📅 Semana ${i}
                    </span>

                    <b>
                        ${status}
                    </b>

                </div>

            </div>
        `;
    }

    html += backHomeButton();

    document
        .getElementById("content")
        .innerHTML = html;
}

/* =========================================================
   ATRIBUTOS
========================================================= */

function attributesScreen() {

    const a =
        player.attributes || {};

    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">
                📊 ATRIBUTOS
            </div>

            <div class="statline">
                <span>OVR</span>
                <b>${getOverall()}</b>
            </div>

            <div class="statline">
                <span>Potencial</span>
                <b>${getPotential()}</b>
            </div>

        </div>

        <div class="card">

            <div class="title">
                🥊 MMA
            </div>

            <div class="statline">
                <span>💪 Força</span>
                <b>${Math.round(a.strength || 0)}</b>
            </div>

            <div class="statline">
                <span>👊 Striking</span>
                <b>${Math.round(a.striking || 0)}</b>
            </div>

            <div class="statline">
                <span>🤼 Wrestling</span>
                <b>${Math.round(a.wrestling || 0)}</b>
            </div>

            <div class="statline">
                <span>🥋 Grappling</span>
                <b>${Math.round(a.grappling || 0)}</b>
            </div>

            <div class="statline">
                <span>🏃 Cardio</span>
                <b>${Math.round(a.cardio || 0)}</b>
            </div>

            <div class="statline">
                <span>🎯 Técnica</span>
                <b>${Math.round(a.technique || 0)}</b>
            </div>

            <div class="statline">
                <span>🛡️ Defesa</span>
                <b>${Math.round(a.defense || 0)}</b>
            </div>

            <div class="statline">
                <span>🧠 Fight IQ</span>
                <b>${Math.round(a.fightIQ || 0)}</b>
            </div>

            <div class="statline">
                <span>🧠 Mental</span>
                <b>${Math.round(a.mental || 0)}</b>
            </div>

            <div class="statline">
                <span>🔥 Confiança</span>
                <b>${Math.round(a.confidence || 0)}</b>
            </div>

        </div>

        ${backHomeButton()}
    `;
}

/* =========================================================
   AVANÇAR SEMANA
========================================================= */

function nextWeek() {

    if (player.week >= 52) {

        player.week = 1;

        player.age++;

    } else {

        player.week++;

    }

    /*
     * Recuperação semanal.
     */

    player.fatigue =
        Math.max(
            0,
            (player.fatigue || 0) - 20
        );

    player.health =
        Math.min(
            100,
            (player.health || 100) + 10
        );

    save();

    home();
}

/* =========================================================
   DESCANSAR
========================================================= */

function rest() {

    player.fatigue =
        Math.max(
            0,
            (player.fatigue || 0) - 15
        );

    player.health =
        Math.min(
            100,
            (player.health || 100) + 5
        );

    /*
     * DESCANSAR NÃO VOLTA PARA O INÍCIO.
     *
     * Avança uma semana.
     */

    nextWeek();
}

/* =========================================================
   TREINAMENTO
========================================================= */

function training() {

    const a =
        player.attributes || {};

    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">
                🏋️ CAMP / TREINAMENTO
            </div>

            <div class="statline">

                <span>
                    Semana
                </span>

                <b>
                    ${getWeek()} / 52
                </b>

            </div>

            <div class="statline">

                <span>
                    OVR
                </span>

                <b>
                    ${getOverall()}
                </b>

            </div>

            <div class="statline">

                <span>
                    Potencial
                </span>

                <b>
                    ${getPotential()}
                </b>

            </div>

        </div>

        <div class="card">

            <div class="title">
                📋 PROGRAMAÇÃO
            </div>

            <p>
                Escolha como será seu treino
                nesta semana.
            </p>

            <button
                onclick="scheduleTraining('strength')">

                💪 Força

            </button>

            <button
                onclick="scheduleTraining('striking')">

                👊 Striking

            </button>

            <button
                onclick="scheduleTraining('wrestling')">

                🤼 Wrestling

            </button>

            <button
                onclick="scheduleTraining('grappling')">

                🥋 Grappling

            </button>

            <button
                onclick="scheduleTraining('cardio')">

                🏃 Cardio

            </button>

            <button
                onclick="scheduleTraining('technique')">

                🎯 Técnica

            </button>

            <button
                onclick="scheduleTraining('defense')">

                🛡️ Defesa

            </button>

            <button
                onclick="scheduleTraining('auto')">

                🎲 TREINO AUTOMÁTICO

            </button>

            <button
                class="gray"
                onclick="rest()">

                😴 DESCANSAR E AVANÇAR SEMANA

            </button>

        </div>

        ${backHomeButton()}
    `;
}

/* =========================================================
   PROGRAMAR TREINO
========================================================= */

function scheduleTraining(type) {

    player.trainingPlan =
        player.trainingPlan || [];

    player.trainingPlan.push({

        week:
            player.week,

        type:
            type

    });

    /*
     * Evolução pequena.
     */

    const attributeMap = {

        strength: "strength",
        striking: "striking",
        wrestling: "wrestling",
        grappling: "grappling",
        cardio: "cardio",
        technique: "technique",
        defense: "defense"

    };

    if (type === "auto") {

        const keys =
            Object.keys(attributeMap);

        type =
            keys[
                Math.floor(
                    Math.random() *
                    keys.length
                )
            ];
    }

    const attribute =
        attributeMap[type];

    if (
        attribute &&
        player.attributes
    ) {

        /*
         * Evolução entre 0.50 e 0.90.
         */

        const evolution =
            Number(
                (
                    0.50 +
                    Math.random() * 0.40
                ).toFixed(2)
            );

        player.attributes[attribute] =
            Math.min(
                player.potential || 96,
                (
                    player.attributes[attribute] ||
                    60
                ) + evolution
            );
    }

    player.fatigue =
        Math.min(
            100,
            (player.fatigue || 0) + 8
        );

    save();

    alert(
        "🏋️ Treino programado!\n\n" +
        "Evolução: +" +
        (
            0.50 +
            Math.random() * 0.40
        ).toFixed(2)
    );

    training();
}

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

load();

setTimeout(function () {

    if (
        typeof player !== "undefined" &&
        player &&
        player.name
    ) {

        /*
         * Garante dados novos
         * em jogadores antigos.
         */

        if (!player.week) {
            player.week = 1;
        }

        if (!player.potential) {
            player.potential =
                Math.floor(
                    Math.random() * 19
                ) + 78;
        }

        home();

    } else {

        startGame();

    }

}, 100);
