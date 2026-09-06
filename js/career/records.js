// ============================================================
// MMA LIFE DYNASTY
// js/career/records.js
// ============================================================
export const RECORDS_VERSION = 1;
// ============================================================
// RESULT TYPES
// ============================================================
export const RECORD_RESULT = Object.freeze({
    WIN: "win",
    LOSS: "loss",
    DRAW: "draw",
    NO_CONTEST: "no_contest",
    OTHER: "other"
});
// ============================================================
// FIGHT METHODS
// ============================================================
export const RECORD_METHOD = Object.freeze({
    KO: "ko",
    TKO: "tko",
    KO_TKO: "ko_tko",
    SUBMISSION: "submission",
    DECISION: "decision",
    SPLIT_DECISION: "split_decision",
    UNANIMOUS_DECISION: "unanimous_decision",
    MAJORITY_DECISION: "majority_decision",
    TECHNICAL_DECISION: "technical_decision",
    DRAW: "draw",
    NO_CONTEST: "no_contest",
    OTHER: "other"
});
// ============================================================
// FIGHT LEVELS
// ============================================================
export const RECORD_LEVEL = Object.freeze({
    AMATEUR: "amateur",
    PROFESSIONAL: "professional",
    REGIONAL: "regional",
    NATIONAL: "national",
    INTERNATIONAL: "international",
    ELITE: "elite"
});
// ============================================================
// FIGHT TYPES
// ============================================================
export const RECORD_FIGHT_TYPE = Object.freeze({
    NORMAL: "normal",
    DEBUT: "debut",
    TITLE: "title",
    TITLE_DEFENSE: "title_defense",
    INTERIM_TITLE: "interim_title",
    UNIFICATION: "unification",
    TOURNAMENT: "tournament",
    GRAND_PRIX: "grand_prix",
    EXHIBITION: "exhibition",
    SPECIAL: "special"
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
function createId(prefix = "fight") {
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
function normalizeText(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }
    return String(value)
        .trim()
        .toLowerCase();
}
// ============================================================
// EMPTY RECORD
// ============================================================
export function createEmptyRecord() {
    return {
        wins: 0,
        losses: 0,
        draws: 0,
        noContests: 0,
        total: 0
    };
}
// ============================================================
// RECORD OBJECT
// ============================================================
export function createRecordBook(options = {}) {
    return {
        version:
            RECORDS_VERSION,
        amateur:
            createEmptyRecord(),
        professional:
            createEmptyRecord(),
        overall:
            createEmptyRecord(),
        byMethod: {
            wins: {
                ko: 0,
                tko: 0,
                submission: 0,
                decision: 0,
                other: 0
            },
            losses: {
                ko: 0,
                tko: 0,
                submission: 0,
                decision: 0,
                other: 0
            }
        },
        streaks: {
            current: 0,
            currentType: null,
            longestWin:
                safeNumber(
                    options.longestWin,
                    0
                ),
            longestLoss:
                safeNumber(
                    options.longestLoss,
                    0
                )
        },
        title: {
            fights: 0,
            wins: 0,
            losses: 0,
            defenses: 0
        },
        fights: [],
        records: {
            fastestWinSeconds: null,
            longestFightSeconds: 0,
            mostWinsInYear: 0,
            mostFightsInYear: 0,
            longestWinStreak: 0,
            longestLossStreak: 0
        }
    };
}
// ============================================================
// NORMALIZE RESULT
// ============================================================
export function normalizeResult(result) {
    const value =
        normalizeText(result);
    if (
        [
            "win",
            "w",
            "victory",
            "vitoria",
            "vitória"
        ].includes(value)
    ) {
        return RECORD_RESULT.WIN;
    }
    if (
        [
            "loss",
            "l",
            "defeat",
            "derrota"
        ].includes(value)
    ) {
        return RECORD_RESULT.LOSS;
    }
    if (
        [
            "draw",
            "d",
            "empate"
        ].includes(value)
    ) {
        return RECORD_RESULT.DRAW;
    }
    if (
        [
            "nc",
            "no contest",
            "no_contest",
            "nocontest"
        ].includes(value)
    ) {
        return RECORD_RESULT.NO_CONTEST;
    }
    return RECORD_RESULT.OTHER;
}
// ============================================================
// NORMALIZE METHOD
// ============================================================
export function normalizeMethod(method) {
    const value =
        normalizeText(method);
    if (
        [
            "ko",
            "knockout"
        ].includes(value)
    ) {
        return RECORD_METHOD.KO;
    }
    if (
        [
            "tko",
            "technical knockout",
            "technical_knockout"
        ].includes(value)
    ) {
        return RECORD_METHOD.TKO;
    }
    if (
        [
            "submission",
            "sub",
            "finalizacao",
            "finalização"
        ].includes(value)
    ) {
        return RECORD_METHOD.SUBMISSION;
    }
    if (
        [
            "decision",
            "decisão",
            "decision_win"
        ].includes(value)
    ) {
        return RECORD_METHOD.DECISION;
    }
    if (
        [
            "split decision",
            "split_decision"
        ].includes(value)
    ) {
        return RECORD_METHOD.SPLIT_DECISION;
    }
    if (
        [
            "unanimous decision",
            "unanimous_decision"
        ].includes(value)
    ) {
        return RECORD_METHOD.UNANIMOUS_DECISION;
    }
    if (
        [
            "majority decision",
            "majority_decision"
        ].includes(value)
    ) {
        return RECORD_METHOD.MAJORITY_DECISION;
    }
    if (
        [
            "technical decision",
            "technical_decision"
        ].includes(value)
    ) {
        return RECORD_METHOD.TECHNICAL_DECISION;
    }
    if (
        [
            "draw",
            "empate"
        ].includes(value)
    ) {
        return RECORD_METHOD.DRAW;
    }
    if (
        [
            "no contest",
            "no_contest",
            "nc"
        ].includes(value)
    ) {
        return RECORD_METHOD.NO_CONTEST;
    }
    return RECORD_METHOD.OTHER;
}
// ============================================================
// NORMALIZE FIGHT LEVEL
// ============================================================
export function normalizeLevel(level) {
    const value =
        normalizeText(level);
    if (
        value === "amateur" ||
        value === "amadora" ||
        value === "amador"
    ) {
        return RECORD_LEVEL.AMATEUR;
    }
    if (
        value === "regional"
    ) {
        return RECORD_LEVEL.REGIONAL;
    }
    if (
        value === "national"
    ) {
        return RECORD_LEVEL.NATIONAL;
    }
    if (
        value === "international"
    ) {
        return RECORD_LEVEL.INTERNATIONAL;
    }
    if (
        value === "elite" ||
        value === "ufc"
    ) {
        return RECORD_LEVEL.ELITE;
    }
    return RECORD_LEVEL.PROFESSIONAL;
}
// ============================================================
// NORMALIZE FIGHT TYPE
// ============================================================
export function normalizeFightType(
    type
) {
    const value =
        normalizeText(type);
    if (
        value === "title" ||
        value === "title fight" ||
        value === "disputa de titulo" ||
        value === "disputa de título"
    ) {
        return RECORD_FIGHT_TYPE.TITLE;
    }
    if (
        value === "title defense" ||
        value === "title_defense" ||
        value === "defesa de titulo" ||
        value === "defesa de título"
    ) {
        return RECORD_FIGHT_TYPE.TITLE_DEFENSE;
    }
    if (
        value === "interim" ||
        value === "interim title" ||
        value === "interim_title"
    ) {
        return RECORD_FIGHT_TYPE.INTERIM_TITLE;
    }
    if (
        value === "unification" ||
        value === "unificação" ||
        value === "unificacao"
    ) {
        return RECORD_FIGHT_TYPE.UNIFICATION;
    }
    if (
        value === "tournament" ||
        value === "torneio"
    ) {
        return RECORD_FIGHT_TYPE.TOURNAMENT;
    }
    if (
        value === "grand prix" ||
        value === "grand_prix"
    ) {
        return RECORD_FIGHT_TYPE.GRAND_PRIX;
    }
    if (
        value === "debut" ||
        value === "estreia"
    ) {
        return RECORD_FIGHT_TYPE.DEBUT;
    }
    if (
        value === "exhibition" ||
        value === "exibicao" ||
        value === "exibição"
    ) {
        return RECORD_FIGHT_TYPE.EXHIBITION;
    }
    if (
        value === "special" ||
        value === "especial"
    ) {
        return RECORD_FIGHT_TYPE.SPECIAL;
    }
    return RECORD_FIGHT_TYPE.NORMAL;
}
// ============================================================
// CREATE FIGHT RECORD
// ============================================================
export function createFightRecord(
    options = {}
) {
    const result =
        normalizeResult(
            options.result
        );
    const method =
        normalizeMethod(
            options.method
        );
    const level =
        normalizeLevel(
            options.level
        );
    const fightType =
        normalizeFightType(
            options.fightType
        );
    return {
        id:
            options.id ||
            createId("fight"),
        date:
            options.date ||
            null,
        eventId:
            options.eventId ||
            null,
        eventName:
            options.eventName ||
            null,
        promotionId:
            options.promotionId ||
            null,
        promotionName:
            options.promotionName ||
            null,
        fighterId:
            options.fighterId ||
            null,
        fighterName:
            options.fighterName ||
            null,
        opponentId:
            options.opponentId ||
            null,
        opponentName:
            options.opponentName ||
            null,
        result,
        method,
        level,
        fightType,
        division:
            options.division ||
            null,
        weight:
            options.weight ??
            null,
        rounds:
            safeNumber(
                options.rounds,
                0
            ),
        round:
            safeNumber(
                options.round,
                0
            ),
        time:
            options.time ||
            null,
        durationSeconds:
            safeNumber(
                options.durationSeconds,
                0
            ),
        titleFight:
            Boolean(
                options.titleFight
            ),
        titleId:
            options.titleId ||
            null,
        titleName:
            options.titleName ||
            null,
        titleDefense:
            Boolean(
                options.titleDefense
            ),
        tournament:
            Boolean(
                options.tournament
            ),
        tournamentId:
            options.tournamentId ||
            null,
        rankingBefore:
            options.rankingBefore ??
            null,
        rankingAfter:
            options.rankingAfter ??
            null,
        opponentRanking:
            options.opponentRanking ??
            null,
        opponentOVR:
            options.opponentOVR ??
            null,
        fighterOVR:
            options.fighterOVR ??
            null,
        notes:
            options.notes ||
            null
    };
}
// ============================================================
// APPLY RECORD RESULT
// ============================================================
export function applyResult(
    record,
    result,
    method
) {
    const normalizedResult =
        normalizeResult(
            result
        );
    const normalizedMethod =
        normalizeMethod(
            method
        );
    if (
        normalizedResult ===
        RECORD_RESULT.WIN
    ) {
        record.wins += 1;
        incrementMethod(
            record,
            "wins",
            normalizedMethod
        );
    }
    else if (
        normalizedResult ===
        RECORD_RESULT.LOSS
    ) {
        record.losses += 1;
        incrementMethod(
            record,
            "losses",
            normalizedMethod
        );
    }
    else if (
        normalizedResult ===
        RECORD_RESULT.DRAW
    ) {
        record.draws += 1;
    }
    else if (
        normalizedResult ===
        RECORD_RESULT.NO_CONTEST
    ) {
        record.noContests += 1;
    }
    record.total += 1;
    return record;
}
// ============================================================
// INCREMENT METHOD
// ============================================================
function incrementMethod(
    recordBook,
    category,
    method
) {
    if (
        !recordBook.byMethod
    ) {
        return;
    }
    if (
        !recordBook.byMethod[
            category
        ]
    ) {
        return;
    }
    if (
        [
            RECORD_METHOD.KO,
            RECORD_METHOD.TKO
        ].includes(method)
    ) {
        recordBook.byMethod[
            category
        ].ko += 1;
        if (
            method ===
            RECORD_METHOD.TKO
        ) {
            recordBook.byMethod[
                category
            ].tko += 1;
        }
        return;
    }
    if (
        method ===
        RECORD_METHOD.SUBMISSION
    ) {
        recordBook.byMethod[
            category
        ].submission += 1;
        return;
    }
    if (
        [
            RECORD_METHOD.DECISION,
            RECORD_METHOD.SPLIT_DECISION,
            RECORD_METHOD.UNANIMOUS_DECISION,
            RECORD_METHOD.MAJORITY_DECISION,
            RECORD_METHOD.TECHNICAL_DECISION
        ].includes(method)
    ) {
        recordBook.byMethod[
            category
        ].decision += 1;
        return;
    }
    recordBook.byMethod[
        category
    ].other += 1;
}
// ============================================================
// UPDATE STREAK
// ============================================================
export function updateStreaks(
    recordBook,
    result
) {
    const normalized =
        normalizeResult(
            result
        );
    if (
        normalized !==
            RECORD_RESULT.WIN &&
        normalized !==
            RECORD_RESULT.LOSS
    ) {
        return recordBook;
    }
    if (
        recordBook.streaks.currentType ===
        normalized
    ) {
        recordBook.streaks.current += 1;
    } else {
        recordBook.streaks.current =
            1;
        recordBook.streaks.currentType =
            normalized;
    }
    if (
        normalized ===
        RECORD_RESULT.WIN
    ) {
        recordBook.streaks.longestWin =
            Math.max(
                recordBook.streaks.longestWin,
                recordBook.streaks.current
            );
        recordBook.records.longestWinStreak =
            Math.max(
                recordBook.records.longestWinStreak,
                recordBook.streaks.current
            );
    }
    if (
        normalized ===
        RECORD_RESULT.LOSS
    ) {
        recordBook.streaks.longestLoss =
            Math.max(
                recordBook.streaks.longestLoss,
                recordBook.streaks.current
            );
        recordBook.records.longestLossStreak =
            Math.max(
                recordBook.records.longestLossStreak,
                recordBook.streaks.current
            );
    }
    return recordBook;
}
// ============================================================
// REGISTER FIGHT
// ============================================================
export function registerFight(
    recordBook,
    options = {}
) {
    if (
        !recordBook ||
        typeof recordBook !==
            "object"
    ) {
        return {
            success: false,
            reason:
                "record_book_missing"
        };
    }
    const fight =
        createFightRecord(
            options
        );
    const result =
        fight.result;
    const level =
        fight.level;
    /*
     * Histórico
     */
    recordBook.fights.push(
        fight
    );
    /*
     * Geral
     */
    applyResult(
        recordBook.overall,
        result,
        fight.method
    );
    /*
     * Amador
     */
    if (
        level ===
        RECORD_LEVEL.AMATEUR
    ) {
        applyResult(
            recordBook.amateur,
            result,
            fight.method
        );
    } else {
        applyResult(
            recordBook.professional,
            result,
            fight.method
        );
    }
    /*
     * Sequência
     */
    updateStreaks(
        recordBook,
        result
    );
    /*
     * Disputa de título
     */
    if (
        fight.titleFight ||
        [
            RECORD_FIGHT_TYPE.TITLE,
            RECORD_FIGHT_TYPE.TITLE_DEFENSE,
            RECORD_FIGHT_TYPE.INTERIM_TITLE,
            RECORD_FIGHT_TYPE.UNIFICATION
        ].includes(
            fight.fightType
        )
    ) {
        recordBook.title.fights += 1;
        if (
            result ===
            RECORD_RESULT.WIN
        ) {
            recordBook.title.wins += 1;
        }
        if (
            result ===
            RECORD_RESULT.LOSS
        ) {
            recordBook.title.losses += 1;
        }
        if (
            fight.titleDefense
        ) {
            recordBook.title.defenses += 1;
        }
    }
    /*
     * Recorde de duração.
     */
    if (
        fight.durationSeconds > 0
    ) {
        recordBook.records.longestFightSeconds =
            Math.max(
                recordBook.records.longestFightSeconds,
                fight.durationSeconds
            );
        if (
            result ===
                RECORD_RESULT.WIN &&
            (
                recordBook.records
                    .fastestWinSeconds ===
                    null ||
                fight.durationSeconds <
                    recordBook.records
                        .fastestWinSeconds
            )
        ) {
            recordBook.records.fastestWinSeconds =
                fight.durationSeconds;
        }
    }
    updateYearlyRecords(
        recordBook
    );
    return {
        success: true,
        fight,
        recordBook
    };
}
// ============================================================
// YEARLY RECORDS
// ============================================================
export function updateYearlyRecords(
    recordBook
) {
    const fightsByYear =
        {};
    for (
        const fight of
        recordBook.fights
    ) {
        if (
            !fight.date
        ) {
            continue;
        }
        const year =
            String(
                fight.date
            ).slice(0, 4);
        if (
            !fightsByYear[year]
        ) {
            fightsByYear[year] = {
                fights: 0,
                wins: 0
            };
        }
        fightsByYear[year]
            .fights += 1;
        if (
            fight.result ===
            RECORD_RESULT.WIN
        ) {
            fightsByYear[year]
                .wins += 1;
        }
    }
    for (
        const year of
        Object.keys(
            fightsByYear
        )
    ) {
        recordBook.records
            .mostFightsInYear =
            Math.max(
                recordBook.records
                    .mostFightsInYear,
                fightsByYear[year]
                    .fights
            );
        recordBook.records
            .mostWinsInYear =
            Math.max(
                recordBook.records
                    .mostWinsInYear,
                fightsByYear[year]
                    .wins
            );
    }
    return recordBook;
}
// ============================================================
// GET RECORD
// ============================================================
export function getRecord(
    recordBook,
    type = "overall"
) {
    if (
        !recordBook
    ) {
        return createEmptyRecord();
    }
    return clone(
        recordBook[type] ||
        recordBook.overall ||
        createEmptyRecord()
    );
}
// ============================================================
// RECORD STRING
// ============================================================
export function formatRecord(
    record
) {
    if (
        !record
    ) {
        return "0-0-0";
    }
    const wins =
        safeNumber(
            record.wins,
            0
        );
    const losses =
        safeNumber(
            record.losses,
            0
        );
    const draws =
        safeNumber(
            record.draws,
            0
        );
    return `${wins}-${losses}-${draws}`;
}
export function formatRecordWithNC(
    record
) {
    if (
        !record
    ) {
        return "0-0-0 (0 NC)";
    }
    return `${formatRecord(record)} (${safeNumber(record.noContests, 0)} NC)`;
}
// ============================================================
// WIN PERCENTAGE
// ============================================================
export function getWinPercentage(
    record
) {
    if (
        !record
    ) {
        return 0;
    }
    const wins =
        safeNumber(
            record.wins,
            0
        );
    const losses =
        safeNumber(
            record.losses,
            0
        );
    const draws =
        safeNumber(
            record.draws,
            0
        );
    const total =
        wins +
        losses +
        draws;
    if (
        total <= 0
    ) {
        return 0;
    }
    return (
        wins /
        total
    ) * 100;
}
// ============================================================
// FIGHTS BY RESULT
// ============================================================
export function getFightsByResult(
    recordBook,
    result
) {
    if (
        !recordBook
    ) {
        return [];
    }
    const normalized =
        normalizeResult(
            result
        );
    return recordBook.fights.filter(
        fight =>
            fight.result ===
            normalized
    );
}
// ============================================================
// FIGHTS BY PROMOTION
// ============================================================
export function getFightsByPromotion(
    recordBook,
    promotionId
) {
    if (
        !recordBook
    ) {
        return [];
    }
    return recordBook.fights.filter(
        fight =>
            String(
                fight.promotionId
            ) ===
            String(
                promotionId
            )
    );
}
// ============================================================
// FIGHTS BY LEVEL
// ============================================================
export function getFightsByLevel(
    recordBook,
    level
) {
    if (
        !recordBook
    ) {
        return [];
    }
    const normalized =
        normalizeLevel(
            level
        );
    return recordBook.fights.filter(
        fight =>
            fight.level ===
            normalized
    );
}
// ============================================================
// FIGHTS BY DIVISION
// ============================================================
export function getFightsByDivision(
    recordBook,
    division
) {
    if (
        !recordBook
    ) {
        return [];
    }
    return recordBook.fights.filter(
        fight =>
            normalizeText(
                fight.division
            ) ===
            normalizeText(
                division
            )
    );
}
// ============================================================
// FIGHTS BY OPPONENT
// ============================================================
export function getFightsAgainst(
    recordBook,
    opponentId
) {
    if (
        !recordBook
    ) {
        return [];
    }
    return recordBook.fights.filter(
        fight =>
            String(
                fight.opponentId
            ) ===
            String(
                opponentId
            )
    );
}
// ============================================================
// TITLE FIGHTS
// ============================================================
export function getTitleFights(
    recordBook
) {
    if (
        !recordBook
    ) {
        return [];
    }
    return recordBook.fights.filter(
        fight =>
            fight.titleFight ||
            [
                RECORD_FIGHT_TYPE.TITLE,
                RECORD_FIGHT_TYPE.TITLE_DEFENSE,
                RECORD_FIGHT_TYPE.INTERIM_TITLE,
                RECORD_FIGHT_TYPE.UNIFICATION
            ].includes(
                fight.fightType
            )
    );
}
// ============================================================
// TITLE DEFENSES
// ============================================================
export function getTitleDefenses(
    recordBook
) {
    return getTitleFights(
        recordBook
    ).filter(
        fight =>
            fight.titleDefense ||
            fight.fightType ===
                RECORD_FIGHT_TYPE.TITLE_DEFENSE
    );
}
// ============================================================
// METHOD STATISTICS
// ============================================================
export function getMethodStatistics(
    recordBook
) {
    if (
        !recordBook
    ) {
        return {
            wins: {},
            losses: {}
        };
    }
    return clone(
        recordBook.byMethod
    );
}
// ============================================================
// CURRENT STREAK
// ============================================================
export function getCurrentStreak(
    recordBook
) {
    if (
        !recordBook?.streaks
    ) {
        return {
            count: 0,
            type: null
        };
    }
    return {
        count:
            recordBook.streaks
                .current,
        type:
            recordBook.streaks
                .currentType
    };
}
// ============================================================
// CAREER STATISTICS
// ============================================================
export function getCareerStatistics(
    recordBook
) {
    if (
        !recordBook
    ) {
        return null;
    }
    const overall =
        recordBook.overall;
    return {
        totalFights:
            overall.total,
        wins:
            overall.wins,
        losses:
            overall.losses,
        draws:
            overall.draws,
        noContests:
            overall.noContests,
        record:
            formatRecord(
                overall
            ),
        recordWithNC:
            formatRecordWithNC(
                overall
            ),
        winPercentage:
            Number(
                getWinPercentage(
                    overall
                ).toFixed(2)
            ),
        longestWinStreak:
            recordBook.records
                .longestWinStreak,
        longestLossStreak:
            recordBook.records
                .longestLossStreak,
        currentStreak:
            getCurrentStreak(
                recordBook
            ),
        titleFights:
            recordBook.title.fights,
        titleWins:
            recordBook.title.wins,
        titleLosses:
            recordBook.title.losses,
        titleDefenses:
            recordBook.title.defenses,
        fastestWinSeconds:
            recordBook.records
                .fastestWinSeconds,
        longestFightSeconds:
            recordBook.records
                .longestFightSeconds
    };
}
// ============================================================
// CAREER RECORDS / ACHIEVEMENTS
// ============================================================
export function getCareerRecords(
    recordBook
) {
    if (
        !recordBook
    ) {
        return [];
    }
    const records = [];
    if (
        recordBook.records
            .longestWinStreak > 0
    ) {
        records.push({
            type:
                "longest_win_streak",
            value:
                recordBook.records
                    .longestWinStreak
        });
    }
    if (
        recordBook.records
            .longestLossStreak > 0
    ) {
        records.push({
            type:
                "longest_loss_streak",
            value:
                recordBook.records
                    .longestLossStreak
        });
    }
    if (
        recordBook.title
            .defenses > 0
    ) {
        records.push({
            type:
                "title_defenses",
            value:
                recordBook.title
                    .defenses
        });
    }
    if (
        recordBook.overall
            .wins > 0
    ) {
        records.push({
            type:
                "career_wins",
            value:
                recordBook.overall
                    .wins
        });
    }
    return records;
}
// ============================================================
// RECORD BY PROMOTION
// ============================================================
export function getPromotionRecord(
    recordBook,
    promotionId
) {
    const fights =
        getFightsByPromotion(
            recordBook,
            promotionId
        );
    const record =
        createEmptyRecord();
    for (
        const fight of fights
    ) {
        applyResult(
            record,
            fight.result,
            fight.method
        );
    }
    return {
        record,
        formatted:
            formatRecord(
                record
            ),
        fights
    };
}
// ============================================================
// RECORD BY DIVISION
// ============================================================
export function getDivisionRecord(
    recordBook,
    division
) {
    const fights =
        getFightsByDivision(
            recordBook,
            division
        );
    const record =
        createEmptyRecord();
    for (
        const fight of fights
    ) {
        applyResult(
            record,
            fight.result,
            fight.method
        );
    }
    return {
        record,
        formatted:
            formatRecord(
                record
            ),
        fights
    };
}
// ============================================================
// RECORD AGAINST OPPONENT
// ============================================================
export function getOpponentRecord(
    recordBook,
    opponentId
) {
    const fights =
        getFightsAgainst(
            recordBook,
            opponentId
        );
    const record =
        createEmptyRecord();
    for (
        const fight of fights
    ) {
        applyResult(
            record,
            fight.result,
            fight.method
        );
    }
    return {
        record,
        formatted:
            formatRecord(
                record
            ),
        fights
    };
}
// ============================================================
// LAST FIGHTS
// ============================================================
export function getLastFights(
    recordBook,
    count = 5
) {
    if (
        !recordBook
    ) {
        return [];
    }
    const amount =
        Math.max(
            0,
            safeNumber(
                count,
                5
            )
        );
    return recordBook.fights
        .slice(-amount)
        .reverse();
}
// ============================================================
// LAST RESULT
// ============================================================
export function getLastResult(
    recordBook
) {
    const fights =
        getLastFights(
            recordBook,
            1
        );
    return fights[0] ||
        null;
}
// ============================================================
// RECENT FORM
// ============================================================
export function getRecentForm(
    recordBook,
    count = 5
) {
    return getLastFights(
        recordBook,
        count
    ).map(
        fight =>
            fight.result
    );
}
// ============================================================
// HAS FOUGHT
// ============================================================
export function hasFought(
    recordBook,
    opponentId
) {
    return getFightsAgainst(
        recordBook,
        opponentId
    ).length > 0;
}
// ============================================================
// COUNT WINS
// ============================================================
export function countWins(
    recordBook
) {
    return safeNumber(
        recordBook?.overall?.wins,
        0
    );
}
export function countLosses(
    recordBook
) {
    return safeNumber(
        recordBook?.overall?.losses,
        0
    );
}
export function countDraws(
    recordBook
) {
    return safeNumber(
        recordBook?.overall?.draws,
        0
    );
}
export function countNoContests(
    recordBook
) {
    return safeNumber(
        recordBook?.overall?.noContests,
        0
    );
}
// ============================================================
// VALIDATION
// ============================================================
export function validateRecordBook(
    recordBook
) {
    const errors = [];
    if (
        !recordBook ||
        typeof recordBook !==
            "object"
    ) {
        return {
            valid: false,
            errors: [
                "record_book_missing"
            ]
        };
    }
    const sections = [
        "amateur",
        "professional",
        "overall"
    ];
    for (
        const section of sections
    ) {
        if (
            !recordBook[section]
        ) {
            errors.push(
                `${section}_missing`
            );
            continue;
        }
        for (
            const field of [
                "wins",
                "losses",
                "draws",
                "noContests",
                "total"
            ]
        ) {
            if (
                safeNumber(
                    recordBook[
                        section
                    ][field],
                    -1
                ) < 0
            ) {
                errors.push(
                    `${section}_${field}_invalid`
                );
            }
        }
    }
    if (
        !Array.isArray(
            recordBook.fights
        )
    ) {
        errors.push(
            "fights_invalid"
        );
    }
    return {
        valid:
            errors.length === 0,
        errors
    };
}
// ============================================================
// REBUILD RECORD BOOK
// ============================================================
export function rebuildRecordBook(
    fights = []
) {
    const recordBook =
        createRecordBook();
    for (
        const fight of fights
    ) {
        registerFight(
            recordBook,
            fight
        );
    }
    return recordBook;
}
// ============================================================
// SYNC PLAYER RECORD
// ============================================================
export function syncPlayerRecord(
    player,
    recordBook
) {
    if (
        !player ||
        !recordBook
    ) {
        return false;
    }
    if (
        !player.record ||
        typeof player.record !==
            "object"
    ) {
        player.record = {};
    }
    const overall =
        recordBook.overall;
    player.record.wins =
        overall.wins;
    player.record.losses =
        overall.losses;
    player.record.draws =
        overall.draws;
    player.record.noContests =
        overall.noContests;
    player.record.total =
        overall.total;
    player.record.formatted =
        formatRecord(
            overall
        );
    return true;
}
// ============================================================
// SNAPSHOT / CLONE
// ============================================================
export function cloneRecordBook(
    recordBook
) {
    return clone(
        recordBook
    );
}
export function snapshotRecordBook(
    recordBook
) {
    return clone(
        recordBook
    );
}
// ============================================================
// DEFAULT EXPORT
// ============================================================
export default {
    RECORDS_VERSION,
    RECORD_RESULT,
    RECORD_METHOD,
    RECORD_LEVEL,
    RECORD_FIGHT_TYPE,
    createEmptyRecord,
    createRecordBook,
    createFightRecord,
    normalizeResult,
    normalizeMethod,
    normalizeLevel,
    normalizeFightType,
    applyResult,
    updateStreaks,
    registerFight,
    getRecord,
    formatRecord,
    formatRecordWithNC,
    getWinPercentage,
    getFightsByResult,
    getFightsByPromotion,
    getFightsByLevel,
    getFightsByDivision,
    getFightsAgainst,
    getTitleFights,
    getTitleDefenses,
    getMethodStatistics,
    getCurrentStreak,
    getCareerStatistics,
    getCareerRecords,
    getPromotionRecord,
    getDivisionRecord,
    getOpponentRecord,
    getLastFights,
    getLastResult,
    getRecentForm,
    hasFought,
    countWins,
    countLosses,
    countDraws,
    countNoContests,
    updateYearlyRecords,
    validateRecordBook,
    rebuildRecordBook,
    syncPlayerRecord,
    cloneRecordBook,
    snapshotRecordBook
};
