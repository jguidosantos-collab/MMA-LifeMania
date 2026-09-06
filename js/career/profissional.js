// ============================================================
// MMA LIFE DYNASTY
// js/career/professional.js
// ============================================================

import {
    CAREER_STAGES,
    MIN_PRO_AGE
} from "../core/constants.js";

import {
    calculateAge
} from "../core/clock.js";

import {
    getOVR
} from "../mma/matchup.js";

// ============================================================
// VERSION
// ============================================================

export const PROFESSIONAL_VERSION = 1;

// ============================================================
// CAREER STAGES
// ============================================================

export const PROFESSIONAL_STAGES = Object.freeze({
    REGIONAL: "Regional",
    NATIONAL: "National",
    INTERNATIONAL: "International",
    ELITE: "Elite"
});

export const PROFESSIONAL_STAGE_ORDER =
    Object.freeze([
        PROFESSIONAL_STAGES.REGIONAL,
        PROFESSIONAL_STAGES.NATIONAL,
        PROFESSIONAL_STAGES.INTERNATIONAL,
        PROFESSIONAL_STAGES.ELITE
    ]);

// ============================================================
// STATUS
// ============================================================

export const PROFESSIONAL_STATUS =
    Object.freeze({
        INACTIVE: "inactive",
        ACTIVE: "active",
        SUSPENDED: "suspended",
        RETIRED: "retired",
        DECEASED: "deceased"
    });

// ============================================================
// RESULT TYPES
// ============================================================

export const PROFESSIONAL_RESULTS =
    Object.freeze({
        WIN: "win",
        LOSS: "loss",
        DRAW: "draw",
        NO_CONTEST: "no_contest"
    });

// ============================================================
// RETIREMENT REASONS
// ============================================================

export const RETIREMENT_REASONS =
    Object.freeze({
        AGE: "age",
        HEALTH: "health",
        INJURY: "injury",
        PERSONAL: "personal",
        FINANCIAL: "financial",
        FAMILY: "family",
        CHOICE: "choice",
        CAREER_END: "career_end"
    });

// ============================================================
// CONFIG
// ============================================================

export const PROFESSIONAL_CONFIG =
    Object.freeze({
        minimumAge:
            MIN_PRO_AGE ?? 18,

        regionalMinimumFights: 1,

        nationalMinimumFights: 4,

        internationalMinimumFights: 8,

        eliteMinimumFights: 12,

        regionalMinimumWins: 0,

        nationalMinimumWins: 3,

        internationalMinimumWins: 6,

        eliteMinimumWins: 9,

        nationalMinimumOVR: 60,

        internationalMinimumOVR: 70,

        eliteMinimumOVR: 80,

        eliteRequiredWinRate: 0.65,

        retirementAge: 40,

        comebackMinimumDays: 90,

        experiencePerFight: 5,

        winExperienceBonus: 3,

        lossExperienceGain: 1,

        drawExperienceGain: 1.5,

        famePerFight: 2,

        famePerWin: 4,

        rankingWinPoints: 20,

        rankingLossPoints: -5,

        rankingDrawPoints: 2
    });

// ============================================================
// HELPERS
// ============================================================

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

function clamp(
    value,
    min = 0,
    max = 100
) {
    return Math.max(
        min,
        Math.min(
            max,
            safeNumber(
                value,
                min
            )
        )
    );
}

function round(
    value,
    decimals = 2
) {
    const multiplier =
        10 ** decimals;

    return Math.round(
        safeNumber(value) *
        multiplier
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

function createId(
    prefix = "professional"
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

// ============================================================
// PLAYER ACCESS
// ============================================================

function getPlayerAge(
    player,
    currentDate = null
) {
    if (!player) {
        return 0;
    }

    if (
        Number.isFinite(
            Number(player.age)
        )
    ) {
        return Number(
            player.age
        );
    }

    if (
        player.identity?.age !==
        undefined
    ) {
        return safeNumber(
            player.identity.age,
            0
        );
    }

    const birthDate =
        player.birthDate ||
        player.identity?.birthDate;

    if (
        birthDate &&
        currentDate
    ) {
        try {
            return calculateAge(
                birthDate,
                currentDate
            );
        } catch {
            return 0;
        }
    }

    return 0;
}

function ensureCareer(
    player
) {
    if (
        !player.career
    ) {
        player.career = {};
    }

    return player.career;
}

function ensureProfessionalCareer(
    player
) {
    const career =
        ensureCareer(player);

    if (
        !career.professional ||
        typeof career.professional ===
        "boolean"
    ) {
        career.professional = {
            active:
                career.professional ===
                true,

            started: false,

            status:
                PROFESSIONAL_STATUS
                    .INACTIVE,

            startDate: null,
            lastFightDate: null,
            nextEligibleDate: null,

            fights: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            noContests: 0,

            experience: 0,
            fame: 0,
            rankingPoints: 0,

            currentPromotionId: null,
            currentDivision: null,
            currentRank: null,

            titles: [],
            history: [],

            retirement: null
        };
    }

    const professional =
        career.professional;

    if (
        !Array.isArray(
            professional.titles
        )
    ) {
        professional.titles = [];
    }

    if (
        !Array.isArray(
            professional.history
        )
    ) {
        professional.history = [];
    }

    return professional;
}

// ============================================================
// CREATE CAREER
// ============================================================

export function createProfessionalCareer(
    options = {}
) {
    return {
        id:
            options.id ||
            createId(
                "professionalCareer"
            ),

        active:
            options.active ??
            false,

        started:
            options.started ??
            false,

        status:
            options.status ||
            PROFESSIONAL_STATUS.INACTIVE,

        startDate:
            options.startDate ||
            null,

        lastFightDate:
            options.lastFightDate ||
            null,

        nextEligibleDate:
            options.nextEligibleDate ||
            null,

        fights:
            safeNumber(
                options.fights,
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

        noContests:
            safeNumber(
                options.noContests,
                0
            ),

        experience:
            clamp(
                options.experience ??
                0
            ),

        fame:
            clamp(
                options.fame ??
                0
            ),

        rankingPoints:
            safeNumber(
                options.rankingPoints,
                0
            ),

        currentPromotionId:
            options.currentPromotionId ||
            null,

        currentDivision:
            options.currentDivision ||
            null,

        currentRank:
            options.currentRank ??
            null,

        stage:
            options.stage ||
            PROFESSIONAL_STAGES.REGIONAL,

        titles:
            Array.isArray(
                options.titles
            )
                ? clone(options.titles)
                : [],

        history:
            Array.isArray(
                options.history
            )
                ? clone(options.history)
                : [],

        retirement:
            options.retirement
                ? clone(
                    options.retirement
                )
                : null,

        progression:
            {
                nextStage:
                    options.progression
                        ?.nextStage ||
                    null,

                ready:
                    options.progression
                        ?.ready ??
                    false,

                score:
                    safeNumber(
                        options.progression
                            ?.score,
                        0
                    ),

                reasons:
                    Array.isArray(
                        options.progression
                            ?.reasons
                    )
                        ? clone(
                            options.progression
                                .reasons
                        )
                        : []
            }
    };
}

// ============================================================
// GETTERS
// ============================================================

export function getProfessionalCareer(
    player
) {
    return (
        player?.career
            ?.professional ||
        null
    );
}

export function getProfessionalRecord(
    player
) {
    const career =
        getProfessionalCareer(
            player
        );

    if (
        !career
    ) {
        return {
            fights: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            noContests: 0
        };
    }

    return {
        fights:
            safeNumber(
                career.fights
            ),

        wins:
            safeNumber(
                career.wins
            ),

        losses:
            safeNumber(
                career.losses
            ),

        draws:
            safeNumber(
                career.draws
            ),

        noContests:
            safeNumber(
                career.noContests
            )
    };
}

export function getProfessionalWinRate(
    player
) {
    const record =
        getProfessionalRecord(
            player
        );

    if (
        record.fights <= 0
    ) {
        return 0;
    }

    return round(
        record.wins /
        record.fights,
        3
    );
}

export function getProfessionalStage(
    player
) {
    const career =
        getProfessionalCareer(
            player
        );

    return (
        career?.stage ||
        normalizeProfessionalStage(
            player?.career?.stage
        ) ||
        PROFESSIONAL_STAGES.REGIONAL
    );
}

// ============================================================
// STAGE NORMALIZATION
// ============================================================

function normalizeProfessionalStage(
    stage
) {
    const value =
        String(
            stage || ""
        )
            .trim()
            .toLowerCase();

    if (
        value === "regional"
    ) {
        return PROFESSIONAL_STAGES
            .REGIONAL;
    }

    if (
        value === "national"
    ) {
        return PROFESSIONAL_STAGES
            .NATIONAL;
    }

    if (
        value === "international"
    ) {
        return PROFESSIONAL_STAGES
            .INTERNATIONAL;
    }

    if (
        value === "elite" ||
        value === "ufc"
    ) {
        return PROFESSIONAL_STAGES
            .ELITE;
    }

    return null;
}

export function getStageIndex(
    stage
) {
    const normalized =
        normalizeProfessionalStage(
            stage
        );

    return PROFESSIONAL_STAGE_ORDER
        .indexOf(normalized);
}

// ============================================================
// PROFESSIONAL STATUS
// ============================================================

export function isProfessional(
    player
) {
    const career =
        getProfessionalCareer(
            player
        );

    return Boolean(
        career?.active ||
        career?.started ||
        player?.professional?.active ||
        player?.career?.professional ===
        true
    );
}

// ============================================================
// START PROFESSIONAL CAREER
// ============================================================

export function canStartProfessionalCareer(
    player,
    currentDate = null,
    config = PROFESSIONAL_CONFIG
) {
    if (!player) {
        return {
            allowed: false,
            reason: "player_missing"
        };
    }

    const age =
        getPlayerAge(
            player,
            currentDate
        );

    if (
        age <
        config.minimumAge
    ) {
        return {
            allowed: false,
            reason: "under_professional_age",
            age,
            minimumAge:
                config.minimumAge
        };
    }

    const career =
        getProfessionalCareer(
            player
        );

    if (
        career?.active
    ) {
        return {
            allowed: false,
            reason: "already_professional"
        };
    }

    if (
        career?.status ===
        PROFESSIONAL_STATUS.RETIRED
    ) {
        return {
            allowed: false,
            reason: "retired"
        };
    }

    return {
        allowed: true,
        reason: null,
        age
    };
}

export function startProfessionalCareer(
    player,
    currentDate = null,
    options = {}
) {
    const config = {
        ...PROFESSIONAL_CONFIG,
        ...options.config
    };

    const eligibility =
        canStartProfessionalCareer(
            player,
            currentDate,
            config
        );

    if (
        !eligibility.allowed &&
        !options.force
    ) {
        return {
            success: false,
            reason:
                eligibility.reason
        };
    }

    const professional =
        ensureProfessionalCareer(
            player
        );

    professional.active = true;
    professional.started = true;

    professional.status =
        PROFESSIONAL_STATUS.ACTIVE;

    professional.startDate =
        currentDate ||
        professional.startDate ||
        null;

    professional.stage =
        options.stage ||
        PROFESSIONAL_STAGES.REGIONAL;

    professional.currentPromotionId =
        options.promotionId ||
        professional.currentPromotionId ||
        null;

    professional.currentDivision =
        options.division ||
        professional.currentDivision ||
        player?.physical?.weightClass ||
        player?.weightClass ||
        null;

    const career =
        ensureCareer(player);

    career.stage =
        professional.stage;

    if (
        typeof career.professional ===
        "boolean"
    ) {
        career.professional =
            professional;
    }

    return {
        success: true,

        professional,

        stage:
            professional.stage
    };
}

// ============================================================
// FIGHT ELIGIBILITY
// ============================================================

function dateDifferenceDays(
    dateA,
    dateB
) {
    if (
        !dateA ||
        !dateB
    ) {
        return Infinity;
    }

    const a =
        new Date(dateA);

    const b =
        new Date(dateB);

    if (
        Number.isNaN(
            a.getTime()
        ) ||
        Number.isNaN(
            b.getTime()
        )
    ) {
        return Infinity;
    }

    return Math.floor(
        Math.abs(
            a.getTime() -
            b.getTime()
        ) /
        86400000
    );
}

export function canHaveProfessionalFight(
    player,
    currentDate = null,
    options = {}
) {
    const config = {
        ...PROFESSIONAL_CONFIG,
        ...options.config
    };

    const professional =
        getProfessionalCareer(
            player
        );

    if (
        !professional?.active
    ) {
        return {
            allowed: false,
            reason:
                "professional_career_not_active"
        };
    }

    if (
        professional.status ===
        PROFESSIONAL_STATUS.RETIRED
    ) {
        return {
            allowed: false,
            reason: "retired"
        };
    }

    if (
        professional.status ===
        PROFESSIONAL_STATUS.SUSPENDED
    ) {
        return {
            allowed: false,
            reason: "suspended"
        };
    }

    if (
        professional.status ===
        PROFESSIONAL_STATUS.DECEASED
    ) {
        return {
            allowed: false,
            reason: "deceased"
        };
    }

    if (
        professional.lastFightDate &&
        currentDate
    ) {
        const days =
            dateDifferenceDays(
                professional.lastFightDate,
                currentDate
            );

        if (
            days <
            14
        ) {
            return {
                allowed: false,
                reason:
                    "insufficient_rest",
                daysSinceLastFight:
                    days,
                required: 14
            };
        }
    }

    const age =
        getPlayerAge(
            player,
            currentDate
        );

    if (
        age <
        config.minimumAge
    ) {
        return {
            allowed: false,
            reason:
                "under_professional_age",
            age
        };
    }

    return {
        allowed: true,
        reason: null
    };
}

// ============================================================
// RESULT NORMALIZATION
// ============================================================

export function normalizeProfessionalResult(
    result
) {
    const normalized =
        String(
            result || ""
        )
            .trim()
            .toLowerCase()
            .replace(/[\s-]+/g, "_");

    if (
        normalized === "win" ||
        normalized === "won" ||
        normalized === "victory"
    ) {
        return PROFESSIONAL_RESULTS.WIN;
    }

    if (
        normalized === "loss" ||
        normalized === "lost" ||
        normalized === "defeat"
    ) {
        return PROFESSIONAL_RESULTS.LOSS;
    }

    if (
        normalized === "draw" ||
        normalized === "tie"
    ) {
        return PROFESSIONAL_RESULTS.DRAW;
    }

    if (
        normalized === "nc" ||
        normalized === "no_contest" ||
        normalized === "nocontest"
    ) {
        return PROFESSIONAL_RESULTS
            .NO_CONTEST;
    }

    return null;
}

// ============================================================
// EXPERIENCE
// ============================================================

export function calculateProfessionalExperienceGain(
    result,
    options = {},
    config = PROFESSIONAL_CONFIG
) {
    const normalized =
        normalizeProfessionalResult(
            result
        );

    let gain =
        config.experiencePerFight;

    if (
        normalized ===
        PROFESSIONAL_RESULTS.WIN
    ) {
        gain +=
            config.winExperienceBonus;
    } else if (
        normalized ===
        PROFESSIONAL_RESULTS.LOSS
    ) {
        gain =
            config.lossExperienceGain;
    } else if (
        normalized ===
        PROFESSIONAL_RESULTS.DRAW
    ) {
        gain =
            config.drawExperienceGain;
    }

    const opponentOVR =
        safeNumber(
            options.opponentOVR,
            0
        );

    const playerOVR =
        safeNumber(
            options.playerOVR,
            0
        );

    if (
        opponentOVR > 0 &&
        playerOVR > 0
    ) {
        const difference =
            opponentOVR -
            playerOVR;

        if (
            difference >= 10
        ) {
            gain *= 1.35;
        } else if (
            difference >= 5
        ) {
            gain *= 1.15;
        } else if (
            difference <= -10
        ) {
            gain *= 0.85;
        }
    }

    if (
        options.titleFight
    ) {
        gain *= 1.25;
    }

    if (
        options.eliteOpponent
    ) {
        gain *= 1.30;
    }

    return round(
        Math.max(
            0,
            gain
        ),
        2
    );
}

// ============================================================
// FAME
// ============================================================

export function calculateProfessionalFameGain(
    result,
    options = {},
    config = PROFESSIONAL_CONFIG
) {
    const normalized =
        normalizeProfessionalResult(
            result
        );

    let gain =
        config.famePerFight;

    if (
        normalized ===
        PROFESSIONAL_RESULTS.WIN
    ) {
        gain +=
            config.famePerWin;
    }

    if (
        options.titleFight
    ) {
        gain *= 1.5;
    }

    if (
        options.eliteOpponent
    ) {
        gain *= 1.75;
    }

    if (
        options.mainEvent
    ) {
        gain *= 1.5;
    }

    return round(
        Math.max(
            0,
            gain
        ),
        2
    );
}

// ============================================================
// RANKING POINTS
// ============================================================

export function calculateProfessionalRankingPoints(
    result,
    options = {},
    config = PROFESSIONAL_CONFIG
) {
    const normalized =
        normalizeProfessionalResult(
            result
        );

    let points = 0;

    if (
        normalized ===
        PROFESSIONAL_RESULTS.WIN
    ) {
        points =
            config.rankingWinPoints;
    } else if (
        normalized ===
        PROFESSIONAL_RESULTS.LOSS
    ) {
        points =
            config.rankingLossPoints;
    } else if (
        normalized ===
        PROFESSIONAL_RESULTS.DRAW
    ) {
        points =
            config.rankingDrawPoints;
    }

    const opponentRank =
        safeNumber(
            options.opponentRank,
            0
        );

    if (
        points > 0 &&
        opponentRank > 0
    ) {
        if (
            opponentRank <= 5
        ) {
            points *= 2;
        } else if (
            opponentRank <= 10
        ) {
            points *= 1.5;
        } else if (
            opponentRank <= 15
        ) {
            points *= 1.25;
        }
    }

    if (
        options.titleFight
    ) {
        points *= 1.5;
    }

    if (
        options.eliteOpponent
    ) {
        points *= 1.5;
    }

    return round(
        points,
        2
    );
}

// ============================================================
// REGISTER PROFESSIONAL FIGHT
// ============================================================

export function registerProfessionalFight(
    player,
    result,
    options = {}
) {
    const config = {
        ...PROFESSIONAL_CONFIG,
        ...options.config
    };

    const normalized =
        normalizeProfessionalResult(
            result
        );

    if (
        !normalized
    ) {
        return {
            success: false,
            reason:
                "invalid_result"
        };
    }

    const eligibility =
        canHaveProfessionalFight(
            player,
            options.date ||
            null,
            {
                config
            }
        );

    if (
        !eligibility.allowed &&
        !options.ignoreEligibility
    ) {
        return {
            success: false,
            reason:
                eligibility.reason
        };
    }

    const professional =
        ensureProfessionalCareer(
            player
        );

    const opponent =
        options.opponent ||
        null;

    const playerOVR =
        safeNumber(
            options.playerOVR ??
            getOVR(player),
            0
        );

    const opponentOVR =
        safeNumber(
            options.opponentOVR ??
            getOVR(opponent),
            0
        );

    const experienceGain =
        calculateProfessionalExperienceGain(
            normalized,
            {
                ...options,
                playerOVR,
                opponentOVR
            },
            config
        );

    const fameGain =
        calculateProfessionalFameGain(
            normalized,
            options,
            config
        );

    const rankingPoints =
        calculateProfessionalRankingPoints(
            normalized,
            options,
            config
        );

    /*
     * Atualiza cartel.
     */
    professional.fights += 1;

    if (
        normalized ===
        PROFESSIONAL_RESULTS.WIN
    ) {
        professional.wins += 1;
    } else if (
        normalized ===
        PROFESSIONAL_RESULTS.LOSS
    ) {
        professional.losses += 1;
    } else if (
        normalized ===
        PROFESSIONAL_RESULTS.DRAW
    ) {
        professional.draws += 1;
    } else if (
        normalized ===
        PROFESSIONAL_RESULTS.NO_CONTEST
    ) {
        professional.noContests += 1;
    }

    professional.experience =
        clamp(
            professional.experience +
            experienceGain
        );

    professional.fame =
        clamp(
            professional.fame +
            fameGain
        );

    professional.rankingPoints +=
        rankingPoints;

    professional.lastFightDate =
        options.date ||
        professional.lastFightDate ||
        null;

    professional.nextEligibleDate =
        calculateNextEligibleDate(
            professional.lastFightDate
        );

    const fight = {
        id:
            options.fightId ||
            createId(
                "professionalFight"
            ),

        date:
            options.date ||
            null,

        result:
            normalized,

        opponentId:
            opponent?.id ||
            options.opponentId ||
            null,

        opponentName:
            opponent?.name ||
            opponent?.identity?.name ||
            options.opponentName ||
            null,

        playerOVR,
        opponentOVR,

        promotionId:
            options.promotionId ||
            professional.currentPromotionId ||
            null,

        promotionName:
            options.promotionName ||
            null,

        division:
            options.division ||
            professional.currentDivision ||
            null,

        stage:
            options.stage ||
            professional.stage,

        method:
            options.method ||
            null,

        round:
            safeNumber(
                options.round,
                0
            ),

        titleFight:
            Boolean(
                options.titleFight
            ),

        titleWon:
            Boolean(
                options.titleWon
            ),

        mainEvent:
            Boolean(
                options.mainEvent
            ),

        tournament:
            options.tournament ||
            null,

        opponentRank:
            options.opponentRank ??
            null,

        experienceGain,
        fameGain,
        rankingPoints,

        notes:
            options.notes ||
            null
    };

    professional.history.push(
        fight
    );

    /*
     * Se ganhou um título,
     * registra automaticamente.
     */
    if (
        options.titleWon
    ) {
        addTitle(
            player,
            {
                id:
                    options.titleId ||
                    createId("title"),

                name:
                    options.titleName ||
                    "Championship",

                promotionId:
                    options.promotionId ||
                    professional.currentPromotionId ||
                    null,

                division:
                    options.division ||
                    professional.currentDivision ||
                    null,

                wonDate:
                    options.date ||
                    null,

                active: true
            }
        );
    }

    /*
     * Atualiza estágio automaticamente.
     */
    const progression =
        evaluateCareerProgression(
            player,
            options
        );

    professional.progression =
        progression;

    if (
        progression.ready &&
        progression.nextStage
    ) {
        advanceProfessionalStage(
            player,
            progression.nextStage
        );
    }

    return {
        success: true,

        fight,

        professional,

        record:
            getProfessionalRecord(
                player
            ),

        progression
    };
}

// ============================================================
// NEXT ELIGIBLE DATE
// ============================================================

export function calculateNextEligibleDate(
    currentDate,
    minimumDays = 14
) {
    if (
        !currentDate
    ) {
        return null;
    }

    const date =
        new Date(currentDate);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return null;
    }

    date.setUTCDate(
        date.getUTCDate() +
        minimumDays
    );

    return date
        .toISOString()
        .slice(0, 10);
}

// ============================================================
// PROGRESSION REQUIREMENTS
// ============================================================

export function getProgressionRequirements(
    stage,
    config = PROFESSIONAL_CONFIG
) {
    switch (
        normalizeProfessionalStage(
            stage
        )
    ) {
        case PROFESSIONAL_STAGES.REGIONAL:
            return {
                nextStage:
                    PROFESSIONAL_STAGES.NATIONAL,

                minimumFights:
                    config.nationalMinimumFights,

                minimumWins:
                    config.nationalMinimumWins,

                minimumOVR:
                    config.nationalMinimumOVR
            };

        case PROFESSIONAL_STAGES.NATIONAL:
            return {
                nextStage:
                    PROFESSIONAL_STAGES.INTERNATIONAL,

                minimumFights:
                    config.internationalMinimumFights,

                minimumWins:
                    config.internationalMinimumWins,

                minimumOVR:
                    config.internationalMinimumOVR
            };

        case PROFESSIONAL_STAGES.INTERNATIONAL:
            return {
                nextStage:
                    PROFESSIONAL_STAGES.ELITE,

                minimumFights:
                    config.eliteMinimumFights,

                minimumWins:
                    config.eliteMinimumWins,

                minimumOVR:
                    config.eliteMinimumOVR,

                minimumWinRate:
                    config.eliteRequiredWinRate
            };

        case PROFESSIONAL_STAGES.ELITE:
        default:
            return {
                nextStage: null,
                minimumFights: Infinity,
                minimumWins: Infinity,
                minimumOVR: 100
            };
    }
}

// ============================================================
// PROGRESSION SCORE
// ============================================================

export function calculateProgressionScore(
    player,
    options = {}
) {
    const config = {
        ...PROFESSIONAL_CONFIG,
        ...options.config
    };

    const professional =
        getProfessionalCareer(
            player
        );

    if (
        !professional
    ) {
        return 0;
    }

    const fights =
        professional.fights;

    const wins =
        professional.wins;

    const ovr =
        safeNumber(
            options.ovr ??
            getOVR(player),
            0
        );

    const winRate =
        fights > 0
            ? wins / fights
            : 0;

    const experience =
        professional.experience;

    const ranking =
        Math.max(
            0,
            professional.rankingPoints
        );

    const fightScore =
        Math.min(
            25,
            fights * 2
        );

    const winScore =
        Math.min(
            30,
            wins * 3
        );

    const ovrScore =
        ovr * 0.20;

    const experienceScore =
        experience * 0.15;

    const rankingScore =
        Math.min(
            10,
            ranking / 20
        );

    const winRateScore =
        winRate * 10;

    return round(
        clamp(
            fightScore +
            winScore +
            ovrScore +
            experienceScore +
            rankingScore +
            winRateScore
        ),
        2
    );
}

// ============================================================
// EVALUATE PROGRESSION
// ============================================================

export function evaluateCareerProgression(
    player,
    options = {}
) {
    const config = {
        ...PROFESSIONAL_CONFIG,
        ...options.config
    };

    const professional =
        getProfessionalCareer(
            player
        );

    if (
        !professional
    ) {
        return {
            ready: false,
            nextStage: null,
            score: 0,
            reasons: [
                "professional_career_missing"
            ]
        };
    }

    const currentStage =
        getProfessionalStage(
            player
        );

    const requirements =
        getProgressionRequirements(
            currentStage,
            config
        );

    if (
        !requirements.nextStage
    ) {
        return {
            ready: false,
            nextStage: null,
            score:
                calculateProgressionScore(
                    player,
                    options
                ),
            reasons: [
                "already_elite"
            ]
        };
    }

    const fights =
        professional.fights;

    const wins =
        professional.wins;

    const ovr =
        safeNumber(
            options.ovr ??
            getOVR(player),
            0
        );

    const winRate =
        fights > 0
            ? wins / fights
            : 0;

    const reasons = [];

    if (
        fights <
        requirements.minimumFights
    ) {
        reasons.push(
            "not_enough_fights"
        );
    }

    if (
        wins <
        requirements.minimumWins
    ) {
        reasons.push(
            "not_enough_wins"
        );
    }

    if (
        ovr <
        requirements.minimumOVR
    ) {
        reasons.push(
            "ovr_too_low"
        );
    }

    if (
        requirements.minimumWinRate &&
        winRate <
        requirements.minimumWinRate
    ) {
        reasons.push(
            "win_rate_too_low"
        );
    }

    const ready =
        reasons.length === 0;

    return {
        ready,

        currentStage,

        nextStage:
            requirements.nextStage,

        score:
            calculateProgressionScore(
                player,
                options
            ),

        fights,
        wins,
        losses:
            professional.losses,

        winRate:
            round(
                winRate,
                3
            ),

        ovr,

        requirements,

        reasons
    };
}

// ============================================================
// ADVANCE STAGE
// ============================================================

export function advanceProfessionalStage(
    player,
    nextStage
) {
    const normalized =
        normalizeProfessionalStage(
            nextStage
        );

    if (
        !normalized
    ) {
        return {
            success: false,
            reason:
                "invalid_stage"
        };
    }

    const professional =
        ensureProfessionalCareer(
            player
        );

    const current =
        getProfessionalStage(
            player
        );

    const currentIndex =
        getStageIndex(
            current
        );

    const nextIndex =
        getStageIndex(
            normalized
        );

    /*
     * Não permite retrocesso.
     */
    if (
        nextIndex <
        currentIndex
    ) {
        return {
            success: false,
            reason:
                "stage_regression"
        };
    }

    professional.stage =
        normalized;

    const career =
        ensureCareer(player);

    career.stage =
        normalized;

    return {
        success: true,

        previousStage:
            current,

        stage:
            normalized,

        changed:
            current !== normalized
    };
}

// ============================================================
// RANKING
// ============================================================

export function setProfessionalRank(
    player,
    rank
) {
    const professional =
        ensureProfessionalCareer(
            player
        );

    if (
        rank === null ||
        rank === undefined
    ) {
        professional.currentRank =
            null;

        return null;
    }

    const normalized =
        Math.max(
            1,
            Math.floor(
                safeNumber(
                    rank,
                    1
                )
            )
        );

    professional.currentRank =
        normalized;

    return normalized;
}

export function getProfessionalRank(
    player
) {
    return (
        getProfessionalCareer(
            player
        )?.currentRank ??
        null
    );
}

// ============================================================
// TITLES
// ============================================================

export function addTitle(
    player,
    title
) {
    const professional =
        ensureProfessionalCareer(
            player
        );

    if (
        !title
    ) {
        return null;
    }

    const titleData = {
        id:
            title.id ||
            createId("title"),

        name:
            title.name ||
            "Championship",

        promotionId:
            title.promotionId ||
            professional.currentPromotionId ||
            null,

        division:
            title.division ||
            professional.currentDivision ||
            null,

        wonDate:
            title.wonDate ||
            null,

        lostDate:
            title.lostDate ||
            null,

        defenses:
            safeNumber(
                title.defenses,
                0
            ),

        active:
            title.active ??
            true
    };

    professional.titles.push(
        titleData
    );

    return titleData;
}

export function removeTitle(
    player,
    titleId,
    date = null
) {
    const professional =
        getProfessionalCareer(
            player
        );

    if (
        !professional
    ) {
        return false;
    }

    const title =
        professional.titles.find(
            item =>
                String(item.id) ===
                String(titleId)
        );

    if (
        !title
    ) {
        return false;
    }

    title.active = false;

    title.lostDate =
        date ||
        title.lostDate ||
        null;

    return true;
}

export function getActiveTitles(
    player
) {
    const professional =
        getProfessionalCareer(
            player
        );

    if (
        !professional
    ) {
        return [];
    }

    return professional.titles
        .filter(
            title =>
                title.active !== false
        );
}

export function isChampion(
    player
) {
    return (
        getActiveTitles(
            player
        ).length > 0
    );
}

// ============================================================
// PROMOTION / DIVISION
// ============================================================

export function setCurrentPromotion(
    player,
    promotionId
) {
    const professional =
        ensureProfessionalCareer(
            player
        );

    professional.currentPromotionId =
        promotionId ||
        null;

    return professional
        .currentPromotionId;
}

export function setCurrentDivision(
    player,
    division
) {
    const professional =
        ensureProfessionalCareer(
            player
        );

    professional.currentDivision =
        division ||
        null;

    return professional
        .currentDivision;
}

// ============================================================
// CAREER HISTORY
// ============================================================

export function getProfessionalFightHistory(
    player,
    options = {}
) {
    const professional =
        getProfessionalCareer(
            player
        );

    if (
        !professional
    ) {
        return [];
    }

    let history =
        professional.history
            .slice();

    if (
        options.stage
    ) {
        history =
            history.filter(
                fight =>
                    normalizeProfessionalStage(
                        fight.stage
                    ) ===
                    normalizeProfessionalStage(
                        options.stage
                    )
            );
    }

    if (
        options.promotionId
    ) {
        history =
            history.filter(
                fight =>
                    String(
                        fight.promotionId
                    ) ===
                    String(
                        options.promotionId
                    )
            );
    }

    if (
        options.result
    ) {
        const result =
            normalizeProfessionalResult(
                options.result
            );

        history =
            history.filter(
                fight =>
                    fight.result ===
                    result
            );
    }

    return history;
}

// ============================================================
// RETIREMENT
// ============================================================

export function canRetire(
    player,
    currentDate = null
) {
    const professional =
        getProfessionalCareer(
            player
        );

    if (
        !professional
    ) {
        return {
            allowed: false,
            reason:
                "professional_career_missing"
        };
    }

    if (
        professional.status ===
        PROFESSIONAL_STATUS.RETIRED
    ) {
        return {
            allowed: false,
            reason: "already_retired"
        };
    }

    return {
        allowed: true,
        reason: null,
        age:
            getPlayerAge(
                player,
                currentDate
            )
    };
}

export function retirePlayer(
    player,
    currentDate = null,
    options = {}
) {
    const eligibility =
        canRetire(
            player,
            currentDate
        );

    if (
        !eligibility.allowed &&
        !options.force
    ) {
        return {
            success: false,
            reason:
                eligibility.reason
        };
    }

    const professional =
        ensureProfessionalCareer(
            player
        );

    const reason =
        options.reason ||
        RETIREMENT_REASONS.CHOICE;

    professional.active =
        false;

    professional.status =
        PROFESSIONAL_STATUS.RETIRED;

    professional.retirement = {
        date:
            currentDate ||
            null,

        reason,

        age:
            getPlayerAge(
                player,
                currentDate
            ),

        permanent:
            options.permanent ??
            false
    };

    const career =
        ensureCareer(player);

    career.stage =
        "Retired";

    career.history =
        Array.isArray(
            career.history
        )
            ? career.history
            : [];

    career.history.push({
        id:
            createId(
                "retirement"
            ),

        type:
            "retirement",

        date:
            currentDate ||
            null,

        reason
    });

    return {
        success: true,

        retirement:
            professional.retirement
    };
}

// ============================================================
// COMEBACK
// ============================================================

export function canMakeComeback(
    player,
    currentDate = null,
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
            allowed: false,
            reason:
                "professional_career_missing"
        };
    }

    if (
        professional.status !==
        PROFESSIONAL_STATUS.RETIRED
    ) {
        return {
            allowed: false,
            reason:
                "not_retired"
        };
    }

    if (
        professional.retirement
            ?.permanent
    ) {
        return {
            allowed: false,
            reason:
                "permanent_retirement"
        };
    }

    if (
        professional.retirement
            ?.date &&
        currentDate
    ) {
        const days =
            dateDifferenceDays(
                professional.retirement
                    .date,
                currentDate
            );

        const minimum =
            options.minimumDays ??
            PROFESSIONAL_CONFIG
                .comebackMinimumDays;

        if (
            days <
            minimum
        ) {
            return {
                allowed: false,
                reason:
                    "retirement_too_recent",
                days,
                minimum
            };
        }
    }

    return {
        allowed: true,
        reason: null
    };
}

export function makeComeback(
    player,
    currentDate = null,
    options = {}
) {
    const eligibility =
        canMakeComeback(
            player,
            currentDate,
            options
        );

    if (
        !eligibility.allowed
    ) {
        return {
            success: false,
            reason:
                eligibility.reason
        };
    }

    const professional =
        ensureProfessionalCareer(
            player
        );

    professional.active =
        true;

    professional.status =
        PROFESSIONAL_STATUS.ACTIVE;

    professional.retirement =
        null;

    if (
        options.stage
    ) {
        professional.stage =
            normalizeProfessionalStage(
                options.stage
            );
    }

    return {
        success: true,

        professional
    };
}

// ============================================================
// SUSPENSION
// ============================================================

export function suspendProfessionalCareer(
    player,
    reason = null
) {
    const professional =
        ensureProfessionalCareer(
            player
        );

    professional.active =
        false;

    professional.status =
        PROFESSIONAL_STATUS.SUSPENDED;

    professional.suspensionReason =
        reason;

    return professional;
}

export function liftProfessionalSuspension(
    player
) {
    const professional =
        getProfessionalCareer(
            player
        );

    if (
        !professional
    ) {
        return false;
    }

    professional.active =
        true;

    professional.status =
        PROFESSIONAL_STATUS.ACTIVE;

    professional.suspensionReason =
        null;

    return true;
}

// ============================================================
// AGE RETIREMENT CHECK
// ============================================================

export function shouldRetireByAge(
    player,
    currentDate = null,
    config = PROFESSIONAL_CONFIG
) {
    const age =
        getPlayerAge(
            player,
            currentDate
        );

    return {
        shouldRetire:
            age >=
            config.retirementAge,

        age,

        retirementAge:
            config.retirementAge
    };
}

// ============================================================
// CAREER SUMMARY
// ============================================================

export function getProfessionalSummary(
    player
) {
    const professional =
        getProfessionalCareer(
            player
        );

    if (
        !professional
    ) {
        return {
            active: false,
            status:
                PROFESSIONAL_STATUS
                    .INACTIVE,

            stage:
                PROFESSIONAL_STAGES
                    .REGIONAL,

            record:
                "0-0-0",

            fights: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            noContests: 0,

            winRate: 0,

            experience: 0,
            fame: 0,
            rankingPoints: 0,

            rank: null,

            titles: 0,

            promotionId: null,
            division: null
        };
    }

    return {
        active:
            professional.active,

        status:
            professional.status,

        stage:
            professional.stage,

        record:
            `${professional.wins}-${professional.losses}-${professional.draws}`,

        fights:
            professional.fights,

        wins:
            professional.wins,

        losses:
            professional.losses,

        draws:
            professional.draws,

        noContests:
            professional.noContests,

        winRate:
            getProfessionalWinRate(
                player
            ),

        experience:
            round(
                professional.experience,
                2
            ),

        fame:
            round(
                professional.fame,
                2
            ),

        rankingPoints:
            round(
                professional.rankingPoints,
                2
            ),

        rank:
            professional.currentRank,

        titles:
            getActiveTitles(
                player
            ).length,

        promotionId:
            professional.currentPromotionId,

        division:
            professional.currentDivision,

        lastFightDate:
            professional.lastFightDate,

        nextEligibleDate:
            professional.nextEligibleDate
    };
}

// ============================================================
// VALIDATION
// ============================================================

export function validateProfessionalCareer(
    career
) {
    const errors = [];

    if (
        !career ||
        typeof career !== "object"
    ) {
        return {
            valid: false,
            errors: [
                "career_missing"
            ]
        };
    }

    const numericFields = [
        "fights",
        "wins",
        "losses",
        "draws",
        "noContests",
        "experience",
        "fame",
        "rankingPoints"
    ];

    for (
        const field of numericFields
    ) {
        if (
            !Number.isFinite(
                Number(
                    career[field]
                )
            )
        ) {
            errors.push(
                `invalid_${field}`
            );
        }
    }

    const recordedResults =
        career.wins +
        career.losses +
        career.draws +
        career.noContests;

    if (
        recordedResults >
        career.fights
    ) {
        errors.push(
            "record_exceeds_fights"
        );
    }

    if (
        !Array.isArray(
            career.history
        )
    ) {
        errors.push(
            "history_invalid"
        );
    }

    if (
        !Array.isArray(
            career.titles
        )
    ) {
        errors.push(
            "titles_invalid"
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

export function cloneProfessionalCareer(
    career
) {
    return clone(career);
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
    PROFESSIONAL_VERSION,

    PROFESSIONAL_STAGES,
    PROFESSIONAL_STAGE_ORDER,

    PROFESSIONAL_STATUS,
    PROFESSIONAL_RESULTS,
    RETIREMENT_REASONS,

    PROFESSIONAL_CONFIG,

    createProfessionalCareer,

    getProfessionalCareer,
    getProfessionalRecord,
    getProfessionalWinRate,
    getProfessionalStage,

    getStageIndex,

    isProfessional,

    canStartProfessionalCareer,
    startProfessionalCareer,

    canHaveProfessionalFight,

    normalizeProfessionalResult,

    calculateProfessionalExperienceGain,
    calculateProfessionalFameGain,
    calculateProfessionalRankingPoints,

    registerProfessionalFight,

    calculateNextEligibleDate,

    getProgressionRequirements,
    calculateProgressionScore,
    evaluateCareerProgression,

    advanceProfessionalStage,

    setProfessionalRank,
    getProfessionalRank,

    addTitle,
    removeTitle,
    getActiveTitles,
    isChampion,

    setCurrentPromotion,
    setCurrentDivision,

    getProfessionalFightHistory,

    canRetire,
    retirePlayer,
    canMakeComeback,
    makeComeback,

    suspendProfessionalCareer,
    liftProfessionalSuspension,

    shouldRetireByAge,

    getProfessionalSummary,

    validateProfessionalCareer,
    cloneProfessionalCareer
};
