/*
============================================================
MMA LIFE DYNASTY
TRAINING ENGINE
============================================================
Responsabilidade:
- Orquestrar o sistema de treinamento
- Integrar energia
- Integrar fadiga
- Integrar recuperação
- Integrar saúde
- Integrar camp
- Integrar weight cut
- Processar sessões
- Processar dias
- Processar semanas
- Calcular prontidão
- Evitar treinamento excessivo
- Preparar o atleta para lutas
Este módulo NÃO substitui:
training.js
camp.js
recovery.js
fatigue.js
weightCut.js
health.js
Ele funciona como camada de coordenação.
============================================================
*/
import {
    calculateActivityFatigue,
    applySessionFatigue,
    calculateMultiSessionPenalty,
    getFatigueState,
    calculatePerformancePenalty,
    calculateDailyFatigueProfile,
    canTrainAtIntensity,
    getMaxRecommendedIntensity,
    calculateTrainingLoadIndex
} from "./fatigue.js";
import {
    recoverPlayer,
    calculateRecoveryReadiness,
    calculatePerformancePenalty as calculateRecoveryPerformancePenalty
} from "./recovery.js";
import {
    getWeightCutSnapshot,
    analyzeWeightCut
} from "./weightCut.js";
/* ============================================================
   CONSTANTS
============================================================ */
const TRAINING_ENGINE_STATUS = Object.freeze({
    IDLE: "idle",
    ACTIVE: "active",
    RESTING: "resting",
    RECOVERING: "recovering",
    CAMP: "camp",
    FIGHT_WEEK: "fightWeek",
    POST_FIGHT: "postFight"
});
const TRAINING_SESSION_STATUS = Object.freeze({
    PLANNED: "planned",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    FAILED: "failed"
});
const TRAINING_INTENSITIES = Object.freeze({
    VERY_LOW: "veryLow",
    LOW: "low",
    MODERATE: "moderate",
    HIGH: "high",
    VERY_HIGH: "veryHigh",
    MAXIMAL: "maximal"
});
const BASE_ENERGY = 100;
const MIN_ENERGY_TO_TRAIN = 10;
const MAX_FATIGUE_TO_TRAIN = 95;
/* ============================================================
   UTILS
============================================================ */
function clamp(
    value,
    min,
    max
) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
        return min;
    }
    return Math.max(
        min,
        Math.min(max, number)
    );
}
function safeNumber(
    value,
    fallback = 0
) {
    const number = Number(value);
    return Number.isFinite(number)
        ? number
        : fallback;
}
function round(
    value,
    decimals = 2
) {
    const multiplier =
        Math.pow(
            10,
            decimals
        );
    return (
        Math.round(
            safeNumber(value) *
            multiplier
        ) /
        multiplier
    );
}
function createId(
    prefix = "training"
) {
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
/* ============================================================
   PLAYER TRAINING OBJECT
============================================================ */
function ensureTrainingState(
    player
) {
    if (!player) {
        return null;
    }
    if (!player.training) {
        player.training = {};
    }
    if (
        !Number.isFinite(
            Number(
                player.training.energy
            )
        )
    ) {
        player.training.energy =
            BASE_ENERGY;
    }
    if (
        !Number.isFinite(
            Number(
                player.training.fatigue
            )
        )
    ) {
        player.training.fatigue = 0;
    }
    if (
        !Array.isArray(
            player.training.sessions
        )
    ) {
        player.training.sessions = [];
    }
    if (
        !Array.isArray(
            player.training.history
        )
    ) {
        player.training.history = [];
    }
    if (
        !player.training.weeklyPlan
    ) {
        player.training.weeklyPlan = null;
    }
    if (
        !player.training.camp
    ) {
        player.training.camp = null;
    }
    return player.training;
}
/* ============================================================
   ENGINE STATE
============================================================ */
function createTrainingEngineState(
    options = {}
) {
    return {
        status:
            options.status ||
            TRAINING_ENGINE_STATUS.IDLE,
        currentDay:
            safeNumber(
                options.currentDay,
                1
            ),
        currentWeek:
            safeNumber(
                options.currentWeek,
                1
            ),
        sessionsToday:
            safeNumber(
                options.sessionsToday,
                0
            ),
        sessionsThisWeek:
            safeNumber(
                options.sessionsThisWeek,
                0
            ),
        totalSessions:
            safeNumber(
                options.totalSessions,
                0
            ),
        totalTrainingLoad:
            safeNumber(
                options.totalTrainingLoad,
                0
            ),
        lastSession:
            options.lastSession ||
            null,
        lastRecovery:
            options.lastRecovery ||
            null,
        lastWeightUpdate:
            options.lastWeightUpdate ||
            null,
        history:
            Array.isArray(
                options.history
            )
                ? options.history
                : []
    };
}
/* ============================================================
   INTENSITY VALUES
============================================================ */
function getIntensityValue(
    intensity
) {
    const values = {
        [TRAINING_INTENSITIES.VERY_LOW]: 0.20,
        [TRAINING_INTENSITIES.LOW]: 0.40,
        [TRAINING_INTENSITIES.MODERATE]: 0.60,
        [TRAINING_INTENSITIES.HIGH]: 0.80,
        [TRAINING_INTENSITIES.VERY_HIGH]: 0.95,
        [TRAINING_INTENSITIES.MAXIMAL]: 1.00
    };
    return (
        values[intensity] ??
        values[
            TRAINING_INTENSITIES.MODERATE
        ]
    );
}
/* ============================================================
   ENERGY COST
============================================================ */
function calculateEnergyCost(
    activityType,
    intensity,
    duration = 60
) {
    const intensityValue =
        getIntensityValue(
            intensity
        );
    const durationMultiplier =
        clamp(
            safeNumber(
                duration,
                60
            ) / 60,
            0.25,
            3
        );
    const activityMultipliers = {
        mma: 1.00,
        sparring: 1.10,
        padWork: 0.75,
        boxing: 0.70,
        kickboxing: 0.75,
        muayThai: 0.80,
        wrestling: 0.95,
        grappling: 0.90,
        bjj: 0.85,
        strength: 0.75,
        power: 0.70,
        olympicLifting: 0.70,
        cardio: 0.65,
        running: 0.70,
        intervals: 0.95,
        technical: 0.35,
        gameplan: 0.20,
        recovery: 0.05,
        activeRecovery: 0.10,
        travel: 0.15,
        media: 0.10,
        work: 0.15,
        study: 0.10,
        fight: 1.50,
        weightCut: 1.00,
        other: 0.50
    };
    const activityMultiplier =
        activityMultipliers[
            activityType
        ] ??
        activityMultipliers.other;
    return round(
        5 +
        (
            35 *
            intensityValue *
            activityMultiplier *
            durationMultiplier
        )
    );
}
/* ============================================================
   SESSION PRE-CHECK
============================================================ */
function canPerformSession(
    player,
    session = {}
) {
    if (!player) {
        return {
            allowed: false,
            reason: "Player inválido."
        };
    }
    ensureTrainingState(
        player
    );
    const energy =
        safeNumber(
            player.training.energy,
            BASE_ENERGY
        );
    const fatigue =
        safeNumber(
            player.training.fatigue,
            0
        );
    const intensity =
        session.intensity ||
        TRAINING_INTENSITIES.MODERATE;
    const duration =
        safeNumber(
            session.duration,
            60
        );
    if (
        energy <
        MIN_ENERGY_TO_TRAIN
    ) {
        return {
            allowed: false,
            reason:
                "Energia insuficiente.",
            energy,
            fatigue
        };
    }
    if (
        fatigue >=
        MAX_FATIGUE_TO_TRAIN
    ) {
        return {
            allowed: false,
            reason:
                "Fadiga excessiva.",
            energy,
            fatigue
        };
    }
    let intensityCheck = {
        allowed: true
    };
    try {
        intensityCheck =
            canTrainAtIntensity(
                fatigue,
                intensity
            );
    } catch (
        error
    ) {
        intensityCheck = {
            allowed:
                fatigue <
                90
        };
    }
    if (
        intensityCheck &&
        intensityCheck.allowed === false
    ) {
        return {
            allowed: false,
            reason:
                "A fadiga atual não permite esta intensidade.",
            energy,
            fatigue,
            intensity
        };
    }
    const energyCost =
        calculateEnergyCost(
            session.activityType ||
                "other",
            intensity,
            duration
        );
    if (
        energy <
        energyCost * 0.60
    ) {
        return {
            allowed: false,
            reason:
                "Energia insuficiente para realizar a sessão com qualidade.",
            energy,
            fatigue,
            energyCost
        };
    }
    return {
        allowed: true,
        energy,
        fatigue,
        energyCost,
        intensity
    };
}
/* ============================================================
   MULTI-SESSION PENALTY
============================================================ */
function calculateSessionPenalty(
    sessionsToday
) {
    const count =
        Math.max(
            0,
            safeNumber(
                sessionsToday
            )
        );
    try {
        return calculateMultiSessionPenalty(
            count
        );
    } catch (
        error
    ) {
        if (
            count <= 1
        ) {
            return 1;
        }
        if (
            count === 2
        ) {
            return 0.95;
        }
        if (
            count === 3
        ) {
            return 0.90;
        }
        return 0.80;
    }
}
/* ============================================================
   SESSION RESULT
============================================================ */
function createSessionResult(
    session,
    preState,
    postState,
    performance
) {
    return {
        id:
            session.id ||
            createId(
                "session"
            ),
        activityType:
            session.activityType ||
            "other",
        intensity:
            session.intensity ||
            TRAINING_INTENSITIES.MODERATE,
        duration:
            safeNumber(
                session.duration,
                60
            ),
        completedAt:
            new Date().toISOString(),
        status:
            TRAINING_SESSION_STATUS.COMPLETED,
        energyBefore:
            round(
                preState.energy
            ),
        energyAfter:
            round(
                postState.energy
            ),
        fatigueBefore:
            round(
                preState.fatigue
            ),
        fatigueAfter:
            round(
                postState.fatigue
            ),
        energySpent:
            round(
                preState.energy -
                postState.energy
            ),
        fatigueGained:
            round(
                postState.fatigue -
                preState.fatigue
            ),
        performance:
            round(
                performance
            )
    };
}
/* ============================================================
   EXECUTE SESSION
============================================================ */
function executeTrainingSession(
    player,
    engineState,
    session = {}
) {
    if (!player) {
        return {
            success: false,
            reason:
                "Player inválido."
        };
    }
    ensureTrainingState(
        player
    );
    if (!engineState) {
        engineState =
            createTrainingEngineState();
    }
    const check =
        canPerformSession(
            player,
            session
        );
    if (!check.allowed) {
        return {
            success: false,
            reason:
                check.reason,
            check
        };
    }
    const training =
        player.training;
    const preEnergy =
        safeNumber(
            training.energy,
            BASE_ENERGY
        );
    const preFatigue =
        safeNumber(
            training.fatigue,
            0
        );
    const activityType =
        session.activityType ||
        "other";
    const intensity =
        session.intensity ||
        TRAINING_INTENSITIES.MODERATE;
    const duration =
        safeNumber(
            session.duration,
            60
        );
    const sessionCount =
        safeNumber(
            engineState.sessionsToday,
            0
        );
    const multiSessionPenalty =
        calculateSessionPenalty(
            sessionCount
        );
    const energyCost =
        calculateEnergyCost(
            activityType,
            intensity,
            duration
        );
    const adjustedEnergyCost =
        energyCost *
        (
            1 +
            (
                1 -
                multiSessionPenalty
            )
        );
    training.energy =
        clamp(
            preEnergy -
            adjustedEnergyCost,
            0,
            BASE_ENERGY
        );
    let fatigueResult = null;
    try {
        fatigueResult =
            applySessionFatigue(
                player,
                {
                    activityType,
                    intensity,
                    duration
                }
            );
    } catch (
        error
    ) {
        const calculatedFatigue =
            calculateActivityFatigue(
                activityType,
                intensity,
                duration
            );
        training.fatigue =
            clamp(
                preFatigue +
                safeNumber(
                    calculatedFatigue,
                    5
                ),
                0,
                100
            );
    }
    if (
        !Number.isFinite(
            Number(
                training.fatigue
            )
        )
    ) {
        training.fatigue =
            preFatigue;
    }
    const fatiguePenalty =
        calculatePerformancePenalty(
            training.fatigue
        );
    const performance =
        clamp(
            (
                safeNumber(
                    session.quality,
                    100
                ) *
                fatiguePenalty *
                multiSessionPenalty
            ),
            0,
            100
        );
    const result =
        createSessionResult(
            session,
            {
                energy:
                    preEnergy,
                fatigue:
                    preFatigue
            },
            {
                energy:
                    training.energy,
                fatigue:
                    training.fatigue
            },
            performance
        );
    training.sessions.push(
        result
    );
    training.history.push(
        result
    );
    if (
        training.sessions.length >
        100
    ) {
        training.sessions =
            training.sessions.slice(
                -100
            );
    }
    if (
        training.history.length >
        500
    ) {
        training.history =
            training.history.slice(
                -500
            );
    }
    engineState.sessionsToday +=
        1;
    engineState.sessionsThisWeek +=
        1;
    engineState.totalSessions +=
        1;
    engineState.totalTrainingLoad +=
        calculateTrainingLoad(
            result
        );
    engineState.lastSession =
        result;
    engineState.status =
        TRAINING_ENGINE_STATUS.ACTIVE;
    return {
        success: true,
        result,
        fatigueResult,
        engineState
    };
}
/* ============================================================
   TRAINING LOAD
============================================================ */
function calculateTrainingLoad(
    session
) {
    if (!session) {
        return 0;
    }
    const duration =
        safeNumber(
            session.duration,
            60
        );
    const intensity =
        getIntensityValue(
            session.intensity
        );
    const performance =
        clamp(
            safeNumber(
                session.performance,
                100
            ) / 100,
            0,
            1
        );
    return round(
        duration *
        intensity *
        performance
    );
}
/* ============================================================
   DAILY PROFILE
============================================================ */
function getDailyTrainingProfile(
    player
) {
    if (!player) {
        return null;
    }
    ensureTrainingState(
        player
    );
    const sessions =
        player.training.sessions
            .filter(
                session =>
                    session &&
                    session.status ===
                        TRAINING_SESSION_STATUS.COMPLETED
            );
    let profile = null;
    try {
        profile =
            calculateDailyFatigueProfile(
                sessions
            );
    } catch (
        error
    ) {
        profile = {
            sessions:
                sessions.length,
            totalLoad:
                sessions.reduce(
                    (
                        total,
                        session
                    ) =>
                        total +
                        calculateTrainingLoad(
                            session
                        ),
                    0
                )
        };
    }
    return profile;
}
/* ============================================================
   READINESS
============================================================ */
function calculateTrainingReadiness(
    player
) {
    if (!player) {
        return {
            score: 0,
            ready: false
        };
    }
    ensureTrainingState(
        player
    );
    const energy =
        clamp(
            safeNumber(
                player.training.energy,
                100
            ),
            0,
            100
        );
    const fatigue =
        clamp(
            safeNumber(
                player.training.fatigue,
                0
            ),
            0,
            100
        );
    let score =
        energy -
        fatigue * 0.70;
    let recoveryScore = null;
    try {
        recoveryScore =
            calculateRecoveryReadiness(
                player
            );
        if (
            recoveryScore &&
            Number.isFinite(
                Number(
                    recoveryScore.score
                )
            )
        ) {
            score =
                (
                    score * 0.60
                ) +
                (
                    recoveryScore.score *
                    0.40
                );
        }
    } catch (
        error
    ) {
        // Mantém o cálculo básico.
    }
    score =
        clamp(
            score,
            0,
            100
        );
    return {
        score:
            round(score),
        ready:
            score >= 60,
        energy:
            round(energy),
        fatigue:
            round(fatigue),
        recovery:
            recoveryScore
    };
}
/* ============================================================
   MAX INTENSITY
============================================================ */
function getRecommendedIntensity(
    player
) {
    if (!player) {
        return TRAINING_INTENSITIES.VERY_LOW;
    }
    ensureTrainingState(
        player
    );
    const fatigue =
        safeNumber(
            player.training.fatigue,
            0
        );
    try {
        return getMaxRecommendedIntensity(
            fatigue
        );
    } catch (
        error
    ) {
        if (
            fatigue >= 90
        ) {
            return TRAINING_INTENSITIES.VERY_LOW;
        }
        if (
            fatigue >= 75
        ) {
            return TRAINING_INTENSITIES.LOW;
        }
        if (
            fatigue >= 60
        ) {
            return TRAINING_INTENSITIES.MODERATE;
        }
        if (
            fatigue >= 40
        ) {
            return TRAINING_INTENSITIES.HIGH;
        }
        return TRAINING_INTENSITIES.VERY_HIGH;
    }
}
/* ============================================================
   DAILY RECOVERY
============================================================ */
function processDailyRecovery(
    player,
    engineState,
    options = {}
) {
    if (!player) {
        return {
            success: false,
            reason:
                "Player inválido."
        };
    }
    ensureTrainingState(
        player
    );
    const before = {
        energy:
            safeNumber(
                player.training.energy,
                100
            ),
        fatigue:
            safeNumber(
                player.training.fatigue,
                0
            )
    };
    let recoveryResult = null;
    try {
        recoveryResult =
            recoverPlayer(
                player,
                options
            );
    } catch (
        error
    ) {
        /*
         * Fallback mínimo.
         * O sistema oficial de recuperação
         * continuará sendo recovery.js.
         */
        const sleepQuality =
            clamp(
                safeNumber(
                    options.sleepQuality,
                    80
                ),
                0,
                100
            );
        const recoveryAmount =
            5 +
            sleepQuality /
            20;
        player.training.energy =
            clamp(
                player.training.energy +
                recoveryAmount,
                0,
                100
            );
        player.training.fatigue =
            clamp(
                player.training.fatigue -
                recoveryAmount,
                0,
                100
            );
        recoveryResult = {
            energyRecovered:
                recoveryAmount,
            fatigueRecovered:
                recoveryAmount
        };
    }
    const after = {
        energy:
            safeNumber(
                player.training.energy,
                before.energy
            ),
        fatigue:
            safeNumber(
                player.training.fatigue,
                before.fatigue
            )
    };
    const result = {
        date:
            new Date().toISOString(),
        energyBefore:
            round(
                before.energy
            ),
        energyAfter:
            round(
                after.energy
            ),
        fatigueBefore:
            round(
                before.fatigue
            ),
        fatigueAfter:
            round(
                after.fatigue
            ),
        recoveryResult
    };
    engineState.lastRecovery =
        result;
    engineState.status =
        TRAINING_ENGINE_STATUS.RECOVERING;
    return {
        success: true,
        result
    };
}
/* ============================================================
   PROCESS DAY
============================================================ */
function processTrainingDay(
    player,
    engineState,
    options = {}
) {
    if (!player) {
        return {
            success: false,
            reason:
                "Player inválido."
        };
    }
    ensureTrainingState(
        player
    );
    if (!engineState) {
        engineState =
            createTrainingEngineState();
    }
    const profile =
        getDailyTrainingProfile(
            player
        );
    const recovery =
        processDailyRecovery(
            player,
            engineState,
            options
        );
    engineState.currentDay +=
        1;
    engineState.sessionsToday =
        0;
    const readiness =
        calculateTrainingReadiness(
            player
        );
    const state = {
        day:
            engineState.currentDay,
        profile,
        recovery:
            recovery.result,
        readiness,
        fatigueState:
            getFatigueState(
                player.training.fatigue
            )
    };
    engineState.history.push(
        state
    );
    if (
        engineState.history.length >
        365
    ) {
        engineState.history =
            engineState.history.slice(
                -365
            );
    }
    return {
        success: true,
        state,
        engineState
    };
}
/* ============================================================
   PROCESS WEEK
============================================================ */
function processTrainingWeek(
    player,
    engineState,
    options = {}
) {
    if (!player) {
        return {
            success: false,
            reason:
                "Player inválido."
        };
    }
    if (!engineState) {
        engineState =
            createTrainingEngineState();
    }
    const weekLoad =
        calculateWeeklyTrainingLoad(
            player
        );
    const weeklyProfile = {
        week:
            engineState.currentWeek,
        sessions:
            engineState.sessionsThisWeek,
        totalLoad:
            weekLoad,
        averageLoad:
            engineState.sessionsThisWeek >
            0
                ? round(
                    weekLoad /
                    engineState.sessionsThisWeek
                )
                : 0,
        readiness:
            calculateTrainingReadiness(
                player
            )
    };
    engineState.currentWeek +=
        1;
    engineState.sessionsThisWeek =
        0;
    return {
        success: true,
        weeklyProfile,
        engineState
    };
}
/* ============================================================
   WEEKLY LOAD
============================================================ */
function calculateWeeklyTrainingLoad(
    player
) {
    if (
        !player ||
        !player.training
    ) {
        return 0;
    }
    const sessions =
        Array.isArray(
            player.training.sessions
        )
            ? player.training.sessions
            : [];
    return round(
        sessions
            .filter(
                session =>
                    session &&
                    session.status ===
                        TRAINING_SESSION_STATUS.COMPLETED
            )
            .slice(-50)
            .reduce(
                (
                    total,
                    session
                ) =>
                    total +
                    calculateTrainingLoad(
                        session
                    ),
                0
            )
    );
}
/* ============================================================
   WEIGHT CUT STATUS
============================================================ */
function getTrainingWeightStatus(
    player
) {
    if (
        !player
    ) {
        return null;
    }
    const weightCut =
        player.training?.weightCut;
    if (!weightCut) {
        return null;
    }
    return getWeightCutSnapshot(
        weightCut
    );
}
/* ============================================================
   WEIGHT CUT IMPACT
============================================================ */
function calculateWeightCutTrainingPenalty(
    player
) {
    if (
        !player ||
        !player.training?.weightCut
    ) {
        return 0;
    }
    const weightCut =
        player.training.weightCut;
    const analysis =
        analyzeWeightCut({
            currentWeight:
                weightCut.currentWeight,
            targetWeight:
                weightCut.targetWeight,
            weighInWeight:
                weightCut.weighInWeight,
            dehydrationPercent:
                weightCut.dehydrationPercent
        });
    return clamp(
        safeNumber(
            analysis.healthImpact
                ?.performancePenalty,
            0
        ),
        0,
        100
    );
}
/* ============================================================
   COMPLETE PERFORMANCE
============================================================ */
function calculateTrainingPerformance(
    player,
    session = {}
) {
    if (!player) {
        return 0;
    }
    ensureTrainingState(
        player
    );
    const fatiguePenalty =
        calculatePerformancePenalty(
            player.training.fatigue
        );
    let recoveryPenalty = 1;
    try {
        const penalty =
            calculateRecoveryPerformancePenalty(
                player
            );
        if (
            Number.isFinite(
                Number(penalty)
            )
        ) {
            recoveryPenalty =
                clamp(
                    Number(penalty),
                    0,
                    1
                );
        } else if (
            penalty &&
            Number.isFinite(
                Number(
                    penalty.multiplier
                )
            )
        ) {
            recoveryPenalty =
                clamp(
                    Number(
                        penalty.multiplier
                    ),
                    0,
                    1
                );
        }
    } catch (
        error
    ) {
        recoveryPenalty = 1;
    }
    const weightPenalty =
        calculateWeightCutTrainingPenalty(
            player
        );
    const weightMultiplier =
        clamp(
            1 -
            weightPenalty /
            100,
            0,
            1
        );
    const energy =
        clamp(
            safeNumber(
                player.training.energy,
                100
            ),
            0,
            100
        );
    const energyMultiplier =
        0.50 +
        (
            energy /
            100
        ) *
        0.50;
    const intensity =
        getIntensityValue(
            session.intensity ||
                TRAINING_INTENSITIES.MODERATE
        );
    return round(
        clamp(
            100 *
            fatiguePenalty *
            recoveryPenalty *
            weightMultiplier *
            energyMultiplier *
            (
                0.70 +
                intensity * 0.30
            ),
            0,
            100
        )
    );
}
/* ============================================================
   TRAINING ENGINE PROCESS
============================================================ */
function processTrainingEngine(
    player,
    engineState,
    action = {},
    options = {}
) {
    if (!player) {
        return {
            success: false,
            reason:
                "Player inválido."
        };
    }
    if (!engineState) {
        engineState =
            createTrainingEngineState();
    }
    const type =
        action.type ||
        "session";
    switch (type) {
        case "session":
            return executeTrainingSession(
                player,
                engineState,
                action.session ||
                    action
            );
        case "rest":
            return processDailyRecovery(
                player,
                engineState,
                {
                    ...options,
                    fullRest: true
                }
            );
        case "day":
            return processTrainingDay(
                player,
                engineState,
                options
            );
        case "week":
            return processTrainingWeek(
                player,
                engineState,
                options
            );
        default:
            return {
                success: false,
                reason:
                    "Ação de treinamento desconhecida."
            };
    }
}
/* ============================================================
   SUMMARY
============================================================ */
function getTrainingEngineSummary(
    player,
    engineState
) {
    if (!player) {
        return null;
    }
    if (!engineState) {
        engineState =
            createTrainingEngineState();
    }
    ensureTrainingState(
        player
    );
    const readiness =
        calculateTrainingReadiness(
            player
        );
    const fatigue =
        getFatigueState(
            player.training.fatigue
        );
    const weight =
        getTrainingWeightStatus(
            player
        );
    return {
        status:
            engineState.status,
        day:
            engineState.currentDay,
        week:
            engineState.currentWeek,
        sessionsToday:
            engineState.sessionsToday,
        sessionsThisWeek:
            engineState.sessionsThisWeek,
        totalSessions:
            engineState.totalSessions,
        totalTrainingLoad:
            round(
                engineState.totalTrainingLoad
            ),
        energy:
            round(
                player.training.energy
            ),
        fatigue:
            round(
                player.training.fatigue
            ),
        fatigueState:
            fatigue,
        readiness,
        recommendedIntensity:
            getRecommendedIntensity(
                player
            ),
        weightCut:
            weight
    };
}
/* ============================================================
   VALIDATION
============================================================ */
function validateTrainingEngineState(
    state
) {
    if (!state) {
        return false;
    }
    if (
        !Object.values(
            TRAINING_ENGINE_STATUS
        ).includes(
            state.status
        )
    ) {
        return false;
    }
    if (
        !Number.isFinite(
            Number(
                state.currentDay
            )
        )
    ) {
        return false;
    }
    if (
        !Number.isFinite(
            Number(
                state.currentWeek
            )
        )
    ) {
        return false;
    }
    return true;
}
/* ============================================================
   CLONE
============================================================ */
function cloneTrainingEngineState(
    state
) {
    if (!state) {
        return null;
    }
    return JSON.parse(
        JSON.stringify(state)
    );
}
/* ============================================================
   RESET DAY
============================================================ */
function resetTrainingDay(
    engineState
) {
    if (!engineState) {
        return null;
    }
    engineState.sessionsToday =
        0;
    engineState.status =
        TRAINING_ENGINE_STATUS.IDLE;
    return engineState;
}
/* ============================================================
   RESET WEEK
============================================================ */
function resetTrainingWeek(
    engineState
) {
    if (!engineState) {
        return null;
    }
    engineState.sessionsThisWeek =
        0;
    engineState.status =
        TRAINING_ENGINE_STATUS.IDLE;
    return engineState;
}
/* ============================================================
   EXPORTS
============================================================ */
export {
    TRAINING_ENGINE_STATUS,
    TRAINING_SESSION_STATUS,
    TRAINING_INTENSITIES,
    BASE_ENERGY,
    MIN_ENERGY_TO_TRAIN,
    MAX_FATIGUE_TO_TRAIN,
    createTrainingEngineState,
    ensureTrainingState,
    getIntensityValue,
    calculateEnergyCost,
    canPerformSession,
    calculateSessionPenalty,
    executeTrainingSession,
    calculateTrainingLoad,
    calculateWeeklyTrainingLoad,
    getDailyTrainingProfile,
    calculateTrainingReadiness,
    getRecommendedIntensity,
    processDailyRecovery,
    processTrainingDay,
    processTrainingWeek,
    getTrainingWeightStatus,
    calculateWeightCutTrainingPenalty,
    calculateTrainingPerformance,
    processTrainingEngine,
    getTrainingEngineSummary,
    validateTrainingEngineState,
    cloneTrainingEngineState,
    resetTrainingDay,
    resetTrainingWeek
};
export default {
    TRAINING_ENGINE_STATUS,
    TRAINING_SESSION_STATUS,
    TRAINING_INTENSITIES,
    BASE_ENERGY,
    MIN_ENERGY_TO_TRAIN,
    MAX_FATIGUE_TO_TRAIN,
    createTrainingEngineState,
    ensureTrainingState,
    getIntensityValue,
    calculateEnergyCost,
    canPerformSession,
    calculateSessionPenalty,
    executeTrainingSession,
    calculateTrainingLoad,
    calculateWeeklyTrainingLoad,
    getDailyTrainingProfile,
    calculateTrainingReadiness,
    getRecommendedIntensity,
    processDailyRecovery,
    processTrainingDay,
    processTrainingWeek,
    getTrainingWeightStatus,
    calculateWeightCutTrainingPenalty,
    calculateTrainingPerformance,
    processTrainingEngine,
    getTrainingEngineSummary,
    validateTrainingEngineState,
    cloneTrainingEngineState,
    resetTrainingDay,
    resetTrainingWeek
};
