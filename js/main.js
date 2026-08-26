main.js — versão limpa

/* =========================================================
   MMA LIFE
   MAIN.JS — VERSÃO LIMPA
========================================================= */
/* =========================================================
   ESTADO INICIAL
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
        fightIQ: 60,
        chin: 60,
        offense: 60,
        blocking: 60
    },
    trainingPlan: {
        weeks: {},
        automatic: false
    },
    teamOffers: [],
    log: []
};
/* =========================================================
   UTILIDADES
========================================================= */
function getContent() {
    return document.getElementById("content");
}
function save() {
    localStorage.setItem(
        "mmaLifePlayer",
        JSON.stringify(player)
    );
}
function load() {
    const saved =
        localStorage.getItem("mmaLifePlayer");
    if (!saved) {
        return false;
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
            professional: {
                ...player.professional,
                ...(data.professional || {})
            },
            amateur: {
                ...player.amateur,
                ...(data.amateur || {})
            },
            trainingPlan: {
                ...player.trainingPlan,
                ...(data.trainingPlan || {})
            }
        };
        return true;
    } catch (error) {
        console.error(
            "Erro ao carregar jogador:",
            error
        );
        return false;
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
            fightIQ: 60,
            chin: 60,
            offense: 60,
            blocking: 60
        },
        trainingPlan: {
            weeks: {},
            automatic: false
        },
        teamOffers: [],
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
   TELA DE INÍCIO
========================================================= */
function startGame() {
    const content = getContent();
    if (!content) {
        console.error(
            "Elemento #content não encontrado."
        );
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
                        evolua seu lutador,
                        consiga contratos,
                        conquiste títulos
                        e construa seu legado.
                    </span>
                </div>
            </div>
            <button
                class="start-button"
                onclick="openCharacterCreation()">
                🆕 CRIAR NOVO LUTADOR
            </button>
            <div class="start-footer">
                AMADOR
                →
                REGIONAL
                →
                NACIONAL
                →
                INTERNACIONAL
                →
                ELITE
            </div>
        </div>
    `;
}
/* =========================================================
   CRIAÇÃO DO LUTADOR
========================================================= */
function openCharacterCreation() {
    const content = getContent();
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
    const nameElement =
        document.getElementById("playerName");
    const countryElement =
        document.getElementById("country");
    const weightElement =
        document.getElementById("weight");
    const styleElement =
        document.getElementById("style");
    if (!nameElement) {
        return;
    }
    const name =
        nameElement.value.trim();
    if (!name) {
        alert(
            "Digite o nome do lutador."
        );
        return;
    }
    player.name =
        name;
    player.country =
        countryElement
        ? countryElement.value
        : "Brasil";
    player.weight =
        weightElement
        ? weightElement.value
        : "Peso Leve";
    player.style =
        styleElement
        ? styleElement.value
        : "Completo";
    player.age = 18;
    player.week = 1;
    player.year = 1;
    player.money = 0;
    player.fame = 0;
    player.health = 100;
    player.fatigue = 0;
    player.overall = 60;
    /*
     * POTENCIAL
     *
     * O lutador começa com OVR 60,
     * mas pode nascer com potencial entre
     * 78 e 98.
     */
    player.potential =
        78 +
        Math.floor(
            Math.random() * 21
        );
    player.relationship =
        "Solteiro";
    player.married =
        false;
    player.children =
        [];
    player.careerStage =
        "amateur";
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
        fightIQ: 60,
        chin: 60,
        offense: 60,
        blocking: 60
    };
    player.trainingPlan = {
        weeks: {},
        automatic: false
    };
    player.team = null;
    player.manager = null;
    player.nextFight = null;
    player.log = [];
    player.log.unshift(
        `🥊 ${player.name} iniciou sua carreira no MMA.`
    );
    save();
    /*
     * IMPORTANTE:
     * vai diretamente para o jogo.
     */
    home();
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
                sum + value,
            0
        );
    return Math.min(
        player.potential || 98,
        Math.round(
            total / values.length
        )
    );
}
/* =========================================================
   TELA PRINCIPAL
========================================================= */
function home() {
    const content =
        getContent();
    if (!content) {
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
                        ${player.name || "Lutador"}
                    </div>
                    <div>
                        ${player.country}
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
                        ${Math.round(
                            player.fame
                        )}
                    </strong>
                </div>
            </div>
            <div class="card">
                <div class="title">
                    🏆 CARREIRA
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
                        ${recordPro}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Amador
                    </span>
                    <b>
                        ${recordAmateur}
                    </b>
                </div>
                <button
                    class="main-button"
                    onclick="career()">
                    🏆 ABRIR CARREIRA
                </button>
            </div>
            <div class="card">
                <div class="title">
                    📅 CALENDÁRIO
                </div>
                <div class="statline">
                    <span>
                        Ano
                    </span>
                    <b>
                        ${player.year}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Semana
                    </span>
                    <b>
                        ${player.week} / 52
                    </b>
                </div>
                <button
                    class="main-button"
                    onclick="training()">
                    🏋️ CAMP DE TREINAMENTO
                </button>
                <button
                    class="main-button"
                    onclick="nextWeek()">
                    ⏭️ PRÓXIMA SEMANA
                </button>
            </div>
            <div class="card">
                <div class="title">
                    🥊 MUNDO DO MMA
                </div>
                <button
                    class="main-button"
                    onclick="fightScreen()">
                    👊 LUTAS
                </button>
                <button
                    class="main-button"
                    onclick="teamScreen()">
                    🏢 EQUIPE
                </button>
                <button
                    class="main-button"
                    onclick="familyScreen()">
                    ❤️ VIDA
                </button>
                <button
                    class="main-button"
                    onclick="rankingScreen()">
                    🏆 RANKINGS
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
                        ${Math.round(
                            player.health
                        )}%
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Fadiga
                    </span>
                    <b>
                        ${Math.round(
                            player.fatigue
                        )}%
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Dinheiro
                    </span>
                    <b>
                        $${Math.round(
                            player.money
                        )}
                    </b>
                </div>
            </div>
            <div class="card">
                <div class="title">
                    ⚙️ SISTEMA
                </div>
                <button
                    class="main-button gray"
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
        getContent();
    if (!content) {
        return;
    }
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🏆 MINHA CARREIRA
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
                <b>
                    ${player.careerStage}
                </b>
            </div>
            <div class="statline">
                <span>OVR</span>
                <b>
                    ${getOverall()}
                </b>
            </div>
            <div class="statline">
                <span>Potencial</span>
                <b>
                    ${player.potential}
                </b>
            </div>
            <div class="statline">
                <span>Vitórias</span>
                <b>
                    ${player.professional.wins}
                </b>
            </div>
            <div class="statline">
                <span>Derrotas</span>
                <b>
                    ${player.professional.losses}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                📈 ATRIBUTOS
            </div>
            ${attributeRow("💪 Força", "strength")}
            ${attributeRow("🥊 Striking", "striking")}
            ${attributeRow("🤼 Wrestling", "wrestling")}
            ${attributeRow("🥋 Grappling", "grappling")}
            ${attributeRow("🏃 Cardio", "cardio")}
            ${attributeRow("🎯 Técnica", "technique")}
            ${attributeRow("🛡️ Defesa", "defense")}
            ${attributeRow("🧠 Fight IQ", "fightIQ")}
            ${attributeRow("🦷 Queixo", "chin")}
            ${attributeRow("⚔️ Ofensivo", "offense")}
            ${attributeRow("🛡️ Bloqueio", "blocking")}
        </div>
        <div class="card">
            <button
                class="gray"
                onclick="home()">
                ← VOLTAR
            </button>
        </div>
    `;
}
function attributeRow(name, attribute) {
    const value =
        Math.round(
            player.attributes[attribute] || 60
        );
    return `
        <div class="statline">
            <span>
                ${name}
            </span>
            <b>
                ${value}
            </b>
        </div>
    `;
}
/* =========================================================
   TREINAMENTO / CAMP
========================================================= */
function training() {
    const content =
        getContent();
    if (!content) {
        return;
    }
    player.trainingPlan =
        player.trainingPlan || {
            weeks: {},
            automatic: false
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
                <b>${player.week} / 52</b>
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
                📅 TREINO DA SEMANA ${player.week}
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
                                +${Number(
                                    treino.gain
                                ).toFixed(2)}
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
                <span>Saúde</span>
                <b>${Math.round(player.health)}%</b>
            </div>
            <div class="statline">
                <span>Fadiga</span>
                <b>${Math.round(player.fatigue)}%</b>
            </div>
        </div>
        <div class="card">
            <button
                class="gray"
                onclick="home()">
                ← VOLTAR
            </button>
        </div>
    `;
}
/* =========================================================
   GERAR CAMP AUTOMÁTICO
========================================================= */
function generateTrainingPlan() {
    player.trainingPlan =
        player.trainingPlan || {
            weeks: {},
            automatic: true
        };
    const options = [
        ["strength", "💪", "Força"],
        ["striking", "🥊", "Striking"],
        ["wrestling", "🤼", "Wrestling"],
        ["grappling", "🥋", "Grappling"],
        ["cardio", "🏃", "Cardio"],
        ["technique", "🎯", "Técnica"],
        ["defense", "🛡️", "Defesa"],
        ["fightIQ", "🧠", "Fight IQ"],
        ["chin", "🦷", "Queixo"],
        ["offense", "⚔️", "Ofensivo"],
        ["blocking", "🛡️", "Bloqueio"]
    ];
    const selected = [];
    for (let i = 0; i < 5; i++) {
        const option =
            options[
                Math.floor(
                    Math.random() *
                    options.length
                )
            ];
        selected.push({
            attribute:
                option[0],
            icon:
                option[1],
            name:
                option[2],
            gain:
                Number(
                    (
                        0.50 +
                        Math.random() * 0.50
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
        ["fightIQ", "🧠 Fight IQ"],
        ["chin", "🦷 Queixo"],
        ["offense", "⚔️ Ofensivo"],
        ["blocking", "🛡️ Bloqueio"]
    ];
    let html = `
        <div class="card">
            <div class="title">
                ✏️ PROGRAMAR TREINO
            </div>
            <p>
                Escolha os treinos da semana ${player.week}.
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
    getContent().innerHTML =
        html;
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
        chin: ["🦷", "Queixo"],
        offense: ["⚔️", "Ofensivo"],
        blocking: ["🛡️", "Bloqueio"]
    };
    if (!names[attribute]) {
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
            names[attribute][0],
        name:
            names[attribute][1],
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
    /*
     * Recuperação.
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
     * Avança calendário.
     */
    player.week++;
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
    home();
}
/* =========================================================
   LUTAS
========================================================= */
function fightScreen() {
    const content =
        getContent();
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
                    <b>
                        ${player.nextFight.event.name}
                    </b>
                </div>
                <div class="statline">
                    <span>Adversário</span>
                    <b>
                        ${player.nextFight.opponent.displayName}
                    </b>
                </div>
                <div class="statline">
                    <span>OVR</span>
                    <b>
                        ${player.nextFight.opponent.power}
                    </b>
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
        <div class="card">
            <div class="title">
                📅 CALENDÁRIO
            </div>
            <div class="statline">
                <span>Semana atual</span>
                <b>
                    ${player.week} / 52
                </b>
            </div>
            <button
                onclick="nextWeek()">
                ⏭️ AVANÇAR SEMANA
            </button>
        </div>
        <div class="card">
            <button
                class="gray"
                onclick="home()">
                ← VOLTAR
            </button>
        </div>
    `;
}
/* =========================================================
   EQUIPE
========================================================= */
function teamScreen() {
    const content =
        getContent();
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🏢 EQUIPE
            </div>
            <div class="statline">
                <span>
                    Academia
                </span>
                <b>
                    ${
                        player.team
                        ? player.team.name
                        : "Nenhuma"
                    }
                </b>
            </div>
            <div class="statline">
                <span>
                    Empresário
                </span>
                <b>
                    ${
                        player.manager
                        ? player.manager.name
                        : "Nenhum"
                    }
                </b>
            </div>
            <button
                onclick="generateTeamOffers()">
                🔎 PROCURAR ACADEMIA
            </button>
        </div>
        <div class="card">
            <div class="title">
                📋 OFERTAS
            </div>
            ${
                player.teamOffers &&
                player.teamOffers.length
                ?
                player.teamOffers
                    .map(
                        (team, index) => `
                            <div class="card">
                                <div class="title">
                                    🥊 ${team.name}
                                </div>
                                <div class="statline">
                                    <span>OVR da equipe</span>
                                    <b>${team.quality}</b>
                                </div>
                                <div class="statline">
                                    <span>Reputação</span>
                                    <b>${team.reputation}</b>
                                </div>
                                <button
                                    class="green"
                                    onclick="joinTeam(${index})">
                                    ✅ ENTRAR
                                </button>
                            </div>
                        `
                    )
                    .join("")
                :
                `
                    <p>
                        Nenhuma academia encontrada.
                    </p>
                `
            }
        </div>
        <div class="card">
            <button
                class="gray"
                onclick="home()">
                ← VOLTAR
            </button>
        </div>
    `;
}
/* =========================================================
   OFERTAS DE ACADEMIA
========================================================= */
function generateTeamOffers() {
    player.teamOffers = [
        {
            name: "Chute Boxe",
            country: "Brasil",
            city: "Curitiba",
            reputation: 88,
            quality: 90,
            monthlyCost: 300,
            fightFee: 5
        },
        {
            name: "Nova União",
            country: "Brasil",
            city: "Rio de Janeiro",
            reputation: 92,
            quality: 94,
            monthlyCost: 400,
            fightFee: 7
        },
        {
            name: "American Top Team",
            country: "Estados Unidos",
            city: "Florida",
            reputation: 96,
            quality: 97,
            monthlyCost: 700,
            fightFee: 10
        }
    ];
    save();
    teamScreen();
}
function joinTeam(index) {
    if (
        !player.teamOffers ||
        !player.teamOffers[index]
    ) {
        return;
    }
    player.team =
        player.teamOffers[index];
    player.log.unshift(
        `🏢 Você entrou para ${player.team.name}.`
    );
    save();
    alert(
        `Você entrou para ${player.team.name}!`
    );
    teamScreen();
}
/* =========================================================
   VIDA / FAMÍLIA
========================================================= */
function familyScreen() {
    const content =
        getContent();
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
            <div class="statline">
                <span>Geração</span>
                <b>
                    ${
                        player.children.length
                        ? "2ª geração"
                        : "1ª geração"
                    }
                </b>
            </div>
            <div class="statline">
                <span>Filhos</span>
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
        <div class="card">
            <button
                class="gray"
                onclick="home()">
                ← VOLTAR
            </button>
        </div>
    `;
}
function dating() {
    player.relationship =
        "Namorando";
    save();
    familyScreen();
}
function marry() {
    player.relationship =
        "Casado";
    player.married =
        true;
    save();
    familyScreen();
}
function haveChild() {
    if (!player.married) {
        alert(
            "Você precisa estar casado."
        );
        return;
    }
    if (
        player.children.length >= 5
    ) {
        alert(
            "Limite de filhos atingido."
        );
        return;
    }
    const childNumber =
        player.children.length + 1;
    player.children.push({
        name:
            `Filho ${childNumber}`,
        age:
            0
    });
    save();
    familyScreen();
}
/* =========================================================
   RANKINGS
========================================================= */
function rankingScreen() {
    const content =
        getContent();
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🏆 RANKINGS DO MMA
            </div>
            <p>
                Escolha uma organização.
            </p>
        </div>
        <div class="card">
            <div class="title">
                🇧🇷 BRASIL
            </div>
            <button
                onclick="showRankingOrganization('Shooto Brasil')">
                🥋 Shooto Brasil
            </button>
            <button
                onclick="showRankingOrganization('Jungle Fight')">
                🥊 Jungle Fight
            </button>
        </div>
        <div class="card">
            <div class="title">
                🌎 INTERNACIONAL
            </div>
            <button
                onclick="showRankingOrganization('PFL')">
                🏆 PFL
            </button>
            <button
                onclick="showRankingOrganization('ONE Championship')">
                🥊 ONE Championship
            </button>
            <button
                onclick="showRankingOrganization('RIZIN')">
                🇯🇵 RIZIN
            </button>
        </div>
        <div class="card">
            <div class="title">
                👑 ELITE
            </div>
            <button
                onclick="showRankingOrganization('UFC')">
                🥇 UFC
            </button>
        </div>
        <div class="card">
            <button
                class="gray"
                onclick="home()">
                ← VOLTAR
            </button>
        </div>
    `;
}
function showRankingOrganization(
    organization
) {
    const fighters = [
        {
            name: "Carlos Silva",
            wins: 18,
            losses: 3,
            ovr: 86
        },
        {
            name: "Rafael Santos",
            wins: 16,
            losses: 4,
            ovr: 84
        },
        {
            name: "Lucas Almeida",
            wins: 15,
            losses: 5,
            ovr: 82
        },
        {
            name: "Mateus Costa",
            wins: 13,
            losses: 4,
            ovr: 81
        },
        {
            name: "André Lima",
            wins: 12,
            losses: 3,
            ovr: 80
        }
    ];
    getContent().innerHTML = `
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
            <div class="statline">
                <span>
                    Seu OVR
                </span>
                <b>
                    ${getOverall()}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                📊 TOP 5
            </div>
            ${
                fighters.map(
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
                ).join("")
            }
        </div>
        <div class="card">
            <button
                class="gray"
                onclick="rankingScreen()">
                ← VOLTAR
            </button>
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
        "🥊 Parabéns! Você agora é profissional."
    );
    home();
}
/* =========================================================
   FUNÇÕES DE COMPATIBILIDADE
   COM O RESTANTE DO JOGO
========================================================= */
function train(attribute) {
    if (!player.attributes[attribute]) {
        player.attributes[attribute] = 60;
    }
    const potential =
        player.potential || 90;
    if (
        player.attributes[attribute] <
        potential
    ) {
        const gain =
            Math.min(
                0.5,
                potential -
                player.attributes[attribute]
            );
        player.attributes[attribute] =
            Number(
                (
                    player.attributes[attribute] +
                    gain
                ).toFixed(2)
            );
    }
    player.fatigue =
        Math.min(
            100,
            player.fatigue + 8
        );
    save();
    training();
}
function rest() {
    player.fatigue =
        Math.max(
            0,
            player.fatigue - 15
        );
    player.health =
        Math.min(
            100,
            player.health + 5
        );
    save();
    /*
     * DESCANSAR NÃO VOLTA PARA O INÍCIO.
     * Agora avançamos a semana.
     */
    nextWeek();
}
function findFight() {
    player.nextFight = {
        event: {
            name:
                `MMA Fight Night — Semana ${player.week}`
        },
        week:
            player.week,
        purse:
            500,
        opponent: {
            displayName:
                "Adversário Regional",
            country:
                "Brasil",
            power:
                Math.max(
                    55,
                    getOverall() +
                    Math.floor(
                        Math.random() * 11
                    ) - 5
                )
        }
    };
    save();
    fightScreen();
}
function fight() {
    if (!player.nextFight) {
        findFight();
        return;
    }
    const myPower =
        getOverall();
    const enemyPower =
        player.nextFight.opponent.power;
    const chance =
        myPower /
        (
            myPower +
            enemyPower
        );
    const win =
        Math.random() <
        chance;
    if (win) {
        player.professional.wins++;
        player.money +=
            player.nextFight.purse;
        player.fame += 3;
        player.log.unshift(
            "🥊 Você venceu sua última luta!"
        );
    } else {
        player.professional.losses++;
        player.fame =
            Math.max(
                0,
                player.fame - 1
            );
        player.log.unshift(
            "💥 Você perdeu sua última luta."
        );
    }
    player.nextFight =
        null;
    save();
    alert(
        win
        ? "🥊 VITÓRIA!"
        : "💥 DERROTA!"
    );
    home();
}
/* =========================================================
   INICIALIZAÇÃO
========================================================= */
document.addEventListener(
    "DOMContentLoaded",
    function () {
        const loaded =
            load();
        /*
         * Se existir jogador salvo,
         * abre o jogo.
         *
         * Se não existir,
         * mostra a tela CRIAR NOVO LUTADOR.
         */
        if (
            loaded &&
            player.name
        ) {
            home();
        } else {
            startGame();
        }
    }
);
