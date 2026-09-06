// ============================================================
// MMA LIFE DYNASTY
// js/career/amateur.js
// ============================================================

import {
    CAREER_STAGES,
    MIN_PRO_AGE
} from "../core/constants.js";

import {
    calculateAge,
    canTurnProfessional
} from "../core/clock.js";

import {
    registerFightResult,
    getFighterRecord
} from "../mma/fighters.js";

import {
    getOVR
} from "../mma/matchup.js";

// ============================================================
// VERSION
// ============================================================

export const AMATEUR_VERSION = 1;

// ============================================================
// DEFAULT CONFIG
// ============================================================

export const AMATEUR_CONFIG = Object.freeze({
    minimumAge: 12,
    professionalAge: MIN_PRO_AGE ?? 18,

    minimumDaysBetweenFights: 14,
    preferredDaysBetweenFights: 28,

    minimumFightsForProgression: 3,
    strongProgressionFights: 5,

    experiencePerFight: 4,
    winExperienceBonus: 2,
    lossExperience: 1,
    drawExperience: 1.5,

    famePerFight: 1,
    famePerWin: 2,

    rankingWinPoints: 10,
    rankingLossPoints: -3,
    rankingDrawPoints: 1,

    maxAmateurFightsPerYear: 12,

    automaticProgression: true
});

// ============================================================
// RESULT TYPES
// ============================================================

export const AMATEUR_RESULTS = Object.freeze({
    WIN: "win",
    LOSS: "loss",
    DRAW: "draw",
    NO_CONTEST: "no_contest"
});

// ============================================================
// AMATEUR STATUS
// ============================================================

export const AMATEUR_STATUS = Object.freeze({
    INACTIVE: "inactive",
    ACTIVE: "active",
    SUSPENDED: "suspended",
    COMPLETED: "completed",
    TRANSITIONING: "transitioning"
});

// ============================================================
// FIGHT TYPES
// ============================================================

export const AMATEUR_FIGHT_TYPES = Object.freeze({
    DEBUT: "debut",
    NORMAL: "normal",
    TOURNAMENT: "tournament",
    SEMIFINAL: "semifinal",
    FINAL: "final",
    EXHIBITION: "exhibition"
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
    return Math.max(
        min,
        Math.min(
            max,
            safeNumber(value, min)
        )
    );
}

function round(value, decimals = 2) {
    const multiplier =
        10 ** decimals;

    return Math.round(
        safeNumber(value) * multiplier
    ) / multiplier;
}

function createId(prefix = "amateur") {
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

// ============================================================
// PLAYER ACCESS
// ============================================================

function getPlayerAge(player, currentDate = null) {
    if (!player) {
        return 0;
    }

    if (
        Number.isFinite(
            Number(player.age)
        )
    ) {
        return Number(player.age);
    }

    if (
        player.identity?.age !== undefined
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

function getPlayerCareer(player) {
    if (!player) {
        return null;
    }

    return player.career || null;
}

function ensureCareer(player) {
    if (!player.career) {
        player.career = {};
    }

    if (!player.career.amateur) {
        player.career.amateur =
            createAmateurCareer();
    }

    if (!Array.isArray(
        player.career.history
    )) {
        player.career.history = [];
    }

    return player.career;
}

// ============================================================
// CREATE AMATEUR CAREER
// ============================================================

export function createAmateurCareer(
    options = {}
) {
    return {
        id:
            options.id ||
            createId("amateurCareer"),

        status:
            options.status ||
            AMATEUR_STATUS.INACTIVE,

        active:
            options.active ??
            false,

        started:
            options.started ??
            false,

        completed:
            options.completed ??
            false,

        startDate:
            options.startDate ||
            null,

        endDate:
            options.endDate ||
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
                0,
                0,
                100
            ),

        fame:
            clamp(
                options.fame ??
                0,
                0,
                100
            ),

        rankingPoints:
            safeNumber(
                options.rankingPoints,
                0
            ),

        tournamentsEntered:
            safeNumber(
                options.tournamentsEntered,
                0
            ),

        tournamentsWon:
            safeNumber(
                options.tournamentsWon,
                0
            ),

        currentTournament:
            options.currentTournament ||
            null,

        lastFightDate:
            options.lastFightDate ||
            null,

        nextEligibleDate:
            options.nextEligibleDate ||
            null,

        fightHistory:
            Array.isArray(
                options.fightHistory
            )
                ? clone(
                    options.fightHistory
                )
                : [],

        achievements:
            Array.isArray(
                options.achievements
            )
                ? clone(
                    options.achievements
                )
                : [],

        progression:
            {
                ready:
                    options.progression?.ready ??
                    false,

                reason:
                    options.progression?.reason ||
                    null,

                score:
                    safeNumber(
                        options.progression?.score,
                        0
                    )
            }
    };
}

// ============================================================
// GET / ENSURE
// ============================================================

export function getAmateurCareer(
    player
) {
    if (
        !player?.career?.amateur
    ) {
        return null;
    }

    return player.career.amateur;
}

export function ensureAmateurCareer(
    player
) {
    ensureCareer(player);

    return player.career.amateur;
}

// ============================================================
// AMATEUR ELIGIBILITY
// ============================================================

export function canStartAmateurCareer(
    player,
    currentDate = null,
    config = AMATEUR_CONFIG
) {
    const age =
        getPlayerAge(
            player,
            currentDate
        );

    if (
        !player
    ) {
        return {
            allowed: false,
            reason: "player_missing"
        };
    }

    if (
        age < config.minimumAge
    ) {
        return {
            allowed: false,
            reason: "too_young",
            age,
            minimumAge:
                config.minimumAge
        };
    }

    if (
        isProfessional(player)
    ) {
        return {
            allowed: false,
            reason: "already_professional"
        };
    }

    return {
        allowed: true,
        reason: null,
        age
    };
}

// ============================================================
// PROFESSIONAL STATUS
// ============================================================

export function isProfessional(
    player
) {
    return Boolean(
        player?.career?.professional?.active ||
        player?.career?.professional === true ||
        player?.professional?.active ||
        player?.professional === true ||
        normalizeStage(
            player?.career?.stage
        ) === "professional" ||
        normalizeStage(
            player?.career?.stage
        ) === "regional" ||
        normalizeStage(
            player?.career?.stage
        ) === "national" ||
        normalizeStage(
            player?.career?.stage
        ) === "international" ||
        normalizeStage(
            player?.career?.stage
        ) === "elite"
    );
}

function normalizeStage(stage) {
    return String(
        stage || ""
    )
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, "");
}

// ============================================================
// START CAREER
// ============================================================

export function startAmateurCareer(
    player,
    currentDate = null,
    options = {}
) {
    const config = {
        ...AMATEUR_CONFIG,
        ...options
    };

    const eligibility =
        canStartAmateurCareer(
            player,
            currentDate,
            config
        );

    if (!eligibility.allowed) {
        return {
            success: false,
            reason:
                eligibility.reason,
            career:
                getAmateurCareer(player)
        };
    }

    const career =
        ensureAmateurCareer(player);

    if (
        career.active
    ) {
        return {
            success: true,
            alreadyActive: true,
            career
        };
    }

    career.active = true;
    career.started = true;
    career.completed = false;

    career.status =
        AMATEUR_STATUS.ACTIVE;

    career.startDate =
        currentDate ||
        career.startDate ||
        null;

    career.nextEligibleDate =
        currentDate ||
        null;

    if (
        player.career
    ) {
        player.career.stage =
            CAREER_STAGES?.AMATEUR ||
            "Amateur";

        player.career.professional =
            player.career.professional ||
            {
                active: false
            };

        if (
            typeof player.career.professional ===
            "boolean"
        ) {
            player.career.professional =
                {
                    active:
                        player.career.professional
                };
        }
    }

    return {
        success: true,
        alreadyActive: false,
        career
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

function getCurrentYear(
    currentDate
) {
    if (!currentDate) {
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

    return date.getUTCFullYear();
}

export function canHaveAmateurFight(
    player,
    currentDate = null,
    config = AMATEUR_CONFIG
) {
    if (!player) {
        return {
            allowed: false,
            reason: "player_missing"
        };
    }

    if (
        isProfessional(player)
    ) {
        return {
            allowed: false,
            reason: "professional_fighter"
        };
    }

    const career =
        getAmateurCareer(player);

    if (
        !career?.active
    ) {
        return {
            allowed: false,
            reason: "amateur_career_not_active"
        };
    }

    if (
        career.status ===
        AMATEUR_STATUS.SUSPENDED
    ) {
        return {
            allowed: false,
            reason: "amateur_suspended"
        };
    }

    const age =
        getPlayerAge(
            player,
            currentDate
        );

    if (
        age < config.minimumAge
    ) {
        return {
            allowed: false,
            reason: "too_young",
            age
        };
    }

    if (
        age >=
        config.professionalAge
    ) {
        return {
            allowed: false,
            reason: "professional_age_reached",
            age
        };
    }

    if (
        career.lastFightDate &&
        currentDate
    ) {
        const days =
            dateDifferenceDays(
                career.lastFightDate,
                currentDate
            );

        if (
            days <
            config.minimumDaysBetweenFights
        ) {
            return {
                allowed: false,
                reason: "insufficient_rest",
                daysSinceLastFight: days,
                required:
                    config.minimumDaysBetweenFights
            };
        }
    }

    return {
        allowed: true,
        reason: null,
        age
    };
}

// ============================================================
// YEARLY LIMIT
// ============================================================

export function getFightsThisYear(
    player,
    currentDate = null
) {
    const career =
        getAmateurCareer(player);

    if (
        !career
    ) {
        return 0;
    }

    const currentYear =
        getCurrentYear(
            currentDate
        );

    if (
        currentYear === null
    ) {
        return career.fights;
    }

    return career.fightHistory
        .filter(
            fight => {
                if (
                    !fight.date
                ) {
                    return false;
                }

                const year =
                    getCurrentYear(
                        fight.date
                    );

                return (
                    year ===
                    currentYear
                );
            }
        )
        .length;
}

export function canFightThisYear(
    player,
    currentDate = null,
    config = AMATEUR_CONFIG
) {
    const fights =
        getFightsThisYear(
            player,
            currentDate
        );

    return {
        allowed:
            fights <
            config.maxAmateurFightsPerYear,

        fightsThisYear:
            fights,

        maximum:
            config.maxAmateurFightsPerYear
    };
}

// ============================================================
// FIGHT TYPE
// ============================================================

export function determineAmateurFightType(
    player,
    options = {}
) {
    const career =
        getAmateurCareer(player);

    if (
        options.type
    ) {
        return options.type;
    }

    if (
        !career ||
        career.fights === 0
    ) {
        return AMATEUR_FIGHT_TYPES.DEBUT;
    }

    if (
        options.tournamentFinal
    ) {
        return AMATEUR_FIGHT_TYPES.FINAL;
    }

    if (
        options.tournamentSemifinal
    ) {
        return AMATEUR_FIGHT_TYPES.SEMIFINAL;
    }

    if (
        options.tournament
    ) {
        return AMATEUR_FIGHT_TYPES.TOURNAMENT;
    }

    if (
        options.exhibition
    ) {
        return AMATEUR_FIGHT_TYPES.EXHIBITION;
    }

    return AMATEUR_FIGHT_TYPES.NORMAL;
}

// ============================================================
// RECORD
// ============================================================

export function getAmateurRecord(
    player
) {
    const career =
        getAmateurCareer(player);

    if (!career) {
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
                career.fights,
                0
            ),

        wins:
            safeNumber(
                career.wins,
                0
            ),

        losses:
            safeNumber(
                career.losses,
                0
            ),

        draws:
            safeNumber(
                career.draws,
                0
            ),

        noContests:
            safeNumber(
                career.noContests,
                0
            )
    };
}

// ============================================================
// RESULT NORMALIZATION
// ============================================================

export function normalizeAmateurResult(
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
        return AMATEUR_RESULTS.WIN;
    }

    if (
        normalized === "loss" ||
        normalized === "lost" ||
        normalized === "defeat"
    ) {
        return AMATEUR_RESULTS.LOSS;
    }

    if (
        normalized === "draw" ||
        normalized === "tie"
    ) {
        return AMATEUR_RESULTS.DRAW;
    }

    if (
        normalized === "nc" ||
        normalized === "no_contest" ||
        normalized === "nocontest"
    ) {
        return AMATEUR_RESULTS.NO_CONTEST;
    }

    return null;
}

// ============================================================
// EXPERIENCE
// ============================================================

export function calculateExperienceGain(
    result,
    options = {},
    config = AMATEUR_CONFIG
) {
    const normalized =
        normalizeAmateurResult(
            result
        );

    let gain =
        config.experiencePerFight;

    if (
        normalized ===
        AMATEUR_RESULTS.WIN
    ) {
        gain +=
            config.winExperienceBonus;
    }

    if (
        normalized ===
        AMATEUR_RESULTS.LOSS
    ) {
        gain =
            config.lossExperience;
    }

    if (
        normalized ===
        AMATEUR_RESULTS.DRAW
    ) {
        gain =
            config.drawExperience;
    }

    if (
        normalized ===
        AMATEUR_RESULTS.NO_CONTEST
    ) {
        gain *= 0.5;
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
            gain *= 1.25;
        } else if (
            difference >= 5
        ) {
            gain *= 1.10;
        } else if (
            difference <= -10
        ) {
            gain *= 0.85;
        }
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
// FAME GAIN
// ============================================================

export function calculateFameGain(
    result,
    options = {},
    config = AMATEUR_CONFIG
) {
    const normalized =
        normalizeAmateurResult(
            result
        );

    let gain =
        config.famePerFight;

    if (
        normalized ===
        AMATEUR_RESULTS.WIN
    ) {
        gain +=
            config.famePerWin;
    }

    if (
        normalized ===
        AMATEUR_RESULTS.NO_CONTEST
    ) {
        gain *= 0.25;
    }

    if (
        options.tournament
    ) {
        gain *= 1.5;
    }

    if (
        options.titleFight
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

export function calculateRankingPoints(
    result,
    options = {},
    config = AMATEUR_CONFIG
) {
    const normalized =
        normalizeAmateurResult(
            result
        );

    let points = 0;

    if (
        normalized ===
        AMATEUR_RESULTS.WIN
    ) {
        points =
            config.rankingWinPoints;
    } else if (
        normalized ===
        AMATEUR_RESULTS.LOSS
    ) {
        points =
            config.rankingLossPoints;
    } else if (
        normalized ===
        AMATEUR_RESULTS.DRAW
    ) {
        points =
            config.rankingDrawPoints;
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
        points > 0 &&
        opponentOVR > 0 &&
        playerOVR > 0
    ) {
        const difference =
            opponentOVR -
            playerOVR;

        if (
            difference >= 10
        ) {
            points *= 1.5;
        } else if (
            difference >= 5
        ) {
            points *= 1.25;
        }
    }

    if (
        options.tournament
    ) {
        points *= 1.25;
    }

    return round(
        points,
        2
    );
}

// ============================================================
// RECORD UPDATE
// ============================================================

function updateRecord(
    career,
    result
) {
    switch (result) {
        case AMATEUR_RESULTS.WIN:
            career.wins += 1;
            break;

        case AMATEUR_RESULTS.LOSS:
            career.losses += 1;
            break;

        case AMATEUR_RESULTS.DRAW:
            career.draws += 1;
            break;

        case AMATEUR_RESULTS.NO_CONTEST:
            career.noContests += 1;
            break;
    }

    career.fights += 1;
}

// ============================================================
// PLAYER FIGHTER SYNC
// ============================================================

function syncPlayerFighterRecord(
    player,
    result
) {
    /*
     * O sistema principal de fighters.js possui
     * seu próprio registro.
     *
     * Esta função tenta sincronizar o resultado
     * sem quebrar jogadores que ainda não possuem
     * a estrutura completa de fighter.
     */

    if (
        !player
    ) {
        return;
    }

    if (
        player.record &&
        typeof player.record === "object"
    ) {
        if (
            !Number.isFinite(
                Number(
                    player.record.wins
                )
            )
        ) {
            player.record.wins = 0;
        }

        if (
            !Number.isFinite(
                Number(
                    player.record.losses
                )
            )
        ) {
            player.record.losses = 0;
        }

        if (
            !Number.isFinite(
                Number(
                    player.record.draws
                )
            )
        ) {
            player.record.draws = 0;
        }

        if (
            !Number.isFinite(
                Number(
                    player.record.noContests
                )
            )
        ) {
            player.record.noContests = 0;
        }

        if (
            result ===
            AMATEUR_RESULTS.WIN
        ) {
            player.record.wins += 1;
        } else if (
            result ===
            AMATEUR_RESULTS.LOSS
        ) {
            player.record.losses += 1;
        } else if (
            result ===
            AMATEUR_RESULTS.DRAW
        ) {
            player.record.draws += 1;
        } else if (
            result ===
            AMATEUR_RESULTS.NO_CONTEST
        ) {
            player.record.noContests += 1;
        }
    }
}

// ============================================================
// REGISTER FIGHT
// ============================================================

export function registerAmateurFight(
    player,
    result,
    options = {}
) {
    const config = {
        ...AMATEUR_CONFIG,
        ...options.config
    };

    if (
        !player
    ) {
        return {
            success: false,
            reason: "player_missing"
        };
    }

    const normalized =
        normalizeAmateurResult(
            result
        );

    if (
        !normalized
    ) {
        return {
            success: false,
            reason: "invalid_result"
        };
    }

    const date =
        options.date ||
        null;

    const eligibility =
        canHaveAmateurFight(
            player,
            date,
            config
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

    const yearly =
        canFightThisYear(
            player,
            date,
            config
        );

    if (
        !yearly.allowed &&
        !options.ignoreEligibility
    ) {
        return {
            success: false,
            reason: "yearly_limit_reached"
        };
    }

    const career =
        ensureAmateurCareer(player);

    const opponent =
        options.opponent ||
        null;

    const opponentOVR =
        safeNumber(
            options.opponentOVR ??
            getOVR(opponent),
            0
        );

    const playerOVR =
        safeNumber(
            options.playerOVR ??
            getOVR(player),
            0
        );

    const experienceGain =
        calculateExperienceGain(
            normalized,
            {
                ...options,
                opponentOVR,
                playerOVR
            },
            config
        );

    const fameGain =
        calculateFameGain(
            normalized,
            options,
            config
        );

    const rankingPoints =
        calculateRankingPoints(
            normalized,
            {
                ...options,
                opponentOVR,
                playerOVR
            },
            config
        );

    updateRecord(
        career,
        normalized
    );

    career.experience =
        clamp(
            career.experience +
            experienceGain,
            0,
            100
        );

    career.fame =
        clamp(
            career.fame +
            fameGain,
            0,
            100
        );

    career.rankingPoints +=
        rankingPoints;

    career.lastFightDate =
        date;

    career.nextEligibleDate =
        calculateNextEligibleDate(
            date,
            config.minimumDaysBetweenFights
        );

    const fight = {
        id:
            options.fightId ||
            createId("amateurFight"),

        date,

        type:
            determineAmateurFightType(
                player,
                options
            ),

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

        opponentOVR,

        playerOVR,

        method:
            options.method ||
            null,

        round:
            safeNumber(
                options.round,
                0
            ),

        decision:
            options.decision ||
            null,

        tournament:
            options.tournament ||
            null,

        titleFight:
            Boolean(
                options.titleFight
            ),

        experienceGain,

        fameGain,

        rankingPoints,

        notes:
            options.notes ||
            null
    };

    career.fightHistory.push(
        fight
    );

    syncPlayerFighterRecord(
        player,
        normalized
    );

    /*
     * Atualiza o histórico geral da carreira.
     */
    if (
        !Array.isArray(
            player.career.history
        )
    ) {
        player.career.history = [];
    }

    player.career.history.push({
        id:
            fight.id,

        type:
            "amateur_fight",

        date,

        result:
            normalized,

        opponentId:
            fight.opponentId
    });

    /*
     * Tenta sincronizar usando fighters.js
     * quando a estrutura permitir.
     */
    try {
        if (
            player.record &&
            player.attributes
        ) {
            registerFightResult(
                player,
                normalized
            );
        }
    } catch {
        /*
         * O sistema amador não depende
         * dessa sincronização para funcionar.
         */
    }

    /*
     * Verifica se o atleta já pode
     * avançar para a carreira profissional.
     */
    const progression =
        evaluateProfessionalProgression(
            player,
            date,
            config
        );

    career.progression =
        progression;

    if (
        progression.ready
    ) {
        career.status =
            AMATEUR_STATUS.TRANSITIONING;
    }

    return {
        success: true,

        fight,

        career,

        progression,

        record:
            getAmateurRecord(player)
    };
}

// ============================================================
// NEXT ELIGIBLE DATE
// ============================================================

export function calculateNextEligibleDate(
    currentDate,
    minimumDays =
        AMATEUR_CONFIG.minimumDaysBetweenFights
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
// PROGRESSION SCORE
// ============================================================

export function calculateProgressionScore(
    player,
    config = AMATEUR_CONFIG
) {
    const career =
        getAmateurCareer(player);

    if (
        !career
    ) {
        return 0;
    }

    const fights =
        career.fights;

    const wins =
        career.wins;

    const winRate =
        fights > 0
            ? wins / fights
            : 0;

    const fightScore =
        Math.min(
            30,
            fights * 5
        );

    const winScore =
        winRate * 35;

    const experienceScore =
        career.experience * 0.20;

    const rankingScore =
        Math.min(
            10,
            Math.max(
                0,
                career.rankingPoints
            ) / 2
        );

    let score =
        fightScore +
        winScore +
        experienceScore +
        rankingScore;

    if (
        fights >=
        config.strongProgressionFights
    ) {
        score += 10;
    }

    return round(
        clamp(score),
        2
    );
}

// ============================================================
// PROFESSIONAL PROGRESSION
// ============================================================

export function evaluateProfessionalProgression(
    player,
    currentDate = null,
    config = AMATEUR_CONFIG
) {
    const career =
        getAmateurCareer(player);

    if (
        !career
    ) {
        return {
            ready: false,
            score: 0,
            reason:
                "amateur_career_missing"
        };
    }

    const age =
        getPlayerAge(
            player,
            currentDate
        );

    const score =
        calculateProgressionScore(
            player,
            config
        );

    const fights =
        career.fights;

    const wins =
        career.wins;

    const winRate =
        fights > 0
            ? wins / fights
            : 0;

    /*
     * Antes dos 18, nunca pode
     * virar profissional.
     */
    if (
        age <
        config.professionalAge
    ) {
        return {
            ready: false,
            score,
            reason:
                "under_professional_age",
            age,
            requiredAge:
                config.professionalAge,
            fights,
            wins,
            winRate:
                round(
                    winRate,
                    3
                )
        };
    }

    /*
     * A partir dos 18, alguns critérios
     * mínimos precisam ser cumpridos.
     */
    const minimumFightsMet =
        fights >=
        config.minimumFightsForProgression;

    const performanceMet =
        (
            fights >=
            config.strongProgressionFights
        ) ||
        (
            fights >=
            config.minimumFightsForProgression &&
            winRate >= 0.5
        );

    if (
        minimumFightsMet &&
        performanceMet
    ) {
        return {
            ready: true,
            score,
            reason:
                "professional_progression_ready",
            age,
            fights,
            wins,
            losses:
                career.losses,
            winRate:
                round(
                    winRate,
                    3
                )
        };
    }

    return {
        ready: false,
        score,
        reason:
            "minimum_requirements_not_met",
        age,
        fights,
        wins,
        losses:
            career.losses,
        winRate:
            round(
                winRate,
                3
            ),
        minimumFights:
            config.minimumFightsForProgression
    };
}

// ============================================================
// TRANSITION TO PROFESSIONAL
// ============================================================

export function canTransitionToProfessional(
    player,
    currentDate = null,
    config = AMATEUR_CONFIG
) {
    const progression =
        evaluateProfessionalProgression(
            player,
            currentDate,
            config
        );

    if (
        !progression.ready
    ) {
        return {
            allowed: false,
            reason:
                progression.reason,
            progression
        };
    }

    /*
     * Segurança extra:
     * se existir a função do clock,
     * usamos a regra central também.
     */
    try {
        if (
            typeof canTurnProfessional ===
            "function"
        ) {
            const result =
                canTurnProfessional(
                    player,
                    currentDate
                );

            if (
                result === false
            ) {
                return {
                    allowed: false,
                    reason:
                        "clock_denied",
                    progression
                };
            }
        }
    } catch {
        /*
         * A avaliação local continua
         * funcionando.
         */
    }

    return {
        allowed: true,
        reason:
            "ready",
        progression
    };
}

export function transitionToProfessional(
    player,
    currentDate = null,
    options = {}
) {
    const config = {
        ...AMATEUR_CONFIG,
        ...options.config
    };

    const eligibility =
        canTransitionToProfessional(
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
                eligibility.reason,
            progression:
                eligibility.progression
        };
    }

    const career =
        ensureAmateurCareer(player);

    if (
        !player.career
    ) {
        player.career = {};
    }

    /*
     * Profissional só a partir dos 18.
     */
    const age =
        getPlayerAge(
            player,
            currentDate
        );

    if (
        age <
        config.professionalAge &&
        !options.force
    ) {
        return {
            success: false,
            reason:
                "under_professional_age"
        };
    }

    if (
        !player.career.professional ||
        typeof player.career.professional ===
        "boolean"
    ) {
        player.career.professional = {
            active: false,
            started: false,
            startDate: null,
            fights: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            noContests: 0
        };
    }

    player.career.professional.active =
        true;

    player.career.professional.started =
        true;

    player.career.professional.startDate =
        currentDate ||
        player.career.professional.startDate ||
        null;

    player.career.stage =
        CAREER_STAGES?.REGIONAL ||
        "Regional";

    career.active = false;

    career.completed = true;

    career.status =
        AMATEUR_STATUS.COMPLETED;

    career.endDate =
        currentDate ||
        career.endDate ||
        null;

    /*
     * Registra a transição.
     */
    if (
        !Array.isArray(
            player.career.history
        )
    ) {
        player.career.history = [];
    }

    player.career.history.push({
        id:
            createId(
                "careerTransition"
            ),

        type:
            "amateur_to_professional",

        date:
            currentDate,

        from:
            CAREER_STAGES?.AMATEUR ||
            "Amateur",

        to:
            CAREER_STAGES?.REGIONAL ||
            "Regional"
    });

    return {
        success: true,

        career:
            player.career,

        amateur:
            career,

        professional:
            player.career.professional
    };
}

// ============================================================
// ACHIEVEMENTS
// ============================================================

export function updateAmateurAchievements(
    player
) {
    const career =
        getAmateurCareer(player);

    if (
        !career
    ) {
        return [];
    }

    const achievements =
        career.achievements;

    const addAchievement = (
        id,
        name,
        description
    ) => {
        if (
            achievements.some(
                item =>
                    item.id === id
            )
        ) {
            return;
        }

        achievements.push({
            id,
            name,
            description,
            unlockedAt:
                career.lastFightDate ||
                null
        });
    };

    if (
        career.fights >= 1
    ) {
        addAchievement(
            "amateur_debut",
            "Estreia Amadora",
            "Realizou sua primeira luta amadora."
        );
    }

    if (
        career.wins >= 1
    ) {
        addAchievement(
            "first_amateur_win",
            "Primeira Vitória",
            "Conquistou sua primeira vitória amadora."
        );
    }

    if (
        career.wins >= 3
    ) {
        addAchievement(
            "three_amateur_wins",
            "Três Vitórias",
            "Conquistou três vitórias na carreira amadora."
        );
    }

    if (
        career.wins >= 5
    ) {
        addAchievement(
            "five_amateur_wins",
            "Prospecto",
            "Conquistou cinco vitórias amadoras."
        );
    }

    if (
        career.tournamentsWon >= 1
    ) {
        addAchievement(
            "amateur_tournament",
            "Campeão de Torneio",
            "Venceu um torneio amador."
        );
    }

    return achievements;
}

// ============================================================
// TOURNAMENT
// ============================================================

export function enterAmateurTournament(
    player,
    tournament
) {
    const career =
        ensureAmateurCareer(player);

    career.tournamentsEntered += 1;

    career.currentTournament =
        clone(
            tournament
        );

    return career.currentTournament;
}

export function winAmateurTournament(
    player,
    tournament = null
) {
    const career =
        ensureAmateurCareer(player);

    career.tournamentsWon += 1;

    career.currentTournament =
        tournament
            ? clone(tournament)
            : career.currentTournament;

    updateAmateurAchievements(
        player
    );

    return {
        success: true,
        tournamentsWon:
            career.tournamentsWon
    };
}

export function clearAmateurTournament(
    player
) {
    const career =
        getAmateurCareer(player);

    if (
        !career
    ) {
        return false;
    }

    career.currentTournament =
        null;

    return true;
}

// ============================================================
// REST / SCHEDULE
// ============================================================

export function getNextFightEligibility(
    player,
    currentDate = null,
    config = AMATEUR_CONFIG
) {
    const career =
        getAmateurCareer(player);

    if (
        !career
    ) {
        return {
            eligible: false,
            date: null,
            reason:
                "career_missing"
        };
    }

    const result =
        canHaveAmateurFight(
            player,
            currentDate,
            config
        );

    if (
        result.allowed
    ) {
        return {
            eligible: true,
            date:
                currentDate ||
                null,
            reason: null
        };
    }

    return {
        eligible: false,
        date:
            career.nextEligibleDate ||
            null,
        reason:
            result.reason
    };
}

// ============================================================
// SUMMARY
// ============================================================

export function getAmateurSummary(
    player
) {
    const career =
        getAmateurCareer(player);

    if (
        !career
    ) {
        return {
            active: false,
            fights: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            noContests: 0,
            record: "0-0-0",
            experience: 0,
            fame: 0,
            rankingPoints: 0,
            progression: null
        };
    }

    return {
        active:
            career.active,

        status:
            career.status,

        fights:
            career.fights,

        wins:
            career.wins,

        losses:
            career.losses,

        draws:
            career.draws,

        noContests:
            career.noContests,

        record:
            `${career.wins}-${career.losses}-${career.draws}`,

        experience:
            round(
                career.experience,
                2
            ),

        fame:
            round(
                career.fame,
                2
            ),

        rankingPoints:
            round(
                career.rankingPoints,
                2
            ),

        tournamentsEntered:
            career.tournamentsEntered,

        tournamentsWon:
            career.tournamentsWon,

        progression:
            clone(
                career.progression
            ),

        lastFightDate:
            career.lastFightDate,

        nextEligibleDate:
            career.nextEligibleDate
    };
}

// ============================================================
// VALIDATION
// ============================================================

export function validateAmateurCareer(
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

    if (
        career.wins +
        career.losses +
        career.draws +
        career.noContests >
        career.fights
    ) {
        errors.push(
            "record_exceeds_fights"
        );
    }

    if (
        !Array.isArray(
            career.fightHistory
        )
    ) {
        errors.push(
            "fight_history_invalid"
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

export function cloneAmateurCareer(
    career
) {
    return clone(career);
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
    AMATEUR_VERSION,

    AMATEUR_CONFIG,

    AMATEUR_RESULTS,
    AMATEUR_STATUS,
    AMATEUR_FIGHT_TYPES,

    createAmateurCareer,

    getAmateurCareer,
    ensureAmateurCareer,

    canStartAmateurCareer,
    startAmateurCareer,

    isProfessional,

    canHaveAmateurFight,
    getFightsThisYear,
    canFightThisYear,

    determineAmateurFightType,

    getAmateurRecord,
    normalizeAmateurResult,

    calculateExperienceGain,
    calculateFameGain,
    calculateRankingPoints,

    registerAmateurFight,

    calculateNextEligibleDate,
    getNextFightEligibility,

    calculateProgressionScore,
    evaluateProfessionalProgression,

    canTransitionToProfessional,
    transitionToProfessional,

    updateAmateurAchievements,

    enterAmateurTournament,
    winAmateurTournament,
    clearAmateurTournament,

    getAmateurSummary,

    validateAmateurCareer,
    cloneAmateurCareer
};
