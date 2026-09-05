/**
 * ============================================================
 * MMA LIFE DYNASTY
 * CORE — CALENDAR
 * ============================================================
 *
 * Responsabilidade:
 * - Registrar eventos futuros.
 * - Consultar eventos por data.
 * - Consultar eventos da semana.
 * - Remover/cancelar eventos.
 * - Manter a agenda organizada.
 *
 * IMPORTANTE:
 * O Calendar NÃO executa os eventos.
 * Ele apenas registra e entrega os eventos ao Engine.
 * ============================================================
 */


// ------------------------------------------------------------
// TIPOS DE EVENTOS
// ------------------------------------------------------------

export const CALENDAR_EVENT_TYPES = Object.freeze({
    FIGHT: "fight",
    TRAINING: "training",
    CAMP: "camp",
    RECOVERY: "recovery",

    CONTRACT: "contract",
    NEGOTIATION: "negotiation",
    PAYMENT: "payment",

    MEDIA: "media",
    INTERVIEW: "interview",
    NEWS: "news",

    RELATIONSHIP: "relationship",
    FAMILY: "family",
    BIRTHDAY: "birthday",

    INJURY: "injury",
    MEDICAL: "medical",

    TOURNAMENT: "tournament",
    TITLE: "title",

    PROMOTION: "promotion",
    BUSINESS: "business",

    EDUCATION: "education",
    EMPLOYMENT: "employment",

    TRAVEL: "travel",
    OTHER: "other"
});


// ------------------------------------------------------------
// PRIORIDADES
// ------------------------------------------------------------

export const CALENDAR_PRIORITIES = Object.freeze({
    LOW: 1,
    NORMAL: 2,
    HIGH: 3,
    CRITICAL: 4
});


// ------------------------------------------------------------
// GERADOR DE ID
// ------------------------------------------------------------

let eventSequence = 0;

export function generateCalendarEventId(
    type = "event",
    date = "unknown"
) {
    eventSequence++;

    return `${type}_${date}_${Date.now()}_${eventSequence}`;
}


// ------------------------------------------------------------
// GARANTIR ESTRUTURA DO CALENDÁRIO
// ------------------------------------------------------------

function ensureCalendar(state) {
    if (!state) {
        throw new Error("Estado do jogo inválido.");
    }

    if (!state.calendar) {
        state.calendar = {
            events: [],
            completed: [],
            cancelled: []
        };
    }

    if (!Array.isArray(state.calendar.events)) {
        state.calendar.events = [];
    }

    if (!Array.isArray(state.calendar.completed)) {
        state.calendar.completed = [];
    }

    if (!Array.isArray(state.calendar.cancelled)) {
        state.calendar.cancelled = [];
    }

    return state.calendar;
}


// ------------------------------------------------------------
// VALIDAR DATA
// ------------------------------------------------------------

function isValidDateString(date) {
    if (typeof date !== "string") {
        return false;
    }

    const parsed = new Date(`${date}T00:00:00Z`);

    return !Number.isNaN(parsed.getTime());
}


// ------------------------------------------------------------
// CRIAR EVENTO
// ------------------------------------------------------------

export function createCalendarEvent({
    id = null,
    date,
    type = CALENDAR_EVENT_TYPES.OTHER,
    title = "Evento",
    description = "",
    priority = CALENDAR_PRIORITIES.NORMAL,
    data = {},
    recurring = false,
    recurringRule = null
} = {}) {

    if (!isValidDateString(date)) {
        throw new Error(`Data inválida para evento: ${date}`);
    }

    if (!type) {
        throw new Error("Tipo de evento não informado.");
    }

    const event = {
        id: id || generateCalendarEventId(type, date),

        date,

        type,

        title,

        description,

        priority,

        data,

        recurring,

        recurringRule,

        status: "scheduled",

        createdAt: new Date().toISOString(),

        completedAt: null,

        cancelledAt: null
    };

    return event;
}


// ------------------------------------------------------------
// ADICIONAR EVENTO
// ------------------------------------------------------------

export function addCalendarEvent(state, eventData) {
    const calendar = ensureCalendar(state);

    const event =
        eventData?.id
            ? createCalendarEvent(eventData)
            : createCalendarEvent(eventData);

    const existing = calendar.events.find(
        item => item.id === event.id
    );

    if (existing) {
        throw new Error(
            `Evento já existente: ${event.id}`
        );
    }

    calendar.events.push(event);

    sortCalendarEvents(state);

    return event;
}


// ------------------------------------------------------------
// ADICIONAR VÁRIOS EVENTOS
// ------------------------------------------------------------

export function addCalendarEvents(state, events = []) {
    if (!Array.isArray(events)) {
        throw new Error("events precisa ser um array.");
    }

    const added = [];

    for (const eventData of events) {
        added.push(
            addCalendarEvent(state, eventData)
        );
    }

    return added;
}


// ------------------------------------------------------------
// ORDENAR CALENDÁRIO
// ------------------------------------------------------------

export function sortCalendarEvents(state) {
    const calendar = ensureCalendar(state);

    calendar.events.sort((a, b) => {

        if (a.date !== b.date) {
            return a.date.localeCompare(b.date);
        }

        return (
            (b.priority || CALENDAR_PRIORITIES.NORMAL) -
            (a.priority || CALENDAR_PRIORITIES.NORMAL)
        );
    });

    return calendar.events;
}


// ------------------------------------------------------------
// BUSCAR EVENTO POR ID
// ------------------------------------------------------------

export function getCalendarEvent(state, eventId) {
    const calendar = ensureCalendar(state);

    return (
        calendar.events.find(
            event => event.id === eventId
        ) || null
    );
}


// ------------------------------------------------------------
// BUSCAR EVENTOS POR DATA
// ------------------------------------------------------------

export function getEventsByDate(state, date) {
    const calendar = ensureCalendar(state);

    return calendar.events.filter(
        event =>
            event.date === date &&
            event.status === "scheduled"
    );
}


// ------------------------------------------------------------
// BUSCAR EVENTOS POR TIPO
// ------------------------------------------------------------

export function getEventsByType(state, type) {
    const calendar = ensureCalendar(state);

    return calendar.events.filter(
        event =>
            event.type === type &&
            event.status === "scheduled"
    );
}


// ------------------------------------------------------------
// EVENTOS ENTRE DUAS DATAS
// ------------------------------------------------------------

export function getEventsBetweenDates(
    state,
    startDate,
    endDate
) {
    const calendar = ensureCalendar(state);

    return calendar.events.filter(event => {

        return (
            event.date >= startDate &&
            event.date <= endDate &&
            event.status === "scheduled"
        );

    });
}


// ------------------------------------------------------------
// EVENTOS DA SEMANA
// ------------------------------------------------------------

export function getEventsForWeek(
    state,
    startDate
) {
    if (!isValidDateString(startDate)) {
        throw new Error(
            `Data inicial inválida: ${startDate}`
        );
    }

    const start = new Date(
        `${startDate}T00:00:00Z`
    );

    const end = new Date(start);

    end.setUTCDate(
        end.getUTCDate() + 6
    );

    const endDate =
        `${end.getUTCFullYear()}-${String(
            end.getUTCMonth() + 1
        ).padStart(2, "0")}-${String(
            end.getUTCDate()
        ).padStart(2, "0")}`;

    return getEventsBetweenDates(
        state,
        startDate,
        endDate
    );
}


// ------------------------------------------------------------
// EVENTOS DO MÊS
// ------------------------------------------------------------

export function getEventsForMonth(
    state,
    year,
    month
) {
    const monthString =
        String(month).padStart(2, "0");

    const startDate =
        `${year}-${monthString}-01`;

    const start = new Date(
        `${startDate}T00:00:00Z`
    );

    const end = new Date(start);

    end.setUTCMonth(
        end.getUTCMonth() + 1
    );

    end.setUTCDate(
        end.getUTCDate() - 1
    );

    const endDate =
        `${end.getUTCFullYear()}-${String(
            end.getUTCMonth() + 1
        ).padStart(2, "0")}-${String(
            end.getUTCDate()
        ).padStart(2, "0")}`;

    return getEventsBetweenDates(
        state,
        startDate,
        endDate
    );
}


// ------------------------------------------------------------
// EVENTOS FUTUROS
// ------------------------------------------------------------

export function getUpcomingEvents(
    state,
    fromDate = null,
    limit = 20
) {
    const calendar = ensureCalendar(state);

    const startDate =
        fromDate ||
        state.meta?.currentDate;

    if (!startDate) {
        return [];
    }

    return calendar.events
        .filter(event =>
            event.status === "scheduled" &&
            event.date >= startDate
        )
        .slice(0, limit);
}


// ------------------------------------------------------------
// MARCAR COMO CONCLUÍDO
// ------------------------------------------------------------

export function completeCalendarEvent(
    state,
    eventId,
    result = null
) {
    const calendar = ensureCalendar(state);

    const index = calendar.events.findIndex(
        event => event.id === eventId
    );

    if (index === -1) {
        return null;
    }

    const event =
        calendar.events[index];

    event.status = "completed";

    event.completedAt =
        new Date().toISOString();

    if (result !== null) {
        event.result = result;
    }

    calendar.events.splice(index, 1);

    calendar.completed.push(event);

    return event;
}


// ------------------------------------------------------------
// CANCELAR EVENTO
// ------------------------------------------------------------

export function cancelCalendarEvent(
    state,
    eventId,
    reason = ""
) {
    const calendar = ensureCalendar(state);

    const index = calendar.events.findIndex(
        event => event.id === eventId
    );

    if (index === -1) {
        return null;
    }

    const event =
        calendar.events[index];

    event.status = "cancelled";

    event.cancelledAt =
        new Date().toISOString();

    event.cancelReason = reason;

    calendar.events.splice(index, 1);

    calendar.cancelled.push(event);

    return event;
}


// ------------------------------------------------------------
// REAGENDAR EVENTO
// ------------------------------------------------------------

export function rescheduleCalendarEvent(
    state,
    eventId,
    newDate
) {
    if (!isValidDateString(newDate)) {
        throw new Error(
            `Nova data inválida: ${newDate}`
        );
    }

    const calendar = ensureCalendar(state);

    const event =
        calendar.events.find(
            item => item.id === eventId
        );

    if (!event) {
        return null;
    }

    event.date = newDate;

    sortCalendarEvents(state);

    return event;
}


// ------------------------------------------------------------
// REMOVER EVENTO
// ------------------------------------------------------------

export function removeCalendarEvent(
    state,
    eventId
) {
    const calendar = ensureCalendar(state);

    const index =
        calendar.events.findIndex(
            event => event.id === eventId
        );

    if (index === -1) {
        return false;
    }

    calendar.events.splice(index, 1);

    return true;
}


// ------------------------------------------------------------
// LIMPAR EVENTOS ANTIGOS
// ------------------------------------------------------------

export function cleanupCalendar(
    state,
    beforeDate,
    keepHistory = true
) {
    const calendar = ensureCalendar(state);

    const remaining = [];
    const removed = [];

    for (const event of calendar.events) {

        if (event.date < beforeDate) {

            removed.push(event);

            if (keepHistory) {
                event.status = "completed";

                calendar.completed.push(event);
            }

        } else {

            remaining.push(event);

        }
    }

    calendar.events = remaining;

    return removed;
}


// ------------------------------------------------------------
// CONTAGEM DE EVENTOS
// ------------------------------------------------------------

export function countCalendarEvents(
    state,
    type = null
) {
    const calendar = ensureCalendar(state);

    if (!type) {
        return calendar.events.length;
    }

    return calendar.events.filter(
        event => event.type === type
    ).length;
}


// ------------------------------------------------------------
// PRÓXIMO EVENTO
// ------------------------------------------------------------

export function getNextEvent(
    state,
    type = null
) {
    const currentDate =
        state.meta?.currentDate;

    if (!currentDate) {
        return null;
    }

    const events =
        type
            ? getEventsByType(state, type)
            : getUpcomingEvents(
                state,
                currentDate,
                1
            );

    if (!events.length) {
        return null;
    }

    if (type) {
        return events
            .filter(
                event =>
                    event.date >= currentDate
            )
            .sort(
                (a, b) =>
                    a.date.localeCompare(b.date)
            )[0] || null;
    }

    return events[0];
}


// ------------------------------------------------------------
// PROCESSAR EVENTOS DO DIA
// ------------------------------------------------------------

export function getEventsForCurrentDate(state) {
    const currentDate =
        state.meta?.currentDate;

    if (!currentDate) {
        return [];
    }

    return getEventsByDate(
        state,
        currentDate
    );
}


// ------------------------------------------------------------
// PROCESSAR EVENTOS DA SEMANA ATUAL
// ------------------------------------------------------------

export function getCurrentWeekEvents(state) {
    const currentDate =
        state.meta?.currentDate;

    if (!currentDate) {
        return [];
    }

    return getEventsForWeek(
        state,
        currentDate
    );
}


// ------------------------------------------------------------
// SNAPSHOT DO CALENDÁRIO
// ------------------------------------------------------------

export function createCalendarSnapshot(state) {
    const calendar = ensureCalendar(state);

    return {
        scheduled: calendar.events.length,

        completed:
            calendar.completed.length,

        cancelled:
            calendar.cancelled.length,

        nextEvent:
            getNextEvent(state)
    };
}


// ------------------------------------------------------------
// EXPORT DEFAULT
// ------------------------------------------------------------

export default {
    CALENDAR_EVENT_TYPES,
    CALENDAR_PRIORITIES,

    generateCalendarEventId,

    createCalendarEvent,

    addCalendarEvent,
    addCalendarEvents,

    sortCalendarEvents,

    getCalendarEvent,
    getEventsByDate,
    getEventsByType,
    getEventsBetweenDates,

    getEventsForWeek,
    getEventsForMonth,

    getUpcomingEvents,

    completeCalendarEvent,
    cancelCalendarEvent,
    rescheduleCalendarEvent,
    removeCalendarEvent,

    cleanupCalendar,

    countCalendarEvents,

    getNextEvent,

    getEventsForCurrentDate,
    getCurrentWeekEvents,

    createCalendarSnapshot
};
