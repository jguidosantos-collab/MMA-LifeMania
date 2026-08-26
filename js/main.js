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

/* =========================
   TREINAMENTO / CAMP
========================= */

function training() {

    const content = document.getElementById("content");

    if (!content) return;

    player.week = player.week || 1;
    player.year = player.year || 1;

    player.trainingPlan = player.trainingPlan || {
        weeks: {},
        automatic: true
    };

    const currentWeek =
        player.trainingPlan.weeks[player.week] || [];

    content.innerHTML = `

        <div class="card">

            <div class="title">
                🏋️ CAMP DE TREINAMENTO
            </div>

            <div class="statline">
                <span>Temporada</span>
                <b>Ano ${player.year}</b>
            </div>

            <div class="statline">
                <span>Semana</span>
                <b>${player.week} / 52</b>
            </div>

            <div class="statline">
                <span>OVR</span>
                <b>${getOverall()}</b>
            </div>

            <div class="statline">
                <span>Potencial</span>
                <b>${player.potential || 90}</b>
            </div>

        </div>


        <div class="card">

            <div class="title">
                📅 PLANO DA SEMANA ${player.week}
            </div>

            ${
                currentWeek.length > 0

                ?

                currentWeek.map(treino => `

                    <div class="statline">

                        <span>
                            ${treino.icon} ${treino.name}
                        </span>

                        <b>
                            +${Number(treino.gain || 0).toFixed(2)}
                        </b>

                    </div>

                `).join("")

                :

                `
                    <p>
                        Nenhum treino programado.
                    </p>
                `
            }

        </div>


        <div class="card">

            <div class="title">
                🎯 PROGRAMAÇÃO
            </div>

            <button
                class="green"
                onclick="generateTrainingPlan()">

                🎲 GERAR CAMP AUTOMÁTICO

            </button>

            <button
                onclick="programTraining()">

                ✏️ PROGRAMAR TREINO

            </button>

            <button
                class="gray"
                onclick="nextWeek()">

                ⏭️ PRÓXIMA SEMANA

            </button>

        </div>


        <div class="card">

            <div class="title">
                ❤️ CONDIÇÃO
            </div>

            <div class="statline">

                <span>
                    Saúde
                </span>

                <b>
                    ${Math.round(player.health || 0)}%
                </b>

            </div>

            <div class="statline">

                <span>
                    Fadiga
                </span>

                <b>
                    ${Math.round(player.fatigue || 0)}%
                </b>

            </div>

        </div>

    `;
}


/* =========================
   OVERALL
========================= */

function getOverall() {

    const a = player.attributes || {};

    const values = [

        a.strength || 50,
        a.striking || 50,
        a.wrestling || 50,
        a.grappling || 50,
        a.cardio || 50,
        a.technique || 50,
        a.defense || 50,
        a.fightIQ || 50

    ];

    const total =
        values.reduce(
            (sum, value) => sum + value,
            0
        );

    return Math.round(
        total / values.length
    );
}


/* =========================
   GERAR CAMP AUTOMÁTICO
========================= */

function generateTrainingPlan() {

    player.week = player.week || 1;

    player.trainingPlan =
        player.trainingPlan || {
            weeks: {},
            automatic: true
        };

    const options = [

        {
            name: "Força",
            icon: "💪",
            attribute: "strength"
        },

        {
            name: "Striking",
            icon: "🥊",
            attribute: "striking"
        },

        {
            name: "Wrestling",
            icon: "🤼",
            attribute: "wrestling"
        },

        {
            name: "Grappling",
            icon: "🥋",
            attribute: "grappling"
        },

        {
            name: "Cardio",
            icon: "🏃",
            attribute: "cardio"
        },

        {
            name: "Técnica",
            icon: "🎯",
            attribute: "technique"
        },

        {
            name: "Defesa",
            icon: "🛡️",
            attribute: "defense"
        },

        {
            name: "Fight IQ",
            icon: "🧠",
            attribute: "fightIQ"
        }

    ];

    const selected = [];

    for (let i = 0; i < 3; i++) {

        const treino =
            options[
                Math.floor(
                    Math.random() * options.length
                )
            ];

        selected.push({

            name: treino.name,

            icon: treino.icon,

            attribute: treino.attribute,

            gain: Number(
                (
                    0.40 +
                    Math.random() * 0.70
                ).toFixed(2)
            )

        });

    }

    player.trainingPlan.weeks[player.week] =
        selected;

    player.trainingPlan.automatic = true;

    save();

    training();
}


/* =========================
   PROGRAMAR TREINO
========================= */

function programTraining() {

    const options = [

        ["strength", "💪 Força"],
        ["striking", "🥊 Striking"],
        ["wrestling", "🤼 Wrestling"],
        ["grappling", "🥋 Grappling"],
        ["cardio", "🏃 Cardio"],
        ["technique", "🎯 Técnica"],
        ["defense", "🛡️ Defesa"],
        ["fightIQ", "🧠 Fight IQ"]

    ];

    let html = `

        <div class="card">

            <div class="title">
                ✏️ PROGRAMAR TREINO
            </div>

            <p>
                Escolha os treinos desta semana.
            </p>

    `;

    options.forEach(option => {

        html += `

            <button
                onclick="addTraining('${option[0]}')">

                ${option[1]}

            </button>

        `;

    });

    html += `

            <button
                class="gray"
                onclick="training()">

                ← VOLTAR

            </button>

        </div>

    `;

    document.getElementById("content").innerHTML =
        html;
}


/* =========================
   ADICIONAR TREINO
========================= */

function addTraining(attribute) {

    const names = {

        strength: ["💪", "Força"],
        striking: ["🥊", "Striking"],
        wrestling: ["🤼", "Wrestling"],
        grappling: ["🥋", "Grappling"],
        cardio: ["🏃", "Cardio"],
        technique: ["🎯", "Técnica"],
        defense: ["🛡️", "Defesa"],
        fightIQ: ["🧠", "Fight IQ"]

    };

    const data = names[attribute];

    if (!data) return;

    player.trainingPlan =
        player.trainingPlan || {
            weeks: {},
            automatic: false
        };

    player.trainingPlan.weeks[player.week] =
        player.trainingPlan.weeks[player.week] || [];

    player.trainingPlan.weeks[player.week].push({

        name: data[1],

        icon: data[0],

        attribute: attribute,

        gain: Number(
            (
                0.40 +
                Math.random() * 0.70
            ).toFixed(2)
        )

    });

    player.trainingPlan.automatic = false;

    save();

    training();
}


/* =========================
   PRÓXIMA SEMANA
========================= */

function nextWeek() {

    player.week = player.week || 1;
    player.year = player.year || 1;

    const plan =
        player.trainingPlan &&
        player.trainingPlan.weeks
        ?
        player.trainingPlan.weeks[player.week]
        :
        [];

    /*
     * APLICA OS TREINOS DA SEMANA
     */

    if (plan && plan.length) {

        player.attributes =
            player.attributes || {};

        plan.forEach(treino => {

            const attribute =
                treino.attribute;

            if (
                typeof player.attributes[attribute]
                !== "number"
            ) {

                player.attributes[attribute] = 50;

            }

            const potential =
                player.potential || 90;

            const current =
                player.attributes[attribute];

            if (current < potential) {

                const room =
                    potential - current;

                const gain =
                    Math.min(
                        Number(treino.gain || 0),
                        room
                    );

                player.attributes[attribute] =
                    Number(
                        (
                            current + gain
                        ).toFixed(2)
                    );

            }

        });

    }


    /*
     * RECUPERAÇÃO
     */

    player.fatigue =
        Math.max(
            0,
            (player.fatigue || 0) - 10
        );

    player.health =
        Math.min(
            100,
            (player.health || 100) + 3
        );


    /*
     * AVANÇA A SEMANA
     */

    player.week++;


    /*
     * NOVO ANO
     */

    if (player.week > 52) {

        player.week = 1;

        player.year++;

        player.log =
            player.log || [];

        player.log.unshift(
            `🎆 Começou o Ano ${player.year}.`
        );

    }


    save();


    /*
     * NÃO VOLTA PARA A TELA INICIAL.
     * CONTINUA NO CAMP.
     */

    training();

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
/* =========================
   REINICIAR JOGO
========================= */

function resetGame() {

    const confirmar = confirm(
        "⚠️ REINICIAR JOGO?\n\n" +
        "Todo o progresso do lutador será apagado.\n\n" +
        "Essa ação não pode ser desfeita."
    );

    if (!confirmar) {
        return;
    }

    localStorage.clear();

    location.reload();
}
