/* =========================================================
   MMA LIFE DYNASTY
   MAIN.JS
   CONTROLADOR PRINCIPAL
   VERSÃO CORRIGIDA
========================================================= */
/* =========================================================
   UTILIDADES
========================================================= */
function $(id) {
    return document.getElementById(id);
}
/* =========================================================
   GARANTIR ESTRUTURA DO PLAYER
========================================================= */
function normalizePlayer() {
    if (
        typeof player === "undefined" ||
        !player ||
        typeof player !== "object"
    ) {
        if (typeof createDefaultPlayer === "function") {
            createDefaultPlayer();
        }
    }
    if (!player) {
        return;
    }
    player.name =
        player.name || "";
    player.country =
        player.country || "Brasil";
    player.weight =
        player.weight || "Peso Leve";
    player.style =
        player.style || "Completo";
    player.age =
        Number(player.age || 15);
    player.week =
        Number(player.week || 0);
    player.year =
        Number(player.year || 2026);
    player.money =
        Number(player.money || 0);
    player.fame =
        Number(player.fame || 0);
    player.health =
        Number(player.health ?? 100);
    player.fatigue =
        Number(player.fatigue || 0);
    player.potential =
        Number(player.potential || 78);
    player.careerStage =
        player.careerStage || "amateur";
    player.amateur =
        player.amateur || {
            wins: 0,
            losses: 0,
            draws: 0,
            ranking: 50
        };
    player.professional =
        player.professional || {
            active: false,
            wins: 0,
            losses: 0,
            draws: 0,
            ranking: null
        };
    player.attributes =
        player.attributes || {};
    player.team =
        player.team || null;
    player.teamOffers =
        Array.isArray(player.teamOffers)
        ? player.teamOffers
        : [];
    player.manager =
        player.manager || null;
    player.managerOffers =
        Array.isArray(player.managerOffers)
        ? player.managerOffers
        : [];
    player.nextFight =
        player.nextFight || null;
    player.trainingPlan =
        player.trainingPlan || {
            weeks: {}
        };
    player.trainingPlan.weeks =
        player.trainingPlan.weeks || {};
    player.children =
        Array.isArray(player.children)
        ? player.children
        : [];
    player.relationship =
        player.relationship || "Solteiro";
    player.married =
        Boolean(player.married);
    player.log =
        Array.isArray(player.log)
        ? player.log
        : [];
    return player;
}
/* =========================================================
   SALVAMENTO
========================================================= */
function mainSave() {
    try {
        if (
            typeof save === "function"
        ) {
            save();
            return;
        }
        localStorage.setItem(
            "mmaLifePlayer",
            JSON.stringify(player)
        );
    } catch (error) {
        console.error(
            "Erro ao salvar jogador:",
            error
        );
    }
}
/* =========================================================
   CARREGAMENTO
========================================================= */
function mainLoad() {
    try {
        if (
            typeof load === "function"
        ) {
            const result =
                load();
            normalizePlayer();
            return result;
        }
        const saved =
            localStorage.getItem(
                "mmaLifePlayer"
            );
        if (!saved) {
            return false;
        }
        const data =
            JSON.parse(saved);
        if (
            typeof player === "undefined" ||
            !player
        ) {
            if (
                typeof createDefaultPlayer ===
                "function"
            ) {
                createDefaultPlayer();
            }
        }
        Object.assign(
            player,
            data
        );
        normalizePlayer();
        return Boolean(
            player.name
        );
    } catch (error) {
        console.error(
            "Erro ao carregar jogador:",
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
   CRIAR JOGADOR
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
    /*
       IMPORTANTE:
       Não criamos outro objeto manualmente.
       O player.js já possui
       createDefaultPlayer().
    */
    if (
        typeof createDefaultPlayer ===
        "function"
    ) {
        createDefaultPlayer();
    }
    normalizePlayer();
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
       O potencial já é gerado
       pelo player.js.
       Não sobrescrevemos aqui.
    */
    player.log =
        Array.isArray(player.log)
        ? player.log
        : [];
    player.log.unshift(
        `🥊 ${player.name} iniciou sua carreira no MMA.`
    );
    mainSave();
    normalizePlayer();
    showGame();
    home();
}
/* =========================================================
   OVERALL
========================================================= */
function getOverall() {
    normalizePlayer();
    if (
        !player ||
        !player.attributes
    ) {
        return 0;
    }
    /*
       Se o player.js possui
       um overall inicial, usamos
       os atributos para calcular
       o OVR atual.
       Isso evita o OVR ficar
       travado.
    */
    const a =
        player.attributes;
    const values = [
        Number(a.strength),
        Number(a.striking),
        Number(a.wrestling),
        Number(a.grappling),
        Number(a.cardio),
        Number(a.technique),
        Number(a.defense),
        Number(a.fightIQ)
    ].filter(
        value =>
            Number.isFinite(value)
    );
    if (!values.length) {
        return Number(
            player.overall || 0
        );
    }
    const total =
        values.reduce(
            (sum, value) =>
                sum + value,
            0
        );
    const overall =
        Math.round(
            total /
            values.length
        );
    return Math.min(
        Number(
            player.potential || 99
        ),
        overall
    );
}
/* =========================================================
   HOME
========================================================= */
function home() {
    normalizePlayer();
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
    const team =
        player.team;
    const manager =
        player.manager;
    content.innerHTML = `
        <div class="home-container">
            <div class="fighter-header">
                <div class="fighter-avatar">
                    🥊
                </div>
                <div class="fighter-info">
                    <div class="fighter-name">
                        ${player.name || "Novo Lutador"}
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
                        ${pro.wins || 0}
                        -
                        ${pro.losses || 0}
                        -
                        ${pro.draws || 0}
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
                    🏋️ TREINAMENTO
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
                <button
                    class="main-button"
                    onclick="training()"
                >
                    🏋️ CAMP
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
                    onclick="calendarScreen()"
                >
                    📅 VER CALENDÁRIO
                </button>
            </div>
            <div class="card">
                <div class="title">
                    ⚔️ LUTAS
                </div>
                <div class="statline">
                    <span>
                        Próxima luta
                    </span>
                    <b>
                        ${
                            player.nextFight
                            ? "Marcada"
                            : "Nenhuma"
                        }
                    </b>
                </div>
                <button
                    class="main-button"
                    onclick="fightScreen()"
                >
                    ⚔️ LUTAS
                </button>
            </div>
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
                            team
                            ? team.name
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
                            manager
                            ? manager.name
                            : "Nenhum"
                        }
                    </b>
                </div>
                <button
                    class="main-button"
                    onclick="teamScreen()"
                >
                    🏢 EQUIPE
                </button>
            </div>
            <div class="card">
                <div class="title">
                    ❤️ VIDA
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
                        Filhos
                    </span>
                    <b>
                        ${player.children.length}
                    </b>
                </div>
                <button
                    class="main-button"
                    onclick="familyScreen()"
                >
                    ❤️ VIDA
                </button>
            </div>
            <div class="card">
                <div class="title">
                    🏆 RANKING
                </div>
                <button
                    class="main-button"
                    onclick="rankingScreen()"
                >
                    🏆 VER RANKINGS
                </button>
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
                        $${Math.round(player.money)}
                    </b>
                </div>
            </div>
            <div class="card">
                <div class="title">
                    ⚙️ SISTEMA
                </div>
                <button
                    class="main-button gray"
                    onclick="resetGame()"
                >
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
    normalizePlayer();
    showGame();
    const content =
        $("content");
    if (!content) {
        return;
    }
    const attributes =
        player.attributes || {};
    const names = {
        strength: "💪 Força",
        striking: "🥊 Striking",
        wrestling: "🤼 Wrestling",
        grappling: "🥋 Grappling",
        cardio: "🏃 Cardio",
        technique: "🎯 Técnica",
        defense: "🛡️ Defesa",
        fightIQ: "🧠 Fight IQ",
        chin: "🦷 Queixo",
        offense: "⚔️ Ofensivo",
        blocking: "🛡️ Bloqueio",
        mental: "🧠 Mental",
        discipline: "🎯 Disciplina",
        confidence: "🔥 Confiança"
    };
    let rows = "";
    Object.keys(names)
        .forEach(
            key => {
                const value =
                    Number(
                        attributes[key] || 0
                    );
                rows += `
                    <div class="statline">
                        <span>
                            ${names[key]}
                        </span>
                        <b>
                            ${value.toFixed(2)}
                        </b>
                    </div>
                `;
            }
        );
    content.innerHTML = `
        <div class="card">
            <div class="title">
                🏆 MINHA CARREIRA
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
                    Estágio
                </span>
                <b>
                    ${player.careerStage}
                </b>
            </div>
        </div>
        <div class="card">
            <div class="title">
                📊 ATRIBUTOS
            </div>
            ${rows}
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
   NAVEGAÇÃO
========================================================= */
function tab(name) {
    normalizePlayer();
    if (
        !player.name
    ) {
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
                typeof training ===
                "function"
            ) {
                training();
            }
            break;
        case "fight":
            if (
                typeof fightScreen ===
                "function"
            ) {
                fightScreen();
            }
            break;
        case "team":
            if (
                typeof teamScreen ===
                "function"
            ) {
                teamScreen();
            }
            break;
        case "life":
            if (
                typeof familyScreen ===
                "function"
            ) {
                familyScreen();
            }
            break;
        case "ranking":
            if (
                typeof rankingScreen ===
                "function"
            ) {
                rankingScreen();
            }
            break;
        case "calendar":
            if (
                typeof calendarScreen ===
                "function"
            ) {
                calendarScreen();
            }
            break;
        default:
            home();
    }
}
/* =========================================================
   RESET
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
    /*
       Também remove o save antigo
       caso exista de versões anteriores.
    */
    localStorage.removeItem(
        "mmaLifeDynastyV1"
    );
    if (
        typeof createDefaultPlayer ===
        "function"
    ) {
        createDefaultPlayer();
    }
    normalizePlayer();
    showCreation();
    startGame();
}
/* =========================================================
   COMPATIBILIDADE — DESCANSO
========================================================= */
function rest() {
    if (
        typeof nextWeek ===
        "function"
    ) {
        nextWeek();
        return;
    }
    if (
        typeof advanceWeek ===
        "function"
    ) {
        advanceWeek();
        return;
    }
    player.week =
        Number(player.week || 0) + 1;
    if (
        player.week > 52
    ) {
        player.week = 1;
        player.year =
            Number(player.year || 2026) + 1;
        player.age =
            Number(player.age || 15) + 1;
    }
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
    mainSave();
    home();
}
/* =========================================================
   TREINO MANUAL — COMPATIBILIDADE
========================================================= */
function train(attribute) {
    normalizePlayer();
    if (
        !attribute
    ) {
        return;
    }
    if (
        !player.attributes[attribute]
    ) {
        player.attributes[attribute] =
            45;
    }
    const current =
        Number(
            player.attributes[attribute]
        );
    const potential =
        Number(
            player.potential || 99
        );
    if (
        current < potential
    ) {
        player.attributes[attribute] =
            Number(
                Math.min(
                    potential,
                    current + 0.5
                ).toFixed(2)
            );
    }
    player.fatigue =
        Math.min(
            100,
            Number(
                player.fatigue || 0
            ) + 8
        );
    mainSave();
    if (
        typeof training ===
        "function"
    ) {
        training();
    } else {
        home();
    }
}
/* =========================================================
   AVANÇAR SEMANA — COMPATIBILIDADE
========================================================= */
function nextWeek() {
    normalizePlayer();
    const plan =
        player.trainingPlan &&
        player.trainingPlan.weeks
        ? player.trainingPlan.weeks[
            player.week
        ] || []
        : [];
    /*
       Aplica os treinos programados.
    */
    plan.forEach(
        treino => {
            if (
                !treino ||
                !treino.attribute
            ) {
                return;
            }
            const attribute =
                treino.attribute;
            const current =
                Number(
                    player.attributes[
                        attribute
                    ] || 0
                );
            const potential =
                Number(
                    player.potential || 99
                );
            if (
                current >= potential
            ) {
                return;
            }
            const gain =
                Number(
                    treino.gain || 0.5
                );
            player.attributes[
                attribute
            ] =
                Number(
                    Math.min(
                        potential,
                        current + gain
                    ).toFixed(2)
                );
            player.fatigue =
                Math.min(
                    100,
                    Number(
                        player.fatigue || 0
                    ) + 4
                );
        }
    );
    /*
       Recuperação.
    */
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
    /*
       Avança a semana.
    */
    player.week =
        Number(
            player.week || 0
        ) + 1;
    /*
       Virada de ano.
    */
    if (
        player.week > 52
    ) {
        player.week = 1;
        player.year =
            Number(
                player.year || 2026
            ) + 1;
        player.age =
            Number(
                player.age || 15
            ) + 1;
        player.log.unshift(
            `🎆 Começou o Ano ${player.year}.`
        );
    }
    mainSave();
    home();
}
/* =========================================================
   INICIALIZAÇÃO
========================================================= */
document.addEventListener(
    "DOMContentLoaded",
    function () {
        try {
            const loaded =
                mainLoad();
            normalizePlayer();
            if (
                loaded &&
                player &&
                player.name
            ) {
                showGame();
                home();
            } else {
                /*
                   Não existe jogador salvo.
                */
                showCreation();
                startGame();
            }
        } catch (error) {
            console.error(
                "Erro fatal na inicialização:",
                error
            );
            /*
               Mesmo que algum módulo
               tenha problema, tentamos
               mostrar a tela inicial.
            */
            showCreation();
            startGame();
        }
    }
);
/* =========================================================
   DISPONIBILIZAR FUNÇÕES
========================================================= */
window.$ =
    $;
window.startGame =
    startGame;
window.openCharacterCreation =
    openCharacterCreation;
window.createPlayerFromScreen =
    createPlayerFromScreen;
window.showGame =
    showGame;
window.showCreation =
    showCreation;
window.home =
    home;
window.career =
    career;
window.tab =
    tab;
window.getOverall =
    getOverall;
window.resetGame =
    resetGame;
window.rest =
    rest;
window.train =
    train;
window.nextWeek =
    nextWeek;
window.mainSave =
    mainSave;
window.mainLoad =
    mainLoad;
