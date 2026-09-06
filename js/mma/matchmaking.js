// ============================================================
// MMA LIFE DYNASTY
// js/mma/matchmaking.js
// ============================================================

import {
    filterFighters,
    sortFighters
} from "./fighters.js";

// ============================================================
// VERSION
// ============================================================

export const MATCHMAKING_VERSION = 1;

// ============================================================
// BOUT TYPES
// ============================================================

export const BOUT_TYPES = Object.freeze({
    NORMAL: "normal",
    CONTENDER: "contender",
    TITLE: "title",
    INTERIM_TITLE: "interim_title",
    TOURNAMENT: "tournament",
    DEBUT: "debut",
    REMATCH: "rematch",
    SPECIAL: "special"
});

// ============================================================
// MATCHMAKING STATUS
// ============================================================

export const MATCHMAKING_STATUS = Object.freeze({
    AVAILABLE: "available",
    BOOKED: "booked",
    INJURED: "injured",
    SUSPENDED: "suspended",
    RETIRED: "retired",
    INACTIVE: "inactive"
});

// ============================================================
// HELPERS
// ============================================================

function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, Number(value) || 0));
}

function safeNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number) ? number : fallback;
}

function normalizeString(value) {
    return String(value || "").trim().toLowerCase();
}

function random() {
    return Math.random();
}

function randomInt(min, max) {
    return Math.floor(random() * (max - min + 1)) + min;
}

function pickRandom(array) {
    if (!Array.isArray(array) || array.length === 0) {
        return null;
    }

    return array[randomInt(0, array.length - 1)];
}

function unique(array) {
    return [...new Set(array)];
}

function getFighterId(fighter) {
    return fighter?.id || fighter?.fighterId || null;
}

function getPromotionId(fighter) {
    return (
        fighter?.career?.currentPromotionId ||
        fighter?.promotionId ||
        fighter?.promotion?.id ||
        null
    );
}

function getWeightClass(fighter) {
    return (
        fighter?.physical?.weightClass ||
        fighter?.weightClass ||
        fighter?.career?.weightClass ||
        null
    );
}

function getSex(fighter) {
    return normalizeString(
        fighter?.identity?.sex ||
        fighter?.sex ||
        fighter?.gender ||
        ""
    );
}

function getOVR(fighter) {
    return clamp(
        safeNumber(
            fighter?.ovr ??
            fighter?.overall ??
            fighter?.ratings?.overall,
            0
        ),
        0,
        100
    );
}

function getRank(fighter) {
    const rank = safeNumber(
        fighter?.rankings?.current ??
        fighter?.rank ??
        fighter?.career?.rank,
        null
    );

    return rank === null ? null : rank;
}

function getFame(fighter) {
    return clamp(
        safeNumber(
            fighter?.fame?.score ??
            fighter?.fame ??
            fighter?.media?.fame ??
            0
        ),
        0,
        100
    );
}

function getFollowers(fighter) {
    return Math.max(
        0,
        safeNumber(
            fighter?.fame?.followers ??
            fighter?.followers ??
            fighter?.media?.followers ??
            0
        )
    );
}

function getWinRate(fighter) {
    const wins = safeNumber(
        fighter?.record?.wins ??
        fighter?.record?.W ??
        0
    );

    const losses = safeNumber(
        fighter?.record?.losses ??
        fighter?.record?.L ??
        0
    );

    const draws = safeNumber(
        fighter?.record?.draws ??
        fighter?.record?.D ??
        0
    );

    const total = wins + losses + draws;

    if (total <= 0) {
        return 0.5;
    }

    return clamp(wins / total, 0, 1);
}

function getRecentForm(fighter) {
    const history =
        fighter?.record?.lastFive ||
        fighter?.record?.recentForm ||
        fighter?.recentForm ||
        [];

    if (!Array.isArray(history) || history.length === 0) {
        return 0.5;
    }

    let score = 0;
    let count = 0;

    for (const result of history.slice(-5)) {
        const normalized = normalizeString(
            typeof result === "string"
                ? result
                : result?.result
        );

        if (normalized === "win" || normalized === "w") {
            score += 1;
            count += 1;
        } else if (
            normalized === "loss" ||
            normalized === "l"
        ) {
            score += 0;
            count += 1;
        } else if (
            normalized === "draw" ||
            normalized === "d"
        ) {
            score += 0.5;
            count += 1;
        }
    }

    return count > 0 ? score / count : 0.5;
}

function getChampionStatus(fighter) {
    return Boolean(
        fighter?.rankings?.isChampion ||
        fighter?.career?.isChampion ||
        fighter?.career?.title?.isChampion ||
        fighter?.champion === true
    );
}

function getInterimChampionStatus(fighter) {
    return Boolean(
        fighter?.rankings?.isInterimChampion ||
        fighter?.career?.isInterimChampion ||
        fighter?.career?.title?.isInterim
    );
}

function getActiveStatus(fighter) {
    const status = normalizeString(
        fighter?.status ||
        fighter?.career?.status ||
        "active"
    );

    return status;
}

function isAvailableFighter(fighter) {
    if (!fighter) {
        return false;
    }

    const status = getActiveStatus(fighter);

    if (
        status === "retired" ||
        status === "deceased" ||
        status === "inactive" ||
        status === "suspended" ||
        status === "injured"
    ) {
        return false;
    }

    if (
        fighter?.booking?.status === "booked" ||
        fighter?.fightStatus === "booked"
    ) {
        return false;
    }

    return true;
}

function isProfessional(fighter) {
    const careerStatus = normalizeString(
        fighter?.career?.status ||
        fighter?.careerStatus ||
        ""
    );

    if (careerStatus === "professional") {
        return true;
    }

    if (fighter?.career?.professional === true) {
        return true;
    }

    if (fighter?.professional === true) {
        return true;
    }

    return safeNumber(fighter?.age, 0) >= 18;
}

function samePromotion(a, b) {
    const promotionA = normalizeString(getPromotionId(a));
    const promotionB = normalizeString(getPromotionId(b));

    if (!promotionA || !promotionB) {
        return true;
    }

    return promotionA === promotionB;
}

function sameWeightClass(a, b) {
    const weightA = normalizeString(getWeightClass(a));
    const weightB = normalizeString(getWeightClass(b));

    if (!weightA || !weightB) {
        return false;
    }

    return weightA === weightB;
}

function sameSex(a, b) {
    const sexA = getSex(a);
    const sexB = getSex(b);

    if (!sexA || !sexB) {
        return true;
    }

    return sexA === sexB;
}

// ============================================================
// PREVIOUS FIGHTS / REMATCH
// ============================================================

function getFightHistory(fighter) {
    return (
        fighter?.fightHistory ||
        fighter?.record?.history ||
        fighter?.career?.fightHistory ||
        fighter?.history ||
        []
    );
}

function hasFoughtBefore(fighterA, fighterB) {
    const idA = getFighterId(fighterA);
    const idB = getFighterId(fighterB);

    if (!idA || !idB) {
        return false;
    }

    const historyA = getFightHistory(fighterA);

    for (const fight of historyA) {
        const opponentId =
            fight?.opponentId ||
            fight?.opponent?.id ||
            fight?.opponent;

        if (String(opponentId) === String(idB)) {
            return true;
        }
    }

    const historyB = getFightHistory(fighterB);

    for (const fight of historyB) {
        const opponentId =
            fight?.opponentId ||
            fight?.opponent?.id ||
            fight?.opponent;

        if (String(opponentId) === String(idA)) {
            return true;
        }
    }

    return false;
}

function getLastFightDate(fighter) {
    const history = getFightHistory(fighter);

    if (!Array.isArray(history) || history.length === 0) {
        return null;
    }

    const dates = history
        .map(fight => fight?.date)
        .filter(Boolean)
        .map(date => new Date(date))
        .filter(date => !Number.isNaN(date.getTime()))
        .sort((a, b) => b - a);

    return dates.length > 0 ? dates[0] : null;
}

function daysSinceLastFight(fighter, currentDate = new Date()) {
    const lastFight = getLastFightDate(fighter);

    if (!lastFight) {
        return Infinity;
    }

    const current = new Date(currentDate);
    const difference =
        current.getTime() - lastFight.getTime();

    return Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );
}

function rematchEligibility(
    fighterA,
    fighterB,
    currentDate = new Date()
) {
    if (!hasFoughtBefore(fighterA, fighterB)) {
        return {
            eligible: false,
            score: 0
        };
    }

    const daysA = daysSinceLastFight(fighterA, currentDate);
    const daysB = daysSinceLastFight(fighterB, currentDate);

    const days = Math.min(daysA, daysB);

    if (days < 30) {
        return {
            eligible: false,
            score: 0
        };
    }

    if (days < 90) {
        return {
            eligible: false,
            score: 10
        };
    }

    if (days < 180) {
        return {
            eligible: true,
            score: 35
        };
    }

    if (days < 365) {
        return {
            eligible: true,
            score: 55
        };
    }

    return {
        eligible: true,
        score: 70
    };
}

// ============================================================
// RANKING DIFFERENCE
// ============================================================

function rankingDistance(fighterA, fighterB) {
    const rankA = getRank(fighterA);
    const rankB = getRank(fighterB);

    if (rankA === null || rankB === null) {
        return 10;
    }

    if (rankA === 0 || rankB === 0) {
        return Math.abs(rankA - rankB);
    }

    return Math.abs(rankA - rankB);
}

function rankingCompatibility(fighterA, fighterB) {
    const rankA = getRank(fighterA);
    const rankB = getRank(fighterB);

    if (rankA === null || rankB === null) {
        return 45;
    }

    const distance = rankingDistance(
        fighterA,
        fighterB
    );

    if (rankA === 0 && rankB === 0) {
        return 100;
    }

    if (rankA === 0 || rankB === 0) {
        const challengerRank =
            rankA === 0 ? rankB : rankA;

        if (challengerRank <= 5) {
            return 100;
        }

        if (challengerRank <= 10) {
            return 70;
        }

        if (challengerRank <= 15) {
            return 35;
        }

        return 10;
    }

    if (distance <= 1) {
        return 100;
    }

    if (distance <= 3) {
        return 90;
    }

    if (distance <= 5) {
        return 75;
    }

    if (distance <= 10) {
        return 55;
    }

    if (distance <= 15) {
        return 35;
    }

    return 15;
}

// ============================================================
// OVR COMPATIBILITY
// ============================================================

function ovrDifference(fighterA, fighterB) {
    return Math.abs(
        getOVR(fighterA) -
        getOVR(fighterB)
    );
}

function ovrCompatibility(fighterA, fighterB) {
    const difference = ovrDifference(
        fighterA,
        fighterB
    );

    if (difference <= 2) {
        return 100;
    }

    if (difference <= 5) {
        return 95;
    }

    if (difference <= 8) {
        return 85;
    }

    if (difference <= 12) {
        return 70;
    }

    if (difference <= 18) {
        return 50;
    }

    if (difference <= 25) {
        return 30;
    }

    return 10;
}

// ============================================================
// FORM COMPATIBILITY
// ============================================================

function formCompatibility(fighterA, fighterB) {
    const formA = getRecentForm(fighterA);
    const formB = getRecentForm(fighterB);

    const difference = Math.abs(formA - formB);

    if (difference <= 0.05) {
        return 100;
    }

    if (difference <= 0.15) {
        return 90;
    }

    if (difference <= 0.25) {
        return 75;
    }

    if (difference <= 0.4) {
        return 55;
    }

    return 35;
}

// ============================================================
// FAME COMPATIBILITY
// ============================================================

function fameCompatibility(fighterA, fighterB) {
    const fameA = getFame(fighterA);
    const fameB = getFame(fighterB);

    const difference = Math.abs(fameA - fameB);

    if (difference <= 5) {
        return 100;
    }

    if (difference <= 15) {
        return 90;
    }

    if (difference <= 30) {
        return 75;
    }

    if (difference <= 50) {
        return 55;
    }

    return 30;
}

// ============================================================
// FIGHTER DRAW VALUE
// ============================================================

export function calculateDrawValue(fighter) {
    const fame = getFame(fighter);
    const followers = getFollowers(fighter);

    const followerScore =
        followers <= 0
            ? 0
            : Math.min(
                100,
                Math.log10(followers + 1) * 12
            );

    const ovr = getOVR(fighter);
    const winRate = getWinRate(fighter) * 100;

    return clamp(
        fame * 0.45 +
        followerScore * 0.15 +
        ovr * 0.2 +
        winRate * 0.2,
        0,
        100
    );
}

// ============================================================
// TITLE ELIGIBILITY
// ============================================================

export function isTitleEligible(
    fighter,
    opponent = null
) {
    if (!fighter) {
        return false;
    }

    if (getChampionStatus(fighter)) {
        return false;
    }

    const rank = getRank(fighter);

    if (rank !== null && rank <= 5) {
        return true;
    }

    if (opponent && getChampionStatus(opponent)) {
        return rank !== null && rank <= 10;
    }

    return false;
}

export function isChampionFight(fighterA, fighterB) {
    return (
        (getChampionStatus(fighterA) &&
            !getChampionStatus(fighterB)) ||
        (getChampionStatus(fighterB) &&
            !getChampionStatus(fighterA))
    );
}

export function isInterimTitleFight(
    fighterA,
    fighterB
) {
    if (
        getChampionStatus(fighterA) ||
        getChampionStatus(fighterB)
    ) {
        return false;
    }

    const rankA = getRank(fighterA);
    const rankB = getRank(fighterB);

    if (rankA === null || rankB === null) {
        return false;
    }

    return rankA <= 5 && rankB <= 5;
}

// ============================================================
// BOUT TYPE
// ============================================================

export function determineBoutType(
    fighterA,
    fighterB,
    options = {}
) {
    if (options.boutType) {
        return options.boutType;
    }

    if (options.tournament) {
        return BOUT_TYPES.TOURNAMENT;
    }

    if (hasFoughtBefore(fighterA, fighterB)) {
        const rematch = rematchEligibility(
            fighterA,
            fighterB,
            options.currentDate
        );

        if (rematch.eligible) {
            return BOUT_TYPES.REMATCH;
        }
    }

    if (isChampionFight(fighterA, fighterB)) {
        return BOUT_TYPES.TITLE;
    }

    if (isInterimTitleFight(fighterA, fighterB)) {
        return BOUT_TYPES.INTERIM_TITLE;
    }

    const rankA = getRank(fighterA);
    const rankB = getRank(fighterB);

    if (
        rankA !== null &&
        rankB !== null &&
        rankA <= 10 &&
        rankB <= 10
    ) {
        return BOUT_TYPES.CONTENDER;
    }

    const fightsA =
        safeNumber(fighterA?.record?.total, 0);

    const fightsB =
        safeNumber(fighterB?.record?.total, 0);

    if (fightsA <= 0 || fightsB <= 0) {
        return BOUT_TYPES.DEBUT;
    }

    return BOUT_TYPES.NORMAL;
}

// ============================================================
// HARD VALIDATION
// ============================================================

export function validateMatchup(
    fighterA,
    fighterB,
    options = {}
) {
    const errors = [];

    if (!fighterA) {
        errors.push("fighterA_missing");
    }

    if (!fighterB) {
        errors.push("fighterB_missing");
    }

    if (!fighterA || !fighterB) {
        return {
            valid: false,
            errors
        };
    }

    const idA = getFighterId(fighterA);
    const idB = getFighterId(fighterB);

    if (idA && idB && String(idA) === String(idB)) {
        errors.push("same_fighter");
    }

    if (!sameSex(fighterA, fighterB)) {
        errors.push("different_sex");
    }

    if (!sameWeightClass(fighterA, fighterB)) {
        errors.push("different_weight_class");
    }

    if (
        options.requireSamePromotion !== false &&
        !samePromotion(fighterA, fighterB)
    ) {
        errors.push("different_promotion");
    }

    if (!isAvailableFighter(fighterA)) {
        errors.push("fighterA_unavailable");
    }

    if (!isAvailableFighter(fighterB)) {
        errors.push("fighterB_unavailable");
    }

    if (
        options.requireProfessional !== false &&
        (!isProfessional(fighterA) ||
            !isProfessional(fighterB))
    ) {
        errors.push("not_professional");
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

export function isValidMatchup(
    fighterA,
    fighterB,
    options = {}
) {
    return validateMatchup(
        fighterA,
        fighterB,
        options
    ).valid;
}

// ============================================================
// MATCHMAKING SCORE
// ============================================================

export function calculateMatchmakingScore(
    fighterA,
    fighterB,
    options = {}
) {
    const validation = validateMatchup(
        fighterA,
        fighterB,
        options
    );

    if (!validation.valid) {
        return {
            score: 0,
            eligible: false,
            errors: validation.errors
        };
    }

    const rankingScore =
        rankingCompatibility(
            fighterA,
            fighterB
        );

    const ovrScore =
        ovrCompatibility(
            fighterA,
            fighterB
        );

    const formScore =
        formCompatibility(
            fighterA,
            fighterB
        );

    const fameScore =
        fameCompatibility(
            fighterA,
            fighterB
        );

    const drawA =
        calculateDrawValue(fighterA);

    const drawB =
        calculateDrawValue(fighterB);

    const drawScore =
        100 -
        Math.abs(drawA - drawB);

    const rematch =
        rematchEligibility(
            fighterA,
            fighterB,
            options.currentDate
        );

    let score =
        rankingScore * 0.35 +
        ovrScore * 0.25 +
        formScore * 0.12 +
        fameScore * 0.08 +
        drawScore * 0.10 +
        rematch.score * 0.10;

    const boutType =
        determineBoutType(
            fighterA,
            fighterB,
            options
        );

    if (
        boutType === BOUT_TYPES.TITLE ||
        boutType === BOUT_TYPES.INTERIM_TITLE
    ) {
        score += 15;
    }

    if (
        boutType === BOUT_TYPES.CONTENDER
    ) {
        score += 8;
    }

    if (
        options.preferRanked &&
        getRank(fighterB) !== null
    ) {
        score += 5;
    }

    if (
        options.preferSimilarOVR
    ) {
        score +=
            ovrScore >= 85
                ? 5
                : 0;
    }

    score += random() * 4;

    return {
        score: clamp(score, 0, 100),
        eligible: true,
        errors: [],
        boutType,
        factors: {
            ranking: rankingScore,
            ovr: ovrScore,
            form: formScore,
            fame: fameScore,
            draw: drawScore,
            rematch: rematch.score
        }
    };
}

// ============================================================
// CANDIDATE FILTER
// ============================================================

export function getMatchmakingCandidates(
    fighter,
    fighters,
    options = {}
) {
    if (!fighter) {
        return [];
    }

    let pool = Array.isArray(fighters)
        ? [...fighters]
        : Object.values(fighters || {});

    const fighterId =
        getFighterId(fighter);

    pool = pool.filter(candidate => {
        if (!candidate) {
            return false;
        }

        if (
            fighterId &&
            getFighterId(candidate) &&
            String(fighterId) ===
                String(getFighterId(candidate))
        ) {
            return false;
        }

        if (
            !isAvailableFighter(candidate)
        ) {
            return false;
        }

        if (
            options.requireProfessional !== false &&
            !isProfessional(candidate)
        ) {
            return false;
        }

        if (
            options.sameSex !== false &&
            !sameSex(fighter, candidate)
        ) {
            return false;
        }

        if (
            options.sameWeightClass !== false &&
            !sameWeightClass(fighter, candidate)
        ) {
            return false;
        }

        if (
            options.requireSamePromotion !== false &&
            !samePromotion(fighter, candidate)
        ) {
            return false;
        }

        if (
            options.excludeOpponentIds
                ?.length
        ) {
            const excluded =
                options.excludeOpponentIds.map(
                    id => String(id)
                );

            if (
                excluded.includes(
                    String(getFighterId(candidate))
                )
            ) {
                return false;
            }
        }

        if (
            options.excludePreviousOpponents &&
            hasFoughtBefore(
                fighter,
                candidate
            )
        ) {
            return false;
        }

        return true;
    });

    return pool;
}

// ============================================================
// RANKING SORT
// ============================================================

function sortCandidatesByScore(
    candidates
) {
    return [...candidates].sort(
        (a, b) =>
            safeNumber(b.matchmakingScore, 0) -
            safeNumber(a.matchmakingScore, 0)
    );
}

// ============================================================
// GENERATE CANDIDATES
// ============================================================

export function generateMatchmakingCandidates(
    fighter,
    fighters,
    options = {}
) {
    const candidates =
        getMatchmakingCandidates(
            fighter,
            fighters,
            options
        );

    const scored = candidates.map(
        candidate => {
            const result =
                calculateMatchmakingScore(
                    fighter,
                    candidate,
                    options
                );

            return {
                fighter: candidate,
                fighterId:
                    getFighterId(candidate),
                matchmakingScore:
                    result.score,
                boutType:
                    result.boutType,
                factors:
                    result.factors,
                eligible:
                    result.eligible
            };
        }
    );

    return sortCandidatesByScore(
        scored
    );
}

// ============================================================
// BEST OPPONENT
// ============================================================

export function findBestOpponent(
    fighter,
    fighters,
    options = {}
) {
    const candidates =
        generateMatchmakingCandidates(
            fighter,
            fighters,
            options
        );

    if (candidates.length === 0) {
        return null;
    }

    const minimumScore =
        safeNumber(
            options.minimumScore,
            0
        );

    const acceptable =
        candidates.filter(
            candidate =>
                candidate.matchmakingScore >=
                minimumScore
        );

    if (
        acceptable.length === 0
    ) {
        return candidates[0];
    }

    const selectionPool =
        acceptable.slice(
            0,
            Math.max(
                1,
                safeNumber(
                    options.selectionPoolSize,
                    5
                )
            )
        );

    /*
     * Não escolhemos sempre o primeiro.
     * Isso evita que o jogo faça exatamente
     * o mesmo matchmaking toda vez.
     */
    const weightedPool =
        selectionPool.map(
            candidate => ({
                candidate,
                weight:
                    Math.max(
                        1,
                        candidate.matchmakingScore
                    )
            })
        );

    const totalWeight =
        weightedPool.reduce(
            (sum, item) =>
                sum + item.weight,
            0
        );

    let roll =
        random() * totalWeight;

    for (const item of weightedPool) {
        roll -= item.weight;

        if (roll <= 0) {
            return item.candidate;
        }
    }

    return selectionPool[0];
}

// ============================================================
// TOP OPPONENTS
// ============================================================

export function findTopOpponents(
    fighter,
    fighters,
    limit = 5,
    options = {}
) {
    const candidates =
        generateMatchmakingCandidates(
            fighter,
            fighters,
            options
        );

    return candidates.slice(
        0,
        Math.max(1, limit)
    );
}

// ============================================================
// PLAYER MATCHMAKING
// ============================================================

export function generatePlayerMatchmaking(
    player,
    fighters,
    options = {}
) {
    if (!player) {
        return {
            player: null,
            candidates: [],
            bestOpponent: null
        };
    }

    const candidates =
        generateMatchmakingCandidates(
            player,
            fighters,
            {
                ...options,
                preferRanked:
                    options.preferRanked !== false
            }
        );

    const bestOpponent =
        findBestOpponent(
            player,
            fighters,
            options
        );

    return {
        player,
        playerId:
            getFighterId(player),
        candidates,
        bestOpponent,
        generatedAt:
            new Date().toISOString()
    };
}

// ============================================================
// AUTO MATCHMAKING FOR ALL FIGHTERS
// ============================================================

export function generateAutomaticMatchups(
    fighters,
    options = {}
) {
    let pool = Array.isArray(fighters)
        ? [...fighters]
        : Object.values(fighters || {});

    pool = pool.filter(
        fighter =>
            isAvailableFighter(fighter) &&
            isProfessional(fighter)
    );

    const matchups = [];
    const alreadyMatched = new Set();

    /*
     * Melhores ranqueados primeiro.
     */
    pool.sort((a, b) => {
        const rankA =
            getRank(a) === null
                ? 999
                : getRank(a);

        const rankB =
            getRank(b) === null
                ? 999
                : getRank(b);

        return rankA - rankB;
    });

    for (const fighter of pool) {
        const fighterId =
            getFighterId(fighter);

        if (
            fighterId &&
            alreadyMatched.has(
                String(fighterId)
            )
        ) {
            continue;
        }

        const candidates =
            generateMatchmakingCandidates(
                fighter,
                pool,
                {
                    ...options,
                    excludeOpponentIds: [
                        ...(options.excludeOpponentIds || []),
                        ...alreadyMatched
                    ]
                }
            );

        if (candidates.length === 0) {
            continue;
        }

        const opponent =
            candidates[0];

        if (!opponent?.fighter) {
            continue;
        }

        const opponentId =
            getFighterId(
                opponent.fighter
            );

        if (
            fighterId &&
            opponentId &&
            String(fighterId) ===
                String(opponentId)
        ) {
            continue;
        }

        if (
            fighterId &&
            opponentId
        ) {
            alreadyMatched.add(
                String(fighterId)
            );

            alreadyMatched.add(
                String(opponentId)
            );
        }

        const boutType =
            determineBoutType(
                fighter,
                opponent.fighter,
                options
            );

        matchups.push(
            createFightBooking(
                fighter,
                opponent.fighter,
                {
                    ...options,
                    boutType
                }
            )
        );
    }

    return matchups;
}

// ============================================================
// FIGHT BOOKING
// ============================================================

export function createFightBooking(
    fighterA,
    fighterB,
    options = {}
) {
    const validation =
        validateMatchup(
            fighterA,
            fighterB,
            options
        );

    if (!validation.valid) {
        return {
            valid: false,
            errors: validation.errors,
            booking: null
        };
    }

    const matchmaking =
        calculateMatchmakingScore(
            fighterA,
            fighterB,
            options
        );

    const boutType =
        options.boutType ||
        matchmaking.boutType ||
        determineBoutType(
            fighterA,
            fighterB,
            options
        );

    const bookingId =
        options.bookingId ||
        `fight_${Date.now()}_${randomInt(
            1000,
            9999
        )}`;

    const booking = {
        id: bookingId,

        status: "scheduled",

        fighterAId:
            getFighterId(fighterA),

        fighterBId:
            getFighterId(fighterB),

        promotionId:
            options.promotionId ||
            getPromotionId(fighterA),

        weightClass:
            getWeightClass(fighterA),

        boutType,

        titleFight:
            boutType === BOUT_TYPES.TITLE ||
            boutType === BOUT_TYPES.INTERIM_TITLE,

        interimTitle:
            boutType ===
            BOUT_TYPES.INTERIM_TITLE,

        tournament:
            boutType === BOUT_TYPES.TOURNAMENT,

        rematch:
            boutType === BOUT_TYPES.REMATCH,

        matchmakingScore:
            matchmaking.score,

        ranking: {
            fighterA:
                getRank(fighterA),
            fighterB:
                getRank(fighterB)
        },

        ovr: {
            fighterA:
                getOVR(fighterA),
            fighterB:
                getOVR(fighterB)
        },

        scheduledDate:
            options.scheduledDate ||
            null,

        venueId:
            options.venueId ||
            null,

        eventId:
            options.eventId ||
            null,

        purse: {
            fighterA:
                safeNumber(
                    options.purseA,
                    0
                ),

            fighterB:
                safeNumber(
                    options.purseB,
                    0
                )
        },

        createdAt:
            new Date().toISOString()
    };

    return {
        valid: true,
        errors: [],
        booking
    };
}

// ============================================================
// TITLE CHALLENGER SELECTION
// ============================================================

export function findTitleChallengers(
    champion,
    fighters,
    options = {}
) {
    if (!champion) {
        return [];
    }

    const candidates =
        getMatchmakingCandidates(
            champion,
            fighters,
            {
                ...options,
                requireSamePromotion: true,
                sameWeightClass: true
            }
        );

    const eligible =
        candidates.filter(
            fighter =>
                isTitleEligible(
                    fighter,
                    champion
                )
        );

    return eligible
        .map(fighter => {
            const matchmaking =
                calculateMatchmakingScore(
                    champion,
                    fighter,
                    {
                        ...options,
                        preferRanked: true
                    }
                );

            return {
                fighter,
                fighterId:
                    getFighterId(fighter),
                score:
                    matchmaking.score,
                rank:
                    getRank(fighter),
                ovr:
                    getOVR(fighter)
            };
        })
        .sort(
            (a, b) =>
                safeNumber(b.score) -
                safeNumber(a.score)
        );
}

// ============================================================
// CONTENDER MATCHMAKING
// ============================================================

export function findContenderMatchups(
    fighters,
    options = {}
) {
    let pool = Array.isArray(fighters)
        ? [...fighters]
        : Object.values(fighters || {});

    pool = pool.filter(
        fighter => {
            const rank =
                getRank(fighter);

            return (
                isAvailableFighter(fighter) &&
                isProfessional(fighter) &&
                rank !== null &&
                rank > 0 &&
                rank <=
                    safeNumber(
                        options.maxRank,
                        15
                    )
            );
        }
    );

    pool.sort(
        (a, b) =>
            safeNumber(getRank(a), 999) -
            safeNumber(getRank(b), 999)
    );

    const results = [];
    const used = new Set();

    for (const fighter of pool) {
        const id =
            getFighterId(fighter);

        if (
            id &&
            used.has(String(id))
        ) {
            continue;
        }

        const candidates =
            generateMatchmakingCandidates(
                fighter,
                pool,
                {
                    ...options,
                    preferRanked: true,
                    minimumScore:
                        options.minimumScore ||
                        60,
                    selectionPoolSize: 3
                }
            );

        const candidate =
            candidates.find(
                item => {
                    const opponentRank =
                        getRank(
                            item.fighter
                        );

                    return (
                        opponentRank !== null &&
                        opponentRank > 0
                    );
                }
            );

        if (!candidate) {
            continue;
        }

        const opponent =
            candidate.fighter;

        const opponentId =
            getFighterId(opponent);

        if (
            id &&
            opponentId
        ) {
            used.add(String(id));
            used.add(String(opponentId));
        }

        results.push(
            createFightBooking(
                fighter,
                opponent,
                {
                    ...options,
                    boutType:
                        BOUT_TYPES.CONTENDER
                }
            )
        );
    }

    return results;
}

// ============================================================
// RANKING ANALYSIS
// ============================================================

export function analyzeRankingMatchup(
    fighterA,
    fighterB
) {
    const rankA = getRank(fighterA);
    const rankB = getRank(fighterB);

    const championA =
        getChampionStatus(fighterA);

    const championB =
        getChampionStatus(fighterB);

    return {
        fighterA: {
            rank: rankA,
            champion: championA
        },

        fighterB: {
            rank: rankB,
            champion: championB
        },

        distance:
            rankingDistance(
                fighterA,
                fighterB
            ),

        compatibility:
            rankingCompatibility(
                fighterA,
                fighterB
            ),

        titleFight:
            isChampionFight(
                fighterA,
                fighterB
            ),

        interimTitle:
            isInterimTitleFight(
                fighterA,
                fighterB
            )
    };
}

// ============================================================
// MATCHUP ANALYSIS
// ============================================================

export function analyzeMatchup(
    fighterA,
    fighterB,
    options = {}
) {
    const validation =
        validateMatchup(
            fighterA,
            fighterB,
            options
        );

    const score =
        calculateMatchmakingScore(
            fighterA,
            fighterB,
            options
        );

    return {
        valid:
            validation.valid,

        errors:
            validation.errors,

        fighterA: {
            id:
                getFighterId(fighterA),
            name:
                fighterA?.identity?.fullName ||
                fighterA?.name ||
                "Unknown",
            ovr:
                getOVR(fighterA),
            rank:
                getRank(fighterA),
            fame:
                getFame(fighterA),
            drawValue:
                calculateDrawValue(fighterA)
        },

        fighterB: {
            id:
                getFighterId(fighterB),
            name:
                fighterB?.identity?.fullName ||
                fighterB?.name ||
                "Unknown",
            ovr:
                getOVR(fighterB),
            rank:
                getRank(fighterB),
            fame:
                getFame(fighterB),
            drawValue:
                calculateDrawValue(fighterB)
        },

        matchmakingScore:
            score.score,

        eligible:
            score.eligible,

        boutType:
            score.boutType,

        factors:
            score.factors,

        ranking:
            analyzeRankingMatchup(
                fighterA,
                fighterB
            ),

        rematch:
            rematchEligibility(
                fighterA,
                fighterB,
                options.currentDate
            )
    };
}

// ============================================================
// MATCHMAKING FILTERS
// ============================================================

export function filterByWeightClass(
    fighters,
    weightClass
) {
    const target =
        normalizeString(weightClass);

    return (
        Array.isArray(fighters)
            ? fighters
            : Object.values(fighters || {})
    ).filter(
        fighter =>
            normalizeString(
                getWeightClass(fighter)
            ) === target
    );
}

export function filterByPromotion(
    fighters,
    promotionId
) {
    const target =
        normalizeString(promotionId);

    return (
        Array.isArray(fighters)
            ? fighters
            : Object.values(fighters || {})
    ).filter(
        fighter =>
            normalizeString(
                getPromotionId(fighter)
            ) === target
    );
}

export function filterByRankRange(
    fighters,
    minRank = 1,
    maxRank = 15
) {
    return (
        Array.isArray(fighters)
            ? fighters
            : Object.values(fighters || {})
    ).filter(fighter => {
        const rank =
            getRank(fighter);

        return (
            rank !== null &&
            rank >= minRank &&
            rank <= maxRank
        );
    });
}

// ============================================================
// MATCHMAKING SUMMARY
// ============================================================

export function getMatchmakingSummary(
    fighter,
    fighters,
    options = {}
) {
    const allCandidates =
        getMatchmakingCandidates(
            fighter,
            fighters,
            options
        );

    const scored =
        generateMatchmakingCandidates(
            fighter,
            fighters,
            options
        );

    const championCandidates =
        scored.filter(
            item =>
                getChampionStatus(
                    item.fighter
                )
        );

    const rankedCandidates =
        scored.filter(item => {
            const rank =
                getRank(item.fighter);

            return (
                rank !== null &&
                rank > 0
            );
        });

    const titleCandidates =
        scored.filter(
            item =>
                isTitleEligible(
                    item.fighter,
                    fighter
                )
        );

    return {
        fighterId:
            getFighterId(fighter),

        totalCandidates:
            allCandidates.length,

        rankedCandidates:
            rankedCandidates.length,

        titleCandidates:
            titleCandidates.length,

        championCandidates:
            championCandidates.length,

        bestOpponent:
            scored[0] || null,

        topFive:
            scored.slice(0, 5),

        averageScore:
            scored.length > 0
                ? scored.reduce(
                    (sum, item) =>
                        sum +
                        safeNumber(
                            item.matchmakingScore
                        ),
                    0
                ) / scored.length
                : 0
    };
}

// ============================================================
// DATABASE HELPERS
// ============================================================

export function getAvailableFighters(
    fighters
) {
    const pool = Array.isArray(fighters)
        ? fighters
        : Object.values(fighters || {});

    return pool.filter(
        fighter =>
            isAvailableFighter(fighter)
    );
}

export function getProfessionalFighters(
    fighters
) {
    return getAvailableFighters(
        fighters
    ).filter(
        fighter =>
            isProfessional(fighter)
    );
}

export function getRankedFighters(
    fighters
) {
    return getProfessionalFighters(
        fighters
    ).filter(
        fighter =>
            getRank(fighter) !== null &&
            getRank(fighter) > 0
    );
}

export function getChampions(
    fighters
) {
    return getProfessionalFighters(
        fighters
    ).filter(
        fighter =>
            getChampionStatus(fighter)
    );
}

// ============================================================
// FACTORY
// ============================================================

export function createMatchmakingSystem(
    options = {}
) {
    return {
        version:
            MATCHMAKING_VERSION,

        enabled:
            options.enabled !== false,

        minimumScore:
            safeNumber(
                options.minimumScore,
                45
            ),

        selectionPoolSize:
            safeNumber(
                options.selectionPoolSize,
                5
            ),

        requireSamePromotion:
            options.requireSamePromotion !== false,

        requireProfessional:
            options.requireProfessional !== false,

        preferRanked:
            options.preferRanked !== false,

        currentDate:
            options.currentDate ||
            null
    };
}

// ============================================================
// VALIDATION
// ============================================================

export function validateMatchmakingSystem(
    system
) {
    if (!system || typeof system !== "object") {
        return {
            valid: false,
            errors: ["system_missing"]
        };
    }

    const errors = [];

    if (
        safeNumber(
            system.minimumScore,
            -1
        ) < 0 ||
        safeNumber(
            system.minimumScore,
            101
        ) > 100
    ) {
        errors.push(
            "invalid_minimum_score"
        );
    }

    if (
        safeNumber(
            system.selectionPoolSize,
            0
        ) < 1
    ) {
        errors.push(
            "invalid_selection_pool_size"
        );
    }

    return {
        valid:
            errors.length === 0,
        errors
    };
}

// ============================================================
// CLONE
// ============================================================

export function cloneMatchmakingData(
    data
) {
    if (data === undefined) {
        return undefined;
    }

    if (data === null) {
        return null;
    }

    return JSON.parse(
        JSON.stringify(data)
    );
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
    MATCHMAKING_VERSION,

    BOUT_TYPES,
    MATCHMAKING_STATUS,

    calculateDrawValue,

    isTitleEligible,
    isChampionFight,
    isInterimTitleFight,

    determineBoutType,

    validateMatchup,
    isValidMatchup,

    calculateMatchmakingScore,

    getMatchmakingCandidates,
    generateMatchmakingCandidates,

    findBestOpponent,
    findTopOpponents,

    generatePlayerMatchmaking,
    generateAutomaticMatchups,

    createFightBooking,

    findTitleChallengers,
    findContenderMatchups,

    analyzeRankingMatchup,
    analyzeMatchup,

    filterByWeightClass,
    filterByPromotion,
    filterByRankRange,

    getMatchmakingSummary,

    getAvailableFighters,
    getProfessionalFighters,
    getRankedFighters,
    getChampions,

    createMatchmakingSystem,
    validateMatchmakingSystem,

    cloneMatchmakingData
};
