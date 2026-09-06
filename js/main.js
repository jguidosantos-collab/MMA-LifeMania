/* ============================================================
   MMA LIFE DYNASTY
   MAIN BOOT ENGINE
   SAFE BOOT ARCHITECTURE
   ============================================================ */

"use strict";

const MAIN_VERSION = "SAFE-BOOT-1.0.0";

/* ============================================================
   ESTADO PRINCIPAL
   ============================================================ */

const mainState = {
    version: MAIN_VERSION,

    status: "booting",

    initialized: false,

    started: false,

    database: null,

    characterCreation: null,

    loadedModules: [],

    failedModules: [],

    errors: [],

    bootTime: Date.now()
};


/* ============================================================
   DATABASE BASE
   ============================================================ */

function createDatabase() {

    return {

        meta: {
            game: "MMA Life Dynasty",
            version: "1.0.0",
            engine: "MMA Life Dynasty Engine"
        },


        player: {
            id: null,

            name: "",
            firstName: "",
            lastName: "",

            age: 16,

            country: "Brasil",
            nationality: "Brasil",

            gender: null,

            city: null,

            nickname: "",

            weightClass: null,

            fightingStyle: null,

            careerStage: "amateur",

            professional: {
                active: false,
                debutAge: null,
                fights: 0,
                wins: 0,
                losses: 0,
                draws: 0
            },

            attributes: {},

            physical: {},

            mental: {},

            skills: {},

            potential: 0,

            overall: 0,

            confidence: 50,

            morale: 50,

            experience: 0,

            fame: 0,

            followers: 0,

            health: 100,

            energy: 100,

            fatigue: 0,

            money: 0
        },


        career: {

            stage: "amateur",

            promotion: null,

            manager: null,

            contract: null,

            ranking: null,

            reputation: 0,

            record: {
                wins: 0,
                losses: 0,
                draws: 0,
                noContests: 0
            },

            history: []
        },


        training: {

            energy: 100,

            fatigue: 0,

            weeklySchedule: [],

            currentCamp: null,

            sessions: [],

            improvements: []
        },


        health: {

            overall: 100,

            injuries: [],

            recovery: 100,

            medical: [],

            suspensions: []
        },


        fights: {

            nextFight: null,

            currentFight: null,

            history: [],

            offers: []
        },


        promotions: {

            current: null,

            available: [],

            offers: [],

            history: []
        },


        business: {

            money: 0,

            income: 0,

            expenses: 0,

            assets: [],

            investments: [],

            sponsors: []
        },


        media: {

            fame: 0,

            followers: 0,

            popularity: 0,

            news: [],

            social: []
        },


        world: {

            country: "Brasil",

            city: null,

            organizations: [],

            fighters: [],

            events: [],

            rankings: []
        },


        life: {

            relationship: null,

            spouse: null,

            children: [],

            family: [],

            lifestyle: "normal"
        },


        dynasty: {

            active: false,

            generation: 1,

            heir: null,

            familyHistory: [],

            legacy: 0
        },


        calendar: {

            year: 2026,

            month: 1,

            week: 1,

            day: 1
        },


        history: [],

        notifications: [],


        settings: {

            difficulty: "normal",

            language: "pt-BR",

            autosave: true
        }

    };

}


/* ============================================================
   SISTEMAS OPCIONAIS
   ============================================================

   IMPORTANTE:

   Nenhum desses módulos pode impedir o jogo de abrir.

   Cada módulo será carregado individualmente.
   ============================================================ */

const OPTIONAL_MODULES = [

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
    "./life/dynasty.js",

    "./ui/ui.js"
];


/* ============================================================
   REGISTRAR ERRO
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

}


/* ============================================================
   CARREGAR MÓDULO COM SEGURANÇA
   ============================================================ */

async function loadModuleSafe(
    path
) {

    try {

        const module =
            await import(path);


        mainState.loadedModules.push(
            path
        );


        console.log(
            "[MMA LIFE DYNASTY] Sistema carregado:",
            path
        );


        return {

            success: true,

            path,

            module

        };

    }

    catch (error) {

        mainState.failedModules.push(
            path
        );


        registerError(
            path,
            error
        );


        return {

            success: false,

            path,

            error

        };

    }

}


/* ============================================================
   CARREGAR SISTEMAS SECUNDÁRIOS
   ============================================================ */

async function loadOptionalSystems() {

    console.log(
        "[MMA LIFE DYNASTY] " +
        "Carregando sistemas secundários..."
    );


    const results =
        await Promise.all(
            OPTIONAL_MODULES.map(
                loadModuleSafe
            )
        );


    console.log(
        "[MMA LIFE DYNASTY] " +
        "Sistemas secundários processados."
    );


    console.log(
        "[MMA LIFE DYNASTY] Sistemas carregados:",
        mainState.loadedModules.length
    );


    console.log(
        "[MMA LIFE DYNASTY] Sistemas com erro:",
        mainState.failedModules.length
    );


    return results;

}


/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

async function initialize() {

    /*
     * Evita inicialização duplicada.
     */

    if (
        mainState.initialized
    ) {

        return mainState;

    }


    console.log(
        "[MMA LIFE DYNASTY] " +
        "Inicializando engine..."
    );


    /*
     * Cria banco de dados mínimo.
     */

    if (
        !mainState.database
    ) {

        mainState.database =
            createDatabase();

    }


    /*
     * Tenta carregar criação
     * de personagem.

     * IMPORTANTE:
     * esse módulo também não pode
     * impedir o boot.
     */

    try {

        const characterCreation =
            await import(
                "./ui/characterCreation.js"
            );


        mainState.characterCreation =
            characterCreation;


        /*
         * Se existir initialize,
         * executa.
         */

        if (
            typeof characterCreation.initializeCharacterCreation ===
            "function"
        ) {

            try {

                await characterCreation.initializeCharacterCreation();

            }

            catch (error) {

                registerError(
                    "characterCreation.initialize",
                    error
                );

            }

        }


        /*
         * A API também pode estar
         * disponível globalmente.
         */

        if (
            characterCreation.characterCreationAPI
        ) {

            window.characterCreationAPI =
                characterCreation.characterCreationAPI;

        }


        console.log(
            "[MMA LIFE DYNASTY] " +
            "Character Creation carregado."
        );


    }

    catch (error) {

        registerError(
            "ui/characterCreation.js",
            error
        );

    }


    mainState.initialized =
        true;


    mainState.status =
        "initialized";


    return mainState;

}


/* ============================================================
   START
   ============================================================ */

async function start() {

    /*
     * Primeiro garante inicialização.
     */

    await initialize();


    /*
     * Não bloqueamos o jogo esperando
     * todos os módulos secundários.
     */

    mainState.started =
        true;

    mainState.status =
        "running";


    console.log(
        "[MMA LIFE DYNASTY] " +
        "Jogo iniciado."
    );


    /*
     * Carregamento secundário acontece
     * em segundo plano.
     */

    if (
        !mainState.optionalSystemsStarted
    ) {

        mainState.optionalSystemsStarted =
            true;


        loadOptionalSystems()
            .then(
                () => {

                    console.log(
                        "[MMA LIFE DYNASTY] " +
                        "Todos os sistemas secundários foram processados."
                    );

                }
            )
            .catch(
                error => {

                    registerError(
                        "optionalSystems",
                        error
                    );

                }
            );

    }


    return mainState;

}


/* ============================================================
   NOVO JOGO
   ============================================================ */

async function newGame() {

    /*
     * Garante que a engine existe.
     */

    await initialize();


    /*
     * Reset completo do banco.
     */

    mainState.database =
        createDatabase();


    /*
     * Cria identificador.
     */

    mainState.database.player.id =
        "player-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 9);


    /*
     * Garante carreira amadora.
     */

    mainState.database.player.careerStage =
        "amateur";


    mainState.database.career.stage =
        "amateur";


    /*
     * O jogador ainda não é
     * profissional.
     */

    mainState.database.player.professional.active =
        false;


    /*
     * Inicia o jogo.
     */

    await start();


    return mainState.database;

}


/* ============================================================
   GET GAME STATE
   ============================================================ */

function getGameState() {

    return mainState.database;

}


/* ============================================================
   SET GAME STATE
   ============================================================ */

function setGameState(
    state
) {

    if (
        !state ||
        typeof state !== "object"
    ) {

        throw new Error(
            "Estado inválido."
        );

    }


    mainState.database =
        state;


    return mainState.database;

}


/* ============================================================
   DIAGNÓSTICO
   ============================================================ */

function getDiagnostics() {

    return {

        version:
            mainState.version,

        status:
            mainState.status,

        initialized:
            mainState.initialized,

        started:
            mainState.started,

        loadedModules:
            [
                ...mainState.loadedModules
            ],

        failedModules:
            [
                ...mainState.failedModules
            ],

        errors:
            [
                ...mainState.errors
            ],

        bootTime:
            mainState.bootTime,

        uptime:
            Date.now() -
            mainState.bootTime

    };

}


/* ============================================================
   SAVE
   ============================================================ */

async function load() {

    /*
     * O sistema de save real pode
     * substituir isso posteriormente.
     */

    try {

        const raw =
            localStorage.getItem(
                "mma-life-dynasty-save"
            );


        if (!raw) {

            return {

                success: false,

                error:
                    "Nenhum jogo salvo encontrado."

            };

        }


        const parsed =
            JSON.parse(raw);


        setGameState(
            parsed
        );


        return {

            success: true,

            state:
                mainState.database

        };

    }

    catch (error) {

        registerError(
            "save.load",
            error
        );


        return {

            success: false,

            error:
                error.message ||
                String(error)

        };

    }

}


/* ============================================================
   SAVE GAME
   ============================================================ */

async function save() {

    try {

        localStorage.setItem(
            "mma-life-dynasty-save",
            JSON.stringify(
                mainState.database
            )
        );


        return {

            success: true

        };

    }

    catch (error) {

        registerError(
            "save.save",
            error
        );


        return {

            success: false,

            error:
                error.message ||
                String(error)

        };

    }

}


/* ============================================================
   HAS SAVE
   ============================================================ */

function hasSave() {

    try {

        return Boolean(
            localStorage.getItem(
                "mma-life-dynasty-save"
            )
        );

    }

    catch {

        return false;

    }

}


/* ============================================================
   RESET
   ============================================================ */

function resetGame() {

    mainState.database =
        createDatabase();

    mainState.started =
        false;

    mainState.status =
        "initialized";


    return mainState.database;

}


/* ============================================================
   API PRINCIPAL
   ============================================================ */

const MMA_LIFE_GAME = {

    version:
        MAIN_VERSION,

    state:
        mainState,

    initialize,

    start,

    newGame,

    getGameState,

    setGameState,

    getDiagnostics,

    load,

    save,

    hasSave,

    resetGame

};


/* ============================================================
   EXPOR GLOBALMENTE
   ============================================================ */

window.MMA_LIFE_GAME =
    MMA_LIFE_GAME;

window.MMA_LIFE_MAIN =
    MMA_LIFE_GAME;

window.mmaLifeGame =
    MMA_LIFE_GAME;


/*
 * Compatibilidade.
 */

window.getGameState =
    getGameState;

window.saveGame =
    save;

window.loadGame =
    load;


/* ============================================================
   BOOT
   ============================================================ */

async function boot() {

    console.log(
        "================================================"
    );

    console.log(
        " MMA LIFE DYNASTY"
    );

    console.log(
        " SAFE BOOT " +
        MAIN_VERSION
    );

    console.log(
        "================================================"
    );


    try {

        /*
         * Inicialização mínima.
         *
         * Essa parte NÃO depende dos
         * sistemas secundários.
         */

        await initialize();


        /*
         * IMPORTANTE:
         *
         * O evento é disparado aqui,
         * imediatamente após a engine
         * mínima estar pronta.
         */

        window.dispatchEvent(
            new CustomEvent(
                "mma-life-game-ready",
                {
                    detail: {

                        game:
                            MMA_LIFE_GAME,

                        diagnostics:
                            getDiagnostics()

                    }

                }
            )
        );


        console.log(
            "[MMA LIFE DYNASTY] " +
            "GAME READY."
        );


        /*
         * Sistemas secundários começam
         * depois que o menu já pode aparecer.
         */

        setTimeout(
            () => {

                loadOptionalSystems()
                    .catch(
                        error => {

                            registerError(
                                "boot.optionalSystems",
                                error
                            );

                        }
                    );

            },
            100
        );


    }

    catch (error) {

        /*
         * Mesmo se alguma coisa inesperada
         * acontecer no boot, NÃO deixamos
         * a página sem resposta.
         */

        registerError(
            "BOOT",
            error
        );


        /*
         * Garantimos banco mínimo.
         */

        if (
            !mainState.database
        ) {

            mainState.database =
                createDatabase();

        }


        mainState.initialized =
            true;

        mainState.status =
            "degraded";


        /*
         * O menu inicial ainda recebe
         * o evento.
         */

        window.dispatchEvent(
            new CustomEvent(
                "mma-life-game-ready",
                {
                    detail: {

                        game:
                            MMA_LIFE_GAME,

                        diagnostics:
                            getDiagnostics(),

                        degraded:
                            true

                    }

                }
            )
        );


        console.error(
            "[MMA LIFE DYNASTY] " +
            "BOOT EM MODO DEGRADADO."
        );

    }

}


/* ============================================================
   EXECUTAR BOOT
   ============================================================ */

boot();


/* ============================================================
   EXPORTS
   ============================================================ */

export {

    MMA_LIFE_GAME,

    mainState,

    initialize,

    start,

    newGame,

    getGameState,

    setGameState,

    getDiagnostics,

    load,

    save,

    hasSave,

    resetGame

};
