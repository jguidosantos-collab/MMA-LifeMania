/*
============================================================
MMA LIFE DYNASTY
FATIGUE SYSTEM
============================================================
Responsabilidade:
- Gerar fadiga através das atividades
- Acumular carga de treino
- Diferenciar energia de fadiga
- Controlar fadiga física e mental
- Calcular impacto de múltiplas sessões
- Controlar overreaching / overtraining
- Calcular penalidade de performance
- Calcular necessidade de descanso
- Integrar com training.js, camp.js e recovery.js
IMPORTANTE:
ENERGIA != FADIGA
Energia:
- recurso disponível para agir;
- normalmente 0-100;
- pode ser recuperada rapidamente.
Fadiga:
- desgaste acumulado;
- normalmente 0-100;
- pode permanecer por dias;
- reduz performance;
- aumenta risco de lesão.
Este módulo NÃO recupera fadiga.
A recuperação é responsabilidade de recovery.js.
============================================================
*/
/* ============================================================
   ACTIVITY TYPES
============================================================ */
const FATIGUE_ACTIVITY_TYPES = Object.freeze({
    MMA: "mma",
    SPARRING: "sparring",
    PAD_WORK: "padWork",
    BOXING: "boxing",
    KICKBOXING: "kickboxing",
    MUAY_THAI: "muayThai",
    WRESTLING: "wrestling",
    GRAPPLING: "grappling",
    BJJ: "bjj",
    STRENGTH: "strength",
    POWER: "power",
    OLYMPIC_LIFTING: "olympicLifting",
    CARDIO: "cardio",
    RUNNING: "running",
    INTERVALS: "intervals",
    TECHNICAL: "technical",
    GAMEPLAN: "gameplan",
    RECOVERY: "recovery",
    ACTIVE_RECOVERY: "activeRecovery",
    TRAVEL: "travel",
    MEDIA: "media",
    WORK: "work",
    STUDY: "study",
    FIGHT: "fight",
    WEIGHT_CUT: "weightCut",
    ILLNESS: "illness",
    INJURY: "injury",
    STRESS: "stress",
    OTHER: "other"
});
/* ============================================================
   FATIGUE TYPES
============================================================ */
const FATIGUE_TYPES = Object.freeze({
    PHYSICAL: "physical",
    CARDIOVASCULAR: "cardiovascular",
    NEUROMUSCULAR: "neuromuscular",
    MENTAL: "mental",
    SYSTEMIC: "systemic",
    MUSCULAR: "muscular"
});
/* ============================================================
   INTENSITY
============================================================ */
const FATIGUE_INTENSITY = Object.freeze({
    VERY_LOW: "veryLow",
    LOW: "low",
    MODERATE: "moderate",
    HIGH: "high",
    VERY_HIGH: "veryHigh",
    MAXIMAL: "maximal"
});
const INTENSITY_VALUES = Object.freeze({
    [FATIGUE_INTENSITY.VERY_LOW]: 0.15,
    [FATIGUE_INTENSITY.LOW]: 0.30,
    [FATIGUE_INTENSITY.MODERATE]: 0.50,
    [FATIGUE_INTENSITY.HIGH]: 0.70,
    [FATIGUE_INTENSITY.VERY_HIGH]: 0.85,
    [FATIGUE_INTENSITY.MAXIMAL]: 1.00
});
/* ============================================================
   FATIGUE STATES
============================================================ */
const FATIGUE_STATES = Object.freeze({
    FRESH: "fresh",
    NORMAL: "normal",
    ACCUMULATING: "accumulating",
    FATIGUED: "fatigued",
    HEAVY: "heavy",
    EXHAUSTED: "exhausted",
    OVERREACHED: "overreached",
    OVERTRAINED: "overtrained"
});
/* ============================================================
   THRESHOLDS
============================================================ */
const FATIGUE_THRESHOLDS = Object.freeze({
    FRESH: 5,
    NORMAL: 20,
    ACCUMULATING: 40,
    FATIGUED: 60,
    HEAVY: 75,
    EXHAUSTED: 90,
    OVERTRAINED: 96
});
/* ============================================================
   BASE ACTIVITY LOAD
============================================================ */
const ACTIVITY_CONFIG = Object.freeze({
    [FATIGUE_ACTIVITY_TYPES.MMA]: {
        baseLoad: 8,
        duration: 90,
        physical: 0.75,
        cardio: 0.70,
        neuromuscular: 0.65,
        mental: 0.55,
        systemic: 0.65,
        muscular: 0.55
    },
    [FATIGUE_ACTIVITY_TYPES.SPARRING]: {
        baseLoad: 11,
        duration: 90,
        physical: 0.90,
        cardio: 0.85,
        neuromuscular: 0.90,
        mental: 0.70,
        systemic: 0.85,
        muscular: 0.75
    },
    [FATIGUE_ACTIVITY_TYPES.PAD_WORK]: {
        baseLoad: 6,
        duration: 60,
        physical: 0.60,
        cardio: 0.55,
        neuromuscular: 0.65,
        mental: 0.40,
        systemic: 0.45,
        muscular: 0.55
    },
    [FATIGUE_ACTIVITY_TYPES.BOXING]: {
        baseLoad: 6,
        duration: 60,
        physical: 0.60,
        cardio: 0.60,
        neuromuscular: 0.65,
        mental: 0.45,
        systemic: 0.50,
        muscular: 0.55
    },
    [FATIGUE_ACTIVITY_TYPES.KICKBOXING]: {
        baseLoad: 7,
        duration: 60,
        physical: 0.65,
        cardio: 0.65,
        neuromuscular: 0.70,
        mental: 0.45,
        systemic: 0.55,
        muscular: 0.60
    },
    [FATIGUE_ACTIVITY_TYPES.MUAY_THAI]: {
        baseLoad: 7,
        duration: 60,
        physical: 0.70,
        cardio: 0.65,
        neuromuscular: 0.70,
        mental: 0.45,
        systemic: 0.60,
        muscular: 0.65
    },
    [FATIGUE_ACTIVITY_TYPES.WRESTLING]: {
        baseLoad: 9,
        duration: 75,
        physical: 0.80,
        cardio: 0.80,
        neuromuscular: 0.85,
        mental: 0.55,
        systemic: 0.75,
        muscular: 0.70
    },
    [FATIGUE_ACTIVITY_TYPES.GRAPPLING]: {
        baseLoad: 8,
        duration: 75,
        physical: 0.70,
        cardio: 0.65,
        neuromuscular: 0.75,
        mental: 0.55,
        systemic: 0.65,
        muscular: 0.65
    },
    [FATIGUE_ACTIVITY_TYPES.BJJ]: {
        baseLoad: 7,
        duration: 75,
        physical: 0.65,
        cardio: 0.60,
        neuromuscular: 0.75,
        mental: 0.55,
        systemic: 0.60,
        muscular: 0.60
    },
    [FATIGUE_ACTIVITY_TYPES.STRENGTH]: {
        baseLoad: 7,
        duration: 60,
        physical: 0.75,
        cardio: 0.35,
        neuromuscular: 0.85,
        mental: 0.30,
        systemic: 0.65,
        muscular: 0.90
    },
    [FATIGUE_ACTIVITY_TYPES.POWER]: {
        baseLoad: 7,
        duration: 60,
        physical: 0.70,
        cardio: 0.30,
        neuromuscular: 0.95,
        mental: 0.30,
        systemic: 0.60,
        muscular: 0.80
    },
    [FATIGUE_ACTIVITY_TYPES.OLYMPIC_LIFTING]: {
        baseLoad: 6,
        duration: 60,
        physical: 0.65,
        cardio: 0.35,
        neuromuscular: 0.90,
        mental: 0.35,
        systemic: 0.60,
        muscular: 0.70
    },
    [FATIGUE_ACTIVITY_TYPES.CARDIO]: {
        baseLoad: 6,
        duration: 60,
        physical: 0.60,
        cardio: 0.90,
        neuromuscular: 0.35,
        mental: 0.25,
        systemic: 0.70,
        muscular: 0.40
    },
    [FATIGUE_ACTIVITY_TYPES.RUNNING]: {
        baseLoad: 5,
        duration: 60,
        physical: 0.55,
        cardio: 0.85,
        neuromuscular: 0.35,
        mental: 0.25,
        systemic: 0.60,
        muscular: 0.45
    },
    [FATIGUE_ACTIVITY_TYPES.INTERVALS]: {
        baseLoad: 8,
        duration: 45,
        physical: 0.75,
        cardio: 0.95,
        neuromuscular: 0.50,
        mental: 0.35,
        systemic: 0.85,
        muscular: 0.50
    },
    [FATIGUE_ACTIVITY_TYPES.TECHNICAL]: {
        baseLoad: 3,
        duration: 60,
        physical: 0.25,
        cardio: 0.20,
        neuromuscular: 0.40,
        mental: 0.45,
        systemic: 0.20,
        muscular: 0.20
    },
    [FATIGUE_ACTIVITY_TYPES.GAMEPLAN]: {
        baseLoad: 2,
        duration: 45,
        physical: 0.10,
        cardio: 0.05,
        neuromuscular: 0.10,
        mental: 0.60,
        systemic: 0.15,
        muscular: 0.05
    },
    [FATIGUE_ACTIVITY_TYPES.RECOVERY]: {
        baseLoad: -2,
        duration: 30,
        physical: 0.05,
        cardio: 0.05,
        neuromuscular: 0.05,
        mental: 0.05,
        systemic: 0.05,
        muscular: 0.05
    },
    [FATIGUE_ACTIVITY_TYPES.ACTIVE_RECOVERY]: {
        baseLoad: -1,
        duration: 30,
        physical: 0.10,
        cardio: 0.15,
        neuromuscular: 0.05,
        mental: 0.05,
        systemic: 0.10,
        muscular: 0.10
    },
    [FATIGUE_ACTIVITY_TYPES.TRAVEL]: {
        baseLoad: 3,
        duration: 180,
        physical: 0.15,
        cardio: 0.05,
        neuromuscular: 0.05,
        mental: 0.50,
        systemic: 0.35,
        muscular: 0.05
    },
    [FATIGUE_ACTIVITY_TYPES.MEDIA]: {
        baseLoad: 2,
        duration: 60,
        physical: 0.05,
        cardio: 0.02,
        neuromuscular: 0.05,
        mental: 0.50,
        systemic: 0.10,
        muscular: 0.02
    },
    [FATIGUE_ACTIVITY_TYPES.WORK]: {
        baseLoad: 3,
        duration: 240,
        physical: 0.15,
        cardio: 0.10,
        neuromuscular: 0.10,
        mental: 0.60,
        systemic: 0.30,
        muscular: 0.10
    },
    [FATIGUE_ACTIVITY_TYPES.STUDY]: {
        baseLoad: 2,
        duration: 180,
        physical: 0.02,
        cardio: 0.01,
        neuromuscular: 0.02,
        mental: 0.65,
        systemic: 0.15,
        muscular: 0.01
    },
    [FATIGUE_ACTIVITY_TYPES.FIGHT]: {
        baseLoad: 25,
        duration: 25,
        physical: 1.00,
        cardio: 1.00,
        neuromuscular: 1.00,
        mental: 0.90,
        systemic: 1.00,
        muscular: 0.95
    },
    [FATIGUE_ACTIVITY_TYPES.WEIGHT_CUT]: {
        baseLoad: 10,
        duration: 120,
        physical: 0.65,
        cardio: 0.40,
        neuromuscular: 0.25,
        mental: 0.60,
        systemic: 1.00,
        muscular: 0.30
    },
    [FATIGUE_ACTIVITY_TYPES.ILLNESS]: {
        baseLoad: 12,
        duration: 1440,
        physical: 0.60,
        cardio: 0.30,
        neuromuscular: 0.20,
        mental: 0.40,
        systemic: 1.00,
        muscular: 0.20
    },
    [FATIGUE_ACTIVITY_TYPES.INJURY]: {
        baseLoad: 15,
        duration: 1440,
        physical: 0.80,
        cardio: 0.10,
        neuromuscular: 0.30,
        mental: 0.55,
        systemic: 0.90,
        muscular: 0.80
    },
    [FATIGUE_ACTIVITY_TYPES.STRESS]: {
        baseLoad: 5,
        duration: 1440,
        physical: 0.05,
        cardio: 0.02,
        neuromuscular: 0.05,
        mental: 0.90,
        systemic: 0.50,
        muscular: 0.01
    },
    [FATIGUE_ACTIVITY_TYPES.OTHER]: {
        baseLoad: 3,
        duration: 60,
        physical: 0.30,
        cardio: 0.20,
        neuromuscular: 0.20,
        mental: 0.25,
        systemic: 0.25,
        muscular: 0.20
    }
});
/* ============================================================
   UTILITIES
============================================================ */
function clamp(value, min, max) {
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
function getIntensityValue(
    intensity
) {
    return (
        INTENSITY_VALUES[intensity] ??
        INTENSITY_VALUES[
            FATIGUE_INTENSITY.MODERATE
        ]
    );
}
function getActivityConfig(
    activity
) {
    return (
        ACTIVITY_CONFIG[activity] ||
        ACTIVITY_CONFIG[
            FATIGUE_ACTIVITY_TYPES.OTHER
        ]
    );
}
/* ============================================================
   FATIGUE STATE
============================================================ */
function getFatigueState(
    fatigue
) {
    const value =
        clamp(
            safeNumber(fatigue),
            0,
            100
        );
    if (
        value >=
        FATIGUE_THRESHOLDS.OVERTRAINED
    ) {
        return FATIGUE_STATES.OVERTRAINED;
    }
    if (
        value >=
        FATIGUE_THRESHOLDS.EXHAUSTED
    ) {
        return FATIGUE_STATES.EXHAUSTED;
    }
    if (
        value >=
        FATIGUE_THRESHOLDS.HEAVY
    ) {
        return FATIGUE_STATES.HEAVY;
    }
    if (
        value >=
        FATIGUE_THRESHOLDS.FATIGUED
    ) {
        return FATIGUE_STATES.FATIGUED;
    }
    if (
        value >=
        FATIGUE_THRESHOLDS.ACCUMULATING
    ) {
        return FATIGUE_STATES.ACCUMULATING;
    }
    if (
        value >=
        FATIGUE_THRESHOLDS.NORMAL
    ) {
        return FATIGUE_STATES.NORMAL;
    }
    return FATIGUE_STATES.FRESH;
}
/* ============================================================
   BASE LOAD
============================================================ */
function calculateActivityFatigue(
    activity,
    options = {}
) {
    const config =
        getActivityConfig(
            activity
        );
    const intensity =
        getIntensityValue(
            options.intensity ||
            FATIGUE_INTENSITY.MODERATE
        );
    const duration =
        Math.max(
            1,
            safeNumber(
                options.duration,
                config.duration
            )
        );
    const durationMultiplier =
        clamp(
            duration /
            config.duration,
            0.25,
            3
        );
    const campMultiplier =
        clamp(
            safeNumber(
                options.campMultiplier,
                1
            ),
            0.50,
            1.50
        );
    const athleteModifier =
        clamp(
            safeNumber(
                options.athleteModifier,
                1
            ),
            0.50,
            1.50
        );
    const fatigueMultiplier =
        clamp(
            safeNumber(
                options.fatigueMultiplier,
                1
            ),
            0.50,
            1.75
        );
    const sessionsToday =
        Math.max(
            1,
            Math.round(
                safeNumber(
                    options.sessionsToday,
                    1
                )
            )
        );
    /*
     * Multiple sessions create a small additional
     * systemic cost. The second and third sessions
     * are not treated as completely independent.
     */
    const multiSessionMultiplier =
        1 +
        Math.max(
            0,
            sessionsToday - 1
        ) * 0.08;
    const rawLoad =
        config.baseLoad *
        intensity *
        durationMultiplier *
        campMultiplier *
        athleteModifier *
        fatigueMultiplier *
        multiSessionMultiplier;
    /*
     * Recovery activities can reduce accumulated fatigue.
     */
    if (
        config.baseLoad < 0
    ) {
        return {
            total: -Math.abs(rawLoad),
            physical:
                -Math.abs(
                    rawLoad *
                    config.physical
                ),
            cardiovascular:
                -Math.abs(
                    rawLoad *
                    config.cardio
                ),
            neuromuscular:
                -Math.abs(
                    rawLoad *
                    config.neuromuscular
                ),
            mental:
                -Math.abs(
                    rawLoad *
                    config.mental
                ),
            systemic:
                -Math.abs(
                    rawLoad *
                    config.systemic
                ),
            muscular:
                -Math.abs(
                    rawLoad *
                    config.muscular
                )
        };
    }
    return {
        total: rawLoad,
        physical:
            rawLoad *
            config.physical,
        cardiovascular:
            rawLoad *
            config.cardio,
        neuromuscular:
            rawLoad *
            config.neuromuscular,
        mental:
            rawLoad *
            config.mental,
        systemic:
            rawLoad *
            config.systemic,
        muscular:
            rawLoad *
            config.muscular
    };
}
/* ============================================================
   MULTIPLE SESSIONS
============================================================ */
function calculateMultiSessionPenalty(
    sessionCount
) {
    const count =
        Math.max(
            0,
            Math.round(
                safeNumber(
                    sessionCount,
                    0
                )
            )
        );
    if (count <= 1) {
        return 0;
    }
    if (count === 2) {
        return 0.05;
    }
    if (count === 3) {
        return 0.12;
    }
    if (count === 4) {
        return 0.20;
    }
    return clamp(
        0.20 +
        (
            count - 4
        ) * 0.08,
        0,
        0.50
    );
}
function calculateSessionSequencePenalty(
    sessions = []
) {
    if (!Array.isArray(sessions)) {
        return 0;
    }
    let penalty = 0;
    sessions.forEach(
        session => {
            const intensity =
                getIntensityValue(
                    session.intensity ||
                    FATIGUE_INTENSITY.MODERATE
                );
            const activity =
                session.activity;
            if (
                activity ===
                FATIGUE_ACTIVITY_TYPES.SPARRING
            ) {
                penalty +=
                    intensity *
                    0.03;
            }
            if (
                activity ===
                FATIGUE_ACTIVITY_TYPES.FIGHT
            ) {
                penalty += 0.15;
            }
        }
    );
    return clamp(
        penalty,
        0,
        0.50
    );
}
/* ============================================================
   DAILY LOAD
============================================================ */
function calculateDailyFatigueLoad(
    sessions = [],
    options = {}
) {
    if (!Array.isArray(sessions)) {
        return {
            total: 0,
            physical: 0,
            cardiovascular: 0,
            neuromuscular: 0,
            mental: 0,
            systemic: 0,
            muscular: 0,
            sessionCount: 0
        };
    }
    const sessionCount =
        sessions.length;
    const multiPenalty =
        calculateMultiSessionPenalty(
            sessionCount
        );
    const sequencePenalty =
        calculateSessionSequencePenalty(
            sessions
        );
    const totals = {
        total: 0,
        physical: 0,
        cardiovascular: 0,
        neuromuscular: 0,
        mental: 0,
        systemic: 0,
        muscular: 0,
        sessionCount
    };
    sessions.forEach(
        session => {
            const load =
                calculateActivityFatigue(
                    session.activity ||
                    FATIGUE_ACTIVITY_TYPES.OTHER,
                    {
                        ...session,
                        sessionsToday:
                            sessionCount
                    }
                );
            totals.total +=
                load.total;
            totals.physical +=
                load.physical;
            totals.cardiovascular +=
                load.cardiovascular;
            totals.neuromuscular +=
                load.neuromuscular;
            totals.mental +=
                load.mental;
            totals.systemic +=
                load.systemic;
            totals.muscular +=
                load.muscular;
        }
    );
    const combinedPenalty =
        1 +
        multiPenalty +
        sequencePenalty;
    totals.total *=
        combinedPenalty;
    totals.physical *=
        combinedPenalty;
    totals.cardiovascular *=
        combinedPenalty;
    totals.neuromuscular *=
        combinedPenalty;
    totals.mental *=
        combinedPenalty;
    totals.systemic *=
        combinedPenalty;
    totals.muscular *=
        combinedPenalty;
    /*
     * A day with many hard sessions should
     * have an additional systemic cost.
     */
    if (
        sessionCount >= 3
    ) {
        const overload =
            (
                sessionCount - 2
            ) * 1.5;
        totals.systemic +=
            overload;
        totals.total +=
            overload;
    }
    if (
        options.camp
    ) {
        const campIntensity =
            getIntensityValue(
                options.campIntensity ||
                FATIGUE_INTENSITY.MODERATE
            );
        totals.total *=
            1 +
            campIntensity * 0.05;
    }
    return {
        total: round(
            totals.total
        ),
        physical: round(
            totals.physical
        ),
        cardiovascular: round(
            totals.cardiovascular
        ),
        neuromuscular: round(
            totals.neuromuscular
        ),
        mental: round(
            totals.mental
        ),
        systemic: round(
            totals.systemic
        ),
        muscular: round(
            totals.muscular
        ),
        sessionCount
    };
}
/* ============================================================
   APPLY FATIGUE
============================================================ */
function applyFatigue(
    player,
    load
) {
    if (!player) {
        return null;
    }
    if (!player.training) {
        player.training = {};
    }
    const current =
        clamp(
            safeNumber(
                player.training.fatigue,
                0
            ),
            0,
            100
        );
    const amount =
        safeNumber(
            typeof load === "number"
                ? load
                : load?.total,
            0
        );
    player.training.fatigue =
        clamp(
            current + amount,
            0,
            100
        );
    if (
        Object.prototype.hasOwnProperty.call(
            player,
            "fatigue"
        )
    ) {
        player.fatigue =
            player.training.fatigue;
    }
    return {
        previous: current,
        added: amount,
        current:
            player.training.fatigue,
        state:
            getFatigueState(
                player.training.fatigue
            )
    };
}
/* ============================================================
   FATIGUE FROM SINGLE SESSION
============================================================ */
function applySessionFatigue(
    player,
    activity,
    options = {}
) {
    const load =
        calculateActivityFatigue(
            activity,
            options
        );
    const result =
        applyFatigue(
            player,
            load
        );
    return {
        load,
        result
    };
}
/* ============================================================
   PERFORMANCE PENALTY
============================================================ */
function calculateFatiguePerformancePenalty(
    fatigue
) {
    const value =
        clamp(
            safeNumber(fatigue),
            0,
            100
        );
    if (
        value < 20
    ) {
        return 0;
    }
    if (
        value < 40
    ) {
        return (
            value - 20
        ) * 0.05;
    }
    if (
        value < 60
    ) {
        return (
            1 +
            (
                value - 40
            ) * 0.12
        );
    }
    if (
        value < 75
    ) {
        return (
            3.4 +
            (
                value - 60
            ) * 0.20
        );
    }
    if (
        value < 90
    ) {
        return (
            6.4 +
            (
                value - 75
            ) * 0.30
        );
    }
    return clamp(
        10.9 +
        (
            value - 90
        ) * 0.50,
        0,
        20
    );
}
function calculatePerformanceMultiplier(
    fatigue
) {
    const penalty =
        calculateFatiguePerformancePenalty(
            fatigue
        );
    return clamp(
        1 -
        (
            penalty / 100
        ),
        0.80,
        1
    );
}
/* ============================================================
   FIGHT PERFORMANCE
============================================================ */
function calculateFightFatiguePenalty(
    fatigue,
    round = 1
) {
    const basePenalty =
        calculateFatiguePerformancePenalty(
            fatigue
        );
    /*
     * Fatigue matters more as the fight goes deeper.
     */
    const roundMultiplier =
        1 +
        (
            Math.max(
                0,
                safeNumber(round, 1) - 1
            ) * 0.08
        );
    return clamp(
        basePenalty *
        roundMultiplier,
        0,
        25
    );
}
/* ============================================================
   CARDIO / ENDURANCE IMPACT
============================================================ */
function calculateCardioPenalty(
    fatigue
) {
    const value =
        clamp(
            safeNumber(fatigue),
            0,
            100
        );
    if (value < 30) {
        return 0;
    }
    return clamp(
        (
            value - 30
        ) * 0.30,
        0,
        25
    );
}
function calculateNeuromuscularPenalty(
    fatigue
) {
    const value =
        clamp(
            safeNumber(fatigue),
            0,
            100
        );
    if (value < 40) {
        return 0;
    }
    return clamp(
        (
            value - 40
        ) * 0.25,
        0,
        20
    );
}
function calculateMentalPenalty(
    fatigue
) {
    const value =
        clamp(
            safeNumber(fatigue),
            0,
            100
        );
    if (value < 30) {
        return 0;
    }
    return clamp(
        (
            value - 30
        ) * 0.20,
        0,
        18
    );
}
/* ============================================================
   OVERREACHING / OVERTRAINING
============================================================ */
function isOverreached(
    fatigue
) {
    return (
        safeNumber(fatigue) >=
        FATIGUE_THRESHOLDS.HEAVY
    );
}
function isOvertrained(
    fatigue
) {
    return (
        safeNumber(fatigue) >=
        FATIGUE_THRESHOLDS.OVERTRAINED
    );
}
function calculateOvertrainingRisk(
    options = {}
) {
    const fatigue =
        clamp(
            safeNumber(
                options.fatigue,
                0
            ),
            0,
            100
        );
    const trainingLoad =
        clamp(
            safeNumber(
                options.trainingLoad,
                0
            ),
            0,
            200
        );
    const recoveryQuality =
        clamp(
            safeNumber(
                options.recoveryQuality,
                80
            ),
            0,
            100
        );
    const sleepHours =
        clamp(
            safeNumber(
                options.sleepHours,
                8
            ),
            0,
            24
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
    let risk = 0;
    if (fatigue >= 60) {
        risk +=
            (
                fatigue - 60
            ) * 0.008;
    }
    if (trainingLoad >= 70) {
        risk +=
            (
                trainingLoad - 70
            ) * 0.003;
    }
    if (recoveryQuality < 60) {
        risk +=
            (
                60 -
                recoveryQuality
            ) * 0.006;
    }
    if (sleepHours < 7) {
        risk +=
            (
                7 -
                sleepHours
            ) * 0.025;
    }
    if (stress > 60) {
        risk +=
            (
                stress - 60
            ) * 0.004;
    }
    return clamp(
        risk,
        0,
        0.95
    );
}
/* ============================================================
   DAILY FATIGUE PROFILE
============================================================ */
function createDailyFatigueProfile() {
    return {
        total: 0,
        physical: 0,
        cardiovascular: 0,
        neuromuscular: 0,
        mental: 0,
        systemic: 0,
        muscular: 0,
        sessionCount: 0,
        highestIntensity:
            FATIGUE_INTENSITY.VERY_LOW,
        overreachingRisk: 0,
        overtrainingRisk: 0
    };
}
function buildDailyFatigueProfile(
    sessions = [],
    options = {}
) {
    const profile =
        createDailyFatigueProfile();
    const load =
        calculateDailyFatigueLoad(
            sessions,
            options
        );
    profile.total =
        load.total;
    profile.physical =
        load.physical;
    profile.cardiovascular =
        load.cardiovascular;
    profile.neuromuscular =
        load.neuromuscular;
    profile.mental =
        load.mental;
    profile.systemic =
        load.systemic;
    profile.muscular =
        load.muscular;
    profile.sessionCount =
        load.sessionCount;
    let highestIntensity =
        0;
    sessions.forEach(
        session => {
            const value =
                getIntensityValue(
                    session.intensity ||
                    FATIGUE_INTENSITY.MODERATE
                );
            highestIntensity =
                Math.max(
                    highestIntensity,
                    value
                );
        }
    );
    if (
        highestIntensity >= 1
    ) {
        profile.highestIntensity =
            FATIGUE_INTENSITY.MAXIMAL;
    } else if (
        highestIntensity >= 0.85
    ) {
        profile.highestIntensity =
            FATIGUE_INTENSITY.VERY_HIGH;
    } else if (
        highestIntensity >= 0.70
    ) {
        profile.highestIntensity =
            FATIGUE_INTENSITY.HIGH;
    } else if (
        highestIntensity >= 0.50
    ) {
        profile.highestIntensity =
            FATIGUE_INTENSITY.MODERATE;
    } else if (
        highestIntensity >= 0.30
    ) {
        profile.highestIntensity =
            FATIGUE_INTENSITY.LOW;
    } else {
        profile.highestIntensity =
            FATIGUE_INTENSITY.VERY_LOW;
    }
    const currentFatigue =
        safeNumber(
            options.currentFatigue,
            0
        );
    profile.overreachingRisk =
        clamp(
            currentFatigue >= 60
                ? (
                    (
                        currentFatigue - 60
                    ) / 40
                )
                : 0,
            0,
            1
        );
    profile.overtrainingRisk =
        calculateOvertrainingRisk({
            fatigue:
                currentFatigue +
                load.total,
            trainingLoad:
                options.trainingLoad ||
                load.total,
            recoveryQuality:
                options.recoveryQuality,
            sleepHours:
                options.sleepHours,
            stress:
                options.stress
        });
    return profile;
}
/* ============================================================
   REST REQUIREMENT
============================================================ */
function calculateRestRequirement(
    options = {}
) {
    const fatigue =
        clamp(
            safeNumber(
                options.fatigue,
                0
            ),
            0,
            100
        );
    const trainingLoad =
        Math.max(
            0,
            safeNumber(
                options.trainingLoad,
                0
            )
        );
    const injury =
        clamp(
            safeNumber(
                options.injury,
                0
            ),
            0,
            100
        );
    const sleep =
        clamp(
            safeNumber(
                options.sleepHours,
                8
            ),
            0,
            24
        );
    let hours = 0;
    if (fatigue >= 90) {
        hours += 48;
    } else if (fatigue >= 75) {
        hours += 24;
    } else if (fatigue >= 60) {
        hours += 16;
    } else if (fatigue >= 40) {
        hours += 8;
    } else if (fatigue >= 20) {
        hours += 4;
    }
    if (trainingLoad >= 80) {
        hours += 12;
    } else if (trainingLoad >= 50) {
        hours += 6;
    }
    if (injury >= 50) {
        hours += 24;
    }
    if (sleep < 6) {
        hours +=
            (
                6 -
                sleep
            ) * 3;
    }
    return {
        recommendedHours:
            Math.round(
                clamp(
                    hours,
                    0,
                    96
                )
            ),
        recommendedDays:
            Math.ceil(
                hours / 24
            ),
        fullRest:
            hours >= 24
    };
}
/* ============================================================
   TRAINING SAFETY
============================================================ */
function canTrainAtIntensity(
    fatigue,
    intensity
) {
    const value =
        clamp(
            safeNumber(fatigue),
            0,
            100
        );
    const intensityValue =
        getIntensityValue(
            intensity
        );
    if (
        value >= 96
    ) {
        return false;
    }
    if (
        value >= 90 &&
        intensityValue > 0.30
    ) {
        return false;
    }
    if (
        value >= 75 &&
        intensityValue > 0.50
    ) {
        return false;
    }
    if (
        value >= 60 &&
        intensityValue > 0.70
    ) {
        return false;
    }
    return true;
}
function getMaximumRecommendedIntensity(
    fatigue
) {
    const value =
        clamp(
            safeNumber(fatigue),
            0,
            100
        );
    if (value >= 96) {
        return null;
    }
    if (value >= 90) {
        return FATIGUE_INTENSITY.LOW;
    }
    if (value >= 75) {
        return FATIGUE_INTENSITY.MODERATE;
    }
    if (value >= 60) {
        return FATIGUE_INTENSITY.HIGH;
    }
    return FATIGUE_INTENSITY.MAXIMAL;
}
/* ============================================================
   TRAINING LOAD INDEX
============================================================ */
function calculateTrainingLoadIndex(
    dailyLoad,
    previousLoad = 0
) {
    const current =
        Math.max(
            0,
            safeNumber(
                dailyLoad
            )
        );
    const previous =
        Math.max(
            0,
            safeNumber(
                previousLoad
            )
        );
    /*
     * Simple monotonic load index.
     * Later this can become an ACWR-style model.
     */
    const acuteLoad =
        current;
    const chronicReference =
        Math.max(
            1,
            previous
        );
    return {
        acuteLoad:
            round(
                acuteLoad
            ),
        previousLoad:
            round(
                previous
            ),
        ratio:
            round(
                acuteLoad /
                chronicReference,
                3
            )
    };
}
/* ============================================================
   WEEKLY FATIGUE
============================================================ */
function calculateWeeklyFatigueLoad(
    dailyProfiles = []
) {
    if (!Array.isArray(dailyProfiles)) {
        return {
            total: 0,
            average: 0,
            highestDay: 0,
            trainingDays: 0
        };
    }
    const values =
        dailyProfiles.map(
            profile =>
                Math.max(
                    0,
                    safeNumber(
                        profile.total
                    )
                )
        );
    const total =
        values.reduce(
            (sum, value) =>
                sum + value,
            0
        );
    return {
        total:
            round(total),
        average:
            round(
                values.length
                    ? total / values.length
                    : 0
            ),
        highestDay:
            round(
                values.length
                    ? Math.max(...values)
                    : 0
            ),
        trainingDays:
            values.filter(
                value =>
                    value > 0
            ).length
    };
}
/* ============================================================
   FATIGUE SNAPSHOT
============================================================ */
function getFatigueSnapshot(
    player
) {
    if (!player) {
        return null;
    }
    const fatigue =
        clamp(
            safeNumber(
                player.training?.fatigue,
                player.fatigue || 0
            ),
            0,
            100
        );
    const penalty =
        calculateFatiguePerformancePenalty(
            fatigue
        );
    return {
        value:
            round(fatigue),
        state:
            getFatigueState(
                fatigue
            ),
        performancePenalty:
            round(penalty),
        performanceMultiplier:
            round(
                calculatePerformanceMultiplier(
                    fatigue
                ),
                4
            ),
        cardioPenalty:
            round(
                calculateCardioPenalty(
                    fatigue
                )
            ),
        neuromuscularPenalty:
            round(
                calculateNeuromuscularPenalty(
                    fatigue
                )
            ),
        mentalPenalty:
            round(
                calculateMentalPenalty(
                    fatigue
                )
            ),
        overreached:
            isOverreached(
                fatigue
            ),
        overtrained:
            isOvertrained(
                fatigue
            ),
        maximumRecommendedIntensity:
            getMaximumRecommendedIntensity(
                fatigue
            ),
        restRequirement:
            calculateRestRequirement({
                fatigue
            })
    };
}
/* ============================================================
   VALIDATION
============================================================ */
function validateFatigueValue(
    fatigue
) {
    const value =
        Number(fatigue);
    return (
        Number.isFinite(value) &&
        value >= 0 &&
        value <= 100
    );
}
/* ============================================================
   CLONE
============================================================ */
function cloneFatigueProfile(
    profile
) {
    if (!profile) {
        return null;
    }
    return JSON.parse(
        JSON.stringify(profile)
    );
}
/* ============================================================
   DEFAULT EXPORT
============================================================ */
export {
    FATIGUE_ACTIVITY_TYPES,
    FATIGUE_TYPES,
    FATIGUE_INTENSITY,
    INTENSITY_VALUES,
    FATIGUE_STATES,
    FATIGUE_THRESHOLDS,
    ACTIVITY_CONFIG,
    getIntensityValue,
    getActivityConfig,
    getFatigueState,
    calculateActivityFatigue,
    calculateMultiSessionPenalty,
    calculateSessionSequencePenalty,
    calculateDailyFatigueLoad,
    applyFatigue,
    applySessionFatigue,
    calculateFatiguePerformancePenalty,
    calculatePerformanceMultiplier,
    calculateFightFatiguePenalty,
    calculateCardioPenalty,
    calculateNeuromuscularPenalty,
    calculateMentalPenalty,
    isOverreached,
    isOvertrained,
    calculateOvertrainingRisk,
    createDailyFatigueProfile,
    buildDailyFatigueProfile,
    calculateRestRequirement,
    canTrainAtIntensity,
    getMaximumRecommendedIntensity,
    calculateTrainingLoadIndex,
    calculateWeeklyFatigueLoad,
    getFatigueSnapshot,
    validateFatigueValue,
    cloneFatigueProfile
};
export default {
    FATIGUE_ACTIVITY_TYPES,
    FATIGUE_TYPES,
    FATIGUE_INTENSITY,
    INTENSITY_VALUES,
    FATIGUE_STATES,
    FATIGUE_THRESHOLDS,
    ACTIVITY_CONFIG,
    getIntensityValue,
    getActivityConfig,
    getFatigueState,
    calculateActivityFatigue,
    calculateMultiSessionPenalty,
    calculateSessionSequencePenalty,
    calculateDailyFatigueLoad,
    applyFatigue,
    applySessionFatigue,
    calculateFatiguePerformancePenalty,
    calculatePerformanceMultiplier,
    calculateFightFatiguePenalty,
    calculateCardioPenalty,
    calculateNeuromuscularPenalty,
    calculateMentalPenalty,
    isOverreached,
    isOvertrained,
    calculateOvertrainingRisk,
    createDailyFatigueProfile,
    buildDailyFatigueProfile,
    calculateRestRequirement,
    canTrainAtIntensity,
    getMaximumRecommendedIntensity,
    calculateTrainingLoadIndex,
    calculateWeeklyFatigueLoad,
    getFatigueSnapshot,
    validateFatigueValue,
    cloneFatigueProfile
};
