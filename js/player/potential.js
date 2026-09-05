import {
    ATTRIBUTE_MIN,
    ATTRIBUTE_MAX
} from "../core/constants.js";

import {
    ATTRIBUTE_GROUPS,
    ALL_ATTRIBUTES,
    getAttribute
} from "./attributes.js";


// ============================================================
// MMA LIFE DYNASTY
// PLAYER — POTENTIAL
// ============================================================
//
// POTENCIAL ≠ OVR
//
// OVR = nível atual do lutador.
//
// POTENCIAL = até onde ele pode chegar.
//
// Um lutador pode ter:
// OVR 45 / POTENCIAL 90
//
// ou:
//
// OVR 75 / POTENCIAL 78
//
// O potencial não aumenta automaticamente.
// Ele representa o teto de desenvolvimento.
// ============================================================


// ============================================================
// FAIXAS DE POTENCIAL
// ============================================================

export const POTENTIAL_TIERS = {

    RAW: {
        min: 1,
        max: 49,
        label: "Raw"
    },

    DEVELOPING: {
        min: 50,
        max: 64,
        label: "Developing"
    },

    PROSPECT: {
        min: 65,
        max: 74,
        label: "Prospect"
    },

    HIGH_PROSPECT: {
        min: 75,
        max: 84,
        label: "High Prospect"
    },

    ELITE_PROSPECT: {
        min: 85,
        max: 92,
        label: "Elite Prospect"
    },

    PRODIGY: {
        min: 93,
        max: 100,
        label: "Prodigy"
    }
};


// ============================================================
// POTENCIAL PADRÃO
// ============================================================

export const DEFAULT_POTENTIAL = 60;


// ============================================================
// CLAMP
// ============================================================

function clamp(
    value,
    min = ATTRIBUTE_MIN,
    max = ATTRIBUTE_MAX
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
// ALEATORIEDADE
// ============================================================

function randomInt(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;
}


// ============================================================
// GERAR POTENCIAL
// ============================================================
//
// Distribuição propositalmente desigual.
//
// A maioria dos lutadores será comum.
// Grandes prospects serão menos frequentes.
// Prodigies serão raríssimos.
// ============================================================

export function generatePotential() {

    const roll = Math.random();

    if (roll < 0.02) {
        return randomInt(93, 100);
    }

    if (roll < 0.07) {
        return randomInt(85, 92);
    }

    if (roll < 0.18) {
        return randomInt(75, 84);
    }

    if (roll < 0.38) {
        return randomInt(65, 74);
    }

    if (roll < 0.70) {
        return randomInt(50, 64);
    }

    return randomInt(30, 49);
}


// ============================================================
// CRIAR POTENCIAL
// ============================================================

export function createPotential(
    overrides = {}
) {

    const overall =
        overrides.overall !== undefined
            ? clamp(overrides.overall)
            : generatePotential();

    const potential = {

        overall,

        striking:
            overrides.striking !== undefined
                ? clamp(overrides.striking)
                : overall,

        grappling:
            overrides.grappling !== undefined
                ? clamp(overrides.grappling)
                : overall,

        physical:
            overrides.physical !== undefined
                ? clamp(overrides.physical)
                : overall,

        mental:
            overrides.mental !== undefined
                ? clamp(overrides.mental)
                : overall,

        attributes: {},

        hidden: Boolean(
            overrides.hidden
        ),

        discovered: !Boolean(
            overrides.hidden
        ),

        label:
            overrides.label ||
            getPotentialTier(overall).label
    };

    return potential;
}


// ============================================================
// POTENCIAL POR ATRIBUTO
// ============================================================
//
// Permite que um lutador tenha, por exemplo:
//
// Striking potencial 92
// Grappling potencial 67
//
// Isso cria lutadores muito diferentes entre si.
// ============================================================

export function generateAttributePotential(
    overallPotential
) {

    const result = {};

    for (
        const attribute
        of ALL_ATTRIBUTES
    ) {

        const variation =
            randomInt(-12, 8);

        result[attribute] =
            clamp(
                overallPotential +
                variation
            );
    }

    return result;
}


// ============================================================
// INICIALIZAR POTENCIAL COMPLETO
// ============================================================

export function initializePotential(
    potential = null
) {

    const base =
        potential
            ? {
                ...potential
            }
            : createPotential();

    if (
        !base.attributes ||
        Object.keys(base.attributes).length === 0
    ) {

        base.attributes =
            generateAttributePotential(
                base.overall
            );
    }

    base.overall =
        clamp(base.overall);

    base.striking =
        clamp(
            base.striking ||
            base.overall
        );

    base.grappling =
        clamp(
            base.grappling ||
            base.overall
        );

    base.physical =
        clamp(
            base.physical ||
            base.overall
        );

    base.mental =
        clamp(
            base.mental ||
            base.overall
        );

    base.label =
        getPotentialTier(
            base.overall
        ).label;

    return base;
}


// ============================================================
// TIER DO POTENCIAL
// ============================================================

export function getPotentialTier(
    potential
) {

    const value =
        clamp(potential);

    const tiers =
        Object.values(
            POTENTIAL_TIERS
        );

    for (
        const tier of tiers
    ) {

        if (
            value >= tier.min &&
            value <= tier.max
        ) {
            return tier;
        }
    }

    return POTENTIAL_TIERS.RAW;
}


// ============================================================
// NOME DO POTENCIAL
// ============================================================

export function getPotentialLabel(
    potential
) {

    return getPotentialTier(
        potential
    ).label;
}


// ============================================================
// É PRODÍGIO?
// ============================================================

export function isProdigy(
    potential
) {

    return (
        clamp(potential) >=
        POTENTIAL_TIERS.PRODIGY.min
    );
}


// ============================================================
// É ELITE PROSPECT?
// ============================================================

export function isEliteProspect(
    potential
) {

    return (
        clamp(potential) >=
        POTENTIAL_TIERS.ELITE_PROSPECT.min
    );
}


// ============================================================
// DIFERENÇA ENTRE OVR E POTENCIAL
// ============================================================

export function getDevelopmentRoom(
    currentOVR,
    potential
) {

    const current =
        clamp(currentOVR);

    const ceiling =
        clamp(potential);

    return Math.max(
        0,
        ceiling - current
    );
}


// ============================================================
// POTENCIAL RESTANTE
// ============================================================

export function getPotentialRemaining(
    currentValue,
    potentialValue
) {

    return Math.max(
        0,
        clamp(potentialValue) -
        clamp(currentValue)
    );
}


// ============================================================
// PODE EVOLUIR?
// ============================================================

export function canDevelop(
    currentValue,
    potentialValue
) {

    return (
        clamp(currentValue) <
        clamp(potentialValue)
    );
}


// ============================================================
// PERCENTUAL DE DESENVOLVIMENTO
// ============================================================

export function getDevelopmentPercentage(
    currentValue,
    potentialValue
) {

    const current =
        clamp(currentValue);

    const potential =
        clamp(potentialValue);

    if (potential <= 0) {
        return 100;
    }

    return Math.min(
        100,
        Math.round(
            (
                current /
                potential
            ) * 100
        )
    );
}


// ============================================================
// POTENCIAL DE UM GRUPO
// ============================================================

export function getGroupPotential(
    potential,
    group
) {

    if (
        !potential ||
        !ATTRIBUTE_GROUPS[group]
    ) {
        return 0;
    }

    if (
        potential[group] !== undefined
    ) {

        return clamp(
            potential[group]
        );
    }

    const attributes =
        ATTRIBUTE_GROUPS[group];

    if (!potential.attributes) {
        return clamp(
            potential.overall
        );
    }

    let total = 0;

    for (
        const attribute
        of attributes
    ) {

        total += clamp(
            potential.attributes[attribute] ??
            potential.overall
        );
    }

    return Math.round(
        total /
        attributes.length
    );
}


// ============================================================
// POTENCIAL DE UM ATRIBUTO
// ============================================================

export function getAttributePotential(
    potential,
    attribute
) {

    if (
        !potential ||
        !ALL_ATTRIBUTES.includes(attribute)
    ) {
        return 0;
    }

    if (
        potential.attributes &&
        potential.attributes[attribute] !== undefined
    ) {

        return clamp(
            potential.attributes[attribute]
        );
    }

    const group =
        Object.keys(
            ATTRIBUTE_GROUPS
        ).find(
            group =>
                ATTRIBUTE_GROUPS[group]
                    .includes(attribute)
        );

    if (group) {
        return getGroupPotential(
            potential,
            group
        );
    }

    return clamp(
        potential.overall
    );
}


// ============================================================
// LIMITAR ATRIBUTO AO POTENCIAL
// ============================================================

export function capAttributeAtPotential(
    currentValue,
    potentialValue
) {

    const current =
        clamp(currentValue);

    const potential =
        clamp(potentialValue);

    return Math.min(
        current,
        potential
    );
}


// ============================================================
// POTENCIAL VISÍVEL
// ============================================================
//
// Alguns lutadores terão potencial parcialmente oculto.
//
// O jogador pode descobrir mais através de:
// - treino
// - scouting
// - treinador
// - manager
// - lutas
// - idade
//
// A lógica de descoberta será expandida posteriormente.
// ============================================================

export function getVisiblePotential(
    potential
) {

    if (!potential) {
        return null;
    }

    if (!potential.hidden) {

        return {
            value: potential.overall,
            label: getPotentialLabel(
                potential.overall
            ),
            confidence: 1
        };
    }

    if (!potential.discovered) {

        return {
            value: null,
            label: "Unknown",
            confidence: 0
        };
    }

    return {
        value: potential.overall,
        label: getPotentialLabel(
            potential.overall
        ),
        confidence: 0.75
    };
}


// ============================================================
// DESCOBRIR POTENCIAL
// ============================================================

export function revealPotential(
    potential,
    accuracy = 1
) {

    if (!potential) {
        return null;
    }

    potential.discovered = true;

    const confidence =
        Math.max(
            0,
            Math.min(
                1,
                Number(accuracy)
            )
        );

    return {

        value: potential.overall,

        label:
            getPotentialLabel(
                potential.overall
            ),

        confidence
    };
}


// ============================================================
// AJUSTAR POTENCIAL
// ============================================================
//
// Potencial não deve ficar subindo toda hora.
//
// Essa função existe para eventos importantes:
// - diagnóstico de treinador
// - mudança de ambiente
// - descoberta de talento
// - desenvolvimento excepcional
// - queda rara de projeção
// ============================================================

export function adjustPotential(
    potential,
    amount
) {

    if (!potential) {
        return null;
    }

    const change =
        Number(amount);

    if (!Number.isFinite(change)) {
        return potential;
    }

    potential.overall =
        clamp(
            potential.overall +
            change
        );

    potential.striking =
        clamp(
            potential.striking +
            change
        );

    potential.grappling =
        clamp(
            potential.grappling +
            change
        );

    potential.physical =
        clamp(
            potential.physical +
            change
        );

    potential.mental =
        clamp(
            potential.mental +
            change
        );

    if (potential.attributes) {

        for (
            const attribute
            of ALL_ATTRIBUTES
        ) {

            potential.attributes[attribute] =
                clamp(
                    potential.attributes[attribute] +
                    change
                );
        }
    }

    potential.label =
        getPotentialLabel(
            potential.overall
        );

    return potential;
}


// ============================================================
// COMPARAR OVR COM POTENCIAL
// ============================================================

export function compareCurrentToPotential(
    attributes,
    potential
) {

    if (!attributes || !potential) {
        return null;
    }

    const result = {};

    for (
        const attribute
        of ALL_ATTRIBUTES
    ) {

        const current =
            getAttribute(
                attributes,
                attribute
            );

        const ceiling =
            getAttributePotential(
                potential,
                attribute
            );

        result[attribute] = {

            current,

            potential: ceiling,

            remaining:
                Math.max(
                    0,
                    ceiling - current
                ),

            percentage:
                getDevelopmentPercentage(
                    current,
                    ceiling
                )
        };
    }

    return result;
}


// ============================================================
// SNAPSHOT
// ============================================================

export function createPotentialSnapshot(
    potential
) {

    if (!potential) {
        return null;
    }

    const initialized =
        initializePotential(
            potential
        );

    return {

        overall:
            initialized.overall,

        label:
            getPotentialLabel(
                initialized.overall
            ),

        isProdigy:
            isProdigy(
                initialized.overall
            ),

        isEliteProspect:
            isEliteProspect(
                initialized.overall
            ),

        striking:
            getGroupPotential(
                initialized,
                "striking"
            ),

        grappling:
            getGroupPotential(
                initialized,
                "grappling"
            ),

        physical:
            getGroupPotential(
                initialized,
                "physical"
            ),

        mental:
            getGroupPotential(
                initialized,
                "mental"
            ),

        hidden:
            Boolean(
                initialized.hidden
            ),

        discovered:
            Boolean(
                initialized.discovered
            )
    };
}


// ============================================================
// EXPORTAÇÃO
// ============================================================

export default {

    POTENTIAL_TIERS,
    DEFAULT_POTENTIAL,

    generatePotential,
    createPotential,
    initializePotential,

    generateAttributePotential,

    getPotentialTier,
    getPotentialLabel,

    isProdigy,
    isEliteProspect,

    getDevelopmentRoom,
    getPotentialRemaining,
    canDevelop,
    getDevelopmentPercentage,

    getGroupPotential,
    getAttributePotential,

    capAttributeAtPotential,

    getVisiblePotential,
    revealPotential,

    adjustPotential,

    compareCurrentToPotential,

    createPotentialSnapshot
};
