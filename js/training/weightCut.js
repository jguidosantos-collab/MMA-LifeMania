/*
============================================================
MMA LIFE DYNASTY
WEIGHT CUT SYSTEM
============================================================
Responsabilidade:
- Controle do peso do atleta
- Peso natural
- Peso de competição
- Categoria
- Ganho/perda de peso
- Corte gradual
- Corte agressivo
- Fight Week
- Desidratação
- Glicogênio
- Risco do corte
- Impacto em energia, fadiga e saúde
- Pesagem
- Recuperação pós-pesagem
- Falha na balança
IMPORTANTE:
Este módulo controla o SISTEMA DE PESO.
Ele não substitui:
- training.js
- fatigue.js
- recovery.js
- health.js
- camp.js
Esses sistemas serão integrados posteriormente.
============================================================
*/
import {
    MEN_WEIGHT_CLASSES,
    WOMEN_WEIGHT_CLASSES
} from "../core/constants.js";
/* ============================================================
   CONSTANTS
============================================================ */
const WEIGHT_CUT_PHASES = Object.freeze({
    NORMAL: "normal",
    GRADUAL: "gradual",
    CAMP: "camp",
    FIGHT_WEEK: "fightWeek",
    WEIGH_IN: "weighIn",
    POST_WEIGH_IN: "postWeighIn",
    RECOVERY: "recovery"
});
const WEIGHT_CUT_RISK = Object.freeze({
    NONE: "none",
    LOW: "low",
    MODERATE: "moderate",
    HIGH: "high",
    VERY_HIGH: "veryHigh",
    CRITICAL: "critical"
});
const WEIGHT_CUT_METHODS = Object.freeze({
    DIET: "diet",
    TRAINING: "training",
    CARDIO: "cardio",
    WATER: "water",
    GLYCOGEN: "glycogen",
    SODIUM: "sodium",
    SWEAT: "sweat",
    COMBINED: "combined"
});
/* ============================================================
   DEFAULTS
============================================================ */
const DEFAULT_WEIGHT_CUT_CONFIG = Object.freeze({
    safeWeeklyLossPercent: 0.75,
    moderateWeeklyLossPercent: 1.00,
    aggressiveWeeklyLossPercent: 1.50,
    maxGradualCutPercent: 8,
    maxFightWeekCutPercent: 5,
    dehydrationWarningPercent: 3,
    dehydrationDangerPercent: 5,
    dehydrationCriticalPercent: 7,
    defaultRehydrationPercent: 4,
    minimumHealthyWeightMargin: 0.02
});
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
        ) / multiplier
    );
}
/* ============================================================
   WEIGHT CLASS HELPERS
============================================================ */
function getWeightClassList(
    sex = "male"
) {
    if (
        String(sex).toLowerCase() ===
        "female"
    ) {
        return WOMEN_WEIGHT_CLASSES || {};
    }
    return MEN_WEIGHT_CLASSES || {};
}
function getWeightClassLimit(
    weightClass,
    sex = "male"
) {
    const classes =
        getWeightClassList(sex);
    const entry =
        classes[weightClass];
    if (
        typeof entry === "number"
    ) {
        return entry;
    }
    if (
        entry &&
        typeof entry === "object"
    ) {
        return safeNumber(
            entry.limit ??
            entry.maxWeight ??
            entry.weight,
            null
        );
    }
    return null;
}
function getWeightClassByWeight(
    weight,
    sex = "male"
) {
    const value =
        safeNumber(
            weight,
            0
        );
    const classes =
        getWeightClassList(sex);
    const entries =
        Object.entries(
            classes
        );
    if (!entries.length) {
        return null;
    }
    const normalized =
        entries
            .map(
                ([name, data]) => ({
                    name,
                    limit:
                        typeof data === "number"
                            ? data
                            : safeNumber(
                                data?.limit ??
                                data?.maxWeight ??
                                data?.weight,
                                Infinity
                            )
                })
            )
            .sort(
                (a, b) =>
                    a.limit - b.limit
            );
    for (
        const item of normalized
    ) {
        if (
            value <=
            item.limit
        ) {
            return item.name;
        }
    }
    return normalized[
        normalized.length - 1
    ].name;
}
function getNextWeightClass(
    weightClass,
    sex = "male"
) {
    const classes =
        getWeightClassList(sex);
    const entries =
        Object.entries(
            classes
        )
            .map(
                ([name, data]) => ({
                    name,
                    limit:
                        typeof data === "number"
                            ? data
                            : safeNumber(
                                data?.limit ??
                                data?.maxWeight ??
                                data?.weight,
                                Infinity
                            )
                })
            )
            .sort(
                (a, b) =>
                    a.limit - b.limit
            );
    const index =
        entries.findIndex(
            item =>
                item.name ===
                weightClass
        );
    if (
        index < 0 ||
        index >=
        entries.length - 1
    ) {
        return null;
    }
    return entries[
        index + 1
    ].name;
}
function getPreviousWeightClass(
    weightClass,
    sex = "male"
) {
    const classes =
        getWeightClassList(sex);
    const entries =
        Object.entries(
            classes
        )
            .map(
                ([name, data]) => ({
                    name,
                    limit:
                        typeof data === "number"
                            ? data
                            : safeNumber(
                                data?.limit ??
                                data?.maxWeight ??
                                data?.weight,
                                Infinity
                            )
                })
            )
            .sort(
                (a, b) =>
                    a.limit - b.limit
            );
    const index =
        entries.findIndex(
            item =>
                item.name ===
                weightClass
        );
    if (
        index <= 0
    ) {
        return null;
    }
    return entries[
        index - 1
    ].name;
}
/* ============================================================
   WEIGHT DIFFERENCE
============================================================ */
function calculateWeightDifference(
    currentWeight,
    targetWeight
) {
    const current =
        safeNumber(
            currentWeight
        );
    const target =
        safeNumber(
            targetWeight
        );
    const difference =
        current - target;
    return {
        currentWeight:
            round(current),
        targetWeight:
            round(target),
        amountToLose:
            round(
                Math.max(
                    0,
                    difference
                )
            ),
        amountToGain:
            round(
                Math.max(
                    0,
                    -difference
                )
            ),
        difference:
            round(
                difference
            ),
        percentage:
            current > 0
                ? round(
                    (
                        difference /
                        current
                    ) * 100
                )
                : 0
    };
}
/* ============================================================
   CUT PERCENTAGES
============================================================ */
function calculateCutPercentage(
    currentWeight,
    targetWeight
) {
    const current =
        safeNumber(
            currentWeight
        );
    if (
        current <= 0
    ) {
        return 0;
    }
    return round(
        (
            (
                current -
                safeNumber(
                    targetWeight
                )
            ) /
            current
        ) * 100
    );
}
function calculateFightWeekCutPercentage(
    currentWeight,
    weighInWeight
) {
    return calculateCutPercentage(
        currentWeight,
        weighInWeight
    );
}
/* ============================================================
   CUT RISK
============================================================ */
function getWeightCutRisk(
    percentage
) {
    const value =
        Math.max(
            0,
            safeNumber(
                percentage
            )
        );
    if (
        value < 2
    ) {
        return WEIGHT_CUT_RISK.NONE;
    }
    if (
        value < 4
    ) {
        return WEIGHT_CUT_RISK.LOW;
    }
    if (
        value < 6
    ) {
        return WEIGHT_CUT_RISK.MODERATE;
    }
    if (
        value < 8
    ) {
        return WEIGHT_CUT_RISK.HIGH;
    }
    if (
        value < 10
    ) {
        return WEIGHT_CUT_RISK.VERY_HIGH;
    }
    return WEIGHT_CUT_RISK.CRITICAL;
}
function getDehydrationRisk(
    dehydrationPercent
) {
    const value =
        Math.max(
            0,
            safeNumber(
                dehydrationPercent
            )
        );
    if (
        value < 2
    ) {
        return WEIGHT_CUT_RISK.NONE;
    }
    if (
        value < 3
    ) {
        return WEIGHT_CUT_RISK.LOW;
    }
    if (
        value < 5
    ) {
        return WEIGHT_CUT_RISK.MODERATE;
    }
    if (
        value < 7
    ) {
        return WEIGHT_CUT_RISK.HIGH;
    }
    if (
        value < 10
    ) {
        return WEIGHT_CUT_RISK.VERY_HIGH;
    }
    return WEIGHT_CUT_RISK.CRITICAL;
}
/* ============================================================
   WEEKLY SAFE LOSS
============================================================ */
function calculateWeeklyWeightLossLimit(
    currentWeight,
    options = {}
) {
    const weight =
        Math.max(
            0,
            safeNumber(
                currentWeight
            )
        );
    const safePercent =
        safeNumber(
            options.safePercent,
            DEFAULT_WEIGHT_CUT_CONFIG.safeWeeklyLossPercent
        );
    const moderatePercent =
        safeNumber(
            options.moderatePercent,
            DEFAULT_WEIGHT_CUT_CONFIG.moderateWeeklyLossPercent
        );
    const aggressivePercent =
        safeNumber(
            options.aggressivePercent,
            DEFAULT_WEIGHT_CUT_CONFIG.aggressiveWeeklyLossPercent
        );
    return {
        safe:
            round(
                weight *
                safePercent /
                100
            ),
        moderate:
            round(
                weight *
                moderatePercent /
                100
            ),
        aggressive:
            round(
                weight *
                aggressivePercent /
                100
            ),
        safePercent,
        moderatePercent,
        aggressivePercent
    };
}
/* ============================================================
   GRADUAL CUT
============================================================ */
function calculateGradualCutPlan(
    currentWeight,
    targetWeight,
    weeksAvailable,
    options = {}
) {
    const current =
        safeNumber(
            currentWeight
        );
    const target =
        safeNumber(
            targetWeight
        );
    const weeks =
        Math.max(
            1,
            safeNumber(
                weeksAvailable,
                1
            )
        );
    const totalLoss =
        Math.max(
            0,
            current -
            target
        );
    const lossPerWeek =
        totalLoss /
        weeks;
    const lossPercent =
        current > 0
            ? (
                lossPerWeek /
                current
            ) * 100
            : 0;
    const limits =
        calculateWeeklyWeightLossLimit(
            current,
            options
        );
    let difficulty =
        "easy";
    if (
        lossPercent >
        limits.aggressivePercent
    ) {
        difficulty =
            "extreme";
    } else if (
        lossPercent >
        limits.moderatePercent
    ) {
        difficulty =
            "aggressive";
    } else if (
        lossPercent >
        limits.safePercent
    ) {
        difficulty =
            "moderate";
    }
    return {
        currentWeight:
            round(current),
        targetWeight:
            round(target),
        totalLoss:
            round(totalLoss),
        weeks:
            Math.ceil(weeks),
        lossPerWeek:
            round(lossPerWeek),
        lossPercentPerWeek:
            round(lossPercent),
        difficulty,
        withinSafeRange:
            lossPercent <=
            limits.safePercent,
        withinAggressiveRange:
            lossPercent <=
            limits.aggressivePercent,
        recommendedWeeklyLimit:
            limits.safe,
        warning:
            lossPercent >
            limits.aggressivePercent
                ? "O corte é excessivamente agressivo."
                : lossPercent >
                    limits.safePercent
                    ? "O corte está acima da faixa conservadora."
                    : null
    };
}
/* ============================================================
   FIGHT WEEK
============================================================ */
function calculateFightWeekPlan(
    currentWeight,
    weighInWeight,
    daysUntilWeighIn,
    options = {}
) {
    const current =
        safeNumber(
            currentWeight
        );
    const target =
        safeNumber(
            weighInWeight
        );
    const days =
        Math.max(
            1,
            safeNumber(
                daysUntilWeighIn,
                7
            )
        );
    const totalLoss =
        Math.max(
            0,
            current -
            target
        );
    const percentage =
        calculateFightWeekCutPercentage(
            current,
            target
        );
    const dehydrationPercent =
        Math.max(
            0,
            safeNumber(
                options.dehydrationPercent,
                0
            )
        );
    const dehydrationRisk =
        getDehydrationRisk(
            dehydrationPercent
        );
    const risk =
        getWeightCutRisk(
            percentage
        );
    return {
        currentWeight:
            round(current),
        weighInWeight:
            round(target),
        totalLoss:
            round(totalLoss),
        percentage,
        daysUntilWeighIn:
            Math.ceil(days),
        averageDailyLoss:
            round(
                totalLoss /
                days
            ),
        risk,
        dehydrationPercent:
            round(
                dehydrationPercent
            ),
        dehydrationRisk,
        critical:
            risk ===
                WEIGHT_CUT_RISK.VERY_HIGH ||
            risk ===
                WEIGHT_CUT_RISK.CRITICAL ||
            dehydrationRisk ===
                WEIGHT_CUT_RISK.VERY_HIGH ||
            dehydrationRisk ===
                WEIGHT_CUT_RISK.CRITICAL
    };
}
/* ============================================================
   WATER / GLYCOGEN
============================================================ */
function calculateWeightComposition(
    currentWeight,
    options = {}
) {
    const weight =
        safeNumber(
            currentWeight
        );
    const bodyFatPercent =
        clamp(
            safeNumber(
                options.bodyFatPercent,
                15
            ),
            3,
            60
        );
    /*
     * These values are game abstractions.
     * They are NOT intended as medical guidance.
     */
    const fatMass =
        weight *
        bodyFatPercent /
        100;
    const leanMass =
        Math.max(
            0,
            weight -
            fatMass
        );
    const estimatedWater =
        leanMass *
        0.70;
    const estimatedGlycogen =
        leanMass *
        0.015;
    return {
        bodyWeight:
            round(weight),
        bodyFatPercent:
            round(
                bodyFatPercent
            ),
        fatMass:
            round(fatMass),
        leanMass:
            round(leanMass),
        estimatedWater:
            round(
                estimatedWater
            ),
        estimatedGlycogen:
            round(
                estimatedGlycogen
            )
    };
}
/* ============================================================
   CUT SOURCE
============================================================ */
function calculateCutSources(
    currentWeight,
    targetWeight,
    options = {}
) {
    const difference =
        Math.max(
            0,
            safeNumber(
                currentWeight
            ) -
            safeNumber(
                targetWeight
            )
        );
    const fatLossPercent =
        clamp(
            safeNumber(
                options.fatLossPercent,
                70
            ),
            0,
            100
        );
    const waterPercent =
        clamp(
            safeNumber(
                options.waterPercent,
                20
            ),
            0,
            100
        );
    const glycogenPercent =
        clamp(
            safeNumber(
                options.glycogenPercent,
                10
            ),
            0,
            100
        );
    const total =
        fatLossPercent +
        waterPercent +
        glycogenPercent;
    const normalizedFat =
        total > 0
            ? fatLossPercent /
              total
            : 0;
    const normalizedWater =
        total > 0
            ? waterPercent /
              total
            : 0;
    const normalizedGlycogen =
        total > 0
            ? glycogenPercent /
              total
            : 0;
    return {
        totalLoss:
            round(difference),
        fat:
            round(
                difference *
                normalizedFat
            ),
        water:
            round(
                difference *
                normalizedWater
            ),
        glycogen:
            round(
                difference *
                normalizedGlycogen
            )
    };
}
/* ============================================================
   HEALTH IMPACT
============================================================ */
function calculateHealthImpact(
    percentage,
    dehydrationPercent = 0
) {
    const cut =
        Math.max(
            0,
            safeNumber(
                percentage
            )
        );
    const dehydration =
        Math.max(
            0,
            safeNumber(
                dehydrationPercent
            )
        );
    let healthPenalty = 0;
    let energyPenalty = 0;
    let fatigueIncrease = 0;
    if (
        cut > 3
    ) {
        healthPenalty +=
            (
                cut - 3
            ) * 0.50;
    }
    if (
        cut > 5
    ) {
        healthPenalty +=
            (
                cut - 5
            ) * 1.00;
    }
    if (
        dehydration > 2
    ) {
        healthPenalty +=
            (
                dehydration - 2
            ) * 1.50;
    }
    energyPenalty =
        clamp(
            cut * 2 +
            dehydration * 4,
            0,
            40
        );
    fatigueIncrease =
        clamp(
            cut * 1.5 +
            dehydration * 3,
            0,
            40
        );
    return {
        healthPenalty:
            round(
                clamp(
                    healthPenalty,
                    0,
                    30
                )
            ),
        energyPenalty:
            round(
                energyPenalty
            ),
        fatigueIncrease:
            round(
                fatigueIncrease
            ),
        performancePenalty:
            round(
                clamp(
                    cut * 1.5 +
                    dehydration * 3,
                    0,
                    35
                )
            )
    };
}
/* ============================================================
   WEIGHT CUT STATE
============================================================ */
function createWeightCutState(
    options = {}
) {
    const currentWeight =
        safeNumber(
            options.currentWeight,
            70
        );
    const targetWeight =
        safeNumber(
            options.targetWeight,
            currentWeight
        );
    const sex =
        options.sex ||
        "male";
    const weightClass =
        options.weightClass ||
        getWeightClassByWeight(
            targetWeight,
            sex
        );
    return {
        phase:
            options.phase ||
            WEIGHT_CUT_PHASES.NORMAL,
        currentWeight:
            round(currentWeight),
        naturalWeight:
            round(
                safeNumber(
                    options.naturalWeight,
                    currentWeight
                )
            ),
        targetWeight:
            round(targetWeight),
        weighInWeight:
            round(
                safeNumber(
                    options.weighInWeight,
                    targetWeight
                )
            ),
        weightClass,
        sex,
        daysUntilWeighIn:
            Math.max(
                0,
                Math.round(
                    safeNumber(
                        options.daysUntilWeighIn,
                        0
                    )
                )
            ),
        cutStarted:
            Boolean(
                options.cutStarted
            ),
        dehydrationPercent:
            round(
                safeNumber(
                    options.dehydrationPercent,
                    0
                )
            ),
        glycogenReduction:
            round(
                safeNumber(
                    options.glycogenReduction,
                    0
                )
            ),
        waterReduction:
            round(
                safeNumber(
                    options.waterReduction,
                    0
                )
            ),
        risk:
            getWeightCutRisk(
                calculateCutPercentage(
                    currentWeight,
                    targetWeight
                )
            ),
        failedWeighIn:
            false,
        weighedIn:
            false,
        rehydrationWeight:
            null,
        lastUpdated:
            null
    };
}
/* ============================================================
   UPDATE CURRENT WEIGHT
============================================================ */
function updateCurrentWeight(
    state,
    newWeight
) {
    if (!state) {
        return null;
    }
    const weight =
        Math.max(
            0,
            safeNumber(
                newWeight,
                state.currentWeight
            )
        );
    state.currentWeight =
        round(weight);
    state.risk =
        getWeightCutRisk(
            calculateCutPercentage(
                state.currentWeight,
                state.targetWeight
            )
        );
    return state;
}
/* ============================================================
   SET TARGET
============================================================ */
function setTargetWeight(
    state,
    targetWeight,
    weightClass = null
) {
    if (!state) {
        return null;
    }
    state.targetWeight =
        round(
            Math.max(
                0,
                safeNumber(
                    targetWeight
                )
            )
        );
    if (
        weightClass
    ) {
        state.weightClass =
            weightClass;
    } else {
        state.weightClass =
            getWeightClassByWeight(
                state.targetWeight,
                state.sex
            );
    }
    state.risk =
        getWeightCutRisk(
            calculateCutPercentage(
                state.currentWeight,
                state.targetWeight
            )
        );
    return state;
}
/* ============================================================
   APPLY WEIGHT CHANGE
============================================================ */
function applyWeightChange(
    state,
    amount,
    method = WEIGHT_CUT_METHODS.DIET
) {
    if (!state) {
        return null;
    }
    const change =
        safeNumber(
            amount
        );
    state.currentWeight =
        round(
            Math.max(
                0,
                state.currentWeight -
                change
            )
        );
    if (
        method ===
        WEIGHT_CUT_METHODS.WATER
    ) {
        state.waterReduction =
            round(
                state.waterReduction +
                Math.max(
                    0,
                    change
                )
            );
    }
    if (
        method ===
        WEIGHT_CUT_METHODS.GLYCOGEN
    ) {
        state.glycogenReduction =
            round(
                state.glycogenReduction +
                Math.max(
                    0,
                    change
                )
            );
    }
    state.risk =
        getWeightCutRisk(
            calculateCutPercentage(
                state.currentWeight,
                state.targetWeight
            )
        );
    return state;
}
/* ============================================================
   START CUT
============================================================ */
function startWeightCut(
    state
) {
    if (!state) {
        return null;
    }
    state.cutStarted =
        true;
    state.phase =
        WEIGHT_CUT_PHASES.GRADUAL;
    return state;
}
/* ============================================================
   ADVANCE CUT PHASE
============================================================ */
function advanceWeightCutPhase(
    state,
    phase
) {
    if (!state) {
        return null;
    }
    const valid =
        Object.values(
            WEIGHT_CUT_PHASES
        ).includes(
            phase
        );
    if (!valid) {
        return state;
    }
    state.phase =
        phase;
    return state;
}
/* ============================================================
   WEIGH-IN
============================================================ */
function processWeighIn(
    state,
    actualWeight = null
) {
    if (!state) {
        return null;
    }
    const weight =
        actualWeight === null
            ? state.currentWeight
            : safeNumber(
                actualWeight
            );
    state.currentWeight =
        round(weight);
    state.weighedIn =
        true;
    state.phase =
        WEIGHT_CUT_PHASES.WEIGH_IN;
    const limit =
        state.weighInWeight;
    const difference =
        weight -
        limit;
    const passed =
        difference <=
        0;
    state.failedWeighIn =
        !passed;
    return {
        passed,
        failed:
            !passed,
        actualWeight:
            round(weight),
        allowedWeight:
            round(limit),
        overweight:
            round(
                Math.max(
                    0,
                    difference
                )
            ),
        underweight:
            round(
                Math.max(
                    0,
                    -difference
                )
            ),
        percentageCut:
            calculateCutPercentage(
                state.naturalWeight ||
                state.currentWeight,
                limit
            )
    };
}
/* ============================================================
   POST WEIGH-IN
============================================================ */
function calculatePostWeighInWeight(
    weighInWeight,
    rehydrationPercent = DEFAULT_WEIGHT_CUT_CONFIG.defaultRehydrationPercent
) {
    const weight =
        safeNumber(
            weighInWeight
        );
    const percentage =
        clamp(
            safeNumber(
                rehydrationPercent
            ),
            0,
            20
        );
    return round(
        weight *
        (
            1 +
            percentage /
            100
        )
    );
}
function processPostWeighInRecovery(
    state,
    rehydrationPercent = DEFAULT_WEIGHT_CUT_CONFIG.defaultRehydrationPercent
) {
    if (!state) {
        return null;
    }
    const projected =
        calculatePostWeighInWeight(
            state.weighInWeight,
            rehydrationPercent
        );
    state.rehydrationWeight =
        projected;
    state.phase =
        WEIGHT_CUT_PHASES.POST_WEIGH_IN;
    return {
        weighInWeight:
            round(
                state.weighInWeight
            ),
        projectedFightWeight:
            projected,
        rehydrationPercent:
            round(
                rehydrationPercent
            )
    };
}
/* ============================================================
   FIGHT READINESS
============================================================ */
function calculateWeightCutReadiness(
    state
) {
    if (!state) {
        return {
            ready: false,
            score: 0
        };
    }
    const difference =
        Math.max(
            0,
            state.currentWeight -
            state.targetWeight
        );
    const percentage =
        calculateCutPercentage(
            state.currentWeight,
            state.targetWeight
        );
    let score = 100;
    score -=
        percentage *
        5;
    score -=
        safeNumber(
            state.dehydrationPercent
        ) *
        5;
    if (
        state.failedWeighIn
    ) {
        score -= 50;
    }
    score =
        clamp(
            score,
            0,
            100
        );
    return {
        ready:
            difference <= 0 &&
            score >= 60,
        score:
            round(score),
        weightRemaining:
            round(
                difference
            ),
        cutPercentage:
            percentage,
        risk:
            getWeightCutRisk(
                percentage
            )
    };
}
/* ============================================================
   COMPLETE CUT ANALYSIS
============================================================ */
function analyzeWeightCut(
    options = {}
) {
    const currentWeight =
        safeNumber(
            options.currentWeight
        );
    const targetWeight =
        safeNumber(
            options.targetWeight
        );
    const difference =
        calculateWeightDifference(
            currentWeight,
            targetWeight
        );
    const cutPercentage =
        calculateCutPercentage(
            currentWeight,
            targetWeight
        );
    const fightWeekPercentage =
        calculateFightWeekCutPercentage(
            currentWeight,
            safeNumber(
                options.weighInWeight,
                targetWeight
            )
        );
    const risk =
        getWeightCutRisk(
            cutPercentage
        );
    const dehydrationRisk =
        getDehydrationRisk(
            safeNumber(
                options.dehydrationPercent,
                0
            )
        );
    const healthImpact =
        calculateHealthImpact(
            cutPercentage,
            options.dehydrationPercent
        );
    const composition =
        calculateWeightComposition(
            currentWeight,
            options
        );
    const sources =
        calculateCutSources(
            currentWeight,
            targetWeight,
            options
        );
    return {
        ...difference,
        cutPercentage,
        fightWeekCutPercentage:
            fightWeekPercentage,
        risk,
        dehydrationRisk,
        healthImpact,
        composition,
        sources,
        manageable:
            risk !==
                WEIGHT_CUT_RISK.VERY_HIGH &&
            risk !==
                WEIGHT_CUT_RISK.CRITICAL
    };
}
/* ============================================================
   APPLY TO PLAYER
============================================================ */
function syncWeightCutToPlayer(
    player,
    state
) {
    if (!player || !state) {
        return null;
    }
    if (!player.training) {
        player.training = {};
    }
    if (!player.weight) {
        player.weight = {};
    }
    player.training.weight =
        state.currentWeight;
    player.training.weightCut =
        state;
    player.weight.current =
        state.currentWeight;
    player.weight.target =
        state.targetWeight;
    player.weight.weighIn =
        state.weighInWeight;
    player.weight.class =
        state.weightClass;
    return player;
}
/* ============================================================
   SNAPSHOT
============================================================ */
function getWeightCutSnapshot(
    state
) {
    if (!state) {
        return null;
    }
    const analysis =
        analyzeWeightCut({
            currentWeight:
                state.currentWeight,
            targetWeight:
                state.targetWeight,
            weighInWeight:
                state.weighInWeight,
            dehydrationPercent:
                state.dehydrationPercent
        });
    return {
        phase:
            state.phase,
        currentWeight:
            round(
                state.currentWeight
            ),
        naturalWeight:
            round(
                state.naturalWeight
            ),
        targetWeight:
            round(
                state.targetWeight
            ),
        weighInWeight:
            round(
                state.weighInWeight
            ),
        weightClass:
            state.weightClass,
        daysUntilWeighIn:
            state.daysUntilWeighIn,
        cutStarted:
            state.cutStarted,
        weighedIn:
            state.weighedIn,
        failedWeighIn:
            state.failedWeighIn,
        risk:
            analysis.risk,
        cutPercentage:
            analysis.cutPercentage,
        dehydrationPercent:
            state.dehydrationPercent,
        readiness:
            calculateWeightCutReadiness(
                state
            )
    };
}
/* ============================================================
   VALIDATION
============================================================ */
function validateWeightCutState(
    state
) {
    if (!state) {
        return false;
    }
    if (
        !Number.isFinite(
            Number(
                state.currentWeight
            )
        )
    ) {
        return false;
    }
    if (
        !Number.isFinite(
            Number(
                state.targetWeight
            )
        )
    ) {
        return false;
    }
    if (
        state.currentWeight < 0 ||
        state.targetWeight < 0
    ) {
        return false;
    }
    if (
        !Object.values(
            WEIGHT_CUT_PHASES
        ).includes(
            state.phase
        )
    ) {
        return false;
    }
    return true;
}
/* ============================================================
   CLONE
============================================================ */
function cloneWeightCutState(
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
   EXPORTS
============================================================ */
export {
    WEIGHT_CUT_PHASES,
    WEIGHT_CUT_RISK,
    WEIGHT_CUT_METHODS,
    DEFAULT_WEIGHT_CUT_CONFIG,
    getWeightClassList,
    getWeightClassLimit,
    getWeightClassByWeight,
    getNextWeightClass,
    getPreviousWeightClass,
    calculateWeightDifference,
    calculateCutPercentage,
    calculateFightWeekCutPercentage,
    getWeightCutRisk,
    getDehydrationRisk,
    calculateWeeklyWeightLossLimit,
    calculateGradualCutPlan,
    calculateFightWeekPlan,
    calculateWeightComposition,
    calculateCutSources,
    calculateHealthImpact,
    createWeightCutState,
    updateCurrentWeight,
    setTargetWeight,
    applyWeightChange,
    startWeightCut,
    advanceWeightCutPhase,
    processWeighIn,
    calculatePostWeighInWeight,
    processPostWeighInRecovery,
    calculateWeightCutReadiness,
    analyzeWeightCut,
    syncWeightCutToPlayer,
    getWeightCutSnapshot,
    validateWeightCutState,
    cloneWeightCutState
};
export default {
    WEIGHT_CUT_PHASES,
    WEIGHT_CUT_RISK,
    WEIGHT_CUT_METHODS,
    DEFAULT_WEIGHT_CUT_CONFIG,
    getWeightClassList,
    getWeightClassLimit,
    getWeightClassByWeight,
    getNextWeightClass,
    getPreviousWeightClass,
    calculateWeightDifference,
    calculateCutPercentage,
    calculateFightWeekCutPercentage,
    getWeightCutRisk,
    getDehydrationRisk,
    calculateWeeklyWeightLossLimit,
    calculateGradualCutPlan,
    calculateFightWeekPlan,
    calculateWeightComposition,
    calculateCutSources,
    calculateHealthImpact,
    createWeightCutState,
    updateCurrentWeight,
    setTargetWeight,
    applyWeightChange,
    startWeightCut,
    advanceWeightCutPhase,
    processWeighIn,
    calculatePostWeighInWeight,
    processPostWeighInRecovery,
    calculateWeightCutReadiness,
    analyzeWeightCut,
    syncWeightCutToPlayer,
    getWeightCutSnapshot,
    validateWeightCutState,
    cloneWeightCutState
};
