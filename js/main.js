/* =========================================================
   MMA LIFE DYNASTY
   MAIN.JS
   VERSÃO COMPATÍVEL COM O INDEX.HTML ATUAL
========================================================= */
(function () {
    "use strict";
    /* =====================================================
       UTILIDADES
    ===================================================== */
    function el(id) {
        return document.getElementById(id);
    }
    function creationScreen() {
        const creation = el("creation");
        const game = el("game");
        const tabs = el("tabs");
        if (creation) creation.classList.remove("hidden");
        if (game) game.classList.add("hidden");
        if (tabs) tabs.classList.add("hidden");
    }
    function gameScreen() {
        const creation = el("creation");
        const game = el("game");
        const tabs = el("tabs");
        if (creation) creation.classList.add("hidden");
        if (game) game.classList.remove("hidden");
        if (tabs) tabs.classList.remove("hidden");
    }
    function content() {
        return el("content");
    }
    /* =====================================================
       JOGADOR PADRÃO
    ===================================================== */
    function defaultPlayer() {
        return {
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
    }
    /* =====================================================
       ESTADO
    ===================================================== */
    if (typeof window.player === "undefined") {
        window.player = defaultPlayer();
    }
    /* =====================================================
       SAVE
    ===================================================== */
    window.saveGame = function () {
        try {
            localStorage.setItem(
                "mmaLifePlayer",
                JSON.stringify(window.player)
            );
        } catch (error) {
            console.error(
                "Erro ao salvar jogo:",
                error
            );
        }
    };
    /* Compatibilidade */
    window.save = window.saveGame;
    /* =====================================================
       LOAD
    ===================================================== */
    window.loadGame = function () {
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
                defaultPlayer();
            window.player = {
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
            return true;
        } catch (error) {
            console.error(
                "Erro ao carregar jogo:",
                error
            );
            return false;
        }
    };
    /* =====================================================
       OVERALL
    ===================================================== */
    window.getOverall = function () {
        const a =
            window.player.attributes || {};
        const values = [
            Number(a.strength || 60),
            Number(a.striking || 60),
            Number(a.wrestling || 60),
            Number(a.grappling || 60),
            Number(a.cardio || 60),
            Number(a.technique || 60),
            Number(a.defense || 60),
            Number(a.fightIQ || 60),
            Number(a.chin || 60),
            Number(a.offense || 60),
            Number(a.blocking || 60)
        ];
        const total =
            values.reduce(
                (sum, value) =>
                    sum + value,
                0
            );
        const overall =
            Math.round(
                total / values.length
            );
        return Math.min(
            Number(window.player.potential || 98),
            overall
        );
    };
    /* =====================================================
       TELA DE CRIAÇÃO
    ===================================================== */
    window.startGame = function () {
        creationScreen();
        const creator =
            el("creator");
        if (!creator) {
            console.error(
                "Elemento #creator não encontrado."
            );
            return;
        }
        creator.innerHTML = `
            <div class="card">
                <div class="title">
                    🥊 MMA LIFE DYNASTY
                </div>
                <h2>
                    CRIAR NOVO LUTADOR
                </h2>
                <p>
                    Comece sua carreira no MMA.
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
                    onclick="createPlayer()">
                    🥊 CRIAR LUTADOR
                </button>
            </div>
        `;
    };
    /* =====================================================
       CRIAR LUTADOR
    ===================================================== */
    window.createPlayer = function () {
        const nameInput =
            el("playerName");
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
        const base =
            defaultPlayer();
        window.player = base;
        window.player.name =
            name;
        window.player.country =
            el("country")
                ? el("country").value
                : "Brasil";
        window.player.weight =
            el("weight")
                ? el("weight").value
                : "Peso Leve";
        window.player.style =
            el("style")
                ? el("style").value
                : "Completo";
        /*
         * O atleta começa com OVR 60.
         *
         * O potencial é sorteado entre 78 e 98.
         */
        window.player.overall = 60;
        window.player.potential =
            Math.floor(
                Math.random() * 21
            ) + 78;
        window.player.log = [
            `🥊 ${name} iniciou sua carreira no MMA.`
        ];
        saveGame();
        /*
         * IMPORTANTE:
         * aqui realmente saímos da criação
         * e entramos no jogo.
         */
        gameScreen();
        home();
    };
    /* =====================================================
       RESETAR JOGO
    ===================================================== */
    window.resetGame = function () {
        const confirmed =
            confirm(
                "Tem certeza que deseja apagar sua carreira e começar novamente?"
            );
        if (!confirmed) {
            return;
        }
        localStorage.removeItem(
            "mmaLifePlayer"
        );
        window.player =
            defaultPlayer();
        creationScreen();
        startGame();
    };
    /* =====================================================
       NAVEGAÇÃO
    ===================================================== */
    window.tab = function (name) {
        /*
         * Sempre garantir que o jogo
         * está aberto.
         */
        gameScreen();
        switch (name) {
            case "home":
                home();
                break;
            case "career":
                if (typeof window.career === "function") {
                    window.career();
                } else {
                    home();
                }
                break;
            case "train":
                if (typeof window.training === "function") {
                    window.training();
                } else {
                    home();
                }
                break;
            case "fight":
                if (typeof window.fightScreen === "function") {
                    window.fightScreen();
                } else {
                    home();
                }
                break;
            case "team":
                if (typeof window.teamScreen === "function") {
                    window.teamScreen();
                } else {
                    home();
                }
                break;
            case "life":
                if (typeof window.familyScreen === "function") {
                    window.familyScreen();
                } else {
                    home();
                }
                break;
            case "ranking":
                if (typeof window.rankingScreen === "function") {
                    window.rankingScreen();
                } else {
                    home();
                }
                break;
            default:
                home();
        }
    };
    /* =====================================================
       HOME
    ===================================================== */
    window.home = function () {
        gameScreen();
        const c =
            content();
        if (!c) {
            return;
        }
        const p =
            window.player;
        const pro =
            p.professional || {};
        const amateur =
            p.amateur || {};
        c.innerHTML = `
            <div class="home-container">
                <!-- CABEÇALHO -->
                <div class="fighter-header">
                    <div class="fighter-avatar">
                        🥊
                    </div>
                    <div class="fighter-info">
                        <div class="fighter-name">
                            ${p.name || "Lutador"}
                        </div>
                        <div>
                            ${p.country || "Brasil"}
                        </div>
                        <div>
                            ${p.weight || "Peso Leve"}
                        </div>
                    </div>
                </div>
                <!-- STATUS -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <span>IDADE</span>
                        <strong>
                            ${p.age}
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
                            ${p.potential}
                        </strong>
                    </div>
                    <div class="stat-card">
                        <span>FAMA</span>
                        <strong>
                            ${Math.round(p.fame || 0)}
                        </strong>
                    </div>
                </div>
                <!-- CALENDÁRIO -->
                <div class="card">
                    <div class="title">
                        📅 CALENDÁRIO
                    </div>
                    <div class="statline">
                        <span>
                            Temporada
                        </span>
                        <b>
                            Ano ${p.year}
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Semana
                        </span>
                        <b>
                            ${p.week} / 52
                        </b>
                    </div>
                    <button
                        class="main-button"
                        onclick="tab('train')">
                        🏋️ CAMP DE TREINAMENTO
                    </button>
                    <button
                        class="main-button"
                        onclick="advanceWeek()">
                        ⏭️ PRÓXIMA SEMANA
                    </button>
                </div>
                <!-- CARREIRA -->
                <div class="card">
                    <div class="title">
                        🏆 CARREIRA
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
                            Recorde profissional
                        </span>
                        <b>
                            ${pro.wins || 0} -
                            ${pro.losses || 0} -
                            ${pro.draws || 0}
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Recorde amador
                        </span>
                        <b>
                            ${amateur.wins || 0} -
                            ${amateur.losses || 0} -
                            ${amateur.draws || 0}
                        </b>
                    </div>
                    <button
                        class="main-button"
                        onclick="tab('career')">
                        🥊 VER CARREIRA
                    </button>
                </div>
                <!-- MUNDO MMA -->
                <div class="card">
                    <div class="title">
                        🌎 MUNDO DO MMA
                    </div>
                    <button
                        class="main-button"
                        onclick="tab('fight')">
                        ⚔️ LUTAS
                    </button>
                    <button
                        class="main-button"
                        onclick="tab('team')">
                        🏢 EQUIPE
                    </button>
                    <button
                        class="main-button"
                        onclick="tab('ranking')">
                        🏆 RANKINGS
                    </button>
                </div>
                <!-- VIDA -->
                <div class="card">
                    <div class="title">
                        ❤️ VIDA
                    </div>
                    <div class="statline">
                        <span>
                            Relacionamento
                        </span>
                        <b>
                            ${p.relationship}
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Filhos
                        </span>
                        <b>
                            ${(p.children || []).length}
                        </b>
                    </div>
                    <button
                        class="main-button"
                        onclick="tab('life')">
                        ❤️ ABRIR VIDA
                    </button>
                </div>
                <!-- CONDIÇÃO -->
                <div class="card">
                    <div class="title">
                        ❤️ CONDIÇÃO
                    </div>
                    <div class="statline">
                        <span>
                            Saúde
                        </span>
                        <b>
                            ${Math.round(p.health || 100)}%
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Fadiga
                        </span>
                        <b>
                            ${Math.round(p.fatigue || 0)}%
                        </b>
                    </div>
                    <div class="statline">
                        <span>
                            Dinheiro
                        </span>
                        <b>
                            $${Math.round(p.money || 0)}
                        </b>
                    </div>
                </div>
                <!-- SISTEMA -->
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
    };
    /* =====================================================
       AVANÇAR SEMANA
    ===================================================== */
    window.advanceWeek = function () {
        const p =
            window.player;
        const plan =
            p.trainingPlan &&
            p.trainingPlan.weeks
            ? p.trainingPlan.weeks[p.week]
            : [];
        /*
         * Aplicar treino da semana.
         */
        if (
            Array.isArray(plan) &&
            plan.length
        ) {
            plan.forEach(
                function (training) {
                    const attribute =
                        training.attribute;
                    if (!attribute) {
                        return;
                    }
                    const current =
                        Number(
                            p.attributes[attribute] || 60
                        );
                    const potential =
                        Number(
                            p.potential || 90
                        );
                    if (
                        current >= potential
                    ) {
                        return;
                    }
                    const gain =
                        Math.min(
                            Number(
                                training.gain || 0.5
                            ),
                            potential - current
                        );
                    p.attributes[attribute] =
                        Number(
                            (
                                current + gain
                            ).toFixed(2)
                        );
                }
            );
        }
        /*
         * Recuperação.
         */
        p.fatigue =
            Math.max(
                0,
                Number(p.fatigue || 0) - 10
            );
        p.health =
            Math.min(
                100,
                Number(p.health || 100) + 3
            );
        /*
         * Avança calendário.
         */
        p.week =
            Number(p.week || 1) + 1;
        /*
         * 52 semanas.
         */
        if (p.week > 52) {
            p.week = 1;
            p.year =
                Number(p.year || 1) + 1;
            p.age =
                Number(p.age || 18) + 1;
            p.log =
                p.log || [];
            p.log.unshift(
                `🎆 Começou o Ano ${p.year}.`
            );
        }
        saveGame();
        home();
    };
    /*
     * Compatibilidade com código antigo.
     */
    window.nextWeek =
        window.advanceWeek;
    /* =====================================================
       REST
    ===================================================== */
    window.rest = function () {
        /*
         * Descansar não volta para o início.
         * Descansar simplesmente avança
         * para a próxima semana.
         */
        window.player.fatigue =
            Math.max(
                0,
                Number(
                    window.player.fatigue || 0
                ) - 15
            );
        window.player.health =
            Math.min(
                100,
                Number(
                    window.player.health || 100
                ) + 5
            );
        advanceWeek();
    };
    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */
    function initializeGame() {
        const loaded =
            loadGame();
        /*
         * Se existe lutador salvo:
         * abre o jogo.
         */
        if (
            loaded &&
            window.player &&
            window.player.name
        ) {
            gameScreen();
            home();
            return;
        }
        /*
         * Se não existe lutador:
         * mostra criação.
         */
        creationScreen();
        startGame();
    }
    /* =====================================================
       DOM READY
    ===================================================== */
    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initializeGame
        );
    } else {
        initializeGame();
    }
})();
