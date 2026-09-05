// ============================================================
// MMA LIFE DYNASTY
// TRAINING — CORE SYSTEM
// ============================================================
//
// Responsabilidade:
// - Gerenciar energia
// - Gerenciar fadiga
// - Executar sessões de treino
// - Calcular carga de treinamento
// - Gerar desenvolvimento
// - Aplicar recuperação
// - Interagir com personalidade
// - Interagir com saúde
// - Preparar integração com Training Camp
//
// IMPORTANTE:
// Este módulo NÃO controla calendário.
// Este módulo NÃO executa lutas.
// Este módulo controla apenas treinamento e recuperação.
// ============================================================


// ============================================================
// CONFIGURAÇÕES
// ============================================================

export const TRAINING_CONFIG = {

    MAX_ENERGY: 100,

    MIN_ENERGY: 0,

    MAX_FATIGUE: 100,

    MIN_FATIGUE: 0,

    BASE_RECOVERY_PER_DAY: 18,

    SLEEP_RECOVERY_BONUS: 12,

    REST_RECOVERY_BONUS: 10,

    MAX_SESSIONS_PER_DAY: 6,

    MIN_SESSION_ENERGY: 5,

    MAX_SESSION_ENERGY: 40,

    MAX_WEEKLY_LOAD: 100,

    OVERTRAINING_THRESHOLD: 85,

    HIGH_FATIGUE_THRESHOLD: 70,

    CRITICAL_FATIGUE_THRESHOLD: 90
};


// ============================================================
// TIPOS DE TREINO
// ============================================================

export const TRAINING_TYPES = {

    STRIKING: "striking",

    BOXING: "boxing",

    KICKBOXING: "kickboxing",

    MUAY_THAI: "muay_thai",

    WRESTLING: "wrestling",

    TAKEDOWN: "takedown",

    GRAPPLING: "grappling",

    BJJ: "bjj",

    SUBMISSIONS: "submissions",

    GROUND_AND_POUND: "ground_and_pound",

    DEFENSE: "defense",

    FOOTWORK: "footwork",

    SPEED: "speed",

    POWER: "power",

    STRENGTH: "strength",

    CONDITIONING: "conditioning",

    CARDIO: "cardio",

    SPARRING: "sparring",

    MMA: "mma",

    TECHNICAL: "technical",

    RECOVERY: "recovery",

    REST: "rest"
};


// ============================================================
// CATEGORIAS
// ============================================================

export const TRAINING_CATEGORIES = {

    TECHNICAL: "technical",

    PHYSICAL: "physical",

    MENTAL: "mental",

    MMA: "mma",

    RECOVERY: "recovery"
};


// ============================================================
// LIMITES
// ============================================================

const MIN_VALUE = 0;
const MAX_VALUE = 100;


// ============================================================
// UTILITÁRIOS
// ============================================================

function clamp(
    value,
    min = MIN_VALUE,
    max = MAX_VALUE
) {

    const number =
        Number(value);

    if (
        !Number.isFinite(number)
    ) {

        return min;
    }

    return Math.max(
        min,
        Math.min(
            max,
            number
        )
    );
}


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


function generateId(
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


// ============================================================
// DEFINIÇÃO DOS TREINOS
// ============================================================

export const TRAINING_DEFINITIONS = {

    [TRAINING_TYPES.STRIKING]: {

        name: "Striking",

        category:
            TRAINING_CATEGORIES.TECHNICAL,

        energyCost: 15,

        fatigue: 10,

        baseDevelopment: 1.2,

        attributes: [
            "jab",
            "cross",
            "hook",
            "uppercut",
            "combinations",
            "precision",
            "standupDefense"
        ]
    },


    [TRAINING_TYPES.BOXING]: {

        name: "Boxing",

        category:
            TRAINING_CATEGORIES.TECHNICAL,

        energyCost: 14,

        fatigue: 9,

        baseDevelopment: 1.2,

        attributes: [
            "jab",
            "cross",
            "hook",
            "uppercut",
            "combinations",
            "precision",
            "standupDefense"
        ]
    },


    [TRAINING_TYPES.KICKBOXING]: {

        name: "Kickboxing",

        category:
            TRAINING_CATEGORIES.TECHNICAL,

        energyCost: 16,

        fatigue: 11,

        baseDevelopment: 1.25,

        attributes: [
            "kicks",
            "knees",
            "combinations",
            "precision",
            "standupDefense"
        ]
    },


    [TRAINING_TYPES.MUAY_THAI]: {

        name: "Muay Thai",

        category:
            TRAINING_CATEGORIES.TECHNICAL,

        energyCost: 17,

        fatigue: 12,

        baseDevelopment: 1.25,

        attributes: [
            "kicks",
            "knees",
            "elbows",
            "clinch"
        ]
    },


    [TRAINING_TYPES.WRESTLING]: {

        name: "Wrestling",

        category:
            TRAINING_CATEGORIES.TECHNICAL,

        energyCost: 18,

        fatigue: 13,

        baseDevelopment: 1.3,

        attributes: [
            "wrestling",
            "takedown",
            "takedownDefense",
            "scramble",
            "control"
        ]
    },


    [TRAINING_TYPES.TAKEDOWN]: {

        name: "Takedown Training",

        category:
            TRAINING_CATEGORIES.TECHNICAL,

        energyCost: 14,

        fatigue: 10,

        baseDevelopment: 1.25,

        attributes: [
            "takedown",
            "takedownDefense",
            "wrestling"
        ]
    },


    [TRAINING_TYPES.GRAPPLING]: {

        name: "Grappling",

        category:
            TRAINING_CATEGORIES.TECHNICAL,

        energyCost: 16,

        fatigue: 12,

        baseDevelopment: 1.25,

        attributes: [
            "control",
            "scramble",
            "grappling"
        ]
    },


    [TRAINING_TYPES.BJJ]: {

        name: "Brazilian Jiu-Jitsu",

        category:
            TRAINING_CATEGORIES.TECHNICAL,

        energyCost: 15,

        fatigue: 10,

        baseDevelopment: 1.3,

        attributes: [
            "jiuJitsu",
            "submissions",
            "submissionDefense"
        ]
    },


    [TRAINING_TYPES.SUBMISSIONS]: {

        name: "Submission Training",

        category:
            TRAINING_CATEGORIES.TECHNICAL,

        energyCost: 14,

        fatigue: 9,

        baseDevelopment: 1.25,

        attributes: [
            "submissions",
            "submissionDefense",
            "jiuJitsu"
        ]
    },


    [TRAINING_TYPES.GROUND_AND_POUND]: {

        name: "Ground and Pound",

        category:
            TRAINING_CATEGORIES.TECHNICAL,

        energyCost: 16,

        fatigue: 12,

        baseDevelopment: 1.25,

        attributes: [
            "gnp",
            "control",
            "groundAndPound"
        ]
    },


    [TRAINING_TYPES.DEFENSE]: {

        name: "Defense",

        category:
            TRAINING_CATEGORIES.TECHNICAL,

        energyCost: 13,

        fatigue: 8,

        baseDevelopment: 1.1,

        attributes: [
            "standupDefense",
            "takedownDefense",
            "submissionDefense"
        ]
    },


    [TRAINING_TYPES.FOOTWORK]: {

        name: "Footwork",

        category:
            TRAINING_CATEGORIES.TECHNICAL,

        energyCost: 12,

        fatigue: 8,

        baseDevelopment: 1.15,

        attributes: [
            "speed",
            "precision",
            "distanceSense"
        ]
    },


    [TRAINING_TYPES.SPEED]: {

        name: "Speed",

        category:
            TRAINING_CATEGORIES.PHYSICAL,

        energyCost: 15,

        fatigue: 12,

        baseDevelopment: 1.15,

        attributes: [
            "speed",
            "reactionSpeed",
            "explosiveness"
        ]
    },


    [TRAINING_TYPES.POWER]: {

        name: "Power",

        category:
            TRAINING_CATEGORIES.PHYSICAL,

        energyCost: 17,

        fatigue: 14,

        baseDevelopment: 1.1,

        attributes: [
            "power",
            "strength",
            "explosiveness"
        ]
    },


    [TRAINING_TYPES.STRENGTH]: {

        name: "Strength",

        category:
            TRAINING_CATEGORIES.PHYSICAL,

        energyCost: 18,

        fatigue: 15,

        baseDevelopment: 1.1,

        attributes: [
            "strength",
            "explosiveness"
        ]
    },


    [TRAINING_TYPES.CONDITIONING]: {

        name: "Conditioning",

        category:
            TRAINING_CATEGORIES.PHYSICAL,

        energyCost: 16,

        fatigue: 14,

        baseDevelopment: 1.15,

        attributes: [
            "cardio",
            "endurance",
            "recovery"
        ]
    },


    [TRAINING_TYPES.CARDIO]: {

        name: "Cardio",

        category:
            TRAINING_CATEGORIES.PHYSICAL,

        energyCost: 15,

        fatigue: 12,

        baseDevelopment: 1.2,

        attributes: [
            "cardio",
            "endurance"
        ]
    },


    [TRAINING_TYPES.SPARRING]: {

        name: "Sparring",

        category:
            TRAINING_CATEGORIES.MMA,

        energyCost: 22,

        fatigue: 20,

        baseDevelopment: 1.4,

        attributes: [
            "fightIQ",
            "adaptability",
            "experience",
            "standupDefense",
            "takedownDefense"
        ]
    },


    [TRAINING_TYPES.MMA]: {

        name: "MMA",

        category:
            TRAINING_CATEGORIES.MMA,

        energyCost: 20,

        fatigue: 17,

        baseDevelopment: 1.35,

        attributes: [
            "fightIQ",
            "adaptability",
            "experience",
            "combinations",
            "wrestling",
            "jiuJitsu"
        ]
    },


    [TRAINING_TYPES.TECHNICAL]: {

        name: "Technical Training",

        category:
            TRAINING_CATEGORIES.TECHNICAL,

        energyCost: 10,

        fatigue: 6,

        baseDevelopment: 1.0,

        attributes: []
    },


    [TRAINING_TYPES.RECOVERY]: {

        name: "Active Recovery",

        category:
            TRAINING_CATEGORIES.RECOVERY,

        energyCost: 5,

        fatigue: -8,

        baseDevelopment: 0,

        attributes: []
    },


    [TRAINING_TYPES.REST]: {

        name: "Rest",

        category:
            TRAINING_CATEGORIES.RECOVERY,

        energyCost: 0,

        fatigue: -15,

        baseDevelopment: 0,

        attributes: []
    }
};


// ============================================================
// ESTADO PADRÃO DE TREINAMENTO
// ============================================================

export function createTrainingState(
    overrides = {}
) {

    return {

        energy:
            clamp(
                overrides.energy !== undefined
                    ? overrides.energy
                    : TRAINING_CONFIG.MAX_ENERGY
            ),

        fatigue:
            clamp(
                overrides.fatigue !== undefined
                    ? overrides.fatigue
                    : 0
            ),

        dailySessions:
            safeNumber(
                overrides.dailySessions
            ),

        weeklySessions:
            safeNumber(
                overrides.weeklySessions
            ),

        dailyLoad:
            safeNumber(
                overrides.dailyLoad
            ),

        weeklyLoad:
            safeNumber(
                overrides.weeklyLoad
            ),

        totalSessions:
            safeNumber(
                overrides.totalSessions
            ),

        totalTrainingHours:
            safeNumber(
                overrides.totalTrainingHours
            ),

        sessions:
            Array.isArray(
                overrides.sessions
            )
                ? [
                    ...overrides.sessions
                ]
                : [],

        weeklyPlan:
            Array.isArray(
                overrides.weeklyPlan
            )
                ? [
                    ...overrides.weeklyPlan
                ]
                : [],

        lastTrainingDate:
            overrides.lastTrainingDate ||
            null,

        lastRecoveryDate:
            overrides.lastRecoveryDate ||
            null
    };
}


// ============================================================
// OBTER DEFINIÇÃO
// ============================================================

export function getTrainingDefinition(
    trainingType
) {

    return (
        TRAINING_DEFINITIONS[
            trainingType
        ] ||
        null
    );
}


// ============================================================
// PODE TREINAR?
// ============================================================

export function canTrain(
    training,
    trainingType
) {

    if (!training) {
        return false;
    }


    const definition =
        getTrainingDefinition(
            trainingType
        );


    if (!definition) {
        return false;
    }


    if (
        training.energy <
        definition.energyCost
    ) {
        return false;
    }


    if (
        training.dailySessions >=
        TRAINING_CONFIG.MAX_SESSIONS_PER_DAY
    ) {
        return false;
    }


    if (
        training.fatigue >=
        TRAINING_CONFIG.CRITICAL_FATIGUE_THRESHOLD
    ) {

        return false;
    }


    return true;
}


// ============================================================
// CALCULAR CUSTO DE ENERGIA
// ============================================================

export function calculateEnergyCost(
    trainingType,
    context = {}
) {

    const definition =
        getTrainingDefinition(
            trainingType
        );


    if (!definition) {
        return 0;
    }


    let cost =
        definition.energyCost;


    // Camp aumenta exigência
    if (
        context.inCamp
    ) {

        cost *= 1.10;
    }


    // Intensidade
    if (
        context.intensity !== undefined
    ) {

        cost *=
            0.75 +
            (
                clamp(
                    context.intensity,
                    0,
                    100
                ) / 100
            ) *
            0.75;
    }


    return Math.round(
        cost
    );
}


// ============================================================
// CALCULAR FADIGA
// ============================================================

export function calculateFatigueGain(
    trainingType,
    context = {}
) {

    const definition =
        getTrainingDefinition(
            trainingType
        );


    if (!definition) {
        return 0;
    }


    let fatigue =
        definition.fatigue;


    if (
        context.intensity !== undefined
    ) {

        fatigue *=
            0.70 +
            (
                clamp(
                    context.intensity,
                    0,
                    100
                ) / 100
            ) *
            0.80;
    }


    if (
        context.inCamp
    ) {

        fatigue *= 1.10;
    }


    return Math.max(
        -20,
        Math.round(
            fatigue
        )
    );
}


// ============================================================
// MODIFICADOR DE PERSONALIDADE
// ============================================================

export function calculatePersonalityTrainingModifier(
    personality
) {

    if (!personality) {
        return 1;
    }


    const traits =
        personality.traits ||
        {};


    const discipline =
        clamp(
            traits.discipline ??
            50
        );


    const workEthic =
        clamp(
            traits.workEthic ??
            50
        );


    const professionalism =
        clamp(
            traits.professionalism ??
            50
        );


    const average =
        (
            discipline +
            workEthic +
            professionalism
        ) / 3;


    return (
        0.70 +
        (
            average / 100
        ) *
        0.60
    );
}


// ============================================================
// MODIFICADOR DE FADIGA
// ============================================================

export function calculateFatigueModifier(
    fatigue
) {

    const value =
        clamp(
            fatigue
        );


    if (
        value >= 90
    ) {

        return 0.25;
    }


    if (
        value >= 75
    ) {

        return 0.50;
    }


    if (
        value >= 60
    ) {

        return 0.75;
    }


    if (
        value >= 40
    ) {

        return 0.90;
    }


    return 1;
}


// ============================================================
// MODIFICADOR DE ENERGIA
// ============================================================

export function calculateEnergyModifier(
    energy
) {

    const value =
        clamp(
            energy
        );


    if (
        value <= 10
    ) {

        return 0.35;
    }


    if (
        value <= 25
    ) {

        return 0.55;
    }


    if (
        value <= 40
    ) {

        return 0.75;
    }


    if (
        value <= 60
    ) {

        return 0.90;
    }


    return 1;
}


// ============================================================
// MODIFICADOR DE SAÚDE
// ============================================================

export function calculateHealthTrainingModifier(
    health
) {

    if (!health) {
        return 1;
    }


    if (
        health.overall !== undefined
    ) {

        const value =
            clamp(
                health.overall
            );


        if (
            value <= 20
        ) {

            return 0.20;
        }


        if (
            value <= 40
        ) {

            return 0.50;
        }


        if (
            value <= 60
        ) {

            return 0.75;
        }


        if (
            value <= 80
        ) {

            return 0.90;
        }
    }


    return 1;
}


// ============================================================
// CALCULAR DESENVOLVIMENTO
// ============================================================

export function calculateDevelopment(
    trainingType,
    context = {}
) {

    const definition =
        getTrainingDefinition(
            trainingType
        );


    if (!definition) {
        return {
            total: 0,
            attributes: {}
        };
    }


    const personalityModifier =
        calculatePersonalityTrainingModifier(
            context.personality
        );


    const fatigueModifier =
        calculateFatigueModifier(
            context.fatigue
        );


    const energyModifier =
        calculateEnergyModifier(
            context.energy
        );


    const healthModifier =
        calculateHealthTrainingModifier(
            context.health
        );


    const potentialModifier =
        context.potentialModifier !== undefined
            ? clamp(
                context.potentialModifier,
                0,
                2
            )
            : 1;


    const ageModifier =
        context.ageModifier !== undefined
            ? clamp(
                context.ageModifier,
                0,
                2
            )
            : 1;


    const intensity =
        context.intensity !== undefined
            ? clamp(
                context.intensity,
                0,
                100
            ) / 100
            : 0.70;


    let total =
        definition.baseDevelopment *
        personalityModifier *
        fatigueModifier *
        energyModifier *
        healthModifier *
        potentialModifier *
        ageModifier *
        (
            0.60 +
            intensity * 0.60
        );


    // Diminishing returns quando há excesso
    if (
        context.weeklyLoad >
        TRAINING_CONFIG.MAX_WEEKLY_LOAD
    ) {

        total *= 0.60;
    }


    if (
        context.weeklyLoad >
        TRAINING_CONFIG.OVERTRAINING_THRESHOLD
    ) {

        total *= 0.80;
    }


    const attributes = {};


    if (
        definition.attributes.length
    ) {

        const perAttribute =
            total /
            definition.attributes.length;


        for (
            const attribute
            of definition.attributes
        ) {

            attributes[attribute] =
                Number(
                    perAttribute.toFixed(3)
                );
        }
    }


    return {

        total:
            Number(
                total.toFixed(3)
            ),

        attributes
    };
}


// ============================================================
// EXECUTAR TREINO
// ============================================================

export function performTraining(
    training,
    trainingType,
    context = {}
) {

    if (!training) {

        return {
            success: false,
            reason: "training_state_missing"
        };
    }


    const definition =
        getTrainingDefinition(
            trainingType
        );


    if (!definition) {

        return {
            success: false,
            reason: "unknown_training_type"
        };
    }


    if (
        !canTrain(
            training,
            trainingType
        )
    ) {

        return {
            success: false,
            reason: "cannot_train"
        };
    }


    const energyCost =
        calculateEnergyCost(
            trainingType,
            context
        );


    const fatigueGain =
        calculateFatigueGain(
            trainingType,
            context
        );


    const development =
        calculateDevelopment(
            trainingType,
            {
                ...context,

                energy:
                    training.energy,

                fatigue:
                    training.fatigue,

                weeklyLoad:
                    training.weeklyLoad
            }
        );


    training.energy =
        clamp(
            training.energy -
            energyCost
        );


    training.fatigue =
        clamp(
            training.fatigue +
            fatigueGain
        );


    training.dailySessions += 1;

    training.weeklySessions += 1;

    training.dailyLoad +=
        Math.max(
            0,
            fatigueGain
        );

    training.weeklyLoad +=
        Math.max(
            0,
            fatigueGain
        );

    training.totalSessions += 1;


    training.totalTrainingHours +=
        safeNumber(
            context.durationHours,
            1
        );


    const session = {

        id:
            generateId(),

        type:
            trainingType,

        name:
            definition.name,

        category:
            definition.category,

        energyCost,

        fatigueGain,

        development:
            development.total,

        attributes:
            development.attributes,

        intensity:
            context.intensity !== undefined
                ? clamp(
                    context.intensity
                )
                : 70,

        durationHours:
            safeNumber(
                context.durationHours,
                1
            ),

        date:
            context.date ||
            new Date().toISOString(),

        inCamp:
            Boolean(
                context.inCamp
            )
    };


    training.sessions.push(
        session
    );


    if (
        training.sessions.length > 200
    ) {

        training.sessions =
            training.sessions.slice(-200);
    }


    training.lastTrainingDate =
        session.date;


    return {

        success: true,

        session,

        energy:
            training.energy,

        fatigue:
            training.fatigue,

        development
    };
}


// ============================================================
// RECUPERAÇÃO
// ============================================================

export function recoverTraining(
    training,
    options = {}
) {

    if (!training) {
        return null;
    }


    const hours =
        Math.max(
            0,
            safeNumber(
                options.hours,
                8
            )
        );


    let recovery =
        (
            hours / 8
        ) *
        TRAINING_CONFIG.BASE_RECOVERY_PER_DAY;


    if (
        options.sleep
    ) {

        recovery +=
            TRAINING_CONFIG.SLEEP_RECOVERY_BONUS;
    }


    if (
        options.rest
    ) {

        recovery +=
            TRAINING_CONFIG.REST_RECOVERY_BONUS;
    }


    const recoveryModifier =
        options.recoveryModifier !== undefined
            ? Math.max(
                0,
                safeNumber(
                    options.recoveryModifier,
                    1
                )
            )
            : 1;


    recovery *=
        recoveryModifier;


    training.fatigue =
        clamp(
            training.fatigue -
            recovery
        );


    training.energy =
        clamp(
            training.energy +
            recovery
        );


    training.lastRecoveryDate =
        options.date ||
        new Date().toISOString();


    return {

        energy:
            training.energy,

        fatigue:
            training.fatigue,

        recovery:
            Number(
                recovery.toFixed(2)
            )
    };
}


// ============================================================
// RECUPERAÇÃO DIÁRIA
// ============================================================

export function recoverDay(
    training,
    options = {}
) {

    if (!training) {
        return null;
    }


    const result =
        recoverTraining(
            training,
            {
                ...options,

                hours:
                    options.hours ??
                    8
            }
        );


    training.dailySessions = 0;

    training.dailyLoad = 0;


    return result;
}


// ============================================================
// RESET SEMANAL
// ============================================================

export function resetTrainingWeek(
    training
) {

    if (!training) {
        return null;
    }


    const previousLoad =
        training.weeklyLoad;


    const previousSessions =
        training.weeklySessions;


    training.weeklyLoad = 0;

    training.weeklySessions = 0;


    return {

        previousLoad,

        previousSessions
    };
}


// ============================================================
// RESET DIÁRIO
// ============================================================

export function resetTrainingDay(
    training
) {

    if (!training) {
        return false;
    }


    training.dailySessions = 0;

    training.dailyLoad = 0;


    return true;
}


// ============================================================
// AVALIAR CARGA
// ============================================================

export function evaluateTrainingLoad(
    training
) {

    if (!training) {

        return {

            load: 0,

            status: "unknown",

            risk: 0
        };
    }


    const load =
        clamp(
            training.weeklyLoad
        );


    if (
        load >= 90
    ) {

        return {

            load,

            status: "overtraining",

            risk: 0.80
        };
    }


    if (
        load >= 75
    ) {

        return {

            load,

            status: "very_high",

            risk: 0.55
        };
    }


    if (
        load >= 55
    ) {

        return {

            load,

            status: "high",

            risk: 0.30
        };
    }


    if (
        load >= 30
    ) {

        return {

            load,

            status: "moderate",

            risk: 0.12
        };
    }


    return {

        load,

        status: "low",

        risk: 0.05
    };
}


// ============================================================
// AVALIAR ESTADO DO TREINO
// ============================================================

export function getTrainingStatus(
    training
) {

    if (!training) {
        return "unknown";
    }


    if (
        training.fatigue >=
        TRAINING_CONFIG.CRITICAL_FATIGUE_THRESHOLD
    ) {

        return "critical_fatigue";
    }


    if (
        training.fatigue >=
        TRAINING_CONFIG.HIGH_FATIGUE_THRESHOLD
    ) {

        return "high_fatigue";
    }


    if (
        training.energy <= 15
    ) {

        return "low_energy";
    }


    if (
        training.energy <= 35
    ) {

        return "moderate_energy";
    }


    return "ready";
}


// ============================================================
// CALCULAR RISCO DE OVERTRAINING
// ============================================================

export function calculateOvertrainingRisk(
    training
) {

    if (!training) {
        return 1;
    }


    const fatigue =
        clamp(
            training.fatigue
        );


    const weeklyLoad =
        clamp(
            training.weeklyLoad
        );


    let risk = 0;


    risk +=
        fatigue *
        0.004;


    risk +=
        weeklyLoad *
        0.003;


    if (
        fatigue >= 80
    ) {

        risk += 0.15;
    }


    if (
        weeklyLoad >= 80
    ) {

        risk += 0.15;
    }


    return Math.max(
        0,
        Math.min(
            0.95,
            risk
        )
    );
}


// ============================================================
// LIMPAR HISTÓRICO ANTIGO
// ============================================================

export function cleanupTrainingHistory(
    training,
    maxEntries = 200
) {

    if (
        !training ||
        !Array.isArray(
            training.sessions
        )
    ) {

        return false;
    }


    if (
        training.sessions.length >
        maxEntries
    ) {

        training.sessions =
            training.sessions.slice(
                -maxEntries
            );
    }


    return true;
}


// ============================================================
// CLONE
// ============================================================

export function cloneTrainingState(
    training
) {

    if (!training) {
        return null;
    }


    return JSON.parse(
        JSON.stringify(
            training
        )
    );
}


// ============================================================
// SNAPSHOT
// ============================================================

export function createTrainingSnapshot(
    training
) {

    if (!training) {
        return null;
    }


    const load =
        evaluateTrainingLoad(
            training
        );


    return {

        energy:
            training.energy,

        fatigue:
            training.fatigue,

        dailySessions:
            training.dailySessions,

        weeklySessions:
            training.weeklySessions,

        dailyLoad:
            training.dailyLoad,

        weeklyLoad:
            training.weeklyLoad,

        totalSessions:
            training.totalSessions,

        totalTrainingHours:
            training.totalTrainingHours,

        status:
            getTrainingStatus(
                training
            ),

        loadStatus:
            load.status,

        overtrainingRisk:
            calculateOvertrainingRisk(
                training
            )
    };
}


// ============================================================
// VALIDAÇÃO
// ============================================================

export function validateTrainingState(
    training
) {

    if (
        !training ||
        typeof training !== "object"
    ) {

        return false;
    }


    const numericFields = [

        "energy",

        "fatigue",

        "dailySessions",

        "weeklySessions",

        "dailyLoad",

        "weeklyLoad",

        "totalSessions",

        "totalTrainingHours"
    ];


    for (
        const field
        of numericFields
    ) {

        if (
            !Number.isFinite(
                Number(
                    training[field]
                )
            )
        ) {

            return false;
        }
    }


    if (
        !Array.isArray(
            training.sessions
        )
    ) {

        return false;
    }


    return true;
}


// ============================================================
// ESTADO PADRÃO
// ============================================================

export function createDefaultTrainingState() {

    return createTrainingState({

        energy: 100,

        fatigue: 0,

        dailySessions: 0,

        weeklySessions: 0,

        dailyLoad: 0,

        weeklyLoad: 0,

        totalSessions: 0,

        totalTrainingHours: 0,

        sessions: [],

        weeklyPlan: [],

        lastTrainingDate: null,

        lastRecoveryDate: null
    });
}


// ============================================================
// EXPORTAÇÃO PADRÃO
// ============================================================

export default {

    TRAINING_CONFIG,

    TRAINING_TYPES,

    TRAINING_CATEGORIES,

    TRAINING_DEFINITIONS,

    createTrainingState,

    createDefaultTrainingState,

    getTrainingDefinition,

    canTrain,

    calculateEnergyCost,

    calculateFatigueGain,

    calculatePersonalityTrainingModifier,

    calculateFatigueModifier,

    calculateEnergyModifier,

    calculateHealthTrainingModifier,

    calculateDevelopment,

    performTraining,

    recoverTraining,

    recoverDay,

    resetTrainingWeek,

    resetTrainingDay,

    evaluateTrainingLoad,

    getTrainingStatus,

    calculateOvertrainingRisk,

    cleanupTrainingHistory,

    cloneTrainingState,

    createTrainingSnapshot,

    validateTrainingState
};
