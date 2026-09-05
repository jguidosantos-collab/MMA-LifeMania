/*
============================================================
MMA LIFE DYNASTY
RECOVERY SYSTEM
============================================================
Responsabilidade:
- Recuperação de energia
- Redução de fadiga
- Recuperação de saúde
- Sono
- Descanso
- Recuperação ativa
- Recuperação pós-luta
- Recuperação de lesões
- Qualidade da recuperação
- Prontidão física
- Risco de competir sem recuperação adequada
Este módulo NÃO controla:
- Treinos individuais
- Camp completo
- Weight cut
- Motor de luta
Esses sistemas serão conectados posteriormente.
============================================================
*/
const RECOVERY_ACTIVITIES = Object.freeze({
    SLEEP: "sleep",
    REST: "rest",
    ACTIVE_RECOVERY: "activeRecovery",
    MASSAGE: "massage",
    PHYSIO: "physio",
    MEDICAL: "medical",
    FULL_REST: "fullRest"
});
const RECOVERY_QUALITY = Object.freeze({
    TERRIBLE: "terrible",
    POOR: "poor",
    FAIR: "fair",
    GOOD: "good",
    EXCELLENT: "excellent",
    ELITE: "elite"
});
const RECOVERY_STATES = Object.freeze({
    FRESH: "fresh",
    RECOVERED: "recovered",
    NORMAL: "normal",
    TIRED: "tired",
    FATIGUED: "fatigued",
    EXHAUSTED: "exhausted",
    OVERTRAINED: "overtrained"
});
const DEFAULT_RECOVERY = Object.freeze({
    sleepHours: 8,
    sleepQuality: 80,
    energyRecovery: 0,
    fatigueRecovery: 0,
    healthRecovery: 0,
    recoveryQuality: 80,
    state: RECOVERY_STATES.NORMAL
});
const SLEEP_CONFIG = Object.freeze({
    MIN_HOURS: 3,
    OPTIMAL_HOURS: 8,
    MAX_EFFECTIVE_HOURS: 10,
    ENERGY_PER_HOUR: 8,
    FATIGUE_PER_HOUR: 6,
    MIN_QUALITY: 20,
    MAX_QUALITY: 100
});
const RECOVERY_LIMITS = Object.freeze({
    ENERGY_MIN: 0,
    ENERGY_MAX: 100,
    FATIGUE_MIN: 0,
    FATIGUE_MAX: 100,
    HEALTH_MIN: 0,
    HEALTH_MAX: 100,
    QUALITY_MIN: 0,
    QUALITY_MAX: 100
});
/* ============================================================
   UTILITIES
============================================================ */
function clamp(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
        return min;
    }
    return Math.max(min, Math.min(max, number));
}
function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number)
        ? number
        : fallback;
}
function round(value, decimals = 2) {
    const multiplier =
        Math.pow(10, decimals);
    return (
        Math.round(
            safeNumber(value) *
            multiplier
        ) / multiplier
    );
}
function generateRecoveryId() {
    return (
        `recovery_${Date.now()}_` +
        Math.random()
            .toString(36)
            .slice(2, 9)
    );
}
/* ============================================================
   RECOVERY STATE
============================================================ */
function createRecoveryState(options = {}) {
    return {
        id:
            options.id ||
            generateRecoveryId(),
        date:
            options.date ||
            new Date().toISOString(),
        sleepHours: clamp(
            safeNumber(
                options.sleepHours,
                DEFAULT_RECOVERY.sleepHours
            ),
            0,
            24
        ),
        sleepQuality: clamp(
            safeNumber(
                options.sleepQuality,
                DEFAULT_RECOVERY.sleepQuality
            ),
            0,
            100
        ),
        energyRecovery: 0,
        fatigueRecovery: 0,
        healthRecovery: 0,
        recoveryQuality:
            clamp(
                safeNumber(
                    options.recoveryQuality,
                    DEFAULT_RECOVERY.recoveryQuality
                ),
                0,
                100
            ),
        state:
            options.state ||
            RECOVERY_STATES.NORMAL,
        activities: [],
        notes: []
    };
}
/* ============================================================
   SLEEP
============================================================ */
function calculateSleepQuality(
    sleepHours,
    sleepQuality = 80
) {
    const hours = clamp(
        safeNumber(sleepHours),
        0,
        24
    );
    const externalQuality =
        clamp(
            safeNumber(sleepQuality, 80),
            0,
            100
        );
    let durationScore;
    if (hours < SLEEP_CONFIG.MIN_HOURS) {
        durationScore =
            (
                hours /
                SLEEP_CONFIG.MIN_HOURS
            ) * 35;
    } else if (
        hours <= SLEEP_CONFIG.OPTIMAL_HOURS
    ) {
        durationScore =
            45 +
            (
                hours /
                SLEEP_CONFIG.OPTIMAL_HOURS
            ) * 55;
    } else if (
        hours <=
        SLEEP_CONFIG.MAX_EFFECTIVE_HOURS
    ) {
        durationScore =
            100;
    } else {
        /*
         * Sleeping excessively is not treated
         * as infinitely beneficial.
         */
        const excess =
            hours -
            SLEEP_CONFIG.MAX_EFFECTIVE_HOURS;
        durationScore =
            clamp(
                100 -
                (
                    excess * 5
                ),
                70,
                100
            );
    }
    return clamp(
        (
            durationScore * 0.70
        ) +
        (
            externalQuality * 0.30
        ),
        0,
        100
    );
}
function calculateSleepRecovery(
    sleepHours,
    sleepQuality = 80,
    modifiers = {}
) {
    const hours = clamp(
        safeNumber(sleepHours),
        0,
        24
    );
    const quality =
        calculateSleepQuality(
            hours,
            sleepQuality
        );
    const qualityMultiplier =
        0.50 +
        (
            quality / 100
        ) * 0.50;
    const geneticModifier =
        clamp(
            safeNumber(
                modifiers.recoveryGenetics,
                1
            ),
            0.50,
            1.50
        );
    const ageModifier =
        clamp(
            safeNumber(
                modifiers.ageModifier,
                1
            ),
            0.50,
            1.25
        );
    const healthModifier =
        clamp(
            safeNumber(
                modifiers.healthModifier,
                1
            ),
            0.50,
            1.25
        );
    const effectiveHours =
        Math.min(
            hours,
            SLEEP_CONFIG.MAX_EFFECTIVE_HOURS
        );
    const energyRecovery =
        effectiveHours *
        SLEEP_CONFIG.ENERGY_PER_HOUR *
        qualityMultiplier *
        geneticModifier *
        ageModifier *
        healthModifier;
    const fatigueRecovery =
        effectiveHours *
        SLEEP_CONFIG.FATIGUE_PER_HOUR *
        qualityMultiplier *
        geneticModifier *
        ageModifier *
        healthModifier;
    return {
        energy: clamp(
            energyRecovery,
            0,
            100
        ),
        fatigue: clamp(
            fatigueRecovery,
            0,
            100
        ),
        quality,
        effectiveHours
    };
}
/* ============================================================
   GENERAL RECOVERY
============================================================ */
function calculateRecoveryMultiplier(
    recoveryQuality = 80
) {
    const quality =
        clamp(
            safeNumber(
                recoveryQuality,
                80
            ),
            0,
            100
        );
    /*
     * 0 quality = 0.50x
     * 50 quality = 0.75x
     * 100 quality = 1.25x
     */
    return (
        0.50 +
        (
            quality / 100
        ) * 0.75
    );
}
function calculateEnergyRecovery(
    options = {}
) {
    const quality =
        clamp(
            safeNumber(
                options.recoveryQuality,
                80
            ),
            0,
            100
        );
    const hours =
        safeNumber(
            options.sleepHours,
            8
        );
    const sleepQuality =
        safeNumber(
            options.sleepQuality,
            quality
        );
    const modifiers =
        options.modifiers || {};
    const sleep =
        calculateSleepRecovery(
            hours,
            sleepQuality,
            modifiers
        );
    const activityRecovery =
        calculateActivityRecovery(
            options.activity ||
            RECOVERY_ACTIVITIES.REST,
            quality
        );
    return clamp(
        sleep.energy +
        activityRecovery.energy,
        0,
        100
    );
}
function calculateFatigueRecovery(
    options = {}
) {
    const quality =
        clamp(
            safeNumber(
                options.recoveryQuality,
                80
            ),
            0,
            100
        );
    const sleepHours =
        safeNumber(
            options.sleepHours,
            8
        );
    const sleepQuality =
        safeNumber(
            options.sleepQuality,
            quality
        );
    const modifiers =
        options.modifiers || {};
    const sleep =
        calculateSleepRecovery(
            sleepHours,
            sleepQuality,
            modifiers
        );
    const activity =
        calculateActivityRecovery(
            options.activity ||
            RECOVERY_ACTIVITIES.REST,
            quality
        );
    return clamp(
        sleep.fatigue +
        activity.fatigue,
        0,
        100
    );
}
/* ============================================================
   RECOVERY ACTIVITIES
============================================================ */
function calculateActivityRecovery(
    activity,
    quality = 80
) {
    const normalizedQuality =
        clamp(
            safeNumber(
                quality,
                80
            ),
            0,
            100
        );
    const qualityMultiplier =
        0.50 +
        (
            normalizedQuality /
            100
        ) * 0.50;
    let energy = 0;
    let fatigue = 0;
    let health = 0;
    switch (activity) {
        case RECOVERY_ACTIVITIES.SLEEP:
            energy = 8;
            fatigue = 6;
            health = 0.25;
            break;
        case RECOVERY_ACTIVITIES.REST:
            energy = 4;
            fatigue = 5;
            health = 0.50;
            break;
        case RECOVERY_ACTIVITIES.ACTIVE_RECOVERY:
            energy = 2;
            fatigue = 3;
            health = 0.25;
            break;
        case RECOVERY_ACTIVITIES.MASSAGE:
            energy = 1;
            fatigue = 7;
            health = 1;
            break;
        case RECOVERY_ACTIVITIES.PHYSIO:
            energy = 0;
            fatigue = 5;
            health = 2;
            break;
        case RECOVERY_ACTIVITIES.MEDICAL:
            energy = 0;
            fatigue = 3;
            health = 3;
            break;
        case RECOVERY_ACTIVITIES.FULL_REST:
            energy = 6;
            fatigue = 8;
            health = 1.5;
            break;
        default:
            energy = 2;
            fatigue = 2;
            health = 0.25;
            break;
    }
    return {
        energy:
            energy *
            qualityMultiplier,
        fatigue:
            fatigue *
            qualityMultiplier,
        health:
            health *
            qualityMultiplier
    };
}
/* ============================================================
   HEALTH RECOVERY
============================================================ */
function calculateHealthRecovery(
    options = {}
) {
    const quality =
        clamp(
            safeNumber(
                options.recoveryQuality,
                80
            ),
            0,
            100
        );
    const activity =
        options.activity ||
        RECOVERY_ACTIVITIES.REST;
    const activityRecovery =
        calculateActivityRecovery(
            activity,
            quality
        );
    const sleepHours =
        safeNumber(
            options.sleepHours,
            8
        );
    const sleepQuality =
        safeNumber(
            options.sleepQuality,
            quality
        );
    const sleep =
        calculateSleepRecovery(
            sleepHours,
            sleepQuality,
            options.modifiers || {}
        );
    /*
     * Health recovery is deliberately slower
     * than energy recovery.
     */
    const base =
        activityRecovery.health +
        (
            sleep.quality *
            0.015
        );
    const injuryModifier =
        clamp(
            safeNumber(
                options.injuryModifier,
                1
            ),
            0.25,
            1.25
        );
    return clamp(
        base *
        injuryModifier,
        0,
        10
    );
}
/* ============================================================
   APPLY RECOVERY TO PLAYER
============================================================ */
function recoverPlayer(
    player,
    options = {}
) {
    if (!player) {
        return null;
    }
    /*
     * Supports the structure:
     *
     * player.training.energy
     * player.training.fatigue
     * player.health.overall
     *
     * and also direct values where necessary.
     */
    if (!player.training) {
        player.training = {};
    }
    if (!player.health) {
        player.health = {};
    }
    const sleepHours =
        clamp(
            safeNumber(
                options.sleepHours,
                8
            ),
            0,
            24
        );
    const sleepQuality =
        clamp(
            safeNumber(
                options.sleepQuality,
                80
            ),
            0,
            100
        );
    const activity =
        options.activity ||
        RECOVERY_ACTIVITIES.REST;
    const recoveryQuality =
        clamp(
            safeNumber(
                options.recoveryQuality,
                calculateSleepQuality(
                    sleepHours,
                    sleepQuality
                )
            ),
            0,
            100
        );
    const modifiers =
        options.modifiers || {};
    const sleep =
        calculateSleepRecovery(
            sleepHours,
            sleepQuality,
            modifiers
        );
    const activityRecovery =
        calculateActivityRecovery(
            activity,
            recoveryQuality
        );
    const energyGain =
        clamp(
            sleep.energy +
            activityRecovery.energy,
            0,
            100
        );
    const fatigueLoss =
        clamp(
            sleep.fatigue +
            activityRecovery.fatigue,
            0,
            100
        );
    const healthGain =
        calculateHealthRecovery({
            sleepHours,
            sleepQuality,
            recoveryQuality,
            activity,
            modifiers,
            injuryModifier:
                options.injuryModifier
        });
    const currentEnergy =
        clamp(
            safeNumber(
                player.training.energy,
                100
            ),
            0,
            100
        );
    const currentFatigue =
        clamp(
            safeNumber(
                player.training.fatigue,
                0
            ),
            0,
            100
        );
    const currentHealth =
        clamp(
            safeNumber(
                player.health.overall,
                100
            ),
            0,
            100
        );
    player.training.energy =
        clamp(
            currentEnergy +
            energyGain,
            0,
            100
        );
    player.training.fatigue =
        clamp(
            currentFatigue -
            fatigueLoss,
            0,
            100
        );
    player.health.overall =
        clamp(
            currentHealth +
            healthGain,
            0,
            100
        );
    /*
     * If the project uses a top-level energy/fatigue,
     * keep those values synchronized.
     */
    if (
        Object.prototype.hasOwnProperty.call(
            player,
            "energy"
        )
    ) {
        player.energy =
            player.training.energy;
    }
    if (
        Object.prototype.hasOwnProperty.call(
            player,
            "fatigue"
        )
    ) {
        player.fatigue =
            player.training.fatigue;
    }
    const state =
        getRecoveryState(
            player.training.fatigue
        );
    return {
        energyGained:
            round(energyGain),
        fatigueReduced:
            round(fatigueLoss),
        healthGained:
            round(healthGain),
        recoveryQuality:
            round(recoveryQuality),
        state,
        energy:
            round(
                player.training.energy
            ),
        fatigue:
            round(
                player.training.fatigue
            ),
        health:
            round(
                player.health.overall
            )
    };
}
/* ============================================================
   FATIGUE STATE
============================================================ */
function getRecoveryState(
    fatigue
) {
    const value =
        clamp(
            safeNumber(fatigue),
            0,
            100
        );
    if (value >= 90) {
        return RECOVERY_STATES.OVERTRAINED;
    }
    if (value >= 75) {
        return RECOVERY_STATES.EXHAUSTED;
    }
    if (value >= 60) {
        return RECOVERY_STATES.FATIGUED;
    }
    if (value >= 40) {
        return RECOVERY_STATES.TIRED;
    }
    if (value >= 20) {
        return RECOVERY_STATES.NORMAL;
    }
    if (value >= 5) {
        return RECOVERY_STATES.RECOVERED;
    }
    return RECOVERY_STATES.FRESH;
}
/* ============================================================
   RECOVERY QUALITY
============================================================ */
function getRecoveryQuality(
    options = {}
) {
    const sleepHours =
        clamp(
            safeNumber(
                options.sleepHours,
                8
            ),
            0,
            24
        );
    const sleepQuality =
        clamp(
            safeNumber(
                options.sleepQuality,
                80
            ),
            0,
            100
        );
    const stress =
        clamp(
            safeNumber(
                options.stress,
                0
            ),
            0,
            100
        );
    const workload =
        clamp(
            safeNumber(
                options.workload,
                0
            ),
            0,
            100
        );
    const pain =
        clamp(
            safeNumber(
                options.pain,
                0
            ),
            0,
            100
        );
    const lifestyle =
        clamp(
            safeNumber(
                options.lifestyle,
                80
            ),
            0,
            100
        );
    const sleepScore =
        calculateSleepQuality(
            sleepHours,
            sleepQuality
        );
    const quality =
        (
            sleepScore * 0.45
        ) +
        (
            (100 - stress) * 0.15
        ) +
        (
            (100 - workload) * 0.15
        ) +
        (
            (100 - pain) * 0.10
        ) +
        (
            lifestyle * 0.15
        );
    return clamp(
        quality,
        0,
        100
    );
}
function getRecoveryQualityLabel(
    quality
) {
    const value =
        clamp(
            safeNumber(quality),
            0,
            100
        );
    if (value >= 90) {
        return RECOVERY_QUALITY.ELITE;
    }
    if (value >= 80) {
        return RECOVERY_QUALITY.EXCELLENT;
    }
    if (value >= 65) {
        return RECOVERY_QUALITY.GOOD;
    }
    if (value >= 50) {
        return RECOVERY_QUALITY.FAIR;
    }
    if (value >= 30) {
        return RECOVERY_QUALITY.POOR;
    }
    return RECOVERY_QUALITY.TERRIBLE;
}
/* ============================================================
   FIGHT RECOVERY
============================================================ */
function calculatePostFightRecovery(
    fight = {}
) {
    const rounds =
        clamp(
            safeNumber(
                fight.rounds,
                3
            ),
            1,
            5
        );
    const damage =
        clamp(
            safeNumber(
                fight.damage,
                30
            ),
            0,
            100
        );
    const knockdowns =
        clamp(
            safeNumber(
                fight.knockdownsTaken,
                0
            ),
            0,
            10
        );
    const cuts =
        clamp(
            safeNumber(
                fight.cuts,
                0
            ),
            0,
            10
        );
    const concussion =
        Boolean(
            fight.concussion
        );
    const result =
        fight.result ||
        "decision";
    let baseWeeks =
        1;
    if (rounds >= 4) {
        baseWeeks += 1;
    }
    if (rounds >= 5) {
        baseWeeks += 1;
    }
    baseWeeks +=
        Math.floor(
            damage / 35
        );
    baseWeeks +=
        knockdownsTaken;
    baseWeeks +=
        Math.floor(
            cuts / 3
        );
    if (concussion) {
        baseWeeks += 4;
    }
    if (
        result === "KO" ||
        result === "TKO"
    ) {
        baseWeeks += 1;
    }
    return {
        recommendedWeeks:
            clamp(
                baseWeeks,
                1,
                16
            ),
        initialFatigue:
            clamp(
                30 +
                damage * 0.40 +
                knockdownsTaken * 8,
                20,
                100
            ),
        initialHealthLoss:
            clamp(
                damage * 0.35 +
                knockdownsTaken * 5 +
                cuts * 2,
                5,
                60
            )
    };
}
/* ============================================================
   RECOVERY READINESS
============================================================ */
function calculateReadiness(
    player
) {
    if (!player) {
        return {
            score: 0,
            state: RECOVERY_STATES.OVERTRAINED,
            ready: false
        };
    }
    const energy =
        clamp(
            safeNumber(
                player.training?.energy,
                0
            ),
            0,
            100
        );
    const fatigue =
        clamp(
            safeNumber(
                player.training?.fatigue,
                100
            ),
            0,
            100
        );
    const health =
        clamp(
            safeNumber(
                player.health?.overall,
                0
            ),
            0,
            100
        );
    const energyScore =
        energy;
    const fatigueScore =
        100 -
        fatigue;
    const healthScore =
        health;
    const score =
        (
            energyScore * 0.30
        ) +
        (
            fatigueScore * 0.35
        ) +
        (
            healthScore * 0.35
        );
    return {
        score: round(score),
        energy: round(energy),
        fatigue: round(fatigue),
        health: round(health),
        state:
            getRecoveryState(
                fatigue
            ),
        ready:
            score >= 70 &&
            energy >= 60 &&
            fatigue <= 40 &&
            health >= 75,
        fightReady:
            score >= 80 &&
            energy >= 70 &&
            fatigue <= 30 &&
            health >= 85
    };
}
/* ============================================================
   PERFORMANCE PENALTY
============================================================ */
function calculateRecoveryPerformancePenalty(
    player
) {
    const readiness =
        calculateReadiness(player);
    const fatigue =
        readiness.fatigue;
    let penalty = 0;
    if (fatigue >= 90) {
        penalty += 20;
    } else if (fatigue >= 75) {
        penalty += 14;
    } else if (fatigue >= 60) {
        penalty += 8;
    } else if (fatigue >= 40) {
        penalty += 3;
    }
    if (readiness.energy < 50) {
        penalty +=
            (
                50 -
                readiness.energy
            ) * 0.20;
    }
    if (readiness.health < 80) {
        penalty +=
            (
                80 -
                readiness.health
            ) * 0.20;
    }
    return clamp(
        penalty,
        0,
        40
    );
}
/* ============================================================
   INJURY RECOVERY MODIFIER
============================================================ */
function calculateInjuryRecoveryModifier(
    injury = {},
    modifiers = {}
) {
    const severity =
        clamp(
            safeNumber(
                injury.severity,
                1
            ),
            1,
            5
        );
    const healingRate =
        clamp(
            safeNumber(
                modifiers.healingRate,
                50
            ),
            1,
            100
        );
    const medicalTreatment =
        clamp(
            safeNumber(
                modifiers.medicalTreatment,
                0
            ),
            0,
            100
        );
    const severityPenalty =
        1 -
        (
            (severity - 1) *
            0.10
        );
    const healingModifier =
        0.75 +
        (
            healingRate /
            100
        ) * 0.50;
    const treatmentModifier =
        1 +
        (
            medicalTreatment /
            100
        ) * 0.25;
    return clamp(
        severityPenalty *
        healingModifier *
        treatmentModifier,
        0.30,
        1.50
    );
}
/* ============================================================
   DAILY RECOVERY
============================================================ */
function processDailyRecovery(
    player,
    options = {}
) {
    if (!player) {
        return null;
    }
    const result =
        recoverPlayer(
            player,
            options
        );
    const readiness =
        calculateReadiness(
            player
        );
    return {
        ...result,
        readiness,
        performancePenalty:
            calculateRecoveryPerformancePenalty(
                player
            )
    };
}
/* ============================================================
   WEEKLY RECOVERY
============================================================ */
function processWeeklyRecovery(
    player,
    options = {}
) {
    if (!player) {
        return null;
    }
    const days =
        clamp(
            safeNumber(
                options.days,
                7
            ),
            1,
            14
        );
    const results = [];
    for (let day = 0; day < days; day += 1) {
        const dailyOptions = {
            ...options
        };
        if (
            Array.isArray(
                options.sleepSchedule
            )
        ) {
            dailyOptions.sleepHours =
                options.sleepSchedule[day] ??
                options.sleepHours ??
                8;
        }
        results.push(
            processDailyRecovery(
                player,
                dailyOptions
            )
        );
    }
    const readiness =
        calculateReadiness(
            player
        );
    return {
        days,
        results,
        finalReadiness:
            readiness,
        recoveryState:
            readiness.state
    };
}
/* ============================================================
   SNAPSHOT
============================================================ */
function getRecoverySnapshot(
    player
) {
    if (!player) {
        return null;
    }
    const readiness =
        calculateReadiness(
            player
        );
    return {
        energy:
            readiness.energy,
        fatigue:
            readiness.fatigue,
        health:
            readiness.health,
        readiness:
            readiness.score,
        state:
            readiness.state,
        ready:
            readiness.ready,
        fightReady:
            readiness.fightReady,
        performancePenalty:
            calculateRecoveryPerformancePenalty(
                player
            )
    };
}
/* ============================================================
   VALIDATION
============================================================ */
function validateRecoveryState(
    recovery
) {
    const errors = [];
    if (
        !recovery ||
        typeof recovery !== "object"
    ) {
        return {
            valid: false,
            errors: [
                "Estado de recuperação inválido."
            ]
        };
    }
    if (
        !Number.isFinite(
            Number(
                recovery.sleepHours
            )
        )
    ) {
        errors.push(
            "Horas de sono inválidas."
        );
    }
    if (
        !Number.isFinite(
            Number(
                recovery.sleepQuality
            )
        )
    ) {
        errors.push(
            "Qualidade do sono inválida."
        );
    }
    if (
        recovery.state &&
        !Object.values(
            RECOVERY_STATES
        ).includes(
            recovery.state
        )
    ) {
        errors.push(
            "Estado de recuperação inválido."
        );
    }
    return {
        valid:
            errors.length === 0,
        errors
    };
}
/* ============================================================
   CLONE
============================================================ */
function cloneRecoveryState(
    recovery
) {
    if (!recovery) {
        return null;
    }
    return JSON.parse(
        JSON.stringify(recovery)
    );
}
/* ============================================================
   DEFAULT EXPORT
============================================================ */
export {
    RECOVERY_ACTIVITIES,
    RECOVERY_QUALITY,
    RECOVERY_STATES,
    DEFAULT_RECOVERY,
    SLEEP_CONFIG,
    RECOVERY_LIMITS,
    createRecoveryState,
    calculateSleepQuality,
    calculateSleepRecovery,
    calculateRecoveryMultiplier,
    calculateEnergyRecovery,
    calculateFatigueRecovery,
    calculateActivityRecovery,
    calculateHealthRecovery,
    recoverPlayer,
    getRecoveryState,
    getRecoveryQuality,
    getRecoveryQualityLabel,
    calculatePostFightRecovery,
    calculateReadiness,
    calculateRecoveryPerformancePenalty,
    calculateInjuryRecoveryModifier,
    processDailyRecovery,
    processWeeklyRecovery,
    getRecoverySnapshot,
    validateRecoveryState,
    cloneRecoveryState
};
export default {
    RECOVERY_ACTIVITIES,
    RECOVERY_QUALITY,
    RECOVERY_STATES,
    DEFAULT_RECOVERY,
    SLEEP_CONFIG,
    RECOVERY_LIMITS,
    createRecoveryState,
    calculateSleepQuality,
    calculateSleepRecovery,
    calculateRecoveryMultiplier,
    calculateEnergyRecovery,
    calculateFatigueRecovery,
    calculateActivityRecovery,
    calculateHealthRecovery,
    recoverPlayer,
    getRecoveryState,
    getRecoveryQuality,
    getRecoveryQualityLabel,
    calculatePostFightRecovery,
    calculateReadiness,
    calculateRecoveryPerformancePenalty,
    calculateInjuryRecoveryModifier,
    processDailyRecovery,
    processWeeklyRecovery,
    getRecoverySnapshot,
    validateRecoveryState,
    cloneRecoveryState
};
