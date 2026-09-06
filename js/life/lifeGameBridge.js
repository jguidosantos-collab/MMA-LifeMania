/*
============================================================
MMA LIFE DYNASTY
LIFE GAME BRIDGE
============================================================

Responsabilidade:
- Conectar o CORE do jogo ao sistema LIFE.
- Receber database/state do jogo.
- Sincronizar o LIFE com o estado atual.
- Processar semanas, meses e anos.
- Encaminhar eventos do jogo para o LIFE.
- Integrar save/load.
- Evitar processamento duplicado.
- Não iniciar automaticamente.
- Não substituir o CORE.
- Não controlar o calendário principal.

IMPORTANTE:
Este arquivo é uma ponte.
O CORE continua sendo o dono do tempo do jogo.
============================================================
*/

const LIFE_GAME_BRIDGE_VERSION = 1;

/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const DEFAULT_CONFIG = {
    enabled: true,

    automaticSync: true,

    automaticHistory: true,

    automaticSnapshots: true,

    processLifeOnWeek: true,

    processLifeOnMonth: true,

    processLifeOnYear: true,

    preventDuplicateCycles: true,

    maxSnapshots: 24,

    maxLogs: 200,

    maxErrors: 50
};

/* =========================================================
   ESTADO
========================================================= */

let bridgeState = {
    initialized: false,

    connected: false,

    database: null,

    config: {
        ...DEFAULT_CONFIG
    },

    lastWeekKey: null,

    lastMonthKey: null,

    lastYearKey: null,

    lastProcessedCycle: null,

    lastProcessedAt: null,

    processCount: {
        week: 0,
        month: 0,
        year: 0
    },

    snapshots: [],

    logs: [],

    errors: [],

    warnings: []
};

/* =========================================================
   UTILITÁRIOS
========================================================= */

function clone(value) {
    if (
        value === undefined ||
        value === null
    ) {
        return value;
    }

    try {
        return JSON.parse(
            JSON.stringify(value)
        );
    } catch {
        return value;
    }
}

function isObject(value) {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );
}

function ensureObject(
    parent,
    key,
    fallback = {}
) {
    if (
        !parent[key] ||
        !isObject(parent[key])
    ) {
        parent[key] = fallback;
    }

    return parent[key];
}

function safeNumber(
    value,
    fallback = 0
) {
    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}

function safeString(
    value,
    fallback = ""
) {
    if (
        value === undefined ||
        value === null
    ) {
        return fallback;
    }

    return String(value);
}

function generateId(
    prefix = "life_bridge"
) {
    return (
        prefix +
        "_" +
        Date.now().toString(36) +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 8)
    );
}

/* =========================================================
   CONFIGURAÇÃO
========================================================= */

function configure(
    options = {}
) {
    bridgeState.config = {
        ...bridgeState.config,

        ...options
    };

    if (
        safeNumber(
            bridgeState.config.maxSnapshots,
            24
        ) < 1
    ) {
        bridgeState.config.maxSnapshots = 24;
    }

    if (
        safeNumber(
            bridgeState.config.maxLogs,
            200
        ) < 10
    ) {
        bridgeState.config.maxLogs = 200;
    }

    if (
        safeNumber(
            bridgeState.config.maxErrors,
            50
        ) < 5
    ) {
        bridgeState.config.maxErrors = 50;
    }

    return getConfig();
}

function getConfig() {
    return {
        ...bridgeState.config
    };
}

/* =========================================================
   DATABASE
========================================================= */

function setDatabase(
    database
) {
    if (
        !database ||
        !isObject(database)
    ) {
        bridgeState.database = null;
        bridgeState.connected = false;

        return false;
    }

    bridgeState.database =
        database;

    bridgeState.connected = true;

    prepareDatabase();

    return true;
}

function getDatabase() {
    return bridgeState.database;
}

/* =========================================================
   PREPARAR DATABASE
========================================================= */

function prepareDatabase() {
    const database =
        bridgeState.database;

    if (!database) {
        return null;
    }

    const life =
        ensureObject(
            database,
            "life",
            {}
        );

    const bridge =
        ensureObject(
            life,
            "gameBridge",
            {}
        );

    if (
        !bridge.version
    ) {
        bridge.version =
            LIFE_GAME_BRIDGE_VERSION;
    }

    if (
        !bridge.createdAt
    ) {
        bridge.createdAt =
            Date.now();
    }

    if (
        !Array.isArray(
            bridge.snapshots
        )
    ) {
        bridge.snapshots = [];
    }

    if (
        !Array.isArray(
            bridge.logs
        )
    ) {
        bridge.logs = [];
    }

    if (
        !Array.isArray(
            bridge.errors
        )
    ) {
        bridge.errors = [];
    }

    if (
        !bridge.processCount ||
        !isObject(
            bridge.processCount
        )
    ) {
        bridge.processCount = {
            week: 0,
            month: 0,
            year: 0
        };
    }

    bridge.config = {
        ...DEFAULT_CONFIG,

        ...(bridge.config || {})
    };

    return bridge;
}

/* =========================================================
   LIFECYCLE
========================================================= */

function initialize(
    database = null,
    options = {}
) {
    if (database) {
        setDatabase(
            database
        );
    }

    if (
        !bridgeState.database
    ) {
        return {
            success: false,

            initialized: false,

            error:
                "Nenhum database foi fornecido ao LIFE Game Bridge."
        };
    }

    configure(options);

    prepareDatabase();

    bridgeState.initialized = true;

    bridgeState.warnings = [];

    bridgeState.errors = [];

    syncFromDatabase();

    log(
        "initialize",
        "LIFE Game Bridge inicializado."
    );

    return {
        success: true,

        initialized: true,

        state: getState()
    };
}

function initializeIfNeeded() {
    if (
        bridgeState.initialized
    ) {
        return true;
    }

    if (
        bridgeState.database
    ) {
        return initialize();
    }

    return false;
}

/* =========================================================
   LOG
========================================================= */

function log(
    type,
    message,
    data = null
) {
    const entry = {
        id: generateId("bridge_log"),

        type,

        message,

        data:
            data === null
                ? null
                : clone(data),

        timestamp:
            Date.now()
    };

    bridgeState.logs.push(
        entry
    );

    const maxLogs =
        safeNumber(
            bridgeState.config.maxLogs,
            200
        );

    if (
        bridgeState.logs.length >
        maxLogs
    ) {
        bridgeState.logs =
            bridgeState.logs.slice(
                -maxLogs
            );
    }

    const bridge =
        prepareDatabase();

    if (bridge) {
        bridge.logs.push(
            clone(entry)
        );

        if (
            bridge.logs.length >
            maxLogs
        ) {
            bridge.logs =
                bridge.logs.slice(
                    -maxLogs
                );
        }
    }

    return entry;
}

function addError(
    message,
    data = null
) {
    const error = {
        id: generateId(
            "bridge_error"
        ),

        message,

        data:
            data === null
                ? null
                : clone(data),

        timestamp:
            Date.now()
    };

    bridgeState.errors.push(
        error
    );

    const maxErrors =
        safeNumber(
            bridgeState.config.maxErrors,
            50
        );

    if (
        bridgeState.errors.length >
        maxErrors
    ) {
        bridgeState.errors =
            bridgeState.errors.slice(
                -maxErrors
            );
    }

    const bridge =
        prepareDatabase();

    if (bridge) {
        bridge.errors.push(
            clone(error)
        );

        if (
            bridge.errors.length >
            maxErrors
        ) {
            bridge.errors =
                bridge.errors.slice(
                    -maxErrors
                );
        }
    }

    return error;
}

function addWarning(
    message,
    data = null
) {
    const warning = {
        id: generateId(
            "bridge_warning"
        ),

        message,

        data:
            data === null
                ? null
                : clone(data),

        timestamp:
            Date.now()
    };

    bridgeState.warnings.push(
        warning
    );

    if (
        bridgeState.warnings.length >
        50
    ) {
        bridgeState.warnings =
            bridgeState.warnings.slice(
                -50
            );
    }

    return warning;
}

/* =========================================================
   CAMINHO SEGURO
========================================================= */

function getPath(
    object,
    path,
    fallback = undefined
) {
    if (
        !object ||
        !path
    ) {
        return fallback;
    }

    const parts =
        String(path)
            .split(".")
            .filter(Boolean);

    let current =
        object;

    for (
        const part of parts
    ) {
        if (
            current === null ||
            current === undefined ||
            !(part in current)
        ) {
            return fallback;
        }

        current =
            current[part];
    }

    return current;
}

function setPath(
    object,
    path,
    value
) {
    if (
        !object ||
        !path
    ) {
        return false;
    }

    const parts =
        String(path)
            .split(".")
            .filter(Boolean);

    if (
        parts.length === 0
    ) {
        return false;
    }

    let current =
        object;

    for (
        let index = 0;
        index < parts.length - 1;
        index++
    ) {
        const part =
            parts[index];

        if (
            !current[part] ||
            !isObject(
                current[part]
            )
        ) {
            current[part] = {};
        }

        current =
            current[part];
    }

    current[
        parts[parts.length - 1]
    ] = value;

    return true;
}

/* =========================================================
   API GLOBAL DOS MÓDULOS
========================================================= */

function getGlobalAPI(
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

/* =========================================================
   SINCRONIZAÇÃO DO ESTADO
========================================================= */

function syncFromDatabase() {
    const database =
        bridgeState.database;

    if (!database) {
        return {
            success: false,

            reason:
                "database_unavailable"
        };
    }

    prepareDatabase();

    const bridge =
        getPath(
            database,
            "life.gameBridge",
            {}
        );

    bridgeState.lastWeekKey =
        bridge.lastWeekKey ??
        null;

    bridgeState.lastMonthKey =
        bridge.lastMonthKey ??
        null;

    bridgeState.lastYearKey =
        bridge.lastYearKey ??
        null;

    bridgeState.lastProcessedCycle =
        bridge.lastProcessedCycle ??
        null;

    bridgeState.lastProcessedAt =
        bridge.lastProcessedAt ??
        null;

    bridgeState.processCount = {
        week:
            safeNumber(
                bridge.processCount?.week,
                0
            ),

        month:
            safeNumber(
                bridge.processCount?.month,
                0
            ),

        year:
            safeNumber(
                bridge.processCount?.year,
                0
            )
    };

    return {
        success: true,

        state: getState()
    };
}

function syncToDatabase() {
    const database =
        bridgeState.database;

    if (!database) {
        return {
            success: false,

            reason:
                "database_unavailable"
        };
    }

    const bridge =
        prepareDatabase();

    bridge.lastWeekKey =
        bridgeState.lastWeekKey;

    bridge.lastMonthKey =
        bridgeState.lastMonthKey;

    bridge.lastYearKey =
        bridgeState.lastYearKey;

    bridge.lastProcessedCycle =
        bridgeState.lastProcessedCycle;

    bridge.lastProcessedAt =
        bridgeState.lastProcessedAt;

    bridge.processCount =
        clone(
            bridgeState.processCount
        );

    return {
        success: true
    };
}

/* =========================================================
   INFORMAÇÕES DO CALENDÁRIO
========================================================= */

function getCalendarData(
    options = {}
) {
    const database =
        bridgeState.database;

    const calendar =
        options.calendar ||
        getPath(
            database,
            "calendar",
            {}
        );

    const meta =
        getPath(
            database,
            "meta",
            {}
        );

    const date =
        options.date ??
        calendar.date ??
        calendar.currentDate ??
        meta.currentDate ??
        null;

    const week =
        options.week ??
        calendar.week ??
        calendar.currentWeek ??
        meta.currentWeek ??
        1;

    const month =
        options.month ??
        calendar.month ??
        calendar.currentMonth ??
        1;

    const year =
        options.year ??
        calendar.year ??
        calendar.currentYear ??
        meta.currentYear ??
        1;

    return {
        date,

        week:
            safeNumber(
                week,
                1
            ),

        month:
            safeNumber(
                month,
                1
            ),

        year:
            safeNumber(
                year,
                1
            )
    };
}

/* =========================================================
   CHAVES DE CICLO
========================================================= */

function getWeekKey(
    data
) {
    return (
        safeString(
            data.year,
            "1"
        ) +
        ":W" +
        safeString(
            data.week,
            "1"
        )
    );
}

function getMonthKey(
    data
) {
    return (
        safeString(
            data.year,
            "1"
        ) +
        ":M" +
        safeString(
            data.month,
            "1"
        )
    );
}

function getYearKey(
    data
) {
    return safeString(
        data.year,
        "1"
    );
}

/* =========================================================
   DUPLICIDADE
========================================================= */

function hasProcessedWeek(
    key
) {
    return (
        bridgeState.lastWeekKey ===
        key
    );
}

function hasProcessedMonth(
    key
) {
    return (
        bridgeState.lastMonthKey ===
        key
    );
}

function hasProcessedYear(
    key
) {
    return (
        bridgeState.lastYearKey ===
        key
    );
}

/* =========================================================
   SNAPSHOT
========================================================= */

function createSnapshot(
    type,
    options = {}
) {
    if (
        !bridgeState.database
    ) {
        return null;
    }

    const database =
        bridgeState.database;

    const snapshot = {
        id: generateId(
            "life_snapshot"
        ),

        type,

        createdAt:
            Date.now(),

        cycle:
            getCalendarData(
                options
            ),

        player:
            clone(
                getPath(
                    database,
                    "player",
                    null
                )
            ),

        career:
            clone(
                getPath(
                    database,
                    "career",
                    null
                )
            ),

        life:
            clone(
                getPath(
                    database,
                    "life",
                    null
                )
            ),

        business:
            clone(
                getPath(
                    database,
                    "business",
                    null
                )
            ),

        media:
            clone(
                getPath(
                    database,
                    "media",
                    null
                )
            ),

        dynasty:
            clone(
                getPath(
                    database,
                    "dynasty",
                    null
                )
            )
    };

    bridgeState.snapshots.push(
        snapshot
    );

    const maxSnapshots =
        safeNumber(
            bridgeState.config.maxSnapshots,
            24
        );

    if (
        bridgeState.snapshots.length >
        maxSnapshots
    ) {
        bridgeState.snapshots =
            bridgeState.snapshots.slice(
                -maxSnapshots
            );
    }

    const bridge =
        prepareDatabase();

    if (bridge) {
        bridge.snapshots.push(
            clone(snapshot)
        );

        if (
            bridge.snapshots.length >
            maxSnapshots
        ) {
            bridge.snapshots =
                bridge.snapshots.slice(
                    -maxSnapshots
                );
        }
    }

    return snapshot;
}

function getSnapshots(
    limit = null
) {
    const list =
        bridgeState.snapshots;

    if (
        limit === null ||
        limit === undefined
    ) {
        return clone(list);
    }

    const amount =
        Math.max(
            0,
            safeNumber(
                limit,
                0
            )
        );

    if (
        amount === 0
    ) {
        return [];
    }

    return clone(
        list.slice(
            -amount
        )
    );
}

function getLatestSnapshot() {
    if (
        bridgeState.snapshots.length ===
        0
    ) {
        return null;
    }

    return clone(
        bridgeState.snapshots[
            bridgeState.snapshots.length - 1
        ]
    );
}

/* =========================================================
   PROCESSAMENTO DE UM MÓDULO
========================================================= */

function processLifeModule(
    moduleName,
    methods,
    context
) {
    const api =
        getGlobalAPI(
            moduleName
        );

    if (!api) {
        return {
            success: false,

            skipped: true,

            reason:
                "api_unavailable"
        };
    }

    const methodList =
        Array.isArray(methods)
            ? methods
            : [methods];

    for (
        const method
        of methodList
    ) {
        if (
            typeof api[method] ===
            "function"
        ) {
            try {
                const result =
                    api[method](
                        bridgeState.database,
                        context
                    );

                return {
                    success: true,

                    skipped: false,

                    method,

                    result
                };
            } catch (error) {
                addError(
                    `Erro ao processar ${moduleName}.${method}.`,
                    {
                        error:
                            error?.message ||
                            String(error)
                    }
                );

                return {
                    success: false,

                    skipped: false,

                    method,

                    error
                };
            }
        }
    }

    return {
        success: false,

        skipped: true,

        reason:
            "method_unavailable"
    };
}

/* =========================================================
   PROCESSAMENTO SEMANAL
========================================================= */

function processWeek(
    options = {}
) {
    if (
        !bridgeState.config.enabled
    ) {
        return {
            success: false,

            skipped: true,

            reason:
                "bridge_disabled"
        };
    }

    if (
        !bridgeState.config
            .processLifeOnWeek
    ) {
        return {
            success: true,

            skipped: true,

            reason:
                "weekly_processing_disabled"
        };
    }

    if (
        !bridgeState.database
    ) {
        return {
            success: false,

            reason:
                "database_unavailable"
        };
    }

    initializeIfNeeded();

    const cycle =
        getCalendarData(
            options
        );

    const weekKey =
        getWeekKey(
            cycle
        );

    if (
        bridgeState.config
            .preventDuplicateCycles &&
        hasProcessedWeek(
            weekKey
        )
    ) {
        log(
            "duplicate_week",
            `Semana ${weekKey} já processada.`
        );

        return {
            success: true,

            skipped: true,

            duplicate: true,

            cycle
        };
    }

    if (
        bridgeState.config
            .automaticSnapshots
    ) {
        createSnapshot(
            "week_before",
            options
        );
    }

    const context = {
        type: "week",

        cycle,

        weekKey,

        options
    };

    const results = {};

    /*
    --------------------------------------------------------
    RELACIONAMENTOS
    --------------------------------------------------------
    */

    results.relationships =
        processLifeModule(
            "relationshipsAPI",
            [
                "processWeek",
                "processWeekly",
                "updateWeek"
            ],
            context
        );

    /*
    --------------------------------------------------------
    CASAMENTO
    --------------------------------------------------------
    */

    results.marriage =
        processLifeModule(
            "marriageAPI",
            [
                "processWeek",
                "processWeekly",
                "updateWeek"
            ],
            context
        );

    /*
    --------------------------------------------------------
    FILHOS
    --------------------------------------------------------
    */

    results.children =
        processLifeModule(
            "childrenAPI",
            [
                "processWeek",
                "processWeekly",
                "updateWeek"
            ],
            context
        );

    /*
    --------------------------------------------------------
    EVENTOS
    --------------------------------------------------------
    */

    results.events =
        processLifeModule(
            "lifeEventsAPI",
            [
                "processWeek",
                "processWeekly"
            ],
            context
        );

    /*
    --------------------------------------------------------
    MILESTONES
    --------------------------------------------------------
    */

    results.milestones =
        processLifeModule(
            "lifeMilestonesAPI",
            [
                "processWeek",
                "processWeekly"
            ],
            context
        );

    /*
    --------------------------------------------------------
    INTEGRAÇÃO
    --------------------------------------------------------
    */

    results.integration =
        processLifeModule(
            "lifeIntegrationAPI",
            [
                "processLifeWeek",
                "processWeek"
            ],
            context
        );

    bridgeState.lastWeekKey =
        weekKey;

    bridgeState.lastProcessedCycle = {
        type: "week",

        ...cycle,

        key: weekKey
    };

    bridgeState.lastProcessedAt =
        Date.now();

    bridgeState.processCount.week +=
        1;

    syncToDatabase();

    if (
        bridgeState.config
            .automaticSnapshots
    ) {
        createSnapshot(
            "week_after",
            options
        );
    }

    log(
        "process_week",
        `Semana ${weekKey} processada.`,
        {
            cycle,
            results
        }
    );

    return {
        success: true,

        skipped: false,

        cycle,

        key: weekKey,

        results
    };
}

/* =========================================================
   PROCESSAMENTO MENSAL
========================================================= */

function processMonth(
    options = {}
) {
    if (
        !bridgeState.config.enabled
    ) {
        return {
            success: false,

            skipped: true,

            reason:
                "bridge_disabled"
        };
    }

    if (
        !bridgeState.config
            .processLifeOnMonth
    ) {
        return {
            success: true,

            skipped: true,

            reason:
                "monthly_processing_disabled"
        };
    }

    if (
        !bridgeState.database
    ) {
        return {
            success: false,

            reason:
                "database_unavailable"
        };
    }

    initializeIfNeeded();

    const cycle =
        getCalendarData(
            options
        );

    const monthKey =
        getMonthKey(
            cycle
        );

    if (
        bridgeState.config
            .preventDuplicateCycles &&
        hasProcessedMonth(
            monthKey
        )
    ) {
        log(
            "duplicate_month",
            `Mês ${monthKey} já processado.`
        );

        return {
            success: true,

            skipped: true,

            duplicate: true,

            cycle
        };
    }

    if (
        bridgeState.config
            .automaticSnapshots
    ) {
        createSnapshot(
            "month_before",
            options
        );
    }

    const context = {
        type: "month",

        cycle,

        monthKey,

        options
    };

    const results = {};

    /*
    --------------------------------------------------------
    EDUCAÇÃO
    --------------------------------------------------------
    */

    results.education =
        processLifeModule(
            "educationAPI",
            [
                "processMonth",
                "processMonthly"
            ],
            context
        );

    /*
    --------------------------------------------------------
    EMPREGO
    --------------------------------------------------------
    */

    results.employment =
        processLifeModule(
            "employmentAPI",
            [
                "processMonth",
                "processMonthly"
            ],
            context
        );

    /*
    --------------------------------------------------------
    RESIDÊNCIA
    --------------------------------------------------------
    */

    results.residence =
        processLifeModule(
            "residenceAPI",
            [
                "processMonth",
                "processMonthly"
            ],
            context
        );

    /*
    --------------------------------------------------------
    VEÍCULOS
    --------------------------------------------------------
    */

    results.vehicles =
        processLifeModule(
            "vehiclesAPI",
            [
                "processMonth",
                "processMonthly"
            ],
            context
        );

    /*
    --------------------------------------------------------
    ESTILO DE VIDA
    --------------------------------------------------------
    */

    results.lifestyle =
        processLifeModule(
            "lifestyleAPI",
            [
                "processMonth",
                "processMonthly"
            ],
            context
        );

    /*
    --------------------------------------------------------
    LIFE ENGINE
    --------------------------------------------------------
    */

    results.engine =
        processLifeModule(
            "lifeEngineAPI",
            [
                "processLifeMonth",
                "processMonth"
            ],
            context
        );

    /*
    --------------------------------------------------------
    EVENTS
    --------------------------------------------------------
    */

    results.events =
        processLifeModule(
            "lifeEventsAPI",
            [
                "processMonth",
                "processMonthly"
            ],
            context
        );

    /*
    --------------------------------------------------------
    MILESTONES
    --------------------------------------------------------
    */

    results.milestones =
        processLifeModule(
            "lifeMilestonesAPI",
            [
                "processMonth",
                "processMonthly"
            ],
            context
        );

    /*
    --------------------------------------------------------
    INTEGRATION
    --------------------------------------------------------
    */

    results.integration =
        processLifeModule(
            "lifeIntegrationAPI",
            [
                "processLifeMonth",
                "processMonth"
            ],
            context
        );

    bridgeState.lastMonthKey =
        monthKey;

    bridgeState.lastProcessedCycle = {
        type: "month",

        ...cycle,

        key: monthKey
    };

    bridgeState.lastProcessedAt =
        Date.now();

    bridgeState.processCount.month +=
        1;

    syncToDatabase();

    if (
        bridgeState.config
            .automaticSnapshots
    ) {
        createSnapshot(
            "month_after",
            options
        );
    }

    log(
        "process_month",
        `Mês ${monthKey} processado.`,
        {
            cycle,
            results
        }
    );

    return {
        success: true,

        skipped: false,

        cycle,

        key: monthKey,

        results
    };
}

/* =========================================================
   PROCESSAMENTO ANUAL
========================================================= */

function processYear(
    options = {}
) {
    if (
        !bridgeState.config.enabled
    ) {
        return {
            success: false,

            skipped: true,

            reason:
                "bridge_disabled"
        };
    }

    if (
        !bridgeState.config
            .processLifeOnYear
    ) {
        return {
            success: true,

            skipped: true,

            reason:
                "yearly_processing_disabled"
        };
    }

    if (
        !bridgeState.database
    ) {
        return {
            success: false,

            reason:
                "database_unavailable"
        };
    }

    initializeIfNeeded();

    const cycle =
        getCalendarData(
            options
        );

    const yearKey =
        getYearKey(
            cycle
        );

    if (
        bridgeState.config
            .preventDuplicateCycles &&
        hasProcessedYear(
            yearKey
        )
    ) {
        log(
            "duplicate_year",
            `Ano ${yearKey} já processado.`
        );

        return {
            success: true,

            skipped: true,

            duplicate: true,

            cycle
        };
    }

    if (
        bridgeState.config
            .automaticSnapshots
    ) {
        createSnapshot(
            "year_before",
            options
        );
    }

    const context = {
        type: "year",

        cycle,

        yearKey,

        options
    };

    const results = {};

    /*
    --------------------------------------------------------
    FAMILY
    --------------------------------------------------------
    */

    results.family =
        processLifeModule(
            "familyAPI",
            [
                "processYear",
                "processYearly",
                "updateYear"
            ],
            context
        );

    /*
    --------------------------------------------------------
    CHILDREN
    --------------------------------------------------------
    */

    results.children =
        processLifeModule(
            "childrenAPI",
            [
                "processYear",
                "processYearly",
                "ageChildren"
            ],
            context
        );

    /*
    --------------------------------------------------------
    EDUCATION
    --------------------------------------------------------
    */

    results.education =
        processLifeModule(
            "educationAPI",
            [
                "processYear",
                "processYearly"
            ],
            context
        );

    /*
    --------------------------------------------------------
    EMPLOYMENT
    --------------------------------------------------------
    */

    results.employment =
        processLifeModule(
            "employmentAPI",
            [
                "processYear",
                "processYearly"
            ],
            context
        );

    /*
    --------------------------------------------------------
    RESIDENCE
    --------------------------------------------------------
    */

    results.residence =
        processLifeModule(
            "residenceAPI",
            [
                "processYear",
                "processYearly"
            ],
            context
        );

    /*
    --------------------------------------------------------
    VEÍCULOS
    --------------------------------------------------------
    */

    results.vehicles =
        processLifeModule(
            "vehiclesAPI",
            [
                "processYear",
                "processYearly"
            ],
            context
        );

    /*
    --------------------------------------------------------
    ESTILO DE VIDA
    --------------------------------------------------------
    */

    results.lifestyle =
        processLifeModule(
            "lifestyleAPI",
            [
                "processYear",
                "processYearly"
            ],
            context
        );

    /*
    --------------------------------------------------------
    LIFE ENGINE
    --------------------------------------------------------
    */

    results.engine =
        processLifeModule(
            "lifeEngineAPI",
            [
                "processLifeYear",
                "processYear"
            ],
            context
        );

    /*
    --------------------------------------------------------
    EVENTOS
    --------------------------------------------------------
    */

    results.events =
        processLifeModule(
            "lifeEventsAPI",
            [
                "processYear",
                "processYearly"
            ],
            context
        );

    /*
    --------------------------------------------------------
    MILESTONES
    --------------------------------------------------------
    */

    results.milestones =
        processLifeModule(
            "lifeMilestonesAPI",
            [
                "processYear",
                "processYearly"
            ],
            context
        );

    /*
    --------------------------------------------------------
    INTEGRAÇÃO
    --------------------------------------------------------
    */

    results.integration =
        processLifeModule(
            "lifeIntegrationAPI",
            [
                "processLifeYear",
                "processYear"
            ],
            context
        );

    bridgeState.lastYearKey =
        yearKey;

    bridgeState.lastProcessedCycle = {
        type: "year",

        ...cycle,

        key: yearKey
    };

    bridgeState.lastProcessedAt =
        Date.now();

    bridgeState.processCount.year +=
        1;

    syncToDatabase();

    if (
        bridgeState.config
            .automaticSnapshots
    ) {
        createSnapshot(
            "year_after",
            options
        );
    }

    log(
        "process_year",
        `Ano ${yearKey} processado.`,
        {
            cycle,
            results
        }
    );

    return {
        success: true,

        skipped: false,

        cycle,

        key: yearKey,

        results
    };
}

/* =========================================================
   PROCESSAMENTO GENÉRICO
========================================================= */

function processCycle(
    type,
    options = {}
) {
    const normalized =
        safeString(
            type
        )
            .toLowerCase()
            .trim();

    switch (
        normalized
    ) {
        case "week":
        case "weekly":
        case "semana":
        case "semanal":
            return processWeek(
                options
            );

        case "month":
        case "monthly":
        case "mes":
        case "mês":
        case "mensal":
            return processMonth(
                options
            );

        case "year":
        case "yearly":
        case "ano":
        case "anual":
            return processYear(
                options
            );

        default:
            return {
                success: false,

                reason:
                    "unknown_cycle",

                type
            };
    }
}

/* =========================================================
   EVENTOS DO JOGO
========================================================= */

function onGameEvent(
    event,
    options = {}
) {
    if (
        !bridgeState.database
    ) {
        return {
            success: false,

            reason:
                "database_unavailable"
        };
    }

    if (
        !event
    ) {
        return {
            success: false,

            reason:
                "event_unavailable"
        };
    }

    const normalizedEvent =
        isObject(event)
            ? clone(event)
            : {
                  type:
                      safeString(
                          event
                      )
              };

    const type =
        safeString(
            normalizedEvent.type ||
            normalizedEvent.eventType ||
            normalizedEvent.name ||
            "custom"
        );

    const context = {
        ...normalizedEvent,

        type,

        options,

        timestamp:
            Date.now()
    };

    /*
    --------------------------------------------------------
    LIFE EVENTS
    --------------------------------------------------------
    */

    const lifeEvents =
        getGlobalAPI(
            "lifeEventsAPI"
        );

    let lifeEventResult =
        null;

    if (
        lifeEvents
    ) {
        try {
            if (
                typeof lifeEvents.recordGameEvent ===
                "function"
            ) {
                lifeEventResult =
                    lifeEvents.recordGameEvent(
                        bridgeState.database,
                        context
                    );
            } else if (
                typeof lifeEvents.recordEvent ===
                "function"
            ) {
                lifeEventResult =
                    lifeEvents.recordEvent(
                        bridgeState.database,
                        context
                    );
            } else if (
                typeof lifeEvents.createCustomEvent ===
                "function"
            ) {
                lifeEventResult =
                    lifeEvents.createCustomEvent(
                        bridgeState.database,
                        context
                    );
            }
        } catch (error) {
            addError(
                "Falha ao encaminhar evento para lifeEventsAPI.",
                {
                    event: context,
                    error:
                        error?.message ||
                        String(error)
                }
            );
        }
    }

    /*
    --------------------------------------------------------
    LIFE HISTORY
    --------------------------------------------------------
    */

    let historyResult =
        null;

    if (
        bridgeState.config
            .automaticHistory
    ) {
        const history =
            getGlobalAPI(
                "lifeHistoryAPI"
            );

        if (
            history
        ) {
            try {
                if (
                    typeof history.recordEvent ===
                    "function"
                ) {
                    historyResult =
                        history.recordEvent(
                            bridgeState.database,
                            context
                        );
                }
            } catch (error) {
                addError(
                    "Falha ao registrar evento no histórico LIFE.",
                    {
                        event: context,
                        error:
                            error?.message ||
                            String(error)
                    }
                );
            }
        }
    }

    log(
        "game_event",
        `Evento do jogo recebido: ${type}.`,
        context
    );

    return {
        success: true,

        event: context,

        lifeEvent:
            lifeEventResult,

        history:
            historyResult
    };
}

/* =========================================================
   EVENTOS ESPECÍFICOS
========================================================= */

function onFight(
    fight,
    options = {}
) {
    return onGameEvent(
        {
            type: "fight",

            category: "mma",

            ...clone(fight)
        },
        options
    );
}

function onContract(
    contract,
    options = {}
) {
    return onGameEvent(
        {
            type: "contract",

            category: "career",

            ...clone(contract)
        },
        options
    );
}

function onTitle(
    title,
    options = {}
) {
    return onGameEvent(
        {
            type: "title",

            category: "career",

            ...clone(title)
        },
        options
    );
}

function onMarriage(
    marriage,
    options = {}
) {
    return onGameEvent(
        {
            type: "marriage",

            category: "relationship",

            ...clone(marriage)
        },
        options
    );
}

function onChildBirth(
    child,
    options = {}
) {
    return onGameEvent(
        {
            type: "child_birth",

            category: "family",

            ...clone(child)
        },
        options
    );
}

function onDeath(
    death,
    options = {}
) {
    return onGameEvent(
        {
            type: "death",

            category: "life",

            ...clone(death)
        },
        options
    );
}

/* =========================================================
   SAVE
========================================================= */

function onSave(
    options = {}
) {
    if (
        !bridgeState.database
    ) {
        return {
            success: false,

            reason:
                "database_unavailable"
        };
    }

    syncToDatabase();

    const snapshot =
        options.snapshot === false
            ? null
            : createSnapshot(
                  "save",
                  options
              );

    log(
        "save",
        "Estado LIFE preparado para salvamento."
    );

    return {
        success: true,

        snapshot
    };
}

/* =========================================================
   LOAD
========================================================= */

function onLoad(
    database,
    options = {}
) {
    if (
        database
    ) {
        setDatabase(
            database
        );
    }

    if (
        !bridgeState.database
    ) {
        return {
            success: false,

            reason:
                "database_unavailable"
        };
    }

    prepareDatabase();

    syncFromDatabase();

    /*
    --------------------------------------------------------
    Depois do load, não assumimos que o último ciclo
    deve ser processado novamente.
    --------------------------------------------------------
    */

    if (
        options.clearRuntimeLogs
    ) {
        bridgeState.logs = [];
        bridgeState.errors = [];
        bridgeState.warnings = [];
    }

    log(
        "load",
        "Estado LIFE carregado pelo Game Bridge."
    );

    return {
        success: true,

        state:
            getState()
    };
}

/* =========================================================
   SINCRONIZAÇÃO MANUAL
========================================================= */

function sync(
    options = {}
) {
    if (
        !bridgeState.database
    ) {
        return {
            success: false,

            reason:
                "database_unavailable"
        };
    }

    const result =
        syncFromDatabase();

    if (
        options.createSnapshot
    ) {
        createSnapshot(
            "sync",
            options
        );
    }

    log(
        "sync",
        "Sincronização manual executada."
    );

    return result;
}

/* =========================================================
   ESTADO
========================================================= */

function getState() {
    return {
        version:
            LIFE_GAME_BRIDGE_VERSION,

        initialized:
            bridgeState.initialized,

        connected:
            bridgeState.connected,

        databaseAvailable:
            Boolean(
                bridgeState.database
            ),

        config:
            clone(
                bridgeState.config
            ),

        lastWeekKey:
            bridgeState.lastWeekKey,

        lastMonthKey:
            bridgeState.lastMonthKey,

        lastYearKey:
            bridgeState.lastYearKey,

        lastProcessedCycle:
            clone(
                bridgeState.lastProcessedCycle
            ),

        lastProcessedAt:
            bridgeState.lastProcessedAt,

        processCount:
            clone(
                bridgeState.processCount
            ),

        snapshots:
            bridgeState.snapshots.length,

        logs:
            bridgeState.logs.length,

        errors:
            bridgeState.errors.length,

        warnings:
            bridgeState.warnings.length
    };
}

/* =========================================================
   RESUMO
========================================================= */

function getSummary() {
    const counts =
        bridgeState.processCount;

    const totalCycles =
        counts.week +
        counts.month +
        counts.year;

    return {
        version:
            LIFE_GAME_BRIDGE_VERSION,

        initialized:
            bridgeState.initialized,

        connected:
            bridgeState.connected,

        totalCycles,

        weeks:
            counts.week,

        months:
            counts.month,

        years:
            counts.year,

        snapshots:
            bridgeState.snapshots.length,

        lastProcessed:
            clone(
                bridgeState.lastProcessedCycle
            ),

        errors:
            bridgeState.errors.length,

        warnings:
            bridgeState.warnings.length
    };
}

/* =========================================================
   SNAPSHOT DA PONTE
========================================================= */

function snapshot() {
    return {
        version:
            LIFE_GAME_BRIDGE_VERSION,

        state:
            getState(),

        summary:
            getSummary(),

        latestSnapshot:
            getLatestSnapshot()
    };
}

/* =========================================================
   VALIDAÇÃO
========================================================= */

function validate() {
    const errors = [];
    const warnings = [];

    if (
        !bridgeState.database
    ) {
        errors.push(
            "Database não conectado."
        );
    }

    if (
        !bridgeState.initialized
    ) {
        warnings.push(
            "LIFE Game Bridge ainda não foi inicializado."
        );
    }

    if (
        !bridgeState.connected
    ) {
        warnings.push(
            "Bridge não está conectado ao estado do jogo."
        );
    }

    const requiredLife =
        [
            "lifeEngineAPI",
            "lifeEventsAPI",
            "lifeHistoryAPI",
            "lifeIntegrationAPI"
        ];

    for (
        const apiName
        of requiredLife
    ) {
        if (
            !getGlobalAPI(
                apiName
            )
        ) {
            warnings.push(
                `${apiName} ainda não está disponível globalmente.`
            );
        }
    }

    return {
        valid:
            errors.length === 0,

        errors,

        warnings
    };
}

/* =========================================================
   RESET
========================================================= */

function reset(
    options = {}
) {
    const keepDatabase =
        options.keepDatabase !==
        false;

    bridgeState = {
        initialized: false,

        connected:
            keepDatabase &&
            Boolean(
                bridgeState.database
            ),

        database:
            keepDatabase
                ? bridgeState.database
                : null,

        config: {
            ...DEFAULT_CONFIG
        },

        lastWeekKey: null,

        lastMonthKey: null,

        lastYearKey: null,

        lastProcessedCycle: null,

        lastProcessedAt: null,

        processCount: {
            week: 0,
            month: 0,
            year: 0
        },

        snapshots: [],

        logs: [],

        errors: [],

        warnings: []
    };

    if (
        bridgeState.database
    ) {
        const bridge =
            prepareDatabase();

        if (bridge) {
            bridge.lastWeekKey =
                null;

            bridge.lastMonthKey =
                null;

            bridge.lastYearKey =
                null;

            bridge.lastProcessedCycle =
                null;

            bridge.lastProcessedAt =
                null;

            bridge.processCount = {
                week: 0,
                month: 0,
                year: 0
            };

            bridge.snapshots = [];
            bridge.logs = [];
            bridge.errors = [];
        }
    }

    return getState();
}

/* =========================================================
   API
========================================================= */

const lifeGameBridgeAPI = {
    version:
        LIFE_GAME_BRIDGE_VERSION,

    config:
        DEFAULT_CONFIG,

    /* Database */
    setDatabase,
    getDatabase,
    prepareDatabase,

    /* Lifecycle */
    initialize,
    initializeIfNeeded,

    /* Config */
    configure,
    getConfig,

    /* Sync */
    sync,
    syncFromDatabase,
    syncToDatabase,

    /* Cycles */
    processWeek,
    processMonth,
    processYear,
    processCycle,

    /* Events */
    onGameEvent,
    onFight,
    onContract,
    onTitle,
    onMarriage,
    onChildBirth,
    onDeath,

    /* Save / Load */
    onSave,
    onLoad,

    /* Snapshots */
    createSnapshot,
    getSnapshots,
    getLatestSnapshot,

    /* State */
    getState,
    getSummary,
    snapshot,
    validate,

    /* Reset */
    reset
};

/* =========================================================
   GLOBAL
========================================================= */

if (
    typeof globalThis !==
    "undefined"
) {
    globalThis.lifeGameBridgeAPI =
        lifeGameBridgeAPI;

    globalThis.MMA_LIFE_GAME_BRIDGE =
        lifeGameBridgeAPI;
}

/* =========================================================
   EXPORT
========================================================= */

export {
    LIFE_GAME_BRIDGE_VERSION,

    DEFAULT_CONFIG,

    lifeGameBridgeAPI
};

export default lifeGameBridgeAPI;
