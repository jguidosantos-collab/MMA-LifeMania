/* ============================================================
   MMA LIFE DYNASTY
   MAIN ENGINE
   SAFE BOOT + CHARACTER HANDOFF
   ============================================================ */

"use strict";


/* ============================================================
   VERSION
   ============================================================ */

const MAIN_VERSION =
    "SAFE-BOOT-1.2.0";


/* ============================================================
   MAIN STATE
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

    optionalSystemsStarted:
        false,

    database:
        null,

    characterCreation:
        null,

    loadedModules:
        [],

    failedModules:
        [],

    errors:
        [],

    bootTime:
        Date.now()

};


/* ============================================================
   DATABASE
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
                175,

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
   OPTIONAL MODULES
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
   ERROR
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
   LOAD MODULE
   ============================================================ */

async function loadModuleSafe(
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
            "[MMA LIFE DYNASTY] Sistema:",
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
   LOAD OPTIONAL SYSTEMS
   ============================================================ */

async function loadOptionalSystems() {

    if (
        mainState.optionalSystemsStarted
    ) {

        return [];

    }


    mainState.optionalSystemsStarted =
        true;


    const results =
        await Promise.all(
            OPTIONAL_MODULES.map(
                loadModuleSafe
            )
        );


    console.log(
        "[MMA LIFE DYNASTY] Sistemas processados."
    );


    console.log(
        "Carregados:",
        mainState.loadedModules.length
    );


    console.log(
        "Com erro:",
        mainState.failedModules.length
    );


    return results;

}


/* ============================================================
   CHARACTER CREATION
   ============================================================ */

async function initializeCharacterCreation() {

    try {

        const module =
            await import(
                "./ui/characterCreation.js"
            );


        mainState.characterCreation =
            module;


        if (
            module.characterCreationAPI
        ) {

            window.characterCreationAPI =
                module.characterCreationAPI;

        }


        if (
            typeof module.initializeCharacterCreation ===
            "function"
        ) {

            try {

                await module.initializeCharacterCreation();

            }

            catch (error) {

                registerError(
                    "characterCreation.initialize",
                    error
                );

            }

        }


        console.log(
            "[MMA LIFE DYNASTY] " +
            "Character Creation pronto."
        );


        return module;

    }

    catch (error) {

        registerError(
            "characterCreation.load",
            error
        );


        return null;

    }

}


/* ============================================================
   INITIALIZE
   ============================================================ */

async function initialize() {

    if (
        mainState.initialized
    ) {

        return mainState;

    }


    console.log(
        "[MMA LIFE DYNASTY] " +
        "Inicializando..."
    );


    if (
        !mainState.database
    ) {

        mainState.database =
            createDatabase();

    }


    await initializeCharacterCreation();


    mainState.initialized =
        true;


    mainState.status =
        "initialized";


    return mainState;

}


/* ============================================================
   CALCULATE OVERALL
   ============================================================ */

function calculatePlayerOverall(
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


    const total =
        values.reduce(
            (sum, value) =>
                sum + value,
            0
        );


    return Math.round(
        total /
        values.length
    );

}


/* ============================================================
   NORMALIZE WEIGHT CLASS
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
            .replace(
                /\s+/g,
                "-"
            );

    }


    return "lightweight";

}


/* ============================================================
   APPLY CHARACTER
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


    if (
        !mainState.database
    ) {

        mainState.database =
            createDatabase();

    }


    const player =
        mainState.database.player;


    /*
     * IDENTIDADE
     */

    player.id =
        character.id ||
        "player-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 9);


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
        ) || 18;


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
     * MMA
     */

    player.fightingStyle =
        character.fightingStyle ||
        character.style ||
        "mixed";


    player.stance =
        character.stance ||
        "orthodox";


    /*
     * PERSONALIDADE
     */

    if (
        character.personality &&
        typeof character.personality ===
        "object"
    ) {

        player.personality =
            structuredCloneSafe(
                character.personality
            );

        player.confidence =
            Number(
                character.personality.confidence
            ) || 50;

        player.morale =
            Number(
                character.personality.discipline
            ) || 50;

    }

    else {

        player.personality =
            character.personality ||
            "disciplined";

    }


    /*
     * ATRIBUTOS
     */

    if (
        character.attributes
    ) {

        player.attributes =
            structuredCloneSafe(
                character.attributes
            );

    }


    /*
     * OVERALL
     */

    player.overall =
        calculatePlayerOverall(
            player.attributes
        );


    /*
     * POTENCIAL
     *
     * O characterCreation gera um número.
     * O database utiliza um objeto.
     */

    const characterPotential =
        Number(
            character.potential
        );


    if (
        Number.isFinite(
            characterPotential
        )
    ) {

        player.potential = {

            overall:
                player.overall,

            ceiling:
                characterPotential

        };

    }

    else if (
        character.potential &&
        typeof character.potential ===
        "object"
    ) {

        player.potential =
            structuredCloneSafe(
                character.potential
            );

    }


    /*
     * GENÉTICA
     */

    if (
        character.genetics
    ) {

        player.genetics =
            structuredCloneSafe(
                character.genetics
            );

    }


    /*
     * CARREIRA
     *
     * Menor de 18 = AMADOR.
     * 18+ = PROFISSIONAL REGIONAL.
     */

    if (
        player.age >= 18
    ) {

        player.careerStage =
            "regional";

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
                0

        };


        mainState.database.career.stage =
            "regional";

    }

    else {

        player.careerStage =
            "amateur";

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
                0

        };


        mainState.database.career.stage =
            "amateur";

    }


    /*
     * RECORD
     */

    mainState.database.career.record = {

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
     * ESTADO INICIAL
     */

    player.experience =
        0;


    player.fame =
        0;


    player.followers =
        0;


    player.health =
        100;


    player.energy =
        100;


    player.fatigue =
        0;


    player.money =
        0;


    /*
     * WORLD
     */

    mainState.database.world.country =
        player.country;


    mainState.database.world.city =
        player.city;


    /*
     * TRAINING
     */

    mainState.database.training.energy =
        100;


    mainState.database.training.fatigue =
        0;


    /*
     * HISTORY
     */

    mainState.database.history.push({

        type:
            "character_created",

        date:
            new Date().toISOString(),

        message:
            `${player.fullName} iniciou sua carreira no MMA.`

    });


    /*
     * NOTIFICATION
     */

    mainState.database.notifications.push({

        type:
            "career_start",

        title:
            "Carreira iniciada",

        message:
            `Bem-vindo ao MMA Life Dynasty, ${player.displayName}!`,

        date:
            new Date().toISOString(),

        read:
            false

    });


    return player;

}


/* ============================================================
   HIDE START SCREEN
   ============================================================ */

function hideStartScreen() {

    const startScreen =
        document.getElementById(
            "start-screen"
        );


    if (
        startScreen
    ) {

        startScreen.classList.remove(
            "visible"
        );

        startScreen.classList.add(
            "hidden"
        );

        startScreen.style.display =
            "none";

    }


    const bootScreen =
        document.getElementById(
            "boot-screen"
        );


    if (
        bootScreen
    ) {

        bootScreen.classList.remove(
            "visible"
        );

        bootScreen.classList.add(
            "hidden"
        );

        bootScreen.style.display =
            "none";

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
   START CAREER
   ============================================================ */

async function startCareer(
    character
) {

    /*
     * IMPORTANTE:
     * impede que o mesmo personagem seja iniciado
     * duas vezes.
     */

    if (
        mainState.careerStarted
    ) {

        console.warn(
            "[MMA LIFE DYNASTY] " +
            "Carreira já foi iniciada."
        );


        return {

            success:
                true,

            alreadyStarted:
                true,

            player:
                mainState.database?.player,

            state:
                mainState.database

        };

    }


    await initialize();


    /*
     * Transfere personagem.
     */

    const player =
        applyCharacterToGame(
            character
        );


    mainState.careerStarted =
        true;


    mainState.started =
        true;


    mainState.status =
        "career";


    /*
     * Esconde a tela inicial.
     */

    hideStartScreen();


    /*
     * PLAYER API
     */

    try {

        if (
            window.playerAPI &&
            typeof window.playerAPI.initialize ===
            "function"
        ) {

            await window.playerAPI.initialize(
                mainState.database
            );

        }

    }

    catch (error) {

        registerError(
            "playerAPI.initialize",
            error
        );

    }


    /*
     * SAVE IMEDIATO
     */

    try {

        await save();

    }

    catch (error) {

        registerError(
            "initialCareerSave",
            error
        );

    }


    /*
     * RENDER PRINCIPAL
     */

    renderMainGame();


    /*
     * EVENTO OFICIAL
     */

    document.dispatchEvent(
        new CustomEvent(
            "mma-life-game-started",
            {
                detail: {

                    player,

                    state:
                        mainState.database

                }
            }
        )
    );


    /*
     * Sistemas opcionais.
     *
     * Eles não bloqueiam a entrada
     * do jogador no jogo.
     */

    if (
        !mainState.optionalSystemsStarted
    ) {

        setTimeout(
            () => {

                loadOptionalSystems()
                    .catch(
                        error => {

                            registerError(
                                "optionalSystems",
                                error
                            );

                        }
                    );

            },
            100
        );

    }


    return {

        success:
            true,

        player,

        state:
            mainState.database

    };

}


/* ============================================================
   STRUCTURED CLONE
   ============================================================ */

function structuredCloneSafe(
    data
) {

    try {

        return structuredClone(
            data
        );

    }

    catch {

        return JSON.parse(
            JSON.stringify(
                data
            )
        );

    }

}


/* ============================================================
   GET STATE
   ============================================================ */

function getGameState() {

    return mainState.database;

}


/* ============================================================
   SET STATE
   ============================================================ */

function setGameState(
    state
) {

    if (
        !state ||
        typeof state !==
        "object"
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
   MAIN GAME SCREEN
   ============================================================ */

function renderMainGame() {

    const root =
        document.getElementById(
            "game-root"
        );


    if (
        !root
    ) {

        console.error(
            "[MMA LIFE DYNASTY] " +
            "#game-root não encontrado."
        );

        return;

    }


    const player =
        mainState.database.player;


    const record =
        mainState.database.career.record;


    const careerName =
        player.age >= 18
            ? "REGIONAL"
            : "AMADOR";


    root.innerHTML = `

        <div
            id="mma-game-interface"
            class="mma-game-interface"
        >

            <header
                class="game-header"
            >

                <div>

                    <span class="game-kicker">
                        MMA LIFE DYNASTY
                    </span>

                    <h1>
                        ${escapeHTML(
                            player.displayName
                        )}
                    </h1>

                    <p>
                        ${escapeHTML(
                            player.city
                        )},
                        ${escapeHTML(
                            player.country
                        )}
                    </p>

                </div>


                <div
                    class="game-money"
                >
                    R$ ${formatMoney(
                        player.money
                    )}
                </div>

            </header>


            <section
                class="game-dashboard"
            >

                <div class="dashboard-card">

                    <span>
                        IDADE
                    </span>

                    <strong>
                        ${player.age}
                    </strong>

                </div>


                <div class="dashboard-card">

                    <span>
                        CATEGORIA
                    </span>

                    <strong>
                        ${escapeHTML(
                            player.weightClass
                        )}
                    </strong>

                </div>


                <div class="dashboard-card">

                    <span>
                        OVR
                    </span>

                    <strong>
                        ${player.overall}
                    </strong>

                </div>


                <div class="dashboard-card">

                    <span>
                        POTENCIAL
                    </span>

                    <strong>
                        ${
                            player.potential?.ceiling ||
                            0
                        }
                    </strong>

                </div>

            </section>


            <section
                class="career-panel"
            >

                <div>

                    <span>
                        STATUS DA CARREIRA
                    </span>

                    <h2>
                        ${careerName}
                    </h2>

                    <p>
                        Sua jornada no MMA começou.
                    </p>

                </div>


                <div
                    class="career-record"
                >

                    <strong>
                        ${record.wins}
                        -
                        ${record.losses}
                        -
                        ${record.draws}
                    </strong>

                    <span>
                        CARTEL
                    </span>

                </div>

            </section>


            <section
                class="game-actions"
            >

                <button
                    type="button"
                    class="game-action active"
                    data-game-action="training"
                >
                    TREINAR
                </button>


                <button
                    type="button"
                    class="game-action"
                    data-game-action="fight"
                >
                    LUTAR
                </button>


                <button
                    type="button"
                    class="game-action"
                    data-game-action="career"
                >
                    CARREIRA
                </button>


                <button
                    type="button"
                    class="game-action"
                    data-game-action="life"
                >
                    VIDA
                </button>

            </section>


            <div
                id="game-toast-container"
            ></div>

        </div>

    `;


    injectMainGameStyles();


    bindMainGameActions();

}


/* ============================================================
   MAIN GAME ACTIONS
   ============================================================ */

function bindMainGameActions() {

    const buttons =
        document.querySelectorAll(
            "[data-game-action]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.gameAction;


                    buttons.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    handleGameAction(
                        action
                    );

                }
            );

        }
    );

}


/* ============================================================
   GAME ACTION HANDLER
   ============================================================ */

function handleGameAction(
    action
) {

    switch (
        action
    ) {

        case "training":

            showGameToast(
                "Sistema de treinamento carregando..."
            );

            break;


        case "fight":

            showGameToast(
                "Sistema de lutas carregando..."
            );

            break;


        case "career":

            showGameToast(
                "Sistema de carreira carregando..."
            );

            break;


        case "life":

            showGameToast(
                "Sistema de vida carregando..."
            );

            break;


        default:

            break;

    }

}


/* ============================================================
   TOAST
   ============================================================ */

function showGameToast(
    message
) {

    const container =
        document.getElementById(
            "game-toast-container"
        );


    if (
        !container
    ) {

        return;

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "game-toast";


    toast.textContent =
        message;


    container.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.remove();

        },
        2500
    );

}


/* ============================================================
   MAIN GAME STYLES
   ============================================================ */

function injectMainGameStyles() {

    if (
        document.getElementById(
            "mma-life-main-game-styles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "mma-life-main-game-styles";


    style.textContent = `

        html,
        body {
            margin: 0 !important;
            padding: 0 !important;
            min-height: 100% !important;
            background: #0b0b0b !important;
            color: #fff !important;
        }


        body {
            min-height: 100vh !important;
            color-scheme: dark;
        }


        #game-root {
            min-height: 100vh;
            background: #0b0b0b !important;
            color: #fff !important;
        }


        .mma-game-interface {
            min-height: 100vh;
            width:
                min(
                    1180px,
                    calc(100% - 32px)
                );

            margin:
                0 auto;

            padding:
                30px 0 60px;

            box-sizing:
                border-box;

            font-family:
                Arial,
                Helvetica,
                sans-serif;
        }


        .game-header {
            display:
                flex;

            align-items:
                flex-end;

            justify-content:
                space-between;

            gap:
                20px;

            margin-bottom:
                25px;
        }


        .game-kicker {
            display:
                block;

            font-size:
                10px;

            font-weight:
                900;

            letter-spacing:
                2px;

            opacity:
                .45;

            margin-bottom:
                8px;
        }


        .game-header h1 {
            margin:
                0;

            font-size:
                clamp(
                    30px,
                    5vw,
                    46px
                );

            line-height:
                1;
        }


        .game-header p {
            margin:
                8px 0 0;

            color:
                #aaa;
        }


        .game-money {
            padding:
                12px 16px;

            border-radius:
                10px;

            background:
                #171717;

            border:
                1px solid #292929;

            font-weight:
                800;

            white-space:
                nowrap;
        }


        .game-dashboard {
            display:
                grid;

            grid-template-columns:
                repeat(4, 1fr);

            gap:
                12px;
        }


        .dashboard-card {
            padding:
                18px;

            border-radius:
                13px;

            background:
                #151515;

            border:
                1px solid #252525;
        }


        .dashboard-card span {
            display:
                block;

            font-size:
                10px;

            font-weight:
                800;

            letter-spacing:
                1px;

            color:
                #888;

            margin-bottom:
                7px;
        }


        .dashboard-card strong {
            font-size:
                25px;
        }


        .career-panel {
            margin-top:
                15px;

            padding:
                22px;

            border-radius:
                15px;

            background:
                #151515;

            border:
                1px solid #252525;

            display:
                flex;

            justify-content:
                space-between;

            align-items:
                center;

            gap:
                20px;
        }


        .career-panel span {
            font-size:
                10px;

            font-weight:
                800;

            letter-spacing:
                1px;

            color:
                #888;
        }


        .career-panel h2 {
            margin:
                7px 0 5px;

            font-size:
                27px;
        }


        .career-panel p {
            margin:
                0;

            color:
                #888;
        }


        .career-record {
            min-width:
                110px;

            text-align:
                center;
        }


        .career-record strong {
            display:
                block;

            font-size:
                27px;
        }


        .career-record span {
            display:
                block;

            margin-top:
                4px;
        }


        .game-actions {
            display:
                grid;

            grid-template-columns:
                repeat(4, 1fr);

            gap:
                10px;

            margin-top:
                15px;
        }


        .game-action {
            min-height:
                60px;

            border:
                1px solid #282828;

            border-radius:
                11px;

            background:
                #151515;

            color:
                #fff;

            font-weight:
                800;

            cursor:
                pointer;

            transition:
                .15s ease;
        }


        .game-action:hover {
            background:
                #202020;
        }


        .game-action.active {
            background:
                #fff;

            color:
                #000;
        }


        #game-toast-container {
            position:
                fixed;

            left:
                50%;

            bottom:
                25px;

            transform:
                translateX(-50%);

            z-index:
                999999;
        }


        .game-toast {
            padding:
                12px 18px;

            border-radius:
                9px;

            background:
                #fff;

            color:
                #000;

            font-weight:
                700;

            box-shadow:
                0 10px 30px
                rgba(0,0,0,.4);
        }


        @media (max-width: 700px) {

            .game-dashboard {
                grid-template-columns:
                    repeat(2, 1fr);
            }


            .game-actions {
                grid-template-columns:
                    repeat(2, 1fr);
            }


            .career-panel {
                align-items:
                    flex-start;
            }

        }


        @media (max-width: 450px) {

            .mma-game-interface {
                width:
                    calc(100% - 20px);

                padding-top:
                    20px;
            }


            .game-header {
                align-items:
                    flex-start;

                flex-direction:
                    column;
            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* ============================================================
   ESCAPE HTML
   ============================================================ */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ============================================================
   MONEY
   ============================================================ */

function formatMoney(
    value
) {

    return Number(
        value || 0
    ).toLocaleString(
        "pt-BR",
        {

            minimumFractionDigits:
                0,

            maximumFractionDigits:
                0

        }
    );

}


/* ============================================================
   NEW GAME
   ============================================================ */

async function newGame() {

    await initialize();


    mainState.database =
        createDatabase();


    mainState.database.player.id =
        "player-" +
        Date.now();


    mainState.started =
        false;


    mainState.careerStarted =
        false;


    mainState.status =
        "initialized";


    return mainState.database;

}


/* ============================================================
   START
   ============================================================ */

async function start() {

    await initialize();


    mainState.started =
        true;


    mainState.status =
        "running";


    if (
        !mainState.optionalSystemsStarted
    ) {

        loadOptionalSystems()
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
   SAVE
   ============================================================ */

async function save() {

    try {

        if (
            !mainState.database
        ) {

            return {

                success:
                    false,

                error:
                    "Nenhum estado de jogo disponível."

            };

        }


        localStorage.setItem(

            "mma-life-dynasty-save",

            JSON.stringify(
                mainState.database
            )

        );


        return {

            success:
                true

        };

    }

    catch (error) {

        registerError(
            "save",
            error
        );


        return {

            success:
                false,

            error:
                error.message

        };

    }

}


/* ============================================================
   LOAD
   ============================================================ */

async function load() {

    try {

        const raw =
            localStorage.getItem(
                "mma-life-dynasty-save"
            );


        if (!raw) {

            return {

                success:
                    false,

                error:
                    "Nenhum jogo salvo encontrado."

            };

        }


        mainState.database =
            JSON.parse(
                raw
            );


        mainState.initialized =
            true;


        mainState.started =
            true;


        mainState.careerStarted =
            true;


        mainState.status =
            "career";


        hideStartScreen();


        renderMainGame();


        return {

            success:
                true,

            state:
                mainState.database

        };

    }

    catch (error) {

        registerError(
            "load",
            error
        );


        return {

            success:
                false,

            error:
                error.message

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


    mainState.careerStarted =
        false;


    mainState.optionalSystemsStarted =
        false;


    mainState.status =
        "initialized";


    return mainState.database;

}


/* ============================================================
   DIAGNOSTICS
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

        careerStarted:
            mainState.careerStarted,

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
            ]

    };

}


/* ============================================================
   CHARACTER CREATED EVENT
   ============================================================ */

document.addEventListener(
    "mma-life-character-created",
    async function (
        event
    ) {

        console.log(
            "[MMA LIFE DYNASTY] " +
            "Personagem recebido pelo MAIN."
        );


        const character =
            event?.detail?.character;


        if (
            !character
        ) {

            console.error(
                "[MMA LIFE DYNASTY] " +
                "Evento sem personagem."
            );

            return;

        }


        /*
         * O characterCreation atualizado também
         * pode chamar startCareer diretamente.
         *
         * Por isso verificamos se já começou.
         */

        if (
            mainState.careerStarted
        ) {

            console.log(
                "[MMA LIFE DYNASTY] " +
                "Carreira já iniciada. Evento duplicado ignorado."
            );

            return;

        }


        try {

            await startCareer(
                character
            );


            document.dispatchEvent(
                new CustomEvent(
                    "mma-life-career-started",
                    {
                        detail: {

                            player:
                                mainState.database.player,

                            state:
                                mainState.database

                        }
                    }
                )
            );


            console.log(
                "[MMA LIFE DYNASTY] " +
                "CARREIRA INICIADA."
            );

        }

        catch (error) {

            registerError(
                "character-created",
                error
            );


            console.error(
                "[MMA LIFE DYNASTY] " +
                "Erro ao iniciar carreira:",
                error
            );

        }

    }
);


/* ============================================================
   API
   ============================================================ */

const MMA_LIFE_GAME = {

    version:
        MAIN_VERSION,

    state:
        mainState,

    initialize,

    start,

    newGame,

    startCareer,

    startNewGame,

    getGameState,

    setGameState,

    getDiagnostics,

    load,

    save,

    hasSave,

    resetGame,

    renderMainGame

};


/* ============================================================
   GLOBAL API
   ============================================================ */

window.MMA_LIFE_GAME =
    MMA_LIFE_GAME;

window.MMA_LIFE_MAIN =
    MMA_LIFE_GAME;

window.mmaLifeGame =
    MMA_LIFE_GAME;

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
        "=============================================="
    );

    console.log(
        " MMA LIFE DYNASTY"
    );

    console.log(
        " SAFE BOOT " +
        MAIN_VERSION
    );

    console.log(
        "=============================================="
    );


    try {

        await initialize();


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
         * Os módulos secundários carregam depois.
         */

        setTimeout(
            () => {

                if (
                    !mainState.careerStarted
                ) {

                    loadOptionalSystems()
                        .catch(
                            error => {

                                registerError(
                                    "optionalSystems.boot",
                                    error
                                );

                            }
                        );

                }

            },
            100
        );

    }

    catch (error) {

        registerError(
            "BOOT",
            error
        );


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

    }

}


/* ============================================================
   START BOOT
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

    startCareer,

    startNewGame,

    getGameState,

    setGameState,

    getDiagnostics,

    load,

    save,

    hasSave,

    resetGame,

    renderMainGame

};
