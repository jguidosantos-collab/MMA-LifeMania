/* ============================================================
   MMA LIFE DYNASTY
   MAIN ENGINE
   ORCHESTRATOR
   ------------------------------------------------------------
   index.html
        ↓
   main.js
        ↓
   ENGINE
        ↓
   bootstrap.js
        ↓
   gameUI.js
        ↓
   TELAS EXISTENTES
        ↓
   JOGO
   ============================================================ */

"use strict";


/* ============================================================
   VERSÃO
   ============================================================ */

const MAIN_VERSION = "ORCHESTRATOR-1.0.0";


/* ============================================================
   ESTADO PRINCIPAL
   ============================================================ */

const mainState = {

    version:
        MAIN_VERSION,

    status:
        "booting",

    initialized:
        false,

    started:
        false,

    careerStarted:
        false,

    database:
        null,

    gameUI:
        null,

    characterCreation:
        null,

    bootstrap:
        null,

    loadedModules:
        [],

    failedModules:
        [],

    errors:
        [],

    bootTime:
        Date.now(),

    lastSave:
        null

};


/* ============================================================
   UTILIDADES
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

        time:
            Date.now()

    };


    mainState.errors.push(
        entry
    );


    console.error(
        "[MMA LIFE DYNASTY]",
        source,
        error
    );


    return entry;

}


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


function getGlobalAPI(
    names = []
) {

    for (
        const name of names
    ) {

        if (
            typeof globalThis !==
            "undefined" &&
            globalThis[name]
        ) {

            return globalThis[name];

        }

    }


    return null;

}


/* ============================================================
   DATABASE PRINCIPAL
   ============================================================ */

function createDatabase() {

    return {

        meta: {

            game:
                "MMA Life Dynasty",

            version:
                "1.0.0",

            engine:
                "MMA Life Dynasty Engine"

        },


        player: {

            id:
                null,

            firstName:
                "",

            lastName:
                "",

            fullName:
                "",

            displayName:
                "",

            nickname:
                "",

            gender:
                "male",

            age:
                18,

            country:
                "Brazil",

            city:
                "São Paulo",

            height:
                1.75,

            weight:
                70,

            weightClass:
                "lightweight",

            fightingStyle:
                "mixed",

            stance:
                "orthodox",

            personality:
                "disciplined",


            careerStage:
                "amateur",


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
                    0

            },


            attributes: {

                striking:
                    50,

                grappling:
                    50,

                wrestling:
                    50,

                submission:
                    50,

                defense:
                    50,

                cardio:
                    50,

                strength:
                    50,

                speed:
                    50,

                chin:
                    50,

                fightIQ:
                    50

            },


            potential: {

                overall:
                    50,

                ceiling:
                    75

            },


            genetics: {

                athleticism:
                    50,

                durability:
                    50,

                strength:
                    50,

                speed:
                    50,

                cardio:
                    50

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

            health:
                100,

            energy:
                100,

            fatigue:
                0,

            money:
                0

        },


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

            history:
                []

        },


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


        history:
            [],


        notifications:
            [],


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
   NORMALIZAÇÃO
   ============================================================ */

function ensureDatabaseStructure(
    database
) {

    const base =
        createDatabase();


    if (
        !database ||
        typeof database !==
        "object"
    ) {

        return base;

    }


    const result = {

        ...base,

        ...database

    };


    const nestedObjects = [

        "meta",
        "player",
        "career",
        "training",
        "health",
        "fights",
        "promotions",
        "business",
        "media",
        "world",
        "life",
        "dynasty",
        "calendar",
        "settings"

    ];


    for (
        const key of nestedObjects
    ) {

        result[key] = {

            ...base[key],

            ...(database[key] || {})

        };

    }


    result.player.professional = {

        ...base.player.professional,

        ...(database.player?.professional || {})

    };


    result.player.attributes = {

        ...base.player.attributes,

        ...(database.player?.attributes || {})

    };


    result.player.potential = {

        ...base.player.potential,

        ...(database.player?.potential || {})

    };


    result.player.genetics = {

        ...base.player.genetics,

        ...(database.player?.genetics || {})

    };


    result.career.record = {

        ...base.career.record,

        ...(database.career?.record || {})

    };


    for (
        const key of [
            "history",
            "notifications"
        ]
    ) {

        if (
            !Array.isArray(
                result[key]
            )
        ) {

            result[key] = [];

        }

    }


    return result;

}


/* ============================================================
   EXPOR DATABASE
   ============================================================ */

function exposeDatabase() {

    const db =
        mainState.database;


    if (!db) {

        return;

    }


    globalThis.MMA_LIFE_DATABASE =
        db;

    globalThis.mmaLifeDatabase =
        db;

    globalThis.gameDatabase =
        db;

    globalThis.database =
        db;

    globalThis.MMA_LIFE_STATE =
        db;

    globalThis.mmaLifeState =
        db;

    globalThis.db =
        db;

}


/* ============================================================
   MÓDULOS DO ENGINE
   ============================================================ */

const ENGINE_MODULES = [

    "./core/time.js",

    "./core/calendar.js",

    "./core/events.js",

    "./core/rng.js",


    "./player/player.js",

    "./player/attributes.js",

    "./player/development.js",


    "./training/training.js",


    "./mma/fights.js",

    "./mma/fighters.js",


    "./career/career.js",

    "./career/contracts.js",

    "./career/managers.js",


    "./promotions/promotions.js",

    "./promotions/rankings.js",


    "./business/business.js",

    "./media/media.js",

    "./world/world.js",


    "./life/life.js",

    "./life/family.js",

    "./life/dynasty.js"

];


/* ============================================================
   MÓDULOS DA UI
   ============================================================ */

const UI_MODULES = [

    "./ui/gameUI.js",

    "./ui/characterCreation.js",

    "./ui/hud.js",

    "./ui/mainMenu.js",

    "./ui/layout.js",

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

    "./ui/bootstrap.js"

];


/* ============================================================
   CARREGAR MÓDULO
   ============================================================ */

async function loadModuleSafe(
    path
) {

    try {

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
            "[MMA LIFE DYNASTY] carregado:",
            path
        );


        return true;

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
            `module:${path}`,
            error
        );


        return false;

    }

}


/* ============================================================
   CARREGAR ENGINE
   ============================================================ */

async function loadEngineModules() {

    for (
        const path of ENGINE_MODULES
    ) {

        await loadModuleSafe(
            path
        );

    }

}


/* ============================================================
   CARREGAR UI
   ============================================================ */

async function loadUIModules() {

    for (
        const path of UI_MODULES
    ) {

        await loadModuleSafe(
            path
        );

    }

}


/* ============================================================
   RESOLVER APIS
   ============================================================ */

function resolveAPIs() {

    mainState.gameUI =
        getGlobalAPI([

            "gameUIAPI",

            "MMA_LIFE_GAME_UI"

        ]);


    mainState.characterCreation =
        getGlobalAPI([

            "characterCreationAPI",

            "MMA_LIFE_CHARACTER_CREATION"

        ]);


    mainState.bootstrap =
        getGlobalAPI([

            "uiBootstrapAPI",

            "bootstrapAPI",

            "MMA_LIFE_UI_BOOTSTRAP"

        ]);

}


/* ============================================================
   INICIALIZAR API
   ============================================================ */

async function initializeAPI(
    api,
    database
) {

    if (!api) {

        return false;

    }


    try {

        if (
            typeof api.initialize ===
            "function"
        ) {

            await api.initialize(
                database
            );

            return true;

        }


        if (
            typeof api.init ===
            "function"
        ) {

            await api.init(
                database
            );

            return true;

        }


        if (
            typeof api.start ===
            "function"
        ) {

            await api.start(
                database
            );

            return true;

        }


        return true;

    }

    catch (error) {

        registerError(
            "api.initialize",
            error
        );


        return false;

    }

}


/* ============================================================
   REGISTRAR UMA TELA NO GAME UI
   ============================================================ */

function registerGameUIScreen(
    name,
    api,
    title = name
) {

    const gameUI =
        mainState.gameUI;


    if (
        !gameUI ||
        typeof gameUI.registerScreen !==
        "function"
    ) {

        return false;

    }


    if (!api) {

        return false;

    }


    try {

        let renderFunction =
            null;


        if (
            typeof api.render ===
            "function"
        ) {

            renderFunction =
                function (
                    database,
                    options
                ) {

                    try {

                        return api.render(
                            database,
                            options
                        );

                    }

                    catch (error) {

                        registerError(
                            `screen:${name}`,
                            error
                        );


                        return `

                            <div
                                style="
                                    padding:40px;
                                    color:#fff;
                                "
                            >

                                <h2>
                                    Erro ao abrir ${title}
                                </h2>

                                <p>
                                    ${error.message || error}
                                </p>

                            </div>

                        `;

                    }

                };

        }


        if (!renderFunction) {

            renderFunction =
                function () {

                    return `

                        <div
                            style="
                                padding:40px;
                                color:#fff;
                            "
                        >

                            <h2>
                                ${title}
                            </h2>

                        </div>

                    `;

                };

        }


        gameUI.registerScreen(

            name,

            {

                title,

                render:
                    renderFunction

            }

        );


        return true;

    }

    catch (error) {

        registerError(
            `registerScreen:${name}`,
            error
        );


        return false;

    }

}


/* ============================================================
   REGISTRAR TODAS AS TELAS
   ============================================================ */

function registerAllScreens() {

    resolveAPIs();


    const screens = [

        [
            "dashboard",
            "dashboardAPI",
            "Dashboard"
        ],

        [
            "career",
            "careerScreenAPI",
            "Carreira"
        ],

        [
            "training",
            "trainingScreenAPI",
            "Treinamento"
        ],

        [
            "fights",
            "fightsScreenAPI",
            "Lutas"
        ],

        [
            "life",
            "lifeOverviewScreenAPI",
            "Vida"
        ],

        [
            "family",
            "familyScreenAPI",
            "Família"
        ],

        [
            "finances",
            "financesScreenAPI",
            "Finanças"
        ],

        [
            "media",
            "mediaScreenAPI",
            "Mídia"
        ],

        [
            "dynasty",
            "dynastyScreenAPI",
            "Dinastia"
        ],

        [
            "promotion",
            "promotionScreenAPI",
            "Promoções"
        ],

        [
            "rankings",
            "rankingsScreenAPI",
            "Rankings"
        ],

        [
            "contracts",
            "contractsScreenAPI",
            "Contratos"
        ],

        [
            "profile",
            "profileScreenAPI",
            "Perfil"
        ],

        [
            "settings",
            "settingsScreenAPI",
            "Configurações"
        ]

    ];


    for (
        const [
            name,
            apiName,
            title
        ]
        of screens
    ) {

        const api =
            getGlobalAPI([
                apiName
            ]);


        registerGameUIScreen(
            name,
            api,
            title
        );

    }

}


/* ============================================================
   MOSTRAR TELA DE CRIAÇÃO
   ------------------------------------------------------------
   NÃO passa characterCreation.render()
   pelo gameUI, porque o sistema de criação
   existente recebe um CONTAINER DOM.
   ============================================================ */

function showCharacterCreation() {

    const root =
        document.getElementById(
            "game-root"
        );


    if (!root) {

        throw new Error(
            "game-root não encontrado."
        );

    }


    const creation =
        mainState.characterCreation;


    if (
        !creation ||
        typeof creation.render !==
        "function"
    ) {

        throw new Error(
            "Sistema de criação de personagem não encontrado."
        );

    }


    root.innerHTML = "";


    creation.render(
        root
    );


    mainState.started =
        false;


    mainState.careerStarted =
        false;


    dispatchGameEvent(
        "mma-life-character-creation-opened"
    );

}


/* ============================================================
   OCULTAR TELAS DE BOOT
   ============================================================ */

function hideBootScreens() {

    const boot =
        document.getElementById(
            "boot-screen"
        );


    const start =
        document.getElementById(
            "start-screen"
        );


    if (boot) {

        boot.classList.add(
            "hidden"
        );

    }


    if (start) {

        start.classList.remove(
            "visible"
        );

    }

}


/* ============================================================
   MOSTRAR START SCREEN
   ============================================================ */

function showStartScreen() {

    const boot =
        document.getElementById(
            "boot-screen"
        );


    const start =
        document.getElementById(
            "start-screen"
        );


    if (boot) {

        boot.classList.add(
            "hidden"
        );

    }


    if (start) {

        start.classList.add(
            "visible"
        );

    }

}


/* ============================================================
   APLICAR PERSONAGEM AO DATABASE
   ============================================================ */

function applyCharacterToGame(
    character
) {

    if (!character) {

        throw new Error(
            "Personagem inválido."
        );

    }


    const database =
        mainState.database;


    const player =
        database.player;


    const generatedId =

        "player-" +

        Date.now() +

        "-" +

        Math.random()
            .toString(36)
            .slice(2, 9);


    player.id =
        character.id ||
        generatedId;


    player.firstName =
        character.firstName ||
        "";


    player.lastName =
        character.lastName ||
        "";


    player.fullName =

        character.fullName ||

        `${player.firstName} ${player.lastName}`
            .trim();


    player.nickname =
        character.nickname ||
        "";


    player.displayName =

        character.displayName ||

        player.nickname ||

        player.fullName;


    player.gender =
        character.gender ||
        "male";


    player.age =
        Number(character.age) ||
        18;


    player.country =
        character.country ||
        "Brazil";


    player.city =
        character.city ||
        "São Paulo";


    let height =
        Number(character.height);


    if (
        Number.isFinite(height)
    ) {

        if (
            height > 3
        ) {

            height =
                height / 100;

        }

        player.height =
            height;

    }


    player.weight =
        Number(character.weight) ||
        70;


    player.weightClass =
        normalizeWeightClass(
            character.weightClass
        );


    player.fightingStyle =

        character.fightingStyle ||

        character.style ||

        "mixed";


    player.stance =
        character.stance ||
        "orthodox";


    player.personality =

        character.personality ||

        "disciplined";


    /*
     * ATRIBUTOS
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
     * PERSONALIDADE
     *
     * Algumas versões do criador
     * podem devolver objeto.
     */

    if (
        character.personalityData &&
        typeof character.personalityData ===
        "object"
    ) {

        player.personality =
            character.personalityData;

    }


    /*
     * OVR
     */

    player.overall =
        calculateOverall(
            player.attributes
        );


    /*
     * POTENCIAL
     */

    if (
        typeof character.potential ===
        "number"
    ) {

        player.potential = {

            overall:
                player.overall,

            ceiling:
                character.potential

        };

    }

    else if (
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
     * CARREIRA
     *
     * Menor de 18:
     * continua amador.
     *
     * 18+:
     * pode entrar na carreira profissional.
     */

    if (
        player.age >= 18
    ) {

        player.careerStage =
            "regional";


        player.professional.active =
            true;


        player.professional.debutAge =
            player.professional.debutAge ||
            player.age;


        database.career.stage =
            "regional";

    }

    else {

        player.careerStage =
            "amateur";


        player.professional.active =
            false;


        database.career.stage =
            "amateur";

    }


    /*
     * Sincronização inicial.
     */

    database.training.energy =
        player.energy;


    database.training.fatigue =
        player.fatigue;


    database.health.overall =
        player.health;


    database.business.money =
        player.money;


    database.media.fame =
        player.fame;


    database.media.followers =
        player.followers;


    database.world.country =
        player.country;


    database.world.city =
        player.city;


    exposeDatabase();


    return player;

}


/* ============================================================
   NORMALIZAR CATEGORIA
   ============================================================ */

function normalizeWeightClass(
    value
) {

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


    if (
        typeof value ===
        "string"
    ) {

        return value
            .toLowerCase()
            .trim()
            .replace(
                /\s+/g,
                "-"
            );

    }


    return "lightweight";

}


/* ============================================================
   CALCULAR OVR
   ============================================================ */

function calculateOverall(
    attributes
) {

    if (
        !attributes ||
        typeof attributes !==
        "object"
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
        values.length === 0
    ) {

        return 50;

    }


    return Math.round(

        values.reduce(

            (
                total,
                value
            ) =>
                total + value,

            0

        ) /

        values.length

    );

}


/* ============================================================
   START NEW GAME
   ============================================================ */

async function startNewGame() {

    try {

        mainState.database =
            createDatabase();


        exposeDatabase();


        mainState.started =
            false;


        mainState.careerStarted =
            false;


        hideBootScreens();


        showCharacterCreation();


        dispatchGameEvent(

            "mma-life-new-game-started",

            {

                database:
                    mainState.database

            }

        );


        return {

            success:
                true,

            database:
                mainState.database

        };

    }

    catch (error) {

        registerError(
            "startNewGame",
            error
        );


        showBootError(
            error
        );


        return {

            success:
                false,

            error

        };

    }

}


/* ============================================================
   START CAREER
   ============================================================ */

async function startCareer(
    character = null
) {

    try {

        if (
            character
        ) {

            applyCharacterToGame(
                character
            );

        }


        if (
            !mainState.database.player ||
            !mainState.database.player.id
        ) {

            throw new Error(
                "Nenhum personagem foi criado."
            );

        }


        mainState.started =
            true;


        mainState.careerStarted =
            true;


        mainState.status =
            "playing";


        hideBootScreens();


        exposeDatabase();


        /*
         * Atualiza a UI existente.
         */

        resolveAPIs();


        if (
            mainState.gameUI
        ) {

            try {

                if (
                    typeof mainState.gameUI.setDatabase ===
                    "function"
                ) {

                    mainState.gameUI.setDatabase(
                        mainState.database
                    );

                }

            }

            catch (error) {

                registerError(
                    "gameUI.setDatabase",
                    error
                );

            }

        }


        /*
         * Dashboard é a entrada
         * oficial depois da criação.
         */

        if (
            mainState.gameUI &&
            typeof mainState.gameUI.setActiveScreen ===
            "function"
        ) {

            mainState.gameUI.setActiveScreen(
                "dashboard"
            );

        }

        else if (
            mainState.gameUI &&
            typeof mainState.gameUI.navigate ===
            "function"
        ) {

            mainState.gameUI.navigate(
                "dashboard",
                mainState.database
            );

        }


        saveGame();


        dispatchGameEvent(

            "mma-life-career-started",

            {

                database:
                    mainState.database,

                player:
                    mainState.database.player

            }

        );


        return {

            success:
                true,

            database:
                mainState.database

        };

    }

    catch (error) {

        registerError(
            "startCareer",
            error
        );


        showBootError(
            error
        );


        return {

            success:
                false,

            error

        };

    }

}


/* ============================================================
   NAVEGAÇÃO
   ============================================================ */

function navigate(
    screen
) {

    resolveAPIs();


    if (
        !mainState.gameUI
    ) {

        return false;

    }


    try {

        if (
            typeof mainState.gameUI.setDatabase ===
            "function"
        ) {

            mainState.gameUI.setDatabase(
                mainState.database
            );

        }


        if (
            typeof mainState.gameUI.setActiveScreen ===
            "function"
        ) {

            return mainState.gameUI.setActiveScreen(
                screen
            );

        }


        if (
            typeof mainState.gameUI.navigate ===
            "function"
        ) {

            return mainState.gameUI.navigate(
                screen,
                mainState.database
            );

        }


        return false;

    }

    catch (error) {

        registerError(
            `navigate:${screen}`,
            error
        );


        return false;

    }

}


/* ============================================================
   SAVE
   ============================================================ */

function saveGame() {

    try {

        if (
            !mainState.database
        ) {

            return false;

        }


        mainState.database.meta.lastSavedAt =
            new Date().toISOString();


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


        dispatchGameEvent(
            "mma-life-game-saved",
            {
                database:
                    mainState.database
            }
        );


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
   LOAD
   ============================================================ */

function loadGame() {

    try {

        const raw =
            localStorage.getItem(
                "mma-life-dynasty-save"
            );


        if (!raw) {

            return false;

        }


        const saved =
            JSON.parse(
                raw
            );


        mainState.database =
            ensureDatabaseStructure(
                saved
            );


        exposeDatabase();


        if (
            mainState.gameUI &&
            typeof mainState.gameUI.setDatabase ===
            "function"
        ) {

            mainState.gameUI.setDatabase(
                mainState.database
            );

        }


        mainState.started =
            Boolean(
                mainState.database.player?.id
            );


        mainState.careerStarted =
            mainState.started;


        dispatchGameEvent(

            "mma-life-game-loaded",

            {

                database:
                    mainState.database

            }

        );


        return true;

    }

    catch (error) {

        registerError(
            "loadGame",
            error
        );


        return false;

    }

}


/* ============================================================
   RESET
   ============================================================ */

function resetGame() {

    try {

        localStorage.removeItem(
            "mma-life-dynasty-save"
        );

    }

    catch (error) {

        registerError(
            "resetGame.storage",
            error
        );

    }


    mainState.database =
        createDatabase();


    mainState.started =
        false;


    mainState.careerStarted =
        false;


    exposeDatabase();


    return startNewGame();

}


/* ============================================================
   BOOT ERROR
   ============================================================ */

function showBootError(
    error
) {

    const bootError =
        document.getElementById(
            "boot-error"
        );


    const retry =
        document.getElementById(
            "boot-retry"
        );


    if (bootError) {

        bootError.textContent =

            error?.message ||

            String(error);


        bootError.classList.add(
            "visible"
        );

    }


    if (retry) {

        retry.classList.add(
            "visible"
        );


        retry.onclick =
            () => {

                location.reload();

            };

    }

}


/* ============================================================
   BOOT STATUS
   ============================================================ */

function setBootStatus(
    message
) {

    const element =
        document.getElementById(
            "boot-status"
        );


    if (element) {

        element.textContent =
            message;

    }

}


/* ============================================================
   EVENTOS DO START SCREEN
   ============================================================ */

function bindStartScreen() {

    const startScreen =
        document.getElementById(
            "start-screen"
        );


    if (!startScreen) {

        return;

    }


    /*
     * Delegação de eventos.
     *
     * Assim não dependemos de um
     * ID específico dos botões.
     */

    startScreen.addEventListener(

        "click",

        event => {

            const button =
                event.target.closest(
                    "button"
                );


            if (!button) {

                return;

            }


            if (
                button.disabled
            ) {

                return;

            }


            const action =
                String(
                    button.dataset.action ||
                    ""
                ).toLowerCase();


            if (

                action.includes(
                    "load"
                )

            ) {

                const loaded =
                    loadGame();


                if (loaded) {

                    hideBootScreens();


                    if (
                        mainState.database.player
                    ) {

                        mainState.started =
                            true;

                        mainState.careerStarted =
                            true;


                        navigate(
                            "dashboard"
                        );

                    }

                    else {

                        startNewGame();

                    }

                }

                else {

                    startNewGame();

                }


                return;

            }


            /*
             * Qualquer botão explicitamente
             * de novo jogo.
             */

            if (

                action.includes(
                    "new"
                ) ||

                action.includes(
                    "start"
                ) ||

                action.includes(
                    "career"
                )

            ) {

                startNewGame();

                return;

            }


            /*
             * Caso o HTML não tenha
             * data-action:
             * botão primary = novo jogo.
             */

            if (
                button.classList.contains(
                    "primary"
                )
            ) {

                startNewGame();

            }

        }

    );

}


/* ============================================================
   EVENTO DO CHARACTER CREATION
   ============================================================ */

function bindCharacterCreationEvents() {

    document.addEventListener(

        "mma-life-character-created",

        async event => {

            try {

                const character =
                    event.detail?.character ||
                    event.detail;


                if (!character) {

                    throw new Error(
                        "Evento de criação não trouxe o personagem."
                    );

                }


                /*
                 * NÃO cria outro sistema.
                 *
                 * Apenas entrega o personagem
                 * ao engine principal.
                 */

                await startCareer(
                    character
                );

            }

            catch (error) {

                registerError(
                    "character-created",
                    error
                );


                showBootError(
                    error
                );

            }

        }

    );


    /*
     * Alguns módulos utilizam este evento
     * como ponto de partida.
     */

    document.addEventListener(

        "mma-life-game-start-requested",

        async event => {

            try {

                const character =
                    event.detail?.character ||
                    null;


                if (
                    character &&
                    !mainState.careerStarted
                ) {

                    await startCareer(
                        character
                    );

                }

            }

            catch (error) {

                registerError(
                    "game-start-requested",
                    error
                );

            }

        }

    );

}


/* ============================================================
   EVENTOS GERAIS DA UI
   ============================================================ */

function bindGlobalUIEvents() {

    document.addEventListener(

        "mma-life-database-updated",

        () => {

            exposeDatabase();


            if (
                mainState.gameUI &&
                typeof mainState.gameUI.setDatabase ===
                "function"
            ) {

                mainState.gameUI.setDatabase(
                    mainState.database
                );

            }

        }

    );


    document.addEventListener(

        "mma-life-save-requested",

        () => {

            saveGame();

        }

    );

}


/* ============================================================
   INICIALIZAÇÃO DA UI
   ============================================================ */

async function initializeUI() {

    resolveAPIs();


    /*
     * Primeiro conectamos o database
     * ao gameUI.
     */

    if (
        mainState.gameUI
    ) {

        try {

            if (
                typeof mainState.gameUI.setDatabase ===
                "function"
            ) {

                mainState.gameUI.setDatabase(
                    mainState.database
                );

            }


            await initializeAPI(
                mainState.gameUI,
                mainState.database
            );

        }

        catch (error) {

            registerError(
                "gameUI",
                error
            );

        }

    }


    /*
     * Character Creation.
     */

    if (
        mainState.characterCreation
    ) {

        try {

            await initializeAPI(
                mainState.characterCreation,
                mainState.database
            );

        }

        catch (error) {

            registerError(
                "characterCreation",
                error
            );

        }

    }


    /*
     * Demais componentes visuais.
     */

    const uiModules = [

        "hudAPI",

        "mainMenuAPI",

        "layoutAPI",

        "screensAPI",

        "lifeUIAPI",

        "lifeDashboardAPI",

        "lifeScreenAPI",

        "lifeNavigationAPI",

        "lifeMenuAPI",

        "lifeRouterAPI"

    ];


    for (
        const name of uiModules
    ) {

        const api =
            getGlobalAPI([
                name
            ]);


        if (api) {

            await initializeAPI(
                api,
                mainState.database
            );

        }

    }


    /*
     * Bootstrap existente.
     *
     * Ele continua fazendo parte da
     * arquitetura, mas o main controla
     * o registro final das telas para
     * evitar o conflito de assinatura
     * entre screensAPI e gameUIAPI.
     */

    resolveAPIs();


    if (
        mainState.bootstrap
    ) {

        try {

            await initializeAPI(
                mainState.bootstrap,
                mainState.database
            );

        }

        catch (error) {

            registerError(
                "bootstrap",
                error
            );

        }

    }


    /*
     * Depois do bootstrap:
     * registramos diretamente no gameUI
     * as telas existentes.
     */

    resolveAPIs();

    registerAllScreens();


    /*
     * Atualiza novamente o database.
     */

    if (
        mainState.gameUI &&
        typeof mainState.gameUI.setDatabase ===
        "function"
    ) {

        mainState.gameUI.setDatabase(
            mainState.database
        );

    }


    return true;

}


/* ============================================================
   INICIALIZAÇÃO PRINCIPAL
   ============================================================ */

async function initialize() {

    if (
        mainState.initialized
    ) {

        return {

            success:
                true,

            database:
                mainState.database

        };

    }


    try {

        setBootStatus(
            "Criando universo..."
        );


        mainState.database =
            createDatabase();


        exposeDatabase();


        /*
         * ENGINE
         */

        setBootStatus(
            "Carregando sistemas do jogo..."
        );


        await loadEngineModules();


        /*
         * UI
         */

        setBootStatus(
            "Conectando interface..."
        );


        await loadUIModules();


        /*
         * APIs
         */

        resolveAPIs();


        /*
         * UI completa
         */

        setBootStatus(
            "Conectando carreira, treino e vida..."
        );


        await initializeUI();


        /*
         * Eventos
         */

        bindStartScreen();

        bindCharacterCreationEvents();

        bindGlobalUIEvents();


        /*
         * Estado final.
         */

        mainState.initialized =
            true;


        mainState.status =
            "ready";


        dispatchGameEvent(

            "mma-life-initialized",

            {

                database:
                    mainState.database,

                main:
                    mainState

            }

        );


        setBootStatus(
            "Universo pronto."
        );


        /*
         * Não força criação imediatamente.
         *
         * Primeiro mostra o Start Screen.
         */

        showStartScreen();


        console.log(
            "[MMA LIFE DYNASTY] Universo pronto."
        );


        console.log(
            "Módulos carregados:",
            mainState.loadedModules.length
        );


        if (
            mainState.failedModules.length
        ) {

            console.warn(
                "Módulos com erro:",
                mainState.failedModules
            );

        }


        return {

            success:
                true,

            database:
                mainState.database

        };

    }

    catch (error) {

        mainState.status =
            "error";


        registerError(
            "initialize",
            error
        );


        showBootError(
            error
        );


        return {

            success:
                false,

            error

        };

    }

}


/* ============================================================
   API PRINCIPAL DO JOGO
   ============================================================ */

const MMA_LIFE_GAME = {

    version:
        MAIN_VERSION,


    state:
        mainState,


    initialize,


    startNewGame,


    startCareer,


    navigate,


    saveGame,


    loadGame,


    resetGame,


    getDatabase() {

        return mainState.database;

    },


    getState() {

        return mainState;

    },


    getPlayer() {

        return mainState.database?.player ||
            null;

    },


    getGameUI() {

        return mainState.gameUI;

    },


    getCharacterCreation() {

        return mainState.characterCreation;

    },


    showCharacterCreation,


    applyCharacterToGame,


    calculateOverall,


    getDiagnostics() {

        return {

            version:
                MAIN_VERSION,

            status:
                mainState.status,

            initialized:
                mainState.initialized,

            started:
                mainState.started,

            careerStarted:
                mainState.careerStarted,

            loadedModules:
                [...mainState.loadedModules],

            failedModules:
                [...mainState.failedModules],

            errors:
                [...mainState.errors]

        };

    }

};


/* ============================================================
   EXPOSIÇÃO GLOBAL
   ============================================================ */

if (
    typeof globalThis !==
    "undefined"
) {

    globalThis.MMA_LIFE_GAME =
        MMA_LIFE_GAME;

    globalThis.MMA_LIFE_MAIN =
        MMA_LIFE_GAME;

    globalThis.MMA_LIFE_MAIN_STATE =
        mainState;

}


/* ============================================================
   BOOT AUTOMÁTICO
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

            () => {

                initialize();

            },

            {
                once:
                    true

            }

        );

    }

    else {

        initialize();

    }

}


/* ============================================================
   FIM DO MAIN.JS
   ============================================================ */
