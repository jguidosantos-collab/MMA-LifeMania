/* =========================================================
   MMA LIFE — MAIN.JS
   VERSÃO LIMPA
========================================================= */

/* =========================================================
   JOGADOR
========================================================= */

let player = {
    name: "",
    country: "Brasil",
    weight: "Peso Leve",
    style: "Completo",

    age: 18,
    week: 1,
    year: 1,

    money: 0,
    fame: 0,

    health: 100,
    fatigue: 0,

    overall: 60,
    potential: 90,

    relationship: "Solteiro",
    married: false,

    children: [],

    team: null,
    manager: null,

    nextFight: null,

    careerStage: "amateur",

    currentPromotion: null,
    currentContract: null,

    professional: {
        active: false,
        wins: 0,
        losses: 0,
        draws: 0
    },

    amateur: {
        wins: 0,
        losses: 0,
        draws: 0
    },

    attributes: {
        strength: 60,
        striking: 60,
        wrestling: 60,
        grappling: 60,
        cardio: 60,
        technique: 60,
        defense: 60,
        fightIQ: 60
    },

    trainingPlan: {
        weeks: {},
        automatic: true
    },

    log: []
};


/* =========================================================
   SALVAR
========================================================= */

function save() {
    try {
        localStorage.setItem(
            "mmaLifePlayer",
            JSON.stringify(player)
        );
    } catch (error) {
        console.error("Erro ao salvar:", error);
    }
}


/* =========================================================
   CARREGAR
========================================================= */

function load() {

    try {

        const saved =
            localStorage.getItem("mmaLifePlayer");

        if (saved) {

            const data =
                JSON.parse(saved);

            player = {
                ...player,
                ...data,

                professional: {
                    ...player.professional,
                    ...(data.professional || {})
                },

                amateur: {
                    ...player.amateur,
                    ...(data.amateur || {})
                },

                attributes: {
                    ...player.attributes,
                    ...(data.attributes || {})
                },

                trainingPlan: {
                    ...player.trainingPlan,
                    ...(data.trainingPlan || {})
                },

                children:
                    data.children || [],

                log:
                    data.log || []
            };

        }

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

    const confirmReset =
        confirm(
            "Tem certeza que deseja apagar sua carreira e começar novamente?"
        );

    if (!confirmReset) {
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
        week: 1,
        year: 1,

        money: 0,
        fame: 0,

        health: 100,
        fatigue: 0,

        overall: 60,
        potential: randomPotential(),

        relationship: "Solteiro",
        married: false,

        children: [],

        team: null,
        manager: null,

        nextFight: null,

        careerStage: "amateur",

        currentPromotion: null,
        currentContract: null,

        professional: {
            active: false,
            wins: 0,
            losses: 0,
            draws: 0
        },

        amateur: {
            wins: 0,
            losses: 0,
            draws: 0
        },

        attributes: {
            strength: 60,
            striking: 60,
            wrestling: 60,
            grappling: 60,
            cardio: 60,
            technique: 60,
            defense: 60,
            fightIQ: 60
        },

        trainingPlan: {
            weeks: {},
            automatic: true
        },

        log: []
    };

    save();

    startGame();
}


/* =========================================================
   POTENCIAL
========================================================= */

function randomPotential() {

    return Math.floor(
        78 +
        Math.random() * 21
    );

}


/* =========================================================
   OVERALL
========================================================= */

function getOverall() {

    const a =
        player.attributes || {};

    const values = [

        a.strength || 60,
        a.striking || 60,
        a.wrestling || 60,
        a.grappling || 60,
        a.cardio || 60,
        a.technique || 60,
        a.defense || 60,
        a.fightIQ || 60

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
   TEXTO DO RANKING
========================================================= */

function rankingText() {

    const ovr =
        getOverall();

    if (ovr >= 90) {
        return "#1";
    }

    if (ovr >= 85) {
        return "#5";
    }

    if (ovr >= 80) {
        return "#15";
    }

    if (ovr >= 75) {
        return "#30";
    }

    if (ovr >= 70) {
        return "#50";
    }

    return "—";
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
   TELA INICIAL
========================================================= */

function startGame() {

    const content =
        document.getElementById(
            "content"
        );

    if (!content) {
        return;
    }

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

            <div class="start-preview">

                <div class="start-fighter">
                    🥊
                </div>

                <div class="start-preview-text">

                    <strong>
                        SUA HISTÓRIA COMEÇA AQUI
                    </strong>

                    <span>
                        Comece como amador,
                        treine seu lutador,
                        construa sua reputação
                        e chegue ao topo do MMA.
                    </span>

                </div>

            </div>

            <button
                class="start-button"
                type="button"
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
        document.getElementById(
            "content"
        );

    if (!content) {
        return;
    }

    content.innerHTML = `

        <div class="card">

            <div class="title">
                🥊 CRIAR NOVO LUTADOR
            </div>

            <p>
                Comece sua jornada no MMA.
            </p>

            <input
                id="playerName"
                type="text"
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

                <option value="Peso Leve">
                    Peso Leve
                </option>

                <option value="Peso Meio-Médio">
                    Peso Meio-Médio
                </option>

                <option value="Peso Médio">
                    Peso Médio
                </option>

                <option value="Peso Meio-Pesado">
                    Peso Meio-Pesado
                </option>

                <option value="Peso Pesado">
                    Peso Pesado
                </option>

            </select>

            <select id="style">

                <option value="Completo">
                    🥊 Completo
                </option>

                <option value="Striker">
                    👊 Striker
                </option>

                <option value="Wrestler">
                    🤼 Wrestler
                </option>

                <option value="Grappler">
                    🥋 Grappler
                </option>

            </select>

            <button
                class="green"
                type="button"
                onclick="createPlayerFromScreen()">

                ✅ CRIAR LUTADOR

            </button>

            <button
                class="gray"
                type="button"
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
        document.getElementById(
            "playerName"
        );

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

    const country =
        document.getElementById(
            "country"
        ).value;

    const weight =
        document.getElementById(
            "weight"
        ).value;

    const style =
        document.getElementById(
            "style"
        ).value;

    player.name =
        name;

    player.country =
        country;

    player.weight =
        weight;

    player.style =
        style;

    player.age = 18;

    player.week = 1;

    player.year = 1;

    player.money = 0;

    player.fame = 0;

    player.health = 100;

    player.fatigue = 0;

    player.overall = 60;

    player.potential =
        randomPotential();

    player.careerStage =
        "amateur";

    player.relationship =
        "Solteiro";

    player.married =
        false;

    player.children = [];

    player.team = null;

    player.manager = null;

    player.nextFight = null;

    player.currentPromotion = null;

    player.currentContract = null;

    player.professional = {

        active: false,
        wins: 0,
        losses: 0,
        draws: 0

    };

    player.amateur = {

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
        fightIQ: 60

    };

    player.trainingPlan = {

        weeks: {},
        automatic: true

    };

    player.log = [];

    player.log.unshift(
        "🥊 Sua carreira começou."
    );

    save();

    /*
     * IMPORTANTE:
     * vai diretamente para a tela principal.
     */

    home();

}


/* =========================================================
   TELA PRINCIPAL
========================================================= */

function home() {

    const content =
        document.getElementById(
            "content"
        );

    if (!content) {
        return;
    }

    const pro =
        player.professional || {};

    const amateur =
        player.amateur || {};

    content.innerHTML = `

        <div class="home-container">

            <div class="fighter-header">

                <div class="fighter-avatar">
                    🥊
                </div>

                <div class="fighter-info">

                    <div class="fighter-name">
                        ${player.name || "Lutador"}
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

                    <strong>
                        ${player.age}
                    </strong>

                </div>


                <div class="stat-card">

                    <span>OVR</span>

                    <strong>
                        ${getOverall()}
                    </strong>

                </div>


                <div class="stat-card">

                    <span>POTENCIAL</span>

                    <strong>
                        ${player.potential}
                    </strong>

                </div>


                <div class="stat-card">

                    <span>FAMA</span>

                    <strong>
                        ${Math.round(player.fame)}
                    </strong>

                </div>

            </div>


            <div class="card">

                <div class="title">
                    🏆 MINHA CARREIRA
                </div>

                <div class="statline">

                    <span>
                        Status
                    </span>

                    <b>
                        ${
                            pro.active
                            ? "Profissional"
                            : "Amador"
                        }
                    </b>

                </div>

                <div class="statline">

                    <span>
                        Estágio
                    </span>

                    <b>
                        ${player.careerStage}
                    </b>

                </div>

                <div class="statline">

                    <span>
                        Profissional
                    </span>

                    <b>
                        ${pro.wins}-${pro.losses}-${pro.draws}
                    </b>

                </div>

                <div class="statline">

                    <span>
                        Amador
                    </span>

                    <b>
                        ${amateur.wins}-${amateur.losses}-${amateur.draws}
                    </b>

                </div>

                <button
                    type="button"
                    onclick="career()">

                    🏆 CARREIRA

                </button>

            </div>


            <div class="card">

                <div class="title">
                    📅 CALENDÁRIO
                </div>

                <div class="statline">

                    <span>
                        Temporada
                    </span>

                    <b>
                        Ano ${player.year}
                    </b>

                </div>

                <div class="statline">

                    <span>
                        Semana
                    </span>

                    <b>
                        ${player.week}/52
                    </b>

                </div>

                <button
                    type="button"
                    onclick="training()">

                    🏋️ CAMP / TREINO

                </button>

                <button
                    type="button"
                    onclick="nextWeek()">

                    ⏭️ AVANÇAR SEMANA

                </button>

            </div>


            <div class="card">

                <div class="title">
                    🌎 MUNDO DO MMA
                </div>

                <button
                    type="button"
                    onclick="fightScreen()">

                    👊 LUTAS

                </button>

                <button
                    type="button"
                    onclick="teamScreen()">

                    🏢 EQUIPE

                </button>

                <button
                    type="button"
                    onclick="familyScreen()">

                    ❤️ VIDA

                </button>

                <button
                    type="button"
                    onclick="rankingScreen()">

                    🏆 RANKING

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
                        ${Math.round(player.health)}%
                    </b>

                </div>

                <div class="statline">

                    <span>
                        Fadiga
                    </span>

                    <b>
                        ${Math.round(player.fatigue)}%
                    </b>

                </div>

            </div>


            <div class="card">

                <div class="title">
                    ⚙️ JOGO
                </div>

                <button
                    class="gray"
                    type="button"
                    onclick="resetGame()">

                    🔄 REINICIAR JOGO

                </button>

            </div>

        </div>

    `;

}


/* =========================================================
   CARREIRA
========================================================= */

function career() {

    const content =
        document.getElementById(
            "content"
        );

    content.innerHTML = `

        <div class="card">

            <div class="title">
                🏆 CARREIRA
            </div>

            <div class="statline">
                <span>OVR</span>
                <b>${getOverall()}</b>
            </div>

            <div class="statline">
                <span>Potencial</span>
                <b>${player.potential}</b>
            </div>

            <div class="statline">
                <span>Estágio</span>
                <b>${player.careerStage}</b>
            </div>

            <div class="statline">
                <span>Fama</span>
                <b>${Math.round(player.fame)}</b>
            </div>

            <div class="statline">
                <span>Ranking</span>
                <b>${rankingText()}</b>
            </div>

        </div>


        <div class="card">

            <div class="title">
                🥊 STATUS PROFISSIONAL
            </div>

            ${
                player.professional.active

                ?

                `
                    <p>
                        Você é profissional.
                    </p>
                `

                :

                `
                    <p>
                        Você ainda é amador.
                    </p>

                    <button
                        class="green"
                        type="button"
                        onclick="turnProfessional()">

                        🥊 VIRAR PROFISSIONAL

                    </button>
                `
            }

        </div>


        <button
            type="button"
            onclick="home()">

            ← VOLTAR

        </button>

    `;

}


/* =========================================================
   VIRAR PROFISSIONAL
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
        "Parabéns! Você agora é profissional."
    );

    career();

}


/* =========================================================
   TREINAMENTO / CAMP
========================================================= */

function training() {

    const content =
        document.getElementById(
            "content"
        );

    player.trainingPlan =
        player.trainingPlan || {
            weeks: {},
            automatic: true
        };

    const weekPlan =
        player.trainingPlan.weeks[
            player.week
        ] || [];

    content.innerHTML = `

        <div class="card">

            <div class="title">
                🏋️ CAMP DE TREINAMENTO
            </div>

            <div class="statline">
                <span>Ano</span>
                <b>${player.year}</b>
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
                <b>${player.potential}</b>
            </div>

        </div>


        <div class="card">

            <div class="title">
                📅 TREINO DA SEMANA
            </div>

            ${
                weekPlan.length

                ?

                weekPlan.map(
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
                type="button"
                onclick="generateTrainingPlan()">

                🎲 GERAR CAMP AUTOMÁTICO

            </button>

            <button
                type="button"
                onclick="programTraining()">

                ✏️ PROGRAMAR TREINO

            </button>

            <button
                type="button"
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


        <button
            type="button"
            onclick="home()">

            ← VOLTAR

        </button>

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
        ["fightIQ", "🧠", "Fight IQ"]

    ];

    const selected = [];

    for (
        let i = 0;
        i < 3;
        i++
    ) {

        const item =
            options[
                Math.floor(
                    Math.random() *
                    options.length
                )
            ];

        selected.push({

            attribute: item[0],
            icon: item[1],
            name: item[2],

            gain:
                Number(
                    (
                        0.40 +
                        Math.random() *
                        0.70
                    ).toFixed(2)
                )

        });

    }

    player.trainingPlan.weeks[
        player.week
    ] = selected;

    player.trainingPlan.automatic =
        true;

    save();

    training();

}


/* =========================================================
   PROGRAMAR TREINO
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

    options.forEach(
        option => {

            html += `

                <button
                    type="button"
                    onclick="addTraining('${option[0]}')">

                    ${option[1]}

                </button>

            `;

        }
    );

    html += `

            <button
                class="gray"
                type="button"
                onclick="training()">

                ← VOLTAR

            </button>

        </div>

    `;

    document.getElementById(
        "content"
    ).innerHTML = html;

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
        fightIQ: ["🧠", "Fight IQ"]

    };

    const item =
        names[attribute];

    if (!item) {
        return;
    }

    player.trainingPlan =
        player.trainingPlan || {
            weeks: {},
            automatic: false
        };

    player.trainingPlan.weeks[
        player.week
    ] =
        player.trainingPlan.weeks[
            player.week
        ] || [];

    player.trainingPlan.weeks[
        player.week
    ].push({

        attribute:
            attribute,

        icon:
            item[0],

        name:
            item[1],

        gain:
            Number(
                (
                    0.40 +
                    Math.random() *
                    0.70
                ).toFixed(2)
            )

    });

    save();

    training();

}


/* =========================================================
   AVANÇAR SEMANA
========================================================= */

function nextWeek() {

    player.week =
        player.week || 1;

    player.year =
        player.year || 1;

    const plan =
        player.trainingPlan &&
        player.trainingPlan.weeks
        ?
        player.trainingPlan.weeks[
            player.week
        ]
        :
        [];

    if (plan && plan.length) {

        plan.forEach(
            treino => {

                const attribute =
                    treino.attribute;

                const current =
                    Number(
                        player.attributes[
                            attribute
                        ] || 60
                    );

                const potential =
                    Number(
                        player.potential || 90
                    );

                if (
                    current <
                    potential
                ) {

                    const room =
                        potential -
                        current;

                    const gain =
                        Math.min(
                            Number(
                                treino.gain
                            ),
                            room
                        );

                    player.attributes[
                        attribute
                    ] =
                        Number(
                            (
                                current +
                                gain
                            ).toFixed(2)
                        );

                }

            }
        );

    }

    player.fatigue =
        Math.max(
            0,
            Number(
                player.fatigue || 0
            ) - 10
        );

    player.health =
        Math.min(
            100,
            Number(
                player.health || 100
            ) + 3
        );

    player.week++;

    if (
        player.week > 52
    ) {

        player.week = 1;

        player.year++;

        player.log.unshift(
            `🎆 Começou o Ano ${player.year}.`
        );

    }

    save();

    home();

}


/* =========================================================
   LUTAS
========================================================= */

function fightScreen() {

    const content =
        document.getElementById(
            "content"
        );

    content.innerHTML = `

        <div class="card">

            <div class="title">
                👊 LUTAS
            </div>

            ${
                player.nextFight

                ?

                `

                <div class="statline">
                    <span>Evento</span>
                    <b>${player.nextFight.event.name}</b>
                </div>

                <div class="statline">
                    <span>Adversário</span>
                    <b>${player.nextFight.opponent.displayName}</b>
                </div>

                <div class="statline">
                    <span>OVR adversário</span>
                    <b>${player.nextFight.opponent.power}</b>
                </div>

                <button
                    class="green"
                    type="button"
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
                    type="button"
                    onclick="findFight()">

                    🔎 PROCURAR ADVERSÁRIO

                </button>

                `
            }

        </div>


        <button
            type="button"
            onclick="home()">

            ← VOLTAR

        </button>

    `;

}


/* =========================================================
   PROCURAR LUTA
========================================================= */

function findFight() {

    const opponentOVR =
        Math.floor(
            Math.max(
                45,
                getOverall() - 10
            ) +
            Math.random() * 21
        );

    player.nextFight = {

        event: {
            name:
                `Evento Regional — Semana ${player.week}`
        },

        opponent: {

            displayName:
                "Adversário " +
                Math.floor(
                    Math.random() * 900
                ),

            country:
                "Brasil",

            power:
                opponentOVR

        },

        purse:
            Math.floor(
                500 +
                Math.random() * 1500
            ),

        week:
            player.week

    };

    save();

    fightScreen();

}


/* =========================================================
   LUTAR
========================================================= */

function fight() {

    if (!player.nextFight) {

        alert(
            "Você não possui uma luta marcada."
        );

        return;
    }

    const myOVR =
        getOverall();

    const opponentOVR =
        Number(
            player.nextFight.opponent.power
        );

    const chance =
        myOVR /
        (
            myOVR +
            opponentOVR
        );

    const win =
        Math.random() <
        chance;

    if (win) {

        player.professional.wins++;

        player.fame += 3;

        player.money +=
            Number(
                player.nextFight.purse || 0
            );

        player.log.unshift(
            `🏆 Vitória na Semana ${player.week}.`
        );

        alert(
            "🏆 VOCÊ VENCEU!"
        );

    } else {

        player.professional.losses++;

        player.fame =
            Math.max(
                0,
                player.fame - 1
            );

        player.log.unshift(
            `❌ Derrota na Semana ${player.week}.`
        );

        alert(
            "❌ VOCÊ PERDEU."
        );

    }

    player.nextFight =
        null;

    save();

    fightScreen();

}


/* =========================================================
   EQUIPE
========================================================= */

function teamScreen() {

    const content =
        document.getElementById(
            "content"
        );

    content.innerHTML = `

        <div class="card">

            <div class="title">
                🏢 EQUIPE
            </div>

            <div class="statline">
                <span>Academia</span>
                <b>
                    ${
                        player.team
                        ? player.team.name
                        : "Nenhuma"
                    }
                </b>
            </div>

            <div class="statline">
                <span>Empresário</span>
                <b>
                    ${
                        player.manager
                        ? player.manager.name
                        : "Nenhum"
                    }
                </b>
            </div>

            <button
                type="button"
                onclick="generateTeamOffers()">

                🔎 PROCURAR ACADEMIA

            </button>

        </div>


        <button
            type="button"
            onclick="home()">

            ← VOLTAR

        </button>

    `;

}


/* =========================================================
   ACADEMIAS
========================================================= */

function generateTeamOffers() {

    const teams = [

        {
            name: "Nova União",
            country: "Brasil",
            city: "Rio de Janeiro",
            quality: 82
        },

        {
            name: "Chute Boxe",
            country: "Brasil",
            city: "São Paulo",
            quality: 85
        },

        {
            name: "American Top Team",
            country: "Estados Unidos",
            city: "Florida",
            quality: 90
        }

    ];

    let html = `

        <div class="card">

            <div class="title">
                🏢 ACADEMIAS DISPONÍVEIS
            </div>

    `;

    teams.forEach(
        (team, index) => {

            html += `

                <div class="card">

                    <div class="title">
                        🥊 ${team.name}
                    </div>

                    <div class="statline">
                        <span>País</span>
                        <b>${team.country}</b>
                    </div>

                    <div class="statline">
                        <span>Cidade</span>
                        <b>${team.city}</b>
                    </div>

                    <div class="statline">
                        <span>Qualidade</span>
                        <b>${team.quality}</b>
                    </div>

                    <button
                        class="green"
                        type="button"
                        onclick="joinTeam(${index})">

                        ✅ ENTRAR

                    </button>

                </div>

            `;

        }
    );

    html += `

        </div>

        <button
            type="button"
            onclick="home()">

            ← VOLTAR

        </button>

    `;

    window.availableTeams =
        teams;

    document.getElementById(
        "content"
    ).innerHTML = html;

}


/* =========================================================
   ENTRAR NA ACADEMIA
========================================================= */

function joinTeam(index) {

    if (
        !window.availableTeams ||
        !window.availableTeams[index]
    ) {
        return;
    }

    player.team =
        window.availableTeams[index];

    save();

    alert(
        "🥊 Você entrou na academia!"
    );

    teamScreen();

}


/* =========================================================
   VIDA / FAMÍLIA
========================================================= */

function familyScreen() {

    const content =
        document.getElementById(
            "content"
        );

    content.innerHTML = `

        <div class="card">

            <div class="title">
                ❤️ VIDA
            </div>

            <div class="statline">
                <span>Idade</span>
                <b>${player.age}</b>
            </div>

            <div class="statline">
                <span>Relacionamento</span>
                <b>${player.relationship}</b>
            </div>

            <div class="statline">
                <span>Dinheiro</span>
                <b>$${Math.round(player.money)}</b>
            </div>

            ${
                player.age >= 18 &&
                player.relationship === "Solteiro"

                ?

                `
                    <button
                        type="button"
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
                        type="button"
                        onclick="marry()">

                        💍 CASAR — $500

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
                        type="button"
                        onclick="haveChild()">

                        👶 TER FILHO — $1.000

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

            <div class="statline">

                <span>
                    Filhos
                </span>

                <b>
                    ${player.children.length}/5
                </b>

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


        <button
            type="button"
            onclick="home()">

            ← VOLTAR

        </button>

    `;

}


/* =========================================================
   NAMORAR
========================================================= */

function dating() {

    player.relationship =
        "Namorando";

    save();

    alert(
        "❤️ Você começou um relacionamento."
    );

    familyScreen();

}


/* =========================================================
   CASAMENTO
========================================================= */

function marry() {

    if (
        player.money < 500
    ) {

        alert(
            "Você precisa de $500."
        );

        return;
    }

    player.money -= 500;

    player.relationship =
        "Casado";

    player.married =
        true;

    save();

    alert(
        "💍 Você se casou!"
    );

    familyScreen();

}


/* =========================================================
   FILHO
========================================================= */

function haveChild() {

    if (
        player.children.length >= 5
    ) {

        alert(
            "Você já possui o limite de 5 filhos."
        );

        return;
    }

    if (
        player.money < 1000
    ) {

        alert(
            "Você precisa de $1.000."
        );

        return;
    }

    player.money -= 1000;

    player.children.push({

        name:
            "Filho " +
            (
                player.children.length + 1
            ),

        age: 0

    });

    save();

    alert(
        "👶 Um novo membro entrou na família!"
    );

    familyScreen();

}


/* =========================================================
   RANKING
========================================================= */

function rankingScreen() {

    const content =
        document.getElementById(
            "content"
        );

    content.innerHTML = `

        <div class="card">

            <div class="title">
                🏆 RANKINGS DO MMA
            </div>

            <div class="statline">

                <span>
                    Seu OVR
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
                    ${player.potential}
                </b>

            </div>

            <div class="statline">

                <span>
                    Ranking estimado
                </span>

                <b>
                    ${rankingText()}
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                🇧🇷 NACIONAL
            </div>

            <button
                type="button"
                onclick="showRankingOrganization('Jungle Fight')">

                🇧🇷 Jungle Fight

            </button>

        </div>


        <div class="card">

            <div class="title">
                🌎 INTERNACIONAL
            </div>

            <button
                type="button"
                onclick="showRankingOrganization('PFL')">

                🏆 PFL

            </button>

            <button
                type="button"
                onclick="showRankingOrganization('ONE Championship')">

                🥊 ONE Championship

            </button>

            <button
                type="button"
                onclick="showRankingOrganization('RIZIN')">

                🇯🇵 RIZIN

            </button>

        </div>


        <div class="card">

            <div class="title">
                👑 ELITE
            </div>

            <button
                type="button"
                onclick="showRankingOrganization('UFC')">

                🥇 UFC

            </button>

        </div>


        <button
            type="button"
            onclick="home()">

            ← VOLTAR

        </button>

    `;

}


/* =========================================================
   ORGANIZAÇÃO DO RANKING
========================================================= */

function showRankingOrganization(
    organization
) {

    const content =
        document.getElementById(
            "content"
        );

    const base =
        getOverall();

    const fighters = [];

    for (
        let i = 0;
        i < 15;
        i++
    ) {

        fighters.push({

            name:
                "Lutador " +
                (i + 1),

            ovr:
                Math.max(
                    65,
                    base +
                    20 -
                    i * 2
                ),

            record:
                `${15 - i}-${i}`

        });

    }

    fighters.sort(
        (a, b) =>
            b.ovr - a.ovr
    );

    content.innerHTML = `

        <div class="card">

            <div class="title">
                🏆 ${organization}
            </div>

            <div class="statline">

                <span>
                    Categoria
                </span>

                <b>
                    ${player.weight}
                </b>

            </div>

        </div>


        <div class="card">

            <div class="title">
                📊 TOP 15
            </div>

            ${

                fighters
                    .map(
                        (fighter, index) => `

                            <div class="statline">

                                <span>
                                    #${index + 1}
                                    ${fighter.name}
                                </span>

                                <b>
                                    OVR ${fighter.ovr}
                                </b>

                            </div>

                        `
                    )
                    .join("")

            }

        </div>


        <button
            type="button"
            onclick="rankingScreen()">

            ← VOLTAR

        </button>

    `;

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        load();

        const hasPlayer =
            player &&
            player.name &&
            player.name.trim() !== "";

        if (hasPlayer) {

            home();

        } else {

            startGame();

        }

    }
);
