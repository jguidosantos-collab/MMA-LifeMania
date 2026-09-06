/* ============================================================
   MMA LIFE DYNASTY
   MAIN.JS — INTEGRAÇÃO PRINCIPAL
   ============================================================ */
const MAIN_VERSION = "INTEGRATION-3.0.0";
const mainState = {
    version: MAIN_VERSION,
    initialized: false,
    started: false,
    careerStarted: false,
    database: null,
    ui: null,
    gameUI: null,
    characterCreation: null,
    loadedModules: [],
    failedModules: [],
    errors: [],
    lastSave: null
};
/* ============================================================
   UTILIDADES
   ============================================================ */
function clone(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return value;
    }
    try {
        return structuredClone(value);
    }
    catch (error) {
        try {
            return JSON.parse(
                JSON.stringify(value)
            );
        }
        catch (fallbackError) {
            return value;
        }
    }
}
function registerError(
    source,
    error
) {
    const entry = {
        source,
        message:
            error?.message ||
            String(error),
        time:
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
    return entry;
}
function getGlobalAPI(
    names = []
) {
    for (
        const name of names
    ) {
        if (
            globalThis[name]
        ) {
            return globalThis[name];
        }
    }
    return null;
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
/* ============================================================
   DATABASE
   ============================================================ */
function createDatabase() {
    return {
        meta: {
            version:
                MAIN_VERSION,
            createdAt:
                new Date().toISOString(),
            lastUpdated:
                new Date().toISOString()
        },
        /*
         * IMPORTANTE:
         * player começa NULL.
         *
         * Assim o sistema sabe que ainda
         * estamos na criação do personagem.
         */
        player: null,
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
            record: {
                wins:
                    0,
                losses:
                    0,
                draws:
                    0,
                noContests:
                    0
            }
        },
        training: {
            energy:
                100,
            maxEnergy:
                100,
            fatigue:
                0,
            week:
                1,
            sessions:
                [],
            schedule:
                []
        },
        health: {
            overall:
                100,
            recovery:
                100,
            injuries:
                []
        },
        fights: {
            current:
                null,
            next:
                null,
            history:
                [],
            offers:
                []
        },
        fighters: [],
        promotions: [],
        rankings: [],
        contracts: [],
        life: {
            relationships:
                [],
            partner:
                null,
            children:
                [],
            marriage:
                null
        },
        family: {
            members:
                [],
            children:
                [],
            inheritance:
                null
        },
        dynasty: {
            active:
                false,
            generation:
                1,
            successor:
                null
        },
        business: {
            money:
                0,
            income:
                0,
            expenses:
                0,
            assets:
                []
        },
        media: {
            fame:
                0,
            followers:
                0,
            news:
                []
        },
        world: {
            country:
                "Brazil",
            city:
                "São Paulo",
            year:
                1,
            week:
                1
        },
        history: [],
        notifications: [],
        settings: {
            language:
                "pt-BR"
        }
    };
}
/* ============================================================
   NORMALIZAÇÃO DO DATABASE
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
    result.meta = {
        ...base.meta,
        ...(database.meta || {})
    };
    result.career = {
        ...base.career,
        ...(database.career || {})
    };
    result.career.record = {
        ...base.career.record,
        ...(database.career?.record || {})
    };
    result.training = {
        ...base.training,
        ...(database.training || {})
    };
    result.health = {
        ...base.health,
        ...(database.health || {})
    };
    result.fights = {
        ...base.fights,
        ...(database.fights || {})
    };
    result.life = {
        ...base.life,
        ...(database.life || {})
    };
    result.family = {
        ...base.family,
        ...(database.family || {})
    };
    result.dynasty = {
        ...base.dynasty,
        ...(database.dynasty || {})
    };
    result.business = {
        ...base.business,
        ...(database.business || {})
    };
    result.media = {
        ...base.media,
        ...(database.media || {})
    };
    result.world = {
        ...base.world,
        ...(database.world || {})
    };
    result.settings = {
        ...base.settings,
        ...(database.settings || {})
    };
    if (
        !Array.isArray(
            result.history
        )
    ) {
        result.history = [];
    }
    if (
        !Array.isArray(
            result.notifications
        )
    ) {
        result.notifications = [];
    }
    if (
        !Array.isArray(
            result.fighters
        )
    ) {
        result.fighters = [];
    }
    if (
        !Array.isArray(
            result.promotions
        )
    ) {
        result.promotions = [];
    }
    if (
        !Array.isArray(
            result.rankings
        )
    ) {
        result.rankings = [];
    }
    if (
        !Array.isArray(
            result.contracts
        )
    ) {
        result.contracts = [];
    }
    return result;
}
/* ============================================================
   EXPOR DATABASE GLOBALMENTE
   ============================================================ */
function exposeDatabase() {
    if (
        !mainState.database
    ) {
        return;
    }
    /*
     * Mantém vários nomes porque
     * os módulos antigos podem procurar
     * por nomes diferentes.
     */
    globalThis.MMA_LIFE_DATABASE =
        mainState.database;
    globalThis.mmaLifeDatabase =
        mainState.database;
    globalThis.gameDatabase =
        mainState.database;
    globalThis.database =
        mainState.database;
    globalThis.MMA_LIFE_STATE =
        mainState.database;
    globalThis.mmaLifeState =
        mainState.database;
    /*
     * Algumas partes do jogo usam
     * "db".
     */
    globalThis.db =
        mainState.database;
}
/* ============================================================
   CARREGAMENTO DE MÓDULOS
   ============================================================ */
async function loadModule(
    path
) {
    try {
        await import(
            path
        );
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
            "[MMA LIFE DYNASTY] Módulo carregado:",
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
    "./life/life.js",
    "./life/family.js",
    "./business/business.js",
    "./media/media.js",
    "./world/world.js"
];
/* ============================================================
   MÓDULOS DA UI
   ============================================================ */
const UI_MODULES = [
    "./ui/gameUI.js",
    "./ui/characterCreation.js",
    "./ui/index.js",
    "./ui/bootstrap.js"
];
/* ============================================================
   CARREGAR ENGINE
   ============================================================ */
async function loadEngineModules() {
    for (
        const modulePath
        of ENGINE_MODULES
    ) {
        await loadModule(
            modulePath
        );
    }
}
/* ============================================================
   CARREGAR UI
   ============================================================ */
async function loadUIModules() {
    for (
        const modulePath
        of UI_MODULES
    ) {
        await loadModule(
            modulePath
        );
    }
}
/* ============================================================
   LOCALIZAR UI
   ============================================================ */
function resolveUIAPIs() {
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
    mainState.ui =
        getGlobalAPI([
            "uiAPI",
            "MMA_LIFE_UI"
        ]);
}
/* ============================================================
   PREPARAR UI
   ============================================================ */
async function initializeUI() {
    resolveUIAPIs();
    /*
     * Primeiro tentamos o bootstrap,
     * pois ele é o orquestrador da UI.
     */
    const bootstrapAPI =
        getGlobalAPI([
            "bootstrapAPI",
            "MMA_LIFE_UI_BOOTSTRAP"
        ]);
    if (
        bootstrapAPI
    ) {
        try {
            if (
                typeof bootstrapAPI.initialize ===
                "function"
            ) {
                await bootstrapAPI.initialize(
                    mainState.database
                );
                resolveUIAPIs();
                return true;
            }
            if (
                typeof bootstrapAPI.init ===
                "function"
            ) {
                await bootstrapAPI.init(
                    mainState.database
                );
                resolveUIAPIs();
                return true;
            }
        }
        catch (error) {
            registerError(
                "bootstrap.initialize",
                error
            );
        }
    }
    /*
     * Caso o bootstrap não tenha
     * inicializado, usamos uiAPI.
     */
    resolveUIAPIs();
    if (
        mainState.ui
    ) {
        try {
            if (
                typeof mainState.ui.initialize ===
                "function"
            ) {
                await mainState.ui.initialize(
                    mainState.database,
                    {
                        startAtCharacterCreation:
                            !mainState.database.player
                    }
                );
                return true;
            }
        }
        catch (error) {
            registerError(
                "ui.initialize",
                error
            );
        }
    }
    /*
     * Último fallback:
     * gameUI diretamente.
     */
    if (
        mainState.gameUI
    ) {
        try {
            if (
                typeof mainState.gameUI.initialize ===
                "function"
            ) {
                await mainState.gameUI.initialize(
                    mainState.database,
                    {
                        render:
                            true
                    }
                );
                return true;
            }
        }
        catch (error) {
            registerError(
                "gameUI.initialize",
                error
            );
        }
    }
    return false;
}
/* ============================================================
   INICIALIZAÇÃO
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
    console.log(
        "[MMA LIFE DYNASTY] Inicializando..."
    );
    mainState.database =
        ensureDatabaseStructure(
            mainState.database
        );
    exposeDatabase();
    /*
     * Engine primeiro.
     */
    await loadEngineModules();
    /*
     * UI depois.
     */
    await loadUIModules();
    /*
     * Localiza as APIs.
     */
    resolveUIAPIs();
    /*
     * Inicializa a UI somente agora.
     */
    await initializeUI();
    /*
     * Conecta o database novamente
     * após a inicialização.
     */
    exposeDatabase();
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
    console.log(
        "[MMA LIFE DYNASTY] Inicialização concluída."
    );
    return {
        success:
            true,
        database:
            mainState.database
    };
}
/* ============================================================
   CÁLCULO DE OVR
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
   CATEGORIA DE PESO
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
   APLICAR PERSONAGEM
   ============================================================ */
function applyCharacterToGame(
    character
) {
    if (
        !character ||
        typeof character !==
        "object"
    ) {
        throw new Error(
            "Personagem inválido."
        );
    }
    const db =
        mainState.database;
    if (
        !db
    ) {
        throw new Error(
            "Database não inicializado."
        );
    }
    const player = {};
    /*
     * IDENTIDADE
     */
    player.id =
        character.id ||
        `player-${Date.now()}`;
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
     * DADOS PESSOAIS
     */
    player.gender =
        character.gender ||
        "male";
    player.age =
        Number(
            character.age
        ) || 16;
    player.country =
        character.country ||
        "Brazil";
    player.city =
        character.city ||
        "São Paulo";
    /*
     * FÍSICO
     */
    player.height =
        Number(
            character.height
        ) || 1.75;
    player.weight =
        Number(
            character.weight
        ) || 70;
    player.weightClass =
        normalizeWeightClass(
            character.weightClass
        );
    /*
     * ESTILO
     */
    player.fightingStyle =
        character.fightingStyle ||
        character.style ||
        "MMA";
    player.stance =
        character.stance ||
        "Ortodoxo";
    /*
     * PERSONALIDADE
     */
    player.personality =
        character.personality ||
        "disciplinado";
    /*
     * ATRIBUTOS
     */
    player.attributes = {
        ...(character.attributes || {})
    };
    if (
        Object.keys(
            player.attributes
        ).length === 0
    ) {
        player.attributes = {
            striking:
                50,
            grappling:
                50,
            wrestling:
                50,
            cardio:
                50,
            strength:
                50,
            speed:
                50,
            defense:
                50,
            technique:
                50
        };
    }
    /*
     * OVR
     */
    player.overall =
        Number(
            character.overall
        ) ||
        calculateOverall(
            player.attributes
        );
    /*
     * POTENCIAL
     */
    const potentialValue =
        Number(
            character.potential
        );
    if (
        Number.isFinite(
            potentialValue
        )
    ) {
        player.potential = {
            overall:
                player.overall,
            ceiling:
                potentialValue
        };
    }
    else if (
        character.potential &&
        typeof character.potential ===
        "object"
    ) {
        player.potential =
            clone(
                character.potential
            );
    }
    else {
        player.potential = {
            overall:
                player.overall,
            ceiling:
                Math.min(
                    99,
                    player.overall + 30
                )
        };
    }
    /*
     * GENÉTICA
     */
    player.genetics =
        character.genetics &&
        typeof character.genetics ===
        "object"
            ? clone(
                character.genetics
            )
            : {};
    /*
     * CARREIRA
     *
     * Menor de 18:
     * AMADOR.
     *
     * 18+:
     * PROFISSIONAL REGIONAL.
     */
    if (
        player.age >= 18
    ) {
        player.careerStage =
            "regional";
        player.amateur =
            false;
        player.professional = {
            active:
                true,
            debutAge:
                player.age,
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
        db.career.stage =
            "regional";
    }
    else {
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
        db.career.stage =
            "amateur";
    }
    /*
     * ESTADO
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
    player.money =
        0;
    /*
     * DATABASE
     */
    db.player =
        player;
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
    db.health.overall =
        100;
    db.health.recovery =
        100;
    db.training.energy =
        100;
    db.training.fatigue =
        0;
    db.business.money =
        0;
    db.business.income =
        0;
    db.business.expenses =
        0;
    db.media.fame =
        0;
    db.media.followers =
        0;
    db.world.country =
        player.country;
    db.world.city =
        player.city;
    db.meta.lastUpdated =
        new Date().toISOString();
    db.history.push({
        type:
            "character-created",
        date:
            new Date().toISOString(),
        description:
            "Novo lutador criado."
    });
    db.notifications.push({
        type:
            "system",
        message:
            "Sua carreira começou.",
        date:
            new Date().toISOString(),
        read:
            false
    });
    exposeDatabase();
    dispatchGameEvent(
        "mma-life-player-updated",
        {
            player,
            database:
                db
        }
    );
    return player;
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
        localStorage.setItem(
            "mma-life-dynasty-save",
            JSON.stringify(
                mainState.database
            )
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
   CARREGAR
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
        dispatchGameEvent(
            "mma-life-game-loaded",
            {
                database:
                    mainState.database
            }
        );
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
   ATUALIZAR UI COM DATABASE
   ============================================================ */
function connectDatabaseToUI() {
    resolveUIAPIs();
    if (
        mainState.ui
    ) {
        try {
            if (
                typeof mainState.ui.setDatabase ===
                "function"
            ) {
                mainState.ui.setDatabase(
                    mainState.database
                );
            }
        }
        catch (error) {
            registerError(
                "ui.setDatabase",
                error
            );
        }
    }
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
}
/* ============================================================
   DASHBOARD
   ============================================================ */
async function showDashboard() {
    connectDatabaseToUI();
    resolveUIAPIs();
    /*
     * ui/index.js
     */
    if (
        mainState.ui
    ) {
        try {
            if (
                typeof mainState.ui.openScreen ===
                "function"
            ) {
                return await mainState.ui.openScreen(
                    "dashboard"
                );
            }
            if (
                typeof mainState.ui.navigate ===
                "function"
            ) {
                return await mainState.ui.navigate(
                    "dashboard"
                );
            }
            if (
                typeof mainState.ui.openDashboard ===
                "function"
            ) {
                return await mainState.ui.openDashboard();
            }
        }
        catch (error) {
            registerError(
                "showDashboard.ui",
                error
            );
        }
    }
    /*
     * gameUI.js
     */
    if (
        mainState.gameUI
    ) {
        try {
            if (
                typeof mainState.gameUI.setActiveScreen ===
                "function"
            ) {
                return await mainState.gameUI.setActiveScreen(
                    "dashboard"
                );
            }
        }
        catch (error) {
            registerError(
                "showDashboard.gameUI",
                error
            );
        }
    }
    return false;
}
/* ============================================================
   START CAREER
   ============================================================ */
async function startCareer(
    character
) {
    /*
     * Evita duplo início.
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
                mainState.database?.player,
            database:
                mainState.database
        };
    }
    try {
        /*
         * Garante inicialização.
         */
        if (
            !mainState.initialized
        ) {
            await initialize();
        }
        /*
         * Aplica personagem.
         */
        const player =
            applyCharacterToGame(
                character
            );
        /*
         * Estado principal.
         */
        mainState.started =
            true;
        mainState.careerStarted =
            true;
        mainState.status =
            "started";
        exposeDatabase();
        /*
         * Atualiza player.js
         * se ele possuir API.
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
         * Conecta o database à UI.
         */
        connectDatabaseToUI();
        /*
         * Eventos.
         */
        dispatchGameEvent(
            "mma-life-career-started",
            {
                player,
                database:
                    mainState.database,
                state:
                    mainState.database
            }
        );
        dispatchGameEvent(
            "mma-life-player-updated",
            {
                player,
                database:
                    mainState.database
            }
        );
        /*
         * Salva.
         */
        saveGame();
        /*
         * Dashboard.
         */
        await showDashboard();
        /*
         * Eventos finais.
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
        console.log(
            "[MMA LIFE DYNASTY] CARREIRA INICIADA",
            mainState.database.player
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
async function startNewGame(
    character
) {
    return startCareer(
        character
    );
}
/* ============================================================
   EVENTO DA CRIAÇÃO DO PERSONAGEM
   ============================================================ */
function bindCharacterCreatedEvent() {
    if (
        typeof document ===
        "undefined"
    ) {
        return;
    }
    /*
     * Evita registrar o listener duas vezes.
     */
    if (
        mainState.characterCreatedListener
    ) {
        return;
    }
    mainState.characterCreatedListener =
        true;
    document.addEventListener(
        "mma-life-character-created",
        async event => {
            try {
                const character =
                    event?.detail?.character;
                if (
                    !character
                ) {
                    throw new Error(
                        "Evento de personagem criado sem personagem."
                    );
                }
                /*
                 * IMPORTANTE:
                 *
                 * characterCreation.js dispara
                 * este evento ANTES de chamar
                 * startGameAfterCharacterCreation().
                 *
                 * Portanto o main.js assume
                 * o controle aqui.
                 */
                const result =
                    await startCareer(
                        character
                    );
                if (
                    !result.success
                ) {
                    console.error(
                        "[MMA LIFE DYNASTY] Falha ao iniciar:",
                        result.error
                    );
                    return;
                }
                hideStartScreens();
            }
            catch (error) {
                registerError(
                    "mma-life-character-created",
                    error
                );
            }
        }
    );
}
/* ============================================================
   ESCONDER TELAS DE BOOT
   ============================================================ */
function hideStartScreens() {
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
                .querySelectorAll(
                    selector
                )
                .forEach(
                    element => {
                        element.style.display =
                            "none";
                        element.style.pointerEvents =
                            "none";
                        element.setAttribute(
                            "aria-hidden",
                            "true"
                        );
                    }
                );
        }
    );
}
/* ============================================================
   EXPOSIÇÃO GLOBAL
   ============================================================ */
function exposeMainAPI() {
    const api = {
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
        saveGame,
        loadGame,
        getDatabase() {
            return mainState.database;
        },
        setDatabase(
            database
        ) {
            mainState.database =
                ensureDatabaseStructure(
                    database
                );
            exposeDatabase();
            connectDatabaseToUI();
            return mainState.database;
        },
        getState() {
            return mainState;
        },
        getErrors() {
            return [
                ...mainState.errors
            ];
        },
        getLoadedModules() {
            return [
                ...mainState.loadedModules
            ];
        },
        getFailedModules() {
            return [
                ...mainState.failedModules
            ];
        }
    };
    globalThis.mainAPI =
        api;
    globalThis.MMA_LIFE_MAIN =
        api;
    globalThis.MMA_LIFE_DYNASTY =
        api;
    globalThis.mmaLifeMain =
        api;
    return api;
}
/* ============================================================
   BOOT
   ============================================================ */
async function boot() {
    exposeMainAPI();
    bindCharacterCreatedEvent();
    /*
     * Tenta carregar save apenas se
     * existir.
     *
     * Se não existir, player continua NULL
     * e a criação de personagem aparece.
     */
    const saved =
        loadGame();
    if (
        saved &&
        saved.player
    ) {
        mainState.database =
            saved;
        mainState.started =
            true;
        mainState.careerStarted =
            true;
    }
    else {
        mainState.database =
            createDatabase();
    }
    exposeDatabase();
    await initialize();
    /*
     * Se já existe personagem salvo,
     * abre Dashboard.
     *
     * Se não existe, deixa a UI
     * mostrar a criação.
     */
    if (
        mainState.database.player
    ) {
        await showDashboard();
        hideStartScreens();
    }
    return mainState;
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
            () => {
                boot()
                    .catch(
                        error => {
                            registerError(
                                "boot",
                                error
                            );
                        }
                    );
            },
            {
                once:
                    true
            }
        );
    }
    else {
        boot()
            .catch(
                error => {
                    registerError(
                        "boot",
                        error
                    );
                }
            );
    }
}
else {
    boot()
        .catch(
            error => {
                registerError(
                    "boot",
                    error
                );
            }
        );
}
/* ============================================================
   EXPORT
   ============================================================ */
export {
    mainState,
    initialize,
    boot,
    startCareer,
    startNewGame,
    applyCharacterToGame,
    createDatabase,
    ensureDatabaseStructure,
    exposeDatabase,
    saveGame,
    loadGame,
    showDashboard
};
