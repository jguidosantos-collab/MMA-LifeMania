/* ============================================================
   MMA LIFE DYNASTY
   LIFE INTEGRATION SYSTEM
   Arquivo: js/life/lifeIntegration.js

   Responsabilidade:
   - Integrar os módulos da vida
   - Sincronizar dados entre sistemas
   - Criar snapshots da vida
   - Registrar acontecimentos no histórico
   - Processar ciclos semanais/mensais/anuais
   - Preparar integração com Dynasty
   - Evitar dependência circular entre módulos
   ============================================================ */

const LIFE_INTEGRATION_VERSION = 1;

/* ============================================================
   CONSTANTES
   ============================================================ */

const LIFE_MODULES = Object.freeze([
    "relationships",
    "marriage",
    "children",
    "family",
    "education",
    "employment",
    "residence",
    "vehicles",
    "lifestyle",
    "lifeEngine",
    "lifeEvents",
    "lifeHistory"
]);

const LIFE_CYCLE = Object.freeze({
    WEEK: "week",
    MONTH: "month",
    YEAR: "year"
});

const LIFE_SYNC_STATUS = Object.freeze({
    IDLE: "idle",
    RUNNING: "running",
    COMPLETE: "complete",
    ERROR: "error"
});

/* ============================================================
   CONFIGURAÇÃO
   ============================================================ */

const LIFE_INTEGRATION_CONFIG = Object.freeze({
    version: LIFE_INTEGRATION_VERSION,

    automaticHistory: true,
    automaticSnapshots: true,

    processRelationships: true,
    processMarriage: true,
    processChildren: true,
    processFamily: true,
    processEducation: true,
    processEmployment: true,
    processResidence: true,
    processVehicles: true,
    processLifestyle: true,
    processEvents: true,

    weeklyEnabled: true,
    monthlyEnabled: true,
    yearlyEnabled: true,

    snapshotIntervalMonths: 12,

    maxSnapshots: 500,

    synchronizePlayer: true,
    synchronizeAge: true,
    synchronizeFamily: true,
    synchronizeMoney: true,
    synchronizeResidence: true,
    synchronizeCareer: true,

    preventDuplicateProcessing: true
});

/* ============================================================
   UTILIDADES
   ============================================================ */

function integrationClone(value) {
    if (value === undefined || value === null) {
        return value;
    }

    try {
        return JSON.parse(JSON.stringify(value));
    } catch (error) {
        return value;
    }
}

function integrationNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}

function integrationBoolean(value, fallback = false) {
    if (value === undefined || value === null) {
        return fallback;
    }

    return Boolean(value);
}

function integrationText(value, fallback = "") {
    if (value === undefined || value === null) {
        return fallback;
    }

    return String(value).trim();
}

function integrationId(prefix = "integration") {
    return (
        prefix +
        "_" +
        Date.now().toString(36) +
        "_" +
        Math.random().toString(36).slice(2, 8)
    );
}

function integrationGetPath(object, path, fallback = undefined) {
    if (!object || !path) {
        return fallback;
    }

    const parts = String(path).split(".");
    let current = object;

    for (const part of parts) {
        if (
            current === null ||
            current === undefined ||
            typeof current !== "object" ||
            !(part in current)
        ) {
            return fallback;
        }

        current = current[part];
    }

    return current;
}

function integrationSetPath(object, path, value) {
    if (!object || !path) {
        return false;
    }

    const parts = String(path).split(".");
    let current = object;

    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];

        if (
            !current[part] ||
            typeof current[part] !== "object"
        ) {
            current[part] = {};
        }

        current = current[part];
    }

    current[parts[parts.length - 1]] = value;

    return true;
}

function integrationGetPlayer(database) {
    return database?.player || null;
}

function integrationGetDate(database) {
    return (
        database?.meta?.currentDate ||
        database?.calendar?.currentDate ||
        null
    );
}

function integrationGetYear(database) {
    return integrationNumber(
        database?.meta?.currentYear ??
        database?.calendar?.year ??
        1,
        1
    );
}

function integrationGetWeek(database) {
    return integrationNumber(
        database?.meta?.currentWeek ??
        database?.calendar?.week ??
        1,
        1
    );
}

function integrationGetAge(database) {
    const player = integrationGetPlayer(database);

    return integrationNumber(
        player?.age ??
        database?.life?.age ??
        18,
        18
    );
}

/* ============================================================
   ESTADO
   ============================================================ */

function createEmptyLifeIntegrationState() {
    return {
        version: LIFE_INTEGRATION_VERSION,

        status: LIFE_SYNC_STATUS.IDLE,

        initialized: false,

        lastProcessed: {
            week: null,
            month: null,
            year: null
        },

        processing: {
            week: false,
            month: false,
            year: false
        },

        counters: {
            weeklyProcesses: 0,
            monthlyProcesses: 0,
            yearlyProcesses: 0,
            synchronizations: 0,
            snapshots: 0,
            historyRecords: 0,
            errors: 0
        },

        snapshots: [],

        logs: [],

        modules: {},

        lastError: null,

        initializedAt: null,
        lastUpdatedAt: null
    };
}

function ensureLifeIntegrationState(database) {
    if (!database) {
        return null;
    }

    if (!database.life) {
        database.life = {};
    }

    if (!database.life.integration) {
        database.life.integration =
            createEmptyLifeIntegrationState();
    }

    const state =
        database.life.integration;

    if (!state.lastProcessed) {
        state.lastProcessed = {
            week: null,
            month: null,
            year: null
        };
    }

    if (!state.processing) {
        state.processing = {
            week: false,
            month: false,
            year: false
        };
    }

    if (!state.counters) {
        state.counters = {
            weeklyProcesses: 0,
            monthlyProcesses: 0,
            yearlyProcesses: 0,
            synchronizations: 0,
            snapshots: 0,
            historyRecords: 0,
            errors: 0
        };
    }

    if (!Array.isArray(state.snapshots)) {
        state.snapshots = [];
    }

    if (!Array.isArray(state.logs)) {
        state.logs = [];
    }

    if (!state.modules) {
        state.modules = {};
    }

    return state;
}

/* ============================================================
   LOG
   ============================================================ */

function integrationLog(
    database,
    message,
    data = {},
    level = "info"
) {
    const state =
        ensureLifeIntegrationState(database);

    const log = {
        id: integrationId("life_log"),
        level,
        message: integrationText(
            message,
            "Life integration"
        ),
        date: integrationGetDate(database),
        year: integrationGetYear(database),
        week: integrationGetWeek(database),
        age: integrationGetAge(database),
        data: integrationClone(data),
        createdAt: new Date().toISOString()
    };

    state.logs.push(log);

    if (state.logs.length > 500) {
        state.logs =
            state.logs.slice(-500);
    }

    state.lastUpdatedAt =
        log.createdAt;

    return log;
}

/* ============================================================
   API REGISTRY
   ============================================================ */

function createEmptyApiRegistry() {
    return {
        relationships: null,
        marriage: null,
        children: null,
        family: null,
        education: null,
        employment: null,
        residence: null,
        vehicles: null,
        lifestyle: null,
        lifeEngine: null,
        lifeEvents: null,
        lifeHistory: null
    };
}

function normalizeApiRegistry(apis = {}) {
    const registry =
        createEmptyApiRegistry();

    for (const moduleName of LIFE_MODULES) {
        if (
            apis &&
            apis[moduleName]
        ) {
            registry[moduleName] =
                apis[moduleName];
        }
    }

    return registry;
}

/* ============================================================
   EXECUÇÃO SEGURA DE API
   ============================================================ */

function callModuleMethod(
    api,
    methodNames,
    database,
    args = []
) {
    if (!api) {
        return {
            success: false,
            skipped: true,
            reason: "API não disponível."
        };
    }

    const methods = Array.isArray(methodNames)
        ? methodNames
        : [methodNames];

    for (const methodName of methods) {
        if (
            typeof api[methodName] ===
            "function"
        ) {
            try {
                const result =
                    api[methodName](
                        database,
                        ...args
                    );

                return {
                    success: true,
                    skipped: false,
                    method: methodName,
                    result
                };
            } catch (error) {
                return {
                    success: false,
                    skipped: false,
                    method: methodName,
                    error:
                        error?.message ||
                        String(error)
                };
            }
        }
    }

    return {
        success: false,
        skipped: true,
        reason:
            "Nenhum método compatível encontrado."
    };
}

/* ============================================================
   REGISTRO DE MÓDULOS
   ============================================================ */

function registerModule(
    database,
    moduleName,
    api = null
) {
    const state =
        ensureLifeIntegrationState(database);

    if (!LIFE_MODULES.includes(moduleName)) {
        return false;
    }

    state.modules[moduleName] = {
        registered: Boolean(api),
        methods:
            api
                ? Object.keys(api).filter(
                    key =>
                        typeof api[key] ===
                        "function"
                )
                : [],
        registeredAt:
            new Date().toISOString()
    };

    return true;
}

function registerModules(
    database,
    apis = {}
) {
    const registry =
        normalizeApiRegistry(apis);

    for (const moduleName of LIFE_MODULES) {
        registerModule(
            database,
            moduleName,
            registry[moduleName]
        );
    }

    return integrationClone(
        ensureLifeIntegrationState(
            database
        ).modules
    );
}

/* ============================================================
   SINCRONIZAÇÃO DO PLAYER
   ============================================================ */

function synchronizePlayer(database) {
    if (!database) {
        return null;
    }

    const player =
        integrationGetPlayer(database);

    if (!player) {
        return null;
    }

    if (!database.life) {
        database.life = {};
    }

    database.life.playerId =
        player.id ||
        database.life.playerId ||
        null;

    database.life.age =
        integrationNumber(
            player.age,
            database.life.age || 18
        );

    database.life.name =
        player.name ||
        player.fullName ||
        database.life.name ||
        null;

    database.life.gender =
        player.gender ||
        database.life.gender ||
        null;

    database.life.countryId =
        player.countryId ||
        database.life.countryId ||
        null;

    database.life.cityId =
        player.cityId ||
        database.life.cityId ||
        null;

    return {
        playerId: database.life.playerId,
        age: database.life.age,
        name: database.life.name,
        gender: database.life.gender,
        countryId: database.life.countryId,
        cityId: database.life.cityId
    };
}

/* ============================================================
   SINCRONIZAÇÃO DA IDADE
   ============================================================ */

function synchronizeAge(database) {
    const player =
        integrationGetPlayer(database);

    if (!player) {
        return null;
    }

    const age =
        integrationNumber(
            player.age,
            database?.life?.age || 18
        );

    player.age = age;

    if (!database.life) {
        database.life = {};
    }

    database.life.age = age;

    return age;
}

/* ============================================================
   SINCRONIZAÇÃO DA FAMÍLIA
   ============================================================ */

function synchronizeFamily(database) {
    if (!database.life) {
        database.life = {};
    }

    if (!database.life.family) {
        database.life.family = {
            parents: [],
            siblings: [],
            children: []
        };
    }

    if (!Array.isArray(
        database.life.family.parents
    )) {
        database.life.family.parents = [];
    }

    if (!Array.isArray(
        database.life.family.siblings
    )) {
        database.life.family.siblings = [];
    }

    if (!Array.isArray(
        database.life.family.children
    )) {
        database.life.family.children = [];
    }

    if (
        Array.isArray(
            database.life.children
        )
    ) {
        database.life.family.children =
            database.life.children;
    }

    return integrationClone(
        database.life.family
    );
}

/* ============================================================
   SINCRONIZAÇÃO FINANCEIRA
   ============================================================ */

function synchronizeMoney(database) {
    if (!database.business) {
        database.business = {};
    }

    if (!database.business.finances) {
        database.business.finances = {};
    }

    const finances =
        database.business.finances;

    if (
        finances.cash === undefined
    ) {
        finances.cash =
            integrationNumber(
                database.business.cash,
                0
            );
    }

    if (
        finances.careerEarnings ===
        undefined
    ) {
        finances.careerEarnings = 0;
    }

    if (
        finances.expenses ===
        undefined
    ) {
        finances.expenses = 0;
    }

    return {
        cash:
            integrationNumber(
                finances.cash,
                0
            ),
        careerEarnings:
            integrationNumber(
                finances.careerEarnings,
                0
            ),
        expenses:
            integrationNumber(
                finances.expenses,
                0
            )
    };
}

/* ============================================================
   SINCRONIZAÇÃO DE CARREIRA
   ============================================================ */

function synchronizeCareer(database) {
    if (!database.career) {
        database.career = {};
    }

    const player =
        integrationGetPlayer(database);

    if (
        player &&
        player.careerStage
    ) {
        database.career.stage =
            player.careerStage;
    }

    if (
        player &&
        player.professional &&
        typeof player.professional ===
        "object"
    ) {
        database.career.professional =
            Boolean(
                player.professional.active
            );
    }

    if (
        database.career.stage ===
        undefined
    ) {
        database.career.stage =
            "Amateur";
    }

    return {
        stage:
            database.career.stage,
        professional:
            Boolean(
                database.career.professional
            )
    };
}

/* ============================================================
   SINCRONIZAÇÃO DE RESIDÊNCIA
   ============================================================ */

function synchronizeResidence(database) {
    if (!database.life) {
        database.life = {};
    }

    if (!database.life.residence) {
        database.life.residence = {
            current: null,
            history: []
        };
    }

    if (
        !Array.isArray(
            database.life.residence.history
        )
    ) {
        database.life.residence.history = [];
    }

    return integrationClone(
        database.life.residence
    );
}

/* ============================================================
   SINCRONIZAÇÃO COMPLETA
   ============================================================ */

function synchronizeLife(
    database,
    apis = {}
) {
    const state =
        ensureLifeIntegrationState(database);

    const registry =
        normalizeApiRegistry(apis);

    state.status =
        LIFE_SYNC_STATUS.RUNNING;

    const result = {
        success: true,
        date:
            integrationGetDate(database),
        year:
            integrationGetYear(database),
        week:
            integrationGetWeek(database),
        age:
            integrationGetAge(database),

        player: null,
        ageSync: null,
        family: null,
        money: null,
        career: null,
        residence: null,

        modules: {},

        errors: []
    };

    try {
        if (
            LIFE_INTEGRATION_CONFIG.synchronizePlayer
        ) {
            result.player =
                synchronizePlayer(
                    database
                );
        }

        if (
            LIFE_INTEGRATION_CONFIG.synchronizeAge
        ) {
            result.ageSync =
                synchronizeAge(
                    database
                );
        }

        if (
            LIFE_INTEGRATION_CONFIG.synchronizeFamily
        ) {
            result.family =
                synchronizeFamily(
                    database
                );
        }

        if (
            LIFE_INTEGRATION_CONFIG.synchronizeMoney
        ) {
            result.money =
                synchronizeMoney(
                    database
                );
        }

        if (
            LIFE_INTEGRATION_CONFIG.synchronizeCareer
        ) {
            result.career =
                synchronizeCareer(
                    database
                );
        }

        if (
            LIFE_INTEGRATION_CONFIG.synchronizeResidence
        ) {
            result.residence =
                synchronizeResidence(
                    database
                );
        }

        for (const moduleName of LIFE_MODULES) {
            if (
                !registry[moduleName]
            ) {
                result.modules[moduleName] = {
                    success: false,
                    skipped: true
                };

                continue;
            }

            registerModule(
                database,
                moduleName,
                registry[moduleName]
            );

            result.modules[moduleName] = {
                success: true,
                registered: true
            };
        }

        state.counters.synchronizations++;

        state.status =
            LIFE_SYNC_STATUS.COMPLETE;

        integrationLog(
            database,
            "Vida sincronizada.",
            {
                modules:
                    Object.keys(
                        result.modules
                    ).length
            }
        );
    } catch (error) {
        result.success = false;

        result.errors.push(
            error?.message ||
            String(error)
        );

        state.counters.errors++;

        state.lastError =
            error?.message ||
            String(error);

        state.status =
            LIFE_SYNC_STATUS.ERROR;

        integrationLog(
            database,
            "Erro durante sincronização da vida.",
            {
                error:
                    error?.message ||
                    String(error)
            },
            "error"
        );
    }

    return result;
}

/* ============================================================
   HISTÓRICO
   ============================================================ */

function recordIntegrationHistory(
    database,
    apis,
    entry
) {
    if (
        !LIFE_INTEGRATION_CONFIG.automaticHistory
    ) {
        return null;
    }

    const historyAPI =
        apis?.lifeHistory;

    if (!historyAPI) {
        return null;
    }

    const result =
        callModuleMethod(
            historyAPI,
            [
                "add",
                "addHistoryEntry"
            ],
            database,
            [entry]
        );

    if (result.success) {
        const state =
            ensureLifeIntegrationState(
                database
            );

        state.counters.historyRecords++;
    }

    return result;
}

/* ============================================================
   SNAPSHOT DA VIDA
   ============================================================ */

function createLifeSnapshot(
    database,
    reason = "manual"
) {
    if (!database) {
        return null;
    }

    const state =
        ensureLifeIntegrationState(database);

    const player =
        integrationGetPlayer(database);

    const snapshot = {
        id:
            integrationId("life_snapshot"),

        reason,

        date:
            integrationGetDate(database),

        year:
            integrationGetYear(database),

        week:
            integrationGetWeek(database),

        age:
            integrationGetAge(database),

        player: integrationClone(
            player
        ),

        life: integrationClone(
            database.life || {}
        ),

        career: integrationClone(
            database.career || {}
        ),

        health: integrationClone(
            database.health || {}
        ),

        training: integrationClone(
            database.training || {}
        ),

        business: integrationClone(
            database.business || {}
        ),

        media: integrationClone(
            database.media || {}
        ),

        dynasty: integrationClone(
            database.dynasty || {}
        ),

        createdAt:
            new Date().toISOString()
    };

    state.snapshots.push(snapshot);

    if (
        state.snapshots.length >
        LIFE_INTEGRATION_CONFIG.maxSnapshots
    ) {
        state.snapshots =
            state.snapshots.slice(
                -LIFE_INTEGRATION_CONFIG.maxSnapshots
            );
    }

    state.counters.snapshots++;

    state.lastUpdatedAt =
        snapshot.createdAt;

    return integrationClone(
        snapshot
    );
}

function getLifeSnapshots(
    database,
    limit = 20
) {
    const state =
        ensureLifeIntegrationState(
            database
        );

    return integrationClone(
        state.snapshots
            .slice(-limit)
            .reverse()
    );
}

function getLatestLifeSnapshot(
    database
) {
    const snapshots =
        getLifeSnapshots(
            database,
            1
        );

    return snapshots.length
        ? snapshots[0]
        : null;
}

/* ============================================================
   DUPLICIDADE DE PROCESSAMENTO
   ============================================================ */

function getCycleKey(
    database,
    cycle
) {
    const year =
        integrationGetYear(database);

    if (cycle === LIFE_CYCLE.WEEK) {
        return `${year}-W${integrationGetWeek(database)}`;
    }

    if (cycle === LIFE_CYCLE.MONTH) {
        const month =
            database?.calendar?.month ??
            database?.meta?.currentMonth ??
            1;

        return `${year}-M${month}`;
    }

    if (cycle === LIFE_CYCLE.YEAR) {
        return String(year);
    }

    return `${year}`;
}

function wasCycleProcessed(
    database,
    cycle
) {
    const state =
        ensureLifeIntegrationState(
            database
        );

    const key =
        getCycleKey(
            database,
            cycle
        );

    return (
        state.lastProcessed[cycle] ===
        key
    );
}

function markCycleProcessed(
    database,
    cycle
) {
    const state =
        ensureLifeIntegrationState(
            database
        );

    state.lastProcessed[cycle] =
        getCycleKey(
            database,
            cycle
        );
}

/* ============================================================
   PROCESSAMENTO SEMANAL
   ============================================================ */

function processLifeWeek(
    database,
    apis = {}
) {
    const state =
        ensureLifeIntegrationState(
            database
        );

    if (
        !LIFE_INTEGRATION_CONFIG.weeklyEnabled
    ) {
        return {
            success: false,
            skipped: true,
            reason: "Processamento semanal desativado."
        };
    }

    if (
        LIFE_INTEGRATION_CONFIG.preventDuplicateProcessing &&
        wasCycleProcessed(
            database,
            LIFE_CYCLE.WEEK
        )
    ) {
        return {
            success: false,
            skipped: true,
            duplicate: true,
            reason:
                "Esta semana já foi processada."
        };
    }

    if (state.processing.week) {
        return {
            success: false,
            skipped: true,
            reason:
                "Processamento semanal já está em andamento."
        };
    }

    state.processing.week = true;
    state.status =
        LIFE_SYNC_STATUS.RUNNING;

    const result = {
        success: true,
        cycle: LIFE_CYCLE.WEEK,
        modules: {},
        errors: []
    };

    try {
        const calls = [
            {
                enabled:
                    LIFE_INTEGRATION_CONFIG.processRelationships,
                name: "relationships",
                methods: [
                    "processWeek",
                    "processWeekly",
                    "weeklyProcess"
                ]
            },
            {
                enabled:
                    LIFE_INTEGRATION_CONFIG.processMarriage,
                name: "marriage",
                methods: [
                    "processWeek",
                    "processWeekly",
                    "weeklyProcess"
                ]
            },
            {
                enabled:
                    LIFE_INTEGRATION_CONFIG.processChildren,
                name: "children",
                methods: [
                    "processWeek",
                    "processWeekly",
                    "weeklyProcess"
                ]
            },
            {
                enabled:
                    LIFE_INTEGRATION_CONFIG.processFamily,
                name: "family",
                methods: [
                    "processWeek",
                    "processWeekly",
                    "weeklyProcess"
                ]
            },
            {
                enabled:
                    LIFE_INTEGRATION_CONFIG.processEvents,
                name: "lifeEvents",
                methods: [
                    "processWeekly",
                    "processWeek"
                ]
            }
        ];

        for (const item of calls) {
            if (!item.enabled) {
                continue;
            }

            result.modules[item.name] =
                callModuleMethod(
                    apis[item.name],
                    item.methods,
                    database
                );
        }

        synchronizeLife(
            database,
            apis
        );

        markCycleProcessed(
            database,
            LIFE_CYCLE.WEEK
        );

        state.counters.weeklyProcesses++;

        state.status =
            LIFE_SYNC_STATUS.COMPLETE;

        integrationLog(
            database,
            "Ciclo semanal da vida processado."
        );
    } catch (error) {
        result.success = false;

        result.errors.push(
            error?.message ||
            String(error)
        );

        state.counters.errors++;

        state.lastError =
            error?.message ||
            String(error);

        state.status =
            LIFE_SYNC_STATUS.ERROR;
    } finally {
        state.processing.week = false;
    }

    return result;
}

/* ============================================================
   PROCESSAMENTO MENSAL
   ============================================================ */

function processLifeMonth(
    database,
    apis = {}
) {
    const state =
        ensureLifeIntegrationState(
            database
        );

    if (
        !LIFE_INTEGRATION_CONFIG.monthlyEnabled
    ) {
        return {
            success: false,
            skipped: true,
            reason: "Processamento mensal desativado."
        };
    }

    if (
        LIFE_INTEGRATION_CONFIG.preventDuplicateProcessing &&
        wasCycleProcessed(
            database,
            LIFE_CYCLE.MONTH
        )
    ) {
        return {
            success: false,
            skipped: true,
            duplicate: true,
            reason:
                "Este mês já foi processado."
        };
    }

    if (state.processing.month) {
        return {
            success: false,
            skipped: true,
            reason:
                "Processamento mensal já está em andamento."
        };
    }

    state.processing.month = true;
    state.status =
        LIFE_SYNC_STATUS.RUNNING;

    const result = {
        success: true,
        cycle: LIFE_CYCLE.MONTH,
        modules: {},
        errors: []
    };

    try {
        const calls = [
            {
                enabled:
                    LIFE_INTEGRATION_CONFIG.processEducation,
                name: "education",
                methods: [
                    "processMonth",
                    "processMonthly",
                    "monthlyProcess"
                ]
            },
            {
                enabled:
                    LIFE_INTEGRATION_CONFIG.processEmployment,
                name: "employment",
                methods: [
                    "processMonth",
                    "processMonthly",
                    "monthlyProcess"
                ]
            },
            {
                enabled:
                    LIFE_INTEGRATION_CONFIG.processResidence,
                name: "residence",
                methods: [
                    "processMonth",
                    "processMonthly",
                    "monthlyProcess"
                ]
            },
            {
                enabled:
                    LIFE_INTEGRATION_CONFIG.processVehicles,
                name: "vehicles",
                methods: [
                    "processMonth",
                    "processMonthly",
                    "monthlyProcess"
                ]
            },
            {
                enabled:
                    LIFE_INTEGRATION_CONFIG.processLifestyle,
                name: "lifestyle",
                methods: [
                    "processMonth",
                    "processMonthly",
                    "monthlyProcess"
                ]
            },
            {
                enabled:
                    LIFE_INTEGRATION_CONFIG.processEvents,
                name: "lifeEvents",
                methods: [
                    "processMonth",
                    "processMonthly",
                    "monthlyProcess"
                ]
            }
        ];

        for (const item of calls) {
            if (!item.enabled) {
                continue;
            }

            result.modules[item.name] =
                callModuleMethod(
                    apis[item.name],
                    item.methods,
                    database
                );
        }

        synchronizeLife(
            database,
            apis
        );

        if (
            LIFE_INTEGRATION_CONFIG.automaticSnapshots
        ) {
            createLifeSnapshot(
                database,
                "monthly"
            );
        }

        markCycleProcessed(
            database,
            LIFE_CYCLE.MONTH
        );

        state.counters.monthlyProcesses++;

        state.status =
            LIFE_SYNC_STATUS.COMPLETE;

        integrationLog(
            database,
            "Ciclo mensal da vida processado."
        );
    } catch (error) {
        result.success = false;

        result.errors.push(
            error?.message ||
            String(error)
        );

        state.counters.errors++;

        state.lastError =
            error?.message ||
            String(error);

        state.status =
            LIFE_SYNC_STATUS.ERROR;
    } finally {
        state.processing.month = false;
    }

    return result;
}

/* ============================================================
   PROCESSAMENTO ANUAL
   ============================================================ */

function processLifeYear(
    database,
    apis = {}
) {
    const state =
        ensureLifeIntegrationState(
            database
        );

    if (
        !LIFE_INTEGRATION_CONFIG.yearlyEnabled
    ) {
        return {
            success: false,
            skipped: true,
            reason: "Processamento anual desativado."
        };
    }

    if (
        LIFE_INTEGRATION_CONFIG.preventDuplicateProcessing &&
        wasCycleProcessed(
            database,
            LIFE_CYCLE.YEAR
        )
    ) {
        return {
            success: false,
            skipped: true,
            duplicate: true,
            reason:
                "Este ano já foi processado."
        };
    }

    if (state.processing.year) {
        return {
            success: false,
            skipped: true,
            reason:
                "Processamento anual já está em andamento."
        };
    }

    state.processing.year = true;
    state.status =
        LIFE_SYNC_STATUS.RUNNING;

    const result = {
        success: true,
        cycle: LIFE_CYCLE.YEAR,
        modules: {},
        errors: []
    };

    try {
        const calls = [
            {
                name: "education",
                methods: [
                    "processYear",
                    "processYearly",
                    "yearlyProcess"
                ]
            },
            {
                name: "employment",
                methods: [
                    "processYear",
                    "processYearly",
                    "yearlyProcess"
                ]
            },
            {
                name: "residence",
                methods: [
                    "processYear",
                    "processYearly",
                    "yearlyProcess"
                ]
            },
            {
                name: "vehicles",
                methods: [
                    "processYear",
                    "processYearly",
                    "yearlyProcess"
                ]
            },
            {
                name: "lifestyle",
                methods: [
                    "processYear",
                    "processYearly",
                    "yearlyProcess"
                ]
            },
            {
                name: "lifeEvents",
                methods: [
                    "processYear",
                    "processYearly",
                    "yearlyProcess"
                ]
            }
        ];

        for (const item of calls) {
            result.modules[item.name] =
                callModuleMethod(
                    apis[item.name],
                    item.methods,
                    database
                );
        }

        synchronizeAge(
            database
        );

        synchronizeFamily(
            database
        );

        synchronizeMoney(
            database
        );

        synchronizeCareer(
            database
        );

        synchronizeResidence(
            database
        );

        const lifeEngineResult =
            callModuleMethod(
                apis.lifeEngine,
                [
                    "processLifeYear",
                    "processYear",
                    "processYearly"
                ],
                database
            );

        result.modules.lifeEngine =
            lifeEngineResult;

        if (
            LIFE_INTEGRATION_CONFIG.automaticSnapshots
        ) {
            createLifeSnapshot(
                database,
                "yearly"
            );
        }

        markCycleProcessed(
            database,
            LIFE_CYCLE.YEAR
        );

        state.counters.yearlyProcesses++;

        state.status =
            LIFE_SYNC_STATUS.COMPLETE;

        integrationLog(
            database,
            "Ciclo anual da vida processado."
        );
    } catch (error) {
        result.success = false;

        result.errors.push(
            error?.message ||
            String(error)
        );

        state.counters.errors++;

        state.lastError =
            error?.message ||
            String(error);

        state.status =
            LIFE_SYNC_STATUS.ERROR;
    } finally {
        state.processing.year = false;
    }

    return result;
}

/* ============================================================
   PROCESSAMENTO AUTOMÁTICO
   ============================================================ */

function processLifeCycle(
    database,
    cycle,
    apis = {}
) {
    switch (cycle) {
        case LIFE_CYCLE.WEEK:
            return processLifeWeek(
                database,
                apis
            );

        case LIFE_CYCLE.MONTH:
            return processLifeMonth(
                database,
                apis
            );

        case LIFE_CYCLE.YEAR:
            return processLifeYear(
                database,
                apis
            );

        default:
            return {
                success: false,
                error:
                    `Ciclo desconhecido: ${cycle}`
            };
    }
}

/* ============================================================
   REGISTRO DE EVENTOS ENTRE MÓDULOS
   ============================================================ */

function notifyLifeEvent(
    database,
    apis,
    event
) {
    const result = {
        success: true,
        eventId:
            event?.id ||
            null,
        history: null,
        eventSystem: null
    };

    if (
        LIFE_INTEGRATION_CONFIG.automaticHistory
    ) {
        result.history =
            recordIntegrationHistory(
                database,
                apis,
                {
                    category:
                        event.category ||
                        "life",

                    type:
                        event.type ||
                        "custom",

                    title:
                        event.title ||
                        "Acontecimento da vida",

                    description:
                        event.description ||
                        event.text ||
                        "",

                    importance:
                        event.importance ||
                        3,

                    date:
                        event.date ||
                        integrationGetDate(database),

                    year:
                        event.year ||
                        integrationGetYear(database),

                    week:
                        event.week ||
                        integrationGetWeek(database),

                    age:
                        event.age ??
                        integrationGetAge(database),

                    tags:
                        event.tags || [],

                    metadata:
                        event.metadata || {},

                    eventId:
                        event.id || null,

                    source:
                        "lifeIntegration"
                }
            );
    }

    if (apis.lifeEvents) {
        result.eventSystem =
            callModuleMethod(
                apis.lifeEvents,
                [
                    "record",
                    "addHistory",
                    "registerHistory"
                ],
                database,
                [event]
            );
    }

    return result;
}

/* ============================================================
   INTEGRAÇÃO DE FAMÍLIA
   ============================================================ */

function syncFamilyModule(
    database,
    apis = {}
) {
    const familyAPI =
        apis.family;

    if (!familyAPI) {
        return {
            success: false,
            skipped: true
        };
    }

    const result =
        callModuleMethod(
            familyAPI,
            [
                "syncChildren",
                "sync",
                "synchronize",
                "update"
            ],
            database
        );

    if (!result.success) {
        synchronizeFamily(
            database
        );
    }

    return result;
}

/* ============================================================
   INTEGRAÇÃO DE FILHOS
   ============================================================ */

function syncChildrenModule(
    database,
    apis = {}
) {
    const childrenAPI =
        apis.children;

    if (!childrenAPI) {
        return {
            success: false,
            skipped: true
        };
    }

    const result =
        callModuleMethod(
            childrenAPI,
            [
                "processYear",
                "ageChildren",
                "growChildren",
                "updateChildren"
            ],
            database
        );

    syncFamilyModule(
        database,
        apis
    );

    return result;
}

/* ============================================================
   INTEGRAÇÃO DE RELACIONAMENTOS
   ============================================================ */

function syncRelationshipsModule(
    database,
    apis = {}
) {
    const relationshipsAPI =
        apis.relationships;

    if (!relationshipsAPI) {
        return {
            success: false,
            skipped: true
        };
    }

    return callModuleMethod(
        relationshipsAPI,
        [
            "processWeek",
            "processWeekly",
            "decay",
            "update"
        ],
        database
    );
}

/* ============================================================
   INTEGRAÇÃO DE CASAMENTO
   ============================================================ */

function syncMarriageModule(
    database,
    apis = {}
) {
    const marriageAPI =
        apis.marriage;

    if (!marriageAPI) {
        return {
            success: false,
            skipped: true
        };
    }

    return callModuleMethod(
        marriageAPI,
        [
            "processWeek",
            "processWeekly",
            "update"
        ],
        database
    );
}

/* ============================================================
   INTEGRAÇÃO DE CARREIRA
   ============================================================ */

function syncCareerModule(
    database,
    apis = {}
) {
    const careerData =
        synchronizeCareer(
            database
        );

    const result = {
        success: true,
        career: careerData
    };

    if (apis.lifeHistory) {
        const history =
            callModuleMethod(
                apis.lifeHistory,
                [
                    "add",
                    "recordCareer"
                ],
                database,
                [{
                    category: "career",
                    type: "custom",
                    title:
                        "Atualização de carreira",
                    description:
                        `Estágio atual: ${careerData.stage}.`,
                    importance: 2,
                    source:
                        "lifeIntegration"
                }]
            );

        result.history = history;
    }

    return result;
}

/* ============================================================
   INTEGRAÇÃO FINANCEIRA
   ============================================================ */

function syncFinanceModule(
    database,
    apis = {}
) {
    const finances =
        synchronizeMoney(
            database
        );

    return {
        success: true,
        finances
    };
}

/* ============================================================
   INTEGRAÇÃO COMPLETA DOS MÓDULOS
   ============================================================ */

function runFullLifeIntegration(
    database,
    apis = {}
) {
    const result = {
        success: true,

        synchronization: null,

        family: null,
        children: null,
        relationships: null,
        marriage: null,
        career: null,
        finance: null,

        snapshot: null,

        errors: []
    };

    try {
        result.synchronization =
            synchronizeLife(
                database,
                apis
            );

        result.family =
            syncFamilyModule(
                database,
                apis
            );

        result.children =
            syncChildrenModule(
                database,
                apis
            );

        result.relationships =
            syncRelationshipsModule(
                database,
                apis
            );

        result.marriage =
            syncMarriageModule(
                database,
                apis
            );

        result.career =
            syncCareerModule(
                database,
                apis
            );

        result.finance =
            syncFinanceModule(
                database,
                apis
            );

        if (
            LIFE_INTEGRATION_CONFIG.automaticSnapshots
        ) {
            result.snapshot =
                createLifeSnapshot(
                    database,
                    "integration"
                );
        }
    } catch (error) {
        result.success = false;

        result.errors.push(
            error?.message ||
            String(error)
        );

        const state =
            ensureLifeIntegrationState(
                database
            );

        state.counters.errors++;

        state.lastError =
            error?.message ||
            String(error);
    }

    return result;
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

function initializeLifeIntegration(
    database,
    apis = {}
) {
    const state =
        ensureLifeIntegrationState(
            database
        );

    state.initialized = true;

    state.initializedAt =
        state.initializedAt ||
        new Date().toISOString();

    state.lastUpdatedAt =
        new Date().toISOString();

    registerModules(
        database,
        apis
    );

    synchronizeLife(
        database,
        apis
    );

    integrationLog(
        database,
        "Life Integration inicializado."
    );

    return state;
}

/* ============================================================
   RESET
   ============================================================ */

function resetLifeIntegration(
    database
) {
    if (!database) {
        return null;
    }

    if (!database.life) {
        database.life = {};
    }

    database.life.integration =
        createEmptyLifeIntegrationState();

    return database.life.integration;
}

/* ============================================================
   CONFIGURAÇÃO
   ============================================================ */

function getLifeIntegrationConfig() {
    return integrationClone(
        LIFE_INTEGRATION_CONFIG
    );
}

function getLifeIntegrationState(
    database
) {
    return integrationClone(
        ensureLifeIntegrationState(
            database
        )
    );
}

/* ============================================================
   DIAGNÓSTICO
   ============================================================ */

function validateLifeIntegration(
    database
) {
    const state =
        ensureLifeIntegrationState(
            database
        );

    const errors = [];
    const warnings = [];

    if (!database) {
        errors.push(
            "Database não existe."
        );

        return {
            valid: false,
            errors,
            warnings
        };
    }

    if (!database.life) {
        warnings.push(
            "database.life ainda não existe."
        );
    }

    if (!database.player) {
        warnings.push(
            "Player ainda não foi criado."
        );
    }

    for (const moduleName of LIFE_MODULES) {
        if (
            !state.modules[moduleName]
        ) {
            warnings.push(
                `Módulo não registrado: ${moduleName}`
            );
        }
    }

    if (
        state.status ===
        LIFE_SYNC_STATUS.ERROR
    ) {
        warnings.push(
            "A última sincronização apresentou erro."
        );
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,

        initialized:
            state.initialized,

        status:
            state.status,

        modules:
            integrationClone(
                state.modules
            ),

        counters:
            integrationClone(
                state.counters
            ),

        lastError:
            state.lastError
    };
}

/* ============================================================
   RESUMO
   ============================================================ */

function getLifeIntegrationSummary(
    database
) {
    const state =
        ensureLifeIntegrationState(
            database
        );

    const player =
        integrationGetPlayer(database);

    return {
        version:
            LIFE_INTEGRATION_VERSION,

        status:
            state.status,

        initialized:
            state.initialized,

        player: {
            id:
                player?.id || null,

            name:
                player?.name ||
                player?.fullName ||
                null,

            age:
                integrationGetAge(
                    database
                )
        },

        date:
            integrationGetDate(
                database
            ),

        year:
            integrationGetYear(
                database
            ),

        week:
            integrationGetWeek(
                database
            ),

        modules:
            Object.keys(
                state.modules
            ).filter(
                key =>
                    state.modules[key]
                        ?.registered
            ),

        counters:
            integrationClone(
                state.counters
            ),

        snapshots:
            state.snapshots.length,

        logs:
            state.logs.length,

        lastError:
            state.lastError
    };
}

/* ============================================================
   API
   ============================================================ */

const lifeIntegrationAPI = {
    version:
        LIFE_INTEGRATION_VERSION,

    modules:
        LIFE_MODULES,

    cycle:
        LIFE_CYCLE,

    status:
        LIFE_SYNC_STATUS,

    config:
        LIFE_INTEGRATION_CONFIG,

    createEmptyState:
        createEmptyLifeIntegrationState,

    ensureState:
        ensureLifeIntegrationState,

    initialize:
        initializeLifeIntegration,

    reset:
        resetLifeIntegration,

    registerModule,

    registerModules,

    synchronize:
        synchronizeLife,

    synchronizePlayer,

    synchronizeAge,

    synchronizeFamily,

    synchronizeMoney,

    synchronizeCareer,

    synchronizeResidence,

    processWeek:
        processLifeWeek,

    processMonth:
        processLifeMonth,

    processYear:
        processLifeYear,

    processCycle:
        processLifeCycle,

    runFull:
        runFullLifeIntegration,

    notifyEvent:
        notifyLifeEvent,

    syncFamily:
        syncFamilyModule,

    syncChildren:
        syncChildrenModule,

    syncRelationships:
        syncRelationshipsModule,

    syncMarriage:
        syncMarriageModule,

    syncCareer:
        syncCareerModule,

    syncFinance:
        syncFinanceModule,

    createSnapshot:
        createLifeSnapshot,

    getSnapshots:
        getLifeSnapshots,

    getLatestSnapshot:
        getLatestLifeSnapshot,

    getState:
        getLifeIntegrationState,

    getConfig:
        getLifeIntegrationConfig,

    getSummary:
        getLifeIntegrationSummary,

    validate:
        validateLifeIntegration,

    log:
        integrationLog
};

/* ============================================================
   EXPORTS
   ============================================================ */

export {
    LIFE_INTEGRATION_VERSION,

    LIFE_MODULES,
    LIFE_CYCLE,
    LIFE_SYNC_STATUS,
    LIFE_INTEGRATION_CONFIG,

    createEmptyLifeIntegrationState,
    ensureLifeIntegrationState,

    registerModule,
    registerModules,

    synchronizeLife,
    synchronizePlayer,
    synchronizeAge,
    synchronizeFamily,
    synchronizeMoney,
    synchronizeCareer,
    synchronizeResidence,

    processLifeWeek,
    processLifeMonth,
    processLifeYear,
    processLifeCycle,

    notifyLifeEvent,

    syncFamilyModule,
    syncChildrenModule,
    syncRelationshipsModule,
    syncMarriageModule,
    syncCareerModule,
    syncFinanceModule,

    runFullLifeIntegration,

    createLifeSnapshot,
    getLifeSnapshots,
    getLatestLifeSnapshot,

    initializeLifeIntegration,
    resetLifeIntegration,

    getLifeIntegrationState,
    getLifeIntegrationConfig,
    getLifeIntegrationSummary,

    validateLifeIntegration,

    integrationLog,

    lifeIntegrationAPI
};

export default lifeIntegrationAPI;
