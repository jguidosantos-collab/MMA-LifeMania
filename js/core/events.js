/**
 * ============================================================
 * MMA LIFE DYNASTY
 * CORE — EVENTS
 * ============================================================
 *
 * Responsabilidade:
 * - Criar acontecimentos do jogo.
 * - Registrar eventos históricos.
 * - Processar eventos através de handlers.
 * - Separar "evento" de "calendário".
 *
 * IMPORTANTE:
 * Este módulo NÃO decide regras específicas de MMA.
 * Os módulos de MMA, carreira, vida, negócios etc. poderão
 * registrar seus próprios tipos e handlers futuramente.
 * ============================================================
 */


// ------------------------------------------------------------
// EVENT BUS
// ------------------------------------------------------------

const handlers = new Map();


// ------------------------------------------------------------
// TIPOS BÁSICOS
// ------------------------------------------------------------

export const EVENT_TYPES = Object.freeze({

    // Core
    GAME_STARTED: "game_started",
    WEEK_STARTED: "week_started",
    WEEK_ENDED: "week_ended",
    MONTH_STARTED: "month_started",
    MONTH_ENDED: "month_ended",
    YEAR_STARTED: "year_started",
    YEAR_ENDED: "year_ended",

    // Player
    PLAYER_CREATED: "player_created",
    PLAYER_BIRTHDAY: "player_birthday",
    PLAYER_AGED: "player_aged",

    // MMA
    FIGHT_SCHEDULED: "fight_scheduled",
    FIGHT_STARTED: "fight_started",
    FIGHT_ENDED: "fight_ended",

    // Training
    TRAINING_STARTED: "training_started",
    TRAINING_COMPLETED: "training_completed",
    CAMP_STARTED: "camp_started",
    CAMP_ENDED: "camp_ended",

    // Health
    INJURY_OCCURRED: "injury_occurred",
    INJURY_HEALED: "injury_healed",

    // Career
    CONTRACT_OFFER: "contract_offer",
    CONTRACT_SIGNED: "contract_signed",
    CONTRACT_ENDED: "contract_ended",

    RANKING_CHANGED: "ranking_changed",
    TITLE_WON: "title_won",
    TITLE_LOST: "title_lost",

    // Business
    SPONSOR_SIGNED: "sponsor_signed",
    PAYMENT_RECEIVED: "payment_received",
    EXPENSE_PAID: "expense_paid",

    // Media
    NEWS_CREATED: "news_created",
    INTERVIEW_COMPLETED: "interview_completed",
    FOLLOWERS_CHANGED: "followers_changed",
    FAME_CHANGED: "fame_changed",

    // Life
    RELATIONSHIP_STARTED: "relationship_started",
    RELATIONSHIP_ENDED: "relationship_ended",
    MARRIAGE: "marriage",
    DIVORCE: "divorce",

    CHILD_BORN: "child_born",

    // Dynasty
    RETIREMENT: "retirement",
    DEATH: "death",
    INHERITANCE: "inheritance",

    // World
    WORLD_EVENT: "world_event"
});


// ------------------------------------------------------------
// EVENT ID
// ------------------------------------------------------------

let eventCounter = 0;

export function generateEventId(type = "event") {

    eventCounter++;

    return [
        type,
        Date.now(),
        eventCounter
    ].join("_");
}


// ------------------------------------------------------------
// CRIAR EVENTO
// ------------------------------------------------------------

export function createEvent({
    id = null,
    type,
    date = null,
    title = "",
    description = "",
    source = "system",
    entityId = null,
    data = {},
    importance = 1
} = {}) {

    if (!type) {
        throw new Error(
            "Um tipo de evento é obrigatório."
        );
    }

    return {

        id:
            id ||
            generateEventId(type),

        type,

        date,

        title,

        description,

        source,

        entityId,

        data,

        importance,

        createdAt:
            new Date().toISOString(),

        processed: false,

        processedAt: null
    };
}


// ------------------------------------------------------------
// GARANTIR HISTÓRICO
// ------------------------------------------------------------

function ensureHistory(state) {

    if (!state) {
        throw new Error(
            "Estado do jogo inválido."
        );
    }

    if (!Array.isArray(state.history)) {
        state.history = [];
    }

    return state.history;
}


// ------------------------------------------------------------
// REGISTRAR EVENTO NO HISTÓRICO
// ------------------------------------------------------------

export function recordEvent(
    state,
    event
) {

    const history =
        ensureHistory(state);

    history.push(event);

    return event;
}


// ------------------------------------------------------------
// CRIAR E REGISTRAR EVENTO
// ------------------------------------------------------------

export function emitEvent(
    state,
    eventData
) {

    const event =
        createEvent(eventData);

    recordEvent(
        state,
        event
    );

    return event;
}


// ------------------------------------------------------------
// REGISTRAR HANDLER
// ------------------------------------------------------------

export function onEvent(
    eventType,
    handler
) {

    if (
        typeof handler !== "function"
    ) {
        throw new Error(
            "O handler precisa ser uma função."
        );
    }

    if (!handlers.has(eventType)) {
        handlers.set(
            eventType,
            []
        );
    }

    handlers
        .get(eventType)
        .push(handler);

    return () => {

        const list =
            handlers.get(eventType);

        if (!list) {
            return;
        }

        const index =
            list.indexOf(handler);

        if (index !== -1) {
            list.splice(
                index,
                1
            );
        }
    };
}


// ------------------------------------------------------------
// REMOVER TODOS OS HANDLERS DE UM TIPO
// ------------------------------------------------------------

export function clearEventHandlers(
    eventType
) {

    if (eventType) {

        handlers.delete(
            eventType
        );

        return;
    }

    handlers.clear();
}


// ------------------------------------------------------------
// OBTER HANDLERS
// ------------------------------------------------------------

export function getEventHandlers(
    eventType
) {

    return [
        ...(handlers.get(
            eventType
        ) || [])
    ];
}


// ------------------------------------------------------------
// PROCESSAR EVENTO
// ------------------------------------------------------------

export function processEvent(
    state,
    event
) {

    if (!event) {
        return null;
    }

    const eventHandlers =
        getEventHandlers(
            event.type
        );

    const results = [];

    for (
        const handler
        of eventHandlers
    ) {

        try {

            const result =
                handler(
                    state,
                    event
                );

            results.push({
                success: true,
                result
            });

        } catch (error) {

            results.push({
                success: false,
                error: error.message
            });
        }
    }

    event.processed = true;

    event.processedAt =
        new Date().toISOString();

    return {
        event,
        handlers: results
    };
}


// ------------------------------------------------------------
// PROCESSAR VÁRIOS EVENTOS
// ------------------------------------------------------------

export function processEvents(
    state,
    events = []
) {

    if (!Array.isArray(events)) {
        throw new Error(
            "events precisa ser um array."
        );
    }

    return events.map(
        event =>
            processEvent(
                state,
                event
            )
    );
}


// ------------------------------------------------------------
// PROCESSAR EVENTOS NÃO PROCESSADOS
// ------------------------------------------------------------

export function processPendingEvents(
    state
) {

    const history =
        ensureHistory(state);

    const pending =
        history.filter(
            event =>
                !event.processed
        );

    return processEvents(
        state,
        pending
    );
}


// ------------------------------------------------------------
// BUSCAR HISTÓRICO POR TIPO
// ------------------------------------------------------------

export function getHistoryByType(
    state,
    type
) {

    const history =
        ensureHistory(state);

    return history.filter(
        event =>
            event.type === type
    );
}


// ------------------------------------------------------------
// BUSCAR HISTÓRICO POR ENTIDADE
// ------------------------------------------------------------

export function getHistoryByEntity(
    state,
    entityId
) {

    const history =
        ensureHistory(state);

    return history.filter(
        event =>
            event.entityId === entityId
    );
}


// ------------------------------------------------------------
// BUSCAR HISTÓRICO POR DATA
// ------------------------------------------------------------

export function getHistoryByDate(
    state,
    date
) {

    const history =
        ensureHistory(state);

    return history.filter(
        event =>
            event.date === date
    );
}


// ------------------------------------------------------------
// BUSCAR EVENTOS ENTRE DATAS
// ------------------------------------------------------------

export function getHistoryBetweenDates(
    state,
    startDate,
    endDate
) {

    const history =
        ensureHistory(state);

    return history.filter(
        event =>
            event.date >= startDate &&
            event.date <= endDate
    );
}


// ------------------------------------------------------------
// EVENTOS IMPORTANTES
// ------------------------------------------------------------

export function getImportantEvents(
    state,
    minimumImportance = 3
) {

    const history =
        ensureHistory(state);

    return history.filter(
        event =>
            event.importance >=
            minimumImportance
    );
}


// ------------------------------------------------------------
// ÚLTIMO EVENTO DE UM TIPO
// ------------------------------------------------------------

export function getLatestEvent(
    state,
    type
) {

    const events =
        getHistoryByType(
            state,
            type
        );

    if (!events.length) {
        return null;
    }

    return events[
        events.length - 1
    ];
}


// ------------------------------------------------------------
// ÚLTIMO EVENTO DE UMA ENTIDADE
// ------------------------------------------------------------

export function getLatestEntityEvent(
    state,
    entityId
) {

    const events =
        getHistoryByEntity(
            state,
            entityId
        );

    if (!events.length) {
        return null;
    }

    return events[
        events.length - 1
    ];
}


// ------------------------------------------------------------
// CONTAGEM DE EVENTOS
// ------------------------------------------------------------

export function countEvents(
    state,
    type = null
) {

    const history =
        ensureHistory(state);

    if (!type) {
        return history.length;
    }

    return history.filter(
        event =>
            event.type === type
    ).length;
}


// ------------------------------------------------------------
// LIMPAR HISTÓRICO
// ------------------------------------------------------------

export function trimHistory(
    state,
    maximumEvents = 5000
) {

    const history =
        ensureHistory(state);

    if (
        history.length <=
        maximumEvents
    ) {
        return;
    }

    const removeCount =
        history.length -
        maximumEvents;

    history.splice(
        0,
        removeCount
    );
}


// ------------------------------------------------------------
// SNAPSHOT DO EVENT SYSTEM
// ------------------------------------------------------------

export function createEventSnapshot(
    state
) {

    const history =
        ensureHistory(state);

    return {

        total:
            history.length,

        processed:
            history.filter(
                event =>
                    event.processed
            ).length,

        pending:
            history.filter(
                event =>
                    !event.processed
            ).length,

        important:
            history.filter(
                event =>
                    event.importance >= 3
            ).length
    };
}


// ------------------------------------------------------------
// EXPORT DEFAULT
// ------------------------------------------------------------

export default {

    EVENT_TYPES,

    generateEventId,

    createEvent,

    recordEvent,

    emitEvent,

    onEvent,

    clearEventHandlers,

    getEventHandlers,

    processEvent,

    processEvents,

    processPendingEvents,

    getHistoryByType,

    getHistoryByEntity,

    getHistoryByDate,

    getHistoryBetweenDates,

    getImportantEvents,

    getLatestEvent,

    getLatestEntityEvent,

    countEvents,

    trimHistory,

    createEventSnapshot
};
