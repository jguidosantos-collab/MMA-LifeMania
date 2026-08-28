/* =========================================================
   MMA LIFE DYNASTY
   MAIN.JS
   CONTROLADOR PRINCIPAL DA INTERFACE
   VERSÃO ATUALIZADA — OFERTAS DE LUTA
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
    p.week = Number(p.week ?? 0);
    p.year = Number(p.year || 2026);
    p.money = Number(p.money || 0);
    p.fame = Number(p.fame || 0);
    p.health = Number(p.health ?? 100);
    p.fatigue = Number(p.fatigue || 0);
    p.potential = Number(p.potential || 78);
    p.attributes = p.attributes || {};
    p.amateur = p.amateur || {
        wins: 0,
        losses: 0,
        draws: 0,
        ranking: 50
    };
    p.professional = p.professional || {
        active: false,
        wins: 0,
        losses: 0,
        draws: 0,
        ranking: null
    };
    p.trainingPlan = p.trainingPlan || {
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
    /*
       SISTEMA DE LUTAS
    */
    p.fightOffers =
        Array.isArray(p.fightOffers)
            ? p.fightOffers
            : [];
    p.nextFight =
        p.nextFight || null;
    p.managerSearchAfterRest =
        Boolean(
            p.managerSearchAfterRest
        );
    p.managerNextSearchWeek =
        Number(
            p.managerNextSearchWeek || 0
        );
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
   VISIBILIDADE
========================================================= */
function forceDisplay(element, displayValue) {
    if (!element) {
        return;
    }
    element.classList.remove("hidden");
    element.hidden = false;
    element.style.setProperty(
        "display",
        displayValue,
        "important"
    );
}
function forceHide(element) {
    if (!element) {
        return;
    }
    element.classList.add("hidden");
    element.hidden = true;
    element.style.setProperty(
        "display",
        "none",
        "important"
    );
}
/* =========================================================
   MOSTRAR JOGO
========================================================= */
function showGame() {
    const creation =
        getElement("creation");
    const creator =
        getElement("creator");
    const game =
        getElement("game");
    const tabs =
        getElement("tabs");
    forceHide(creation);
    if (creator) {
        creator.innerHTML = "";
    }
    forceDisplay(
        game,
        "block"
    );
    forceDisplay(
        tabs,
        "flex"
    );
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
    forceDisplay(
        creation,
        "block"
    );
    forceHide(game);
    forceHide(tabs);
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
    if (
        Number.isFinite(
            Number(
                p.overall
            )
        )
    ) {
        return Number(
            p.overall
        );
    }
    return 45;
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
    if (
        !p ||
        !p.name
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
            openFight();
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
        p.nextFight
    ) {
        statusText =
            "Luta agendada";
        statusIcon =
            "🥊";
    }
    else if (
        p.fightOffers &&
        p.fightOffers.length
    ) {
        statusText =
            `${p.fightOffers.length} oferta(s) de luta`;
        statusIcon =
            "📩";
    }
    else if (
        p.managerSearching
    ) {
        statusText =
            "Empresário procurando luta";
        statusIcon =
            "📞";
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
                    ${
                        p.fightOffers &&
                        p.fightOffers.length
                            ? ` (${p.fightOffers.length})`
                            : ""
                    }
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
   TREINO
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
   CAMP
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
   LUTAS
   CORREÇÃO DAS OFERTAS
========================================================= */
function openFight() {
    showGame();
    const p =
        normalizeMainPlayer();
    if (!p) {
        return;
    }
    /*
       Se o sistema externo existir,
       continua usando ele.
    */
    if (
        typeof window.fightScreen ===
        "function"
    ) {
        window.fightScreen();
        /*
           Caso o sistema externo não
           mostre as ofertas, desenhamos
           a tela por cima apenas se
           existirem ofertas.
        */
        setTimeout(
            function () {
                if (
                    p.fightOffers &&
                    p.fightOffers.length
                ) {
                    renderFightOffers();
                }
            },
            0
        );
        return;
    }
    renderFightOffers();
}
/* =========================================================
   GERAR OFERTA DE LUTA
========================================================= */
function generateFightOffer() {
    const p =
        normalizeMainPlayer();
    if (!p) {
        return null;
    }
    /*
       Não gerar oferta se já existe
       luta marcada ou descanso.
    */
    if (
        p.nextFight ||
        p.postFightRestActive
    ) {
        return null;
    }
    const overall =
        getOverall();
    const stage =
        p.careerStage ||
        "amateur";
    let opponentBase =
        overall;
    let eventName =
        "Evento Regional";
    let purse =
        500;
    let opponentName =
        "Rival Regional";
    if (
        stage === "professional" ||
        p.professional.active
    ) {
        opponentBase =
            overall +
            Math.floor(
                Math.random() * 11
            ) - 5;
        eventName =
            "Evento Profissional";
        purse =
            2500 +
            Math.floor(
                Math.random() * 5000
            );
        const names = [
            "Lucas Ferreira",
            "Carlos Silva",
            "Mateus Santos",
            "Rafael Oliveira",
            "Diego Almeida",
            "Bruno Costa",
            "Gabriel Souza",
            "André Martins"
        ];
        opponentName =
            names[
                Math.floor(
                    Math.random() *
                    names.length
                )
            ];
    }
    else {
        opponentBase =
            overall +
            Math.floor(
                Math.random() * 15
            ) - 7;
        purse =
            200 +
            Math.floor(
                Math.random() * 800
            );
        const names = [
            "João Pereira",
            "Pedro Lima",
            "Ruan Santos",
            "Felipe Costa",
            "Marcos Silva",
            "Victor Alves",
            "Thiago Souza",
            "Caio Mendes"
        ];
        opponentName =
            names[
                Math.floor(
                    Math.random() *
                    names.length
                )
            ];
    }
    opponentBase =
        Math.max(
            25,
            Math.min(
                99,
                opponentBase
            )
        );
    return {
        id:
            Date.now() +
            Math.floor(
                Math.random() * 10000
            ),
        opponent:
            opponentName,
        opponentOverall:
            Math.round(
                opponentBase
            ),
        event:
            eventName,
        purse:
            purse,
        week:
            p.week + 1,
        year:
            p.year,
        weight:
            p.weight,
        accepted:
            false
    };
}
/* =========================================================
   GARANTIR OFERTA
========================================================= */
function ensureFightOffer() {
    const p =
        normalizeMainPlayer();
    if (!p) {
        return false;
    }
    if (
        p.nextFight ||
        p.postFightRestActive
    ) {
        return false;
    }
    if (
        p.fightOffers.length
    ) {
        return true;
    }
    const offer =
        generateFightOffer();
    if (!offer) {
        return false;
    }
    p.fightOffers.push(
        offer
    );
    p.managerSearching =
        false;
    p.managerSearchAfterRest =
        false;
    p.log.unshift(
        `📩 Nova oferta de luta contra ${offer.opponent}.`
    );
    mainSave();
    return true;
}
/* =========================================================
   MOSTRAR OFERTAS
========================================================= */
function renderFightOffers() {
    const content =
        getElement("content");
    if (!content) {
        return;
    }
    const p =
        normalizeMainPlayer();
    if (!p) {
        return;
    }
    /*
       Se não houver oferta,
       tenta gerar uma.
    */
    if (
        !p.nextFight &&
        !p.postFightRestActive &&
        !p.fightOffers.length
    ) {
        ensureFightOffer();
    }
    let html = `
        <div class="card">
            <div class="title">
                ⚔️ LUTAS
            </div>
    `;
    if (
        p.nextFight
    ) {
        const fight =
            p.nextFight;
        html += `
            <div class="card">
                <div class="title">
                    🥊 PRÓXIMA LUTA
                </div>
                <div class="statline">
                    <span>
                        Adversário
                    </span>
                    <b>
                        ${
                            fight.opponent ||
                            "Desconhecido"
                        }
                    </b>
                </div>
                <div class="statline">
                    <span>
                        OVR
                    </span>
                    <b>
                        ${
                            fight.opponentOverall ||
                            "?"
                        }
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Evento
                    </span>
                    <b>
                        ${
                            fight.event ||
                            "Evento"
                        }
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Semana
                    </span>
                    <b>
                        ${
                            fight.week ||
                            p.week
                        }
                    </b>
                </div>
                <div class="statline">
                    <span>
                        Bolsa
                    </span>
                    <b>
                        $${Math.round(
                            fight.purse || 0
                        )}
                    </b>
                </div>
            </div>
        `;
    }
    else if (
        p.postFightRestActive
    ) {
        html += `
            <div class="statline">
                <span>
                    Situação
                </span>
                <b>
                    😴 Descanso pós-luta
                </b>
            </div>
            <div class="statline">
                <span>
                    Semanas restantes
                </span>
                <b>
                    ${
                        p.postFightRestWeeks ||
                        0
                    }
                </b>
            </div>
        `;
    }
    else if (
        p.fightOffers.length
    ) {
        html += `
            <p>
                📩 Você recebeu uma oferta de luta.
            </p>
        `;
        p.fightOffers.forEach(
            function (offer, index) {
                html += `
                    <div class="card">
                        <div class="title">
                            🥊 OFERTA #${index + 1}
                        </div>
                        <div class="statline">
                            <span>
                                Adversário
                            </span>
                            <b>
                                ${offer.opponent}
                            </b>
                        </div>
                        <div class="statline">
                            <span>
                                OVR
                            </span>
                            <b>
                                ${offer.opponentOverall}
                            </b>
                        </div>
                        <div class="statline">
                            <span>
                                Evento
                            </span>
                            <b>
                                ${offer.event}
                            </b>
                        </div>
                        <div class="statline">
                            <span>
                                Semana
                            </span>
                            <b>
                                ${offer.week}
                            </b>
                        </div>
                        <div class="statline">
                            <span>
                                Bolsa
                            </span>
                            <b>
                                $${Math.round(
                                    offer.purse
                                )}
                            </b>
                        </div>
                        <button
                            class="green"
                            onclick="acceptFightOffer(${index})"
                        >
                            ✅ ACEITAR LUTA
                        </button>
                        <button
                            class="gray"
                            onclick="rejectFightOffer(${index})"
                        >
                            ❌ RECUSAR
                        </button>
                    </div>
                `;
            }
        );
    }
    else {
        html += `
            <p>
                📞 Nenhuma oferta disponível no momento.
            </p>
            <button
                class="main-button"
                onclick="requestFightOffer()"
            >
                📩 PROCURAR LUTA
            </button>
        `;
    }
    html += `
            <button
                class="gray"
                onclick="home()"
            >
                ← VOLTAR
            </button>
        </div>
    `;
    content.innerHTML =
        html;
}
/* =========================================================
   ACEITAR OFERTA
========================================================= */
function acceptFightOffer(index) {
    const p =
        normalizeMainPlayer();
    if (!p) {
        return;
    }
    if (
        p.nextFight
    ) {
        alert(
            "Você já possui uma luta marcada."
        );
        return;
    }
    const offer =
        p.fightOffers[index];
    if (!offer) {
        return;
    }
    p.nextFight = {
        opponent:
            offer.opponent,
        opponentOverall:
            offer.opponentOverall,
        event:
            offer.event,
        purse:
            offer.purse,
        week:
            offer.week,
        year:
            offer.year,
        weight:
            offer.weight
    };
    p.fightOffers =
        [];
    p.managerSearching =
        false;
    p.managerSearchAfterRest =
        false;
    p.log.unshift(
        `🥊 Luta aceita contra ${offer.opponent}.`
    );
    mainSave();
    renderFightOffers();
}
/* =========================================================
   RECUSAR OFERTA
========================================================= */
function rejectFightOffer(index) {
    const p =
        normalizeMainPlayer();
    if (!p) {
        return;
    }
    const offer =
        p.fightOffers[index];
    if (!offer) {
        return;
    }
    p.fightOffers.splice(
        index,
        1
    );
    p.log.unshift(
        `❌ Oferta contra ${offer.opponent} foi recusada.`
    );
    p.managerSearching =
        true;
    p.managerSearchAfterRest =
        true;
    mainSave();
    renderFightOffers();
}
/* =========================================================
   PROCURAR LUTA MANUALMENTE
========================================================= */
function requestFightOffer() {
    const p =
        normalizeMainPlayer();
    if (!p) {
        return;
    }
    if (
        p.nextFight
    ) {
        alert(
            "Você já possui uma luta marcada."
        );
        return;
    }
    if (
        p.postFightRestActive
    ) {
        alert(
            "Você está em descanso pós-luta."
        );
        return;
    }
    if (
        p.fightOffers.length
    ) {
        renderFightOffers();
        return;
    }
    ensureFightOffer();
    renderFightOffers();
}
/* =========================================================
   AVANÇAR SEMANA
========================================================= */
function nextWeek() {
    const p =
        normalizeMainPlayer();
    if (!p) {
        return;
    }
    /*
       Impede o navegador de tentar
       reposicionar a página.
    */
    const oldScroll =
        window.scrollY;
    /* =====================================================
       1 — PROCESSAR CAMP
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
       2 — PLANO DE TREINO
    ===================================================== */
    const plan =
        p.trainingPlan &&
        p.trainingPlan.weeks
            ? p.trainingPlan.weeks[
                p.week
            ] || []
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
                            treino.gain ||
                            0.5
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
       8 — GERAR OFERTA
       AGORA É FEITO PELO MAIN.JS
    ===================================================== */
    if (
        !p.nextFight &&
        !p.postFightRestActive &&
        !p.fightOffers.length
    ) {
        /*
           Se existir empresário,
           procura uma luta.
        */
        if (
            p.manager &&
            typeof window.managerSearchForFight ===
            "function"
        ) {
            try {
                window.managerSearchForFight();
            }
            catch (error) {
                console.warn(
                    "Erro na busca do empresário:",
                    error
                );
            }
        }
        /*
           Depois da tentativa externa,
           garante que exista uma oferta.
        */
        if (
            !p.fightOffers.length
        ) {
            ensureFightOffer();
        }
    }
    mainSave();
    /*
       Atualiza a tela sem chamar
       scrollTo(0,0).
    */
    home();
    /*
       Mantém a posição do usuário.
    */
    try {
        window.scrollTo(
            0,
            oldScroll
        );
    }
    catch (error) {
        console.warn(
            "Não foi possível restaurar a posição.",
            error
        );
    }
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
    renderFightOffers();
}
/* =========================================================
   EQUIPE
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
   VIDA
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
   RANKING
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
                                        attributes[
                                            row[1]
                                        ] || 0
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
window.generateFightOffer =
    generateFightOffer;
window.ensureFightOffer =
    ensureFightOffer;
window.renderFightOffers =
    renderFightOffers;
window.acceptFightOffer =
    acceptFightOffer;
window.rejectFightOffer =
    rejectFightOffer;
window.requestFightOffer =
    requestFightOffer;
/* =========================================================
   INICIALIZAÇÃO
========================================================= */
document.addEventListener(
    "DOMContentLoaded",
    function () {
        try {
            /*
               CARREGAR SAVE
            */
            if (
                typeof window.load ===
                "function"
            ) {
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
