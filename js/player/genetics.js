// ============================================================
// MMA LIFE DYNASTY
// PLAYER — GENETICS
// ============================================================
//
// Responsabilidade:
// - Criar genética individual
// - Representar predisposições naturais
// - Influenciar desenvolvimento futuro
// - Influenciar características físicas
// - Preparar herança genética da Dynasty
//
// IMPORTANTE:
// Genética NÃO é destino.
//
// Genética = predisposição.
// Treinamento + ambiente + experiência + personalidade
// também determinam o resultado da carreira.
// ============================================================


// ============================================================
// CATEGORIAS GENÉTICAS
// ============================================================

export const GENETIC_TRAITS = {

    physical: [
        "strengthPotential",
        "speedPotential",
        "explosivenessPotential",
        "cardioPotential",
        "endurancePotential",
        "durabilityPotential",
        "recoveryPotential"
    ],

    athletic: [
        "coordination",
        "reactionSpeed",
        "balance",
        "agility",
        "flexibility",
        "motorLearning"
    ],

    combat: [
        "powerExpression",
        "grapplingFeel",
        "strikingTiming",
        "distanceSense",
        "scrambleInstinct"
    ],

    health: [
        "injuryResistance",
        "boneStrength",
        "jointHealth",
        "concussionResistance",
        "healingRate"
    ]
};


// ============================================================
// TODAS AS CARACTERÍSTICAS
// ============================================================

export const ALL_GENETIC_TRAITS = [
    ...GENETIC_TRAITS.physical,
    ...GENETIC_TRAITS.athletic,
    ...GENETIC_TRAITS.combat,
    ...GENETIC_TRAITS.health
];


// ============================================================
// LIMITES
// ============================================================

const MIN_GENETIC_VALUE = 1;
const MAX_GENETIC_VALUE = 100;


// ============================================================
// CLAMP
// ============================================================

function clamp(
    value,
    min = MIN_GENETIC_VALUE,
    max = MAX_GENETIC_VALUE
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


// ============================================================
// NÚMERO SEGURO
// ============================================================

function safeNumber(
    value,
    fallback = 0
) {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}


// ============================================================
// ALEATÓRIO
// ============================================================

function randomInt(
    min,
    max
) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;
}


// ============================================================
// DISTRIBUIÇÃO GENÉTICA
// ============================================================
//
// A maioria ficará na faixa normal.
// Valores excepcionais serão raros.
//
// Isso evita que todo NPC seja geneticamente
// especial.
// ============================================================

function generateGeneticValue() {

    const roll = Math.random();

    if (roll < 0.02) {
        return randomInt(90, 100);
    }

    if (roll < 0.10) {
        return randomInt(80, 89);
    }

    if (roll < 0.30) {
        return randomInt(70, 79);
    }

    if (roll < 0.70) {
        return randomInt(45, 69);
    }

    if (roll < 0.92) {
        return randomInt(25, 44);
    }

    return randomInt(10, 24);
}


// ============================================================
// CRIAR GENÉTICA
// ============================================================

export function createGenetics(
    overrides = {}
) {

    const genetics = {

        id:
            overrides.id ||
            generateGeneticsId(),

        physical: {},

        athletic: {},

        combat: {},

        health: {},

        overall:
            overrides.overall !== undefined
                ? clamp(overrides.overall)
                : null,

        origin:
            overrides.origin ||
            "natural",

        inherited:
            Boolean(
                overrides.inherited
            ),

        parentIds:
            Array.isArray(
                overrides.parentIds
            )
                ? [...overrides.parentIds]
                : [],

        generation:
            Number.isFinite(
                overrides.generation
            )
                ? overrides.generation
                : 1
    };


    // --------------------------------------------------------
    // GERAR CARACTERÍSTICAS
    // --------------------------------------------------------

    for (
        const group of Object.keys(
            GENETIC_TRAITS
        )
    ) {

        for (
            const trait
            of GENETIC_TRAITS[group]
        ) {

            const groupOverrides =
                overrides[group] || {};

            genetics[group][trait] =
                groupOverrides[trait] !== undefined
                    ? clamp(
                        groupOverrides[trait]
                    )
                    : generateGeneticValue();
        }
    }


    // --------------------------------------------------------
    // CALCULAR OVERALL
    // --------------------------------------------------------

    if (
        overrides.overall === undefined
    ) {

        genetics.overall =
            calculateGeneticOverall(
                genetics
            );
    }


    return genetics;
}


// ============================================================
// ID GENÉTICO
// ============================================================

export function generateGeneticsId() {

    return (
        "gen_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );
}


// ============================================================
// VALIDAÇÃO
// ============================================================

export function isValidGeneticTrait(
    trait
) {

    return ALL_GENETIC_TRAITS.includes(
        trait
    );
}


// ============================================================
// OBTER CARACTERÍSTICA
// ============================================================

export function getGeneticTrait(
    genetics,
    trait
) {

    if (
        !genetics ||
        !isValidGeneticTrait(trait)
    ) {
        return 0;
    }

    for (
        const group of Object.keys(
            GENETIC_TRAITS
        )
    ) {

        if (
            GENETIC_TRAITS[group]
                .includes(trait)
        ) {

            return clamp(
                genetics[group]?.[trait] ?? 0
            );
        }
    }

    return 0;
}


// ============================================================
// DEFINIR CARACTERÍSTICA
// ============================================================

export function setGeneticTrait(
    genetics,
    trait,
    value
) {

    if (
        !genetics ||
        !isValidGeneticTrait(trait)
    ) {
        return false;
    }

    for (
        const group of Object.keys(
            GENETIC_TRAITS
        )
    ) {

        if (
            GENETIC_TRAITS[group]
                .includes(trait)
        ) {

            if (!genetics[group]) {
                genetics[group] = {};
            }

            genetics[group][trait] =
                clamp(value);

            genetics.overall =
                calculateGeneticOverall(
                    genetics
                );

            return true;
        }
    }

    return false;
}


// ============================================================
// MÉDIA DE GRUPO
// ============================================================

export function getGeneticGroupAverage(
    genetics,
    group
) {

    if (
        !genetics ||
        !GENETIC_TRAITS[group]
    ) {
        return 0;
    }

    const traits =
        GENETIC_TRAITS[group];

    if (!traits.length) {
        return 0;
    }

    let total = 0;

    for (
        const trait of traits
    ) {

        total += getGeneticTrait(
            genetics,
            trait
        );
    }

    return Number(
        (
            total /
            traits.length
        ).toFixed(2)
    );
}


// ============================================================
// OVERALL GENÉTICO
// ============================================================

export function calculateGeneticOverall(
    genetics
) {

    if (!genetics) {
        return 0;
    }

    const groups =
        Object.keys(
            GENETIC_TRAITS
        );

    if (!groups.length) {
        return 0;
    }

    let total = 0;

    for (
        const group of groups
    ) {

        total +=
            getGeneticGroupAverage(
                genetics,
                group
            );
    }

    return Math.round(
        total /
        groups.length
    );
}


// ============================================================
// CLASSIFICAÇÃO GENÉTICA
// ============================================================

export function getGeneticTier(
    value
) {

    const genetic =
        clamp(value);

    if (genetic >= 93) {
        return {
            id: "exceptional",
            label: "Exceptional",
            min: 93,
            max: 100
        };
    }

    if (genetic >= 85) {
        return {
            id: "elite",
            label: "Elite",
            min: 85,
            max: 92
        };
    }

    if (genetic >= 75) {
        return {
            id: "excellent",
            label: "Excellent",
            min: 75,
            max: 84
        };
    }

    if (genetic >= 60) {
        return {
            id: "above_average",
            label: "Above Average",
            min: 60,
            max: 74
        };
    }

    if (genetic >= 40) {
        return {
            id: "average",
            label: "Average",
            min: 40,
            max: 59
        };
    }

    if (genetic >= 25) {
        return {
            id: "below_average",
            label: "Below Average",
            min: 25,
            max: 39
        };
    }

    return {
        id: "poor",
        label: "Poor",
        min: 1,
        max: 24
    };
}


// ============================================================
// É GENETICAMENTE EXCEPCIONAL?
// ============================================================

export function isGeneticallyExceptional(
    genetics
) {

    if (!genetics) {
        return false;
    }

    return (
        calculateGeneticOverall(
            genetics
        ) >= 93
    );
}


// ============================================================
// MELHORES CARACTERÍSTICAS
// ============================================================

export function getTopGeneticTraits(
    genetics,
    amount = 5
) {

    if (!genetics) {
        return [];
    }

    const result = [];

    for (
        const trait
        of ALL_GENETIC_TRAITS
    ) {

        result.push({

            trait,

            value:
                getGeneticTrait(
                    genetics,
                    trait
                )
        });
    }

    return result
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
// CARACTERÍSTICAS MAIS FRACAS
// ============================================================

export function getLowestGeneticTraits(
    genetics,
    amount = 5
) {

    if (!genetics) {
        return [];
    }

    const result = [];

    for (
        const trait
        of ALL_GENETIC_TRAITS
    ) {

        result.push({

            trait,

            value:
                getGeneticTrait(
                    genetics,
                    trait
                )
        });
    }

    return result
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
// HERANÇA GENÉTICA
// ============================================================
//
// Cada característica do filho recebe uma combinação dos
// pais.
//
// Não é simplesmente a média.
//
// Existe:
// - contribuição do pai
// - contribuição da mãe
// - pequena variação
//
// Isso cria irmãos diferentes.
// ============================================================

export function inheritGenetics(
    parentA,
    parentB,
    options = {}
) {

    if (!parentA && !parentB) {
        return createGenetics();
    }

    if (!parentA) {
        return inheritFromSingleParent(
            parentB,
            options
        );
    }

    if (!parentB) {
        return inheritFromSingleParent(
            parentA,
            options
        );
    }

    const child = createGenetics({
        inherited: true,

        parentIds: [
            parentA.id || null,
            parentB.id || null
        ],

        generation:
            Math.max(
                Number(parentA.generation) || 1,
                Number(parentB.generation) || 1
            ) + 1,

        origin: "inherited"
    });


    for (
        const group of Object.keys(
            GENETIC_TRAITS
        )
    ) {

        for (
            const trait
            of GENETIC_TRAITS[group]
        ) {

            const valueA =
                getGeneticTrait(
                    parentA,
                    trait
                );

            const valueB =
                getGeneticTrait(
                    parentB,
                    trait
                );

            const mutation =
                Number.isFinite(
                    options.mutationRange
                )
                    ? options.mutationRange
                    : 6;

            const variation =
                randomInt(
                    -mutation,
                    mutation
                );

            const inheritedValue =
                (
                    valueA +
                    valueB
                ) / 2;

            child[group][trait] =
                clamp(
                    Math.round(
                        inheritedValue +
                        variation
                    )
                );
        }
    }


    child.overall =
        calculateGeneticOverall(
            child
        );

    return child;
}


// ============================================================
// HERANÇA DE UM ÚNICO PAI
// ============================================================

function inheritFromSingleParent(
    parent,
    options = {}
) {

    const mutation =
        Number.isFinite(
            options.mutationRange
        )
            ? options.mutationRange
            : 8;

    const child =
        createGenetics({
            inherited: true,

            parentIds: [
                parent?.id || null
            ],

            generation:
                (Number(parent?.generation) || 1) +
                1,

            origin:
                "single_parent_inheritance"
        });


    for (
        const group of Object.keys(
            GENETIC_TRAITS
        )
    ) {

        for (
            const trait
            of GENETIC_TRAITS[group]
        ) {

            const parentValue =
                getGeneticTrait(
                    parent,
                    trait
                );

            child[group][trait] =
                clamp(
                    parentValue +
                    randomInt(
                        -mutation,
                        mutation
                    )
                );
        }
    }


    child.overall =
        calculateGeneticOverall(
            child
        );

    return child;
}


// ============================================================
// COMPATIBILIDADE GENÉTICA
// ============================================================
//
// Não representa compatibilidade romântica.
// Representa apenas potencial de transmissão de
// determinadas características.
// ============================================================

export function calculateGeneticCompatibility(
    parentA,
    parentB
) {

    if (!parentA || !parentB) {
        return 0;
    }

    let totalDifference = 0;

    for (
        const trait
        of ALL_GENETIC_TRAITS
    ) {

        const a =
            getGeneticTrait(
                parentA,
                trait
            );

        const b =
            getGeneticTrait(
                parentB,
                trait
            );

        totalDifference +=
            Math.abs(a - b);
    }

    const maximumDifference =
        ALL_GENETIC_TRAITS.length *
        MAX_GENETIC_VALUE;

    const similarity =
        1 -
        (
            totalDifference /
            maximumDifference
        );

    return Math.round(
        Math.max(
            0,
            Math.min(
                1,
                similarity
            )
        ) * 100
    );
}


// ============================================================
// POTENCIAL DE DESENVOLVIMENTO FÍSICO
// ============================================================
//
// Esta função será utilizada futuramente pelo sistema
// de treino.
// ============================================================

export function getPhysicalDevelopmentModifier(
    genetics
) {

    if (!genetics) {
        return 1;
    }

    const physical =
        getGeneticGroupAverage(
            genetics,
            "physical"
        );

    return Number(
        (
            0.75 +
            (
                physical /
                100
            ) * 0.50
        ).toFixed(3)
    );
}


// ============================================================
// APRENDIZADO MOTOR
// ============================================================

export function getMotorLearningModifier(
    genetics
) {

    if (!genetics) {
        return 1;
    }

    const value =
        getGeneticTrait(
            genetics,
            "motorLearning"
        );

    return Number(
        (
            0.70 +
            (
                value /
                100
            ) * 0.60
        ).toFixed(3)
    );
}


// ============================================================
// RECUPERAÇÃO
// ============================================================

export function getRecoveryModifier(
    genetics
) {

    if (!genetics) {
        return 1;
    }

    const value =
        getGeneticTrait(
            genetics,
            "recoveryPotential"
        );

    return Number(
        (
            0.70 +
            (
                value /
                100
            ) * 0.60
        ).toFixed(3)
    );
}


// ============================================================
// RESISTÊNCIA A LESÕES
// ============================================================

export function getInjuryResistanceModifier(
    genetics
) {

    if (!genetics) {
        return 1;
    }

    const value =
        getGeneticTrait(
            genetics,
            "injuryResistance"
        );

    return Number(
        (
            0.70 +
            (
                value /
                100
            ) * 0.60
        ).toFixed(3)
    );
}


// ============================================================
// RESISTÊNCIA A CONCUSSÃO
// ============================================================

export function getConcussionResistanceModifier(
    genetics
) {

    if (!genetics) {
        return 1;
    }

    const value =
        getGeneticTrait(
            genetics,
            "concussionResistance"
        );

    return Number(
        (
            0.70 +
            (
                value /
                100
            ) * 0.60
        ).toFixed(3)
    );
}


// ============================================================
// CLONE
// ============================================================

export function cloneGenetics(
    genetics
) {

    if (!genetics) {
        return null;
    }

    return JSON.parse(
        JSON.stringify(
            genetics
        )
    );
}


// ============================================================
// SNAPSHOT
// ============================================================

export function createGeneticsSnapshot(
    genetics
) {

    if (!genetics) {
        return null;
    }

    return {

        id:
            genetics.id,

        overall:
            calculateGeneticOverall(
                genetics
            ),

        tier:
            getGeneticTier(
                calculateGeneticOverall(
                    genetics
                )
            ),

        inherited:
            Boolean(
                genetics.inherited
            ),

        parentIds:
            Array.isArray(
                genetics.parentIds
            )
                ? [
                    ...genetics.parentIds
                ]
                : [],

        generation:
            genetics.generation,

        physical:
            getGeneticGroupAverage(
                genetics,
                "physical"
            ),

        athletic:
            getGeneticGroupAverage(
                genetics,
                "athletic"
            ),

        combat:
            getGeneticGroupAverage(
                genetics,
                "combat"
            ),

        health:
            getGeneticGroupAverage(
                genetics,
                "health"
            ),

        topTraits:
            getTopGeneticTraits(
                genetics,
                5
            )
    };
}


// ============================================================
// EXPORTAÇÃO PADRÃO
// ============================================================

export default {

    GENETIC_TRAITS,
    ALL_GENETIC_TRAITS,

    createGenetics,
    generateGeneticsId,

    isValidGeneticTrait,
    getGeneticTrait,
    setGeneticTrait,

    getGeneticGroupAverage,
    calculateGeneticOverall,

    getGeneticTier,
    isGeneticallyExceptional,

    getTopGeneticTraits,
    getLowestGeneticTraits,

    inheritGenetics,
    calculateGeneticCompatibility,

    getPhysicalDevelopmentModifier,
    getMotorLearningModifier,
    getRecoveryModifier,
    getInjuryResistanceModifier,
    getConcussionResistanceModifier,

    cloneGenetics,
    createGeneticsSnapshot
};
