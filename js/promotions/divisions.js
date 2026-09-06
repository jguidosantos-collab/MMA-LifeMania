// ============================================================
// MMA LIFE DYNASTY
// js/promotions/divisions.js
// ============================================================
export const DIVISIONS_VERSION = 1;
// ============================================================
// DIVISION TYPES
// ============================================================
export const DIVISION_TYPES = Object.freeze({
    MEN: "men",
    WOMEN: "women",
    OPEN: "open"
});
// ============================================================
// DIVISION STATUS
// ============================================================
export const DIVISION_STATUS = Object.freeze({
    ACTIVE: "active",
    INACTIVE: "inactive",
    SUSPENDED: "suspended"
});
// ============================================================
// RANKING CONFIGURATION
// ============================================================
export const DIVISION_RANKING_CONFIG = Object.freeze({
    MAX_RANKING_SIZE: 15,
    CHAMPION_RANK: 0,
    TOP_CONTENDER_RANK: 1,
    TITLE_SHOT_MAX_RANK: 5
});
// ============================================================
// DEFAULT WEIGHT CLASSES
// ============================================================
const MEN_WEIGHT_CLASSES = [
    {
        id: "flyweight",
        name: "Flyweight",
        shortName: "FLW",
        limitKg: 56.7
    },
    {
        id: "bantamweight",
        name: "Bantamweight",
        shortName: "BW",
        limitKg: 61.2
    },
    {
        id: "featherweight",
        name: "Featherweight",
        shortName: "FW",
        limitKg: 65.8
    },
    {
        id: "lightweight",
        name: "Lightweight",
        shortName: "LW",
        limitKg: 70.3
    },
    {
        id: "welterweight",
        name: "Welterweight",
        shortName: "WW",
        limitKg: 77.1
    },
    {
        id: "middleweight",
        name: "Middleweight",
        shortName: "MW",
        limitKg: 83.9
    },
    {
        id: "light_heavyweight",
        name: "Light Heavyweight",
        shortName: "LHW",
        limitKg: 93.0
    },
    {
        id: "heavyweight",
        name: "Heavyweight",
        shortName: "HW",
        limitKg: 120.2
    }
];
const WOMEN_WEIGHT_CLASSES = [
    {
        id: "atomweight",
        name: "Atomweight",
        shortName: "AW",
        limitKg: 47.6
    },
    {
        id: "strawweight",
        name: "Strawweight",
        shortName: "SW",
        limitKg: 52.2
    },
    {
        id: "flyweight",
        name: "Flyweight",
        shortName: "FLW",
        limitKg: 56.7
    },
    {
        id: "bantamweight",
        name: "Bantamweight",
        shortName: "BW",
        limitKg: 61.2
    },
    {
        id: "featherweight",
        name: "Featherweight",
        shortName: "FW",
        limitKg: 65.8
    }
];
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
function createId(prefix = "division") {
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
// NORMALIZE GENDER
// ============================================================
export function normalizeGender(gender) {
    const value =
        String(
            gender || ""
        ).toLowerCase();
    if (
        value === "female" ||
        value === "woman" ||
        value === "women" ||
        value === "f"
    ) {
        return "female";
    }
    if (
        value === "male" ||
        value === "man" ||
        value === "men" ||
        value === "m"
    ) {
        return "male";
    }
    return "male";
}
// ============================================================
// WEIGHT CLASS DATA
// ============================================================
export function getDefaultWeightClasses(
    gender = "male"
) {
    const normalized =
        normalizeGender(
            gender
        );
    const source =
        normalized === "female"
            ? WOMEN_WEIGHT_CLASSES
            : MEN_WEIGHT_CLASSES;
    return source.map(
        weightClass =>
            clone(
                weightClass
            )
    );
}
export function getWeightClass(
    weightClassId,
    gender = "male"
) {
    const classes =
        getDefaultWeightClasses(
            gender
        );
    return (
        classes.find(
            weightClass =>
                weightClass.id ===
                weightClassId
        ) ||
        null
    );
}
export function getWeightClassByWeight(
    weightKg,
    gender = "male"
) {
    const weight =
        safeNumber(
            weightKg,
            0
        );
    if (
        weight <= 0
    ) {
        return null;
    }
    const classes =
        getDefaultWeightClasses(
            gender
        );
    return (
        classes.find(
            weightClass =>
                weight <=
                weightClass.limitKg
        ) ||
        classes[
            classes.length - 1
        ] ||
        null
    );
}
// ============================================================
// DIVISION FACTORY
// ============================================================
export function createDivision(
    options = {}
) {
    const gender =
        normalizeGender(
            options.gender
        );
    const genderType =
        gender === "female"
            ? DIVISION_TYPES.WOMEN
            : DIVISION_TYPES.MEN;
    const weightClass =
        options.weightClass ||
        getWeightClass(
            options.weightClassId,
            gender
        );
    const id =
        options.id ||
        (
            options.weightClassId
                ? `${gender}_${options.weightClassId}`
                : createId()
        );
    return {
        id,
        version:
            DIVISIONS_VERSION,
        promotionId:
            options.promotionId ||
            null,
        promotionName:
            options.promotionName ||
            null,
        name:
            options.name ||
            weightClass?.name ||
            "Division",
        shortName:
            options.shortName ||
            weightClass?.shortName ||
            null,
        type:
            options.type ||
            genderType,
        gender,
        status:
            options.status ||
            DIVISION_STATUS.ACTIVE,
        weightClassId:
            options.weightClassId ||
            weightClass?.id ||
            null,
        weightLimitKg:
            safeNumber(
                options.weightLimitKg ??
                    weightClass?.limitKg,
                0
            ),
        ranking: [],
        championId:
            options.championId ||
            null,
        championName:
            options.championName ||
            null,
        interimChampionId:
            options.interimChampionId ||
            null,
        interimChampionName:
            options.interimChampionName ||
            null,
        contenderIds:
            Array.isArray(
                options.contenderIds
            )
                ? [
                    ...options.contenderIds
                ]
                : [],
        titleHistory:
            Array.isArray(
                options.titleHistory
            )
                ? clone(
                    options.titleHistory
                )
                : [],
        defenses:
            safeNumber(
                options.defenses,
                0
            ),
        titleFights:
            safeNumber(
                options.titleFights,
                0
            ),
        totalFighters:
            safeNumber(
                options.totalFighters,
                0
            ),
        activeFighters:
            safeNumber(
                options.activeFighters,
                0
            ),
        notes:
            Array.isArray(
                options.notes
            )
                ? [
                    ...options.notes
                ]
                : []
    };
}
// ============================================================
// DIVISION DATABASE
// ============================================================
export function createDivisionDatabase() {
    return {
        version:
            DIVISIONS_VERSION,
        divisions: {},
        order: [],
        lastUpdated:
            null
    };
}
export function addDivisionToDatabase(
    database,
    division
) {
    if (
        !database ||
        !division
    ) {
        return false;
    }
    if (
        !database.divisions
    ) {
        database.divisions = {};
    }
    if (
        !Array.isArray(
            database.order
        )
    ) {
        database.order = [];
    }
    database.divisions[
        division.id
    ] =
        clone(
            division
        );
    if (
        !database.order.includes(
            division.id
        )
    ) {
        database.order.push(
            division.id
        );
    }
    database.lastUpdated =
        new Date().toISOString();
    return true;
}
// ============================================================
// GET DIVISIONS
// ============================================================
export function getDivision(
    database,
    divisionId
) {
    if (
        !database ||
        !database.divisions
    ) {
        return null;
    }
    return (
        database.divisions[
            divisionId
        ] ||
        null
    );
}
export function getAllDivisions(
    database,
    options = {}
) {
    if (
        !database ||
        !database.divisions
    ) {
        return [];
    }
    let divisions =
        Object.values(
            database.divisions
        );
    if (
        options.promotionId
    ) {
        divisions =
            divisions.filter(
                division =>
                    division.promotionId ===
                    options.promotionId
            );
    }
    if (
        options.gender
    ) {
        const gender =
            normalizeGender(
                options.gender
            );
        divisions =
            divisions.filter(
                division =>
                    division.gender ===
                    gender
            );
    }
    if (
        options.status
    ) {
        divisions =
            divisions.filter(
                division =>
                    division.status ===
                    options.status
            );
    }
    return divisions;
}
// ============================================================
// GENERATE STANDARD DIVISIONS
// ============================================================
export function generateStandardDivisions(
    promotionId,
    options = {}
) {
    const gender =
        options.gender ||
        "male";
    const classes =
        getDefaultWeightClasses(
            gender
        );
    return classes.map(
        weightClass =>
            createDivision({
                promotionId,
                promotionName:
                    options.promotionName ||
                    null,
                gender,
                weightClassId:
                    weightClass.id,
                name:
                    weightClass.name,
                shortName:
                    weightClass.shortName,
                weightLimitKg:
                    weightClass.limitKg
            })
    );
}
// ============================================================
// FIGHTER RANKING ENTRY
// ============================================================
export function createRankingEntry(
    options = {}
) {
    return {
        fighterId:
            options.fighterId ||
            null,
        fighterName:
            options.fighterName ||
            null,
        rank:
            Math.max(
                1,
                Math.floor(
                    safeNumber(
                        options.rank,
                        1
                    )
                )
            ),
        previousRank:
            safeNumber(
                options.previousRank,
                0
            ),
        points:
            safeNumber(
                options.points,
                0
            ),
        ovr:
            safeNumber(
                options.ovr,
                0
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
        draws:
            safeNumber(
                options.draws,
                0
            ),
        fame:
            safeNumber(
                options.fame,
                0
            ),
        active:
            options.active !== false,
        champion:
            options.champion === true,
        interimChampion:
            options.interimChampion === true
    };
}
// ============================================================
// ADD FIGHTER
// ============================================================
export function addFighterToDivision(
    division,
    fighter = {}
) {
    if (
        !division ||
        !fighter
    ) {
        return false;
    }
    if (
        !Array.isArray(
            division.ranking
        )
    ) {
        division.ranking = [];
    }
    const existing =
        division.ranking.find(
            entry =>
                entry.fighterId ===
                fighter.fighterId
        );
    if (
        existing
    ) {
        return existing;
    }
    const entry =
        createRankingEntry(
            fighter
        );
    division.ranking.push(
        entry
    );
    division.totalFighters += 1;
    division.activeFighters += 1;
    sortDivisionRanking(
        division
    );
    return entry;
}
// ============================================================
// REMOVE FIGHTER
// ============================================================
export function removeFighterFromDivision(
    division,
    fighterId
) {
    if (
        !division ||
        !Array.isArray(
            division.ranking
        )
    ) {
        return false;
    }
    const index =
        division.ranking.findIndex(
            entry =>
                entry.fighterId ===
                fighterId
        );
    if (
        index === -1
    ) {
        return false;
    }
    const removed =
        division.ranking.splice(
            index,
            1
        )[0];
    division.totalFighters =
        Math.max(
            0,
            division.totalFighters - 1
        );
    if (
        removed.active
    ) {
        division.activeFighters =
            Math.max(
                0,
                division.activeFighters - 1
            );
    }
    if (
        division.championId ===
        fighterId
    ) {
        division.championId =
            null;
        division.championName =
            null;
    }
    if (
        division.interimChampionId ===
        fighterId
    ) {
        division.interimChampionId =
            null;
        division.interimChampionName =
            null;
    }
    normalizeDivisionRanks(
        division
    );
    return removed;
}
// ============================================================
// RANKING SORT
// ============================================================
export function sortDivisionRanking(
    division
) {
    if (
        !division ||
        !Array.isArray(
            division.ranking
        )
    ) {
        return [];
    }
    division.ranking.sort(
        (a, b) => {
            if (
                a.champion !==
                b.champion
            ) {
                return a.champion
                    ? -1
                    : 1;
            }
            if (
                a.interimChampion !==
                b.interimChampion
            ) {
                return a.interimChampion
                    ? -1
                    : 1;
            }
            if (
                safeNumber(
                    a.points,
                    0
                ) !==
                safeNumber(
                    b.points,
                    0
                )
            ) {
                return (
                    safeNumber(
                        b.points,
                        0
                    ) -
                    safeNumber(
                        a.points,
                        0
                    )
                );
            }
            if (
                safeNumber(
                    a.ovr,
                    0
                ) !==
                safeNumber(
                    b.ovr,
                    0
                )
            ) {
                return (
                    safeNumber(
                        b.ovr,
                        0
                    ) -
                    safeNumber(
                        a.ovr,
                        0
                    )
                );
            }
            return (
                safeNumber(
                    b.fame,
                    0
                ) -
                safeNumber(
                    a.fame,
                    0
                )
            );
        }
    );
    normalizeDivisionRanks(
        division
    );
    return division.ranking;
}
// ============================================================
// NORMALIZE RANKS
// ============================================================
export function normalizeDivisionRanks(
    division
) {
    if (
        !division ||
        !Array.isArray(
            division.ranking
        )
    ) {
        return [];
    }
    let rank = 1;
    division.ranking.forEach(
        entry => {
            if (
                entry.champion ||
                entry.interimChampion
            ) {
                entry.rank = 0;
                return;
            }
            entry.rank =
                rank;
            rank += 1;
        }
    );
    return division.ranking;
}
// ============================================================
// UPDATE RANKING ENTRY
// ============================================================
export function updateDivisionRankingEntry(
    division,
    fighterId,
    updates = {}
) {
    if (
        !division ||
        !Array.isArray(
            division.ranking
        )
    ) {
        return null;
    }
    const entry =
        division.ranking.find(
            fighter =>
                fighter.fighterId ===
                fighterId
        );
    if (
        !entry
    ) {
        return null;
    }
    Object.assign(
        entry,
        clone(
            updates
        )
    );
    sortDivisionRanking(
        division
    );
    return entry;
}
// ============================================================
// CHAMPION
// ============================================================
export function setChampion(
    division,
    fighter = {}
) {
    if (
        !division
    ) {
        return false;
    }
    if (
        division.championId
    ) {
        const previous =
            division.ranking.find(
                entry =>
                    entry.fighterId ===
                    division.championId
            );
        if (
            previous
        ) {
            previous.champion =
                false;
        }
    }
    division.championId =
        fighter.fighterId ||
        null;
    division.championName =
        fighter.fighterName ||
        null;
    let entry =
        division.ranking.find(
            item =>
                item.fighterId ===
                fighter.fighterId
        );
    if (
        !entry &&
        fighter.fighterId
    ) {
        entry =
            addFighterToDivision(
                division,
                {
                    fighterId:
                        fighter.fighterId,
                    fighterName:
                        fighter.fighterName,
                    points:
                        fighter.points,
                    ovr:
                        fighter.ovr,
                    fame:
                        fighter.fame,
                    champion: true
                }
            );
    }
    if (
        entry
    ) {
        entry.champion =
            true;
        entry.interimChampion =
            false;
    }
    sortDivisionRanking(
        division
    );
    return true;
}
// ============================================================
// INTERIM CHAMPION
// ============================================================
export function setInterimChampion(
    division,
    fighter = {}
) {
    if (
        !division
    ) {
        return false;
    }
    if (
        division.interimChampionId
    ) {
        const previous =
            division.ranking.find(
                entry =>
                    entry.fighterId ===
                    division.interimChampionId
            );
        if (
            previous
        ) {
            previous.interimChampion =
                false;
        }
    }
    division.interimChampionId =
        fighter.fighterId ||
        null;
    division.interimChampionName =
        fighter.fighterName ||
        null;
    let entry =
        division.ranking.find(
            item =>
                item.fighterId ===
                fighter.fighterId
        );
    if (
        !entry &&
        fighter.fighterId
    ) {
        entry =
            addFighterToDivision(
                division,
                {
                    fighterId:
                        fighter.fighterId,
                    fighterName:
                        fighter.fighterName,
                    points:
                        fighter.points,
                    ovr:
                        fighter.ovr,
                    fame:
                        fighter.fame,
                    interimChampion: true
                }
            );
    }
    if (
        entry
    ) {
        entry.interimChampion =
            true;
        entry.champion =
            false;
    }
    sortDivisionRanking(
        division
    );
    return true;
}
// ============================================================
// VACATE TITLE
// ============================================================
export function vacateChampion(
    division,
    reason = null
) {
    if (
        !division
    ) {
        return false;
    }
    const oldChampionId =
        division.championId;
    if (
        oldChampionId
    ) {
        const entry =
            division.ranking.find(
                item =>
                    item.fighterId ===
                    oldChampionId
            );
        if (
            entry
        ) {
            entry.champion =
                false;
        }
    }
    if (
        oldChampionId
    ) {
        division.titleHistory.push({
            type:
                "vacated",
            fighterId:
                oldChampionId,
            fighterName:
                division.championName,
            reason:
                reason ||
                "unknown",
            date:
                new Date().toISOString()
        });
    }
    division.championId =
        null;
    division.championName =
        null;
    return true;
}
// ============================================================
// UNIFY TITLES
// ============================================================
export function unifyTitles(
    division,
    fighter = {}
) {
    if (
        !division
    ) {
        return false;
    }
    const interimId =
        division.interimChampionId;
    if (
        interimId
    ) {
        const interimEntry =
            division.ranking.find(
                entry =>
                    entry.fighterId ===
                    interimId
            );
        if (
            interimEntry
        ) {
            interimEntry.interimChampion =
                false;
        }
    }
    division.interimChampionId =
        null;
    division.interimChampionName =
        null;
    setChampion(
        division,
        fighter
    );
    division.titleHistory.push({
        type:
            "unification",
        fighterId:
            fighter.fighterId ||
            null,
        fighterName:
            fighter.fighterName ||
            null,
        date:
            new Date().toISOString()
    });
    return true;
}
// ============================================================
// TITLE DEFENSE
// ============================================================
export function registerTitleDefense(
    division,
    fighterId,
    result = "win"
) {
    if (
        !division ||
        !fighterId
    ) {
        return false;
    }
    if (
        division.championId !==
        fighterId
    ) {
        return false;
    }
    division.titleFights += 1;
    if (
        String(
            result
        ).toLowerCase() ===
        "win"
    ) {
        division.defenses += 1;
    }
    division.titleHistory.push({
        type:
            "defense",
        fighterId,
        result,
        date:
            new Date().toISOString()
    });
    return true;
}
// ============================================================
// TITLE FIGHT
// ============================================================
export function registerTitleFight(
    division
) {
    if (
        !division
    ) {
        return false;
    }
    division.titleFights += 1;
    return true;
}
// ============================================================
// RANK ACCESS
// ============================================================
export function getRankedFighters(
    division,
    limit =
        DIVISION_RANKING_CONFIG
            .MAX_RANKING_SIZE
) {
    if (
        !division ||
        !Array.isArray(
            division.ranking
        )
    ) {
        return [];
    }
    return division.ranking
        .filter(
            entry =>
                !entry.champion &&
                !entry.interimChampion &&
                entry.active !== false
        )
        .sort(
            (a, b) =>
                safeNumber(
                    a.rank,
                    999
                ) -
                safeNumber(
                    b.rank,
                    999
                )
        )
        .slice(
            0,
            Math.max(
                0,
                Math.floor(
                    safeNumber(
                        limit,
                        15
                    )
                )
            )
        );
}
export function getFighterRank(
    division,
    fighterId
) {
    if (
        !division ||
        !Array.isArray(
            division.ranking
        )
    ) {
        return null;
    }
    const entry =
        division.ranking.find(
            item =>
                item.fighterId ===
                fighterId
        );
    return entry
        ? entry.rank
        : null;
}
// ============================================================
// CHALLENGER ELIGIBILITY
// ============================================================
export function isTitleEligible(
    division,
    fighterId,
    options = {}
) {
    if (
        !division ||
        !fighterId
    ) {
        return false;
    }
    if (
        division.status !==
        DIVISION_STATUS.ACTIVE
    ) {
        return false;
    }
    if (
        division.championId ===
        fighterId
    ) {
        return false;
    }
    if (
        division.interimChampionId ===
        fighterId
    ) {
        return false;
    }
    const entry =
        division.ranking.find(
            item =>
                item.fighterId ===
                fighterId
        );
    if (
        !entry
    ) {
        return false;
    }
    const maxRank =
        safeNumber(
            options.maxRank,
            DIVISION_RANKING_CONFIG
                .TITLE_SHOT_MAX_RANK
        );
    if (
        safeNumber(
            entry.rank,
            999
        ) > maxRank
    ) {
        return false;
    }
    if (
        entry.active === false
    ) {
        return false;
    }
    return true;
}
// ============================================================
// BEST CONTENDER
// ============================================================
export function getTopContender(
    division
) {
    const ranked =
        getRankedFighters(
            division,
            1
        );
    return ranked[0] || null;
}
// ============================================================
// CONTENDERS
// ============================================================
export function updateContenders(
    division,
    limit = 5
) {
    if (
        !division
    ) {
        return [];
    }
    const ranked =
        getRankedFighters(
            division,
            limit
        );
    division.contenderIds =
        ranked.map(
            entry =>
                entry.fighterId
        );
    return [
        ...division.contenderIds
    ];
}
// ============================================================
// MOVE FIGHTER BETWEEN DIVISIONS
// ============================================================
export function moveFighterBetweenDivisions(
    fromDivision,
    toDivision,
    fighterId
) {
    if (
        !fromDivision ||
        !toDivision ||
        !fighterId
    ) {
        return {
            success: false,
            reason:
                "invalid_divisions"
        };
    }
    const entry =
        fromDivision.ranking.find(
            item =>
                item.fighterId ===
                fighterId
        );
    if (
        !entry
    ) {
        return {
            success: false,
            reason:
                "fighter_not_found"
        };
    }
    const copy =
        clone(
            entry
        );
    copy.rank = 1;
    copy.previousRank = 0;
    copy.champion = false;
    copy.interimChampion = false;
    const removed =
        removeFighterFromDivision(
            fromDivision,
            fighterId
        );
    if (
        !removed
    ) {
        return {
            success: false,
            reason:
                "remove_failed"
        };
    }
    const added =
        addFighterToDivision(
            toDivision,
            copy
        );
    if (
        !added
    ) {
        addFighterToDivision(
            fromDivision,
            entry
        );
        return {
            success: false,
            reason:
                "add_failed"
        };
    }
    return {
        success: true,
        fighter:
            added,
        from:
            fromDivision.id,
        to:
            toDivision.id
    };
}
// ============================================================
// DIVISION ANALYSIS
// ============================================================
export function analyzeDivision(
    division
) {
    if (
        !division
    ) {
        return null;
    }
    const ranked =
        getRankedFighters(
            division
        );
    const champion =
        division.championId
            ? division.ranking.find(
                entry =>
                    entry.fighterId ===
                    division.championId
            )
            : null;
    const interim =
        division.interimChampionId
            ? division.ranking.find(
                entry =>
                    entry.fighterId ===
                    division.interimChampionId
            )
            : null;
    const averageOVR =
        ranked.length
            ? ranked.reduce(
                (
                    total,
                    entry
                ) =>
                    total +
                    safeNumber(
                        entry.ovr,
                        0
                    ),
                0
            ) /
            ranked.length
            : 0;
    const averageFame =
        ranked.length
            ? ranked.reduce(
                (
                    total,
                    entry
                ) =>
                    total +
                    safeNumber(
                        entry.fame,
                        0
                    ),
                0
            ) /
            ranked.length
            : 0;
    return {
        divisionId:
            division.id,
        name:
            division.name,
        gender:
            division.gender,
        weightLimitKg:
            division.weightLimitKg,
        champion:
            champion
                ? clone(
                    champion
                )
                : null,
        interimChampion:
            interim
                ? clone(
                    interim
                )
                : null,
        rankedFighters:
            ranked.length,
        totalFighters:
            division.totalFighters,
        activeFighters:
            division.activeFighters,
        averageOVR,
        averageFame,
        titleDefenses:
            division.defenses,
        titleFights:
            division.titleFights,
        contenders:
            updateContenders(
                division
            )
    };
}
// ============================================================
// VALIDATION
// ============================================================
export function validateDivision(
    division
) {
    const errors = [];
    if (
        !division ||
        typeof division !==
            "object"
    ) {
        return {
            valid: false,
            errors: [
                "division_missing"
            ]
        };
    }
    if (
        !division.id
    ) {
        errors.push(
            "id_missing"
        );
    }
    if (
        !division.name
    ) {
        errors.push(
            "name_missing"
        );
    }
    if (
        !Object.values(
            DIVISION_TYPES
        ).includes(
            division.type
        )
    ) {
        errors.push(
            "invalid_type"
        );
    }
    if (
        !Object.values(
            DIVISION_STATUS
        ).includes(
            division.status
        )
    ) {
        errors.push(
            "invalid_status"
        );
    }
    if (
        safeNumber(
            division.weightLimitKg,
            0
        ) <= 0
    ) {
        errors.push(
            "invalid_weight_limit"
        );
    }
    if (
        !Array.isArray(
            division.ranking
        )
    ) {
        errors.push(
            "ranking_missing"
        );
    }
    return {
        valid:
            errors.length === 0,
        errors
    };
}
export function validateDivisionDatabase(
    database
) {
    const errors = [];
    if (
        !database ||
        !database.divisions
    ) {
        return {
            valid: false,
            errors: [
                "database_missing"
            ]
        };
    }
    Object.values(
        database.divisions
    ).forEach(
        division => {
            const result =
                validateDivision(
                    division
                );
            if (
                !result.valid
            ) {
                errors.push({
                    id:
                        division.id ||
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
// SUMMARY
// ============================================================
export function getDivisionSummary(
    division
) {
    if (
        !division
    ) {
        return null;
    }
    const champion =
        division.championId
            ? division.ranking.find(
                entry =>
                    entry.fighterId ===
                    division.championId
            )
            : null;
    const contender =
        getTopContender(
            division
        );
    return {
        id:
            division.id,
        name:
            division.name,
        gender:
            division.gender,
        weightLimitKg:
            division.weightLimitKg,
        status:
            division.status,
        championId:
            division.championId,
        championName:
            division.championName,
        interimChampionId:
            division.interimChampionId,
        interimChampionName:
            division.interimChampionName,
        topContender:
            contender
                ? {
                    fighterId:
                        contender.fighterId,
                    fighterName:
                        contender.fighterName,
                    rank:
                        contender.rank,
                    ovr:
                        contender.ovr
                }
                : null,
        totalFighters:
            division.totalFighters,
        activeFighters:
            division.activeFighters,
        titleFights:
            division.titleFights,
        defenses:
            division.defenses
    };
}
// ============================================================
// CLONE / SNAPSHOT
// ============================================================
export function cloneDivision(
    division
) {
    return clone(
        division
    );
}
export function cloneDivisionDatabase(
    database
) {
    return clone(
        database
    );
}
export function snapshotDivisions(
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
    DIVISIONS_VERSION,
    DIVISION_TYPES,
    DIVISION_STATUS,
    DIVISION_RANKING_CONFIG,
    createDivision,
    createDivisionDatabase,
    addDivisionToDatabase,
    getDivision,
    getAllDivisions,
    getDefaultWeightClasses,
    getWeightClass,
    getWeightClassByWeight,
    generateStandardDivisions,
    createRankingEntry,
    addFighterToDivision,
    removeFighterFromDivision,
    sortDivisionRanking,
    normalizeDivisionRanks,
    updateDivisionRankingEntry,
    setChampion,
    setInterimChampion,
    vacateChampion,
    unifyTitles,
    registerTitleDefense,
    registerTitleFight,
    getRankedFighters,
    getFighterRank,
    isTitleEligible,
    getTopContender,
    updateContenders,
    moveFighterBetweenDivisions,
    analyzeDivision,
    validateDivision,
    validateDivisionDatabase,
    getDivisionSummary,
    cloneDivision,
    cloneDivisionDatabase,
    snapshotDivisions
};
