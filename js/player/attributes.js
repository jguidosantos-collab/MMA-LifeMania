import {
    ATTRIBUTE_MIN,
    ATTRIBUTE_MAX,
    STARTING_ATTRIBUTE_MIN,
    STARTING_ATTRIBUTE_MAX
} from "../core/constants.js";


// ============================================================
// MMA LIFE DYNASTY
// PLAYER — ATTRIBUTES
// ============================================================
//
// Responsabilidade deste módulo:
// - Criar atributos
// - Validar atributos
// - Calcular OVR
// - Calcular médias por área
// - Evoluir/reduzir atributos
// - Fornecer snapshots
//
// IMPORTANTE:
// Potencial, genética, personalidade e treinamento serão
// tratados em módulos próprios.
// ============================================================


// ============================================================
// LISTA DE ATRIBUTOS
// ============================================================

export const ATTRIBUTE_GROUPS = {

    striking: [
        "jab",
        "cross",
        "hook",
        "uppercut",
        "kicks",
        "knees",
        "elbows",
        "combinations",
        "precision",
        "power",
        "standupDefense"
    ],

    grappling: [
        "wrestling",
        "takedown",
        "takedownDefense",
        "control",
        "groundAndPound",
        "jiujitsu",
        "submissions",
        "submissionDefense",
        "scramble"
    ],

    physical: [
        "strength",
        "speed",
        "explosiveness",
        "cardio",
        "endurance",
        "durability",
        "recovery"
    ],

    mental: [
        "fightIQ",
        "discipline",
        "courage",
        "focus",
        "emotionalControl",
        "aggression",
        "adaptability",
        "experience"
    ]
};


export const ALL_ATTRIBUTES = [
    ...ATTRIBUTE_GROUPS.striking,
    ...ATTRIBUTE_GROUPS.grappling,
    ...ATTRIBUTE_GROUPS.physical,
    ...ATTRIBUTE_GROUPS.mental
];


// ============================================================
// NOMES DOS ATRIBUTOS
// ============================================================

export const ATTRIBUTE_LABELS = {

    // Striking
    jab: "Jab",
    cross: "Cross",
    hook: "Hook",
    uppercut: "Uppercut",
    kicks: "Kicks",
    knees: "Knees",
    elbows: "Elbows",
    combinations: "Combinations",
    precision: "Precision",
    power: "Power",
    standupDefense: "Stand-up Defense",

    // Grappling
    wrestling: "Wrestling",
    takedown: "Takedowns",
    takedownDefense: "Takedown Defense",
    control: "Control",
    groundAndPound: "Ground & Pound",
    jiujitsu: "Jiu-Jitsu",
    submissions: "Submissions",
    submissionDefense: "Submission Defense",
    scramble: "Scrambles",

    // Physical
    strength: "Strength",
    speed: "Speed",
    explosiveness: "Explosiveness",
    cardio: "Cardio",
    endurance: "Endurance",
    durability: "Durability",
    recovery: "Recovery",

    // Mental
    fightIQ: "Fight IQ",
    discipline: "Discipline",
    courage: "Courage",
    focus: "Focus",
    emotionalControl: "Emotional Control",
    aggression: "Aggression",
    adaptability: "Adaptability",
    experience: "Experience"
};


// ============================================================
// PESOS PARA OVR
// ============================================================
//
// O OVR não é simplesmente a média de todos os atributos.
//
// Algumas características possuem maior impacto no MMA.
//
// Esses pesos poderão ser refinados posteriormente pelo
// Fight Engine.
// ============================================================

export const OVR_WEIGHTS = {

    striking: 0.30,
    grappling: 0.30,
    physical: 0.20,
    mental: 0.20
};


// ============================================================
// CLAMP
// ============================================================

function clamp(
    value,
    min = ATTRIBUTE_MIN,
    max = ATTRIBUTE_MAX
) {
    return Math.max(
        min,
        Math.min(max, Number(value))
    );
}


// ============================================================
// NÚMERO SEGURO
// ============================================================

function safeNumber(value, fallback = 0) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return fallback;
    }

    return number;
}


// ============================================================
// ATRIBUTO ALEATÓRIO INICIAL
// ============================================================

function randomStartingAttribute() {

    const min =
        Number.isFinite(STARTING_ATTRIBUTE_MIN)
            ? STARTING_ATTRIBUTE_MIN
            : 20;

    const max =
        Number.isFinite(STARTING_ATTRIBUTE_MAX)
            ? STARTING_ATTRIBUTE_MAX
            : 70;

    return Math.round(
        min + Math.random() * (max - min)
    );
}


// ============================================================
// CRIAR OBJETO DE ATRIBUTOS
// ============================================================

export function createDefaultAttributes(
    startingValue = null
) {

    const attributes = {};

    for (const attribute of ALL_ATTRIBUTES) {

        if (startingValue !== null) {

            attributes[attribute] = clamp(
                startingValue
            );

        } else {

            attributes[attribute] =
                randomStartingAttribute();
        }
    }

    return attributes;
}


// ============================================================
// CRIAR ATRIBUTOS PERSONALIZADOS
// ============================================================

export function createAttributes(
    overrides = {}
) {

    const attributes =
        createDefaultAttributes();

    for (const attribute of ALL_ATTRIBUTES) {

        if (
            Object.prototype.hasOwnProperty.call(
                overrides,
                attribute
            )
        ) {

            attributes[attribute] =
                clamp(
                    safeNumber(
                        overrides[attribute],
                        attributes[attribute]
                    )
                );
        }
    }

    return attributes;
}


// ============================================================
// VALIDAR ATRIBUTO
// ============================================================

export function isValidAttribute(
    attribute
) {
    return ALL_ATTRIBUTES.includes(attribute);
}


// ============================================================
// OBTER ATRIBUTO
// ============================================================

export function getAttribute(
    attributes,
    attribute
) {

    if (
        !attributes ||
        !isValidAttribute(attribute)
    ) {
        return 0;
    }

    return clamp(
        safeNumber(
            attributes[attribute],
            0
        )
    );
}


// ============================================================
// DEFINIR ATRIBUTO
// ============================================================

export function setAttribute(
    attributes,
    attribute,
    value
) {

    if (
        !attributes ||
        !isValidAttribute(attribute)
    ) {
        return false;
    }

    attributes[attribute] =
        clamp(
            safeNumber(
                value,
                attributes[attribute] || 0
            )
        );

    return true;
}


// ============================================================
// AUMENTAR ATRIBUTO
// ============================================================

export function increaseAttribute(
    attributes,
    attribute,
    amount
) {

    if (
        !attributes ||
        !isValidAttribute(attribute)
    ) {
        return false;
    }

    const current =
        getAttribute(
            attributes,
            attribute
        );

    const increase =
        safeNumber(amount, 0);

    attributes[attribute] =
        clamp(
            current + increase
        );

    return true;
}


// ============================================================
// REDUZIR ATRIBUTO
// ============================================================

export function decreaseAttribute(
    attributes,
    attribute,
    amount
) {

    if (
        !attributes ||
        !isValidAttribute(attribute)
    ) {
        return false;
    }

    const current =
        getAttribute(
            attributes,
            attribute
        );

    const decrease =
        safeNumber(amount, 0);

    attributes[attribute] =
        clamp(
            current - decrease
        );

    return true;
}


// ============================================================
// MÉDIA DE UM GRUPO
// ============================================================

export function getGroupAverage(
    attributes,
    group
) {

    if (
        !attributes ||
        !ATTRIBUTE_GROUPS[group]
    ) {
        return 0;
    }

    const groupAttributes =
        ATTRIBUTE_GROUPS[group];

    if (!groupAttributes.length) {
        return 0;
    }

    let total = 0;

    for (
        const attribute
        of groupAttributes
    ) {

        total += getAttribute(
            attributes,
            attribute
        );
    }

    return Number(
        (
            total /
            groupAttributes.length
        ).toFixed(2)
    );
}


// ============================================================
// MÉDIA DE STRIKING
// ============================================================

export function getStrikingRating(
    attributes
) {
    return getGroupAverage(
        attributes,
        "striking"
    );
}


// ============================================================
// MÉDIA DE GRAPPLING
// ============================================================

export function getGrapplingRating(
    attributes
) {
    return getGroupAverage(
        attributes,
        "grappling"
    );
}


// ============================================================
// MÉDIA FÍSICA
// ============================================================

export function getPhysicalRating(
    attributes
) {
    return getGroupAverage(
        attributes,
        "physical"
    );
}


// ============================================================
// MÉDIA MENTAL
// ============================================================

export function getMentalRating(
    attributes
) {
    return getGroupAverage(
        attributes,
        "mental"
    );
}


// ============================================================
// OVR
// ============================================================

export function calculateOVR(
    attributes
) {

    if (!attributes) {
        return 0;
    }

    const striking =
        getStrikingRating(attributes);

    const grappling =
        getGrapplingRating(attributes);

    const physical =
        getPhysicalRating(attributes);

    const mental =
        getMentalRating(attributes);

    const ovr =
        striking * OVR_WEIGHTS.striking +
        grappling * OVR_WEIGHTS.grappling +
        physical * OVR_WEIGHTS.physical +
        mental * OVR_WEIGHTS.mental;

    return Math.round(
        ovr
    );
}


// ============================================================
// OVR DETALHADO
// ============================================================

export function getOVRBreakdown(
    attributes
) {

    const striking =
        getStrikingRating(attributes);

    const grappling =
        getGrapplingRating(attributes);

    const physical =
        getPhysicalRating(attributes);

    const mental =
        getMentalRating(attributes);

    const overall =
        calculateOVR(attributes);

    return {

        overall,

        striking: Math.round(
            striking
        ),

        grappling: Math.round(
            grappling
        ),

        physical: Math.round(
            physical
        ),

        mental: Math.round(
            mental
        )
    };
}


// ============================================================
// MELHORES ATRIBUTOS
// ============================================================

export function getTopAttributes(
    attributes,
    amount = 5
) {

    if (!attributes) {
        return [];
    }

    return ALL_ATTRIBUTES
        .map(attribute => ({
            attribute,
            value: getAttribute(
                attributes,
                attribute
            )
        }))
        .sort(
            (a, b) =>
                b.value - a.value
        )
        .slice(
            0,
            Math.max(0, amount)
        );
}


// ============================================================
// PIORES ATRIBUTOS
// ============================================================

export function getLowestAttributes(
    attributes,
    amount = 5
) {

    if (!attributes) {
        return [];
    }

    return ALL_ATTRIBUTES
        .map(attribute => ({
            attribute,
            value: getAttribute(
                attributes,
                attribute
            )
        }))
        .sort(
            (a, b) =>
                a.value - b.value
        )
        .slice(
            0,
            Math.max(0, amount)
        );
}


// ============================================================
// SOMA TOTAL
// ============================================================

export function getTotalAttributes(
    attributes
) {

    if (!attributes) {
        return 0;
    }

    return ALL_ATTRIBUTES.reduce(
        (total, attribute) => {

            return (
                total +
                getAttribute(
                    attributes,
                    attribute
                )
            );

        },
        0
    );
}


// ============================================================
// MÉDIA GERAL
// ============================================================

export function getOverallAverage(
    attributes
) {

    if (!attributes) {
        return 0;
    }

    return Number(
        (
            getTotalAttributes(attributes) /
            ALL_ATTRIBUTES.length
        ).toFixed(2)
    );
}


// ============================================================
// APLICAR ALTERAÇÕES
// ============================================================

export function applyAttributeChanges(
    attributes,
    changes = {}
) {

    if (!attributes) {
        return null;
    }

    for (
        const attribute of Object.keys(changes)
    ) {

        if (
            !isValidAttribute(attribute)
        ) {
            continue;
        }

        const amount =
            safeNumber(
                changes[attribute],
                0
            );

        increaseAttribute(
            attributes,
            attribute,
            amount
        );
    }

    return attributes;
}


// ============================================================
// COPIAR ATRIBUTOS
// ============================================================

export function cloneAttributes(
    attributes
) {

    if (!attributes) {
        return null;
    }

    const clone = {};

    for (
        const attribute of ALL_ATTRIBUTES
    ) {

        clone[attribute] =
            getAttribute(
                attributes,
                attribute
            );
    }

    return clone;
}


// ============================================================
// SNAPSHOT
// ============================================================

export function createAttributeSnapshot(
    attributes
) {

    if (!attributes) {
        return null;
    }

    return {

        values:
            cloneAttributes(
                attributes
            ),

        ratings: {

            striking:
                getStrikingRating(
                    attributes
                ),

            grappling:
                getGrapplingRating(
                    attributes
                ),

            physical:
                getPhysicalRating(
                    attributes
                ),

            mental:
                getMentalRating(
                    attributes
                ),

            overall:
                calculateOVR(
                    attributes
                )
        },

        topAttributes:
            getTopAttributes(
                attributes,
                5
            ),

        lowestAttributes:
            getLowestAttributes(
                attributes,
                5
            )
    };
}


// ============================================================
// EXPORTAÇÃO PADRÃO
// ============================================================

export default {

    ATTRIBUTE_GROUPS,
    ATTRIBUTE_LABELS,
    ALL_ATTRIBUTES,
    OVR_WEIGHTS,

    createDefaultAttributes,
    createAttributes,

    isValidAttribute,
    getAttribute,
    setAttribute,

    increaseAttribute,
    decreaseAttribute,

    getGroupAverage,

    getStrikingRating,
    getGrapplingRating,
    getPhysicalRating,
    getMentalRating,

    calculateOVR,
    getOVRBreakdown,

    getTopAttributes,
    getLowestAttributes,

    getTotalAttributes,
    getOverallAverage,

    applyAttributeChanges,
    cloneAttributes,
    createAttributeSnapshot
};
