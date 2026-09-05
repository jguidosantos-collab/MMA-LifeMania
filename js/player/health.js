// ============================================================
// MMA LIFE DYNASTY
// PLAYER — HEALTH
// ============================================================
//
// Responsabilidade:
// - Saúde geral do lutador
// - Integridade física
// - Lesões
// - Recuperação
// - Histórico médico
// - Tratamentos
// - Risco de lesão
// - Consequências de longo prazo
//
// IMPORTANTE:
// Este módulo controla ESTADO DE SAÚDE.
//
// Ele não executa treinamento nem luta.
// Training Engine e Fight Engine utilizarão este módulo.
// ============================================================


// ============================================================
// LIMITES
// ============================================================

const MIN_VALUE = 0;
const MAX_VALUE = 100;


// ============================================================
// ESTADOS DE SAÚDE
// ============================================================

export const HEALTH_STATUS = {

    EXCELLENT: "excellent",
    GOOD: "good",
    NORMAL: "normal",
    WARNING: "warning",
    INJURED: "injured",
    CRITICAL: "critical"
};


// ============================================================
// SEVERIDADE DE LESÃO
// ============================================================

export const INJURY_SEVERITY = {

    MINOR: "minor",
    MODERATE: "moderate",
    SEVERE: "severe",
    CRITICAL: "critical"
};


// ============================================================
// PARTES DO CORPO
// ============================================================

export const BODY_PARTS = {

    HEAD: "head",
    NECK: "neck",

    BRAIN: "brain",

    NOSE: "nose",
    JAW: "jaw",

    SHOULDER_LEFT: "shoulder_left",
    SHOULDER_RIGHT: "shoulder_right",

    ELBOW_LEFT: "elbow_left",
    ELBOW_RIGHT: "elbow_right",

    WRIST_LEFT: "wrist_left",
    WRIST_RIGHT: "wrist_right",

    HAND_LEFT: "hand_left",
    HAND_RIGHT: "hand_right",

    RIBS: "ribs",
    BACK: "back",

    HIP: "hip",

    KNEE_LEFT: "knee_left",
    KNEE_RIGHT: "knee_right",

    ANKLE_LEFT: "ankle_left",
    ANKLE_RIGHT: "ankle_right",

    FOOT_LEFT: "foot_left",
    FOOT_RIGHT: "foot_right",

    MUSCLE: "muscle",

    SKIN: "skin",

    INTERNAL: "internal"
};


// ============================================================
// TIPOS DE LESÃO
// ============================================================

export const INJURY_TYPES = {

    CONCUSSION: "concussion",
    CUT: "cut",
    NOSE_INJURY: "nose_injury",
    JAW_INJURY: "jaw_injury",

    FRACTURE: "fracture",
    DISLOCATION: "dislocation",

    SPRAIN: "sprain",
    STRAIN: "strain",

    TENDON: "tendon",
    LIGAMENT: "ligament",

    MUSCLE: "muscle",

    CONTUSION: "contusion",

    HAND_INJURY: "hand_injury",
    WRIST_INJURY: "wrist_injury",

    SHOULDER_INJURY: "shoulder_injury",
    KNEE_INJURY: "knee_injury",

    ANKLE_INJURY: "ankle_injury",
    RIB_INJURY: "rib_injury",

    BACK_INJURY: "back_injury",

    OVERTRAINING: "overtraining",
    CHRONIC_DAMAGE: "chronic_damage"
};


// ============================================================
// STATUS DE LESÃO
// ============================================================

export const INJURY_STATUS = {

    ACTIVE: "active",
    RECOVERING: "recovering",
    HEALED: "healed",
    CHRONIC: "chronic"
};


// ============================================================
// UTILITÁRIOS
// ============================================================

function clamp(
    value,
    min = MIN_VALUE,
    max = MAX_VALUE
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


function generateId(
    prefix = "inj"
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
// STATUS DA SAÚDE
// ============================================================

export function getHealthStatus(
    health
) {

    const value =
        clamp(
            health
        );


    if (value >= 90) {
        return HEALTH_STATUS.EXCELLENT;
    }

    if (value >= 75) {
        return HEALTH_STATUS.GOOD;
    }

    if (value >= 55) {
        return HEALTH_STATUS.NORMAL;
    }

    if (value >= 30) {
        return HEALTH_STATUS.WARNING;
    }

    if (value >= 10) {
        return HEALTH_STATUS.INJURED;
    }

    return HEALTH_STATUS.CRITICAL;
}


// ============================================================
// CRIAR LESÃO
// ============================================================

export function createInjury(
    options = {}
) {

    const severity =
        options.severity ||
        INJURY_SEVERITY.MINOR;


    const defaultRecovery = {

        [INJURY_SEVERITY.MINOR]: 1,
        [INJURY_SEVERITY.MODERATE]: 3,
        [INJURY_SEVERITY.SEVERE]: 8,
        [INJURY_SEVERITY.CRITICAL]: 16
    };


    const recoveryWeeks =
        Math.max(
            1,
            safeNumber(
                options.recoveryWeeks,
                defaultRecovery[severity] || 1
            )
        );


    return {

        id:
            options.id ||
            generateId(),

        type:
            options.type ||
            INJURY_TYPES.CONTUSION,

        bodyPart:
            options.bodyPart ||
            BODY_PARTS.MUSCLE,

        severity,

        status:
            options.status ||
            INJURY_STATUS.ACTIVE,

        title:
            options.title ||
            "Unknown Injury",

        description:
            options.description ||
            "",

        occurredDate:
            options.occurredDate ||
            null,

        expectedRecoveryWeeks:
            recoveryWeeks,

        remainingWeeks:
            safeNumber(
                options.remainingWeeks,
                recoveryWeeks
            ),

        pain:
            clamp(
                options.pain !== undefined
                    ? options.pain
                    : severity === INJURY_SEVERITY.CRITICAL
                        ? 90
                        : severity === INJURY_SEVERITY.SEVERE
                            ? 70
                            : severity === INJURY_SEVERITY.MODERATE
                                ? 45
                                : 20
            ),

        mobilityImpact:
            clamp(
                options.mobilityImpact !== undefined
                    ? options.mobilityImpact
                    : severity === INJURY_SEVERITY.CRITICAL
                        ? 80
                        : severity === INJURY_SEVERITY.SEVERE
                            ? 60
                            : severity === INJURY_SEVERITY.MODERATE
                                ? 35
                                : 10
            ),

        trainingImpact:
            clamp(
                options.trainingImpact !== undefined
                    ? options.trainingImpact
                    : severity === INJURY_SEVERITY.CRITICAL
                        ? 90
                        : severity === INJURY_SEVERITY.SEVERE
                            ? 70
                            : severity === INJURY_SEVERITY.MODERATE
                                ? 40
                                : 15
            ),

        fightImpact:
            clamp(
                options.fightImpact !== undefined
                    ? options.fightImpact
                    : severity === INJURY_SEVERITY.CRITICAL
                        ? 90
                        : severity === INJURY_SEVERITY.SEVERE
                            ? 65
                            : severity === INJURY_SEVERITY.MODERATE
                                ? 35
                                : 10
            ),

        permanent:
            Boolean(
                options.permanent
            ),

        chronic:
            Boolean(
                options.chronic
            ),

        treated:
            Boolean(
                options.treated
            ),

        treatment:
            options.treatment ||
            null,

        treatmentCost:
            Math.max(
                0,
                safeNumber(
                    options.treatmentCost
                )
            ),

        medicalNotes:
            Array.isArray(
                options.medicalNotes
            )
                ? [
                    ...options.medicalNotes
                ]
                : [],

        healedDate:
            options.healedDate ||
            null,

        createdAt:
            options.createdAt ||
            new Date().toISOString()
    };
}


// ============================================================
// CRIAR ESTADO DE SAÚDE
// ============================================================

export function createHealth(
    overrides = {}
) {

    const health = {

        overall:
            clamp(
                overrides.overall !== undefined
                    ? overrides.overall
                    : 100
            ),

        physicalCondition:
            clamp(
                overrides.physicalCondition !== undefined
                    ? overrides.physicalCondition
                    : 100
            ),

        durability:
            clamp(
                overrides.durability !== undefined
                    ? overrides.durability
                    : 70
            ),

        recovery:
            clamp(
                overrides.recovery !== undefined
                    ? overrides.recovery
                    : 70
            ),

        injuryResistance:
            clamp(
                overrides.injuryResistance !== undefined
                    ? overrides.injuryResistance
                    : 70
            ),

        concussionResistance:
            clamp(
                overrides.concussionResistance !== undefined
                    ? overrides.concussionResistance
                    : 70
            ),

        healingRate:
            clamp(
                overrides.healingRate !== undefined
                    ? overrides.healingRate
                    : 70
            ),

        activeInjuries:
            Array.isArray(
                overrides.activeInjuries
            )
                ? overrides.activeInjuries.map(
                    injury =>
                        createInjury(
                            injury
                        )
                )
                : [],

        injuryHistory:
            Array.isArray(
                overrides.injuryHistory
            )
                ? overrides.injuryHistory.map(
                    injury =>
                        createInjury(
                            injury
                        )
                )
                : [],

        chronicInjuries:
            Array.isArray(
                overrides.chronicInjuries
            )
                ? overrides.chronicInjuries.map(
                    injury =>
                        createInjury(
                            injury
                        )
                )
                : [],

        medicalHistory:
            Array.isArray(
                overrides.medicalHistory
            )
                ? [
                    ...overrides.medicalHistory
                ]
                : [],

        surgeries:
            Array.isArray(
                overrides.surgeries
            )
                ? [
                    ...overrides.surgeries
                ]
                : [],

        suspensions:
            Array.isArray(
                overrides.suspensions
            )
                ? [
                    ...overrides.suspensions
                ]
                : [],

        lastMedicalCheck:
            overrides.lastMedicalCheck ||
            null,

        currentTreatment:
            overrides.currentTreatment ||
            null,

        healthNotes:
            Array.isArray(
                overrides.healthNotes
            )
                ? [
                    ...overrides.healthNotes
                ]
                : []
    };


    recalculateHealth(
        health
    );


    return health;
}


// ============================================================
// RECALCULAR SAÚDE
// ============================================================

export function recalculateHealth(
    health
) {

    if (!health) {
        return null;
    }


    const injuryPenalty =
        getActiveInjuryPenalty(
            health
        );


    const physical =
        clamp(
            health.physicalCondition
        );


    const durability =
        clamp(
            health.durability
        );


    const recovery =
        clamp(
            health.recovery
        );


    const base =
        (
            physical * 0.45 +
            durability * 0.25 +
            recovery * 0.15 +
            health.injuryResistance * 0.15
        );


    health.overall =
        Math.round(
            clamp(
                base -
                injuryPenalty
            )
        );


    return health;
}


// ============================================================
// PENALIDADE DAS LESÕES
// ============================================================

export function getActiveInjuryPenalty(
    health
) {

    if (
        !health ||
        !Array.isArray(
            health.activeInjuries
        )
    ) {
        return 0;
    }


    let penalty = 0;


    for (
        const injury
        of health.activeInjuries
    ) {

        const severityMultiplier = {

            [INJURY_SEVERITY.MINOR]: 0.10,

            [INJURY_SEVERITY.MODERATE]: 0.25,

            [INJURY_SEVERITY.SEVERE]: 0.45,

            [INJURY_SEVERITY.CRITICAL]: 0.70

        };


        const multiplier =
            severityMultiplier[
                injury.severity
            ] || 0.10;


        penalty +=
            injury.trainingImpact *
            multiplier;
    }


    return Math.min(
        80,
        penalty
    );
}


// ============================================================
// ADICIONAR LESÃO
// ============================================================

export function addInjury(
    health,
    injuryOptions = {}
) {

    if (!health) {
        return null;
    }


    const injury =
        createInjury(
            injuryOptions
        );


    health.activeInjuries.push(
        injury
    );


    health.medicalHistory.push({

        id:
            generateId("medical"),

        type:
            "injury",

        injuryId:
            injury.id,

        date:
            injury.occurredDate ||
            new Date().toISOString(),

        description:
            injury.title
    });


    if (
        health.medicalHistory.length > 200
    ) {

        health.medicalHistory =
            health.medicalHistory.slice(-200);
    }


    recalculateHealth(
        health
    );


    return injury;
}


// ============================================================
// BUSCAR LESÃO
// ============================================================

export function getInjury(
    health,
    injuryId
) {

    if (!health) {
        return null;
    }


    return (
        health.activeInjuries
            ?.find(
                injury =>
                    injury.id === injuryId
            ) ||
        health.injuryHistory
            ?.find(
                injury =>
                    injury.id === injuryId
            ) ||
        health.chronicInjuries
            ?.find(
                injury =>
                    injury.id === injuryId
            ) ||
        null
    );
}


// ============================================================
// EXISTE LESÃO ATIVA
// ============================================================

export function hasActiveInjury(
    health
) {

    return Boolean(
        health &&
        Array.isArray(
            health.activeInjuries
        ) &&
        health.activeInjuries.length
    );
}


// ============================================================
// CONTAR LESÕES
// ============================================================

export function getActiveInjuryCount(
    health
) {

    if (!health) {
        return 0;
    }


    return Array.isArray(
        health.activeInjuries
    )
        ? health.activeInjuries.length
        : 0;
}


// ============================================================
// MAIOR SEVERIDADE ATIVA
// ============================================================

export function getHighestActiveInjurySeverity(
    health
) {

    if (
        !health ||
        !health.activeInjuries?.length
    ) {

        return null;
    }


    const priority = {

        [INJURY_SEVERITY.MINOR]: 1,

        [INJURY_SEVERITY.MODERATE]: 2,

        [INJURY_SEVERITY.SEVERE]: 3,

        [INJURY_SEVERITY.CRITICAL]: 4
    };


    let highest =
        null;


    for (
        const injury
        of health.activeInjuries
    ) {

        if (
            !highest ||
            (
                priority[injury.severity] || 0
            ) >
            (
                priority[highest.severity] || 0
            )
        ) {

            highest =
                injury;
        }
    }


    return highest;
}


// ============================================================
// REDUZIR RECUPERAÇÃO
// ============================================================

export function progressRecovery(
    health,
    weeks = 1
) {

    if (!health) {
        return [];
    }


    const recovered = [];

    const recoveryWeeks =
        Math.max(
            1,
            safeNumber(
                weeks,
                1
            )
        );


    const healingBonus =
        1 +
        (
            clamp(
                health.healingRate
            ) / 100
        );


    for (
        let i = 0;
        i < recoveryWeeks;
        i++
    ) {

        for (
            const injury
            of health.activeInjuries
        ) {

            if (
                injury.status ===
                INJURY_STATUS.ACTIVE
            ) {

                injury.status =
                    INJURY_STATUS.RECOVERING;
            }


            injury.remainingWeeks =
                Math.max(
                    0,
                    injury.remainingWeeks -
                    healingBonus
                );


            injury.pain =
                clamp(
                    injury.pain -
                    (
                        5 *
                        healingBonus
                    )
                );


            injury.trainingImpact =
                clamp(
                    injury.trainingImpact -
                    (
                        5 *
                        healingBonus
                    )
                );


            injury.fightImpact =
                clamp(
                    injury.fightImpact -
                    (
                        4 *
                        healingBonus
                    )
                );
        }
    }


    const stillActive = [];


    for (
        const injury
        of health.activeInjuries
    ) {

        if (
            injury.remainingWeeks <= 0 &&
            !injury.permanent
        ) {

            injury.status =
                injury.chronic
                    ? INJURY_STATUS.CHRONIC
                    : INJURY_STATUS.HEALED;


            injury.healedDate =
                new Date().toISOString();


            if (
                injury.chronic
            ) {

                health.chronicInjuries.push(
                    injury
                );

            } else {

                health.injuryHistory.push(
                    injury
                );
            }


            recovered.push(
                injury
            );

        } else {

            stillActive.push(
                injury
            );
        }
    }


    health.activeInjuries =
        stillActive;


    recalculateHealth(
        health
    );


    return recovered;
}


// ============================================================
// CURAR LESÃO
// ============================================================

export function healInjury(
    health,
    injuryId
) {

    if (!health) {
        return false;
    }


    const index =
        health.activeInjuries.findIndex(
            injury =>
                injury.id === injuryId
        );


    if (index === -1) {
        return false;
    }


    const injury =
        health.activeInjuries[
            index
        ];


    injury.status =
        INJURY_STATUS.HEALED;


    injury.remainingWeeks =
        0;


    injury.pain =
        0;


    injury.trainingImpact =
        0;


    injury.fightImpact =
        0;


    injury.healedDate =
        new Date().toISOString();


    health.injuryHistory.push(
        injury
    );


    health.activeInjuries.splice(
        index,
        1
    );


    recalculateHealth(
        health
    );


    return true;
}


// ============================================================
// TRATAMENTO
// ============================================================

export function applyTreatment(
    health,
    injuryId,
    treatment = {}
) {

    if (!health) {
        return false;
    }


    const injury =
        getInjury(
            health,
            injuryId
        );


    if (!injury) {
        return false;
    }


    injury.treated =
        true;


    injury.treatment =
        treatment.name ||
        "Medical Treatment";


    injury.treatmentCost =
        Math.max(
            0,
            safeNumber(
                treatment.cost
            )
        );


    injury.medicalNotes.push({

        date:
            new Date().toISOString(),

        treatment:
            injury.treatment,

        note:
            treatment.note ||
            ""
    });


    health.currentTreatment = {

        injuryId,

        name:
            injury.treatment,

        startedAt:
            new Date().toISOString(),

        cost:
            injury.treatmentCost
    };


    return true;
}


// ============================================================
// IMPACTO NO TREINO
// ============================================================

export function getTrainingHealthModifier(
    health
) {

    if (!health) {
        return 0.5;
    }


    const overall =
        clamp(
            health.overall
        );


    const penalty =
        getActiveInjuryPenalty(
            health
        );


    return Math.max(
        0.05,
        Math.min(
            1,
            (
                overall / 100
            ) *
            (
                1 -
                penalty / 150
            )
        )
    );
}


// ============================================================
// IMPACTO NA LUTA
// ============================================================

export function getFightHealthModifier(
    health
) {

    if (!health) {
        return 0.5;
    }


    const overall =
        clamp(
            health.overall
        );


    const penalty =
        getActiveInjuryPenalty(
            health
        );


    return Math.max(
        0.05,
        Math.min(
            1,
            (
                overall / 100
            ) *
            (
                1 -
                penalty / 120
            )
        )
    );
}


// ============================================================
// RISCO DE LESÃO
// ============================================================

export function calculateInjuryRisk(
    health,
    fatigue = 0,
    trainingLoad = 0
) {

    if (!health) {
        return 1;
    }


    const fatigueValue =
        clamp(
            fatigue
        );


    const load =
        clamp(
            trainingLoad
        );


    const resistance =
        clamp(
            health.injuryResistance
        );


    let risk = 0.05;


    risk +=
        fatigueValue *
        0.004;


    risk +=
        load *
        0.003;


    risk +=
        (
            100 -
            resistance
        ) *
        0.002;


    if (
        health.activeInjuries?.length
    ) {

        risk +=
            health.activeInjuries.length *
            0.025;
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
// APLICAR DESGASTE FÍSICO
// ============================================================

export function applyPhysicalWear(
    health,
    amount
) {

    if (!health) {
        return false;
    }


    const value =
        Math.abs(
            safeNumber(
                amount
            )
        );


    health.physicalCondition =
        clamp(
            health.physicalCondition -
            value
        );


    recalculateHealth(
        health
    );


    return true;
}


// ============================================================
// RECUPERAR CONDIÇÃO FÍSICA
// ============================================================

export function recoverPhysicalCondition(
    health,
    amount
) {

    if (!health) {
        return false;
    }


    const value =
        Math.abs(
            safeNumber(
                amount
            )
        );


    health.physicalCondition =
        clamp(
            health.physicalCondition +
            value
        );


    recalculateHealth(
        health
    );


    return true;
}


// ============================================================
// CHECK MÉDICO
// ============================================================

export function performMedicalCheck(
    health,
    notes = ""
) {

    if (!health) {
        return null;
    }


    const result = {

        date:
            new Date().toISOString(),

        overall:
            health.overall,

        status:
            getHealthStatus(
                health.overall
            ),

        activeInjuries:
            health.activeInjuries.length,

        highestSeverity:
            getHighestActiveInjurySeverity(
                health
            )?.severity ||
            null,

        notes
    };


    health.lastMedicalCheck =
        result;


    health.medicalHistory.push({

        id:
            generateId("check"),

        type:
            "medical_check",

        date:
            result.date,

        status:
            result.status,

        notes
    });


    return result;
}


// ============================================================
// PODE LUTAR?
// ============================================================

export function canFight(
    health
) {

    if (!health) {
        return false;
    }


    if (
        health.overall < 40
    ) {
        return false;
    }


    for (
        const injury
        of health.activeInjuries
    ) {

        if (
            injury.severity ===
            INJURY_SEVERITY.CRITICAL
        ) {

            return false;
        }


        if (
            injury.fightImpact >= 75
        ) {

            return false;
        }
    }


    return true;
}


// ============================================================
// PODE TREINAR?
// ============================================================

export function canTrain(
    health
) {

    if (!health) {
        return false;
    }


    if (
        health.overall < 20
    ) {
        return false;
    }


    for (
        const injury
        of health.activeInjuries
    ) {

        if (
            injury.trainingImpact >= 90
        ) {

            return false;
        }
    }


    return true;
}


// ============================================================
// HISTÓRICO DE LESÕES
// ============================================================

export function getInjuryHistory(
    health
) {

    if (!health) {
        return [];
    }


    return [
        ...(health.injuryHistory || []),
        ...(health.chronicInjuries || [])
    ];
}


// ============================================================
// CONTAGEM DE LESÕES
// ============================================================

export function getTotalInjuryCount(
    health
) {

    return getInjuryHistory(
        health
    ).length;
}


// ============================================================
// CLONE
// ============================================================

export function cloneHealth(
    health
) {

    if (!health) {
        return null;
    }


    return JSON.parse(
        JSON.stringify(
            health
        )
    );
}


// ============================================================
// SNAPSHOT
// ============================================================

export function createHealthSnapshot(
    health
) {

    if (!health) {
        return null;
    }


    return {

        overall:
            health.overall,

        status:
            getHealthStatus(
                health.overall
            ),

        physicalCondition:
            health.physicalCondition,

        durability:
            health.durability,

        recovery:
            health.recovery,

        injuryResistance:
            health.injuryResistance,

        concussionResistance:
            health.concussionResistance,

        healingRate:
            health.healingRate,

        activeInjuries:
            health.activeInjuries.length,

        totalInjuries:
            getTotalInjuryCount(
                health
            ),

        chronicInjuries:
            health.chronicInjuries.length,

        canFight:
            canFight(
                health
            ),

        canTrain:
            canTrain(
                health
            )
    };
}


// ============================================================
// VALIDAÇÃO
// ============================================================

export function validateHealth(
    health
) {

    if (
        !health ||
        typeof health !== "object"
    ) {
        return false;
    }


    const numericFields = [

        "overall",
        "physicalCondition",
        "durability",
        "recovery",
        "injuryResistance",
        "concussionResistance",
        "healingRate"
    ];


    for (
        const field
        of numericFields
    ) {

        if (
            !Number.isFinite(
                Number(
                    health[field]
                )
            )
        ) {

            return false;
        }
    }


    if (
        !Array.isArray(
            health.activeInjuries
        )
    ) {

        return false;
    }


    if (
        !Array.isArray(
            health.injuryHistory
        )
    ) {

        return false;
    }


    return true;
}


// ============================================================
// SAÚDE PADRÃO
// ============================================================

export function createDefaultHealth() {

    return createHealth({

        overall: 100,

        physicalCondition: 100,

        durability: 70,

        recovery: 70,

        injuryResistance: 70,

        concussionResistance: 70,

        healingRate: 70,

        activeInjuries: [],

        injuryHistory: [],

        chronicInjuries: [],

        medicalHistory: [],

        surgeries: [],

        suspensions: [],

        currentTreatment: null
    });
}


// ============================================================
// EXPORTAÇÃO PADRÃO
// ============================================================

export default {

    HEALTH_STATUS,

    INJURY_SEVERITY,

    BODY_PARTS,

    INJURY_TYPES,

    INJURY_STATUS,

    createInjury,

    createHealth,

    createDefaultHealth,

    getHealthStatus,

    recalculateHealth,

    getActiveInjuryPenalty,

    addInjury,

    getInjury,

    hasActiveInjury,

    getActiveInjuryCount,

    getHighestActiveInjurySeverity,

    progressRecovery,

    healInjury,

    applyTreatment,

    getTrainingHealthModifier,

    getFightHealthModifier,

    calculateInjuryRisk,

    applyPhysicalWear,

    recoverPhysicalCondition,

    performMedicalCheck,

    canFight,

    canTrain,

    getInjuryHistory,

    getTotalInjuryCount,

    cloneHealth,

    createHealthSnapshot,

    validateHealth
};
