// ============================================================
// MMA LIFE DYNASTY
// js/career/legacy.js
// ============================================================
export const LEGACY_VERSION = 1;
// ============================================================
// LEGACY TIERS
// ============================================================
export const LEGACY_TIERS = Object.freeze({
    UNKNOWN: "unknown",
    LOCAL: "local",
    REGIONAL: "regional",
    NATIONAL: "national",
    INTERNATIONAL: "international",
    ELITE: "elite",
    LEGEND: "legend",
    GOAT: "goat"
});
// ============================================================
// LEGACY EVENTS
// ============================================================
export const LEGACY_EVENT_TYPES = Object.freeze({
    DEBUT: "debut",
    WIN: "win",
    BIG_WIN: "big_win",
    TITLE_WIN: "title_win",
    TITLE_DEFENSE: "title_defense",
    TITLE_LOSS: "title_loss",
    TITLE_UNIFICATION: "title_unification",
    TOURNAMENT_WIN: "tournament_win",
    RANKING: "ranking",
    RECORD: "record",
    RIVALRY: "rivalry",
    UPSET: "upset",
    FIGHT_OF_THE_NIGHT: "fight_of_the_night",
    PERFORMANCE: "performance",
    MEDIA: "media",
    RETIREMENT: "retirement",
    COMEBACK: "comeback",
    HALL_OF_FAME: "hall_of_fame",
    DEATH: "death"
});
// ============================================================
// HALL OF FAME STATUS
// ============================================================
export const HALL_OF_FAME_STATUS = Object.freeze({
    NOT_ELIGIBLE: "not_eligible",
    ELIGIBLE: "eligible",
    NOMINATED: "nominated",
    INDUCTED: "inducted"
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
function createId(prefix = "legacy") {
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
// ============================================================
// LEGACY SCORE CONFIG
// ============================================================
export const LEGACY_CONFIG = Object.freeze({
    WIN: 4,
    BIG_WIN: 8,
    TITLE_WIN: 30,
    TITLE_DEFENSE: 15,
    TITLE_LOSS: -3,
    UNIFICATION: 20,
    TOURNAMENT_WIN: 20,
    RANKING_TOP_15: 5,
    RANKING_TOP_10: 10,
    RANKING_TOP_5: 20,
    RANKING_1: 30,
    UPSET: 15,
    RIVALRY: 8,
    PERFORMANCE: 5,
    FIGHT_OF_THE_NIGHT: 5,
    RECORD: 10,
    RETIREMENT: 5,
    COMEBACK: 5,
    HALL_OF_FAME: 50,
    ELITE_ORGANIZATION: 10,
    LONGEVITY_PER_YEAR: 2
});
// ============================================================
// CREATE EMPTY LEGACY
// ============================================================
export function createLegacy(options = {}) {
    return {
        version:
            LEGACY_VERSION,
        score:
            safeNumber(
                options.score,
                0
            ),
        tier:
            options.tier ||
            LEGACY_TIERS.UNKNOWN,
        ranking:
            0,
        reputation:
            0,
        impact:
            0,
        greatness:
            0,
        longevity:
            0,
        achievements: {
            wins: 0,
            bigWins: 0,
            titleWins: 0,
            titleDefenses: 0,
            tournamentWins: 0,
            unifications: 0,
            upsets: 0,
            rivalries: 0,
            performances: 0,
            fightOfTheNight: 0,
            records: 0
        },
        titles: [],
        rivalries: [],
        records: [],
        milestones: [],
        events: [],
        hallOfFame: {
            status:
                HALL_OF_FAME_STATUS
                    .NOT_ELIGIBLE,
            inducted: false,
            inductionDate:
                null,
            organizationId:
                null,
            organizationName:
                null
        },
        retirement: {
            retired:
                false,
            date:
                null,
            age:
                null,
            reason:
                null
        },
        statistics: {
            totalFights: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            noContests: 0,
            titleFights: 0,
            titleWins: 0,
            titleDefenses: 0,
            longestWinStreak: 0,
            yearsActive: 0,
            highestRank: null,
            organizations: [],
            divisions: []
        },
        lastUpdated:
            null
    };
}
// ============================================================
// LEGACY EVENT
// ============================================================
export function createLegacyEvent(
    type,
    options = {}
) {
    return {
        id:
            options.id ||
            createId("legacyEvent"),
        type,
        date:
            options.date ||
            null,
        title:
            options.title ||
            null,
        description:
            options.description ||
            null,
        points:
            safeNumber(
                options.points,
                0
            ),
        fightId:
            options.fightId ||
            null,
        opponentId:
            options.opponentId ||
            null,
        opponentName:
            options.opponentName ||
            null,
        promotionId:
            options.promotionId ||
            null,
        promotionName:
            options.promotionName ||
            null,
        titleId:
            options.titleId ||
            null,
        titleName:
            options.titleName ||
            null
    };
}
// ============================================================
// ADD LEGACY EVENT
// ============================================================
export function addLegacyEvent(
    legacy,
    type,
    options = {}
) {
    if (
        !legacy
    ) {
        return null;
    }
    if (
        !Array.isArray(
            legacy.events
        )
    ) {
        legacy.events = [];
    }
    const event =
        createLegacyEvent(
            type,
            options
        );
    legacy.events.push(
        event
    );
    legacy.score +=
        safeNumber(
            event.points,
            0
        );
    legacy.lastUpdated =
        options.date ||
        null;
    return event;
}
// ============================================================
// ADD SCORE
// ============================================================
export function addLegacyPoints(
    legacy,
    points,
    reason = null,
    options = {}
) {
    if (
        !legacy
    ) {
        return 0;
    }
    const amount =
        safeNumber(
            points,
            0
        );
    legacy.score +=
        amount;
    if (
        reason
    ) {
        addLegacyEvent(
            legacy,
            options.type ||
                LEGACY_EVENT_TYPES.RECORD,
            {
                ...options,
                title:
                    reason,
                description:
                    options.description ||
                    reason,
                points:
                    amount
            }
        );
    }
    updateLegacyTier(
        legacy
    );
    return legacy.score;
}
// ============================================================
// REGISTER WIN
// ============================================================
export function registerLegacyWin(
    legacy,
    options = {}
) {
    if (
        !legacy
    ) {
        return null;
    }
    legacy.achievements.wins += 1;
    let points =
        LEGACY_CONFIG.WIN;
    if (
        options.bigWin
    ) {
        legacy.achievements.bigWins += 1;
        points +=
            LEGACY_CONFIG.BIG_WIN;
    }
    if (
        options.upset
    ) {
        legacy.achievements.upsets += 1;
        points +=
            LEGACY_CONFIG.UPSET;
    }
    if (
        options.performance
    ) {
        legacy.achievements.performances += 1;
        points +=
            LEGACY_CONFIG.PERFORMANCE;
    }
    return addLegacyEvent(
        legacy,
        options.type ||
            (
                options.bigWin
                    ? LEGACY_EVENT_TYPES.BIG_WIN
                    : LEGACY_EVENT_TYPES.WIN
            ),
        {
            ...options,
            points
        }
    );
}
// ============================================================
// REGISTER TITLE WIN
// ============================================================
export function registerLegacyTitleWin(
    legacy,
    options = {}
) {
    if (
        !legacy
    ) {
        return null;
    }
    legacy.achievements.titleWins += 1;
    const titleId =
        options.titleId ||
        null;
    if (
        titleId
    ) {
        const exists =
            legacy.titles.some(
                title =>
                    String(
                        title.titleId
                    ) ===
                    String(
                        titleId
                    )
            );
        if (
            !exists
        ) {
            legacy.titles.push({
                titleId,
                titleName:
                    options.titleName ||
                    null,
                promotionId:
                    options.promotionId ||
                    null,
                promotionName:
                    options.promotionName ||
                    null,
                division:
                    options.division ||
                    null,
                wonDate:
                    options.date ||
                    null,
                defenses: 0,
                active:
                    true
            });
        }
    }
    return addLegacyEvent(
        legacy,
        LEGACY_EVENT_TYPES.TITLE_WIN,
        {
            ...options,
            points:
                LEGACY_CONFIG.TITLE_WIN
        }
    );
}
// ============================================================
// REGISTER TITLE DEFENSE
// ============================================================
export function registerLegacyTitleDefense(
    legacy,
    options = {}
) {
    if (
        !legacy
    ) {
        return null;
    }
    legacy.achievements.titleDefenses += 1;
    const titleId =
        options.titleId ||
        null;
    const title =
        legacy.titles.find(
            item =>
                String(
                    item.titleId
                ) ===
                String(
                    titleId
                )
        );
    if (
        title
    ) {
        title.defenses =
            safeNumber(
                title.defenses,
                0
            ) + 1;
    }
    return addLegacyEvent(
        legacy,
        LEGACY_EVENT_TYPES.TITLE_DEFENSE,
        {
            ...options,
            points:
                LEGACY_CONFIG.TITLE_DEFENSE
        }
    );
}
// ============================================================
// REGISTER TITLE LOSS
// ============================================================
export function registerLegacyTitleLoss(
    legacy,
    options = {}
) {
    if (
        !legacy
    ) {
        return null;
    }
    const titleId =
        options.titleId ||
        null;
    const title =
        legacy.titles.find(
            item =>
                String(
                    item.titleId
                ) ===
                String(
                    titleId
                )
        );
    if (
        title
    ) {
        title.active =
            false;
        title.lostDate =
            options.date ||
            null;
    }
    return addLegacyEvent(
        legacy,
        LEGACY_EVENT_TYPES.TITLE_LOSS,
        {
            ...options,
            points:
                LEGACY_CONFIG.TITLE_LOSS
        }
    );
}
// ============================================================
// REGISTER UNIFICATION
// ============================================================
export function registerLegacyUnification(
    legacy,
    options = {}
) {
    if (
        !legacy
    ) {
        return null;
    }
    legacy.achievements.unifications += 1;
    return addLegacyEvent(
        legacy,
        LEGACY_EVENT_TYPES.TITLE_UNIFICATION,
        {
            ...options,
            points:
                LEGACY_CONFIG.UNIFICATION
        }
    );
}
// ============================================================
// TOURNAMENT WIN
// ============================================================
export function registerLegacyTournamentWin(
    legacy,
    options = {}
) {
    if (
        !legacy
    ) {
        return null;
    }
    legacy.achievements.tournamentWins += 1;
    return addLegacyEvent(
        legacy,
        LEGACY_EVENT_TYPES.TOURNAMENT_WIN,
        {
            ...options,
            points:
                LEGACY_CONFIG.TOURNAMENT_WIN
        }
    );
}
// ============================================================
// RIVALRY
// ============================================================
export function registerLegacyRivalry(
    legacy,
    options = {}
) {
    if (
        !legacy
    ) {
        return null;
    }
    legacy.achievements.rivalries += 1;
    if (
        options.opponentId
    ) {
        const exists =
            legacy.rivalries.some(
                rivalry =>
                    String(
                        rivalry.opponentId
                    ) ===
                    String(
                        options.opponentId
                    )
            );
        if (
            !exists
        ) {
            legacy.rivalries.push({
                opponentId:
                    options.opponentId,
                opponentName:
                    options.opponentName ||
                    null,
                fights:
                    safeNumber(
                        options.fights,
                        1
                    ),
                wins:
                    safeNumber(
                        options.wins,
                        0
                    ),
                losses:
                    safeNumber(
                        options.losses,
                        0
                    ),
                significance:
                    safeNumber(
                        options.significance,
                        0
                    )
            });
        }
    }
    return addLegacyEvent(
        legacy,
        LEGACY_EVENT_TYPES.RIVALRY,
        {
            ...options,
            points:
                LEGACY_CONFIG.RIVALRY
        }
    );
}
// ============================================================
// RECORD ACHIEVEMENT
// ============================================================
export function registerLegacyRecord(
    legacy,
    options = {}
) {
    if (
        !legacy
    ) {
        return null;
    }
    legacy.achievements.records += 1;
    if (
        options.recordName
    ) {
        legacy.records.push({
            id:
                createId("record"),
            name:
                options.recordName,
            value:
                options.value ??
                null,
            date:
                options.date ||
                null,
            promotionId:
                options.promotionId ||
                null
        });
    }
    return addLegacyEvent(
        legacy,
        LEGACY_EVENT_TYPES.RECORD,
        {
            ...options,
            points:
                LEGACY_CONFIG.RECORD
        }
    );
}
// ============================================================
// RANKING ACHIEVEMENT
// ============================================================
export function registerLegacyRanking(
    legacy,
    rank,
    options = {}
) {
    if (
        !legacy
    ) {
        return null;
    }
    const normalizedRank =
        safeNumber(
            rank,
            999
        );
    let points = 0;
    if (
        normalizedRank === 1
    ) {
        points =
            LEGACY_CONFIG.RANKING_1;
    }
    else if (
        normalizedRank <= 5
    ) {
        points =
            LEGACY_CONFIG.RANKING_TOP_5;
    }
    else if (
        normalizedRank <= 10
    ) {
        points =
            LEGACY_CONFIG.RANKING_TOP_10;
    }
    else if (
        normalizedRank <= 15
    ) {
        points =
            LEGACY_CONFIG.RANKING_TOP_15;
    }
    if (
        points > 0
    ) {
        legacy.ranking =
            Math.max(
                legacy.ranking,
                100 -
                (
                    normalizedRank *
                    5
                )
            );
        if (
            legacy.statistics
                .highestRank ===
                null ||
            normalizedRank <
                legacy.statistics
                    .highestRank
        ) {
            legacy.statistics
                .highestRank =
                normalizedRank;
        }
        return addLegacyEvent(
            legacy,
            LEGACY_EVENT_TYPES.RANKING,
            {
                ...options,
                points,
                title:
                    `Ranking #${normalizedRank}`
            }
        );
    }
    return null;
}
// ============================================================
// PERFORMANCE AWARD
// ============================================================
export function registerLegacyPerformance(
    legacy,
    options = {}
) {
    if (
        !legacy
    ) {
        return null;
    }
    legacy.achievements.performances += 1;
    if (
        options.fightOfTheNight
    ) {
        legacy.achievements
            .fightOfTheNight += 1;
        addLegacyEvent(
            legacy,
            LEGACY_EVENT_TYPES.FIGHT_OF_THE_NIGHT,
            {
                ...options,
                points:
                    LEGACY_CONFIG
                        .FIGHT_OF_THE_NIGHT
            }
        );
    }
    return addLegacyEvent(
        legacy,
        LEGACY_EVENT_TYPES.PERFORMANCE,
        {
            ...options,
            points:
                LEGACY_CONFIG.PERFORMANCE
        }
    );
}
// ============================================================
// LONGEVITY
// ============================================================
export function updateLegacyLongevity(
    legacy,
    yearsActive,
    options = {}
) {
    if (
        !legacy
    ) {
        return 0;
    }
    const years =
        Math.max(
            0,
            safeNumber(
                yearsActive,
                0
            )
        );
    legacy.longevity =
        years;
    legacy.statistics
        .yearsActive =
        years;
    const points =
        years *
        LEGACY_CONFIG
            .LONGEVITY_PER_YEAR;
    return points;
}
// ============================================================
// UPDATE FROM RECORD BOOK
// ============================================================
export function syncLegacyStatistics(
    legacy,
    recordBook
) {
    if (
        !legacy ||
        !recordBook
    ) {
        return false;
    }
    const overall =
        recordBook.overall ||
        {};
    legacy.statistics
        .totalFights =
        safeNumber(
            overall.total,
            0
        );
    legacy.statistics
        .wins =
        safeNumber(
            overall.wins,
            0
        );
    legacy.statistics
        .losses =
        safeNumber(
            overall.losses,
            0
        );
    legacy.statistics
        .draws =
        safeNumber(
            overall.draws,
            0
        );
    legacy.statistics
        .noContests =
        safeNumber(
            overall.noContests,
            0
        );
    legacy.statistics
        .titleFights =
        safeNumber(
            recordBook.title?.fights,
            0
        );
    legacy.statistics
        .titleWins =
        safeNumber(
            recordBook.title?.wins,
            0
        );
    legacy.statistics
        .titleDefenses =
        safeNumber(
            recordBook.title?.defenses,
            0
        );
    legacy.statistics
        .longestWinStreak =
        safeNumber(
            recordBook.records
                ?.longestWinStreak,
            0
        );
    return true;
}
// ============================================================
// ORGANIZATION TRACKING
// ============================================================
export function registerOrganization(
    legacy,
    promotionId,
    promotionName = null
) {
    if (
        !legacy ||
        !promotionId
    ) {
        return false;
    }
    if (
        !Array.isArray(
            legacy.statistics
                .organizations
        )
    ) {
        legacy.statistics
            .organizations = [];
    }
    const exists =
        legacy.statistics
            .organizations.some(
                item =>
                    String(
                        item.id
                    ) ===
                    String(
                        promotionId
                    )
            );
    if (
        !exists
    ) {
        legacy.statistics
            .organizations.push({
                id:
                    promotionId,
                name:
                    promotionName ||
                    null
            });
    }
    return true;
}
// ============================================================
// DIVISION TRACKING
// ============================================================
export function registerDivision(
    legacy,
    division
) {
    if (
        !legacy ||
        !division
    ) {
        return false;
    }
    if (
        !Array.isArray(
            legacy.statistics
                .divisions
        )
    ) {
        legacy.statistics
            .divisions = [];
    }
    if (
        !legacy.statistics
            .divisions.includes(
                division
            )
    ) {
        legacy.statistics
            .divisions.push(
                division
            );
    }
    return true;
}
// ============================================================
// LEGACY TIER
// ============================================================
export function calculateLegacyTier(
    score
) {
    const value =
        safeNumber(
            score,
            0
        );
    if (
        value >= 1000
    ) {
        return LEGACY_TIERS.GOAT;
    }
    if (
        value >= 700
    ) {
        return LEGACY_TIERS.LEGEND;
    }
    if (
        value >= 500
    ) {
        return LEGACY_TIERS.ELITE;
    }
    if (
        value >= 300
    ) {
        return LEGACY_TIERS.INTERNATIONAL;
    }
    if (
        value >= 150
    ) {
        return LEGACY_TIERS.NATIONAL;
    }
    if (
        value >= 60
    ) {
        return LEGACY_TIERS.REGIONAL;
    }
    if (
        value > 0
    ) {
        return LEGACY_TIERS.LOCAL;
    }
    return LEGACY_TIERS.UNKNOWN;
}
// ============================================================
// UPDATE TIER
// ============================================================
export function updateLegacyTier(
    legacy
) {
    if (
        !legacy
    ) {
        return LEGACY_TIERS.UNKNOWN;
    }
    legacy.tier =
        calculateLegacyTier(
            legacy.score
        );
    return legacy.tier;
}
// ============================================================
// GREATNESS SCORE
// ============================================================
export function calculateGreatness(
    legacy
) {
    if (
        !legacy
    ) {
        return 0;
    }
    const achievements =
        legacy.achievements || {};
    let score = 0;
    score +=
        safeNumber(
            achievements.wins,
            0
        ) * 1;
    score +=
        safeNumber(
            achievements.bigWins,
            0
        ) * 3;
    score +=
        safeNumber(
            achievements.titleWins,
            0
        ) * 8;
    score +=
        safeNumber(
            achievements.titleDefenses,
            0
        ) * 5;
    score +=
        safeNumber(
            achievements.tournamentWins,
            0
        ) * 6;
    score +=
        safeNumber(
            achievements.unifications,
            0
        ) * 8;
    score +=
        safeNumber(
            achievements.upsets,
            0
        ) * 4;
    score +=
        safeNumber(
            achievements.rivalries,
            0
        ) * 3;
    score +=
        safeNumber(
            achievements.records,
            0
        ) * 4;
    score +=
        safeNumber(
            legacy.longevity,
            0
        ) * 2;
    legacy.greatness =
        clamp(
            score,
            0,
            1000
        );
    return legacy.greatness;
}
// ============================================================
// IMPACT SCORE
// ============================================================
export function calculateImpact(
    legacy,
    options = {}
) {
    if (
        !legacy
    ) {
        return 0;
    }
    let impact = 0;
    impact +=
        safeNumber(
            options.fame,
            0
        ) * 0.35;
    impact +=
        safeNumber(
            options.followers,
            0
        ) / 1000000 * 20;
    impact +=
        safeNumber(
            options.media,
            0
        ) * 0.15;
    impact +=
        safeNumber(
            legacy.achievements
                ?.rivalries,
            0
        ) * 5;
    legacy.impact =
        clamp(
            impact,
            0,
            100
        );
    return legacy.impact;
}
// ============================================================
// REPUTATION SCORE
// ============================================================
export function calculateReputation(
    legacy,
    options = {}
) {
    if (
        !legacy
    ) {
        return 0;
    }
    const wins =
        safeNumber(
            legacy.statistics?.wins,
            0
        );
    const losses =
        safeNumber(
            legacy.statistics?.losses,
            0
        );
    const total =
        wins +
        losses;
    const winRate =
        total > 0
            ? wins / total
            : 0;
    const titleWins =
        safeNumber(
            legacy.statistics?.titleWins,
            0
        );
    const rank =
        safeNumber(
            legacy.statistics?.highestRank,
            999
        );
    let reputation =
        winRate * 45;
    reputation +=
        Math.min(
            30,
            titleWins * 5
        );
    if (
        rank === 1
    ) {
        reputation += 25;
    }
    else if (
        rank <= 5
    ) {
        reputation += 20;
    }
    else if (
        rank <= 10
    ) {
        reputation += 12;
    }
    else if (
        rank <= 15
    ) {
        reputation += 7;
    }
    reputation +=
        safeNumber(
            options.fame,
            0
        ) * 0.1;
    legacy.reputation =
        clamp(
            reputation,
            0,
            100
        );
    return legacy.reputation;
}
// ============================================================
// FINAL LEGACY RATING
// ============================================================
export function calculateLegacyRating(
    legacy,
    options = {}
) {
    if (
        !legacy
    ) {
        return 0;
    }
    calculateGreatness(
        legacy
    );
    calculateImpact(
        legacy,
        options
    );
    calculateReputation(
        legacy,
        options
    );
    const score =
        safeNumber(
            legacy.score,
            0
        );
    const normalizedScore =
        Math.min(
            100,
            score / 10
        );
    const rating =
        (
            normalizedScore * 0.4
        ) +
        (
            legacy.greatness / 10 *
            0.3
        ) +
        (
            legacy.reputation *
            0.2
        ) +
        (
            legacy.impact *
            0.1
        );
    return clamp(
        rating,
        0,
        100
    );
}
// ============================================================
// HALL OF FAME ELIGIBILITY
// ============================================================
export function evaluateHallOfFame(
    legacy,
    options = {}
) {
    if (
        !legacy
    ) {
        return {
            eligible: false,
            status:
                HALL_OF_FAME_STATUS
                    .NOT_ELIGIBLE
        };
    }
    const rating =
        calculateLegacyRating(
            legacy,
            options
        );
    const fights =
        safeNumber(
            legacy.statistics
                ?.totalFights,
            0
        );
    const titles =
        safeNumber(
            legacy.statistics
                ?.titleWins,
            0
        );
    const defenses =
        safeNumber(
            legacy.statistics
                ?.titleDefenses,
            0
        );
    const retired =
        legacy.retirement
            ?.retired === true;
    const eligible =
        (
            rating >= 75 &&
            (
                titles >= 1 ||
                defenses >= 3 ||
                rating >= 85
            )
        ) ||
        (
            retired &&
            rating >= 65 &&
            fights >= 20
        );
    if (
        eligible &&
        legacy.hallOfFame.status ===
            HALL_OF_FAME_STATUS
                .NOT_ELIGIBLE
    ) {
        legacy.hallOfFame.status =
            HALL_OF_FAME_STATUS
                .ELIGIBLE;
    }
    return {
        eligible,
        status:
            legacy.hallOfFame.status,
        rating
    };
}
// ============================================================
// INDUCT INTO HALL OF FAME
// ============================================================
export function inductHallOfFame(
    legacy,
    options = {}
) {
    if (
        !legacy
    ) {
        return {
            success: false,
            reason:
                "legacy_missing"
        };
    }
    const evaluation =
        evaluateHallOfFame(
            legacy,
            options
        );
    if (
        !evaluation.eligible &&
        options.force !== true
    ) {
        return {
            success: false,
            reason:
                "not_eligible",
            evaluation
        };
    }
    legacy.hallOfFame.status =
        HALL_OF_FAME_STATUS
            .INDUCTED;
    legacy.hallOfFame.inducted =
        true;
    legacy.hallOfFame.inductionDate =
        options.date ||
        null;
    legacy.hallOfFame
        .organizationId =
        options.organizationId ||
        null;
    legacy.hallOfFame
        .organizationName =
        options.organizationName ||
        null;
    addLegacyEvent(
        legacy,
        LEGACY_EVENT_TYPES.HALL_OF_FAME,
        {
            ...options,
            points:
                LEGACY_CONFIG
                    .HALL_OF_FAME
        }
    );
    updateLegacyTier(
        legacy
    );
    return {
        success: true,
        legacy
    };
}
// ============================================================
// RETIREMENT
// ============================================================
export function registerRetirement(
    legacy,
    options = {}
) {
    if (
        !legacy
    ) {
        return null;
    }
    legacy.retirement.retired =
        true;
    legacy.retirement.date =
        options.date ||
        null;
    legacy.retirement.age =
        options.age ??
        null;
    legacy.retirement.reason =
        options.reason ||
        null;
    return addLegacyEvent(
        legacy,
        LEGACY_EVENT_TYPES.RETIREMENT,
        {
            ...options,
            points:
                LEGACY_CONFIG
                    .RETIREMENT
        }
    );
}
// ============================================================
// COMEBACK
// ============================================================
export function registerComeback(
    legacy,
    options = {}
) {
    if (
        !legacy
    ) {
        return null;
    }
    legacy.retirement.retired =
        false;
    return addLegacyEvent(
        legacy,
        LEGACY_EVENT_TYPES.COMEBACK,
        {
            ...options,
            points:
                LEGACY_CONFIG
                    .COMEBACK
        }
    );
}
// ============================================================
// MILESTONE
// ============================================================
export function addMilestone(
    legacy,
    options = {}
) {
    if (
        !legacy
    ) {
        return null;
    }
    if (
        !Array.isArray(
            legacy.milestones
        )
    ) {
        legacy.milestones = [];
    }
    const milestone = {
        id:
            options.id ||
            createId("milestone"),
        type:
            options.type ||
            "career",
        title:
            options.title ||
            "Career Milestone",
        description:
            options.description ||
            null,
        date:
            options.date ||
            null,
        value:
            options.value ??
            null
    };
    legacy.milestones.push(
        milestone
    );
    return milestone;
}
// ============================================================
// LEGACY SUMMARY
// ============================================================
export function getLegacySummary(
    legacy,
    options = {}
) {
    if (
        !legacy
    ) {
        return null;
    }
    const rating =
        calculateLegacyRating(
            legacy,
            options
        );
    return {
        version:
            legacy.version,
        score:
            legacy.score,
        rating:
            Number(
                rating.toFixed(2)
            ),
        tier:
            legacy.tier,
        greatness:
            Number(
                legacy.greatness.toFixed(2)
            ),
        impact:
            Number(
                legacy.impact.toFixed(2)
            ),
        reputation:
            Number(
                legacy.reputation.toFixed(2)
            ),
        wins:
            legacy.statistics.wins,
        losses:
            legacy.statistics.losses,
        draws:
            legacy.statistics.draws,
        noContests:
            legacy.statistics.noContests,
        titleWins:
            legacy.statistics.titleWins,
        titleDefenses:
            legacy.statistics.titleDefenses,
        longestWinStreak:
            legacy.statistics
                .longestWinStreak,
        yearsActive:
            legacy.statistics
                .yearsActive,
        hallOfFame:
            legacy.hallOfFame
                .status,
        retired:
            legacy.retirement
                .retired
    };
}
// ============================================================
// LEGACY COMPARISON
// ============================================================
export function compareLegacy(
    first,
    second,
    options = {}
) {
    const firstRating =
        calculateLegacyRating(
            first,
            options
        );
    const secondRating =
        calculateLegacyRating(
            second,
            options
        );
    if (
        firstRating >
        secondRating
    ) {
        return {
            winner: "first",
            first:
                firstRating,
            second:
                secondRating,
            difference:
                firstRating -
                secondRating
        };
    }
    if (
        secondRating >
        firstRating
    ) {
        return {
            winner: "second",
            first:
                firstRating,
            second:
                secondRating,
            difference:
                secondRating -
                firstRating
        };
    }
    return {
        winner: "tie",
        first:
            firstRating,
        second:
            secondRating,
        difference: 0
    };
}
// ============================================================
// VALIDATION
// ============================================================
export function validateLegacy(
    legacy
) {
    const errors = [];
    if (
        !legacy ||
        typeof legacy !==
            "object"
    ) {
        return {
            valid: false,
            errors: [
                "legacy_missing"
            ]
        };
    }
    if (
        safeNumber(
            legacy.score,
            -1
        ) < 0
    ) {
        errors.push(
            "score_invalid"
        );
    }
    if (
        !Array.isArray(
            legacy.events
        )
    ) {
        errors.push(
            "events_invalid"
        );
    }
    if (
        !Array.isArray(
            legacy.titles
        )
    ) {
        errors.push(
            "titles_invalid"
        );
    }
    if (
        !Array.isArray(
            legacy.rivalries
        )
    ) {
        errors.push(
            "rivalries_invalid"
        );
    }
    if (
        !legacy.statistics
    ) {
        errors.push(
            "statistics_missing"
        );
    }
    if (
        !legacy.hallOfFame
    ) {
        errors.push(
            "hall_of_fame_missing"
        );
    }
    return {
        valid:
            errors.length === 0,
        errors
    };
}
// ============================================================
// CLONE / SNAPSHOT
// ============================================================
export function cloneLegacy(
    legacy
) {
    return clone(
        legacy
    );
}
export function snapshotLegacy(
    legacy
) {
    return clone(
        legacy
    );
}
// ============================================================
// DEFAULT EXPORT
// ============================================================
export default {
    LEGACY_VERSION,
    LEGACY_TIERS,
    LEGACY_EVENT_TYPES,
    HALL_OF_FAME_STATUS,
    LEGACY_CONFIG,
    createLegacy,
    createLegacyEvent,
    addLegacyEvent,
    addLegacyPoints,
    registerLegacyWin,
    registerLegacyTitleWin,
    registerLegacyTitleDefense,
    registerLegacyTitleLoss,
    registerLegacyUnification,
    registerLegacyTournamentWin,
    registerLegacyRivalry,
    registerLegacyRecord,
    registerLegacyRanking,
    registerLegacyPerformance,
    updateLegacyLongevity,
    syncLegacyStatistics,
    registerOrganization,
    registerDivision,
    calculateLegacyTier,
    updateLegacyTier,
    calculateGreatness,
    calculateImpact,
    calculateReputation,
    calculateLegacyRating,
    evaluateHallOfFame,
    inductHallOfFame,
    registerRetirement,
    registerComeback,
    addMilestone,
    getLegacySummary,
    compareLegacy,
    validateLegacy,
    cloneLegacy,
    snapshotLegacy
};
