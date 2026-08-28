/* =========================================================
   MMA LIFE DYNASTY
   MAIN.JS
   CONTROLADOR PRINCIPAL DA INTERFACE

   VERSÃO ATUALIZADA
   - Lutas sincronizadas com a semana
   - Luta marcada para +2 semanas
   - Luta fica disponível quando chega a semana
   - Sem empresário = sem oferta automática
   - Amador sem bolsa
   - Profissional com bolsa
   - Correção de luta presa em "aguardando"
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

    p.name =
        p.name || "";

    p.country =
        p.country || "Brasil";

    p.weight =
        p.weight || "Peso Leve";

    p.style =
        p.style || "Completo";

    p.age =
        Number(p.age || 15);

    p.week =
        Number(p.week ?? 0);

    p.year =
        Number(p.year || 2026);

    p.money =
        Number(p.money || 0);

    p.fame =
        Number(p.fame || 0);

    p.health =
        Number(p.health ?? 100);

    p.fatigue =
        Number(p.fatigue || 0);

    p.potential =
        Number(p.potential || 78);

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

function forceDisplay(
    element,
    displayValue
) {

    if (!element) {
        return;
    }

    element.classList.remove(
        "hidden"
    );

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

    element.classList.add(
        "hidden"
    );

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

        if (
            isFightReady()
        ) {

            statusText =
                "Luta disponível";

            statusIcon =
                "🥊";

        }
        else {

            const remaining =
                getFightWeeksRemaining();

            statusText =
                `Luta em ${remaining} semana${remaining === 1 ? "" : "s"}`;

            statusIcon =
                "📅";
        }

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
========================================================= */

function openFight() {

    showGame();

    const p =
        normalizeMainPlayer();

    if (!p) {
        return;
    }


    /* -----------------------------------------------------
       SE JÁ TEM LUTA
    ----------------------------------------------------- */

    if (p.nextFight) {

        /*
           Atualiza automaticamente
           o estado da luta.
        */

        updateFightAvailability();


        /*
           Se chegou a semana,
           a luta já está liberada.
        */

        if (
            p.nextFight.ready
        ) {

            /*
               Primeiro tenta o sistema
               original de luta.
            */

            if (
                typeof window.fightScreen ===
                "function"
            ) {

                window.fightScreen();

                return;
            }
        }

        /*
           Caso ainda não esteja
           na semana da luta,
           mostra nossa tela.
        */

        renderFightOffers();

        return;
    }


    /* -----------------------------------------------------
       OFERTAS
    ----------------------------------------------------- */

    if (
        p.fightOffers &&
        p.fightOffers.length
    ) {

        renderFightOffers();

        return;
    }


    /*
       Só empresário pode procurar
       luta automaticamente.
    */

    if (!p.manager) {

        renderFightOffers();

        return;
    }


    ensureFightOffer();

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
       REGRA:
       SEM EMPRESÁRIO NÃO EXISTE OFERTA.
    */

    if (!p.manager) {
        return null;
    }


    /*
       Não gerar se já existe
       luta ou descanso.
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
        0;

    let opponentName =
        "Rival Regional";


    /* =====================================================
       PROFISSIONAL
    ===================================================== */

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


    /* =====================================================
       AMADOR
    ===================================================== */

    else {

        opponentBase =
            overall +
            Math.floor(
                Math.random() * 15
            ) - 7;


        eventName =
            "Evento Amador";


        /*
           IMPORTANTE:
           AMADOR NÃO TEM BOLSA.
        */

        purse =
            0;


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

        /*
           Bolsa só é utilizada
           para profissional.
        */

        purse:
            stage === "professional" ||
            p.professional.active
                ? purse
                : 0,

        /*
           A oferta vira uma luta
           marcada para DUAS semanas
           depois da aceitação.
        */

        week:
            Number(p.week || 0) + 2,

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


    /*
       SEM EMPRESÁRIO:
       NÃO EXISTE OFERTA.
    */

    if (!p.manager) {

        p.fightOffers =
            [];

        p.managerSearching =
            false;

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
   CALCULAR SEMANAS RESTANTES
========================================================= */

function getFightWeeksRemaining() {

    const p =
        normalizeMainPlayer();

    if (
        !p ||
        !p.nextFight
    ) {

        return 0;
    }


    const fight =
        p.nextFight;


    /*
       Usa scheduledWeek quando existir.
    */

    const scheduledWeek =
        Number(
            fight.scheduledWeek ??
            fight.week ??
            p.week
        );


    /*
       Para mudança de ano,
       calcula de maneira simples.
    */

    const currentYear =
        Number(p.year);

    const fightYear =
        Number(
            fight.scheduledYear ??
            fight.year ??
            currentYear
        );


    if (
        fightYear > currentYear
    ) {

        const currentRemaining =
            52 -
            Number(p.week);

        const yearsDifference =
            fightYear -
            currentYear;

        return Math.max(
            0,
            currentRemaining +
            ((yearsDifference - 1) * 52) +
            scheduledWeek
        );
    }


    return Math.max(
        0,
        scheduledWeek -
        Number(p.week)
    );
}


/* =========================================================
   VERIFICAR SE A LUTA ESTÁ PRONTA
========================================================= */

function isFightReady() {

    const p =
        normalizeMainPlayer();

    if (
        !p ||
        !p.nextFight
    ) {

        return false;
    }


    const fight =
        p.nextFight;


    const scheduledWeek =
        Number(
            fight.scheduledWeek ??
            fight.week ??
            p.week
        );


    const scheduledYear =
        Number(
            fight.scheduledYear ??
            fight.year ??
            p.year
        );


    const currentYear =
        Number(p.year);

    const currentWeek =
        Number(p.week);


    if (
        currentYear >
        scheduledYear
    ) {

        return true;
    }


    if (
        currentYear ===
        scheduledYear &&
        currentWeek >=
        scheduledWeek
    ) {

        return true;
    }


    return false;
}


/* =========================================================
   ATUALIZAR DISPONIBILIDADE DA LUTA
========================================================= */

function updateFightAvailability() {

    const p =
        normalizeMainPlayer();

    if (
        !p ||
        !p.nextFight
    ) {

        return false;
    }


    const fight =
        p.nextFight;


    /*
       Se ainda não possui
       scheduledWeek, cria.
    */

    if (
        fight.scheduledWeek ===
        undefined ||
        fight.scheduledWeek ===
        null
    ) {

        fight.scheduledWeek =
            Number(
                fight.week ??
                p.week
            );
    }


    if (
        fight.scheduledYear ===
        undefined ||
        fight.scheduledYear ===
        null
    ) {

        fight.scheduledYear =
            Number(
                fight.year ??
                p.year
            );
    }


    /*
       Verifica se chegou a hora.
    */

    if (
        isFightReady()
    ) {

        fight.ready =
            true;

        /*
           MUITO IMPORTANTE:
           O sistema de luta externo
           normalmente olha para
           nextFight.week.

           Então, quando chega o dia,
           sincronizamos week com a
           semana atual.

           A semana original continua
           salva em scheduledWeek.
        */

        fight.week =
            Number(p.week);

        fight.year =
            Number(p.year);


        fight.fightReady =
            true;


        fight.status =
            "ready";


        mainSave();

        return true;
    }


    /*
       Ainda não chegou.
    */

    fight.ready =
        false;

    fight.fightReady =
        false;

    fight.status =
        "scheduled";


    return false;
}


/* =========================================================
   MOSTRAR OFERTAS / LUTAS
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
       Atualiza estado da luta.
    */

    if (p.nextFight) {

        updateFightAvailability();
    }


    let html = `

        <div class="card">

            <div class="title">
                ⚔️ LUTAS
            </div>

    `;


    /* =====================================================
       LUTA MARCADA
    ===================================================== */

    if (
        p.nextFight
    ) {

        const fight =
            p.nextFight;


        const ready =
            isFightReady();


        if (ready) {

            html += `

                <div class="card">

                    <div class="title">
                        🥊 LUTA DISPONÍVEL
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
                            ${p.week}
                        </b>

                    </div>

            `;


            /*
               Bolsa APENAS profissional.
            */

            if (
                Number(
                    fight.purse || 0
                ) > 0
            ) {

                html += `

                    <div class="statline">

                        <span>
                            Bolsa
                        </span>

                        <b>
                            $${Math.round(
                                fight.purse
                            )}
                        </b>

                    </div>

                `;
            }


            html += `

                    <button
                        class="green"
                        onclick="startScheduledFight()"
                    >
                        🥊 LUTAR AGORA
                    </button>

                </div>

            `;

        }

        else {

            const remaining =
                getFightWeeksRemaining();


            html += `

                <div class="card">

                    <div class="title">
                        📅 PRÓXIMA LUTA
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
                            Semana da luta
                        </span>

                        <b>
                            ${
                                fight.scheduledWeek
                            }
                        </b>

                    </div>


                    <div class="statline">

                        <span>
                            Situação
                        </span>

                        <b>
                            ⏳ Em ${remaining}
                            semana${remaining === 1 ? "" : "s"}
                        </b>

                    </div>

            `;


            /*
               NÃO mostrar bolsa
               se for amador.
            */

            if (
                Number(
                    fight.purse || 0
                ) > 0
            ) {

                html += `

                    <div class="statline">

                        <span>
                            Bolsa
                        </span>

                        <b>
                            $${Math.round(
                                fight.purse
                            )}
                        </b>

                    </div>

                `;
            }


            html += `

                </div>

            `;
        }
    }


    /* =====================================================
       DESCANSO
    ===================================================== */

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


    /* =====================================================
       OFERTAS
    ===================================================== */

    else if (
        p.fightOffers.length
    ) {

        html += `

            <p>
                📩 Você recebeu uma oferta de luta.
            </p>

        `;


        p.fightOffers.forEach(
            function (
                offer,
                index
            ) {

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
                                Luta em
                            </span>

                            <b>
                                2 semanas
                            </b>

                        </div>

                `;


                /*
                   Bolsa somente profissional.
                */

                if (
                    Number(
                        offer.purse || 0
                    ) > 0
                ) {

                    html += `

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

                    `;
                }


                html += `

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


    /* =====================================================
       SEM OFERTA
    ===================================================== */

    else {

        if (!p.manager) {

            html += `

                <p>
                    👔 Você precisa de um empresário
                    para receber ofertas de luta.
                </p>

            `;

        }
        else {

            html += `

                <p>
                    📞 Nenhuma oferta disponível
                    no momento.
                </p>


                <button
                    class="main-button"
                    onclick="requestFightOffer()"
                >
                    📩 PROCURAR LUTA
                </button>

            `;
        }
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
   INICIAR LUTA AGENDADA
========================================================= */

function startScheduledFight() {

    const p =
        normalizeMainPlayer();

    if (!p || !p.nextFight) {
        return;
    }


    updateFightAvailability();


    if (
        !isFightReady()
    ) {

        alert(
            "Ainda não está na semana da luta."
        );

        renderFightOffers();

        return;
    }


    /*
       Marca explicitamente
       como disponível.
    */

    p.nextFight.ready =
        true;

    p.nextFight.fightReady =
        true;

    p.nextFight.status =
        "ready";

    /*
       Mantém a semana atual
       sincronizada para o
       sistema externo.
    */

    p.nextFight.week =
        Number(p.week);

    p.nextFight.year =
        Number(p.year);


    mainSave();


    /*
       Chama o sistema original
       de luta.
    */

    if (
        typeof window.fightScreen ===
        "function"
    ) {

        window.fightScreen();

        return;
    }


    /*
       Caso o fight.js ainda não
       esteja disponível.
    */

    renderFightOffers();
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
        !p.manager
    ) {

        alert(
            "Você precisa de um empresário para aceitar ofertas."
        );

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


    /*
       LUTA PARA DUAS SEMANAS.
    */

    const currentWeek =
        Number(p.week);

    const currentYear =
        Number(p.year);


    let scheduledWeek =
        currentWeek + 2;

    let scheduledYear =
        currentYear;


    if (
        scheduledWeek > 52
    ) {

        scheduledWeek -= 52;

        scheduledYear += 1;
    }


    p.nextFight = {

        opponent:
            offer.opponent,

        opponentOverall:
            offer.opponentOverall,

        event:
            offer.event,

        /*
           Amador = 0
           Profissional = bolsa.
        */

        purse:
            Number(
                offer.purse || 0
            ),

        /*
           Campo utilizado pelo
           sistema de luta.
        */

        week:
            scheduledWeek,

        year:
            scheduledYear,

        /*
           Campos definitivos.
        */

        scheduledWeek:
            scheduledWeek,

        scheduledYear:
            scheduledYear,

        weight:
            offer.weight,

        accepted:
            true,

        ready:
            false,

        fightReady:
            false,

        status:
            "scheduled"
    };


    p.fightOffers =
        [];


    p.managerSearching =
        false;

    p.managerSearchAfterRest =
        false;


    p.log.unshift(
        `🥊 Luta aceita contra ${offer.opponent}. Luta marcada para a semana ${scheduledWeek}.`
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


    /*
       Se tem empresário,
       pode procurar outra.
    */

    if (p.manager) {

        p.managerSearching =
            true;

        p.managerSearchAfterRest =
            true;

    }
    else {

        p.managerSearching =
            false;

        p.managerSearchAfterRest =
            false;
    }


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


    /*
       SEM EMPRESÁRIO NÃO TEM LUTA.
    */

    if (!p.manager) {

        alert(
            "Você precisa contratar um empresário para procurar lutas."
        );

        renderFightOffers();

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
   PROCESSAR LUTA QUANDO A SEMANA CHEGAR
========================================================= */

function processScheduledFight() {

    const p =
        normalizeMainPlayer();

    if (
        !p ||
        !p.nextFight
    ) {

        return false;
    }


    /*
       Atualiza a luta.
    */

    const ready =
        updateFightAvailability();


    if (!ready) {
        return false;
    }


    /*
       A luta fica pronta.
       NÃO executamos automaticamente.
       O jogador precisa apertar LUTAR.
    */

    p.nextFight.ready =
        true;

    p.nextFight.fightReady =
        true;

    p.nextFight.status =
        "ready";


    /*
       Sincroniza com a semana
       atual para o fight.js.
    */

    p.nextFight.week =
        Number(p.week);

    p.nextFight.year =
        Number(p.year);


    p.log =
        Array.isArray(p.log)
            ? p.log
            : [];


    /*
       Evita registrar a mensagem
       várias vezes.
    */

    if (
        !p.nextFight.readyLogged
    ) {

        p.log.unshift(
            `🥊 A luta contra ${p.nextFight.opponent} está disponível!`
        );

        p.nextFight.readyLogged =
            true;
    }


    mainSave();

    return true;
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


            /*
               Depois do descanso,
               empresário pode procurar
               nova luta.
            */

            if (p.manager) {

                p.managerSearchAfterRest =
                    true;

                p.managerNextSearchWeek =
                    Number(p.week) + 1;

            }
            else {

                p.managerSearchAfterRest =
                    false;
            }
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

        p.week =
            1;

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
       8 — SINCRONIZAR LUTA AGENDADA
    ===================================================== */

    if (
        p.nextFight
    ) {

        /*
           ESTA É A CORREÇÃO PRINCIPAL.

           Toda vez que a semana muda,
           verificamos se chegou a semana
           da luta.
        */

        processScheduledFight();
    }


    /* =====================================================
       9 — OFERTA NOVA
    ===================================================== */

    /*
       IMPORTANTE:
       Só empresário pode gerar oferta.
    */

    if (
        p.manager &&
        !p.nextFight &&
        !p.postFightRestActive &&
        !p.fightOffers.length
    ) {

        /*
           Primeiro tenta sistema externo.
        */

        if (
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
           Se o sistema externo não criou,
           nosso sistema garante a oferta.
        */

        if (
            !p.fightOffers.length
        ) {

            /*
               Só gera quando realmente
               houver empresário.
            */

            if (p.manager) {

                ensureFightOffer();
            }
        }
    }


    /* =====================================================
       10 — SALVAR
    ===================================================== */

    mainSave();


    /* =====================================================
       11 — ATUALIZAR TELA
    ===================================================== */

    home();


    /* =====================================================
       12 — RESTAURAR SCROLL
    ===================================================== */

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

window.getFightWeeksRemaining =
    getFightWeeksRemaining;

window.isFightReady =
    isFightReady;

window.updateFightAvailability =
    updateFightAvailability;

window.processScheduledFight =
    processScheduledFight;

window.startScheduledFight =
    startScheduledFight;


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


            /*
               Se já existir uma luta salva,
               corrige o estado dela imediatamente.
            */

            if (
                p &&
                p.nextFight
            ) {

                updateFightAvailability();
            }


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
