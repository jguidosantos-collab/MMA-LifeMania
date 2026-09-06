// ============================================================
// MMA LIFE DYNASTY
// js/promotions/events.js
// ============================================================
export const PROMOTION_EVENTS_VERSION = 1;
// ============================================================
// EVENT STATUS
// ============================================================
export const EVENT_STATUS = Object.freeze({
    SCHEDULED: "scheduled",
    ANNOUNCED: "announced",
    OPEN: "open",
    LIVE: "live",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    POSTPONED: "postponed"
});
// ============================================================
// EVENT TYPES
// ============================================================
export const EVENT_TYPES = Object.freeze({
    REGULAR: "regular",
    FIGHT_NIGHT: "fight_night",
    CHAMPIONSHIP: "championship",
    TITLE: "title",
    TOURNAMENT: "tournament",
    PPV: "ppv",
    SPECIAL: "special",
    SHOWCASE: "showcase",
    AMATEUR: "amateur"
});
// ============================================================
// FIGHT STATUS
// ============================================================
export const EVENT_FIGHT_STATUS = Object.freeze({
    SCHEDULED: "scheduled",
    CONFIRMED: "confirmed",
    WEIGH_IN: "weigh_in",
    READY: "ready",
    LIVE: "live",
    COMPLETED: "completed",
    CANCELLED: "cancelled"
});
// ============================================================
// CARD POSITIONS
// ============================================================
export const CARD_POSITIONS = Object.freeze({
    MAIN_EVENT: "main_event",
    CO_MAIN_EVENT: "co_main_event",
    MAIN_CARD: "main_card",
    PRELIMINARY: "preliminary",
    EARLY_PRELIMINARY: "early_preliminary"
});
// ============================================================
// EVENT CONFIGURATION
// ============================================================
export const EVENT_CONFIG = Object.freeze({
    DEFAULT_CAPACITY: 5000,
    MIN_CAPACITY: 500,
    MAX_CAPACITY: 100000,
    DEFAULT_TICKET_PRICE: 50,
    DEFAULT_PPv_PRICE: 59.99,
    DEFAULT_FIGHTS: 5,
    MAX_FIGHTS: 20,
    MAX_MAIN_CARD_FIGHTS: 8,
    MAX_PRELIMINARY_FIGHTS: 12
});
// ============================================================
// HELPERS
// ============================================================
function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number)
        ? number
        : fallback;
}
function clamp(value, min = 0, max = 100) {
    return Math.min(
        max,
        Math.max(
            min,
            safeNumber(value, min)
        )
    );
}
function clone(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return value;
    }
    return JSON.parse(
        JSON.stringify(value)
    );
}
function createId(prefix = "event") {
    return (
        prefix +
        "_" +
        Date.now().toString(36) +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 9)
    );
}
function nowISO() {
    return new Date().toISOString();
}
// ============================================================
// VENUE
// ============================================================
export function createVenue(options = {}) {
    return {
        id:
            options.id ||
            createId("venue"),
        name:
            options.name ||
            "Arena Nacional",
        city:
            options.city ||
            "Unknown",
        country:
            options.country ||
            "Unknown",
        capacity:
            clamp(
                options.capacity ??
                    EVENT_CONFIG.DEFAULT_CAPACITY,
                EVENT_CONFIG.MIN_CAPACITY,
                EVENT_CONFIG.MAX_CAPACITY
            ),
        indoor:
            options.indoor !== false,
        surface:
            options.surface ||
            "MMA Cage",
        ticketPrice:
            safeNumber(
                options.ticketPrice ??
                    EVENT_CONFIG.DEFAULT_TICKET_PRICE,
                EVENT_CONFIG.DEFAULT_TICKET_PRICE
            )
    };
}
// ============================================================
// EVENT FIGHT
// ============================================================
export function createEventFight(options = {}) {
    return {
        id:
            options.id ||
            createId("bout"),
        eventId:
            options.eventId ||
            null,
        order:
            safeNumber(
                options.order,
                1
            ),
        position:
            options.position ||
            CARD_POSITIONS.PRELIMINARY,
        status:
            options.status ||
            EVENT_FIGHT_STATUS.SCHEDULED,
        fighterAId:
            options.fighterAId ||
            null,
        fighterAName:
            options.fighterAName ||
            null,
        fighterBId:
            options.fighterBId ||
            null,
        fighterBName:
            options.fighterBName ||
            null,
        promotionId:
            options.promotionId ||
            null,
        division:
            options.division ||
            null,
        weightClass:
            options.weightClass ||
            null,
        catchweight:
            options.catchweight === true,
        catchweightLimit:
            options.catchweightLimit ??
            null,
        titleFight:
            options.titleFight === true,
        titleId:
            options.titleId ||
            null,
        titleName:
            options.titleName ||
            null,
        interimTitle:
            options.interimTitle === true,
        tournament:
            options.tournament === true,
        tournamentId:
            options.tournamentId ||
            null,
        rounds:
            safeNumber(
                options.rounds,
                options.titleFight
                    ? 5
                    : 3
            ),
        result: {
            winnerId:
                options.result
                    ?.winnerId ||
                null,
            loserId:
                options.result
                    ?.loserId ||
                null,
            method:
                options.result
                    ?.method ||
                null,
            round:
                options.result
                    ?.round ||
                null,
            time:
                options.result
                    ?.time ||
                null,
            decision:
                options.result
                    ?.decision ||
                null,
            completed:
                options.result
                    ?.completed === true
        },
        odds: {
            fighterA:
                safeNumber(
                    options.odds
                        ?.fighterA,
                    0
                ),
            fighterB:
                safeNumber(
                    options.odds
                        ?.fighterB,
                    0
                )
        },
        attendance:
            safeNumber(
                options.attendance,
                0
            ),
        revenue:
            safeNumber(
                options.revenue,
                0
            )
    };
}
// ============================================================
// CREATE EVENT
// ============================================================
export function createEvent(options = {}) {
    const venue =
        options.venue
            ? createVenue(
                options.venue
            )
            : createVenue();
    return {
        id:
            options.id ||
            createId(),
        version:
            PROMOTION_EVENTS_VERSION,
        name:
            options.name ||
            "Fight Night",
        shortName:
            options.shortName ||
            options.name ||
            "Fight Night",
        type:
            options.type ||
            EVENT_TYPES.REGULAR,
        status:
            options.status ||
            EVENT_STATUS.SCHEDULED,
        promotionId:
            options.promotionId ||
            null,
        promotionName:
            options.promotionName ||
            null,
        promotionLevel:
            options.promotionLevel ||
            null,
        date:
            options.date ||
            null,
        endDate:
            options.endDate ||
            options.date ||
            null,
        venue,
        location: {
            city:
                options.location
                    ?.city ||
                venue.city,
            country:
                options.location
                    ?.country ||
                venue.country
        },
        card: [],
        capacity:
            venue.capacity,
        attendance:
            safeNumber(
                options.attendance,
                0
            ),
        tickets: {
            price:
                safeNumber(
                    options.tickets
                        ?.price ??
                        venue.ticketPrice,
                    venue.ticketPrice
                ),
            sold:
                safeNumber(
                    options.tickets
                        ?.sold,
                    0
                ),
            available:
                Math.max(
                    0,
                    venue.capacity -
                    safeNumber(
                        options.tickets
                            ?.sold,
                        0
                    )
                ),
            revenue:
                safeNumber(
                    options.tickets
                        ?.revenue,
                    0
                )
        },
        broadcast: {
            enabled:
                options.broadcast
                    ?.enabled !== false,
            network:
                options.broadcast
                    ?.network ||
                null,
            viewers:
                safeNumber(
                    options.broadcast
                        ?.viewers,
                    0
                ),
            revenue:
                safeNumber(
                    options.broadcast
                        ?.revenue,
                    0
                )
        },
        ppv: {
            enabled:
                options.ppv
                    ?.enabled === true,
            price:
                safeNumber(
                    options.ppv?.price ??
                        EVENT_CONFIG
                            .DEFAULT_PPv_PRICE,
                    EVENT_CONFIG
                        .DEFAULT_PPv_PRICE
                ),
            buys:
                safeNumber(
                    options.ppv?.buys,
                    0
                ),
            revenue:
                safeNumber(
                    options.ppv?.revenue,
                    0
                )
        },
        sponsorship: {
            revenue:
                safeNumber(
                    options.sponsorship
                        ?.revenue,
                    0
                )
        },
        finances: {
            revenue:
                safeNumber(
                    options.finances
                        ?.revenue,
                    0
                ),
            expenses:
                safeNumber(
                    options.finances
                        ?.expenses,
                    0
                ),
            profit:
                safeNumber(
                    options.finances
                        ?.profit,
                    0
                )
        },
        media: {
            hype:
                clamp(
                    options.media
                        ?.hype ??
                        25,
                    0,
                    100
                ),
            interest:
                clamp(
                    options.media
                        ?.interest ??
                        25,
                    0,
                    100
                ),
            coverage:
                safeNumber(
                    options.media
                        ?.coverage,
                    0
                )
        },
        titleFight:
            options.titleFight === true,
        tournament:
            options.tournament === true,
        tournamentId:
            options.tournamentId ||
            null,
        mainEventId:
            options.mainEventId ||
            null,
        coMainEventId:
            options.coMainEventId ||
            null,
        createdAt:
            options.createdAt ||
            nowISO(),
        updatedAt:
            options.updatedAt ||
            nowISO(),
        notes:
            Array.isArray(
                options.notes
            )
                ? [...options.notes]
                : []
    };
}
// ============================================================
// ADD FIGHT TO CARD
// ============================================================
export function addFightToEvent(
    event,
    fight,
    position = null
) {
    if (
        !event ||
        !fight
    ) {
        return false;
    }
    if (
        !Array.isArray(
            event.card
        )
    ) {
        event.card = [];
    }
    if (
        event.card.length >=
        EVENT_CONFIG.MAX_FIGHTS
    ) {
        return false;
    }
    const bout =
        createEventFight({
            ...clone(fight),
            eventId:
                event.id,
            position:
                position ||
                fight.position ||
                CARD_POSITIONS.PRELIMINARY,
            order:
                event.card.length + 1
        });
    event.card.push(
        bout
    );
    if (
        bout.position ===
        CARD_POSITIONS.MAIN_EVENT
    ) {
        event.mainEventId =
            bout.id;
        event.titleFight =
            event.titleFight ||
            bout.titleFight;
    }
    if (
        bout.position ===
        CARD_POSITIONS.CO_MAIN_EVENT
    ) {
        event.coMainEventId =
            bout.id;
    }
    event.updatedAt =
        nowISO();
    return bout;
}
// ============================================================
// REMOVE FIGHT
// ============================================================
export function removeFightFromEvent(
    event,
    fightId
) {
    if (
        !event ||
        !Array.isArray(
            event.card
        )
    ) {
        return false;
    }
    const index =
        event.card.findIndex(
            fight =>
                fight.id ===
                fightId
        );
    if (
        index === -1
    ) {
        return false;
    }
    event.card.splice(
        index,
        1
    );
    event.card.forEach(
        (fight, i) => {
            fight.order =
                i + 1;
        }
    );
    if (
        event.mainEventId ===
        fightId
    ) {
        event.mainEventId =
            null;
    }
    if (
        event.coMainEventId ===
        fightId
    ) {
        event.coMainEventId =
            null;
    }
    event.updatedAt =
        nowISO();
    return true;
}
// ============================================================
// GET FIGHT
// ============================================================
export function getEventFight(
    event,
    fightId
) {
    if (
        !event ||
        !Array.isArray(
            event.card
        )
    ) {
        return null;
    }
    return (
        event.card.find(
            fight =>
                fight.id ===
                fightId
        ) ||
        null
    );
}
// ============================================================
// SORT CARD
// ============================================================
const POSITION_ORDER = {
    [CARD_POSITIONS.EARLY_PRELIMINARY]: 1,
    [CARD_POSITIONS.PRELIMINARY]: 2,
    [CARD_POSITIONS.MAIN_CARD]: 3,
    [CARD_POSITIONS.CO_MAIN_EVENT]: 4,
    [CARD_POSITIONS.MAIN_EVENT]: 5
};
export function sortEventCard(
    event
) {
    if (
        !event ||
        !Array.isArray(
            event.card
        )
    ) {
        return [];
    }
    event.card.sort(
        (a, b) => {
            const positionA =
                POSITION_ORDER[
                    a.position
                ] || 0;
            const positionB =
                POSITION_ORDER[
                    b.position
                ] || 0;
            if (
                positionA !==
                positionB
            ) {
                return (
                    positionB -
                    positionA
                );
            }
            return (
                safeNumber(
                    a.order,
                    0
                ) -
                safeNumber(
                    b.order,
                    0
                )
            );
        }
    );
    return event.card;
}
// ============================================================
// SET MAIN EVENT
// ============================================================
export function setMainEvent(
    event,
    fightId
) {
    const fight =
        getEventFight(
            event,
            fightId
        );
    if (
        !fight
    ) {
        return false;
    }
    if (
        event.mainEventId
    ) {
        const previous =
            getEventFight(
                event,
                event.mainEventId
            );
        if (
            previous
        ) {
            previous.position =
                CARD_POSITIONS
                    .MAIN_CARD;
        }
    }
    fight.position =
        CARD_POSITIONS.MAIN_EVENT;
    event.mainEventId =
        fight.id;
    event.titleFight =
        fight.titleFight;
    event.updatedAt =
        nowISO();
    return true;
}
// ============================================================
// SET CO-MAIN EVENT
// ============================================================
export function setCoMainEvent(
    event,
    fightId
) {
    const fight =
        getEventFight(
            event,
            fightId
        );
    if (
        !fight
    ) {
        return false;
    }
    if (
        event.coMainEventId
    ) {
        const previous =
            getEventFight(
                event,
                event.coMainEventId
            );
        if (
            previous
        ) {
            previous.position =
                CARD_POSITIONS
                    .MAIN_CARD;
        }
    }
    fight.position =
        CARD_POSITIONS.CO_MAIN_EVENT;
    event.coMainEventId =
        fight.id;
    event.updatedAt =
        nowISO();
    return true;
}
// ============================================================
// CONFIRM FIGHT
// ============================================================
export function confirmEventFight(
    event,
    fightId
) {
    const fight =
        getEventFight(
            event,
            fightId
        );
    if (
        !fight
    ) {
        return false;
    }
    if (
        fight.status ===
        EVENT_FIGHT_STATUS.CANCELLED
    ) {
        return false;
    }
    fight.status =
        EVENT_FIGHT_STATUS.CONFIRMED;
    event.updatedAt =
        nowISO();
    return true;
}
// ============================================================
// CANCEL FIGHT
// ============================================================
export function cancelEventFight(
    event,
    fightId,
    reason = null
) {
    const fight =
        getEventFight(
            event,
            fightId
        );
    if (
        !fight
    ) {
        return false;
    }
    fight.status =
        EVENT_FIGHT_STATUS.CANCELLED;
    if (
        reason
    ) {
        fight.cancelReason =
            reason;
    }
    event.updatedAt =
        nowISO();
    return true;
}
// ============================================================
// REGISTER FIGHT RESULT
// ============================================================
export function registerEventFightResult(
    event,
    fightId,
    result = {}
) {
    const fight =
        getEventFight(
            event,
            fightId
        );
    if (
        !fight
    ) {
        return {
            success: false,
            reason:
                "fight_not_found"
        };
    }
    if (
        fight.status ===
        EVENT_FIGHT_STATUS.CANCELLED
    ) {
        return {
            success: false,
            reason:
                "fight_cancelled"
        };
    }
    fight.result = {
        winnerId:
            result.winnerId ||
            null,
        loserId:
            result.loserId ||
            null,
        method:
            result.method ||
            null,
        round:
            result.round ||
            null,
        time:
            result.time ||
            null,
        decision:
            result.decision ||
            null,
        completed:
            true
    };
    fight.status =
        EVENT_FIGHT_STATUS.COMPLETED;
    event.updatedAt =
        nowISO();
    return {
        success: true,
        fight
    };
}
// ============================================================
// EVENT STATUS
// ============================================================
export function announceEvent(
    event
) {
    if (
        !event
    ) {
        return false;
    }
    if (
        event.status ===
        EVENT_STATUS.CANCELLED
    ) {
        return false;
    }
    event.status =
        EVENT_STATUS.ANNOUNCED;
    event.updatedAt =
        nowISO();
    return true;
}
export function openEvent(
    event
) {
    if (
        !event
    ) {
        return false;
    }
    if (
        event.status ===
        EVENT_STATUS.CANCELLED
    ) {
        return false;
    }
    event.status =
        EVENT_STATUS.OPEN;
    event.updatedAt =
        nowISO();
    return true;
}
export function startEvent(
    event
) {
    if (
        !event
    ) {
        return false;
    }
    if (
        event.status ===
        EVENT_STATUS.CANCELLED
    ) {
        return false;
    }
    event.status =
        EVENT_STATUS.LIVE;
    event.updatedAt =
        nowISO();
    return true;
}
export function completeEvent(
    event
) {
    if (
        !event
    ) {
        return false;
    }
    event.status =
        EVENT_STATUS.COMPLETED;
    event.card.forEach(
        fight => {
            if (
                fight.status !==
                    EVENT_FIGHT_STATUS.CANCELLED &&
                fight.result
                    ?.completed !== true
            ) {
                fight.status =
                    EVENT_FIGHT_STATUS.COMPLETED;
            }
        }
    );
    calculateEventFinances(
        event
    );
    event.updatedAt =
        nowISO();
    return true;
}
export function cancelEvent(
    event,
    reason = null
) {
    if (
        !event
    ) {
        return false;
    }
    event.status =
        EVENT_STATUS.CANCELLED;
    if (
        reason
    ) {
        event.notes.push(
            `Cancelled: ${reason}`
        );
    }
    event.updatedAt =
        nowISO();
    return true;
}
export function postponeEvent(
    event,
    newDate
) {
    if (
        !event ||
        !newDate
    ) {
        return false;
    }
    event.status =
        EVENT_STATUS.POSTPONED;
    event.date =
        newDate;
    event.updatedAt =
        nowISO();
    return true;
}
// ============================================================
// TICKETS
// ============================================================
export function sellTickets(
    event,
    quantity
) {
    if (
        !event ||
        !event.tickets
    ) {
        return {
            success: false,
            sold: 0
        };
    }
    const amount =
        Math.max(
            0,
            Math.floor(
                safeNumber(
                    quantity,
                    0
                )
            )
        );
    const sold =
        Math.min(
            amount,
            safeNumber(
                event.tickets.available,
                0
            )
        );
    event.tickets.sold +=
        sold;
    event.tickets.available =
        Math.max(
            0,
            safeNumber(
                event.capacity,
                0
            ) -
            event.tickets.sold
        );
    event.attendance =
        event.tickets.sold;
    event.tickets.revenue =
        event.tickets.sold *
        safeNumber(
            event.tickets.price,
            0
        );
    event.updatedAt =
        nowISO();
    return {
        success: sold > 0,
        sold,
        revenue:
            sold *
            safeNumber(
                event.tickets.price,
                0
            )
    };
}
// ============================================================
// PPV
// ============================================================
export function registerPPVBuys(
    event,
    buys
) {
    if (
        !event ||
        !event.ppv
    ) {
        return {
            success: false,
            buys: 0
        };
    }
    if (
        event.ppv.enabled !== true
    ) {
        return {
            success: false,
            buys: 0
        };
    }
    const amount =
        Math.max(
            0,
            Math.floor(
                safeNumber(
                    buys,
                    0
                )
            )
        );
    event.ppv.buys +=
        amount;
    event.ppv.revenue =
        event.ppv.buys *
        safeNumber(
            event.ppv.price,
            0
        );
    event.updatedAt =
        nowISO();
    return {
        success: true,
        buys: amount,
        revenue:
            amount *
            safeNumber(
                event.ppv.price,
                0
            )
    };
}
// ============================================================
// BROADCAST
// ============================================================
export function registerBroadcast(
    event,
    viewers,
    revenue = 0
) {
    if (
        !event ||
        !event.broadcast
    ) {
        return false;
    }
    event.broadcast.viewers =
        Math.max(
            0,
            safeNumber(
                viewers,
                0
            )
        );
    event.broadcast.revenue =
        Math.max(
            0,
            safeNumber(
                revenue,
                0
            )
        );
    event.updatedAt =
        nowISO();
    return true;
}
// ============================================================
// EVENT FINANCES
// ============================================================
export function calculateEventFinances(
    event,
    options = {}
) {
    if (
        !event
    ) {
        return null;
    }
    const ticketRevenue =
        safeNumber(
            event.tickets?.revenue,
            0
        );
    const broadcastRevenue =
        safeNumber(
            event.broadcast?.revenue,
            0
        );
    const ppvRevenue =
        safeNumber(
            event.ppv?.revenue,
            0
        );
    const sponsorshipRevenue =
        safeNumber(
            event.sponsorship?.revenue,
            0
        );
    const customRevenue =
        safeNumber(
            options.customRevenue,
            0
        );
    const revenue =
        ticketRevenue +
        broadcastRevenue +
        ppvRevenue +
        sponsorshipRevenue +
        customRevenue;
    const expenses =
        safeNumber(
            options.expenses ??
                event.finances?.expenses,
            0
        );
    event.finances = {
        revenue,
        expenses,
        profit:
            revenue -
            expenses
    };
    return clone(
        event.finances
    );
}
// ============================================================
// CARD STATISTICS
// ============================================================
export function getEventStatistics(
    event
) {
    if (
        !event
    ) {
        return null;
    }
    const card =
        Array.isArray(
            event.card
        )
            ? event.card
            : [];
    const completed =
        card.filter(
            fight =>
                fight.status ===
                EVENT_FIGHT_STATUS.COMPLETED
        ).length;
    const cancelled =
        card.filter(
            fight =>
                fight.status ===
                EVENT_FIGHT_STATUS.CANCELLED
        ).length;
    const titleFights =
        card.filter(
            fight =>
                fight.titleFight === true
        ).length;
    const tournamentFights =
        card.filter(
            fight =>
                fight.tournament === true
        ).length;
    return {
        totalFights:
            card.length,
        completedFights:
            completed,
        cancelledFights:
            cancelled,
        remainingFights:
            Math.max(
                0,
                card.length -
                completed -
                cancelled
            ),
        titleFights,
        tournamentFights,
        attendance:
            safeNumber(
                event.attendance,
                0
            ),
        ticketsSold:
            safeNumber(
                event.tickets?.sold,
                0
            ),
        ppvBuys:
            safeNumber(
                event.ppv?.buys,
                0
            ),
        revenue:
            safeNumber(
                event.finances?.revenue,
                0
            ),
        expenses:
            safeNumber(
                event.finances?.expenses,
                0
            ),
        profit:
            safeNumber(
                event.finances?.profit,
                0
            )
    };
}
// ============================================================
// MAIN EVENT / CO-MAIN EVENT
// ============================================================
export function getMainEvent(
    event
) {
    if (
        !event
    ) {
        return null;
    }
    return getEventFight(
        event,
        event.mainEventId
    );
}
export function getCoMainEvent(
    event
) {
    if (
        !event
    ) {
        return null;
    }
    return getEventFight(
        event,
        event.coMainEventId
    );
}
// ============================================================
// EVENT DATABASE
// ============================================================
export function createEventDatabase() {
    return {
        version:
            PROMOTION_EVENTS_VERSION,
        events: {},
        order: [],
        history: [],
        lastUpdated:
            null
    };
}
export function addEventToDatabase(
    database,
    event
) {
    if (
        !database ||
        !event
    ) {
        return false;
    }
    if (
        !database.events
    ) {
        database.events = {};
    }
    if (
        !Array.isArray(
            database.order
        )
    ) {
        database.order = [];
    }
    database.events[
        event.id
    ] =
        clone(
            event
        );
    if (
        !database.order.includes(
            event.id
        )
    ) {
        database.order.push(
            event.id
        );
    }
    database.lastUpdated =
        nowISO();
    return true;
}
export function getEventFromDatabase(
    database,
    eventId
) {
    if (
        !database ||
        !database.events
    ) {
        return null;
    }
    return (
        database.events[
            eventId
        ] ||
        null
    );
}
export function getAllEvents(
    database,
    options = {}
) {
    if (
        !database ||
        !database.events
    ) {
        return [];
    }
    let events =
        Object.values(
            database.events
        );
    if (
        options.promotionId
    ) {
        events =
            events.filter(
                event =>
                    event.promotionId ===
                    options.promotionId
            );
    }
    if (
        options.status
    ) {
        events =
            events.filter(
                event =>
                    event.status ===
                    options.status
            );
    }
    if (
        options.type
    ) {
        events =
            events.filter(
                event =>
                    event.type ===
                    options.type
            );
    }
    if (
        options.date
    ) {
        events =
            events.filter(
                event =>
                    event.date ===
                    options.date
            );
    }
    return events;
}
// ============================================================
// UPCOMING EVENTS
// ============================================================
export function getUpcomingEvents(
    database,
    fromDate = null,
    limit = 10
) {
    let events =
        getAllEvents(
            database
        );
    if (
        fromDate
    ) {
        const from =
            new Date(
                fromDate
            ).getTime();
        events =
            events.filter(
                event => {
                    if (
                        !event.date
                    ) {
                        return false;
                    }
                    return (
                        new Date(
                            event.date
                        ).getTime() >=
                        from
                    );
                }
            );
    }
    events.sort(
        (a, b) =>
            new Date(
                a.date || 0
            ).getTime() -
            new Date(
                b.date || 0
            ).getTime()
    );
    return events.slice(
        0,
        Math.max(
            0,
            safeNumber(
                limit,
                10
            )
        )
    );
}
// ============================================================
// EVENT VALIDATION
// ============================================================
export function validateEvent(
    event
) {
    const errors = [];
    if (
        !event ||
        typeof event !==
            "object"
    ) {
        return {
            valid: false,
            errors: [
                "event_missing"
            ]
        };
    }
    if (
        !event.id
    ) {
        errors.push(
            "id_missing"
        );
    }
    if (
        !event.name
    ) {
        errors.push(
            "name_missing"
        );
    }
    if (
        !Object.values(
            EVENT_STATUS
        ).includes(
            event.status
        )
    ) {
        errors.push(
            "invalid_status"
        );
    }
    if (
        !Object.values(
            EVENT_TYPES
        ).includes(
            event.type
        )
    ) {
        errors.push(
            "invalid_type"
        );
    }
    if (
        !Array.isArray(
            event.card
        )
    ) {
        errors.push(
            "card_missing"
        );
    }
    if (
        safeNumber(
            event.capacity,
            0
        ) < 1
    ) {
        errors.push(
            "invalid_capacity"
        );
    }
    return {
        valid:
            errors.length === 0,
        errors
    };
}
export function validateEventDatabase(
    database
) {
    const errors = [];
    if (
        !database ||
        typeof database !==
            "object"
    ) {
        return {
            valid: false,
            errors: [
                "database_missing"
            ]
        };
    }
    if (
        !database.events
    ) {
        return {
            valid: false,
            errors: [
                "events_missing"
            ]
        };
    }
    Object.values(
        database.events
    ).forEach(
        event => {
            const result =
                validateEvent(
                    event
                );
            if (
                !result.valid
            ) {
                errors.push({
                    id:
                        event.id ||
                        null,
                    errors:
                        result.errors
                });
            }
        }
    );
    return {
        valid:
            errors.length === 0,
        errors
    };
}
// ============================================================
// EVENT SUMMARY
// ============================================================
export function getEventSummary(
    event
) {
    if (
        !event
    ) {
        return null;
    }
    const stats =
        getEventStatistics(
            event
        );
    const mainEvent =
        getMainEvent(
            event
        );
    return {
        id:
            event.id,
        name:
            event.name,
        type:
            event.type,
        status:
            event.status,
        promotion:
            event.promotionName,
        date:
            event.date,
        venue:
            event.venue?.name ||
            null,
        city:
            event.location?.city ||
            null,
        country:
            event.location?.country ||
            null,
        mainEvent:
            mainEvent
                ? {
                    fighterA:
                        mainEvent.fighterAName,
                    fighterB:
                        mainEvent.fighterBName,
                    titleFight:
                        mainEvent.titleFight
                }
                : null,
        ...stats
    };
}
// ============================================================
// CLONE / SNAPSHOT
// ============================================================
export function cloneEvent(
    event
) {
    return clone(
        event
    );
}
export function cloneEventDatabase(
    database
) {
    return clone(
        database
    );
}
export function snapshotEvents(
    database
) {
    return clone(
        database
    );
}
// ============================================================
// DEFAULT EXPORT
// ============================================================
export default {
    PROMOTION_EVENTS_VERSION,
    EVENT_STATUS,
    EVENT_TYPES,
    EVENT_FIGHT_STATUS,
    CARD_POSITIONS,
    EVENT_CONFIG,
    createVenue,
    createEventFight,
    createEvent,
    addFightToEvent,
    removeFightFromEvent,
    getEventFight,
    sortEventCard,
    setMainEvent,
    setCoMainEvent,
    confirmEventFight,
    cancelEventFight,
    registerEventFightResult,
    announceEvent,
    openEvent,
    startEvent,
    completeEvent,
    cancelEvent,
    postponeEvent,
    sellTickets,
    registerPPVBuys,
    registerBroadcast,
    calculateEventFinances,
    getEventStatistics,
    getMainEvent,
    getCoMainEvent,
    createEventDatabase,
    addEventToDatabase,
    getEventFromDatabase,
    getAllEvents,
    getUpcomingEvents,
    validateEvent,
    validateEventDatabase,
    getEventSummary,
    cloneEvent,
    cloneEventDatabase,
    snapshotEvents
};
