/* =========================================================
   MMA LIFE DYNASTY
   MAIN.JS — VERSÃO LIMPA E CORRIGIDA
========================================================= */
/* =========================================================
   ESTADO PADRÃO
========================================================= */
const DEFAULT_PLAYER = {
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
   PLAYER
========================================================= */
let player = createDefaultPlayer();
function createDefaultPlayer() {
    return JSON.parse(
        JSON.stringify(DEFAULT_PLAYER)
    );
}
/* =========================================================
   ELEMENTOS
========================================================= */
function $(id) {
    return document.getElementById(id);
}
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
        console.error(
            "Erro ao salvar:",
            error
        );
    }
}
/* =========================================================
   CARREGAR
========================================================= */
function load() {
    const saved =
        localStorage.getItem(
            "mmaLifePlayer"
        );
    if (!saved) {
        return false;
    }
    try {
        const data =
            JSON.parse(saved);
        const base =
            createDefaultPlayer();
        player = {
            ...base,
            ...data,
            professional: {
                ...base.professional,
                ...(data.professional || {})
            },
            amateur: {
                ...base.amateur,
                ...(data.amateur || {})
            },
            attributes: {
                ...base.attributes,
                ...(data.attributes || {})
            },
            trainingPlan: {
                ...base.trainingPlan,
                ...(data.trainingPlan || {})
            }
        };
        return !!player.name;
    } catch (error) {
        console.error(
            "Erro ao carregar:",
            error
        );
        return false;
    }
}
/* =========================================================
   MOSTRAR JOGO
========================================================= */
function showGame() {
    const creation =
        $("creation");
    const game =
        $("game");
    const tabs =
        $("tabs");
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
}
/* =========================================================
   MOSTRAR CRIAÇÃO
========================================================= */
function showCreation() {
    const creation =
        $("creation");
    const game =
        $("game");
    const tabs =
        $("tabs");
    if (creation) {
        creation.classList.remove(
            "hidden"
        );
    }
    if (game) {
        game.classList.add(
            "hidden"
        );
    }
    if (tabs) {
        tabs.classList.add(
            "hidden"
        );
    }
}
/* =========================================================
   TELA INICIAL
========================================================= */
function startGame() {
    showCreation();
    const creator =
        $("creator");
    if (!creator) {
        console.error(
            "Elemento #creator não encontrado."
        );
        return;
    }
    creator.innerHTML = `
        <div class="start-screen">
            <div class="start-logo">
                🥊
            </div>
            <h1>
                MMA LIFE
            </h1>
            <div class="start-subtitle">
                DYNASTY
            </div>
            <p>
                CONSTRUA SUA CARREIRA.<br>
                ESCREVA SEU LEGADO.
            </p>
            <div class="start-preview">
                <div class="start-fighter">
                    🥊
                </div>
                <div>
                    <strong>
                        SUA HISTÓRIA COMEÇA AQUI
                    </strong>
                    <span>
                        Comece como amador,
                        evolua seu lutador,
                        conquiste contratos,
                        títulos e construa
                        sua própria dinastia.
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
    showCreation();
    const creator =
        $("creator");
    if (!creator) {
        return;
    }
    creator.innerHTML = `
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
   CRIAR LUTADOR
========================================================= */
function createPlayerFromScreen() {
    const nameElement =
        $("playerName");
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
    player =
        createDefaultPlayer();
    player.name =
        name;
    const country =
        $("country");
    const weight =
        $("weight");
    const style =
        $("style");
    player.country =
        country
        ? country.value
        : "Brasil";
    player.weight =
        weight
        ? weight.value
        : "Peso Leve";
    player.style =
        style
        ? style.value
        : "Completo";
    /*
     * O lutador começa com OVR 60.
     *
     * O potencial é separado.
     */
    player.potential =
        78 +
        Math.floor(
            Math.random() * 21
        );
    player.log.unshift(
        `🥊 ${player.name} iniciou sua carreira no MMA.`
    );
    save();
    /*
     * IMPORTANTE:
     *
     * Vai para o JOGO,
     * não para #creation.
     */
    showGame();
    home();
}
/* =========================================================
   NAVEGAÇÃO
========================================================= */
function tab(name) {
    if (!player.name) {
        startGame();
        return;
    }
    showGame();
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
        case "calendar":
            calendarScreen();
            break;
        default:
            home();
    }
}
/* =========================================================
   OVERALL
========================================================= */
function getOverall() {
    const a =
        player.attributes || {};
    const values = [
        a.strength,
        a.striking,
        a.wrestling,
        a.grappling,
        a.cardio,
        a.technique,
        a.defense,
        a.fightIQ
    ].map(
        value =>
            Number(value) || 60
    );
    const total =
        values.reduce(
            (sum, value) =>
                sum + value,
            0
        );
    const overall =
        total /
        values.length;
    return Math.min(
        Number(
            player.potential || 98
        ),
        Math.round(
            overall
        )
    );
}
/* =========================================================
   HOME
========================================================= */
function home() {
    showGame();
    const content =
        $("content");
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
                        ${player.name}
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
                    <span>
                        IDADE
                    </span>
                    <strong>
                        ${player.age}
                    </strong>
                </div>
                <div class="stat-card">
                    <span>
                        OVR
                    </span>
                    <strong>
                        ${getOverall()}
                    </strong>
                </div>
                <div class="stat-card">
                    <span>
                        POTENCIAL
                    </span>
                    <strong>
                        ${player.potential}
                    </strong>
                </div>
                <div class="stat-card">
                    <span>
                        SEMANA
                    </span>
                    <strong>
                        ${player.week}/52
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
                        ${pro.wins || 0} -
                        ${pro.losses || 0} -
                        ${pro.draws || 0}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Amador
                    </span>
                    <b>
                        ${amateur.wins || 0} -
                        ${amateur.losses || 0} -
                        ${amateur.draws || 0}
                    </b>
                </div>
                <button
                    class="main-button"
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
                        ${player.week}/52
                    </b>
                </div>
                <button
                    class="main-button"
                    onclick="calendarScreen()">
                    📅 VER CALENDÁRIO
                </button>
                <button
                    class="main-button"
                    onclick="training()">
                    🏋️ CAMP
                </button>
            </div>
            <div class="card">
                <div class="title">
                    🥊 MENU
                </div>
                <button
                    class="main-button"
                    onclick="fightScreen()">
                    ⚔️ LUTAS
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
    showGame();
    const content =
        $("content");
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🏆 MINHA CARREIRA
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
                <span>Idade</span>
                <b>${player.age}</b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                📊 ATRIBUTOS
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
/* =========================================================
   ATRIBUTO
========================================================= */
function attributeRow(
    name,
    attribute
) {
    const value =
        Number(
            player.attributes[
                attribute
            ] || 60
        );
    return `
        <div class="statline">
            <span>
                ${name}
            </span>
            <b>
                ${value.toFixed(2)}
            </b>
        </div>
    `;
}
/* =========================================================
   TREINAMENTO
========================================================= */
function training() {
    showGame();
    player.trainingPlan =
        player.trainingPlan || {
            weeks: {},
            automatic: false
        };
    const plan =
        player.trainingPlan.weeks[
            player.week
        ] || [];
    const content =
        $("content");
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🏋️ CAMP DE TREINAMENTO
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
                    ${player.week}/52
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
                    ${player.potential}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                📅 PLANO DA SEMANA ${player.week}
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
   OPÇÕES DE TREINO
========================================================= */
const TRAINING_OPTIONS = [
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
/* =========================================================
   GERAR CAMP
========================================================= */
function generateTrainingPlan() {
    player.trainingPlan =
        player.trainingPlan || {
            weeks: {},
            automatic: false
        };
    const selected = [];
    while (
        selected.length < 5
    ) {
        const option =
            TRAINING_OPTIONS[
                Math.floor(
                    Math.random() *
                    TRAINING_OPTIONS.length
                )
            ];
        if (
            !selected.some(
                item =>
                    item.attribute ===
                    option[0]
            )
        ) {
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
                            Math.random() *
                            0.50
                        ).toFixed(2)
                    )
            });
        }
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
    const content =
        $("content");
    let html = `
        <div class="card">
            <div class="title">
                ✏️ PROGRAMAR TREINO
            </div>
            <p>
                Semana ${player.week}
            </p>
    `;
    TRAINING_OPTIONS.forEach(
        option => {
            html += `
                <button
                    onclick="addTraining('${option[0]}')">
                    ${option[1]}
                    ${option[2]}
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
    content.innerHTML =
        html;
}
/* =========================================================
   ADICIONAR TREINO
========================================================= */
function addTraining(
    attribute
) {
    const option =
        TRAINING_OPTIONS.find(
            item =>
                item[0] ===
                attribute
        );
    if (!option) {
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
    const current =
        player.trainingPlan.weeks[
            player.week
        ];
    if (
        current.length >= 5
    ) {
        alert(
            "Você já programou 5 treinos para esta semana."
        );
        training();
        return;
    }
    current.push({
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
                    Math.random() *
                    0.50
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
        Number(
            player.week || 1
        );
    player.year =
        Number(
            player.year || 1
        );
    const plan =
        player.trainingPlan &&
        player.trainingPlan.weeks
        ? player.trainingPlan.weeks[
            player.week
        ] || []
        : [];
    /*
     * APLICA TREINAMENTO
     */
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
                current >=
                potential
            ) {
                return;
            }
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
            /*
             * Fadiga do treinamento.
             */
            player.fatigue =
                Math.min(
                    100,
                    player.fatigue + 4
                );
        }
    );
    /*
     * RECUPERAÇÃO
     */
    player.fatigue =
        Math.max(
            0,
            player.fatigue - 10
        );
    player.health =
        Math.min(
            100,
            player.health + 3
        );
    /*
     * AVANÇA A SEMANA
     */
    player.week++;
    /*
     * NOVO ANO
     */
    if (
        player.week > 52
    ) {
        player.week = 1;
        player.year++;
        player.age++;
        player.log.unshift(
            `🎆 Começou o Ano ${player.year}.`
        );
    }
    save();
    /*
     * IMPORTANTE:
     *
     * Nunca volta para
     * a tela de criação.
     */
    home();
}
/* =========================================================
   DESCANSAR
========================================================= */
function rest() {
    /*
     * Descansar agora significa
     * avançar a semana.
     */
    nextWeek();
}
/* =========================================================
   CALENDÁRIO
========================================================= */
function calendarScreen() {
    showGame();
    const content =
        $("content");
    let html = `
        <div class="card">
            <div class="title">
                📅 CALENDÁRIO DA TEMPORADA
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
                    Semana atual
                </span>
                <b>
                    ${player.week}/52
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                📆 SEMANAS
            </div>
    `;
    for (
        let week = 1;
        week <= 52;
        week++
    ) {
        const isCurrent =
            week ===
            Number(player.week);
        const plan =
            player.trainingPlan &&
            player.trainingPlan.weeks
            ? player.trainingPlan.weeks[
                week
            ] || []
            : [];
        html += `
            <div class="statline">
                <span>
                    ${isCurrent ? "👉" : "📅"}
                    Semana ${week}
                </span>
                <b>
                    ${
                        plan.length
                        ? `${plan.length} treinos`
                        : "Livre"
                    }
                </b>
            </div>
        `;
    }
    html += `
        </div>
        <div class="card">
            <button
                onclick="training()">
                🏋️ CAMP
            </button>
            <button
                onclick="nextWeek()">
                ⏭️ PRÓXIMA SEMANA
            </button>
            <button
                class="gray"
                onclick="home()">
                ← VOLTAR
            </button>
        </div>
    `;
    content.innerHTML =
        html;
}
/* =========================================================
   LUTAS
========================================================= */
function fightScreen() {
    showGame();
    const content =
        $("content");
    const fight =
        player.nextFight;
    content.innerHTML = `
        <div class="card">
            <div class="title">
                ⚔️ LUTAS
            </div>
            ${
                fight
                ?
                `
                    <div class="statline">
                        <span>
                            Evento
                        </span>
                        <b>
                            ${fight.event.name}
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Adversário
                        </span>
                        <b>
                            ${fight.opponent.displayName}
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
                    <div class="statline">
                        <span>
                            OVR adversário
                        </span>
                        <b>
                            ${fight.opponent.power}
                        </b>
                    </div>
                    <button
                        class="green"
                        onclick="fight()">
                        🔥 LUTAR
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
                <span>
                    Semana
                </span>
                <b>
                    ${player.week}/52
                </b>
            </div>
            <button
                onclick="calendarScreen()">
                📅 VER CALENDÁRIO
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
   PROCURAR LUTA
========================================================= */
function findFight() {
    const myOVR =
        getOverall();
    const opponentOVR =
        Math.max(
            50,
            myOVR +
            Math.floor(
                Math.random() * 21
            ) -
            10
        );
    player.nextFight = {
        event: {
            name:
                `MMA Fight Night — Semana ${player.week}`
        },
        week:
            player.week,
        purse:
            500 +
            Math.floor(
                Math.random() * 1000
            ),
        opponent: {
            displayName:
                "Adversário Regional",
            country:
                "Brasil",
            power:
                opponentOVR
        }
    };
    save();
    fightScreen();
}
/* =========================================================
   REALIZAR LUTA
========================================================= */
function fight() {
    if (
        !player.nextFight
    ) {
        findFight();
        return;
    }
    const myPower =
        getOverall();
    const enemyPower =
        Number(
            player.nextFight
                .opponent
                .power
        );
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
   EQUIPE
========================================================= */
function teamScreen() {
    showGame();
    const content =
        $("content");
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
                player.teamOffers.map(
                    (team, index) => `
                        <div class="card">
                            <div class="title">
                                🥊 ${team.name}
                            </div>
                            <div class="statline">
                                <span>
                                    OVR equipe
                                </span>
                                <b>
                                    ${team.quality}
                                </b>
                            </div>
                            <div class="statline">
                                <span>
                                    Reputação
                                </span>
                                <b>
                                    ${team.reputation}
                                </b>
                            </div>
                            <button
                                class="green"
                                onclick="joinTeam(${index})">
                                ✅ ENTRAR
                            </button>
                        </div>
                    `
                ).join("")
                :
                `
                    <p>
                        Nenhuma oferta.
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
   OFERTAS DE EQUIPE
========================================================= */
function generateTeamOffers() {
    player.teamOffers = [
        {
            name:
                "Chute Boxe",
            country:
                "Brasil",
            city:
                "Curitiba",
            reputation:
                88,
            quality:
                90
        },
        {
            name:
                "Nova União",
            country:
                "Brasil",
            city:
                "Rio de Janeiro",
            reputation:
                92,
            quality:
                94
        },
        {
            name:
                "American Top Team",
            country:
                "Estados Unidos",
            city:
                "Florida",
            reputation:
                96,
            quality:
                97
        }
    ];
    save();
    teamScreen();
}
/* =========================================================
   ENTRAR NA EQUIPE
========================================================= */
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
   VIDA
========================================================= */
function familyScreen() {
    showGame();
    const content =
        $("content");
    content.innerHTML = `
        <div class="card">
            <div class="title">
                ❤️ VIDA
            </div>
            <div class="statline">
                <span>
                    Idade
                </span>
                <b>
                    ${player.age}
                </b>
            </div>
            <div class="statline">
                <span>
                    Relacionamento
                </span>
                <b>
                    ${player.relationship}
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
            ${
                player.relationship ===
                "Solteiro"
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
                player.relationship ===
                "Namorando"
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
                player.children.map(
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
                ).join("")
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
/* =========================================================
   RELACIONAMENTO
========================================================= */
function dating() {
    player.relationship =
        "Namorando";
    save();
    familyScreen();
}
/* =========================================================
   CASAMENTO
========================================================= */
function marry() {
    player.relationship =
        "Casado";
    player.married =
        true;
    save();
    familyScreen();
}
/* =========================================================
   FILHO
========================================================= */
function haveChild() {
    if (
        !player.married
    ) {
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
    const number =
        player.children.length + 1;
    player.children.push({
        name:
            `Filho ${number}`,
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
    showGame();
    const content =
        $("content");
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
/* =========================================================
   RANKING DA ORGANIZAÇÃO
========================================================= */
function showRankingOrganization(
    organization
) {
    const fighters = [
        {
            name:
                "Carlos Silva",
            wins:
                18,
            losses:
                3,
            ovr:
                86
        },
        {
            name:
                "Rafael Santos",
            wins:
                16,
            losses:
                4,
            ovr:
                84
        },
        {
            name:
                "Lucas Almeida",
            wins:
                15,
            losses:
                5,
            ovr:
                82
        },
        {
            name:
                "Mateus Costa",
            wins:
                13,
            losses:
                4,
            ovr:
                81
        },
        {
            name:
                "André Lima",
            wins:
                12,
            losses:
                3,
            ovr:
                80
        }
    ];
    $("content").innerHTML = `
        <div class="card">
            <div class="title">
                🏆 ${organization}
            </div>
            <div class="statline">
                <span>
                    Sua posição
                </span>
                <b>
                    OVR ${getOverall()}
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
   VIRAR PROFISSIONAL
========================================================= */
function turnProfessional() {
    if (
        player.professional.active
    ) {
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
    home();
}
/* =========================================================
   TREINO MANUAL — COMPATIBILIDADE
========================================================= */
function train(
    attribute
) {
    if (
        !player.attributes[
            attribute
        ]
    ) {
        player.attributes[
            attribute
        ] = 60;
    }
    const current =
        Number(
            player.attributes[
                attribute
            ]
        );
    const potential =
        Number(
            player.potential || 90
        );
    if (
        current <
        potential
    ) {
        const gain =
            Math.min(
                0.50,
                potential -
                current
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
    player.fatigue =
        Math.min(
            100,
            player.fatigue + 8
        );
    save();
    training();
}
/* =========================================================
   REINICIAR JOGO
========================================================= */
function resetGame() {
    const confirmed =
        confirm(
            "Tem certeza que deseja apagar toda a carreira e criar um novo lutador?"
        );
    if (!confirmed) {
        return;
    }
    localStorage.removeItem(
        "mmaLifePlayer"
    );
    player =
        createDefaultPlayer();
    startGame();
}
/* =========================================================
   INICIALIZAÇÃO
========================================================= */
document.addEventListener(
    "DOMContentLoaded",
    function () {
        const loaded =
            load();
        if (
            loaded &&
            player.name
        ) {
            showGame();
            home();
        } else {
            startGame();
        }
    }
);
