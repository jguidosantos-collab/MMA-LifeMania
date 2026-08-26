/* =========================================================
   MMA LIFE
   MAIN.JS — VERSÃO LIMPA
========================================================= */

/* =========================================================
   ESTADO DO JOGADOR
========================================================= */

let player = {
    name: "",
    country: "Brasil",
    weight: "Peso Leve",
    style: "Completo",

    age: 18,
    year: 1,
    week: 1,

    money: 0,
    fame: 0,

    health: 100,
    fatigue: 0,

    potential: 90,

    careerStage: "amateur",

    relationship: "Solteiro",
    married: false,

    children: [],

    team: null,
    manager: null,

    nextFight: null,

    currentPromotion: null,
    currentContract: null,

    championship: {
        title: null,
        defenses: 0
    },

    amateur: {
        wins: 0,
        losses: 0,
        draws: 0
    },

    professional: {
        active: false,
        wins: 0,
        losses: 0,
        draws: 0
    },

    attributes: {
        strength: 50,
        striking: 50,
        wrestling: 50,
        grappling: 50,
        cardio: 50,
        technique: 50,
        defense: 50,
        fightIQ: 50,
        chin: 50,
        offense: 50
    },

    trainingPlan: {
        weeks: {},
        automatic: false
    },

    log: []
};


/* =========================================================
   SALVAR
========================================================= */

function save() {

    localStorage.setItem(
        "mmaLifePlayer",
        JSON.stringify(player)
    );

}


/* =========================================================
   CARREGAR
========================================================= */

function load() {

    const saved =
        localStorage.getItem("mmaLifePlayer");

    if (!saved) {
        return;
    }

    try {

        const data =
            JSON.parse(saved);

        player = {
            ...player,
            ...data,

            attributes: {
                ...player.attributes,
                ...(data.attributes || {})
            },

            amateur: {
                ...player.amateur,
                ...(data.amateur || {})
            },

            professional: {
                ...player.professional,
                ...(data.professional || {})
            },

            championship: {
                ...player.championship,
                ...(data.championship || {})
            },

            trainingPlan: {
                ...player.trainingPlan,
                ...(data.trainingPlan || {})
            }
        };

    } catch (error) {

        console.error(
            "Erro ao carregar jogo:",
            error
        );

    }

}


/* =========================================================
   RESETAR JOGO
========================================================= */

function resetGame() {

    const confirmation =
        confirm(
            "Tem certeza que deseja apagar sua carreira?\n\n" +
            "Todo o progresso será perdido."
        );

    if (!confirmation) {
        return;
    }

    localStorage.removeItem(
        "mmaLifePlayer"
    );

    player = {
        name: "",
        country: "Brasil",
        weight: "Peso Leve",
        style: "Completo",

        age: 18,
        year: 1,
        week: 1,

        money: 0,
        fame: 0,

        health: 100,
        fatigue: 0,

        potential: 90,

        careerStage: "amateur",

        relationship: "Solteiro",
        married: false,

        children: [],

        team: null,
        manager: null,

        nextFight: null,

        currentPromotion: null,
        currentContract: null,

        championship: {
            title: null,
            defenses: 0
        },

        amateur: {
            wins: 0,
            losses: 0,
            draws: 0
        },

        professional: {
            active: false,
            wins: 0,
            losses: 0,
            draws: 0
        },

        attributes: {
            strength: 50,
            striking: 50,
            wrestling: 50,
            grappling: 50,
            cardio: 50,
            technique: 50,
            defense: 50,
            fightIQ: 50,
            chin: 50,
            offense: 50
        },

        trainingPlan: {
            weeks: {},
            automatic: false
        },

        log: []
    };

    startGame();

}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function tab(name) {

    switch (name) {

        case "home":
            home();
            break;

        case "career":
            career();
            break;

        case "train":
            training();
            break;

        case "fight":
            fightScreen();
            break;

        case "team":
            teamScreen();
            break;

        case "life":
            familyScreen();
            break;

        case "ranking":
            rankingScreen();
            break;

        default:
            home();

    }

}


/* =========================================================
   INÍCIO / TELA DE CRIAÇÃO
========================================================= */

function startGame() {

    const content =
        document.getElementById("content");

    if (!content) {
        return;
    }

    content.innerHTML = `

        <div class="card start-card">

            <div class="title">
                🥊 MMA LIFE
            </div>

            <p>
                Construa sua carreira.
                Treine.
                Lute.
                Conquiste títulos.
                Crie seu legado.
            </p>

            <div class="statline">
                <span>Início</span>
                <b>18 anos</b>
            </div>

            <div class="statline">
                <span>Overall inicial</span>
                <b>${getOverall()}</b>
            </div>

            <div class="statline">
                <span>Potencial</span>
                <b>${player.potential}</b>
            </div>

            <button
                class="green"
                onclick="openCharacterCreation()">

                🆕 CRIAR NOVO LUTADOR

            </button>

            ${
                player.name
                ?
                `
                <button
                    onclick="home()">

                    ▶️ CONTINUAR CARREIRA

                </button>
                `
                :
                ""
            }

        </div>

    `;

}


/* =========================================================
   CRIAÇÃO DO LUTADOR
========================================================= */

function openCharacterCreation() {

    const content =
        document.getElementById("content");

    if (!content) {
        return;
    }

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

                <option>Brasil</option>
                <option>Estados Unidos</option>
                <option>Japão</option>
                <option>México</option>
                <option>Argentina</option>
                <option>Canadá</option>
                <option>Rússia</option>
                <option>Reino Unido</option>

            </select>

            <select id="weight">

                <option>Peso Leve</option>
                <option>Peso Meio-Médio</option>
                <option>Peso Médio</option>
                <option>Peso Meio-Pesado</option>
                <option>Peso Pesado</option>

            </select>

            <select id="style">

                <option>Completo</option>
                <option>Striker</option>
                <option>Wrestler</option>
                <option>Grappler</option>

            </select>

            <button
                class="green"
                onclick="createPlayerFromScreen()">

                ✅ COMEÇAR CARREIRA

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

    const nameInput =
        document.getElementById("playerName");

    if (!nameInput) {
        return;
    }

    const name =
        nameInput.value.trim();

    if (!name) {

        alert(
            "Digite o nome do lutador."
        );

        return;

    }

    player.name =
        name;

    player.country =
        document.getElementById("country").value;

    player.weight =
        document.getElementById("weight").value;

    player.style =
        document.getElementById("style").value;

    player.age = 18;
    player.year = 1;
    player.week = 1;

    player.money = 0;
    player.fame = 0;

    player.health = 100;
    player.fatigue = 0;

    player.potential =
        78 +
        Math.floor(
            Math.random() * 19
        );

    player.careerStage =
        "amateur";

    player.professional.active =
        false;

    player.log = [];

    player.trainingPlan = {
        weeks: {},
        automatic: false
    };

    player.log.unshift(
        "🥊 Sua carreira começou."
    );

    save();

    home();

}


/* =========================================================
   OVERALL
========================================================= */

function getOverall() {

    const a =
        player.attributes || {};

    const values = [

        a.strength || 50,
        a.striking || 50,
        a.wrestling || 50,
        a.grappling || 50,
        a.cardio || 50,
        a.technique || 50,
        a.defense || 50,
        a.fightIQ || 50,
        a.chin || 50,
        a.offense || 50

    ];

    const total =
        values.reduce(
            (sum, value) =>
                sum + Number(value),
            0
        );

    return Math.round(
        total / values.length
    );

}


/* =========================================================
   POTENCIAL
========================================================= */

function getPotential() {

    return player.potential || 90;

}


/* =========================================================
   RANKING
========================================================= */

function rankingText() {

    const overall =
        getOverall();

    if (overall >= 90) {
        return "#1";
    }

    if (overall >= 85) {
        return "#5";
    }

    if (overall >= 80) {
        return "#15";
    }

    if (overall >= 75) {
        return "#30";
    }

    return "Sem ranking";

}


/* =========================================================
   HOME
========================================================= */

function home() {

    const content =
        document.getElementById("content");

    if (!content) {
        return;
    }

    if (!player.name) {

        startGame();

        return;

    }

    const pro =
        player.professional || {};

    const amateur =
        player.amateur || {};

    const recordPro =
        `${pro.wins || 0}-${pro.losses || 0}-${pro.draws || 0}`;

    const recordAmateur =
        `${amateur.wins || 0}-${amateur.losses || 0}-${amateur.draws || 0}`;

    content.innerHTML = `

        <div class="home-container">

            <div class="fighter-header">

                <div class="fighter-avatar">
                    🥊
                </div>

                <div class="fighter-info">

                    <div class="fighter-name">
                        ${player.name}
                    </div>

                    <div>
                        🇧🇷 ${player.country}
                    </div>

                    <div>
                        ${player.weight}
                    </div>

                </div>

            </div>


            <div class="stats-grid">

                <div class="stat-card">
                    <span>IDADE</span>
                    <strong>${player.age}</strong>
                </div>

                <div class="stat-card">
                    <span>OVR</span>
                    <strong>${getOverall()}</strong>
                </div>

                <div class="stat-card">
                    <span>POTENCIAL</span>
                    <strong>${getPotential()}</strong>
                </div>

                <div class="stat-card">
                    <span>FAMA</span>
                    <strong>${Math.round(player.fame)}</strong>
                </div>

                <div class="stat-card">
                    <span>DINHEIRO</span>
                    <strong>$${Math.round(player.money)}</strong>
                </div>

                <div class="stat-card">
                    <span>SEMANA</span>
                    <strong>${player.week}/52</strong>
                </div>

            </div>


            <div class="card">

                <div class="title">
                    🏆 CARREIRA
                </div>

                <div class="statline">
                    <span>Status</span>
                    <b>
                        ${
                            player.professional.active
                            ? "Profissional"
                            : "Amador"
                        }
                    </b>
                </div>

                <div class="statline">
                    <span>Estágio</span>
                    <b>${player.careerStage}</b>
                </div>

                <div class="statline">
                    <span>Profissional</span>
                    <b>${recordPro}</b>
                </div>

                <div class="statline">
                    <span>Amador</span>
                    <b>${recordAmateur}</b>
                </div>

            </div>


            <div class="card">

                <div class="title">
                    📅 CALENDÁRIO
                </div>

                <div class="statline">
                    <span>Ano</span>
                    <b>${player.year}</b>
                </div>

                <div class="statline">
                    <span>Semana atual</span>
                    <b>${player.week}/52</b>
                </div>

                <button
                    onclick="calendarScreen()">

                    📅 ABRIR CALENDÁRIO

                </button>

            </div>


            <div class="card">

                <div class="title">
                    👊 PRÓXIMA LUTA
                </div>

                ${
                    player.nextFight
                    ?
                    `
                    <div class="statline">
                        <span>Adversário</span>
                        <b>
                            ${player.nextFight.opponent.name}
                        </b>
                    </div>

                    <div class="statline">
                        <span>OVR</span>
                        <b>
                            ${player.nextFight.opponent.overall}
                        </b>
                    </div>

                    <button
                        class="green"
                        onclick="fightScreen()">

                        🔥 VER LUTA

                    </button>
                    `
                    :
                    `
                    <p>
                        Nenhuma luta marcada.
                    </p>

                    <button
                        onclick="findFight()">

                        🔎 PROCURAR LUTA

                    </button>
                    `
                }

            </div>


            <div class="card">

                <div class="title">
                    ❤️ CONDIÇÃO
                </div>

                <div class="statline">
                    <span>Saúde</span>
                    <b>${Math.round(player.health)}%</b>
                </div>

                <div class="statline">
                    <span>Fadiga</span>
                    <b>${Math.round(player.fatigue)}%</b>
                </div>

            </div>


            <div class="card">

                <div class="title">
                    🧭 MENU
                </div>

                <button onclick="career()">
                    🏆 CARREIRA
                </button>

                <button onclick="training()">
                    🏋️ TREINO / CAMP
                </button>

                <button onclick="fightScreen()">
                    👊 LUTAS
                </button>

                <button onclick="teamScreen()">
                    🏢 EQUIPE
                </button>

                <button onclick="familyScreen()">
                    ❤️ VIDA
                </button>

                <button onclick="rankingScreen()">
                    🏆 RANKING
                </button>

                <button onclick="calendarScreen()">
                    📅 CALENDÁRIO
                </button>

            </div>


            <div class="card">

                <div class="title">
                    ⚙️ JOGO
                </div>

                <button
                    class="gray"
                    onclick="resetGame()">

                    🔄 REINICIAR JOGO

                </button>

            </div>

        </div>

    `;

}


/* =========================================================
   TREINAMENTO
========================================================= */

function training() {

    const content =
        document.getElementById("content");

    if (!content) {
        return;
    }

    player.trainingPlan =
        player.trainingPlan || {
            weeks: {},
            automatic: false
        };

    const plan =
        player.trainingPlan.weeks[player.week] || [];

    content.innerHTML = `

        <div class="card">

            <div class="title">
                🏋️ CAMP DE TREINAMENTO
            </div>

            <div class="statline">
                <span>Semana</span>
                <b>${player.week}/52</b>
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
                📋 TREINO DA SEMANA
            </div>

            ${
                plan.length
                ?
                plan.map(
                    treino => `

                    <div class="statline">

                        <span>
                            ${treino.icon}
                            ${treino.name}
                        </span>

                        <b>
                            +${Number(treino.gain).toFixed(2)}
                        </b>

                    </div>

                    `
                ).join("")
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

                ✏️ PROGRAMAR MANUALMENTE

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
                <span>Saúde</span>
                <b>${Math.round(player.health)}%</b>
            </div>

            <div class="statline">
                <span>Fadiga</span>
                <b>${Math.round(player.fatigue)}%</b>
            </div>

        </div>

    `;

}


/* =========================================================
   GERAR CAMP AUTOMÁTICO
========================================================= */

function generateTrainingPlan() {

    const options = [

        ["strength", "💪", "Força"],
        ["striking", "🥊", "Striking"],
        ["wrestling", "🤼", "Wrestling"],
        ["grappling", "🥋", "Grappling"],
        ["cardio", "🏃", "Cardio"],
        ["technique", "🎯", "Técnica"],
        ["defense", "🛡️", "Defesa"],
        ["fightIQ", "🧠", "Fight IQ"],
        ["chin", "🗿", "Queixo"],
        ["offense", "🔥", "Ofensiva"]

    ];

    player.trainingPlan.weeks[player.week] = [];

    for (let i = 0; i < 4; i++) {

        const selected =
            options[
                Math.floor(
                    Math.random() *
                    options.length
                )
            ];

        player.trainingPlan.weeks[player.week].push({

            attribute: selected[0],
            icon: selected[1],
            name: selected[2],

            gain:
                Number(
                    (
                        0.50 +
                        Math.random() * 0.50
                    ).toFixed(2)
                )

        });

    }

    player.trainingPlan.automatic = true;

    save();

    training();

}


/* =========================================================
   PROGRAMAÇÃO MANUAL
========================================================= */

function programTraining() {

    const options = [

        ["strength", "💪 Força"],
        ["striking", "🥊 Striking"],
        ["wrestling", "🤼 Wrestling"],
        ["grappling", "🥋 Grappling"],
        ["cardio", "🏃 Cardio"],
        ["technique", "🎯 Técnica"],
        ["defense", "🛡️ Defesa"],
        ["fightIQ", "🧠 Fight IQ"],
        ["chin", "🗿 Queixo"],
        ["offense", "🔥 Ofensiva"]

    ];

    let html = `

        <div class="card">

            <div class="title">
                ✏️ PROGRAMAR SEMANA ${player.week}
            </div>

            <p>
                Escolha os treinos da semana.
            </p>

    `;

    options.forEach(
        option => {

            html += `

                <button
                    onclick="addTraining('${option[0]}')">

                    ${option[1]}

                </button>

            `;

        }
    );

    html += `

            <button
                class="gray"
                onclick="training()">

                ← VOLTAR

            </button>

        </div>

    `;

    document
        .getElementById("content")
        .innerHTML = html;

}


/* =========================================================
   ADICIONAR TREINO
========================================================= */

function addTraining(attribute) {

    const names = {

        strength: ["💪", "Força"],
        striking: ["🥊", "Striking"],
        wrestling: ["🤼", "Wrestling"],
        grappling: ["🥋", "Grappling"],
        cardio: ["🏃", "Cardio"],
        technique: ["🎯", "Técnica"],
        defense: ["🛡️", "Defesa"],
        fightIQ: ["🧠", "Fight IQ"],
        chin: ["🗿", "Queixo"],
        offense: ["🔥", "Ofensiva"]

    };

    const data =
        names[attribute];

    if (!data) {
        return;
    }

    player.trainingPlan.weeks[player.week] =
        player.trainingPlan.weeks[player.week] || [];

    if (
        player.trainingPlan.weeks[player.week].length >= 5
    ) {

        alert(
            "Você pode programar no máximo 5 treinos por semana."
        );

        return;

    }

    player.trainingPlan.weeks[player.week].push({

        attribute: attribute,
        icon: data[0],
        name: data[1],

        gain:
            Number(
                (
                    0.50 +
                    Math.random() * 0.50
                ).toFixed(2)
            )

    });

    save();

    training();

}


/* =========================================================
   PRÓXIMA SEMANA
========================================================= */

function nextWeek() {

    const plan =
        player.trainingPlan &&
        player.trainingPlan.weeks
        ?
        player.trainingPlan.weeks[player.week]
        :
        [];

    if (plan && plan.length) {

        plan.forEach(
            treino => {

                const attr =
                    treino.attribute;

                const current =
                    Number(
                        player.attributes[attr] || 50
                    );

                const potential =
                    Number(
                        player.potential || 90
                    );

                if (current < potential) {

                    const room =
                        potential - current;

                    const gain =
                        Math.min(
                            Number(treino.gain),
                            room
                        );

                    player.attributes[attr] =
                        Number(
                            (
                                current + gain
                            ).toFixed(2)
                        );

                }

            }
        );

    }

    player.fatigue =
        Math.max(
            0,
            Number(player.fatigue || 0) - 8
        );

    player.health =
        Math.min(
            100,
            Number(player.health || 100) + 2
        );

    player.week++;

    if (player.week > 52) {

        player.week = 1;
        player.year++;

        player.age++;

        player.log.unshift(
            `🎆 Começou o Ano ${player.year}.`
        );

    }

    save();

    training();

}


/* =========================================================
   CALENDÁRIO
========================================================= */

function calendarScreen() {

    let html = `

        <div class="card">

            <div class="title">
                📅 CALENDÁRIO DA TEMPORADA
            </div>

            <div class="statline">
                <span>Ano</span>
                <b>${player.year}</b>
            </div>

            <div class="statline">
                <span>Semana atual</span>
                <b>${player.week}</b>
            </div>

        </div>

        <div class="card">

            <div class="title">
                🗓️ 52 SEMANAS
            </div>

    `;

    for (let i = 1; i <= 52; i++) {

        const current =
            i === player.week;

        html += `

            <button
                onclick="goToWeek(${i})"
                ${current ? 'class="green"' : ''}>

                ${current ? "👉 " : ""}
                SEMANA ${i}

            </button>

        `;

    }

    html += `

        </div>

    `;

    document
        .getElementById("content")
        .innerHTML = html;

}


/* =========================================================
   IR PARA SEMANA
========================================================= */

function goToWeek(week) {

    if (week < player.week) {

        alert(
            "Você não pode voltar para uma semana passada."
        );

        return;

    }

    if (week === player.week) {

        training();

        return;

    }

    const weeks =
        week - player.week;

    if (weeks > 1) {

        alert(
            "Avance uma semana por vez para que o calendário e os treinos sejam processados corretamente."
        );

        return;

    }

    nextWeek();

}


/* =========================================================
   CARREIRA
========================================================= */

function career() {

    const pro =
        player.professional;

    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">
                🏆 CARREIRA
            </div>

            <div class="statline">
                <span>Status</span>
                <b>
                    ${
                        pro.active
                        ? "Profissional"
                        : "Amador"
                    }
                </b>
            </div>

            <div class="statline">
                <span>Estágio</span>
                <b>${player.careerStage}</b>
            </div>

            <div class="statline">
                <span>OVR</span>
                <b>${getOverall()}</b>
            </div>

            <div class="statline">
                <span>Potencial</span>
                <b>${getPotential()}</b>
            </div>

            <div class="statline">
                <span>Vitórias</span>
                <b>${pro.wins}</b>
            </div>

            <div class="statline">
                <span>Derrotas</span>
                <b>${pro.losses}</b>
            </div>

            <div class="statline">
                <span>Fama</span>
                <b>${Math.round(player.fame)}</b>
            </div>

        </div>


        <div class="card">

            <div class="title">
                🥊 VIRAR PROFISSIONAL
            </div>

            ${
                pro.active
                ?
                `
                <p>
                    Você já é profissional.
                </p>
                `
                :
                `
                <button
                    class="green"
                    onclick="turnProfessional()">

                    🥊 VIRAR PROFISSIONAL

                </button>
                `
            }

        </div>

    `;

}


/* =========================================================
   PROFISSIONAL
========================================================= */

function turnProfessional() {

    if (player.age < 18) {

        alert(
            "Você precisa ter 18 anos."
        );

        return;

    }

    if (player.professional.active) {

        alert(
            "Você já é profissional."
        );

        return;

    }

    player.professional.active =
        true;

    player.careerStage =
        "regional";

    player.log.unshift(
        "🥊 Você se tornou profissional."
    );

    save();

    alert(
        "Parabéns! Você agora é um lutador profissional."
    );

    career();

}


/* =========================================================
   LUTAS
========================================================= */

function fightScreen() {

    const fight =
        player.nextFight;

    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">
                👊 LUTAS
            </div>

            ${
                fight
                ?
                `

                <div class="statline">
                    <span>Adversário</span>
                    <b>${fight.opponent.name}</b>
                </div>

                <div class="statline">
                    <span>OVR</span>
                    <b>${fight.opponent.overall}</b>
                </div>

                <div class="statline">
                    <span>Estilo</span>
                    <b>${fight.opponent.style}</b>
                </div>

                <div class="statline">
                    <span>Evento</span>
                    <b>${fight.event}</b>
                </div>

                <button
                    class="green"
                    onclick="fight()">

                    🔥 LUTAR AGORA

                </button>

                `
                :
                `

                <p>
                    Nenhuma luta marcada.
                </p>

                <button
                    onclick="findFight()">

                    🔎 PROCURAR ADVERSÁRIO

                </button>

                `
            }

        </div>

    `;

}


/* =========================================================
   GERAR ADVERSÁRIO
========================================================= */

function findFight() {

    const opponentOverall =
        Math.max(
            50,
            getOverall() +
            Math.floor(
                Math.random() * 11
            ) - 5
        );

    const names = [

        "Carlos Silva",
        "Lucas Santos",
        "Miguel Costa",
        "Rafael Oliveira",
        "Diego Souza",
        "Bruno Almeida",
        "André Ferreira",
        "Gabriel Lima"

    ];

    const opponent = {

        name:
            names[
                Math.floor(
                    Math.random() *
                    names.length
                )
            ],

        overall:
            opponentOverall,

        style:
            [
                "Striker",
                "Wrestler",
                "Grappler",
                "Completo"
            ][
                Math.floor(
                    Math.random() * 4
                )
            ]

    };

    player.nextFight = {

        opponent: opponent,

        event:
            "Evento MMA Life",

        purse:
            500 +
            Math.floor(
                Math.random() * 1500
            )

    };

    save();

    fightScreen();

}


/* =========================================================
   LUTAR
========================================================= */

function fight() {

    if (!player.nextFight) {

        findFight();

        return;

    }

    const myPower =
        getOverall() +
        Math.random() * 20;

    const enemyPower =
        player.nextFight.opponent.overall +
        Math.random() * 20;

    const won =
        myPower >= enemyPower;

    if (won) {

        player.professional.wins++;

        player.money +=
            player.nextFight.purse;

        player.fame += 2;

        player.log.unshift(
            `🔥 Vitória sobre ${player.nextFight.opponent.name}.`
        );

        alert(
            "🔥 VITÓRIA!"
        );

    } else {

        player.professional.losses++;

        player.fame =
            Math.max(
                0,
                player.fame - 1
            );

        player.log.unshift(
            `❌ Derrota para ${player.nextFight.opponent.name}.`
        );

        alert(
            "❌ DERROTA!"
        );

    }

    player.nextFight =
        null;

    player.fatigue =
        Math.min(
            100,
            player.fatigue + 20
        );

    save();

    home();

}


/* =========================================================
   EQUIPE
========================================================= */

function teamScreen() {

    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">
                🏢 EQUIPE
            </div>

            ${
                player.team
                ?
                `
                <div class="statline">
                    <span>Academia</span>
                    <b>${player.team.name}</b>
                </div>

                <div class="statline">
                    <span>Qualidade</span>
                    <b>${player.team.quality}</b>
                </div>
                `
                :
                `
                <p>
                    Você ainda não possui uma academia.
                </p>

                <button
                    class="green"
                    onclick="joinTeam()">

                    🥊 ESCOLHER ACADEMIA

                </button>
                `
            }

        </div>

        <div class="card">

            <div class="title">
                👔 EMPRESÁRIO
            </div>

            ${
                player.manager
                ?
                `
                <div class="statline">
                    <span>Nome</span>
                    <b>${player.manager.name}</b>
                </div>
                `
                :
                `
                <p>
                    Você ainda não possui empresário.
                </p>

                <button
                    onclick="hireManager()">

                    👔 PROCURAR EMPRESÁRIO

                </button>
                `
            }

        </div>

    `;

}


/* =========================================================
   ACADEMIA
========================================================= */

function joinTeam() {

    player.team = {

        name:
            "MMA Life Performance",

        quality:
            75,

        country:
            player.country

    };

    player.log.unshift(
        "🏢 Você entrou para uma nova academia."
    );

    save();

    teamScreen();

}


/* =========================================================
   EMPRESÁRIO
========================================================= */

function hireManager() {

    player.manager = {

        name:
            "Ricardo Mendes",

        level:
            1,

        commission:
            10

    };

    player.log.unshift(
        "👔 Você contratou um empresário."
    );

    save();

    teamScreen();

}


/* =========================================================
   VIDA / FAMÍLIA
========================================================= */

function familyScreen() {

    document
        .getElementById("content")
        .innerHTML = `

        <div class="card">

            <div class="title">
                ❤️ VIDA
            </div>

            <div class="statline">
                <span>Idade</span>
                <b>${player.age}</b>
            </div>

            <div class="statline">
                <span>Status</span>
                <b>${player.relationship}</b>
            </div>

            <div class="statline">
                <span>Filhos</span>
                <b>${player.children.length}</b>
            </div>

            ${
                player.age >= 18 &&
                player.relationship === "Solteiro"
                ?
                `
                <button
                    onclick="dating()">

                    ❤️ COMEÇAR RELACIONAMENTO

                </button>
                `
                :
                ""
            }

            ${
                player.relationship === "Namorando"
                ?
                `
                <button
                    onclick="marry()">

                    💍 CASAR

                </button>
                `
                :
                ""
            }

            ${
                player.married
                ?
                `
                <button
                    class="green"
                    onclick="haveChild()">

                    👶 TER FILHO

                </button>
                `
                :
                ""
            }

        </div>


        <div class="card">

            <div class="title">
                👑 DINASTIA
            </div>

            ${
                player.children.length
                ?
                player.children
                    .map(
                        child => `

                        <div class="statline">

                            <span>
                                👶 ${child.name}
                            </span>

                            <b>
                                ${child.age} anos
                            </b>

                        </div>

                        `
                    )
                    .join("")
                :
                `
                <p>
                    Sua dinastia ainda não começou.
                </p>
                `
            }

        </div>

    `;

}


/* =========================================================
   NAMORAR
========================================================= */

function dating() {

    player.relationship =
        "Namorando";

    save();

    familyScreen();

}


/* =========================================================
   CASAR
========================================================= */

function marry() {

    player.relationship =
        "Casado";

    player.married =
        true;

    player.log.unshift(
        "💍 Você se casou."
    );

    save();

    familyScreen();

}


/* =========================================================
   TER FILHO
========================================================= */

function haveChild() {

    if (!player.married) {

        alert(
            "Você precisa estar casado."
        );

        return;

    }

    if (player.children.length >= 5) {

        alert(
            "Limite de 5 filhos."
        );

        return;

    }

    const names = [

        "Miguel",
        "Arthur",
        "João",
        "Lucas",
        "Gabriel",
        "Pedro",
        "Davi",
        "Helena",
        "Laura",
        "Alice"

    ];

    const childName =
        names[
            Math.floor(
                Math.random() *
                names.length
            )
        ];

    player.children.push({

        name:
            childName,

        age:
            0

    });

    player.log.unshift(
        `👶 Nasceu ${childName}.`
    );

    save();

    familyScreen();

}


/* =========================================================
   RANKING
========================================================= */

function rankingScreen() {

    const organizations = [

        "Shooto Brasil",
        "Jungle Fight",
        "PFL",
        "ONE Championship",
        "RIZIN",
        "KSW",
        "UFC"

    ];

    let html = `

        <div class="card">

            <div class="title">
                🏆 RANKINGS
            </div>

            <p>
                Escolha uma organização.
            </p>

    `;

    organizations.forEach(
        organization => {

            html += `

                <button
                    onclick="
                        showRankingOrganization(
                            '${organization}'
                        )
                    ">

                    🏆 ${organization}

                </button>

            `;

        }
    );

    html += `

        </div>

    `;

    document
        .getElementById("content")
        .innerHTML = html;

}


/* =========================================================
   MOSTRAR RANKING
========================================================= */

function showRankingOrganization(
    organization
) {

    const fighters = [];

    for (let i = 0; i < 15; i++) {

        fighters.push({

            name:
                "Lutador #" +
                (i + 1),

            overall:
                Math.max(
                    60,
                    95 - i * 2
                )

        });

    }

    let html = `

        <div class="card">

            <div class="title">
                🏆 ${organization}
            </div>

            <div class="statline">

                <span>Categoria</span>

                <b>
                    ${player.weight}
                </b>

            </div>

        </div>

        <div class="card">

            <div class="title">
                📊 TOP 15
            </div>

    `;

    fighters.forEach(
        (fighter, index) => {

            html += `

                <div class="statline">

                    <span>
                        #${index + 1}
                        ${fighter.name}
                    </span>

                    <b>
                        OVR ${fighter.overall}
                    </b>

                </div>

            `;

        }
    );

    html += `

        </div>

        <div class="card">

            <button
                onclick="rankingScreen()">

                ← VOLTAR

            </button>

        </div>

    `;

    document
        .getElementById("content")
        .innerHTML = html;

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        load();

        if (player.name) {

            home();

        } else {

            startGame();

        }

    }
);
