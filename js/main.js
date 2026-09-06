/* ============================================================
   MMA LIFE DYNASTY
   MAIN ENTRY POINT
   ============================================================
   Este é o único arquivo JS carregado diretamente pelo index.html.
   IMPORTANTE:
   - Todos os módulos existentes são carregados aqui.
   - Não importar pastas/arquivos que não existem.
   - Expor MMA_LIFE_GAME globalmente para o index.html.
   - O boot nunca deve impedir a tela inicial de aparecer.
   ============================================================ */
/* ============================================================
   1. CORE
   ============================================================ */
import "./core/constants.js";
import "./core/state.js";
import "./core/rng.js";
import "./core/clock.js";
import "./core/calendar.js";
import "./core/events.js";
import "./core/save.js";
import "./core/engine.js";
/* ============================================================
   2. PLAYER
   ============================================================ */
import "./player/identity.js";
import "./player/attributes.js";
import "./player/potential.js";
import "./player/genetics.js";
import "./player/health.js";
/* ============================================================
   3. TRAINING
   ============================================================ */
import "./training/training.js";
import "./training/camp.js";
import "./training/recovery.js";
import "./training/fatigue.js";
import "./training/weightCut.js";
import "./training/trainingEngine.js";
/* ============================================================
   4. MMA
   ============================================================ */
import "./mma/styles.js";
import "./mma/fighters.js";
import "./mma/fightEngine.js";
import "./mma/matchmaking.js";
import "./mma/weightClasses.js";
import "./mma/matchup.js";
/* ============================================================
   5. CAREER
   ============================================================ */
import "./career/amateur.js";
import "./career/professional.js";
import "./career/rankings.js";
import "./career/titles.js";
import "./career/records.js";
import "./career/legacy.js";
/* ============================================================
   6. PROMOTIONS
   ============================================================ */
import "./promotions/promotions.js";
import "./promotions/contracts.js";
import "./promotions/events.js";
import "./promotions/divisions.js";
/* ============================================================
   7. BUSINESS
   ============================================================ */
import "./business/managers.js";
import "./business/sponsors.js";
import "./business/finances.js";
import "./business/negotiations.js";
import "./business/endorsements.js";
import "./business/income.js";
import "./business/expenses.js";
import "./business/assets.js";
import "./business/wealth.js";
import "./business/financialEngine.js";
import "./business/market.js";
import "./business/economy.js";
import "./business/economyEngine.js";
/* ============================================================
   8. MEDIA
   ============================================================ */
import "./media/media.js";
import "./media/fame.js";
import "./media/reputation.js";
import "./media/persona.js";
import "./media/marketability.js";
import "./media/popularity.js";
import "./media/followers.js";
import "./media/socialMedia.js";
import "./media/news.js";
import "./media/rivalries.js";
import "./media/controversies.js";
import "./media/awards.js";
import "./media/retirement.js";
import "./media/legacy.js";
import "./media/mediaEngine.js";
/* ============================================================
   9. WORLD
   ============================================================ */
import "./world/countries.js";
import "./world/cities.js";
import "./world/gyms.js";
import "./world/venues.js";
import "./world/organizations.js";
import "./world/events.js";
import "./world/worldSimulation.js";
import "./world/worldEngine.js";
/* ============================================================
   10. LIFE
   ============================================================ */
import "./life/relationships.js";
import "./life/marriage.js";
import "./life/children.js";
import "./life/family.js";
import "./life/education.js";
import "./life/employment.js";
import "./life/residence.js";
import "./life/vehicles.js";
import "./life/lifestyle.js";
import "./life/lifeEngine.js";
import "./life/lifeEvents.js";
import "./life/lifeHistory.js";
import "./life/lifeMilestones.js";
import "./life/lifeIntegration.js";
import "./life/lifeGameBridge.js";
import "./life/lifeUI.js";
import "./life/lifeDashboard.js";
import "./life/lifeNavigation.js";
import "./life/lifeScreen.js";
import "./life/lifeMenu.js";
import "./life/lifeRouter.js";
import "./life/lifeController.js";
import "./life/lifeBootstrap.js";
import "./life/index.js";
/* ============================================================
   11. UI
   ============================================================ */
import "./ui/characterCreation.js";
import "./ui/gameUI.js";
import "./ui/index.js";
import "./ui/hud.js";
import "./ui/mainMenu.js";
import "./ui/layout.js";
import "./ui/screens.js";
import "./ui/dashboard.js";
import "./ui/careerScreen.js";
import "./ui/trainingScreen.js";
import "./ui/fightsScreen.js";
import "./ui/lifeOverviewScreen.js";
import "./ui/familyScreen.js";
import "./ui/financesScreen.js";
import "./ui/mediaScreen.js";
import "./ui/dynastyScreen.js";
import "./ui/promotionScreen.js";
import "./ui/rankingsScreen.js";
import "./ui/contractsScreen.js";
import "./ui/profileScreen.js";
import "./ui/settingsScreen.js";
import "./ui/bootstrap.js";
/* ============================================================
   MAIN
   ============================================================ */
const MAIN_VERSION = 4;
const mainState = {
    version: MAIN_VERSION,
    status: "idle",
    database: null,
    initialized: false,
    started: false,
    paused: false,
    errors: [],
    warnings: [],
    cycles: {
        weeks: 0,
        months: 0,
        years: 0
    },
    lastCycle: {
        type: null,
        at: null
    },
    initializedAt: null,
    startedAt: null
};
/* ============================================================
   UTILITÁRIOS
   ============================================================ */
function now() {
    return new Date().toISOString();
}
function log(...args) {
    console.log(
        "[MMA LIFE DYNASTY]",
        ...args
    );
}
function errorLog(
    message,
    error = null
) {
    const entry = {
        message,
        error:
            error?.message ||
            String(error || ""),
        timestamp:
            now()
    };
    mainState.errors.push(
        entry
    );
    if (
        mainState.errors.length >
        100
    ) {
        mainState.errors.shift();
    }
    console.error(
        "[MMA LIFE DYNASTY]",
        message,
        error
    );
}
function warning(
    message
) {
    const entry = {
        message,
        timestamp:
            now()
    };
    mainState.warnings.push(
        entry
    );
    if (
        mainState.warnings.length >
        100
    ) {
        mainState.warnings.shift();
    }
    console.warn(
        "[MMA LIFE DYNASTY]",
        message
    );
}
/* ============================================================
   GLOBAL API
   ============================================================ */
function getAPI(
    name
) {
    if (
        typeof globalThis ===
        "undefined"
    ) {
        return null;
    }
    return (
        globalThis[name] ||
        null
    );
}
/* ============================================================
   DATABASE
   ============================================================ */
function getDatabase() {
    if (
        mainState.database
    ) {
        return mainState.database;
    }
    if (
        typeof globalThis !==
        "undefined" &&
        globalThis.MMA_LIFE_DATABASE
    ) {
        mainState.database =
            globalThis.MMA_LIFE_DATABASE;
        return mainState.database;
    }
    return null;
}
function setDatabase(
    database
) {
    if (
        !database ||
        typeof database !==
        "object"
    ) {
        return null;
    }
    mainState.database =
        database;
    if (
        typeof globalThis !==
        "undefined"
    ) {
        globalThis.MMA_LIFE_DATABASE =
            database;
    }
    return database;
}
/* ============================================================
   DATABASE NOVO JOGO
   ============================================================ */
function createFallbackDatabase() {
    return {
        version: 1,
        meta: {
            gameName:
                "MMA Life Dynasty",
            startedAt: null,
            lastSavedAt: null,
            currentDate:
                "2026-01-01",
            currentWeek: 1,
            currentMonth: 1,
            currentYear: 1,
            difficulty:
                "normal",
            paused: false
        },
        player: null,
        world: {
            fighters: {},
            promotions: {},
            events: {},
            rankings: {},
            champions: {},
            gyms: {},
            venues: {},
            countries: {},
            cities: {},
            news: {},
            tournaments: {},
            sponsors: {},
            managers: {}
        },
        career: {
            stage:
                "Amateur",
            professional:
                false,
            amateur: {},
            professionalCareer: {},
            history: [],
            achievements: [],
            milestones: [],
            rivalries: [],
            currentOrganizationId:
                null,
            currentDivisionId:
                null,
            currentRank:
                null
        },
        training: {
            energy: 100,
            fatigue: 0,
            health: 100,
            sessions: [],
            weeklyPlan: [],
            camp: null,
            recovery: {},
            weight: {}
        },
        health: {
            overall: 100,
            injuries: [],
            chronicConditions: [],
            medicalSuspension:
                false,
            medicalSuspensionUntil:
                null,
            lastMedicalCheck:
                null,
            concussionHistory:
                0,
            surgeries: [],
            scars: [],
            physicalCondition:
                100
        },
        business: {
            manager: null,
            sponsors: [],
            contracts: [],
            negotiations: [],
            endorsements: [],
            income: {},
            expenses: {},
            finances: {
                cash: 0,
                careerEarnings:
                    0,
                careerExpenses:
                    0,
                netWorth:
                    0,
                assets: [],
                liabilities: []
            }
        },
        media: {
            fame: 0,
            fameLevel:
                "Unknown",
            followers: 0,
            reputation: 0,
            hype: 0,
            publicPersona:
                "Underdog",
            mediaAppearances:
                0,
            interviews: [],
            socialPosts: [],
            news: [],
            viralMoments: [],
            controversies: [],
            fanBase: {
                local: 0,
                national: 0,
                international: 0,
                hardcore: 0
            }
        },
        life: {
            relationships: [],
            partner: null,
            marriage: null,
            children: [],
            parents: [],
            siblings: [],
            friends: [],
            education: {},
            employment: {},
            residence: {},
            vehicles: [],
            lifestyle: {}
        },
        dynasty: {
            active: true,
            activeCharacterId:
                null,
            currentGeneration:
                1,
            generations: [],
            genealogy: [],
            inheritance: [],
            deceasedCharacters: [],
            familyRecords: [],
            familyAssets: [],
            familyAchievements: [],
            familyRivalries: []
        },
        promoter: {
            active: false,
            organizationId:
                null,
            ownershipPercentage:
                0,
            staff: [],
            fighters: [],
            events: [],
            venues: [],
            broadcastDeals: [],
            sponsors: [],
            revenue: 0,
            expenses: 0,
            reputation: 0,
            audience: 0
        },
        calendar: {
            upcomingEvents: [],
            completedEvents: [],
            scheduledFights: [],
            appointments: [],
            birthdays: [],
            personalEvents: [],
            deadlines: []
        },
        history: [],
        notifications: [],
        settings: {
            language:
                "pt-BR",
            currency:
                "USD",
            difficulty:
                "normal",
            notifications:
                true,
            autosave:
                true,
            autosaveInterval:
                "month",
            compactMode:
                false,
            showHints:
                true,
            confirmActions:
                true,
            animations:
                true
        }
    };
}
/* ============================================================
   PREPARAR DATABASE
   ============================================================ */
function prepareDatabase(
    database
) {
    const db =
        database ||
        createFallbackDatabase();
    const objectKeys = [
        "meta",
        "world",
        "career",
        "training",
        "health",
        "business",
        "media",
        "life",
        "dynasty",
        "promoter",
        "calendar",
        "settings"
    ];
    for (
        const key of objectKeys
    ) {
        if (
            !db[key] ||
            typeof db[key] !==
            "object"
        ) {
            db[key] = {};
        }
    }
    if (
        !Array.isArray(
            db.history
        )
    ) {
        db.history = [];
    }
    if (
        !Array.isArray(
            db.notifications
        )
    ) {
        db.notifications = [];
    }
    return db;
}
/* ============================================================
   INICIALIZAR API
   ============================================================ */
function initializeAPI(
    name,
    database
) {
    const api =
        getAPI(name);
    if (!api) {
        warning(
            `${name} não encontrado.`
        );
        return false;
    }
    try {
        if (
            typeof api.initialize ===
            "function"
        ) {
            api.initialize(
                database
            );
            return true;
        }
        if (
            typeof api.init ===
            "function"
        ) {
            api.init(
                database
            );
            return true;
        }
        if (
            typeof api.start ===
            "function"
        ) {
            /*
             * Não chamamos start
             * durante a inicialização.
             */
        }
        return true;
    } catch (error) {
        errorLog(
            `Erro ao inicializar ${name}.`,
            error
        );
        /*
         * Um módulo secundário com
         * erro não pode derrubar a
         * tela inicial inteira.
         */
        return false;
    }
}
/* ============================================================
   SISTEMAS
   ============================================================ */
function initializeSystems(
    database
) {
    const systems = [
        /* CORE */
        "stateAPI",
        "rngAPI",
        "clockAPI",
        "calendarAPI",
        "eventsAPI",
        "saveAPI",
        "engineAPI",
        /* PLAYER */
        "identityAPI",
        "attributesAPI",
        "potentialAPI",
        "geneticsAPI",
        "healthAPI",
        /* TRAINING */
        "trainingAPI",
        "campAPI",
        "recoveryAPI",
        "fatigueAPI",
        "weightCutAPI",
        "trainingEngineAPI",
        /* MMA */
        "stylesAPI",
        "fightersAPI",
        "fightEngineAPI",
        "matchmakingAPI",
        "weightClassesAPI",
        "matchupAPI",
        /* CAREER */
        "amateurAPI",
        "professionalAPI",
        "rankingsAPI",
        "titlesAPI",
        "recordsAPI",
        "careerLegacyAPI",
        /* PROMOTIONS */
        "promotionsAPI",
        "contractsAPI",
        "promotionEventsAPI",
        "divisionsAPI",
        /* BUSINESS */
        "managersAPI",
        "sponsorsAPI",
        "financesAPI",
        "negotiationsAPI",
        "endorsementsAPI",
        "incomeAPI",
        "expensesAPI",
        "assetsAPI",
        "wealthAPI",
        "financialEngineAPI",
        "marketAPI",
        "economyAPI",
        "economyEngineAPI",
        /* MEDIA */
        "mediaAPI",
        "fameAPI",
        "reputationAPI",
        "personaAPI",
        "marketabilityAPI",
        "popularityAPI",
        "followersAPI",
        "socialMediaAPI",
        "newsAPI",
        "rivalriesAPI",
        "controversiesAPI",
        "awardsAPI",
        "retirementAPI",
        "mediaEngineAPI",
        /* WORLD */
        "countriesAPI",
        "citiesAPI",
        "gymsAPI",
        "venuesAPI",
        "organizationsAPI",
        "worldEventsAPI",
        "worldSimulationAPI",
        "worldEngineAPI"
    ];
    const results = {};
    for (
        const name of systems
    ) {
        results[name] =
            initializeAPI(
                name,
                database
            );
    }
    return results;
}
/* ============================================================
   LIFE
   ============================================================ */
function initializeLife(
    database
) {
    const results = {};
    const lifeSystems = [
        "lifeEngineAPI",
        "lifeEventsAPI",
        "lifeHistoryAPI",
        "lifeMilestonesAPI",
        "lifeIntegrationAPI",
        "relationshipsAPI",
        "marriageAPI",
        "childrenAPI",
        "familyAPI",
        "educationAPI",
        "employmentAPI",
        "residenceAPI",
        "vehiclesAPI",
        "lifestyleAPI",
        "lifeUIAPI",
        "lifeDashboardAPI",
        "lifeNavigationAPI",
        "lifeScreenAPI",
        "lifeMenuAPI",
        "lifeRouterAPI",
        "lifeControllerAPI"
    ];
    for (
        const name of lifeSystems
    ) {
        results[name] =
            initializeAPI(
                name,
                database
            );
    }
    const bridge =
        getAPI(
            "lifeGameBridgeAPI"
        );
    if (
        bridge &&
        typeof bridge.initialize ===
        "function"
    ) {
        try {
            bridge.initialize(
                database
            );
            results.lifeGameBridgeAPI =
                true;
        } catch (error) {
            errorLog(
                "Erro no Life Game Bridge.",
                error
            );
            results.lifeGameBridgeAPI =
                false;
        }
    } else {
        results.lifeGameBridgeAPI =
            false;
    }
    return results;
}
/* ============================================================
   UI
   ============================================================ */
function initializeUI(
    database
) {
    const results = {};
    const uiSystems = [
        "gameUIAPI",
        "hudAPI",
        "mainMenuAPI",
        "layoutAPI",
        "screensAPI",
        "characterCreationAPI",
        "dashboardAPI",
        "careerScreenAPI",
        "trainingScreenAPI",
        "fightsScreenAPI",
        "lifeOverviewScreenAPI",
        "familyScreenAPI",
        "financesScreenAPI",
        "mediaScreenAPI",
        "dynastyScreenAPI",
        "promotionScreenAPI",
        "rankingsScreenAPI",
        "contractsScreenAPI",
        "profileScreenAPI",
        "settingsScreenAPI"
    ];
    for (
        const name of uiSystems
    ) {
        results[name] =
            initializeAPI(
                name,
                database
            );
    }
    /*
     * UI Bootstrap fica por último.
     */
    const bootstrap =
        getAPI(
            "uiBootstrapAPI"
        );
    if (
        bootstrap &&
        typeof bootstrap.initialize ===
        "function"
    ) {
        try {
            bootstrap.initialize(
                database
            );
            results.uiBootstrapAPI =
                true;
        } catch (error) {
            errorLog(
                "Erro no UI Bootstrap.",
                error
            );
            results.uiBootstrapAPI =
                false;
        }
    } else {
        results.uiBootstrapAPI =
            false;
    }
    return results;
}
/* ============================================================
   INITIALIZE
   ============================================================ */
async function initialize(
    options = {}
) {
    if (
        mainState.initialized &&
        !options.force
    ) {
        return {
            success: true,
            alreadyInitialized:
                true,
            database:
                mainState.database
        };
    }
    mainState.status =
        "initializing";
    try {
        log(
            "Inicializando MMA Life Dynasty..."
        );
        let database =
            options.database ||
            getDatabase();
        if (!database) {
            database =
                createFallbackDatabase();
        }
        database =
            prepareDatabase(
                database
            );
        setDatabase(
            database
        );
        /*
         * Inicializa os sistemas.
         */
        const systems =
            initializeSystems(
                database
            );
        /*
         * Inicializa LIFE.
         */
        const life =
            initializeLife(
                database
            );
        /*
         * Inicializa UI.
         */
        const ui =
            initializeUI(
                database
            );
        /*
         * Estado principal.
         */
        mainState.initialized =
            true;
        mainState.status =
            "ready";
        mainState.initializedAt =
            now();
        /*
         * GLOBAL
         */
        exposeGlobalAPI();
        /*
         * Evento para o index.html.
         */
        if (
            typeof window !==
            "undefined"
        ) {
            window.dispatchEvent(
                new CustomEvent(
                    "mma-life-game-ready",
                    {
                        detail: {
                            database,
                            main:
                                mainAPI,
                            systems,
                            life,
                            ui
                        }
                    }
                )
            );
        }
        log(
            "MMA Life Dynasty inicializado."
        );
        return {
            success: true,
            initialized:
                true,
            database,
            systems,
            life,
            ui
        };
    } catch (error) {
        mainState.status =
            "error";
        errorLog(
            "Falha durante a inicialização.",
            error
        );
        /*
         * Mesmo com erro, mantemos
         * o objeto global disponível.
         */
        exposeGlobalAPI();
        return {
            success: false,
            initialized:
                false,
            error:
                error?.message ||
                String(error),
            database:
                mainState.database,
            errors:
                mainState.errors
        };
    }
}
/* ============================================================
   START GAME
   ============================================================ */
async function start(
    options = {}
) {
    try {
        /*
         * Garante inicialização.
         */
        if (
            !mainState.initialized
        ) {
            const result =
                await initialize(
                    options
                );
            if (
                !result.success
            ) {
                return result;
            }
        }
        /*
         * UI Bootstrap.
         */
        const bootstrap =
            getAPI(
                "uiBootstrapAPI"
            );
        if (
            bootstrap &&
            typeof bootstrap.start ===
            "function"
        ) {
            try {
                bootstrap.start(
                    mainState.database
                );
            } catch (error) {
                errorLog(
                    "Erro ao iniciar UI Bootstrap.",
                    error
                );
            }
        }
        /*
         * UI principal.
         */
        const ui =
            getAPI(
                "uiAPI"
            );
        if (
            ui &&
            typeof ui.start ===
            "function"
        ) {
            try {
                ui.start(
                    mainState.database
                );
            } catch (error) {
                errorLog(
                    "Erro ao iniciar UI.",
                    error
                );
            }
        }
        /*
         * Game UI.
         */
        const gameUI =
            getAPI(
                "gameUIAPI"
            );
        if (
            gameUI &&
            typeof gameUI.start ===
            "function"
        ) {
            try {
                gameUI.start(
                    mainState.database
                );
            } catch (error) {
                errorLog(
                    "Erro ao iniciar Game UI.",
                    error
                );
            }
        }
        mainState.started =
            true;
        mainState.paused =
            false;
        mainState.status =
            "running";
        mainState.startedAt =
            now();
        refreshUI();
        exposeGlobalAPI();
        return {
            success: true,
            started: true,
            database:
                mainState.database
        };
    } catch (error) {
        mainState.status =
            "error";
        errorLog(
            "Erro ao iniciar o jogo.",
            error
        );
        return {
            success: false,
            started: false,
            error:
                error?.message ||
                String(error)
        };
    }
}
/* ============================================================
   PAUSE
   ============================================================ */
function pause() {
    mainState.paused =
        true;
    mainState.status =
        "paused";
    const engine =
        getAPI(
            "engineAPI"
        );
    if (
        engine &&
        typeof engine.pause ===
        "function"
    ) {
        try {
            engine.pause();
        } catch (error) {
            errorLog(
                "Erro ao pausar Engine.",
                error
            );
        }
    }
    return true;
}
/* ============================================================
   RESUME
   ============================================================ */
function resume() {
    mainState.paused =
        false;
    mainState.status =
        "running";
    const engine =
        getAPI(
            "engineAPI"
        );
    if (
        engine &&
        typeof engine.start ===
        "function"
    ) {
        try {
            engine.start();
        } catch (error) {
            errorLog(
                "Erro ao retomar Engine.",
                error
            );
        }
    }
    return true;
}
/* ============================================================
   PROCESSAR SEMANA
   ============================================================ */
function processWeek() {
    const engine =
        getAPI(
            "engineAPI"
        );
    if (!engine) {
        throw new Error(
            "Engine não disponível."
        );
    }
    let result;
    if (
        typeof engine.advanceWeek ===
        "function"
    ) {
        result =
            engine.advanceWeek();
    } else if (
        typeof engine.processWeek ===
        "function"
    ) {
        result =
            engine.processWeek(
                mainState.database
            );
    } else {
        throw new Error(
            "Engine não possui método para avançar semana."
        );
    }
    mainState.cycles.weeks++;
    mainState.lastCycle = {
        type:
            "week",
        at:
            now()
    };
    refreshUI();
    return result;
}
/* ============================================================
   PROCESSAR MÊS
   ============================================================ */
function processMonth() {
    const engine =
        getAPI(
            "engineAPI"
        );
    if (!engine) {
        throw new Error(
            "Engine não disponível."
        );
    }
    let result;
    if (
        typeof engine.processMonth ===
        "function"
    ) {
        result =
            engine.processMonth(
                mainState.database
            );
    } else {
        result =
            processWeeksSafely(
                4
            );
    }
    mainState.cycles.months++;
    mainState.lastCycle = {
        type:
            "month",
        at:
            now()
    };
    refreshUI();
    return result;
}
/* ============================================================
   PROCESSAR ANO
   ============================================================ */
function processYear() {
    const engine =
        getAPI(
            "engineAPI"
        );
    if (!engine) {
        throw new Error(
            "Engine não disponível."
        );
    }
    let result;
    if (
        typeof engine.processYear ===
        "function"
    ) {
        result =
            engine.processYear(
                mainState.database
            );
    } else {
        result =
            processWeeksSafely(
                52
            );
    }
    mainState.cycles.years++;
    mainState.lastCycle = {
        type:
            "year",
        at:
            now()
    };
    refreshUI();
    return result;
}
/* ============================================================
   PROCESSAR SEMANAS
   ============================================================ */
function processWeeksSafely(
    amount
) {
    const engine =
        getAPI(
            "engineAPI"
        );
    if (!engine) {
        throw new Error(
            "Engine não disponível."
        );
    }
    if (
        typeof engine.advanceWeeks ===
        "function"
    ) {
        return engine.advanceWeeks(
            amount
        );
    }
    let result =
        null;
    for (
        let i = 0;
        i < amount;
        i++
    ) {
        if (
            typeof engine.advanceWeek ===
            "function"
        ) {
            result =
                engine.advanceWeek();
        } else {
            break;
        }
    }
    return result;
}
/* ============================================================
   REFRESH UI
   ============================================================ */
function refreshUI() {
    try {
        const ui =
            getAPI(
                "uiAPI"
            );
        if (
            ui &&
            typeof ui.refresh ===
            "function"
        ) {
            ui.refresh(
                mainState.database
            );
            return true;
        }
        const gameUI =
            getAPI(
                "gameUIAPI"
            );
        if (
            gameUI &&
            typeof gameUI.refresh ===
            "function"
        ) {
            gameUI.refresh(
                mainState.database
            );
            return true;
        }
        const bootstrap =
            getAPI(
                "uiBootstrapAPI"
            );
        if (
            bootstrap &&
            typeof bootstrap.refresh ===
            "function"
        ) {
            bootstrap.refresh(
                mainState.database
            );
            return true;
        }
        return false;
    } catch (error) {
        errorLog(
            "Erro ao atualizar interface.",
            error
        );
        return false;
    }
}
/* ============================================================
   NAVEGAÇÃO
   ============================================================ */
function navigate(
    screen,
    data = {}
) {
    const bootstrap =
        getAPI(
            "uiBootstrapAPI"
        );
    if (
        bootstrap &&
        typeof bootstrap.navigate ===
        "function"
    ) {
        try {
            return bootstrap.navigate(
                screen,
                data
            );
        } catch (error) {
            errorLog(
                `Erro ao navegar para ${screen}.`,
                error
            );
        }
    }
    const ui =
        getAPI(
            "uiAPI"
        );
    if (
        ui &&
        typeof ui.navigate ===
        "function"
    ) {
        try {
            return ui.navigate(
                screen,
                data
            );
        } catch (error) {
            errorLog(
                `Erro ao navegar para ${screen}.`,
                error
            );
        }
    }
    const gameUI =
        getAPI(
            "gameUIAPI"
        );
    if (
        gameUI &&
        typeof gameUI.navigate ===
        "function"
    ) {
        try {
            return gameUI.navigate(
                screen,
                data
            );
        } catch (error) {
            errorLog(
                `Erro no Game UI ao navegar para ${screen}.`,
                error
            );
        }
    }
    warning(
        `Tela "${screen}" não encontrada.`
    );
    return false;
}
/* ============================================================
   SAVE
   ============================================================ */
function save() {
    const saveAPI =
        getAPI(
            "saveAPI"
        );
    if (!saveAPI) {
        return {
            success: false,
            error:
                "saveAPI não disponível."
        };
    }
    try {
        if (
            typeof saveAPI.saveGame ===
            "function"
        ) {
            return saveAPI.saveGame(
                mainState.database
            );
        }
        if (
            typeof saveAPI.save ===
            "function"
        ) {
            return saveAPI.save(
                mainState.database
            );
        }
    } catch (error) {
        errorLog(
            "Erro ao salvar jogo.",
            error
        );
        return {
            success: false,
            error:
                error?.message ||
                String(error)
        };
    }
    return {
        success: false,
        error:
            "Método de save não encontrado."
    };
}
/* ============================================================
   LOAD
   ============================================================ */
function load() {
    const saveAPI =
        getAPI(
            "saveAPI"
        );
    if (!saveAPI) {
        return {
            success: false,
            error:
                "saveAPI não disponível."
        };
    }
    try {
        let result;
        if (
            typeof saveAPI.loadGame ===
            "function"
        ) {
            result =
                saveAPI.loadGame();
        } else if (
            typeof saveAPI.load ===
            "function"
        ) {
            result =
                saveAPI.load();
        } else {
            return {
                success: false,
                error:
                    "Método de load não encontrado."
            };
        }
        if (
            result &&
            result.success &&
            result.state
        ) {
            setDatabase(
                prepareDatabase(
                    result.state
                )
            );
        }
        refreshUI();
        return result;
    } catch (error) {
        errorLog(
            "Erro ao carregar jogo.",
            error
        );
        return {
            success: false,
            error:
                error?.message ||
                String(error)
        };
    }
}
/* ============================================================
   RESET GAME
   ============================================================ */
function resetGame(
    options = {}
) {
    const oldSettings =
        mainState
            .database
            ?.settings;
    const database =
        createFallbackDatabase();
    if (
        options.keepSettings &&
        oldSettings
    ) {
        database.settings = {
            ...database.settings,
            ...oldSettings
        };
    }
    setDatabase(
        database
    );
    mainState.initialized =
        false;
    mainState.started =
        false;
    mainState.paused =
        false;
    mainState.status =
        "idle";
    mainState.errors =
        [];
    mainState.warnings =
        [];
    mainState.cycles = {
        weeks: 0,
        months: 0,
        years: 0
    };
    mainState.lastCycle = {
        type: null,
        at: null
    };
    mainState.initializedAt =
        null;
    mainState.startedAt =
        null;
    const engine =
        getAPI(
            "engineAPI"
        );
    if (
        engine &&
        typeof engine.reset ===
        "function"
    ) {
        try {
            engine.reset();
        } catch (error) {
            errorLog(
                "Erro ao resetar Engine.",
                error
            );
        }
    }
    exposeGlobalAPI();
    return database;
}
/* ============================================================
   RESET GAME — ALIAS
   ============================================================ */
function reset(
    options = {}
) {
    return resetGame(
        options
    );
}
/* ============================================================
   GETTERS
   ============================================================ */
function getState() {
    return mainState;
}
function getGameState() {
    return mainState.database;
}
function getPlayer() {
    return (
        mainState
            .database
            ?.player ||
        null
    );
}
function getCalendar() {
    return (
        mainState
            .database
            ?.calendar ||
        null
    );
}
function getStatus() {
    return mainState.status;
}
function getSnapshot() {
    return {
        version:
            MAIN_VERSION,
        status:
            mainState.status,
        initialized:
            mainState.initialized,
        started:
            mainState.started,
        paused:
            mainState.paused,
        cycles: {
            ...mainState.cycles
        },
        lastCycle: {
            ...mainState.lastCycle
        },
        initializedAt:
            mainState.initializedAt,
        startedAt:
            mainState.startedAt,
        player:
            getPlayer(),
        calendar:
            getCalendar()
    };
}
/* ============================================================
   VALIDATE
   ============================================================ */
function validate() {
    const stateAPI =
        getAPI(
            "stateAPI"
        );
    if (
        stateAPI &&
        typeof stateAPI.validateGameState ===
        "function"
    ) {
        try {
            return stateAPI.validateGameState(
                mainState.database
            );
        } catch (error) {
            errorLog(
                "Erro ao validar estado.",
                error
            );
        }
    }
    return {
        valid:
            Boolean(
                mainState.database
            ),
        errors:
            []
    };
}
/* ============================================================
   EVENTOS
   ============================================================ */
function emitGameEvent(
    event
) {
    const eventsAPI =
        getAPI(
            "eventsAPI"
        );
    if (!eventsAPI) {
        warning(
            "eventsAPI não disponível."
        );
        return false;
    }
    try {
        if (
            typeof eventsAPI.emitEvent ===
            "function"
        ) {
            return eventsAPI.emitEvent(
                mainState.database,
                event
            );
        }
        if (
            typeof eventsAPI.emit ===
            "function"
        ) {
            return eventsAPI.emit(
                mainState.database,
                event
            );
        }
    } catch (error) {
        errorLog(
            "Erro ao emitir evento.",
            error
        );
    }
    return false;
}
function onFight(
    fight
) {
    return emitGameEvent({
        type:
            "fight",
        data:
            fight
    });
}
function onContract(
    contract
) {
    return emitGameEvent({
        type:
            "contract",
        data:
            contract
    });
}
function onTitle(
    title
) {
    return emitGameEvent({
        type:
            "title",
        data:
            title
    });
}
function onMarriage(
    marriage
) {
    return emitGameEvent({
        type:
            "marriage",
        data:
            marriage
    });
}
function onChildBirth(
    child
) {
    return emitGameEvent({
        type:
            "childBirth",
        data:
            child
    });
}
function onDeath(
    character
) {
    return emitGameEvent({
        type:
            "death",
        data:
            character
    });
}
/* ============================================================
   API PRINCIPAL
   ============================================================ */
const mainAPI = {
    version:
        MAIN_VERSION,
    state:
        mainState,
    /* Core */
    initialize,
    start,
    pause,
    resume,
    /* Time */
    processWeek,
    processMonth,
    processYear,
    /* UI */
    refreshUI,
    navigate,
    /* Save */
    save,
    load,
    /* Reset */
    reset,
    resetGame,
    /* State */
    getState,
    getGameState,
    getPlayer,
    getCalendar,
    getStatus,
    getSnapshot,
    validate,
    /* Events */
    emitGameEvent,
    onFight,
    onContract,
    onTitle,
    onMarriage,
    onChildBirth,
    onDeath,
    /* Database */
    getDatabase,
    setDatabase
};
/* ============================================================
   EXPOR GLOBAL
   ============================================================ */
function exposeGlobalAPI() {
    if (
        typeof globalThis ===
        "undefined"
    ) {
        return;
    }
    globalThis.MMA_LIFE_MAIN =
        mainAPI;
    globalThis.MMA_LIFE_GAME =
        mainAPI;
    globalThis.mmaLifeGame =
        mainAPI;
    globalThis.MMA_LIFE_DATABASE =
        mainState.database;
}
exposeGlobalAPI();
/* ============================================================
   EXPORT
   ============================================================ */
export {
    mainAPI,
    initialize,
    start,
    pause,
    resume,
    processWeek,
    processMonth,
    processYear,
    refreshUI,
    navigate,
    save,
    load,
    reset,
    resetGame,
    getState,
    getGameState,
    getPlayer,
    getCalendar,
    getStatus,
    getSnapshot,
    validate,
    emitGameEvent,
    onFight,
    onContract,
    onTitle,
    onMarriage,
    onChildBirth,
    onDeath
};
/* ============================================================
   BOOT
   ============================================================ */
async function bootGame() {
    try {
        /*
         * IMPORTANTE:
         * O global já foi exposto acima.
         * Isso permite que o index.html
         * encontre MMA_LIFE_GAME mesmo
         * enquanto a inicialização acontece.
         */
        exposeGlobalAPI();
        const result =
            await initialize();
        if (
            !result.success
        ) {
            console.error(
                "[MMA LIFE DYNASTY] " +
                "Inicialização apresentou erro.",
                result.error
            );
            /*
             * Não lançamos o erro novamente.
             * O index.html precisa continuar
             * funcionando.
             */
            return;
        }
        /*
         * Não iniciamos automaticamente
         * a partida aqui.
         *
         * O index.html controla o botão
         * NOVO JOGO / CONTINUAR.
         */
        log(
            "Boot concluído. Aguardando ação do jogador."
        );
    } catch (error) {
        mainState.status =
            "error";
        errorLog(
            "Erro fatal durante o boot.",
            error
        );
        /*
         * Mesmo em erro, deixa a API global.
         */
        exposeGlobalAPI();
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
            bootGame,
            {
                once: true
            }
        );
    } else {
        bootGame();
    }
}
