/* ============================================================
   MMA LIFE DYNASTY
   MAIN ENGINE
   INTEGRAÇÃO CENTRAL DO JOGO
   ============================================================ */
"use strict";
/*
    ESTE ARQUIVO É O MAESTRO DO JOGO.
    Responsabilidades:
    1. Criar o estado central.
    2. Carregar os sistemas existentes.
    3. Compartilhar o MESMO database entre todos os sistemas.
    4. Inicializar a UI real.
    5. Inicializar criação de personagem.
    6. Receber o personagem criado.
    7. Iniciar a carreira.
    8. Entregar o controle para dashboard/UI.
    9. Expor APIs globais para os módulos existentes.
    10. Evitar dupla inicialização.
*/
/* ============================================================
   VERSÃO
   ============================================================ */
const MAIN_VERSION = "MMA-LIFE-DYNASTY-CORE-2.0.0";
/* ============================================================
   ESTADO PRINCIPAL
   ============================================================ */
const mainState = {
    version: MAIN_VERSION,
    status: "booting",
    initialized: false,
    started: false,
    careerStarted: false,
    uiInitialized: false,
    systemsInitialized: false,
    database: null,
    characterCreation: null,
    ui: null,
    gameUI: null,
    loadedModules: [],
    failedModules: [],
    errors: [],
    bootTime: Date.now(),
    lastSave: null
};
/* ============================================================
   DATABASE CENTRAL
   ============================================================ */
function createDatabase() {
    return {
        meta: {
            game:
                "MMA Life Dynasty",
            version:
                "2.0.0",
            engine:
                "MMA Life Dynasty Engine",
            createdAt:
                new Date().toISOString(),
            lastUpdated:
                new Date().toISOString()
        },
        /* ====================================================
           PLAYER
           ==================================================== */
        player: {
            id: null,
            firstName: "",
            lastName: "",
            fullName: "",
            displayName: "",
            nickname: "",
            gender: "male",
            age: 16,
            country: "Brazil",
            city: "São Paulo",
            height: 1.75,
            weight: 70,
            weightClass: "lightweight",
            fightingStyle: "MMA",
            stance: "Ortodoxo",
            personality: "disciplinado",
            /* CARREIRA */
            careerStage:
                "amateur",
            amateur:
                true,
            professional: {
                active:
                    false,
                debutAge:
                    null,
                fights:
                    0,
                wins:
                    0,
                losses:
                    0,
                draws:
                    0,
                noContests:
                    0
            },
            /* ATRIBUTOS */
            attributes: {
                striking: 50,
                grappling: 50,
                wrestling: 50,
                submission: 50,
                defense: 50,
                cardio: 50,
                strength: 50,
                speed: 50,
                chin: 50,
                fightIQ: 50
            },
            /* POTENCIAL */
            potential: {
                overall: 50,
                ceiling: 75
            },
            /* GENÉTICA */
            genetics: {
                athleticism: 50,
                durability: 50,
                strength: 50,
                speed: 50,
                cardio: 50
            },
            overall:
                50,
            confidence:
                50,
            morale:
                50,
            experience:
                0,
            fame:
                0,
            followers:
                0,
            reputation:
                0,
            health:
                100,
            energy:
                100,
            fatigue:
                0,
            money:
                0
        },
        /* ====================================================
           CAREER
           ==================================================== */
        career: {
            stage:
                "amateur",
            promotion:
                null,
            manager:
                null,
            contract:
                null,
            ranking:
                null,
            reputation:
                0,
            record: {
                wins:
                    0,
                losses:
                    0,
                draws:
                    0,
                noContests:
                    0
            },
            history: []
        },
        /* ====================================================
           TRAINING
           ==================================================== */
        training: {
            energy:
                100,
            fatigue:
                0,
            weeklySchedule:
                [],
            currentCamp:
                null,
            sessions:
                [],
            improvements:
                []
        },
        /* ====================================================
           HEALTH
           ==================================================== */
        health: {
            overall:
                100,
            injuries:
                [],
            recovery:
                100,
            medical:
                [],
            suspensions:
                []
        },
        /* ====================================================
           FIGHTS
           ==================================================== */
        fights: {
            nextFight:
                null,
            currentFight:
                null,
            history:
                [],
            offers:
                []
        },
        /* ====================================================
           PROMOTIONS
           ==================================================== */
        promotions: {
            current:
                null,
            available:
                [],
            offers:
                [],
            history:
                []
        },
        /* ====================================================
           BUSINESS
           ==================================================== */
        business: {
            money:
                0,
            income:
                0,
            expenses:
                0,
            assets:
                [],
            investments:
                [],
            sponsors:
                []
        },
        /* ====================================================
           MEDIA
           ==================================================== */
        media: {
            fame:
                0,
            followers:
                0,
            popularity:
                0,
            news:
                [],
            social:
                []
        },
        /* ====================================================
           WORLD
           ==================================================== */
        world: {
            country:
                "Brazil",
            city:
                "São Paulo",
            organizations:
                [],
            fighters:
                [],
            events:
                [],
            rankings:
                []
        },
        /* ====================================================
           LIFE
           ==================================================== */
        life: {
            relationship:
                null,
            spouse:
                null,
            children:
                [],
            family:
                [],
            lifestyle:
                "normal"
        },
        /* ====================================================
           DYNASTY
           ==================================================== */
        dynasty: {
            active:
                false,
            generation:
                1,
            heir:
                null,
            familyHistory:
                [],
            legacy:
                0
        },
        /* ====================================================
           CALENDAR
           ==================================================== */
        calendar: {
            year:
                2026,
            month:
                1,
            week:
                1,
            day:
                1
        },
        /* ====================================================
           HISTORY
           ==================================================== */
        history: [],
        /* ====================================================
           NOTIFICATIONS
           ==================================================== */
        notifications: [],
        /* ====================================================
           SETTINGS
           ==================================================== */
        settings: {
            difficulty:
                "normal",
            language:
                "pt-BR",
            autosave:
                true
        }
    };
}
/* ============================================================
   GARANTIR ESTRUTURA
   ============================================================ */
function ensureDatabaseStructure(database) {
    if (!database || typeof database !== "object") {
        return createDatabase();
    }
    const fresh =
        createDatabase();
    function merge(target, source) {
        Object.keys(source).forEach(key => {
            if (
                source[key] &&
                typeof source[key] === "object" &&
                !Array.isArray(source[key])
            ) {
                if (
                    !target[key] ||
                    typeof target[key] !== "object"
                ) {
                    target[key] = {};
                }
                merge(
                    target[key],
                    source[key]
                );
            } else if (
                target[key] === undefined
            ) {
                target[key] =
                    source[key];
            }
        });
    }
    merge(
        database,
        fresh
    );
    return database;
}
/* ============================================================
   GLOBAL DATABASE
   ============================================================ */
function exposeDatabase() {
    if (
        typeof window === "undefined"
    ) {
        return;
    }
    window.MMA_LIFE_DATABASE =
        mainState.database;
    window.MMA_LIFE_STATE =
        mainState;
}
/* ============================================================
   ERROS
   ============================================================ */
function registerError(
    source,
    error
) {
    const entry = {
        source,
        message:
            error?.message ||
            String(error),
        stack:
            error?.stack ||
            null,
        timestamp:
            new Date().toISOString()
    };
    mainState.errors.push(
        entry
    );
    console.error(
        "[MMA LIFE DYNASTY]",
        source,
        error
    );
}
/* ============================================================
   LOAD MODULE
   ============================================================ */
async function loadModule(
    path
) {
    try {
        const module =
            await import(path);
        if (
            !mainState.loadedModules.includes(
                path
            )
        ) {
            mainState.loadedModules.push(
                path
            );
        }
        console.log(
            "[MMA LIFE DYNASTY] ✓",
            path
        );
        return {
            success:
                true,
            path,
            module
        };
    }
    catch (error) {
        if (
            !mainState.failedModules.includes(
                path
            )
        ) {
            mainState.failedModules.push(
                path
            );
        }
        registerError(
            path,
            error
        );
        return {
            success:
                false,
            path,
            error
        };
    }
}
/* ============================================================
   SISTEMAS DO JOGO
   ============================================================ */
/*
    IMPORTANTE:
    Não usamos mais "./ui/ui.js".
    A UI real do projeto está dividida em:
        ui/index.js
        ui/gameUI.js
        ui/bootstrap.js
        telas individuais
    Primeiro carregamos o ENGINE.
    Depois carregamos a UI.
*/
const CORE_MODULES = [
    "./core/time.js",
    "./core/calendar.js",
    "./core/events.js",
    "./core/rng.js"
];
const PLAYER_MODULES = [
    "./player/player.js",
    "./player/attributes.js",
    "./player/development.js"
];
const MMA_MODULES = [
    "./mma/fights.js",
    "./mma/fighters.js"
];
const CAREER_MODULES = [
    "./career/career.js",
    "./career/contracts.js",
    "./career/managers.js"
];
const PROMOTION_MODULES = [
    "./promotions/promotions.js",
    "./promotions/rankings.js"
];
const LIFE_MODULES = [
    "./life/life.js",
    "./life/family.js"
];
const OTHER_MODULES = [
    "./business/business.js",
    "./media/media.js",
    "./world/world.js"
];
/* ============================================================
   UI MODULES
   ============================================================ */
const UI_MODULES = [
    "./ui/layout.js",
    "./ui/hud.js",
    "./ui/mainMenu.js",
    "./ui/screens.js",
    "./ui/dashboard.js",
    "./ui/careerScreen.js",
    "./ui/trainingScreen.js",
    "./ui/fightsScreen.js",
    "./ui/lifeOverviewScreen.js",
    "./ui/familyScreen.js",
    "./ui/financesScreen.js",
    "./ui/mediaScreen.js",
    "./ui/dynastyScreen.js",
    "./ui/promotionScreen.js",
    "./ui/rankingsScreen.js",
    "./ui/contractsScreen.js",
    "./ui/profileScreen.js",
    "./ui/settingsScreen.js",
    "./ui/gameUI.js",
    "./ui/characterCreation.js",
    "./ui/index.js",
    "./ui/bootstrap.js"
];
/* ============================================================
   LOAD GAME SYSTEMS
   ============================================================ */
async function loadGameSystems() {
    if (
        mainState.systemsInitialized
    ) {
        return;
    }
    console.log(
        "=========================================="
    );
    console.log(
        "MMA LIFE DYNASTY"
    );
    console.log(
        "Carregando sistemas..."
    );
    console.log(
        "=========================================="
    );
    const groups = [
        CORE_MODULES,
        PLAYER_MODULES,
        MMA_MODULES,
        CAREER_MODULES,
        PROMOTION_MODULES,
        LIFE_MODULES,
        OTHER_MODULES
    ];
    /*
        Aqui usamos ordem.
        Alguns sistemas dependem dos anteriores.
        Portanto NÃO fazemos Promise.all em tudo.
    */
    for (
        const group of groups
    ) {
        for (
            const path of group
        ) {
            await loadModule(
                path
            );
        }
    }
    /*
        A UI vem depois do engine.
    */
    for (
        const path of UI_MODULES
    ) {
        await loadModule(
            path
        );
    }
    mainState.systemsInitialized =
        true;
    console.log(
        "=========================================="
    );
    console.log(
        "Sistemas carregados:",
        mainState.loadedModules.length
    );
    console.log(
        "Sistemas com erro:",
        mainState.failedModules.length
    );
    console.log(
        "=========================================="
    );
}
/* ============================================================
   LOCALIZAR API
   ============================================================ */
function getGlobalAPI(
    names
) {
    if (
        typeof window === "undefined"
    ) {
        return null;
    }
    for (
        const name of names
    ) {
        if (
            window[name]
        ) {
            return window[name];
        }
    }
    return null;
}
/* ============================================================
   INITIALIZE UI
   ============================================================ */
async function initializeUI() {
    if (
        mainState.uiInitialized
    ) {
        return mainState.ui;
    }
    /*
        ui/index.js exporta:
            uiAPI
        e também coloca:
            window.uiAPI
            window.MMA_LIFE_UI
    */
    const uiAPI =
        getGlobalAPI([
            "uiAPI",
            "MMA_LIFE_UI"
        ]);
    const gameUIAPI =
        getGlobalAPI([
            "MMA_LIFE_GAME_UI"
        ]);
    if (
        uiAPI
    ) {
        mainState.ui =
            uiAPI;
    }
    if (
        gameUIAPI
    ) {
        mainState.gameUI =
            gameUIAPI;
    }
    /*
        Se a UI principal foi carregada,
        entregamos o database para ela.
    */
    if (
        mainState.ui &&
        typeof mainState.ui.initialize ===
        "function"
    ) {
        try {
            mainState.ui.initialize(
                mainState.database,
                {
                    startAtCharacterCreation:
                        true
                }
            );
            mainState.uiInitialized =
                true;
        }
        catch (error) {
            registerError(
                "ui.initialize",
                error
            );
        }
    }
    /*
        Caso ui/index.js ainda não tenha
        colocado a API global, tentamos
        diretamente o gameUI.
    */
    if (
        !mainState.ui &&
        mainState.gameUI &&
        typeof mainState.gameUI.initialize ===
        "function"
    ) {
        try {
            mainState.gameUI.initialize(
                mainState.database,
                {
                    render:
                        true
                }
            );
            mainState.uiInitialized =
                true;
        }
        catch (error) {
            registerError(
                "gameUI.initialize",
                error
            );
        }
    }
    /*
        Character Creation
    */
    const characterCreationAPI =
        getGlobalAPI([
            "characterCreationAPI",
            "MMA_LIFE_CHARACTER_CREATION"
        ]);
    if (
        characterCreationAPI
    ) {
        mainState.characterCreation =
            characterCreationAPI;
    }
    exposeDatabase();
    return mainState.ui;
}
/* ============================================================
   RENDER CHARACTER CREATION
   ============================================================ */
async function showCharacterCreation() {
    await initializeUI();
    /*
        Primeira tentativa:
        API principal da UI.
    */
    if (
        mainState.ui &&
        typeof mainState.ui.startCharacterCreation ===
        "function"
    ) {
        try {
            mainState.ui.startCharacterCreation(
                mainState.database
            );
            return true;
        }
        catch (error) {
            registerError(
                "ui.startCharacterCreation",
                error
            );
        }
    }
    /*
        Segunda tentativa:
        abrir diretamente pelo gameUI.
    */
    if (
        mainState.gameUI &&
        typeof mainState.gameUI.setActiveScreen ===
        "function"
    ) {
        try {
            mainState.gameUI.setActiveScreen(
                "characterCreation"
            );
            return true;
        }
        catch (error) {
            registerError(
                "gameUI.characterCreation",
                error
            );
        }
    }
    /*
        Terceira tentativa:
        Character Creation API.
    */
    if (
        mainState.characterCreation &&
        typeof mainState.characterCreation.render ===
        "function"
    ) {
        try {
            mainState.characterCreation.render(
                mainState.database
            );
            return true;
        }
        catch (error) {
            registerError(
                "characterCreation.render",
                error
            );
        }
    }
    return false;
}
/* ============================================================
   NORMALIZAR PESO
   ============================================================ */
function normalizeWeightClass(
    value
) {
    if (
        !value
    ) {
        return "lightweight";
    }
    const map = {
        "Mosca":
            "flyweight",
        "Galo":
            "bantamweight",
        "Pena":
            "featherweight",
        "Leve":
            "lightweight",
        "Meio-Médio":
            "welterweight",
        "Médio":
            "middleweight",
        "Meio-Pesado":
            "light-heavyweight",
        "Pesado":
            "heavyweight"
    };
    if (
        map[value]
    ) {
        return map[value];
    }
    return String(value)
        .toLowerCase()
        .replace(
            /\s+/g,
            "-"
        );
}
/* ============================================================
   CALCULAR OVR
   ============================================================ */
function calculateOverall(
    attributes
) {
    if (
        !attributes ||
        typeof attributes !== "object"
    ) {
        return 50;
    }
    const values =
        Object.values(
            attributes
        )
            .map(
                value =>
                    Number(value)
            )
            .filter(
                value =>
                    Number.isFinite(value)
            );
    if (
        !values.length
    ) {
        return 50;
    }
    const total =
        values.reduce(
            (
                sum,
                value
            ) =>
                sum + value,
            0
        );
    return Math.round(
        total /
        values.length
    );
}
/* ============================================================
   APLICAR PERSONAGEM
   ============================================================ */
function applyCharacterToGame(
    character
) {
    if (
        !character
    ) {
        throw new Error(
            "Personagem inválido."
        );
    }
    mainState.database =
        ensureDatabaseStructure(
            mainState.database
        );
    const db =
        mainState.database;
    const player =
        db.player;
    /*
        IDENTIDADE
    */
    player.id =
        character.id ||
        `player-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 9)}`;
    player.firstName =
        character.firstName ||
        character.name ||
        "";
    player.lastName =
        character.lastName ||
        "";
    player.fullName =
        character.fullName ||
        `${player.firstName} ${player.lastName}`
            .trim();
    player.displayName =
        character.displayName ||
        character.nickname ||
        player.fullName;
    player.nickname =
        character.nickname ||
        "";
    /*
        DADOS PESSOAIS
    */
    player.gender =
        character.gender ||
        "male";
    player.age =
        Number(character.age) ||
        16;
    player.country =
        character.country ||
        "Brazil";
    player.city =
        character.city ||
        "São Paulo";
    /*
        FÍSICO
        Character Creation usa altura em metros.
        Mantemos o padrão do jogo em metros.
    */
    player.height =
        Number(character.height) ||
        1.75;
    player.weight =
        Number(character.weight) ||
        70;
    player.weightClass =
        normalizeWeightClass(
            character.weightClass
        );
    /*
        MMA
    */
    player.fightingStyle =
        character.fightingStyle ||
        character.style ||
        "MMA";
    player.stance =
        character.stance ||
        "Ortodoxo";
    player.personality =
        character.personality ||
        "disciplinado";
    /*
        ATRIBUTOS
    */
    if (
        character.attributes &&
        typeof character.attributes ===
        "object"
    ) {
        player.attributes = {
            ...player.attributes,
            ...character.attributes
        };
    }
    /*
        POTENCIAL
    */
    if (
        character.potential &&
        typeof character.potential ===
        "object"
    ) {
        player.potential = {
            ...player.potential,
            ...character.potential
        };
    }
    /*
        GENÉTICA
    */
    if (
        character.genetics &&
        typeof character.genetics ===
        "object"
    ) {
        player.genetics = {
            ...player.genetics,
            ...character.genetics
        };
    }
    /*
        OVR
        Se o criador forneceu OVR,
        preservamos.
        Caso contrário calculamos.
    */
    player.overall =
        Number(
            character.overall
        ) ||
        calculateOverall(
            player.attributes
        );
    /*
        ESTADO INICIAL
    */
    player.careerStage =
        "amateur";
    player.amateur =
        true;
    player.professional = {
        active:
            false,
        debutAge:
            null,
        fights:
            0,
        wins:
            0,
        losses:
            0,
        draws:
            0,
        noContests:
            0
    };
    /*
        CAREER DATABASE
    */
    db.career.stage =
        "amateur";
    db.career.promotion =
        null;
    db.career.manager =
        null;
    db.career.contract =
        null;
    db.career.ranking =
        null;
    db.career.record = {
        wins:
            0,
        losses:
            0,
        draws:
            0,
        noContests:
            0
    };
    /*
        ENERGIA / SAÚDE
    */
    player.health =
        100;
    player.energy =
        100;
    player.fatigue =
        0;
    player.confidence =
        50;
    player.morale =
        50;
    player.experience =
        0;
    player.fame =
        0;
    player.followers =
        0;
    player.reputation =
        0;
    db.health.overall =
        100;
    db.health.recovery =
        100;
    db.training.energy =
        100;
    db.training.fatigue =
        0;
    /*
        FINANÇAS
    */
    player.money =
        0;
    db.business.money =
        0;
    db.business.income =
        0;
    db.business.expenses =
        0;
    /*
        MÍDIA
    */
    db.media.fame =
        0;
    db.media.followers =
        0;
    /*
        MUNDO
    */
    db.world.country =
        player.country;
    db.world.city =
        player.city;
    /*
        METADATA
    */
    db.meta.lastUpdated =
        new Date().toISOString();
    exposeDatabase();
    /*
        Deixa os sistemas enxergarem
        o jogador imediatamente.
    */
    dispatchGameEvent(
        "mma-life-player-updated",
        {
            player,
            database: db
        }
    );
    return player;
}
/* ============================================================
   DISPATCH EVENT
   ============================================================ */
function dispatchGameEvent(
    name,
    detail = {}
) {
    if (
        typeof document ===
        "undefined"
    ) {
        return;
    }
    try {
        document.dispatchEvent(
            new CustomEvent(
                name,
                {
                    detail
                }
            )
        );
    }
    catch (error) {
        registerError(
            `event:${name}`,
            error
        );
    }
}
/* ============================================================
   ESCONDER BOOT / START
   ============================================================ */
function hideBootScreens() {
    if (
        typeof document ===
        "undefined"
    ) {
        return;
    }
    const selectors = [
        "#boot-screen",
        "#bootScreen",
        "#loading-screen",
        "#loadingScreen",
        "#start-screen",
        "#startScreen",
        ".boot-screen",
        ".loading-screen",
        ".start-screen",
        "[data-boot-screen]",
        "[data-loading-screen]",
        "[data-start-screen]"
    ];
    selectors.forEach(
        selector => {
            document
                .querySelectorAll(selector)
                .forEach(element => {
                    element.style.display =
                        "none";
                    element.style.pointerEvents =
                        "none";
                    element.setAttribute(
                        "aria-hidden",
                        "true"
                    );
                });
        }
    );
    /*
        O container principal deve continuar
        clicável.
    */
    const app =
        document.querySelector(
            "#app"
        );
    if (
        app
    ) {
        app.style.pointerEvents =
            "auto";
    }
}
/* ============================================================
   SALVAR
   ============================================================ */
function saveGame() {
    if (
        !mainState.database
    ) {
        return false;
    }
    try {
        const serialized =
            JSON.stringify(
                mainState.database
            );
        localStorage.setItem(
            "mma-life-dynasty-save",
            serialized
        );
        mainState.lastSave =
            Date.now();
        return true;
    }
    catch (error) {
        registerError(
            "saveGame",
            error
        );
        return false;
    }
}
/* ============================================================
   CARREGAR SAVE
   ============================================================ */
function loadGame() {
    try {
        const serialized =
            localStorage.getItem(
                "mma-life-dynasty-save"
            );
        if (
            !serialized
        ) {
            return null;
        }
        const saved =
            JSON.parse(
                serialized
            );
        mainState.database =
            ensureDatabaseStructure(
                saved
            );
        exposeDatabase();
        return mainState.database;
    }
    catch (error) {
        registerError(
            "loadGame",
            error
        );
        return null;
    }
}
/* ============================================================
   START CAREER
   ============================================================ */
async function startCareer(
    character
) {
    /*
        Evita iniciar duas vezes.
    */
    if (
        mainState.careerStarted
    ) {
        return {
            success:
                true,
            alreadyStarted:
                true,
            player:
                mainState.database.player
        };
    }
    if (
        !mainState.initialized
    ) {
        await initialize();
    }
    try {
        /*
            1. Aplica personagem
        */
        applyCharacterToGame(
            character
        );
        /*
            2. Estado do jogo
        */
        mainState.started =
            true;
        mainState.careerStarted =
            true;
        mainState.status =
            "started";
        /*
            3. Expõe tudo
        */
        exposeDatabase();
        /*
            4. Permite que player.js
               faça sua inicialização
               caso tenha API.
        */
        const playerAPI =
            getGlobalAPI([
                "playerAPI",
                "MMA_LIFE_PLAYER"
            ]);
        if (
            playerAPI
        ) {
            try {
                if (
                    typeof playerAPI.initialize ===
                    "function"
                ) {
                    await playerAPI.initialize(
                        mainState.database
                    );
                }
                else if (
                    typeof playerAPI.init ===
                    "function"
                ) {
                    await playerAPI.init(
                        mainState.database
                    );
                }
            }
            catch (error) {
                registerError(
                    "player.initialize",
                    error
                );
            }
        }
        /*
            5. Eventos
        */
        dispatchGameEvent(
            "mma-life-career-started",
            {
                player:
                    mainState.database.player,
                database:
                    mainState.database,
                state:
                    mainState.database
            }
        );
        /*
            6. Salva
        */
        saveGame();
        /*
            7. Atualiza UI
        */
        if (
            mainState.ui &&
            typeof mainState.ui.setDatabase ===
            "function"
        ) {
            mainState.ui.setDatabase(
                mainState.database
            );
        }
        /*
            8. Dashboard real
        */
        await showDashboard();
        /*
            9. Esconde telas de boot
        */
        hideBootScreens();
        /*
            10. Atualiza
        */
        dispatchGameEvent(
            "mma-life-game-started",
            {
                player:
                    mainState.database.player,
                database:
                    mainState.database
            }
        );
        return {
            success:
                true,
            player:
                mainState.database.player,
            database:
                mainState.database
        };
    }
    catch (error) {
        mainState.careerStarted =
            false;
        mainState.started =
            false;
        mainState.status =
            "error";
        registerError(
            "startCareer",
            error
        );
        return {
            success:
                false,
            error:
                error?.message ||
                String(error)
        };
    }
}
/* ============================================================
   START NEW GAME
   ============================================================ */
/*
    Alguns módulos podem procurar
    por startNewGame.
    Portanto mantemos os dois nomes.
*/
async function startNewGame(
    character
) {
    return startCareer(
        character
    );
}
/* ============================================================
   DASHBOARD
   ============================================================ */
async function showDashboard() {
    /*
        UI principal
    */
    if (
        mainState.ui &&
        typeof mainState.ui.openDashboard ===
        "function"
    ) {
        try {
            const result =
                mainState.ui.openDashboard();
            if (
                mainState.ui.refresh
            ) {
                try {
                    mainState.ui.refresh();
                }
                catch (error) {
                    registerError(
                        "ui.refresh.dashboard",
                        error
                    );
                }
            }
            return result;
        }
        catch (error) {
            registerError(
                "ui.openDashboard",
                error
            );
        }
    }
    /*
        gameUI
    */
    if (
        mainState.gameUI &&
        typeof mainState.gameUI.setActiveScreen ===
        "function"
    ) {
        try {
            return mainState.gameUI.setActiveScreen(
                "dashboard"
            );
        }
        catch (error) {
            registerError(
                "gameUI.dashboard",
                error
            );
        }
    }
    return false;
}
/* ============================================================
   NAVEGAÇÃO
   ============================================================ */
function openScreen(
    screen,
    options = {}
) {
    if (
        !screen
    ) {
        return false;
    }
    /*
        UI principal
    */
    if (
        mainState.ui &&
        typeof mainState.ui.openScreen ===
        "function"
    ) {
        try {
            const result =
                mainState.ui.openScreen(
                    screen,
                    options
                );
            if (
                mainState.ui.refresh
            ) {
                try {
                    mainState.ui.refresh(
                        options
                    );
                }
                catch (error) {
                    registerError(
                        `ui.refresh.${screen}`,
                        error
                    );
                }
            }
            return result;
        }
        catch (error) {
            registerError(
                `ui.openScreen.${screen}`,
                error
            );
        }
    }
    /*
        gameUI
    */
    if (
        mainState.gameUI &&
        typeof mainState.gameUI.setActiveScreen ===
        "function"
    ) {
        try {
            return mainState.gameUI.setActiveScreen(
                screen,
                options
            );
        }
        catch (error) {
            registerError(
                `gameUI.openScreen.${screen}`,
                error
            );
        }
    }
    return false;
}
/* ============================================================
   ATALHOS DE NAVEGAÇÃO
   ============================================================ */
function openCareer() {
    return openScreen(
        "career"
    );
}
function openTraining() {
    return openScreen(
        "training"
    );
}
function openFights() {
    return openScreen(
        "fights"
    );
}
function openLife() {
    return openScreen(
        "life"
    );
}
function openFamily() {
    return openScreen(
        "family"
    );
}
function openFinances() {
    return openScreen(
        "finances"
    );
}
function openMedia() {
    return openScreen(
        "media"
    );
}
function openDynasty() {
    return openScreen(
        "dynasty"
    );
}
function openPromotions() {
    return openScreen(
        "promotion"
    );
}
function openRankings() {
    return openScreen(
        "rankings"
    );
}
function openContracts() {
    return openScreen(
        "contracts"
    );
}
function openProfile() {
    return openScreen(
        "profile"
    );
}
function openSettings() {
    return openScreen(
        "settings"
    );
}
/* ============================================================
   EVENTO: PERSONAGEM CRIADO
   ============================================================ */
let characterEventHandled =
    false;
async function handleCharacterCreated(
    event
) {
    const character =
        event?.detail?.character;
    if (
        !character
    ) {
        console.warn(
            "[MMA LIFE DYNASTY] " +
            "Evento de personagem sem character."
        );
        return;
    }
    /*
        Evita duplicidade.
    */
    if (
        characterEventHandled ||
        mainState.careerStarted
    ) {
        return;
    }
    characterEventHandled =
        true;
    console.log(
        "[MMA LIFE DYNASTY] " +
        "Personagem recebido."
    );
    try {
        await startCareer(
            character
        );
    }
    catch (error) {
        characterEventHandled =
            false;
        registerError(
            "mma-life-character-created",
            error
        );
    }
}
/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
async function initialize() {
    if (
        mainState.initialized
    ) {
        return mainState;
    }
    mainState.status =
        "booting";
    console.log(
        "=========================================="
    );
    console.log(
        "🥊 MMA LIFE DYNASTY"
    );
    console.log(
        "ENGINE",
        MAIN_VERSION
    );
    console.log(
        "=========================================="
    );
    /*
        DATABASE
    */
    if (
        !mainState.database
    ) {
        mainState.database =
            createDatabase();
    }
    mainState.database =
        ensureDatabaseStructure(
            mainState.database
        );
    exposeDatabase();
    /*
        SISTEMAS
    */
    await loadGameSystems();
    /*
        UI
    */
    await initializeUI();
    /*
        EVENTOS
    */
    if (
        typeof document !==
        "undefined"
    ) {
        /*
            Não adicionamos o listener
            mais de uma vez.
        */
        if (
            !document.__mmaLifeCharacterListener
        ) {
            document.addEventListener(
                "mma-life-character-created",
                handleCharacterCreated
            );
            document.__mmaLifeCharacterListener =
                true;
        }
    }
    mainState.initialized =
        true;
    mainState.status =
        "initialized";
    /*
        Mostra criação
        somente se ainda não
        existe personagem iniciado.
    */
    if (
        !mainState.careerStarted
    ) {
        await showCharacterCreation();
    }
    console.log(
        "=========================================="
    );
    console.log(
        "MMA LIFE DYNASTY pronto."
    );
    console.log(
        "=========================================="
    );
    dispatchGameEvent(
        "mma-life-engine-ready",
        {
            state:
                mainState,
            database:
                mainState.database
        }
    );
    return mainState;
}
/* ============================================================
   RESET
   ============================================================ */
function resetGame() {
    mainState.status =
        "initialized";
    mainState.started =
        false;
    mainState.careerStarted =
        false;
    mainState.database =
        createDatabase();
    characterEventHandled =
        false;
    exposeDatabase();
    dispatchGameEvent(
        "mma-life-game-reset",
        {
            database:
                mainState.database
        }
    );
    showCharacterCreation();
    return mainState.database;
}
/* ============================================================
   GET STATE
   ============================================================ */
function getState() {
    return {
        version:
            mainState.version,
        status:
            mainState.status,
        initialized:
            mainState.initialized,
        started:
            mainState.started,
        careerStarted:
            mainState.careerStarted,
        uiInitialized:
            mainState.uiInitialized,
        systemsInitialized:
            mainState.systemsInitialized,
        loadedModules:
            [...mainState.loadedModules],
        failedModules:
            [...mainState.failedModules],
        errors:
            [...mainState.errors],
        database:
            mainState.database
    };
}
/* ============================================================
   VALIDATE
   ============================================================ */
function validateGame() {
    const errors = [];
    if (
        !mainState.database
    ) {
        errors.push(
            "Database não existe."
        );
    }
    if (
        !mainState.database?.player
    ) {
        errors.push(
            "Player não existe."
        );
    }
    if (
        !mainState.uiInitialized
    ) {
        errors.push(
            "UI não inicializada."
        );
    }
    return {
        valid:
            errors.length === 0,
        errors
    };
}
/* ============================================================
   API PRINCIPAL
   ============================================================ */
const gameAPI = {
    version:
        MAIN_VERSION,
    state:
        mainState,
    initialize,
    init:
        initialize,
    startCareer,
    startNewGame,
    applyCharacterToGame,
    showDashboard,
    openScreen,
    openCareer,
    openTraining,
    openFights,
    openLife,
    openFamily,
    openFinances,
    openMedia,
    openDynasty,
    openPromotions,
    openRankings,
    openContracts,
    openProfile,
    openSettings,
    saveGame,
    loadGame,
    resetGame,
    getState,
    validate:
        validateGame,
    getDatabase() {
        return mainState.database;
    }
};
/* ============================================================
   GLOBAL API
   ============================================================ */
if (
    typeof window !==
    "undefined"
) {
    window.MMA_LIFE_GAME =
        gameAPI;
    window.MMA_LIFE_DYNASTY =
        gameAPI;
    window.MMA_LIFE_MAIN =
        gameAPI;
    window.MMA_LIFE_DATABASE =
        mainState.database;
}
/* ============================================================
   AUTO BOOT
   ============================================================ */
async function boot() {
    try {
        await initialize();
    }
    catch (error) {
        mainState.status =
            "error";
        registerError(
            "boot",
            error
        );
        /*
            Mesmo com um sistema secundário
            quebrado, tentamos manter a UI.
        */
        try {
            await initializeUI();
        }
        catch (uiError) {
            registerError(
                "boot.ui-recovery",
                uiError
            );
        }
    }
}
/* ============================================================
   DOM READY
   ============================================================ */
if (
    typeof document !==
    "undefined"
) {
    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            boot,
            {
                once:
                    true
            }
        );
    }
    else {
        boot();
    }
}
/* ============================================================
   EXPORT
   ============================================================ */
export {
    MAIN_VERSION,
    mainState,
    createDatabase,
    initialize,
    startCareer,
    startNewGame,
    applyCharacterToGame,
    showDashboard,
    openScreen,
    openCareer,
    openTraining,
    openFights,
    openLife,
    openFamily,
    openFinances,
    openMedia,
    openDynasty,
    openPromotions,
    openRankings,
    openContracts,
    openProfile,
    openSettings,
    saveGame,
    loadGame,
    resetGame,
    getState,
    validateGame
};
export default gameAPI;
