// ============================================================
// MMA LIFE DYNASTY
// js/mma/weightClasses.js
// ============================================================

import {
    WEIGHT_CLASSES
} from "../core/constants.js";

// ============================================================
// VERSION
// ============================================================

export const WEIGHT_CLASSES_VERSION = 1;

// ============================================================
// GENDER
// ============================================================

export const GENDERS = Object.freeze({
    MEN: "men",
    WOMEN: "women"
});

// ============================================================
// WEIGHT CLASS STATUS
// ============================================================

export const WEIGHT_CLASS_STATUS = Object.freeze({
    ACTIVE: "active",
    INACTIVE: "inactive",
    CUSTOM: "custom"
});

// ============================================================
// WEIGHT TYPES
// ============================================================

export const WEIGHT_TYPES = Object.freeze({
    NATURAL: "natural",
    WALKING: "walking",
    FIGHT: "fight",
    WEIGH_IN: "weigh_in",
    REHYDRATED: "rehydrated"
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

function clamp(value, min, max) {
    return Math.max(
        min,
        Math.min(max, safeNumber(value, min))
    );
}

function normalizeString(value) {
    return String(value || "")
        .trim()
        .toLowerCase();
}

function capitalize(value) {
    if (!value) {
        return "";
    }

    return String(value)
        .charAt(0)
        .toUpperCase() +
        String(value).slice(1);
}

function round(value, decimals = 2) {
    const multiplier =
        10 ** decimals;

    return Math.round(
        safeNumber(value) * multiplier
    ) / multiplier;
}

// ============================================================
// DEFAULT WEIGHT CLASSES
// ============================================================

const DEFAULT_MALE_CLASSES = Object.freeze([
    {
        id: "flyweight",
        name: "Flyweight",
        namePt: "Peso Mosca",
        limitKg: 56.7,
        championshipLimitKg: 56.7,
        gender: GENDERS.MEN,
        status: WEIGHT_CLASS_STATUS.ACTIVE
    },

    {
        id: "bantamweight",
        name: "Bantamweight",
        namePt: "Peso Galo",
        limitKg: 61.2,
        championshipLimitKg: 61.2,
        gender: GENDERS.MEN,
        status: WEIGHT_CLASS_STATUS.ACTIVE
    },

    {
        id: "featherweight",
        name: "Featherweight",
        namePt: "Peso Pena",
        limitKg: 65.8,
        championshipLimitKg: 65.8,
        gender: GENDERS.MEN,
        status: WEIGHT_CLASS_STATUS.ACTIVE
    },

    {
        id: "lightweight",
        name: "Lightweight",
        namePt: "Peso Leve",
        limitKg: 70.3,
        championshipLimitKg: 70.3,
        gender: GENDERS.MEN,
        status: WEIGHT_CLASS_STATUS.ACTIVE
    },

    {
        id: "welterweight",
        name: "Welterweight",
        namePt: "Peso Meio-Médio",
        limitKg: 77.1,
        championshipLimitKg: 77.1,
        gender: GENDERS.MEN,
        status: WEIGHT_CLASS_STATUS.ACTIVE
    },

    {
        id: "middleweight",
        name: "Middleweight",
        namePt: "Peso Médio",
        limitKg: 83.9,
        championshipLimitKg: 83.9,
        gender: GENDERS.MEN,
        status: WEIGHT_CLASS_STATUS.ACTIVE
    },

    {
        id: "light_heavyweight",
        name: "Light Heavyweight",
        namePt: "Peso Meio-Pesado",
        limitKg: 93.0,
        championshipLimitKg: 93.0,
        gender: GENDERS.MEN,
        status: WEIGHT_CLASS_STATUS.ACTIVE
    },

    {
        id: "heavyweight",
        name: "Heavyweight",
        namePt: "Peso Pesado",
        limitKg: 120.2,
        championshipLimitKg: 120.2,
        gender: GENDERS.MEN,
        status: WEIGHT_CLASS_STATUS.ACTIVE
    }
]);

const DEFAULT_FEMALE_CLASSES = Object.freeze([
    {
        id: "atomweight",
        name: "Atomweight",
        namePt: "Peso Átomo",
        limitKg: 47.6,
        championshipLimitKg: 47.6,
        gender: GENDERS.WOMEN,
        status: WEIGHT_CLASS_STATUS.ACTIVE
    },

    {
        id: "strawweight",
        name: "Strawweight",
        namePt: "Peso Palha",
        limitKg: 52.2,
        championshipLimitKg: 52.2,
        gender: GENDERS.WOMEN,
        status: WEIGHT_CLASS_STATUS.ACTIVE
    },

    {
        id: "flyweight",
        name: "Flyweight",
        namePt: "Peso Mosca",
        limitKg: 56.7,
        championshipLimitKg: 56.7,
        gender: GENDERS.WOMEN,
        status: WEIGHT_CLASS_STATUS.ACTIVE
    },

    {
        id: "bantamweight",
        name: "Bantamweight",
        namePt: "Peso Galo",
        limitKg: 61.2,
        championshipLimitKg: 61.2,
        gender: GENDERS.WOMEN,
        status: WEIGHT_CLASS_STATUS.ACTIVE
    },

    {
        id: "featherweight",
        name: "Featherweight",
        namePt: "Peso Pena",
        limitKg: 65.8,
        championshipLimitKg: 65.8,
        gender: GENDERS.WOMEN,
        status: WEIGHT_CLASS_STATUS.ACTIVE
    }
]);

// ============================================================
// BUILD WEIGHT CLASS DATABASE
// ============================================================

function buildClassesFromConstants() {
    const result = [];

    /*
     * O constants.js é a fonte principal.
     * Se houver algum problema no formato, usamos
     * os valores internos como fallback.
     */

    if (
        WEIGHT_CLASSES &&
        typeof WEIGHT_CLASSES === "object"
    ) {
        for (
            const [
                id,
                data
            ] of Object.entries(WEIGHT_CLASSES)
        ) {
            if (
                data &&
                typeof data === "object"
            ) {
                const limit =
                    safeNumber(
                        data.limitKg ??
                        data.limit ??
                        data.weight ??
                        data.maxKg,
                        null
                    );

                if (
                    limit !== null &&
                    limit > 0
                ) {
                    result.push({
                        id,
                        name:
                            data.name ||
                            capitalize(id),

                        namePt:
                            data.namePt ||
                            data.namePT ||
                            data.portuguese ||
                            capitalize(id),

                        limitKg:
                            limit,

                        championshipLimitKg:
                            safeNumber(
                                data.championshipLimitKg ??
                                data.championshipLimit ??
                                limit,
                                limit
                            ),

                        gender:
                            data.gender ||
                            null,

                        status:
                            data.status ||
                            WEIGHT_CLASS_STATUS.ACTIVE
                    });
                }
            } else {
                const limit =
                    safeNumber(
                        data,
                        null
                    );

                if (
                    limit !== null &&
                    limit > 0
                ) {
                    result.push({
                        id,

                        name:
                            capitalize(id),

                        namePt:
                            capitalize(id),

                        limitKg:
                            limit,

                        championshipLimitKg:
                            limit,

                        gender:
                            null,

                        status:
                            WEIGHT_CLASS_STATUS.ACTIVE
                    });
                }
            }
        }
    }

    return result;
}

function mergeDefaultClasses() {
    const constantsClasses =
        buildClassesFromConstants();

    if (
        constantsClasses.length === 0
    ) {
        return [
            ...DEFAULT_MALE_CLASSES,
            ...DEFAULT_FEMALE_CLASSES
        ];
    }

    const result = [];

    for (
        const defaultClass of [
            ...DEFAULT_MALE_CLASSES,
            ...DEFAULT_FEMALE_CLASSES
        ]
    ) {
        const existing =
            constantsClasses.find(
                item =>
                    normalizeString(item.id) ===
                    normalizeString(defaultClass.id)
            );

        if (existing) {
            result.push({
                ...defaultClass,
                ...existing
            });
        } else {
            result.push({
                ...defaultClass
            });
        }
    }

    /*
     * Mantém também classes adicionais
     * eventualmente existentes no constants.js.
     */
    for (
        const item of constantsClasses
    ) {
        const exists =
            result.some(
                existing =>
                    normalizeString(existing.id) ===
                    normalizeString(item.id) &&
                    normalizeString(existing.gender) ===
                    normalizeString(item.gender)
            );

        if (!exists) {
            result.push({
                ...item
            });
        }
    }

    return result;
}

export const WEIGHT_CLASS_DATABASE =
    Object.freeze(
        mergeDefaultClasses()
    );

// ============================================================
// GET ALL CLASSES
// ============================================================

export function getAllWeightClasses(
    options = {}
) {
    const {
        gender = null,
        activeOnly = true
    } = options;

    let classes = [
        ...WEIGHT_CLASS_DATABASE
    ];

    if (gender) {
        classes =
            classes.filter(
                weightClass =>
                    normalizeGender(
                        weightClass.gender
                    ) ===
                    normalizeGender(gender)
            );
    }

    if (activeOnly) {
        classes =
            classes.filter(
                weightClass =>
                    weightClass.status ===
                    WEIGHT_CLASS_STATUS.ACTIVE
            );
    }

    return classes.map(
        weightClass => ({
            ...weightClass
        })
    );
}

// ============================================================
// GENDER NORMALIZATION
// ============================================================

export function normalizeGender(
    gender
) {
    const value =
        normalizeString(gender);

    if (
        value === "male" ||
        value === "m" ||
        value === "men" ||
        value === "masculino" ||
        value === "homem"
    ) {
        return GENDERS.MEN;
    }

    if (
        value === "female" ||
        value === "f" ||
        value === "women" ||
        value === "feminino" ||
        value === "mulher"
    ) {
        return GENDERS.WOMEN;
    }

    return null;
}

// ============================================================
// FIND CLASS
// ============================================================

export function getWeightClass(
    weightClassId,
    gender = null
) {
    if (!weightClassId) {
        return null;
    }

    const target =
        normalizeString(weightClassId);

    const normalizedGender =
        normalizeGender(gender);

    let matches =
        WEIGHT_CLASS_DATABASE.filter(
            weightClass =>
                normalizeString(
                    weightClass.id
                ) === target ||
                normalizeString(
                    weightClass.name
                ) === target ||
                normalizeString(
                    weightClass.namePt
                ) === target
        );

    if (
        normalizedGender
    ) {
        const genderMatches =
            matches.filter(
                weightClass =>
                    normalizeGender(
                        weightClass.gender
                    ) === normalizedGender
            );

        if (
            genderMatches.length > 0
        ) {
            matches = genderMatches;
        }
    }

    return matches.length > 0
        ? {
            ...matches[0]
        }
        : null;
}

// ============================================================
// FIND CLASS BY WEIGHT
// ============================================================

export function getWeightClassByWeight(
    weightKg,
    gender = null
) {
    const weight =
        safeNumber(
            weightKg,
            null
        );

    if (
        weight === null ||
        weight <= 0
    ) {
        return null;
    }

    const classes =
        getAllWeightClasses({
            gender,
            activeOnly: true
        });

    for (
        const weightClass of classes
    ) {
        if (
            weight <=
            weightClass.limitKg
        ) {
            return weightClass;
        }
    }

    /*
     * Acima da última divisão:
     * considera Heavyweight quando disponível.
     */
    if (
        classes.length > 0
    ) {
        return classes[
            classes.length - 1
        ];
    }

    return null;
}

// ============================================================
// CLASS INDEX
// ============================================================

export function getWeightClassIndex(
    weightClassId,
    gender = null
) {
    const classes =
        getAllWeightClasses({
            gender
        });

    const target =
        normalizeString(
            weightClassId
        );

    return classes.findIndex(
        weightClass =>
            normalizeString(
                weightClass.id
            ) === target
    );
}

// ============================================================
// PREVIOUS / NEXT CLASS
// ============================================================

export function getPreviousWeightClass(
    weightClassId,
    gender = null
) {
    const classes =
        getAllWeightClasses({
            gender
        });

    const index =
        getWeightClassIndex(
            weightClassId,
            gender
        );

    if (
        index <= 0
    ) {
        return null;
    }

    return {
        ...classes[index - 1]
    };
}

export function getNextWeightClass(
    weightClassId,
    gender = null
) {
    const classes =
        getAllWeightClasses({
            gender
        });

    const index =
        getWeightClassIndex(
            weightClassId,
            gender
        );

    if (
        index < 0 ||
        index >=
            classes.length - 1
    ) {
        return null;
    }

    return {
        ...classes[index + 1]
    };
}

// ============================================================
// WEIGHT LIMITS
// ============================================================

export function getWeightLimit(
    weightClassId,
    options = {}
) {
    const weightClass =
        getWeightClass(
            weightClassId,
            options.gender
        );

    if (!weightClass) {
        return null;
    }

    if (
        options.championship === true
    ) {
        return weightClass
            .championshipLimitKg;
    }

    return weightClass.limitKg;
}

export function getChampionshipWeightLimit(
    weightClassId,
    gender = null
) {
    return getWeightLimit(
        weightClassId,
        {
            gender,
            championship: true
        }
    );
}

// ============================================================
// WEIGHT DIFFERENCE
// ============================================================

export function calculateWeightDifference(
    weightKg,
    weightClassId,
    options = {}
) {
    const limit =
        getWeightLimit(
            weightClassId,
            options
        );

    const weight =
        safeNumber(
            weightKg,
            null
        );

    if (
        limit === null ||
        weight === null
    ) {
        return null;
    }

    return round(
        weight - limit,
        2
    );
}

// ============================================================
// WEIGHT STATUS
// ============================================================

export function getWeightStatus(
    weightKg,
    weightClassId,
    options = {}
) {
    const weight =
        safeNumber(
            weightKg,
            null
        );

    const limit =
        getWeightLimit(
            weightClassId,
            options
        );

    if (
        weight === null ||
        limit === null
    ) {
        return {
            valid: false,
            status: "unknown",
            overweightKg: 0,
            underLimitKg: 0
        };
    }

    const difference =
        round(
            weight - limit,
            2
        );

    if (
        difference > 0
    ) {
        return {
            valid: false,
            status: "overweight",
            overweightKg:
                difference,
            underLimitKg: 0,
            limitKg: limit,
            weightKg: weight
        };
    }

    if (
        Math.abs(difference) <=
        0.05
    ) {
        return {
            valid: true,
            status: "on_limit",
            overweightKg: 0,
            underLimitKg: 0,
            limitKg: limit,
            weightKg: weight
        };
    }

    return {
        valid: true,
        status: "under_limit",
        overweightKg: 0,
        underLimitKg:
            round(
                Math.abs(difference),
                2
            ),
        limitKg: limit,
        weightKg: weight
    };
}

// ============================================================
// WEIGH-IN VALIDATION
// ============================================================

export function validateWeighIn(
    weightKg,
    weightClassId,
    options = {}
) {
    const {
        championship = false,
        allowanceKg = 0
    } = options;

    const limit =
        championship
            ? getChampionshipWeightLimit(
                weightClassId,
                options.gender
            )
            : getWeightLimit(
                weightClassId,
                options
            );

    const weight =
        safeNumber(
            weightKg,
            null
        );

    if (
        limit === null ||
        weight === null
    ) {
        return {
            valid: false,
            reason: "invalid_weight_or_class"
        };
    }

    const effectiveLimit =
        limit +
        Math.max(
            0,
            safeNumber(
                allowanceKg,
                0
            )
        );

    const overweight =
        Math.max(
            0,
            round(
                weight -
                effectiveLimit,
                2
            )
        );

    return {
        valid:
            overweight <= 0,

        weightKg:
            weight,

        limitKg:
            effectiveLimit,

        overweightKg:
            overweight,

        underLimitKg:
            Math.max(
                0,
                round(
                    effectiveLimit -
                    weight,
                    2
                )
            ),

        championship
    };
}

// ============================================================
// CATCHWEIGHT
// ============================================================

export function validateCatchweight(
    weightKg,
    agreedWeightKg
) {
    const weight =
        safeNumber(
            weightKg,
            null
        );

    const agreed =
        safeNumber(
            agreedWeightKg,
            null
        );

    if (
        weight === null ||
        agreed === null
    ) {
        return {
            valid: false,
            reason: "invalid_weight"
        };
    }

    return {
        valid:
            weight <= agreed,

        weightKg:
            weight,

        agreedWeightKg:
            agreed,

        differenceKg:
            round(
                weight - agreed,
                2
            )
    };
}

// ============================================================
// CLASS CHANGE
// ============================================================

export function canMoveWeightClass(
    currentClassId,
    targetClassId,
    gender = null
) {
    const current =
        getWeightClass(
            currentClassId,
            gender
        );

    const target =
        getWeightClass(
            targetClassId,
            gender
        );

    if (
        !current ||
        !target
    ) {
        return false;
    }

    return normalizeString(
        current.id
    ) !== normalizeString(
        target.id
    );
}

export function calculateClassDistance(
    currentClassId,
    targetClassId,
    gender = null
) {
    const currentIndex =
        getWeightClassIndex(
            currentClassId,
            gender
        );

    const targetIndex =
        getWeightClassIndex(
            targetClassId,
            gender
        );

    if (
        currentIndex < 0 ||
        targetIndex < 0
    ) {
        return null;
    }

    return Math.abs(
        targetIndex -
        currentIndex
    );
}

export function getClassMoveDirection(
    currentClassId,
    targetClassId,
    gender = null
) {
    const currentIndex =
        getWeightClassIndex(
            currentClassId,
            gender
        );

    const targetIndex =
        getWeightClassIndex(
            targetClassId,
            gender
        );

    if (
        currentIndex < 0 ||
        targetIndex < 0
    ) {
        return "unknown";
    }

    if (
        targetIndex >
        currentIndex
    ) {
        return "up";
    }

    if (
        targetIndex <
        currentIndex
    ) {
        return "down";
    }

    return "same";
}

// ============================================================
// WEIGHT REQUIRED FOR CLASS
// ============================================================

export function getWeightRequiredForClass(
    currentWeightKg,
    targetClassId,
    options = {}
) {
    const currentWeight =
        safeNumber(
            currentWeightKg,
            null
        );

    const targetLimit =
        getWeightLimit(
            targetClassId,
            options
        );

    if (
        currentWeight === null ||
        targetLimit === null
    ) {
        return null;
    }

    const difference =
        round(
            currentWeight -
            targetLimit,
            2
        );

    return {
        currentWeightKg:
            currentWeight,

        targetLimitKg:
            targetLimit,

        weightDifferenceKg:
            difference,

        weightToLoseKg:
            Math.max(
                0,
                difference
            ),

        weightToGainKg:
            Math.max(
                0,
                -difference
            ),

        alreadyEligible:
            difference <= 0
    };
}

// ============================================================
// SAFE WEIGHT CUT
// ============================================================

export function calculateSafeWeightCut(
    currentWeightKg,
    targetClassId,
    options = {}
) {
    const {
        weeklyLossPercent = 0.75
    } = options;

    const required =
        getWeightRequiredForClass(
            currentWeightKg,
            targetClassId,
            options
        );

    if (!required) {
        return null;
    }

    const currentWeight =
        required.currentWeightKg;

    const weeklyLoss =
        round(
            currentWeight *
            (
                safeNumber(
                    weeklyLossPercent,
                    0.75
                ) / 100
            ),
            2
        );

    const weeks =
        required.weightToLoseKg <= 0
            ? 0
            : Math.ceil(
                required.weightToLoseKg /
                Math.max(
                    weeklyLoss,
                    0.01
                )
            );

    return {
        ...required,

        weeklyLossPercent:
            safeNumber(
                weeklyLossPercent,
                0.75
            ),

        recommendedWeeklyLossKg:
            weeklyLoss,

        estimatedWeeks:
            weeks
    };
}

// ============================================================
// WEIGHT CLASS COMPATIBILITY
// ============================================================

export function areSameWeightClass(
    fighterA,
    fighterB
) {
    if (
        !fighterA ||
        !fighterB
    ) {
        return false;
    }

    const classA =
        fighterA?.physical?.weightClass ||
        fighterA?.weightClass ||
        fighterA?.career?.weightClass;

    const classB =
        fighterB?.physical?.weightClass ||
        fighterB?.weightClass ||
        fighterB?.career?.weightClass;

    if (
        !classA ||
        !classB
    ) {
        return false;
    }

    return normalizeString(classA) ===
        normalizeString(classB);
}

export function areWeightClassesCompatible(
    classA,
    classB,
    options = {}
) {
    const {
        allowAdjacent = false,
        gender = null
    } = options;

    const indexA =
        getWeightClassIndex(
            classA,
            gender
        );

    const indexB =
        getWeightClassIndex(
            classB,
            gender
        );

    if (
        indexA < 0 ||
        indexB < 0
    ) {
        return false;
    }

    if (
        indexA === indexB
    ) {
        return true;
    }

    if (
        allowAdjacent &&
        Math.abs(
            indexA - indexB
        ) === 1
    ) {
        return true;
    }

    return false;
}

// ============================================================
// FIGHT WEIGHT PROFILE
// ============================================================

export function createWeightProfile(
    options = {}
) {
    const {
        naturalWeightKg = 0,
        walkingWeightKg = naturalWeightKg,
        fightWeightKg = walkingWeightKg,
        rehydratedWeightKg = fightWeightKg,
        weightClass = null,
        gender = null
    } = options;

    return {
        naturalWeightKg:
            Math.max(
                0,
                safeNumber(
                    naturalWeightKg,
                    0
                )
            ),

        walkingWeightKg:
            Math.max(
                0,
                safeNumber(
                    walkingWeightKg,
                    naturalWeightKg
                )
            ),

        fightWeightKg:
            Math.max(
                0,
                safeNumber(
                    fightWeightKg,
                    walkingWeightKg
                )
            ),

        rehydratedWeightKg:
            Math.max(
                0,
                safeNumber(
                    rehydratedWeightKg,
                    fightWeightKg
                )
            ),

        weightClass,

        gender:
            normalizeGender(
                gender
            )
    };
}

// ============================================================
// WEIGHT DIFFERENCES IN PROFILE
// ============================================================

export function analyzeWeightProfile(
    profile
) {
    if (
        !profile ||
        typeof profile !== "object"
    ) {
        return null;
    }

    const natural =
        safeNumber(
            profile.naturalWeightKg,
            0
        );

    const walking =
        safeNumber(
            profile.walkingWeightKg,
            natural
        );

    const fight =
        safeNumber(
            profile.fightWeightKg,
            walking
        );

    const rehydrated =
        safeNumber(
            profile.rehydratedWeightKg,
            fight
        );

    return {
        naturalWeightKg:
            natural,

        walkingWeightKg:
            walking,

        fightWeightKg:
            fight,

        rehydratedWeightKg:
            rehydrated,

        naturalToFightCutKg:
            round(
                Math.max(
                    0,
                    natural - fight
                ),
                2
            ),

        walkingToFightCutKg:
            round(
                Math.max(
                    0,
                    walking - fight
                ),
                2
            ),

        fightToRehydratedKg:
            round(
                Math.max(
                    0,
                    rehydrated - fight
                ),
                2
            ),

        fightToRehydratedPercent:
            fight > 0
                ? round(
                    (
                        (
                            rehydrated -
                            fight
                        ) /
                        fight
                    ) *
                    100,
                    2
                )
                : 0
    };
}

// ============================================================
// WEIGHT CLASS SUMMARY
// ============================================================

export function getWeightClassSummary(
    weightClassId,
    gender = null
) {
    const weightClass =
        getWeightClass(
            weightClassId,
            gender
        );

    if (!weightClass) {
        return null;
    }

    const index =
        getWeightClassIndex(
            weightClass.id,
            gender
        );

    const previous =
        getPreviousWeightClass(
            weightClass.id,
            gender
        );

    const next =
        getNextWeightClass(
            weightClass.id,
            gender
        );

    return {
        ...weightClass,

        index,

        previousClass:
            previous,

        nextClass:
            next,

        minimumKg:
            previous
                ? previous.limitKg + 0.1
                : 0,

        maximumKg:
            weightClass.limitKg,

        championshipMaximumKg:
            weightClass
                .championshipLimitKg
    };
}

// ============================================================
// WEIGHT CLASS NAME
// ============================================================

export function getWeightClassName(
    weightClassId,
    language = "en",
    gender = null
) {
    const weightClass =
        getWeightClass(
            weightClassId,
            gender
        );

    if (!weightClass) {
        return null;
    }

    if (
        normalizeString(language) ===
        "pt-br" ||
        normalizeString(language) ===
        "pt" ||
        normalizeString(language) ===
        "portuguese"
    ) {
        return weightClass.namePt;
    }

    return weightClass.name;
}

// ============================================================
// WEIGHT CLASS ID FROM FIGHTER
// ============================================================

export function getFighterWeightClass(
    fighter
) {
    if (!fighter) {
        return null;
    }

    const weightClass =
        fighter?.physical?.weightClass ||
        fighter?.weightClass ||
        fighter?.career?.weightClass;

    const gender =
        fighter?.identity?.sex ||
        fighter?.sex ||
        fighter?.gender ||
        null;

    return getWeightClass(
        weightClass,
        gender
    );
}

// ============================================================
// AUTO ASSIGN WEIGHT CLASS
// ============================================================

export function assignWeightClassByWeight(
    fighter,
    options = {}
) {
    if (!fighter) {
        return null;
    }

    const weight =
        fighter?.physical?.weightKg ??
        fighter?.physical?.weight ??
        fighter?.weightKg ??
        fighter?.weight;

    const gender =
        options.gender ||
        fighter?.identity?.sex ||
        fighter?.sex ||
        fighter?.gender ||
        null;

    const weightClass =
        getWeightClassByWeight(
            weight,
            gender
        );

    if (!weightClass) {
        return null;
    }

    return {
        weightClassId:
            weightClass.id,

        weightClass:
            weightClass.name,

        weightClassNamePt:
            weightClass.namePt,

        limitKg:
            weightClass.limitKg,

        gender:
            weightClass.gender
    };
}

// ============================================================
// MOVE WEIGHT CLASS ANALYSIS
// ============================================================

export function analyzeWeightClassMove(
    currentClassId,
    targetClassId,
    currentWeightKg,
    options = {}
) {
    const current =
        getWeightClass(
            currentClassId,
            options.gender
        );

    const target =
        getWeightClass(
            targetClassId,
            options.gender
        );

    if (
        !current ||
        !target
    ) {
        return {
            valid: false,
            reason: "invalid_weight_class"
        };
    }

    const direction =
        getClassMoveDirection(
            current.id,
            target.id,
            options.gender
        );

    const distance =
        calculateClassDistance(
            current.id,
            target.id,
            options.gender
        );

    const required =
        getWeightRequiredForClass(
            currentWeightKg,
            target.id,
            options
        );

    return {
        valid:
            current.id !== target.id,

        currentClass:
            current,

        targetClass:
            target,

        direction,

        classDistance:
            distance,

        weight:
            required
    };
}

// ============================================================
// VALIDATE WEIGHT CLASS OBJECT
// ============================================================

export function validateWeightClass(
    weightClass
) {
    const errors = [];

    if (
        !weightClass ||
        typeof weightClass !== "object"
    ) {
        return {
            valid: false,
            errors: [
                "weight_class_missing"
            ]
        };
    }

    if (
        !weightClass.id
    ) {
        errors.push(
            "missing_id"
        );
    }

    if (
        !weightClass.name
    ) {
        errors.push(
            "missing_name"
        );
    }

    if (
        safeNumber(
            weightClass.limitKg,
            0
        ) <= 0
    ) {
        errors.push(
            "invalid_limit"
        );
    }

    if (
        safeNumber(
            weightClass
                .championshipLimitKg,
            0
        ) <= 0
    ) {
        errors.push(
            "invalid_championship_limit"
        );
    }

    if (
        safeNumber(
            weightClass
                .championshipLimitKg,
            0
        ) >
        safeNumber(
            weightClass.limitKg,
            0
        )
    ) {
        errors.push(
            "championship_limit_above_normal_limit"
        );
    }

    return {
        valid:
            errors.length === 0,

        errors
    };
}

// ============================================================
// VALIDATE DATABASE
// ============================================================

export function validateWeightClassDatabase() {
    const errors = [];
    const ids = new Set();

    for (
        const weightClass
        of WEIGHT_CLASS_DATABASE
    ) {
        const validation =
            validateWeightClass(
                weightClass
            );

        if (
            !validation.valid
        ) {
            errors.push({
                id:
                    weightClass?.id ||
                    null,

                errors:
                    validation.errors
            });
        }

        const key =
            `${normalizeString(
                weightClass.id
            )}:${normalizeString(
                weightClass.gender
            )}`;

        if (
            ids.has(key)
        ) {
            errors.push({
                id:
                    weightClass.id,

                errors: [
                    "duplicate_weight_class"
                ]
            });
        }

        ids.add(key);
    }

    return {
        valid:
            errors.length === 0,

        errors,

        total:
            WEIGHT_CLASS_DATABASE.length
    };
}

// ============================================================
// CLONE
// ============================================================

export function cloneWeightClass(
    weightClass
) {
    if (
        weightClass === null ||
        weightClass === undefined
    ) {
        return weightClass;
    }

    return JSON.parse(
        JSON.stringify(
            weightClass
        )
    );
}

// ============================================================
// SNAPSHOT
// ============================================================

export function getWeightClassSnapshot() {
    return {
        version:
            WEIGHT_CLASSES_VERSION,

        total:
            WEIGHT_CLASS_DATABASE.length,

        classes:
            WEIGHT_CLASS_DATABASE.map(
                weightClass => ({
                    ...weightClass
                })
            )
    };
}

// ============================================================
// EXPORTS
// ============================================================

export {
    DEFAULT_MALE_CLASSES,
    DEFAULT_FEMALE_CLASSES
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
    WEIGHT_CLASSES_VERSION,

    GENDERS,
    WEIGHT_CLASS_STATUS,
    WEIGHT_TYPES,

    WEIGHT_CLASS_DATABASE,

    getAllWeightClasses,
    normalizeGender,
    getWeightClass,
    getWeightClassByWeight,

    getWeightClassIndex,
    getPreviousWeightClass,
    getNextWeightClass,

    getWeightLimit,
    getChampionshipWeightLimit,

    calculateWeightDifference,
    getWeightStatus,
    validateWeighIn,
    validateCatchweight,

    canMoveWeightClass,
    calculateClassDistance,
    getClassMoveDirection,

    getWeightRequiredForClass,
    calculateSafeWeightCut,

    areSameWeightClass,
    areWeightClassesCompatible,

    createWeightProfile,
    analyzeWeightProfile,

    getWeightClassSummary,
    getWeightClassName,

    getFighterWeightClass,
    assignWeightClassByWeight,

    analyzeWeightClassMove,

    validateWeightClass,
    validateWeightClassDatabase,

    cloneWeightClass,
    getWeightClassSnapshot
};
