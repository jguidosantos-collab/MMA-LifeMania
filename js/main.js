/* =========================================================
   MMA LIFE DYNASTY
   MAIN.JS
   CONTROLADOR PRINCIPAL DA INTERFACE
   VERSÃO ESTÁVEL
========================================================= */
/* =========================================================
   UTILIDADES
========================================================= */
function getElement(id) {
    return document.getElementById(id);
}
function $(id) {
    return document.getElementById(id);
}
/* =========================================================
   GARANTIR PLAYER
========================================================= */
function ensureMainPlayer() {
    if (
        typeof window.player === "undefined" ||
        !window.player
    ) {
        if (
            typeof window.createDefaultPlayer ===
            "function"
        ) {
            window.createDefaultPlayer();
        }
    }
    return window.player;
}
/* =========================================================
   NORMALIZAR PLAYER
========================================================= */
function normalizeMainPlayer() {
    const p = ensureMainPlayer();
    if (!p) {
        return null;
    }
    p.name = p.name || "";
    p.country = p.country || "Brasil";
    p.weight = p.weight || "Peso Leve";
    p.style = p.style || "Completo";
    p.age = Number(p.age || 15);
    p.week = Number(
        p.week ?? 0
    );
    p.year = Number(
        p.year || 2026
    );
    p.money = Number(
        p.money || 0
    );
    p.fame = Number(
        p.fame || 0
    );
    p.health = Number(
        p.health ?? 100
    );
    p.fatigue = Number(
        p.fatigue || 0
    );
    p.potential = Number(
        p.potential || 78
    );
    p.attributes =
        p.attributes || {};
    p.amateur =
        p.amateur || {
            wins: 0,
            losses: 0,
            draws: 0,
            ranking: 50
        };
    p.professional =
        p.professional || {
            active: false,
            wins: 0,
            losses: 0,
            draws: 0,
            ranking: null
        };
    p.trainingPlan =
        p.trainingPlan || {
            weeks: {}
        };
    p.trainingPlan.weeks =
        p.trainingPlan.weeks || {};
    p.children =
        Array.isArray(p.children)
        ? p.children
        : [];
    p.log =
        Array.isArray(p.log)
        ? p.log
        : [];
    return p;
}
/* =========================================================
   SALVAR
========================================================= */
function mainSave() {
    try {
        if (
            typeof window.save ===
            "function"
        ) {
            window.save();
            return;
        }
        const p =
            normalizeMainPlayer();
        if (!p) {
            return;
        }
        localStorage.setItem(
            "mmaLifePlayer",
            JSON.stringify(p)
        );
    }
    catch (error) {
        console.error(
            "Erro ao salvar:",
            error
        );
    }
}
/* =========================================================
   MOSTRAR JOGO
========================================================= */
function showGame() {
    const creation =
        getElement("creation");
    const game =
        getElement("game");
    const tabs =
        getElement("tabs");
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
        getElement("creation");
    const game =
        getElement("game");
    const tabs =
        getElement("tabs");
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
   OVR
========================================================= */
function getOverall() {
    const p =
        normalizeMainPlayer();
    if (!p) {
        return 0;
    }
    if (
        typeof p.overall ===
        "number"
    ) {
        const attrs =
            p.attributes || {};
        const keys = [
            "strength",
            "striking",
            "wrestling",
            "grappling",
            "cardio",
            "technique",
            "defense",
            "fightIQ"
        ];
        const values =
            keys
            .map(
                key =>
                    Number(
                        attrs[key]
                    )
            )
            .filter(
                value =>
                    Number.isFinite(
                        value
                    )
            );
        if (values.length) {
            const average =
                values.reduce(
                    (
                        total,
                        value
                    ) =>
                        total + value,
                    0
                ) /
                values.length;
            return Math.min(
                Number(
                    p.potential || 99
                ),
                Math.round(
                    average
                )
            );
        }
        return Number(
            p.overall
        );
    }
    return 0;
}
/* =========================================================
   TELA INICIAL
========================================================= */
function startGame() {
    showCreation();
    const creator =
        getElement("creator");
    if (!creator) {
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
                onclick="openCharacterCreation()"
            >
                🆕 CRIAR NOVO LUTADOR
            </button>
            <div class="start-footer">
                AMADOR →
                REGIONAL →
                NACIONAL →
                INTERNACIONAL →
                ELITE
            </div>
        </div>
    `;
}
/* =========================================================
   CRIAÇÃO
========================================================= */
function openCharacterCreation() {
    showCreation();
    const creator =
        getElement("creator");
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
                onclick="createPlayerFromScreen()"
            >
                ✅ CRIAR LUTADOR
            </button>
            <button
                class="gray"
                onclick="startGame()"
            >
                ← VOLTAR
            </button>
        </div>
    `;
}
/* =========================================================
   CRIAR LUTADOR
========================================================= */
function createPlayerFromScreen() {
    const input =
        getElement("playerName");
    if (!input) {
        return;
    }
    const name =
        input.value.trim();
    if (!name) {
        alert(
            "Digite o nome do lutador."
        );
        return;
    }
    if (
        typeof window.createDefaultPlayer ===
        "function"
    ) {
        window.createDefaultPlayer();
    }
    const p =
        normalizeMainPlayer();
    if (!p) {
        return;
    }
    p.name =
        name;
    const country =
        getElement("country");
    const weight =
        getElement("weight");
    const style =
        getElement("style");
    p.country =
        country
        ? country.value
        : "Brasil";
    p.weight =
        weight
        ? weight.value
        : "Peso Leve";
    p.style =
        style
        ? style.value
        : "Completo";
    p.log =
        Array.isArray(p.log)
        ? p.log
        : [];
    p.log.unshift(
        `🥊 ${p.name} iniciou sua carreira no MMA.`
    );
    mainSave();
    showGame();
    home();
}
/* =========================================================
   NAVEGAÇÃO
========================================================= */
function tab(name) {
    const p =
        normalizeMainPlayer();
    if (!p || !p.name) {
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
            if (
                typeof window.training ===
                "function"
            ) {
                window.training();
            }
            else {
                trainingFallback();
            }
            break;
        case "fight":
            if (
                typeof window.fightScreen ===
                "function"
            ) {
                window.fightScreen();
            }
            else {
                fightFallback();
            }
            break;
        case "team":
            if (
                typeof window.teamScreen ===
                "function"
            ) {
                window.teamScreen();
            }
            else {
                teamFallback();
            }
            break;
        case "life":
            if (
                typeof window.familyScreen ===
                "function"
            ) {
                window.familyScreen();
            }
            else {
                lifeFallback();
            }
            break;
        case "ranking":
            if (
                typeof window.rankingScreen ===
                "function"
            ) {
                window.rankingScreen();
            }
            else {
                rankingFallback();
            }
            break;
        default:
            home();
    }
}
/* =========================================================
   HOME
========================================================= */
function home() {
    const p =
        normalizeMainPlayer();
    if (!p) {
        startGame();
        return;
    }
    if (!p.name) {
        startGame();
        return;
    }
    showGame();
    const content =
        getElement("content");
    if (!content) {
        return;
    }
    const amateur =
        p.amateur || {};
    const professional =
        p.professional || {};
    const team =
        p.team;
    const manager =
        p.manager;
    let statusText =
        "Disponível";
    let statusIcon =
        "🟢";
    if (
        p.postFightRestActive
    ) {
        statusText =
            `Descanso pós-luta: ${p.postFightRestWeeks || 0} semanas`;
        statusIcon =
            "😴";
    }
    else if (
        p.managerSearching
    ) {
        statusText =
            "Empresário procurando luta";
        statusIcon =
            "📞";
    }
    else if (
        p.nextFight
    ) {
        statusText =
            "Luta agendada";
        statusIcon =
            "🥊";
    }
    content.innerHTML = `
        <div class="home-container">
            <div class="fighter-header">
                <div class="fighter-avatar">
                    🥊
                </div>
                <div class="fighter-info">
                    <div class="fighter-name">
                        ${p.name}
                    </div>
                    <div>
                        ${p.country}
                    </div>
                    <div>
                        ${p.weight}
                    </div>
                </div>
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <span>
                        IDADE
                    </span>
                    <strong>
                        ${p.age}
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
                        ${p.potential}
                    </strong>
                </div>
                <div class="stat-card">
                    <span>
                        SEMANA
                    </span>
                    <strong>
                        ${p.week}/52
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
                        ${p.careerStage || "amateur"}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Amador
                    </span>
                    <b>
                        ${amateur.wins || 0}
                        -
                        ${amateur.losses || 0}
                        -
                        ${amateur.draws || 0}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Profissional
                    </span>
                    <b>
                        ${professional.wins || 0}
                        -
                        ${professional.losses || 0}
                        -
                        ${professional.draws || 0}
                    </b>
                </div>
                <button
                    class="main-button"
                    onclick="career()"
                >
                    🏆 CARREIRA
                </button>
            </div>
            <div class="card">
                <div class="title">
                    📅 STATUS DA CARREIRA
                </div>
                <div class="statline">
                    <span>
                        Situação
                    </span>
                    <b>
                        ${statusIcon}
                        ${statusText}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Ano
                    </span>
                    <b>
                        ${p.year}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Semana
                    </span>
                    <b>
                        ${p.week}/52
                    </b>
                </div>
            </div>
            <div class="card">
                <div class="title">
                    🏋️ TREINAMENTO
                </div>
                <div class="statline">
                    <span>
                        Saúde
                    </span>
                    <b>
                        ${Math.round(p.health)}%
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Fadiga
                    </span>
                    <b>
                        ${Math.round(p.fatigue)}%
                    </b>
                </div>
                <button
                    class="main-button"
                    onclick="openTraining()"
                >
                    🏋️ TREINO
                </button>
                <button
                    class="main-button"
                    onclick="openCamp()"
                >
                    🥊 CAMP
                </button>
                <button
                    class="main-button"
                    onclick="nextWeek()"
                >
                    ⏭️ AVANÇAR SEMANA
                </button>
            </div>
            <div class="card">
                <div class="title">
                    🥊 CARREIRA DE COMBATE
                </div>
                <button
                    class="main-button"
                    onclick="openFight()"
                >
                    ⚔️ LUTAS
                </button>
                <button
                    class="main-button"
                    onclick="openTeam()"
                >
                    🏢 EQUIPE
                </button>
                <button
                    class="main-button"
                    onclick="openLife()"
                >
                    ❤️ VIDA
                </button>
                <button
                    class="main-button"
                    onclick="openRanking()"
                >
                    🏆 RANKING
                </button>
            </div>
            <div class="card">
                <div class="title">
                    👔 ESTRUTURA
                </div>
                <div class="statline">
                    <span>
                        Empresário
                    </span>
                    <b>
                        ${
                            manager
                            ? manager.name
                            : "Nenhum"
                        }
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Equipe
                    </span>
                    <b>
                        ${
                            team
                            ? team.name
                            : "Nenhuma"
                        }
                    </b>
                </div>
            </div>
            <div class="card">
                <div class="title">
                    💰 FINANÇAS
                </div>
                <div class="statline">
                    <span>
                        Dinheiro
                    </span>
                    <b>
                        $${Math.round(p.money)}
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Fama
                    </span>
                    <b>
                        ${Math.round(p.fame)}
                    </b>
                </div>
            </div>
            <div class="card">
                <div class="title">
                    ⚙️ SISTEMA
                </div>
                <button
                    class="gray"
                    onclick="resetGame()"
                >
                    🔄 REINICIAR JOGO
                </button>
            </div>
        </div>
    `;
}
/* =========================================================
   BOTÃO TREINO
========================================================= */
function openTraining() {
    showGame();
    if (
        typeof window.training ===
        "function"
    ) {
        window.training();
        return;
    }
    trainingFallback();
}
/* =========================================================
   BOTÃO CAMP
========================================================= */
function openCamp() {
    showGame();
    if (
        typeof window.campScreen ===
        "function"
    ) {
        window.campScreen();
        return;
    }
    trainingFallback();
}
/* =========================================================
   BOTÃO LUTAS
========================================================= */
function openFight() {
    showGame();
    if (
        typeof window.fightScreen ===
        "function"
    ) {
        window.fightScreen();
        return;
    }
    fightFallback();
}
/* =========================================================
   BOTÃO EQUIPE
========================================================= */
function openTeam() {
    showGame();
    if (
        typeof window.teamScreen ===
        "function"
    ) {
        window.teamScreen();
        return;
    }
    teamFallback();
}
/* =========================================================
   BOTÃO VIDA
========================================================= */
function openLife() {
    showGame();
    if (
        typeof window.familyScreen ===
        "function"
    ) {
        window.familyScreen();
        return;
    }
    lifeFallback();
}
/* =========================================================
   BOTÃO RANKING
========================================================= */
function openRanking() {
    showGame();
    if (
        typeof window.rankingScreen ===
        "function"
    ) {
        window.rankingScreen();
        return;
    }
    rankingFallback();
}
/* =========================================================
   CARREIRA
========================================================= */
function career() {
    const p =
        normalizeMainPlayer();
    if (!p) {
        return;
    }
    showGame();
    const content =
        getElement("content");
    if (!content) {
        return;
    }
    const attributes =
        p.attributes || {};
    const rows = [
        ["💪 Força", "strength"],
        ["🥊 Striking", "striking"],
        ["🤼 Wrestling", "wrestling"],
        ["🥋 Grappling", "grappling"],
        ["🫀 Cardio", "cardio"],
        ["🎯 Técnica", "technique"],
        ["🛡️ Defesa", "defense"],
        ["🧠 Fight IQ", "fightIQ"],
        ["🦷 Queixo", "chin"],
        ["⚔️ Ofensivo", "offense"],
        ["🛡️ Bloqueio", "blocking"]
    ];
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🏆 MINHA CARREIRA
            </div>
            <div class="statline">
                <span>
                    Lutador
                </span>
                <b>
                    ${p.name}
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
                    ${p.potential}
                </b>
            </div>
            <div class="statline">
                <span>
                    Idade
                </span>
                <b>
                    ${p.age}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                📊 ATRIBUTOS
            </div>
            ${
                rows
                .map(
                    row => `
                        <div class="statline">
                            <span>
                                ${row[0]}
                            </span>
                            <b>
                                ${Number(
                                    attributes[row[1]] || 0
                                ).toFixed(1)}
                            </b>
                        </div>
                    `
                )
                .join("")
            }
        </div>
        <div class="card">
            <button
                class="gray"
                onclick="home()"
            >
                ← VOLTAR
            </button>
        </div>
    `;
}
/* =========================================================
   AVANÇAR SEMANA
   FLUXO PRINCIPAL
========================================================= */
function nextWeek() {
    const p =
        normalizeMainPlayer();
    if (!p) {
        return;
    }
    /* =====================================================
       1 — PROCESSAR CAMP DA SEMANA
    ===================================================== */
    if (
        p.trainingCamp &&
        Array.isArray(
            p.trainingCamp.weeks
        )
    ) {
        const camp =
            p.trainingCamp.weeks;
        const campIndex =
            Number(
                p.trainingCamp.currentWeek || 0
            );
        if (
            campIndex >= 0 &&
            campIndex < camp.length &&
            typeof window.processCampWeek ===
            "function"
        ) {
            window.processCampWeek(
                camp[campIndex]
            );
            p.trainingCamp.currentWeek =
                campIndex + 1;
        }
    }
    /* =====================================================
       2 — PLANO DE TREINO NORMAL
    ===================================================== */
    const plan =
        p.trainingPlan &&
        p.trainingPlan.weeks
        ? p.trainingPlan.weeks[p.week] || []
        : [];
    if (
        plan.length &&
        !p.nextFight
    ) {
        plan.forEach(
            treino => {
                const attribute =
                    treino.attribute;
                if (
                    !attribute ||
                    !p.attributes
                ) {
                    return;
                }
                const current =
                    Number(
                        p.attributes[
                            attribute
                        ] || 45
                    );
                const potential =
                    Number(
                        p.potential || 90
                    );
                if (
                    current >=
                    potential
                ) {
                    return;
                }
                const gain =
                    Math.min(
                        Number(
                            treino.gain || 0.5
                        ),
                        potential -
                        current
                    );
                p.attributes[
                    attribute
                ] =
                    Number(
                        (
                            current +
                            gain
                        ).toFixed(2)
                    );
                p.fatigue =
                    Math.min(
                        100,
                        Number(
                            p.fatigue || 0
                        ) + 4
                    );
            }
        );
    }
    /* =====================================================
       3 — RECUPERAÇÃO
    ===================================================== */
    p.fatigue =
        Math.max(
            0,
            Number(
                p.fatigue || 0
            ) - 10
        );
    p.health =
        Math.min(
            100,
            Number(
                p.health || 100
            ) + 3
        );
    /* =====================================================
       4 — DESCANSO PÓS-LUTA
    ===================================================== */
    if (
        p.postFightRestActive
    ) {
        p.postFightRestWeeks =
            Math.max(
                0,
                Number(
                    p.postFightRestWeeks || 0
                ) - 1
            );
        p.fatigue =
            Math.max(
                0,
                p.fatigue - 15
            );
        p.health =
            Math.min(
                100,
                p.health + 6
            );
        if (
            p.postFightRestWeeks <= 0
        ) {
            p.postFightRestActive =
                false;
            p.managerSearchAfterRest =
                true;
            p.managerNextSearchWeek =
                p.week + 1;
        }
    }
    /* =====================================================
       5 — EMPRESÁRIO
    ===================================================== */
    if (
        p.manager &&
        !p.nextFight &&
        !p.postFightRestActive
    ) {
        const searchWeek =
            Number(
                p.managerNextSearchWeek || 0
            );
        if (
            p.week >=
            searchWeek
        ) {
            p.managerSearchAfterRest =
                true;
        }
    }
    /* =====================================================
       6 — AVANÇAR SEMANA
    ===================================================== */
    p.week =
        Number(
            p.week || 0
        ) + 1;
    /* =====================================================
       7 — NOVO ANO
    ===================================================== */
    if (
        p.week > 52
    ) {
        p.week = 1;
        p.year =
            Number(
                p.year || 2026
            ) + 1;
        p.age =
            Number(
                p.age || 15
            ) + 1;
        p.log =
            p.log || [];
        p.log.unshift(
            `🎆 Começou o ano ${p.year}.`
        );
    }
    /* =====================================================
       8 — EMPRESÁRIO PROCURA OPORTUNIDADE
    ===================================================== */
    if (
        p.manager &&
        !p.nextFight &&
        !p.postFightRestActive &&
        p.managerSearchAfterRest &&
        typeof window.managerSearchForFight ===
        "function"
    ) {
        try {
            window.managerSearchForFight();
        }
        catch (error) {
            console.warn(
                "Busca do empresário:",
                error
            );
        }
    }
    mainSave();
    home();
}
/* =========================================================
   DESCANSAR
========================================================= */
function rest() {
    nextWeek();
}
/* =========================================================
   FALLBACK TREINO
========================================================= */
function trainingFallback() {
    const content =
        getElement("content");
    if (!content) {
        return;
    }
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🏋️ TREINAMENTO
            </div>
            <p>
                Sistema de treinamento carregado.
            </p>
            <button
                class="main-button"
                onclick="nextWeek()"
            >
                ⏭️ AVANÇAR SEMANA
            </button>
            <button
                class="gray"
                onclick="home()"
            >
                ← VOLTAR
            </button>
        </div>
    `;
}
/* =========================================================
   FALLBACK LUTAS
========================================================= */
function fightFallback() {
    const content =
        getElement("content");
    if (!content) {
        return;
    }
    const p =
        normalizeMainPlayer();
    content.innerHTML = `
        <div class="card">
            <div class="title">
                ⚔️ LUTAS
            </div>
            <p>
                O sistema de lutas está sendo carregado.
            </p>
            ${
                p && p.nextFight
                ?
                `
                    <div class="statline">
                        <span>
                            Luta marcada
                        </span>
                        <b>
                            Sim
                        </b>
                    </div>
                `
                :
                `
                    <div class="statline">
                        <span>
                            Luta
                        </span>
                        <b>
                            Nenhuma marcada
                        </b>
                    </div>
                `
            }
            <button
                class="gray"
                onclick="home()"
            >
                ← VOLTAR
            </button>
        </div>
    `;
}
/* =========================================================
   FALLBACK EQUIPE
========================================================= */
function teamFallback() {
    const content =
        getElement("content");
    if (!content) {
        return;
    }
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🏢 EQUIPE
            </div>
            <p>
                Sistema de equipes carregado.
            </p>
            <button
                class="gray"
                onclick="home()"
            >
                ← VOLTAR
            </button>
        </div>
    `;
}
/* =========================================================
   FALLBACK VIDA
========================================================= */
function lifeFallback() {
    const content =
        getElement("content");
    if (!content) {
        return;
    }
    content.innerHTML = `
        <div class="card">
            <div class="title">
                ❤️ VIDA
            </div>
            <p>
                Sistema de vida carregado.
            </p>
            <button
                class="gray"
                onclick="home()"
            >
                ← VOLTAR
            </button>
        </div>
    `;
}
/* =========================================================
   FALLBACK RANKING
========================================================= */
function rankingFallback() {
    const content =
        getElement("content");
    if (!content) {
        return;
    }
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🏆 RANKING
            </div>
            <p>
                Sistema de rankings carregado.
            </p>
            <button
                class="gray"
                onclick="home()"
            >
                ← VOLTAR
            </button>
        </div>
    `;
}
/* =========================================================
   RESET
========================================================= */
function resetGame() {
    const confirmed =
        confirm(
            "Tem certeza que deseja apagar toda a carreira?"
        );
    if (!confirmed) {
        return;
    }
    localStorage.removeItem(
        "mmaLifePlayer"
    );
    if (
        typeof window.createDefaultPlayer ===
        "function"
    ) {
        window.createDefaultPlayer();
    }
    startGame();
}
/* =========================================================
   EXPOR FUNÇÕES
========================================================= */
window.getElement =
    getElement;
window.$ =
    $;
window.showGame =
    showGame;
window.showCreation =
    showCreation;
window.startGame =
    startGame;
window.openCharacterCreation =
    openCharacterCreation;
window.createPlayerFromScreen =
    createPlayerFromScreen;
window.getOverall =
    getOverall;
window.tab =
    tab;
window.home =
    home;
window.career =
    career;
window.nextWeek =
    nextWeek;
window.rest =
    rest;
window.openTraining =
    openTraining;
window.openCamp =
    openCamp;
window.openFight =
    openFight;
window.openTeam =
    openTeam;
window.openLife =
    openLife;
window.openRanking =
    openRanking;
window.resetGame =
    resetGame;
/* =========================================================
   INICIALIZAÇÃO
========================================================= */
document.addEventListener(
    "DOMContentLoaded",
    function () {
        try {
            let loaded =
                false;
            if (
                typeof window.load ===
                "function"
            ) {
                loaded =
                    window.load();
            }
            const p =
                normalizeMainPlayer();
            if (
    p &&
    p.name
) {
    showGame();
    home();
}
else {
    startGame();
}
        }
        catch (error) {
            console.error(
                "Erro na inicialização:",
                error
            );
            try {
                showGame();
                const p =
                    normalizeMainPlayer();
                if (
                    p &&
                    p.name
                ) {
                    home();
                }
                else {
                    startGame();
                }
            }
            catch (
                fatalError
            ) {
                console.error(
                    "Erro fatal:",
                    fatalError
                );
            }
        }
    }
);
