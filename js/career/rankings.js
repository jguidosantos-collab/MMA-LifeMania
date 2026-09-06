// ============================================================
// MMA LIFE DYNASTY
// js/career/rankings.js
// ============================================================

import {
    RANKING_CONFIG
} from "../core/constants.js";

import {
    getProfessionalCareer,
    getProfessionalStage,
    getProfessionalRecord,
    getProfessionalWinRate
} from "./professional.js";

import {
    getOVR
} from "../mma/matchup.js";

// ============================================================
// VERSION
// ============================================================

export const RANKINGS_VERSION = 1;

// ============================================================
// CONSTANTS
// ============================================================

export const RANKING_MIN = 1;
export const RANKING_MAX = 15;

export const RANKING_CHAMPION = 0;

export const RANKING_STATUS = Object.freeze({
    ACTIVE: "active",
    INACTIVE: "inactive",
    VACANT: "vacant"
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

function clamp(value, min, max) {
    return Math.max(
        min,
        Math.min(
            max,
            safeNumber(value, min)
        )
    );
}

function round(value, decimals = 2) {
    const multiplier = 10 ** decimals;

    return Math.round(
        safeNumber(value) * multiplier
    ) / multiplier;
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

function createId(prefix = "ranking") {
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

// ============================================================
// RANKING CONFIG
// ============================================================

const DEFAULT_RANKING_CONFIG = {
    maxRank: RANKING_MAX,

    championRank: RANKING_CHAMPION,

    winPoints: 20,

    lossPoints: -8,

    drawPoints: 3,

    noContestPoints: 0,

    titleWinBonus: 35,

    topFiveBonus: 15,

    topTenBonus: 8,

    eliteOpponentBonus: 15,

    mainEventBonus: 5,

    activityDecay: 2,

    inactivityDays: 180,

    inactivityPenalty: 5,

    minimumOVRForRanking: 45
};

function getRankingConfig(options = {}) {
    return {
        ...DEFAULT_RANKING_CONFIG,

        ...(RANKING_CONFIG || {}),

        ...(options.config || {})
    };
}

// ============================================================
// RANKING ENTRY
// ============================================================

export function createRankingEntry(options = {}) {
    return {
        id:
            options.id ||
            createId("rankingEntry"),

        fighterId:
            options.fighterId ||
            null,

        fighterName:
            options.fighterName ||
            null,

        promotionId:
            options.promotionId ||
            null,

        division:
            options.division ||
            null,

        rank:
            options.rank ??
            null,

        points:
            safeNumber(
                options.points,
                0
            ),

        previousRank:
            options.previousRank ??
            null,

        previousPoints:
            safeNumber(
                options.previousPoints,
                0
            ),

        movement:
            safeNumber(
                options.movement,
                0
            ),

        status:
            options.status ||
            RANKING_STATUS.ACTIVE,

        champion:
            options.champion ??
            false,

        active:
            options.active ??
            true,

        lastFightDate:
            options.lastFightDate ||
            null,

        updatedAt:
            options.updatedAt ||
            null
    };
}

// ============================================================
// RANKING DATABASE
// ============================================================

export function createRankingDatabase() {
    return {
        version:
            RANKINGS_VERSION,

        divisions: {},

        history: [],

        lastUpdate:
            null
    };
}

// ============================================================
// PLAYER DATA
// ============================================================

function getPlayerId(player) {
    return (
        player?.id ||
        player?.identity?.id ||
        null
    );
}

function getPlayerName(player) {
    return (
        player?.name ||
        player?.identity?.name ||
        player?.identity?.fullName ||
        "Unknown Fighter"
    );
}

function getPlayerPromotionId(player) {
    return (
        player?.career?.professional
            ?.currentPromotionId ||

        player?.career?.currentPromotionId ||

        player?.promotionId ||

        null
    );
}

function getPlayerDivision(player) {
    return (
        player?.career?.professional
            ?.currentDivision ||

        player?.career?.currentDivision ||

        player?.physical?.weightClass ||

        player?.weightClass ||

        null
    );
}

function getPlayerOVR(player) {
    try {
        return safeNumber(
            getOVR(player),
            0
        );
    } catch {
        return safeNumber(
            player?.ovr,
            0
        );
    }
}

// ============================================================
// RANKING ELIGIBILITY
// ============================================================

export function isEligibleForRanking(
    player,
    options = {}
) {
    if (!player) {
        return {
            eligible: false,
            reason: "fighter_missing"
        };
    }

    const professional =
        getProfessionalCareer(
            player
        );

    if (
        !professional
    ) {
        return {
            eligible: false,
            reason:
                "professional_career_missing"
        };
    }

    if (
        !professional.active
    ) {
        return {
            eligible: false,
            reason:
                "professional_career_inactive"
        };
    }

    const stage =
        getProfessionalStage(
            player
        );

    if (
        stage === "Amateur"
    ) {
        return {
            eligible: false,
            reason:
                "amateur_fighter"
        };
    }

    const division =
        getPlayerDivision(
            player
        );

    if (!division) {
        return {
            eligible: false,
            reason:
                "division_missing"
        };
    }

    const ovr =
        getPlayerOVR(
            player
        );

    const config =
        getRankingConfig(
            options
        );

    if (
        ovr <
        config.minimumOVRForRanking
    ) {
        return {
            eligible: false,
            reason:
                "ovr_too_low",

            ovr,

            minimumOVR:
                config.minimumOVRForRanking
        };
    }

    return {
        eligible: true,
        reason: null,

        division,

        promotionId:
            getPlayerPromotionId(
                player
            ),

        ovr
    };
}

// ============================================================
// RANKING SCORE
// ============================================================

export function calculateRankingScore(
    player,
    options = {}
) {
    const config =
        getRankingConfig(
            options
        );

    if (!player) {
        return 0;
    }

    const professional =
        getProfessionalCareer(
            player
        );

    const record =
        getProfessionalRecord(
            player
        );

    const winRate =
        getProfessionalWinRate(
            player
        );

    const ovr =
        getPlayerOVR(
            player
        );

    const rankingPoints =
        safeNumber(
            professional?.rankingPoints,
            0
        );

    const experience =
        safeNumber(
            professional?.experience,
            0
        );

    let score = 0;

    /*
     * Qualidade técnica.
     */
    score +=
        ovr * 2;

    /*
     * Experiência profissional.
     */
    score +=
        experience * 0.5;

    /*
     * Aproveitamento.
     */
    score +=
        winRate * 100;

    /*
     * Volume de lutas.
     */
    score +=
        Math.min(
            record.fights * 4,
            60
        );

    /*
     * Pontos já conquistados.
     */
    score +=
        rankingPoints;

    /*
     * Títulos.
     */
    const titles =
        professional?.titles || [];

    const activeTitles =
        titles.filter(
            title =>
                title.active !== false
        );

    score +=
        activeTitles.length * 100;

    /*
     * Bônus por estágio.
     */
    const stage =
        getProfessionalStage(
            player
        );

    if (
        stage === "National"
    ) {
        score += 20;
    }

    if (
        stage === "International"
    ) {
        score += 50;
    }

    if (
        stage === "Elite"
    ) {
        score += 100;
    }

    /*
     * Evita scores negativos.
     */
    return round(
        Math.max(
            0,
            score
        ),
        2
    );
}

// ============================================================
// FIGHT RESULT IMPACT
// ============================================================

export function calculateRankingImpact(
    result,
    options = {}
) {
    const config =
        getRankingConfig(
            options
        );

    const normalized =
        String(
            result || ""
        )
            .trim()
            .toLowerCase()
            .replace(/[\s-]+/g, "_");

    let points = 0;

    if (
        normalized === "win" ||
        normalized === "won"
    ) {
        points =
            config.winPoints;
    } else if (
        normalized === "loss" ||
        normalized === "lost"
    ) {
        points =
            config.lossPoints;
    } else if (
        normalized === "draw"
    ) {
        points =
            config.drawPoints;
    } else if (
        normalized === "nc" ||
        normalized === "no_contest" ||
        normalized === "nocontest"
    ) {
        points =
            config.noContestPoints;
    }

    const opponentRank =
        safeNumber(
            options.opponentRank,
            0
        );

    if (
        normalized === "win"
    ) {
        if (
            opponentRank >= 1 &&
            opponentRank <= 5
        ) {
            points +=
                config.topFiveBonus;
        } else if (
            opponentRank >= 6 &&
            opponentRank <= 10
        ) {
            points +=
                config.topTenBonus;
        }
    }

    if (
        options.eliteOpponent
    ) {
        points +=
            config.eliteOpponentBonus;
    }

    if (
        options.titleFight
    ) {
        points +=
            config.titleWinBonus;
    }

    if (
        options.mainEvent
    ) {
        points +=
            config.mainEventBonus;
    }

    return round(
        points,
        2
    );
}

// ============================================================
// UPDATE FIGHTER POINTS
// ============================================================

export function updateFighterRankingPoints(
    player,
    result,
    options = {}
) {
    const professional =
        getProfessionalCareer(
            player
        );

    if (
        !professional
    ) {
        return {
            success: false,
            reason:
                "professional_career_missing"
        };
    }

    const impact =
        calculateRankingImpact(
            result,
            options
        );

    professional.rankingPoints =
        Math.max(
            0,
            safeNumber(
                professional.rankingPoints,
                0
            ) + impact
        );

    return {
        success: true,

        impact,

        points:
            professional.rankingPoints
    };
}

// ============================================================
// DIVISION KEY
// ============================================================

export function createDivisionKey(
    promotionId,
    division
) {
    return (
        String(
            promotionId ||
            "global"
        ) +
        "::" +
        String(
            division ||
            "unknown"
        )
    );
}

// ============================================================
// GET DIVISION RANKING
// ============================================================

export function getDivisionRanking(
    database,
    promotionId,
    division
) {
    if (
        !database?.divisions
    ) {
        return [];
    }

    const key =
        createDivisionKey(
            promotionId,
            division
        );

    return (
        database.divisions[key] ||
        []
    );
}

// ============================================================
// SET DIVISION RANKING
// ============================================================

export function setDivisionRanking(
    database,
    promotionId,
    division,
    ranking
) {
    if (
        !database.divisions
    ) {
        database.divisions = {};
    }

    const key =
        createDivisionKey(
            promotionId,
            division
        );

    database.divisions[key] =
        Array.isArray(ranking)
            ? ranking
            : [];

    return database.divisions[key];
}

// ============================================================
// ADD FIGHTER
// ============================================================

export function addFighterToRanking(
    database,
    player,
    options = {}
) {
    if (
        !database
    ) {
        return {
            success: false,
            reason:
                "database_missing"
        };
    }

    const eligibility =
        isEligibleForRanking(
            player,
            options
        );

    if (
        !eligibility.eligible &&
        !options.force
    ) {
        return {
            success: false,
            reason:
                eligibility.reason
        };
    }

    const promotionId =
        options.promotionId ??
        getPlayerPromotionId(
            player
        );

    const division =
        options.division ??
        getPlayerDivision(
            player
        );

    if (
        !division &&
        !options.force
    ) {
        return {
            success: false,
            reason:
                "division_missing"
        };
    }

    const ranking =
        getDivisionRanking(
            database,
            promotionId,
            division
        );

    const fighterId =
        getPlayerId(
            player
        );

    const existing =
        ranking.find(
            entry =>
                String(
                    entry.fighterId
                ) ===
                String(
                    fighterId
                )
        );

    if (
        existing
    ) {
        return {
            success: true,
            existing: true,
            entry: existing
        };
    }

    const professional =
        getProfessionalCareer(
            player
        );

    const entry =
        createRankingEntry({
            fighterId,

            fighterName:
                getPlayerName(
                    player
                ),

            promotionId,

            division,

            rank: null,

            points:
                safeNumber(
                    professional?.rankingPoints,
                    0
                ),

            lastFightDate:
                professional?.lastFightDate ||
                null
        });

    ranking.push(
        entry
    );

    setDivisionRanking(
        database,
        promotionId,
        division,
        ranking
    );

    return {
        success: true,

        existing: false,

        entry
    };
}

// ============================================================
// REMOVE FIGHTER
// ============================================================

export function removeFighterFromRanking(
    database,
    fighterId,
    promotionId,
    division
) {
    const ranking =
        getDivisionRanking(
            database,
            promotionId,
            division
        );

    const index =
        ranking.findIndex(
            entry =>
                String(
                    entry.fighterId
                ) ===
                String(
                    fighterId
                )
        );

    if (
        index < 0
    ) {
        return false;
    }

    ranking.splice(
        index,
        1
    );

    setDivisionRanking(
        database,
        promotionId,
        division,
        ranking
    );

    return true;
}

// ============================================================
// SORT RANKING
// ============================================================

export function sortDivisionRanking(
    ranking,
    fighters = {},
    options = {}
) {
    if (
        !Array.isArray(
            ranking
        )
    ) {
        return [];
    }

    const sorted =
        ranking
            .map(
                entry =>
                    ({
                        ...entry
                    })
            )
            .sort(
                (
                    a,
                    b
                ) => {
                    /*
                     * Campeão sempre fica separado.
                     */
                    if (
                        a.champion &&
                        !b.champion
                    ) {
                        return -1;
                    }

                    if (
                        !a.champion &&
                        b.champion
                    ) {
                        return 1;
                    }

                    const fighterA =
                        fighters?.[
                            a.fighterId
                        ];

                    const fighterB =
                        fighters?.[
                            b.fighterId
                        ];

                    const scoreA =
                        fighterA
                            ? calculateRankingScore(
                                fighterA,
                                options
                            )
                            : safeNumber(
                                a.points
                            );

                    const scoreB =
                        fighterB
                            ? calculateRankingScore(
                                fighterB,
                                options
                            )
                            : safeNumber(
                                b.points
                            );

                    if (
                        scoreB !==
                        scoreA
                    ) {
                        return (
                            scoreB -
                            scoreA
                        );
                    }

                    return (
                        safeNumber(
                            b.points
                        ) -
                        safeNumber(
                            a.points
                        )
                    );
                }
            );

    return sorted;
}

// ============================================================
// ASSIGN RANKS
// ============================================================

export function assignRanks(
    ranking,
    options = {}
) {
    if (
        !Array.isArray(
            ranking
        )
    ) {
        return [];
    }

    const config =
        getRankingConfig(
            options
        );

    const previous =
        ranking.map(
            entry =>
                ({
                    fighterId:
                        entry.fighterId,

                    rank:
                        entry.rank
                })
        );

    let rank = 1;

    for (
        const entry of ranking
    ) {
        if (
            entry.champion
        ) {
            entry.rank =
                RANKING_CHAMPION;

            entry.previousRank =
                previous.find(
                    item =>
                        String(
                            item.fighterId
                        ) ===
                        String(
                            entry.fighterId
                        )
                )?.rank ??
                null;

            entry.movement = 0;

            continue;
        }

        if (
            rank >
            config.maxRank
        ) {
            entry.rank = null;
            continue;
        }

        entry.previousRank =
            previous.find(
                item =>
                    String(
                        item.fighterId
                    ) ===
                    String(
                        entry.fighterId
                    )
            )?.rank ??
            null;

        entry.rank =
            rank;

        if (
            Number.isFinite(
                Number(
                    entry.previousRank
                )
            ) &&
            entry.previousRank > 0
        ) {
            entry.movement =
                entry.previousRank -
                rank;
        } else {
            entry.movement = 0;
        }

        rank += 1;
    }

    return ranking;
}

// ============================================================
// UPDATE DIVISION
// ============================================================

export function updateDivisionRanking(
    database,
    promotionId,
    division,
    fighters = {},
    options = {}
) {
    const ranking =
        getDivisionRanking(
            database,
            promotionId,
            division
        );

    if (
        !ranking.length
    ) {
        return [];
    }

    const sorted =
        sortDivisionRanking(
            ranking,
            fighters,
            options
        );

    /*
     * Mantém campeão no topo.
     */
    const champion =
        sorted.find(
            entry =>
                entry.champion
        );

    const contenders =
        sorted.filter(
            entry =>
                !entry.champion
        );

    const ordered =
        champion
            ? [
                champion,
                ...contenders
            ]
            : contenders;

    assignRanks(
        ordered,
        options
    );

    for (
        const entry of ordered
    ) {
        entry.updatedAt =
            options.date ||
            new Date()
                .toISOString()
                .slice(0, 10);
    }

    setDivisionRanking(
        database,
        promotionId,
        division,
        ordered
    );

    database.lastUpdate =
        options.date ||
        new Date()
            .toISOString()
            .slice(0, 10);

    return ordered;
}

// ============================================================
// UPDATE ALL RANKINGS
// ============================================================

export function updateAllRankings(
    database,
    fighters = {},
    options = {}
) {
    if (
        !database
    ) {
        return database;
    }

    const divisions =
        database.divisions ||
        {};

    for (
        const key of Object.keys(
            divisions
        )
    ) {
        const separator =
            key.indexOf("::");

        const promotionId =
            separator >= 0
                ? key.slice(
                    0,
                    separator
                )
                : "global";

        const division =
            separator >= 0
                ? key.slice(
                    separator + 2
                )
                : key;

        updateDivisionRanking(
            database,
            promotionId,
            division,
            fighters,
            options
        );
    }

    return database;
}

// ============================================================
// CHAMPION
// ============================================================

export function getChampion(
    database,
    promotionId,
    division
) {
    const ranking =
        getDivisionRanking(
            database,
            promotionId,
            division
        );

    return (
        ranking.find(
            entry =>
                entry.champion ===
                true ||
                entry.rank ===
                RANKING_CHAMPION
        ) ||
        null
    );
}

export function setChampion(
    database,
    fighterId,
    promotionId,
    division,
    options = {}
) {
    const ranking =
        getDivisionRanking(
            database,
            promotionId,
            division
        );

    /*
     * Remove campeonato anterior.
     */
    for (
        const entry of ranking
    ) {
        entry.champion = false;

        if (
            entry.rank ===
            RANKING_CHAMPION
        ) {
            entry.rank = null;
        }
    }

    let entry =
        ranking.find(
            item =>
                String(
                    item.fighterId
                ) ===
                String(
                    fighterId
                )
        );

    if (
        !entry
    ) {
        entry =
            createRankingEntry({
                fighterId,
                promotionId,
                division
            });

        ranking.push(
            entry
        );
    }

    entry.champion = true;
    entry.rank =
        RANKING_CHAMPION;

    entry.active = true;

    entry.updatedAt =
        options.date ||
        new Date()
            .toISOString()
            .slice(0, 10);

    setDivisionRanking(
        database,
        promotionId,
        division,
        ranking
    );

    return entry;
}

export function removeChampion(
    database,
    promotionId,
    division,
    options = {}
) {
    const champion =
        getChampion(
            database,
            promotionId,
            division
        );

    if (
        !champion
    ) {
        return false;
    }

    champion.champion =
        false;

    champion.rank =
        null;

    champion.updatedAt =
        options.date ||
        new Date()
            .toISOString()
            .slice(0, 10);

    return true;
}

// ============================================================
// TITLE CHALLENGER
// ============================================================

export function getTopContender(
    database,
    promotionId,
    division
) {
    const ranking =
        getDivisionRanking(
            database,
            promotionId,
            division
        );

    return (
        ranking.find(
            entry =>
                !entry.champion &&
                entry.rank === 1
        ) ||
        ranking.find(
            entry =>
                !entry.champion &&
                entry.rank > 0
        ) ||
        null
    );
}

export function getTopRanked(
    database,
    promotionId,
    division,
    count = 5
) {
    const ranking =
        getDivisionRanking(
            database,
            promotionId,
            division
        );

    return ranking
        .filter(
            entry =>
                !entry.champion &&
                entry.rank > 0
        )
        .slice(
            0,
            Math.max(
                1,
                count
            )
        );
}

// ============================================================
// RANKING MOVEMENT
// ============================================================

export function getRankingMovement(
    entry
) {
    if (
        !entry
    ) {
        return {
            movement: 0,
            direction: "same"
        };
    }

    const movement =
        safeNumber(
            entry.movement,
            0
        );

    let direction =
        "same";

    if (
        movement > 0
    ) {
        direction = "up";
    } else if (
        movement < 0
    ) {
        direction = "down";
    }

    return {
        movement,
        direction
    };
}

// ============================================================
// INACTIVITY
// ============================================================

export function calculateInactivityPenalty(
    lastFightDate,
    currentDate,
    options = {}
) {
    const config =
        getRankingConfig(
            options
        );

    if (
        !lastFightDate ||
        !currentDate
    ) {
        return 0;
    }

    const last =
        new Date(
            lastFightDate
        );

    const current =
        new Date(
            currentDate
        );

    if (
        Number.isNaN(
            last.getTime()
        ) ||
        Number.isNaN(
            current.getTime()
        )
    ) {
        return 0;
    }

    const days =
        Math.floor(
            (
                current.getTime() -
                last.getTime()
            ) /
            86400000
        );

    if (
        days <=
        config.inactivityDays
    ) {
        return 0;
    }

    const periods =
        Math.floor(
            (
                days -
                config.inactivityDays
            ) /
            30
        );

    return (
        Math.max(
            0,
            periods
        ) *
        config.inactivityPenalty
    );
}

// ============================================================
// APPLY INACTIVITY
// ============================================================

export function applyInactivityPenalty(
    database,
    currentDate,
    options = {}
) {
    const config =
        getRankingConfig(
            options
        );

    for (
        const key of Object.keys(
            database?.divisions || {}
        )
    ) {
        const ranking =
            database.divisions[key];

        for (
            const entry of ranking
        ) {
            if (
                entry.champion
            ) {
                continue;
            }

            const penalty =
                calculateInactivityPenalty(
                    entry.lastFightDate,
                    currentDate,
                    config
                );

            if (
                penalty <= 0
            ) {
                continue;
            }

            entry.points =
                Math.max(
                    0,
                    safeNumber(
                        entry.points
                    ) -
                    penalty
                );
        }
    }

    return database;
}

// ============================================================
// PROCESS FIGHT RESULT
// ============================================================

export function processRankingFightResult(
    database,
    player,
    result,
    options = {}
) {
    const promotionId =
        options.promotionId ??
        getPlayerPromotionId(
            player
        );

    const division =
        options.division ??
        getPlayerDivision(
            player
        );

    const fighterId =
        getPlayerId(
            player
        );

    if (
        !fighterId
    ) {
        return {
            success: false,
            reason:
                "fighter_id_missing"
        };
    }

    const impact =
        calculateRankingImpact(
            result,
            options
        );

    const ranking =
        getDivisionRanking(
            database,
            promotionId,
            division
        );

    let entry =
        ranking.find(
            item =>
                String(
                    item.fighterId
                ) ===
                String(
                    fighterId
                )
        );

    if (
        !entry
    ) {
        entry =
            createRankingEntry({
                fighterId,

                fighterName:
                    getPlayerName(
                        player
                    ),

                promotionId,

                division
            });

        ranking.push(
            entry
        );
    }

    entry.previousPoints =
        safeNumber(
            entry.points
        );

    entry.points =
        Math.max(
            0,
            entry.points +
            impact
        );

    entry.lastFightDate =
        options.date ||
        entry.lastFightDate ||
        null;

    entry.updatedAt =
        options.date ||
        null;

    setDivisionRanking(
        database,
        promotionId,
        division,
        ranking
    );

    return {
        success: true,

        impact,

        entry
    };
}

// ============================================================
// SYNC RANKING ENTRY FROM FIGHTER
// ============================================================

export function syncRankingEntry(
    database,
    player,
    options = {}
) {
    const promotionId =
        options.promotionId ??
        getPlayerPromotionId(
            player
        );

    const division =
        options.division ??
        getPlayerDivision(
            player
        );

    if (
        !division
    ) {
        return {
            success: false,
            reason:
                "division_missing"
        };
    }

    const ranking =
        getDivisionRanking(
            database,
            promotionId,
            division
        );

    const fighterId =
        getPlayerId(
            player
        );

    let entry =
        ranking.find(
            item =>
                String(
                    item.fighterId
                ) ===
                String(
                    fighterId
                )
        );

    if (
        !entry
    ) {
        entry =
            createRankingEntry({
                fighterId,

                fighterName:
                    getPlayerName(
                        player
                    ),

                promotionId,

                division
            });

        ranking.push(
            entry
        );
    }

    const professional =
        getProfessionalCareer(
            player
        );

    entry.fighterName =
        getPlayerName(
            player
        );

    entry.points =
        safeNumber(
            professional?.rankingPoints,
            entry.points
        );

    entry.lastFightDate =
        professional?.lastFightDate ||
        entry.lastFightDate ||
        null;

    entry.active =
        professional?.active ??
        true;

    setDivisionRanking(
        database,
        promotionId,
        division,
        ranking
    );

    return {
        success: true,
        entry
    };
}

// ============================================================
// PLAYER RANK
// ============================================================

export function getPlayerRank(
    database,
    player,
    options = {}
) {
    const fighterId =
        getPlayerId(
            player
        );

    const promotionId =
        options.promotionId ??
        getPlayerPromotionId(
            player
        );

    const division =
        options.division ??
        getPlayerDivision(
            player
        );

    const ranking =
        getDivisionRanking(
            database,
            promotionId,
            division
        );

    const entry =
        ranking.find(
            item =>
                String(
                    item.fighterId
                ) ===
                String(
                    fighterId
                )
        );

    return (
        entry?.rank ??
        null
    );
}

// ============================================================
// RANKING POSITION LABEL
// ============================================================

export function getRankLabel(
    rank
) {
    if (
        rank ===
        RANKING_CHAMPION
    ) {
        return "Champion";
    }

    if (
        !Number.isFinite(
            Number(rank)
        ) ||
        rank <= 0
    ) {
        return "Unranked";
    }

    return `#${rank}`;
}

// ============================================================
// RANKING ANALYSIS
// ============================================================

export function analyzeRankingPosition(
    database,
    player,
    options = {}
) {
    const rank =
        getPlayerRank(
            database,
            player,
            options
        );

    const champion =
        getChampion(
            database,
            options.promotionId ??
                getPlayerPromotionId(
                    player
                ),
            options.division ??
                getPlayerDivision(
                    player
                )
        );

    const topContender =
        getTopContender(
            database,
            options.promotionId ??
                getPlayerPromotionId(
                    player
                ),
            options.division ??
                getPlayerDivision(
                    player
                )
        );

    return {
        rank,

        label:
            getRankLabel(
                rank
            ),

        isChampion:
            rank ===
            RANKING_CHAMPION,

        isRanked:
            rank !== null &&
            rank > 0,

        isTopFive:
            rank !== null &&
            rank >= 1 &&
            rank <= 5,

        isTopTen:
            rank !== null &&
            rank >= 1 &&
            rank <= 10,

        isNumberOne:
            rank === 1,

        championId:
            champion?.fighterId ||
            null,

        numberOneId:
            topContender?.fighterId ||
            null
    };
}

// ============================================================
// RANKING SUMMARY
// ============================================================

export function getDivisionRankingSummary(
    database,
    promotionId,
    division
) {
    const ranking =
        getDivisionRanking(
            database,
            promotionId,
            division
        );

    const champion =
        ranking.find(
            entry =>
                entry.champion
        );

    const contenders =
        ranking.filter(
            entry =>
                !entry.champion &&
                entry.rank > 0
        );

    return {
        promotionId,

        division,

        total:
            ranking.length,

        ranked:
            contenders.length,

        champion:
            champion || null,

        numberOne:
            contenders.find(
                entry =>
                    entry.rank === 1
            ) || null,

        numberTwo:
            contenders.find(
                entry =>
                    entry.rank === 2
            ) || null,

        topFive:
            contenders.filter(
                entry =>
                    entry.rank <= 5
            ),

        topTen:
            contenders.filter(
                entry =>
                    entry.rank <= 10
            )
    };
}

// ============================================================
// VALIDATION
// ============================================================

export function validateRankingDatabase(
    database
) {
    const errors = [];

    if (
        !database ||
        typeof database !== "object"
    ) {
        return {
            valid: false,
            errors: [
                "database_missing"
            ]
        };
    }

    if (
        !database.divisions ||
        typeof database.divisions !==
        "object"
    ) {
        errors.push(
            "divisions_invalid"
        );
    }

    for (
        const [
            key,
            ranking
        ] of Object.entries(
            database.divisions || {}
        )
    ) {
        if (
            !Array.isArray(
                ranking
            )
        ) {
            errors.push(
                `division_invalid:${key}`
            );

            continue;
        }

        const ranks =
            ranking
                .filter(
                    entry =>
                        !entry.champion &&
                        entry.rank > 0
                )
                .map(
                    entry =>
                        entry.rank
                );

        const duplicates =
            ranks.filter(
                (
                    rank,
                    index
                ) =>
                    ranks.indexOf(
                        rank
                    ) !== index
            );

        if (
            duplicates.length
        ) {
            errors.push(
                `duplicate_rank:${key}`
            );
        }
    }

    return {
        valid:
            errors.length === 0,

        errors
    };
}

// ============================================================
// SNAPSHOT
// ============================================================

export function snapshotRankings(
    database
) {
    return clone(
        database
    );
}

// ============================================================
// CLONE
// ============================================================

export function cloneRankings(
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
    RANKINGS_VERSION,

    RANKING_MIN,
    RANKING_MAX,
    RANKING_CHAMPION,

    RANKING_STATUS,

    createRankingEntry,
    createRankingDatabase,

    isEligibleForRanking,

    calculateRankingScore,
    calculateRankingImpact,

    updateFighterRankingPoints,

    createDivisionKey,

    getDivisionRanking,
    setDivisionRanking,

    addFighterToRanking,
    removeFighterFromRanking,

    sortDivisionRanking,
    assignRanks,

    updateDivisionRanking,
    updateAllRankings,

    getChampion,
    setChampion,
    removeChampion,

    getTopContender,
    getTopRanked,

    getRankingMovement,

    calculateInactivityPenalty,
    applyInactivityPenalty,

    processRankingFightResult,
    syncRankingEntry,

    getPlayerRank,

    getRankLabel,
    analyzeRankingPosition,

    getDivisionRankingSummary,

    validateRankingDatabase,

    snapshotRankings,
    cloneRankings
};
